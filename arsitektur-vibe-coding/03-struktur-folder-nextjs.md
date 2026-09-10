# 📁 Modul 3: Struktur Folder Next.js (App Router)

> **Folder yang rapi = AI mudah bekerja, Anda mudah paham.**
> Waktu: ~40 menit | Level: 🟢 Pemula (dengan bantuan AI untuk setup)

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Membuat proyek Next.js pertama dengan bantuan AI
✅ Fungsi setiap folder: app/, components/, lib/, public/
✅ Bedanya page (halaman) vs layout (kerangka)
✅ Kenapa struktur folder adalah "arsitektur dalam bentuk file"
```

---

## 🧠 3.1 STRUKTUR FOLDER = ARSITEKTUR DALAM BENTUK FILE

Di Modul 1-2, arsitektur Anda masih berupa **denah di kepala**.
Struktur folder adalah **denah yang dipindahkan ke komputer**:

```text
DENAH (di kepala):              STRUKTUR FOLDER (di komputer):
┌──────────────────┐            aplikasi-anda/
│  Ruang makan     │  ───────▶  ├── app/          (halaman & API)
│  Dapur           │            ├── components/   (UI lego)
│  Gudang          │            ├── lib/          (helper & database)
│  ...             │            ├── public/       (gambar statis)
└──────────────────┘            └── package.json  (daftar bahan)
```

> 🎯 **Kenapa penting untuk vibe coding?**
> Kalau folder berantakan, AI bingung "file ini taruh di mana".
> Kalau rapi, Anda bisa bilang ke AI: *"Buat komponen di folder
> components/features/ sesuai pola yang sudah ada"* — dan hasilnya
> konsisten.

---

## 🧠 3.2 MEMBUAT PROYEK NEXT.JS PERTAMA

Jangan hafal perintahnya — minta AI yang menjalankan. Tapi Anda
perlu tahu konsepnya.

### Pilihan A: Minta AI Setup (disarankan untuk pemula)

```text
Saya ingin membuat proyek Next.js baru bernama [nama-proyek]
di folder ini.

1. Jalankan perintah create-next-app dengan konfigurasi:
   - TypeScript: YA
   - App Router: YA
   - ESLint: YA
   - Tailwind CSS: YA (untuk styling mudah)
   - src directory: TIDAK (biar sederhana)
   - import alias: TIDAK (biar sederhana)

2. Setelah jadi, jelaskan satu per satu folder & file yang dibuat,
   dengan analogi sederhana.

3. Lalu jalankan aplikasinya (npm run dev) dan beri tahu saya
   cara membukanya di browser.

Tolong pandu langkah demi langkah, saya pemula.
Jangan langsung menjalankan semua perintah sekaligus tanpa menjelaskan.
```

### Pilihan B: Manual (jika ingin tahu perintahnya)

```bash
# Di terminal, dari folder tempat proyek akan dibuat:
npx create-next-app@latest nama-proyek
# Ikuti pertanyaannya, pilih App Router
cd nama-proyek
npm run dev
# Buka http://localhost:3000 di browser
```

> 💡 **Tips:** Kalau ada error, tempel error-nya ke AI:
> ```text
> Saya menjalankan [perintah] dan dapat error ini:
> [tempel error]
> Jelaskan apa artinya dan apa yang harus saya lakukan.
> ```

---

## 🧠 3.3 PETA FOLDER NEXT.JS

Setelah proyek jadi, ini peta yang perlu Anda kenal:

```text
nama-proyek/
│
├── app/                        ← JANTUNG aplikasi
│   ├── layout.tsx              ← Kerangka semua halaman (header, footer)
│   ├── page.tsx                ← Halaman utama (/)
│   ├── globals.css             ← Gaya global seluruh aplikasi
│   └── api/                    ← BACKEND (dapur) — dibahas Modul 6
│
├── components/                 ← LEGO UI (dibuat manual, belum ada default)
│   ├── ui/                     ← Komponen umum: Tombol, Kartu, Input
│   └── features/               ← Komponen khusus fitur: FormTambah, DaftarItem
│
├── lib/                        ← HELPER (dibuat manual)
│   └── db.ts                   ← Koneksi ke database (Modul 6)
│
├── public/                     ← GAMBAR & file statis
│   └── (logo, foto, dll)
│
├── package.json                ← DAFTAR BAHAN (dependencies)
├── next.config.ts              ← Pengaturan Next.js
├── tsconfig.json               ← Pengaturan TypeScript
└── README.md                   ← Catatan proyek
```

### Analogi Cepat

| Folder | Analogi | Isi |
|--------|---------|-----|
| `app/` | Denah utama restoran | Halaman (ruang makan) + API (dapur) |
| `app/layout.tsx` | Kerangka gedung | Bagian yang SAMA di semua halaman |
| `app/page.tsx` | Satu ruangan | Isi halaman tertentu |
| `components/` | Perabotan standar | Tombol, kartu, form yang dipakai ulang |
| `lib/` | Ruang servis | Helper, koneksi database |
| `public/` | Pajangan di dinding | Gambar, logo |

---

## 🧠 3.4 LAYOUT vs PAGE: PERBEDAAN PENTING

Ini konsep kunci App Router. Dua file ini sering membingungkan pemula:

```text
layout.tsx  = KERANGKA (terlihat di SEMUA halaman)
              ┌────────────────────────────┐
              │  [HEADER - logo & menu]    │ ← di layout
              │                            │
              │  ┌──────────────────────┐  │
              │  │   ISI HALAMAN        │  │ ← di page.tsx
              │  │   (berubah-ubah)     │  │
              │  └──────────────────────┘  │
              │                            │
              │  [FOOTER - copyright]      │ ← di layout
              └────────────────────────────┘

page.tsx     = ISI SATU HALAMAN (berubah sesuai halaman)
              Contoh: halaman utama (/), halaman tentang (/tentang)
```

**Contoh nyata:** Header "SMK Nusantara" dan menu (Beranda, Data Siswa,
Laporan) ada di `layout.tsx` — sekali buat, muncul di semua halaman.
Isi halaman (daftar siswa, form absensi) ada di `page.tsx` masing-masing.

---

## 🧠 3.5 ATURAN SEDERHANA UNTUK PEMULA

Saat minta AI menulis kode, minta AI mengikuti aturan ini:

```text
ATURAN STRUKTUR PROYEK (tempel di prompt apa pun):

1. Halaman → app/ (setiap folder di app/ = 1 alamat URL)
2. Kerangka yang sama di semua halaman → app/layout.tsx
3. Komponen UI yang dipakai ulang → components/
4. Helper / koneksi database → lib/
5. Gambar & file statis → public/
6. Jangan buat file di sembarang tempat
7. Beri tahu AI: "Ikuti struktur yang sudah ada, jangan buat struktur baru"

> 💡 **Catatan Git:** Folder kosong (belum ada file) tidak ikut tersimpan
> di Git. Kalau Anda sudah meng-inisialisasi Git dan mau folder kosong
> tetap ada, buat file kosong bernama `.gitkeep` di dalamnya.
> AI bisa melakukannya untuk Anda.
```

---

## 🤖 3.6 TEMPLATE PROMPT: RAPIKAN / JELASKAN STRUKTUR

### Prompt 1: Jelaskan Struktur yang Sudah Ada

```text
Baca seluruh struktur folder proyek ini (jangan ubah apa pun).

1. Gambarkan pohon folder lengkap
2. Untuk setiap folder penting, jelaskan:
   - Fungsinya apa
   - Isinya apa
   - Analogi sederhananya apa
3. Tunjukkan di mana letak:
   - Halaman utama
   - Komponen UI
   - Tempat menaruh kode database nanti
```

### Prompt 2: Buat Folder yang Belum Ada

```text
Proyek Next.js saya sudah jadi. Sekarang buatkan struktur folder
untuk aplikasi [nama aplikasi]:

- components/ui/        → untuk komponen umum
- components/features/  → untuk komponen khusus fitur
- lib/                  → untuk helper & koneksi database

Buat folder-nya, lalu buatkan 1 file contoh isi di masing-masing
(dengan komentar penjelasan) supaya saya paham polanya.
```

---

## 🏗️ 3.7 PRAKTIK

### Latihan 1: Setup Proyek (30 menit)

```text
1. Buat folder baru di komputer Anda (misal: D:\belajar\aplikasi-belanja)
2. Buka terminal di folder itu
3. Jalankan Prompt 3.2 (Pilihan A) di Claude Code / OpenCode
4. Ikuti langkah AI sampai aplikasi berjalan di browser
5. Buka http://localhost:3000 — seharusnya muncul halaman Next.js
```

### Latihan 2: Jelajahi (10 menit)

```text
1. Buka file app/page.tsx — ini halaman yang Anda lihat di browser
2. Ubah teksnya dengan bantuan AI:
   "Ubah teks di halaman utama menjadi 'Aplikasi Belanja Saya'
    dan tambahkan satu kalimat deskripsi singkat."
3. Lihat perubahan di browser (harusnya otomatis ter-refresh)
4. Buka app/layout.tsx — lihat header & footer
```

### Latihan 3: Strukturkan dengan AI (15 menit)

```text
Jalankan Prompt 3.6 bagian 2 (buat folder components/ dan lib/).

Setelah jadi, tanya AI:
"Jelaskan dengan analogi restoran: apa peran folder
app/, components/, lib/ di proyek ini?"
```

---

## ✅ CHECKLIST MODUL 3

```
☐ Proyek Next.js pertama berhasil dibuat & jalan di browser
☐ Paham fungsi app/ (halaman+API), components/ (UI), lib/ (helper), public/ (gambar)
☐ Paham beda layout.tsx (kerangka) dan page.tsx (isi halaman)
☐ Bisa ubah teks halaman dengan bantuan AI
☐ Folder components/ dan lib/ sudah dibuat
☐ Bisa jelaskan struktur proyek dengan analogi restoran
```

**🎯 Target:** Struktur folder proyek Anda rapi dan Anda tahu isi tiap folder.

Jika sudah paham → **Buka `04-komponen-dan-props.md`**
