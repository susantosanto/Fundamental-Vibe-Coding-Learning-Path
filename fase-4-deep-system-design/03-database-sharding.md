# 03 — Database Sharding

> **Estimasi:** 1,5 jam | **Level:** Advanced | **Prerequisite:** 02-service-discovery-api-gateway.md

---

## DAFTAR ISI

1. [Apa itu Sharding?](#apa-itu-sharding)
2. [Mengapa Perlu Sharding?](#mengapa-perlu-sharding)
3. [Sharding vs Replication vs Partitioning](#sharding-vs-replication-vs-partitioning)
4. [Sharding Strategies](#sharding-strategies)
5. [Shard Key Selection](#shard-key-selection)
6. [Shard Rebalancing](#shard-rebalancing)
7. [Consistent Hashing](#consistent-hashing)
8. [Cross-Shard Queries](#cross-shard-queries)
9. [Distributed Transactions Across Shards](#distributed-transactions-across-shards)
10. [Kapan Harus Sharding?](#kapan-harus-sharding)
11. [Implementasi: MySQL, PostgreSQL, MongoDB](#implementasi-mysql-postgresql-mongodb)
12. [Sharding Pitfalls dan Solusi](#sharding-pitfalls-dan-solusi)
13. [Case Study: Instagram Database Sharding](#case-study-instagram-database-sharding)
14. [Referensi dari donnemartin/system-design-primer](#referensi-dari-donnemartinsystem-design-primer)

---

## APA ITU SHARDING?

**Sharding** adalah teknik memecah satu database besar menjadi beberapa database yang lebih kecil (disebut **shard**), yang masing-masing berjalan di server terpisah. Setiap shard menyimpan subset data yang berbeda.

```
┌──────────────────────────────────────────────────────────────┐
│                    SEBELUM SHARDING                           │
│                                                               │
│  ┌──────────────────────────────────────────────┐            │
│  │              Single Database                  │            │
│  │                                               │            │
│  │  Users: 100 juta record                       │            │
│  │  - Read: 50.000 req/s                         │            │
│  │  - Write: 10.000 req/s                        │            │
│  │  - Storage: 500 GB                            │            │
│  │                                               │            │
│  │  Masalah:                                     │            │
│  │  ❌ CPU bottleneck (terlalu banyak query)     │            │
│  │  ❌ Memory bottleneck (index tidak muat RAM)  │            │
│  │  ❌ Disk I/O bottleneck (terlalu banyak R/W)  │            │
│  │  ❌ Network bottleneck (semua traffic ke 1)   │            │
│  │  ❌ Single point of failure                   │            │
│  │                                               │            │
│  └──────────────────────────────────────────────┘            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────┐
│                    SETELAH SHARDING                           │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Shard 1 │  │  Shard 2 │  │  Shard 3 │  │  Shard 4 │     │
│  │          │  │          │  │          │  │          │     │
│  │ Users:   │  │ Users:   │  │ Users:   │  │ Users:   │     │
│  │ 25 juta  │  │ 25 juta  │  │ 25 juta  │  │ 25 juta  │     │
│  │          │  │          │  │          │  │          │     │
│  │ Read:    │  │ Read:    │  │ Read:    │  │ Read:    │     │
│  │ 12.5K/s  │  │ 12.5K/s  │  │ 12.5K/s  │  │ 12.5K/s  │     │
│  │          │  │          │  │          │  │          │     │
│  │ Storage: │  │ Storage: │  │ Storage: │  │ Storage: │     │
│  │ 125 GB   │  │ 125 GB   │  │ 125 GB   │  │ 125 GB   │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                               │
│  Keuntungan:                                                  │
│  ✅ CPU load terdistribusi (4x kapasitas)                     │
│  ✅ Index lebih kecil (muat di RAM)                           │
│  ✅ Disk I/O terdistribusi                                    │
│  ✅ Network load terdistribusi                                │
│  ✅ Fault isolation (1 shard down ≠ semua down)               │
│  ✅ Horizontal scaling (tambah shard = tambah kapasitas)      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Terminologi Sharding

| Istilah | Definisi |
|---------|----------|
| **Shard** | Subset data yang disimpan di server terpisah |
| **Shard Key** | Field/kolom yang digunakan untuk menentukan shard mana menyimpan data |
| **Sharding Function** | Fungsi/hash yang menentukan shard berdasarkan shard key |
| **Shard Router** | Komponen yang menentukan shard mana untuk query tertentu |
| **Rebalancing** | Proses memindahkan data antar shard saat shard ditambah/dikurang |
| **Cross-Shard Query** | Query yang membutuhkan data dari multiple shard |

---

## MENGAPA PERLU SHARDING?

### Scaling Vertikal vs Horizontal

```
┌──────────────────────────────────────────────────────────────┐
│         VERTICAL SCALING (Scale Up)                           │
│                                                               │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────┐      │
│  │  Server  │     │   Server     │     │   Server     │      │
│  │  4 CPU   │───▶ │   16 CPU    │───▶ │   64 CPU     │      │
│  │  16 GB   │     │   64 GB     │     │   256 GB     │      │
│  │  500 GB  │     │   2 TB      │     │   8 TB       │      │
│  └──────────┘     └──────────────┘     └──────────────┘      │
│     $500/mo           $2,000/mo           $10,000/mo          │
│                                                               │
│  Masalah:                                                     │
│  - Biaya meningkat eksponensial                               │
│  - Ada batas maksimum (tidak bisa infinite scale)             │
│  - Single point of failure masih ada                          │
│  - Downtime saat upgrade hardware                             │
│                                                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│         HORIZONTAL SCALING (Scale Out) = SHARDING             │
│                                                               │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐              │
│  │  Server  │     │  Server  │     │  Server  │              │
│  │  4 CPU   │     │  4 CPU   │     │  4 CPU   │              │
│  │  16 GB   │     │  16 GB   │     │  16 GB   │              │
│  │  500 GB  │     │  500 GB  │     │  500 GB  │              │
│  └──────────┘     └──────────┘     └──────────┘              │
│     $500/mo     +    $500/mo     +    $500/mo                │
│     = 1 shard        = 2 shards        = 3 shards            │
│     Total: $500      Total: $1,000      Total: $1,500        │
│                                                               │
│  Keuntungan:                                                  │
│  - Biaya linear (tambah server = tambah kapasitas)            │
│  - Teoritis infinite scale                                    │
│  - Fault isolation                                            │
│  - No downtime saat tambah shard                              │
│  - Bisa pakai commodity hardware                              │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Kapan Vertical Scaling Sudah Tidak Cukup?

```
┌──────────────────────────────────────────────────────────────┐
│              TANDA-TANDA PERLU SHARDING                       │
│                                                               │
│  1. Database CPU usage consistently > 70%                    │
│     → Query terlalu banyak, CPU tidak sanggup                 │
│                                                               │
│  2. Memory usage > 80% (index tidak muat di RAM)             │
│     → Query lambat karena disk I/O                            │
│                                                               │
│  3. Disk I/O saturated (iowait tinggi)                       │
│     → Terlalu banyak read/write per detik                     │
│                                                               │
│  4. Storage mendekati batas maksimum server                   │
│     → Tidak bisa tambah data lagi                             │
│                                                               │
│  5. Connection pool penuh                                    │
│     → Terlalu banyak concurrent connection                    │
│                                                               │
│  6. Replication lag meningkat                                │
│     → Master terlalu banyak write, slave tidak bisa keep up   │
│                                                               │
│  SOLUSI: Sharding → distribusikan load ke multiple server    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## SHARDING VS REPLICATION VS PARTITIONING

Ketiga konsep ini sering membingungkan. Mari kita bedakan:

```
┌──────────────────────────────────────────────────────────────┐
│              SHARDING vs REPLICATION vs PARTITIONING          │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  REPLICATION (Duplikasi)                                │ │
│  │                                                         │ │
│  │  ┌──────────┐                                           │ │
│  │  │  Master  │ ──copy──▶ ┌──────────┐                   │ │
│  │  │          │            │  Replica │                   │ │
│  │  │ ALL DATA │ ──copy──▶ ┌──────────┐                   │ │
│  │  │ (100%)   │            │  Replica │                   │ │
│  │  │          │ ──copy──▶ ┌──────────┐                   │ │
│  │  └──────────┘            │  Replica │                   │ │
│  │                          └──────────┘                   │ │
│  │                                                         │ │
│  │  Tujuan: Read scalability, high availability, backup    │ │
│  │  Setiap node punya DATA SAMA PERSIS                     │ │
│  │  Write hanya di Master, Read bisa dari mana saja        │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  PARTITIONING (Pemilahan dalam SATU database)           │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────┐               │ │
│  │  │         Single Database               │              │ │
│  │  │                                       │              │ │
│  │  │  Partition 1: 2023 data (100 GB)      │              │ │
│  │  │  Partition 2: 2024 data (150 GB)      │              │ │
│  │  │  Partition 3: 2025 data (200 GB)      │              │ │
│  │  │                                       │              │ │
│  │  │  Semua di SATU server, SATU database  │              │ │
│  │  └──────────────────────────────────────┘               │ │
│  │                                                         │ │
│  │  Tujuan: Query performance, data management             │ │
│  │  Data dibagi dalam SATU database (bukan multiple server)│ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  SHARDING (Pemilahan di MULTIPLE server)                │ │
│  │                                                         │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │ │
│  │  │ Server A │  │ Server B │  │ Server C │              │ │
│  │  │ Shard 1  │  │ Shard 2  │  │ Shard 3  │              │ │
│  │  │          │  │          │  │          │              │ │
│  │  │ Data A-M │  │ Data N-Z │  │ Data 0-9 │              │ │
│  │  │          │  │          │  │          │              │ │
│  │  └──────────┘  └──────────┘  └──────────┘              │ │
│  │                                                         │ │
│  │  Tujuan: Horizontal scaling, throughput                 │ │
│  │  Data dibagi di MULTIPLE server, masing-masing subset   │ │
│  │  Berbeda dengan replication (data sama) dan partition   │ │
│  │  (satu server). Sharding = multiple server + subset.    │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Perbandingan Detail

| Aspek | Replication | Partitioning | Sharding |
|-------|-------------|--------------|----------|
| **Data** | Sama di semua node | Dibagi dalam 1 DB | Dibagi di multiple server |
| **Server** | Multiple | Satu | Multiple |
| **Tujuan** | HA, Read scale | Query performance | Horizontal scale |
| **Write** | Master only | Single DB | Multiple shards |
| **Read** | Dari replica mana saja | Single DB | Shard router + target shard |
| **Complexity** | Rendah | Rendah | Tinggi |
| **Cross-data** | Tidak ada | Tidak ada | Mungkin perlu (cross-shard) |

### Kombinasi: Sharding + Replication

Dalam praktik nyata, sharding dan replication sering digabungkan:

```
┌──────────────────────────────────────────────────────────────┐
│              SHARDING + REPLICATION (Production)              │
│                                                               │
│  ┌──────────────────────┐  ┌──────────────────────┐          │
│  │      SHARD 1         │  │      SHARD 2         │          │
│  │                      │  │                      │          │
│  │  ┌──────────┐        │  │  ┌──────────┐        │          │
│  │  │ Master   │ ──copy──▶│  │ Master   │ ──copy──▶│          │
│  │  │ S1-Primary│       │  │  │ S2-Primary│       │          │
│  │  └──────────┘        │  │  └──────────┘        │          │
│  │       │              │  │       │              │          │
│  │       │ replica      │  │       │ replica      │          │
│  │       ▼              │  │       ▼              │          │
│  │  ┌──────────┐        │  │  ┌──────────┐        │          │
│  │  │ Replica  │        │  │  │ Replica  │        │          │
│  │  │ S1-R1    │        │  │  │ S2-R1    │        │          │
│  │  └──────────┘        │  │  └──────────┘        │          │
│  │       │              │  │       │              │          │
│  │       ▼              │  │       ▼              │          │
│  │  ┌──────────┐        │  │  ┌──────────┐        │          │
│  │  │ Replica  │        │  │  │ Replica  │        │          │
│  │  │ S1-R2    │        │  │  │ S2-R2    │        │          │
│  │  └──────────┘        │  │  └──────────┘        │          │
│  └──────────────────────┘  └──────────────────────┘          │
│                                                               │
│  Write → Master shard                                         │
│  Read  → Bisa dari Master atau Replica (load balancing)       │
│  HA    → Jika Master down, Replica promote jadi Master        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## SHARDING STRATEGIES

### 1. Range-Based Sharding

Data dibagi berdasarkan range nilai dari shard key.

```
┌──────────────────────────────────────────────────────────────┐
│              RANGE-BASED SHARDING                             │
│                                                               │
│  Shard Key: user_id (integer, auto-increment)                 │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Shard 1: user_id 1 - 1.000.000                         │ │
│  │  Server A                                               │ │
│  │  Users: 1, 2, 3, ..., 1.000.000                        │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Shard 2: user_id 1.000.001 - 2.000.000                │ │
│  │  Server B                                               │ │
│  │  Users: 1.000.001, 1.000.002, ..., 2.000.000           │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Shard 3: user_id 2.000.001 - 3.000.000                │ │
│  │  Server C                                               │ │
│  │  Users: 2.000.001, 2.000.002, ..., 3.000.000           │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  Contoh lain (berdasarkan waktu):                            │
│  Shard 1: data Januari 2025                                   │
│  Shard 2: data Februari 2025                                  │
│  Shard 3: data Maret 2025                                     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Kelebihan:**
- **Sederhana** — Mudah dipahami dan diimplementasi
- **Range query efisien** — Query `WHERE user_id BETWEEN 100 AND 200` hanya perlu ke 1 shard
- **Mudah ditambah shard baru** — Cukup tentukan range baru

**Kekurangan:**
- **Hotspot** — Jika data tidak terdistribusi merata (user baru selalu di shard terakhir)
- **Tidak adaptif** — Harus manual adjust range saat data tidak seimbang
- **Rebalancing sulit** — Memindahkan range besar butuh waktu lama

**Kapan Gunakan:**
- Data terdistribusi merata secara alami
- Range query sering dilakukan
- Shard key monotonik (auto-increment, timestamp)

### 2. Hash-Based Sharding

Data dibagi berdasarkan hash value dari shard key.

```
┌──────────────────────────────────────────────────────────────┐
│              HASH-BASED SHARDING                              │
│                                                               │
│  Shard Key: user_id                                           │
│  Sharding Function: hash(user_id) % number_of_shards          │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  hash(101) % 4 = 1  → Shard 1                           │ │
│  │  hash(102) % 4 = 3  → Shard 3                           │ │
│  │  hash(103) % 4 = 0  → Shard 0                           │ │
│  │  hash(104) % 4 = 2  → Shard 2                           │ │
│  │  hash(105) % 4 = 1  → Shard 1                           │ │
│  │  hash(106) % 4 = 3  → Shard 3                           │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  Distribusi:                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Shard 0 │  │  Shard 1 │  │  Shard 2 │  │  Shard 3 │     │
│  │          │  │          │  │          │  │          │     │
│  │ user 103 │  │ user 101 │  │ user 104 │  │ user 102 │     │
│  │ user 107 │  │ user 105 │  │ user 108 │  │ user 106 │     │
│  │ user 111 │  │ user 109 │  │ user 112 │  │ user 110 │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                               │
│  Hash function umum:                                          │
│  - MD5, SHA-1 (cryptographic, tapi lambat)                   │
│  - MurmurHash (cepat, distribusi bagus)                       │
│  - CRC32 (sangat cepat, tapi distribusi kurang merata)        │
│  - FNV-1a (cepat, distribusi bagus)                           │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Kelebihan:**
- **Distribusi merata** — Hash function menjamin data tersebar merata
- **Tidak ada hotspot** — User baru bisa masuk ke shard manapun
- **Deterministik** — Hash yang sama selalu menghasilkan shard yang sama

**Kekurangan:**
- **Range query tidak efisien** — Query `WHERE user_id BETWEEN 100 AND 200` harus ke SEMUA shard
- **Rebalancing sulit** — Saat tambah shard, hampir semua data perlu dipindah (hash berubah)
- **Tidak intuitif** — Sulit prediksi data ada di shard mana

**Kapan Gunakan:**
- Butuh distribusi data yang merata
- Range query jarang dilakukan
- Point query (by ID) dominan

### 3. Directory-Based Sharding

Menggunakan lookup table untuk memetakan shard key ke shard.

```
┌──────────────────────────────────────────────────────────────┐
│              DIRECTORY-BASED SHARDING                         │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Lookup Table (Directory)                                │ │
│  │                                                          │ │
│  │  ┌──────────────┬──────────────┐                        │ │
│  │  │  Shard Key   │  Shard ID    │                        │ │
│  │  ├──────────────┼──────────────┤                        │ │
│  │  │  user_101    │  Shard A     │                        │ │
│  │  │  user_102    │  Shard B     │                        │ │
│  │  │  user_103    │  Shard A     │                        │ │
│  │  │  user_104    │  Shard C     │                        │ │
│  │  │  user_105    │  Shard B     │                        │ │
│  │  │  ...         │  ...         │                        │ │
│  │  └──────────────┴──────────────┘                        │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  Flow:                                                        │
│  1. Client query Directory: "user_103 di shard mana?"        │
│  2. Directory response: "Shard A"                             │
│  3. Client connect ke Shard A                                 │
│  4. Client query data user_103                                │
│                                                               │
│  ┌──────┐  query   ┌──────────┐  response  ┌──────────┐     │
│  │Client│ ────────▶│ Directory│ ──────────▶│  Client  │     │
│  │      │  "user   │          │  "Shard A" │          │     │
│  │      │  _103?"  │          │            │          │     │
│  └──┬───┘          └──────────┘            └────┬─────┘     │
│     │                                           │            │
│     │          ┌──────────┐                     │            │
│     │─────────▶│  Shard A │                     │            │
│     │  query   │          │                     │            │
│     │  user_103│          │                     │            │
│     │◀─────────│          │                     │            │
│     │  data    └──────────┘                     │            │
│     │                                           │            │
│     └───────────────────────────────────────────┘            │
│                        response data                         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Kelebihan:**
- **Fleksibel** — Bisa assign key ke shard manapun, tidak perlu pattern
- **Mudah rebalancing** — Cukup update lookup table, tidak perlu pindah data (logical move)
- **Heterogeneous shards** — Setiap shard bisa beda ukuran/kapasitas

**Kekurangan:**
- **Single point of failure** — Directory down = semua akses data down
- **Extra network hop** — Setiap query harus ke Directory dulu
- **Directory bisa jadi bottleneck** — Semua query melalui Directory
- **Directory perlu HA** — Harus replicate Directory untuk availability

**Kapan Gunakan:**
- Butuh kontrol penuh atas distribusi data
- Shard dengan kapasitas berbeda
- Dynamic rebalancing sering dilakukan

### 4. Geo-Based Sharding

Data dibagi berdasarkan lokasi geografis user/data.

```
┌──────────────────────────────────────────────────────────────┐
│              GEO-BASED SHARDING                               │
│                                                               │
│  Shard Key: region / country / locale                         │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Shard Asia (Server Tokyo)                               │ │
│  │  Users: Indonesia, Japan, Korea, India, dll              │ │
│  │  Latency: < 10ms untuk user Asia                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Shard Europe (Server Frankfurt)                         │ │
│  │  Users: Germany, France, UK, Netherlands, dll            │ │
│  │  Latency: < 10ms untuk user Europe                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Shard Americas (Server Virginia)                        │ │
│  │  Users: USA, Canada, Brazil, Mexico, dll                 │ │
│  │  Latency: < 10ms untuk user Americas                     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  Keuntungan:                                                  │
│  - Latency rendah (data dekat dengan user)                    │
│  - Compliance (data residency: GDPR, dll)                    │
│  - Fault isolation per region                                 │
│                                                               │
│  Tantangan:                                                   │
│  - Cross-region query lambat                                  │
│  - Data consistency antar region                              │
│  - User pindah region → data perlu migrasi                    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Perbandingan Strategi

| Aspek | Range | Hash | Directory | Geo |
|-------|-------|------|-----------|-----|
| **Distribusi** | Bisa tidak merata | Merata | Fleksibel | Berdasarkan lokasi |
| **Range Query** | ✅ Efisien | ❌ Tidak efisien | Tergantung | ❌ Tidak efisien |
| **Rebalancing** | Sulit | Sangat sulit | Mudah | Sedang |
| **Kompleksitas** | Rendah | Rendah | Tinggi | Sedang |
| **Hotspot Risk** | Tinggi | Rendah | Rendah | Sedang |
| **Single Point of Failure** | Tidak | Tidak | Ya (Directory) | Tidak |
| **Best Untuk** | Time-series, auto-increment | Point queries | Dynamic workload | Multi-region apps |

---

## SHARD KEY SELECTION

Memilih shard key yang tepat adalah keputusan paling penting dalam sharding. Shard key yang salah bisa menyebabkan hotspot, cross-shard query berlebihan, dan rebalancing yang sulit.

### Kriteria Shard Key Ideal

```
┌──────────────────────────────────────────────────────────────┐
│              KRITERIA SHARD KEY IDEAL                         │
│                                                               │
│  1. HIGH CARDINALITY                                          │
│     Shard key harus punya banyak nilai unik.                  │
│     ✅ user_id (jutaan nilai unik)                            │
│     ❌ is_active (hanya 2 nilai: true/false)                  │
│                                                               │
│  2. EVEN DISTRIBUTION                                         │
│     Data harus terdistribusi merata antar shard.              │
│     ✅ user_id (asumsi: user tersebar merata)                 │
│     ❌ country_id (beberapa negara punya user jauh lebih banyak)│
│                                                               │
│  3. QUERY PATTERN COMPATIBLE                                  │
│     Shard key harus sering digunakan dalam query.             │
│     ✅ user_id (sering dipakai di WHERE clause)               │
│     ❌ created_at (jarang dipakai sebagai filter utama)       │
│                                                               │
│  4. IMMUTABLE (atau jarang berubah)                           │
│     Shard key tidak boleh berubah setelah data dibuat.        │
│     ✅ user_id (tidak pernah berubah)                         │
│     ❌ email (user bisa ganti email → harus pindah shard)     │
│                                                               │
│  5. LOW CROSS-SHARD QUERY                                     │
│     Query yang umum tidak perlu akses multiple shard.         │
│     ✅ user_id (query per user = 1 shard)                     │
│     ❌ category_id (query per category = banyak shard)        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Contoh Shard Key yang Baik dan Buruk

```
┌──────────────────────────────────────────────────────────────┐
│              CONTOH SHARD KEY: E-COMMERCE                     │
│                                                               │
│  Tabel: orders                                                │
│  Kolom: order_id, user_id, product_id, total, status, created_at │
│                                                               │
│  ┌──────────────┬────────┬─────────────────────────────────┐ │
│  │  Shard Key   │ Rating │ Alasan                          │ │
│  ├──────────────┼────────┼─────────────────────────────────┤ │
│  │  user_id     │  ✅    │ - High cardinality              │ │
│  │              │        │ - Query per user = 1 shard      │ │
│  │              │        │ - Immutable                     │ │
│  │              │        │ - Distribusi merata             │ │
│  ├──────────────┼────────┼─────────────────────────────────┤ │
│  │  order_id    │  ✅    │ - High cardinality              │ │
│  │              │        │ - Point query efisien           │ │
│  │              │        │ - Immutable                     │ │
│  ├──────────────┼────────┼─────────────────────────────────┤ │
│  │  created_at  │  ⚠️   │ - Range query efisien           │ │
│  │              │        │ - Tapi hotspot (data baru selalu │ │
│  │              │        │   di shard terakhir)            │ │
│  ├──────────────┼────────┼─────────────────────────────────┤ │
│  │  status      │  ❌    │ - Low cardinality (5-10 values) │ │
│  │              │        │ - Distribusi tidak merata       │ │
│  ├──────────────┼────────┼─────────────────────────────────┤ │
│  │  product_id  │  ❌    │ - Query per product = banyak    │ │
│  │              │        │   cross-shard join              │ │
│  │              │        │ - Satu user beli banyak product │ │
│  │              │        │   = data tersebar di banyak shard│ │
│  └──────────────┴────────┴─────────────────────────────────┘ │
│                                                               │
│  REKOMENDASI: user_id (untuk query per user)                  │
│  atau order_id (untuk query per order)                        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Composite Shard Key

Kadang satu kolom tidak cukup. Composite shard key menggunakan kombinasi kolom:

```
Shard Key: (tenant_id, user_id)

Tenant A, User 1 → Shard 1
Tenant A, User 2 → Shard 1
Tenant B, User 1 → Shard 2
Tenant B, User 3 → Shard 2

Keuntungan: Multi-tenant isolation (data tenant berbeda di shard berbeda)
```

---

## SHARD REBALANCING

Saat data tumbuh atau shard ditambah/dikurang, data perlu dipindahkan antar shard agar tetap seimbang. Ini disebut **rebalancing**.

### Mengapa Rebalancing Diperlukan?

```
┌──────────────────────────────────────────────────────────────┐
│              SEBELUM & SESUDAH REBALANCING                    │
│                                                               │
│  SEBELUM (tidak seimbang):                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │  Shard 1 │  │  Shard 2 │  │  Shard 3 │                   │
│  │  50 GB   │  │  200 GB  │  │  250 GB  │  ← Shard 3 overload!│
│  │  10K qps │  │  40K qps │  │  50K qps │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
│                                                               │
│  SESUDAH (seimbang):                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Shard 1 │  │  Shard 2 │  │  Shard 3 │  │  Shard 4 │     │
│  │  125 GB  │  │  125 GB  │  │  125 GB  │  │  125 GB  │     │
│  │  25K qps │  │  25K qps │  │  25K qps │  │  25K qps │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                               │
│  Data dipindahkan dari Shard 2 & 3 ke Shard 1 & 4            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Rebalancing dengan Range Sharding

```
┌──────────────────────────────────────────────────────────────┐
│              REBALANCING: RANGE SHARDING                      │
│                                                               │
│  Sebelum (3 shards):                                          │
│  Shard 1: user_id 1 - 1.000.000                               │
│  Shard 2: user_id 1.000.001 - 2.000.000                      │
│  Shard 3: user_id 2.000.001 - 3.000.000 (OVERLOAD!)          │
│                                                               │
│  Tambah Shard 4, split Shard 3:                               │
│  Shard 1: user_id 1 - 1.000.000                               │
│  Shard 2: user_id 1.000.001 - 2.000.000                      │
│  Shard 3: user_id 2.000.001 - 2.500.000  ← split             │
│  Shard 4: user_id 2.500.001 - 3.000.000  ← baru              │
│                                                               │
│  Proses:                                                      │
│  1. Setup Shard 4 sebagai empty shard                         │
│  2. Copy data user_id 2.500.001 - 3.000.000 dari S3 ke S4    │
│  3. Selama copy, S3 masih handle read+write untuk range ini   │
│  4. Setelah copy selesai, switch routing ke S4                │
│  5. Hapus data yang sudah dipindah dari S3                    │
│                                                               │
│  Downtime: Minimal (hanya saat switch routing, ~detik)        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Rebalancing dengan Hash Sharding

```
┌──────────────────────────────────────────────────────────────┐
│              REBALANCING: HASH SHARDING                       │
│                                                               │
│  Sebelum (3 shards):                                          │
│  hash(key) % 3 → Shard 0, 1, atau 2                          │
│                                                               │
│  Tambah Shard 4:                                              │
│  hash(key) % 4 → Shard 0, 1, 2, atau 3                       │
│                                                               │
│  Masalah: hash(key) % 4 ≠ hash(key) % 3                      │
│  → Hampir SEMUA data perlu dipindah!                          │
│                                                               │
│  SOLUSI: Consistent Hashing                                   │
│  (dijelaskan di section berikutnya)                           │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## CONSISTENT HASHING

Consistent hashing adalah teknik yang meminimalkan data yang perlu dipindahkan saat shard ditambah atau dikurang.

### Masalah Tanpa Consistent Hashing

```
┌──────────────────────────────────────────────────────────────┐
│              TANPA CONSISTENT HASHING                         │
│                                                               │
│  3 shards: hash(key) % 3                                      │
│  hash(1) % 3 = 1  → Shard 1                                   │
│  hash(2) % 3 = 2  → Shard 2                                   │
│  hash(3) % 3 = 0  → Shard 0                                   │
│  hash(4) % 3 = 1  → Shard 1                                   │
│  hash(5) % 3 = 2  → Shard 2                                   │
│  hash(6) % 3 = 0  → Shard 0                                   │
│                                                               │
│  Tambah shard ke-4: hash(key) % 4                             │
│  hash(1) % 4 = 1  → Shard 1  ✅ (tetap)                       │
│  hash(2) % 4 = 2  → Shard 2  ✅ (tetap)                       │
│  hash(3) % 4 = 3  → Shard 3  ❌ (pindah dari 0 ke 3)         │
│  hash(4) % 4 = 0  → Shard 0  ❌ (pindah dari 1 ke 0)         │
│  hash(5) % 4 = 1  → Shard 1  ✅ (tetap)                       │
│  hash(6) % 4 = 2  → Shard 2  ❌ (pindah dari 0 ke 2)         │
│                                                               │
│  Hasil: 3 dari 6 data (50%) harus pindah!                     │
│  Untuk jutaan data, ini berarti downtime panjang.              │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Solusi: Consistent Hashing

```
┌──────────────────────────────────────────────────────────────┐
│              CONSISTENT HASHING                               │
│                                                               │
│  Konsep: Hash ring (circle)                                   │
│                                                               │
│  Hash space: 0 ──────────────────────────────────── 2^32     │
│              (dibuat melingkar)                                │
│                                                               │
│                     0 / 2^32                                  │
│                        │                                      │
│              Shard A ──┤                                      │
│                   (hash=100)                                  │
│                        │                                      │
│                        │                                      │
│  Shard D ──────────────┤────────────── Shard B               │
│  (hash=2^32-500)       │              (hash=500.000)         │
│                        │                                      │
│                        │                                      │
│              Shard C ──┤                                      │
│              (hash=1.000.000)                                 │
│                        │                                      │
│                                                               │
│  Data placement:                                              │
│  hash(data) → posisi di ring                                  │
│  Data masuk ke shard PERTAMA yang ditemui searah jarum jam    │
│                                                               │
│  Contoh:                                                      │
│  hash(user_101) = 200.000 → Shard B (next clockwise)         │
│  hash(user_102) = 800.000 → Shard C                           │
│  hash(user_103) = 1.500.000 → Shard D                         │
│  hash(user_104) = 2^32-100 → Shard A (wrap around)           │
│                                                               │
│  Saat tambah Shard E (hash=750.000):                          │
│                     0 / 2^32                                  │
│                        │                                      │
│              Shard A ──┤                                      │
│                        │                                      │
│                        │                                      │
│  Shard D ──────────────┤────────────── Shard B               │
│                        │                                      │
│                        │                                      │
│              Shard E ──┤──── Shard C                          │
│              (hash=    │    (hash=1.000.000)                 │
│               750.000) │                                      │
│                        │                                      │
│                                                               │
│  Hanya data antara 500.000-750.000 yang pindah (dari C ke E) │
│  Data lain tetap di shard yang sama!                          │
│                                                               │
│  Hasil: ~10% data pindah (vs 50% tanpa consistent hashing)   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Virtual Nodes

Untuk distribusi yang lebih merata, setiap physical shard punya multiple virtual nodes di ring:

```
┌──────────────────────────────────────────────────────────────┐
│              VIRTUAL NODES                                    │
│                                                               │
│  Tanpa virtual nodes:                                         │
│  Ring: [Shard A] ... [Shard B] ... [Shard C] ... [Shard D]   │
│  Masalah: Shard A dapat lebih banyak data dari Shard B        │
│                                                               │
│  Dengan virtual nodes (100 per shard):                        │
│  Ring: [A1] [C3] [B2] [A2] [D1] [B1] [C1] [A3] [D2] [C2]... │
│  Setiap shard muncul 100x di ring dengan posisi berbeda       │
│  Hasil: Distribusi jauh lebih merata                          │
│                                                               │
│  Saat tambah Shard E:                                         │
│  E1, E2, ..., E100 ditambahkan ke ring                        │
│  Hanya data di sekitar virtual nodes E yang pindah            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Implementasi Consistent Hashing

```python
import hashlib
import bisect

class ConsistentHashRing:
    def __init__(self, num_replicas=100):
        self.num_replicas = num_replicas
        self.ring = {}  # hash → shard_name
        self.sorted_keys = []  # sorted list of hashes

    def _hash(self, key):
        """Generate hash untuk key (0-2^32)."""
        return int(hashlib.md5(key.encode()).hexdigest(), 16) % (2**32)

    def add_shard(self, shard_name):
        """Tambah shard ke ring dengan virtual nodes."""
        for i in range(self.num_replicas):
            virtual_key = f"{shard_name}:{i}"
            hash_value = self._hash(virtual_key)
            self.ring[hash_value] = shard_name
            bisect.insort(self.sorted_keys, hash_value)

    def remove_shard(self, shard_name):
        """Hapus shard dari ring."""
        keys_to_remove = [
            k for k, v in self.ring.items() if v == shard_name
        ]
        for key in keys_to_remove:
            del self.ring[key]
            self.sorted_keys.remove(key)

    def get_shard(self, key):
        """Dapatkan shard untuk key tertentu."""
        hash_value = self._hash(key)
        idx = bisect.bisect_right(self.sorted_keys, hash_value)
        if idx == len(self.sorted_keys):
            idx = 0  # Wrap around
        return self.ring[self.sorted_keys[idx]]

# Penggunaan:
ring = ConsistentHashRing(num_replicas=100)
ring.add_shard("shard-a")
ring.add_shard("shard-b")
ring.add_shard("shard-c")

# Route data ke shard:
shard = ring.get_shard("user_123")  # → "shard-b"
shard = ring.get_shard("user_456")  # → "shard-a"

# Tambah shard baru:
ring.add_shard("shard-d")
# Hanya ~25% data yang perlu dipindah (1/4 dari ring)
```

---

## CROSS-SHARD QUERIES

Salah satu tantangan terbesar sharding adalah query yang membutuhkan data dari multiple shard.

### Masalah Cross-Shard Query

```
┌──────────────────────────────────────────────────────────────┐
│              CROSS-SHARD QUERY PROBLEM                        │
│                                                               │
│  Query yang TIDAK cross-shard (efisien):                      │
│  SELECT * FROM users WHERE user_id = 123                     │
│  → Shard router: user_id 123 ada di Shard 2                   │
│  → Query hanya ke Shard 2 ✅                                  │
│                                                               │
│  Query yang cross-shard (lambat):                             │
│  SELECT * FROM users WHERE email LIKE '%@gmail.com'           │
│  → Email tidak ada di shard key!                              │
│  → Harus query ke SEMUA shard ❌                              │
│  → Gabung hasil dari semua shard                              │
│  → Latency = max(latency semua shard)                         │
│                                                               │
│  JOIN cross-shard (sangat lambat):                            │
│  SELECT u.name, o.total                                       │
│  FROM users u JOIN orders o ON u.user_id = o.user_id          │
│  WHERE u.user_id = 123                                        │
│  → Jika users dan orders di-shard dengan key berbeda:         │
│    - Query users di Shard A (shard key: user_id)              │
│    - Query orders di Shard B (shard key: order_id)            │
│    - Application-level join ❌                                │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Solusi Cross-Shard Query

```
┌──────────────────────────────────────────────────────────────┐
│              SOLUSI CROSS-SHARD QUERY                         │
│                                                               │
│  1. DENORMALIZATION                                           │
│     ───────────────                                            │
│     Simpan data yang sering di-join di shard yang sama.       │
│                                                               │
│     Sebelum:                                                   │
│     users shard (key: user_id) → name, email                  │
│     orders shard (key: order_id) → user_id, total             │
│     → JOIN perlu cross-shard                                   │
│                                                               │
│     Sesudah (denormalize):                                     │
│     orders shard (key: order_id) → user_id, total,            │
│                                    user_name, user_email      │
│     → Tidak perlu JOIN, data sudah di orders shard ✅          │
│                                                               │
│     Trade-off: Data duplikat, consistency lebih sulit          │
│                                                               │
│  2. APPLICATION-LEVEL JOIN                                    │
│     ─────────────────────                                      │
│     Query masing-masing shard, gabung di application code.    │
│                                                               │
│     Step 1: Query users di Shard A → dapatkan user_name       │
│     Step 2: Query orders di Shard B → dapatkan order data     │
│     Step 3: Join di application code                          │
│                                                               │
│     Trade-off: Lebih banyak code, latency lebih tinggi         │
│                                                               │
│  3. GLOBAL INDEX                                              │
│     ─────────────                                              │
│     Buat index terpisah yang mapping key → shard location.    │
│                                                               │
│     Global Index:                                              │
│     email → (shard_id, user_id)                               │
│     "john@gmail.com" → (Shard 2, user_id=123)                 │
│     "jane@yahoo.com" → (Shard 1, user_id=456)                 │
│                                                               │
│     Query: SELECT * FROM users WHERE email = 'john@gmail.com' │
│     Step 1: Query global index → John di Shard 2              │
│     Step 2: Query Shard 2 untuk data John                     │
│                                                               │
│     Trade-off: Index perlu di-update saat data berubah         │
│                                                               │
│  4. MAPREDUCE / DISTRIBUTED QUERY ENGINE                      │
│     ─────────────────────────────                              │
│     Gunakan engine yang bisa query semua shard secara paralel.│
│                                                               │
│     Tools: Apache Spark, Presto, ClickHouse                   │
│     Query dikirim ke semua shard secara paralel               │
│     Hasil digabung di coordinator                             │
│                                                               │
│     Trade-off: Kompleks, butuh infrastructure tambahan         │
│                                                               │
│  5. CO-LOCATE RELATED DATA                                    │
│     ───────────────────────                                    │
│     Shard related data dengan key yang sama.                  │
│                                                               │
│     users shard key: user_id                                   │
│     orders shard key: user_id (bukan order_id!)               │
│     payments shard key: user_id                                │
│                                                               │
│     → Semua data user 123 ada di shard yang sama              │
│     → JOIN tidak perlu cross-shard ✅                          │
│                                                               │
│     Trade-off: Orders tidak bisa di-query by order_id efisien │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## DISTRIBUTED TRANSACTIONS ACROSS SHARDS

Transaksi yang melibatkan multiple shard sangat menantang karena ACID properties sulit dipertahankan.

### Masalah: Distributed Transaction

```
┌──────────────────────────────────────────────────────────────┐
│              DISTRIBUTED TRANSACTION PROBLEM                  │
│                                                               │
│  Transfer uang antar user di shard berbeda:                   │
│                                                               │
│  User A (Shard 1) transfer $100 ke User B (Shard 2)          │
│                                                               │
│  Step 1: UPDATE accounts SET balance = balance - 100         │
│          WHERE user_id = A  ← di Shard 1                      │
│                                                               │
│  Step 2: UPDATE accounts SET balance = balance + 100         │
│          WHERE user_id = B  ← di Shard 2                      │
│                                                               │
│  Masalah:                                                     │
│  - Jika Step 1 sukses tapi Step 2 gagal → $100 hilang!        │
│  - Jika Step 1 gagal tapi Step 2 sukses → $100 muncul dari    │
│    nowhere!                                                   │
│  - Kedua step harus sukses ATAU keduanya gagal (atomic)       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Solusi 1: Two-Phase Commit (2PC)

```
┌──────────────────────────────────────────────────────────────┐
│              TWO-PHASE COMMIT (2PC)                           │
│                                                               │
│  Coordinator: Komponen yang mengkoordinasi transaksi          │
│  Participants: Shard 1 dan Shard 2                            │
│                                                               │
│  Phase 1: PREPARE                                             │
│  ─────────                                                    │
│  Coordinator → Shard 1: "Siap untuk deduct $100 dari A?"     │
│  Shard 1: Cek balance A >= 100, lock row A                   │
│  Shard 1 → Coordinator: "YES, siap" (atau "NO" jika gagal)   │
│                                                               │
│  Coordinator → Shard 2: "Siap untuk add $100 ke B?"          │
│  Shard 2: Cek B valid, lock row B                            │
│  Shard 2 → Coordinator: "YES, siap"                          │
│                                                               │
│  Phase 2: COMMIT / ROLLBACK                                   │
│  ─────────────────                                            │
│  Jika SEMUA participant bilang YES:                           │
│    Coordinator → Shard 1: "COMMIT"                            │
│    Coordinator → Shard 2: "COMMIT"                            │
│    Shard 1: Deduct $100 dari A, release lock                  │
│    Shard 2: Add $100 ke B, release lock                       │
│    Transaksi SUKSES ✅                                        │
│                                                               │
│  Jika ADA participant bilang NO:                              │
│    Coordinator → Shard 1: "ROLLBACK"                          │
│    Coordinator → Shard 2: "ROLLBACK"                          │
│    Shard 1: Release lock, tidak ada perubahan                 │
│    Shard 2: Release lock, tidak ada perubahan                 │
│    Transaksi GAGAL ❌                                         │
│                                                               │
│  Masalah 2PC:                                                 │
│  - Blocking: Jika coordinator crash saat Phase 1, participant │
│    stuck (tidak tahu harus commit atau rollback)              │
│  - Performance: 2 round trip, lock ditahan lama               │
│  - Single point of failure: Coordinator                       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Solusi 2: Saga Pattern

```
┌──────────────────────────────────────────────────────────────┐
│              SAGA PATTERN                                     │
│                                                               │
│  Saga = sequence of local transactions, masing-masing di      │
│  satu shard, dengan compensating transaction untuk rollback.  │
│                                                               │
│  Forward flow:                                                │
│  Step 1: Deduct $100 dari A (Shard 1) ✅                     │
│  Step 2: Add $100 ke B (Shard 2) ✅                          │
│  Step 3: Send notification (Shard 3) ❌ GAGAL!               │
│                                                               │
│  Compensating flow (rollback):                                │
│  Compensate Step 2: Deduct $100 dari B (Shard 2) ✅          │
│  Compensate Step 1: Add $100 ke A (Shard 1) ✅               │
│  Transaksi di-rollback ke kondisi awal                        │
│                                                               │
│  Saga Orchestration (centralized):                            │
│  ┌─────────────┐                                              │
│  │  Saga       │  1. Execute Step 1                           │
│  │  Orchestrator│  2. Execute Step 2                          │
│  │             │  3. Execute Step 3 → FAIL!                   │
│  │             │  4. Compensate Step 2                        │
│  │             │  5. Compensate Step 1                        │
│  └─────────────┘                                              │
│                                                               │
│  Saga Choreography (decentralized):                           │
│  Step 1 selesai → emit event "DeductedFromA"                 │
│  Step 2 listen event → execute, emit "AddedToB"              │
│  Step 3 listen event → execute, emit "NotificationFailed"    │
│  Compensating handlers listen failure events                  │
│                                                               │
│  Keuntungan Saga vs 2PC:                                      │
│  - Non-blocking (tidak ada lock panjang)                      │
│  - Lebih fault tolerant                                       │
│  - Lebih scalable                                             │
│                                                               │
│  Tantangan Saga:                                              │
│  - Harus design compensating transaction untuk setiap step    │
│  - Eventual consistency (data tidak konsisten saat proses)    │
│  - Complex error handling                                     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Implementasi Saga Pattern

```python
class SagaOrchestrator:
    def __init__(self):
        self.steps = []
        self.compensations = []

    def add_step(self, execute_fn, compensate_fn):
        """Tambah step dengan compensating transaction."""
        self.steps.append(execute_fn)
        self.compensations.append(compensate_fn)

    def execute(self, context):
        """Eksekusi saga. Jika gagal, rollback semua step yang sukses."""
        completed_steps = []

        try:
            for i, step in enumerate(self.steps):
                step(context)
                completed_steps.append(i)
                print(f"Step {i+1} completed")

            print("Saga completed successfully!")
            return True

        except Exception as e:
            print(f"Saga failed at step {len(completed_steps)+1}: {e}")
            # Rollback dalam urutan terbalik
            for i in reversed(completed_steps):
                try:
                    self.compensations[i](context)
                    print(f"Compensated step {i+1}")
                except Exception as comp_error:
                    print(f"Compensation failed for step {i+1}: {comp_error}")
                    # Log untuk manual intervention
            return False

# Contoh: Transfer uang
saga = SagaOrchestrator()

saga.add_step(
    execute_fn=lambda ctx: deduct_from_account(ctx['from_user'], ctx['amount']),
    compensate_fn=lambda ctx: add_to_account(ctx['from_user'], ctx['amount'])
)

saga.add_step(
    execute_fn=lambda ctx: add_to_account(ctx['to_user'], ctx['amount']),
    compensate_fn=lambda ctx: deduct_from_account(ctx['to_user'], ctx['amount'])
)

saga.add_step(
    execute_fn=lambda ctx: send_notification(ctx['from_user'], ctx['to_user'], ctx['amount']),
    compensate_fn=lambda ctx: send_cancellation_notification(ctx['from_user'], ctx['to_user'])
)

context = {
    'from_user': 'user_A',
    'to_user': 'user_B',
    'amount': 100
}

success = saga.execute(context)
```

---

## KAPAN HARUS SHARDING?

Sharding bukan solusi pertama yang harus dipertimbangkan. Ada langkah-langkah yang lebih sederhana sebelum sharding.

### Scaling Ladder

```
┌──────────────────────────────────────────────────────────────┐
│              SCALING LADAR (dari mudah ke sulit)              │
│                                                               │
│  Level 1: Vertical Scaling                                    │
│  ─────────────────                                            │
│  Upgrade hardware: lebih banyak CPU, RAM, SSD.               │
│  Effort: Rendah | Impact: Terbatas                           │
│  Kapan: Database masih di bawah 50% resource usage            │
│                                                               │
│  Level 2: Read Replicas                                       │
│  ───────────────                                              │
│  Tambah replica untuk read-only queries.                      │
│  Effort: Rendah | Impact: Tinggi untuk read-heavy workload    │
│  Kapan: Read >> Write (ratio 10:1 atau lebih)                 │
│                                                               │
│  Level 3: Caching                                             │
│  ────────                                                     │
│  Tambah Redis/Memcached untuk query yang sering diakses.      │
│  Effort: Sedang | Impact: Tinggi untuk hot data               │
│  Kapan: Ada data yang sering dibaca, jarang berubah           │
│                                                               │
│  Level 4: Database Partitioning                               │
│  ─────────────────────                                        │
│  Partition table dalam SATU database (by date, by range).     │
│  Effort: Sedang | Impact: Sedang                              │
│  Kapan: Table sangat besar tapi masih muat di satu server     │
│                                                               │
│  Level 5: Sharding                                            │
│  ────────                                                     │
│  Pecah database ke MULTIPLE server.                           │
│  Effort: Tinggi | Impact: Tinggi (horizontal scale)           │
│  Kapan: Semua level di atas sudah tidak cukup                 │
│                                                               │
│  Level 6: Polyglot Persistence                                │
│  ─────────────────────                                        │
│  Gunakan database berbeda untuk use case berbeda.             │
│  Effort: Tinggi | Impact: Tinggi                              │
│  Kapan: Satu database tidak cocok untuk semua use case        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Checklist: Apakah Sudah Saatnya Sharding?

```
┌──────────────────────────────────────────────────────────────┐
│              SHARDING READINESS CHECKLIST                     │
│                                                               │
│  Pertimbangkan sharding JIKA:                                 │
│                                                               │
│  [ ] Database size > 100 GB dan terus tumbuh cepat            │
│  [ ] CPU usage consistently > 70%                             │
│  [ ] Memory usage > 80% (index tidak muat di RAM)             │
│  [ ] Read replicas sudah tidak cukup (write bottleneck)       │
│  [ ] Caching sudah dioptimasi tapi masih bottleneck           │
│  [ ] Partitioning sudah dilakukan tapi masih tidak cukup      │
│  [ ] Query latency > SLA yang ditetapkan                      │
│  [ ] Connection pool sering penuh                             │
│  [ ] Replication lag > acceptable threshold                   │
│                                                               │
│  JANGAN sharding JIKA:                                        │
│                                                               │
│  [ ] Belum coba vertical scaling                              │
│  [ ] Belum coba read replicas                                 │
│  [ ] Belum coba caching                                       │
│  [ ] Belum coba partitioning                                  │
│  [ ] Database size < 50 GB                                    │
│  [ ] Query latency masih acceptable                           │
│  [ ] Tim tidak siap handle operational complexity             │
│                                                               │
│  INGAT: Shadding menambah KOMPLEKSITAS operasional secara     │
│  signifikan. Pastikan benefit > cost sebelum memutuskan.      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## IMPLEMENTASI: MYSQL, POSTGRESQL, MONGODB

### MySQL Sharding

MySQL tidak punya built-in sharding. Perlu manual implementation atau menggunakan middleware.

**Option 1: Application-Level Sharding**

```python
# Python + MySQL: Manual sharding di application code
import mysql.connector
import hashlib

class ShardedMySQL:
    def __init__(self, shards):
        """
        shards = {
            'shard_0': {'host': 'db1.example.com', 'port': 3306, 'database': 'users'},
            'shard_1': {'host': 'db2.example.com', 'port': 3306, 'database': 'users'},
            'shard_2': {'host': 'db3.example.com', 'port': 3306, 'database': 'users'},
        }
        """
        self.shards = shards
        self.connections = {}
        for name, config in shards.items():
            self.connections[name] = mysql.connector.connect(**config)

    def _get_shard_name(self, user_id):
        """Tentukan shard berdasarkan user_id."""
        hash_value = int(hashlib.md5(str(user_id).encode()).hexdigest(), 16)
        shard_index = hash_value % len(self.shards)
        return f"shard_{shard_index}"

    def get_connection(self, user_id):
        """Dapatkan connection ke shard yang tepat."""
        shard_name = self._get_shard_name(user_id)
        return self.connections[shard_name]

    def get_user(self, user_id):
        """Query user dari shard yang tepat."""
        conn = self.get_connection(user_id)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
        return cursor.fetchone()

    def create_user(self, user_data):
        """Insert user ke shard yang tepat."""
        user_id = user_data['user_id']
        conn = self.get_connection(user_id)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (user_id, name, email) VALUES (%s, %s, %s)",
            (user_id, user_data['name'], user_data['email'])
        )
        conn.commit()

# Penggunaan:
shards = {
    'shard_0': {'host': '10.0.1.10', 'port': 3306, 'database': 'users',
                'user': 'app', 'password': '***'},
    'shard_1': {'host': '10.0.1.11', 'port': 3306, 'database': 'users',
                'user': 'app', 'password': '***'},
    'shard_2': {'host': '10.0.1.12', 'port': 3306, 'database': 'users',
                'user': 'app', 'password': '***'},
}

db = ShardedMySQL(shards)
db.create_user({'user_id': 123, 'name': 'John', 'email': 'john@example.com'})
user = db.get_user(123)
```

**Option 2: MySQL Router / ProxySQL**

```
┌──────────────────────────────────────────────────────────────┐
│              MYSQL SHARDING DENGAN PROXYSQL                   │
│                                                               │
│  ProxySQL adalah MySQL-aware proxy yang bisa route query      │
│  ke shard yang tepat berdasarkan query rules.                 │
│                                                               │
│  ┌──────┐     ┌──────────┐     ┌──────────┐                  │
│  │ App  │────▶│ ProxySQL │────▶│  MySQL   │                  │
│  │      │     │          │     │  Shard 1 │                  │
│  │      │     │  Query   │────▶│  MySQL   │                  │
│  │      │     │  Routing │     │  Shard 2 │                  │
│  │      │     │          │────▶│  MySQL   │                  │
│  └──────┘     └──────────┘     │  Shard 3 │                  │
│                                └──────────┘                  │
│                                                               │
│  Konfigurasi query rules di ProxySQL:                         │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  rule_id | match_pattern        | destination_hostgroup │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │  1       | user_id IN (1-10000) │ 10 (Shard 1)          │ │
│  │  2       | user_id IN (10001+)  │ 20 (Shard 2)          │ │
│  │  3       | user_id IN (20001+)  │ 30 (Shard 3)          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  Aplikasi connect ke ProxySQL (bukan langsung ke MySQL).      │
│  ProxySQL otomatis route query ke shard yang tepat.           │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### PostgreSQL Sharding

PostgreSQL tidak punya built-in sharding, tapi punya table partitioning dan bisa dikombinasikan dengan extension.

**Option 1: PostgreSQL + Citus (Extension untuk Distributed PostgreSQL)**

```sql
-- Install Citus extension
CREATE EXTENSION citus;

-- Buat table
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY,
    name TEXT,
    email TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Distribusikan table berdasarkan user_id (sharding!)
SELECT create_distributed_table('users', 'user_id');

-- Citus otomatis:
-- 1. Membuat shards di worker nodes
-- 2. Routing query ke shard yang tepat
-- 3. Parallel query execution untuk cross-shard queries

-- Query otomatis di-route:
SELECT * FROM users WHERE user_id = 123;
-- → Citus route ke shard yang berisi user_id 123

-- Cross-shard query (otomatis parallel):
SELECT count(*) FROM users WHERE created_at > '2025-01-01';
-- → Citus query semua shard secara paralel, gabung hasil
```

**Option 2: PostgreSQL Table Partitioning (Single Server)**

```sql
-- Partitioning (bukan sharding, tapi langkah pertama)
CREATE TABLE users (
    user_id BIGINT,
    name TEXT,
    email TEXT,
    created_at TIMESTAMP
) PARTITION BY RANGE (created_at);

-- Buat partition per bulan
CREATE TABLE users_2025_01 PARTITION OF users
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE users_2025_02 PARTITION OF users
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
CREATE TABLE users_2025_03 PARTITION OF users
    FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

-- Query otomatis hanya scan partition yang relevan:
SELECT * FROM users WHERE created_at = '2025-01-15';
-- → Hanya scan users_2025_01 (partition pruning)

-- Ini BUKAN sharding (masih satu server), tapi membantu
-- query performance untuk table besar.
```

### MongoDB Sharding

MongoDB punya built-in sharding — paling mudah di-setup di antara ketiga database.

```
┌──────────────────────────────────────────────────────────────┐
│              MONGODB SHARDING ARCHITECTURE                    │
│                                                               │
│  ┌─────────────┐                                              │
│  │  Mongos     │ ← Query router (client connect ke sini)     │
│  │  (Router)   │   Route query ke shard yang tepat           │
│  └──────┬──────┘                                              │
│         │                                                      │
│         ▼                                                      │
│  ┌─────────────┐                                              │
│  │  Config     │ ← Metadata: shard mapping, chunk location   │
│  │  Servers    │   (replica set 3 nodes)                      │
│  └──────┬──────┘                                              │
│         │                                                      │
│    ┌────┴────┐                                                 │
│    ▼         ▼                                                 │
│  ┌─────┐  ┌─────┐                                            │
│  │Shard│  │Shard│  ← Setiap shard = replica set               │
│  │  1  │  │  2  │     (3 nodes: 1 primary, 2 secondary)       │
│  └─────┘  └─────┘                                            │
│                                                               │
│  MongoDB sharding concepts:                                   │
│  - Chunk: Range data (default 64MB)                          │
│  - Balancer: Auto-migrate chunks antar shard                  │
│  - Shard Key: Field yang digunakan untuk shard                │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Setup MongoDB Sharding:**

```bash
# 1. Start Config Server Replica Set
mongod --configsvr --replSet configRS --port 27019 --dbpath /data/config1
mongod --configsvr --replSet configRS --port 27020 --dbpath /data/config2
mongod --configsvr --replSet configRS --port 27021 --dbpath /data/config3

# Initiate config replica set
mongo --port 27019
> rs.initiate({
    _id: "configRS",
    configsvr: true,
    members: [
      { _id: 0, host: "config1:27019" },
      { _id: 1, host: "config2:27020" },
      { _id: 2, host: "config3:27021" }
    ]
  })

# 2. Start Shard Replica Sets
# Shard 1
mongod --shardsvr --replSet shard1RS --port 27018 --dbpath /data/shard1a
mongod --shardsvr --replSet shard1RS --port 27028 --dbpath /data/shard1b
# Shard 2
mongod --shardsvr --replSet shard2RS --port 27038 --dbpath /data/shard2a
mongod --shardsvr --replSet shard2RS --port 27048 --dbpath /data/shard2b

# 3. Start Mongos (Query Router)
mongos --configdb configRS/config1:27019,config2:27020,config3:27021 --port 27017

# 4. Add Shards
mongo --port 27017
> sh.addShard("shard1RS/shard1a:27018,shard1b:27028")
> sh.addShard("shard2RS/shard2a:27038,shard2b:27048")

# 5. Enable Sharding untuk Database
> sh.enableSharding("myapp")

# 6. Shard Collection
# Hash-based sharding:
> sh.shardCollection("myapp.users", { user_id: "hashed" })

# Range-based sharding:
> sh.shardCollection("myapp.orders", { created_at: 1 })

# Compound shard key:
> sh.shardCollection("myapp.sessions", { tenant_id: 1, user_id: 1 })
```

**MongoDB Shard Key Selection:**

```javascript
// Cek shard key distribution
db.users.getShardDistribution()

// Output:
// Shard shard1RS at shard1RS/shard1a:27018,shard1b:27028
//   data: 50GB docs: 10M chunks: 800
//   estimated data per chunk: 64MB
//   estimated docs per chunk: 12,500
//
// Shard shard2RS at shard2RS/shard2a:27038,shard2b:27048
//   data: 48GB docs: 9.5M chunks: 750
//   estimated data per chunk: 64MB
//   estimated docs per chunk: 12,667
//
// Totals:
//   data: 98GB docs: 19.5M chunks: 1550
//   Different shard key sizes: 0

// Jika distribusi tidak merata, pertimbangkan ganti shard key
```

---

## SHARDING PITFALLS DAN SOLUSI

### Pitfall 1: Hot Shard (Uneven Distribution)

```
┌──────────────────────────────────────────────────────────────┐
│              HOT SHARD PROBLEM                                │
│                                                               │
│  Shard 1: 10K qps (normal)                                    │
│  Shard 2: 10K qps (normal)                                    │
│  Shard 3: 80K qps (HOT! 8x lebih tinggi) ← Masalah!          │
│                                                               │
│  Penyebab:                                                    │
│  - Shard key tidak terdistribusi merata                       │
│  - Range-based sharding dengan auto-increment key             │
│  - Geo-based sharding dengan user tidak merata per region     │
│                                                               │
│  Solusi:                                                      │
│  1. Ganti ke hash-based sharding                              │
│  2. Gunakan composite shard key                               │
│  3. Tambah virtual nodes (consistent hashing)                 │
│  4. Manual rebalance: split hot shard jadi 2                  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Pitfall 2: Cross-Shard Join Performance

```
┌──────────────────────────────────────────────────────────────┐
│              CROSS-SHARD JOIN SLOW                            │
│                                                               │
│  SELECT u.name, o.total, p.product_name                      │
│  FROM users u                                                 │
│  JOIN orders o ON u.user_id = o.user_id                      │
│  JOIN products p ON o.product_id = p.product_id              │
│  WHERE u.user_id = 123                                       │
│                                                               │
│  Jika users, orders, products di-shard dengan key berbeda:   │
│  → Query harus ke 3 shard berbeda                             │
│  → Application-level join                                     │
│  → Latency = sum(latency semua shard)                        │
│                                                               │
│  Solusi:                                                      │
│  1. Co-locate: Shard semua dengan user_id                    │
│  2. Denormalize: Simpan user_name di orders, product_name    │
│     di orders                                                 │
│  3. Materialized view: Pre-compute join result               │
│  4. Caching: Cache hasil join yang sering diakses             │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Pitfall 3: Auto-Increment ID Across Shards

```
┌──────────────────────────────────────────────────────────────┐
│              AUTO-INCREMENT ID DI SHARDED DB                  │
│                                                               │
│  Masalah: AUTO_INCREMENT tidak work di sharded environment   │
│  karena setiap shard punya counter sendiri.                   │
│                                                               │
│  Shard 1: id = 1, 2, 3, ...                                  │
│  Shard 2: id = 1, 2, 3, ...  ← DUPLICATE!                    │
│                                                               │
│  Solusi:                                                      │
│                                                               │
│  1. UUID/GUID                                                 │
│     Generate UUID di application layer                       │
│     Keunikan: Global unique                                  │
│     Kekurangan: Besar (36 char), tidak sequential            │
│     Contoh: 550e8400-e29b-41d4-a716-446655440000             │
│                                                               │
│  2. Snowflake ID (Twitter)                                    │
│     64-bit ID: timestamp + worker_id + sequence              │
│     Keunikan: Global unique, sequential (time-based)         │
│     Kekurangan: Perlu clock synchronization                  │
│     Contoh: 1234567890123456789                              │
│                                                               │
│  3. Flickr Ticket Server                                      │
│     Centralized ID generator (single server)                 │
│     AUTO_INCREMENT di server ID, bukan di shard              │
│     Keunikan: Sequential, global unique                      │
│     Kekurangan: Single point of failure (perlu HA)           │
│                                                               │
│  4. Shard-Specific Range                                      │
│     Shard 1: id 1-1.000.000.000                              │
│     Shard 2: id 1.000.000.001-2.000.000.000                  │
│     Keunikan: Sequential per shard, global unique             │
│     Kekurangan: Harus pre-allocate range, waste jika tidak   │
│     terpakai                                                  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Pitfall 4: Schema Changes Across Shards

```
┌──────────────────────────────────────────────────────────────┐
│              SCHEMA MIGRATION DI SHARDED DB                   │
│                                                               │
│  Masalah: ALTER TABLE di 10 shard = 10x lebih lama           │
│  dan risk inconsistency jika migration gagal di tengah jalan. │
│                                                               │
│  Solusi:                                                      │
│                                                               │
│  1. Rolling Migration                                         │
│     Migrasi shard per shard, satu per satu                    │
│     Shard yang belum migrasi tetap serve traffic              │
│     Zero downtime, tapi migration lama                        │
│                                                               │
│  2. Expand/Contract Pattern                                   │
│     Phase 1 (Expand): Tambah kolom baru, tulis ke keduanya   │
│     Phase 2: Backfill data dari kolom lama ke kolom baru     │
│     Phase 3: Switch read dari kolom baru                     │
│     Phase 4 (Contract): Hapus kolom lama                     │
│     Zero downtime, backward compatible                       │
│                                                               │
│  3. Blue-Green Migration                                      │
│     Buat schema baru di shard baru                            │
│     Dual-write ke schema lama dan baru                        │
│     Switch traffic ke schema baru                             │
│     Hapus schema lama                                         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Pitfall 5: Backup dan Recovery

```
┌──────────────────────────────────────────────────────────────┐
│              BACKUP DI SHARDED DATABASE                       │
│                                                               │
│  Masalah: Backup harus konsisten across semua shard.          │
│  Jika backup Shard 1 pada jam 10:00 dan Shard 2 pada 10:05,  │
│  data tidak konsisten (ada transaksi di antara 10:00-10:05).  │
│                                                               │
│  Solusi:                                                      │
│                                                               │
│  1. Coordinated Backup                                        │
│     Stop write ke semua shard (brief pause)                   │
│     Backup semua shard secara paralel                         │
│     Resume write                                              │
│     Konsisten, tapi downtime singkat                          │
│                                                               │
│  2. Point-in-Time Recovery (PITR)                             │
│     Backup full + binary logs/WAL                             │
│     Restore ke timestamp tertentu                             │
│     Tidak perlu stop write                                    │
│                                                               │
│  3. Logical Backup                                            │
│     Export data via query (mysqldump, pg_dump)                │
│     Lebih lambat, tapi portable                               │
│     Bisa restore ke schema berbeda                            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## CASE STUDY: INSTAGRAM DATABASE SHARDING

Instagram adalah salah satu contoh paling terkenal dari database sharding di scale besar.

### Latar Belakang

```
┌──────────────────────────────────────────────────────────────┐
│              INSTAGRAM: AWAL MULA                             │
│                                                               │
│  2010: Instagram launch dengan:                               │
│  - Single PostgreSQL database                                 │
│  - Auto-increment primary keys                                │
│  - Django ORM                                                 │
│                                                               │
│  2012: 30 juta user, 100+ juta foto                          │
│  - Database mulai bottleneck                                  │
│  - Read replicas ditambahkan                                  │
│  - Caching dengan Memcached                                   │
│                                                               │
│  2013: 150 juta user, 16 miliar foto                         │
│  - Read replicas tidak cukup                                  │
│  - Write bottleneck                                           │
│  - Perlu sharding!                                            │
│                                                               │
│  2026: 2+ miliar user, 100+ miliar foto                      │
│  - Multi-shard, multi-region                                  │
│  - Custom sharding infrastructure                             │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Bagaimana Instagram Melakukan Sharding

```
┌──────────────────────────────────────────────────────────────┐
│              INSTAGRAM SHARDING STRATEGY                      │
│                                                               │
│  1. SHARD KEY: user_id                                        │
│     ─────────────────                                          │
│     Semua data user di-shard berdasarkan user_id.             │
│     Photos, likes, comments, followers — semua co-located     │
│     di shard yang sama berdasarkan owner user_id.             │
│                                                               │
│     Keuntungan:                                                │
│     - Query "foto user X" = 1 shard                           │
│     - Query "likes di foto user X" = 1 shard                  │
│     - Query "followers user X" = 1 shard                      │
│     - Minimal cross-shard query                               │
│                                                               │
│  2. SHARDING FUNCTION: Custom                                 │
│     ─────────────────────                                      │
│     Instagram tidak pakai modulo sederhana.                   │
│     Mereka pakai custom sharding function yang bisa           │
│     rebalance tanpa pindah semua data.                        │
│                                                               │
│     Logical shards: 10.000 (fixed)                            │
│     Physical shards: 100 (bertambah seiring growth)           │
│     Mapping: Logical → Physical (via lookup table)            │
│                                                               │
│     Saat tambah physical shard:                               │
│     - Pindahkan subset logical shards ke physical baru        │
│     - Hanya data di logical shards yang pindah                │
│     - Tidak perlu rehash semua data                           │
│                                                               │
│  3. ID GENERATION: Custom 64-bit ID                           │
│     ──────────────────────────────                             │
│     Tidak pakai AUTO_INCREMENT (tidak work di sharding).      │
│     Instagram buat custom ID generator:                       │
│                                                               │
│     64-bit ID =                                              │
│       41 bits: timestamp (milliseconds)                       │
│       13 bits: shard ID                                       │
│       10 bits: sequence number                                │
│                                                               │
│     Keunikan:                                                  │
│     - Global unique across semua shard                        │
│     - Time-sortable (ID lebih besar = lebih baru)             │
│     - Embed shard ID (bisa route tanpa lookup)                │
│     - Compact (64-bit integer, bukan UUID)                    │
│                                                               │
│  4. CROSS-SHARD QUERIES: Denormalization + Fan-out           │
│     ─────────────────────────────────────────                  │
│     Instagram feed membutuhkan data dari banyak user          │
│     (yang mungkin di shard berbeda).                          │
│                                                               │
│     Solusi:                                                   │
│     - Pre-compute feed: Saat user post foto, fan-out ke       │
│       feed semua followers (write-time fan-out)               │
│     - Feed disimpan di shard masing-masing follower           │
│     - Read feed = query 1 shard (shard follower)              │
│     - Trade-off: Write lebih berat, read lebih ringan         │
│                                                               │
│  5. CONSISTENCY: Eventual Consistency                         │
│     ─────────────────────                                      │
│     Instagram menerima eventual consistency untuk:            │
│     - Like count (bisa delay beberapa detik)                  │
│     - Follower count (bisa delay)                             │
│     - Feed ordering (tidak perlu exact chronological)         │
│                                                               │
│     Strong consistency hanya untuk:                           │
│     - User authentication                                     │
│     - Payment (jika ada)                                      │
│     - Data yang critical                                      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Instagram Sharding Architecture

```
┌──────────────────────────────────────────────────────────────┐
│              INSTAGRAM ARCHITECTURE (Simplified)              │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Application Layer (Django)                              │ │
│  │                                                          │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │ │
│  │  │  Photo      │  │  Feed       │  │  Follow     │     │ │
│  │  │  Service    │  │  Service    │  │  Service    │     │ │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │ │
│  └─────────┼───────────────┼───────────────┼──────────────┘ │
│            │               │               │                │
│  ┌─────────┼───────────────┼───────────────┼──────────────┐ │
│  │  Data Layer (Sharded PostgreSQL)                        │ │
│  │                                                          │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │  Logical Shards (10.000)                         │   │ │
│  │  │                                                  │   │ │
│  │  │  L001 → Physical A    L002 → Physical B         │   │ │
│  │  │  L003 → Physical A    L004 → Physical C         │   │ │
│  │  │  L005 → Physical B    L006 → Physical A         │   │ │
│  │  │  ...                    ...                      │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  │                                                          │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │ │
│  │  │Physical A│  │Physical B│  │Physical C│  ...         │ │
│  │  │(PostgreSQL│  │(PostgreSQL│  │(PostgreSQL│            │ │
│  │  │ + Replica)│  │ + Replica)│  │ + Replica)│            │ │
│  │  └──────────┘  └──────────┘  └──────────┘              │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  Key Design Decisions:                                        │
│  - Logical shards fixed (10.000) → tidak perlu rehash        │
│  - Physical shards bertambah → scale horizontal              │
│  - Mapping table: logical → physical → mudah rebalance       │
│  - Custom ID generator → embed shard info                    │
│  - Denormalization → minimal cross-shard query               │
│  - Write-time fan-out → feed read efisien                    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Pelajaran dari Instagram

1. **Jangan shard terlalu awal** — Instagram berhasil dengan single DB sampai 150 juta user. Optimasi dulu (caching, read replicas, indexing) sebelum sharding.

2. **Pilih shard key yang tepat** — `user_id` adalah pilihan tepat karena sebagian besar query Instagram berbasis user.

3. **Logical vs Physical shards** — Abstraksi logical shards memungkinkan rebalancing tanpa rehash semua data.

4. **Custom ID generator** — AUTO_INCREMENT tidak work di sharding. Buat ID generator yang embed shard info.

5. **Denormalize untuk performance** — Trade-off storage vs query complexity. Instagram pilih denormalize untuk feed performance.

6. **Eventual consistency acceptable** — Tidak semua data butuh strong consistency. Like count bisa eventual.

---

## REFERENSI DARI DONNEMARTIN/SYSTEM-DESIGN-PRIMER

Materi di file ini terkait dengan bagian-bagian berikut di [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer):

### Sharding
- **System Design Topics → Sharding** — Penjelasan sharding, sharding strategies, consistent hashing
- **Horizontal Scaling → Sharding** — Bagaimana sharding memungkinkan horizontal scaling
- **Database → Sharding** — Database sharding patterns dan trade-offs

### Related Topics
- **System Design Topics → Consistent Hashing** — Consistent hashing ring, virtual nodes
- **System Design Topics → Federation** — Database federation (related to sharding)
- **System Design Topics → Replication** — Replication vs sharding
- **Caching → Database Caching** — Cache-aside, write-through, write-behind patterns

### Case Studies
- **System Design Primer → Instagram** — Design Instagram (termasuk sharding strategy)
- **System Design Primer → Twitter** — Design Twitter (feed generation, fan-out)

### Additional References
- **Citus Data Documentation** — https://docs.citusdata.com/
- **MongoDB Sharding Documentation** — https://www.mongodb.com/docs/manual/sharding/
- **Instagram Engineering Blog** — https://instagram-engineering.com/
- **Twitter Engineering Blog** — https://blog.twitter.com/engineering

---

## ✅ CHECKLIST

### Pemahaman Konsep
- [ ] Paham apa itu sharding dan perbedaannya dengan replication/partitioning
- [ ] Paham 4 sharding strategies (range, hash, directory, geo)
- [ ] Paham kriteria shard key ideal
- [ ] Paham consistent hashing dan virtual nodes
- [ ] Paham shard rebalancing
- [ ] Paham cross-shard query problem dan solusinya
- [ ] Paham distributed transactions (2PC, Saga pattern)
- [ ] Paham scaling ladder dan kapan harus sharding

### Implementasi
- [ ] Paham implementasi sharding di MySQL (application-level, ProxySQL)
- [ ] Paham implementasi sharding di PostgreSQL (Citus, partitioning)
- [ ] Paham implementasi sharding di MongoDB (built-in)
- [ ] Paham ID generation di sharded environment (UUID, Snowflake)

### Pitfalls
- [ ] Paham hot shard problem dan solusinya
- [ ] Paham cross-shard join performance issue
- [ ] Paham schema migration di sharded environment
- [ ] Paham backup dan recovery di sharded database

### Case Study
- [ ] Paham bagaimana Instagram melakukan sharding
- [ ] Paham logical vs physical shards concept
- [ ] Paham write-time fan-out untuk feed generation

---

> **Lanjut ke:** [`04-message-queues.md`](./04-message-queues.md)
>
> **Kembali ke:** [`02-service-discovery-api-gateway.md`](./02-service-discovery-api-gateway.md)
