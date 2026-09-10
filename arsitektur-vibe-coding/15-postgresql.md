# 🐘 Modul 15: PostgreSQL — Database Server untuk Produksi

> **PostgreSQL = "gudang arsip besar" yang dipakai aplikasi serius di seluruh dunia.**
> Waktu: ~3-4 jam | Level: 🟡 Intermediate | Lanjutan dari: Modul 14 (SQLite)

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Beda mendasar SQLite vs PostgreSQL
✅ Install & menjalankan PostgreSQL lokal
✅ Konsep: user, database, port, koneksi
✅ Relasi antar tabel (Foreign Key) & JOIN
✅ Migrasi dari SQLite ke PostgreSQL
```

---

## 🧠 15.1 SQLITE vs POSTGRESQL

```text
┌──────────────────────────┬──────────────────────────┐
│  SQLITE (Modul 14)       │  POSTGRESQL (Modul ini)  │
├──────────────────────────┼──────────────────────────┤
│ 📁 1 file                │ 🖥️ Program server        │
│ 🔓 Tanpa user/password   │ 🔐 Ada user & password   │
│ 🚫 Tanpa port            │ 🔌 Port default: 5432    │
│ 💪 Cukup data kecil      │ 💪 Besar & banyak user   │
│ 📱 Aplikasi pribadi      │ 🌍 Aplikasi produksi     │
│ 🚀 Mulai cepat           │ ⚙️ Butuh setup dulu      │
└──────────────────────────┴──────────────────────────┘
```

### Kenapa Perlu PostgreSQL?

```text
SAAT SQLITE MULAI "KEWALAHAN":
1. Banyak orang akses bersamaan → data konflik
2. Data penting → perlu backup & keamanan sungguhan
3. Aplikasi tumbuh → perlu query kompleks & cepat
4. Butuh fitur lanjutan: relasi rumit, trigger, json

SAAT ITU → PINDAH KE POSTGRESQL
```

> 🎯 **PostgreSQL = standar industri.** Dipakai oleh Instagram,
> Spotify, Reddit, dan banyak perusahaan besar. Belajar ini = investasi jangka panjang.

---

## 🧠 15.2 INSTALL & MENJALANKAN

### Cara Install (pilih salah satu)

```text
PILIHAN A — Docker (disarankan, bersih):
docker run --name postgres -e POSTGRES_PASSWORD=rahasia -p 5432:5432 -d postgres

PILIHAN B — Install langsung (Windows: postgresql.org → download installer)
- Ikuti wizard, ingat password yang dibuat
- Port default: 5432
```

Kalau bingung → minta AI pandu sesuai sistem operasi Anda.

### Masuk ke PostgreSQL (psql)

```bash
# Windows (dari Command Prompt/PowerShell)
psql -U postgres

# atau pakai GUI: pgAdmin (datang bersama installer)
```

### Perintah Dasar psql

```sql
\list          -- lihat semua database
\l             -- sama: lihat database
\connect nama  -- pindah ke database
\dt            -- lihat tabel di database ini
\q             -- keluar
```

### Buat Database Pertama

```sql
-- di psql
CREATE DATABASE perpustakaan;
\connect perpustakaan
```

---

## 🧠 15.3 KONSEP PENTING: DATABASE, USER, PORT

```text
POSTGRESQL = satu SERVER yang bisa melayani BANYAK database

┌────────────────────────────────────┐
│  PostgreSQL Server (port 5432)     │
│  ┌──────────────┐ ┌──────────────┐ │
│  │ Database A   │ │ Database B   │ │
│  │ perpustakaan │ │ absensi      │ │
│  └──────────────┘ └──────────────┘ │
│  User: postgres (superuser)        │
└────────────────────────────────────┘

KONEKSI MEMBUTUHKAN:
- host      → localhost
- port      → 5432
- database  → nama database
- user      → postgres
- password  → yang Anda buat saat install
```

### Koneksi dari Aplikasi (connection string)

```text
postgresql://USER:PASSWORD@HOST:PORT/NAMA_DATABASE

contoh:
postgresql://postgres:rahasia@localhost:5432/perpustakaan
```

---

## 🧠 15.4 RELASI ANTAR TABEL (Foreign Key)

Ini konsep yang membuat database "relasional" — dan ini jembatan ke
`fase-1-arsitektur-dasar` file `12` (RDBMS).

```text
MASALAH:
Buku dipinjam oleh Anggota. Bagaimana database tahu
"siapa meminjam buku apa"?

TANPA RELASI: satu tabel raksasa → data dobel & berantakan
DENGAN RELASI: tabel terpisah + foreign key (penunjuk)
```

### Contoh: Tiga Tabel yang Berelasi

```sql
-- Tabel 1: buku
CREATE TABLE buku (
  id      SERIAL PRIMARY KEY,
  judul   TEXT NOT NULL,
  penulis TEXT,
  stok    INTEGER DEFAULT 1
);

-- Tabel 2: anggota
CREATE TABLE anggota (
  id    SERIAL PRIMARY KEY,
  nama  TEXT NOT NULL,
  kelas TEXT
);

-- Tabel 3: peminjaman — menghubungkan buku & anggota
CREATE TABLE peminjaman (
  id             SERIAL PRIMARY KEY,
  buku_id        INTEGER REFERENCES buku(id),    -- FK → buku
  anggota_id     INTEGER REFERENCES anggota(id), -- FK → anggota
  tanggal_pinjam DATE DEFAULT CURRENT_DATE,
  tanggal_kembali DATE
);
```

```text
SERIAL      = auto-increment id (seperti AUTOINCREMENT di SQLite)
REFERENCES  = foreign key: kolom ini "menunjuk" ke tabel lain
```

### Analogi

```text
peminjaman.buku_id    = "kuitansi mencatat nomor buku mana"
peminjaman.anggota_id = "kuitansi mencatat siapa anggotanya"

Kuitansi (peminjaman) tidak menyalin semua data buku —
cukup mencatat id-nya (penunjuk ke data asli).
```

---

## 🧠 15.5 JOIN: MENGGABUNGKAN TABEL

Setelah tabel berelasi, bagaimana mengambil data gabungan? **JOIN.**

```sql
-- tampilkan daftar peminjaman lengkap dengan nama buku & anggota
SELECT
  peminjaman.id,
  buku.judul,
  anggota.nama,
  peminjaman.tanggal_pinjam
FROM peminjaman
JOIN buku    ON peminjaman.buku_id = buku.id
JOIN anggota ON peminjaman.anggota_id = anggota.id;
```

```text
HASILNYA:
┌────┬──────────────────┬────────┬────────────────┐
│ id │ judul            │ nama   │ tanggal_pinjam │
├────┼──────────────────┼────────┼────────────────┤
│ 1  │ Laskar Pelangi   │ Budi   │ 2026-08-01     │
│ 2  │ Bumi Manusia     │ Siti   │ 2026-08-02     │
└────┴──────────────────┴────────┴────────────────┘
```

### Tipe JOIN yang Perlu Anda Tahu

| JOIN | Arti |
|------|------|
| `INNER JOIN` | Hanya data yang cocok di kedua tabel |
| `LEFT JOIN` | Semua dari tabel kiri + yang cocok dari kanan (sisanya NULL) |

> 💡 **Jangan khawatir hafal!** AI bisa menulis JOIN untuk Anda.
> Yang penting paham: JOIN = menggabungkan data dari tabel berelasi.

---

## 🧠 15.6 PAKAI POSTGRESQL DI APLIKASI

### Prisma (Next.js) — pindah dari SQLite GAMPANG

```text
// .env — ganti DATABASE_URL
DATABASE_URL="postgresql://postgres:rahasia@localhost:5432/perpustakaan"
```

```prisma
// prisma/schema.prisma — ganti provider
datasource db {
  provider = "postgresql"   // ← dari "sqlite"
  url      = env("DATABASE_URL")
}
```

```bash
npx prisma migrate dev   # buat ulang tabel di PostgreSQL
```

> 🎯 **Itu saja!** Karena Prisma menyembunyikan perbedaan database,
> pindah SQLite → PostgreSQL tinggal ganti provider + URL.

### Laravel

```text
// .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=perpustakaan
DB_USERNAME=postgres
DB_PASSWORD=rahasia
```

```bash
php artisan migrate
```

---

## 🤖 15.7 TEMPLATE PROMPT POSTGRESQL

### Prompt 1: Setup PostgreSQL + Prisma

```text
Saya mau pindah proyek Next.js saya dari SQLite ke PostgreSQL.

LANGKAH:
1. Cek PostgreSQL terpasang (kalau belum, pandu install sesuai OS saya)
2. Buat database baru bernama [nama]
3. Ubah .env: DATABASE_URL postgresql://...
4. Ubah prisma/schema.prisma: provider = "postgresql"
5. Jalankan npx prisma migrate dev
6. Pastikan aplikasi tetap jalan & data bisa ditulis

Pandu langkah demi langkah, saya pemula database server.
```

### Prompt 2: Buat Database Berelasi

```text
Buat database PostgreSQL untuk aplikasi [aplikasi] dengan
3 tabel berelasi:

TABEL: [tabel 1] — [field]
TABEL: [tabel 2] — [field]
TABEL: [tabel 3] — [field] + foreign key ke tabel 1 & 2

1. Tulis perintah CREATE TABLE dengan referensi (REFERENCES)
2. Isi data contoh (5-10 baris)
3. Tulis query JOIN yang menggabungkan ketiganya
4. Jelaskan setiap bagian dengan bahasa sederhana
```

### Prompt 3: Ajarkan Relasi & JOIN

```text
Saya baru paham SQL dasar (dari SQLite) dan ingin belajar relasi.

Jelaskan dengan analogi sederhana:
1. Primary key vs foreign key
2. INNER JOIN vs LEFT JOIN (dengan contoh data kecil)
3. One-to-many: 1 buku bisa banyak peminjaman

Beri 5 latihan kecil dengan jawaban (pakai tabel buku/anggota/
peminjaman yang sudah kita buat).
```

---

## 🏗️ 15.8 PRAKTIK

### Latihan 1: Database Perpustakaan di PostgreSQL (45 menit)

```text
1. Setup PostgreSQL (Docker atau install langsung)
2. Buat database "perpustakaan"
3. Buat 3 tabel berelasi: buku, anggota, peminjaman
   (gunakan Prompt 2 di 15.7)
4. Isi data & jalankan query JOIN
5. Tampilkan: "daftar buku yang sedang dipinjam beserta nama peminjam"
```

### Latihan 2: Pindahkan Proyek dari SQLite ke PostgreSQL (60 menit)

```text
Gunakan Prompt 1 (15.7) untuk memindahkan proyek Next.js Anda
(perpustakaan/to-do) dari SQLite ke PostgreSQL.

Tes: tambah data → restart → data masih ada → SEMUA berfungsi.
```

### Latihan 3: Refleksi (10 menit)

```text
1. Apa 3 perbedaan utama SQLite vs PostgreSQL?
2. Kapan Anda pindah dari SQLite ke PostgreSQL?
3. Apa keuntungan foreign key / relasi?
4. Apa itu JOIN & kapan dipakai?
```

---

## 🧠 15.9 RANGKUMAN & KETIKA BINGUNG

### Yang Sudah Anda Pelajari

| Konsep | Intinya |
|--------|---------|
| **PostgreSQL** | Database server untuk produksi |
| **Koneksi** | host, port (5432), user, password, database |
| **Foreign Key** | Kolom penunjuk ke tabel lain |
| **JOIN** | Gabungkan data antar tabel |
| **Prisma pindah** | Ganti provider + URL saja |
| **psql** | Terminal PostgreSQL (\list, \dt, \q) |

### Checklist

```
☐ PostgreSQL terpasang & bisa diakses (psql/pgAdmin)
☐ Database "perpustakaan" dibuat
☐ 3 tabel berelasi + data contoh
☐ Query JOIN berfungsi
☐ Proyek Next.js pindah ke PostgreSQL & jalan
☐ Bisa jelaskan beda SQLite vs PostgreSQL
```

### Ketika Bingung

```text
❓ "Connection refused" di port 5432
   → server PostgreSQL belum dijalankan / Docker belum start

❓ "password authentication failed"
   → password salah / user belum diset. Cek .env atau settingan install

❓ Database tidak ada
   → buat dulu: CREATE DATABASE nama;

❓ Migrasi gagal
   → jalankan ulang npx prisma migrate dev; pastikan server jalan

❓ Stuck? Tempel error ke AI + konteks
```

---

## 🎯 KAPAN LANJUT?

Anda siap lanjut ke **Networking** jika sudah bisa:

```
☐ PostgreSQL terpasang & database dibuat
☐ 3 tabel berelasi dengan foreign key
☐ Query JOIN berfungsi
☐ Aplikasi terhubung ke PostgreSQL
```

> **Ingat:** Sekarang Anda paham database. Tapi bagaimana data
> "bepergian" lewat internet? Itu **Modul 16: Networking**!

---

---

## 📚 SUMBER & REFERENSI RESMI (modul 15)

| Topik | Dokumentasi resmi |
|-------|-------------------|
| PostgreSQL: port default | https://www.postgresql.org/docs/current/default-ports.html |
| psql | https://www.postgresql.org/docs/current/app-psql.html |
| CREATE DATABASE | https://www.postgresql.org/docs/current/sql-createdatabase.html |
| Data types (SERIAL) | https://www.postgresql.org/docs/current/datatype-numeric.html |
| JOINS | https://www.postgresql.org/docs/current/queries-table-expressions.html |
| Prisma (PostgreSQL) | https://www.prisma.io/docs/orm/prisma-schema/databases |

> 💡 **Catatan akurasi (verifikasi dari postgresql.org & prisma.io):**
> - PostgreSQL default port = **5432**; CLI bawaan = **psql**.
> - Connection string: `postgresql://USER:PASSWORD@HOST:PORT/DB`.
> - `SERIAL` = auto-increment id; `REFERENCES` = foreign key.
> - `INNER JOIN` = hanya yang cocok; `LEFT JOIN` = semua dari tabel kiri.
> - SQLite → PostgreSQL dengan Prisma: ganti provider + URL, jalankan
>   `npx prisma migrate dev`.

**📂 Lanjut ke: `16-networking.md`**
