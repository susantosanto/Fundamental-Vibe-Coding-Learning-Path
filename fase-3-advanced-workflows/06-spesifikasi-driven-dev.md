# 06 — Spec-Driven Development

> **Estimasi:** 1 jam | **Level:** Menengah
> **Sumber:** [`feiskyer/claude-code-settings — spec-kit-skill`](https://github.com/feiskyer/claude-code-settings/tree/main/skills/spec-kit-skill), [`analyticalrohit/awesome-vibe-coding-guide`](https://github.com/analyticalrohit/awesome-vibe-coding-guide)

---

## 📖 TEORI

### Apa itu Spec-Driven Development?

**Spec-driven development** adalah pendekatan pengembangan perangkat lunak di mana Anda **menulis spesifikasi secara lengkap dan terstruktur terlebih dahulu**, baru kemudian AI menulis kode berdasarkan spesifikasi tersebut. Ini merupakan kebalikan dari pendekatan "langsung coding" yang umum dilakukan dalam vibe coding konvensional.

Dalam konteks vibe coding, spec-driven development menjadi **force multiplier** karena:

1. **Mengurangi hallucination** — AI memiliki batasan yang jelas tentang apa yang harus dibuat
2. **Memastikan konsistensi** — Semua bagian kode mengikuti kontrak yang sama
3. **Memudahkan review** — Spesifikasi bisa direview sebelum kode ditulis
4. **Mempercepat iterasi** — Mengubah spesifikasi lebih cepat daripada mengubah kode
5. **Dokumentasi otomatis** — Spesifikasi本身就是 dokumentasi yang selalu up-to-date

### Mengapa Spec-Driven Penting dalam Vibe Coding?

Dalam vibe coding tradisional, developer cenderung langsung memberikan prompt ke AI dan menerima kode hasilnya. Pendekatan ini memiliki beberapa masalah:

```
❌ Tanpa Spec:
User: "Buatkan API absensi sekolah"
AI: [Membuat kode dengan asumsi sendiri]
     - Database schema? AI tebak sendiri
     - Endpoint structure? AI putuskan sendiri
     - Error handling? AI tentukan sendiri
     - Authentication? AI pilih sendiri
Hasil: Kode mungkin tidak sesuai kebutuhan
```

```
✅ Dengan Spec:
User: "Buatkan API absensi sekolah"
AI: [Meminta spesifikasi dulu]
User: [Menulis spec lengkap]
AI: [Membuat kode sesuai spec]
Hasil: Kode sesuai kebutuhan, terstruktur, terdokumentasi
```

### Prinsip Dasar Spec-Driven Development

Berikut adalah prinsip-prinsip fundamental yang harus dipahami:

#### 1. Specification First, Code Second

Spesifikasi ditulis **sebelum** kode. Ini bukan berarti Anda harus menulis spec sempurna di awal — spec bisa berevolusi. Namun, sebelum AI mulai menulis kode implementasi, harus ada spec yang jelas.

```
Workflow yang benar:
[Requirement] → [Spec] → [Review Spec] → [Generate Code] → [Test] → [Update Spec jika perlu]

Workflow yang salah:
[Requirement] → [Generate Code] → [Fix Bug] → [Fix Bug] → [Fix Bug] → ...
```

#### 2. Specifications are Contracts

Spesifikasi berfungsi sebagai **kontrak** antara Anda (sebagai stakeholder) dan AI (sebagai implementor). Kontrak ini mendefinisikan:

- **Apa** yang harus dibuat (requirements)
- **Bagaimana** cara kerjanya (behavior)
- **Batasan** apa yang berlaku (constraints)
- **Format** data yang digunakan (data models)
- **Interface** yang harus diimplementasi (API contracts)

#### 3. Specifications are Living Documents

Spesifikasi bukan dokumen sekali tulis lalu dilupakan. Spec harus **berevolusi** seiring dengan perkembangan proyek:

```
Versi Spec:
v1.0 — Initial spec (MVP requirements)
v1.1 — Added authentication requirements
v1.2 — Updated data model for student attendance
v2.0 — Major revision (added reporting module)
```

#### 4. Specifications are Executable

Dalam konteks AI-assisted development, spesifikasi yang baik adalah spesifikasi yang **bisa dieksekusi** — artinya AI bisa langsung menghasilkan kode dari spec tanpa perlu interpretasi tambahan.

---

## 📋 FORMAT SPESIFIKASI

### Struktur Spec yang Efektif

Berikut adalah format spesifikasi yang direkomendasikan berdasarkan `spec-kit-skill` dan praktik terbaik dari `awesome-vibe-coding-guide`:

```markdown
# Spesifikasi: [Nama Fitur/Sistem]

## 1. Overview
- **Tujuan**: [Apa yang ingin dicapai]
- **Scope**: [Apa yang termasuk dan tidak termasuk]
- **Stakeholders**: [Siapa yang terpengaruh]

## 2. Requirements
### 2.1 Functional Requirements
- **REQ-001**: [Deskripsi requirement]
  - Priority: [High/Medium/Low]
  - Acceptance Criteria: [Kriteria penerimaan]

### 2.2 Non-Functional Requirements
- **NFR-001**: [Performance, security, dll]

## 3. Constraints
- **Teknis**: [Technology stack, batasan teknis]
- **Bisnis**: [Deadline, budget, regulasi]
- **Operasional**: [Maintenance, deployment]

## 4. Data Models
```json
{
  "EntityName": {
    "field1": "type",
    "field2": "type",
    "relations": ["related_entity"]
  }
}
```

## 5. API Contracts
### 5.1 Endpoints
- **GET /api/resource**: [Deskripsi]
  - Request: [Headers, params, body]
  - Response: [Status codes, body schema]
  - Error: [Error responses]

## 6. User Flows
1. [Langkah 1]
2. [Langkah 2]
3. [Langkah 3]

## 7. Edge Cases
- [Kasus khusus yang perlu ditangani]

## 8. Testing Strategy
- [Jenis test yang diperlukan]
- [Coverage target]
```

### Contoh Spec Lengkap: Sistem Absensi Sekolah

Berikut adalah contoh spesifikasi lengkap untuk sistem absensi sekolah:

```markdown
# Spesifikasi: Sistem Absensi Sekolah SD Negeri Pasirhalang

## 1. Overview
- **Tujuan**: Membuat sistem absensi digital untuk mencatat kehadiran siswa dan guru
- **Scope**: Termasuk absensi harian, rekap bulanan, laporan. Tidak termasuk integrasi dengan Dapodik.
- **Stakeholders**: Operator sekolah, guru kelas, kepala sekolah, orang tua siswa

## 2. Requirements

### 2.1 Functional Requirements

**REQ-001: Absensi Siswa Harian**
- Priority: High
- Deskripsi: Guru dapat mencatat kehadiran siswa setiap hari
- Acceptance Criteria:
  - Guru bisa memilih tanggal absensi
  - Guru bisa memilih kelas
  - Sistem menampilkan daftar siswa di kelas tersebut
  - Guru bisa menandai status: Hadir, Sakit, Izin, Alpha
  - Data tersimpan ke database
  - Guru bisa mengedit absensi yang sudah diinput

**REQ-002: Rekap Absensi Bulanan**
- Priority: High
- Deskripsi: Sistem menghasilkan rekap absensi per siswa per bulan
- Acceptance Criteria:
  - Rekap bisa dilihat per siswa, per kelas, atau seluruh sekolah
  - Menampilkan jumlah Hadir, Sakit, Izin, Alpha
  - Menampilkan persentase kehadiran
  - Bisa di-export ke Excel

**REQ-003: Notifikasi Orang Tua**
- Priority: Medium
- Deskripsi: Orang tua mendapat notifikasi jika anak tidak hadir
- Acceptance Criteria:
  - Notifikasi dikirim via WhatsApp/Telegram
  - Dikirim otomatis setelah absensi diinput
  - Hanya untuk status Alpha (bukan Sakit/Izin)

### 2.2 Non-Functional Requirements

**NFR-001: Performance**
- Halaman absensi harus load dalam waktu < 2 detik
- Rekap bulanan harus generate dalam waktu < 5 detik

**NFR-002: Security**
- Hanya guru yang terautentikasi yang bisa input absensi
- Data absensi tidak bisa dihapus, hanya bisa diedit

**NFR-003: Availability**
- Sistem harus tersedia 99% selama jam sekolah (07:00-15:00)

## 3. Constraints
- **Teknis**: Menggunakan Node.js + Express + SQLite
- **Bisnis**: Harus selesai sebelum awal semester baru
- **Operasional**: Harus bisa berjalan di server sekolah dengan RAM 2GB

## 4. Data Models

```json
{
  "Siswa": {
    "id": "UUID (primary key)",
    "nisn": "string, unique, 10 digit",
    "nama": "string, max 100 chars",
    "kelas_id": "UUID (foreign key to Kelas)",
    "tanggal_lahir": "date",
    "jenis_kelamin": "enum: L/P",
    "nama_ortu": "string",
    "no_hp_ortu": "string"
  },
  "Kelas": {
    "id": "UUID (primary key)",
    "nama": "string, e.g. '1A', '2B'",
    "wali_kelas_id": "UUID (foreign key to Guru)",
    "tahun_ajaran": "string, e.g. '2025/2026'"
  },
  "Guru": {
    "id": "UUID (primary key)",
    "nip": "string, unique, 18 digit",
    "nama": "string, max 100 chars",
    "role": "enum: guru, operator, kepsek"
  },
  "Absensi": {
    "id": "UUID (primary key)",
    "siswa_id": "UUID (foreign key to Siswa)",
    "tanggal": "date",
    "status": "enum: hadir, sakit, izin, alpha",
    "keterangan": "string, nullable, max 255 chars",
    "diinput_oleh": "UUID (foreign key to Guru)",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "unique_constraint": ["siswa_id", "tanggal"]
  }
}
```

## 5. API Contracts

### 5.1 Endpoints

**POST /api/auth/login**
- Deskripsi: Login guru/operator
- Request Body:
```json
{
  "nip": "string",
  "password": "string"
}
```
- Response 200:
```json
{
  "token": "string (JWT)",
  "user": {
    "id": "UUID",
    "nama": "string",
    "role": "string"
  }
}
```
- Response 401: `{ "error": "NIP atau password salah" }`

**GET /api/kelas/:kelasId/siswa**
- Deskripsi: Ambil daftar siswa dalam kelas
- Auth: Required (Bearer token)
- Response 200:
```json
{
  "kelas": { "id": "UUID", "nama": "string" },
  "siswa": [
    {
      "id": "UUID",
      "nisn": "string",
      "nama": "string",
      "jenis_kelamin": "string"
    }
  ]
}
```

**POST /api/absensi**
- Deskripsi: Input absensi harian
- Auth: Required (guru atau operator)
- Request Body:
```json
{
  "tanggal": "2025-01-15",
  "entries": [
    { "siswa_id": "UUID", "status": "hadir", "keterangan": null },
    { "siswa_id": "UUID", "status": "sakit", "keterangan": "Demam" }
  ]
}
```
- Response 201: `{ "message": "Absensi berhasil disimpan", "count": 25 }`
- Response 400: `{ "error": "Format data tidak valid" }`

**GET /api/absensi/rekap**
- Deskripsi: Ambil rekap absensi
- Auth: Required
- Query Params:
  - `kelas_id` (optional): Filter per kelas
  - `siswa_id` (optional): Filter per siswa
  - `bulan`: Format YYYY-MM
  - `format`: json | excel
- Response 200 (json):
```json
{
  "periode": "2025-01",
  "rekap": [
    {
      "siswa_id": "UUID",
      "nama": "string",
      "hadir": 20,
      "sakit": 2,
      "izin": 1,
      "alpha": 2,
      "persentase": 80.0
    }
  ]
}
```

## 6. User Flows

### Flow 1: Input Absensi Harian
1. Guru login ke sistem
2. Guru memilih menu "Input Absensi"
3. Sistem menampilkan form: pilih tanggal dan kelas
4. Guru memilih tanggal (default: hari ini) dan kelas
5. Sistem menampilkan daftar siswa dengan radio button untuk status
6. Guru menandai status setiap siswa
7. Guru klik "Simpan"
8. Sistem validasi data dan menyimpan ke database
9. Sistem menampilkan konfirmasi jumlah absensi yang disimpan

### Flow 2: Lihat Rekap Bulanan
1. Guru/operator login
2. Pilih menu "Rekap Absensi"
3. Pilih kelas dan bulan
4. Sistem menampilkan tabel rekap
5. User bisa export ke Excel

## 7. Edge Cases
- Siswa pindah kelas di tengah semester: absensi tetap tercatat di kelas lama
- Guru input absensi untuk tanggal yang sudah lewat: diperbolehkan dengan keterangan
- Siswa yang belum punya data di sistem: tidak bisa diabsen, tampilkan warning
- Input absensi duplikat untuk tanggal yang sama: update data existing

## 8. Testing Strategy
- Unit test: Data model validation, API request/response
- Integration test: Full workflow input absensi
- E2E test: Login → Input absensi → Lihat rekap
- Coverage target: 80% untuk business logic
```

---

## 🔄 7-PHASE WORKFLOW (SPEC-KIT-SKILL)

### Phase 1: Constitution

**Tujuan**: Tetapkan prinsip, aturan, dan standar proyek.

Phase ini menentukan "konstitusi" proyek — aturan main yang akan diikuti sepanjang pengembangan.

```markdown
# Constitution: Sistem Absensi Sekolah

## Prinsip
1. User-first: UI harus mudah digunakan guru yang tidak tech-savvy
2. Data integrity: Data absensi tidak boleh hilang atau corrupt
3. Simplicity: Fitur MVP dulu, fitur advanced nanti
4. Offline-capable: Bisa berfungsi saat internet sekolah down

## Standar Kode
- Naming: camelCase untuk variabel, PascalCase untuk class
- Comments: Jelaskan "mengapa", bukan "apa"
- Error handling: Semua API endpoint harus handle error gracefully

## Tech Stack
- Backend: Node.js + Express
- Database: SQLite (bisa upgrade ke PostgreSQL nanti)
- Frontend: HTML + CSS + Vanilla JavaScript
- Deployment: Server sekolah (Ubuntu 22.04)
```

### Phase 2: Specify

**Tujuan**: Tentukan functional requirements secara detail.

Di phase ini, Anda menulis spesifikasi lengkap seperti contoh di atas. AI akan membantu dengan:

- Mengidentifikasi requirement yang terlewat
- Menyarankan edge cases yang perlu dipertimbangkan
- Memastikan requirement saling konsisten

```
Prompt untuk AI di phase Specify:
"Bantu saya tulis spesifikasi untuk [fitur]. Saya sudah punya draft berikut:
[draft spec Anda]

Tolong:
1. Identifikasi requirement yang masih kurang
2. Sarankan edge cases yang perlu ditangani
3. Pastikan semua requirement measurable dan testable"
```

### Phase 3: Clarify

**Tujuan**: Resolve ambiguities dalam spesifikasi.

AI akan mengajukan **maksimal 5 pertanyaan** untuk mengklarifikasi hal-hal yang ambigu dalam spec.

```
Contoh pertanyaan AI di phase Clarify:

1. Apakah satu guru bisa mengabsen lebih dari satu kelas?
   → Jawaban: Ya, guru bisa mengabsen kelas yang dia ajar

2. Apakah absensi bisa diinput untuk tanggal di masa depan?
   → Jawaban: Tidak, hanya tanggal hari ini atau yang sudah lewat

3. Bagaimana jika ada siswa yang keluar di tengah bulan?
   → Jawaban: Siswa tetap muncul di rekap sampai tanggal keluar

4. Apakah rekap absensi perlu ditandatangani digital?
   → Jawaban: Tidak untuk MVP, mungkin di versi 2

5. Berapa maksimal siswa per kelas?
   → Jawaban: Rata-rata 30 siswa, maksimal 40
```

### Phase 4: Plan

**Tujuan**: Buat technical strategy untuk implementasi.

Di phase ini, AI membuat rencana teknis berdasarkan spesifikasi:

```markdown
# Technical Plan: Sistem Absensi Sekolah

## Arsitektur
```
┌─────────────────────────────────────┐
│         Browser (Frontend)          │
│  HTML + CSS + Vanilla JavaScript    │
└──────────────┬──────────────────────┘
               │ HTTP Requests
               ▼
┌─────────────────────────────────────┐
│      Node.js + Express (Backend)    │
│  ├── auth/ (login, JWT)             │
│  ├── kelas/ (CRUD kelas)            │
│  ├── siswa/ (CRUD siswa)            │
│  ├── absensi/ (input, rekap)        │
│  └── laporan/ (export Excel)        │
└──────────────┬──────────────────────┘
               │ SQLite Driver
               ▼
┌─────────────────────────────────────┐
│         SQLite Database             │
│  ├── users, kelas, siswa            │
│  └── absensi                        │
└─────────────────────────────────────┘
```

## File Structure
```
absensi-sekolah/
├── package.json
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Kelas.js
│   │   ├── Siswa.js
│   │   └── Absensi.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── kelas.js
│   │   ├── siswa.js
│   │   ├── absensi.js
│   │   └── laporan.js
│   ├── middleware/
│   │   └── auth.js
│   └── app.js
├── public/
│   ├── index.html
│   ├── absensi.html
│   ├── rekap.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       ├── absensi.js
│       └── rekap.js
├── tests/
│   ├── models/
│   ├── routes/
│   └── integration/
└── README.md
```

## Database Schema
[SQL migration scripts]

## API Implementation Order
1. Auth (login, JWT middleware)
2. Kelas & Siswa (CRUD dasar)
3. Absensi (input, query, rekap)
4. Laporan (export Excel)

## Testing Approach
- Jest untuk unit test
- Supertest untuk API test
- Playwright untuk E2E test
```

### Phase 5: Tasks

**Tujuan**: Generate dependency-ordered tasks.

AI memecah rencana teknis menjadi task-task kecil yang bisa dikerjakan secara berurutan:

```markdown
# Task List: Sistem Absensi Sekolah

## Phase 1: Setup (Dependencies: none)
- [ ] Task 1: Initialize project (npm init, install dependencies)
- [ ] Task 2: Setup database schema dan migration
- [ ] Task 3: Setup Express app structure

## Phase 2: Core Models (Dependencies: Phase 1)
- [ ] Task 4: Implement User model + auth
- [ ] Task 5: Implement Kelas model
- [ ] Task 6: Implement Siswa model
- [ ] Task 7: Implement Absensi model

## Phase 3: API Endpoints (Dependencies: Phase 2)
- [ ] Task 8: Auth endpoints (login, verify token)
- [ ] Task 9: Kelas endpoints (CRUD)
- [ ] Task 10: Siswa endpoints (CRUD)
- [ ] Task 11: Absensi endpoints (input, query, rekap)

## Phase 4: Frontend (Dependencies: Phase 3)
- [ ] Task 12: Login page
- [ ] Task 13: Dashboard
- [ ] Task 14: Absensi input page
- [ ] Task 15: Rekap page

## Phase 5: Testing & Polish (Dependencies: Phase 4)
- [ ] Task 16: Unit tests untuk models
- [ ] Task 17: API tests untuk endpoints
- [ ] Task 18: E2E test untuk user flows
- [ ] Task 19: Error handling dan validation
- [ ] Task 20: Documentation
```

### Phase 6: Analyze

**Tujuan**: Validate consistency (read-only).

Di phase ini, AI melakukan analisis untuk memastikan:

- Semua requirement tercakup dalam task list
- Tidak ada konflik antar requirement
- Data model konsisten dengan API contracts
- Task list memiliki urutan dependency yang benar

```
Checklist Analyze Phase:
✓ REQ-001 tercakup di Task 11, 14
✓ REQ-002 tercakup di Task 11, 15
✓ REQ-003 tercakup di Task 11 (notifikasi)
✓ Data model Absensi memiliki semua field yang diperlukan
✓ API POST /api/absensi sesuai dengan contract di spec
✓ Task 11 bergantung pada Task 4-7 (models)
✓ Task 14 bergantung pada Task 11 (API harus ready dulu)
✓ Tidak ada circular dependency
```

### Phase 7: Implement

**Tujuan**: Execute implementation sesuai task list.

Di phase terakhir ini, AI mulai menulis kode berdasarkan task list yang sudah divalidasi. Setiap task dikerjakan secara berurutan, dengan verifikasi setelah setiap task selesai.

```
Workflow Implementasi:
1. Kerjakan Task 1: Initialize project
   → Buat package.json, install dependencies
   → Verifikasi: npm install berhasil

2. Kerjakan Task 2: Setup database
   → Buat migration script
   → Verifikasi: migration berhasil, tabel tercipta

3. Kerjakan Task 3: Setup Express app
   → Buat struktur folder, app.js
   → Verifikasi: server bisa start, health check endpoint responds

... dan seterusnya sampai semua task selesai
```

---

## 🔍 SPEC REVIEW DENGAN AI

### Cara Melakukan Spec Review

Setelah spesifikasi ditulis, lakukan review dengan AI untuk memastikan kualitas spec:

```
Prompt untuk Spec Review:
"Review spesifikasi berikut dan berikan feedback:
[spesifikasi Anda]

Tolong cek:
1. Apakah ada requirement yang ambigu?
2. Apakah ada edge case yang terlewat?
3. Apakah API contracts konsisten dengan data model?
4. Apakah acceptance criteria measurable?
5. Apakah ada dependency antar requirement yang tidak disebutkan?
6. Apakah spec ini cukup detail untuk langsung diimplementasi?"
```

### Checklist Spec Review

Gunakan checklist ini saat mereview spesifikasi:

- [ ] **Completeness**: Semua requirement fungsional tercakup
- [ ] **Consistency**: Tidak ada kontradiksi antar requirement
- [ ] **Clarity**: Setiap requirement bisa dipahami tanpa ambiguitas
- [ ] **Testability**: Setiap requirement bisa diverifikasi dengan test
- [ ] **Feasibility**: Requirement bisa diimplementasi dengan tech stack yang ada
- [ ] **Traceability**: Setiap requirement punya ID unik untuk tracking
- [ ] **Prioritization**: Requirement sudah diprioritaskan (High/Medium/Low)
- [ ] **Edge Cases**: Kasus khusus sudah diidentifikasi
- [ ] **Error Handling**: Scenario error sudah didefinisikan
- [ ] **Security**: Requirement keamanan sudah dicakup

---

## 🤖 GENERATING CODE FROM SPECS

### Dari Spec ke Kode: Proses Otomatis

Setelah spec siap dan sudah direview, AI bisa langsung menghasilkan kode. Berikut adalah prosesnya:

#### Step 1: Generate Data Models dari Spec

```
Prompt:
"Berdasarkan spec berikut, generate kode untuk semua data models:
[spesifikasi section Data Models]

Tech stack: Node.js + Express + SQLite (better-sqlite3)

Requirements:
- Setiap model punya method: create, findById, findAll, update, delete
- Validasi input di setiap method
- Handle error dengan try-catch
- Return format konsisten: { success, data, error }"
```

#### Step 2: Generate API Endpoints dari Spec

```
Prompt:
"Berdasarkan API contracts di spec berikut, generate kode untuk semua endpoints:
[spesifikasi section API Contracts]

Requirements:
- Gunakan Express router
- JWT middleware untuk protected routes
- Input validation dengan Joi/Zod
- Error handling konsisten
- Response format: { success, data, error, message }"
```

#### Step 3: Generate Frontend dari Spec

```
Prompt:
"Berdasarkan User Flows di spec berikut, generate kode untuk halaman-halaman frontend:
[spesifikasi section User Flows]

Requirements:
- HTML + CSS + Vanilla JavaScript
- Responsive design
- Fetch API untuk komunikasi dengan backend
- Loading state dan error handling di UI
- Form validation di client-side"
```

### Contoh: Generate Model dari Spec

Berikut adalah contoh kode model yang di-generate dari spec data model di atas:

```javascript
// models/Absensi.js
const Database = require('better-sqlite3');

class AbsensiModel {
  constructor(db) {
    this.db = db;
  }

  async create({ siswa_id, tanggal, status, keterangan, diinput_oleh }) {
    try {
      // Validasi input
      if (!siswa_id || !tanggal || !status || !diinput_oleh) {
        return { success: false, error: 'Field wajib tidak boleh kosong' };
      }

      const validStatus = ['hadir', 'sakit', 'izin', 'alpha'];
      if (!validStatus.includes(status)) {
        return { success: false, error: 'Status tidak valid' };
      }

      // Cek duplikasi
      const existing = this.db.prepare(
        'SELECT id FROM absensi WHERE siswa_id = ? AND tanggal = ?'
      ).get(siswa_id, tanggal);

      if (existing) {
        // Update jika sudah ada
        return this.update({
          id: existing.id,
          status,
          keterangan,
          diinput_oleh
        });
      }

      // Insert baru
      const stmt = this.db.prepare(`
        INSERT INTO absensi (siswa_id, tanggal, status, keterangan, diinput_oleh, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `);

      const result = stmt.run(siswa_id, tanggal, status, keterangan, diinput_oleh);

      return { success: true, data: { id: result.lastInsertRowid } };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async getRekap({ kelas_id, siswa_id, bulan }) {
    try {
      let query = `
        SELECT
          s.id as siswa_id,
          s.nama,
          s.nisn,
          COUNT(CASE WHEN a.status = 'hadir' THEN 1 END) as hadir,
          COUNT(CASE WHEN a.status = 'sakit' THEN 1 END) as sakit,
          COUNT(CASE WHEN a.status = 'izin' THEN 1 END) as izin,
          COUNT(CASE WHEN a.status = 'alpha' THEN 1 END) as alpha,
          COUNT(*) as total
        FROM siswa s
        LEFT JOIN absensi a ON s.id = a.siswa_id
          AND strftime('%Y-%m', a.tanggal) = ?
      `;

      const params = [bulan];

      if (kelas_id) {
        query += ' WHERE s.kelas_id = ?';
        params.push(kelas_id);
      }

      if (siswa_id) {
        query += kelas_id ? ' AND s.id = ?' : ' WHERE s.id = ?';
        params.push(siswa_id);
      }

      query += ' GROUP BY s.id ORDER BY s.nama';

      const results = this.db.prepare(query).all(...params);

      // Hitung persentase
      const rekap = results.map(r => ({
        siswa_id: r.siswa_id,
        nama: r.nama,
        nisn: r.nisn,
        hadir: r.hadir,
        sakit: r.sakit,
        izin: r.izin,
        alpha: r.alpha,
        persentase: r.total > 0 ? ((r.hadir / r.total) * 100).toFixed(1) : 0
      }));

      return { success: true, data: rekap };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

module.exports = AbsensiModel;
```

---

## 🧪 TEST GENERATION FROM SPECS

### Generate Tests dari Spesifikasi

Spesifikasi yang baik bisa langsung di-generate menjadi test cases. Berikut caranya:

#### Step 1: Generate Unit Tests dari Acceptance Criteria

```
Prompt:
"Berdasarkan acceptance criteria di spec berikut, generate unit tests:
[spesifikasi section Requirements dengan Acceptance Criteria]

Framework: Jest
Coverage target: 80%

Buat test untuk:
1. Setiap acceptance criteria jadi minimal 1 test case
2. Edge cases yang sudah diidentifikasi
3. Error scenarios"
```

#### Step 2: Generate Integration Tests dari API Contracts

```
Prompt:
"Berdasarkan API contracts di spec, generate integration tests:
[spesifikasi section API Contracts]

Framework: Jest + Supertest

Buat test untuk:
1. Happy path setiap endpoint
2. Error response (400, 401, 404, 500)
3. Authentication/authorization
4. Input validation
5. Data integrity"
```

#### Contoh: Test Cases dari Spec

Berikut adalah contoh test cases yang di-generate dari spec absensi:

```javascript
// tests/routes/absensi.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/absensi', () => {
  let token;

  beforeAll(async () => {
    // Login untuk dapat token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ nip: '198501012010011001', password: 'password123' });
    token = res.body.token;
  });

  // REQ-001: Guru bisa input absensi
  test('REQ-001: Berhasil input absensi untuk satu kelas', async () => {
    const response = await request(app)
      .post('/api/absensi')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tanggal: '2025-01-15',
        entries: [
          { siswa_id: 'uuid-1', status: 'hadir', keterangan: null },
          { siswa_id: 'uuid-2', status: 'sakit', keterangan: 'Demam' }
        ]
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(2);
  });

  // Edge case: Input duplikat
  test('Edge case: Input absensi duplikat mengupdate data existing', async () => {
    // Input pertama
    await request(app)
      .post('/api/absensi')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tanggal: '2025-01-15',
        entries: [{ siswa_id: 'uuid-1', status: 'hadir', keterangan: null }]
      });

    // Input kedua (update)
    const response = await request(app)
      .post('/api/absensi')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tanggal: '2025-01-15',
        entries: [{ siswa_id: 'uuid-1', status: 'sakit', keterangan: 'Demam' }]
      });

    expect(response.status).toBe(201);
    // Verifikasi data terupdate
    const getRes = await request(app)
      .get('/api/absensi?siswa_id=uuid-1&tanggal=2025-01-15')
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.body.data[0].status).toBe('sakit');
  });

  // Error: Tanpa auth
  test('Error: Input absensi tanpa token', async () => {
    const response = await request(app)
      .post('/api/absensi')
      .send({
        tanggal: '2025-01-15',
        entries: []
      });

    expect(response.status).toBe(401);
  });

  // Error: Format tidak valid
  test('Error: Format data tidak valid', async () => {
    const response = await request(app)
      .post('/api/absensi')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tanggal: 'invalid-date',
        entries: [{ siswa_id: 'uuid-1', status: 'invalid-status' }]
      });

    expect(response.status).toBe(400);
  });
});

describe('GET /api/absensi/rekap', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ nip: '198501012010011001', password: 'password123' });
    token = res.body.token;
  });

  // REQ-002: Rekap bulanan
  test('REQ-002: Rekap absensi per kelas per bulan', async () => {
    const response = await request(app)
      .get('/api/absensi/rekap?kelas_id=uuid-kelas-1&bulan=2025-01')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);

    // Cek struktur data
    const firstItem = response.body.data[0];
    expect(firstItem).toHaveProperty('siswa_id');
    expect(firstItem).toHaveProperty('nama');
    expect(firstItem).toHaveProperty('hadir');
    expect(firstItem).toHaveProperty('sakit');
    expect(firstItem).toHaveProperty('izin');
    expect(firstItem).toHaveProperty('alpha');
    expect(firstItem).toHaveProperty('persentase');
  });
});
```

---

## 📈 SPEC EVOLUTION

### Bagaimana Spec Berevolusi

Spesifikasi bukan dokumen statis. Spec harus berevolusi seiring dengan:

1. **Feedback dari pengguna** — Requirement berubah berdasarkan kebutuhan nyata
2. **Penemuan teknis** — Kendala teknis memaksa perubahan approach
3. **Perubahan bisnis** — Prioritas bisnis berubah
4. **Regulasi baru** — Aturan baru mempengaruhi requirement

### Versioning Spec

Gunakan versioning untuk melacak perubahan spec:

```markdown
# Changelog Spesifikasi

## v1.0 — 2025-01-01
- Initial spec untuk MVP
- Fitur: Absensi harian, rekap bulanan

## v1.1 — 2025-01-15
- Added: Notifikasi orang tua via WhatsApp
- Changed: Status absensi dari "tidak hadir" menjadi "sakit/izin/alpha"
- Removed: Fitur export PDF (ganti ke Excel saja)

## v1.2 — 2025-02-01
- Added: Fitur absensi guru (selain siswa)
- Changed: Database dari SQLite ke PostgreSQL
- Added: Role "wali kelas" dengan permission khusus

## v2.0 — 2025-03-01
- Added: Modul laporan untuk kepala sekolah
- Added: Dashboard dengan grafik kehadiran
- Changed: Frontend dari vanilla JS ke React
```

### Spec vs Code Synchronization

Salah satu tantangan spec-driven development adalah menjaga **sinkronisasi antara spec dan kode**. Berikut strateginya:

#### Strategi 1: Spec sebagai Source of Truth

```
Aturan: Jika ada perbedaan antara spec dan kode, spec yang benar.
Proses: Update kode untuk match spec, bukan sebaliknya.
```

#### Strategi 2: Automated Spec Validation

```
Prompt untuk AI:
"Scan kode di folder src/ dan bandingkan dengan spesifikasi di docs/spec.md.
Laporkan:
1. Requirement di spec yang belum diimplementasi di kode
2. Fitur di kode yang tidak ada di spec
3. Perbedaan antara API contract di spec dan implementasi"
```

#### Strategi 3: Spec-Driven Code Review

```
Prompt untuk AI:
"Review pull request berikut terhadap spesifikasi:
[link PR / diff]
[spesifikasi]

Cek:
1. Apakah implementasi sesuai dengan API contract?
2. Apakah data model sesuai dengan spec?
3. Apakah edge cases sudah ditangani sesuai spec?
4. Apakah ada fitur yang diimplementasi tapi tidak ada di spec?"
```

---

## 📝 REAL-WORLD SPEC EXAMPLES

### Contoh 1: Spec untuk Fitur CRUD Sederhana

```markdown
# Spesifikasi: CRUD Data Siswa

## Requirements
- **REQ-001**: Create siswa baru
  - Input: NISN (wajib, unik, 10 digit), Nama (wajib, max 100 char), TTL (wajib), Jenis Kelamin (wajib)
  - Validasi: NISN harus unik, format tanggal YYYY-MM-DD
  - Response: 201 dengan data siswa yang dibuat

- **REQ-002**: Read daftar siswa
  - Pagination: Default 20 per halaman
  - Filter: Kelas, jenis kelamin
  - Search: Berdasarkan nama atau NISN
  - Sort: Nama (asc/desc), NISN (asc/desc)

- **REQ-003**: Update data siswa
  - Field yang bisa diupdate: Nama, TTL, Jenis Kelamin
  - NISN tidak bisa diupdate
  - Response: 200 dengan data siswa yang diupdate

- **REQ-004**: Delete siswa
  - Soft delete: Set flag is_deleted = true
  - Tidak bisa delete jika siswa punya data absensi
  - Response: 200 dengan pesan konfirmasi
```

### Contoh 2: Spec untuk Integrasi API Eksternal

```markdown
# Spesifikasi: Integrasi WhatsApp Gateway untuk Notifikasi

## Requirements
- **REQ-001**: Kirim notifikasi absensi ke orang tua
  - Trigger: Setelah absensi diinput dengan status "alpha"
  - Provider: Fonnte API (https://api.fonnte.com)
  - Format pesan:
    "Yth. Orang Tua/Wali dari [NAMA SISWA],
    Kami informasikan bahwa anak Anda tidak hadir pada tanggal [TANGGAL] tanpa keterangan.
    Mohon konfirmasi ke sekolah. Terima kasih.
    - SD Negeri Pasirhalang"

- **REQ-002**: Retry mechanism
  - Jika pengiriman gagal, retry maksimal 3 kali
  - Interval retry: 5 menit
  - Log semua attempt ke tabel notification_log

- **REQ-003**: Rate limiting
  - Maksimal 100 pesan per menit (limit Fonnte)
  - Queue pesan jika melebihi limit

## Constraints
- API Key disimpan di environment variable
- Timeout request: 10 detik
- Fallback: Jika WA gagal, simpan log untuk dikirim manual
```

### Contoh 3: Spec untuk Laporan

```markdown
# Spesifikasi: Laporan Kehadiran Semesteran

## Requirements
- **REQ-001**: Generate laporan kehadiran per siswa
  - Periode: Semester ganjil (Juli-Desember) atau genap (Januari-Juni)
  - Format: Excel (.xlsx)
  - Konten:
    * Header: Nama sekolah, semester, tahun ajaran
    * Tabel: Nama siswa, NISN, kelas, jumlah H/S/I/A, persentase
    * Footer: Tanggal cetak, nama operator

- **REQ-002**: Generate laporan kehadiran per kelas
  - Agregasi: Rata-rata kehadiran per kelas
  - Ranking: Kelas dengan kehadiran tertinggi ke terendah
  - Visual: Grafik batang (opsional)

- **REQ-003**: Generate laporan untuk kepala sekolah
  - Ringkasan: Total siswa, rata-rata kehadiran sekolah
  - Trend: Perbandingan dengan semester sebelumnya
  - Alert: Siswa dengan kehadiran < 75%
```

---

## 🚀 SPEC-DRIVEN WORKFLOW STEP-BY-STEP

### Workflow Lengkap: Dari Ide ke Kode

Berikut adalah workflow lengkap spec-driven development dari awal sampai akhir:

```
Step 1: Tulis Draft Spec
┌─────────────────────────────────────────────┐
│ Anda menulis draft spesifikasi berdasarkan  │
│ kebutuhan. Tidak perlu sempurna di awal.    │
└─────────────────────────────────────────────┘
                    │
                    ▼
Step 2: AI Review & Clarify
┌─────────────────────────────────────────────┐
│ AI mereview spec, mengidentifikasi gap,     │
│ dan mengajukan pertanyaan klarifikasi.      │
└─────────────────────────────────────────────┘
                    │
                    ▼
Step 3: Finalize Spec
┌─────────────────────────────────────────────┐
│ Anda menjawab pertanyaan AI, spec diupdate  │
│ menjadi versi final yang siap diimplementasi│
└─────────────────────────────────────────────┘
                    │
                    ▼
Step 4: Generate Technical Plan
┌─────────────────────────────────────────────┐
│ AI membuat technical plan: arsitektur,      │
│ file structure, database schema, dll.       │
└─────────────────────────────────────────────┘
                    │
                    ▼
Step 5: Generate Task List
┌─────────────────────────────────────────────┐
│ AI memecah plan menjadi task-task kecil     │
│ dengan dependency order.                    │
└─────────────────────────────────────────────┘
                    │
                    ▼
Step 6: Analyze & Validate
┌─────────────────────────────────────────────┐
│ AI memvalidasi konsistensi: spec → plan →   │
│ tasks. Pastikan tidak ada yang terlewat.    │
└─────────────────────────────────────────────┘
                    │
                    ▼
Step 7: Implement (AI Coding)
┌─────────────────────────────────────────────┐
│ AI mengerjakan task satu per satu, generate │
│ kode sesuai spec. Anda review setiap step.  │
└─────────────────────────────────────────────┘
                    │
                    ▼
Step 8: Generate Tests
┌─────────────────────────────────────────────┐
│ AI generate test cases dari acceptance      │
│ criteria di spec. Run tests, fix jika fail. │
└─────────────────────────────────────────────┘
                    │
                    ▼
Step 9: Deploy & Monitor
┌─────────────────────────────────────────────┐
│ Deploy kode, monitor usage. Jika ada        │
│ feedback, update spec dan ulangi workflow.  │
└─────────────────────────────────────────────┘
```

### Template Prompt untuk Setiap Step

```
Step 1 — Draft Spec:
"Saya ingin membuat [fitur/sistem]. Berikut draft spesifikasi saya:
[draft]
Tolong review dan bantu lengkapi."

Step 2 — AI Clarify:
[Jawab pertanyaan AI dengan detail]

Step 3 — Finalize:
"Berikut versi final spesifikasi setelah klarifikasi:
[final spec]
Tolong buat technical plan berdasarkan spec ini."

Step 4 — Technical Plan:
"Review technical plan berikut. Apakah sudah mencakup semua requirement di spec?
[plan]
Jika ada yang kurang, tambahkan."

Step 5 — Task List:
"Buat task list dengan dependency order berdasarkan technical plan ini:
[plan]
Setiap task harus bisa dikerjakan dalam 1-2 sesi coding."

Step 6 — Analyze:
"Validasi konsistensi antara spec, plan, dan task list:
[spec]
[plan]
[tasks]
Laporkan jika ada inkonsistensi."

Step 7 — Implement:
"Kerjakan task berikut berdasarkan spec:
[task]
[spec]
Generate kode yang sesuai dengan spec. Jelaskan apa yang kamu buat."

Step 8 — Tests:
"Generate test cases dari acceptance criteria di spec:
[spec section Requirements]
Framework: [Jest/pytest/dll]"

Step 9 — Deploy:
"Buat deployment guide untuk aplikasi ini:
[app structure]
Target: [server/cloud provider]"
```

---

## ✅ CHECKLIST

- [ ] Paham konsep spec-driven development dan perbedaannya dengan vibe coding konvensional
- [ ] Tahu format spesifikasi yang efektif (requirements, constraints, data models, API contracts)
- [ ] Bisa menulis spesifikasi lengkap untuk fitur/sistem
- [ ] Paham 7-phase workflow spec-kit-skill (Constitution → Implement)
- [ ] Bisa melakukan spec review dengan AI
- [ ] Bisa generate kode dari spesifikasi
- [ ] Bisa generate test cases dari acceptance criteria
- [ ] Paham cara mengelola evolusi spesifikasi (versioning)
- [ ] Tahu strategi menjaga sinkronisasi spec vs kode
- [ ] Bisa menggunakan template prompt untuk setiap step workflow

---

> **Lanjut ke:** [`07-autonomous-agents.md`](./07-autonomous-agents.md)
