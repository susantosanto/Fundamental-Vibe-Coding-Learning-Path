# Riset Referensi GitHub: Skill #7–#12 (Pelengkap Pipeline 12 Skill)

> **💬 Bayangkan ini:** Bab 25 sudah mendefinisikan *siapa* pemilik setiap tahap (12 skill). Bab riset ini menjawab pertanyaan berikutnya: *bagaimana membangun skill tersebut dengan benar?* Daripada mengarang dari nol, kita menaungi **repo GitHub populer yang sudah teruji di produksi dan dipakai ribuan developer senior** — lalu memetakan pola yang terbukti ke dalam 6 skill baru. Hasilnya: skill yang tidak hanya cocok dengan Workflow 6 Tahap, tetapi juga mengadopsi praktik terbaik yang sudah diverifikasi komunitas.

---

## 26.1 Mengapa Bab Ini Ada?

Pipeline 12 skill di Bab 25 sudah memiliki **pemilik untuk setiap tahap**, tetapi Bab 25 belum menjelaskan **dari mana desain detail setiap skill berasal**. Kesalahan umum saat membangun skill AI agent adalah "mengarang sendiri" — hasilnya skill yang terdengar bagus tetapi gagal di produksi (persis pola "OVER-SPECIFIED" dan "TRUST-THEN-VERIFY GAP" di Bab 17).

Solusinya: pelajari repo GitHub open-source yang **sudah menyelesaikan masalah yang sama** dan sudah diadopsi luas. Setiap skill baru di pipeline Anda seharusnya bisa menunjuk: *"Polanya diambil dari repo X, yang dipakai N ribu developer."*

**Kriteria pemilihan repo dalam riset ini:**

```
✅ Populer & aktif   → ribuan bintang / dipakai luas / dirawat aktif
✅ Senior-trusted    → dipublikasikan vendor besar (GitHub, Anthropic)
                        atau maintainer berpengalaman
✅ Relevan langsung  → menyelesaikan masalah yang sama dengan
                        salah satu skill #7–#12
✅ Open source       → pola & template bisa diadopsi bebas
```

---

## 26.2 Peta Repo per Skill (Ringkasan)

```
SKILL BARU          REPO REFERENSI UTAMA                  POLA YANG DIADOPSI
═══════════════════════════════════════════════════════════════════════════
#7  SCAFFOLDER      github/spec-kit                        Scaffold + template
                    anthropics/skills (+agentskills.io)    struktur SKILL.md
                    obra/superpowers                       skill framework

#8  SPRINT PLANNER  github/spec-kit (/speckit.tasks)       tasks.md + checklist
                    bmad-code-org/BMAD-METHOD (SM)         story + pack per sprint
                    Fission-AI/OpenSpec                    change proposal + archive
                    obra/superpowers (writing-plans)       task 2-5 menit + verifikasi
                    eyaltoledano/claude-task-master        PRD → task + dependensi
                    joelparkerhenderson/architecture-      ADR template
                      decision-record

#9  STATE KEEPER    cline/prompts (Memory Bank)            file hierarki + format
                    github/spec-kit (specs as files)       spec hidup di repo
                    Fission-AI/OpenSpec (archive/)         riwayat perubahan
                    obra/superpowers (ledger)              progress ledger file

#10 ACCEPTANCE     obra/superpowers                       verification-before-
    RUNNER           (verification-before-completion)       completion (Iron Law)
                    obra/superpowers                       fresh reviewer + fix loop
                      (subagent-driven-development)          maks 5 + eskalasi
                    anthropics/claude-code (code-review)   multi-perspektif review
                    Gherkin/GWT (BDD)                      format kriteria testable

#11 SECURITY &     anthropics/claude-code-security-review  AI security review gate
    DEP. AUDITOR   gitleaks/gitleaks                       secret scan CI/pre-commit
                    trufflesecurity/trufflehog              verifikasi kredensial
                    github/spec-kit (checklist)             "unit test untuk English"
                    Bab 13 (Dependabot, CodeQL, npm audit)  tetap fondasi

#12 DEPLOY &       gorrion-io/production-readiness-        checklist per kategori
    PROD. GATE       checklist                              dengan halaman live
                    kgoralski/microservice-production-      SRE-grade checklist
                      readiness-checklist
                    Bab 22 (Sentry, UptimeRobot, CI/CD)    tetap fondasi
═══════════════════════════════════════════════════════════════════════════
```

> **💡 Prinsip adopsi:** Jangan menyalin mentah. Ambil **pola** yang terbukti, lalu sesuaikan dengan Pilar #3 (folder system) dan kontrak folder Bab 25. Repo adalah guru, bukan cetakan.

---

## 26.3 SKILL #7: SCAFFOLDER

### Sumber 1: github/spec-kit ⭐ ~50k (GitHub resmi)

**Repo:** https://github.com/github/spec-kit

Toolkit resmi GitHub untuk Spec-Driven Development — dipakai dengan 30+ AI coding agent (Claude Code, Codex, Cursor, Copilot, dll). Proses inti: `/speckit.constitution → specify → plan → tasks → implement → converge`.

**Pola yang relevan untuk SCAFFOLDER:**

```
1. SCAFFOLD SEKALI, DIPAKAI SELAMANYA
   Command `specify init` membuat struktur folder standar (.specify/,
   templates, konstitusi) SEKALI di awal proyek — persis filosofi
   SCAFFOLDER: "sekali jalan, setelah itu tidak menyentuh folder lagi."

2. CONSTITUTION = AGENTS.MD
   Spec Kit punya satu file prinsip proyek (konstitusi) yang membimbing
   SEMUA command berikutnya. Padanan kita: AGENTS.MD sebagai router utama
   (Bab 7.1). Pola terbukti: aturan global harus DI FILE, bukan di chat.

3. TEMPLATE RESOLVER (prioritas berlapis)
   .specify/templates/overrides/ > presets > extensions > core
   → Untuk scaffold kita: template Bab 7 bisa punya varian per tool
     builder (CLAUDE.MD vs CODEX.MD) tanpa mengubah inti.

4. EXTENSION MODEL
   Kemampuan tambahan (bug workflow, idea assessment) ditambahkan
   TANPA mengubah core — insprasi agar skill kita modular.
```

### Sumber 2: anthropics/skills ⭐ resmi + agentskills.io (open standard)

**Repo:** https://github.com/anthropics/skills — **Spesifikasi format:** https://agentskills.io/specification

Anthropic merilis Agent Skills sebagai **standar terbuka** (Apache-2.0/CC-BY-4.0). Setiap skill = folder berisi `SKILL.md`. Ini **format yang seharusnya dipakai semua 12 skill Anda** agar portable antar agent.

**Struktur SKILL.md (dari spesifikasi resmi):**

```
skill-name/
├── SKILL.md        # WAJIB: YAML frontmatter + instruksi markdown
├── scripts/        # opsional: kode executable
├── references/     # opsional: dokumen pendukung (REFERENCE.md dll)
└── assets/         # opsional: template, data statis

Frontmatter wajib:
---
name: skill-name          # huruf kecil + hyphen, maks 64 karakter,
description: >            # harus sama dengan nama folder
  Apa yang dilakukan + KAPAN dipakai. Sertakan kata kunci pemicu.
---
```

**Aturan progressive disclosure (sangat penting untuk 12 skill Anda):**

```
Level 1  (~100 token)   : name + description dimuat saat startup
Level 2  (<5000 token)  : body SKILL.md dimuat saat skill aktif
Level 3  (sesuai kebutuhan): references/, scripts/, assets/

→ SKILL.md idealnya < 500 baris. Materi detail pindah ke references/.
→ Ini JAWABAN untuk "prune agresif" (Bab 25.6): aturan penting tetap
  di SKILL.md, detail Bab 6/7/8 jadi references/ yang dibaca on-demand.
```

### Sumber 3: obra/superpowers ⭐ ~40k (Jesse Vincent / Prime Radiant)

**Repo:** https://github.com/obra/superpowers

Framework skill agentic paling populer di komunitas Claude Code — "metodologi pengembangan software lengkap berbasis skill yang komposabel". Skill memicu otomatis saat relevan.

**Pola yang relevan untuk SCAFFOLDER & struktur skill:**

```
1. SKILL = METODOLOGI, BUKAN TOOL
   Skill-nya: brainstorming, writing-plans, verification-before-completion.
   Masing-masing KEcil, FOKUS, dan punya trigger jelas (kapan aktif).

2. TRIGGER OTOMATIS DARI DESCRIPTION
   Skill aktif karena deskripsinya cocok dengan konteks — bukan karena
   user menyuruh. → Tulis description seperti: "Use when about to
   claim work is complete..." (spesifik situasi, bukan "helps with X").

3. SKILL BISA MEMANGGIL SKILL LAIN
   writing-plans dipanggil di akhir brainstorming; finishing-a-
   development-branch dipanggil setelah review selesai.
   → Pipeline 12 skill Anda = rantai skill, seperti rantai skill ini.

4. WRITING-SKILLS (meta-skill)
   Superpowers punya skill untuk MENULIS skill baru — dengan aturan
   uji coba sebelum dipakai. Sangat berguna saat Anda menambah
   skill #13+ di masa depan.
```

**Template Prompt SCAFFOLDER (versi diperkaya):**

```
Buatkan scaffold proyek "[NAMA]" sesuai struktur folder Bab 6:
- Semua file dari Bab 6.1 dengan template minimal dari Bab 7
- AGENTS.MD: model operasi Architect-Builder + urutan baca file
- STATE.MD: proyek baru, belum ada sprint
- Setiap skill di .claude/skills/ mengikuti format SKILL.md
  (agentskills.io): frontmatter name + description pemicu,
  body < 500 baris, detail panjang pindah ke references/
JANGAN membuat file tambahan. JANGAN mengisi keputusan teknis.
```

---

## 26.4 SKILL #8: SPRINT PLANNER

### Sumber 1: github/spec-kit — command /speckit.tasks

Pemecahan plan → tasks di Spec Kit punya pola yang persis dibutuhkan Sprint Planner:

```
1. tasks.md DENGAN CHECKLIST & DEPENDENSI
   Setiap task: deskripsi, file yang disentuh, kriteria selesai,
   dependensi ke task lain. → Padanan: 4 dokumen per sprint.

2. /speckit.clarify SEBELUM PLAN
   Command khusus untuk mengklarifikasi area yang kurang jelas
   SEBELUM merencanakan — padanan QUESTIONS.MD (Bab 7.7) harus
   CLOSED dulu sebelum pack dibuat.

3. /speckit.analyze — CROSS-ARTIFACT CHECK
   Setelah tasks dibuat, command ini memeriksa konsistensi antara
   spec ↔ plan ↔ tasks SEBELUM implement.
   → Padanan: Sprint Planner WAJIB memeriksa REQUIREMENTS ↔
     BLUEPRINT ↔ ACCEPTANCE saling konsisten sebelum handoff.
     (Ini pola yang HILANG di Bab 25 — tambahkan ke Aturan.)

4. /speckit.checklist — "UNIT TEST UNTUK ENGLISH"
   Checklist kualitas untuk memvalidasi kelengkapan & kejelasan
   requirement. → Padanan: ACCEPTANCE.MD yang bisa "dijalankan".
```

### Sumber 2: bmad-code-org/BMAD-METHOD ⭐ sangat populer

**Repo:** https://github.com/bmad-code-org/BMAD-METHOD

Metode agile AI-driven dengan tim agent virtual: **Analyst, PM, Architect, SM (Scrum Master), Dev, QA** — paling mirip dengan 12 skill Anda. Lisensi MIT.

**Pola yang relevan untuk Sprint Planner:**

```
1. SM AGENT = SPRINT PLANNER
   BMAD memisahkan: PM (buat PRD), Architect (arsitektur), dan SM
   yang MERAKIT semua output menjadi story terpecah dengan
   acceptance criteria. Ini bukti komunitas bahwa "perakit pack"
   memang harus JADI SATU PERAN TERPISAH — bukan tugas sampingan
   architect. (Validasi Bab 25: SPRINT PLANNER sebagai skill #8.)

2. STORY = SATUAN KERJA BUILDER
   Story BMAD berisi: tujuan, requirements, acceptance criteria,
   dan catatan context yang cukup agar Dev agent tidak perlu chat
   history. → Padanan: Architect Pack 4 dokumen.

3. RIGHT-SIZED PROCESS (UKURAN PROSES MENGIKUTI UKURAN KERJA)
   Perubahan kecil → langsung build tanpa planning penuh; kerja
   besar → planning dalam. → Tambahan Aturan untuk Sprint Planner:
   sprint bugfix kecil boleh pack ringkas, sprint fitur baru wajib
   pack lengkap 4 dokumen.

4. DURABLE CONTEXT — KEPUTUSAN DIBAWA MERAH
   "Decisions stay explicit, context carries forward" — BMAD
   memindahkan keputusan dari chat ke dokumen yang dibaca ulang.
   → Padanan: DECISIONS.MD + STATE.MD.
```

### Sumber 3: Fission-AI/OpenSpec ⭐ ~52k (2026, paling aktif)

**Repo:** https://github.com/Fission-AI/OpenSpec

SDD ringan: **proposal → (specs, tasks) → apply → archive**. Alur perubahan per-fitur.

**Pola yang relevan:**

```
1. SATU FOLDER PER CHANGE, LALU DI-ARCHIVE
   Setiap perubahan punya folder sendiri; setelah selesai dipindah
   ke archive/ sebagai riwayat. → Padanan: sprint-XXX yang selesai
   tetap di planning/sprints/ sebagai arsip + catatan STATE.MD.

2. "FOCUS EFFORT ON REVIEWING SPECS, NOT CODE"
   Filosofi OpenSpec: review spec lebih murah daripada review kode.
   → Memperkuat aturan DRY RUN: menyetujui rencana lebih murah
   daripada memperbaiki kode yang salah.
```

### Sumber 4: obra/superpowers — writing-plans

```
1. TASK 2–5 MENIT PER TASK
   "Breaks work into bite-sized tasks (2-5 minutes each)" — task
   mikrometer dengan file path eksplisit + langkah verifikasi.
   → Aturan tambahan Sprint Planner: BLUEPRINT harus membuat task
     sekecil ini agar builder tidak improvisasi.

2. "CLEAR ENOUGH FOR AN ENTHUSIASTIC JUNIOR ENGINEER"
   Standar plan: bisa diikuti engineer junior yang rajin tapi tanpa
   taste, tanpa judgment, tanpa context proyek.
   → Uji kualitas HANDOFF-PROMPT.MD: dibaca tanpa konteks chat,
     tetap tidak ambigu.
```

### Sumber 5: eyaltoledano/claude-task-master ⭐ populer di komunitas Cursor/Claude

**Repo:** https://github.com/eyaltoledano/claude-task-master

```
1. PRD → tasks.json TERSTRUKTUR
   Parse PRD otomatis menjadi task list dengan dependensi, prioritas,
   dan strategi test per task.
   → Pola untuk Sprint Planner: hasil akhirnya bukan hanya markdown
     naratif, tapi juga data terstruktur yang bisa di-query
     ("task berikutnya apa?") — selaras FILE-INVENTORY.MD.

2. "NEXT TASK" SELALU DARI FILE, BUKAN DARI INGATAN
   Agent bertanya "what's the next task" → jawaban dihitung dari
   dependensi + status di file. → Padanan: STATE.MD sebagai penentu
   langkah berikutnya, bukan chat history.
```

### Sumber 6: joelparkerhenderson/architecture-decision-record ⭐ referensi ADR standar

**Repo:** https://github.com/joelparkerhenderson/architecture-decision-record — **Template klasik:** Michael Nygard (title/status/context/decision/consequences)

```
1. FORMAT ADR NYGARD UNTUK DECISIONS.MD
   Bab 7.4 sudah mendekati ini (keputusan/alasan/dibuat oleh/dampak).
   ADR menambah: STATUS (proposed/accepted/superseded) + konteks.
   → Upgrade format DECISIONS.MD: setiap entri dapat status, sehingga
     keputusan lama bisa di-supersede tanpa dihapus (audit trail).

2. NESTED DECISION MODEL
   ADR bisa merujuk ADR lain (keputusan besar memecah keputusan kecil).
   → Berguna saat TECH STACK ADVISOR & ENTITY MODELER membuat
     keputusan berantai.
```

---

## 26.5 SKILL #9: STATE KEEPER

### Sumber 1: cline/prompts — Memory Bank (pola file-hierarki paling terkenal)

**Sumber:** https://github.com/cline/prompts (`.clinerules/memory-bank.md`) dan https://docs.cline.bot/best-practices/memory-bank

Memory Bank adalah instruksi yang mengubah Cline menjadi "self-documenting development system" — konteks bertahan antar sesi lewat file markdown. **Ini pola paling terkenal untuk STATE KEEPER** dan memvalidasi Pilar #3.

```
HIERARKI MEMORY BANK (dipakai jutaan kali di komunitas Cline):

projectbrief.md      → fondasi (padanan: DOMAIN.MD + PRD)
productContext.md    → mengapa proyek ada, UX (padanan: DOMAIN.MD)
activeContext.md     → fokus SAAT INI + perubahan terbaru +
                       langkah berikutnya (padanan: STATE.MD!)
decisionLog.md       → padanan: DECISIONS.MD
progress.md          → apa yang bekerja / tidak (padanan: VERIFICATION-
                       REPORT + FILE-INVENTORY)
systemPatterns.md    → pola arsitektur (padanan: docs/ARCHITECTURE)

ATURAN EMAS MEMORY BANK (ambillah ini):
1. "Update Memory Bank" WAJIB setelah: menemukan pola baru,
   implementasi signifikan, atau diminta user.
2. Urutan baca fix: projectbrief → productContext → activeContext
   → (progress/decision saat relevan).
3. activeContext = file yang paling sering berubah; dibaca DI AWAL
   SETIAP sesi.
→ Padanan persis: STATE.MD "PALING PENTING!" (Bab 7.3) + aturan
  WAJIB BACA per sesi (Bab 9.5). Memory bank membuktikan pola ini
  bekerja di skala besar.
```

### Sumber 2: github/spec-kit — spec sebagai file hidup

```
1. SPEC TINGGAL DI REPO, BUKAN DI CHAT
   "specs live in your repo, not lost in messages" — filosofi yang
   sama dengan Pilar #3, terbukti pada 50k+ pengguna.

2. SPECS DIUPDATE SAAT CHANGE SELESAI
   Setelah implement, spec utama diperbarui agar mencerminkan sistem
   sekarang. → Aturan STATE KEEPER: setelah sprint selesai, pastikan
   DOMAIN.MD/docs/ tidak basi (sinkron dengan realita kode).
```

### Sumber 3: obra/superpowers — progress ledger

```
1. LEDGER DI FILE, BUKAN DI TODO LIST
   "Conversation memory does not survive compaction... Track progress
   in a ledger file, not only in todos."
   → Padanan: STATE.MD harus cukup lengkap sehingga agent BARU bisa
     lanjut tanpa membaca chat lama sama sekali.

2. FORMAT LEDGER YANG RECOVERABLE
   Setiap baris: Task N: complete + commit hash. Setelah context
   terpotong, agent percaya ledger + git log, BUKAN ingatannya.
   → Upgrade STATE.MD: cantumkan commit hash tiap milestone.
```

### Sumber 4: OpenSpec — archive pattern

```
changes/ dalam proses → pindah ke changes/archive/ saat selesai
→ STATE KEEPER memastikan riwayat sprint tidak hilang: STATE.MD
  ringkas (status sekarang), arsip sprint lengkap (riwayat).
  Sama seperti git: HEAD ringkas, log lengkap.
```

---

## 26.6 SKILL #10: ACCEPTANCE RUNNER

### Sumber 1: obra/superpowers — verification-before-completion (TEKS LENGKAP WAJIB DIBACA)

**File:** https://github.com/obra/superpowers/blob/main/skills/verification-before-completion/SKILL.md

Ini skill yang paling tepat menjadi **fondasi ACCEPTANCE RUNNER**. Inti:

```
THE IRON LAW:
"NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE"
→ Belum menjalankan command verifikasi di pesan ini = TIDAK BOLEH
  mengklaim lolos.

GATE FUNCTION (5 langkah):
1. IDENTIFY: command apa yang membuktikan klaim ini?
2. RUN:      jalankan penuh (fresh, lengkap)
3. READ:     baca output penuh + exit code + hitung kegagalan
4. VERIFY:   apakah output mengkonfirmasi klaim?
5. ONLY THEN: buat klaim — dengan bukti

TABEL KEMBALIAN VERIFIKASI (potongan):
| Klaim            | Butuh bukti                     | TIDAK CUKUP       |
|------------------|---------------------------------|-------------------|
| Tests pass       | output: 0 failures              | run sebelumnya    |
| Build sukses     | exit code 0                     | linter lolos      |
| Bug fixed        | test gejala asli: passes        | kode berubah      |
| Requirements met | checklist per baris requirement | tests passing     |
| Agent selesai    | VCS diff menunjukkan perubahan  | laporan "success" |

RED FLAGS (berhenti jika muncul):
- Pakai kata "should", "probably", "seems to"
- Merasa puas SEBELUM verifikasi ("Great!", "Done!")
- Percaya laporan sukses dari agent lain tanpa cek diff
```

**→ Perbandingan dengan Bab 25:** Aturan ACCEPTANCE RUNNER di Bab 25 sudah benar, tapi superpowers memberi **bahasa yang lebih tegas**: verdict tanpa output asli = "lying, not verifying". Tambahkan tabel ransum verifikasi di atas ke VERIFICATION-REPORT.MD.

### Sumber 2: obra/superpowers — subagent-driven-development (reviewer fresh + bounded loop)

**File:** https://github.com/obra/superpowers/blob/main/skills/subagent-driven-development/SKILL.md

```
POLA TWO-STAGE REVIEW PER TASK:
1. Fresh implementer subagent per task (isolated context)
2. Task reviewer: (a) spec compliance (b) code quality — dua kacamata
3. Final whole-branch review dengan model TERKUAT di akhir

BOUNDED FIX LOOP (versi superpowers lebih presisi dari "maks 3"):
- Fix round R dari 5: R ≤ 3 → lanjutkan implementer yang sama;
  R ≥ 4 → implementer BARU + model lebih kuat
- R = 5 → breaker trip: adjudikasi manual tiap temuan
→ Padanan: ACCEPTANCE RUNNER maks 3 loop rework (Bab 25) — valid,
  dan sekarang punya pola eskalasi yang lebih halus.

FRESH CONTEXT BUKTI KOMUNITAS:
"You delegate tasks to specialized agents with isolated context...
 They should never inherit your session's context or history"
→ Memvalidasi aturan Bab 25: ACCEPTANCE RUNNER wajib fresh context
  (Writer/Reviewer pattern, Bab 12.4).

LEDGER + RULINGS:
- Semua keputusan mid-run dicatat: "Ruling: <apa> — <mengapa> —
  <risiko jika salah>"
- Hanya 4 hal yang boleh menghentikan eksekusi: operasi destruktif/
  irreversible, aksi security-sensitive, efek di luar worktree,
  plan yang rusak total.
→ Padanan: batasan builder + HANDOFF-PROMPT JANGAN/SETUJU.
```

### Sumber 3: anthropics/claude-code — code-review plugin (multi-perspektif)

**Repo:** https://github.com/anthropics/claude-code/tree/main/plugins/code-review

```
"Launching multiple agents in parallel to independently audit
 changes from different perspectives."
→ Pola untuk ACCEPTANCE RUNNER sprint kompleks: jalankan reviewer
  paralel (correctness / security / performance) lalu gabung
  temuan per severity — bukan satu reviewer monolitik.
```

### Sumber 4: Format Gherkin Given-When-Then (standar industri BDD)

```
FORMAT KRITERIA YANG TIDAK BISA "DIPERDEBATKAN":

Given  [kondisi awal]
When   [aksi]
Then   [hasil terukur]

CONTOH (untuk ACCEPTANCE.MD — upgrade dari checklist biasa):
Feature: Parse file Excel
  Scenario: File valid dengan data lengkap
    Given file "data/q1.xlsx" berisi 5 sheet valid
    When  parser dijalankan
    Then  keluar 5 objek data tanpa error
    And   output dashboard.html menampilkan semua nilai kunci

→ Mengapa lebih baik daripada "- [ ] Dashboard bisa dibuka":
  tiap baris bisa dijalankan jadi TEST, hasilnya BUKTI, bukan
  opini. Mengatasi jebakan Bab 17 #4 (terlihat meyakinkan tapi
  gagal edge case).

→ Aturan tambahan ACCEPTANCE RUNNER: setiap kriteria ACCEPTANCE.MD
  harus bisa dipetakan ke: command yang dijalankan + output asli
  yang diharapkan. Kriteria yang tidak bisa dipetakan = TIDAK TERUJI
  (wajib dilapor sebagai GAP ke Sprint Planner).
```

---

## 26.7 SKILL #11: SECURITY & DEPENDENCY AUDITOR

### Sumber 1: anthropics/claude-code-security-review (Anthropic resmi)

**Repo:** https://github.com/anthropics/claude-code-security-review

GitHub Action resmi Anthropic: review keamanan berbasis AI pada setiap PR.

```
POLA YANG DIADOPSI:
1. AI REVIEW + VERIFIKASI: AI menandai temuan, lalu memverifikasi
   konteks untuk mengurangi false positive — bukan sekadar LLM
   beropini. (Sesuai Bab 13.1: "LLMs are useful, but they are not
   reliable... security auditors" → tool dulu, AI menyaring.)

2. GATE DI SETIAP PR:
   "A green check from an older commit does not prove that the
   latest review fix is safe" → scan WAJIB jalan tiap PR/sprint,
   bukan sekali di akhir proyek.

3. SCOPE: hanya menganalisis DIFF + file terdampak, dengan
   instruksi khusus OWASP Top 10 + CWE.
→ Upgrade SECURITY AUDITOR: laporan temuan memakai klasifikasi
  CWE/OWASP agar bisa ditindaklanjuti & dibandingkan antar sprint.
```

### Sumber 2: gitleaks/gitleaks ⭐ ~28k

**Repo:** https://github.com/gitleaks/gitleaks

SAST untuk mendeteksi secret (password, API key, token) di repo, file, stdin. Standar de-facto untuk **pre-commit + CI** ( tercepat di kelasnya; support laporan JSON/CSV/SARIF/JUnit).

```
POSL  (pre-commit):
- Blok secret SEBELUM masuk git history (murah, cepat)
- Integrasi .pre-commit-config.yaml / husky
→ Untuk builder AI: pasang sebagai hook proyek sejak sprint 001 —
  AI terkenal menuliskan API key dummy yang KADANG asli.

CI:
- gitleaks detect --redact --report-format sarif
→ Gate wajib di ci.yml Bab 22.3.
```

### Sumber 3: trufflesecurity/trufflehog ⭐ ~20k+

**Repo:** https://github.com/trufflesecurity/trufflehog

Secret scanner dengan **verifikasi kredensial** — temuan dikonfirmasi apakah masih AKTIF atau tidak.

```
KOMPLEMENTER GITLEAKS:
- Gitleaks   → cepat, cocok pre-commit & diff scan
- TruffleHog → verifikasi "apakah secret ini masih hidup?",
              cocok untuk sweep history mingguan di CI
→ Aturan SECURITY AUDITOR: temuan KRITIS = secret terverifikasi
  aktif; temuan tanpa verifikasi = SEDANG (tetap dicatat di RISKS.MD).
```

### Sumber 4: github/spec-kit — /speckit.checklist ("unit test untuk English")

```
Checklist khusus yang memvalidasi requirement SEBELUM implementasi.
→ Untuk SECURITY AUDITOR: buat SECURITY-CHECKLIST.MD per sprint
  (input tervalidasi? auth di endpoint? rate limit? log tidak
  bocor?) — checklist diperiksa sebagai "unit test English"
  SEBELUM kode di-review mendalam. Sesuai Bab 22.2 Checklist P1.
```

---

## 26.8 SKILL #12: DEPLOY & PRODUCTION GATE

### Sumber 1: gorrion-io/production-readiness-checklist

**Repo:** https://github.com/gorrion-io/production-readiness-checklist

Checklist production-readiness per kategori (dipakai software house; tersedia halaman live).

```
KATEGORI YANG LENGKAP DI SINI (padanan Checklist P1 Bab 22.2):
- CI/CD: tests + audits jalan otomatis di pipeline
- Security: audit package untuk membatasi CVE
- Monitoring/error tracking, backup, environment config
→ Upgrade DEPLOY GATE: struktur checklist Bab 22.2 diperluas dengan
  kategori "dokumentasi ops" (runbook: apa yang dilakukan saat
  error produksi?) — satu temuan komunitas yang tidak ada di Bab 22.
```

### Sumber 2: kgoralski/microservice-production-readiness-checklist ⭐ ~4k (SRE-grade)

**Repo:** https://github.com/kgoralski/microservice-production-readiness-checklist

Checklist berbasis pengalaman bertahun-tahun menjalankan sistem di produksi (kesehatan, observability, deployment, security).

```
ITEM YANG RELEVAN UNTUK VIBE CODER (subset, jangan semua):
- Health check endpoint + liveness/readiness
- Graceful shutdown ( aplikasi menutup koneksi dengan rapi)
- Structured logging + correlation id
- Backup DB + proses restore yang PERNAH DICOBA
- Resource limit + alerting pada error rate
→ Aturan DEPLOY GATE: item checklist P1 Bab 22.2 tetap inti;
  item SRE di atas jadi "P1.5" untuk proyek yang sudah punya user.
```

### Sumber 3: Pola CI/CD dari spec-kit + Bab 22.3

```
SPEC-KIT: converge loop — implement → periksa terhadap spec →
tambahkan sisa pekerjaan sebagai task baru → ulangi sampai
"Converged".
→ Padanan DEPLOY GATE: GO hanya ketika checklist P1 "converged"
  (semua item berbukti). Ada yang gagal → kembali ke builder,
  BUKAN lewati.

CI PIPELINE (gabungan Bab 22.3 + praktik komunitas):
lint → typecheck → test → build → gitleaks → npm audit → deploy
→ Tiap gate red-hijau nyata; deploy DITOLAK otomatis saat gagal.
```

---

## 26.9 Validasi Silang: Prinsip Metode vs Pola Repo

Temuan penting: **prinsip metode Architect-Builder terkonfirmasi oleh repo besar secara independen.**

```
PRINSIP METODE ANDA          KONFIRMASI DARI REPO
═══════════════════════════════════════════════════════════════════
Pilar #3: folder = source    cline Memory Bank; spec-kit "specs live
of truth, bukan chat         in your repo"; superpowers ledger
                             "track progress in a ledger file, not
                             only in todos"

Dry run & tunggu approve     superpowers writing-plans (plan "clear
(Bab 8.4, 21 pola 5)         enough for junior"); OpenSpec "focus
                             effort on reviewing specs, not code"

Fresh reviewer (Bab 12.4)    superpowers subagent-driven-dev: "they
                             should never inherit your session's
                             context"; claude-code code-review
                             multi-agent paralel

Bounded loop maks 3          superpowers fix round R of 5 (R≥4 ganti
(Bab 21 pola 8)              implementer + model lebih kuat); spec-kit
                             converge loop sampai "Converged"

Tool dulu, opini belakangan  claude-code-security-review (AI menyaring
(Bab 13.1)                   temuan tool); gitleaks/trufflehog verifikasi

Keputusan terdokumentasi     joelparkerhenderson ADR (Nygard template);
(Bab 7.4)                    BMAD "decisions stay explicit, context
                             carries forward"

Anti over-engineering        superpowers YAGNI; OpenSpec minimalisme;
(Bab 25.6)                   spec-kit right-sized process (BMAD juga)
═══════════════════════════════════════════════════════════════════
```

---

## 26.10 Rekomendasi Implementasi per Skill (Cheat Sheet)

Setiap skill baru sebaiknya di-build mengikuti format standar terbuka. **Rekomendasi format**: `SKILL.md` ala agentskills.io (frontmatter + body + references/), ditempatkan di `.claude/skills/<skill-name>/SKILL.md` (dan dipetakan ke CODEX.MD bila perlu).

```
SKILL                BUILDER-STYLE RESEP SINGKAT
═══════════════════════════════════════════════════════════════════
#7  SCAFFOLDER       Body: daftar file Bab 6.1 → template Bab 7 per
                     file → aturan JANGAN. References: bab-6.md,
                     bab-7.md (progressive disclosure).
                     Trigger: "new project", "scaffold".

#8  SPRINT PLANNER   Body: alur rakit pack (Bab 8.4) → rules: 4
                     dokumen wajib, task 2-5 menit (superpowers),
                     cross-artifact check ala /speckit.analyze,
                     ADR untuk keputusan. References: bab-8, bab-10.

#9  STATE KEEPER     Body: memori-bank update rules (update SETELAH:
                     pola baru / implementasi signifikan / diminta),
                     format Bab 7.3–7.7, + commit hash per milestone,
                     + saran /clear (Bab 14.3).

#10 ACCEPTANCE       Body: IRON LAW verbatim + gate function 5
    RUNNER             langkah + tabel ransum verifikasi + format
                       Gherkin + fix loop R≤3 lanjut / R=5 eskalasi.
                       References: bab-12, bab-21.

#11 SECURITY &       Body: urutan scan (audit → secret scan →
    DEP. AUDITOR       blueprint diff → checklist P1) + klasifikasi
                       severity + keputusan gate. Scripts: call
                       gitleaks + npm audit. References: bab-13, bab-22.2.

#12 DEPLOY &         Body: pipeline ci.yml Bab 22.3 + checklist P1
    PROD. GATE         dicentang per item dengan bukti + GO/NO-GO
                       + rollback plan. References: bab-22, checklist
                       repo gorrion & kgoralski (subset).
═══════════════════════════════════════════════════════════════════
```

**Catatan penting untuk semua skill:**

```
1. SEMUA skill = format SKILL.md (agentskills.io) → portable antar
   Claude Code, Codex, Cursor, Copilot (satu investasi, semua tool).
2. Description = trigger situasional (contoh superpowers):
   "Use when about to claim work is complete..." — bukan "helps with X".
3. Body < 500 baris; detail ke references/ (progressive disclosure).
4. Skill boleh memanggil skill lain (rantai Bab 25.2) — seperti
   superpowers writing-plans ← brainstorming → subagent-driven-dev.
5. Semua loop dibatasi (bounded) + semua klaim berbukti (evidence) —
   dua prinsip yang paling konsisten di SEMUA repo riset ini.
```

---

## 26.11 Kesenjangan Kecil yang Ditemukan (di luar 12 Skill)

Riset menemukan 2 pola yang belum dimiliki Bab 25 tapi layak dipertimbangkan:

1. **CROSS-ARTIFACT CHECK** (spec-kit `/speckit.analyze`): sebelum handoff, Sprint Planner memeriksa konsistensi antar 4 dokumen (requirement X punya blueprint? blueprint Y punya acceptance?). Murah, mencegah bug mahal di Tahap 5. → Bisa jadi sub-aturan Sprint Planner, tidak perlu skill baru.

2. **RIGHT-SIZED PROCESS** (BMAD + spec-kit): tidak semua perubahan butuh pack penuh 4 dokumen. Bug kecil → pack ringkas (assess → fix → test ala spec-kit bug extension); fitur baru → pack lengkap. → Tambahkan sebagai aturan Sprint Planner agar pipeline tidak menjadi birokrasi.

---

## 26.12 Daftar Repo Lengkap (dengan URL)

| Repo | URL | Relevansi |
|------|-----|-----------|
| github/spec-kit | github.com/github/spec-kit | SCAFFOLDER, SPRINT PLANNER, STATE KEEPER, SECURITY |
| bmad-code-org/BMAD-METHOD | github.com/bmad-code-org/BMAD-METHOD | SPRINT PLANNER (SM agent), right-sized process |
| Fission-AI/OpenSpec | github.com/Fission-AI/OpenSpec | SPRINT PLANNER (change → archive), STATE KEEPER |
| obra/superpowers | github.com/obra/superpowers | SEMUA skill (format), ACCEPTANCE RUNNER (utama), SCAFFOLDER |
| anthropics/skills | github.com/anthropics/skills | Format SKILL.md semua skill |
| agentskills.io (spec) | agentskills.io/specification | Spesifikasi format skill standar terbuka |
| anthropics/claude-code-security-review | github.com/anthropics/claude-code-security-review | SECURITY AUDITOR |
| anthropics/claude-code (plugins/code-review) | github.com/anthropics/claude-code | ACCEPTANCE RUNNER multi-perspektif |
| gitleaks/gitleaks | github.com/gitleaks/gitleaks | SECURITY AUDITOR (secret scan) |
| trufflesecurity/trufflehog | github.com/trufflesecurity/trufflehog | SECURITY AUDITOR (verifikasi kredensial) |
| cline/prompts (memory bank) | github.com/cline/prompts | STATE KEEPER (pola hierarki file) |
| eyaltoledano/claude-task-master | github.com/eyaltoledano/claude-task-master | SPRINT PLANNER (PRD → task terstruktur) |
| joelparkerhenderson/architecture-decision-record | github.com/joelparkerhenderson/architecture-decision-record | DECISIONS.MD / ADR format |
| gorrion-io/production-readiness-checklist | github.com/gorrion-io/production-readiness-checklist | DEPLOY GATE |
| kgoralski/microservice-production-readiness-checklist | github.com/kgoralski/microservice-production-readiness-checklist | DEPLOY GATE (SRE-grade) |

---

**📅 Ditambahkan:** September 2026
**📚 Metode riset:** Survey repo GitHub populer & aktif (vendor resmi: GitHub & Anthropic; komunitas: superpowers ~40k, OpenSpec ~52k, BMAD, gitleaks ~28k, dll), pembacaan langsung SKILL.md & dokumentasi resmi, pemetaan pola → 6 skill baru Bab 25.
**🎯 Tujuan:** Memberi dasar empiris (bukan opini) untuk membangun skill #7–#12, dengan format standar terbuka agar portable antar tool agent.

---

> **💡 Pesan kunci bab ini:**
>
> *Anda tidak sedang menemukan sesuatu yang baru — Anda mengadopsi pola yang sudah diverifikasi ribuan developer. Iron Law dari superpowers, folder-as-source-of-truth dari Memory Bank, gate-nya security review Anthropic, dan checklist production-readiness dari SRE: semuanya mengarah ke satu prinsip yang sama dengan metode Architect-Builder — "evidence before claims." Bedanya, repo-repo ini menunjukkan CARA menegakkannya secara mekanis.*
