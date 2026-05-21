# 15 — Asynchronism

> **Estimasi:** 2.5 jam | **Level:** Menengah → Lanjut

---

## 📖 TEORI

### Apa itu Asynchronism?

**Asynchronism** adalah pola pemrosesan di mana suatu tugas tidak dijalankan secara langsung (blocking), tapi **diantrikan** untuk diproses nanti oleh worker terpisah. Pengirim tugas tidak perlu menunggu tugas selesai — ia langsung mendapat konfirmasi bahwa tugas "diterima" dan bisa melanjutkan pekerjaan lain.

```
Perbandingan Visual Sync vs Async:

Synchronous (Blocking):
┌──────┐                                        ┌──────┐
│ User │──Request───────────────────────────→│Server│
│      │                                    │      │
│      │  ⏳ Menunggu 5 detik...             │ Proses│
│      │  ⏳ Tidak bisa melakukan apapun     │ query │
│      │  ⏳ Loading spinner berputar        │ data  │
│      │                                    │      │
│      │←────────────── Response ────────────│      │
│      │  "Selesai! Ini hasilnya."           │      │
└──────┘                                    └──────┘

  Total waktu user menunggu: 5 detik ❌

Asynchronous (Non-Blocking):
┌──────┐          ┌──────┐    ┌───────┐    ┌──────┐
│ User │──Request→│Server│ →  │ Queue │ →  │Worker│
│      │          │      │    │       │    │      │
│      │←"Tugas   │      │    │[task1]│    │      │
│      │  diterima│      │    │[task2]│    │Proses│
│      │  ✅"     │      │    │[task3]│ →  │task1 │
│      │          │      │    └───────┘    │      │
│ User │  Lanjut browsing...               │Proses│
│      │                                   │task2 │
│      │←────── Notifikasi: "Selesai!" ────│      │
└──────┘                                   └──────┘

  Total waktu user menunggu: < 1 detik ✅
```

### Mengapa Asynchronism Penting?

1. **User Experience Lebih Baik** — User tidak perlu menunggu proses lama. Mereka bisa melanjutkan aktivitas lain.
2. **Throughput Lebih Tinggi** — Server tidak blocking menunggu tugas selesai. Bisa menerima request baru terus-menerus.
3. **Beban Merata (Load Leveling)** — Traffic spike bisa di-antri dan diproses bertahap, bukan langsung membebani server.
4. **Fault Tolerance** — Jika worker crash, tugas tetap aman di antrian dan bisa diproses ulang saat worker kembali.
5. **Decoupling** — Producer dan consumer tidak perlu tahu satu sama lain. Mereka berkomunikasi melalui queue.
6. **Scalability** — Bisa menambah worker untuk memproses antrian lebih cepat tanpa mengubah producer.

---

## 🔄 SYNC VS ASYNC: PERBANDINGAN DETAIL

### Karakteristik

| Aspek | Synchronous | Asynchronous |
|-------|-------------|--------------|
| **Blocking** | Ya, caller menunggu sampai selesai | Tidak, caller langsung dapat response |
| **Coupling** | Tight (caller tahu receiver) | Loose (producer tidak tahu consumer) |
| **Error Handling** | Langsung (exception/return code) | Tertunda (callback, polling, notification) |
| **Timeout** | Perlu timeout untuk mencegah hang | Queue bisa persist, tidak ada timeout |
| **Resource Usage** | Thread/connection占用 selama proses | Thread bebas setelah submit ke queue |
| **Ordering** | Terjamin (sequential) | Bergantung queue (FIFO, priority, dll) |
| **Debugging** | Mudah (call stack jelas) | Sulit (trace across services) |
| **Latency** | Tinggi untuk proses lama | Rendah untuk user, tinggi untuk completion |
| **Throughput** | Terbatas oleh proses lambat | Tinggi (parallel workers) |
| **Complexity** | Rendah | Tinggi (queue management, retry, DLQ) |

### Deep Dive: Kapan Pakai Sync vs Async

```
Decision Framework Sync vs Async:

                    Request masuk
                         │
                         ▼
            ┌─────────────────────────┐
            │ User butuh hasil        │
            │ LANGSUNG untuk lanjut?  │
            └────────┬────────────────┘
                  YES │           NO
                      ▼              ▼
            ┌──────────────┐   ┌──────────────────┐
            │ Proses < 200 │   │ Proses > 1 detik │
            │ ms?          │   │ atau tidak butuh │
            └──────┬───────┘   │ hasil langsung?  │
              YES  │  NO       └────────┬─────────┘
                   ▼                    ▼
            ┌──────────┐    ┌────────────────────┐
            │ SYNC     │    │ ASYNC              │
            │          │    │                    │
            │ Contoh:  │    │ Contoh:            │
            │ - Login  │    │ - Generate PDF     │
            │ - Search │    │ - Kirim email      │
            │ - Valid  │    │ - Resize gambar    │
            │ - Auth   │    │ - Backup DB        │
            └──────────┘    └────────────────────┘
```

### Contoh Konkret: Aplikasi Sekolah

| Task | Sync/Async | Alasan | Detail |
|------|------------|--------|--------|
| Login guru | **Sync** | Harus langsung tahu berhasil/gagal | Query database, verifikasi password, buat session — semua < 100ms |
| Input absensi | **Sync** | Guru butuh konfirmasi langsung | Insert record, return success — < 50ms |
| Validasi NISN | **Sync** | User perlu tahu hasil validasi | Cek ke Dapodik API — bisa 1-2 detik, masih acceptable |
| Cetak rapor 500 siswa | **Async** | Proses lama (generate PDF per siswa) | Submit ke queue, worker generate, notifikasi saat selesai |
| Kirim pengumuman ke WA | **Async** | Kirim ke 100+ orang tua, lambat | Queue + parallel worker, rate limit ke WhatsApp API |
| Backup database | **Async** | Background job, tidak urgent | Scheduled job malam hari, tidak ganggu operasional |
| Upload foto kegiatan | **Async** | Resize + compress di background | User upload langsung OK, worker proses gambar |
| Generate laporan BOS | **Async** | Query 10.000+ transaksi, complex | Submit job, worker aggregate, hasil siap dalam 30 detik |
| Pembayaran SPP online | **Sync** | User harus tahu status pembayaran | Payment gateway callback, update status — harus langsung |
| Export data ke Excel | **Async** | Bisa jutaan baris, proses lama | Queue + worker, download link dikirim via email |

---

## 📦 ASYNC PATTERNS

### 1. Message Queues

**Fokus:** Komunikasi antar service (service-to-service).

```
Message Queue Architecture:

┌──────────┐     ┌───────────────┐     ┌──────────┐
│ Producer │ ──→ │    Queue      │ ──→ │ Consumer │
│ (App A)  │     │  (RabbitMQ,   │     │ (App B)  │
│          │     │   SQS)        │     │          │
└──────────┘     └───────────────┘     └──────────┘

  Message:                              Message:
  {                                     {
    "type": "order_created",              "type": "order_created",
    "order_id": "ORD-123",                "order_id": "ORD-123",
    "user_id": "USR-456",                 "user_id": "USR-456",
    "total": 150000,                      "total": 150000,
    "timestamp": "2024-01-15T10:30:00Z"   "timestamp": "2024-01-15T10:30:00Z"
  }                                     }
```

**Message Queue Tools:**

| Tool | Language | Fitur Utama | Use Case |
|------|----------|-------------|----------|
| **RabbitMQ** | Erlang | AMQP protocol, routing, priority queue | Enterprise messaging |
| **AWS SQS** | Managed | Fully managed, auto-scale, dead letter queue | Cloud-native apps |
| **Google Pub/Sub** | Managed | Global, event-driven, streaming analytics | GCP ecosystem |
| **Azure Service Bus** | Managed | Enterprise integration, sessions | Azure ecosystem |
| **Redis Streams** | C | Lightweight, in-memory, simple | Simple messaging |

**RabbitMQ Exchange Types:**

```
RabbitMQ Exchange Patterns:

Direct Exchange (routing key match):
  Producer ──[key: "email"]──→ Exchange ──[key: "email"]──→ Queue: email_queue
                               │
                               └──[key: "sms"]──→ Queue: sms_queue

Fanout Exchange (broadcast ke semua queue):
  Producer ────────────────→ Exchange ──→ Queue: email_queue
                                (fanout)  ──→ Queue: sms_queue
                                            ──→ Queue: log_queue

Topic Exchange (pattern matching):
  Producer ──[key: "order.created"]──→ Exchange ──→ Queue: order_queue
  Producer ──[key: "order.*"]────────→ (topic)    ──→ Queue: all_order_queue
  Producer ──[key: "#"]──────────────→            ──→ Queue: everything_queue
```

### 2. Event Streaming

**Fokus:** Stream data real-time, replayable, persistent log.

```
Event Streaming vs Message Queue:

Message Queue:                          Event Streaming:
  [msg1] [msg2] [msg3]                    [event1] [event2] [event3] [event4]
     ↑                                      ↑        ↑        ↑        ↑
  Consumer ambil,                         Consumer 1 baca dari offset 0
  pesan DIHAPUS                           Consumer 2 baca dari offset 2
                                          Pesan TETAP ADA (bisa replay)

Event Streaming = append-only log
Consumer bisa baca dari posisi mana saja
```

**Apache Kafka — Event Streaming Platform:**

```
Kafka Architecture:

┌─────────────────────────────────────────────────────────────┐
│                    Kafka Cluster                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Topic: "user_activity"                                     │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Partition 0    │  Partition 1    │  Partition 2      │ │
│  │  ┌───────────┐  │  ┌───────────┐  │  ┌───────────┐   │ │
│  │  │ offset 0  │  │  │ offset 0  │  │  │ offset 0  │   │ │
│  │  │ offset 1  │  │  │ offset 1  │  │  │ offset 1  │   │ │
│  │  │ offset 2  │  │  │ offset 2  │  │  │ offset 2  │   │ │
│  │  │ offset 3  │  │  │           │  │  │           │   │ │
│  │  └───────────┘  │  └───────────┘  │  └───────────┘   │ │
│  │  Broker 1       │  Broker 2       │  Broker 3        │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Producer → tulis ke partition (round-robin/key-based)     │
│  Consumer → baca dari offset tertentu                      │
│  Consumer Group → parallel consumption                     │
│                                                             │
│  Key Features:                                              │
│  - Persistent (data disimpan di disk, bisa replay)         │
│  - Ordered per partition                                   │
│  - Scalable (tambah partition = tambah throughput)         │
│  - Fault tolerant (replication factor)                     │
│  - Retention configurable (7 hari, 30 hari, forever)       │
└─────────────────────────────────────────────────────────────┘
```

**Kafka Use Cases:**

```
Kafka di Sistem Sekolah (skala besar):

Topic: "absensi_events"
  Partition 0: absensi SD Negeri Pasirhalang
  Partition 1: absensi SD Negeri Mandalamukti
  Partition 2: absensi SD Negeri Cikalongwetan

Consumer:
  Consumer Group "analytics": hitung statistik kehadiran
  Consumer Group "notification": kirim WA ke orang tua jika tidak hadir
  Consumer Group "reporting": generate laporan bulanan
  Consumer Group "archive": simpan ke data lake untuk audit

Semua consumer baca dari topic yang SAMA,
tapi memproses dengan cara BERBEDA.
```

**Amazon Kinesis — Managed Event Streaming:**

```
Kinesis vs Kafka:

┌────────────────────┬──────────────────────────────────────┐
│  Kafka             │  Kinesis                             │
├────────────────────┼──────────────────────────────────────┤
│  Self-managed      │  Fully managed (AWS)                 │
│  Open source       │  Proprietary (AWS)                   │
│  Lebih fleksibel   │  Lebih simple                        │
│  Butuh operational │  No operational overhead             │
│  overhead          │                                      │
│  Ecosystem besar   │  Integrasi AWS native                │
└────────────────────┴──────────────────────────────────────┘

Kinesis Components:
  - Kinesis Data Streams: real-time data streaming
  - Kinesis Data Firehose: load data ke S3, Redshift, Elasticsearch
  - Kinesis Data Analytics: SQL query pada stream data
  - Kinesis Video Streams: streaming video
```

### 3. Task Queues

**Fokus:** Menjalankan tugas background (background jobs).

```
Task Queue Architecture:

┌──────────┐     ┌───────────────┐     ┌──────────┐
│   App    │ ──→ │    Queue      │ ──→ │ Worker 1 │
│ (Web)    │     │  (Redis,      │     └──────────┘
│          │     │   RabbitMQ)   │     ┌──────────┐
│ submit   │     │               │ ──→ │ Worker 2 │
│ task     │     │ [task1]       │     └──────────┘
│          │     │ [task2]       │     ┌──────────┐
│          │     │ [task3]       │ ──→ │ Worker 3 │
└──────────┘     └───────────────┘     └──────────┘

  Task:
  {
    "id": "task-uuid-123",
    "type": "generate_pdf",
    "args": {"report_type": "BOS", "semester": 1, "year": 2024},
    "priority": 5,
    "retry_count": 0,
    "max_retries": 3,
    "created_at": "2024-01-15T10:30:00Z"
  }
```

**Task Queue Tools Comparison:**

| Tool | Language | Backend | Fitur Utama |
|------|----------|---------|-------------|
| **Celery** | Python | Redis, RabbitMQ | Retry, ETA, chords, canvas, monitoring |
| **Bull/BullMQ** | Node.js | Redis | Priority, delay, repeat, sandbox, events |
| **Sidekiq** | Ruby | Redis | Multithreading, retry, scheduling, batches |
| **RQ** | Python | Redis | Simple, lightweight, Redis-based |
| **AWS SQS + Lambda** | Any | AWS SQS | Serverless, auto-scale, pay-per-use |

**Celery Implementation (Python):**

```python
# celery_app.py
from celery import Celery

app = Celery(
    'sekolah_tasks',
    broker='redis://localhost:6379/0',    # Redis sebagai message broker
    backend='redis://localhost:6379/1'    # Redis untuk menyimpan result
)

app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Asia/Jakarta',
    enable_utc=True,
    task_acks_late=True,                  # Ack setelah task selesai
    worker_prefetch_multiplier=1,         # Ambil 1 task per worker
    task_default_retry_delay=60,          # Retry delay default 60 detik
    task_max_retries=3,                   # Max 3 kali retry
)

# tasks.py
from celery_app import app
import time

@app.task(bind=True, max_retries=3, default_retry_delay=60)
def generate_laporan_bos(self, semester, tahun):
    """Generate laporan BOS — bisa lama, jadi async."""
    try:
        # Step 1: Query data transaksi
        transaksi = query_transaksi_bos(semester, tahun)
        
        # Step 2: Aggregate data
        aggregated = aggregate_data(transaksi)
        
        # Step 3: Generate PDF
        pdf_path = create_pdf(aggregated, semester, tahun)
        
        # Step 4: Kirim notifikasi
        kirim_notifikasi(f"Laporan BOS {semester}/{tahun} siap: {pdf_path}")
        
        return {"status": "success", "path": pdf_path}
        
    except DatabaseConnectionError as exc:
        # Retry jika error koneksi database
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
        
    except Exception as exc:
        # Error lain — jangan retry, langsung fail
        raise self.retry(exc=exc, max_retries=0)

@app.task
def kirim_email_massal(self, daftar_email, subjek, konten):
    """Kirim email ke banyak penerima secara paralel."""
    hasil = []
    for email in daftar_email:
        try:
            kirim_email(email, subjek, konten)
            hasil.append({"email": email, "status": "sent"})
        except Exception as e:
            hasil.append({"email": email, "status": "failed", "error": str(e)})
    return hasil

@app.task
def resize_gambar(self, gambar_path, ukuran):
    """Resize gambar setelah upload."""
    from PIL import Image
    
    img = Image.open(gambar_path)
    
    # Buat thumbnail
    thumbnail = img.copy()
    thumbnail.thumbnail((200, 200))
    thumbnail.save(f"{gambar_path}_thumb.jpg")
    
    # Buat ukuran web
    web = img.copy()
    web.thumbnail((800, 600))
    web.save(f"{gambar_path}_web.jpg")
    
    return {"thumbnail": f"{gambar_path}_thumb.jpg", "web": f"{gambar_path}_web.jpg"}

# Cara submit task dari web app:
# result = generate_laporan_bos.delay(semester=1, tahun=2024)
# result.status  → 'PENDING', 'STARTED', 'SUCCESS', 'FAILURE'
# result.get()   → tunggu sampai selesai, return result
```

**BullMQ Implementation (Node.js):**

```javascript
// queue.js
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis({ host: 'localhost', port: 6379 });

// Buat queue
const emailQueue = new Queue('email_queue', { connection });
const pdfQueue = new Queue('pdf_queue', { connection });

// Submit job
async function submitGeneratePDF(semester, tahun) {
  const job = await pdfQueue.add('generate_laporan', {
    semester,
    tahun,
    format: 'pdf'
  }, {
    attempts: 3,                    // Retry 3 kali
    backoff: { type: 'exponential', delay: 1000 },  // Exponential backoff
    delay: 5000,                    // Delay 5 detik sebelum mulai
    priority: 1,                    // Priority 1 (lebih tinggi = lebih prioritas)
    removeOnComplete: true,         // Hapus job setelah selesai
    removeOnFail: false             // Simpan job yang gagal untuk investigasi
  });
  
  return job.id;
}

// Worker untuk proses job
const pdfWorker = new Worker('pdf_queue', async (job) => {
  switch (job.name) {
    case 'generate_laporan':
      return await generateLaporanBOS(job.data.semester, job.data.tahun);
    case 'resize_gambar':
      return await resizeGambar(job.data.path, job.data.ukuran);
    default:
      throw new Error(`Unknown job type: ${job.name}`);
  }
}, { connection, concurrency: 5 });  // 5 job paralel

// Event handling
pdfWorker.on('completed', (job) => {
  console.log(`Job ${job.id} selesai: ${JSON.stringify(job.returnvalue)}`);
  kirimNotifikasi(job.data.user_id, 'Job selesai!');
});

pdfWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} gagal: ${err.message}`);
  if (job.attemptsMade === job.opts.attempts) {
    // Sudah max retry — kirim ke dead letter
    logDeadLetter(job, err);
  }
});
```

### 4. Webhooks

**Fokus:** Callback HTTP — server A memberitahu server B saat event terjadi.

```
Webhook Flow:

┌──────────────┐                    ┌──────────────┐
│   Server A   │                    │   Server B   │
│  (Provider)  │                    │  (Consumer)  │
│              │                    │              │
│  Event:      │   POST ───────→    │  /webhook/   │
│  "Payment    │   {                │  receive     │
│   Completed" │     "event":       │              │
│              │     "payment.done",│  Return 200  │
│              │     "data": {...}  │  OK          │
│              │   }                │              │
└──────────────┘                    └──────────────┘

  Contoh: Payment gateway callback, GitHub webhook, Stripe event
```

**Webhook Design Best Practices:**

```
Webhook Delivery dengan Retry:

Attempt 1: POST https://server-b.com/webhook  →  Timeout (5 detik)
  ⏱️ Wait 1 detik (exponential backoff)
  
Attempt 2: POST https://server-b.com/webhook  →  500 Internal Server Error
  ⏱️ Wait 2 detik
  
Attempt 3: POST https://server-b.com/webhook  →  200 OK ✅
  ✅ Success — stop retry

Jika semua retry gagal:
  → Masuk ke Dead Letter Queue
  → Admin dapat alert
  → Bisa manual retry dari dashboard
```

**Webhook Implementation (Python/Flask):**

```python
from flask import Flask, request, jsonify
import hmac
import hashlib
import time

app = Flask(__name__)

WEBHOOK_SECRET = "whsec_your_secret_key_here"

def verify_signature(payload, signature, secret):
    """Verifikasi bahwa webhook benar-benar dari provider."""
    expected = hmac.new(
        secret.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)

@app.route('/webhook/payment', methods=['POST'])
def handle_payment_webhook():
    # 1. Verifikasi signature (security)
    signature = request.headers.get('X-Webhook-Signature')
    if not signature or not verify_signature(request.data, signature, WEBHOOK_SECRET):
        return jsonify({"error": "Invalid signature"}), 401
    
    # 2. Cek idempotency (hindari proses duplikat)
    event_id = request.json.get('event_id')
    if is_already_processed(event_id):
        return jsonify({"status": "already_processed"}), 200
    
    # 3. Proses event
    event_type = request.json.get('event')
    data = request.json.get('data')
    
    if event_type == 'payment.completed':
        update_order_status(data['order_id'], 'paid')
        kirim_notifikasi_ke_user(data['user_id'], 'Pembayaran berhasil!')
        
    elif event_type == 'payment.failed':
        update_order_status(data['order_id'], 'payment_failed')
        kirim_notifikasi_ke_user(data['user_id'], 'Pembayaran gagal.')
    
    # 4. Tandai sebagai processed (untuk idempotency)
    mark_as_processed(event_id)
    
    # 5. Return 200 ASAP (provider akan retry jika tidak dapat 200)
    return jsonify({"status": "received"}), 200

def is_already_processed(event_id):
    """Cek apakah event sudah pernah diproses."""
    # Cek di Redis atau database
    return redis_client.exists(f"webhook:processed:{event_id}")

def mark_as_processed(event_id):
    """Tandai event sebagai sudah diproses."""
    redis_client.setex(f"webhook:processed:{event_id}", 86400 * 7, "1")  # 7 hari
```

**Webhook Security Checklist:**

```
┌─────────────────────────────────────────────────────────────┐
│  Webhook Security Checklist                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ Signature Verification                                 │
│     - Verifikasi HMAC signature di setiap webhook           │
│     - Gunakan secret key yang kuat                          │
│     - Timing-safe comparison (hmac.compare_digest)          │
│                                                             │
│  ✅ Idempotency                                             │
│     - Simpan event_id yang sudah diproses                   │
│     - Return 200 untuk duplikat (bukan error)               │
│     - TTL untuk event_id (7-30 hari)                        │
│                                                             │
│  ✅ HTTPS Only                                              │
│     - Terima webhook hanya via HTTPS                        │
│     - Validasi SSL certificate                              │
│                                                             │
│  ✅ IP Whitelisting (opsional)                              │
│     - Terima webhook hanya dari IP provider                 │
│     - Cek X-Forwarded-For jika behind proxy                 │
│                                                             │
│  ✅ Rate Limiting                                           │
│     - Batasi jumlah webhook per menit                       │
│     - Block IP yang spam                                    │
│                                                             │
│  ✅ Timeout Handling                                        │
│     - Response dalam < 5 detik                              │
│     - Proses berat lakukan async (queue)                    │
│                                                             │
│  ✅ Logging & Monitoring                                    │
│     - Log semua webhook masuk                               │
│     - Alert jika banyak webhook gagal                       │
│     - Dashboard untuk retry manual                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔀 ASYNC COMMUNICATION PATTERNS

### 1. Fire-and-Forget

```
Fire-and-Forget:

  Producer ──→ [Queue] ──→ Consumer
     │
     └── "Sudah dikirim, lupa."
         Tidak peduli apakah berhasil atau gagal.

  Use Case:
  - Logging (tidak kritis jika ada yang hilang)
  - Analytics event tracking
  - Audit trail
  - Notifikasi non-kritis

  Contoh:
  logger.info({"event": "page_view", "user": "budi", "page": "/dashboard"})
  → Kirim ke queue, tidak peduli apakah berhasil diproses.
```

### 2. Request-Reply (Async)

```
Request-Reply Pattern:

  Client                          Server
    │                               │
    │── Request (reply_to: queue_A)─→│
    │                               │ Proses
    │                               │
    │←── Response (ke queue_A) ─────│
    │                               │
    │ Terima response               │
    │ Lanjut proses                 │

  Implementasi:
  1. Client buat temporary queue (reply_to)
  2. Client kirim request + correlation_id
  3. Server proses, kirim response ke reply_to queue
  4. Client dengar reply_to queue, terima response

  Use Case:
  - Query yang butuh waktu lama tapi tetap perlu hasil
  - RPC async (Remote Procedure Call)
  - Microservice communication
```

### 3. Publish-Subscribe (Pub/Sub)

```
Publish-Subscribe Pattern:

                    ┌───────────┐
  Publisher ──────→ │   Topic   │
  (Event Source)    │ "order"   │
                    └─────┬─────┘
                          │
            ┌─────────────┼─────────────┐
            ▼             ▼             ▼
      ┌──────────┐ ┌──────────┐ ┌──────────┐
      │Subscriber│ │Subscriber│ │Subscriber│
      │  Email   │ │  Inventory│ │ Analytics│
      │  Service │ │  Service  │ │  Service │
      └──────────┘ └──────────┘ └──────────┘

  Semua subscriber mendapat SALINAN pesan yang sama.

  Use Case:
  - Event-driven architecture
  - Real-time notification
  - Data replication
  - Cache invalidation

  Contoh di Sistem Sekolah:
  Topic: "siswa_baru"
    → Subscriber "email": kirim email welcome ke orang tua
    → Subscriber "inventory": siapkan seragam, buku
    → Subscriber "analytics": update statistik siswa
    → Subscriber "dapodik": sinkronisasi ke Dapodik
```

### Pattern Comparison

| Pattern | Komunikasi | Coupling | Use Case |
|---------|------------|----------|----------|
| **Fire-and-Forget** | One-way, no response | Loose | Logging, analytics |
| **Request-Reply** | Two-way, async response | Medium | Query async, RPC |
| **Pub/Sub** | One-to-many broadcast | Loose | Event notification |
| **Point-to-Point** | One-to-one | Medium | Task queue |

---

## ⚠️ HANDLING ASYNC FAILURES

### Dead Letter Queue (DLQ)

```
Dead Letter Queue Flow:

  ┌───────┐     ┌─────────┐     ┌────────┐
  │Producer│ ──→ │  Queue  │ ──→ │ Worker │
  └───────┘     └─────────┘     └───┬────┘
                                    │
                          ┌─────────┴─────────┐
                          │                   │
                    Success │           Failure │
                          ▼                   ▼
                    ┌──────────┐    ┌──────────────────┐
                    │  Done ✅  │    │ Retry (max 3x)   │
                    └──────────┘    └────────┬─────────┘
                                             │
                                   ┌─────────┴─────────┐
                                   │                   │
                             Retry OK │         Max retry │
                                   ▼           reached ▼
                             ┌──────────┐    ┌──────────────┐
                             │  Done ✅  │    │   DLQ ⚠️     │
                             └──────────┘    │ (Dead Letter │
                                             │   Queue)     │
                                             └──────────────┘
                                                    │
                                           Admin review &
                                           manual retry / discard
```

**DLQ Implementation:**

```python
# Celery DLQ configuration
app.conf.update(
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    task_default_retry_delay=60,
    task_max_retries=3,
)

@app.task(bind=True, max_retries=3)
def proses_data(self, data_id):
    try:
        data = fetch_data(data_id)
        result = transform(data)
        save_result(result)
        return "success"
    except TemporaryError as e:
        # Retry dengan exponential backoff
        raise self.retry(
            exc=e,
            countdown=60 * (2 ** self.request.retries)  # 60s, 120s, 240s
        )
    except PermanentError as e:
        # Jangan retry — langsung masuk DLQ
        log_to_dlq(data_id, str(e))
        raise

# DLQ monitoring
def monitor_dlq():
    """Cek DLQ dan alert admin jika ada pesan."""
    dlq_size = redis_client.llen('celery_dlq')
    if dlq_size > 0:
        send_alert(f"DLQ memiliki {dlq_size} pesan yang perlu ditinjau!")
        return get_dlq_messages(limit=10)
    return []
```

### Retry dengan Exponential Backoff

```
Exponential Backoff Strategy:

  Attempt 1: Fail → Wait 1 detik   (1s)
  Attempt 2: Fail → Wait 2 detik   (2s)
  Attempt 3: Fail → Wait 4 detik   (4s)
  Attempt 4: Fail → Wait 8 detik   (8s)
  Attempt 5: Fail → Wait 16 detik  (16s)
  ...
  Attempt N: Fail → Wait 2^(N-1) detik
             Max wait: 5 menit (cap)
             Max retries: 10

  Kenapa exponential?
  - Jika error karena overload, memberi waktu sistem pulih
  - Mencegah thundering herd (semua retry bersamaan)
  - Efisien untuk temporary failures

  Jitter (randomization):
  Wait = base_delay * 2^retry_count + random(0, 1 detik)
  → Mencegah retry bersamaan dari banyak worker
```

**Retry Implementation:**

```python
import random
import time

def retry_with_backoff(func, max_retries=5, base_delay=1, max_delay=300):
    """Retry function dengan exponential backoff + jitter."""
    for attempt in range(max_retries + 1):
        try:
            return func()
        except TemporaryError as e:
            if attempt == max_retries:
                raise  # Sudah max retry, lempar error
            
            # Exponential backoff dengan jitter
            delay = min(base_delay * (2 ** attempt), max_delay)
            jitter = random.uniform(0, 1)
            wait_time = delay + jitter
            
            print(f"Attempt {attempt + 1} failed. Retrying in {wait_time:.1f}s...")
            time.sleep(wait_time)

# Contoh penggunaan:
def kirim_email_ke_api(email, subjek, konten):
    response = requests.post("https://api.email.com/send", json={
        "to": email, "subject": subjek, "body": konten
    })
    if response.status_code == 429:  # Rate limited
        raise TemporaryError("Rate limited")
    elif response.status_code >= 500:  # Server error
        raise TemporaryError(f"Server error: {response.status_code}")
    elif response.status_code == 400:  # Bad request
        raise PermanentError(f"Invalid request: {response.text}")
    return response.json()

retry_with_backoff(
    lambda: kirim_email_ke_api("budi@...", "Laporan", "Laporan BOS siap"),
    max_retries=5,
    base_delay=1
)
```

### Compensation (Saga Pattern)

```
Saga Pattern untuk Async Transaction:

  Use Case: Order processing yang melibatkan multiple services
  
  Step 1: Create Order      ✅ Success
  Step 2: Reserve Inventory ✅ Success
  Step 3: Process Payment   ❌ FAIL (kartu ditolak)
  
  Kompensasi (rollback):
  Step 2 Compensation: Release Inventory  ✅
  Step 1 Compensation: Cancel Order       ✅
  
  Arsitektur:
  
  ┌─────────────────────────────────────────────────────────────┐
  │                    Saga Orchestrator                        │
  ├─────────────────────────────────────────────────────────────┤
  │                                                             │
  │  1. CreateOrder ──────→ [Order Service]    ✅               │
  │  2. ReserveInventory ─→ [Inventory Service] ✅              │
  │  3. ProcessPayment ───→ [Payment Service]   ❌ FAIL         │
  │                                                             │
  │  Kompensasi (reverse order):                                │
  │  2. ReleaseInventory ←── [Inventory Service] ✅             │
  │  1. CancelOrder ←────── [Order Service]    ✅               │
  │                                                             │
  │  Final: Saga failed, semua di-rollback                      │
  └─────────────────────────────────────────────────────────────┘
```

**Saga Implementation:**

```python
from dataclasses import dataclass
from typing import Callable, List

@dataclass
class Step:
    action: Callable
    compensation: Callable
    name: str

class Saga:
    def __init__(self, steps: List[Step]):
        self.steps = steps
        self.completed_steps = []
    
    def execute(self):
        """Eksekusi semua step, kompensasi jika ada yang gagal."""
        for step in self.steps:
            try:
                print(f"Executing: {step.name}")
                step.action()
                self.completed_steps.append(step)
            except Exception as e:
                print(f"Step '{step.name}' failed: {e}")
                self._compensate()
                raise
    
    def _compensate(self):
        """Kompensasi step yang sudah berhasil (reverse order)."""
        print("Starting compensation...")
        for step in reversed(self.completed_steps):
            try:
                print(f"Compensating: {step.name}")
                step.compensation()
            except Exception as e:
                print(f"Compensation for '{step.name}' failed: {e}")
                # Log untuk manual intervention

# Contoh penggunaan:
def create_order():
    db.execute("INSERT INTO orders ...")

def cancel_order():
    db.execute("UPDATE orders SET status='cancelled' ...")

def reserve_inventory():
    db.execute("UPDATE inventory SET stock = stock - 1 ...")

def release_inventory():
    db.execute("UPDATE inventory SET stock = stock + 1 ...")

def process_payment():
    payment_api.charge(amount=150000, card_token="tok_123")

def refund_payment():
    payment_api.refund(charge_id="ch_123")

saga = Saga([
    Step(create_order, cancel_order, "Create Order"),
    Step(reserve_inventory, release_inventory, "Reserve Inventory"),
    Step(process_payment, refund_payment, "Process Payment"),
])

try:
    saga.execute()
    print("Saga completed successfully!")
except Exception:
    print("Saga failed, compensation executed.")
```

---

## 📊 MONITORING ASYNC SYSTEMS

### Metrics yang Penting

```
Async System Monitoring Dashboard:

┌─────────────────────────────────────────────────────────────┐
│                    Async Monitoring                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Queue Metrics:                                             │
│  ┌─────────────────┬──────────┬──────────┬──────────────┐  │
│  │ Metric          │ Value    │ Status   │ Threshold    │  │
│  ├─────────────────┼──────────┼──────────┼──────────────┤  │
│  │ Queue Depth     │ 1,247    │ ⚠️ WARN  │ > 1,000      │  │
│  │ Avg Wait Time   │ 2.3s     │ ✅ OK    │ < 5s         │  │
│  │ Avg Process Time│ 1.8s     │ ✅ OK    │ < 3s         │  │
│  │ Throughput      │ 45/min   │ ✅ OK    │ > 30/min     │  │
│  │ DLQ Size        │ 12       │ ❌ CRIT  │ > 0          │  │
│  └─────────────────┴──────────┴──────────┴──────────────┘  │
│                                                             │
│  Worker Metrics:                                            │
│  ┌─────────────────┬──────────┬──────────┬──────────────┐  │
│  │ Metric          │ Value    │ Status   │ Threshold    │  │
│  ├─────────────────┼──────────┼──────────┼──────────────┤  │
│  │ Active Workers  │ 8/10     │ ✅ OK    │ > 5          │  │
│  │ CPU Usage       │ 65%      │ ✅ OK    │ < 80%        │  │
│  │ Memory Usage    │ 72%      │ ⚠️ WARN  │ < 75%        │  │
│  │ Error Rate      │ 2.1%     │ ✅ OK    │ < 5%         │  │
│  └─────────────────┴──────────┴──────────┴──────────────┘  │
│                                                             │
│  Alert Rules:                                               │
│  - Queue depth > 1000 → scale up workers                   │
│  - DLQ size > 0 → alert admin                              │
│  - Error rate > 5% → pause queue, investigate              │
│  - Worker down > 2 → alert ops team                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Distributed Tracing untuk Async

```
Distributed Trace untuk Async Job:

  Trace ID: abc-123-def-456
  
  ┌─────────────────────────────────────────────────────────→ Time
  │
  │  [Web Request] ── span_id: 001
  │  POST /api/laporan
  │  Duration: 150ms
  │
  │    └── [Submit to Queue] ── span_id: 002 (parent: 001)
  │        Queue: pdf_queue
  │        Duration: 5ms
  │
  │        └── [Worker Process] ── span_id: 003 (parent: 002)
  │            Worker: worker-3
  │            Duration: 28.5s
  │
  │              ├── [Query DB] ── span_id: 004 (parent: 003)
  │              │   Duration: 3.2s
  │              │
  │              ├── [Generate PDF] ── span_id: 005 (parent: 003)
  │              │   Duration: 22.1s
  │              │
  │              └── [Upload to S3] ── span_id: 006 (parent: 003)
  │                  Duration: 2.8s
  │
  │                  └── [Send Notification] ── span_id: 007 (parent: 003)
  │                      Duration: 0.4s

  Tools: Jaeger, Zipkin, AWS X-Ray, Datadog APM
```

### Logging Best Practices

```python
import logging
import uuid

logger = logging.getLogger(__name__)

def process_task(task_data):
    """Process async task dengan logging yang baik."""
    # Correlation ID untuk trace
    correlation_id = task_data.get('correlation_id', str(uuid.uuid4()))
    
    logger.info(
        "Task started",
        extra={
            'correlation_id': correlation_id,
            'task_type': task_data['type'],
            'task_id': task_data['id'],
        }
    )
    
    try:
        result = execute_task(task_data)
        
        logger.info(
            "Task completed",
            extra={
                'correlation_id': correlation_id,
                'task_id': task_data['id'],
                'duration_ms': result['duration_ms'],
            }
        )
        return result
        
    except Exception as e:
        logger.error(
            "Task failed",
            extra={
                'correlation_id': correlation_id,
                'task_id': task_data['id'],
                'error': str(e),
                'retry_count': task_data.get('retry_count', 0),
            },
            exc_info=True
        )
        raise
```

---

## 🌍 REAL-WORLD: ASYNC DI PERUSAHAAN BESAR

### Amazon — Order Processing

```
Amazon Order Flow (Async):

  User klik "Place Order"
    │
    ├──→ [Sync] Validasi payment method (200ms)
    │
    ├──→ [Sync] Create order record (50ms)
    │    Return: "Order placed! Order #12345"
    │
    └──→ [Async] Queue untuk downstream processing:
         │
         ├──→ Queue: inventory_reservation
         │    └──→ Worker: Reserve stock di warehouse
         │
         ├──→ Queue: payment_capture
         │    └──→ Worker: Charge credit card
         │
         ├──→ Queue: order_notification
         │    └──→ Worker: Kirim email konfirmasi
         │
         ├──→ Queue: fraud_check
         │    └──→ Worker: Analisis fraud risk
         │
         └──→ Queue: shipping_preparation
              └──→ Worker: Generate shipping label

  Semua downstream process async — user tidak menunggu.
```

### Netflix — Video Processing

```
Netflix Video Upload Pipeline:

  Content Provider upload video master
    │
    ├──→ [Async] Queue: video_processing
         │
         ├──→ Worker 1: Transcode ke 265 format (4K, 1080p, 720p, 480p)
         │    Duration: 2-4 jam untuk film 2 jam
         │
         ├──→ Worker 2: Generate subtitle (multi-language)
         │    Duration: 30 menit
         │
         ├──→ Worker 3: Generate thumbnail & preview
         │    Duration: 5 menit
         │
         ├──→ Worker 4: Quality check (automated)
         │    Duration: 15 menit
         │
         └──→ Worker 5: Distribute ke CDN (Open Connect)
              Duration: 1-2 jam

  Total processing: 3-7 jam
  User experience: Upload → "Processing..." → Notifikasi saat siap
```

---

## 🎯 CONTOH NYATA: SISTEM SEKOLAH

### Arsitektur Async untuk Aplikasi Sekolah

```
Sistem Sekolah dengan Async Processing:

┌─────────────────────────────────────────────────────────────┐
│                   Aplikasi Web Sekolah                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SYNC (langsung):                                           │
│  ├── Login / Auth                                           │
│  ├── Input absensi harian                                   │
│  ├── Input nilai per siswa                                  │
│  ├── Lihat jadwal pelajaran                                 │
│  └── Update profil pengguna                                 │
│                                                             │
│  ASYNC (background):                                        │
│  ├── Generate laporan BOS (30 detik - 5 menit)             │
│  │   └── Queue: report_generation                          │
│  │       └── Worker: aggregate data → generate PDF         │
│  │                                                           │
│  ├── Cetak rapor 500 siswa (10-30 menit)                   │
│  │   └── Queue: report_printing                            │
│  │       └── Worker: generate PDF per siswa → merge        │
│  │                                                           │
│  ├── Kirim pengumuman ke 100 orang tua (5-15 menit)        │
│  │   └── Queue: notification                               │
│  │       └── Worker: kirim WA/email dengan rate limit      │
│  │                                                           │
│  ├── Resize foto kegiatan (1-5 detik per foto)             │
│  │   └── Queue: image_processing                           │
│  │       └── Worker: resize + compress + upload CDN        │
│  │                                                           │
│  ├── Backup database (30 menit - 1 jam)                    │
│  │   └── Queue: backup (scheduled, cron)                   │
│  │       └── Worker: dump DB → compress → upload S3        │
│  │                                                           │
│  └── Sinkronisasi Dapodik (5-15 menit)                     │
│      └── Queue: dapodik_sync                               │
│          └── Worker: export data → call API → log result   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Monitoring Dashboard untuk Sistem Sekolah

```
Dashboard Monitoring Async Jobs:

┌─────────────────────────────────────────────────────────────┐
│              Async Job Monitor — SD Negeri Pasirhalang      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Queue: report_generation                                   │
│  ├── Pending: 0                                             │
│  ├── Processing: 1 (Laporan BOS Q1/2024)                   │
│  ├── Completed today: 3                                     │
│  └── Failed today: 0                                        │
│                                                             │
│  Queue: notification                                        │
│  ├── Pending: 45                                            │
│  ├── Processing: 5                                          │
│  ├── Completed today: 127                                   │
│  └── Failed today: 2 (→ DLQ)                                │
│                                                             │
│  Queue: image_processing                                    │
│  ├── Pending: 12                                            │
│  ├── Processing: 3                                          │
│  ├── Completed today: 89                                    │
│  └── Failed today: 0                                        │
│                                                             │
│  Workers:                                                   │
│  ├── worker-1: Processing report_generation (CPU: 45%)     │
│  ├── worker-2: Processing notification (CPU: 12%)          │
│  ├── worker-3: Processing image_processing (CPU: 30%)      │
│  ├── worker-4: Idle                                        │
│  └── worker-5: Idle                                        │
│                                                             │
│  DLQ (Dead Letter Queue):                                   │
│  ├── 2 jobs perlu ditinjau                                  │
│  │   ├── Job #4521: kirim_wa (error: rate limit exceeded)  │
│  │   └── Job #4530: kirim_wa (error: invalid phone number) │
│  └── [Retry All] [Discard All] [View Details]               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 PRAKTIK

### Latihan 1: Sync atau Async?

Tentukan sync atau async untuk skenario berikut:

1. User bayar SPP online via payment gateway
2. Sistem generate sertifikat untuk 200 siswa setelah wisuda
3. Validasi NISN siswa di database Dapodik (API eksternal)
4. Kirim notifikasi pengumuman ke 100 orang tua via WhatsApp
5. Lihat jadwal pelajaran hari ini
6. Export data seluruh siswa ke Excel (5.000 baris)
7. Upload 20 foto kegiatan sekolah (masing-masing 5MB)
8. Update password akun guru
9. Generate grafik statistik kehadiran bulanan
10. Backup database setiap malam jam 2 pagi

**Jawaban:**
1. Sync — user harus tahu status pembayaran langsung
2. Async — proses lama, user bisa dapat notifikasi nanti
3. Sync — user butuh hasil validasi untuk lanjut
4. Async — bisa antri, tidak harus real-time
5. Sync — query sederhana, < 100ms
6. Async — proses lama, download link dikirim via email
7. Async — resize/compress di background
8. Sync — harus langsung konfirmasi
9. Async — aggregation bisa lama jika data besar
10. Async — scheduled background job

### Latihan 2: Desain Sistem Async

Desain sistem async untuk skenario:
- 20 guru upload foto kegiatan bersamaan jam 10 pagi
- Setiap foto harus di-resize menjadi 3 ukuran: thumbnail (200x200), web (800x600), original
- Setelah resize, foto di-upload ke CDN
- Guru mendapat notifikasi saat semua foto selesai diproses

Gambar arsitektur dengan: queue, worker, retry mechanism, dan notification.

### Latihan 3: Desain Webhook Handler

Desain webhook handler untuk menerima callback dari payment gateway:
- Verifikasi signature
- Handle idempotency
- Retry logic jika downstream service down
- DLQ untuk webhook yang gagal diproses

### Latihan 4: Implementasi Retry dengan Backoff

Implementasi fungsi retry dengan exponential backoff + jitter untuk:
- API call ke Dapodik (bisa rate limited)
- Kirim email via SMTP (bisa timeout)
- Upload file ke cloud storage (buka network error)

---

## ✅ CHECKLIST

- [ ] Bisa jelaskan perbedaan sync vs async secara detail
- [ ] Paham konsep message queue, task queue, event streaming, webhook
- [ ] Bisa bedakan RabbitMQ, Kafka, Celery, Bull, Sidekiq
- [ ] Paham async communication patterns (fire-and-forget, request-reply, pub/sub)
- [ ] Bisa desain webhook dengan signature verification dan idempotency
- [ ] Paham dead letter queue dan kapan digunakan
- [ ] Bisa implementasi retry dengan exponential backoff + jitter
- [ ] Paham saga pattern untuk compensation
- [ ] Bisa mendesain monitoring untuk async system
- [ ] Tahu real-world async patterns (Amazon, Netflix)
- [ ] Bisa mendesain sistem async untuk aplikasi sekolah

---

## 🔗 REFERENSI

- **Repo Asli:** [donnemartin/system-design-primer — Asynchronism](https://github.com/donnemartin/system-design-primer#asynchronism)
- **donnemartin/system-design-primer — Message Queues:** [Message Queues](https://github.com/donnemartin/system-design-primer#message-queues)
- **Artikel:** [Scalability for Dummies - Asynchronism](https://web.archive.org/web/20220926171507/https://www.lecloud.net/post/9699762917/scalability-for-dummies-part-4-asynchronism)
- **Celery Documentation:** [Celery Docs](https://docs.celeryq.dev/)
- **BullMQ Documentation:** [BullMQ Docs](https://docs.bullmq.io/)
- **Kafka Documentation:** [Apache Kafka Docs](https://kafka.apache.org/documentation/)
- **RabbitMQ Tutorials:** [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)
- **AWS SQS:** [Amazon SQS Documentation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/)
- **Saga Pattern:** [Microservices.io — Saga Pattern](https://microservices.io/patterns/data/saga.html)
- **Webhook Security:** [Webhook Security Best Practices](https://webhooks.fyi/security/)

---

> **Lanjut ke:** [`16-komunikasi-protokol.md`](./16-komunikasi-protokol.md)