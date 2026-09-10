# 🟩 Modul 11: NodeJS — JavaScript di Server

> **NodeJS membuat JavaScript bisa jalan DI LUAR browser — di server.**
> Waktu: ~3-4 jam | Level: 🟡 Intermediate | Lanjutan dari: Modul 10 (React)

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Apa itu NodeJS & kenapa JavaScript bisa jalan di server
✅ npm: "toko aplikasi" untuk JavaScript
✅ Modul: cara membagi kode
✅ Express: framework web paling populer
✅ Membuat REST API sederhana (GET, POST)
```

---

## 🧠 11.1 APA ITU NODEJS?

```text
SEBELUMNYA:
JavaScript HANYA bisa jalan di browser (Chrome, Firefox, dll)
→ Mau bikin server? Pilih bahasa lain (PHP, Java, dll)

SEJAK 2009 (Ryan Dahl membuat NodeJS):
JavaScript bisa jalan DI SERVER
→ Satu bahasa untuk frontend & backend!
```

**NodeJS** = runtime JavaScript di server. Bukan framework, bukan bahasa baru — tapi **"mesin" yang menjalankan JavaScript di luar browser**.

### Kenapa Ini Penting untuk Anda?

```text
DENGAN REACT (Modul 10):  JavaScript di browser (frontend)
DENGAN NODEJS:            JavaScript di server (backend)

KEDUANYA PAKAI BAHASA YANG SAMA: JavaScript!
→ Anda tidak perlu belajar bahasa baru untuk backend
```

### Analogi

```text
BROWSER  = ruang makan (menjalankan JS untuk tampilan)
NODEJS   = dapur restoran (menjalankan JS untuk memasak/memproses)

NodeJS memberi JavaScript "tangan dan kaki" untuk:
- Membaca & menulis file
- Mengakses database
- Menerima permintaan dari browser (HTTP)
- Mengirim respons balik
```

---

## 🧠 11.2 VERIFIKASI & NPM

### Cek NodeJS Terpasang

```bash
node --version     # harus muncul angka, misal v20.x.x
npm --version      # harus muncul angka
```

Kalau belum ada → minta AI pandu install (Node.js LTS dari nodejs.org).

### npm = "Toko Aplikasi" JavaScript

```text
npm (Node Package Manager) = toko ribuan paket siap pakai

CONTOH PAKET POPULER:
- express     → framework web
- prisma      → alat bantu database
- jsonwebtoken→ autentikasi token
- nodemon     → auto-restart saat kode berubah

PERINTAH PENTING:
npm init -y            → buat package.json (daftar bahan)
npm install express    → pasang paket express
npm install -D nodemon → pasang paket DEV (hanya saat develop)
npm run dev            → jalankan (lihat "scripts" di package.json)
```

### package.json = "Daftar Bahan" Proyek

```json
{
  "name": "aplikasi-saya",
  "scripts": {
    "dev": "node src/index.js"
  },
  "dependencies": {
    "express": "^4.19.0"
  }
}
```

---

## 🧠 11.3 MODUL: MEMBAGI KODE

```text
MODUL = file JavaScript yang bisa di-import ke file lain

Kenapa penting? (Ingat prinsip Modul 4: satu tugas satu file)
- Kode rapi & terorganisir
- Fungsi bisa dipakai ulang
- Mudah di-test & di-debug
```

### Cara Membuat & Menggunakan Modul

```js
// file: src/helpers.js  (pembuat)
export function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

export const KATEGORI = ["Makanan", "Transport", "Tagihan"];
```

```js
// file: src/index.js  (pemakai)
import { formatRupiah, KATEGORI } from "./helpers.js";

console.log(formatRupiah(150000));  // Rp 150.000
console.log(KATEGORI[0]);           // Makanan
```

---

## 🧠 11.4 EXPRESS: FRAMEWORK WEB NODEJS

**Express** = framework paling populer untuk membuat server web di NodeJS. Ini "template restoran" — Anda tinggal isi menu-nya.

### Server Pertama Anda

```js
// file: src/index.js
import express from "express";

const app = express();
const PORT = 3000;

// route GET / → balikan teks
app.get("/", (req, res) => {
  res.send("Halo dari server NodeJS!");
});

// route GET /api/siswa → balikan data JSON
app.get("/api/siswa", (req, res) => {
  res.json({ siswa: ["Budi", "Siti", "Andi"] });
});

// jalankan server
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
```

```bash
npm run dev
# buka http://localhost:3000 di browser
# coba juga http://localhost:3000/api/siswa
```

### Anatomi Route (Jalur di Server)

```js
app.get("/api/siswa", (req, res) => { ... });
│    │       │             │
│    │       │             └─ fungsi yang jalan saat route dipanggil
│    │       └─ alamat URL (endpoint)
│    └─ metode HTTP (get, post, put, delete)
└─ aplikasi express
```

> 💡 **Bandingkan dengan Next.js (Modul 6):** di Next.js, route handler
> dibuat lewat file di `app/api/`. Di Express murni, route dibuat lewat
> kode `app.get(...)`. Keduanya melakukan hal yang sama — memproses
> permintaan dan membalas respons.

---

## 🧠 11.5 REQUEST & RESPONSE (req & res)

Setiap route menerima 2 parameter:

```js
app.post("/api/siswa", (req, res) => {
  // req  = data yang DATANG dari user (permintaan)
  // res  = alat untuk MENGIRIM balasan
});
```

### Membaca Data dari User (POST)

```js
import express from "express";

const app = express();
app.use(express.json()); // ← WAJIB: agar bisa baca JSON dari body

// Simpan data di memori (sementara — nanti pindah ke database)
let siswa = [];

// CREATE: tambah siswa
app.post("/api/siswa", (req, res) => {
  const { nama } = req.body; // ambil "nama" dari data yang dikirim

  if (!nama) {
    return res.status(400).json({ pesan: "Nama wajib diisi" });
  }

  const baru = { id: siswa.length + 1, nama };
  siswa.push(baru);
  res.status(201).json({ sukses: true, data: baru });
});

// READ: ambil semua siswa
app.get("/api/siswa", (req, res) => {
  res.json({ sukses: true, data: siswa });
});
```

### Status Code (Kode Respons)

| Kode | Arti | Kapan |
|------|------|-------|
| 200 | OK | Berhasil |
| 201 | Created | Berhasil membuat data baru |
| 400 | Bad Request | Input user salah/kurang |
| 404 | Not Found | Alamat tidak ada |
| 500 | Server Error | Error di server |

---

## 🧠 11.6 MIDDLEWARE & ERROR HANDLING

**Middleware** = "penjaga" yang jalan di antara permintaan datang dan route diproses.

```js
// Middleware 1: log setiap permintaan
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // lanjutkan ke route berikutnya
});

// Middleware 2: baca JSON (sudah dipakai di atas)
app.use(express.json());

// Middleware error (harus 4 parameter!)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ pesan: "Terjadi error di server" });
});
```

---

## 🧠 11.7 ENVIRONMENT VARIABLES (Rahasia Proyek)

Jangan pernah simpan rahasia (password, API key) langsung di kode!

```text
.env  = file rahasia (JANGAN di-commit ke Git!)

PORT=3000
DB_URL=sqlite://./database.db
JWT_RAHASIA=abcdef12345
```

```js
// baca dari .env
import "dotenv/config";

const PORT = process.env.PORT || 3000; // default 3000
console.log(process.env.DB_URL);
```

> ⚠️ **Ingat:** file `.env` masuk ke `.gitignore` (jangan di-upload ke
> GitHub!) — isinya rahasia.

---

## 🤖 11.8 TEMPLATE PROMPT NODEJS

### Prompt 1: Buat Server + API CRUD Sederhana

```text
Buat server Express di src/index.js untuk entitas [entitas].

FITUR:
1. GET    /api/[entitas]      → ambil semua
2. POST   /api/[entitas]      → tambah (validasi field wajib!)
3. GET    /api/[entitas]/:id  → ambil 1 berdasarkan id
4. PUT    /api/[entitas]/:id  → ubah
5. DELETE /api/[entitas]/:id  → hapus

ATURAN:
- Data sementara di array memori (kita hubungkan database nanti)
- Balikan JSON: { sukses: true, data: ... } / { sukses: false, pesan: "..." }
- Pakai status code yang benar (200, 201, 400, 404, 500)
- Tambahkan middleware error handling
- Gunakan ES Modules (import/export)

SETELAH selesai, beri saya 5 contoh uji dengan curl.
```

### Prompt 2: Ajarkan Saya Kode yang Sudah Ada

```text
Baca semua file di folder proyek ini (terutama src/).

Jelaskan dengan bahasa sederhana:
1. Apa fungsi file satu per satu?
2. Route apa saja yang tersedia? (metode + alamat + fungsi)
3. Middleware apa yang dipakai & kenapa?
4. Diagram alur: permintaan datang → ... → respons kembali
5. Bagian mana yang paling perlu saya pelajari lebih dalam?
```

### Prompt 3: Debug NodeJS

```text
Saya menjalankan [perintah] dan mendapat error:

[tempel error lengkap]

File terkait: [path]
Sudah dicoba: [langkah]

Jelaskan arti error ini dengan bahasa sederhana,
lalu berikan solusi langkah demi langkah.
```

---

## 🏗️ 11.9 PRAKTIK

### Latihan 1: Server Hello + Route (20 menit)

```text
Buat server Express:
1. GET / → "Halo dari server!"
2. GET /waktu → balikan waktu sekarang (JSON)
3. GET /api/profil → { nama, role, hobi }
```

### Latihan 2: API CRUD Buku (60 menit)

```text
Buat API CRUD untuk "buku" (judul, penulis, tahun):
1. GET /api/buku → semua buku
2. POST /api/buku → tambah (judul wajib)
3. GET /api/buku/:id → 1 buku
4. PUT /api/buku/:id → ubah
5. DELETE /api/buku/:id → hapus

Uji semua dengan curl. Pastikan:
- Data tersimpan (tidak hilang selama server jalan)
- Validasi bekerja (judul kosong → error 400)
```

### Latihan 3: Hubungkan ke Frontend React (60 menit)

```text
Hubungkan to-do list React (Modul 10) ke server NodeJS:

1. Server: buat API CRUD tugas di Express
2. React: ganti data statis dengan fetch ke API
   - Ambil daftar: GET /api/tugas
   - Tambah: POST /api/tugas
   - Hapus: DELETE /api/tugas/:id

Catatan CORS: server harus izinkan frontend berbeda origin.
Minta AI: "Tambahkan middleware CORS ke server Express."

Tes: buka React di browser, tambah tugas, refresh → masih ada
(karena sekarang data di server, bukan cuma browser!).
```

---

## 🧠 11.10 RANGKUMAN & KETIKA BINGUNG

### Yang Sudah Anda Pelajari

| Konsep | Intinya |
|--------|---------|
| **NodeJS** | JavaScript di server |
| **npm** | Toko paket + package.json |
| **Modul** | File JS yang bisa di-import |
| **Express** | Framework web paling populer |
| **Route** | app.get/post/put/delete + req/res |
| **Middleware** | Penjaga alur permintaan |
| **Status code** | 200, 201, 400, 404, 500 |
| **.env** | Tempat rahasia proyek |

### Checklist

```
☐ NodeJS & npm terverifikasi
☐ Server Express jalan (hello world)
☐ API CRUD buku jalan & teruji curl
☐ Middleware & error handling dipahami
☐ Frontend React terhubung ke API NodeJS
☐ Data tidak hilang saat refresh (server menyimpan)
```

### Ketika Bingung

```text
❓ "Cannot use import statement outside a module"
   → package.json harus punya "type": "module"
   → atau pakai require() gaya lama

❓ Data dari form kosong (undefined)
   → lupa app.use(express.json()) sebelum route POST

❓ Frontend tidak bisa akses API (CORS)
   → install cors: npm install cors
   → app.use(cors()) — minta AI bantu

❓ Server tidak restart saat kode berubah
   → pakai nodemon di "scripts": "dev"
```

---

## 🎯 KAPAN LANJUT?

Anda siap lanjut ke **NextJS** jika sudah bisa:

```
☐ Server Express dengan beberapa route
☐ API CRUD dengan validasi & status code
☐ Frontend React mengambil data dari API NodeJS
☐ Paham peran NodeJS (backend) vs React (frontend)
```

> **Ingat:** React = frontend, NodeJS = backend. Sekarang kita gabungkan
> keduanya dalam satu framework: **Modul 12: NextJS**!

---

## 📚 SUMBER & REFERENSI RESMI (modul 11)

| Topik | Dokumentasi resmi |
|-------|-------------------|
| Tentang Node.js | https://nodejs.org/en/about |
| ES Modules (import/export) | https://nodejs.org/api/esm.html |
| Express | https://expressjs.com/ |
| dotenv | https://www.npmjs.com/package/dotenv |
| npm CLI | https://docs.npmjs.com/ |
| Node.js: dev vs production | https://nodejs.org/learn/getting-started/nodejs-the-difference-between-development-and-production |

> 💡 **Catatan akurasi (verifikasi dari nodejs.org & expressjs.com):**
> - Node.js dibuat **Ryan Dahl pada 2009**, berbasis mesin V8 (JavaScript
>   engine Google Chrome), dengan arsitektur **event-driven & non-blocking I/O**.
> - **Express 5 vs 4:** Express 5 (rilis 2024) mendukung async route handler
>   tanpa boilerplate try/catch manual. Sintaks `app.get()`, `express.json()`,
>   status code di modul ini tetap berlaku di kedua versi — aman untuk belajar.
> - File `.env` + `dotenv` = cara standar menyimpan konfigurasi rahasia
>   (jangan pernah commit ke Git!).

---

**📂 Lanjut ke: `12-nextjs.md`**
