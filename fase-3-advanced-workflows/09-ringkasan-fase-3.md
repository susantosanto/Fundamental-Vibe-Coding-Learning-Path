# 09 — Ringkasan Fase 3: Advanced Workflows

> **Estimasi:** 1 jam | **Level:** Semua | **Posisi:** Akhir Fase 3

---

## DAFTAR ISI

1. [Peta Perjalanan Fase 3](#peta-perjalanan-fase-3)
2. [Ringkasan Mendalam Per Topik](#ringkasan-mendalam-per-topik)
3. [Peta Pengetahuan Terhubung](#peta-pengetahuan-terhubung)
4. [Kuis Evaluasi Diri (15+ Soal)](#kuis-evaluasi-diri-15-soal)
5. [Checklist Kesiapan Fase 4](#checklist-kesiapan-fase-4)
6. [Ide Proyek Praktis](#ide-proyek-praktis)
7. [Bacaan Lanjutan yang Direkomendasikan](#bacaan-lanjutan-yang-direkomendasikan)
8. [Glosarium Istilah Kunci](#glosarium-istilah-kunci)

---

## PETA PERJALANAN FASE 3

Fase 3 membawa Anda dari seorang yang bisa menggunakan AI untuk coding, menjadi seorang yang bisa **mengelola workflow AI secara sistematis** — dari perencanaan hingga deployment, dari single agent hingga multi-agent collaboration.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FASE 3: ADVANCED WORKFLOWS                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [01] Mindset          [02] Setup & Planning    [03] Prompting      │
│  Vibe Coding           Template-based           Konteks + Tujuan    │
│  Clarity > Speed       Comprehensive            + Constraints       │
│       │                    │                        │                │
│       ▼                    ▼                        ▼                │
│  ┌─────────┐          ┌─────────┐             ┌─────────┐          │
│  │ Fondasi │─────────▶│ Struktur│────────────▶│ Eksekusi│          │
│  │ Mental  │          │ Proyek  │             │ AI      │          │
│  └─────────┘          └─────────┘             └─────────┘          │
│                                                    │                │
│       ┌────────────────────────────────────────────┘                │
│       ▼                                                             │
│  [04] Testing &        [05] Version Control     [06] Spec-Driven    │
│  Debugging             Commit Early             7-Phase Workflow    │
│  Test-First            Deploy Early             Constitution → Code │
│       │                    │                        │                │
│       ▼                    ▼                        ▼                │
│  ┌─────────┐          ┌─────────┐             ┌─────────┐          │
│  │ Kualitas│─────────▶│ Tracking│────────────▶│ Arsitek │          │
│  │ Kode    │          │ & Deploy│             │ Formal  │          │
│  └─────────┘          └─────────┘             └─────────┘          │
│                                                    │                │
│       ┌────────────────────────────────────────────┘                │
│       ▼                                                             │
│  [07] Autonomous       [08] Multi-Agent         [09] Ringkasan      │
│  Agents                Collaboration            & Evaluasi          │
│  Dual-Agent Pattern    Parallel Execution       Self-Assessment     │
│       │                    │                        │                │
│       ▼                    ▼                        ▼                │
│  ┌─────────┐          ┌─────────┐             ┌─────────┐          │
│  │ Otomasi │─────────▶│ Speed   │────────────▶│ Mastery │          │
│  │ Penuh   │          │ Maksimal│             │         │          │
│  └─────────┘          └─────────┘             └─────────┘          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Alur pembelajaran:** Mindset → Planning → Prompting → Testing → Version Control → Spec-Driven → Autonomous → Multi-Agent → Ringkasan

Setiap file membangun di atas file sebelumnya. File 01-03 adalah fondasi, 04-06 adalah eksekusi berkualitas, dan 07-08 adalah otomasi tingkat lanjut.

---

## RINGKASAN MENDALAM PER TOPIK

### 01 — Vibe Coding Mindset

**Konsep Utama:** Vibe coding bukan tentang coding tanpa berpikir — ini tentang **clarity of thought** sebelum menulis satu baris kode pun.

**Prinsip Inti:**

1. **Clarity Over Speed** — Memahami masalah secara mendalam lebih penting daripada langsung coding. Waktu yang dihabiskan untuk memahami masalah akan menghemat waktu debugging berlipat ganda.

2. **Iterative Development** — Mulai dari versi paling sederhana yang bisa bekerja, lalu iterasi. Jangan mencoba membuat solusi sempurna di pertama kali.

3. **Human Oversight** — AI adalah alat, bukan pengganti. Manusia tetap bertanggung jawab atas arsitektur, keputusan desain, dan kualitas akhir.

**ASCII Diagram — Vibe Coding Loop:**
```
┌──────────────────────────────────────┐
│         VIBE CODING LOOP              │
│                                       │
│   ┌─────────┐                        │
│   │ Clarify │ ← Jelaskan masalah     │
│   └────┬────┘    dengan detail       │
│        │                             │
│        ▼                             │
│   ┌─────────┐                        │
│   │  Plan   │ ← Buat rencana         │
│   └────┬────┘    sebelum eksekusi    │
│        │                             │
│        ▼                             │
│   ┌─────────┐                        │
│   │ Prompt  │ ← Berikan konteks      │
│   └────┬────┘    + constraints       │
│        │                             │
│        ▼                             │
│   ┌─────────┐                        │
│   │ Review  │ ← Verifikasi output    │
│   └────┬────┘    AI secara kritis    │
│        │                             │
│        ▼                             │
│   ┌─────────┐                        │
│   │ Iterate │ ← Ulangi sampai        │
│   └─────────┘    memuaskan           │
│                                       │
└──────────────────────────────────────┘
```

**Penerapan Praktis:**
- Sebelum meminta AI menulis kode, tulis dulu deskripsi masalah dalam 3-5 kalimat
- Identifikasi edge cases yang mungkin terjadi
- Tentukan kriteria sukses yang terukur

### 02 — Setup & Planning Lanjutan

**Konsep Utama:** Perencanaan yang komprehensif mengurangi iterasi yang tidak perlu dan menghasilkan kode yang lebih terstruktur.

**Komponen Planning yang Efektif:**

1. **Template-Based Planning** — Gunakan template yang sudah terbukti untuk konsistensi. Template mencakup: tujuan, scope, teknologi, arsitektur, timeline, dan risiko.

2. **Comprehensive Specification** — Spesifikasi harus mencakup functional requirements, non-functional requirements, constraints, dan acceptance criteria.

3. **Risk Assessment** — Identifikasi risiko teknis sejak awal: dependency yang belum stabil, kompleksitas algoritma, integrasi dengan sistem eksternal.

**Contoh Template Planning:**
```markdown
# Project: [Nama Proyek]

## Tujuan
- [Apa yang ingin dicapai]

## Scope
- In-scope: [yang termasuk]
- Out-of-scope: [yang tidak termasuk]

## Teknologi
- Frontend: [framework]
- Backend: [framework]
- Database: [jenis]

## Arsitektur
- [Gambaran tinggi arsitektur]

## Timeline
- Phase 1: [minggu 1-2]
- Phase 2: [minggu 3-4]

## Risiko
- [Risiko 1] → Mitigasi: [solusi]
- [Risiko 2] → Mitigasi: [solusi]
```

**Hubungan dengan File Lain:** Planning yang baik (File 02) menjadi input untuk prompting efektif (File 03) dan spec-driven development (File 06).

### 03 — Prompting Efektif

**Konsep Utama:** Prompt yang baik terdiri dari empat komponen yang saling melengkapi: **Konteks + Tujuan + Constraints + Edge Cases**.

**Formula Prompting Efektif:**

```
┌─────────────────────────────────────────────────────────┐
│              FORMULA PROMPTING EFEKTIF                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. KONTEKS                                              │
│     "Saya sedang membangun [sistem apa] menggunakan      │
│     [teknologi apa] untuk [target user siapa]"           │
│                                                          │
│  2. TUJUAN                                               │
│     "Saya perlu [fungsi spesifik] yang bisa              │
│     [capability yang diharapkan]"                        │
│                                                          │
│  3. CONSTRAINTS                                          │
│     "Batasan: [performance requirement],                 │
│     [security requirement], [compatibility]"             │
│                                                          │
│  4. EDGE CASES                                           │
│     "Pertimbangkan: [input kosong], [error handling],    │
│     [concurrent access], [data validation]"              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Teknik Lanjutan:**

- **Chain of Thought Prompting** — Minta AI menjelaskan langkah berpikirnya sebelum memberikan solusi
- **Few-Shot Prompting** — Berikan contoh input-output yang diharapkan
- **Role-Based Prompting** — Tetapkan role spesifik untuk AI ("Bertindak sebagai senior backend engineer...")
- **Constraint-Driven Prompting** — Batasi output dengan format spesifik (JSON, Markdown, dll)

**Contoh Prompt Lengkap:**
```
Sebagai senior Python developer, buatkan fungsi autentikasi JWT
untuk REST API menggunakan Flask.

Konteks: Aplikasi e-commerce dengan 10.000+ user aktif.
Tujuan: Fungsi login yang menghasilkan JWT token dengan expiry 24 jam.
Constraints:
  - Password harus di-hash dengan bcrypt
  - Token harus mengandung user_id dan role
  - Response time < 200ms
Edge Cases:
  - User tidak ditemukan
  - Password salah (3x percobaan → lockout)
  - Token expired handling
  - Concurrent login dari multiple device

Format output: Kode Python + penjelasan singkat + test cases.
```

### 04 — Testing & Debugging Lanjut

**Konsep Utama:** Test-first approach dan debugging sistematis menghasilkan kode yang lebih reliable dan mengurangi bug di production.

**Testing Pyramid:**
```
                    ┌─────────┐
                   │  E2E    │  ← Sedikit (10-20%)
                  │  Tests  │
                 └───────────┘
                ┌───────────────┐
               │ Integration   │  ← Sedang (20-30%)
              │    Tests       │
             └─────────────────┘
            ┌───────────────────┐
           │    Unit Tests     │  ← Banyak (50-70%)
          └─────────────────────┘
```

**Prinsip Testing dengan AI:**

1. **Test-First dengan AI** — Minta AI membuat test cases SEBELUM implementasi. Ini memastikan requirements jelas dan implementasi bisa diverifikasi.

2. **AI-Generated Test Cases** — AI bisa menghasilkan edge cases yang mungkin terlewat oleh manusia: null values, boundary conditions, race conditions.

3. **Debugging Iteratif** — Saat bug ditemukan, berikan AI: error message, stack trace, context sekitar error, dan apa yang sudah dicoba.

**Debugging Workflow dengan AI:**
```
Bug ditemukan
    │
    ▼
Kumpulkan informasi:
  - Error message lengkap
  - Stack trace
  - Input yang menyebabkan error
  - Expected vs actual behavior
    │
    ▼
Berikan ke AI dengan konteks lengkap
    │
    ▼
AI memberikan hipotesis + fix
    │
    ▼
Verifikasi fix dengan test
    │
    ▼
Jika gagal → ulangi dengan info baru
Jika sukses → commit + dokumentasi
```

**Prompt Debugging Efektif:**
```
Saya menemukan bug di fungsi [nama_fungsi].

Error: [error message lengkap]
Stack trace: [stack trace]
Input: [data yang menyebabkan error]
Expected: [apa yang seharusnya terjadi]
Actual: [apa yang sebenarnya terjadi]

Kode terkait:
[code snippet]

Sudah dicoba:
- [attempt 1] → hasil: [outcome]
- [attempt 2] → hasil: [outcome]

Tolong analisis root cause dan berikan solusi.
```

### 05 — Version Control & Deploy

**Konsep Utama:** Commit early, deploy early. Version control bukan hanya untuk backup — ini adalah alat kolaborasi dan tracking perubahan.

**Git Workflow yang Direkomendasikan:**

```
main ──────────────────────────────────────────────▶
      │         │         │         │
      ▼         ▼         ▼         ▼
    feat/    feat/     fix/      feat/
    auth     payment   login     dashboard
      │         │         │         │
      ▼         ▼         ▼         ▼
    PR ──▶  PR ──▶   PR ──▶    PR ──▶
    merge     merge     merge     merge
```

**Konvensi Commit Message (Conventional Commits):**
```
<type>(<scope>): <description>

[optional body]

[optional footer]

Types: feat, fix, docs, style, refactor, test, chore
```

**Contoh:**
```
feat(auth): add JWT token refresh endpoint

Implement automatic token refresh when access token expires.
New endpoint POST /auth/refresh accepts refresh token and
returns new access token.

Closes #123
```

**Deploy Checklist:**
- [ ] Semua test passing
- [ ] Code review approved
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Rollback plan siap
- [ ] Monitoring configured

**Hubungan dengan AI:** AI bisa membantu generate commit message dari diff, membuat deployment script, dan menyiapkan CI/CD pipeline configuration.

### 06 — Spesifikasi-Driven Development

**Konsep Utama:** 7-phase workflow formal yang mengubah ide menjadi kode terstruktur dengan kualitas tinggi.

**7-Phase Workflow:**

```
┌────────────────────────────────────────────────────────────┐
│              7-PHASE SPEC-DRIVEN WORKFLOW                   │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Phase 1: CONSTITUTION                                      │
│  ─────────────────                                          │
│  Tentukan prinsip dasar, constraints, dan standar kualitas  │
│  yang tidak bisa dikompromikan.                             │
│                                                             │
│  Phase 2: SPECIFICATION                                     │
│  ───────────────                                            │
│  Tulis spesifikasi lengkap: requirements, API contracts,    │
│  data models, error handling.                               │
│                                                             │
│  Phase 3: DESIGN                                            │
│  ───────                                                    │
│  Desain arsitektur: component diagram, sequence diagram,    │
│  data flow.                                                 │
│                                                             │
│  Phase 4: PLAN                                              │
│  ────                                                       │
│  Buat implementasi plan: urutan pengerjaan, dependency,     │
│  estimasi waktu.                                            │
│                                                             │
│  Phase 5: TASKS                                             │
│  ──────                                                     │
│  Pecah menjadi task-task kecil yang bisa dikerjakan          │
│  secara independen.                                         │
│                                                             │
│  Phase 6: IMPLEMENT                                         │
│  ──────────                                                 │
│  Eksekusi implementasi per task dengan test-driven          │
│  approach.                                                  │
│                                                             │
│  Phase 7: REVIEW                                            │
│  ───────                                                    │
│  Review hasil: apakah sesuai spec? Test passing?            │
│  Performance acceptable?                                    │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**Kapan Menggunakan Spec-Driven Development:**
- Proyek dengan kompleksitas menengah-tinggi
- Tim dengan multiple developer
- Sistem yang membutuhkan maintainability jangka panjang
- Proyek dengan stakeholder yang perlu approve spec sebelum coding

**Kapan TIDAK Perlu:**
- Prototype atau proof of concept
- Script satu kali pakai
- Eksperimen atau learning project
- Bug fix sederhana

### 07 — Autonomous Agents

**Konsep Utama:** Dual-agent pattern memisahkan perencanaan dan eksekusi untuk tugas-tugas besar yang membutuhkan koordinasi kompleks.

**Dual-Agent Pattern:**
```
┌──────────────────────────────────────────────────────┐
│                DUAL-AGENT PATTERN                     │
│                                                       │
│   ┌─────────────────┐        ┌─────────────────┐     │
│   │  PLANNER AGENT  │        │  EXECUTOR AGENT │     │
│   │                 │        │                 │     │
│   │ • Analisis      │ plan   │ • Terima plan   │     │
│   │   requirements  │───────▶│ • Eksekusi per  │     │
│   │ • Buat rencana  │        │   task          │     │
│   │ • Identifikasi  │        │ • Report hasil  │     │
│   │   dependency    │        │ • Handle error  │     │
│   │ • Set milestone │        │ • Request clar. │     │
│   └─────────────────┘        └────────┬────────┘     │
│                                       │               │
│                              feedback │               │
│   ┌─────────────────┐        ◀────────┘               │
│   │  REVIEWER AGENT │                                  │
│   │                 │                                  │
│   │ • Verifikasi    │                                  │
│   │   hasil         │                                  │
│   │ • Bandingkan    │                                  │
│   │   dengan spec   │                                  │
│   │ • Approve atau  │                                  │
│   │   request fix   │                                  │
│   └─────────────────┘                                  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Kapan Menggunakan Autonomous Agent:**
- Tugas yang bisa didefinisikan dengan jelas tapi eksekusinya panjang
- Refactoring besar-besaran
- Migrasi kode dari satu framework ke framework lain
- Generate boilerplate untuk banyak file

**Prompt untuk Planner Agent:**
```
Tugas: [deskripsi tugas lengkap]

Konteks: [informasi proyek]
Constraints: [batasan teknis]
Output yang diharapkan: [deskripsi hasil akhir]

Tolong buat rencana detail dengan:
1. Daftar task yang harus dikerjakan (urutan logis)
2. Dependency antar task
3. Estimasi kompleksitas per task (low/medium/high)
4. Kriteria sukses untuk setiap task
5. Potensi risiko dan mitigasi
```

### 08 — Multi-Agent Collaboration

**Konsep Utama:** Parallel AI agents untuk kecepatan maksimal — beberapa agent bekerja secara simultan pada task yang independen.

**Arsitektur Multi-Agent:**
```
┌─────────────────────────────────────────────────────────────┐
│                    MULTI-AGENT COLLABORATION                 │
│                                                              │
│                        ┌───────────┐                         │
│                        │ COORDINATOR│                         │
│                        │  AGENT     │                         │
│                        └─────┬─────┘                         │
│                              │                               │
│              ┌───────────────┼───────────────┐               │
│              │               │               │               │
│              ▼               ▼               ▼               │
│        ┌──────────┐   ┌──────────┐   ┌──────────┐           │
│        │ Agent A  │   │ Agent B  │   │ Agent C  │           │
│        │ Frontend │   │ Backend  │   │ Database │           │
│        │          │   │          │   │          │           │
│        │ Task 1   │   │ Task 2   │   │ Task 3   │           │
│        │ Task 4   │   │ Task 5   │   │ Task 6   │           │
│        └──────────┘   └──────────┘   └──────────┘           │
│              │               │               │               │
│              └───────────────┼───────────────┘               │
│                              ▼                               │
│                        ┌───────────┐                         │
│                        │ INTEGRATE │                         │
│                        │  RESULTS  │                         │
│                        └───────────┘                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Strategi Paralelisasi:**

1. **By Component** — Agent A handles frontend, Agent B handles backend, Agent C handles database
2. **By Feature** — Agent A handles auth feature, Agent B handles payment feature, Agent C handles notification feature
3. **By File** — Agent A handles all controller files, Agent B handles all service files, Agent C handles all model files

**Kapan Multi-Agent Efektif:**
- Task-task benar-benar independen (tidak ada dependency)
- Setiap task memiliki konteks yang cukup untuk dikerjakan sendiri
- Ada mekanisme untuk mengintegrasikan hasil

**Kapan Multi-Agent TIDAK Efektif:**
- Task-task saling bergantung erat
- Konteks yang dibutuhkan terlalu besar untuk satu agent
- Integrasi hasil lebih rumit daripada pengerjaan sequential

**Koordinasi Multi-Agent:**
```
Coordinator Agent bertanggung jawab untuk:
1. Mendefinisikan scope per agent
2. Menyediakan shared context (API contracts, data models)
3. Monitoring progress per agent
4. Menangani conflict saat integrasi
5. Memastikan konsistensi antar hasil agent
```

---

## PETA PENGETAHUAN TERHUBUNG

Berikut adalah bagaimana semua konsep di Fase 3 saling terhubung:

```
┌──────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE MAP FASE 3                           │
│                                                                   │
│  ┌──────────────┐                                                │
│  │   MINDSET    │ ← Fondasi: Clarity, Iterative, Human Oversight │
│  └──────┬───────┘                                                │
│         │                                                         │
│         ▼                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐        │
│  │   PLANNING   │───▶│  PROMPTING   │───▶│   TESTING    │        │
│  │              │    │              │    │  & DEBUGGING │        │
│  │ Template     │    │ Konteks +    │    │ Test-first   │        │
│  │ Comprehensive│    │ Tujuan +     │    │ Iterative    │        │
│  │ Risk Assess  │    │ Constraints  │    │ Systematic   │        │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘        │
│         │                   │                   │                 │
│         ▼                   ▼                   ▼                 │
│  ┌──────────────────────────────────────────────────────┐        │
│  │              SPEC-DRIVEN DEVELOPMENT                  │        │
│  │  Constitution → Spec → Design → Plan → Tasks → Impl  │        │
│  └──────────────────────┬───────────────────────────────┘        │
│                         │                                         │
│                         ▼                                         │
│  ┌──────────────────────────────────────────────────────┐        │
│  │           VERSION CONTROL & DEPLOYMENT                │        │
│  │  Commit early, deploy early, CI/CD, rollback plan    │        │
│  └──────────────────────┬───────────────────────────────┘        │
│                         │                                         │
│                         ▼                                         │
│  ┌──────────────┐    ┌──────────────┐                            │
│  │  AUTONOMOUS  │───▶│  MULTI-AGENT │                            │
│  │   AGENTS     │    │ COLLABORATION│                            │
│  │              │    │              │                            │
│  │ Dual-agent   │    │ Parallel     │                            │
│  │ Planner/     │    │ execution    │                            │
│  │ Executor     │    │ Coordinator  │                            │
│  └──────────────┘    └──────────────┘                            │
│                                                                   │
│  HUBUNGAN SILANG:                                                 │
│  • Planning → input untuk Prompting                              │
│  • Prompting → input untuk Spec-Driven                           │
│  • Testing → bagian dari Spec-Driven (Phase 6-7)                 │
│  • Version Control → tracking semua perubahan                    │
│  • Autonomous Agents → otomatisasi Spec-Driven workflow          │
│  • Multi-Agent → paralelisasi task dari Planning                 │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Dependency Graph Antar File:**

| File | Bergantung Pada | Menjadi Input Untuk |
|------|-----------------|---------------------|
| 01 Mindset | - | Semua file lainnya |
| 02 Planning | 01 Mindset | 03, 06, 08 |
| 03 Prompting | 01, 02 | 04, 06, 07 |
| 04 Testing | 03 Prompting | 05, 06 |
| 05 Version Control | 04 Testing | 07, 08 |
| 06 Spec-Driven | 02, 03, 04 | 07, 08 |
| 07 Autonomous | 03, 05, 06 | 08 |
| 08 Multi-Agent | 02, 06, 07 | - |

---

## KUIS EVALUASI DIRI (15+ SOAL)

Gunakan kuis ini untuk mengukur pemahaman Anda terhadap materi Fase 3. Jawab tanpa melihat materi terlebih dahulu, lalu cek jawaban.

### Bagian A: Konsep Dasar (Soal 1-5)

**Soal 1:** Apa tiga prinsip utama dari Vibe Coding Mindset?
<details>
<summary>Jawaban</summary>

1. **Clarity Over Speed** — Memahami masalah secara mendalam lebih penting daripada langsung coding
2. **Iterative Development** — Mulai dari versi sederhana, lalu iterasi
3. **Human Oversight** — AI adalah alat, manusia tetap bertanggung jawab atas kualitas
</details>

**Soal 2:** Sebutkan empat komponen formula prompting efektif!
<details>
<summary>Jawaban</summary>

**Konteks + Tujuan + Constraints + Edge Cases**

- Konteks: Latar belakang sistem dan teknologi
- Tujuan: Fungsi spesifik yang dibutuhkan
- Constraints: Batasan teknis (performance, security, compatibility)
- Edge Cases: Kasus khusus yang harus ditangani
</details>

**Soal 3:** Apa itu test-first approach dan mengapa penting?
<details>
<summary>Jawaban</summary>

Test-first approach adalah menulis test cases SEBELUM menulis implementasi. Penting karena:
- Memastikan requirements jelas sebelum coding
- Mencegah over-engineering (hanya kode yang dibutuhkan untuk pass test)
- Memberikan safety net saat refactoring
- Memudahkan AI untuk menghasilkan kode yang sesuai ekspektasi
</details>

**Soal 4:** Jelaskan perbedaan antara commit message konvensional dan commit message biasa!
<details>
<summary>Jawaban</summary>

**Commit biasa:** "fix bug" atau "update code" — tidak informatif

**Conventional commit:** `feat(auth): add JWT token refresh endpoint`
- Format: `<type>(<scope>): <description>`
- Types: feat, fix, docs, style, refactor, test, chore
- Memberikan konteks jelas tentang APA yang berubah dan DI MANA
- Bisa di-generate otomatis untuk changelog
</details>

**Soal 5:** Kapan Anda HARUS menggunakan spec-driven development dan kapan TIDAK perlu?
<details>
<summary>Jawaban</summary>

**HARUS digunakan:**
- Proyek kompleksitas menengah-tinggi
- Tim dengan multiple developer
- Sistem butuh maintainability jangka panjang
- Ada stakeholder yang perlu approve spec

**TIDAK perlu:**
- Prototype / proof of concept
- Script satu kali pakai
- Eksperimen / learning project
- Bug fix sederhana
</details>

### Bagian B: Pemahaman Mendalam (Soal 6-10)

**Soal 6:** Jelaskan dual-agent pattern dan kapan menggunakannya!
<details>
<summary>Jawaban</summary>

Dual-agent pattern memisahkan **Planner Agent** (analisis requirements, buat rencana, identifikasi dependency) dari **Executor Agent** (terima plan, eksekusi per task, report hasil, handle error).

Digunakan saat:
- Tugas bisa didefinisikan jelas tapi eksekusinya panjang
- Refactoring besar-besaran
- Migrasi framework
- Generate boilerplate banyak file

Tidak digunakan untuk task sederhana yang bisa dikerjakan langsung.
</details>

**Soal 7:** Apa tiga strategi paralelisasi dalam multi-agent collaboration?
<details>
<summary>Jawaban</summary>

1. **By Component** — Agent berbeda menangani layer berbeda (frontend, backend, database)
2. **By Feature** — Agent berbeda menangani fitur berbeda (auth, payment, notification)
3. **By File** — Agent berbeda menangani tipe file berbeda (controllers, services, models)

Syarat utama: task-task harus independen (tidak ada dependency langsung).
</details>

**Soal 8:** Dalam 7-phase spec-driven workflow, apa yang dilakukan di Phase 1 (Constitution)?
<details>
<summary>Jawaban</summary>

Phase 1 Constitution adalah menetapkan **prinsip dasar, constraints, dan standar kualitas** yang tidak bisa dikompromikan sepanjang proyek.

Contoh constitution:
- "Semua API harus RESTful dengan response format JSON standar"
- "Tidak ada hardcoded credentials"
- "Semua fungsi harus memiliki unit test dengan coverage minimal 80%"
- "Error handling harus menggunakan custom error class"
- "Database migration harus reversible"
</details>

**Soal 9:** Mengapa consistent hashing penting dalam konteks sharding (Fase 4 preview)?
<details>
<summary>Jawaban</summary>

Consistent hashing penting karena saat menambah atau mengurangi server/shard, hanya sebagian kecil data yang perlu dipindahkan (~10%), bukan setengah atau semua data. Ini mengurangi downtime dan kompleksitas saat scaling.

Tanpa consistent hashing: tambah 1 server → 50% data harus pindah
Dengan consistent hashing: tambah 1 server → ~10% data pindah
</details>

**Soal 10:** Apa yang dimaksud dengan "human oversight" dalam vibe coding dan mengapa ini critical?
<details>
<summary>Jawaban</summary>

Human oversight berarti manusia tetap:
- Memvalidasi output AI (tidak blindly accept)
- Membuat keputusan arsitektur
- Menentukan tradeoff (performance vs readability, dll)
- Memastikan kode sesuai business logic
- Menangani edge cases yang AI mungkin lewat

Critical karena:
- AI bisa menghasilkan kode yang "terlihat benar" tapi punya bug subtle
- AI tidak memahami konteks bisnis secara mendalam
- AI tidak bertanggung jawab atas konsekuensi kode yang salah
- Security dan compliance tetap tanggung jawab manusia
</details>

### Bagian C: Aplikasi Praktis (Soal 11-15)

**Soal 11:** Anda diminta membangun sistem e-commerce dengan fitur: user auth, product catalog, shopping cart, payment, dan order tracking. Rancang strategi multi-agent collaboration!
<details>
<summary>Jawaban</summary>

**Strategi: By Feature**

- **Agent A (Auth & User):** User registration, login, JWT, profile management
- **Agent B (Product Catalog):** CRUD products, search, categories, inventory
- **Agent C (Cart & Order):** Shopping cart, checkout, order tracking
- **Agent D (Payment):** Payment gateway integration, transaction history
- **Coordinator Agent:** Menyediakan API contracts antar fitur, memastikan konsistensi data model, mengintegrasikan hasil

**Shared Context yang dibutuhkan:**
- User model (digunakan semua agent)
- API response format standar
- Error handling convention
- Database connection pattern
</details>

**Soal 12:** Buat prompt lengkap untuk meminta AI membuat fungsi upload file dengan validasi!
<details>
<summary>Jawaban</summary>

```
Sebagai senior backend developer, buatkan fungsi upload file
untuk REST API menggunakan Node.js + Express.

Konteks: Aplikasi manajemen dokumen dengan 5000+ user.
Tujuan: Fungsi upload file yang aman dengan validasi lengkap.

Constraints:
  - Max file size: 10MB
  - Allowed types: PDF, DOC, DOCX, JPG, PNG
  - File harus di-scan malware sebelum disimpan
  - Simpan di cloud storage (S3-compatible)
  - Response time < 2 detik
  - Support multiple file upload (max 5 files per request)

Edge Cases:
  - File size melebihi limit
  - File type tidak diizinkan
  - Network timeout saat upload ke S3
  - Concurrent upload dari user sama
  - Storage penuh
  - File corrupted saat upload

Output: Kode + penjelasan + error handling + test cases.
```
</details>

**Soal 13:** Anda menemukan bug di production: user tidak bisa login setelah password reset. Debugging workflow apa yang Anda lakukan dengan AI?
<details>
<summary>Jawaban</summary>

1. **Kumpulkan informasi:**
   - Error message dari logs
   - Stack trace lengkap
   - User report: apa yang dilakukan sebelum error
   - Timestamp kejadian
   - Apakah semua user terdampak atau spesifik?

2. **Reproduksi lokal:**
   - Coba reproduksi bug di environment development
   - Catat langkah-langkah yang berhasil reproduksi

3. **Berikan ke AI:**
   ```
   Bug: User tidak bisa login setelah password reset

   Error: "Invalid credentials" padahal password sudah benar
   Stack trace: [lengkap]
   Flow yang dilakukan user: request reset → klik link → set password baru → login → error
   Sudah dicoba: verify password di DB (ter-hash benar), test login dengan user lain (berhasil)

   Kode terkait: [password reset handler] + [login handler]
   ```

4. **Analisis AI:** AI mungkin menemukan bahwa password reset tidak memicu update di session/cache, atau ada mismatch di hashing algorithm.

5. **Fix & Test:** Implement fix, test dengan scenario yang sama, deploy dengan monitoring ketat.
</details>

**Soal 14:** Jelaskan bagaimana planning (File 02) menjadi input untuk multi-agent collaboration (File 08)!
<details>
<summary>Jawaban</summary>

Planning menghasilkan:
- **Daftar fitur/task** → menjadi scope per agent
- **Dependency graph** → menentukan urutan dan paralelisasi
- **API contracts** → shared context antar agent
- **Data models** → schema yang harus diikuti semua agent
- **Timeline** → estimasi waktu per agent
- **Risk assessment** → hal yang perlu di-monitor coordinator

Tanpa planning yang baik, multi-agent collaboration akan chaos karena:
- Agent tidak tahu scope masing-masing
- API contracts tidak konsisten
- Dependency tidak terkelola
- Integrasi hasil menjadi nightmare
</details>

**Soal 15:** Anda baru saja menyelesaikan proyek besar dengan AI. Apa checklist yang Anda lakukan sebelum mengatakan "selesai"?
<details>
<summary>Jawaban</summary>

**Pre-Completion Checklist:**

- [ ] Semua test cases passing (unit, integration, E2E)
- [ ] Code review dilakukan (oleh AI atau human)
- [ ] Tidak ada TODO/FIXME yang critical tersisa
- [ ] Error handling lengkap untuk semua edge cases
- [ ] Performance acceptable (response time, memory usage)
- [ ] Security check: no hardcoded credentials, input validation, auth
- [ ] Documentation: README, API docs, deployment guide
- [ ] Version control: semua perubahan committed dengan message jelas
- [ ] Deployment: berhasil deploy ke staging, test di staging
- [ ] Monitoring: logging, alerting, dashboard configured
- [ ] Rollback plan: siap jika ada masalah di production
- [ ] User acceptance: stakeholder sudah approve
</details>

### Bagian D: Bonus (Soal 16-18)

**Soal 16:** Apa perbedaan antara autonomous agent dan multi-agent collaboration?
<details>
<summary>Jawaban</summary>

**Autonomous Agent (Dual-Agent):**
- Fokus pada SATU tugas besar
- Planner membuat rencana, Executor mengeksekusi
- Sequential: plan dulu, baru execute
- Cocok untuk: refactoring, migrasi, generate boilerplate

**Multi-Agent Collaboration:**
- Fokus pada BANYAK tugas independen
- Beberapa agent bekerja PARALEL
- Coordinator mengintegrasikan hasil
- Cocok untuk: proyek besar dengan banyak fitur independen

Autonomous agent = depth (satu tugas, dikerjakan otomatis)
Multi-agent = breadth (banyak tugas, dikerjakan bersamaan)
</details>

**Soal 17:** Bagaimana Anda memastikan konsistensi kode ketika 3 agent mengerjakan 3 fitur berbeda secara paralel?
<details>
<summary>Jawaban</summary>

1. **Shared Constitution** — Semua agent mengikuti prinsip dasar yang sama
2. **API Contracts** — Interface antar fitur didefinisikan SEBELUM agent mulai bekerja
3. **Data Models** — Schema database dan type definitions shared
4. **Code Style** — Linting rules, formatting conventions yang sama
5. **Coordinator Agent** — Memantau progress, resolve conflict, pastikan integrasi
6. **Integration Tests** — Test yang memverifikasi interaksi antar fitur
7. **Regular Sync** — Agent report progress secara berkala ke coordinator
</details>

**Soal 18:** Jelaskan hubungan antara testing (File 04) dan spec-driven development (File 06)!
<details>
<summary>Jawaban</summary>

Testing adalah bagian INTEGRAL dari spec-driven development:

- **Phase 2 (Specification)** mendefinisikan acceptance criteria → ini menjadi basis test cases
- **Phase 6 (Implement)** menggunakan test-driven approach → test ditulis sebelum/during implementasi
- **Phase 7 (Review)** memverifikasi apakah semua test passing dan hasil sesuai spec

Hubungannya:
```
Specification → Acceptance Criteria → Test Cases → Implementation → Test Execution → Review
```

Tanpa testing, spec-driven development tidak bisa memverifikasi apakah implementasi sesuai specification. Testing adalah "bukti" bahwa spec telah dipenuhi.
</details>

---

## CHECKLIST KESIAPAN FASE 4

Fase 4 membahas **Deep System Design** — topik yang lebih teknis dan arsitektural. Pastikan Anda menguasai fondasi dari Fase 3 sebelum melanjutkan.

### Kompetensi Wajib

- [ ] **Bisa membuat comprehensive plan sebelum coding** — Tidak langsung coding tanpa rencana
- [ ] **Paham prompting efektif dengan 4 komponen** — Konteks, tujuan, constraints, edge cases
- [ ] **Bisa menggunakan spec-driven development** — Mengikuti 7-phase workflow untuk proyek kompleks
- [ ] **Paham autonomous agent pattern** — Dual-agent untuk tugas besar
- [ ] **Paham multi-agent collaboration** — Paralelisasi task independen
- [ ] **Bisa deploy aplikasi ke production** — Version control, CI/CD, monitoring
- [ ] **Bisa debug sistematis dengan AI** — Kumpulkan info, berikan konteks, verifikasi fix
- [ ] **Bisa membuat test cases dengan AI** — Test-first, edge cases, coverage

### Kompetensi Pendukung (Nice to Have)

- [ ] Pengalaman dengan Git workflow (branch, PR, merge)
- [ ] Pengalaman deploy ke cloud (Vercel, AWS, GCP)
- [ ] Pengalaman menulis API documentation
- [ ] Pengalaman dengan CI/CD pipeline
- [ ] Pengalaman dengan monitoring dan logging

### Self-Assessment Score

Hitung skor Anda (1 = tidak paham, 5 = sangat paham):

| Kompetensi | Skor (1-5) |
|------------|------------|
| Planning sebelum coding | __/5 |
| Prompting efektif | __/5 |
| Spec-driven development | __/5 |
| Testing & debugging | __/5 |
| Version control | __/5 |
| Autonomous agents | __/5 |
| Multi-agent collaboration | __/5 |
| Deployment | __/5 |

**Total: __/40**

- **32-40:** Siap untuk Fase 4! 🚀
- **24-31:** Review beberapa topik, tapi bisa lanjut
- **16-23:** Review Fase 3 sebelum lanjut
- **<16:** Ulangi Fase 3 dari awal

---

## IDE PROYEK PRAKTIS

Gunakan proyek-proyek ini untuk mempraktikkan semua konsep Fase 3:

### Proyek 1: Sistem Manajemen Inventaris Sekolah
**Kompleksitas:** Menengah | **Estimasi:** 2-3 minggu

**Fitur:**
- CRUD barang inventaris
- Peminjaman dan pengembalian
- Laporan kondisi barang
- Notifikasi barang rusak

**Praktik Fase 3:**
- File 01-02: Mindset + Planning dengan template
- File 03: Prompting untuk setiap fitur
- File 04: Test-first untuk CRUD operations
- File 05: Git workflow + deploy ke Vercel
- File 06: Spec-driven untuk arsitektur sistem
- File 07-08: Multi-agent (Agent A: frontend, Agent B: backend, Agent C: database)

### Proyek 2: Aplikasi Laporan Keuangan BOS
**Kompleksitas:** Tinggi | **Estimasi:** 3-4 minggu

**Fitur:**
- Input realisasi anggaran
- Generate laporan pertanggungjawaban
- Dashboard visualisasi keuangan
- Export ke Excel/PDF

**Praktik Fase 3:**
- Spec-driven development penuh (7 phases)
- Dual-agent pattern untuk generate laporan
- Multi-agent untuk fitur independen
- Comprehensive testing (unit + integration + E2E)

### Proyek 3: Portal Informasi Sekolah
**Kompleksitas:** Menengah | **Estimasi:** 2 minggu

**Fitur:**
- Berita dan pengumuman
- Galeri foto
- Data guru dan staf
- Kontak dan lokasi

**Praktik Fase 3:**
- Planning dengan risk assessment
- Prompting dengan role-based approach
- Version control dengan conventional commits
- Deploy dengan CI/CD

### Proyek 4: Sistem Presensi Digital
**Kompleksitas:** Tinggi | **Estimasi:** 4 minggu

**Fitur:**
- QR code check-in/check-out
- Dashboard presensi real-time
- Laporan bulanan
- Notifikasi absensi

**Praktik Fase 3:**
- Full spec-driven development
- Multi-agent: Agent A (QR scanner), Agent B (dashboard), Agent C (reporting), Agent D (notification)
- Autonomous agent untuk generate laporan
- Testing pyramid lengkap

---

## BACAAN LANJUTAN YANG DIREKOMENDASI

### Buku

1. **"Clean Code" oleh Robert C. Martin** — Prinsip penulisan kode yang bersih dan maintainable
2. **"Designing Data-Intensive Applications" oleh Martin Kleppmann** — Fondasi untuk Fase 4 (system design)
3. **"The Pragmatic Programmer" oleh David Thomas & Andrew Hunt** — Filosofi dan praktik programming
4. **"Building Microservices" oleh Sam Newman** — Arsitektur microservices (relevan untuk Fase 4)

### Online Resources

1. **donnemartin/system-design-primer** (GitHub) — Referensi utama untuk system design
   - URL: https://github.com/donnemartin/system-design-primer
   - Cover: load balancing, caching, sharding, message queues, dan lainnya

2. **Google Testing Blog** — Best practices testing
   - URL: https://testing.googleblog.com/

3. **Martin Fowler's Blog** — Arsitektur software dan design patterns
   - URL: https://martinfowler.com/

4. **AWS Architecture Blog** — Cloud architecture patterns
   - URL: https://aws.amazon.com/blogs/architecture/

### Video & Kursus

1. **Gaurav Sen - System Design** (YouTube) — Penjelasan system design yang mudah dipahami
2. **System Design Interview** (YouTube) — Simulasi interview system design
3. **freeCodeCamp - System Design Course** — Kursus lengkap system design

### Tools & Dokumentasi

1. **Conventional Commits** — https://www.conventionalcommits.org/
2. **Git Flow** — https://nvie.com/posts/a-successful-git-branching-model/
3. **12 Factor App** — https://12factor.net/

---

## GLOSARIUM ISTILAH KUNCI

| Istilah | Definisi |
|---------|----------|
| **Vibe Coding** | Pendekatan coding dengan AI yang mengutamakan clarity dan iterative development |
| **Prompting** | Seni memberikan instruksi kepada AI untuk menghasilkan output yang diinginkan |
| **Test-First** | Menulis test cases sebelum implementasi kode |
| **Spec-Driven** | Development yang dimulai dari spesifikasi formal sebelum coding |
| **Constitution** | Prinsip dasar dan standar kualitas yang tidak bisa dikompromikan dalam proyek |
| **Dual-Agent** | Pattern dengan Planner Agent dan Executor Agent terpisah |
| **Multi-Agent** | Beberapa AI agent bekerja paralel pada task independen |
| **Coordinator Agent** | Agent yang mengkoordinasi dan mengintegrasikan hasil multi-agent |
| **Conventional Commits** | Format standar untuk commit message (type(scope): description) |
| **CI/CD** | Continuous Integration / Continuous Deployment |
| **Edge Case** | Kasus khusus atau ekstrem yang mungkin terjadi |
| **Acceptance Criteria** | Kriteria yang harus dipenuhi agar fitur dianggap selesai |
| **Human Oversight** | Pengawasan manusia atas output AI |
| **Iterative Development** | Pengembangan bertahap dari versi sederhana ke kompleks |
| **API Contract** | Spesifikasi interface antar komponen sistem |
| **Rollback Plan** | Rencana untuk mengembalikan ke versi sebelumnya jika deploy gagal |
| **Coverage** | Persentase kode yang di-test |
| **Refactoring** | Mengubah struktur kode tanpa mengubah behavior |
| **Boilerplate** | Kode template yang berulang dan bisa di-generate otomatis |
| **Dependency Graph** | Diagram yang menunjukkan ketergantungan antar komponen |

---

> **Selamat!** Anda telah menyelesaikan Fase 3: Advanced Workflows.
>
> **Lanjut ke:** [`../fase-4-deep-system-design/00-panduan-fase.md`](../fase-4-deep-system-design/00-panduan-fase.md)
>
> Di Fase 4, Anda akan mempelajari:
> - Load Balancing & Caching
> - Service Discovery & API Gateway
> - Database Sharding
> - Message Queues
> - Microservices Architecture
> - Dan topik system design lainnya!
