# 01 — Apa itu Claude Code?

> **Estimasi:** 2 jam | **Level:** Pemula → Menengah
> **Sumber:** [`feiskyer/claude-code-settings`](https://github.com/feiskyer/claude-code-settings) + [`awattar/claude-code-best-practices`](https://github.com/awattar/claude-code-best-practices) + [Anthropic Claude Code Docs](https://docs.anthropic.com/en/docs/claude-code/overview)

---

## 📖 TEORI

### Apa itu Claude Code?

**Claude Code** adalah AI coding assistant dari Anthropic yang bekerja langsung di terminal. Bukan sekadar autocomplete kode — Claude Code adalah **agentic coding tool** yang bisa bekerja secara mandiri untuk menyelesaikan tugas-tugas pemrograman kompleks.

Claude Code berbeda dari AI coding assistant generasi pertama yang hanya memberikan saran kode baris per baris. Claude Code menggunakan pendekatan **agentic** — artinya ia bisa merencanakan, menulis, menguji, dan memperbaiki kode secara otonom dalam satu sesi interaksi.

```
✅ Menulis kode dari spesifikasi natural language
✅ Memodifikasi file yang sudah ada dengan presisi
✅ Menjalankan command terminal (build, test, run)
✅ Membuat commit Git dengan pesan yang deskriptif
✅ Debugging dan testing secara iteratif
✅ Menjawab pertanyaan tentang codebase yang kompleks
✅ Multi-file editing — edit banyak file sekaligus
✅ Web search untuk dokumentasi dan referensi terbaru
✅ Skill system — bisa di-extend dengan kemampuan baru
```

### Sejarah dan Evolusi Claude Code

Claude Code diluncurkan oleh Anthropic sebagai bagian dari ekosistem Claude, model AI yang dikenal dengan kemampuan reasoning dan safety-nya yang unggul. Evolusinya bisa dilihat dalam beberapa tahap:

**Tahap 1 — Chat-based AI Assistant (2023)**
Claude tersedia melalui web interface (claude.ai). User bisa paste kode dan bertanya, tapi tidak ada akses ke file system atau terminal.

**Tahap 2 — API-based Integration (2024)**
Developer bisa mengintegrasikan Claude API ke dalam IDE mereka. Tools seperti Cursor dan Windsurf mulai menggunakan Claude sebagai backend model.

**Tahap 3 — Claude Code — Terminal-native Agent (2025)**
Claude Code lahir sebagai CLI tool yang berdiri sendiri. Bukan plugin, bukan extension — tapi program terminal yang punya akses penuh ke file system, shell, dan git. Ini adalah lompatan dari "assistant yang memberi saran" menjadi "agent yang mengerjakan".

### Claude Code vs AI Tools Lain — Perbandingan Mendalam

Berikut perbandingan detail Claude Code dengan semua major AI coding tools yang tersedia di 2025-2026:

| Fitur | **Claude Code** | **Cursor** | **GitHub Copilot** | **Windsurf** | **Devin** | **Aider** | **Codex CLI** |
|---|---|---|---|---|---|---|---|
| **Interface** | Terminal (CLI) | VS Code Fork | IDE Plugin | IDE Khusus | Web Dashboard | Terminal (CLI) | Terminal (CLI) |
| **Model** | Claude (Anthropic) | Claude, GPT, Gemini | GPT (OpenAI) | Claude, GPT | Claude, GPT | OpenAI, Claude, dll | GPT (OpenAI) |
| **Agentic** | ✅ Full agent | ⚠️ Semi (Composer) | ❌ Autocomplete only | ✅ Cascade mode | ✅ Full agent | ✅ Full agent | ✅ Full agent |
| **Multi-file Edit** | ✅ Native | ✅ Composer | ❌ Single file | ✅ Cascade | ✅ Full | ✅ Native | ✅ Native |
| **Terminal Access** | ✅ Full | ⚠️ Limited | ❌ None | ⚠️ Limited | ✅ Full | ✅ Full | ✅ Full |
| **Git Integration** | ✅ Deep | ✅ Basic | ❌ None | ✅ Basic | ✅ Deep | ✅ Deep | ✅ Deep |
| **Context Awareness** | ✅ Whole codebase | ✅ Open files | ❌ Current file | ✅ Project | ✅ Whole repo | ✅ Whole repo | ✅ Whole repo |
| **Skill/Plugin System** | ✅ Skills | ✅ Extensions | ❌ Limited | ✅ Extensions | ❌ None | ⚠️ Custom | ⚠️ Limited |
| **Permission Model** | ✅ Granular | ❌ None | ❌ None | ❌ None | ✅ Sandboxed | ⚠️ Manual | ✅ Granular |
| **Offline Mode** | ❌ Cloud only | ❌ Cloud only | ❌ Cloud only | ❌ Cloud only | ❌ Cloud only | ❌ Cloud only | ❌ Cloud only |
| **Harga** | $20/bln (Pro) / $0.25/1M input | $20/bln | $10/bln | $15/bln | $50/bln | Gratis (BYO API key) | $20/bln (ChatGPT Pro) |
| **Cocok untuk** | Developer terminal | Developer GUI | Autocomplete cepat | Developer modern | Full automation | Developer open-source | Developer OpenAI |

#### Penjelasan Detail Per Tool:

**Cursor** — Fork dari VS Code yang menambahkan AI secara native. Fitur "Composer"-nya memungkinkan multi-file editing, tapi masih semi-agentic (user harus trigger action). Kelebihannya: UI familiar (VS Code), integrasi seamless. Kekurangannya: resource-heavy (Electron app), context terbatas pada file yang terbuka.

**GitHub Copilot** — Plugin untuk VS Code, JetBrains, Vim, dll. Terkenal dengan autocomplete-nya yang cepat. Copilot Chat bisa menjawab pertanyaan tentang kode, tapi tidak bisa menjalankan terminal atau edit multi-file secara otonom. Cocok untuk developer yang butuh bantuan cepat saat mengetik.

**Windsurf** — IDE AI-native dengan fitur "Cascade" yang mirip agentic workflow. Bisa membaca seluruh project dan melakukan multi-step tasks. Masih lebih baru dari Cursor, ecosystem plugin lebih kecil.

**Devin** — AI software engineer otonom yang bisa mengerjakan task dari awal sampai deployment. Sangat powerful tapi mahal ($50/bln) dan lebih cocok untuk task yang bisa didelegasikan penuh tanpa interaksi.

**Aider** — CLI tool open-source yang populer di komunitas developer. Mendukung banyak model (via API key), gratis jika punya API key sendiri. Tapi setup lebih manual, tidak ada UI, dan permission model lebih sederhana.

**Codex CLI** — CLI tool dari OpenAI, mirip Claude Code tapi menggunakan model GPT. Terintegrasi dengan ekosistem OpenAI. Masih relatif baru dibanding Claude Code.

### Kapan Pakai Claude Code vs Tools Lain — Decision Tree

Gunakan panduan berikut untuk memilih tool yang tepat:

```
Apakah kamu nyaman bekerja di terminal?
├── YA → Lanjut ke pertanyaan berikut
│   ├── Butuh agentic workflow (bisa kerja mandiri)?
│   │   ├── YA → Claude Code atau Aider
│   │   │   ├── Punya API key sendiri & mau hemat? → Aider
│   │   │   └── Mau pengalaman polished & terintegrasi? → Claude Code ✅
│   │   └── TIDAK → Cukup autocomplete? → GitHub Copilot
│   └── Butuh full automation tanpa interaksi? → Devin
│
└── TIDAK → Lebih suka GUI/IDE?
    ├── Mau IDE familiar (VS Code-like)? → Cursor
    ├── Mau IDE AI-native dari awal? → Windsurf
    └── Cukup butuh autocomplete saat mengetik? → GitHub Copilot
```

**Untuk konteks administrasi sekolah (operator SD):**
- Jika kamu sering kerja dengan script Python/JavaScript untuk otomatisasi → **Claude Code**
- Jika kamu lebih suka visual editor → **Cursor**
- Jika hanya butuh bantuan ketik kode cepat → **GitHub Copilot**
- Jika ingin otomatisasi penuh tanpa interaksi → **Devin** (tapi mahal)

### Kenapa Claude Code? — Keunggulan Mendalam

Claude Code memiliki beberapa keunggulan yang membuatnya standout di antara AI coding tools lainnya:

#### 1. Agentic by Design

Claude Code bukan autocomplete. Ia adalah **agent** yang bisa:
- Menerima instruksi dalam bahasa natural
- Memahami konteks seluruh codebase
- Merencanakan langkah-langkah yang diperlukan
- Menulis kode di banyak file sekaligus
- Menjalankan test untuk verifikasi
- Memperbaiki error secara iteratif
- Commit perubahan ke Git

Ini berbeda dari tools yang hanya "melengkapi kode saat kamu mengetik". Claude Code bisa mengerjakan task dari awal sampai selesai.

#### 2. Context-Aware dengan CLAUDE.md

Claude Code menggunakan file `CLAUDE.md` sebagai "otak" proyek — file ini berisi instruksi, konvensi, dan konteks yang Claude gunakan setiap kali bekerja di proyek tersebut. Ini memungkinkan:
- Konsistensi gaya kode di seluruh proyek
- Pemahaman arsitektur proyek
- Aturan khusus (misal: "selalu tulis test", "gunakan Bahasa Indonesia untuk komentar")
- Preferensi framework dan library

#### 3. Skill System yang Extendable

Claude Code punya sistem **skills** — paket kemampuan yang bisa di-load sesuai kebutuhan. Misalnya:
- Skill untuk PDF processing
- Skill untuk web scraping
- Skill untuk administrasi sekolah (ARKAS, Dapodik)
- Skill untuk debugging spesifik

Skills bisa dibuat sendiri atau di-install dari komunitas.

#### 4. Multi-File Editing yang Presisi

Claude Code bisa mengedit banyak file sekaligus dalam satu perintah. Ia menggunakan teknik **search-and-replace** yang presisi — bukan menulis ulang seluruh file, tapi hanya mengubah bagian yang diperlukan. Ini penting untuk:
- Refactoring yang melibatkan banyak file
- Menambahkan fitur yang menyentuh beberapa komponen
- Fix bug yang berdampak ke banyak modul

#### 5. Terminal Integration Penuh

Claude Code punya akses ke terminal, artinya bisa:
- Menjalankan build commands (`npm run build`, `python main.py`)
- Menjalankan test (`pytest`, `npm test`)
- Install dependencies (`npm install`, `pip install`)
- Git operations (`git add`, `git commit`, `git push`)
- File operations (`ls`, `cat`, `mkdir`)

Ini membuatnya benar-benar self-sufficient — tidak perlu switch ke terminal lain.

#### 6. Permission Model yang Aman

Claude Code tidak langsung menjalankan semua perintah. Ia menggunakan **permission model** di mana user bisa:
- Approve atau deny setiap action
- Set auto-approve untuk perintah yang aman
- Block perintah berbahaya
- Review perubahan sebelum di-apply

Ini penting untuk keamanan — Claude Code tidak akan menghapus file atau menjalankan perintah destruktif tanpa persetujuan.

---

## 🏗️ ARSITEKTUR CLAUDE CODE

### Bagaimana Claude Code Bekerja Secara Internal

Memahami arsitektur Claude Code membantu kamu menggunakannya dengan lebih efektif. Berikut adalah komponen-komponen utamanya:

#### 1. Context Window dan Token System

Claude Code menggunakan model Claude dengan **context window** yang sangat besar (hingga 200.000 token untuk Claude Sonnet 4). Context window adalah "ruang kerja" Claude — semua informasi yang Claude "ingat" dalam satu sesi harus muat di sini.

```
Context Window (200.000 token)
├── System Prompt (~5.000 token)
│   └── Instruksi dasar, kemampuan, batasan
├── Project Context (CLAUDE.md, ~2.000 token)
│   └── Konvensi proyek, aturan, preferensi
├── File Contents (bervariasi, ~50.000-100.000 token)
│   └── Kode yang dibaca, file yang relevan
├── Conversation History (bervariasi, ~20.000-50.000 token)
│   └── Semua pesan bolak-balik user ↔ Claude
└── Tool Results (bervariasi, ~10.000-30.000 token)
    └── Output dari commands, search results, dll
```

**Apa itu Token?**
Token adalah unit teks yang diproses model. Sekitar 1 token ≈ 4 karakter Bahasa Inggris atau ≈ 1.5-2 karakter Bahasa Indonesia. Contoh:
- `"Halo"` = 1 token
- `"Saya"` = 1 token
- `"menggunakan"` = 2 token
- `"Claude Code"` = 2 token

**Mengapa ini penting?**
- Semakin besar codebase, semakin banyak token yang terpakai
- Claude Code secara otomatis memilih file-file yang relevan (tidak membaca SEMUA file)
- File yang terlalu besar bisa di-chunk atau di-summarize
- Kamu bisa membantu Claude dengan `CLAUDE.md` yang ringkas tapi informatif

#### 2. Tool Calling System

Claude Code tidak hanya "berbicara" — ia bisa **memanggil tools** untuk berinteraksi dengan dunia nyata. Setiap kali Claude Code ingin melakukan sesuatu di luar percakapan, ia memanggil tool:

```
User: "Buat file config.json dengan setting database"
                    ↓
Claude Code memanggil tool: filesystem_write_file
  - path: "config.json"
  - content: "{ \"database\": { \"host\": \"localhost\" } }"
                    ↓
Tool mengeksekusi → file dibuat
                    ↓
Claude Code melaporkan: "File config.json berhasil dibuat"
```

**Tools yang tersedia di Claude Code:**

| Tool | Fungsi | Contoh Penggunaan |
|---|---|---|
| `read` | Baca file | Baca source code, config, dokumentasi |
| `write` | Tulis file | Buat file baru, overwrite file lama |
| `edit` | Edit file (search & replace) | Ubah fungsi, fix bug, refactor |
| `glob` | Cari file dengan pattern | Temukan semua file `.py` di project |
| `grep` | Cari konten dalam file | Temukan semua penggunaan fungsi `login()` |
| `bash` | Jalankan shell command | `npm install`, `git commit`, `python test.py` |
| `websearch` | Cari di internet | Dokumentasi terbaru, troubleshooting |
| `webfetch` | Ambil konten URL | Baca docs, API reference |

#### 3. Agentic Loop — Siklus Kerja Claude Code

Claude Code bekerja dalam **loop agentic** — siklus berulang yang terus berjalan sampai task selesai:

```
┌─────────────────────────────────────────────────┐
│              AGENTIC LOOP                        │
│                                                  │
│  1. RECEIVE TASK                                 │
│     User memberikan instruksi                    │
│     ↓                                            │
│  2. ANALYZE CONTEXT                              │
│     Baca file relevan, pahami codebase           │
│     ↓                                            │
│  3. PLAN                                         │
│     Buat rencana langkah-langkah                 │
│     ↓                                            │
│  4. EXECUTE                                      │
│     Panggil tools (read, write, edit, bash)      │
│     ↓                                            │
│  5. VERIFY                                       │
│     Cek hasil: test pass? build sukses?          │
│     ↓                                            │
│  6. ITERATE (jika perlu)                         │
│     Fix error, adjust approach                   │
│     ↓                                            │
│  7. REPORT                                       │
│     Laporkan hasil ke user                       │
│     ↓                                            │
│  [User puas? → SELESAI]                          │
│  [User minta revisi? → KEMBALI ke step 2]        │
└─────────────────────────────────────────────────┘
```

**Mengapa memahami loop ini penting?**
- Kamu bisa memberikan instruksi yang lebih efektif
- Kamu tahu kapan harus intervensi (saat Claude stuck di step 5)
- Kamu bisa membantu Claude di step 2 dengan memberikan konteks yang tepat

#### 4. REPL (Read-Eval-Print Loop)

Claude Code berjalan sebagai **REPL** di terminal — artinya ia menunggu input, memproses, menampilkan output, lalu menunggu lagi:

```
$ claude
Claude Code is running. Type your instructions or /help for commands.

> buatkan fungsi untuk menghitung rata-rata
  [Claude memproses...]
  [Claude menulis kode...]
  [Claude menampilkan hasil...]

> sekarang tambahkan validasi untuk input kosong
  [Claude memproses...]
  [Claude mengedit kode...]
  [Claude menampilkan hasil...]

> /exit
```

REPL ini memungkinkan **iterasi cepat** — kamu bisa langsung minta perubahan tanpa restart atau reload.

#### 5. Permission Model — Keamanan dalam Action

Setiap kali Claude Code ingin melakukan sesuatu yang berdampak (menulis file, menjalankan command, dll), ia meminta **permission**:

```
Claude Code ingin menjalankan: npm install express
[1] Run once     [2] Approve & suppress similar  [3] Deny
```

**Tiga level permission:**
- **Run once**: Jalankan sekali ini saja, lain kali tanya lagi
- **Approve & suppress**: Selalu jalankan command serupa tanpa tanya
- **Deny**: Jangan jalankan

**Best practices untuk permission:**
- Auto-approve untuk command yang aman (`ls`, `cat`, `git status`)
- Selalu review untuk command yang mengubah file (`write`, `edit`)
- Block untuk command yang berbahaya (`rm -rf`, `format`, dll)
- Gunakan `/permissions` untuk melihat dan mengubah setting

---

## 🔍 CLAUDE CODE CAPABILITIES DEEP DIVE

### 1. File Editing — Cara Claude Code Membaca dan Menulis File

Claude Code menggunakan beberapa strategi untuk membaca file:

**Strategi 1: Targeted Reading**
Claude Code tidak membaca SEMUA file di proyek. Ia menggunakan `glob` dan `grep` untuk menemukan file yang relevan, lalu hanya membaca file-file tersebut.

```
User: "Fix bug di fungsi login"
  ↓
Claude Code: grep "def login" → menemukan auth.py
  ↓
Claude Code: read auth.py → memahami kode
  ↓
Claude Code: edit auth.py → fix bug
```

**Strategi 2: Context Building**
Claude Code membangun "mental model" codebase dengan:
- Membaca `CLAUDE.md` untuk konteks proyek
- Membaca file-file utama (entry points, config)
- Membaca file-file yang relevan dengan task saat ini
- Tidak membaca file yang tidak relevan (node_modules, vendor, dll)

**Strategi 3: Edit dengan Presisi**
Saat mengedit file, Claude Code menggunakan **search-and-replace** — bukan menulis ulang seluruh file:

```python
# BEFORE (di file auth.py)
def login(username, password):
    user = db.find_user(username)
    return user.check_password(password)

# AFTER (Claude Code mengedit)
def login(username, password):
    if not username or not password:
        raise ValueError("Username dan password tidak boleh kosong")
    user = db.find_user(username)
    if not user:
        raise ValueError("User tidak ditemukan")
    return user.check_password(password)
```

Claude Code hanya menambahkan validasi — tidak mengubah bagian lain yang sudah benar.

### 2. Shell Execution — Menjalankan Command Terminal

Claude Code bisa menjalankan hampir semua command terminal:

```bash
# Build dan test
npm run build
npm test
pytest tests/
python -m unittest

# Git operations
git add .
git commit -m "feat: add login validation"
git push origin main

# Package management
npm install express
pip install flask
go get github.com/gin-gonic/gin

# File operations
mkdir src/components
cp template.py src/main.py
ls -la

# System commands
node --version
python --version
which python
```

**Penting:** Claude Code menjalankan command di **working directory** proyek. Ia tidak perlu `cd` manual — sudah otomatis di direktori yang benar.

### 3. Git Operations — Version Control yang Terintegrasi

Claude Code punya pemahaman mendalam tentang Git:

- **Membaca history:** `git log`, `git diff` untuk memahami perubahan sebelumnya
- **Membuat commit:** Dengan pesan yang deskriptif dan mengikuti konvensi (Conventional Commits)
- **Branching:** Bisa buat branch baru untuk feature
- **Conflict resolution:** Bisa bantu resolve merge conflict

**Contoh workflow Git dengan Claude Code:**

```
User: "Buat fitur export laporan ke Excel"
  ↓
Claude Code:
  1. Buat branch: git checkout -b feat/export-excel
  2. Tulis kode export di report.py
  3. Test: python test_export.py
  4. Commit: git commit -m "feat: add Excel export for reports"
  5. Push: git push origin feat/export-excel
```

### 4. Web Search dan Fetch — Akses Internet Real-time

Claude Code bisa mencari informasi terbaru dari internet:

```
User: "Bagaimana cara setup authentication di FastAPI versi terbaru?"
  ↓
Claude Code: websearch "FastAPI authentication best practices 2025"
  ↓
Claude Code: webfetch URL dokumentasi terbaru
  ↓
Claude Code: Menggunakan informasi terbaru untuk menulis kode
```

Ini sangat berguna untuk:
- Dokumentasi library yang sering update
- Troubleshooting error yang spesifik
- Best practices terbaru
- API reference yang berubah

### 5. Multi-File Editing — Mengedit Banyak File Sekaligus

Claude Code bisa mengedit banyak file dalam satu perintah:

```
User: "Rename fungsi `hitung_rata_rata` menjadi `calculate_average` di semua file"
  ↓
Claude Code:
  1. grep "hitung_rata_rata" → menemukan 5 file
  2. Edit file 1: utils.py
  3. Edit file 2: report.py
  4. Edit file 3: api.py
  5. Edit file 4: test_utils.py
  6. Edit file 5: main.py
  7. Verifikasi: grep lagi untuk memastikan tidak ada yang terlewat
```

Ini jauh lebih efisien daripada edit manual satu per satu.

---

## 🏫 CONTOH NYATA: Claude Code untuk Administrasi Sekolah

Berikut contoh-contoh penggunaan Claude Code untuk tugas-tugas administrasi sekolah di SD Negeri Pasirhalang:

### Contoh 1: Script Absensi Otomatis

**Prompt:**
```
Buatkan script Python untuk rekap absensi harian guru.
Input: file CSV dengan kolom tanggal, nama_guru, status (hadir/sakit/izin)
Output: laporan rekap per bulan dalam format Excel
Fitur: hitung persentase kehadiran, sort by nama
```

**Yang Claude Code lakukan:**
1. Buat struktur project dengan folder `src/` dan `tests/`
2. Tulis script `absensi_rekap.py` dengan pandas untuk processing CSV
3. Buat fungsi export ke Excel dengan openpyxl
4. Generate sample data untuk testing
5. Buat unit test untuk verifikasi
6. Jalankan test dan fix error jika ada

### Contoh 2: Template Surat Resmi Sekolah

**Prompt:**
```
Buatkan generator surat resmi sekolah menggunakan Python.
Template surat:
- Surat keterangan siswa
- Surat pindah siswa
- Surat tugas guru
Input: data siswa/guru dari file JSON
Output: file .docx dengan format surat resmi SD Negeri Pasirhalang
Header surat: logo sekolah, nama sekolah, alamat, NPSN
```

**Yang Claude Code lakukan:**
1. Install library `python-docx`
2. Buat template surat dengan header resmi
3. Buat fungsi untuk setiap jenis surat
4. Buat CLI untuk input data
5. Generate contoh surat untuk testing

### Contoh 3: Dashboard Keuangan BOS Sederhana

**Prompt:**
```
Buatkan web dashboard sederhana untuk monitoring keuangan BOS.
Tech stack: Flask + SQLite + HTML/CSS/JS
Fitur:
- Input pemasukan dan pengeluaran
- Kategori: operasional, pengembangan, kesiswaan
- Grafik pie untuk distribusi anggaran
- Tabel realisasi vs perencanaan
- Export laporan ke PDF
```

**Yang Claude Code lakukan:**
1. Setup project Flask dengan struktur folder
2. Buat database schema SQLite
3. Buat routes untuk CRUD transaksi
4. Buat template HTML dengan Chart.js untuk grafik
5. Buat fungsi export PDF dengan reportlab
6. Setup dan jalankan development server

### Contoh 4: Script Download Data Dapodik

**Prompt:**
```
Buatkan script untuk download data peserta didik dari Dapodik Web Service.
Input: token akses, NPSN sekolah
Output: file Excel dengan data lengkap PD (NISN, nama, TTL, orang tua, alamat)
Fitur:
- Handle rate limiting
- Retry otomatis jika gagal
- Progress bar
- Logging ke file
```

**Yang Claude Code lakukan:**
1. Buat script dengan `requests` untuk API call
2. Implementasi retry logic dengan `tenacity`
3. Tambahkan progress bar dengan `tqdm`
4. Setup logging ke file
5. Export ke Excel dengan `openpyxl`
6. Buat config file untuk token dan NPSN

---

## 🔧 SETUP WALKTHROUGH — Panduan Lengkap

### Prerequisites

Sebelum install Claude Code, pastikan:

```bash
# Cek Node.js (minimal versi 18)
node --version
# Harus v18.x atau lebih tinggi

# Cek npm
npm --version
# Harus v9.x atau lebih tinggi

# Jika belum punya Node.js, download dari:
# https://nodejs.org/en/download
```

### Step 1: Install Claude Code

```bash
# Install global via npm
npm install -g @anthropic-ai/claude-code

# Verifikasi instalasi
claude --version
# Output: Claude Code x.x.x
```

### Step 2: Login

```bash
claude login
```

Browser akan terbuka untuk autentikasi. Ikuti instruksi:
1. Login ke akun Anthropic (claude.ai)
2. Authorize Claude Code
3. Token akan tersimpan otomatis

### Step 3: Inisialisasi di Project

```bash
# Masuk ke direktori project
cd D:\Programming\fundamental-vibe-coding

# Inisialisasi (opsional — generate CLAUDE.md)
claude init
```

### Step 4: Konfigurasi CLAUDE.md

Buat file `CLAUDE.md` di root project:

```markdown
# Project Context

## Bahasa
- Komunikasi: Bahasa Indonesia
- Istilah teknis: English jika tidak ada padanan Indonesia

## Tech Stack
- Python 3.11+
- FastAPI untuk backend
- SQLite untuk development

## Konvensi
- Gunakan type hints di semua fungsi
- Tulis docstring untuk setiap fungsi publik
- Test coverage minimal 80%
- Conventional Commits untuk pesan commit
```

### Step 5: Konfigurasi Permission

```bash
# Jalankan Claude Code
claude

# Di dalam session, cek permission
/permissions

# Set auto-approve untuk command aman
# (Claude akan prompt saat pertama kali menjalankan command)
```

### Step 6: Test dengan Command Sederhana

```
> buatkan file hello.py yang print "Halo, SD Negeri Pasirhalang!"
```

Claude Code akan:
1. Membuat file `hello.py`
2. Menanyakan permission untuk write
3. Menampilkan hasil

```
> jalankan hello.py
```

Claude Code akan:
1. Menanyakan permission untuk run `python hello.py`
2. Menampilkan output: `Halo, SD Negeri Pasirhalang!`

---

## ⚙️ KONFIGURASI LANJUTAN

### Settings File

Claude Code menyimpan konfigurasi di beberapa lokasi:

**Global settings:** `~/.claude/settings.json`
```json
{
  "model": "claude-sonnet-4-20250515",
  "maxTokens": 64000,
  "theme": "dark",
  "autoApprove": ["ls", "cat", "git status"]
}
```

**Project settings:** `.claude/settings.json` di root project
```json
{
  "permissions": {
    "autoApprove": ["pytest", "npm test"],
    "deny": ["rm -rf", "format"]
  }
}
```

### Environment Variables

```bash
# Set API key (jika tidak login)
export ANTHROPIC_API_KEY="sk-ant-..."

# Set proxy (jika perlu)
export HTTPS_PROXY="http://proxy:8080"

# Set custom model
export CLAUDE_MODEL="claude-sonnet-4-20250515"
```

### Slash Commands

Claude Code punya slash commands untuk operasi khusus:

| Command | Fungsi |
|---|---|
| `/help` | Tampilkan bantuan |
| `/permissions` | Kelola permission |
| `/clear` | Bersihkan conversation history |
| `/compact` | Kompres context untuk hemat token |
| `/cost` | Tampilkan estimasi biaya sesi |
| `/model` | Ganti model |
| `/init` | Inisialisasi project baru |
| `/exit` | Keluar dari Claude Code |

---

## 💰 PRICING DAN TOKEN USAGE

### Cara Kerja Token

**Input tokens:** Teks yang kamu kirim ke Claude (prompt, file contents, conversation history)
**Output tokens:** Teks yang Claude generate (kode, penjelasan, command output)

**Harga Claude Pro (per Mei 2025):**
- $20/bulan untuk akses Claude Pro
- Termasuk usage Claude Code dengan limit tertentu
- Limit: ~500 requests/hari (bervariasi berdasarkan model)

**API Pricing (jika pakai API langsung):**
| Model | Input (per 1M token) | Output (per 1M token) |
|---|---|---|
| Claude Haiku 3.5 | $0.25 | $1.25 |
| Claude Sonnet 4 | $3.00 | $15.00 |
| Claude Opus 4 | $15.00 | $75.00 |

### Estimasi Biaya per Task

| Task | Estimasi Token | Estimasi Biaya (Sonnet 4) |
|---|---|---|
| Buat fungsi sederhana | ~5.000 token | ~$0.02 |
| Buat modul lengkap | ~50.000 token | ~$0.20 |
| Refactor besar | ~100.000 token | ~$0.40 |
| Setup project baru | ~200.000 token | ~$0.80 |
| Debug kompleks | ~150.000 token | ~$0.60 |

### Tips Optimasi Token

1. **Gunakan CLAUDE.md yang ringkas** — Jangan tulis novel, cukup poin-poin penting
2. **Clear conversation** — Gunakan `/clear` jika context sudah terlalu besar
3. **Spesifik di prompt** — "Buat fungsi login" lebih hemat daripada "Tolong buatkan saya sebuah fungsi yang bisa digunakan untuk..."
4. **Gunakan model yang tepat** — Haiku untuk task sederhana, Sonnet untuk task kompleks, Opus untuk task yang butuh reasoning mendalam
5. **Compact context** — Gunakan `/compact` untuk mengurangi ukuran context tanpa kehilangan informasi penting

---

## 🔒 KEAMANAN DAN BEST PRACTICES

### Permission Security

```
✅ DO:
- Review setiap file write sebelum approve
- Auto-approve hanya untuk read-only commands
- Block commands yang bisa menghapus data
- Gunakan deny untuk commands yang tidak familiar

❌ DON'T:
- Auto-approve semua commands
- Ignore permission prompt
- Run commands yang tidak kamu pahami
- Share API key di public repository
```

### Data Privacy

- Claude Code mengirim kode ke server Anthropic untuk processing
- Data tidak digunakan untuk training model (berdasarkan kebijakan Anthropic)
- Jangan masukkan data sensitif (password, API key, data pribadi siswa) ke dalam prompt
- Gunakan environment variables untuk secrets, bukan hardcode

### Backup Sebelum Perubahan Besar

```bash
# Sebelum minta Claude Code refactor besar:
git add .
git commit -m "backup: before major refactor"

# Atau buat branch baru:
git checkout -b backup-before-refactor
git checkout main
```

---

## 🐛 TROUBLESHOOTING — Masalah Umum dan Solusi

### 1. "Claude Code tidak bisa install"

**Masalah:** Error saat `npm install -g @anthropic-ai/claude-code`

**Solusi:**
```bash
# Cek Node.js version
node --version
# Harus minimal v18

# Jika Node.js terlalu lama, update:
# Download dari https://nodejs.org

# Coba install dengan sudo (Linux/Mac) atau Run as Administrator (Windows)
sudo npm install -g @anthropic-ai/claude-code
```

### 2. "Login gagal"

**Masalah:** `claude login` tidak berhasil

**Solusi:**
```bash
# Cek koneksi internet
ping claude.ai

# Coba login ulang
claude logout
claude login

# Jika masih gagal, pakai API key langsung:
export ANTHROPIC_API_KEY="sk-ant-..."
```

### 3. "Claude Code lambat merespons"

**Masalah:** Claude Code butuh waktu lama untuk menjawab

**Solusi:**
- Context terlalu besar → gunakan `/compact` atau `/clear`
- Network lambat → cek koneksi internet
- Model terlalu powerful untuk task sederhana → gunakan Haiku untuk task sederhana
- Terlalu banyak file di project → buat `.gitignore` yang proper

### 4. "Claude Code salah edit file"

**Masalah:** Claude Code mengubah bagian file yang tidak seharusnya

**Solusi:**
- Selalu review perubahan sebelum approve
- Gunakan `/clear` dan mulai ulang dengan instruksi yang lebih spesifik
- Tambahkan konteks di `CLAUDE.md` tentang bagian file yang tidak boleh diubah
- Gunakan instruksi yang lebih spesifik: "Hanya edit fungsi login, jangan sentuh fungsi lain"

### 5. "Token limit tercapai"

**Masalah:** Claude Code berhenti karena context window penuh

**Solusi:**
```
# Kompres context
/compact

# Atau mulai sesi baru
/clear

# Preventif: buat CLAUDE.md yang lebih ringkas
# Preventif: gunakan .gitignore untuk exclude file yang tidak perlu
```

### 6. "Claude Code tidak bisa menjalankan command"

**Masalah:** Permission denied saat menjalankan command

**Solusi:**
- Approve permission saat prompt muncul
- Cek apakah command ada di PATH
- Untuk Windows: pastikan PowerShell atau CMD bisa menjalankan command tersebut
- Coba run Claude Code sebagai Administrator (Windows) jika perlu akses sistem

### 7. "Error: rate limit exceeded"

**Masalah:** Terlalu banyak request dalam waktu singkat

**Solusi:**
- Tunggu beberapa menit sebelum mencoba lagi
- Kurangi frekuensi request
- Upgrade ke plan yang lebih tinggi jika sering terjadi
- Gunakan model yang lebih murah (Haiku) untuk task sederhana

---

## 📚 REFERENSI DAN SUMBER BELAJAR

### Dokumentasi Resmi
- [Claude Code Overview](https://docs.anthropic.com/en/docs/claude-code/overview) — Dokumentasi resmi dari Anthropic
- [Claude Code Settings](https://github.com/feiskyer/claude-code-settings) — Konfigurasi dan plugin oleh komunitas
- [Claude Code Best Practices](https://github.com/awattar/claude-code-best-practices) — Best practices dan tips penggunaan

### Komunitas
- [Anthropic Discord](https://www.anthropic.com/discord) — Komunitas resmi Anthropic
- [GitHub Discussions](https://github.com/anthropics/claude-code/discussions) — Forum diskusi Claude Code

### Video Tutorial
- Cari "Claude Code tutorial" di YouTube untuk video panduan visual
- Anthropic official channel untuk update terbaru

---

## ✅ CHECKLIST

Setelah membaca materi ini, pastikan kamu:

- [ ] Paham apa itu Claude Code dan bedanya dengan tools lain
- [ ] Mengerti konsep "agentic coding" dan bagaimana Claude Code bekerja
- [ ] Memahami arsitektur Claude Code (context window, tool calling, agentic loop)
- [ ] Tahu perbandingan Claude Code dengan Cursor, Copilot, Windsurf, Devin, Aider, Codex CLI
- [ ] Bisa menggunakan decision tree untuk memilih tool yang tepat
- [ ] Paham cara kerja token dan estimasi biaya
- [ ] Mengerti permission model dan security best practices
- [ ] Bisa setup Claude Code dari awal
- [ ] Tahu cara troubleshooting masalah umum
- [ ] Memahami contoh penggunaan untuk administrasi sekolah

---

## 📝 RANGKUMAN

Claude Code adalah **agentic coding tool** dari Anthropic yang bekerja di terminal. Berbeda dari AI coding assistant tradisional yang hanya autocomplete, Claude Code bisa bekerja secara mandiri — membaca file, menulis kode, menjalankan terminal, dan commit ke Git.

**Keunggulan utama:**
1. Agentic — bisa kerja mandiri dari awal sampai selesai
2. Context-aware — paham seluruh codebase, bukan hanya file yang terbuka
3. Multi-file editing — edit banyak file sekaligus dengan presisi
4. Terminal integration — akses penuh ke shell, git, dan system commands
5. Skill system — bisa di-extend dengan kemampuan baru
6. Permission model — aman dan terkontrol

**Cocok untuk:**
- Developer yang nyaman di terminal
- Task kompleks yang butuh multi-step workflow
- Project yang butuh konsistensi kode
- Otomatisasi administrasi sekolah dengan script

**Tidak cocok untuk:**
- Developer yang prefer GUI/IDE (pakai Cursor atau Windsurf)
- Hanya butuh autocomplete cepat (pakai GitHub Copilot)
- Full automation tanpa interaksi (pakai Devin)

---

> **Lanjut ke:** [`02-setup-dan-konfigurasi.md`](./02-setup-dan-konfigurasi.md)
