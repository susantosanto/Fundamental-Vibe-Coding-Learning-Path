# 10: Custom Slash Commands — Deep Dive

> **Buat command `/namaperintah` untuk 1-klik trigger task kompleks**

**Estimasi**: 15 menit belajar + 30 menit praktik | **Level**: Intermediate → Advanced

## 🎯 Outcome
- Paham arsitektur command secara mendalam: lifecycle, registration, resolution
- Buat custom slash command dengan Markdown dan JSON
- Kuasai template syntax: `$ARGUMENTS`, `$1..$N`, `` !`cmd` ``, `@file`
- Specify Agent dan model per command
- Override built-in commands
- Buat command pipeline dan composition
- Test dan debug custom commands
- Distribusi command ke tim

## 🤔 Masalah yang Diselesaikan
- Operasi sering dipakai tidak ada shortcut
- Setiap kali harus ketik prompt panjang
- Built-in commands tidak cukup untuk workflow spesifik
- Butuh standardisasi task di tim (semua pakai command yang sama)
- Butuh automation untuk tugas repetitif sekolah (LPJ, Dapodik, ARKAS)

---

## 🏗️ Command Architecture: Bagaimana Commands Bekerja

### Command Lifecycle

Setiap custom command melalui lifecycle berikut saat dipanggil:

```
1. DISCOVERY    → OpenCode scan folder command/ saat startup
2. REGISTRATION → Command didaftarkan ke TUI command registry
3. TRIGGER      → User ketik /command_name + arguments
4. RESOLUTION   → OpenCode resolve: nested path, parameter parsing
5. EXPANSION    → Template syntax di-expand ($ARGUMENTS, shell, @file)
6. EXECUTION    → Prompt yang sudah di-expand dikirim ke LLM
7. RESPONSE     → LLM generate response sesuai template
```

### Command Resolution Algorithm

Saat user mengetik `/`, TUI melakukan resolusi:

1. **Scan lokasi** (prioritas tinggi → rendah):
   - `.opencode/command/**/*.md` — project-level (prioritas tertinggi)
   - `.opencode/commands/**/*.md` — project-level (alias plural)
   - `~/.config/opencode/command/**/*.md` — global user-level
   - Command dari `opencode.jsonc` → `command` key

2. **Match nama**: Filename tanpa `.md` jadi nama command
   - `review.md` → `/review`
   - `git/commit.md` → `/git/commit`
   - `test/coverage.md` → `/test/coverage`

3. **Override built-in**: Jika nama command sama dengan built-in, custom command menang
   - `.opencode/command/help.md` override `/help` bawaan

### Command Registry Structure

Secara internal, OpenCode maintain registry seperti ini:

```
CommandRegistry {
  commands: Map<string, CommandDefinition>
  builtins: Set<string>  // /compact, /exit, /help, dll
  overrides: Map<string, string>  // nama → file path
}
```

Setiap `CommandDefinition` berisi:
- `name`: Nama command (dari filename)
- `description`: Dari frontmatter atau default
- `template`: Prompt yang akan di-expand
- `agent`: Target agent (build/plan/subagent)
- `model`: Model override
- `subtask`: Boolean, jalankan sebagai subtask atau tidak
- `source`: File path asal command

---

## 📁 Lokasi File Command — Detail Lengkap

### Struktur Direktori

```
.opencode/
├── command/                    # Folder utama commands
│   ├── review.md              → /review
│   ├── commit.md              → /commit
│   ├── translate.md           → /translate
│   │
│   ├── git/                   # Nested directory = nested command
│   │   ├── commit.md          → /git/commit
│   │   ├── changelog.md       → /git/changelog
│   │   ├── blame.md           → /git/blame
│   │   └── status.md          → /git/status
│   │
│   ├── test/
│   │   ├── run.md             → /test/run
│   │   ├── coverage.md        → /test/coverage
│   │   └── unit.md            → /test/unit
│   │
│   └── sekolah/               # Custom namespace untuk admin sekolah
│       ├── generate-lpj.md    → /sekolah/generate-lpj
│       ├── check-dapodik.md   → /sekolah/check-dapodik
│       ├── export-arkas.md    → /sekolah/export-arkas
│       └── send-reminder.md   → /sekolah/send-reminder
│
├── commands/                   # ALIAS: "commands" (plural) juga support
│   └── deploy.md              → /deploy
│
└── opencode.jsonc             # Bisa juga define command di sini
```

### Scope dan Prioritas

| Lokasi | Scope | Prioritas | Contoh Penggunaan |
|--------|-------|-----------|-------------------|
| `.opencode/command/` | Current project | Tinggi (3) | Command spesifik proyek |
| `.opencode/commands/` | Current project | Tinggi (3) | Sama seperti di atas |
| `~/.config/opencode/command/` | Global | Rendah (2) | Command untuk semua proyek |
| `opencode.jsonc` → `command` | Project root | Tinggi (3) | Batch command definition |

**Prioritas resolusi** (tinggi → rendah):
1. `.opencode/command/` dan `.opencode/commands/` (project-level)
2. `opencode.jsonc` → `command` key (project-level JSON)
3. `~/.config/opencode/command/` (global user-level)

> **Aturan**: Jika ada command同名 di project dan global, project-level yang menang.

### Nested Directory Rules

- Subfolder = namespace prefix
- `git/commit.md` → `/git/commit`
- `sekolah/lpj/generate.md` → `/sekolah/lpj/generate`
- Maksimal depth tidak dibatasi, tapi disarankan maksimal 3 level
- Karakter di folder name: alphanumeric, `-`, `_` (hindari spasi)

---

## 🔧 2 Cara Konfigurasi — Perbandingan Mendalam

### Cara 1: Markdown (Recommended)

**Kelebihan**:
- Multi-line prompt tanpa escape character
- Bisa pakai syntax highlighting di editor
- Mudah dibaca dan di-maintain
- Support frontmatter untuk metadata
- Cocok untuk prompt kompleks (10+ baris)

**Kekurangan**:
- Satu file per command
- Tidak bisa define batch command sekaligus

**Contoh**: `.opencode/command/test.md`
```markdown
---
description: Jalankan test dan tampilkan coverage
agent: build
model: anthropic/claude-opus-4-5-thinking
---

Jalankan full test suite dengan command:
!`npm test -- --coverage`

Analisis hasil dan beri saran:
1. Test mana yang gagal dan kenapa
2. Coverage yang masih rendah
3. Rekomendasi test tambahan
```

### Cara 2: JSON di opencode.jsonc

**Kelebihan**:
- Semua command di satu file
- Mudah untuk version control diff
- Bisa generate programmatically
- Cocok untuk command simpel (1-2 baris)

**Kekurangan**:
- Harus escape newline (`\n`)
- Kurang readable untuk prompt panjang
- Tidak support syntax highlighting natural

**Contoh**:
```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "command": {
    "test": {
      "template": "Jalankan full test suite, generate laporan coverage.\nFokus ke test yang gagal dan beri saran perbaikan.",
      "description": "Jalankan test dan tampilkan coverage",
      "agent": "build",
      "model": "anthropic/claude-opus-4-5-thinking"
    },
    "review": {
      "template": "Review file @$1. Fokus: bug, performa, maintainability.",
      "description": "Code review cepat"
    },
    "translate": {
      "template": "Terjemahkan ke Bahasa Indonesia: $ARGUMENTS",
      "description": "Translate text",
      "subtask": true
    }
  }
}
```

### Kapan Pakai Markdown vs JSON?

| Situasi | Rekomendasi | Alasan |
|---------|-------------|--------|
| Prompt > 3 baris | Markdown | Lebih readable |
| Banyak command simpel | JSON | Satu file, mudah manage |
| Prompt dinamis dengan shell | Markdown | Lebih mudah edit |
| Tim collaboration | Markdown | Lebih mudah review di PR |
| Programmatically generate | JSON | Mudah generate via script |

---

## 📋 Config Options — Reference Lengkap

| Option | Required | Type | Default | Keterangan |
|--------|----------|------|---------|------------|
| `template` | ✅ (JSON) | String | - | Prompt yang dikirim ke LLM. Di Markdown =正文 file setelah frontmatter |
| `description` | ❌ | String | Filename | Tampil di command list TUI saat user ketik `/` |
| `agent` | ❌ | String | `build` | Specify Agent: `build`, `plan`, atau nama custom agent |
| `model` | ❌ | String | Config default | Override model untuk command ini (format: `provider/model`) |
| `subtask` | ❌ | Boolean | `false` | `true` = jalan sebagai subtask (tidak polusi main context) |

### Agent Options Detail

| Agent | Kapan Pakai | Contoh |
|-------|-------------|--------|
| `build` | Task yang butuh eksekusi/koding | `/test`, `/review` |
| `plan` | Task yang butuh perencanaan/analisis | `/plan-feature`, `/analyze` |
| `subagent` | Task yang bisa parallel | `/parallel-test` |
| custom name | Custom agent yang sudah didefinisikan | `/my-agent:task` |

### Model Override

```markdown
---
description: Deep analysis dengan model paling capable
model: anthropic/claude-opus-4-5-thinking
---

Lakukan analisis mendalam terhadap kode ini...
```

> **Catatan**: Model override hanya berlaku untuk command ini. Command lain tetap pakai model default.

---

## 🎯 Template Syntax — Deep Dive

### `$ARGUMENTS` — Semua Parameter Sekaligus

Ambil semua text yang diketik setelah command name.

```markdown
---
description: Buat React component
---

Buat React component bernama $ARGUMENTS dengan:
- TypeScript strict mode
- Props interface
- Default props
- Unit test stub
```

**Cara pakai**:
```
/component Button
→ $ARGUMENTS = "Button"

/component UserCard with avatar and social links
→ $ARGUMENTS = "UserCard with avatar and social links"
```

**Karakteristik**:
- Mengambil SEMUA text setelah command
- Termasuk spasi dan karakter khusus
- Bisa kosong (jika user tidak kasih argument)

### `$1`, `$2`, `$3` — Positional Parameters

Parameter dipisah berdasarkan spasi. Setiap `$N` mengambil word ke-N.

```markdown
---
description: Buat file di direktori tertentu
---

Buat file bernama $1 di direktori $2 dengan konten awal:
$3
```

**Cara pakai**:
```
/create-file config.json src/config "{ \"database\": \"localhost\" }"
→ $1 = "config.json"
→ $2 = "src/config"
→ $3 = "{ \"database\": \"localhost\" }"
```

**Aturan parsing**:
- Parameter dipisah oleh spasi
- Quoted string (`"..."`) diperlakukan sebagai satu parameter
- Jika parameter kurang dari yang diminta, variabel tetap ada tapi kosong
- Maksimal tidak dibatasi

**Contoh praktis**:
```markdown
---
description: Buat surat resmi
---

Buat surat $1 dengan:
- Nomor: $2
- Perihal: $3
- Tanggal: $4
- Tujuan: $5

Gunakan format surat resmi SD Negeri Pasirhalang.
```

```
/surat keterangan 045/SK/2026 "Keterangan Siswa Aktif" "2026-05-21" "Orang Tua Wali"
```

### `` !`command` `` — Shell Command Execution

Execute shell command di root proyek, inject output ke prompt.

**Syntax**:
```
!`shell_command_here`
```

**Contoh 1: Git log analysis**
```markdown
---
description: Review perubahan terbaru
---

Commit terbaru:
!`git log --oneline -10`

Diff dari commit terakhir:
!`git diff HEAD~1 HEAD`

Review perubahan dan beri saran perbaikan.
```

**Contoh 2: Test coverage**
```markdown
---
description: Analisis test coverage
---

Hasil test saat ini:
!`npm test -- --coverage 2>&1`

Beri saran improvement berdasarkan hasil ini.
```

**Contoh 3: File listing**
```markdown
---
description: Analisis struktur proyek
---

Struktur file proyek:
!`find . -type f -name "*.ts" -o -name "*.tsx" | head -50`

Analisis arsitektur dan beri saran improvement.
```

**Penting**:
- Command jalan di **root proyek** (bukan di folder command/)
- Output stdout yang di-capture
- Stderr tidak di-capture kecuali di-redirect (`2>&1`)
- Timeout default: 30 detik
- Jika command gagal, error message tetap di-inject

### `@file` — File Reference

Reference file atau direktori untuk dimasukkan ke context.

**Syntax**:
```
@path/to/file.ext
@path/to/directory/
```

**Contoh**:
```markdown
---
description: Review component
---

Review component @src/components/Button.tsx.
Cek:
1. Masalah performa (re-render, memoization)
2. Accessibility (ARIA attributes)
3. Error handling
4. Type safety
```

**Karakteristik**:
- Path relatif terhadap root proyek
- Bisa reference file tunggal atau direktori
- AI bisa baca isi file saat generate response
- Support multiple file reference: `@file1.ts` dan `@file2.ts`

---

## 📋 Contoh Lengkap — Command Library

### Code Review Command
`.opencode/command/review.md`:
```markdown
---
description: Review kualitas file
agent: plan
---

@$1

Review file ini, fokus:
1. Standar kode dan naming convention
2. Potensi bug dan edge case
3. Masalah performa (complexity, memory)
4. Maintainability dan readability
5. Security vulnerability
6. Testing coverage

Beri rating 1-10 dan saran konkret perbaikan.
```

### Smart Commit Command
`.opencode/command/commit.md`:
```markdown
---
description: Generate commit message dari perubahan
---

Generate commit message dari perubahan:

!`git diff --staged`

Syarat:
- Format Conventional Commits (feat/fix/docs/style/refactor/test/chore)
- Jelas, jelaskan "kenapa" bukan "apa"
- Subject ≤ 72 karakter
- Body opsional jika perubahan kompleks
```

### Translate Command
`.opencode/command/translate.md`:
```markdown
---
description: Terjemahkan ke Bahasa Indonesia
subtask: true
---

Terjemahkan text berikut ke Bahasa Indonesia yang baik dan benar:

$ARGUMENTS

Pertahankan istilah teknis dalam Bahasa English jika tidak ada padanan yang umum.
```

### Git Changelog Command
`.opencode/command/git/changelog.md`:
```markdown
---
description: Generate changelog dari commit history
---

Buat changelog dari commit history:

!`git log --oneline --since="1 month ago"`

Format:
## [Unreleased]
### Added
### Fixed
### Changed

Kelompokkan berdasarkan Conventional Commits type.
```

### Database Query Command
`.opencode/command/db/query.md`:
```markdown
---
description: Jalankan query SQL dan analisis hasil
---

Jalankan query SQL berikut dan analisis hasilnya:

$ARGUMENTS

Jelaskan:
1. Apa yang query ini lakukan
2. Apakah ada masalah performa (missing index, full table scan)
3. Saran optimasi jika ada
```

---

## 🔄 Override Built-in Commands

### Commands yang Bisa Di-override

| Command | Fungsi | Alias | Override File |
|---------|--------|-------|---------------|
| `/compact` | Compress session | `/summarize` | `.opencode/command/compact.md` |
| `/exit` | Keluar | `/quit`, `/q` | `.opencode/command/exit.md` |
| `/help` | Bantuan | - | `.opencode/command/help.md` |
| `/init` | Buat/update AGENTS.md | - | `.opencode/command/init.md` |
| `/models` | List models | - | `.opencode/command/models.md` |
| `/new` | Session baru | `/clear` | `.opencode/command/new.md` |
| `/sessions` | List/switch sessions | `/resume` | `.opencode/command/sessions.md` |
| `/undo` | Undo last response | - | `.opencode/command/undo.md` |

### Contoh Override Help
`.opencode/command/help.md`:
```markdown
---
description: Bantuan khusus proyek SD Negeri Pasirhalang
---

## Command Khusus Proyek Ini

### Administrasi Sekolah
- `/sekolah/generate-lpj` - Generate laporan pertanggungjawaban BOS
- `/sekolah/check-dapodik` - Cek status sinkronisasi Dapodik
- `/sekolah/export-arkas` - Export data ARKAS ke Excel
- `/sekolah/send-reminder` - Kirim reminder tugas administrasi

### Development
- `/review <file>` - Code review dengan checklist
- `/commit` - Generate Conventional Commit message
- `/translate <text>` - Translate ke Bahasa Indonesia
- `/test` - Jalankan test suite

### Git
- `/git/commit` - Smart commit dengan changelog
- `/git/changelog` - Generate changelog bulanan
- `/git/status` - Status summary dengan saran
```

---

## 🔗 Command Composition: Chaining dan Pipeline

### Sequential Command Execution

OpenCode tidak punya built-in command chaining, tapi kamu bisa simulate dengan approach berikut:

**Approach 1: Multi-step dalam satu command**
```markdown
---
description: Full development workflow
---

Lakukan langkah berikut secara berurutan:

LANGKAH 1: Analisis
!`git diff --staged --stat`

LANGKAH 2: Jalankan test
!`npm test 2>&1`

LANGKAH 3: Jika ada yang gagal, beri saran fix
LANGKAH 4: Generate commit message
```

**Approach 2: Command yang memanggil command lain via shell**
```markdown
---
description: CI pipeline simulation
---

Simulasikan CI pipeline:

1. Lint check:
!`npm run lint 2>&1`

2. Type check:
!`npm run typecheck 2>&1`

3. Test:
!`npm test 2>&1`

4. Build:
!`npm run build 2>&1`

Laporkan status setiap step dan beri saran jika ada yang gagal.
```

### Conditional Execution Pattern

Gunakan shell conditional dalam template:

```markdown
---
description: Deploy jika test passing
---

Check test status:
!`npm test 2>&1 || echo "TEST_FAILED"`

Jika ada test yang gagal, JANGAN deploy. Beri tahu user test mana yang gagal.
Jika semua test passing, lanjutkan dengan:
!`npm run build 2>&1`

Dan generate deployment checklist.
```

---

## 🧪 Command Testing dan Debugging

### Testing Manual

1. **Buat command** di `.opencode/command/test-cmd.md`
2. **Jalankan** dengan `/test-cmd arg1 arg2`
3. **Verifikasi** output sesuai ekspektasi

### Debugging Template Syntax

**Masalah: Parameter tidak ter-parse**
```markdown
# Salah: spasi antara $ dan angka
$ 1

# Benar: tanpa spasi
$1
```

**Masalah: Shell command tidak jalan**
```markdown
# Pastikan backtick benar
!`git status`

# Bukan single quote
!'git status'  # SALAH

# Bukan double quote
!"git status"  # SALAH
```

### Debugging Command Discovery

Jika command tidak muncul di TUI:

1. **Cek lokasi file**:
   ```bash
   ls -la .opencode/command/
   ls -la .opencode/commands/
   ls -la ~/.config/opencode/command/
   ```

2. **Cek format filename**:
   - Harus `.md` extension
   - Tidak boleh ada karakter khusus selain `-` dan `_`
   - Case-sensitive: `Review.md` ≠ `review.md`

3. **Cek frontmatter** (jika pakai Markdown):
   ```markdown
   ---
   description: Wajib ada untuk custom description
   ---
   ```

4. **Restart OpenCode** untuk reload command registry

### Testing dengan Dry Run

Untuk test tanpa benar-benar execute:

```markdown
---
description: Preview command output
---

[DRY RUN] Command ini akan melakukan:
$ARGUMENTS

Jelaskan apa yang akan dilakukan TANPA mengeksekusi.
```

---

## 📦 Command Distribution dan Sharing

### Command Package Structure

Untuk sharing command ke tim, buat struktur package:

```
opencode-commands-sekolah/
├── README.md
├── package.json
└── commands/
    ├── generate-lpj.md
    ├── check-dapodik.md
    ├── export-arkas.md
    ├── send-reminder.md
    └── git/
        ├── commit.md
        └── changelog.md
```

### Install Command Package

**Cara 1: Copy manual**
```bash
# Clone repository command
git clone https://github.com/your-org/opencode-commands-sekolah.git

# Copy ke project
cp -r opencode-commands-sekolah/commands/* .opencode/command/
```

**Cara 2: Symlink (development)**
```bash
# Buat symlink ke folder command
ln -s /path/to/opencode-commands-sekolah/commands/* .opencode/command/
```

**Cara 3: Script installer**
```bash
#!/bin/bash
# install-commands.sh
COMMANDS_DIR=".opencode/command"
mkdir -p "$COMMANDS_DIR"

# Download dari repository
curl -sL https://github.com/your-org/opencode-commands/archive/main.tar.gz | \
  tar xz --strip-components=2 -C "$COMMANDS_DIR" \
  opencode-commands-main/commands/

echo "Commands installed successfully!"
```

### Version Management

Gunakan Git tag untuk version command package:

```bash
# Tag version
git tag v1.0.0
git push origin v1.0.0

# Install specific version
curl -sL https://github.com/your-org/opencode-commands/archive/v1.0.0.tar.gz | \
  tar xz --strip-components=2 -C .opencode/command/
```

---

## 🏫 Real-World: Custom Commands untuk Administrasi Sekolah

### 1. Generate LPJ (Laporan Pertanggungjawaban)

`.opencode/command/sekolah/generate-lpj.md`:
```markdown
---
description: Generate laporan pertanggungjawaban BOS
agent: build
---

Generate Laporan Pertanggungjawaban (LPJ) BOS SD Negeri Pasirhalang.

Data sekolah:
- Nama: SD Negeri Pasirhalang
- NPSN: 20246040
- Alamat: Desa Mandalamukti, Kec. Cikalongwetan, Kab. Bandung Barat
- Provinsi: Jawa Barat

Periode: $1 (contoh: Semester 1 2025/2026)

Buat laporan dengan struktur:
1. Pendahuluan (latar belakang, dasar hukum)
2. Perencanaan (RKAS yang sudah disusun)
3. Realisasi (penerimaan dan pengeluaran BOS)
4. Pencapaian program (target vs realisasi)
5. Hambatan dan solusi
6. Penutup

Gunakan format yang sesuai standar Kemdikbud.
```

**Cara pakai**: `/sekolah/generate-lpj "Semester 1 2025/2026"`

### 2. Check Dapodik Status

`.opencode/command/sekolah/check-dapodik.md`:
```markdown
---
description: Cek status sinkronisasi Dapodik
---

Cek status sinkronisasi Dapodik:

!`curl -s http://localhost:5774/api/status 2>&1 || echo "Dapodik tidak running"`

Analisis:
1. Apakah Dapodik service berjalan?
2. Kapan terakhir sinkronisasi?
3. Berapa jumlah PD, GTK, Rombel yang tersinkronisasi?
4. Apakah ada error atau warning?

Beri rekomendasi jika ada masalah.
```

**Cara pakai**: `/sekolah/check-dapodik`

### 3. Export ARKAS Data

`.opencode/command/sekolah/export-arkas.md`:
```markdown
---
description: Export data ARKAS ke format laporan
---

Buat script Python untuk export data ARKAS dari database SQLite.

Database location: $1 (default: arkas.db)
Export format: $2 (default: excel)

Script harus:
1. Connect ke database ARKAS
2. Extract data dari tabel: RAPBS, Anggaran, Kas Umum, PTK
3. Export ke format yang diminta (Excel/CSV)
4. Generate summary report

Jika database tidak ditemukan, beri tahu user dan saran lokasi default.
```

**Cara pakai**:
```
/sekolah/export-arkas "C:\Users\USER\arkas.db" excel
/sekolah/export-arkas  # Pakai default
```

### 4. Send Reminder

`.opencode/command/sekolah/send-reminder.md`:
```markdown
---
description: Buat template reminder tugas administrasi
---

Buat template reminder untuk: $1

Detail:
- Pengirim: Operator SD Negeri Pasirhalang
- Penerima: $2
- Deadline: $3
- Prioritas: $4 (tinggi/sedang/rendah)

Format reminder:
1. Subject email/WhatsApp yang jelas
2. Body dengan detail tugas
3. Deadline yang tegas
4. Konsekuensi jika tidak dikerjakan
5. Contact person untuk pertanyaan

Buat dalam 2 versi: formal (email) dan informal (WhatsApp).
```

**Cara pakai**:
```
/sekolah/send-reminder "Input data Dapodik PD baru" "Wali Kelas 6" "2026-06-01" "tinggi"
```

### 5. Verval PD Checker

`.opencode/command/sekolah/verval-pd.md`:
```markdown
---
description: Cek status verval peserta didik
---

Cek status verval peserta didik:

NISN: $1
Nama: $2

Buat checklist verval:
1. Data pribadi (nama, TTL, jenis kelamin)
2. Data orang tua (ayah, ibu, wali)
3. Data alamat (RT/RW, desa, kecamatan)
4. Data periodik (tinggi, berat, jarak ke sekolah)
5. Data registrasi (NISN, NIK, no KK)

Jika ada data yang belum lengkap, beri tahu field mana yang perlu dilengkapi.
```

### 6. RKAS Validator

`.opencode/command/sekolah/rkas-validator.md`:
```markdown
---
description: Validasi Rencana Kegiatan dan Anggaran Sekolah
agent: plan
---

Validasi RKAS SD Negeri Pasirhalang tahun $1.

Checklist validasi:
1. Apakah semua kegiatan sesuai 8 Standar Nasional Pendidikan?
2. Apakah alokasi dana proporsional (maks 40% honor)?
3. Apakah ada kegiatan yang tidak sesuai BOS?
4. Apakah total anggaran sesuai pagu dana BOS?
5. Apakah ada duplicate kegiatan?

Standar Kemdikbud:
- Honor guru maks 40% dari dana BOS
- Langganan daya dan jasa maks 15%
- Pengembangan profesi guru maks 5%

Beri laporan validasi dengan status: PASS/WARNING/FAIL per item.
```

---

## ⚠️ Pitfalls — Troubleshooting Lengkap

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Command tidak muncul di `/` list | File bukan di folder `command/` | Pastikan di `command/` atau `commands/` |
| Nama command salah | Filename ada karakter khusus | Pakai `-` ganti spasi, hindari `.` selain extension |
| Parameter tidak生效 | Syntax salah | Pakai `$ARGUMENTS` atau `$1`, `$2` tanpa spasi |
| JSON error | Missing `template` field | `template` wajib di JSON config |
| Nested command name aneh | Tidak tahu rule naming | `git/commit.md` → `/git/commit` |
| Shell command gagal | Path issue atau command tidak ada | Command jalan di root proyek, cek PATH |
| Frontmatter tidak parse | Format YAML salah | Pastikan `---` di awal dan akhir frontmatter |
| Command override tidak jalan | File name tidak match built-in | Cek exact name: `compact.md` untuk `/compact` |
| Model override tidak生效 | Model name salah format | Format: `provider/model` (contoh: `anthropic/claude-sonnet-4-20250514`) |
| Subtask tidak isolate | `subtask` typo | Harus boolean `true`, bukan string `"true"` |

---

## 📝 Ringkasan

1. **Arsitektur**: Discovery → Registration → Trigger → Resolution → Expansion → Execution → Response
2. **Lokasi file**: `.opencode/command/` (project), `~/.config/opencode/command/` (global)
3. **2 cara config**: Markdown (recommended) dan JSON
4. **Template syntax**: `$ARGUMENTS` (semua), `$1..$N` (positional), `` !`cmd` `` (shell), `@file` (reference)
5. **Options**: `description`, `agent`, `model`, `subtask`
6. **Override** built-in commands dengan file同名 di folder command/
7. **Composition**: Multi-step dalam satu command, conditional via shell
8. **Testing**: Manual execution, dry run pattern, debug checklist
9. **Distribution**: Package structure, Git versioning, installer script
10. **Real-world**: Command untuk LPJ, Dapodik, ARKAS, reminder, verval, RKAS

**Referensi**:
- [vbgate/learn-opencode](https://github.com/vbgate/learn-opencode) — Custom Commands module
- [OpenCode Documentation](https://opencode.ai) — Slash Commands reference
- [OpenCode GitHub](https://github.com/anomalyco/opencode) — Source code dan examples
