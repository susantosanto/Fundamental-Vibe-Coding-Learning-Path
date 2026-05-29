# 01 — Apa itu System Design?

> **Estimasi:** 2-3 jam | **Level:** Pemula | **Sumber Utama:** [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer)

---

## 📖 TEORI

### Pengertian System Design

**System Design** adalah proses mendefinisikan **arsitektur**, **komponen**, **modul**, **antarmuka (interfaces)**, dan **data** untuk sebuah sistem agar memenuhi kebutuhan yang ditentukan. Ini mencakup perancangan bagaimana setiap bagian sistem saling berkomunikasi, bagaimana data mengalir, bagaimana sistem menangani kegagalan, dan bagaimana sistem bisa tumbuh seiring waktu.

Sederhananya: **Sebelum membangun rumah, Anda butuh gambar denah.** System design adalah "gambar denah" untuk aplikasi software. Tanpa denah, rumah bisa roboh. Tanpa system design, aplikasi bisa crash saat banyak pengguna.

### Definisi Formal dari System Design Primer

Menurut [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer), system design adalah:

> *"Learn how to design large-scale systems. Learning how to design scalable systems will help you become a better engineer."*

System design bukan hanya tentang membuat aplikasi yang "jalan". Ini tentang membuat aplikasi yang:
- **Scalable** — Bisa menangani pertumbuhan dari 10 pengguna menjadi 10 juta pengguna
- **Reliable** — Tetap berfungsi meskipun ada komponen yang gagal
- **Available** — Bisa diakses kapan saja, di mana saja
- **Maintainable** — Mudah dipelihara, di-debug, dan dikembangkan oleh tim

### Kenapa System Design Penting?

Bayangkan Anda ingin membangun aplikasi absensi untuk sekolah:

**❌ Tanpa System Design:**
- Langsung coding tanpa rencana
- Database tidak terstruktur, semua data masuk satu tabel raksasa
- Saat pengguna bertambah dari 20 guru menjadi 200 guru, aplikasi jadi lambat
- Sulit menambah fitur baru karena kode sudah "spaghetti"
- Banyak bug yang sebenarnya bisa dihindari dengan perencanaan
- Tidak ada backup strategy, data hilang saat server crash
- Tidak ada monitoring, tidak tahu ada masalah sampai user komplain

**✅ Dengan System Design:**
- Tahu komponen apa saja yang dibutuhkan (frontend, backend, database, cache)
- Database sudah direncanakan dengan baik (normalisasi, indexing, relasi)
- Aplikasi bisa handle banyak pengguna karena sudah dipikirkan scaling strategy
- Mudah menambah fitur baru karena arsitektur sudah modular
- Bug lebih sedikit karena sudah dipikirkan edge cases sebelumnya
- Ada backup strategy dan disaster recovery plan
- Ada monitoring dan alerting, tahu ada masalah sebelum user komplain

### Analogi Sederhana: Membangun Rumah vs Membangun Aplikasi

| Membangun Rumah | Membangun Aplikasi | Penjelasan Detail |
| --- | --- | --- |
| Denah rumah (blueprint) | Arsitektur sistem | Keduanya adalah rencana awal yang menunjukkan bagaimana semua bagian terhubung |
| Pondasi (foundation) | Database & infrastruktur | Pondasi yang kuat = database yang terstruktur. Pondasi lemah = rumah roboh, database buruk = aplikasi crash |
| Dinding & atap | Frontend & Backend | Dinding = apa yang dilihat pengguna (UI). Atap = logika yang melindungi dan memproses data |
| Pipa air & listrik | API & komunikasi antar komponen | Pipa mengalirkan air = API mengalirkan data. Listrik = network yang menghubungkan semua bagian |
| Taman & garasi | Fitur tambahan (cache, monitoring, logging, dll) | Bukan kebutuhan utama, tapi meningkatkan kenyamanan dan performa |
| Satpam & CCTV | Security (authentication, authorization, encryption) | Melindungi dari ancaman luar |
| genset cadangan | Failover & redundancy | Saat listrik PLN mati, genset nyala. Saat server utama down, server cadangan ambil alih |
| Renovasi rumah | Refactoring & scaling | Rumah butuh renovasi seiring waktu, aplikasi butuh refactoring dan scaling |

### Apa yang Dipelajari di System Design?

Berikut adalah konsep-konsep inti yang akan Anda pelajari, berdasarkan [System Design Primer](https://github.com/donnemartin/system-design-primer):

#### 1. **Scalability (Skalabilitas)**
Bagaimana sistem handle pertumbuhan pengguna dan data. Ada dua jenis:
- **Vertical Scaling (Scale Up)** — Menambah kapasitas satu server (RAM lebih besar, CPU lebih cepat). Contoh: Upgrade server dari 4GB RAM ke 32GB RAM.
- **Horizontal Scaling (Scale Out)** — Menambah jumlah server. Contoh: Dari 1 server menjadi 10 server yang bekerja bersama.

**Analogi:** Vertical scaling = mengganti motor dengan mobil. Horizontal scaling = menambah jumlah motor untuk mengantar lebih banyak paket.

#### 2. **Performance (Performa)**
Bagaimana sistem merespons dengan cepat. Dua metrik utama:
- **Latency** — Waktu yang dibutuhkan untuk satu request selesai (diukur dalam milidetik). Contoh: Halaman web load dalam 200ms.
- **Throughput** — Jumlah request yang bisa ditangani per detik. Contoh: Server bisa handle 10.000 request/detik.

**Analogi:** Latency = berapa lama satu mobil sampai dari Bandung ke Jakarta. Throughput = berapa mobil yang bisa lewat tol per jam.

#### 3. **Availability (Ketersediaan)**
Bagaimana sistem tetap berjalan saat ada masalah. Diukur dalam "nines":
- **99.9% (three 9s)** — Downtime maksimal 8 jam 45 menit per tahun
- **99.99% (four 9s)** — Downtime maksimal 52 menit per tahun
- **99.999% (five 9s)** — Downtime maksimal 5 menit per tahun

**Analogi:** ATM bank harus available 24/7. Kalau ATM mati, nasabah tidak bisa tarik tunai.

#### 4. **Reliability (Keandalan)**
Bagaimana sistem memberikan hasil yang konsisten dan benar. Sistem yang reliable:
- Tidak kehilangan data
- Memberikan hasil yang sama untuk input yang sama
- Bisa recover dari kegagalan

#### 5. **Maintainability (Kemudahan Pemeliharaan)**
Bagaimana sistem mudah dipelihara dan dikembangkan:
- Kode yang readable dan terstruktur
- Dokumentasi yang jelas
- Testing yang memadai
- Monitoring dan logging

### Prinsip Utama: "Everything is a Trade-off"

Dalam system design, **tidak ada solusi sempurna**. Setiap keputusan punya kelebihan dan kekurangan. Ini adalah prinsip paling penting yang ditekankan di System Design Primer.

| Keputusan | Kelebihan | Kekurangan | Kapan Dipilih |
| --- | --- | --- | --- |
| Pakai 1 server saja (Monolith) | Murah, sederhana, mudah deploy | Tidak scalable, single point of failure | Startup kecil, prototype, internal tool |
| Pakai banyak server (Distributed) | Scalable, reliable, fault-tolerant | Mahal, kompleks, butuh DevOps | Aplikasi production dengan banyak user |
| SQL Database (MySQL, PostgreSQL) | ACID compliant, terstruktur, query powerful | Sulit scale horizontal, schema rigid | Data transaksi, keuangan, data yang butuh konsistensi tinggi |
| NoSQL Database (MongoDB, Cassandra) | Mudah scale horizontal, schema fleksibel | Konsistensi lebih lemah (eventual consistency) | Data tidak terstruktur, real-time analytics, content management |
| Cache (Redis, Memcached) | Sangat cepat, mengurangi beban database | Data bisa stale, butuh invalidation strategy | Data yang sering dibaca tapi jarang berubah |
| Message Queue (RabbitMQ, Kafka) | Async processing, decoupling services | Kompleks, perlu monitoring queue depth | Background jobs, event processing, microservices communication |
| CDN (CloudFlare, CloudFront) | Konten dekat dengan user, kurangi beban server | Biaya tambahan, konten bisa stale | Static assets (gambar, CSS, JS), media streaming |

**Kunci:** Pilih yang paling cocok dengan kebutuhan, bukan yang "terbaik" secara umum. Pertanyaan yang harus selalu ditanyakan:
- Berapa banyak user yang diharapkan?
- Berapa banyak data yang akan disimpan?
- Berapa read vs write ratio?
- Berapa latency yang acceptable?
- Berapa budget yang tersedia?

---

### Deep Dive: Apa Bedanya System Design dengan Software Architecture?

Seringkali kedua istilah ini digunakan bergantian, tapi ada perbedaan halus:

| Aspek | System Design | Software Architecture |
| --- | --- | --- |
| Fokus | Bagaimana komponen berinteraksi pada skala besar | Bagaimana kode diorganisir dalam satu aplikasi |
| Scope | Lebih luas: network, database, server, CDN | Lebih sempit: design patterns, class structure, modules |
| Pertanyaan | "Server apa yang dipakai? Database apa? Bagaimana scaling?" | "Design pattern apa yang cocok? Bagaimana struktur class?" |
| Contoh | Mendesain arsitektur Gojek dari nol | Mendesain class structure untuk fitur absensi |

Dalam praktiknya, keduanya saling melengkapi. System design yang baik butuh architecture yang baik, dan sebaliknya.

---

### Deep Dive: CAP Theorem — The Foundation of Distributed Systems

**CAP Theorem** adalah konsep fundamental dalam system design yang pertama kali diperkenalkan oleh Eric Brewer pada tahun 2000. Teorema ini menyatakan bahwa dalam sistem terdistribusi, Anda hanya bisa memilih **DUA** dari tiga jaminan berikut:

```
        CAP THEOREM
    ┌─────────────┐
    │             │
    │    (C)      │
    │ Consistency │
    │             │
   ╱│             │╲
  ╱ │             │ ╲
 ╱  │             │  ╲
╱   │             │   ╲
─────────────────────────
(A)             (P)
Availability    Partition
                Tolerance
```

**C — Consistency (Konsistensi):**
Setiap read menerima write terbaru atau error. Semua node melihat data yang sama pada waktu yang sama.
- Contoh: Transfer bank. Saldo harus konsisten di semua ATM.

**A — Availability (Ketersediaan):**
Setiap request menerima response (bukan error), tapi tidak menjamin data terbaru.
- Contoh: Social media feed. Tidak masalah kalau feed Anda tidak 100% up-to-date.

**P — Partition Tolerance (Toleransi Partisi):**
Sistem tetap beroperasi meskipun ada kegagalan network yang memisahkan node-node.
- Contoh: Server di Jakarta dan server di Surabaya kehilangan koneksi, tapi keduanya tetap bisa melayani user lokal.

**Kenapa hanya bisa pilih 2?**
Karena network itu tidak reliable. Partisi (kegagalan network) pasti akan terjadi. Jadi Anda HARUS memilih antara C dan P, atau A dan P.

**CP (Consistency + Partition Tolerance):**
- Sistem akan menolak request jika tidak bisa guarantee konsistensi
- Cocok untuk: Sistem perbankan, sistem inventory
- Contoh database: MongoDB (dalam mode default), HBase, Redis

**AP (Availability + Partition Tolerance):**
- Sistem selalu merespons, tapi data mungkin tidak terbaru
- Cocok untuk: Social media, e-commerce catalog, DNS
- Contoh database: Cassandra, CouchDB, DynamoDB

**Catatan penting:** Dalam praktiknya, banyak database modern menawarkan "tunable consistency" — Anda bisa memilih level konsistensi per query.

---

### Deep Dive: Consistency Patterns

Ketika data direplikasi di banyak server, muncul pertanyaan: **Kapan user bisa melihat data terbaru?**

#### 1. Weak Consistency
Setelah write, read mungkin atau mungkin tidak melihat data terbaru. "Best effort" approach.

**Contoh nyata:**
- VoIP call: Kalau koneksi putus 3 detik, Anda tidak akan mendengar apa yang diucapkan selama 3 detik itu. Data hilang dan tidak di-replay.
- Real-time multiplayer game: Posisi pemain lain mungkin sedikit delay, tapi game tetap jalan.

**Kapan dipakai:** Ketika kecepatan lebih penting daripada akurasi data.

#### 2. Eventual Consistency
Setelah write, read AKAN melihat data terbaru, tapi butuh waktu (biasanya milidetik hingga detik). Data direplikasi secara asynchronous.

**Contoh nyata:**
- DNS: Kalau Anda update DNS record, butuh waktu beberapa menit hingga jam untuk propagate ke seluruh dunia.
- Email: Email yang Anda kirim mungkin butuh beberapa detik hingga menit sampai ke inbox penerima.
- Social media likes: Anda like post, tapi teman Anda mungkin belum melihat like itu selama beberapa detik.

**Kapan dipakai:** Ketika sistem harus highly available dan bisa tolerate data yang sedikit delay.

#### 3. Strong Consistency
Setelah write, read LANGSUNG melihat data terbaru. Data direplikasi secara synchronous.

**Contoh nyata:**
- Transfer bank: Setelah Anda transfer, saldo langsung berkurang di semua channel (ATM, mobile banking, internet banking).
- Sistem booking tiket: Setelah tiket di-booking, langsung tidak tersedia untuk orang lain.

**Kapan dipakai:** Ketika akurasi data lebih penting daripada kecepatan.

---

### Deep Dive: Availability Numbers — Berapa "9" yang Anda Butuhkan?

Availability diukur dalam persentase. Berikut tabel lengkapnya:

| Availability | Nama | Downtime/Tahun | Downtime/Bulan | Downtime/Hari | Contoh |
| --- | --- | --- | --- | --- | --- |
| 99% | Two 9s | 3 hari 15 jam | 7 jam 18 menit | 14 menit 24 detik | Website kecil, blog |
| 99.9% | Three 9s | 8 jam 45 menit | 43 menit 49 detik | 1 menit 26 detik | Aplikasi sekolah, e-commerce kecil |
| 99.99% | Four 9s | 52 menit 35 detik | 4 menit 23 detik | 8.6 detik | Aplikasi perbankan, SaaS |
| 99.999% | Five 9s | 5 menit 15 detik | 26 detik | 0.86 detik | Telekomunikasi, sistem kritis |

**Kalkulasi untuk sistem dengan banyak komponen:**

Kalau sistem Anda punya 3 komponen yang masing-masing 99.9% availability:

**Komponen berurutan (sequence) — availability MENURUN:**
```
Availability Total = 0.999 × 0.999 × 0.999 = 0.997 = 99.7%
```
Downtime per tahun: ~26 jam!

**Komponen paralel (redundancy) — availability NAIK:**
```
Availability Total = 1 - (1 - 0.999)³ = 1 - 0.000000001 = 99.9999999%
```
Downtime per tahun: ~0.03 detik!

**Pelajaran:** Redundancy (komponen paralel) meningkatkan availability. Dependency berurutan menurunkan availability.

---

## 🎯 CONTOH NYATA

### Contoh 1: Aplikasi Absensi Sekolah SD Negeri Pasirhalang

**Konteks:**
- SD Negeri Pasirhalang memiliki 20 guru dan 200 siswa
- Setiap hari, guru input absensi siswa
- Data digunakan untuk laporan bulanan ke Dinas Pendidikan
- Server berada di kantor sekolah

**Kebutuhan:**
- 20 guru input absensi setiap hari
- 200 siswa tercatat
- Data disimpan untuk laporan bulanan dan semesteran
- Peak usage: jam 7-8 pagi (saat absensi dilakukan)

**Desain Sederhana (Monolith):**
```
┌─────────┐     ┌──────────────┐     ┌──────────┐
│  Guru   │────▶│  Aplikasi    │────▶│ Database │
│ (Browser)│     │  Web Server  │     │ (SQLite) │
└─────────┘     └──────────────┘     └──────────┘
                      │
                      ▼
               ┌──────────────┐
               │  Laporan     │
               │  (PDF/Excel) │
               └──────────────┘
```

**Analisis:**
- 1 server sudah cukup (20 guru, peak ~20 concurrent request)
- SQLite cukup (data kecil, tidak perlu concurrent access tinggi)
- Tidak perlu CDN (user hanya di satu lokasi)
- Tidak perlu load balancer (1 server saja)
- Backup: copy file database ke Google Drive setiap minggu

**Estimasi Resource:**
- Server: VPS 1 vCPU, 1GB RAM (Rp 100.000/bulan)
- Database: SQLite (gratis, file-based)
- Storage: 5GB cukup untuk 5 tahun data

**Kesimpulan:** Ini cukup untuk kebutuhan kecil. Tidak perlu over-engineer.

---

### Contoh 2: Aplikasi Gojek / GoTo

**Konteks:**
- Jutaan pengguna aktif harian
- Ribuan driver online bersamaan
- Real-time tracking GPS
- Pembayaran instan (GoPay)
- Multi-service: ride-hailing, food delivery, payment, dll

**Kebutuhan:**
- 10+ juta pengguna aktif
- 500.000+ driver online
- Real-time location update (setiap 5 detik)
- Payment processing dengan strong consistency
- 99.99% availability

**Desain Kompleks (Microservices):**
```
                    ┌─────────────────────────────────────────────┐
                    │              DNS (Route 53)                  │
                    └──────────────────┬──────────────────────────┘
                                       │
                    ┌──────────────────▼──────────────────────────┐
                    │            CDN (CloudFront)                  │
                    │         Static assets, images                │
                    └──────────────────┬──────────────────────────┘
                                       │
                    ┌──────────────────▼──────────────────────────┐
                    │          Load Balancer (ALB)                 │
                    │     Round-robin, health checks               │
                    └──────────────────┬──────────────────────────┘
                                       │
                    ┌──────────────────▼──────────────────────────┐
                    │           API Gateway (Kong)                 │
                    │  Rate limiting, auth, routing                │
                    └──────┬──────┬──────┬──────┬─────────────────┘
                           │      │      │      │
              ┌────────────▼┐  ┌──▼────┐ │  ┌───▼────────────┐
              │  User Svc   │  │Order  │ │  │  Payment Svc   │
              │  (Node.js)  │  │Svc    │ │  │  (Java)        │
              └──────┬──────┘  │(Go)   │ │  └───┬────────────┘
                     │         └──┬────┘ │      │
              ┌──────▼──────┐  ┌──▼────┐ │  ┌───▼────────────┐
              │ User DB     │  │Order  │ │  │  Payment DB    │
              │ (PostgreSQL)│  │DB     │ │  │  (PostgreSQL)  │
              └─────────────┘  │(MySQL)│ │  └────────────────┘
                               └───────┘ │
                    ┌────────────────────┘
                    │
              ┌─────▼──────────────┐
              │  Message Queue     │
              │  (Kafka/RabbitMQ)  │
              └─────┬──────────────┘
                    │
              ┌─────▼──────────────┐
              │  Tracking Service  │
              │  (WebSocket)       │
              └─────┬──────────────┘
                    │
              ┌─────▼──────────────┐
              │  Redis Cache       │
              │  Session, location │
              └────────────────────┘
```

**Analisis:**
- Load balancer untuk distribusi traffic ke banyak server
- API Gateway untuk routing, rate limiting, authentication
- Microservices terpisah untuk setiap domain (user, order, payment, tracking)
- Message Queue untuk async processing (notifikasi, analytics)
- Redis Cache untuk session dan real-time location
- Database terpisah per service (database per microservice)

**Estimasi Resource:**
- 50+ server application
- 10+ database instances (master-slave replication)
- Redis cluster (6 nodes)
- Kafka cluster (5 nodes)
- CDN global
- Monitoring: Prometheus + Grafana
- Estimated cost: Ratusan juta hingga miliaran rupiah per bulan

---

### Contoh 3: Aplikasi Tokopedia / E-commerce Indonesia

**Konteks:**
- Harbolnas (12.12): traffic bisa 10x lipat dari hari biasa
- Katalog jutaan produk
- Real-time inventory
- Payment gateway integration

**Desain yang Diperlukan:**
```
┌──────────┐    ┌──────────┐
│  Buyer   │    │  Seller  │
└────┬─────┘    └────┬─────┘
     │               │
     └───────┬───────┘
             │
    ┌────────▼────────┐
    │      CDN        │  ← Static assets (gambar produk)
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │  Load Balancer  │
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │  Web Servers    │  ← Stateless, bisa di-scale horizontal
    │  (N + 1)        │
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │  Cache Layer    │  ← Redis: product catalog, session
    │  (Redis)        │
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │  App Servers    │  ← Business logic
    │  (Microservices)│
    └────┬─────┬──────┘
         │     │
    ┌────▼──┐ ┌▼────────┐
    │ SQL   │ │ NoSQL   │
    │(Order)│ │(Product)│
    └───────┘ └─────────┘
```

**Kenapa butuh CDN?**
- Gambar produk di-load dari server terdekat dengan user
- User di Jakarta load gambar dari edge Jakarta, bukan dari server pusat
- Mengurangi beban server utama hingga 70-80%

**Kenapa butuh Cache?**
- Product catalog jarang berubah tapi sering dibaca
- Read:Write ratio bisa 100:1 atau lebih
- Cache mengurangi query ke database secara drastis

---

### Contoh 4: Sistem Informasi Sekolah (SIS) — Konteks Indonesia

**Konteks:**
- Digunakan oleh 1000+ sekolah di satu kabupaten
- Setiap sekolah punya 100-500 siswa
- Data: siswa, guru, nilai, absensi, keuangan (BOS)
- Akses dari berbagai lokasi dengan koneksi internet berbeda-beda

**Desain Multi-Tenant:**
```
┌─────────────────────────────────────────────┐
│              Cloud (AWS/GCP/Azure)           │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │         Load Balancer               │    │
│  └──────────────┬──────────────────────┘    │
│                 │                            │
│  ┌──────────────▼──────────────────────┐    │
│  │         API Gateway                 │    │
│  │  (Routing per sekolah/tenant)       │    │
│  └──────────────┬──────────────────────┘    │
│                 │                            │
│  ┌──────────────▼──────────────────────┐    │
│  │       Application Servers           │    │
│  │       (Auto-scaling group)          │    │
│  └──────────────┬──────────────────────┘    │
│                 │                            │
│  ┌──────────────▼──────────────────────┐    │
│  │         Database                    │    │
│  │  (Multi-tenant: tenant_id per row)  │    │
│  │  atau Database per sekolah          │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │         Backup (S3/Glacier)         │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

**Pertimbangan khusus Indonesia:**
- Koneksi internet tidak stabil di daerah terpencil → perlu offline-first design
- Data harus comply dengan regulasi Kemdikbud
- Perlu integrasi dengan Dapodik (sistem data pokok pendidikan)
- Perlu support untuk ARKAS (aplikasi keuangan BOS)

---

### Pelajaran Utama dari Semua Contoh:

**"Right-sizing" adalah kunci.** Jangan over-engineer untuk masalah kecil, jangan under-engineer untuk masalah besar.

| Skala | Arsitektur | Estimasi Biaya/Bulan |
| --- | --- | --- |
| < 100 user, 1 lokasi | Monolith, 1 server, SQLite | Rp 100.000 - 500.000 |
| 100-10.000 user | Monolith, 1-2 server, PostgreSQL | Rp 500.000 - 2.000.000 |
| 10.000-100.000 user | Microservices, load balancer, cache | Rp 2.000.000 - 10.000.000 |
| 100.000-1.000.000 user | Full distributed, CDN, message queue | Rp 10.000.000 - 100.000.000 |
| 1.000.000+ user | Enterprise architecture, multi-region | Rp 100.000.000+ |

---

## 📋 LANGKAH-LANGKAH SYSTEM DESIGN INTERVIEW

Berdasarkan panduan dari [System Design Primer](https://github.com/donnemartin/system-design-primer), berikut adalah framework 4 langkah untuk menjawab pertanyaan system design interview:

### Step 1: Outline Use Cases, Constraints, and Assumptions (5-10 menit)

**Tujuan:** Memahami masalah secara mendalam sebelum mendesain.

**Pertanyaan yang harus ditanyakan:**
- **Who** — Siapa yang akan menggunakan sistem ini?
- **What** — Apa saja fitur utamanya?
- **How many** — Berapa banyak pengguna? Berapa request per detik?
- **How much data** — Berapa banyak data yang akan disimpan?
- **Read vs Write** — Berapa rasio baca vs tulis?
- **Latency requirement** — Berapa latency yang acceptable?

**Contoh: Design URL Shortener (seperti Bit.ly)**
```
Use Cases:
- User bisa shorten URL panjang menjadi URL pendek
- User bisa redirect dari URL pendek ke URL asli
- (Optional) User bisa custom short URL
- (Optional) Analytics: berapa kali URL diklik

Constraints:
- 100 juta URL baru per bulan
- 10 miliar redirect per bulan
- Read:Write ratio = 100:1
- URL pendek minimal 7 karakter
- Redirect harus < 100ms

Assumptions:
- URL tidak perlu persisten selamanya (bisa expired)
- Tidak perlu authentication untuk basic usage
- Storage: ~500 byte per record (short URL, long URL, created_at)
```

**Kalkulasi back-of-the-envelope:**
```
Write per detik: 100 juta / 30 hari / 24 jam / 3600 detik ≈ 38 write/detik
Read per detik: 10 miliar / 30 hari / 24 jam / 3600 detik ≈ 3.858 read/detik

Storage per bulan: 100 juta × 500 byte = 50 GB
Storage per tahun: 50 GB × 12 = 600 GB
Storage 5 tahun: 600 GB × 5 = 3 TB
```

### Step 2: Create High-Level Design (5-10 menit)

**Tujuan:** Gambar arsitektur secara keseluruhan dengan semua komponen utama.

```
┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌──────────┐
│   User   │────▶│    LB    │────▶│  Web Server  │────▶│ Database │
│ (Browser)│     │          │     │  (API)       │     │          │
└──────────┘     └──────────┘     └──────────────┘     └──────────┘
```

**Justifikasi setiap komponen:**
- Load Balancer: Distribusi traffic, high availability
- Web Server: Handle HTTP request, business logic
- Database: Simpan mapping short URL → long URL

### Step 3: Design Core Components (10-15 menit)

**Tujuan:** Masuk ke detail setiap komponen utama.

**Untuk URL Shortener, bahas:**
1. **Generate short URL:**
  - Base62 encoding (a-z, A-Z, 0-9 = 62 karakter)
  - 7 karakter = 62^7 ≈ 3.5 triliun kombinasi (cukup untuk 100 juta/bulan × 60 bulan = 6 miliar)
  - Atau: Hash MD5 + truncate, tapi perlu handle collision

2. **Database Schema:**
```sql
   CREATE TABLE url_mapping (
       id BIGINT PRIMARY KEY AUTO_INCREMENT,
       short_url VARCHAR(10) UNIQUE NOT NULL,
       long_url TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       expires_at TIMESTAMP NULL,
       user_id BIGINT NULL,
       INDEX idx_short_url (short_url)
   );
```

3. **API Design:**
```
   POST /api/shorten
   Body: { "long_url": "https://example.com/very/long/url" }
   Response: { "short_url": "https://short.ly/abc1234" }

   GET /abc1234
   Response: 301 Redirect ke long_url
```

### Step 4: Scale the Design (10-15 menit)

**Tujuan:** Identifikasi bottleneck dan skalakan desain.

**Bottleneck yang mungkin:**
1. **Database menjadi bottleneck** — 3.858 read/detik mungkin terlalu banyak untuk 1 database
  - Solusi: Read replica, cache (Redis)

2. **Single point of failure** — 1 web server = kalau down, semua down
  - Solusi: Multiple web servers + load balancer

3. **Hot keys** — Beberapa URL sangat populer (viral), diakses jutaan kali
  - Solusi: Cache di Redis, TTL yang sesuai

**Desain yang sudah di-scale:**
```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│   User   │────▶│    LB    │────▶│  Web Server  │──┐
└──────────┘     └──────────┘     └──────────────┘  │
                                                    │
┌──────────┐     ┌──────────┐     ┌──────────────┘  │
│   User   │────▶│    LB    │────▶│  Web Server  │──┤
└──────────┘     └──────────┘     └──────────────┘  │
                                                    │
                                          ┌─────────▼─────────┐
                                          │     Redis Cache    │
                                          │  (Hot URLs, TTL)   │
                                          └─────────┬─────────┘
                                                    │
                                          ┌─────────▼─────────┐
                                          │   DB Master        │
                                          │   (Write only)     │
                                          └─────────┬─────────┘
                                                    │
                                          ┌─────────▼─────────┐
                                          │   DB Replica 1     │
                                          │   (Read only)      │
                                          └────────────────────┘
```

---

## 🧮 BACK-OF-THE-ENVELOPE ESTIMATION

**Back-of-the-envelope estimation** adalah teknik menghitung estimasi kasar dengan cepat, tanpa kalkulator. Ini sangat penting dalam system design interview dan dalam perencanaan sistem nyata.

### Powers of Two Table

Referensi cepat untuk konversi:

| Power | Value | Approximation | Common Use |
| --- | --- | --- | --- |
| 2^10 | 1,024 | ~1 thousand | 1 KB |
| 2^20 | 1,048,576 | ~1 million | 1 MB |
| 2^30 | 1,073,741,824 | ~1 billion | 1 GB |
| 2^40 | ~1 trillion | ~1 trillion | 1 TB |
| 2^50 | ~1 quadrillion | ~1 quadrillion | 1 PB |
| 2^60 | ~1 quintillion | ~1 quintillion | 1 EB |

### Latency Numbers Every Programmer Should Know

Ini adalah angka-angka yang HARUS dihafal oleh setiap engineer. Dari [System Design Primer](https://github.com/donnemartin/system-design-primer):

| Operasi | Waktu | Perbandingan |
| --- | --- | --- |
| L1 cache reference | 0.5 ns | — |
| Branch mispredict | 5 ns | 10× L1 |
| L2 cache reference | 7 ns | 14× L1 |
| Mutex lock/unlock | 25 ns | 50× L1 |
| Main memory reference | 100 ns | 200× L1 |
| Compress 1K bytes with Zippy | 3,000 ns (3 μs) | 6,000× L1 |
| Send 1K bytes over 1 Gbps network | 10,000 ns (10 μs) | 20,000× L1 |
| Read 4K randomly from SSD | 150,000 ns (150 μs) | 300,000× L1 |
| Read 1 MB sequentially from memory | 250,000 ns (250 μs) | 500,000× L1 |
| Round trip within same datacenter | 500,000 ns (500 μs) | 1,000,000× L1 |
| Read 1 MB sequentially from SSD | 1,000,000 ns (1 ms) | 2,000,000× L1 |
| Disk seek | 10,000,000 ns (10 ms) | 20,000,000× L1 |
| Read 1 MB sequentially from disk | 20,000,000 ns (20 ms) | 40,000,000× L1 |
| Send packet CA→Netherlands→CA | 150,000,000 ns (150 ms) | 300,000,000× L1 |

**Pelajaran praktis:**
- **Memory access 100× lebih lambat dari L1 cache** → Cache matters!
- **Disk access 100.000× lebih lambat dari memory** → Hindari disk I/O kalau bisa
- **Network round-trip dalam datacenter \~500 μs** → Minimalkan network call
- **SSD 100× lebih cepat dari HDD** → Pakai SSD untuk database

### Contoh Estimasi: Sistem Chat seperti WhatsApp

**Pertanyaan:** Berapa storage yang dibutuhkan untuk menyimpan pesan 1 tahun?

**Asumsi:**
- 1 miliar pengguna aktif
- Rata-rata 50 pesan/hari per pengguna
- Rata-rata 100 byte per pesan (termasuk metadata)

**Kalkulasi:**
```
Pesan per hari: 1 miliar × 50 = 50 miliar pesan
Storage per hari: 50 miliar × 100 byte = 5 TB
Storage per tahun: 5 TB × 365 = 1.825 TB ≈ 1.8 PB
```

**Apakah ini masuk akal?**
- WhatsApp dilaporkan menyimpan ratusan petabytes data
- 1.8 PB untuk 1 tahun masuk akal

### Contoh Estimasi: Sistem Absensi Sekolah

**Pertanyaan:** Berapa storage untuk sistem absensi SD Negeri Pasirhalang selama 10 tahun?

**Asumsi:**
- 200 siswa
- 1 record absensi/hari per siswa (masuk/pulang)
- 1 record = ~200 byte (NIS, nama, tanggal, status, timestamp)
- 200 hari efektif per tahun

**Kalkulasi:**
```
Record per tahun: 200 siswa × 200 hari = 40.000 record
Storage per tahun: 40.000 × 200 byte = 8 MB
Storage 10 tahun: 8 MB × 10 = 80 MB
```

**Kesimpulan:** Sangat kecil. SQLite di 1 server sudah lebih dari cukup.

---

## 🏗️ COMMON DESIGN PATTERNS OVERVIEW

Berikut adalah pola-pola desain yang paling sering digunakan dalam system design, berdasarkan [System Design Primer](https://github.com/donnemartin/system-design-primer):

### 1. Load Balancing Pattern

**Masalah:** Bagaimana mendistribusikan traffic ke banyak server?

**Solusi:** Load balancer di depan server pool.

```
         ┌─────────────┐
         │   Client    │
         └──────┬──────┘
                │
         ┌──────▼──────┐
         │    Load     │
         │  Balancer   │
         └──┬──┬──┬───┘
            │  │  │
      ┌─────┘  │  └─────┐
      ▼        ▼        ▼
  ┌───────┐ ┌───────┐ ┌───────┐
  │Server │ │Server │ │Server │
  │   1   │ │   2   │ │   3   │
  └───────┘ └───────┘ └───────┘
```

**Algoritma Load Balancing:**
- **Round Robin:** Distribusi bergiliran (Server 1 → 2 → 3 → 1 → 2 → 3)
- **Weighted Round Robin:** Server dengan kapasitas lebih dapat lebih banyak traffic
- **Least Connections:** Kirim ke server dengan koneksi aktif paling sedikit
- **IP Hash:** User yang sama selalu ke server yang sama (untuk session persistence)

**Layer 4 vs Layer 7:**
- **Layer 4 (Transport):** Routing berdasarkan IP dan port. Lebih cepat, tapi kurang fleksibel.
- **Layer 7 (Application):** Routing berdasarkan konten HTTP (URL, header, cookie). Lebih lambat, tapi lebih pintar.

---

### 2. Caching Pattern

**Masalah:** Database terlalu lambat untuk read yang sering.

**Solusi:** Simpan hasil query di cache (Redis/Memcached).

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│  Cache   │────▶│ Database │
│          │     │ (Redis)  │     │          │
└──────────┘     └──────────┘     └──────────┘
```

**Cache Strategies:**

**Cache-Aside (Lazy Loading):**
```
1. Client request data
2. Check cache → HIT? Return from cache
3. Cache → MISS? Query database
4. Store result in cache
5. Return to client
```
- Paling umum digunakan
- Data hanya di-cache saat diminta
- Kelemahan: Cache miss pertama selalu lambat

**Write-Through:**
```
1. Client write data
2. Write to cache
3. Write to database
4. Return to client
```
- Data selalu konsisten antara cache dan database
- Kelemahan: Write lebih lambat (harus tulis ke 2 tempat)

**Write-Behind (Write-Back):**
```
1. Client write data
2. Write to cache only
3. Cache asynchronously write to database
4. Return to client immediately
```
- Write sangat cepat
- Kelemahan: Data bisa hilang jika cache crash sebelum flush ke database

---

### 3. Database Replication Pattern

**Masalah:** Satu database tidak bisa handle semua read request.

**Solusi:** Replikasi database (master-slave atau master-master).

**Master-Slave Replication:**
```
              ┌─────────────┐
              │   Master    │
              │ (Read+Write)│
              └──────┬──────┘
                     │ (async replication)
           ┌─────────┼─────────┐
           ▼         ▼         ▼
      ┌────────┐ ┌────────┐ ┌────────┐
      │ Slave  │ │ Slave  │ │ Slave  │
      │(Read)  │ │(Read)  │ │(Read)  │
      └────────┘ └────────┘ └────────┘
```

**Kelebihan:**
- Read bisa di-scale horizontal (tambah slave)
- Write tetap konsisten (hanya 1 master)

**Kekurangan:**
- Replication lag: data di slave mungkin tidak terbaru
- Failover kompleks: perlu promote slave jadi master

---

### 4. Database Sharding Pattern

**Masalah:** Satu database terlalu besar (terlalu banyak data, terlalu banyak request).

**Solusi:** Bagi data ke beberapa database (shards).

```
         ┌─────────────┐
         │  Router /   │
         │  LB         │
         └──┬──┬──┬───┘
            │  │  │
      Shard │  │  │ Shard
      based │  │  │ based
      on    │  │  │ on
      user  │  │  │ user
      ID    │  │  │ ID
      ▼     │  │  │ ▼
  ┌───────┐ │  │ ┌───────┐
  │Shard 1│ │  │ │Shard 3│
  │A-F    │ │  │ │M-R    │
  └───────┘ │  │ └───────┘
            │  │
      ┌─────┘  └─────┐
      ▼              ▼
  ┌───────┐      ┌───────┐
  │Shard 2│      │Shard 4│
  │G-L    │      │S-Z    │
  └───────┘      └───────┘
```

**Sharding Strategies:**
- **Range-based:** Shard berdasarkan range (A-F, G-L, M-R, S-Z)
- **Hash-based:** Shard berdasarkan hash(key) % N
- **Directory-based:** Lookup table yang mapping key ke shard

**Kelebihan:**
- Write bisa di-scale horizontal
- Storage bisa di-scale horizontal
- Query lebih cepat (data lebih sedikit per shard)

**Kekurangan:**
- Cross-shard query kompleks dan lambat
- Rebalancing saat tambah shard itu sulit
- Operational complexity tinggi

---

### 5. Message Queue Pattern

**Masalah:** Service A perlu mengirim data ke Service B, tapi Service B sedang lambat atau down.

**Solusi:** Gunakan message queue sebagai buffer.

```
┌──────────┐     ┌──────────────┐     ┌──────────┐
│ Service  │────▶│   Message    │────▶│ Service  │
│   A      │     │   Queue      │     │   B      │
│(Producer)│     │ (RabbitMQ/   │     │(Consumer)│
└──────────┘     │  Kafka)      │     └──────────┘
                 └──────────────┘
```

**Use Cases:**
- Email notification (async, tidak perlu user tunggu)
- Image/video processing (lama, tidak perlu blocking)
- Data pipeline (ETL, analytics)
- Event-driven architecture

**Kelebihan:**
- Decoupling: Service A tidak perlu tahu Service B ada atau tidak
- Buffering: Message queue menampung saat consumer lambat
- Scalability: Bisa tambah consumer untuk process lebih cepat

**Kekurangan:**
- Complexity: Perlu monitor queue depth, handle failed messages
- Ordering: Message order tidak selalu guaranteed
- At-least-once vs exactly-once delivery trade-off

---

### 6. Microservices Pattern

**Masalah:** Monolith terlalu besar, sulit deploy, sulit scale per fitur.

**Solusi:** Pecah menjadi service-service kecil yang independent.

```
Monolith (Sebelum):
┌─────────────────────────────────────┐
│           Monolith App              │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │User │ │Order│ │Pay  │ │Notif│   │
│  │Svc  │ │Svc  │ │Svc  │ │Svc  │   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│           Shared Database           │
└─────────────────────────────────────┘

Microservices (Sesudah):
┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐
│ User  │  │ Order │  │ Pay   │  │ Notif │
│  Svc  │  │  Svc  │  │  Svc  │  │  Svc  │
│  DB   │  │  DB   │  │  DB   │  │  DB   │
└───────┘  └───────┘  └───────┘  └───────┘
```

**Kelebihan:**
- Independent deployment
- Independent scaling (service yang butuh resource lebih bisa di-scale sendiri)
- Technology diversity (tiap service bisa pakai tech stack berbeda)
- Fault isolation (1 service down tidak berarti semua down)

**Kekurangan:**
- Distributed system complexity
- Network latency antar service
- Data consistency lebih sulit (distributed transactions)
- Operational overhead (monitoring, logging, tracing)

---

## 💡 PRAKTIK

### Latihan 1: Identifikasi Komponen Aplikasi Sehari-hari

Pilih aplikasi yang Anda gunakan sehari-hari. Coba identifikasi komponennya.

**Template Analisis:**

```
Aplikasi: _______________

1. Pengguna:
   - Siapa saja yang menggunakan?
   - Berapa estimasi jumlah pengguna?
   - Bagaimana pola penggunaan (kapan peak, kapan low)?

2. Fitur Utama:
   - Fitur 1: ___
   - Fitur 2: ___
   - Fitur 3: ___

3. Data yang Disimpan:
   - Data 1: ___ (estimasi size per record: ___)
   - Data 2: ___ (estimasi size per record: ___)

4. Alur Data:
   User → ___ → ___ → ___ → User

5. Estimasi Resource:
   - Storage per tahun: ___
   - Request per detik (peak): ___
   - Request per detik (average): ___
```

**Contoh Lengkap untuk WhatsApp:**

```
Aplikasi: WhatsApp

1. Pengguna:
   - Individu (chat personal)
   - Grup (hingga 1024 anggota)
   - Business (WhatsApp Business API)
   - Estimasi: 2+ miliar pengguna aktif

2. Fitur Utama:
   - Chat personal dan grup (text, image, video, document)
   - Voice call dan video call
   - Status (story, hilang setelah 24 jam)
   - Backup ke cloud

3. Data yang Disimpan:
   - Pesan: ~500 byte per pesan (termasuk metadata)
   - Media: variable (foto ~2MB, video ~10MB)
   - Kontak: ~1KB per user
   - Status: ~5MB per status

4. Alur Data:
   User A → Encrypt → WhatsApp Server → Forward → User B (Decrypt)
   Server tidak bisa baca pesan (end-to-end encryption)

5. Estimasi Resource:
   - Pesan per hari: 2 miliar × 50 = 100 miliar pesan
   - Storage pesan per hari: 100 miliar × 500 byte = 50 TB
   - Storage media per hari: asumsi 10% user kirim media = 200 juta × 2MB = 400 TB
   - Total storage per hari: ~450 TB
   - Request per detik (peak): ~1-2 juta
```

---

### Latihan 2: Sketsa Desain — Dari Kecil ke Besar

Gambar di kertas (atau digital) desain untuk 3 skenario berbeda. Perhatikan bagaimana arsitektur berubah.

**Skenario A: Aplikasi Kasir Warung**
- 1 kasir
- 100 transaksi/hari
- Tidak perlu internet (offline-first)
- Data disimpan lokal

**Desain yang Cocok:**
```
┌─────────┐     ┌──────────────┐     ┌──────────┐
│  Kasir  │────▶│  Aplikasi    │────▶│ SQLite   │
│ (Tablet)│     │  Desktop     │     │ (Local)  │
└─────────┘     └──────────────┘     └──────────┘
```
- 1 tablet/laptop
- SQLite sebagai database lokal
- Tidak perlu server
- Backup: copy file database ke USB/Google Drive

**Skenario B: Aplikasi Kasir Chain 10 Toko**
- 10 toko, masing-masing 2 kasir
- 1.000 transaksi/hari total
- Perlu sinkronisasi data antar toko
- Perlu laporan terpusat

**Desain yang Cocok:**
```
Toko 1: ┌──────────┐     ┌──────────┐
        │  Kasir   │────▶│  Local   │
        │          │     │  SQLite  │
        └──────────┘     └────┬─────┘
                              │ (sync)
Toko 2: ┌──────────┐     ┌────▼─────┐     ┌──────────┐
        │  Kasir   │────▶│  Local   │────▶│  Central │
        │          │     │  SQLite  │     │  Server  │
        └──────────┘     └──────────┘     │(PostgreSQL)
                                          └────┬─────┘
Toko 3: ...sync...                             │
                                               ▼
                                          ┌──────────┐
                                          │ Dashboard│
                                          │  Admin   │
                                          └──────────┘
```
- Setiap toko punya database lokal (offline-first)
- Sinkronisasi ke server pusat saat ada internet
- Server pusat: PostgreSQL untuk aggregasi data
- Dashboard admin untuk monitoring

**Skenario C: Aplikasi E-commerce Nasional**
- 10.000 pengguna aktif
- 1.000 transaksi/hari
- Multi-payment (transfer, e-wallet, COD)
- Real-time inventory

**Desain yang Cocok:**
```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│  User    │────▶│   CDN    │────▶│  Load        │
│ (Browser)│     │(Static)  │     │  Balancer    │
└──────────┘     └──────────┘     └──────┬───────┘
                                         │
                              ┌──────────▼──────────┐
                              │    Web Servers       │
                              │    (3 instances)     │
                              └──────────┬──────────┘
                                         │
                              ┌──────────▼──────────┐
                              │    Redis Cache       │
                              │  (Product catalog,   │
                              │   session, cart)     │
                              └──────────┬──────────┘
                                         │
                              ┌──────────▼──────────┐
                              │    App Server        │
                              │  (Business logic)    │
                              └──────┬───────┬──────┘
                                     │       │
                              ┌──────▼──┐ ┌──▼──────┐
                              │PostgreSQL│ │ MongoDB │
                              │(Orders,  │ │(Product │
                              │ Users)   │ │ catalog)│
                              └─────────┘ └─────────┘
```
- CDN untuk static assets (gambar produk, CSS, JS)
- Load balancer untuk distribusi traffic
- Redis cache untuk product catalog (read-heavy)
- PostgreSQL untuk data transaksional (orders, users) — butuh ACID
- MongoDB untuk product catalog — schema fleksibel, mudah scale

**Pertanyaan Refleksi:**
1. Apa perbedaan utama antara desain A, B, dan C?
2. Kenapa Skenario A tidak butuh server?
3. Kenapa Skenario B butuh sinkronisasi?
4. Kenapa Skenario C butuh CDN dan cache?

---

### Latihan 3: Back-of-the-Envelope Estimation Practice

**Soal 1:** Anda diminta mendesain sistem untuk menyimpan foto profil pengguna.
- 10 juta pengguna
- Setiap user punya 1 foto profil
- Rata-rata ukuran foto: 2 MB
- Berapa total storage yang dibutuhkan?

<details open>
<summary><strong>Jawaban (klik untuk melihat)</strong></summary>

```
Total storage = 10 juta × 2 MB = 20 juta MB = 20 TB
```

Dengan asumsi foto tidak berubah sering, 20 TB untuk semua foto profil. Kalau ditambah thumbnail (100 KB per user):
```
Thumbnail storage = 10 juta × 100 KB = 1 TB
Total = 20 TB + 1 TB = 21 TB
```
</details>

---

**Soal 2:** Sistem notifikasi email untuk platform e-learning.
- 500.000 siswa
- Setiap siswa menerima rata-rata 5 email/minggu
- Rata-rata ukuran email: 50 KB
- Berapa email per detik yang harus bisa di-handle?
- Berapa storage email per tahun?

<details>
<summary><strong>Jawaban (klik untuk melihat)</strong></summary>

```
Email per minggu: 500.000 × 5 = 2.500.000 email
Email per detik: 2.500.000 / 7 / 24 / 3600 ≈ 4.13 email/detik

Storage per minggu: 2.500.000 × 50 KB = 125 GB
Storage per tahun: 125 GB × 52 = 6.500 GB = 6.5 TB
```

Catatan: Ini hanya untuk notifikasi, bukan email marketing. Kalau ada email marketing (bulk), angkanya bisa 10-100x lebih besar.
</details>

---

**Soal 3:** Sistem absensi online untuk 1000 sekolah di satu kabupaten.
- Setiap sekolah rata-rata 200 siswa
- Absensi 2x per hari (masuk dan pulang)
- 200 hari efektif per tahun
- Setiap record absensi: ~200 byte
- Berapa record per hari (seluruh kabupaten)?
- Berapa storage per tahun?

<details>
<summary><strong>Jawaban (klik untuk melihat)</strong></summary>

```
Total siswa: 1000 sekolah × 200 siswa = 200.000 siswa
Record per hari: 200.000 × 2 (masuk+pulang) = 400.000 record
Record per tahun: 400.000 × 200 hari = 80.000.000 record

Storage per tahun: 80.000.000 × 200 byte = 16.000.000.000 byte
                  = 16 GB
```

16 GB per tahun sangat kecil. Bahkan dengan 10 tahun data = 160 GB, masih bisa di-handle oleh 1 server dengan SSD.
</details>

---

### Latihan 4: Design Exercise — Sistem Perpustakaan Sekolah

**Requirements:**
- 1 perpustakaan dengan 5000 buku
- 200 siswa yang bisa meminjam
- Maksimal 2 buku per siswa
- Durasi pinjam: 14 hari
- Perlu tracking: siapa pinjam apa, kapan kembali, denda keterlambatan
- Perlu laporan: buku paling populer, siswa paling aktif

**Tugas:**
1. Identifikasi use cases
2. Buat high-level design
3. Desain database schema
4. Estimasi storage
5. Identifikasi potential bottleneck

<details>
<summary><strong>Solusi Lengkap (klik untuk melihat)</strong></summary>

**1. Use Cases:**
```
- Siswa bisa search buku (by judul, penulis, kategori)
- Siswa bisa pinjam buku (max 2)
- Siswa bisa kembalikan buku
- Petugas bisa input buku baru
- Petugas bisa input denda keterlambatan
- Admin bisa generate laporan
```

**2. High-Level Design:**
```
┌──────────┐     ┌──────────────┐     ┌──────────┐
│  Siswa/  │────▶│  Aplikasi    │────▶│ Database │
│  Petugas │     │  Web         │     │(PostgreSQL)
└──────────┘     └──────────────┘     └──────────┘
                      │
                      ▼
               ┌──────────────┐
               │  Laporan     │
               │  (PDF/Excel) │
               └──────────────┘
```

**3. Database Schema:**
```sql
-- Tabel Buku
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    isbn VARCHAR(13) UNIQUE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    total_copies INT NOT NULL,
    available_copies INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Siswa
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    nis VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    class VARCHAR(20),
    max_borrow INT DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Peminjaman
CREATE TABLE borrowings (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id),
    book_id INT REFERENCES books(id),
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    fine DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'borrowed'
    -- status: 'borrowed', 'returned', 'overdue'
);

-- Index untuk performa
CREATE INDEX idx_borrowings_student ON borrowings(student_id);
CREATE INDEX idx_borrowings_book ON borrowings(book_id);
CREATE INDEX idx_borrowings_status ON borrowings(status);
CREATE INDEX idx_books_category ON books(category);
```

**4. Estimasi Storage:**
```
Buku: 5000 × 200 byte = 1 MB
Siswa: 200 × 200 byte = 40 KB
Peminjaman per tahun: 200 siswa × 10 pinjam/tahun = 2000 record
  2000 × 100 byte = 200 KB
Total per tahun: ~1.3 MB
Total 10 tahun: ~13 MB
```

Sangat kecil. SQLite pun cukup, tapi PostgreSQL lebih baik untuk relasi dan query yang kompleks.

**5. Potential Bottleneck:**
- Search buku: kalau tanpa index, full table scan. Solusi: index pada title, author, category.
- Concurrent borrow: 2 siswa pinjam buku terakhir bersamaan. Solusi: transaction dengan row-level lock.
- Laporan: query aggregate bisa lambat kalau data sudah banyak. Solusi: materialized view atau pre-computed summary table.
</details>

---

### Latihan 5: Trade-off Analysis

**Skenario:** Anda diminta memilih database untuk aplikasi e-learning yang punya:
- 100.000 siswa
- 10.000 video (masing-masing 500MB)
- Progress tracking per siswa per video (watched, paused, completed)
- Quiz dan nilai
- Forum diskusi

**Pilihan:**
A. PostgreSQL saja (semua data di 1 database)
B. PostgreSQL + MongoDB (relasional di PostgreSQL, video metadata + progress di MongoDB)
C. PostgreSQL + Redis + S3 (relasional di PostgreSQL, progress di Redis, video files di S3)

**Tugas:** Analisis trade-off setiap pilihan. Rekomendasikan yang terbaik dan jelaskan kenapa.

<details open>
<summary><strong>Analisis (klik untuk melihat)</strong></summary>

**Opsi A: PostgreSQL saja**
- ✅ Sederhana, 1 tech stack
- ✅ ACID compliant, data konsisten
- ❌ Video metadata (JSON-heavy) kurang optimal di PostgreSQL
- ❌ Progress tracking (high write volume) bisa jadi bottleneck
- ❌ Video files tidak bisa disimpan di database (terlalu besar)

**Opsi B: PostgreSQL + MongoDB**
- ✅ PostgreSQL untuk data relasional (siswa, quiz, nilai)
- ✅ MongoDB untuk video metadata (flexible schema) dan progress (high write)
- ❌ 2 database = 2 tech stack, lebih kompleks
- ❌ Video files tetap perlu tempat lain (S3 atau file server)
- ❌ Cross-database query sulit

**Opsi C: PostgreSQL + Redis + S3** ✅ RECOMMENDED
- ✅ PostgreSQL untuk data relasional (siswa, quiz, nilai, forum)
- ✅ Redis untuk progress tracking (sangat cepat, high write OK)
  - Progress di-cache, periodic flush ke PostgreSQL
- ✅ S3 untuk video files (murah, scalable, CDN integration)
- ❌ 3 komponen = lebih kompleks
- ❌ Redis data bisa hilang (perlu persistence config)

**Rekomendasi: Opsi C**
Alasan:
1. Video files HARUS di object storage (S3), tidak bisa di database
2. Progress tracking adalah high-write operation, Redis jauh lebih cocok
3. PostgreSQL tetap untuk data yang butuh ACID (nilai, pembayaran)
4. S3 bisa diintegrasikan dengan CDN untuk streaming video yang smooth
</details>

---

## ✅ CHECKLIST

Pastikan Anda memahami hal-hal ini sebelum lanjut ke materi berikutnya:

### Pemahaman Konsep Dasar
- [ ] Bisa menjelaskan apa itu system design dengan bahasa sendiri
- [ ] Paham perbedaan system design dan software architecture
- [ ] Mengerti analogi "denah rumah" untuk system design
- [ ] Paham konsep "trade-off" — tidak ada solusi sempurna

### Konsep Teknis
- [ ] Paham perbedaan vertical scaling vs horizontal scaling
- [ ] Paham perbedaan latency vs throughput
- [ ] Paham CAP theorem dan bisa menjelaskan CP vs AP
- [ ] Paham 3 consistency patterns: weak, eventual, strong
- [ ] Paham cara menghitung availability (99.9%, 99.99%, dll)
- [ ] Hafal latency numbers penting (memory vs disk vs network)

### Komponen Sistem
- [ ] Paham fungsi Load Balancer dan algoritmanya
- [ ] Paham fungsi Cache dan strateginya (cache-aside, write-through, write-behind)
- [ ] Paham database replication (master-slave, master-master)
- [ ] Paham database sharding dan kapan menggunakannya
- [ ] Paham fungsi Message Queue dan use cases-nya
- [ ] Paham konsep Microservices vs Monolith

### Praktis
- [ ] Bisa melakukan back-of-the-envelope estimation
- [ ] Bisa mengidentifikasi komponen dasar sebuah aplikasi
- [ ] Bisa membuat high-level design untuk aplikasi sederhana
- [ ] Paham bahwa desain harus sesuai kebutuhan (tidak over/under-engineer)
- [ ] Bisa menganalisis trade-off antara beberapa pilihan arsitektur

### Interview Preparation
- [ ] Paham 4 langkah system design interview
- [ ] Bisa melakukan requirement gathering (use cases, constraints, assumptions)
- [ ] Bisa membuat high-level design dengan semua komponen utama
- [ ] Bisa mengidentifikasi bottleneck dan propose solusi scaling

---

## 🔗 REFERENSI

### Sumber Utama
- **Repo Asli:** [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) — Baca bagian "Motivation", "Study guide", dan "How to approach a system design interview question"
- **Scalability Lecture:** [Harvard CS50 Scalability](https://www.youtube.com/watch?v=-W9F__D3oY4) — Video kuliah tentang scalability, vertical/horizontal scaling, caching, load balancing, replication, partitioning

### Artikel Wajib Baca
- **Scalability for Dummies (4 bagian):**
  - [Part 1: Clones](https://web.archive.org/web/20220530193911/https://www.lecloud.net/post/7295452622/scalability-for-dummies-part-1-clones)
  - [Part 2: Database](https://web.archive.org/web/20220602114024/https://www.lecloud.net/post/7994751381/scalability-for-dummies-part-2-database)
  - [Part 3: Cache](https://web.archive.org/web/20230126233752/https://www.lecloud.net/post/9246290032/scalability-for-dummies-part-3-cache)
  - [Part 4: Asynchronism](https://web.archive.org/web/20220926171507/https://www.lecloud.net/post/9699762917/scalability-for-dummies-part-4-asynchronism)

- **A Word on Scalability:** [allthingsdistributed.com](http://www.allthingsdistributed.com/2006/03/a_word_on_scalability.html) — Definisi formal scalability
- **CAP Theorem:** [A Plain English Introduction](http://ksat.me/a-plain-english-introduction-to-cap-theorem) — Penjelasan CAP theorem dalam bahasa sederhana
- **Back-of-the-envelope Calculations:** [Google Pro Tip](http://highscalability.com/blog/2011/1/26/google-pro-tip-use-back-of-the-envelope-calculations-to-choo.html) — Cara estimasi cepat ala Google engineer

### Interview Preparation
- **How to Ace a Systems Design Interview:** [Palantir](https://web.archive.org/web/20210505130322/https://www.palantir.com/2011/10/how-to-rock-a-systems-design-interview/)
- **The System Design Interview:** [HiredInTech](http://www.hiredintech.com/system-design)
- **Intro to Architecture and Systems Design Interviews:** [YouTube](https://www.youtube.com/watch?v=ZgdS0EUmn70)
- **System Design Template:** [LeetCode Discussion](https://leetcode.com/discuss/career/229177/My-System-Design-Template)

### Latency Reference
- **Latency Numbers Every Programmer Should Know:** [Colin Scott](https://colin-scott.github.io/personal_website/research/interactive_latency.html) — Referensi lengkap latency numbers

### Real-World Architecture
- **High Scalability Blog:** [highscalability.com](http://highscalability.com/) — Analisis arsitektur sistem-sistem besar (YouTube, WhatsApp, Instagram, dll)
- **Company Engineering Blogs:** Baca engineering blog dari perusahaan yang Anda minati (Netflix, Uber, Airbnb, Gojek, Tokopedia)

---

## 📚 GLOSARIUM ISTILAH TEKNIS

| Istilah | Definisi | Contoh |
| --- | --- | --- |
| **Scalability** | Kemampuan sistem menangani pertumbuhan | Aplikasi bisa handle dari 100 ke 1 juta user |
| **Performance** | Kecepatan sistem merespons | Halaman load dalam 200ms |
| **Latency** | Waktu untuk 1 request selesai | 50ms untuk query database |
| **Throughput** | Jumlah request per satuan waktu | 10.000 request/detik |
| **Availability** | Persentase waktu sistem bisa diakses | 99.9% = downtime 8.76 jam/tahun |
| **Reliability** | Konsistensi hasil sistem | Selalu memberikan hasil yang benar |
| **Load Balancer** | Distribusi traffic ke banyak server | NGINX, HAProxy, AWS ALB |
| **Cache** | Penyimpanan sementara untuk data yang sering diakses | Redis, Memcached |
| **Replication** | Duplikasi data ke banyak node | Master-slave database |
| **Sharding** | Pembagian data ke banyak database | User A-F di shard 1, G-L di shard 2 |
| **Microservices** | Arsitektur dengan service-service kecil terpisah | User service, Order service, Payment service |
| **Monolith** | Arsitektur dengan semua fitur dalam 1 aplikasi | Aplikasi tradisional single codebase |
| **Message Queue** | Buffer untuk async communication antar service | RabbitMQ, Kafka |
| **CDN** | Network server global untuk deliver konten | CloudFlare, CloudFront |
| **API Gateway** | Single entry point untuk semua API | Kong, AWS API Gateway |
| **CAP Theorem** | Dalam distributed system, hanya bisa pilih 2 dari 3: Consistency, Availability, Partition Tolerance | CP: MongoDB, AP: Cassandra |
| **ACID** | Atomicity, Consistency, Isolation, Durability — properti transaksi database | PostgreSQL, MySQL |
| **TTL** | Time To Live — berapa lama data di-cache | TTL 3600 = cache expired setelah 1 jam |
| **Failover** | Proses otomatis switch ke backup saat primary gagal | Active-passive server |
| **Redundancy** | Duplikasi komponen untuk high availability | 2 server identik, 1 aktif 1 standby |

---

> **Lanjut ke:** [02-performance-vs-scalability.md](./02-performance-vs-scalability.md)
