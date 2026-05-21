# 04 — Message Queues (Kafka, RabbitMQ) & Event-Driven Architecture

> **Estimasi:** 3-4 jam | **Level:** Advanced
> **Prerequisite:** [`03-distributed-systems.md`](./03-distributed-systems.md), [`02-microservices.md`](./02-microservices.md)

---

## 📖 TEORI

### 4.1 Message Queue Fundamentals

Message Queue adalah komponen infrastruktur yang memungkinkan komunikasi **asynchronous** antar aplikasi atau service. Alih-alih service A memanggil service B secara langsung (synchronous), service A mengirim pesan ke queue, dan service B mengambil pesan tersebut ketika siap.

#### Komponen Utama

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Producer   │────▶│   Broker     │────▶│  Consumer   │
│  (Sender)   │     │  (Server)    │     │  (Receiver) │
└─────────────┘     └──────────────┘     └─────────────┘
                         │
                    ┌────┴────┐
                    │  Queue  │
                    │ (Buffer)│
                    └─────────┘
```

| Komponen | Definisi | Analogi |
|---|---|---|
| **Producer** | Aplikasi yang mengirim pesan ke queue | Pengirim surat |
| **Consumer** | Aplikasi yang menerima dan memproses pesan | Penerima surat |
| **Broker** | Server yang mengelola queue, routing, dan delivery | Kantor pos |
| **Queue** | Struktur FIFO (First-In-First-Out) yang menyimpan pesan | Kotak surat |
| **Topic** | Kategori/nama channel tempat pesan dipublikasikan | Rubrik koran |
| **Partition** | Sub-bagian dari topic untuk paralelisasi (Kafka) | Jalur di jalan tol |
| **Message** | Unit data yang dikirim (payload + metadata) | Isi surat |
| **Offset** | Posisi unik pesan dalam partition (Kafka) | Nomor halaman buku |
| **Consumer Group** | Sekelompok consumer yang berbagi beban kerja | Tim pekerja |

#### Mengapa Message Queue Diperlukan?

1. **Decoupling** — Producer dan consumer tidak perlu saling kenal. Producer hanya perlu tahu broker address.
2. **Asynchronous Processing** — Producer tidak perlu menunggu consumer selesai. Kirim pesan lalu lanjut kerja.
3. **Load Leveling / Buffering** — Saat traffic spike, pesan antri di queue alih-alih membuat consumer crash.
4. **Fault Tolerance** — Jika consumer down, pesan tetap tersimpan di queue dan diproses saat consumer kembali.
5. **Scalability** — Bisa menambah consumer instance untuk memproses pesan lebih cepat.

#### Synchronous vs Asynchronous Communication

```
SYNCHRONOUS (REST/gRPC):
[Service A] ──request──▶ [Service B] ──response──▶ [Service A]
         (BLOCKING - tidak bisa lanjut sampai response datang)

ASYNCHRONOUS (Message Queue):
[Service A] ──publish──▶ [Queue]  (langsung lanjut kerja)
                                    │
                              (kapan saja)
                                    ▼
                              [Service B] ──consume──▶ [Queue]
                              (proses saat siap)
```

---

### 4.2 RabbitMQ Deep Dive

RabbitMQ adalah message broker open-source yang mengimplementasikan protokol **AMQP 0-9-1** (Advanced Message Queuing Protocol). Dibangun dengan Erlang/OTP, terkenal dengan routing flexibility dan reliability.

#### Arsitektur RabbitMQ

```
┌──────────┐     ┌─────────────────────────────────────────────┐
│ Producer │────▶│                  Broker                      │
└──────────┘     │                                              │
                 │  ┌─────────┐    ┌─────────┐    ┌──────────┐ │
                 │  │Exchange │───▶│ Binding │───▶│  Queue   │ │
                 │  │(Router) │    │ (Rule)  │    │ (Buffer) │ │
                 │  └─────────┘    └─────────┘    └──────────┘ │
                 │                                              │
                 └──────────────────────┬───────────────────────┘
                                        │
                                        ▼
                                 ┌──────────────┐
                                 │   Consumer   │
                                 └──────────────┘
```

#### Exchange Types

Exchange adalah router yang menentukan pesan masuk ke queue mana berdasarkan **routing key** dan **binding rule**.

**1. Direct Exchange** — Match exact routing key

```
Exchange "direct_logs"
  routing_key="error"    ──▶ Queue "error_queue"
  routing_key="warning"  ──▶ Queue "warning_queue"
  routing_key="info"     ──▶ Queue "info_queue"

Pesan dengan routing_key="error" HANYA masuk ke error_queue.
```

**2. Fanout Exchange** — Broadcast ke SEMUA queue yang terikat

```
Exchange "fanout_notifications"
  ──▶ Queue "email_queue"
  ──▶ Queue "sms_queue"
  ──▶ Queue "push_queue"

Satu pesan masuk, TIGA queue menerima salinan.
Cocok untuk: broadcast notification, event publishing.
```

**3. Topic Exchange** — Pattern matching dengan wildcard

```
Exchange "topic_logs"
  routing_key="order.created.us"    ──▶ Queue "us_orders"
  routing_key="order.created.uk"    ──▶ Queue "uk_orders"
  routing_key="order.created.*"     ──▶ Queue "all_orders"
  routing_key="*.created.*"         ──▶ Queue "all_created"
  routing_key="order.#"             ──▶ Queue "all_order_events"

Wildcard:
  * = satu kata (single word)
  # = nol atau lebih kata (zero or more words)
```

**4. Headers Exchange** — Match berdasarkan header, bukan routing key

```
Exchange "headers_exchange"
  Header: {"format": "pdf", "priority": "high"}
    ──▶ Queue "pdf_high_priority"
  Header: {"format": "csv", "priority": "low"}
    ──▶ Queue "csv_low_priority"

Cocok untuk: routing berdasarkan metadata kompleks.
```

#### RabbitMQ Clustering dan Mirroring

```
┌─────────────────────────────────────────────────────────┐
│                    RabbitMQ Cluster                      │
│                                                         │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐             │
│  │ Node A  │◀──▶│ Node B  │◀──▶│ Node C  │             │
│  │ (RAM)   │    │ (Disk)  │    │ (Disk)  │             │
│  └────┬────┘    └────┬────┘    └────┬────┘             │
│       │              │              │                   │
│  ┌────┴────┐    ┌────┴────┐    ┌────┴────┐             │
│  │ Queue Q │    │ Queue Q │    │ Queue Q │             │
│  │ (Master)│    │(Mirror) │    │(Mirror) │             │
│  └─────────┘    └─────────┘    └─────────┘             │
└─────────────────────────────────────────────────────────┘

Clustering: Multiple node berbagi metadata, queue bisa di-host di node manapun.
Mirroring: Queue di-replicate ke multiple node untuk high availability.
Quorum Queues: Raft-based replication (RabbitMQ 3.8+), lebih reliable dari classic mirroring.
```

#### Code Example: RabbitMQ Producer (Python)

```python
import pika
import json

# Koneksi ke RabbitMQ broker
connection = pika.BlockingConnection(
    pika.ConnectionParameters('localhost')
)
channel = connection.channel()

# Deklarasi exchange (idempotent - aman dipanggil berulang)
channel.exchange_declare(
    exchange='order_events',
    exchange_type='topic',
    durable=True  # Persist jika broker restart
)

# Buat pesan
order_data = {
    'order_id': 'ORD-2026-001',
    'customer_id': 'CUST-123',
    'items': [
        {'product_id': 'PROD-1', 'quantity': 2, 'price': 50000},
        {'product_id': 'PROD-2', 'quantity': 1, 'price': 150000}
    ],
    'total': 250000,
    'status': 'created',
    'timestamp': '2026-05-21T10:30:00Z'
}

# Publish pesan dengan routing key
channel.basic_publish(
    exchange='order_events',
    routing_key='order.created',  # Topic routing key
    body=json.dumps(order_data),
    properties=pika.BasicProperties(
        delivery_mode=2,           # Persistent message (tidak hilang jika restart)
        content_type='application/json',
        message_id='msg-001',      # Unique ID untuk deduplication
        timestamp=1716285000,
        headers={'source': 'order-service', 'version': '1.0'}
    )
)

print(f" [x] Sent order.created: {order_data['order_id']}")
connection.close()
```

#### Code Example: RabbitMQ Consumer (Python)

```python
import pika
import json
import time

def process_order(ch, method, properties, body):
    """Callback yang dipanggil saat pesan diterima."""
    try:
        order = json.loads(body)
        print(f" [✓] Processing order: {order['order_id']}")
        print(f" [✓] Total: Rp {order['total']:,}")
        print(f" [✓] Items: {len(order['items'])}")

        # Simulasi proses bisnis
        time.sleep(1)

        # Acknowledge - beri tahu broker pesan sudah sukses diproses
        ch.basic_ack(delivery_tag=method.delivery_tag)
        print(f" [✓] Order {order['order_id']} completed")

    except Exception as e:
        print(f" [✗] Error processing order: {e}")

        # Reject dan requeue - pesan akan dikirim ulang
        # requeue=False akan mengirim ke Dead Letter Queue
        ch.basic_nack(
            delivery_tag=method.delivery_tag,
            requeue=False  # Jangan requeue, kirim ke DLQ
        )

connection = pika.BlockingConnection(
    pika.ConnectionParameters('localhost')
)
channel = connection.channel()

# Deklarasi exchange dan queue (harus match dengan producer)
channel.exchange_declare(
    exchange='order_events',
    exchange_type='topic',
    durable=True
)

channel.queue_declare(
    queue='order_processing',
    durable=True,
    arguments={
        'x-dead-letter-exchange': 'dlx_exchange',  # DLQ routing
        'x-dead-letter-routing-key': 'order.failed'
    }
)

# Binding queue ke exchange dengan routing pattern
channel.queue_bind(
    exchange='order_events',
    queue='order_processing',
    routing_key='order.created'
)

# Konfigurasi QoS - max 1 pesan belum di-ack per consumer
channel.basic_qos(prefetch_count=1)

# Mulai consume
channel.basic_consume(
    queue='order_processing',
    on_message_callback=process_order,
    auto_ack=False  # Manual acknowledgment (lebih aman)
)

print(" [*] Waiting for orders. Press CTRL+C to exit.")
channel.start_consuming()
```

---

### 4.3 Apache Kafka Deep Dive

Apache Kafka adalah **distributed event streaming platform** yang dirancang untuk throughput tinggi, fault tolerance, dan real-time data processing. Kafka menyimpan pesan sebagai **immutable log** — pesan tidak dihapus setelah consumed, tapi disimpan berdasarkan retensi policy.

#### Arsitektur Kafka

```
┌──────────────────────────────────────────────────────────────┐
│                      Kafka Cluster                            │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Broker 1   │  │  Broker 2   │  │  Broker 3   │          │
│  │ (Leader)    │  │ (Follower)  │  │ (Follower)  │          │
│  │             │  │             │  │             │          │
│  │ Topic: orders                                          │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │          │
│  │ │Part. 0  │◀─┼──┤Part. 0  │◀─┼──┤Part. 0  │ │          │
│  │ │(Leader) │ │  │(Follower)│ │  │(Follower)│ │          │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │          │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │          │
│  │ │Part. 1  │◀─┼──┤Part. 1  │◀─┼──┤Part. 1  │ │          │
│  │ │(Follower)│ │ │(Leader)  │ │  │(Follower)│ │          │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │          │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │          │
│  │ │Part. 2  │◀─┼──┤Part. 2  │◀─┼──┤Part. 2  │ │          │
│  │ │(Follower)│ │ │(Follower)│ │  │(Leader)  │ │          │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                               │
│  ZooKeeper / KRaft: Metadata & coordination                  │
└──────────────────────────────────────────────────────────────┘
```

#### Konsep Kunci Kafka

| Konsep | Definisi | Detail |
|---|---|---|
| **Topic** | Kategori log tempat pesan dipublikasikan | Mirip tabel di database |
| **Partition** | Sub-bagian ordered dari topic | Unit paralelisasi, satu partition = satu log |
| **Offset** | ID unik sequential per pesan dalam partition | 0, 1, 2, 3... tidak pernah reuse |
| **Broker** | Server Kafka individual dalam cluster | Setiap broker handle subset partition |
| **Producer** | Aplikasi yang publish pesan ke topic | Bisa pilih partition (key-based atau round-robin) |
| **Consumer** | Aplikasi yang read pesan dari topic | Track offset sendiri |
| **Consumer Group** | Sekelompok consumer yang berbagi partition | Satu partition hanya dikonsumsi satu consumer dalam group |
| **Replication Factor** | Jumlah copy setiap partition | Leader + Followers |
| **ISR (In-Sync Replicas)** | Follower yang up-to-date dengan leader | Hanya ISR yang bisa jadi leader baru |
| **Log Compaction** | Hanya simpan pesan terakhir per key | Cocok untuk state/changelog |

#### Partition dan Consumer Group

```
Topic: "orders" (3 partitions)

Partition 0: [msg1][msg4][msg7]  ──▶ Consumer A (Group: payment-group)
Partition 1: [msg2][msg5][msg8]  ──▶ Consumer B (Group: payment-group)
Partition 2: [msg3][msg6][msg9]  ──▶ Consumer C (Group: payment-group)

Consumer Group "payment-group": 3 consumer, masing-masing handle 1 partition.

Jika tambah Consumer D ke group yang sama:
  - Tidak ada partition tersisa untuk Consumer D (idle)
  - Max consumer aktif = jumlah partition

Jika Consumer B crash:
  - Partition 1 di-rebalance ke Consumer A atau D
  - Offset Consumer B tersimpan, consumer baru lanjut dari offset terakhir
```

#### Code Example: Kafka Producer (Python dengan confluent-kafka)

```python
from confluent_kafka import Producer
import json
import time

# Konfigurasi producer
conf = {
    'bootstrap.servers': 'localhost:9092,localhost:9093,localhost:9094',
    'client.id': 'order-service-producer',
    'acks': 'all',                    # Tunggu semua ISR acknowledge
    'retries': 3,                     # Retry jika gagal
    'enable.idempotence': True,       # Exactly-once semantics
    'max.in.flight.requests.per.connection': 5,  # Untuk idempotence
}

producer = Producer(conf)

def delivery_report(err, msg):
    """Callback setelah pesan berhasil/gagal dikirim."""
    if err is not None:
        print(f" [✗] Delivery failed: {err}")
    else:
        print(f" [✓] Delivered to {msg.topic()} [{msg.partition()}] @ offset {msg.offset()}")

def publish_order(order_data):
    """Publish order event ke Kafka topic."""
    # Gunakan order_id sebagai key untuk memastikan ordering per order
    key = order_data['order_id'].encode('utf-8')
    value = json.dumps(order_data).encode('utf-8')

    producer.produce(
        topic='orders',
        key=key,
        value=value,
        headers=[
            ('event_type', b'order.created'),
            ('source', b'order-service'),
            ('timestamp', str(int(time.time())).encode('utf-8'))
        ],
        callback=delivery_report
    )

    # Flush untuk memastikan pesan terkirim
    producer.poll(0)

# Contoh penggunaan
order = {
    'order_id': 'ORD-2026-001',
    'customer_id': 'CUST-123',
    'items': [
        {'product_id': 'PROD-1', 'quantity': 2, 'price': 50000}
    ],
    'total': 100000,
    'status': 'created'
}

publish_order(order)
producer.flush()  # Tunggu semua pesan terkirim
```

#### Code Example: Kafka Consumer (Python dengan confluent-kafka)

```python
from confluent_kafka import Consumer, KafkaError
import json

# Konfigurasi consumer
conf = {
    'bootstrap.servers': 'localhost:9092,localhost:9093,localhost:9094',
    'group.id': 'payment-service',           # Consumer group name
    'auto.offset.reset': 'earliest',         # Mulai dari awal jika tidak ada offset
    'enable.auto.commit': False,             # Manual commit (lebih aman)
    'max.poll.interval.ms': 300000,          # Max waktu proses sebelum dianggap dead
    'session.timeout.ms': 10000,             # Timeout untuk heartbeat
}

consumer = Consumer(conf)

# Subscribe ke topic
consumer.subscribe(['orders'])

print(" [*] Waiting for orders. Press CTRL+C to exit.")

try:
    while True:
        msg = consumer.poll(timeout=1.0)

        if msg is None:
            continue

        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            else:
                print(f" [✗] Consumer error: {msg.error()}")
                continue

        # Proses pesan
        order = json.loads(msg.value().decode('utf-8'))
        print(f" [✓] Processing: {order['order_id']}")
        print(f" [✓] Partition: {msg.partition()}, Offset: {msg.offset()}")
        print(f" [✓] Key: {msg.key().decode('utf-8')}")

        # Simulasi proses bisnis
        # ... proses payment ...

        # Manual commit setelah sukses proses
        consumer.commit(msg)
        print(f" [✓] Committed offset {msg.offset()}")

except KeyboardInterrupt:
    pass
finally:
    consumer.close()
```

---

### 4.4 Kafka vs RabbitMQ vs Redis Streams vs AWS SQS

Perbandingan detail untuk memilih message queue yang tepat:

| Aspek | Apache Kafka | RabbitMQ | Redis Streams | AWS SQS |
|---|---|---|---|---|
| **Model** | Distributed log | Message broker | Stream data structure | Managed queue |
| **Protokol** | Kafka Protocol | AMQP 0-9-1, MQTT, STOMP | RESP (Redis Protocol) | HTTPS / AWS SDK |
| **Throughput** | Sangat tinggi (1M+ msg/s) | Tinggi (10K-100K msg/s) | Sangat tinggi (variabel) | Tinggi (managed) |
| **Latensi** | Low (2-10ms) | Very Low (<1ms) | Very Low (<1ms) | Low (10-100ms) |
| **Persistensi** | Disk (persistent log) | Memory + Disk (configurable) | Memory + AOF/RDB | Disk (managed) |
| **Retensi** | Waktu/ukuran (konfigurabel) | Hapus setelah ack | Max length / trim | Hapus setelah delete |
| **Ordering** | Per-partition guarantee | Per-queue guarantee | Per-stream guarantee | FIFO queue (limited) |
| **Consumer Model** | Pull-based, consumer group | Push-based, prefetch | Pull-based (XREAD) | Pull-based (ReceiveMessage) |
| **Replay** | Ya (offset-based) | Tidak (pesan dihapus) | Ya (ID-based) | Tidak |
| **Dead Letter** | Ya (topic terpisah) | Ya (DLX/DLQ built-in) | Ya (manual) | Ya (redrive policy) |
| **Clustering** | Built-in, partitioned | Cluster + quorum queues | Redis Cluster / Sentinel | Fully managed |
| **Monitoring** | JMX, Prometheus, KRaft | Management UI, Prometheus | Redis INFO, Prometheus | CloudWatch |
| **Operational Cost** | Tinggi (self-managed) | Sedang | Rendah (jika sudah pakai Redis) | Rendah (pay-per-use) |
| **Use Case Ideal** | Event streaming, log aggregation, CQRS | Task queue, RPC, complex routing | Cache + queue, real-time analytics | Serverless, simple async tasks |

#### Kapan Memilih Masing-Masing?

**Pilih Kafka jika:**
- Butuh event streaming real-time dengan throughput tinggi
- Perlu replay events (offset-based)
- Membangun event sourcing atau CQRS
- Log aggregation dari banyak service
- Data pipeline untuk analytics

**Pilih RabbitMQ jika:**
- Butuh complex routing (topic, headers exchange)
- Perlu RPC pattern (request-reply)
- Message priority penting
- Delayed message diperlukan
- Already using AMQP ecosystem

**Pilih Redis Streams jika:**
- Sudah menggunakan Redis untuk caching
- Butuh queue sederhana dengan latency sangat rendah
- Real-time leaderboard / analytics
- Memory-based processing OK

**Pilih AWS SQS jika:**
- Infrastruktur sudah di AWS
- Tidak mau manage infrastructure
- Serverless architecture (Lambda trigger)
- Simple async task queue

---

### 4.5 Message Delivery Semantics

Delivery semantics menentukan jaminan pengiriman pesan dari producer ke consumer.

| Semantik | Definisi | Implementasi | Trade-off |
|---|---|---|---|
| **At-Most-Once** | Pesan bisa hilang, tidak pernah duplikat | Fire-and-forget, auto-ack | Cepat tapi tidak reliable |
| **At-Least-Once** | Pesan tidak hilang, bisa duplikat | Manual ack, retry | Reliable tapi perlu idempotency |
| **Exactly-Once** | Pesan tidak hilang, tidak duplikat | Idempotent producer + transactional | Paling reliable, overhead tinggi |

#### At-Most-Once (Paling Cepat, Paling Tidak Reliable)

```python
# Producer: kirim tanpa konfirmasi
producer.send(topic, message)  # Fire and forget

# Consumer: auto-acknowledge saat terima
channel.basic_consume(queue, callback, auto_ack=True)

# Risiko: Jika consumer crash saat proses, pesan HILANG.
# Jika network drop, pesan TIDAK terkirim ulang.
```

**Use case:** Log aggregation, metrics collection (kehilangan beberapa log tidak masalah).

#### At-Least-Once (Default di Production)

```python
# Producer: tunggu acknowledgment
producer.send(topic, message, acks='all')  # Tunggu semua ISR

# Consumer: manual acknowledge SETELAH proses selesai
def callback(ch, method, properties, body):
    try:
        process_message(body)
        ch.basic_ack(delivery_tag=method.delivery_tag)  # ACK setelah sukses
    except:
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)  # Requeue jika gagal

# Risiko: Pesan bisa DIPROSES DUA KALI jika:
# 1. Consumer proses sukses
# 2. Consumer crash SEBELUM kirim ACK
# 3. Broker kirim ulang pesan ke consumer lain
# Solusi: Consumer harus IDEMPOTEN (proses ulang tidak mengubah hasil)
```

**Idempotent Consumer Pattern:**

```python
processed_messages = set()  # Bisa pakai Redis/DB di production

def idempotent_callback(ch, method, properties, body):
    message_id = properties.message_id

    if message_id in processed_messages:
        print(f" [!] Duplicate message: {message_id}")
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    process_message(body)
    processed_messages.add(message_id)
    ch.basic_ack(delivery_tag=method.delivery_tag)
```

#### Exactly-Once (Paling Reliable, Paling Mahal)

```python
# Kafka: Idempotent Producer
conf = {
    'enable.idempotence': True,
    'acks': 'all',
    'max.in.flight.requests.per.connection': 5,
}

# Kafka: Transactional Producer (untuk multiple topic)
producer.init_transactions()
try:
    producer.begin_transaction()
    producer.send('orders', order_message)
    producer.send('inventory', inventory_update)
    producer.commit_transaction()
except:
    producer.abort_transaction()
```

**Use case:** Financial transactions, payment processing, inventory management.

---

### 4.6 Message Ordering dan Partitioning Strategies

#### Mengapa Ordering Penting?

```
Urutan BENAR:
  1. order.created    → Buat record order
  2. order.paid       → Proses pembayaran
  3. order.shipped    → Update status shipped

Urutan SALAH (jika tidak ada ordering guarantee):
  1. order.shipped    → ERROR: order belum ada!
  2. order.created    → Buat record order
  3. order.paid       → Proses pembayaran
```

#### Partitioning Strategies

**1. Key-Based Partitioning (Kafka)**

```python
# Pesan dengan key yang sama SELALU ke partition yang sama
# Ini menjamin ordering PER KEY

producer.send(
    topic='orders',
    key=b'CUST-123',       # Semua event customer ini ke partition sama
    value=b'{"event": "order.created", ...}'
)
producer.send(
    topic='orders',
    key=b'CUST-123',       # Partition sama → ordering terjaga
    value=b'{"event": "order.paid", ...}'
)

# Trade-off: Ordering per-key TAPI tidak global
# Event customer A dan customer B bisa diproses paralel
```

**2. Round-Robin Partitioning**

```python
# Pesan didistribusi merata ke semua partition
# TIDAK ada ordering guarantee

for i in range(10):
    producer.send(topic='logs', value=f'log-{i}')
    # Partition: 0, 1, 2, 0, 1, 2, 0, 1, 2, 0 (cyclic)
```

**3. Custom Partitioning**

```python
# Custom partitioner berdasarkan business logic
def custom_partitioner(key, all_partitions, available_partitions):
    if key.startswith('VIP-'):
        return all_partitions[0]  # VIP ke partition khusus
    return hash(key) % len(available_partitions)
```

#### Ordering Trade-offs

| Strategy | Ordering | Throughput | Use Case |
|---|---|---|---|
| Single Partition | Global | Rendah | Audit log, financial |
| Key-Based | Per-Key | Tinggi | Order processing, user events |
| Round-Robin | Tidak ada | Tertinggi | Log aggregation, metrics |
| Timestamp-Based | Per-Partition | Sedang | Time-series data |

---

### 4.7 Dead Letter Queues (DLQ) dan Error Handling

Dead Letter Queue adalah queue khusus untuk menampung pesan yang gagal diproses setelah beberapa kali retry.

#### DLQ Flow

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐
│ Producer │────▶│  Main Queue  │────▶│  Consumer   │
└──────────┘     └──────────────┘     └──────┬──────┘
                                             │
                                      ┌──────┴──────┐
                                      │  Processing  │
                                      │  Error?      │
                                      └──────┬──────┘
                                             │
                              ┌──────────────┼──────────────┐
                              │              │              │
                              ▼              ▼              ▼
                         Retry 1        Retry 2        Retry 3
                         (wait 1s)      (wait 5s)      (wait 30s)
                              │              │              │
                              ▼              ▼              ▼
                         Still failed? Still failed? Still failed?
                              │              │              │
                              └──────────────┴──────────────┘
                                             │
                                             ▼
                                  ┌──────────────────┐
                                  │  Dead Letter Q   │
                                  │  (Failed msgs)   │
                                  └────────┬─────────┘
                                           │
                                    ┌──────┴──────┐
                                    │  Analysis   │
                                    │  & Replay   │
                                    └─────────────┘
```

#### RabbitMQ DLQ Implementation

```python
# Setup Dead Letter Exchange dan Queue
channel.exchange_declare(exchange='dlx_exchange', exchange_type='direct')
channel.queue_declare(queue='order_dlq', durable=True)
channel.queue_bind(exchange='dlx_exchange', queue='order_dlq', routing_key='order.failed')

# Main queue dengan DLQ configuration
channel.queue_declare(
    queue='order_processing',
    durable=True,
    arguments={
        'x-dead-letter-exchange': 'dlx_exchange',
        'x-dead-letter-routing-key': 'order.failed',
        'x-message-ttl': 60000,        # Message TTL 60 detik
        'x-max-length': 10000,         # Max 10K pesan di queue
        'x-max-retries': 3             # Custom header untuk tracking retry
    }
)

# Consumer dengan retry logic
def consumer_with_retry(ch, method, properties, body):
    retry_count = properties.headers.get('x-retry-count', 0)
    max_retries = 3

    try:
        process_order(body)
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        if retry_count < max_retries:
            # Requeue dengan increment retry count
            retry_count += 1
            ch.basic_publish(
                exchange='',
                routing_key=method.routing_key,
                body=body,
                properties=pika.BasicProperties(
                    delivery_mode=2,
                    headers={
                        'x-retry-count': retry_count,
                        'x-original-error': str(e),
                        'x-retry-time': time.time()
                    }
                )
            )
            ch.basic_ack(delivery_tag=method.delivery_tag)
        else:
            # Max retries reached → kirim ke DLQ
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
```

#### Kafka DLQ Implementation

```python
from confluent_kafka import Producer, Consumer

# DLQ Producer
dlq_producer = Producer({'bootstrap.servers': 'localhost:9092'})

def consumer_with_dlq():
    consumer = Consumer({
        'bootstrap.servers': 'localhost:9092',
        'group.id': 'order-service',
        'enable.auto.commit': False,
    })
    consumer.subscribe(['orders'])

    while True:
        msg = consumer.poll(1.0)
        if msg is None or msg.error():
            continue

        try:
            process_order(msg.value())
            consumer.commit(msg)
        except Exception as e:
            # Kirim ke DLQ topic
            dlq_producer.produce(
                topic='orders-dlq',
                key=msg.key(),
                value=msg.value(),
                headers=[
                    ('original_topic', msg.topic().encode()),
                    ('original_partition', str(msg.partition()).encode()),
                    ('original_offset', str(msg.offset()).encode()),
                    ('error', str(e).encode()),
                    ('timestamp', str(int(time.time())).encode())
                ]
            )
            dlq_producer.flush()

            # Commit original message (sudah dipindahkan ke DLQ)
            consumer.commit(msg)
```

#### Error Handling Patterns

| Pattern | Deskripsi | Use Case |
|---|---|---|
| **Retry with Backoff** | Retry dengan delay meningkat (1s, 5s, 30s) | Transient errors (network timeout) |
| **Circuit Breaker** | Stop retry setelah threshold error | Service downstream down |
| **Poison Pill Handling** | Deteksi dan isolasi pesan yang selalu gagal | Malformed message, schema mismatch |
| **DLQ with Alerting** | Kirim ke DLQ + trigger alert | Critical errors perlu investigasi manual |
| **Saga Compensation** | Rollback transaksi terdistribusi | Multi-step business process |

---

### 4.8 Event-Driven Architecture (EDA)

Event-Driven Architecture adalah pola arsitektur di mana komponen berkomunikasi melalui **events** — fakta tentang sesuatu yang sudah terjadi.

#### Event vs Command vs Query

| Tipe | Definisi | Contoh | Karakteristik |
|---|---|---|---|
| **Event** | Fakta yang sudah terjadi | `OrderCreated`, `PaymentReceived` | Immutable, past tense, tidak bisa ditolak |
| **Command** | Permintaan untuk melakukan sesuatu | `CreateOrder`, `ProcessPayment` | Mutable, imperative, bisa ditolak |
| **Query** | Permintaan data | `GetOrderDetails`, `ListProducts` | Read-only, tidak mengubah state |

#### Event Sourcing

Event Sourcing adalah pola di mana state aplikasi disimpan sebagai **sequence of events**, bukan snapshot state terkini.

```
State-Based (Tradisional):
  Database: { order_id: "ORD-001", status: "shipped", total: 250000 }
  → Hanya state TERAKHIR yang tersimpan

Event Sourcing:
  Event Store:
    1. OrderCreated { order_id: "ORD-001", total: 250000, timestamp: T1 }
    2. PaymentReceived { order_id: "ORD-001", amount: 250000, timestamp: T2 }
    3. InventoryReserved { order_id: "ORD-001", items: [...], timestamp: T3 }
    4. OrderShipped { order_id: "ORD-001", tracking: "JNE123", timestamp: T4 }

  State saat ini = replay semua events dari awal.
  Bisa rebuild state di titik waktu manapun!
```

**Keuntungan Event Sourcing:**
- Full audit trail (semua perubahan tercatat)
- Bisa debug "kenapa state jadi begini"
- Bisa replay events ke projection baru
- Temporal queries (state di waktu tertentu)

**Kerugian Event Sourcing:**
- Kompleksitas tinggi
- Perlu snapshot untuk performa
- Event schema evolution sulit
- Learning curve curam

#### CQRS (Command Query Responsibility Segregation)

CQRS memisahkan operasi **write** (command) dan **read** (query) ke model yang berbeda.

```
┌─────────────────────────────────────────────────────────────┐
│                     CQRS Architecture                        │
│                                                              │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │  Client  │───▶│  Command     │───▶│  Write Model     │   │
│  │          │    │  Handler     │    │  (Normalisasi)   │   │
│  └────┬─────┘    └──────────────┘    └────────┬─────────┘   │
│       │                                        │            │
│       │                                   Events│            │
│       │                                        ▼            │
│       │                             ┌──────────────────┐   │
│       │                             │  Event Bus       │   │
│       │                             │  (Kafka/RabbitMQ)│   │
│       │                             └────────┬─────────┘   │
│       │                                        │            │
│       │                                   Events│            │
│       │                                        ▼            │
│       │                             ┌──────────────────┐   │
│       │                             │  Read Model      │   │
│       │◀────────────────────────────│  (Denormalisasi) │   │
│       │   Query Results             │  (Optimized for  │   │
│       │                             │   read perf)     │   │
│       └─────────────────────────────└──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Kapan Pakai CQRS?**
- Read dan write pattern sangat berbeda (100:1 ratio)
- Perlu multiple read model untuk use case berbeda
- Performance optimization untuk high-read scenarios
- Event sourcing integration

**Jangan Pakai CQRS jika:**
- CRUD sederhana
- Tim kecil, kompleksitas tidak worth it
- Consistency requirement sangat ketat

#### Event Streaming

Event streaming adalah proses continuous processing events saat events tersebut dihasilkan.

```
Real-time Event Streaming Pipeline:

[Order Service] ──▶ [Kafka: orders topic] ──▶ [Stream Processor]
                                                   │
                                    ┌──────────────┼──────────────┐
                                    ▼              ▼              ▼
                              [Fraud Detection] [Inventory]  [Analytics]
                              (real-time)      (real-time)  (real-time)
                                    │              │              │
                                    ▼              ▼              ▼
                              [Block Order]  [Reserve Stock] [Dashboard]
```

---

### 4.9 Message Queue Patterns

#### 1. Publish-Subscribe (Pub/Sub)

```
                ┌─────────────┐
                │   Topic     │
                │ "user.events"│
                └──────┬──────┘
                       │
            ┌──────────┼──────────┐
            ▼          ▼          ▼
      [Email Svc]  [Analytics]  [CRM Svc]
      "Send welcome" "Track signup" "Create lead"

Semua subscriber menerima SEMUA pesan di topic.
Cocok untuk: broadcast events, notification systems.
```

#### 2. Work Queues (Task Queue)

```
                ┌─────────────┐
                │   Queue     │
                │ "tasks"     │
                └──────┬──────┘
                       │
            ┌──────────┼──────────┐
            ▼          ▼          ▼
      [Worker 1]   [Worker 2]   [Worker 3]
      (proses)     (proses)     (proses)

Setiap pesan diproses OLEH SATU worker saja.
Cocok untuk: background jobs, image processing, email sending.
```

#### 3. Request-Reply (RPC Pattern)

```
[Client] ──request──▶ [Queue: requests] ──▶ [Server]
   ▲                                          │
   │                                          │
   └──reply── [Queue: replies] ◀──────────────┘

Client membuat reply queue unik, kirim correlation ID.
Server proses dan kirim balasan ke reply queue.
Cocok untuk: synchronous-like communication via queue.
```

#### 4. Fan-Out / Scatter-Gather

```
Scatter:
[Producer] ──▶ [Fanout Exchange] ──▶ [Queue A]
                                     [Queue B]
                                     [Queue C]

Gather:
[Aggregator] ◀── [Response A]
               ◀── [Response B]
               ◀── [Response C]

Cocok untuk: parallel processing, aggregation, map-reduce.
```

#### 5. Pipeline

```
[Raw Data] ──▶ [Stage 1: Validate] ──▶ [Stage 2: Transform] ──▶ [Stage 3: Load]

Setiap stage adalah consumer dari stage sebelumnya dan producer ke stage selanjutnya.
Cocok untuk: ETL pipelines, data processing workflows.
```

---

### 4.10 Scaling Message Queues

#### Horizontal Scaling dengan Partitioning

```
Kafka Topic: "orders" dengan 6 partitions

Partition 0: Broker 1 (Leader)
Partition 1: Broker 2 (Leader)
Partition 2: Broker 3 (Leader)
Partition 3: Broker 1 (Leader)
Partition 4: Broker 2 (Leader)
Partition 5: Broker 3 (Leader)

Consumer Group dengan 6 consumer:
  Consumer A → Partition 0
  Consumer B → Partition 1
  Consumer C → Partition 2
  Consumer D → Partition 3
  Consumer E → Partition 4
  Consumer F → Partition 5

Throughput = 6x single partition!
```

#### Consumer Scaling Rules

| Jumlah Partition | Max Consumer Aktif | Jika Consumer > Partition |
|---|---|---|
| 3 | 3 | Consumer tambahan idle |
| 6 | 6 | Consumer tambahan idle |
| 12 | 12 | Consumer tambahan idle |

**Aturan emas:** Jumlah consumer aktif tidak bisa melebihi jumlah partition. Jika butuh scaling consumer, tambah partition.

#### Replication untuk High Availability

```
Partition 0:
  Broker 1: Leader (read/write)
  Broker 2: Follower (read-only, sync)
  Broker 3: Follower (read-only, sync)

Jika Broker 1 crash:
  → Broker 2 atau 3 (yang di ISR) jadi Leader baru
  → Tidak ada data loss
  → Producer dan consumer otomatis redirect
```

#### Load Balancing Strategies

| Strategy | Deskripsi | Use Case |
|---|---|---|
| **Round-Robin** | Distribusi merata ke semua consumer | Work queues, task processing |
| **Key-Based** | Pesan dengan key sama ke consumer sama | Ordering guarantee per entity |
| **Sticky** | Consumer tetap handle partition yang sama | Cache locality, stateful processing |
| **Range** | Consumer handle range offset tertentu | Batch processing |

---

### 4.11 Monitoring dan Troubleshooting

#### Metrics Kunci yang Harus Dimonitor

| Metric | Definisi | Alert Threshold | Impact |
|---|---|---|---|
| **Consumer Lag** | Jumlah pesan belum di-consume | > 10,000 | Processing delay |
| **Throughput** | Pesan per detik | Drop > 50% | Performance degradation |
| **Producer Error Rate** | Persentase gagal publish | > 1% | Data loss risk |
| **Consumer Error Rate** | Persentase gagal consume | > 1% | Processing failure |
| **Queue Depth** | Jumlah pesan di queue | > 100,000 | Memory/disk pressure |
| **End-to-End Latency** | Waktu publish sampai consume | > 100ms | SLA violation |
| **Broker CPU/Memory** | Resource usage broker | > 80% | Stability risk |
| **ISR Count** | Jumlah in-sync replicas | < replication factor | Data loss risk |

#### Consumer Lag Monitoring

```python
from confluent_kafka.admin import AdminClient

admin = AdminClient({'bootstrap.servers': 'localhost:9092'})

def get_consumer_lag(topic, group_id):
    """Hitung consumer lag untuk setiap partition."""
    cluster_metadata = admin.list_topics(topic)
    topic_metadata = cluster_metadata.topics[topic]

    total_lag = 0
    for partition_id in topic_metadata.partitions:
        # Get latest offset (high watermark)
        low, high = admin.get_watermark_offsets(
            TopicPartition(topic, partition_id),
            timeout=5
        )

        # Get committed offset consumer
        committed = admin.committed(
            [TopicPartition(topic, partition_id, 0)],
            timeout=5
        )

        lag = high - committed[0].offset
        total_lag += lag
        print(f"  Partition {partition_id}: high={high}, committed={committed[0].offset}, lag={lag}")

    print(f"Total lag for {group_id} on {topic}: {total_lag}")
    return total_lag

# Alert jika lag terlalu tinggi
lag = get_consumer_lag('orders', 'payment-service')
if lag > 10000:
    print("⚠️ ALERT: Consumer lag exceeds threshold!")
    # Trigger alerting (PagerDuty, Slack, email)
```

#### Troubleshooting Common Issues

| Masalah | Gejala | Root Cause | Solusi |
|---|---|---|---|
| **Consumer Lag Meningkat** | Lag terus naik | Consumer terlalu lambat / terlalu sedikit pesan | Scale consumer, optimasi proses, tambah partition |
| **Pesan Hilang** | Data tidak sampai | Auto-ack, no persistence, broker crash | Manual ack, persistent messages, replication |
| **Duplikat Pesan** | Data diproses 2x | Retry tanpa idempotency | Idempotent consumer, deduplication |
| **Pesan Tidak Terurut** | Urutan salah | Multiple partition tanpa key | Key-based partitioning, single partition |
| **Broker Crash** | Cluster down | Resource exhausted, bug | Monitoring, auto-restart, quorum |
| **Poison Pill** | Consumer stuck di pesan yang sama | Malformed message, schema mismatch | DLQ, schema validation, circuit breaker |
| **Memory Full** | Broker OOM | Queue tidak di-consume, no TTL | Consumer scaling, message TTL, max queue length |

---

### 4.12 Real-World Case Studies

#### Uber: Kafka untuk Real-Time Data Platform

Uber menggunakan Kafka sebagai backbone untuk **real-time data platform** yang memproses **triliunan pesan per hari**.

**Use Cases:**
- **Ride Matching**: Event lokasi driver dan rider di-stream real-time
- **Dynamic Pricing**: Surge pricing berdasarkan demand-supply events
- **Fraud Detection**: Real-time anomaly detection pada transaksi
- **Analytics Dashboard**: Live metrics untuk operational monitoring

**Arsitektur:**
```
[Driver App] ──▶ [Kafka: location-events] ──▶ [Real-time Matching Engine]
[Rider App]  ──▶ [Kafka: ride-requests]  ──▶ [Dynamic Pricing Engine]

[Kafka: payment-events] ──▶ [Fraud Detection] ──▶ [Alert System]
[Kafka: trip-events]    ──▶ [Analytics]       ──▶ [Dashboard]
```

**Scale:**
- 100K+ messages per second peak
- 100+ Kafka clusters globally
- Multi-datacenter replication
- Custom Kafka monitoring dan tooling

**Pelajaran:**
- Schema Registry penting untuk compatibility
- Consumer lag monitoring critical untuk SLA
- Multi-cluster untuk disaster recovery
- Data governance dan lineage tracking

#### Shopify: RabbitMQ untuk E-Commerce Order Processing

Shopify menggunakan RabbitMQ untuk mengelola **order processing pipeline** yang menangani jutaan order selama flash sale dan Black Friday.

**Use Cases:**
- **Order Fulfillment**: Routing order ke warehouse yang tepat
- **Payment Processing**: Async payment verification
- **Inventory Updates**: Real-time stock synchronization
- **Notification System**: Email, SMS, push notification

**Arsitektur:**
```
[Checkout] ──▶ [RabbitMQ: order.created] ──▶ [Fulfillment Service]
                                              [Payment Service]
                                              [Inventory Service]
                                              [Notification Service]

[RabbitMQ: payment.completed] ──▶ [Shipping Service]
                                   [Receipt Generator]
                                   [Analytics Service]
```

**Fitur RabbitMQ yang Digunakan:**
- **Topic Exchange**: Routing berdasarkan order type dan region
- **Priority Queues**: VIP orders diproses lebih dulu
- **Delayed Messages**: Retry dengan backoff untuk payment gateway
- **Quorum Queues**: High availability untuk critical orders
- **Management Plugin**: Monitoring dan troubleshooting

**Pelajaran:**
- Message TTL untuk mencegah queue overflow saat flash sale
- DLQ untuk failed payments yang perlu investigasi manual
- Consumer prefetch untuk load balancing
- Clustering untuk high availability

---

### 4.13 Practice: Design Message Queue System untuk E-Commerce

#### Requirements

Buat sistem message queue untuk e-commerce dengan requirement:

1. **Order Processing**: Order → Payment → Inventory → Shipping → Notification
2. **High Availability**: Tidak boleh ada order yang hilang
3. **Scalability**: Handle 10x traffic spike saat flash sale
4. **Ordering**: Event per order harus terurut
5. **Error Handling**: Failed payment retry dengan backoff
6. **Monitoring**: Real-time dashboard untuk operational team

#### Solution Design

```
┌─────────────────────────────────────────────────────────────────────┐
│                    E-Commerce Message Queue System                   │
│                                                                      │
│  [Web/Mobile App] ──▶ [API Gateway] ──▶ [Order Service]            │
│                                                    │                 │
│                                          ┌─────────┴─────────┐      │
│                                          ▼                   ▼      │
│                                    [Kafka: orders]    [Kafka: dlq]  │
│                                    (6 partitions)     (failed msgs) │
│                                          │                          │
│                    ┌─────────────────────┼─────────────────────┐     │
│                    ▼                     ▼                     ▼     │
│            [Payment Service]     [Inventory Service]    [Notification Svc]│
│            (Consumer Group)      (Consumer Group)       (Consumer Group) │
│                    │                     │                     │       │
│                    ▼                     ▼                     ▼       │
│            [Kafka: payments]     [Kafka: inventory]     [Kafka: notifications]│
│                    │                     │                     │       │
│                    ▼                     ▼                     ▼       │
│            [Payment Gateway]     [Warehouse System]     [Email/SMS/Push]│
│                                                                      │
│  [Monitoring] ◀── Prometheus + Grafana ◀── Kafka JMX Exporter       │
│  [Alerting]   ◀── PagerDuty/Slack ◀── Alert Rules                  │
└─────────────────────────────────────────────────────────────────────┘
```

#### Topic Design

| Topic | Partitions | Key | Retensi | Use Case |
|---|---|---|---|---|
| `orders` | 6 | `order_id` | 7 hari | Order lifecycle events |
| `payments` | 6 | `order_id` | 30 hari | Payment status updates |
| `inventory` | 3 | `product_id` | 7 hari | Stock level changes |
| `shipping` | 3 | `order_id` | 30 hari | Shipping status updates |
| `notifications` | 3 | `customer_id` | 3 hari | Notification requests |
| `orders-dlq` | 1 | - | 90 hari | Failed order events |

#### Consumer Group Design

| Consumer Group | Topics | Consumer Count | Purpose |
|---|---|---|---|
| `payment-processors` | `orders` | 6 | Process payments for new orders |
| `inventory-updaters` | `orders` | 3 | Reserve stock for orders |
| `notification-senders` | `orders`, `payments`, `shipping` | 3 | Send notifications to customers |
| `analytics-consumers` | `orders`, `payments`, `inventory` | 6 | Real-time analytics |
| `dlq-handlers` | `orders-dlq` | 1 | Investigate and replay failed events |

#### Implementation Checklist

- [ ] Setup Kafka cluster dengan 3 broker minimum
- [ ] Buat topics dengan replication factor 3
- [ ] Configure producer dengan `acks=all` dan `enable.idempotence=true`
- [ ] Setup consumer dengan manual commit dan idempotent processing
- [ ] Configure DLQ topic dan retry logic dengan exponential backoff
- [ ] Setup Prometheus + Grafana untuk monitoring
- [ ] Configure alerting untuk consumer lag > 10,000
- [ ] Setup Schema Registry untuk event schema management
- [ ] Load test dengan 10x traffic spike simulation
- [ ] Disaster recovery test (kill broker, verify no data loss)

---

## 📚 REFERENSI

| Sumber | Link | Topik |
|---|---|---|
| donnemartin/system-design-primer | [GitHub](https://github.com/donnemartin/system-design-primer#message-queues) | Message queue overview, comparison |
| Apache Kafka Documentation | [kafka.apache.org](https://kafka.apache.org/documentation/) | Kafka concepts, configuration, APIs |
| RabbitMQ Documentation | [rabbitmq.com](https://www.rabbitmq.com/documentation.html) | Exchanges, queues, clustering, plugins |
| Confluent Kafka Guide | [confluent.io](https://docs.confluent.io/platform/current/kafka/) | Kafka best practices, monitoring |
| Event-Driven Architecture | [martinfowler.com](https://martinfowler.com/articles/201701-event-driven.html) | EDA patterns, benefits, challenges |
| Kafka vs RabbitMQ | [confluent.io/blog](https://www.confluent.io/blog/kafka-vs-rabbitmq/) | Detailed comparison |

---

## ✅ CHECKLIST PEMAHAMAN

### Fundamentals
- [ ] Bisa jelaskan perbedaan producer, consumer, broker, queue, topic, partition
- [ ] Paham mengapa message queue diperlukan (decoupling, async, buffering)
- [ ] Bisa bedakan synchronous vs asynchronous communication

### RabbitMQ
- [ ] Paham 4 exchange types (direct, fanout, topic, headers) dan kapan pakai masing-masing
- [ ] Bisa menulis producer dan consumer RabbitMQ dengan Python
- [ ] Paham clustering, mirroring, dan quorum queues
- [ ] Tahu cara setup DLQ di RabbitMQ

### Kafka
- [ ] Paham konsep topic, partition, offset, broker, consumer group
- [ ] Paham replication, ISR, dan leader election
- [ ] Bisa menulis producer dan consumer Kafka dengan Python
- [ ] Paham mengapa consumer group max = jumlah partition

### Delivery Semantics
- [ ] Bisa jelaskan at-most-once, at-least-once, exactly-once
- [ ] Tahu implementasi idempotent consumer
- [ ] Paham trade-off antara reliability dan performance

### Architecture
- [ ] Paham event sourcing dan keuntungannya
- [ ] Paham CQRS dan kapan menggunakannya
- [ ] Bisa design message queue system untuk use case nyata
- [ ] Tahu cara monitor dan troubleshoot message queue issues

### Comparison
- [ ] Bisa bandingkan Kafka vs RabbitMQ vs Redis Streams vs AWS SQS
- [ ] Tahu kapan memilih masing-masing berdasarkan use case

---

> **Lanjut ke:** [`05-event-sourcing-cqrs.md`](./05-event-sourcing-cqrs.md)
> **Kembali ke:** [`03-distributed-systems.md`](./03-distributed-systems.md)
