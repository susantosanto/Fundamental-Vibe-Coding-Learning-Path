# 21 — Ringkasan Fase 1: Arsitektur Dasar System Design

> **Estimasi:** 3 jam | **Level:** Semua
> **Sumber:** [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer)

---

## 📖 RINGKASAN KONSEP

### 21.1 Peta Perjalanan Fase 1

Fase 1 terdiri dari **21 modul** yang membangun fondasi system design secara bertahap. Berikut adalah peta perjalanan lengkap:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    PETA PERJALANAN FASE 1                                    │
│                    "Dari Nol ke System Design Foundation"                     │
└──────────────────────────────────────────────────────────────────────────────┘

  MODUL 1-4: FONDASI TEORIS
  ═════════════════════════
  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │ 01. Apa itu  │───▶│ 02. Perform  │───▶│ 03. Latency  │───▶│ 04. CAP      │
  │ System       │    │ vs           │    │ vs           │    │ Theorem      │
  │ Design       │    │ Scalability  │    │ Throughput   │    │ (C vs A vs P)│
  └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘

  MODUL 5-7: DATA & NETWORKING
  ════════════════════════════
  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │ 05. Konsis-  │───▶│ 06. Avail-   │───▶│ 07. DNS      │
  │ tensi Data   │    │ ability      │    │ (Domain Name │
  │ (Pattern)    │    │ Patterns     │    │  System)     │
  └──────────────┘    └──────────────┘    └──────────────┘

  MODUL 8-11: TRAFFIC MANAGEMENT
  ═══════════════════════════════
  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │ 08. CDN      │───▶│ 09. Load     │───▶│ 10. Reverse  │───▶│ 11. App      │
  │ (Content     │    │ Balancer     │    │ Proxy        │    │ Layer        │
  │  Delivery)   │    │              │    │              │    │              │
  └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘

  MODUL 12-15: DATA STORAGE & PROCESSING
  ═══════════════════════════════════════
  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │ 12. RDBMS    │───▶│ 13. NoSQL    │───▶│ 14. Cache    │───▶│ 15. Async    │
  │ (SQL DB)     │    │ Database     │    │ (Redis,      │    │ (Message     │
  │              │    │              │    │  Memcached)  │    │  Queue)      │
  └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘

  MODUL 16-17: COMMUNICATION & SECURITY
  ═══════════════════════════════════════
  ┌──────────────┐    ┌──────────────┐
  │ 16. Protokol │───▶│ 17. Keamanan │
  │ Komunikasi   │    │ Sistem       │
  │ (REST, gRPC, │    │ (Auth,       │
  │  GraphQL)    │    │  HTTPS, etc) │
  └──────────────┘    └──────────────┘

  MODUL 18-20: STUDI KASUS
  ════════════════════════
  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │ 18. Pastebin │───▶│ 19. Twitter  │───▶│ 20. Web      │
  │ (URL Short-  │    │ (Social      │    │ Crawler      │
  │  ener)       │    │  Media)      │    │              │
  └──────────────┘    └──────────────┘    └──────────────┘

  MODUL 21: RINGKASAN
  ═══════════════════
  ┌──────────────┐
  │ 21. Ringkasan│
  │ Fase 1 +     │
  │ Latihan Final│
  └──────────────┘
```

---

### 21.2 Ringkasan Per Modul

#### Modul 01: Apa itu System Design

**Konsep Kunci:**
- System design adalah proses mendefinisikan arsitektur, komponen, modul, interface, dan data untuk sebuah sistem agar memenuhi requirements yang ditentukan.
- Tujuannya: membangun sistem yang **scalable, reliable, maintainable, dan efficient**.
- Framework system design interview: Requirements → Capacity Estimation → High-Level Design → Deep Dive → Scaling.

**Takeaway:** System design bukan tentang kode, tapi tentang **trade-off** dan **keputusan arsitektur**.

---

#### Modul 02: Performance vs Scalability

**Konsep Kunci:**

| Aspek | Performance | Scalability |
|---|---|---|
| Definisi | Seberapa cepat sistem memproses 1 request | Seberapa baik sistem menangani peningkatan load |
| Fokus | Optimasi resource (CPU, memory, I/O) | Arsitektur (tambah server, load balancing) |
| Masalah | "Sistem lambat" | "Sistem crash saat traffic naik" |
| Solusi | Code optimization, caching, query tuning | Horizontal scaling, sharding, CDN |

**Takeaway:** Sistem bisa **performant tapi tidak scalable** (cepat untuk 1 user, crash untuk 1000 user). Sistem bisa **scalable tapi tidak performant** (handle banyak user tapi lambat). Kita butuh **keduanya**.

---

#### Modul 03: Latency vs Throughput

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│ LATENCY vs THROUGHPUT                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Latency = Waktu untuk menyelesaikan 1 request              │
│  - Diukur dalam milidetik (ms)                              │
│  - Contoh: API response time = 50ms                         │
│  - "Seberapa cepat?"                                        │
│                                                             │
│  Throughput = Jumlah request yang bisa diproses per detik   │
│  - Diukur dalam request per detik (RPS)                     │
│  - Contoh: Server handle 10,000 RPS                         │
│  - "Seberapa banyak?"                                       │
│                                                             │
│  Analogi Tol:                                               │
│  - Latency = Waktu 1 mobil dari A ke B                      │
│  - Throughput = Jumlah mobil yang lewat per jam             │
│                                                             │
│  Trade-off:                                                 │
│  - Batch processing ↑ throughput, ↑ latency                 │
│  - Parallel processing ↓ latency, ↑ throughput              │
│  - Caching ↓ latency, ↑ throughput                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** Optimasi untuk satu bisa mengorbankan yang lain. Pilih berdasarkan kebutuhan bisnis.

---

#### Modul 04: Availability vs Consistency (CAP Theorem)

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│ CAP THEOREM                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Dalam sistem terdistribusi, pilih 2 dari 3:                │
│                                                             │
│  C - Consistency: Semua node lihat data yang sama           │
│  A - Availability: Setiap request dapat response            │
│  P - Partition Tolerance: Sistem tetap jalan saat network   │
│      terputus antar node                                    │
│                                                             │
│  Karena P WAJIB (network pasti ada masalah),                │
│  kita harus pilih antara C atau A:                          │
│                                                             │
│  CP (Consistency + Partition Tolerance):                    │
│  - Saat network partition, sistem tolak request             │
│  - Contoh: Database banking, inventory system               │
│  - Teknologi: MongoDB, Redis, HBase                         │
│                                                             │
│  AP (Availability + Partition Tolerance):                   │
│  - Saat network partition, sistem tetap serve (data mungkin │
│    tidak terbaru)                                           │
│  - Contoh: Social media feed, DNS, CDN                      │
│  - Teknologi: Cassandra, DynamoDB, CouchDB                  │
│                                                             │
│  Untuk aplikasi sekolah:                                    │
│  - Data keuangan → CP (harus akurat)                        │
│  - Pengumuman → AP (lebih penting tersedia)                 │
│  - Absensi → CP (tidak boleh double)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** Tidak ada sistem yang sempurna. Pilih berdasarkan prioritas bisnis.

---

#### Modul 05: Konsistensi Data (Consistency Patterns)

**Konsep Kunci:**

| Pattern | Deskripsi | Use Case |
|---|---|---|
| **Strong Consistency** | Setelah write, semua read dapat data terbaru | Banking, inventory |
| **Eventual Consistency** | Data akan konsisten "pada akhirnya" | Social media, DNS |
| **Causal Consistency** | Operasi yang berhubungan urutannya terjaga | Chat, comment thread |
| **Read Your Writes** | User bisa baca data yang baru saja ditulis | User profile update |
| **Session Consistency** | Konsisten dalam satu session | Shopping cart |

**Takeaway:** Strong consistency mahal (slow, kurang available). Eventual consistency cepat tapi data bisa stale. Pilih berdasarkan kebutuhan.

---

#### Modul 06: Availability Patterns

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│ AVAILABILITY PATTERNS                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. FAIL-OVER                                               │
│     - Primary server down → backup server takeover          │
│     - Active-passive: backup standby                        │
│     - Active-active: semua server handle traffic            │
│                                                             │
│  2. REPLICATION                                             │
│     - Data direplikasi ke multiple node                     │
│     - Master-slave: write ke master, read dari slave        │
│     - Master-master: write ke semua node                    │
│                                                             │
│  3. HEALTH CHECK                                            │
│     - Monitor server secara berkala                         │
│     - Jika unhealthy → remove dari pool                     │
│     - Jika recovered → add kembali ke pool                  │
│                                                             │
│  4. REDUNDANCY                                              │
│     - Duplicate komponen kritis                             │
│     - No single point of failure                            │
│     - RAID untuk disk, NIC bonding untuk network            │
│                                                             │
│  Availability SLA:                                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ SLA      │ Downtime/tahun │ Downtime/bulan            │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ 99%      │ 3.65 hari      │ 7.3 jam                   │   │
│  │ 99.9%    │ 8.76 jam       │ 43.8 menit                │   │
│  │ 99.99%   │ 52.6 menit     │ 4.38 menit                │   │
│  │ 99.999%  │ 5.26 menit     │ 26.3 detik                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** High availability butuh redundancy dan failover. Setiap "nine" tambahan jauh lebih mahal.

---

#### Modul 07: DNS (Domain Name System)

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│ DNS RESOLUTION PROCESS                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User ketik: https://sdn1pasirhalang.sch.id                 │
│                                                             │
│  1. Browser cache → cek apakah IP sudah di-cache            │
│  2. OS cache → cek /etc/hosts atau DNS cache OS             │
│  3. Resolver DNS (ISP) → cek cache resolver                 │
│  4. Root DNS server → .sch.id nameserver                    │
│  5. TLD nameserver → sdn1pasirhalang.sch.id nameserver      │
│  6. Authoritative nameserver → IP address                   │
│  7. Cache result (sesuai TTL)                               │
│                                                             │
│  DNS Record Types:                                          │
│  - A: domain → IPv4 address                                 │
│  - AAAA: domain → IPv6 address                              │
│  - CNAME: alias → canonical name                            │
│  - MX: mail server                                          │
│  - TXT: text record (SPF, DKIM, verification)               │
│  - NS: nameserver                                           │
│  - SOA: start of authority                                  │
│                                                             │
│  DNS dalam System Design:                                   │
│  - DNS-based load balancing (GeoDNS)                        │
│  - CDN routing (DNS resolve ke edge terdekat)               │
│  - Failover (DNS update ke IP backup)                       │
│  - TTL: pendek = fleksibel, panjang = cache efisien         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** DNS adalah phonebook internet. DNS resolution bisa di-cached dan dioptimasi untuk routing traffic.

---

#### Modul 08: CDN (Content Delivery Network)

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│ CDN — CONTENT DELIVERY NETWORK                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Masalah: Server origin di Jakarta, user di Papua           │
│  → Latency tinggi (100ms+)                                  │
│  → Bandwidth mahal                                          │
│                                                             │
│  Solusi: CDN                                                │
│  - Edge server di seluruh Indonesia (Jakarta, Surabaya,     │
│    Medan, Makassar, Papua)                                  │
│  - Konten statis di-cache di edge server                    │
│  - User ambil dari edge terdekat (latency 10-20ms)          │
│                                                             │
│  Apa yang di-CDN-kan:                                       │
│  - Gambar, video, CSS, JavaScript                           │
│  - Download file (PDF, APK, installer)                      │
│  - Static HTML pages                                        │
│  - API response (jika cacheable)                            │
│                                                             │
│  CDN Provider:                                              │
│  - CloudFront (AWS), Cloudflare, Fastly, Akamai             │
│  - Indonesia: Biznet Gio, IDCloudHost                       │
│                                                             │
│  Cache Strategy:                                            │
│  - Cache-Control header (max-age, s-maxage)                 │
│  - ETag / Last-Modified (conditional request)               │
│  - Cache invalidation (purge, versioning)                   │
│  - TTL: gambar = 1 tahun, HTML = 5 menit                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** CDN mengurangi latency, menghemat bandwidth origin server, dan meningkatkan availability.

---

#### Modul 09: Load Balancer

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│ LOAD BALANCER                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Fungsi: Distribusi traffic ke multiple server              │
│                                                             │
│  Layer 4 (Transport):                                       │
│  - Berdasarkan IP dan port (TCP/UDP)                        │
│  - Lebih cepat, tidak inspect konten                        │
│  - Contoh: HAProxy (mode TCP), LVS                          │
│                                                             │
│  Layer 7 (Application):                                     │
│  - Berdasarkan HTTP header, URL, cookie                     │
│  - Bisa routing berdasarkan path (/api → server A)          │
│  - Bisa SSL termination                                     │
│  - Contoh: Nginx, HAProxy (mode HTTP), ALB                  │
│                                                             │
│  Algoritma Load Balancing:                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Algoritma      │ Cara Kerja          │ Use Case       │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Round Robin    │ Bergiliran          │ Server sama    │   │
│  │ Weighted RR    │ Berdasarkan weight  │ Server beda    │   │
│  │                │                     │ kapasitas      │   │
│  │ Least Conn     │ Kirim ke yang paling│ Request lama   │   │
│  │                │ sedikit koneksi     │ bervariasi     │   │
│  │ IP Hash        │ Berdasarkan IP      │ Session        │   │
│  │                │ client              │ persistence    │   │
│  │ Random         │ Random              │ Simple, cukup  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  Health Check:                                              │
│  - HTTP GET /health → 200 OK = healthy                      │
│  - Timeout / error = unhealthy → remove dari pool           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** Load balancer adalah pintu masuk traffic. Tanpa LB, tidak ada horizontal scaling.

---

#### Modul 10: Reverse Proxy

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│ REVERSE PROXY                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Forward Proxy: Client → Proxy → Internet                   │
│  (Client-side, untuk anonymity, bypass restriction)         │
│                                                             │
│  Reverse Proxy: Internet → Proxy → Server                   │
│  (Server-side, untuk protection, load balancing, caching)   │
│                                                             │
│  Fungsi Reverse Proxy:                                      │
│  1. Load balancing (distribusi ke backend server)           │
│  2. SSL termination (decrypt HTTPS di proxy)                │
│  3. Caching (simpan response yang sering diminta)           │
│  4. Compression (gzip response sebelum kirim ke client)     │
│  5. Security (hide backend IP, WAF, rate limiting)          │
│  6. Path-based routing (/api → service A, /web → service B) │
│  7. A/B testing (routing berdasarkan cookie/header)         │
│                                                             │
│  Tools: Nginx, HAProxy, Traefik, Envoy                      │
│                                                             │
│  Contoh Nginx Config:                                       │
│  ─────────────────────                                      │
│  server {                                                   │
│      listen 80;                                             │
│      location /api/ {                                       │
│          proxy_pass http://api_servers;                     │
│      }                                                      │
│      location / {                                           │
│          proxy_pass http://web_servers;                     │
│      }                                                      │
│  }                                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** Reverse proxy adalah "wajah" sistem — semua traffic masuk lewat sini sebelum ke backend.

---

#### Modul 11: Application Layer

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│ APPLICATION LAYER                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Monolith vs Microservices:                                 │
│  ─────────────────────────────                              │
│                                                             │
│  Monolith:                                                  │
│  - Satu codebase, satu deployment                           │
│  - Mudah develop dan debug                                  │
│  - Sulit scale per komponen                                 │
│  - Satu bug bisa down semua fitur                           │
│  - Cocok untuk: startup, tim kecil, MVP                     │
│                                                             │
│  Microservices:                                             │
│  - Banyak service kecil, independen deploy                  │
│  - Scale per service sesuai kebutuhan                       │
│  - Fault isolation (1 service down ≠ semua down)            │
│  - Kompleks: service discovery, distributed tracing,        │
│    network overhead                                         │
│  - Cocok untuk: tim besar, aplikasi kompleks, high scale    │
│                                                             │
│  Stateless vs Stateful:                                     │
│  ─────────────────────────────                              │
│  - Stateless: tidak simpan state di server (lebih mudah     │
│    scale, request independen)                               │
│  - Stateful: simpan state di server (session, cache lokal)  │
│  - Best practice: stateless application + external state    │
│    store (Redis, database)                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** Mulai dari monolith, pecah ke microservices saat dibutuhkan. Jangan over-engineer di awal.

---

#### Modul 12: Database RDBMS (SQL)

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│ RDBMS — RELATIONAL DATABASE                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Karakteristik:                                             │
│  - Data terstruktur dalam tabel                             │
│  - Schema ketat (kolom, tipe data, constraint)              │
│  - ACID compliant (Atomicity, Consistency, Isolation,       │
│    Durability)                                              │
│  - SQL untuk query                                          │
│  - Relasi antar tabel (foreign key, join)                   │
│                                                             │
│  Scaling:                                                   │
│  - Vertical: Upgrade RAM, CPU, SSD (mudah, ada limit)       │
│  - Read Replica: Master untuk write, replica untuk read     │
│  - Sharding: Pecah data berdasarkan key (user_id, region)   │
│  - Partitioning: Pecah tabel besar jadi bagian kecil        │
│                                                             │
│  Indexing:                                                  │
│  - B-Tree index: range query, sorting                       │
│  - Hash index: exact match                                  │
│  - Composite index: multiple kolom                          │
│  - Trade-off: Index mempercepat read, memperlambat write    │
│                                                             │
│  Tools: MySQL, PostgreSQL, MariaDB, Oracle, SQL Server      │
│                                                             │
│  Untuk aplikasi sekolah:                                    │
│  - Data siswa, guru, nilai → RDBMS (butuh integrity)        │
│  - Data keuangan BOS → RDBMS (butuh ACID)                   │
│  - Absensi → RDBMS (butuh consistency)                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** RDBMS untuk data yang butuh consistency, integrity, dan relational query.

---

#### Modul 13: Database NoSQL

**Konsep Kunci:**

| Tipe | Contoh | Use Case | Karakteristik |
|---|---|---|---|
| **Key-Value** | Redis, DynamoDB | Cache, session, config | Super cepat, simple |
| **Document** | MongoDB, CouchDB | Content, catalog, profile | Flexible schema, JSON |
| **Column-Family** | Cassandra, HBase | Time series, analytics | Write-heavy, scale horizontal |
| **Graph** | Neo4j, Dgraph | Social network, recommendation | Relasi kompleks |

**Takeaway:** NoSQL untuk data yang butuh flexibility, high write throughput, atau horizontal scaling.

---

#### Modul 14: Cache

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│ CACHING STRATEGY                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Kenapa Cache?                                              │
│  - Memory (RAM) 1000x lebih cepat dari disk                 │
│  - Mengurangi load ke database                              │
│  - Mengurangi latency response                              │
│                                                             │
│  Cache Patterns:                                            │
│  ───────────────                                            │
│  1. Cache-Aside (Lazy Loading):                             │
│     - App cek cache → miss → query DB → simpan ke cache     │
│     - Paling umum, sederhana                                │
│                                                             │
│  2. Write-Through:                                          │
│     - Write ke cache DAN DB bersamaan                        │
│     - Data selalu konsisten, write lebih lambat             │
│                                                             │
│  3. Write-Behind (Write-Back):                              │
│     - Write ke cache dulu, async ke DB nanti                │
│     - Write sangat cepat, risiko data loss                  │
│                                                             │
│  4. Write-Around:                                           │
│     - Write langsung ke DB, tidak ke cache                  │
│     - Cache hanya untuk read-heavy data                     │
│                                                             │
│  Cache Eviction:                                            │
│  ─────────────────                                          │
│  - LRU (Least Recently Used): hapus yang paling lama tidak  │
│    diakses                                                  │
│  - LFU (Least Frequently Used): hapus yang paling jarang    │
│    diakses                                                  │
│  - TTL (Time To Live): hapus setelah waktu tertentu         │
│  - Random: hapus random                                     │
│                                                             │
│  Cache Stampede (Thundering Herd):                          │
│  ─────────────────────────────────                          │
│  - Cache expire → banyak request bersamaan ke DB            │
│  - Solusi:                                                  │
│    - Request coalescing (1 request ke DB, yang lain tunggu) │
│    - Probabilistic early expiration                         │
│    - Lock per key                                           │
│                                                             │
│  Tools: Redis, Memcached, Varnish, CDN cache                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** Cache adalah optimasi paling efektif untuk read-heavy workload. Tapi butuh strategi invalidasi yang tepat.

---

#### Modul 15: Asynchronism

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│ ASYNCHRONISM — MESSAGE QUEUE                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Kapan Pakai Async?                                         │
│  - Proses lama (> 1 detik): generate PDF, kirim email       │
│  - Proses tidak blocking user: analytics, logging           │
│  - Proses bisa di-retry: payment, notification              │
│  - Decouple service: service A tidak perlu tunggu service B │
│                                                             │
│  Message Queue Pattern:                                     │
│  ─────────────────────────                                  │
│  [Producer] → [Queue] → [Consumer]                          │
│                                                             │
│  Producer: kirim pesan ke queue                             │
│  Queue: simpan pesan sampai diambil                         │
│  Consumer: ambil dan proses pesan                           │
│                                                             │
│  Queue Types:                                               │
│  ───────────                                                │
│  1. Task Queue (Celery, Bull):                              │
│     - Background job processing                             │
│     - Retry, scheduling, rate limiting                      │
│                                                             │
│  2. Message Broker (RabbitMQ, Kafka):                       │
│     - Event streaming                                       │
│     - Pub/sub pattern                                       │
│     - High throughput                                       │
│                                                             │
│  3. Stream Processing (Kafka Streams, Flink):               │
│     - Real-time data processing                             │
│     - Windowed aggregation                                  │
│     - Stateful processing                                   │
│                                                             │
│  Delivery Guarantee:                                        │
│  ──────────────────────                                     │
│  - At most once: pesan bisa hilang                          │
│  - At least once: pesan bisa duplikat                       │
│  - Exactly once: pesan pasti sekali (paling kompleks)       │
│                                                             │
│  Tools: RabbitMQ, Kafka, Redis Streams, AWS SQS, Celery     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** Async untuk proses yang tidak perlu blocking user. Message queue memastikan pesan tidak hilang.

---

#### Modul 16: Protokol Komunikasi

**Konsep Kunci:**

| Protokol | Tipe | Use Case | Kelebihan | Kekurangan |
|---|---|---|---|---|
| **REST** | Sync, HTTP | CRUD API, web service | Simple, universal, cacheable | Over-fetching, multiple roundtrip |
| **GraphQL** | Sync, HTTP | Complex query, mobile | Exact data, single endpoint | Complex, caching sulit |
| **gRPC** | Sync, HTTP/2 | Microservices, internal | Fast, typed, streaming | Browser support terbatas |
| **WebSocket** | Async, TCP | Real-time, chat, live update | Bidirectional, low latency | Stateful, scaling kompleks |
| **Server-Sent Events** | Async, HTTP | Live feed, notification | Simple, HTTP-based | Unidirectional (server→client) |

**Takeaway:** Pilih protokol berdasarkan kebutuhan. REST untuk umum, WebSocket untuk real-time, gRPC untuk internal service.

---

#### Modul 17: Keamanan Sistem

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│ SECURITY LAYERS                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: Network Security                                  │
│  - HTTPS/TLS (enkripsi data in transit)                     │
│  - Firewall (batasi akses port)                             │
│  - VPC (isolasi network)                                    │
│  - DDoS protection (Cloudflare, AWS Shield)                 │
│                                                             │
│  Layer 2: Application Security                              │
│  - Input validation (sanitize semua input)                  │
│  - SQL injection prevention (parameterized query)           │
│  - XSS prevention (escape output)                           │
│  - CSRF protection (token)                                  │
│  - Rate limiting (anti brute force)                         │
│                                                             │
│  Layer 3: Authentication & Authorization                    │
│  - Authentication: siapa Anda? (JWT, OAuth, session)        │
│  - Authorization: apa yang boleh Anda lakukan? (RBAC, ABAC) │
│  - Password: hash dengan bcrypt/argon2 (JANGAN plaintext)   │
│  - MFA: multi-factor authentication                         │
│                                                             │
│  Layer 4: Data Security                                     │
│  - Encryption at rest (AES-256)                             │
│  - Encryption in transit (TLS 1.3)                          │
│  - Backup terenkripsi                                       │
│  - Data masking untuk sensitive data                        │
│                                                             │
│  Layer 5: Monitoring & Audit                                │
│  - Security logging (semua akses tercatat)                  │
│  - Anomaly detection                                       │
│  - Regular security audit                                   │
│  - Vulnerability scanning                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** Security adalah berlapis. Satu layer jebol, layer lain masih melindungi.

---

#### Modul 18: Studi Kasus Pastebin

**Konsep Kunci:**
- URL shortener / paste service adalah studi kasus system design paling sederhana
- Fokus: unique ID generation, read-heavy workload, TTL-based expiration
- Database: key-value store (Redis untuk cache, SQL untuk persistence)
- API: POST /create, GET /{key}, GET /{key}/raw
- Scaling: CDN untuk read, hash-based routing untuk write

**Takeaway:** Mulai dari yang sederhana. Pastebin mengajarkan fondasi: API design, database choice, caching, dan scaling dasar.

---

#### Modul 19: Studi Kasus Twitter

**Konsep Kunci:**
- Social media feed adalah masalah **fan-out**: bagaimana mendistribusikan tweet ke follower
- 3 strategi fan-out: Push (on write), Pull (on read), Hybrid
- Hybrid adalah yang terbaik: push untuk user biasa, pull untuk celebrity
- Polyglot persistence: SQL (user, tweet), NoSQL (timeline), Cache (Redis), Search (Elasticsearch)
- Async fan-out via Kafka untuk handle scale

**Takeaway:** Fan-out pattern adalah inti dari social media. Trade-off antara read speed dan write speed menentukan arsitektur.

---

#### Modul 20: Studi Kasus Web Crawler

**Konsep Kunci:**
- Web crawler adalah distributed system yang menjelajahi graph (web)
- Pipeline: URL Frontier → DNS → Fetch → Parse → Extract → Store → Repeat
- Politeness adalah kritis: robots.txt, rate limiting, tidak overload server
- Deduplication: Bloom Filter (URL), SimHash/MinHash (content)
- Freshness vs comprehensiveness: trade-off antara update sering vs crawl banyak

**Takeaway:** Web crawler mengajarkan distributed processing, graph traversal, dan etika crawling.

---

### 21.3 Knowledge Map — Hubungan Antar Konsep

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE MAP — FASE 1                                    │
│                    "Semua Konsep Terhubung"                                  │
└──────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │   SYSTEM DESIGN     │
                    │   (Modul 01)        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
     │ PERFORMANCE  │  │ SCALABILITY  │  │ RELIABILITY  │
     │ (Modul 02,03)│  │ (Modul 02)   │  │ (Modul 04,06)│
     └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
            │                 │                 │
            │          ┌──────┴──────┐          │
            │          │             │          │
            ▼          ▼             ▼          ▼
     ┌──────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐
     │  Cache   │ │  Load  │ │   CDN    │ │ Failover │
     │ (Mod 14) │ │Balancer│ │ (Mod 08) │ │ (Mod 06) │
     └────┬─────┘ │(Mod 09)│ └────┬─────┘ └────┬─────┘
          │       └───┬────┘      │            │
          │           │           │            │
          ▼           ▼           ▼            ▼
     ┌──────────────────────────────────────────────────┐
     │              REVERSE PROXY (Modul 10)            │
     │         (Pintu masuk semua traffic)              │
     └──────────────────────┬───────────────────────────┘
                            │
                            ▼
     ┌──────────────────────────────────────────────────┐
     │            APPLICATION LAYER (Modul 11)          │
     │     (Monolith / Microservices / Stateless)       │
     └──────────────────────┬───────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
     ┌──────────────┐ ┌──────────┐ ┌──────────────┐
     │  RDBMS       │ │  NoSQL   │ │   Async      │
     │  (Modul 12)  │ │(Modul 13)│ │  (Modul 15)  │
     └──────┬───────┘ └────┬─────┘ └──────┬───────┘
            │              │              │
            │              │              │
            ▼              ▼              ▼
     ┌──────────────────────────────────────────────────┐
     │         PROTOKOL KOMUNIKASI (Modul 16)           │
     │      (REST, GraphQL, gRPC, WebSocket)            │
     └──────────────────────┬───────────────────────────┘
                            │
                            ▼
     ┌──────────────────────────────────────────────────┐
     │            KEAMANAN SISTEM (Modul 17)            │
     │    (HTTPS, Auth, Validation, Encryption)         │
     └──────────────────────────────────────────────────┘


  HUBUNGAN ANTAR KONSEP:
  ══════════════════════

  DNS (07) → CDN (08) → Load Balancer (09) → Reverse Proxy (10)
  "Traffic mengalir dari internet ke server"

  Performance (02) + Scalability (02) → dicapai dengan:
    Cache (14) + CDN (08) + Load Balancer (09) + Async (15)

  CAP Theorem (04) → mempengaruhi pilihan:
    RDBMS (12) → CP (consistency)
    NoSQL (13) → AP (availability)

  Consistency Patterns (05) → mempengaruhi:
    Cache strategy (14): write-through vs cache-aside
    Database choice (12, 13): SQL vs NoSQL

  Availability Patterns (06) → dicapai dengan:
    Load Balancer (09) + Replication (12) + Failover

  Semua studi kasus (18, 19, 20) → menerapkan SEMUA konsep di atas
```

---

### 21.4 Self-Assessment Quiz (25 Soal)

#### Bagian A: Konsep Dasar (Soal 1-8)

**Soal 1:** Apa perbedaan antara performance dan scalability?
<details>
<summary>Jawaban</summary>

**Performance** = seberapa cepat sistem memproses satu request (optimasi resource). **Scalability** = seberapa baik sistem menangani peningkatan load (tambah server, arsitektur). Sistem bisa performant tapi tidak scalable, dan sebaliknya.
</details>

**Soal 2:** Jelaskan perbedaan latency dan throughput dengan analogi.
<details>
<summary>Jawaban</summary>

**Latency** = waktu 1 mobil dari A ke B. **Throughput** = jumlah mobil yang lewat per jam. Di jalan tol: latency rendah = mobil cepat sampai, throughput tinggi = banyak mobil lewat.
</details>

**Soal 3:** Apa itu CAP Theorem? Mengapa Partition Tolerance wajib?
<details>
<summary>Jawaban</summary>

CAP Theorem: dalam sistem terdistribusi, pilih 2 dari 3 — Consistency, Availability, Partition Tolerance. **P wajib** karena dalam sistem terdistribusi, network partition (koneksi terputus antar node) pasti terjadi suatu saat. Jadi kita harus pilih antara C atau A.
</details>

**Soal 4:** Kapan pakai CP vs AP? Berikan contoh.
<details>
<summary>Jawaban</summary>

**CP** (Consistency + Partition Tolerance): saat data harus akurat — banking, inventory, absensi. **AP** (Availability + Partition Tolerance): saat lebih penting sistem selalu tersedia — social media feed, DNS, CDN.
</details>

**Soal 5:** Apa perbedaan strong consistency dan eventual consistency?
<details>
<summary>Jawaban</summary>

**Strong consistency**: setelah write, semua read langsung dapat data terbaru (lambat, kurang available). **Eventual consistency**: data akan konsisten "pada akhirnya" (cepat, lebih available, tapi data bisa stale sementara).
</details>

**Soal 6:** Apa itu horizontal vs vertical scaling?
<details>
<summary>Jawaban</summary>

**Vertical scaling** = upgrade 1 server (tambah RAM, CPU, SSD). Mudah tapi ada limit fisik. **Horizontal scaling** = tambah banyak server. Lebih scalable tapi butuh load balancer dan arsitektur terdistribusi.
</details>

**Soal 7:** Apa itu read replica? Kapan digunakan?
<details>
<summary>Jawaban</summary>

**Read replica** = copy database yang hanya untuk read. Write tetap ke master. Digunakan saat read >> write (read-heavy workload) untuk mengurangi load master dan meningkatkan read throughput.
</details>

**Soal 8:** Apa itu sharding? Apa bedanya dengan replication?
<details>
<summary>Jawaban</summary>

**Sharding** = memecah data menjadi bagian-bagian (shard) yang disimpan di server berbeda. Setiap shard punya data berbeda. **Replication** = copy data yang sama ke multiple server. Sharding untuk scale write, replication untuk scale read dan availability.
</details>

---

#### Bagian B: Komponen Sistem (Soal 9-16)

**Soal 9:** Apa fungsi Load Balancer? Sebutkan 3 algoritma load balancing.
<details>
<summary>Jawaban</summary>

Load Balancer mendistribusikan traffic ke multiple server. 3 algoritma: **Round Robin** (bergiliran), **Least Connection** (kirim ke server dengan koneksi paling sedikit), **IP Hash** (berdasarkan IP client untuk session persistence).
</details>

**Soal 10:** Apa perbedaan CDN dan Reverse Proxy?
<details>
<summary>Jawaban</summary>

**CDN** = network edge server global untuk cache konten statis, mengurangi latency geografis. **Reverse Proxy** = server di depan backend untuk load balancing, SSL termination, routing. CDN fokus pada distribusi geografis, reverse proxy fokus pada manajemen traffic server.
</details>

**Soal 11:** Kapan pakai Redis vs Memcached?
<details>
<summary>Jawaban</summary>

**Redis**: butuh data structure (list, set, sorted set, hash), persistence, pub/sub, replication. **Memcached**: hanya need simple key-value cache, multi-threaded, lebih cepat untuk pure caching. Redis lebih versatile, Memcached lebih simple dan cepat untuk use case dasar.
</details>

**Soal 12:** Apa itu cache stampede dan bagaimana mencegahnya?
<details>
<summary>Jawaban</summary>

**Cache stampede** = saat cache expire, banyak request bersamaan langsung ke database. Pencegahan: **request coalescing** (1 request ke DB, yang lain tunggu), **probabilistic early expiration** (refresh cache sebelum expire dengan probabilitas), **lock per key**.
</details>

**Soal 13:** Kapan pakai message queue? Sebutkan 3 use case.
<details>
<summary>Jawaban</summary>

Pakai message queue saat proses tidak perlu blocking user. Use case: **1)** Generate PDF/laporan (proses lama), **2)** Kirim email/notification (async), **3)** Fan-out tweet ke follower (Twitter), **4)** Analytics processing (tidak blocking).
</details>

**Soal 14:** Apa perbedaan REST dan GraphQL?
<details>
<summary>Jawaban</summary>

**REST**: multiple endpoint, fixed response, bisa over/under-fetching, cacheable, simple. **GraphQL**: single endpoint, client tentukan data yang dibutuhkan, exact data, tapi caching lebih kompleks dan query bisa sangat berat.
</details>

**Soal 15:** Apa itu circuit breaker pattern?
<details>
<summary>Jawaban</summary>

**Circuit breaker** = pattern untuk mencegah cascading failure. Jika service downstream error > threshold, circuit breaker OPEN (stop call, return error/cached). Setelah timeout, HALF-OPEN (test 1 request). Jika sukses, CLOSE (normal kembali).
</details>

**Soal 16:** Bagaimana cara mencegah SQL injection?
<details>
<summary>Jawaban</summary>

Gunakan **parameterized query** (prepared statements), jangan concat string SQL. Gunakan ORM. Validasi dan sanitize input. Principle of least privilege untuk database user.
</details>

---

#### Bagian C: Studi Kasus (Soal 17-25)

**Soal 17:** Dalam desain Twitter, apa itu fan-out on write?
<details>
<summary>Jawaban</summary>

**Fan-out on write** (push model): saat user tweet, sistem langsung mengirim tweet_id ke timeline cache semua follower. Read timeline jadi sangat cepat (tinggal baca cache), tapi write lambat untuk user dengan banyak follower.
</details>

**Soal 18:** Kenapa Twitter pakai hybrid fan-out?
<details>
<summary>Jawaban</summary>

Karena **celebrity problem**: user dengan jutaan follower tidak bisa di-push ke semua follower (terlalu banyak write). Solusi: push untuk user biasa (follower sedikit), pull untuk celebrity (follower banyak). Timeline = merge dari cache (push) + celebrity tweets (pull).
</details>

**Soal 19:** Dalam web crawler, apa itu URL frontier?
<details>
<summary>Jawaban</summary>

**URL frontier** = priority queue yang menentukan URL mana yang akan di-crawl berikutnya. Memprioritaskan berdasarkan PageRank, freshness, domain authority, dan change frequency. Juga enforce politeness (rate limit per domain).
</details>

**Soal 20:** Bagaimana web crawler mendeteksi halaman duplikat?
<details>
<summary>Jawaban</summary>

**URL deduplication**: normalisasi URL + Bloom Filter. **Content deduplication**: SimHash (near-duplicate, Hamming distance) atau MinHash (Jaccard similarity). SimHash untuk Google-scale, MinHash untuk similarity estimation.
</details>

**Soal 21:** Apa itu Bloom Filter dan kenapa dipakai di web crawler?
<details>
<summary>Jawaban</summary>

**Bloom Filter** = struktur data probabilistic untuk cek membership. "Mungkin sudah ada" atau "pasti belum ada". Hemat memory (1 miliar URL ≈ 1.2 GB vs 32 GB untuk hash set). Dipakai untuk seen-URL check di crawler. Trade-off: ada false positive (1%).
</details>

**Soal 22:** Bagaimana Pastebin handle URL collision?
<details>
<summary>Jawaban</summary>

Gunakan **unique ID generation**: auto-increment (tapi predictable), UUID (tidak predictable tapi panjang), atau base62 encoding dari auto-increment (pendek, tidak terlalu predictable). Atau generate random string dan cek collision di database.
</details>

**Soal 23:** Dalam desain Twitter, database apa yang dipakai untuk apa?
<details>
<summary>Jawaban</summary>

**MySQL/PostgreSQL**: user data, tweet data, follow relationship (butuh consistency dan relational integrity). **Cassandra/DynamoDB**: user tweet timeline (high write throughput, horizontal scaling). **Redis**: timeline cache, session, follow graph cache. **Elasticsearch**: search index untuk tweet. **S3/GCS**: media storage (foto, video).
</details>

**Soal 24:** Bagaimana web crawler handle JavaScript-rendered content?
<details>
<summary>Jawaban</summary>

3 pendekatan: **1)** Headless browser (Puppeteer, Playwright) — render seperti browser asli, tapi lambat dan resource-heavy. **2)** Hybrid — tradisional untuk halaman statis, headless hanya untuk yang butuh JS. **3)** API discovery — temukan API endpoint yang dipakai website, langsung call API (JSON).
</details>

**Soal 25:** Apa itu politeness policy dalam web crawling?
<details>
<summary>Jawaban</summary>

**Politeness policy** = etika crawling: hormati robots.txt, rate limit per domain (max 1 req/detik), crawl-delay, tidak overload server target, crawl di jam sepi. Tujuannya: tidak merusak server target dan tidak di-block.
</details>

---

### 21.5 Persiapan Checklist untuk Fase 2

Sebelum lanjut ke **Fase 2: AI Tools Dasar**, pastikan Anda menguasai semua konsep Fase 1:

#### A. Pemahaman Teoritis

- [ ] Bisa menjelaskan perbedaan performance vs scalability dengan contoh
- [ ] Bisa menjelaskan latency vs throughput dengan analogi
- [ ] Bisa menjelaskan CAP Theorem dan kapan pakai CP vs AP
- [ ] Bisa menjelaskan 5 consistency patterns dan use case masing-masing
- [ ] Bisa menjelaskan availability patterns (failover, replication, health check)
- [ ] Bisa menjelaskan DNS resolution process dari awal sampai akhir
- [ ] Bisa menjelaskan cara kerja CDN dan kapan menggunakannya
- [ ] Bisa menjelaskan load balancing algorithms dan perbedaannya
- [ ] Bisa menjelaskan fungsi reverse proxy vs forward proxy
- [ ] Bisa menjelaskan trade-off monolith vs microservices
- [ ] Bisa menjelaskan kapan pakai SQL vs NoSQL
- [ ] Bisa menjelaskan cache patterns (cache-aside, write-through, write-behind)
- [ ] Bisa menjelaskan kapan pakai message queue dan pattern-nya
- [ ] Bisa menjelaskan perbedaan REST, GraphQL, gRPC, WebSocket
- [ ] Bisa menjelaskan security layers (network, app, auth, data, monitoring)

#### B. Kemampuan Desain

- [ ] Bisa gambar arsitektur high-level untuk aplikasi web sederhana
- [ ] Bisa melakukan capacity estimation (traffic, storage, bandwidth)
- [ ] Bisa mendesain database schema (SQL dan NoSQL)
- [ ] Bisa mendesain RESTful API endpoints
- [ ] Bisa menentukan strategi caching yang tepat
- [ ] Bisa menentukan kapan perlu async/message queue
- [ ] Bisa mendesain scaling strategy (vertical → horizontal → distributed)
- [ ] Bisa mengidentifikasi single point of failure dan solusinya

#### C. Studi Kasus

- [ ] Paham desain Pastebin/URL Shortener (key-value, unique ID, TTL)
- [ ] Paham desain Twitter (fan-out, hybrid strategy, polyglot persistence)
- [ ] Paham desain Web Crawler (pipeline, politeness, deduplication, distributed)

#### D. Praktis

- [ ] Bisa setup dan query MySQL/PostgreSQL dasar
- [ ] Bisa setup dan menggunakan Redis untuk caching
- [ ] Bisa setup Nginx sebagai reverse proxy
- [ ] Bisa membuat REST API sederhana
- [ ] Paham cara menggunakan message queue dasar (RabbitMQ/Redis Streams)

---

### 21.6 Recommended Further Reading

#### Buku

| Judul | Penulis | Topik | Level |
|---|---|---|---|
| **Designing Data-Intensive Applications** | Martin Kleppmann | Database, distributed systems | Intermediate-Advanced |
| **System Design Interview** (Vol 1 & 2) | Alex Xu | Interview prep, case studies | Beginner-Intermediate |
| **Building Microservices** | Sam Newman | Microservices architecture | Intermediate |
| **The Practice of Cloud System Administration** | Limoncelli et al. | Cloud operations | Intermediate |

#### Online Resources

| Resource | URL | Topik |
|---|---|---|
| **donnemartin/system-design-primer** | [GitHub](https://github.com/donnemartin/system-design-primer) | Fundamental system design |
| **High Scalability** | [highscalability.com](http://highscalability.com/) | Real-world architecture |
| **AWS Architecture Blog** | [aws.amazon.com/blogs/architecture](https://aws.amazon.com/blogs/architecture/) | Cloud architecture patterns |
| **InfoQ Architecture** | [infoq.com/architecture](https://www.infoq.com/architecture/) | Architecture trends |
| **Gaurav Sen System Design** | [YouTube](https://www.youtube.com/channel/UCRPMAqdtSgd0Ipeef7iFsKw) | Video tutorials |
| **ByteByteGo** | [bytebytego.com](https://bytebytego.com/) | System design newsletter |
| **The System Design Primer** | [github.com/donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) | Comprehensive guide |

#### Topik untuk Dipelajari Selanjutnya

1. **Database Internals** — B-Tree, LSM-Tree, WAL, MVCC
2. **Distributed Consensus** — Paxos, Raft, Two-Phase Commit
3. **Distributed Cache** — Redis Cluster, Memcached consistent hashing
4. **Stream Processing** — Kafka Streams, Apache Flink
5. **Service Mesh** — Istio, Linkerd, Envoy
6. **Observability** — Prometheus, Grafana, Jaeger, ELK
7. **Infrastructure as Code** — Terraform, Ansible, Pulumi
8. **Container Orchestration** — Kubernetes, Docker Swarm
9. **Serverless Architecture** — AWS Lambda, Cloud Functions
10. **Machine Learning System Design** — Feature store, model serving, A/B testing

---

### 21.7 Penutup

Selamat! Anda telah menyelesaikan **Fase 1: Arsitektur Dasar System Design**.

**Yang sudah Anda pelajari:**
- 21 modul dari teori dasar hingga studi kasus
- Konsep fundamental: performance, scalability, CAP, consistency, availability
- Komponen sistem: DNS, CDN, Load Balancer, Reverse Proxy, Cache, Database, Message Queue
- Komunikasi dan keamanan: REST, GraphQL, gRPC, WebSocket, security layers
- 3 studi kasus lengkap: Pastebin, Twitter, Web Crawler

**Yang akan datang di Fase 2:**
- AI Tools Dasar — bagaimana menggunakan AI untuk meningkatkan produktivitas
- AI-assisted coding, prompt engineering, dan automation
- Integrasi AI tools ke dalam workflow development Anda

**Ingat:** System design bukan tentang menghafal arsitektur, tapi tentang **memahami trade-off** dan **membuat keputusan yang tepat** berdasarkan kebutuhan. Tidak ada arsitektur yang sempurna — yang ada hanyalah arsitektur yang **cocok untuk konteks tertentu**.

> *"Every system design decision is a trade-off. The best architects understand the trade-offs and make informed choices."*

---

## 🔗 REFERENSI

- **Repo Utama:** [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer)
- **System Design Interview Book:** [Alex Xu — System Design Interview](https://systemdesign.one/)
- **High Scalability Blog:** [highscalability.com](http://highscalability.com/)
- **AWS Well-Architected Framework:** [aws.amazon.com/architecture/well-architected](https://aws.amazon.com/architecture/well-architected/)

---

> **Lanjut ke:** [`../fase-2-ai-tools-dasar/00-panduan-fase.md`](../fase-2-ai-tools-dasar/00-panduan-fase.md)
