# 08 — Arsitektur Twitter/X Scale: Deep Dive System Design

> **Estimasi:** 2-3 jam | **Level:** Advanced
> **Sumber:** [donnemartin/system-design-primer — Twitter Solution](https://github.com/donnemartin/system-design-primer/tree/master/solutions/system_design/twitter)
> **Referensi Tambahan:** [Twitter Engineering Blog](https://blog.twitter.com/engineering), [InfoQ Twitter Architecture](https://www.infoq.com/articles/twitter-architecture/)

---

## 📋 DAFTAR ISI

1. [Requirements Analysis](#1-requirements-analysis)
2. [Capacity Estimation & Back-of-Envelope](#2-capacity-estimation--back-of-the-envelope)
3. [API Design](#3-api-design)
4. [High-Level Architecture](#4-high-level-architecture)
5. [Timeline Generation — 3 Strategies Deep Dive](#5-timeline-generation--3-strategies-deep-dive)
6. [User Graph Service](#6-user-graph-service)
7. [Tweet Storage & Partitioning](#7-tweet-storage--partitioning)
8. [Media Pipeline](#8-media-pipeline)
9. [Notification System](#9-notification-system)
10. [Trending Algorithm](#10-trending-algorithm)
11. [Analytics & Metrics](#11-analytics--metrics)
12. [Scaling Roadmap](#12-scaling-roadmap)
13. [Failure Handling & Resilience](#13-failure-handling--resilience)
14. [Monitoring & Observability](#14-monitoring--observability)

---

## 1. REQUIREMENTS ANALYSIS

### 1.1 Functional Requirements

Twitter adalah platform microblogging dengan fitur inti berikut:

| Fitur | Deskripsi | Read/Write |
|-------|-----------|------------|
| **Tweet** | User memposting pesan hingga 280 karakter | Write |
| **Retweet** | User membagikan tweet orang lain ke timeline-nya | Write |
| **Follow** | User mengikuti user lain untuk melihat tweet-nya | Write |
| **Timeline** | User melihat kumpulan tweet dari orang yang di-follow | Read (heavy) |
| **Like/Favorite** | User menyukai tweet | Write |
| **Reply** | User membalas tweet (thread) | Write |
| **Search** | User mencari tweet berdasarkan keyword | Read |
| **Profile** | Melihat profil user dan tweet-nya | Read |
| **Notification** | Notifikasi real-time untuk interaksi | Read/Write |
| **Trending** | Topik yang sedang trending | Read |

**Prioritas fitur berdasarkan traffic:**
```
Timeline Read     → 80% dari total request (READ HEAVY)
Tweet Write       → 10% dari total request
Follow/Like       → 5% dari total request
Search/Other      → 5% dari total request
```

### 1.2 Non-Functional Requirements

| Requirement | Target | Alasan |
|-------------|--------|--------|
| **Latency Timeline** | < 200ms p95 | User experience, scroll harus smooth |
| **Latency Tweet** | < 500ms p95 | User tidak boleh menunggu lama saat posting |
| **Availability** | 99.99% (4 nines) | Platform global, downtime = revenue loss |
| **Consistency** | Eventual consistency | Timeline tidak perlu strongly consistent |
| **Durability** | 99.999999999% (11 nines) | Tweet tidak boleh hilang |
| **Throughput** | 300K+ QPS peak | Handle traffic spike saat event besar |
| **Scalability** | Horizontal | Tambah server tanpa downtime |

### 1.3 Trade-off Decisions

```
┌─────────────────────────────────────────────────────────┐
│                    TRADE-OFF MATRIX                      │
├──────────────────┬──────────────────┬───────────────────┤
│   Keputusan      │   Pilihan        │   Alasan          │
├──────────────────┼──────────────────┼───────────────────┤
│ Consistency      │ Eventual         │ Timeline boleh    │
│                  │                  │ sedikit delay     │
├──────────────────┼──────────────────┼───────────────────┤
│ Availability     │ High (AP)        │ Lebih penting     │
│                  │                  │ dari consistency  │
├──────────────────┼──────────────────┼───────────────────┤
│ Timeline Order   │ Approximate      │ Chronological     │
│                  │ chronological    │ + algorithmic     │
├──────────────────┼──────────────────┼───────────────────┤
│ Data Model       │ Denormalized     │ Read performance  │
├──────────────────┼──────────────────┼───────────────────┤
│ Storage          │ Polyglot         │ SQL + NoSQL +     │
│                  │                  │ Cache + Graph DB  │
└──────────────────┴──────────────────┴───────────────────┘
```

**Mengapa AP (Availability + Partition Tolerance) bukan CP?**
- Tweet yang hilang beberapa detik tidak kritis
- User lebih frustrasi saat tidak bisa akses Twitter daripada melihat tweet yang sedikit delay
- CAP Theorem: saat network partition, pilih Availability

---

## 2. CAPACITY ESTIMATION & BACK-OF-THE-ENVELOPE

### 2.1 Asumsi Dasar

```
DAU (Daily Active Users)     = 500 juta
Tweets per hari              = 500 juta
Timeline reads per hari      = 100 miliar
Follows per user (rata-rata) = 200
Tweet size (rata-rata)       = 200 byte (text only)
Media attachment rate        = 20% dari tweet
Media size (rata-rata)       = 500 KB
```

### 2.2 QPS (Queries Per Second) Calculation

**Tweet Write QPS:**
```
500 juta tweets / hari
= 500.000.000 / (24 × 60 × 60)
= 500.000.000 / 86.400
≈ 5.787 tweets/detik (rata-rata)

Peak factor (10x dari rata-rata saat event besar):
≈ 58.000 tweets/detik (peak)
```

**Timeline Read QPS:**
```
100 miliar reads / hari
= 100.000.000.000 / 86.400
≈ 1.157.407 reads/detik (rata-rata)

Peak factor (5x dari rata-rata):
≈ 5.787.037 reads/detik (peak)
```

**Follow/Like QPS:**
```
Follows: 500 juta users × 0.1 follow/hari = 50 juta/hari
= 50.000.000 / 86.400 ≈ 578/detik (rata-rata)

Likes: 500 juta users × 5 likes/hari = 2.5 miliar/hari
= 2.500.000.000 / 86.400 ≈ 28.935/detik (rata-rata)
```

### 2.3 Storage Estimation

**Tweet Storage (per hari):**
```
Text only: 500 juta × 200 byte = 100 GB/hari
Dengan media: 500 juta × 20% × 500 KB = 50 TB/hari

Per tahun:
Text: 100 GB × 365 = 36.5 TB/tahun
Media: 50 TB × 365 = 18.25 PB/tahun
```

**Timeline Cache Storage:**
```
500 juta users × 800 tweets (timeline) × 200 byte
= 500.000.000 × 800 × 200
= 80 TB (total cache timeline)

Dengan Redis cluster (replication factor 3):
= 80 TB × 3 = 240 TB RAM
```

**User Graph Storage:**
```
500 juta users × 200 follows × 8 byte (user_id)
= 500.000.000 × 200 × 8
= 800 GB (total graph edges)

Dengan index dan metadata:
≈ 2 TB total
```

### 2.4 Bandwidth Estimation

**Read Bandwidth (per detik):**
```
Timeline reads: 1.157.407 reads/detik × 800 tweets × 200 byte
= 1.157.407 × 160.000 byte
≈ 185 GB/detik (rata-rata)

Peak: 185 GB × 5 = 925 GB/detik
```

**Write Bandwidth (per detik):**
```
Tweets: 5.787 tweets/detik × 200 byte = 1.157 KB/detik
Media: 5.787 × 20% × 500 KB = 578.700 KB/detik ≈ 565 MB/detik
```

### 2.5 Server Count Estimation

```
┌──────────────────────────────────────────────────────────┐
│                    SERVER ESTIMATION                      │
├──────────────────────┬──────────┬────────────────────────┤
│ Component            │ QPS      │ Server (per 10K QPS)   │
├──────────────────────┼──────────┼────────────────────────┤
│ API Gateway          │ 6M       │ 600 servers            │
│ Timeline Service     │ 5.8M     │ 580 servers            │
│ Tweet Service        │ 58K      │ 6 servers              │
│ User Graph Service   │ 30K      │ 3 servers              │
│ Media Service        │ 12K      │ 2 servers              │
│ Cache (Redis)        │ 5.8M     │ 120 servers (50K QPS)  │
│ Database (Cassandra) │ 58K      │ 20 nodes               │
├──────────────────────┼──────────┼────────────────────────┤
│ TOTAL                │          │ ~1.331 servers          │
└──────────────────────┴──────────┴────────────────────────┘
```

---

## 3. API DESIGN

### 3.1 REST API Endpoints

```
┌────────────────────────────────────────────────────────────────────┐
│                         TWEET ENDPOINTS                             │
├────────────────────────────────────────────────────────────────────┤
│ POST   /api/v1/tweets                    │ Create new tweet        │
│ GET    /api/v1/tweets/:id                │ Get tweet by ID         │
│ DELETE /api/v1/tweets/:id                │ Delete tweet            │
│ POST   /api/v1/tweets/:id/retweet        │ Retweet                 │
│ DELETE /api/v1/tweets/:id/retweet        │ Undo retweet            │
│ POST   /api/v1/tweets/:id/like           │ Like tweet              │
│ DELETE /api/v1/tweets/:id/like           │ Unlike tweet            │
├────────────────────────────────────────────────────────────────────┤
│                        TIMELINE ENDPOINTS                           │
├────────────────────────────────────────────────────────────────────┤
│ GET    /api/v1/timeline/home             │ Home timeline           │
│ GET    /api/v1/timeline/user/:id         │ User profile tweets     │
│ GET    /api/v1/timeline/mentions         │ Mentions timeline       │
├────────────────────────────────────────────────────────────────────┤
│                         USER ENDPOINTS                              │
├────────────────────────────────────────────────────────────────────┤
│ POST   /api/v1/users/:id/follow          │ Follow user             │
│ DELETE /api/v1/users/:id/follow          │ Unfollow user           │
│ GET    /api/v1/users/:id/followers       │ Get followers list      │
│ GET    /api/v1/users/:id/following       │ Get following list      │
│ GET    /api/v1/users/:id                 │ Get user profile        │
├────────────────────────────────────────────────────────────────────┤
│                        SEARCH ENDPOINTS                             │
├────────────────────────────────────────────────────────────────────┤
│ GET    /api/v1/search/tweets?q=...       │ Search tweets           │
│ GET    /api/v1/search/users?q=...        │ Search users            │
│ GET    /api/v1/trends                    │ Get trending topics     │
└────────────────────────────────────────────────────────────────────┘
```

### 3.2 Request/Response Examples

**Create Tweet:**
```http
POST /api/v1/tweets
Content-Type: application/json
Authorization: Bearer <token>

{
  "text": "Belajar system design itu seru! #SystemDesign",
  "media_ids": ["media_123", "media_456"],
  "in_reply_to": null,
  "geo": {
    "lat": -6.9034,
    "long": 107.6186
  }
}

Response 201 Created:
{
  "id": "tweet_789012",
  "text": "Belajar system design itu seru! #SystemDesign",
  "user_id": "user_123",
  "created_at": "2026-01-15T10:30:00Z",
  "media": [
    {"id": "media_123", "url": "https://pbs.twimg.com/media/123.jpg", "type": "photo"}
  ],
  "metrics": {
    "retweet_count": 0,
    "like_count": 0,
    "reply_count": 0
  }
}
```

**Get Home Timeline:**
```http
GET /api/v1/timeline/home?count=20&cursor=next_page_token
Authorization: Bearer <token>

Response 200 OK:
{
  "tweets": [
    {
      "id": "tweet_789012",
      "user": {
        "id": "user_456",
        "username": "techguru",
        "display_name": "Tech Guru",
        "avatar": "https://pbs.twimg.com/avatar/456.jpg",
        "verified": true
      },
      "text": "Thread: Cara design scalable system...",
      "created_at": "2026-01-15T10:25:00Z",
      "metrics": {
        "retweet_count": 150,
        "like_count": 1200,
        "reply_count": 45
      },
      "is_retweet": false,
      "is_liked_by_viewer": false
    }
  ],
  "next_cursor": "eyJpZCI6InR3ZWV0Xzc4OTAxMiJ9",
  "has_more": true
}
```

**Follow User:**
```http
POST /api/v1/users/user_456/follow
Authorization: Bearer <token>

Response 200 OK:
{
  "following": true,
  "follower_count": 1500,
  "following_count": 201
}
```

### 3.3 Rate Limiting

```
┌──────────────────────────────────────────────────────────┐
│                    RATE LIMITS                            │
├──────────────────────────┬───────────────┬───────────────┤
│ Endpoint                 │ Limit         │ Window        │
├──────────────────────────┼───────────────┼───────────────┤
│ POST /tweets             │ 300           │ 3 hours       │
│ POST /follow             │ 400           │ 24 hours      │
│ GET /timeline            │ 180           │ 15 minutes    │
│ GET /search              │ 180           │ 15 minutes    │
│ POST /like               │ 1000          │ 24 hours      │
└──────────────────────────┴───────────────┴───────────────┘
```

---

## 4. HIGH-LEVEL ARCHITECTURE

### 4.1 Complete System Diagram

```
                                    ┌─────────────────────────────────────────┐
                                    │          GLOBAL LOAD BALANCER           │
                                    │         (DNS + Anycast + GSLB)          │
                                    └─────────────────┬───────────────────────┘
                                                      │
                    ┌─────────────────────────────────┼─────────────────────────────────┐
                    ▼                                 ▼                                 ▼
        ┌───────────────────┐           ┌───────────────────┐           ┌───────────────────┐
        │   REGION: US-EAST │           │  REGION: EU-WEST  │           │  REGION: AP-SE    │
        │                   │           │                   │           │                   │
        │  ┌─────────────┐  │           │  ┌─────────────┐  │           │  ┌─────────────┐  │
        │  │   CDN Edge  │  │           │  │   CDN Edge  │  │           │  │   CDN Edge  │  │
        │  │ (Static+    │  │           │  │ (Static+    │  │           │  │ (Static+    │  │
        │  │  Media)     │  │           │  │  Media)     │  │           │  │  Media)     │  │
        │  └─────────────┘  │           │  └─────────────┘  │           │  └─────────────┘  │
        │                   │           │                   │           │                   │
        │  ┌─────────────┐  │           │  ┌─────────────┐  │           │  ┌─────────────┐  │
        │  │ API Gateway │  │           │  │ API Gateway │  │           │  │ API Gateway │  │
        │  │ + Rate Lim. │  │           │  │ + Rate Lim. │  │           │  │ + Rate Lim. │  │
        │  └──────┬──────┘  │           │  └──────┬──────┘  │           │  └──────┬──────┘  │
        │         │         │           │         │         │           │         │         │
        │  ┌──────┴──────┐  │           │  ┌──────┴──────┐  │           │  ┌──────┴──────┐  │
        │  │   Service   │  │           │  │   Service   │  │           │  │   Service   │  │
        │  │   Mesh      │  │           │  │   Mesh      │  │           │  │   Mesh      │  │
        │  └──────┬──────┘  │           │  └──────┬──────┘  │           │  └──────┬──────┘  │
        │         │         │           │         │         │           │         │         │
        │  ┌──────┼──────┐  │           │  ┌──────┼──────┐  │           │  ┌──────┼──────┐  │
        │  ▼      ▼      ▼  │           │  ▼      ▼      ▼  │           │  ▼      ▼      ▼  │
        │ ┌──┐ ┌──┐ ┌──┐   │           │ ┌──┐ ┌──┐ ┌──┐   │           │ ┌──┐ ┌──┐ ┌──┐   │
        │ │TW│ │TL│ │UG│   │           │ │TW│ │TL│ │UG│   │           │ │TW│ │TL│ │UG│   │
        │ └──┘ └──┘ └──┘   │           │ └──┘ └──┘ └──┘   │           │ └──┘ └──┘ └──┘   │
        └──┼──────┼────┼───┘           └──┼──────┼────┼───┘           └──┼──────┼────┼───┘
           │      │    │                   │      │    │                   │      │    │
    ┌──────┼──────┼────┼───────────────────┼──────┼────┼───────────────────┼──────┼────┼──────┐
    ▼      ▼      ▼    ▼                   ▼      ▼    ▼                   ▼      ▼    ▼      ▼
┌────────┐┌──────┐┌────┐┌────────┐   ┌────────┐┌────┐┌────┐┌────────┐  ┌────────┐┌────┐┌────┐
│Tweet DB││Cache ││Graph││Message │   │Tweet DB││... ││... ││Message │  │Tweet DB││... ││... │
│(Cass.) ││(Redis)││ DB ││ Queue  │   │(Cass.) ││    ││    ││ Queue  │  │(Cass.) ││    ││    │
└────────┘└──────┘└────┘└────────┘   └────────┘└────┘└────┘└────────┘  └────────┘└────┘└────┘

    TW = Tweet Service    TL = Timeline Service    UG = User Graph Service
```

### 4.2 Component Breakdown

```
┌─────────────────────────────────────────────────────────────────────┐
│                     COMPONENT DETAIL                                │
├──────────────────┬──────────────┬───────────────────────────────────┤
│ Component        │ Technology   │ Fungsi                            │
├──────────────────┼──────────────┼───────────────────────────────────┤
│ CDN              │ CloudFlare/  │ Cache static assets, media,       │
│                  │ Akamai       │ reduce origin load                │
├──────────────────┼──────────────┼───────────────────────────────────┤
│ API Gateway      │ Envoy/       │ Routing, rate limiting, auth,     │
│                  │ Kong         │ request validation                │
├──────────────────┼──────────────┼───────────────────────────────────┤
│ Service Mesh     │ Istio/       │ Service discovery, mTLS,          │
│                  │ Linkerd      │ traffic management, observability  │
├──────────────────┼──────────────┼───────────────────────────────────┤
│ Tweet Service    │ Go/Java      │ CRUD tweet, validation,           │
│                  │              │ media attachment                  │
├──────────────────┼──────────────┼───────────────────────────────────┤
│ Timeline Service │ Go/Rust      │ Generate timeline, fan-out,       │
│                  │              │ cache management                  │
├──────────────────┼──────────────┼───────────────────────────────────┤
│ User Graph       │ Neo4j/       │ Follow relationships, graph       │
│ Service          │ custom       │ traversal, mutual follow          │
├──────────────────┼──────────────┼───────────────────────────────────┤
│ Search Service   │ Elasticsearch│ Full-text search, hashtag,        │
│                  │              │ mention indexing                  │
├──────────────────┼──────────────┼───────────────────────────────────┤
│ Media Service    │ Go           │ Upload, resize, transcode,        │
│                  │              │ thumbnail generation              │
├──────────────────┼──────────────┼───────────────────────────────────┤
│ Notification     │ WebSocket/   │ Push notification, real-time      │
│ Service          │ gRPC stream  │ delivery, batching                │
├──────────────────┼──────────────┼───────────────────────────────────┤
│ Message Queue    │ Kafka        │ Async processing, fan-out,        │
│                  │              │ event streaming                   │
├──────────────────┼──────────────┼───────────────────────────────────┤
│ Cache            │ Redis        │ Timeline cache, session,          │
│                  │ Cluster      │ rate limit counter                │
├──────────────────┼──────────────┼───────────────────────────────────┤
│ Tweet Storage    │ Cassandra/   │ Distributed NoSQL, high write     │
│                  │ Manifold     │ throughput, eventual consistency  │
├──────────────────┼──────────────┼───────────────────────────────────┤
│ Graph Storage    │ custom       │ Adjacency list, follower/following│
│                  │ (Gizzard)    │ lookup, graph traversal           │
└──────────────────┴──────────────┴───────────────────────────────────┘
```

### 4.3 Data Flow — Tweet Creation

```
User → [1] POST /tweets → API Gateway
                    ↓
              [2] Auth + Rate Limit
                    ↓
              [3] Tweet Service
                    ↓
         ┌──────────┴──────────┐
         ▼                     ▼
    [4a] Write to          [4b] Write to
    Tweet DB               Media Service
    (Cassandra)            (if has media)
         ↓                     ↓
    [5] Publish to         [5b] Media
    Kafka topic            processing
    "tweets.new"               ↓
         ↓                [5c] Store in
    [6] Timeline            Object Storage
    Service consume             ↓
    from Kafka             [5d] CDN push
         ↓
    [7] Fan-out to
    follower timelines
         ↓
    [8] Update Redis
    cache for each
    follower
         ↓
    [9] Push notification
    to followers (online)
```

---

## 5. TIMELINE GENERATION — 3 STRATEGIES DEEP DIVE

Ini adalah **bagian paling kritis** dari arsitektur Twitter. Timeline generation menentukan performa keseluruhan sistem.

### 5.1 Strategi 1: Fan-out on Write (Push Model)

**Konsep:** Saat user A tweet, sistem langsung push tweet tersebut ke timeline cache SEMUA follower user A.

```
                    FAN-OUT ON WRITE (PUSH MODEL)
                    ═══════════════════════════════

User A tweet: "Hello World!"
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  User A memiliki 1.000 follower:                        │
│  F1, F2, F3, ..., F1000                                │
│                                                         │
│  Sistem melakukan:                                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │ FOR each follower F in followers(A):              │  │
│  │   1. Push tweet_id ke timeline cache F            │  │
│  │   2. Timeline F = [tweet_A] + existing_timeline   │  │
│  │   3. Trim timeline ke max 800 tweets              │  │
│  │ END FOR                                           │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Total operasi: 1.000 write ke Redis                   │
│  Latency: ~500ms (parallel)                            │
└─────────────────────────────────────────────────────────┘
```

**Implementasi:**
```python
class FanOutOnWrite:
    def publish_tweet(self, user_id: str, tweet: Tweet):
        # 1. Simpan tweet ke database
        self.tweet_db.save(tweet)

        # 2. Dapatkan semua follower
        followers = self.graph_db.get_followers(user_id)

        # 3. Fan-out ke timeline cache setiap follower
        #    Gunakan batch + parallel processing
        for follower_id in followers:
            timeline_key = f"timeline:{follower_id}"
            self.redis.zadd(
                timeline_key,
                {tweet.id: tweet.timestamp}  # sorted set by timestamp
            )
            # Trim ke 800 tweet terbaru
            self.redis.zremrangebyrank(timeline_key, 0, -801)

        # 4. Publish event untuk notification
        self.kafka.publish("tweets.new", {
            "user_id": user_id,
            "tweet_id": tweet.id,
            "follower_count": len(followers)
        })
```

**Kelebihan:**
| Aspek | Detail |
|-------|--------|
| **Read Latency** | Sangat cepat (~10ms) — tinggal baca dari cache |
| **Simplicity** | Logic read sangat sederhana |
| **Consistency** | Timeline selalu up-to-date |

**Kekurangan:**
| Aspek | Detail |
|-------|--------|
| **Write Amplification** | 1 tweet = N write (N = jumlah follower) |
| **Celebrity Problem** | User dengan 100M follower = 100M write! |
| **Storage** | Setiap tweet direplikasi ke semua follower |
| **Cold Start** | User baru follow = harus rebuild timeline |

**Kapan digunakan:**
- User dengan follower < 1.000
- Aplikasi yang mengutamakan read performance
- Sistem dengan ratio read:write > 100:1

### 5.2 Strategi 2: Fan-out on Read (Pull Model)

**Konsep:** Saat user membuka timeline, sistem FETCH tweet dari semua user yang di-follow, lalu merge dan sort.

```
                    FAN-OUT ON READ (PULL MODEL)
                    ═══════════════════════════════

User B buka timeline:
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  User B following 500 user:                             │
│  U1, U2, U3, ..., U500                                 │
│                                                         │
│  Sistem melakukan:                                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 1. FOR each following U in following(B):          │  │
│  │      tweets = get_tweets_from_db(U, limit=10)     │  │
│  │      all_tweets.extend(tweets)                    │  │
│  │                                                   │  │
│  │ 2. Sort all_tweets by timestamp DESC              │  │
│  │                                                   │  │
│  │ 3. Return top 20 tweets                           │  │
│  │                                                   │  │
│  │  Total operasi: 500 read dari DB                  │  │
│  │  Latency: ~2-5 detik (terlalu lambat!)            │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Implementasi:**
```python
class FanOutOnRead:
    def get_timeline(self, user_id: str, count: int = 20) -> List[Tweet]:
        # 1. Dapatkan semua user yang di-follow
        following = self.graph_db.get_following(user_id)

        # 2. Fetch tweet dari setiap user (parallel)
        all_tweets = []
        with ThreadPoolExecutor(max_workers=50) as executor:
            futures = []
            for followed_user_id in following:
                future = executor.submit(
                    self.tweet_db.get_recent_tweets,
                    followed_user_id,
                    limit=10
                )
                futures.append(future)

            for future in as_completed(futures):
                all_tweets.extend(future.result())

        # 3. Sort by timestamp dan ambil top N
        all_tweets.sort(key=lambda t: t.timestamp, reverse=True)
        return all_tweets[:count]
```

**Kelebihan:**
| Aspek | Detail |
|-------|--------|
| **Write Cost** | Sangat murah — 1 tweet = 1 write ke DB |
| **Celebrity Friendly** | Tidak ada masalah dengan celebrity |
| **Storage Efisien** | Tidak ada duplikasi tweet |

**Kekurangan:**
| Aspek | Detail |
|-------|--------|
| **Read Latency** | Sangat lambat — harus query banyak user |
| **DB Load** | Heavy read pressure pada database |
| **No Caching** | Sulit cache karena timeline selalu berubah |

**Kapan digunakan:**
- User dengan following sangat banyak (> 5.000)
- Celebrity account (Justin Bieber, Obama, dll)
- Sistem dengan ratio write:read tinggi

### 5.3 Strategi 3: Hybrid Approach (Twitter Production)

**Konsep:** Kombinasikan keduanya — fan-out on write untuk user biasa, fan-out on read untuk celebrity.

```
                    HYBRID APPROACH (PRODUCTION)
                    ═══════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│                     DECISION TREE                            │
│                                                              │
│  User A tweet:                                              │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────────────────┐                                │
│  │ follower_count(A) >     │                                │
│  │ CELEBRITY_THRESHOLD?    │                                │
│  │ (threshold = 10.000)    │                                │
│  └────────┬────────────────┘                                │
│           │                                                 │
│     ┌─────┴─────┐                                           │
│     │           │                                           │
│    YES         NO                                            │
│     │           │                                           │
│     ▼           ▼                                           │
│  ┌─────────┐ ┌───────────────────────────────────────────┐  │
│  │CELEBRITY│ │NORMAL USER                                │  │
│  │MODE     │ │                                           │  │
│  │         │ │ 1. Fan-out ke semua follower timeline     │  │
│  │ 1. Simpan│ │    cache (Redis)                         │  │
│  │    tweet │ │ 2. Timeline siap dibaca dalam ~10ms      │  │
│  │    di DB │ │ 3. Update notification                   │  │
│  │ 2. Simpan│ │                                         │  │
│  │    di    │ │                                         │  │
│  │    celeb │ │                                         │  │
│  │    cache │ │                                         │  │
│  └────┬────┘ └───────────────────────────────────────────┘  │
│       │                                                     │
│       ▼                                                     │
│  Saat follower baca timeline:                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 1. Baca timeline cache (tweet dari user normal)     │    │
│  │ 2. Query celeb cache untuk tweet dari celebrity     │    │
│  │    yang di-follow                                   │    │
│  │ 3. Merge kedua list, sort by timestamp              │    │
│  │ 4. Return top 20                                    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

**Implementasi Hybrid:**
```python
class HybridTimeline:
    CELEBRITY_THRESHOLD = 10_000  # follower > 10K = celebrity

    def publish_tweet(self, user_id: str, tweet: Tweet):
        # Simpan tweet ke database (selalu)
        self.tweet_db.save(tweet)

        follower_count = self.graph_db.get_follower_count(user_id)

        if follower_count > self.CELEBRITY_THRESHOLD:
            # CELEBRITY MODE: tidak fan-out, simpan di celeb cache
            self.celeb_cache.add_tweet(user_id, tweet)
            self.metrics.increment("tweet.celebrity")
        else:
            # NORMAL MODE: fan-out ke semua follower
            followers = self.graph_db.get_followers(user_id)
            self.fanout_service.push_to_timelines(followers, tweet)
            self.metrics.increment("tweet.normal")

    def get_timeline(self, user_id: str, count: int = 20) -> List[Tweet]:
        # 1. Baca dari timeline cache (hasil fan-out)
        cached_tweets = self.redis.zrevrange(
            f"timeline:{user_id}", 0, count - 1, withscores=True
        )

        # 2. Ambil tweet dari celebrity yang di-follow
        celebrity_following = self.graph_db.get_celebrity_following(user_id)
        celeb_tweets = []
        for celeb_id in celebrity_following:
            tweets = self.celeb_cache.get_tweets(celeb_id, limit=5)
            celeb_tweets.extend(tweets)

        # 3. Merge dan sort
        all_tweets = cached_tweets + celeb_tweets
        all_tweets.sort(key=lambda t: t.timestamp, reverse=True)

        return all_tweets[:count]
```

**Kelebihan Hybrid:**
| Aspek | Detail |
|-------|--------|
| **Best of Both** | Read cepat untuk user biasa, write efisien untuk celebrity |
| **Scalable** | Bisa handle 500M users dengan follower distribution power-law |
| **Flexible** | Threshold bisa di-adjust berdasarkan load |

**Kapan digunakan:**
- **SELALU** untuk platform social media skala besar
- Twitter, Instagram, Facebook semua pakai variasi hybrid
- Threshold bisa di-tune: 1K, 10K, 100K tergantung capacity

### 5.4 Perbandingan 3 Strategi

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    COMPARISON MATRIX                                     │
├──────────────────┬───────────────┬───────────────┬──────────────────────┤
│ Aspek            │ Fan-out Write │ Fan-out Read  │ Hybrid               │
├──────────────────┼───────────────┼───────────────┼──────────────────────┤
│ Read Latency     │ ★★★★★ (10ms)  │ ★☆☆☆☆ (5s)    │ ★★★★☆ (50ms)         │
│ Write Latency    │ ★★☆☆☆ (500ms) │ ★★★★★ (50ms)  │ ★★★☆☆ (200ms)        │
│ Storage Cost     │ ★★☆☆☆ (tinggi)│ ★★★★★ (rendah)│ ★★★★☆ (sedang)       │
│ Celebrity Handle │ ★☆☆☆☆ (buruk) │ ★★★★★ (bagus) │ ★★★★★ (bagus)        │
│ Implementation   │ ★★★☆☆         │ ★★☆☆☆         │ ★★★★☆                │
│ Production Ready │ ❌            │ ❌            │ ✅                   │
└──────────────────┴───────────────┴───────────────┴──────────────────────┘
```

**Kesimpulan:** Twitter production menggunakan **Hybrid Approach** dengan threshold dinamis yang di-adjust berdasarkan real-time system load.

---

## 6. USER GRAPH SERVICE

### 6.1 Follow Relationship Storage

**Model Data:**
```
┌──────────────────────────────────────────────────────────┐
│              FOLLOW RELATIONSHIP TABLE                    │
├──────────────────────────────────────────────────────────┤
│  follower_id  │  following_id  │  created_at  │  status  │
├──────────────────────────────────────────────────────────┤
│  user_123     │  user_456      │  2026-01-01  │  active  │
│  user_789     │  user_123      │  2026-01-02  │  active  │
│  user_456     │  user_789      │  2026-01-03  │  active  │
└──────────────────────────────────────────────────────────┘

Index:
- (follower_id) → untuk "who am I following?"
- (following_id) → untuk "who follows me?"
- (follower_id, following_id) → untuk "am I following X?"
```

**Storage Options:**
```
┌──────────────────────────────────────────────────────────────────┐
│                    GRAPH STORAGE OPTIONS                          │
├──────────────────┬──────────────────────┬────────────────────────┤
│ Technology       │ Use Case             │ Trade-off              │
├──────────────────┼──────────────────────┼────────────────────────┤
│ Redis (Set)      │ Follower lookup      │ Fast, in-memory,       │
│                  │                      │ limited by RAM         │
├──────────────────┼──────────────────────┼────────────────────────┤
│ Cassandra        │ Persistent storage   │ Scalable, eventual     │
│                  │                      │ consistency            │
├──────────────────┼──────────────────────┼────────────────────────┤
│ Neo4j            │ Graph traversal      │ Rich query, slower     │
│                  │                      │ write                  │
├──────────────────┼──────────────────────┼────────────────────────┤
│ Custom (Gizzard) │ Twitter production   │ Optimized untuk        │
│                  │                      │ Twitter workload       │
└──────────────────┴──────────────────────┴────────────────────────┘
```

### 6.2 Graph Traversal Operations

**Get Followers (siapa yang follow saya):**
```sql
-- Cassandra CQL
SELECT follower_id, created_at
FROM follower_index
WHERE following_id = 'user_456'
ORDER BY created_at DESC
LIMIT 100;
```

**Get Following (siapa yang saya follow):**
```sql
SELECT following_id, created_at
FROM following_index
WHERE follower_id = 'user_123'
ORDER BY created_at DESC
LIMIT 100;
```

**Check Follow Relationship:**
```python
def is_following(follower_id: str, following_id: str) -> bool:
    # O(1) lookup dengan Redis Set
    return redis.sismember(f"following:{follower_id}", following_id)
```

### 6.3 Mutual Follow Detection

**"Suggested for you" — siapa yang mungkin kamu kenal:**
```python
def get_suggested_follows(user_id: str, limit: int = 10) -> List[str]:
    """
    Algorithm: Second-degree connections
    1. Ambil semua orang yang di-follow user
    2. Untuk setiap orang itu, ambil follower mereka
    3. Hitung berapa banyak mutual connections
    4. Sort by mutual connection count
    5. Filter yang sudah di-follow
    """
    following = graph_db.get_following(user_id)

    # Count mutual connections
    mutual_counts = Counter()
    for followed_user in following:
        their_followers = graph_db.get_followers(followed_user)
        for follower in their_followers:
            if follower != user_id and not is_following(user_id, follower):
                mutual_counts[follower] += 1

    # Return top suggestions
    return [user for user, _ in mutual_counts.most_common(limit)]
```

**Optimasi untuk skala besar:**
```
┌─────────────────────────────────────────────────────────────┐
│              SUGGESTION OPTIMIZATION                         │
│                                                             │
│  Problem: O(N²) untuk 500M users = tidak feasible           │
│                                                             │
│  Solusi:                                                    │
│  1. Pre-compute suggestions secara batch (offline)          │
│  2. Simpan di Redis cache per user                          │
│  3. Update suggestions setiap 24 jam                        │
│  4. Real-time adjustment berdasarkan recent activity         │
│                                                             │
│  Pipeline:                                                  │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │ Spark/Flink │ →  │ Graph Algo   │ →  │ Redis Cache  │   │
│  │ (batch)     │    │ (PageRank,   │    │ (per user)   │   │
│  │             │    │  Triangles)  │    │              │   │
│  └─────────────┘    └──────────────┘    └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 6.4 Follower Count Cache

**Masalah:** COUNT(*) setiap kali = lambat
**Solusi:** Counter yang di-increment/decrement real-time

```python
class FollowerCounter:
    def follow(self, follower_id: str, following_id: str):
        # 1. Insert relationship ke DB
        self.db.insert_follow(follower_id, following_id)

        # 2. Increment counter (atomic)
        self.redis.incr(f"follower_count:{following_id}")
        self.redis.incr(f"following_count:{follower_id}")

        # 3. Update graph cache
        self.redis.sadd(f"following:{follower_id}", following_id)
        self.redis.sadd(f"followers:{following_id}", follower_id)

    def get_follower_count(self, user_id: str) -> int:
        # O(1) dari cache
        count = self.redis.get(f"follower_count:{user_id}")
        return int(count) if count else self.db.count_followers(user_id)
```

---

## 7. TWEET STORAGE & PARTITIONING

### 7.1 SQL vs NoSQL Decision

```
┌─────────────────────────────────────────────────────────────────────┐
│                    STORAGE COMPARISON                                │
├──────────────────┬──────────────────────┬───────────────────────────┤
│ Aspek            │ SQL (MySQL/PostgreSQL)│ NoSQL (Cassandra)        │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Write Throughput │ ~10K QPS per node    │ ~100K QPS per node        │
│ Read Latency     │ < 10ms               │ < 20ms                    │
│ Scalability      │ Vertical + read      │ Horizontal (linear)       │
│                  │ replicas             │                           │
│ Consistency      │ Strong (ACID)        │ Eventual (tunable)        │
│ Schema           │ Fixed                │ Flexible                  │
│ Join             │ Native               │ Tidak support             │
│ Twitter Choice   │ ❌ (tidak scalable)  │ ✅ (production)           │
└──────────────────┴──────────────────────┴───────────────────────────┘
```

**Kenapa Cassandra untuk Twitter:**
- Write-heavy workload (500M tweets/hari)
- Horizontal scaling linear
- Eventual consistency acceptable
- Time-series data cocok dengan Cassandra model
- Twitter production pakai Cassandra (Manifold)

### 7.2 Partitioning Strategy

**Partition by User ID:**
```
┌─────────────────────────────────────────────────────────────┐
│              PARTITION BY USER_ID                            │
│                                                             │
│  Partition Key: user_id                                     │
│  Cluster Key: tweet_id (time-based snowflake ID)            │
│                                                             │
│  Node 1 (user_id % 1000 < 200):                             │
│    user_001 tweets: [tweet_1, tweet_2, tweet_3, ...]        │
│    user_002 tweets: [tweet_4, tweet_5, ...]                 │
│                                                             │
│  Node 2 (200 <= user_id % 1000 < 400):                      │
│    user_201 tweets: [tweet_6, tweet_7, ...]                 │
│                                                             │
│  Query:                                                     │
│  SELECT * FROM tweets WHERE user_id = 'user_123'            │
│  ORDER BY tweet_id DESC LIMIT 20;                           │
│  → Single partition, sangat cepat!                          │
└─────────────────────────────────────────────────────────────┘
```

**Cassandra Schema:**
```sql
CREATE TABLE tweets_by_user (
    user_id TEXT,
    tweet_id TIMEUUID,
    text TEXT,
    media_urls LIST<TEXT>,
    reply_to_tweet_id TEXT,
    created_at TIMESTAMP,
    metrics FROZEN<TWEET_METRICS>,
    PRIMARY KEY (user_id, tweet_id)
) WITH CLUSTERING ORDER BY (tweet_id DESC);

CREATE TYPE tweet_metrics (
    retweet_count INT,
    like_count INT,
    reply_count INT,
    view_count BIGINT
);

-- Index untuk lookup tweet by ID
CREATE TABLE tweet_by_id (
    tweet_id TIMEUUID PRIMARY KEY,
    user_id TEXT,
    text TEXT,
    created_at TIMESTAMP
);
```

### 7.3 Snowflake ID Generation

**Twitter Snowflake ID — distributed unique ID:**
```
┌─────────────────────────────────────────────────────────────┐
│              SNOWFLAKE ID STRUCTURE (64 bit)                 │
│                                                             │
│  ┌─────────────┬──────────────┬──────────────┬────────────┐ │
│  │ 0 (1 bit)   │ Timestamp    │ Worker ID    │ Sequence   │ │
│  │ unused      │ (41 bits)    │ (10 bits)    │ (12 bits)  │ │
│  └─────────────┴──────────────┴──────────────┴────────────┘ │
│                                                             │
│  Timestamp: milliseconds since custom epoch (~69 tahun)     │
│  Worker ID: 1024 unique workers (server)                    │
│  Sequence: 4096 IDs per ms per worker                       │
│                                                             │
│  Max throughput: 1024 × 4096 × 1000 = 4.194.304.000 ID/s   │
│  Cukup untuk 500M tweets/hari dengan margin besar!          │
└─────────────────────────────────────────────────────────────┘
```

```python
class SnowflakeIDGenerator:
    EPOCH = 1640995200000  # 2022-01-01 00:00:00 UTC

    def __init__(self, worker_id: int):
        self.worker_id = worker_id
        self.sequence = 0
        self.last_timestamp = -1

    def generate(self) -> int:
        timestamp = self._current_ms()

        if timestamp == self.last_timestamp:
            self.sequence = (self.sequence + 1) & 0xFFF
            if self.sequence == 0:
                timestamp = self._wait_next_ms(timestamp)
        else:
            self.sequence = 0

        self.last_timestamp = timestamp

        return ((timestamp - self.EPOCH) << 22) | \
               (self.worker_id << 12) | \
               self.sequence
```

---

## 8. MEDIA PIPELINE

### 8.1 Upload Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MEDIA UPLOAD PIPELINE                             │
│                                                                      │
│  User upload foto/video:                                            │
│       │                                                             │
│       ▼                                                             │
│  ┌─────────────┐     ┌──────────────┐     ┌──────────────────────┐  │
│  │ Client      │────→│ API Gateway  │────→│ Media Upload Service │  │
│  │ (chunked)   │     │ + Auth       │     │                      │  │
│  └─────────────┘     └──────────────┘     └──────────┬───────────┘  │
│                                                      │              │
│                    ┌─────────────────────────────────┘              │
│                    ▼                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    PROCESSING QUEUE                          │   │
│  │                                                              │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │ Image       │  │ Video        │  │ GIF Processing   │   │   │
│  │  │ Processing  │  │ Transcoding  │  │                  │   │   │
│  │  │             │  │              │  │                  │   │   │
│  │  │ • Resize    │  │ • H.264/VP9  │  │ • Optimize       │   │   │
│  │  │ • Compress  │  │ • Multi-res  │  │ • Frame extract  │   │   │
│  │  │ • WebP conv │  │ • Thumbnail  │  │ • Loop detect    │   │   │
│  │  │ • Thumbnail │  │ • Poster     │  │                  │   │   │
│  │  └──────┬──────┘  └──────┬───────┘  └────────┬─────────┘   │   │
│  └─────────┼────────────────┼───────────────────┼─────────────┘   │
│            ▼                ▼                   ▼                 │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              OBJECT STORAGE (S3/GCS)                        │  │
│  │                                                              │  │
│  │  /media/2026/01/15/user_123/                                │  │
│  │    ├── tweet_789_original.jpg                               │  │
│  │    ├── tweet_789_thumb.jpg     (150x150)                    │  │
│  │    ├── tweet_789_small.jpg     (600x400)                    │  │
│  │    ├── tweet_789_medium.jpg    (1200x800)                   │  │
│  │    └── tweet_789_large.jpg     (2048x1365)                  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│            │                                                       │
│            ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    CDN DISTRIBUTION                          │  │
│  │  CloudFlare/Akamai edge cache di 200+ lokasi global         │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.2 Chunked Upload

**Untuk file besar (> 5MB), gunakan chunked upload:**
```python
class ChunkedUpload:
    CHUNK_SIZE = 5 * 1024 * 1024  # 5MB per chunk

    def initiate_upload(self, user_id: str, filename: str, total_size: int) -> str:
        """Step 1: Initiate upload session"""
        upload_id = generate_uuid()
        self.redis.set(f"upload:{upload_id}", json.dumps({
            "user_id": user_id,
            "filename": filename,
            "total_size": total_size,
            "chunks_received": [],
            "status": "in_progress",
            "created_at": time.time()
        }), ex=3600)  # 1 hour expiry
        return upload_id

    def upload_chunk(self, upload_id: str, chunk_index: int, data: bytes):
        """Step 2: Upload individual chunks (can be parallel)"""
        session = self.redis.get(f"upload:{upload_id}")
        if not session:
            raise UploadExpiredError()

        # Store chunk in temp storage
        self.object_storage.put(
            f"temp/{upload_id}/chunk_{chunk_index}",
            data
        )

        # Track received chunks
        session["chunks_received"].append(chunk_index)
        self.redis.set(f"upload:{upload_id}", json.dumps(session), ex=3600)

    def complete_upload(self, upload_id: str) -> str:
        """Step 3: Assemble chunks and start processing"""
        session = self.redis.get(f"upload:{upload_id}")
        total_chunks = ceil(session["total_size"] / self.CHUNK_SIZE)

        if len(session["chunks_received"]) != total_chunks:
            raise IncompleteUploadError()

        # Assemble file
        assembled_data = b""
        for i in range(total_chunks):
            chunk = self.object_storage.get(f"temp/{upload_id}/chunk_{i}")
            assembled_data += chunk

        # Store final file
        final_key = f"uploads/{session['user_id']}/{upload_id}"
        self.object_storage.put(final_key, assembled_data)

        # Trigger processing pipeline
        self.kafka.publish("media.uploaded", {
            "upload_id": upload_id,
            "key": final_key,
            "filename": session["filename"]
        })

        # Cleanup temp
        self._cleanup_temp(upload_id, total_chunks)

        return final_key
```

### 8.3 Image Processing

```python
class ImageProcessor:
    SIZES = {
        "thumb": (150, 150),
        "small": (600, 400),
        "medium": (1200, 800),
        "large": (2048, 1365),
    }

    def process(self, image_path: str) -> Dict[str, str]:
        """Generate multiple sizes and formats"""
        img = Image.open(image_path)
        results = {}

        for name, (max_w, max_h) in self.SIZES.items():
            # Resize with aspect ratio
            img.thumbnail((max_w, max_h), Image.LANCZOS)

            # Save as JPEG (photo) or PNG (with transparency)
            if img.mode == 'RGBA':
                output_path = f"{image_path}_{name}.png"
                img.save(output_path, 'PNG', optimize=True)
            else:
                output_path = f"{image_path}_{name}.jpg"
                img.save(output_path, 'JPEG', quality=85, optimize=True)

            # Also save WebP version (smaller size)
            webp_path = f"{image_path}_{name}.webp"
            img.save(webp_path, 'WEBP', quality=80)

            results[name] = {
                "jpeg": self._upload_to_cdn(output_path),
                "webp": self._upload_to_cdn(webp_path)
            }

        return results
```

---

## 9. NOTIFICATION SYSTEM

### 9.1 Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    NOTIFICATION SYSTEM                               │
│                                                                      │
│  Trigger Events:                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ • Someone follows you                                        │   │
│  │ • Someone likes your tweet                                   │   │
│  │ • Someone retweets your tweet                                │   │
│  │ • Someone replies to your tweet                              │   │
│  │ • Someone mentions you (@username)                           │   │
│  │ • Trending topic update                                      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              NOTIFICATION SERVICE                             │   │
│  │                                                              │   │
│  │  1. Receive event from Kafka                                 │   │
│  │  2. Check user notification settings                         │   │
│  │  3. Apply batching rules (don't spam!)                       │   │
│  │  4. Route to delivery channels                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│              ┌───────────────┼───────────────┐                      │
│              ▼               ▼               ▼                      │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐             │
│  │ Push          │ │ In-App        │ │ Email         │             │
│  │ Notification  │ │ Notification  │ │ Digest        │             │
│  │ (FCM/APNs)    │ │ (WebSocket)   │ │ (Batched)     │             │
│  └───────────────┘ └───────────────┘ └───────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.2 Batching Strategy

**Masalah:** User viral mendapat 10.000 likes dalam 1 menit = 10.000 notifikasi!
**Solusi:** Batch notifications dengan window time.

```python
class NotificationBatcher:
    BATCH_WINDOW = 300  # 5 minutes
    BATCH_LIMIT = 50    # Max 50 notifications per batch

    def add_notification(self, user_id: str, notification: Notification):
        """Add notification to batch queue"""
        batch_key = f"notif_batch:{user_id}:{notification.type}"

        # Add to batch
        self.redis.lpush(batch_key, notification.json())
        self.redis.expire(batch_key, self.BATCH_WINDOW)

        # Check if batch is ready to send
        batch_size = self.redis.llen(batch_key)
        if batch_size >= self.BATCH_LIMIT:
            self._flush_batch(user_id, notification.type, batch_key)
        else:
            # Schedule flush after window
            self._schedule_flush(user_id, notification.type, batch_key)

    def _flush_batch(self, user_id: str, notif_type: str, batch_key: str):
        """Send batched notification"""
        notifications = self.redis.lrange(batch_key, 0, -1)
        self.redis.delete(batch_key)

        # Create summary notification
        summary = self._create_summary(notifications, notif_type)

        # Deliver via appropriate channel
        if self._is_user_online(user_id):
            self.websocket.send(user_id, summary)
        else:
            self.push_notification.send(user_id, summary)
```

### 9.3 Real-time Delivery (WebSocket)

```python
class WebSocketNotificationService:
    def __init__(self):
        self.connections: Dict[str, WebSocket] = {}

    async def connect(self, user_id: str, ws: WebSocket):
        """Register WebSocket connection"""
        self.connections[user_id] = ws
        await ws.send(json.dumps({"type": "connected"}))

    async def disconnect(self, user_id: str):
        """Remove WebSocket connection"""
        self.connections.pop(user_id, None)

    async def send_notification(self, user_id: str, notification: dict):
        """Send notification to connected user"""
        ws = self.connections.get(user_id)
        if ws:
            try:
                await ws.send(json.dumps({
                    "type": "notification",
                    "data": notification
                }))
            except WebSocketDisconnect:
                await self.disconnect(user_id)
```

---

## 10. TRENDING ALGORITHM

### 10.1 Real-time Trending

**Algorithm: Weighted hashtag/keyword frequency with time decay**

```python
class TrendingAlgorithm:
    HALF_LIFE = 3600  # 1 hour half-life

    def __init__(self):
        self.hashtag_counts: Dict[str, float] = defaultdict(float)
        self.baseline_counts: Dict[str, float] = {}  # Historical baseline

    def add_tweet(self, tweet: Tweet):
        """Process new tweet for trending"""
        hashtags = self._extract_hashtags(tweet.text)
        now = time.time()

        for tag in hashtags:
            # Time-weighted score: recent tweets count more
            time_weight = 2 ** (-(now - tweet.timestamp) / self.HALF_LIFE)
            self.hashtag_counts[tag] += time_weight

    def get_trending(self, limit: int = 20) -> List[TrendingTopic]:
        """Get top trending topics"""
        trending = []
        for tag, score in self.hashtag_counts.items():
            baseline = self.baseline_counts.get(tag, 1)
            # Velocity: how much above baseline
            velocity = score / baseline
            trending.append(TrendingTopic(
                hashtag=tag,
                score=score,
                velocity=velocity,
                tweet_count=int(score)
            ))

        trending.sort(key=lambda t: t.velocity, reverse=True)
        return trending[:limit]
```

### 10.2 Geographic Trending

```
┌─────────────────────────────────────────────────────────────┐
│              GEOGRAPHIC TRENDING                             │
│                                                             │
│  Setiap region punya trending sendiri:                      │
│                                                             │
│  Region: Indonesia                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 1. #Pemilu2026          125K tweets    ↑ 450%        │  │
│  │ 2. #TimnasIndonesia      89K tweets    ↑ 320%        │  │
│  │ 3. #GempaCianjur       67K tweets    ↑ 280%         │  │
│  │ 4. #HargaBBM           45K tweets    ↑ 150%         │  │
│  │ 5. #FilmIndonesia      34K tweets    ↑ 120%         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Region: Global                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 1. #WorldCup2026        2.1M tweets   ↑ 890%        │  │
│  │ 2. #AI                  1.5M tweets   ↑ 340%        │  │
│  │ 3. #ClimateAction       980K tweets   ↑ 210%        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Implementation:                                            │
│  - Tweet dengan geo tag → masuk region counter             │
│  - Tweet tanpa geo tag → masuk global counter              │
│  - User IP/location → tentukan region default              │
└─────────────────────────────────────────────────────────────┘
```

### 10.3 Personalized Trending

**Trending yang relevan untuk setiap user:**
```python
def get_personalized_trending(user_id: str, limit: int = 10) -> List[TrendingTopic]:
    """
    Personalized trending berdasarkan:
    1. Who user follows
    2. User's interests (based on tweet history)
    3. User's location
    4. Global trending (fallback)
    """
    # Get user's interest categories
    interests = ml_service.get_user_interests(user_id)

    # Get trending in user's region
    region = geo_service.get_user_region(user_id)
    regional_trending = trending_service.get_regional(region)

    # Get trending from followed users' topics
    following = graph_service.get_following(user_id)
    follow_trending = trending_service.get_from_users(following)

    # Merge with weights
    scores = defaultdict(float)
    for topic in regional_trending:
        scores[topic.hashtag] += topic.score * 0.4  # Regional weight
    for topic in follow_trending:
        scores[topic.hashtag] += topic.score * 0.3  # Follow weight
    for topic in interests:
        scores[topic.hashtag] += topic.score * 0.3  # Interest weight

    return sorted(scores.items(), key=lambda x: x[1], reverse=True)[:limit]
```

---

## 11. ANALYTICS & METRICS

### 11.1 Impression Tracking

**Setiap tweet yang muncul di timeline = 1 impression:**
```python
class ImpressionTracker:
    def log_impression(self, user_id: str, tweet_id: str, context: str):
        """Log that a tweet was shown to a user"""
        self.kafka.produce("impressions", {
            "user_id": user_id,
            "tweet_id": tweet_id,
            "context": context,  # "home_timeline", "profile", "search"
            "timestamp": time.time(),
            "position": 0  # Position in timeline
        })

    def log_engagement(self, user_id: str, tweet_id: str, action: str):
        """Log user engagement with a tweet"""
        self.kafka.produce("engagements", {
            "user_id": user_id,
            "tweet_id": tweet_id,
            "action": action,  # "like", "retweet", "reply", "click", "bookmark"
            "timestamp": time.time()
        })
```

### 11.2 Engagement Metrics

**Real-time metrics calculation:**
```
┌─────────────────────────────────────────────────────────────┐
│                    ENGAGEMENT METRICS                        │
│                                                             │
│  Metrics per tweet:                                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Impression Count    │ Total times tweet was shown    │  │
│  │ Engagement Rate     │ (likes + retweets + replies)   │  │
│  │                     │ / impressions × 100            │  │
│  │ Click-through Rate  │ Link clicks / impressions × 100│  │
│  │ Virality Score      │ Retweets / impressions × 1000  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Metrics per user (daily):                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Tweets Posted       │ Number of tweets               │  │
│  │ Timeline Views      │ How often user opens app       │  │
│  │ Session Duration    │ Average time per session       │  │
│  │ Follows Given       │ New follows per day            │  │
│  │ Follows Received    │ New followers per day          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 11.3 Real-time Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│                    REAL-TIME DASHBOARD                               │
│                                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │
│  │ Active Users │ │ Tweets/sec   │ │ Timeline QPS │ │ Error Rate │ │
│  │   245.2M     │ │   12,456     │ │   2.1M       │ │   0.02%    │ │
│  │   ▲ +2.1%    │ │   ▲ +15%     │ │   ▲ +5%      │ │   ▼ -0.01% │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘ │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    REGIONAL BREAKDOWN                           │ │
│  │  US: 89M users  │  EU: 67M  │  Asia: 120M  │  Other: 45M     │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    TOP TRENDING                                 │ │
│  │  1. #SystemDesign    45K/min  │  2. #AI          38K/min     │ │
│  │  3. #WebDev          29K/min  │  4. #OpenSource  25K/min     │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  Tech Stack:                                                         │
│  - Druid/Pinot for real-time OLAP                                   │
│  - Grafana for visualization                                        │
│  - Prometheus for metrics collection                                │
│  - Kafka for event streaming                                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 12. SCALING ROADMAP

### 12.1 1K Users (MVP)

```
┌─────────────────────────────────────────────────────────────┐
│                    1K USERS — MVP                            │
│                                                             │
│  Architecture: Single server, monolith                       │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │              SINGLE SERVER                       │  │  │
│  │  │                                                  │  │  │
│  │  │  ┌─────────┐  ┌──────────┐  ┌────────────────┐  │  │  │
│  │  │  │ Nginx   │→ │ Flask   │→ │ PostgreSQL     │  │  │  │
│  │  │  │ (HTTP)  │  │ (App)   │  │ (All data)     │  │  │  │
│  │  │  └─────────┘  └──────────┘  └────────────────┘  │  │  │
│  │  │                                                  │  │  │
│  │  │  Specs: 4 CPU, 8GB RAM, 100GB SSD               │  │  │
│  │  │  Cost: ~$50/bulan                               │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Capacity:                                                  │
│  - 1K users, 100 tweets/hari                                │
│  - Fan-out on write (semua user normal)                     │
│  - No cache needed                                          │
│  - Single DB instance                                       │
└─────────────────────────────────────────────────────────────┘
```

### 12.2 1M Users

```
┌─────────────────────────────────────────────────────────────┐
│                    1M USERS — GROWTH                         │
│                                                             │
│  Architecture: Service separation + cache                    │
│                                                             │
│  ┌─────────────┐                                            │
│  │   CDN       │ ← Static assets, media                    │
│  └──────┬──────┘                                            │
│         │                                                   │
│  ┌──────┴──────┐                                            │
│  │ API Gateway │ ← Rate limiting, auth                     │
│  └──────┬──────┘                                            │
│         │                                                   │
│  ┌──────┴──────────────────────────────┐                   │
│  │              SERVICES               │                   │
│  │  ┌────────┐ ┌──────────┐ ┌───────┐ │                   │
│  │  │ Tweet  │ │ Timeline │ │ User  │ │                   │
│  │  │Service │ │ Service  │ │Service│ │                   │
│  │  └───┬────┘ └────┬─────┘ └───┬───┘ │                   │
│  └──────┼───────────┼───────────┼─────┘                   │
│         │           │           │                         │
│  ┌──────┴───────────┴───────────┴─────┐                   │
│  │          DATA LAYER                │                   │
│  │  ┌──────────┐  ┌──────┐  ┌──────┐ │                   │
│  │  │PostgreSQL│  │Redis │  │ S3   │ │                   │
│  │  │(primary) │  │(cache)│  │(media)│ │                   │
│  │  └──────────┘  └──────┘  └──────┘ │                   │
│  └────────────────────────────────────┘                   │
│                                                             │
│  Capacity:                                                  │
│  - 1M users, 100K tweets/hari                               │
│  - Redis cache untuk timeline                               │
│  - PostgreSQL dengan read replica                           │
│  - Fan-out on write masih feasible                          │
│  - 3-5 server instances                                     │
└─────────────────────────────────────────────────────────────┘
```

### 12.3 100M Users

```
┌─────────────────────────────────────────────────────────────┐
│                    100M USERS — SCALE                        │
│                                                             │
│  Architecture: Microservices + distributed systems           │
│                                                             │
│  Multi-region deployment:                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  US-EAST     │  │  EU-WEST     │  │  AP-SE       │      │
│  │              │  │              │  │              │      │
│  │  ┌────────┐  │  │  ┌────────┐  │  │  ┌────────┐  │      │
│  │  │API GW  │  │  │  │API GW  │  │  │  │API GW  │  │      │
│  │  └───┬────┘  │  │  └───┬────┘  │  │  └───┬────┘  │      │
│  │  ┌───┴────┐  │  │  ┌───┴────┐  │  │  ┌───┴────┐  │      │
│  │  │Services│  │  │  │Services│  │  │  │Services│  │      │
│  │  └───┬────┘  │  │  └───┬────┘  │  │  └───┬────┘  │      │
│  └──────┼────────┘  └──────┼────────┘  └──────┼────────┘      │
│         │                 │                 │                │
│  ┌──────┴─────────────────┴─────────────────┴────────┐      │
│  │              GLOBAL DATA LAYER                     │      │
│  │  ┌──────────┐  ┌──────┐  ┌──────┐  ┌──────────┐  │      │
│  │  │Cassandra │  │Redis │  │Kafka │  │Elastic   │  │      │
│  │  │(tweets)  │  │Cluster│ │(events│  │(search)  │  │      │
│  │  │          │  │      │  │stream)│  │          │  │      │
│  │  └──────────┘  └──────┘  └──────┘  └──────────┘  │      │
│  └────────────────────────────────────────────────────┘      │
│                                                             │
│  Capacity:                                                  │
│  - 100M users, 50M tweets/hari                              │
│  - Hybrid fan-out (threshold: 10K followers)                │
│  - Cassandra untuk tweet storage                            │
│  - Kafka untuk async processing                             │
│  - 50-100 servers                                           │
└─────────────────────────────────────────────────────────────┘
```

### 12.4 500M Users (Production Twitter)

```
┌─────────────────────────────────────────────────────────────┐
│                    500M USERS — PRODUCTION                   │
│                                                             │
│  Architecture: Full distributed, multi-region, multi-tier    │
│                                                             │
│  Key changes from 100M:                                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 1. Custom infrastructure (Twitter Manifold, Gizzard)  │  │
│  │ 2. Edge computing untuk timeline generation           │  │
│  │ 3. ML-based timeline ranking (algorithmic timeline)   │  │
│  │ 4. Real-time analytics pipeline (Druid/Pinot)         │  │
│  │ 5. A/B testing framework untuk feature rollout        │  │
│  │ 6. Chaos engineering untuk resilience                 │  │
│  │ 7. Multi-active regions dengan data replication       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Capacity:                                                  │
│  - 500M DAU, 500M tweets/hari                               │
│  - 100B timeline reads/hari                                 │
│  - 300K+ QPS peak                                           │
│  - 1000+ servers across multiple regions                    │
│  - PB-scale storage                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 13. FAILURE HANDLING & RESILIENCE

### 13.1 Cascade Failure Prevention

**Problem:** Satu service down → service lain ikut down → seluruh sistem collapse
**Solution:** Circuit breaker, bulkhead, graceful degradation

```
┌─────────────────────────────────────────────────────────────┐
│              CIRCUIT BREAKER PATTERN                         │
│                                                             │
│  States:                                                    │
│  ┌──────────┐    error rate     ┌──────────┐                │
│  │  CLOSED  │ ────────────────→ │   OPEN   │                │
│  │ (normal) │    > threshold    │(blocking)│                │
│  └──────────┘                   └────┬─────┘                │
│       ▲                              │ timeout              │
│       │ success                      ▼                      │
│  ┌──────────┐                   ┌──────────┐                │
│  │ HALF-    │ ←─ test request ─ │  OPEN    │                │
│  │ OPEN     │                   │(waiting) │                │
│  └──────────┘                   └──────────┘                │
│                                                             │
│  Implementation (pseudo):                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ class CircuitBreaker:                                 │  │
│  │     def call(self, service_func):                     │  │
│  │         if self.state == OPEN:                        │  │
│  │             if now() > self.timeout:                  │  │
│  │                 self.state = HALF_OPEN                │  │
│  │             else:                                     │  │
│  │                 raise CircuitOpenError()              │  │
│  │                                                       │  │
│  │         try:                                          │  │
│  │             result = service_func()                   │  │
│  │             self.on_success()                         │  │
│  │             return result                             │  │
│  │         except Exception:                             │  │
│  │             self.on_failure()                         │  │
│  │             raise                                     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 13.2 Graceful Degradation

**Saat sistem under heavy load, turunkan fitur secara bertahap:**

```
┌─────────────────────────────────────────────────────────────┐
│              GRACEFUL DEGRADATION LEVELS                     │
│                                                             │
│  Level 0 — NORMAL (100% capacity):                          │
│  ✓ Semua fitur aktif                                        │
│  ✓ Real-time timeline                                       │
│  ✓ Push notifications                                       │
│  ✓ Search real-time                                         │
│  ✓ Trending real-time                                       │
│                                                             │
│  Level 1 — HIGH LOAD (75% capacity):                        │
│  ✓ Timeline tetap real-time                                 │
│  ✓ Tweet posting normal                                     │
│  ⚠ Push notifications di-batch (delay 30s)                  │
│  ⚠ Search cache-only (no real-time index)                   │
│  ✓ Trending normal                                          │
│                                                             │
│  Level 2 — VERY HIGH LOAD (50% capacity):                   │
│  ✓ Timeline dari cache (mungkin stale 5 menit)              │
│  ✓ Tweet posting normal                                     │
│  ✗ Push notifications disabled                              │
│  ✗ Search disabled                                          │
│  ⚠ Trending update setiap 10 menit                          │
│                                                             │
│  Level 3 — CRITICAL (25% capacity):                         │
│  ✓ Timeline static (last known good)                        │
│  ✓ Tweet posting queue (async)                              │
│  ✗ Semua non-core features disabled                         │
│  ✓ Read-only mode untuk profile                             │
│                                                             │
│  Level 4 — EMERGENCY (< 10% capacity):                      │
│  ✓ Hanya bisa baca tweet (read-only)                        │
│  ✗ Tidak bisa tweet, like, follow                           │
│  ✓ Status page aktif                                        │
└─────────────────────────────────────────────────────────────┘
```

### 13.3 Retry Strategy

```python
class RetryStrategy:
    def execute_with_retry(self, func, max_retries=3):
        """Exponential backoff retry"""
        for attempt in range(max_retries):
            try:
                return func()
            except TransientError as e:
                if attempt == max_retries - 1:
                    raise
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                time.sleep(wait_time)
            except PermanentError:
                raise  # Don't retry permanent errors
```

---

## 14. MONITORING & OBSERVABILITY

### 14.1 Key Metrics (RED Method)

```
┌─────────────────────────────────────────────────────────────┐
│              RED METHOD METRICS                              │
│                                                             │
│  Rate    — Request per second                               │
│  Errors  — Error rate per second                            │
│  Duration — Response time distribution (p50, p95, p99)      │
│                                                             │
│  Per-service metrics:                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ API Gateway:                                         │  │
│  │   - Total QPS                                        │  │
│  │   - Error rate (4xx, 5xx)                            │  │
│  │   - Latency p50/p95/p99                              │  │
│  │   - Rate limit hits                                  │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Timeline Service:                                    │  │
│  │   - Timeline generation time                         │  │
│  │   - Cache hit rate                                   │  │
│  │   - Fan-out latency                                  │  │
│  │   - Timeline size distribution                       │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Tweet Service:                                       │  │
│  │   - Tweet creation latency                           │  │
│  │   - DB write latency                                 │  │
│  │   - Media attachment rate                            │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Cache (Redis):                                       │  │
│  │   - Hit/miss ratio                                   │  │
│  │   - Memory usage                                     │  │
│  │   - Eviction rate                                    │  │
│  │   - Connection count                                 │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Database (Cassandra):                                │  │
│  │   - Read/write latency                               │  │
│  │   - Replication lag                                  │  │
│  │   - Compaction status                                │  │
│  │   - Disk usage                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 14.2 Alerting Rules

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ALERTING RULES                                    │
├──────────────────────────┬──────────────────┬───────────────────────┤
│ Condition                │ Severity         │ Action                │
├──────────────────────────┼──────────────────┼───────────────────────┤
│ Error rate > 1%          │ P1 (Critical)    │ Page on-call          │
│                          │                  │ engineer              │
├──────────────────────────┼──────────────────┼───────────────────────┤
│ Latency p99 > 1s         │ P1 (Critical)    │ Auto-scale + page     │
├──────────────────────────┼──────────────────┼───────────────────────┤
│ Cache hit rate < 80%     │ P2 (High)        │ Investigate + scale   │
├──────────────────────────┼──────────────────┼───────────────────────┤
│ Disk usage > 85%         │ P2 (High)        │ Cleanup + alert       │
├──────────────────────────┼──────────────────┼───────────────────────┤
│ Queue lag > 10K messages │ P2 (High)        │ Scale consumers       │
├──────────────────────────┼──────────────────┼───────────────────────┤
│ DB replication lag > 5s  │ P1 (Critical)    │ Investigate           │
├──────────────────────────┼──────────────────┼───────────────────────┤
│ Memory usage > 90%       │ P2 (High)        │ Scale + investigate   │
├──────────────────────────┼──────────────────┼───────────────────────┤
│ Active users drop > 20%  │ P1 (Critical)    │ Page + rollback       │
│ (from baseline)          │                  │ recent deploy         │
└──────────────────────────┴──────────────────┴───────────────────────┘
```

### 14.3 Distributed Tracing

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DISTRIBUTED TRACING                               │
│                                                                      │
│  Trace ID: abc123-def456-ghi789                                     │
│                                                                      │
│  [API Gateway] ──→ [Timeline Service] ──→ [Redis Cache]             │
│       │                    │                      │                 │
│  0ms  │              5ms   │                2ms   │                 │
│       │                    │                      │                 │
│       │               [Graph Service] ──→ [Cassandra]               │
│       │                    │                      │                 │
│       │              15ms  │                8ms   │                 │
│       │                    │                      │                 │
│       │               [Notification Service]                        │
│       │                    │                                        │
│       │              3ms   │                                        │
│       ▼                    ▼                                        │
│  Total: 33ms (p50) / 89ms (p95) / 245ms (p99)                      │
│                                                                      │
│  Tools: Jaeger, Zipkin, OpenTelemetry                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📚 REFERENSI

- [donnemartin/system-design-primer — Twitter](https://github.com/donnemartin/system-design-primer/tree/master/solutions/system_design/twitter)
- [Twitter's Infrastructure Blog](https://blog.twitter.com/engineering)
- [Twitter Snowflake ID](https://github.com/twitter-archive/snowflake)
- [InfoQ: Twitter's Real-time Infrastructure](https://www.infoq.com/presentations/Twitter-Timeline-Scalability)
- [High Scalability: Twitter Architecture](http://highscalability.com/blog/2012/1/23/twitter-architecture-2012.html)

---

## ✅ CHECKLIST PEMAHAMAN

- [ ] Bisa menjelaskan 3 strategi timeline generation + trade-off masing-masing
- [ ] Bisa menghitung QPS dan storage dari user/tweet count
- [ ] Paham mengapa Twitter pilih AP over CP di CAP theorem
- [ ] Bisa menjelaskan hybrid fan-out approach
- [ ] Paham Snowflake ID generation
- [ ] Bisa design media upload pipeline
- [ ] Paham circuit breaker dan graceful degradation
- [ ] Bisa menjelaskan scaling roadmap dari 1K ke 500M users
- [ ] Paham RED method untuk monitoring
- [ ] Bisa design notification batching system

---

> **Lanjut ke:** [`09-arsitektur-youtube-netflix.md`](./09-arsitektur-youtube-netflix.md)