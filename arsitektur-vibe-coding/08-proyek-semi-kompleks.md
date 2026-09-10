# 🏗️ Modul 8: Proyek Semi-Kompleks (Aplikasi Lengkap)

> **Ini "ujian akhir" Anda: gabungkan semua konsep untuk membangun satu aplikasi utuh.**
> Waktu: ~2-3 jam (bisa dibagi 3 sesi) | Level: 🟡 Intermediate | Kaitan: `fase-1-arsitektur-dasar` file `18` (studi kasus)

---

## 📖 APA YANG AKAN KAMU BANGUN

**Aplikasi Manajemen Buku Perpustakaan Sekolah** 📚

Fitur yang sudah cukup "semi-kompleks" tapi tetap realistis:

```text
FITUR (MUST HAVE):
1. Tambah buku (judul, penulis, kategori, stok)
2. Lihat daftar semua buku (dengan pencarian)
3. Hapus & edit buku
4. Pinjam buku (stok berkurang) & kembalikan (stok bertambah)
5. Lihat total buku & buku yang sedang dipinjam

FITUR (SHOULD HAVE / NICE TO HAVE — TUNDA DULU):
☐ Login guru & siswa (tunda! pakai "nama peminjam" sederhana dulu)
☐ Laporan Excel (tunda)
☐ Foto sampul buku (tunda)
```

> 🎯 **Kalau Anda punya ide lain** (absensi, keuangan BOS, daftar
> inventaris) — silakan! Pola kerjanya tetap sama persis.

---

## 🧠 8.1 STRATEGI KERJA: "DENAH DULU, KODE BELAKANG"

Ini alur kerja vibe coding yang benar — **jangan pernah minta AI
langsung menulis semua kode:**

```text
LANGKAH 1:  Denah (Modul 1)          → 10 menit
LANGKAH 2:  Peta komponen (Modul 2)  → 10 menit
LANGKAH 3:  Setup proyek (Modul 3)   → 30 menit
LANGKAH 4:  Database & API (Modul 6) → 45 menit
LANGKAH 5:  Komponen & halaman (4-5) → 45 menit
LANGKAH 6:  Hubungkan & tes (5-6)    → 30 menit
LANGKAH 7:  Review & polish (7)      → 20 menit
─────────────────────────────────────────────
TOTAL: ~3 jam (bagi jadi 3 sesi kalau perlu)
```

**Aturan penting:**
```text
✅ Tiap langkah: minta AI JELASKAN rencana dulu → Anda setujui → baru kode
✅ Tiap langkah: TES dulu sebelum lanjut
❌ JANGAN: minta semua kode dalam 1 prompt raksasa
```

---

## 🧠 8.2 DENAH APLIKASI PERPUSTAKAAN

```text
FUNGSI:
1. CRUD buku (tambah, lihat, ubah, hapus)
2. Cari buku berdasarkan judul
3. Pinjam buku (input nama peminjam, stok -1)
4. Kembalikan buku (stok +1)
5. Dashboard ringkas: total buku, total stok, buku dipinjam

DATA (entitas):
- Buku → id, judul, penulis, kategori, stok
- Peminjaman → id, buku_id, nama_peminjam, tanggal_pinjam,
               tanggal_kembali (null = masih dipinjam)

ALUR:
INPUT:  isi form tambah buku → klik "Simpan"
PROSES: API POST /api/buku → simpan ke database
OUTPUT: daftar buku ter-update di halaman
```

**Ini yang akan Anda minta AI buatkan — langkah demi langkah.**

---

## 🤖 8.3 PROMPT PER LANGKAH (copy-paste ke CLI)

### Langkah 1: Setup Proyek + Database

```text
Kita mulai proyek "Manajemen Buku Perpustakaan Sekolah".

1. Pastikan proyek Next.js (App Router, TypeScript, Tailwind) ada
   — kalau belum, buatkan dengan create-next-app
2. Setup SQLite + Prisma:
   - Install prisma & @prisma/client, jalankan npx prisma init
   - Di schema.prisma atur datasource:
     provider = "sqlite" dan url = "file:./dev.db"
   - Lalu buat model berikut:

model Buku {
  id       Int      @id @default(autoincrement())
  judul    String
  penulis  String
  kategori String
  stok     Int      @default(1)
  createdAt DateTime @default(now())
  peminjaman Peminjaman[]
}

model Peminjaman {
  id              Int      @id @default(autoincrement())
  bukuId          Int
  buku            Buku     @relation(fields: [bukuId], references: [id])
  namaPeminjam    String
  tanggalPinjam   DateTime @default(now())
  tanggalKembali  DateTime?
}

3. Buat lib/db.ts untuk koneksi
4. Jelaskan setiap langkah singkat, saya pemula.
   JANGAN lanjut ke langkah berikutnya sebelum saya setujui.
```

### Langkah 2: API CRUD Buku

```text
Buat API CRUD untuk Buku di app/api/buku/route.ts:

- GET    /api/buku          → ambil semua buku (bisa ?cari=judul)
- POST   /api/buku          → tambah buku (validasi: judul & penulis wajib)
- PATCH  /api/buku/[id]     → ubah buku
- DELETE /api/buku/[id]     → hapus buku

Format balikan konsisten:
{ sukses: true, data: ... } / { sukses: false, pesan: "..." }

Setelah selesai, tunjukkan cara menguji dengan 3 curl singkat.
```

### Langkah 3: API Pinjam & Kembalikan

```text
Buat API peminjaman (kata benda jamak, sesuai konvensi REST
Modul 17) dengan dua file:
- app/api/peminjaman/route.ts         → POST (pinjam)
- app/api/peminjaman/[id]/route.ts    → PATCH (kembalikan)
  (folder [id] = rute dinamis: berisi id record peminjaman)

1. POST /api/peminjaman → body: { bukuId, namaPeminjam }
   - Cek: stok harus > 0, kalau 0 balikan error "Stok habis"
   - Kalau OK: stok -1, buat record peminjaman

2. PATCH /api/peminjaman/[id] → body: {} (atau { tanggalKembali })
   - Set tanggalKembali = sekarang, stok +1

Jelaskan logikanya singkat setelah selesai.
```

### Langkah 4: Halaman Utama (Dashboard)

```text
Buat halaman utama app/page.tsx untuk dashboard perpustakaan:

1. 3 kartu ringkas: Total Judul Buku, Total Stok, Buku Sedang Dipinjam
   (diambil dari API via Server Component — tidak perlu "use client")
2. Form tambah buku (judul, penulis, kategori, stok) → "use client"
3. Daftar buku dalam tabel: Judul | Penulis | Kategori | Stok | Aksi
4. Aksi per buku: Pinjam, Kembalikan (kalau dipinjam), Edit, Hapus
5. Kolom pencarian (filter di client, sederhana)

PECAH menjadi komponen di components/features/:
- DashboardCards.tsx, FormTambahBuku.tsx, TabelBuku.tsx,
  FormPinjamBuku.tsx

Gunakan komponen ui/ yang sudah ada (Tombol, Kartu, Input).
Rapi & modern dengan Tailwind. Satu komponen satu tugas.
Jangan tulis semua sekaligus — kerjakan per komponen,
jelaskan dulu, saya setujui.
```

### Langkah 5: Tes End-to-End

```text
Bantu saya menguji aplikasi perpustakaan dari awal sampai akhir:

1. Tambah 5 buku contoh (judul berbeda)
2. Cari buku dengan kata kunci → hasilnya benar?
3. Pinjam buku dengan stok 1 → stok jadi 0
4. Pinjam lagi buku yang stok-nya 0 → muncul error "Stok habis"
5. Kembalikan buku → stok balik 1
6. Edit & hapus buku → berfungsi?

Kalau ada yang error, perbaiki dan jelaskan apa masalahnya.
Buatkan juga 5 data contoh buku Indonesia yang otomatis
ter-seed ke database.
```

### Langkah 6: Review Akhir

```text
Review seluruh aplikasi perpustakaan:

1. Arsitektur: apa yang rapi, apa yang bisa diperbaiki?
2. Bug potensial: cek validasi, state, dan error handling
3. UX: apa yang bikin bingung pengguna?
4. Prioritaskan: MUST FIX → SHOULD FIX → NICE TO HAVE

Jangan langsung perbaiki — lapor dulu, saya pilih mana yang
harus diperbaiki sekarang.
```

---

## 🏗️ 8.4 PRAKTIK: KERJAKAN PROYEK ANDA

### Sesi 1 (60 menit): Fondasi
```text
1. Jalankan Langkah 1 (setup + database)
2. Jalankan Langkah 2 (API CRUD buku)
3. Tes API dengan curl — pastikan jalan
```

### Sesi 2 (60 menit): Fitur Inti
```text
1. Jalankan Langkah 3 (API pinjam/kembali)
2. Tes pinjam & kembalikan (termasuk kasus stok habis)
```

### Sesi 3 (60 menit): Tampilan & Integrasi
```text
1. Jalankan Langkah 4 (dashboard + komponen)
2. Jalankan Langkah 5 (tes end-to-end)
3. Jalankan Langkah 6 (review akhir)
```

---

## 🧠 8.5 CHECKLIST PROYEK AKHIR

```
☐ Proyek Next.js jalan di browser
☐ Database SQLite + Prisma ter-setup (2 model: Buku, Peminjaman)
☐ API CRUD buku berfungsi (GET, POST, PATCH, DELETE)
☐ API pinjam & kembali berfungsi (termasuk cek stok habis)
☐ Dashboard menampilkan 3 kartu ringkas
☐ Form tambah buku bekerja
☐ Tabel buku + aksi (pinjam, kembali, edit, hapus) bekerja
☐ Pencarian buku berfungsi
☐ Data TIDAK hilang saat halaman di-refresh (tersimpan di database)
☐ Review akhir sudah dilakukan & perbaikan MUST FIX selesai
```

### 🎉 Setelah Proyek Selesai

```text
SELAMAT! Anda baru saja membangun aplikasi semi-kompleks pertama
dengan arsitektur yang benar!

YANG ANDA LAKUKAN:
- Denah sebelum kode (arsitektur)
- 4 komponen inti (frontend, backend, database, API)
- Struktur folder rapi
- Komponen, state, alur data
- CRUD lengkap dengan validasi

LANGKAH BERIKUTNYA:
1. Tunda fitur (login, laporan) — jangan serakah!
2. Buka modul 09 (ringkasan) untuk menguatkan pemahaman
3. Kembali ke fase-1-arsitektur-dasar untuk pendalaman
   (sekarang konsepnya akan terasa masuk akal!)
```

---

**📂 Setelah proyek selesai → Buka `09-ringkasan-dan-glosarium.md`**
