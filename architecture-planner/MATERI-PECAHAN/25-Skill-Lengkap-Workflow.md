## 25. SKILL LENGKAP: WORKFLOW 12 SKILL DARI IDE SAMPAI PRODUCTION

> **💬 Bayangkan ini:** Metode Architect-Builder adalah cetak biru gedung. Skill adalah **para pekerjanya** — masing-masing punya keahlian spesifik dan menyerahkan hasilnya ke pekerja berikutnya. Bab ini memetakan **12 skill lengkap** agar workflow berjalan dari ide pertama sampai aplikasi siap produksi, tanpa ada tahap yang tidak punya pemilik.

### 25.1 Mengapa Bab Ini Ada? (Analisis Kesenjangan)

Enam skill berikut sudah umum dipakai sebagai pipeline perencanaan:

```
PIPELINE 6 SKILL (YANG SUDAH ADA):
═══════════════════════════════════════════════════

1. IDEA CLARIFIER      → guided interview → problem brief
2. PRD GENERATOR       → problem brief    → PRD
3. TECH STACK ADVISOR  → requirements     → tech stack
4. ENTITY MODELER      → domain           → database schema
5. MODULE PLANNER      → modul            → arsitektur
6. AI CODING COACH     → kode             → review & optimasi

═══════════════════════════════════════════════════
```

Pipeline ini **kuat di sisi Architect (perencanaan)**, tetapi jika dicocokkan dengan Workflow 6 Tahap (Bab 8), ada **6 pemilik tahap yang hilang**:

```
CEK COVERAGE TERHADAP WORKFLOW 6 TAHAP (BAB 8):
═══════════════════════════════════════════════════

Tahap 1: Persiapan & scaffold folder     → ❌ TIDAK ADA PEMILIK
Tahap 2: Discovery & brainstorming       → ✅ IDEA CLARIFIER
Tahap 3: Buat Architect Pack (4 dokumen) → ⚠️ SEBAGIAN
         (PRD/stack/schema/arsitektur ada,
          tapi ACCEPTANCE.MD + HANDOFF-PROMPT.MD
          + pemecahan sprint TIDAK ADA)
Tahap 4: Handoff & dry run builder       → ❌ TIDAK ADA PEMILIK
Tahap 5: Builder bekerja (kode + test)   → ⚠️ AI CODING COACH
         (tapi tanpa gate bukti/verifikasi)
Tahap 6: Review & lanjut sprint berikut  → ❌ TIDAK ADA PEMILIK
         (update STATE.MD/DECISIONS.MD tidak
          dimiliki siapa pun)
Bab 13:  Keamanan & dependency check     → ❌ TIDAK ADA PEMILIK
Bab 22:  Production-ready & deployment   → ❌ TIDAK ADA PEMILIK

═══════════════════════════════════════════════════
```

**Konsekuensi jika dibiarkan** (dari Bab 2.1 dan Bab 9): source of truth kembali ke chat history, context penuh, AI improvisasi — persis masalah yang ingin dihindari metode ini. Dan dari Bab 22.1: hasil akhir berhenti di **prototipe**, bukan aplikasi production-ready.

> **💡 Ingat Pilar #3 (Bab 3):** *Folder system adalah source of truth — bukan chat history.* Setiap skill WAJIB punya kontrak baca/tulis ke folder.

---

### 25.2 Peta Lengkap: Alur 12 Skill dari Awal sampai Akhir

```
═══════════════════════════════════════════════════════════════════
          WORKFLOW LENGKAP 12 SKILL — IDE → PRODUCTION
═══════════════════════════════════════════════════════════════════

  [SKILL BARU #7]  SCAFFOLDER
  Buat folder proyek + semua file template (Pilar #3)
        │
        ▼
  [EXISTING #1]  IDEA CLARIFIER ────────────── Tahap 2
  Guided interview → problem brief + isi DOMAIN.MD & QUESTIONS.MD
        │
        ▼
  [EXISTING #2]  PRD GENERATOR ─────────────── Tahap 3 (bagian 1)
  Problem brief → PRD (apa & mengapa, BUKAN bagaimana)
        │
        ▼
  [EXISTING #3]  TECH STACK ADVISOR ◄─┐       Tahap 3 (bagian 2)
  Requirements + data sources →       │
  tech stack + catat ADR              │ keputusan
        │                             │ terdokumentasi
        ▼                             │
  [EXISTING #4]  ENTITY MODELER ◄─────┘       Tahap 3 (bagian 3)
  Domain → model data (+ keputusan storage: DB atau tidak)
        │
        ▼
  [EXISTING #5]  MODULE PLANNER               Tahap 3 (bagian 4)
  Modul → arsitektur & daftar file (BLUEPRINT.MD)
        │
        ▼
  [SKILL BARU #8]  SPRINT PLANNER             Tahap 3 (penutup)
  Susun sprint 1..N + lengkapi 4 dokumen per sprint:
  REQUIREMENTS + BLUEPRINT + ACCEPTANCE + HANDOFF-PROMPT
        │
        ▼
  [EXISTING #6]  AI CODING COACH ──────────── Tahap 4 & 5
  Mode DRY RUN: baca pack → simulasi → lapor → TUNGGU approve
  Mode BUILD: coding + test + lapor hasil dengan bukti
        │
        ▼
  [SKILL BARU #9]  ACCEPTANCE RUNNER          Tahap 6 (verifikasi)
  Fresh context: jalankan ACCEPTANCE.MD → verdict PASS/FAIL + bukti
        │
        ▼
  [SKILL BARU #10]  SECURITY & DEPENDENCY AUDITOR ── Bab 13
  npm audit / secret scan / pin versi → temuan → RISKS.MD
        │
        ▼
  [SKILL BARU #11]  DEPLOY & PRODUCTION GATE ──── Bab 22
  CI/CD + health check + monitoring + checklist P1 → GO/NO-GO
        │
        ▼
  [SKILL BARU #12]  STATE KEEPER              Tahap 6 (penutup)
  Update STATE.MD, DECISIONS.MD, RISKS.MD, QUESTIONS.MD
        │
        ├── masih ada sprint? ──► kembali ke SPRINT PLANNER ♻️
        │                          (Tahap 6.5, Bab 8.7)
        ▼
  🚀 PRODUCTION — dipantau monitoring (Bab 22.5)

═══════════════════════════════════════════════════════════════════
  ANTI-SLOP LAYER (semua skill): Taste + Impeccable
  → output minimal, tanpa fitur rekaan, tanpa dependency liar
═══════════════════════════════════════════════════════════════════
```

---

### 25.3 Enam Skill Baru yang Dibutuhkan

> Setiap skill mengikuti satu format: **Peran → Referensi materi → Mengapa dibutuhkan → Input/Output → Kontrak Folder → Aturan → Template Prompt.**

---

#### SKILL #7: SCAFFOLDER

**Tahap:** Tahap 1 — Persiapan | **Peran:** Pemilik Pilar #3 (Folder System)

**Referensi materi:**
- **Bab 6.1** — struktur folder lengkap: `AGENTS.MD`, `CLAUDE.MD`, `CODEX.MD`, `README.MD`, `docs/` (ARCHITECTURE, DATA-MODEL, API, PERMISSIONS, VALIDATION), `planning/sprints/sprint-001..N/`, `STATE.MD`, `DECISIONS.MD`, `DOMAIN.MD`, `RISKS.MD`, `QUESTIONS.MD`, `FILE-INVENTORY.MD`, `references/`, `src/`, `architect-packs/`, `.claude/`
- **Bab 6.2** — 7 manfaat folder system: source of truth, context engineering, handoff mechanism, knowledge base, audit trail, onboarding tool, scalability
- **Bab 7.1–7.7** — isi template tiap file (AGENTS.MD = router utama; STATE.MD = "PALING PENTING"; dst.)
- **Bab 8.2** — Langkah 1.1–1.3: `mkdir -p ...` + `touch ...` + "Copy template dari Bagian 7 ke masing-masing file"
- **Bab 5.3** — custom instructions: "Gunakan folder system sebagai source of truth" dan "Dokumentasikan SETIAP keputusan"

**Mengapa dibutuhkan:** Tanpa scaffold, enam skill perencanaan menghasilkan dokumen tanpa rumah — dan source of truth kembali ke chat history. Bab 2.1: *"📁 SOURCE OF TRUTH: Folder Proyek (Bukan chat history!)"*. Scaffolder menjalankan Tahap 1 yang saat ini tidak punya pemilik, dan membuat semua skill lain punya tempat membaca/menulis.

**Input → Output:**
```
INPUT:  Nama proyek + jenis aplikasi + tool builder yang dipakai
OUTPUT: Folder proyek lengkap sesuai Bab 6.1, semua file sudah
        berisi TEMPLATE dari Bab 7 (bukan file kosong):
        AGENTS.MD (router), STATE.MD (status awal), DECISIONS.MD,
        DOMAIN.MD, RISKS.MD, QUESTIONS.MD, FILE-INVENTORY.MD,
        planning/sprints/, docs/, architect-packs/, .claude/
```

**Kontrak Folder:**
```
BACA:  — (satu-satunya skill yang TIDAK butuh proyek existing)
TULIS: SELURUH scaffold awal (sekali jalan, di awal proyek)
       → Setelah ini, SCAFFOLDER tidak menyentuh folder lagi
```

**Aturan:**
```
✅ HARUS: Isi setiap file dengan template minimal dari Bab 7
✅ HARUS: AGENTS.MD berisi urutan baca file + aturan builder
          (Bab 7.1: "JANGAN mulai coding tanpa architect pack")
✅ HARUS: Sesuaikan CLAUDE.MD/CODEX.MD dengan tool builder user
❌ TIDAK BOLEH: Membuat file di luar struktur Bab 6.1
❌ TIDAK BOLEH: Mengisi keputusan teknis (itu tugas skill lain)
```

**Template Prompt:**
```
Buatkan scaffold proyek "[NAMA]" sesuai struktur folder Bab 6:
- Semua file dari Bab 6.1 dengan template minimal dari Bab 7
- AGENTS.MD: model operasi Architect-Builder + urutan baca file
- STATE.MD: proyek baru, belum ada sprint
- JANGAN membuat file tambahan. JANGAN mengisi keputusan teknis.
```

---

#### SKILL #8: SPRINT PLANNER

**Tahap:** Tahap 3 (penutup) + Tahap 6.5 (loop) | **Peran:** Produsen Architect Pack

**Referensi materi:**
- **Bab 8.4** — *"Isi Architect Pack (4 Dokumen)"*: `REQUIREMENTS.MD`, `BLUEPRINT.MD`, `ACCEPTANCE.MD`, `HANDOFF-PROMPT.MD`
- **Bab 5.3** — aturan custom instructions: *"Setiap sprint harus menghasilkan 4 dokumen"*
- **Bab 10.2** — struktur sprint: Tujuan, Status, 4 dokumen
- **Bab 10.3** — contoh rencana 6 sprint untuk proyek Dashboard (Discovery → Sample Bundle → Polish → Data Integration → Testing → Deployment)
- **Bab 8.7 (6.5)** — *"Ulangi untuk Sprint Berikutnya: Mulai dari Tahap 3"*
- **Bab 17 #6** — kesalahan "ONE GIANT PROMPT": *"Break menjadi sprint-sprint kecil dengan architect pack masing-masing"*

**Mengapa dibutuhkan:** Empat skill perencanaan Anda menghasilkan bahan mentah (PRD, stack, schema, arsitektur), tetapi **tidak ada yang merakit Architect Pack** — artefak sentral metode ini (Bab 8.4). Yang paling kritis hilang: `ACCEPTANCE.MD` (kriteria selesai + test cases, Bab 8.4 dokumen 3) dan `HANDOFF-PROMPT.MD` (prompt eksplisit untuk builder dengan aturan JANGAN/SETUJU, Bab 8.4 dokumen 4). Sprint Planner juga pemilik **loop** — tanpa dia, pipeline Anda linear dan berhenti setelah satu putaran, padahal Bab 8.7 mewajibkan iterasi antar sprint.

**Input → Output:**
```
INPUT:  PRD + tech stack + model data + arsitektur (dari skill #2-#5)
        + hasil review tahap sebelumnya (untuk sprint berikutnya)
OUTPUT: 1. Rencana sprint 1..N (urutan, tujuan, durasi — Bab 10.3)
        2. Per sprint, 4 dokumen lengkap di
           planning/sprints/sprint-XXX/:
           - REQUIREMENTS.MD   (apa & mengapa)
           - BLUEPRINT.MD      (bagaimana: arsitektur, file list,
                                dependensi + versi)
           - ACCEPTANCE.MD     (kriteria selesai + test cases +
                                output yang bisa didemonstrasikan)
           - HANDOFF-PROMPT.MD (prompt untuk builder: dry run dulu,
                                TUNGGU persetujuan, aturan JANGAN)
        3. Simpan copy pack di architect-packs/ (Bab 8.5 langkah 4.1)
```

**Kontrak Folder:**
```
BACA:  AGENTS.MD, STATE.MD, DOMAIN.MD, RISKS.MD, QUESTIONS.MD,
       DECISIONS.MD, PRD, docs/*
TULIS: planning/sprints/sprint-XXX/{REQUIREMENTS,BLUEPRINT,
       ACCEPTANCE,HANDOFF-PROMPT}.MD
       architect-packs/architect-pack-XXX.md
```

**Aturan:**
```
✅ HARUS: 4 dokumen per sprint — tidak boleh kurang (Bab 8.4)
✅ HARUS: Acceptance criteria spesifik & bisa ditest (Bab 8.4)
✅ HARUS: HANDOFF-PROMPT.MD menyuruh DRY RUN dulu + TUNGGU
          persetujuan (Bab 8.4: "TUNGGU persetujuan sebelum coding")
✅ HARUS: Pin versi dependensi di BLUEPRINT (Bab 17.2:
          "Pin versi di specification")
❌ TIDAK BOLEH: 1 sprint berisi banyak tujuan (Bab 17 #6)
❌ TIDAK BOLEH: Sprint tanpa kriteria selesai
```

**Template Prompt (sprint pertama):**
```
Berdasarkan PRD + blueprint ini, buatkan rencana sprint 1..N
(pola Bab 10.3: mulai Discovery, akhiri Testing & Deployment).
Untuk SPRINT 001 saja, buat 4 dokumen lengkap sesuai Bab 8.4:
REQUIREMENTS.MD, BLUEPRINT.MD (dengan file list + versi pinned),
ACCEPTANCE.MD (checklist + test cases), HANDOFF-PROMPT.MD
(dry run dulu, tunggu approve, aturan JANGAN).
Simpan di planning/sprints/sprint-001/ dan architect-packs/.
```

**Template Prompt (sprint berikutnya — menutup loop Tahap 6):**
```
Sprint 00X selesai. Berikut laporan builder + hasil ACCEPTANCE
RUNNER: [paste]. Review, perbarui rencana, lalu buat Architect
Pack untuk Sprint 00Y (4 dokumen, Bab 8.7 langkah 6.3-6.5).
```

---

#### SKILL #9: STATE KEEPER

**Tahap:** Menyeberang semua tahap | **Peran:** Penjaga Source of Truth

**Referensi materi:**
- **Bab 8.7 (6.4)** — *"Update Folder Proyek: STATE.MD → Sprint selesai; DECISIONS.MD → keputusan; RISKS.MD → risiko baru; QUESTIONS.MD → pertanyaan baru"*
- **Bab 7.3** — format STATE.MD (status sprint, riwayat, langkah selanjutnya, blockers) — diberi label *"PALING PENTING!"*
- **Bab 7.4** — format DECISIONS.MD: `[YYYY-MM-DD] Keputusan / Alasan / Dibuat oleh / Dampak`
- **Bab 7.6–7.7** — format RISKS.MD (kemungkinan/dampak/mitigasi) & QUESTIONS.MD (OPEN/CLOSED)
- **Bab 9.4–9.5** — prinsip context: "Updated", "Traceable"; prioritas WAJIB BACA per sesi: AGENTS.MD + STATE.MD + sprint aktif
- **Bab 14** — manajemen session: penamaan, kapan `/clear`, tanda context problems (14.4)
- **Bab 5.3** — "Dokumentasikan SETIAP keputusan", "Jangan biarkan pertanyaan terbuka terlalu lama"

**Mengapa dibutuhkan:** Bab 8.7 membuat update folder **wajib setelah setiap tahap**, tetapi dalam pipeline Anda tidak ada pemiliknya. Akibatnya skill lain menghasilkan dokumen baru yang bersaing dengan folder — memori kedua. State Keeper adalah mekanisme yang membuat Pilar #3 benar-benar hidup: dia yang menjaga prinsip "Updated" dan "Traceable" (Bab 9.4), dan menjaga context tetap clean antar sprint (Bab 9.3).

**Input → Output:**
```
INPUT:  Event tahap selesai — misalnya: "Sprint 002 selesai",
        "keputusan baru: pakai ExcelJS", "risiko baru: format
        Excel tidak konsisten", "pertanyaan terbuka baru"
OUTPUT: File folder terbarui SESUAI FORMAT Bab 7:
        - STATE.MD  : sprint aktif, riwayat, blockers, next step
        - DECISIONS.MD: entri ADR-format (tanggal/keputusan/alasan/
                        dampak)
        - RISKS.MD  : entri risiko baru dengan mitigasi
        - QUESTIONS.MD: buka/tutup pertanyaan
        + Rekomendasi session hygiene: saatnya /clear atau chat baru?
          (Bab 14.3: berganti sprint = mulai chat baru)
```

**Kontrak Folder:**
```
BACA:  Seluruh folder (untuk sinkronisasi status)
TULIS: STATE.MD, DECISIONS.MD, RISKS.MD, QUESTIONS.MD —
       HANYA append/update sesuai format Bab 7, jangan menulis ulang
```

**Aturan:**
```
✅ HARUS: Ikuti format persis seperti contoh Bab 7.3–7.7
✅ HARUS: Setiap keputusan punya Alasan + Dampak (Bab 7.4)
✅ HARUS: Setelah update, tampilkan ringkasan perubahan ke user
❌ TIDAK BOLEH: Mengubah dokumen sprint yang sudah disetujui
❌ TIDAK BOLEH: Menutup pertanyaan tanpa jawaban (Bab 7.7)
```

**Template Prompt:**
```
Sprint 00X baru saja selesai. Update folder source of truth
sesuai format Bab 7: STATE.MD (tandai selesai, set sprint aktif),
DECISIONS.MD (keputusan: [isi]), RISKS.MD (risiko: [isi]),
QUESTIONS.MD (pertanyaan: [isi]). Lalu ingatkan saya: sprint baru
= mulai chat baru (Bab 14.3).
```

---

#### SKILL #10: ACCEPTANCE RUNNER

**Tahap:** Tahap 6 (verifikasi) | **Peran:** Gate Bukti Sebelum "Selesai"

**Referensi materi:**
- **Bab 12.1** — *"Give Claude a check it can run: tests, a build, a screenshot to compare"* dan *"Spend More Effort on Review Than Generation"*
- **Bab 12.2** — 7 jenis verifikasi: automated testing, linting/typecheck, build check, visual verification, security check, AI review (subagent), human review
- **Bab 12.4** — Writer/Reviewer pattern: Session B reviewer dengan **FRESH context**, *"Reviewer HANYA mencari correctness issues"*, loop sampai tidak ada critical findings
- **Bab 12.5** — adversarial review: *"Report gaps, not style preferences"*
- **Bab 8.4 (dokumen 3)** — ACCEPTANCE.MD: checklist + test cases + output yang bisa didemonstrasikan
- **Bab 17 #4** — "TRUST-THEN-VERIFY GAP": *"Jika tidak bisa verifikasi, jangan deploy"*
- **Bab 21 (pola 8)** — Bounded execution: loop perbaikan > 3 kali untuk error sama → STOP, pendekatan baru

**Mengapa dibutuhkan:** AI CODING COACH memberi **saran**; metode ini menuntut **verdict berbasis bukti**. Bab 17 #4 menyebut jebakan terbesar: implementasi AI "terlihat meyakinkan tapi tidak handle edge cases". Acceptance Runner mengeksekusi ACCEPTANCE.MD (yang dibuat Sprint Planner) dan mengembalikan PASS/FAIL dengan bukti — menjadikan kriteria "Selesai" (Bab 10.1: *"Kriteria keberhasilan — bagaimana menilai sprint berhasil"*) bukan sekadar klaim builder.

**Input → Output:**
```
INPUT:  planning/sprints/sprint-XXX/ACCEPTANCE.MD
        + laporan builder + diff/git log + akses jalankan test
OUTPUT: Verdict per item: PASS / FAIL / TIDAK TERUJI, dengan bukti:
        - output test runner (paste asli, bukan ringkasan)
        - hasil build & lint
        - screenshot (jika kriteria visual — Bab 12.2 #4)
        Daftar GAPS (correctness only) + keputusan:
        APPROVED → lanjut ke Security Auditor
        REWORK   → kembali ke builder (maks 3 loop, Bab 21)
```

**Kontrak Folder:**
```
BACA:  planning/sprints/sprint-XXX/ACCEPTANCE.MD, BLUEPRINT.MD,
       src/, hasil test
TULIS: planning/sprints/sprint-XXX/VERIFICATION-REPORT.MD
       (bukti verdict per item acceptance)
```

**Aturan:**
```
✅ HARUS: Berjalan di FRESH context, terpisah dari sesi coding
          (Bab 12.4 — Writer/Reviewer pattern)
✅ HARUS: Lapor GAPS bukan preferensi gaya (Bab 12.5)
✅ HARUS: Bukti nyata per kriteria — output test asli (Bab 12.1)
✅ HARUS: Stop setelah 3 loop rework gagal → eskalasi ke manusia
          (Bab 21 pola 8)
❌ TIDAK BOLEH: Memberi verdict tanpa menjalankan test sendiri
❌ TIDAK BOLEH: Menilai hal di luar ACCEPTANCE.MD (scope creep)
```

**Template Prompt (dijalankan di sesi/konteks BARU):**
```
Anda REVIEWER independen (Writer/Reviewer pattern, Bab 12.4).
Baca ACCEPTANCE.MD sprint 00X. Jalankan sendiri setiap test case.
Bandingkan hasil dengan kriteria. Lapor per item:
PASS/FAIL/TIDAK TERUJI + bukti (output asli, screenshot).
Hanya laporkan gaps yang mempengaruhi correctness — bukan gaya.
Jangan mengubah kode. Verdict akhir: APPROVED atau REWORK.
```

---

#### SKILL #11: SECURITY & DEPENDENCY AUDITOR

**Tahap:** Setelah acceptance PASS, sebelum deploy | **Peran:** Pemilik Bab 13

**Referensi materi:**
- **Bab 13.1** — kutipan kunci: *"LLMs are useful, but they are not reliable dependency managers or security auditors"* → skill ini **menjalankan tools**, bukan bermelefon
- **Bab 13.2** — tools: Dependabot (auto-update + alerts), CodeQL (code scanning), Dependency Review (license + vulnerability), `npm audit`
- **Bab 13.3** — gate CI: *"A green check from an older commit does not prove that the latest review fix is safe"* — security scan harus jalan di setiap PR
- **Bab 22.2 (Checklist P1)** — keamanan dasar: `.env` terpisah + `.gitignore`, validasi input (Zod/Joi/Yup), rate limiting (login maks 5 percobaan/5 menit), HTTPS
- **Bab 17.2** — "AI menggunakan dependensi yang salah" → solusi: pin versi, verifikasi current versions, Dependabot, CI dependency review

**Mengapa dibutuhkan:** Bab 13 ada di materi tetapi tidak punya pemilik di pipeline Anda. Kode hasil AI secara statistik lebih rentan (Bab 22.1: riset CMU — kompleksitas naik 41%, static analysis warnings naik 30% setelah adopsi AI tools). Checklist P1 Bab 22.2 bersifat **WAJIB SEBELUM DEPLOY** — tanpa skill ini, jalur ke Deploy Gate selalu bisa dilewati.

**Input → Output:**
```
INPUT:  Codebase + lockfile + BLUEPRINT.MD (untuk cek dependensi
        sesuai rencana)
OUTPUT: 1. Hasil scan terorkestrasi: npm/audit, secret scan,
           cek .env hygiene, validasi input, rate limiting
        2. Cek kesesuaian: dependensi terpasang == BLUEPRINT.MD,
           semua versi pinned (Bab 17.2)
        3. Laporan: temuan per severity (KRITIS/TINGGI/SEDANG/RENDAH)
        Keputusan: CLEAN → lanjut ke Deploy Gate
                   ADA TEMUAN KRITIS → file ke RISKS.MD + rework
```

**Kontrak Folder:**
```
BACA:  package.json / lockfile / requirements.txt, BLUEPRINT.MD,
       .env.example, konfigurasi CI
TULIS: docs/SECURITY-AUDIT-00X.MD (laporan),
       RISKS.MD (temuan yang belum selesai, via STATE KEEPER)
```

**Aturan:**
```
✅ HARUS: Jalankan tool nyata (npm audit dll) — bukan opini model
          (Bab 13.1)
✅ HARUS: Bandingkan dependensi terpasang vs BLUEPRINT.MD —
          flag yang tidak disebutkan (aturan builder Bab 8.4:
          "JANGAN menggunakan library yang tidak disebutkan")
✅ HARUS: Verifikasi Checklist P1 Bab 22.2 (env vars, validasi,
          rate limit, HTTPS) sebagai syarat lolos
❌ TIDAK BOLEH: Mem-bypass temuan KRITIS demi lulus gate
❌ TIDAK BOLEH: Meng-upgrade dependensi di luar scope sprint
```

**Template Prompt:**
```
Jalankan security & dependency audit (Bab 13):
1. npm audit --audit-level=high → lapor hasil mentah
2. Secret scan: ada API key/password di kode? .env di .gitignore?
   .env.example ada?
3. Bandingkan dependensi terpasang dengan BLUEPRINT.MD —
   flag library di luar rencana atau versi tidak pinned
4. Cek checklist P1 Bab 22.2: validasi input, rate limiting, HTTPS
Lapor per severity. KRITIS = blokir deploy. Simpan laporannya.
```

---

#### SKILL #12: DEPLOY & PRODUCTION READINESS GATE

**Tahap:** Sprint terakhir (pola Bab 10.3: "Deployment & Documentation") | **Peran:** Pemilik Bab 22

**Referensi materi:**
- **Bab 22.1** — definisi production-ready vs prototipe: test berfungsi, graceful error handling, monitoring, CI/CD otomatis, secrets di env vars, backup DB
- **Bab 22.2** — Checklist Prioritas 1 (WAJIB sebelum deploy) & Prioritas 2 (saat berkembang): HTTPS, env vars, validasi, rate limiting, Sentry, UptimeRobot, health check endpoint, minimal 5–10 unit test, GitHub Actions
- **Bab 22.3** — template `.github/workflows/ci.yml`: lint → typecheck → test → build → security scan → deploy; *"Jika ADA YANG GAGAL → deploy DITOLAK otomatis!"*
- **Bab 22.4** — strategi deployment (blue-green, canary, rolling, one-shot) + rekomendasi vibe coder: Vercel (frontend) + Railway/Render (backend), rollback via dashboard
- **Bab 22.5** — monitoring minimum: Sentry (error tracking), UptimeRobot (uptime), `GET /health`, structured logging (pino); *"Tiga hal ini saja sudah membuat Anda 10x lebih siap"*

**Mengapa dibutuhkan:** Pipeline Anda saat ini **berhenti di review kode** — tetapi materi memberi satu bab penuh untuk fase setelahnya. Tanpa skill ini, output pipeline adalah prototipe (Bab 22.1: *"Tidak ada monitoring... API key di-hardcode"*). Bab 10.3 juga menempatkan "Deployment & Documentation" sebagai sprint penutup — skill ini pemiliknya.

**Input → Output:**
```
INPUT:  Codebase + hasil Acceptance Runner (PASS) + Security
        Auditor (CLEAN) + target hosting user
OUTPUT: 1. CI/CD pipeline sesuai template Bab 22.3
           (lint → typecheck → test → build → audit → deploy)
        2. Health check endpoint GET /health (Bab 22.5)
        3. Setup monitoring: Sentry + UptimeRobot + logging
        4. Secrets pindah ke env vars + .env.example
        5. Rollback plan terdokumentasi (Bab 22.4)
        6. Checklist P1 Bab 22.2 dicentang SATU PER SATU dengan bukti
        Keputusan akhir: GO (deploy) / NO-GO (dengan daftar blocker)
```

**Kontrak Folder:**
```
BACA:  src/, ACCEPTANCE.MD, VERIFICATION-REPORT.MD,
       SECURITY-AUDIT-00X.MD, RISKS.MD
TULIS: .github/workflows/ci.yml, .env.example,
       docs/DEPLOYMENT.MD (strategi + rollback plan),
       STATE.MD (status deploy — via STATE KEEPER)
```

**Aturan:**
```
✅ HARUS: Semua gate CI merah-hijau nyata — deploy ditolak jika
          ada yang gagal (Bab 22.3)
✅ HARUS: Monitoring minimum terpasang SEBELUM GO: Sentry +
          UptimeRobot + /health (Bab 22.5)
✅ HARUS: Untuk pemula, pilih strategi paling sederhana
          (Vercel/Railway auto-deploy + rollback, Bab 22.4)
✅ HARUS: Ikuti urutan bertahap Bab 22.2 (P1 dulu, bukan semua
          sekaligus)
❌ TIDAK BOLEH: GO dengan checklist P1 belum penuh
❌ TIDAK BOLEH: Hardcode secrets di kode (Bab 22.1)
```

**Template Prompt:**
```
Siapkan production readiness (Bab 22):
1. Buat .github/workflows/ci.yml sesuai template Bab 22.3
   (lint, typecheck, test, build, npm audit)
2. Buat GET /health + pasang Sentry + ingatkan saya setup
   UptimeRobot
3. Pindahkan semua secrets ke env vars + buat .env.example
4. Tulis docs/DEPLOYMENT.MD: strategi Vercel/Railway + rollback plan
5. Centang Checklist P1 Bab 22.2 satu per satu dengan bukti.
Verdict: GO atau NO-GO + daftar blocker.
```

---

#### MODE TAMBAHAN: DRY-RUN GATE (di dalam AI CODING COACH)

**Bukan skill baru** — melainkan **mode wajib** pada builder-side skill (Tahap 4). Referensi: **Bab 8.4 (dokumen 4)** dan **Bab 8.5 (langkah 4.3)**:

```
SEBELUM CODING, builder WAJIB:
1. Baca architect pack + AGENTS.MD + STATE.MD
2. Dry run (simulasi tanpa kode): apa yang dibangun, file apa yang
   dibuat/diubah, dependensi, risiko, rencana implementasi
3. LAPOR rencana → MENUNGGU persetujuan

❌ JANGAN: mulai coding tanpa persetujuan
❌ JANGAN: mengubah requirements
❌ JANGAN: pakai library di luar BLUEPRINT.MD
```

Ini adalah penerapan **Human-in-the-Loop** (Bab 21, pola 5) dan **Planning** (Bab 21, pola 3). Tanpa mode ini, skill coach langsung menulis kode — persis kesalahan "JUMPING STRAIGHT TO CODE" (Bab 17 #5).

---

### 25.4 Tabel Peta Lengkap: 12 Skill × Tahap × Kontrak Folder

| # | Skill | Baru/Ada | Tahap (Bab 8) | Input | Output | Baca Folder | Tulis Folder | Ref. Materi |
|---|-------|----------|----------------|-------|--------|-------------|--------------|-------------|
| 7 | **SCAFFOLDER** | 🆕 | Tahap 1 | Nama + jenis app | Scaffold + template file | — | Semua scaffold awal | 5.3, 6, 7, 8.2 |
| 1 | IDEA CLARIFIER | ✅ | Tahap 2 | Ide mentah | Problem brief | AGENTS, DOMAIN (jika ada) | DOMAIN.MD, QUESTIONS.MD (via #12) | 8.3 |
| 2 | PRD GENERATOR | ✅ | Tahap 3.1 | Problem brief | PRD (apa & mengapa) | DOMAIN, QUESTIONS | Bahan REQUIREMENTS | 8.4, 10 |
| 3 | TECH STACK ADVISOR | ✅ | Tahap 3.2 | Requirements + data sources | Stack + ADR | DOMAIN, DECISIONS | Bahan BLUEPRINT (stack) | 8.4, 7.4, 20 |
| 4 | ENTITY MODELER | ✅ | Tahap 3.3 | Domain + PRD | Model data (+ keputusan storage) | DOMAIN | Bahan DATA-MODEL | 7.5, 20 |
| 5 | MODULE PLANNER | ✅ | Tahap 3.4 | PRD + model + stack | Arsitektur + file list | Semua hasil #2–#4 | Bahan BLUEPRINT (arsitektur) | 8.4, 20 |
| 8 | **SPRINT PLANNER** | 🆕 | Tahap 3.5 + 6.5 | Semua bahan perencanaan | Rencana sprint + Architect Pack 4 dokumen | STATE, DOMAIN, RISKS, QUESTIONS | planning/sprints/*, architect-packs/* | 8.4, 8.7, 10 |
| 6 | AI CODING COACH | ✅ | Tahap 4–5 | HANDOFF-PROMPT | Kode + test + laporan bukti | AGENTS, STATE, pack sprint aktif | src/, test/ | 8.5–8.6, 11, 21 |
| — | *Dry-run mode* | 🔧 mode | Tahap 4 | Pack sprint | Rencana simulasi + tunggu approve | Pack, AGENTS, STATE | — | 8.4–8.5, 21 |
| 9 | **ACCEPTANCE RUNNER** | 🆕 | Tahap 6a | ACCEPTANCE.MD + hasil builder | Verdict PASS/FAIL + bukti | ACCEPTANCE, src, test | VERIFICATION-REPORT.MD | 12, 17#4, 21 |
| 10 | **SECURITY & DEP. AUDITOR** | 🆕 | Tahap 6b | Codebase + lockfile | Laporan severity + gate | lockfile, BLUEPRINT | SECURITY-AUDIT.MD, RISKS (via #12) | 13, 22.2 |
| 11 | **DEPLOY & PROD. GATE** | 🆕 | Tahap 6c / sprint akhir | Laporan PASS + CLEAN | CI/CD + monitoring + GO/NO-GO | Semua laporan | ci.yml, DEPLOYMENT.MD, .env.example | 22 |
| 12 | **STATE KEEPER** | 🆕 | Semua tahap (penutup) | Event tahap selesai | Folder terbarui + saran /clear | Semua folder | STATE, DECISIONS, RISKS, QUESTIONS | 7, 8.7, 9, 14 |

---

### 25.5 Ritel Lengkap: Dari Ide sampai Production

```
RITEL PENGGUNAAN 12 SKILL (SATU PROYEK PENUH):
═══════════════════════════════════════════════════

 1. /scaffolder        → folder + template siap        (Tahap 1)
 2. /idea-clarifier    → interview → problem brief,
                         isi DOMAIN.MD + QUESTIONS.MD  (Tahap 2)
 3. /prd-generator     → PRD                            (Tahap 3)
 4. /tech-stack-advisor→ stack + ADR di DECISIONS.MD
                         (ingat studi kasus Bab 8.4: keputusan
                          "tidak perlu database" adalah
                          keputusan stack yang sah)
 5. /entity-modeler    → model data / keputusan storage
 6. /module-planner    → arsitektur + file list
 7. /sprint-planner    → sprint 1..N + pack sprint-001
                         (4 dokumen)                    (Tahap 3 ✔)
 8. /state-keeper      → catat: perencanaan selesai
 9. /ai-coding-coach   → MODE DRY RUN → user approve    (Tahap 4)
10. /ai-coding-coach   → MODE BUILD → kode+test+lapor   (Tahap 5)
11. /acceptance-runner → PASS/FAIL + bukti              (Tahap 6a)
    └── FAIL? → kembali ke #10 (maks 3 loop)
12. /security-auditor  → CLEAN / temuan                 (Tahap 6b)
13. /deploy-gate       → GO / NO-GO (hanya sprint akhir)
14. /state-keeper      → update STATE/DECISIONS/RISKS/
                         QUESTIONS + ingatkan: chat baru
15. Masih ada sprint? → kembali ke langkah #7 ♻️        (Tahap 6.5)
16. 🚀 PRODUCTION — Sentry/UptimeRobot memantau (Bab 22.5)

═══════════════════════════════════════════════════
```

---

### 25.6 Catatan Integrasi & Prinsip Anti-Slop

**Urutan membangun skill baru (prioritas):**

| Prioritas | Skill | Alasan |
|-----------|-------|--------|
| 1 | SCAFFOLDER | Tanpa folder, Pilar #3 tidak ada (Bab 6) |
| 2 | SPRINT PLANNER | Tanpa Architect Pack, metode tidak jalan (Bab 8.4) |
| 3 | STATE KEEPER | Tanpa update folder, source of truth mati (Bab 8.7, 9) |
| 4 | ACCEPTANCE RUNNER | Tanpa gate bukti, "selesai" = klaim (Bab 12, 17#4) |
| 5 | SECURITY AUDITOR | Syarat WAJIB sebelum deploy (Bab 13, 22.2) |
| 6 | DEPLOY GATE | Mengubah hasil akhir dari prototipe → production (Bab 22) |

**Prinsip desain semua skill (Taste + Impeccable):**

Setiap skill baru harus mengikuti standar dari materi ini sendiri:

```
✅ Interview yang mentransformasi input → output, TIDAK LEBIH
   (Bab 7.2: "Would removing this line cause Claude to make
    mistakes? If not, cut it.")

✅ Prune agresif — skill yang membengkak membuat aturan penting
   tenggelam (Bab 17 #3: kesalahan "OVER-SPECIFIED CLAUDE.MD")

✅ Kontrak folder eksplisit di setiap skill: apa yang dibaca,
   apa yang ditulis, format dari Bab 7

✅ Builder-side: tidak mengarang fitur, tidak pakai library di
   luar blueprint (aturan Bab 8.4 & Bab 3)

✅ Bounded execution di semua loop: maksimal 3 iterasi perbaikan
   sebelum eskalasi ke manusia (Bab 21, pola 8)
```

> **💡 Pesan kunci bab ini:** Metode Architect-Builder sudah lengkap di Bab 1–24. Yang bab ini tambahkan hanyalah **pemilik untuk setiap tahap** — agar tidak ada satu pun langkah di Workflow 6 Tahap (Bab 8), Sistem Verifikasi (Bab 12), Keamanan (Bab 13), dan Standar Production-Ready (Bab 22) yang bergantung pada ingatan manusia atau chat history.

---

**📅 Ditambahkan:** September 2026
**📚 Referensi utama:** Bab 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 20, 21, 22
**🎯 Tujuan:** Melengkapi pipeline 6 skill perencanaan menjadi 12 skill agar workflow Architect-Builder berjalan penuh dari ide sampai aplikasi siap produksi
