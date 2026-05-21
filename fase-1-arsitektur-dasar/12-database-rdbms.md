# 12 — Database RDBMS

> **Estimasi:** 3 jam | **Level:** Menengah → Lanjut

---

## 📖 TEORI

### Apa itu RDBMS?

**RDBMS (Relational Database Management System)** adalah sistem manajemen database yang menyimpan data dalam bentuk **tabel** dengan **hubungan/relation** antar tabel berdasarkan model relasional yang diperkenalkan oleh Edgar F. Codd pada tahun 1970.

Data diorganisir dalam baris (rows/tuples) dan kolom (columns/attributes). Setiap tabel memiliki **primary key** yang unik untuk mengidentifikasi setiap baris, dan **foreign key** untuk membuat hubungan antar tabel.

```
Tabel: Users          Tabel: Orders           Tabel: Products
┌────────┬────────┐   ┌──────┬────────┬────┐   ┌──────┬────────┬──────┐
│ id     │ name   │   │ id   │ user_id│...│   │ id   │ name   │price│
├────────┼────────┤   ├──────┼────────┼────┤   ├──────┼────────┼──────┤
│ 1      │ Budi   │   │ 101  │ 1      │...│   │ 201  │ Buku   │50000│
│ 2      │ Siti   │   │ 102  │ 2      │...│   │ 202  │ Pulpen │10000│
└────────┴────────┘   └──────┴────────┴────┘   └──────┴────────┴──────┘

Relation: Users.id ──── Orders.user_id
          Products.id ── Orders.product_id
```

### Komponen Utama RDBMS

1. **Storage Engine**: Komponen yang menangani penyimpanan, pengambilan, dan manajemen data di disk. Contoh: InnoDB (MySQL), Heap/TOAST (PostgreSQL).
2. **Query Processor**: Menerima query SQL, melakukan parsing, optimasi, dan eksekusi.
3. **Transaction Manager**: Mengelola transaksi untuk memastikan properti ACID.
4. **Lock Manager**: Mengatur konkurensi akses data antar transaksi.
5. **Buffer Pool/Cache**: Area memori untuk caching halaman data agar akses lebih cepat.
6. **Write-Ahead Log (WAL)**: Log yang mencatat perubahan sebelum ditulis ke disk untuk recovery.

### Contoh RDBMS Populer

| Database | Lisensi | Keunggulan | Use Case |
|---|---|---|---|
| MySQL | Open Source | Populer, mudah, komunitas besar | Web apps, CMS, startup |
| PostgreSQL | Open Source | Fitur lengkap, ACID compliance, extensible | Enterprise, analytics, GIS |
| SQLite | Open Source | File-based, ringan, zero-config | Mobile, embedded, IoT |
| Microsoft SQL Server | Berbayar | Fitur enterprise, .NET integration | Corporate, Windows ecosystem |
| Oracle | Berbayar | Fitur paling lengkap, performa tinggi | Banking, government, Fortune 500 |

---

## 🔬 ACID PROPERTIES

ACID adalah empat properti fundamental yang menjamin reliabilitas transaksi database. Setiap transaksi yang compliant ACID akan menjaga integritas data meskipun terjadi kegagalan sistem.

### A — Atomicity (Atomisitas)

**Definisi:** Sebuah transaksi bersifat "all or nothing" — semua operasi dalam transaksi berhasil, atau semuanya gagal dan di-rollback. Tidak ada keadaan setengah selesai.

**Contoh: Transfer uang antar rekening**

```sql
-- Transaksi transfer Rp 500.000 dari rekening A ke B
BEGIN TRANSACTION;

-- 1. Kurangi saldo rekening A
UPDATE rekening SET saldo = saldo - 500000 WHERE id = 'A';

-- 2. Tambah saldo rekening B
UPDATE rekening SET saldo = saldo + 500000 WHERE id = 'B';

-- Jika kedua operasi sukses:
COMMIT;

-- Jika ada error di tengah:
ROLLBACK; -- Kedua perubahan dibatalkan
```

**Skenario kegagalan:** Jika step 1 berhasil tapi step 2 gagal (misal: rekening B tidak ditemukan), maka `ROLLBACK` akan membatalkan pengurangan saldo A. Uang tidak "hilang".

**Implementasi internal:** Database menggunakan **undo log** untuk menyimpan state sebelum perubahan. Jika rollback diperlukan, undo log digunakan untuk mengembalikan data ke state semula.

### C — Consistency (Konsistensi)

**Definisi:** Transaksi membawa database dari satu state valid ke state valid lainnya. Semua constraint, rule, dan trigger harus dipenuhi setelah transaksi selesai.

**Contoh: Constraint saldo tidak boleh negatif**

```sql
-- Buat tabel dengan constraint
CREATE TABLE rekening (
    id VARCHAR(20) PRIMARY KEY,
    pemilik VARCHAR(100) NOT NULL,
    saldo DECIMAL(15, 2) NOT NULL DEFAULT 0,
    CONSTRAINT saldo_positif CHECK (saldo >= 0)
);

-- Transaksi yang akan melanggar constraint
BEGIN TRANSACTION;
UPDATE rekening SET saldo = saldo - 999999999 WHERE id = 'A';
-- ERROR: constraint "saldo_positif" violated
-- Transaksi otomatis di-rollback
COMMIT; -- Tidak akan pernah berhasil
```

**Jenis constraint yang dijaga:**
- **Primary Key**: Unik dan tidak null
- **Foreign Key**: Referensial integrity
- **CHECK**: Kondisi custom (saldo >= 0, umur > 0)
- **UNIQUE**: Nilai kolom harus unik
- **NOT NULL**: Kolom tidak boleh kosong

### I — Isolation (Isolasi)

**Definisi:** Transaksi yang berjalan bersamaan (concurrent) tidak saling mengganggu. Hasil eksekusi concurrent transactions harus sama dengan hasil jika transaksi dijalankan secara serial (satu per satu).

**Masalah yang dicegah:**

| Anomaly | Deskripsi | Contoh |
|---|---|---|
| Dirty Read | Membaca data yang belum di-commit | Transaksi A update, B baca, A rollback → B baca data "phantom" |
| Non-Repeatable Read | Baca sama, hasil berbeda | A baca X=100, B ubah X=200, A baca lagi X=200 |
| Phantom Read | Baris baru muncul di range query | A hitung WHERE age > 20 = 5 baris, B insert, A hitung lagi = 6 baris |

**Isolation levels** akan dibahas detail di section terpisah di bawah.

### D — Durability (Durabilitas)

**Definisi:** Setelah transaksi di-commit, perubahan bersifat permanen dan tidak akan hilang meskipun terjadi crash, power failure, atau bencana lainnya.

**Implementasi:**
1. **Write-Ahead Logging (WAL)**: Perubahan ditulis ke log file di disk SEBELUM ditulis ke data file.
2. **fsync**: Memaksa OS untuk flush buffer ke physical disk.
3. **Checkpoint**: Periodically, dirty pages di buffer pool di-flush ke disk.

```
Timeline Durability:

Transaksi → WAL write (disk) → COMMIT → Data write (disk, async)
                ↑
           Jika crash di sini, recovery menggunakan WAL
           Data yang sudah di-commit akan di-replay dari WAL
```

**Recovery Process:**
```
1. Database crash dan restart
2. Baca WAL dari checkpoint terakhir
3. REDO: Replay semua transaksi yang sudah COMMIT
4. UNDO: Rollback semua transaksi yang belum COMMIT
5. Database kembali ke state konsisten
```

---

## 🔄 TRANSACTION ISOLATION LEVELS

Setiap isolation level memberikan trade-off antara konsistensi data dan performa/konkurensi.

### 1. Read Uncommitted (Lowest)

Transaksi bisa membaca data yang belum di-commit oleh transaksi lain.

```sql
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

-- Timeline:
-- T1: UPDATE accounts SET balance = 900 WHERE id = 1;  (belum commit)
-- T2: SELECT balance FROM accounts WHERE id = 1;       → Dapat 900 (DIRTY READ!)
-- T1: ROLLBACK;                                         → Balance kembali ke 1000
-- T2 sudah membaca data yang tidak pernah ada secara permanen
```

**Anomaly:** Dirty Read
**Use case:** Hampir tidak pernah digunakan di production. Mungkin untuk reporting yang tidak butuh akurasi.

### 2. Read Committed (Default PostgreSQL, Oracle)

Transaksi hanya bisa membaca data yang sudah di-commit.

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Timeline:
-- T1: UPDATE accounts SET balance = 900 WHERE id = 1;
-- T2: SELECT balance FROM accounts WHERE id = 1;       → Dapat 1000 (data lama)
-- T1: COMMIT;
-- T2: SELECT balance FROM accounts WHERE id = 1;       → Dapat 900 (NON-REPEATABLE READ!)
```

**Anomaly:** Non-Repeatable Read (baca yang sama dalam satu transaksi bisa hasil berbeda)
**Use case:** Web applications, general purpose. Cukup untuk kebanyakan aplikasi.

### 3. Repeatable Read (Default MySQL InnoDB)

Transaksi melihat snapshot data dari awal transaksi. Baca yang sama selalu hasil sama.

```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- Timeline:
-- T1: SELECT * FROM accounts WHERE balance > 500;      → Dapat 3 baris
-- T2: INSERT INTO accounts VALUES (4, 'New', 600);
-- T2: COMMIT;
-- T1: SELECT * FROM accounts WHERE balance > 500;      → Masih 3 baris (snapshot!)

-- T1: UPDATE accounts SET balance = balance + 100 WHERE balance > 500;
-- Di MySQL InnoDB: Phantom read dicegah dengan gap locks
```

**Anomaly:** Phantom Read (secara teori masih mungkin, tapi MySQL InnoDB mencegahnya dengan gap locks)
**Use case:** Financial applications, inventory systems, data yang butuh konsistensi tinggi.

### 4. Serializable (Highest)

Transaksi dijalankan seolah-olah secara serial (satu per satu). Level paling ketat.

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Timeline:
-- T1: SELECT SUM(balance) FROM accounts;               → Dapat 3000
-- T2: INSERT INTO accounts VALUES (4, 'New', 1000);
-- T2: COMMIT;
-- T1: INSERT INTO accounts VALUES (5, 'Another', 500);
-- ERROR: Serialization failure!
-- T1 harus di-retry karena ada perubahan data yang mempengaruhi query sebelumnya
```

**Anomaly:** Tidak ada anomaly yang mungkin terjadi.
**Use case:** Banking core system, audit, compliance-critical operations. Performa paling lambat.

### Perbandingan Isolation Levels

| Level | Dirty Read | Non-Repeatable Read | Phantom Read | Performa |
|---|---|---|---|---|
| Read Uncommitted | Mungkin | Mungkin | Mungkin | Tertinggi |
| Read Committed | Tidak | Mungkin | Mungkin | Tinggi |
| Repeatable Read | Tidak | Tidak | Mungkin* | Sedang |
| Serializable | Tidak | Tidak | Tidak | Terendah |

*MySQL InnoDB mencegah phantom read dengan gap locks.

---

## 📇 INDEXING DEEP DIVE

Index adalah struktur data yang mempercepat pencarian data dengan trade-off: write lebih lambat dan storage lebih besar.

### B-Tree Index (Default)

Struktur data tree yang balanced. Paling umum dan versatile.

```sql
-- B-Tree index pada kolom yang sering di-search
CREATE INDEX idx_siswa_nama ON siswa(nama);

-- Struktur internal B-Tree:
--         [M]
--        /   \
--     [C,G]  [S,Z]
--     / | \   / | \
--   A-D E-H I-R S-U V-Z

-- Query yang bisa menggunakan B-Tree:
SELECT * FROM siswa WHERE nama = 'Budi';          -- Equality (cepat)
SELECT * FROM siswa WHERE nama > 'Andi';          -- Range (cepat)
SELECT * FROM siswa WHERE nama LIKE 'B%';         -- Prefix (cepat)
SELECT * FROM siswa ORDER BY nama;                -- Sorting (cepat)
SELECT * FROM siswa WHERE nama BETWEEN 'A' AND 'M'; -- Range (cepat)

-- Query yang TIDAK bisa menggunakan B-Tree:
SELECT * FROM siswa WHERE nama LIKE '%udi';       -- Suffix (full scan)
SELECT * FROM siswa WHERE LOWER(nama) = 'budi';   -- Function (perlu functional index)
```

**Karakteristik B-Tree:**
- Kompleksitas pencarian: O(log n)
- Mendukung equality, range, prefix, sorting
- Overhead storage: ~10-20% dari ukuran tabel
- Write penalty: setiap INSERT/UPDATE/DELETE harus update index

### Hash Index

Menggunakan hash function untuk mapping key ke bucket.

```sql
-- PostgreSQL: Hash index
CREATE INDEX idx_siswa_nisn_hash ON siswa USING HASH (nisn);

-- Hanya cocok untuk equality lookup
SELECT * FROM siswa WHERE nisn = '0012345678';  -- Sangat cepat: O(1)

-- TIDAK bisa untuk:
SELECT * FROM siswa WHERE nisn > '0012345678';  -- Range: tidak support
SELECT * FROM siswa ORDER BY nisn;               -- Sorting: tidak support
```

**Karakteristik Hash Index:**
- Kompleksitas: O(1) untuk equality
- Hanya support equality operator (=)
- Lebih kecil dari B-Tree
- Tidak support range query atau sorting

### Composite Index (Multi-Column)

Index yang mencakup beberapa kolom. Urutan kolom sangat penting!

```sql
-- Composite index: (kelas, nama)
CREATE INDEX idx_siswa_kelas_nama ON siswa(kelas, nama);

-- Query yang MENGGUNAKAN index:
SELECT * FROM siswa WHERE kelas = '7A';                    -- Prefix: YA
SELECT * FROM siswa WHERE kelas = '7A' AND nama = 'Budi';  -- Prefix + exact: YA
SELECT * FROM siswa WHERE kelas = '7A' AND nama LIKE 'B%'; -- Prefix + range: YA
SELECT * FROM siswa WHERE kelas IN ('7A', '7B') AND nama = 'Budi'; -- YA

-- Query yang TIDAK menggunakan index:
SELECT * FROM siswa WHERE nama = 'Budi';                   -- Bukan prefix: TIDAK
SELECT * FROM siswa WHERE nama = 'Budi' AND kelas = '7A';  -- Optimizer mungkin tetap pakai

-- Aturan: kolom dengan selektivitas tinggi (lebih unik) di depan
-- (status, created_at) lebih baik dari (created_at, status) jika status punya sedikit nilai
```

**Leftmost Prefix Rule:** Composite index hanya bisa digunakan jika query menggunakan kolom paling kiri dari index.

### Covering Index

Index yang memuat SEMUA kolom yang dibutuhkan query. Query tidak perlu akses ke tabel sama sekali (Index-Only Scan).

```sql
-- Query: hanya butuh nama dan email
SELECT nama, email FROM siswa WHERE kelas = '7A';

-- Covering index yang mencakup semua kolom query:
CREATE INDEX idx_siswa_covering ON siswa(kelas, nama, email);

-- PostgreSQL: INCLUDE syntax (kolom INCLUDE tidak di-sort, hanya disimpan)
CREATE INDEX idx_siswa_covering ON siswa(kelas) INCLUDE (nama, email);

-- EXPLAIN akan menunjukkan: "Index Only Scan" (lebih cepat dari "Index Scan + Heap Fetch")
```

**Kapan pakai:** Query yang sering dijalankan dan hanya butuh subset kolom. Trade-off: index lebih besar.

### Partial Index

Index yang hanya mencakup subset baris berdasarkan kondisi WHERE.

```sql
-- Hanya index siswa yang aktif (misal 10% dari total)
CREATE INDEX idx_siswa_aktif ON siswa(nama, kelas) WHERE status = 'aktif';

-- Hanya index order yang belum selesai
CREATE INDEX idx_order_pending ON orders(user_id, created_at) WHERE status = 'pending';

-- Hanya index email yang sudah diverifikasi
CREATE INDEX idx_email_verified ON users(email) WHERE email_verified = true;

-- Keuntungan:
-- 1. Index lebih kecil (hemat storage)
-- 2. Write lebih cepat (lebih sedikit index yang di-update)
-- 3. Query pada subset data lebih cepat
```

### Kapan Membuat Index?

| Skenario | Buat Index? | Jenis |
|---|---|---|
| Kolom di WHERE clause | YA | B-Tree |
| Kolom di JOIN condition | YA | B-Tree |
| Kolom di ORDER BY | YA | B-Tree |
| Kolom di GROUP BY | YA | B-Tree |
| Kolom dengan sedikit nilai unik (gender) | TIDAK | - |
| Tabel kecil (< 1000 baris) | TIDAK | - |
| Tabel yang sering di-write | HATI-HATI | Partial index |
| Primary Key | OTOMATIS | B-Tree (unique) |

---

## 🔍 QUERY OPTIMIZATION

### EXPLAIN dan EXPLAIN ANALYZE

`EXPLAIN` menunjukkan query plan yang akan dieksekusi. `EXPLAIN ANALYZE` benar-benar menjalankan query dan menunjukkan waktu eksekusi aktual.

```sql
-- Lihat query plan tanpa eksekusi
EXPLAIN SELECT * FROM siswa WHERE kelas = '7A';

-- Jalankan query dan lihat performa aktual
EXPLAIN ANALYZE SELECT * FROM siswa WHERE kelas = '7A';

-- Output EXPLAIN ANALYZE (contoh):
-- Seq Scan on siswa  (cost=0.00..35.50 rows=25 width=100) (actual time=0.015..0.089 rows=30 loops=1)
--   Filter: (kelas = '7A'::text)
--   Rows Removed by Filter: 970
-- Planning Time: 0.150 ms
-- Execution Time: 0.120 ms
```

**Membaca output EXPLAIN:**
- `Seq Scan`: Full table scan (buruk untuk tabel besar)
- `Index Scan`: Menggunakan index (baik)
- `Index Only Scan`: Hanya dari index, tanpa akses tabel (terbaik)
- `Nested Loop`: Join dengan nested loop (baik untuk small tables)
- `Hash Join`: Join dengan hash table (baik untuk medium tables)
- `Merge Join`: Join dengan sorted data (baik untuk large sorted tables)
- `cost=0.00..35.50`: Estimasi biaya (start..total)
- `rows=25`: Estimasi baris yang dikembalikan
- `actual time=0.015..0.089`: Waktu eksekusi aktual (start..end) dalam ms

### Common Query Anti-Patterns

#### 1. SELECT * (Select All Columns)

```sql
-- BURUK: Mengambil semua kolom, termasuk yang tidak dibutuhkan
SELECT * FROM siswa WHERE kelas = '7A';

-- BAIK: Hanya kolom yang dibutuhkan
SELECT id, nama, nisn FROM siswa WHERE kelas = '7A';

-- Alasan:
-- - Lebih banyak I/O disk
-- - Lebih banyak network transfer
-- - Mencegah Index-Only Scan
-- - Break jika schema berubah
```

#### 2. Function pada Kolom di WHERE

```sql
-- BURUK: Function membuat index tidak terpakai
SELECT * FROM siswa WHERE LOWER(nama) = 'budi';
SELECT * FROM siswa WHERE YEAR(tanggal_lahir) = 2010;
SELECT * FROM siswa WHERE DATE(created_at) = '2024-01-15';

-- BAIK: Ubah query agar index terpakai
SELECT * FROM siswa WHERE nama = 'Budi' OR nama = 'budi'; -- Jika case-insensitive collation
SELECT * FROM siswa WHERE tanggal_lahir >= '2010-01-01' AND tanggal_lahir < '2011-01-01';
SELECT * FROM siswa WHERE created_at >= '2024-01-15 00:00:00' AND created_at < '2024-01-16 00:00:00';

-- ALTERNATIF: Functional index (PostgreSQL)
CREATE INDEX idx_siswa_nama_lower ON siswa(LOWER(nama));
```

#### 3. Implicit Type Conversion

```sql
-- BURUK: phone_number adalah VARCHAR, tapi query pakai integer
SELECT * FROM siswa WHERE phone_number = 081234567890;
-- Database harus convert setiap baris → full table scan

-- BAIK: Gunakan tipe yang sama dengan kolom
SELECT * FROM siswa WHERE phone_number = '081234567890';
```

#### 4. OR yang Tidak Efektif

```sql
-- KURANG BAIK: OR bisa mencegah index usage
SELECT * FROM siswa WHERE nama = 'Budi' OR nama = 'Siti' OR nama = 'Andi';

-- LEBIH BAIK: IN operator
SELECT * FROM siswa WHERE nama IN ('Budi', 'Siti', 'Andi');

-- TERBAIK untuk banyak nilai: Temporary table + JOIN
CREATE TEMP TABLE target_names (nama VARCHAR(100));
INSERT INTO target_names VALUES ('Budi'), ('Siti'), ('Andi'), ...;
SELECT s.* FROM siswa s JOIN target_names t ON s.nama = t.nama;
```

#### 5. N+1 Query Problem

```python
# BURUK: 1 query untuk orders + N query untuk setiap user
orders = db.query("SELECT * FROM orders WHERE status = 'pending'")
for order in orders:
    user = db.query("SELECT * FROM users WHERE id = ?", order.user_id)  # N queries!

# BAIK: Single query dengan JOIN
results = db.query("""
    SELECT o.*, u.name, u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.status = 'pending'
""")

# BAIK ALTERNATIF: IN clause (2 queries total)
orders = db.query("SELECT * FROM orders WHERE status = 'pending'")
user_ids = [o.user_id for o in orders]
users = db.query("SELECT * FROM users WHERE id IN (?)", user_ids)  # 1 query
```

#### 6. Missing LIMIT pada Pagination

```sql
-- BURUK: Mengambil semua baris lalu discard di aplikasi
SELECT * FROM orders WHERE user_id = 1;

-- BAIK: Pagination dengan LIMIT dan OFFSET
SELECT * FROM orders WHERE user_id = 1 ORDER BY created_at DESC LIMIT 20 OFFSET 0;

-- TERBAIK untuk offset besar: Keyset pagination (cursor-based)
SELECT * FROM orders
WHERE user_id = 1 AND created_at < '2024-01-15 10:30:00'
ORDER BY created_at DESC
LIMIT 20;
-- Tidak ada OFFSET → performa konsisten meskipun di halaman ke-1000
```

---

## 🔌 CONNECTION POOLING

Setiap koneksi database membutuhkan resource (memory, process/thread). Connection pooling mengelola pool koneksi yang bisa di-reuse.

### Mengapa Connection Pooling Penting?

```
Tanpa Pooling:
Client 1 → Connect → Auth → Query → Disconnect  (50ms overhead)
Client 2 → Connect → Auth → Query → Disconnect  (50ms overhead)
Client 3 → Connect → Auth → Query → Disconnect  (50ms overhead)
Total: 150ms overhead untuk 3 query

Dengan Pooling:
Pool: [Conn1, Conn2, Conn3] (sudah connected)
Client 1 → Borrow Conn1 → Query → Return  (1ms overhead)
Client 2 → Borrow Conn2 → Query → Return  (1ms overhead)
Client 3 → Borrow Conn3 → Query → Return  (1ms overhead)
Total: 3ms overhead untuk 3 query
```

### Connection Limits

| Database | Default max_connections | Rekomendasi |
|---|---|---|
| PostgreSQL | 100 | 100-300 (dengan pooler) |
| MySQL | 151 | 151-500 (dengan pooler) |
| SQL Server | 32,767 | Sesuaikan dengan hardware |

**Rule of thumb:** `max_connections = (available_memory - shared_buffers) / connection_memory`

Setiap koneksi PostgreSQL membutuhkan ~2-10 MB memory. Dengan 1000 koneksi = 2-10 GB hanya untuk koneksi!

### PgBouncer (PostgreSQL Connection Pooler)

PgBouncer adalah connection pooler paling populer untuk PostgreSQL dengan 3 mode pooling:

```ini
; pgbouncer.ini

[databases]
mydb = host=127.0.0.1 port=5432 dbname=mydb

[pgbouncer]
listen_port = 6432
listen_addr = *

; Mode 1: Session pooling (default)
; Koneksi di-hold oleh client sampai disconnect
pool_mode = session

; Mode 2: Transaction pooling
; Koneksi di-release setelah transaksi selesai
; REKOMENDASI untuk kebanyakan web apps
pool_mode = transaction

; Mode 3: Statement pooling
; Koneksi di-release setelah setiap statement
; Paling agresif, tidak support prepared statements
pool_mode = statement

max_client_conn = 1000    ; Max koneksi dari aplikasi
default_pool_size = 25    ; Max koneksi ke database per pool
min_pool_size = 5         ; Min koneksi yang selalu siap
reserve_pool_size = 5     ; Tambahan koneksi saat peak
```

**Perbandingan Mode Pooling:**

| Mode | Koneksi di-release | Support Prepared Statements | Use Case |
|---|---|---|---|
| Session | Saat client disconnect | YA | Legacy apps, long transactions |
| Transaction | Setelah COMMIT/ROLLBACK | TIDAK | Web apps (REKOMENDASI) |
| Statement | Setelah setiap statement | TIDAK | Stateless apps, highest concurrency |

### Application-Level Pooling

```python
# Python: SQLAlchemy connection pool
from sqlalchemy import create_engine

engine = create_engine(
    "postgresql://user:pass@localhost:5432/mydb",
    pool_size=20,           # Max koneksi di pool
    max_overflow=10,        # Koneksi tambahan saat peak
    pool_timeout=30,        # Timeout menunggu koneksi
    pool_recycle=1800,      # Recycle koneksi setelah 30 menit
    pool_pre_ping=True,     # Test koneksi sebelum pakai
)

# Node.js: pg pool
const { Pool } = require('pg');
const pool = new Pool({
    max: 20,                # Max koneksi
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
```

---

## 💾 BACKUP STRATEGIES

### Logical Backup (pg_dump / mysqldump)

Backup dalam format SQL statements. Portable antar versi dan platform.

```bash
# PostgreSQL: Full database backup
pg_dump -U postgres -d mydb -F c -f backup_$(date +%Y%m%d).dump

# PostgreSQL: Specific tables only
pg_dump -U postgres -d mydb -t siswa -t guru -F c -f backup_tables.dump

# PostgreSQL: Schema only (no data)
pg_dump -U postgres -d mydb --schema-only -f schema.sql

# PostgreSQL: Data only (no schema)
pg_dump -U postgres -d mydb --data-only -F c -f data.dump

# PostgreSQL: Restore
pg_restore -U postgres -d mydb -c backup_20240115.dump

# MySQL: Full backup
mysqldump -u root -p --all-databases > full_backup.sql

# MySQL: Single database
mysqldump -u root -p mydb > mydb_backup.sql

# MySQL: Restore
mysql -u root -p mydb < mydb_backup.sql
```

**Kelebihan Logical Backup:**
- Portable antar versi database
- Bisa restore selective (table, schema)
- Format readable (SQL text)
- Bisa edit sebelum restore

**Kekurangan:**
- Lebih lambat untuk database besar
- Tidak support point-in-time recovery
- Lock table saat backup (tergantung option)

### Physical Backup (Base Backup)

Backup file-file database secara langsung. Lebih cepat untuk database besar.

```bash
# PostgreSQL: Base backup dengan pg_basebackup
pg_basebackup -D /backup/pg_base_$(date +%Y%m%d) -Fp -Xs -P -U postgres

# PostgreSQL: Restore dari physical backup
# 1. Stop PostgreSQL
# 2. Hapus data directory lama
# 3. Copy backup ke data directory
# 4. Buat recovery signal
touch /var/lib/postgresql/data/recovery.signal
# 5. Start PostgreSQL
```

**Kelebihan Physical Backup:**
- Sangat cepat untuk restore database besar
- Exact copy dari database
- Support point-in-time recovery (dengan WAL)

**Kekurangan:**
- Tidak portable (harus versi dan OS sama)
- Tidak bisa selective restore
- Ukuran backup = ukuran database

### Point-in-Time Recovery (PITR)

Menggabungkan base backup dengan WAL archive untuk restore ke waktu spesifik.

```bash
# 1. Setup WAL archiving di postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'cp %p /backup/wal_archive/%f'

# 2. Buat base backup
pg_basebackup -D /backup/base_$(date +%Y%m%d) -Fp -Xs -P

# 3. Restore ke waktu spesifik
# Copy base backup ke data directory
# Buat recovery signal dengan target time
cat > /var/lib/postgresql/data/recovery.signal << EOF
restore_command = 'cp /backup/wal_archive/%f %p'
recovery_target_time = '2024-01-15 14:30:00'
recovery_target_action = 'promote'
EOF

# 4. Start PostgreSQL
# Database akan replay WAL sampai 2024-01-15 14:30:00
```

**Timeline PITR:**

```
[Base Backup] ───── [WAL Archive] ───── [WAL Archive] ───── [NOW]
     Jan 1              Jan 5              Jan 10           Jan 15
                                              ↑
                                    Restore ke titik ini
                                    (Jan 10, 09:15:00)
```

### Backup Strategy Rekomendasi

| Strategi | Frekuensi | Retensi | Use Case |
|---|---|---|---|
| Full logical backup | Mingguan | 4 minggu | Database kecil (< 10GB) |
| Full physical backup | Mingguan | 4 minggu | Database besar (> 10GB) |
| WAL archive | Continuous | 7 hari | PITR capability |
| Logical backup selective | Harian | 14 hari | Tabel kritis saja |

---

## 📐 DATABASE NORMALIZATION

Normalisasi adalah proses mengorganisir data untuk mengurangi redundansi dan anomaly.

### 1NF (First Normal Form)

**Aturan:** Setiap kolom harus berisi nilai atomic (tidak bisa dipecah lagi). Tidak ada kolom dengan multiple values.

```sql
-- TIDAK 1NF: Kolom "telepon" berisi multiple values
CREATE TABLE siswa_bad (
    id INT PRIMARY KEY,
    nama VARCHAR(100),
    telepon VARCHAR(200)  -- '081234567890, 082345678901'
);

-- SUDAH 1NF: Pisahkan ke tabel terpisah
CREATE TABLE siswa (
    id INT PRIMARY KEY,
    nama VARCHAR(100)
);

CREATE TABLE siswa_telepon (
    siswa_id INT REFERENCES siswa(id),
    telepon VARCHAR(20),
    PRIMARY KEY (siswa_id, telepon)
);
```

### 2NF (Second Normal Form)

**Aturan:** Harus sudah 1NF, dan semua kolom non-key harus bergantung pada SELURUH primary key (bukan sebagian).

```sql
-- TIDAK 2NF: Primary key composite (siswa_id, mata_pelajaran)
-- tapi nama_siswa hanya bergantung pada siswa_id
CREATE TABLE nilai_bad (
    siswa_id INT,
    mata_pelajaran VARCHAR(50),
    nama_siswa VARCHAR(100),    -- Hanya bergantung pada siswa_id!
    nilai DECIMAL(5, 2),
    PRIMARY KEY (siswa_id, mata_pelajaran)
);

-- SUDAH 2NF: Pisahkan data siswa
CREATE TABLE siswa (
    id INT PRIMARY KEY,
    nama VARCHAR(100)
);

CREATE TABLE nilai (
    siswa_id INT REFERENCES siswa(id),
    mata_pelajaran VARCHAR(50),
    nilai DECIMAL(5, 2),
    PRIMARY KEY (siswa_id, mata_pelajaran)
);
```

### 3NF (Third Normal Form)

**Aturan:** Harus sudah 2NF, dan tidak ada transitive dependency (kolom non-key bergantung pada kolom non-key lain).

```sql
-- TIDAK 3NF: nama_mapel bergantung pada kode_mapel (bukan pada siswa_id)
CREATE TABLE nilai_bad (
    siswa_id INT PRIMARY KEY,
    nama_siswa VARCHAR(100),
    kode_mapel VARCHAR(10),
    nama_mapel VARCHAR(50),     -- Bergantung pada kode_mapel, bukan siswa_id!
    nilai DECIMAL(5, 2)
);

-- SUDAH 3NF: Pisahkan semua dependency
CREATE TABLE siswa (
    id INT PRIMARY KEY,
    nama VARCHAR(100)
);

CREATE TABLE mata_pelajaran (
    kode VARCHAR(10) PRIMARY KEY,
    nama VARCHAR(50)
);

CREATE TABLE nilai (
    siswa_id INT REFERENCES siswa(id),
    kode_mapel VARCHAR(10) REFERENCES mata_pelajaran(kode),
    nilai DECIMAL(5, 2),
    PRIMARY KEY (siswa_id, kode_mapel)
);
```

### BCNF (Boyce-Codd Normal Form)

**Aturan:** Harus sudah 3NF, dan setiap determinan harus candidate key.

```sql
-- Skenario: Satu guru hanya mengajar satu mata pelajaran
-- Tapi satu mata pelajaran bisa diajar banyak guru

CREATE TABLE jadwal_bad (
    guru VARCHAR(100),
    mata_pelajaran VARCHAR(50),
    ruang VARCHAR(20),
    PRIMARY KEY (guru, mata_pelajaran)
);

-- Masalah: guru → mata_pelajaran (guru menentukan mapel)
-- Tapi mata_pelajaran BUKAN candidate key (bukan primary key)
-- Ini melanggar BCNF

-- SUDAH BCNF: Pisahkan
CREATE TABLE guru_mapel (
    guru VARCHAR(100) PRIMARY KEY,
    mata_pelajaran VARCHAR(50)
);

CREATE TABLE jadwal (
    mata_pelajaran VARCHAR(50),
    ruang VARCHAR(20),
    PRIMARY KEY (mata_pelajaran)
);
```

### Normalization Trade-off

| Normalization Level | Redundansi | Query Complexity | Write Speed | Read Speed |
|---|---|---|---|---|
| Denormalized | Tinggi | Rendah (sedikit JOIN) | Cepat | Cepat |
| 1NF | Sedang | Sedang | Sedang | Sedang |
| 2NF | Rendah | Tinggi (banyak JOIN) | Lambat | Lambat |
| 3NF/BCNF | Minimal | Sangat Tinggi | Paling Lambat | Paling Lambat |

**Praktis:** Kebanyakan aplikasi berhenti di 3NF. Denormalisasi selektif dilakukan untuk performa pada query yang sering dijalankan.

---

## 🔄 REPLICATION DEEP DIVE

### Asynchronous Replication

Master tidak menunggu slave mengkonfirmasi penerimaan data.

```
Master ──[WAL stream]──→ Slave
  │                        │
  │ (COMMIT langsung)      │ (apply WAL nanti)
  ↓                        ↓
Response ke client      Data eventually consistent
```

**Keuntungan:**
- Performa tinggi (master tidak wait)
- Latency rendah untuk write

**Kekurangan:**
- Data loss jika master crash sebelum WAL sampai ke slave
- Replication lag (slave bisa tertinggal beberapa detik/menit)

**Use case:** Read scaling, backup, analytics.

### Synchronous Replication

Master menunggu slave mengkonfirmasi penerimaan data sebelum commit.

```
Master ──[WAL stream]──→ Slave
  │                        │
  │ (tunggu ACK)          │ (apply WAL)
  │                        │
  │←──────[ACK]───────────│
  ↓
COMMIT → Response ke client
```

**Keuntungan:**
- Zero data loss (slave selalu up-to-date)
- High availability (slave bisa langsung jadi master)

**Kekurangan:**
- Latency tinggi (harus wait slave)
- Jika slave down, master juga terblokir

**Use case:** Financial systems, data yang tidak boleh hilang.

### Semi-Synchronous Replication

Hybrid: Master menunggu minimal SATU slave mengkonfirmasi, tapi tidak semua.

```
Master ──[WAL]──→ Slave 1 (ACK) ──┐
                                   ├──→ COMMIT setelah 1 ACK
          ──[WAL]──→ Slave 2 ─────┘
```

**Keuntungan:**
- Balance antara performa dan safety
- Minimal 1 slave selalu up-to-date

**Kekurangan:**
- Masih ada kemungkinan data loss jika master dan slave yang ACK crash bersamaan

**Use case:** Production systems yang butuh balance.

### PostgreSQL Replication Setup

```ini
# postgresql.conf di Master
wal_level = replica
max_wal_senders = 10
max_replication_slots = 10

# postgresql.conf di Slave (standby)
hot_standby = on

# Buat replication slot
SELECT pg_create_physical_replication_slot('standby1');

# Buat replication user
CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'secure_password';

# pg_hba.conf di Master
host replication replicator 192.168.1.0/24 md5
```

### MySQL Replication Setup

```sql
-- Master: Setup
[mysqld]
server-id = 1
log_bin = mysql-bin
binlog_format = ROW

CREATE USER 'repl'@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';
SHOW MASTER STATUS;  -- Catat File dan Position

-- Slave: Setup
[mysqld]
server-id = 2
relay_log = mysql-relay-bin
read_only = 1

CHANGE MASTER TO
    MASTER_HOST='master_ip',
    MASTER_USER='repl',
    MASTER_PASSWORD='password',
    MASTER_LOG_FILE='mysql-bin.000001',
    MASTER_LOG_POS=154;

START SLAVE;
SHOW SLAVE STATUS\G  -- Cek Slave_IO_Running dan Slave_SQL_Running
```

---

## 🏦 REAL-WORLD: RDBMS DI INDUSTRI

### Banking System

Bank menggunakan RDBMS untuk core banking system dengan requirement ketat:

```
Arsitektur Core Banking:

┌─────────────────────────────────────────────────┐
│              Core Banking Database               │
│  ┌─────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │Account  │ │Transaction│ │Customer          │  │
│  │Table    │ │Table     │ │Table             │  │
│  │(ACID)   │ │(ACID)    │ │(ACID)            │  │
│  └─────────┘ └──────────┘ └──────────────────┘  │
│                                                   │
│  Isolation: SERIALIZABLE untuk transfer          │
│  Replication: Synchronous (zero data loss)        │
│  Backup: PITR + daily full backup                │
│  Audit: Semua perubahan di-log ke audit table    │
└─────────────────────────────────────────────────┘
```

**Contoh: Transfer antar bank**

```sql
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- 1. Lock rekening sumber (SELECT FOR UPDATE mencegah concurrent access)
SELECT saldo FROM rekening WHERE id = '1234567890' FOR UPDATE;

-- 2. Validasi saldo cukup
-- (jika saldo < amount, ROLLBACK)

-- 3. Debit rekening sumber
UPDATE rekening SET saldo = saldo - 1000000
WHERE id = '1234567890';

-- 4. Credit rekening tujuan
UPDATE rekening SET saldo = saldo + 1000000
WHERE id = '0987654321';

-- 5. Catat transaksi
INSERT INTO transaksi (
    sumber, tujuan, amount, jenis, waktu, status
) VALUES (
    '1234567890', '0987654321', 1000000, 'transfer', NOW(), 'success'
);

-- 6. Audit trail
INSERT INTO audit_log (
    table_name, action, old_value, new_value, user_id, timestamp
) VALUES (
    'rekening', 'UPDATE',
    '{"id":"1234567890","saldo":5000000}',
    '{"id":"1234567890","saldo":4000000}',
    'teller_01', NOW()
);

COMMIT;
```

**Requirement banking:**
- Zero data loss (synchronous replication)
- Full audit trail (semua perubahan tercatat)
- Compliance (regulasi OJK, BI)
- High availability (failover < 30 detik)
- Backup harian dengan PITR

### E-Commerce Platform

E-commerce menggunakan RDBMS untuk data transaksional dengan pattern read-heavy:

```
Arsitektur E-Commerce:

┌──────────┐    ┌──────────┐    ┌──────────┐
│  Master  │───→│  Slave 1 │    │  Redis   │
│ (write)  │    │ (read)   │    │ (cache)  │
└──────────┘    ├──────────┤    └──────────┘
                │  Slave 2 │
                │ (read)   │    ┌──────────┐
                └──────────┘    │Elastic   │
                                │(search)  │
                                └──────────┘

Read/Write split:
- Checkout, payment → Master
- Browse, search    → Slave / Cache
```

**Contoh: Order processing**

```sql
-- 1. Buat order (write ke master)
BEGIN TRANSACTION;

INSERT INTO orders (user_id, total, status, created_at)
VALUES (12345, 250000, 'pending', NOW())
RETURNING id;  -- order_id = 98765

-- 2. Insert order items
INSERT INTO order_items (order_id, product_id, qty, price)
VALUES
    (98765, 101, 2, 50000),
    (98765, 205, 1, 150000);

-- 3. Kurangi stok produk
UPDATE products
SET stock = stock - 2
WHERE id = 101 AND stock >= 2;

UPDATE products
SET stock = stock - 1
WHERE id = 205 AND stock >= 1;

-- 4. Jika stok tidak cukup, ROLLBACK
-- (PostgreSQL: CHECK constraint atau trigger)

COMMIT;

-- 5. Read dari slave (untuk user melihat order)
-- (otomatis di-route oleh connection pooler / application logic)
SELECT o.*, u.name, u.email
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.id = 98765;
```

**Optimasi e-commerce:**
- Read/write split dengan master-slave
- Catalog/product di-cache di Redis
- Search menggunakan Elasticsearch
- Session data di Redis (bukan RDBMS)
- Analytics di data warehouse terpisah

---

## 🛠️ PRAKTIK: DESAIN DATABASE KOMPLEKS

### Skenario: Sistem Manajemen Sekolah Menyeluruh

Desain database untuk sistem yang mengelola:
- Data siswa, guru, dan staff
- Jadwal pelajaran dan ruangan
- Nilai dan rapor
- Keuangan (SPP, BOS)
- Absensi
- Perpustakaan

```sql
-- 1. Tabel dasar: Pengguna sistem
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'guru', 'siswa', 'staff')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Data guru
CREATE TABLE guru (
    id UUID PRIMARY KEY REFERENCES users(id),
    nip VARCHAR(18) UNIQUE,
    nama_lengkap VARCHAR(100) NOT NULL,
    nuptk VARCHAR(16),
    tanggal_lahir DATE,
    jenis_kelamin VARCHAR(10) CHECK (jenis_kelamin IN ('L', 'P')),
    alamat TEXT,
    telepon VARCHAR(20),
    status_aktif BOOLEAN DEFAULT true
);

-- 3. Data siswa
CREATE TABLE siswa (
    id UUID PRIMARY KEY REFERENCES users(id),
    nisn VARCHAR(10) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin VARCHAR(10) CHECK (jenis_kelamin IN ('L', 'P')),
    tempat_lahir VARCHAR(50),
    alamat TEXT,
    nama_ortu VARCHAR(100),
    telepon_ortu VARCHAR(20),
    kelas_id INT,
    status_aktif BOOLEAN DEFAULT true
);

-- 4. Kelas / Rombel
CREATE TABLE kelas (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(20) NOT NULL,  -- '7A', '8B', '9C'
    tahun_ajaran VARCHAR(20) NOT NULL,  -- '2024/2025'
    wali_kelas_id UUID REFERENCES guru(id),
    ruang_id INT,
    kapasitas INT DEFAULT 36,
    UNIQUE (nama, tahun_ajaran)
);

-- 5. Mata Pelajaran
CREATE TABLE mata_pelajaran (
    id SERIAL PRIMARY KEY,
    kode VARCHAR(10) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    kategori VARCHAR(50)  -- 'wajib', 'muatan_lokal', 'ekstrakurikuler'
);

-- 6. Ruangan
CREATE TABLE ruangan (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(50) NOT NULL,
    tipe VARCHAR(30) CHECK (tipe IN ('kelas', 'lab', 'ruang_guru', 'aula', 'lapangan')),
    kapasitas INT,
    fasilitas TEXT[]  -- Array PostgreSQL: {'proyektor', 'ac', 'komputer'}
);

-- 7. Jadwal Pelajaran
CREATE TABLE jadwal (
    id SERIAL PRIMARY KEY,
    kelas_id INT NOT NULL REFERENCES kelas(id),
    mapel_id INT NOT NULL REFERENCES mata_pelajaran(id),
    guru_id UUID NOT NULL REFERENCES guru(id),
    ruang_id INT NOT NULL REFERENCES ruangan(id),
    hari VARCHAR(10) CHECK (hari IN ('senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu')),
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    semester INT CHECK (semester IN (1, 2)),
    tahun_ajaran VARCHAR(20) NOT NULL,
    -- Constraint: Guru tidak bisa di 2 tempat bersamaan
    CONSTRAINT no_guru_overlap EXCLUDE USING gist (
        guru_id WITH =,
        tsrange(
            (tahun_ajaran || '-01-01 ' || jam_mulai)::timestamp +
            (CASE hari
                WHEN 'senin' THEN 0
                WHEN 'selasa' THEN 1
                WHEN 'rabu' THEN 2
                WHEN 'kamis' THEN 3
                WHEN 'jumat' THEN 4
                WHEN 'sabtu' THEN 5
            END) * INTERVAL '1 day',
            (tahun_ajaran || '-01-01 ' || jam_selesai)::timestamp +
            (CASE hari
                WHEN 'senin' THEN 0
                WHEN 'selasa' THEN 1
                WHEN 'rabu' THEN 2
                WHEN 'kamis' THEN 3
                WHEN 'jumat' THEN 4
                WHEN 'sabtu' THEN 5
            END) * INTERVAL '1 day'
        ) WITH &&
    )
);

-- 8. Absensi Siswa
CREATE TABLE absensi_siswa (
    id SERIAL PRIMARY KEY,
    siswa_id UUID NOT NULL REFERENCES siswa(id),
    tanggal DATE NOT NULL,
    status VARCHAR(10) NOT NULL CHECK (status IN ('hadir', 'sakit', 'izin', 'alpha')),
    keterangan TEXT,
    pencatat_id UUID REFERENCES guru(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (siswa_id, tanggal)
);

-- 9. Nilai Siswa
CREATE TABLE nilai (
    id SERIAL PRIMARY KEY,
    siswa_id UUID NOT NULL REFERENCES siswa(id),
    mapel_id INT NOT NULL REFERENCES mata_pelajaran(id),
    guru_id UUID NOT NULL REFERENCES guru(id),
    jenis VARCHAR(20) CHECK (jenis IN ('harian', 'uts', 'uas', 'tugas', 'praktikum')),
    nilai DECIMAL(5, 2) NOT NULL CHECK (nilai >= 0 AND nilai <= 100),
    semester INT CHECK (semester IN (1, 2)),
    tahun_ajaran VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 10. Keuangan: Pembayaran SPP
CREATE TABLE pembayaran_spp (
    id SERIAL PRIMARY KEY,
    siswa_id UUID NOT NULL REFERENCES siswa(id),
    bulan INT NOT NULL CHECK (bulan BETWEEN 1 AND 12),
    tahun INT NOT NULL,
    jumlah DECIMAL(12, 2) NOT NULL,
    tanggal_bayar DATE,
    metode VARCHAR(20) CHECK (metode IN ('cash', 'transfer', 'qris')),
    status VARCHAR(20) CHECK (status IN ('belum_bayar', 'lunas', 'cicilan')),
    pencatat_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (siswa_id, bulan, tahun)
);

-- 11. Keuangan: Transaksi BOS
CREATE TABLE transaksi_bos (
    id SERIAL PRIMARY KEY,
    kode_transaksi VARCHAR(30) UNIQUE NOT NULL,
    tanggal DATE NOT NULL,
    jenis VARCHAR(10) CHECK (jenis IN ('masuk', 'keluar')),
    kategori VARCHAR(50) NOT NULL,
    jumlah DECIMAL(15, 2) NOT NULL,
    keterangan TEXT,
    bukti_dokumen TEXT,  -- Path file
    disetujui_oleh UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    CHECK (jumlah > 0)
);

-- 12. Perpustakaan: Buku
CREATE TABLE buku (
    id SERIAL PRIMARY KEY,
    isbn VARCHAR(13) UNIQUE,
    judul VARCHAR(200) NOT NULL,
    pengarang VARCHAR(100),
    penerbit VARCHAR(100),
    tahun_terbit INT,
    kategori VARCHAR(50),
    stok INT NOT NULL DEFAULT 0 CHECK (stok >= 0),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 13. Perpustakaan: Peminjaman
CREATE TABLE peminjaman (
    id SERIAL PRIMARY KEY,
    buku_id INT NOT NULL REFERENCES buku(id),
    siswa_id UUID NOT NULL REFERENCES siswa(id),
    tanggal_pinjam DATE NOT NULL DEFAULT CURRENT_DATE,
    tanggal_kembali DATE NOT NULL,
    tanggal_dikembalikan DATE,
    status VARCHAR(20) CHECK (status IN ('dipinjam', 'dikembalikan', 'terlambat', 'hilang')),
    denda DECIMAL(10, 2) DEFAULT 0
);

-- INDEXES untuk performa
CREATE INDEX idx_siswa_kelas ON siswa(kelas_id);
CREATE INDEX idx_siswa_nisn ON siswa(nisn);
CREATE INDEX idx_absensi_siswa_tanggal ON absensi_siswa(siswa_id, tanggal);
CREATE INDEX idx_nilai_siswa_mapel ON nilai(siswa_id, mapel_id);
CREATE INDEX idx_jadwal_kelas ON jadwal(kelas_id, hari, jam_mulai);
CREATE INDEX idx_pembayaran_siswa ON pembayaran_spp(siswa_id, tahun);
CREATE INDEX idx_transaksi_bos_tanggal ON transaksi_bos(tanggal, jenis);
CREATE INDEX idx_peminjaman_status ON peminjaman(status, tanggal_kembali);

-- PARTIAL INDEX: Hanya buku yang tersedia
CREATE INDEX idx_buku_tersedia ON buku(id) WHERE stok > 0;

-- PARTIAL INDEX: Hanya peminjaman yang belum dikembalikan
CREATE INDEX idx_peminjaman_aktif ON peminjaman(siswa_id, tanggal_kembali)
WHERE status IN ('dipinjam', 'terlambat');
```

**Query kompleks contoh:**

```sql
-- 1. Rapor siswa: Nilai rata-rata per mata pelajaran
SELECT
    mp.nama AS mata_pelajaran,
    ROUND(AVG(n.nilai), 2) AS rata_rata,
    MIN(n.nilai) AS nilai_terendah,
    MAX(n.nilai) AS nilai_tertinggi
FROM nilai n
JOIN mata_pelajaran mp ON n.mapel_id = mp.id
WHERE n.siswa_id = 'uuid-siswa'
  AND n.semester = 1
  AND n.tahun_ajaran = '2024/2025'
GROUP BY mp.nama
ORDER BY mp.nama;

-- 2. Statistik absensi per kelas
SELECT
    k.nama AS kelas,
    COUNT(*) AS total_hari,
    SUM(CASE WHEN a.status = 'hadir' THEN 1 ELSE 0 END) AS hadir,
    SUM(CASE WHEN a.status = 'sakit' THEN 1 ELSE 0 END) AS sakit,
    SUM(CASE WHEN a.status = 'izin' THEN 1 ELSE 0 END) AS izin,
    SUM(CASE WHEN a.status = 'alpha' THEN 1 ELSE 0 END) AS alpha,
    ROUND(
        100.0 * SUM(CASE WHEN a.status = 'hadir' THEN 1 ELSE 0 END) / COUNT(*),
        2
    ) AS persentase_kehadiran
FROM absensi_siswa a
JOIN siswa s ON a.siswa_id = s.id
JOIN kelas k ON s.kelas_id = k.id
WHERE k.tahun_ajaran = '2024/2025'
GROUP BY k.id, k.nama
ORDER BY persentase_kehadiran DESC;

-- 3. Laporan keuangan BOS: Realisasi per kategori
SELECT
    kategori,
    SUM(CASE WHEN jenis = 'masuk' THEN jumlah ELSE 0 END) AS pemasukan,
    SUM(CASE WHEN jenis = 'keluar' THEN jumlah ELSE 0 END) AS pengeluaran,
    SUM(CASE WHEN jenis = 'masuk' THEN jumlah ELSE 0 END) -
    SUM(CASE WHEN jenis = 'keluar' THEN jumlah ELSE 0 END) AS saldo
FROM transaksi_bos
WHERE tanggal BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY kategori
ORDER BY saldo DESC;

-- 4. Buku yang sering dipinjam (top 10)
SELECT
    b.judul,
    b.pengarang,
    COUNT(p.id) AS jumlah_pinjam,
    SUM(CASE WHEN p.status = 'terlambat' THEN 1 ELSE 0 END) AS terlambat
FROM peminjaman p
JOIN buku b ON p.buku_id = b.id
GROUP BY b.id, b.judul, b.pengarang
ORDER BY jumlah_pinjam DESC
LIMIT 10;
```

---

## ✅ CHECKLIST

- [ ] Bisa menjelaskan apa itu RDBMS dan komponen utamanya
- [ ] Paham ACID properties dengan contoh konkret
- [ ] Paham 4 isolation levels dan anomaly yang dicegah
- [ ] Bisa memilih isolation level yang tepat untuk use case
- [ ] Paham jenis-jenis index (B-Tree, Hash, Composite, Covering, Partial)
- [ ] Bisa membaca EXPLAIN ANALYZE output
- [ ] Mengenal common query anti-patterns dan solusinya
- [ ] Paham connection pooling dan kapan menggunakannya
- [ ] Paham strategi backup (logical, physical, PITR)
- [ ] Paham database normalization (1NF, 2NF, 3NF, BCNF)
- [ ] Paham replication: async, sync, semi-sync
- [ ] Bisa mendesain database untuk skenario kompleks
- [ ] Tahu kapan pakai RDBMS vs NoSQL

---

## 🔗 REFERENSI

- **System Design Primer:** [donnemartin/system-design-primer — Database](https://github.com/donnemartin/system-design-primer#database)
- **PostgreSQL Documentation:** [postgresql.org/docs](https://www.postgresql.org/docs/)
  - [ACID Compliance](https://www.postgresql.org/docs/current/wal-intro.html)
  - [Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
  - [Index Types](https://www.postgresql.org/docs/current/indexes-types.html)
  - [EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
  - [Replication](https://www.postgresql.org/docs/current/different-replication-solutions.html)
- **MySQL Documentation:** [dev.mysql.com/doc](https://dev.mysql.com/doc/)
  - [InnoDB Architecture](https://dev.mysql.com/doc/refman/8.0/en/innodb-architecture.html)
  - [Transaction Isolation Levels](https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html)
  - [Replication](https://dev.mysql.com/doc/refman/8.0/en/replication.html)
- **Use The Index, Luke:** [use-the-index-luke.com](https://use-the-index-luke.com/) — Panduan index yang praktis
- **SQL Performance Explained:** [Useful SQL performance book by Markus Winand](https://sql-performance-explained.com/)

---

> **Lanjut ke:** [`13-database-nosql.md`](./13-database-nosql.md)