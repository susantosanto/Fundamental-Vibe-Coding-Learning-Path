# 🎯 FASE 5: Membangun Aplikasi HTML/CSS/JS

> **Bikin aplikasi nyata step-by-step — dari prompt sampai jadi**
> Waktu: ~75 menit | Level: 🟡 Menengah Pemula

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Membangun 3 project nyata (progressive complexity)
✅ Project 1: Kalkulator (10 baris JS)
✅ Project 2: Catatan App (30 baris JS)
✅ Project 3: Pengelola Tugas (50 baris JS)
✅ Setiap project: Prompt → Desain → Kode → Review
✅ Cara testing aplikasi di browser
```

---

## 🧠 5.1 PROJECT 1: KALKULATOR SEDERHANA

### Hasil Akhir:

```
┌─────────────────────────┐
│   KALKULATOR            │
│                         │
│   [5] [+] [3]           │
│                         │
│   ┌─────────────────┐   │
│   │       8          │   │
│   └─────────────────┘   │
│                         │
│   [HITUNG]              │
└─────────────────────────┘
```

### Step 1: Prompt ke AI

Copy-paste prompt ini ke AI:

```text
Kamu adalah developer JavaScript yang ramah untuk pemula.

Buatkan halaman HTML kalkulator sederhana dengan:
- 2 input angka
- 1 dropdown operator (+, -, ×, ÷)
- 1 tombol "Hitung"
- 1 area untuk menampilkan hasil

Desain:
- Background putih bersih
- Tombol biru (#4A90D9)
- Font Arial
- Semua di tengah halaman
- Ukuran font hasil lebih besar (24px)

Struktur dalam 1 file HTML (inline CSS dan JS).
Function JS terpisah: ambilInput(), hitung(angka1, angka2, operator), tampilkanHasil(hasil)
```

### Step 2: Simpan Hasilnya

1. Copy kode yang dikasih AI
2. Buat file baru: `proyek/01-kalkulator/index.html`
3. Paste kodenya
4. Buka di browser (double click file)

### Step 3: Review & Modifikasi

Setelah aplikasi jalan, coba prompt ini untuk perbaikan:

```text
Kalkulator yang kamu buat sebelumnya sudah jalan.
Sekarang tambahkan:
1. Validasi: kalau input kosong atau bukan angka, tampilkan "Masukkan angka valid!"
2. Tambah border dan shadow halus di kotak kalkulator
3. Tambah animasi tombol saat diklik (sedikit membesar lalu kembali)
```

### Step 4: Debug (Kalau Ada Error)

Kalau ada error, copy paste error message ke AI:

```text
Kode kalkulator saya error. Ini pesan errornya:
[paste error message]

Ini kode saya:
[paste kode]

Tolong bantu cari masalahnya dan perbaiki.
```

---

## 🧠 5.2 PROJECT 2: APLIKASI CATATAN

### Hasil Akhir:

```
┌──────────────────────────────────────┐
│  📝 CATATAN SAYA                     │
│                                      │
│  [Tulis catatan di sini...]          │
│  [TAMBAH CATATAN]                    │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Belajar JavaScript hari ini    │ ×│
│  │ 12 Jan 2024 - 14:30            │  │
│  ├────────────────────────────────┤  │
│  │ Beli bahan masakan            │ ×│
│  │ 12 Jan 2024 - 10:15            │  │
│  └────────────────────────────────┘  │
│                                      │
│  Total: 2 catatan                    │
└──────────────────────────────────────┘
```

### Step 1: Prompt ke AI

```text
Kamu adalah developer JavaScript yang ramah untuk pemula.

Buatkan aplikasi catatan sederhana dengan fitur:
1. Input teks untuk menulis catatan
2. Tombol "Tambah Catatan"
3. Daftar catatan yang sudah ditambahkan
4. Setiap catatan bisa dihapus dengan tombol ×
5. Tampilkan tanggal & jam saat catatan dibuat
6. Tampilkan total jumlah catatan

Desain:
- Modern, bersih, putih + aksen biru (#4A90D9)
- Kartu catatan dengan shadow ringan
- Hover effect di tombol hapus (merah saat hover)
- Responsif (bisa dipake di HP)

Struktur dalam 1 file HTML (inline CSS dan JS).
Function di JS:
1. tambahCatatan(teks) → tambah catatan baru
2. hapusCatatan(id) → hapus catatan berdasarkan id
3. renderCatatan() → tampilkan semua catatan
4. updateTotal() → update jumlah catatan
```

### Step 2: Simpan & Running

1. Simpan di: `proyek/02-catatan/index.html`
2. Buka di browser

### Step 3: Tambah Fitur dengan Iterative Refinement

Setelah jalan, coba:

```text
Aplikasi catatan sudah bagus! Sekarang tambah:
1. Simpan catatan ke localStorage (biar gak hilang saat refresh)
2. Fitur edit: klik teks catatan bisa diedit
3. Animasi: catatan baru muncul dengan fade-in
4. Filter: tombol "Semua", "Hari ini", "Kemarin"
```

---

## 🧠 5.3 PROJECT 3: PENGELOLA TUGAS (TODO LIST)

### Hasil Akhir:

```
┌──────────────────────────────────────────┐
│  ✅ PENGELOLA TUGAS                       │
│                                           │
│  Total: 5  |  Selesai: 3  |  Sisa: 2    │
│                                           │
│  [Tambah tugas baru...]      [TAMBAH]     │
│                                           │
│  ☐ Belajar JavaScript          [Hapus]   │
│  ☑ Bahan masakan              [Hapus]   │
│  ☐ Olahraga 30 menit          [Hapus]   │
│                                           │
│  Filter: [Semua] [Aktif] [Selesai]       │
│                                           │
│  [HAPUS SEMUA SELESAI]                    │
└──────────────────────────────────────────┘
```

### Step 1: Prompt ke AI

Prompt ini lebih detail karena aplikasinya lebih kompleks:

```text
Kamu adalah developer JavaScript senior yang jago buat aplikasi web.

Buatkan aplikasi Todo List lengkap dengan fitur:

📋 FITUR UTAMA:
1. Tambah tugas (input + tombol "Tambah")
2. Tandai selesai/tidak selesai (checkbox)
3. Hapus tugas (tombol "Hapus")
4. Filter tampilan: Semua / Aktif / Selesai
5. Hapus semua tugas yang sudah selesai
6. Tampilkan statistik: Total, Selesai, Sisa
7. Simpan ke localStorage

🎨 DESAIN:
- Warna: putih, hijau (#2ECC71 untuk selesai), oranye (#E67E22 untuk aktif)
- Setiap tugas: card dengan shadow
- Tugas selesai: teks dicoret, warna abu-abu
- Animasi: fade-in saat tambah, slide-out saat hapus
- Responsif (mobile-friendly)
- Font: system fonts

📁 STRUKTUR KODE:
Simpan dalam 1 file HTML dengan:
1. HTML: struktur halaman
2. CSS: styling (min 50 baris)
3. JS: function terpisah untuk setiap fitur

Function JS:
- tambahTugas(teks) 
- hapusTugas(id)
- toggleTugas(id)  (selesai/ belum)
- filterTugas(status)  (semua/aktif/selesai)
- hapusSemuaSelesai()
- renderTugas()
- updateStatistik()
- simpanData()
- muatData()

ALUR:
INPUT: user ketik tugas → klik Tambah
PROSES: simpan ke array → simpan ke localStorage → render ulang
OUTPUT: tugas muncul di daftar dengan checkbox & tombol hapus
```

### Step 2: Simpan

1. Simpan di: `proyek/03-pengelola-tugas/index.html`
2. Buka di browser

### Step 3: Prompt Refinement

Setelah aplikasi jalan:

```text
Aplikasi todo list sudah bagus! Sekarang tambah:
1. Tugas prioritas: tambah level prioritas (biasa/penting/sangat penting) 
   dengan warna berbeda
2. Drag and drop: tugas bisa diurutkan dengan drag
3. Deadlines: bisa tambah deadline tanggal, yang lewat warnanya merah
4. Progress bar: tampilkan persentase penyelesaian
```

---

## 🧠 5.4 POLA UMUM PROMPT UNTUK APLIKASI

Dari 3 project di atas, kita bisa lihat **pola prompt** yang selalu berhasil:

### Template Universal untuk Prompt Aplikasi:

```text
Kamu adalah [PERAN] yang [SPESIALISASI].

Buatkan [JENIS APLIKASI] dengan:

📋 FITUR:
• Fitur 1: [deskripsi]
• Fitur 2: [deskripsi]
• Fitur 3: [deskripsi]

🎨 DESAIN:
• Warna: [warna utama]
• Style: [modern/sederhana/elegan]
• Efek: [animasi/hover/shadow]
• Responsif: [ya/tidak]

📁 STRUKTUR:
• 1 file HTML (inline CSS + JS) atau file terpisah

⚡ FUNCTION JS (masing-masing 1 tugas):
- [namaFunction1] → [tugas]
- [namaFunction2] → [tugas]
- [namaFunction3] → [tugas]

📋 ALUR:
INPUT: [apa yang user lakukan]
PROSES: [apa yang dilakukan JS]
OUTPUT: [apa yang muncul di layar]
```

---

## 🧠 5.5 LATIHAN FASE 5

### LATIHAN 1: Project Mini (25 menit)

Pilih salah satu project di bawah, lalu:

1. **Buat prompt** dengan template di atas
2. **Minta AI** bikin kodenya
3. **Simpan** di folder `proyek/`
4. **Tes** di browser
5. **Perbaiki** dengan iterative refinement

**Pilihan Project:**

```text
A. KONVERSI SUHU
   - Input suhu + pilih Celcius/Fahrenheit
   - Klik konversi
   - Output hasil konversi

B. TIMER / STOPWATCH
   - Tombol Start, Stop, Reset
   - Tampilkan waktu: MM:SS:ms
   - Counter berjalan setiap 10ms

C. DAFTAR BELANJA
   - Tambah item (nama + harga)
   - Lihat total harga
   - Hapus item
   - Simpan ke localStorage
```

### LATIHAN 2: Review & Refactor (15 menit)

Ambil salah satu project yang sudah kamu buat, lalu prompt:

```text
Review kode aplikasi [nama] yang sudah kamu buat sebelumnya.
Periksa:
1. Apakah ada bug?
2. Apakah function sudah punya 1 tanggung jawab?
3. Apakah ada kode yang bisa disederhanakan?
4. Apakah best practices sudah diikuti?

Kasih saran perbaikan spesifik.
```

---

## 🧠 5.6 RANGKUMAN FASE 5

### Yang Udah Kamu Pelajari:

| Project | Baris JS | Konsep Baru |
|---------|----------|-------------|
| **Kalkulator** | ~10 baris | Input → Proses → Output |
| **Catatan** | ~30 baris | Array, render, delete |
| **Todo List** | ~50 baris | Filter, localStorage, statistik |

### Checklist:

```
☐ Project 1 (Kalkulator) selesai & jalan
☐ Project 2 (Catatan) selesai & jalan  
☐ Project 3 (Todo List) selesai & jalan
☐ Bisa bikin prompt untuk aplikasi sederhana
☐ Bisa review & minta perbaikan
☐ Udah coba LATIHAN 1-2
```

### Sebelum Lanjut:

```text
🎯 TARGET: Kamu bisa membuat 3 aplikasi web sederhana 
          dengan bantuan AI, dari prompt sampai jadi.

Jika masih bingung:
- Ulangi Project 1 (paling dasar)
- Fokus paham alur Input → Proses → Output
- Jangan skip bagian review & perbaikan

Jika sudah paham:
→ Buka fase-06-aplikasi-semi-kompleks.md
```

---

**📂 Lanjut ke: `fase-06-aplikasi-semi-kompleks.md`**
