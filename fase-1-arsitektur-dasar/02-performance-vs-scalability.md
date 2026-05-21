# 02 — Performance vs Scalability

> **Estimasi:** 2 jam | **Level:** Pemula → Menengah

---

## 📖 TEORI

### Definisi

**Performance** dan **Scalability** sering disamakan, padahal berbeda secara fundamental:

| Konsep | Pertanyaan yang Dijawab | Fokus | Metrik Utama |
|---|---|---|---|
| **Performance** | "Seberapa cepat sistem melayani 1 pengguna?" | Kecepatan respons | Latency, Response Time, IOPS |
| **Scalability** | "Seberapa baik sistem melayani 10.000 pengguna?" | Kemampuan tumbuh | Throughput, Concurrent Users, Resource Utilization |

Perbedaan ini penting karena **solusi untuk masalah performance berbeda dengan solusi untuk masalah scalability**. Mengoptimasi kode (performance fix) tidak akan membantu jika sistem tidak bisa scale ke lebih banyak pengguna (scalability fix).

### Rumus Dasar

```
Throughput = Jumlah Request / Waktu (req/sec)
Latency    = Waktu Respons per Request (ms)
Utilization = Resource Terpakai / Total Resource (%)

Little's Law (Hukum Little):
  N = λ × W
  di mana:
    N = jumlah request dalam sistem
    λ = throughput (arrival rate)
    W = waktu rata-rata dalam sistem (latency)

Contoh:
  Jika throughput = 100 req/sec dan latency = 50ms (0.05 detik)
  N = 100 × 0.05 = 5 request dalam sistem pada satu waktu
```

### Analogi Warung Makan

**Performance:**
Warung dengan 1 pelayan yang sangat cepat. 1 pelanggan dilayani dalam 2 menit. Pelayan ini hafal menu, lari cepat, dan ingat semua pesanan tanpa catatan.

**Scalability:**
Warung yang bisa menambah pelayan saat ramai. 1 pelanggan tetap dilayani dalam 5 menit (lebih lambat dari pelayan super cepat), tapi 100 pelanggan bisa dilayani bersamaan karena ada 20 pelayan.

```
Performance Tinggi, Scalability Rendah:
┌─────────────────────────────────┐
│         WARUNG SUPER CEPAT       │
│                                  │
│  ┌────────────┐                  │
│  │  1 Pelayan │ ← Sangat cepat   │
│  │  (Usain)   │   2 menit/pelanggan
│  └────────────┘                  │
│                                  │
│  Antrian: 100 orang → 200 menit! │
│  (100 × 2 menit, 1 pelayan)      │
└─────────────────────────────────┘

Scalability Tinggi, Performance Cukup:
┌─────────────────────────────────┐
│         WARUNG BANYAK PELAYAN    │
│                                  │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│  │ P1 │ │ P2 │ │ P3 │ │ P4 │   │
│  └────┘ └────┘ └────┘ └────┘   │
│  5 menit/pelanggan per pelayan   │
│                                  │
│  Antrian: 100 orang → 25 menit!  │
│  (100 / 4 pelayan × 5 menit)     │
└─────────────────────────────────┘
```

### Perbedaan Kunci

```
Masalah Performance:
"Sistem lambat untuk 1 pengguna"
→ Solusi: Optimasi kode, tambah RAM, upgrade CPU, optimasi query

Masalah Scalability:
"Sistem cepat untuk 1 pengguna, tapi lambat untuk 1000 pengguna"
→ Solusi: Tambah server, load balancing, caching, sharding

Masalah Keduanya:
"Sistem lambat DAN tidak bisa handle banyak pengguna"
→ Solusi: Optimasi dulu (performance), baru scale (scalability)
```

**Penting:** Selalu selesaikan masalah performance terlebih dahulu sebelum melakukan scaling. Menscale sistem yang tidak performant hanya akan menghasilkan banyak server yang tidak performant — lebih mahal, sama lambatnya.

### Cara Mengukur

**Performance diukur dengan:**
- Response time (waktu respons) — berapa milidetik server merespons
- Latency — delay antara request dan response (p50, p95, p99)
- IOPS (Input/Output Operations Per Second) — kecepatan baca/tulis disk
- CPU utilization — persentase penggunaan prosesor
- Memory usage — berapa banyak RAM yang terpakai

**Scalability diukur dengan:**
- Throughput — berapa banyak request yang bisa ditangani per detik (RPS/QPS)
- Concurrent users — berapa banyak pengguna bersamaan yang bisa dilayani
- Resource utilization — bagaimana penggunaan resource saat beban bertambah
- Cost per request — biaya infrastruktur per request yang diproses

### Percentile Latency (p50, p95, p99)

Dalam sistem production, kita tidak hanya melihat rata-rata (average), tapi juga percentile:

```
Contoh: 100 request dengan latency (ms):
  90 request: 10ms
  5 request:  50ms
  3 request:  100ms
  2 request:  500ms

p50 (median)  = 10ms   ← 50% request lebih cepat dari ini
p95           = 100ms  ← 95% request lebih cepat dari ini
p99           = 500ms  ← 99% request lebih cepat dari ini
Average       = ~18ms  ← Menipu! Terlihat cepat tapi ada yang 500ms
```

**Kenapa percentile penting?** Karena 1% request yang lambat bisa jadi 1000 pengguna yang frustrasi jika Anda punya 100.000 request per detik.

---

## Jenis Scalability

### 1. Vertical Scaling (Scale Up)

Menambah kapasitas **satu server** yang ada:
- Tambah RAM dari 4GB → 16GB
- Upgrade CPU dari 4 core → 16 core
- Ganti HDD → SSD → NVMe
- Upgrade network dari 1Gbps → 10Gbps

```
Sebelum:                    Sesudah:
┌──────────┐               ┌──────────────┐
│ Server   │               │ Server       │
│ 4GB RAM  │    ──────→    │ 16GB RAM     │
│ 4 Core   │               │ 16 Core      │
│ 100GB    │               │ 1TB NVMe     │
│ HDD      │               │              │
└──────────┘               └──────────────┘

Biaya: Rp 5 juta    →    Biaya: Rp 25 juta
```

**Kelebihan:**
- Sederhana, tidak perlu ubah arsitektur
- Tidak ada kompleksitas distributed system
- Tidak ada masalah konsistensi data
- Aplikasi tidak perlu diubah

**Kekurangan:**
- Ada batas maksimal (tidak bisa tambah RAM terus-menerus)
- Mahal (server besar harganya eksponensial, bukan linear)
- Single point of failure (jika server mati, semua mati)
- Downtime saat upgrade (harus matiin server)
- Vendor lock-in (tergantung hardware provider)

**Batas praktis vertical scaling (2026):**
- RAM: ~6TB (server kelas enterprise)
- CPU: ~128 core (single socket)
- Storage: ~100TB (dengan RAID)

### 2. Horizontal Scaling (Scale Out)

Menambah **jumlah server**:

```
Sebelum:                    Sesudah:
┌──────────┐               ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Server   │    ──────→    │ Server 1 │  │ Server 2 │  │ Server 3 │
│          │               └────┬─────┘  └────┬─────┘  └────┬─────┘
└──────────┘                    └─────────────┼─────────────┘
                                              │
                                       ┌──────┴──────┐
                                       │   Load       │
                                       │  Balancer    │
                                       └─────────────┘
```

**Kelebihan:**
- Hampir tidak ada batas (bisa tambah server terus)
- Lebih murah (banyak server kecil < 1 server besar)
- Lebih reliable (jika 1 server mati, yang lain jalan)
- Zero-downtime deployment (bisa update server satu per satu)
- Elastic scaling (otomatis tambah/kurang sesuai demand)

**Kekurangan:**
- Kompleks (butuh load balancer, sinkronisasi data, service discovery)
- Tidak semua aplikasi bisa di-scale horizontal
- Butuh arsitektur yang dirancang untuk distributed system
- Masalah konsistensi data (CAP theorem)
- Network overhead antar server

### 3. Functional Decomposition (Scale by Service)

Memecah aplikasi berdasarkan fungsi:

```
Monolith:                          Microservices:
┌─────────────────────┐            ┌─────────┐
│   Aplikasi          │            │  Auth   │
│   ┌───────────┐     │            └────┬────┘
│   │   Auth    │     │            ┌────┴────┐
│   ├───────────┤     │            │  Order  │
│   │   Order   │     │   ──────→  └────┬────┘
│   ├───────────┤     │            ┌────┴────┐
│   │  Payment  │     │            │ Payment │
│   ├───────────┤     │            └────┬────┘
│   │ Inventory │     │            ┌────┴────┐
│   └───────────┘     │            │Inventory│
└─────────────────────┘            └─────────┘
```

Setiap service bisa di-scale secara independen sesuai kebutuhan.

---

## Kapan Pakai yang Mana?

| Situasi | Pilih | Alasan |
|---|---|---|
| Aplikasi kecil, pengguna sedikit | Vertical | Sederhana, cukup, murah |
| Aplikasi tumbuh cepat | Horizontal | Bisa scale tanpa batas |
| Database utama | Vertical dulu | Database sulit di-scale horizontal |
| Web server / API | Horizontal | Mudah di-replicate, stateless |
| Traffic tidak terduga (spike) | Horizontal + Auto-scale | Bisa otomatis adjust |
| Budget terbatas | Vertical | 1 server kecil lebih murah awal |
| High availability wajib | Horizontal | Redundansi built-in |

---

## 📊 MEASURING PERFORMANCE

### Benchmarking

Benchmark adalah proses mengukur performa sistem secara terukur dan repeatable. Tanpa benchmark, Anda tidak tahu apakah perubahan yang Anda buat benar-benar memperbaiki performa atau justru memperburuk.

#### Jenis Benchmark

```
┌──────────────────────────────────────────────────────────┐
│                    JENIS BENCHMARK                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. Microbenchmark                                       │
│     └─ Mengukur 1 fungsi/method spesifik                 │
│     └─ Contoh: kecepatan sorting algorithm               │
│     └─ Tool: JMH (Java), pytest-benchmark (Python)       │
│                                                          │
│  2. Component Benchmark                                  │
│     └─ Mengukur 1 komponen sistem                        │
│     └─ Contoh: kecepatan query database                  │
│     └─ Tool: pgbench, sysbench                           │
│                                                          │
│  3. Application Benchmark                                │
│     └─ Mengukur aplikasi secara keseluruhan              │
│     └─ Contoh: response time API endpoint                │
│     └─ Tool: Apache JMeter, k6, Artillery                │
│                                                          │
│  4. System Benchmark                                     │
│     └─ Mengukur seluruh infrastruktur                    │
│     └─ Contoh: throughput seluruh cluster                │
│     └─ Tool: Locust, Gatling, custom load test           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### Contoh Benchmark Sederhana dengan k6

```javascript
// benchmark-api.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Ramp up ke 50 user
    { duration: '1m', target: 50 },    // Stay di 50 user
    { duration: '30s', target: 200 },  // Spike ke 200 user
    { duration: '1m', target: 200 },   // Stay di 200 user
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% request < 500ms
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
  },
};

export default function () {
  const res = http.get('https://api.sekolah.id/siswa');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  sleep(1);
}
```

### Profiling

Profiling adalah proses menganalisis **di mana** waktu dan resource dihabiskan oleh aplikasi.

#### CPU Profiling

```
CPU Profile - Aplikasi Kasir (10 detik sampling)
┌─────────────────────────────────────────────────────┐
│ Function                    │ Time    │ % Total     │
├─────────────────────────────────────────────────────┤
│ processPayment()            │ 3.2s    │ 32%         │
│   ├─ validateCard()         │ 1.8s    │ 18%         │
│   ├─ calculateTotal()       │ 0.8s    │ 8%          │
│   └─ sendReceipt()          │ 0.6s    │ 6%          │
│ generateReport()            │ 2.5s    │ 25%         │
│   ├─ queryDatabase()        │ 2.0s    │ 20% ← HOT!  │
│   └─ formatOutput()         │ 0.5s    │ 5%          │
│ handleUI()                  │ 1.8s    │ 18%         │
│ syncInventory()             │ 1.5s    │ 15%         │
│ logging()                   │ 1.0s    │ 10%         │
├─────────────────────────────────────────────────────┤
│ TOTAL                       │ 10.0s   │ 100%        │
└─────────────────────────────────────────────────────┘

Insight: queryDatabase() mengambil 20% total waktu.
Optimasi: Tambah index pada tabel yang di-query.
```

#### Memory Profiling

```
Memory Profile - Aplikasi Web
┌─────────────────────────────────────────────────────┐
│ Object Type              │ Count    │ Size (MB)     │
├─────────────────────────────────────────────────────┤
│ Session Objects          │ 5,000    │ 250 MB        │
│ Database Connections     │ 100      │ 50 MB         │
│ Cached Images            │ 2,000    │ 400 MB ← HOT! │
│ User Data Objects        │ 5,000    │ 100 MB        │
│ Log Buffers              │ 10       │ 20 MB         │
├─────────────────────────────────────────────────────┤
│ TOTAL                    │          │ 820 MB        │
└─────────────────────────────────────────────────────┘

Insight: Cached images memakan 400MB (49%).
Optimasi: Gunakan LRU cache dengan max 200MB.
```

### APM (Application Performance Monitoring)

Tool APM modern memberikan visibility real-time:

```
┌─────────────────────────────────────────────────────────┐
│              APM DASHBOARD (Real-time)                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Throughput: 1,247 req/sec  ▲ 12% vs kemarin           │
│  Latency p50: 45ms          ▼ 5%  vs kemarin           │
│  Latency p95: 180ms         ▲ 8%  vs kemarin ⚠️        │
│  Error Rate: 0.3%           ▼ 2%  vs kemarin           │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Top Slow Endpoints:                            │   │
│  │  1. POST /api/checkout    890ms (p95)           │   │
│  │  2. GET  /api/products    340ms (p95)           │   │
│  │  3. POST /api/login       210ms (p95)           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Database Query Time:                           │   │
│  │  SELECT * FROM orders WHERE...  450ms ⚠️        │   │
│  │  SELECT * FROM products WHERE... 120ms          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🏗️ SCALABILITY PATTERNS

### 1. Stateless Design

Prinsip: Server tidak menyimpan state (data sesi) di memory lokal. State disimpan di tempat terpusat (Redis, database).

```
Stateful (BURUK untuk scaling):         Stateless (BAIK untuk scaling):
┌──────────────────────────┐            ┌──────────────────────────┐
│  Server A                │            │  Server A                │
│  ├─ Session User1 ✓      │            │  ├─ (no session)         │
│  └─ Request User1 → OK   │            │  └─ Request User1 →      │
│                          │            │       ┌──────────────┐   │
│  Server B                │            │       │    Redis     │   │
│  ├─ (no Session User1)   │            │       │ Session User1│   │
│  └─ Request User1 → FAIL │            │       └──────────────┘   │
│                          │            │                          │
│  Problem: User HARUS ke  │            │  Server B                │
│  Server A selalu (sticky │            │  ├─ (no session)         │
│  session). Jika A mati,  │            │  └─ Request User1 →      │
│  user logout.            │            │       ┌──────────────┐   │
│                          │            │       │    Redis     │   │
│                          │            │       │ Session User1│   │
│                          │            │       └──────────────┘   │
│                          │            │                          │
│                          │            │  Manfaat: Request bisa   │
│                          │            │  ke server mana saja!    │
└──────────────────────────┘            └──────────────────────────┘
```

### 2. Partitioning (Sharding)

Memecah data besar menjadi bagian-bagian kecil yang bisa disimpan di server berbeda.

```
Database Tunggal (100 juta row):
┌───────────────────────────────────────┐
│              Database                  │
│  ┌─────────────────────────────────┐  │
│  │ Users: 100,000,000 rows         │  │
│  │ - Query scan: 500ms             │  │
│  │ - Index size: 2GB               │  │
│  │ - Backup time: 4 jam            │  │
│  └─────────────────────────────────┘  │
└───────────────────────────────────────┘

Sharded by User ID (4 shards):
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Shard 0  │  │ Shard 1  │  │ Shard 2  │  │ Shard 3  │
│ ID % 4=0 │  │ ID % 4=1 │  │ ID % 4=2 │  │ ID % 4=3 │
│ 25M rows │  │ 25M rows │  │ 25M rows │  │ 25M rows │
│ 50ms     │  │ 50ms     │  │ 50ms     │  │ 50ms     │
│ 500MB    │  │ 500MB    │  │ 500MB    │  │ 500MB    │
│ 1 jam    │  │ 1 jam    │  │ 1 jam    │  │ 1 jam    │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

Query jadi 10x lebih cepat! (500ms → 50ms)
```

**Strategi Sharding:**

| Strategi | Cara | Contoh | Cocok Untuk |
|---|---|---|---|
| Range-based | Berdasarkan range nilai | User ID 1-1M di Shard A | Data yang sering di-query per range |
| Hash-based | Hash(key) % N shards | MD5(user_id) % 4 | Distribusi merata |
| Directory-based | Lookup table | Tabel mapping user→shard | Fleksibel, bisa re-shard |
| Geo-based | Berdasarkan lokasi | User Asia → Shard Asia | Latency rendah per region |

### 3. Replication

Membuat copy data di beberapa server untuk redundancy dan read scaling.

```
Master-Slave Replication:
┌─────────────┐      Write      ┌─────────────┐
│   Client    │ ──────────────→ │   Master    │
│  (Write)    │                 │  (Primary)  │
└─────────────┘                 └──────┬──────┘
                                       │
                          ┌────────────┼────────────┐
                          │ Replicate │ Replicate   │
                          ▼           ▼             ▼
                    ┌──────────┐ ┌──────────┐ ┌──────────┐
                    │  Slave 1 │ │  Slave 2 │ │  Slave 3 │
                    │ (Read)   │ │ (Read)   │ │ (Read)   │
                    └──────────┘ └──────────┘ └──────────┘
                         ▲           ▲            ▲
                    ┌────┴─────┐ ┌───┴────┐ ┌────┴─────┐
                    │  Client  │ │ Client │ │  Client  │
                    │  (Read)  │ │ (Read) │ │  (Read)  │
                    └──────────┘ └────────┘ └──────────┘

Keuntungan:
- Write: 1 server (Master)
- Read: 3 server (Slave) = 3x read throughput
- Jika Master mati, 1 Slave jadi Master baru (failover)
```

**Jenis Replication:**

| Jenis | Sinkronisasi | Konsistensi | Latency | Use Case |
|---|---|---|---|---|
| Synchronous | Real-time, block sampai semua slave confirm | Strong | Tinggi | Financial, critical data |
| Asynchronous | Background, fire and forget | Eventual | Rendah | Social media, analytics |
| Semi-synchronous | Minimal 1 slave confirm | Balanced | Sedang | E-commerce, user data |

---

## ⚡ PERFORMANCE OPTIMIZATION TECHNIQUES

### 1. Caching

Menyimpan hasil komputasi/data yang sering diakses di tempat yang lebih cepat.

```
Tanpa Cache:                    Dengan Cache:
┌──────────────┐               ┌──────────────┐
│   Client     │               │   Client     │
└──────┬───────┘               └──────┬───────┘
       │                              │
       ▼                              ▼
┌──────────────┐               ┌──────────────┐
│   App Server │               │   App Server │
└──────┬───────┘               └──────┬───────┘
       │                              │
       ▼                    ┌─────────┴─────────┐
┌──────────────┐            ▼                   ▼
│   Database   │     ┌──────────┐        ┌──────────┐
│   (50ms)     │     │  Cache   │        │ Database │
│              │     │  (1ms)   │        │  (50ms)  │
│              │     │  HIT 90% │        │          │
└──────────────┘     └──────────┘        └──────────┘

Average latency tanpa cache: 50ms
Average latency dengan cache: (0.9 × 1ms) + (0.1 × 50ms) = 5.9ms
Improvement: 8.5x lebih cepat!
```

**Cache Levels:**

```
┌─────────────────────────────────────────────────────────┐
│                  CACHE HIERARCHY                         │
│                                                         │
│  Level 1: CPU Cache (L1/L2/L3)                         │
│  ├─ Speed: < 1ns                                        │
│  ├─ Size: KB - MB                                       │
│  └─ Contoh: CPU L3 cache                                │
│                                                         │
│  Level 2: In-Memory Cache (Application)                 │
│  ├─ Speed: 1-10ns                                       │
│  ├─ Size: MB - GB                                       │
│  └─ Contoh: HashMap, local cache                        │
│                                                         │
│  Level 3: Distributed Cache                             │
│  ├─ Speed: 1-5ms (network)                              │
│  ├─ Size: GB - TB                                       │
│  └─ Contoh: Redis, Memcached                            │
│                                                         │
│  Level 4: Database Cache                                │
│  ├─ Speed: 10-100ms                                     │
│  ├─ Size: TB+                                           │
│  └─ Contoh: Query cache, materialized view              │
│                                                         │
│  Level 5: CDN Cache                                     │
│  ├─ Speed: 10-50ms (edge location)                      │
│  ├─ Size: Unlimited                                     │
│  └─ Contoh: CloudFlare, CloudFront                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Cache Invalidation Strategies:**

| Strategi | Cara | Kapan Digunakan |
|---|---|---|
| TTL (Time To Live) | Data expire otomatis setelah X detik | Data yang berubah periodik |
| Write-through | Update cache + database bersamaan | Data yang harus selalu konsisten |
| Write-behind | Update cache dulu, database nanti (async) | Write-heavy, eventual consistency OK |
| Cache-aside | Baca dari cache, jika miss baca dari DB | Read-heavy, paling umum |
| Explicit invalidation | Hapus cache manual saat data berubah | Data yang jarang berubah |

### 2. Indexing

Index adalah struktur data yang mempercepat pencarian di database.

```
Tanpa Index (Full Table Scan):
┌─────────────────────────────────────┐
│  Table: siswa (10,000 rows)          │
│  Query: SELECT * FROM siswa          │
│         WHERE nisn = '12345'         │
│                                      │
│  Baris 1: NISN=00001 ❌             │
│  Baris 2: NISN=00002 ❌             │
│  Baris 3: NISN=00003 ❌             │
│  ...                                 │
│  Baris 12345: NISN=12345 ✓ ← FOUND! │
│  ...                                 │
│  Baris 10000: NISN=10000 ❌         │
│                                      │
│  Waktu: 10,000 baris diperiksa       │
│  ≈ 50ms                              │
└─────────────────────────────────────┘

Dengan Index (B-Tree):
┌─────────────────────────────────────┐
│  Index: nisn_idx (B-Tree)            │
│                                      │
│         [5000]                       │
│        /      \                      │
│    [2500]    [7500]                  │
│    /   \     /    \                  │
│  [12345] ... ... ...                 │
│     │                                │
│  Row 12345 ← FOUND!                  │
│                                      │
│  Waktu: log₂(10,000) ≈ 14 langkah   │
│  ≈ 1ms (50x lebih cepat!)            │
└─────────────────────────────────────┘
```

**Kapan membuat index:**
- Kolom yang sering di WHERE clause
- Kolom yang sering di JOIN
- Kolom yang sering di ORDER BY
- Kolom dengan banyak nilai unik (high cardinality)

**Kapan TIDAK membuat index:**
- Tabel kecil (< 1000 rows)
- Kolom yang jarang di-query
- Kolom dengan sedikit nilai unik (gender: L/P)
- Tabel yang sangat sering di-write (index memperlambat INSERT/UPDATE)

### 3. Connection Pooling

Membuat koneksi database baru itu MAHAL (handshake, autentikasi, alokasi memory). Connection pooling menjaga koneksi tetap terbuka dan bisa digunakan ulang.

```
Tanpa Connection Pooling:
┌──────────┐   ┌──────────┐
│ Request 1│──→│ Buat Koneksi (50ms)  │
│          │   │ Query (10ms)         │
│          │   │ Tutup Koneksi (20ms) │
│          │   │ Total: 80ms          │
└──────────┘   └──────────┘

┌──────────┐   ┌──────────┐
│ Request 2│──→│ Buat Koneksi (50ms)  │
│          │   │ Query (10ms)         │
│          │   │ Tutup Koneksi (20ms) │
│          │   │ Total: 80ms          │
└──────────┘   └──────────┘

Dengan Connection Pooling (pool size = 5):
┌──────────┐   ┌──────────────────────────────┐
│ Request 1│──→│ Ambil dari Pool (1ms)        │
│          │   │ Query (10ms)                 │
│          │   │ Kembalikan ke Pool (0ms)     │
│          │   │ Total: 11ms (7x lebih cepat!)│
└──────────┘   └──────────────────────────────┘

┌──────────┐   ┌──────────────────────────────┐
│ Request 2│──→│ Ambil dari Pool (1ms)        │
│          │   │ Query (10ms)                 │
│          │   │ Kembalikan ke Pool (0ms)     │
│          │   │ Total: 11ms                  │
└──────────┘   └──────────────────────────────┘

     ┌─────────────────────────────────┐
     │    Connection Pool (5 koneksi)   │
     │  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ │
     │  │ K1│ │ K2│ │ K3│ │ K4│ │ K5│ │
     │  └───┘ └───┘ └───┘ └───┘ └───┘ │
     └─────────────────────────────────┘
```

### 4. CDN (Content Delivery Network)

CDN menyimpan copy konten statis di server yang tersebar secara geografis, lebih dekat ke pengguna.

```
Tanpa CDN:
┌──────────┐
│  User    │  Jakarta
│  (Anda)  │
└────┬─────┘
     │
     │ 150ms (request ke server di Singapore)
     │
┌────┴─────┐
│  Server  │  Singapore
│  Origin  │
└──────────┘

Dengan CDN:
┌──────────┐
│  User    │  Jakarta
│  (Anda)  │
└────┬─────┘
     │
     │ 5ms (request ke CDN edge Jakarta)
     │
┌────┴─────┐
│ CDN Edge │  Jakarta
│  Cache   │  (cache hit: 95%)
└──────────┘

  (jika cache miss, CDN ambil dari origin)
  ┌─────────────────────────────────────┐
  │ CDN Edge Jakarta ──150ms──→ Origin  │
  │ (tapi user tidak merasakan ini)     │
  └─────────────────────────────────────┘
```

**Apa yang di-cache di CDN:**
- Gambar, CSS, JavaScript
- Video, font, dokumen
- API response yang jarang berubah
- Static website (JAMstack)

**Apa yang TIDAK di-cache di CDN:**
- Data personal (profile, saldo)
- Data yang berubah real-time
- API yang butuh autentikasi per-request

---

## 📐 CAPACITY PLANNING

Capacity planning adalah proses memperkirakan resource yang dibutuhkan di masa depan berdasarkan growth yang diproyeksikan.

### Back-of-the-Envelope Estimation

Teknik estimasi cepat menggunakan angka bulat untuk mendapatkan gambaran kasar kebutuhan infrastruktur.

#### Contoh 1: Website Sekolah

```
Asumsi:
- 500 siswa
- Masing-masing buka website 5x/hari
- Peak: 80% siswa buka dalam 1 jam (saat pengumuman)

Perhitungan:
- Total request/hari = 500 × 5 = 2,500 request
- Peak request/jam  = 2,500 × 0.8 = 2,000 request/jam
- Peak request/detik = 2,000 / 3,600 ≈ 0.56 req/sec

Kebutuhan server:
- 1 server kecil (1 core, 1GB RAM) bisa handle ~100 req/sec
- 0.56 req/sec << 100 req/sec
- Kesimpulan: 1 server kecil SUDAH CUKUP

Storage:
- 500 siswa × 10KB data = 5MB
- 365 hari × 100 log/hari × 1KB = 36.5MB
- Total: ~50MB << 10GB (disk minimal)
- Kesimpulan: Storage SUDAH CUKUP
```

#### Contoh 2: Aplikasi E-Commerce seperti Tokopedia

```
Asumsi:
- 10 juta pengguna aktif bulanan (MAU)
- Rata-rata 20 session/user/bulan
- Peak: Harbolnas, 10x traffic normal

Perhitungan:
- Session/bulan = 10M × 20 = 200M session
- Session/hari   = 200M / 30 ≈ 6.7M session
- Request/session = 20 request (rata-rata)
- Request/hari    = 6.7M × 20 ≈ 133M request
- Request/detik   = 133M / 86,400 ≈ 1,540 req/sec (normal)
- Request/detik   = 15,400 req/sec (peak Harbolnas)

Kebutuhan server:
- 1 web server handle ~1,000 req/sec
- Normal: 1,540 / 1,000 ≈ 2 server (tapi butuh redundancy → 4 server)
- Peak: 15,400 / 1,000 ≈ 16 server (auto-scale dari 4 → 16)

Database:
- Read:Write ratio = 10:1 (e-commerce kebanyakan browsing)
- Read req/sec = 15,400 × 10/11 ≈ 14,000 req/sec
- Write req/sec = 15,400 × 1/11 ≈ 1,400 req/sec
- 1 database handle ~5,000 read/sec
- Butuh: 14,000 / 5,000 ≈ 3 read replica + 1 master

Storage:
- 10M user × 10KB = 100GB (user data)
- 100M produk × 5KB = 500GB (produk data)
- 133M request/hari × 1KB log = 133GB/hari
- Total per hari: ~733GB
- Retensi 30 hari: 733GB × 30 ≈ 22TB
```

#### Tabel Angka Acuan (Reference Numbers)

```
┌─────────────────────────────────────────────────────────┐
│            REFERENCE NUMBERS (2026)                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  CPU:                                                   │
│  ├─ Sequential read:        500 MB/s (SSD)             │
│  ├─ Random read:            100K IOPS (NVMe)           │
│  └─ Context switch:         1-10 μs                    │
│                                                         │
│  Memory:                                                │
│  ├─ L1 cache access:        1 ns                       │
│  ├─ L2 cache access:        4 ns                       │
│  ├─ L3 cache access:        15 ns                      │
│  ├─ Main memory (RAM):      100 ns                     │
│  └─ SSD read:               100-200 μs                 │
│                                                         │
│  Network:                                               │
│  ├─ Same datacenter:        0.5 ms                     │
│  ├─ Regional (same country): 10-30 ms                  │
│  ├─ Cross-continental:      100-200 ms                 │
│  └─ Bandwidth:              1-10 Gbps (internal)       │
│                                                         │
│  Database:                                              │
│  ├─ Simple query (indexed): 1-5 ms                     │
│  ├─ Complex query:          50-500 ms                  │
│  ├─ Write (single):         5-20 ms                    │
│  └─ Connection setup:       20-50 ms                   │
│                                                         │
│  Cache:                                                 │
│  ├─ Redis GET:              0.5-1 ms                   │
│  ├─ Memcached GET:          0.2-0.5 ms                 │
│  └─ Local (in-memory):      < 0.001 ms                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 LOAD TESTING

Load testing adalah simulasi traffic real untuk memverifikasi apakah sistem bisa handle beban yang diharapkan.

### Jenis Testing

```
┌─────────────────────────────────────────────────────────┐
│              JENIS PERFORMANCE TESTING                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Load Testing                                        │
│     └─ Simulasi traffic normal yang diharapkan          │
│     └─ Tujuan: Verifikasi sistem handle beban normal    │
│     └─ Contoh: 1,000 concurrent users selama 10 menit   │
│                                                         │
│  2. Stress Testing                                      │
│     └─ Simulasi traffic DI ATAS normal                  │
│     └─ Tujuan: Cari breaking point sistem               │
│     └─ Contoh: Naikkan dari 1,000 → 10,000 users        │
│                                                         │
│  3. Spike Testing                                       │
│     └─ Lonjakan traffic tiba-tiba                       │
│     └─ Tujuan: Test auto-scaling dan recovery           │
│     └─ Contoh: 100 → 5,000 users dalam 10 detik         │
│                                                         │
│  4. Soak/Endurance Testing                              │
│     └─ Traffic normal dalam waktu LAMA                  │
│     └─ Tujuan: Deteksi memory leak, degradation         │
│     └─ Contoh: 1,000 users selama 24 jam                │
│                                                         │
│  5. Volume Testing                                      │
│     └─ Data dalam jumlah BESAR                          │
│     └─ Tujuan: Test performa dengan data besar          │
│     └─ Contoh: Database 1TB, 100M rows                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Load Testing dengan k6

```javascript
// load-test-sekolah.js
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metric untuk error rate
const errorRate = new Rate('errors');

export const options = {
  // Tahapan testing
  stages: [
    { duration: '2m', target: 100 },   // Ramp up: 0 → 100 users
    { duration: '5m', target: 100 },   // Load test: 100 users
    { duration: '2m', target: 500 },   // Spike: 100 → 500 users
    { duration: '5m', target: 500 },   // Peak load: 500 users
    { duration: '2m', target: 100 },   // Recovery: 500 → 100 users
    { duration: '5m', target: 100 },   // Post-spike: 100 users
    { duration: '2m', target: 0 },     // Ramp down
  ],
  // Thresholds (batas yang tidak boleh dilanggar)
  thresholds: {
    http_req_duration: [
      { threshold: 'p(50)<200', abortOnFail: false },  // p50 < 200ms
      { threshold: 'p(95)<500', abortOnFail: false },  // p95 < 500ms
      { threshold: 'p(99)<1000', abortOnFail: true },  // p99 < 1s (abort jika gagal)
    ],
    errors: ['rate<0.05'],  // Error rate < 5%
    http_req_failed: ['rate<0.01'],  // HTTP failure < 1%
  },
};

export default function () {
  // Scenario 1: Browse halaman utama
  group('Homepage', function () {
    const res = http.get('https://sekolah.id/');
    check(res, {
      'homepage status 200': (r) => r.status === 200,
      'homepage loads < 500ms': (r) => r.timings.duration < 500,
    }) || errorRate.add(1);
  });

  // Scenario 2: Login
  group('Login', function () {
    const payload = JSON.stringify({
      username: `user${__VU}`,
      password: 'password123',
    });
    const res = http.post('https://sekolah.id/api/login', payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    check(res, {
      'login status 200': (r) => r.status === 200,
      'login < 300ms': (r) => r.timings.duration < 300,
    }) || errorRate.add(1);
  });

  // Scenario 3: Lihat nilai
  group('View Grades', function () {
    const res = http.get('https://sekolah.id/api/nilai', {
      headers: { 'Authorization': `Bearer ${__VU}` },
    });
    check(res, {
      'grades status 200': (r) => r.status === 200,
      'grades < 400ms': (r) => r.timings.duration < 400,
    }) || errorRate.add(1);
  });

  sleep(1);  // Simulasi user berpikir 1 detik
}
```

### Interpreting Load Test Results

```
┌─────────────────────────────────────────────────────────┐
│              LOAD TEST RESULTS                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Scenario: Website Sekolah                              │
│  Duration: 21 menit                                     │
│  Virtual Users: 100 → 500 → 100                        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  METRICS SUMMARY                                │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  http_req_duration                              │   │
│  │    avg........... 145.32ms  ✓                   │   │
│  │    min............ 12.05ms                      │   │
│  │    med............ 98.45ms  ✓ (p50 < 200ms)    │   │
│  │    p(90)......... 312.67ms                      │   │
│  │    p(95)......... 423.18ms  ✓ (p95 < 500ms)    │   │
│  │    p(99)......... 891.23ms  ✓ (p99 < 1000ms)   │   │
│  │    max.......... 2341.56ms                      │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  http_reqs                                      │   │
│  │    total......... 125,432                       │   │
│  │    rate.......... 99.56/sec                     │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  errors                                         │   │
│  │    rate.......... 0.8%  ✓ (< 5%)               │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  http_req_failed                                │   │
│  │    rate.......... 0.2%  ✓ (< 1%)               │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  data_received                                  │   │
│  │    total......... 2.1 GB                        │   │
│  │    rate.......... 1.7 MB/s                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Status: ALL THRESHOLDS PASSED ✓                       │
│                                                         │
│  Insight:                                               │
│  - Sistem handle 500 concurrent users dengan baik      │
│  - p99 mendekati batas (891ms dari 1000ms)             │
│  - Pertimbangkan optimasi sebelum 1000 users           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🌏 CASE STUDIES: REAL-WORLD SCALING

### Case Study 1: Gojek

**Tantangan:**
Gojek memulai sebagai call center dengan 4 operator. Sekarang melayani jutaan pengguna di seluruh Asia Tenggara dengan puluhan layanan (GoRide, GoFood, GoSend, GoPay).

**Evolusi Arsitektur:**

```
Fase 1: Monolith (2010-2015)
┌─────────────────────────────────┐
│         1 Server LAMP           │
│  ┌───────────────────────────┐  │
│  │  PHP + MySQL              │  │
│  │  Semua fitur dalam 1 app  │  │
│  │  10K users                │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘

Fase 2: Service Decomposition (2015-2018)
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│  GoRide │  │ GoFood  │  │  GoPay  │  │ GoSend  │
│ Service │  │ Service │  │ Service │  │ Service │
└────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
     └─────────────┴────────────┴────────────┘
                      │
              ┌───────┴───────┐
              │  API Gateway  │
              └───────┬───────┘
                      │
              ┌───────┴───────┐
              │  Load Balancer│
              └───────────────┘

Fase 3: Microservices + Multi-Region (2018-sekarang)
┌──────────────────────────────────────────────────────┐
│                   500+ Microservices                  │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │Order│ │User │ │Pay  │ │Notif│ │Map  │ │Chat │...│
│  └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘   │
│     └───────┴───────┴───────┴───────┴───────┘       │
│                      │                               │
│  ┌───────────────────┼───────────────────┐           │
│  │     Service Mesh (Istio)              │           │
│  └───────────────────┼───────────────────┘           │
│                      │                               │
│  ┌─────────┐  ┌──────┴──────┐  ┌─────────┐          │
│  │ Jakarta │  │  Singapore  │  │ Bangkok │ ...       │
│  │ Region  │  │   Region    │  │ Region  │           │
│  └─────────┘  └─────────────┘  └─────────┘          │
└──────────────────────────────────────────────────────┘

Scale: Jutaan request/detik, 500+ services, multi-region
Tech: Kubernetes, Kafka, Redis, Cassandra, PostgreSQL
```

**Pelajaran dari Gojek:**
1. Mulai sederhana (monolith), pecah saat diperlukan
2. Invest di observability (logging, monitoring, tracing) sejak awal
3. Gunakan message queue (Kafka) untuk decouple services
4. Multi-region untuk redundancy dan latency rendah

### Case Study 2: Tokopedia

**Tantangan:**
Traffic melonjak 10-20x saat Harbolnas (Hari Belanja Online Nasional) dan 12.12. Sistem harus tetap stabil dan responsif.

**Strategi Scaling:**

```
┌─────────────────────────────────────────────────────────┐
│         TOKOPEDIA SCALING STRATEGY                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Auto-Scaling                                        │
│     └─ Normal: 200 instances                            │
│     └─ Harbolnas: 1,000+ instances (auto-scale)         │
│     └─ Scale up dimulai 2 minggu sebelum event          │
│                                                         │
│  2. Cache Agresif                                       │
│     └─ Produk populer di-cache di Redis                 │
│     └─ Cache hit ratio: 95%+                            │
│     └─ Halaman produk statis di-cache di CDN            │
│                                                         │
│  3. Database Sharding                                   │
│     └─ User data di-shard berdasarkan user_id           │
│     └─ Order data di-shard berdasarkan tanggal          │
│     └─ 50+ database shards                              │
│                                                         │
│  4. Rate Limiting                                       │
│     └─ Batasi request per user untuk prevent abuse      │
│     └─ Queue system untuk checkout saat peak            │
│                                                         │
│  5. Feature Flags                                       │
│     └─ Matikan fitur non-critical saat peak             │
│     └─ Review, recommendation, chat bisa di-disable     │
│                                                         │
│  6. Load Testing                                        │
│     └─ Simulasi Harbolnas 1 bulan sebelumnya            │
│     └─ Stress test sampai 3x traffic yang diharapkan    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Pelajaran dari Tokopedia:**
1. Auto-scaling butuh waktu — mulai scale up SEBELUM traffic naik
2. Cache adalah teman terbaik saat traffic spike
3. Feature flags memungkinkan graceful degradation
4. Load testing rutin sebelum event besar

### Case Study 3: WhatsApp

**Tantangan:**
WhatsApp melayani 2+ miliar pengguna dengan hanya ~200 engineer. Kuncinya: arsitektur yang sangat efisien.

**Arsitektur:**

```
┌─────────────────────────────────────────────────────────┐
│            WHATSAPP ARCHITECTURE                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Client (Mobile)                                        │
│       │                                                 │
│       │ WebSocket (persistent connection)               │
│       ▼                                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Erlang/BEAM VM                      │   │
│  │                                                  │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │  1 juta concurrent connections per server│   │   │
│  │  │  (Erlang lightweight process)            │   │   │
│  │  └──────────────────────────────────────────┘   │   │
│  │                                                  │   │
│  │  FreeBSD + Mnesia (distributed database)        │   │
│  └─────────────────────────────────────────────────┘   │
│       │                                                 │
│       ▼                                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Message Storage                     │   │
│  │                                                  │   │
│  │  - Pesan tidak disimpan di server (E2E encrypt) │   │
│  │  - Hanya store pesan yang belum terkirim        │   │
│  │  - Media (foto/video) di S3                     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Fakta Menarik:                                         │
│  - Sebelum diakuisisi Facebook (2014):                  │
│    450 juta users, 50 engineer, 32 server               │
│  - 1 server handle 1+ juta connections                  │
│  - Hanya 200 engineer untuk 2 miliar users              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Pelajaran dari WhatsApp:**
1. Pilih tech stack yang tepat (Erlang untuk concurrency tinggi)
2. Simpan hanya yang perlu disimpan (E2E encryption = less storage)
3. Efisiensi > fitur — fokus pada core functionality
4. Persistent connection (WebSocket) lebih efisien dari polling

---

## 💡 PRAKTIK

### Latihan 1: Identifikasi Masalah

Tentukan apakah ini masalah **performance** atau **scalability**:

1. Aplikasi loading 10 detik saat dibuka 1 orang
2. Aplikasi cepat saat 10 pengguna, tapi crash saat 1000 pengguna
3. Query database memakan waktu 5 detik
4. Server kehabisan memory saat ada 500 concurrent users
5. Halaman web butuh 8 detik untuk render di browser
6. API response time naik dari 50ms ke 500ms saat user bertambah

**Jawaban:**
1. **Performance** — lambat untuk 1 pengguna, optimasi kode/query
2. **Scalability** — tidak bisa handle banyak pengguna, perlu scale out
3. **Performance** — query lambat, optimasi dengan index
4. **Scalability** — resource tidak cukup untuk banyak pengguna
5. **Performance** — rendering lambat, optimasi frontend
6. **Scalability** — degradasi saat beban bertambah, perlu cache/load balancing

### Latihan 2: Back-of-the-Envelope Estimation

**Soal:** Anda membangun aplikasi absensi online untuk 1000 sekolah. Setiap sekolah punya 200 siswa. Absensi dilakukan 2x sehari (masuk dan pulang). Peak terjadi jam 7-8 pagi saat semua siswa absen bersamaan.

**Hitung:**
a) Berapa total request per hari?
b) Berapa request per detik saat peak?
c) Berapa server dibutuhkan jika 1 server handle 500 req/sec?
d) Berapa storage per tahun jika 1 record absensi = 500 bytes?

**Jawaban:**

```
a) Total request per hari:
   1000 sekolah × 200 siswa × 2 absen = 400,000 request/hari

b) Request per detik saat peak:
   Asumsi 60% absen dalam 1 jam (7:00-8:00)
   400,000 × 0.6 = 240,000 request dalam 1 jam
   240,000 / 3,600 detik = 66.7 req/sec

c) Server yang dibutuhkan:
   66.7 / 500 = 0.13 server
   → 1 server sudah cukup (dengan redundancy: 2 server)

d) Storage per tahun:
   400,000 record/hari × 500 bytes = 200 MB/hari
   200 MB × 365 hari = 73 GB/tahun
   → 100GB storage sudah cukup untuk 1 tahun
```

### Latihan 3: Desain Scaling Plan

**Soal:** Anda punya aplikasi kasir online dengan arsitektur berikut:
- 1 server (4GB RAM, 2 CPU core)
- 1 database MySQL (di server yang sama)
- 500 toko menggunakan aplikasi
- Traffic: 50,000 transaksi/hari
- Rencana: Expansi ke 50,000 toko dalam 2 tahun

**Buat rencana scaling bertahap:**

**Jawaban:**

```
FASE 1: Sekarang (500 toko, 50K transaksi/hari)
┌──────────────────────────────────────────────┐
│  Server: 1 unit (4GB RAM, 2 core)            │
│  Database: MySQL (same server)               │
│  Status: OK, utilization ~40%                │
└──────────────────────────────────────────────┘

FASE 2: 6 Bulan (5,000 toko, 500K transaksi/hari)
┌──────────────────────────────────────────────┐
│  ┌─────────────┐    ┌─────────────┐          │
│  │ App Server 1│    │ App Server 2│          │
│  │ (4GB, 2core)│    │ (4GB, 2core)│          │
│  └──────┬──────┘    └──────┬──────┘          │
│         └────────┬────────┘                  │
│              ┌───┴────┐                      │
│              │   LB   │                      │
│              └───┬────┘                      │
│                  │                           │
│         ┌────────┴────────┐                  │
│         │   MySQL Master  │                  │
│         │   (8GB, 4core)  │                  │
│         └─────────────────┘                  │
│                                              │
│  Perubahan:                                  │
│  - Pisahkan DB dari app server               │
│  - Tambah load balancer                      │
│  - 2 app server                              │
│  - Upgrade DB server                         │
└──────────────────────────────────────────────┘

FASE 3: 1 Tahun (20,000 toko, 2M transaksi/hari)
┌──────────────────────────────────────────────┐
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                │
│  │App1│ │App2│ │App3│ │App4│   (auto-scale)  │
│  └──┬─┘ └──┬─┘ └──┬─┘ └──┬─┘                │
│     └──────┴──────┴──────┘                   │
│                  │                           │
│         ┌────────┴────────┐                  │
│         │   Load Balancer │                  │
│         └────────┬────────┘                  │
│                  │                           │
│     ┌────────────┼────────────┐              │
│     ▼            ▼            ▼              │
│  ┌──────┐   ┌────────┐   ┌──────┐           │
│  │Master│──→│ Slave 1│   │Slave2│           │
│  │  DB  │   │ (Read) │   │(Read)│           │
│  └──────┘   └────────┘   └──────┘           │
│                                              │
│  ┌──────────────────────────────┐            │
│  │  Redis Cache (session, data) │            │
│  └──────────────────────────────┘            │
│                                              │
│  Perubahan:                                  │
│  - 4 app server dengan auto-scaling          │
│  - Master-slave DB replication               │
│  - Redis cache layer                         │
└──────────────────────────────────────────────┘

FASE 4: 2 Tahun (50,000 toko, 5M transaksi/hari)
┌──────────────────────────────────────────────┐
│  ┌───┐ 10x App Servers (auto-scale 10-50)   │
│  │LB │                                       │
│  └─┬─┘                                       │
│    │                                         │
│  ┌─┴─────────────────┐                       │
│  │  API Gateway      │                       │
│  │  + Rate Limiting  │                       │
│  └─┬─────────────────┘                       │
│    │                                         │
│  ┌─┴──────┐  ┌───────┐  ┌────────┐          │
│  │Service │  │Service│  │Service │          │
│  │ Trans  │  │  User │  │ Report │          │
│  └───┬────┘  └───┬───┘  └───┬────┘          │
│      │           │          │                │
│  ┌───┴───┐  ┌────┴───┐  ┌──┴────┐           │
│  │DB Shard│ │DB Shard│  │DB     │           │
│  │ (Trans)│ │ (User) │  │Replica│           │
│  └───────┘  └────────┘  └───────┘           │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  Redis Cluster + CDN + Kafka         │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  Perubahan:                                  │
│  - Microservices architecture                │
│  - Database sharding                         │
│  - Message queue (Kafka)                     │
│  - CDN untuk static content                  │
│  - Redis cluster                             │
└──────────────────────────────────────────────┘
```

### Latihan 4: Capacity Planning

**Soal:** Aplikasi video streaming untuk sekolah dengan 10,000 siswa. Setiap video 500MB. Setiap siswa menonton 2 video per minggu. Bandwidth server 1Gbps.

**Hitung:**
a) Berapa total storage untuk 1000 video?
b) Berapa bandwidth yang dibutuhkan saat peak (1000 siswa nonton bersamaan)?
c) Apakah 1Gbps cukup? Jika tidak, berapa yang dibutuhkan?

**Jawaban:**

```
a) Total storage:
   1000 video × 500MB = 500,000MB = 500GB
   → 1TB storage cukup (dengan buffer)

b) Bandwidth saat peak:
   1 video = 500MB, durasi ~30 menit = 1800 detik
   Bitrate per video = 500MB × 8 / 1800s = 2.22 Mbps
   1000 siswa × 2.22 Mbps = 2,220 Mbps = 2.22 Gbps

c) 1Gbps TIDAK cukup (butuh 2.22 Gbps)
   Solusi:
   - Upgrade ke 3Gbps bandwidth
   - ATAU gunakan CDN (lebih murah dan scalable)
   - ATAU compress video ke bitrate lebih rendah (1 Mbps)
     → 1000 × 1 Mbps = 1 Gbps (cukup!)
```

---

## ✅ CHECKLIST

- [ ] Bisa menjelaskan perbedaan performance vs scalability
- [ ] Paham analogi warung makan untuk kedua konsep
- [ ] Bisa mengidentifikasi masalah performance vs scalability
- [ ] Paham perbedaan vertical vs horizontal scaling
- [ ] Tahu kelebihan dan kekurangan masing-masing jenis scaling
- [ ] Bisa menentukan kapan pakai vertical vs horizontal scaling
- [ ] Paham cara mengukur performance (latency, throughput, percentile)
- [ ] Bisa melakukan back-of-the-envelope estimation
- [ ] Paham caching, indexing, connection pooling, dan CDN
- [ ] Bisa merencanakan capacity untuk sistem yang tumbuh
- [ ] Paham jenis-jenis load testing dan kapan menggunakannya
- [ ] Bisa merancang scaling plan bertahap untuk aplikasi

---

## 🔗 REFERENSI

- **Repo Asli:** [donnemartin/system-design-primer — Performance vs Scalability](https://github.com/donnemartin/system-design-primer#performance-vs-scalability)
- **Artikel:** [A word on scalability](http://www.allthingsdistributed.com/2006/03/a_word_on_scalability.html) — Werner Vogels (CTO Amazon)
- **Slide:** [Scalability, Availability, Stability, Patterns](http://www.slideshare.net/jboner/scalability-availability-stability-patterns/) — Jonas Boner (Akka founder)
- **Buku:** [Designing Data-Intensive Applications](https://dataintensive.net/) — Martin Kleppmann
- **Buku:** [The Art of Scalability](https://www.amazon.com/Art-Scalability-Scalability-Requirements-Companies/dp/0134031245) — Abbott & Fisher
- **Artikel:** [Gojek Tech Blog](https://blog.gojekengineering.com/) — Arsitektur dan scaling di Gojek
- **Artikel:** [Tokopedia Tech Blog](https://medium.com/tokopedia-engineering) — Engineering di Tokopedia
- **Artikel:** [WhatsApp Engineering](https://engineering.fb.com/category/production-engineering/) — Scaling WhatsApp di Facebook Engineering
- **Tool:** [k6 Load Testing](https://k6.io/) — Modern load testing tool
- **Tool:** [Apache JMeter](https://jmeter.apache.org/) — Load testing klasik
- **Tool:** [Locust](https://locust.io/) — Python-based load testing
- **Tool:** [Google Cloud TCO Calculator](https://cloud.google.com/products/calculator) — Capacity planning

---

> **Lanjut ke:** [`03-latency-vs-throughput.md`](./03-latency-vs-throughput.md)
