# 08 — CDN (Content Delivery Network)

> **Estimasi:** 1.5 jam | **Level:** Pemula → Menengah
> **Referensi utama:** [donnemartin/system-design-primer — CDN](https://github.com/donnemartin/system-design-primer#content-delivery-network)

---

## 📖 TEORI

### Apa itu CDN?

**CDN (Content Delivery Network)** adalah jaringan server terdistribusi secara geografis yang bekerja sama untuk menyajikan konten web dengan cepat dan efisien. CDN menyimpan salinan (cache) konten statis — seperti gambar, CSS, JavaScript, video, dan font — di server-server edge yang berlokasi dekat dengan user.

Tanpa CDN, semua user harus mengakses server origin yang mungkin berada jauh secara geografis. Dengan CDN, user mengakses edge server terdekat, sehingga latency berkurang drastis.

```
┌──────────────────────────────────────────────────────────────┐
│              ARSITEKTUR TANPA CDN vs DENGAN CDN                │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  TANPA CDN:                                                   │
│                                                               │
│  [User Bandung] ──────────────┐                               │
│  [User Surabaya] ─────────────┤                               │
│  [User Medan] ────────────────┤  Semua request ke satu server │
│  [User Papua] ────────────────┤                               │
│  [User London] ───────────────┤                               │
│                               ▼                               │
│                    ┌──────────────────┐                        │
│                    │  Origin Server   │                        │
│                    │  Jakarta         │                        │
│                    │  ┌────────────┐  │                        │
│                    │  │ Web Server │  │                        │
│                    │  │ Database   │  │                        │
│                    │  │ Storage    │  │                        │
│                    │  └────────────┘  │                        │
│                    └──────────────────┘                        │
│                                                               │
│  Masalah:                                                     │
│  - Latency tinggi untuk user jauh (Papua: 200ms+)             │
│  - Server origin overload saat traffic spike                  │
│  - Single point of failure                                    │
│  - Bandwidth mahal                                            │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  DENGAN CDN:                                                  │
│                                                               │
│  [User Bandung] ──→ [CDN Jakarta] ─── 10ms                    │
│  [User Surabaya] ─→ [CDN Surabaya] ── 5ms                     │
│  [User Medan] ────→ [CDN Medan] ───── 15ms                    │
│  [User Papua] ────→ [CDN Singapore] ─ 50ms                    │
│  [User London] ───→ [CDN Frankfurt] ─ 30ms                    │
│                              │                                │
│                    ┌─────────┴────────┐                        │
│                    │  Origin Server   │                        │
│                    │  Jakarta         │                        │
│                    │  (hanya handle   │                        │
│                    │   cache miss &   │                        │
│                    │   dynamic)       │                        │
│                    └──────────────────┘                        │
│                                                               │
│  Keuntungan:                                                  │
│  - Latency rendah (user dapat konten dari edge terdekat)      │
│  - Origin server tidak overload (80-90% request di-cache)     │
│  - High availability (edge server redundant)                  │
│  - DDoS protection (traffic diserap di edge)                  │
│  - Bandwidth hemat                                            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Kenapa CDN Penting?

Menurut donnemartin/system-design-primer, CDN adalah komponen kritis dalam arsitektur sistem yang melayani user global. Berikut alasan utamanya:

#### 1. Performa — Lebih Cepat

CDN mengurangi **latency** dengan menyajikan konten dari server terdekat. Setiap kilometer jarak antara user dan server menambah ~3-5ms latency. CDN dengan 300+ edge locations memastikan user tidak pernah lebih dari ~50ms dari edge server terdekat.

```
┌──────────────────────────────────────────────────────────────┐
│              LATENCY COMPARISON                                │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  User di Surabaya mengakses website dengan origin di Jakarta: │
│                                                               │
│  Tanpa CDN:                                                   │
│  Surabaya → Jakarta: ~15ms (fisik)                            │
│  + TCP handshake: 30ms (3-way)                                │
│  + TLS handshake: 60ms (2-RTT)                                │
│  + TTFB (Time to First Byte): 100ms                           │
│  + Download 2MB: 200ms                                        │
│  TOTAL: ~405ms                                                │
│                                                               │
│  Dengan CDN (edge di Surabaya):                               │
│  Surabaya → CDN Surabaya: ~2ms                                │
│  + TCP handshake: 4ms                                         │
│  + TLS handshake: 8ms                                         │
│  + TTFB (dari cache): 5ms                                     │
│  + Download 2MB: 100ms                                        │
│  TOTAL: ~119ms                                                │
│                                                               │
│  Penghematan: ~286ms (71% lebih cepat!)                       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 2. Mengurangi Beban Origin Server

CDN menangani **80-95%** dari total request (static content). Origin server hanya perlu menangani:
- Cache miss (request untuk konten yang belum di-cache)
- Dynamic content (API responses, database queries)
- Konten yang tidak bisa di-cache (personalized content)

```
┌──────────────────────────────────────────────────────────────┐
│              TRAFFIC DISTRIBUTION DENGAN CDN                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Total request: 1.000.000/hari                                │
│                                                               │
│  Static content (gambar, CSS, JS, font, video): 85%          │
│  → 850.000 request ditangani oleh CDN edge                    │
│  → Origin server HANYA handle cache miss (~5% = 42.500)       │
│                                                               │
│  Dynamic content (API, database): 15%                         │
│  → 150.000 request ke origin server                           │
│                                                               │
│  Total beban origin server: 192.500 request/hari              │
│  (hanya 19.25% dari total tanpa CDN)                          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 3. Reliability dan High Availability

CDN memiliki **redundancy built-in**. Jika satu edge server down, traffic otomatis diarahkan ke edge server terdekat lainnya.

```
┌──────────────────────────────────────────────────────────────┐
│              CDN FAILOVER                                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Normal:                                                      │
│  [User] → [CDN Edge A (Jakarta)] → Cache HIT → Response       │
│                                                               │
│  Edge A down:                                                 │
│  [User] → [CDN Edge A] → FAIL                                 │
│       → DNS/GSLB redirect                                     │
│       → [CDN Edge B (Bandung)] → Cache HIT → Response         │
│                                                               │
│  Origin down:                                                 │
│  [User] → [CDN Edge] → Cache MISS                            │
│       → Origin FAIL                                           │
│       → Serve stale content (jika dikonfigurasi)              │
│       → Atau error page custom                                │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 4. Security

CDN menyediakan beberapa layer keamanan:

- **DDoS Protection**: Menyerap dan memfilter traffic serangan sebelum sampai ke origin
- **WAF (Web Application Firewall)**: Memfilter request berbahaya (SQL injection, XSS, dll)
- **Bot Management**: Mendeteksi dan memblokir bot jahat
- **SSL/TLS Termination**: Menghandle enkripsi di edge, mengurangi beban origin
- **Rate Limiting**: Membatasi request per user/IP

---

### CDN Architecture — Komponen Utama

```
┌──────────────────────────────────────────────────────────────┐
│                    CDN ARCHITECTURE                            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│                        ┌──────────────┐                       │
│                        │    User       │                       │
│                        │  (Browser)    │                       │
│                        └──────┬───────┘                       │
│                               │                               │
│                    DNS Resolution                             │
│                    (Geo-aware DNS)                            │
│                               │                               │
│                               ▼                               │
│                        ┌──────────────┐                       │
│                        │  DNS Server   │                       │
│                        │  (Anycast)    │                       │
│                        └──────┬───────┘                       │
│                               │                               │
│                    Route ke edge terdekat                     │
│                               │                               │
│                    ┌──────────┴──────────┐                    │
│                    ▼                     ▼                    │
│            ┌──────────────┐     ┌──────────────┐             │
│            │  PoP Jakarta  │     │  PoP Singapore│            │
│            │  ┌──────────┐ │     │  ┌──────────┐ │            │
│            │  │ Edge     │ │     │  │ Edge     │ │            │
│            │  │ Server 1 │ │     │  │ Server 1 │ │            │
│            │  │ Edge     │ │     │  │ Edge     │ │            │
│            │  │ Server 2 │ │     │  │ Server 2 │ │            │
│            │  │ Cache    │ │     │  │ Cache    │ │            │
│            │  │ Storage  │ │     │  │ Storage  │ │            │
│            │  └──────────┘ │     │  └──────────┘ │            │
│            └──────┬───────┘     └──────┬───────┘             │
│                   │                    │                      │
│                   └──────────┬─────────┘                      │
│                              │                                │
│                    Cache miss / dynamic                       │
│                              │                                │
│                              ▼                                │
│                    ┌──────────────────┐                       │
│                    │  Origin Server    │                       │
│                    │  (Your server)    │                       │
│                    │  ┌────────────┐  │                       │
│                    │  │ Web Server │  │                       │
│                    │  │ App Server │  │                       │
│                    │  │ Database   │  │                       │
│                    │  └────────────┘  │                       │
│                    └──────────────────┘                       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 1. Edge Servers

Edge server adalah server CDN yang berlokasi di **PoP (Point of Presence)** — fasilitas jaringan yang tersebar di berbagai lokasi geografis. Edge server:

- Menyimpan **cache** konten statis
- Menerima request langsung dari user
- Melakukan **SSL/TLS termination**
- Menjalankan **WAF rules**
- Melakukan **compression** (gzip, brotli)
- Menjalankan **edge computing** (jika didukung)

#### 2. Origin Server

Origin server adalah server **sumber konten** — server Anda yang menyimpan konten asli. CDN akan mengambil (fetch) konten dari origin saat:
- Konten belum ada di cache (cache miss)
- Konten di cache sudah expired (TTL habis)
- Ada request untuk purge/invalidate cache

#### 3. PoP (Point of Presence)

PoP adalah lokasi fisik di mana edge server CDN berada. CDN provider besar memiliki ratusan hingga ribuan PoP di seluruh dunia.

```
┌──────────────────────────────────────────────────────────────┐
│              CDN PoP DISTRIBUTION (Contoh)                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  CloudFlare:     330+ PoP di 120+ negara                      │
│  AWS CloudFront:  600+ PoP (400+ edge, 200+ regional)         │
│  Fastly:         100+ PoP di 30+ negara                       │
│  Akamai:         4,000+ server di 130+ negara                 │
│  CDN Indonesia:                                               │
│    - Biznet:       Jakarta, Surabaya, Bali, Medan              │
│    - Indosat:      Jakarta, Surabaya, Makassar                 │
│    - Telkom:       Jakarta, Surabaya, Bandung, Medan           │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### CDN Caching Strategies — Pull vs Push

#### Pull CDN (On-Demand Caching)

**Cara kerja:** CDN **otomatis mengambil** konten dari origin server saat ada user yang pertama kali meminta konten tersebut. Setelah di-cache, request berikutnya dilayani langsung dari edge server.

```
┌──────────────────────────────────────────────────────────────┐
│              PULL CDN — FIRST REQUEST (CACHE MISS)             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  [User]                                                       │
│    │                                                          │
│    │ GET /images/logo.png                                     │
│    ▼                                                          │
│  [CDN Edge Server]                                            │
│    │ Cache check: /images/logo.png → NOT FOUND                │
│    │                                                          │
│    │ GET /images/logo.png (forward ke origin)                 │
│    ▼                                                          │
│  [Origin Server]                                              │
│    │                                                          │
│    │ Response: 200 OK + logo.png (50KB) + Cache-Control       │
│    ▼                                                          │
│  [CDN Edge Server]                                            │
│    │ Simpan logo.png di cache (sesuai Cache-Control header)   │
│    │                                                          │
│    │ Response: 200 OK + logo.png                              │
│    ▼                                                          │
│  [User] → Dapat logo.png                                     │
│                                                               │
│  Waktu: ~200ms (origin fetch + cache store + response)        │
│                                                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│              PULL CDN — SUBSEQUENT REQUEST (CACHE HIT)         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  [User]                                                       │
│    │                                                          │
│    │ GET /images/logo.png                                     │
│    ▼                                                          │
│  [CDN Edge Server]                                            │
│    │ Cache check: /images/logo.png → FOUND (TTL: 1 jam)       │
│    │                                                          │
│    │ Response: 200 OK + logo.png (dari cache)                 │
│    ▼                                                          │
│  [User] → Dapat logo.png                                     │
│                                                               │
│  Waktu: ~10ms (langsung dari cache)                           │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Kapan pakai Pull CDN:**
- Website dengan banyak konten statis yang tidak diketahui sebelumnya
- Konten yang sering berubah/ditambahkan
- Traffic besar (otomatis scale)
- Tidak ingin repot upload manual ke CDN

**Kelebihan:**
- Setup mudah — cukup pointing domain ke CDN
- Otomatis cache konten yang diminta user
- Storage efisien — hanya cache yang benar-benar diminta
- Tidak ada konten yang tidak terpakai di CDN

**Kekurangan:**
- Request pertama lambat (cache miss → fetch dari origin)
- Origin server tetap mendapat traffic untuk cache miss
- Bisa ada redundant traffic jika TTL terlalu pendek

**Konfigurasi Pull CDN (contoh CloudFlare):**
```
1. Tambahkan domain ke CloudFlare
2. Update nameserver ke CloudFlare
3. CDN otomatis aktif — semua request melewati CloudFlare
4. Cache behavior diatur via Page Rules / Cache Rules
```

#### Push CDN (Pre-upload Caching)

**Cara kerja:** Anda **secara manual meng-upload** konten ke CDN sebelum user memintanya. CDN tidak pernah fetch dari origin — semua konten sudah tersedia di edge server.

```
┌──────────────────────────────────────────────────────────────┐
│              PUSH CDN — UPLOAD FLOW                            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  [Developer]                                                  │
│    │                                                          │
│    │ Upload via API / CLI / Dashboard                         │
│    ▼                                                          │
│  [CDN Origin Storage]                                         │
│    │                                                          │
│    │ CDN replicate ke semua edge servers                      │
│    ▼                                                          │
│  [CDN Edge Jakarta]  [CDN Edge Surabaya]  [CDN Edge Medan]   │
│    │                   │                    │                 │
│    │ logo.png ready    │ logo.png ready     │ logo.png ready  │
│                                                               │
│  Saat user request:                                           │
│  [User] → [CDN Edge terdekat] → Cache HIT → Response          │
│  (Tidak pernah menghubungi origin Anda)                        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Kapan pakai Push CDN:**
- Website dengan traffic kecil
- Konten yang jarang berubah (misal: website statis)
- File yang sudah diketahui sebelumnya (build artifacts)
- Ingin kontrol penuh atas konten di CDN

**Kelebihan:**
- Request pertama langsung cepat (tidak ada cache miss)
- Origin server tidak mendapat traffic sama sekali
- Kontrol penuh — Anda tahu persis apa yang ada di CDN

**Kekurangan:**
- Harus manual upload setiap ada perubahan
- Storage boros — semua file ada di semua edge
- Tidak praktis untuk konten banyak/dinamis
- Perlu proses deployment terpisah

**Konfigurasi Push CDN (contoh AWS S3 + CloudFront):**
```bash
# Upload file ke S3 (origin untuk CloudFront)
aws s3 sync ./dist s3://my-bucket-name/

# CloudFront akan pull dari S3 saat pertama kali diminta
# Atau bisa pre-warm cache dengan invalidation
```

### Pull vs Push — Comparison Table

| Aspek | Pull CDN | Push CDN |
|-------|----------|----------|
| Setup | Mudah (pointing DNS) | Kompleks (upload manual) |
| Cache miss | Ada (request pertama lambat) | Tidak ada (selalu HIT) |
| Origin traffic | Ada (untuk cache miss) | Tidak ada |
| Storage | Efisien (hanya yang diminta) | Boros (semua file di semua edge) |
| Konten dinamis | Cocok | Tidak cocok |
| Konten statis | Cocok | Sangat cocok |
| Maintenance | Minimal | Tinggi (upload setiap update) |
| Use case | Website, API, aplikasi | Website statis, build artifacts |

---

### Cache Invalidation — Mengelola Cache CDN

Salah satu tantangan terbesar dalam menggunakan CDN adalah **cache invalidation** — bagaimana memastikan user mendapat konten terbaru setelah ada perubahan.

#### 1. Purge (Manual Invalidation)

Menghapus konten dari cache CDN secara manual. Setelah purge, request berikutnya akan fetch ulang dari origin.

```bash
# CloudFlare — Purge specific URL
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://example.com/images/logo.png"]}'

# CloudFlare — Purge all
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

# AWS CloudFront — Invalidation
aws cloudfront create-invalidation \
  --distribution-id E1234567890 \
  --paths "/images/logo.png" "/css/style.css"

# Fastly — Purge
curl -X PURGE "https://example.com/images/logo.png"
```

**Kapan pakai purge:**
- Ada bug di CSS/JS yang perlu segera diperbaiki
- Konten sensitif yang perlu dihapus segera
- Emergency update

**Masalah purge:**
- Tidak instan — butuh waktu propagate ke semua edge
- Biaya (beberapa CDN charge per purge request)
- Setelah purge, semua request jadi cache miss → origin overload

#### 2. Cache Busting dengan Versioning (Best Practice)

Alih-alih purge, gunakan **versioned URL** untuk setiap perubahan konten. Ini adalah best practice yang paling direkomendasikan.

```html
<!-- Sebelum update -->
<link rel="stylesheet" href="/css/style.css?v=1.0">
<script src="/js/app.js?v=1.0"></script>
<img src="/images/logo.png" alt="Logo">

<!-- Setelah update — URL berubah, CDN anggap sebagai file baru -->
<link rel="stylesheet" href="/css/style.css?v=2.0">
<script src="/js/app.js?v=2.0"></script>
<img src="/images/logo.png?v=2.0" alt="Logo">
```

**Versioning strategies:**

```
Strategy 1: Query string versioning
/css/style.css?v=20240101
/js/app.js?v=abc123

Strategy 2: Filename versioning (lebih baik — beberapa CDN tidak cache query string)
/css/style.v2.0.css
/js/app.abc123.js

Strategy 3: Content hash (paling baik — hash berubah hanya jika konten berubah)
/css/style.a1b2c3d4.css
/js/app.e5f6g7h8.js

Strategy 4: Directory versioning
/v2/css/style.css
/v2/js/app.js
```

**Build tool integration (Webpack/Vite):**
```javascript
// Vite — otomatis generate content hash
// Output: assets/index.a1b2c3d4.css
// Output: assets/main.e5f6g7h8.js

// Webpack — content hash di filename
output: {
  filename: '[name].[contenthash].js',
  chunkFilename: '[name].[contenthash].chunk.js',
}
```

**Kenapa content hash paling baik?**
- URL berubah HANYA jika konten benar-benar berubah
- File yang tidak berubah tetap di-cache (tidak perlu re-download)
- Tidak ada risiko serve konten lama
- Tidak perlu purge manual

#### 3. Stale-While-Revalidate

Strategi caching modern yang memungkinkan CDN menyajikan **konten lama (stale)** sambil secara background me-refresh dari origin.

```
┌──────────────────────────────────────────────────────────────┐
│              STALE-WHILE-REVALIDATE                            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Header: Cache-Control: public, max-age=3600,                 │
│          stale-while-revalidate=86400                         │
│                                                               │
│  t=0:     Konten di-cache (fresh selama 1 jam)                │
│  t=3600:  TTL expired → konten jadi stale                     │
│           User request → CDN serve stale content (langsung!)  │
│           CDN background fetch ke origin untuk refresh         │
│  t=3601:  Origin response → CDN update cache (fresh lagi)     │
│  t=3602:  User berikutnya → dapat konten fresh dari cache     │
│                                                               │
│  Window stale-while-revalidate: 24 jam                        │
│  Dalam 24 jam setelah expired, CDN masih bisa serve stale     │
│  sambil background refresh                                    │
│                                                               │
│  Setelah 24 jam + 1 jam = 25 jam:                             │
│  CDN tidak boleh serve stale lagi → harus wait untuk origin   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Keuntungan stale-while-revalidate:**
- User selalu dapat response cepat (tidak pernah wait untuk origin)
- Origin tidak overload (hanya 1 request per TTL, bukan per user)
- Konten secara otomatis ter-update di background

**Header Cache-Control lengkap:**
```
Cache-Control: public, max-age=3600, stale-while-revalidate=86400, stale-if-error=604800

max-age=3600          → Fresh selama 1 jam
stale-while-revalidate=86400  → Boleh serve stale 24 jam sambil refresh
stale-if-error=604800 → Boleh serve stale 7 hari jika origin error
```

#### 4. Cache-Control Headers Reference

```
┌──────────────────────────────────────────────────────────────┐
│              CACHE-CONTROL DIRECTIVES                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Direktif untuk CACHING:                                      │
│  ─────────────────────────                                    │
│  public          → Boleh di-cache oleh siapa saja (CDN, browser) │
│  private         → Hanya boleh di-cache oleh browser user      │
│  no-cache        → Harus revalidate dengan origin sebelum serve │
│  no-store        → JANGAN cache sama sekali                    │
│  max-age=N       → Fresh selama N detik                        │
│  s-maxage=N      → max-age khusus untuk shared cache (CDN)     │
│                                                               │
│  Direktif untuk REVALIDATION:                                  │
│  ────────────────────────────                                  │
│  must-revalidate → Jika stale, HARUS revalidate                │
│  stale-while-revalidate=N → Boleh serve stale N detik sambil refresh │
│  stale-if-error=N → Boleh serve stale N detik jika origin error │
│                                                               │
│  Direktif untuk VALIDATION:                                    │
│  ──────────────────────────                                    │
│  ETag            → Content fingerprint (untuk conditional GET)  │
│  Last-Modified   → Timestamp modifikasi terakhir               │
│                                                               │
│  CONTOH KOMBINASI:                                             │
│  ─────────────────                                             │
│  Static asset (immutable):                                     │
│  Cache-Control: public, max-age=31536000, immutable            │
│                                                               │
│  HTML page (selalu fresh):                                     │
│  Cache-Control: no-cache, must-revalidate                      │
│                                                               │
│  API response (cache sebentar):                                │
│  Cache-Control: public, max-age=60, stale-while-revalidate=300 │
│                                                               │
│  Personalized content (no cache):                              │
│  Cache-Control: private, no-store                              │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### CDN Selection Criteria — Memilih CDN yang Tepat

Berikut kriteria yang perlu dipertimbangkan saat memilih CDN provider:

#### 1. Geographic Coverage

```
┌──────────────────────────────────────────────────────────────┐
│              GEOGRAPHIC COVERAGE COMPARISON                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Target user di Indonesia? Pilih CDN dengan PoP di Indonesia: │
│  - CloudFlare: Jakarta, Surabaya                              │
│  - AWS CloudFront: Jakarta (ap-southeast-3)                   │
│  - Biznet CDN: Jakarta, Surabaya, Bali, Medan                 │
│  - Telkom CDN: Jakarta, Surabaya, Bandung, Medan              │
│                                                               │
│  Target user global? Pilih CDN dengan coverage luas:          │
│  - Akamai: 4,000+ server di 130+ negara (paling luas)         │
│  - CloudFlare: 330+ PoP di 120+ negara                        │
│  - AWS CloudFront: 600+ PoP global                            │
│  - Fastly: 100+ PoP di 30+ negara                             │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 2. Pricing Model

```
┌──────────────────────────────────────────────────────────────┐
│              PRICING COMPARISON (Estimasi)                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  CloudFlare:                                                  │
│  - Free: Unlimited bandwidth, basic CDN, DDoS protection      │
│  - Pro ($20/bulan): Image optimization, mobile optimization   │
│  - Business ($200/bulan): WAF, custom SSL, load balancing     │
│  - Enterprise (custom): Full fitur, dedicated support         │
│                                                               │
│  AWS CloudFront:                                              │
│  - Pay-as-you-go: $0.085/GB (US), $0.12/GB (Asia)            │
│  - 10TB/bulan ≈ $850-1200                                     │
│  - Request: $0.0075/10.000 (HTTP), $0.0125/10.000 (HTTPS)    │
│  - Free tier: 1TB/bulan (12 bulan pertama)                    │
│                                                               │
│  Fastly:                                                      │
│  - Pay-as-you-go: $0.12/GB                                    │
│  - Request: $0.0125/10.000                                    │
│  - Minimum: $50/bulan                                         │
│                                                               │
│  Akamai:                                                      │
│  - Enterprise pricing (custom)                                │
│  - Biasanya lebih mahal, tapi performa terbaik                │
│  - Cocok untuk enterprise dengan traffic sangat besar         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 3. Features

| Fitur | CloudFlare | CloudFront | Fastly | Akamai |
|-------|------------|------------|--------|--------|
| CDN Static | ✅ | ✅ | ✅ | ✅ |
| CDN Dynamic | ✅ | ✅ | ✅ | ✅ |
| DDoS Protection | ✅ (Unlimited) | ✅ (Shield) | ✅ | ✅ |
| WAF | ✅ (Pro+) | ✅ (add-on) | ✅ | ✅ |
| SSL/TLS | ✅ (Free) | ✅ | ✅ | ✅ |
| Image Optimization | ✅ (Pro+) | ✅ (Lambda@Edge) | ✅ | ✅ |
| Edge Computing | ✅ (Workers) | ✅ (Lambda@Edge) | ✅ (Compute@Edge) | ✅ (EdgeWorkers) |
| Bot Management | ✅ (Pro+) | ✅ | ✅ | ✅ |
| Load Balancing | ✅ (Business+) | ✅ | ✅ | ✅ |
| Video Streaming | ✅ (Stream) | ✅ | ✅ | ✅ |
| Free Tier | ✅ (Unlimited) | ✅ (1TB/12mo) | ❌ | ❌ |

#### 4. Ease of Use

- **CloudFlare**: Paling mudah — setup dalam 5 menit, dashboard intuitif
- **AWS CloudFront**: Moderate — perlu pemahaman AWS, integrasi baik dengan S3
- **Fastly**: Developer-friendly — konfigurasi via VCL (Varnish Configuration Language), real-time purge
- **Akamai**: Kompleks — butuh specialist, tapi fitur paling lengkap

---

### CDN Providers Comparison

#### CloudFlare

```
┌──────────────────────────────────────────────────────────────┐
│              CLOUDFLARE CDN                                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Arsitektur:                                                  │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  330+ PoP di 120+ negara (anycast network)          │     │
│  │  Setiap PoP: multiple edge servers                  │     │
│  │  Global network capacity: 200+ Tbps                 │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Fitur unggulan:                                              │
│  - Free tier sangat generous (unlimited bandwidth)            │
│  - DDoS protection unlimited (semua plan)                     │
│  - Free SSL/TLS (Universal SSL)                               │
│  - CloudFlare Workers (edge computing JavaScript)             │
│  - Argo Smart Routing (optimasi route)                        │
│  - Image Resizing & Optimization                              │
│  - Bot Management                                             │
│  - Zero Trust / Access (authentication di edge)               │
│                                                               │
│  Cocok untuk:                                                 │
│  - Startup, UMKM, personal website (free tier)                │
│  - Website yang butuh DDoS protection kuat                    │
│  - Developer yang mau edge computing (Workers)                │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### AWS CloudFront

```
┌──────────────────────────────────────────────────────────────┐
│              AWS CLOUDFRONT                                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Arsitektur:                                                  │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  600+ PoP global (400+ edge locations, 200+ regional)│    │
│  │  Integrated dengan AWS ecosystem (S3, EC2, Lambda)   │     │
│  │  AWS Global Accelerator untuk optimasi routing       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Fitur unggulan:                                              │
│  - Integrasi seamless dengan S3 (origin)                      │
│  - Lambda@Edge (run Lambda di edge)                           │
│  - Field-level encryption (encrypt specific field di edge)    │
│  - Real-time logs (Kinesis, S3, CloudWatch)                   │
│  - Origin Shield (additional caching layer)                   │
│  - Signed URLs/Cookies (content protection)                   │
│  - AWS WAF integration                                      │
│                                                               │
│  Cocok untuk:                                                 │
│  - Aplikasi yang sudah di AWS ecosystem                       │
│  - Enterprise yang butuh integrasi AWS lengkap                │
│  - Video streaming (integrated dengan MediaConvert, MediaPackage)│
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### Fastly

```
┌──────────────────────────────────────────────────────────────┐
│              FASTLY CDN                                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Arsitektur:                                                  │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  100+ PoP di 30+ negara                              │     │
│  │  Based on Varnish Cache (high performance)           │     │
│  │  Real-time purge (< 150ms global propagation)        │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Fitur unggulan:                                              │
│  - Real-time purge (paling cepat di industri)                 │
│  - VCL (Varnish Configuration Language) — sangat flexible     │
│  - Compute@Edge (WebAssembly edge computing)                  │
│  - Real-time analytics & logging                              │
│  - Instant configuration changes (no propagation delay)       │
│  - Shielding (reduce origin load)                             │
│                                                               │
│  Cocok untuk:                                                 │
│  - Developer yang butuh kontrol caching granular              │
│  - Media/publisher yang butuh real-time content update        │
│  - Aplikasi yang butuh edge computing performa tinggi         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### Akamai

```
┌──────────────────────────────────────────────────────────────┐
│              AKAMAI CDN                                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Arsitektur:                                                  │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  4,000+ server di 130+ negara (paling luas)          │     │
│  │  1-3 hop dari 95% user internet global               │     │
│  │  Network capacity: 300+ Tbps                         │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Fitur unggulan:                                              │
│  - Coverage paling luas di dunia                              │
│  - Enterprise-grade security (WAF, DDoS, bot)                 │
│  - Image & Video Manager                                      │
│  - EdgeWorkers (edge computing)                               │
│  - Ion (full-page optimization)                               │
│  - mPulse (real user monitoring)                              │
│  - Dedicated support & SLA                                    │
│                                                               │
│  Cocok untuk:                                                 │
│  - Enterprise besar (banking, e-commerce, media)              │
│  - Website dengan traffic sangat besar                        │
│  - Aplikasi yang butuh performa dan security terbaik          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### CDN Security

#### DDoS Protection

CDN secara natural melindungi dari DDoS karena menjadi **buffer** antara attacker dan origin server.

```
┌──────────────────────────────────────────────────────────────┐
│              CDN DDoS PROTECTION                               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Tanpa CDN:                                                   │
│  [Attacker 1] ──┐                                            │
│  [Attacker 2] ──┤                                            │
│  [Attacker 3] ──┤── 100 Gbps attack ──→ [Origin Server]      │
│  [Attacker N] ──┤                         ↓ CRASH!            │
│  [Botnet]     ──┘                                            │
│                                                               │
│  Dengan CDN:                                                  │
│  [Attacker 1] ──┐                                            │
│  [Attacker 2] ──┤                                            │
│  [Attacker 3] ──┤── 100 Gbps attack ──→ [CDN Network]        │
│  [Attacker N] ──┤                         │                   │
│  [Botnet]     ──┘                         │ Absorb & Filter   │
│                                           │                   │
│                                    [Legitimate Users]         │
│                                           │                   │
│                                           ▼                   │
│                                    [Origin Server]            │
│                                    (tetap正常运行)              │
│                                                               │
│  CDN capacity: 200+ Tbps (CloudFlare), 300+ Tbps (Akamai)    │
│  Attack 100 Gbps = 0.05% dari total capacity                  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Jenis DDoS yang dilindungi CDN:**
- **Layer 3/4 (Network)**: SYN flood, UDP flood, ICMP flood — dilindungi oleh network capacity CDN
- **Layer 7 (Application)**: HTTP flood, Slowloris — dilindungi oleh rate limiting dan challenge (CAPTCHA, JS challenge)

#### WAF (Web Application Firewall)

WAF di CDN memfilter request berbahaya sebelum sampai ke origin.

```
┌──────────────────────────────────────────────────────────────┐
│              CDN WAF RULES                                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Request masuk ke CDN edge:                                   │
│  GET /search?q=<script>alert('xss')</script>                  │
│                                                               │
│  WAF rules check:                                             │
│  1. SQL Injection detection → BLOCK                           │
│     Pattern: UNION SELECT, OR 1=1, DROP TABLE, dll            │
│                                                               │
│  2. XSS detection → BLOCK                                     │
│     Pattern: <script>, javascript:, onload=, dll              │
│                                                               │
│  3. Path traversal → BLOCK                                    │
│     Pattern: ../../etc/passwd, ..\..\windows\system32         │
│                                                               │
│  4. Bot detection → CHALLENGE                                 │
│     Pattern: User-agent suspicious, request pattern bot       │
│                                                               │
│  5. Rate limiting → THROTTLE                                  │
│     Pattern: > 100 request/menit dari IP yang sama            │
│                                                               │
│  Request bersih:                                              │
│  GET /search?q=sekolah → PASS → Origin                        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### Bot Management

CDN modern bisa mendeteksi dan memblokir bot jahat:

- **Good bots**: Google crawler, monitoring tools — diizinkan
- **Bad bots**: Scrapers, credential stuffing, inventory hoarding — diblokir
- **Human verification**: CAPTCHA, JS challenge untuk traffic suspicious

---

### CDN for Dynamic Content

CDN tidak hanya untuk static content. CDN modern juga bisa mengoptimasi **dynamic content** (API responses, personalized pages) melalui berbagai teknik:

#### 1. Route Optimization

CDN menggunakan jaringan privat dan optimasi routing untuk mempercepat dynamic content.

```
┌──────────────────────────────────────────────────────────────┐
│              DYNAMIC CONTENT OPTIMIZATION                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Tanpa CDN:                                                   │
│  [User Jakarta] → Internet publik → Router ISP → ... →        │
│  → Router banyak hop → [Origin Singapore]                     │
│  Latency: 50-100ms, packet loss possible                      │
│                                                               │
│  Dengan CDN (Argo Smart Routing / CloudFront):                │
│  [User Jakarta] → CDN Edge Jakarta →                          │
│  → CDN private backbone (optimized route) →                   │
│  → CDN Edge Singapore → [Origin Singapore]                    │
│  Latency: 20-30ms, reliable, no packet loss                   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 2. Dynamic Content Caching

Beberapa dynamic content bisa di-cache dengan strategi tertentu:

```
; Cache API response yang sama untuk semua user
Cache-Control: public, max-age=60

; Cache API response per user (gunakan Vary header)
Vary: Cookie, Authorization
Cache-Control: private, max-age=300

; Cache API response dengan stale-while-revalidate
Cache-Control: public, max-age=30, stale-while-revalidate=300
```

#### 3. TCP Optimization

CDN mengoptimasi koneksi TCP:

- **Persistent connections**: Reuse koneksi antara edge dan origin
- **HTTP/2 & HTTP/3**: Multiplexing, header compression, QUIC
- **TCP window scaling**: Optimasi throughput
- **Early data (0-RTT)**: Kirim data di handshake pertama (TLS 1.3)

---

### Edge Computing — Running Code di CDN Edge

Edge computing memungkinkan Anda menjalankan kode custom di edge server CDN, mendekati user. Ini mengurangi latency secara drastis untuk logic yang bisa dijalankan di edge.

#### CloudFlare Workers

```javascript
// CloudFlare Worker — A/B Testing di Edge
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // A/B test berdasarkan cookie
  let variant = request.headers.get('Cookie')?.includes('variant=B')
    ? 'B'
    : 'A'

  // 50% user dapat variant B
  if (!variant && Math.random() < 0.5) {
    variant = 'B'
  }

  // Rewrite URL berdasarkan variant
  if (variant === 'B') {
    url.pathname = '/new' + url.pathname
  }

  // Fetch dari origin
  const response = await fetch(url.toString(), request)

  // Add header untuk analytics
  const newResponse = new Response(response.body, response)
  newResponse.headers.set('X-AB-Variant', variant)

  return newResponse
}
```

```javascript
// CloudFlare Worker — API Gateway di Edge
addEventListener('fetch', event => {
  event.respondWith(apiGateway(event.request))
})

async function apiGateway(request) {
  const url = new URL(request.url)

  // Rate limiting per IP
  const ip = request.headers.get('CF-Connecting-IP')
  const limit = 100 // requests per minute

  // Check rate limit (menggunakan KV store)
  const count = await RATE_LIMITS.get(ip) || 0
  if (count > limit) {
    return new Response('Rate limit exceeded', { status: 429 })
  }

  // Increment counter
  await RATE_LIMITS.put(ip, count + 1, { expirationTtl: 60 })

  // Route ke backend yang sesuai
  if (url.pathname.startsWith('/api/users')) {
    return fetch('https://user-service.internal' + url.pathname, request)
  }

  if (url.pathname.startsWith('/api/products')) {
    return fetch('https://product-service.internal' + url.pathname, request)
  }

  return new Response('Not found', { status: 404 })
}
```

#### Lambda@Edge (AWS CloudFront)

```javascript
// Lambda@Edge — Modify response di CloudFront
exports.handler = async (event) => {
  const response = event.Records[0].cf.response

  // Add security headers
  response.headers['strict-transport-security'] = [{
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  }]

  response.headers['x-content-type-options'] = [{
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }]

  response.headers['x-frame-options'] = [{
    key: 'X-Frame-Options',
    value: 'DENY'
  }]

  // Add custom header
  response.headers['x-served-by-cdn'] = [{
    key: 'X-Served-By',
    value: 'CloudFront'
  }]

  return response
}
```

```javascript
// Lambda@Edge — Redirect berdasarkan country
exports.handler = async (event) => {
  const request = event.Records[0].cf.request
  const country = request.headers['cloudfront-viewer-country']?.[0]?.value

  // Redirect user Indonesia ke domain .co.id
  if (country === 'ID' && !request.uri.includes('.co.id')) {
    return {
      status: '302',
      statusDescription: 'Found',
      headers: {
        'location': [{
          key: 'Location',
          value: `https://example.co.id${request.uri}`
        }]
      }
    }
  }

  return request
}
```

#### Edge Computing Use Cases

| Use Case | Deskripsi | Provider |
|----------|-----------|----------|
| **A/B Testing** | Split traffic di edge tanpa origin involvement | Workers, Lambda@Edge |
| **API Gateway** | Route, rate limit, auth di edge | Workers, Lambda@Edge |
| **Image Optimization** | Resize, compress, format convert di edge | Workers, CloudFront Functions |
| **Bot Protection** | Challenge suspicious requests di edge | Workers, Fastly |
| **Personalization** | Modify response berdasarkan user location/cookie | Semua provider |
| **Authentication** | JWT validation di edge sebelum ke origin | Workers, Lambda@Edge |
| **Redirect/Rewrite** | URL redirect berdasarkan country, device, dll | Semua provider |
| **HTML Injection** | Inject analytics, ads, atau script di edge | Workers, Fastly |

---

## 🎯 CONTOH NYATA

### Contoh 1: Website Sekolah dengan CDN

**Setup:** SD Negeri Pasirhalang menggunakan CloudFlare CDN untuk website sekolah.

```
┌──────────────────────────────────────────────────────────────┐
│              SETUP CDN — SDN PASIRHALANG                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  DNS Setup:                                                   │
│  sdnpasirhalang.sch.id → CloudFlare nameserver                │
│  CloudFlare → Origin: 103.28.148.25 (hosting)                 │
│                                                               │
│  Cache Rules:                                                 │
│  /images/*     → Cache 1 tahun (immutable assets)             │
│  /css/*        → Cache 1 tahun (versioned filenames)          │
│  /js/*         → Cache 1 tahun (versioned filenames)          │
│  /fonts/*      → Cache 1 tahun                                │
│  /uploads/*    → Cache 1 bulan                                │
│  /             → Cache 5 menit (HTML homepage)                │
│  /berita/*     → Cache 10 menit                               │
│  /api/*        → No cache (dynamic)                           │
│  /admin/*      → Bypass CDN (direct to origin)                │
│                                                               │
│  Security:                                                    │
│  - SSL/TLS: Full (strict)                                     │
│  - WAF: Managed rules (OWASP Top 10)                          │
│  - Bot Fight Mode: On                                         │
│  - Rate limiting: 100 req/menit per IP                        │
│                                                               │
│  Performance:                                                 │
│  - Auto Minify: CSS, JS, HTML                                 │
│  - Brotli compression: On                                     │
│  - HTTP/2: On                                                 │
│  - HTTP/3: On                                                 │
│  - Image compression: On                                      │
│                                                               │
│  Hasil:                                                       │
│  - Page load time: 3.2s → 1.1s (66% lebih cepat)              │
│  - Origin traffic: turun 85%                                  │
│  - Bandwidth origin: 60GB/bulan → 9GB/bulan                   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Contoh 2: E-commerce dengan Multi-CDN Strategy

```
┌──────────────────────────────────────────────────────────────┐
│              MULTI-CDN STRATEGY — E-COMMERCE                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  CDN 1: CloudFlare (primary)                                  │
│  - Static assets (gambar produk, CSS, JS)                     │
│  - DDoS protection                                            │
│  - WAF                                                        │
│                                                               │
│  CDN 2: AWS CloudFront (secondary)                            │
│  - Video content (product demo, tutorial)                     │
│  - Downloadable files (katalog PDF)                           │
│  - Integrated dengan S3                                       │
│                                                               │
│  DNS-based load balancing:                                    │
│  - 70% traffic → CloudFlare                                   │
│  - 30% traffic → CloudFront                                   │
│  - Auto failover jika salah satu down                         │
│                                                               │
│  Cache strategy:                                               │
│  - Product images: 1 tahun (versioned)                        │
│  - Product pages: 5 menit (stale-while-revalidate 1 jam)      │
│  - Price/stock: No cache (real-time dari API)                 │
│  - Checkout: Bypass CDN (direct to origin)                    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Contoh 3: Video Streaming Platform

```
┌──────────────────────────────────────────────────────────────┐
│              CDN UNTUK VIDEO STREAMING                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Arsitektur:                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │  Video       │    │  Transcoder  │    │  Origin      │    │
│  │  Upload      │───→│  (HLS/DASH)  │───→│  Storage     │    │
│  │  (Creator)   │    │  (AWS Media  │    │  (S3)        │    │
│  └──────────────┘    │   Convert)   │    └──────┬───────┘    │
│                      └──────────────┘           │            │
│                                                 │            │
│                                        ┌────────▼────────┐   │
│                                        │  CloudFront CDN  │   │
│                                        │                  │   │
│                                        │  Edge Jakarta    │   │
│                                        │  Edge Surabaya   │   │
│                                        │  Edge Singapore  │   │
│                                        │  Edge Tokyo      │   │
│                                        │  ...             │   │
│                                        └────────┬─────────┘   │
│                                                 │            │
│                                        ┌────────▼────────┐   │
│                                        │  Viewers         │   │
│                                        │  (HLS/DASH)      │   │
│                                        └──────────────────┘   │
│                                                               │
│  Optimasi:                                                    │
│  - Adaptive bitrate: kualitas otomatis sesuai bandwidth       │
│  - Chunk caching: video di-cache per chunk (2-10 detik)       │
│  - Prefetch: CDN prefetch chunk berikutnya                    │
│  - Popular content: video populer di-cache di semua edge      │
│  - Long-tail content: video jarang hanya di-cache saat diminta│
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 💡 PRAKTIK

### Latihan 1: Push atau Pull CDN?

Tentukan Push CDN atau Pull CDN untuk setiap skenario:

1. Website portfolio pribadi dengan 10 halaman
2. E-commerce dengan 100.000 produk dan gambar yang sering update
3. Blog dengan 10 artikel yang jarang berubah
4. Aplikasi SaaS dengan update mingguan
5. Streaming video on-demand dengan 50.000 video
6. Website sekolah dengan konten statis
7. API backend yang response-nya berbeda per user

**Jawaban:**
1. **Push** — konten sedikit, jarang berubah, bisa upload sekali
2. **Pull** — konten banyak dan sering berubah, tidak praktis upload manual
3. **Push** — konten sedikit dan stabil
4. **Pull** — update sering, otomatis lebih praktis
5. **Pull** — video sangat banyak, hanya yang populer yang perlu di-cache
6. **Push** — konten statis, bisa upload ke CDN saat deploy
7. **Tidak pakai CDN cache** — response dinamis per user, tidak bisa di-cache. Tapi bisa pakai CDN untuk route optimization.

### Latihan 2: Hitung Penghematan CDN

Website sekolah dengan data berikut:
- 1.000 user per hari
- Setiap user melakukan 20 page views
- Setiap page view memuat 2MB static files (gambar, CSS, JS, font)
- Bandwidth server: Rp 1.000/GB
- CDN bandwidth: Rp 200/GB (atau gratis di CloudFlare)

**Pertanyaan:**
1. Berapa total bandwidth static files per bulan tanpa CDN?
2. Jika CDN hit rate 85%, berapa bandwidth yang masih ke origin?
3. Berapa penghematan biaya dengan CDN?

**Jawaban:**
1. 1.000 user × 20 page views × 2MB × 30 hari = 1.200.000MB = **1.200GB/bulan**
   Biaya tanpa CDN: 1.200 × Rp 1.000 = **Rp 1.200.000/bulan**

2. CDN hit rate 85% → origin handle 15%:
   1.200GB × 15% = **180GB/bulan ke origin**
   Biaya origin: 180 × Rp 1.000 = **Rp 180.000/bulan**

3. CDN handle 85% = 1.020GB:
   Dengan CloudFlare Free: **Rp 0** → Penghematan: Rp 1.200.000 - Rp 180.000 = **Rp 1.020.000/bulan**
   Dengan CDN berbayar (Rp 200/GB): 1.020 × Rp 200 = Rp 204.000
   Total biaya: Rp 180.000 + Rp 204.000 = Rp 384.000
   Penghematan: Rp 1.200.000 - Rp 384.000 = **Rp 816.000/bulan**

### Latihan 3: Desain Cache Strategy

Desain cache strategy untuk website berita online dengan:
- Homepage: update setiap 5 menit
- Artikel berita: update saat ada breaking news
- Gambar artikel: tidak pernah berubah setelah upload
- Komentar: real-time
- Sidebar (trending, related): update setiap 10 menit

**Jawaban:**
```
Homepage (/):
  Cache-Control: public, max-age=300, stale-while-revalidate=600
  → Cache 5 menit, boleh serve stale 10 menit sambil refresh

Artikel (/berita/slug):
  Cache-Control: public, max-age=600, stale-while-revalidate=3600
  → Cache 10 menit, boleh serve stale 1 jam sambil refresh
  → Saat breaking news: purge URL spesifik

Gambar (/images/*):
  Cache-Control: public, max-age=31536000, immutable
  → Cache 1 tahun, tidak pernah berubah (versioned filenames)

Komentar (/api/comments):
  Cache-Control: private, no-cache
  → Tidak di-cache di CDN, selalu fetch dari origin

Sidebar (/api/trending):
  Cache-Control: public, max-age=600, stale-while-revalidate=300
  → Cache 10 menit, boleh serve stale 5 menit
```

### Latihan 4: Troubleshooting CDN

**Scenario:** Setelah deploy CSS baru, user masih melihat tampilan lama.

**Langkah troubleshooting:**
```bash
# 1. Cek apakah file baru sudah di origin
curl -I https://example.com/css/style.css
# Lihat Last-Modified dan ETag

# 2. Cek apakah CDN serve file lama atau baru
curl -I https://example.com/css/style.css
# Lihat header: X-Cache (HIT/MISS), Age, CF-Cache-Status

# 3. Jika CDN masih serve file lama (HIT):
#    Option A: Purge cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone}/purge_cache" \
  -H "Authorization: Bearer {token}" \
  --data '{"files":["https://example.com/css/style.css"]}'

#    Option B: Bypass cache dengan query string (temporary)
#    https://example.com/css/style.css?v=hotfix

# 4. Verifikasi fix
curl https://example.com/css/style.css | head -20
# Cek apakah konten sudah terbaru
```

**Best practice untuk menghindari masalah ini:**
- Gunakan content hash di filename: `style.a1b2c3d4.css`
- Setiap deploy, filename berubah → CDN anggap file baru → tidak perlu purge
- Set `Cache-Control: public, max-age=31536000, immutable` untuk versioned assets

---

## ✅ CHECKLIST

- [ ] Bisa menjelaskan apa itu CDN dan bagaimana arsitekturnya (edge, origin, PoP)
- [ ] Paham perbedaan Pull CDN vs Push CDN dan kapan menggunakan masing-masing
- [ ] Mengerti cache invalidation strategies (purge, versioning, stale-while-revalidate)
- [ ] Bisa menjelaskan Cache-Control directives dan kombinasinya
- [ ] Paham kriteria pemilihan CDN (coverage, pricing, features, ease of use)
- [ ] Bisa membandingkan CDN providers (CloudFlare, CloudFront, Fastly, Akamai)
- [ ] Mengerti CDN security features (DDoS protection, WAF, bot management)
- [ ] Paham bagaimana CDN mengoptimasi dynamic content
- [ ] Mengerti edge computing concepts (CloudFlare Workers, Lambda@Edge)
- [ ] Bisa mendesain cache strategy untuk berbagai jenis konten
- [ ] Bisa menghitung penghematan bandwidth dan biaya dengan CDN
- [ ] Bisa troubleshooting masalah caching CDN

---

## 🔗 REFERENSI

- **Repo Asli:** [donnemartin/system-design-primer — CDN](https://github.com/donnemartin/system-design-primer#content-delivery-network)
- **CloudFlare:** [What is a CDN?](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/)
- **AWS:** [Amazon CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- **Fastly:** [CDN Education](https://www.fastly.com/products/cdn)
- **Akamai:** [CDN Glossary](https://www.akamai.com/glossary/what-is-a-content-delivery-network-cdn)
- **MDN:** [HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- **RFC 7234:** [HTTP/1.1 Caching](https://tools.ietf.org/html/rfc7234)
- **RFC 5861:** [stale-while-revalidate and stale-if-error](https://tools.ietf.org/html/rfc5861)
- **Google:** [Web.dev — CDN Best Practices](https://web.dev/cdn/)

---

> **Lanjut ke:** [`09-load-balancer.md`](./09-load-balancer.md)
