# 🎯 FASE 4: Logika & Arsitektur Sederhana

> **Mulai berpikir seperti arsitek aplikasi — tanpa istilah rumit**
> Waktu: ~55 menit | Level: 🟢🟡 Pemula → Intermediate

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Apa itu "arsitektur aplikasi" (dengan analogi)
✅ Pemisahan: HTML (struktur) + CSS (tampilan) + JS (logika)
✅ Flow aplikasi: Input → Proses → Output
✅ Pola sederhana: Function = unit kerja kecil
✅ Cara prompt AI untuk desain arsitektur
```

---

## 🧠 4.1 APA ITU ARSITEKTUR APLIKASI?

### Analogi: Bangun Rumah

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ARSITEKTUR APLIKASI = ARSITEKTUR RUMAH                │
│                                                         │
│  RUMAH:                        APLIKASI WEB:            │
│  ├── Pondasi                   ├── HTML (struktur)      │
│  ├── Tembok & Atap             ├── CSS (tampilan)       │
│  ├── Listrik & Pipa            ├── JavaScript (logika)  │
│  └── Denah (blueprint)         └── Arsitektur (denah)   │
│                                                         │
│  Arsitek bikin denah DULU                               │
│  baru tukang bangun.                                    │
│  SAMA: Prompt arsitektur DULU                           │
│  baru AI nulis kode.                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Kenapa Arsitektur Penting?

```text
❌ TANPA ARSITEKTUR:
"Buatkan aplikasi catatan."
→ AI bingung: gimana strukturnya?
→ Kode jadi berantakan
→ Sulit ditambah fitur baru

✅ DENGAN ARSITEKTUR:
"Buatkan aplikasi catatan dengan struktur:
- Satu file HTML untuk struktur
- Satu file CSS untuk styling
- Satu file JS untuk logika
- Fitur: tambah, edit, hapus, simpan"
→ AI paham strukturnya
→ Kode rapi dan teratur
→ Mudah ditambah fitur
```

### Prinsip Utama: PISAHKAN TANGGUNG JAWAB

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  📄 HTML (Struktur)                                     │
│  Kerangka halaman: judul, tombol, input, daftar         │
│  "APA yang ada di halaman"                              │
│                                                         │
│  🎨 CSS (Tampilan)                                      │
│  Dekorasi: warna, ukuran, jarak, animasi                │
│  "BAGAIMANA tampilannya"                                │
│                                                         │
│  ⚡ JavaScript (Logika)                                  │
│  Fungsi: klik tombol, simpan data, hitung               │
│  "BAGAIMANA interaksinya"                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🧠 4.2 FLOW APLIKASI: INPUT → PROSES → OUTPUT

### Pola Paling Dasar:

Setiap aplikasi web mengikuti pola ini:

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│   INPUT  │ ──→ │  PROSES  │ ──→ │  OUTPUT  │
│          │     │          │     │          │
│ User     │     │ Kode JS  │     │ Tampilan │
│ klik/isi │     │ ngitung  │     │ di layar │
└──────────┘     └──────────┘     └──────────┘
```

### Contoh Sederhana: Kalkulator

```text
┌──────────┐     ┌──────────┐     ┌──────────┐
│  INPUT   │     │  PROSES  │     │  OUTPUT  │
│          │     │          │     │          │
│ User isi │ ──→ │ JS       │ ──→ │ Hasil    │
│ angka    │     │ jumlahkan│     │ ditampil-│
│ 5 dan 3  │     │ 5 + 3 = 8│     │ kan: "8" │
└──────────┘     └──────────┘     └──────────┘
```

### Cara Menerapkan di Prompt:

```text
"Saya mau bikin kalkulator dengan alur:
INPUT: 2 input angka + tombol +
PROSES: JavaScript jumlahkan kedua angka
OUTPUT: Hasil ditampilkan di layar

Bantu buatkan dengan HTML/CSS/JS."
```

---

## 🧠 4.3 POLA SEDERHANA: FUNCTION = UNIT KERJA

### Satu Function, Satu Tugas

Ini prinsip paling penting dalam arsitektur:

```javascript
// ❌ SATU FUNCTION NGURUSIN SEMUA:
function handleAplikasi() {
  // Ambil data...
  // Validasi...
  // Hitung...
  // Simpan...
  // Tampilkan ulang...
}
// → Susah dibaca, susah diperbaiki
```

```javascript
// ✅ PISAH KE BEBERAPA FUNCTION KECIL:
function ambilData() { ... }        // 1 tugas
function validasiInput(data) { ... }  // 1 tugas
function hitungTotal(items) { ... }   // 1 tugas
function simpanData(data) { ... }     // 1 tugas
function tampilkanHasil() { ... }     // 1 tugas
// → Gampang dibaca, gampang diperbaiki
```

### Visualisasi:

```text
[handleAplikasi] → SATU FUNCTION BESAR
  ├── ambil data
  ├── validasi
  ├── hitung
  ├── simpan
  └── tampilkan
  KALAU ERROR, SUSAH NYARI DIMANA!

[ambilData] → [validasiInput] → [hitungTotal] → [simpanData]
                                                      ↓
                                             [tampilkanHasil]
  KALAU ERROR, LANGSUNG TAHU DI FUNCTION MANA!
```

### Cara Prompt ke AI:

```text
"Buatkan aplikasi catatan dengan function terpisah:
1. tambahCatatan(teks) → menambah catatan baru
2. hapusCatatan(id) → menghapus catatan berdasarkan id
3. editCatatan(id, teksBaru) → mengedit catatan
4. simpanCatatan() → menyimpan ke localStorage
5. tampilkanCatatan() → menampilkan semua catatan

Setiap function hanya mengerjakan SATU tugas."
```

---

## 🧠 4.4 STRUKTUR FOLDER SEDERHANA

### Untuk Aplikasi Web Sederhana:

```
┌─────────────────────────────────────────────┐
│  aplikasi-saya/                              │
│  ├── index.html    ← Halaman utama           │
│  ├── style.css     ← Semua styling           │
│  └── app.js        ← Semua logika            │
│                                              │
│  CUKUP 3 FILE! Jangan lebih dulu.            │
└─────────────────────────────────────────────┘
```

### Untuk Aplikasi yang Lebih Besar:

```
┌─────────────────────────────────────────────┐
│  aplikasi-saya/                              │
│  ├── index.html                              │
│  ├── css/                                    │
│  │   └── style.css                           │
│  ├── js/                                     │
│  │   ├── app.js        ← Main logic          │
│  │   ├── data.js       ← Data & storage      │
│  │   └── utils.js      ← Helper functions    │
│  └── assets/                                 │
│      └── images/                             │
└─────────────────────────────────────────────┘
```

---

## 🧠 4.5 CARA PROMPT ARSITEKTUR KE AI

### Template Arsitektur Sederhana:

```text
Saya ingin membuat aplikasi [NAMA APLIKASI].

DESKRIPSI SINGKAT:
[2-3 kalimat tentang aplikasi]

FITUR:
• Fitur 1
• Fitur 2
• Fitur 3

STRUKTUR:
• index.html → struktur halaman
• style.css → styling (warna biru/putih, modern)
• app.js → logika dengan function terpisah per fitur

ALUR:
INPUT: [apa yang user lakukan]
PROSES: [apa yang terjadi di kode]
OUTPUT: [apa yang user lihat]

Tolong buatkan kode lengkap dengan struktur di atas.
Setiap function di JS hanya mengerjakan SATU tugas.
```

### Contoh Nyata:

```text
Saya ingin membuat aplikasi daftar tugas (todo list).

DESKRIPSI:
Aplikasi untuk mencatat tugas harian. Bisa tambah, 
centang selesai, dan hapus tugas.

FITUR:
• Tambah tugas baru
• Centang tugas selesai (coret teksnya)
• Hapus tugas
• Tampilkan jumlah tugas yang belum selesai

STRUKTUR:
• index.html → struktur
• style.css → tampilan bersih, modern
• app.js → logika dengan function terpisah

ALUR:
INPUT: user ketik tugas → klik "Tambah"
PROSES: JS simpan ke array → render ulang daftar
OUTPUT: Tugas muncul di daftar dengan tombol centang & hapus

Buatkan kode lengkapnya.
```

---

## 🧠 4.6 LATIHAN FASE 4

### LATIHAN 1: Identifikasi Flow (10 menit)

Untuk setiap aplikasi di bawah, sebutkan INPUT, PROSES, OUTPUT:

```text
APLIKASI A: Kalkulator Diskon
- User memasukkan harga dan persen diskon
- Klik tombol "Hitung"
- Muncul harga setelah diskon

INPUT: ???
PROSES: ???
OUTPUT: ???

APLIKASI B: Konversi Suhu
- User pilih: Celcius → Fahrenheit atau sebaliknya
- Masukkan angka suhu
- Klik "Konversi"
- Muncul hasil konversi

INPUT: ???
PROSES: ???
OUTPUT: ???
```

<details>
<summary>🔍 Jawaban</summary>

A: Input(harga, persen) → Proses(harga - (harga × persen/100)) → Output(harga akhir)
B: Input(suhu, jenis konversi) → Proses(rumus C ke F atau F ke C) → Output(suhu hasil)
</details>

---

### LATIHAN 2: Desain Arsitektur (15 menit)

Bayangkan kamu mau bikin **aplikasi catatan belanja**:

```text
FITUR:
1. Tambah item belanja (nama + harga)
2. Lihat daftar belanja
3. Hapus item
4. Lihat total harga

TUGAS:
1. Tulis INPUT, PROSES, OUTPUT untuk setiap fitur
2. Tentukan function apa saja yang diperlukan
3. Buat prompt ke AI untuk bikin aplikasi ini
```

**Coba prompt kamu ke AI dan lihat hasilnya!**

---

### LATIHAN 3: Refactor dengan Prompt (15 menit)

Prompt ini ke AI:

```text
"Berikut kode untuk kalkulator sederhana. 
Sekarang pecah function-nya menjadi function yang lebih kecil,
masing-masing hanya mengerjakan SATU tugas:

[Copy kode kalkulator dari hasil Latihan 2 Fase 3]

Function yang harus ada:
1. ambilInput() → mengambil angka dari input field
2. hitung(angka1, angka2, operator) → melakukan perhitungan
3. tampilkanHasil(hasil) → menampilkan hasil ke layar
4. validasiInput(angka1, angka2) → cek apakah input valid"
```

---

## 🧠 4.7 RANGKUMAN FASE 4

### Yang Udah Kamu Pelajari:

| Konsep | Intinya |
|--------|---------|
| **Arsitektur** | Denah aplikasi sebelum coding |
| **Pemisahan** | HTML (struktur), CSS (tampilan), JS (logika) |
| **Input → Proses → Output** | Flow dasar semua aplikasi |
| **1 function = 1 tugas** | Prinsip kode bersih |
| **Struktur folder** | Atur file dengan rapi |

### Checklist:

```
☐ Paham analogi arsitektur aplikasi = arsitektur rumah
☐ Bisa bedain tugas HTML, CSS, JavaScript
☐ Paham flow Input → Proses → Output
☐ Bisa bikin function dengan 1 tanggung jawab
☐ Bisa bikin prompt arsitektur ke AI
☐ Udah coba LATIHAN 1-3
```

### Sebelum Lanjut:

```text
🎯 TARGET: Kamu bisa merancang struktur aplikasi sederhana
          sebelum meminta AI menulis kode.

Jika masih bingung:
- Fokus di pola Input → Proses → Output
- Latihan bikin flow aplikasi sederhana

Jika sudah paham:
→ Buka fase-05-membangun-aplikasi.md
```

---

**📂 Lanjut ke: `fase-05-membangun-aplikasi.md`**
