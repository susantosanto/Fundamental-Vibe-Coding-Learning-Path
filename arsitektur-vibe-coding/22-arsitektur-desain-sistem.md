# 🏛️ Modul 22: Arsitektur Desain Sistem — Fundamental Lengkap & Mendalam

> **"Arsitektur = membuat keputusan besar sebelum menulis kode, supaya kode tidak perlu ditulis ulang."**
> Waktu: ~6-8 jam | Level: 🟡 Intermediate | Lanjutan dari: Modul 19 (Loop Engineering), 20 (Proyek Akhir)

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Apa itu arsitektur sistem & kenapa harus dipikirkan DULU
✅ 4 komponen inti: Frontend, Backend, Database, Infrastruktur
✅ Client-Server & Request-Response (dasar SEMUA aplikasi web)
✅ Monolith vs Microservices — kapan pakai yang mana
✅ Pola arsitektur: Layering, MVC, API-First
✅ Database design: kapan SQL, kapan NoSQL, kapan cache
✅ Skalabilitas: vertical vs horizontal, load balancer, CDN
✅ Ketersediaan (availability) & konsistensi (CAP sederhana)
✅ Keamanan arsitektur: autentikasi, enkripsi, env vars
✅ Framework 7 pertanyaan untuk mendesain sistem apa pun
```

> 🎯 **Kenapa Anda butuh ini?**
> Anda sudah bisa membuat aplikasi (Modul 10-20). Sekarang saatnya naik
> satu level: **merancang** aplikasi SEBELUM dibangun — seperti arsitek
> membuat denah sebelum tukang membangun. Ini yang membedakan
> *developer* dari *engineer*.

---

## 🧠 22.1 APA ITU ARSITEKTUR SISTEM? (MULAI DARI KENAPA)

### 22.1.1 Analogi: Rumah Tanpa Denah

```text
Membangun aplikasi TANPA arsitektur = membangun rumah TANPA denah:

┌──────────────────────────────────────────────┐
│  RUMAH TANPA DENAH:                          │
│  • Dinding ditambah saat lupa kamar          │
│  • Listrik dipasang setelah cat selesai      │
│  • Renovasi tiap 3 bulan karena salah letak  │
│  • Akhirnya: mahal, berantakan, mau bongkar  │
└──────────────────────────────────────────────┘
```

```text
SAMA SEPERTI KODE TANPA ARSITEKTUR:
• Fitur ditambal di mana saja → susah dicari
• Database dirancang ulang 3x → data kacau
• Tiap fitur baru bikin error di fitur lama
• Akhirnya: aplikasi "takut diubah" karena rapuh
```

> 🎯 **Definisi resmi (sederhana):**
> **Arsitektur sistem = keputusan-keputusan besar tentang bagaimana
> komponen aplikasi disusun dan saling berkomunikasi, DIBUAT SEBELUM
> kode ditulis, supaya aplikasi mudah dikembangkan, dirawat, dan diskalakan.**

### 22.1.2 Pertanyaan yang Dijawab Arsitektur

```text
SETIAP ARSITEKTUR MENJAWAB 3 PERTANYAAN BESAR:

1. KOMPONEN APA SAJA yang dibutuhkan?
   (halaman web? API? database? login?)

2. BAGAIMANA komponen saling berkomunikasi?
   (browser → API → database: lewat HTTP/JSON)

3. BERAPA BESAR skala yang harus ditampung?
   (5 pengguna? 5.000? 5 juta? — jawaban menentukan desain)
```

> 💡 **Ingat Modul 1 (arsitektur itu gampang)?** Di sana Anda belajar
> "3 pertanyaan ajaib". Modul ini adalah versi MENDALAM dari itu —
> setiap pertanyaan dibedah satu per satu.

### 22.1.3 Arsitektur vs Kode: Beda Level

| Level | Contoh Pertanyaan | Alatnya |
|-------|-------------------|---------|
| **Arsitektur** | "Database-nya apa? Pakai monolith atau microservices?" | Diagram, keputusan, dokumen |
| **Desain** | "Struktur tabel user & buku bagaimana?" | ERD, schema |
| **Kode** | "Fungsi `simpanBuku()` ditulis bagaimana?" | Bahasa pemrograman |

> 🎯 **Analoginya:**
> - Arsitektur = denah kota (jalan mana, daerah mana)
> - Desain = denah per gedung (kamar di mana)
> - Kode = isi kamar (letak lemari, kasur)

---

## 🧠 22.2 4 KOMPONEN INTI SETIAP APLIKASI WEB

> **Ini pengingat Modul 2 — tapi kali ini kita bedah MENDALAM peran
> dan tanggung jawab masing-masing.**

```text
            PENGGUNA (browser)
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ 1. FRONTEND (tampilan)                              │
│    React/Next.js • HTML/CSS/JS • "wajah" aplikasi   │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP request (JSON)
                       ▼
┌─────────────────────────────────────────────────────┐
│ 2. BACKEND (otak & aturan)                          │
│    Node.js/Express • Laravel • "logika bisnis"      │
└──────────────────────┬──────────────────────────────┘
                       │ query
                       ▼
┌─────────────────────────────────────────────────────┐
│ 3. DATABASE (ingatan)                               │
│    SQLite • PostgreSQL • "penyimpanan permanen"     │
└─────────────────────────────────────────────────────┘

4. INFRASTRUKTUR (rumahnya) — VPS, cloud, Nginx, DNS
   (sudah Anda kuasai di Modul 16-18!)
```

### 22.2.1 Tanggung Jawab Tiap Komponen (Tabel Mendalam)

| Komponen | Tanggung jawab | Boleh punya | TIDAK boleh punya |
|----------|---------------|-------------|-------------------|
| **Frontend** | Tampilkan data, terima input user | State UI (form, dropdown) | Logika bisnis penting, kunci API |
| **Backend** | Validasi, aturan bisnis, keamanan | Token, kunci, logika | Menyimpan data permanen (itu DB) |
| **Database** | Simpan & ambil data | Data mentah | Logika rumit (sebaiknya di backend) |
| **Infrastruktur** | Jalankan semua, layani request | Konfigurasi, SSL, firewall | Kode aplikasi |

> ⚠️ **Aturan emas arsitektur: SETIAP komponen punya SATU pekerjaan.**
> Kalau backend mulai "menyimpan data di file sendiri" atau frontend
> mulai "menghitung total harga" → itu tanda arsitektur mulai rusak.

### 22.2.2 Latihan Kenali Komponen

```text
Aplikasi "Perpustakaan Sekolah" (dari Modul 20):

Frontend   = halaman daftar buku, form tambah buku (React/Next)
Backend    = validasi "judul wajib diisi", cek stok, atur peminjaman
Database   = tabel buku, anggota, peminjaman (PostgreSQL)
Infrastruktur = VPS + Nginx + SSL (Modul 18)

👉 Latihan: pilih aplikasi lain (todo list / blog) dan sebutkan
   4 komponennya. Minta AI periksa jawaban Anda!
```

---

## 🧠 22.3 CLIENT-SERVER & REQUEST-RESPONSE (MENDALAM)

> Dasar dari SEMUA aplikasi web. Sudah disinggung di Modul 16 —
> sekarang kita bahas sudut pandang arsitektur.

### 22.3.1 Client dan Server

```text
CLIENT  = pihak yang MEMINTA (browser, HP, aplikasi lain)
SERVER  = pihak yang MELAYANI (backend + database)

Aturan arsitektur: server TIDAK PERNAH mendatangi client.
Selalu client yang minta dulu → server menjawab.
```

| Aspek | Client | Server |
|-------|--------|--------|
| Peran | Minta & tampilkan | Proses & jawab |
| Lokasi | HP/laptop user | Data center / VPS |
| Jumlah | Banyak (ribuan) | Sedikit (bisa 1 dulu) |
| Contoh | Browser, React app | Express, Laravel, Next.js API |

### 22.3.2 Anatomi Satu Request (Permintaan)

```text
GET /api/buku HTTP/1.1
Host: perpustakaan-sekolah.com
Authorization: Bearer eyJhbGciOi...
```

| Bagian | Arti | Contoh |
|--------|------|--------|
| **Method** | Aksi yang diminta | GET (ambil), POST (kirim), PUT/PATCH (ubah), DELETE (hapus) |
| **Path** | Sumber daya yang dituju | /api/buku |
| **Headers** | Informasi tambahan | Authorization (token), Content-Type (format) |
| **Body** | Isi (untuk POST/PUT) | `{"judul": "Laskar Pelangi"}` |

### 22.3.3 Anatomi Satu Response (Jawaban)

```text
HTTP/1.1 200 OK
Content-Type: application/json

[ { "id": 1, "judul": "Laskar Pelangi", "stok": 3 } ]
```

| Bagian | Arti | Contoh |
|--------|------|--------|
| **Status code** | Hasil permintaan | 200 OK, 201 Created, 404 Not Found |
| **Headers** | Info jawaban | Content-Type: application/json |
| **Body** | Data yang diminta | JSON array buku |

> 🎯 **Ingat Modul 16-17?** Status code & REST sudah dibahas. Di sini
> Anda melihatnya sebagai *bagian dari arsitektur*: keputusan "response
> selalu JSON" adalah KEPUTUSAN ARSITEKTUR (bukan kebetulan).

### 22.3.4 Kenapa Arsitektur Ini Dipakai di Mana-Mana?

```text
✅ Server bisa melayani BANYAK client sekaligus (stateless)
✅ Frontend & backend bisa dikembangkan TIM TERPISAH
✅ Frontend bisa diganti (web → HP) tanpa sentuh backend
✅ API yang sama bisa dipakai banyak aplikasi
```

---

## 🧠 22.4 MONOLITH vs MICROSERVICES (KEPUTUSAN BESAR #1)

### 22.4.1 Dua Gaya Arsitektur

```text
MONOLITH (satu aplikasi besar):         MICROSERVICES (banyak aplikasi kecil):
┌─────────────────────────┐             ┌──────┐ ┌──────┐ ┌──────┐
│ Auth │ Buku │ Pinjam    │             │ Auth │ │ Buku │ │ Pinjam│
│      └─────┴────────    │             └──────┘ └──────┘ └──────┘
│      satu kode besar    │             (masing-masing deploy sendiri)
└─────────────────────────┘
```

| Aspek | Monolith | Microservices |
|-------|----------|---------------|
| Kode | Satu proyek besar | Banyak proyek kecil |
| Deploy | Sekali untuk semua | Per-layanan |
| Belajar | ✅ Lebih mudah | ❌ Lebih sulit |
| Skala | Satu server dulu | Bisa skala per bagian |
| Perusahaan | Startup, aplikasi kecil | Raksasa (Netflix, Uber) |

### 22.4.2 Kapan Pakai Apa? (Keputusan Praktis)

```text
✅ PAKAI MONOLITH kalau:
   • Tim kecil (1-5 orang) atau sendiri
   • Aplikasi 1-2 domain (perpustakaan, toko kecil)
   • Masih belajar / MVP
   • Waktu terbatas

✅ PAKAI MICROSERVICES kalau:
   • Tim besar (10+ orang) bekerja paralel
   • Banyak domain besar (auth, payment, order, delivery)
   • Satu bagian butuh skala jauh lebih besar dari lain
   • (Ini butuh pengalaman — jangan untuk proyek belajar!)
```

> ⚠️ **Nasihat arsitektur paling penting di modul ini:**
> **Mulai dengan monolith. Hampir semua aplikasi besar di dunia MULAI
> sebagai monolith.** Microservices menambah kerumitan besar (komunikasi
> antar-layanan, debugging sulit) tanpa manfaat untuk tim kecil.
>
> *Kutipan terkenal dari Martin Fowler (arsitek software ternama):*
> **"Jangan mulai dengan microservices. Mulailah dengan monolith,
> lalu pecah saat memang dibutuhkan."**

### 22.4.3 Modular Monolith: Jalan Tengah yang Cerdas

```text
Bahkan dalam satu aplikasi monolith, pisahkan LOGIKA per fitur:

app/
├── modules/
│   ├── auth/        (login, register)
│   ├── buku/        (CRUD buku)
│   └── peminjaman/  (pinjam, kembali)
└── (setiap modul: routes, controllers, models SENDIRI)

→ Manfaat monolith (mudah) + sedikit disiplin microservices (rapi).
```

---

## 🧠 22.5 POLA ARSITEKTUR: LAYERING, MVC, API-FIRST

> **Pola (pattern) = solusi yang sudah terbukti untuk masalah yang
> berulang.** Arsitek tidak menciptakan roda — mereka memakai pola.

### 22.5.1 Layering (Berlapis) — Pola Paling Dasar

```text
Setiap aplikasi sebaiknya punya LAPISAN, dan data mengalir dari atas
ke bawah (dan kembali):

┌────────────────────────────────────────────┐
│ 1. PRESENTATION (tampilan)                  │  ← React/Blade
│    menampilkan data ke user                 │
├────────────────────────────────────────────┤
│ 2. APPLICATION (logika)                     │  ← Controller
│    menerima request, mengatur alur          │
├────────────────────────────────────────────┤
│ 3. DOMAIN (aturan bisnis)                   │  ← Service/Model
│    "stok tidak boleh minus", "anggota       │
│     telat 7 hari kena denda"                │
├────────────────────────────────────────────┤
│ 4. DATA (penyimpanan)                       │  ← Repository/DB
│    baca & tulis database                    │
└────────────────────────────────────────────┘
```

> 💡 **Aturan lapisan:** lapisan atas BOLEH memanggil yang di bawahnya,
> tapi lapisan bawah TIDAK BOLEH memanggil yang di atasnya. (Tampilan
> tidak boleh langsung mengotak-atik database!)

### 22.5.2 MVC: Pola Paling Populer di Web

```text
MODEL (data)    ←→   VIEW (tampilan)
        ↑
     CONTROLLER (menerima request, mengatur keduanya)

      USER → Controller → Model → Database
                ↓
              View → USER
```

| Bagian | Kerja | Di Laravel | Di Next.js |
|--------|-------|-----------|------------|
| **Model** | Data & aturan bisnis | `app/Models/Buku.php` | `lib/` + database |
| **View** | Tampilan | `resources/views` (Blade) | `app/page.tsx` (React) |
| **Controller** | Hubungkan keduanya | `app/Http/Controllers` | Route handler `app/api/` |

> 🎯 **Anda sudah memakai MVC tanpa sadar di Modul 13 (Laravel)!**
> Sekarang Anda tahu NAMA polanya — dan bisa menjelaskannya saat wawancara kerja.

### 22.5.3 API-First: Desain API Sebelum Tampilan

```text
API-FIRST = rancang & sepakati API DULU, baru buat frontend.

ALUR PROFESIONAL:
1. Rancang API-nya (path, method, JSON) → dokumentasikan
2. Buat backend sesuai rancangan
3. Buat frontend memanggil API yang sudah disepakati

KENAPA? Tim frontend & backend bisa kerja paralel tanpa saling tunggu.
```

> 🤖 **Prompt AI untuk mempraktikkan API-First:**
> ```text
> Saya mau membuat aplikasi [deskripsi]. Rancangkan REST API-nya dulu:
> 1. Daftar sumber daya (resource) yang dibutuhkan
> 2. Untuk tiap resource: method HTTP, path, request body, response
> 3. Status code yang mungkin muncul
> Tampilkan dalam tabel. Belum perlu menulis kode.
> ```

---

## 🧠 22.6 DATABASE DESIGN: KAPAN SQL, NoSQL, DAN CACHE

### 22.6.1 Dua Keluarga Besar Database

```text
SQL (relasional)                        NoSQL (non-relasional)
┌──────────────┐                        ┌──────────────┐
│ tabel + baris│                        │ dokumen/kunci│
│ relasi jelas │                        │ fleksibel    │
│ SQLite, MySQL│                        │ MongoDB, Redis│
│ PostgreSQL   │                        │ Firestore    │
└──────────────┘                        └──────────────┘
ACID (aman & konsisten)                Cepat, fleksibel, skala horizontal
```

| Aspek | SQL (PostgreSQL) | NoSQL (MongoDB) |
|-------|------------------|-----------------|
| Struktur | Tabel tetap, kolom ditentukan | Dokumen fleksibel (JSON) |
| Relasi | Sangat kuat (JOIN) | Lemah (embedded) |
| Konsistensi | Kuat (ACID) | Lebih longgar (BASE) |
| Cocok untuk | Data terstruktur: transaksi, user, buku | Data bervariasi: log, konten, feed |
| Belajar pemula | ✅ Mulai di sini (Modul 14-15) | Nanti saja |

### 22.6.2 Keputusan Praktis untuk Aplikasi Anda

```text
✅ GUNAKAN SQL (PostgreSQL) untuk hampir semua aplikasi yang Anda buat:
   user, buku, peminjaman, pesanan, artikel — semuanya berelasi jelas.

✅ GUNAKAN NoSQL kalau:
   • Struktur data sering berubah-ubah
   • Data dalam skala raksasa (jutaan dokumen)
   • Butuh sangat cepat & fleksibel
   (Kebanyakan proyek belajar TIDAK butuh ini!)

❌ JANGAN buat database raksasa untuk aplikasi kecil.
   Satu PostgreSQL yang rapi sudah cukup untuk ratusan ribu baris.
```

### 22.6.3 Cache: "Memori Kilat" di Depan Database

```text
MASALAH: database membaca dari disk → relatif lambat.
SOLUSI: cache menyimpan hasil di RAM → sangat cepat.

┌────────┐  1. cek cache dulu   ┌─────────┐
│  API   │ ───────────────────▶ │  CACHE  │  (RAM, sangat cepat)
│  Anda  │ ◀─────────────────── │ (Redis) │
└────────┘                      └────┬────┘
      │ 2. tidak ada → baca database │
      ▼                              ▼
   ┌─────────────────────────────────────┐
   │  DATABASE (disk, lebih lambat)      │
   └─────────────────────────────────────┘
```

```text
CONTOH NYATA: halaman beranda yang sama dilihat 1000 orang.
TANPA cache: 1000x baca database.
DENGAN cache: 1x baca database → 999x dari cache. 100x lebih cepat!

KAPAN BUTUH CACHE? Saat data sering dibaca & jarang berubah
(daftar buku, harga, profil). Bukan untuk data yang selalu berubah
(transaksi real-time).
```

> 💡 **Redis = database di RAM** yang paling populer untuk cache.
> Pelajaran praktis: jangan buru-buru pakai Redis untuk aplikasi kecil —
> optimalisasi dulu query SQL-nya! (Baca Modul 07: trade-off pemula.)

---

## 🧠 22.7 SKALABILITAS: SAAT PENGGUNA MULAI BANYAK

### 22.7.1 Vertical vs Horizontal

```text
VERTICAL (naikkan 1 server):        HORIZONTAL (tambah server):
┌────────────┐                       ┌─────┐ ┌─────┐ ┌─────┐
│  1 server  │  tambah RAM/CPU       │ S1  │ │ S2  │ │ S3  │
│  4GB → 16GB│  (ganti kulkas besar) │ └─┬─┘ └─┬─┘ └─┬─┘ │
└────────────┘                        └───┼───┼───┼───┘
                                         load balancer (pembagi)
                                             │
                                        pengguna
```

| Aspek | Vertical | Horizontal |
|-------|----------|------------|
| Cara | 1 server diperbesar | Banyak server bekerja sama |
| Kemudahan | ✅ Sangat mudah | ❌ Perlu load balancer |
| Batas | Ada batas fisik (RAM max) | Hampir tanpa batas |
| Biaya | Naik tajam setelah titik tertentu | Bisa lebih murah per unit |
| Untuk siapa | Aplikasi kecil-menengah | Aplikasi besar |

> 🎯 **Alur realistis untuk Anda:**
> 1 server kecil (VPS $5) → 1 server besar → baru horizontal.
> 99% aplikasi belajar tidak pernah butuh melampaui langkah pertama!

### 22.7.2 Load Balancer: Pembagi Kerja

```text
TANPA load balancer:               DENGAN load balancer:
┌──────┐   semua ke 1 server       ┌──────┐
│ user │ →  S1 kewalahan           │ user │ → Load Balancer
└──────┘                           └──────┘   ↓   ↓   ↓
                                            S1  S2  S3 (adil)
```

```text
Load balancer = resepsionis yang mengarahkan pengunjung ke kasir
yang paling kosong. Mencegah satu server kewalahan sementara
server lain menganggur.
```

### 22.7.3 CDN: Mendekatkan Data ke Pengguna

```text
MASALAH: server di Jakarta, pengguna di Aceh → lambat (jarak).
SOLUSI: CDN menyalin file statis ke server di banyak kota.

┌────────────┐
│ CDN server │  (salinan di Singapura, Jakarta, dll)
│ di 5 kota  │
└─────┬──────┘
      │ pengguna dapat dari kota TERDEKAT
┌─────┴──────┐
│ Server inti│  (di satu tempat)
└────────────┘

FILE STATIS = gambar, CSS, JS, video. (Bukan data privat user!)
Contoh CDN: Cloudflare (gratis!), Akamai, Fastly.
```

> 💡 **Praktis untuk Anda:** pasang **Cloudflare** di depan domain Anda
> (gratis) → dapat CDN + keamanan + HTTPS, sekali konfigurasi.
> (Cloudflare diatur di DNS — lihat Modul 18.10.)

---

## 🧠 22.8 AVAILABILITY & CONSISTENCY (CAP DISEDERHANAKAN)

### 22.8.1 Dua Hal yang Sama Penting

```text
AVAILABILITY (ketersediaan)  =  website SELALU bisa diakses.
                                (99.9% = mati cuma 8,7 jam/tahun)

CONSISTENCY (konsistensi)    =  data yang dibaca SEMUA orang sama.
                                (stok tinggal 1 → semua lihat 1)
```

### 22.8.2 Teorema CAP (Versi Sederhana)

> Di sistem yang TERDISTRIBUSI (lebih dari 1 server database), saat
> jaringan bermasalah, Anda harus memilih:

```text
          C (Consistency — semua lihat data sama)
          │
    CP ═══╪═══ AP
          │
          A (Availability)      P (Partition — jaringan putus)

Teorema CAP: saat jaringan putus (P terjadi), Anda HARUS memilih:
• CP = utamakan konsistensi → sebagian pengguna ditolak dulu
• AP = utamakan ketersediaan → semua bisa akses, tapi data
       mungkin "basah" (belum sinkron) sesaat
```

| Pilihan | Contoh Nyata | Artinya |
|---------|--------------|---------|
| **CP** | Transfer bank | Kalau ragu, transaksi DITOLAK (jangan sampai saldo dobel) |
| **AP** | Feed Instagram, chat | Selalu bisa akses, tapi sesaat mungkin lihat data lama |

> 🎯 **Keputusan arsitektur:** aplikasi keuangan → CP. Aplikasi sosial → AP.
> Aplikasi perpustakaan sekolah Anda → hanya 1 database → tidak perlu
> pusing CAP dulu! (CAP relevan saat punya BANYAK server database.)

---

## 🧠 22.9 KEAMANAN ARSITEKTUR (WAJIB SEJAK AWAL)

> Keamanan bukan fitur tambahan — ini keputusan arsitektur yang harus
> ada sejak awal.

### 22.9.1 Lapisan Keamanan dari Luar ke Dalam

```text
┌─────────────────────────────────────────────┐
│ 1. HTTPS (TLS)          → data terenkripsi  │  Modul 18.11 ✅
│ 2. Firewall (UFW)       → tutup pintu       │  Modul 18.6 ✅
│ 3. Autentikasi          → siapa Anda?       │  login + JWT
│ 4. Otorisasi            → boleh apa?        │  admin vs anggota
│ 5. Validasi input       → jangan percaya    │  cek semua input
│ 6. Env vars & secrets   → kunci rahasia     │  .env, jangan di kode!
└─────────────────────────────────────────────┘
```

### 22.9.2 Aturan Emas Keamanan (Jangan Dilewati!)

```text
1. JANGAN PERNAH taruh password / API key di kode.
   → simpan di file .env (sudah dipakai di Modul 11 & 13).

2. JANGAN PERNAH percaya input dari pengguna.
   → validasi semua (panjang, tipe, isi) di BACKEND, bukan cuma frontend.

3. Enkripsi password → pakai bcrypt (bukan hash biasa).

4. Token (JWT) kadaluarsa → biar tidak dipakai selamanya.

5. Prinsip LEAST PRIVILEGE: beri akses seminimal mungkin.
   → user biasa jangan bisa DELETE data admin.
```

> 🤖 **Prompt AI audit keamanan aplikasi Anda:**
> ```text
> Baca seluruh kode aplikasi saya di folder ini. Audit keamanannya:
> 1. Apakah ada password/API key yang bocor ke kode?
> 2. Apakah semua input pengguna divalidasi di backend?
> 3. Apakah akses admin & user dibedakan?
> 4. Apakah password di-hash dengan benar?
> Beri daftar temuan + perbaikan, urutkan dari yang paling kritis.
> ```

---

## 🧠 22.10 OBSERVABILITY: MEMAHAMI APLIKASI YANG JALAN

### 22.10.1 Tiga Pilar

```text
1. LOGS (catatan)     → "apa yang terjadi?"     → teks kejadian
2. METRICS (angka)    → "seberapa sehat?"       → CPU, RAM, error rate
3. TRACES (perjalanan)→ "lambatnya di mana?"    → satu request dari awal
```

### 22.10.2 Praktik Minimal yang Harus Anda Lakukan

```text
✅ SELALU log error:      console.error(...) / logger (jangan hanya console.log)
✅ Simpan log ke file:    PM2 sudah menyimpannya! (Modul 18.8 → pm2 logs)
✅ Pantau 3 angka:        uptime, jumlah error, waktu respons
✅ Cek sumber daya:       free -h (RAM), df -h (disk) di VPS
✅ Buat /health endpoint: GET /api/health → "ok" — untuk cek cepat
```

> 🎯 **Untuk pemula, cukup:** PM2 logs + cek RAM/disk + endpoint /health.
> Jangan langsung pasang Grafana/Prometheus — itu untuk sistem besar!

---

## 🧠 22.11 FRAMEWORK 7 PERTANYAAN (CARANYA BERPIKIR ARSITEK)

> Ini inti modul ini. Setiap kali mau mendesain sistem (besar atau kecil),
> jawab 7 pertanyaan ini secara berurutan. (Sumber konsep: system design
> primer & praktik industri umum.)

### 22.11.1 Tujuh Pertanyaan

```text
1.  FUNCTIONAL REQUIREMENTS
    "Apa yang HARUS dilakukan sistem ini?" (fitur inti)

2.  NON-FUNCTIONAL REQUIREMENTS
    "Seberapa cepat? Seberapa aman? Seberapa banyak pengguna?"

3.  ESTIMASI
    "Berapa user? Berapa request/detik? Berapa data?" (perkiraan kasar)

4.  DATA MODEL
    "Entitas apa saja? Bagaimana relasinya?" (user, buku, pinjam)

5.  HIGH-LEVEL DESIGN
    "Komponen apa saja? Bagaimana alurnya?" (gambar diagram!)

6.  DEEP DIVE
    "Bagaimana bagian paling penting bekerja secara detail?"

7.  TRADE-OFFS
    "Alternatif apa? Apa kekurangan pilihan ini?"
```

### 22.11.2 Contoh: Desain Sistem "Absensi Sekolah"

```text
1. FUNGSIONAL: guru absen, siswa lihat status, admin rekap.
2. NON-FUNGSIONAL: 500 guru, 5000 siswa, cepat < 2 detik, aman.
3. ESTIMASI: 5500 user, ~5 request/detik di jam masuk sekolah,
   data ~100.000 baris/tahun.
4. DATA MODEL: Guru, Siswa, Kelas, Absensi (FK ke Guru & Kelas).
5. HIGH-LEVEL: Next.js (frontend+API) + PostgreSQL + VPS.
   ┌──────┐      ┌───────────────┐      ┌──────────┐
   │ Guru │ ───▶ │ Next.js + API │ ───▶ │PostgreSQL│
   └──────┘      └───────────────┘      └──────────┘
6. DEEP DIVE: absen = INSERT ke tabel absensi + cek duplikat hari ini.
7. TRADE-OFFS: monolith (mudah) vs microservice (tidak perlu);
   SQLite (mulai) vs PostgreSQL (aman untuk data penting).
```

> 🤖 **Prompt AI "arsitek pribadi" — simpan & pakai selalu:**
> ```text
> Kamu adalah arsitek software senior. Aku akan mendesain sistem baru:
> [deskripsi aplikasi singkat].
> Tuntun aku menjawab 7 pertanyaan arsitektur ini SATU PER SATU:
> 1) functional requirements, 2) non-functional, 3) estimasi,
> 4) data model, 5) high-level design, 6) deep dive, 7) trade-offs.
> Jangan jawab semuanya sekaligus. Beri aku satu pertanyaan,
> tunggu jawabanku, baru lanjut. Gunakan bahasa sederhana.
> ```

---

## 🧠 22.12 STUDI KASUS: PERJALANAN SATU APLIKASI (KECIL → BESAR)

> Ilustrasi bagaimana keputusan arsitektur berubah seiring pertumbuhan.

### Tahap 1: Prototype (Bulan 1) — 1 Server

```text
PERPUSTAKAAN SEKOLAH v1:
• Next.js monolith di 1 VPS kecil (2GB RAM)
• SQLite (Modul 14) → cukup untuk 1 sekolah
• Tidak ada login, data sederhana
KEPUTUSAN: paling sederhana yang bisa jalan. ✅ Benar!

┌──────────────┐
│ VPS 2GB      │
│ Next.js+SQLite│
└──────────────┘
```

### Tahap 2: Dipakai Banyak Sekolah (Bulan 6) — Naik Level

```text
PERPUSTAKAAN v2:
• Ganti SQLite → PostgreSQL (multi-user aman, Modul 15)
• Tambah login (JWT) & peran admin/anggota
• Naikkan VPS → 4GB RAM
• Cadangkan database tiap hari (backup)
KEPUTUSAN: naik spesifikasi VERTIKAL dulu. ✅ Tepat.

┌──────────────────┐
│ VPS 4GB          │
│ Next.js + API    │
│ PostgreSQL       │
│ (backup harian)  │
└──────────────────┘
```

### Tahap 3: 100 Sekolah (Tahun 2) — Skala Lebih Besar

```text
PERPUSTAKAAN v3:
• Pisahkan frontend & backend (API terpisah — API-First!)
• Database di server terpisah (bukan satu server lagi)
• Pasang cache Redis untuk data yang sering dibaca
• Load balancer jika 1 server tidak cukup
KEPUTUSAN: mulai horizontal — perlahan, per bagian. ✅

┌──────┐    ┌───────────┐    ┌────────────┐
│ Next │───▶│ Backend   │───▶│ PostgreSQL │
│ (FE) │    │ + Redis   │    │ (terpisah) │
└──────┘    └───────────┘    └────────────┘
```

### Tahap 4: Raksasa (Tahun 5) — Baru Microservices

```text
• Pecah backend menjadi: auth-service, buku-service, pinjam-service
• Message queue untuk proses berat (laporan)
• Baru di sini microservices masuk akal!
KEPUTUSAN: pecah monolith KARENA kebutuhan nyata. ✅
```

> 🎯 **Pelajaran utama studi kasus:**
> **Arsitektur itu EVOLUSI, bukan lompatan.** Setiap tahap memakai
> solusi paling sederhana yang cukup untuk tahap itu. Jangan pernah
> membangun "arsitektur tahap 4" untuk aplikasi tahap 1!

---

## 🏗️ 22.13 PRAKTIK

### Latihan 1: Diagramkan Aplikasi Anda (1 jam)

```text
Ambil aplikasi yang sudah Anda buat (Modul 20 / perpustakaan).
Gambar (di kertas / draw.io / minta AI buat diagram):

1. Kotak-kotak komponen: Frontend, Backend, Database, Infrastruktur
2. Panah komunikasi antar komponen
3. Tulis di tiap panah: method HTTP + path (mis. POST /api/buku)

Lalu jawab: apakah ada komponen yang "melanggar tugasnya"?
```

### Latihan 2: Jawab 7 Pertanyaan (2 jam)

```text
Pilih ide aplikasi baru (mis. "aplikasi antrean puskesmas").

Jawab 7 pertanyaan arsitektur (22.11) satu per satu.
Minta AI (prompt di 22.11.2) menuntun Anda.

Hasil akhir: satu dokumen desain 1 halaman:
- fitur inti, data model, diagram, keputusan trade-off.
```

### Latihan 3: Audit Keamanan & Database (1 jam)

```text
1. Gunakan prompt audit keamanan (22.9.2) pada aplikasi Anda.
2. Perbaiki temuan paling kritis (mis. password belum di-hash).
3. Periksa struktur database: apakah relasi sudah benar?
   Minta AI jelaskan apakah perlu tabel tambahan.
```

### Latihan 4: Monolith atau Microservices? (30 menit)

```text
Analisis aplikasi perpustakaan Anda:
1. Kapan masuk akal memecahnya menjadi microservices?
2. Apa masalah yang muncul jika dipecah SEKARANG?
Tulis jawaban 5-10 baris, minta AI review keputusan Anda.
```

---

## 🧠 22.14 RANGKUMAN & KETIKA BINGUNG

### Yang Sudah Anda Pelajari

| Konsep | Intinya | Modul terkait |
|--------|---------|---------------|
| **Arsitektur** | Keputusan besar SEBELUM menulis kode | Modul 1-2 |
| **4 komponen** | Frontend, Backend, Database, Infrastruktur | Modul 2 |
| **Client-Server** | Client minta, server jawab (HTTP/JSON) | Modul 16-17 |
| **Monolith vs Micro** | Mulai monolith, pecah saat perlu | — |
| **Pola** | Layering, MVC, API-First | Modul 3, 13 |
| **Database** | SQL dulu, NoSQL saat perlu, cache saat ramai | Modul 14-15 |
| **Skala** | Vertical → horizontal → CDN | Modul 18 |
| **CAP** | Konsistensi vs ketersediaan (sistem besar) | — |
| **Keamanan** | HTTPS, validasi, env vars, least privilege | Modul 17-18 |
| **7 pertanyaan** | Framework mendesain sistem apa pun | — |

### Kapan Anda Bisa Lanjut

```
☐ Bisa menggambar diagram arsitektur aplikasi sendiri
☐ Bisa menjelaskan beda monolith & microservices + kapan pakainya
☐ Bisa menjawab 7 pertanyaan desain untuk ide aplikasi baru
☐ Paham kapan butuh SQL, NoSQL, dan cache
☐ Paham arah penskalaan: vertical dulu, horizontal saat perlu
☐ Bisa melakukan audit keamanan dasar
```

### Ketika Bingung

```text
❓ "Arsitektur itu susah, saya kan cuma bikin aplikasi kecil"
   → Justru aplikasi kecil paling butuh fondasi yang benar,
     supaya tidak roboh saat mulai besar. Baca 22.1.

❓ "Kapan saya harus pecah jadi microservices?"
   → Saat tim & kompleksitas benar-benar menuntut. Untuk sekarang:
     TIDAK. Monolith + modular sudah cukup. (22.4)

❓ "NoSQL katanya lebih cepat, kenapa harus SQL?"
   → SQL memberi konsistensi & relasi yang aplikasi data penting
     butuhkan. NoSQL "lebih cepat" hanya dalam kondisi spesifik.
     Mulai dengan SQL. (22.6)

❓ "CAP theorem itu apa sih maksudnya?"
   → Saat punya banyak server database & jaringan putus: pilih
     konsistensi (CP) atau ketersediaan (AP). 1 database = tak perlu
     pusing. (22.8)

❓ "Bingung mulai mendesain dari mana?"
   → Gunakan framework 7 pertanyaan (22.11). Jawab nomor 1 dulu,
     jangan lompat ke 5.
```

---

## 🎯 KAPAN LANJUT?

Anda siap menutup fase belajar ini jika sudah bisa:

```
☐ Menjelaskan arsitektur aplikasi yang SUDAH Anda buat
☐ Mendesain sistem baru dengan 7 pertanyaan
☐ Membuat keputusan database & skala dengan alasan
☐ Mengaudit keamanan dasar aplikasi
```

> **SELAMAT! 🎉** Anda telah menyelesaikan seluruh materi `arsitektur-vibe-coding/`
> dari fondasi arsitektur → tech stack lengkap → loop engineering →
> arsitektur desain sistem. Sekarang Anda bukan hanya "bisa coding",
> tapi bisa **MERANCANG** — keterampilan yang membedakan engineer.
>
> **Langkah berikutnya:** buka `cheat-sheet-prompt.md` sebagai pegangan
> harian, lalu perdalam dengan `fase-1-arsitektur-dasar/` (yang kini akan
> terasa jauh lebih mudah!) dan `fase-4-deep-system-design/`.

---

**📂 Lanjut ke: `23-arsitektur-integrasi-ai.md`** — tambahkan fitur chat AI
ke aplikasi Anda dengan arsitektur yang benar! 🤖
