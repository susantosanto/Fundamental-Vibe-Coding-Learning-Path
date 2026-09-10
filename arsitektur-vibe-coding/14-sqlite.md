# 🗃️ Modul 14: SQLite — Database Paling Sederhana

> **SQLite = "database 1 file". Paling mudah untuk mulai belajar database.**
> Waktu: ~3 jam | Level: 🟢🟡 | Lanjutan dari: Modul 6 (CRUD), 11-13 (backend)

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Apa itu database & SQL (bahasa database)
✅ SQLite: database "1 file" yang ramah pemula
✅ SQL dasar: CREATE, INSERT, SELECT, UPDATE, DELETE
✅ Koneksi SQLite dari Next.js (Prisma) & Laravel
✅ Kapan cukup SQLite, kapan harus PostgreSQL
```

---

## 🧠 14.1 APA ITU DATABASE & SQL?

**Database** = tempat menyimpan data secara terstruktur (sudah di Modul 6).

**SQL** = *Structured Query Language* = **bahasa untuk berbicara dengan database.**

```text
SQL = bahasa universal database
┌──────────────────────────────────────────────┐
│  SQL MEMILIKI 4 OPERASI DASAR (CRUD):       │
│                                              │
│  CREATE  → INSERT INTO ...                  │
│  READ    → SELECT ... FROM ...              │
│  UPDATE  → UPDATE ... SET ...               │
│  DELETE  → DELETE FROM ...                  │
└──────────────────────────────────────────────┘
```

> 🎯 **Kabar baik:** Anda sudah paham konsep CRUD dari Modul 6!
> Sekarang tinggal belajar "ejaan" SQL-nya.

---

## 🧠 14.2 SQLITE: DATABASE 1 FILE

| Aspek | SQLite | Database server (PostgreSQL, MySQL) |
|-------|--------|--------------------------------------|
| **Bentuk** | 1 file di komputer | Program terpisah yang berjalan |
| **Setup** | Tidak perlu install server | Harus install & jalankan server |
| **Cocok** | Proyek kecil, belajar, offline | Banyak user, produksi |
| **Contoh pemakai** | Browser, aplikasi mobile, prototipe | Bank, e-commerce, aplikasi besar |
| **Port** | Tidak ada (file langsung) | 5432 (PostgreSQL), 3306 (MySQL) |

**SQLite dipakai oleh**: Google Chrome (history), aplikasi Android,
dan banyak aplikasi desktop. Bukan database "mainan" — hanya untuk
skala yang tepat.

```text
ANALOGI:
SQLite  = lemari arsip kecil di rumah Anda (1 file, langsung pakai)
Postgres= gudang arsip besar dengan petugas (server, banyak pengguna)
```

---

## 🧠 14.3 SQL DASAR (PRAKTIK LANGSUNG)

Buka terminal di folder proyek, lalu praktikkan. Bisa pakai perintah
`sqlite3` atau minta AI bantu.

### CREATE TABLE (membuat tabel)

```sql
CREATE TABLE siswa (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  nama    TEXT NOT NULL,
  kelas   TEXT,
  nilai   INTEGER DEFAULT 0
);
```

### INSERT (menambah data)

```sql
INSERT INTO siswa (nama, kelas, nilai) VALUES ('Budi', '5A', 85);
INSERT INTO siswa (nama, kelas, nilai) VALUES ('Siti', '5A', 90);
INSERT INTO siswa (nama, kelas, nilai) VALUES ('Andi', '5B', 75);
```

### SELECT (membaca data) — paling sering dipakai

```sql
-- semua siswa
SELECT * FROM siswa;

-- hanya nama & nilai
SELECT nama, nilai FROM siswa;

-- dengan filter
SELECT * FROM siswa WHERE nilai >= 80;

-- urutkan
SELECT * FROM siswa ORDER BY nilai DESC;

-- hitung
SELECT COUNT(*) FROM siswa;
SELECT AVG(nilai) FROM siswa;
```

### UPDATE (mengubah data)

```sql
UPDATE siswa SET nilai = 95 WHERE id = 3;
-- ⚠️ SELALU pakai WHERE! tanpa WHERE = semua baris berubah!
```

### DELETE (menghapus data)

```sql
DELETE FROM siswa WHERE id = 2;
-- ⚠️ sama: SELALU pakai WHERE!
```

---

## 🧠 14.4 KONEKSI SQLITE DARI APLIKASI

### Opsi 1: Prisma di Next.js (sudah dipakai Modul 6)

```text
// .env
DATABASE_URL="file:./dev.db"
```

```prisma
// prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Buku {
  id       Int    @id @default(autoincrement())
  judul    String
  penulis  String
  stok     Int    @default(1)
}
```

```bash
npx prisma migrate dev   # buat tabel dari model
```

```ts
// lib/db.ts
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
```

```ts
// pakai di route handler
const buku = await prisma.buku.findMany();
```

### Opsi 2: Laravel (otomatis pakai SQLite dengan setting kecil)

```text
// .env (Laravel)
DB_CONNECTION=sqlite
# hapus/komentari baris DB_HOST, DB_PORT, DB_DATABASE dll.
# buat file database/database.sqlite (file kosong)
```

```bash
php artisan migrate   # buat tabel
```

```php
// pakai di controller
$buku = Buku::all(); // Eloquent otomatis bicara ke SQLite
```

---

## 🧠 14.5 KAPAN CUKUP SQLITE?

Gunakan "tes 3 pertanyaan" dari Modul 7 (diingatkan):

```text
1. Dipakai banyak orang SEKALIGUS?  → YA → PostgreSQL
2. Perlu data sangat aman/cepat?     → YA → PostgreSQL
3. Akan tumbuh besar dalam 1 tahun?  → YA → PostgreSQL

SEMUA TIDAK → SQLite cukup ✅
(proyek belajar, prototipe, aplikasi pribadi, data kecil)
```

> 🎯 **Rekomendasi:** Untuk proyek belajar, MULAI dengan SQLite.
> Migrasi ke PostgreSQL nanti itu mudah (terutama dengan Prisma —
> cukup ganti provider).

---

## 🤖 14.6 TEMPLATE PROMPT SQLITE

### Prompt 1: Buat Database + Contoh Data

```text
Saya mau belajar SQLite untuk aplikasi [aplikasi, mis. perpustakaan].

1. Buatkan file database SQLite dengan tabel:
   - [tabel 1]: [field-field]
   - [tabel 2]: [field-field]
2. Isi dengan 10 data contoh (data Indonesia yang realistis)
3. Tunjukkan contoh query untuk setiap operasi CRUD
4. Jelaskan setiap query dengan bahasa sederhana

Saya pemula SQL. Gunakan komentar di setiap query.
```

### Prompt 2: Pindahkan Aplikasi dari Memori ke SQLite

```text
Aplikasi [nama] saya masih menyimpan data di array memori
([path file]). Pindahkan ke database SQLite dengan Prisma:

1. Buat model sesuai data yang dipakai: [deskripsi data]
2. Ubah route handler agar baca/tulis ke database
3. Jalankan migrasi
4. Pastikan data TIDAK hilang saat server restart

Jelaskan setiap langkah, saya pemula.
```

### Prompt 3: Ajarkan SQL

```text
Saya baru belajar SQL. Jelaskan dengan analogi sederhana:

1. SELECT, INSERT, UPDATE, DELETE (dengan contoh)
2. WHERE, ORDER BY, LIMIT
3. COUNT, AVG, SUM
4. Kenapa UPDATE/DELETE harus pakai WHERE?

Beri 5 latihan kecil + jawabannya.
```

---

## 🏗️ 14.7 PRAKTIK

### Latihan 1: Database Perpustakaan (30 menit)

```text
Buat database SQLite "perpustakaan" dengan:
1. Tabel buku (id, judul, penulis, kategori, stok)
2. Tabel anggota (id, nama, kelas)
3. Tabel peminjaman (id, buku_id, anggota_id, tanggal_pinjam, tanggal_kembali)
4. Isi data contoh 5 buku + 3 anggota

Jalankan query: semua buku, buku stok habis, 3 buku terbaru.
```

### Latihan 2: Hubungkan ke Aplikasi (45 menit)

```text
Di proyek Next.js Anda (dari Modul 12):
1. Pindahkan to-do list dari array memori ke SQLite (Prisma)
2. Tambahkan kolom "dibuat_pada" (tanggal)
3. Data harus TIDAK hilang saat server restart

Tes: tambah tugas → restart server → tugas masih ada!
```

### Latihan 3: Latihan SQL (30 menit)

```text
Gunakan Prompt 3 (14.6) untuk belajar SQL.
Kerjakan 5 latihannya, lalu minta AI koreksi jawaban Anda.
```

---

## 🧠 14.8 RANGKUMAN & KETIKA BINGUNG

### Yang Sudah Anda Pelajari

| Konsep | Intinya |
|--------|---------|
| **Database** | Tempat menyimpan data terstruktur |
| **SQL** | Bahasa universal database |
| **SQLite** | Database 1 file, ramah pemula |
| **CRUD SQL** | INSERT / SELECT / UPDATE / DELETE |
| **WHERE** | Filter (WAJIB di UPDATE/DELETE!) |
| **Prisma/Eloquent** | ORM: SQL tanpa menulis SQL |

### Checklist

```
☐ Paham SQL dasar (CREATE, INSERT, SELECT, UPDATE, DELETE)
☐ Database SQLite perpustakaan dibuat & terisi data
☐ Aplikasi Next.js terhubung ke SQLite (Prisma)
☐ Data tidak hilang saat restart
☐ Bisa jawab kapan cukup SQLite vs harus PostgreSQL
```

### Ketika Bingung

```text
❓ "no such table"
   → migrasi belum dijalankan: npx prisma migrate dev
   → atau database file belum dibuat

❓ UPDATE mengubah semua baris
   → lupa WHERE! (Ini kesalahan paling umum & berbahaya)

❓ Data hilang saat restart
   → masih pakai array memori, belum pindah ke database

❓ Stuck? Tempel error ke AI + konteks proyek Anda
```

---

## 🎯 KAPAN LANJUT?

Anda siap lanjut ke **PostgreSQL** jika sudah bisa:

```
☐ CRUD SQL lancar (SELECT, INSERT, UPDATE, DELETE + WHERE)
☐ Aplikasi terhubung ke SQLite
☐ Paham konsep tabel, kolom, baris, primary key
```

> **Ingat:** SQLite = lemari arsip kecil. Sekarang kita belajar
> "gudang arsip besar": **Modul 15: PostgreSQL**!

---

---

## 📚 SUMBER & REFERENSI RESMI (modul 14)

| Topik | Dokumentasi resmi |
|-------|-------------------|
| SQLite: kapan menggunakannya | https://www.sqlite.org/whentouse.html |
| Tentang SQLite | https://www.sqlite.org/about.html |
| SQLite CLI | https://www.sqlite.org/cli.html |
| Prisma (SQLite) | https://www.prisma.io/docs/orm/prisma-schema/databases |
| Prisma migrate dev | https://www.prisma.io/docs/orm/prisma-migrate/workflows/development |

> 💡 **Catatan akurasi (verifikasi dari sqlite.org & prisma.io):**
> - SQLite = **self-contained, serverless, zero-config, 1 file** database.
> - Dipakai luas: Chrome (history), Android/iOS, aplikasi desktop.
> - Prisma: ganti `provider = "sqlite"` → `provider = "postgresql"` cukup
>   untuk migrasi ke PostgreSQL (Modul 15).
> - `AUTOINCREMENT` valid di SQLite untuk kolom `INTEGER PRIMARY KEY`.

**📂 Lanjut ke: `15-postgresql.md`**
