## 18. CONTOH KASUS NYATA

### 18.1 Kasus: Dashboard Keuangan CEO

**Latar Belakang:**
- CEO menghabiskan 3-4 jam/minggu mengkonsolidasi data
- Data tersebar di 5 spreadsheet + 2 PDF
- Butuh newsletter mingguan + laporan bulanan

**Proses:**

```
SPRINT 001: Discovery
━━━━━━━━━━━━━━━━━━━━━━
Architect bertanya:
- Workflow saat ini seperti apa?
- Siapa pengguna utama?
- Format output apa yang diinginkan?
- Data apa saja yang tersedia?

Hasil:
- Architect Pack 001 dibuat
- 5 sprint direncanakan
- Folder structure dibuat

SPRINT 002: Sample Bundle
━━━━━━━━━━━━━━━━━━━━━━━━
Builder menghasilkan:
- Dashboard HTML dengan data dummy
- Newsletter HTML contoh
- Prototype yang bisa dibuka di browser

Hasil:
- CEO bisa lihat konsep awal
- Feedback diberikan
- Architect pack baru dibuat

SPRINT 003: Executive Output Polish
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Builder menyempurnakan:
- Format profesional
- Layout yang menarik
- Responsive design

Hasil:
- Output siap presentasi
- CEO puas dengan tampilan

SPRINT 004: Data Integration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Builder mengintegrasikan:
- Parser Excel yang robust
- Validasi data otomatis
- Error handling yang baik

Hasil:
- 5 spreadsheet berhasil di-parse
- Data real tampil di dashboard

SPRINT 005: Testing & Refinement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Builder melakukan:
- Unit tests (15 test cases)
- Integration tests
- Bug fixes

Hasil:
- Semua test passing
- Error handling teruji

SPRINT 006: Deployment
━━━━━━━━━━━━━━━━━━━━━━━
Builder menyiapkan:
- Production build
- Documentation
- User guide

Hasil:
- Aplikasi siap digunakan
- Waktu proses turun dari 4 jam → 30 menit!
```

### 18.2 Kasus: Review Workflow (Chris Titus Tech)

**Latar Belakang:**
- Chris ingin menambahkan persentase audio di panel DWM
- Menggunakan Codex sebagai builder

**Proses:**

```
1. SPECIFICATION
   ├── Definisikan: tambahkan % di samping ikon volume
   ├── Scope: hanya perubahan UI, tidak ubah logic audio
   └── Acceptance: % muncul, hide saat audio unavailable

2. IMPLEMENTATION
   ├── Codex menemukan Quickskill (skill untuk QML)
   ├── Inspeksi code yang ada
   ├── Buat perubahan QML
   ├── Update regression test
   ├── Deploy ke live install
   └── Verifikasi di screen

3. PULL REQUEST
   ├── PR dibuat (bukan langsung ke main)
   ├── Manual gate untuk review
   └── Inspect diff, cek screenshot

4. INDEPENDENT REVIEW
   ├── CodeRabbit review
   ├── Temuan 1: Hide % saat audio unavailable
   └── Temuan 2: Document perubahan di changelog

5. FIX & ITERATE
   ├── Fix unavailable-audio state
   ├── Update test
   ├── Add changelog entry
   └── Push perbaikan

6. MANUAL VERIFICATION
   ├── Cek volume % di live panel
   ├── Cek fix untuk unavailable audio
   ├── Cek test & changelog
   └── Tunggu CI passing

7. MERGE
   └── Setelah semua gate passed
```

---

