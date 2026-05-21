# 13 — Database NoSQL

> **Estimasi:** 2.5 jam | **Level:** Menengah → Lanjut

---

## 📖 TEORI

### Apa itu NoSQL?

**NoSQL (Not Only SQL)** adalah database yang tidak menggunakan model relasional tabel tradisional. NoSQL diciptakan untuk mengatasi keterbatasan RDBMS dalam hal **scale horizontal**, **fleksibilitas schema**, dan **throughput tinggi** pada era internet skala besar.

Istilah "NoSQL" pertama kali digunakan oleh Carlo Strozzi pada tahun 1998 untuk database open-source-nya yang tidak menggunakan SQL. Namun, istilah ini menjadi populer kembali pada tahun 2009 ketika Eric Evans dan Johan Oskarsson menggunakannya untuk menggambarkan database non-relasional yang muncul sebagai respons terhadap kebutuhan skalabilitas web modern seperti Google, Amazon, dan Facebook.

```
Evolusi Database:
┌─────────────────────────────────────────────────────────────┐
│  1970s        │ 1980s-1990s    │ 2000s          │ 2010s+    │
│  File-based   │ RDBMS          │ NoSQL          │ NewSQL/   │
│  (flat files) │ (Oracle,MySQL) │ (Mongo,Cass)   │ Multi-    │
│               │                │                │ model     │
├───────────────┼────────────────┼────────────────┼───────────┤
│  Single user  │ ACID, JOIN     │ Scale out      │ Best of   │
│  No relations │ Normalization  │ Schema-less    │ both      │
└───────────────┴────────────────┴────────────────┴───────────┘
```

### Mengapa NoSQL Muncul?

RDBMS memiliki beberapa keterbatasan yang menjadi masalah di era web skala besar:

1. **Skalabilitas Vertical yang Mahal** — RDBMS tradisional di-scale dengan menambah CPU/RAM (scale up). Ini ada batas fisiknya dan sangat mahal.
2. **Schema yang Kaku** — Setiap perubahan struktur tabel memerlukan ALTER TABLE yang bisa mengunci tabel besar.
3. **JOIN yang Mahal pada Data Besar** — JOIN di tabel jutaan baris sangat lambat.
4. **Tidak Cocok untuk Data Tidak Terstruktur** — Data modern (JSON, log, sensor) tidak selalu cocok dengan model tabel.

```
Masalah Scale Up vs Scale Out:

Scale Up (RDBMS tradisional):
  [Server kecil] → [Server besar] → [Server RAKSASA] → [Batas fisik!]
  $1K              $10K              $100K              $???
  
Scale Out (NoSQL):
  [Server] + [Server] + [Server] + [Server] + ...
  $1K        $1K        $1K        $1K        = tak terbatas
```

---

## 🔍 DEEP DIVE: 4 JENIS NoSQL DATABASE

### 1. Document Store — MongoDB

#### Konsep Dasar

Document store menyimpan data sebagai **dokumen semi-terstruktur** dalam format JSON, BSON (Binary JSON), atau XML. Setiap dokumen adalah unit data mandiri yang bisa memiliki struktur berbeda dari dokumen lain dalam koleksi yang sama.

```
Struktur Hirarki Document Store:

Database: sekolah_db
├── Collection: siswa
│   ├── Document: {_id: 1, nama: "Budi", kelas: "5A", ...}
│   ├── Document: {_id: 2, nama: "Siti", kelas: "5B", ...}
│   └── Document: {_id: 3, nama: "Andi", kelas: "5A", ...}
├── Collection: guru
│   ├── Document: {_id: 1, nama: "Pak Joko", mapel: "Matematika", ...}
│   └── Document: {_id: 2, nama: "Bu Sari", mapel: "IPA", ...}
└── Collection: nilai
    └── Document: {_id: 1, siswa_id: 1, mapel: "Matematika", nilai: 85, ...}
```

#### MongoDB: Document Store Paling Populer

MongoDB menggunakan **BSON** (Binary JSON) sebagai format penyimpanan internal. BSON mendukung tipe data yang lebih kaya daripada JSON biasa, termasuk Date, ObjectId, Binary, dan Regex.

**Contoh dokumen MongoDB:**

```javascript
// Dokumen siswa dengan embedded document dan array
{
  "_id": ObjectId("507f191e810c19729de860ea"),
  "nisn": "0012345678",
  "nama_lengkap": "Budi Santoso",
  "tanggal_lahir": ISODate("2015-03-15"),
  "jenis_kelamin": "L",
  "alamat": {
    "jalan": "Jl. Merdeka No. 15",
    "rt": "03",
    "rw": "05",
    "desa": "Mandalamukti",
    "kecamatan": "Cikalongwetan",
    "kabupaten": "Bandung Barat",
    "provinsi": "Jawa Barat",
    "kode_pos": "40558"
  },
  "orang_tua": {
    "ayah": {
      "nama": "Dedi Santoso",
      "pekerjaan": "Petani",
      "no_hp": "081234567890"
    },
    "ibu": {
      "nama": "Sri Rahayu",
      "pekerjaan": "Ibu Rumah Tangga",
      "no_hp": "081234567891"
    }
  },
  "hobi": ["membaca", "sepak bola", "menggambar"],
  "riwayat_kelas": [
    { "tahun_ajaran": "2021/2022", "kelas": "1A", "wali_kelas": "Bu Ani" },
    { "tahun_ajaran": "2022/2023", "kelas": "2A", "wali_kelas": "Bu Ani" },
    { "tahun_ajaran": "2023/2024", "kelas": "3A", "wali_kelas": "Pak Joko" }
  ],
  "created_at": ISODate("2021-07-10T08:00:00Z"),
  "updated_at": ISODate("2024-01-15T10:30:00Z")
}
```

#### MongoDB Schema Design Patterns

**Pattern 1: Embedded Document (Denormalisasi)**

Cocok untuk data yang selalu diakses bersama dan hubungan "contains":

```javascript
// GOOD: Data alamat selalu dibutuhkan bersama data siswa
{
  "_id": 1,
  "nama": "Budi",
  "alamat": {           // ← Embedded, tidak perlu JOIN
    "jalan": "Jl. Merdeka",
    "kota": "Bandung"
  }
}

// BAD: Jika alamat di collection terpisah, butuh 2 query
// Collection siswa: {_id: 1, nama: "Budi", alamat_id: 100}
// Collection alamat: {_id: 100, jalan: "Jl. Merdeka", kota: "Bandung"}
```

**Pattern 2: Reference (Normalisasi)**

Cocok untuk data yang sering di-share atau hubungan many-to-many:

```javascript
// Collection: guru
{
  "_id": 1,
  "nama": "Pak Joko",
  "mapel_ids": [10, 20]  // ← Reference ke collection mata_pelajaran
}

// Collection: mata_pelajaran
{ "_id": 10, "nama": "Matematika", "kode": "MTK" }
{ "_id": 20, "nama": "Fisika", "kode": "FIS" }
```

**Pattern 3: Bucket Pattern (Time-Series)**

Cocok untuk data sensor/IoT yang terus bertambah:

```javascript
// Setiap dokumen menyimpan data 1 jam (bucket)
{
  "_id": "sensor_1_2024-01-15_08",
  "sensor_id": 1,
  "tanggal": "2024-01-15",
  "jam_mulai": 8,
  "readings": [
    { "waktu": "08:00", "suhu": 28.5, "kelembaban": 75 },
    { "waktu": "08:05", "suhu": 28.7, "kelembaban": 74 },
    { "waktu": "08:10", "suhu": 29.0, "kelembaban": 73 },
    // ... 12 readings per jam
  ]
}
```

**Pattern 4: Polymorphic Pattern**

Cocok untuk dokumen dengan struktur berbeda dalam satu collection:

```javascript
// Collection: produk — semua jenis produk dalam 1 collection
{ "_id": 1, "tipe": "buku", "judul": "Laskar Pelangi", "penulis": "Andrea Hirata", "isbn": "978-..." }
{ "_id": 2, "tipe": "elektronik", "nama": "Laptop ASUS", "merk": "ASUS", "garansi_tahun": 2 }
{ "_id": 3, "tipe": "pakaian", "nama": "Kaos Sekolah", "ukuran": ["S", "M", "L"], "bahan": "Katun" }
```

#### MongoDB Indexing

```javascript
// Single field index
db.siswa.createIndex({ "nisn": 1 })

// Compound index (urutan penting!)
db.siswa.createIndex({ "kelas": 1, "nama_lengkap": 1 })

// Multikey index (untuk array)
db.siswa.createIndex({ "hobi": 1 })

// Text index (untuk full-text search)
db.artikel.createIndex({ "judul": "text", "konten": "text" })

// TTL index (auto-delete setelah waktu tertentu)
db.session.createIndex({ "expires_at": 1 }, { expireAfterSeconds: 3600 })

// Partial index (hanya index dokumen yang match filter)
db.siswa.createIndex(
  { "kelas": 1 },
  { partialFilterExpression: { "status": "aktif" } }
)
```

#### Kapan Pakai MongoDB?

| Skenario | Cocok? | Alasan |
|----------|--------|--------|
| CMS / Blog | ✅ | Schema fleksibel untuk konten bervariasi |
| User profiles | ✅ | Field bisa berbeda per user |
| Catalog produk | ✅ | Atribut produk berbeda per kategori |
| Real-time analytics | ✅ | Bisa ingest data cepat + aggregation pipeline |
| Transaksi keuangan kompleks | ⚠️ | Multi-document transaction ada, tapi RDBMS lebih baik |
| Data dengan relasi kompleks | ❌ | Tidak ada JOIN, reference pattern kurang efisien |

---

### 2. Key-Value Store — Redis & DynamoDB

#### Konsep Dasar

Key-value store adalah bentuk database paling sederhana. Setiap item disimpan sebagai pasangan **key** (unik) dan **value** (data). Tidak ada query language kompleks — hanya operasi GET, SET, DELETE berdasarkan key.

```
Struktur Key-Value Store:

Key                    Value
─────────────────────  ──────────────────────────────────
"user:1001"         →  {"nama": "Budi", "email": "budi@..."}
"user:1002"         →  {"nama": "Siti", "email": "siti@..."}
"session:abc123"    →  {"user_id": 1001, "role": "admin"}
"counter:visits"    →  15847
"cache:laporan:q1"  →  <binary PDF data>
"lock:backup"       →  "held_by:worker-3"
```

#### Redis — In-Memory Key-Value Store

Redis (Remote Dictionary Server) menyimpan data di **RAM**, membuatnya sangat cepat (sub-millisecond latency). Redis juga mendukung struktur data yang lebih kaya dari sekadar string:

```
Redis Data Structures:

┌──────────────────┬─────────────────────────────────────────┐
│ Tipe Data        │ Contoh Penggunaan                       │
├──────────────────┼─────────────────────────────────────────┤
│ String           │ Cache, counter, session                 │
│ List             │ Message queue, timeline, recent items   │
│ Set              │ Tag, unique visitors, friend list       │
│ Sorted Set       │ Leaderboard, priority queue             │
│ Hash             │ Object storage (user profile)           │
│ Bitmap           │ Daily active users, feature flags       │
│ HyperLogLog      │ Cardinality estimation (unique count)   │
│ Geospatial       │ Lokasi terdekat, radius search          │
│ Stream           │ Event log, message broker               │
└──────────────────┴─────────────────────────────────────────┘
```

**Contoh operasi Redis:**

```bash
# String
SET user:1001 '{"nama":"Budi","email":"budi@sdnpasirhalang.sch.id"}'
GET user:1001
INCR counter:visits          # Atomik increment
EXPIRE session:abc123 3600   # Auto-expire 1 jam

# Hash (lebih efisien untuk object)
HSET user:1001 nama "Budi" email "budi@..." role "admin"
HGET user:1001 nama
HGETALL user:1001

# List (queue)
LPUSH antrian:email "task-1" "task-2" "task-3"
RPOP antrian:email           # Dequeue dari ujung lain

# Sorted Set (leaderboard)
ZADD leaderboard 100 "siswa:A" 85 "siswa:B" 92 "siswa:C"
ZREVRANGE leaderboard 0 9 WITHSCORES  # Top 10

# Set (unique items)
SADD tags:artikel:1 "pendidikan" "bos" "laporan"
SISMEMBER tags:artikel:1 "bos"        # Cek apakah ada tag "bos"
SINTER tags:artikel:1 tags:artikel:2  # Tag yang sama di 2 artikel
```

**Redis Persistence:**
- **RDB (Redis Database)** — Snapshot periodik seluruh dataset ke disk
- **AOF (Append Only File)** — Log setiap write operation, lebih aman tapi lebih besar
- **Hybrid** — Kombinasi keduanya (default di Redis 4.0+)

**Redis Use Cases di Sistem Sekolah:**

```
Arsitektur Redis untuk Aplikasi Sekolah:

┌──────────────────────────────────────────────────────────┐
│                    Aplikasi Web                          │
├─────────┬──────────┬──────────┬──────────┬───────────────┤
│ Cache   │ Session  │ Queue    │ Leader-  │ Rate          │
│ Query   │ Manager  │ Email    │ board    │ Limiter       │
│         │          │          │          │               │
│ GET     │ SET/GET  │ LPUSH/   │ ZADD/    │ INCR +        │
│ laporan │ session  │ RPOP     │ ZRANGE   │ EXPIRE        │
└─────────┴──────────┴──────────┴──────────┴───────────────┘
```

#### Amazon DynamoDB — Managed Key-Value/Document Database

DynamoDB adalah layanan database NoSQL fully managed dari AWS. Meskipun dikategorikan sebagai key-value store, DynamoDB juga mendukung dokumen JSON dan memiliki fitur yang lebih advanced dari Redis.

**DynamoDB Partition Key dan Sort Key Design:**

```
Struktur Primary Key DynamoDB:

┌──────────────────────────────────────────────────────────┐
│  Partition Key (Hash Key) ONLY:                          │
│  ┌─────────────┬──────────────────────────────────────┐  │
│  │ Partition   │ Data                                 │  │
│  │ Key         │                                      │  │
│  ├─────────────┼──────────────────────────────────────┤  │
│  │ user#1001   │ {nama: "Budi", email: "..."}         │  │
│  │ user#1002   │ {nama: "Siti", email: "..."}         │  │
│  │ user#1003   │ {nama: "Andi", email: "..."}         │  │
│  └─────────────┴──────────────────────────────────────┘  │
│                                                          │
│  Partition Key + Sort Key (Composite Key):               │
│  ┌─────────────┬────────────┬──────────────────────────┐ │
│  │ Partition   │ Sort Key   │ Data                     │ │
│  │ Key         │            │                          │ │
│  ├─────────────┼────────────┼──────────────────────────┤ │
│  │ USER#1001   │ PROFILE    │ {nama: "Budi", ...}      │ │
│  │ USER#1001   │ ORDER#001  │ {item: "Buku", ...}      │ │
│  │ USER#1001   │ ORDER#002  │ {item: "Pensil", ...}    │ │
│  │ USER#1002   │ PROFILE    │ {nama: "Siti", ...}      │ │
│  │ USER#1002   │ ORDER#001  │ {item: "Tas", ...}       │ │
│  └─────────────┴────────────┴──────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Single Table Design Pattern di DynamoDB:**

```
Contoh: Menyimpan User, Order, dan Product dalam SATU tabel

PK              SK              Data
──────────────  ──────────────  ────────────────────────────
USER#1001       #PROFILE        {nama: "Budi", email: "..."}
USER#1001       ORDER#2024-01   {total: 50000, status: "paid"}
USER#1001       ORDER#2024-02   {total: 75000, status: "shipped"}
USER#1002       #PROFILE        {nama: "Siti", email: "..."}
PRODUCT#A       #DETAIL         {nama: "Buku Tulis", harga: 5000}
PRODUCT#B       #DETAIL         {nama: "Pensil", harga: 2000}
ORDER#2024-01   PRODUCT#A       {qty: 5, subtotal: 25000}
ORDER#2024-01   PRODUCT#B       {qty: 10, subtotal: 20000}
```

**DynamoDB Access Patterns:**

```javascript
// Pattern 1: Get semua order user tertentu
Query(PK = "USER#1001", SK begins_with "ORDER#")

// Pattern 2: Get detail produk
GetItem(PK = "PRODUCT#A", SK = "#DETAIL")

// Pattern 3: Get semua produk dalam order tertentu
Query(PK = "ORDER#2024-01", SK begins_with "PRODUCT#")

// Pattern 4: Get profil user
GetItem(PK = "USER#1001", SK = "#PROFILE")
```

#### Kapan Pakai Key-Value Store?

| Skenario | Redis | DynamoDB |
|----------|-------|----------|
| Cache query database | ✅ | ✅ |
| Session management | ✅ | ⚠️ (bisa, tapi Redis lebih cepat) |
| Leaderboard/ranking | ✅ (Sorted Set) | ❌ |
| Rate limiting | ✅ (INCR + EXPIRE) | ⚠️ |
| Persistent data store | ❌ (in-memory) | ✅ |
| Serverless apps | ❌ | ✅ (fully managed) |
| Pub/Sub messaging | ✅ | ❌ |
| Distributed locking | ✅ | ⚠️ |

---

### 3. Wide Column Store — Cassandra

#### Konsep Dasar

Wide column store (atau column-family store) menyimpan data dalam tabel, baris, dan kolom — mirip RDBMS — tapi dengan perbedaan fundamental: **setiap baris bisa memiliki kolom yang berbeda**, dan kolom dikelompokkan dalam **column families**.

```
Perbandingan RDBMS vs Cassandra:

RDBMS (Fixed Schema):                Cassandra (Flexible Schema):
┌──────┬──────┬───────┬───────┐      ┌──────────┬────────────────────────┐
│ id   │ name │ email │ phone │      │ Row Key  │ Column:Value Pairs     │
├──────┼──────┼───────┼───────┤      ├──────────┼────────────────────────┤
│ 1    │ Budi │ b@x.c │ 081.. │      │ user:1   │ name:Budi              │
│ 2    │ Siti │ s@x.c │ NULL  │  ←   │          │ email:s@x.c            │
│ 3    │ Andi │ a@x.c │ 087.. │      │          │ phone:081..            │
└──────┴──────┴───────┴───────┘      │          │ created_at:2024-01-15  │
                                     ├──────────┼────────────────────────┤
  NULL = storage wasted              │ user:2   │ name:Siti              │
                                     │          │ email:siti@x.c         │
                                     │          │ updated_at:2024-02-20  │
                                     └──────────┴────────────────────────┘
```

#### Apache Cassandra — Distributed Wide Column Store

Cassandra dikembangkan oleh Facebook dan sekarang menjadi project Apache. Cassandra dirancang untuk **high availability** dan **linear scalability** — menambah node = menambah kapasitas dan throughput secara linear.

**Arsitektur Cassandra:**

```
Cassandra Ring Architecture:

         Node A (10.0.0.1)
        /                  \
   Node F                  Node B
      |                      |
   Node E                  Node C
        \                  /
         Node D (10.0.0.5)

Setiap node equal (peer-to-peer, no master)
Data didistribusi menggunakan consistent hashing
Replication factor = 3 (setiap data ada di 3 node)
```

**Cassandra Data Model:**

```sql
-- Keyspace (setara dengan database di RDBMS)
CREATE KEYSPACE sekolah_db
WITH replication = {'class': 'NetworkTopologyStrategy', 'datacenter1': 3};

-- Table dengan compound primary key
CREATE TABLE siswa_nilai (
    siswa_id uuid,
    tahun_ajaran text,
    semester int,
    mapel text,
    nilai int,
    guru_id uuid,
    PRIMARY KEY (siswa_id, tahun_ajaran, semester, mapel)
);
-- Partition key: siswa_id
-- Clustering columns: tahun_ajaran, semester, mapel

-- Table untuk time-series data (sensor suhu ruangan)
CREATE TABLE sensor_suhu (
    ruangan_id uuid,
    waktu timestamp,
    suhu decimal,
    kelembaban decimal,
    PRIMARY KEY (ruangan_id, waktu)
) WITH CLUSTERING ORDER BY (waktu DESC);
-- Data otomatis terurut waktu terbaru dulu
```

**Cassandra Query Patterns — Query-First Design:**

Di Cassandra, Anda **mendesain tabel berdasarkan query**, bukan berdasarkan entitas. Ini berbeda dari RDBMS yang menormalisasi data dulu.

```
Query-First Design di Cassandra:

Pertanyaan: "Tampilkan semua nilai siswa X untuk tahun ajaran Y"
→ Tabel: siswa_nilai_by_tahun

Pertanyaan: "Tampilkan rata-rata nilai mapel Z di semester S"
→ Tabel: nilai_mapel_by_semester (DENORMALIZED, data duplikat!)

Pertanyaan: "Tampilkan semua siswa di kelas K"
→ Tabel: siswa_by_kelas

┌──────────────────────────────────────────────────────────┐
│  Satu entitas "nilai" bisa masuk ke 3+ tabel berbeda!    │
│  Ini bukan bug — ini desain Cassandra.                   │
│  Trade-off: Write lebih berat, read sangat cepat.        │
└──────────────────────────────────────────────────────────┘
```

#### Kapan Pakai Cassandra?

| Skenario | Cocok? | Alasan |
|----------|--------|--------|
| Time-series data (IoT, metrics) | ✅ | Write throughput sangat tinggi |
| Messaging platform | ✅ | WhatsApp pakai Cassandra untuk message store |
| Recommendation data store | ✅ | Netflix pakai untuk user activity |
| Fraud detection | ✅ | Bisa handle jutaan event per detik |
| Data dengan relasi kompleks | ❌ | Tidak ada JOIN, query harus didesain dulu |
| Transaksi ACID | ❌ | Hanya mendukung lightweight transaction terbatas |
| Dataset kecil (< 100 GB) | ❌ | Overhead operasional tidak worth it |

---

### 4. Graph Database — Neo4j

#### Konsep Dasar

Graph database menyimpan data sebagai **node** (entitas), **edges/relationships** (hubungan), dan **properties** (atribut). Graph database sangat optimal untuk query yang melibatkan **relasi** atau **traversal** (menelusuri hubungan).

```
Graph Database Components:

Nodes (Entity):                    Relationships (Edges):
┌──────────────────────┐           ┌──────────────────────────┐
│  Label: Siswa        │           │  Type: TEMAN_DENGAN      │
│  Properties:         │           │  Properties:             │
│    - nama: "Budi"    │           │    - sejak: 2022         │
│    - nisn: "001..."  │           │    - kedekatan: "dekat"  │
│    - kelas: "5A"     │           └──────────────────────────┘
└──────────────────────┘
         │
         │ BERLANGGANAN
         ↓
┌──────────────────────┐
│  Label: Ekstrakulikuler
│  Properties:         │
│    - nama: "Pramuka" │
│    - hari: "Jumat"   │
└──────────────────────┘
```

#### Neo4j — Graph Database Paling Populer

Neo4j menggunakan **Cypher** sebagai query language. Cypher dirancang agar mudah dibaca dan intuitif untuk pattern matching.

**Contoh Cypher Query:**

```cypher
// 1. Buat node dan relationship
CREATE (budi:Siswa {nama: "Budi", kelas: "5A"})
CREATE (siti:Siswa {nama: "Siti", kelas: "5A"})
CREATE (andi:Siswa {nama: "Andi", kelas: "5B"})
CREATE (pramuka:Ekstrakulikuler {nama: "Pramuka"})

CREATE (budi)-[:TEMAN_DENGAN {sejak: 2022}]->(siti)
CREATE (siti)-[:TEMAN_DENGAN {sejak: 2023}]->(andi)
CREATE (budi)-[:BERLANGGANAN]->(pramuka)
CREATE (siti)-[:BERLANGGANAN]->(pramuka)

// 2. Cari teman dari teman Budi (2-hop traversal)
MATCH (budi:Siswa {nama: "Budi"})-[:TEMAN_DENGAN*2]-(teman_teman)
RETURN teman_teman.nama
-- Hasil: "Andi" (karena Budi → Siti → Andi)

// 3. Cari semua siswa di ekstrakulikuler yang sama dengan Budi
MATCH (budi:Siswa {nama: "Budi"})-[:BERLANGGANAN]->(ekskul)<-[:BERLANGGANAN]-(siswa_lain)
RETURN siswa_lain.nama, ekskul.nama
-- Hasil: "Siti", "Pramuka"

// 4. Rekomendasi teman (siswa yang belum jadi teman tapi punya teman sama)
MATCH (budi:Siswa {nama: "Budi"})-[:TEMAN_DENGAN]-(teman)-[:TEMAN_DENGAN]-(calon)
WHERE calon <> budi AND NOT (budi)-[:TEMAN_DENGAN]-(calon)
RETURN calon.nama, count(teman) as teman_bersama
ORDER BY teman_bersama DESC
```

#### Graph Database Use Cases

```
Use Cases Graph Database:

┌─────────────────────────────────────────────────────────────┐
│  Social Network          │  "Siapa teman dari teman saya?"  │
│  (Facebook, LinkedIn)    │  "Orang yang mungkin Anda kenal" │
├─────────────────────────────────────────────────────────────┤
│  Recommendation Engine   │  "Orang yang beli X juga beli Y" │
│  (Amazon, Netflix)       │  Content-based recommendation    │
├─────────────────────────────────────────────────────────────┤
│  Fraud Detection         │  "Akun ini terhubung ke akun     │
│  (Bank, Insurance)       │   fraud sebelumnya?"             │
├─────────────────────────────────────────────────────────────┤
│  Knowledge Graph         │  "Hubungan antara entitas A dan  │
│  (Google, Wikipedia)     │   B melalui jalur apa saja?"     │
├─────────────────────────────────────────────────────────────┤
│  Network/IT Operations   │  "Server mana yang terdampak     │
│  (Data Center)           │   jika router X mati?"           │
├─────────────────────────────────────────────────────────────┤
│  Supply Chain            │  "Supplier mana yang bergantung  │
│  (Manufacturing)         │   pada komponen yang sama?"      │
└─────────────────────────────────────────────────────────────┘
```

#### Graph vs SQL untuk Relasi

```
Query "Teman dari Teman" — Perbandingan:

SQL (4 JOIN):
SELECT DISTINCT t2.nama
FROM siswa s1
JOIN teman t1 ON s1.id = t1.siswa_id_1
JOIN siswa teman1 ON t1.siswa_id_2 = teman1.id
JOIN teman t2 ON teman1.id = t2.siswa_id_1
JOIN siswa t2_info ON t2.siswa_id_2 = t2_info.id
WHERE s1.nama = 'Budi'
  AND t2_info.nama != 'Budi'
  AND t2.siswa_id_2 NOT IN (
    SELECT siswa_id_2 FROM teman WHERE siswa_id_1 = s1.id
  )
-- Complexity: O(n²) dengan index, O(n³) tanpa index

Graph (2-hop traversal):
MATCH (b:Siswa {nama: "Budi"})-[:TEMAN*2]-(tt:Siswa)
WHERE tt <> b
RETURN DISTINCT tt.nama
-- Complexity: O(k) di mana k = jumlah teman langsung (biasanya kecil)
```

---

## 📐 CAP THEOREM DAN NoSQL

### Apa itu CAP Theorem?

**CAP Theorem** (dibuktikan oleh Eric Brewer, 2000) menyatakan bahwa dalam sistem distributed, Anda hanya bisa memilih **2 dari 3** properti berikut:

```
CAP Theorem Triangle:

           Consistency (C)
              /    \
             /      \
            /        \
           /          \
  Availability (A) ─── Partition Tolerance (P)

  Anda HANYA bisa pilih 2:
  - CA: Consistency + Availability (tapi tidak tahan network partition)
  - CP: Consistency + Partition Tolerance (tapi tidak selalu available)
  - AP: Availability + Partition Tolerance (tapi eventual consistency)
```

**Definisi:**

| Properti | Definisi | Contoh |
|----------|----------|--------|
| **Consistency** | Setiap read mendapatkan data terbaru atau error | Bank: saldo harus selalu akurat |
| **Availability** | Setiap request mendapat response (bukan error) | Social media: selalu bisa posting |
| **Partition Tolerance** | Sistem tetap berjalan meskipun ada network partition | Server di 2 data center, koneksi putus |

### CAP Theorem Applied to NoSQL Databases

```
Posisi NoSQL Databases dalam CAP:

┌─────────────────────────────────────────────────────────────┐
│                     CAP Spectrum                            │
│                                                             │
│  CP (Consistency + Partition Tolerance):                   │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  MongoDB (default), HBase, Redis (single-threaded)    │ │
│  │  → Konsisten, tapi bisa unavailable saat partition    │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  AP (Availability + Partition Tolerance):                  │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Cassandra, DynamoDB, CouchDB                         │ │
│  │  → Selalu available, tapi eventual consistency        │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  CA (Consistency + Availability) — HANYA single node:      │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  MySQL (single node), PostgreSQL (single node)        │ │
│  │  → Tidak tahan network partition                      │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**MongoDB dan CAP:**

```
MongoDB Replica Set:

  Primary (write + read)
     │
     ├── replicate ──→ Secondary 1 (read)
     │
     └── replicate ──→ Secondary 2 (read)

Default: CP — write hanya di Primary, data konsisten
         Jika Primary down, election terjadi (unavailable sementara)

Opsional: AP — dengan read preference "secondary"
          Read dari Secondary (mungkin stale), tapi selalu available
```

**Cassandra dan CAP:**

```
Cassandra: Selalu AP

  Write ke Node A → langsung return success
  Replication ke Node B, C → terjadi di background (async)
  
  Read dari Node B → mungkin dapat data lama (stale)
  → Eventual consistency: data akan konsisten setelah waktu tertentu
  
  Tunable Consistency:
  - ONE: 1 node acknowledge (paling cepat, paling inconsistent)
  - QUORUM: majority nodes acknowledge (balance)
  - ALL: semua nodes acknowledge (paling konsisten, paling lambat)
```

---

## 🔄 CONSISTENCY MODELS IN NoSQL

### Strong Consistency vs Eventual Consistency

```
Strong Consistency:
  Write → [Server] → Read SELALU dapat data terbaru
  ┌────────┐    ┌────────┐    ┌────────┐
  │ Write X│ →  │ Replic │ →  │ Read X'│  ← X' = X (selalu terbaru)
  └────────┘    └────────┘    └────────┘

Eventual Consistency:
  Write → [Server] → Read MUNGKIN dapat data lama
  ┌────────┐    ┌────────┐    ┌────────┐
  │ Write X│ →  │ Async  │ →  │ Read X │  ← X = data lama (stale)
  └────────┘    │ Repl   │    └────────┘
                └────────┘    ┌────────┐
                              │ Read X'│  ← X' = X terbaru (setelah replikasi selesai)
                              └────────┘
```

### Consistency Models Comparison

| Model | Deskripsi | Latency | Use Case |
|-------|-----------|---------|----------|
| **Strong** | Read selalu dapat data terbaru | Tinggi | Keuangan, inventory |
| **Sequential** | Operasi terlihat dalam urutan yang sama di semua node | Sedang | Chat, collaborative editing |
| **Causal** | Operasi yang berhubungan terlihat dalam urutan yang benar | Rendah | Social media feed |
| **Eventual** | Data akan konsisten "pada akhirnya" | Terendah | Analytics, logging |

### Dynamo-Style Consistency (Tunable)

```
DynamoDB/Cassandra: Konsistensi bisa diatur per operasi

Write Consistency:
  W=1 (write ke 1 node)     → Cepat, risiko data loss
  W=QUORUM (majority)       → Balance
  W=ALL (semua replica)     → Lambat, aman

Read Consistency:
  R=1 (baca dari 1 node)    → Cepat, mungkin stale
  R=QUORUM (majority)       → Balance
  R=ALL (baca semua replica)→ Lambat, selalu fresh

Rule: W + R > N (jumlah replica) = Strong Consistency
Contoh: N=3, W=2, R=2 → 2+2 > 3 → Strong Consistency
```

---

## 🆚 KAPAN PAKAI NoSQL vs SQL?

### Decision Framework

```
Decision Tree: SQL atau NoSQL?

                    Mulai
                      │
                      ▼
            ┌─────────────────────┐
            │ Data terstruktur    │
            │ dengan relasi       │
            │ kompleks?           │
            └─────────┬───────────┘
                  YES │        NO
                      ▼           ▼
            ┌──────────────┐  ┌──────────────────┐
            │ Butuh ACID   │  │ Butuh scale      │
            │ transaction? │  │ horizontal?      │
            └──────┬───────┘  └────────┬─────────┘
              YES  │  NO          YES   │   NO
                   ▼                    ▼
            ┌──────────┐    ┌────────────────────┐
            │ RDBMS    │    │ Schema fleksibel   │
            │ (MySQL,  │    │ atau data tidak    │
            │  PG)     │    │ terstruktur?       │
            └──────────┘    └────────┬───────────┘
                                YES  │  NO
                                     ▼
                               ┌──────────┐
                               │ RDBMS    │
                               │ masih    │
                               │ cukup    │
                               └──────────┘
```

### Detailed Comparison Matrix

| Aspek | SQL (RDBMS) | NoSQL |
|-------|-------------|-------|
| **Model Data** | Tabel, baris, kolom (relasional) | Document, key-value, graph, wide column |
| **Schema** | Fixed (harus didefinisikan dulu, ALTER TABLE untuk ubah) | Flexible/dynamic (bisa berubah kapan saja) |
| **Skalabilitas** | Vertical (scale up: tambah CPU/RAM) | Horizontal (scale out: tambah node) |
| **ACID** | Full ACID compliance (Atomicity, Consistency, Isolation, Durability) | BASE (Basically Available, Soft state, Eventual consistency) |
| **JOIN** | Native support, powerful | Tidak ada (data di-denormalize, application-level join) |
| **Transaction** | Multi-row, multi-table transaction | Limited (single document/row), beberapa support multi-document |
| **Query Language** | SQL (standardized, powerful) | Vendor-specific (MongoDB query, CQL, Cypher, dll) |
| **Performance** | Bisa lambat untuk write-heavy, large dataset | Sangat cepat untuk use case spesifik |
| **Maturity** | 50+ tahun, sangat matang, tooling lengkap | 10-20 tahun, masih berkembang |
| **Community** | Besar, banyak developer berpengalaman | Berkembang, tapi lebih kecil |
| **Contoh** | MySQL, PostgreSQL, Oracle, SQL Server | MongoDB, Redis, Cassandra, Neo4j, DynamoDB |

### Anti-Patterns (Kesalahan Umum)

```
❌ ANTI-PATTERN: Pakai NoSQL karena "trendy"
→ SQL sudah cukup untuk 80% use case

❌ ANTI-PATTERN: Pakai NoSQL untuk data yang butuh ACID
→ Transaksi keuangan di MongoDB = risiko

❌ ANTI-PATTERN: Denormalize berlebihan di NoSQL
→ Data inconsistency, update anomaly

❌ ANTI-PATTERN: Pakai Cassandra untuk dataset kecil
→ Overhead operasional tidak worth it

✅ BEST PRACTICE: Mulai dengan SQL, migrate ke NoSQL saat perlu
✅ BEST PRACTICE: Polyglot persistence — gunakan yang tepat untuk tiap use case
```

---

## 📊 NoSQL SCALING PATTERNS

### Sharding (Partitioning)

```
Sharding di MongoDB:

Data: 100 juta dokumen siswa

Shard 1 (Server A):  siswa_id 000000 - 333333  (33.3 juta)
Shard 2 (Server B):  siswa_id 333334 - 666666  (33.3 juta)
Shard 3 (Server C):  siswa_id 666667 - 999999  (33.3 juta)

         ┌───────────────┐
         │  Mongos       │
         │  (Router)     │
         └───────┬───────┘
                 │
      ┌──────────┼──────────┐
      ▼          ▼          ▼
  ┌───────┐ ┌───────┐ ┌───────┐
  │Shard A│ │Shard B│ │Shard C│
  │       │ │       │ │       │
  └───────┘ └───────┘ └───────┘

Query: GET siswa_id = 500000
→ Mongos route ke Shard B (karena 500000 ada di range 333334-666666)
→ Hanya 1 shard yang diproses, bukan semua
```

### Replication

```
Replication di NoSQL:

Primary-Secondary (MongoDB):
  ┌─────────┐
  │ Primary │ ← Write + Read
  └────┬────┘
       │ replicate
       ├──→ ┌───────────┐
       │    │ Secondary │ ← Read only
       │    └───────────┘
       │
       └──→ ┌───────────┐
            │ Secondary │ ← Read only
            └───────────┘

Multi-Master (Cassandra):
  ┌───────┐    ┌───────┐    ┌───────┐
  │Node A │ ←→ │Node B │ ←→ │Node C │
  │ R/W   │    │ R/W   │    │ R/W   │
  └───────┘    └───────┘    └───────┘
  Semua node bisa read DAN write
```

### Consistent Hashing

```
Consistent Hashing untuk distribusi data:

Hash Ring (0 - 2^128):

          0/2^128
            │
     Node A │ Node B
    ────────┼────────
            │
     Node D │ Node C
            │

Data key "user:1001" → hash("user:1001") = 0x3F2A...
→ Clockwise dari 0x3F2A... ketemu Node B
→ Data disimpan di Node B

Keuntungan:
- Tambah/hapus node hanya mempengaruhi tetangga
- Tidak perlu rehash semua data
- Distribusi merata
```

---

## 🌍 REAL-WORLD CASE STUDIES

### Netflix + Cassandra

```
Arsitektur Netflix dengan Cassandra:

┌─────────────────────────────────────────────────────────────┐
│                    Netflix Streaming                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Use Case:                                                  │
│  1. Viewing history (apa yang ditonton user)               │
│  2. Recommendation data (user behavior)                    │
│  3. Device management (device yang terdaftar)              │
│                                                             │
│  Kenapa Cassandra?                                          │
│  - 200+ juta subscriber, miliaran event per hari           │
│  - Write throughput sangat tinggi (setiap play/pause/stop) │
│  - Butuh availability 99.99% (tidak boleh down)            │
│  - Data bisa eventual consistency (viewing history)        │
│                                                             │
│  Skala:                                                     │
│  - 100+ node Cassandra cluster                              │
│  - Petabytes data                                           │
│  - Jutaan write per detik                                   │
│  - Multi-region deployment                                  │
│                                                             │
│  Data Model (simplified):                                   │
│  ┌──────────────┬────────────┬──────────────────────────┐  │
│  │ user_id (PK) │ timestamp  │ viewing_data             │  │
│  ├──────────────┼────────────┼──────────────────────────┤  │
│  │ user_123     │ 2024-01-15 │ {title: "Stranger...",   │  │
│  │              │ T20:30     │  progress: 0.45,         │  │
│  │              │            │  device: "TV"}           │  │
│  │ user_123     │ 2024-01-16 │ {title: "The Crown",     │  │
│  │              │ T19:00     │  progress: 0.12,         │  │
│  │              │            │  device: "Phone"}        │  │
│  └──────────────┴────────────┴──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Uber + Schemaless (MySQL-based NoSQL)

```
Uber's Schemaless Architecture:

┌─────────────────────────────────────────────────────────────┐
│                    Uber Ride Platform                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Masalah:                                                   │
│  - Jutaan ride per hari di seluruh dunia                   │
│  - Data trip perlu disimpan dan diakses cepat              │
│  - MySQL tidak bisa scale horizontal dengan mudah          │
│  - Tapi butuh reliability MySQL                            │
│                                                             │
│  Solusi: Schemaless (built by Uber)                        │
│  - Layer abstraction di atas MySQL                         │
│  - Data disimpan sebagai blob (serIALIZED)                 │
│  - Sharding otomatis di level aplikasi                     │
│  - Bisa pakai MySQL sebagai backend, tapi behave seperti   │
│    NoSQL                                                    │
│                                                             │
│  Arsitektur:                                                │
│  ┌──────┐    ┌───────────┐    ┌──────────────────────┐     │
│  │ App  │ →  │ Schemaless│ →  │ MySQL Shards         │     │
│  │      │    │ Layer     │    │ (Shard 1, 2, 3, ...) │     │
│  └──────┘    └───────────┘    └──────────────────────┘     │
│                                                             │
│  Data Model:                                                │
│  Key: trip_id                                               │
│  Value: serialized trip data (JSON/protobuf)               │
│  {                                                          │
│    "rider_id": "user_123",                                  │
│    "driver_id": "driver_456",                               │
│    "pickup": {"lat": -6.123, "lng": 106.456},              │
│    "dropoff": {"lat": -6.789, "lng": 106.012},             │
│    "status": "completed",                                   │
│    "fare": 45000,                                           │
│    "timestamps": {...}                                      │
│  }                                                          │
│                                                             │
│  Pelajaran:                                                 │
│  Tidak harus pakai NoSQL database "murni" — bisa build     │
│  abstraction layer di atas SQL untuk dapat flexibility     │
│  NoSQL dengan reliability SQL.                             │
└─────────────────────────────────────────────────────────────┘
```

### Case Study Lainnya

| Perusahaan | Database | Use Case | Alasan |
|------------|----------|----------|--------|
| **Facebook** | Cassandra (awalnya), TAO (graph) | Inbox, activity feed | Write throughput tinggi |
| **Twitter** | Manhattan (key-value) | Timeline, user data | Low latency, high availability |
| **Amazon** | DynamoDB | Shopping cart, session | Fully managed, auto-scale |
| **Spotify** | Cassandra | Playlist, user data | Multi-region, high availability |
| **Instagram** | Cassandra | Feed, activity | Write-heavy, time-series |
| **eBay** | DocumentDB (internal) | Product catalog | Flexible schema |

---

## 🎯 CONTOH NYATA: SISTEM SEKOLAH

### Arsitektur Polyglot untuk SD Negeri Pasirhalang (Skala Kecil)

```
Untuk sekolah dengan ~500 siswa:

┌─────────────────────────────────────────────────────────────┐
│                  Cukup MySQL/PostgreSQL                     │
│                                                             │
│  - Data siswa, guru, kelas: relasional                     │
│  - Nilai, absensi: butuh integrity                         │
│  - Laporan BOS: butuh JOIN dan aggregate                   │
│  - Scale: ribuan record, bukan jutaan                     │
│                                                             │
│  TIDAK PERLU NoSQL untuk saat ini!                         │
└─────────────────────────────────────────────────────────────┘
```

### Arsitektur Polyglot untuk Platform Pendidikan Nasional (Skala Besar)

```
Untuk platform dengan 10.000+ sekolah, jutaan siswa:

┌─────────────────────────────────────────────────────────────┐
│                   Platform Pendidikan                       │
├────────────┬────────────┬────────────┬──────────────────────┤
│ PostgreSQL │ Redis      │ MongoDB    │ Cassandra            │
│            │            │            │                      │
│ Data inti: │ - Session  │ - Log      │ - Analytics          │
│ - Siswa    │   manager  │   aktivitas│   event streaming    │
│ - Guru     │ - Cache    │ - Content  │ - Time-series        │
│ - Kelas    │   query    │   CMS      │   sensor (IoT kelas) │
│ - Nilai    │ - Rate     │ - Dokumen  │ - Attendance         │
│ - BOS      │   limiter  │   fleksibel│   history            │
│            │ - Leader-  │            │                      │
│            │   board    │            │                      │
└────────────┴────────────┴────────────┴──────────────────────┘
```

---

## 💡 PRAKTIK

### Latihan 1: Pilih Database yang Tepat

Tentukan database dan tipe NoSQL yang cocok:

1. Cache hasil query laporan BOS yang sering diakses
2. Data profil pengguna dengan field yang sering berubah (ada yang punya data orang tua, ada yang tidak)
3. Data transaksi keuangan BOS (butuh akurasi 100%)
4. Social graph pertemanan antar siswa untuk fitur "teman sekelas"
5. Log akses server aplikasi (jutaan per hari)
6. Leaderboard siswa berprestasi (real-time ranking)
7. Session login untuk aplikasi web sekolah
8. Data sensor suhu dan kelembaban di setiap kelas (IoT)
9. Catalog buku perpustakaan dengan atribut berbeda per jenis (buku, majalah, DVD)
10. Data perjalanan dinas guru (butuh approval workflow)

**Jawaban:**
1. Redis (key-value) — cache
2. MongoDB (document) — schema fleksibel
3. PostgreSQL (SQL) — butuh ACID
4. Neo4j (graph) — relationship query
5. Cassandra (wide column) — write throughput tinggi
6. Redis (sorted set) — real-time ranking
7. Redis (key-value) — session dengan auto-expire
8. Cassandra (wide column) — time-series data
9. MongoDB (document) — polymorphic data
10. PostgreSQL (SQL) — transactional workflow

### Latihan 2: Desain Schema MongoDB untuk Sistem Sekolah

Buat schema MongoDB untuk menyimpan data siswa dengan requirements:
- Setiap siswa punya data orang tua (ayah + ibu)
- Riwayat kelas per tahun ajaran
- Nilai per mata pelajaran per semester
- Beberapa siswa punya data beasiswa, beberapa tidak
- Query yang sering: "Tampilkan semua data siswa X", "Tampilkan semua siswa di kelas Y tahun Z"

### Latihan 3: Desain Partition Key DynamoDB

Desain partition key dan sort key untuk DynamoDB yang menyimpan:
- Data user (profil, preferensi)
- Data order (riwayat pembelian)
- Data produk (catalog)
- Query: "Semua order user X", "Detail produk Y", "Profil user Z"

---

## ✅ CHECKLIST

- [ ] Bisa jelaskan 4 jenis NoSQL database dengan contoh masing-masing
- [ ] Paham kapan pakai key-value, document, wide column, graph
- [ ] Bisa bandingkan SQL vs NoSQL secara detail
- [ ] Paham CAP theorem dan aplikasinya ke NoSQL
- [ ] Tahu consistency models (strong, eventual, tunable)
- [ ] Bisa mendesain MongoDB schema dengan embedded vs reference
- [ ] Paham DynamoDB partition key dan sort key design
- [ ] Paham Cassandra query-first design pattern
- [ ] Bisa jelaskan graph database use cases
- [ ] Paham sharding, replication, consistent hashing
- [ ] Tahu real-world use case (Netflix+Cassandra, Uber+Schemaless)
- [ ] Bisa mendesain kombinasi database (polyglot persistence) yang tepat

---

## 🔗 REFERENSI

- **Repo Asli:** [donnemartin/system-design-primer — NoSQL](https://github.com/donnemartin/system-design-primer#nosql)
- **donnemartin/system-design-primer — CAP Theorem:** [CAP Theorem](https://github.com/donnemartin/system-design-primer#cap-theorem)
- **MongoDB Schema Design:** [MongoDB Schema Design Patterns](https://www.mongodb.com/docs/manual/core/data-modeling-introduction/)
- **DynamoDB Best Practices:** [AWS DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- **Cassandra Data Modeling:** [Cassandra Data Modeling](https://cassandra.apache.org/doc/latest/cassandra/data_modeling/data_modeling_concepts.html)
- **Neo4j Cypher:** [Neo4j Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/)
- **Artikel:** [SQL vs NoSQL](https://www.mongodb.com/compare/sql-vs-nosql)
- **Netflix Tech Blog:** [Netflix and Cassandra](https://netflixtechblog.com/)
- **Uber Engineering:** [Introducing Schemaless](https://www.uber.com/blog/introducing-schemaless/)

---

> **Lanjut ke:** [`14-cache.md`](./14-cache.md)