# 05 — Pola Konsistensi Data

> **Estimasi:** 2 jam | **Level:** Pemula → Menengah

---

## 📖 TEORI

### Latar Belakang

Setelah memahami CAP Theorem (Fase 04), kita tahu bahwa dalam sistem terdistribusi, kita sering harus memilih antara **consistency** dan **availability**. Tapi apa sebenarnya arti "consistency" dalam praktiknya? Bagaimana database memastikan data tidak rusak saat banyak proses berjalan bersamaan? Bagaimana sistem yang tersebar di seluruh dunia bisa "sepakat" tentang data yang sama?

Dalam materi ini, kita akan membahas secara mendalam:

1. **ACID Properties** — fondasi transaksi database
2. **3 Pola Konsistensi** — Strong, Eventual, Weak
3. **Distributed Consistency Challenges** — tantangan di sistem terdistribusi
4. **Two-Phase Commit (2PC) & Three-Phase Commit (3PC)** — protokol transaksi terdistribusi
5. **Konsensus Algorithms** — Paxos dan Raft
6. **Quorum Reads/Writes** — mekanisme voting data
7. **Vector Clocks** — pelacakan waktu kausal
8. **Conflict Resolution** — strategi menyelesaikan konflik data
9. **Real-World Examples** — Google Spanner dan DynamoDB

---

## BAGIAN 1: ACID Properties — Fondasi Transaksi Database

### Apa Itu ACID?

ACID adalah singkatan dari 4 properti yang menjamin transaksi database berjalan dengan **andal dan predictable**. Setiap transaksi yang memenuhi ACID dijamin tidak akan merusak data, bahkan saat terjadi kegagalan sistem.

```
    A        C        I        D
    │        │        │        │
    ▼        ▼        ▼        ▼
Atomic   Consistent  Isolated  Durable
```

### 1. Atomicity (Atomisitas) — "All or Nothing"

**Definisi:** Sebuah transaksi bersifat atomik — **semua operasi berhasil, atau tidak ada satupun yang berhasil**. Tidak ada keadaan "setengah jadi".

**Analogi:** Seperti transfer uang antar rekening. Jika uang Rp 500.000 ditransfer dari Rekening A ke Rekening B:
- Debit Rekening A: Rp 500.000 ✅
- Credit Rekening B: Rp 500.000 ✅
- **Kedua operasi harus berhasil bersama.** Jika yang kedua gagal, yang pertama harus di-rollback.

**Mekanisme:**
```
Transaksi Transfer Rp 500.000:
┌─────────────────────────────────────┐
│ BEGIN TRANSACTION                   │
│   UPDATE rekening A SET saldo = saldo - 500000  │
│   UPDATE rekening B SET saldo = saldo + 500000  │
│   IF kedua update berhasil:         │
│     COMMIT  ← semua permanen        │
│   ELSE:                             │
│     ROLLBACK ← semua dibatalkan     │
│ END TRANSACTION                     │
└─────────────────────────────────────┘
```

**Implementasi:** Database menggunakan **undo log** (catatan sebelum perubahan) dan **redo log** (catatan setelah perubahan) untuk mendukung atomicity:
- **Undo log:** Menyimpan nilai lama sebelum diubah. Digunakan saat ROLLBACK.
- **Redo log:** Menyimpan nilai baru setelah diubah. Digunakan saat recovery setelah crash.

**Contoh kode (pseudo-SQL):**
```sql
BEGIN TRANSACTION;

-- Simpan undo log
SAVEPOINT before_transfer;

UPDATE rekening SET saldo = saldo - 500000 WHERE id = 'A';
-- Jika saldo jadi negatif, rollback
IF (SELECT saldo FROM rekening WHERE id = 'A') < 0 THEN
    ROLLBACK TO before_transfer;
    COMMIT; -- Commit dalam keadaan rollback
    RETURN 'Saldo tidak cukup';
END IF;

UPDATE rekening SET saldo = saldo + 500000 WHERE id = 'B';

-- Jika semua berhasil
COMMIT;
```

### 2. Consistency (Konsistensi) — "Data Tetap Valid"

**Definisi:** Transaksi membawa database dari satu **state yang valid** ke **state yang valid lainnya**. Semua constraint, rule, dan trigger harus tetap terpenuhi.

**Contoh constraint yang harus dijaga:**
```sql
-- Constraint: saldo tidak boleh negatif
ALTER TABLE rekening ADD CONSTRAINT saldo_positif CHECK (saldo >= 0);

-- Constraint: total transfer harus sama dengan total debit
-- (ini adalah business rule, bukan constraint SQL langsung)
```

**Bagaimana Consistency bekerja:**

```
State Awal (Valid):
┌──────────┬─────────┐
│ Rekening │ Saldo   │
├──────────┼─────────┤
│ A        │ 1.000.000│
│ B        │   500.000│
│ Total    │ 1.500.000│ ← Valid
└──────────┴─────────┘

Transaksi: Transfer 2.000.000 dari A ke B
→ A akan jadi -1.000.000 → VIOLATES constraint saldo >= 0
→ Transaksi DITOLAK, database tetap di state awal

State Akhir (Tetap Valid):
┌──────────┬─────────┐
│ Rekening │ Saldo   │
├──────────┼─────────┤
│ A        │ 1.000.000│ ← Tidak berubah
│ B        │   500.000│
│ Total    │ 1.500.000│ ← Masih valid
└──────────┴─────────┘
```

**Penting:** Consistency di ACID **berbeda** dengan Consistency di CAP Theorem:
- **ACID Consistency:** Tentang validitas data (constraint, rule, trigger)
- **CAP Consistency:** Tentang semua node melihat data yang sama (linearizability)

### 3. Isolation (Isolasi) — "Transaksi Tidak Saling Ganggu"

**Definisi:** Transaksi yang berjalan bersamaan (concurrent) harus terisolasi satu sama lain, seolah-olah mereka berjalan **secara berurutan (serial)**.

**Masalah tanpa Isolation:**

```
Tanpa Isolation — Race Condition:

Waktu  Transaksi A              Transaksi B
─────  ─────────────            ─────────────
T1     READ saldo A = 1.000.000
T2                                  READ saldo A = 1.000.000
T3     saldo A = 1.000.000 - 200.000 = 800.000
T4                                  saldo A = 1.000.000 - 300.000 = 700.000
T5     WRITE saldo A = 800.000
T6                                  WRITE saldo A = 700.000  ← Menimpa A!

Hasil: Saldo A = 700.000 (salah! seharusnya 500.000)
Transaksi A "hilang" (Lost Update Problem)
```

**Isolation Levels (dari paling lemah ke paling kuat):**

| Level | Dirty Read | Non-Repeatable Read | Phantom Read | Performa |
|---|---|---|---|---|
| Read Uncommitted | ✅ Mungkin | ✅ Mungkin | ✅ Mungkin | Tercepat |
| Read Committed | ❌ Tidak | ✅ Mungkin | ✅ Mungkin | Cepat |
| Repeatable Read | ❌ Tidak | ❌ Tidak | ✅ Mungkin | Sedang |
| Serializable | ❌ Tidak | ❌ Tidak | ❌ Tidak | Ter lambat |

**Penjelasan masing-masing level:**

```
1. READ UNCOMMITTED (Paling lemah)
   - Bisa membaca data yang BELUM di-commit oleh transaksi lain
   - Contoh: Transaksi A mengubah saldo tapi belum commit
             Transaksi B sudah bisa membaca perubahan itu
   - Jika A rollback, B sudah membaca data yang salah (Dirty Read)

2. READ COMMITTED (Default di PostgreSQL, Oracle)
   - Hanya membaca data yang SUDAH di-commit
   - Tapi: baca berulang di transaksi yang sama bisa dapat hasil berbeda
   - Contoh: T1 baca saldo = 1.000.000
             Transaksi lain commit, ubah saldo jadi 800.000
             T2 baca saldo = 800.000 (berbeda!) → Non-Repeatable Read

3. REPEATABLE READ (Default di MySQL InnoDB)
   - Baca berulang di transaksi yang sama SELALU dapat hasil sama
   - Tapi: range query bisa dapat baris baru (Phantom Read)
   - Contoh: SELECT COUNT(*) FROM orders WHERE total > 100 → 5 baris
             Transaksi lain INSERT order baru (total > 100), commit
             SELECT COUNT(*) lagi → 6 baris (phantom!)

4. SERIALIZABLE (Paling kuat)
   - Transaksi berjalan seolah-olah serial (satu per satu)
   - Tidak ada masalah concurrency
   - Tapi: performa paling lambat, banyak transaksi harus antri
```

**Implementasi Isolation:**
- **Locking (Pessimistic):** Kunci data saat transaksi berjalan
- **MVCC (Optimistic):** Multi-Version Concurrency Control — setiap transaksi melihat "snapshot" data

```
MVCC Concept:
Data di database punya banyak versi:

Versi 1: saldo = 1.000.000 (committed by Txn X at T=1)
Versi 2: saldo = 800.000  (committed by Txn Y at T=5)
Versi 3: saldo = 600.000  (committed by Txn Z at T=10)

Transaksi yang mulai di T=3 → lihat Versi 1 (snapshot saat T=3)
Transaksi yang mulai di T=7 → lihat Versi 2 (snapshot saat T=7)
Transaksi yang mulai di T=12 → lihat Versi 3 (snapshot saat T=12)

Setiap transaksi melihat dunia yang konsisten dengan waktu mulainya.
```

### 4. Durability (Durabilitas) — "Data Tidak Hilang"

**Definisi:** Setelah transaksi di-COMMIT, perubahan bersifat **permanen** — tidak akan hilang bahkan jika terjadi crash, power failure, atau bencana lainnya.

**Mekanisme:**

```
Proses COMMIT dengan Write-Ahead Logging (WAL):

1. Transaksi mengubah data di memory (buffer pool)
2. Perubahan dicatat ke WAL file di disk SEBELUM data di-update
3. WAL di-flush ke disk (fsync)
4. Setelah WAL aman di disk → COMMIT dianggap selesai
5. Data di memory bisa di-flush ke disk nanti (checkpoint)

┌─────────────────────────────────────────────────┐
│                  COMMIT Process                  │
│                                                  │
│  [Memory]  ── Write to buffer pool ──→ [Data]   │
│     │                                          │
│     ↓                                          │
│  [WAL Log] ── Write to disk ──→ [WAL File]     │
│     │                                          │
│     ↓ fsync                                    │
│  [Disk] ← Data AMAN di sini                    │
│     │                                          │
│     ↓ COMMIT confirmed                         │
│  [Client] ← "Transaksi berhasil!"              │
│                                                  │
│  Nanti (checkpoint):                            │
│  [WAL File] ── Apply changes ──→ [Data File]   │
└─────────────────────────────────────────────────┘
```

**Jaminan Durability:**
- WAL ditulis ke disk **sebelum** COMMIT dikonfirmasi
- Bahkan jika crash terjadi SETELAH COMMIT tapi SEBELUM data di-flush, WAL bisa digunakan untuk recovery
- Setelah recovery, semua transaksi yang sudah COMMIT akan di-replay dari WAL

**Trade-off:** Durability menambah latency karena harus menunggu disk I/O (fsync). Beberapa database menawarkan opsi "soft durability" untuk performa lebih tinggi dengan risiko kecil data loss.

---

## BAGIAN 2: 3 Pola Konsistensi Data

Ada **3 pola konsistensi** yang perlu dipahami:

```
Strong Consistency ────── Eventual Consistency ────── Weak Consistency
     (Paling ketat)           (Tengah-tengah)            (Paling longgar)
```

### 1. Strong Consistency (Konsistensi Kuat)

**Definisi:** Setelah data ditulis, **semua** read berikutnya akan melihat data terbaru. Ini juga disebut **linearizability**.

**Cara kerja:** Data direplikasi secara **sinkron** ke semua node sebelum write dianggap selesai.

```
User A menulis: X = 10
       ↓
[Node 1] ←── sinkron ──→ [Node 2] ←── sinkron ──→ [Node 3]
       ↓                      ↓                      ↓
   Semua node punya X = 10 SEBELUM write selesai

User B membaca dari node manapun → X = 10 ✅
```

**Kelebihan:**
- Data selalu akurat dan terbaru
- Mudah dipahami dan diprediksi
- Cocok untuk sistem yang butuh akurasi tinggi

**Kekurangan:**
- Lambat (harus tunggu semua node update)
- Tidak tersedia jika ada node yang down
- Throughput rendah

**Contoh penggunaan:**
- Sistem perbankan (saldo harus akurat)
- Sistem inventory (stok harus konsisten)
- Sistem booking (tidak boleh double booking)

### 2. Eventual Consistency (Konsistensi Eventual)

**Definisi:** Setelah data ditulis, read **pada akhirnya** akan melihat data terbaru (biasanya dalam milidetik).

**Cara kerja:** Data direplikasi secara **asinkron** ke semua node.

```
User A menulis: X = 10
       ↓
[Node 1] update langsung → X = 10 ✅
       ↓
   (asinkron, delay beberapa ms)
       ↓
[Node 2] update nanti → X = 10
[Node 3] update nanti → X = 10

User B membaca dari Node 2 dalam 5ms pertama → X = 5 (data lama) ❌
User B membaca dari Node 2 setelah 100ms → X = 10 (data baru) ✅
```

**Kelebihan:**
- Cepat (write tidak tunggu semua node)
- Selalu tersedia (node bisa serve data meskipun belum ter-update)
- Throughput tinggi

**Kekurangan:**
- Data mungkin tidak terbaru untuk beberapa saat
- Sulit diprediksi (berapa lama "eventual"?)
- Bisa menyebabkan kebingungan user

**Contoh penggunaan:**
- Social media (like, comment)
- DNS (domain name resolution)
- Email
- Counter views

### 3. Weak Consistency (Konsistensi Lemah)

**Definisi:** Setelah data ditulis, read **mungkin atau mungkin tidak** melihat data terbaru. Best effort approach.

**Cara kerja:** Tidak ada jaminan kapan data akan ter-replikasi.

```
User A menulis: X = 10
       ↓
[Node 1] update → X = 10
       ↓
   (tidak ada jaminan replikasi)
       ↓
[Node 2] mungkin update, mungkin tidak
[Node 3] mungkin update, mungkin tidak

User B membaca → bisa X = 10, bisa X = 5, tidak ada jaminan
```

**Kelebihan:**
- Paling cepat
- Paling available
- Paling sederhana

**Kekurangan:**
- Data sangat tidak konsisten
- Sulit di-debug
- Tidak cocok untuk kebanyakan aplikasi

**Contoh penggunaan:**
- VoIP (video call) — jika koneksi putus beberapa detik, Anda tidak "ketinggalan" apa yang diucapkan selama putus
- Realtime multiplayer games — posisi player bisa tidak sinkron sesaat
- Live streaming — jika buffer habis, Anda skip ke bagian terbaru

---

## BAGIAN 3: Distributed Consistency Challenges

### Tantangan Utama dalam Sistem Terdistribusi

Ketika data tersebar di banyak node (bahkan di banyak data center), menjaga konsistensi menjadi **jauh lebih kompleks**. Berikut tantangan utamanya:

### 1. Network Latency dan Partisi

```
Data Center Jakarta          Data Center Singapore
       │                            │
       │ ←── 50-150ms latency ──→   │
       │                            │
   [Node A]                     [Node B]
       │                            │
       │ ←── Network Partition ──→  │
       │     (koneksi putus!)       │

Saat partisi terjadi:
- Node A tidak bisa berkomunikasi dengan Node B
- Keduanya tidak tahu apakah yang lain masih hidup
- Keduanya harus memutuskan: terima write atau tolak?
```

**Masalah:** Jika kedua node tetap menerima write, data akan **divergen** (berbeda). Saat koneksi pulih, harus ada mekanisme **conflict resolution**.

### 2. Clock Skew (Perbedaan Jam)

```
Node A: Jam menunjukkan 10:00:00.000
Node B: Jam menunjukkan 10:00:00.150  ← 150ms lebih cepat!

Write di Node A: timestamp = 10:00:00.000
Write di Node B: timestamp = 10:00:00.150

Mana yang lebih "baru"? Node B menang karena timestamp lebih besar.
Tapi sebenarnya write di Node A mungkin terjadi SETELAH write di Node B
(jika Node B jamnya lebih cepat).
```

**Solusi:**
- **NTP (Network Time Protocol):** Sinkronisasi jam antar server (akurasi ~milidetik)
- **TrueTime API (Google Spanner):** Menggunakan GPS + atomic clock (akurasi ~nanodetik)
- **Logical Clocks:** Tidak pakai waktu fisik, pakai counter logis (Vector Clocks, Lamport Clocks)

### 3. Concurrent Writes (Write Bersamaan)

```
Dua user mengedit dokumen yang sama bersamaan:

User A (Node 1):                    User B (Node 2):
┌──────────────────────┐            ┌──────────────────────┐
│ Baca: title = "Doc"  │            │ Baca: title = "Doc"  │
│ Ubah: title = "Doc A"│            │ Ubah: title = "Doc B"│
│ Write: title = "Doc A"│           │ Write: title = "Doc B"│
└──────────────────────┘            └──────────────────────┘

Hasil di Node 1: title = "Doc A"
Hasil di Node 2: title = "Doc B"

KONFLIK! Mana yang benar?
```

### 4. Partial Failure (Kegagalan Sebagian)

```
Transaksi terdistribusi: Transfer antar 2 database

[DB Jakarta]                    [DB Singapore]
     │                                │
     │── UPDATE saldo A (berhasil) ──→│
     │                                │
     │── UPDATE saldo B (GAGAL!) ────→│
     │         Network timeout        │
     │                                │

Status: DB Jakarta sudah debit, DB Singapore belum credit
Data INKONSISTEN! Perlu mekanisme compensating transaction.
```

---

## BAGIAN 4: Two-Phase Commit (2PC)

### Apa Itu 2PC?

Two-Phase Commit adalah protokol untuk memastikan **semua node dalam transaksi terdistribusi sepakat** untuk commit atau rollback. Ini adalah cara klasik mencapai atomicity di sistem terdistribusi.

### Dua Fase

```
                    Coordinator (Pemimpin Transaksi)
                          │
              ┌───────────┼───────────┐
              │           │           │
        [Node A]     [Node B]     [Node C]

FASE 1: PREPARE (Voting)
═══════════════════════════════════════

Coordinator → Semua Node: "Siap commit?"
              ↓
[Node A]  Cek: bisa commit? → YES (vote commit)
[Node B]  Cek: bisa commit? → YES (vote commit)
[Node C]  Cek: bisa commit? → YES (vote commit)
              ↓
Semua vote YES → Coordinator memutuskan COMMIT

FASE 2: COMMIT (Eksekusi)
═══════════════════════════════════════

Coordinator → Semua Node: "COMMIT!"
              ↓
[Node A]  Commit → ACK
[Node B]  Commit → ACK
[Node C]  Commit → ACK
              ↓
Semua ACK → Transaksi SELESAI
```

### 2PC dengan Kegagalan

```
FASE 1: PREPARE
═══════════════════════════════════════

Coordinator → Semua Node: "Siap commit?"
              ↓
[Node A]  YES
[Node B]  NO (constraint violation!)
[Node C]  YES
              ↓
Ada vote NO → Coordinator memutuskan ROLLBACK

FASE 2: ROLLBACK
═══════════════════════════════════════

Coordinator → Semua Node: "ROLLBACK!"
              ↓
[Node A]  Rollback → ACK
[Node B]  Rollback → ACK (tidak perlu, tapi tetap ACK)
[Node C]  Rollback → ACK
              ↓
Semua ACK → Transksi DIBATALKAN
```

### Masalah 2PC

```
Masalah 1: Coordinator Crash
═══════════════════════════════════════

Setelah FASE 1 selesai (semua vote YES), Coordinator crash.

[Node A]  Sudah vote YES, menunggu keputusan
[Node B]  Sudah vote YES, menunggu keputusan
[Node C]  Sudah vote YES, menunggu keputusan

Semua node BLOCKED — tidak bisa commit, tidak bisa rollback.
Mereka tidak tahu keputusan Coordinator.
Ini disebut "Blocking Protocol" problem.

Masalah 2: Network Partition
═══════════════════════════════════════

Coordinator ──×── [Node A]
     │
     ├──✓── [Node B]
     │
     ├──✓── [Node C]

Node A tidak bisa komunikasi dengan Coordinator.
Node A tidak tahu harus commit atau rollback.
Node A tetap BLOCKED sampai koneksi pulih.

Masalah 3: Performance
═══════════════════════════════════════

Setiap transaksi butuh 2 round-trip communication:
- FASE 1: Coordinator → Nodes → Coordinator
- FASE 2: Coordinator → Nodes → Coordinator

Ini menambah latency signifikan, terutama antar data center.
```

### Kapan Pakai 2PC?

| Skenario | Rekomendasi |
|---|---|
| Transaksi dalam 1 database | Tidak perlu (sudah ACID native) |
| Transaksi antar 2-3 database | Bisa pakai 2PC |
| Transaksi antar banyak service | Hindari 2PC, pakai Saga Pattern |
| Sistem butuh high availability | Hindari 2PC (blocking) |

---

## BAGIAN 5: Three-Phase Commit (3PC)

### Apa Itu 3PC?

Three-Phase Commit adalah perbaikan dari 2PC yang mencoba menyelesaikan masalah **blocking**. 3PC menambahkan satu fase ekstra dan menggunakan **timeout** untuk menghindari node yang stuck.

### Tiga Fase

```
                    Coordinator
                        │
            ┌───────────┼───────────┐
            │           │           │
      [Node A]     [Node B]     [Node C]

FASE 1: CAN COMMIT (Voting Awal)
═══════════════════════════════════════

Coordinator → Semua Node: "Bisa commit?"
            ↓
[Node A]  YES (bisa)
[Node B]  YES (bisa)
[Node C]  YES (bisa)
            ↓
Semua YES → lanjut ke FASE 2

FASE 2: PRE COMMIT (Persiapan)
═══════════════════════════════════════

Coordinator → Semua Node: "PRE-COMMIT! Siapkan, tapi belum commit."
            ↓
[Node A]  ACK (siap, data sudah di-prepared)
[Node B]  ACK (siap, data sudah di-prepared)
[Node C]  ACK (siap, data sudah di-prepared)
            ↓
Semua ACK → Coordinator tahu semua node siap
            → lanjut ke FASE 3

FASE 3: DO COMMIT (Eksekusi Final)
═══════════════════════════════════════

Coordinator → Semua Node: "COMMIT SEKARANG!"
            ↓
[Node A]  Commit → ACK
[Node B]  Commit → ACK
[Node C]  Commit → ACK
            ↓
Transaksi SELESAI
```

### Bagaimana 3PC Mengatasi Blocking?

```
Skenario: Coordinator crash di tengah proses

KASUS 1: Crash saat FASE 1 (CAN COMMIT)
═══════════════════════════════════════

Node belum vote → Node bisa aman ROLLBACK sendiri.
Tidak ada data yang sudah di-prepared.

KASUS 2: Crash saat FASE 2 (PRE COMMIT)
═══════════════════════════════════════

Node sudah ACK PRE-COMMIT, tapi belum dapat DO COMMIT.

[Node A]  Sudah ACK, menunggu DO COMMIT
[Node B]  Sudah ACK, menunggu DO COMMIT
[Node C]  Sudah ACK, menunggu DO COMMIT

Node berkomunikasi satu sama lain:
"Kamu sudah PRE-COMMIT?" → "Ya"
"Kalau begitu, kita COMMIT bersama!"

Karena semua node sudah PRE-COMMIT, mereka bisa
memutuskan COMMIT tanpa Coordinator.

KASUS 3: Crash saat FASE 3 (DO COMMIT)
═══════════════════════════════════════

Beberapa node sudah commit, beberapa belum.

[Node A]  Sudah COMMIT
[Node B]  Sudah COMMIT
[Node C]  Belum dapat DO COMMIT

Node C tanya ke Node A dan B:
"Kalian sudah commit?" → "Ya"
Node C → COMMIT juga.
```

### Masalah 3PC

3PC **bukan solusi sempurna**:
- Masih bisa gagal jika **network partition** memisahkan node-node
- Timeout bisa menyebabkan **false positive** (node mengira coordinator crash padahal hanya lambat)
- Lebih kompleks dari 2PC (3 round-trip vs 2)
- Dalam praktik, 3PC **jarang digunakan** di production

---

## BAGIAN 6: Konsensus Algorithms — Paxos dan Raft

### Apa Itu Konsensus?

Konsensus adalah proses di mana **banyak node mencapai kesepakatan** tentang suatu nilai, meskipun beberapa node mungkin gagal atau jaringan tidak stabil.

**Analogi:** Seperti musyawarah untuk mufakat — semua harus sepakat tentang satu keputusan, meskipun ada yang tidak hadir atau ada yang berbeda pendapat.

### Mengapa Butuh Konsensus?

```
Sistem terdistribusi butuh konsensus untuk:

1. Leader Election — Siapa yang jadi pemimpin?
2. Log Replication — Urutan operasi yang sama di semua node
3. Configuration Changes — Menambah/mengurangi node
4. Distributed Lock — Siapa yang boleh akses resource?

Tanpa konsensus:
- Bisa ada 2 leader (split brain)
- Data di node berbeda bisa tidak sinkron
- Sistem tidak bisa recover dari failure dengan aman
```

### Algoritma Paxos — Yang Sulit Dipahami

Paxos ditemukan oleh Leslie Lamport (1998) dan terkenal **sangat sulit dipahami**. Bahkan paper aslinya ditulis dengan analogi "Parliament" (parlemen Yunani).

**Konsep Dasar Paxos:**

```
3 Peran dalam Paxos:

1. Proposer — Mengusulkan nilai
2. Acceptor — Menerima/menolak usulan
3. Learner — Belajar nilai yang sudah disetujui

Proses (disederhanakan):

FASE 1: PREPARE
═══════════════════════════════════════

Proposer → Semua Acceptor: "Saya mau usulkan nilai, nomor proposal: N"
            ↓
Acceptor: Jika N > nomor tertinggi yang pernah saya lihat:
          → "OK, saya janji tidak akan terima proposal < N"
          → Kirim balik nilai yang sudah pernah saya terima (jika ada)

FASE 2: ACCEPT
═══════════════════════════════════════

Proposer (dapat OK dari mayoritas) → Semua Acceptor:
  "Terima nilai V dengan nomor N"
            ↓
Acceptor: Jika tidak janji ke proposer lain dengan nomor > N:
          → "OK, saya terima nilai V"

Jika mayoritas Acceptor menerima → Nilai V DISAPAKATI
```

**Kenapa Paxos Sulit:**
- Paper asli menggunakan analogi yang membingungkan
- Banyak edge case yang harus ditangani
- Implementasi production (Multi-Paxos) jauh lebih kompleks dari paper dasar
- Butuh pemahaman mendalam tentang distributed systems

### Algoritma Raft — Yang Mudah Dipahami

Raft (2013) dirancang khusus agar **lebih mudah dipahami** dari Paxos. Raft menghasilkan hasil yang sama dengan Paxos, tapi dengan struktur yang lebih jelas.

**Konsep Dasar Raft:**

```
3 Peran dalam Raft:

1. Leader — Satu-satunya yang handle client request
2. Follower — Pasif, hanya menerima data dari Leader
3. Candidate — Sementara, saat election

State Machine Replication:
Semua node menjalankan operasi yang SAMA dalam URUTAN yang SAMA.
```

**Visualisasi Raft:**

```
Normal Operation:
═══════════════════════════════════════

       [Client]
          │
          ↓ write: "X = 10"
       [Leader]
          │
          │ AppendEntries (log entry: "X = 10")
     ┌────┼────┐
     ↓    ↓    ↓
[Follower] [Follower] [Follower]
     ↓    ↓    ↓
   ACK  ACK  ACK
     ↓    ↓    ↓
   Leader commit → respond ke Client: "OK"

Leader Election:
═══════════════════════════════════════

Leader crash!

[Follower A]  Timeout tidak dapat heartbeat dari Leader
[Follower B]  Timeout tidak dapat heartbeat dari Leader
[Follower C]  Timeout tidak dapat heartbeat dari Leader

Follower A jadi Candidate:
  → Increment term (epoch baru)
  → Vote untuk diri sendiri
  → Request vote ke Follower B dan C

Follower B: "OK, saya vote Candidate A"
Follower C: "OK, saya vote Candidate A"

Candidate A dapat 3 vote (termasuk diri sendiri) → MAYORITAS
Candidate A jadi LEADER baru!
Leader baru kirim heartbeat ke semua Follower.
```

**Log Replication di Raft:**

```
Log Structure:
═══════════════════════════════════════

Setiap entry punya: [term, index, command]

Leader Log:
┌─────┬─────┬─────┬─────┬─────┐
│ 1,1 │ 1,2 │ 2,3 │ 3,4 │ 3,5 │  ← [term, index]
│ cmd │ cmd │ cmd │ cmd │ cmd │
└─────┴─────┴─────┴─────┴─────┘
              ↑
         commitIndex

Follower Log (sedang catch up):
┌─────┬─────┬─────┐
│ 1,1 │ 1,2 │ 2,3 │
│ cmd │ cmd │ cmd │
└─────┴─────┴─────┘
         ↑
    lastApplied

Leader kirim AppendEntries dengan entry [3,4] dan [3,5]
Follower append → ACK → Leader update commitIndex
```

**Keunggulan Raft:**
- Lebih mudah dipahami dan diimplementasikan
- Strong leader model menyederhanakan log management
- Election mechanism jelas dan terdokumentasi baik
- Banyak implementasi open-source (etcd, Consul, TiKV)

**Perbandingan Paxos vs Raft:**

| Aspek | Paxos | Raft |
|---|---|---|
| Kemudahan dipahami | Sulit | Mudah |
| Leader | Tidak eksplisit | Eksplisit (strong leader) |
| Log management | Kompleks | Sederhana |
| Implementasi production | Multi-Paxos (kompleks) | Langsung dari paper |
| Penggunaan | Chubby (Google) | etcd, Consul, TiKV |

---

## BAGIAN 7: Quorum Reads/Writes

### Apa Itu Quorum?

Quorum adalah mekanisme **voting** untuk memastikan konsistensi dalam sistem terdistribusi. Ide dasarnya: jika kita membaca dari cukup banyak node dan menulis ke cukup banyak node, kita akan selalu mendapatkan data terbaru.

### Rumus Quorum

```
N = jumlah total node
W = jumlah node yang harus acknowledge write
R = jumlah node yang harus di-query untuk read

Syarat untuk Strong Consistency:
W + R > N

Artinya: Set node yang read DAN set node yang write PASTI overlap.
Minimal 1 node yang ada di kedua set → node itu punya data terbaru.
```

### Contoh Quorum

```
Sistem dengan 5 node (N=5):

Konfigurasi 1: W=3, R=3 (Majority Quorum)
═══════════════════════════════════════

Write: Harus berhasil di minimal 3 node
Read:  Harus baca dari minimal 3 node

W + R = 3 + 3 = 6 > 5 ✅ → Strong Consistency terjamin

Visualisasi:
[Node 1] ← write ✅
[Node 2] ← write ✅
[Node 3] ← write ✅   ← 3 node, write selesai
[Node 4]   (belum)
[Node 5]   (belum)

Read dari [Node 3], [Node 4], [Node 5]:
Node 3 punya data terbaru → return data terbaru ✅

Konfigurasi 2: W=5, R=1 (Write-heavy)
═══════════════════════════════════════

Write: Harus berhasil di SEMUA 5 node
Read:  Cukup baca dari 1 node

W + R = 5 + 1 = 6 > 5 ✅ → Strong Consistency
Tapi write jadi lambat (harus tunggu 5 node)

Konfigurasi 3: W=1, R=5 (Read-heavy)
═══════════════════════════════════════

Write: Cukup 1 node
Read:  Harus baca dari SEMUA 5 node, ambil yang terbaru

W + R = 1 + 5 = 6 > 5 ✅ → Strong Consistency
Tapi read jadi lambat (harus query 5 node)

Konfigurasi 4: W=2, R=2 (Eventual Consistency)
═══════════════════════════════════════

W + R = 2 + 2 = 4 < 5 ❌ → TIDAK strong consistency
Read dan write set mungkin tidak overlap
Data bisa tidak konsisten (eventual consistency)
```

### Quorum di DynamoDB

Amazon DynamoDB menggunakan konsep quorum dengan parameter **Consistent Read**:

```python
# DynamoDB Read dengan Consistent Read (Strong Consistency)
response = table.get_item(
    Key={'id': 'user123'},
    ConsistentRead=True  # R = N (baca dari semua replica)
)
# Hasil: Selalu data terbaru

# DynamoDB Read tanpa Consistent Read (Eventual Consistency)
response = table.get_item(
    Key={'id': 'user123'},
    ConsistentRead=False  # R bisa < N
)
# Hasil: Mungkin data lama (eventual consistency)
# Tapi: lebih cepat dan lebih murah
```

---

## BAGIAN 8: Vector Clocks

### Apa Itu Vector Clock?

Vector Clock adalah mekanisme untuk **melacak hubungan kausal** antar event di sistem terdistribusi. Ini membantu menentukan mana event yang terjadi "sebelum" atau "sesudah" event lain.

### Mengapa Timestamp Biasa Tidak Cukup?

```
Problem dengan Physical Timestamp:

Node A (jam lambat):  Write X=10 at 10:00:00.000
Node B (jam cepat):   Write X=20 at 10:00:00.050

Secara timestamp, write B "lebih baru".
Tapi sebenarnya write A mungkin terjadi SETELAH write B
(karena jam A lambat).

Solusi: Vector Clock — tidak pakai waktu fisik,
pakai counter logis per node.
```

### Cara Kerja Vector Clock

```
Vector Clock = array of counters, satu per node

Sistem 3 node: [Node A, Node B, Node C]

Awal:
VC(A) = [0, 0, 0]
VC(B) = [0, 0, 0]
VC(C) = [0, 0, 0]

Node A write data:
VC(A) = [1, 0, 0]  ← counter A increment
Data: X=10, VC=[1,0,0]

Data direplikasi ke Node B:
Node B merge VC: max([0,0,0], [1,0,0]) = [1,0,0]
Lalu increment counter B:
VC(B) = [1, 1, 0]  ← counter B increment
Data: X=10, VC=[1,1,0]

Node B write data (update X):
VC(B) = [1, 2, 0]  ← counter B increment lagi
Data: X=20, VC=[1,2,0]

Node C write data (update X) secara bersamaan:
VC(C) = [0, 0, 1]  ← counter C increment
Data: X=30, VC=[0,0,1]
```

### Membandingkan Vector Clock

```
VC1 = [1, 2, 0]
VC2 = [0, 0, 1]

Apakah VC1 > VC2? (VC1 happened after VC2)
→ Cek: semua elemen VC1 >= VC2 DAN minimal 1 elemen VC1 > VC2
→ [1,2,0] vs [0,0,1]: 1>0 ✅, 2>0 ✅, 0<1 ❌
→ TIDAK, VC1 tidak happened after VC2

Apakah VC2 > VC1?
→ [0,0,1] vs [1,2,0]: 0<1 ❌
→ TIDAK, VC2 tidak happened after VC1

KESIMPULAN: VC1 dan VC2 CONCURRENT (tidak ada hubungan kausal)
→ Ini adalah KONFLIK! Perlu conflict resolution.

VC3 = [1, 2, 0]
VC4 = [1, 3, 0]

Apakah VC4 > VC3?
→ 1>=1 ✅, 3>2 ✅, 0>=0 ✅
→ YA! VC4 happened after VC3
→ Data dengan VC4 lebih baru, tidak ada konflik.
```

### Visualisasi Vector Clock

```
Timeline dengan Vector Clock:

Node A:  [1,0,0] ─────── [2,0,0] ─────── [3,0,0]
            │               │
            │ replicate     │
            ↓               ↓
Node B:  [0,0,0] ──→ [1,1,0] ──→ [1,2,0] ──→ [2,2,0]
                                │
                                │ replicate
                                ↓
Node C:  [0,0,0] ──────────→ [1,2,1] ──→ [2,2,1]

Semua node bisa tahu urutan kausal event.
```

---

## BAGIAN 9: Conflict Resolution Strategies

Ketika ada **concurrent writes** (write bersamaan di node berbeda), kita butuh strategi untuk menyelesaikan konflik.

### 1. Last-Write-Wins (LWW)

**Cara kerja:** Write dengan timestamp paling besar menang.

```
Node A: Write X=10 at T=100
Node B: Write X=20 at T=105

LWW: X=20 menang (timestamp 105 > 100)

Implementasi sederhana:
class LastWriteWins:
    def __init__(self):
        self.value = None
        self.timestamp = 0

    def write(self, value, timestamp):
        if timestamp > self.timestamp:
            self.value = value
            self.timestamp = timestamp

    def read(self):
        return self.value

Masalah LWW:
- Clock skew bisa menyebabkan write yang salah menang
- Data yang "kalah" HILANG permanen
- Tidak cocok untuk collaborative editing
```

### 2. CRDTs (Conflict-Free Replicated Data Types)

**Definisi:** Struktur data yang secara matematis dijamin bisa di-merge tanpa konflik, meskipun update terjadi secara concurrent.

**Jenis-jenis CRDT:**

```
a. G-Counter (Grow-only Counter)
═══════════════════════════════════════

Counter yang HANYA bisa increment (tidak bisa decrement).

Setiap node punya counter sendiri:
Node A: counter_A = 3
Node B: counter_B = 5
Node C: counter_C = 2

Total = 3 + 5 + 2 = 10

Merge: ambil MAX per node
Node A sync dengan Node B:
  counter_A = max(3, 0) = 3
  counter_B = max(0, 5) = 5
Total = 3 + 5 = 8

b. PN-Counter (Positive-Negative Counter)
═══════════════════════════════════════

Dua G-Counter: satu untuk increment, satu untuk decrement.

P (positive): [A:3, B:5, C:2]  ← total increment = 10
N (negative): [A:1, B:0, C:1]  ← total decrement = 2

Value = sum(P) - sum(N) = 10 - 2 = 8

c. OR-Set (Observed-Remove Set)
═══════════════════════════════════════

Set yang bisa add dan remove elemen.

Set = {apple, banana}
Node A: add cherry → {apple, banana, cherry}
Node B: remove apple → {banana}

Merge:
- Semua yang di-add tetap ada (kecuali secara spesifik di-remove)
- Remove hanya hapus elemen yang "observed" (sudah dilihat)

d. LWW-Register
═══════════════════════════════════════

Register sederhana dengan LWW, tapi menggunakan
logical timestamp (bukan physical clock).
```

**Contoh CRDT di dunia nyata:**

```python
# Contoh G-Counter sederhana
class GCounter:
    def __init__(self, node_id, num_nodes):
        self.node_id = node_id
        self.counters = [0] * num_nodes

    def increment(self):
        self.counters[self.node_id] += 1

    def value(self):
        return sum(self.counters)

    def merge(self, other):
        for i in range(len(self.counters)):
            self.counters[i] = max(self.counters[i], other.counters[i])

# Penggunaan:
counter_a = GCounter(node_id=0, num_nodes=3)
counter_b = GCounter(node_id=1, num_nodes=3)

counter_a.increment()  # [1, 0, 0]
counter_a.increment()  # [2, 0, 0]
counter_b.increment()  # [0, 1, 0]

# Merge
counter_a.merge(counter_b)  # [2, 1, 0]
print(counter_a.value())  # 3 ✅
```

### 3. Operational Transformation (OT)

**Definisi:** Teknik untuk collaborative editing (seperti Google Docs) yang mentransformasi operasi agar konsisten di semua client.

```
Contoh: Google Docs collaborative editing

Dokumen awal: "Hello World"

Client A: Insert "Beautiful " di posisi 6
Client B: Delete "World" di posisi 6

Tanpa OT:
Client A: "Hello Beautiful World"
Client B: "Hello "  ← "World" dihapus

Dengan OT:
Client A kirim operasi: Insert("Beautiful ", 6)
Client B kirim operasi: Delete(5, 6)  ← hapus 5 char mulai posisi 6

Server transformasi operasi B terhadap A:
Delete(5, 6) → Delete(5, 6+12) = Delete(5, 18)
(karena "Beautiful " menambah 12 karakter)

Hasil final: "Hello Beautiful "

Transformasi operasi:
┌─────────────────────────────────────┐
│  OpA: Insert("Beautiful ", 6)      │
│  OpB: Delete(5, 6)                 │
│                                     │
│  Transform OpB against OpA:        │
│  Posisi 6 di OpB → posisi 6+12=18  │
│  (karena OpA insert 12 char di 6)  │
│                                     │
│  OpB' = Delete(5, 18)              │
│                                     │
│  Hasil: "Hello Beautiful "         │
└─────────────────────────────────────┘
```

**Perbandingan CRDT vs OT:**

| Aspek | CRDT | OT |
|---|---|---|
| Kompleksitas | Lebih sederhana | Lebih kompleks |
| Network | Bisa peer-to-peer | Butuh server pusat |
| Use case | Counter, set, register | Collaborative editing |
| Google Docs | Tidak | Ya (menggunakan OT) |
| Figma | Ya (menggunakan CRDT) | Tidak |

---

## BAGIAN 10: Real-World Examples

### Google Spanner — Strong Consistency Global

**Apa itu Spanner?**
Google Spanner adalah database terdistribusi global yang menyediakan **strong consistency** di seluruh dunia. Ini adalah pencapaian luar biasa karena biasanya strong consistency hanya mungkin dalam satu data center.

**Bagaimana Spanner Mencapai Strong Consistency Global?**

```
TrueTime API — Kunci Rahasia Spanner
═══════════════════════════════════════

Spanner menggunakan TrueTime API yang memberikan:
- Waktu dengan akurasi sangat tinggi (~nanodetik)
- Menggunakan GPS receiver + atomic clock di setiap server

TrueTime memberikan interval waktu:
[e_earliest, e_latest]

Contoh: [10:00:00.000001, 10:00:00.000005]
Artinya: waktu sekarang PASTI antara 1 dan 5 mikrodetik

Dengan TrueTime, Spanner bisa:
1. Memberikan timestamp global yang konsisten
2. Menjalankan transaksi dengan 2PC + TrueTime
3. Menjamin external consistency (linearizability)

Arsitektur Spanner:
═══════════════════════════════════════

                    [Client App]
                         │
                    [Spanner API]
                         │
              ┌──────────┼──────────┐
              ↓          ↓          ↓
         [Data Center] [Data Center] [Data Center]
         [US East]     [Europe]      [Asia]
              │          │          │
         [Paxos Group] [Paxos Group] [Paxos Group]
         [Leader +     [Leader +     [Leader +
          Followers]    Followers]    Followers]

Setiap "shard" data direplikasi menggunakan Paxos.
Transaksi antar shard menggunakan 2PC.
Timestamp menggunakan TrueTime.
```

**Kapan Pakai Spanner?**
- Aplikasi global butuh strong consistency
- Budget cukup (Spanner mahal)
- Butuh SQL + horizontal scaling

### Amazon DynamoDB — Eventual Consistency yang Scalable

**Apa itu DynamoDB?**
Amazon DynamoDB adalah NoSQL database yang mengutamakan **availability dan partition tolerance** (AP di CAP theorem), dengan eventual consistency sebagai default.

**Arsitektur DynamoDB:**

```
DynamoDB Architecture (simplified):
═══════════════════════════════════════

                    [Client]
                         │
                    [Load Balancer]
                         │
              ┌──────────┼──────────┐
              ↓          ↓          ↓
         [Partition 1] [Partition 2] [Partition 3]
              │          │          │
         [Replica A] [Replica A] [Replica A]
         [Replica B] [Replica B] [Replica B]
         [Replica C] [Replica C] [Replica C]

Setiap partition punya 3 replica (default).
Write ke semua replica (quorum W).
Read dari quorum replica (quorum R).

Consistent Read: R = semua replica → strong consistency
Eventual Read: R = 1 replica → eventual consistency
```

**Fitur Konsistensi DynamoDB:**

```python
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Users')

# Eventual Consistency (default, lebih cepat, lebih murah)
response = table.get_item(Key={'user_id': '123'})
# Read capacity: 0.5 unit per 4KB

# Strong Consistency (lebih lambat, lebih mahal)
response = table.get_item(
    Key={'user_id': '123'},
    ConsistentRead=True
)
# Read capacity: 1 unit per 4KB (2x eventual)

# Write dengan Conditional Check (optimistic locking)
table.update_item(
    Key={'user_id': '123'},
    UpdateExpression='SET balance = balance - :amount',
    ConditionExpression='balance >= :amount',
    ExpressionAttributeValues={':amount': 100}
)
# Jika balance < 100, write gagal (ConditionalCheckFailedException)
```

**DynamoDB Streams untuk Eventual Consistency:**

```
DynamoDB Streams menangkap semua perubahan data:

[Write ke Table] → [Stream Record] → [Lambda Function]
                                      ↓
                              [Update secondary index]
                              [Send notification]
                              [Sync ke data warehouse]

Ini memungkinkan eventual consistency dengan
post-processing yang reliable.
```

**Perbandingan Spanner vs DynamoDB:**

| Aspek | Google Spanner | Amazon DynamoDB |
|---|---|---|
| Consistency | Strong (global) | Eventual (default), Strong (opsional) |
| Model | Relational (SQL) | NoSQL (Key-Value) |
| Konsensus | Paxos | Quorum-based |
| Clock | TrueTime (GPS + atomic) | Physical timestamp |
| Use case | Financial, global apps | High-scale, flexible schema |
| Trade-off | CP di CAP | AP di CAP |

---

## 🎯 CONTOH NYATA

### Perbandingan: 3 Pola dalam 1 Sistem

**Sistem:** Aplikasi E-Commerce

| Komponen | Pola Konsistensi | Alasan |
|---|---|---|
| Saldo user | Strong | Uang harus akurat |
| Stok produk | Strong | Tidak boleh overselling |
| Rating produk | Eventual | Rating bisa delay beberapa detik |
| Jumlah views | Eventual | Tidak perlu real-time |
| Chat customer service | Weak | Pesan lama bisa hilang jika reconnect |

### Contoh: WhatsApp

| Fitur | Pola | Penjelasan |
|---|---|---|
| Kirim pesan | Eventual | Pesan sampai, tapi mungkin delay |
| Last seen | Eventual | Status bisa tidak real-time |
| Hapus pesan | Strong | Pesan harus terhapus di semua device |
| Profile picture | Eventual | Foto bisa delay update |

---

## 💡 PRAKTIK

### Latihan 1: Tentukan Pola Konsistensi

Tentukan pola konsistensi yang cocok untuk:

1. Sistem absensi sekolah
2. Live score pertandingan sepak bola
3. Saldo e-wallet
4. Komentar di YouTube
5. Notifikasi "sedang mengetik..." di chat
6. Data nilai rapor

**Jawaban:**
1. Eventual — absensi bisa disinkronkan nanti
2. Eventual — score bisa delay beberapa detik
3. Strong — saldo harus akurat
4. Eventual — komentar bisa delay
5. Weak — tidak masalah jika hilang sesaat
6. Strong — nilai harus akurat dan konsisten

### Latihan 2: Desain Quorum

Sistem dengan 7 node. Desain quorum untuk:
1. Strong consistency dengan write cepat
2. Strong consistency dengan read cepat
3. Eventual consistency

**Jawaban:**
1. W=4, R=4 (majority) atau W=5, R=3 (write lebih berat)
2. W=3, R=5 (read lebih berat) atau W=4, R=4 (balanced)
3. W=2, R=2 (W+R=4 < 7, eventual consistency)

### Latihan 3: Kapan Update Cache?

Pelajari 4 strategi update cache (akan dibahas lebih detail di Fase 14):
- Cache-aside
- Write-through
- Write-behind
- Refresh-ahead

Pikirkan kapan masing-masing cocok digunakan.

### Latihan 4: CRDT Counter

Buat G-Counter untuk sistem voting dengan 4 node. Simulasikan:
1. Node A vote 3 kali
2. Node B vote 5 kali
3. Node C vote 2 kali
4. Merge semua counter
5. Hitung total vote

---

## ✅ CHECKLIST

- [ ] Bisa menjelaskan 4 properti ACID dengan contoh
- [ ] Paham perbedaan strong, eventual, dan weak consistency
- [ ] Mengerti cara kerja replikasi sinkron vs asinkron
- [ ] Bisa menjelaskan 2PC dan mengapa bisa blocking
- [ ] Paham perbedaan Paxos dan Raft
- [ ] Mengerti quorum reads/writes dan rumus W+R>N
- [ ] Bisa menjelaskan vector clocks dan cara membandingkannya
- [ ] Paham perbedaan LWW, CRDTs, dan OT
- [ ] Bisa menentukan pola konsistensi untuk kasus tertentu
- [ ] Paham trade-off antara kecepatan dan konsistensi
- [ ] Bisa memberikan contoh nyata untuk setiap pola
- [ ] Mengerti bagaimana Spanner dan DynamoDB menangani konsistensi

---

## 🔗 REFERENSI

- **Repo Asli:** [donnemartin/system-design-primer — Consistency Patterns](https://github.com/donnemartin/system-design-primer#consistency-patterns)
- **Artikel:** [Transactions Across Data Centers](http://snarfed.org/transactions_across_datacenters_io.html)
- **Paper:** [In Search of an Understandable Consensus Algorithm (Raft)](https://raft.github.io/raft.pdf)
- **Paper:** [Paxos Made Simple](https://lamport.azurewebsites.net/pubs/paxos-simple.pdf)
- **Paper:** [Spanner: Google's Globally-Distributed Database](https://research.google/pubs/pub41344/)
- **Paper:** [Dynamo: Amazon's Highly Available Key-value Store](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)
- **CRDT:** [CRDTs: Consistency Without Concurrency Control](http://crdt.github.io/)

---

> **Lanjut ke:** [`06-availability-patterns.md`](./06-availability-patterns.md)