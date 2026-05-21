# 10 — Reverse Proxy

> **Estimasi:** 2 jam | **Level:** Pemula-Menengah

---

## 📖 TEORI

### Apa itu Reverse Proxy?

**Reverse proxy** adalah server yang berdiri di depan (di antara client dan backend server). Semua request dari client terlebih dahulu sampai ke reverse proxy, baru kemudian reverse proxy meneruskannya ke backend server yang sesuai. Client tidak pernah berkomunikasi langsung dengan backend — mereka "berpikir" sedang berbicara dengan satu server, padahal di belakangnya bisa ada puluhan server.

```
Tanpa Reverse Proxy:
[Client] ──────────────────────────────────→ [Backend Server]
         Client tahu IP backend langsung
         Backend terekspos ke internet

Dengan Reverse Proxy:
[Client] ──────→ [Reverse Proxy] ──────→ [Backend Server 1]
                                  ──────→ [Backend Server 2]
                                  ──────→ [Backend Server 3]
         Client hanya tahu IP reverse proxy
         Backend tersembunyi di balik proxy
```

Dalam konteks sistem desain (donnemartin/system-design-primer), reverse proxy dikategorikan sebagai **web server** yang menangani banyak tanggung jawab sekaligus: load balancing, SSL termination, caching, compression, dan security. Ini adalah komponen krusial dalam arsitektur web modern.

---

### Reverse Proxy vs Forward Proxy — Perbandingan Mendalam

Kedua jenis proxy ini berfungsi sebagai perantara, tapi **arah dan tujuannya** berbeda total.

#### Forward Proxy

Forward proxy berdiri **di depan client**. Ia melindungi identitas client dari server tujuan.

```
[Client A] ──→ [Forward Proxy] ──→ [Server X di Internet]
[Client B] ──→ [Forward Proxy] ──→ [Server Y di Internet]
[Client C] ──→ [Forward Proxy] ──→ [Server Z di Internet]
```

**Karakteristik Forward Proxy:**
- Dipasang oleh admin jaringan atau oleh client sendiri
- Server tujuan **tidak tahu** siapa client asli — yang terlihat hanya IP forward proxy
- Client **sadar** mereka menggunakan proxy (harus dikonfigurasi di browser/OS)
- Biasanya digunakan untuk:
  - Memblokir akses ke situs tertentu (proxy kantor/sekolah)
  - Membypass geo-restriction (VPN, proxy luar negeri)
  - Menyembunyikan identitas client dari server tujuan
  - Monitoring dan logging aktivitas browsing karyawan
  - Caching konten untuk menghemat bandwidth organisasi

**Contoh Forward Proxy:**
- Squid Proxy
- VPN (Virtual Private Network)
- Proxy yang dikonfigurasi di browser kantor
- Tor network

**Contoh Skenario Forward Proxy:**
```
Siswa SD Pasirhalang → Proxy Sekolah → Google.com
                          ↓
                  Google hanya melihat IP proxy sekolah
                  Admin sekolah bisa log semua browsing
                  Situs tertentu (game) diblokir
```

#### Reverse Proxy

Reverse proxy berdiri **di depan server**. Ia melindungi identitas server dari client.

```
[User di Jakarta] ──→ [Reverse Proxy] ──→ [Web Server 1]
[User di Bandung] ──→ [Reverse Proxy] ──→ [Web Server 2]
[User di Surabaya] ──→ [Reverse Proxy] ──→ [Web Server 3]
```

**Karakteristik Reverse Proxy:**
- Dipasang oleh admin server (bukan client)
- Client **tidak sadar** ada proxy — mereka pikir langsung berkomunikasi dengan server
- Server backend **tersembunyi** — client hanya melihat IP reverse proxy
- Biasanya digunakan untuk:
  - Load balancing ke banyak backend server
  - SSL/TLS termination
  - Caching konten statis
  - Kompresi response
  - Security (WAF, rate limiting, IP filtering)
  - A/B testing dan canary deployment

**Contoh Reverse Proxy:**
- Nginx
- HAProxy
- Apache HTTP Server (mod_proxy)
- CloudFlare
- AWS Application Load Balancer (ALB)
- Traefik
- Caddy

**Contoh Skenario Reverse Proxy:**
```
User → CloudFlare (Reverse Proxy) → Server SD Pasirhalang
              ↓
      User hanya lihat IP CloudFlare
      Server asli IP-nya tersembunyi
      DDoS di-filter oleh CloudFlare
      SSL di-handle di CloudFlare
```

#### Tabel Perbandingan Lengkap

| Aspek | Forward Proxy | Reverse Proxy |
|---|---|---|
| **Posisi** | Di depan client | Di depan server |
| **Yang dilindungi** | Identitas client | Identitas server |
| **Kesadaran client** | Client tahu pakai proxy | Client tidak tahu ada proxy |
| **Konfigurasi** | Di sisi client (browser/OS) | Di sisi server (transparent) |
| **Jumlah server** | Satu proxy → banyak server tujuan | Satu proxy → banyak backend server |
| **Use case utama** | Anonimitas, bypass, filtering | Load balancing, security, caching |
| **Siapa yang pasang** | Admin jaringan / user | Admin server / web developer |
| **Contoh** | Squid, VPN, Tor | Nginx, HAProxy, CloudFlare |
| **Layer OSI** | Umumnya Layer 7 (HTTP) | Umumnya Layer 7 (HTTP), bisa Layer 4 |
| **Traffic direction** | Outbound (dari dalam ke luar) | Inbound (dari luar ke dalam) |

```
┌─────────────────────────────────────────────────────────────┐
│                    PERBANDINGAN VISUAL                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  FORWARD PROXY:                                              │
│  [Internal Clients] → [Forward Proxy] → [Internet Servers]  │
│   (melindungi client)                    (server tidak tahu) │
│                                                              │
│  REVERSE PROXY:                                              │
│  [Internet Clients] → [Reverse Proxy] → [Backend Servers]   │
│   (client tidak tahu)                   (melindungi server)  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### Fungsi-Fungsi Reverse Proxy (Detail)

Reverse proxy bukan sekadar "penerus request". Ia memiliki banyak fungsi yang menjadikannya komponen vital dalam arsitektur web modern.

#### 1. Load Balancing — Distribusi Traffic

Load balancing adalah fungsi paling umum dari reverse proxy. Ketika Anda memiliki banyak backend server, reverse proxy mendistribusikan incoming request ke server-server tersebut agar tidak ada satu server yang kelebihan beban.

**Algoritma Load Balancing:**

```
┌─────────────────────────────────────────────────────────────┐
│                    LOAD BALANCING ALGORITMA                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. ROUND ROBIN                                              │
│     Request 1 → Server A                                     │
│     Request 2 → Server B                                     │
│     Request 3 → Server C                                     │
│     Request 4 → Server A (kembali ke awal)                   │
│     ✅ Sederhana, fair, tapi tidak perhatikan kapasitas      │
│                                                              │
│  2. LEAST CONNECTIONS                                        │
│     Server A: 50 koneksi aktif                               │
│     Server B: 10 koneksi aktif  ← dipilih!                   │
│     Server C: 30 koneksi aktif                               │
│     ✅ Cerdas, tapi butuh tracking koneksi                   │
│                                                              │
│  3. IP HASH                                                  │
│     Client IP 192.168.1.100 → selalu ke Server A             │
│     Client IP 192.168.1.101 → selalu ke Server B             │
│     ✅ Sticky session, tapi tidak merata jika IP tidak sebar │
│                                                              │
│  4. WEIGHTED ROUND ROBIN                                     │
│     Server A (kuat): bobot 5 → dapat 5 request               │
│     Server B (lemah): bobot 2 → dapat 2 request              │
│     Server C (sedang): bobot 3 → dapat 3 request             │
│     ✅ Fleksibel untuk server dengan kapasitas berbeda       │
│                                                              │
│  5. LEAST RESPONSE TIME                                      │
│     Server A: avg 200ms  ← dipilih!                          │
│     Server B: avg 500ms                                      │
│     Server C: avg 350ms                                      │
│     ✅ Performa optimal, tapi overhead monitoring            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Ilustrasi Load Balancing:**

```
                    ┌──────────────┐
                    │   CLIENTS    │
                    │  (ribuan)    │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  REVERSE     │
                    │   PROXY      │
                    │  (Nginx)     │
                    └──┬───┬───┬──┘
                       │   │   │
              ┌────────┘   │   └────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Backend  │ │ Backend  │ │ Backend  │
        │ Server 1 │ │ Server 2 │ │ Server 3 │
        │ :8080    │ │ :8080    │ │ :8080    │
        └──────────┘ └──────────┘ └──────────┘
```

#### 2. SSL/TLS Termination

SSL termination adalah proses di mana reverse proxy menangani enkripsi dan dekripsi HTTPS, sehingga backend server tidak perlu melakukan hal tersebut. Ini menghemat resource CPU di backend.

```
┌─────────────────────────────────────────────────────────────┐
│                    SSL TERMINATION                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Client]                                                   │
│     │                                                       │
│     │  ←─── HTTPS (terenkripsi) ───→                        │
│     │      Certificate: *.sekolah.sch.id                    │
│     │      Cipher: TLS 1.3, AES-256-GCM                     │
│     │                                                       │
│     ▼                                                       │
│  ┌──────────────────────┐                                   │
│  │   REVERSE PROXY      │                                   │
│  │   SSL Termination    │ ←── Di sini SSL di-decrypt        │
│  │   (Nginx/HAProxy)    │      CPU intensive                │
│  └──────────┬───────────┘                                   │
│             │                                               │
│             │  ←─── HTTP (plain text) ───→                  │
│             │      Internal network, aman                    │
│             │      Tidak perlu SSL lagi                     │
│             ▼                                               │
│  ┌──────────────────────┐                                   │
│  │   BACKEND SERVER     │                                   │
│  │   (Node.js/PHP)      │ ←── Tidak perlu handle SSL        │
│  │   Port 8080 (HTTP)   │      Hemat CPU & memory           │
│  └──────────────────────┘                                   │
│                                                              │
│  KEUNTUNGAN:                                                 │
│  - Backend server tidak perlu sertifikat SSL                │
│  - Hemat CPU di backend (SSL handshake mahal)               │
│  - Satu tempat manage sertifikat                            │
│  - Mudah rotate/update sertifikat                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Mengapa SSL Termination Penting?**

SSL/TLS handshake membutuhkan komputasi yang signifikan:
- Asymmetric encryption (RSA/ECDHE) untuk key exchange
- Certificate validation chain
- Session negotiation

Dengan SSL termination di reverse proxy:
- Backend server fokus pada business logic
- Reverse proxy (Nginx) dioptimalkan untuk SSL
- Bisa menggunakan hardware SSL accelerator

#### 3. Caching — Menyimpan Response untuk Request Berikutnya

Reverse proxy bisa menyimpan (cache) response dari backend server. Ketika ada request yang sama, reverse proxy langsung memberikan response dari cache tanpa perlu menghubungi backend.

```
┌─────────────────────────────────────────────────────────────┐
│                    REVERSE PROXY CACHING                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Request Pertama:                                            │
│  [Client] → [Reverse Proxy] → [Backend] → Response           │
│                                ↓                             │
│                     Cache response di proxy                  │
│                     (misal: halaman home, 5 menit)           │
│                                                              │
│  Request Kedua (5 menit berikutnya):                         │
│  [Client] → [Reverse Proxy] → ✅ Cache HIT!                  │
│                     Langsung response dari cache             │
│                     Backend tidak dipanggil                  │
│                     Response lebih cepat (ms vs detik)       │
│                                                              │
│  Cache Headers yang Dipertimbangkan:                         │
│  - Cache-Control: max-age=300 (cache 5 menit)               │
│  - ETag: "abc123" (validasi cache)                          │
│  - Last-Modified: Wed, 21 May 2026 10:00:00 GMT             │
│  - Expires: Wed, 21 May 2026 10:05:00 GMT                   │
│                                                              │
│  Apa yang Biasa Di-cache:                                    │
│  ✅ Halaman statis (home, about, contact)                    │
│  ✅ Gambar, CSS, JavaScript                                  │
│  ✅ API response yang jarang berubah                         │
│  ❌ Halaman dinamis (dashboard, profile)                     │
│  ❌ API yang butuh data real-time                            │
│  ❌ Response dengan Set-Cookie header                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Cache Hit Ratio — Metrik Penting:**

```
Cache Hit Ratio = (Cache Hits) / (Cache Hits + Cache Misses)

Contoh:
- 1000 request masuk
- 850 dilayani dari cache (hit)
- 150 harus ke backend (miss)
- Hit ratio = 850/1000 = 85%

Artinya: 85% request tidak membebani backend!
```

#### 4. Compression — Kompresi Response

Reverse proxy bisa mengompres response sebelum dikirim ke client, menghemat bandwidth dan mempercepat loading time.

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPRESSION                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Tanpa Compression:                                          │
│  Backend → HTML 500KB → Client (download 500KB)             │
│                                                              │
│  Dengan Compression (gzip):                                  │
│  Backend → HTML 500KB → Nginx gzip → 100KB → Client         │
│  Hemat 80% bandwidth!                                       │
│                                                              │
│  Dengan Compression (brotli):                                │
│  Backend → HTML 500KB → Nginx brotli → 75KB → Client        │
│  Hemat 85% bandwidth! (lebih baik dari gzip)                 │
│                                                              │
│  Perbandingan Algoritma Compression:                         │
│  ┌──────────┬────────────┬────────────┬─────────────┐       │
│  │ Algoritma│ Rasio      │ Kecepatan  │ Browser     │       │
│  │          │ Kompresi   │ Kompresi   │ Support     │       │
│  ├──────────┼────────────┼────────────┼─────────────┤       │
│  │ gzip     │ ~70-80%    │ Cepat      │ Semua       │       │
│  │ brotli   │ ~80-90%    │ Sedang     │ Modern      │       │
│  │ zstd     │ ~85-92%    │ Sangat cepat│ Terbatas   │       │
│  └──────────┴────────────┴────────────┴─────────────┘       │
│                                                              │
│  Apa yang Dikompresi:                                        │
│  ✅ text/html, text/css, text/javascript                     │
│  ✅ application/json, application/javascript                 │
│  ✅ font/woff2                                               │
│  ❌ gambar (sudah terkompresi: jpg, png, webp)               │
│  ❌ video (sudah terkompresi: mp4, webm)                     │
│  ❌ file kecil (< 256 bytes, overhead > manfaat)             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 5. Request Filtering dan Security

Reverse proxy bertindak sebagai **garis pertahanan pertama** terhadap ancaman dari luar.

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYER                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Internet]                                                  │
│     │                                                        │
│     ▼                                                        │
│  ┌──────────────────────┐                                    │
│  │   REVERSE PROXY      │                                    │
│  │                      │                                    │
│  │  1. IP Filtering     │ ← Blokir IP berbahaya              │
│  │     - Blacklist IP   │                                    │
│  │     - Whitelist IP   │                                    │
│  │     - Geo-blocking   │                                    │
│  │                      │                                    │
│  │  2. Rate Limiting    │ ← Batasi request per IP            │
│  │     - 10 req/detik   │                                    │
│  │     - 100 req/menit  │                                    │
│  │                      │                                    │
│  │  3. Request Filtering│ ← Blokir pattern berbahaya          │
│  │     - SQL injection  │                                    │
│  │     - XSS payload    │                                    │
│  │     - Path traversal │                                    │
│  │                      │                                    │
│  │  4. Header Filtering │ ← Manipulasi header                │
│  │     - Hapus Server:  │                                    │
│  │     - Hapus X-Powered│                                    │
│  │     - Add Security   │                                    │
│  │                      │                                    │
│  │  5. WAF Integration  │ ← Web Application Firewall         │
│  │     - ModSecurity    │                                    │
│  │     - OWASP rules    │                                    │
│  │     - Custom rules   │                                    │
│  │                      │                                    │
│  │  6. DDoS Protection  │ ← Mitigasi serangan                │
│  │     - SYN flood      │                                    │
│  │     - HTTP flood     │                                    │
│  │     - Slowloris      │                                    │
│  └──────────┬───────────┘                                    │
│             │ (hanya request bersih yang lolos)              │
│             ▼                                                │
│  ┌──────────────────────┐                                    │
│  │   BACKEND SERVER     │                                    │
│  │   (terlindungi)      │                                    │
│  └──────────────────────┘                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 6. Serving Static Files

Reverse proxy bisa melayani file statis (gambar, CSS, JavaScript, font) langsung tanpa meneruskan ke backend. Ini jauh lebih efisien karena backend server (Node.js, PHP, Python) tidak perlu memproses request untuk file statis.

```
┌─────────────────────────────────────────────────────────────┐
│                    STATIC FILE SERVING                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Tanpa Reverse Proxy:                                        │
│  Client → Node.js → baca file dari disk → kirim ke client   │
│  (Node.js harus handle I/O,占用 thread)                     │
│                                                              │
│  Dengan Reverse Proxy (Nginx):                               │
│  Client → Nginx → serve static langsung                     │
│  (Nginx menggunakan sendfile, zero-copy, sangat cepat)       │
│                                                              │
│  Request Flow:                                               │
│  GET /images/logo.png → Nginx serve dari /var/www/static/   │
│  GET /css/style.css   → Nginx serve dari /var/www/static/   │
│  GET /js/app.js       → Nginx serve dari /var/www/static/   │
│  GET /api/users       → Nginx proxy ke backend :8080        │
│                                                              │
│  Optimasi Static Files:                                      │
│  - sendfile on (zero-copy, tanpa copy ke user space)         │
│  - tcp_nopush on (kirim dalam satu paket)                    │
│  - tcp_nodelay on (langsung kirim, tidak delay)              │
│  - open_file_cache (cache file descriptor)                   │
│  - expires header (browser cache)                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### Reverse Proxy vs Load Balancer — Perbedaan dan Hubungan

Banyak yang bingung antara reverse proxy dan load balancer. Faktanya, keduanya **bukan** hal yang sama, tapi sering tumpang tindih.

```
┌─────────────────────────────────────────────────────────────┐
│              REVERSE PROXY vs LOAD BALANCER                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  LOAD BALANCER:                                              │
│  - Fokus UTAMA: distribusi traffic                           │
│  - Bisa Layer 4 (TCP/UDP) atau Layer 7 (HTTP)                │
│  - Bisa hardware (F5 BIG-IP) atau software                   │
│  - Fungsi: routing, health check, failover                   │
│  - Contoh: AWS ELB, HAProxy (mode TCP), F5 BIG-IP           │
│                                                              │
│  REVERSE PROXY:                                              │
│  - Fokus UTAMA: abstraction + banyak fungsi                  │
│  - Umumnya Layer 7 (HTTP/HTTPS)                              │
│  - Selalu software                                           │
│  - Fungsi: LB + caching + compression + SSL + security       │
│  - Contoh: Nginx, HAProxy (mode HTTP), Caddy, Traefik       │
│                                                              │
│  HUBUNGAN:                                                   │
│  - Semua reverse proxy BISA jadi load balancer              │
│  - Tidak semua load balancer adalah reverse proxy            │
│  - Nginx = reverse proxy + load balancer                     │
│  - HAProxy = load balancer + reverse proxy                   │
│  - AWS ALB = load balancer (Layer 7)                         │
│  - AWS NLB = load balancer (Layer 4, bukan reverse proxy)    │
│                                                              │
│  DIAGRAM:                                                    │
│                                                              │
│  Load Balancer Only (Layer 4):                               │
│  [Client] → [NLB] → [Backend]  (hanya route TCP)            │
│                                                              │
│  Reverse Proxy (Layer 7):                                    │
│  [Client] → [Nginx] → [Backend]  (route + cache + SSL)      │
│                                                              │
│  Reverse Proxy + Load Balancer:                              │
│  [Client] → [ALB] → [Nginx] → [Backend]                     │
│                      ↓                                        │
│                 Nginx handle: cache, SSL, compression        │
│                 ALB handle: distribute ke banyak Nginx       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### Nginx sebagai Reverse Proxy — Konfigurasi Lengkap

Nginx (dibaca "engine-x") adalah reverse proxy paling populer di dunia. Digunakan oleh Netflix, Airbnb, GitHub, WordPress.com, dan jutaan website lainnya.

#### Instalasi Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install epel-release
sudo yum install nginx

# Windows (download dari nginx.org)
# Extract, jalankan nginx.exe
```

#### Konfigurasi Dasar Reverse Proxy

```nginx
# /etc/nginx/nginx.conf

worker_processes auto;
events {
    worker_connections 1024;
}

http {
    # Basic settings
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    sendfile      on;
    keepalive_timeout 65;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml application/xml+rss text/javascript;

    # Upstream (backend servers)
    upstream backend_servers {
        least_conn;
        server 127.0.0.1:8080 weight=3;
        server 127.0.0.1:8081 weight=2;
        server 127.0.0.1:8082 weight=1;
    }

    # Server block
    server {
        listen 80;
        server_name sekolah.sch.id www.sekolah.sch.id;

        # Redirect HTTP ke HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name sekolah.sch.id www.sekolah.sch.id;

        # SSL Certificate
        ssl_certificate     /etc/ssl/certs/sekolah.sch.id.crt;
        ssl_certificate_key /etc/ssl/private/sekolah.sch.id.key;
        ssl_protocols       TLSv1.2 TLSv1.3;
        ssl_ciphers         HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # Hapus header yang info server
        server_tokens off;
        proxy_hide_header X-Powered-By;
        proxy_hide_header Server;

        # Static files - serve langsung
        location /static/ {
            alias /var/www/sekolah/static/;
            expires 30d;
            add_header Cache-Control "public, immutable";
            access_log off;
        }

        # Images - cache lebih lama
        location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
            root /var/www/sekolah/public;
            expires 90d;
            add_header Cache-Control "public, no-transform";
            access_log off;
        }

        # API - proxy ke backend
        location /api/ {
            proxy_pass http://backend_servers;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # Timeout settings
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 60s;

            # Buffering
            proxy_buffering on;
            proxy_buffer_size 4k;
            proxy_buffers 8 4k;
        }

        # WebSocket support
        location /ws/ {
            proxy_pass http://backend_servers;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_read_timeout 86400s;
        }

        # Default - proxy ke backend
        location / {
            proxy_pass http://backend_servers;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "OK\n";
            add_header Content-Type text/plain;
        }
    }
}
```

#### Konfigurasi Rate Limiting

```nginx
http {
    # Zone rate limiting
    # 10MB shared memory, 10 request per detik per IP
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login_limit:10m rate=3r/m;

    # Connection limiting
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

    server {
        # API rate limiting
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            limit_req_status 429;
            proxy_pass http://backend_servers;
        }

        # Login page - lebih ketat
        location /login {
            limit_req zone=login_limit burst=5 nodelay;
            limit_req_status 429;
            proxy_pass http://backend_servers;
        }

        # Connection limit per IP
        limit_conn conn_limit 100;
    }
}
```

#### Konfigurasi Caching di Nginx

```nginx
http {
    # Cache zone definition
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m
                     max_size=1g inactive=60m use_temp_path=off;

    server {
        # Cache untuk halaman tertentu
        location /berita/ {
            proxy_cache my_cache;
            proxy_cache_valid 200 302 10m;
            proxy_cache_valid 404 1m;
            proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
            proxy_cache_lock on;
            proxy_cache_lock_timeout 5s;
            add_header X-Cache-Status $upstream_cache_status;
            proxy_pass http://backend_servers;
        }
    }
}
```

#### Konfigurasi Load Balancing dengan Health Check

```nginx
http {
    upstream backend_pool {
        least_conn;

        # Server utama
        server 10.0.1.10:8080 weight=3;
        server 10.0.1.11:8080 weight=2;

        # Backup server (hanya dipakai jika yang lain down)
        server 10.0.1.12:8080 backup;

        # Server down (manual maintenance)
        server 10.0.1.13:8080 down;

        # Health check passive (built-in)
        # max_fails: berapa kali gagal sebelum dianggap down
        # fail_timeout: berapa detik sebelum dicoba lagi
        server 10.0.1.14:8080 max_fails=3 fail_timeout=30s;
    }

    server {
        location / {
            proxy_pass http://backend_pool;
            proxy_next_upstream error timeout http_500 http_502 http_503;
            proxy_next_upstream_tries 2;
            proxy_next_upstream_timeout 10s;
        }
    }
}
```

---

### HAProxy sebagai Reverse Proxy

HAProxy (High Availability Proxy) adalah load balancer dan reverse proxy open-source yang sangat populer untuk high-traffic website. Digunakan oleh GitHub, Reddit, Stack Overflow, dan banyak lagi.

#### Instalasi HAProxy

```bash
# Ubuntu/Debian
sudo apt install haproxy

# CentOS/RHEL
sudo yum install haproxy
```

#### Konfigurasi HAProxy

```haproxy
# /etc/haproxy/haproxy.cfg

global
    log /dev/log local0
    log /dev/log local1 notice
    chroot /var/lib/haproxy
    stats socket /run/haproxy/admin.sock mode 660 level admin
    stats timeout 30s
    user haproxy
    group haproxy
    daemon

    # SSL settings
    ssl-default-bind-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256
    ssl-default-bind-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384
    ssl-default-bind-options ssl-min-ver TLSv1.2 no-tls-tickets

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    option  forwardfor
    option  http-server-close
    timeout connect 5000ms
    timeout client  50000ms
    timeout server  50000ms
    timeout http-request 10000ms
    timeout http-keep-alive 10000ms
    errorfile 400 /etc/haproxy/errors/400.http
    errorfile 403 /etc/haproxy/errors/403.http
    errorfile 408 /etc/haproxy/errors/408.http
    errorfile 500 /etc/haproxy/errors/500.http
    errorfile 502 /etc/haproxy/errors/502.http
    errorfile 503 /etc/haproxy/errors/503.http
    errorfile 504 /etc/haproxy/errors/504.http

# Stats page (monitoring)
frontend stats
    bind *:8404
    stats enable
    stats uri /stats
    stats refresh 10s
    stats admin if LOCALHOST

# HTTP frontend - redirect to HTTPS
frontend http_front
    bind *:80
    mode http
    redirect scheme https code 301

# HTTPS frontend
frontend https_front
    bind *:443 ssl crt /etc/haproxy/certs/sekolah.sch.id.pem
    mode http

    # Security headers
    http-response set-header Strict-Transport-Security "max-age=31536000"
    http-response set-header X-Frame-Options SAMEORIGIN
    http-response set-header X-Content-Type-Options nosniff

    # Rate limiting via stick tables
    stick-table type ip size 100k expire 30s store http_req_rate(10s)
    http-request track-sc0 src
    http-request deny deny_status 429 if { sc_http_req_rate(0) gt 100 }

    # ACL rules untuk routing
    acl is_api path_beg /api/
    acl is_static path_beg /static/
    acl is_websocket hdr(Upgrade) -i websocket

    # Routing berdasarkan ACL
    use_backend static_servers if is_static
    use_backend websocket_servers if is_websocket
    use_backend api_servers if is_api
    default_backend web_servers

# Backend untuk web servers
backend web_servers
    balance leastconn
    option httpchk GET /health
    http-check expect status 200
    cookie SERVERID insert indirect nocache

    server web1 10.0.1.10:8080 check cookie web1 weight 3
    server web2 10.0.1.11:8080 check cookie web2 weight 2
    server web3 10.0.1.12:8080 check cookie web3 backup

# Backend untuk API servers
backend api_servers
    balance roundrobin
    option httpchk GET /api/health
    http-check expect status 200

    server api1 10.0.1.20:3000 check weight 3
    server api2 10.0.1.21:3000 check weight 3
    server api3 10.0.1.22:3000 check weight 2

# Backend untuk static files
backend static_servers
    balance roundrobin
    server static1 10.0.1.30:80 check
    server static2 10.0.1.31:80 check

# Backend untuk WebSocket
backend websocket_servers
    balance source
    timeout tunnel 3600000ms
    server ws1 10.0.1.40:8080 check
    server ws2 10.0.1.41:8080 check
```

#### Perbandingan Nginx vs HAProxy

| Aspek | Nginx | HAProxy |
|---|---|---|
| **Fokus Utama** | Web server + reverse proxy | Load balancer + reverse proxy |
| **Static Files** | Sangat baik (built-in) | Tidak disarankan |
| **Load Balancing** | Baik | Sangat baik (lebih banyak algoritma) |
| **SSL Termination** | Baik | Baik |
| **Monitoring** | Basic (stub_status) | Advanced (stats page) |
| **Layer 4 LB** | Tidak (hanya stream module) | Ya (native) |
| **Layer 7 LB** | Ya | Ya (lebih advanced) |
| **Konfigurasi** | Mudah dipahami | Lebih kompleks |
| **Performance** | Sangat baik | Sedikit lebih baik untuk pure LB |
| **Caching** | Ya (proxy_cache) | Tidak (butuh Varnish) |
| **Cocok untuk** | All-in-one solution | Dedicated load balancing |

---

### Reverse Proxy Security — Mendalam

#### 1. Menyembunyikan Backend Server

Salah satu fungsi utama reverse proxy adalah menyembunyikan arsitektur backend dari dunia luar.

```
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND HIDING                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Tanpa Reverse Proxy:                                        │
│  - Client bisa lihat IP asli server                          │
│  - Client bisa lihat teknologi (Server: Apache/2.4.x)        │
│  - Client bisa langsung attack server                        │
│  - Port backend terekspos                                    │
│                                                              │
│  Dengan Reverse Proxy:                                       │
│  - Client hanya lihat IP reverse proxy                       │
│  - Server header disembunyikan/diganti                       │
│  - Backend tidak accessible dari internet                    │
│  - Hanya reverse proxy yang bisa akses backend               │
│                                                              │
│  Konfigurasi Nginx untuk menyembunyikan backend:             │
│                                                              │
│  server {                                                    │
│      # Sembunyikan versi Nginx                               │
│      server_tokens off;                                      │
│                                                              │
│      # Hapus header yang mengungkap teknologi                │
│      proxy_hide_header X-Powered-By;                         │
│      proxy_hide_header Server;                               │
│      proxy_hide_header X-AspNet-Version;                     │
│                                                              │
│      # Ganti Server header                                   │
│      more_set_headers "Server: ";                            │
│                                                              │
│      # Backend di private network                            │
│      # Client tidak bisa akses 10.0.1.x langsung             │
│      location / {                                            │
│          proxy_pass http://10.0.1.10:8080;                   │
│      }                                                       │
│  }                                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 2. WAF (Web Application Firewall) Integration

WAF adalah lapisan keamanan tambahan yang memfilter request berdasarkan rule set.

```
┌─────────────────────────────────────────────────────────────┐
│                    WAF INTEGRATION                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Internet] → [Reverse Proxy + WAF] → [Backend]             │
│                                                              │
│  WAF Rules (ModSecurity + OWASP CRS):                        │
│                                                              │
│  1. SQL Injection Protection:                                │
│     - Blokir: ' OR 1=1 --                                    │
│     - Blokir: UNION SELECT                                   │
│     - Blokir: ; DROP TABLE                                   │
│                                                              │
│  2. XSS Protection:                                          │
│     - Blokir: <script>alert('xss')</script>                  │
│     - Blokir: javascript:alert(1)                            │
│     - Blokir: onerror=alert(1)                               │
│                                                              │
│  3. Path Traversal:                                          │
│     - Blokir: ../../etc/passwd                               │
│     - Blokir: ..\..\windows\system32                         │
│                                                              │
│  4. File Upload:                                             │
│     - Blokir: .php, .exe, .sh di upload                      │
│     - Hanya izinkan: .jpg, .png, .pdf                        │
│                                                              │
│  5. Rate Limiting:                                           │
│     - Max 100 request/menit per IP                           │
│     - Max 5 login/menit per IP                               │
│                                                              │
│  Contoh ModSecurity di Nginx:                                │
│                                                              │
│  server {                                                    │
│      modsecurity on;                                         │
│      modsecurity_rules_file /etc/nginx/modsec/main.conf;     │
│                                                              │
│      location / {                                            │
│          proxy_pass http://backend;                          │
│      }                                                       │
│  }                                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 3. IP Whitelisting dan Blacklisting

```nginx
# IP Whitelisting - hanya IP tertentu yang boleh akses
server {
    # Admin panel - hanya IP kantor
    location /admin/ {
        allow 103.123.45.0/24;    # IP kantor
        allow 192.168.1.0/24;     # Local network
        deny all;                  # Blokir yang lain

        proxy_pass http://backend;
    }

    # API - hanya IP partner
    location /api/partner/ {
        allow 203.0.113.50;       # IP partner
        deny all;

        proxy_pass http://backend;
    }
}

# IP Blacklisting - blokir IP berbahaya
geo $blocked_ip {
    default         0;
    198.51.100.0/24 1;   # Blokir range ini
    203.0.113.100   1;   # Blokir IP spesifik
}

server {
    if ($blocked_ip) {
        return 403;
    }

    location / {
        proxy_pass http://backend;
    }
}
```

---

### Reverse Proxy Performance — Optimasi

#### 1. Connection Keep-Alive

Keep-alive memungkinkan satu koneksi TCP digunakan untuk multiple HTTP request, mengurangi overhead koneksi baru.

```nginx
http {
    # Keep-alive ke client
    keepalive_timeout 65s;
    keepalive_requests 100;

    # Keep-alive ke upstream (backend)
    upstream backend {
        server 10.0.1.10:8080;
        keepalive 32;  # Max 32 idle connections ke backend
    }

    server {
        location / {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Connection "";  # Enable keep-alive ke backend
        }
    }
}
```

#### 2. HTTP/2 Support

HTTP/2 memberikan performa lebih baik melalui multiplexing, header compression, dan server push.

```nginx
server {
    listen 443 ssl http2;  # Enable HTTP/2

    # HTTP/2 specific settings
    http2_max_concurrent_streams 128;
    http2_max_requests 1000;

    # Server push (opsional)
    location / {
        proxy_pass http://backend;
        http2_push /css/style.css;
        http2_push /js/app.js;
    }
}
```

#### 3. Gzip dan Brotli Compression

```nginx
http {
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/json
        application/javascript
        application/xml
        application/xml+rss
        image/svg+xml;

    # Brotli (perlu module tambahan)
    brotli on;
    brotli_comp_level 6;
    brotli_types
        text/plain
        text/css
        application/json
        application/javascript
        text/javascript;
    brotli_static on;  # Serve .br files jika ada
}
```

---

### Reverse Proxy High Availability

Untuk memastikan reverse proxy tidak menjadi single point of failure, kita perlu setup high availability.

```
┌─────────────────────────────────────────────────────────────┐
│                    HIGH AVAILABILITY                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Setup: Keepalived + VRRP                                   │
│                                                              │
│  [Client]                                                   │
│     │                                                       │
│     ▼                                                       │
│  ┌─────────────────┐                                        │
│  │  Virtual IP     │  ← IP yang selalu aktif                │
│  │  203.0.113.100  │                                        │
│  └────────┬────────┘                                        │
│           │                                                 │
│     ┌─────┴─────┐                                           │
│     ▼           ▼                                           │
│  ┌─────┐    ┌─────┐                                        │
│  │Nginx│    │Nginx│                                        │
│  │MASTER│    │BACKUP│                                       │
│  │10.0.│    │10.0.│                                        │
│  │1.10 │    │1.11 │                                        │
│  └──┬──┘    └──┬──┘                                        │
│     │          │                                           │
│     └────┬─────┘                                           │
│          │                                                 │
│     ┌────▼─────┐                                           │
│     │ Backend  │                                           │
│     │ Servers  │                                           │
│     └──────────┘                                           │
│                                                              │
│  Cara Kerja:                                                │
│  1. Nginx MASTER aktif, handle semua traffic                │
│  2. Nginx BACKUP standby, monitor MASTER via VRRP           │
│  3. Jika MASTER down, BACKUP ambil Virtual IP (failover)    │
│  4. Failover terjadi dalam 1-3 detik                        │
│  5. Client tidak perlu ubah konfigurasi                     │
│                                                              │
│  Keepalived Configuration:                                  │
│                                                              │
│  vrrp_instance VI_1 {                                       │
│      state MASTER          # MASTER atau BACKUP             │
│      interface eth0                                         │
│      virtual_router_id 51                                   │
│      priority 100          # MASTER > BACKUP                │
│      advert_int 1          # Check setiap 1 detik           │
│      authentication {                                       │
│          auth_type PASS                                     │
│          auth_pass secret123                                │
│      }                                                      │
│      virtual_ipaddress {                                    │
│          203.0.113.100                                      │
│      }                                                      │
│  }                                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 CONTOH NYATA — Bagaimana Perusahaan Menggunakan Reverse Proxy

### 1. Netflix

Netflix menggunakan reverse proxy (Zuul + Nginx) sebagai API Gateway untuk ratusan microservices mereka.

```
[User] → [CloudFlare CDN] → [Zuul API Gateway] → [Microservices]
                                                    ↓
                                            1000+ services
                                            (recommendation,
                                             streaming, billing,
                                             user profile, dll)
```

**Fungsi reverse proxy di Netflix:**
- Routing ke 1000+ microservices
- Rate limiting per user
- Authentication dan authorization
- A/B testing (routing ke versi berbeda)
- Circuit breaker (jika service down, fallback)

### 2. Airbnb

Airbnb menggunakan Nginx sebagai reverse proxy untuk melayani jutaan request per detik.

```
[User] → [Nginx Reverse Proxy] → [Rails App Servers]
              ↓
         Serve static assets
         SSL termination
         Rate limiting
         Gzip compression
```

### 3. GitHub

GitHub menggunakan HAProxy untuk load balancing ke ribuan backend servers.

```
[User] → [HAProxy] → [Git Server]
                   → [Web Server]
                   → [API Server]
                   → [CI/CD Server]
```

### 4. CloudFlare (Reverse Proxy sebagai Service)

CloudFlare pada dasarnya adalah reverse proxy global yang melayani jutaan website.

```
[User] → [CloudFlare Edge (terdekat)] → [Origin Server]
              ↓
         DDoS protection
         WAF
         SSL/TLS
         CDN caching
         Bot management
         Rate limiting
```

### 5. Contoh SD Negeri Pasirhalang

Untuk skala sekolah, reverse proxy sederhana sudah cukup:

```
[Orang Tua/Guru] → [Nginx] → [Laravel App (PHP-FPM)]
                        ↓
                   Serve static files
                   SSL (Let's Encrypt)
                   Rate limiting (anti spam)
                   Cache halaman berita
```

---

## 💡 PRAKTIK

### Latihan 1: Setup Nginx Reverse Proxy

Anda punya aplikasi web dengan:
- Backend Node.js di port 3000
- Backend PHP di port 8080
- Static files di `/var/www/static`
- Butuh HTTPS dengan Let's Encrypt

Buat konfigurasi Nginx yang:
1. Redirect HTTP ke HTTPS
2. Proxy `/api/*` ke Node.js
3. Proxy `/app/*` ke PHP
4. Serve static files langsung
5. Enable gzip compression
6. Setup rate limiting (10 req/detik)
7. Tambahkan security headers

### Latihan 2: Analisis Arsitektur

Perusahaan Anda memiliki:
- 5 web server
- 3 API server
- 2 WebSocket server
- Traffic: 10.000 request/detik

Desain arsitektur reverse proxy yang:
- High availability (minimal 2 reverse proxy)
- Load balancing ke semua backend
- SSL termination
- Caching untuk konten statis
- Rate limiting

### Latihan 3: Troubleshooting

Reverse proxy Anda mengalami masalah:
1. Backend sering timeout — apa yang Anda cek?
2. Cache hit ratio rendah (20%) — bagaimana meningkatkan?
3. SSL handshake lambat — apa solusinya?
4. 502 Bad Gateway muncul sesekali — penyebab dan solusi?

---

## ✅ CHECKLIST

- [ ] Bisa menjelaskan apa itu reverse proxy dan cara kerjanya
- [ ] Paham perbedaan forward proxy vs reverse proxy secara detail
- [ ] Bisa menyebutkan 6+ fungsi reverse proxy
- [ ] Paham perbedaan reverse proxy vs load balancer
- [ ] Bisa menulis konfigurasi Nginx reverse proxy dasar
- [ ] Paham SSL termination dan keuntungannya
- [ ] Bisa setup rate limiting di Nginx
- [ ] Paham caching di reverse proxy
- [ ] Bisa konfigurasi load balancing (round robin, least connections)
- [ ] Paham security: IP filtering, WAF, header security
- [ ] Paham optimasi: keep-alive, HTTP/2, compression
- [ ] Paham high availability setup untuk reverse proxy
- [ ] Bisa menjelaskan bagaimana perusahaan besar menggunakan reverse proxy

---

## 🔗 REFERENSI

- **Repo Asli:** [donnemartin/system-design-primer — Reverse Proxy (Web Server)](https://github.com/donnemartin/system-design-primer#reverse-proxy-web-server)
- **Nginx Documentation:** [https://nginx.org/en/docs/](https://nginx.org/en/docs/)
- **HAProxy Documentation:** [https://www.haproxy.org/](https://www.haproxy.org/)
- **Nginx Reverse Proxy Guide:** [https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- **HAProxy Configuration Manual:** [https://www.haproxy.org/download/2.8/doc/configuration.txt](https://www.haproxy.org/download/2.8/doc/configuration.txt)
- **OWASP Reverse Proxy:** [https://owasp.org/www-project-web-security-testing-guide/](https://owasp.org/www-project-web-security-testing-guide/)

---

> **Lanjut ke:** [`11-application-layer.md`](./11-application-layer.md)
