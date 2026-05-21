# 05 — Custom Slash Commands

> **Estimasi:** 1 jam | **Level:** Pemula
> **Sumber:** [`awattar/claude-code-best-practices — Commands`](https://github.com/awattar/claude-code-best-practices#-custom-slash-commands), [`feiskyer/claude-code-settings`](https://github.com/feiskyer/claude-code-settings)

---

## 📖 TEORI

### Apa itu Slash Commands?

**Slash commands** adalah shortcut yang dimulai dengan karakter `/` untuk menjalankan tugas-tugas yang sering dilakukan. Mereka mirip dengan shortcut keyboard, tapi lebih powerful karena bisa menjalankan workflow kompleks dengan satu perintah.

**Perbedaan Slash Commands vs Skills:**

| Aspek | Slash Commands | Skills |
|-------|----------------|--------|
| **Trigger** | Eksplisit (`/command`) | Otomatis (keyword) atau eksplisit |
| **Scope** | Task spesifik | Workflow lengkap |
| **Kompleksitas** | Sederhana-sedang | Sedang-kompleks |
| **Argumen** | Ya, bisa ada parameter | Ya, bisa ada argumen |
| **Output** | Langsung | Mengikuti workflow |

**Analogi:** Slash command seperti tombol pintas di keyboard (Ctrl+C), sedangkan skill seperti macro yang menjalankan serangkaian tindakan.

---

### 1. Bagaimana Slash Commands Bekerja

#### 1.1 Command Execution Flow

```
┌─────────────────────────────────────────────────────────┐
│               COMMAND EXECUTION FLOW                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  User: /commit "Menambahkan fitur absensi"              │
│                         ↓                               │
│  1. PARSE                                                 │
│     Claude parse command dan arguments                   │
│     ├── Command: "commit"                                │
│     └── Arguments: "Menambahkan fitur absensi"           │
│                         ↓                               │
│  2. RESOLVE                                               │
│     Claude cari definisi command                         │
│     ├── Built-in commands (bawaan)                       │
│     ├── Custom commands (user-defined)                   │
│     └── Commands dari installed plugins                  │
│                         ↓                               │
│  3. VALIDATE                                              │
│     Cek apakah command valid                             │
│     ├── Command exists?                                  │
│     ├── Arguments match schema?                          │
│     └── Permissions OK?                                  │
│                         ↓                               │
│  4. EXECUTE                                               │
│     Jalankan command workflow                            │
│     ├── Pre-condition check                              │
│     ├── Main execution                                   │
│     └── Post-processing                                  │
│                         ↓                               │
│  5. OUTPUT                                                │
│     Tampilkan hasil ke user                              │
│     ├── Success message                                  │
│     ├── Error message (jika gagal)                       │
│     └── Next steps suggestion                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 1.2 Command Types

**Simple Command:** Tanpa argumen, langsung eksekusi.

```bash
/help
/skills list
/status
```

**Command with Arguments:** Menerima parameter.

```bash
/commit "Menambahkan fitur absensi guru"
/search "data peserta didik"
/generate-report --format pdf --semester ganjil
```

**Interactive Command:** Memandu user melalui proses.

```bash
/new-project
# Claude akan tanya:
# 1. Nama proyek?
# 2. Bahasa pemrograman?
# 3. Framework?
# 4. Struktur direktori?
```

---

### 2. Built-in Commands Overview

#### 2.1 Commands Bawaan Claude Code

| Command | Fungsi | Contoh |
|---------|--------|--------|
| `/help` | Tampilkan bantuan | `/help` |
| `/clear` | Bersihkan konteks | `/clear` |
| `/compact` | Kompres context window | `/compact` |
| `/model` | Ganti model AI | `/model claude-opus-4` |
| `/config` | Lihat/ubah konfigurasi | `/config show` |
| `/skills` | Kelola skills | `/skills list` |
| `/plugin` | Kelola plugin | `/plugin install nama` |
| `/agents` | Kelola sub-agents | `/agents list` |
| `/history` | Lihat riwayat | `/history` |
| `/export` | Export percakapan | `/export conversation.md` |

#### 2.2 Commands dari feiskyer/claude-code-settings

| Command | Fungsi | Deskripsi |
|---------|--------|-----------|
| `/specify` | Buat spesifikasi fitur | Constitution-based spec |
| `/spec-kit` | Spec-driven development | Full spec workflow |
| `/kiro` | Interactive development | Kiro-style feature dev |
| `/command-create` | Buat custom command | Command creator wizard |
| `/reflection` | Analisis session | Improve CLAUDE.md |
| `/autonomous` | Task automation | Long-running tasks |

#### 2.3 Commands dari awattar/claude-code-best-practices

| Command | Fungsi | Deskripsi |
|---------|--------|-----------|
| `/commit` | Conventional commit | Analisis diff + commit |
| `/issue` | Fix GitHub issue | End-to-end issue fix |
| `/reviewpr` | Review pull request | Komprehensif PR review |
| `/test` | Run dan fix tests | Test coverage improvement |
| `/custom-init` | Generate CLAUDE.md | Auto project context |
| `/help-commands` | Dokumentasi commands | Semua commands tersedia |

---

### 3. Command Detail: Git & Version Control

#### 3.1 `/commit` — Conventional Commit

Command ini menganalisis perubahan yang di-stage dan membuat commit message dengan format conventional.

**Format Conventional Commit:**
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types yang umum:**
| Type | Deskripsi | Contoh |
|------|-----------|--------|
| `feat` | Fitur baru | `feat: menambahkan fitur absensi` |
| `fix` | Bug fix | `fix: error saat export Excel` |
| `docs` | Dokumentasi | `docs: update README` |
| `style` | Formatting | `style: format kode dengan Prettier` |
| `refactor` | Refactoring | `refactor: extract fungsi validasi` |
| `test` | Testing | `test: tambah unit test auth` |
| `chore` | Maintenance | `chore: update dependencies` |

**Penggunaan:**

```bash
# Commit dengan pesan custom
/commit "Menambahkan fitur absensi guru"

# Claude akan:
# 1. Jalankan git diff --staged
# 2. Analisis perubahan
# 3. Rekomendasikan conventional commit message
# 4. Buat commit

# Output:
# feat: menambahkan fitur absensi guru
#
# - Tambah form input absensi harian
# - Tambah tabel riwayat absensi
# - Validasi input tanggal dan status
```

**Implementasi detail:**

```bash
# Step 1: Cek status git
git status

# Step 2: Lihat staged changes
git diff --staged --stat

# Step 3: Analisis perubahan
# Claude membaca diff dan menentukan:
# - Type (feat/fix/docs/etc)
# - Scope (modul yang berubah)
# - Description (ringkasan perubahan)

# Step 4: Buat commit
git commit -m "feat(absensi): menambahkan fitur absensi guru

- Form input absensi harian dengan validasi
- Tabel riwayat absensi dengan filter tanggal
- Export data absensi ke Excel
- Notifikasi guru yang belum absen"
```

**Best Practices `/commit`:**
- Selalu stage perubahan dulu: `git add .`
- Gunakan pesan yang deskriptif
- Sertakan scope jika perubahan spesifik ke satu modul
- Body commit untuk perubahan kompleks
- Footer untuk breaking changes atau issue reference

```bash
# Dengan breaking change
/commit "Refactor API authentication"
# Output: feat(api)!: refactor authentication menggunakan JWT

# BREAKING CHANGE: Endpoint /api/login sekarang memerlukan
# Authorization header dengan Bearer token.
# Migrasi guide: update semua API calls untuk include token.

# Dengan issue reference
/commit "Fix error export Excel"
# Output: fix(export): perbaiki error saat export data besar

# Fixes #123
```

#### 3.2 `/issue` — Fix GitHub Issue

Command untuk menyelesaikan GitHub issue secara end-to-end.

```bash
# Fix issue spesifik
/issue #42

# Claude akan:
# 1. Baca issue #42 dari GitHub
# 2. Analisis problem description
# 3. Buat branch baru: fix/issue-42
# 4. Implementasi fix
# 5. Test perubahan
# 6. Commit dan push
# 7. Buat pull request
# 8. Link PR ke issue
```

**Workflow detail:**

```bash
# 1. Fetch issue
gh issue view 42 --json title,body,labels

# 2. Buat branch
git checkout -b fix/issue-42

# 3. Implementasi
# ... Claude coding ...

# 4. Test
npm test
# atau
python -m pytest

# 5. Commit
git add .
/commit "Fix #42: [deskripsi fix]"

# 6. Push dan create PR
git push origin fix/issue-42
gh pr create --title "Fix #42: [deskripsi]" --body "Fixes #42"
```

#### 3.3 `/reviewpr` — Review Pull Request

Command untuk melakukan code review pada pull request.

```bash
# Review PR spesifik
/reviewpr #15

# Claude akan:
# 1. Fetch PR details dan diff
# 2. Review setiap perubahan
# 3. Cek:
#    - Code quality
#    - Security issues
#    - Performance impact
#    - Test coverage
#    - Documentation
# 4. Berikan feedback terstruktur
# 5. Suggest improvements
```

**Output review:**

```markdown
## Pull Request Review #15

### ✅ Strengths
- Clean code structure
- Good error handling
- Comprehensive tests

### ⚠️ Suggestions
1. **src/auth.py:45** — Missing input validation
   - Tambahkan validasi untuk email format
   - Gunakan regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`

2. **src/export.py:120** — Potential memory leak
   - Gunakan generator untuk data besar
   - Hindari load semua data ke memory

3. **tests/test_auth.py** — Missing test cases
   - Tambah test untuk invalid email
   - Tambah test untuk duplicate user

### 🔒 Security
- [ ] Sanitize user input di endpoint `/api/search`
- [ ] Add rate limiting di endpoint login

### 📊 Coverage
- Current: 78%
- Target: 85%
- Missing: auth edge cases, export large data
```

---

### 4. Command Detail: Testing

#### 4.1 `/test` — Run dan Improve Tests

```bash
# Run semua tests
/test

# Run tests spesifik
/test tests/test_auth.py

# Run dengan coverage
/test --coverage

# Fix failing tests
/test --fix
```

**Workflow:**

```bash
# 1. Identify test runner
# Claude cek: package.json, pytest.ini, jest.config.js, dll

# 2. Run tests
npm test
# atau
python -m pytest

# 3. Analisis hasil
# - Passed: ✅
# - Failed: ❌
# - Skipped: ⏭️

# 4. Untuk failing tests:
# a. Baca test code
# b. Baca implementation code
# c. Identifikasi root cause
# d. Fix test atau implementation
# e. Re-run tests

# 5. Improve coverage
# a. Identify uncovered lines
# b. Write additional tests
# c. Verify coverage increase
```

**Contoh output:**

```
## Test Results

### Summary
- Total: 45 tests
- Passed: 42 ✅
- Failed: 2 ❌
- Skipped: 1 ⏭️

### Failed Tests

1. test_export_large_data
   Location: tests/test_export.py:89
   Error: MemoryError - data too large
   Fix: Gunakan pagination atau generator

2. test_invalid_email_format
   Location: tests/test_auth.py:34
   Error: AssertionError - validation not triggered
   Fix: Tambahkan email validation di endpoint

### Coverage
- Lines: 78.5%
- Branches: 65.2%
- Functions: 82.1%

### Recommendations
1. Tambah test untuk edge cases di export
2. Tambah test untuk error handling di auth
3. Target coverage: 85%
```

---

### 5. Command Detail: Project

#### 5.1 `/custom-init` — Generate CLAUDE.md

Command untuk membuat file CLAUDE.md secara otomatis berdasarkan analisis proyek.

```bash
/custom-init

# Claude akan:
# 1. Scan struktur direktori
# 2. Analisis package.json/requirements.txt
# 3. Identifikasi framework dan tools
# 4. Baca existing documentation
# 5. Generate CLAUDE.md yang komprehensif
```

**Output CLAUDE.md yang di-generate:**

```markdown
# Context for Claude Code

## Project Overview
- **Name:** Sistem Informasi SD Negeri Pasirhalang
- **Type:** Web Application
- **Language:** JavaScript/TypeScript
- **Framework:** Next.js 15
- **Database:** SQLite (ARKAS), PostgreSQL (Dapodik)

## Tech Stack
- Frontend: Next.js, React 19, Tailwind CSS
- Backend: Next.js API Routes, tRPC
- Database: SQLite, Prisma ORM
- Testing: Vitest, Playwright
- Deployment: Vercel

## Directory Structure
```
src/
├── app/              # Next.js app router
├── components/       # React components
├── lib/              # Utilities
├── services/         # External services
└── types/            # TypeScript types
```

## Commands
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run test      # Run tests
npm run lint      # Run ESLint
```

## Conventions
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Feature branches
```

#### 5.2 `/help-commands` — Dokumentasi Commands

```bash
/help-commands

# Output: daftar semua commands yang tersedia
```

---

### 6. Membuat Custom Slash Commands

#### 6.1 Metode 1: Via `/command-create`

Repo feiskyer menyediakan command creator wizard:

```bash
/command-create

# Claude akan memandu:
# 1. Nama command? (tanpa /)
# 2. Deskripsi command?
# 3. Apa yang command lakukan?
# 4. Apakah butuh argumen?
# 5. Apakah butuh permissions khusus?

# Claude akan generate:
# - Command definition file
# - Script implementation (jika perlu)
# - Documentation
```

#### 6.2 Metode 2: Manual File Creation

**Struktur file command:**

```
~/.config/opencode/commands/
├── commit.json           # Command definition
├── issue.json
├── reviewpr.json
├── generate-slip-gaji.json
├── export-arkas.json
└── verval-pd.json
```

**Format file command (JSON):**

```json
{
  "name": "generate-slip-gaji",
  "description": "Generate slip gaji untuk guru/PTK",
  "usage": "/generate-slip-gaji [nama_guru] [bulan] [tahun]",
  "arguments": [
    {
      "name": "nama_guru",
      "type": "string",
      "required": true,
      "description": "Nama guru atau PTK"
    },
    {
      "name": "bulan",
      "type": "string",
      "required": true,
      "description": "Bulan (1-12 atau nama bulan)",
      "enum": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"]
    },
    {
      "name": "tahun",
      "type": "number",
      "required": false,
      "default": 2025,
      "description": "Tahun anggaran"
    }
  ],
  "permissions": {
    "fileRead": ["**/*.db", "**/*.json"],
    "fileWrite": ["**/*.pdf", "**/*.docx"],
    "bash": false
  },
  "workflow": [
    "1. Cari data GTK berdasarkan nama di database Dapodik",
    "2. Ambil informasi gaji: golongan, masa kerja, tunjangan",
    "3. Hitung komponen gaji sesuai ketentuan",
    "4. Generate slip gaji dalam format PDF",
    "5. Simpan ke direktori output"
  ],
  "example": "/generate-slip-gaji 'Budi Santoso' 'januari' 2025"
}
```

**Contoh command untuk administrasi sekolah:**

```json
{
  "name": "export-arkas",
  "description": "Export data ARKAS ke Excel/CSV",
  "usage": "/export-arkas [tipe_data] [format] [periode]",
  "arguments": [
    {
      "name": "tipe_data",
      "type": "string",
      "required": true,
      "description": "Tipe data yang diexport",
      "enum": ["rapbs", "kas_umum", "ptk", "referensi", "semua"]
    },
    {
      "name": "format",
      "type": "string",
      "required": false,
      "default": "xlsx",
      "description": "Format output",
      "enum": ["xlsx", "csv", "json"]
    },
    {
      "name": "periode",
      "type": "string",
      "required": false,
      "description": "Periode data (semester-tahun)",
      "default": "ganjil-2025"
    }
  ],
  "workflow": [
    "1. Baca konfigurasi ARKAS dari dapodik_config.json",
    "2. Buka database ARKAS",
    "3. Query data sesuai tipe_data dan periode",
    "4. Format data sesuai output format",
    "5. Export ke file di direktori exports/",
    "6. Tampilkan summary hasil export"
  ]
}
```

```json
{
  "name": "verval-pd",
  "description": "Bantu proses verval peserta didik",
  "usage": "/verval-pd [aksi] [nama_siswa]",
  "arguments": [
    {
      "name": "aksi",
      "type": "string",
      "required": true,
      "description": "Aksi yang dilakukan",
      "enum": ["cek", "update", "verifikasi", "download"]
    },
    {
      "name": "nama_siswa",
      "type": "string",
      "required": false,
      "description": "Nama siswa (opsional, jika tidak diisi tampilkan semua)"
    }
  ],
  "workflow": [
    "1. Login ke Dapodik Web Service",
    "2. Navigasi ke menu Verval PD",
    "3. Lakukan aksi sesuai parameter",
    "4. Tampilkan hasil atau konfirmasi perubahan"
  ]
}
```

#### 6.3 Metode 3: Via AGENTS.md / CLAUDE.md

Anda bisa mendefinisikan custom commands langsung di CLAUDE.md:

```markdown
# Custom Commands

## /ringkasan-harian
Tampilkan ringkasan aktivitas sekolah hari ini:
- Jumlah siswa hadir
- Kegiatan yang dijadwalkan
- Pengeluaran hari ini
- Surat masuk/keluar

## /backup-dapodik
Backup data Dapodik:
1. Export data PD ke Excel
2. Export data GTK ke Excel
3. Export data Sarpras ke Excel
4. Simpan ke direktori backup/ dengan timestamp

## /laporan-bulanan
Generate laporan bulanan:
1. Ringkasan keuangan BOS
2. Statistik kehadiran siswa
3. Kegiatan yang dilaksanakan
4. Masalah dan tindak lanjut
```

#### 6.4 Metode 4: Via Plugin/Extension

```json
{
  "plugins": {
    "custom-commands": {
      "enabled": true,
      "commandsDir": "~/.config/opencode/commands",
      "autoLoad": true
    }
  }
}
```

---

### 7. Command Arguments

#### 7.1 Argument Types

**String Argument:**

```bash
/commit "Menambahkan fitur baru"
# Argument: "Menambahkan fitur baru" (string)
```

**Number Argument:**

```bash
/generate-report --year 2025
# Argument: 2025 (number)
```

**Boolean/Flag Argument:**

```bash
/test --coverage --verbose
# Flags: coverage=true, verbose=true
```

**Enum Argument:**

```bash
/export-arkas rapbs --format xlsx
# tipe_data="rapbs", format="xlsx"
```

**Array Argument:**

```bash
/generate-slip-gaji --guru "Budi" "Siti" "Ahmad"
# guru=["Budi", "Siti", "Ahmad"]
```

#### 7.2 Argument Parsing

Claude menggunakan pattern matching untuk parse arguments:

```bash
# Positional arguments
/command arg1 arg2 arg3
# args = ["arg1", "arg2", "arg3"]

# Named arguments
/command --name value --flag
# args = { name: "value", flag: true }

# Mixed
/command arg1 --name value --flag
# args = { positional: ["arg1"], name: "value", flag: true }

# Quoted arguments
/command "arg with spaces" --name "value with spaces"
# args = { positional: ["arg with spaces"], name: "value with spaces" }
```

#### 7.3 Argument Validation

```json
{
  "arguments": [
    {
      "name": "bulan",
      "type": "string",
      "required": true,
      "validation": {
        "pattern": "^(0?[1-9]|1[0-2]|januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)$",
        "errorMessage": "Bulan harus antara 1-12 atau nama bulan dalam Bahasa Indonesia"
      }
    },
    {
      "name": "tahun",
      "type": "number",
      "required": true,
      "validation": {
        "min": 2020,
        "max": 2030,
        "errorMessage": "Tahun harus antara 2020 dan 2030"
      }
    }
  ]
}
```

---

### 8. Command Permissions

#### 8.1 Permission Configuration

Setiap command bisa memiliki permission requirements:

```json
{
  "commandPermissions": {
    "commit": {
      "bash": ["git"],
      "fileRead": ["**/*"],
      "fileWrite": false,
      "network": false
    },
    "export-arkas": {
      "bash": ["python", "sqlite3"],
      "fileRead": ["**/*.db"],
      "fileWrite": ["**/*.xlsx", "**/*.csv"],
      "network": false
    },
    "verval-pd": {
      "bash": false,
      "fileRead": false,
      "fileWrite": false,
      "network": ["*.dapodik.kemdikbud.go.id"],
      "browser": true
    },
    "backup-dapodik": {
      "bash": ["python", "curl"],
      "fileRead": ["**/*"],
      "fileWrite": ["**/backup/**"],
      "network": ["*.dapodik.kemdikbud.go.id"]
    }
  }
}
```

#### 8.2 Permission Levels

| Level | Deskripsi | Contoh Command |
|-------|-----------|----------------|
| **safe** | Read-only, tidak ada risiko | `/help`, `/status`, `/skills list` |
| **low-risk** | Write lokal, reversible | `/commit`, `/export-arkas` |
| **medium-risk** | Network access, external API | `/verval-pd`, `/issue` |
| **high-risk** | Destructive operations | `/cleanup`, `/reset` |

#### 8.3 Permission Prompt

Untuk command berisiko, Claude akan meminta konfirmasi:

```
⚠️ Command "/backup-dapodik" memerlukan akses network ke Dapodik Web Service.
   Ini akan mendownload data peserta didik ke lokal.

   Lanjutkan? [Y/n]
```

---

### 9. Command Best Practices (dari awattar/claude-code-best-practices)

#### 9.1 Naming Conventions

```
BAIK:
/commit              # Verb, jelas fungsinya
/export-arkas        # Verb-noun, deskriptif
/generate-slip-gaji  # Verb-noun, spesifik
/verval-pd           # Noun-noun, konteks jelas

BURUK:
/c                   # Terlalu singkat
/do_thing            # Tidak deskriptif
/ARKASExportData     # Inconsistent casing
/temp_command        # Nama sementara
```

#### 9.2 Single Responsibility

Setiap command harus melakukan SATU hal dengan baik:

```
BAIK:
/commit              # Hanya commit
/export-arkas        # Hanya export ARKAS
/generate-slip-gaji  # Hanya generate slip gaji

BURUK:
/do-everything       # Commit + export + generate (terlalu banyak)
/backup-and-deploy   # Backup + deploy (seharusnya terpisah)
```

#### 9.3 Idempotent Commands

Command harus bisa dijalankan berulang tanpa efek samping:

```bash
# GOOD: Bisa dijalankan berkali-kali, hasil sama
/export-arkas rapbs --overwrite

# BAD: Setiap run menghasilkan file berbeda
/export-arkas rapbs  # File: rapbs_20250101_120000.xlsx, rapbs_20250101_120001.xlsx
```

#### 9.4 Error Handling

Command harus memberikan error message yang jelas:

```bash
# GOOD: Error message informatif
Error: Database ARKAS tidak ditemukan di path default.
Cek konfigurasi di dapodik_config.json atau gunakan --db-path.

# BAD: Error message tidak jelas
Error: Something went wrong.
```

#### 9.5 Documentation

Setiap command harus memiliki dokumentasi:

```json
{
  "name": "export-arkas",
  "description": "Export data ARKAS ke Excel/CSV",
  "usage": "/export-arkas [tipe_data] [opsi]",
  "examples": [
    "/export-arkas rapbs",
    "/export-arkas kas_umum --format csv",
    "/export-arkas semua --periode genap-2025"
  ],
  "arguments": {
    "tipe_data": "rapbs | kas_umum | ptk | referensi | semua",
    "--format": "xlsx | csv | json (default: xlsx)",
    "--periode": "semester-tahun (default: ganjil-2025)",
    "--output": "Path file output (default: exports/)"
  }
}
```

---

### 10. Real-World Command Examples untuk Administrasi Sekolah

#### 10.1 Command: Ringkasan Keuangan Harian

```json
{
  "name": "ringkasan-keuangan",
  "description": "Tampilkan ringkasan keuangan sekolah hari ini",
  "usage": "/ringkasan-keuangan [tanggal]",
  "workflow": [
    "1. Baca database ARKAS",
    "2. Query pengeluaran hari ini dari tabel kas_umum",
    "3. Query pemasukan hari ini (jika ada)",
    "4. Hitung saldo berjalan",
    "5. Tampilkan ringkasan dalam format tabel",
    "6. Tampilkan transaksi 5 hari terakhir"
  ],
  "example": "/ringkasan-keuangan 2025-01-15"
}
```

**Output:**

```
## Ringkasan Keuangan - 15 Januari 2025

### Hari Ini
| Tipe | Jumlah | Keterangan |
|------|--------|------------|
| Masuk | Rp 0 | - |
| Keluar | Rp 2.500.000 | Pembelian alat tulis |
| Saldo | Rp 45.750.000 | |

### 5 Hari Terakhir
| Tanggal | Masuk | Keluar | Saldo |
|---------|-------|--------|-------|
| 15 Jan | 0 | 2.500.000 | 45.750.000 |
| 14 Jan | 0 | 500.000 | 48.250.000 |
| 13 Jan | 10.000.000 | 0 | 48.750.000 |
| 12 Jan | 0 | 1.200.000 | 38.750.000 |
| 11 Jan | 0 | 800.000 | 39.950.000 |
```

#### 10.2 Command: Cek Data Siswa Duplikat

```json
{
  "name": "cek-duplikat",
  "description": "Cek data siswa yang duplikat di Dapodik",
  "usage": "/cek-duplikat [kriteria]",
  "arguments": [
    {
      "name": "kriteria",
      "type": "string",
      "default": "nisn",
      "enum": ["nisn", "nama", "nik"]
    }
  ],
  "workflow": [
    "1. Download data peserta didik dari Dapodik",
    "2. Group berdasarkan kriteria (NISN/nama/NIK)",
    "3. Identifikasi duplikat",
    "4. Tampilkan hasil dengan detail",
    "5. Rekomendasi tindakan"
  ]
}
```

#### 10.3 Command: Generate Surat Otomatis

```json
{
  "name": "buat-surat",
  "description": "Generate surat administrasi sekolah dari template",
  "usage": "/buat-surat [jenis_surat] [penerima]",
  "arguments": [
    {
      "name": "jenis_surat",
      "type": "string",
      "required": true,
      "enum": ["surat_tugas", "surat_keterangan", "surat_pengantar", "surat_undangan", "memo_internal"]
    },
    {
      "name": "penerima",
      "type": "string",
      "required": true,
      "description": "Nama penerima surat"
    },
    {
      "name": "tanggal",
      "type": "string",
      "required": false,
      "description": "Tanggal surat (default: hari ini)"
    }
  ],
  "workflow": [
    "1. Load template surat sesuai jenis",
    "2. Isi data sekolah dari konfigurasi",
    "3. Isi data penerima",
    "4. Generate dokumen Word/PDF",
    "5. Simpan ke direktori surat-keluar/"
  ]
}
```

#### 10.4 Command: Monitoring Dapodik

```json
{
  "name": "monitor-dapodik",
  "description": "Monitor status data Dapodik dan validasi",
  "usage": "/monitor-dapodik [komponen]",
  "arguments": [
    {
      "name": "komponen",
      "type": "string",
      "default": "semua",
      "enum": ["pd", "gtk", "sarpras", "rombel", "semua"]
    }
  ],
  "workflow": [
    "1. Cek koneksi ke Dapodik Web Service",
    "2. Download data terbaru",
    "3. Validasi kelengkapan data",
    "4. Cek data yang perlu update",
    "5. Generate laporan validasi",
    "6. Rekomendasi tindakan"
  ]
}
```

**Output:**

```
## Monitoring Dapodik - 15 Januari 2025

### Status Koneksi
✅ Dapodik Web Service: Terhubung

### Peserta Didik (PD)
- Total: 245 siswa
- Lengkap: 240 (98%)
- Perlu update: 5
  - 2 siswa: data orang tua belum lengkap
  - 1 siswa: alamat belum update
  - 2 siswa: foto belum upload

### GTK
- Total: 28 guru/PTK
- Lengkap: 27 (96.4%)
- Perlu update: 1
  - 1 guru: sertifikasi belum update

### Sarpras
- Total ruangan: 15
- Kondisi baik: 13
- Perlu perbaikan: 2

### Rombel
- Total rombel: 12
- Kapasitas optimal: 10
- Over capacity: 2 (Kelas 4A, Kelas 6B)
```

---

### 11. Command Chaining

#### 11.1 Sequential Commands

Menjalankan beberapa command secara berurutan:

```bash
# Chain 1: Backup → Export → Report
/backup-dapodik && /export-arkas semua && /laporan-bulanan

# Chain 2: Verval → Verify → Commit
/verval-pd cek && /verval-pd verifikasi && /commit "Update data Dapodik"

# Chain 3: Test → Build → Deploy
/test && /build && /deploy
```

#### 11.2 Pipeline Commands

Output dari command pertama menjadi input command kedua:

```bash
# Export data → Analisis → Generate report
/export-arkas kas_umum | /analisis-keuangan | /generate-report

# Download data → Cek duplikat → Generate surat
/download-pd | /cek-duplikat nisn | /buat-surat surat_keterangan
```

#### 11.3 Conditional Commands

Command yang berjalan berdasarkan kondisi:

```json
{
  "name": "auto-backup",
  "description": "Auto backup jika ada perubahan data",
  "workflow": [
    "1. Cek apakah ada perubahan data sejak backup terakhir",
    "2. JIKA ada perubahan:",
    "   a. Jalankan /backup-dapodik",
    "   b. Jalankan /export-arkas semua",
    "   c. Jalankan /commit 'Auto backup: [timestamp]'",
    "3. JIKA tidak ada perubahan:",
    "   a. Tampilkan pesan 'Tidak ada perubahan data'",
    "   b. Tampilkan waktu backup terakhir"
  ]
}
```

#### 11.4 Macro Commands

Command yang menjalankan beberapa sub-commands:

```json
{
  "name": "end-of-month",
  "description": "Proses end-of-month: backup, report, cleanup",
  "subCommands": [
    "/backup-dapodik",
    "/export-arkas semua --format xlsx",
    "/ringkasan-keuangan",
    "/laporan-bulanan",
    "/commit 'End of month backup dan report'"
  ],
  "workflow": [
    "Jalankan setiap sub-command secara berurutan",
    "Jika ada command yang gagal, stop dan tampilkan error",
    "Jika semua berhasil, tampilkan summary"
  ]
}
```

---

### 12. Command Troubleshooting

#### 12.1 Command Tidak Ditemukan

```bash
# Cek apakah command terdaftar
/help-commands

# Cek file command definition
ls ~/.config/opencode/commands/

# Cek format JSON valid
cat ~/.config/opencode/commands/nama-command.json | python -m json.tool
```

#### 12.2 Command Error Saat Eksekusi

```bash
# Enable verbose mode
/command-name --verbose

# Cek log
export CLAUDE_CODE_LOG_LEVEL=debug
claude

# Test command dengan argumen minimal
/command-name arg1
```

#### 12.3 Command Permission Denied

```bash
# Cek permission command
cat ~/.config/opencode/opencode.json | jq '.commandPermissions'

# Update permission
# Edit opencode.json dan tambahkan permission yang diperlukan
```

#### 12.4 Command Output Tidak Sesuai

```bash
# Cek workflow di command definition
cat ~/.config/opencode/commands/nama-command.json | jq '.workflow'

# Test setiap langkah workflow secara manual
# Identifikasi langkah yang bermasalah
```

---

### 13. Referensi dari Repositories

#### 13.1 dari awattar/claude-code-best-practices

Repo ini menyediakan best practices untuk custom commands:

```markdown
## Custom Slash Commands Best Practices

1. **Keep it simple** — Satu command, satu tanggung jawab
2. **Document everything** — Usage, arguments, examples
3. **Handle errors gracefully** — Pesan error yang informatif
4. **Test thoroughly** — Test semua argument combinations
5. **Use conventional naming** — Kebab-case, verb-first
6. **Respect permissions** — Jangan bypass security
7. **Make it idempotent** — Bisa dijalankan berulang aman
8. **Provide feedback** — Progress indicator untuk long operations
```

#### 13.2 dari feiskyer/claude-code-settings

Repo ini menyediakan framework untuk command creation:

```bash
# Command creator workflow
/command-create

# 1. Define command name and description
# 2. Define arguments and validation
# 3. Define workflow steps
# 4. Define permissions
# 5. Test command
# 6. Save to commands directory
```

---

## ✅ CHECKLIST

- [ ] Paham apa itu slash commands dan perbedaannya dengan skills
- [ ] Bisa menggunakan built-in commands (`/commit`, `/test`, `/help`)
- [ ] Memahami command execution flow
- [ ] Bisa membuat custom command sederhana
- [ ] Memahami command arguments dan validation
- [ ] Tahu cara konfigurasi command permissions
- [ ] Memahami best practices dari awattar/claude-code-best-practices
- [ ] Bisa membuat command untuk kebutuhan administrasi sekolah
- [ ] Memahami command chaining dan macro commands
- [ ] Bisa troubleshooting masalah command umum

---

> **Lanjut ke:** [`06-spesialis-ai-agents.md`](./06-spesialis-ai-agents.md)
