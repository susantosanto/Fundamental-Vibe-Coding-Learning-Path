# B1: Development Daily — Panduan Lengkap Pengembangan Harian dengan AI

> **Plan Agent memahami kode → Build Agent menulis fitur → AI memperbaiki Bug**

**Estimasi**: 25 menit belajar + 25 menit praktik | **Level**: Intermediate

---

## 🎯 Outcome Pembelajaran

Setelah menyelesaikan modul ini, Anda akan mampu:

- **Memahami codebase asing** dengan cepat menggunakan strategi AI-assisted code reading
- **Mengembangkan fitur baru** secara efisien dengan workflow Plan → Build
- **Melokalisasi dan memperbaiki bug** dengan pendekatan sistematis berbasis root cause analysis
- **Menguasai workflow Plan → Build** untuk semua skenario pengembangan harian
- **Melakukan code review** dengan bantuan AI tanpa kehilangan kualitas inspeksi manual
- **Membuat dokumentasi** otomatis: README, API docs, inline comments, ADR
- **Menulis dan meningkatkan test coverage** dengan strategi AI-assisted testing
- **Melakukan refactoring aman** dengan pola incremental dan test-first approach

---

## 🔑 Konsep Inti

### Dev Workflow dengan AI

```
Memahami Kode (Plan) → Merancang Solusi (Plan) → Implementasi (Build) → Verifikasi & Test (Build) → Review & Dokumentasi (Plan+Build)
```

Setiap fase memiliki karakteristik berbeda dan membutuhkan pendekatan AI yang berbeda:

| Fase | Agent | Tujuan | Output |
|------|-------|--------|--------|
| Memahami Kode | Plan | Analisis struktur & arsitektur | Peta kode, dependency graph |
| Merancang Solusi | Plan | Breakdown task & opsi implementasi | Rencana langkah demi langkah |
| Implementasi | Build | Menulis kode fungsional | Kode yang berjalan |
| Verifikasi | Build | Test & validasi | Test passing, bug fixed |
| Review | Plan+Build | Quality check & dokumentasi | Code review notes, docs |

### 3 Skenario Pengembangan Harian

| Skenario | Agent Sequence | Operasi Utama | Contoh |
|----------|----------------|---------------|--------|
| Memahami kode baru | Plan | `@file` analisis, `@explore` eksplorasi | Onboarding di proyek baru |
| Fitur baru | Plan → Build | Analisis → Step-by-step implementasi | Tambah fitur email notification |
| Fix Bug | Plan → Build | Root cause analysis → Fix → Verifikasi | Login loading terus |

### Syntax Penting dalam Workflow

- **`@path`**: Inject konten file ke konteks AI. Gunakan untuk file spesifik yang ingin dianalisis.
- **`@explore`**: Perintah eksplorasi untuk memahami struktur proyek secara keseluruhan.
- **`!command`**: Execute command langsung di terminal (misal: `!npm test`, `!git status`).
- **`/undo`**: Undo perubahan terakhir (memerlukan Git terkonfigurasi).
- **`/diff`**: Lihat perubahan yang belum di-commit.

### Referensi Tambahan

- **vbgate/learn-opencode**: Panduan penggunaan OpenCode untuk developer
- **analyticalrohit/awesome-vibe-coding-guide**: Koleksi best practices vibe coding

---

## 📖 Bagian 1: Memahami Codebase dengan AI

### 1.1 Strategi Membaca Kode yang Tidak Dikenal

Ketika Anda pertama kali membuka proyek baru, jangan langsung membaca file satu per satu. Gunakan strategi berlapis:

#### Layer 1: Peta Makro (Top-Down)

Mulai dari struktur direktori untuk memahami arsitektur secara keseluruhan:

```
@explore Bantu saya pahami struktur proyek ini secara menyeluruh:
1. Daftar direktori utama dan fungsinya masing-masing
2. Entry point aplikasi (file utama yang pertama dijalankan)
3. Tech stack yang digunakan (framework, library, database)
4. Pola arsitektur yang terlihat (MVC, layered, microservices, dll)
5. Konfigurasi utama (package.json, tsconfig, env files)
```

#### Layer 2: Dependency Mapping

Setelah memahami struktur, petakan hubungan antar modul:

```
Analisis dependency dan hubungan antar modul di proyek ini:
1. Modul mana yang paling banyak di-import oleh modul lain (central module)?
2. Apakah ada circular dependency?
3. Bagaimana flow data dari entry point sampai ke output?
4. Modul mana yang independent dan bisa di-refactor tanpa efek samping?
```

#### Layer 3: Deep Dive Per Modul

Setelah peta makro jelas, fokus pada modul yang relevan dengan tugas Anda:

```
@src/services/auth.ts Jelaskan modul auth ini secara detail:
1. Apa tanggung jawab utama modul ini?
2. Semua exported function/method dan fungsinya
3. Dependency internal (modul lain yang di-import)
4. Dependency eksternal (library pihak ketiga)
5. State management yang digunakan
6. Error handling pattern
```

### 1.2 Architecture Discovery

Gunakan AI untuk mengidentifikasi pola arsitektur yang mungkin tidak langsung terlihat:

```
Analisis pola arsitektur di proyek ini:
1. Apakah mengikuti Clean Architecture, Hexagonal, atau pola lain?
2. Bagaimana separation of concern diimplementasikan?
3. Di mana business logic berada? Di mana infrastructure code?
4. Apakah ada violation terhadap prinsip SOLID yang terlihat?
5. Bagaimana dependency injection atau inversion of control diimplementasikan?
```

### 1.3 Code Navigation dengan AI

Tips navigasi efisien:

- **Gunakan `grep`** untuk menemukan definisi function/class sebelum meminta AI menjelaskan
- **Gunakan `glob`** untuk menemukan semua file terkait suatu fitur
- **Gunakan `@file`** untuk file yang sudah Anda identifikasi penting
- **Jangan load semua file sekaligus** — AI akan bingung dengan konteks terlalu besar

### 1.4 Membaca Kode Legacy

Kode legacy biasanya tidak memiliki dokumentasi. Gunakan pendekatan ini:

```
Saya sedang membaca kode legacy di @src/legacy/processor.js.
Bantu saya memahami:
1. Apa yang dilakukan fungsi processOrder() secara step-by-step?
2. Mengapa ada banyak conditional branching di sini?
3. Apakah ada code smell atau anti-pattern yang terlihat?
4. Bagaimana cara aman memodifikasi fungsi ini tanpa break existing behavior?
```

---

## 📋 Bagian 2: Daily Developer Workflow dengan AI

### 2.1 Morning Standup Preparation

Sebelum memulai kerja, gunakan AI untuk mempersiapkan daily standup:

```
Bantu saya prepare daily standup. Berikut konteks saya:
- Kemarin: Saya mengerjakan fitur email notification (80% selesai)
- Hari ini: Selesaikan email notification, mulai unit test untuk auth module
- Blocker: SMTP credentials belum diberikan oleh tim infra

Format output:
1. Yesterday: [ringkasan]
2. Today: [rencana]
3. Blockers: [jika ada]
4. Estimated completion: [timeline]
```

### 2.2 Task Breakdown

Sebelum coding, breakdown task besar menjadi langkah-langkah kecil:

```
Saya perlu implementasi fitur "User Profile Management" yang mencakup:
- Edit profil (nama, email, foto)
- Ganti password
- Lihat riwayat login
- Export data pribadi (GDPR compliance)

Breakdown menjadi task-task kecil yang bisa dikerjakan dalam 1-2 jam masing-masing.
Untuk setiap task, sebutkan:
1. Estimasi waktu
2. File yang akan diubah
3. Dependency antar task
4. Risk/potential issue
```

### 2.3 Implementation Phase

Setelah task breakdown jelas, masuk ke fase implementasi dengan Build Agent:

```
Mulai implementasi Task 1: Edit profil (nama, email, foto)

Step 1: Buat API endpoint PUT /api/users/:id/profile
- Validasi input (nama max 100 char, email format valid)
- Update database
- Return updated profile

Step 2: Buat frontend form component
- Form dengan field: nama, email, upload foto
- Validasi client-side
- Handle upload foto (max 5MB, jpg/png only)

Kerjakan step 1 dulu, tunggu konfirmasi saya sebelum lanjut ke step 2.
```

### 2.4 Review Phase

Setelah implementasi selesai, lakukan self-review dengan bantuan AI:

```
Review kode yang baru saya tulis di @src/controllers/profileController.ts:
1. Apakah ada security vulnerability (SQL injection, XSS, dll)?
2. Apakah error handling sudah adequate?
3. Apakah ada edge case yang terlewat?
4. Apakah naming convention konsisten?
5. Apakah ada opportunity untuk simplifikasi?
```

### 2.5 Commit Preparation

Siapkan commit message yang informatif:

```
Buatkan commit message untuk perubahan berikut:
- File baru: src/services/emailService.ts
- File diubah: src/controllers/authController.ts (tambah kirim email setelah register)
- File diubah: src/config/email.ts (tambah konfigurasi SMTP)

Gunakan format Conventional Commits. Sertakan:
1. Subject line (max 72 character)
2. Body dengan bullet points perubahan
3. Breaking changes (jika ada)
```

---

## 🚀 Bagian 3: Feature Development End-to-End

### 3.1 Dari Requirement hingga Deployment

Berikut walkthrough lengkap pengembangan fitur dengan AI assistance:

#### Phase 1: Requirement Analysis

```
Saya mendapat requirement berikut dari Product Manager:

"Sebagai user, saya ingin menerima email notifikasi ketika ada aktivitas mencurigakan di akun saya (login dari device baru, perubahan password, dll)."

Analisis requirement ini:
1. User story yang jelas (format: Sebagai... Saya ingin... Agar...)
2. Acceptance criteria (kapan fitur dianggap selesai?)
3. Edge cases yang perlu dipertimbangkan
4. Dependency dengan fitur yang sudah ada
5. Estimasi kompleksitas (S/M/L/XL)
```

#### Phase 2: Technical Design

```
Berdasarkan requirement email notifikasi aktivitas mencurigakan,
buat technical design document:

1. Arsitektur: Event-driven atau synchronous?
2. Data model: Tabel baru atau extend existing?
3. Email template: Hardcode atau dynamic?
4. Queue system: Langsung kirim atau via queue (Redis/SQS)?
5. Rate limiting: Bagaimana mencegah spam email?
6. Monitoring: Bagaimana track delivery rate?
7. Rollback plan: Bagaimana disable fitur jika ada masalah?
```

#### Phase 3: Implementation Plan

```
Buat implementasi plan detail untuk fitur email notifikasi:

Phase 1 (Hari 1): Setup infrastructure
- [ ] Buat email service module
- [ ] Setup SMTP configuration
- [ ] Buat email template dasar
- [ ] Unit test untuk email service

Phase 2 (Hari 2): Event detection
- [ ] Deteksi login dari device baru
- [ ] Deteksi perubahan password
- [ ] Deteksi perubahan email
- [ ] Integration test

Phase 3 (Hari 3): Integration & deployment
- [ ] Integrate dengan auth flow
- [ ] Feature flag untuk gradual rollout
- [ ] Monitoring & alerting
- [ ] Deployment ke staging
```

#### Phase 4: Step-by-Step Implementation

Kerjakan setiap step dengan Build Agent, satu per satu:

```
Implementasi Phase 1, Step 1: Buat email service module

File: src/services/notification/emailService.ts

Requirements:
- Gunakan nodemailer
- Support SMTP configuration dari environment variables
- Export fungsi: sendSecurityAlert(user, alertType, details)
- Include retry logic (max 3 retries dengan exponential backoff)
- Log setiap pengiriman email (success/failure)

Buat kode lengkap dengan TypeScript types dan error handling.
```

#### Phase 5: Testing

```
Buat unit test untuk emailService.ts yang sudah dibuat:

Test cases yang perlu dicover:
1. ✅ Email terkirim sukses
2. ❌ SMTP connection gagal
3. ❌ Invalid email address
4. 🔄 Retry logic bekerja saat failure
5. 📧 Email template ter-render dengan benar
6. 📊 Logging tercatat dengan benar

Gunakan mocking untuk SMTP server. Pastikan coverage > 90%.
```

#### Phase 6: Deployment

```
Buat deployment checklist untuk fitur email notifikasi:

Pre-deployment:
- [ ] Semua test passing
- [ ] Code review approved
- [ ] Environment variables sudah diset di staging
- [ ] SMTP credentials verified

Deployment:
- [ ] Deploy ke staging
- [ ] Smoke test di staging
- [ ] Enable feature flag untuk 10% user
- [ ] Monitor error rate selama 1 jam
- [ ] Jika OK, enable untuk 50% user
- [ ] Jika OK, enable untuk 100% user

Post-deployment:
- [ ] Monitor delivery rate
- [ ] Cek bounce rate
- [ ] Monitor user complaint
- [ ] Dokumentasi di runbook
```

---

## 🐛 Bagian 4: Bug Triage dan Fixing

### 4.1 Pendekatan Sistematis

Jangan langsung fix bug. Gunakan pendekatan sistematis:

#### Step 1: Reproduksi Bug

```
User report bug: "Setelah login, halaman loading terus dan tidak redirect ke dashboard."

Bantu saya reproduksi bug ini:
1. Apa langkah-langkah untuk mereproduksi bug ini?
2. Kondisi apa yang memicu bug (browser, device, user role)?
3. Apakah bug intermittent atau consistent?
4. File mana yang kemungkinan menjadi penyebab?
```

#### Step 2: Root Cause Analysis

```
Analisis root cause untuk bug "loading terus setelah login":

File terkait:
@src/hooks/useAuth.ts
@src/components/ProtectedRoute.tsx
@src/services/auth.ts

Pertanyaan analisis:
1. Di mana state isLoading di-set dan di-reset?
2. Apakah ada race condition antara login dan redirect?
3. Apakah error handling di auth service memadai?
4. Apakah ada infinite loop di useEffect?
5. Apakah ada promise yang tidak di-resolve/reject?
```

#### Step 3: Verifikasi Root Cause

```
Saya menemukan bahwa di @src/hooks/useAuth.ts baris 45,
isLoading tidak di-set ke false ketika login gagal.

Verifikasi analisis saya:
1. Apakah ini memang root cause-nya?
2. Apakah ada faktor lain yang berkontribusi?
3. Bagaimana bug ini bisa lolos dari testing?
```

#### Step 4: Fix Implementation

```
Fix bug di @src/hooks/useAuth.ts:

Masalah: isLoading tidak di-reset ke false saat login gagal
Fix: Tambahkan setLoading(false) di catch block

Tambahkan juga:
- Error message yang jelas untuk user
- Retry mechanism setelah 3 detik
- Log error untuk debugging

Pastikan fix tidak break flow login yang sudah berjalan normal.
```

#### Step 5: Fix Verification

```
Verifikasi fix bug yang sudah diterapkan:

Test scenarios:
1. ✅ Login sukses → redirect ke dashboard
2. ❌ Login gagal (wrong password) → error message muncul, loading berhenti
3. ❌ Login gagal (network error) → error message muncul, retry button muncul
4. ⏰ Login timeout → error message muncul setelah timeout
5. 🔄 Login ulang setelah gagal → bisa login normal

Jalankan !npm test untuk memastikan semua test masih passing.
```

### 4.2 Bug Triage Framework

Ketika ada banyak bug, gunakan framework triage:

```
Bantu saya triage daftar bug berikut:

1. Login loading terus (reported: 15 user, severity: high)
2. Foto profil tidak tampil di mobile (reported: 3 user, severity: medium)
3. Export PDF format berantakan (reported: 8 user, severity: medium)
4. Notifikasi email telat 5 menit (reported: 1 user, severity: low)
5. Data tidak sync antar device (reported: 20 user, severity: critical)

Prioritaskan berdasarkan:
1. Impact (jumlah user terdampak)
2. Severity (dampak terhadap bisnis)
3. Effort (estimasi waktu fix)
4. Dependency (apakah fix satu bug mempengaruhi bug lain)

Output: Urutan prioritas + alasan + estimasi waktu fix
```

---

## 🔍 Bagian 5: Code Review dengan AI

### 5.1 Apa yang Bisa Ditanyakan ke AI

AI sangat efektif untuk review aspek-aspek berikut:

```
Review kode di @src/services/paymentService.ts dari perspektif:

1. **Security**: SQL injection, XSS, CSRF, auth bypass, data exposure
2. **Error Handling**: Semua error case tertangani? User mendapat feedback yang jelas?
3. **Performance**: N+1 query, memory leak, inefficient algorithm
4. **Edge Cases**: Empty input, null values, concurrent requests, timeout
5. **Best Practices**: SOLID principles, DRY, naming convention, code organization
6. **Maintainability**: Apakah kode mudah dipahami developer lain?
```

### 5.2 Apa yang Harus Dicek Manual

AI tidak bisa menggantikan review manual untuk:

- **Business logic correctness**: Apakah kode sesuai requirement bisnis?
- **User experience**: Apakah UX-nya intuitif?
- **Architecture fit**: Apakah solusi sesuai dengan arsitektur yang sudah ada?
- **Team conventions**: Apakah sesuai coding standard tim?
- **Security context**: Apakah ada konteks security spesifik yang hanya tim tahu?

### 5.3 Review Checklist dengan AI

```
Gunakan checklist berikut untuk code review:

## Code Review Checklist

### Functionality
- [ ] Kode melakukan apa yang seharusnya?
- [ ] Semua acceptance criteria terpenuhi?
- [ ] Edge cases ditangani?

### Security
- [ ] Input validation adequate?
- [ ] No hardcoded secrets?
- [ ] Authorization checks di semua endpoint?
- [ ] SQL injection / XSS prevention?

### Performance
- [ ] No N+1 queries?
- [ ] Database indexes adequate?
- [ ] No unnecessary computation?
- [ ] Caching strategy appropriate?

### Maintainability
- [ ] Naming conventions konsisten?
- [ ] Functions tidak terlalu panjang (< 50 lines)?
- [ ] Comments menjelaskan "mengapa", bukan "apa"?
- [ ] Code duplication minimal?

### Testing
- [ ] Unit tests untuk logic penting?
- [ ] Integration tests untuk API endpoints?
- [ ] Test coverage > 80%?
- [ ] Test cases mencakup edge cases?

### Documentation
- [ ] README updated (jika ada perubahan API)?
- [ ] API docs updated?
- [ ] Inline comments untuk logic kompleks?
```

---

## 🔧 Bagian 6: Refactoring dengan AI

### 6.1 Pola Refactoring Aman

#### Test-First Approach

Sebelum refactoring, pastikan test coverage adequate:

```
Saya ingin refactor fungsi processPayment() di @src/services/paymentService.ts
Fungsi ini 200 baris dan sulit dipahami.

Sebelum refactor:
1. Buat unit test yang comprehensif untuk fungsi ini
2. Test semua scenario: success, failure, timeout, invalid input
3. Pastikan semua test passing sebelum mulai refactor
4. Ini akan jadi safety net untuk memastikan behavior tidak berubah
```

#### Incremental Changes

Refactoring bertahap, bukan big-bang:

```
Refactor processPayment() secara incremental:

Step 1: Extract validation logic ke fungsi terpisah validatePayment()
- Jalankan test, pastikan masih passing

Step 2: Extract payment gateway call ke fungsi callPaymentGateway()
- Jalankan test, pastikan masih passing

Step 3: Extract response processing ke fungsi processPaymentResponse()
- Jalankan test, pastikan masih passing

Step 4: Simplifikasi fungsi utama dengan memanggil fungsi-fungsi baru
- Jalankan test, pastikan masih passing

Setiap step harus bisa di-commit secara terpisah.
```

### 6.2 Safe Refactoring Patterns

#### Pattern 1: Extract Function

```
Extract logic di @src/controllers/orderController.ts baris 45-80
menjadi fungsi terpisah calculateOrderTotal().

Fungsi baru harus:
- Menerima parameter: items, discount, tax
- Return: { subtotal, discount, tax, total }
- Include JSDoc comment
- Unit test terpisah
```

#### Pattern 2: Rename dengan Confidence

```
Saya ingin rename variabel 'data' di @src/services/userService.ts
menjadi 'userProfile' karena lebih deskriptif.

1. Cari semua penggunaan variabel 'data' di file ini
2. Pastikan tidak ada variabel 'data' lain yang ter-rename salah
3. Lakukan rename
4. Verifikasi dengan !npm run typecheck
```

#### Pattern 3: Extract Interface

```
Extract interface dari class PaymentService:

Buat interface IPaymentService dengan method:
- processPayment(order: Order): Promise<PaymentResult>
- refundPayment(paymentId: string): Promise<RefundResult>
- getPaymentStatus(paymentId: string): Promise<PaymentStatus>

Update class PaymentService untuk implement interface ini.
```

### 6.3 Refactoring Checklist

```
Refactoring checklist:

Sebelum refactor:
- [ ] Semua test passing
- [ ] Coverage adequate untuk area yang di-refactor
- [ ] Git commit clean (bisa revert jika perlu)
- [ ] Plan refactor sudah jelas (step-by-step)

Selama refactor:
- [ ] Setiap step kecil dan atomic
- [ ] Test dijalankan setelah setiap step
- [ ] Tidak ada perubahan behavior (hanya struktur)
- [ ] Commit setelah setiap step yang berhasil

Setelah refactor:
- [ ] Semua test masih passing
- [ ] Code review oleh teammate
- [ ] Performance tidak menurun
- [ ] Dokumentasi updated (jika API berubah)
```

---

## 📝 Bagian 7: Dokumentasi Generasi

### 7.1 README Generation

```
Buatkan README.md untuk proyek ini dengan struktur:

# Nama Proyek
> Deskripsi singkat (1-2 kalimat)

## Instalasi
```bash
# Step-by-step instalasi
```

## Usage
```bash
# Cara menjalankan
# Contoh penggunaan
```

## Struktur Proyek
```
# Tree struktur direktori dengan penjelasan singkat
```

## API Reference
# Endpoint utama dengan contoh request/response

## Development
# Cara setup development environment
# Cara menjalankan test
# Coding conventions

## Contributing
# Guidelines untuk contributor

## License
```

### 7.2 API Documentation

```
Generate API documentation untuk semua endpoint di @src/routes/api.ts:

Format per endpoint:
### `METHOD /path`
**Deskripsi**: [apa yang dilakukan endpoint ini]
**Auth**: [required/not required]
**Request**:
```json
{
  // contoh request body
}
```
**Response** (200):
```json
{
  // contoh response
}
```
**Error Responses**:
- 400: [kapan terjadi]
- 401: [kapan terjadi]
- 404: [kapan terjadi]
- 500: [kapan terjadi]
```

### 7.3 Inline Comments

```
Tambahkan inline comments di @src/services/paymentService.ts:

Rules:
1. Comment menjelaskan "mengapa", bukan "apa" (kode sudah menjelaskan "apa")
2. Jelaskan business logic yang tidak obvious dari kode
3. Tambahkan @todo untuk technical debt
4. Tambahkan @deprecated untuk fungsi yang akan dihapus
5. Gunakan JSDoc untuk semua exported functions

Format JSDoc:
/**
 * Deskripsi singkat fungsi
 * @param {Type} paramName - Deskripsi parameter
 * @returns {Type} Deskripsi return value
 * @throws {ErrorType} Kapan error dilempar
 * @example Contoh penggunaan
 */
```

### 7.4 Architecture Decision Records (ADR)

```
Buatkan ADR untuk keputusan berikut:

# ADR-001: Pemilihan Queue System untuk Email Notification

## Status
Accepted

## Context
Kita perlu sistem queue untuk mengirim email notifikasi secara async.
Opsi yang dipertimbangkan: Redis Bull Queue vs AWS SQS vs in-memory queue.

## Decision
Memilih Redis Bull Queue karena:
1. Sudah ada Redis di infrastructure
2. Easy to setup dan maintain
3. Support retry, rate limiting, dan job priority
4. Open source, no additional cost

## Consequences
**Positive**: Setup cepat, team sudah familiar dengan Redis
**Negative**: Redis jadi single point of failure, perlu monitoring ekstra
**Trade-off**: Tidak se-scaleable AWS SQS tapi adequate untuk current load
```

---

## 🧪 Bagian 8: AI-Assisted Testing

### 8.1 Unit Test Generation

```
Generate unit test untuk fungsi validateUserInput() di @src/validators/user.ts:

Test strategy:
1. Happy path: input valid → return true
2. Invalid email format → throw ValidationError
3. Nama kosong → throw ValidationError
4. Nama terlalu panjang (> 100 char) → throw ValidationError
5. Password terlalu lemah → throw ValidationError
6. Age di bawah 18 → throw ValidationError
7. Null/undefined input → throw ValidationError

Gunakan Jest dengan describe/it blocks.
Include setup (beforeEach) dan cleanup (afterEach).
Mock external dependencies.
```

### 8.2 Integration Test Generation

```
Generate integration test untuk endpoint POST /api/users/register:

Test scenarios:
1. ✅ Register dengan data valid → 201 Created, user tersimpan di DB
2. ❌ Email sudah terdaftar → 409 Conflict
3. ❌ Password tidak memenuhi requirement → 400 Bad Request
4. ❌ Missing required field → 400 Bad Request
5. 🔄 Rate limiting: 5 request dalam 1 menit → 429 Too Many Requests

Setup:
- Gunakan supertest untuk HTTP testing
- Gunakan test database (SQLite in-memory)
- Seed data sebelum test
- Cleanup database setelah test
- Mock email service (tidak kirim email sungguhan)
```

### 8.3 Test Coverage Improvement

```
Analisis test coverage di proyek ini:

1. File mana yang coverage-nya di bawah 80%?
2. Function mana yang belum di-test sama sekali?
3. Branch mana yang belum di-cover?
4. Prioritaskan file yang critical untuk business logic

Buat plan untuk meningkatkan coverage dari 65% ke 85%:
- Week 1: Cover semua service layer
- Week 2: Cover semua controller layer
- Week 3: Cover edge cases dan error paths
- Week 4: Integration tests untuk API endpoints
```

### 8.4 Test-Driven Development dengan AI

```
Saya ingin implementasi fitur "discount calculation" dengan TDD:

Step 1: Tulis test DULU (belum ada implementasi)
```typescript
describe('calculateDiscount', () => {
  it('should return 0 for orders below minimum', () => {
    expect(calculateDiscount(50000)).toBe(0);
  });
  it('should return 10% for orders above 100k', () => {
    expect(calculateDiscount(150000)).toBe(15000);
  });
  it('should return 20% for orders above 500k', () => {
    expect(calculateDiscount(600000)).toBe(120000);
  });
});
```
Test ini akan FAIL karena fungsi belum ada.

Step 2: Buat implementasi minimal agar test PASS
Step 3: Refactor jika perlu, pastikan test tetap PASS
Step 4: Ulangi untuk scenario berikutnya
```

---

## 🚀 Praktik Lengkap: Full Day Development dengan AI

### 08:00 — Morning Standup Preparation

```
Bantu saya prepare daily standup:
- Sprint: Week 3, Sprint 2
- Kemarin: Selesaikan API endpoint untuk user profile (PR #142 merged)
- Hari ini: Implementasi email notification untuk security alerts
- Blocker: Menunggu SMTP credentials dari tim infra (sudah follow up 2 hari)
```

### 08:30 — Codebase Understanding (Proyek Baru)

Anda ditugaskan untuk maintain proyek yang belum pernah Anda sentuh:

```
@explore Bantu saya onboard di proyek ini:
1. Apa tech stack utama?
2. Bagaimana struktur direktori?
3. Di mana entry point aplikasi?
4. Bagaimana cara menjalankan development server?
5. Di mana test files berada?
6. Apakah ada dokumentasi yang sudah ada?
```

Setelah mendapat overview, deep dive ke area yang akan Anda kerjakan:

```
@src/modules/auth/ Saya akan mengerjakan fitur email notification yang terkait
dengan auth module. Jelaskan:
1. Bagaimana auth flow saat ini bekerja?
2. Di mana saya perlu hook email notification?
3. Apakah ada event system yang sudah ada?
4. Bagaimana error handling di auth module?
```

### 09:30 — Task Breakdown & Planning

```
Saya perlu implementasi "Security Alert Email Notification":
- Kirim email saat login dari device baru
- Kirim email saat password diubah
- Kirim email saat email address diubah
- Email harus include: waktu, device info, lokasi (jika tersedia)
- User bisa disable notifikasi di settings

Breakdown menjadi task kecil dengan estimasi waktu.
Identifikasi dependency antar task.
Highlight risk dan mitigation.
```

### 10:00 — Implementation: Step 1 (Email Service)

Switch ke Build Agent:

```
Step 1: Buat email service module

File: src/services/email/emailService.ts

Requirements:
- Gunakan nodemailer
- Configuration dari environment variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
- Fungsi: sendSecurityAlert(user, alertType, metadata)
- Template email: HTML dengan branding perusahaan
- Retry logic: max 3 attempts dengan exponential backoff
- Logging: setiap attempt dan result

Buat kode lengkap dengan TypeScript types.
```

### 10:45 — Implementation: Step 2 (Event Detection)

```
Step 2: Integrasi deteksi device baru ke auth flow

File yang diubah: @src/services/auth/loginService.ts

Logic:
1. Saat login sukses, cek apakah device ini sudah dikenal
2. Device identification: kombinasi user agent + IP hash
3. Jika device baru, trigger sendSecurityAlert dengan type 'NEW_DEVICE_LOGIN'
4. Simpan device info ke database untuk referensi future login

Pastikan tidak mengganggu flow login yang sudah ada.
Email dikirim secara async (tidak blocking login response).
```

### 11:30 — Testing

```
Buat unit test untuk emailService.ts:

Test cases:
1. ✅ sendSecurityAlert berhasil mengirim email
2. ❌ SMTP connection refused → retry 3x lalu throw error
3. ❌ Invalid email format → throw ValidationError
4. 📧 Email template render dengan data yang benar
5. 📊 Logging tercatat dengan benar
6. ⏰ Timeout handling (SMTP tidak respond dalam 10 detik)

Gunakan jest + nodemailer-mock.
Target coverage: > 90%.
```

### 13:00 — Code Review (Self-Review dengan AI)

```
Review semua kode yang saya tulis hari ini:

Files:
@src/services/email/emailService.ts
@src/services/auth/loginService.ts (perubahan)
@src/services/email/__tests__/emailService.test.ts

Review dari perspektif:
1. Security: Ada vulnerability?
2. Performance: Ada bottleneck?
3. Maintainability: Mudah dipahami developer lain?
4. Testing: Coverage adequate? Edge cases ter-cover?
5. Error handling: Semua error case tertangani?

Berikan feedback spesifik dengan contoh kode.
```

### 14:00 — Bug Fix (Bug Report Masuk)

```
Bug report dari QA: "Email notification tidak terkirim untuk user dengan
email domain custom (bukan gmail/yahoo)."

Analisis:
@src/services/email/emailService.ts

Kemungkinan penyebab:
1. Regex validation terlalu strict untuk custom domain?
2. SMTP server reject custom domain?
3. DNS resolution issue untuk custom domain?

Bantu saya debug dan fix bug ini.
```

### 15:00 — Documentation

```
Update dokumentasi untuk fitur email notification:

1. README.md: Tambah section "Email Notification" di API Reference
2. Inline comments: Jelaskan logic deteksi device baru
3. ADR: Dokumentasi keputusan menggunakan nodemailer vs alternatif lain
4. Runbook: Cara troubleshooting email delivery issue
```

### 16:00 — Commit & Push

```
Buatkan commit message untuk semua perubahan hari ini:

Files changed:
- src/services/email/emailService.ts (new)
- src/services/email/emailTemplate.ts (new)
- src/services/auth/loginService.ts (modified)
- src/services/email/__tests__/emailService.test.ts (new)
- docs/api/README.md (modified)
- docs/adr/002-email-notification.md (new)

Gunakan Conventional Commits format.
Group changes menjadi logical commits jika perlu.
```

### 16:30 — Wrap Up & Tomorrow Planning

```
Bantu saya plan untuk besok:

Yang sudah selesai hari ini:
- ✅ Email service module
- ✅ Device detection integration
- ✅ Unit tests (92% coverage)
- ✅ Documentation

Yang perlu dilanjutkan besok:
- [ ] Integration test untuk auth + email flow
- [ ] Password change email notification
- [ ] Email change email notification
- [ ] User settings: toggle email notification
- [ ] Deployment ke staging

Prioritaskan task untuk besok pagi.
```

---

## 📋 Magic Prompt Templates

### Template 1: Code Explanation

```
## Role
Senior tech writer, ahli menjelaskan kode dengan jelas dan terstruktur.

## Task
Jelaskan kode yang diberikan secara komprehensif.

## Input
- Bahasa: Bahasa Indonesia
- Kode: @file atau paste kode
- Level pembaca: [pemula/intermediate/advanced]

## Output
1. **Ringkasan 1 kalimat** (≤50 kata)
2. **Penjelasan per blok**: Kode + Fungsi + Prinsip
3. **Konsep kunci**: Design pattern/algorithm yang digunakan
4. **Dependency analysis**: Modul yang di-import dan yang meng-import
5. **Potensi masalah**: 🔴Serius / 🟡Saran / 🟢Info
6. **Contoh penggunaan**: Cara memanggil fungsi utama
```

### Template 2: Feature Implementation

```
## Role
Fullstack developer senior, ahli mengubah requirement jadi kode production-ready.

## Task
Implementasi fitur step-by-step dengan kualitas production.

## Input
- Requirement: [deskripsi lengkap]
- Bahasa: TypeScript/JavaScript
- Framework: [framework yang digunakan]
- Tech stack: [database, queue, dll]

## Output per Step
1. **Tujuan step ini**: Apa yang dicapai
2. **Kode lengkap**: Production-ready code
3. **Cara verifikasi**: Test command atau manual check
4. **Preview step berikutnya**: Apa yang akan dilakukan selanjutnya

## Constraints
- Kode harus langsung runnable
- Include error handling yang adequate
- Naming convention yang jelas dan konsisten
- Tunggu konfirmasi sebelum lanjut ke step berikutnya
- Tidak mengubah kode di luar scope step
```

### Template 3: Bug Localization

```
## Role
Senior troubleshooting engineer dengan pengalaman 10+ tahun.

## Task
Analisis bug secara sistematis dan temukan root cause.

## Input
- Gejala: [deskripsi lengkap apa yang terjadi]
- Expected behavior: [seharusnya apa yang terjadi]
- Actual behavior: [kenyataannya apa yang terjadi]
- Error log: [stack trace, console log, server log]
- Related code: @file file-file terkait
- Steps to reproduce: [langkah reproduksi]

## Output
1. **Ringkasan masalah**: 1-2 kalimat
2. **Root cause analysis**: Sorted by probability (tinggi → rendah)
   - Penyebab 1: [penjelasan] + [bukti]
   - Penyebab 2: [penjelasan] + [bukti]
3. **Verifikasi**: Cara test setiap kemungkinan
4. **Fix recommendation**:
   - Temporary fix: [quick workaround]
   - Permanent fix: [proper solution]
   - Prevention: [cara mencegah terulang]
```

### Template 4: Code Review

```
## Role
Senior code reviewer dengan focus pada quality dan security.

## Task
Review kode secara komprehensif.

## Input
- Kode: @file atau diff
- Context: [fitur apa, requirement apa]
- Focus area: [security, performance, maintainability, dll]

## Output
1. **Overall assessment**: 👍 Approve / 🤔 Needs changes / 👎 Reject
2. **Critical issues** (harus fix sebelum merge):
   - [ ] Issue + lokasi + cara fix
3. **Suggestions** (nice to have):
   - [ ] Issue + lokasi + cara fix
4. **Positive feedback**:
   - [ ] Apa yang sudah bagus
5. **Questions**:
   - [ ] Pertanyaan yang perlu dijawab author
```

### Template 5: Refactoring Plan

```
## Role
Software architect dengan expertise dalam refactoring.

## Task
Buat plan refactoring yang aman dan incremental.

## Input
- Kode yang di-refactor: @file
- Alasan refactor: [performance, maintainability, dll]
- Constraints: [tidak boleh break existing behavior]

## Output
1. **Current state analysis**: Masalah di kode saat ini
2. **Target state**: Bagaimana kode setelah refactor
3. **Step-by-step plan**:
   - Step 1: [deskripsi] + [cara verifikasi]
   - Step 2: [deskripsi] + [cara verifikasi]
   - ...
4. **Risk assessment**: Apa yang bisa salah + mitigation
5. **Rollback plan**: Cara revert jika refactor gagal
```

### Template 6: Test Generation

```
## Role
QA engineer senior, ahli dalam test strategy dan implementation.

## Task
Generate comprehensive test suite.

## Input
- Kode yang di-test: @file
- Testing framework: [Jest, Mocha, Vitest, dll]
- Coverage target: [persentase]

## Output
1. **Test strategy**: Approach dan scope
2. **Test cases list**: Semua scenario yang perlu di-test
3. **Test code**: Implementasi lengkap
4. **Mock strategy**: Apa yang di-mock dan kenapa
5. **Coverage report**: Estimasi coverage per file
```

### Template 7: API Documentation

```
## Role
Technical writer, ahli dokumentasi API.

## Task
Generate API documentation yang lengkap dan mudah dipahami.

## Input
- Route definitions: @file
- Request/Response examples: [contoh]
- Authentication: [type, requirement]

## Output per Endpoint
### `METHOD /path`
**Deskripsi**: [apa yang dilakukan]
**Authentication**: [required/optional, type]
**Request Headers**: [headers yang diperlukan]
**Request Body**: [schema + contoh]
**Response** (200): [schema + contoh]
**Error Responses**: [status code + deskripsi + contoh]
**Rate Limiting**: [jika ada]
**Notes**: [catatan penting]
```

### Template 8: Architecture Decision Record

```
## Role
Software architect, ahli dalam dokumentasi keputusan teknis.

## Task
Buat Architecture Decision Record (ADR).

## Input
- Decision: [keputusan yang diambil]
- Alternatives: [opsi lain yang dipertimbangkan]
- Context: [latar belakang dan constraints]

## Output
# ADR-XXX: [Judul Keputusan]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[Latar belakang, masalah yang dihadapi, constraints]

## Decision
[Keputusan yang diambil dan alasannya]

## Alternatives Considered
1. [Opsi 1]: [pro/kontra]
2. [Opsi 2]: [pro/kontra]

## Consequences
**Positive**: [dampak positif]
**Negative**: [dampak negatif]
**Trade-offs**: [kompromi yang dibuat]
```

### Template 9: Daily Standup

```
## Role
Developer preparing untuk daily standup meeting.

## Task
Buat standup report yang jelas dan concise.

## Input
- Yesterday: [apa yang dikerjakan kemarin]
- Today: [rencana hari ini]
- Blockers: [hambatan yang dihadapi]
- Sprint context: [sprint berapa, goal sprint]

## Output
**Yesterday**:
- ✅ [task selesai]
- 🔄 [task in progress]

**Today**:
- [ ] [task yang akan dikerjakan]
- [ ] [task lanjutan]

**Blockers**:
- 🚧 [blocker + action yang sudah diambil]

**ETA**: [estimasi completion untuk task utama]
```

### Template 10: Deployment Checklist

```
## Role
DevOps engineer, ahli dalam deployment process.

## Task
Buat deployment checklist yang comprehensive.

## Input
- Fitur yang di-deploy: [deskripsi]
- Environment: [staging/production]
- Dependencies: [service lain yang terdampak]

## Output
## Deployment Checklist: [Nama Fitur]

### Pre-deployment
- [ ] Semua test passing (!npm test)
- [ ] Code review approved
- [ ] Migration scripts ready (jika ada)
- [ ] Environment variables configured
- [ ] Rollback plan documented
- [ ] Stakeholders notified

### Deployment
- [ ] Deploy to [environment]
- [ ] Run database migrations
- [ ] Verify health check endpoint
- [ ] Smoke test critical flows
- [ ] Monitor error rate (5 menit)
- [ ] Monitor performance metrics

### Post-deployment
- [ ] Verify feature flag status
- [ ] Check logs for errors
- [ ] Monitor user feedback
- [ ] Update documentation
- [ ] Notify stakeholders: deployment complete
```

---

## ✅ Checklist Kompetensi

Setelah menyelesaikan modul ini, pastikan Anda bisa:

### Memahami Codebase
- [ ] Menggunakan `@explore` untuk memahami struktur proyek
- [ ] Memetakan dependency antar modul
- [ ] Mengidentifikasi pola arsitektur
- [ ] Membaca dan memahami kode legacy

### Daily Workflow
- [ ] Mempersiapkan daily standup dengan AI
- [ ] Breakdown task besar menjadi langkah kecil
- [ ] Implementasi step-by-step dengan Build Agent
- [ ] Self-review kode dengan AI assistance
- [ ] Membuat commit message yang informatif

### Feature Development
- [ ] Analisis requirement dengan AI
- [ ] Membuat technical design document
- [ ] Implementasi plan yang terstruktur
- [ ] Testing strategy yang comprehensive
- [ ] Deployment checklist yang lengkap

### Bug Fixing
- [ ] Reproduksi bug secara sistematis
- [ ] Root cause analysis dengan AI
- [ ] Fix implementation yang aman
- [ ] Verifikasi fix dengan test scenarios
- [ ] Bug triage framework

### Code Review
- [ ] Review checklist yang comprehensive
- [ ] Mengetahui apa yang bisa di-AI-kan dan apa yang manual
- [ ] Security review dengan AI assistance
- [ ] Performance review dengan AI assistance

### Refactoring
- [ ] Test-first approach sebelum refactor
- [ ] Incremental refactoring patterns
- [ ] Safe refactoring checklist
- [ ] Rollback plan jika refactor gagal

### Documentation
- [ ] README generation yang comprehensive
- [ ] API documentation yang jelas
- [ ] Inline comments yang bermakna
- [ ] Architecture Decision Records

### Testing
- [ ] Unit test generation dengan AI
- [ ] Integration test strategy
- [ ] Test coverage improvement plan
- [ ] TDD workflow dengan AI

---

## ⚠️ Pitfalls dan Cara Menghindarinya

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| AI langsung ubah kode tanpa plan | Anda di Build Agent | Switch ke Plan Agent dulu untuk analisis |
| Fitur jadi tapi break yang lain | Tidak step-by-step, langsung besar | Confirm setiap step kecil sebelum lanjut |
| Bug localization tidak akurat | Info tidak lengkap | Berikan error log, stack trace, dan steps to reproduce |
| AI hallucinate API yang tidak ada | AI tidak tahu codebase Anda | Gunakan `@file` untuk inject konteks yang relevan |
| Refactor break existing behavior | Tidak ada test coverage | Buat test DULU sebelum refactor |
| Dokumentasi tidak akurat | AI tidak tahu konteks bisnis | Review dan edit dokumentasi sebelum commit |
| Test false positive | Mock terlalu longgar | Mock hanya external dependencies, test real logic |
| Commit message tidak informatif | AI tidak tahu konteks perubahan | Berikan konteks lengkap saat minta commit message |
| AI suggest library yang tidak compatible | AI tidak tahu tech stack Anda | Sebutkan tech stack dan versi di prompt |
| Over-reliance pada AI | Tidak verifikasi output AI | Selalu verify: jalankan test, cek manual, code review |

### Pitfall Terbesar: Trust Without Verification

AI bisa membuat kesalahan yang terlihat benar. Selalu:

1. **Jalankan test** setelah setiap perubahan kode
2. **Baca diff** sebelum commit (`!git diff`)
3. **Code review manual** untuk logic kritis
4. **Test di staging** sebelum production
5. **Monitor setelah deploy** untuk catch issue yang lolos testing

---

## 📝 Ringkasan

### Workflow Inti

1. **Plan Agent** untuk memahami kode dan merencanakan solusi
2. **Build Agent** untuk implementasi step-by-step
3. **Plan → Build workflow** untuk fix bug (analisis dulu, baru fix)
4. **Kombinasi `@explore` dan `@file`** untuk konteks yang tepat

### Prinsip Utama

- **Step-by-step**: Jangan lakukan perubahan besar sekaligus
- **Verify everything**: Jangan percaya AI tanpa verifikasi
- **Context is king**: Berikan konteks yang cukup di setiap prompt
- **Test first**: Test adalah safety net untuk semua perubahan
- **Document as you go**: Dokumentasi bukan afterthought

### Prompt Engineering Tips

- **Spesifik**: Semakin spesifik prompt, semakin akurat output
- **Kontekstual**: Inject file relevan dengan `@file`
- **Iteratif**: Mulai dari high-level, lalu drill down
- **Verifiable**: Minta output yang bisa diverifikasi (test, command)
- **Structured**: Gunakan template untuk konsistensi

---

> **Modul selanjutnya**: [B2: Project Management](./03-project-management.md) — Mengelola proyek software dengan AI assistance dari planning hingga delivery.
