# C1: Manajemen File dan Dokumen dengan AI — Panduan Lengkap

> **Otomatisasi organisasi, pemrosesan, dan arsip dokumen**

**Estimasi**: 25 menit belajar + 45 menit praktik | **Level**: Pemula-Menengah

---

## 🎯 Outcome Pembelajaran

Setelah menyelesaikan modul ini, Anda akan mampu:

- **Mengorganisir file secara otomatis** dengan kategorisasi cerdas dan struktur folder yang konsisten
- **Melakukan batch operations** — rename, move, convert, compress dalam sekali jalan
- **Memproses dokumen** — ekstraksi teks PDF, OCR dokumen scan, pengisian formulir otomatis
- **Mengotomatisasi spreadsheet** — data cleaning, formula generation, pivot table, chart
- **Mengekstrak data terstruktur** dari invoice, kwitansi, formulir, dan dokumen lainnya
- **Mengelola email** — template, auto-reply, sorting, attachment processing
- **Membuat laporan otomatis** — agregasi data, visualisasi, distribusi berkala
- **Menerapkan strategi arsip** — backup, version control, retention policy
- **Membangun sistem manajemen dokumen sekolah** — surat masuk/keluar, arsip BOS, data siswa

---

## 🔑 Konsep Inti

### Filosofi File Management dengan AI

```
Manual:     Cari file → Buka satu per satu → Copy-paste → Save → Ulangi 100x
AI-Assisted: Deskripsikan aturan → AI eksekusi batch → Verifikasi hasil → Selesai
```

### Hierarki Kebutuhan File Management

| Level | Kebutuhan | Tools AI |
|-------|-----------|----------|
| 1. Dasar | Organisasi folder, naming | glob, list, bash rename |
| 2. Menengah | Batch convert, extract, parse | MCP tools, bash scripts |
| 3. Lanjut | OCR, data extraction, report generation | PDF MCP, Excel MCP |
| 4. Expert | Workflow otomatis, archive system | Custom scripts, scheduling |

### Prinsip Utama

1. **Aturan Jelas Sebelum Eksekusi** — Selalu definisikan naming convention, struktur folder, dan aturan klasifikasi SEBELUM AI menjalankan operasi
2. **Preview Sebelum Apply** — Minta AI menampilkan rencana perubahan dulu, baru eksekusi setelah konfirmasi
3. **Backup Selalu** — Setiap operasi batch harus punya rollback plan
4. **Konsistensi adalah Kunci** — Naming convention yang konsisten memudahkan pencarian dan otomatisasi di masa depan
5. **Metadata Matters** — File yang baik punya metadata lengkap (tanggal, author, versi, status)

---

## 📋 Masalah yang Diselesaikan

| Masalah | Sebelum AI | Setelah AI |
|---------|------------|------------|
| Folder Downloads berantakan | Manual sort satu per satu | AI klasifikasi otomatis dalam detik |
| File tidak ketemu | Cari manual, lupa nama | AI search by content, context, date |
| Rename 100 file foto | 2-3 jam manual | 30 detik dengan script |
| Extract data dari PDF | Copy-paste manual | OCR + parsing otomatis |
| Laporan bulanan | 1 hari compile data | Template + AI generate dalam 10 menit |
| Arsip dokumen | Lemari fisik, susah cari | Digital archive + search instant |
| Format tidak konsisten | Tiap orang beda cara | Template + AI enforce standar |
| Backup tidak teratur | Lupa backup, data hilang | Automated backup schedule |

---

## 📖 Bagian 1: Organisasi File Otomatis

### 1.1 Desain Struktur Folder

Struktur folder yang baik adalah fondasi manajemen file. Berikut template untuk berbagai konteks:

#### Template: Organisasi Pribadi
```
📁 Documents/
├── 📁 Finance/
│   ├── 📁 Invoices/
│   ├── 📁 Receipts/
│   ├── 📁 Tax/
│   └── 📁 Bank Statements/
├── 📁 Personal/
│   ├── 📁 Identity/
│   ├── 📁 Health/
│   └── 📁 Education/
├── 📁 Work/
│   ├── 📁 Projects/
│   ├── 📁 Reports/
│   └── 📁 Meetings/
└── 📁 Archive/
    ├── 📁 2024/
    ├── 📁 2025/
    └── 📁 2026/
```

#### Template: Sekolah (SD Negeri Pasirhalang)
```
📁 SDN-Pasirhalang/
├── 📁 Administrasi/
│   ├── 📁 Surat Masuk/
│   │   ├── 📁 2026/
│   │   │   ├── 📁 01-Januari/
│   │   │   └── 📁 02-Februari/
│   ├── 📁 Surat Keluar/
│   │   └── 📁 2026/
│   └── 📁 SK dan Keputusan/
├── 📁 Keuangan BOS/
│   ├── 📁 Perencanaan/
│   │   ├── 📁 RKAS 2026/
│   │   └── 📁 RKAS 2025/
│   ├── 📁 Realisasi/
│   │   ├── 📁 Kwitansi/
│   │   ├── 📁 Invoice/
│   │   └── 📁 Bukti Transfer/
│   └── 📁 Pelaporan/
│       ├── 📁 LPJ Semester 1/
│       └── 📁 LPJ Semester 2/
├── 📁 Data Dapodik/
│   ├── 📁 Peserta Didik/
│   ├── 📁 GTK/
│   ├── 📁 Sarpras/
│   └── 📁 Rombel/
├── 📁 Akademik/
│   ├── 📁 Kurikulum/
│   ├── 📁 Jadwal/
│   ├── 📁 Nilai/
│   └── 📁 Rapor/
└── 📁 Arsip/
    ├── 📁 2024/
    ├── 📁 2025/
    └── 📁 2026/
```

### 1.2 Naming Convention

Naming convention yang konsisten memudahkan pencarian dan sorting otomatis.

#### Format Umum
```
[Tanggal]_[Kategori]_[Deskripsi]_[Versi].[ext]
```

#### Contoh Penerapan
```
20260515_surat-masuk_disdik-beasiswa_v1.pdf
20260515_kwitansi-beli-atk_toko-jaya_v0.pdf
20260520_rkas-2026_revisi-3_v3.xlsx
20260601_rapor-kelas-6_semester-2_v1.pdf
```

#### Prompt: Generate Naming Convention
```
## Role
Kamu adalah information architect.

## Task
Buat naming convention untuk dokumen [konteks].

## Input
- Konteks: [sekolah/bisnis/pribadi]
- Jenis dokumen: [surat, invoice, laporan, dll]
- Frekuensi: [harian/mingguan/bulanan]

## Output
1. Format naming dengan placeholder
2. Contoh 10 filename yang valid
3. Aturan validasi (regex pattern)
4. Edge case handling (file tanpa tanggal, duplikat, dll)
5. Migration plan untuk file existing
```

### 1.3 Analisis dan Klasifikasi Folder Existing

#### Step 1: Analisis Struktur Saat Ini
```bash
cd ~/Documents/SDN-Pasirhalang
opencode
```

```
Analisis direktori ini secara komprehensif:
1. Total jumlah file dan folder
2. Distribusi tipe file (pdf, xlsx, docx, jpg, dll)
3. Pola naming yang ada (jika ada)
4. File yang tidak mengikuti pola (anomaly detection)
5. File duplikat atau sangat mirip
6. File yang tidak punya kategori jelas
7. Saran restrukturisasi folder

Output dalam format tabel dan tree structure.
```

#### Step 2: Generate Rencana Klasifikasi
```
Berdasarkan analisis di atas, buat rencana klasifikasi:

1. Struktur folder target (tree)
2. Aturan klasifikasi per tipe file:
   - File dengan kata "surat" → Administrasi/Surat Masuk/
   - File dengan kata "kwitansi" atau "bukti" → Keuangan/Realisasi/
   - File "rkas" atau "rapbs" → Keuangan/Perencanaan/
   - File "rapor" atau "nilai" → Akademik/
3. Naming convention baru untuk setiap kategori
4. Timeline migrasi (batch per kategori)
5. Rollback plan jika ada kesalahan

JANGAN eksekusi dulu. Tampilkan rencana lengkap untuk review.
```

#### Step 3: Eksekusi dengan Konfirmasi
```
Rencana sudah di-approve. Eksekusi dengan aturan:

1. Buat folder struktur dulu (mkdir)
2. Untuk setiap file:
   a. Rename sesuai convention baru
   b. Pindahkan ke folder yang sesuai
   c. Log perubahan (old_path → new_path)
3. Generate summary:
   - Total file diproses
   - File berhasil dipindah
   - File gagal (dan alasan)
   - Struktur folder akhir

Backup folder asli sebelum mulai.
```

### 1.4 Script Otomatis Klasifikasi

```bash
#!/bin/bash
# classify_files.sh - Script klasifikasi file otomatis
# Usage: bash classify_files.sh <source_dir> <rules_file>

SOURCE_DIR="$1"
RULES_FILE="$2"

# Baca rules dari JSON
# Format rules: [{"pattern": "*.pdf", "keyword": "surat", "target": "Administrasi/Surat/"}]

mkdir -p "$SOURCE_DIR/Administrasi/Surat_Masuk"
mkdir -p "$SOURCE_DIR/Administrasi/Surat_Keluar"
mkdir -p "$SOURCE_DIR/Keuangan/Perencanaan"
mkdir -p "$SOURCE_DIR/Keuangan/Realisasi"
mkdir -p "$SOURCE_DIR/Akademik/Nilai"
mkdir -p "$SOURCE_DIR/Akademik/Rapor"
mkdir -p "$SOURCE_DIR/Data_Dapodik"
mkdir -p "$SOURCE_DIR/Arsip"

LOG_FILE="$SOURCE_DIR/migration_log.csv"
echo "old_path,new_path,status,timestamp" > "$LOG_FILE"

# Klasifikasi berdasarkan keyword dalam filename
for file in "$SOURCE_DIR"/*; do
    [ -f "$file" ] || continue
    filename=$(basename "$file")
    
    if [[ "$filename" =~ [Ss]urat.*[Mm]asuk ]]; then
        target="Administrasi/Surat_Masuk"
    elif [[ "$filename" =~ [Ss]urat.*[Kk]eluar ]]; then
        target="Administrasi/Surat_Keluar"
    elif [[ "$filename" =~ [Rr][Kk][Aa][Ss] ]]; then
        target="Keuangan/Perencanaan"
    elif [[ "$filename" =~ [Kk]witansi|bukti|invoice ]]; then
        target="Keuangan/Realisasi"
    elif [[ "$filename" =~ [Rr]apor|[Nn]ilai ]]; then
        target="Akademik"
    else
        target="Arsip"
    fi
    
    mkdir -p "$SOURCE_DIR/$target"
    mv "$file" "$SOURCE_DIR/$target/" 2>>"$LOG_FILE"
    echo "$file,$SOURCE_DIR/$target/$(basename "$file"),success,$(date -Iseconds)" >> "$LOG_FILE"
done

echo "Klasifikasi selesai. Lihat log di $LOG_FILE"
```

---

## 📖 Bagian 2: Batch Operations

### 2.1 Batch Rename

#### Skenario: Rename 200 Foto Kegiatan Sekolah
```
Rename semua file foto di folder ~/Photos/Kegiatan-Sekolah/:

Aturan:
- Format: kegiatan_[tanggal-kegiatan]_[deskripsi]_[nomor].jpg
- Tanggal dari EXIF metadata atau file modification time
- Deskripsi dari nama folder atau keyword detection
- Nomor urut 3 digit (001, 002, dst)

Contoh output:
  IMG_2847.jpg → kegiatan_20260502_hardiknas_001.jpg
  DSC01234.jpg → kegiatan_20260502_hardiknas_002.jpg

PENTING:
1. Tampilkan preview 10 file pertama SEBELUM eksekusi
2. Saya confirm baru jalankan semua
3. Simpan log perubahan ke rename_log.csv
```

#### Script Batch Rename PowerShell
```powershell
# batch_rename_photos.ps1
# Rename foto berdasarkan tanggal modifikasi

$folder = "C:\Users\USER\Pictures\Kegiatan-Sekolah"
$counter = 1
$date = "20260502"  # Tanggal kegiatan
$event = "hardiknas"

Get-ChildItem -Path $folder -Filter "*.jpg" | Sort-Object LastWriteTime | ForEach-Object {
    $newName = "kegiatan_${date}_${event}_{0:D3}.jpg" -f $counter
    $oldPath = $_.FullName
    $newPath = Join-Path $folder $newName
    
    # Preview mode - uncomment baris bawah untuk eksekusi
    # Rename-Item -Path $oldPath -NewName $newName
    
    Write-Output "$oldName → $newName"
    $counter++
}
```

### 2.2 Batch Convert Format

#### Skenario: Convert 50 Dokumen Word ke PDF
```
Convert semua file .docx di folder ~/Documents/Surat/ ke .pdf:

Aturan:
- Nama file tetap, hanya ganti ekstensi
- Output ke folder ~/Documents/Surat-PDF/
- Gunakan format yang konsisten (A4, margin 2.54cm)
- Log file yang berhasil dan gagal

Script yang dibutuhkan:
1. PowerShell script untuk batch convert
2. Error handling untuk file corrupt
3. Progress indicator
```

#### PowerShell Script Convert Word ke PDF
```powershell
# convert_word_to_pdf.ps1

$sourceFolder = "C:\Users\USER\Documents\Surat"
$outputFolder = "C:\Users\USER\Documents\Surat-PDF"
$logFile = "C:\Users\USER\Documents\convert_log.csv"

# Buat folder output jika belum ada
if (-not (Test-Path $outputFolder)) {
    New-Item -ItemType Directory -Path $outputFolder | Out-Null
}

# Header log
"File,Status,Timestamp" | Out-File -FilePath $logFile -Encoding UTF8

# Buka Word application
$word = New-Object -ComObject Word.Application
$word.Visible = $false

$files = Get-ChildItem -Path $sourceFolder -Filter "*.docx"
$total = $files.Count
$current = 0

foreach ($file in $files) {
    $current++
    $docPath = $file.FullName
    $pdfName = [System.IO.Path]::ChangeExtension($file.Name, ".pdf")
    $pdfPath = Join-Path $outputFolder $pdfName
    
    try {
        $doc = $word.Documents.Open($docPath)
        $doc.SaveAs([ref]$pdfPath, [ref]17)  # 17 = wdSaveFormatPDF
        $doc.Close()
        "$($file.Name),Success,$(Get-Date -Format 'o')" | Out-File -FilePath $logFile -Append -Encoding UTF8
        Write-Host "[$current/$total] ✓ $pdfName"
    } catch {
        "$($file.Name),Error: $_,$(Get-Date -Format 'o')" | Out-File -FilePath $logFile -Append -Encoding UTF8
        Write-Host "[$current/$total] ✗ $($file.Name) - $_"
    }
}

$word.Quit()
Write-Host "Convert selesai. Log: $logFile"
```

### 2.3 Batch Compress dan Archive

#### Skenario: Arsip Tahunan Dokumen Sekolah
```
Buat archive untuk dokumen tahun 2025:

1. Kompres folder ~/Documents/SDN-Pasirhalang/2025/ ke ZIP
2. Nama file: SDN-Pasirhalang-Arsip-2025.zip
3. Password protect dengan password: [password-kuat]
4. Simpan ke ~/Archive/ dan cloud backup location
5. Generate checksum (SHA256) untuk verifikasi integritas
6. Buat manifest file berisi daftar isi archive
```

#### PowerShell Script Archive
```powershell
# create_archive.ps1

$sourceDir = "C:\Users\USER\Documents\SDN-Pasirhalang\2025"
$archiveName = "SDN-Pasirhalang-Arsip-2025.zip"
$archivePath = "C:\Users\USER\Archive\$archiveName"
$manifestFile = "C:\Users\USER\Archive\manifest-2025.txt"

# Create ZIP archive
Compress-Archive -Path "$sourceDir\*" -DestinationPath $archivePath -Force

# Generate SHA256 checksum
$hash = Get-FileHash -Path $archivePath -Algorithm SHA256
"$($hash.Hash)  $archiveName" | Out-File -FilePath "$archivePath.sha256" -Encoding UTF8

# Generate manifest
"=== MANIFEST ARSIP ===" | Out-File -FilePath $manifestFile -Encoding UTF8
"Tanggal: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-File -FilePath $manifestFile -Append -Encoding UTF8
"Source: $sourceDir" | Out-File -FilePath $manifestFile -Append -Encoding UTF8
"Archive: $archivePath" | Out-File -FilePath $manifestFile -Append -Encoding UTF8
"SHA256: $($hash.Hash)" | Out-File -FilePath $manifestFile -Append -Encoding UTF8
"`n=== DAFTAR FILE ===" | Out-File -FilePath $manifestFile -Append -Encoding UTF8

Get-ChildItem -Path $sourceDir -Recurse -File | ForEach-Object {
    $relPath = $_.FullName.Substring($sourceDir.Length + 1)
    "$($_.Length.ToString().PadLeft(10)) bytes  $relPath" | Out-File -FilePath $manifestFile -Append -Encoding UTF8
}

Write-Host "Archive created: $archivePath"
Write-Host "Checksum: $($hash.Hash)"
Write-Host "Manifest: $manifestFile"
```

---

## 📖 Bagian 3: Document Processing

### 3.1 PDF Text Extraction

#### Skenario: Extract Teks dari 100 Surat PDF
```
Extract teks dari semua file PDF di folder ~/Documents/Surat-Masuk/:

Requirements:
1. Extract teks dari setiap halaman
2. Simpan sebagai file .txt dengan nama yang sama
3. Output ke folder ~/Documents/Surat-Masuk-Text/
4. Handle PDF yang di-scan (OCR)
5. Log file yang gagal atau kosong

Gunakan PDF MCP tool: pdf_textextraction__extract_text
```

#### Contoh Penggunaan PDF MCP
```python
# Pseudocode untuk batch extract
import os
from pdf_mcp import extract_text

source_dir = "~/Documents/Surat-Masuk/"
output_dir = "~/Documents/Surat-Masuk-Text/"

for filename in os.listdir(source_dir):
    if filename.endswith(".pdf"):
        pdf_path = os.path.join(source_dir, filename)
        txt_path = os.path.join(output_dir, filename.replace(".pdf", ".txt"))
        
        result = extract_text(
            pdf_path=pdf_path,
            output_directory=output_dir,
            method="auto"  # auto-detect text vs scanned
        )
        
        print(f"Extracted: {filename} → {result.output_file}")
```

### 3.2 OCR untuk Dokumen Scan

#### Skenario: OCR Dokumen Arsip Lama
```
Lakukan OCR pada dokumen arsip yang di-scan:

Folder: ~/Documents/Arsip-Scan/
Bahasa: Indonesian (ind) + English (eng)
DPI: 300 (default)
Preprocessing: Enable (untuk improve accuracy)

Output:
1. File .txt dengan hasil OCR per dokumen
2. Confidence score per halaman
3. Log halaman dengan confidence rendah (<80%)
4. Saran manual review untuk halaman low-confidence

Gunakan: pdf_textextraction__ocr_pdf
```

#### Prompt OCR dengan AI
```
Saya punya 50 dokumen PDF hasil scan surat masuk tahun 2020-2024.
Semua dalam bahasa Indonesia.

Buat workflow OCR yang:
1. Deteksi dulu mana yang sudah text-based vs scanned
   (gunakan pdf_textextraction__is_scanned_pdf)
2. Untuk yang scanned, jalankan OCR
3. Extract data penting dari setiap surat:
   - Nomor surat
   - Tanggal surat
   - Pengirim
   - Perihal/Subject
   - Tujuan
4. Simpan hasil extract ke spreadsheet Excel
5. Flag dokumen yang OCR-nya tidak yakin untuk manual review

Output: Spreadsheet dengan kolom:
| Filename | No_Surat | Tanggal | Pengirim | Perihal | OCR_Confidence | Needs_Review |
```

### 3.3 Form Filling Otomatis

#### Skenario: Isi Formulir BOS untuk 20 Kegiatan
```
Isi formulir realisasi BOS untuk 20 kegiatan:

Template: formulir-realisation.pdf
Data source: data_kegiatan.xlsx

Field yang perlu diisi:
- Nama kegiatan
- Tanggal pelaksanaan
- Volume/kuantitas
- Harga satuan
- Total biaya
- Sumber dana (BOS Reguler)
- Keterangan

Workflow:
1. Baca data dari Excel
2. Untuk setiap baris, isi formulir PDF
3. Simpan sebagai PDF terpisah dengan nama: realisasi_[no]_[kegiatan].pdf
4. Merge semua PDF jadi satu file laporan
5. Generate summary table

Gunakan: pdf_formmanagement__fill_form_pdf
```

---

## 📖 Bagian 4: Spreadsheet Automation

### 4.1 Data Cleaning

#### Skenario: Bersihkan Data Siswa dari Dapodik
```
Bersihkan data siswa yang di-export dari Dapodik:

Masalah yang perlu di-handle:
1. Nama tidak konsisten (huruf besar/kecil tidak seragam)
   → Standardize: Title Case
2. Tanggal lahir format berbeda (DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY)
   → Standardize: DD/MM/YYYY
3. NISN ada yang 9 digit, ada yang 10 digit
   → Validasi: harus 10 digit, flag yang salah
4. Alamat ada yang kosong
   → Flag untuk dilengkapi
5. Duplikasi berdasarkan NISN
   → Identifikasi dan merge

Output:
1. File cleaned: data_siswa_cleaned.xlsx
2. File errors: data_siswa_errors.xlsx (baris yang bermasalah)
3. Report: jumlah record, jumlah cleaned, jumlah errors
```

#### Prompt Data Cleaning
```
## Role
Kamu adalah data engineer spesialis data cleaning.

## Task
Bersihkan dataset siswa dari Dapodik.

## Input
- File: @data_siswa_export.xlsx
- Sheet: "Peserta Didik"

## Rules
1. **Nama**: Title Case, trim whitespace, hapus karakter aneh
2. **NISN**: Validasi 10 digit numerik, pad dengan 0 jika 9 digit
3. **Tanggal Lahir**: Parse berbagai format → DD/MM/YYYY
4. **Jenis Kelamin**: Standardize "L"/"P" atau "Laki-laki"/"Perempuan"
5. **Alamat**: Trim, Title Case, flag jika kosong
6. **Kelas**: Validasi format "X-Y" (angka-romawi)
7. **Duplikasi**: Cek NISN duplikat, gabungkan data jika perlu

## Output
1. Sheet "Cleaned" — data yang sudah bersih
2. Sheet "Errors" — baris bermasalah + alasan
3. Sheet "Summary" — statistik cleaning
4. Sheet "Duplicates" — record duplikat + resolusi
```

### 4.2 Formula Generation

#### Skenario: Generate Formula untuk Laporan Keuangan
```
Buat formula Excel untuk laporan keuangan BOS:

Sheet "Realisasi":
- Kolom A: No
- Kolom B: Kode Rekening
- Kolom C: Uraian
- Kolom D: Anggaran (Rp)
- Kolom E: Realisasi Triwulan 1 (Rp)
- Kolom F: Realisasi Triwulan 2 (Rp)
- Kolom G: Realisasi Triwulan 3 (Rp)
- Kolom H: Realisasi Triwulan 4 (Rp)
- Kolom I: Total Realisasi (Rp)
- Kolom J: Sisa Anggaran (Rp)
- Kolom K: Persentase (%)

Formula yang dibutuhkan:
1. Total Realisasi (I) = E + F + G + H
2. Sisa Anggaran (J) = D - I
3. Persentase (K) = I / D * 100
4. Conditional formatting:
   - Persentase > 100% → Merah (over budget)
   - Persentase 75-100% → Hijau (on track)
   - Persentase < 75% → Kuning (perlu percepatan)
5. Summary row di bawah:
   - SUM untuk kolom D, E, F, G, H, I
   - Average untuk kolom K
```

#### Prompt Formula Generation
```
## Role
Kamu adalah Excel expert dan financial analyst.

## Task
Generate formula Excel untuk laporan keuangan.

## Input
- Struktur sheet: [deskripsi kolom]
- Perhitungan yang dibutuhkan: [daftar]
- Format angka: [currency, percentage, dll]

## Output
1. Formula per kolom dengan penjelasan
2. Conditional formatting rules
3. Data validation rules (jika perlu)
4. Chart suggestion untuk visualisasi
5. Tips untuk maintain formula (absolute vs relative reference)
```

### 4.3 Pivot Table dan Chart

#### Skenario: Pivot Table Data Keuangan Sekolah
```
Buat pivot table dari data realisasi BOS 2026:

Data source: realisasi_2026.xlsx
Sheet: "Detail Transaksi"
Kolom: Tanggal, Kode Rekening, Uraian, Debit, Kredit, Saldo, Kategori

Pivot table yang dibutuhkan:
1. Ringkasan per Kategori:
   - Rows: Kategori
   - Values: SUM(Debit), SUM(Kredit)
   - Format: Currency (Rp)

2. Ringkasan per Bulan:
   - Rows: Bulan (grouped from Tanggal)
   - Values: SUM(Debit), SUM(Kredit), COUNT(Transaksi)

3. Ringkasan per Kode Rekening:
   - Rows: Kode Rekening → Uraian (hierarchical)
   - Values: SUM(Debit), SUM(Kredit)

Chart:
1. Bar chart: Realisasi per Kategori
2. Line chart: Trend Saldo per Bulan
3. Pie chart: Distribusi Anggaran per Kategori
```

#### Prompt Pivot Table
```
## Role
Kamu adalah data analyst spesialis Excel.

## Task
Buat pivot table dan chart dari dataset.

## Input
- File: @data.xlsx
- Sheet: [nama]
- Kolom: [daftar kolom dengan tipe data]

## Output
1. Pivot table configuration:
   - Rows, Columns, Values, Filters
   - Aggregation function (SUM, COUNT, AVERAGE)
   - Number formatting
2. Chart recommendations:
   - Chart type per pivot
   - Data range
   - Axis labels
   - Title suggestions
3. Dashboard layout suggestion (jika multiple pivot)
```

---

## 📖 Bagian 5: Data Extraction dari Dokumen

### 5.1 Parsing Invoice dan Kwitansi

#### Skenario: Extract Data dari 50 Kwitansi
```
Extract data terstruktur dari kwitansi PDF:

Folder: ~/Documents/Keuangan/Kwitansi/
Format kwitansi: Semi-konsisten (beberapa variasi layout)

Data yang perlu di-extract:
1. Nomor kwitansi
2. Tanggal
3. Nama penerima
4. Jumlah (angka dan terbilang)
5. Untuk pembayaran apa
6. Metode pembayaran (tunai/transfer)
7. Nama penandatangan

Workflow:
1. Extract teks dari setiap PDF
2. Gunakan regex/AI parsing untuk identify fields
3. Simpan ke spreadsheet Excel
4. Validasi: jumlah angka == jumlah terbilang
5. Flag dokumen yang tidak bisa di-parse

Output: kwitansi_extracted.xlsx
```

#### Prompt Data Extraction
```
## Role
Kamu adalah document parser dan data extraction specialist.

## Task
Extract data terstruktur dari kwitansi/invoice PDF.

## Input
- File: @kwitansi/*.pdf (multiple files)
- Template kwitansi: @template_kwitansi.pdf (referensi format)

## Fields to Extract
1. Nomor: Pattern "No." atau "Nomor" diikuti angka
2. Tanggal: Pattern tanggal dalam berbagai format
3. Penerima: Nama setelah "Telah diterima dari"
4. Jumlah: Angka setelah "Rp" atau "Jumlah"
5. Terbilang: Teks dalam kurung atau setelah "Terbilang"
6. Untuk: Deskripsi setelah "Untuk pembayaran"
7. Metode: "Tunai" atau "Transfer" atau "Giro"

## Output Format
Spreadsheet dengan kolom:
| Filename | No_Kwitansi | Tanggal | Penerima | Jumlah_Angka | Jumlah_Terbilang | Untuk | Metode | Valid | Notes |

## Validation
- Jumlah_Angka harus match dengan Jumlah_Terbilang
- Tanggal harus valid
- Flag jika ada field yang tidak ditemukan
```

### 5.2 Parsing Formulir

#### Skenario: Extract Data Formulir PPDB
```
Extract data dari formulir pendaftaran PPDB:

Input: 100 formulir PDF yang sudah diisi (scanned + digital)
Data yang perlu di-extract:
1. Nama calon siswa
2. NISN (jika ada)
3. Tempat, tanggal lahir
4. Jenis kelamin
5. Nama orang tua (ayah & ibu)
6. Alamat
7. No. telepon
8. Asal TK/PAUD

Workflow:
1. Klasifikasi: digital form vs scanned form
2. Digital form: extract langsung dari form fields
3. Scanned form: OCR dulu, lalu parse
4. Validasi data (NISN 10 digit, tanggal valid, dll)
5. Export ke Excel untuk import ke Dapodik

Output: ppdb_2026_candidates.xlsx
```

---

## 📖 Bagian 6: Email Management

### 6.1 Template Email

#### Skenario: Template Email untuk Sekolah
```
Buat template email untuk berbagai keperluan SD Negeri Pasirhalang:

Template yang dibutuhkan:
1. Undangan pertemuan orang tua
2. Pengumuman libur
3. Konfirmasi pendaftaran PPDB
4. Pengumuman hasil lomba
5. Reminder pembayaran (jika ada)
6. Laporan perkembangan siswa (individual)

Untuk setiap template:
- Subject line (3 alternatif)
- Body email (formal dan semi-formal)
- Placeholder untuk personalisasi: {{nama_ortu}}, {{nama_siswa}}, {{kelas}}
- Attachment suggestion (jika perlu)
- Follow-up timeline
```

#### Prompt Template Email
```
## Role
Kamu adalah communication specialist untuk institusi pendidikan.

## Task
Buat template email profesional untuk sekolah.

## Input
- Jenis email: [undangan/pengumuman/konfirmasi/dll]
- Audience: [orang tua siswa/dinas/guru/dll]
- Tone: [formal/semi-formal/hangat]
- Konteks: [deskripsi situasi]

## Output
1. 3 Subject line alternatives
2. Email body (HTML-ready)
3. Plain text version
4. Personalization tokens
5. Attachment checklist
6. Follow-up schedule
```

### 6.2 Auto-Reply dan Email Sorting

#### Skenario: Sistem Auto-Reply untuk Email Sekolah
```
Buat sistem auto-reply untuk email masuk ke info@sdnpasirhalang.sch.id:

Rules:
1. Email dengan keyword "PPDB" atau "pendaftaran":
   → Reply: Template info PPDB + link formulir
   → Forward: Ke panitia PPDB
   
2. Email dengan keyword "surat" atau "permohonan":
   → Reply: Template konfirmasi penerimaan
   → Forward: Ke bagian administrasi
   
3. Email dengan keyword "keluhan" atau "komplain":
   → Reply: Template terima kasih + timeline respon
   → Forward: Ke kepala sekolah
   
4. Email lainnya:
   → Reply: Template terima kasih umum
   → Forward: Ke operator

Implementasi: Google Apps Script dengan Gmail API
```

#### Google Apps Script untuk Email Sorting
```javascript
// email-sorter.gs
// Auto-reply dan sorting email masuk

function processIncomingEmails() {
  const threads = GmailApp.search('is:unread label:inbox', 0, 10);
  
  threads.forEach(thread => {
    const messages = thread.getMessages();
    const latestMessage = messages[messages.length - 1];
    const subject = latestMessage.getSubject().toLowerCase();
    const body = latestMessage.getPlainBody().toLowerCase();
    const sender = latestMessage.getFrom();
    
    let category = 'general';
    let replyTemplate = '';
    let forwardTo = '';
    
    // Keyword-based classification
    if (subject.includes('ppdb') || body.includes('pendaftaran')) {
      category = 'ppdb';
      replyTemplate = getTemplate('ppdb_info');
      forwardTo = 'panitia-ppdb@sdnpasirhalang.sch.id';
    } else if (subject.includes('surat') || body.includes('permohonan')) {
      category = 'administrasi';
      replyTemplate = getTemplate('admin_confirm');
      forwardTo = 'admin@sdnpasirhalang.sch.id';
    } else if (subject.includes('keluhan') || body.includes('komplain')) {
      category = 'complaint';
      replyTemplate = getTemplate('complaint_ack');
      forwardTo = 'kepsek@sdnpasirhalang.sch.id';
    }
    
    // Send auto-reply
    GmailApp.sendEmail(
      sender,
      `Re: ${latestMessage.getSubject()}`,
      replyTemplate
    );
    
    // Forward if needed
    if (forwardTo) {
      thread.forward(forwardTo, {
        htmlBody: `<p>Diteruskan otomatis oleh sistem email sekolah.</p>
                   <p>Kategori: ${category}</p>`
      });
    }
    
    // Mark as read and add label
    thread.markRead();
    thread.addLabel(GmailApp.getUserLabelByName(`Auto/${category}`));
  });
}

function getTemplate(templateName) {
  const templates = {
    'ppdb_info': `Yth. Orang Tua/Wali,\n\nTerima kasih atas minat Anda...\n`,
    'admin_confirm': `Yth. Pengirim,\n\nSurat/permohonan Anda telah kami terima...\n`,
    'complaint_ack': `Yth. Pengirim,\n\nTerima kasih atas masukan Anda...\n`,
  };
  return templates[templateName] || templates['general'];
}
```

### 6.3 Attachment Processing

#### Skenario: Process Attachment Email Masuk
```
Proses semua attachment dari email masuk minggu ini:

Workflow:
1. Download semua attachment dari email unread
2. Klasifikasi berdasarkan tipe file:
   - PDF → folder ~/Documents/Email-Attachments/PDF/
   - Excel → folder ~/Documents/Email-Attachments/Excel/
   - Image → folder ~/Documents/Email-Attachments/Images/
3. Rename file: [tanggal-email]_[sender]_[original-name]
4. Log semua attachment ke spreadsheet:
   | Tanggal | Sender | Subject | Filename | Tipe | Size | Folder |
5. Hapus email yang attachment-nya sudah disimpan (opsional)
```

---

## 📖 Bagian 7: Report Generation

### 7.1 Laporan Bulanan Otomatis

#### Skenario: Generate Laporan Keuangan Bulanan
```
Buat laporan keuangan BOS bulan Mei 2026:

Data source:
- realisasi_2026.xlsx (semua transaksi)
- rkas_2026.xlsx (anggaran rencana)

Laporan yang perlu di-generate:
1. Ringkasan Eksekutif:
   - Total anggaran
   - Total realisasi sampai bulan ini
   - Sisa anggaran
   - Persentase serapan
   
2. Detail per Kategori:
   - Tabel: Kategori | Anggaran | Realisasi | Sisa | %
   - Chart: Bar chart per kategori
   
3. Detail per Bulan:
   - Tabel: Bulan | Debit | Kredit | Saldo
   - Chart: Line chart trend
   
4. Transaksi Besar (>Rp 5.000.000):
   - Tabel: Tanggal | Uraian | Jumlah | Kategori
   
5. Rekomendasi:
   - Kategori yang over budget
   - Kategori yang under-utilized
   - Proyeksi akhir tahun

Format output:
- PDF (untuk distribusi)
- Excel (untuk arsip dan analisis lanjutan)
```

#### Prompt Report Generation
```
## Role
Kamu adalah financial report generator.

## Task
Buat laporan keuangan bulanan dari data transaksi.

## Input
- Data transaksi: @realisasi_2026.xlsx
- Data anggaran: @rkas_2026.xlsx
- Periode: Mei 2026

## Output Structure
1. Cover page dengan judul dan periode
2. Executive summary (1 halaman)
3. Detail laporan (per kategori, per bulan)
4. Visualisasi (chart)
5. Rekomendasi dan insight
6. Lampiran (detail transaksi)

## Format
- Professional, clean design
- Table dengan border dan header color
- Chart yang informatif
- Summary metrics di highlight
```

### 7.2 Data Aggregation

#### Skenario: Agregasi Data Nilai Siswa
```
Agregasi data nilai siswa semester 2 tahun ajaran 2025/2026:

Data source:
- nilai_kelas_1.xlsx s/d nilai_kelas_6.xlsx
- Setiap file: NIS, Nama, Mata Pelajaran, Nilai Harian, UTS, UAS

Output yang dibutuhkan:
1. Rekap nilai per siswa (semua mata pelajaran):
   | NIS | Nama | Kelas | MTQ | B.Indo | MTK | IPA | IPS | ... | Rata-rata | Ranking |
   
2. Rekap per kelas:
   | Kelas | Jumlah Siswa | Rata-rata Kelas | Tertinggi | Terendah | Lulus | Tidak Lulus |
   
3. Statistik sekolah:
   - Rata-rata seluruh siswa
   - Distribusi nilai (histogram)
   - Mata pelajaran dengan rata-rata tertinggi/terendah
   - Siswa berprestasi (top 10)
   - Siswa perlu perhatian (bottom 10)
   
4. Chart:
   - Histogram distribusi nilai
   - Bar chart rata-rata per kelas
   - Line chart perbandingan dengan semester sebelumnya
```

---

## 📖 Bagian 8: Archive Management

### 8.1 Backup Strategies

#### Strategi Backup 3-2-1
```
Terapkan strategi backup 3-2-1 untuk dokumen sekolah:

3 kopi data:
1. Primary: Laptop operator (working copy)
2. Secondary: External hard drive (local backup)
3. Tertiary: Cloud storage (Google Drive/OneDrive)

2 media berbeda:
1. Local storage (HDD/SSD)
2. Cloud storage

1 offsite:
- Cloud storage otomatis offsite

Schedule:
- Daily: Incremental backup ke external drive
- Weekly: Full backup ke cloud
- Monthly: Archive + checksum verification
```

#### PowerShell Script Backup Otomatis
```powershell
# backup_school_docs.ps1

$sourceDirs = @(
    "C:\Users\USER\Documents\SDN-Pasirhalang",
    "C:\Users\USER\Documents\Arsip"
)

$backupDrive = "E:\Backup\SDN-Pasirhalang"
$cloudFolder = "C:\Users\USER\OneDrive\Backup\SDN-Pasirhalang"
$logFile = "C:\Users\USER\Documents\backup_log.csv"

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupFolder = Join-Path $backupDrive "backup_$timestamp"

# Create backup folder
New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null

# Header log
if (-not (Test-Path $logFile)) {
    "Timestamp,Source,Destination,Files,Size,Status" | Out-File -FilePath $logFile -Encoding UTF8
}

foreach ($source in $sourceDirs) {
    $folderName = Split-Path $source -Leaf
    $dest = Join-Path $backupFolder $folderName
    
    try {
        # Robocopy untuk backup incremental
        $result = robocopy $source $dest /MIR /R:3 /W:5 /NP /LOG+:robocopy_log.txt
        
        $fileCount = (Get-ChildItem $dest -Recurse -File).Count
        $totalSize = (Get-ChildItem $dest -Recurse -File | Measure-Object -Property Length -Sum).Sum
        
        "$timestamp,$source,$dest,$fileCount,$totalSize,Success" | Out-File -FilePath $logFile -Append -Encoding UTF8
        Write-Host "✓ Backup $folderName : $fileCount files, $($totalSize / 1MB) MB"
    } catch {
        "$timestamp,$source,$dest,0,0,Error: $_" | Out-File -FilePath $logFile -Append -Encoding UTF8
        Write-Host "✗ Backup $folderName failed: $_"
    }
}

# Sync to cloud (OneDrive auto-sync jika file di folder OneDrive)
robocopy $backupFolder $cloudFolder /MIR /R:3 /W:5

Write-Host "Backup selesai: $backupFolder"
Write-Host "Log: $logFile"
```

### 8.2 Version Control untuk Dokumen

#### Skenario: Version Control Dokumen RKAS
```
Implementasi version control untuk dokumen RKAS:

Aturan:
1. Setiap revisi disimpan sebagai file terpisah
2. Naming: rkas_2026_v1.xlsx, rkas_2026_v2.xlsx, dst
3. Changelog file: rkas_2026_changelog.md
4. Never overwrite — always new version

Changelog format:
```markdown
# RKAS 2026 - Changelog

## v3 - 2026-05-15
- Revisi anggaran kegiatan Literasi Digital (+Rp 5.000.000)
- Penyesuaian anggaran ATK (-Rp 1.500.000)
- Approved oleh: Kepala Sekolah

## v2 - 2026-04-01
- Penambahan kegiatan ekstrakurikuler
- Revisi jadwal kegiatan
- Approved oleh: Komite Sekolah

## v1 - 2026-03-01
- Draft awal RKAS 2026
- Disusun oleh: Operator Sekolah
```

Prompt untuk AI:
```
Buat changelog entry untuk revisi RKAS terbaru:

Perubahan dari v2 ke v3:
1. Anggaran Literasi Digital: Rp 10.000.000 → Rp 15.000.000
2. Anggaran ATK: Rp 8.000.000 → Rp 6.500.000
3. Penambahan kegiatan: Workshop Parenting (Rp 3.000.000)

Format changelog yang profesional dengan:
- Tanggal revisi
- Detail perubahan (before → after)
- Alasan perubahan
- Approver
```

### 8.3 Retention Policies

#### Kebijakan Retensi Dokumen Sekolah
```
Buat kebijakan retensi dokumen SD Negeri Pasirhalang:

Kategori dan masa simpan:
1. Surat Masuk/Keluar: 5 tahun
2. Dokumen Keuangan (BOS): 10 tahun
3. Data Siswa (Rapor, Ijazah): Permanen
4. Data GTK: 10 tahun setelah pensiun
5. SK dan Keputusan: Permanen
6. Dokumen Dapodik: 5 tahun
7. Foto Kegiatan: 3 tahun
8. Draft dan Working Paper: 1 tahun

Action setelah masa simpan:
- Permanen: Archive ke storage jangka panjang
- 10 tahun: Review, mungkin archive atau destroy
- 5 tahun: Review, destroy jika tidak diperlukan
- 3 tahun: Destroy kecuali ada nilai historis
- 1 tahun: Destroy

Prompt:
```
Buat schedule retensi dokumen untuk sekolah:

1. Calendar review tahunan (setiap Januari)
2. Checklist dokumen yang perlu di-review
3. Prosedur destruction (secure delete)
4. Prosedur archive (compress + checksum + offsite)
5. Log retensi: dokumen apa, kapan di-review, keputusan apa
```

---

## 📖 Bagian 9: Real-World — Sistem Manajemen Dokumen Sekolah

### 9.1 Arsitektur Sistem

```
Sistem Manajemen Dokumen SD Negeri Pasirhalang

┌─────────────────────────────────────────────────────┐
│                    INPUT LAYER                       │
├─────────────────────────────────────────────────────┤
│  Surat Masuk  │  Surat Keluar  │  Dokumen Internal  │
│  Invoice      │  Kwitansi      │  Formulir          │
│  Email        │  Foto Kegiatan │  Laporan           │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                  PROCESSING LAYER                    │
├─────────────────────────────────────────────────────┤
│  1. Klasifikasi otomatis (AI)                       │
│  2. OCR dokumen scan                                │
│  3. Data extraction (invoice, formulir)             │
│  4. Naming convention enforcement                   │
│  5. Filing ke folder yang sesuai                    │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                   STORAGE LAYER                      │
├─────────────────────────────────────────────────────┤
│  Primary: Laptop operator                           │
│  Secondary: External HDD (daily backup)             │
│  Tertiary: Cloud/OneDrive (weekly sync)             │
│  Archive: Year-end compression + checksum           │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                  OUTPUT LAYER                        │
├─────────────────────────────────────────────────────┤
│  Search & retrieval (full-text)                     │
│  Report generation (bulanan, semesteran, tahunan)   │
│  Dashboard statistik                                │
│  Export (Excel, PDF, CSV)                           │
└─────────────────────────────────────────────────────┘
```

### 9.2 Workflow Harian Operator

```
Workflow Harian Operator SD Negeri Pasirhalang

PAGI (07:30 - 08:00):
1. Cek email masuk
   → Download attachment
   → Klasifikasi dan filing
   → Auto-reply jika perlu

2. Cek surat masuk fisik
   → Scan dokumen
   → OCR jika perlu
   → Extract data penting
   → Filing ke folder Surat Masuk

SIANG (12:00 - 13:00):
3. Proses dokumen keuangan
   → Input kwitansi/invoice ke spreadsheet
   → Update realisasi BOS
   → Generate laporan jika diminta

SORE (15:00 - 15:30):
4. End-of-day routine
   → Backup harian ke external drive
   → Verify backup integrity
   → Log aktivitas harian
   → Prepare todo list besok
```

### 9.3 Prompt Workflow Lengkap

```
## Role
Kamu adalah sistem manajemen dokumen otomatis untuk SD Negeri Pasirhalang.

## Task
Proses semua dokumen yang masuk hari ini.

## Input
Folder yang perlu diproses:
1. ~/Downloads/ (file baru download)
2. ~/Desktop/ (file temporary)
3. Email attachments (jika ada)

## Workflow
1. SCAN: Identifikasi semua file baru
2. CLASSIFY: Kategorikan berdasarkan tipe dan konten
3. RENAME: Terapkan naming convention sekolah
4. FILE: Pindahkan ke folder yang sesuai
5. EXTRACT: Untuk dokumen penting, extract data ke spreadsheet
6. LOG: Catat semua perubahan ke activity_log.csv
7. BACKUP: Sync ke external drive

## Naming Convention
- Surat: YYYYMMDD_surat-[masuk/keluar]_[pengirim/tujuan]_[perihal].pdf
- Keuangan: YYYYMMDD_[kwitansi/invoice/bukti]_[uraian]_[nomor].pdf
- Akademik: YYYYMMDD_[rapor/nilai/jadwal]_[kelas]_[semester].xlsx
- Dapodik: YYYYMMDD_dapodik_[jenis]_[deskripsi].xlsx

## Output
1. Summary: jumlah file diproses per kategori
2. Activity log: detail setiap perubahan
3. Error report: file yang gagal diproses + alasan
4. Folder structure: tree struktur setelah processing
```

### 9.4 Dashboard Monitoring

#### Skenario: Dashboard Status Dokumen
```
Buat dashboard monitoring status dokumen sekolah:

Data source:
- activity_log.csv (log semua operasi file)
- backup_log.csv (log backup)
- Folder structure (scan real-time)

Metrics yang ditampilkan:
1. Total dokumen per kategori:
   | Kategori | Jumlah | Bulan Ini | Ukuran Total |
   | Surat Masuk | 245 | 12 | 156 MB |
   | Surat Keluar | 189 | 8 | 98 MB |
   | Keuangan | 567 | 45 | 340 MB |
   | Akademik | 1234 | 0 | 890 MB |
   | Dapodik | 89 | 5 | 45 MB |

2. Status backup:
   - Last backup: 2026-05-20 15:30
   - Backup size: 2.3 GB
   - Status: ✓ Success
   
3. Storage usage:
   - Primary: 15.6 GB / 256 GB (6%)
   - External: 12.3 GB / 1 TB (1.2%)
   - Cloud: 8.9 GB / 15 GB (59%)

4. Pending actions:
   - 5 dokumen perlu OCR
   - 3 kwitansi perlu entry ke spreadsheet
   - 1 surat perlu follow-up

Format: HTML dashboard atau Excel dengan conditional formatting
```

---

## 📋 Magic Prompt Templates

### Template 1: Folder Analysis
```
## Role
Kamu adalah information architect.

## Task
Analisis struktur folder dan berikan rekomendasi.

## Input
- Path: [folder path]
- Konteks: [sekolah/bisnis/pribadi]

## Output
1. Statistik: jumlah file, folder, tipe file
2. Anomaly detection: file misplaced, naming inconsistent
3. Duplikat detection
4. Rekomendasi struktur baru
5. Migration plan
```

### Template 2: Batch Rename
```
## Role
Kamu adalah file management automation expert.

## Task
Rename batch file dengan aturan konsisten.

## Input
- Folder: [path]
- Pattern: [deskripsi aturan rename]
- Source data: [EXIF, modification time, content, dll]

## Output
1. Preview perubahan (10 file pertama)
2. Script untuk eksekusi
3. Rollback plan
4. Log format
```

### Template 3: Data Extraction
```
## Role
Kamu adalah document parser specialist.

## Task
Extract data terstruktur dari dokumen.

## Input
- Dokumen: @file atau folder
- Fields: [daftar field yang perlu di-extract]
- Format output: [Excel/CSV/JSON]

## Output
1. Extracted data dalam format tabel
2. Confidence score per field
3. Error report: field yang tidak ditemukan
4. Validation report: data yang tidak valid
```

### Template 4: Report Generation
```
## Role
Kamu adalah report generator dan data analyst.

## Task
Buat laporan dari data mentah.

## Input
- Data: @file
- Periode: [tanggal]
- Audience: [siapa yang baca]

## Output
1. Executive summary
2. Detail tables
3. Charts dan visualisasi
4. Insights dan rekomendasi
5. Format: PDF + Excel
```

### Template 5: Backup Strategy
```
## Role
Kamu adalah IT infrastructure specialist.

## Task
Desain strategi backup untuk dokumen.

## Input
- Data yang perlu backup: [daftar]
- Volume: [ukuran total]
- RPO (Recovery Point Objective): [berapa jam/hari]
- RTO (Recovery Time Objective): [berapa jam]

## Output
1. Backup strategy (3-2-1 rule)
2. Schedule dan automation script
3. Verification procedure
4. Recovery procedure
5. Monitoring dan alerting
```

---

## ✅ Checklist Kompetensi

### Organisasi File
- [ ] Desain struktur folder yang logis
- [ ] Terapkan naming convention konsisten
- [ ] Analisis dan rapikan folder berantakan
- [ ] Klasifikasi file otomatis

### Batch Operations
- [ ] Batch rename dengan aturan kompleks
- [ ] Batch convert format (Word→PDF, dll)
- [ ] Batch compress dan archive
- [ ] Script otomatis untuk operasi berulang

### Document Processing
- [ ] Extract teks dari PDF
- [ ] OCR dokumen scan
- [ ] Form filling otomatis
- [ ] Data extraction dari invoice/kwitansi

### Spreadsheet Automation
- [ ] Data cleaning dengan aturan kompleks
- [ ] Generate formula Excel
- [ ] Buat pivot table dan chart
- [ ] Data aggregation multi-source

### Email Management
- [ ] Template email profesional
- [ ] Auto-reply dan sorting
- [ ] Attachment processing
- [ ] Email archive dan search

### Report Generation
- [ ] Laporan keuangan otomatis
- [ ] Agregasi data multi-source
- [ ] Visualisasi dan chart
- [ ] PDF export profesional

### Archive Management
- [ ] Backup strategy 3-2-1
- [ ] Version control dokumen
- [ ] Retention policy
- [ ] Secure destruction

### Real-World: Sekolah
- [ ] Sistem surat masuk/keluar
- [ ] Arsip BOS terorganisir
- [ ] Data siswa terstruktur
- [ ] Dashboard monitoring

---

## ⚠️ Pitfalls dan Cara Menghindarinya

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| File hilang setelah rename | Aturan rename salah | Preview dulu, backup sebelum eksekusi |
| OCR tidak akurat | Scan kualitas rendah | Preprocessing, DPI 300+, kontras baik |
| Data extraction salah | Format dokumen bervariasi | Template per format, validation rules |
| Backup corrupt | Tidak verifikasi integrity | Checksum verification setelah backup |
| Folder berantakan lagi | Tidak enforce rules | Automation + periodic review |
| Duplikat file | Tidak ada deduplication | Hash-based dedup sebelum backup |
| File terlalu besar | Tidak compress | Archive old files, compress images |
| Version conflict | Multiple orang edit | Lock file saat edit, changelog |
| Email template kaku | Tidak ada personalisasi | Template dengan placeholder dinamis |
| Laporan tidak akurat | Data source tidak synced | Single source of truth, auto-sync |

### Pitfall Terbesar: Tidak Ada Sistem

File management tanpa sistem = chaos yang tertunda. Selalu:

1. **Desain dulu** — Struktur folder, naming convention, rules
2. **Dokumentasikan** — Tulis aturan di README atau wiki
3. **Automasi** — Script untuk operasi berulang
4. **Enforce** — Review berkala, koreksi yang menyimpang
5. **Backup** — 3-2-1 strategy, verifikasi integrity

---

## 📝 Ringkasan

### Workflow Inti

1. **Analisis** → Pahami kondisi folder saat ini
2. **Rencana** → Desain struktur, naming, rules
3. **Preview** → Tampilkan perubahan sebelum eksekusi
4. **Eksekusi** → Jalankan batch operations
5. **Verifikasi** → Cek hasil, fix errors
6. **Backup** → Simpan state yang sudah rapi
7. **Maintain** → Review berkala, enforce rules

### Prinsip Utama

- **Consistent naming** → Mudah dicari, mudah di-sort
- **Logical structure** → Folder mencerminkan workflow
- **Automate everything** → Script untuk operasi berulang
- **Backup always** → 3-2-1 strategy, verify integrity
- **Extract metadata** → Data dari dokumen → spreadsheet → insight
- **Version control** → Never overwrite, always new version

### Tools yang Perlu Dikuasai

| Tool | Use Case | Level |
|------|----------|-------|
| glob/grep/list | Cari dan analisis file | Dasar |
| bash/PowerShell | Script otomatisasi | Menengah |
| PDF MCP | Extract, OCR, form fill | Menengah |
| Excel MCP | Data cleaning, pivot, chart | Menengah |
| Google Apps Script | Email automation | Lanjut |
| Custom scripts | Workflow kompleks | Expert |

---

> **Modul selanjutnya**: [C2: Refactoring & Testing](./04-refactoring-testing.md) — Refactor kode dengan aman dan generate test otomatis.