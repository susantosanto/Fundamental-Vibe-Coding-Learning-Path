# 04 — Skills Dasar

> **Estimasi:** 1 jam | **Level:** Pemula
> **Sumber:** [`feiskyer/claude-code-settings — Skills`](https://github.com/feiskyer/claude-code-settings#skills), [`awattar/claude-code-best-practices`](https://github.com/awattar/claude-code-best-practices)

---

## 📖 TEORI

### Apa itu Skills?

**Skills** adalah modul kemampuan reusable yang mengajarkan Claude cara menyelesaikan tugas-tugas spesifik. Bayangkan skills sebagai "plugin" atau "extension" yang memperluas kemampuan Claude di luar kemampuan bawaannya.

Setiap skill berisi:
- **Deskripsi** — Kapan dan bagaimana skill harus digunakan
- **Workflow** — Langkah-langkah terstruktur untuk menyelesaikan tugas
- **Trigger** — Kata kunci atau pattern yang mengaktifkan skill secara otomatis
- **Resources** — File, script, atau template pendukung

**Analogi sederhana:** Jika Claude adalah smartphone, maka skills adalah aplikasi yang Anda install. Setiap app memberikan kemampuan baru yang tidak ada di sistem bawaan.

---

### 1. Struktur File Skill

#### 1.1 Format Dasar SKILL.md

Setiap skill didefinisikan dalam file `SKILL.md` dengan struktur standar:

```markdown
---
name: nama-skill
description: Deskripsi singkat kapan skill ini harus digunakan
version: 1.0.0
author: Nama Author
---

# Nama Skill

## Trigger
Kata kunci atau pattern yang mengaktifkan skill ini:
- "keyword 1"
- "keyword 2"
- /slash-command

## When to Use
Gunakan skill ini ketika:
- Kondisi 1
- Kondisi 2

## Workflow
1. **Langkah 1:** Deskripsi langkah pertama
2. **Langkah 2:** Deskripsi langkah kedua
3. **Langkah 3:** Deskripsi langkah ketiga

## Resources
- `scripts/helper.py` — Script helper
- `templates/template.md` — Template dokumen

## Examples
Contoh penggunaan skill ini dalam situasi nyata.
```

#### 1.2 Contoh Skill Lengkap: ARKAS Data Reader

```markdown
---
name: arkasku
description: Akses data ARKAS untuk membaca, mengekspor, dan menganalisis data keuangan BOS
version: 2.0.0
author: Operator SD Negeri Pasirhalang
---

# ARKAS Data Reader

## Trigger
Gunakan skill ini ketika user menyebutkan:
- "arkas", "bos", "anggaran", "rapbs"
- "kas umum", "keuangan sekolah", "realisasi"
- "ptk", "guru", "sekolah"
- File database `arkas.db` ditemukan

## When to Use
- User ingin membaca data anggaran BOS dari database ARKAS
- User ingin mengekspor data ke Excel/CSV
- User ingin membuat laporan keuangan
- User ingin melihat data PTK (Pendidik dan Tenaga Kependidikan)

## Workflow

### Fase 1: Koneksi Database
1. Cari file database ARKAS (biasanya di `C:\Program Files\ARKAS\database\arkas.db`)
2. Buka koneksi SQLite ke database
3. Verifikasi koneksi berhasil dengan query sederhana

### Fase 2: Identifikasi Kebutuhan
1. Tanya user data apa yang dibutuhkan:
   - Anggaran/RKAS
   - Realisasi/Kas Umum
   - Data PTK
   - Referensi
2. Tentukan tabel dan kolom yang relevan

### Fase 3: Eksekusi Query
1. Jalankan query SQL sesuai kebutuhan
2. Validasi hasil query
3. Format output sesuai permintaan (tabel, Excel, CSV)

### Fase 4: Output
1. Tampilkan hasil ke user
2. Tawarkan export ke file jika diperlukan
3. Simpan query untuk referensi

## Resources
- `scripts/arkas_query.py` — Script helper untuk query umum
- `templates/laporan_keuangan.md` — Template laporan

## Contoh Query Umum

### Lihat Total Anggaran per Kegiatan
```sql
SELECT kegiatan, SUM(jumlah) as total
FROM rapbs
GROUP BY kegiatan
ORDER BY total DESC;
```

### Realisasi vs Anggaran
```sql
SELECT
    r.kegiatan,
    r.jumlah as anggaran,
    COALESCE(SUM(k.jumlah), 0) as realisasi,
    r.jumlah - COALESCE(SUM(k.jumlah), 0) as sisa
FROM rapbs r
LEFT JOIN kas_umum k ON r.id = k.rapbs_id
GROUP BY r.kegiatan, r.jumlah;
```

## Troubleshooting

### Database terkunci
- Pastikan aplikasi ARKAS tidak sedang berjalan
- Copy database ke lokasi lain sebelum dibaca

### Data tidak lengkap
- Cek apakah sudah sync terbaru
- Verifikasi tahun anggaran yang aktif
```

---

### 2. Cara Kerja Skills

#### 2.1 Lifecycle Skill

```
┌─────────────────────────────────────────────────────────┐
│                    SKILL LIFECYCLE                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. DISCOVERY                                           │
│     Claude scan direktori skills saat startup           │
│     ├── ~/.config/opencode/skills/                      │
│     ├── <project>/.agents/skills/                       │
│     └── <project>/.claude/skills/                       │
│                                                         │
│  2. REGISTRATION                                        │
│     Setiap skill didaftarkan dengan:                    │
│     ├── name (unik)                                     │
│     ├── description (untuk matching)                    │
│     └── triggers (kata kunci pattern)                   │
│                                                         │
│  3. TRIGGERING                                          │
│     Skill aktif ketika:                                 │
│     ├── User memanggil /skill-name                      │
│     ├── Input user match trigger pattern                │
│     └── Claude memutuskan skill relevan                 │
│                                                         │
│  4. EXECUTION                                           │
│     Claude mengikuti workflow di skill:                 │
│     ├── Baca instruksi                                  │
│     ├── Ikuti langkah-langkah                           │
│     ├── Gunakan resources jika ada                      │
│     └── Hasilkan output                                 │
│                                                         │
│  5. COMPLETION                                          │
│     Skill selesai, Claude kembali ke mode normal        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 2.2 Auto-Trigger vs Manual Trigger

**Auto-Trigger:** Skill aktif otomatis ketika input user cocok dengan pattern.

```
User: "Tolong cek realisasi BOS bulan ini"
         ↓
Claude detect keyword: "realisasi", "BOS"
         ↓
Auto-load skill: arkasku
         ↓
Claude ikuti workflow arkasku
```

**Manual Trigger:** User memanggil skill secara eksplisit.

```
User: "/arkasku export kas umum ke excel"
         ↓
Claude langsung load skill: arkasku
         ↓
Claude ikuti workflow dengan argumen
```

#### 2.3 Skill Tool Invocation

Dalam implementasi teknis, skill di-load menggunakan tool `skill`:

```json
{
  "name": "skill",
  "arguments": {
    "name": "arkasku"
  }
}
```

Setelah skill di-load, Claude mendapatkan akses ke:
- Instruksi lengkap workflow
- File resources yang direferensikan
- Template dan script pendukung

---

### 3. Skill Discovery dan Instalasi

#### 3.1 Direktori Skill

Claude mencari skills di beberapa lokasi:

```
~/.config/opencode/skills/          # Global skills (semua proyek)
<project>/.agents/skills/           # Project skills (via agents)
<project>/.claude/skills/           # Project skills (via claude)
<project>/.opencode/skills/         # Project skills (via opencode)
```

**Prioritas loading:**
1. Project-level skills (terdekat dengan working directory)
2. Global skills (`~/.config/opencode/skills/`)
3. Built-in skills (bawaan Claude Code)

#### 3.2 Instalasi dari Marketplace

```bash
# Tambahkan repository ke marketplace
/plugin marketplace add feiskyer/claude-code-settings

# Lihat skills yang tersedia
/plugin marketplace list

# Install skill spesifik
/plugin install spec-kit-skill
/plugin install autonomous-skill
/plugin install command-creator
/plugin install kiro-skill
/plugin install reflection

# Update semua skills
/plugin update --all

# Hapus skill
/plugin uninstall spec-kit-skill
```

#### 3.3 Instalasi Manual

```bash
# Clone skill dari repository
git clone https://github.com/example/my-skill.git ~/.config/opencode/skills/my-skill

# Atau copy direktori skill
cp -r /path/to/skill ~/.config/opencode/skills/

# Verifikasi skill terdeteksi
/skills list
```

#### 3.4 Struktur Direktori Skill

```
~/.config/opencode/skills/
├── arkasku/
│   ├── SKILL.md              # File utama skill (WAJIB)
│   ├── scripts/
│   │   ├── arkas_query.py    # Script helper
│   │   └── export_excel.py   # Script export
│   ├── templates/
│   │   ├── laporan.md        # Template laporan
│   │   └── format_excel.txt  # Format export
│   └── README.md             # Dokumentasi tambahan
├── dapodik-scraper/
│   ├── SKILL.md
│   ├── scripts/
│   │   └── scraper.py
│   └── config/
│       └── default.json
└── surat-pindah/
    ├── SKILL.md
    └── templates/
        └── surat_pindah.docx
```

**File SKILL.md adalah satu-satunya file yang WAJIB ada.** File lainnya opsional tergantung kebutuhan skill.

---

### 4. Skill Permissions

#### 4.1 Permission Types

Skills bisa memiliki permission requirements:

```markdown
---
name: arkasku
description: Akses data ARKAS
permissions:
  - file_read:     # Bisa membaca file
      patterns: ["**/*.db", "**/*.sqlite"]
  - file_write:    # Bisa menulis file
      patterns: ["**/*.xlsx", "**/*.csv", "**/*.md"]
  - bash:          # Bisa menjalankan perintah
      commands: ["python", "sqlite3"]
  - network:       # Bisa akses network
      domains: ["*.dapodik.kemdikbud.go.id"]
---
```

#### 4.2 Permission Levels

| Level | Deskripsi | Contoh |
|-------|-----------|--------|
| **safe** | Operasi aman, tidak ada risiko | Baca file, query database read-only |
| **requires_approval** | Butuh konfirmasi user | Tulis file, jalankan script |
| **restricted** | Butuh permission khusus | Akses network, hapus file |
| **forbidden** | Tidak diizinkan | Format disk, akses sistem |

#### 4.3 Konfigurasi Permission di opencode.json

```json
{
  "skillPermissions": {
    "arkasku": {
      "fileRead": true,
      "fileWrite": true,
      "bash": ["python", "sqlite3"],
      "network": false
    },
    "dapodik-scraper": {
      "fileRead": true,
      "fileWrite": true,
      "bash": ["python", "pip"],
      "network": ["*.dapodik.kemdikbud.go.id"]
    },
    "surat-pindah": {
      "fileRead": true,
      "fileWrite": true,
      "bash": false,
      "network": false
    }
  }
}
```

---

### 5. Skill Triggers

#### 5.1 Trigger Types

**Keyword Trigger:** Aktif ketika kata kunci muncul di input user.

```markdown
## Trigger
- "arkas"
- "bos"
- "anggaran"
- "realisasi"
- "keuangan"
```

**File Pattern Trigger:** Aktif ketika file dengan pattern tertentu ditemukan.

```markdown
## Trigger
- File: `**/arkas.db`
- File: `**/*.arkas`
```

**Slash Command Trigger:** Aktif ketika user memanggil slash command.

```markdown
## Trigger
- /arkasku
- /arkas
```

**Context Trigger:** Aktif berdasarkan konteks percakapan.

```markdown
## Trigger
- Context: user sedang membahas keuangan sekolah
- Context: file database ARKAS sudah dibuka
```

#### 5.2 Trigger Priority

Ketika multiple skills match, prioritas ditentukan oleh:

1. **Explicit command** (`/skill-name`) — prioritas tertinggi
2. **File pattern match** — prioritas menengah
3. **Keyword match** — prioritas berdasarkan jumlah match
4. **Context match** — prioritas terendah

#### 5.3 Custom Trigger Configuration

```json
{
  "customTriggers": {
    "arkasku": {
      "keywords": ["arkas", "bos", "anggaran", "keuangan"],
      "files": ["**/*.db"],
      "commands": ["/arkasku", "/arkas", "/keuangan"],
      "priority": 10
    },
    "dapodik-scraper": {
      "keywords": ["dapodik", "peserta didik", "download data"],
      "files": ["**/dapodik_config.json"],
      "commands": ["/dapodik", "/download-pd"],
      "priority": 8
    }
  }
}
```

---

### 6. Built-in Skills Overview

#### 6.1 Skills untuk Development

| Skill | Deskripsi | Trigger |
|-------|-----------|---------|
| **brainstorming** | Eksplorasi ide sebelum implementasi | "brainstorm", "ide", "rencana" |
| **test-driven-development** | Workflow TDD | "test", "TDD", "test-driven" |
| **systematic-debugging** | Debugging terstruktur | "bug", "error", "tidak bekerja" |
| **writing-plans** | Membuat rencana implementasi | "plan", "rencana", "break down" |
| **executing-plans** | Eksekusi rencana yang sudah ditulis | "execute plan", "jalankan rencana" |
| **karpathy-skills** | Pedoman coding Andrej Karpathy | "karpathy", coding task |
| **receiving-code-review** | Menerima feedback code review | "review", "feedback" |
| **requesting-code-review** | Meminta code review | "review my code", "check this" |

#### 6.2 Skills untuk Administrasi Sekolah

| Skill | Deskripsi | Trigger |
|-------|-----------|---------|
| **arkasku** | Baca dan analisis data ARKAS | "arkas", "bos", "anggaran" |
| **dapodik-scraper** | Download data dari Dapodik | "dapodik", "download", "peserta didik" |
| **dapodik-student-lookup** | Cari data siswa | "cari siswa", "data siswa" |
| **dapodik-gtk-lookup** | Cari data GTK | "cari guru", "data guru", "GTK" |
| **surat-pindah** | Buat surat pindah siswa | "surat pindah", "pindah sekolah" |
| **browser-use** | Automasi browser | "buka website", "scrape", "login" |

#### 6.3 Skills untuk Dokumentasi

| Skill | Deskripsi | Trigger |
|-------|-----------|---------|
| **docx** | Buat/edit dokumen Word | "word", "docx", "dokumen" |
| **pdf** | Operasi PDF | "pdf", "merge", "split" |
| **pptx** | Buat/edit presentasi | "pptx", "presentasi", "slides" |
| **doc-coauthoring** | Co-author dokumentasi | "write doc", "buat dokumentasi" |

#### 6.4 Skills untuk Web Development

| Skill | Deskripsi | Trigger |
|-------|-----------|---------|
| **frontend-design** | Desain frontend | "frontend", "UI", "design" |
| **design-md** | Design system | "DESIGN.md", "design system" |
| **deploy-to-vercel** | Deploy ke Vercel | "deploy", "vercel", "live" |
| **web-design-guidelines** | Review UI guidelines | "review UI", "check accessibility" |

#### 6.5 Skills untuk Sistem

| Skill | Deskripsi | Trigger |
|-------|-----------|---------|
| **task-workflow** | Workflow 6 fase otomatis | Semua task kompleks |
| **using-superpowers** | Panduan penggunaan skills | Awal percakapan |
| **graphify** | Knowledge graph | "/graphify", arsitektur |
| **planning-with-files** | Planning dengan file | "plan", "organize" |
| **dispatching-parallel-agents** | Parallel agent execution | Task independen multiple |
| **subagent-driven-development** | Development dengan subagents | "subagent", "delegate" |

---

### 7. Membuat Custom Skill

#### 7.1 Langkah-langkah Membuat Skill

**Langkah 1: Buat direktori skill**

```bash
mkdir -p ~/.config/opencode/skills/laporan-bos
cd ~/.config/opencode/skills/laporan-bos
```

**Langkah 2: Buat file SKILL.md**

```markdown
---
name: laporan-bos
description: Buat laporan pertanggungjawaban BOS dari data ARKAS
version: 1.0.0
---

# Laporan BOS Generator

## Trigger
- "laporan bos", "lpj bos", "pertanggungjawaban"
- "laporan keuangan", "realisasi bos"
- /laporan-bos

## When to Use
- User ingin membuat laporan pertanggungjawaban BOS
- User ingin laporan realisasi anggaran
- User ingin laporan per semester/tahun

## Workflow

### Fase 1: Kumpulkan Data
1. Baca konfigurasi ARKAS dari `dapodik_config.json`
2. Buka database ARKAS
3. Extract data:
   - Anggaran per kegiatan (tabel RAPBS)
   - Realisasi pengeluaran (tabel Kas Umum)
   - Periode laporan (semester/tahun)

### Fase 2: Hitung dan Analisis
1. Hitung total anggaran
2. Hitung total realisasi
3. Hitung persentase serapan
4. Identifikasi kegiatan yang belum terealisasi
5. Hitung sisa anggaran

### Fase 3: Generate Laporan
1. Gunakan template laporan
2. Isi data yang sudah dihitung
3. Format sesuai standar Kemdikbud
4. Tambahkan tabel ringkasan
5. Export ke format yang diminta (Word/PDF/Excel)

### Fase 4: Review
1. Tampilkan preview laporan
2. Minta konfirmasi user
3. Simpan ke direktori output

## Template Struktur Laporan
```
LAPORAN PERTANGGUNGJAWABAN BOS
SD NEGERI PASIRHALANG
Semester: [GANJIL/GENAP]
Tahun: [TAHUN]

I.   Pendahuluan
II.  Realisasi Anggaran
     A. Komponen 1: [Nama]
     B. Komponen 2: [Nama]
     ...
III. Sisa Dana
IV.  Penutup
```

## Contoh Output
| Komponen | Anggaran | Realisasi | Persentase | Sisa |
|----------|----------|-----------|------------|------|
| Pembelajaran | 50.000.000 | 45.000.000 | 90% | 5.000.000 |
| Kesiswaan | 20.000.000 | 18.500.000 | 92.5% | 1.500.000 |
```

**Langkah 3: Buat script helper (opsional)**

```python
# scripts/laporan_helper.py
import sqlite3
import json
from datetime import datetime

def get_db_path():
    """Cari path database ARKAS"""
    config_path = "C:/Users/USER/.config/opencode/dapodik_config.json"
    with open(config_path) as f:
        config = json.load(f)
    return config.get('arkas_db_path', 'C:/Program Files/ARKAS/database/arkas.db')

def get_anggaran_per_kegiatan(semester, tahun):
    """Ambil data anggaran per kegiatan"""
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    cursor.execute("""
        SELECT kegiatan, SUM(jumlah) as total
        FROM rapbs
        WHERE semester = ? AND tahun = ?
        GROUP BY kegiatan
        ORDER BY total DESC
    """, (semester, tahun))
    return cursor.fetchall()

def get_realisasi(semester, tahun):
    """Ambil data realisasi pengeluaran"""
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    cursor.execute("""
        SELECT kegiatan, SUM(jumlah) as total
        FROM kas_umum
        WHERE semester = ? AND tahun = ?
        GROUP BY kegiatan
    """, (semester, tahun))
    return cursor.fetchall()

def hitung_persentase(realisasi, anggaran):
    """Hitung persentase serapan"""
    if anggaran == 0:
        return 0
    return (realisasi / anggaran) * 100
```

**Langkah 4: Buat template (opsional)**

```markdown
# templates/laporan_bos_template.md

# LAPORAN PERTANGGUNGUNGJAWABAN DANA BOS
## SD NEGERI {{sekolah_nama}}
### NPSN: {{npsn}}

**Semester:** {{semester}}
**Tahun Anggaran:** {{tahun}}
**Tanggal Laporan:** {{tanggal}}

---

## I. PENDAHULUAN

Dana Bantuan Operasional Sekolah (BOS) merupakan program pemerintah yang bertujuan untuk membiayai operasional sekolah. Laporan ini menyajikan realisasi penggunaan dana BOS periode {{semester}} tahun {{tahun}}.

## II. REALISASI ANGGARAN

### A. Ringkasan

| No | Komponen | Anggaran (Rp) | Realisasi (Rp) | % | Sisa (Rp) |
|----|----------|---------------|----------------|---|-----------|
{{#each komponen}}
| {{@index}} | {{nama}} | {{formatRupiah anggaran}} | {{formatRupiah realisasi}} | {{persentase}}% | {{formatRupiah sisa}} |
{{/each}}

### B. Total

| | Anggaran | Realisasi | Persentase |
|-|----------|-----------|------------|
| Total | {{formatRupiah total_anggaran}} | {{formatRupiah total_realisasi}} | {{persentase_total}}% |

## III. SISA DANA

Sisa dana BOS per {{tanggal}} sebesar **{{formatRupiah sisa_dana}}** akan digunakan untuk kegiatan pada periode berikutnya.

## IV. PENUTUP

Demikian laporan pertanggungjawaban dana BOS ini dibuat dengan sebenar-benarnya.

{{tempat_tanggal}}, {{tanggal}}
Kepala Sekolah

{{nama_kepala_sekolah}}
NIP. {{nip_kepala_sekolah}}
```

#### 7.2 Testing Skill

```bash
# Cek skill terdaftar
/skills list

# Test skill dengan trigger manual
/laporan-bos semester ganjil tahun 2025

# Test auto-trigger
User: "Buatkan laporan BOS semester ganjil 2025"
# Claude seharusnya auto-load skill laporan-bos
```

---

### 8. Skill Best Practices

#### 8.1 Penamaan Skill

```
BAIK:
- arkasku              # Singkat, deskriptif
- dapodik-scraper      # Kebab-case, jelas fungsinya
- surat-pindah         # Jelas konteksnya
- laporan-bos          # Jelas outputnya

BURUK:
- skill1               # Tidak deskriptif
- MyAwesomeSkill       # Camel case tidak konsisten
- data_processor_v2_final  # Terlalu panjang
- temp                 # Tidak jelas fungsinya
```

#### 8.2 Deskripsi Skill yang Baik

```
BAIK:
"Akses cepat data ARKAS untuk membaca, mengekspor, dan menganalisis data keuangan BOS dari database ARKAS"
"Cari data lengkap siswa berdasarkan nama dan kelas dari Dapodik Web Service untuk keperluan surat-menyurat"

BURUK:
"Skill untuk data"              # Terlalu umum
"Membantu user"                 # Tidak jelas apa yang dibantu
"Proses data dari database"     # Database apa? Data apa?
```

#### 8.3 Workflow yang Efektif

```markdown
BAIK:
## Workflow
1. **Koneksi:** Buka database ARKAS
2. **Query:** Jalankan query sesuai kebutuhan
3. **Format:** Output dalam format yang diminta
4. **Export:** Simpan ke file jika diminta

BURUK:
## Workflow
1. Lakukan sesuatu dengan data
2. Proses datanya
3. Berikan hasilnya
```

#### 8.4 Error Handling dalam Skill

```markdown
## Troubleshooting

### Database tidak ditemukan
1. Cek path database di `dapodik_config.json`
2. Pastikan ARKAS sudah terinstall
3. Jika ARKAS terenkripsi, gunakan decryptor

### Data kosong
1. Pastikan tahun anggaran benar
2. Cek apakah data sudah di-sync
3. Verifikasi periode yang diminta

### Export gagal
1. Cek permission direktori output
2. Pastikan tidak ada file yang sedang terbuka
3. Coba format export yang berbeda
```

#### 8.5 Modularisasi Skill

Untuk skill yang kompleks, pecah menjadi beberapa skill kecil:

```
skills/
├── arkas-core/          # Core functionality
│   ├── SKILL.md
│   └── scripts/db_connect.py
├── arkas-export/        # Export functionality
│   ├── SKILL.md
│   └── scripts/export.py
├── arkas-report/        # Report generation
│   ├── SKILL.md
│   └── templates/
└── arkas-validate/      # Data validation
    ├── SKILL.md
    └── scripts/validate.py
```

---

### 9. Skill Troubleshooting

#### 9.1 Skill Tidak Terdeteksi

```bash
# Cek apakah file SKILL.md ada
ls ~/.config/opencode/skills/nama-skill/SKILL.md

# Cek format SKILL.md valid
cat ~/.config/opencode/skills/nama-skill/SKILL.md

# Restart Claude Code untuk reload skills
exit
claude

# Cek log untuk error
export CLAUDE_CODE_LOG_LEVEL=debug
claude
```

#### 9.2 Skill Tidak Auto-Trigger

```bash
# Cek trigger pattern di SKILL.md
grep -A 10 "Trigger" ~/.config/opencode/skills/nama-skill/SKILL.md

# Test trigger manual
/nama-skill

# Cek apakah keyword yang digunakan match dengan trigger
# Contoh: jika trigger "arkas" tapi user ketik "arkass" (typo), tidak match
```

#### 9.3 Skill Error Saat Eksekusi

```bash
# Cek apakah resources/script ada
ls ~/.config/opencode/skills/nama-skill/scripts/

# Test script secara manual
python ~/.config/opencode/skills/nama-skill/scripts/helper.py

# Cek permission file
ls -la ~/.config/opencode/skills/nama-skill/scripts/
chmod +x ~/.config/opencode/skills/nama-skill/scripts/*.py
```

#### 9.4 Konflik antar Skill

Ketika dua skill memiliki trigger yang sama:

```json
{
  "skillPriority": {
    "arkasku": 10,
    "laporan-bos": 8,
    "dapodik-scraper": 5
  }
}
```

Skill dengan priority lebih tinggi akan di-load terlebih dahulu.

---

### 10. Contoh Skill untuk Administrasi Sekolah

#### 10.1 Skill: Verval PD (Verval Peserta Didik)

```markdown
---
name: verval-pd
description: Bantu proses verval peserta didik di sistem Dapodik
version: 1.0.0
---

# Verval Peserta Didik

## Trigger
- "verval pd", "verval peserta didik"
- "verifikasi data siswa"
- "update data pd"
- /verval-pd

## Workflow

### Fase 1: Persiapan Data
1. Buka Dapodik Web Service di browser
2. Login dengan akun sekolah
3. Navigasi ke menu Verval PD
4. Download data peserta didik saat ini

### Fase 2: Verifikasi Data
1. Bandingkan data di Dapodik dengan data fisik sekolah
2. Identifikasi perbedaan:
   - Nama siswa
   - NIK/NISN
   - Tempat/tanggal lahir
   - Alamat
   - Data orang tua
3. Catat data yang perlu diverval

### Fase 3: Proses Verval
1. Untuk setiap data yang perlu diubah:
   - Klik "Verval" pada data siswa
   - Input data yang benar
   - Upload dokumen pendukung jika diperlukan
2. Simpan perubahan
3. Verifikasi status verval

### Fase 4: Konfirmasi
1. Cek status verval di dashboard
2. Pastikan semua perubahan tersimpan
3. Dokumentasi perubahan yang dilakukan
```

#### 10.2 Skill: Inventaris Sarpras

```markdown
---
name: sarpras-inventory
description: Kelola inventaris sarana dan prasarana sekolah
version: 1.0.0
---

# Inventaris Sarpras

## Trigger
- "inventaris", "sarpras", "sarana prasarana"
- "data barang", "aset sekolah"
- "kondisi ruang", "inventarisasi"
- /sarpras

## Workflow

### Fase 1: Input Data
1. Kumpulkan data sarpras:
   - Nama barang/ruangan
   - Jumlah
   - Kondisi (baik, rusak ringan, rusak berat)
   - Tahun pengadaan
   - Sumber dana
2. Input ke Dapodik atau spreadsheet

### Fase 2: Analisis
1. Hitung rasio barang/siswa
2. Identifikasi barang yang perlu penggantian
3. Estimasi biaya pengadaan baru

### Fase 3: Laporan
1. Generate laporan inventaris
2. Buat rekomendasi pengadaan
3. Export ke format yang diminta
```

#### 10.3 Skill: Slip Gaji GTK

```markdown
---
name: slip-gaji
description: Generate slip gaji guru dan tenaga kependidikan
version: 1.0.0
---

# Slip Gaji GTK

## Trigger
- "slip gaji", "gaji guru", "gaji ptk"
- "payslip", "penghasilan guru"
- /slip-gaji

## Workflow

### Fase 1: Kumpulkan Data
1. Data GTK dari Dapodik:
   - Nama, NIP, NUPTK
   - Golongan, pangkat
   - Masa kerja
2. Komponen penghasilan:
   - Gaji pokok
   - Tunjangan fungsional
   - Tunjangan keluarga
   - Tunjangan beras
3. Potongan:
   - PPh 21
   - BPJS
   - Koperasi (jika ada)

### Fase 2: Hitung
1. Gaji pokok sesuai golongan
2. Tunjangan sesuai ketentuan
3. Potongan sesuai aturan
4. Take home pay

### Fase 3: Generate
1. Buat slip gaji per GTK
2. Format sesuai template
3. Export ke PDF atau cetak
```

---

### 11. Skill Superpowers System

OpenCode menggunakan sistem Superpowers untuk manajemen skills yang lebih advanced.

#### 11.1 List Semua Skill Tersedia

```bash
# Lihat semua skill yang tersedia
/superpowers list

# Atau gunakan tool
skill: list
```

#### 11.2 Load Skill Secara Manual

```bash
# Load skill spesifik
/skill nama-skill

# Atau via tool call
{
  "name": "skill",
  "arguments": {
    "name": "arkasku"
  }
}
```

#### 11.3 Skill Installation dari skills.sh

```bash
# Menu interaktif install skills
/skill-install

# Atau via command line
/skills install <skill-name>

# Lihat skills yang sudah terinstall
/skills list
```

#### 11.4 Skill Update

```bash
# Update semua skills
/skills update

# Update skill spesifik
/skills update nama-skill

# Cek versi skill
/skills info nama-skill
```

---

## ✅ CHECKLIST

- [ ] Paham apa itu skills dan bagaimana cara kerjanya
- [ ] Bisa install skills dari marketplace dan manual
- [ ] Memahami struktur file SKILL.md
- [ ] Bisa membuat custom skill sederhana
- [ ] Tahu built-in skills yang tersedia
- [ ] Memahami skill triggers dan permissions
- [ ] Bisa troubleshooting masalah skill umum
- [ ] Paham best practices penamaan dan penulisan skill
- [ ] Bisa membuat skill untuk kebutuhan administrasi sekolah
- [ ] Memahami skill superpowers system

---

> **Lanjut ke:** [`05-custom-slash-commands.md`](./05-custom-slash-commands.md)
