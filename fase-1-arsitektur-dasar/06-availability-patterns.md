# 06 — Availability Patterns (Fail-over & Replication)

> **Estimasi:** 2 jam | **Level:** Pemula → Menengah

---

## 📖 TEORI

### Latar Belakang

Setelah memahami CAP Theorem dan pola konsistensi, sekarang kita bahas **bagaimana membuat sistem tetap tersedia** (high availability). Dalam dunia production, server BISA dan AKAN gagal. Disk bisa rusak, network bisa putus, data center bisa kebakaran. Pertanyaannya bukan "apakah akan gagal?" tapi "kapan akan gagal?"

Untuk membuat sistem yang **resilient** (tahan banting), kita perlu memahami:

1. **Redundancy Patterns** — Cara menduplikasi komponen
2. **Failover Mechanisms** — Cara beralih saat komponen gagal
3. **Health Check Patterns** — Cara mendeteksi kegagalan
4. **Graceful Degradation** — Cara tetap berfungsi dengan kemampuan terbatas
5. **Bulkhead Pattern** — Isolasi kegagalan
6. **Retry Patterns** — Cara menangani kegagalan sementara
7. **Circuit Breaker Pattern** — Cara mencegah cascade failure
8. **Rate Limiting Patterns** — Cara melindungi sistem dari overload
9. **Chaos Engineering** — Cara proaktif menguji ketahanan sistem

---

## BAGIAN 1: Redundancy Patterns

### Apa Itu Redundancy?

Redundancy adalah strategi **menduplikasi komponen** sehingga jika satu komponen gagal, komponen lain bisa mengambil alih. Ini adalah fondasi dari high availability.

### 1. Active-Passive (Standby)

**Definisi:** Satu komponen aktif menangani semua traffic, komponen lain standby siap mengambil alih.

```
Arsitektur Active-Passive:
═══════════════════════════════════════

                    [Client]
                       │
                       ↓
                  [Virtual IP]
                       │
                       ↓
              ┌─────────────────┐
              │                 │
         [Active]          [Passive]
         (Handle           (Standby,
          traffic)          ready)
              │                 │
              │ ←─ heartbeat ──→│
              │   (setiap 1s)   │

Normal: Active handle semua traffic
Failover: Passive detect active down → ambil alih VIP
```

**Hot Standby vs Warm Standby vs Cold Standby:**

```
Hot Standby:
═══════════════════════════════════════
- Passive server SUDAH RUNNING
- Data SUDAH ter-replikasi real-time
- Failover time: ~detik
- Biaya: TINGGI (server duplicate full spec)

┌─────────────────────────────────────┐
│ [Active] ←── sync ──→ [Passive]     │
│  Running               Running      │
│  Full traffic          Ready        │
│  Downtime: ~1-5 detik               │
└─────────────────────────────────────┘

Warm Standby:
═══════════════════════════════════════
- Passive server RUNNING tapi tidak handle traffic
- Data ter-replikasi dengan delay (near real-time)
- Failover time: ~menit
- Biaya: SEDANG

┌─────────────────────────────────────┐
│ [Active] ←── async ──→ [Passive]    │
│  Running               Running      │
│  Full traffic          Idle         │
│  Downtime: ~1-5 menit               │
└─────────────────────────────────────┘

Cold Standby:
═══════════════════════════════════════
- Passive server TIDAK RUNNING
- Data di-backup berkala (bukan real-time)
- Failover time: ~jam
- Biaya: RENDAH

┌─────────────────────────────────────┐
│ [Active]         [Passive]          │
│  Running          OFF               │
│  Full traffic     Backup harian     │
│  Downtime: ~1-4 jam                 │
└─────────────────────────────────────┘
```

**Kapan pakai Active-Passive:**
- Database yang butuh konsistensi kuat (hanya 1 writer)
- Sistem dengan traffic rendah-sedang
- Budget terbatas
- Aplikasi yang tidak bisa handle concurrent write

### 2. Active-Active

**Definisi:** Semua komponen aktif menangani traffic secara bersamaan.

```
Arsitektur Active-Active:
═══════════════════════════════════════

                    [Client]
                       │
                       ↓
              [Load Balancer]
                 ╱   │   ╲
                ╱    │    ╲
               ↓     ↓     ↓
          [Server A] [Server B] [Server C]
          (Active)   (Active)   (Active)
               │     │     │
               │ ←─ data sync ─→ │
               │  (bidirectional) │

Semua server handle traffic.
Jika 1 down, load balancer redirect ke yang lain.
```

**Kelebihan Active-Active:**
- **Zero downtime** — tidak ada single point of failure
- **Better resource utilization** — semua server produktif
- **Higher throughput** — load terdistribusi
- **Geographic distribution** — user bisa connect ke server terdekat

**Kekurangan Active-Active:**
- **Kompleks** — butuh sinkronisasi data bidirectional
- **Konflik data** — 2 server bisa write data yang sama bersamaan
- **Lebih mahal** — butuh lebih banyak infrastruktur
- **Debugging sulit** — masalah bisa muncul dari interaksi antar node

**Kapan pakai Active-Active:**
- Aplikasi dengan traffic tinggi
- Butuh zero downtime
- User tersebar geografis
- Budget cukup untuk infrastruktur redundant

### 3. N+1 Redundancy

**Definisi:** Punya N komponen yang dibutuhkan + 1 komponen cadangan.

```
Contoh: Sistem butuh 3 server untuk handle traffic normal

N+1 Setup:
═══════════════════════════════════════

Butuh: 3 server (N=3)
Punya: 4 server (N+1=4)

[Server 1] [Server 2] [Server 3] [Server 4]
 (Active)   (Active)   (Active)   (Standby)

Jika Server 2 down:
[Server 1] [Server 2] [Server 3] [Server 4]
 (Active)   (DOWN)     (Active)   (Active!)
                              ↑
                    Server 4 ambil alih

Keuntungan: Cukup 1 extra server untuk backup semua N server.
Kerugian: Jika 2 server down bersamaan, sistem overload.
```

**Kapan pakai N+1:**
- Komponen yang mahal (tidak mungkin full duplicate)
- Probability multiple failure sangat rendah
- Load balancer bisa redistribute traffic

### 4. 2N Redundancy

**Definisi:** Punya 2x lipat komponen yang dibutuhkan — full duplicate.

```
Contoh: Sistem butuh 3 server

2N Setup:
═══════════════════════════════════════

Butuh: 3 server
Punya: 6 server (2N=6)

Side A: [Server 1] [Server 2] [Server 3]
Side B: [Server 4] [Server 5] [Server 6]

Side A dan Side B IDENTIK.
Jika seluruh Side A down, Side B handle semua traffic.

Ini adalah redundancy level tertinggi.
Biasanya digunakan di:
- Sistem perbankan
- Sistem kesehatan
- Sistem militer
- Sistem yang downtime = bahaya/kerugian besar
```

**Perbandingan Redundancy Patterns:**

| Pattern | Komponen | Biaya | Availability | Kompleksitas |
|---|---|---|---|---|
| Active-Passive | 2 (1 aktif) | Rendah | Sedang | Rendah |
| Active-Active | 2+ (semua aktif) | Tinggi | Tinggi | Tinggi |
| N+1 | N+1 | Sedang | Sedang-Tinggi | Sedang |
| 2N | 2N | Sangat Tinggi | Sangat Tinggi | Tinggi |

---

## BAGIAN 2: Failover Mechanisms

### Apa Itu Failover?

Failover adalah proses **otomatis atau manual** beralih dari komponen yang gagal ke komponen cadangan.

### 1. Automatic Failover

**Definisi:** Sistem secara otomatis mendeteksi kegagalan dan beralih ke komponen cadangan **tanpa intervensi manusia**.

```
Automatic Failover Flow:
═══════════════════════════════════════

[Primary] ── heartbeat ──→ [Standby]
     │                        │
     │ (setiap 1 detik)       │
     │                        │
     × CRASH!                 │
     │                        │
     × (heartbeat stop)       │
     │                        │
     │                        ↓
     │              [Standby detect timeout]
     │              (setelah 3 detik tanpa heartbeat)
     │                        │
     │                        ↓
     │              [Standby promote diri jadi Primary]
     │                        │
     │                        ↓
     │              [Update DNS/VIP ke diri sendiri]
     │                        │
     │                        ↓
[Client] ──────────────→ [New Primary]
                          (traffic otomatis redirect)

Timeline:
T=0:    Primary crash
T=1:    Heartbeat terakhir diterima Standby
T=2:    Standby tidak dapat heartbeat (timeout 1s)
T=3:    Standby tidak dapat heartbeat (timeout 2s)
T=4:    Standby tidak dapat heartbeat (timeout 3s) → TRIGGER FAILOVER
T=5:    Standby jadi Primary baru
T=6:    Client traffic redirect ke Primary baru

Total downtime: ~6 detik
```

**Komponen Automatic Failover:**

```
1. Health Monitor
   - Kirim heartbeat/health check secara berkala
   - Deteksi timeout atau error response

2. Failover Controller
   - Putuskan kapan harus failover
   - Koordinasi promosi standby jadi primary

3. Traffic Router
   - DNS update
   - Virtual IP (VIP) takeover
   - Load balancer reconfiguration

4. Data Sync
   - Replication dari primary ke standby
   - Pastikan data tidak hilang saat failover
```

**Kelebihan:**
- Downtime minimal (detik)
- Tidak butuh manusia 24/7
- Konsisten (tidak ada human error)

**Kekurangan:**
- Risiko false positive (failover padahal tidak perlu)
- Split brain jika network partition
- Kompleks untuk di-setup dan di-test

### 2. Manual Failover

**Definisi:** Manusia harus secara eksplisit memicu failover.

```
Manual Failover Flow:
═══════════════════════════════════════

[Primary] ── error ──→ [Monitoring Alert]
     │                        │
     │                        ↓
     │              [Alert ke Operator]
     │              "Primary down! Perlu failover!"
     │                        │
     │                        ↓
     │              [Operator verifikasi masalah]
     │              (bukan false alarm?)
     │                        │
     │                        ↓
     │              [Operator klik "Failover" button]
     │                        │
     │                        ↓
     │              [Standby promote jadi Primary]
     │                        │
[Client] ──────────────→ [New Primary]

Timeline:
T=0:    Primary crash
T=1:    Monitoring detect
T=2:    Alert dikirim (email, Slack, PagerDuty)
T=5:    Operator lihat alert
T=8:    Operator verifikasi
T=10:   Operator trigger failover
T=12:   Failover selesai

Total downtime: ~12 detik (belum termasuk waktu operator respond)
Bisa jadi MENITAN jika operator tidak langsung respond.
```

**Kapan pakai Manual Failover:**
- Data sangat kritis (tidak mau risiko false positive)
- Butuh verifikasi manusia sebelum failover
- Downtime beberapa menit masih acceptable
- Compliance/regulatory requirement

### 3. Semi-Automatic Failover

**Definisi:** Sistem mendeteksi dan MENYIAPKAN failover, tapi butuh **konfirmasi manusia** sebelum eksekusi.

```
Semi-Automatic Failover Flow:
═══════════════════════════════════════

[Primary] ── error ──→ [Monitoring]
     │                        │
     │                        ↓
     │              [Auto-prepare failover]
     │              - Standby sudah ready
     │              - Data sudah synced
     │              - Traffic route sudah disiapkan
     │                        │
     │                        ↓
     │              [Alert ke Operator]
     │              "Primary down. Failover siap.
     │               Klik CONFIRM untuk eksekusi."
     │                        │
     │                        ↓
     │              [Operator klik "CONFIRM"]
     │                        │
     │                        ↓
     │              [Failover eksekusi (cepat!)]
     │                        │
[Client] ──────────────→ [New Primary]

Keuntungan:
- Persiapan otomatis (cepat)
- Eksekusi butuh konfirmasi (aman)
- Downtime lebih pendek dari manual full
```

**Perbandingan Failover Mechanisms:**

| Aspek | Automatic | Semi-Automatic | Manual |
|---|---|---|---|
| Downtime | Detik | Detik-Menit | Menit-Jam |
| False positive risk | Tinggi | Rendah | Sangat rendah |
| Human effort | Nol | Minimal | Tinggi |
| Kompleksitas | Tinggi | Sedang | Rendah |
| Use case | Web apps, API | Database kritis | Financial, medical |

---

## BAGIAN 3: Health Check Patterns

### Apa Itu Health Check?

Health check adalah mekanisme untuk **memastikan komponen masih berfungsi** dengan benar. Ini adalah fondasi dari automatic failover dan load balancing.

### 1. TCP Health Check

**Cara kerja:** Cek apakah port bisa di-connect.

```
TCP Health Check:
═══════════════════════════════════════

[Load Balancer] ── TCP SYN ──→ [Server:8080]
                                      │
                                      ↓ TCP SYN-ACK
[Load Balancer] ←─ TCP SYN-ACK ── [Server:8080]
                                      │
                                      ↓ TCP ACK
[Load Balancer] ── TCP ACK ──→ [Server:8080]

Result: Connection berhasil → Server HEALTHY

Kelebihan: Cepat, sederhana
Kekurangan: Hanya cek port terbuka, tidak cek aplikasi
  (Aplikasi bisa crash tapi port masih terbuka)
```

### 2. HTTP Health Check

**Cara kerja:** Kirim HTTP request dan cek response.

```
HTTP Health Check:
═══════════════════════════════════════

[Load Balancer] ── GET /health ──→ [Server]
                                        │
                                        ↓
[Load Balancer] ←─ HTTP 200 OK ── [Server]
              Body: {"status": "healthy",
                     "db": "connected",
                     "cache": "connected"}

Result: HTTP 200 + body valid → Server HEALTHY

Endpoint /health yang baik harus cek:
- Database connection
- Cache connection
- Disk space
- Memory usage
- Dependency services

Contoh implementasi (Express.js):
app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    diskSpace: await checkDiskSpace(),
  };

  const allHealthy = Object.values(checks).every(v => v);

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString(),
  });
});
```

### 3. Health Check dengan Threshold

**Cara kerja:** Tidak langsung declare unhealthy setelah 1 failure. Butuh beberapa failure berturut-turut.

```
Health Check dengan Threshold:
═══════════════════════════════════════

Server Status: HEALTHY

Check 1: ✅ OK
Check 2: ✅ OK
Check 3: ❌ FAIL  ← 1 failure, belum declare unhealthy
Check 4: ❌ FAIL  ← 2 failures
Check 5: ❌ FAIL  ← 3 failures → UNHEALTHY! TRIGGER FAILOVER

Threshold umum:
- Unhealthy threshold: 3 consecutive failures
- Healthy threshold: 2 consecutive successes
- Check interval: 10 detik
- Timeout: 5 detik

Konfigurasi (contoh Nginx):
upstream backend {
    server backend1:8080;
    server backend2:8080;

    # Health check
    health_check interval=10s fails=3 passes=2;
}
```

### 4. Health Check Best Practices

```
Best Practices:
═══════════════════════════════════════

1. Health check endpoint HARUS ringan
   - Tidak query database berat
   - Tidak proses data besar
   - Response time < 100ms

2. Health check HARUS cek dependency kritis
   - Database connection
   - External API (jika critical)
   - Disk space (jika write ke disk)

3. Health check HARUS independent
   - Tidak depend on session
   - Tidak depend on authentication
   - Selalu accessible

4. Health check HARUS punya timeout
   - Jangan tunggu forever
   - Default: 5 detik

5. Health check HARUS punya interval yang tepat
   - Terlalu sering: overhead tinggi
   - Terlalu jarang: lambat detect failure
   - Sweet spot: 5-30 detik
```

---

## BAGIAN 4: Graceful Degradation

### Apa Itu Graceful Degradation?

Graceful degradation adalah strategi di mana sistem **tetap berfungsi dengan kemampuan terbatas** saat komponen tertentu gagal, alih-alih crash total.

```
Graceful Degradation Concept:
═══════════════════════════════════════

Full Functionality:
┌─────────────────────────────────────┐
│ [Search] [Recommendations] [Reviews]│
│ [Cart]   [Checkout]     [Payment]   │
│ [Order Tracking] [Support Chat]     │
└─────────────────────────────────────┘

Saat Recommendation Engine down:
┌─────────────────────────────────────┐
│ [Search] [❌ Recommendations] [Reviews]│
│ [Cart]   [Checkout]     [Payment]   │
│ [Order Tracking] [Support Chat]     │
│                                     │
│ "Rekomendasi sementara tidak        │
│  tersedia. Silakan browse manual."  │
└─────────────────────────────────────┘
  ↑ Sistem masih bisa berfungsi,
    hanya fitur rekomendasi yang mati.
```

### Contoh Graceful Degradation

```
E-Commerce Website:
═══════════════════════════════════════

Komponen:
- Product Catalog (KRITIS)
- Shopping Cart (KRITIS)
- Payment Gateway (KRITIS)
- Recommendation Engine (NON-KRITIS)
- Review System (NON-KRITIS)
- Live Chat Support (NON-KRITIS)

Degradation Strategy:

Level 1: Semua normal
→ Full functionality

Level 2: Recommendation Engine down
→ Hide recommendation section
→ Tampilkan pesan: "Rekomendasi tidak tersedia"
→ User masih bisa browse dan beli

Level 3: Review System down
→ Hide review section
→ User masih bisa beli tanpa baca review

Level 4: Payment Gateway A down
→ Switch ke Payment Gateway B
→ User mungkin perlu pilih metode pembayaran lain

Level 5: Database read replica down
→ Switch ke master database untuk read
→ Performa turun, tapi sistem tetap jalan

Level 6: Database master down (CRITICAL)
→ Read-only mode
→ User bisa browse, tidak bisa checkout
→ Tampilkan: "Sistem dalam maintenance"
```

### Implementasi Graceful Degradation

```python
class GracefulDegradation:
    def __init__(self):
        self.recommendation_engine = RecommendationEngine()
        self.review_system = ReviewSystem()
        self.payment_gateway = PaymentGateway()

    def get_product_page(self, product_id):
        data = {
            'product': self.get_product(product_id),
            'recommendations': self._safe_recommendations(product_id),
            'reviews': self._safe_reviews(product_id),
        }
        return data

    def _safe_recommendations(self, product_id):
        try:
            return self.recommendation_engine.get(product_id)
        except Exception as e:
            # Graceful degradation: return empty list
            log_error(f"Recommendation failed: {e}")
            return []  # Fallback: tidak ada rekomendasi

    def _safe_reviews(self, product_id):
        try:
            return self.review_system.get(product_id)
        except Exception as e:
            # Graceful degradation: return cached reviews
            cached = self._get_cached_reviews(product_id)
            if cached:
                return cached  # Fallback: cached data
            return []  # Fallback: tidak ada review

    def process_payment(self, order):
        # Try primary gateway
        try:
            return self.payment_gateway.primary.process(order)
        except Exception:
            # Fallback ke secondary gateway
            try:
                return self.payment_gateway.secondary.process(order)
            except Exception as e:
                # Semua gateway gagal
                raise PaymentFailedError(
                    "Semua payment gateway tidak tersedia"
                ) from e
```

---

## BAGIAN 5: Bulkhead Pattern

### Apa Itu Bulkhead Pattern?

Bulkhead pattern mengisolasi komponen sistem sehingga **kegagalan di satu area tidak menyebar** ke area lain. Nama ini berasal dari kapal — sekat-sekat di lambung kapal yang mencegah air masuk ke seluruh kapal jika ada kebocoran.

```
Bulkhead Pattern Concept:
═══════════════════════════════════════

Tanpa Bulkhead:
┌─────────────────────────────────────┐
│         Single Thread Pool          │
│  [Request A] [Request B] [Request C]│
│  [Request D] [Request E] [Request F]│
│                                     │
│  Jika Request A-E hang (timeout):   │
│  Semua thread terpakai → Request F  │
│  tidak bisa diproses → TOTAL CRASH  │
└─────────────────────────────────────┘

Dengan Bulkhead:
┌──────────────┬──────────────┬──────────────┐
│  Pool A      │  Pool B      │  Pool C      │
│  (Payment)   │  (Search)    │  (User)      │
│              │              │              │
│  [Req A]     │  [Req D]     │  [Req G]     │
│  [Req B]     │  [Req E]     │  [Req H]     │
│  [Req C]     │  [Req F]     │  [Req I]     │
│              │              │              │
│  Jika Pool A │  Pool B dan  │  Pool C      │
│  hang:       │  C masih     │  masih       │
│  Payment     │  normal!     │  normal!     │
│  down, tapi  │              │              │
│  Search dan  │              │              │
│  User tetap  │              │              │
│  berfungsi!  │              │              │
└──────────────┴──────────────┴──────────────┘
```

### Implementasi Bulkhead

```python
import concurrent.futures
from threading import Semaphore

class BulkheadExecutor:
    def __init__(self, service_name, max_concurrent):
        self.service_name = service_name
        self.semaphore = Semaphore(max_concurrent)
        self.executor = concurrent.futures.ThreadPoolExecutor(
            max_workers=max_concurrent
        )

    def execute(self, func, *args, **kwargs):
        if not self.semaphore.acquire(timeout=1):
            raise BulkheadFullError(
                f"{self.service_name}: "
                f"semua slot terpakai ({self.max_concurrent})"
            )
        try:
            future = self.executor.submit(func, *args, **kwargs)
            return future.result(timeout=30)
        finally:
            self.semaphore.release()

# Penggunaan:
payment_pool = BulkheadExecutor("payment", max_concurrent=10)
search_pool = BulkheadExecutor("search", max_concurrent=20)
user_pool = BulkheadExecutor("user", max_concurrent=15)

# Payment yang lambat tidak akan affect search dan user
try:
    result = payment_pool.execute(process_payment, order)
except BulkheadFullError:
    # Payment pool penuh, reject request baru
    return {"error": "Payment system busy, try again later"}
```

**Kapan pakai Bulkhead:**
- Sistem dengan banyak service/dependency
- Ada risiko satu service lambat mempengaruhi yang lain
- Butuh isolation antar fitur
- Microservices architecture

---

## BAGIAN 6: Retry Patterns

### Apa Itu Retry Pattern?

Retry pattern adalah strategi **mengulang operasi yang gagal** dengan asumsi bahwa kegagalan bersifat sementara (transient failure).

### 1. Simple Retry

```python
def simple_retry(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise  # Semua retry gagal
            # Retry lagi
            continue

Masalah: Retry langsung tanpa delay → bisa overload server
yang sedang struggling.
```

### 2. Retry dengan Fixed Delay

```python
import time

def fixed_delay_retry(func, max_retries=3, delay=1):
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            time.sleep(delay)  # Tunggu 1 detik antar retry

Masalah: Semua client retry bersamaan → "thundering herd" problem.
```

### 3. Retry dengan Exponential Backoff

**Definisi:** Delay antar retry **bertambah secara eksponensial**.

```
Exponential Backoff Timeline:
═══════════════════════════════════════

Attempt 1: FAIL → wait 1s  (base_delay * 2^0)
Attempt 2: FAIL → wait 2s  (base_delay * 2^1)
Attempt 3: FAIL → wait 4s  (base_delay * 2^2)
Attempt 4: FAIL → wait 8s  (base_delay * 2^3)
Attempt 5: FAIL → wait 16s (base_delay * 2^4) → MAX RETRIES

Delay = base_delay * (2 ^ attempt_number)

Visualisasi:
┌─────┬─────┬──────┬──────┬───────┬───────┐
│Try 1│Try 2│ Try 3│ Try 4│ Try 5 │ Try 6 │
│ 1s  │ 2s  │  4s  │  8s  │  16s  │  32s  │
└─────┴─────┴──────┴──────┴───────┴───────┘
  ↑       ↑        ↑         ↑
Delay makin lama → server punya waktu recover
```

```python
import time
import random

def exponential_backoff_retry(
    func,
    max_retries=5,
    base_delay=1,
    max_delay=60
):
    for attempt in range(max_retries):
        try:
            return func()
        except TransientError as e:
            if attempt == max_retries - 1:
                raise

            # Exponential backoff
            delay = min(base_delay * (2 ** attempt), max_delay)

            # Tambah jitter (lihat di bawah)
            delay = delay + random.uniform(0, delay * 0.1)

            print(f"Retry {attempt + 1}/{max_retries} "
                  f"after {delay:.2f}s")
            time.sleep(delay)
```

### 4. Exponential Backoff dengan Jitter

**Masalah tanpa Jitter:** Semua client retry bersamaan → thundering herd.

```
Thundering Herd Problem:
═══════════════════════════════════════

1000 client mengalami error bersamaan.
Semua pakai exponential backoff TANPA jitter.

T=0:    Semua client attempt 1 → FAIL
T=1:    Semua client attempt 2 → FAIL (retry bersamaan!)
T=3:    Semua client attempt 3 → FAIL (retry bersamaan!)
T=7:    Semua client attempt 4 → FAIL (retry bersamaan!)

Server mendapat spike request setiap retry → tidak pernah recover.

Dengan Jitter:
═══════════════════════════════════════

1000 client mengalami error bersamaan.
Semua pakai exponential backoff DENGAN jitter.

T=0:    Semua client attempt 1 → FAIL
T=1.0:  Client A retry (jitter: 1.0s)
T=1.3:  Client B retry (jitter: 1.3s)
T=1.7:  Client C retry (jitter: 1.7s)
T=2.1:  Client D retry (jitter: 2.1s)
...     Retry tersebar → server tidak overload!

Jitter = random delay yang ditambahkan ke backoff.
```

```python
import random
import time

def exponential_backoff_with_jitter(
    func,
    max_retries=5,
    base_delay=1,
    max_delay=60,
    jitter_factor=0.5
):
    for attempt in range(max_retries):
        try:
            return func()
        except TransientError as e:
            if attempt == max_retries - 1:
                raise

            # Exponential backoff
            delay = min(base_delay * (2 ** attempt), max_delay)

            # Full jitter: random antara 0 dan delay
            # delay = random.uniform(0, delay)

            # Equal jitter: setengah delay + random setengah
            jitter = delay * jitter_factor * random.random()
            delay = (delay / 2) + jitter

            print(f"Retry {attempt + 1}/{max_retries} "
                  f"after {delay:.2f}s")
            time.sleep(delay)
```

**Jenis-jenis Jitter:**

| Jenis | Formula | Karakteristik |
|---|---|---|
| No Jitter | `base * 2^attempt` | Semua retry bersamaan |
| Full Jitter | `random(0, base * 2^attempt)` | Retry sangat tersebar |
| Equal Jitter | `(base * 2^attempt)/2 + random(0, half)` | Balance antara retry cepat dan tersebar |
| Decorrelated Jitter | `random(base, prev_delay * 3)` | AWS recommended |

### Kapan Retry dan Kapan Tidak

```
RETRY jika error bersifat transient:
✅ Network timeout
✅ Connection refused (sementara)
✅ HTTP 503 Service Unavailable
✅ HTTP 429 Too Many Requests
✅ Database deadlock
✅ Rate limit exceeded

JANGAN RETRY jika error bersifat permanent:
❌ HTTP 400 Bad Request (client error)
❌ HTTP 401 Unauthorized (auth salah)
❌ HTTP 404 Not Found (resource tidak ada)
❌ HTTP 422 Unprocessable Entity (data invalid)
❌ Validation error
❌ Out of memory (perlu restart, bukan retry)
```

---

## BAGIAN 7: Circuit Breaker Pattern

### Apa Itu Circuit Breaker?

Circuit breaker pattern **mencegah aplikasi terus-menerus memanggil service yang sedang down**. Seperti circuit breaker di listrik — jika ada korsleting, breaker "trip" dan memutus aliran untuk mencegah kerusakan lebih lanjut.

### 3 State Circuit Breaker

```
Circuit Breaker State Machine:
═══════════════════════════════════════

        ┌─────────────────────────────────────┐
        │                                     │
        │    ┌──────────┐                     │
        │    │          │                     │
        │    │  CLOSED  │ ── error threshold ─→│
        │    │  (Normal)│      exceeded       │
        │    │          │                     │
        │    └────┬─────┘                     │
        │         │                           │
        │         │ trip!                     │
        │         ↓                           │
        │    ┌──────────┐                     │
        │    │          │                     │
        │    │   OPEN   │ ── timeout ────────→│
        │    │ (Fail    │    elapsed          │
        │    │  fast)   │                     │
        │    │          │                     │
        │    └────┬─────┘                     │
        │         │                           │
        │         │ half-open test            │
        │         ↓                           │
        │    ┌──────────┐                     │
        │    │          │                     │
        │    │ HALF_OPEN│                     │
        │    │ (Test    │                     │
        │    │  water)  │                     │
        │    │          │                     │
        │    └────┬─────┘                     │
        │         │                           │
        │    ┌────┴─────┐                     │
        │    │          │                     │
        │  Success    Failure                 │
        │    │          │                     │
        │    ↓          ↓                     │
        │  CLOSED     OPEN                    │
        │                                     │
        └─────────────────────────────────────┘
```

### Penjelasan Setiap State

```
State 1: CLOSED (Normal Operation)
═══════════════════════════════════════

Circuit breaker CLOSED = semua request boleh lewat.

┌─────────────────────────────────────┐
│  [Client] ── request ──→ [Service]  │
│                            ↑        │
│  Circuit Breaker: CLOSED   │        │
│  Error count: 0/5          │        │
│  Status: Normal operation  │        │
└─────────────────────────────────────┘

Setiap error meningkatkan error count.
Jika error count >= threshold → TRIP → state jadi OPEN.

State 2: OPEN (Fail Fast)
═══════════════════════════════════════

Circuit breaker OPEN = semua request DITOLAK langsung.

┌─────────────────────────────────────┐
│  [Client] ── request ──→ ❌ REJECT  │
│                            ↑        │
│  Circuit Breaker: OPEN     │        │
│  Error count: 5/5          │        │
│  Status: Failing fast      │        │
│  Timeout: 30s remaining    │        │
└─────────────────────────────────────┘

Request tidak pernah sampai ke service yang down.
Ini melindungi service dari overload dan client dari timeout.

Setelah timeout elapsed → state jadi HALF_OPEN.

State 3: HALF_OPEN (Test the Water)
═══════════════════════════════════════

Circuit breaker HALF_OPEN = request terbatas boleh lewat untuk test.

┌─────────────────────────────────────┐
│  [Client] ── request ──→ [Service]  │
│  (hanya 1 request)         ↑        │
│  Circuit Breaker: HALF_OPEN│        │
│  Status: Testing recovery  │        │
└─────────────────────────────────────┘

Hanya 1 (atau beberapa) request yang boleh lewat.
- Jika request SUKSES → service sudah recover → state jadi CLOSED
- Jika request GAGAL → service masih down → state jadi OPEN lagi
```

### Implementasi Circuit Breaker

```python
import time
from enum import Enum

class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

class CircuitBreaker:
    def __init__(
        self,
        failure_threshold=5,
        recovery_timeout=30,
        half_open_max_calls=1
    ):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.half_open_max_calls = half_open_max_calls

        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.last_failure_time = None
        self.half_open_calls = 0

    def call(self, func, *args, **kwargs):
        if self.state == CircuitState.OPEN:
            if self._should_attempt_reset():
                self.state = CircuitState.HALF_OPEN
                self.half_open_calls = 0
            else:
                raise CircuitBreakerOpenError(
                    "Circuit breaker is OPEN, failing fast"
                )

        if self.state == CircuitState.HALF_OPEN:
            if self.half_open_calls >= self.half_open_max_calls:
                raise CircuitBreakerOpenError(
                    "Circuit breaker is HALF_OPEN, "
                    "max test calls reached"
                )
            self.half_open_calls += 1

        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise

    def _on_success(self):
        self.failure_count = 0
        self.state = CircuitState.CLOSED
        self.half_open_calls = 0

    def _on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()

        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN

    def _should_attempt_reset(self):
        if self.last_failure_time is None:
            return True
        elapsed = time.time() - self.last_failure_time
        return elapsed >= self.recovery_timeout

# Custom exception
class CircuitBreakerOpenError(Exception):
    pass
```

### Circuit Breaker dengan Monitoring

```python
class CircuitBreakerWithMetrics(CircuitBreaker):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.total_calls = 0
        self.total_failures = 0
        self.total_successes = 0
        self.total_rejected = 0

    def call(self, func, *args, **kwargs):
        self.total_calls += 1
        try:
            result = super().call(func, *args, **kwargs)
            self.total_successes += 1
            return result
        except CircuitBreakerOpenError:
            self.total_rejected += 1
            raise
        except Exception:
            self.total_failures += 1
            raise

    def get_metrics(self):
        return {
            'state': self.state.value,
            'failure_count': self.failure_count,
            'total_calls': self.total_calls,
            'total_failures': self.total_failures,
            'total_successes': self.total_successes,
            'total_rejected': self.total_rejected,
            'failure_rate': (
                self.total_failures / self.total_calls
                if self.total_calls > 0 else 0
            ),
        }

# Circuit breaker per service
payment_cb = CircuitBreakerWithMetrics(
    failure_threshold=5,
    recovery_timeout=30
)

search_cb = CircuitBreakerWithMetrics(
    failure_threshold=10,
    recovery_timeout=60
)

# Monitoring dashboard
def monitor_circuit_breakers():
    breakers = {
        'payment': payment_cb,
        'search': search_cb,
    }
    for name, cb in breakers.items():
        metrics = cb.get_metrics()
        print(f"{name}: {metrics}")
```

### Circuit Breaker di Dunia Nyata

```
Contoh: E-Commerce saat Flash Sale
═══════════════════════════════════════

Flash Sale dimulai → traffic melonjak 10x lipat.

Inventory Service kewalahan → response time naik → timeout.

Tanpa Circuit Breaker:
- Semua request ke Inventory Service timeout (30s each)
- Thread pool penuh → semua fitur affected
- Checkout, Search, User Profile semua lambat
- TOTAL SYSTEM MELTDOWN

Dengan Circuit Breaker:
- Inventory Service mulai timeout → error count naik
- Setelah 5 error → Circuit Breaker OPEN
- Request ke Inventory Service langsung reject (fail fast)
- Checkout: "Stok sedang tidak bisa dicek, coba lagi nanti"
- Fitur lain (Search, User Profile) tetap normal
- Inventory Service punya waktu recover
- Setelah 30s → HALF_OPEN → test request → SUKSES → CLOSED
- Sistem kembali normal
```

---

## BAGIAN 8: Rate Limiting Patterns

### Apa Itu Rate Limiting?

Rate limiting adalah mekanisme **membatasi jumlah request** yang bisa diproses dalam periode waktu tertentu. Ini melindungi sistem dari overload, abuse, dan memastikan fair usage.

### 1. Token Bucket

**Definisi:** Request butuh "token" untuk diproses. Token diisi ulang secara berkala. Jika token habis, request ditolak.

```
Token Bucket Algorithm:
═══════════════════════════════════════

Bucket capacity: 10 tokens
Refill rate: 1 token per detik

Initial state:
┌──────────────────┐
│ 🪙🪙🪙🪙🪙🪙🪙🪙🪙🪙 │  ← 10 tokens (full)
└──────────────────┘

Request 1: consume 1 token → 9 tokens left ✅
Request 2: consume 1 token → 8 tokens left ✅
Request 3: consume 1 token → 7 tokens left ✅
...
Request 10: consume 1 token → 0 tokens left ✅
Request 11: NO TOKENS → REJECTED ❌

Setelah 1 detik: refill 1 token → 1 token
Request 12: consume 1 token → 0 tokens left ✅

Visualisasi:
┌─────────────────────────────────────┐
│         Token Bucket                │
│                                     │
│  [Request] ──→ [Bucket] ──→ [API]  │
│                │                    │
│           [Refill Timer]            │
│           (1 token/detik)           │
│                                     │
│  Jika bucket kosong → REJECT        │
└─────────────────────────────────────┘

Kelebihan Token Bucket:
- Burst traffic diperbolehkan (selama ada token)
- Smooth rate limiting
- Sederhana untuk diimplementasi
```

```python
import time
import threading

class TokenBucket:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate  # tokens per second
        self.last_refill = time.time()
        self.lock = threading.Lock()

    def consume(self, tokens=1):
        with self.lock:
            self._refill()
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True
            return False

    def _refill(self):
        now = time.time()
        elapsed = now - self.last_refill
        new_tokens = elapsed * self.refill_rate
        self.tokens = min(self.capacity, self.tokens + new_tokens)
        self.last_refill = now

# Penggunaan:
bucket = TokenBucket(capacity=100, refill_rate=10)  # 10 req/detik

def handle_request(request):
    if not bucket.consume():
        return {"error": "Rate limit exceeded", "status": 429}
    return process_request(request)
```

### 2. Sliding Window

**Definisi:** Hitung request dalam window waktu yang "bergerak" (bukan fixed window).

```
Fixed Window vs Sliding Window:
═══════════════════════════════════════

Fixed Window (100 req/menit):
┌─────────┬─────────┬─────────┐
│ 00:00   │ 00:01   │ 00:02   │
│ 100 req │ 100 req │ 100 req │
└─────────┴─────────┴─────────┘

Masalah: 100 req di 00:59 + 100 req di 01:00 = 200 req dalam 1 menit!

Sliding Window:
═══════════════════════════════════════

Sekarang: 01:30
Window: 00:30 - 01:30 (60 detik terakhir)

Hitung semua request dalam 60 detik terakhir.
Jika count >= limit → REJECT.

┌─────────────────────────────────────┐
│ 00:30          01:00          01:30 │
│  │──────────────│──────────────│    │
│  ←─────── 60 detik window ──────→   │
│                                     │
│  Count request dalam window ini     │
└─────────────────────────────────────┘

Kelebihan Sliding Window:
- Lebih akurat dari fixed window
- Tidak ada "boundary spike" problem
```

```python
from collections import deque
import time
import threading

class SlidingWindowRateLimiter:
    def __init__(self, max_requests, window_seconds):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = deque()
        self.lock = threading.Lock()

    def allow_request(self):
        with self.lock:
            now = time.time()
            # Hapus request yang sudah keluar dari window
            while self.requests and self.requests[0] <= now - self.window_seconds:
                self.requests.popleft()

            if len(self.requests) < self.max_requests:
                self.requests.append(now)
                return True
            return False

# Penggunaan:
limiter = SlidingWindowRateLimiter(
    max_requests=100,
    window_seconds=60
)  # 100 req per 60 detik

def handle_request(request):
    if not limiter.allow_request():
        return {"error": "Rate limit exceeded", "status": 429}
    return process_request(request)
```

### 3. Leaky Bucket

**Definisi:** Request masuk ke "bucket" dan "diproses" dengan rate yang konstan. Jika bucket penuh, request baru ditolak.

```
Leaky Bucket Algorithm:
═══════════════════════════════════════

Bucket capacity: 10 requests
Processing rate: 1 request per detik

Request masuk (bisa burst):
┌──────────────────┐
│ Request 1 ──→    │
│ Request 2 ──→    │
│ Request 3 ──→    │  ← Semua masuk bucket
│ ...              │
│ Request 10 ──→   │
└────────┬─────────┘
         │
         │ 1 req/detik (konstan)
         ↓
    [Processor]

Request 11: Bucket penuh → REJECTED ❌

Perbedaan Token Bucket vs Leaky Bucket:
═══════════════════════════════════════

Token Bucket:
- Output bisa burst (selama ada token)
- Smooth input, bursty output

Leaky Bucket:
- Output SELALU konstan (smooth)
- Bursty input, smooth output

Leaky Bucket cocok untuk:
- Traffic shaping (meratakan traffic)
- Mencegah burst ke downstream service
- Rate limiting yang ketat
```

```python
import time
import threading
from collections import deque

class LeakyBucket:
    def __init__(self, capacity, leak_rate):
        self.capacity = capacity
        self.leak_rate = leak_rate  # requests per second
        self.queue = deque()
        self.last_leak = time.time()
        self.lock = threading.Lock()

    def add_request(self):
        with self.lock:
            self._leak()
            if len(self.queue) < self.capacity:
                self.queue.append(time.time())
                return True
            return False

    def _leak(self):
        now = time.time()
        elapsed = now - self.last_leak
        leaked = int(elapsed * self.leak_rate)
        for _ in range(min(leaked, len(self.queue))):
            self.queue.popleft()
        self.last_leak = now

    def process_next(self):
        with self.lock:
            self._leak()
            if self.queue:
                return self.queue.popleft()
            return None
```

### Perbandingan Rate Limiting Algorithms

| Aspek | Token Bucket | Sliding Window | Leaky Bucket |
|---|---|---|---|
| Burst handling | ✅ Allow burst | ✅ Smooth | ❌ No burst |
| Output pattern | Bursty | Smooth | Smooth |
| Memory usage | O(1) | O(n) | O(n) |
| Implementasi | Sederhana | Sedang | Sedang |
| Use case | API rate limit | Accurate limiting | Traffic shaping |

---

## BAGIAN 9: Chaos Engineering

### Apa Itu Chaos Engineering?

Chaos engineering adalah **praktik proaktif menguji ketahanan sistem** dengan sengaja memperkenalkan kegagalan (failure) di production atau staging environment. Tujuannya: menemukan weakness SEBELUM failure terjadi secara alami.

### Prinsip Chaos Engineering

```
Chaos Engineering Workflow:
═══════════════════════════════════════

1. Define "Steady State"
   → Apa metrik yang menunjukkan sistem "normal"?
   → Contoh: error rate < 1%, latency p99 < 200ms

2. Hypothesize
   → "Jika server A down, sistem tetap berfungsi"
   → "Jika database latency naik 3x, circuit breaker akan trip"

3. Introduce Failure
   → Kill server A
   → Inject network latency
   → Fill disk space
   → Corrupt random packets

4. Observe
   → Apakah steady state terjaga?
   → Apakah failover berjalan?
   → Apakah alert ter-trigger?

5. Learn and Improve
   → Fix weakness yang ditemukan
   → Update runbook
   → Ulangi dengan experiment baru
```

### Contoh Chaos Experiments

```
Experiment 1: Kill Random Instance
═══════════════════════════════════════

Setup: 4 server active-active di belakang load balancer.

Hypothesis: Jika 1 server mati, 3 server lain handle traffic.
Steady state: error rate < 1%, latency p99 < 200ms.

Action: Kill server 2 (SIGKILL).

Expected result:
- Load balancer detect server 2 down (health check fail)
- Traffic redirect ke server 1, 3, 4
- Error rate spike sebentar (< 5 detik), lalu kembali normal
- Alert ter-trigger: "Server 2 down"

Actual result:
- ✅ Load balancer detect dalam 3 detik
- ✅ Traffic redirect berhasil
- ✅ Error rate spike ke 2% selama 5 detik, lalu 0.1%
- ✅ Alert ter-trigger
- ✅ Hypothesis CONFIRMED

Experiment 2: Database Latency Injection
═══════════════════════════════════════

Setup: Database dengan read replica.

Hypothesis: Jika database latency > 5 detik, circuit breaker trip.
Steady state: query latency p99 < 100ms.

Action: Inject 5 detik latency ke semua database query.

Expected result:
- Query latency naik ke > 5 detik
- Circuit breaker trip setelah 5 failures
- Request ke database langsung reject (fail fast)
- Graceful degradation: fitur non-kritis dimatikan

Actual result:
- ✅ Query latency naik ke 5 detik
- ✅ Circuit breaker trip setelah 5 failures (30 detik)
- ⚠️ Request tidak langsung reject (ada timeout 30s per request)
- ⚠️ Thread pool penuh sebelum circuit breaker trip
- ❌ Hypothesis PARTIALLY FAILED

Fix: Turunkan query timeout dari 30s ke 3s.
     Circuit breaker akan trip lebih cepat.

Experiment 3: Network Partition
═══════════════════════════════════════

Setup: 2 data center (Jakarta, Singapore).

Hypothesis: Jika network antar DC putus, masing-masing DC tetap berfungsi.
Steady state: kedua DC serve traffic.

Action: Block semua traffic antara Jakarta dan Singapore (iptables DROP).

Expected result:
- Jakarta DC: tetap serve user Jakarta
- Singapore DC: tetap serve user Singapore
- Data sync berhenti (eventual consistency)
- Saat network pulih, data sync resume

Actual result:
- ✅ Jakarta DC tetap berfungsi
- ✅ Singapore DC tetap berfungsi
- ⚠️ Ada konflik data saat sync resume (concurrent writes)
- ⚠️ Conflict resolution butuh manual intervention
- ❌ Hypothesis PARTIALLY FAILED

Fix: Implement CRDT untuk data yang bisa di-write di kedua DC.
     Atau: designate 1 DC sebagai primary untuk write.
```

### Tools Chaos Engineering

| Tool | Deskripsi | Use Case |
|---|---|---|
| Chaos Monkey (Netflix) | Random kill instances | Test resilience |
| Gremlin | Commercial chaos platform | Full experiment suite |
| Pumba | Container chaos testing | Docker/Kubernetes |
| toxiproxy | Network condition simulation | Latency, drop, throttle |
| Litmus | Kubernetes-native chaos | K8s workloads |

### Chaos Engineering Best Practices

```
Best Practices:
═══════════════════════════════════════

1. Mulai di staging, baru production
   - Test di staging dulu
   - Setelah confident, test di production
   - Mulai dengan blast radius kecil (1 instance)

2. Selalu punya "kill switch"
   - Bisa stop experiment kapan saja
   - Auto-stop jika metrik melewati threshold

3. Notify team sebelum experiment
   - Jangan chaos tanpa告知 team
   - Buat schedule experiment

4. Monitor selama experiment
   - Dashboard real-time
   - Alert jika steady state violated

5. Document dan share learnings
   - Catat setiap experiment
   - Share findings ke seluruh team
   - Update runbook berdasarkan learnings

6. Automasi experiment
   - Jadwalkan experiment rutin
   - Integrasi ke CI/CD pipeline
   - Chaos testing sebagai bagian dari testing strategy
```

---

## 🎯 CONTOH NYATA

### Contoh 1: Website Sekolah (Active-Passive)

**Setup:**
- Server utama di hosting A
- Server cadangan di hosting B
- Jika server A down, DNS diarahkan ke server B

**Kenapa Active-Passive:**
- Traffic kecil, tidak perlu banyak server aktif
- Biaya lebih murah (server cadangan bisa spec lebih rendah)
- Sederhana untuk dikelola

### Contoh 2: Tokopedia (Active-Active)

**Setup:**
- Ratusan server aktif di multiple data center
- Load balancer mendistribusikan traffic
- Jika 1 data center down, traffic dialihkan ke data center lain

**Kenapa Active-Active:**
- Traffic besar, butuh banyak server
- Downtime = rugi jutaan per menit
- User tersebar di seluruh Indonesia

### Contoh 3: Database Sekolah (Master-Slave)

**Setup:**
- 1 master database untuk write (input nilai, absensi)
- 2 slave database untuk read (lihat rapor, lihat absensi)
- Orang tua siswa baca dari slave, guru tulis ke master

**Kenapa Master-Slave:**
- Read jauh lebih banyak daripada write
- Slave bisa handle banyak pembaca bersamaan
- Master tidak terbebani oleh read request

### Contoh 4: API Gateway dengan Circuit Breaker

```
Arsitektur:
═══════════════════════════════════════

[Client] → [API Gateway] → [Service A] (Payment)
                        → [Service B] (Search)
                        → [Service C] (User)

Circuit Breaker per service:
- Payment CB: threshold=5, timeout=30s
- Search CB: threshold=10, timeout=60s
- User CB: threshold=3, timeout=15s

Jika Payment Service down:
- Payment CB trip setelah 5 error
- Request ke Payment langsung reject
- Client dapat: "Payment temporarily unavailable"
- Search dan User tetap normal
```

---

## 💡 PRAKTIK

### Latihan 1: Desain Fail-over

Desain fail-over untuk sistem berikut:

1. Server absensi sekolah
2. Website informasi sekolah
3. Database nilai siswa

Tentukan:
- Active-Passive atau Active-Active?
- Hot atau Cold standby?
- Berapa banyak server?

### Latihan 2: Hitung Availability

Hitung availability total:

1. Sistem dengan 3 komponen berurutan, masing-masing 99.9%
2. Sistem dengan 3 komponen paralel, masing-masing 99.9%
3. Berapa downtime per tahun untuk sistem dengan 99.95% availability?

**Jawaban:**
1. 99.9% × 99.9% × 99.9% = 99.7% → downtime ~26 jam/tahun
2. 1 - (0.001 × 0.001 × 0.001) = 99.9999999% → downtime ~0.03 detik/tahun
3. 99.95% → downtime ~4.38 jam/tahun

### Latihan 3: Desain Circuit Breaker

Desain circuit breaker untuk:
1. Payment gateway (kritis, harus fail fast)
2. Recommendation engine (non-kritis, bisa tolerate lebih lama)
3. External API (rate limited, butuh backoff)

Tentukan threshold, timeout, dan fallback untuk masing-masing.

### Latihan 4: Rate Limiting Design

Desain rate limiting untuk API publik:
- Free tier: 100 req/jam
- Pro tier: 1000 req/jam
- Enterprise tier: 10000 req/jam

Algorithm mana yang cocok? Bagaimana implementasinya?

---

## ✅ CHECKLIST

- [ ] Bisa menjelaskan perbedaan active-passive vs active-active
- [ ] Paham konsep heartbeat dan fail-over
- [ ] Bisa menjelaskan master-slave vs master-master replication
- [ ] Mengerti cara menghitung availability dalam "jumlah 9"
- [ ] Paham rumus availability untuk komponen sequence vs parallel
- [ ] Bisa mendesain fail-over untuk kasus sederhana
- [ ] Paham N+1 dan 2N redundancy patterns
- [ ] Mengerti perbedaan automatic, semi-automatic, dan manual failover
- [ ] Bisa mendesain health check yang efektif
- [ ] Paham graceful degradation dan kapan menggunakannya
- [ ] Mengerti bulkhead pattern dan implementasinya
- [ ] Bisa implementasi retry dengan exponential backoff dan jitter
- [ ] Paham circuit breaker pattern (3 states)
- [ ] Mengerti perbedaan token bucket, sliding window, dan leaky bucket
- [ ] Paham prinsip chaos engineering dan bisa mendesain experiment

---

## 🔗 REFERENSI

- **Repo Asli:** [donnemartin/system-design-primer — Availability Patterns](https://github.com/donnemartin/system-design-primer#availability-patterns)
- **Artikel:** [Scalability, Availability, Stability, Patterns](http://www.slideshare.net/jboner/scalability-availability-stability-patterns/)
- **Circuit Breaker:** [Release It! by Michael Nygard](https://pragprog.com/book/mnee2/release-it-second-edition)
- **Chaos Engineering:** [Principles of Chaos Engineering](https://principlesofchaos.org/)
- **Netflix Chaos Monkey:** [GitHub - Netflix/chaosmonkey](https://github.com/Netflix/chaosmonkey)
- **Rate Limiting:** [Stripe Rate Limiting](https://stripe.com/docs/rate-limits)
- **Resilience4j:** [GitHub - resilience4j/resilience4j](https://github.com/resilience4j/resilience4j)

---

> **Lanjut ke:** [`07-dns.md`](./07-dns.md)