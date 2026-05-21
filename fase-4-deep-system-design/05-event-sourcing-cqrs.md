# 05 — Event Sourcing & CQRS

> **Estimasi:** 2 jam | **Level:** Advanced
> **Referensi:** [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) — bagian Message Queues, Database Scaling

---

## 📖 TEORI MENDALAM

### Bagian 1: Event Sourcing

#### 1.1 Apa Itu Event Sourcing?

Event Sourcing adalah **pola arsitektur** di mana state aplikasi tidak disimpan sebagai snapshot terkini, melainkan sebagai **urutan kejadian (events)** yang terjadi sepanjang waktu.

Konsep ini pertama kali dipopulerkan oleh **Martin Fowler** dalam artikelnya "Event Sourcing" (2005). Ide dasarnya sederhana: alih-alih menyimpan *state*, kita menyimpan *perubahan*.

```
┌─────────────────────────────────────────────────────────────┐
│                   TRADISIONAL (State-based)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  UPDATE accounts SET balance = 50000 WHERE id = 1;          │
│                                                              │
│  → Hanya state terakhir yang tersimpan                       │
│  → Tidak ada history bagaimana balance jadi 50000            │
│  → Kalau ada bug, tidak bisa audit kenapa                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   EVENT SOURCING (Event-based)               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Event 1: AccountOpened   {id: 1, date: "2026-01-01"}       │
│  Event 2: MoneyDeposited  {id: 1, amount: 100000}            │
│  Event 3: MoneyWithdrawn  {id: 1, amount: 50000}             │
│  Event 4: MoneyDeposited  {id: 1, amount: 50000}             │
│                                                              │
│  → Semua history tersimpan                                   │
│  → Balance = replay semua events = 100000                    │
│  → Audit trail lengkap                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 1.2 Mengapa Event Sourcing?

**Masalah yang dipecahkan:**

1. **Audit Trail** — Di industri perbankan, regulasi mewajibkan pencatatan setiap perubahan data. Event sourcing memberikan ini secara native.

2. **Temporal Query** — "Berapa balance user X pada tanggal 15 Maret 2025?" Dengan state-based, ini hampir mustahil tanpa tabel history terpisah. Dengan event sourcing, tinggal replay events sampai tanggal tersebut.

3. **Debugging** — Ketika ada bug, kita bisa melihat urutan events yang menyebabkan state yang salah.

4. **Event Replay** — Bisa membangun read model baru dari events yang sudah ada.

5. **Eventual Consistency** — Events bisa diproses secara asynchronous, memungkinkan sistem yang lebih scalable.

#### 1.3 Event Store Design

Event Store adalah database khusus untuk menyimpan events. Bukan database relasional biasa.

**Struktur Event Store:**

```sql
CREATE TABLE events (
    event_id        UUID PRIMARY KEY,          -- Unique ID event
    aggregate_id    UUID NOT NULL,             -- ID entity yang berubah
    aggregate_type  VARCHAR(50) NOT NULL,      -- Tipe entity (Account, Order)
    event_type      VARCHAR(50) NOT NULL,      -- Tipe event
    event_version   INT NOT NULL,              -- Versi event (1, 2, 3...)
    payload         JSONB NOT NULL,            -- Data event
    metadata        JSONB,                     -- Info tambahan (user_id, timestamp)
    created_at      TIMESTAMP DEFAULT NOW(),   -- Waktu event terjadi
    CONSTRAINT unique_aggregate_version UNIQUE (aggregate_id, event_version)
);

-- Index untuk query cepat
CREATE INDEX idx_aggregate_id ON events(aggregate_id);
CREATE INDEX idx_created_at ON events(created_at);
CREATE INDEX idx_aggregate_type ON events(aggregate_type);
```

**Event Stream:**

```
Aggregate: Account (id: acc-123)

Stream: events WHERE aggregate_id = 'acc-123' ORDER BY event_version

Version  Event Type          Payload
───────  ──────────────────  ────────────────────────────────
1        AccountOpened       {owner: "Budi", currency: "IDR"}
2        MoneyDeposited      {amount: 100000, source: "ATM"}
3        MoneyWithdrawn      {amount: 50000, dest: "Transfer"}
4        MoneyDeposited      {amount: 25000, source: "Branch"}
5        AccountClosed       {reason: "Customer request"}
```

**Optimistic Concurrency Control:**

```python
class EventStore:
    def save_events(self, aggregate_id: str, events: list, expected_version: int):
        """
        Simpan events dengan optimistic concurrency.
        expected_version = versi terakhir yang dibaca.
        Kalau ada yang sudah menulis events baru, version tidak match → conflict.
        """
        current_version = self.get_latest_version(aggregate_id)

        if current_version != expected_version:
            raise ConcurrencyError(
                f"Version mismatch: expected {expected_version}, "
                f"but current is {current_version}"
            )

        for i, event in enumerate(events):
            event.event_version = expected_version + i + 1
            event.aggregate_id = aggregate_id
            self._insert(event)
```

#### 1.4 Event Schema dan Versioning

Events harus memiliki schema yang jelas. Seiring waktu, schema akan berubah. Bagaimana cara menanganinya?

**Strategi 1: Upcasters (Schema Evolution)**

```python
# Event versi lama (v1)
{
    "event_type": "MoneyDeposited",
    "event_version": 1,
    "payload": {
        "amount": 100000,           # dalam sen/rupiah
        "source": "ATM"
    }
}

# Event versi baru (v2) — menambahkan field
{
    "event_type": "MoneyDeposited",
    "event_version": 2,
    "payload": {
        "amount": 100000,
        "currency": "IDR",          # Field baru
        "source": "ATM",
        "branch_code": "001"        # Field baru
    }
}

# Upcaster — convert v1 ke v2 saat read
def upcast_event(event: dict) -> dict:
    if event["event_type"] == "MoneyDeposited" and event["event_version"] == 1:
        event["payload"]["currency"] = "IDR"      # Default
        event["payload"]["branch_code"] = None     # Default
        event["event_version"] = 2
    return event
```

**Strategi 2: Append-Only Schema**

```
Prinsip: JANGAN pernah mengubah atau menghapus field yang sudah ada.
Hanya boleh MENAMBAH field baru.

Event v1: {name, email}
Event v2: {name, email, phone}     # OK — tambah field
Event v3: {name, email, phone, age} # OK — tambah field lagi

Bukan: Event v2: {full_name, email}  # SALAH — rename field
```

**Strategi 3: Payload sebagai JSON**

```json
{
    "event_type": "OrderPlaced",
    "aggregate_id": "ord-456",
    "event_version": 1,
    "payload": {
        "items": [
            {"product_id": "prod-1", "quantity": 2, "price": 50000},
            {"product_id": "prod-2", "quantity": 1, "price": 75000}
        ],
        "total": 175000,
        "customer_id": "cust-789"
    },
    "metadata": {
        "user_id": "user-123",
        "ip_address": "192.168.1.1",
        "correlation_id": "corr-abc",
        "causation_id": "caus-xyz"
    }
}
```

#### 1.5 Event Replay

Event replay adalah kemampuan untuk **mem-build ulang state** dari awal dengan memproses semua events secara berurutan.

```python
class Account:
    def __init__(self):
        self.id = None
        self.balance = 0
        self.status = "inactive"
        self.owner = None

    def apply_event(self, event: dict):
        """Apply satu event ke state"""
        event_type = event["event_type"]
        payload = event["payload"]

        if event_type == "AccountOpened":
            self.id = event["aggregate_id"]
            self.owner = payload["owner"]
            self.status = "active"

        elif event_type == "MoneyDeposited":
            self.balance += payload["amount"]

        elif event_type == "MoneyWithdrawn":
            if self.balance < payload["amount"]:
                raise InsufficientFundsError("Saldo tidak cukup")
            self.balance -= payload["amount"]

        elif event_type == "AccountClosed":
            self.status = "closed"

    def rebuild_from_events(self, events: list):
        """Rebuild state dari semua events"""
        for event in events:
            self.apply_event(event)

# Contoh penggunaan
events = event_store.get_events("acc-123")
account = Account()
account.rebuild_from_events(events)
print(f"Balance: {account.balance}")  # 100000
```

#### 1.6 Snapshotting

**Masalah:** Kalau ada jutaan events, replay dari awal sangat lambat.

**Solusi:** Simpan snapshot state secara berkala.

```
┌──────────────────────────────────────────────────────────────┐
│                      SNAPSHOT STRATEGY                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Events:  [1][2][3][4][5][6][7][8][9][10][11][12]...[1000]  │
│                                                               │
│  Snapshot di event ke-100, 200, 300, ...                      │
│                                                               │
│  Snapshot at 500:                                             │
│  {                                                            │
│    "aggregate_id": "acc-123",                                 │
│    "version": 500,                                            │
│    "state": {                                                 │
│      "balance": 2500000,                                      │
│      "status": "active",                                      │
│      "owner": "Budi",                                         │
│      "last_transaction": "2026-03-15"                         │
│    }                                                          │
│  }                                                            │
│                                                               │
│  Untuk rebuild state:                                         │
│  1. Load snapshot terbaru (version 900)                       │
│  2. Replay events dari version 901 sampai terakhir (1000)     │
│  3. Hanya replay 100 events, bukan 1000!                      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Implementasi Snapshot:**

```python
class SnapshotStore:
    def save_snapshot(self, aggregate_id: str, version: int, state: dict):
        """Simpan snapshot setiap N events"""
        snapshot = {
            "aggregate_id": aggregate_id,
            "version": version,
            "state": state,
            "created_at": datetime.now()
        }
        self._upsert(snapshot)

    def get_latest_snapshot(self, aggregate_id: str) -> dict:
        """Ambil snapshot terbaru"""
        return self._query(
            "SELECT * FROM snapshots "
            "WHERE aggregate_id = %s "
            "ORDER BY version DESC LIMIT 1",
            (aggregate_id,)
        )

class Aggregate:
    SNAPSHOT_INTERVAL = 100  # Snapshot setiap 100 events

    def save(self):
        """Simpan events dan snapshot jika perlu"""
        self.event_store.save_events(
            self.id, self.pending_events, self.version
        )

        if self.version % self.SNAPSHOT_INTERVAL == 0:
            self.snapshot_store.save_snapshot(
                self.id, self.version, self.get_state()
            )

    def load(self, aggregate_id: str):
        """Load aggregate dengan snapshot optimization"""
        # 1. Coba load snapshot terbaru
        snapshot = self.snapshot_store.get_latest_snapshot(aggregate_id)

        if snapshot:
            self.set_state(snapshot["state"])
            self.version = snapshot["version"]
            start_version = snapshot["version"] + 1
        else:
            start_version = 1

        # 2. Replay events setelah snapshot
        events = self.event_store.get_events_after(
            aggregate_id, start_version
        )
        for event in events:
            self.apply_event(event)
```

#### 1.7 Projections (Read Models)

Projection adalah **view** yang di-build dari events. Ini adalah bagian yang menghubungkan Event Sourcing dengan CQRS.

```
┌──────────────────────────────────────────────────────────────┐
│                     PROJECTION FLOW                           │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Events (Write Side)          Projections (Read Side)         │
│  ┌─────────────────┐          ┌─────────────────────────┐    │
│  │ AccountOpened   │────┐     │ AccountBalanceView      │    │
│  │ MoneyDeposited  │────┼────→│ - account_id            │    │
│  │ MoneyWithdrawn  │────┤     │ - balance               │    │
│  │ AccountClosed   │────┘     │ - status                │    │
│  └─────────────────┘          │ - last_updated          │    │
│                               └─────────────────────────┘    │
│                               ┌─────────────────────────┐    │
│                               │ TransactionHistoryView  │    │
│                               │ - account_id            │    │
│                               │ - transactions[]        │    │
│                               │ - total_deposits        │    │
│                               │ - total_withdrawals     │    │
│                               └─────────────────────────┘    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Implementasi Projection:**

```python
class ProjectionHandler:
    """Handler yang memproses events dan update read model"""

    def __init__(self, read_db):
        self.read_db = read_db
        self.handlers = {
            "AccountOpened": self.handle_account_opened,
            "MoneyDeposited": self.handle_money_deposited,
            "MoneyWithdrawn": self.handle_money_withdrawn,
            "AccountClosed": self.handle_account_closed,
        }

    def handle(self, event: dict):
        """Proses satu event dan update read model"""
        handler = self.handlers.get(event["event_type"])
        if handler:
            handler(event)
            self._update_projection_position(event)

    def handle_account_opened(self, event: dict):
        self.read_db.execute("""
            INSERT INTO account_balance_view
            (account_id, balance, status, last_updated)
            VALUES (%s, 0, 'active', NOW())
        """, (event["aggregate_id"],))

    def handle_money_deposited(self, event: dict):
        self.read_db.execute("""
            UPDATE account_balance_view
            SET balance = balance + %s,
                last_updated = NOW()
            WHERE account_id = %s
        """, (event["payload"]["amount"], event["aggregate_id"]))

    def handle_money_withdrawn(self, event: dict):
        self.read_db.execute("""
            UPDATE account_balance_view
            SET balance = balance - %s,
                last_updated = NOW()
            WHERE account_id = %s
        """, (event["payload"]["amount"], event["aggregate_id"]))

    def handle_account_closed(self, event: dict):
        self.read_db.execute("""
            UPDATE account_balance_view
            SET status = 'closed',
                last_updated = NOW()
            WHERE account_id = %s
        """, (event["aggregate_id"],))
```

#### 1.8 Manfaat dan Tantangan Event Sourcing

**Manfaat:**

| Manfaat | Penjelasan |
|---------|------------|
| **Audit Trail** | Setiap perubahan tercatat, cocok untuk compliance (OJK, BI) |
| **Temporal Query** | Bisa query state di waktu tertentu |
| **Event Replay** | Bisa rebuild read model baru dari events lama |
| **Debugging** | Mudah trace kenapa state jadi seperti ini |
| **Decoupling** | Events bisa dikonsumsi banyak consumer |
| **Performance** | Write model bisa dioptimasi terpisah dari read model |

**Tantangan:**

| Tantangan | Penjelasan | Solusi |
|-----------|------------|--------|
| **Kompleksitas** | Lebih sulit dipahami developer baru | Dokumentasi, training |
| **Storage** | Events menumpuk seiring waktu | Snapshotting, archival |
| **Query Performance** | Replay events lambat untuk aggregate besar | Snapshotting |
| **Event Versioning** | Schema berubah seiring waktu | Upcasters, append-only |
| **Eventual Consistency** | Read model mungkin tidak segera update | Accept tradeoff, atau use sync projection |
| **Idempotency** | Event yang sama bisa diproses 2x | Idempotent handlers, event deduplication |

---

### Bagian 2: CQRS (Command Query Responsibility Segregation)

#### 2.1 Konsep Dasar CQRS

CQRS memisahkan **operasi write (Command)** dari **operasi read (Query)** ke dalam model yang berbeda. Ini berbeda dari Event Sourcing — CQRS bisa digunakan TANPA Event Sourcing.

```
┌──────────────────────────────────────────────────────────────┐
│                    ARSITEKTUR CQRS                           │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│                    ┌──────────────┐                           │
│                    │    Client     │                           │
│                    └──────┬───────┘                           │
│                           │                                   │
│              ┌────────────┴────────────┐                      │
│              │                         │                      │
│              ▼                         ▼                      │
│     ┌────────────────┐      ┌──────────────────┐             │
│     │  Command Side  │      │   Query Side     │             │
│     │   (Write)      │      │   (Read)         │             │
│     ├────────────────┤      ├──────────────────┤             │
│     │ CreateOrder    │      │ GetOrderById     │             │
│     │ UpdateOrder    │      │ SearchOrders     │             │
│     │ CancelOrder    │      │ GetOrderStats    │             │
│     │                │      │ GetOrderHistory  │             │
│     │ Validasi bisnis│      │ Query kompleks   │             │
│     │ Emit events    │      │ Materialized     │             │
│     │                │      │ views            │             │
│     └───────┬────────┘      └────────┬─────────┘             │
│             │                        │                        │
│             ▼                        ▼                        │
│     ┌───────────────┐      ┌──────────────────┐             │
│     │  Write Model  │      │   Read Model     │             │
│     │  (Normalized) │      │  (Denormalized)  │             │
│     │               │      │                  │             │
│     │ - Validasi    │      │ - Optimized for │             │
│     │ - Invariants  │      │   read perf      │             │
│     │ - Business    │      │ - Indexes        │             │
│     │   rules       │      │ - Aggregations   │             │
│     └───────┬───────┘      └────────┬─────────┘             │
│             │                       │                        │
│             │    ┌──────────────┐   │                        │
│             └───→│   Sync       │───┘                        │
│                  │   Mechanism  │                            │
│                  │   (Events,   │                            │
│                  │    CDC,      │                            │
│                  │    Triggers) │                            │
│                  └──────────────┘                            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 2.2 Command vs Query Model

**Command Model (Write Side):**

```python
class CreateOrderCommand:
    """Command untuk membuat order baru"""
    def __init__(self, customer_id: str, items: list, shipping_address: dict):
        self.customer_id = customer_id
        self.items = items
        self.shipping_address = shipping_address
        self.command_id = str(uuid4())
        self.timestamp = datetime.now()

class OrderCommandHandler:
    """Handler yang memproses command"""

    def handle(self, command: CreateOrderCommand):
        # 1. Validasi
        self._validate_command(command)

        # 2. Load aggregate
        customer = self.customer_repo.load(command.customer_id)

        # 3. Apply business logic
        order = Order.create(
            customer_id=command.customer_id,
            items=command.items,
            shipping_address=command.shipping_address
        )

        # 4. Simpan (emit events jika pakai Event Sourcing)
        self.order_repo.save(order)

        # 5. Emit events untuk sync ke read model
        for event in order.pending_events:
            self.event_bus.publish(event)

        return order.id
```

**Query Model (Read Side):**

```python
class OrderQueryService:
    """Service untuk query order — read model yang denormalized"""

    def get_order_by_id(self, order_id: str) -> dict:
        """Query sederhana — langsung dari read model"""
        return self.read_db.execute("""
            SELECT * FROM order_read_model WHERE order_id = %s
        """, (order_id,))

    def search_orders(self, customer_id: str, status: str = None,
                      date_from: str = None, date_to: str = None) -> list:
        """Query kompleks dengan filter"""
        query = "SELECT * FROM order_read_model WHERE customer_id = %s"
        params = [customer_id]

        if status:
            query += " AND status = %s"
            params.append(status)

        if date_from:
            query += " AND created_at >= %s"
            params.append(date_from)

        if date_to:
            query += " AND created_at <= %s"
            params.append(date_to)

        query += " ORDER BY created_at DESC"
        return self.read_db.execute(query, params)

    def get_order_stats(self, customer_id: str) -> dict:
        """Query agregasi — sudah pre-computed di read model"""
        return self.read_db.execute("""
            SELECT
                COUNT(*) as total_orders,
                SUM(total_amount) as total_spent,
                AVG(total_amount) as avg_order_value,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders
            FROM order_read_model
            WHERE customer_id = %s
        """, (customer_id,))
```

#### 2.3 Eventual Consistency dalam CQRS

Dalam CQRS, read model **tidak selalu sinkron** dengan write model. Ada delay antara write dan read.

```
┌──────────────────────────────────────────────────────────────┐
│                 EVENTUAL CONSISTENCY TIMELINE                │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  T0: User klik "Buat Order"                                  │
│      → Command dikirim ke Write Side                         │
│      → Order dibuat, events di-emit                          │
│                                                               │
│  T1: Write Side selesai (10ms)                               │
│      → Return order_id ke user                               │
│      → User lihat "Order berhasil dibuat!"                   │
│                                                               │
│  T2: Event sampai ke Read Side (50-200ms delay)              │
│      → Projection handler memproses event                    │
│      → Read model di-update                                  │
│                                                               │
│  T3: User buka halaman "Detail Order"                        │
│      → Query ke Read Side                                    │
│      → Jika T2 belum selesai: order belum muncul!            │
│      → Solusi: loading state, atau query ke write side       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Menangani Eventual Consistency:**

```python
class OrderService:
    def get_order_after_create(self, order_id: str) -> dict:
        """
        Strategi: setelah create, query langsung ke write model
        untuk menghindari eventual consistency issue.
        """
        # Untuk detail order yang baru dibuat, baca dari write model
        return self.write_db.get_order(order_id)

    def list_orders(self, customer_id: str) -> list:
        """
        Untuk list/search, baca dari read model (lebih cepat).
        User bisa tolerate eventual consistency di sini.
        """
        return self.read_db.search_orders(customer_id)
```

#### 2.4 CQRS + Event Sourcing: Kombinasi Powerful

```
┌──────────────────────────────────────────────────────────────┐
│              CQRS + EVENT SOURCING ARCHITECTURE              │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                   COMMAND SIDE                       │     │
│  │                                                      │     │
│  │  Command → Handler → Aggregate → Events → EventStore│     │
│  │                                                      │     │
│  │  Write Model = Aggregates (in-memory state)          │     │
│  │  Storage = Event Store (append-only)                 │     │
│  └──────────────────────┬──────────────────────────────┘     │
│                         │                                     │
│                         │ Events (published)                  │
│                         ▼                                     │
│  ┌─────────────────────────────────────────────────────┐     │
│  │              MESSAGE BROKER / EVENT BUS              │     │
│  │  (Kafka, RabbitMQ, AWS EventBridge, Redis Streams)  │     │
│  └──────────────────────┬──────────────────────────────┘     │
│                         │                                     │
│                    ┌────┴────┐                                │
│                    ▼         ▼                                │
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │   QUERY SIDE         │  │   QUERY SIDE         │         │
│  │   Projection 1       │  │   Projection 2       │         │
│  │                      │  │                      │         │
│  │  OrderReadModel      │  │  AnalyticsReadModel  │         │
│  │  (PostgreSQL)        │  │  (Elasticsearch)     │         │
│  │                      │  │                      │         │
│  │  - GetOrderById      │  │  - SearchOrders      │         │
│  │  - ListOrders        │  │  - OrderAnalytics    │         │
│  │  - OrderStats        │  │  - TrendAnalysis     │         │
│  └──────────────────────┘  └──────────────────────┘         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### Bagian 3: Contoh Dunia Nyata

#### 3.1 Sistem Perbankan

```
┌──────────────────────────────────────────────────────────────┐
│              BANKING SYSTEM — EVENT SOURCING                 │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Commands:                                                    │
│  - OpenAccountCommand                                         │
│  - DepositMoneyCommand                                        │
│  - WithdrawMoneyCommand                                       │
│  - TransferMoneyCommand                                       │
│  - CloseAccountCommand                                        │
│                                                               │
│  Events:                                                      │
│  - AccountOpened {account_id, owner, type, currency}          │
│  - MoneyDeposited {account_id, amount, source, reference}     │
│  - MoneyWithdrawn {account_id, amount, destination, ref}      │
│  - MoneyTransferred {from_account, to_account, amount}        │
│  - AccountClosed {account_id, reason}                         │
│                                                               │
│  Projections:                                                 │
│  1. AccountBalanceView — balance terkini per account          │
│  2. TransactionHistoryView — history transaksi                │
│  3. DailyStatementView — laporan harian                       │
│  4. FraudDetectionView — pattern untuk deteksi fraud          │
│                                                               │
│  Kenapa Event Sourcing cocok untuk banking:                   │
│  - Regulatory compliance (OJK, BI) butuh audit trail lengkap  │
│  - Bisa reconstruct statement untuk periode tertentu          │
│  - Fraud detection bisa replay events dengan algorithm baru   │
│  - Transfer = 2 events (withdraw + deposit) → atomic          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Implementasi Transfer:**

```python
class TransferMoneyCommandHandler:
    def handle(self, command: TransferMoneyCommand):
        """Transfer uang dari account A ke account B"""

        # 1. Load kedua accounts
        source = self.account_repo.load(command.source_account_id)
        destination = self.account_repo.load(command.dest_account_id)

        # 2. Validasi
        if source.balance < command.amount:
            raise InsufficientFundsError()

        # 3. Buat events (dalam satu transaction)
        with self.unit_of_work.begin():
            # Withdraw dari source
            source.withdraw(command.amount)
            self.account_repo.save(source)

            # Deposit ke destination
            destination.deposit(command.amount)
            self.account_repo.save(destination)

            # Emit transfer event (untuk audit)
            transfer_event = MoneyTransferred(
                from_account=command.source_account_id,
                to_account=command.dest_account_id,
                amount=command.amount,
                reference=command.reference
            )
            self.event_store.append(transfer_event)

        # 4. Publish events ke event bus
        self.event_bus.publish(source.pending_events)
        self.event_bus.publish(destination.pending_events)
        self.event_bus.publish(transfer_event)
```

#### 3.2 E-Commerce

```
┌──────────────────────────────────────────────────────────────┐
│            E-COMMERCE — CQRS + EVENT SOURCING                │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Write Side (Command Model):                                  │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Commands:                                            │    │
│  │  - PlaceOrderCommand                                  │    │
│  │  - UpdateOrderStatusCommand                           │    │
│  │  - CancelOrderCommand                                 │    │
│  │  - AddToCartCommand                                   │    │
│  │  - ProcessPaymentCommand                              │    │
│  │                                                       │    │
│  │  Aggregates: Order, Cart, Payment                     │    │
│  │  Event Store: menyimpan semua order events            │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
│  Read Side (Query Models):                                    │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Projection 1: OrderListView (PostgreSQL)             │    │
│  │    - List order user                                  │    │
│  │    - Filter by status, date                           │    │
│  │                                                       │    │
│  │  Projection 2: ProductSearchView (Elasticsearch)      │    │
│  │    - Full-text search produk                          │    │
│  │    - Faceted search (kategori, harga, rating)         │    │
│  │                                                       │    │
│  │  Projection 3: DashboardView (Redis)                  │    │
│  │    - Total orders hari ini                            │    │
│  │    - Revenue real-time                                │    │
│  │    - Top products                                     │    │
│  │                                                       │    │
│  │  Projection 4: RecommendationView (Neo4j)             │    │
│  │    - "Users who bought this also bought..."           │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### Bagian 4: Implementation Patterns

#### 4.1 Idempotent Event Handlers

```python
class IdempotentProjectionHandler:
    """
    Handler yang idempotent — memproses event yang sama
    berkali-kali menghasilkan state yang sama.
    """

    def __init__(self, read_db):
        self.read_db = read_db

    def handle(self, event: dict):
        # Cek apakah event sudah diproses
        if self._is_already_processed(event["event_id"]):
            return  # Skip, sudah diproses

        # Proses event
        self._process_event(event)

        # Mark sebagai sudah diproses
        self._mark_processed(event["event_id"])

    def _is_already_processed(self, event_id: str) -> bool:
        return self.read_db.execute(
            "SELECT 1 FROM processed_events WHERE event_id = %s",
            (event_id,)
        ) is not None

    def _mark_processed(self, event_id: str):
        self.read_db.execute(
            "INSERT INTO processed_events (event_id, processed_at) "
            "VALUES (%s, NOW())",
            (event_id,)
        )
```

#### 4.2 Outbox Pattern

```python
class OutboxPattern:
    """
    Memastikan events selalu di-publish ke event bus.
    Masalah: kalau save ke DB berhasil tapi publish ke bus gagal,
    events hilang. Outbox pattern mencegah ini.
    """

    def handle_command(self, command):
        with self.db.transaction():
            # 1. Proses command, simpan events ke DB
            aggregate = self.load_aggregate(command)
            aggregate.execute(command)
            self.save_aggregate(aggregate)

            # 2. Simpan events ke outbox table (dalam transaction yang sama)
            for event in aggregate.pending_events:
                self.outbox_repo.save({
                    "event_id": str(uuid4()),
                    "event_type": event.type,
                    "payload": json.dumps(event.payload),
                    "status": "pending",
                    "created_at": datetime.now()
                })

        # 3. Publish events dari outbox (bisa retry kalau gagal)
        self.publish_outbox_events()

    def publish_outbox_events(self):
        pending = self.outbox_repo.get_pending()
        for event in pending:
            try:
                self.event_bus.publish(event)
                self.outbox_repo.mark_published(event["event_id"])
            except Exception:
                # Retry later — event masih "pending"
                pass
```

#### 4.3 CQRS dengan Database Terpisah

```python
# Write database — normalized, optimized for writes
WRITE_DB_CONFIG = {
    "host": "write-db.internal",
    "database": "orders_write",
    "pool_size": 10,  # Koneksi lebih sedikit, write-heavy
}

# Read database — denormalized, optimized for reads
READ_DB_CONFIG = {
    "host": "read-db.internal",
    "database": "orders_read",
    "pool_size": 50,  # Koneksi lebih banyak, read-heavy
    "read_replicas": ["read-replica-1", "read-replica-2"],
}

# Sync mechanism — CDC (Change Data Capture)
# Menggunakan Debezium atau similar untuk capture changes
# dari write DB dan apply ke read DB
```

---

## ✅ CHECKLIST PEMAHAMAN

- [ ] Paham perbedaan Event Sourcing vs state-based storage
- [ ] Bisa mendesain Event Store dengan schema yang baik
- [ ] Paham event versioning dan upcasting
- [ ] Bisa implementasi event replay
- [ ] Paham kapan perlu snapshotting
- [ ] Bisa membuat projections/read models
- [ ] Paham CQRS: command vs query separation
- [ ] Paham eventual consistency dan cara menanganinya
- [ ] Bisa menggabungkan CQRS + Event Sourcing
- [ ] Paham idempotent event handlers
- [ ] Paham Outbox Pattern
- [ ] Tahu contoh real-world: banking, e-commerce

---

## 📚 REFERENSI

- [Martin Fowler — Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Martin Fowler — CQRS](https://martinfowler.com/bliki/CQRS.html)
- [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) — Message Queues, Database Scaling
- [Greg Young — CQRS and Event Sourcing](https://www.youtube.com/watch?v=JHGkaShoyNs)
- [Event Store — Official Documentation](https://www.eventstore.com/docs/)

---

> **Lanjut ke:** [`06-distributed-caching.md`](./06-distributed-caching.md)
