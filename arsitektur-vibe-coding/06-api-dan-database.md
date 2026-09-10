# 🗄️ Modul 6: API & Database (CRUD)

> **Di sinilah aplikasi Anda "naik kelas": dari simpan di browser → simpan di server.**
> Waktu: ~50 menit | Level: 🟡 Intermediate | Kaitan: `fase-1-arsitektur-dasar` file `12`-`13` (database)

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Apa itu API (jembatan frontend ↔ backend)
✅ Route handler di Next.js (app/api/)
✅ Apa itu database & cara membaca "tabel"
✅ CRUD: Create, Read, Update, Delete
✅ Konsep "satu sumber kebenaran" (anti data dobel)
```

---

## 🧠 6.1 API = PELAYAN RESTORAN

Di Modul 2, API itu pelayan yang membawa pesanan antara ruang makan
(frontend) dan dapur (backend). Sekarang kita lihat detailnya:

```text
FRONTEND (ruang makan)                 BACKEND (dapur)
┌───────────────────┐    permintaan   ┌────────────────────┐
│  Halaman butuh    │ ──────────────▶ │  /api/items        │
│  daftar item      │                 │  (route handler)   │
│                   │    balikan      │                    │
│  tampilkan item   │ ◀────────────── │  kirim data JSON   │
└───────────────────┘                 └────────┬───────────┘
                                               │
                                               ▼
                                        ┌──────────────┐
                                        │  DATABASE    │
                                        │  (gudang)    │
                                        └──────────────┘
```

### Kenapa API Itu Penting?

```text
❌ TANPA API (semua di frontend):
   - Data cuma di browser 1 user
   - User lain tidak bisa lihat data yang sama
   - Kode logika penting (hitung harga, validasi) ada di browser
     → bisa dirusak user!

✅ DENGAN API (backend memegang data):
   - Data disimpan di database server (satu sumber kebenaran)
   - Semua user melihat data yang SAMA
   - Logika penting aman di server
```

---

## 🧠 6.2 ROUTE HANDLER = API DI NEXT.JS

Di Next.js App Router, file di `app/api/` otomatis menjadi backend:

```text
app/
└── api/
    └── items/
        └── route.ts   ← otomatis jadi alamat: /api/items
```

```ts
// app/api/items/route.ts
import { NextResponse } from "next/server";

// READ: dapatkan daftar item (metode GET)
export async function GET() {
  // (nanti: ambil dari database)
  return NextResponse.json({ items: ["Nasi Goreng", "Es Teh"] });
}

// CREATE: tambah item baru (metode POST)
export async function POST(request: Request) {
  const body = await request.json(); // baca data dari frontend
  const namaBaru = body.nama;
  // (nanti: simpan ke database)
  return NextResponse.json({ sukses: true, nama: namaBaru });
}
```

### 4 Metode HTTP = 4 Aksi CRUD

| Metode | Aksi | Arti |
|--------|------|------|
| **GET** | **R**ead | Ambil data (daftar item) |
| **POST** | **C**reate | Kirim data baru (tambah item) |
| **PUT / PATCH** | **U**pdate | Ubah data yang ada (edit item) |
| **DELETE** | **D**elete | Hapus data (hapus item) |

> 🎯 **Ingat: CRUD = 4 operasi dasar semua aplikasi data.**
> Aplikasi apa pun — belanja, absensi, perpustakaan — ujung-ujungnya CRUD.

---

## 🧠 6.3 DATABASE = GUDANG YANG RAPI

Di `fase-1-arsitektur-dasar` nanti Anda akan belajar SQL vs NoSQL.
Untuk sekarang, cukup pahami konsep **tabel**:

```text
DATABASE = buku besar yang terdiri dari TABEL-TABEL

TABEL: items
┌────┬─────────────┬────────┬──────────────────┐
│ id │ nama        │ harga  │ dibuat_pada      │
├────┼─────────────┼────────┼──────────────────┤
│ 1  │ Nasi Goreng │ 15000  │ 2026-08-02       │
│ 2  │ Es Teh      │ 5000   │ 2026-08-02       │
│ 3  │ Bakso       │ 12000  │ 2026-08-02       │
└────┴─────────────┴────────┴──────────────────┘
        ↑              ↑         ↑
        id unik      kolom data   waktu dibuat
        tiap baris
```

**Istilah yang perlu Anda tahu:**

| Istilah | Arti | Analogi |
|---------|------|---------|
| **Tabel** | Kumpulan data sejenis | Laci gudang berisi barang sejenis |
| **Baris (row)** | Satu data lengkap | Satu barang di laci |
| **Kolom (column)** | Satu jenis sifat | Label di kotak barang |
| **id (primary key)** | Penanda unik tiap baris | Nomor barcode barang |

### Pilihan Database untuk Pemula

```text
┌────────────────────┬──────────────────────────────────────┐
│  SQLite (mulai!)   │  PostgreSQL (nanti)                  │
│  ✅ Paling mudah   │  ✅ Untuk produksi / banyak user     │
│  ✅ 1 file saja    │  ✅ Fitur lengkap                    │
│  ❌ 1 user ~ kecil  │  ❌ Butuh install & setup            │
└────────────────────┴──────────────────────────────────────┘

ATURAN IBU JARI UNTUK BELAJAR:
- Proyek latihan & sekolah → SQLite (cukup)
- Aplikasi produksi / dipakai banyak orang → PostgreSQL
- Jangan pikirkan MongoDB/Cassandra dulu (bahas di fase-1 nanti)
```

> 💡 **Untuk proyek belajar, pakai SQLite + Prisma** (alat bantu
> database yang ramah pemula). AI bisa setup semuanya untuk Anda.

---

## 🧠 6.4 "SATU SUMBER KEBENARAN"

Ini konsep paling penting di modul ini — dan menghubungkan Anda ke
`fase-1-arsitektur-dasar` (konsistensi data):

```text
❌ DATA DOBEL (sumber kebenaran ganda):
   User A punya daftar item di browser-nya
   User B punya daftar item di browser-nya
   → Siapa yang benar? GAK ADA YANG TAHU!

✅ SATU SUMBER KEBENARAN:
   Semua data di DATABASE (1 tempat)
   User A & B hanya "melihat" & "meminta" ke server
   → Data selalu sama untuk semua orang
```

```text
┌────────┐  ┌────────┐
│User A  │  │User B  │
└───┬────┘  └───┬────┘
    │  lihat    │  lihat
    ▼           ▼
┌─────────────────────┐
│   API + DATABASE    │  ← SATU SUMBER KEBENARAN
│   (semua data di sini)│
└─────────────────────┘
```

> 🎯 **Ini yang membedakan aplikasi "mainan" dan aplikasi "nyata":**
> data disimpan di satu tempat yang aman, bukan di browser masing-masing.

---

## 🤖 6.5 TEMPLATE PROMPT: API + DATABASE + CRUD

### Prompt 1: Setup Database SQLite + Prisma

```text
Setup database SQLite dengan Prisma di proyek Next.js saya.

LANGKAH:
1. Install prisma dan @prisma/client
2. Inisialisasi prisma (npx prisma init)
3. Di schema.prisma, atur datasource:
   - provider = "sqlite"
   - url = "file:./dev.db"
4. Buat model di schema.prisma untuk [deskripsi data saya]
5. Jalankan migrasi (npx prisma migrate dev)
6. Buat file lib/db.ts untuk koneksi database
7. Jelaskan setiap langkah singkat, saya pemula

DATA YANG DIBUTUHKAN:
[Tempel data dari denah Modul 1 — contoh: "Item belanja punya
nama (teks) dan harga (angka)"]

Jangan jalankan semua perintah sekaligus tanpa menjelaskan.
```

### Prompt 2: Buat API CRUD Lengkap

```text
Buat API CRUD untuk [entitas, mis. "items"].

STRUKTUR FILE:
- app/api/items/route.ts        → untuk GET (semua) & POST (tambah)
- app/api/items/[id]/route.ts   → untuk PATCH (ubah) & DELETE (hapus)
  (folder [id] = rute dinamis: [id] akan berisi nomor id item)

FITUR:
1. GET    /api/items        → ambil semua [entitas]
2. POST   /api/items        → tambah [entitas] baru (validasi input!)
3. PATCH  /api/items/[id]   → ubah [entitas] berdasarkan id
4. DELETE /api/items/[id]   → hapus [entitas] berdasarkan id

ATURAN:
- Semua baca/tulis lewat database (lib/db.ts), bukan array di memori
- Validasi input: field wajib tidak boleh kosong
- Balikan JSON dengan format konsisten:
  { sukses: true, data: ... } atau { sukses: false, pesan: "..." }
- Gunakan TypeScript

Setelah selesai, beri saya 4 contoh uji dengan curl atau browser
untuk membuktikan tiap operasi bekerja.
```

### Prompt 3: Hubungkan Frontend ke API

```text
Hubungkan aplikasi belanja saya (frontend) ke API /api/items.

YANG DILAKUKAN:
1. Saat halaman dibuka → ambil data dari GET /api/items
   (gunakan fetch di Server Component atau useEffect di Client)
2. Tombol "Tambah" → POST /api/items lalu refresh daftar
3. Tombol "Hapus" → DELETE /api/items/[id] lalu refresh daftar
4. Total harga dihitung dari data yang ada

POLA:
- Tampilkan pesan "Memuat..." saat data belum datang
- Tampilkan pesan error kalau API gagal
- Setelah operasi berhasil, beri feedback singkat ke user

Jelaskan rencanamu dulu, saya setujui, baru tulis kode.
```

---

## 🏗️ 6.6 PRAKTIK

### Latihan 1: Aplikasi Belanja + Database (60 menit)

```text
Naikkan level aplikasi belanja di Modul 5:

1. Setup SQLite + Prisma (Prompt 1) dengan data item belanja
2. Buat API CRUD lengkap (Prompt 2)
3. Hubungkan frontend ke API (Prompt 3)
4. Uji: tambah item → refresh halaman → item MASIH ADA
   (ini bukti data tersimpan di database, bukan cuma browser!)

Setiap selesai 1 langkah, tes dulu sebelum lanjut.
```

### Latihan 2: Uji Pemahaman (10 menit)

```text
1. Apa fungsi API dalam aplikasi?
2. Sebutkan 4 metode HTTP dan aksi CRUD-nya.
3. Apa itu "satu sumber kebenaran" dan kenapa penting?
4. Kenapa data tidak boleh cuma disimpan di browser
   kalau aplikasi dipakai banyak orang?
```

<details>
<summary>🔍 Petunjuk jawaban</summary>

1. Jembatan antara frontend dan backend — frontend minta data,
   backend balikan data dari database.
2. GET=Read, POST=Create, PATCH/PUT=Update, DELETE=Delete.
3. Semua data disimpan di SATU tempat (database server) sehingga
   semua pengguna melihat data yang sama dan tidak ada konflik.
4. Karena browser tiap user terpisah — data di browser A tidak
   otomatis terlihat di browser B. Database memusatkannya.

</details>

---

## ✅ CHECKLIST MODUL 6

```
☐ Paham API = jembatan frontend ↔ backend
☐ Paham route handler di app/api/ (GET, POST, PATCH, DELETE)
☐ Paham konsep tabel, baris, kolom, id
☐ SQLite + Prisma sudah ter-setup di proyek
☐ API CRUD untuk item belanja sudah jalan & teruji
☐ Frontend terhubung ke API (data tidak hilang saat refresh)
☐ Paham "satu sumber kebenaran"
```

**🎯 Target:** Aplikasi Anda menyimpan data di database sungguhan
dan semua CRUD berfungsi.

Jika sudah paham → **Buka `07-trade-off-pemula.md`**
