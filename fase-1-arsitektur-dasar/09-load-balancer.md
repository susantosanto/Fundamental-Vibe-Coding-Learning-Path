# 09 — Load Balancer

> **Estimasi:** 2.5 jam | **Level:** Pemula → Menengah → Lanjut

---

## 📖 TEORI

### Apa itu Load Balancer?

**Load Balancer** adalah komponen sistem yang mendistribusikan traffic masuk ke beberapa backend server. Tujuannya: mencegah satu server kelebihan beban (overload), meningkatkan availability, dan memungkinkan horizontal scaling.

```
Tanpa Load Balancer:
[User 1] ──┐
[User 2] ──┤──→ [Server A] → OVERLOAD! 💥
[User 3] ──┘

Dengan Load Balancer:
[User 1] ──┐
[User 2] ──┤──→ [Load Balancer] ──→ [Server A]
[User 3] ──┤                       ├──→ [Server B]
[User 4] ──┤                       └──→ [Server C]
[User 5] ──┘
```

Load balancer bertindak sebagai **single point of entry** — semua client berkomunikasi dengan satu IP/hostname, dan load balancer yang memutuskan server mana yang menangani setiap request. Ini disebut **virtual IP (VIP)** atau **frontend address**.

### Fungsi Load Balancer

1. **Distribusi traffic** — Bagi request ke banyak server secara merata atau berdasarkan algoritma tertentu
2. **Health check** — Cek apakah server sehat, jika tidak, skip dari pool backend
3. **SSL termination** — Handle enkripsi HTTPS di level LB, server backend terima HTTP plain
4. **Session persistence** — User yang sama selalu ke server yang sama (jika diperlukan)
5. **Fail-over** — Jika server mati, otomatis redirect ke server lain tanpa downtime
6. **Connection draining** — Saat server akan di-maintenance, selesaikan request yang sedang berjalan sebelum di-remove dari pool
7. **Rate limiting** — Batasi jumlah request per client untuk mencegah abuse
8. **Compression & caching** — Kompres response dan cache static content di level LB

### Layer 4 vs Layer 7 Load Balancing

#### Layer 4 (Transport Layer)

Load balancing berdasarkan **IP dan port** (TCP/UDP). LB tidak melihat isi payload — hanya forwarding paket berdasarkan alamat network.

```
Request dari 192.168.1.100:54321 → Load Balancer → Server A:8080
Request dari 192.168.1.101:54322 → Load Balancer → Server B:8080
```

**Kelebihan:** Sangat cepat (tidak perlu inspect konten), throughput tinggi, latency rendah
**Kekurangan:** Tidak bisa route berdasarkan konten request, tidak bisa inspect HTTP header
**Use case:** Database clustering, gaming server, VoIP, high-throughput API

#### Layer 7 (Application Layer)

Load balancing berdasarkan **konten request** (URL path, HTTP header, cookie, method). LB mem-parse HTTP request dan membuat keputusan routing yang cerdas.

```
Request ke /api/users → Load Balancer → Server API (port 3000)
Request ke /images/logo.png → Load Balancer → Server Static (port 8080)
Request ke /admin → Load Balancer → Server Admin (port 9090)
Request dengan header X-Mobile: true → Load Balancer → Server Mobile API
```

**Kelebihan:** Fleksibel, bisa route berdasarkan konten, bisa manipulasi header, bisa SSL termination
**Kekurangan:** Lebih lambat (harus parse HTTP request), konsumsi resource lebih tinggi
**Use case:** Web application, microservices routing, A/B testing, canary deployment

#### Perbandingan Detail

| Aspek | Layer 4 | Layer 7 |
|---|---|---|
| OSI Layer | Transport (Layer 4) | Application (Layer 7) |
| Data yang di-inspect | IP + Port | HTTP Header, URL, Cookie, Body |
| Kecepatan | Sangat cepat (nanoseconds) | Lebih lambat (microseconds) |
| SSL Termination | Tidak bisa | Bisa |
| Content-based routing | Tidak | Bisa |
| WebSocket support | Ya (forwarding) | Ya (upgrade handling) |
| Contoh | AWS NLB, LVS, HAProxy TCP mode | AWS ALB, Nginx, Traefik |

---

## 🏗️ LOAD BALANCER PLACEMENT — DNS, Network, Application Level

Load balancer bisa ditempatkan di berbagai level arsitektur, masing-masing dengan tradeoff berbeda.

### 1. DNS-Level Load Balancing (Global)

Traffic didistribusikan di level DNS resolver. Ketika client resolve domain, DNS server memberikan IP yang berbeda.

```
[User Jakarta] → DNS Query → DNS Server → Return IP Server A (Jakarta)
[User Surabaya] → DNS Query → DNS Server → Return IP Server B (Surabaya)
```

**Cara kerja:**
- DNS record (A/AAAA/CNAME) memiliki multiple IP addresses
- DNS server rotate IP yang diberikan (DNS round robin)
- TTL (Time To Live) menentukan seberapa sering client cache DNS response

**Kelebihan:**
- Distribusi traffic geografis (GSLB)
- Tidak ada single point of failure di network level
- Sangat scalable

**Kekurangan:**
- DNS caching membuat perubahan lambat生效 (propagasi tergantung TTL)
- Tidak ada health check real-time (kecuali pakai DNS provider dengan health check)
- Tidak bisa load balance berdasarkan server load

**Contoh implementasi:**
```
# DNS Round Robin - multiple A records
example.com.  300  IN  A  203.0.113.1
example.com.  300  IN  A  203.0.113.2
example.com.  300  IN  A  203.0.113.3
```

### 2. Network-Level Load Balancing (L4)

Load balancer beroperasi di transport layer, forwarding TCP/UDP packets.

```
[Client] → [VIP: 10.0.0.100:80] → [L4 LB] → [Server A:8080]
                                       → [Server B:8080]
                                       → [Server C:8080]
```

**Teknik implementasi:**
- **NAT Mode:** LB mengubah destination IP ke backend server
- **Direct Server Return (DSR):** Response langsung dari backend ke client, tidak melalui LB
- **Tunneling (IPIP):** LB encapsulate paket dan forward ke backend

**Kelebihan:**
- Throughput sangat tinggi (jutaan connections per detik)
- Latency minimal
- Support semua protokol TCP/UDP

**Kekurangan:**
- Tidak bisa content-based routing
- Tidak bisa SSL termination

### 3. Application-Level Load Balancing (L7)

Load balancer mem-parse HTTP request dan membuat keputusan berdasarkan konten.

```
[Client] → [L7 LB] → Inspect HTTP Request
                    → Route berdasarkan:
                      - URL path (/api, /static, /admin)
                      - HTTP method (GET, POST)
                      - Header (User-Agent, Cookie)
                      - Query parameter
```

**Kelebihan:**
- Routing cerdas dan fleksibel
- SSL termination
- Bisa manipulasi request/response
- Support A/B testing, canary deployment

**Kekurangan:**
- Lebih lambat dari L4
- Konsumsi CPU dan memory lebih tinggi
- Hanya support HTTP/HTTPS (dan WebSocket)

---

## 🔍 HEALTH CHECK DEEP DIVE

Health check adalah mekanisme untuk mendeteksi apakah backend server masih bisa melayani request. Ini komponen kritis — tanpa health check, LB akan terus mengirim traffic ke server yang sudah down.

### Passive Health Check (Error-Based)

LB memantau response dari backend. Jika server mengembalikan error (5xx, timeout, connection refused), LB menandai server sebagai unhealthy.

```
Request → Server A → 200 OK ✅ → Server tetap healthy
Request → Server B → 502 Bad Gateway ❌ → Error count +1
Request → Server B → 504 Gateway Timeout ❌ → Error count +1
Request → Server B → 502 Bad Gateway ❌ → Error count = 3 → MARK UNHEALTHY
```

**Karakteristik:**
- Reaktif — server sudah harus error dulu baru ditandai unhealthy
- Tidak ada overhead tambahan (memanfaatkan traffic yang sudah ada)
- User mungkin mengalami error sebelum server di-mark unhealthy

**Parameter konfigurasi:**
```
failures: 3        # Berapa kali error sebelum di-mark unhealthy
successes: 2       # Berapa kali sukses sebelum di-mark healthy kembali
timeout: 5s        # Berapa lama menunggu response sebelum dianggap timeout
window: 30s        # Time window untuk menghitung error rate
```

### Active Health Check (Probe-Based)

LB secara periodik mengirim probe request ke setiap backend server untuk mengecek kesehatan.

```
[LB] ── GET /health ──→ [Server A] ←─ 200 OK ── [Healthy ✅]
[LB] ── GET /health ──→ [Server B] ←─ Timeout ── [Checking...]
[LB] ── GET /health ──→ [Server B] ←─ Timeout ── [Checking...]
[LB] ── GET /health ──→ [Server B] ←─ Connection Refused ── [Unhealthy ❌]
```

**Karakteristik:**
- Proaktif — mendeteksi masalah SEBELUM user mengalami error
- Ada overhead tambahan (probe traffic)
- Bisa cek kesehatan lebih detail (database connection, disk space, dll)

**Health endpoint yang baik:**
```python
@app.route('/health')
def health_check():
    checks = {
        'database': check_database_connection(),
        'redis': check_redis_connection(),
        'disk_space': check_disk_space() > 10,  # minimal 10% free
    }
    
    all_healthy = all(checks.values())
    status_code = 200 if all_healthy else 503
    
    return jsonify(checks), status_code
```

**Parameter konfigurasi:**
```
interval: 10s          # Berapa sering mengirim probe
timeout: 3s            # Berapa lama menunggu response
unhealthy_threshold: 3 # Berapa kali gagal sebelum di-mark unhealthy
healthy_threshold: 2   # Berapa kali sukses sebelum di-mark healthy kembali
```

### Perbandingan Active vs Passive

| Aspek | Passive | Active |
|---|---|---|
| Deteksi | Reaktif (setelah error) | Proaktif (sebelum error) |
| Overhead | Tidak ada | Ada (probe traffic) |
| Akurasi | Tergantung traffic | Tinggi (controlled probe) |
| Recovery time | Lambat | Cepat |
| Deep health check | Tidak bisa | Bisa (cek DB, disk, dll) |
| Rekomendasi | Gunakan bersama active | Gunakan bersama passive |

**Best practice:** Gunakan **keduanya** — active health check untuk deteksi proaktif, passive health catch untuk catch error yang tidak terdeteksi probe.

---

## 🔐 SSL/TLS TERMINATION

### Apa itu SSL Termination?

SSL termination adalah proses mendekripsi traffic HTTPS di load balancer, kemudian meneruskan traffic sebagai HTTP plain ke backend server.

```
[Client] ── HTTPS (encrypted) ──→ [Load Balancer]
                                       ↓ decrypt
                                   ── HTTP (plain) ──→ [Backend Server]
```

### Mengapa SSL Termination Penting?

1. **Offloading CPU** — Enkripsi/dekripsi SSL memakan CPU. Dengan termination di LB, backend server tidak perlu handle overhead ini.
2. **Centralized certificate management** — Satu tempat untuk manage SSL certificate, tidak perlu install di setiap backend.
3. **Inspection capability** — LB bisa inspect HTTP content untuk routing (Layer 7), yang tidak mungkin jika traffic tetap encrypted.
4. **Simplified backend** — Backend server lebih simple, tidak perlu handle SSL certificate rotation.

### Performance Impact

| Metric | Tanpa Termination | Dengan Termination |
|---|---|---|
| CPU di Backend | Tinggi (enkripsi per request) | Rendah |
| CPU di LB | Rendah | Tinggi (tapi dedicated) |
| Latency | Lebih tinggi | Lebih rendah (backend lebih ringan) |
| Throughput | Terbatas CPU backend | Lebih tinggi |
| Certificate Management | Di setiap server | Terpusat di LB |

### Implementasi SSL Termination

**Nginx:**
```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # SSL session caching untuk performa
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    location / {
        proxy_pass http://backend_pool;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### SSL Passthrough

Alternatif: LB tidak mendekripsi, hanya forward encrypted traffic ke backend. Backend yang handle SSL.

```
[Client] ── HTTPS ──→ [Load Balancer] ── HTTPS (forward) ──→ [Backend Server]
```

**Kapan pakai passthrough:**
- Backend perlu melihat client certificate (mutual TLS)
- Compliance requirement (end-to-end encryption)
- Backend sudah handle SSL dengan baik

---

## 🍪 SESSION AFFINITY / STICKY SESSIONS

### Apa itu Session Affinity?

Session affinity (sticky sessions) memastikan request dari user yang sama selalu di-route ke server backend yang sama.

```
[User A] → Request 1 → LB → Server B
[User A] → Request 2 → LB → Server B (same!)
[User A] → Request 3 → LB → Server B (same!)
```

### Mengapa Diperlukan?

Ketika session data disimpan **in-memory** di server (bukan di shared store seperti Redis), user perlu selalu ke server yang sama agar session-nya tersedia.

### Metode Session Affinity

#### 1. IP Hash

LB menghitung hash dari IP client dan menggunakan hasilnya untuk memilih server.

```
hash(192.168.1.100) % 3 = 1 → Server B
hash(192.168.1.100) % 3 = 1 → Server B (selalu sama!)
```

**Kelebihan:** Simple, tidak perlu cookie
**Kekurangan:** User dengan IP sama (NAT/CGNAT) selalu ke server yang sama, tidak fair

#### 2. Cookie-Based

LB inject cookie ke response, client mengirim cookie di request selanjutnya.

```
Response dari Server B → Set-Cookie: SERVERID=B
Request berikutnya → Cookie: SERVERID=B → LB route ke Server B
```

**Kelebihan:** Lebih akurat dari IP hash, support mobile (IP berubah)
**Kekurangan:** Cookie overhead, tidak work jika client disable cookie

#### 3. Application-Level Session

Session disimpan di shared store (Redis, Memcached, database). Setiap server bisa akses session user mana pun.

```
[User A] → Request 1 → Server B → Baca session dari Redis
[User A] → Request 2 → Server C → Baca session dari Redis (sama!)
```

**Kelebihan:** Tidak perlu sticky session, server bisa scale up/down freely
**Kekurangan:** Perlu infrastructure tambahan (Redis), latency tambahan untuk session lookup

### Kapan Pakai Sticky Sessions?

| Skenario | Sticky Sessions? | Alasan |
|---|---|---|
| Session di Redis/Memcached | **Tidak perlu** | Session shared, server mana pun bisa akses |
| Session di memory lokal | **Perlu** | Session hanya ada di satu server |
| Stateless API (JWT) | **Tidak perlu** | Tidak ada session server-side |
| WebSocket connections | **Perlu** | Connection harus persist ke server yang sama |
| File upload multipart | **Perlu** | Chunk harus ke server yang sama |

### Best Practice

**Hindari sticky sessions jika memungkinkan.** Gunakan shared session store (Redis) untuk statelessness. Sticky sessions membuat scaling lebih sulit — jika server mati, semua session di server itu hilang.

---

## 🔄 LOAD BALANCER HIGH AVAILABILITY

Load balancer sendiri bisa menjadi **single point of failure**. Jika LB mati, semua traffic terhenti. Solusi: buat LB juga high availability.

### Active-Passive (Standby)

Satu LB aktif melayani traffic, satu LB standby siap takeover jika yang aktif mati.

```
                    ┌──→ [LB Active] ──→ [Backend Pool]
[Client] ──→ [VIP] ┤
                    └──→ [LB Passive] (standby, monitoring)
```

**Mekanisme failover:**
1. LB passive mengirim heartbeat ke LB active
2. Jika heartbeat tidak diterima dalam X detik, passive takeover VIP
3. Traffic otomatis redirect ke LB yang baru active

**Protokol:** VRRP (Virtual Router Redundancy Protocol) atau Keepalived

**Keepalived configuration:**
```
vrrp_instance VI_1 {
    state MASTER          # MASTER di active, BACKUP di passive
    interface eth0
    virtual_router_id 51
    priority 100          # Active: 100, Passive: 90 (lebih tinggi = prioritas)
    advert_int 1          # Heartbeat setiap 1 detik

    virtual_ipaddress {
        10.0.0.100/24     # VIP yang akan di-failover
    }
}
```

**Kelebihan:** Simple, resource efisien (passive tidak handle traffic)
**Kekurangan:** Passive LB menganggur (waste resource), failover ada downtime singkat (1-3 detik)

### Active-Active

Kedua LB aktif melayani traffic secara bersamaan.

```
                    ┌──→ [LB 1] ──→ [Backend Pool]
[Client] ──→ [DNS] ┤
                    └──→ [LB 2] ──→ [Backend Pool]
```

**Mekanisme:**
- DNS round robin memberikan IP LB 1 atau LB 2
- Atau pakai anycast routing (kedua LB punya IP sama, routing network yang decide)

**Kelebihan:** Semua resource terpakai, throughput lebih tinggi, no single point of failure
**Kekurangan:** Lebih kompleks, perlu sinkronisasi konfigurasi antar LB

### Perbandingan HA Methods

| Metode | Resource Usage | Failover Time | Throughput | Kompleksitas |
|---|---|---|---|---|
| Active-Passive (VRRP) | 50% waste | 1-3 detik | 1x LB | Rendah |
| Active-Active (DNS) | 100% terpakai | Tergantung TTL | 2x LB | Sedang |
| Active-Active (Anycast) | 100% terpakai | Instant | 2x LB | Tinggi |
| Cloud Managed (ALB) | N/A | Automatic | Auto-scale | Rendah |

---

## 🌍 GLOBAL SERVER LOAD BALANCING (GSLB)

### Apa itu GSLB?

GSLB mendistribusikan traffic ke **beberapa data center** di lokasi geografis berbeda. User diarahkan ke data center terdekat untuk latency minimal.

```
[User Jakarta] → DNS → Data Center Jakarta (latency: 5ms)
[User Tokyo] → DNS → Data Center Singapore (latency: 50ms)
[User London] → DNS → Data Center Frankfurt (latency: 30ms)
```

### Cara Kerja GSLB

1. **DNS-based GSLB:** DNS resolver mendeteksi lokasi client dan memberikan IP data center terdekat
2. **Anycast routing:** IP yang sama di-announce dari multiple lokasi, BGP routing yang decide
3. **HTTP redirect:** LB redirect client ke data center lain berdasarkan geo-IP

### Faktor Routing GSLB

- **Geographic proximity** — Data center terdekat secara geografis
- **Latency** — Data center dengan latency terendah
- **Server load** — Data center dengan load paling ringan
- **Health** — Data center yang healthy
- **Cost** — Data center dengan cost terendah

### Use Case GSLB

- **Disaster recovery** — Jika satu data center down, traffic otomatis ke data center lain
- **Latency optimization** — User selalu ke data center terdekat
- **Compliance** — Data user disimpan di region tertentu (GDPR, dll)
- **Traffic management** — A/B testing antar data center

---

## ⚙️ PERBANDINGAN LOAD BALANCER SOFTWARE

### Nginx vs HAProxy vs Traefik vs AWS ALB

#### Nginx

**Kelebihan:**
- Sangat populer, dokumentasi lengkap
- Bisa sebagai web server + reverse proxy + LB
- Performa tinggi, resource efisien
- Support Layer 4 dan Layer 7

**Kekurangan:**
- Konfigurasi perlu reload (walau graceful)
- Dynamic backend discovery terbatas (perlu Nginx Plus atau module tambahan)
- UI management tidak ada (config file only)

**Konfigurasi contoh:**
```nginx
upstream backend_pool {
    least_conn;
    server 10.0.0.1:8080 weight=3;
    server 10.0.0.2:8080 weight=2;
    server 10.0.0.3:8080 weight=1;
    
    # Health check (Nginx Plus)
    # zone backend_health 64k;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://backend_pool;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_connect_timeout 5s;
        proxy_read_timeout 30s;
    }
    
    location /api/ {
        proxy_pass http://backend_pool;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location /static/ {
        alias /var/www/static/;
        expires 30d;
    }
}
```

#### HAProxy

**Kelebihan:**
- Performa tertinggi di kelasnya (bisa handle jutaan connections)
- Health check sangat lengkap (Layer 4 dan Layer 7)
- Statistik dashboard built-in
- Konfigurasi sangat fleksibel

**Kekurangan:**
- Hanya LB (bukan web server)
- Konfigurasi bisa kompleks
- Tidak ada dynamic service discovery native

**Konfigurasi contoh:**
```haproxy
global
    maxconn 50000
    log /dev/log local0

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms
    option httplog
    option forwardfor

frontend http_front
    bind *:80
    bind *:443 ssl crt /etc/haproxy/certs/
    
    # Routing berdasarkan path
    acl is_api path_beg /api
    acl is_static path_beg /static
    acl is_admin path_beg /admin
    
    use_backend api_servers if is_api
    use_backend static_servers if is_static
    use_backend admin_servers if is_admin
    default_backend web_servers

backend api_servers
    balance leastconn
    option httpchk GET /health
    server api1 10.0.0.1:3000 check inter 10s fall 3 rise 2
    server api2 10.0.0.2:3000 check inter 10s fall 3 rise 2
    server api3 10.0.0.3:3000 check inter 10s fall 3 rise 2

backend web_servers
    balance roundrobin
    cookie SERVERID insert indirect nocache
    server web1 10.0.0.4:8080 check cookie web1
    server web2 10.0.0.5:8080 check cookie web2

backend static_servers
    balance roundrobin
    server static1 10.0.0.6:8080 check
    server static2 10.0.0.7:8080 check

backend admin_servers
    balance source
    server admin1 10.0.0.8:9090 check

# Stats dashboard
listen stats
    bind *:8404
    stats enable
    stats uri /stats
    stats refresh 10s
```

#### Traefik

**Kelebihan:**
- Dynamic service discovery (Docker, Kubernetes, Consul, dll)
- Auto-configuration — tidak perlu reload
- Dashboard UI built-in
- Auto SSL dengan Let's Encrypt
- Modern, cloud-native

**Kekurangan:**
- Relatif baru, komunitas lebih kecil
- Performa sedikit di bawah HAProxy
- Konfigurasi bisa membingungkan untuk pemula

**Konfigurasi contoh (traefik.yml + Docker labels):**
```yaml
# traefik.yml (static config)
entryPoints:
  web:
    address: ":80"
  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    network: web

certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@example.com
      storage: /etc/traefik/acme.json
      httpChallenge:
        entryPoint: web
```

```yaml
# docker-compose.yml (dynamic config via labels)
services:
  api:
    image: my-api:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=PathPrefix(`/api`)"
      - "traefik.http.routers.api.entrypoints=websecure"
      - "traefik.http.routers.api.tls.certresolver=letsencrypt"
      - "traefik.http.services.api.loadbalancer.server.port=3000"
      - "traefik.http.routers.api.middlewares=rate-limit"
      - "traefik.http.middlewares.rate-limit.ratelimit.average=100"
      - "traefik.http.middlewares.rate-limit.ratelimit.burst=50"

  web:
    image: my-web:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.web.rule=Host(`example.com`)"
      - "traefik.http.services.web.loadbalancer.server.port=8080"
```

#### AWS Application Load Balancer (ALB)

**Kelebihan:**
- Fully managed — tidak perlu maintain server
- Auto-scaling built-in
- Integrasi dengan AWS ecosystem (EC2, ECS, Lambda, Cognito)
- SSL termination gratis
- Health check otomatis

**Kekurangan:**
- Vendor lock-in (hanya di AWS)
- Biaya per LCU (Load Balancer Capacity Unit)
- Konfigurasi via AWS Console/CLI/Terraform (bukan config file)
- Limited customization dibanding self-hosted

**Konfigurasi via Terraform:**
```hcl
resource "aws_lb" "main" {
  name               = "main-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = false
}

resource "aws_lb_target_group" "api" {
  name     = "api-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
    matcher             = "200"
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.main.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }
}

resource "aws_lb_listener_rule" "api_routing" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}
```

### Perbandingan Lengkap

| Fitur | Nginx | HAProxy | Traefik | AWS ALB |
|---|---|---|---|---|
| Layer 4 LB | Ya | Ya | Tidak | Tidak (NLB untuk L4) |
| Layer 7 LB | Ya | Ya | Ya | Ya |
| Health Check | Basic (Plus: advanced) | Lengkap | Lengkap | Otomatis |
| SSL Termination | Ya | Ya | Ya (auto LE) | Ya |
| Dynamic Discovery | Tidak (perlu Plus) | Tidak | Ya (Docker/K8s) | Ya (AWS native) |
| Dashboard | Tidak | Ya | Ya | Ya (AWS Console) |
| Rate Limiting | Ya | Ya | Ya | Ya (via WAF) |
| WebSocket | Ya | Ya | Ya | Ya |
| gRPC | Ya | Ya | Ya | Ya |
| Performa | Tinggi | Sangat Tinggi | Sedang-Tinggi | Managed |
| Learning Curve | Sedang | Tinggi | Rendah | Rendah |
| Cost | Gratis | Gratis | Gratis | Bayar per usage |

---

## 🧮 ALGORITMA LOAD BALANCING — DETAIL DENGAN PSEUDOCODE

### 1. Round Robin

Algoritma paling simple: request didistribusikan secara bergiliran ke setiap server.

```
Server: [A, B, C]
Request 1 → A
Request 2 → B
Request 3 → C
Request 4 → A (kembali ke awal)
Request 5 → B
```

**Pseudocode:**
```
class RoundRobin:
    servers = [A, B, C]
    current_index = 0

    function get_next_server():
        server = servers[current_index]
        current_index = (current_index + 1) % len(servers)
        return server
```

**Kapan pakai:** Semua server punya spec sama, traffic relatif merata, stateless request.

### 2. Weighted Round Robin

Setiap server punya bobot (weight). Server dengan weight lebih tinggi dapat lebih banyak request.

```
Server A (weight=4), Server B (weight=2), Server C (weight=1)
Request 1 → A
Request 2 → A
Request 3 → B
Request 4 → A
Request 5 → A
Request 6 → B
Request 7 → C
(dalam 1 cycle: A dapat 4, B dapat 2, C dapat 1)
```

**Pseudocode:**
```
class WeightedRoundRobin:
    servers = [
        {name: A, weight: 4, current_weight: 0},
        {name: B, weight: 2, current_weight: 0},
        {name: C, weight: 1, current_weight: 0},
    ]

    function get_next_server():
        total_weight = sum(s.weight for s in servers)
        
        # Increment current weight untuk semua server
        for server in servers:
            server.current_weight += server.weight
        
        # Pilih server dengan current_weight tertinggi
        best_server = max(servers, key=lambda s: s.current_weight)
        
        # Kurangi current_weight server terpilih dengan total weight
        best_server.current_weight -= total_weight
        
        return best_server.name
```

**Kapan pakai:** Server spec berbeda (ada yang lebih powerful), ingin distribusi proporsional.

### 3. Least Connections

Request dikirim ke server dengan jumlah koneksi aktif paling sedikit.

```
Server A: 15 koneksi aktif
Server B: 8 koneksi aktif  ← terpilih
Server C: 22 koneksi aktif
```

**Pseudocode:**
```
class LeastConnections:
    servers = [
        {name: A, active_connections: 15},
        {name: B, active_connections: 8},
        {name: C, active_connections: 22},
    ]

    function get_next_server():
        # Filter hanya server yang healthy
        healthy_servers = [s for s in servers if s.is_healthy]
        
        # Pilih server dengan koneksi aktif paling sedikit
        return min(healthy_servers, key=lambda s: s.active_connections).name

    function on_connection_open(server):
        server.active_connections += 1

    function on_connection_close(server):
        server.active_connections -= 1
```

**Kapan pakai:** Request duration bervariasi (ada yang cepat, ada yang lama), server spec sama.

### 4. IP Hash

Hash dari IP client digunakan untuk memilih server. User dengan IP sama selalu ke server yang sama.

```
hash("192.168.1.100") % 3 = 1 → Server B
hash("192.168.1.101") % 3 = 0 → Server A
hash("192.168.1.100") % 3 = 1 → Server B (selalu sama!)
```

**Pseudocode:**
```
class IPHash:
    servers = [A, B, C]

    function get_next_server(client_ip):
        hash_value = hash_function(client_ip)  # e.g., CRC32, MD5
        index = hash_value % len(servers)
        return servers[index].name
```

**Kapan pakai:** Butuh session persistence, tidak ada shared session store.

### 5. Consistent Hashing

Variasi dari IP hash yang lebih robust saat server ditambah/dihapus. Hanya sebagian kecil request yang perlu di-remap.

```
Server A, B, C di hash ring:
         A
       /   \
      C     B
       \   /
         -

Client IP X hash ke posisi antara C dan B → route ke B

Server D ditambahkan:
         A
       /   \
      C     D
       \   /
         B

Hanya client yang hash ke posisi antara D dan B yang terpengaruh.
Client lainnya tetap ke server yang sama.
```

**Pseudocode:**
```
class ConsistentHash:
    hash_ring = SortedDict()  # hash_value → server_name
    virtual_nodes_per_server = 150  # untuk distribusi lebih merata

    function add_server(server_name):
        for i in range(virtual_nodes_per_server):
            key = hash(f"{server_name}#{i}")
            hash_ring[key] = server_name

    function remove_server(server_name):
        keys_to_remove = [k for k, v in hash_ring.items() if v == server_name]
        for key in keys_to_remove:
            del hash_ring[key]

    function get_server(client_ip):
        hash_value = hash(client_ip)
        
        # Cari server pertama di ring yang hash-nya >= client hash
        # (clockwise search di hash ring)
        server = hash_ring.ceiling_entry(hash_value)
        
        # Jika tidak ada yang lebih besar, wrap around ke awal ring
        if server is None:
            server = hash_ring.first_entry()
        
        return server.value
```

**Kapan pakai:** Caching distributed (cache miss minim saat server berubah), CDN, distributed database.

---

## 🏢 REAL-WORLD EXAMPLES

### Netflix — Global Load Balancing dengan Zuul + Eureka

Netflix menggunakan arsitektur microservices dengan ratusan services. Load balancing mereka sangat kompleks:

**Arsitektur:**
```
[User] → [CloudFront CDN] → [Zuul API Gateway] → [Eureka Service Discovery]
                                                → [Microservice instances]
```

**Detail:**
- **Zuul** berfungsi sebagai Layer 7 load balancer dan API gateway
- **Eureka** untuk service discovery — setiap microservice register dirinya
- **Client-side load balancing** menggunakan Ribbon — client memilih server dari daftar yang didapat dari Eureka
- **Health check** setiap 30 detik, server unhealthy di-remove dari Eureka registry
- **Regional failover** — jika satu AWS region down, traffic di-route ke region lain

**Pelajaran:** Netflix menggunakan **client-side load balancing** (bukan centralized LB) untuk microservices. Client bertanggung jawab memilih server, bukan LB terpusat.

### Uber — Geo-Sharding dengan Layered Load Balancing

Uber melayani jutaan request per detik secara global. Arsitektur LB mereka berlapis:

**Arsitektur:**
```
[User App] → [DNS GSLB] → [Regional LB] → [City LB] → [Service Instances]
```

**Detail:**
- **DNS-level GSLB** mengarahkan user ke region terdekat (US, EU, APAC)
- **Regional LB** (Envoy proxy) handle traffic di level region
- **City-level LB** untuk service yang spesifik per kota (matching driver-rider)
- **Consistent hashing** untuk routing request ke shard database yang benar
- **Rate limiting** di setiap layer untuk mencegah overload

**Pelajaran:** Uber menggunakan **layered load balancing** — LB di setiap level arsitektur, dari global sampai service level.

---

## 💡 PRAKTIK

### Latihan 1: Pilih Algoritma

Tentukan algoritma load balancing yang cocok:

1. 3 server dengan spec sama, traffic merata
2. Server A (8 core), Server B (4 core), Server C (2 core)
3. Aplikasi chat yang butuh session persistence
4. API dengan request duration yang sangat bervariasi
5. Distributed cache cluster (Redis/Memcached)
6. Video streaming server

**Jawaban:**
1. **Round Robin** — Server identik, traffic merata, simple dan fair
2. **Weighted Round Robin** (A: 4, B: 2, C: 1) — Distribusi proporsional dengan kapasitas
3. **IP Hash** atau **Cookie-based sticky session** — User tetap ke server yang sama
4. **Least Connections** — Server dengan koneksi paling sedikit dapat request baru
5. **Consistent Hashing** — Minim cache miss saat server ditambah/dihapus
6. **Weighted Least Connections** — Server dengan bandwidth tersedia paling banyak dapat request

### Latihan 2: Desain Load Balancer untuk Sistem Informasi Sekolah

**Requirements:**
- 2 web server untuk portal orang tua (spec sama)
- 1 web server untuk admin panel (spec lebih rendah)
- 1 server untuk API absensi (butuh session persistence)
- SSL termination diperlukan
- Health check setiap 10 detik

**Desain:**
```
[Orang Tua/Guru] ──→ [Nginx LB: 443 SSL]
                          │
                          ├── /portal/* → Pool Portal (Round Robin)
                          │                  ├── Server Portal 1 (10.0.0.1:8080)
                          │                  └── Server Portal 2 (10.0.0.2:8080)
                          │
                          ├── /admin/* → Pool Admin (Least Connections)
                          │                └── Server Admin (10.0.0.3:9090)
                          │
                          └── /api/* → Pool API (IP Hash - sticky session)
                                       └── Server API (10.0.0.4:3000)
```

**Konfigurasi Nginx:**
```nginx
upstream portal_pool {
    roundrobin;
    server 10.0.0.1:8080;
    server 10.0.0.2:8080;
}

upstream admin_pool {
    least_conn;
    server 10.0.0.3:9090;
}

upstream api_pool {
    ip_hash;
    server 10.0.0.4:3000;
}

server {
    listen 443 ssl http2;
    server_name sekolah.example.com;

    ssl_certificate /etc/nginx/ssl/sekolah.crt;
    ssl_certificate_key /etc/nginx/ssl/sekolah.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    location /portal/ {
        proxy_pass http://portal_pool;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /admin/ {
        proxy_pass http://admin_pool;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://api_pool;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Latihan 3: Desain High Availability Load Balancer

**Requirements:**
- Load balancer harus high availability (tidak boleh single point of failure)
- Budget terbatas (tidak bisa pakai cloud LB)
- 3 backend web server

**Desain Active-Passive dengan Keepalived:**
```
                    ┌──→ [Nginx LB 1 - MASTER] ──→ [Backend Pool]
[Client] ──→ [VIP] ┤                                ├── Server 1
   10.0.0.100      │                                ├── Server 2
                    └──→ [Nginx LB 2 - BACKUP] ──→ [Backend Pool]
                         (monitor via heartbeat)    └── Server 3
```

**Keepalived di LB 1 (MASTER):**
```
vrrp_script check_nginx {
    script "/usr/bin/pgrep nginx"
    interval 2
    fall 2
    rise 2
}

vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 100
    advert_int 1

    virtual_ipaddress {
        10.0.0.100/24
    }

    track_script {
        check_nginx
    }
}
```

**Keepalived di LB 2 (BACKUP):**
```
vrrp_instance VI_1 {
    state BACKUP
    interface eth0
    virtual_router_id 51
    priority 90          # Lebih rendah dari MASTER
    advert_int 1

    virtual_ipaddress {
        10.0.0.100/24
    }
}
```

### Latihan 4: Troubleshooting Load Balancer

**Skenario:** User melaporkan bahwa website sering timeout. Cek log LB menunjukkan:
- Server A: 80% error rate (502 Bad Gateway)
- Server B: 20% error rate
- Server C: 5% error rate

**Langkah troubleshooting:**
1. **Cek health check** — Apakah LB sudah mark Server A sebagai unhealthy?
2. **Cek server A** — CPU, memory, disk space, log aplikasi
3. **Cek koneksi database** — Apakah server A tidak bisa connect ke DB?
4. **Cek network** — Apakah ada network issue antara LB dan Server A?
5. **Temporary fix** — Remove Server A dari pool, investigasi root cause

---

## ✅ CHECKLIST

- [ ] Bisa menjelaskan apa itu load balancer dan fungsinya
- [ ] Paham perbedaan Layer 4 vs Layer 7 load balancing
- [ ] Bisa menjelaskan algoritma load balancing utama dengan pseudocode
- [ ] Mengerti hubungan load balancer dengan horizontal scaling
- [ ] Bisa memilih algoritma yang tepat untuk kasus tertentu
- [ ] Paham perbedaan software, hardware, dan cloud load balancer
- [ ] Mengerti konsep health check (active vs passive)
- [ ] Paham SSL termination dan kapan menggunakan passthrough
- [ ] Mengerti session affinity dan alternatifnya (shared session store)
- [ ] Bisa mendesain LB high availability (active-passive, active-active)
- [ ] Paham konsep GSLB dan kapan diperlukan
- [ ] Bisa membandingkan Nginx, HAProxy, Traefik, dan AWS ALB
- [ ] Bisa menulis konfigurasi LB dasar untuk skenario nyata

---

## 🔗 REFERENSI

- **donnemartin/system-design-primer** — [Load Balancer Section](https://github.com/donnemartin/system-design-primer#load-balancer)
- **Nginx Documentation** — [HTTP Load Balancing](https://nginx.org/en/docs/http/load_balancing.html)
- **HAProxy Documentation** — [Configuration Manual](https://www.haproxy.org/download/2.8/doc/configuration.txt)
- **Traefik Documentation** — [Routing Overview](https://doc.traefik.io/traefik/routing/overview/)
- **AWS ALB Documentation** — [Application Load Balancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html)
- **Scalable System Design Patterns** — [Horicky Blog](http://horicky.blogspot.com/2010/10/scalable-system-design-patterns.html)
- **Keepalived Documentation** — [VRRP Configuration](https://www.keepalived.org/manpage.html)
- **Consistent Hashing** — [Wikipedia](https://en.wikipedia.org/wiki/Consistent_hashing)

---

> **Lanjut ke:** [`10-reverse-proxy.md`](./10-reverse-proxy.md)
