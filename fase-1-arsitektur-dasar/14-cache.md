# 14 — Cache

> **Estimasi:** 3 jam | **Level:** Menengah → Lanjut

---

## 📖 TEORI

### Apa itu Cache?

**Cache** adalah penyimpanan data sementara berkecepatan tinggi yang menyimpan salinan data yang sering diakses, sehingga request berikutnya bisa dilayani tanpa perlu mengakses sumber data asli (database, API eksternal, atau disk).

Prinsip fundamental cache didasarkan pada **locality of reference**:

- **Temporal locality**: Data yang baru diakses kemungkinan besar akan diakses lagi dalam waktu dekat
- **Spatial locality**: Data yang berdekatan dengan data yang diakses kemungkinan besar juga akan dibutuhkan

```
Tanpa Cache:
[Request] → [Database] → 100ms → Response
[Request] → [Database] → 100ms → Response (sama lagi!)
[Request] → [Database] → 100ms → Response (sama lagi!)
Total: 300ms untuk 3 request yang sama

Dengan Cache:
[Request] → [Cache] → "Data ada!" → 1ms → Response
[Request] → [Cache] → "Data ada!" → 1ms → Response
[Request] → [Cache] → "Data ada!" → 1ms → Response
Total: 3ms untuk 3 request yang sama — 100x lebih cepat!
```

**Cache bekerja karena:** Akses memory (RAM) ~100.000x lebih cepat dari akses disk.

### Tingkatan Cache

#### 1. Client Caching (Browser Cache)

Browser menyimpan resource (gambar, CSS, JS) di komputer user.

```
[Browser] ── cache ──→ [Harddisk User]
  ↑
HTTP header: Cache-Control, Expires, ETag, Last-Modified
```

**Contoh:** Gambar logo website di-cache di browser selama 1 minggu. User tidak perlu download ulang setiap kali mengunjungi halaman yang sama.

#### 2. CDN Caching

Konten statis di-cache di server edge terdekat dengan user (lihat Fase 08).

#### 3. Web Server Caching

Reverse proxy/Nginx cache response:

```
[Client] → [Nginx] → cek cache → ada? return langsung
                        ↓ tidak ada
                   [Backend App] → response → Nginx cache → return
```

#### 4. Database Caching

Database punya cache internal sendiri (buffer pool, query cache, result cache).

#### 5. Application Caching

Cache di level aplikasi menggunakan tools seperti Redis/Memcached:

```
[App] ── read/write ──→ [Redis (in-memory cache)]
  ↑                          ↑
Jika ada di cache,   JIKA TIDAK ADA, ambil dari database
langsung return         lalu simpan ke cache
```

---

### Cache Hit Ratio dan Dampak Performa

**Cache Hit Ratio** adalah persentase request yang berhasil dilayani dari cache tanpa perlu mengakses sumber data asli.

```
                    Cache Hits
Hit Ratio = ─────────────────────────────── × 100%
            Cache Hits + Cache Misses
```

**Contoh Perhitungan:**

```
Total request dalam 1 jam: 10.000
Cache hits: 9.500
Cache misses: 500

Hit Ratio = 9.500 / (9.500 + 500) × 100% = 95%
```

**Dampak Hit Ratio terhadap Latensi Rata-rata:**

```
Average Latency = (Hit Ratio × Cache Latency) + ((1 - Hit Ratio) × DB Latency)

Contoh:
Cache latency = 1ms
DB latency = 100ms

Hit Ratio 50%:  (0.5 × 1ms) + (0.5 × 100ms) = 50.5ms
Hit Ratio 90%:  (0.9 × 1ms) + (0.1 × 100ms) = 10.9ms
Hit Ratio 95%:  (0.95 × 1ms) + (0.05 × 100ms) = 5.95ms
Hit Ratio 99%:  (0.99 × 1ms) + (0.01 × 100ms) = 1.99ms
```

**Kesimpulan:** Peningkatan hit ratio dari 90% ke 99% mengurangi latensi rata-rata dari 10.9ms menjadi 1.99ms — hampir 5.5x lebih cepat.

**Target Hit Ratio yang Realistis:**

| Tipe Data | Target Hit Ratio | Alasan |
|---|---|---|
| Konten statis (gambar, CSS) | 99%+ | Tidak pernah berubah |
| Data profil user | 95-99% | Jarang berubah |
| Feed/timeline | 80-95% | Sering berubah |
| Data real-time | 0-50% | Terlalu dinamis |

---

### Strategi Update Cache

Ini yang **paling penting** dipahami — bagaimana cache tetap up-to-date.

#### 1. Cache-aside (Lazy Loading)

**Paling umum dipakai.** Aplikasi bertanggung jawab mengelola cache.

```
READ:
[App] cek cache → Tidak ada → [App] ambil dari DB → simpan ke cache → return

WRITE:
[App] tulis ke DB → [App] invalidate cache (hapus data lama)
```

**Kelebihan:** Cache hanya berisi data yang diminta, toleran terhadap failure
**Kekurangan:** Request pertama lambat (cache miss), data bisa stale

**Implementasi dengan Node.js + Redis:**

```javascript
async function getUser(userId) {
  const cacheKey = `user:${userId}`;

  // 1. Cek cache dulu
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. Cache miss — ambil dari database
  const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

  // 3. Simpan ke cache dengan TTL 1 jam
  await redis.setex(cacheKey, 3600, JSON.stringify(user));

  return user;
}

async function updateUser(userId, data) {
  // 1. Update database dulu
  await db.query('UPDATE users SET ... WHERE id = $1', [userId]);

  // 2. Invalidate cache — hapus data lama
  await redis.del(`user:${userId}`);
}
```

#### 2. Write-through

Data ditulis ke cache DAN database secara bersamaan.

```
WRITE:
[App] → tulis ke cache → tulis ke DB → selesai

READ:
[App] → baca dari cache (pasti ada)
```

**Kelebihan:** Data di cache selalu fresh, tidak ada stale data
**Kekurangan:** Write lebih lambat (harus tulis ke 2 tempat), jika DB gagal write juga gagal

**Implementasi:**

```javascript
async function updateUserWriteThrough(userId, data) {
  // 1. Update cache dulu
  await redis.set(`user:${userId}`, JSON.stringify(data), 'EX', 3600);

  // 2. Baru update database
  await db.query('UPDATE users SET ... WHERE id = $1', [userId]);
}
```

#### 3. Write-behind (Write-back)

Data ditulis ke cache dulu, lalu secara asinkron ke database.

```
WRITE:
[App] → tulis ke cache (langsung) → acknowledge ke user
         ↓ (nanti, background process)
         tulis ke DB (batch, async)

READ:
[App] → baca dari cache (pasti ada)
```

**Kelebihan:** Write super cepat, DB tidak dibebani write individual
**Kekurangan:** Risiko data loss jika cache crash sebelum data di-DB, data bisa inconsistent

**Implementasi dengan Queue:**

```javascript
const writeQueue = [];
let flushing = false;

async function updateUserWriteBehind(userId, data) {
  // 1. Langsung update cache — user dapat response cepat
  await redis.set(`user:${userId}`, JSON.stringify(data), 'EX', 3600);

  // 2. Masukkan ke queue untuk ditulis ke DB nanti
  writeQueue.push({ userId, data, timestamp: Date.now() });

  // 3. Trigger background flush jika belum berjalan
  if (!flushing) {
    flushWriteQueue();
  }
}

async function flushWriteQueue() {
  flushing = true;
  while (writeQueue.length > 0) {
    const batch = writeQueue.splice(0, 100); // Batch 100 records
    await db.query('INSERT INTO users ... ON CONFLICT UPDATE', batch);
  }
  flushing = false;
}
```

#### 4. Refresh-ahead

Cache otomatis refresh data sebelum expired.

```
Data akan expired dalam 30 detik.
Cache prediction: "Bentar lagi expired. Gue refresh duluan dari DB."
→ Data di cache selalu segar tanpa perlu nunggu cache miss.
```

**Kelebihan:** User tidak pernah mengalami cache miss
**Kekurangan:** Kompleks implementasi, bisa refresh data yang tidak akan diakses

---

### Cache Eviction Policy

Saat cache penuh, data mana yang harus dihapus?

| Policy | Cara Kerja | Use Case | Implementasi |
|---|---|---|---|
| **LRU** (Least Recently Used) | Hapus data paling lama tidak diakses | General purpose | Redis (default) |
| **LFU** (Least Frequently Used) | Hapus data paling jarang diakses | Data dengan access pattern stabil | Redis (approximate) |
| **FIFO** (First In First Out) | Hapus data paling pertama masuk | Simple queue cache | — |
| **TTL** (Time To Live) | Hapus setelah waktu tertentu | Semua cache | Semua sistem |
| **Random** | Hapus data random | Simple implementation | — |
| **ARC** (Adaptive Replacement) | Kombinasi LRU + LFU | High-performance systems | — |

**LRU vs LFU — Kapan Pakai yang Mana:**

```
LRU cocok untuk:
- Data yang access pattern-nya berubah seiring waktu
- "Hot data" saat ini berbeda dengan "hot data" kemarin
- Contoh: trending topics, news feed

LFU cocok untuk:
- Data yang access pattern-nya stabil
- Data populer tetap populer dalam jangka panjang
- Contoh: profil user populer, produk bestseller
```

---

### Redis Deep Dive — Data Structures

Redis bukan sekadar key-value store. Redis mendukung berbagai struktur data yang masing-masing cocok untuk use case berbeda.

#### 1. Strings — Struktur Data Paling Dasar

```
SET key value
GET key
SETEX key seconds value  (set dengan TTL)
INCR key                 (increment angka)
DECR key                 (decrement angka)
APPEND key value         (tambah ke string existing)
```

**Use case:** Session storage, counter, cache sederhana

```bash
# Session user
SET session:abc123 '{"userId": 1, "role": "admin"}' EX 3600

# Counter page views
INCR pageviews:artikel-42

# Rate limiting
SETEX ratelimit:user:123 60 100
```

#### 2. Hashes — Object/Record Storage

```
HSET key field value
HGET key field
HMSET key field1 value1 field2 value2  (multi-set)
HGETALL key                            (semua field)
HINCRBY key field increment            (increment field)
```

**Use case:** User profile, product data, config

```bash
# User profile
HSET user:1001 name "Budi Santoso" email "budi@sekolah.id" role "guru"
HGET user:1001 name
HGETALL user:1001
# Output:
# 1) "name"
# 2) "Budi Santoso"
# 3) "email"
# 4) "budi@sekolah.id"
# 5) "role"
# 6) "guru"

# Increment field
HINCRBY user:1001 loginCount 1
```

#### 3. Lists — Ordered Collection (Doubly Linked List)

```
LPUSH key value    (push ke kiri/head)
RPUSH key value    (push ke kanan/tail)
LPOP key           (pop dari kiri)
RPOP key           (pop dari kanan)
LRANGE key start stop  (get range)
LLEN key           (length)
```

**Use case:** Message queue, recent activity, timeline

```bash
# Recent activity log
LPUSH activity:user:1001 '{"action": "login", "time": "2026-05-21T10:00:00"}'
LPUSH activity:user:1001 '{"action": "view_page", "time": "2026-05-21T10:05:00"}'

# Get 10 aktivitas terakhir
LRANGE activity:user:1001 0 9

# Simple queue (producer-consumer)
RPUSH tasks '{"job": "send_email", "to": "user@email.com"}'
LPOP tasks  # Worker ambil task
```

#### 4. Sets — Unordered Unique Collection

```
SADD key member      (add member)
SREM key member      (remove member)
SMEMBERS key         (semua member)
SISMEMBER key member (cek apakah member ada)
SINTER key1 key2     (intersection)
SUNION key1 key2     (union)
SDIFF key1 key2      (difference)
SCARD key            (count)
```

**Use case:** Tags, followers, unique visitors

```bash
# Followers
SADD followers:user:1001 2001 2002 2003 2004

# Cek apakah user 2001 follow user 1001
SISMEMBER followers:user:1001 2001
# (integer) 1 = ya, 0 = tidak

# Mutual followers (yang follow kedua user)
SINTER followers:user:1001 followers:user:1002

# Unique visitors hari ini
SADD visitors:2026-05-21 "ip-192.168.1.1" "ip-192.168.1.2"
SCARD visitors:2026-05-21  # count unique
```

#### 5. Sorted Sets (ZSET) — Ordered Unique Collection dengan Score

```
ZADD key score member    (add dengan score)
ZRANGE key start stop    (get by rank, ascending)
ZREVRANGE key start stop (get by rank, descending)
ZSCORE key member        (get score)
ZRANGEBYSCORE key min max (get by score range)
ZREM key member          (remove member)
```

**Use case:** Leaderboard, ranking, priority queue

```bash
# Leaderboard game
ZADD leaderboard 1500 "player_budi"
ZADD leaderboard 2300 "player_ani"
ZADD leaderboard 1800 "player_citra"

# Top 3 player
ZREVRANGE leaderboard 0 2 WITHSCORES
# 1) "player_ani"
# 2) "2300"
# 3) "player_citra"
# 4) "1800"
# 5) "player_budi"
# 6) "1500"

# Ranking player budi
ZREVRANK leaderboard "player_budi"
# (integer) 2 = posisi ke-3 (0-indexed)
```

#### 6. Streams — Append-Only Log (Message Streaming)

```
XADD key * field value    (add entry, auto-generate ID)
XRANGE key start end      (read range)
XREAD COUNT n STREAMS key id  (read with consumer group)
XGROUP CREATE key group id    (create consumer group)
XACK key group id             (acknowledge message)
```

**Use case:** Event sourcing, activity log, real-time data pipeline

```bash
# Add event
XADD events:orders * orderId "ORD-001" amount "150000" status "pending"
# "1716271200000-0" (auto-generated ID: timestamp-sequence)

# Read all events
XRANGE events:orders - +

# Consumer group untuk processing parallel
XGROUP CREATE events:orders order-processor 0
XREADGROUP GROUP order-processor worker1 COUNT 10 STREAMS events:orders >
```

---

### Memcached vs Redis — Perbandingan Lengkap

| Aspek | Redis | Memcached |
|---|---|---|
| **Tipe Data** | Strings, Hashes, Lists, Sets, ZSets, Streams | Strings only (opaque bytes) |
| **Persistence** | RDB snapshot + AOF log | Tidak ada (pure in-memory) |
| **Replication** | Master-slave, sentinel, cluster | Tidak ada |
| **Threading** | Single-threaded (event loop) | Multi-threaded |
| **Pub/Sub** | Ya (Redis Streams, Pub/Sub) | Tidak |
| **Transactions** | Ya (MULTI/EXEC, Lua scripting) | Tidak |
| **Memory Usage** | Lebih tinggi (metadata per struktur) | Lebih efisien (simple key-value) |
| **Use Case** | Cache + data structure + queue + session | Pure high-throughput cache |
| **Cluster** | Redis Cluster (built-in) | Client-side sharding |
| **Lua Scripting** | Ya (atomic operations) | Tidak |

**Kapan Pakai Redis:**
- Butuh struktur data kompleks (hash, list, set)
- Butuh persistence (data survive restart)
- Butuh pub/sub atau message queue
- Butuh atomic operations (Lua scripting)
- Butuh replication/HA

**Kapan Pakai Memcached:**
- Hanya butuh simple key-value cache
- Multi-threading penting untuk throughput
- Memory efficiency lebih penting dari fitur
- Tidak butuh persistence atau replication

**Real-world:** Facebook menggunakan Memcached untuk cache layer utama mereka (karena scale-nya sangat besar dan hanya butuh simple key-value). Twitter menggunakan Redis untuk timeline, session, dan real-time features.

---

### Cache Invalidation Strategies

Salah satu masalah tersulit dalam computer science adalah **cache invalidation** — mengetahui kapan data di cache sudah tidak valid dan harus dihapus atau di-refresh.

#### 1. Time-based Invalidation (TTL)

Paling sederhana: data otomatis invalid setelah waktu tertentu.

```bash
# Set dengan TTL 5 menit
SETEX product:42 300 '{"name": "Laptop", "price": 15000000}'

# Setelah 300 detik, key otomatis dihapus
GET product:42
# (nil) — expired
```

**Kelebihan:** Simple, predictable, tidak butuh logic tambahan
**Kekurangan:** Data bisa stale sebelum TTL, atau data masih valid tapi sudah dihapus

**Best Practice:** Gunakan TTL berbeda berdasarkan tipe data:

```
Data yang sering berubah: TTL pendek (1-5 menit)
Data yang jarang berubah: TTL panjang (1-24 jam)
Data yang hampir tidak berubah: TTL sangat panjang (1-7 hari)
Data real-time: Jangan di-cache
```

#### 2. Explicit Invalidation

Hapus cache secara eksplisit saat data berubah.

```javascript
async function updateProduct(productId, data) {
  // 1. Update database
  await db.query('UPDATE products SET ... WHERE id = $1', [productId]);

  // 2. Explicitly invalidate cache
  await redis.del(`product:${productId}`);

  // 3. Invalidate related caches
  await redis.del(`product-list:category:${data.categoryId}`);
  await redis.del(`product-list:search:${data.name}`);
}
```

**Kelebihan:** Data selalu konsisten, tidak ada stale data
**Kekurangan:** Harus track semua cache key yang terkait, kompleks untuk data yang saling relate

#### 3. Version-based Invalidation

Gunakan versi pada cache key. Saat data berubah, increment versi.

```
Versi 1: product:v1:42 → data lama
Versi 2: product:v2:42 → data baru (versi di-increment)

Cara kerja:
1. Simpan versi di Redis: SET product:version:42 1
2. Cache key: product:v1:42
3. Saat update: INCR product:version:42 → jadi 2
4. Cache key baru: product:v2:42
5. Cache lama (v1) otomatis tidak terpakai dan expired
```

**Kelebihan:** Tidak perlu explicit delete, cache lama otomatis diabaikan
**Kekurangan:** Memory usage lebih tinggi (cache lama tetap ada sampai TTL)

#### 4. Write-through Invalidation

Cache di-update bersamaan dengan database (sudah dibahas di strategi update).

---

### Distributed Caching

Saat aplikasi di-scale horizontal (multiple server), cache harus bisa diakses dari semua instance.

#### Masalah Single-node Cache:

```
[Server A] ── cache lokal ──→ [Data di Server A]
[Server B] ── cache lokal ──→ [Data di Server B]

Masalah:
- Server A dan B punya cache yang berbeda (inconsistent)
- Jika Server A update data, Server B tidak tahu
- Cache duplication (boros memory)
```

#### Solusi: Distributed Cache (Redis/Memcached Cluster)

```
[Server A] ──┐
[Server B] ──┼──→ [Redis Cluster] ←── shared cache untuk semua server
[Server C] ──┘
```

#### Consistent Hashing

**Masalah:** Saat menambah/mengurangi node cache, bagaimana mendistribusikan data tanpa harus re-hash semua key?

**Solusi: Consistent Hashing**

```
Tanpa Consistent Hashing (mod N):
key → hash(key) % N
Jika N berubah (nambah/kurang node), SEMUA key harus di-rehash!

Dengan Consistent Hashing:
- Hash ring: 0 sampai 2^32 - 1 dalam lingkaran
- Setiap node mendapat beberapa "virtual nodes" di ring
- Key di-hash dan ditempatkan di node terdekat searah jarum jam

Jika node ditambah/dihapus, HANYA key di sekitar node tersebut yang terpengaruh.
```

**Visualisasi:**

```
         Hash Ring (0 - 2^32)

              Node A (vnode 1)
            /                    \
      Node C (vnode 2)        Node B (vnode 1)
            \                    /
              Node A (vnode 2)

Key "user:123" → hash → posisi di ring → Node B yang handle
Key "product:456" → hash → posisi di ring → Node A yang handle

Jika Node C dihapus:
- Hanya key yang di-handle Node C yang perlu pindah
- Key di Node A dan B tidak terpengaruh
```

**Implementasi di Redis:**

```bash
# Redis Cluster otomatis handle consistent hashing
# Setup cluster dengan 6 nodes (3 master + 3 replica)

redis-cli --cluster create \
  127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 \
  127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 \
  --cluster-replicas 1

# Redis otomatis route key ke node yang benar
SET user:123 "data"  # route ke node yang handle slot untuk key ini
```

---

### Cache Penetration, Cache Breakdown, Cache Avalanche

Tiga masalah kritis dalam caching yang bisa menyebabkan downtime.

#### 1. Cache Penetration

**Masalah:** Request untuk data yang TIDAK ADA di database, sehingga setiap request selalu cache miss dan langsung ke database.

```
Request → cek cache → miss → cek DB → tidak ada → return null
Request → cek cache → miss → cek DB → tidak ada → return null
Request → cek cache → miss → cek DB → tidak ada → return null
                                                        ↓
                                              DB terbebani query yang sama
```

**Skenario:** Attacker mengirim request dengan ID yang tidak valid (user:-1, product:999999)

**Solusi:**

```javascript
// Solusi 1: Cache null/empty result dengan TTL pendek
async function getProduct(productId) {
  const cached = await redis.get(`product:${productId}`);
  if (cached !== null) {
    // Bisa jadi string "NULL" untuk menandakan data tidak ada
    return cached === "NULL" ? null : JSON.parse(cached);
  }

  const product = await db.query('SELECT * FROM products WHERE id = $1', [productId]);

  if (product) {
    await redis.setex(`product:${productId}`, 3600, JSON.stringify(product));
  } else {
    // Cache "NULL" dengan TTL pendek (5 menit)
    await redis.setex(`product:${productId}`, 300, "NULL");
  }

  return product;
}

// Solusi 2: Bloom Filter — cek apakah key MUNGKIN ada di DB
// Bloom filter: probabilistic data structure
// - Jika bloom filter bilang "tidak ada" → pasti tidak ada di DB
// - Jika bloom filter bilang "mungkin ada" → cek DB
```

#### 2. Cache Breakdown

**Masalah:** Satu key cache yang SANGAT POPULER expired, dan ribuan request datang bersamaan → semua langsung ke database.

```
Key "product:bestseller" expired!
Request 1: miss → DB (lambat)
Request 2: miss → DB (lambat)
Request 3: miss → DB (lambat)
...
Request 10000: miss → DB (lambat)
                    ↓
          Database CRASH 💥
```

**Solusi:**

```javascript
// Solusi 1: Mutex/Lock — hanya 1 request yang query DB
async function getProductWithLock(productId) {
  const cacheKey = `product:${productId}`;
  const lockKey = `lock:product:${productId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Coba acquire lock
  const acquired = await redis.set(lockKey, '1', 'NX', 'EX', 10);
  if (acquired) {
    // Saya yang query DB
    const product = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
    await redis.setex(cacheKey, 3600, JSON.stringify(product));
    await redis.del(lockKey); // release lock
    return product;
  } else {
    // Request lain yang query DB — saya tunggu dan retry
    await sleep(100);
    return getProductWithLock(productId); // retry
  }
}

// Solusi 2: Early Refresh — refresh sebelum expired
async function getProductEarlyRefresh(productId) {
  const cacheKey = `product:${productId}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    const ttl = await redis.ttl(cacheKey);
    // Jika TTL < 60 detik, refresh di background
    if (ttl > 0 && ttl < 60) {
      refreshInBackground(productId); // async, tidak block response
    }
    return JSON.parse(cached);
  }

  // Cache miss — ambil dari DB
  const product = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
  await redis.setex(cacheKey, 3600, JSON.stringify(product));
  return product;
}
```

#### 3. Cache Avalanche

**Masalah:** BANYAK key cache expired BERSAMAAN (karena TTL sama), menyebabkan spike request ke database.

```
TTL semua key = 1 jam
10:00 — semua key di-set
11:00 — SEMUA key expired bersamaan!
        ↓
  Database menerima 100x normal load → CRASH 💥
```

**Solusi:**

```javascript
// Solusi 1: Randomize TTL — tambahkan jitter
async function setCache(key, value, baseTTL) {
  // TTL = base + random(0-30% dari base)
  const jitter = Math.floor(Math.random() * baseTTL * 0.3);
  const ttl = baseTTL + jitter;
  await redis.setex(key, ttl, value);
}

// Contoh:
setCache('product:1', data, 3600);  // TTL: 3600-4680 detik
setCache('product:2', data, 3600);  // TTL: 3600-4680 detik
setCache('product:3', data, 3600);  // TTL: 3600-4680 detik
// → Tidak ada yang expired bersamaan!

// Solusi 2: Staggered cache warming
// Saat startup, jangan load semua cache sekaligus
// Load secara bertahap dengan delay

// Solusi 3: Multi-level cache
// L1: Local cache (in-process) — TTL pendek
// L2: Redis cluster — TTL panjang
// Jika L2 down, L1 masih bisa serve
```

---

### CDN Caching Deep Dive

CDN (Content Delivery Network) adalah distributed cache untuk konten statis dan semi-dinamis.

#### Cache Headers yang Mengontrol CDN Behavior

```
Cache-Control: public, max-age=86400
→ CDN boleh cache, valid selama 24 jam

Cache-Control: private, max-age=3600
→ Hanya browser yang boleh cache, CDN tidak boleh

Cache-Control: no-cache
→ CDN boleh cache, tapi harus validasi ke origin dulu

Cache-Control: no-store
→ JANGAN cache sama sekali

Cache-Control: s-maxage=3600
→ TTL khusus untuk shared cache (CDN), override max-age

Cache-Control: stale-while-revalidate=60
→ Serve stale content sambil refresh di background

Cache-Control: stale-if-error=86400
→ Jika origin error, serve stale content sampai 24 jam
```

#### CDN Cache Key

CDN menggunakan kombinasi ini sebagai cache key:

```
Cache Key = URL + Query String + Host Header + (opsional) Cookie/Header

Contoh:
https://cdn.sekolah.id/images/logo.png
→ Cache key: "GET https://cdn.sekolah.id/images/logo.png"

https://cdn.sekolah.id/api/students?page=1
→ Cache key: "GET https://cdn.sekolah.id/api/students?page=1"
→ page=1 dan page=2 = cache key berbeda
```

#### CDN Purge/Invalidation

```
# Purge single URL
curl -X POST https://api.cloudflare.com/client/v4/zones/{zone}/purge_cache \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  --data '{"files": ["https://cdn.sekolah.id/images/logo.png"]}'

# Purge by tag
curl -X POST ... \
  --data '{"tags": ["product-images", "user-avatars"]}'

# Purge all
curl -X POST ... \
  --data '{"purge_everything": true}'
```

#### Edge Computing di CDN

CDN modern (Cloudflare Workers, AWS Lambda@Edge) bisa menjalankan logic di edge:

```javascript
// Cloudflare Worker — A/B testing di edge
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const userId = request.headers.get('X-User-ID')
  const bucket = parseInt(userId) % 2

  if (bucket === 0) {
    return fetch('https://origin.sekolah.id/v1/dashboard')
  } else {
    return fetch('https://origin.sekolah.id/v2/dashboard')
  }
}
```

---

### Browser Caching Deep Dive

Browser caching adalah layer cache paling dekat dengan user.

#### Cache-Control Directives

```
Cache-Control: max-age=31536000
→ Cache selama 1 tahun (untuk asset yang tidak berubah: logo, font)

Cache-Control: no-cache
→ Cache boleh, tapi harus validasi dulu (304 Not Modified)

Cache-Control: no-store
→ Jangan cache sama sekali (untuk data sensitif)

Cache-Control: must-revalidate
→ Setelah expired, HARUS validasi ke server

Cache-Control: immutable
→ Resource tidak akan berubah selama max-age (optimisasi)
```

#### ETag — Validasi Cache

```
Request pertama:
Client → GET /api/students
Server → 200 OK + ETag: "abc123" + body: [...]

Request kedua (setelah cache):
Client → GET /api/students + If-None-Match: "abc123"
Server → cek apakah data berubah
         Jika TIDAK berubah → 304 Not Modified (body kosong, client pakai cache)
         Jika BERUBAH → 200 OK + ETag: "def456" + body: [...]
```

**Implementasi di Express.js:**

```javascript
app.get('/api/students', (req, res) => {
  const etag = generateETag(studentsData);

  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end(); // Not Modified
  }

  res.set('ETag', etag);
  res.set('Cache-Control', 'public, max-age=60');
  res.json(studentsData);
});
```

#### Last-Modified — Alternatif ETag

```
Request pertama:
Client → GET /api/students
Server → 200 OK + Last-Modified: Wed, 21 May 2026 10:00:00 GMT

Request kedua:
Client → GET /api/students + If-Modified-Since: Wed, 21 May 2026 10:00:00 GMT
Server → cek apakah data berubah setelah timestamp tersebut
         Jika TIDAK → 304 Not Modified
         Jika BERUBAH → 200 OK + Last-Modified: baru
```

**Perbandingan ETag vs Last-Modified:**

| Aspek | ETag | Last-Modified |
|---|---|---|
| Akurasi | Tinggi (hash content) | Rendah (detik) |
| Overhead | Harus compute hash | Cek timestamp saja |
| Content change | Detect semua perubahan | Tidak detect change dalam 1 detik |
| Use case | API response, dynamic content | Static files, images |

---

## 🎯 CONTOH NYATA

### Contoh 1: Cache untuk Aplikasi Sekolah

**Data apa yang di-cache:**
- Data siswa (jarang berubah, sering diakses)
- Data guru (jarang berubah)
- Konfigurasi aplikasi (hampir tidak pernah berubah)
- Halaman dashboard (cache HTML)

**Data apa yang TIDAK di-cache:**
- Absensi hari ini (real-time)
- Saldo BOS (akurasi penting)

**Strategi:** Cache-aside dengan TTL 1 jam untuk data siswa/guru.

### Contoh 2: E-Commerce — Strategi Lengkap

| Data | Cache | TTL | Strategy |
|---|---|---|---|
| Gambar produk | CDN | 1 minggu | Pull CDN |
| Halaman produk | Redis | 5 menit | Cache-aside |
| Keranjang belanja | Redis | 1 jam | Write-behind |
| Session user | Redis | 24 jam | Write-through |
| Harga produk | Redis | 1 menit | Refresh-ahead |
| Stock produk | Tidak di-cache | — | Langsung ke DB |

### Contoh 3: Twitter/X — Caching Architecture

Twitter menggunakan caching secara masif untuk menangani ratusan juta user:

```
Timeline Cache:
- Setiap user punya timeline yang di-cache di Redis
- Timeline di-pre-compute (fan-out on write) saat user baru tweet
- Tweet baru di-"fan-out" ke timeline semua follower yang aktif
- Follower tidak aktif: timeline di-generate saat mereka login (fan-out on read)

Redis Data Structures di Twitter:
- Sorted Sets → Timeline (tweet di-sort by timestamp)
- Lists → User's own tweets
- Sets → Followers, following
- Strings → User profile, tweet content

Cache Stats:
- Twitter melayani ~6000 tweets per detik
- Tanpa cache, database akan crash dalam hitungan detik
- Hit ratio timeline: ~95%+
```

### Contoh 4: Facebook — Memcached at Scale

```
Facebook menggunakan Memcached (bukan Redis) karena:
- Scale mereka terlalu besar untuk Redis single-threaded
- Mereka hanya butuh simple key-value cache
- Multi-threaded Memcached lebih cocok untuk throughput tinggi

Architecture:
- Ribuan Memcached server
- Client-side sharding (bukan server-side cluster)
- Setiap server handle subset dari keys
- Jika satu server down, data di-rebuild dari database

Cache Hierarchy di Facebook:
L1: APC cache (in-process PHP) — TTL detik
L2: Memcached cluster — TTL menit/jam
L3: MySQL (database) — persistent storage
```

---

## 💡 PRAKTIK

### Latihan 1: Desain Cache untuk Portal Sekolah

Desain cache untuk aplikasi portal sekolah:
- Data guru (200 guru) — jarang berubah
- Berita sekolah (50 berita) — berubah setiap minggu
- Jadwal pelajaran — berubah per semester
- Absensi hari ini — real-time

Tentukan: apa yang di-cache, TTL, dan strateginya.

**Jawaban:**

| Data | Cache | TTL | Strategy | Alasan |
|---|---|---|---|---|
| Data guru | Redis (Hash) | 24 jam | Cache-aside | Jarang berubah, sering diakses |
| Berita sekolah | Redis (List) | 1 jam | Cache-aside + explicit invalidate | Invalidate saat berita baru dipublish |
| Jadwal pelajaran | Redis (Hash) | 1 minggu | Cache-aside | Berubah per semester |
| Absensi hari ini | Tidak di-cache | — | Langsung DB | Real-time, akurasi penting |

### Latihan 2: Strategi Update Cache

Untuk setiap skenario, tentukan strategi update cache:

1. Profil user (jarang berubah)
2. Counter "dilihat X kali"
3. Keranjang belanja
4. Harga saham real-time
5. Artikel blog

**Jawaban:**
1. Cache-aside (lazy loading) — jarang berubah, boleh stale beberapa menit
2. Write-behind (tambah counter di cache, batch ke DB setiap 5 menit)
3. Write-through (harus konsisten, user tidak boleh kehilangan item keranjang)
4. Jangan di-cache (data terlalu dinamis, berubah setiap detik)
5. Cache-aside (boleh stale beberapa menit, invalidate explicit saat edit)

### Latihan 3: Desain Cache untuk Aplikasi Ride-Hailing

**Skenario:** Aplikasi seperti Gojek/Grab dengan fitur:
- 1 juta driver aktif
- 5 juta user aktif
- Real-time location tracking
- Pricing dinamis (surge pricing)
- Ride history

**Tantangannya:**
1. Location driver berubah setiap 5 detik — apakah di-cache?
2. Surge pricing berubah setiap menit — strategi cache?
3. Ride history — cache untuk user yang sering cek riwayat?
4. Driver rating — cache atau langsung DB?

**Desain Solusi:**

```
Location Tracking:
→ Redis Geo (GEOADD, GEORADIUS) untuk spatial query
→ TTL: 30 detik (auto cleanup driver tidak aktif)
→ Write: langsung update Redis, async sync ke DB setiap 1 menit

Surge Pricing:
→ Redis Hash: HSET surge:zone:jakarta-selatan price_multiplier 1.5
→ TTL: 2 menit
→ Strategy: Write-through (pricing harus akurat)

Ride History:
→ Redis List: LPUSH history:user:123 '{"rideId": "R001", ...}'
→ Max 50 rides per user (LTRIM)
→ TTL: 7 hari (data lama tetap di DB)

Driver Rating:
→ Redis String: SET rating:driver:456 4.85 EX 3600
→ Strategy: Cache-aside dengan explicit invalidate saat ada rating baru
→ Update rating: HINCRBY rating:driver:456 totalScore + HINCRBY rating:driver:456 count
```

### Latihan 4: Troubleshooting Cache Issues

**Masalah:** Aplikasi e-commerce mengalami downtime setiap hari jam 12:00 siang.

**Gejala:**
- Database CPU spike ke 100%
- Response time naik dari 50ms ke 5000ms
- Error rate meningkat drastis

**Analisis:**
1. Cek apakah ada cache key yang expired bersamaan jam 12:00 → **Cache Avalanche**
2. Jika semua TTL = 24 jam dan di-set jam 12:00 kemarin → semua expired jam 12:00 hari ini

**Solusi:**
```javascript
// Tambahkan jitter ke TTL
const baseTTL = 86400; // 24 jam
const jitter = Math.floor(Math.random() * 7200); // 0-2 jam random
const ttl = baseTTL + jitter;
await redis.setex(key, ttl, value);
```

---

## ✅ CHECKLIST

- [ ] Bisa jelaskan apa itu cache dan kenapa penting
- [ ] Paham berbagai tingkatan cache (client, CDN, server, app, DB)
- [ ] Paham 4 strategi update cache (aside, through, behind, ahead)
- [ ] Paham cache eviction policy (LRU, LFU, FIFO, TTL)
- [ ] Paham masalah cache stampede dan solusinya
- [ ] Bisa menghitung cache hit ratio dan dampaknya terhadap latensi
- [ ] Paham Redis data structures (strings, hashes, lists, sets, sorted sets, streams)
- [ ] Paham perbedaan Redis vs Memcached dan kapan pakai masing-masing
- [ ] Paham cache invalidation strategies (TTL, explicit, versioning)
- [ ] Paham distributed caching dan consistent hashing
- [ ] Paham cache penetration, breakdown, avalanche dan solusinya
- [ ] Paham CDN caching headers dan edge computing
- [ ] Paham browser caching (Cache-Control, ETag, Last-Modified)
- [ ] Bisa mendesain strategi cache untuk aplikasi kompleks

---

## 🔗 REFERENSI

- **Repo Asli:** [donnemartin/system-design-primer — Cache](https://github.com/donnemartin/system-design-primer#cache)
- **Redis Docs:** [Redis Documentation](https://redis.io/docs/)
- **Redis Data Structures:** [Redis Data Types](https://redis.io/docs/data-types/)
- **Cache Strategies:** [Redis Cache Patterns](https://redis.io/docs/latest/develop/use-case/cache/patterns/)
- **Consistent Hashing:** [Consistent Hashing Explained](https://www.toptal.com/big-data/consistent-hashing)
- **CDN Caching:** [Cloudflare Cache Documentation](https://developers.cloudflare.com/cache/)
- **Browser Caching:** [MDN HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- **Twitter Engineering:** [Twitter's Use of Redis](https://blog.twitter.com/engineering)
- **Facebook Engineering:** [Scaling Memcached at Facebook](https://engineering.fb.com/2013/04/19/core-data/memcached/)

---

> **Lanjut ke:** [`15-asynchronism.md`](./15-asynchronism.md)
