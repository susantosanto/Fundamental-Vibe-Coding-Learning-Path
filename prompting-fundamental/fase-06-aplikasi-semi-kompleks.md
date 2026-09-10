# 🎯 FASE 6: Aplikasi Semi-Kompleks

> **Gabungin semua skill: arsitektur rapi + prompt engineering + fitur lengkap**
> Waktu: ~90 menit | Level: 🟡 Intermediate

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Bikin Dashboard Keuangan Pribadi (aplikasi paling kompleks)
✅ Struktur folder multi-file yang rapi
✅ State management sederhana (data di 1 tempat)
✅ Komponen yang bisa dipisah-pisah
✅ Prompt engineering untuk aplikasi kompleks
✅ Fitur: CRUD, filter, chart, export data
```

---

## 🧠 6.1 ARSITEKTUR APLIKASI (SEBELUM CODING)

### Denah Aplikasi:

```text
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  DASHBOARD KEUANGAN PRIBADI                             │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  RINGKASAN                                       │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐│   │
│  │  │Total   │  │Pemasukan│  │Pengeluaran│  │Saldo  ││   │
│  │  │Rp 5jt  │  │Rp 3jt  │  │Rp 2jt  │  │Rp 1jt ││   │
│  │  └────────┘  └────────┘  └────────┘  └────────┘│   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────┐ ┌──────────────────────┐  │
│  │  GRAFIK PENGELUARAN     │ │  TRANSAKSI TERBARU   │  │
│  │  (chart lingkaran)      │ │  ┌────────────────┐ │  │
│  │                         │ │  │Makanan -Rp50rb│ │  │
│  │  🍕 40% Makanan         │ │  │Gaji +Rp3jt    │ │  │
│  │  🏠 30% Sewa            │ │  │Transport -Rp20k│ │  │
│  │  🚗 20% Transport       │ │  └────────────────┘ │  │
│  └─────────────────────────┘ └──────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  TABEL TRANSAKSI                                 │   │
│  │  │Tanggal│Kategori│Deskripsi│Jumlah│Aksi│       │   │
│  │  ├───────┼────────┼─────────┼──────┼────┤       │   │
│  │  │10/1   │Makanan │Nasi      │-50rb │[×]│       │   │
│  │  │09/1   │Gaji    │Gaji bln  │+3jt  │[×]│       │   │
│  │  └───────┴────────┴─────────┴──────┴────┘       │   │
│  │                                                   │   │
│  │  [Tambah Transaksi]  [Filter]  [Export CSV]       │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Struktur Folder:

```
proyek/03-dashboard-keuangan/
├── index.html           ← Halaman utama (struktur)
├── css/
│   └── style.css        ← Semua styling
├── js/
│   ├── app.js           ← Main: inisialisasi & routing
│   ├── data.js          ← Data & localStorage
│   ├── components.js    ← Render UI components
│   └── utils.js         ← Helper functions (format uang, tanggal)
└── assets/
    └── (opsional: icon, gambar)
```

---

## 🧠 6.2 PROMPT UNTUK APLIKASI KOMPLEKS

### Prompt Utama (Desain Arsitektur Dulu):

```text
Kamu adalah arsitek aplikasi web senior. Saya ingin membuat
Dashboard Keuangan Pribadi.

TOLONG JANGAN LANGSUNG NGASIH KODE.

Pertama, bantu saya desain arsitekturnya dulu:

1. STRUKTUR DATA:
   - Data apa saja yang perlu disimpan?
   - Format data transaksi (property apa saja)?
   - Contoh 3-5 data dummy

2. STRUKTUR FILE:
   - File apa saja yang diperlukan?
   - Masing-masing file isinya apa?
   - Bagaimana urutan load file?

3. FITUR:
   - Fitur apa saja yang diperlukan?
   - Urutan prioritas fitur (mana yang dibuat dulu)

4. FLOW APLIKASI:
   - Input: apa saja yang user lakukan?
   - Proses: bagaimana data diproses?
   - Output: apa yang ditampilkan?

Setelah saya approve desainnya, baru kita lanjut ke kode.
```

### Setelah Dapat Desain:

```text
Arsitekturnya sudah oke. Sekarang kita buat tahap 1:

TAHAP 1: Struktur Data & Storage
Buat file js/data.js dengan:
1. Data dummy transaksi (minimal 10 transaksi)
2. Function CRUD:
   - tambahTransaksi(transaksi)
   - hapusTransaksi(id)  
   - getSemuaTransaksi()
   - getTotalPemasukan()
   - getTotalPengeluaran()
3. Simpan & load dari localStorage

Setiap function hanya 1 tugas.
Gunakan komentar untuk setiap bagian.
```

### Tahap 2: Tampilan:

```text
Sekarang tahap 2: HTML & CSS

Buat file index.html dan css/style.css:
1. Header: judul "Dashboard Keuangan" + ikon
2. 4 kartu ringkasan: Total, Pemasukan, Pengeluaran, Saldo
3. Form tambah transaksi (tersembunyi, muncul dengan tombol)
4. Tabel transaksi dengan kolom: Tanggal, Kategori, Deskripsi, Jumlah, Aksi
5. Tombol filter: Semua, Pemasukan, Pengeluaran
6. Tombol Export CSV

Desain:
- Warna: hijau (#27AE60) untuk pemasukan, merah (#E74C3C) untuk pengeluaran
- Kartu ringkasan: background gradient, icon, angka besar
- Tabel: striped rows, hover effect
- Responsif: mobile, tablet, desktop
- Font: system fonts, modern
```

### Tahap 3: Logika:

```text
Tahap 3: JavaScript logic

Buat file js/components.js dengan:
1. renderRingkasan() → tampilkan 4 kartu ringkasan
2. renderTabel(transaksi) → tampilkan tabel transaksi
3. renderFormTransaksi() → tampilkan form tambah
4. renderFilter() → tampilkan tombol filter

Buat file js/utils.js dengan:
1. formatRupiah(angka) → Rp 1.000.000
2. formatTanggal(date) → 12 Jan 2024
3. getKategoriIcon(kategori) → icon per kategori
4. exportCSV(transaksi) → download file CSV

Buat file js/app.js dengan:
1. Inisialisasi data dari localStorage
2. Event handlers untuk semua tombol
3. Integrasi semua komponen
```

---

## 🧠 6.3 POLA STATE MANAGEMENT SEDERHANA

### Konsep: Data di 1 Tempat

```javascript
// ❌ DATA TERSERAK:
function tambahTransaksi() {
  let data = localStorage.getItem('transaksi');
  // ... ribet
}

function hapusTransaksi() {
  let data = localStorage.getItem('transaksi');
  // ... ribet lagi
}
// → Kalau ada perubahan, susah sinkronisasi
```

```javascript
// ✅ DATA DI 1 TEMPAT (SENTRALISASI):
const State = {
  transaksi: [],
  
  init() {
    // Load data dari localStorage saat startup
    this.transaksi = this.loadData();
  },
  
  tambah(item) {
    this.transaksi.push(item);
    this.simpanData();
  },
  
  hapus(id) {
    this.transaksi = this.transaksi.filter(t => t.id !== id);
    this.simpanData();
  },
  
  simpanData() {
    localStorage.setItem('keuangan', JSON.stringify(this.transaksi));
  },
  
  loadData() {
    const data = localStorage.getItem('keuangan');
    return data ? JSON.parse(data) : [];
  }
};

// PAKAI:
State.tambah({ id: 1, jumlah: 50000, kategori: 'Makanan' });
// → Semua data otomatis tersimpan!
```

### Keuntungan State Terpusat:

```text
✅ Data konsisten (gak ada yang beda)
✅ Gampang debug (tinggal lihat State.transaksi)
✅ Fitur baru gampang ditambah
✅ Kalau ada perubahan UI, tinggal render ulang
```

---

## 🧠 6.4 FITUR-FITUR DENGAN PROMPT SPESIFIK

### Fitur: Grafik Sederhana (Pakai Canvas)

```text
Tambah grafik lingkaran (donut chart) ke dashboard.
Gunakan HTML Canvas (jangan library).

Data: kelompokkan transaksi berdasarkan kategori.
Tampilkan persentase per kategori dengan warna berbeda.

Warna kategori:
- Makanan: #E74C3C (merah)
- Transport: #3498DB (biru)
- Belanja: #9B59B6 (ungu)
- Tagihan: #1ABC9C (hijau)
- Hiburan: #F39C12 (oranye)
- Gaji: #2ECC71 (hijau terang)

Buat function:
1. getDataGrafik() → kelompokkan data per kategori
2. renderGrafik(canvasId, data) → gambar grafik
3. renderLegenda(data) → tampilkan legenda warna
```

### Fitur: Export CSV

```text
Tambah fitur export data transaksi ke file CSV.

Function exportCSV(transaksi):
1. Header: Tanggal, Kategori, Deskripsi, Jumlah, Tipe
2. Setiap transaksi jadi 1 baris
3. Pakai Blob dan download link
4. Nama file: keuangan_YYYY-MM-DD.csv

Buat juga:
- Tombol "Export CSV" di atas tabel
- Loading state saat export
- Konfirmasi "Data berhasil di-export!"
```

### Fitur: Filter & Search

```text
Tambah fitur filter dan search:

1. Filter berdasarkan kategori (dropdown)
2. Filter berdasarkan bulan/tahun
3. Filter berdasarkan tipe (pemasukan/pengeluaran/semua)
4. Search berdasarkan deskripsi

Buat function:
1. applyFilter() → filter data berdasarkan kriteria
2. renderFilteredData() → tampilkan data yang sudah difilter
3. resetFilter() → reset semua filter ke default

Semua filter bisa dikombinasikan!
```

---

## 🧠 6.5 REVIEW ARSITEKTUR

### Checklist Arsitektur yang Baik:

```text
☐ File terpisah: HTML, CSS, JS (atau JS terbagi)
☐ Function punya 1 tanggung jawab
☐ Data terpusat (tidak tersebar)
☐ Nama function jelas (tambahTransaksi, bukan doSomething)
☐ Komentar di bagian yang kompleks
☐ Tidak ada kode yang duplikat
☐ Mudah ditambah fitur baru
```

### Contoh Review Prompt:

```text
Review arsitektur aplikasi dashboard keuangan saya.
Periksa:

1. APAKAH function-function sudah punya 1 tanggung jawab?
   - data.js: [cek]
   - components.js: [cek]
   - app.js: [cek]

2. APAKAH ada kode duplikat?
   [cek]

3. APAKAH ada bug potensial?
   [cek]

4. SARAN perbaikan:
   [saran]
```

---

## 🧠 6.6 LATIHAN FASE 6

### LATIHAN 1: Bangun Dashboard (60 menit)

1. Buat prompt desain arsitektur (copy dari bagian 6.2)
2. Dapatkan desain dari AI
3. Setuju dengan desainnya? Jika ya, lanjut
4. Minta AI buat tahap 1 (data.js)
5. Minta AI buat tahap 2 (index.html + style.css)
6. Minta AI buat tahap 3 (components.js, utils.js, app.js)
7. Tes aplikasi di browser
8. Iterative refinement untuk perbaikan

### LATIHAN 2: Tambah Fitur Baru (30 menit)

Setelah dashboard jadi, tambah fitur ini:

```text
Tambah fitur BUDGET PLANNER ke dashboard:
1. User bisa set budget per kategori per bulan
2. Tampilkan progress bar: "Makanan: Rp 800.000 / Rp 1.000.000 (80%)"
3. Kalau melebihi budget, warnanya merah
4. Tampilkan ringkasan: "Sisa budget: Rp 200.000"

Data budget simpan di localStorage terpisah.
Buat function:
1. setBudget(kategori, jumlah)
2. getProgressBudget(kategori, bulan, tahun)
3. renderBudgetPlanner()
```

### LATIHAN 3: Review & Refactor (20 menit)

```text
Review seluruh kode dashboard keuangan yang sudah dibuat.
Beri saran perbaikan untuk:
1. Performance
2. Readability
3. Maintainability
4. Keamanan (walau sederhana)

Berikan prioritas: MUST FIX, SHOULD FIX, NICE TO HAVE
```

---

## 🧠 6.7 RANGKUMUM FASE 6

### Yang Udah Kamu Pelajari:

| Konsep | Implementasi |
|--------|--------------|
| **Arsitektur multi-file** | HTML, CSS, JS dipisah ke folder |
| **State management** | Data di 1 tempat (State object) |
| **Components** | Function render untuk setiap bagian UI |
| **CRUD lengkap** | Create, Read, Update, Delete |
| **Filter & Search** | Kombinasi filter multi-kriteria |
| **Export data** | CSV download |
| **Chart sederhana** | Canvas API untuk grafik |

### Checklist Final:

```
☐ Dashboard keuangan selesai & jalan
☐ Struktur folder rapi (multi-file)
☐ State management terpusat
☐ Fitur CRUD transaksi
☐ Fitur filter & search
☐ Fitur export CSV
☐ Grafik lingkaran berfungsi
☐ LATIHAN 1-3 selesai
```

---

## 🎉 SELAMAT! KAMU SUDAH MENYELESAIKAN SEMUA FASE!

```text
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   PERJALANAN KAMU:                                      │
│                                                         │
│   🟢 FASE 1: Dari tidak tahu apa-apa                   │
│   🟢 FASE 2: Bisa prompting dengan teknik              │
│   🟢 FASE 3: Bisa baca kode JavaScript                 │
│   🟢 FASE 4: Paham arsitektur dasar                    │
│   🟢 FASE 5: Bisa bikin 3 aplikasi                     │
│   🟢 FASE 6: Bisa bikin dashboard lengkap              │
│                                                         │
│   APA LANGKAH SELANJUTNYA?                              │
│                                                         │
│   1. Bikin project sendiri (ide kamu!)                 │
│   2. Pelajari framework (React, Vue)                    │
│   3. Pelajari backend (Node.js, database)               │
│   4. Deploy aplikasi ke internet (Netlify, Vercel)      │
│                                                         │
│   INGAT:                                                │
│   Skill utama yang kamu punya sekarang:                 │
│   🎯 BISA KOMUNIKASI DENGAN AI UNTUK BIKIN APLIKASI!   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

**📂 Lanjut eksplorasi project di folder `proyek/`**
