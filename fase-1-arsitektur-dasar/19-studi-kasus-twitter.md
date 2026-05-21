# 19 — Studi Kasus: Desain Sistem Twitter/X

> **Estimasi:** 3 jam | **Level:** Menengah-Lanjut
> **Sumber:** [donnemartin/system-design-primer — Twitter](https://github.com/donnemartin/system-design-primer/tree/master/solutions/system_design/twitter)

---

## 📖 TEORI

### 19.1 Pendahuluan

Twitter (sekarang X) adalah salah satu platform media sosial terbesar di dunia dengan ratusan juta pengguna aktif harian. Mendesain sistem seperti Twitter adalah tantangan system design klasik yang menguji pemahaman Anda tentang skalabilitas, konsistensi data, dan trade-off arsitektur.

Studi kasus ini akan membedah Twitter dari nol: mulai dari requirements gathering, capacity estimation, API design, high-level architecture, database design, feed generation strategy, media storage, trending topics, notification system, hingga scaling dan failure handling.

**Kenapa Twitter penting dipelajari?**

Karena Twitter mengandung hampir semua pola system design fundamental:
- **Fan-out pattern** — mendistribusikan data ke banyak penerima
- **Read-heavy workload** — rasio baca:tulis bisa 100:1
- **Hybrid storage** — SQL + NoSQL + Cache + Search engine
- **Timeline generation** — masalah ranking dan sorting real-time
- **Hot key problem** — celebrity dengan jutaan follower

---

### 19.2 Requirements Analysis

#### A. Functional Requirements (Kebutuhan Fungsional)

Functional requirements mendefinisikan **apa yang sistem harus lakukan**. Untuk Twitter, kita identifikasi:

| # | Requirement | Deskripsi |
|---|---|---|
| FR-1 | **Create Tweet** | User bisa membuat tweet baru (maks 280 karakter) |
| FR-2 | **Read Timeline** | User bisa melihat timeline berisi tweet dari orang yang di-follow |
| FR-3 | **Follow/Unfollow** | User bisa mengikuti atau berhenti mengikuti user lain |
| FR-4 | **Search Tweets** | User bisa mencari tweet berdasarkan kata kunci |
| FR-5 | **Like/Retweet** | User bisa menyukai atau me-retweet tweet orang lain |
| FR-6 | **Upload Media** | User bisa melampirkan foto/video ke tweet |
| FR-7 | **Notification** | User mendapat notifikasi saat ada yang follow, like, reply |
| FR-8 | **Trending Topics** | Sistem menampilkan topik yang sedang trending |
| FR-9 | **User Profile** | User bisa melihat profil, tweet history, follower count |

**Prioritas MVP (Minimum Viable Product):**
```
Phase 1 (MVP):     FR-1, FR-2, FR-3, FR-9
Phase 2:           FR-4, FR-5, FR-6
Phase 3:           FR-7, FR-8
```

#### B. Non-Functional Requirements (Kebutuhan Non-Fungsional)

Non-functional requirements mendefinisikan **bagaimana sistem harus berperilaku**:

| # | Requirement | Target | Alasan |
|---|---|---|---|
| NFR-1 | **Latency Timeline** | < 200ms (p99) | User mengharapkan timeline muncul instan |
| NFR-2 | **Latency Post Tweet** | < 500ms (p99) | Write bisa sedikit lebih lambat |
| NFR-3 | **Availability** | 99.99% (4 nine) | Platform sosial harus selalu online |
| NFR-4 | **Consistency** | Eventual consistency | Timeline tidak perlu strongly consistent |
| NFR-5 | **Durability** | Tidak boleh kehilangan tweet | Data tweet harus persisten |
| NFR-6 | **Scalability** | Handle 500M DAU | Harus bisa tumbuh tanpa redesign |
| NFR-7 | **Read:Write Ratio** | ~100:1 | User lebih banyak baca daripada tulis |

**Trade-off Analysis:**

```
CAP Theorem untuk Twitter:
┌─────────────────────────────────────────────────────┐
│  Partition Tolerance (P) = WAJIB                    │
│  (sistem terdistribusi pasti ada network partition) │
│                                                     │
│  Consistency (C) vs Availability (A):               │
│  - Timeline → AP (eventual consistency,             │
│    lebih penting selalu tersedia)                   │
│  - Follow count → CP (butuh akurat)                 │
│  - Tweet data → CP (tidak boleh hilang)             │
│                                                     │
│  Kesimpulan: Twitter butuh KEDUA pola,              │
│  tergantung fitur!                                  │
└─────────────────────────────────────────────────────┘
```

---

### 19.3 Capacity Estimation

Capacity estimation membantu kita menentukan berapa banyak resource yang dibutuhkan. Ini adalah langkah kritis dalam system design interview dan perencanaan nyata.

#### A. Traffic Estimation

**Asumsi dasar:**
- Daily Active Users (DAU): 500 juta
- Tweet per user per hari: 1 (rata-rata)
- Timeline read per user per hari: 50
- Follow per user: rata-rata 200
- Media attachment rate: 20% tweet

**Perhitungan:**

```
┌────────────────────────────────────────────────────────────┐
│ TWEET WRITE (Create Tweet)                                 │
├────────────────────────────────────────────────────────────┤
│ Tweet per hari     = 500M user × 1 tweet/user              │
│                    = 500 juta tweet/hari                    │
│                                                            │
│ Tweet per detik    = 500M / 86,400 detik                   │
│                    = ~5,787 tweet/detik (avg)               │
│ Peak (10x avg)     = ~58,000 tweet/detik                   │
├────────────────────────────────────────────────────────────┤
│ TIMELINE READ                                              │
├────────────────────────────────────────────────────────────┤
│ Timeline read/hari = 500M user × 50 read/user              │
│                    = 25 miliar read/hari                    │
│                                                            │
│ Timeline read/dtk  = 25B / 86,400                          │
│                    = ~289,000 read/detik (avg)              │
│ Peak (10x avg)     = ~2.9 juta read/detik                  │
├────────────────────────────────────────────────────────────┤
│ Rasio Read:Write   = 289,000 : 5,787                       │
│                    = ~50:1 (read sangat dominan!)           │
└────────────────────────────────────────────────────────────┘
```

#### B. Storage Estimation

```
┌────────────────────────────────────────────────────────────┐
│ STORAGE PER TWEET                                          │
├────────────────────────────────────────────────────────────┤
│ Tweet ID           = 8 bytes (BIGINT)                      │
│ User ID            = 8 bytes                               │
│ Content            = 280 bytes (UTF-8, max)                │
│ Created_at         = 8 bytes (timestamp)                   │
│ Metadata           = 100 bytes (likes, retweets, etc.)     │
│ ─────────────────────────────────────                      │
│ Total per tweet    = ~404 bytes ≈ 500 bytes                │
├────────────────────────────────────────────────────────────┤
│ STORAGE PER HARI                                           │
├────────────────────────────────────────────────────────────┤
│ Tweet storage/hari = 500M × 500 bytes                      │
│                    = 250 GB/hari                            │
│                                                            │
│ Storage/tahun      = 250 GB × 365                          │
│                    = ~91 TB/tahun                           │
│                                                            │
│ Storage 10 tahun   = ~910 TB ≈ 1 PB                        │
│ (belum termasuk media, index, cache, replikasi)            │
├────────────────────────────────────────────────────────────┤
│ FOLLOW RELATIONSHIP STORAGE                                │
├────────────────────────────────────────────────────────────┤
│ Total follow       = 500M × 200 follow/user                │
│                    = 100 miliar follow relationship         │
│                                                            │
│ Storage follow     = 100B × 16 bytes (2 × BIGINT)          │
│                    = ~1.6 TB                                │
├────────────────────────────────────────────────────────────┤
│ MEDIA STORAGE                                              │
├────────────────────────────────────────────────────────────┤
│ Tweet dengan media = 500M × 20% = 100M tweet/hari          │
│ Rata-rata media    = 500 KB/foto, 5 MB/video               │
│ Media storage/hari = 100M × 1 MB (rata-rata)               │
│                    = ~100 TB/hari                           │
│                                                            │
│ Media/tahun        = ~36.5 PB/tahun!                       │
│ → Perlu Object Storage (S3, GCS)                           │
└────────────────────────────────────────────────────────────┘
```

#### C. Bandwidth Estimation

```
┌────────────────────────────────────────────────────────────┐
│ BANDWIDTH                                                  │
├────────────────────────────────────────────────────────────┤
│ Read bandwidth     = 25B read × 50 tweet × 500 bytes       │
│                    = 625 TB/hari (outgoing)                 │
│                                                            │
│ Write bandwidth    = 500M tweet × 500 bytes                │
│                    = 250 GB/hari (incoming)                 │
│                                                            │
│ Total bandwidth    = ~625 TB/hari outgoing                  │
│                    = ~7.2 Gbps sustained                    │
│ Peak               = ~72 Gbps                               │
└────────────────────────────────────────────────────────────┘
```

**Kesimpulan Capacity:**
- Butuh **ribuan server** untuk handle 2.9 juta read/detik di peak
- **Object storage** untuk media (PB scale)
- **Cache layer besar** untuk timeline (Redis/Memcached cluster)
- **CDN** untuk distribusi media ke user global

---

### 19.4 API Design

API adalah kontrak antara client dan server. Kita desain RESTful API yang clean dan versioned.

#### A. Tweet API

```
┌─────────────────────────────────────────────────────────────────────┐
│ POST /api/v1/tweets                                                 │
│ Deskripsi: Membuat tweet baru                                       │
│ Auth: Bearer token                                                  │
│                                                                     │
│ Request Body:                                                       │
│ {                                                                   │
│   "content": "Belajar system design hari ini!",                     │
│   "media_ids": ["img_001", "img_002"],  // optional                 │
│   "reply_to": null                        // optional               │
│ }                                                                   │
│                                                                     │
│ Response 201 Created:                                               │
│ {                                                                   │
│   "id": "1234567890",                                               │
│   "content": "Belajar system design hari ini!",                     │
│   "user_id": "user_42",                                             │
│   "created_at": "2025-04-16T10:30:00Z",                             │
│   "media_urls": ["https://cdn.twitter.com/img_001.jpg"],            │
│   "metrics": {"likes": 0, "retweets": 0, "replies": 0}             │
│ }                                                                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ GET /api/v1/tweets/:tweet_id                                        │
│ Deskripsi: Mendapatkan detail satu tweet                            │
│ Response 200 OK: { tweet object }                                   │
└─────────────────────────────────────────────────────────────────────┘
```

#### B. Timeline API

```
┌─────────────────────────────────────────────────────────────────────┐
│ GET /api/v1/timeline                                                │
│ Deskripsi: Mendapatkan timeline user yang sedang login              │
│ Query Parameters:                                                   │
│   - limit: jumlah tweet (default: 20, max: 100)                     │
│   - cursor: pagination cursor (untuk infinite scroll)               │
│                                                                     │
│ Response 200 OK:                                                    │
│ {                                                                   │
│   "tweets": [ {...}, {...}, ... ],                                  │
│   "next_cursor": "eyJpZCI6IjEyMyJ9",                                │
│   "has_more": true                                                  │
│ }                                                                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ GET /api/v1/users/:user_id/timeline                                 │
│ Deskripsi: Mendapatkan tweet history seorang user                   │
│ (bukan timeline yang di-follow, tapi tweet mereka sendiri)          │
└─────────────────────────────────────────────────────────────────────┘
```

#### C. Follow API

```
┌─────────────────────────────────────────────────────────────────────┐
│ POST /api/v1/users/:user_id/follow                                  │
│ Deskripsi: Follow seorang user                                      │
│ Response 200 OK: { "following": true, "follower_count": 1500 }      │
│                                                                     │
│ DELETE /api/v1/users/:user_id/follow                                │
│ Deskripsi: Unfollow seorang user                                    │
│ Response 200 OK: { "following": false, "follower_count": 1499 }     │
│                                                                     │
│ GET /api/v1/users/:user_id/followers                                │
│ Deskripsi: List follower seorang user                               │
│                                                                     │
│ GET /api/v1/users/:user_id/following                                │
│ Deskripsi: List user yang di-follow                                 │
└─────────────────────────────────────────────────────────────────────┘
```

#### D. Search API

```
┌─────────────────────────────────────────────────────────────────────┐
│ GET /api/v1/search/tweets?q=system+design&from=user_42&since=2025-01-01
│ Deskripsi: Mencari tweet dengan filter                              │
│ Query Parameters:                                                   │
│   - q: kata kunci pencarian (wajib)                                 │
│   - from: filter berdasarkan user                                   │
│   - since/until: filter tanggal                                     │
│   - limit: jumlah hasil (default: 20, max: 100)                     │
│   - cursor: pagination                                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 19.5 High-Level Architecture

Arsitektur Twitter terdiri dari beberapa layer yang bekerja bersama:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           TWITTER SYSTEM ARCHITECTURE                        │
└──────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   CLIENT    │
                              │ (Web/Mobile)│
                              └──────┬──────┘
                                     │ HTTPS
                              ┌──────▼──────┐
                              │     CDN     │ ← Media statis (foto, video, CSS, JS)
                              └──────┬──────┘
                                     │
                              ┌──────▼──────┐
                              │  Load       │ ← Distribusi traffic ke banyak server
                              │ Balancer    │
                              └──────┬──────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
            ┌───────────┐   ┌───────────┐   ┌───────────┐
            │  API      │   │  API      │   │  API      │
            │ Server 1  │   │ Server 2  │   │ Server N  │
            └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
                  │               │               │
            ┌─────┴───────────────┴───────────────┴─────┐
            │              SERVICE LAYER                │
            ├───────────────────────────────────────────┤
            │ ┌─────────┐ ┌──────────┐ ┌─────────────┐ │
            │ │ Tweet   │ │ Timeline │ │ User/Follow │ │
            │ │ Service │ │ Service  │ │ Service     │ │
            │ └────┬────┘ └────┬─────┘ └─────┬───────┘ │
            │      │           │             │          │
            │ ┌────┴────┐ ┌────┴─────┐ ┌────┴───────┐ │
            │ │ Search  │ │Notification│ │Trending   │ │
            │ │ Service │ │ Service   │ │ Service   │ │
            │ └─────────┘ └──────────┘ └───────────┘ │
            └──────────────────────────────────────────┘
                    │               │               │
            ┌───────┴───────────────┴───────────────┴───────┐
            │              DATA LAYER                        │
            ├───────────────────────────────────────────────┤
            │ ┌─────────┐ ┌──────────┐ ┌─────────────────┐ │
            │ │ MySQL   │ │  Redis   │ │  Elasticsearch  │ │
            │ │ Cluster │ │ Cluster  │ │ (Search Index)  │ │
            │ │(Tweets, │ │(Timeline │ │                 │ │
            │ │ Users,  │ │ Cache,   │ │                 │ │
            │ │ Follows)│ │ Session) │ │                 │ │
            │ └─────────┘ └──────────┘ └─────────────────┘ │
            │                                               │
            │ ┌───────────────────────────────────────────┐ │
            │ │         Object Storage (S3/GCS)           │ │
            │ │    (Foto, Video, Media Attachment)        │ │
            │ └───────────────────────────────────────────┘ │
            │                                               │
            │ ┌───────────────────────────────────────────┐ │
            │ │         Message Queue (Kafka)             │ │
            │ │    (Async: Fan-out, Notification,         │ │
            │ │     Analytics, Trending)                  │ │
            │ └───────────────────────────────────────────┘ │
            └───────────────────────────────────────────────┘
```

**Penjelasan Setiap Layer:**

| Layer | Komponen | Fungsi |
|---|---|---|
| **Client** | Web, iOS, Android | UI untuk user berinteraksi |
| **CDN** | CloudFront, Cloudflare | Cache media statis di edge server global |
| **Load Balancer** | Nginx, HAProxy, ALB | Distribusi request ke API server |
| **API Server** | Stateless web server | Handle HTTP request, validasi, auth |
| **Service Layer** | Microservices | Business logic per domain |
| **Data Layer** | DB, Cache, Search, Queue | Penyimpanan dan retrieval data |

---

### 19.6 Database Design

Twitter menggunakan **polyglot persistence** — kombinasi beberapa jenis database untuk kebutuhan berbeda.

#### A. SQL Database (MySQL/PostgreSQL)

Untuk data yang butuh **consistency dan relational integrity**:

```sql
-- ============================================
-- TABEL USERS
-- ============================================
CREATE TABLE users (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    username        VARCHAR(50) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    display_name    VARCHAR(100),
    bio             VARCHAR(160),
    avatar_url      VARCHAR(500),
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    tweets_count    INT DEFAULT 0,
    verified        BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ============================================
-- TABEL TWEETS
-- ============================================
CREATE TABLE tweets (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id         BIGINT NOT NULL,
    content         VARCHAR(280),
    reply_to_id     BIGINT NULL,
    retweet_of_id   BIGINT NULL,
    media_count     INT DEFAULT 0,
    likes_count     INT DEFAULT 0,
    retweets_count  INT DEFAULT 0,
    replies_count   INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (reply_to_id) REFERENCES tweets(id),
    FOREIGN KEY (retweet_of_id) REFERENCES tweets(id),

    -- Index untuk query timeline per user
    INDEX idx_user_created (user_id, created_at DESC),
    -- Index untuk search (tapi search pakai Elasticsearch)
    INDEX idx_created (created_at DESC)
) ENGINE=InnoDB;

-- ============================================
-- TABEL FOLLOWS (Social Graph)
-- ============================================
CREATE TABLE follows (
    follower_id     BIGINT NOT NULL,
    followee_id     BIGINT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (follower_id, followee_id),
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (followee_id) REFERENCES users(id),

    -- Index untuk query "siapa yang di-follow user X"
    INDEX idx_followee (followee_id, follower_id),
    -- Index untuk query "siapa follower user X"
    INDEX idx_follower (follower_id, followee_id)
) ENGINE=InnoDB;

-- ============================================
-- TABEL TWEET_MEDIA
-- ============================================
CREATE TABLE tweet_media (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    tweet_id        BIGINT NOT NULL,
    media_type      ENUM('photo', 'video', 'gif') NOT NULL,
    media_url       VARCHAR(1000) NOT NULL,
    thumbnail_url   VARCHAR(1000),
    width           INT,
    height          INT,
    file_size       BIGINT,

    FOREIGN KEY (tweet_id) REFERENCES tweets(id),
    INDEX idx_tweet (tweet_id)
) ENGINE=InnoDB;
```

**Sharding Strategy untuk SQL:**

Karena data tweets akan mencapai PB scale, kita perlu **sharding**:

```
┌─────────────────────────────────────────────────────────────┐
│ SHARDING STRATEGY                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Sharding Key: user_id                                      │
│  (semua data satu user ada di shard yang sama)              │
│                                                             │
│  Metode: Consistent Hashing                                 │
│  Jumlah Shard: 1024 (bisa ditambah tanpa rehash semua)      │
│                                                             │
│  Contoh:                                                    │
│  user_id = 42                                               │
│  hash(42) mod 1024 = shard_42                               │
│  → Semua tweet user 42 ada di shard_42                      │
│  → Follow data user 42 juga di shard_42                     │
│                                                             │
│  Keuntungan:                                                │
│  - Query per user tidak perlu cross-shard                   │
│  - Timeline generation lebih efisien                        │
│                                                             │
│  Tantangan:                                                 │
│  - Celebrity (Justin Bieber) → hot shard                    │
│  - Solusi: Celebrity shard terpisah + read replica          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### B. NoSQL Database (Cassandra/DynamoDB)

Untuk data yang butuh **high write throughput dan horizontal scaling**:

```
┌─────────────────────────────────────────────────────────────┐
│ CASSANDRA / DYNAMODB — User Tweet Timeline                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Partition Key: user_id                                     │
│  Clustering Key: created_at (DESC)                          │
│                                                             │
│  Setiap row = satu tweet                                    │
│  Query: SELECT * FROM user_tweets                           │
│         WHERE user_id = ? ORDER BY created_at DESC          │
│         LIMIT 50                                            │
│                                                             │
│  Kenapa NoSQL?                                              │
│  - Write throughput tinggi (58K tweet/detik)                │
│  - Horizontal scaling mudah                                 │
│  - Tidak butuh join atau transaction kompleks               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### C. Cache Layer (Redis)

Redis adalah jantung dari performa Twitter:

```
┌─────────────────────────────────────────────────────────────┐
│ REDIS CACHE STRATEGY                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. TIMELINE CACHE (Sorted Set)                             │
│  ─────────────────────────────────────────                  │
│  Key:    timeline:{user_id}                                 │
│  Type:   ZSET (Sorted Set)                                  │
│  Score:  timestamp (epoch)                                  │
│  Value:  tweet_id                                           │
│  TTL:    1 jam (refresh otomatis)                           │
│  Max:    800 tweet per user                                 │
│                                                             │
│  Contoh:                                                    │
│  ZADD timeline:42 1713268200 tweet_1001                     │
│  ZADD timeline:42 1713268300 tweet_1002                     │
│  ZREVRANGE timeline:42 0 49  → 50 tweet terbaru             │
│                                                             │
│  2. USER CACHE (Hash)                                       │
│  ──────────────────────────                                 │
│  Key:    user:{user_id}                                     │
│  Type:   HASH                                               │
│  Fields: username, display_name, avatar_url, verified       │
│  TTL:    30 menit                                           │
│                                                             │
│  3. FOLLOW GRAPH CACHE                                      │
│  ─────────────────────────────                              │
│  Key:    following:{user_id}                                │
│  Type:   SET                                                │
│  Value:  {followee_id_1, followee_id_2, ...}                │
│  TTL:    1 jam                                              │
│                                                             │
│  Key:    followers:{user_id}                                │
│  Type:   SET                                                │
│  Value:  {follower_id_1, follower_id_2, ...}                │
│  TTL:    1 jam                                              │
│                                                             │
│  4. TWEET CACHE (Hash)                                      │
│  ───────────────────────────                                │
│  Key:    tweet:{tweet_id}                                   │
│  Type:   HASH                                               │
│  Fields: user_id, content, created_at, likes, retweets      │
│  TTL:    24 jam                                             │
│                                                             │
│  5. SESSION CACHE                                           │
│  ─────────────────────                                      │
│  Key:    session:{session_token}                            │
│  Type:   HASH                                               │
│  Fields: user_id, expires_at, device_info                   │
│  TTL:    Sesuai session expiry                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 19.7 Feed Generation — Fan-out Strategy

Ini adalah **bagian paling kritis** dalam desain Twitter. Bagaimana tweet dari orang yang Anda follow muncul di timeline Anda?

#### A. Strategi 1: Fan-out on Write (Push Model)

```
┌─────────────────────────────────────────────────────────────┐
│ FAN-OUT ON WRITE (Push)                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Alur:                                                      │
│  1. User A membuat tweet                                    │
│  2. Sistem menyimpan tweet di database                      │
│  3. Sistem mencari SEMUA follower User A                    │
│  4. Untuk SETIAP follower, tambah tweet_id ke timeline cache│
│  5. Selesai                                                 │
│                                                             │
│  Pseudocode:                                                │
│  ─────────                                                  │
│  def create_tweet(user_id, content):                        │
│      tweet = db.save_tweet(user_id, content)                │
│      followers = db.get_followers(user_id)                  │
│      for follower_id in followers:                          │
│          redis.zadd(                                        │
│              f"timeline:{follower_id}",                     │
│              tweet.created_at,                              │
│              tweet.id                                       │
│          )                                                  │
│      return tweet                                           │
│                                                             │
│  Kompleksitas: O(F) dimana F = jumlah follower              │
│                                                             │
│  KELEBIHAN:                                                 │
│  ✅ Read timeline sangat cepat (O(1) — tinggal baca cache)  │
│  ✅ Timeline selalu up-to-date                              │
│  ✅ Sederhana untuk diimplementasi                          │
│                                                             │
│  KEKURANGAN:                                                │
│  ❌ Write lambat untuk user dengan banyak follower          │
│  ❌ Celebrity (100M follower) → 100M write ke Redis!        │
│  ❌ Storm problem: celebrity tweet → cache overload         │
│                                                             │
│  COCOK UNTUK: User biasa (follower < 1000)                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### B. Strategi 2: Fan-out on Read (Pull Model)

```
┌─────────────────────────────────────────────────────────────┐
│ FAN-OUT ON READ (Pull)                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Alur:                                                      │
│  1. User B membuka timeline                                 │
│  2. Sistem mencari siapa saja yang di-follow User B         │
│  3. Untuk SETIAP orang yang di-follow, ambil tweet terbaru  │
│  4. Gabung semua tweet, urutkan berdasarkan waktu           │
│  5. Return 50 tweet terbaru                                 │
│                                                             │
│  Pseudocode:                                                │
│  ─────────                                                  │
│  def get_timeline(user_id, limit=50):                       │
│      following = db.get_following(user_id)                  │
│      all_tweets = []                                        │
│      for followee_id in following:                          │
│          tweets = db.get_user_tweets(followee_id, limit=50) │
│          all_tweets.extend(tweets)                          │
│      all_tweets.sort(key=lambda t: t.created_at,            │
│                      reverse=True)                          │
│      return all_tweets[:limit]                              │
│                                                             │
│  Kompleksitas: O(F × T log(F × T))                          │
│  F = jumlah following, T = tweet per user                   │
│                                                             │
│  KELEBIHAN:                                                 │
│  ✅ Write sangat cepat (tidak perlu fan-out)                │
│  ✅ Tidak ada masalah celebrity                             │
│  ✅ Data selalu fresh dari database                         │
│                                                             │
│  KEKURANGAN:                                                │
│  ❌ Read lambat (harus query banyak user)                   │
│  ❌ Sorting besar-besaran setiap read                       │
│  ❌ Tidak scalable untuk user dengan banyak following       │
│                                                             │
│  COCOK UNTUK: Celebrity (follower > 1 juta)                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### C. Strategi 3: Hybrid (Yang Dipakai Twitter Nyata)

```
┌─────────────────────────────────────────────────────────────┐
│ HYBRID FAN-OUT (Twitter Production)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  KONSEP:                                                    │
│  - User biasa (follower < threshold) → PUSH                 │
│  - Celebrity (follower > threshold) → PULL                  │
│  - Threshold: ~5000-10000 follower                          │
│                                                             │
│  Alur Write (User A tweet):                                 │
│  ──────────────────────────                                 │
│  1. Simpan tweet ke database                                │
│  2. Cek: apakah A celebrity?                                │
│     - Jika TIDAK → fan-out ke semua follower (PUSH)         │
│     - Jika YA → skip fan-out, hanya simpan DB               │
│                                                             │
│  Alur Read (User B buka timeline):                          │
│  ───────────────────────────                                │
│  1. Baca timeline cache (berisi push dari non-celebrity)    │
│  2. Cari siapa yang B follow yang celebrity                 │
│  3. Pull tweet terbaru dari celebrity tersebut              │
│  4. Merge: cache timeline + celebrity tweets                │
│  5. Sort dan return                                         │
│                                                             │
│  Pseudocode:                                                │
│  ─────────                                                  │
│  def create_tweet(user_id, content):                        │
│      tweet = db.save_tweet(user_id, content)                │
│      follower_count = db.get_follower_count(user_id)        │
│                                                             │
│      if follower_count < CELEBRITY_THRESHOLD:               │
│          followers = db.get_followers(user_id)              │
│          for fid in followers:                              │
│              redis.zadd(                                    │
│                  f"timeline:{fid}",                         │
│                  tweet.created_at, tweet.id                 │
│              )                                              │
│      # Jika celebrity: skip fan-out                         │
│      return tweet                                           │
│                                                             │
│  def get_timeline(user_id, limit=50):                       │
│      # 1. Baca dari cache (push dari non-celebrity)         │
│      cached = redis.zrevrange(                              │
│          f"timeline:{user_id}", 0, limit-1                  │
│      )                                                      │
│                                                             │
│      # 2. Pull dari celebrity yang di-follow                │
│      celebrity_following = db.get_celebrity_following(      │
│          user_id                                            │
│      )                                                      │
│      celebrity_tweets = []                                  │
│      for cid in celebrity_following:                        │
│          tweets = db.get_user_tweets(cid, limit=10)         │
│          celebrity_tweets.extend(tweets)                    │
│                                                             │
│      # 3. Merge dan sort                                    │
│      all_tweets = merge_and_sort(cached, celebrity_tweets)  │
│      return all_tweets[:limit]                              │
│                                                             │
│  KELEBIHAN:                                                 │
│  ✅ Kompromi terbaik antara read dan write performance      │
│  ✅ Handle celebrity tanpa overload                         │
│  ✅ Timeline tetap cepat untuk mayoritas user               │
│                                                             │
│  TANTANGAN:                                                 │
│  ⚠️  Threshold perlu tuning berdasarkan data real           │
│  ⚠️  Merge logic lebih kompleks                             │
│  ⚠️  Perlu tracking siapa celebrity                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### D. Visualisasi Perbandingan

```
┌─────────────────────────────────────────────────────────────┐
│ PERBANDINGAN FAN-OUT STRATEGI                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    Push        Pull        Hybrid           │
│  ─────────────────────────────────────────────────────      │
│  Write Speed     Lambat      Cepat       Sedang             │
│  Read Speed      Cepat       Lambat      Cepat              │
│  Celebrity OK?   TIDAK       YA          YA                 │
│  Cache Usage     Tinggi      Rendah      Sedang             │
│  DB Load         Rendah      Tinggi      Sedang             │
│  Kompleksitas    Rendah      Rendah      Tinggi             │
│  Twitter Pakai?  Sebagian    Sebagian    UTAMA              │
│                                                             │
│  Rekomendasi:                                               │
│  - Startup kecil → Push (follower masih sedikit)            │
│  - Medium → Hybrid dengan threshold adaptif                 │
│  - Large scale → Hybrid + async fan-out via Kafka           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 19.8 Async Fan-out dengan Message Queue

Untuk skala production, fan-out tidak bisa synchronous. Kita gunakan **Kafka** atau **RabbitMQ**:

```
┌─────────────────────────────────────────────────────────────┐
│ ASYNC FAN-OUT ARCHITECTURE                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [User] → [API] → [Tweet Service] → [Save to DB]            │
│                                    │                        │
│                                    ↓                        │
│                            [Publish to Kafka]               │
│                            Topic: "new_tweet"               │
│                            Payload: {                       │
│                              tweet_id: 123,                 │
│                              user_id: 42,                   │
│                              follower_count: 500            │
│                            }                                │
│                                                             │
│  [Kafka Consumer Group: Fan-out Workers]                    │
│  ├── Worker 1: Process shard 0-255                          │
│  ├── Worker 2: Process shard 256-511                        │
│  ├── Worker 3: Process shard 512-767                        │
│  └── Worker 4: Process shard 768-1023                       │
│                                                             │
│  Setiap worker:                                             │
│  1. Baca event dari Kafka                                   │
│  2. Cari follower di shard yang ditugaskan                  │
│  3. Push tweet_id ke timeline cache follower                │
│  4. Acknowledge Kafka                                       │
│                                                             │
│  Keuntungan:                                                │
│  - Write API tidak blocking (return cepat ke user)          │
│  - Fan-out bisa di-retry jika gagal                         │
│  - Bisa scale worker secara independen                      │
│  - Backpressure handling otomatis                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 19.9 Media Storage

Foto dan video di Twitter disimpan di **Object Storage** (AWS S3, Google Cloud Storage):

```
┌─────────────────────────────────────────────────────────────┐
│ MEDIA STORAGE PIPELINE                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [User Upload]                                              │
│       ↓                                                     │
│  [API Server] → Validasi (size, type, malware scan)         │
│       ↓                                                     │
│  [Image Processing Service]                                 │
│       ├── Resize: thumbnail (150x150), medium (600x400)     │
│       │             large (1200x800), original              │
│       ├── Convert: WebP untuk web, HEIC untuk iOS           │
│       └── Compress: quality optimization                    │
│       ↓                                                     │
│  [Object Storage (S3/GCS)]                                  │
│       ├── Bucket: twitter-media-prod                        │
│       ├── Key: {year}/{month}/{day}/{tweet_id}/{size}.webp  │
│       └── Lifecycle: auto-delete setelah 5 tahun            │
│       ↓                                                     │
│  [CDN (CloudFront/Cloudflare)]                              │
│       ├── Edge cache untuk semua ukuran gambar              │
│       ├── TTL: 1 tahun (immutable)                          │
│       └── Signed URL untuk private media                    │
│       ↓                                                     │
│  [Client] → Load dari CDN (bukan dari S3 langsung)          │
│                                                             │
│  Video Processing:                                          │
│  - Transcode ke multiple resolution (360p, 720p, 1080p)     │
│  - HLS/DASH streaming untuk adaptive bitrate                │
│  - Thumbnail auto-generate                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 19.10 Trending Topics Algorithm

Trending topics mengidentifikasi topik yang sedang populer dalam window waktu tertentu:

```
┌─────────────────────────────────────────────────────────────┐
│ TRENDING TOPICS ALGORITHM                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  INPUT:                                                     │
│  - Stream tweet real-time dari Kafka                        │
│  - Historical baseline (rata-rata tweet per topik)          │
│  - Geolocation data (trending per negara/kota)              │
│                                                             │
│  ALGORITMA:                                                 │
│  ─────────                                                  │
│  1. Ekstrak hashtag dan keyword dari setiap tweet           │
│  2. Group berdasarkan topik (hashtag/keyword)               │
│  3. Hitung velocity: tweet_count / time_window              │
│  4. Bandingkan dengan baseline (historical average)         │
│  5. Score = (current_velocity / baseline_velocity)          │
│  6. Filter:                                                 │
│     - Minimal 1000 tweet dalam window                       │
│     - Tidak duplikat (normalize hashtag)                    │
│     - Tidak spam (bot detection)                            │
│  7. Ranking berdasarkan score                               │
│  8. Group by location (global, negara, kota)                │
│                                                             │
│  WINDOW TIME:                                               │
│  - Last 1 hour (trending sekarang)                          │
│  - Last 6 hours                                             │
│  - Last 24 hours                                            │
│                                                             │
│  IMPLEMENTASI:                                              │
│  - Stream processing: Apache Flink / Kafka Streams          │
│  - Storage: Redis Sorted Set (score = ranking)              │
│  - Update: Setiap 5 menit                                   │
│                                                             │
│  Pseudocode:                                                │
│  ─────────                                                  │
│  def calculate_trending(tweets, window=3600):               │
│      topic_counts = defaultdict(int)                        │
│      for tweet in tweets:                                   │
│          for hashtag in extract_hashtags(tweet):            │
│              topic_counts[hashtag] += 1                     │
│                                                             │
│      trending = []                                          │
│      for topic, count in topic_counts.items():              │
│          velocity = count / window                          │
│          baseline = get_baseline(topic, window)             │
│          score = velocity / max(baseline, 0.001)            │
│          if count >= 1000:                                  │
│              trending.append((topic, score, count))         │
│                                                             │
│      trending.sort(key=lambda x: x[1], reverse=True)        │
│      return trending[:20]  # Top 20 trending                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 19.11 Notification System

Notifikasi harus real-time dan reliable:

```
┌─────────────────────────────────────────────────────────────┐
│ NOTIFICATION SYSTEM                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Event Source:                                              │
│  - Someone followed you                                     │
│  - Someone liked your tweet                                 │
│  - Someone replied to your tweet                            │
│  - Someone retweeted your tweet                             │
│  - Trending topic update                                    │
│                                                             │
│  Architecture:                                              │
│  ─────────────                                              │
│  [Event Producer] → [Kafka Topic: notifications]            │
│                          ↓                                  │
│                  [Notification Service]                     │
│                  ├── Deduplicate (batch similar events)     │
│                  ├── Rate limit (max 50 notif/hari)         │
│                  ├── Priority (follow > like > trending)    │
│                          ↓                                  │
│                  [Delivery Channels]                        │
│                  ├── Push Notification (FCM/APNs)           │
│                  ├── In-app notification (WebSocket)        │
│                  ├── Email (daily digest)                   │
│                  └── SMS (critical only)                    │
│                                                             │
│  Deduplication Example:                                     │
│  - 100 orang like tweet Anda → "100 orang menyukai tweet"   │
│  - Bukan 100 notifikasi terpisah                            │
│                                                             │
│  Real-time Delivery:                                        │
│  - WebSocket connection untuk in-app notification           │
│  - Server-Sent Events (SSE) sebagai fallback                │
│  - Push notification untuk mobile (FCM/APNs)                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 19.12 Scaling Strategy

Bagaimana Twitter menangani pertumbuhan dari 1 juta ke 500 juta user?

```
┌─────────────────────────────────────────────────────────────┐
│ SCALING ROADMAP                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Phase 1: 0-100K users (Monolith)                           │
│  ───────────────────────────────                            │
│  - 1 server (app + DB + cache)                              │
│  - Single MySQL instance                                    │
│  - Single Redis instance                                    │
│  - Vertical scaling (upgrade RAM, CPU)                      │
│                                                             │
│  Phase 2: 100K-1M users (Vertical Split)                    │
│  ─────────────────────────────────────                      │
│  - Pisahkan app server dan database                         │
│  - Load balancer di depan app server                        │
│  - Read replica untuk MySQL                                 │
│  - Redis cluster untuk cache                                │
│  - CDN untuk media                                          │
│                                                             │
│  Phase 3: 1M-50M users (Microservices)                      │
│  ──────────────────────────────────                         │
│  - Pecah jadi microservices                                 │
│  - Database sharding (by user_id)                           │
│  - Message queue (Kafka) untuk async                        │
│  - Search engine (Elasticsearch)                            │
│  - Monitoring & alerting                                    │
│                                                             │
│  Phase 4: 50M-500M users (Global Scale)                     │
│  ────────────────────────────────────                       │
│  - Multi-region deployment                                  │
│  - Geo-DNS untuk routing ke region terdekat                 │
│  - Cross-region replication                                 │
│  - Federated cache (cache per region)                       │
│  - Edge computing untuk personalisasi                       │
│  - Machine learning untuk ranking timeline                  │
│                                                             │
│  Phase 5: 500M+ users (Hyper Scale)                         │
│  ───────────────────────────────────                        │
│  - Custom hardware (Twitter pakai custom server)            │
│  - Custom database (Twitter pakai Manhattan)                │
│  - Custom CDN (Twitter punya edge network sendiri)          │
│  - AI/ML untuk semua aspek (ranking, moderation, trending)  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 19.13 Failure Handling & Resilience

Sistem harus tetap berjalan saat ada kegagalan:

```
┌─────────────────────────────────────────────────────────────┐
│ FAILURE HANDLING STRATEGY                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. DATABASE FAILURE                                        │
│  ──────────────────────                                     │
│  - Primary DB down → Failover ke replica (otomatis)         │
│  - Replica down → Primary tetap jalan, rebuild replica      │
│  - Semua DB down → Serve dari cache (degraded mode)         │
│                                                             │
│  2. CACHE FAILURE                                           │
│  ────────────────────                                       │
│  - Redis down → Fallback ke database (lebih lambat)         │
│  - Cache miss storm → Gunakan request coalescing            │
│    (hanya 1 request ke DB, yang lain tunggu)                │
│                                                             │
│  3. CELEBRITY TWEET STORM                                   │
│  ───────────────────────────────                            │
│  - Justin Bieber tweet → 100M follower                      │
│  - Fan-out queue akan penuh                                 │
│  - Solusi: Rate limit fan-out, prioritize by region         │
│  - Timeline follower muncul bertahap (bukan instan)         │
│                                                             │
│  4. NETWORK PARTITION                                       │
│  ──────────────────────────                                 │
│  - Region A terputus dari Region B                          │
│  - Region A tetap serve user lokal (AP mode)                │
│  - Data disinkronkan saat network pulih                     │
│  - Conflict resolution: last-write-wins                     │
│                                                             │
│  5. CIRCUIT BREAKER PATTERN                                 │
│  ─────────────────────────────                              │
│  - Jika service downstream error > 50%                      │
│  - Circuit breaker OPEN → stop call ke service itu          │
│  - Return cached/error response                             │
│  - Setelah 30 detik → HALF-OPEN (test 1 request)            │
│  - Jika sukses → CLOSE (normal kembali)                     │
│                                                             │
│  6. RETRY WITH BACKOFF                                      │
│  ────────────────────────────                               │
│  - Request gagal → retry dengan exponential backoff         │
│  - Retry 1: wait 1s                                         │
│  - Retry 2: wait 2s                                         │
│  - Retry 3: wait 4s                                         │
│  - Max retry: 3 kali                                        │
│  - Setelah max retry → fail gracefully                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 19.14 Monitoring & Observability

Tanpa monitoring, kita buta terhadap masalah:

```
┌─────────────────────────────────────────────────────────────┐
│ MONITORING STACK                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Metrics (Prometheus + Grafana):                            │
│  ─────────────────────────────────────                      │
│  - Request rate (req/s) per endpoint                        │
│  - Error rate (% 5xx responses)                             │
│  - Latency (p50, p95, p99) per endpoint                     │
│  - Cache hit ratio                                          │
│  - Database query time                                      │
│  - Queue depth (Kafka lag)                                  │
│  - Fan-out latency                                          │
│  - Timeline generation time                                 │
│                                                             │
│  Logging (ELK Stack / Datadog):                             │
│  ───────────────────────────────────                        │
│  - Structured logging (JSON format)                         │
│  - Correlation ID per request (trace across services)       │
│  - Error logging dengan stack trace                         │
│  - Audit log untuk perubahan data sensitif                  │
│                                                             │
│  Tracing (Jaeger / Zipkin):                                 │
│  ─────────────────────────────                              │
│  - Distributed tracing per request                          │
│  - Visualisasi span antar service                           │
│  - Identifikasi bottleneck                                  │
│                                                             │
│  Alerting (PagerDuty / Opsgenie):                           │
│  ──────────────────────────────────                         │
│  - Error rate > 1% → Page on-call engineer                  │
│  - Latency p99 > 1s → Slack warning                         │
│  - DB CPU > 80% → Slack warning                             │
│  - Cache hit ratio < 80% → Investigate                      │
│  - Queue lag > 10K → Scale consumer                         │
│                                                             │
│  Dashboard:                                                 │
│  ───────────                                                │
│  - Real-time: request rate, error rate, latency             │
│  - Business: DAU, tweets/hari, timeline reads/hari          │
│  - Infrastructure: CPU, memory, disk, network               │
│  - Cache: hit ratio, memory usage, eviction rate            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 CONTOH NYATA

### Bagaimana Twitter Bekerja di Production

**Skenario: User biasa (@budi) tweet**

```
1. @budi ketik "Belajar system design!" + attach foto
2. App → POST /api/v1/tweets (HTTPS)
3. Load Balancer → API Server 3
4. API Server → Validasi (auth, content, media)
5. Media → Upload ke S3 → CDN invalidate
6. Tweet → Simpan ke MySQL (shard berdasarkan user_id)
7. Publish event ke Kafka topic "new_tweet"
8. API return 201 Created ke @budi (total: 200ms)

9. Kafka Consumer (Fan-out Worker) pick up event
10. Cek: @budi punya 500 follower (< threshold)
11. Fan-out: push tweet_id ke timeline cache 500 follower
12. Setiap follower yang buka timeline → lihat tweet @budi instan

13. Search Service: index tweet ke Elasticsearch (async)
14. Trending Service: cek apakah hashtag trending
15. Notification Service: tidak ada notif (bukan mention/reply)
```

**Skenario: Celebrity (@justinbieber) tweet**

```
1. @justinbieber tweet "New album coming soon!"
2. Langkah 1-8 sama seperti di atas
3. Kafka Consumer cek: 100M follower (> threshold!)
4. SKIP fan-out (tidak push ke 100M follower)
5. Tweet hanya disimpan di DB + search index

6. Follower @justinbieber buka timeline:
   - Baca cache timeline (berisi tweet non-celebrity)
   - Pull tweet terbaru dari @justinbieber (DB query)
   - Merge dan sort
   - Return timeline

7. Hasil: Timeline muncul dalam 300-500ms
   (sedikit lebih lambat dari non-celebrity, tapi acceptable)
```

---

## 💡 PRAKTIK

### Latihan 1: Desain Timeline Pengumuman Sekolah

Anda mendesain **aplikasi pengumuman sekolah** dengan kebutuhan:
- 20 guru bisa posting pengumuman
- 500 orang tua bisa melihat timeline pengumuman
- Setiap guru di-follow oleh rata-rata 25 orang tua
- Pengumuman bisa berisi teks + foto kegiatan

**Tugas:**
1. Gambar arsitektur high-level
2. Tentukan strategi fan-out (push/pull/hybrid?)
3. Desain database schema
4. Berapa estimasi storage per tahun?
5. Apakah perlu CDN?

**Hint:** Karena follower sedikit (25 per guru), push strategy sangat cocok. Tidak perlu hybrid.

### Latihan 2: Hitung Capacity untuk Twitter Clone

Asumsi:
- 10 juta DAU
- 3 tweet per user per hari
- 30 timeline read per user per hari
- Rata-rata 100 follow per user
- 10% tweet ada media (rata-rata 200 KB)

**Tugas:**
1. Hitung tweet per detik (avg dan peak)
2. Hitung timeline read per detik
3. Hitung storage per tahun (tweet + media)
4. Hitung bandwidth per hari
5. Berapa Redis instance dibutuhkan? (asumsi 1 instance handle 100K ops/detik)

### Latihan 3: Desain Fan-out untuk Kasus Hot Key

Seorang influencer dengan 50 juta follower tweet. Fan-out worker membutuhkan 2 jam untuk push ke semua follower.

**Masalah:** Follower di Asia buka timeline 2 jam setelah tweet, tapi influencer sudah tweet lagi.

**Tugas:**
1. Identifikasi masalah
2. Desain solusi (hint: pull untuk celebrity, tapi bagaimana merge-nya?)
3. Bagaimana memastikan tweet celebrity tidak hilang dari timeline?

---

## ✅ CHECKLIST

- [ ] Paham functional vs non-functional requirements
- [ ] Bisa melakukan capacity estimation (traffic, storage, bandwidth)
- [ ] Paham CAP theorem dan penerapannya di Twitter
- [ ] Bisa mendesain RESTful API untuk social media
- [ ] Paham arsitektur multi-layer (client → CDN → LB → API → Service → Data)
- [ ] Paham polyglot persistence (SQL + NoSQL + Cache + Search)
- [ ] Paham 3 strategi fan-out (push, pull, hybrid) dan trade-off-nya
- [ ] Paham kenapa Twitter pakai hybrid fan-out
- [ ] Paham async fan-out dengan Kafka
- [ ] Paham media storage pipeline (upload → process → S3 → CDN)
- [ ] Paham trending topics algorithm
- [ ] Paham notification system (dedup, rate limit, multi-channel)
- [ ] Paham scaling roadmap dari monolith ke global scale
- [ ] Paham failure handling (circuit breaker, retry, degraded mode)
- [ ] Paham monitoring stack (metrics, logging, tracing, alerting)

---

## 🔗 REFERENSI

- **Repo Asli:** [donnemartin/system-design-primer — Twitter Solution](https://github.com/donnemartin/system-design-primer/tree/master/solutions/system_design/twitter)
- **Twitter Engineering Blog:** [blog.twitter.com/engineering](https://blog.twitter.com/engineering)
- **Twitter's Manhattan Database:** [blog.twitter.com/engineering/en_us/a/2017/manhattan](https://blog.twitter.com/engineering/en_us/a/2017/manhattan)
- **Twitter's Fan-out Architecture:** [High Scalability — Twitter Architecture](http://highscalability.com/blog/2012/1/23/twitter-architecture-fanout-on-write-vs-fanout-on-read.html)

---

> **Lanjut ke:** [`20-studi-kasus-web-crawler.md`](./20-studi-kasus-web-crawler.md)
