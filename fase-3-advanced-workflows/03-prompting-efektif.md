# 03 — Prompting Efektif

> **Estimasi:** 2 jam | **Level:** Menengah → Lanjut | **Prerequisite:** [`02-context-management.md`](./02-context-management.md)

---

## 📖 TEORI

### Mengapa Prompting Efektif Itu Krusial

Prompt adalah **satu-satunya interface** antara Anda dan AI. Kualitas prompt secara langsung menentukan:
- Akurasi kode yang dihasilkan
- Jumlah iterasi yang dibutuhkan
- Risiko bug dan edge case terlewat
- Kecepatan delivery fitur

**Prinsip fundamental:** AI tidak bisa membaca pikiran. Semakin eksplisit Anda, semakin presisi hasilnya.

---

## 1. Prompt Engineering Fundamentals

### 1.1 Specificity (Spesifisitas)

Spesifisitas adalah tingkat detail dan kejelasan dalam instruksi prompt. Prompt yang spesifik menghasilkan output yang predictable.

**Dimensi Spesifisitas:**

| Dimensi | Rendah (❌) | Tinggi (✅) |
|---|---|---|
| Teknologi | "buat web app" | "buat web app dengan Next.js 14, TypeScript, Tailwind CSS" |
| Fungsi | "tambah login" | "tambah login dengan JWT, bcrypt, refresh token, rate limiting" |
| Data | "simpan data user" | "simpan user ke tabel `users` dengan kolom: id (UUID), email (unique), password_hash, created_at" |
| Validasi | "validasi input" | "validasi: email format RFC 5322, password min 8 char + 1 uppercase + 1 number + 1 special" |
| Error | "handle error" | "return 400 untuk invalid input, 409 untuk duplicate email, 500 untuk server error dengan error code" |

**Contoh Konkret:**

```
❌ RENDAH: "Buat sistem absensi"

⚠️ SEDANG: "Buat API absensi dengan Python dan database"

✅ TINGGI: "Buat REST API absensi siswa dengan:
  - Framework: FastAPI 0.104+
  - Database: SQLite via SQLAlchemy 2.0 async
  - Endpoint: POST /api/v1/absensi
  - Request body: {siswa_id: str (UUID), status: enum['hadir','sakit','izin','alpha'], tanggal: date, keterangan?: str}
  - Validasi: tanggal tidak boleh di masa depan, siswa_id harus exist di tabel siswa
  - Response 201: {id, siswa_id, status, tanggal, created_at}
  - Response 400: {error_code: 'INVALID_DATE', message: str}
  - Response 404: {error_code: 'STUDENT_NOT_FOUND', message: str}
  - Response 409: {error_code: 'DUPLICATE_ABSENSI', message: str}
  - Sertakan unit test dengan pytest dan pytest-asyncio"
```

### 1.2 Context (Konteks)

Konteks memberikan AI pemahaman tentang lingkungan kerja. Tanpa konteks yang cukup, AI akan membuat asumsi yang mungkin salah.

**Layer Konteks yang Diperlukan:**

```
Layer 1 — Project Context:
  "Project ini adalah sistem informasi sekolah dengan arsitektur microservices."

Layer 2 — Tech Stack:
  "Backend: Node.js 20 + Express + Prisma ORM + PostgreSQL 15"
  "Frontend: React 18 + Vite + Zustand + React Query"

Layer 3 — Existing Code:
  "Sudah ada model User dan Role di prisma/schema.prisma"
  "Authentication middleware sudah ada di src/middleware/auth.ts"

Layer 4 — Business Rules:
  "Hanya admin dan kepala sekolah yang bisa melihat data keuangan"
  "Laporan BOS harus bisa di-export ke Excel dan PDF"

Layer 5 — Constraints:
  "Jangan ubah struktur database yang sudah ada"
  "Gunakan library yang sudah ada di package.json"
  "Ikuti coding convention di .eslintrc"
```

### 1.3 Constraints (Batasan)

Constraints membatasi ruang solusi agar AI tidak "berimprovisasi" ke arah yang tidak diinginkan.

**Jenis Constraints:**

```
1. Technology Constraints:
   "Hanya gunakan library yang sudah terinstall"
   "Jangan tambahkan dependency baru"
   "Gunakan built-in fetch, bukan axios"

2. Architecture Constraints:
   "Ikuti pola repository pattern yang sudah ada"
   "Semua business logic di service layer, bukan controller"
   "Gunakan dependency injection"

3. Style Constraints:
   "Gunakan async/await, bukan .then()"
   "Type semua function parameter dan return value"
   "Max 300 lines per file"

4. Security Constraints:
   "Semua input harus di-validate dengan Zod"
   "Jangan log data sensitif"
   "Gunakan parameterized queries"

5. Performance Constraints:
   "Query harus di bawah 100ms"
   "Implement pagination, max 50 items per page"
   "Gunakan caching untuk data yang jarang berubah"
```

### 1.4 Examples (Contoh)

Memberikan contoh input/output membantu AI memahami pola yang diharapkan.

**Contoh Format:**

```
Buat fungsi formatRupiah dengan contoh berikut:

Input: 1000000 → Output: "Rp1.000.000"
Input: 50000 → Output: "Rp50.000"
Input: 1234567.50 → Output: "Rp1.234.567,50"
Input: 0 → Output: "Rp0"
Input: -5000 → Output: "-Rp5.000"

Rules:
- Gunakan Intl.NumberFormat('id-ID')
- Handle null/undefined → return "Rp0"
- Handle NaN → throw Error
```

### 1.5 Format (Format Output)

Spesifikasikan format output yang diinginkan agar hasil langsung bisa digunakan.

```
Format output yang diinginkan:

1. File Structure:
   src/
   ├── services/
   │   └── absensi.service.ts
   ├── controllers/
   │   └── absensi.controller.ts
   ├── routes/
   │   └── absensi.routes.ts
   └── __tests__/
       └── absensi.test.ts

2. Code Style:
   - Named exports, bukan default exports
   - JSDoc untuk setiap public function
   - Error handling dengan try/catch + custom error class

3. Documentation:
   - Sertakan contoh usage di setiap file
   - Tambahkan komentar untuk logic yang kompleks
```

---

## 2. Advanced Prompting Techniques

### 2.1 Chain of Thought (CoT)

Chain of Thought meminta AI untuk menunjukkan proses berpikirnya sebelum memberikan jawaban final. Teknik ini meningkatkan akurasi untuk task kompleks.

**Cara Pakai:**

```
Prompt:
"Selesaikan masalah ini step by step. Jelaskan reasoning di setiap langkah sebelum menulis kode.

Masalah: Optimasi query N+1 pada endpoint /api/siswa dengan relasi ke orang_tua, nilai, dan absensi.

Langkah yang harus diikuti:
1. Identifikasi query N+1 yang ada
2. Jelaskan mengapa N+1 terjadi
3. Pilih strategi optimasi (eager loading, DataLoader, batch query)
4. Tulis kode implementasi
5. Jelaskan tradeoff dari pilihan yang dibuat"
```

**Kapan Pakai:**
- Debugging masalah kompleks
- Arsitektur decision making
- Optimasi performa
- Refactoring besar

**Expected Output Pattern:**
```
Step 1: Identifikasi N+1
  - Di absensi.service.ts line 45, ada loop yang query orang_tua untuk setiap siswa
  - Ini menghasilkan 1 + N queries (N = jumlah siswa)

Step 2: Root Cause
  - Prisma lazy loading dipanggil di dalam forEach loop
  - Tidak ada include di query awal

Step 3: Strategi
  - Pilih eager loading dengan Prisma include karena...
  - Alternatif DataLoader tidak cocok karena...

Step 4: Implementasi
  [kode]

Step 5: Tradeoff
  - Pro: Simple, langsung fix
  - Con: Memory usage naik jika relasi besar
```

### 2.2 Tree of Thoughts (ToT)

Tree of Thoughts mengeksplorasi multiple branching paths sebelum memilih solusi terbaik.

**Cara Pakai:**

```
Prompt:
"Eksplorasi 3 pendekatan berbeda untuk masalah ini, lalu recommend yang terbaik.

Masalah: Sistem notifikasi real-time untuk guru saat ada absensi baru.

Pendekatan yang harus dianalisis:
1. WebSocket (Socket.io)
2. Server-Sent Events (SSE)
3. Polling dengan interval

Untuk setiap pendekatan, analisis:
- Kompleksitas implementasi (low/medium/high)
- Resource usage (CPU, memory, bandwidth)
- Scalability (10, 100, 1000 concurrent users)
- Browser compatibility
- Fallback mechanism

Setelah analisis, berikan rekomendasi dengan alasan."
```

**Kapan Pakai:**
- Memilih antara multiple teknologi
- Arsitektur decision
- Tradeoff analysis
- Design pattern selection

### 2.3 ReAct (Reasoning + Acting)

ReAct menggabungkan reasoning dengan action — AI berpikir, melakukan sesuatu, observasi hasil, lalu iterasi.

**Cara Pakai:**

```
Prompt:
"Gunakan pendekatan ReAct untuk debug error ini.

Error: TypeError: Cannot read properties of undefined (reading 'map')
File: src/components/SiswaList.tsx:42

Format response:
Thought: [Apa yang saya pikirkan]
Action: [Apa yang akan saya cek/lakukan]
Observation: [Apa yang saya temukan dari kode]
Conclusion: [Root cause dan fix]

Ulangi sampai root cause ditemukan."
```

**Kapan Pakai:**
- Debugging error yang tidak jelas penyebabnya
- Investigasi bug multi-layer
- Troubleshooting integration issues

### 2.4 Self-Consistency

Minta AI menghasilkan multiple solusi, lalu compare dan pilih yang terbaik.

**Cara Pakai:**

```
Prompt:
"Generate 3 implementasi berbeda untuk fungsi validasi NISN.

Requirements:
- NISN: 10 digit angka
- Digit terakhir adalah checksum
- Validasi harus synchronous

Untuk setiap implementasi:
1. Tulis kode lengkap
2. Jelaskan time complexity
3. Jelaskan space complexity
4. Berikan test cases yang di-cover

Setelah semua implementasi selesai, compare dan recommend yang terbaik berdasarkan:
- Readability
- Performance
- Maintainability"
```

### 2.5 Few-Shot Prompting

Few-shot memberikan beberapa contoh sebelum meminta AI menghasilkan output baru.

**Cara Pakai:**

```
Prompt:
"Konversi data berikut ke format JSON sesuai pola contoh.

Contoh 1:
Input: "Budi, 15, Jakarta, lulus"
Output: {"nama": "Budi", "umur": 15, "kota": "Jakarta", "status": "lulus"}

Contoh 2:
Input: "Siti, 14, Bandung, tidak lulus"
Output: {"nama": "Siti", "umur": 14, "kota": "Bandung", "status": "tidak lulus"}

Contoh 3:
Input: "Ahmad, 16, Surabaya, lulus"
Output: {"nama": "Ahmad", "umur": 16, "kota": "Surabaya", "status": "lulus"}

Sekarang konversi:
Input: "Dewi, 15, Yogyakarta, lulus"
Output: ?"
```

### 2.6 Zero-Shot Prompting

Zero-shot tidak memberikan contoh, hanya instruksi. Berguna untuk task yang sudah well-understood oleh model.

**Cara Pakai:**

```
Prompt:
"Jelaskan perbedaan antara REST API dan GraphQL dalam konteks pengembangan aplikasi sekolah. Sertakan kapan harus menggunakan masing-masing."
```

**Kapan Zero-Shot Cukup:**
- Konsep umum yang sudah well-documented
- Task standar (format JSON, explain code, dll)
- Model sudah punya knowledge domain yang kuat

---

## 3. Prompt Templates Library

### 3.1 Template: Create Feature

```
Template:
```
Buat fitur [NAMA FITUR] dengan spesifikasi berikut:

Konteks:
- Project: [deskripsi project]
- Tech stack: [teknologi yang digunakan]
- File yang akan dimodifikasi: [@file paths]

Requirements:
1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]

Constraints:
- [Constraint 1]
- [Constraint 2]

Acceptance Criteria:
- [ ] [Kriteria 1]
- [ ] [Kriteria 2]
- [ ] [Kriteria 3]

Output yang diharapkan:
- Kode lengkap dengan error handling
- Unit test
- Dokumentasi singkat cara pakai
```

Contoh Terisi:
```
Buat fitur export laporan BOS ke Excel dengan spesifikasi berikut:

Konteks:
- Project: Sistem Informasi Keuangan Sekolah SD Negeri Pasirhalang
- Tech stack: Google Apps Script, Google Sheets API
- File yang akan dimodifikasi: @src/services/laporan.js

Requirements:
1. Export data realisasi BOS per bulan ke file .xlsx
2. Format sesuai template Kemdikbud (header, border, warna)
3. Include summary: total anggaran, total realisasi, sisa

Constraints:
- Gunakan library SheetJS yang sudah ada
- Max 1000 rows per export
- File name format: LPJ_BOS_[BULAN]_[TAHUN].xlsx

Acceptance Criteria:
- [ ] File Excel ter-generate dengan format benar
- [ ] Data sesuai dengan sheet Realisasi
- [ ] Handle kasus data kosong
- [ ] Download otomatis setelah generate

Output yang diharapkan:
- Fungsi generateLaporanBOS(bulan, tahun)
- Unit test dengan mock data
- Contoh usage
```
```

### 3.2 Template: Fix Bug

```
Template:
```
Fix bug berikut:

Error Message:
```
[paste error message lengkap]
```

Stack Trace:
```
[paste stack trace]
```

Konteks:
- File: [@file path]
- Line: [nomor line]
- Kapan error muncul: [deskripsi scenario]

Yang sudah dicoba:
1. [Attempt 1] → [hasil]
2. [Attempt 2] → [hasil]

Analisis yang diminta:
1. Root cause analysis
2. Fix dengan penjelasan
3. Test case untuk verify fix
4. Pencegahan agar tidak terulang
```

### 3.3 Template: Refactor Code

```
Template:
```
Refactor kode berikut untuk meningkatkan [readability/performance/maintainability]:

File: [@file path]

Masalah yang ingin diperbaiki:
1. [Masalah 1 - misal: fungsi terlalu panjang 200 lines]
2. [Masalah 2 - misal: nested callback hell]
3. [Masalah 3 - misal: magic numbers]

Constraints:
- Jangan ubah behavior/fungsionalitas
- Semua existing test harus tetap pass
- Ikuti coding convention project

Yang diharapkan:
1. Sebelum/sesudah comparison
2. Penjelasan setiap perubahan
3. Impact analysis (performance, readability)
```

### 3.4 Template: Write Test

```
Template:
```
Buat unit test untuk fungsi berikut:

File: [@file path]
Fungsi: [nama fungsi]

Test cases yang harus di-cover:
1. Happy path: [deskripsi]
2. Edge case: [deskripsi]
3. Error case: [deskripsi]
4. Boundary case: [deskripsi]

Framework: [jest/vitest/pytest]
Mock yang dibutuhkan: [list dependencies yang perlu di-mock]

Coverage target: [misal: 90% branch coverage]
```

### 3.5 Template: Explain Code

```
Template:
```
Jelaskan kode berikut secara detail:

File: [@file path]

Yang ingin saya pahami:
1. Apa yang dilakukan fungsi ini secara high-level?
2. Bagaimana alur eksekusi dari input sampai output?
3. Apa purpose dari setiap parameter?
4. Apa possible side effects?
5. Apa edge cases yang di-handle?
6. Bagaimana cara modify jika saya ingin [tujuan modifikasi]?

Level penjelasan: [pemula/menengah/advanced]
```

### 3.6 Template: Review PR

```
Template:
```
Review pull request berikut:

Files changed: [@file1, @file2, @file3]

Review checklist:
1. [ ] Correctness: Apakah logic benar?
2. [ ] Security: Ada vulnerability?
3. [ ] Performance: Ada bottleneck?
4. [ ] Readability: Mudah dipahami?
5. [ ] Test coverage: Test cukup?
6. [ ] Edge cases: Sudah di-handle?
7. [ ] Naming: Nama variabel/fungsi jelas?
8. [ ] Error handling: Comprehensive?

Format review:
- File: [nama file]
- Line: [nomor line]
- Issue: [deskripsi masalah]
- Severity: [critical/high/medium/low]
- Suggestion: [cara fix]
```

### 3.7 Template: Design API

```
Template:
```
Design REST API untuk [resource] dengan spesifikasi:

Resource: [nama resource]
Operations: [CRUD yang dibutuhkan]

Requirements:
- Authentication: [JWT/OAuth2/API Key]
- Authorization: [role-based/attribute-based]
- Pagination: [cursor/offset/limit]
- Filtering: [field yang bisa di-filter]
- Sorting: [field yang bisa di-sort]
- Rate limiting: [requests per minute]

Output yang diharapkan:
1. Endpoint list dengan method, path, request/response schema
2. Error response format
3. Contoh request/response untuk setiap endpoint
4. OpenAPI/Swagger spec snippet
```

### 3.8 Template: Optimize Query

```
Template:
```
Optimasi query database berikut:

Query saat ini:
```sql
[query SQL]
```

Masalah:
- Execution time: [waktu saat ini]
- Target: [waktu yang diinginkan]
- Data volume: [jumlah rows]
- Index yang ada: [list index]

Yang diminta:
1. EXPLAIN ANALYZE dari query saat ini
2. Identifikasi bottleneck
3. Rekomendasi index baru
4. Query yang sudah dioptimasi
5. Estimasi improvement
```

### 3.9 Template: Write Documentation

```
Template:
```
Buat dokumentasi untuk [fitur/modul/API]:

Konteks:
- Audience: [developer/end-user/admin]
- Level teknis: [pemula/menengah/advanced]

Yang harus ada:
1. Overview: Apa dan mengapa fitur ini ada
2. Quick start: Cara pakai dalam 5 menit
3. API reference: Semua endpoint/fungsi dengan parameter
4. Examples: Minimal 3 contoh penggunaan
5. Troubleshooting: Common issues dan solusi
6. FAQ: Pertanyaan yang sering ditanyakan

Format: Markdown dengan heading hierarchy yang jelas
```

### 3.10 Template: Debug Error

```
Template:
```
Debug error berikut dengan pendekatan sistematis:

Error:
```
[error message]
```

Context:
- Environment: [dev/staging/production]
- Browser/OS: [jika applicable]
- Kapan muncul: [step to reproduce]
- Frekuensi: [selalu/intermittent/rare]

Kode terkait: [@file paths]

Yang diminta:
1. Hypothesis: Apa yang mungkin menyebabkan error ini
2. Verification: Cara test setiap hypothesis
3. Fix: Solusi untuk setiap confirmed cause
4. Prevention: Cara mencegah terulang
```

### 3.11 Template: Database Migration

```
Template:
```
Buat database migration untuk perubahan berikut:

Perubahan:
- [ ] Tambah tabel [nama] dengan kolom: [list kolom + tipe + constraint]
- [ ] Tambah kolom [nama] ke tabel [existing]
- [ ] Ubah tipe kolom [nama] dari [old] ke [new]
- [ ] Tambah index pada [table.column]
- [ ] Hapus kolom [nama] dari tabel [existing]

Constraints:
- Migration harus reversible (up dan down)
- Data existing tidak boleh hilang
- Zero downtime deployment
- Rollback plan jika gagal

Output:
- Migration file (up + down)
- Seed data jika diperlukan
- Test migration di staging
```

### 3.12 Template: Security Audit

```
Template:
```
Lakukan security audit untuk kode berikut:

Files: [@file paths]

Checklist audit:
1. [ ] Input validation: Semua input divalidasi?
2. [ ] SQL injection: Parameterized queries?
3. [ ] XSS: Output encoding?
4. [ ] CSRF: Token protection?
5. [ ] Authentication: Session management aman?
6. [ ] Authorization: Access control benar?
7. [ ] Sensitive data: Password di-hash? Data di-enkripsi?
8. [ ] Rate limiting: Protection dari brute force?
9. [ ] Logging: Tidak log data sensitif?
10. [ ] Dependencies: No known vulnerabilities?

Format temuan:
- Severity: [critical/high/medium/low/info]
- Location: [file:line]
- Issue: [deskripsi]
- Impact: [apa yang bisa terjadi]
- Fix: [cara remediate]
```

---

## 4. Context Management in Prompts

### 4.1 Berapa Banyak Context yang Diperlukan?

**Rule of Thumb:** Berikan context minimal yang cukup untuk AI memahami task, tapi tidak terlalu banyak sampai noise.

```
Too Little Context (❌):
"Fix bug di auth"
→ AI tidak tahu framework, error apa, file mana

Just Right Context (✅):
"Fix bug di @src/auth/jwt.ts:45 — TypeError saat verify token expired.
Framework: Express + jsonwebtoken v9.
Error: 'TokenExpiredError: jwt expired' tidak di-catch di middleware.
Expected: Return 401 dengan message 'Token expired, please login again'"

Too Much Context (⚠️):
[Seluruh file 500 lines + 10 file lain + history project 2 tahun]
→ AI bingung mana yang relevan, token waste
```

### 4.2 Apa yang Harus Di-Include dalam Context

**Prioritas Context (dari paling penting):**

```
Priority 1 — MUST Include:
✅ File yang akan dimodifikasi (gunakan @file)
✅ Error message lengkap (jika debugging)
✅ Tech stack yang digunakan
✅ Requirement spesifik

Priority 2 — SHOULD Include:
✅ File yang di-import oleh file utama
✅ Interface/type definition yang relevan
✅ Config file yang berpengaruh
✅ Test file (jika menulis test)

Priority 3 — NICE to Have:
✅ File yang meng-import file utama (impact analysis)
✅ Dokumentasi API terkait
✅ Commit message terakhir yang mengubah file
✅ Issue/ticket description

Priority 4 — AVOID:
❌ File yang tidak berhubungan
❌ History lengkap project
❌ Semua file di direktori
❌ Log file yang sangat besar
```

### 4.3 @file Usage Best Practices

```
✅ GOOD — Specific file references:
"Refactor fungsi validateAbsensi di @src/services/absensi.service.ts
dengan memisah validasi date dan validasi status ke fungsi terpisah."

✅ GOOD — Multiple related files:
"Buat integration test untuk flow absensi:
@src/controllers/absensi.controller.ts
@src/services/absensi.service.ts
@src/models/absensi.model.ts"

✅ GOOD — File + line range:
"Fix bug di @src/utils/format.ts:23-35 — fungsi formatRupiah
tidak handle angka negatif dengan benar."

❌ BAD — Too broad:
"Lihat semua file di src/ dan fix yang salah"

❌ BAD — No file reference:
"Fix bug di fungsi formatRupiah"
→ AI tidak tahu file mana yang dimaksud
```

### 4.4 Context Window Management

**Strategi untuk Task Besar:**

```
Strategy 1 — Chunking:
Pecah task besar menjadi sub-task dengan context terpisah.

Prompt 1: "Analisis arsitektur @src/ dan identifikasi module yang perlu refactor"
→ Dapat list module

Prompt 2: "Refactor module auth berdasarkan analisis sebelumnya. Files: @src/auth/*"
→ Refactor auth

Prompt 3: "Refactor module absensi. Files: @src/absensi/*"
→ Refactor absensi

Strategy 2 — Progressive Disclosure:
Mulai dengan overview, lalu drill down.

Prompt 1: "Berikan overview struktur project dari @package.json dan @src/"
→ Dapat peta project

Prompt 2: "Sekarang fokus ke @src/services/absensi.service.ts — jelaskan fungsi utamanya"
→ Dapat detail service

Prompt 3: "Optimasi fungsi getAbsensiBySiswa di file tersebut"
→ Dapat optimasi spesifik

Strategy 3 — Context Reset:
Start fresh conversation untuk task yang tidak berhubungan.

"Mulai session baru. Task sebelumnya sudah selesai.
Task baru: Buat fitur export PDF untuk laporan BOS.
Context: @src/services/laporan.js, @package.json"
```

---

## 5. Prompt Iteration Strategy

### 5.1 Debugging Bad Outputs

Ketika output AI tidak sesuai harapan, gunakan framework iterasi berikut:

```
Step 1 — Identify the Gap:
Output yang dihasilkan vs output yang diharapkan — apa bedanya?

Step 2 — Diagnose the Cause:
- Apakah prompt kurang spesifik? → Tambahkan detail
- Apakah context kurang? → Tambahkan @file
- Apakah constraints kurang? → Tambahkan batasan
- Apakah contoh kurang? → Tambahkan few-shot examples

Step 3 — Refine the Prompt:
Berdasarkan diagnosis, modifikasi prompt.

Step 4 — Test Again:
Jalankan prompt yang sudah direvisi.

Step 5 — Repeat Until Satisfied:
Ulangi Step 1-4 sampai output sesuai.
```

### 5.2 Common Issues dan Solusi

| Issue | Penyebab | Solusi |
|---|---|---|
| Kode tidak compile | Tech stack tidak spesifik | Sebutkan versi framework/library |
| Logic salah | Requirement ambigu | Tambahkan acceptance criteria |
| Style tidak konsisten | Tidak ada constraint style | Tambahkan coding convention |
| Missing error handling | Tidak diminta eksplisit | Tambahkan "include error handling" |
| Over-engineered | Tidak ada constraint simplicity | Tambahkan "keep it simple, minimal solution" |
| Under-engineered | Tidak ada requirement completeness | Tambahkan edge cases yang harus di-cover |
| Wrong file modified | Context tidak jelas | Gunakan @file reference spesifik |
| Breaking changes | Tidak ada constraint backward compat | Tambahkan "jangan break existing functionality" |

### 5.3 Prompt Refinement Patterns

**Pattern 1 — Add Specificity:**

```
Before (vague):
"Buat API yang bagus"

After (specific):
"Buat REST API dengan:
- Method: GET
- Path: /api/v1/siswa
- Query params: page (default 1), limit (default 20), search (optional)
- Response: {data: Siswa[], pagination: {page, limit, total, totalPages}}
- Status codes: 200 (success), 400 (invalid params), 500 (server error)"
```

**Pattern 2 — Add Constraints:**

```
Before (unconstrained):
"Optimasi query ini"

After (constrained):
"Optimasi query ini dengan constraints:
- Jangan ubah struktur tabel
- Max tambah 2 index baru
- Query time target: < 50ms
- Jelaskan EXPLAIN ANALYZE sebelum dan sesudah"
```

**Pattern 3 — Add Examples:**

```
Before (no examples):
"Format tanggal ke bahasa Indonesia"

After (with examples):
"Format tanggal ke bahasa Indonesia:

Input: '2024-01-15' → Output: '15 Januari 2024'
Input: '2024-02-20' → Output: '20 Februari 2024'
Input: '2024-12-31' → Output: '31 Desember 2024'
Input: null → Output: '-'

Gunakan fungsi yang sudah ada di @src/utils/date.ts"
```

**Pattern 4 — Add Edge Cases:**

```
Before (no edge cases):
"Buat fungsi hitung rata-rata nilai"

After (with edge cases):
"Buat fungsi hitung rata-rata nilai dengan handle edge cases:
- Array kosong → return 0
- Array dengan 1 element → return element tersebut
- Nilai null/undefined → skip, jangan hitung
- Nilai di luar range 0-100 → throw Error
- Array sangat besar (>10000) → efisien, O(n)"
```

---

## 6. Multi-Turn Conversations

### 6.1 Maintaining Context Across Turns

**Prinsip:** Setiap turn dalam conversation, AI mengingat context dari turn sebelumnya. Tapi context window terbatas.

```
Turn 1 — Setup Context:
"Saya punya project FastAPI untuk sistem absensi sekolah.
Database: PostgreSQL dengan SQLAlchemy.
File utama: @src/main.py, @src/models.py, @src/routes.py

Buat model SQLAlchemy untuk tabel 'absensi' dengan kolom:
id (UUID PK), siswa_id (FK), tanggal (Date), status (Enum), created_at"

Turn 2 — Build on Previous:
"Sekarang buat endpoint POST /api/absensi yang menggunakan model tadi.
Validasi: siswa_id harus exist, tanggal tidak boleh future, status harus valid enum.
Gunakan Pydantic untuk request validation."

Turn 3 — Continue:
"Tambahkan unit test untuk endpoint yang baru dibuat.
Mock database session. Test happy path dan error cases."

Turn 4 — Reference Previous:
"Refactor endpoint dari Turn 2 — pisahkan business logic ke service layer.
Jangan ubah response format yang sudah dibuat di Turn 2."
```

### 6.2 Kapan Harus Start Fresh

**Start fresh conversation ketika:**

```
1. Topic Berubah Total:
   ❌ Continue: "Sekarang buat frontend React untuk project FastAPI tadi"
   ✅ Fresh: [New conversation] "Buat frontend React untuk API absensi..."

2. Context Window Penuh:
   Tanda: AI mulai lupa detail dari awal conversation
   Solusi: Start fresh, berikan summary context yang relevan

3. Output Mulai Tidak Konsisten:
   Tanda: AI contradict itself atau ignore constraints
   Solusi: Start fresh dengan prompt yang lebih terstruktur

4. Session Terlalu Panjang (>20 turns):
   Tanda: Response quality menurun
   Solusi: Start fresh, carry forward learnings

5. Different Tech Stack:
   ❌ Continue: "Sekarang buat versi Python dari project Node.js tadi"
   ✅ Fresh: [New conversation] "Buat project Python dengan..."
```

### 6.3 Context Carry-Forward Template

Ketika start fresh tapi perlu carry context:

```
Template:
```
[NEW SESSION]

Context dari session sebelumnya:
- Project: [deskripsi singkat]
- Tech stack: [teknologi]
- Yang sudah selesai: [list]
- Yang akan dikerjakan: [task baru]
- Lessons learned: [insight dari session sebelumnya]
- Constraints yang tetap berlaku: [list]

Task baru:
[deskripsi task]
```
```

---

## 7. Prompt Anti-Patterns

### 7.1 Vague Requests (Permintaan Tidak Jelas)

```
❌ ANTI-PATTERN:
"Bikin yang bagus"
"Fix yang error"
"Buat lebih cepat"
"Improve code"

✅ CORRECTED:
"Buat UI dashboard dengan chart bar untuk data absensi bulanan"
"Fix TypeError di @src/utils.ts:15 saat input null"
"Optimasi query @src/services/laporan.js:45 dari 2s ke <200ms"
"Refactor fungsi processAbsensi untuk reduce cyclomatic complexity dari 15 ke <8"
```

### 7.2 Too Much Context (Information Overload)

```
❌ ANTI-PATTERN:
[Paste 5000 lines code + 20 files + error log 1000 lines + history project]

✅ CORRECTED:
"Fix error di @src/auth.ts:23-30.
Error: 'Cannot read property 'token' of undefined'
Context: Fungsi ini dipanggil setelah login berhasil.
Relevant file: @src/types.ts (interface User)"
```

### 7.3 Conflicting Instructions

```
❌ ANTI-PATTERN:
"Buat fitur yang simple tapi lengkap dengan semua edge cases dan dokumentasi lengkap dan test coverage 100% dan performa optimal dan code yang minimal"

→ Contradiction: "simple" vs "lengkap semua edge cases" vs "dokumentasi lengkap" vs "code minimal"

✅ CORRECTED:
"Buat fitur dengan prioritas:
1. Correctness: Handle semua edge cases yang listed
2. Simplicity: Minimal code, tidak over-engineer
3. Testing: Test happy path + 3 error cases utama
4. Documentation: JSDoc untuk public functions saja"
```

### 7.4 Missing Constraints

```
❌ ANTI-PATTERN:
"Buat fungsi sorting"

→ AI bisa pilih algorithm apapun, complexity apapun, style apapun

✅ CORRECTED:
"Buat fungsi sorting array of objects by property 'nama' dengan:
- Algorithm: stable sort
- Complexity: O(n log n) worst case
- In-place: ya, jangan buat array baru
- Handle: null values (taruh di akhir)
- Language: TypeScript dengan generics"
```

### 7.5 Assuming AI Knows Context

```
❌ ANTI-PATTERN:
"Fix yang kemarin"
"Lanjutin yang tadi"
"Seperti yang sudah dibahas"

✅ CORRECTED:
"Fix bug di @src/absensi.ts:45 — TypeError saat siswa_id null.
Error: 'Cannot read properties of null (reading 'nama')'"
```

### 7.6 Over-Specifying Trivial Things

```
❌ ANTI-PATTERN:
"Buat variabel dengan nama 'hasilPerhitunganAbsensiSiswaPerBulanTahun2024'
dengan tipe data number dan inisialisasi dengan nilai 0
ludah tambahkan 1 setiap kali ada absensi hadir"

✅ CORRECTED:
"Hitung total kehadiran siswa per bulan.
Gunakan counter yang increment saat status === 'hadir'."
```

---

## 8. Prompt Testing Framework

### 8.1 Evaluating Prompt Quality

**Prompt Quality Scorecard:**

```
Score setiap aspek (1-5):

1. Clarity (Kejelasan):
   5 = Sangat jelas, tidak ada ambigu
   3 = Cukup jelas, ada sedikit ambigu
   1 = Tidak jelas, banyak interpretasi

2. Completeness (Kelengkapan):
   5 = Semua info yang dibutuhkan ada
   3 = Info utama ada, beberapa detail kurang
   1 = Banyak info penting missing

3. Specificity (Spesifisitas):
   5 = Sangat spesifik, detail teknis lengkap
   3 = Cukup spesifik, beberapa detail umum
   1 = Sangat umum, tidak ada detail

4. Constraints (Batasan):
   5 = Constraints jelas dan lengkap
   3 = Ada beberapa constraints
   1 = Tidak ada constraints

5. Examples (Contoh):
   5 = Contoh input/output lengkap
   3 = Ada beberapa contoh
   1 = Tidak ada contoh

Total Score:
21-25: Excellent prompt
16-20: Good prompt, minor improvements
11-15: Average, needs refinement
5-10: Poor, rewrite needed
```

### 8.2 A/B Testing Prompts

**Metode:**

```
Step 1 — Buat 2 versi prompt untuk task yang sama:

Prompt A (minimal):
"Buat fungsi validasi email"

Prompt B (detailed):
"Buat fungsi validasi email dengan:
- Format: RFC 5322 simplified
- Return: boolean
- Handle: null, undefined, empty string → false
- Test cases: 'test@email.com' → true, 'invalid' → false, '' → false"

Step 2 — Jalankan kedua prompt dengan model yang sama

Step 3 — Compare output berdasarkan:
- Correctness: Apakah output benar?
- Completeness: Apakah semua requirement ter-cover?
- Code quality: Clean, readable, maintainable?
- Edge cases: Apakah edge cases di-handle?
- Time to first useful output: Berapa lama sampai dapat hasil yang bisa dipakai?

Step 4 — Pilih prompt dengan score lebih tinggi
```

### 8.3 Prompt Regression Testing

**Konsep:** Simpan prompt yang sudah terbukti bagus, test secara berkala untuk memastikan masih menghasilkan output yang sama setelah model update.

```
Prompt Registry:
{
  "name": "create-rest-endpoint",
  "version": "1.0",
  "prompt": "Buat REST endpoint...",
  "expected_output": "File dengan struktur...",
  "test_date": "2024-01-15",
  "model": "claude-3.5-sonnet",
  "status": "passing"
}

Regression Test:
1. Jalankan prompt registry dengan model terbaru
2. Compare output dengan expected_output
3. Jika berbeda signifikan → investigate, update prompt atau expected_output
4. Update status dan test_date
```

---

## 9. Prompt Cookbook

### 9.1 Web Development

```
Cookbook 1 — Create React Component:
"Buat React component [NamaComponent] dengan:
- Props: [list props dengan tipe]
- State: [list state]
- Features: [list fitur]
- Styling: [Tailwind/CSS Modules/styled-components]
- Accessibility: ARIA labels, keyboard navigation
- Export: named export
File: @src/components/[NamaComponent].tsx"

Cookbook 2 — API Integration:
"Buat custom React hook use[Resource] untuk integrasi API:
- Base URL: [URL]
- Methods: [GET, POST, PUT, DELETE]
- Features: loading state, error state, caching, retry
- TypeScript: full type safety
- Error handling: network error, HTTP error, timeout
File: @src/hooks/use[Resource].ts"

Cookbook 3 — Form Validation:
"Buat form [NamaForm] dengan validasi:
- Fields: [list field dengan tipe dan validasi rules]
- Library: [React Hook Form + Zod / Formik + Yup]
- Features: real-time validation, error messages, submit handling
- Accessibility: label association, error announcement
File: @src/components/[NamaForm].tsx"
```

### 9.2 Database & Backend

```
Cookbook 4 — Database Schema:
"Buat Prisma schema untuk [domain] dengan:
- Models: [list model dengan relasi]
- Fields: [list field per model dengan tipe dan constraint]
- Relations: [one-to-many, many-to-many]
- Indexes: [list index untuk optimasi]
- Enums: [list enum]
File: @prisma/schema.prisma"

Cookbook 5 — Authentication:
"Buat sistem authentication dengan:
- Method: [JWT / Session / OAuth2]
- Features: login, register, logout, refresh token, password reset
- Security: password hashing, rate limiting, CSRF protection
- Storage: [cookie / localStorage / httpOnly cookie]
- TypeScript: full type safety
Files: @src/auth/*"

Cookbook 6 — File Upload:
"Buat fitur file upload dengan:
- Max size: [X MB]
- Allowed types: [list MIME types]
- Storage: [local / S3 / Google Cloud Storage]
- Features: progress bar, cancel, retry, preview
- Security: file type validation, size check, virus scan
Files: @src/upload/*"
```

### 9.3 Data Processing

```
Cookbook 7 — CSV Import:
"Buat fitur import data dari CSV dengan:
- File: upload CSV, parse, validate, insert ke database
- Validation: check required fields, data type, duplicate
- Error handling: skip invalid rows, log error, continue
- Progress: show progress bar, estimated time
- Output: summary (success, failed, skipped)
Files: @src/import/*"

Cookbook 8 — Report Generation:
"Buat fitur generate laporan dengan:
- Data source: [database query / API]
- Format: [PDF / Excel / CSV]
- Filters: [date range, category, status]
- Features: pagination, sorting, export, preview
- Template: [deskripsi format laporan]
Files: @src/reports/*"

Cookbook 9 — Data Transformation:
"Buat pipeline transformasi data:
- Input: [format dan sumber data]
- Steps: [list transformasi step by step]
- Output: [format dan destination]
- Error handling: log, retry, skip
- Performance: batch processing, streaming
Files: @src/pipeline/*"
```

### 9.4 Testing & Quality

```
Cookbook 10 — Unit Test Suite:
"Buat unit test suite untuk [module]:
- Framework: [jest/vitest/pytest]
- Coverage target: [X%]
- Test types: unit, integration
- Mock: [list dependencies yang di-mock]
- Structure: describe/it blocks, AAA pattern
Files: @src/__tests__/[module].test.ts"

Cookbook 11 — E2E Test:
"Buat E2E test untuk flow [nama flow]:
- Tool: [Playwright / Cypress]
- Browser: [Chrome / Firefox]
- Steps: [list step user journey]
- Assertions: [list expected outcomes]
- Fixtures: [setup/teardown data]
Files: @e2e/[flow].spec.ts"

Cookbook 12 — Performance Test:
"Buat performance test untuk [endpoint/fitur]:
- Tool: [k6 / Artillery / Lighthouse]
- Scenarios: [normal load, peak load, stress test]
- Metrics: response time, throughput, error rate
- Thresholds: [acceptance criteria per metric]
Files: @tests/performance/[name].js"
```

### 9.5 DevOps & Infrastructure

```
Cookbook 13 — Docker Setup:
"Buat Docker setup untuk project [nama]:
- Base image: [node:20-alpine / python:3.12-slim]
- Multi-stage build: yes
- Layers: optimize untuk cache
- Health check: endpoint /health
- Docker Compose: app + database + redis
Files: Dockerfile, docker-compose.yml"

Cookbook 14 — CI/CD Pipeline:
"Buat CI/CD pipeline untuk project [nama]:
- Platform: [GitHub Actions / GitLab CI]
- Stages: lint → test → build → deploy
- Triggers: push to main, PR, tag
- Environment: dev, staging, production
- Notifications: Slack on failure
Files: .github/workflows/ci.yml"

Cookbook 15 — Monitoring Setup:
"Buat monitoring setup untuk aplikasi [nama]:
- Metrics: response time, error rate, CPU, memory
- Tool: [Prometheus + Grafana / Datadog]
- Alerts: threshold-based, anomaly detection
- Dashboard: overview, per-service, per-endpoint
- Logging: structured JSON, correlation ID
Files: [config files]"
```

---

## 10. Real-World Before/After Comparisons

### Comparison 1: Create Feature

```
BEFORE (❌ Score: 8/25):
"Buat fitur login"

Masalah:
- Tidak ada tech stack → AI bisa pilih apapun
- Tidak ada auth method → JWT? Session? OAuth?
- Tidak ada security requirements
- Tidak ada UI specification
- Tidak ada error handling spec

AFTER (✅ Score: 22/25):
"Buat fitur login dengan spesifikasi:

Tech: Next.js 14 App Router, TypeScript, Tailwind CSS
Auth: JWT dengan httpOnly cookie, bcrypt untuk password hashing

UI:
- Form dengan email dan password
- Show/hide password toggle
- 'Remember me' checkbox
- 'Forgot password' link
- Loading state saat submit
- Error message di bawah field yang invalid

Validation:
- Email: format valid, required
- Password: min 8 karakter, required

Security:
- Rate limiting: 5 attempts per 15 menit
- CSRF protection
- Password tidak di-log

Error handling:
- Invalid credentials → 'Email atau password salah'
- Account locked → 'Akun terkunci, coba lagi dalam X menit'
- Network error → 'Koneksi gagal, periksa internet Anda'

Files:
@src/app/login/page.tsx
@src/app/api/auth/login/route.ts
@src/lib/auth.ts"
```

### Comparison 2: Fix Bug

```
BEFORE (❌ Score: 6/25):
"Error di halaman absensi, fix dong"

Masalah:
- Tidak ada error message
- Tidak ada file reference
- Tidak ada reproduction steps
- Tidak ada context

AFTER (✅ Score: 21/25):
"Fix bug di halaman absensi:

Error: 'TypeError: Cannot read properties of undefined (reading 'length')'
File: @src/pages/absensi/index.tsx:67
Browser: Chrome 120, Windows 11

Reproduction steps:
1. Login sebagai guru
2. Klik menu 'Absensi'
3. Pilih kelas 'XII IPA 1'
4. Error muncul saat data loading

Kode terkait:
@src/pages/absensi/index.tsx (line 60-75)
@src/services/absensi.ts (fungsi getAbsensiByKelas)

Yang sudah dicoba:
- Refresh halaman → error tetap
- Clear cache → error tetap
- Cek network tab → API return 200 dengan data

Analisis yang diminta:
1. Root cause
2. Fix
3. Test case untuk verify"
```

### Comparison 3: Refactor

```
BEFORE (❌ Score: 7/25):
"Refactor code ini biar lebih bagus"

Masalah:
- "Lebih bagus" subjektif
- Tidak ada metric untuk "bagus"
- Tidak ada constraint

AFTER (✅ Score: 20/25):
"Refactor fungsi processLaporanBOS di @src/services/laporan.ts:

Masalah saat ini:
- Fungsi 180 lines, terlalu panjang
- Cyclomatic complexity: 22 (target: < 10)
- 4 level nested if
- Magic numbers: 12, 45, 100 tanpa penjelasan
- Side effect: langsung write ke file tanpa return value

Yang diminta:
1. Pecah menjadi fungsi-fungsi kecil (max 30 lines per fungsi)
2. Extract magic numbers ke constants
3. Ubah dari side effect ke pure function (return data, caller yang write)
4. Tambahkan type definitions
5. JSDoc untuk setiap public function

Constraints:
- Jangan ubah output format
- Semua existing test harus pass
- Performance tidak boleh turun (benchmark sebelum/sesudah)

Files:
@src/services/laporan.ts
@src/__tests__/laporan.test.ts"
```

---

## 11. Complete Prompt Examples with Expected Outputs

### Example 1: Create CRUD API

```
Prompt:
"Buat CRUD API lengkap untuk resource 'siswa' dengan FastAPI.

Requirements:
- Model: Siswa(id: int, nisn: str unique, nama: str, ttl: date, alamat: str)
- Endpoints: GET /siswa, GET /siswa/{id}, POST /siswa, PUT /siswa/{id}, DELETE /siswa/{id}
- Pagination: page, limit query params
- Search: nama query param (case-insensitive partial match)
- Validation: Pydantic models
- Error handling: HTTPException dengan detail message
- Database: SQLite via SQLAlchemy

Output: Lengkap dengan models, schemas, crud, routes, main.py"

Expected Output:
- 5 file: models.py, schemas.py, crud.py, routes.py, main.py
- Setiap endpoint dengan proper error handling
- Pagination dan search implemented
- Pydantic validation untuk request/response
```

### Example 2: Write Unit Tests

```
Prompt:
"Buat unit test untuk fungsi calculateGrade di @src/utils/grade.ts

Fungsi signature:
function calculateGrade(score: number): { grade: string, predicate: string, passed: boolean }

Rules:
- 90-100: A (Sangat Baik, passed: true)
- 80-89: B (Baik, passed: true)
- 70-79: C (Cukup, passed: true)
- 60-69: D (Kurang, passed: false)
- 0-59: E (Sangat Kurang, passed: false)
- Invalid score (< 0 or > 100): throw Error

Framework: Vitest
Coverage: 100% branch coverage"

Expected Output:
- File: src/utils/__tests__/grade.test.ts
- Test cases: valid scores (A-E), boundary values (0, 59, 60, 69, 70, 79, 80, 89, 90, 100), invalid scores (-1, 101, NaN, null)
- AAA pattern (Arrange, Act, Assert)
```

### Example 3: Explain Complex Code

```
Prompt:
"Jelaskan kode berikut dengan level penjelasan untuk developer junior:

@src/middleware/auth.ts

Yang ingin dipahami:
1. Apa tujuan middleware ini?
2. Bagaimana alur dari request masuk sampai decision allow/deny?
3. Apa itu JWT dan bagaimana verifikasi bekerja?
4. Apa yang terjadi jika token invalid?
5. Bagaimana cara test middleware ini?"

Expected Output:
- Penjelasan high-level purpose
- Step-by-step flow dengan diagram teks
- Penjelasan JWT concept sederhana
- Error scenarios dan handling
- Contoh test code
```

### Example 4: Database Migration

```
Prompt:
"Buat Prisma migration untuk perubahan berikut:

1. Tambah tabel 'keuangan' dengan kolom:
   - id: String @id @default(uuid())
   - jenis: Enum (pemasukan, pengeluaran)
   - jumlah: Float
   - keterangan: String
   - tanggal: DateTime
   - bukti_transaksi: String? (nullable)
   - created_at: DateTime @default(now())

2. Tambah relasi: keuangan bisa di-link ke user yang input (created_by)

3. Tambah index pada (jenis, tanggal) untuk query laporan

Output: schema.prisma yang sudah diupdate + penjelasan perubahan"

Expected Output:
- Updated prisma/schema.prisma
- Enum JenisTransaksi
- Model Keuangan dengan relasi ke User
- Index composite pada jenis + tanggal
- Penjelasan setiap perubahan
```

### Example 5: Security Fix

```
Prompt:
"Fix security vulnerability di kode berikut:

@src/routes/user.ts

Vulnerability: SQL Injection di search endpoint
Current code: query = `SELECT * FROM users WHERE name LIKE '%${search}%'`

Yang diminta:
1. Fix dengan parameterized query
2. Input validation untuk search parameter
3. Rate limiting untuk endpoint ini
4. Logging untuk monitoring suspicious activity

Framework: Express.js
Database: PostgreSQL dengan node-postgres"

Expected Output:
- Fixed code dengan $1 parameterized query
- Input validation (max length, allowed characters)
- Rate limiting middleware (express-rate-limit)
- Security logging
- Penjelasan vulnerability dan fix
```

### Example 6: Performance Optimization

```
Prompt:
"Optimasi performa endpoint GET /api/laporan/keuangan

Current performance:
- Response time: 3.5 seconds
- Data volume: 50,000 rows
- Query: SELECT * FROM transaksi WHERE tanggal BETWEEN ? AND ?

Constraints:
- Jangan ubah response format
- Database: PostgreSQL
- ORM: Prisma

Yang diminta:
1. Analisis bottleneck (EXPLAIN ANALYZE)
2. Rekomendasi index
3. Optimized query dengan pagination
4. Caching strategy
5. Estimated improvement"

Expected Output:
- EXPLAIN ANALYZE output interpretation
- Index recommendation: CREATE INDEX idx_transaksi_tanggal ON transaksi(tanggal)
- Paginated query dengan cursor-based pagination
- Redis caching strategy (cache per date range, TTL 1 hour)
- Estimated: 3.5s → <200ms
```

### Example 7: API Design

```
Prompt:
"Design REST API untuk sistem perpustakaan sekolah.

Resources: Buku, Anggota, Peminjaman, Pengembalian

Requirements:
- Buku: CRUD + search by judul/penulis/ISBN
- Anggota: CRUD + search by nama/NIS
- Peminjaman: create, list active, list history
- Pengembalian: create, calculate denda (Rp1000/hari)
- Authentication: JWT
- Pagination: cursor-based
- Filtering dan sorting

Output:
1. Endpoint list lengkap
2. Request/response schema untuk setiap endpoint
3. Error response format
4. Contoh curl command untuk setiap endpoint"

Expected Output:
- 15+ endpoints dengan method, path, description
- JSON schema untuk request dan response
- Standard error format {code, message, details}
- curl examples
```

### Example 8: Write Documentation

```
Prompt:
"Buat dokumentasi API untuk endpoint absensi.

Endpoint: POST /api/v1/absensi
Request: {siswa_id: string, status: 'hadir'|'sakit'|'izin'|'alpha', tanggal?: string}
Response 201: {id, siswa_id, status, tanggal, created_at}
Response 400: {error: string, details: string[]}
Response 404: {error: string}
Response 409: {error: string}

Audience: Developer yang akan integrate dengan API ini
Format: Markdown dengan contoh code"

Expected Output:
- Overview section
- Authentication requirements
- Request format dengan examples
- Response format untuk setiap status code
- Code examples (curl, JavaScript, Python)
- Error handling guide
- FAQ section
```

### Example 9: Debug Production Issue

```
Prompt:
"Debug production issue berikut:

Symptom: API response time spike dari 200ms ke 5000ms mulai jam 10:00 WIB
Affected: Semua endpoint yang query tabel 'absensi'
Duration: 30 menit, lalu normal kembali
Frequency: Terjadi 3x dalam seminggu terakhir, selalu jam 10:00

Infrastructure:
- Database: PostgreSQL 15, 8GB RAM
- App: Node.js 20, 4 instances
- Monitoring: Prometheus + Grafana

Data yang tersedia:
- Slow query log: ada query absensi dengan duration > 4s
- Connection pool: 80% usage saat spike
- CPU: normal (20%)
- Memory: normal (60%)

Analisis yang diminta:
1. Root cause hypothesis
2. Cara verify hypothesis
3. Short-term fix
4. Long-term prevention"

Expected Output:
- Hypothesis: Scheduled report generation jam 10:00 causing heavy query
- Verification: Check cron jobs, scheduled tasks, report generation logs
- Short-term: Add index, optimize report query, stagger schedule
- Long-term: Read replica untuk reporting, query optimization, connection pool tuning
```

### Example 10: Code Review

```
Prompt:
"Review kode berikut untuk production readiness:

@src/services/payment.ts

Checklist:
1. Error handling: comprehensive?
2. Input validation: semua input validated?
3. Security: no injection, proper auth?
4. Performance: no N+1, efficient queries?
5. Idempotency: safe untuk retry?
6. Logging: cukup untuk debugging?
7. Testing: testable architecture?

Severity: critical/high/medium/low
Format: tabel dengan issue, severity, suggestion"

Expected Output:
- Tabel review dengan 5-10 temuan
- Severity distribution
- Specific line references
- Actionable suggestions
- Overall readiness assessment
```

### Example 11: Feature Extension

```
Prompt:
"Extend fitur absensi yang sudah ada dengan fitur 'rekap bulanan'.

Existing code:
@src/services/absensi.service.ts (CRUD absensi)
@src/models/absensi.model.ts (model)

New feature requirements:
- Endpoint: GET /api/v1/absensi/rekap?bulan=X&tahun=Y&kelas=Z
- Output: {
    total_hadir: number,
    total_sakit: number,
    total_izin: number,
    total_alpha: number,
    persentase_kehadiran: number,
    detail_per_siswa: [{siswa_id, nama, hadir, sakit, izin, alpha, persentase}]
  }
- Cache: 1 jam per kombinasi bulan/tahun/kelas
- Export: tambahkan query param ?format=csv untuk download

Constraints:
- Jangan ubah existing CRUD endpoints
- Gunakan fungsi existing, jangan duplicate logic
- Add unit test"

Expected Output:
- New service method getRekapBulanan
- New endpoint di routes
- Redis caching implementation
- CSV export functionality
- Unit tests
```

### Example 12: Architecture Decision

```
Prompt:
"Bantu saya pilih arsitektur untuk fitur notifikasi real-time.

Context:
- Aplikasi: Sistem informasi sekolah
- Users: 500 guru dan staff
- Notifikasi: absensi baru, pengumuman, jadwal berubah
- Current stack: Node.js + Express + PostgreSQL
- Frontend: React

Options to compare:
1. WebSocket (Socket.io)
2. Server-Sent Events (SSE)
3. Polling (set interval)
4. Web Push API

Untuk setiap option, analisis:
- Implementasi complexity
- Server resource usage
- Client compatibility
- Scalability
- Fallback mechanism
- Cost

Recommendation dengan alasan."

Expected Output:
- Comparison table dengan 5 kriteria per option
- Pros/cons setiap option
- Recommendation: SSE untuk use case ini (simple, one-way, low resource)
- Implementation sketch
```

### Example 13: Data Migration Script

```
Prompt:
"Buat script migrasi data dari format lama ke format baru.

Old format (CSV):
nis,nama,kelas,alamat
"12345","Budi","XII IPA 1","Jl. Merdeka 1"

New format (JSON, untuk API):
{
  "nisn": "12345",
  "nama": "Budi",
  "kelas": {"kode": "XII-IPA-1", "nama": "XII IPA 1"},
  "alamat": {"jalan": "Jl. Merdeka 1", "kota": "Bandung Barat"}
}

Requirements:
- Read CSV dari file
- Transform ke format baru
- Validate setiap row
- Log error untuk invalid rows
- Write JSON ke output file
- Progress indicator

Language: Node.js
Library: csv-parser (sudah terinstall)"

Expected Output:
- Script migrasi lengkap
- Validation logic
- Error logging
- Progress indicator (console.log setiap 100 rows)
- Usage instructions
```

### Example 14: Error Recovery

```
Prompt:
"Buat error recovery mechanism untuk fitur import data CSV.

Scenario:
- User upload CSV dengan 1000 rows
- Row 500 invalid (format salah)
- Row 700 duplicate (NISN sudah ada)
- Row 900 valid

Expected behavior:
- Continue processing setelah error
- Log error per row
- Report summary di akhir
- User bisa download error report

Requirements:
- Fungsi processCSVWithRecovery(file: File): Promise<ImportResult>
- ImportResult: {success: number, failed: number, errors: ErrorReport[]}
- ErrorReport: {row: number, data: string, error: string}
- Max error sebelum abort: 50% rows

Framework: Node.js + Express"

Expected Output:
- processCSVWithRecovery function
- Row-by-row processing dengan try/catch
- Error accumulation
- Summary generation
- Error report download endpoint
```

### Example 15: Integration Test

```
Prompt:
"Buat integration test untuk flow lengkap: login → create absensi → get rekap.

Flow:
1. POST /api/auth/login → dapat token
2. POST /api/v1/absensi dengan token → create absensi
3. GET /api/v1/absensi/rekap → dapat rekap
4. Verify rekap includes absensi yang baru dibuat

Requirements:
- Framework: Jest + Supertest
- Database: test database (reset sebelum setiap test)
- Mock: external services (email, SMS)
- Cleanup: hapus data test setelah test selesai

Files:
@src/__tests__/integration/absensi-flow.test.ts
@src/__tests__/setup.ts (database setup)"

Expected Output:
- Test file dengan describe/it blocks
- Database setup dan teardown
- Auth token management
- Flow test dengan assertions
- Cleanup logic
```

---

## ✅ CHECKLIST

### Fundamental
- [ ] Paham 5 dimensi spesifisitas (teknologi, fungsi, data, validasi, error)
- [ ] Tahu 5 layer context yang diperlukan (project, tech stack, existing code, business rules, constraints)
- [ ] Bisa menulis constraints untuk 5 kategori (technology, architecture, style, security, performance)
- [ ] Paham cara memberikan contoh input/output yang efektif
- [ ] Tahu cara menspesifikasikan format output

### Advanced Techniques
- [ ] Bisa menggunakan Chain of Thought untuk task kompleks
- [ ] Paham Tree of Thoughts untuk perbandingan multiple pendekatan
- [ ] Bisa menggunakan ReAct untuk debugging sistematis
- [ ] Tahu kapan pakai Few-Shot vs Zero-Shot
- [ ] Bisa menggunakan Self-Consistency untuk memilih solusi terbaik

### Templates & Patterns
- [ ] Punya 10+ prompt template yang siap pakai
- [ ] Tahu cara customize template untuk kebutuhan spesifik
- [ ] Paham prompt anti-patterns dan cara menghindarinya
- [ ] Bisa melakukan A/B testing untuk prompt

### Context Management
- [ ] Tahu berapa banyak context yang optimal
- [ ] Paham prioritas context (MUST/SHOULD/NICE/AVOID)
- [ ] Bisa menggunakan @file reference dengan benar
- [ ] Tahu strategi chunking dan progressive disclosure
- [ ] Tahu kapan harus start fresh conversation

### Iteration & Testing
- [ ] Bisa menggunakan prompt quality scorecard
- [ ] Tahu cara debugging bad outputs
- [ ] Paham prompt refinement patterns
- [ ] Bisa melakukan prompt regression testing
- [ ] Punya prompt registry untuk prompt yang sudah terbukti

---

## 📚 REFERENSI

- [Anthropic — Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [analyticalrohit/awesome-vibe-coding-guide](https://github.com/analyticalrohit/awesome-vibe-coding-guide) — Prompt patterns dan best practices untuk vibe coding
- [Google — Prompt Design Best Practices](https://ai.google.dev/gemini-api/docs/prompting-strategies)
- [OpenAI — Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)

---

> **Lanjut ke:** [`04-testing-debugging-lanjut.md`](./04-testing-debugging-lanjut.md)
> **Kembali ke:** [`02-context-management.md`](./02-context-management.md)
