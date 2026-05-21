# 18 — Studi Kasus: Desain Pastebin.com & Bit.ly (URL Shortener)

> **Estimasi:** 3-4 jam | **Level:** Menengah-Lanjut
> **Sumber:** [donnemartin/system-design-primer — Pastebin](https://github.com/donnemartin/system-design-primer/tree/master/solutions/system_design/pastebin)
> **Referensi Tambahan:** [System Design Interview — Alex Xu, Chapter 7]

---

## 📖 TEORI

### Apa Itu Pastebin dan URL Shortener?

**Pastebin** adalah layanan web yang memungkinkan pengguna menyimpan teks biasa secara online dan membagikannya melalui link unik. Layanan ini sering digunakan developer untuk berbagi snippet kode, log error, atau konfigurasi.

**Bit.ly (URL Shortener)** adalah layanan yang mengubah URL panjang menjadi URL pendek yang lebih mudah dibagikan. Contoh: `https://contoh.com/artikel/panjang/sekali?ref=email&utm_source=facebook` menjadi `https://bit.ly/3xY7aB`.

Kedua layanan ini memiliki **pola arsitektur yang sama**:
1. Menerima input dari user (teks atau URL panjang)
2. Menghasilkan identifier unik (hash/short code)
3. Menyimpan mapping antara identifier dan data asli
4. Mengembalikan data saat identifier diakses

Pola ini disebut **Key-Value Lookup Pattern** dan merupakan fondasi dari banyak sistem distributed.

---

## 🏗️ STUDI KASUS 1: DESAIN PASTEBIN

### Step 1: Requirements Gathering

Sebelum mulai mendesain arsitektur, kita harus memahami kebutuhan sistem secara menyeluruh. Dalam interview system design, ini adalah langkah pertama yang selalu ditanyakan.

#### A. Functional Requirements (Kebutuhan Fungsional)

Functional requirements mendefinisikan **apa yang harus bisa dilakukan sistem**:

| # | Requirement | Deskripsi |
|---|-------------|-----------|
| FR-1 | **Create Paste** | User bisa membuat paste baru dengan konten teks |
| FR-2 | **Read Paste** | User bisa membaca paste melalui link unik |
| FR-3 | **Generate Unique Link** | Sistem menghasilkan link pendek yang unik untuk setiap paste |
| FR-4 | **Set Expiration** | User bisa menentukan waktu kadaluarsa paste |
| FR-5 | **Update Paste** *(optional)* | User bisa mengedit paste yang sudah dibuat |
| FR-6 | **Delete Paste** *(optional)* | User bisa menghapus paste sebelum expired |
| FR-7 | **Rate Limiting** | Mencegah abuse dengan membatasi jumlah paste per user/IP |

#### B. Non-Functional Requirements (Kebutuhan Non-Fungsional)

Non-functional requirements mendefinisikan **bagaimana sistem harus berperilaku**:

| # | Requirement | Deskripsi |
|---|-------------|-----------|
| NFR-1 | **Read-Heavy** | Rasio read:write = 100:1 (sistem lebih banyak dibaca) |
| NFR-2 | **Low Latency** | Read paste harus < 100ms |
| NFR-3 | **High Availability** | Sistem harus tersedia 99.99% (4 nines) |
| NFR-4 | **Durability** | Data tidak boleh hilang setelah disimpan |
| NFR-5 | **Scalability** | Bisa menangani jutaan paste baru per hari |
| NFR-6 | **Eventual Consistency** | Untuk update/delete, eventual consistency acceptable |

#### C. Capacity Estimation (Estimasi Kapasitas)

Ini adalah bagian kritis yang sering diabaikan. Kita perlu menghitung berapa resource yang dibutuhkan.

**Asumsi:**
- 1 juta paste baru per hari
- 100 juta read paste per hari
- Rata-rata ukuran paste = 10 KB
- Maksimal ukuran paste = 10 MB
- Data disimpan selama 30 hari
- Rasio read:write = 100:1

**Perhitungan Storage:**

```
Paste baru per hari:     1.000.000 paste
Ukuran rata-rata:        10 KB = 10.000 bytes
Storage per hari:        1.000.000 × 10 KB = 10 GB/hari
Storage per bulan:       10 GB × 30 hari = 300 GB/bulan
Storage per tahun:       300 GB × 12 = 3.6 TB/tahun

Dengan indeks dan metadata (×2):
Total storage/bulan:     300 GB × 2 = 600 GB
Total storage/tahun:     3.6 TB × 2 = 7.2 TB
```

**Perhitungan Bandwidth:**

```
Write bandwidth per hari:
  1.000.000 paste × 10 KB = 10 GB/hari
  10 GB / 86.400 detik = ~116 KB/detik = ~1 Mbps

Read bandwidth per hari:
  100.000.000 read × 10 KB = 1.000 GB/hari = 1 TB/hari
  1 TB / 86.400 detik = ~11.6 MB/detik = ~93 Mbps

Peak traffic (asumsi 10× rata-rata):
  Peak write:  ~10 Mbps
  Peak read:   ~930 Mbps ≈ 1 Gbps
```

**Perhitungan QPS (Queries Per Second):**

```
Write QPS rata-rata:
  1.000.000 / 86.400 = ~12 paste/detik

Read QPS rata-rata:
  100.000.000 / 86.400 = ~1.157 read/detik

Peak QPS (10× rata-rata):
  Peak write: ~120 write/detik
  Peak read:  ~11.570 read/detik
```

**Kesimpulan Capacity:**
- Storage: ~600 GB/bulan, ~7.2 TB/tahun
- Bandwidth: ~1 Gbps peak read
- QPS: ~120 write/s, ~11.5K read/s peak

---

### Step 2: API Design

API yang baik harus **RESTful**, **konsisten**, dan **well-documented**. Berikut desain lengkap API untuk Pastebin.

#### A. Create Paste

```http
POST /api/v1/pastes
Content-Type: application/json
X-RateLimit-User: user_or_ip_hash

Request Body:
{
  "content": "function hello() {\n  console.log('Hello World');\n}",
  "title": "Hello World Example",
  "syntax": "javascript",
  "expiration": "1d",
  "visibility": "public"
}

Response 201 Created:
{
  "id": "aB3xY7",
  "url": "https://pastebin.example.com/aB3xY7",
  "title": "Hello World Example",
  "syntax": "javascript",
  "created_at": "2026-05-21T10:30:00Z",
  "expires_at": "2026-05-22T10:30:00Z",
  "visibility": "public"
}

Response 400 Bad Request:
{
  "error": "INVALID_CONTENT",
  "message": "Content tidak boleh kosong atau melebihi 10MB"
}

Response 429 Too Many Requests:
{
  "error": "RATE_LIMITED",
  "message": "Terlalu banyak request. Coba lagi dalam 60 detik.",
  "retry_after": 60
}
```

#### B. Read Paste

```http
GET /api/v1/pastes/{paste_id}

Response 200 OK:
{
  "id": "aB3xY7",
  "content": "function hello() {\n  console.log('Hello World');\n}",
  "title": "Hello World Example",
  "syntax": "javascript",
  "created_at": "2026-05-21T10:30:00Z",
  "expires_at": "2026-05-22T10:30:00Z",
  "views": 1523,
  "visibility": "public"
}

Response 404 Not Found:
{
  "error": "PASTE_NOT_FOUND",
  "message": "Paste tidak ditemukan atau sudah kadaluarsa"
}

Response 410 Gone:
{
  "error": "PASTE_EXPIRED",
  "message": "Paste sudah kadaluarsa dan telah dihapus"
}
```

#### C. Update Paste

```http
PUT /api/v1/pastes/{paste_id}
Content-Type: application/json
Authorization: Bearer <api_key>

Request Body:
{
  "content": "function hello() {\n  console.log('Updated!');\n}",
  "title": "Updated Hello World"
}

Response 200 OK:
{
  "id": "aB3xY7",
  "updated_at": "2026-05-21T11:00:00Z",
  "message": "Paste berhasil diupdate"
}

Response 403 Forbidden:
{
  "error": "UNAUTHORIZED",
  "message": "Anda tidak memiliki akses untuk mengedit paste ini"
}
```

#### D. Delete Paste

```http
DELETE /api/v1/pastes/{paste_id}
Authorization: Bearer <api_key>

Response 204 No Content:
(Body kosong, paste berhasil dihapus)

Response 404 Not Found:
{
  "error": "PASTE_NOT_FOUND",
  "message": "Paste tidak ditemukan"
}
```

#### E. List User Pastes

```http
GET /api/v1/users/{user_id}/pastes?page=1&limit=20&sort=created_at

Response 200 OK:
{
  "data": [
    {
      "id": "aB3xY7",
      "title": "Hello World Example",
      "syntax": "javascript",
      "created_at": "2026-05-21T10:30:00Z",
      "views": 1523
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "has_next": true
  }
}
```

#### F. API Rate Limiting Headers

Semua response harus menyertakan header rate limiting:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1716278400
```

---

### Step 3: High-Level Design

Arsitektur high-level Pastebin terdiri dari beberapa komponen utama:

```
                    ┌─────────────────────────────────────────────┐
                    │                 CDN / DNS                    │
                    │         (CloudFlare, Route53)                │
                    └──────────────────┬──────────────────────────┘
                                       │
                    ┌──────────────────▼──────────────────────────┐
                    │            Load Balancer                     │
                    │         (Nginx, HAProxy, ALB)                │
                    └──────────────────┬──────────────────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
    ┌─────────▼─────────┐   ┌─────────▼─────────┐   ┌─────────▼─────────┐
    │   Web Server 1    │   │   Web Server 2    │   │   Web Server N    │
    │  (Application)    │   │  (Application)    │   │  (Application)    │
    └─────────┬─────────┘   └─────────┬─────────┘   └─────────┬─────────┘
              │                        │                        │
              └────────────────────────┼────────────────────────┘
                                       │
                    ┌──────────────────▼──────────────────────────┐
                    │              Cache Layer                     │
                    │         (Redis Cluster / Memcached)          │
                    └──────────────────┬──────────────────────────┘
                                       │
                    ┌──────────────────▼──────────────────────────┐
                    │          Database Layer                      │
                    │    (PostgreSQL Primary + Read Replicas)      │
                    └─────────────────────────────────────────────┘
                                       │
                    ┌──────────────────▼──────────────────────────┐
                    │         Background Workers                   │
                    │    (Expired Paste Cleanup, Analytics)        │
                    └─────────────────────────────────────────────┘
```

**Alur Data:**

1. **Write Path (Create Paste):**
   ```
   User → CDN → Load Balancer → Web Server → Generate Hash
     → Write to Database → Invalidate Cache → Return URL
   ```

2. **Read Path (Read Paste):**
   ```
   User → CDN → Load Balancer → Web Server → Check Cache
     → Cache Hit: Return from Redis ✅
     → Cache Miss: Read from DB → Store in Redis → Return
   ```

3. **Delete Path (Expired Paste):**
   ```
   Background Worker → Scan expired_at < NOW()
     → Delete from DB → Invalidate Cache → Log deletion
   ```

---

### Step 4: Database Design

#### A. Relational Database Schema (PostgreSQL)

```sql
-- Tabel utama untuk menyimpan paste
CREATE TABLE pastes (
    id          VARCHAR(10) PRIMARY KEY,
    title       VARCHAR(255),
    content     TEXT NOT NULL,
    syntax      VARCHAR(50) DEFAULT 'plaintext',
    user_id     BIGINT,
    visibility  VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'private')),
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at  TIMESTAMP WITH TIME ZONE,
    access_count BIGINT DEFAULT 0,
    is_deleted  BOOLEAN DEFAULT FALSE
);

-- Index untuk lookup cepat berdasarkan user
CREATE INDEX idx_pastes_user_id ON pastes(user_id)
    WHERE user_id IS NOT NULL;

-- Index untuk cleanup paste expired
CREATE INDEX idx_pastes_expires_at ON pastes(expires_at)
    WHERE expires_at IS NOT NULL AND is_deleted = FALSE;

-- Index untuk sorting by created_at (pagination)
CREATE INDEX idx_pastes_created_at ON pastes(created_at DESC);

-- Tabel untuk tracking analytics (views per hari)
CREATE TABLE paste_analytics (
    id          BIGSERIAL PRIMARY KEY,
    paste_id    VARCHAR(10) NOT NULL REFERENCES pastes(id),
    view_date   DATE NOT NULL DEFAULT CURRENT_DATE,
    view_count  INTEGER DEFAULT 0,
    UNIQUE(paste_id, view_date)
);

-- Index untuk analytics query
CREATE INDEX idx_analytics_paste_date ON paste_analytics(paste_id, view_date DESC);

-- Tabel untuk user (jika ada sistem autentikasi)
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    username    VARCHAR(50) UNIQUE NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    api_key     VARCHAR(64) UNIQUE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active   BOOLEAN DEFAULT TRUE
);
```

#### B. Data Model Visual

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│    users     │       │     pastes       │       │paste_analytics   │
├──────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)      │──┐    │ id (PK)          │    ┌──│ id (PK)          │
│ username     │  │    │ title            │    │  │ paste_id (FK)    │
│ email        │  │    │ content          │    │  │ view_date        │
│ api_key      │  │    │ syntax           │    │  │ view_count       │
│ created_at   │  │    │ user_id (FK)     │◄───┘  └──────────────────┘
│ is_active    │  │    │ visibility       │
└──────────────┘  │    │ created_at       │
                  │    │ updated_at       │
                  │    │ expires_at       │
                  │    │ access_count     │
                  │    │ is_deleted       │
                  └───►│                  │
                       └──────────────────┘
```

#### C. Indexing Strategy

| Index | Kolom | Tipe | Alasan |
|-------|-------|------|--------|
| Primary | `id` | B-Tree | Lookup paste by hash (most frequent) |
| Secondary | `user_id` | B-Tree (partial) | List paste by user |
| Secondary | `expires_at` | B-Tree (partial) | Cleanup expired paste |
| Secondary | `created_at` | B-Tree (DESC) | Pagination, sorting |
| Unique | `paste_id + view_date` | B-Tree | Prevent duplicate analytics |

#### D. NoSQL Alternative (Redis Key-Value)

Untuk sistem yang lebih mengutamakan kecepatan, kita bisa menggunakan Redis sebagai primary storage:

```
Key:   "paste:aB3xY7"
Value: {
  "content": "function hello() { ... }",
  "title": "Hello World",
  "syntax": "javascript",
  "user_id": 12345,
  "visibility": "public",
  "created_at": "2026-05-21T10:30:00Z",
  "expires_at": "2026-05-22T10:30:00Z",
  "access_count": 1523
}
TTL:   86400 (24 jam untuk cache, atau sesuai expires_at)

Key:   "analytics:aB3xY7:2026-05-21"
Value: 1523
TTL:   604800 (7 hari)
```

**Keuntungan Redis:**
- Read latency < 1ms (in-memory)
- Built-in TTL untuk auto-expire
- Atomic operations untuk increment counter

**Kekurangan Redis:**
- Data hilang jika tidak ada persistence (AOF/RDB)
- Memory lebih mahal dari disk storage
- Query kompleks (filter, join) tidak supported

#### E. Hybrid Approach (Recommended)

Pendekatan terbaik adalah **hybrid**: Redis untuk cache + PostgreSQL untuk persistence.

```
Write:  PostgreSQL (durability) → Redis (cache warming)
Read:   Redis (fast) → fallback ke PostgreSQL (cache miss)
Delete: PostgreSQL → Redis DEL (cache invalidation)
```

---

### Step 5: Detailed Component Design

#### A. Hash Generation Algorithm

Bagaimana cara menghasilkan unique ID yang pendek dan unik? Ada beberapa pendekatan:

**Pendekatan 1: MD5 Hash + Base62 Encoding**

```python
import hashlib
import base64

def generate_hash(content: str, length: int = 7) -> str:
    """
    Generate short hash dari content menggunakan MD5 + Base62.

    Args:
        content: Teks paste
        length: Panjang hash yang diinginkan (default 7)

    Returns:
        String hash Base62 sepanjang 'length' karakter
    """
    # Step 1: Generate MD5 hash dari content + timestamp
    raw = f"{content}:{timestamp_ns()}"
    md5_hash = hashlib.md5(raw.encode()).hexdigest()  # 32 karakter hex

    # Step 2: Convert hex ke integer
    hash_int = int(md5_hash, 16)

    # Step 3: Encode ke Base62
    charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    result = ""
    while hash_int > 0 and len(result) < length:
        hash_int, remainder = divmod(hash_int, 62)
        result = charset[remainder] + result

    # Pad jika perlu
    return result.zfill(length)
```

**Kapasitas Base62:**

```
Panjang 6 karakter:  62^6  = 56.800.235.584     (~56 miliar)
Panjang 7 karakter:  62^7  = 3.521.614.606.208   (~3.5 triliun)
Panjang 8 karakter:  62^8  = 218.340.105.584.896 (~218 triliun)

Dengan 7 karakter Base62, kita bisa menyimpan ~3.5 triliun paste.
Cukup untuk 1 juta paste/hari selama ~9.600 tahun!
```

**Pendekatan 2: Auto-Increment ID + Base62**

```python
def id_to_base62(auto_id: int) -> str:
    """
    Convert auto-increment ID ke Base62.

    ID 1001 → "g7"
    ID 1002 → "g8"
    ID 999999 → "23bT"
    """
    charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    result = ""
    while auto_id > 0:
        auto_id, remainder = divmod(auto_id, 62)
        result = charset[remainder] + result
    return result
```

**Keuntungan Auto-Increment:**
- Tidak ada collision (selama ID unik)
- Sequential, mudah di-predict
- Tidak perlu cek duplikasi

**Kekurangan Auto-Increment:**
- Predictable (user bisa iterate semua paste)
- Single point of failure (DB auto-increment)
- Sulit di-shard

**Pendekatan 3: Snowflake ID (Twitter-style)**

```
64-bit Snowflake ID:
┌─────────────────┬──────────────┬──────────────┬──────────────┐
│  Timestamp (41)  │ Machine (10) │ Sequence (12)│   Reserved   │
└─────────────────┴──────────────┴──────────────┴──────────────┘

- 41-bit timestamp: milisecond precision (~69 tahun)
- 10-bit machine ID: 1024 server unik
- 12-bit sequence: 4096 ID per milisecond per server

Total: ~4 miliar ID per detik secara global
```

**Keuntungan Snowflake:**
- Distributed, no single point of failure
- Time-sortable
- Sangat scalable

**Perbandingan Pendekatan:**

| Aspek | MD5+Base62 | Auto-Increment | Snowflake |
|-------|------------|----------------|-----------|
| Collision | Mungkin (perlu retry) | Tidak | Tidak |
| Predictable | Tidak | Ya | Tidak |
| Distributed | Ya | Tidak | Ya |
| Time-sortable | Tidak | Ya | Ya |
| Complexity | Rendah | Rendah | Sedang |

**Rekomendasi:** Untuk Pastebin, gunakan **MD5+Base62** dengan collision handling, atau **Snowflake** untuk sistem yang lebih besar.

#### B. Collision Handling

Saat menggunakan hash-based approach, collision bisa terjadi. Berikut strategi handling:

```python
def create_paste(content: str, db) -> str:
    """
    Create paste dengan collision handling.
    """
    max_retries = 5

    for attempt in range(max_retries):
        # Generate hash
        paste_id = generate_hash(content)

        # Cek apakah hash sudah ada di database
        existing = db.query("SELECT id FROM pastes WHERE id = ?", paste_id)

        if existing is None:
            # Hash unik, insert paste
            db.execute(
                "INSERT INTO pastes (id, content, created_at) VALUES (?, ?, NOW())",
                paste_id, content
            )
            return paste_id

        # Collision! Tambahkan salt dan retry
        content = f"{content}:{random_salt()}"

    raise Exception("Gagal generate unique ID setelah 5 percobaan")
```

**Strategi Collision Handling:**

1. **Retry dengan Salt:** Tambahkan random string ke input, generate ulang
2. **Increment Counter:** Jika collision, increment counter dan generate ulang
3. **Pre-check:** Cek existence sebelum insert (optimistic locking)
4. **Database Constraint:** Biarkan DB reject duplicate, catch error di application layer

#### C. Cache Strategy Detail

**Cache-Aside Pattern (Lazy Loading):**

```python
def get_paste(paste_id: str, redis, db) -> dict:
    """
    Get paste dengan cache-aside pattern.
    """
    # Step 1: Cek Redis cache
    cached = redis.get(f"paste:{paste_id}")
    if cached:
        # Cache hit! Return langsung
        return json.loads(cached)

    # Step 2: Cache miss, baca dari database
    paste = db.query("SELECT * FROM pastes WHERE id = ?", paste_id)
    if paste is None:
        raise NotFoundError("Paste tidak ditemukan")

    # Step 3: Simpan ke Redis dengan TTL
    ttl = calculate_ttl(paste.expires_at)
    redis.setex(f"paste:{paste_id}", ttl, json.dumps(paste))

    return paste
```

**Write-Through Pattern (untuk consistency):**

```python
def update_paste(paste_id: str, new_content: str, redis, db) -> None:
    """
    Update paste dengan write-through pattern.
    """
    # Step 1: Update database (synchronous)
    db.execute(
        "UPDATE pastes SET content = ?, updated_at = NOW() WHERE id = ?",
        new_content, paste_id
    )

    # Step 2: Update cache (synchronous)
    paste = db.query("SELECT * FROM pastes WHERE id = ?", paste_id)
    ttl = calculate_ttl(paste.expires_at)
    redis.setex(f"paste:{paste_id}", ttl, json.dumps(paste))
```

**TTL Strategy:**

```
Paste populer (views > 1000):     TTL = 24 jam
Paste normal (views 1-1000):      TTL = 6 jam
Paste baru (< 1 jam):             TTL = 1 jam
Paste hampir expired (< 1 hari):  TTL = sisa waktu expired
```

---

### Step 6: Scaling dan Bottleneck Analysis

#### A. Identifikasi Bottleneck

| Komponen | Bottleneck | Dampak |
|----------|------------|--------|
| Database Write | Single primary DB tidak bisa handle 120 write/s | Write latency meningkat |
| Database Read | Single DB tidak bisa handle 11.5K read/s | Read timeout |
| Cache | Redis single node memory limit | Cache eviction, miss rate naik |
| Network | 1 Gbps bandwidth saturasi | Request dropped |
| Hash Generation | CPU-bound operation | Slow response time |

#### B. Solusi Scaling

**1. Database Scaling — Read Replicas**

```
                    ┌──────────────────┐
                    │   Primary (RW)   │  ← Write paste, update
                    │   PostgreSQL     │
                    └────────┬─────────┘
                             │ Replication
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │  Replica 1  │ │  Replica 2  │ │  Replica N  │  ← Read paste
    │   (RO)      │ │   (RO)      │ │   (RO)      │
    └─────────────┘ └─────────────┘ └─────────────┘
```

**Load Balancing Read Queries:**
- Round-robin: Distribusi merata ke semua replica
- Weighted: Replica dengan resource lebih mendapat traffic lebih
- Latency-based: Route ke replica dengan latency terendah

**2. Database Scaling — Sharding**

Ketika single primary tidak cukup, kita shard berdasarkan hash:

```
Shard 1: Hash A-F → PostgreSQL Node 1
Shard 2: Hash G-M → PostgreSQL Node 2
Shard 3: Hash N-S → PostgreSQL Node 3
Shard 4: Hash T-Z → PostgreSQL Node 4
```

**Sharding Key:** Karakter pertama dari paste ID (Base62).

**Keuntungan Sharding:**
- Write throughput 4× (4 node)
- Storage terdistribusi
- Independent scaling per shard

**Tantangan Sharding:**
- Cross-shard query sulit
- Rebalancing saat tambah shard
- Transaction across shard kompleks

**3. Cache Scaling — Redis Cluster**

```
┌─────────────────────────────────────────────┐
│            Redis Cluster (6 nodes)           │
├─────────────┬─────────────┬─────────────────┤
│  Master 1   │  Master 2   │    Master 3     │
│  (Slots 0)  │  (Slots 1)  │   (Slots 2)     │
├─────────────┼─────────────┼─────────────────┤
│  Replica 1  │  Replica 2  │   Replica 3     │
│  (Failover) │  (Failover) │   (Failover)    │
└─────────────┴─────────────┴─────────────────┘
```

**Redis Cluster Features:**
- Automatic sharding (16384 hash slots)
- Automatic failover
- Horizontal scaling

**4. CDN untuk Static Content**

```
User → CloudFlare CDN → Edge Server (terdekat) → Origin Server
```

**Apa yang di-cache di CDN:**
- Landing page HTML
- CSS, JavaScript, images
- Paste yang sangat populer (hot content)

**CDN Cache TTL:**
- Static assets: 1 tahun (immutable)
- Landing page: 5 menit
- Hot paste: 1 menit

#### C. Background Workers

**Expired Paste Cleanup:**

```python
def cleanup_expired_pastes(db, batch_size: int = 1000):
    """
    Hapus paste yang sudah expired secara berkala.
    Dijalankan setiap 1 jam oleh cron job / scheduler.
    """
    while True:
        # Ambil batch paste expired
        expired = db.query(
            """SELECT id FROM pastes
               WHERE expires_at < NOW()
               AND is_deleted = FALSE
               LIMIT ?""",
            batch_size
        )

        if not expired:
            break

        # Soft delete (mark as deleted)
        ids = [p.id for p in expired]
        db.execute(
            "UPDATE pastes SET is_deleted = TRUE WHERE id IN ?",
            ids
        )

        # Invalidate cache
        for paste_id in ids:
            redis.delete(f"paste:{paste_id}")

        # Hard delete setelah 7 hari (optional)
        # db.execute("DELETE FROM pastes WHERE is_deleted = TRUE AND updated_at < ? - INTERVAL '7 days'")
```

**Analytics Aggregation:**

```python
def aggregate_analytics(db, redis):
    """
    Agregasi analytics dari Redis ke database.
    Dijalankan setiap 5 menit.
    """
    # Ambil semua counter dari Redis
    keys = redis.keys("analytics:*")

    for key in keys:
        paste_id = key.split(":")[1]
        count = redis.get(key)

        # Upsert ke database
        db.execute(
            """INSERT INTO paste_analytics (paste_id, view_date, view_count)
               VALUES (?, CURRENT_DATE, ?)
               ON CONFLICT (paste_id, view_date)
               DO UPDATE SET view_count = view_count + ?""",
            paste_id, count, count
        )

        # Reset counter di Redis
        redis.delete(key)
```

---

### Step 7: Failure Scenarios dan Mitigasi

#### A. Failure Scenarios

| Skenario | Dampak | Mitigasi |
|----------|--------|----------|
| **Primary DB Down** | Write tidak bisa, read bisa dari replica | Automatic failover ke replica, promote replica jadi primary |
| **Redis Cluster Down** | Semua request fallback ke DB (slow) | Graceful degradation, DB handle semua request |
| **Cache Stampede** | Banyak request ke key yang sama saat cache miss | Locking, probabilistic early expiration |
| **Hash Collision Rate Tinggi** | Banyak retry, slow write | Increase hash length, gunakan Snowflake |
| **DDoS Attack** | Server overload | Rate limiting, WAF, CAPTCHA |
| **Data Corruption** | Data paste hilang/rusak | Backup berkala, replication, checksum |
| **Network Partition** | Split brain, inconsistent data | Consensus algorithm, quorum |

#### B. Cache Stampede Prevention

```python
import threading

# Global lock untuk mencegah stampede
_locks = {}

def get_paste_with_stampede_protection(paste_id: str, redis, db) -> dict:
    """
    Prevent cache stampede dengan locking.
    """
    cached = redis.get(f"paste:{paste_id}")
    if cached:
        return json.loads(cached)

    # Cek apakah ada request lain yang sedang fetching
    lock_key = f"lock:{paste_id}"
    if redis.get(lock_key):
        # Request lain sedang fetching, tunggu sebentar
        time.sleep(0.1)
        # Retry cache
        cached = redis.get(f"paste:{paste_id}")
        if cached:
            return json.loads(cached)

    # Acquire lock
    redis.setex(lock_key, 10, "1")  # Lock 10 detik

    try:
        # Fetch dari database
        paste = db.query("SELECT * FROM pastes WHERE id = ?", paste_id)
        if paste:
            ttl = calculate_ttl(paste.expires_at)
            redis.setex(f"paste:{paste_id}", ttl, json.dumps(paste))
        return paste
    finally:
        # Release lock
        redis.delete(lock_key)
```

#### C. Graceful Degradation

Saat Redis down, sistem tetap berfungsi dengan fallback ke database:

```python
def get_paste_graceful(paste_id: str, redis, db) -> dict:
    """
    Graceful degradation: fallback ke DB jika Redis down.
    """
    try:
        cached = redis.get(f"paste:{paste_id}")
        if cached:
            return json.loads(cached)
    except RedisConnectionError:
        # Redis down, log warning dan fallback ke DB
        logger.warning("Redis unavailable, falling back to database")

    # Fallback ke database
    paste = db.query("SELECT * FROM pastes WHERE id = ?", paste_id)
    return paste
```

---

### Step 8: Monitoring dan Alerting Strategy

#### A. Key Metrics untuk Monitoring

**Business Metrics:**
- Total paste created per hari
- Total paste views per hari
- Active users per hari
- Average paste size

**System Metrics:**
- Request latency (p50, p95, p99)
- Request rate (QPS)
- Error rate (4xx, 5xx)
- Cache hit ratio

**Database Metrics:**
- Connection pool usage
- Query latency
- Replication lag
- Disk usage

**Cache Metrics:**
- Memory usage
- Eviction rate
- Hit/miss ratio
- Connection count

#### B. Alerting Rules

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| Error Rate | > 1% selama 5 menit | > 5% selama 2 menit | Page on-call engineer |
| Latency p99 | > 500ms selama 10 menit | > 2s selama 5 menit | Auto-scale, investigate |
| Cache Hit Ratio | < 80% selama 30 menit | < 50% selama 10 menit | Check cache eviction |
| DB Replication Lag | > 5 detik | > 30 detik | Check replica health |
| Disk Usage | > 70% | > 90% | Cleanup expired data |
| Memory Usage | > 80% | > 95% | Scale up, evict cache |

#### C. Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                    PASTEBIN DASHBOARD                        │
├──────────────────────┬──────────────────────────────────────┤
│  Request Rate        │  Latency (p50/p95/p99)               │
│  12.5K req/s         │  12ms / 45ms / 120ms                 │
│  ▲ 5% vs yesterday   │  ▼ 10% vs yesterday                  │
├──────────────────────┼──────────────────────────────────────┤
│  Cache Hit Ratio     │  Error Rate                          │
│  94.2%               │  0.03%                               │
│  ▲ 1% vs yesterday   │  ▼ 0.01% vs yesterday                │
├──────────────────────┼──────────────────────────────────────┤
│  DB Connections      │  Redis Memory                        │
│  45/100 (45%)        │  12.3 GB / 16 GB (77%)               │
│  Normal              │  Warning: > 80%                      │
├──────────────────────┼──────────────────────────────────────┤
│  Replication Lag     │  Disk Usage                          │
│  0.5s                │  2.1 TB / 5 TB (42%)                 │
│  Normal              │  Normal                              │
└──────────────────────┴──────────────────────────────────────┘
```

---

## 🏗️ STUDI KASUS 2: DESAIN URL SHORTENER (Bit.ly)

### Step 1: Requirements Gathering

#### A. Functional Requirements

| # | Requirement | Deskripsi |
|---|-------------|-----------|
| FR-1 | **Shorten URL** | User bisa membuat URL pendek dari URL panjang |
| FR-2 | **Redirect** | User di-redirect ke URL asli saat mengakses URL pendek |
| FR-3 | **Custom Alias** | User bisa memilih custom short code (premium) |
| FR-4 | **Analytics** | Track jumlah klik, lokasi, device, referrer |
| FR-5 | **Expiration** | URL pendek bisa memiliki waktu kadaluarsa |
| FR-6 | **QR Code** | Generate QR code dari URL pendek |

#### B. Non-Functional Requirements

| # | Requirement | Target |
|---|-------------|--------|
| NFR-1 | **Read-Heavy** | Rasio read:write = 1000:1 (redirect jauh lebih banyak) |
| NFR-2 | **Low Latency** | Redirect < 50ms (user experience critical) |
| NFR-3 | **High Availability** | 99.99% (URL pendek harus selalu bisa diakses) |
| NFR-4 | **Durability** | URL mapping tidak boleh hilang |

#### C. Capacity Estimation

**Asumsi (skala Bit.ly):**
- 100 juta URL baru per bulan
- 100 miliar redirect per bulan
- Rasio read:write = 1000:1

```
Storage per bulan:
  100.000.000 URL × 500 bytes (rata-rata URL) = 50 GB/bulan
  Dengan indeks dan metadata (×3): 150 GB/bulan
  Storage per tahun: 150 GB × 12 = 1.8 TB

QPS rata-rata:
  Write: 100.000.000 / (30 × 86.400) = ~38 write/detik
  Read:  100.000.000.000 / (30 × 86.400) = ~38.580 read/detik

Peak QPS (5× rata-rata):
  Peak write: ~190 write/detik
  Peak read:  ~192.900 read/detik ≈ 193K read/detik
```

**Kesimpulan:** URL shortener butuh **read throughput yang sangat tinggi** (193K QPS peak) dengan **storage yang relatif kecil**.

---

### Step 2: API Design

#### A. Shorten URL

```http
POST /api/v1/shorten
Content-Type: application/json

Request Body:
{
  "url": "https://contoh.com/artikel/panjang/sekali?ref=email&utm_source=facebook",
  "custom_alias": "my-article",  // optional
  "expires_in": "30d",           // optional
  "domain": "bit.ly"             // optional, untuk custom domain
}

Response 201 Created:
{
  "short_url": "https://bit.ly/my-article",
  "original_url": "https://contoh.com/artikel/panjang/sekali?ref=email&utm_source=facebook",
  "created_at": "2026-05-21T10:30:00Z",
  "expires_at": "2026-06-20T10:30:00Z",
  "qr_code": "https://api.bit.ly/qr/my-article.png"
}

Response 409 Conflict (custom alias sudah dipakai):
{
  "error": "ALIAS_TAKEN",
  "message": "Custom alias 'my-article' sudah digunakan"
}

Response 400 Bad Request (URL invalid):
{
  "error": "INVALID_URL",
  "message": "URL tidak valid atau tidak dapat diakses"
}
```

#### B. Redirect (HTTP 301/302)

```http
GET /{short_code}

Response 301 Moved Permanently:
Location: https://contoh.com/artikel/panjang/sekali?ref=email&utm_source=facebook
Cache-Control: max-age=3600

Catatan:
- 301: Permanent redirect (browser cache, analytics tetap tercatat)
- 302: Temporary redirect (tidak di-cache, setiap request tercatat)
```

#### C. Get Analytics

```http
GET /api/v1/analytics/{short_code}?period=7d

Response 200 OK:
{
  "short_code": "my-article",
  "total_clicks": 15234,
  "period": "7d",
  "daily_clicks": [
    {"date": "2026-05-15", "clicks": 2100},
    {"date": "2026-05-16", "clicks": 2350},
    ...
  ],
  "referrers": [
    {"source": "twitter.com", "clicks": 5200},
    {"source": "facebook.com", "clicks": 3100},
    {"source": "direct", "clicks": 6934}
  ],
  "countries": [
    {"country": "ID", "clicks": 8500},
    {"country": "US", "clicks": 3200},
    {"country": "SG", "clicks": 1534}
  ],
  "devices": [
    {"device": "mobile", "clicks": 9200},
    {"device": "desktop", "clicks": 5034},
    {"device": "tablet", "clicks": 1000}
  ]
}
```

---

### Step 3: High-Level Design

```
                    ┌─────────────────────────────────────────────┐
                    │                 CDN / DNS                    │
                    │         (CloudFlare, Route53)                │
                    │    DNS Resolution: bit.ly → Edge Server      │
                    └──────────────────┬──────────────────────────┘
                                       │
                    ┌──────────────────▼──────────────────────────┐
                    │            Load Balancer                     │
                    │         (Nginx, HAProxy, ALB)                │
                    └──────────────────┬──────────────────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
    ┌─────────▼─────────┐   ┌─────────▼─────────┐   ┌─────────▼─────────┐
    │   Redirect Svc 1  │   │   Redirect Svc 2  │   │   Redirect Svc N  │
    │  (Stateless)      │   │  (Stateless)      │   │  (Stateless)      │
    └─────────┬─────────┘   └─────────┬─────────┘   └─────────┬─────────┘
              │                        │                        │
              └────────────────────────┼────────────────────────┘
                                       │
                    ┌──────────────────▼──────────────────────────┐
                    │              Cache Layer                     │
                    │         (Redis Cluster - Read Heavy)         │
                    │    Hot URLs: 99% cache hit ratio             │
                    └──────────────────┬──────────────────────────┘
                                       │
                    ┌──────────────────▼──────────────────────────┐
                    │          Database Layer                      │
                    │    (Cassandra / DynamoDB - Write Heavy)      │
                    │    URL mapping + Analytics                   │
                    └─────────────────────────────────────────────┘
```

**Perbedaan Utama dengan Pastebin:**
1. **Redirect Service** adalah stateless dan sangat ringan — hanya lookup + HTTP 301
2. **Analytics** ditulis secara async (tidak blocking redirect)
3. **DNS-level caching** bisa digunakan untuk URL yang sangat populer
4. **Database choice**: Cassandra/DynamoDB lebih cocok untuk write-heavy analytics

---

### Step 4: Database Design

#### A. URL Mapping Table

```sql
CREATE TABLE url_mapping (
    short_code  VARCHAR(10) PRIMARY KEY,
    long_url    TEXT NOT NULL,
    user_id     BIGINT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at  TIMESTAMP WITH TIME ZONE,
    status      VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'expired')),
    domain      VARCHAR(100) DEFAULT 'bit.ly',
    custom_alias BOOLEAN DEFAULT FALSE
);

-- Index untuk lookup by user
CREATE INDEX idx_url_mapping_user ON url_mapping(user_id)
    WHERE user_id IS NOT NULL;

-- Index untuk cleanup expired URLs
CREATE INDEX idx_url_mapping_expires ON url_mapping(expires_at)
    WHERE expires_at IS NOT NULL AND status = 'active';
```

#### B. Analytics Table (Time-Series)

Untuk analytics, kita butuh time-series database atau table yang dioptimalkan untuk write:

```sql
-- Click events (raw data, bisa sangat besar)
CREATE TABLE click_events (
    id          BIGSERIAL,
    short_code  VARCHAR(10) NOT NULL,
    clicked_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address  INET,
    user_agent  TEXT,
    referrer    TEXT,
    country     VARCHAR(2),
    device      VARCHAR(20),
    browser     VARCHAR(50)
) PARTITION BY RANGE (clicked_at);

-- Partition per bulan untuk performa
CREATE TABLE click_events_2026_05 PARTITION OF click_events
    FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');

-- Aggregated analytics (untuk query cepat)
CREATE TABLE url_analytics_daily (
    short_code  VARCHAR(10),
    date        DATE,
    total_clicks INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    referrers   JSONB,
    countries   JSONB,
    devices     JSONB,
    PRIMARY KEY (short_code, date)
);
```

#### C. NoSQL Alternative (DynamoDB)

```
Table: url_mapping
┌──────────────┬──────────────────────────────────────────────┐
│ Partition Key│ short_code (String)                          │
│ Sort Key     │ -                                            │
├──────────────┼──────────────────────────────────────────────┤
│ Attributes   │ long_url, user_id, created_at, expires_at,   │
│              │ status, domain, custom_alias                  │
└──────────────┴──────────────────────────────────────────────┘

Table: click_events
┌──────────────┬──────────────────────────────────────────────┐
│ Partition Key│ short_code (String)                          │
│ Sort Key     │ clicked_at (Number - epoch timestamp)        │
├──────────────┼──────────────────────────────────────────────┤
│ Attributes   │ ip_hash, user_agent_hash, referrer, country, │
│              │ device, browser                               │
└──────────────┴──────────────────────────────────────────────┘
```

**Keuntungan DynamoDB:**
- Auto-scaling
- Single-digit millisecond latency
- Built-in TTL untuk expired URLs
- Global tables untuk multi-region

---

### Step 5: Detailed Component Design

#### A. Short Code Generation

**Pendekatan yang sama dengan Pastebin, tapi dengan pertimbangan:**

```python
def generate_short_code(long_url: str, user_id: int = None) -> str:
    """
    Generate short code untuk URL.

    Strategi:
    1. Jika user punya custom_alias → gunakan itu
    2. Jika tidak → generate dari hash URL + timestamp
    3. Cek collision, retry jika perlu
    """
    # Check custom alias
    if user_id and has_custom_alias(user_id):
        alias = get_custom_alias(user_id)
        if not is_alias_taken(alias):
            return alias

    # Generate dari hash
    max_retries = 5
    for _ in range(max_retries):
        code = base62_encode(md5(f"{long_url}:{timestamp_ns()}"))[:7]
        if not is_code_taken(code):
            return code

    # Fallback: gunakan counter
    return base62_encode(get_next_id())[:7]
```

#### B. Redirect Logic (Optimized)

```python
def redirect_handler(short_code: str, redis, db, request) -> Response:
    """
    Handle redirect dengan optimasi maksimal.
    Target: < 50ms response time.
    """
    start_time = time.time()

    # Step 1: Cek Redis (cache hit = ~1ms)
    long_url = redis.get(f"url:{short_code}")

    if not long_url:
        # Step 2: Cache miss, baca dari DB (~10ms)
        result = db.query(
            "SELECT long_url, status FROM url_mapping WHERE short_code = ?",
            short_code
        )

        if not result or result.status != 'active':
            return Response(404, "URL not found")

        long_url = result.long_url

        # Cache untuk request berikutnya
        redis.setex(f"url:{short_code}", 86400, long_url)

    # Step 3: Async analytics (tidak blocking)
    # Kirim ke message queue untuk diproses background
    analytics_queue.push({
        "short_code": short_code,
        "ip": request.ip,
        "user_agent": request.user_agent,
        "referrer": request.referrer,
        "timestamp": time.time()
    })

    # Step 4: Redirect
    elapsed = time.time() - start_time
    response = Response(301, headers={"Location": long_url})

    # Set cache header berdasarkan popularitas
    if is_popular(short_code):
        response.headers["Cache-Control"] = "max-age=3600"

    return response
```

**Optimasi Redirect:**
1. **Redis first** — 99%+ cache hit ratio
2. **Async analytics** — tidak blocking redirect
3. **HTTP 301 caching** — browser cache redirect, mengurangi server load
4. **Connection pooling** — reuse DB connections
5. **Keep-alive** — reuse TCP connections

---

### Step 6: Scaling URL Shortener

#### A. Bottleneck Utama

| Komponen | Bottleneck | Solusi |
|----------|------------|--------|
| Redirect QPS | 193K read/s peak | Redis Cluster + CDN edge caching |
| Analytics Write | 193K write/s peak | Message queue (Kafka) + batch insert |
| Storage Growth | 1.8 TB/tahun | Partitioning, archive old data |
| Global Latency | User di berbagai negara | Multi-region deployment, DNS-based routing |

#### B. Analytics Pipeline

Karena analytics write sangat tinggi (193K/s), kita tidak bisa write langsung ke database:

```
Redirect Service → Kafka Topic (click_events) → Consumer Group
                                                      │
                                        ┌─────────────┼─────────────┐
                                        ▼             ▼             ▼
                                  Aggregator    Real-time     Data Lake
                                  (5 min)       Dashboard     (S3)
                                        │             │             │
                                        ▼             ▼             ▼
                                  Daily Table   Grafana       Athena
                                  (PostgreSQL)  Dashboard     Query
```

**Alur Analytics:**
1. Redirect service push event ke Kafka (async, < 1ms)
2. Consumer group membaca event dari Kafka
3. Aggregator menghitung metrics per 5 menit
4. Hasil agregasi disimpan ke PostgreSQL
5. Real-time dashboard membaca dari Redis (updated streaming)
6. Raw events di-archive ke S3 untuk analisis historis

---

## 🎯 PERBANDINGAN: PASTEBIN vs URL SHORTENER

| Aspek | Pastebin | URL Shortener |
|-------|----------|---------------|
| **Data Size** | Besar (10KB-10MB) | Kecil (500 bytes) |
| **Read:Write** | 100:1 | 1000:1 |
| **Latency Target** | < 100ms | < 50ms |
| **Storage/bulan** | ~600 GB | ~150 GB |
| **Peak QPS** | ~12K read/s | ~193K read/s |
| **Cache Strategy** | Cache-aside | Cache-aside + CDN |
| **DB Choice** | PostgreSQL | Cassandra/DynamoDB |
| **Analytics** | Simple counter | Complex (geo, device, referrer) |
| **Critical Path** | Read content | Redirect (HTTP 301) |

---

## 🎯 CONTOH NYATA

### Bagaimana Bit.ly Bekerja (Step by Step)

1. **User input URL panjang:**
   ```
   https://contoh.com/artikel/panjang/sekali?ref=email&utm_source=facebook&utm_medium=social
   ```

2. **Bit.ly generate short code:**
   ```
   Hash URL + timestamp → Base62 → "3xY7aB"
   ```

3. **Simpan mapping:**
   ```
   Key: "3xY7aB" → Value: "https://contoh.com/artikel/panjang/sekali?..."
   ```

4. **Return short URL:**
   ```
   https://bit.ly/3xY7aB
   ```

5. **Saat user klik short URL:**
   ```
   a. DNS resolve bit.ly → Edge server terdekat
   b. Edge server cek cache Redis
   c. Cache hit → Return HTTP 301 dengan Location header
   d. Browser redirect ke URL asli
   e. Analytics event dikirim async ke Kafka
   ```

6. **Analytics diproses:**
   ```
   Kafka → Consumer → Agregasi → Dashboard
   - Total clicks: 15,234
   - Top referrer: twitter.com (5,200 clicks)
   - Top country: Indonesia (8,500 clicks)
   - Top device: Mobile (9,200 clicks)
   ```

---

## 💡 PRAKTIK

### Latihan 1: Desain Sistem Presensi Online untuk SD Negeri Pasirhalang

Anda diminta mendesain sistem **presensi online** untuk SD Negeri Pasirhalang dengan ~50 guru dan 300 siswa.

Gunakan kerangka yang sama:

1. **Requirements:**
   - Siapa pengguna? (guru, siswa, admin, orang tua)
   - Fitur apa yang dibutuhkan? (check-in, check-out, laporan, notifikasi)
   - Berapa banyak transaksi per hari? (50 guru × 2 = 100 check-in/out per hari)

2. **High-level Design:**
   - Komponen utama apa saja?
   - Bagaimana alur data dari check-in sampai laporan?

3. **Database:**
   - Tabel apa yang dibutuhkan?
   - Bagaimana relasi antar tabel?

4. **API:**
   - Endpoint apa saja?
   - Request/response format?

5. **Scaling:**
   - Apakah perlu caching?
   - Bagaimana jika internet sekolah putus?

### Latihan 2: Bandingkan Pastebin vs URL Shortener

Jawab pertanyaan berikut:

1. Mengapa URL shortener butuh cache hit ratio lebih tinggi dari Pastebin?
2. Kapan kita memilih PostgreSQL vs Cassandra untuk sistem ini?
3. Bagaimana cara handle jika short code collision terjadi 100 kali berturut-turut?
4. Apa perbedaan antara HTTP 301 dan 302 redirect, dan kapan menggunakan masing-masing?
5. Bagaimana mendesain sistem agar tetap berfungsi saat database primary down?

---

## ✅ CHECKLIST

### Pastebin Design
- [ ] Paham functional dan non-functional requirements
- [ ] Bisa menghitung capacity estimation (storage, bandwidth, QPS)
- [ ] Bisa mendesain REST API lengkap dengan request/response
- [ ] Paham high-level architecture dengan semua komponen
- [ ] Bisa mendesain database schema (SQL dan NoSQL)
- [ ] Paham hash generation algorithm (MD5+Base62, Auto-Increment, Snowflake)
- [ ] Bisa handle hash collision
- [ ] Paham cache strategy (cache-aside, write-through)
- [ ] Bisa identifikasi bottleneck dan solusi scaling
- [ ] Paham failure scenarios dan graceful degradation
- [ ] Bisa mendesain monitoring dan alerting

### URL Shortener Design
- [ ] Paham perbedaan requirements dengan Pastebin
- [ ] Bisa menghitung capacity estimation untuk skala besar
- [ ] Paham redirect mechanism (HTTP 301 vs 302)
- [ ] Bisa mendesain analytics pipeline dengan message queue
- [ ] Paham perbedaan database choice (PostgreSQL vs Cassandra vs DynamoDB)
- [ ] Bisa mendesain multi-region deployment

### General System Design
- [ ] Bisa melakukan requirement gathering dengan benar
- [ ] Bisa membuat capacity estimation dengan matematika
- [ ] Paham tradeoff antara berbagai design decision
- [ ] Bisa mengidentifikasi bottleneck dan propose solusi
- [ ] Paham monitoring, alerting, dan operational excellence

---

## 🔗 REFERENSI

- **Repo Asli:** [donnemartin/system-design-primer — Pastebin Solution](https://github.com/donnemartin/system-design-primer/tree/master/solutions/system_design/pastebin)
- **System Design Interview Book:** [Alex Xu — System Design Interview Vol. 1, Chapter 7: Pastebin](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF)
- **Bit.ly Architecture:** [Bit.ly Engineering Blog](https://bitly.com/blog/)
- **Base62 Encoding:** [Base62 Calculator](https://www.calculator.net/base-converter.html)
- **Snowflake ID:** [Twitter Snowflake Paper](https://github.com/twitter-archive/snowflake)
- **Redis Patterns:** [Redis Cache Patterns](https://redis.io/docs/manual/patterns/)
- **Kafka for Analytics:** [Apache Kafka Documentation](https://kafka.apache.org/documentation/)

---

> **Lanjut ke:** [`19-studi-kasus-twitter.md`](./19-studi-kasus-twitter.md)
