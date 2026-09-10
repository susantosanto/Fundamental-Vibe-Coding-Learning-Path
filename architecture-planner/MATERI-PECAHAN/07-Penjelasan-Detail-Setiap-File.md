## 7. PENJELASAN DETAIL SETIAP FILE

### 7.1 AGENTS.MD — Router Utama

**Fungsi:** File pertama yang harus dibaca oleh setiap AI agent atau human builder.

> **💡 Kutipan dari Chris Titus Tech:**
> *"AGENTS.md tells the coding agent how I want it to work."*

**Isi yang harus ada:**
```markdown
# AGENTS.MD - Router Utama

## Model Operasi
- Kami menggunakan metode Architect-Builder
- Architect: ChatGPT/Claude
- Builder: Codex/Claude Code

## File yang Harus Dibaca (Urutan)
1. AGENTS.MD (file ini)
2. STATE.MD (status terkini)
3. DECISIONS.MD (keputusan yang sudah dibuat)
4. Domain.MD (konteks bisnis)
5. File sprint yang sedang aktif

## Aturan Builder
- JANGAN mulai coding tanpa architect pack
- SELALU lakukan dry run dulu
- SELALU berikan bukti (test output, screenshot)
- JANGAN mengubah requirements tanpa persetujuan

## Workflow
1. Baca architect pack untuk sprint aktif
2. Dry run → Lapor hasil
3. Jika disetujui → Mulai coding
4. Selesai → Lapor hasil dengan bukti
5. Tunggu review dari architect
```

### 7.2 CLAUDE.MD / CODEX.MD — Adapter Tool

> **💡 Kutipan dari Anthropic:**
> *"CLAUDE.md is a special file that Claude reads at the start of every conversation. Include Bash commands, code style, and workflow rules."*

**CLAUDE.MD yang baik:**
```markdown
# Code Style
- Gunakan ES modules (import/export), bukan CommonJS (require)
- Destructure import jika memungkinkan
- Gunakan TypeScript untuk semua file baru

# Workflow
- Jalankan typecheck setelah perubahan kode
- Jalankan test spesifik, bukan seluruh test suite
- Gunakan single test untuk performa

# Aturan Penting
- JANGAN mengubah file di luar scope sprint
- SELALU update dokumentasi jika ada perubahan API
- Gunakan conventional commits
```

**Yang TIDAK boleh ada di CLAUDE.MD:**
```
❌ Deskripsi panjang tentang codebase (AI bisa baca sendiri)
❌ Informasi yang sudah umum diketahui AI
❌ Aturan yang sering berubah (gunakan file lain)
❌ Penjelasan tutorial panjang
❌ "Tulis kode yang bersih" (terlalu generik)
```

> **💡 Kutipan dari Anthropic:**
> *"Keep it concise. For each line, ask: 'Would removing this cause Claude to make mistakes?' If not, cut it. Bloated CLAUDE.md files cause Claude to ignore your actual instructions!"*

### 7.3 STATE.MD — Status Saat Ini (PALING PENTING!)

**Fungsi:** Peta real-time proyek. **Diperbarui terus-menerus** setelah setiap sprint.

```markdown
# STATE.MD - Status Proyek

## Informasi Proyek
- Nama: Dashboard Keuangan CEO
- Mulai: 2025-01-15
- Target Selesai: 2025-03-01

## Status Saat Ini
- Sprint Aktif: Sprint 3 (Executive Output Polish)
- Status: Berjalan
- Terakhir Diperbarui: 2025-02-01

## Riwayat Sprint
| Sprint | Nama | Status | Tanggal |
|--------|------|--------|---------|
| 001 | Discovery & Architecture | ✅ Selesai | 2025-01-16 |
| 002 | Sample Bundle | ✅ Selesai | 2025-01-22 |
| 003 | Executive Output Polish | 🔄 Berjalan | - |
| 004 | Testing & Refinement | ⏳ Belum | - |
| 005 | Final Integration | ⏳ Belum | - |
| 006 | Deployment | ⏳ Belum | - |

## Langkah Selanjutnya
- Selesaikan testing untuk output HTML
- Review dengan CEO

## Blokir (Blockers)
- Menunggu keputusan klien tentang format PDF

## Catatan Penting
- Sprint 2 berhasil menghasilkan prototype HTML
- Output sementara menggunakan data dummy
```

### 7.4 DECISIONS.MD — Log Keputusan

> **💡 Kutipan dari 120x.ai:**
> *"Decisions is important. I found this is critical. That's the house rules. What we decide when something is important."*

```markdown
# DECISIONS.MD - Log Keputusan

## Format
[YYYY-MM-DD] Keputusan: [Apa yang diputuskan]
  Alasan: [Mengapa]
  Dibuat oleh: [Siapa]
  Dampak: [Apa yang berubah]

## Daftar Keputusan

[2025-01-16] Keputusan: Menggunakan ExcelJS untuk parsing Excel
  Alasan: Lebih ringan dari SheetJS, cukup untuk kebutuhan demo
  Dibuat oleh: Tim
  Dampak: Perlu install exceljs sebagai dependency

[2025-01-16] Keputusan: Output newsletter dalam format HTML
  Alasan: Mudah di-share via email, tidak perlu software khusus
  Dibuat oleh: CEO
  Dampak: Output berupa file .html yang bisa dibuka di browser

[2025-01-22] Keputusan: Data dummy untuk sprint 2
  Alasan: Fokus pada UI/UX dulu, data real di sprint berikutnya
  Dibuat oleh: Tim
  Dampak: Sprint 2 menggunakan data sampel
```

### 7.5 DOMAIN.MD — Domain Bisnis

**Fungsi:** Dunia bisnis klien Anda (bukan domain internet).

```markdown
# DOMAIN.MD - Domain Bisnis

## Tentang Perusahaan
- Nama: PT. Maju Bersama
- Bidang: Manufaktur
- Jumlah Karyawan: 50 orang

## Terminologi Penting
- "Invoice" = Tagihan yang dikirim ke klien
- "Bill" = Tagihan yang diterima dari vendor
- "SO" = Sales Order (pesanan penjualan)
- "PO" = Purchase Order (pesanan pembelian)

## Pengguna Sistem
| Role | Akses | Keterangan |
|------|-------|------------|
| CEO | Full access | Melihat semua laporan |
| CFO | Keuangan | Edit & approve laporan keuangan |
| Manager | Departemen | Akses data departemen sendiri |
| Staff | Terbatas | Input data saja |

## Aturan Bisnis
1. Laporan keuangan harus di-approve CFO sebelum dikirim ke CEO
2. Invoice > 100 juta butuh approval direktur
3. Data inventory di-update real-time
4. Backup data dilakukan setiap hari jam 6 sore

## Pain Points
- Proses konsolidasi data dari 5 spreadsheet memakan 3-4 jam/minggu
- Format laporan tidak konsisten antar departemen
- Sulit melacak perubahan data dari waktu ke waktu
```

### 7.6 RISKS.MD — Daftar Risiko

```markdown
# RISKS.MD - Daftar Risiko

## Format
⚠️ [KEMungkinan: Tinggi/Sedang/Rendah] RISIKO: [Deskripsi]
  Dampak: [Tinggi/Sedang/Rendah]
  Mitigasi: [Solusi]

## Daftar Risiko

⚠️ [TINGGI] RISIKO: API pihak ketiga memiliki rate limit ketat
  Dampak: Tinggi — aplikasi bisa error saat banyak request
  Mitigasi: Implementasi caching, retry logic, dan queue

⚠️ [SEDANG] RISIKO: Data Excel dari klien format tidak konsisten
  Dampak: Sedang — parsing bisa gagal
  Mitigasi: Buat parser fleksibel dengan validasi input

⚠️ [SEDANG] RISIKO: Perubahan kebutuhan di tengah sprint
  Dampak: Sedang — scope creep
  Mitigasi: Dokumentasikan semua perubahan, buat sprint baru jika perlu

⚠️ [RENDAH] RISIKO: Tool AI mengubah dependensi ke versi lama
  Dampak: Rendah — compatibility issues
  Mitigasi: Pin versi di specification, verifikasi manual
```

### 7.7 QUESTIONS.MD — Pertanyaan Terbuka

```markdown
# QUESTIONS.MD - Pertanyaan Terbuka

## Format
❓ [OPEN] Pertanyaan: [Isi]
  Ditanya: [Tanggal]
  Dari: [Siapa]
  Status: [Menunggu jawaban / Dijawab]

## Pertanyaan Terbuka

❓ [OPEN] Pertanyaan: Bagaimana format laporan yang diinginkan CEO?
  Ditanya: 2025-01-15
  Dari: Architect
  Status: Menunggu jawaban dari CEO

❓ [OPEN] Pertanyaan: Apakah perlu integrasi dengan sistem ERP yang ada?
  Ditanya: 2025-01-16
  Dari: Builder
  Status: Menunggu keputusan CTO

## Pertanyaan yang Sudah Dijawab

✅ [CLOSED] Pertanyaan: Berapa banyak spreadsheet yang perlu diproses?
  Jawaban: 5 spreadsheet utama + 2 PDF pendukung
  Ditutup: 2025-01-14

✅ [CLOSED] Pertanyaan: Siapa pengguna utama?
  Jawaban: CEO, CFO, dan Business Owner
  Ditutup: 2025-01-15
```

---

