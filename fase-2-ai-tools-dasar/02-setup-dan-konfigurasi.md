# 02 — Setup & Konfigurasi

> **Estimasi:** 1 jam | **Level:** Pemula
> **Sumber:** [`feiskyer/claude-code-settings`](https://github.com/feiskyer/claude-code-settings), [`awattar/claude-code-best-practices`](https://github.com/awattar/claude-code-best-practices)

---

## 📖 TEORI

### Apa itu OpenCode/Claude Code?

OpenCode (Claude Code) adalah AI-powered CLI tool yang memungkinkan developer berinteraksi dengan model AI secara langsung dari terminal. Tool ini bisa membaca file, menjalankan perintah, membuat kode, dan melakukan automasi tugas-tugas pengembangan perangkat lunak.

Untuk konteks operator sekolah, OpenCode membantu dalam:
- Menulis dan mengedit dokumen administrasi
- Mengolah data Excel/CSV dari ARKAS dan Dapodik
- Membuat script automasi Google Apps Script
- Mengelola file dan direktori proyek
- Berinteraksi dengan browser untuk scraping data

---

### 1. Metode Instalasi

#### 1.1 Instalasi via npm (Node.js Package Manager)

Ini adalah metode paling umum dan direkomendasikan untuk pengguna Windows, macOS, dan Linux.

**Prasyarat:**
- Node.js versi 18 atau lebih baru
- npm versi 9 atau lebih baru

```bash
# Cek versi Node.js yang terinstall
node --version
# Output: v20.x.x

# Cek versi npm
npm --version
# Output: 10.x.x

# Jika belum terinstall, download dari https://nodejs.org
# Pilih versi LTS (Long Term Support)
```

**Instalasi:**

```bash
# Install secara global agar bisa diakses dari mana saja
npm install -g @anthropic-ai/claude-code

# Verifikasi instalasi berhasil
claude --version
# Output: Claude Code vX.X.X

# Cek help untuk melihat semua opsi
claude --help
```

**Troubleshooting npm:**

```bash
# Error: EACCES permission denied
# Solusi: gunakan sudo (Linux/Mac) atau jalankan sebagai Administrator (Windows)
sudo npm install -g @anthropic-ai/claude-code

# Error: npm not found
# Solusi: install Node.js terlebih dahulu dari nodejs.org

# Error: network timeout
# Solusi: cek koneksi internet, atau gunakan mirror registry
npm install -g @anthropic-ai/claude-code --registry=https://registry.npmmirror.com

# Error: heap out of memory
# Solusi: tingkatkan heap size Node.js
NODE_OPTIONS="--max-old-space-size=4096" npm install -g @anthropic-ai/claude-code
```

#### 1.2 Instalasi via pip (Python Package Manager)

Beberapa distribusi menyediakan Claude Code melalui pip. Metode ini cocok jika Anda sudah memiliki environment Python.

```bash
# Install via pip
pip install claude-code

# Atau dengan pipx untuk isolasi environment
pipx install claude-code

# Verifikasi
claude --version
```

**Catatan:** Metode pip mungkin tidak selalu tersedia versi terbaru. Disarankan menggunakan npm untuk versi paling update.

#### 1.3 Instalasi via Homebrew (macOS)

Untuk pengguna macOS, Homebrew adalah cara yang paling mudah.

```bash
# Pastikan Homebrew terinstall
brew --version

# Install Claude Code
brew install claude-code

# Verifikasi
claude --version

# Update ke versi terbaru
brew upgrade claude-code
```

#### 1.4 Instalasi via Scoop (Windows)

Untuk pengguna Windows yang prefer menggunakan package manager:

```powershell
# Install Scoop jika belum ada
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# Install Claude Code
scoop install claude-code

# Verifikasi
claude --version
```

#### 1.5 Instalasi Langsung (Binary/Executable)

Beberapa versi menyediakan binary langsung yang bisa di-download dan dijalankan tanpa dependensi.

```bash
# Download binary untuk Linux
curl -L https://releases.anthropic.com/claude-code/latest/claude-code-linux-x64.tar.gz | tar xz
sudo mv claude-code /usr/local/bin/

# Download binary untuk macOS
curl -L https://releases.anthropic.com/claude-code/latest/claude-code-macos-arm64.tar.gz | tar xz
sudo mv claude-code /usr/local/bin/

# Verifikasi
claude --version
```

---

### 2. Autentikasi dan API Key Setup

#### 2.1 Login via Browser (Default)

Cara paling mudah untuk memulai adalah login menggunakan akun Anthropic Claude.

```bash
# Mulai proses login
claude login

# Browser akan terbuka otomatis
# Login dengan akun Claude.ai Anda
# Setelah berhasil, terminal akan menampilkan pesan sukses
```

**Proses login:**
1. Jalankan `claude login`
2. Browser terbuka ke halaman autentikasi Anthropic
3. Login dengan email/password atau OAuth (Google/GitHub)
4. Authorization granted → token disimpan lokal
5. Terminal menampilkan "Login successful"

#### 2.2 Setup via Environment Variable (API Key)

Untuk penggunaan di server, CI/CD, atau environment tanpa browser, gunakan API key langsung.

```bash
# Linux/macOS - tambahkan ke shell profile
echo 'export ANTHROPIC_API_KEY=sk-ant-api03-xxx...' >> ~/.bashrc
source ~/.bashrc

# Windows PowerShell - tambahkan ke profile
[System.Environment]::SetEnvironmentVariable('ANTHROPIC_API_KEY', 'sk-ant-api03-xxx...', 'User')

# Windows CMD
setx ANTHROPIC_API_KEY "sk-ant-api03-xxx..."
```

**Mendapatkan API Key dari Anthropic Console:**
1. Buka https://console.anthropic.com
2. Login dengan akun Anda
3. Navigasi ke "API Keys" di sidebar
4. Klik "Create Key"
5. Beri nama deskriptif (misal: "opencode-sekolah")
6. Copy key dan simpan dengan aman
7. **PENTING:** Jangan pernah commit API key ke repository

#### 2.3 Environment Variables yang Tersedia

Berikut adalah environment variables yang bisa dikonfigurasi:

```bash
# API Key utama (wajib)
export ANTHROPIC_API_KEY="sk-ant-api03-xxx..."

# Base URL custom (untuk proxy atau custom endpoint)
export ANTHROPIC_BASE_URL="https://api.anthropic.com"

# Timeout request dalam detik
export CLAUDE_CODE_TIMEOUT=300

# Enable verbose logging untuk debugging
export CLAUDE_CODE_LOG_LEVEL=debug

# Path ke direktori konfigurasi
export CLAUDE_CONFIG_DIR="$HOME/.config/opencode"

# Proxy settings (jika diperlukan)
export HTTPS_PROXY="http://proxy.sekolah.sch.id:8080"
export HTTP_PROXY="http://proxy.sekolah.sch.id:8080"

# Disable telemetry jika diinginkan
export ANTHROPIC_DISABLE_TELEMETRY=true
```

#### 2.4 File .env untuk Project-Specific Config

Untuk proyek tertentu, Anda bisa menggunakan file `.env`:

```bash
# Buat file .env di root project
cat > .env << 'EOF'
ANTHROPIC_API_KEY=sk-ant-api03-xxx...
CLAUDE_MODEL=claude-sonnet-4-20250515
MAX_TOKENS=64000
EOF

# Load environment variables
source .env

# Atau gunakan package dotenv di Node.js
npm install dotenv
```

```javascript
// load-env.js
require('dotenv').config();
console.log('API Key configured:', process.env.ANTHROPIC_API_KEY ? 'Yes' : 'No');
```

---

### 3. Konfigurasi File

#### 3.1 File opencode.json

File konfigurasi utama untuk OpenCode. Biasanya terletak di `~/.config/opencode/opencode.json` atau di root project.

```json
{
  "model": "claude-sonnet-4-20250515",
  "provider": "anthropic",
  "maxTokens": 64000,
  "temperature": 0.7,
  "theme": "dark",
  "language": "id",
  "workspace": {
    "allowedDirectories": [
      "D:\\Programming\\fundamental-vibe-coding",
      "C:\\Users\\USER\\Documents\\Sekolah",
      "C:\\Users\\USER\\Desktop"
    ],
    "excludedPatterns": [
      "**/node_modules/**",
      "**/.git/**",
      "**/__pycache__/**",
      "**/*.pyc"
    ]
  },
  "permissions": {
    "fileRead": true,
    "fileWrite": true,
    "bash": true,
    "network": true,
    "mcp": true
  },
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\USER\\Documents"]
    },
    "excel": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/claude-code-excel"]
    },
    "pdf": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/claude-code-pdf"]
    }
  },
  "agents": {
    "explorer": {
      "model": "claude-opus-4-20250514",
      "description": "Agent untuk riset dan eksplorasi kode"
    },
    "builder": {
      "model": "claude-sonnet-4-20250515",
      "description": "Agent untuk implementasi dan coding"
    }
  },
  "hooks": {
    "preCommand": ["echo 'Starting command...'"],
    "postCommand": ["echo 'Command completed.'"]
  }
}
```

**Penjelasan field penting:**

| Field | Tipe | Deskripsi |
|-------|------|-----------|
| `model` | string | Model AI default yang digunakan |
| `provider` | string | Provider API (anthropic, openai, custom) |
| `maxTokens` | number | Maksimum token per response |
| `temperature` | number | Kreativitas output (0.0-1.0) |
| `theme` | string | Tema tampilan (dark, light, auto) |
| `language` | string | Bahasa komunikasi default |
| `workspace.allowedDirectories` | array | Direktori yang boleh diakses |
| `workspace.excludedPatterns` | array | Pattern file yang diabaikan |
| `permissions` | object | Hak akses berbagai operasi |
| `mcpServers` | object | Konfigurasi MCP servers |
| `agents` | object | Konfigurasi sub-agents |

#### 3.2 File CLAUDE.md

File `CLAUDE.md` berisi konteks proyek yang otomatis dibaca setiap sesi. Ini adalah cara paling efektif untuk memberikan instruksi kontekstual.

```markdown
# Context for Claude Code — SD Negeri Pasirhalang

## Identitas Proyek
- Nama: Sistem Administrasi SD Negeri Pasirhalang
- Lokasi: Desa Mandalamukti, Kec. Cikalongwetan, Kab. Bandung Barat
- NPSN: 20246185

## Konvensi Kode
- Bahasa: JavaScript/TypeScript untuk web, Python untuk data processing
- Style: ESLint + Prettier untuk JS, Black untuk Python
- Encoding: UTF-8

## Struktur Direktori
```
proyek-sekolah/
├── arkas/          # Data keuangan BOS
├── dapodik/        # Data Dapodik
├── surat/          # Template surat-menyurat
├── scripts/        # Script automasi
└── config/         # File konfigurasi
```

## Aturan Khusus
1. Selalu gunakan Bahasa Indonesia untuk komunikasi
2. Jangan pernah commit file yang berisi data sensitif siswa
3. Backup database sebelum operasi write
4. Validasi semua input data sebelum diproses
```

**Lokasi file CLAUDE.md:**
- **Global:** `~/.config/opencode/CLAUDE.md` — berlaku untuk semua proyek
- **Project:** `<project-root>/CLAUDE.md` — berlaku untuk proyek tertentu
- **Sub-direktori:** `<subdir>/CLAUDE.md` — berlaku untuk sub-direktori tertentu

**Prioritas loading (dari tertinggi ke terendah):**
1. CLAUDE.md di direktori kerja saat ini
2. CLAUDE.md di parent directory (hingga root)
3. CLAUDE.md global di `~/.config/opencode/`

#### 3.3 File settings.json

File settings untuk konfigurasi runtime Claude Code.

```json
{
  "model": "claude-sonnet-4-20250515",
  "maxTokens": 64000,
  "theme": "dark",
  "fontSize": 14,
  "fontFamily": "JetBrains Mono",
  "lineNumbers": true,
  "wordWrap": false,
  "autoSave": true,
  "autoSaveInterval": 30,
  "historyLimit": 1000,
  "commandTimeout": 300,
  "retryAttempts": 3,
  "retryDelay": 5,
  "proxy": {
    "enabled": false,
    "url": "http://proxy.sekolah.sch.id:8080",
    "username": "",
    "password": ""
  }
}
```

---

### 4. Provider Configuration

#### 4.1 Anthropic (Default)

Provider default menggunakan API Anthropic Claude.

```json
{
  "provider": "anthropic",
  "apiKey": "sk-ant-api03-xxx...",
  "baseUrl": "https://api.anthropic.com",
  "models": {
    "default": "claude-sonnet-4-20250515",
    "fast": "claude-haiku-4-20250514",
    "powerful": "claude-opus-4-20250514"
  }
}
```

**Setup:**
```bash
# Set API key
export ANTHROPIC_API_KEY="sk-ant-api03-xxx..."

# Atau via config
claude config set provider anthropic
claude config set model claude-sonnet-4-20250515
```

#### 4.2 OpenAI

Menggunakan model OpenAI (GPT-4, GPT-4o, dll).

```json
{
  "provider": "openai",
  "apiKey": "sk-proj-xxx...",
  "baseUrl": "https://api.openai.com/v1",
  "models": {
    "default": "gpt-4o",
    "fast": "gpt-4o-mini",
    "powerful": "gpt-4o"
  }
}
```

**Setup:**
```bash
export OPENAI_API_KEY="sk-proj-xxx..."
claude config set provider openai
claude config set model gpt-4o
```

#### 4.3 LiteLLM Proxy (Multi-Provider)

LiteLLM memungkinkan penggunaan berbagai provider melalui satu interface.

```json
{
  "provider": "litellm",
  "baseUrl": "http://localhost:4000",
  "apiKey": "sk-litellm-xxx...",
  "models": {
    "default": "anthropic/claude-sonnet-4-20250515",
    "fast": "openai/gpt-4o-mini",
    "powerful": "anthropic/claude-opus-4-20250514"
  }
}
```

**Setup LiteLLM:**
```bash
# Install LiteLLM
pip install litellm[proxy]

# Buat config.yaml
cat > litellm_config.yaml << 'EOF'
model_list:
  - model_name: claude-sonnet
    litellm_params:
      model: anthropic/claude-sonnet-4-20250515
      api_key: os.environ/ANTHROPIC_API_KEY
  - model_name: gpt-4o
    litellm_params:
      model: openai/gpt-4o
      api_key: os.environ/OPENAI_API_KEY
EOF

# Jalankan proxy
litellm --config litellm_config.yaml --port 4000

# Set OpenCode untuk menggunakan proxy
claude config set provider litellm
claude config set base_url http://localhost:4000
```

#### 4.4 GitHub Copilot

Menggunakan model Claude melalui GitHub Copilot subscription.

```json
{
  "provider": "github-copilot",
  "token": "github_token_xxx...",
  "models": {
    "default": "claude-sonnet-4",
    "powerful": "claude-opus-4"
  }
}
```

**Setup:**
```bash
# Login ke GitHub CLI
gh auth login

# Atau set token langsung
export GITHUB_TOKEN="ghp_xxx..."
claude config set provider github-copilot
```

#### 4.5 Google Vertex AI

Untuk enterprise yang menggunakan Google Cloud Platform.

```json
{
  "provider": "vertex",
  "projectId": "my-gcp-project",
  "location": "us-central1",
  "models": {
    "default": "claude-sonnet-v4@20250515",
    "powerful": "claude-opus-v4@20250514"
  }
}
```

**Setup:**
```bash
# Install Google Cloud CLI
# https://cloud.google.com/sdk/docs/install

# Login ke GCP
gcloud auth application-default login

# Set project
gcloud config set project my-gcp-project

# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com
```

#### 4.6 Custom Provider

Untuk provider lain yang mendukung OpenAI-compatible API.

```json
{
  "provider": "custom",
  "baseUrl": "https://api.provider-lain.com/v1",
  "apiKey": "xxx...",
  "modelName": "nama-model",
  "headers": {
    "X-Custom-Header": "value"
  }
}
```

---

### 5. Model Selection — Kapan Menggunakan Model Apa

#### 5.1 Perbandingan Model Anthropic

| Model | Kecepatan | Kemampuan | Harga/1M token | Cocok untuk |
|-------|-----------|-----------|----------------|-------------|
| **claude-haiku-4** | Sangat cepat | Dasar | ~$1 input / $5 output | Task sederhana, klasifikasi, parsing |
| **claude-sonnet-4** | Cepat | Menengah-tinggi | ~$3 input / $15 output | Coding sehari-hari, debugging, dokumentasi |
| **claude-opus-4** | Lambat | Tertinggi | ~$15 input / $75 output | Arsitektur kompleks, analisis mendalam |

#### 5.2 Panduan Pemilihan Model

**Gunakan Claude Haiku untuk:**
- Parsing data sederhana
- Klasifikasi teks
- Extract informasi dari dokumen
- Task yang butuh response cepat
- Task repetitif dengan pattern jelas

```json
{
  "model": "claude-haiku-4-20250514",
  "useCase": "Parsing data ARKAS ke format JSON"
}
```

**Gunakan Claude Sonnet untuk:**
- Coding sehari-hari
- Debugging bug
- Menulis dokumentasi
- Refactoring kode
- Generate script automasi
- **Ini adalah model default yang direkomendasikan**

```json
{
  "model": "claude-sonnet-4-20250515",
  "useCase": "Membuat script Google Apps Script untuk input data Dapodik"
}
```

**Gunakan Claude Opus untuk:**
- Desain arsitektur sistem
- Analisis kode kompleks
- Review kode kritis
- Task yang membutuhkan reasoning mendalam
- Problem solving yang sulit

```json
{
  "model": "claude-opus-4-20250514",
  "useCase": "Desain arsitektur sistem informasi sekolah terintegrasi"
}
```

#### 5.3 Strategi Cost Optimization

```json
{
  "costOptimization": {
    "strategy": "tiered",
    "rules": [
      {
        "condition": "simple_task",
        "model": "claude-haiku-4-20250514",
        "examples": ["parsing", "formatting", "extraction"]
      },
      {
        "condition": "normal_coding",
        "model": "claude-sonnet-4-20250515",
        "examples": ["coding", "debugging", "documentation"]
      },
      {
        "condition": "complex_analysis",
        "model": "claude-opus-4-20250514",
        "examples": ["architecture", "security_review", "optimization"]
      }
    ]
  }
}
```

**Tips menghemat biaya:**
1. Gunakan model yang lebih murah untuk task sederhana
2. Set `maxTokens` sesuai kebutuhan, jangan terlalu tinggi
3. Gunakan context yang efisien di CLAUDE.md
4. Cache response untuk task yang sering diulang
5. Gunakan sub-agent untuk task yang bisa diparalelkan

---

### 6. Workspace Setup

#### 6.1 Struktur Direktori yang Direkomendasikan

```
C:\Users\USER\Documents\Sekolah\
├── administrasi\
│   ├── surat-masuk\
│   ├── surat-keluar\
│   └── template\
├── keuangan\
│   ├── arkas\
│   │   ├── database\
│   │   ├── exports\
│   │   └── reports\
│   └── bos-online\
├── dapodik\
│   ├── peserta-didik\
│   ├── gtk\
│   ├── sarpras\
│   └── rombel\
├── scripts\
│   ├── arkas-tools\
│   ├── dapodik-scraper\
│   └── google-apps-script\
├── config\
│   ├── opencode.json
│   ├── dapodik_config.json
│   └── .env
└── CLAUDE.md
```

#### 6.2 Inisialisasi Workspace

```bash
# Buat struktur direktori
mkdir -p ~/Documents/Sekolah/{administrasi/{surat-masuk,surat-keluar,template},keuangan/{arkas/{database,exports,reports},bos-online},dapodik/{peserta-didik,gtk,sarpras,rombel},scripts/{arkas-tools,dapodik-scraper,google-apps-script},config}

# Inisialisasi Claude Code di workspace
cd ~/Documents/Sekolah
claude init

# Buat CLAUDE.md
touch CLAUDE.md
```

#### 6.3 Allowed Directories Configuration

Konfigurasi direktori yang boleh diakses untuk keamanan:

```json
{
  "workspace": {
    "allowedDirectories": [
      "C:\\Users\\USER\\Documents\\Sekolah",
      "C:\\Users\\USER\\Desktop",
      "D:\\Programming\\fundamental-vibe-coding"
    ],
    "excludedPatterns": [
      "**/node_modules/**",
      "**/.git/**",
      "**/__pycache__/**",
      "**/*.pyc",
      "**/Thumbs.db",
      "**/.DS_Store",
      "**/venv/**",
      "**/.venv/**"
    ],
    "maxFileSize": 10485760,
    "watchPatterns": [
      "**/*.md",
      "**/*.json",
      "**/*.js",
      "**/*.ts",
      "**/*.py",
      "**/*.xlsx",
      "**/*.csv"
    ]
  }
}
```

---

### 7. Permission Configuration

#### 7.1 Permission Levels

Claude Code memiliki beberapa level permission yang bisa dikonfigurasi:

```json
{
  "permissions": {
    "fileRead": {
      "enabled": true,
      "allowedPaths": ["**/*"],
      "deniedPaths": ["**/*.key", "**/*.pem", "**/secrets/**"]
    },
    "fileWrite": {
      "enabled": true,
      "allowedPaths": ["**/*"],
      "deniedPaths": ["**/system32/**", "**/windows/**"],
      "requireConfirmation": ["**/*.exe", "**/*.dll"]
    },
    "bash": {
      "enabled": true,
      "allowedCommands": [
        "git", "npm", "pip", "python", "node",
        "ls", "cd", "cat", "echo", "mkdir", "cp", "mv", "rm"
      ],
      "deniedCommands": [
        "rm -rf /", "format", "shutdown", "del /f /s /q"
      ],
      "requireConfirmation": [
        "rm -rf", "del /f", "DROP TABLE", "TRUNCATE"
      ]
    },
    "network": {
      "enabled": true,
      "allowedDomains": [
        "*.anthropic.com",
        "*.googleapis.com",
        "*.github.com",
        "*.google.com"
      ],
      "deniedDomains": ["*.malware.com"]
    },
    "mcp": {
      "enabled": true,
      "allowedServers": ["filesystem", "excel", "pdf", "google-sheets"]
    }
  }
}
```

#### 7.2 Permission Modes

```bash
# Mode strict — semua operasi berbahaya butuh konfirmasi
claude config set permission-mode strict

# Mode permissive — operasi umum diizinkan otomatis
claude config set permission-mode permissive

# Mode custom — konfigurasi manual
claude config set permission-mode custom
```

---

### 8. Proxy dan Network Setup

#### 8.1 Setup Proxy untuk Jaringan Sekolah

Banyak sekolah menggunakan proxy untuk mengontrol akses internet.

```bash
# Windows PowerShell
$env:HTTPS_PROXY = "http://proxy.sekolah.sch.id:8080"
$env:HTTP_PROXY = "http://proxy.sekolah.sch.id:8080"
$env:NO_PROXY = "localhost,127.0.0.1,.sekolah.sch.id"

# Windows CMD
set HTTPS_PROXY=http://proxy.sekolah.sch.id:8080
set HTTP_PROXY=http://proxy.sekolah.sch.id:8080
set NO_PROXY=localhost,127.0.0.1,.sekolah.sch.id

# Linux/macOS
export HTTPS_PROXY="http://proxy.sekolah.sch.id:8080"
export HTTP_PROXY="http://proxy.sekolah.sch.id:8080"
export NO_PROXY="localhost,127.0.0.1,.sekolah.sch.id"
```

#### 8.2 Proxy dengan Autentikasi

```bash
# Proxy dengan username dan password
export HTTPS_PROXY="http://username:password@proxy.sekolah.sch.id:8080"
```

#### 8.3 Konfigurasi di opencode.json

```json
{
  "proxy": {
    "enabled": true,
    "httpProxy": "http://proxy.sekolah.sch.id:8080",
    "httpsProxy": "http://proxy.sekolah.sch.id:8080",
    "noProxy": ["localhost", "127.0.0.1", ".sekolah.sch.id"],
    "auth": {
      "username": "operator",
      "password": "password123"
    },
    "sslVerify": true,
    "timeout": 30
  }
}
```

---

### 9. Troubleshooting Instalasi

#### 9.1 Masalah Umum dan Solusi

**Masalah 1: "claude: command not found"**

```bash
# Cek apakah npm global path ada di PATH
echo $PATH  # Linux/Mac
echo %PATH% # Windows CMD

# Tambahkan npm global path ke PATH
# Windows: tambahkan C:\Users\USER\AppData\Roaming\npm ke PATH
# Linux/Mac: tambahkan ~/.npm-global/bin ke PATH di ~/.bashrc
```

**Masalah 2: Error saat login**

```bash
# Cek koneksi internet
ping api.anthropic.com

# Cek apakah API key valid
curl -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     https://api.anthropic.com/v1/messages \
     -d '{"model":"claude-haiku-4-20250514","max_tokens":10,"messages":[{"role":"user","content":"hi"}]}'

# Hapus token lama dan login ulang
rm -rf ~/.config/opencode/auth
claude login
```

**Masalah 3: Out of memory**

```bash
# Tingkatkan heap size Node.js
export NODE_OPTIONS="--max-old-space-size=4096"

# Atau di opencode.json
{
  "nodeOptions": "--max-old-space-size=4096"
}
```

**Masalah 4: Timeout request**

```json
{
  "timeout": {
    "request": 300,
    "connection": 30,
    "idle": 60
  },
  "retry": {
    "enabled": true,
    "maxAttempts": 3,
    "delay": 5,
    "backoff": "exponential"
  }
}
```

**Masalah 5: Permission denied saat write file**

```bash
# Windows: jalankan terminal sebagai Administrator
# Linux/Mac: cek permission direktori
ls -la ~/Documents/Sekolah/
chmod -R u+rw ~/Documents/Sekolah/
```

**Masalah 6: MCP Server tidak bisa connect**

```bash
# Cek apakah server berjalan
npx @modelcontextprotocol/server-filesystem --help

# Cek log MCP
export CLAUDE_CODE_LOG_LEVEL=debug
claude

# Verifikasi konfigurasi MCP di opencode.json
cat ~/.config/opencode/opencode.json | jq '.mcpServers'
```

---

### 10. Setup dari Repo feiskyer/claude-code-settings

Repo ini menyediakan konfigurasi dan skills yang sudah teruji.

#### 10.1 Instalasi via Plugin Marketplace

```bash
# Tambahkan repo ke marketplace
/plugin marketplace add feiskyer/claude-code-settings

# Install semua skills inti
/plugin install spec-kit-skill
/plugin install autonomous-skill
/plugin install command-creator
/plugin install kiro-skill
/plugin install reflection

# Verifikasi skills terinstall
/skills list
```

#### 10.2 Instalasi Manual via Git

```bash
# Clone repo ke direktori konfigurasi
git clone https://github.com/feiskyer/claude-code-settings.git ~/.claude/claude-code-settings

# Copy konfigurasi
cp ~/.claude/claude-code-settings/settings.json ~/.config/opencode/settings.json
cp ~/.claude/claude-code-settings/CLAUDE.md ~/.config/opencode/CLAUDE.md

# Copy skills
cp -r ~/.claude/claude-code-settings/skills/* ~/.config/opencode/skills/
```

#### 10.3 Konfigurasi yang Tersedia

Repo feiskyer menyediakan:
- **settings.json** — Konfigurasi model, theme, permissions
- **CLAUDE.md** — Context template untuk berbagai jenis proyek
- **skills/** — Collection skills untuk spec-driven development
- **commands/** — Custom slash commands siap pakai
- **agents/** — Konfigurasi sub-agents untuk berbagai task

---

## ✅ CHECKLIST

- [ ] Claude Code/OpenCode terinstall dan bisa dijalankan
- [ ] Berhasil login atau setup API key
- [ ] File `opencode.json` terkonfigurasi dengan benar
- [ ] File `CLAUDE.md` dibuat di project directory
- [ ] Workspace setup dengan struktur direktori yang rapi
- [ ] Permissions dikonfigurasi sesuai kebutuhan
- [ ] Proxy dikonfigurasi (jika diperlukan)
- [ ] Model selection dipahami (kapan pakai Haiku/Sonnet/Opus)
- [ ] Skills dari feiskyer/claude-code-settings terinstall
- [ ] Troubleshooting umum dipahami

---

> **Lanjut ke:** [`03-claude-md-konteks-proyek.md`](./03-claude-md-konteks-proyek.md)
