# 06 — Spesialis AI Agents (Sub-Agents)

> **Estimasi:** 1.5 jam | **Level:** Menengah
> **Sumber:**
> - [`awattar/claude-code-best-practices — Agents`](https://github.com/awattar/claude-code-best-practices#-specialized-ai-agents)
> - [`feiskyer/claude-code-settings — Agents`](https://github.com/feiskyer/claude-code-settings#agents)
> - [`Anthropic Docs — Sub-agents`](https://docs.anthropic.com/en/docs/claude-code/sub-agents)

---

## 📖 TEORI

### Apa itu AI Agents / Sub-Agents?

**Sub-agents** (atau specialized AI agents) adalah AI specialist yang memiliki keahlian domain-specific. Mereka adalah instance Claude Code yang dikonfigurasi dengan instruksi khusus, permission tertentu, dan konteks yang terfokus pada satu area keahlian.

Bayangkan Anda punya tim developer virtual:
- Satu orang ahli arsitektur sistem
- Satu orang ahli backend
- Satu orang ahli frontend
- Satu orang QA engineer
- Satu orang technical writer

Setiap agent punya **system prompt** berbeda, **tool permission** berbeda, dan **cara kerja** berbeda — tapi mereka semua bekerja di codebase yang sama.

### Mengapa Menggunakan Sub-Agents?

1. **Konteks Terisolasi** — Setiap agent hanya melihat konteks yang relevan dengan tugasnya, mengurangi token usage dan meningkatkan akurasi.
2. **Expertise Terfokus** — Agent yang dikhususkan untuk QA akan menghasilkan test yang lebih baik daripada general-purpose AI.
3. **Parallel Execution** — Multiple agents bisa bekerja secara bersamaan pada task yang independen.
4. **Permission Control** — Anda bisa membatasi agent tertentu hanya bisa read, tidak bisa write file.
5. **Kualitas Output** — Hasil dari specialist selalu lebih baik daripada generalist untuk task yang sama.

### Arsitektur Sub-Agent

```
┌─────────────────────────────────────────────┐
│              Main Claude Code                │
│         (Koordinator / Dispatcher)           │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Explorer │  │ Builder  │  │ Reviewer │   │
│  │ Agent    │  │ Agent    │  │ Agent    │   │
│  └──────────┘  └──────────┘  └──────────┘   │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Planner  │  │ QA Agent │  │ Doc Agent│   │
│  │ Agent    │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘   │
│                                              │
└─────────────────────────────────────────────┘
```

Main Claude Code bertindak sebagai **dispatcher** yang:
1. Menganalisis task dari user
2. Memilih agent yang tepat
3. Memberikan konteks dan instruksi ke agent
4. Mengumpulkan hasil dari agent
5. Menyajikan output final ke user

---

## 🏗️ JENIS-JENIS AGENT

### A. Agent dari Repo Best Practices (awattar/claude-code-best-practices)

Repo ini menyediakan 9 specialized agents yang terintegrasi dengan custom commands:

#### 1. `general-purpose`
**Keahlian:** Multi-step analysis, file searching, task coordination
**Kapan Digunakan:** Task kompleks yang butuh koordinasi antar file, explorasi codebase, atau analisis yang memerlukan banyak langkah.

```yaml
# .claude/agents/general-purpose.md
name: general-purpose
description: Complex multi-step analysis, file searching, and task coordination
tools: Read, Grep, Glob, Bash, Edit, Write
model: sonnet
```

**Contoh Penggunaan:**
```
"Analisis struktur project ini dan jelaskan bagaimana data mengalir
dari database sampai ke frontend"
```

#### 2. `general-solution-architect`
**Keahlian:** Architecture analysis, tech stack decisions, scalability planning, distributed systems design
**Kapan Digunakan:** Saat mendesain sistem baru, memilih tech stack, atau merencanakan skalabilitas.

```yaml
# .claude/agents/general-solution-architect.md
name: general-solution-architect
description: Architecture analysis, technology stack decisions, scalability planning
tools: Read, Grep, Glob, Bash
model: opus
```

**Contoh Output:**
```markdown
## Rekomendasi Arsitektur: Sistem Absensi Sekolah

### Tech Stack
- Backend: Node.js + Express (REST API)
- Database: PostgreSQL (relational, ACID compliance)
- Frontend: React + TypeScript
- Deployment: Docker + Vercel

### Skalabilitas
- Horizontal scaling dengan load balancer
- Database connection pooling (max 20 connections)
- Caching layer dengan Redis untuk data yang sering diakses

### Trade-off
- PostgreSQL vs MongoDB: PostgreSQL dipilih karena data absensi
  bersifat relational dan butuh konsistensi tinggi
- REST vs GraphQL: REST dipilih karena lebih sederhana untuk
  tim yang belum familiar dengan GraphQL
```

#### 3. `general-fullstack-developer`
**Keahlian:** End-to-end feature implementation, database + API + frontend integration
**Kapan Digunakan:** Saat membangun fitur baru dari awal sampai selesai.

```yaml
name: general-fullstack-developer
description: End-to-end feature implementation spanning database, API, and frontend
tools: Read, Grep, Glob, Bash, Edit, Write
model: sonnet
```

**Workflow:**
```
User: "Buat fitur CRUD untuk data siswa"
         ↓
Fullstack Agent:
1. Buat model/database schema
2. Buat API endpoints (POST, GET, PUT, DELETE)
3. Buat frontend pages (list, form, detail)
4. Integrasi frontend dengan API
5. Tambah basic validation
         ↓
Output: Fitur lengkap siap testing
```

#### 4. `general-backend-developer`
**Keahlian:** API development, database design, server-side logic, performance optimization
**Kapan Digunakan:** Saat fokus pada backend saja — API, database query, business logic.

```yaml
name: general-backend-developer
description: API development, database design, server-side logic
tools: Read, Grep, Glob, Bash, Edit, Write
model: sonnet
```

**Contoh Task:**
```
"Buat endpoint REST API untuk:
- POST /api/absensi — input kehadiran siswa
- GET /api/absensi/:tanggal — ambil data absensi per tanggal
- PUT /api/absensi/:id — edit data absensi
- DELETE /api/absensi/:id — hapus data absensi

Validasi:
- NISN harus valid (10 digit angka)
- Tanggal tidak boleh di masa depan
- Status harus salah satu: hadir, sakit, izin, alpha"
```

#### 5. `general-frontend-developer`
**Keahlian:** UI/UX implementation, component patterns, browser automation, modern JS frameworks
**Kapan Digunakan:** Saat fokus pada frontend — komponen UI, styling, interaktivitas.

```yaml
name: general-frontend-developer
description: UI/UX implementation, component patterns, browser automation
tools: Read, Grep, Glob, Bash, Edit, Write
model: sonnet
```

**Contoh Task:**
```
"Buat komponen React untuk tabel data siswa dengan fitur:
- Sorting per kolom
- Pagination (10, 25, 50 per halaman)
- Search/filter
- Export ke CSV
- Responsive design"
```

#### 6. `general-qa`
**Keahlian:** Testing strategies, test automation, comprehensive validation, QA methodologies
**Kapan Digunakan:** Saat menulis test, debugging test failures, atau meningkatkan test coverage.

```yaml
name: general-qa
description: Testing strategies, test automation, comprehensive validation
tools: Read, Grep, Glob, Bash, Edit, Write
model: sonnet
```

**Contoh Workflow QA:**
```bash
# QA Agent akan:
# 1. Deteksi test framework yang digunakan
# 2. Jalankan existing tests
# 3. Analisis coverage
# 4. Generate missing tests
# 5. Fix failing tests

/test "Tambahkan test untuk endpoint absensi"

# Output QA Agent:
# ✅ 15 tests passed
# ❌ 2 tests failed (fixed automatically)
# 📊 Coverage: 87% (target: 80%)
# 📝 8 new tests generated untuk edge cases
```

#### 7. `general-code-quality-debugger`
**Keahlian:** Code review, systematic debugging, refactoring guidance, technical debt reduction
**Kapan Digunakan:** Saat debug bug, review kode, atau refactor codebase.

```yaml
name: general-code-quality-debugger
description: Code review, systematic debugging, refactoring guidance
tools: Read, Grep, Glob, Bash, Edit, Write
model: sonnet
```

**Debugging Workflow:**
```
User: "Endpoint /api/absensi return 500 error"
         ↓
Debugger Agent:
1. Baca error log
2. Trace stack trace
3. Identifikasi root cause
4. Fix bug dengan minimal perubahan
5. Verifikasi fix dengan test
         ↓
Output: Bug fixed + penjelasan root cause
```

#### 8. `general-technical-writer`
**Keahlian:** Documentation creation, API documentation, formatting, technical content organization
**Kapan Digunakan:** Saat membuat dokumentasi, README, API docs, atau technical guides.

```yaml
name: general-technical-writer
description: Documentation creation, API documentation, technical content
tools: Read, Grep, Glob, Edit, Write
model: sonnet
```

**Contoh Output Dokumentasi:**
```markdown
# API Dokumentasi — Sistem Absensi

## Endpoint: POST /api/absensi

### Request
```json
{
  "nisn": "1234567890",
  "tanggal": "2026-04-16",
  "status": "hadir",
  "waktu": "07:30:00"
}
```

### Response
- `201 Created` — Absensi berhasil dicatat
- `400 Bad Request` — Validasi gagal
- `409 Conflict` — Absensi sudah ada untuk tanggal ini
- `500 Internal Server Error` — Server error

### Error Codes
| Code | Message | Solution |
|------|---------|----------|
| 4001 | NISN tidak valid | Pastikan NISN 10 digit angka |
| 4002 | Tanggal di masa depan | Gunakan tanggal hari ini atau sebelumnya |
```

#### 9. `general-technical-project-lead`
**Keahlian:** Security assessments, strategic technical decisions, performance optimization, architectural leadership
**Kapan Digunakan:** Saat keputusan teknis besar, security review, atau optimasi performa.

```yaml
name: general-technical-project-lead
description: Security assessments, strategic technical decisions, performance optimization
tools: Read, Grep, Glob, Bash
model: opus
```

**Contoh Analisis Security:**
```markdown
## Security Assessment — Sistem Absensi

### 🔴 High Risk
1. **SQL Injection** — Input NISN tidak di-sanitize
   - Fix: Gunakan parameterized queries
   - File: src/controllers/absensi.js:45

2. **Missing Authentication** — Endpoint absensi tidak butuh login
   - Fix: Tambah middleware auth
   - File: src/routes/absensi.js:12

### 🟡 Medium Risk
1. **Rate Limiting** — Tidak ada rate limit pada API
   - Fix: Implementasi rate limiter (max 100 req/menit)

2. **CORS** — Wildcard CORS policy
   - Fix: Restrict ke domain yang diizinkan

### 🟢 Low Risk
1. **Error Messages** — Error message terlalu detail
   - Fix: Generic error message untuk production
```

---

### B. Agent dari feiskyer/claude-code-settings

Repo ini menyediakan agents tambahan dengan fokus yang berbeda:

| Agent | Keahlian | Use Case |
|-------|----------|----------|
| **pr-reviewer** | Expert code reviewer untuk GitHub PRs | Review pull requests secara otomatis |
| **github-issue-fixer** | GitHub issue resolution | Fix issues end-to-end dari analisis sampai PR |
| **instruction-reflector** | Analisis dan improvement instruksi | Improve CLAUDE.md berdasarkan session |
| **deep-reflector** | Comprehensive session analysis | Deep analysis patterns dan learnings |
| **insight-documenter** | Technical breakthrough documentation | Dokumentasi insight teknis |
| **ui-engineer** | UI/UX development specialist | Spesialis frontend dan design |
| **command-creator** | Custom command creator | Buat slash commands baru |

---

## 🔧 KONFIGURASI AGENT

### Struktur File Agent

Setiap agent didefinisikan dalam file `.claude/agents/<nama-agent>.md` dengan format:

```markdown
---
name: nama-agent
description: Deskripsi singkat kemampuan agent
tools: Read, Grep, Glob, Bash, Edit, Write
model: sonnet
---

# Instruksi untuk Agent

Kamu adalah specialist dalam [domain]. Tugas kamu adalah [goal].

## Rules
1. Rule pertama
2. Rule kedua
3. Rule ketiga

## Workflow
1. Step pertama
2. Step kedua
3. Step ketiga

## Output Format
Format output yang diharapkan...
```

### Konfigurasi Tools Permission

Agent bisa dibatasi tools yang bisa digunakan:

```yaml
# Hanya read-only — cocok untuk reviewer/analyst
tools: Read, Grep, Glob

# Read + write — cocok untuk builder/developer
tools: Read, Grep, Glob, Bash, Edit, Write

# Full access — hanya untuk trusted agents
tools: Read, Grep, Glob, Bash, Edit, Write, WebFetch, WebSearch
```

### Konfigurasi Model

```yaml
# sonnet — default, cepat dan cukup akurat untuk kebanyakan task
model: sonnet

# opus — lebih akurat, lebih lambat, lebih mahal — untuk task kompleks
model: opus

# haiku — paling cepat, paling murah — untuk task sederhana
model: haiku
```

**Panduan Pemilihan Model:**

| Model | Kecepatan | Akurasi | Biaya | Use Case |
|-------|-----------|---------|-------|----------|
| haiku | ⚡⚡⚡ | ★★★ | 💰 | Task sederhana, parsing, formatting |
| sonnet | ⚡⚡ | ★★★★ | 💰💰 | Task standar, coding, debugging |
| opus | ⚡ | ★★★★★ | 💰💰💰 | Task kompleks, arsitektur, security |

---

## 🔄 CARA MENGGUNAKAN AGENT

### A. Melalui Custom Commands

Custom commands di `awattar/claude-code-best-practices` otomatis memanggil agents yang relevan:

```bash
# /issue — memanggil multiple agents untuk fix issue
/issue "Halaman login error 500 saat submit"

# Agent yang dipanggil otomatis:
# 1. general-code-quality-debugger → analisis error
# 2. general-backend-developer → fix backend issue
# 3. general-frontend-developer → fix frontend issue
# 4. general-qa → verifikasi dengan test
# 5. general-technical-writer → update dokumentasi

# /commit — memanggil code quality agent untuk review
/commit

# Agent yang dipanggil:
# 1. general-code-quality-debugger → review diff
# 2. Generate conventional commit message

# /reviewpr — memanggil PR reviewer agent
/reviewpr

# Agent yang dipanggil:
# 1. pr-reviewer → comprehensive code review
# 2. general-qa → check test coverage
# 3. general-code-quality-debugger → security check
```

### B. Melalui Slash Command Langsung

```bash
# Panggil agent secara eksplisit
/agent general-solution-architect "Desain arsitektur untuk sistem absensi"

# Atau gunakan deskripsi natural language
"Buatkan arsitektur sistem" → otomatis panggil solution-architect
"Fix bug di endpoint login" → otomatis panggil code-quality-debugger
"Tulis dokumentasi API" → otomatis panggil technical-writer
```

### C. Parallel Agent Execution

Untuk task yang independen, multiple agents bisa jalan bersamaan:

```bash
# Task: Build fitur CRUD absensi
# Agent yang bisa parallel:

┌─────────────────────┐  ┌─────────────────────┐
│ Backend Agent       │  │ Frontend Agent      │
│ - Buat API          │  │ - Buat UI           │
│ - Buat database     │  │ - Buat komponen     │
│ - Buat validation   │  │ - Buat styling      │
└─────────────────────┘  └─────────────────────┘
         ↓                        ↓
┌─────────────────────────────────────────────┐
│            QA Agent                         │
│ - Test API endpoints                        │
│ - Test UI components                        │
│ - Integration test                          │
└─────────────────────────────────────────────┘
```

**Contoh perintah parallel:**
```
"Buat fitur CRUD absensi. Backend dan frontend bisa dikerjakan
secara terpisah. Setelah keduanya selesai, lakukan integration
testing."

Claude akan:
1. Spawn backend agent untuk API
2. Spawn frontend agent untuk UI (parallel)
3. Setelah keduanya selesai, spawn QA agent untuk integration test
```

---

## 📋 KAPAN MENGGUNAKAN AGENT YANG MANA

### Decision Matrix

```
Task dari User
     │
     ├── "Desain/arsitektur/tech stack"
     │    └──→ general-solution-architect
     │
     ├── "Buat fitur baru dari nol"
     │    └──→ general-fullstack-developer
     │         └──→ delegate ke backend + frontend agent
     │
     ├── "Buat API/endpoint/database"
     │    └──→ general-backend-developer
     │
     ├── "Buat UI/komponen/styling"
     │    └──→ general-frontend-developer
     │
     ├── "Buat test/fix test/coverage"
     │    └──→ general-qa
     │
     ├── "Debug bug/review kode/refactor"
     │    └──→ general-code-quality-debugger
     │
     ├── "Buat dokumentasi/README"
     │    └──→ general-technical-writer
     │
     ├── "Security review/performance/keputusan besar"
     │    └──→ general-technical-project-lead
     │
     └── "Explorasi codebase/cari file/pahami struktur"
          └──→ general-purpose
```

### Contoh Skenario Nyata

#### Skenario 1: Bug di Sistem Absensi

```
User: "Siswa yang absen jam 7:30 tidak tercatat, tapi yang jam 8:00 tercatat"

Dispatcher analysis:
- Ini bug → panggil general-code-quality-debugger
- Mungkin perlu fix backend → panggil general-backend-developer
- Perlu test untuk prevent regression → panggil general-qa

Workflow:
1. Debugger: Trace logic absensi, temukan bug di validasi waktu
2. Backend Dev: Fix validasi waktu di controller
3. QA: Buat test case untuk edge case waktu (7:00, 7:30, 7:59, 8:00)
```

#### Skenario 2: Fitur Baru — Laporan Kehadiran Bulanan

```
User: "Buat fitur laporan kehadiran bulanan dengan export PDF"

Dispatcher analysis:
- Fitur baru kompleks → panggil general-fullstack-developer
- Atau delegate ke specialist:

Workflow:
1. Architect: Desain arsitektur laporan (query, format, export)
2. Backend Dev: Buat endpoint + query aggregation data
3. Frontend Dev: Buat halaman laporan + filter tanggal
4. QA: Test query performance + accuracy data
5. Technical Writer: Dokumentasi fitur laporan
```

#### Skenario 3: Administrasi Sekolah — Data Dapodik

```
User: "Buat script untuk validasi data Dapodik sebelum upload"

Dispatcher analysis:
- Ini butuh pemahaman aturan validasi Dapodik
- Backend-heavy task

Workflow:
1. Backend Dev: Buat validation rules engine
   - Cek NISN format (10 digit)
   - Cek NIK format (16 digit)
   - Cek tanggal lahir valid
   - Cek referensi orang tua
2. QA: Buat test cases untuk semua validation rules
3. Technical Writer: Dokumentasi rules yang divalidasi
```

---

## 🏫 REAL-WORLD AGENT WORKFLOWS UNTUK TUGAS ADMINISTRASI SEKOLAH

### Workflow 1: Generate Laporan BOS

```
User: "Buatkan laporan realisasi BOS semester 1 dengan format Excel"

Agent Workflow:
┌──────────────────────────────────────────────────┐
│ 1. general-purpose                               │
│    - Baca struktur database ARKAS                │
│    - Identifikasi tabel yang dibutuhkan          │
│    - Pahami format laporan yang ada              │
├──────────────────────────────────────────────────┤
│ 2. general-backend-developer                     │
│    - Query data realisasi dari database          │
│    - Hitung persentase per kategori              │
│    - Generate data dalam format terstruktur      │
├──────────────────────────────────────────────────┤
│ 3. general-fullstack-developer                   │
│    - Buat script export ke Excel                 │
│    - Format cells (header, border, number format)│
│    - Tambah summary dan chart                    │
├──────────────────────────────────────────────────┤
│ 4. general-qa                                    │
│    - Validasi angka di laporan vs database       │
│    - Cek formula Excel benar                     │
│    - Test edge case (data kosong, null)          │
├──────────────────────────────────────────────────┤
│ 5. general-technical-writer                      │
│    - Buat README cara generate laporan           │
│    - Dokumentasi format laporan                  │
└──────────────────────────────────────────────────┘
```

### Workflow 2: Surat Menyurat Otomatis

```
User: "Buat template surat keterangan siswa yang bisa auto-fill dari data Dapodik"

Agent Workflow:
┌──────────────────────────────────────────────────┐
│ 1. general-backend-developer                     │
│    - Buat fungsi fetch data siswa dari Dapodik   │
│    - Mapping field ke template variabel          │
│    - Handle error jika data tidak ditemukan      │
├──────────────────────────────────────────────────┤
│ 2. general-frontend-developer                    │
│    - Buat form input: pilih siswa, jenis surat   │
│    - Preview surat sebelum generate              │
│    - Tombol download PDF                         │
├──────────────────────────────────────────────────┤
│ 3. general-technical-writer                      │
│    - Dokumentasi jenis-jenis surat yang tersedia │
│    - Template surat standar                      │
└──────────────────────────────────────────────────┘
```

### Workflow 3: Inventaris Sarpras

```
User: "Buat sistem inventaris sarpras dengan kondisi barang dan foto"

Agent Workflow:
┌──────────────────────────────────────────────────┐
│ 1. general-solution-architect                    │
│    - Desain database schema                      │
│    - Pilih tech stack (storage foto, dll)        │
│    - Rencana skalabilitas                        │
├──────────────────────────────────────────────────┤
│ 2. general-backend-developer                     │
│    - CRUD API untuk inventaris                   │
│    - Upload dan storage foto                     │
│    - Reporting dan statistik                     │
├──────────────────────────────────────────────────┤
│ 3. general-frontend-developer                    │
│    - Dashboard inventaris                        │
│    - Form input dengan foto upload               │
│    - Filter dan search                           │
│    - Gallery foto per barang                     │
├──────────────────────────────────────────────────┤
│ 4. general-qa                                    │
│    - Test upload foto (size, format)             │
│    - Test CRUD operations                        │
│    - Test reporting accuracy                     │
├──────────────────────────────────────────────────┤
│ 5. general-technical-project-lead                │
│    - Security review (akses foto, data)          │
│    - Performance review (query besar)            │
└──────────────────────────────────────────────────┘
```

---

## ⚠️ LIMITASI DAN BEST PRACTICES

### Limitasi Sub-Agents

1. **Token Budget** — Setiap agent menggunakan token terpisah. Banyak agent = banyak token.
2. **Konteks Terbatas** — Agent tidak melihat konteks full session, hanya task yang diberikan.
3. **Tidak Bisa Komunikasi Langsung** — Agent tidak bisa langsung berkomunikasi satu sama lain. Semua melalui dispatcher.
4. **Model Terbatas** — Agent只能用 model yang dikonfigurasi, tidak bisa switch model on-the-fly.
5. **File Locking** — Jika multiple agent edit file yang sama, bisa terjadi conflict.

### Best Practices

```markdown
## ✅ DO
1. Berikan instruksi yang jelas dan spesifik ke setiap agent
2. Gunakan model yang sesuai (sonnet untuk coding, opus untuk arsitektur)
3. Batasi tool permission sesuai kebutuhan agent
4. Review output agent sebelum commit
5. Gunakan parallel agents hanya untuk task yang benar-benar independen

## ❌ DON'T
1. Jangan spawn agent untuk task yang bisa diselesaikan main Claude
2. Jangan berikan full access ke agent yang tidak perlu
3. Jangan gunakan opus untuk task sederhana (boros token)
4. Jangan biarkan agent edit file yang sama secara bersamaan
5. Jangan skip review output agent — AI bisa buat kesalahan
```

### Tips Optimasi Token

```yaml
# Gunakan haiku untuk task sederhana
- Parsing JSON
- Format text
- Rename variabel
- Simple search

# Gunakan sonnet untuk task standar
- Coding features
- Debugging bugs
- Writing tests
- Refactoring code

# Gunakan opus untuk task kompleks
- Architecture design
- Security review
- Complex debugging
- Strategic decisions
```

---

## 📝 CONTOH KONFIGURASI LENGKAP

### File: `.claude/agents/school-admin-qa.md`

```markdown
---
name: school-admin-qa
description: QA specialist untuk aplikasi administrasi sekolah
tools: Read, Grep, Glob, Bash, Edit, Write
model: sonnet
---

# School Admin QA Specialist

Kamu adalah QA engineer yang spesialis dalam aplikasi administrasi sekolah.

## Domain Knowledge
- Data Dapodik (PD, GTK, Sarpras, Rombel)
- Keuangan BOS (RKAS, realisasi, LPJ)
- Surat-menyurat sekolah
- Inventaris sarpras

## Testing Standards
1. Selalu test validasi input (format, range, required fields)
2. Test edge cases (data kosong, null, special characters)
3. Test integration antar modul
4. Test performance untuk query data besar

## Workflow
1. Baca kode yang akan di-test
2. Identifikasi test cases yang diperlukan
3. Tulis test dengan framework yang sudah ada
4. Jalankan test dan fix failures
5. Laporkan coverage dan hasil

## Output Format
Selalu laporkan:
- Jumlah test: passed/failed/skipped
- Coverage percentage
- Edge cases yang di-test
- Rekomendasi improvement
```

### File: `.claude/agents/dapodik-validator.md`

```markdown
---
name: dapodik-validator
description: Validator data Dapodik untuk memastikan data sesuai standar Kemdikbud
tools: Read, Grep, Glob, Bash, Edit, Write
model: sonnet
---

# Dapodik Data Validator

Kamu adalah specialist validasi data Dapodik.

## Validation Rules

### Peserta Didik (PD)
- NISN: 10 digit angka, unik
- NIK: 16 digit angka
- Nama: max 50 karakter, huruf dan spasi saja
- Tanggal lahir: format YYYY-MM-DD, tidak di masa depan
- Jenis kelamin: L atau P
- Alamat: max 100 karakter

### GTK
- NIP: 18 digit angka (untuk PNS)
- NUPTK: 16 digit angka
- Nama: max 50 karakter
- Tanggal lahir: format YYYY-MM-DD
- Status kepegawaian: PNS, PPPK, Honorer, dll

### Sarpras
- Nama ruang: max 50 karakter
- Kondisi: Baik, Rusak Ringan, Rusak Berat
- Luas: angka positif (m²)

## Workflow
1. Baca data input
2. Validasi setiap field sesuai rules
3. Kumpulkan semua error (jangan stop di error pertama)
4. Return daftar error dengan lokasi dan pesan
5. Sarankan fix untuk setiap error
```

---

## 🔗 REFERENSI

- [Anthropic Docs — Sub-agents](https://docs.anthropic.com/en/docs/claude-code/sub-agents)
- [awattar/claude-code-best-practices — Agents](https://github.com/awattar/claude-code-best-practices#-specialized-ai-agents)
- [feiskyer/claude-code-settings — Agents](https://github.com/feiskyer/claude-code-settings#agents)
- [davepoon/claude-code-subagents-collection](https://github.com/davepoon/claude-code-subagents-collection)
- [wshobson/agents](https://github.com/wshobson/agents)

---

## ✅ CHECKLIST

- [ ] Paham konsep sub-agents dan arsitekturnya
- [ ] Tahu 9 agent dari awattar/claude-code-best-practices
- [ ] Tahu 7 agent dari feiskyer/claude-code-settings
- [ ] Paham cara konfigurasi agent (tools, model, instructions)
- [ ] Bisa memilih agent yang tepat untuk setiap task
- [ ] Paham parallel agent execution
- [ ] Tahu limitasi dan best practices sub-agents
- [ ] Bisa membuat custom agent untuk domain spesifik
- [ ] Paham real-world workflows untuk administrasi sekolah

---

> **Lanjut ke:** [`07-hooks-otomasi.md`](./07-hooks-otomasi.md)
