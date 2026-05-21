# 07: Skill Dasar

> **Encapsulate reusable expertise - load on demand**

**Estimasi**: 20 menit belajar + 25 menit praktik | **Level**: Intermediate

## 🎯 Outcome
- Paham konsep desain Skill
- Buat SKILL.md yang proper
- Config permission Skill
- Bedakan Skill vs CLAUDE.md
- Bangun skill untuk administrasi sekolah

## 🤔 Kenapa Butuh Skill?

### Masalah Tanpa Skill

AI kasih jawaban generic karena tidak tahu konteks spesifik:

```
User: "Cek realisasi BOS bulan ini"

Tanpa Skill:
→ AI: "Saya tidak punya akses ke data BOS Anda. 
       Berikut cara umum mengecek realisasi BOS..."
       (Jawaban generic, tidak actionable)
```

**AI tidak tahu:**
- Struktur tabel ARKAS kamu
- Definisi "realisasi" di sekolahmu
- Filter yang wajib (exclude test accounts)
- Summary table mana yang harus dipakai
- Format laporan yang diminta kepala sekolah
- Standar Kemdikbud yang berlaku

### Solusi: Skill

Skill encapsulate domain knowledge → AI load on demand.

```
User: "Cek realisasi BOS bulan ini"

Dengan Skill (arkasku):
→ AI load skill "arkasku"
→ Baca database ARKAS
→ Hitung realisasi per kegiatan
→ Bandingkan dengan RKAS
→ Generate laporan format Kemdikbud
→ Output: Laporan siap cetak
```

## 🔑 Progressive Disclosure

Skill tidak dump semua info ke context, tapi **layered loading**:

```
┌─────────────────────────────────────────────────────┐
│ Layer 1: name + description (~100 kata)             │
│ → Selalu visible, untuk decide perlu load atau tidak │
├─────────────────────────────────────────────────────┤
│ Layer 2: SKILL.md正文                                │
│ → Load saat task match, berisi instruksi utama      │
├─────────────────────────────────────────────────────┤
│ Layer 3: references/ directory                       │
│ → Load hanya saat butuh detail spesifik             │
└─────────────────────────────────────────────────────┘
```

### Mengapa Progressive Disclosure Penting?

**Context window terbatas.** Kalau semua info dimuat sekaligus:

```
❌ Tanpa progressive disclosure:
Context: 200,000 token
  - 50,000 token: Semua skill loaded
  - 30,000 token: Semua reference docs
  - 20,000 token: User prompt
  - 100,000 token: Sisa untuk response
  → Response terbatas, AI kurang "berpikir"

✅ Dengan progressive disclosure:
Context: 50,000 token
  - 5,000 token: Skill list (name + description only)
  - 15,000 token: 1 SKILL.md yang match
  - 10,000 token: 1 reference doc yang dibutuhkan
  - 20,000 token: User prompt
  - 100,000 token: Sisa untuk response
  → Response lebih berkualitas
```

### Skill vs CLAUDE.md

| Fitur | CLAUDE.md | Skill |
|-------|-----------|-------|
| **Load** | Selalu | Hanya saat match |
| **Scope** | Project saat ini | Cross-project reusable |
| **Content** | Pure Markdown | Markdown + code + resources |
| **Use Case** | Project coding standards | Domain expertise, workflows |
| **Token Cost** | Selalu bayar | Bayar hanya saat dipakai |
| **Discovery** | Manual (harus tahu ada) | Automatic (AI discover sendiri) |

**Rule of thumb**:
- Project-specific (style, branch naming) → CLAUDE.md
- Reusable expertise (data analysis, audit) → Skill
- Cross-project workflow → Skill
- One-time instruction → Langsung di prompt

**Contoh keputusan:**

```
"Selalu pakai Prettier untuk format kode"
→ CLAUDE.md (project-specific, selalu berlaku)

"Analisis data ARKAS dengan query spesifik"
→ Skill (domain expertise, dipakai saat perlu)

"Format commit message: type(scope): message"
→ CLAUDE.md (convention, selalu berlaku)

"Buat surat pindah siswa dari data Dapodik"
→ Skill (workflow spesifik, dipakai saat perlu)
```

## 📁 Struktur Direktori

### Basic

```
.opencode/
└── skill/
    └── code-review/
        └── SKILL.md      # WAJIB uppercase
```

### Recommended

```
.opencode/
└── skill/
    └── sql-analysis/
        ├── SKILL.md              # Main: workflow + key logic
        └── references/           # Detail docs (load on demand)
            ├── finance.md        # Table structure finance
            ├── product.md        # Table structure product
            └── examples.md       # Query examples
```

### Advanced Structure

```
.opencode/
└── skill/
    └── arkas-analysis/
        ├── SKILL.md              # Main skill file
        ├── references/
        │   ├── tabel-rapbs.md    # Struktur tabel RAPBS
        │   ├── tabel-anggaran.md # Struktur tabel Anggaran
        │   ├── tabel-kas.md      # Struktur tabel Kas Umum
        │   ├── standar-bos.md    # Standar biaya BOS
        │   └── contoh-laporan/   # Template laporan
        │       ├── lpj.md
        │       └── realisasi.md
        └── scripts/
            ├── query_helper.py   # Helper script
            └── export_excel.py   # Export script
```

### Lokasi Search

| Lokasi | Scope | Prioritas |
|--------|-------|-----------|
| `.opencode/skill/<name>/SKILL.md` | Current project | Tertinggi |
| `~/.config/opencode/skill/<name>/SKILL.md` | Global user | Sedang |
| `.claude/skills/<name>/SKILL.md` | Claude compatible | Rendah |
| `~/.claude/skills/<name>/SKILL.md` | Claude compatible | Rendah |

> Support nested dirs: `.opencode/skill/audit/security/SKILL.md`
> Skill name = nama folder terakhir sebelum SKILL.md

### Naming Convention

```
✓ code-review
✓ sql-analysis
✓ git-release
✓ arkas-analysis
✓ dapodik-lookup
✗ Code_Review     ← No uppercase
✗ sql--analysis   ← No double dash
✗ -review         ← No leading dash
✗ review_arkas    ← No underscore
```

Regex: `^[a-z0-9]+(-[a-z0-9]+)*$`

## 📝 Format SKILL.md

### Required Frontmatter

```yaml
---
name: sql-analysis
description: |
  Analisis business data: revenue, ARR, customer segmentation.
  Menyediakan: table structure, metric definitions, required filters.
  Cocok untuk: SQL analysis, understanding metrics, data warehouse queries.
  Tidak cocok: DB admin, DDL operations, performance tuning.
---
```

| Field | Required | Keterangan |
|-------|----------|------------|
| `name` | ✅ | Skill identifier (lowercase, dash-separated) |
| `description` | ✅ | **PALING PENTING** - trigger condition |

### Optional Frontmatter

```yaml
---
name: arkas-analysis
description: |
  Analisis data keuangan ARKAS sekolah.
  Menyediakan: struktur tabel, query template, format laporan.
  Cocok untuk: cek realisasi BOS, generate LPJ, analisis anggaran.
  Tidak cocok: input data ARKAS, edit database langsung.
version: 1.0.0
author: Operator SDN Pasirhalang
created: 2026-04-15
updated: 2026-04-20
tags: [arkas, bos, keuangan, lpj, realisasi]
---
```

### description Template

```yaml
description: |
  [1 kalimat core capability]
  Menyediakan: [resources in this Skill]
  Cocok untuk: [scenario1], [scenario2], [scenario3]
  Tidak cocok: [edge case1], [edge case2]
```

**Kenapa description sangat penting?**

Description adalah SATU-SATUNYA hal yang AI lihat untuk memutuskan apakah perlu load Skill atau tidak. Description yang buruk = Skill tidak pernah dipakai.

```
❌ Description buruk:
description: "Skill untuk analisis data"
→ Terlalu vague, AI tidak tahu kapan harus load

✅ Description bagus:
description: |
  Analisis data keuangan ARKAS: realisasi BOS, perbandingan RKAS vs realisasi,
  generate laporan LPJ. Menyediakan: struktur tabel RAPBS/Anggaran/Kas Umum,
  query template, format laporan Kemdikbud.
  Cocok untuk: cek realisasi BOS, generate LPJ, analisis anggaran per kegiatan.
  Tidak cocok: input data ARKAS, edit database langsung, konfigurasi sistem.
→ Jelas kapan harus load, kapan tidak
```

### Contoh Lengkap SKILL.md

```markdown
---
name: sql-analysis
description: |
  Analisis business data: revenue trends, ARR, customer segments.
  Menyediakan: company table structure, metric formulas, standard filters.
  Cocok untuk: SQL analysis, understanding metrics, querying data warehouse.
  Tidak cocok: DB management, DDL operations, performance tuning.
---

# SQL Analysis Skill

## Quick Workflow

Saat user minta data analysis:

1. **Clarify requirements**
   - Time range? (default: current year)
   - Customer segment?
   - Decision purpose?

2. **Check existing dashboards**
   - See `references/dashboards.md` for existing reports

3. **Determine data source**
   - Prefer summary tables over raw event data

4. **Execute analysis**
   - Apply required filters (exclude test accounts)
   - Validate results against known benchmarks

## Standard Filters

All revenue queries MUST:
- Exclude test accounts: `WHERE account != 'Test'`
- Only complete periods: `WHERE month <= DATE_TRUNC(CURRENT_DATE(), MONTH)`

## ARR Calculation
- Monthly to ARR: `monthly_revenue * 12`
- 7-day run rate: `rolling_7d * 52`

## Detailed Docs
- **Revenue & Finance** → `references/finance.md`
- **Product Usage** → `references/product.md`
- **Sales Pipeline** → `references/sales.md`
```

## 🏗️ Skill Types

### Type 1: Instruction Skills

Skill yang berisi instruksi/langkah-langkah untuk AI ikuti.

**Contoh: Translation Skill**

```markdown
---
name: translate
description: Professional translation preserving format and terminology. For tech docs, API docs, code comments.
---

# Translation Skill

## Standards
1. Preserve original format and structure
2. Keep proper nouns in original + annotate
3. Check terminology glossary
4. Proofread after translation

## Output Format
Wrap translation in code block:
```
{translated text}
```
```

**Karakteristik:**
- Berisi instruksi step-by-step
- Tidak butuh external resources
- Pure guidance untuk AI
- Ringan (sedikit token)

### Type 2: Tool Skills

Skill yang memberikan akses ke tools/scripts tertentu.

**Contoh: ARKAS Analysis Skill**

```markdown
---
name: arkas-analysis
description: |
  Analisis data ARKAS via SQLite database.
  Menyediakan: struktur tabel, query template, export script.
  Cocok untuk: cek realisasi, generate laporan, analisis anggaran.
---

# ARKAS Analysis Skill

## Database Access

Database ARKAS terenkripsi. Gunakan script helper:

```bash
python scripts/arkas_query.py --query "SELECT * FROM RAPBS"
```

## Table Structure

### Tabel RAPBS
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| Kd_Keg | TEXT | Kode kegiatan |
| Nm_Keg | TEXT | Nama kegiatan |
| Pagu | REAL | Pagu anggaran |
| Realisasi | REAL | Realisasi |

### Tabel Kas Umum
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| Tgl | TEXT | Tanggal transaksi |
| Uraian | TEXT | Uraian |
| Debet | REAL | Pemasukan |
| Kredit | REAL | Pengeluaran |

## Query Templates

### Realisasi per Kegiatan
```sql
SELECT Kd_Keg, Nm_Keg, Pagu, Realisasi,
       (Realisasi/Pagu*100) as Persentase
FROM RAPBS
WHERE Tahun = '2026'
ORDER BY Persentase DESC
```

### Saldo Berjalan
```sql
SELECT Tgl, Uraian, Debet, Kredit,
       SUM(Debet-Kredit) OVER (ORDER BY Tgl) as Saldo
FROM KasUmum
WHERE Tgl BETWEEN '2026-01-01' AND '2026-12-31'
```

## Export
```bash
python scripts/export_excel.py --output laporan.xlsx
```
```

**Karakteristik:**
- Berisi informasi tools/scripts
- Query templates, API endpoints
- Struktur data
- Butuh external resources

### Type 3: Workflow Skills

Skill yang mendefinisikan workflow lengkap.

**Contoh: Surat Pindah Siswa**

```markdown
---
name: surat-pindah
description: |
  Buat surat pindah siswa otomatis dari data Dapodik.
  Mendukung konfirmasi jika nama ditemukan lebih dari satu siswa.
  Cocok untuk: surat pindah masuk/keluar, mutasi siswa.
---

# Surat Pindah Skill

## Workflow

### Step 1: Cari Siswa
1. Minta nama siswa dari user
2. Cari di database Dapodik
3. Jika ditemukan > 1, tampilkan list untuk konfirmasi
4. Jika tidak ditemukan, notify user

### Step 2: Ambil Data
Dari data siswa yang dikonfirmasi:
- Nama lengkap
- NISN
- Tempat, tanggal lahir
- Kelas saat ini
- Nama orang tua
- Alamat

### Step 3: Generate Surat
Gunakan template di `references/template-surat-pindah.md`
Isi data siswa ke template

### Step 4: Review
Tampilkan draft surat ke user
Minta konfirmasi atau revisi

### Step 5: Output
- Simpan sebagai PDF
- Atau tampilkan untuk copy-paste

## Template Variables
| Variable | Source |
|----------|--------|
| {{NAMA_SISWA}} | Data PD |
| {{NISN}} | Data PD |
| {{TTL}} | Data PD |
| {{KELAS}} | Data Rombel |
| {{NAMA_ORTU}} | Data PD |
| {{ALAMAT}} | Data PD |
| {{TANGAT_SURAT}} | Current date |
| {{NOMOR_SURAT}} | Auto-increment |
```

**Karakteristik:**
- Workflow multi-step
- Conditional logic
- Template-based output
- User interaction points

## 🔍 Skill Discovery & Loading

### Discovery Process

```
OpenCode startup
    ↓
Scan semua lokasi skill
    ↓
Parse frontmatter (name + description)
    ↓
Register ke skill registry
    ↓
Available untuk AI discover
```

### Loading Process

```
User: "Analisis revenue kuartal lalu"
    ↓
AI analyze intent: "data analysis task"
    ↓
AI scan skill registry:
  - code-review: "Review kode..." → NO MATCH
  - sql-analysis: "Analisis business data..." → MATCH!
  - translate: "Professional translation..." → NO MATCH
    ↓
AI call: skill({ name: "sql-analysis" })
    ↓
SKILL.md content loaded ke context
    ↓
AI execute dengan guidance dari Skill
```

### Trigger Types

**1. Automatic Triggers**

AI otomatis load Skill saat task match description:

```
User: "Cek realisasi BOS"
→ AI match: "arkas-analysis" (description: "Analisis data keuangan ARKAS...")
→ Auto-load skill
```

**2. Manual Invocation**

User explicitly minta pakai Skill:

```
User: "Pakai skill arkas-analysis untuk cek realisasi"
→ AI load skill yang diminta
```

**3. Context-Based Activation**

Skill load berdasarkan context:

```
User sedang edit file ARKAS database
→ AI detect context: "ARKAS"
→ Suggest load skill "arkas-analysis"
```

## 🔒 Permission Config

### Global Permission

```jsonc
{
  "permission": {
    "skill": {
      "pr-review": "allow",     // Auto-load tanpa tanya
      "internal-*": "deny",     // Hidden, tidak bisa diakses
      "experimental-*": "ask",  // Tanya user sebelum load
      "*": "allow"              // Default: allow semua
    }
  }
}
```

| Value | Behavior | Use Case |
|-------|----------|----------|
| `allow` | Immediate load | Skill yang aman dan sering dipakai |
| `deny` | Hidden dari agent | Skill internal, deprecated, sensitive |
| `ask` | Prompt user sebelum load | Skill experimental, butuh konfirmasi |

> Support wildcards: `internal-*` matches `internal-docs`, `internal-tools`, etc.

### Per-Agent Override

**Markdown Agent:**

```yaml
---
name: plan
description: Planning agent untuk desain arsitektur
permission:
  skill:
    "documents-*": "allow"
    "code-*": "deny"
---
```

**JSON Config:**

```jsonc
{
  "agent": {
    "plan": {
      "permission": {
        "skill": {
          "internal-*": "allow",
          "experimental-*": "ask"
        }
      }
    },
    "build": {
      "permission": {
        "skill": {
          "code-*": "allow",
          "deploy-*": "ask"
        }
      }
    }
  }
}
```

### Disable Skill Tool

```yaml
---
name: restricted-agent
description: Agent dengan akses skill terbatas
tools:
  skill: false
---
```

Agent ini tidak bisa load Skill apapun.

### Permission Best Practices

```jsonc
{
  "permission": {
    "skill": {
      // Skill yang aman: auto-load
      "arkas-analysis": "allow",
      "dapodik-lookup": "allow",
      "surat-pindah": "allow",

      // Skill yang butuh konfirmasi
      "database-modify": "ask",
      "bulk-export": "ask",

      // Skill internal: hidden
      "internal-debug": "deny",
      "internal-test": "deny",

      // Default: allow
      "*": "allow"
    }
  }
}
```

## 📦 Skill Installation

### Manual Install

1. Buat folder skill:

```bash
mkdir -p .opencode/skill/my-skill
```

2. Buat SKILL.md:

```bash
# Buat file SKILL.md di folder skill
touch .opencode/skill/my-skill/SKILL.md
```

3. Edit SKILL.md dengan frontmatter dan content.

4. Restart OpenCode atau reload skills.

### Install dari Git

```bash
# Clone skill repository
git clone https://github.com/user/opencode-skills.git /tmp/skills

# Copy skill yang diinginkan
cp -r /tmp/skills/arkas-analysis .opencode/skill/
cp -r /tmp/skills/dapodik-lookup .opencode/skill/
```

### Install dari Package Manager

```bash
# Install skill package (jika tersedia)
opencode skill install arkas-analysis
opencode skill install dapodik-lookup

# List installed skills
opencode skill list

# Update skills
opencode skill update
```

### Install dari Community

```bash
# Search community skills
opencode skill search "arkas"

# Install from community
opencode skill install community/arkas-analysis
```

## 🔄 Skill Versioning

### Version di Frontmatter

```yaml
---
name: arkas-analysis
description: |
  Analisis data keuangan ARKAS...
version: 1.2.0
---
```

### Semantic Versioning

```
1.2.0
│ │ │
│ │ └─ Patch: Bug fix, clarification (backward compatible)
│ └─── Minor: New feature, new reference (backward compatible)
└───── Major: Breaking change, workflow change
```

### Backward Compatibility

**✅ Backward compatible (minor/patch):**

```markdown
# Tambah section baru
## New Feature
...

# Tambah reference doc
## Detailed Docs
- **New Table** → `references/new-table.md`

# Clarify instruction
# (ubah penjelasan, bukan workflow)
```

**❌ Breaking change (major):**

```markdown
# Ubah workflow
## Quick Workflow
# (step yang berubah)

# Hapus section
# (feature yang dihapus)

# Ubah nama reference
# (path yang berubah)
```

### Changelog

```markdown
## Changelog

### v1.2.0 (2026-04-20)
- Tambah query template untuk Kas Umum
- Update struktur tabel RAPBS

### v1.1.0 (2026-04-10)
- Tambah export Excel script
- Fix query realisasi

### v1.0.0 (2026-04-01)
- Initial release
```

## 🏫 Real-World: School Admin Skills

### Skill 1: ARKAS Analysis

```markdown
---
name: arkas-analysis
description: |
  Analisis data keuangan ARKAS (Aplikasi Rencana Kegiatan dan Anggaran Sekolah).
  Membaca database terenkripsi ARKAS, query tabel RAPBS/Anggaran/Kas Umum/PTK.
  Cocok untuk: cek realisasi BOS, generate LPJ, analisis anggaran per kegiatan,
  export data ke Excel/CSV.
  Tidak cocok: input data ARKAS, edit database langsung, konfigurasi sistem.
version: 1.0.0
---

# ARKAS Analysis Skill

## Database Access

Database ARKAS: `C:\Users\USER\ARKAS\arkas.db` (terenkripsi)
Gunakan script helper untuk akses.

## Quick Workflow

### Cek Realisasi BOS
1. Query tabel RAPBS untuk daftar kegiatan + pagu
2. Query tabel Kas Umum untuk realisasi
3. Hitung persentase realisasi per kegiatan
4. Generate tabel ringkasan

### Generate LPJ
1. Kumpulkan semua transaksi periode LPJ
2. Kelompokkan per kegiatan
3. Hitung total per kegiatan
4. Format sesuai template Kemdikbud
5. Export ke Excel/PDF

## Table Reference
- RAPBS → `references/tabel-rapbs.md`
- Anggaran → `references/tabel-anggaran.md`
- Kas Umum → `references/tabel-kas.md`
- PTK → `references/tabel-ptk.md`

## Query Templates
- Realisasi per kegiatan → `references/query-realisasi.md`
- Saldo berjalan → `references/query-saldo.md`
- Analisis trend → `references/query-trend.md`
```

### Skill 2: Dapodik Student Lookup

```markdown
---
name: dapodik-student-lookup
description: |
  Cari data lengkap siswa berdasarkan nama dan/atau kelas dari Dapodik Web Service.
  Menyediakan: akses API Dapodik, format pencarian, struktur data PD.
  Cocok untuk: cari data siswa untuk surat keterangan, slip gaji orang tua,
  verifikasi data, cek NISN.
  Tidak cocok: input data baru, edit data PD, hapus data.
version: 1.0.0
---

# Dapodik Student Lookup Skill

## Quick Workflow

### Cari Siswa
1. Minta nama siswa (bisa partial match)
2. Optional: minta kelas untuk filter
3. Query Dapodik Web Service
4. Jika > 1 hasil, tampilkan list untuk konfirmasi
5. Tampilkan data lengkap siswa yang dipilih

## Data Structure
- Identitas: Nama, NISN, NIK, TTL, Jenis Kelamin
- Alamat: Jalan, RT/RW, Desa, Kecamatan, Kabupaten
- Orang Tua: Nama Ayah, Nama Ibu, Pekerjaan, No HP
- Akademik: Kelas, Rombel, Tahun Ajaran

## API Access
Base URL: `http://localhost:5774`
Endpoint: `/api/v1/peserta-didik`

## Output Format
Tampilkan data dalam format terstruktur untuk copy ke dokumen.
```

### Skill 3: Surat Generation

```markdown
---
name: surat-generation
description: |
  Generate surat resmi sekolah dari template.
  Mendukung: surat keterangan, surat pindah, surat tugas, surat pengantar.
  Auto-fill data dari Dapodik dan ARKAS.
  Cocok untuk: administrasi sekolah, surat-menyurat resmi.
  Tidak cocok: surat pribadi, surat non-resmi.
version: 1.0.0
---

# Surat Generation Skill

## Quick Workflow

### Generate Surat
1. Tentukan jenis surat
2. Minta data yang diperlukan (atau auto-fill dari Dapodik)
3. Isi template
4. Tampilkan draft untuk review
5. Export ke PDF/DOCX

## Template Types
- Surat Keterangan Siswa → `templates/surat-keterangan.md`
- Surat Pindah → `templates/surat-pindah.md`
- Surat Tugas → `templates/surat-tugas.md`
- Surat Pengantar → `templates/surat-pengantar.md`
- Surat Keterangan Tidak Mampu → `templates/sktm.md`

## Auto-Fill Sources
- Data siswa → Dapodik Web Service
- Data sekolah → Config sekolah
- Nomor surat → Auto-increment
- Tanggal → Current date

## Output
Format: DOCX atau PDF
Template: Sesuai format resmi Kemdikbud
```

## ⚠️ Pitfalls

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Skill tidak load | SKILL.md case salah | Harus uppercase `SKILL.md` |
| Skill tidak muncul | Missing frontmatter | Wajib `name` + `description` |
| Match tapi tidak trigger | Description terlalu vague | Tambahkan specific capability, scenarios, boundaries |
| Name conflict | Multiple definitions | Later load overrides earlier |
| Access denied | Permission = deny | Cek permission config |
| Skill tidak update | Cache | Restart OpenCode atau clear cache |
| Reference tidak ditemukan | Path salah | Cek path relatif dari SKILL.md |
| Token terlalu banyak | Skill terlalu besar | Pindahkan detail ke references/ |

### Debug Checklist

```
[ ] SKILL.md ada dan uppercase?
[ ] Frontmatter valid (name + description)?
[ ] Description spesifik dan jelas?
[ ] Name unique (tidak conflict)?
[ ] Permission allow untuk skill ini?
[ ] Reference paths benar?
[ ] Tidak ada syntax error di frontmatter?
```

## 📝 Ringkasan

1. **Progressive disclosure** - load on demand, hemat context window
2. **Directory structure** - `skill/<name>/SKILL.md` + `references/`
3. **SKILL.md format** - `name` + `description` required, optional fields
4. **Description** - specific capability + scenarios + boundaries (PALING PENTING)
5. **3 Skill types** - Instruction, Tool, Workflow
6. **Discovery & loading** - automatic, manual, context-based
7. **Permission** - allow/ask/deny + wildcards + per-agent override
8. **Installation** - manual, git, package manager, community
9. **Versioning** - semantic versioning, backward compatibility, changelog
10. **vs CLAUDE.md** - on-demand vs always-loaded, cross-project vs project-specific
11. **Real-world skills** - ARKAS analysis, Dapodik lookup, surat generation
12. **Pitfalls** - common issues dan troubleshooting checklist
