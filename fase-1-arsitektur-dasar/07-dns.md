# 07 — DNS (Domain Name System)

> **Estimasi:** 1.5 jam | **Level:** Pemula → Menengah
> **Referensi utama:** [donnemartin/system-design-primer — DNS](https://github.com/donnemartin/system-design-primer#domain-name-system)

---

## 📖 TEORI

### Apa itu DNS?

**DNS (Domain Name System)** adalah sistem hierarkis dan terdesentralisasi yang menerjemahkan nama domain yang mudah diingat manusia (seperti `www.google.com`) menjadi alamat IP numerik yang dipahami komputer (seperti `142.250.177.78`). DNS sering disebut sebagai "buku telepon internet".

Tanpa DNS, manusia harus menghafal deretan angka IP untuk setiap website yang ingin dikunjungi. Bayangkan jika setiap kali ingin membuka Google, Anda harus mengetik `142.250.177.78` alih-alih `google.com`.

```
┌─────────────────────────────────────────────────────────┐
│                    DNS RESOLUTION                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Manusia ketik:   www.sdnpasirhalang.sch.id              │
│                        ↓                                 │
│                   [DNS Lookup]                           │
│                        ↓                                 │
│  Komputer dapat:    103.28.148.25                        │
│                        ↓                                 │
│  Browser connect:   HTTP Request ke 103.28.148.25:443    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Kenapa DNS Penting dalam System Design?

DNS bukan sekadar "penerjemah nama domain". Dalam arsitektur sistem modern, DNS berperan sebagai **layer routing pertama** yang menentukan ke mana traffic akan diarahkan. DNS digunakan untuk:

- **Load balancing** — Mendistribusikan traffic ke beberapa server menggunakan teknik seperti round-robin DNS
- **Fail-over** — Mengalihkan traffic secara otomatis saat server utama down
- **Geo-routing** — Mengarahkan user ke server terdekat berdasarkan lokasi geografis
- **CDN integration** — Mengarahkan user ke edge server CDN terdekat
- **Traffic management** — Mengatur distribusi traffic untuk A/B testing, canary deployment, dan blue-green deployment
- **Security** — DNSSEC untuk memverifikasi integritas data DNS, DoH/DoT untuk enkripsi query

Menurut donnemartin/system-design-primer, DNS adalah komponen fundamental dalam arsitektur sistem terdistribusi karena menjadi **titik masuk pertama** untuk hampir semua komunikasi jaringan.

---

### DNS Hierarchy — Struktur Hierarki DNS

DNS diorganisir dalam struktur hierarki pohon (tree) yang terdesentralisasi. Setiap level dalam hierarki memiliki tanggung jawab berbeda.

```
┌──────────────────────────────────────────────────────────────┐
│                    ROOT SERVER (.)                             │
│              13 root server clusters (A-M)                     │
│           Hundreds of instances via anycast                    │
│         Menangani ~100 billion queries/hari                    │
└──────────────────────┬───────────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
┌─────────▼─────────┐     ┌─────────▼─────────┐
│   gTLD Servers    │     │   ccTLD Servers     │
│  (.com, .org, .net)│     │  (.id, .uk, .jp)    │
│  ~1,500 servers   │     │  ~500+ servers      │
└─────────┬─────────┘     └─────────┬─────────┘
          │                         │
   ┌──────┴──────┐            ┌─────┴─────┐
   │             │            │           │
┌──▼──┐    ┌────▼────┐  ┌────▼───┐  ┌───▼────┐
│.com │    │ .org    │  │ .sch.id│  │ .ac.id │
│server│    │ server  │  │ server │  │ server │
└──┬───┘    └────┬────┘  └────┬───┘  └───┬────┘
   │             │            │          │
┌──▼─────────────▼──┐  ┌─────▼──────────▼────┐
│ Authoritative DNS │  │ Authoritative DNS     │
│ google.com        │  │ sdnpasirhalang.sch.id │
│ ns1.google.com    │  │ ns1.hosting.com       │
│ ns2.google.com    │  │ ns2.hosting.com       │
└───────────────────┘  └───────────────────────┘
```

#### 1. Root DNS Servers

Root server adalah level tertinggi dalam hierarki DNS. Ada **13 root server clusters** yang diberi label A sampai M:

| Label | Operator | Lokasi Utama |
|-------|----------|--------------|
| A | Verisign | AS |
| B | USC-ISI | AS |
| C | Cogent Communications | Global |
| D | University of Maryland | AS |
| E | NASA | AS |
| F | Internet Systems Consortium | Global |
| G | US DoD | AS |
| H | US Army | AS |
| I | Netnod | Swedia |
| J | Verisign | Global |
| K | RIPE NCC | Eropa |
| L | ICANN | Global |
| M | WIDE Project | Jepang |

Meskipun hanya ada 13 alamat IP root server, masing-masing di-deploy di **ratusan lokasi** menggunakan **anycast routing**. Total ada **1,700+ instance** root server di seluruh dunia.

**Anycast** memungkinkan banyak server menggunakan IP yang sama. Router BGP akan mengarahkan query ke instance terdekat secara geografis.

#### 2. TLD (Top-Level Domain) Servers

TLD server mengelola domain level atas. Ada dua jenis TLD:

**gTLD (Generic TLD):**
- `.com` — Komersial (paling populer, ~160 juta domain)
- `.org` — Organisasi
- `.net` — Network
- `.edu` — Pendidikan (AS)
- `.gov` — Pemerintah (AS)
- `.info`, `.biz`, `.io`, `.dev`, `.app`

**ccTLD (Country Code TLD):**
- `.id` — Indonesia
- `.sch.id` — Sekolah di Indonesia
- `.ac.id` — Akademik/universitas di Indonesia
- `.go.id` — Pemerintah Indonesia
- `.co.id` — Komersial Indonesia
- `.uk` — Inggris
- `.jp` — Jepang
- `.sg` — Singapore

#### 3. Authoritative DNS Servers

Authoritative server adalah server yang **memiliki data resmi** untuk suatu domain. Server ini menjawab pertanyaan "apa IP untuk domain X?" dengan jawaban definitif.

Authoritative server dikelola oleh:
- **Registrar** (tempat beli domain) — misalnya CloudFlare, GoDaddy, Namecheap
- **Managed DNS provider** — misalnya AWS Route 53, Google Cloud DNS
- **Self-hosted** — misalnya BIND, PowerDNS di server sendiri

Setiap domain harus memiliki **minimal 2 authoritative nameserver** (untuk redundancy).

#### 4. Recursive DNS Resolver (Resolver)

Recursive resolver adalah server yang **melakukan pencarian DNS atas nama client**. Resolver akan melakukan iterasi melalui root → TLD → authoritative untuk mendapatkan jawaban.

Resolver biasanya disediakan oleh:
- **ISP** — resolver default dari provider internet Anda
- **Public DNS** — Google (8.8.8.8), CloudFlare (1.1.1.1), Quad9 (9.9.9.9)
- **Local DNS** — resolver di jaringan internal perusahaan

```
┌──────────────────────────────────────────────────────────────┐
│              DNS RESOLUTION — ITERATIVE QUERY                 │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Client (Browser)                                             │
│       │                                                       │
│       │ 1. Recursive query: "Apa IP www.example.com?"         │
│       ▼                                                       │
│  Recursive Resolver (ISP/8.8.8.8)                             │
│       │                                                       │
│       │ 2. Iterative query ke Root: ".com di mana?"           │
│       ▼                                                       │
│  Root Server → Referral: "Tanya .com TLD server di IP X"     │
│       │                                                       │
│       │ 3. Iterative query ke TLD: "example.com di mana?"     │
│       ▼                                                       │
│  TLD Server → Referral: "Tanya ns1.example.com di IP Y"      │
│       │                                                       │
│       │ 4. Iterative query ke Authoritative: "www.example.com?"│
│       ▼                                                       │
│  Authoritative Server → Answer: "93.184.216.34"              │
│       │                                                       │
│       │ 5. Jawaban dikembalikan ke client                     │
│       ▼                                                       │
│  Client → Connect ke 93.184.216.34                           │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### DNS Resolution — Step by Step

Mari kita trace secara detail apa yang terjadi ketika Anda mengetik `www.example.com` di browser:

**Step 1 — Browser Cache Check**

Browser mengecek cache lokalnya terlebih dahulu. Jika pernah mengakses `www.example.com` sebelumnya dan record masih dalam TTL, browser langsung menggunakan IP dari cache.

```
Browser cache: www.example.com → 93.184.216.34 (TTL: 300s, sisa: 120s)
→ HIT! Langsung gunakan IP ini.
```

**Step 2 — OS Cache Check**

Jika browser cache kosong (miss), sistem operasi dicek. Di Windows, ini ada di DNS Client service. Di Linux, biasanya nscd atau systemd-resolved.

```
# Cek DNS cache di Windows
ipconfig /displaydns

# Cek DNS cache di Linux (systemd)
systemd-resolve --statistics

# Flush DNS cache
# Windows:
ipconfig /flushdns
# macOS:
sudo dscacheutil -flushcache
# Linux (systemd):
sudo systemd-resolve --flush-caches
```

**Step 3 — Recursive Resolver Query**

Jika OS cache juga kosong, query dikirim ke recursive resolver (biasanya dari ISP atau public DNS seperti 8.8.8.8). Resolver akan melakukan **iterative query** melalui hierarki DNS.

**Step 4 — Root Server Query**

Resolver bertanya ke root server: "Di mana saya bisa menemukan informasi tentang domain `.com`?"

Root server menjawab dengan **referral** — daftar TLD name server untuk `.com`:
```
Query:  "." (root) → "Where is .com?"
Answer: Referral to a.gtld-servers.net, b.gtld-servers.net, ...
```

**Step 5 — TLD Server Query**

Resolver bertanya ke salah satu `.com` TLD server: "Di mana saya bisa menemukan informasi tentang `example.com`?"

TLD server menjawab dengan referral ke authoritative name server untuk `example.com`:
```
Query:  ".com" → "Where is example.com?"
Answer: Referral to ns1.example.com (IP: 198.41.0.4), ns2.example.com (IP: 198.41.1.4)
```

**Step 6 — Authoritative Server Query**

Resolver bertanya ke authoritative name server: "Apa IP address untuk `www.example.com`?"

Authoritative server menjawab dengan **A record**:
```
Query:  "example.com" → "What is the IP for www.example.com?"
Answer: www.example.com → 93.184.216.34 (TTL: 86400)
```

**Step 7 — Response to Client**

Resolver menyimpan jawaban di cache-nya (sesuai TTL) dan mengirimkan IP address kembali ke client. Browser kemudian bisa melakukan koneksi TCP ke IP tersebut.

```
┌──────────────────────────────────────────────────────────────┐
│                    TIMELINE DNS RESOLUTION                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  t=0ms    Browser: "www.example.com"                          │
│  t=0ms    Browser cache → MISS                                │
│  t=1ms    OS cache → MISS                                     │
│  t=2ms    Query ke Recursive Resolver (8.8.8.8)               │
│  t=5ms    Resolver cache → MISS                               │
│  t=10ms   Resolver query ke Root Server                       │
│  t=30ms   Root → Referral ke .com TLD                         │
│  t=35ms   Resolver query ke .com TLD                          │
│  t=55ms   TLD → Referral ke ns1.example.com                   │
│  t=60ms   Resolver query ke Authoritative                     │
│  t=80ms   Authoritative → Answer: 93.184.216.34               │
│  t=82ms   Resolver simpan di cache (TTL: 86400s)              │
│  t=85ms   Resolver kirim jawaban ke browser                   │
│  t=86ms   Browser simpan di cache (TTL: 86400s)               │
│  t=87ms   Browser mulai TCP handshake ke 93.184.216.34        │
│                                                               │
│  Total DNS resolution: ~87ms (jika semua cache miss)          │
│  Dengan cache: <1ms                                           │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Catatan penting:** Proses di atas hanya terjadi saat **semua cache miss**. Dalam praktiknya, sebagian besar query DNS di-resolve dari cache dalam waktu **< 1ms**. Ini mengapa DNS caching sangat krusial untuk performa.

---

### DNS Record Types — Lengkap dengan Contoh

DNS memiliki berbagai jenis record yang melayani fungsi berbeda. Berikut penjelasan lengkapnya:

#### A Record (Address Record)

Memetakan nama domain ke **IPv4 address**. Ini adalah record paling dasar dan paling umum digunakan.

```
; Format: NAME  TTL  CLASS  TYPE  VALUE
example.com.    3600  IN    A     93.184.216.34
www.example.com. 300  IN    A     93.184.216.34
api.example.com. 300  IN    A     93.184.216.35
mail.example.com. 3600 IN    A     93.184.216.50
```

**Contoh penggunaan di sekolah:**
```
sdnpasirhalang.sch.id.    3600  IN  A  103.28.148.25
portal.sdnpasirhalang.sch.id.  300  IN  A  103.28.148.26
absensi.sdnpasirhalang.sch.id. 300  IN  A  103.28.148.27
```

Satu domain bisa memiliki **multiple A records** untuk load balancing sederhana (round-robin DNS):
```
example.com.  300  IN  A  93.184.216.34
example.com.  300  IN  A  93.184.216.35
example.com.  300  IN  A  93.184.216.36
```

#### AAAA Record (IPv6 Address Record)

Memetakan nama domain ke **IPv6 address**. IPv6 menggunakan 128-bit address (vs 32-bit di IPv4).

```
example.com.    3600  IN  AAAA  2606:2800:220:1:248:1893:25c8:1946
google.com.     300   IN  AAAA  2404:6800:4001:81c::200e
```

**Format IPv6:**
- 8 grup heksadesimal, dipisahkan titik dua
- Leading zero bisa dihilangkan: `2001:0db8:0000:0000:0000:0000:0000:0001` → `2001:db8::1`
- `::` bisa digunakan sekali untuk menggantikan grup nol berturut-turut

#### CNAME Record (Canonical Name)

Membuat **alias** dari satu nama domain ke nama domain lain. CNAME selalu mengarah ke nama domain, bukan IP address.

```
; www.example.com adalah alias dari example.com
www.example.com.     3600  IN  CNAME  example.com.

; Alias untuk subdomain
blog.example.com.    3600  IN  CNAME  example.com.
shop.example.com.    3600  IN  CNAME  shops.myshopify.com.
cdn.example.com.     3600  IN  CNAME  d123456.cloudfront.net.
```

**Aturan penting:**
- CNAME tidak bisa coexist dengan record lain untuk nama yang sama
- Tidak boleh ada CNAME di apex/root domain (`example.com`) — hanya untuk subdomain
- CNAME chain (CNAME → CNAME → A) diperbolehkan tapi tidak disarankan (memperlambat resolusi)

#### MX Record (Mail Exchange)

Menentukan **mail server** yang bertanggung jawab menerima email untuk domain. MX record memiliki **priority** — angka lebih rendah = prioritas lebih tinggi.

```
; Primary mail server (prioritas 10)
example.com.    3600  IN  MX  10  mail.example.com.

; Backup mail server (prioritas 20)
example.com.    3600  IN  MX  20  mail2.example.com.

; Third backup (prioritas 30)
example.com.    3600  IN  MX  30  mail3.example.com.
```

**Contoh setup email sekolah dengan Google Workspace:**
```
sdnpasirhalang.sch.id.  3600  IN  MX  1   aspmx.l.google.com.
sdnpasirhalang.sch.id.  3600  IN  MX  5   alt1.aspmx.l.google.com.
sdnpasirhalang.sch.id.  3600  IN  MX  5   alt2.aspmx.l.google.com.
sdnpasirhalang.sch.id.  3600  IN  MX  10  alt3.aspmx.l.google.com.
sdnpasirhalang.sch.id.  3600  IN  MX  10  alt4.aspmx.l.google.com.
```

#### TXT Record (Text Record)

Menyimpan **text arbitrary** di DNS. Sering digunakan untuk verifikasi domain, email security (SPF, DKIM, DMARC), dan berbagai keperluan lainnya.

```
; SPF (Sender Policy Framework) — menentukan server yang boleh kirim email
example.com.    3600  IN  TXT  "v=spf1 include:_spf.google.com ~all"

; DKIM (DomainKeys Identified Mail) — verifikasi tanda tangan email
google._domainkey.example.com.  3600  IN  TXT  "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3..."

; DMARC — kebijakan handling email yang gagal SPF/DKIM
_dmarc.example.com.  3600  IN  TXT  "v=DMARC1; p=reject; rua=mailto:dmarc@example.com"

; Domain verification (Google Search Console, dll)
example.com.    3600  IN  TXT  "google-site-verification=abc123def456"
```

#### NS Record (Name Server)

Menentukan **authoritative name server** untuk domain. Setiap domain harus memiliki minimal 2 NS records untuk redundancy.

```
example.com.    86400  IN  NS  ns1.example.com.
example.com.    86400  IN  NS  ns2.example.com.
example.com.    86400  IN  NS  ns3.example.com.
example.com.    86400  IN  NS  ns4.example.com.
```

**Contoh NS dari CloudFlare:**
```
sdnpasirhalang.sch.id.  86400  IN  NS  aron.ns.cloudflare.com.
sdnpasirhalang.sch.id.  86400  IN  NS  lola.ns.cloudflare.com.
```

#### SOA Record (Start of Authority)

Record **wajib** yang ada di setiap zone file DNS. SOA berisi informasi administratif tentang zone DNS.

```
example.com.  3600  IN  SOA  ns1.example.com. admin.example.com. (
    2024010101  ; Serial number (format: YYYYMMDDNN)
    3600        ; Refresh (1 jam — slave cek update ke master)
    900         ; Retry (15 menit — slave retry jika refresh gagal)
    604800      ; Expire (7 hari — slave stop serve jika tidak bisa contact master)
    86400       ; Minimum TTL (1 hari — TTL default untuk negative caching)
)
```

**Penjelasan field SOA:**
- **Serial number**: Versi zone file. Harus diincrement setiap ada perubahan. Format umum: `YYYYMMDDNN` (tanggal + nomor revisi)
- **Refresh**: Berapa lama secondary server menunggu sebelum cek update ke primary
- **Retry**: Berapa lama secondary menunggu sebelum retry jika refresh gagal
- **Expire**: Berapa lama secondary masih bisa serve data jika tidak bisa contact primary
- **Minimum TTL**: TTL default untuk negative caching (saat record tidak ditemukan)

#### SRV Record (Service Record)

Menentukan **lokasi service** tertentu (host dan port) untuk protokol spesifik. Digunakan untuk service discovery.

```
; Format: _service._protocol.name.  TTL  CLASS  SRV  priority weight port target.

; SIP service
_sip._tcp.example.com.  3600  IN  SRV  10  60  5060  sipserver.example.com.

; XMPP (Jabber) service
_xmpp-server._tcp.example.com.  3600  IN  SRV  5  0  5269  xmpp.example.com.

; LDAP service
_ldap._tcp.example.com.  3600  IN  SRV  10  100  389  ldap.example.com.

; Microsoft Teams
_sipfederationtls._tcp.example.com.  3600  IN  SRV  100  1  5061  sipfed.online.lync.com.
```

**Field SRV:**
- **Priority**: Prioritas (lebih rendah = lebih prioritas)
- **Weight**: Bobot untuk load balancing dalam prioritas yang sama
- **Port**: Nomor port service
- **Target**: Hostname server yang menyediakan service

#### PTR Record (Pointer Record)

**Reverse DNS lookup** — memetakan IP address ke nama domain (kebalikan dari A record). Digunakan untuk verifikasi email dan troubleshooting.

```
; Reverse lookup untuk IPv4 (format: reversed IP + .in-addr.arpa)
34.216.184.93.in-addr.arpa.  3600  IN  PTR  mail.example.com.

; Reverse lookup untuk IPv6 (format: reversed nibbles + .ip6.arpa)
6.4.9.1.8.c.5.2.3.9.8.1.8.4.2.0.0.0.0.0.0.0.0.0.0.0.0.0.6.0.6.2.ip6.arpa.  3600  IN  PTR  mail.example.com.
```

PTR record biasanya dikelola oleh **pemilik IP block** (ISP atau hosting provider), bukan pemilik domain.

#### Ringkasan DNS Record Types

| Record | Fungsi | Contoh Value | TTL Umum |
|--------|--------|--------------|----------|
| **A** | Domain → IPv4 | `93.184.216.34` | 300-3600 |
| **AAAA** | Domain → IPv6 | `2606:2800:220:1:248:1893:25c8:1946` | 300-3600 |
| **CNAME** | Alias → Domain lain | `example.com.` | 300-3600 |
| **MX** | Mail server | `10 mail.example.com.` | 3600 |
| **TXT** | Text data | `"v=spf1 include:_spf.google.com ~all"` | 3600 |
| **NS** | Name server | `ns1.example.com.` | 86400 |
| **SOA** | Zone authority | `ns1 admin 2024010101 3600 900 604800 86400` | 3600 |
| **SRV** | Service location | `10 60 5060 sipserver.example.com.` | 3600 |
| **PTR** | IP → Domain (reverse) | `mail.example.com.` | 3600 |

---

### DNS Caching — Mendalam

DNS caching adalah mekanisme untuk menyimpan hasil query DNS sementara, sehingga query berikutnya tidak perlu melakukan resolusi penuh melalui hierarki DNS.

#### TTL (Time To Live)

TTL menentukan berapa detik sebuah record DNS boleh di-cache sebelum harus di-refresh.

```
┌──────────────────────────────────────────────────────────────┐
│                    TTL BEHAVIOR                                │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Record: example.com → 93.184.216.34  TTL: 300 (5 menit)     │
│                                                               │
│  t=0:     Query pertama → dapat IP → simpan di cache          │
│  t=60:    Query kedua → cache HIT → langsung dapat IP         │
│  t=120:   Query ketiga → cache HIT → langsung dapat IP        │
│  t=300:   TTL expired → cache invalid                         │
│  t=301:   Query berikutnya → cache MISS → query ulang         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**TTL Selection Guide:**

| Skenario | TTL yang Disarankan | Alasan |
|----------|---------------------|--------|
| Website stabil, jarang berubah | 86400 (1 hari) | Maksimalkan cache, minimalisir query |
| API endpoint, mungkin berubah | 300 (5 menit) | Balance antara performa dan fleksibilitas |
| Migrasi server / failover | 60 (1 menit) | Cepat redirect saat ada perubahan |
| Development / testing | 30 (30 detik) | Perubahan langsung terlihat |
| Email (MX record) | 3600 (1 jam) | Email tidak butuh perubahan cepat |

**Trade-off TTL:**
- **TTL tinggi**: Lebih sedikit query DNS → lebih cepat untuk user → lebih sedikit beban DNS server. TAPI: perubahan IP butuh waktu lama untuk propagate.
- **TTL rendah**: Perubahan IP cepat propagate → lebih fleksibel. TAPI: lebih banyak query DNS → lebih lambat untuk user → lebih banyak beban DNS server.

**Best practice:** Gunakan TTL tinggi untuk production stabil, turunkan TTL beberapa jam sebelum migrasi IP, lalu naikkan kembali setelah migrasi selesai.

#### Negative Caching

Ketika DNS query menghasilkan **error** (domain tidak ada, record tidak ditemukan), hasil error ini juga di-cache. Ini disebut **negative caching**.

```
Query: nonexistent.example.com → NXDOMAIN (domain tidak ada)
→ Hasil NXDOMAIN di-cache sesuai SOA minimum TTL

Query berikutnya: nonexistent.example.com → cache HIT → NXDOMAIN langsung
→ Tidak perlu query ulang ke authoritative server
```

Negative caching mencegah repeated query untuk domain yang memang tidak ada, mengurangi beban DNS server.

#### DNS Cache di Berbagai Layer

DNS caching terjadi di **beberapa layer** secara berlapis:

```
┌──────────────────────────────────────────────────────────────┐
│              DNS CACHING LAYERS                                │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Application Cache (Browser)                         │
│  - Chrome: ~1000 entries, TTL-based                           │
│  - Firefox: ~400 entries, TTL-based                           │
│  - chrome://net-internals/#dns (Chrome DNS cache viewer)      │
│                                                               │
│  Layer 2: OS Cache                                            │
│  - Windows: DNS Client service                                │
│  - macOS: mDNSResponder / discoveryd                          │
│  - Linux: nscd / systemd-resolved / dnsmasq                   │
│                                                               │
│  Layer 3: Recursive Resolver Cache                            │
│  - ISP resolver: jutaan entries                                │
│  - Public DNS (8.8.8.8, 1.1.1.1): miliaran entries            │
│                                                               │
│  Layer 4: Local Network Cache                                 │
│  - Router DNS cache (jika ada)                                │
│  - dnsmasq di jaringan lokal                                  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### DNS Load Balancing

DNS bisa digunakan sebagai mekanisme load balancing sederhana. Berikut teknik-tekniknya:

#### Round Robin DNS

Teknik paling sederhana: satu domain memiliki **multiple A records**, dan DNS server mengembalikan IP yang berbeda secara bergiliran untuk setiap query.

```
; DNS Zone File — Round Robin
example.com.  300  IN  A  10.0.1.1
example.com.  300  IN  A  10.0.1.2
example.com.  300  IN  A  10.0.1.3

; Query 1 → 10.0.1.1
; Query 2 → 10.0.1.2
; Query 3 → 10.0.1.3
; Query 4 → 10.0.1.1 (kembali ke awal)
```

**Kelebihan:**
- Sangat sederhana, tidak butuh hardware/software tambahan
- Gratis (hanya konfigurasi DNS)

**Kekurangan:**
- Tidak aware dengan health server (server down tetap di-return)
- Tidak aware dengan load server (server sibuk tetap dapat traffic)
- Tidak aware dengan lokasi client
- DNS caching membuat distribusi tidak merata

#### Weighted Round Robin DNS

Variasi dari round robin dengan **bobot** berbeda untuk setiap server.

```
; Weighted DNS (contoh di AWS Route 53)
; Server A: weight 80 (80% traffic)
; Server B: weight 20 (20% traffic)

app.example.com.  300  IN  A  10.0.1.1  ; weight 80
app.example.com.  300  IN  A  10.0.1.2  ; weight 20
```

**Use case:**
- A/B testing: 90% user ke versi A, 10% ke versi B
- Canary deployment: 95% ke versi lama, 5% ke versi baru
- Migrasi bertahap: geser traffic secara perlahan dari server lama ke baru

#### Geo DNS

DNS resolver mendeteksi **lokasi geografis** client dan mengembalikan IP server terdekat.

```
┌──────────────────────────────────────────────────────────────┐
│                    GEO DNS FLOW                                │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  User Jakarta (IP: 36.68.x.x)                                 │
│       │                                                       │
│       │ Query: app.example.com                                │
│       ▼                                                       │
│  Geo DNS Server → Deteksi lokasi dari IP resolver             │
│       │ → IP 36.68.x.x → Indonesia → Southeast Asia           │
│       ▼                                                       │
│  Return: 10.0.1.1 (Server Singapore)                          │
│                                                               │
│  User London (IP: 81.134.x.x)                                 │
│       │                                                       │
│       │ Query: app.example.com                                │
│       ▼                                                       │
│  Geo DNS Server → Deteksi lokasi dari IP resolver             │
│       │ → IP 81.134.x.x → UK → Europe                        │
│       ▼                                                       │
│  Return: 10.0.2.1 (Server Frankfurt)                          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### Latency-based DNS

DNS mengembalikan IP server dengan **latensi terendah** ke lokasi client. Berbeda dengan geo DNS yang berdasarkan lokasi, latency-based berdasarkan pengukuran latency aktual.

#### Failover DNS

DNS secara otomatis mengubah record saat server utama down. Biasanya dikombinasikan dengan **health check**.

```
┌──────────────────────────────────────────────────────────────┐
│                    DNS FAILOVER                                │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Normal:                                                      │
│  api.example.com → 10.0.1.1 (Primary, health: OK)            │
│                  → 10.0.2.1 (Secondary, standby)              │
│                                                               │
│  Health check: Setiap 30 detik ping 10.0.1.1:443              │
│                                                               │
│  Primary down!                                                │
│  Health check: 10.0.1.1:443 → TIMEOUT (3x consecutive)        │
│  DNS update: api.example.com → 10.0.2.1 (aktif)               │
│                                                               │
│  Catatan: DNS failover TIDAK instan karena TTL caching!       │
│  Jika TTL = 300s, user dengan cache lama masih dapat IP lama  │
│  Solusi: Gunakan TTL rendah (30-60s) untuk domain failover    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### DNS Security

#### DNSSEC (DNS Security Extensions)

DNSSEC menambahkan **tanda tangan digital** pada DNS record untuk memverifikasi bahwa jawaban DNS tidak dimanipulasi.

```
┌──────────────────────────────────────────────────────────────┐
│                    DNSSEC CHAIN OF TRUST                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Root Zone (.)                                                │
│  └── KSK (Key Signing Key)                                   │
│      └── ZSK (Zone Signing Key)                              │
│          └── .com TLD                                        │
│              └── KSK                                         │
│                  └── ZSK                                     │
│                      └── example.com                         │
│                          └── KSK                             │
│                              └── ZSK                         │
│                                  └── RRSIG (signature)       │
│                                      └── www.example.com     │
│                                          → A record + RRSIG  │
│                                                               │
│  Client verifikasi:                                          │
│  1. Terima A record + RRSIG                                  │
│  2. Verifikasi RRSIG dengan DNSKEY (ZSK)                     │
│  3. Verifikasi DNSKEY (ZSK) dengan DNSKEY (KSK)              │
│  4. Verifikasi KSK dengan DS record dari parent              │
│  5. Ulangi sampai root (trust anchor)                        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Record DNSSEC:**
- **RRSIG** (Resource Record Signature): Tanda tangan digital untuk record
- **DNSKEY**: Public key untuk verifikasi signature
- **DS** (Delegation Signer): Hash dari KSK child zone, disimpan di parent
- **NSEC/NSEC3**: Bukti bahwa record tidak ada (untuk negative response)

#### DoH (DNS over HTTPS)

Mengenkripsi query DNS melalui protokol HTTPS (port 443). Query DNS tidak bisa diintip atau dimanipulasi oleh pihak ketiga.

```
Tanpa DoH:
[Client] ── DNS query (plaintext, port 53) ──→ [DNS Server]
                ↑ ISP bisa lihat semua query!

Dengan DoH:
[Client] ── HTTPS request (encrypted, port 443) ──→ [DoH Server]
                ↑ ISP hanya lihat traffic HTTPS, tidak bisa lihat query DNS
```

**DoH endpoint populer:**
- CloudFlare: `https://1.1.1.1/dns-query`
- Google: `https://dns.google/dns-query`
- Quad9: `https://dns.quad9.net/dns-query`

#### DoT (DNS over TLS)

Mengenkripsi query DNS melalui TLS (port 853). Mirip DoH tapi menggunakan port dedicated.

```
Tanpa DoT:
[Client] ── DNS query (plaintext, port 53) ──→ [DNS Server]

Dengan DoT:
[Client] ── TLS connection (encrypted, port 853) ──→ [DNS Server]
```

**Perbedaan DoH vs DoT:**

| Aspek | DoH | DoT |
|-------|-----|-----|
| Port | 443 (HTTPS) | 853 (dedicated) |
| Protokol | HTTP/2 + DNS | TLS + DNS |
| Firewall | Sulit diblok (campur dengan traffic HTTPS) | Mudah diblok (port dedicated) |
| Caching | Browser bisa cache | OS-level cache |
| Privacy | Lebih baik (campur traffic web) | Baik tapi teridentifikasi |

---

### DNS Troubleshooting

#### Menggunakan `dig` (Domain Information Groper)

`dig` adalah tool DNS troubleshooting paling powerful di Linux/macOS.

```bash
# Query A record dasar
dig example.com

# Query spesifik record type
dig example.com AAAA
dig example.com MX
dig example.com TXT
dig example.com NS

# Query ke server spesifik
dig @8.8.8.8 example.com
dig @1.1.1.1 example.com
dig @ns1.example.com example.com

# Trace full resolution path
dig example.com +trace

# Output singkat (hanya jawaban)
dig example.com +short

# Lihat semua detail termasuk timing
dig example.com +stats +nocmd +noall +answer +authority +additional

# Reverse DNS lookup
dig -x 93.184.216.34

# Query dengan DNSSEC validation
dig example.com +dnssec
```

**Contoh output `dig`:**
```
$ dig example.com

; <<>> DiG 9.18.1 <<>> example.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 2, ADDITIONAL: 3

;; QUESTION SECTION:
;example.com.                   IN      A

;; ANSWER SECTION:
example.com.            300     IN      A       93.184.216.34

;; AUTHORITY SECTION:
example.com.            86400   IN      NS      a.iana-servers.net.
example.com.            86400   IN      NS      b.iana-servers.net.

;; Query time: 45 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: Mon Jan 01 12:00:00 2024
;; MSG SIZE  rcvd: 85
```

#### Menggunakan `nslookup`

`nslookup` adalah tool DNS yang lebih sederhana, tersedia di Windows, Linux, dan macOS.

```bash
# Query dasar
nslookup example.com

# Query ke server spesifik
nslookup example.com 8.8.8.8

# Interactive mode
nslookup
> set type=MX
> example.com
> set type=NS
> example.com
> server 1.1.1.1
> example.com
> exit
```

#### Troubleshooting Umum

```bash
# 1. DNS tidak resolve sama sekali
dig example.com
# Jika timeout → cek koneksi ke DNS server
# Jika SERVFAIL → cek authoritative server

# 2. DNS resolve lambat
dig example.com +stats
# Lihat "Query time" — jika > 100ms, ada masalah

# 3. DNS resolve salah IP
dig example.com +short
# Bandingkan dengan expected IP
# Cek apakah ada DNS poisoning atau misconfiguration

# 4. Cek DNS propagation
dig @8.8.8.8 example.com +short
dig @1.1.1.1 example.com +short
dig @208.67.222.222 example.com +short
# Bandingkan hasil dari berbagai resolver

# 5. Cek DNSSEC validation
dig example.com +dnssec +multi
# Lihat flag "ad" (authenticated data) di header

# 6. Trace full path
dig example.com +trace
# Lihat setiap step dari root sampai authoritative
```

---

### Real-World: CloudFlare DNS (1.1.1.1)

CloudFlare DNS (1.1.1.1) adalah public DNS resolver gratis yang diluncurkan pada 1 April 2018. Ini adalah salah satu DNS resolver tercepat dan paling privat di dunia.

```
┌──────────────────────────────────────────────────────────────┐
│              CLOUDFLARE DNS ARCHITECTURE                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1.1.1.1 ── Primary DNS resolver                             │
│  1.0.0.1 ── Secondary DNS resolver                           │
│  2606:4700:4700::1111 ── IPv6 primary                        │
│  2606:4700:4700::1001 ── IPv6 secondary                      │
│                                                               │
│  Infrastruktur:                                               │
│  - 300+ lokasi di seluruh dunia (anycast)                     │
│  - Response time: ~5-10ms global average                      │
│  - Privacy: Tidak log IP address, tidak jual data             │
│  - Audit: Diaudit secara independen oleh KPMG                 │
│                                                               │
│  Fitur tambahan:                                               │
│  - 1.1.1.2 / 1.1.1.3 — Malware blocking                       │
│  - 1.1.1.1.1 — DoH endpoint                                   │
│  - CloudFlare for Families — Content filtering                │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Kenapa CloudFlare DNS cepat?**

1. **Anycast network**: 300+ lokasi global, query selalu diarahkan ke instance terdekat
2. **Optimized software**: Custom DNS resolver software (bukan BIND/PowerDNS)
3. **Large cache**: Karena banyak user, cache hit rate sangat tinggi
4. **No logging overhead**: Tidak perlu menyimpan log query → lebih cepat
5. **Hardware**: Server dedicated dengan SSD dan memory besar

**Cara pakai CloudFlare DNS:**
```bash
# Di Windows — Settings → Network → DNS → Manual
Primary:   1.1.1.1
Secondary: 1.0.0.1

# Di Linux — /etc/resolv.conf
nameserver 1.1.1.1
nameserver 1.0.0.1

# DoH di browser (Firefox):
# Settings → Network Settings → Enable DNS over HTTPS → Cloudflare

# Test kecepatan:
# https://1.1.1.1/help
```

---

## 🎯 CONTOH NYATA

### Contoh 1: DNS Setup Website Sekolah

**Konteks:** SD Negeri Pasirhalang ingin setup DNS untuk website dan email.

**DNS Records yang dibutuhkan:**
```
; === ZONE: sdnpasirhalang.sch.id ===

; SOA Record (wajib)
sdnpasirhalang.sch.id.  3600  IN  SOA  ns1.hosting.com. admin.sdnpasirhalang.sch.id. (
    2024010101  ; Serial
    3600        ; Refresh
    900         ; Retry
    604800      ; Expire
    86400       ; Minimum TTL
)

; NS Records
sdnpasirhalang.sch.id.  86400  IN  NS  ns1.hosting.com.
sdnpasirhalang.sch.id.  86400  IN  NS  ns2.hosting.com.

; A Records
sdnpasirhalang.sch.id.    3600  IN  A  103.28.148.25
www.sdnpasirhalang.sch.id. 3600 IN  A  103.28.148.25
portal.sdnpasirhalang.sch.id. 300 IN  A  103.28.148.26
absensi.sdnpasirhalang.sch.id. 300 IN  A  103.28.148.27

; CNAME Records
mail.sdnpasirhalang.sch.id.  3600  IN  CNAME  mail.hosting.com.

; MX Records
sdnpasirhalang.sch.id.  3600  IN  MX  10  mail.hosting.com.
sdnpasirhalang.sch.id.  3600  IN  MX  20  mail2.hosting.com.

; TXT Records (SPF untuk email)
sdnpasirhalang.sch.id.  3600  IN  TXT  "v=spf1 include:spf.hosting.com ~all"

; TXT Records (DMARC)
_dmarc.sdnpasirhalang.sch.id.  3600  IN  TXT  "v=DMARC1; p=none; rua=mailto:admin@sdnpasirhalang.sch.id"
```

### Contoh 2: DNS untuk Microservices Architecture

```
; === ZONE: api.perusahaan.com ===

; API Gateway
api.perusahaan.com.       300  IN  A  10.0.1.100
api.perusahaan.com.       300  IN  A  10.0.1.101

; Service discovery
auth.api.perusahaan.com.  300  IN  A  10.0.2.10
user.api.perusahaan.com.  300  IN  A  10.0.2.20
payment.api.perusahaan.com. 300 IN  A  10.0.2.30
order.api.perusahaan.com.  300  IN  A  10.0.2.40

; Internal services (private DNS)
db.internal.perusahaan.com.   300  IN  A  10.0.10.1
redis.internal.perusahaan.com. 300 IN  A  10.0.10.2
kafka.internal.perusahaan.com. 300 IN  A  10.0.10.3

; SRV records untuk service discovery
_http._tcp.auth.api.perusahaan.com.  300  IN  SRV  10  100  8080  auth-1.internal.perusahaan.com.
_http._tcp.auth.api.perusahaan.com.  300  IN  SRV  10  100  8080  auth-2.internal.perusahaan.com.
```

### Contoh 3: DNS Migration Strategy

Saat migrasi dari server lama ke baru, gunakan strategi TTL lowering:

```
; === MINGGU SEBELUM MIGRASI ===
; Turunkan TTL menjadi 60 detik
example.com.  60  IN  A  10.0.1.1  ; Server lama

; === HARI MIGRASI ===
; Update IP ke server baru (propagasi cepat karena TTL rendah)
example.com.  60  IN  A  10.0.2.1  ; Server baru

; === 1 MINGGU SETELAH MIGRASI ===
; Naikkan TTL kembali setelah stabil
example.com.  3600  IN  A  10.0.2.1  ; Server baru
```

---

## 💡 PRAKTIK

### Latihan 1: Trace DNS Resolution

Buka terminal/command prompt, jalankan perintah berikut dan analisis hasilnya:

```bash
# 1. Query A record
dig google.com

# 2. Trace full resolution path
dig google.com +trace

# 3. Query ke resolver spesifik
dig @1.1.1.1 google.com
dig @8.8.8.8 google.com

# 4. Query semua record types
dig google.com ANY

# 5. Reverse DNS lookup
dig -x 142.250.177.78

# 6. Cek DNSSEC
dig google.com +dnssec
```

**Pertanyaan analisis:**
- Berapa IP address yang didapat untuk `google.com`?
- Berapa TTL-nya?
- Berapa query time?
- Ada berapa nameserver untuk `google.com`?
- Apakah DNSSEC valid?

### Latihan 2: Desain DNS untuk SD Negeri Pasirhalang

Desain DNS lengkap untuk SD Negeri Pasirhalang dengan kebutuhan:

- **Website utama**: `sdnpasirhalang.sch.id` (hosting di 103.28.148.25)
- **WWW alias**: `www.sdnpasirhalang.sch.id`
- **Email**: `info@sdnpasirhalang.sch.id` (menggunakan Google Workspace)
- **Portal orang tua**: `portal.sdnpasirhalang.sch.id` (103.28.148.26)
- **Absensi online**: `absensi.sdnpasirhalang.sch.id` (103.28.148.27)
- **E-learning**: `elearning.sdnpasirhalang.sch.id` (CNAME ke moodle.hosting.com)
- **SPF record**: Hanya Google Workspace yang boleh kirim email
- **DMARC policy**: none (monitoring dulu)

Tuliskan semua DNS records yang dibutuhkan dalam format zone file.

### Latihan 3: DNS Troubleshooting Scenario

**Scenario:** Website `sdnpasirhalang.sch.id` tidak bisa diakses. User mendapat error "DNS_PROBE_FINISHED_NXDOMAIN".

**Langkah troubleshooting:**
```bash
# 1. Cek apakah domain resolve
dig sdnpasirhalang.sch.id

# 2. Cek ke berbagai resolver
dig @8.8.8.8 sdnpasirhalang.sch.id
dig @1.1.1.1 sdnpasirhalang.sch.id

# 3. Trace resolution path
dig sdnpasirhalang.sch.id +trace

# 4. Cek nameserver
dig sdnpasirhalang.sch.id NS

# 5. Cek apakah nameserver responsif
dig @ns1.hosting.com sdnpasirhalang.sch.id

# 6. Cek DNS propagation
# Gunakan: https://dnschecker.org/
```

Apa kemungkinan penyebabnya? Bagaimana solusinya?

### Latihan 4: Hitung DNS Query Load

Sebuah website memiliki **100.000 user per hari**. Setiap user melakukan rata-rata **20 page views**. Setiap page view membutuhkan **5 DNS lookups** (domain utama, CDN, API, analytics, fonts).

**Pertanyaan:**
1. Berapa total DNS queries per hari?
2. Berapa DNS queries per detik (rata-rata)?
3. Jika TTL = 300 detik dan cache hit rate = 90%, berapa query yang benar-benar sampai ke authoritative server?
4. Jika authoritative server bisa handle 10.000 queries/detik, apakah cukup?

**Jawaban:**
1. 100.000 × 20 × 5 = **10.000.000 queries/hari**
2. 10.000.000 / 86.400 = **~116 queries/detik**
3. Cache hit 90% → 10% query ke authoritative = **1.000.000 queries/hari** = ~12 queries/detik
4. 12 queries/detik << 10.000 queries/detik → **sangat cukup**

---

## ✅ CHECKLIST

- [ ] Bisa menjelaskan apa itu DNS dan fungsinya dalam sistem terdistribusi
- [ ] Paham DNS hierarchy: root → TLD → authoritative → recursive resolver
- [ ] Mengerti cara kerja DNS resolution step by step (iterative query)
- [ ] Bisa menjelaskan 9 jenis DNS record (A, AAAA, CNAME, MX, TXT, NS, SOA, SRV, PTR)
- [ ] Paham konsep TTL dan trade-off antara TTL tinggi vs rendah
- [ ] Mengerti negative caching dan multi-layer DNS caching
- [ ] Bisa menjelaskan DNS load balancing (round robin, weighted, geo, latency, failover)
- [ ] Paham DNS security (DNSSEC, DoH, DoT) dan perbedaannya
- [ ] Bisa menggunakan dig dan nslookup untuk troubleshooting
- [ ] Mengerti arsitektur CloudFlare DNS dan kenapa cepat
- [ ] Bisa mendesain DNS record untuk aplikasi sederhana
- [ ] Paham strategi DNS migration (TTL lowering)

---

## 🔗 REFERENSI

- **Repo Asli:** [donnemartin/system-design-primer — DNS](https://github.com/donnemartin/system-design-primer#domain-name-system)
- **RFC 1034:** [Domain Names - Concepts and Facilities](https://tools.ietf.org/html/rfc1034)
- **RFC 1035:** [Domain Names - Implementation and Specification](https://tools.ietf.org/html/rfc1035)
- **CloudFlare Learning Center:** [What is DNS?](https://www.cloudflare.com/learning/dns/what-is-dns/)
- **DNSimple:** [DNS Articles](https://support.dnsimple.com/categories/dns/)
- **Microsoft:** [DNS Architecture](https://technet.microsoft.com/en-us/library/dd197427(v=ws.10).aspx)
- **RFC 4033:** [DNS Security Introduction (DNSSEC)](https://tools.ietf.org/html/rfc4033)
- **RFC 8484:** [DNS over HTTPS (DoH)](https://tools.ietf.org/html/rfc8484)
- **RFC 7858:** [DNS over TLS (DoT)](https://tools.ietf.org/html/rfc7858)

---

> **Lanjut ke:** [`08-cdn.md`](./08-cdn.md)
