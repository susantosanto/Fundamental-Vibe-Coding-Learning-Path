# 🔌 Modul 17: API — Jembatan Aplikasi (REST, JSON, Autentikasi)

> **API = bahasa yang dipakai aplikasi untuk "ngobrol" satu sama lain. Ini yang menghubungkan frontend & backend Anda.**
> Waktu: ~3-4 jam | Level: 🟡 Intermediate | Lanjutan dari: Modul 11 (NodeJS), 12 (NextJS), 16 (Networking)

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Apa itu API & kenapa "REST"
✅ Resource & HTTP methods (GET, POST, PUT, PATCH, DELETE)
✅ Konvensi penamaan endpoint (/api/items/:id)
✅ Status code yang benar untuk tiap operasi
✅ API versioning (/v1/)
✅ Autentikasi: API Key, Basic Auth, JWT
✅ CORS: kenapa frontend butuh izin
```

> 🎯 **Anda sudah pernah buat API** di Modul 11 (Express) dan
> Modul 12 (Next.js route handler). Modul ini = "teori lengkap"
> di balik yang sudah Anda praktikkan — biar API Anda jadi
> profesional, bukan asal jalan.

---

## 🧠 17.1 APA ITU API & KENAPA "REST"?

### Definisi (sumber: MDN)

```text
API (Application Programming Interface)
= aturan yang mengizinkan dua aplikasi saling bertukar data.

REST (Representational State Transfer)
= salah satu GAYA (style) mendesain API yang paling populer.
```

### Analogi: Restoran

```text
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  PELANGGAN (frontend)          DAPUR (backend)          │
│  ┌──────────────┐              ┌──────────────────┐     │
│  │ "Saya mau    │  ──menu──▶  │ PELAYAN (API)    │     │
│  │  2 nasi      │              │ - terima pesanan │     │
│  │  goreng"     │              │ - antar ke dapur │     │
│  └──────────────┘              │ - bawa hasilnya  │     │
│        ▲                       └──────────────────┘     │
│        │   ──makanan──            │                     │
│        │                          ▼                     │
│        │                    ┌──────────────┐            │
│        └────────────────────│   DAPUR      │            │
│                             │  (backend +  │            │
│                             │  database)   │            │
│                             └──────────────┘            │
│                                                         │
│  REST = aturan "cara memesan" yang disepakati:          │
│  menu (endpoint), cara pesan (method), bentuknya (JSON) │
└─────────────────────────────────────────────────────────┘
```

### Prinsip REST yang Perlu Anda Tahu (sumber: MDN, REST API Tutorial)

| Prinsip | Arti sederhana |
|---------|----------------|
| **Resource** | Segala "benda" yang bisa diakses: items, users, orders |
| **HTTP methods** | Kata kerja: ambil, buat, ubah, hapus |
| **Stateless** | Setiap permintaan mandiri — server tidak "mengingat" sesi |
| **JSON** | Format data paling umum yang dipertukarkan |

---

## 🧠 17.2 RESOURCE & HTTP METHODS

### Resource = Kata Benda, Bukan Kata Kerja

```text
❌ /getItems       (kata kerja — jangan!)
✅ /api/items      (kata benda — benar)

❌ /createUser
✅ /api/users
```

### 5 HTTP Methods Inti

| Method | Fungsi | CRUD | Sifat |
|--------|--------|------|-------|
| **GET** | Ambil data | Read | Aman (tidak mengubah data) |
| **POST** | Buat data baru | Create | Mengubah data |
| **PUT** | Ganti SELURUH data | Update | Idempotent (dipakai 2x = sama) |
| **PATCH** | Ubah SEBAGIAN data | Update | Sebagian |
| **DELETE** | Hapus data | Delete | Idempotent |

> 🎯 **Ingat dari Modul 6:** CRUD = Create, Read, Update, Delete.
> Sekarang Anda tahu method HTTP mana untuk tiap operasi.

### Konvensi Penamaan Endpoint (plural nouns)

```text
GET    /api/items          → daftar semua item
POST   /api/items          → buat item baru
GET    /api/items/3        → ambil item id 3
PUT    /api/items/3        → ganti item id 3
PATCH  /api/items/3        → ubah sebagian item id 3
DELETE /api/items/3        → hapus item id 3
```

> 💡 **Bentuk jamak (plural)** dipakai untuk konsistensi:
> `/api/items` untuk kumpulan, `/api/items/:id` untuk satu item.

---

## 🧠 17.3 STATUS CODE YANG BENAR (Review Modul 16)

Ini "tata krama" API profesional (sumber: MDN, OWASP):

| Operasi | Sukses | Input salah | Tidak ketemu | Error server |
|---------|--------|-------------|--------------|--------------|
| **GET** | 200 | 400 | 404 | 500 |
| **POST** | **201** (Created) | 400 | — | 500 |
| **PUT/PATCH** | 200 | 400 | 404 | 500 |
| **DELETE** | 200 (atau 204 No Content) | 400 | 404 | 500 |

**Tambahan penting:**

```text
401 Unauthorized = belum login / token salah
403 Forbidden    = sudah login tapi tidak punya izin
429 Too Many     = kebanyakan minta (rate limit)
```

### Format Respons yang Konsisten

```json
// SUKSES
{ "sukses": true, "data": { "id": 1, "nama": "Budi" } }

// GAGAL
{ "sukses": false, "pesan": "Nama wajib diisi" }
```

> 💡 **Ini pola yang sudah Anda pakai di semua modul** — sekarang
> Anda tahu kenapa: konsistensi memudahkan frontend membaca respons.

---

## 🧠 17.4 API VERSIONING: KENAPA /v1/?

### Masalahnya

```text
API v1 punya endpoint /api/items yang dipakai 100 aplikasi.
Anda mau ubah cara kerjanya → kalau langsung diubah,
100 aplikasi itu rusak!

Solusi: beri VERSI pada API.
```

### Cara Versioning (sumber: OWASP)

```text
CARA 1 — URL Path (paling populer):
  https://sekolahku.com/api/v1/items
  https://sekolahku.com/api/v2/items

CARA 2 — Header:
  Accept: application/vnd.sekolahku.v1+json
```

> 🎯 **Untuk belajar:** cukup pakai `/api/v1/...` di URL.
> Simpel, mudah dibaca, mudah diuji.

---

## 🧠 17.5 AUTENTIKASI: SIAPA ANDA?

Saat API menyimpan data penting (profil, pesanan), Anda tidak
bisa membiarkan SEMUA orang mengaksesnya. Butuh autentikasi.

### 3 Cara yang Paling Umum

```text
┌──────────────────────────────────────────────────────────┐
│                                                          │
│ 1. API KEY — kunci identitas aplikasi                    │
│    Header: X-API-Key: abc123                            │
│    Cocok: API publik, identifikasi aplikasi              │
│    ⚠️ JANGAN letakkan di URL (bisa terekam di log!)      │
│                                                          │
│ 2. BASIC AUTH — username + password (di-encode Base64)   │
│    Header: Authorization: Basic dXNlcjpwYXNz            │
│    ⚠️ HANYA aman di atas HTTPS!                          │
│                                                          │
│ 3. JWT — token setelah login (paling umum di aplikasi)   │
│    Header: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9... │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Cara Kerja JWT (Sederhana) — sumber: OWASP

```text
1. USER LOGIN:  kirim username + password → server cek
2. SERVER BIKIN TOKEN:
   { header } . { payload: siapa, kapan kadaluarsa } . { tanda tangan }
3. TOKEN DIKIRIM ke user (browser menyimpannya)
4. SETIAP MINTA DATA: user kirim token di header
   Authorization: Bearer <token>
5. SERVER CEK token: valid? belum kedaluwarsa? → beri data

Server tidak perlu "mengingat" sesi — token membawa semuanya
(inilah prinsip stateless yang tadi kita bahas!).
```

> 🎯 **Untuk belajar:** coba dengan `jsonwebtoken` di Node.js
> atau pakai starter kit auth **Laravel Breeze** (Modul 13).
> AI bisa setup semuanya untuk Anda.

---

## 🧠 17.6 CORS: KENAPA FRONTEND PERLU IZIN?

### Masalahnya

```text
Browser punya aturan keamanan: Same-Origin Policy (SOP)
→ JavaScript di situs A TIDAK boleh mengambil data dari situs B
   tanpa izin.

Ini mencegah situs jahat mencuri data Anda. Bagus untuk keamanan,
tapi merepotkan saat frontend & backend beda alamat.
```

### Solusinya: CORS (Cross-Origin Resource Sharing)

```text
Frontend:  http://localhost:3000
Backend:   http://localhost:5000
     ⚠️ beda port = beda origin → browser memblokir!

Server harus mengirim header izin:
  Access-Control-Allow-Origin: http://localhost:3000
```

### Di Express (yang Anda pakai di Modul 11)

```bash
npm install cors
```

```js
import cors from "cors";
app.use(cors()); // izinkan SEMUA origin (untuk belajar)
// untuk produksi, batasi: app.use(cors({ origin: "https://situs-anda.com" }))
```

> 💡 **Di Next.js route handler** (Modul 12) CORS lebih jarang
> jadi masalah karena frontend & backend satu aplikasi.
> Tapi kalau Anda akses API dari aplikasi lain, CORS tetap berlaku.

### Kapan CORS Dipakai?

| Situasi | Butuh CORS? |
|---------|-------------|
| Next.js: halaman → route handler sendiri | ❌ Tidak (satu origin) |
| React (3000) → Express (5000) | ✅ Ya |
| Aplikasi mobile / Postman | ❌ Tidak (bukan browser) |

---

## 🤖 17.7 TEMPLATE PROMPT API

### Prompt 1: Desain API dulu, Kode Belakangan

```text
Saya mau membuat REST API untuk [entitas, mis. "siswa"].

JANGAN menulis kode dulu. Desain dulu:

1. ENDPOINT (isi tabel):
   | Method | URL | Fungsi | Status code sukses |
   |--------|-----|--------|--------------------|
   | GET    | /api/v1/siswa | ... | 200 |

2. SKEMA DATA: field apa saja + tipe data

3. RESPONS JSON untuk GET (contoh data)

4. VALIDASI: field wajib, aturan format

5. AUTENTIKASI: apakah endpoint ini perlu token? (pakai JWT)

Setelah saya setujui desainnya, baru tulis kodenya.
```

### Prompt 2: Buat API CRUD Lengkap + Validasi

```text
Buat REST API CRUD untuk [entitas] di [proyek saya]:

- GET    /api/v1/[entitas]        → daftar (bisa ?cari=...)
- POST   /api/v1/[entitas]        → buat (validasi field wajib!)
- GET    /api/v1/[entitas]/:id    → detail
- PATCH  /api/v1/[entitas]/:id    → ubah sebagian
- DELETE /api/v1/[entitas]/:id    → hapus

ATURAN:
- Format respons: { sukses: true, data } / { sukses: false, pesan }
- Status code benar: 200, 201, 400, 404, 500
- Nama endpoint kata benda jamak
- Tambahkan versioning /api/v1/
- Validasi: field wajib tidak boleh kosong

Beri 5 contoh uji dengan curl.
```

### Prompt 3: Tambah JWT Auth

```text
Tambahkan autentikasi JWT ke API saya di [proyek].

1. POST /api/v1/auth/login
   → terima { email, password } → balas { token }
2. Semua endpoint lain mengharuskan header:
   Authorization: Bearer <token>
3. Endpoint tanpa token → 401 Unauthorized
4. Endpoint dengan token tapi izin tidak cukup → 403 Forbidden

Pandu saya langkah demi langkah:
- Install & setup jsonwebtoken
- Middleware untuk cek token
- Simpan rahasia JWT di .env (jangan di kode!)
```

### Prompt 4: Perbaiki CORS

```text
Frontend saya di [http://localhost:3000] tidak bisa memanggil
API di [http://localhost:5000] — muncul error CORS.

1. Jelaskan mengapa ini terjadi (bahasa sederhana)
2. Perbaiki dengan menambahkan CORS di server
3. Untuk produksi, batasi origin ke domain resmi saja
4. Jelaskan bedanya CORS saat develop vs produksi
```

---

## 🏗️ 17.8 PRAKTIK

### Latihan 1: Desain API (30 menit)

```text
Gunakan Prompt 1 (17.7) untuk mendesain API "perpustakaan":
- Entitas: buku, anggota, peminjaman
- Fokus: endpoint, skema data, status code, validasi

Review desainnya bersama AI sebelum lanjut ke kode.
```

### Latihan 2: API CRUD + Validasi (60 menit)

```text
Gunakan Prompt 2 untuk membangun API CRUD buku di proyek
Express (Modul 11) atau Next.js (Modul 12).

Uji dengan curl:
1. POST /api/v1/buku → sukses (201)
2. POST dengan judul kosong → error (400)
3. GET /api/v1/buku → semua buku (200)
4. GET /api/v1/buku/999 → tidak ada (404)
5. DELETE → sukses
```

### Latihan 3: JWT (60 menit)

```text
Gunakan Prompt 3 (17.7) untuk menambahkan login JWT.

Uji:
1. POST /api/v1/auth/login → dapat token
2. GET /api/v1/buku TANPA token → 401
3. GET /api/v1/buku DENGAN token → 200
4. Token salah/kedaluwarsa → 401
```

### Latihan 4: Konsumsi API Publik (30 menit)

```text
1. Buka https://jsonplaceholder.typicode.com/users
2. Baca struktur JSON-nya (minta AI jelaskan)
3. Di aplikasi Anda, tampilkan daftar nama user dari API ini
4. Coba tambahkan ?_limit=3 → lihat bedanya
5. Minta AI jelaskan: bagaimana frontend membaca JSON respons
```

---

## 🧠 17.9 RANGKUMAN & KETIKA BINGUNG

### Yang Sudah Anda Pelajari

| Konsep | Intinya |
|--------|---------|
| **API / REST** | Aturan pertukaran data antar aplikasi |
| **Resource** | Kata benda: /api/items (bukan /getItems) |
| **HTTP methods** | GET, POST, PUT, PATCH, DELETE |
| **Status code** | 200, 201, 400, 401, 403, 404, 429, 500 |
| **Versioning** | /api/v1/... agar aman saat berubah |
| **Autentikasi** | API Key, Basic Auth, JWT (Bearer token) |
| **CORS** | Izin browser untuk beda origin |

### Checklist

```
☐ Bisa mendesain endpoint REST (method + URL + status code)
☐ Paham konvensi kata benda jamak
☐ API CRUD + validasi jalan & teruji curl
☐ Login JWT berfungsi (401 tanpa token, 200 dengan token)
☐ Paham API versioning
☐ Paham kenapa CORS dibutuhkan
☐ Sudah konsumsi API publik & tampilkan datanya
```

### Ketika Bingung

```text
❓ Error CORS
   → server belum kirim header Access-Control-Allow-Origin

❓ Token invalid / expired
   → token salah atau kedaluwarsa. Login ulang.

❓ 401 terus padahal sudah kirim token
   → cek format: Authorization: Bearer <token> (ada "Bearer ")

❓ API diubah tapi aplikasi lama rusak
   → pakai versioning /v1/ /v2/ mulai sekarang

❓ Stuck? Tempel error ke AI + konteks
```

---

## 🎯 KAPAN LANJUT?

Anda siap lanjut ke **VPS Server** jika sudah bisa:

```
☐ Mendesain endpoint REST dengan benar
☐ API CRUD + validasi + status code berfungsi
☐ Menambahkan autentikasi JWT
☐ Paham CORS & versioning
```

> **Ingat:** API Anda jalan di `localhost` — hanya komputer Anda
> yang bisa akses. Sekarang saatnya naik ke internet:
> **Modul 18: VPS Server**!

---

**📂 Lanjut ke: `18-vps-server.md`**
