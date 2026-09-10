## 8. WORKFLOW LENGKAP 6 TAHAP

### 8.1 Gambaran Besar Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    WORKFLOW 6 TAHAP                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  TAHAP 1: PERSIAPAN                                               │
│  ├── Buat folder proyek                                          │
│  ├── Setup project di LLM                                        │
│  ├── Set custom instructions                                     │
│  └── Upload referensi                                            │
│       ↓                                                           │
│  TAHAP 2: DISCOVERY & BRAINSTORMING                              │
│  ├── Mulai percakapan dengan architect                           │
│  ├── Jawab semua pertanyaan architect                            │
│  ├── Brainstorm solusi                                           │
│  └── Definisikan masalah & tujuan                                │
│       ↓                                                           │
│  TAHAP 3: BUAT ARCHITECT PACK                                    │
│  ├── Requirements (Apa & Mengapa)                                │
│  ├── Blueprint (Bagaimana)                                       │
│  ├── Acceptance Criteria (Kriteria Selesai)                      │
│  └── Handoff Prompt (Prompt untuk Builder)                       │
│       ↓                                                           │
│  TAHAP 4: HANDOFF KE BUILDER                                     │
│  ├── Simpan architect pack di folder                             │
│  ├── Buka builder tool                                           │
│  ├── Paste handoff prompt                                        │
│  └── Builder dry run → Lapor hasil                               │
│       ↓                                                           │
│  TAHAP 5: BUILDER BEKERJA                                        │
│  ├── Review dry run result                                       │
│  ├── Approve → Builder mulai coding                              │
│  ├── Builder selesai → Lapor hasil                               │
│  └── Builder update folder proyek                                │
│       ↓                                                           │
│  TAHAP 6: REVIEW & LANJUT                                        │
│  ├── Architect review hasil builder                              │
│  ├── Sanity check dengan data asli                               │
│  ├── Buat architect pack untuk sprint berikutnya                 │
│  └── Ulangi dari Tahap 3 untuk sprint berikutnya                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Tahap 1: Persiapan (Detail)

#### Langkah 1.1: Buat Folder Proyek
```bash
# Di terminal atau file manager:
mkdir dashboard-keuangan-ceo
cd dashboard-keuangan-ceo

# Buat struktur folder:
mkdir -p docs planning/meetings planning/sprints/sprint-001
mkdir -p planning/sprints/sprint-02 references src architect-packs
mkdir -p .claude/skills .claude/agents .claude/hooks
```

#### Langkah 1.2: Buat File Kosong
```bash
# Buat semua file markdown yang diperlukan:
touch AGENTS.MD CLAUDE.MD README.MD STATE.MD DECISIONS.MD
touch DOMAIN.MD RISKS.MD QUESTIONS.MD FILE-INVENTORY.MD
touch docs/ARCHITECTURE.MD docs/DATA-MODEL.MD docs/API.MD
touch docs/PERMISSIONS.MD docs/VALIDATION.MD
```

#### Langkah 1.3: Isi File Kosong dengan Template
Copy template dari Bagian 7 ke masing-masing file.

### 8.3 Tahap 2: Discovery & Brainstorming (Detail)

#### Mulai Percakapan dengan Architect

```
CONTOH PROMPT AWAL:
═══════════════════════════════════════════════════

Saya ingin membangun [deskripsi aplikasi].

Saya menggunakan metode Architect-Builder. Tolong bantu saya 
brainstorm dan buat rencana awal.

Masalah yang ingin diselesaikan:
[Deskripsi masalah bisnis]

Pengguna utama:
[Siapa yang akan menggunakan]

Pain points saat ini:
[Apa yang menjadi masalah]

Format output yang diinginkan:
[Apa yang diharapkan]

═══════════════════════════════════════════════════
```

#### Architect Akan Bertanya Banyak Hal

```
Architect: "Ini ide bagus. Sebelum saya buat rencana, 
            saya perlu memahami beberapa hal:

  1. Workflow saat ini seperti apa?
     → Bagaimana proses berjalan sekarang?

  2. Dimana waktu terbuang?
     → Berapa lama proses ini sekarang?

  3. Siapa saja pengguna utama?
     → Berapa banyak role yang berbeda?

  4. Apa format output yang diinginkan?
     → HTML? PDF? Dashboard?

  5. Apa batasan teknis yang ada?
     → Budget? Timeline? Tools yang sudah ada?

  6. Apa data sumber yang tersedia?
     → Spreadsheet? Database? API?

  7. Bagaimana dengan keamanan data?
     → Data sensitif? Compliance?

  8. Apa success metric-nya?
     → Bagaimana kita tahu proyek ini berhasil?"
```

**Tips untuk tahap ini:**
```
✅ Jawab dengan detail, meski masih kasar
✅ Gunakan bahasa bisnis Anda sehari-hari
✅ Jangan takut salah — architect akan mengklarifikasi
✅ Berikan contoh konkret jika memungkinkan
✅ Jangan terburu-buru ke coding
✅ Jika tidak tahu jawabannya, bilang "belum tahu" — nanti diisi
```

### 8.4 Tahap 3: Membuat Architect Pack (Detail)

Setelah semua pertanyaan terjawab:

```
Anda: "Baik, semua pertanyaan sudah terjawab. 
       Sekarang buatkan Architect Pack untuk Sprint 1."
```

#### Isi Architect Pack (4 Dokumen)

**Dokumen 1: REQUIREMENTS.MD**
```markdown
# REQUIREMENTS - Sprint 001: Discovery & Architecture

## Tujuan Sprint
Memahami masalah bisnis secara mendalam dan membuat rencana awal.

## Apa yang Dibangun
- Dashboard untuk CEO yang menampilkan KPI utama
- Newsletter otomatis dari data spreadsheet

## Mengapa
- CEO menghabiskan 3-4 jam/minggu untuk mengkonsolidasi data
- Dengan dashboard, waktu bisa dikurangi menjadi < 30 menit

## Pengguna
- CEO (view only)
- CFO (edit & approve)
- Business Owner (view & download)

## Data Sumber
- 5 spreadsheet Excel dari departemen berbeda
- 2 PDF laporan dari accountant

## Output yang Diharapkan
- Dashboard HTML interaktif
- Newsletter HTML mingguan
- Laporan bulanan untuk board meeting

## Batasan
- Tidak perlu database (gunakan Excel sebagai source)
- Tidak perlu authentication (internal tool)
- Output harus bisa di-share via email
```

**Dokumen 2: BLUEPRINT.MD**
```markdown
# BLUEPRINT - Sprint 001: Discovery & Architecture

## Arsitektur Sistem

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Excel Files  │────▶│  Parser/     │────▶│  Generator   │
│  (5 files)    │     │  Processor   │     │  (HTML)      │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                      │
                     ┌──────┴──────┐        ┌──────┴──────┐
                     │  Validation │        │  Output     │
                     │  Engine     │        │  (HTML)     │
                     └─────────────┘        └─────────────┘

## Tech Stack
- Runtime: Node.js
- Parsing: ExcelJS
- Template: Handlebars
- Testing: Jest

## File yang Akan Dibuat
1. src/parser/excel-parser.js — Parsing Excel
2. src/generator/html-generator.js — Generate HTML
3. src/validator/data-validator.js — Validasi data
4. src/index.js — Entry point

## Dependensi
- exceljs: ^4.4.0
- handlebars: ^4.7.8
- jest: ^29.7.0
```

**Dokumen 3: ACCEPTANCE.MD**
```markdown
# ACCEPTANCE CRITERIA - Sprint 001

## Definisi "Selesai"

Sprint ini dianggap SELESAI jika:

### Checklist
- [ ] Dashboard HTML bisa dibuka di browser
- [ ] Data dari Excel berhasil di-parse
- [ ] Newsletter HTML ter-generate dengan benar
- [ ] Tidak ada error saat运行
- [ ] Test cases passing

### Test Cases
1. Parse file Excel dengan data valid → Berhasil
2. Parse file Excel dengan data kosong → Error handling OK
3. Generate HTML dengan data lengkap → Output valid
4. Generate HTML dengan data parsial → Graceful degradation

### Output yang Bisa Didemonstrasikan
- Buka dashboard.html di browser → Tampil data
- Buka newsletter.html di browser → Tampil newsletter
```

**Dokumen 4: HANDOFF-PROMPT.MD**
```markdown
# HANDOFF PROMPT - Sprint 001

## Prompt untuk Builder

Anda adalah BUILDER dalam metode Architect-Builder.

Tugas Anda untuk Sprint 001:
1. Baca architect pack ini dengan seksama
2. Baca AGENTS.MD untuk aturan umum
3. Baca STATE.MD untuk status terkini
4. Lakukan dry run (simulasi tanpa kode)
5. Laporkan rencana implementasi
6. TUNGGU persetujuan sebelum coding

JANGAN:
- Mulai coding tanpa persetujuan
- Mengubah requirements
- Menggunakan library yang tidak disebutkan di blueprint

SETUJU:
- Setelah dry run disetujui, mulai coding
- Buat test untuk setiap fitur
- Update STATE.MD saat selesai
```

### 8.5 Tahap 4: Handoff ke Builder (Detail)

#### Langkah 4.1: Simpan Architect Pack
```
1. Download/copy architect pack dari architect
2. Simpan di root folder proyek:
   /dashboard-keuangan-ceo/architect-pack-001-discovery.md

3. Update folder sprint:
   /planning/sprints/sprint-001/REQUIREMENTS.MD
   /planning/sprints/sprint-001/BLUEPRINT.MD
   /planning/sprints/sprint-001/ACCEPTANCE.MD
   /planning/sprints/sprint-001/HANDOFF-PROMPT.MD
```

#### Langkah 4.2: Buka Builder Tool

**Di Codex:**
```
1. Buka Codex
2. Mulai new project
3. Point ke folder proyek:
   /Users/nama/Desktop/dashboard-keuangan-ceo
4. Mulai new chat
5. Rename chat: "Sprint 001 - Discovery & Architecture"
6. Paste prompt dari HANDOFF-PROMPT.MD
```

**Di Claude Code:**
```bash
# Buka terminal di folder proyek:
cd ~/Desktop/dashboard-keuangan-ceo

# Jalankan Claude Code:
claude

# Mulai dengan plan mode:
# Tekan Shift+Tab sampai status bar menunjukkan "⏸ plan mode"
# Lalu paste prompt dari HANDOFF-PROMPT.MD
```

#### Langkah 4.3: Builder Melakukan Dry Run

Builder akan:
```
1. Membaca architect pack
2. Membaca AGENTS.MD dan STATE.MD
3. Melakukan dry run (simulasi)
4. Melaporkan:
   ├── Apa yang akan dibangun
   ├── File apa saja yang akan dibuat/diubah
   ├── Dependensi yang diperlukan
   ├── Risiko yang teridentifikasi
   └── Rencana implementasi
5. MENUNGGU persetujuan sebelum menulis kode
```

### 8.6 Tahap 5: Builder Bekerja (Detail)

#### Review Dry Run Result
```
Anda: [review rencana builder]
     [jika ada masalah] "Tolong ubah bagian X..."
     [jika sudah OK] "Approved. Mulai coding."
```

#### Builder Mulai Coding
```
Builder akan:
1. Membuat file-file sesuai blueprint
2. Menginstall dependensi
3. Menulis kode
4. Menulis test
5. Menjalankan test
6. Memperbaiki error jika ada
7. Update folder proyek
8. Melaporkan hasil
```

#### Builder Melapor
```
Builder: "Sprint 001 selesai. Berikut hasilnya:

Files yang dibuat:
├── src/parser/excel-parser.js ✓
├── src/generator/html-generator.js ✓
├── src/validator/data-validator.js ✓
├── src/index.js ✓
├── test/parser.test.js ✓
└── test/generator.test.js ✓

Test Results:
✓ Parse valid Excel → Pass
✓ Handle empty Excel → Pass  
✓ Generate HTML → Pass
✓ Validate data → Pass

Known Limitations:
- Belum handle Excel dengan multiple sheets
- Output masih menggunakan data dummy

Output files:
├── output/dashboard.html ✓
└── output/newsletter.html ✓
```

### 8.7 Tahap 6: Review & Lanjut (Detail)

#### Langkah 6.1: Review Hasil Builder
```
1. Buka output files di browser
2. Cek apakah tampil sesuai harapan
3. Jalankan test sekali lagi
4. Catat masalah jika ada
```

#### Langkah 6.2: Sanity Check dengan Architect
```
Anda: "Builder baru saja selesai Sprint 1. 
       Ini ringkasan hasilnya:
       [paste ringkasan builder]
       
       Output files bisa dibuka di:
       - output/dashboard.html
       - output/newsletter.html
       
       Bagaimana menurut Anda? Apakah sesuai rencana?"
```

#### Langkah 6.3: Architect Review
```
Architect akan:
1. Memvalidasi hasil sesuai rencana
2. Mengidentifikasi masalah yang terlewat
3. Membuat architect pack untuk sprint berikutnya
4. Memberikan prompt baru untuk builder
```

#### Langkah 6.4: Update Folder Proyek
```
Update:
├── STATE.MD → Sprint 1 selesai, status terbaru
├── DECISIONS.MD → Keputusan yang diambil selama sprint
├── RISKS.MD → Risiko baru yang teridentifikasi
└── QUESTIONS.MD → Pertanyaan baru yang muncul
```

#### Langkah 6.5: Ulangi untuk Sprint Berikutnya
```
Mulai dari Tahap 3 untuk Sprint 2:
1. Architect membuat architect pack baru
2. Save di folder
3. Buka builder, mulai chat baru
4. Rename: "Sprint 002 - [Nama Sprint]"
5. Paste prompt baru
6. Builder bekerja
7. Review
8. Ulangi...
```

---

