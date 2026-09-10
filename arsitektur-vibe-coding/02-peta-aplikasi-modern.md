# 🗺️ Modul 2: Peta Aplikasi Modern (4 Komponen Inti)

> **Semua aplikasi web — dari yang sederhana sampai raksasa — punya 4 komponen inti.**
> Waktu: ~30 menit | Level: 🟢 Pemula

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ 4 komponen inti: Frontend, Backend, Database, API
✅ Analogi restoran yang bikin langsung paham
✅ Di mana Next.js berada dalam peta ini
✅ Kenapa aplikasi "semi-kompleks" butuh lebih dari 1 komponen
```

---

## 🧠 2.1 EMPAT KOMPONEN INTI

Ingat materi `prompting-fundamental/fase-04`: aplikasi web sederhana punya
HTML (struktur), CSS (tampilan), JS (logika). Itu semua **frontend**.

Saat aplikasi mulai "semi-kompleks" (perlu login, simpan data antar
perangkat, banyak pengguna), Anda butuh 3 komponen tambahan:

```text
┌───────────────────────────────────────────────────────────┐
│                                                           │
│   APLIKASI WEB MODERN = RESTORAN                          │
│                                                           │
│   ┌───────────────────────────────────────────────────┐   │
│   │  FRONTEND  = RUANG MAKAN                          │   │
│   │  Yang dilihat & disentuh pelanggan                │   │
│   │  (tampilan, tombol, form)                         │   │
│   └───────────────────────────────────────────────────┘   │
│                    │  (API = PELAYAN membawa pesanan)      │
│                    ▼                                       │
│   ┌───────────────────────────────────────────────────┐   │
│   │  BACKEND = DAPUR                                  │   │
│   │  Tempat logika & aturan bisnis                    │   │
│   │  (validasi, hitung, atur siapa boleh apa)         │   │
│   └───────────────────────────────────────────────────┘   │
│                    │                                       │
│                    ▼                                       │
│   ┌───────────────────────────────────────────────────┐   │
│   │  DATABASE = GUDANG BAHAN                          │   │
│   │  Tempat menyimpan data secara permanen            │   │
│   │  (bahan makanan = data pengguna, transaksi, dll)  │   │
│   └───────────────────────────────────────────────────┘   │
│                                                           │
│   API = PELAYAN: jembatan antara ruang makan & dapur      │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Tabel Komponen

| Komponen | Peran Restoran | Peran Aplikasi | Contoh Teknologi |
|----------|---------------|----------------|------------------|
| **Frontend** | Ruang makan | Tampilan & interaksi user | React, Next.js |
| **Backend** | Dapur | Logika & aturan bisnis | Next.js API routes, Node.js |
| **Database** | Gudang bahan | Penyimpanan data permanen | SQLite, PostgreSQL, MongoDB |
| **API** | Pelayan | Jembatan frontend ↔ backend | REST API, route handlers |

---

## 🧠 2.2 ALUR LENGKAP: USER → DATABASE → USER

Ini "jalan" data di aplikasi modern. Perhatikan ini adalah versi
diperpanjang dari pola **Input → Proses → Output** di fase-4:

```text
┌─────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐
│  USER   │───▶│  FRONTEND    │───▶│  BACKEND     │───▶│ DATABASE │
│ (klik/  │    │  (tampilan)  │    │  (logika)    │    │ (simpan) │
│  isi    │    │              │    │              │    │          │
│  form)  │    │              │    │              │    │          │
└─────────┘    └──────┬───────┘    └──────┬───────┘    └──────────┘
       ▲              │                  │                │
       │              └──────(API)───────┘                │
       │                        │                         │
       │                        └─────────(balikan)───────┘
       │                                                    │
       └────────────(tampilkan hasil)───────────────────────┘
```

**Contoh nyata: Login ke aplikasi sekolah**

```text
1. USER:  ketik username & password, klik "Masuk"
2. FRONTEND:  kumpulkan input, kirim ke backend (lewat API)
3. BACKEND:  cek apakah username & password benar
4. DATABASE:  cari data user di tabel "pengguna"
5. BACKEND:  kalau cocok, buat "tiket masuk" (token)
6. FRONTEND:  tampilkan "Selamat datang, Bu Guru!"
```

---

## 🧠 2.3 DI MANA NEXT.JS?

**Next.js itu "restoran satu atap"** — dia bisa jadi ruang makan
(frontend) SEKALIGUS dapur (backend) dalam satu aplikasi:

```text
SATU PROYEK NEXT.JS:

┌──────────────────────────────────────────────┐
│  Next.js App                                │
│                                              │
│  app/page.tsx      → FRONTEND (ruang makan)  │
│  app/layout.tsx    → FRONTEND (kerangka)     │
│  app/api/...       → BACKEND (dapur)         │
│  lib/db.ts         → koneksi DATABASE        │
│                                              │
│  + database terpisah (SQLite/PostgreSQL)     │
│    = GUDANG di belakang restoran             │
└──────────────────────────────────────────────┘
```

> ✅ **Buat pemula: ini kabar baik!** Anda tidak perlu setup server
> terpisah. Satu proyek Next.js = frontend + backend sekaligus.
> Database-nya yang "menempel" terpisah.

**Kenapa bisa begitu?** Karena Next.js punya **App Router** — file di
folder `app/api/` otomatis menjadi backend (route handler). Modul 6
akan membahas ini lebih dalam.

---

## 🧠 2.4 KAPAN BUTUH 4 KOMPONEN?

Ini "aturan ibu jari" (tidak perlu hafal, cukup ingat):

| Situasi | Komponen yang Dibutuhkan |
|---------|--------------------------|
| Halaman statis (profil, brosur) | Frontend saja |
| Aplikasi dengan data yang berubah (to-do, catatan) | Frontend + Database |
| Data harus aman / ada login / dipakai banyak orang | Frontend + Backend + Database |
| Data perlu diolah di server (bayar, upload, laporan) | Frontend + Backend + Database + API |

> 🎯 **Prinsip penting: "Right-sizing"** — gunakan sesedikit yang dibutuhkan.
> Aplikasi catatan pribadi tidak butuh server. Aplikasi bank butuh semuanya.
> Jangan over-engineer! (Ini dibahas di Modul 7.)

---

## 🤖 2.5 TEMPLATE PROMPT: PETAKAN APLIKASI

### Prompt: Minta AI Menjelaskan Posisi Setiap Komponen

```text
Saya sedang belajar arsitektur aplikasi web. Tolong analisis
aplikasi yang saya jelaskan di bawah, lalu petakan ke
4 komponen: FRONTEND, BACKEND, DATABASE, API.

<deskripsi_aplikasi>
[Tempel denah dari Modul 1 / deskripsi aplikasi Anda]
</deskripsi_aplikasi>

Format jawaban:

1. TABEL komponen:
   | Komponen | Peran di aplikasi ini | Contoh file/folder |

2. Diagram alur:
   User → ... → Database → ... → User

3. Catatan penting:
   - Komponen mana yang WAJIB ada
   - Komponen mana yang BISA ditunda dulu

Jangan menulis kode apa pun. Analisis saja.
```

---

## 🏗️ 2.6 PRAKTIK

### Latihan 1: Petakan Aplikasi Favorit (10 menit)

Pilih aplikasi yang Anda pakai sehari-hari (mis. Tokopedia, Gojek,
WhatsApp Web, aplikasi sekolah). Isi tabel:

```text
Aplikasi: ___________

| Komponen | Apa yang terjadi di aplikasi ini |
|----------|----------------------------------|
| FRONTEND | (tampilan apa yang user lihat) |
| BACKEND  | (logika apa yang dijalankan) |
| DATABASE | (data apa yang disimpan) |
| API      | (data apa yang dikirim bolak-balik) |
```

<details>
<summary>🔍 Contoh jawaban untuk Tokopedia</summary>

- FRONTEND: katalog produk, keranjang, tombol beli
- BACKEND: cek stok, hitung ongkir, proses pembayaran
- DATABASE: data produk, data user, data pesanan
- API: halaman minta daftar produk → server kirim JSON

</details>

### Latihan 2: Denah → Peta Komponen (15 menit)

```text
1. Ambil denah aplikasi yang sudah Anda buat di Modul 1
2. Jalankan Claude Code / OpenCode di folder proyek
3. Tempel prompt dari bagian 2.5
4. Bandingkan jawaban AI dengan jawaban Anda sendiri
5. Tanya AI: "Apakah aplikasi ini sudah perlu BACKEND, atau
   cukup FRONTEND + database lokal (localStorage) saja?"
```

### Latihan 3: Gambar Diagram Sendiri (5 menit)

Di kertas atau aplikasi gambar, gambarkan:

```text
┌──────┐    ┌──────────┐    ┌────────┐
│ User │───▶│ Frontend │───▶│ Backend│───▶┐
└──────┘    └──────────┘    └────────┘    │
   ▲                                      ▼
   └──────────(tampilkan)─────────── Database
```

Isi kotak-kotak itu dengan komponen aplikasi ANDA (dari Latihan 2).

---

## ✅ CHECKLIST MODUL 2

```
☐ Hafal 4 komponen: Frontend, Backend, Database, API
☐ Bisa menjelaskan dengan analogi restoran
☐ Paham Next.js = frontend + backend dalam satu proyek
☐ Paham alur User → Frontend → Backend → Database → User
☐ Bisa memetakan aplikasi favorit ke 4 komponen
☐ AI sudah membuatkan peta komponen untuk aplikasi Anda
```

**🎯 Target:** Anda tahu komponen apa saja yang ada di balik sebuah aplikasi.

Jika sudah paham → **Buka `03-struktur-folder-nextjs.md`**
