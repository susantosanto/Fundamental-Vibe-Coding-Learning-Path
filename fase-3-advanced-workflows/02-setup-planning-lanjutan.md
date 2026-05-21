# 02 — Setup & Planning Lanjutan

> **Estimasi:** 2 jam | **Level:** Menengah-Lanjut
> **Referensi:** [awesome-vibe-coding-guide](https://github.com/analyticalrohit/awesome-vibe-coding-guide) — Setup and Planning

---

## 📖 TEORI

### 1. Spec-Driven Development

Spec-driven development adalah pendekatan di mana Anda menulis **spesifikasi formal** sebelum AI mulai coding. Ini berbeda dari planning biasa — spesifikasi bersifat **executable** dan bisa divalidasi.

#### Mengapa Spec-Driven?

```
Problem: AI sering "hallucinate" requirements yang tidak Anda minta.
Solusi: Spesifikasi tertulis yang eksplisit membatasi ruang keputusan AI.

Prinsip dari awesome-vibe-coding-guide:
"Create a Comprehensive Plan — use AI to create a detailed plan in markdown.
Ask it clarifying questions and have it critique its own plan."
```

#### Struktur Spesifikasi yang Baik

```markdown
# spec.md — Sistem Absensi Digital SD Negeri Pasirhalang

## 1. Problem Statement
Guru kesulitan mencatat absensi secara manual. Diperlukan sistem digital
yang bisa diakses dari HP, dengan rekap otomatis per bulan.

## 2. User Stories
### US-1: Input Absensi
- SEBAGAI guru
- SAYA INGIN bisa input kehadiran siswa per kelas
- AGAR tidak perlu catatan manual

Acceptance Criteria:
- [ ] Guru bisa pilih kelas dari dropdown
- [ ] Daftar siswa muncul dengan checkbox Hadir/Sakit/Izin/Alpha
- [ ] Data tersimpan ke database setelah klik "Simpan"
- [ ] Tidak bisa input absensi untuk tanggal di masa depan

### US-2: Rekap Bulanan
- SEBAGAI operator
- SAYA INGIN melihat rekap absensi per bulan
- AGAR bisa laporan ke Dinas Pendidikan

Acceptance Criteria:
- [ ] Tabel rekap: baris=siswa, kolom=tanggal
- [ ] Warna berbeda untuk setiap status kehadiran
- [ ] Export ke Excel (.xlsx)
- [ ] Filter per kelas dan per bulan

## 3. Technical Constraints
- Database: SQLite (single file, mudah backup)
- Backend: FastAPI (Python)
- Frontend: HTML + HTMX (tanpa JavaScript framework)
- Deployment: Railway (free tier)
- Max response time: 500ms untuk query rekap

## 4. Data Model
```sql
CREATE TABLE siswa (
    id INTEGER PRIMARY KEY,
    nisn TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    kelas TEXT NOT NULL
);

CREATE TABLE absensi (
    id INTEGER PRIMARY KEY,
    siswa_id INTEGER REFERENCES siswa(id),
    tanggal DATE NOT NULL,
    status TEXT CHECK(status IN ('H','S','I','A')),
    UNIQUE(siswa_id, tanggal)
);
```

## 5. API Contract
```
POST /api/absensi
  Body: { tanggal: "2026-05-21", kelas: "6A", data: [{nisn, status}, ...] }
  Response: { success: true, count: 30 }

GET /api/absensi/rekap?kelas=6A&bulan=5&tahun=2026
  Response: { siswa: [{nama, hadir: 20, sakit: 2, izin: 1, alpha: 0}], total_hari: 23 }
```

## 6. Non-Functional Requirements
- Security: CSRF protection, input sanitization
- Reliability: Auto-backup database setiap hari
- Usability: Bisa dipakai di HP dengan layar 5 inch
```

#### Spec Review Checklist

Sebelum mulai coding, review spesifikasi dengan checklist ini:

```markdown
## Spec Review Checklist

### Completeness
- [ ] Semua user story punya acceptance criteria yang terukur
- [ ] Edge cases sudah diidentifikasi (data kosong, duplikat, dll)
- [ ] Error handling sudah didefinisikan untuk setiap endpoint
- [ ] Validasi input sudah jelas (tipe data, range, format)

### Consistency
- [ ] Nama field konsisten antara data model dan API contract
- [ ] Tidak ada konflik antar user story
- [ ] Technical constraints realistis untuk tech stack yang dipilih

### Testability
- [ ] Setiap acceptance criteria bisa diuji secara otomatis
- [ ] Ada definisi "done" yang jelas untuk setiap fitur
- [ ] Performance target bisa diukur dengan tool yang tersedia

### AI-Readiness
- [ ] Spesifikasi cukup detail untuk AI pahami tanpa ambigu
- [ ] Contoh input/output sudah disediakan
- [ ] Batasan yang jelas apa yang TIDAK boleh dilakukan AI
```

---

### 2. Writing Technical Specifications

Technical specification (tech spec) lebih detail dari plan biasa. Ini adalah dokumen yang menjadi **sumber kebenaran** untuk seluruh tim (termasuk AI).

#### Template Tech Spec

```markdown
# Tech Spec: [Nama Fitur/Proyek]

## Metadata
- Author: [Nama]
- Date: 2026-05-21
- Status: Draft / Review / Approved
- Reviewers: [Nama reviewer]

## 1. Overview
### 1.1 Context
Jelaskan masalah yang diselesaikan dan mengapa ini penting.

### 1.2 Goals
- Goal 1: [Terukur, spesifik]
- Goal 2: [Terukur, spesifik]

### 1.3 Non-Goals
- Bukan goal: [Yang secara eksplisit TIDAK dikerjakan]

## 2. Architecture
### 2.1 System Diagram
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│   FastAPI   │────▶│   SQLite    │
│   (HTMX)    │◀────│   Backend   │◀────│   Database  │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 2.2 Component Breakdown
| Component | Tech | Responsibility |
|-----------|------|----------------|
| Frontend | HTML + HTMX | UI rendering, user interaction |
| Backend | FastAPI + Python | Business logic, API, validation |
| Database | SQLite | Data persistence |
| Scheduler | APScheduler | Backup otomatis |

### 2.3 Data Flow
```
1. User buka /absensi/6A
2. Backend query siswa WHERE kelas='6A'
3. Render form dengan checkbox per siswa
4. User pilih status, klik Simpan
5. POST /api/absensi → validate → insert → response
6. UI update dengan HTMX tanpa reload
```

## 3. API Design
### 3.1 Endpoints
Detail setiap endpoint: method, path, request, response, error codes.

### 3.2 Authentication
Jelaskan mekanisme auth (session, JWT, API key).

## 4. Database Design
### 4.1 Schema
DDL lengkap dengan constraint dan index.

### 4.2 Migration Strategy
Bagaimana skema berubah dari waktu ke waktu.

## 5. Testing Strategy
### 5.1 Unit Tests
Coverage target: 80%+

### 5.2 Integration Tests
Endpoint yang harus diuji end-to-end.

### 5.3 Test Data
Data sample untuk testing.

## 6. Deployment
### 6.1 Environment
- Development: localhost
- Staging: [URL]
- Production: [URL]

### 6.2 CI/CD Pipeline
Langkah-langkah dari commit ke deployment.

## 7. Risks & Mitigation
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Database lock saat concurrent write | High | Medium | WAL mode SQLite |
| Data hilang saat server crash | High | Low | Auto-backup harian |
| UI tidak responsive di HP lama | Medium | Medium | Test di device lama |

## 8. Timeline
| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Setup | 1 hari | Project structure, database |
| Core API | 2 hari | CRUD absensi |
| Frontend | 2 hari | UI + HTMX |
| Testing | 1 hari | Test suite |
| Deploy | 0.5 hari | Live di Railway |
```

#### Tips Menulis Tech Spec untuk AI

```
1. Gunakan bahasa yang eksplisit, bukan implisit
   ❌ "Buat sistem yang bagus"
   ✅ "Buat form dengan maksimal 30 siswa per halaman, loading < 2 detik"

2. Sertakan contoh konkret
   ❌ "Format tanggal yang benar"
   ✅ "Format: YYYY-MM-DD, contoh: 2026-05-21"

3. Definisikan batasan dengan jelas
   ❌ "Bisa handle banyak user"
   ✅ "Support maksimal 50 concurrent user"

4. Gunakan diagram sederhana
   ASCII art sudah cukup untuk menjelaskan arsitektur

5. Pecah menjadi bagian kecil
   AI bekerja lebih baik dengan spesifikasi per komponen
```

---

### 3. Architecture Decision Records (ADR)

ADR adalah dokumen ringan yang mencatat **keputusan arsitektur** dan **alasan** di baliknya. Ini penting agar Anda (dan AI) tidak lupa mengapa keputusan tertentu dibuat.

#### Format ADR (Ringkas)

```markdown
# ADR-001: Pemilihan SQLite sebagai Database

## Status
Accepted

## Context
Aplikasi absensi akan digunakan oleh 1 sekolah dengan ~200 siswa dan
~15 guru. Server akan di-host di Railway free tier dengan resource terbatas.

## Decision
Menggunakan SQLite sebagai database utama.

## Consequences
### Positive
- Zero configuration, tidak perlu setup database server
- Single file, mudah backup (copy file saja)
- Resource usage minimal (cocok untuk free tier)
- Built-in di Python, tidak perlu install driver tambahan

### Negative
- Tidak support concurrent write yang tinggi (tapi OK untuk 15 guru)
- Tidak ada user-level access control (tapi OK untuk single-app)
- Scale terbatas (tapi OK untuk 200 siswa)

## Alternatives Considered
- PostgreSQL: Lebih powerful, tapi overkill dan butuh resource lebih
- MongoDB: Flexible schema, tapi tidak perlu untuk data terstruktur ini

## Related ADR
- ADR-002: Pemilihan FastAPI sebagai Backend Framework
```

#### Format ADR (Lengkap — MADR Template)

```markdown
# ADR-002: Pemilihan FastAPI sebagai Backend Framework

## Status
Accepted

## Context
Backend perlu menangani:
- REST API untuk absensi
- Template rendering untuk frontend HTMX
- Validasi input yang kuat
- Dokumentasi API otomatis

Tim familiar dengan Python. Performance bukan concern utama
(< 50 request/second).

## Decision
Menggunakan FastAPI sebagai backend framework.

## Consequences
### Positive
- Type hints built-in → AI bisa generate code lebih akurat
- Auto-generated OpenAPI docs → dokumentasi gratis
- Async support → bisa handle concurrent request
- Pydantic validation → input validation otomatis
- Ekosistem Python → banyak library untuk kebutuhan sekolah

### Negative
- Relatif baru dibanding Flask/Django → community lebih kecil
- Async bisa kompleks untuk developer pemula
- Tidak ada admin panel built-in (berbeda dengan Django)

## Alternatives Considered
### Flask
+ Lebih mature, community besar
- Tidak ada type hints native, validation manual
- AI kurang akurat generate Flask code dibanding FastAPI

### Django
+ Admin panel built-in, ORM powerful
- Overkill untuk proyek kecil
- Kurva belajar lebih tinggi
- Response time lebih lambat untuk simple API

### Express.js (Node.js)
+ Popular, banyak tutorial
- Tim lebih familiar Python
- Perlu setup tambahan untuk validation, ORM

## Compliance
- Sesuai dengan standar Kemdikbud untuk aplikasi sekolah
- Data tersimpan lokal (compliance privacy)

## Notes
Keputusan ini bisa di-review ulang jika user melebihi 500 siswa.
```

#### Kapan Membuat ADR?

```
Buat ADR ketika:
✅ Memilih tech stack baru
✅ Mengubah arsitektur yang sudah ada
✅ Memilih antara dua pendekatan yang sama-sama valid
✅ Ada trade-off yang perlu didokumentasikan

Tidak perlu ADR ketika:
❌ Perubahan minor (rename variable, refactor kecil)
❌ Keputusan yang sudah jelas (pakai library standar)
❌ Yang bisa dijelaskan dalam commit message
```

#### ADR Log (Index File)

```markdown
# Architecture Decision Log

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| 001 | Pemilihan SQLite sebagai Database | Accepted | 2026-05-01 |
| 002 | Pemilihan FastAPI sebagai Backend | Accepted | 2026-05-01 |
| 003 | HTMX vs JavaScript Framework | Accepted | 2026-05-02 |
| 004 | Deployment di Railway vs Vercel | Accepted | 2026-05-03 |
| 005 | Backup Strategy: Cron vs APScheduler | Proposed | 2026-05-05 |
```

---

### 4. Planning with AI

Ini adalah inti dari vibe coding — menggunakan AI sebagai **partner planning**, bukan hanya coder.

#### Breaking Down Complex Tasks

Prinsip dari awesome-vibe-coding-guide:
> "Break tasks into small steps and review outputs."

```
Prompt untuk breaking down:

"Saya ingin membangun sistem absensi digital untuk sekolah.
Break down menjadi tasks yang bisa dikerjakan satu per satu.

Kriteria:
- Setiap task maksimal 2 jam pengerjaan
- Task independen bisa dikerjakan paralel
- Ada dependency yang jelas antar task
- Setiap task punya definisi 'done' yang terukur

Output format:
## Task 1: [Nama]
- Deskripsi: ...
- Dependencies: ...
- Estimasi: ...
- Done when: ...
```

#### Contoh Output Breakdown

```markdown
## Task 1: Setup Project Structure
- Deskripsi: Buat folder, virtual env, install dependencies
- Dependencies: Tidak ada
- Estimasi: 30 menit
- Done when: `uvicorn main:app --reload` berjalan di localhost:8000

## Task 2: Database Schema & Migration
- Deskripsi: Buat tabel siswa dan absensi, seed data
- Dependencies: Task 1
- Estimasi: 1 jam
- Done when: `sqlite3 absensi.db ".tables"` menampilkan siswa dan absensi

## Task 3: CRUD Siswa API
- Deskripsi: POST, GET, PUT, DELETE untuk siswa
- Dependencies: Task 2
- Estimasi: 1.5 jam
- Done when: Semua endpoint tested dengan pytest

## Task 4: CRUD Absensi API
- Deskripsi: Input dan query absensi
- Dependencies: Task 3
- Estimasi: 1.5 jam
- Done when: Bisa input dan rekap via API

## Task 5: Frontend Input Absensi
- Deskripsi: Form absensi dengan HTMX
- Dependencies: Task 4
- Estimasi: 2 jam
- Done when: Guru bisa input absensi dari browser

## Task 6: Frontend Rekap Bulanan
- Deskripsi: Tabel rekap + export Excel
- Dependencies: Task 4
- Estimasi: 2 jam
- Done when: Operator bisa lihat dan export rekap

## Task 7: Authentication
- Deskripsi: Login guru dan operator
- Dependencies: Task 1
- Estimasi: 1.5 jam
- Done when: Hanya user login yang bisa akses

## Task 8: Deployment
- Deskripsi: Deploy ke Railway
- Dependencies: Task 5, 6, 7
- Estimasi: 1 jam
- Done when: Aplikasi accessible dari URL publik
```

#### Dependency Mapping

Gunakan AI untuk memetakan dependency:

```
Prompt:

"Dari task list ini, buatkan dependency graph dan urutan pengerjaan optimal.
Identifikasi task yang bisa paralel dan task yang harus sequential.

Task list:
[copy task list di atas]

Output:
1. Gantt chart sederhana (text-based)
2. Critical path (rantaian task yang menentukan total waktu)
3. Paralel opportunities (task yang bisa dikerjakan bersamaan)
```

#### Risk Assessment dengan AI

```
Prompt:

"Identifikasi risiko teknis untuk proyek sistem absensi ini.
Untuk setiap risiko, berikan:
1. Nama risiko
2. Kemungkinan (Low/Medium/High)
3. Dampak (Low/Medium/High)
4. Mitigasi
5. Early warning sign (bagaimana tahu risiko ini terjadi)

Konteks proyek:
- Tech stack: FastAPI, SQLite, HTMX
- Target user: 15 guru, 200 siswa
- Deployment: Railway free tier
- Timeline: 2 minggu
```

#### Contoh Risk Assessment Output

```markdown
## Risk Assessment

### R1: Database Lock saat Concurrent Write
- Kemungkinan: Medium (15 guru mungkin input bersamaan)
- Dampak: High (data absensi hilang/gagal save)
- Mitigasi: Gunakan WAL (Write-Ahead Logging) mode di SQLite
  ```python
  import sqlite3
  conn = sqlite3.connect('absensi.db')
  conn.execute('PRAGMA journal_mode=WAL')
  ```
- Early warning: Error "database is locked" di log

### R2: Railway Free Tier Sleep
- Kemungkinan: High (Railway free tier sleep setelah inactivity)
- Dampak: Medium (request pertama lambat setelah sleep)
- Mitigasi: Health check endpoint + cron ping setiap 5 menit
- Early warning: Response time > 5 detik di monitoring

### R3: Data Tidak Konsisten saat Server Crash
- Kemungkinan: Low
- Dampak: High (data absensi hilang)
- Mitigasi: Auto-backup setiap jam ke cloud storage
- Early warning: Backup file tidak update > 1 jam

### R4: UI Tidak Responsive di HP Lama
- Kemungkinan: Medium
- Dampak: Medium (guru tidak bisa input dari HP)
- Mitigasi: Test di HP dengan browser lama, gunakan CSS sederhana
- Early warning: Layout broken di Chrome DevTools device emulation

### R5: Scope Creep (Fitur Bertambah)
- Kemungkinan: High (umum di proyek sekolah)
- Dampak: Medium (timeline molor)
- Mitigasi: Freeze scope di spec.md, fitur baru masuk v2
- Early warning: Request fitur baru di luar spec
```

---

### 5. Planning Templates

#### Template 1: Quick Plan (Proyek Kecil, < 1 hari)

```markdown
# Quick Plan: [Nama]

## What
[1 kalimat: apa yang akan dibuat]

## Why
[1 kalimat: mengapa ini perlu]

## How
- Tech: [stack]
- Approach: [pendekatan]

## Steps
1. [ ] Step 1
2. [ ] Step 2
3. [ ] Step 3

## Done When
[Kriteria selesai yang terukur]
```

#### Template 2: Medium Plan (Proyek 1-5 hari)

```markdown
# Plan: [Nama]

## Overview
- Problem: [yang diselesaikan]
- Solution: [yang akan dibuat]
- Timeline: [estimasi]
- Tech Stack: [tools]

## Features
### F1: [Nama Fitur]
- User Story: Sebagai [role], saya ingin [aksi], agar [manfaat]
- Acceptance: [kriteria]
- Estimasi: [waktu]

### F2: [Nama Fitur]
...

## Architecture
```
[Diagram sederhana]
```

## Data Model
[Schema atau struktur data]

## API Design
[Endpoints utama]

## Testing
- Unit tests: [coverage target]
- Manual tests: [scenario]

## Risks
[Risiko utama + mitigasi]

## Timeline
| Hari | Task |
|------|------|
| 1 | Setup + F1 |
| 2 | F2 + F3 |
| 3 | Testing |
| 4 | Deploy |
```

#### Template 3: Full Plan (Proyek > 1 minggu)

```markdown
# Project Plan: [Nama]

## Executive Summary
[Ringkasan 1 paragraf untuk stakeholder]

## Problem Statement
[Detail masalah yang diselesaikan]

## Goals & Success Metrics
| Goal | Metric | Target |
|------|--------|--------|
| [Goal 1] | [Metric] | [Target] |

## Scope
### In Scope
- [Yang dikerjakan]

### Out of Scope
- [Yang TIDAK dikerjakan]

## Architecture
### System Context
```
[Diagram sistem dan interaksi]
```

### Component Diagram
```
[Diagram komponen internal]
```

### Data Flow
[Bagaimana data mengalir]

## Technical Design
### Tech Stack & Justification
| Component | Tech | Alasan |
|-----------|------|--------|

### Database Design
[Schema lengkap]

### API Design
[Spesifikasi lengkap]

### Security Design
[Auth, authorization, data protection]

## Implementation Plan
### Phase 1: Foundation (Minggu 1)
- Task 1.1: ...
- Task 1.2: ...

### Phase 2: Core Features (Minggu 2-3)
- Task 2.1: ...

### Phase 3: Polish & Deploy (Minggu 4)
- Task 3.1: ...

## Testing Strategy
- Unit testing: [approach]
- Integration testing: [approach]
- UAT: [approach]

## Deployment Plan
- Environment: [dev, staging, prod]
- CI/CD: [pipeline]
- Rollback: [strategy]

## Risk Management
[Risk register lengkap]

## Communication Plan
- Standup: [frekuensi]
- Demo: [frekuensi]
- Report: [format]
```

---

### 6. Planning for Different Project Sizes

#### Proyek Kecil (Script/Tool, < 4 jam)

```
Pendekatan: Quick Plan + langsung coding
Dokumentasi: 1 file plan.md (5-10 baris)
Review: Self-review sebelum mulai

Contoh: Script export data Dapodik ke Excel
- Plan: "Baca database Dapodik → extract data siswa → tulis ke Excel"
- Done when: File .xlsx tergenerate dengan data lengkap
```

#### Proyek Menengah (Aplikasi Web, 1-5 hari)

```
Pendekatan: Medium Plan + spec-driven
Dokumentasi: plan.md + spec.md (masing-masing 20-50 baris)
Review: AI review plan sebelum coding

Contoh: Sistem Absensi Digital
- Plan: 6 fitur, 8 tasks, timeline 4 hari
- Spec: User stories, API contract, data model
- Review: "Critique plan saya, apa yang kurang?"
```

#### Proyek Besar (S Kompleks, > 1 minggu)

```
Pendekatan: Full Plan + ADR + phased implementation
Dokumentasi: Full plan + ADR log + spec per fase
Review: Multi-step review (plan → spec → architecture)

Contoh: Sistem Informasi Sekolah Terintegrasi
- Plan: 4 fase, 20+ tasks, timeline 4 minggu
- ADR: 5+ keputusan arsitektur
- Spec: Per modul (absensi, keuangan, inventaris)
- Review: AI critique + manual review
```

#### Decision Matrix: Seberapa Detail Planning?

```
┌────────────────────┬──────────┬──────────┬──────────┐
│ Kriteria           │ Kecil    │ Menengah │ Besar    │
├────────────────────┼──────────┼──────────┼──────────┤
│ Duration           │ < 4 jam  │ 1-5 hari │ > 1 mgg  │
│ Plan File          │ 5-10 bar │ 20-50 bar│ 100+ bar │
│ Spec               │ Tidak    │ Ya       │ Ya/detail│
│ ADR                │ Tidak    │ Opsional │ Ya       │
│ AI Review          │ Opsional │ Ya       │ Ya/multi │
│ Test Plan          │ Mental   │ Tertulis │ Formal   │
│ Risk Assessment    │ Mental   │ Tertulis │ Register │
└────────────────────┴──────────┴──────────┴──────────┘
```

---

### 7. Planning Review Checklist

Gunakan checklist ini SEBELUM mulai coding dengan AI:

#### Pre-Coding Checklist

```markdown
## Planning Review Checklist

### Plan Quality
- [ ] Plan ditulis dalam bahasa yang jelas dan spesifik
- [ ] Setiap fitur punya user story dengan acceptance criteria
- [ ] Ada definisi "done" yang terukur untuk setiap task
- [ ] Timeline realistis (buffer 20% untuk unexpected issues)

### Technical Readiness
- [ ] Tech stack sudah dipilih dan alasan didokumentasikan
- [ ] Database schema sudah dirancang
- [ ] API contract sudah didefinisikan (jika ada API)
- [ ] Environment setup sudah jelas (dependencies, config)

### AI Preparation
- [ ] Plan sudah di-review oleh AI ("Critique plan saya")
- [ ] Feedback AI sudah diimplementasikan ke plan
- [ ] Plan disimpan di file yang bisa AI akses (plan.md, CLAUDE.md)
- [ ] Prompt template sudah disiapkan untuk setiap task

### Risk Management
- [ ] Risiko utama sudah diidentifikasi
- [ ] Mitigasi sudah direncanakan untuk risiko high-impact
- [ ] Ada fallback plan jika pendekatan utama gagal
- [ ] Backup strategy sudah ditentukan

### Scope Control
- [ ] Scope sudah di-freeze (tidak berubah saat coding)
- [ ] Out-of-scope items sudah didefinisikan
- [ ] Mekanisme untuk handle scope change sudah ada
- [ ] V2 features sudah dipisahkan dari V1

### Testing Strategy
- [ ] Test approach sudah ditentukan (unit, integration, E2E)
- [ ] Test data sudah disiapkan atau direncanakan
- [ ] Coverage target sudah ditetapkan
- [ ] Manual testing scenarios sudah diidentifikasi

### Deployment Readiness
- [ ] Platform deployment sudah dipilih
- [ ] Environment variables sudah didaftar
- [ ] .env dan .gitignore sudah disiapkan
- [ ] Rollback plan sudah dipikirkan
```

#### AI-Specific Planning Tips

```
Tips dari awesome-vibe-coding-guide:

1. "Ask it clarifying questions and have it critique its own plan"
   → Setelah AI buat plan, minta: "Apa yang kurang dari plan ini?"

2. "Save this plan in plan.md so the AI can reference it anytime"
   → Selalu simpan plan di file, bukan hanya di chat

3. "Keep Chats Focused — Create a new, clean chat for each distinct task"
   → 1 task = 1 chat session, jangan campur aduk

4. "Reset Context When Needed — start fresh with a New chat"
   → Jika AI mulai confused, jangan lanjutkan. Reset.

5. "Document effective prompts, keep a record of prompts that work best"
   → Simpan prompt yang berhasil di prompt_library.md
```

#### Prompt Library Template

```markdown
# Prompt Library

## Planning Prompts
### Break Down Task
```
Break down [deskripsi proyek] menjadi tasks yang bisa dikerjakan
satu per satu. Setiap task maksimal 2 jam. Format: nama, deskripsi,
dependencies, estimasi, done when.
```

### Review Plan
```
Review plan berikut. Identifikasi:
1. Yang kurang atau ambigu
2. Risiko teknis yang tidak tercover
3. Optimasi yang mungkin
4. Pertanyaan klarifikasi yang perlu dijawab

[paste plan]
```

### Risk Assessment
```
Identifikasi risiko teknis untuk proyek ini. Format: nama, kemungkinan,
dampak, mitigasi, early warning.

[konteks proyek]
```

## Coding Prompts
### Implement Feature
```
Implement [fitur] berdasarkan spec berikut. Ikuti spec secara ketat.
Jika ada ambiguity, tanya dulu sebelum implementasi.

[spec]
```

### Fix Error
```
Error: [error message]
Context: [file, line, apa yang sedang dikerjakan]
Sudah dicoba: [yang sudah dicoba]

Analisis penyebab dan berikan fix.
```

## Testing Prompts
### Generate Tests
```
Buat test suite untuk [fungsi/modul]. Cover:
1. Happy path
2. Edge cases
3. Error conditions
4. Boundary values
```
```

---

## ✅ CHECKLIST

- [ ] Bisa menulis spec-driven document dengan user stories dan acceptance criteria
- [ ] Paham format ADR dan kapan harus membuatnya
- [ ] Bisa break down proyek kompleks menjadi tasks kecil
- [ ] Tahu cara mapping dependency antar tasks
- [ ] Bisa melakukan risk assessment dengan bantuan AI
- [ ] Punya template planning untuk 3 ukuran proyek
- [ ] Menggunakan planning review checklist sebelum coding
- [ ] Menyimpan plan di file (plan.md) agar AI bisa reference
- [ ] Mempunyai prompt library untuk planning reuse
- [ ] Memahami prinsip dari awesome-vibe-coding-guide: clarity first, iterative control, human oversight

---

## 📚 REFERENSI

- [awesome-vibe-coding-guide](https://github.com/analyticalrohit/awesome-vibe-coding-guide) — Setup and Planning
- [MADR (Markdown Any Decision Records)](https://adr.github.io/madr/) — Format ADR standar
- [Spec-Driven Development](https://en.wikipedia.org/wiki/Specification_(technical_standard)) — Konsep dasar

---

> **Lanjut ke:** [`03-prompting-efektif.md`](./03-prompting-efektif.md)
