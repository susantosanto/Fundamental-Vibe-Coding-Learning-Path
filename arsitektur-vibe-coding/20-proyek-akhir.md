# 🏆 Modul 20: Proyek Akhir — Bangun Aplikasi dari Nol dengan Loop Engineering

> **Ujian terakhir: gabungkan SEMUA yang Anda pelajari — arsitektur, tech stack, database, networking, VPS, loop engineering — dalam satu proyek utuh.**
> Waktu: ~6-8 jam (bagi 3-4 sesi) | Level: 🔴 Mahir | Prasyarat: Modul 1-19

---

## 📖 APA YANG AKAN KAMU BANGUN

Pilih **satu** dari 3 proyek berikut (atau ide Anda sendiri):

| # | Proyek | Fitur Inti | Tech Stack yang Terpakai |
|---|--------|-----------|--------------------------|
| 1 | **Perpustakaan Sekolah** | CRUD buku, pinjam/kembali, dashboard | Next.js + SQLite → PostgreSQL |
| 2 | **Absensi Digital** | Daftar siswa, absen harian, rekap bulanan | Next.js + Prisma + PostgreSQL |
| 3 | **Kas Kelas / BOS** | Catat pemasukan/pengeluaran, laporan | Laravel + SQLite/PostgreSQL |

> 🎯 **Pilih yang PALING berguna untuk Anda.** Proyek yang
> bermanfaat nyata → lebih semangat menyelesaikan.

---

## 🧠 20.1 STRATEGI KERJA: LOOP ENGINEERING PENUH

```text
Ini proyek Anda sendiri. Anda harus MEMIMPIN loop-nya:

FASE 1: Brainstorming    (30 menit)  → ide & kebutuhan
FASE 2: Planning         (30 menit)  → task list MUST/SHOULD/NICE
FASE 3: PRD              (45 menit)  → spesifikasi lengkap
FASE 4: Desain UI        (45 menit)  → wireframe + deskripsi
FASE 5: Implementasi     (3-4 jam)   → per task, tes tiap langkah
FASE 6: Testing          (45 menit)  → checklist + perbaikan
BONUS:  Deploy ke VPS    (2-3 jam)   → online! (Modul 18)
```

**Aturan emas yang TIDAK BOLEH dilanggar:**

```text
✅ Tiap fase: jelaskan → setujui → kerjakan
✅ Satu task → tes → lanjut
✅ JANGAN minta semua kode dalam 1 prompt raksasa
✅ JANGAN lompat ke kode sebelum PRD & desain disetujui
❌ Minta AI langsung menulis SEMUA file → SPAGHETTI
```

---

## 🧠 20.2 DENAH PROYEK: PERPUSTAKAAN SEKOLAH (contoh lengkap)

> Ini contoh untuk proyek #1. Pola yang sama berlaku untuk #2 dan #3.

### FUNGSI (MUST HAVE)

```text
1. CRUD buku (tambah, lihat, ubah, hapus)
2. Cari buku berdasarkan judul
3. Pinjam buku (stok -1) & kembalikan (stok +1)
4. Dashboard: total buku, total stok, buku dipinjam
5. Validasi: stok habis → tidak bisa dipinjam
```

### SHOULD / NICE (TUNDA DULU)

```text
☐ Login & role (pustakawan/siswa)     → SHOULD
☐ Laporan Excel                       → NICE
☐ Foto sampul buku                    → NICE
☐ Halaman detail buku                 → SHOULD
```

### DATA (ENTITAS)

```text
Buku        → id, judul, penulis, kategori, stok
Peminjaman  → id, bukuId, namaPeminjam, tanggalPinjam,
              tanggalKembali (null = masih dipinjam)
```

### ALUR

```text
INPUT:  isi form tambah buku → klik "Simpan"
PROSES: POST /api/buku → validasi → simpan ke database
OUTPUT: daftar buku ter-update di dashboard

INPUT:  klik "Pinjam" pada buku → isi nama peminjam
PROSES: cek stok > 0 → stok -1 → buat record peminjaman
OUTPUT: stok berkurang, buku masuk daftar "sedang dipinjam"
```

---

## 🧠 20.3 STRUKTUR FOLDER PROYEK

```text
proyek-perpustakaan/
├── app/
│   ├── layout.tsx            ← kerangka (header, footer)
│   ├── page.tsx              ← dashboard utama
│   ├── globals.css
│   └── api/
│       ├── buku/route.ts         ← GET (semua) + POST (tambah)
│       ├── buku/[id]/route.ts    ← PATCH (ubah) + DELETE (hapus)
│       └── peminjaman/route.ts   ← POST (pinjam) + PATCH (kembalikan)
│           (kata benda jamak, sesuai konvensi REST Modul 17)
├── components/
│   ├── ui/                   ← Tombol, Kartu, Input (dari Modul 4)
│   └── features/
│       ├── DashboardCards.tsx
│       ├── FormTambahBuku.tsx
│       ├── TabelBuku.tsx
│       └── FormPinjamBuku.tsx
├── lib/
│   └── db.ts                 ← koneksi database (Prisma)
├── prisma/
│   └── schema.prisma         ← model Buku & Peminjaman
└── .env                      ← DATABASE_URL (rahasia!)
```

> 💡 **Ini struktur yang Anda pelajari di Modul 3** — sekarang
> Anda yang mendesainnya sendiri untuk proyek Anda!

---

## 🤖 20.4 PROMPT PER FASE (copy-paste ke CLI)

### Prompt Fase 1-2: Brainstorming + Planning

```text
Kita mulai proyek akhir: [nama aplikasi].

FASE 1 — BRAINSTORMING:
Saya punya ide awal: [deskripsi singkat].
1. Usulkan 5 pertanyaan penting yang harus saya jawab dulu
   (masalah, pengguna, keunikan)
2. Bantu saya mengerucutkan ruang lingkup

FASE 2 — PLANNING:
Berdasarkan jawaban saya, buat:
1. Task list: | # | Task | Prioritas MUST/SHOULD/NICE |
2. Urutan kerja yang paling sederhana dulu
3. Rekomendasi tech stack dari yang saya sudah kuasai:
   [Next.js/Express/Laravel] + [SQLite/PostgreSQL] + [Prisma]

JANGAN menulis kode. Fokus rencana.
```

### Prompt Fase 3: PRD

```text
Buatkan PRD untuk [nama aplikasi] berdasarkan ini:

FITUR (dari planning): [tempel]
PENGGUNA: [siapa]

Ikuti struktur:
1. Latar belakang
2. Tujuan & metrik sukses
3. Pengguna
4. Fitur (user stories)
5. Data/entitas + contoh 3-5 data dummy Indonesia
6. Alur per fitur (INPUT → PROSES → OUTPUT)
7. Out of scope (yang ditunda)

Jangan kode. PRD saja. Setelah selesai, ajukan 3 pertanyaan
untuk menguji kelengkapan saya.
```

### Prompt Fase 4: Desain UI

```text
Desain UI untuk [nama aplikasi] — JANGAN kode.

1. Wireframe ASCII untuk halaman: [dashboard, form tambah,
   daftar buku, detail]
2. Untuk tiap halaman: elemen apa saja, urutan visual
3. Saran: warna (konsisten untuk aplikasi [sekolah/modern]),
   font, tata letak

Setelah saya setujui, buatkan mockup HTML (tanpa logika) agar
saya bisa melihat desainnya di browser.
```

### Prompt Fase 5: Implementasi (per task!)

```text
TASK [#]: [nama task dari planning]

Berdasarkan PRD & desain yang sudah disetujui, kerjakan task ini:

SPESIFIKASI:
[detail task — mis. "Buat API CRUD buku dengan Prisma"]

ATURAN:
- Denah dulu: jelaskan rencana singkat → saya setujui → tulis kode
- Satu komponen/file satu tugas
- Format respons: { sukses, data } / { sukses, pesan }
- Status code benar (200, 201, 400, 404, 500)
- Setelah selesai: beri cara menguji task ini

JANGAN lanjut ke task lain sebelum task ini selesai & teruji.
```

### Prompt Fase 6: Testing

```text
Buatkan rencana testing untuk [nama aplikasi] berdasarkan PRD:

1. CHECKLIST MANUAL: langkah demi langkah yang harus saya
   coba di browser (setiap fitur dari PRD)
2. UNIT TEST: untuk logika penting ([mis. cek stok sebelum pinjam])
3. INTEGRATION TEST: untuk API [endpoint]

Jangan tulis semua sekaligus. Bagian 1 dulu, saya kerjakan,
lalu bagian 2, dst.
```

### Prompt Bonus: Deploy

```text
Aplikasi [nama] saya selesai & sudah di GitHub: [URL]

Pandu saya deploy ke VPS:
1. Pull di server
2. Install deps + build
3. PM2 / artisan
4. Nginx + domain
5. SSL Let's Encrypt

Langkah demi langkah, jelaskan tiap perintah.
(Lihat Modul 18 jika perlu.)
```

---

## 🏗️ 20.5 JADWAL KERJA (4 SESI)

### Sesi 1 (2 jam): Fondasi
```text
☐ Fase 1: Brainstorming (pilih proyek & ruang lingkup)
☐ Fase 2: Planning (task list & tech stack)
☐ Fase 3: PRD (dokumen lengkap)
```

### Sesi 2 (2 jam): Desain & Setup
```text
☐ Fase 4: Desain UI (wireframe + mockup disetujui)
☐ Setup proyek (create-next-app / composer create-project)
☐ Setup database (Prisma + SQLite untuk mulai)
☐ Task 1: struktur folder & koneksi db → TES ✅
```

### Sesi 3 (2-3 jam): Implementasi Inti
```text
☐ Task 2: API CRUD entitas utama → TES ✅
☐ Task 3: API fitur kedua (pinjam/kembali) → TES ✅
☐ Task 4: Halaman dashboard + form → TES ✅
☐ Task 5: Hubungkan frontend ↔ API → TES ✅
```

### Sesi 4 (2 jam): Testing & Polish
```text
☐ Fase 6: Checklist manual test (semua fitur!)
☐ Perbaiki bug yang ditemukan (LOOP kembali ke fase 5!)
☐ Review arsitektur akhir (Modul 7 prompt)
☐ (Bonus) Deploy ke VPS → ONLINE 🎉
```

---

## 🧠 20.6 KETIKA MENGALAMI MASALAH (TROUBLESHOOT)

| Gejala | Kemungkinan Penyebab | Solusi |
|--------|----------------------|--------|
| Data hilang saat refresh | Masih array memori | Pindah ke database (Prisma) |
| API error 500 | Bug di handler | Baca log, tempel ke AI |
| Stok bisa minus | Tidak ada validasi | Cek stok sebelum pinjam |
| Desain berantakan | Tidak ada desain UI dulu | Kembali ke fase 4 |
| Proyek makin rumit | Fitur NICE dikerjakan terlalu awal | Tunda! Fokus MUST |
| Tidak tahu lanjut apa | Planning tidak jelas | Review task list & PRD |

> 💡 **Aturan: kapan pun bingung → buka dokumen yang sudah
> dibuat (PRD, planning, desain).** Itulah gunanya loop engineering!

---

## ✅ 20.7 CHECKLIST FINAL PROYEK

```text
☐ PRD lengkap (latar belakang, fitur, data, alur, out of scope)
☐ Desain UI disetujui sebelum kode
☐ Database terhubung (SQLite untuk awal / PostgreSQL produksi)
☐ API CRUD lengkap + validasi
☐ Fitur utama (pinjam/kembali, dsb.) berfungsi
☐ Frontend menampilkan data dari API
☐ Error handling & status code benar
☐ Checklist manual test dijalankan & bug diperbaiki
☐ Arsitektur di-review (Modul 7)
☐ (Bonus) Aplikasi online di VPS dengan HTTPS

SELAMAT! 🎉
```

---

## 🧠 20.8 REFLEKSI AKHIR (15 menit)

Jawab jujur:

```text
1. Fase loop mana yang paling berharga? Kenapa?
2. Apa yang PALING sulit? Apa yang Anda pelajari darinya?
3. Fitur apa yang ingin Anda tambahkan berikutnya?
   (tulis di "backlog" untuk proyek versi 2)
4. Tech stack mana yang ingin Anda perdalam?
5. Apa proyek berikutnya? (loop lagi!)
```

---

## 🎉 SELAMAT — ANDA LULUS ARSITEKTUR VIBE CODING!

```text
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   YANG ANDA KUASAI SEKARANG:                            │
│                                                         │
│   🏠 Arsitektur & 4 komponen aplikasi web               │
│   ⚛️ ReactJS — komponen, hooks, state                   │
│   🟩 NodeJS — server, Express, REST API                 │
│   ▲ NextJS — full-stack, server/client components       │
│   🐘 Laravel — PHP, MVC, Blade, Eloquent                │
│   🗃️ SQLite → PostgreSQL — dari belajar ke produksi     │
│   🌐 Networking — IP, port, DNS, HTTP/HTTPS             │
│   🔌 API — REST, JSON, autentikasi JWT, CORS            │
│   🖥️ VPS — SSH, Nginx, PM2, SSL, deploy                │
│   🔁 Loop Engineering — brainstorming → ... → testing   │
│   🤖 Prompting — cara bicara dengan AI yang benar       │
│                                                         │
│   INGAT:                                                │
│   🎯 Anda arsiteknya. AI tukangnya.                     │
│   🔁 Semua adalah loop: tes, perbaiki, ulangi.          │
│   📚 Lanjutkan dengan proyek baru & terus belajar!      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**📂 Lanjut ke: `21-prompting-engineering.md`** untuk memastikan
dasar prompting Anda kuat, lalu buka `cheat-sheet-prompt.md`!
