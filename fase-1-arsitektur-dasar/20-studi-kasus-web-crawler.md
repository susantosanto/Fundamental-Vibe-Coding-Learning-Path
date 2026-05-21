# 20 — Studi Kasus: Desain Web Crawler

> **Estimasi:** 3 jam | **Level:** Menengah-Lanjut
> **Sumber:** [donnemartin/system-design-primer — Web Crawler](https://github.com/donnemartin/system-design-primer/tree/master/solutions/system_design/web_crawler)

---

## 📖 TEORI

### 20.1 Pendahuluan

Web Crawler (juga disebut spider atau bot) adalah program komputer yang menjelajahi World Wide Web secara sistematis dan otomatis untuk mengumpulkan data dari halaman web. Web crawler adalah fondasi dari mesin pencari (Google, Bing, Yahoo), web archive (Archive.org), dan berbagai tools monitoring.

**Kenapa Web Crawler penting dipelajari?**

Karena web crawler menguji pemahaman Anda tentang:
- **Distributed systems** — crawling harus paralel dan terdistribusi
- **Data deduplication** — miliaran halaman, banyak yang duplikat
- **Rate limiting & politeness** — etika dan teknis tidak overload server
- **Storage optimization** — menyimpan petabytes data secara efisien
- **Graph traversal** — web adalah graph raksasa (halaman = node, link = edge)
- **Fault tolerance** — server target bisa down, timeout, atau block

---

### 20.2 Use Cases dan Aplikasi Nyata

| Use Case | Deskripsi | Skala |
|---|---|---|
| **Search Engine Indexing** | Google, Bing crawl semua website untuk indexing | Triliunan halaman |
| **Web Archive** | Archive.org menyimpan snapshot halaman web | 800+ miliar halaman |
| **Price Monitoring** | Crawl harga produk dari e-commerce kompetitor | Ribuan produk/hari |
| **SEO Audit** | Crawl website sendiri untuk cari broken link, duplikat | Ribuan halaman |
| **Content Aggregation** | Kumpulkan berita dari berbagai portal | Ratusan sumber |
| **Security Scanning** | Cari vulnerability di website (bug bounty) | Ribuan endpoint |
| **Academic Research** | Analisis struktur web, link graph | Jutaan halaman |
| **Job Aggregation** | Kumpulkan lowongan dari berbagai job board | Ratusan ribu listing |

---

### 20.3 Requirements Analysis

#### A. Functional Requirements

| # | Requirement | Deskripsi |
|---|---|---|
| FR-1 | **Seed URL** | Mulai dari daftar URL awal (seed) |
| FR-2 | **Download HTML** | Download konten halaman web |
| FR-3 | **Parse Content** | Ekstrak teks, metadata, dan link dari HTML |
| FR-4 | **Extract Links** | Temukan semua URL baru dari halaman yang di-crawl |
| FR-5 | **Store Data** | Simpan konten halaman yang sudah di-crawl |
| FR-6 | **Deduplication** | Jangan crawl halaman yang sama dua kali |
| FR-7 | **Politeness** | Hormati robots.txt dan rate limit |
| FR-8 | **Priority Queue** | Crawl halaman penting lebih dulu |

#### B. Non-Functional Requirements

| # | Requirement | Target | Alasan |
|---|---|---|---|
| NFR-1 | **Throughput** | 400 halaman/detik | Skala miliaran halaman per bulan |
| NFR-2 | **Storage** | 10 PB (10 juta GB) | Simpan konten halaman |
| NFR-3 | **Bandwidth** | ~1 Gbps sustained | Download jutaan halaman |
| NFR-4 | **Freshness** | Update halaman populer setiap hari | Konten harus up-to-date |
| NFR-5 | **Politeness** | Max 1 req/detik per domain | Jangan overload server target |
| NFR-6 | **Fault Tolerance** | Handle server down, timeout, redirect | Internet tidak reliable |
| NFR-7 | **Scalability** | Bisa scale horizontal | Tambah worker = tambah throughput |

---

### 20.4 Capacity Estimation

Perhitungan detail untuk menentukan resource yang dibutuhkan:

```
┌─────────────────────────────────────────────────────────────┐
│ CAPACITY ESTIMATION — WEB CRAWLER                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ASUMSI:                                                    │
│  ───────                                                    │
│  - Target: 1 miliar halaman per bulan                       │
│  - Rata-rata ukuran halaman: 500 KB (compressed)            │
│  - Rata-rata link per halaman: 50                           │
│  - Rata-rata waktu download: 250 ms                         │
│  - Duplicate rate: 30% (30% halaman sudah pernah di-crawl)  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  THROUGHPUT                                                 │
│  ─────────                                                  │
│  Halaman per bulan  = 1 miliar                              │
│  Halaman per hari   = 1B / 30 = ~33.3 juta/hari             │
│  Halaman per detik  = 33.3M / 86,400 = ~386/detik           │
│  Peak (3x avg)      = ~1,158/detik                          │
│                                                             │
│  Dengan 30% duplicate:                                      │
│  URL yang perlu dicek = 1B / 0.7 = ~1.43 miliar/bulan       │
│  URL check per detik  = ~552/detik                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  STORAGE                                                    │
│  ─────────                                                  │
│  Konten per bulan   = 1B × 500 KB = 500 TB                  │
│  Konten per tahun   = 500 TB × 12 = 6 PB                    │
│  Dengan replikasi 2x = 12 PB                                │
│  Index (metadata)   = 1B × 1 KB = 1 TB                      │
│  URL frontier       = 100M URL × 200 bytes = 20 GB          │
│                                                             │
│  Total storage/tahun = ~12 PB + 1 TB + 20 GB ≈ 12 PB        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  BANDWIDTH                                                  │
│  ─────────                                                  │
│  Download/hari      = 33.3M × 500 KB = 16.65 TB             │
│  Bandwidth sustained = 16.65 TB / 86,400s = ~193 MB/s       │
│                     = ~1.5 Gbps                             │
│  Peak bandwidth     = ~4.5 Gbps                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  WORKER COUNT                                               │
│  ─────────────                                              │
│  1 worker bisa download ~10 halaman/detik                   │
│  (asumsi: network tidak bottleneck, polite delay 100ms)     │
│                                                             │
│  Worker dibutuhkan  = 386 / 10 = ~39 worker                 │
│  Dengan redundancy  = 39 × 2 = ~80 worker                   │
│                                                             │
│  Tapi: Politeness constraint!                               │
│  - 1 req/detik per domain                                   │
│  - Jika crawl 10,000 domain berbeda                         │
│  - Max throughput = 10,000 req/detik                        │
│  - Kita butuh 386 req/detik → cukup dengan 386 domain aktif │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  DNS RESOLUTION                                             │
│  ──────────────────                                         │
│  DNS query per URL  = 1 (jika belum di-cache)               │
│  DNS query/detik    = ~552 (termasuk duplicate check)       │
│  DNS cache hit rate = ~90% (domain sering dikunjungi)       │
│  DNS query aktual   = 552 × 0.1 = ~55/detik                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 20.5 High-Level Architecture

Arsitektur web crawler terdiri dari pipeline komponen yang bekerja secara terkoordinasi:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        WEB CRAWLER ARCHITECTURE                              │
└──────────────────────────────────────────────────────────────────────────────┘

  ┌──────────┐
  │ Seed URLs│ → Daftar URL awal (wikipedia.org, cnn.com, dll)
  └────┬─────┘
       │
       ▼
┌──────────────────┐
│  URL Frontier    │ ← Priority Queue: URL mana yang di-crawl berikutnya
│  (Antrian URL)   │   - Prioritas berdasarkan PageRank, freshness, dll
│                  │   - Per-domain rate limiting
│                  │   - Deduplication check
└────────┬─────────┘
         │ URL batch (per domain)
         ▼
┌──────────────────┐
│  DNS Resolver    │ ← Resolve domain → IP address
│  (DNS Cache)     │   - Cache DNS result (TTL aware)
│                  │   - Async DNS resolution
└────────┬─────────┘
         │ IP address
         ▼
┌──────────────────┐
│  HTML Downloader │ ← HTTP GET request ke server target
│  (Fetcher)       │   - Connection pooling per domain
│                  │   - Timeout handling (5 detik)
│                  │   - Retry dengan backoff
│                  │   - Handle redirect (301, 302)
└────────┬─────────┘
         │ Raw HTML
         ▼
┌──────────────────┐
│  Content Parser  │ ← Parse HTML, ekstrak data
│  (HTML Parser)   │   - Extract title, meta, text content
│                  │   - Extract semua <a href="...">
│                  │   - Extract canonical URL
│                  │   - Handle encoding (UTF-8, ISO-8859-1)
└────────┬─────────┘
         │
    ┌────┴────────────┐
    ▼                 ▼
┌──────────┐   ┌──────────────┐
│ Link     │   │ Content      │
│ Extractor│   │ Storage      │
└────┬─────┘   └──────┬───────┘
     │                │
     ▼                ▼
┌──────────┐   ┌──────────────┐
│ URL      │   │ Data Store   │
│ Normalizer│  │ (Distributed │
│ &        │   │  Storage)    │
│ Deduplic│   └──────────────┘
│ ation    │
└────┬─────┘
     │
     ▼
┌──────────────────┐
│  URL Frontier    │ ← URL baru ditambahkan ke antrian
│  (Update)        │
└──────────────────┘
```

**Penjelasan Alur Data:**

```
1. Seed URLs dimasukkan ke URL Frontier
2. URL Frontier memilih URL berikutnya berdasarkan prioritas
3. DNS Resolver resolve domain → IP (dengan caching)
4. HTML Downloader fetch halaman dari server
5. Content Parser parse HTML, ekstrak teks dan link
6. Link Extractor temukan URL baru dari <a href>
7. URL Normalizer bersihkan dan normalisasi URL
8. Deduplication cek apakah URL sudah pernah di-crawl
9. URL baru (belum di-crawl) ditambahkan ke URL Frontier
10. Konten disimpan ke Data Store
11. Ulangi dari langkah 2
```

---

### 20.6 Komponen Detail

#### A. URL Frontier (Priority Queue)

URL Frontier adalah "otak" dari crawler — menentukan URL mana yang di-crawl berikutnya:

```
┌─────────────────────────────────────────────────────────────┐
│ URL FRONTIER — DETAIL                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STRUKTUR DATA:                                             │
│  ─────────────                                              │
│  - Priority Queue (min-heap) berdasarkan score              │
│  - Per-domain queue (untuk enforce politeness)              │
│  - Bloom Filter untuk seen-URL check                        │
│                                                             │
│  PRIORITAS SCORING:                                         │
│  ────────────────────                                       │
│  Score = f(PageRank, freshness, depth, domain_importance)   │
│                                                             │
│  Faktor prioritas:                                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Faktor           │ Bobot │ Penjelasan                │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ PageRank         │ 30%   │ Halaman populer = penting │   │
│  │ Freshness        │ 25%   │ Halaman lama = perlu update│   │
│  │ Domain authority │ 20%   │ .gov, .edu = prioritas     │   │
│  │ Link depth       │ 15%   │ Halaman dekat seed = penting│  │
│  │ Change frequency │ 10%   │ Sering berubah = sering crawl│ │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  PER-DOMAIN QUEUE:                                          │
│  ─────────────────────                                      │
│  Untuk enforce politeness, URL dikelompokkan per domain:    │
│                                                             │
│  Queue cnn.com:     [url1, url2, url3, ...]                 │
│  Queue wikipedia.org: [url1, url2, url3, ...]               │
│  Queue detik.com:   [url1, url2, url3, ...]                 │
│                                                             │
│  Setiap queue punya "next_crawl_time":                      │
│  - cnn.com: next_crawl = 10:00:01 (last: 10:00:00 + 1s)    │
│  - wikipedia.org: next_crawl = 10:00:00 (ready!)            │
│                                                             │
│  Scheduler memilih queue yang ready, ambil 1 URL,           │
│  update next_crawl_time, kirim ke downloader.               │
│                                                             │
│  IMPLEMENTASI:                                              │
│  ─────────────                                              │
│  - Redis Sorted Set (score = priority)                      │
│  - Apache Kafka (topic per domain)                          │
│  - Custom priority queue dengan sharding                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### B. DNS Resolver

DNS resolution bisa jadi bottleneck jika tidak di-handle dengan benar:

```
┌─────────────────────────────────────────────────────────────┐
│ DNS RESOLVER — DETAIL                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MASALAH:                                                   │
│  - DNS query lambat (50-200ms per query)                    │
│  - DNS server bisa rate limit                               │
│  - DNS cache bisa stale                                     │
│                                                             │
│  SOLUSI:                                                    │
│  ───────                                                    │
│  1. DNS Cache (in-memory):                                  │
│     - Cache domain → IP mapping                             │
│     - Respect TTL dari DNS response                         │
│     - Pre-fetch sebelum TTL expire                          │
│                                                             │
│  2. Async DNS Resolution:                                   │
│     - Resolve DNS secara async (tidak blocking)             │
│     - Batch DNS query untuk domain yang sama                │
│     - Gunakan DNS over UDP (lebih cepat dari TCP)           │
│                                                             │
│  3. DNS Server Rotation:                                    │
│     - Gunakan multiple DNS server (8.8.8.8, 1.1.1.1, dll)   │
│     - Rotate untuk avoid rate limiting                      │
│                                                             │
│  4. IP Caching:                                             │
│     - Simpan IP address yang sudah di-resolve               │
│     - Reuse connection ke IP yang sama                      │
│                                                             │
│  CACHE STRUCTURE:                                           │
│  ─────────────────                                          │
│  Key:   domain name (cnn.com)                               │
│  Value: [IP1, IP2, ...]                                    │
│  TTL:   sesuai DNS response TTL                             │
│  Eviction: LRU (Least Recently Used)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### C. HTML Downloader (Fetcher)

Komponen yang benar-benar melakukan HTTP request:

```
┌─────────────────────────────────────────────────────────────┐
│ HTML DOWNLOADER — DETAIL                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PROTOCOL SUPPORT:                                          │
│  ──────────────────                                         │
│  - HTTP/1.1 (connection pooling)                            │
│  - HTTP/2 (multiplexing, header compression)                │
│  - HTTPS (SSL/TLS handshake)                                │
│  - robots.txt check sebelum crawl                           │
│                                                             │
│  CONNECTION POOLING:                                        │
│  ──────────────────────                                     │
│  - Pool per domain (max 2 koneksi per domain)               │
│  - Keep-alive connection (reuse TCP connection)             │
│  - Connection timeout: 5 detik                              │
│  - Read timeout: 10 detik                                   │
│                                                             │
│  ERROR HANDLING:                                            │
│  ───────────────                                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ HTTP Status │ Action                                  │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ 200 OK      │ Parse dan simpan                        │   │
│  │ 301 Moved   │ Follow redirect (max 5 redirect)        │   │
│  │ 302 Found   │ Follow redirect (temporary)             │   │
│  │ 404 Not Found │ Log, jangan crawl lagi                │   │
│  │ 403 Forbidden │ Log, respect (mungkin perlu auth)     │   │
│  │ 429 Too Many │ Backoff, retry nanti (rate limited)    │   │
│  │ 500-599     │ Retry dengan backoff (server error)     │   │
│  │ Timeout     │ Retry 2 kali, lalu skip                 │   │
│  │ DNS Error   │ Skip, log error                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  RETRY STRATEGY:                                            │
│  ──────────────────                                         │
│  - Max retry: 3 kali                                        │
│  - Exponential backoff: 1s → 2s → 4s → 8s                  │
│  - Jitter: + random 0-1s (avoid thundering herd)           │
│  - Dead letter queue: URL yang gagal > 3x                   │
│                                                             │
│  COMPRESSION:                                               │
│  ────────────                                               │
│  - Accept-Encoding: gzip, deflate, br                       │
│  - Mengurangi bandwidth 60-80%                              │
│  - Decompress setelah download                              │
│                                                             │
│  USER AGENT:                                                │
│  ───────────                                                │
│  User-Agent: MyCrawler/1.0 (+https://mycrawler.com/bot)     │
│  - Identifikasi bot Anda                                    │
│  - Sertakan contact info                                    │
│  - Website bisa block berdasarkan User-Agent                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### D. Content Parser

Parse HTML dan ekstrak informasi yang relevan:

```
┌─────────────────────────────────────────────────────────────┐
│ CONTENT PARSER — DETAIL                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PARSING LIBRARY:                                           │
│  ──────────────────                                         │
│  - Python: BeautifulSoup, lxml, html5lib                    │
│  - Java: Jsoup, HTMLParser                                  │
│  - Go: goquery, net/html                                    │
│  - Node.js: cheerio, parse5                                 │
│                                                             │
│  EKSTRAKSI DATA:                                            │
│  ─────────────────                                          │
│  1. Metadata:                                               │
│     - <title> → judul halaman                               │
│     - <meta description> → deskripsi                        │
│     - <meta keywords> → kata kunci                          │
│     - <meta charset> → encoding                             │
│     - <link rel="canonical"> → URL kanonik                  │
│     - Open Graph tags (og:title, og:image, dll)             │
│                                                             │
│  2. Text Content:                                           │
│     - Extract text dari <p>, <h1>-<h6>, <li>, <td>          │
│     - Hapus <script>, <style>, <nav>, <footer>              │
│     - Boilerplate removal (navigasi, iklan, footer)         │
│     - Readability algorithm (seperti Mozilla Readability)   │
│                                                             │
│  3. Links:                                                  │
│     - Semua <a href="..."> → URL baru                       │
│     - <link rel="stylesheet"> → CSS files                   │
│     - <img src="..."> → image URLs                          │
│     - <script src="..."> → JavaScript files                 │
│                                                             │
│  4. Structured Data:                                        │
│     - JSON-LD (schema.org)                                  │
│     - Microdata                                             │
│     - RDFa                                                  │
│                                                             │
│  BOILERPLATE REMOVAL:                                       │
│  ──────────────────────                                     │
│  Masalah: Halaman web penuh navigasi, iklan, footer         │
│  Solusi: Hanya ambil konten utama                           │
│                                                             │
│  Algoritma:                                                 │
│  1. Hitung text density per blok (text/HTML ratio)          │
│  2. Blok dengan density tinggi = konten utama               │
│  3. Blok dengan density rendah = boilerplate                │
│  4. Hapus boilerplate, simpan konten utama                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 20.7 Politeness Policy

Politeness adalah etika crawling — jangan merusak server target:

```
┌─────────────────────────────────────────────────────────────┐
│ POLITENESS POLICY — DETAIL                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. ROBOTS.TXT                                              │
│  ─────────────                                              │
│  Setiap website punya /robots.txt yang menentukan:          │
│  - Path mana yang boleh di-crawl                            │
│  - Path mana yang dilarang                                  │
│  - Crawl-delay (jeda antar request)                         │
│  - User-agent spesifik                                      │
│                                                             │
│  Contoh robots.txt:                                         │
│  ─────────────────────                                      │
│  User-agent: *                                              │
│  Disallow: /admin/                                          │
│  Disallow: /private/                                        │
│  Disallow: /search?q=                                       │
│  Crawl-delay: 2                                             │
│                                                             │
│  User-agent: MyCrawler                                      │
│  Allow: /public/                                            │
│  Disallow: /api/                                            │
│                                                             │
│  Parser robots.txt:                                         │
│  - Parse saat pertama kali crawl domain                     │
│  - Cache result (refresh setiap 24 jam)                     │
│  - Respect semua Disallow rule                              │
│  - Respect Crawl-delay                                      │
│                                                             │
│  2. RATE LIMITING PER DOMAIN                                │
│  ───────────────────────────────                            │
│  - Minimal 1 detik antar request ke domain yang sama        │
│  - Jika Crawl-delay di robots.txt > 1s, ikuti yang lebih    │
│    besar                                                    │
│  - Jika server lambat respond, kurangi kecepatan            │
│  - Jika dapat 429 (Too Many Requests), backoff              │
│                                                             │
│  3. SERVER LOAD DETECTION                                   │
│  ─────────────────────────────                              │
│  Monitor response time server target:                       │
│  - Normal: < 500ms → crawl normal                           │
│  - Lambat: 500ms-2s → kurangi kecepatan 50%                 │
│  - Sangat lambat: > 2s → pause crawl domain ini             │
│  - Error 5xx → pause dan retry nanti                        │
│                                                             │
│  4. TIME-BASED CRAWLING                                     │
│  ─────────────────────────────                              │
│  - Crawl di jam sepi (malam 00:00-06:00) untuk server lokal │
│  - Hindari jam sibuk (09:00-17:00)                          │
│  - Pertimbangkan timezone server target                     │
│                                                             │
│  5. CONCURRENT CONNECTION LIMIT                             │
│  ─────────────────────────────────                          │
│  - Max 2 koneksi simultan per domain                        │
│  - Max 10 koneksi simultan per IP block (/24)               │
│  - Rotate IP jika perlu (proxy rotation)                    │
│                                                             │
│  IMPLEMENTASI:                                              │
│  ─────────────                                              │
│  - Token bucket algorithm per domain                        │
│  - Setiap domain punya "token" yang refill 1/detik          │
│  - Request butuh 1 token, kalau tidak ada → wait            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 20.8 URL Deduplication

Jangan crawl halaman yang sama dua kali:

```
┌─────────────────────────────────────────────────────────────┐
│ URL DEDUPLICATION — DETAIL                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MASALAH URL DUPLIKAT:                                      │
│  ─────────────────────────────                              │
│  URL berikut sebenarnya halaman yang SAMA:                  │
│                                                             │
│  https://contoh.com/artikel                                 │
│  https://contoh.com/ARTIKEL          ← case insensitive     │
│  https://contoh.com/artikel/         ← trailing slash       │
│  https://contoh.com/artikel?ref=email ← query param         │
│  https://contoh.com/artikel?ref=twitter ← query param       │
│  http://contoh.com/artikel           ← http vs https        │
│  https://www.contoh.com/artikel      ← www vs non-www       │
│                                                             │
│  URL NORMALIZATION:                                         │
│  ─────────────────────                                      │
│  1. Lowercase: https://CONTOH.com → https://contoh.com      │
│  2. Remove fragment: #section → hapus                       │
│  3. Normalize path: /a/b/../c → /a/c                        │
│  4. Add trailing slash: /artikel → /artikel/                │
│  5. Remove tracking params: ?utm_source=, ?ref=, ?fbclid=   │
│  6. Normalize protocol: http → https                        │
│  7. Normalize www: www.contoh.com → contoh.com              │
│  8. Remove default port: :80, :443 → hapus                  │
│  9. Decode percent-encoding: %20 → space                    │
│                                                             │
│  DEDUPLICATION METHODS:                                     │
│  ─────────────────────────                                  │
│                                                             │
│  Method 1: Hash Set (Exact Match)                           │
│  ─────────────────────────────────                          │
│  - Hash URL normalized → SHA-256                            │
│  - Simpan di hash set                                       │
│  - Cek: apakah hash sudah ada?                              │
│  - Memory: 1 miliar URL × 32 bytes = 32 GB                  │
│  - Kecepatan: O(1) lookup                                   │
│                                                             │
│  Method 2: Bloom Filter (Probabilistic)                     │
│  ─────────────────────────────────────                      │
│  - Struktur data probabilistic                              │
│  - "Mungkin sudah di-crawl" atau "Pasti belum"              │
│  - False positive rate: 1% (bisa salah positif)             │
│  - Memory: 1 miliar URL × 10 bits = ~1.2 GB                 │
│  - Kecepatan: O(k) dimana k = jumlah hash function          │
│  - Trade-off: Hemat memory, ada false positive              │
│                                                             │
│  Method 3: Distributed Bloom Filter                         │
│  ─────────────────────────────────────                      │
│  - Untuk skala sangat besar (triliunan URL)                 │
│  - Shard Bloom Filter across multiple nodes                 │
│  - Consistent hashing untuk routing                         │
│  - Memory per node: 1.2 GB × N nodes                        │
│                                                             │
│  BLOOM FILTER DETAIL:                                       │
│  ─────────────────────                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Bit Array: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]        │   │
│  │                                                      │   │
│  │ URL: "https://contoh.com/artikel"                    │   │
│  │ Hash 1: position 3 → set bit[3] = 1                  │   │
│  │ Hash 2: position 7 → set bit[7] = 1                  │   │
│  │ Hash 3: position 12 → set bit[12] = 1                │   │
│  │                                                      │   │
│  │ Bit Array: [0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0]        │   │
│  │                                                      │   │
│  │ Cek URL baru: "https://contoh.com/berita"            │   │
│  │ Hash 1: position 3 → bit[3] = 1 ✓                    │   │
│  │ Hash 2: position 9 → bit[9] = 0 ✗ → PASTI BELUM!     │   │
│  │                                                      │   │
│  │ Cek URL baru: "https://contoh.com/lain"              │   │
│  │ Hash 1: position 3 → bit[3] = 1 ✓                    │   │
│  │ Hash 2: position 7 → bit[7] = 1 ✓                    │   │
│  │ Hash 3: position 12 → bit[12] = 1 ✓                  │   │
│  │ → MUNGKIN sudah di-crawl (bisa false positive)       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 20.9 Content Deduplication (SimHash & MinHash)

URL berbeda bisa punya konten yang sama (mirror site, artikel yang disalin):

```
┌─────────────────────────────────────────────────────────────┐
│ CONTENT DEDUPLICATION — DETAIL                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MASALAH:                                                   │
│  - Halaman A: https://site1.com/artikel                     │
│  - Halaman B: https://site2.com/copy-artikel                │
│  - Konten SAMA tapi URL BERBEDA                             │
│  - Perlu deteksi di level KONTEN, bukan URL                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  METHOD 1: SIMHASH (Near-Duplicate Detection)               │
│  ───────────────────────────────────────                    │
│                                                             │
│  SimHash menghasilkan fingerprint 64-bit untuk dokumen.     │
│  Dokumen yang mirip punya Hamming distance kecil.           │
│                                                             │
│  Algoritma:                                                 │
│  1. Tokenisasi dokumen jadi kata-kata                       │
│  2. Hash setiap kata (64-bit)                               │
│  3. Untuk setiap bit position (0-63):                       │
│     - Jika bit = 1, tambah weight kata ke accumulator       │
│     - Jika bit = 0, kurangi weight kata dari accumulator    │
│  4. Jika accumulator > 0 → bit = 1, else bit = 0           │
│  5. Hasil: 64-bit fingerprint                               │
│                                                             │
│  Contoh:                                                    │
│  Dokumen A: "saya belajar system design"                    │
│  Dokumen B: "saya belajar tentang system design"            │
│                                                             │
│  SimHash(A) = 01011010...                                   │
│  SimHash(B) = 01011010... (hampir sama!)                    │
│  Hamming distance = 2 (dari 64 bit)                         │
│  → SIMILAR! (threshold: Hamming distance ≤ 3)               │
│                                                             │
│  Google pakai SimHash untuk dedup web pages.                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  METHOD 2: MINHASH (Jaccard Similarity)                     │
│  ─────────────────────────────────────                      │
│                                                             │
│  MinHash memperkirakan Jaccard similarity antara 2 set.     │
│  Jaccard(A,B) = |A ∩ B| / |A ∪ B|                          │
│                                                             │
│  Algoritma:                                                 │
│  1. Tokenisasi dokumen jadi set kata (shingles/k-gram)      │
│  2. Apply N hash functions ke setiap kata                   │
│  3. Untuk setiap hash function, ambil minimum hash value    │
│  4. Hasil: Signature matrix (N values per dokumen)          │
│  5. Bandingkan signature: similarity = fraction yang sama   │
│                                                             │
│  Contoh dengan 3-shingles (k=3):                            │
│  Dokumen A: "system design"                                 │
│  Shingles: {"sys", "yst", "ste", "tem", "em ", "m d",       │
│             " de", "des", "esi", "sig", "ign"}              │
│                                                             │
│  Dokumen B: "system design" (sama)                          │
│  Shingles: sama persis → Jaccard = 1.0                      │
│                                                             │
│  Dokumen C: "system architecture"                           │
│  Shingles: berbeda sebagian → Jaccard = 0.3                 │
│  → TIDAK DUPlikat (threshold: Jaccard ≥ 0.8)                │
│                                                             │
│  LSH (Locality Sensitive Hashing):                          │
│  - Untuk scale ke miliaran dokumen                          │
│  - Group dokumen dengan signature mirip ke bucket sama      │
│  - Hanya bandingkan dokumen dalam bucket yang sama          │
│  - Mengurangi comparison dari O(N²) ke O(N)                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  PERBANDINGAN:                                              │
│  ─────────────                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Metode   │ Kecepatan │ Akurasi │ Memory │ Use Case   │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ SimHash  │ Cepat     │ Tinggi  │ Rendah │ Near-dup   │   │
│  │ MinHash  │ Sedang    │ Tinggi  │ Sedang │ Similarity │   │
│  │ Exact MD5│ Cepat     │ Exact   │ Rendah │ Exact dup  │   │
│  │ TF-IDF   │ Lambat    │ Tinggi  │ Tinggi │ Semantic   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 20.10 Distributed Crawling

Untuk skala miliaran halaman, crawler harus didistribusikan:

```
┌─────────────────────────────────────────────────────────────┐
│ DISTRIBUTED CRAWLING ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    MASTER NODE                       │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌───────────────┐  │    │
│  │  │ URL Frontier│ │ DNS Cache   │ │ Seen URL DB   │  │    │
│  │  │ (Priority Q)│ │ (Shared)    │ │ (Bloom Filter)│  │    │
│  │  └─────────────┘ └─────────────┘ └───────────────┘  │    │
│  │                                                     │    │
│  │  Tugas:                                             │    │
│  │  - Koordinasi URL frontier                          │    │
│  │  - Distribusi URL ke worker                         │    │
│  │  - Monitor health worker                            │    │
│  │  - Handle worker failure                            │    │
│  └─────────────────────┬───────────────────────────────┘    │
│                        │ Distribusi URL                     │
│           ┌────────────┼────────────┐                       │
│           ▼            ▼            ▼                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  WORKER 1   │ │  WORKER 2   │ │  WORKER N   │           │
│  │             │ │             │ │             │           │
│  │ DNS Resolve │ │ DNS Resolve │ │ DNS Resolve │           │
│  │ ↓           │ │ ↓           │ │ ↓           │           │
│  │ Download    │ │ Download    │ │ Download    │           │
│  │ ↓           │ │ ↓           │ │ ↓           │           │
│  │ Parse       │ │ Parse       │ │ Parse       │           │
│  │ ↓           │ │ ↓           │ │ ↓           │           │
│  │ Extract URL │ │ Extract URL │ │ Extract URL │           │
│  │ ↓           │ │ ↓           │ │ ↓           │           │
│  │ Report ke   │ │ Report ke   │ │ Report ke   │           │
│  │ Master      │ │ Master      │ │ Master      │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│  WORKER ASSIGNMENT STRATEGY:                                │
│  ───────────────────────────────                            │
│  1. Hash-based:                                             │
│     - Hash domain → assign ke worker tertentu               │
│     - Contoh: hash("cnn.com") mod N = worker_3              │
│     - Keuntungan: semua URL domain X selalu di worker yang  │
│       sama → mudah enforce politeness                       │
│                                                             │
│  2. Round-robin:                                            │
│     - Distribusi URL secara bergiliran                      │
│     - Setiap worker bisa crawl domain apapun                │
│     - Perlu shared state untuk politeness                   │
│                                                             │
│  3. Domain affinity:                                        │
│     - Worker "spesialisasi" di domain tertentu              │
│     - Worker 1: crawl .com                                  │
│     - Worker 2: crawl .org                                  │
│     - Worker 3: crawl .id                                   │
│                                                             │
│  COMMUNICATION:                                             │
│  ─────────────                                              │
│  - Master → Worker: gRPC / RabbitMQ (push URL batch)        │
│  - Worker → Master: gRPC / RabbitMQ (report result)         │
│  - Heartbeat: Worker kirim heartbeat setiap 30 detik        │
│  - Worker failure: Master re-assign URL ke worker lain      │
│                                                             │
│  DATA STORE (Shared):                                       │
│  ─────────────────────                                      │
│  - Seen URLs: Cassandra / DynamoDB (distributed)            │
│  - Content: HDFS / S3 (distributed file system)             │
│  - Index: Elasticsearch (search)                            │
│  - Metadata: PostgreSQL (relational)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 20.11 Freshness vs Comprehensiveness

Trade-off fundamental dalam crawling:

```
┌─────────────────────────────────────────────────────────────┐
│ FRESHNESS vs COMPREHENSIVENESS                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FRESHNESS:                                                 │
│  ─────────                                                  │
│  Seberapa up-to-date konten yang kita punya.                │
│                                                             │
│  - Halaman yang sering berubah (news, stock price)          │
│    perlu di-crawl sering                                    │
│  - Halaman yang jarang berubah (about page, static content) │
│    bisa di-crawl jarang                                     │
│                                                             │
│  COMPREHENSIVENESS:                                         │
│  ─────────────────────                                      │
│  Seberapa banyak halaman yang kita cover.                   │
│                                                             │
│  - Crawl semua halaman yang ditemukan                       │
│  - Termasuk halaman deep (depth 5+)                         │
│  - Termasuk halaman jarang diakses                          │
│                                                             │
│  TRADE-OFF:                                                 │
│  ─────────                                                  │
│  Resource terbatas (bandwidth, storage, compute).           │
│  Tidak bisa crawl SEMUA halaman SERING.                     │
│                                                             │
│  STRATEGI:                                                  │
│  ─────────                                                  │
│  1. Adaptive Crawl Frequency:                               │
│     - Monitor change rate setiap halaman                    │
│     - Halaman sering berubah → crawl lebih sering           │
│     - Halaman jarang berubah → crawl lebih jarang           │
│                                                             │
│  2. PageRank-based Priority:                                │
│     - Halaman dengan PageRank tinggi → crawl lebih sering   │
│     - Halaman dengan PageRank rendah → crawl lebih jarang   │
│                                                             │
│  3. Content Change Detection:                               │
│     - Simpan hash konten sebelumnya                         │
│     - Bandingkan dengan hash konten baru                    │
│     - Jika berbeda → update, jika sama → skip               │
│                                                             │
│  4. Sitemap-based Discovery:                                │
│     - Baca sitemap.xml website                              │
│     - Prioritaskan URL di sitemap                           │
│     - Sitemap biasanya berisi URL penting                   │
│                                                             │
│  FORMULA CRAWL FREQUENCY:                                   │
│  ─────────────────────────────                              │
│  crawl_interval = base_interval / (PageRank × change_rate)  │
│                                                             │
│  Dimana:                                                    │
│  - base_interval: interval dasar (misal 30 hari)            │
│  - PageRank: 0-1 (1 = paling populer)                       │
│  - change_rate: 0-1 (1 = berubah setiap hari)               │
│                                                             │
│  Contoh:                                                    │
│  - CNN homepage: PR=0.9, change=0.95 → crawl setiap 1 jam   │
│  - Blog pribadi: PR=0.1, change=0.05 → crawl setiap 6 bulan │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 20.12 Handling Dynamic Content (JavaScript Rendering)

Banyak website modern menggunakan JavaScript untuk render konten:

```
┌─────────────────────────────────────────────────────────────┐
│ HANDLING DYNAMIC CONTENT                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MASALAH:                                                   │
│  - Website SPA (React, Vue, Angular) render di client       │
│  - HTML awal kosong, konten muncul setelah JS execute       │
│  - Traditional crawler hanya dapat HTML kosong              │
│                                                             │
│  SOLUSI 1: Headless Browser                                 │
│  ─────────────────────────────                              │
│  - Gunakan Puppeteer, Playwright, atau Selenium             │
│  - Render halaman seperti browser asli                      │
│  - Execute JavaScript, tunggu konten muncul                 │
│  - Ambil DOM setelah render                                 │
│                                                             │
│  Kelebihan: Dapat semua konten                              │
│  Kekurangan:                                                │
│  - 10-100x lebih lambat dari HTTP fetch                     │
│  - Butuh lebih banyak RAM (1 browser ≈ 100-500 MB)          │
│  - Tidak scalable untuk miliaran halaman                    │
│                                                             │
│  SOLUSI 2: Hybrid Approach                                  │
│  ────────────────────────────                               │
│  - Crawl tradisional untuk halaman statis                   │
│  - Headless browser hanya untuk halaman yang butuh JS       │
│  - Deteksi: jika HTML kosong atau ada <div id="app">       │
│    tanpa konten → butuh headless browser                    │
│                                                             │
│  SOLUSI 3: API Discovery                                    │
│  ─────────────────────                                      │
│  - Monitor network request saat halaman load                │
│  - Temukan API endpoint yang dipakai website                │
│  - Langsung call API (JSON) daripada render HTML            │
│  - Jauh lebih cepat dan efisien                             │
│                                                             │
│  SOLUSI 4: Server-Side Rendering Detection                  │
│  ─────────────────────────────────────                      │
│  - Banyak website modern pakai SSR (Next.js, Nuxt)          │
│  - HTML sudah berisi konten di response awal                │
│  - Traditional crawler bisa langsung parse                  │
│  - Cek: apakah HTML berisi konten yang berarti?             │
│                                                             │
│  REKOMENDASI:                                               │
│  ─────────────                                              │
│  - Startup/small scale: headless browser untuk semua        │
│  - Medium scale: hybrid approach                            │
│  - Large scale: tradisional + API discovery                 │
│  - Google: punya rendering service sendiri (WRS)            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 20.13 Scaling Strategy

Roadmap scaling dari crawler sederhana ke distributed system:

```
┌─────────────────────────────────────────────────────────────┐
│ SCALING ROADMAP — WEB CRAWLER                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Phase 1: Single-threaded Crawler (100 halaman/hari)        │
│  ──────────────────────────────────────────────             │
│  - 1 script Python (requests + BeautifulSoup)               │
│  - Sequential: download → parse → extract → repeat          │
│  - Storage: SQLite / file system                            │
│  - Dedup: Python set()                                      │
│  - Politeness: time.sleep(1)                                │
│                                                             │
│  Phase 2: Multi-threaded Crawler (10K halaman/hari)         │
│  ──────────────────────────────────────────────             │
│  - Thread pool (10-50 concurrent requests)                  │
│  - Connection pooling                                       │
│  - Storage: PostgreSQL                                      │
│  - Dedup: Bloom Filter (in-memory)                          │
│  - Politeness: Token bucket per domain                      │
│  - Queue: Redis list                                        │
│                                                             │
│  Phase 3: Distributed Crawler (1M halaman/hari)             │
│  ────────────────────────────────────────────               │
│  - Master-worker architecture                               │
│  - 10-50 worker nodes                                       │
│  - Message queue: Kafka / RabbitMQ                          │
│  - Storage: Cassandra / DynamoDB                            │
│  - Dedup: Distributed Bloom Filter                          │
│  - DNS: Async resolver dengan cache                         │
│  - Monitoring: Prometheus + Grafana                         │
│                                                             │
│  Phase 4: Enterprise Crawler (100M+ halaman/hari)           │
│  ─────────────────────────────────────────────              │
│  - 1000+ worker nodes                                       │
│  - Multi-region deployment                                  │
│  - Custom DNS resolver                                      │
│  - Custom HTTP client (optimized)                           │
│  - Storage: HDFS / distributed object store                 │
│  - Index: Elasticsearch cluster                             │
│  - ML-based priority scoring                                │
│  - Dynamic content rendering farm                           │
│                                                             │
│  Phase 5: Google-scale (Triliunan halaman)                  │
│  ────────────────────────────────────                       │
│  - Custom hardware dan network                              │
│  - Custom distributed file system (GFS)                     │
│  - Custom database (BigTable)                               │
│  - Custom MapReduce untuk processing                        │
│  - Data center dedicated untuk crawling                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 20.14 Failure Handling & Resilience

```
┌─────────────────────────────────────────────────────────────┐
│ FAILURE HANDLING — WEB CRAWLER                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. SERVER DOWN / TIMEOUT                                   │
│  ─────────────────────────────                              │
│  - Retry dengan exponential backoff (1s → 2s → 4s → 8s)    │
│  - Max retry: 3 kali                                        │
│  - Setelah max retry → masukkan ke dead letter queue        │
│  - Dead letter queue diproses ulang nanti (misal 1 jam lagi)│
│                                                             │
│  2. DNS FAILURE                                             │
│  ─────────────                                              │
│  - Retry dengan DNS server lain                             │
│  - Cache negative result (NXDOMAIN) untuk 1 jam             │
│  - Jika semua DNS server gagal → skip domain ini            │
│                                                             │
│  3. RATE LIMITED (429)                                      │
│  ─────────────────────                                      │
│  - Baca Retry-After header jika ada                         │
│  - Jika tidak ada → backoff 60 detik                        │
│  - Kurangi crawl frequency untuk domain ini                 │
│  - Log untuk analisis                                       │
│                                                             │
│  4. INFINITE REDIRECT LOOP                                  │
│  ─────────────────────────────                              │
│  - Track redirect chain                                     │
│  - Max redirect: 5                                          │
│  - Jika > 5 redirect → stop, log error                      │
│  - Deteksi cycle: A → B → C → A                             │
│                                                             │
│  5. MALICIOUS CONTENT                                       │
│  ──────────────────────                                     │
│  - Scan untuk malware (ClamAV)                              │
│  - Jangan execute JavaScript dari halaman tidak dikenal     │
│  - Sandbox headless browser                                 │
│  - Block URL dengan pattern mencurigakan                    │
│                                                             │
│  6. WORKER CRASH                                            │
│  ─────────────                                              │
│  - Heartbeat monitoring                                     │
│  - Jika worker tidak heartbeat > 60 detik → mark dead       │
│  - Re-assign URL yang sedang diproses ke worker lain        │
│  - Auto-restart worker (systemd / Docker)                   │
│                                                             │
│  7. STORAGE FULL                                            │
│  ─────────────                                              │
│  - Monitor disk usage                                       │
│  - Alert di 80% capacity                                    │
│  - Auto-cleanup: hapus konten lama (> 1 tahun)              │
│  - Compress konten lama                                     │
│  - Scale storage (add nodes)                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 20.15 Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────┐
│ MONITORING — WEB CRAWLER                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  KEY METRICS:                                               │
│  ───────────                                                │
│  1. Throughput:                                             │
│     - Pages crawled per second/minute/hour                  │
│     - Per worker, per domain, per region                    │
│                                                             │
│  2. Queue Depth:                                            │
│     - URL frontier size (total URL antri)                   │
│     - Per-domain queue size                                 │
│     - Dead letter queue size                                │
│                                                             │
│  3. Success Rate:                                           │
│     - HTTP 200 rate (%)                                     │
│     - Error rate by status code (404, 500, timeout)         │
│     - Retry rate                                            │
│                                                             │
│  4. Performance:                                            │
│     - DNS resolution time (avg, p95, p99)                   │
│     - Download time (avg, p95, p99)                         │
│     - Parse time (avg, p95, p99)                            │
│     - End-to-end crawl time per page                        │
│                                                             │
│  5. Deduplication:                                          │
│     - Duplicate URL rate (%)                                │
│     - Duplicate content rate (%)                            │
│     - Bloom filter false positive rate                      │
│                                                             │
│  6. Politeness:                                             │
│     - Requests per domain per second                        │
│     - Rate limit hits (429 responses)                       │
│     - robots.txt violations (jika ada)                      │
│                                                             │
│  7. Storage:                                                │
│     - Total storage used                                    │
│     - Storage growth rate per day                           │
│     - Compression ratio                                     │
│                                                             │
│  ALERTING THRESHOLDS:                                       │
│  ──────────────────────                                     │
│  - Throughput turun > 50% → Investigate                     │
│  - Error rate > 10% → Alert                                 │
│  - Queue depth > 10M → Scale worker                         │
│  - Disk usage > 80% → Alert                                 │
│  - Worker down > 5 menit → Page on-call                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 CONTOH NYATA

### Contoh 1: Google Crawler (Googlebot)

```
Googlebot adalah web crawler paling canggih di dunia:

1. URL Frontier:
   - Triliunan URL dalam antrian
   - Priority berdasarkan PageRank, freshness, sitemaps
   - Distributed across data centers global

2. Fetching:
   - Jutaan concurrent connections
   - Custom HTTP stack
   - DNS resolution teroptimasi

3. Rendering:
   - Google Rendering Service (WRS)
   - Render JavaScript seperti Chrome
   - Index konten setelah render

4. Storage:
   - Google File System (GFS)
   - BigTable untuk index
   - Colossus (GFS generasi 2)

5. Processing:
   - MapReduce untuk batch processing
   - Real-time indexing pipeline
   - Duplicate detection dengan SimHash

Skala: Triliunan halaman, petabytes data, update terus-menerus.
```

### Contoh 2: Crawler Portal Berita Sekolah (Sederhana)

```python
#!/usr/bin/env python3
"""
Crawler sederhana untuk monitoring portal berita sekolah.
50 website sekolah di Bandung Barat.
"""

import time
import hashlib
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from collections import deque

class SchoolNewsCrawler:
    def __init__(self):
        self.seed_urls = [
            "https://sdn1pasirhalang.sch.id",
            "https://sdn2cikalong.sch.id",
            # ... 48 website lainnya
        ]
        self.seen_urls = set()
        self.queue = deque(self.seed_urls)
        self.politeness_delay = 2  # detik per domain
        self.last_request = {}  # domain -> timestamp

    def normalize_url(self, url):
        """Normalisasi URL untuk deduplication."""
        parsed = urlparse(url)
        # Lowercase, hapus fragment, hapus trailing slash
        normalized = f"{parsed.scheme}://{parsed.netloc}{parsed.path.rstrip('/')}"
        return normalized

    def get_domain(self, url):
        """Ekstrak domain dari URL."""
        return urlparse(url).netloc

    def respect_politeness(self, domain):
        """Tunggu jika terlalu cepat crawl domain ini."""
        if domain in self.last_request:
            elapsed = time.time() - self.last_request[domain]
            if elapsed < self.politeness_delay:
                time.sleep(self.politeness_delay - elapsed)

    def crawl_page(self, url):
        """Crawl satu halaman."""
        url = self.normalize_url(url)
        if url in self.seen_urls:
            return []

        domain = self.get_domain(url)
        self.respect_politeness(domain)

        try:
            response = requests.get(
                url,
                timeout=10,
                headers={"User-Agent": "SchoolCrawler/1.0"}
            )
            response.raise_for_status()
            self.last_request[domain] = time.time()
            self.seen_urls.add(url)

            # Parse konten
            soup = BeautifulSoup(response.text, "html.parser")
            title = soup.title.string if soup.title else ""
            text = soup.get_text(separator=" ", strip=True)[:500]

            # Simpan (bisa ke database)
            print(f"[{title}] {url}")
            print(f"  Preview: {text[:100]}...")

            # Ekstrak link baru
            new_urls = []
            for link in soup.find_all("a", href=True):
                new_url = urljoin(url, link["href"])
                new_url = self.normalize_url(new_url)
                if self.get_domain(new_url) == domain:
                    new_urls.append(new_url)

            return new_urls

        except Exception as e:
            print(f"Error crawling {url}: {e}")
            return []

    def run(self, max_pages=1000):
        """Jalankan crawler."""
        pages_crawled = 0
        while self.queue and pages_crawled < max_pages:
            url = self.queue.popleft()
            new_urls = self.crawl_page(url)

            for new_url in new_urls:
                if new_url not in self.seen_urls:
                    self.queue.append(new_url)

            pages_crawled += 1

        print(f"\nCrawl selesai. Total: {pages_crawled} halaman")
        print(f"URL seen: {len(self.seen_urls)}")
        print(f"URL remaining in queue: {len(self.queue)}")


if __name__ == "__main__":
    crawler = SchoolNewsCrawler()
    crawler.run(max_pages=500)
```

---

## 💡 PRAKTIK

### Latihan 1: Desain Crawler untuk Portal Berita

Anda diminta crawl **portal berita sekolah-sekolah** di Bandung Barat (50 website).

**Asumsi:**
- 10 artikel/hari per website
- Rata-rata 500 KB per halaman
- Setiap artikel punya 5 link internal

**Tugas:**
1. Gambar arsitektur high-level
2. Berapa halaman per hari yang perlu di-crawl?
3. Berapa storage per bulan?
4. Bagaimana deduplication strategy?
5. Bagaimana politeness policy?
6. Database apa untuk menyimpan hasil crawl?

### Latihan 2: Implementasi URL Normalizer

Buat fungsi URL normalization yang menangani:
1. Case insensitivity
2. Trailing slash
3. Default port removal
4. Fragment removal
5. Query parameter filtering (hapus utm_, ref, fbclid)
6. www normalization
7. Percent-decoding
8. Path normalization (resolve .. dan .)

### Latihan 3: Desain Distributed Crawler

Desain distributed crawler untuk 100 juta halaman:
1. Berapa worker node dibutuhkan?
2. Bagaimana URL distribution strategy?
3. Bagaimana handle worker failure?
4. Bagaimana shared state management (seen URLs)?
5. Bagaimana monitoring dan alerting?

---

## ✅ CHECKLIST

- [ ] Paham cara kerja web crawler (pipeline: frontier → DNS → fetch → parse → extract → store)
- [ ] Paham URL frontier dan priority scoring
- [ ] Paham politeness policy (robots.txt, rate limiting, crawl-delay)
- [ ] Paham URL normalization dan deduplication
- [ ] Paham Bloom Filter untuk seen-URL check
- [ ] Paham SimHash untuk near-duplicate content detection
- [ ] Paham MinHash dan Jaccard similarity
- [ ] Paham distributed crawling architecture (master-worker)
- [ ] Paham DNS resolution optimization
- [ ] Paham HTTP error handling dan retry strategy
- [ ] Paham fresh vs comprehensive trade-off
- [ ] Paham handling dynamic content (headless browser, API discovery)
- [ ] Paham scaling roadmap dari single-threaded ke enterprise
- [ ] Paham failure handling (timeout, redirect loop, worker crash)
- [ ] Paham monitoring metrics untuk crawler
- [ ] Bisa implement crawler sederhana dengan Python

---

## 🔗 REFERENSI

- **Repo Asli:** [donnemartin/system-design-primer — Web Crawler Solution](https://github.com/donnemartin/system-design-primer/tree/master/solutions/system_design/web_crawler)
- **Google Crawling Architecture:** [How Google Search Works](https://www.google.com/search/howsearchworks/)
- **Scrapy Framework:** [scrapy.org](https://scrapy.org/) — Python crawling framework
- **Common Crawl:** [commoncrawl.org](https://commoncrawl.org/) — Open web crawl dataset
- **Bloom Filter Paper:** [Space/Time Trade-offs in Hash Coding with Allowable Errors](https://dl.acm.org/doi/10.1145/362686.362692)
- **SimHash Paper:** [Similarity Estimation Techniques from Rounding Algorithms](https://dl.acm.org/doi/10.1145/509907.509965)

---

> **Lanjut ke:** [`21-ringkasan-fase-1.md`](./21-ringkasan-fase-1.md)
