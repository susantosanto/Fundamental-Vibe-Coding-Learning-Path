# Ringkasan Lengkap Fase 5: Scenario Praktis

> **Panduan komprehensif: semua yang sudah dipelajari, bagaimana semuanya terhubung, dan apa langkah selanjutnya**

**Estimasi**: 30 menit review + 60 menit self-assessment | **Level**: Semua level

## 🎯 Tujuan Modul Ini

Modul ini adalah **peta jalan lengkap** dari seluruh Fase 5. Di sini kamu akan menemukan:
- Journey map dari 10 modul yang sudah dipelajari
- Ringkasan detail per modul dengan konsep kunci dan contoh
- Peta pengetahuan: bagaimana semua konsep saling terhubung
- Panduan pemilihan scenario berdasarkan role kamu
- Self-assessment quiz dengan 25 pertanyaan
- Checklist kesiapan Fase 6
- Rekomendasi bacaan lanjutan
- 5 ide proyek praktis yang menggabungkan multiple skills
- Aplikasi karir: cara menggunakan skills Fase 5 di pekerjaan sehari-hari

---

## 🗺️ Journey Map: 10 Modul Fase 5

Fase 5 terdiri dari **10 modul** yang dibagi menjadi **2 jalur**:

### Jalur B: Programmer (7 modul)

| # | Modul | Topik | Waktu | Level |
|---|-------|-------|-------|-------|
| B1 | `02-development-daily.md` | Development Daily Workflow | 50 menit | Intermediate |
| B2 | `04-refactoring-testing.md` | Refactoring & Testing | 80 menit | Intermediate-Advanced |
| B3 | `05-dokumentasi-git.md` | Dokumentasi & Git | 75 menit | Intermediate-Advanced |
| B4 | `06-cicd-integration.md` | CI/CD Integration | 100 menit | Intermediate-Advanced |
| B5 | `07-custom-dev-agents.md` | Custom Dev Agents | 80 menit | Intermediate-Advanced |

### Jalur C: Office & Data (3 modul)

| # | Modul | Topik | Waktu | Level |
|---|-------|-------|-------|-------|
| C0 | `01-workflow-produksi-konten.md` | Workflow Produksi Konten | 60 menit | Pemula-Menengah |
| C1 | `03-file-management.md` | File Management | 70 menit | Pemula-Menengah |
| C2 | `08-pengolahan-data.md` | Pengolahan Data | 100 menit | Pemula-Menengah |
| C4 | `09-otomatisasi-script.md` | Otomatisasi Script | 100 menit | Pemula-Menengah |

### Alur Belajar yang Direkomendasikan

```
                    ┌──────────────────────────────────────┐
                    │        FASE 5: SCENARIO PRAKTIS       │
                    └──────────────────┬───────────────────┘
                                       │
                    ┌──────────────────┴───────────────────┐
                    │                                      │
              ┌─────▼─────┐                          ┌─────▼─────┐
              │  JALUR B   │                          │  JALUR C   │
              │ Programmer │                          │ Office/Data│
              └─────┬─────┘                          └─────┬─────┘
                    │                                      │
              ┌─────▼─────┐                          ┌─────▼─────┐
              │ B1: Daily  │                          │ C0: Konten│
              │ Dev        │                          │ Produksi  │
              └─────┬─────┘                          └─────┬─────┘
                    │                                      │
              ┌─────▼─────┐                          ┌─────▼─────┐
              │ B2: Refac- │                          │ C1: File  │
              │ tor & Test │                          │ Mgmt      │
              └─────┬─────┘                          └─────┬─────┘
                    │                                      │
              ┌─────▼─────┐                          ┌─────▼─────┐
              │ B3: Docs   │                          │ C2: Data  │
              │ & Git      │                          │ Processing│
              └─────┬─────┘                          └─────┬─────┘
                    │                                      │
              ┌─────▼─────┐                          ┌─────▼─────┐
              │ B4: CI/CD  │                          │ C4: Auto  │
              │ Integration│                          │ Scripting │
              └─────┬─────┘                          └─────┬─────┘
                    │                                      │
              ┌─────▼─────┐                                │
              │ B5: Custom │                                │
              │ Agents     │                                │
              └─────┬─────┘                                │
                    │                                      │
                    └──────────────────┬───────────────────┘
                                       │
                              ┌────────▼────────┐
                              │  MODUL 10:      │
                              │  RINGKASAN      │
                              │  (Modul ini!)   │
                              └─────────────────┘
```

---

## 📚 Ringkasan Detail Per Modul

### Modul 01: Workflow Produksi Konten (C0)

**File**: `01-workflow-produksi-konten.md` | **1142 baris**

#### Konsep Kunci
- **3 Tahap AI Writing**: 构思 (Planning) → Output (Building) → Iterasi (Refining)
- **Plan mode** untuk outline dan strategi, **Build mode** untuk generate file
- **Content repurposing**: satu konten → banyak format (blog → sosmed → newsletter → video)
- **SEO optimization** dengan AI: keyword density, meta tags, heading structure
- **Content calendar** untuk perencanaan konten bulanan
- **Batch production** untuk efisiensi waktu

#### Contoh Praktis
```
# Template Outline Artikel
- Posisi Artikel: Inti dalam 1 kalimat
- Struktur: Tabel Bagian | Fungsi | Estimasi kata | Keyword target
- Poin per Bagian: Detail setiap section
- 3 Alternatif Judul + analisis SEO
- Meta Description (150-160 karakter)

# Content Repurposing Framework
Artikel Blog (1000 kata)
├── Instagram Carousel (5-10 slide)
├── Twitter Thread (7-10 tweets)
├── TikTok/Reels Script (60 detik)
├── Newsletter (500 kata)
├── LinkedIn Post (300 kata)
└── Podcast Outline (10 menit)
```

#### Skill yang Didapat
- [x] Plan mode untuk构思 dan outline
- [x] Build mode untuk generate konten
- [x] SEO optimization dengan AI
- [x] Content calendar management
- [x] Content repurposing multi-platform
- [x] Video script writing dengan timing
- [x] Newsletter dan email marketing
- [x] Image generation prompt engineering
- [x] Batch content production
- [x] Content analytics dan optimization

---

### Modul 02: Development Daily (B1)

**File**: `02-development-daily.md` | **1441 baris**

#### Konsep Kunci
- **Dev Workflow**: Plan (memahami kode) → Build (implementasi) → Verify (test) → Review
- **3 Skenario**: Memahami kode baru, Fitur baru, Fix Bug
- **Plan → Build sequence** untuk semua skenario pengembangan
- **Code review dengan AI**: security, performance, maintainability
- **Refactoring aman**: test-first, incremental changes, commit frequently
- **Full day development** dengan AI assistance dari pagi sampai sore

#### Contoh Praktis
```
# Workflow Development Harian
08:00 — Morning Standup Preparation
08:30 — Codebase Understanding (Plan mode + @explore)
09:30 — Task Breakdown & Planning
10:00 — Implementation: Step 1 (Build mode)
10:45 — Implementation: Step 2
11:30 — Testing (AI generate unit test)
13:00 — Code Review (Self-review dengan AI)
14:00 — Bug Fix (Root cause analysis → Fix → Verify)
15:00 — Documentation (README, API docs, inline comments)
16:00 — Commit & Push (Conventional Commits)
16:30 — Wrap Up & Tomorrow Planning
```

#### Skill yang Didapat
- [x] Memahami codebase asing dengan AI
- [x] Feature development end-to-end
- [x] Bug triage dan fixing sistematis
- [x] Code review dengan AI assistance
- [x] Refactoring dengan test-first approach
- [x] Dokumentasi generasi (README, API docs, ADR)
- [x] AI-assisted testing (unit, integration, TDD)
- [x] Daily standup preparation
- [x] Task breakdown dan planning
- [x] Commit message generation

---

### Modul 03: File Management (C1)

**File**: `03-file-management.md` | **1603 baris**

#### Konsep Kunci
- **Hierarki File Management**: Dasar → Menengah → Lanjut → Expert
- **Naming convention**: `[Tanggal]_[Kategori]_[Deskripsi]_[Versi].[ext]`
- **Batch operations**: rename, convert, compress, organize
- **Document processing**: PDF extraction, OCR, form filling
- **Spreadsheet automation**: data cleaning, formula, pivot table
- **Backup strategy 3-2-1**: 3 kopi, 2 media, 1 offsite

#### Contoh Praktis
```
# Struktur Folder Sekolah
📁 SDN-Pasirhalang/
├── 📁 Administrasi/
│   ├── 📁 Surat Masuk/2026/01-Januari/
│   ├── 📁 Surat Keluar/2026/
│   └── 📁 SK dan Keputusan/
├── 📁 Keuangan BOS/
│   ├── 📁 Perencanaan/RKAS 2026/
│   ├── 📁 Realisasi/Kwitansi/
│   └── 📁 Pelaporan/LPJ Semester 1/
├── 📁 Data Dapodik/
│   ├── 📁 Peserta Didik/
│   ├── 📁 GTK/
│   └── 📁 Sarpras/
└── 📁 Arsip/2024/2025/2026/

# Workflow Harian Operator
PAGI: Cek email → Download attachment → Klasifikasi → Filing
SIANG: Proses dokumen keuangan → Input kwitansi → Update BOS
SORE: Backup harian → Verify integrity → Log aktivitas
```

#### Skill yang Didapat
- [x] Desain struktur folder yang logis
- [x] Naming convention konsisten
- [x] Batch rename dan organize
- [x] PDF text extraction dan OCR
- [x] Form filling otomatis
- [x] Data cleaning spreadsheet
- [x] Pivot table dan chart
- [x] Email template dan auto-reply
- [x] Backup strategy 3-2-1
- [x] Version control dokumen
- [x] Retention policy dan archive

---

### Modul 04: Refactoring & Testing (B2)

**File**: `04-refactoring-testing.md` | **1858+ baris**

#### Konsep Kunci
- **Refactoring ≠ Rewriting**: small steps, behavior preserved, commit sering
- **Code smell identification**: long method, large class, duplicated code, magic numbers
- **Safe refactoring patterns**: extract method, rename, move method, polymorphism
- **Test-first refactoring**: Golden Master technique untuk legacy code
- **SOLID principles**: SRP, OCP, LSP, ISP, DIP dengan contoh before/after
- **Database refactoring**: schema migration, backward compatibility
- **API refactoring**: versioning, deprecation strategy

#### Contoh Praktis
```
# Refactoring Workflow
1. 🔴 RED — Write failing test (atau capture golden master)
2. 🟢 GREEN — Make test pass
3. 🔵 REFACTOR — Clean up code, test tetap hijau
4. 🔄 REPEAT — Small steps, commit setiap cycle

# SOLID Principles Applied
SRP: StudentReport → GradeCalculator + ReportFormatter + ReportRepository
OCP: switch statement → Strategy pattern dengan interface
LSP: Student/OnlineStudent → Interface segregation (ClassAttendee, ExamTaker)
ISP: SchoolWorker → Teacher + Administrator + Janitor (separate interfaces)
DIP: MySQLConnection → DatabaseConnection interface (dependency injection)
```

#### Skill yang Didapat
- [x] Identifikasi code smell dengan AI
- [x] Safe refactoring patterns
- [x] Golden Master technique untuk legacy code
- [x] Incremental refactoring strategy
- [x] SOLID principles application
- [x] Database schema migration
- [x] API versioning dan deprecation
- [x] Refactoring checklist (pre/during/post)
- [x] Legacy code modernization
- [x] Dependency injection pattern

---

### Modul 05: Dokumentasi & Git (B3)

**File**: `05-dokumentasi-git.md` | **1702+ baris**

#### Konsep Kunci
- **7 Layer Dokumentasi**: README → API Docs → Architecture → Inline Comments → Changelog → Onboarding → Git Workflow
- **Self-documenting code vs Comments**: WHY bukan WHAT
- **Conventional Commits**: `<type>(<scope>): <description>`
- **OpenAPI/Swagger specification** auto-generated dari kode
- **Architecture Decision Records (ADR)** untuk keputusan teknis
- **Knowledge base** auto-generated dari kodebase

#### Contoh Praktis
```
# Conventional Commits Reference
| Type     | Kapan                    | Contoh                                    |
|----------|--------------------------|-------------------------------------------|
| feat     | Fitur baru               | feat(absensi): endpoint input kehadiran   |
| fix      | Bug fix                  | fix(login): error 500 saat password salah  |
| docs     | Dokumentasi              | docs(api): update endpoint absensi        |
| refactor | Ubah struktur            | refactor(auth): extract JWT module        |
| test     | Test related             | test(absensi): edge case tanggal libur    |
| chore    | Maintenance              | chore(deps): update express ke 4.19       |

# Breaking Changes Convention
feat(auth): mengganti JWT secret rotation strategy

BREAKING CHANGE: JWT secret sekarang di-rotate setiap 24 jam.
Migration guide:
1. Update semua client untuk handle 401 Unauthorized
2. Implement token refresh flow
```

#### Skill yang Didapat
- [x] Auto-generate README profesional
- [x] API documentation dari kode
- [x] OpenAPI/Swagger specification
- [x] Architecture documentation dengan Mermaid
- [x] Inline comments yang efektif (WHY bukan WHAT)
- [x] Conventional Commits
- [x] PR description generator
- [x] Changelog management (Keep a Changelog)
- [x] Onboarding documentation
- [x] Knowledge base creation
- [x] Dokumentasi maintenance workflow

---

### Modul 06: CI/CD Integration (B4)

**File**: `06-cicd-integration.md` | **1636+ baris**

#### Konsep Kunci
- **Pipeline CI/CD**: Lint → Type Check → Test → Build → Security → Deploy
- **Environment promotion**: Development → Staging → Production
- **GitHub Actions** workflow untuk Node.js, Frontend, Python
- **Code quality gates**: linting, coverage threshold, security scan
- **Automated deployment** dengan approval gate
- **Rollback strategy**: automatic dan manual
- **Security scanning**: SAST, DAST, dependency, container

#### Contoh Praktis
```yaml
# CI/CD Pipeline Flow
Trigger (push/PR)
  ↓
LINT (ESLint, Prettier)
  ↓ ✅
TYPE CHECK (tsc --noEmit)
  ↓ ✅
TEST (Unit → Integration → E2E)
  ↓ ✅
BUILD (Compile, Bundle)
  ↓ ✅
SECURITY (SAST → DAST → Dependency Scan)
  ↓ ✅
DEPLOY (Staging → Approval → Production)

# Rollback Strategy
deploy-production:
  - Deploy to production
  - Health check (5 retries)
  - If health check fails → Automatic rollback
  - Notify Slack on rollback
```

#### Skill yang Didapat
- [x] Desain pipeline CI/CD lengkap
- [x] GitHub Actions workflow
- [x] Automated testing di CI
- [x] Code quality gates
- [x] Security scanning (SAST, DAST, dependency)
- [x] Automated deployment
- [x] Environment management dan secrets
- [x] Rollback strategies
- [x] Monitoring dan health checks
- [x] Release automation

---

### Modul 07: Custom Dev Agents (B5)

**File**: `07-custom-dev-agents.md` | **1564+ baris**

#### Konsep Kunci
- **Agent Design Principles**: Single Responsibility, Clear Scope, Well-Defined Outputs, Least Privilege
- **8 jenis agent**: Code Reviewer, Security Auditor, Performance Optimizer, Doc Writer, Test Generator, DB Migrator, API Tester, Frontend Reviewer
- **Agent configuration**: system prompts, tool access, model selection, permissions
- **Multi-agent pipeline**: sequential dan parallel execution
- **Agent testing**: happy path, bug detection, false positive, permission check
- **Performance monitoring**: success rate, token usage, cost optimization

#### Contoh Praktis
```
# Agent Types Matrix
| Agent            | Permission    | Temperature | Model        |
|------------------|---------------|-------------|--------------|
| Code Reviewer    | Read-only     | 0.2         | Claude Sonnet|
| Security Auditor | Read-only     | 0.1         | Claude Opus  |
| Test Generator   | Edit (test)   | 0.3         | Claude Sonnet|
| Doc Writer       | Edit (docs)   | 0.4         | Claude Sonnet|
| Performance Opt. | Read-only     | 0.2         | Claude Opus  |
| DB Migrator      | Edit + Bash   | 0.2         | Claude Sonnet|
| API Tester       | Edit + Bash   | 0.3         | Claude Sonnet|
| Frontend Review  | Read-only     | 0.2         | Claude Sonnet|

# Multi-Agent Pipeline
Phase 1: @code-reviewer → Code quality report
Phase 2: @security-auditor → Security audit report
Phase 3: @performance-optimizer → Performance report
Phase 4: @test-writer → Test gap analysis
Phase 5: @doc-writer → Documentation gap report
Final: Consolidated report dengan prioritas
```

#### Skill yang Didapat
- [x] Agent design principles
- [x] 8 jenis custom dev agents
- [x] Agent configuration dan permissions
- [x] Model selection guide
- [x] Agent testing dan validation
- [x] Performance monitoring
- [x] Multi-agent pipeline
- [x] Parallel agent execution
- [x] Agent versioning
- [x] Cost optimization

---

### Modul 08: Pengolahan Data (C2)

**File**: `08-pengolahan-data.md` | **500+ baris**

#### Konsep Kunci
- **Alur Pengolahan Data**: Ingest → Profile → Clean → Transform → Analyze → Visualize → Report → Store
- **Data cleaning**: missing values, duplicates, outliers, format standardization
- **Data transformation**: pivot, melt, merge, join, concat
- **Statistical analysis**: descriptive, correlation, trend, anomaly detection
- **Visualization**: matplotlib, seaborn, plotly, interactive dashboards
- **SQL query generation** dengan AI, optimization, window functions
- **ETL pipeline**: extract, transform, load, validation
- **Batch processing**: chunking, memory optimization

#### Contoh Praktis
```python
# Data Cleaning Pipeline
1. Handle missing values:
   - Critical cols → dropna
   - Numeric → fill with median
   - Categorical → fill with mode

2. Remove duplicates:
   - Full duplicates → drop_duplicates()
   - Key-based → keep most complete record

3. Handle outliers:
   - IQR method → clip to bounds
   - Z-score method → replace with median

4. Standardize formats:
   - Dates → YYYY-MM-DD
   - Names → Title Case
   - NISN → 10 digits, zero-padded

# ETL Pipeline Class
class SchoolDataETL:
    extract() → Baca semua file sumber
    transform() → Clean, validate, aggregate
    load() → Simpan ke SQLite dengan indexes
    run() → Execute full pipeline dengan logging
```

#### Skill yang Didapat
- [x] Membaca dan memahami struktur data
- [x] Data cleaning lengkap
- [x] Data transformation (pivot, melt, merge)
- [x] Statistical analysis
- [x] Trend dan anomaly detection
- [x] Data visualization (matplotlib, seaborn, plotly)
- [x] SQL query generation dan optimization
- [x] ETL pipeline construction
- [x] Data validation dengan schema
- [x] Batch processing untuk dataset besar

---

### Modul 09: Otomatisasi Script (C4)

**File**: `09-otomatisasi-script.md` | **500+ baris**

#### Konsep Kunci
- **Shell scripting**: PowerShell (Windows), Bash (Linux)
- **Python automation**: file ops, web scraping, API integration
- **Web scraping**: ethical scraping, pagination, rate limiting
- **API integration**: REST, authentication, retry logic, pagination
- **Scheduled tasks**: cron, Task Scheduler, Python schedule
- **Error handling**: try/catch, retry, circuit breaker
- **Structured logging**: JSON format, log rotation
- **Monitoring**: system health, service checks, alerting
- **Backup**: incremental, verification, retention
- **Notification**: email, Telegram, Slack

#### Contoh Praktis
```python
# Error Handling Patterns
@retry(max_attempts=3, delay=2, backoff=2)
def fetch_data(url):
    """Fetch dengan auto-retry."""

# Circuit Breaker
class CircuitBreaker:
    """Prevent cascade failure."""
    state: closed → open → half-open

# Multi-channel Notification
class Notifier:
    send_email(to, subject, body, attachments)
    send_telegram(chat_id, message)
    send_slack(webhook_url, message)

# Daily Attendance Automation
class DailyAttendanceReport:
    generate_report() → Statistik kehadiran
    send_report() → Telegram + Email
```

#### Skill yang Didapat
- [x] PowerShell dan Bash scripting
- [x] Python file operations
- [x] Web scraping dengan requests + BeautifulSoup
- [x] API integration dengan authentication
- [x] Scheduled tasks (cron, Task Scheduler)
- [x] Error handling dan retry logic
- [x] Structured logging
- [x] System monitoring dan health checks
- [x] Backup scripts dengan verification
- [x] Multi-channel notifications
- [x] School automation scripts

---

## 🔗 Peta Pengetahuan Terhubung

```
                    ┌─────────────────────────────────────────────────┐
                    │           FASE 5: INTERCONNECTED MAP            │
                    └─────────────────────────────────────────────────┘

  PRODUKSI KONTEN (C0) ─────────────────────────────────────────┐
         │                                                       │
         ├──→ Generate laporan dari data (C2)                   │
         ├──→ Dokumentasi proyek (B3)                           │
         └──→ Newsletter dari monitoring (C4)                   │
                                                                   │
  FILE MANAGEMENT (C1) ─────────────────────────────────────────┤
         │                                                       │
         ├──→ Input untuk data processing (C2)                  │
         ├──→ Source untuk backup scripts (C4)                  │
         └──→ Arsip dokumentasi (B3)                            │
                                                                   │
  PENGOLAHAN DATA (C2) ─────────────────────────────────────────┤
         │                                                       │
         ├──→ Input untuk laporan konten (C0)                   │
         ├──→ Data untuk monitoring dashboard (C4)              │
         ├──→ Test data untuk CI/CD (B4)                        │
         └──→ Source untuk dokumentasi (B3)                     │
                                                                   │
  OTOMATISASI SCRIPT (C4) ──────────────────────────────────────┤
         │                                                       │
         ├──→ Automasi file management (C1)                     │
         ├──→ Automasi data processing (C2)                     │
         ├──→ CI/CD pipeline scripts (B4)                       │
         └──→ Agent execution scripts (B5)                      │
                                                                   │
  DEVELOPMENT DAILY (B1) ───────────────────────────────────────┤
         │                                                       │
         ├──→ Code yang di-refactor (B2)                        │
         ├──→ Code yang didokumentasi (B3)                      │
         ├──→ Code yang di-deploy (B4)                          │
         └──→ Code yang di-review agents (B5)                   │
                                                                   │
  REFACTORING & TESTING (B2) ───────────────────────────────────┤
         │                                                       │
         ├──→ Prerequisite untuk CI/CD (B4)                     │
         ├──→ Test coverage untuk agents (B5)                   │
         └──→ Clean code untuk dokumentasi (B3)                 │
                                                                   │
  DOKUMENTASI & GIT (B3) ───────────────────────────────────────┤
         │                                                       │
         ├──→ Agent documentation (B5)                          │
         ├──→ Pipeline documentation (B4)                       │
         └──→ Changelog dari commits (B1)                       │
                                                                   │
  CI/CD INTEGRATION (B4) ───────────────────────────────────────┤
         │                                                       │
         ├──→ Deploy hasil development (B1)                     │
         ├──→ Run test dari refactoring (B2)                    │
         ├──→ Trigger agents on PR (B5)                         │
         └──→ Deploy scripts automation (C4)                    │
                                                                   │
  CUSTOM DEV AGENTS (B5) ───────────────────────────────────────┘
         │
         ├──→ Code review untuk development (B1)
         ├──→ Test generation untuk refactoring (B2)
         ├──→ Doc generation untuk dokumentasi (B3)
         ├──→ Security scan untuk CI/CD (B4)
         └──→ Data validation untuk processing (C2)
```

### Hubungan Kritis Antar Modul

| Dari | Ke | Hubungan |
|------|-----|----------|
| C0 (Konten) | C2 (Data) | Data → Laporan → Konten |
| C1 (File) | C2 (Data) | File terorganisir → Data siap proses |
| C1 (File) | C4 (Script) | File → Target otomatisasi |
| C2 (Data) | C4 (Script) | Data processing → Script automation |
| B1 (Daily) | B2 (Refactor) | Code understanding → Refactoring target |
| B1 (Daily) | B3 (Docs) | Code yang dipahami → Didokumentasi |
| B1 (Daily) | B4 (CI/CD) | Code yang ditulis → Di-deploy |
| B2 (Refactor) | B4 (CI/CD) | Test dari refactor → Quality gate di CI |
| B3 (Docs) | B5 (Agents) | Doc patterns → Agent system prompts |
| B4 (CI/CD) | B5 (Agents) | CI pipeline → Trigger agents |
| C4 (Script) | B4 (CI/CD) | Automation scripts → CI/CD jobs |

---

## 🎯 Panduan Pemilihan Scenario Berdasarkan Role

### Role 1: Operator Sekolah / Administrasi

**Fokus**: Jalur C (Office & Data)

| Prioritas | Modul | Alasan |
|-----------|-------|--------|
| 1 | C1: File Management | Dasar organisasi dokumen sekolah |
| 2 | C2: Pengolahan Data | Analisis data siswa, BOS, kehadiran |
| 3 | C4: Otomatisasi Script | Automasi tugas harian |
| 4 | C0: Produksi Konten | Laporan, newsletter, surat |

**Scenario yang harus dikuasai**:
- Organisasi file ARKAS, Dapodik, surat-menyurat
- Processing data siswa: cleaning, analysis, reporting
- Script backup database Dapodik otomatis
- Generate laporan BOS bulanan otomatis
- Kirim notifikasi kehadiran via Telegram

**Scenario yang bisa dilewati**:
- B2 (Refactoring) — tidak perlu refactor kode
- B4 (CI/CD) — tidak deploy aplikasi
- B5 (Custom Agents) — tidak butuh dev agents

---

### Role 2: Web Developer / Programmer

**Fokus**: Jalur B (Programmer)

| Prioritas | Modul | Alasan |
|-----------|-------|--------|
| 1 | B1: Development Daily | Workflow harian fundamental |
| 2 | B2: Refactoring & Testing | Code quality dan safety |
| 3 | B3: Dokumentasi & Git | Professional documentation |
| 4 | B4: CI/CD Integration | Deployment automation |
| 5 | B5: Custom Dev Agents | AI-assisted development |

**Scenario yang harus dikuasai**:
- Plan → Build workflow untuk semua task
- Refactoring aman dengan test-first
- Conventional Commits dan PR description
- CI/CD pipeline dari scratch
- Custom agents untuk code review dan testing

**Scenario yang bisa dilewati**:
- C0 (Produksi Konten) — kecuali perlu buat konten
- C1 (File Management) — kecuali perlu automasi file

---

### Role 3: Full-Stack (Developer + Administrasi)

**Fokus**: Semua modul, prioritas B1 → C2 → B4

| Prioritas | Modul | Alasan |
|-----------|-------|--------|
| 1 | B1: Development Daily | Core workflow |
| 2 | C2: Pengolahan Data | Data skills untuk admin |
| 3 | B4: CI/CD Integration | Deployment |
| 4 | C4: Otomatisasi Script | Automasi tasks |
| 5 | B3: Dokumentasi & Git | Documentation |
| 6 | B2: Refactoring & Testing | Code quality |
| 7 | B5: Custom Dev Agents | Advanced AI |
| 8 | C0: Produksi Konten | Content creation |
| 9 | C1: File Management | File organization |

---

### Role 4: Data Analyst

**Fokus**: C2 → C4 → C0

| Prioritas | Modul | Alasan |
|-----------|-------|--------|
| 1 | C2: Pengolahan Data | Core data skills |
| 2 | C4: Otomatisasi Script | Automasi analisis |
| 3 | C0: Produksi Konten | Laporan dan visualisasi |
| 4 | C1: File Management | Data organization |

---

## 📝 Self-Assessment Quiz (25 Pertanyaan)

### Bagian A: Konsep Dasar (10 pertanyaan)

**1. Apa 3 tahap AI writing workflow?**
<details>
<summary>Jawaban</summary>
构思 (Planning/Plan mode) → Output (Building/Build mode) → Iterasi (Refining)
</details>

**2. Apa perbedaan Plan mode dan Build mode?**
<details>
<summary>Jawaban</summary>
Plan mode: untuk analisis, outline, planning — TIDAK membuat file. Build mode: untuk implementasi, generate file, eksekusi — MEMBUAT dan mengubah file.
</details>

**3. Apa arti `@file` syntax di OpenCode?**
<details>
<summary>Jawaban</summary>
Inject konten file ke konteks AI. Contoh: `@src/app.ts` akan membaca isi file app.ts dan memasukkannya ke prompt.
</details>

**4. Apa arti ``!`command`` syntax?**
<details>
<summary>Jawaban</summary>
Execute command di terminal dan inject output ke prompt. Contoh: ``!`date +%Y-%m-%d`` akan menjalankan command date dan hasilnya masuk ke konteks.
</details>

**5. Apa format Conventional Commits?**
<details>
<summary>Jawaban</summary>
`<type>(<scope>): <description>` — Contoh: `feat(absensi): menambahkan endpoint input kehadiran`
</details>

**6. Apa perbedaan refactoring dan rewriting?**
<details>
<summary>Jawaban</summary>
Refactoring: ubah struktur internal tanpa mengubah behavior, small steps, low risk. Rewriting: tulis ulang dari nol, big bang, high risk, behavior mungkin berubah.
</details>

**7. Apa prinsip backup 3-2-1?**
<details>
<summary>Jawaban</summary>
3 kopi data, 2 media berbeda, 1 offsite. Contoh: laptop (primary) + external HDD (secondary) + cloud (offsite).
</details>

**8. Apa itu Golden Master technique?**
<details>
<summary>Jawaban</summary>
Teknik testing untuk legacy code: capture current behavior sebagai baseline (expected value), lalu buat test yang assert output == captured value. Ini jadi safety net untuk refactoring.
</details>

**9. Apa urutan stage di pipeline CI/CD?**
<details>
<summary>Jawaban</summary>
Lint → Type Check → Test (Unit → Integration → E2E) → Build → Security Scan → Deploy (Staging → Production)
</details>

**10. Apa prinsip single responsibility untuk agent?**
<details>
<summary>Jawaban</summary>
Satu agent = satu tugas spesifik. Contoh: Code Reviewer HANYA review, tidak boleh edit kode. Security Auditor HANYA audit, tidak boleh deploy.
</details>

### Bagian B: Penerapan Praktis (10 pertanyaan)

**11. Bagaimana cara membersihkan data dengan missing values?**
<details>
<summary>Jawaban</summary>
1. Kolom kritis → dropna (hapus baris)
2. Kolom numerik → fill dengan median/mean
3. Kolom kategorikal → fill dengan mode
4. Time series → forward fill (ffill)
</details>

**12. Bagaimana cara handle outlier dengan IQR method?**
<details>
<summary>Jawaban</summary>
1. Hitung Q1 (25th percentile) dan Q3 (75th percentile)
2. IQR = Q3 - Q1
3. Lower bound = Q1 - 1.5 * IQR
4. Upper bound = Q3 + 1.5 * IQR
5. Clip nilai di luar bounds ke batas
</details>

**13. Bagaimana cara merge dua tabel dengan pandas?**
<details>
<summary>Jawaban</summary>
```python
# Inner join: hanya yang match
pd.merge(df1, df2, on='key', how='inner')
# Left join: semua df1 + match df2
pd.merge(df1, df2, on='key', how='left')
# Outer join: semua record
pd.merge(df1, df2, on='key', how='outer')
```
</details>

**14. Bagaimana cara setup retry logic di Python?**
<details>
<summary>Jawaban</summary>
```python
@retry(max_attempts=3, delay=2, backoff=2)
def fetch_data(url):
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()
    return resp.json()
```
Delay meningkat: 2s → 4s → 8s (exponential backoff)
</details>

**15. Bagaimana cara generate changelog dari git log?**
<details>
<summary>Jawaban</summary>
1. `git log --oneline v1.0.0..HEAD`
2. Kelompokkan berdasarkan type: feat → Added, fix → Fixed, refactor → Changed
3. Format Keep a Changelog
4. AI generate dari commit history
</details>

**16. Bagaimana cara setup GitHub Actions untuk Node.js?**
<details>
<summary>Jawaban</summary>
1. Buat `.github/workflows/ci.yml`
2. Trigger: push/PR ke main
3. Steps: checkout → setup-node → npm ci → npm test → npm run build
4. Tambah services (PostgreSQL, Redis) jika perlu
5. Upload artifacts (coverage, build)
</details>

**17. Bagaimana cara buat agent code reviewer?**
<details>
<summary>Jawaban</summary>
1. Buat file `~/.config/opencode/agent/code-reviewer.md`
2. Frontmatter: description, mode, model, temperature, permission
3. System prompt: role, checklist, severity levels, output format
4. Permission: edit=deny, bash=deny (read-only)
</details>

**18. Bagaimana cara scraping web yang etis?**
<details>
<summary>Jawaban</summary>
1. Cek robots.txt dulu
2. Set User-Agent yang jelas
3. Rate limiting (delay 2-5 detik antar request)
4. Handle pagination dengan loop
5. Respect server (jangan spam)
6. Cache hasil jika memungkinkan
</details>

**19. Bagaimana cara setup scheduled task di Windows?**
<details>
<summary>Jawaban</summary>
```powershell
schtasks /Create /TN "Backup_Harian" /TR "python scripts/backup.py" /SC DAILY /ST 02:00 /RL HIGHEST /F
```
Atau pakai Python `schedule` library untuk in-process scheduling.
</details>

**20. Bagaimana cara pilih chart yang tepat?**
<details>
<summary>Jawaban</summary>
- Tren waktu → Line chart
- Perbandingan kategori → Bar chart
- Distribusi → Histogram, Box plot
- Komposisi → Pie chart, Stacked bar
- Korelasi → Scatter plot
- Geografis → Map chart
</details>

### Bagian C: Scenario-Based (5 pertanyaan)

**21. Scenario: Kamu dapat data siswa dari Dapodik yang kotor. Langkah apa yang kamu lakukan?**
<details>
<summary>Jawaban</summary>
1. Profile data dulu: cek struktur, missing values, duplikat, tipe data
2. Clean missing values: drop baris tanpa NISN/nama, isi numerik dengan median
3. Hapus duplikat berdasarkan NISN (keep yang paling lengkap)
4. Standarisasi format: NISN 10 digit, nama Title Case, tanggal YYYY-MM-DD
5. Handle outlier: cek nilai di luar range 0-100
6. Validasi dengan schema: cek required columns, value ranges
7. Simpan hasil clean ke file baru
</details>

**22. Scenario: Kamu perlu buat laporan BOS bulanan otomatis. Bagaimana alurnya?**
<details>
<summary>Jawaban</summary>
1. Extract data realisasi dari database/Excel
2. Aggregate per kategori dan per bulan
3. Hitung persentase serapan per kategori
4. Generate tabel Markdown dengan statistik
5. Buat chart (bar chart per kategori, line chart trend)
6. Tulis executive summary dengan insight
7. Export ke PDF dan Excel
8. Kirim via email/Telegram ke kepala sekolah
9. Schedule script untuk jalan otomatis setiap bulan
</details>

**23. Scenario: Kamu refactor fungsi 200 baris jadi 4 fungsi kecil. Bagaimana caranya aman?**
<details>
<summary>Jawaban</summary>
1. Buat Golden Master test dulu (capture current behavior)
2. Extract fungsi 1 (validation) → run test → harus hijau
3. Commit: "refactor: extract validation logic"
4. Extract fungsi 2 (transformation) → run test → harus hijau
5. Commit: "refactor: extract transformation logic"
6. Extract fungsi 3 (persistence) → run test → harus hijau
7. Commit: "refactor: extract persistence logic"
8. Extract fungsi 4 (notification) → run test → harus hijau
9. Commit: "refactor: extract notification logic"
10. Final review: pastikan semua test masih passing
</details>

**24. Scenario: Deploy ke production gagal, health check tidak respond. Apa yang kamu lakukan?**
<details>
<summary>Jawaban</summary>
1. Automatic rollback trigger (jika sudah setup)
2. Cek log deployment untuk error message
3. Cek health endpoint manual: `curl https://app/health`
4. Cek database connectivity
5. Cek resource usage (CPU, memory, disk)
6. Jika rollback otomatis gagal, manual rollback: `./scripts/rollback.sh production`
7. Notify team via Slack/Telegram
8. Investigate root cause setelah sistem stabil
9. Fix issue di development
10. Deploy ulang setelah fix verified di staging
</details>

**25. Scenario: Kamu ingin setup multi-agent review pipeline untuk PR baru. Bagaimana caranya?**
<details>
<summary>Jawaban</summary>
1. Trigger: PR opened/updated
2. Phase 1 (parallel): @code-reviewer + @security-auditor + @performance-optimizer
3. Phase 2 (parallel): @test-writer + @doc-writer
4. Phase 3 (sequential): Consolidate semua report
5. Post consolidated comment di PR
6. Block merge jika ada critical issues
7. Auto-approve jika tidak ada issues
</details>

---

## ✅ Fase 6 Readiness Checklist

### Minimal Requirements (Harus Bisa)

- [ ] Bisa menggunakan Plan mode untuk planning dan Build mode untuk eksekusi
- [ ] Bisa membaca dan memahami codebase asing dengan `@explore` dan `@file`
- [ ] Bisa menulis Conventional Commits yang benar
- [ ] Bisa mengorganisir file dengan naming convention konsisten
- [ ] Bisa membersihkan data CSV/Excel (missing values, duplikat, format)
- [ ] Bisa membuat script Python sederhana untuk otomatisasi
- [ ] Bisa generate README dan API documentation dari kode
- [ ] Bisa memahami pipeline CI/CD dasar

### Intermediate Requirements (Sebaiknya Bisa)

- [ ] Bisa refactor kode dengan test-first approach
- [ ] Bisa setup GitHub Actions workflow
- [ ] Bisa membuat custom agent untuk code review
- [ ] Bisa melakukan web scraping dengan pagination
- [ ] Bisa integrasi REST API dengan retry logic
- [ ] Bisa membuat visualisasi data dengan matplotlib/seaborn
- [ ] Bisa setup scheduled tasks (cron/Task Scheduler)
- [ ] Bisa membuat backup script dengan verification

### Advanced Requirements (Nilai Plus)

- [ ] Bisa setup multi-agent pipeline
- [ ] Bisa implementasi CI/CD lengkap dengan security scanning
- [ ] Bisa membangun ETL pipeline untuk data processing
- [ ] Bisa membuat interactive dashboard dengan plotly
- [ ] Bisa setup monitoring dan alerting
- [ ] Bisa implementasi circuit breaker pattern
- [ ] Bisa melakukan database migration dengan rollback
- [ ] Bisa setup API versioning dan deprecation

### Score Assessment

| Score | Level | Status |
|-------|-------|--------|
| 0-6 | Pemula | Ulangi modul yang belum dipahami |
| 7-12 | Dasar | Siap lanjut ke Fase 6 dengan pendampingan |
| 13-18 | Menengah | Siap untuk Fase 6 |
| 19-24 | Mahir | Sangat siap untuk Fase 6 |
| 25 | Expert | Pertimbangkan untuk mentoring orang lain |

---

## 📖 Rekomendasi Bacaan Lanjutan

### Untuk Programmer (Jalur B)

| Topik | Sumber | Level |
|-------|--------|-------|
| Clean Code | "Clean Code" oleh Robert C. Martin | Intermediate |
| Refactoring | "Refactoring" oleh Martin Fowler | Intermediate |
| CI/CD | "Continuous Delivery" oleh Jez Humble | Advanced |
| Testing | "Test-Driven Development" oleh Kent Beck | Intermediate |
| Design Patterns | "Design Patterns" oleh Gang of Four | Advanced |
| System Design | "Designing Data-Intensive Applications" | Advanced |
| Git | "Pro Git" (gratis online) | Semua level |
| DevOps | "The Phoenix Project" (novel) | Intermediate |

### Untuk Office & Data (Jalur C)

| Topik | Sumber | Level |
|-------|--------|-------|
| Python Data | "Python for Data Analysis" oleh Wes McKinney | Pemula |
| pandas | Dokumentasi resmi pandas | Semua level |
| Data Visualization | "Storytelling with Data" oleh Cole Nussbaumer Knaflic | Intermediate |
| Excel Advanced | "Excel 2019 Bible" | Intermediate |
| SQL | "SQL in 10 Minutes" oleh Ben Forta | Pemula |
| Automation | "Automate the Boring Stuff with Python" | Pemula |
| Web Scraping | "Web Scraping with Python" oleh Ryan Mitchell | Intermediate |
| ETL | "Fundamentals of Data Engineering" | Advanced |

### Online Resources

| Platform | Konten | URL |
|----------|--------|-----|
| freeCodeCamp | Python, JavaScript, Data Science | freecodecamp.org |
| Kaggle | Data Science, Machine Learning | kaggle.com/learn |
| Real Python | Python tutorials | realpython.com |
| SQLBolt | Interactive SQL | sqlbolt.com |
| W3Schools | Web basics | w3schools.com |
| YouTube: Corey Schafer | Python tutorials | youtube.com/c/Coreyms |
| YouTube: Tech With Tim | Python, automation | youtube.com/c/TechWithTim |

---

## 🚀 5 Ide Proyek Praktis (Menggabungkan Multiple Skills)

### Proyek 1: Sistem Laporan Sekolah Otomatis

**Skills**: C0 (Konten) + C1 (File) + C2 (Data) + C4 (Script)

**Deskripsi**: Bangun sistem yang otomatis generate laporan sekolah bulanan dari data mentah.

**Alur**:
1. Script C4 menarik data dari database Dapodik dan ARKAS
2. Script C2 memproses dan membersihkan data
3. Script C0 generate laporan dalam format Markdown → PDF
4. Script C4 mengirim laporan via email/Telegram
5. Script C1 mengarsipkan laporan dengan naming convention

**Fitur**:
- Laporan kehadiran otomatis (harian/mingguan/bulanan)
- Laporan keuangan BOS dengan chart
- Laporan akademik (nilai, ranking, siswa bermasalah)
- Jadwal otomatis (cron/Task Scheduler)
- Notifikasi jika ada anomali

**Estimasi waktu**: 2-3 hari

---

### Proyek 2: Dashboard Monitoring Sekolah

**Skills**: C2 (Data) + C4 (Script) + B1 (Daily)

**Deskripsi**: Dashboard real-time untuk monitoring kondisi sekolah.

**Fitur**:
- Kehadiran siswa hari ini (real-time)
- Status keuangan BOS (anggaran vs realisasi)
- Alert: siswa tidak hadir 3+ hari berturut-turut
- Alert: pengeluaran melebihi anggaran
- Grafik tren kehadiran dan keuangan
- Export data ke Excel/PDF

**Tech stack**: Python + pandas + plotly + schedule

**Estimasi waktu**: 3-4 hari

---

### Proyek 3: CI/CD Pipeline untuk Aplikasi Sekolah

**Skills**: B1 (Daily) + B2 (Refactor) + B3 (Docs) + B4 (CI/CD) + B5 (Agents)

**Deskripsi**: Setup full CI/CD pipeline untuk aplikasi administrasi sekolah.

**Alur**:
1. Developer push code ke branch feature
2. CI pipeline: lint → typecheck → test → build → security scan
3. Auto-deploy ke staging
4. Custom agents: code review + security audit + test coverage check
5. Manual approval untuk production
6. Auto-generate changelog dan release notes

**Fitur**:
- GitHub Actions workflow lengkap
- Security scanning (SAST, dependency)
- Custom agents untuk review otomatis
- Automatic rollback on failure
- Slack/Telegram notification

**Estimasi waktu**: 4-5 hari

---

### Proyek 4: Data Pipeline ETL untuk Dapodik

**Skills**: C2 (Data) + C4 (Script) + B4 (CI/CD)

**Deskripsi**: ETL pipeline untuk sinkronisasi dan validasi data Dapodik.

**Alur**:
1. Extract: Download data dari Dapodik Web Service
2. Transform: Clean, validate, standardize format
3. Load: Simpan ke database lokal + generate report
4. Validate: Cek data integrity, flag anomalies
5. Schedule: Jalankan setiap hari jam 2 pagi

**Fitur**:
- Auto-download data Dapodik
- Data cleaning dan validation
- Schema validation dengan business rules
- Anomaly detection (data aneh/outlier)
- Logging dan error handling
- Notification jika ada masalah

**Estimasi waktu**: 3-4 hari

---

### Proyek 5: Custom Agent Suite untuk Development Tim

**Skills**: B1 (Daily) + B3 (Docs) + B5 (Agents)

**Deskripsi**: Suite custom agents untuk development tim sekolah.

**Agents**:
1. **Dapodik Checker**: Validasi data sebelum submit ke server pusat
2. **BOS Validator**: Cek realisasi BOS sesuai RKAS
3. **Surat Generator**: Generate surat dari template dengan data dinamis
4. **Report Reviewer**: Review laporan sebelum dikirim ke dinas
5. **Code Reviewer**: Review kode aplikasi sekolah

**Fitur**:
- System prompt khusus untuk konteks sekolah
- Permission: read-only untuk checker, edit untuk generator
- Multi-agent pipeline untuk review lengkap
- Performance monitoring dan cost tracking
- Versioning untuk update prompt

**Estimasi waktu**: 5-7 hari

---

## 💼 Aplikasi Karir: Menggunakan Skills Fase 5 di Pekerjaan

### Untuk Operator Sekolah

| Skill Fase 5 | Aplikasi Harian | Impact |
|--------------|-----------------|--------|
| File Management (C1) | Organisasi dokumen ARKAS, Dapodik, surat | Hemat 2-3 jam/minggu |
| Data Processing (C2) | Analisis data siswa, BOS, kehadiran | Laporan lebih akurat |
| Script Automation (C4) | Backup otomatis, laporan otomatis | Hemat 5-10 jam/minggu |
| Content Production (C0) | Newsletter, surat, pengumuman | Komunikasi lebih profesional |

**Contoh sehari-hari**:
```
07:30 - Script C4 otomatis cek email, download attachment, klasifikasi
08:00 - Script C2 process data kehadiran kemarin, generate report
08:30 - Report otomatis dikirim ke kepala sekolah via Telegram
09:00 - Operator fokus ke tugas yang butuh human judgment
15:00 - Script C4 otomatis backup database, verify integrity
15:30 - Log aktivitas harian di-generate otomatis
```

### Untuk Web Developer

| Skill Fase 5 | Aplikasi Harian | Impact |
|--------------|-----------------|--------|
| Development Daily (B1) | Workflow Plan → Build untuk semua task | 2x lebih produktif |
| Refactoring & Testing (B2) | Code quality, bug prevention | 50% lebih sedikit bug |
| Documentation & Git (B3) | Professional docs, clean commits | Onboarding 3x lebih cepat |
| CI/CD Integration (B4) | Auto-deploy, auto-test | Deploy 10x lebih sering |
| Custom Agents (B5) | AI-assisted review, testing | Review 5x lebih cepat |

**Contoh sehari-hari**:
```
08:00 - Plan mode: analyze task, break down into steps
08:30 - Build mode: implement step 1, test, commit
09:30 - Build mode: implement step 2, test, commit
10:30 - @code-reviewer agent: review semua perubahan
11:00 - Fix issues dari agent review
13:00 - Push → CI/CD pipeline auto-run
14:00 - Deploy ke staging, smoke test
15:00 - Dokumentasi perubahan, update changelog
```

### Untuk Data Analyst

| Skill Fase 5 | Aplikasi Harian | Impact |
|--------------|-----------------|--------|
| Data Processing (C2) | Cleaning, transformation, analysis | Analisis 3x lebih cepat |
| Script Automation (C4) | Automated reports, scheduled jobs | Laporan real-time |
| Content Production (C0) | Data storytelling, visual reports | Insight lebih actionable |
| File Management (C1) | Data organization, versioning | Data selalu terstruktur |

---

## 🎓 Penutup: Dari Fase 5 ke Fase 6

### Apa yang Sudah Kamu Kuasai

✅ **Workflow AI**: Plan → Build, prompt engineering, file management
✅ **Development**: Code understanding, feature development, bug fixing
✅ **Code Quality**: Refactoring, testing, SOLID principles
✅ **Documentation**: README, API docs, Conventional Commits, ADR
✅ **CI/CD**: Pipeline design, GitHub Actions, deployment, rollback
✅ **Agents**: Custom agents, multi-agent pipeline, monitoring
✅ **Data**: Cleaning, transformation, analysis, visualization
✅ **Automation**: Scripting, scheduling, monitoring, notifications

### Apa yang Akan Dipelajari di Fase 6

Fase 6 akan fokus pada **AI Engineering dan Fullstack Development**:
- AI Prompt Engineering (Basic → Advanced)
- AI Agentic Engineering (Basic → Professional)
- AI Fullstack JavaScript Apps Script
- Advanced automation dengan MCP servers
- Building AI-powered applications

### Langkah Selanjutnya

1. **Review modul yang belum dipahami** — Gunakan quiz untuk identifikasi gap
2. **Kerjakan minimal 1 proyek praktis** — Pilih dari 5 ide proyek di atas
3. **Dokumentasi learning journey** — Buat catatan apa yang sudah dipelajari
4. **Share knowledge** — Ajarkan ke rekan kerja atau teman
5. **Siapkan untuk Fase 6** — Pastikan semua checklist minimal requirements terpenuhi

---

> **Selamat! Kamu telah menyelesaikan Fase 5: Scenario Praktis.**
>
> Dari 10 modul ini, kamu sekarang punya toolkit lengkap untuk:
> - Mengelola proyek development secara profesional
> - Memproses dan menganalisis data dengan AI
> - Mengotomatisasi tugas-tugas repetitif
> - Membangun pipeline CI/CD yang robust
> - Mendesain custom agents untuk berbagai kebutuhan
>
> **Selanjutnya**: [Fase 6: AI Engineering](../fase-6-ai-engineering/)
