# 03 — Latency vs Throughput

> **Estimasi:** 1.5 jam | **Level:** Pemula → Menengah

---

## 📖 TEORI

### Definisi Fundamental

**Latency** dan **Throughput** adalah dua metrik fundamental untuk mengukur performa sistem. Memahami keduanya adalah kunci untuk membuat keputusan arsitektur yang tepat.

| Konsep | Definisi | Satuan | Pertanyaan yang Dijawab |
|---|---|---|---|
| **Latency** | Waktu untuk menyelesaikan 1 operasi | ms, μs, ns | "Berapa lama 1 request diproses?" |
| **Throughput** | Jumlah operasi per satuan waktu | req/s, ops/s, MB/s | "Berapa banyak request yang bisa diproses per detik?" |

### Analogi Tol yang Mendalam

Bayangkan jalan tol dengan gerbang masuk dan keluar:

```
                    JALAN TOL 4 LAJUR
    ════════════════════════════════════════════════
    ║  ┌──┐  ┌──┐  ┌──┐  ┌──┐                     ║
    ║  │🚗│  │🚗│  │🚗│  │🚗│  ← 4 mobil sejajar  ║
    ║  └──┘  └──┘  └──┘  └──┘                     ║
    ════════════════════════════════════════════════
    ↑                                        ↑
  Gerbang Masuk                          Gerbang Keluar
```

**Latency:** Waktu 1 mobil dari gerbang masuk ke gerbang keluar.
- Mobil A: 30 menit (latency rendah = bagus)
- Mobil B: 60 menit (latency tinggi = buruk)

**Throughput:** Jumlah mobil yang melewati tol per jam.
- Tol 1 lajur: 600 mobil/jam (throughput rendah)
- Tol 4 lajur: 2.400 mobil/jam (throughput tinggi)

**Hubungan yang sering disalahpahami:**
- Latency rendah + throughput rendah = 1 mobil cepat, tapi cuma 1 lajur
- Latency tinggi + throughput tinggi = banyak mobil, tapi masing-masing lama
- Latency rendah + throughput tinggi = ideal, tapi mahal/kompleks
- Latency tinggi + throughput rendah = worst case, harus dihindari

### Dalam Konteks Aplikasi Web

```
Latency (waktu tunggu user):
┌──────────┐    DNS     ┌──────────┐    TCP     ┌──────────┐
│  Browser  │ ────────→ │   DNS    │ ────────→ │  Server  │
│          │ ←──────── │  Server  │ ←──────── │          │
└──────────┘   20ms     └──────────┘   50ms     └──────────┘
     ↑                                              ↑
     │                                              │
     └────────── Total Latency = 270ms ─────────────┘

    Rincian:
    - DNS lookup:        20ms
    - TCP handshake:     50ms
    - Server processing: 150ms
    - Network transfer:  50ms
    ─────────────────────────
    Total:              270ms

Throughput (kapasitas server):
┌──────────────────────────────────────────────┐
│              Load Balancer                    │
│                  │                            │
│     ┌────────────┼────────────┐               │
│     ▼            ▼            ▼               │
│  ┌──────┐   ┌──────┐   ┌──────┐              │
│  │ Srv 1│   │ Srv 2│   │ Srv 3│              │
│  │ 500r/s│  │ 500r/s│  │ 500r/s│             │
│  └──────┘   └──────┘   └──────┘              │
│                                                │
│  Total Throughput = 1.500 request/detik       │
└──────────────────────────────────────────────┘
```

---

## ⚡ LATENCY NUMBERS — HARDWARE DEEP DIVE

### Hierarki Memory: Pyramid of Speed

Ini adalah angka yang **WAJIB** dipahami setiap engineer. Angka ini menunjukkan realita fisik hardware yang mendasari semua keputusan arsitektur software.

```
                    PYRAMID MEMORY HIERARCHY

                          ▲
                         / \
                        /   \
                       / L1  \       0.5 ns     ~64 KB
                      / Cache \                (per core)
                     /─────────\
                    /    L2     \     7 ns      ~256 KB-1 MB
                   /   Cache     \              (per core)
                  /───────────────\
                 /       L3        \   25 ns    ~8-64 MB
                /      Cache        \            (shared)
               /─────────────────────\
              /    Main Memory (RAM)   \  100 ns   ~8-256 GB
             /──────────────────────────\
            /    SSD (NVMe/SATA)         \ 150μs    ~256GB-4TB
           /──────────────────────────────\
          /    Hard Disk (HDD)             \ 10ms    ~1-20 TB
         /──────────────────────────────────\
        /    Network (Same Datacenter)       \ 500μs
       /──────────────────────────────────────\
      /    Network (Cross Continent)           \ 150ms
     /──────────────────────────────────────────\
```

### Tabel Latency Lengkap dengan Konteks

| Operasi | Waktu | Perbandingan | Konteks Nyata |
|---|---|---|---|
| **L1 cache reference** | 0.5 ns | 1x | CPU ambil data dari cache terdekat |
| **Branch misprediction** | 5 ns | 10x L1 | CPU salah tebak kondisi if/else |
| **L2 cache reference** | 7 ns | 14x L1 | CPU ambil data dari cache level 2 |
| **L3 cache reference** | 25 ns | 50x L1 | CPU ambil data dari cache shared |
| **Mutex lock/unlock** | 25 ns | 50x L1 | Thread synchronization |
| **Main memory (RAM)** | 100 ns | 200x L1 | CPU ambil data dari RAM |
| **Compress 1KB (Zippy)** | 3.000 ns | 6.000x L1 | Kompresi data 1KB |
| **Send 1KB over 1 Gbps** | 10.000 ns | 20.000x L1 | Kirim 1KB via jaringan cepat |
| **Read 4K random from SSD** | 150.000 ns | 300.000x L1 | SSD random read (NVMe) |
| **Read 1MB seq from memory** | 250.000 ns | 500.000x L1 | Baca 1MB berurutan dari RAM |
| **Round trip same DC** | 500.000 ns | 1.000.000x L1 | Server A ke Server B (1 gedung) |
| **Read 1MB seq from SSD** | 1.000.000 ns | 2.000.000x L1 | Baca 1MB berurutan dari SSD |
| **Disk seek (HDD)** | 10.000.000 ns | 20.000.000x L1 | HDD cari posisi data |
| **Read 1MB seq from disk** | 20.000.000 ns | 40.000.000x L1 | Baca 1MB berurutan dari HDD |
| **Send packet CA→NL→CA** | 150.000.000 ns | 300.000.000x L1 | Round trip antar benua |

### Visualisasi Perbandingan dalam Skala Waktu Manusia

Untuk memahami betapa besarnya perbedaan ini, bayangkan jika **1 ns = 1 detik**:

| Operasi | Waktu Relatif | Dalam Kehidupan Nyata |
|---|---|---|
| L1 cache | 1 detik | Berkedip |
| L2 cache | 7 detik | Tarik napas |
| L3 cache | 25 detik | Iklan TV singkat |
| RAM | 100 detik | ~2 menit, buat kopi |
| SSD | 1.7 hari | Perjalanan Jakarta-Bandung PP |
| Same DC network | 5.8 hari | Seminggu kerja |
| HDD | 116 hari | ~4 bulan |
| Cross continent | 4.7 tahun | Masa kuliah S1 |

**Pelajaran fundamental:**
- **Memory access** ~100x lebih lambat dari L1 cache → makanya cache penting
- **SSD access** ~1.500x lebih lambat dari RAM → makanya in-memory database cepat
- **Disk access** ~100.000x lebih lambat dari RAM → makanya I/O bottleneck
- **Network call** ~1.000.000x lebih lambat dari RAM → makanya microservices punya overhead

### Implikasi untuk Desain Sistem

```
┌────────────────────────────────────────────────────────────┐
│                    IMPLIKASI DESAIN                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  1. CACHE DI MEMORY > BACA DARI DISK                       │
│     Redis/Memcached di RAM:     100 ns                     │
│     Baca dari HDD:          10.000.000 ns                  │
│     Perbedaan: 100.000x lebih cepat!                       │
│                                                            │
│  2. KURANGI NETWORK CALL                                   │
│     Local function call:         ~1 ns                     │
│     Network call (same DC):    500.000 ns                  │
│     Perbedaan: 500.000x lebih lambat!                      │
│     Solusi: Colocate services yang sering berkomunikasi    │
│                                                            │
│  3. BATCH REQUEST > REQUEST SATU-SATU                      │
│     100 request × 1ms latency = 100ms total               │
│     1 batch request × 5ms = 5ms total                     │
│     Perbedaan: 20x lebih cepat!                            │
│                                                            │
│  4. SEQUENTIAL ACCESS > RANDOM ACCESS                      │
│     SSD sequential read:  ~500 MB/s                        │
│     SSD random read:      ~10.000 IOPS × 4KB = 40 MB/s    │
│     Perbedaan: 12x lebih cepat!                            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 📊 THROUGHPUT MEASUREMENT

### Cara Mengukur Throughput

Throughput diukur dengan berbagai metrik tergantung konteks:

```
┌─────────────────────────────────────────────────────────────┐
│                    METRIK THROUGHPUT                         │
├──────────────────────┬──────────────────┬───────────────────┤
│ Konteks              │ Metrik           │ Contoh            │
├──────────────────────┼──────────────────┼───────────────────┤
│ Web Server           | req/s (RPS)      | 10.000 req/s      │
│ Database             | queries/s (QPS)  | 50.000 QPS        │
│ Network              | bits/s (bps)     | 1 Gbps            │
│ Disk                 | IOPS             | 100.000 IOPS      │
│                      | MB/s             | 500 MB/s          │
│ CPU                  | instructions/s   | 3 GHz = 3B/s      │
│ Message Queue        | messages/s       | 1.000.000 msg/s   │
└──────────────────────┴──────────────────┴───────────────────┘
```

### Little's Law: Hubungan Matematis Latency dan Throughput

**Little's Law** adalah hukum fundamental dari queuing theory yang menghubungkan 3 variabel:

```
                    L = λ × W

    Dimana:
    L = Jumlah rata-rata item dalam sistem (concurrency)
    λ = Throughput (arrival rate, item per detik)
    W = Latency rata-rata per item (waktu dalam sistem)

    Atau dalam konteks web server:

    Concurrent Requests = RPS × Average Latency
```

### Bukti Intuitif Little's Law

```
Bayangkan restoran dengan 20 meja:
- Rata-rata makan per meja: 30 menit (W = 0.5 jam)
- Restoran melayani 40 pelanggan per jam (λ = 40)

Berapa meja yang terisi rata-rata?
L = λ × W = 40 × 0.5 = 20 meja ✅

Sekarang bayangkan server web:
- Average latency: 200ms (W = 0.2 detik)
- Server handle 500 req/s (λ = 500)

Berapa concurrent request?
L = 500 × 0.2 = 100 concurrent request

Artinya server perlu kapasitas untuk handle 100 request bersamaan.
```

### Aplikasi Little's Law dalam Capacity Planning

```python
# Contoh: Hitung berapa server yang dibutuhkan

def calculate_servers_needed(rps, avg_latency_ms, capacity_per_server):
    """
    Hitung jumlah server berdasarkan Little's Law.

    Args:
        rps: Request per second (throughput yang dibutuhkan)
        avg_latency_ms: Rata-rata latency per request dalam milidetik
        capacity_per_server: Max concurrent request per server

    Returns:
        Jumlah server yang dibutuhkan
    """
    # Concurrent requests = RPS × latency (dalam detik)
    concurrent_requests = rps * (avg_latency_ms / 1000)

    # Server needed = total concurrent / capacity per server
    import math
    servers_needed = math.ceil(concurrent_requests / capacity_per_server)

    return servers_needed

# Contoh nyata: SD Negeri Pasirhalang
# Asumsi: 500 guru/orang tua akses bersamaan saat jam absensi
# Latency rata-rata: 200ms
# Setiap server bisa handle 100 concurrent request

servers = calculate_servers_needed(
    rps=500,
    avg_latency_ms=200,
    capacity_per_server=100
)
print(f"Server dibutuhkan: {servers}")  # Output: 1

# Contoh: Sistem besar seperti Tokopedia saat flash sale
# 50.000 req/s, latency 100ms, per server 500 concurrent
servers = calculate_servers_needed(
    rps=50000,
    avg_latency_ms=100,
    capacity_per_server=500
)
print(f"Server dibutuhkan: {servers}")  # Output: 10
```

### Pipeline Parallelism

Pipeline parallelism adalah teknik memecah proses menjadi beberapa tahap yang berjalan bersamaan, seperti assembly line di pabrik.

```
                    PIPELINE PARALLELISM

    Tanpa Pipeline (Sequential):
    ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐
    │Stage│→ │Stage│→ │Stage│→ │Stage│
    │  A  │  │  B  │  │  C  │  │  D  │
    └─────┘  └─────┘  └─────┘  └─────┘
    10ms     10ms     10ms     10ms

    Total per item: 40ms
    Throughput: 1 item per 40ms = 25 items/detik

    Dengan Pipeline (Parallel):
    Waktu →
    T=0   ┌─────┐
          │ A:1 │
    T=10  └─────┘ ┌─────┐
                  │ B:1 │
    T=20          └─────┘ ┌─────┐
                          │ C:1 │
    T=30                  └─────┘ ┌─────┐
          ┌─────┐                 │ D:1 │ → Item 1 selesai!
          │ A:2 │                 └─────┘
    T=40  └─────┘ ┌─────┐
                  │ B:2 │
    T=50          └─────┘ ┌─────┐
                          │ C:2 │
    T=60                  └─────┘ ┌─────┐
          ┌─────┐                 │ D:2 │ → Item 2 selesai!
          │ A:3 │                 └─────┘
    ...

    Latency per item: tetap 40ms (tidak berubah)
    Throughput: 1 item per 10ms = 100 items/detik (4x lebih tinggi!)
```

### Contoh Pipeline dalam CPU Modern

```
                    CPU INSTRUCTION PIPELINE

    Tahapan pipeline CPU (5-stage RISC):
    ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
    │ FETCH│→ │ DECODE│→ │EXECUTE│→ │MEMORY│→ │WRITE │
    │      │  │      │  │      │  │      │ │ BACK │
    └──────┘  └──────┘  └──────┘  └──────┘  └──────┘
     1 cycle   1 cycle   1 cycle   1 cycle   1 cycle

    Tanpa pipeline: 1 instruksi = 5 cycles
    Dengan pipeline: 1 instruksi selesai setiap 1 cycle (setelah full)

    Throughput meningkat 5x!
```

---

## 🔄 BATCHING STRATEGIES

### Mengapa Batching Efektif?

Batching mengurangi overhead per-operation dengan mengelompokkan banyak operasi kecil menjadi satu operasi besar.

```
                    BATCHING vs INDIVIDUAL

    Individual (100 request terpisah):
    ┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐     ┌──┐
    │R1│→ │R2│→ │R3│→ │R4│→ │R5│→ ... │R100│
    └──┘  └──┘  └──┘  └──┘  └──┘     └──┘
     ↑     ↑     ↑     ↑     ↑        ↑
    O/H   O/H   O/H   O/H   O/H      O/H

    Setiap request punya overhead:
    - TCP handshake: ~50ms (jika connection baru)
    - Serialization: ~1ms
    - Network round trip: ~1ms (same DC)
    - Total overhead per request: ~52ms

    Total waktu: 100 × (52ms + 1ms processing) = 5.300ms

    Batching (1 request berisi 100 item):
    ┌──────────────────────────────────────┐
    │          BATCH (100 items)           │
    └──────────────────────────────────────┘
                    ↑
              Hanya 1x overhead

    Total waktu: 52ms + (100 × 1ms processing) = 152ms

    Perbaikan: 5.300ms → 152ms = 35x lebih cepat!
```

### Strategi Batching yang Efektif

```python
# Strategi 1: Size-based batching
# Batch berdasarkan jumlah item

class SizeBasedBatcher:
    def __init__(self, batch_size=100):
        self.batch_size = batch_size
        self.buffer = []

    def add(self, item):
        self.buffer.append(item)
        if len(self.buffer) >= self.batch_size:
            self._flush()

    def _flush(self):
        # Kirim batch ke server
        send_to_server(self.buffer)
        self.buffer = []

# Strategi 2: Time-based batching
# Batch berdasarkan waktu, terlepas dari jumlah item

import threading
import time

class TimeBasedBatcher:
    def __init__(self, flush_interval_ms=100):
        self.flush_interval = flush_interval_ms / 1000
        self.buffer = []
        self.lock = threading.Lock()
        self._start_timer()

    def add(self, item):
        with self.lock:
            self.buffer.append(item)

    def _start_timer(self):
        timer = threading.Timer(self.flush_interval, self._flush)
        timer.daemon = True
        timer.start()

    def _flush(self):
        with self.lock:
            if self.buffer:
                send_to_server(self.buffer)
                self.buffer = []
        self._start_timer()

# Strategi 3: Hybrid batching (size ATAU time, mana yang dulu)
# Paling umum digunakan di production

class HybridBatcher:
    def __init__(self, batch_size=100, flush_interval_ms=100):
        self.batch_size = batch_size
        self.flush_interval = flush_interval_ms / 1000
        self.buffer = []
        self.lock = threading.Lock()
        self._start_timer()

    def add(self, item):
        with self.lock:
            self.buffer.append(item)
            if len(self.buffer) >= self.batch_size:
                self._flush_unlocked()

    def _start_timer(self):
        timer = threading.Timer(self.flush_interval, self._flush)
        timer.daemon = True
        timer.start()

    def _flush(self):
        with self.lock:
            self._flush_unlocked()

    def _flush_unlocked(self):
        if self.buffer:
            send_to_server(self.buffer)
            self.buffer = []
```

### Kapan Pakai Batching?

| Skenario | Batching? | Alasan |
|---|---|---|
| Real-time chat | ❌ Tidak | User expect instant response |
| Log aggregation | ✅ Ya | Log bisa dikumpulkan, tidak urgent |
| Database inserts | ✅ Ya | Bulk insert jauh lebih cepat |
| API calls ke service lain | ✅ Ya | Kurangi network overhead |
| User-facing response | ❌ Tidak | Latency penting untuk UX |
| Background processing | ✅ Ya | Throughput lebih penting |

---

## 🏗️ REAL-WORLD EXAMPLES

### Contoh 1: Database Connection Pooling

Connection pooling adalah contoh klasik trade-off latency vs throughput.

```
                    CONNECTION POOLING

    Tanpa Connection Pool:
    Client ──[TCP handshake 50ms]── DB
             [auth 10ms]
             [query 5ms]
             [close 5ms]
             Total: 70ms per query

    Dengan Connection Pool:
    Client ──[ambil connection 0.1ms]── Pool ──[query 5ms]── DB
             Total: 5.1ms per query (14x lebih cepat!)

    Pool bekerja seperti ini:
    ┌────────────────────────────────────────────┐
    │          Connection Pool                   │
    │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
    │  │ C1 │ │ C2 │ │ C3 │ │ C4 │ │ C5 │  ...  │
    │  │idle│ │busy│ │idle│ │idle│ │busy│       │
    │  └────┘ └────┘ └────┘ └────┘ └────┘       │
    │                                            │
    │  Max connections: 20                        │
    │  Idle connections: 15                       │
    │  Active connections: 5                      │
    └────────────────────────────────────────────┘
```

```python
# Contoh implementasi connection pooling sederhana
import queue
import threading

class ConnectionPool:
    def __init__(self, max_connections, create_connection_fn):
        self.max_connections = max_connections
        self.create_connection = create_connection_fn
        self.pool = queue.Queue(maxsize=max_connections)
        self.lock = threading.Lock()
        self.created_count = 0

        # Pre-warm pool dengan beberapa connection
        for _ in range(min(5, max_connections)):
            conn = create_connection_fn()
            self.pool.put(conn)
            self.created_count += 1

    def get_connection(self, timeout=5):
        try:
            # Ambil connection yang sudah ada
            return self.pool.get(timeout=timeout)
        except queue.Empty:
            # Buat connection baru jika belum mencapai max
            with self.lock:
                if self.created_count < self.max_connections:
                    conn = self.create_connection()
                    self.created_count += 1
                    return conn
            raise Exception("Connection pool exhausted")

    def release_connection(self, conn):
        self.pool.put(conn)

# Penggunaan:
# pool = ConnectionPool(20, lambda: create_db_connection())
# conn = pool.get_connection()
# try:
#     result = conn.execute("SELECT * FROM users")
# finally:
#     pool.release_connection(conn)
```

**Analisis performa:**
- Tanpa pool: 70ms/query × 1000 query = 70.000ms = 70 detik
- Dengan pool: 5.1ms/query × 1000 query = 5.100ms = 5.1 detik
- **Peningkatan: 14x lebih cepat**

### Contoh 2: Batch Processing untuk Laporan BOS

```
                    BATCH PROCESSING PIPELINE

    Skenario: Generate laporan keuangan BOS dengan 10.000 transaksi

    ┌─────────────────────────────────────────────────────────┐
    │                  BATCH PIPELINE                          │
    │                                                          │
    │  Step 1: Collect    ┌─────────────┐                     │
    │  (10.000 transaksi) │   Buffer    │ ← 100ms             │
    │                     └──────┬──────┘                     │
    │                            │                            │
    │  Step 2: Validate         ▼                             │
    │  (cek format, duplikat) ┌─────────────┐                 │
    │                         │ Validator   │ ← 500ms         │
    │                         └──────┬──────┘                 │
    │                                │                        │
    │  Step 3: Calculate            ▼                         │
    │  (sum, average, group)  ┌─────────────┐                 │
    │                         │ Calculator  │ ← 2.000ms       │
    │                         └──────┬──────┘                 │
    │                                │                        │
    │  Step 4: Format               ▼                         │
    │  (PDF/Excel generation) ┌─────────────┐                 │
    │                         │  Formatter  │ ← 1.500ms       │
    │                         └──────┬──────┘                 │
    │                                │                        │
    │  Step 5: Store                ▼                         │
    │  (save to disk/S3)      ┌─────────────┐                 │
    │                         │   Storage   │ ← 1.000ms       │
    │                         └─────────────┘                 │
    │                                                          │
    │  Total latency: 5.100ms = 5.1 detik                     │
    │  Throughput: 10.000 transaksi / 5.1 detik               │
    │             = 1.960 transaksi/detik                      │
    └─────────────────────────────────────────────────────────┘
```

### Contoh 3: Microservices Communication Pattern

```
                    MICROSERVICES LATENCY BUDGET

    User request: "Buat pesanan baru"

    ┌──────┐    50ms    ┌─────────┐    30ms    ┌──────────┐
    │Client│ ────────→ │  API    │ ────────→ │  Order   │
    │      │ ←──────── │ Gateway │ ←──────── │ Service  │
    └──────┘   200ms    └─────────┘   80ms    └──────────┘
                                               │
                                    ┌──────────┼──────────┐
                                    40ms       50ms       30ms
                                    ▼          ▼          ▼
                                 ┌──────┐  ┌──────┐  ┌──────┐
                                 │Inventory│ │Payment│ │Notify│
                                 │Service│  │Service│ │Service│
                                 └──────┘  └──────┘  └──────┘

    Total latency breakdown:
    - Client → API Gateway:     50ms (network)
    - API Gateway → Order:      30ms (network)
    - Order → Inventory:        40ms (network)
    - Order → Payment:          50ms (network)
    - Order → Notification:     30ms (network)
    - Order processing:         80ms (compute)
    - Gateway → Client:        200ms (network + render)
    ─────────────────────────────────────
    Total:                     480ms

    Optimasi yang mungkin:
    1. Parallel calls: Inventory + Payment + Notify bersamaan
       → Menghemat 40ms (dari sequential ke parallel)
    2. Cache inventory data
       → Menghemat 40ms (jadi 0ms untuk cache hit)
    3. Async notification
       → Menghemat 30ms (tidak perlu wait)
    Total penghematan: 110ms → Total latency jadi 370ms
```

### Contoh 4: CDN dan Edge Computing

```
                    CDN LATENCY REDUCTION

    Tanpa CDN:
    User (Bandung) ────────────────→ Server (Jakarta)
                     50ms RTT

    Dengan CDN:
    User (Bandung) ─→ Edge CDN (Bandung)
                     5ms RTT (10x lebih cepat!)

    ┌──────────────────────────────────────────────────┐
    │               CDN ARCHITECTURE                    │
    │                                                   │
    │   User    User    User    User    User            │
    │    │       │       │       │       │              │
    │    ▼       ▼       ▼       ▼       ▼              │
    │  ┌───┐   ┌───┐   ┌───┐   ┌───┐   ┌───┐          │
    │  │Edge│   │Edge│   │Edge│   │Edge│   │Edge│      │
    │  │CDN │   │CDN │   │CDN │   │CDN │   │CDN │      │
    │  └─┬─┘   └─┬─┘   └─┬─┘   └─┬─┘   └─┬─┘          │
    │    │       │       │       │       │              │
    │    └───────┴───┬───┴───────┴───────┘              │
    │                │                                   │
    │                ▼                                   │
    │         ┌─────────────┐                            │
    │         │ Origin Server│                           │
    │         │  (Jakarta)   │                           │
    │         └─────────────┘                            │
    │                                                    │
    │  Edge CDN melayani 90% request (cache hit)        │
    │  Origin Server melayani 10% request (cache miss)  │
    └──────────────────────────────────────────────────┘
```

---

## 📐 FORMULA DAN KALKULASI

### Formula Throughput dengan Pipeline

```
Throughput_pipeline = 1 / max(stage_latency)

Contoh: Pipeline 4 stage dengan latency [10ms, 15ms, 8ms, 12ms]
Throughput = 1 / 15ms = 66.7 items/detik

Bottleneck adalah stage B (15ms) — ini yang membatasi throughput.
```

### Formula Speedup dari Batching

```
Speedup = (N × (overhead + processing)) / (overhead + N × processing)

Contoh: 100 request, overhead 50ms, processing 1ms
Speedup = (100 × 51) / (50 + 100) = 5100 / 150 = 34x
```

### Formula Utilisasi Server

```
Utilisasi = λ × W / N

Dimana:
λ = arrival rate (request per detik)
W = service time (detik per request)
N = jumlah server

Contoh: 500 req/s, 200ms per request, 2 server
Utilisasi = 500 × 0.2 / 2 = 50%

Jika utilisasi > 80%, queue mulai menumpuk dan latency meningkat drastis.
```

---

## 💡 PRAKTIK

### Latihan 1: Identifikasi Prioritas

Tentukan apakah aplikasi berikut lebih butuh **latency rendah** atau **throughput tinggi**:

1. Aplikasi video call
2. Generate laporan PDF bulanan
3. Aplikasi trading saham
4. Backup database harian
5. Notifikasi push ke HP
6. Sistem absensi guru pagi hari
7. Upload foto kegiatan sekolah ke galeri
8. Cetak rapor siswa (1000 siswa)

**Jawaban dengan penjelasan:**
1. **Latency rendah** — Video call butuh real-time, delay >200ms terasa lag
2. **Throughput tinggi** — Laporan bisa delay, yang penting selesai dan benar
3. **Latency rendah** — Delay 1 detik di trading bisa rugi jutaan rupiah
4. **Throughput tinggi** — Background job, tidak ada user yang menunggu
5. **Latency rendah** — Notifikasi harus cepat sampai agar relevant
6. **Latency rendah** — Guru tidak mau antre lama saat input absensi
7. **Throughput tinggi** — Upload bisa asynchronous, user tidak perlu tunggu
8. **Throughput tinggi** — Batch process 1000 rapor sekaligus lebih efisien

### Latihan 2: Estimasi Latency

Estimasi berapa lama operasi berikut berdasarkan latency numbers:

1. Baca data dari RAM
2. Baca data dari SSD (random read)
3. Kirim request ke server di Jakarta dari Bandung
4. Baca data dari database yang ada di server berbeda (same datacenter)

**Jawaban:**
1. **~100 ns** — Main memory reference
2. **~150.000 ns (150 μs)** — SSD random read 4K
3. **~5-15 ms** — Bandung-Jakarta ~150km, kecepatan cahaya dalam fiber ~200.000 km/s, plus processing
4. **~500 μs + query time** — Round trip same datacenter + database processing

### Latihan 3: Hitung dengan Little's Law

Sebuah server web memiliki:
- Average latency: 150ms
- Throughput saat ini: 200 req/s

Pertanyaan:
a. Berapa concurrent request rata-rata?
b. Jika setiap server bisa handle max 50 concurrent, berapa server yang dibutuhkan?
c. Jika traffic naik 3x menjadi 600 req/s, apa yang terjadi?

**Jawaban:**
```
a. L = λ × W = 200 × 0.15 = 30 concurrent request

b. Server needed = ceil(30 / 50) = 1 server

c. Jika 600 req/s:
   L = 600 × 0.15 = 90 concurrent request
   Server needed = ceil(90 / 50) = 2 server

   Tapi hati-hati: jika utilisasi mendekati 100%,
   latency akan meningkat karena queueing.
   Utilisasi = 90/100 = 90% → bahaya!
   Sebaiknya tambah server ke 3 untuk safety margin.
```

### Latihan 4: Optimasi Batching

Sebuah sistem mengirim log ke server pusat:
- 10.000 log per menit
- Setiap log: 1KB
- Network latency: 50ms per request
- Processing time: 1ms per log

Hitung total waktu dengan:
a. Individual (1 request per log)
b. Batch per 100 log
c. Batch per 1.000 log

**Jawaban:**
```
a. Individual:
   10.000 × (50ms + 1ms) = 510.000ms = 510 detik = 8.5 menit
   ❌ Tidak feasible — log menumpuk lebih cepat dari pengiriman

b. Batch per 100:
   Jumlah batch: 10.000 / 100 = 100 batch
   Waktu per batch: 50ms + (100 × 1ms) = 150ms
   Total: 100 × 150ms = 15.000ms = 15 detik ✅

c. Batch per 1.000:
   Jumlah batch: 10.000 / 1.000 = 10 batch
   Waktu per batch: 50ms + (1.000 × 1ms) = 1.050ms
   Total: 10 × 1.050ms = 10.500ms = 10.5 detik ✅

   Trade-off: Batch lebih besar = throughput lebih tinggi,
   tapi latency per log juga lebih tinggi (harus tunggu batch penuh).
```

### Latihan 5: Desain Connection Pool

Anda mendesain connection pool untuk aplikasi sekolah:
- Peak traffic: 100 req/s
- Average query time: 10ms
- Max connections database: 50

Pertanyaan:
a. Berapa concurrent query saat peak?
b. Berapa ukuran pool yang ideal?
c. Apa yang terjadi jika pool kehabisan connection?

**Jawaban:**
```
a. Concurrent = 100 × 0.01 = 1 concurrent query
   (Sangat rendah karena query cepat)

b. Pool size ideal:
   - Minimum: 1 (karena concurrent rata-rata = 1)
   - Recommended: 5-10 (untuk handle burst traffic)
   - Maximum: 50 (batas database)

   Rule of thumb: pool_size = concurrent_avg × 2 + burst_margin
   = 1 × 2 + 5 = 7 connections

c. Jika pool habis:
   - Request masuk queue (menambah latency)
   - Jika queue penuh: request ditolak (error)
   - Solusi: monitoring + auto-scaling pool
```

---

## 🧪 LATIHAN LANJUTAN

### Studi Kasus: Sistem Absensi Sekolah

Anda mendesain sistem absensi untuk SD Negeri Pasirhalang dengan spesifikasi:
- 30 guru, masing-masing absen 1x per hari
- Semua absen dalam window 7:00-7:15 (15 menit)
- Setiap absensi: 1 POST request + 1 DB write
- Server: 1 instance, max 50 concurrent connections

**Pertanyaan:**
1. Berapa RPS saat peak?
2. Apakah 1 server cukup?
3. Strategi apa yang Anda gunakan: latency-focused atau throughput-focused?
4. Apakah perlu connection pooling?
5. Apakah perlu batching?

**Jawaban:**
```
1. RPS peak:
   30 guru dalam 15 menit = 30 / 900 detik = 0.033 req/s
   Tapi asumsi burst: 20 guru absen dalam 5 menit pertama
   = 20 / 300 detik = 0.067 req/s
   Sangat rendah! 1 server lebih dari cukup.

2. Ya, 1 server sangat cukup. Bahkan server kecil bisa handle.

3. Latency-focused — guru expect respons cepat (<500ms).
   Tidak perlu throughput optimization karena traffic rendah.

4. Connection pooling tetap recommended, tapi bukan karena
   traffic tinggi — lebih untuk mengurangi overhead TCP handshake.

5. Tidak perlu batching untuk absensi real-time.
   Batching bisa dipakai untuk laporan harian (background job).
```

---

## ✅ CHECKLIST

- [ ] Bisa menjelaskan perbedaan latency vs throughput dengan analogi sendiri
- [ ] Menghafal urutan kecepatan hardware: L1 > L2 > L3 > RAM > SSD > HDD > Network
- [ ] Paham Little's Law dan bisa menghitung concurrent request
- [ ] Mengerti konsep pipeline parallelism dan dampaknya pada throughput
- [ ] Bisa menjelaskan kapan batching efektif dan kapan tidak
- [ ] Paham connection pooling dan manfaatnya
- [ ] Bisa menghitung estimasi latency untuk berbagai skenario
- [ ] Bisa menentukan prioritas latency vs throughput untuk use case tertentu
- [ ] Paham trade-off antara batch size dan latency
- [ ] Bisa mendesain connection pool dengan ukuran yang tepat

---

## 🔗 REFERENSI

- **Repo Asli:** [donnemartin/system-design-primer — Latency Numbers](https://github.com/donnemartin/system-design-primer#latency-numbers-every-programmer-should-know)
- **Artikel:** [Latency Numbers Every Programmer Should Know — Colin Scott](https://colin-scott.github.io/personal_website/research/interactive_latency.html)
- **Artikel:** [Understanding Latency vs Throughput — Cadence](https://community.cadence.com/cadence_blogs_8/b/fv/posts/understanding-latency-vs-throughput)
- **Artikel:** [Little's Law — Wikipedia](https://en.wikipedia.org/wiki/Little%27s_law)
- **Artikel:** [Queueing Theory for System Design](https://medium.com/@dicksontham/queueing-theory-for-system-design-8b1e4b1e3b1e)
- **Video:** [Numbers Everyone Should Know — Jeff Dean](https://static.googleusercontent.com/media/research.google.com/en//people/jeff/Stanford-DL-Nov-2010.pdf)

---

> **Lanjut ke:** [`04-availability-vs-consistency.md`](./04-availability-vs-consistency.md)
