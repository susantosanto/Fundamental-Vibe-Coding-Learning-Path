# B3: Dokumentasi & Git

> **Auto-generate README, API docs, architecture docs, commit message, PR description, changelog, dan knowledge base**

**Estimasi**: 30 menit belajar + 45 menit praktik | **Level**: Intermediate → Advanced

## 🎯 Outcome

Setelah menyelesaikan modul ini, kamu akan mampu:

1. Auto-generate README profesional dengan AI
2. Membuat API documentation otomatis dari kode
3. Mendokumentasikan arsitektur sistem dengan diagram
4. Generate commit message format Conventional Commits
5. Membuat PR description yang komprehensif
6. Mengelola changelog secara otomatis
7. Membuat onboarding documentation untuk tim baru
8. Membangun knowledge base dari kode yang ada
9. Memahami dokumentasi maintenance dan versioning
10. Menerapkan "documentation as code" workflow
11. Setup inline comments yang efektif
12. Mengelola Git workflow dengan branching strategy

## 🤔 Masalah yang Diselesaikan

Dokumentasi adalah aspek yang paling sering diabaikan dalam pengembangan software. AI mengubah paradigma ini secara fundamental:

| Masalah Tradisional | Solusi dengan AI |
|---------------------|------------------|
| Menulis README butuh waktu berjam-jam | AI analisis struktur → generate dalam hitungan detik |
| API docs selalu usang setelah update | Regenerate otomatis setiap ada perubahan endpoint |
| Architecture diagram manual dan sulit update | AI generate dari kode + dependency analysis |
| Commit message tidak konsisten | AI enforce Conventional Commits standar |
| PR description tidak standar | Template otomatis dari commit history |
| Changelog lupa diupdate | Auto-generate dari git log |
| Onboarding anggota baru butuh waktu lama | AI generate dari kodebase yang ada |
| Knowledge base tidak pernah diupdate | Auto-sync dengan perubahan kode |
| Inline comments tidak konsisten | AI generate JSDoc/docstring otomatis |
| Git workflow tidak terdokumentasi | AI generate dari branching pattern yang ada |

---

## 🔑 Konsep Inti

### Hirarki Dokumentasi

Dokumentasi proyek yang baik memiliki beberapa lapisan, masing-masing dengan tujuan dan audience yang berbeda:

```
┌─────────────────────────────────────────────────────────┐
│                    DOCUMENTATION LAYERS                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Layer 1: README.md                                     │
│  └─ Audience: Semua orang (user, developer, stakeholder)│
│  └─ Isi: Overview, quick start, fitur, kontribusi       │
│  └─ Update: Awal proyek + setiap major change           │
│                                                         │
│  Layer 2: API Documentation                             │
│  └─ Audience: Developer yang integrasi API              │
│  └─ Isi: Endpoints, request/response, auth, examples    │
│  └─ Update: Setiap ada perubahan endpoint               │
│                                                         │
│  Layer 3: Architecture Documentation                    │
│  └─ Audience: Developer, architect, tech lead           │
│  └─ Isi: Diagram, decision records, patterns            │
│  └─ Update: Setiap ada perubahan arsitektur signifikan  │
│                                                         │
│  Layer 4: Inline Code Documentation                     │
│  └─ Audience: Developer yang baca/maintain kode         │
│  └─ Isi: JSDoc, docstrings, comments                    │
│  └─ Update: Setiap ada perubahan fungsi/method          │
│                                                         │
│  Layer 5: Changelog                                     │
│  └─ Audience: Semua orang (tracking perubahan)          │
│  └─ Isi: Version history, breaking changes, bug fixes   │
│  └─ Update: Setiap release                              │
│                                                         │
│  Layer 6: Onboarding & Knowledge Base                   │
│  └─ Audience: Developer baru, tim baru                  │
│  └─ Isi: Setup guide, conventions, FAQ, troubleshooting │
│  └─ Update: Setiap ada proses baru atau perubahan besar │
│                                                         │
│  Layer 7: Git Workflow Documentation                    │
│  └─ Audience: Developer, contributor                    │
│  └─ Isi: Branching strategy, commit conventions, PR     │
│  └─ Update: Setiap ada perubahan workflow               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Dokumentasi Otomatis vs Manual

Tidak semua dokumentasi bisa di-generate otomatis. Pahami mana yang bisa dan mana yang butuh sentuhan manusia:

| Tipe | Otomatis? | AI Coverage | Butuh Human Review |
|------|-----------|-------------|-------------------|
| README | ✅ 80% | Analisis struktur + generate | ✅ Konteks bisnis |
| API Docs | ✅ 90% | Extract dari route/controller | ✅ Business logic notes |
| Architecture | ⚠️ 60% | Generate diagram dari kode | ✅ Design decisions |
| Inline Comments | ✅ 70% | JSDoc/docstring generation | ✅ Complex logic explanation |
| Changelog | ✅ 85% | Parse git log + conventional commits | ✅ Release notes context |
| PR Description | ✅ 90% | Aggregate commits + diff analysis | ✅ Review notes |
| Onboarding Guide | ⚠️ 50% | Generate dari setup scripts | ✅ Team-specific info |
| Knowledge Base | ⚠️ 40% | Extract patterns dari kode | ✅ Context dan rationale |
| Git Workflow | ✅ 75% | Analyze branching pattern | ✅ Team conventions |

### Self-Documenting Code vs Comments

Prinsip utama dalam dokumentasi kode:

```
┌────────────────────────────────────────────────────────────────────┐
│              SELF-DOCUMENTING CODE vs COMMENTS                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  SELF-DOCUMENTING CODE (Prioritas Utama)                          │
│  ─────────────────────────────────────────                        │
│  ✅ Nama variabel/fungsi yang jelas                                │
│  ✅ Fungsi kecil dengan single responsibility                      │
│  ✅ Struktur kode yang readable                                    │
│  ✅ Type hints dan signatures yang eksplisit                       │
│                                                                    │
│  CONTOH:                                                          │
│  ❌ const x = d.map(i => i.n)  // Tidak jelas                    │
│  ✅ const userNames = users.map(user => user.fullName)            │
│                                                                    │
│  COMMENTS (Untuk yang Tidak Bisa Self-Documenting)                │
│  ─────────────────────────────────────────                        │
│  ✅ WHY bukan WHAT — Jelaskan alasan, bukan apa yang kode lakukan │
│  ✅ Complex business logic — Aturan bisnis yang tidak obvious     │
│  ✅ Workaround — Kenapa pakai solusi yang tidak ideal             │
│  ✅ TODO/FIXME — Yang perlu diperbaiki nanti                      │
│  ⚠️  JANGAN comment yang menjelaskan kode yang sudah jelas        │
│                                                                    │
│  CONTOH:                                                          │
│  ❌ // Increment counter by 1                                     │
│     counter += 1                                                   │
│                                                                    │
│  ✅ // NISN harus 10 digit sesuai standar Kemendikbud 2024        │
│     if (nisn.length !== 10) throw new ValidationError(...)        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Praktik Lengkap

### Step 1: Generate README Profesional

#### 1.1 Analisis Struktur Proyek

Sebelum generate README, AI perlu memahami struktur proyek secara menyeluruh:

```
@explore Analisis proyek ini secara menyeluruh:

1. Baca package.json / requirements.txt / go.mod untuk dependency
2. Lihat struktur direktori src/
3. Identifikasi tech stack utama
4. Cari file konfigurasi (.env.example, docker-compose.yml)
5. Lihat file test yang ada
6. Cek ada script build/run di package.json

Buat summary lengkap:
- Nama proyek
- Tech stack
- Fitur utama (dari route/controller)
- Cara install dan run
- Cara test
- Cara deploy
```

#### 1.2 Generate README Template

Setelah analisis selesai, minta AI generate README:

```
Buatkan README.md profesional dengan struktur berikut:

# [Nama Proyek]

> [Tagline singkat - 1 kalimat yang menjelaskan apa proyek ini]

[![Build Status](badge)] [![Version](badge)] [![License](badge)]

## 📋 Tentang

[Paragraf 1: Apa proyek ini dan masalah apa yang diselesaikan]
[Paragraf 2: Target user dan use case utama]
[Paragraf 3: Keunggulan dibanding alternatif]

## ✨ Fitur

- [ ] Fitur 1 — deskripsi singkat
- [ ] Fitur 2 — deskripsi singkat
- [ ] Fitur 3 — deskripsi singkat

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0
- PostgreSQL >= 14
- npm atau pnpm

### Installation

\`\`\`bash
# Clone repository
git clone https://github.com/user/proyek.git
cd proyek

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan konfigurasi kamu

# Setup database
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
\`\`\`

### Running

\`\`\`bash
# Development
npm run dev

# Production
npm run build
npm start

# Docker
docker-compose up -d
\`\`\`

## 📁 Struktur Proyek

\`\`\`
proyek/
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models
│   ├── services/       # Business logic
│   ├── middleware/     # Express middleware
│   ├── routes/         # Route definitions
│   └── utils/          # Helper functions
├── tests/              # Test files
├── docs/               # Documentation
├── .env.example        # Environment template
├── docker-compose.yml  # Docker config
└── package.json
\`\`\`

## 🔧 Konfigurasi

| Variable | Deskripsi | Default | Required |
|----------|-----------|---------|----------|
| DATABASE_URL | Connection string database | - | ✅ |
| PORT | Port server | 3000 | ❌ |
| JWT_SECRET | Secret key untuk JWT | - | ✅ |
| NODE_ENV | Environment | development | ❌ |

## 📖 API Documentation

Lihat [docs/API.md](docs/API.md) untuk dokumentasi lengkap endpoint.

Quick reference:

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | /api/auth/login | Login user |
| GET | /api/users | List semua user |
| POST | /api/users | Buat user baru |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Hapus user |

## 🧪 Testing

\`\`\`bash
# Run semua test
npm test

# Run dengan coverage
npm run test:coverage

# Run specific test file
npm test -- tests/auth.test.js

# Watch mode
npm run test:watch
\`\`\`

## 🤝 Contributing

Kami menerima kontribusi! Silakan:

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feat/nama-fitur`)
3. Commit perubahan (`git commit -m 'feat: tambah fitur X'`)
4. Push ke branch (`git push origin feat/nama-fitur`)
5. Buat Pull Request

Pastikan:
- [ ] Test lulus (`npm test`)
- [ ] Lint tidak ada error (`npm run lint`)
- [ ] Dokumentasi diupdate
- [ ] Commit mengikuti Conventional Commits

## 📄 License

[MIT License](LICENSE)

## 👥 Tim

- [Nama](https://github.com/username) — Role
- [Nama](https://github.com/username) — Role
```

#### 1.3 README untuk Proyek Sekolah (Konteks ARKAS/Dapodik)

Untuk proyek administrasi sekolah, README perlu disesuaikan:

```
Buatkan README.md untuk proyek administrasi sekolah SD Negeri Pasirhalang:

# Sistem Informasi Administrasi SD Negeri Pasirhalang

> Platform terpadu untuk pengelolaan administrasi sekolah, keuangan BOS, data Dapodik, dan surat-menyurat.

**Lokasi**: Desa Mandalamukti, Kec. Cikalongwetan, Kab. Bandung Barat
**NPSN**: 20228835

## 📋 Tentang

Sistem ini dikembangkan untuk membantu operator sekolah dalam:
- Mengelola data Peserta Didik, GTK, dan Sarpras (Dapodik)
- Perencanaan dan pelaporan keuangan BOS (ARKAS)
- Pembuatan surat-menyurat administrasi sekolah
- Monitoring kehadiran siswa dan guru

## 🏫 Modul Tersedia

| Modul | Deskripsi | Status |
|-------|-----------|--------|
| Dapodik | Sinkronisasi data ke Kemendikbud | ✅ Aktif |
| ARKAS | Perencanaan & realisasi BOS | ✅ Aktif |
| Surat | Template & generate surat | ✅ Aktif |
| Absensi | Kehadiran siswa & guru | 🔄 Development |
| Inventaris | Aset & sarpras sekolah | 📋 Planned |

## 🔐 Akses Sistem

| Aplikasi | URL | Login |
|----------|-----|-------|
| Dapodik Web | https://dapo.kemdikbud.go.id | NPSN + Password |
| ARKAS | https://arkas.kemdikbud.go.id | NPSN + Password |
| BOS Online | https://bos.kemdikbud.go.id | NPSN + Password |

## 📊 Alur Kerja BOS

\`\`\`
Perencanaan (RKAS) → Pengajuan → Pencairan → Realisasi → LPJ
     ↓                  ↓           ↓           ↓         ↓
   RKAS-1            SP2D        Rekening     Bukti    LPJ-1
   RKAS-2           Transfer     Sekolah     Bayar     LPJ-2
\`\`\`

## ⚠️ Catatan Penting

- Backup data Dapodik secara berkala (minimal 1x seminggu)
- Validasi data sebelum submit ke server pusat
- Simpan bukti transaksi realisasi BOS minimal 5 tahun
- Update regulasi BOS setiap tahun ajaran baru
```

---

### Step 2: API Documentation Otomatis

#### 2.1 Extract API dari Kode

AI bisa membaca route definitions dan generate dokumentasi lengkap:

```
@src/routes/ Baca semua file route di direktori ini.

Untuk setiap endpoint, generate dokumentasi dengan format:

## [METHOD] /api/[path]

**Deskripsi**: [1 kalimat fungsi endpoint]

**Authentication**: [Required/Optional] — [Jenis auth]

**Request**:
- Headers: [Content-Type, Authorization, dll]
- Body/Params/Query: [Parameter dengan tipe dan deskripsi]

**Response**:
- 200: [Deskripsi + contoh JSON]
- 400: [Deskripsi + contoh JSON]
- 401: [Deskripsi + contoh JSON]
- 404: [Deskripsi + contoh JSON]
- 500: [Deskripsi + contoh JSON]

**Contoh Request**:
\`\`\`bash
curl -X [METHOD] [URL] \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [token]" \
  -d '{"key": "value"}'
\`\`\`

**Contoh Response**:
\`\`\`json
{
  "status": "success",
  "data": { ... }
}
\`\`\`

Simpan hasil di docs/API.md
```

#### 2.2 OpenAPI/Swagger Specification

Untuk API documentation yang lebih standar, generate OpenAPI spec:

```
Buatkan OpenAPI 3.0 specification (YAML) untuk API ini.

Baca semua route dan model, lalu generate spec yang mencakup:

1. **Info**: title, version, description, contact
2. **Servers**: development, staging, production
3. **Components**:
   - Schemas: semua model/database entity
   - SecuritySchemes: bearerAuth, apiKey, dll
4. **Paths**: semua endpoint dengan:
   - summary, description
   - parameters (path, query, header)
   - requestBody dengan schema
   - responses (200, 400, 401, 404, 500)
   - security requirements
5. **Tags**: grouping endpoint by module

Simpan sebagai docs/openapi.yaml
```

Contoh output OpenAPI:

```yaml
openapi: 3.0.3
info:
  title: SD Negeri Pasirhalang API
  description: API untuk sistem administrasi sekolah
  version: 1.0.0
  contact:
    name: Operator SD Negeri Pasirhalang
    email: operator@sdnpasirhalang.sch.id

servers:
  - url: http://localhost:3000/api
    description: Development
  - url: https://api.sdnpasirhalang.sch.id/api
    description: Production

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Siswa:
      type: object
      required:
        - nisn
        - nama
        - kelas
      properties:
        id:
          type: string
          format: uuid
          readOnly: true
        nisn:
          type: string
          pattern: '^\d{10}$'
          description: Nomor Induk Siswa Nasional
        nama:
          type: string
          maxLength: 100
        kelas:
          type: string
          enum: ['1', '2', '3', '4', '5', '6']
        ttl:
          type: string
          format: date
        nama_ortu:
          type: string
        createdAt:
          type: string
          format: date-time
          readOnly: true

    Error:
      type: object
      properties:
        status:
          type: string
          example: error
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string

paths:
  /siswa:
    get:
      tags: [Siswa]
      summary: List semua siswa
      security:
        - bearerAuth: []
      parameters:
        - name: kelas
          in: query
          schema:
            type: string
          description: Filter berdasarkan kelas
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: per_page
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
      responses:
        '200':
          description: List siswa berhasil diambil
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: success
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Siswa'
                  meta:
                    type: object
                    properties:
                      page:
                        type: integer
                      per_page:
                        type: integer
                      total:
                        type: integer
                      total_pages:
                        type: integer
        '401':
          $ref: '#/components/responses/Unauthorized'

    post:
      tags: [Siswa]
      summary: Tambah siswa baru
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [nisn, nama, kelas]
              properties:
                nisn:
                  type: string
                nama:
                  type: string
                kelas:
                  type: string
                ttl:
                  type: string
                  format: date
                nama_ortu:
                  type: string
      responses:
        '201':
          description: Siswa berhasil ditambahkan
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: success
                  data:
                    $ref: '#/components/schemas/Siswa'
        '400':
          description: Validasi gagal
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
```

#### 2.3 API Documentation dengan JSDoc Inline

AI juga bisa menambahkan JSDoc comments langsung di kode:

```
@src/controllers/siswa.controller.ts Tambahkan JSDoc comments:

Setiap fungsi yang di-export harus punya:
- @description — penjelasan fungsi
- @param — setiap parameter dengan tipe dan deskripsi
- @returns — return value dengan tipe
- @throws — error yang mungkin dilempar
- @example — contoh penggunaan

Contoh format:
\`\`\`typescript
/**
 * Mendapatkan daftar siswa dengan pagination dan filter
 * 
 * @param req - Express request object
 * @param req.query.kelas - Filter berdasarkan kelas (opsional)
 * @param req.query.page - Halaman saat ini (default: 1)
 * @param req.query.per_page - Jumlah data per halaman (default: 20, max: 100)
 * @returns Response dengan array siswa dan metadata pagination
 * @throws {ValidationError} Jika parameter tidak valid
 * @throws {DatabaseError} Jika terjadi kesalahan database
 * 
 * @example
 * // GET /api/siswa?kelas=5&page=1&per_page=10
 * // Response:
 * // {
 * //   "status": "success",
 * //   "data": [...],
 * //   "meta": { "page": 1, "per_page": 10, "total": 45 }
 * // }
 */
async function getSiswa(req: Request, res: Response) { ... }
\`\`\`
```

---

### Step 3: Architecture Documentation

#### 3.1 System Architecture Diagram

Generate arsitektur dari analisis kode:

```
@explore Analisis arsitektur sistem ini secara menyeluruh.

Identifikasi:
1. Layer arsitektur (presentation, business, data)
2. Komponen utama dan tanggung jawab masing-masing
3. Alur data dari request sampai response
4. External dependencies (database, cache, API eksternal)
5. Design patterns yang digunakan

Buat dokumentasi arsitektur di docs/ARCHITECTURE.md dengan:

## Arsitektur Sistem

### Overview Diagram (Mermaid)

\`\`\`mermaid
graph TB
    Client[Browser/Client] --> LB[Load Balancer]
    LB --> API[API Server]
    API --> Auth[Auth Service]
    API --> BL[Business Logic]
    BL --> DB[(Database)]
    BL --> Cache[(Redis Cache)]
    API --> Queue[Message Queue]
    Queue --> Worker[Background Worker]
    Worker --> DB
    Worker --> Email[Email Service]
\`\`\`

### Layer Architecture

Jelaskan tiap layer:
- **Presentation Layer**: Routes, controllers, middleware
- **Business Layer**: Services, validators, business rules
- **Data Layer**: Models, repositories, migrations

### Component Diagram

\`\`\`mermaid
graph LR
    subgraph API Server
        Routes --> Controllers
        Controllers --> Services
        Services --> Models
    end
    subgraph External
        Models --> DB[(PostgreSQL)]
        Services --> Cache[(Redis)]
        Services --> SMTP[Email SMTP]
    end
\`\`\`

### Data Flow

Jelaskan alur data untuk use case utama:
1. User login
2. Input data siswa
3. Generate laporan BOS
4. Export data ke Excel

### Design Decisions (ADR)

Buat Architecture Decision Records untuk keputusan penting:
- Kenapa pilih PostgreSQL vs MySQL?
- Kenapa pakai Express vs Fastify?
- Kenapa JWT vs session?
```

#### 3.2 Architecture Decision Records (ADR)

Template ADR yang bisa di-generate AI:

```
Buatkan Architecture Decision Record untuk keputusan berikut:

# ADR-001: Pemilihan Database PostgreSQL

**Status**: Accepted
**Tanggal**: 2026-04-15
**Konteks**: SD Negeri Pasirhalang butuh database untuk menyimpan data siswa, GTK, dan keuangan BOS

## Decision

Kami memilih PostgreSQL sebagai database utama.

## Alternatif yang Dipertimbangkan

1. **MySQL** — Populer, tapi kurang support untuk JSON queries
2. **SQLite** — Simple, tapi tidak cocok untuk multi-user concurrent access
3. **MongoDB** — Flexible schema, tapi data keuangan butuh ACID compliance

## Consequences

### Positive
- Full ACID compliance untuk transaksi keuangan
- Support JSONB untuk data Dapodik yang semi-struktur
- Full-text search untuk pencarian siswa/GTK
- Row-level security untuk multi-tenant
- Extension PostGIS untuk data geografis

### Negative
- Resource usage lebih tinggi dari MySQL
- Kurang developer yang familiar dibanding MySQL
- Backup/restore perlu tool khusus (pg_dump)

## Implementation

- PostgreSQL 15+ di production
- pgAdmin untuk admin GUI
- pg_dump untuk backup otomatis harian
- Connection pooling dengan PgBouncer
```

---

### Step 4: Inline Comments — Kapan dan Apa yang Harus Dikomentari

#### 4.1 Prinsip Inline Comments

```
┌────────────────────────────────────────────────────────────────────┐
│                    INLINE COMMENTS GUIDE                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  KAPAN HARUS COMMENT:                                              │
│  ─────────────────────                                             │
│  ✅ Complex business logic yang tidak obvious dari kode            │
│  ✅ Workaround untuk bug library/framework                         │
│  ✅ Decision yang tidak intuitif (kenapa pakai cara ini)          │
│  ✅ TODO/FIXME/HACK untuk technical debt                           │
│  ✅ Regular expression yang kompleks                               │
│  ✅ Algorithm yang tidak standar                                   │
│  ✅ Performance optimization yang tidak obvious                    │
│                                                                    │
│  KAPAN TIDAK PERLU COMMENT:                                        │
│  ─────────────────────────────                                     │
│  ❌ Menjelaskan apa yang kode lakukan (kode harus self-explain)   │
│  ❌ Comment yang redundant dengan nama fungsi                      │
│  ❌ Comment yang akan usang saat kode berubah                      │
│  ❌ Comment untuk kode yang sudah jelas                            │
│                                                                    │
│  FORMAT COMMENT YANG BAIK:                                         │
│  ─────────────────────────────                                     │
│  // WHY — Kenapa ini dilakukan, bukan apa yang dilakukan          │
│  // CONTEXT — Informasi tambahan yang tidak ada di kode           │
│  // REFERENCE — Link ke issue, doc, atau discussion               │
│  // TRADE-OFF — Kenapa pilih cara ini vs alternatif               │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### 4.2 Contoh Inline Comments yang Baik

```typescript
// ❌ BURUK — Menjelaskan apa yang sudah jelas dari kode
// Loop through users and get their names
const names = users.map(u => u.name);

// ✅ BAIK — Menjelaskan WHY dan CONTEXT
// NISN harus 10 digit sesuai standar Kemendikbud 2024
// Reference: https://dapo.kemdikbud.go.id/panduan/nisn
if (nisn.length !== 10) {
  throw new ValidationError('NISN harus 10 digit');
}

// ✅ BAIK — Menjelaskan workaround
// Workaround untuk bug di pg driver v3.2
// Issue: https://github.com/brianc/node-postgres/issues/2993
// TODO: Hapus setelah upgrade ke pg v3.3
const result = await client.query({
  text: sql,
  values: params,
  rowMode: 'array', // Bug fix: harus explicit
});

// ✅ BAIK — Menjelaskan trade-off
// Pakai polling instead of WebSocket karena:
// 1. Server tidak support WebSocket
// 2. Polling lebih reliable untuk koneksi unstable
// 3. Trade-off: latency lebih tinggi (2-5 detik)
const pollInterval = setInterval(checkStatus, 3000);

// ✅ BAIK — Complex regex dengan penjelasan
// Validasi format tanggal: YYYY-MM-DD atau DD/MM/YYYY
// Group 1: year atau day, Group 2: month, Group 3: day atau year
const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$|^(\d{2})\/(\d{2})\/(\d{4})$/;
```

#### 4.3 Auto-generate JSDoc dengan AI

```
@src/services/ Tambahkan JSDoc comments ke semua public functions.

Format JSDoc:
\`\`\`typescript
/**
 * [Deskripsi singkat apa fungsi ini lakukan]
 * 
 * [Deskripsi lebih detail jika perlu — jelaskan WHY bukan WHAT]
 * 
 * @param paramName - [Deskripsi parameter, termasuk constraint]
 * @param paramName2 - [Deskripsi parameter opsional, default value]
 * @returns [Deskripsi return value, termasuk edge cases]
 * @throws {ErrorType} [Kapan error ini dilempar]
 * @throws {ErrorType2} [Kapan error lain dilempar]
 * 
 * @example
 * \`\`\`typescript
 * const result = await functionName({
 *   param1: 'value',
 *   param2: 123,
 * });
 * // result = { status: 'success', data: [...] }
 * \`\`\`
 * 
 * @see {@link RelatedFunction} untuk fungsi terkait
 * @since 1.2.0
 */
\`\`\`

Constraints:
- JANGAN comment private/internal functions
- FOKUS pada public API yang akan dipakai developer lain
- INCLUDE contoh usage yang realistic
- MENTION edge cases dan error conditions
```

---

### Step 5: Commit Message dengan Conventional Commits

#### 5.1 Generate dari Git Diff

```
Lihat perubahan yang belum di-commit:
!git diff --staged

Berdasarkan perubahan di atas, buatkan commit message format Conventional Commits:

Aturan:
1. Format: <type>(<scope>): <description>
2. Type: feat, fix, docs, style, refactor, test, chore, perf, ci, build
3. Scope: nama modul/file yang diubah (opsional)
4. Description: max 50 karakter, imperative mood (add, fix, update)
5. Jika perubahan kompleks, tambahkan body yang jelaskan WHY bukan WHAT
6. Jika ada issue terkait, tambahkan footer: Closes #[nomor]

Contoh output yang diharapkan:
\`\`\`
feat(absensi): menambahkan validasi NISN 10 digit

NISN harus tepat 10 digit sesuai standar Kemendikbud.
Sebelumnya tidak ada validasi sehingga NISN 9 digit bisa masuk.

Closes #45
\`\`\`
```

#### 5.2 Multiple Commits dari Staged Changes

Jika ada perubahan besar yang sebaiknya dipecah jadi beberapa commit:

```
!git diff --staged --stat

Perubahan di atas terlalu besar untuk satu commit. Pecah jadi beberapa commit atomic:

1. Group perubahan berdasarkan logical unit (model, controller, test, docs)
2. Untuk setiap group, buat commit message yang sesuai
3. Tampilkan rencana commit untuk review sebelum execute

Format setiap commit:
\`\`\`
Commit 1:
  Files: src/models/siswa.ts, src/models/absensi.ts
  Message: feat(model): menambahkan model Siswa dan Absensi
  
Commit 2:
  Files: src/controllers/siswa.controller.ts
  Message: feat(controller): menambahkan CRUD endpoint siswa
  
Commit 3:
  Files: tests/siswa.test.ts
  Message: test(siswa): menambahkan unit test untuk CRUD siswa
\`\`\`
```

#### 5.3 Commit Message Reference Table

Referensi lengkap type dan kapan menggunakannya:

| Type | Kapan Digunakan | Contoh |
|------|-----------------|--------|
| `feat` | Fitur baru yang visible oleh user | `feat(absensi): endpoint input kehadiran` |
| `fix` | Bug fix | `fix(login): error 500 saat password salah` |
| `docs` | Dokumentasi saja | `docs(api): update endpoint absensi` |
| `style` | Format kode, tidak ubah logic | `style(absensi): prettier formatting` |
| `refactor` | Ubah struktur tanpa ubah behavior | `refactor(auth): extract JWT ke separate module` |
| `perf` | Performance improvement | `perf(query): optimasi laporan dengan index` |
| `test` | Test related | `test(absensi): edge case tanggal libur` |
| `chore` | Maintenance, dependency, tooling | `chore(deps): update express ke 4.19` |
| `ci` | CI/CD configuration | `ci(github): tambah workflow deploy staging` |
| `build` | Build system, webpack, vite | `build(vite): konfigurasi multi-page app` |

#### 5.4 Breaking Changes Convention

Untuk perubahan yang tidak backward compatible:

```
feat(auth): mengganti JWT secret rotation strategy

BREAKING CHANGE: JWT secret sekarang di-rotate setiap 24 jam.
Token yang dibuat sebelum perubahan ini akan invalid.

Migration guide:
1. Update semua client untuk handle 401 Unauthorized
2. Implement token refresh flow
3. Clear local storage token lama

Closes #123
```

---

### Step 6: PR Description Generator

#### 6.1 Generate dari Commit History

```
!git log --oneline main..HEAD

Berdasarkan commit history di atas, buatkan PR description lengkap:

## Ringkasan
[1-2 kalimat yang menjelaskan apa PR ini dan kenapa diperlukan]

## Perubahan
[Detail perubahan per modul/file]

### Backend
- `src/controllers/absensi.ts` — CRUD endpoint
- `src/services/absensi.service.ts` — Business logic
- `src/middleware/validation.ts` — Input validation

### Frontend
- `src/pages/AbsensiList.tsx` — Halaman list
- `src/components/AbsensiForm.tsx` — Form input

### Database
- `migrations/001_create_absensi.sql` — Schema baru

### Test
- `tests/absensi.test.ts` — Unit test (12 test cases)
- `tests/absensi.validation.test.ts` — Validation test

## Testing
\`\`\`bash
npm test                    # Semua test
npm test -- absensi         # Test spesifik modul
npm run test:coverage       # Coverage report
\`\`\`

## Screenshots
| Sebelum | Sesudah |
|---------|---------|
| [image] | [image] |

## Checklist
- [ ] Code mengikuti project conventions
- [ ] Test coverage > 80% untuk perubahan baru
- [ ] Dokumentasi API diupdate
- [ ] Tidak ada console.log/debug code
- [ ] Error handling untuk semua edge case
- [ ] Input validation untuk semua user input
- [ ] Security review (SQL injection, XSS, auth bypass)

## Breaking Changes
[Tidak ada / Jelaskan breaking changes jika ada]

## Related Issues
Closes #45
Refs #67, #89
```

#### 6.2 PR Description untuk Proyek Sekolah

```
Buatkan PR description untuk perubahan di proyek administrasi sekolah:

## Ringkasan
Update data Dapodik semester genap 2025/2026 dan perbaikan perhitungan saldo BOS.

## Perubahan

### Data Dapodik
- Update data peserta didik (mutasi masuk: 2 siswa, mutasi keluar: 1 siswa)
- Update data GTK (1 guru baru, 1 pensiun)
- Update data sarpras (penambahan 10 unit komputer)

### Keuangan BOS
- Fix perhitungan saldo: sekarang menggunakan CASE WHEN untuk membedakan pemasukan dan pengeluaran
- Sebelumnya: `SELECT SUM(jumlah)` — salah karena tidak membedakan jenis transaksi
- Sesudah: `SELECT SUM(CASE WHEN jenis='Pemasukan' THEN jumlah ELSE -jumlah END)`

### Surat-menyurat
- Tambah template surat keterangan siswa pindah
- Tambah template surat pengantar BOS

## Validasi
- [ ] Data Dapodik sudah divalidasi dengan server pusat
- [ ] Saldo BOS sesuai dengan buku kas umum
- [ ] Template surat sudah direview oleh kepala sekolah
- [ ] Backup data sebelum update

## Related
- RKAS Perubahan Semester 2
- LPJ BOS Semester 1
```

---

### Step 7: Changelog Management

#### 7.1 Auto-generate CHANGELOG.md

```
!git log --oneline v1.0.0..HEAD

Generate CHANGELOG.md dari commit history:

Format mengikuti Keep a Changelog (https://keepachangelog.com):

\`\`\`markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Fitur baru dari commit feat
- Endpoint baru

### Changed
- Perubahan behavior dari commit fix/refactor

### Deprecated
- Fitur yang akan dihapus di versi berikutnya

### Removed
- Fitur yang sudah dihapus

### Fixed
- Bug fix dari commit fix

### Security
- Vulnerability fix

## [1.0.0] - 2026-04-15

### Added
- CRUD absensi siswa
- Export laporan ke Excel
- Template surat otomatis

### Fixed
- Perhitungan saldo BOS yang salah
- Validasi NISN 10 digit
\`\`\`

Kelompokkan commit berdasarkan type:
- feat → Added
- fix → Fixed
- refactor → Changed
- perf → Changed
- chore → (biasanya tidak masuk changelog, kecuali breaking)
- security → Security
```

#### 7.2 Changelog dengan Semantic Versioning

```
Analisis perubahan sejak versi terakhir dan tentukan version bump:

Aturan Semantic Versioning (MAJOR.MINOR.PATCH):
- MAJOR: Breaking changes (API berubah, backward incompatible)
- MINOR: Fitur baru (backward compatible)
- PATCH: Bug fix (backward compatible)

Berdasarkan commit history:
- Ada 3 feat commits → MINOR bump
- Ada 5 fix commits → sudah termasuk di MINOR
- Ada 0 breaking changes → bukan MAJOR

Versi baru: 1.1.0 (dari 1.0.0)

Generate release notes untuk versi 1.1.0:
\`\`\`markdown
## [1.1.0] - 2026-04-20

### Added
- Export laporan BOS ke PDF dengan template resmi
- Filter absensi berdasarkan rentang tanggal
- Notifikasi email untuk absensi siswa tidak hadir 3 hari berturut-turut

### Changed
- Optimasi query laporan (50% lebih cepat)
- Update validasi NISN sesuai standar terbaru Kemendikbud

### Fixed
- Perhitungan saldo BOS yang salah pada transaksi berulang
- Error 500 saat upload foto siswa > 2MB
- Timezone tidak konsisten antara server dan database
\`\`\`
```

#### 7.3 Automated Changelog dengan Tools

```yaml
# .github/workflows/changelog.yml
name: Update Changelog

on:
  push:
    tags:
      - 'v*'

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Generate changelog
        uses: requarks/changelog-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          tag: ${{ github.ref_name }}
          writeToFile: true

      - name: Commit changelog
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add CHANGELOG.md
          git commit -m "docs(changelog): update for ${{ github.ref_name }}"
          git push
```

---

### Step 8: Onboarding Documentation

#### 8.1 Developer Onboarding Guide

```
Buatkan dokumen ONBOARDING.md untuk developer baru yang bergabung:

# Developer Onboarding Guide

> Panduan untuk developer baru agar bisa mulai berkontribusi dalam 1 hari.

## 📋 Prerequisites

Pastikan sudah terinstall:
- [ ] Node.js 18+ (`node -v`)
- [ ] PostgreSQL 14+ (`psql --version`)
- [ ] Git (`git --version`)
- [ ] VS Code atau editor pilihan
- [ ] Docker (opsional, untuk development environment)

## 🚀 Setup Project (30 menit)

### 1. Clone dan Install

\`\`\`bash
git clone https://github.com/sekolah/admin-system.git
cd admin-system
npm install
\`\`\`

### 2. Setup Environment

\`\`\`bash
cp .env.example .env
# Edit .env:
# - DATABASE_URL=postgresql://localhost:5432/admin_db
# - JWT_SECRET=generate-random-string
# - PORT=3000
\`\`\`

### 3. Setup Database

\`\`\`bash
# Buat database
createdb admin_db

# Jalankan migrasi
npm run db:migrate

# Seed data dummy
npm run db:seed
\`\`\`

### 4. Start Development Server

\`\`\`bash
npm run dev
# Server running at http://localhost:3000
\`\`\`

### 5. Verifikasi

Buka http://localhost:3000/health — harus return `{"status": "ok"}`

## 📁 Struktur Proyek

\`\`\`
admin-system/
├── src/
│   ├── controllers/    # Request handlers (input → validate → call service → respond)
│   ├── services/       # Business logic (aturan bisnis, perhitungan)
│   ├── models/         # Database models (Prisma/TypeORM entities)
│   ├── middleware/     # Express middleware (auth, logging, error)
│   ├── routes/         # Route definitions (URL → controller mapping)
│   └── utils/          # Helper functions (format date, generate PDF)
├── tests/              # Test files (mirror struktur src/)
├── migrations/         # Database migrations
├── docs/               # Dokumentasi
└── scripts/            # Utility scripts
\`\`\`

## 🏗️ Arsitektur

Request flow:
\`\`\`
Client → Route → Middleware (auth) → Controller → Service → Model → Database
                                                        ↓
Response ← Controller ← Service ← Validation ← Model ← Database
\`\`\`

## 📝 Coding Conventions

### Naming
- File: `kebab-case.ts`
- Class: `PascalCase`
- Function: `camelCase`
- Constant: `UPPER_SNAKE_CASE`

### Commit Messages
Format: `<type>(<scope>): <description>`
\`\`\`bash
feat(absensi): tambah endpoint input kehadiran
fix(bos): fix perhitungan saldo
docs(api): update dokumentasi endpoint absensi
\`\`\`

### Code Style
- ESLint + Prettier sudah dikonfigurasi
- Jalankan `npm run lint` sebelum commit
- Max line length: 100 karakter

## 🧪 Testing

\`\`\`bash
npm test                    # Run semua test
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
\`\`\`

Test file naming: `[nama-file].test.ts`
Test location: `tests/` (mirror struktur `src/`)

## 🔄 Workflow Harian

1. Pull latest dari main: `git pull origin main`
2. Buat branch untuk task: `git checkout -b feat/nama-task`
3. Kerjakan perubahan
4. Test: `npm test`
5. Lint: `npm run lint`
6. Commit: `/commit` (AI generate message)
7. Push: `git push origin feat/nama-task`
8. Buat PR

## 🆘 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `ECONNREFUSED` database | Pastikan PostgreSQL running: `pg_ctl status` |
| Port 3000 sudah dipakai | Edit `PORT` di `.env` atau kill proses di port 3000 |
| Migration error | Drop dan recreate: `npm run db:reset` |
| Test gagal | Cek `.env` — variabel `DATABASE_URL` harus benar |

## 📞 Kontak

- Tech Lead: [nama] — [email]
- Repository: [link GitHub]
- Slack/Discord: [link channel]
```

#### 8.2 Operator Sekolah Onboarding

```
Buatkan ONBOARDING-OPERATOR.md untuk operator sekolah baru:

# Onboarding Operator SD Negeri Pasirhalang

> Panduan lengkap untuk operator baru agar bisa menjalankan tugas administrasi sekolah.

## 📋 Tugas Utama Operator

1. **Input Data Dapodik** — Data siswa, guru, sarpras, rombel
2. **Kelola Keuangan BOS** — Perencanaan, realisasi, pelaporan
3. **Surat-menyurat** — Buat surat keterangan, pengantar, dll
4. **Absensi** — Input kehadiran siswa dan guru
5. **Laporan** — Generate laporan berkala

## 🔐 Akses Aplikasi

| Aplikasi | URL | Username | Password |
|----------|-----|----------|----------|
| Dapodik Web | https://dapo.kemdikbud.go.id | NPSN | [dari kepala sekolah] |
| ARKAS | https://arkas.kemdikbud.go.id | NPSN | [dari kepala sekolah] |
| BOS Online | https://bos.kemdikbud.go.id | NPSN | [dari kepala sekolah] |
| Admin System | http://localhost:3000 | admin | [dari IT] |

## 📅 Jadwal Rutin

| Kegiatan | Frekuensi | Deadline |
|----------|-----------|----------|
| Update Dapodik | Setiap ada perubahan | Real-time |
| Input realisasi BOS | Setiap transaksi | 1x seminggu |
| Absensi siswa | Setiap hari | Sebelum jam 10:00 |
| Laporan bulanan | Setiap bulan | Tanggal 5 bulan berikutnya |
| LPJ BOS | Setiap semester | Sesuai jadwal Kemendikbud |

## 📚 Referensi

- Panduan Dapodik: [link]
- Panduan ARKAS: [link]
- Panduan BOS: [link]
- Template surat: `/docs/templates/`

## 🆘 Jika Ada Masalah

1. Masalah teknis → Hubungi IT support
2. Masalah data → Hubungi koordinator Dapodik kecamatan
3. Masalah BOS → Hubungi Kasi Keuangan Dinas Pendidikan
```

---

### Step 9: Knowledge Base Creation

#### 9.1 Auto-generate dari Kodebase

```
Buatkan knowledge base dari analisis kodebase ini.

Baca semua file di src/, docs/, dan konfigurasi.

Generate KNOWLEDGE-BASE.md dengan:

## 📚 Knowledge Base — [Nama Proyek]

### Modul dan Fungsi

Untuk setiap modul utama:

#### Modul: [Nama Modul]
**File**: `src/[path]`
**Tanggung Jawab**: [Apa yang modul ini lakukan]
**Dependencies**: [Modul lain yang dibutuhkan]

**Fungsi Utama**:
| Fungsi | Deskripsi | Input | Output |
|--------|-----------|-------|--------|
| `createSiswa()` | Buat data siswa baru | NISN, nama, kelas | Siswa object |
| `getSiswaById()` | Ambil data siswa by ID | UUID siswa | Siswa object |
| `updateSiswa()` | Update data siswa | UUID, data baru | Updated siswa |

**Business Rules**:
1. NISN harus unik dan 10 digit
2. Kelas harus antara 1-6
3. Tanggal lahir tidak boleh di masa depan

### Pola dan Konvensi

#### Error Handling Pattern
\`\`\`typescript
try {
  const result = await service.doSomething(data);
  return res.json({ status: 'success', data: result });
} catch (error) {
  if (error instanceof ValidationError) {
    return res.status(400).json({ status: 'error', error: error.message });
  }
  if (error instanceof NotFoundError) {
    return res.status(404).json({ status: 'error', error: 'Not found' });
  }
  logger.error(error);
  return res.status(500).json({ status: 'error', error: 'Internal error' });
}
\`\`\`

#### Database Pattern
- Semua query pakai parameterized queries (anti SQL injection)
- Transaction untuk operasi yang melibatkan multiple tables
- Soft delete dengan `deleted_at` column

### FAQ

**Q: Bagaimana cara menambah endpoint baru?**
A: 1. Buat route di `src/routes/`, 2. Buat controller di `src/controllers/`, 3. Buat service di `src/services/`, 4. Tambah test di `tests/`

**Q: Bagaimana cara deploy ke production?**
A: Jalankan `npm run deploy` atau push ke branch `main` (auto-deploy via CI/CD)

**Q: Bagaimana cara backup database?**
A: Jalankan `npm run db:backup` atau `pg_dump admin_db > backup.sql`

### Decision Log

| Tanggal | Keputusan | Alasan |
|---------|-----------|--------|
| 2026-01-15 | Pakai PostgreSQL | ACID compliance untuk transaksi BOS |
| 2026-02-01 | Pakai JWT auth | Stateless, cocok untuk API |
| 2026-03-10 | Soft delete | Data sekolah tidak boleh dihapus permanen |
```

#### 9.2 Knowledge Base untuk Tim Sekolah

```
Buatkan knowledge base khusus untuk tim administrasi sekolah:

## 📚 Knowledge Base Administrasi SD Negeri Pasirhalang

### Data Dapodik

#### Peserta Didik (PD)
**Data yang perlu diisi:**
- NISN (10 digit, wajib)
- Nama lengkap (sesuai akta kelahiran)
- Tempat, tanggal lahir
- Jenis kelamin
- Agama
- Alamat lengkap
- Nama orang tua/wali
- No. KK, NIK
- Tinggi/berat badan
- Jarak rumah ke sekolah

**Sumber data:**
- Akta kelahiran
- Kartu Keluarga
- Surat keterangan lahir

#### GTK (Guru dan Tenaga Kependidikan)
**Data yang perlu diisi:**
- NIP (untuk PNS) atau NUPTK
- Nama lengkap (sesuai SK)
- NUPTK (16 digit)
- Tempat, tanggal lahir
- Pendidikan terakhir
- Status kepegawaian (PNS/PTT/Honor)
- Mata pelajaran yang diampu
- Sertifikasi (ya/tidak, tahun)

**Sumber data:**
- SK CPNS/PNS
- SK Pengangkatan
- Ijazah
- Sertifikat pendidik

### Keuangan BOS

#### Alur Perencanaan
\`\`\`
1. Identifikasi kebutuhan sekolah
2. Input ke RKAS (Rencana Kegiatan dan Anggaran Sekolah)
3. Submit ke server ARKAS
4. Verifikasi oleh pengawas
5. Approval oleh Dinas Pendidikan
6. Pencairan dana ke rekening sekolah
\`\`\`

#### Komponen Pembiayaan BOS
| No | Komponen | Persentase Maks |
|----|----------|-----------------|
| 1 | Pengembangan perpustakaan | 20% |
| 2 | Kegiatan pembelajaran & ekstrakurikuler | 30% |
| 3 | Kegiatan asesmen & evaluasi | 15% |
| 4 | Administrasi kegiatan sekolah | 15% |
| 5 | Pengembangan profesi guru | 10% |
| 6 | Langganan daya & jasa | 15% |
| 7 | Pemeliharaan sarana prasarana | 20% |
| 8 | Pembayaran honor | 50% |
| 9 | Pengembangan manajemen sekolah | 10% |

#### Bukti Realisasi yang Harus Disimpan
- Kwitansi/faktur pembelian
- Berita acara serah terima barang
- Surat perjanjian/kontrak (jika ada)
- Dokumentasi kegiatan (foto)
- Daftar hadir
- Laporan pelaksanaan

### Surat-menyurat

#### Template Surat yang Tersedia
1. Surat Keterangan Siswa Aktif
2. Surat Keterangan Tidak Mampu
3. Surat Pengantar Pindah Sekolah
4. Surat Undangan Rapat Komite
5. Surat Permohonan Dana BOS
6. Surat Laporan Bulanan

#### Format Surat Resmi
\`\`\`
KOP SURAT SEKOLAH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SURAT KETERANGAN
Nomor: 422.1/___/SDN-PH/2026

Yang bertanda tangan di bawah ini:
  Nama    : [Nama Kepala Sekolah]
  Jabatan : Kepala SD Negeri Pasirhalang
  NIP     : [NIP]

Memberikan keterangan bahwa:
  Nama    : [Nama Siswa]
  NISN    : [NISN]
  Kelas   : [Kelas]

Adalah benar siswa aktif di SD Negeri Pasirhalang.

Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.

[Mandalamukti, Tanggal]
Kepala Sekolah,

[Nama Kepala Sekolah]
NIP. [NIP]
\`\`\`
```

---

### Step 10: Dokumentasi Maintenance

#### 10.1 Dokumentasi yang Perlu Diupdate Setiap Ada Perubahan

Buat reminder dan workflow untuk menjaga dokumentasi tetap update:

```
Buatkan DOKUMENTASI-MAINTENANCE.md:

# Dokumentasi Maintenance Guide

## 🔄 Kapan Update Dokumentasi

| Trigger | Dokumentasi yang Perlu Diupdate |
|---------|--------------------------------|
| Endpoint baru/berubah | API docs, README, OpenAPI spec |
| Fitur baru | README, Changelog, Onboarding guide |
| Bug fix signifikan | Changelog, FAQ |
| Perubahan arsitektur | Architecture docs, ADR |
| Dependency update | README (prerequisites), Changelog |
| Breaking change | Changelog, Migration guide, README |
| Proses baru | Onboarding guide, Knowledge base |

## 📋 Checklist Update Dokumentasi

Setiap kali membuat PR, check:

- [ ] README masih akurat (fitur, quick start, config)
- [ ] API docs mencakup endpoint yang diubah
- [ ] Changelog mencatat perubahan ini
- [ ] Architecture docs masih valid (jika ada perubahan arsitektur)
- [ ] Onboarding guide masih bisa diikuti step-by-step
- [ ] Knowledge base mencakup pattern/konsep baru

## 🤖 Automasi Dokumentasi

### Pre-commit Hook: Cek Dokumentasi
\`\`\`bash
#!/bin/bash
# .git/hooks/pre-commit

# Cek jika ada perubahan di src/ tapi tidak di docs/
if git diff --cached --name-only | grep -q "^src/" ; then
  if ! git diff --cached --name-only | grep -q "^docs/" ; then
    echo "⚠️  Perubahan di src/ tanpa update docs/"
    echo "   Pertimbangkan untuk update dokumentasi terkait"
  fi
fi
\`\`\`

### CI Check: Validasi Dokumentasi
\`\`\`yaml
# .github/workflows/docs-check.yml
name: Documentation Check
on: [pull_request]
jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check README exists
        run: test -f README.md
      - name: Check CHANGELOG updated
        run: grep -q "Unreleased" CHANGELOG.md
      - name: Validate OpenAPI spec
        run: npx swagger-cli validate docs/openapi.yaml
\`\`\`

## 📅 Review Dokumentasi Berkala

**Setiap Sprint (2 minggu):**
- Review README dan API docs
- Update changelog untuk release

**Setiap Bulan:**
- Review onboarding guide (test dari awal)
- Update knowledge base dengan pelajaran baru

**Setiap Quarter:**
- Review architecture docs
- Audit semua dokumentasi untuk akurasi
- Hapus dokumentasi yang sudah usang
```

#### 10.2 Documentation as Code

Pendekatan "documentation as code" — dokumentasi dikelola sama seperti kode:

```
Terapkan Documentation as Code workflow:

## Prinsip Documentation as Code

1. **Dokumentasi di version control** — Semua docs di Git repo
2. **Review melalui PR** — Perubahan docs di-review sama seperti kode
3. **CI/CD untuk docs** — Build, validate, deploy docs otomatis
4. **Dokumentasi dekat dengan kode** — Docstrings, JSDoc di file yang sama
5. **Auto-generate sebisa mungkin** — Kurangi manual writing

## Struktur Dokumentasi

\`\`\`
proyek/
├── README.md                    # Entry point
├── CHANGELOG.md                 # Version history
├── CONTRIBUTING.md              # Panduan kontribusi
├── docs/
│   ├── API.md                   # API documentation
│   ├── ARCHITECTURE.md          # Architecture docs
│   ├── ONBOARDING.md            # Developer onboarding
│   ├── KNOWLEDGE-BASE.md        # Knowledge base
│   ├── ADR/                     # Architecture Decision Records
│   │   ├── 001-database.md
│   │   ├── 002-auth.md
│   │   └── 003-caching.md
│   └── guides/
│       ├── getting-started.md
│       ├── deployment.md
│       └── troubleshooting.md
├── src/
│   ├── controllers/             # Inline JSDoc
│   ├── services/                # Inline JSDoc
│   └── models/                  # Inline docstrings
└── .github/
    └── workflows/
        └── docs.yml             # CI untuk dokumentasi
\`\`\`

## CI/CD untuk Dokumentasi

\`\`\`yaml
# .github/workflows/docs.yml
name: Build & Deploy Docs
on:
  push:
    branches: [main]
    paths: ['docs/**', 'README.md', 'CHANGELOG.md']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build docs
        run: |
          npm install
          npm run docs:build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs-dist
\`\`\`
```

---

### Step 11: Git Workflow dengan AI

#### 11.1 Branch Strategy

GitHub Flow adalah yang paling cocok untuk AI-assisted development:

```
main ─────────────────────────────────────────────────────────
      \           \              \              \
       \           \              \              \
        feat/absensi fix/login    docs/api       chore/deps
              \           \              \              \
               PR ──────── PR ────────── PR ────────── PR
                 \           \              \              \
                  merge ───── merge ──────── merge ──────── merge

Branch naming convention:
  feat/     → Fitur baru
  fix/      → Bug fix
  docs/     → Dokumentasi
  chore/    → Maintenance
  refactor/ → Refactoring
  test/     → Test related
  perf/     → Performance
  ci/       → CI/CD
```

#### 11.2 Git Flow untuk Tim Besar

Untuk tim yang lebih besar, Git Flow lebih cocok:

```
main (production) ─────────────────────────────────────────────
      \               \                    \
       \               \                    \
        develop ────────┐                   \
              \          \                   \
               feat/A ──── PR ── merge ──────┐
               feat/B ──── PR ── merge ──────┤
               fix/C ───── PR ── merge ──────┼── release/v1.1 ── PR ── merge ── main
                                             │
                                             └── hotfix/D ── PR ── merge ── main + develop

Aturan:
- main: selalu stable, production-ready
- develop: integration branch untuk fitur
- feat/*: branch fitur dari develop
- fix/*: branch bug fix dari develop
- release/*: persiapan release dari develop
- hotfix/*: fix urgent dari main
```

#### 11.3 AI-Assisted Git Commands

```
# Lihat perubahan sebelum commit
!git diff

# Lihat perubahan yang sudah staged
!git diff --staged

# Lihat statistik perubahan
!git diff --staged --stat

# Lihat commit history
!git log --oneline -20

# Lihat history dengan graph
!git log --oneline --graph -20

# Lihat siapa yang mengubah file
!git blame src/controllers/siswa.ts

# Lihat perubahan per file
!git log --oneline --follow -- src/controllers/siswa.ts

# Undo perubahan terakhir (butuh Git repo)
/undo

# Lihat branch yang ada
!git branch -a

# Lihat status repository
!git status

# Lihat remote repositories
!git remote -v
```

#### 11.4 Workflow Lengkap: Dari Coding sampai Merge

```
## AI-Assisted Git Workflow

### 1. Mulai Task Baru
\`\`\`bash
git checkout main
git pull origin main
git checkout -b feat/nama-fitur
\`\`\`

### 2. Kerjakan dengan AI
- Minta AI implementasi fitur
- AI buat perubahan di file
- Review perubahan: `!git diff`

### 3. Stage dan Commit
\`\`\`bash
git add .
/commit  # AI generate conventional commit message
\`\`\`

### 4. Push dan Buat PR
\`\`\`bash
git push origin feat/nama-fitur
gh pr create --title "feat: [deskripsi]" --body "[AI generate]"
\`\`\`

### 5. AI Review PR
\`\`\`
@code-reviewer Review PR #[nomor]
\`\`\`

### 6. Fix Review Comments
- AI fix issue yang ditemukan reviewer
- Commit fix: `/commit`
- Push: `git push`

### 7. Merge
\`\`\`bash
gh pr merge --squash --delete-branch
\`\`\`

### 8. Update Changelog
\`\`\`
!git log --oneline v1.0.0..HEAD
Generate changelog entry untuk versi baru
\`\`\`
```

#### 11.5 Git Hooks untuk Automasi

```bash
#!/bin/bash
# .husky/pre-commit
# Automasi pre-commit dengan AI assistance

echo "🔍 Running pre-commit checks..."

# 1. Lint
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Lint failed"
  exit 1
fi

# 2. Type check
npx tsc --noEmit
if [ $? -ne 0 ]; then
  echo "❌ Type check failed"
  exit 1
fi

# 3. Test
npm test -- --findRelatedTests $(git diff --cached --name-only --diff-filter=ACM)
if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

# 4. Check commit message format
COMMIT_MSG=$(cat $1)
if ! echo "$COMMIT_MSG" | grep -qE "^(feat|fix|docs|style|refactor|perf|test|chore|ci|build)(\(.+\))?: .+"; then
  echo "❌ Commit message tidak mengikuti Conventional Commits"
  echo "Format: <type>(<scope>): <description>"
  exit 1
fi

# 5. Check dokumentasi
if git diff --cached --name-only | grep -q "^src/" ; then
  if ! git diff --cached --name-only | grep -q "^docs/" ; then
    echo "⚠️  Warning: Perubahan di src/ tanpa update docs/"
  fi
fi

echo "✅ All pre-commit checks passed"
```

---

## 📋 Magic Prompt Templates

### Template 1: Full Documentation Generator

```
## Role
Technical writer senior dengan pengalaman 10+ tahun mendokumentasikan software.

## Task
Generate dokumentasi lengkap untuk proyek ini.

## Input
- Path proyek: [path]
- Tech stack: [stack]
- Target audience: [developer/user/operator]

## Output yang Dihasilkan
1. README.md — Overview, quick start, fitur, config
2. docs/API.md — API documentation lengkap
3. docs/ARCHITECTURE.md — Architecture + diagram
4. docs/ONBOARDING.md — Developer onboarding guide
5. CHANGELOG.md — Version history
6. CONTRIBUTING.md — Panduan kontribusi
7. docs/KNOWLEDGE-BASE.md — Knowledge base

## Constraints
- ✅ Semua command copy-paste runnable
- ✅ Diagram pakai Mermaid
- ✅ Contoh kode dalam bahasa proyek
- ✅ Bahasa Indonesia untuk deskripsi, English untuk technical terms
- ❌ Jangan generate dokumentasi yang tidak bisa diverifikasi
```

### Template 2: Documentation Update Checker

```
## Role
Documentation auditor.

## Task
Cek apakah dokumentasi proyek masih akurat.

## Input
- Bandingkan docs/ dengan src/
- Cek README.md vs actual features
- Cek API docs vs actual endpoints

## Output
Laporan dengan format:
| Dokumen | Status | Masalah | Rekomendasi |
|---------|--------|---------|-------------|
| README.md | ✅ Akurat | - | - |
| API.md | ⚠️ Usang | 2 endpoint baru tidak terdokumentasi | Tambahkan endpoint X, Y |
| ARCHITECTURE.md | ❌ Tidak akurat | Diagram tidak include Redis | Update diagram |

## Constraints
- ✅ Cek setiap endpoint di routes vs docs
- ✅ Cek setiap env var di .env.example vs README
- ✅ Cek setiap dependency di package.json vs README
```

### Template 3: Commit Message Generator

```
## Role
Git expert yang enforce Conventional Commits standar.

## Task
Generate commit message dari staged changes.

## Input
- !git diff --staged
- !git diff --staged --stat

## Output
Commit message format:
\`\`\`
<type>(<scope>): <description>

[Optional body: WHY bukan WHAT]

[Optional footer: Closes #issue]
\`\`\`

## Constraints
- ✅ Type sesuai perubahan (feat/fix/docs/refactor/etc)
- ✅ Description max 50 karakter, imperative mood
- ✅ Body jelaskan motivasi, bukan implementasi
- ✅ Footer link ke issue jika ada
- ✅ Atomic commit (satu logical change)
```

---

## ✅ Checklist

### Dokumentasi Dasar
- [ ] Generate README.md profesional
- [ ] README mencakup quick start yang runnable
- [ ] README mencakup semua konfigurasi
- [ ] README mencakup struktur proyek

### API Documentation
- [ ] Semua endpoint terdokumentasi
- [ ] Request/response examples lengkap
- [ ] Authentication documented
- [ ] Error codes documented
- [ ] OpenAPI spec generated (opsional)

### Architecture Documentation
- [ ] Architecture diagram (Mermaid)
- [ ] Component diagram
- [ ] Data flow untuk use case utama
- [ ] Architecture Decision Records (ADR)

### Code Documentation
- [ ] JSDoc/docstrings untuk public functions
- [ ] Inline comments untuk complex logic
- [ ] README untuk setiap modul besar
- [ ] Self-documenting code (naming, structure)

### Git & Version Control
- [ ] AI generate commit message (Conventional Commits)
- [ ] Commit atomic (satu logical change per commit)
- [ ] PR description lengkap
- [ ] CHANGELOG.md terupdate
- [ ] Semantic versioning diterapkan
- [ ] Branch strategy documented
- [ ] Git hooks untuk automasi

### Onboarding & Knowledge
- [ ] Developer onboarding guide
- [ ] Operator onboarding guide (jika applicable)
- [ ] Knowledge base dari kodebase
- [ ] FAQ section

### Maintenance
- [ ] Dokumentasi maintenance guide
- [ ] CI check untuk dokumentasi
- [ ] Review dokumentasi berkala
- [ ] Documentation as code workflow

---

## ⚠️ Pitfalls

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| README tidak akurat | AI analisis tidak lengkap | Pakai `@explore` dulu sebelum generate |
| API docs usang | Tidak regenerate setelah update endpoint | CI auto-generate API docs dari kode |
| Commit message terlalu generic | Tidak specify format | Minta Conventional Commits dengan aturan jelas |
| `/undo` tidak jalan | Bukan Git repo atau tidak ada commit | `git init` dan commit dulu |
| Onboarding guide tidak bisa diikuti | Step tidak di-test | Test dari fresh environment |
| Changelog lupa update | Tidak ada reminder | Pre-commit hook atau CI check |
| Architecture diagram tidak update | Manual drawing | Auto-generate dari kode dengan Mermaid |
| Dokumentasi terlalu panjang | Tidak ada batasan | Set max length, gunakan progressive disclosure |
| JSDoc tidak konsisten | Tidak ada standar | Buat template JSDoc, enforce di code review |
| Knowledge base tidak pernah dibaca | Tidak ada struktur | Buat index, search, dan tag yang jelas |
| Comment usang | Kode berubah, comment tidak | Comment WHY bukan WHAT, update saat code review |
| Git conflict sering | Branch tidak update dari main | `git rebase main` sebelum push |
| PR terlalu besar | Tidak atomic commit | Pecah jadi multiple PR kecil |

---

## 📝 Ringkasan

1. **Dokumentasi berlapis** — README, API docs, architecture docs, inline comments, changelog, onboarding, knowledge base
2. **AI bisa generate 60-90%** dokumentasi, sisanya butuh konteks manusia
3. **Conventional Commits** standar untuk commit message yang konsisten
4. **PR description otomatis** dari commit history + diff analysis
5. **Changelog auto-generate** dari git log dengan Keep a Changelog format
6. **Onboarding guide** bisa di-generate dari setup scripts dan kodebase
7. **Knowledge base** dibangun dari analisis pola dan konvensi kode
8. **Documentation as code** — kelola docs sama seperti kode (version control, PR review, CI/CD)
9. **Maintenance rutin** — review dan update dokumentasi secara berkala
10. **Git workflow** — branch strategy, atomic commits, AI-assisted review
11. **Self-documenting code** — prioritas utama, comment hanya untuk WHY dan complex logic
12. **Inline comments** — jelaskan alasan, bukan apa yang kode lakukan
13. **Git hooks** — automasi pre-commit checks dan documentation validation
14. **Semantic versioning** — MAJOR.MINOR.PATCH berdasarkan jenis perubahan

---

> **Lanjut ke:** [`06-cicd-integration.md`](./06-cicd-integration.md)