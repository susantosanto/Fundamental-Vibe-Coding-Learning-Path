# 03 — CLAUDE.md: Konteks Proyek

> **Estimasi:** 2 jam | **Level:** Pemula → Menengah
> **Sumber:** [`awattar/claude-code-best-practices`](https://github.com/awattar/claude-code-best-practices), [`feiskyer/claude-code-settings`](https://github.com/feiskyer/claude-code-settings)

---

## 📖 TEORI

### Apa itu CLAUDE.md?

**CLAUDE.md** adalah file markdown yang berfungsi sebagai "otak konteks" untuk Claude Code (dan AI coding assistant lainnya). File ini memberi tahu AI tentang:

- **Aturan coding** project — konvensi penamaan, style guide, pattern yang dipakai
- **Tech stack** — bahasa, framework, library, versi yang digunakan
- **Struktur folder** — organisasi direktori dan tanggung jawab masing-masing folder
- **Preferensi developer** — cara menjalankan, testing, linting, deployment
- **Batasan** — apa yang TIDAK boleh dilakukan AI

**Setiap kali Claude memproses prompt, dia otomatis membaca CLAUDE.md untuk memahami konteks proyek sebelum menjawab.** Ini seperti memberikan "briefing" singkat ke AI sebelum mulai bekerja.

### Mengapa CLAUDE.md Penting?

Tanpa CLAUDE.md, Claude Code harus:
1. Menebak struktur proyek dari file yang ada
2. Mengasumsikan konvensi coding yang mungkin salah
3. Menggunakan pattern generic yang tidak sesuai proyek Anda
4. Bertanya berulang kali tentang hal yang seharusnya sudah jelas

Dengan CLAUDE.md yang baik, Claude Code:
1. Langsung paham aturan main proyek
2. Menghasilkan kode yang konsisten dengan codebase existing
3. Menggunakan command yang benar untuk run, test, lint
4. Menghindari pattern yang sudah dideklarasikan sebagai "jangan lakukan ini"

---

## 📍 CLAUDE.md File Locations dan Priority

Claude Code membaca CLAUDE.md dari **beberapa lokasi** dengan **prioritas berbeda**. Memahami hierarki ini penting agar instruksi Anda tidak saling override.

### Hierarki Lokasi (dari prioritas tertinggi ke terendah)

| Prioritas | Lokasi | Scope | Contoh Penggunaan |
|-----------|--------|-------|-------------------|
| 1 (Tertinggi) | `.claude/CLAUDE.md` | Sub-proyek spesifik | Aturan khusus untuk folder `api/` atau `frontend/` |
| 2 | `CLAUDE.md` (project root) | Seluruh proyek | Aturan utama yang berlaku global |
| 3 | `~/.config/opencode/CLAUDE.md` | User-wide (semua proyek) | Preferensi personal yang selalu berlaku |
| 4 | `~/.claude/CLAUDE.md` | User-wide (alternatif) | Preferensi Claude Code spesifik |

### Cara Kerja Priority

Ketika ada **konflik instruksi** antara beberapa CLAUDE.md, Claude Code menggunakan **prioritas tertinggi**:

```
Proyek: /home/user/my-app/
├── CLAUDE.md              ← Prioritas 2: "Gunakan semicolons"
├── .claude/
│   └── CLAUDE.md          ← Prioritas 1: "JANGAN gunakan semicolons"
└── src/
    └── main.py

Hasil: Claude mengikuti .claude/CLAUDE.md (Prioritas 1) → Tanpa semicolons
```

### Kapan Menggunakan Setiap Lokasi?

**`CLAUDE.md` di project root** — Gunakan untuk 90% kasus. Ini adalah lokasi utama yang membaca aturan global proyek.

**`.claude/CLAUDE.md`** — Gunakan ketika proyek memiliki **sub-proyek dengan aturan berbeda**. Contoh:
- Monorepo dengan frontend (React) dan backend (FastAPI) yang punya aturan berbeda
- Folder `scripts/` yang menggunakan konvensi berbeda dari folder `src/`
- Folder `tests/` yang membutuhkan instruksi khusus

**`~/.config/opencode/CLAUDE.md`** — Gunakan untuk **preferensi personal** yang berlaku di SEMUA proyek:
- Bahasa komunikasi (Bahasa Indonesia)
- Format commit yang selalu dipakai
- Style preferences pribadi

### Contoh Multi-Lokasi yang Benar

**File: `~/.config/opencode/CLAUDE.md`** (User-wide)
```markdown
# Preferensi Personal
- Selalu gunakan Bahasa Indonesia untuk penjelasan
- Format commit: Conventional Commits
- Jangan gunakan emoji di kode
```

**File: `CLAUDE.md`** (Project root — FastAPI backend)
```markdown
# Backend API
- Python 3.12, FastAPI, PostgreSQL
- Type hints wajib
- Docstring Google style
```

**File: `.claude/CLAUDE.md`** (di dalam folder `frontend/`)
```markdown
# Frontend
- React 19, TypeScript, Tailwind CSS
- Functional components only
- No class components
```

---

## 🔍 CLAUDE.md Structure Deep Dive

CLAUDE.md yang baik memiliki **struktur terorganisir**. Berikut adalah deep dive untuk setiap section.

### 1. Header / Project Overview

Section pertama yang menjelaskan **identitas proyek** secara singkat.

```markdown
# Nama Proyek — Deskripsi Singkat

> Tech Stack: Python 3.12 | FastAPI | PostgreSQL | React 19
> Status: Development | Production
> Tim: 3 developer
```

**Mengapa penting:** Memberikan gambaran instan. Claude langsung tahu ini proyek apa, pakai teknologi apa, dan dalam tahap apa.

**Tips:**
- Buat deskripsi 1-2 kalimat yang jelas
- Sebutkan tech stack utama di baris pertama
- Tambahkan status proyek jika relevan

### 2. Tech Stack Detail

Jangan hanya sebutkan nama teknologi — sebutkan **versi** dan **peran** masing-masing.

```markdown
## Tech Stack

### Backend
- **Python 3.12** — Bahasa utama
- **FastAPI 0.115** — Web framework
- **SQLAlchemy 2.0** — ORM untuk database access
- **Alembic 1.13** — Database migration
- **Pydantic 2.9** — Data validation
- **Pytest 8.3** — Testing framework

### Frontend
- **React 19** — UI library
- **TypeScript 5.5** — Type-safe JavaScript
- **Tailwind CSS 3.4** — Utility-first CSS
- **Vite 5.4** — Build tool

### Infrastruktur
- **PostgreSQL 16** — Database utama
- **Redis 7.2** — Cache dan session
- **Docker 27** — Containerization
- **Nginx** — Reverse proxy
```

**Mengapa penting:** Versi spesifik mencegah Claude menyarankan syntax atau API yang sudah deprecated.

**Tips:**
- Selalu sertakan versi mayor.minor
- Kelompokkan by layer (backend, frontend, infra)
- Sebutkan peran setiap teknologi, bukan hanya nama

### 3. Struktur Folder

Jelaskan **organisasi direktori** dan **tanggung jawab** setiap folder.

```markdown
## Struktur Folder

```
my-app/
├── src/
│   ├── api/          → Endpoint definitions (routes)
│   ├── models/       → SQLAlchemy models
│   ├── schemas/      → Pydantic schemas (request/response)
│   ├── services/     → Business logic layer
│   ├── repositories/ → Data access layer
│   ├── utils/        → Helper functions
│   └── config.py     → Configuration management
├── tests/
│   ├── unit/         → Unit tests (isolated)
│   ├── integration/  → Integration tests (with DB)
│   └── conftest.py   → Shared test fixtures
├── migrations/       → Alembic migration files
├── docs/             → Project documentation
├── .env.example      → Environment variable template
├── docker-compose.yml
├── pyproject.toml    → Project dependencies
└── CLAUDE.md         → This file
```

### Aturan per Folder
- `src/api/` — Hanya definisi route, TIDAK boleh ada business logic
- `src/services/` — Business logic HARUS di sini, bukan di api/
- `src/repositories/` — Semua query database di sini
- `src/schemas/` — Pydantic models untuk validasi input/output
```

**Mengapa penting:** Claude jadi tahu di mana harus meletakkan file baru dan di mana harus mencari kode existing.

**Tips:**
- Gunakan arrow (`→`) untuk deskripsi singkat
- Tambahkan "aturan per folder" untuk batasan penting
- Sertakan file-file penting di root

### 4. Coding Conventions / Aturan

Ini adalah **section paling penting**. Di sini Anda mendefinisikan **cara menulis kode** yang diharapkan.

```markdown
## Coding Conventions

### Naming
- Function: `snake_case` (Python), `camelCase` (TypeScript)
- Class: `PascalCase`
- Constant: `UPPER_SNAKE_CASE`
- Private: prefix `_` (Python), prefix `#` (TypeScript)

### Style
- Line length: max 88 karakter (Black default)
- Quotes: double quotes (`"`) untuk string, single (`'`) untuk char
- Import: urutkan — standard library → third party → local
- Type hints: WAJIB di semua function signature dan return type

### Function Rules
- Max 30 baris per function
- Max 3 parameter (lebih dari itu gunakan dataclass/dict)
- Setiap function HARUS punya docstring
- Single Responsibility: 1 function = 1 tugas

### Error Handling
- Gunakan custom exception class, bukan bare `raise Exception`
- Logger, jangan print()
- Try-except spesifik, jangan bare except
- Return error response yang informatif (bukan stack trace ke user)

### Database
- Semua query melalui repository pattern
- TIDAK boleh raw SQL di service layer
- Migration HARUS melalui Alembic
- Soft delete dengan `is_active` boolean, bukan hard delete
```

**Mengapa penting:** Ini mencegah Claude menghasilkan kode yang tidak konsisten dengan style proyek Anda.

**Tips:**
- Buat aturan yang **spesifik dan terukur** (bukan "tulis kode yang bagus")
- Sertakan contoh jika aturan tidak obvious
- Prioritaskan aturan yang paling sering dilanggar

### 5. Commands / Development Workflow

Daftar **command yang digunakan** sehari-hari.

```markdown
## Commands

### Development
```bash
# Start development server
uvicorn src.main:app --reload --port 8000

# Run with hot reload
make dev

# Install dependencies
pip install -e ".[dev]"
```

### Testing
```bash
# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/unit/test_auth.py -v

# Run with coverage
pytest tests/ --cov=src --cov-report=html

# Run only failed tests
pytest --lf
```

### Linting & Formatting
```bash
# Format code
black src/ tests/

# Check formatting
black --check src/

# Lint
ruff check src/ tests/

# Type check
mypy src/
```

### Database
```bash
# Create migration
alembic revision --autogenerate -m "deskripsi perubahan"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Docker
```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f api

# Rebuild
docker compose up -d --build
```
```

**Mengapa penting:** Claude bisa langsung menjalankan command yang benar tanpa bertanya atau menebak.

**Tips:**
- Sertakan command untuk SEMUA aktivitas umum
- Berikan contoh dengan flag yang sering dipakai
- Kelompokkan by kategori (dev, test, lint, db, docker)

### 6. Don't / Batasan

Section ini mendefinisikan **apa yang TIDAK boleh dilakukan**.

```markdown
## Don't

- JANGAN commit file `.env` atau file yang berisi secrets
- JANGAN gunakan `print()` untuk logging — gunakan `logging` module
- JANGAN hardcode credentials, URL, atau konfigurasi
- JANGAN membuat migration manual — selalu gunakan `alembic revision --autogenerate`
- JANGAN bypass repository pattern untuk query database
- JANGAN gunakan `eval()` atau `exec()`
- JANGAN menambahkan dependency tanpa diskusi di issue
- JANGAN mengubah struktur tabel tanpa migration
- JANGAN commit file yang di-generate (build artifacts, .pyc, dll)
```

**Mengapa penting:** Mencegah Claude melakukan hal yang bisa merusak proyek atau melanggar security.

**Tips:**
- Tulis batasan yang spesifik ke proyek Anda
- Sertakan alasan jika tidak obvious ("JANGAN hardcode credentials — gunakan .env")
- Update seiring proyek berkembang

### 7. Git Workflow

```markdown
## Git Workflow

### Branch Strategy
- `main` — Production-ready code
- `develop` — Integration branch
- `feature/nama-fitur` — Fitur baru
- `bugfix/nama-bug` — Fix bug
- `hotfix/nama-fix` — Fix urgent di production

### Commit Message
Format: Conventional Commits
```
type(scope): description

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

Contoh:
- `feat(auth): add JWT token refresh endpoint`
- `fix(api): handle null user in profile endpoint`
- `docs(readme): update installation steps`

### Pull Request
- Minimal 1 reviewer sebelum merge
- Semua test harus pass
- Coverage tidak boleh turun
- Squash merge ke main
```

---

## 🚀 Advanced CLAUDE.md Patterns

### Pattern 1: Conditional Instructions

Gunakan **kondisional** untuk situasi yang berbeda:

```markdown
## Context-Specific Rules

### Jika menambahkan endpoint baru:
1. Buat route di `src/api/`
2. Buat schema request/response di `src/schemas/`
3. Buat business logic di `src/services/`
4. Buat data access di `src/repositories/`
5. Tambah test di `tests/integration/`
6. Update dokumentasi API

### Jika mengubah model database:
1. Edit model di `src/models/`
2. Generate migration: `alembic revision --autogenerate -m "..."`
3. Review migration file sebelum apply
4. Apply: `alembic upgrade head`
5. Update test yang affected

### Jika menambahkan dependency:
1. Cek apakah sudah ada alternatif di existing dependencies
2. Tambah ke `pyproject.toml`
3. Run `pip install -e ".[dev]"`
4. Update lock file
5. Dokumentasikan alasan penambahan di commit message
```

### Pattern 2: Role-Based Rules

Definisikan aturan berdasarkan **peran** yang dimainkan Claude:

```markdown
## Role-Based Behavior

### Saat bertindak sebagai Developer:
- Ikuti semua coding conventions di atas
- Tulis test untuk setiap fitur baru
- Pastikan semua test pass sebelum selesai

### Saat bertindak sebagai Reviewer:
- Cek apakah kode mengikuti conventions
- Identifikasi potential bugs atau edge cases
- Sarankan improvement tanpa mengubah kode langsung

### Saat bertindak sebagai Debugger:
- Reproduksi error terlebih dahulu
- Isolasi root cause sebelum fix
- Tambah test case untuk mencegah regression
```

### Pattern 3: Tech-Stack Specific Guidelines

```markdown
## FastAPI-Specific Guidelines

### Endpoint Structure
```python
@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """Get user by ID.

    Args:
        user_id: User ID to retrieve
        db: Database session
        current_user: Authenticated user

    Returns:
        UserResponse with user data

    Raises:
        NotFoundException: If user doesn't exist
        ForbiddenException: If user doesn't have permission
    """
    user = await user_repo.get_by_id(db, user_id)
    if not user:
        raise NotFoundException(f"User {user_id} not found")
    return UserResponse.model_validate(user)
```

### Rules:
- Setiap endpoint HARUS punya response_model
- Gunakan dependency injection untuk common tasks
- Async untuk semua I/O operations
- Validasi input dengan Pydantic, bukan manual if-check
```

### Pattern 4: Project-Specific Architecture Rules

```markdown
## Architecture Rules

### Layer Dependencies (Clean Architecture)
```
Presentation (api/) → Business (services/) → Data (repositories/) → Database
```

- Layer atas BOLEH depend ke layer bawah
- Layer bawah TIDAK BOLEH depend ke layer atas
- Models boleh di-import oleh semua layer
- Schemas hanya di-import oleh api/ layer

### Dependency Injection
- Gunakan FastAPI `Depends()` untuk semua service injection
- Jangan instantiate service langsung di endpoint
- Mock service di test dengan override `app.dependency_overrides`
```

---

## 📋 CLAUDE.md untuk Berbagai Jenis Proyek

### 1. Web Application (React + FastAPI)

```markdown
# SD Negeri Pasirhalang — Sistem Informasi Sekolah

> Fullstack web app untuk administrasi sekolah
> Backend: Python 3.12 | FastAPI | PostgreSQL
> Frontend: React 19 | TypeScript | Tailwind CSS

## Tech Stack

### Backend
- Python 3.12, FastAPI 0.115, SQLAlchemy 2.0
- PostgreSQL 16, Alembic 1.13, Pydantic 2.9
- JWT authentication, Redis cache

### Frontend
- React 19, TypeScript 5.5, Vite 5.4
- Tailwind CSS 3.4, React Router 6, React Query
- Axios untuk HTTP client

## Struktur Folder
```
sisfo-sekolah/
├── backend/
│   ├── src/api/          → FastAPI routers
│   ├── src/models/       → SQLAlchemy models
│   ├── src/schemas/      → Pydantic schemas
│   ├── src/services/     → Business logic
│   └── src/repositories/ → Database access
├── frontend/
│   ├── src/components/   → Reusable UI components
│   ├── src/pages/        → Page components
│   ├── src/hooks/        → Custom React hooks
│   ├── src/services/     → API client functions
│   └── src/types/        → TypeScript type definitions
└── docker-compose.yml
```

## Aturan
- Backend: type hints wajib, docstring Google style
- Frontend: functional components only, TypeScript strict mode
- API: RESTful, response envelope konsisten
- Database: soft delete, audit trail (created_at, updated_at)

## Commands
```bash
# Backend
cd backend && uvicorn src.main:app --reload

# Frontend
cd frontend && npm run dev

# Test backend
cd backend && pytest tests/ -v

# Test frontend
cd frontend && npm test

# Full stack
docker compose up -d
```

## Don't
- JANGAN commit .env atau secrets
- JANGAN bypass auth middleware
- JANGAN hardcode URL API di frontend (gunakan env var)
- JANGAN langsung query DB dari endpoint (harus via repository)
```

### 2. REST API (FastAPI)

```markdown
# API Gateway — School Management API

> RESTful API untuk manajemen data sekolah
> Python 3.12 | FastAPI | PostgreSQL | Redis

## Tech Stack
- Python 3.12, FastAPI 0.115
- SQLAlchemy 2.0 (async), Alembic 1.13
- PostgreSQL 16, Redis 7.2
- Pytest 8.3, Ruff, MyPy

## Struktur Folder
```
src/
├── api/v1/           → API version 1 endpoints
├── core/             → Config, security, exceptions
├── models/           → SQLAlchemy models
├── schemas/          → Pydantic schemas
├── services/         → Business logic
├── repositories/     → Data access
└── utils/            → Helpers
```

## Conventions
- Versioning di URL: `/api/v1/resource`
- Response envelope: `{"status": "success", "data": {...}, "message": "..."}`
- Pagination: `?page=1&limit=20` default
- Error format: `{"status": "error", "code": 404, "message": "..."}`
- Semua endpoint async
- Type hints di semua function

## Commands
```bash
# Dev server
uvicorn src.main:app --reload --port 8000

# Test
pytest tests/ -v --cov=src

# Lint
ruff check src/ && mypy src/

# Migration
alembic revision --autogenerate -m "desc"
alembic upgrade head
```

## Don't
- JANGAN sync I/O operations
- JANGAN return SQLAlchemy model langsung (harus via Pydantic)
- JANGAN N+1 query (gunakan `selectinload` atau `joinedload`)
- JANGAN commit tanpa test
```

### 3. Google Apps Script (Administrasi Sekolah)

```markdown
# Google Apps Script — Sistem Administrasi Sekolah SD

> Script untuk otomatisasi administrasi sekolah
> Google Sheets, Google Docs, Google Drive
> Bahasa: JavaScript (V8 runtime)

## Tech Stack
- Google Apps Script (V8 runtime / ES6+)
- Google Sheets API, Google Docs API
- Google Drive API, Gmail API
- HtmlService untuk web app

## Struktur File
```
apps-script/
├── Code.gs             → Entry point, routing
├── Config.gs           → Konstanta, ID spreadsheet
├── Utils.gs            → Helper functions
├── Services/
│   ├── DataService.gs  → CRUD ke Google Sheets
│   ├── EmailService.gs → Kirim email otomatis
│   └── DocService.gs   → Generate dokumen
├── Triggers.gs         → Time-driven dan event triggers
└── WebApp.gs           → HtmlService web app
```

## Conventions
- Naming: `camelCase` untuk function, `UPPER_CASE` untuk constant
- Setiap function HARUS punya JSDoc comment
- Error handling: `try-catch` dengan `Logger.log()`
- Jangan hardcode Spreadsheet ID — gunakan `Config.gs`
- Batch operations: gunakan `getValues()` bukan `getValue()` loop
- Rate limiting: `Utilities.sleep()` antar API call

## Pola Umum
```javascript
/**
 * Mengambil data peserta didik dari sheet
 * @param {string} sheetName - Nama sheet
 * @return {Array<Object>} Data peserta didik
 */
function getDataPesertaDidik(sheetName) {
  const ss = SpreadsheetApp.openById(Config.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}
```

## Don't
- JANGAN hardcode ID spreadsheet atau folder
- JANGAN loop `getValue()` — gunakan `getValues()` batch
- JANGAN lupa `Utilities.sleep()` untuk bulk operations
- JANGAN commit file dengan credentials
- JANGAN exceed quota (6 menit execution time limit)
```

### 4. Data Science Project

```markdown
# Analisis Data BOS — SD Negeri Pasirhalang

> Analisis dan visualisasi data Bantuan Operasional Sekolah
> Python 3.12 | Jupyter | Pandas | Matplotlib

## Tech Stack
- Python 3.12, Jupyter Notebook/Lab
- Pandas 2.2, NumPy 1.26
- Matplotlib 3.8, Seaborn 0.13
- Scikit-learn 1.5 (untuk prediksi)
- SQLite untuk data storage

## Struktur Folder
```
analisis-bos/
├── notebooks/          → Jupyter notebooks
│   ├── 01_explorasi.ipynb
│   ├── 02_pembersihan.ipynb
│   ├── 03_analisis.ipynb
│   └── 04_visualisasi.ipynb
├── data/
│   ├── raw/            → Data mentah (jangan edit)
│   ├── processed/      → Data yang sudah dibersihkan
│   └── output/         → Hasil analisis dan grafik
├── src/
│   ├── data_loader.py  → Load dan validate data
│   ├── cleaners.py     → Data cleaning functions
│   └── analyzers.py    → Analisis functions
├── requirements.txt
└── CLAUDE.md
```

## Conventions
- Notebook: 1 notebook = 1 tahap analisis
- Data raw TIDAK BOLEH diedit langsung
- Setiap notebook HARUS punya markdown explanation
- Grafik: simpan ke `data/output/` dengan nama deskriptif
- Function di `src/` HARUS punya docstring dan type hints
- Gunakan relative path, bukan absolute path

## Commands
```bash
# Start Jupyter
jupyter lab --notebook-dir=notebooks/

# Run notebook dari CLI
jupyter nbconvert --to notebook --execute notebooks/01_explorasi.ipynb

# Install dependencies
pip install -r requirements.txt
```

## Don't
- JANGAN commit data raw yang besar ke git
- JANGAN edit data di folder `raw/`
- JANGAN hardcode path — gunakan `pathlib`
- JANGAN skip data validation sebelum analisis
```

### 5. School Admin Database (SQLite + Python CLI)

```markdown
# Database Sekolah — SD Negeri Pasirhalang

> CLI tool untuk manajemen data sekolah offline
> Python 3.12 | SQLite | Click CLI

## Tech Stack
- Python 3.12, SQLite 3.45
- Click 8.1 (CLI framework)
- Rich 13.7 (terminal UI)
- SQLite3 built-in module

## Struktur Folder
```
db-sekolah/
├── src/
│   ├── cli.py          → Click CLI commands
│   ├── database.py     → DB connection dan migration
│   ├── models/         → Data models
│   │   ├── siswa.py
│   │   ├── guru.py
│   │   └── keuangan.py
│   └── commands/       → CLI subcommands
│       ├── siswa_cmd.py
│       ├── guru_cmd.py
│       └── laporan_cmd.py
├── data/
│   └── sekolah.db      → Database SQLite (gitignore)
├── migrations/         → SQL migration files
└── CLAUDE.md
```

## Conventions
- CLI: gunakan Click decorators (`@click.command()`, `@click.option()`)
- Database: semua query parameterized (no string concat)
- Output: gunakan Rich untuk tabel dan formatting
- Migration: SQL files di `migrations/`, run via `database.py`
- Error: tampilkan pesan user-friendly, bukan traceback

## Commands
```bash
# Install
pip install -e .

# Lihat data siswa
python -m src.cli siswa list

# Tambah guru
python -m src.cli guru add --nip "123456" --nama "Budi"

# Generate laporan
python -m src.cli laporan bulanan --tahun 2026 --bulan 1

# Init database
python -m src.cli db init

# Backup
python -m src.cli db backup
```

## Don't
- JANGAN commit file `.db` ke git
- JANGAN string concatenation untuk SQL query
- JANGAN hardcode path database
- JANGAN skip backup sebelum migration
```

---

## ⚠️ Common CLAUDE.md Mistakes dan Cara Fix

### Mistake 1: Terlalu Umum / Generic

**Buruk:**
```markdown
# My Project
- Write good code
- Use best practices
- Test everything
```

**Masalah:** Tidak ada informasi spesifik. Claude tetap harus menebak.

**Fix:**
```markdown
# My Project — FastAPI REST API
- Python 3.12, FastAPI 0.115, PostgreSQL 16
- Type hints wajib, docstring Google style
- Test dengan pytest, min coverage 80%
- Endpoint structure: api/ → services/ → repositories/
```

### Mistake 2: Terlalu Panjang / Overwhelming

**Buruk:** 500+ baris dengan setiap detail micro-managed.

**Masalah:** Claude mungkin ignore bagian penting karena terlalu banyak noise. Token limit.

**Fix:**
- Prioritaskan aturan yang PALING sering dilanggar
- Gunakan referensi ke file lain untuk detail (`.github/CONTRIBUTING.md`)
- Keep CLAUDE.md di bawah 200 baris untuk project kecil

### Mistake 3: Tidak Update Seiring Proyek Berkembang

**Masalah:** CLAUDE.md menyebutkan teknologi yang sudah tidak dipakai, atau tidak menyebutkan teknologi baru.

**Fix:**
- Review CLAUDE.md setiap kali ada perubahan tech stack
- Tambahkan section "Last Updated" dengan tanggal
- Gunakan `/custom-init` dari awattar/claude-code-best-practices untuk regenerate

### Mistake 4: Kontradiksi Antar Section

**Buruk:**
```markdown
## Style
- Gunakan single quotes

## Examples
print("Hello World")  # Double quotes
```

**Masalah:** Claude bingung mana yang diikuti.

**Fix:** Konsisten di seluruh file. Jika ada pengecualian, jelaskan.

### Mistake 5: Tidak Ada "Don't" Section

**Masalah:** Claude tidak tahu batasan proyek. Mungkin commit secrets, bypass auth, atau pattern yang dilarang.

**Fix:** Selalu sertakan section "Don't" dengan batasan spesifik proyek.

### Mistake 6: Command Tidak Lengkap

**Buruk:** Hanya ada `npm start` tanpa test, lint, atau build command.

**Fix:** Sertakan SEMUA command yang sering digunakan: dev, test, lint, build, deploy, db migration.

---

## 📊 CLAUDE.md vs AGENTS.md vs .cursorrules vs .windsurfrules

Perbandingan file konteks untuk berbagai AI coding assistant:

| Fitur | CLAUDE.md | AGENTS.md | .cursorrules | .windsurfrules |
|-------|-----------|-----------|--------------|----------------|
| **AI Tool** | Claude Code | OpenCode / Claude | Cursor IDE | Windsurf IDE |
| **Lokasi** | Project root | Project root / Home | Project root | Project root |
| **Format** | Markdown | Markdown | Text/Markdown | Text/Markdown |
| **Auto-load** | Ya | Ya | Ya | Ya |
| **Priority** | Root > .claude/ > Home | Home > Project | Project only | Project only |
| **Custom Commands** | `.claude/commands/` | Skills system | No | No |
| **Agents** | `.claude/agents/` | Agent config | No | No |
| **Scope** | Project context | Project + personal rules | Project context | Project context |

### Kapan Menggunakan Masing-Masing?

**CLAUDE.md** — Untuk Claude Code (CLI). Fokus pada konteks proyek: tech stack, struktur, commands, conventions.

**AGENTS.md** — Untuk OpenCode. Lebih luas — bisa mencakup preferensi personal, workflow, dan konfigurasi yang berlaku di SEMUA proyek.

**.cursorrules** — Untuk Cursor IDE. Mirip CLAUDE.md tapi format lebih bebas. Cursor auto-load saat membuka project.

**.windsurfrules** — Untuk Windsurf IDE. Sama seperti .cursorrules, auto-load di project root.

### Kompatibilitas

Jika Anda menggunakan **multiple AI tools**, Anda bisa membuat file yang sama untuk semuanya:

```bash
# Symlink ke file yang sama
ln -s CLAUDE.md .cursorrules
ln -s CLAUDE.md .windsurfrules
```

Atau gunakan konten yang berbeda jika setiap tool butuh instruksi spesifik.

---

## 💉 Dynamic Context Injection

Selain CLAUDE.md, ada cara lain untuk **memberikan konteks** ke Claude Code secara dinamis.

### 1. `@file` — Reference File Spesifik

```
Perbaiki bug di @src/api/auth.py — endpoint login tidak handle expired token
```

Claude akan membaca isi `src/api/auth.py` dan fokus pada konteks file tersebut.

### 2. `@folder` — Reference Seluruh Folder

```
Refactor struktur @src/services/ — terlalu banyak duplicasi code
```

Claude akan membaca semua file di folder `src/services/`.

### 3. Inline Context — Paste Konteks Langsung

```
Berikut adalah error log:
```
Traceback (most recent call last):
  File "src/main.py", line 42, in <module>
    ...
```

Fix error ini.
```

### 4. Multi-File Reference

```
Bandingkan implementasi auth di @backend/src/api/auth.py dan @frontend/src/services/auth.ts — pastikan konsisten
```

### 5. Context dari CLAUDE.md + File Specific

Claude Code **selalu** membaca CLAUDE.md terlebih dahulu, kemudian menambahkan konteks dari file/folder yang di-reference di prompt. Ini memberikan **layered context**:

```
Layer 1: CLAUDE.md (aturan global proyek)
Layer 2: @file (konteks file spesifik)
Layer 3: Prompt (instruksi spesifik task)
```

### Best Practices Context Injection

- Gunakan `@file` untuk task yang fokus pada 1-2 file
- Gunakan `@folder` untuk refactoring atau analisis arsitektur
- Jangan reference folder yang terlalu besar (bisa exceed context window)
- CLAUDE.md sudah otomatis — tidak perlu di-reference manual

---

## 📝 Template CLAUDE.md untuk Skenario Umum

### Template 1: FastAPI Project (Minimal)

```markdown
# [Nama Proyek] — FastAPI REST API

> Python 3.12 | FastAPI | PostgreSQL | SQLAlchemy

## Tech Stack
- Python 3.12, FastAPI [versi]
- SQLAlchemy [versi] (async), Alembic [versi]
- PostgreSQL [versi], Pydantic [versi]
- Pytest [versi], Ruff, MyPy

## Struktur
```
src/
├── api/          → Routes/endpoints
├── models/       → SQLAlchemy models
├── schemas/      → Pydantic schemas
├── services/     → Business logic
├── repositories/ → Data access
└── core/         → Config, security, exceptions
```

## Conventions
- Type hints wajib di semua function
- Async untuk semua I/O
- Docstring Google style
- Repository pattern untuk database access
- Response envelope: `{"status", "data", "message"}`

## Commands
```bash
# Dev
uvicorn src.main:app --reload

# Test
pytest tests/ -v --cov=src

# Lint
ruff check src/ && mypy src/

# Migration
alembic revision --autogenerate -m "desc" && alembic upgrade head
```

## Don't
- JANGAN commit .env atau secrets
- JANGAN sync I/O operations
- JANGAN return SQLAlchemy model langsung
- JANGAN bypass repository pattern
```

### Template 2: React Project (Minimal)

```markdown
# [Nama Proyek] — React Web App

> React 19 | TypeScript | Tailwind CSS | Vite

## Tech Stack
- React 19, TypeScript 5.5
- Vite 5.4, Tailwind CSS 3.4
- React Router 6, React Query
- Axios, ESLint, Prettier

## Struktur
```
src/
├── components/   → Reusable UI components
├── pages/        → Page/route components
├── hooks/        → Custom React hooks
├── services/     → API client functions
├── types/        → TypeScript type definitions
├── utils/        → Helper functions
└── context/      → React context providers
```

## Conventions
- Functional components only (no class)
- TypeScript strict mode
- Component: PascalCase, function/hook: camelCase
- Max 1 component per file
- Props interface di atas component
- Custom hooks prefix `use`

## Commands
```bash
# Dev
npm run dev

# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

## Don't
- JANGAN class components
- JANGAN any type di TypeScript
- JANGAN inline styles (gunakan Tailwind)
- JANGAN direct DOM manipulation
```

### Template 3: Google Apps Script (Minimal)

```markdown
# [Nama Proyek] — Google Apps Script

> Google Sheets | Google Docs | V8 Runtime

## Tech Stack
- Google Apps Script (V8 / ES6+)
- Google Sheets API, Google Docs API
- HtmlService (untuk web app)

## Struktur
```
Code.gs             → Entry point
Config.gs           → Konstanta, IDs
Utils.gs            → Helper functions
Services/           → Business logic modules
Triggers.gs         → Time/event triggers
```

## Conventions
- camelCase untuk function, UPPER_CASE untuk constant
- JSDoc comment untuk setiap function
- try-catch dengan Logger.log()
- Batch operations: getValues() bukan getValue() loop
- Utilities.sleep() untuk rate limiting

## Don't
- JANGAN hardcode Spreadsheet ID
- JANGAN loop getValue()
- JANGAN exceed 6 menit execution limit
- JANGAN commit credentials
```

### Template 4: School Database (Minimal)

```markdown
# [Nama Sekolah] — Database Management CLI

> Python 3.12 | SQLite | Click CLI

## Tech Stack
- Python 3.12, SQLite 3.45
- Click 8.1 (CLI), Rich 13.7 (terminal UI)

## Struktur
```
src/
├── cli.py          → CLI entry point
├── database.py     → DB connection
├── models/         → Data models
└── commands/       → CLI subcommands
data/
└── sekolah.db      → (gitignore)
```

## Conventions
- Click decorators untuk CLI commands
- Parameterized SQL queries (no string concat)
- Rich untuk tabel dan formatting
- SQL migration files di `migrations/`

## Commands
```bash
# Init
python -m src.cli db init

# List data
python -m src.cli siswa list

# Backup
python -m src.cli db backup
```

## Don't
- JANGAN commit .db file
- JANGAN string concat untuk SQL
- JANGAN skip backup sebelum migration
```

---

## 🔧 Troubleshooting: Apa yang Terjadi Ketika CLAUDE.md Salah?

### Gejala 1: Claude Menghasilkan Kode yang Tidak Konsisten

**Penyebab:** CLAUDE.md tidak memiliki coding conventions yang jelas.

**Solusi:** Tambahkan section "Coding Conventions" dengan aturan spesifik:
```markdown
## Coding Conventions
- Naming: snake_case (Python), camelCase (TypeScript)
- Type hints: WAJIB di semua function
- Max 30 baris per function
- Docstring: Google style
```

### Gejala 2: Claude Menggunakan Command yang Salah

**Penyebab:** CLAUDE.md tidak memiliki section "Commands" atau command tidak update.

**Solusi:** Tambahkan section "Commands" dengan semua command yang benar:
```markdown
## Commands
- Dev: `uvicorn src.main:app --reload`
- Test: `pytest tests/ -v`
- Lint: `ruff check src/`
```

### Gejala 3: Claude Commit File yang Seharusnya Tidak

**Penyebab:** Tidak ada section "Don't" yang melarang commit file tertentu.

**Solusi:** Tambahkan section "Don't":
```markdown
## Don't
- JANGAN commit .env, .db, atau file secrets
- JANGAN commit build artifacts
```

### Gejala 4: Claude Tidak Paham Struktur Proyek

**Penyebab:** CLAUDE.md tidak menjelaskan struktur folder.

**Solusi:** Tambahkan section "Struktur Folder" dengan tree dan deskripsi:
```markdown
## Struktur Folder
src/
├── api/          → Routes
├── models/       → Database models
├── services/     → Business logic
```

### Gejala 5: Claude Menggunakan Teknologi yang Sudah Deprecated

**Penyebab:** CLAUDE.md tidak menyebutkan versi teknologi.

**Solusi:** Selalu sertakan versi di tech stack:
```markdown
## Tech Stack
- Python 3.12 (bukan "Python")
- FastAPI 0.115 (bukan "FastAPI")
- SQLAlchemy 2.0 (bukan "SQLAlchemy")
```

### Gejala 6: CLAUDE.md Terlalu Panjang dan Claude Ignore Bagian Penting

**Penyebab:** File terlalu besar, melebihi context window atau membuat noise.

**Solusi:**
- Keep di bawah 200 baris untuk project kecil
- Pindahkan detail ke file terpisah (`.github/CONTRIBUTING.md`)
- Gunakan reference: "Lihat CONTRIBUTING.md untuk detail coding standards"

### Gejala 7: Claude Tidak Mengikuti Aturan yang Sudah Ditulis

**Penyebab:** Aturan terlalu ambigu atau tidak spesifik.

**Solusi:** Buat aturan yang **spesifik dan terukur**:

**Buruk:** "Tulis kode yang bagus"
**Baik:** "Max 30 baris per function, type hints wajib, docstring Google style"

**Buruk:** "Gunakan best practices"
**Baik:** "Repository pattern untuk database access, dependency injection via FastAPI Depends()"

---

## ✅ CHECKLIST

### Pemahaman Dasar
- [ ] Paham fungsi CLAUDE.md sebagai konteks proyek
- [ ] Tahu lokasi file CLAUDE.md dan hierarki prioritas
- [ ] Bisa membedakan CLAUDE.md vs AGENTS.md vs .cursorrules

### Membuat CLAUDE.md
- [ ] Bisa membuat CLAUDE.md untuk proyek sendiri
- [ ] Menyertakan tech stack dengan versi spesifik
- [ ] Menjelaskan struktur folder dengan deskripsi
- [ ] Mendefinisikan coding conventions yang spesifik
- [ ] Menyertakan commands untuk dev, test, lint
- [ ] Menambahkan section "Don't" dengan batasan

### Advanced
- [ ] Memahami conditional instructions pattern
- [ ] Bisa membuat role-based rules
- [ ] Tahu cara menggunakan @file dan @folder untuk context injection
- [ ] Bisa membuat CLAUDE.md untuk berbagai jenis proyek
- [ ] Tahu cara troubleshoot ketika CLAUDE.md tidak bekerja

### Best Practices
- [ ] Keep CLAUDE.md di bawah 200 baris (project kecil)
- [ ] Update CLAUDE.md setiap ada perubahan tech stack
- [ ] Gunakan versi spesifik untuk semua teknologi
- [ ] Buat aturan yang spesifik dan terukur
- [ ] Gunakan `/custom-init` untuk generate CLAUDE.md otomatis

---

## 📚 Referensi Tambahan

- [`awattar/claude-code-best-practices`](https://github.com/awattar/claude-code-best-practices) — Template dan custom commands
- [`anthropics/anthropic-cookbook`](https://github.com/anthropics/anthropic-cookbook) — Official cookbook
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code/overview) — Dokumentasi resmi

---

> **Lanjut ke:** [`04-skills-dasar.md`](./04-skills-dasar.md)
