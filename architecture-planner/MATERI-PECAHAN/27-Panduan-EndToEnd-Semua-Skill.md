# PANDUAN END-TO-END: Semua Skill dari Ide sampai Aplikasi Siap Production

> **💬 Bayangkan ini:** Bab 25 memetakan 12 skill utama, Bab 26 memberi dasar risetnya, dan folder skill Anda kini berisi pipeline lengkap plus router anti-halusinasi (`materi-reference`). Bab ini adalah **buku panduan operasionalnya**: ritel persis dari ide pertama sampai aplikasi ter-deploy dan dipantau — termasuk **di mana dan kapan** memakai 4 skill pendukung (**taste**, **impeccable**, **browser-skill**, **pen-design**) dan 4 skill otentik pihak ketiga (**observability-and-instrumentation**, **debugging-and-error-recovery**, **systematic-debugging**, **constraint-driven-development**). Membawa **proyek existing** yang belum pernah memakai workflow ini? → mulai dari jalur adopsi di 27.8.

---

## 27.1 Dua Lapis Skill: Pipeline Utama + Lapis Pendukung

```
LAPIS 1 — PIPELINE UTAMA (13 skill, berurutan, punya pemilik tahap)
═══════════════════════════════════════════════════════════════════
/scaffolder → /idea-clarifier → /prd-generator → /tech-stack-advisor
→ /entity-modeler → /module-planner → /sprint-planner
→ /ai-coding-coach (dry run → build)
→ /acceptance-runner → /security-dependency-auditor
→ /deploy-production-gate → /state-keeper ♻️ per sprint

LAPIS 2 — LAPIS PENDUKUNG (4 skill, dipanggil DI DALAM tahap tertentu)
═══════════════════════════════════════════════════════════════════
/pen-design    → visualisasi mockup SEBELUM coding (Tahap 2-3)
/taste         → arah desain anti-slop untuk halaman marketing (Tahap 5)
/impeccable    → kualitas UI semua permukaan + polish/harden (Tahap 5-6)
/browser-skill → bukti visual & verifikasi di browser nyata (Tahap 6)

LAPIS 3 — SKILL OTENTIK PIHAK KETIGA (4 skill, verbatim dari sumber asli,
TANPA modifikasi — atribusi di 27.4b)
═══════════════════════════════════════════════════════════════════
/observability-and-instrumentation → mata produksi: logging/metrics/
                                     tracing/alerting (addyosmani)
/debugging-and-error-recovery      → root-cause saat ada bug
                                     (addyosmani)
/systematic-debugging              → root-cause 4 fase (obra/
                                     superpowers)
/constraint-driven-development     → quality contract CONSTRAINTS.md +
                                     guard bar anti-turun (addyosmani)

LAPIS 0 — ROUTER (selalu aktif)
═══════════════════════════════════════════════════════════════════
/materi-reference → WAJIB dikonsultasi setiap skill sebelum bertindak:
                    baca bab sumbernya, kutip verbatim, sitasi (Bab X.Y)
```

**Aturan komposisi:** lapis pendukung TIDAK menggantikan pipeline. Mereka tidak punya tahap sendiri — mereka masuk ke tahap pipeline yang sudah ada (detail di 27.4).

---

## 27.2 Tabel "Di Mana dan Kapan" Semua Skill

| Skill | Tahap | Dipakai kapan | TIDAK dipakai kapan |
|---|---|---|---|
| `/materi-reference` | SEMUA | Sebelum langkah penting skill mana pun — baca bab sumber dulu | — (selalu aktif) |
| `/scaffolder` | Tahap 1 | Proyek baru, sekali jalan; proyek existing → MODE ADOPS (27.8) | — |
| `/idea-clarifier` | Tahap 2 | Ide masih mentah/ambigu | Requirement sudah jelas & teruji |
| `/pen-design` ⭐ | Tahap 2–3 | Saat user butuh MELIHAT bentuk UI sebelum setuju: mockup halaman, wireframe dashboard, slide, aset marketing. Output `.pen` → diekspor gambar → jadi lampiran BLUEPRINT | Aplikasi tanpa UI; saat UI sudah ada dan hanya perlu diubah kecil |
| `/prd-generator` | Tahap 3.1 | Setelah problem brief disetujui | — |
| `/tech-stack-advisor` | Tahap 3.2 | Setelah PRD; catat ADR ke DECISIONS.MD | Stack sudah terkunci proyek existing |
| `/entity-modeler` | Tahap 3.3 | Setelah stack | Sprint tanpa perubahan data |
| `/module-planner` | Tahap 3.4 | Setelah model data | — |
| `/constraint-driven-development` 📦 | Tahap 3.4b | Setelah module-planner (batas modul & stack sudah terkunci): interview 4 pertanyaan dengan default → CONSTRAINTS.md (Floor + dimensi berangka + command nyata di kolom "Checked by") → gate siap dirujuk ACCEPTANCE. Ulang saat dimensi kualitas berubah atau saat adopsi 27.8 | Skrip sekali pakai, prototipe throwaway, proyek yang sudah punya CONSTRAINTS.md (baca, jangan timpa) |
| `/sprint-planner` | Tahap 3.5 + loop | Rakit pack 4 dokumen (BLUEPRINT: DoD mesin per task; ACCEPTANCE: Task Gate; HANDOFF-PROMPT: blok bootstrap — 27.4c); ulang tiap sprint baru | Bug sekecil typo (langsung fix, catat STATE.MD) |
| `/state-keeper` | Setiap penutup tahap | Sprint selesai, keputusan baru, risiko/pertanyaan baru | — |
| `/ai-coding-coach` | Tahap 4–5 | MODE DRY RUN dulu (bootstrap → rencana → tulis DRYRUN-REPORT.MD → TUNGGU approve) → MODE BUILD; task COMPLETE hanya bila command DoD hijau + output ditempel (27.4c) | Tanpa architect pack (dilarang AGENTS.MD) |
| `/taste` ⭐ | Tahap 5 (UI build) | Halaman **marketing-facing**: landing page, portfolio, redesign, halaman publik. Agent membaca brief → keluarkan satu baris "Design Read" → set 3 dial (VARIANCE/MOTION/DENSITY) → tulis UI yang tidak terlihat template | **Dashboard, data table, product UI multi-step** (di luar scope-nya — di sana pakai `/impeccable` mode Operate) |
| `/impeccable` ⭐ | Tahap 5–6 | **Semua permukaan UI**: product UI, dashboard, form, settings, empty state. Perintah kunci: `shape` (rencana UX), `critique` (review heuristik), `audit` (a11y/perf/responsive), `polish` (final pass), `harden` (error state, i18n, edge case), `adapt` (multi-device), `live` (varian visual di browser) | Backend-only / non-UI |
| `/acceptance-runner` | Tahap 6a | Builder lapor "selesai" — fresh context, jalankan ACCEPTANCE.MD | Review gaya/penyusunan (bukan correctness) |
| `/browser-skill` ⭐ | Tahap 6a, 6c, Discovery | Butuh **bukti dari browser nyata**: screenshot halaman sebagai bukti acceptance, regresi UI setelah PR, validasi halaman live pasca-deploy (`/health`, halaman utama), ambil data dari web untuk Discovery. Siklus wajib: `bsk session start` → observe-act-observe → `bsk session stop` | Tugas tanpa browser; mengekstrak kredensial/cookie (dilarang) |
| `/security-dependency-auditor` | Tahap 6b | Setelah acceptance PASS; wajib ulang jika dependensi berubah | — |
| `/deploy-production-gate` | Sprint akhir | Checklist P1 berbukti → GO/NO-GO | Deploy "sekalian coba-coba" tanpa gate |
| `/constitution` | Awal proyek (opsional tapi disarankan) | Tetapkan aturan proyek + standar keamanan sekali di awal | — |
| `/observability-and-instrumentation` 📦 | Tahap 5 (bersama build) + saat butuh bukti produksi | Fitur punya retry/queue/external call → instrumentasi DIBERSAMA build: 2-4 pertanyaan on-call dulu, log structured + requestId, RED metrics, OTel tracing, alert symptom-based + runbook | Diagnosis bug yang sedang terjadi (itu ranah debugging) |
| `/debugging-and-error-recovery` 📦 | Saat bug/error muncul | Tests gagal, build rusak, "kemarin jalan sekarang error" → root-cause sistematis, BUKAN tebakan | langsung patch tanpa akar masalah |
| `/systematic-debugging` 📦 | Saat bug/error muncul (alternatif/pasangan) | 4 fase root-cause: akar masalah → pola → hipotesis minimal → implement, dengan bukti per fase | — |

📦 = skill otentik pihak ketiga (verbatim dari repo sumber, atribusi di 27.4b).

⭐ = fokus bab ini (lapis pendukung).

---

## 27.3 Ritel Lengkap: Ide → Production

### TAHAP 1 — Persiapan

```
1. /materi-reference      → baca Bab 06 + 07 (struktur & template file)
2. /scaffolder            → "Buatkan scaffold proyek [NAMA], jenis app [X],
                             builder [Claude Code/Codex/...]"
                             → folder + semua file template siap
3. /constitution          → (disarankan) aturan proyek + standar keamanan

   ⚠️ Proyek EXISTING (kode sudah ada, belum pernah pakai workflow)?
   → JANGAN mulai dari /scaffolder proyek baru. Ikuti jalur adopsi
     di 27.8: scaffolder MODE ADOPS + backfill folder + baseline.
```

### TAHAP 2 — Discovery & Visualisasi

```
4. /idea-clarifier        → interview terpandu → problem brief
                             → isi DOMAIN.MD + QUESTIONS.MD
5. /pen-design  ⭐         → SAAT INI: user butuh melihat, belum membaca.
                             "Buatkan mockup 3 layar utama: [deskripsi]"
                             → .pen file → export gambar
                             → simpan ke references/mockups/ (audit trail)
6. User pilih mockup      → mockup terpilih jadi LAMPIRAN wajib BLUEPRINT
                             (builder tidak menebak desain — ada gambarnya)
7. /taste  ⭐ (read only)  → jika ada halaman marketing/landing: minta
                             "Design Read" satu baris sejak sekarang
                             ("Reading this as: ...") → catat di BLUEPRINT
                             agar arah desain terkunci sejak Tahap 3
```

**Mengapa mockup di Tahap 2?** Menyetujui gambar 10x lebih murah daripada memperbaiki kode (OpenSpec: *review specs, not code*). Mockup = spesifikasi visual termurah.

### TAHAP 3 — Architect Pack

```
8.  /prd-generator        → PRD (apa & mengapa)
9.  /tech-stack-advisor   → stack + ADR → DECISIONS.MD
10. /entity-modeler       → model data (+ keputusan storage)
11. /module-planner       → arsitektur + daftar file
11b. /constraint-driven-development 📦 → interview 4 pertanyaan
                             (default tersedia — "tidak tahu" tetap sah)
                             → CONSTRAINTS.md di root proyek: Floor
                             selalu-enforced + dimensi berangka dengan
                             command nyata ("Checked by") + ratchet
                             → gate kualitas siap dirujuk ACCEPTANCE
                             (detail & atribusi: 27.4b)
12. /sprint-planner       → rencana sprint 1..N + pack sprint-001:
                             REQUIREMENTS / BLUEPRINT (+ mockup terpilih
                             + Design Read + DoD mesin per task: command
                             lint+type+test — 27.4c) / ACCEPTANCE (Given-
                             When-Then + command persis + Task Gate) /
                             HANDOFF-PROMPT (+ blok perintah bootstrap)
                             → cross-artifact check WAJIB
13. /state-keeper         → catat: perencanaan selesai
```

### TAHAP 4 — Handoff & Dry Run

```
14. Buka builder tool di folder proyek (chat BARU — Bab 14.3)
15. /ai-coding-coach MODE DRY RUN → jalankan dulu blok bootstrap dari
    HANDOFF-PROMPT (init script / dev-server + sanity check — 27.4c)
    → baca pack + AGENTS.MD + STATE.MD
    → laporkan rencana → tulis planning/sprints/sprint-XXX/
    DRYRUN-REPORT.MD → TUNGGU approve
16. User review dry run → ubah poin yang salah ATAU "Approved"
    → /ai-coding-coach MODE BUILD (resmi didefinisikan di SKILL.md
    sejak 18 Sep 2026 — sebelumnya mode hanya hidup di dokumen ini;
    menyimpang dari report yang di-approve = STOP + re-approve)
```

### TAHAP 5 — Build (sinergi dengan lapis pendukung)

```
17. /ai-coding-coach MODE BUILD → kode + test per task BLUEPRINT

18. SAAT MEMBANGUN UI ⭐ — pilih skill desain sesuai JENIS permukaan:
    ┌────────────────────────────────────────────────────────────┐
    │ Landing page / portfolio / halaman publik → /taste          │
    │   (design read → 3 dial → anti-slop, bukan AI-purple)       │
    │ Dashboard / product UI / form / settings → /impeccable      │
    │   mode Operate (scanability & konsistensi > ekspresi)       │
    │ Docs / artikel                              → /impeccable   │
    │   mode Read (struktur untuk pemahaman)                      │
    └────────────────────────────────────────────────────────────┘
    Alur impeccable per permukaan: shape (rencana) → build bersama
    coach → critique (review heuristik) → polish → harden.

19. Selama build: screenshot bukti antara (lihat Tahap 6a untuk
    browser-skill) — builder melaporkan BUKTI, bukan klaim.
```

### TAHAP 6 — Verifikasi, Keamanan, Deploy

```
20. /acceptance-runner (FRESH context) → jalankan ACCEPTANCE.MD
    ├─ Kriteria visual? → /browser-skill ⭐ ambil screenshot nyata
    │   bsk session start → navigate → observe → screenshot
    │   → bsk session stop  → screenshot jadi lampiran bukti
    ├─ PASS  → lanjut
    └─ FAIL/UNTESTED → rework builder (maks 5 putaran → manusia)

21. /security-dependency-auditor → npm audit + secret scan
    + drift BLUEPRINT + Checklist P1 → CLEAN / temuan

22. /deploy-production-gate → ci.yml + /health + Sentry + UptimeRobot
    + .env.example + rollback plan → centang P1 SATU PER SATU
    Setelah deploy: /browser-skill ⭐ verifikasi ulang halaman LIVE
    (buka URL produksi, cek /health, screenshot) → bukti GO

23. /state-keeper → STATE/DECISIONS/RISKS/QUESTIONS + commit hash
    + "sprint baru = chat baru"
24. Masih ada sprint? → kembali ke langkah 12 ♻️
25. 🚀 PRODUCTION — dipantau Sentry + UptimeRobot
```

---

## 27.4 Aturan Batin 4 Skill Pendukung

### /pen-design (MCP Pencil / pen.dev CLI)

```
KAPAN  : Tahap 2 (mockup pra-coding) dan saat user berkata "buatkan
         visual/mockup/design untuk..."
BUTUH  : pen CLI (npm i -g @pen.dev/cli) + auth (pen status/login)
OUTPUT : file .pen → export gambar → references/mockups/
ATURAN : Mockup BUKAN kode. Jangan pernah membiarkan mockup menjadi
         implementasi — ia lampiran BLUEPRINT, builder yang menulis kode.
BATAL  : Proyek tanpa UI; perubahan kecil pada UI existing (edit langsung).
```

### /taste

```
KAPAN  : Halaman marketing-facing SAAT DIBANGUN (Tahap 5) atau redesign.
AWAL   : Keluarkan "Design Read" satu baris + 3 dial
         (VARIANCE / MOTION / DENSITY) SEBELUM kode apa pun.
LARANG : Default AI — gradasi ungu, hero gelap mesh, 3 kartu fitur sama,
         glassmorphism di mana-mana, Inter + slate-900.
BATAL  : Dashboard, data table, product UI multi-step → pakai /impeccable.
```

### /impeccable

```
KAPAN  : Semua permukaan UI non-marketing + polish/harden SEBELUM
         acceptance (Tahap 5-6).
KUNCI  : shape → critique → polish → harden → adapt
         harden WAJIB untuk sprint terakhir (error state, edge case, i18n).
DISIPLIN: Verifikasi TERBATAS — satu ronde inspeksi (desktop+mobile
         sekaligus), satu batch fix, maks satu ronde konfirmasi.
         Jangan QA tanpa akhir — boros uang user.
BATAL  : Backend-only, non-UI.
```

### /browser-skill

```
KAPAN  : (a) Bukti acceptance untuk kriteria visual,
         (b) regresi UI setelah PR/fix,
         (c) validasi halaman LIVE setelah deploy,
         (d) Discovery: ambil data dari halaman web sumber.
SIKLUS : session start → observe-act-observe (@eN refs, BUKAN CSS)
         → session stop (selalu, juga saat error)
TANGGA : observe → probe-hover → snapshot → get-html → screenshot
         (naik hanya bila perlu — jangan mulai dari screenshot)
AMAN   : Agent Window terisolasi; tab user hanya via tab borrow/return;
         JANGAN ekstrak kredensial/cookie/token.
BATAL  : Tugas tanpa browser.
```

---

## 27.4b Skill Otentik Pihak Ketiga (Verbatim, Tanpa Modifikasi)

Empat skill berikut **bukan kreasi materi ini** — diunduh apa adanya dari repo sumber terpercaya dan populer, tersimpan juga di `fundamental-vibe-coding/skills-vendor/` untuk sinkronisasi ulang:

| Skill | Sumber | Peran dalam pipeline | Pemetaan bab |
|---|---|---|---|
| `observability-and-instrumentation` | **addyosmani/agent-skills** (Addy Osmani, Google) | Mata produksi: telemetri sebagai bagian dari definisi selesai. Kunci: pertanyaan on-call dulu → structured logging + correlation ID + entry-point stamping → RED/USE metrics (p99, bukan average; label bebas cardinality bomb) → OpenTelemetry tracing → alert **symptom-based** + **runbook 3 baris** per alert → verifikasi telemetri itu sendiri | Bab 13, 22.5 |
| `debugging-and-error-recovery` | **addyosmani/agent-skills** | Pasangan resmi skill observability: saat ada bug — root-cause sistematis sebelum fix | Bab 12, 17 |
| `systematic-debugging` | **obra/superpowers** (Jesse Vincent) | Root-cause 4 fase dengan bukti per fase; anti-tebakan | Bab 12, 21 |
| `constraint-driven-development` | **addyosmani/agent-skills** (Addy Osmani, Google) | Quality contract: CONSTRAINTS.md — bar kualitas tertulis dengan angka + command nyata per dimensi, ratchet "ukur & tahan", exceptions ber-expires, dan **guard bar**: threshold diturunkan / test di-skip / suppression baru (@ts-ignore, eslint-disable, nosemgrep) / stub = LOUD di diff. Posisi pipeline: **Tahap 3.4b** | Bab 13, 22 |

**Aturan penggunaan (BUG FIX ROUTING — juga terpasang di WORKFLOW.md semua agent):**

```
BUG/ERROR DITEMUKAN
  1. Perlu tahu APA yang terjadi?    → /observability-and-instrumentation
     (cari requestId di log structured, metrics p99, trace)
  2. Cari AKAR MASALAH, bukan gejala → /debugging-and-error-recovery
     ATAU /systematic-debugging
  3. Klasifikasi per CHANGE MANAGEMENT (27.6):
     bug kecil + penyebab jelas → fix langsung + log STATE.MD
     selain itu                 → /sprint-planner pack (regression
                                  test GEJALA ASLI wajib di ACCEPTANCE)
  4. Fix via /ai-coding-coach
  5. Verifikasi via /acceptance-runner: "Bug fixed" = test gejala asli
     PASS + red-green dicek — BUKAN "kode sudah diubah"
  6. /state-keeper → catat akar masalah; ada runbook? perbarui runbook

ATURAN: TIDAK BOLEH menulis fix SEBELUM akar masalah terbukti.
```

**Dua tambahan kebiasaan dari skill observability yang masuk ke Tahap 5:**
1. **Telemetri = definisi selesai**: fitur dengan retry/queue/external call tanpa telemetri = RED FLAG di dry run.
2. **Setiap alert punya runbook 3 baris** (artinya → cek pertama → eskalasi ke siapa) di `docs/runbooks/` — diperbarui saat menutup incident.

**Catatan khusus `constraint-driven-development` (Tahap 3.4b):** skill interview — blok Caveman ditempel dengan **Interview Exception O-CDD-1** (tercatat di `skills-vendor/OVERRIDES.md`): interview 4 pertanyaan & verdict block/warn per dimensi selalu ditulis JELAS PENUH; hanya laporan rutin yang terse. Aturan bawaan skill tetap berlaku penuh: *"This file does not get weakened to make a change pass."* CONSTRAINTS.md hanya berubah lewat keputusan manusia. Dependensi wajib: `references/floor-guard.md` (ikut disalin ke semua lokasi). Terdaftar di `skills-lock.json`.

---

## 27.4c Task Gate & Bootstrap — Hasil Riset Harness Engineering (Sep 2026)

Riset terhadap sumber resmi harness engineering — OpenAI *"Harness engineering: leveraging Codex in an agent-first world"* (Feb 2026), dua artikel engineering Anthropic (*Effective harnesses for long-running agents*, *Harness design for long-running application development*), Martin Fowler *"Harness engineering for coding agent users"*, dan GitHub spec-kit — menemukan dua gap di pipeline ini: verifikasi baru terjadi di gate akhir sprint (Tahap 6), dan builder memulai sesi tanpa perintah setup deterministik. Keduanya kini ditutup oleh aturan berikut (sudah terpasang di `sprint-planner` Step 3–4 dan `ai-coding-coach` Step 2/4/6):

```
ATURAN 1 — TASK GATE (shift-left, Fowler: sensor computational murah
           dijalankan per perubahan, bukan hanya di pipeline akhir):
  - Setiap task di BLUEPRINT.MD wajib punya definition-of-done MESIN:
    command persis lint + type-check + unit test (ambil dari kolom
    "Checked by" / check:task di CONSTRAINTS.md bila ada).
  - Task boleh ditandai COMPLETE hanya bila command itu HIJAU —
    builder menempel output sebagai bukti, bukan klaim
    (konsisten Iron Law acceptance-runner, Bab 12).
  - ACCEPTANCE.MD mendapat section "Task Gate" di atas: kriteria
    sprint baru dinilai setelah DoD per task hijau. Gate akhir
    memverifikasi PERILAKU — tidak menggantikan gate per task.

ATURAN 2 — BOOTSTRAP (Anthropic: init.sh + dev server + sanity check
           di awal sesi menghemat token dan mencegah setup trial-error):
  - HANDOFF-PROMPT.MD wajib memuat blok perintah bootstrap:
    init script ATAU command eksplisit (install → migrate → dev server
    → smoke check). Proyek tanpa init.sh? Tulis command-nya manual
    di prompt — builder tidak boleh membakar konteks mencari cara setup.
  - Builder menjalankan bootstrap SEBELUM dry run (Tahap 4 langkah 15).

CHECK BARU di cross-artifact check sprint-planner (Step 4):
  □ Setiap task BLUEPRINT punya command DoD mesin
  □ HANDOFF-PROMPT memuat blok bootstrap
```

**Mengapa ini standar, bukan bikinan:** OpenAI menegakkan arsitektur secara *mekanis* ("bukan lewat niat"); Anthropic mewajibkan agen memverifikasi lewat tool nyata sebelum menandai fitur selesai dan menyediakan `init.sh` di awal sesi; Fowler: *"Run fast computational sensors before commits; defer expensive inferential checks to pipelines."* CONSTRAINTS.md (Tahap 3.4b) adalah sumber command-nya — Task Gate adalah cara command itu ditegakkan per task.

**Keputusan lanjutan (18 Sep 2026, disetujui pemilik):**
1. **Formalisasi mode ai-coding-coach** — riset menunjukkan industri memisah *fase* plan/build lewat mode (Cline Plan & Act, Claude Code plan mode) ATAU lewat skill terpisah dengan artefak file di antaranya (superpowers `writing-plans`/`executing-plans`, Anthropic planner–generator–evaluator). Dipilih jalur mode (satu skill, dua mode) + artefak file: `MODE DRY RUN` kini resmi didefinisikan di SKILL.md dan **wajib menulis `DRYRUN-REPORT.MD`** ke folder sprint sebelum minta approve; `MODE BUILD` hanya jalan setelah approve dan wajib STOP + re-approve bila menyimpang dari report. Sebelumnya mode ini hanya hidup di dokumen Bab 27 — mismatch dokumen↔skill sudah ditutup.
2. **Caveman diperluas ke skill eksekusi yang belum punya** — blok standar ditempel ke `adversarial-verifier` (verdict PASS/CONDITIONAL/FAIL = gate decision → auto-clarity penuh) dan `google-apps-script`. Skill planning/interview dan skill vendor TIDAK ditempeli (keputusan pemilik; preseden O-CDD-1 tetap tersedia bila nanti dibutuhkan). Dasar riset: repo `juliusbrussee/caveman` — hemat ~65–75% token output dengan auto-clarity untuk keamanan/aksi irreversibel.

---

## 27.5 Cheat Sheet Satu Halaman

```
IDE ──────────────────────────────────────────────► PRODUCTION
 │
 ├─ /materi-reference ................ selalu: baca bab dulu, sitasi
 ├─ proyek existing? ................. jalur adopsi 27.8 dulu (MODE ADOPS)
 ├─ /scaffolder ...................... folder + template
 ├─ /constitution .................... aturan proyek
 ├─ /idea-clarifier .................. problem brief
 ├─ /pen-design ...................... mockup → setuju dulu, kode kemudian
 ├─ /prd-generator / /tech-stack-advisor / /entity-modeler / /module-planner
 ├─ /constraint-driven-development ... quality contract → CONSTRAINTS.md
 │                                      (gate ditegakkan mesin, bukan niat)
 ├─ /sprint-planner .................. pack 4 dokumen (+mockup+design read)
 ├─ /ai-coding-coach ................. dry run → approve → build
 │    ├─ UI marketing ................ /taste
 │    └─ UI produk/dashboard ......... /impeccable (shape→critique→polish→harden)
 ├─ /acceptance-runner ............... fresh context + bukti
 │    └─ bukti visual ................ /browser-skill
 ├─ /security-dependency-auditor ..... tool nyata, gate severity
 ├─ /deploy-production-gate .......... P1 berbukti → GO/NO-GO
 │    └─ verifikasi live ............. /browser-skill (lagi)
 └─ /state-keeper .................... folder ter-update → chat baru ♻️

SAAT ADA BUG:
 /observability-and-instrumentation → lihat APA yang terjadi
   → /debugging-and-error-recovery atau /systematic-debugging
   → klasifikasi per 27.6 → fix → /acceptance-runner (gejala asli)
   → /state-keeper + perbarui runbook
```

**Tiga kesalahan yang paling sering:**
1. Membangun UI tanpa memilih skill desain dulu → hasilnya slop. Pilih `/taste` ATAU `/impeccable` sebelum baris kode pertama.
2. Menyetujui "selesai" tanpa bukti browser → pakai `/browser-skill` untuk kriteria visual, selalu.
3. Mockup dianggap kode → mockup adalah lampiran BLUEPRINT, bukan implementasi.

---

### 27.5b Workflow Perubahan di Tengah Development (Ringkas)

Fitur baru / revisi fitur / ganti fitur JANGAN pernah masuk ke builder
langsung — alur lengkapnya di section 27.6:

```
FITUR BARU      → backlog (state-keeper) → idea-clarifier mini
                  → perencanaan mini → sprint-planner → loop standar
REVISI FITUR    → idea-clarifier mini (KEEP/CHANGE/REMOVE)
                  → cek dampak data (entity-modeler)
                  → sprint-planner + acceptance REGRESI wajib
                  → browser-skill: screenshot SEBELUM vs SESUDAH
GANTI FITUR X→Y → 2 sprint: dekomisi X (pack ringkas) lalu sprint Y
BUG KECIL/TYPEO → fix langsung + log STATE.MD (tanpa sprint)
```

---

## 27.6 Workflow Tambahan: Fitur Baru, Revisi & Ganti Fitur di Tengah Development

Kondisi nyata: proyek sudah jalan, sprint 003 sedang berjalan, lalu muncul
kebutuhan baru. Aturan emasnya (Bab 8.7 Tahap 6.5 + Bab 17 #5):

> **Tidak ada jalur pintas ke builder. Fitur/revisi/ganti fitur = sprint baru
> melalui perencanaan — bukan improvisasi di sprint yang sedang berjalan.**

### 27.6.1 Kasus A — Fitur Baru (belum pernah dibrainstorming)

```
1. JANGAN ganggu sprint aktif
   /state-keeper → catat request ke QUESTIONS.MD/STATE.MD (backlog)
   Selesaikan sprint yang sedang jalan dulu ♻️

2. /idea-clarifier (versi mini)
   Brainstorm fitur itu SAJA: masalah, pengguna, success metric
   → problem brief fitur

3. Perencanaan mini (right-sized — pakai yang relevan saja):
   butuh data baru?          → /entity-modeler
   endpoint/UI baru?         → /tech-stack-advisor + /module-planner
   ada UI?                   → /pen-design (mockup dulu — murah)
   PRD mini (1 halaman cukup)→ /prd-generator

4. /sprint-planner
   → sprint-0XX baru + pack 4 dokumen lengkap + cross-artifact check
   → keputusan teknis baru (mis. perlu Redis) → ADR di DECISIONS.MD

5. Loop standar (sama seperti sprint biasa):
   /ai-coding-coach (dry run → approve → build;
     UI marketing → /taste, UI produk → /impeccable)
   → /acceptance-runner (+ /browser-skill untuk bukti visual)
   → /security-dependency-auditor  ← WAJIB: fitur baru =
     attack surface baru, dependency baru
   → /deploy-production-gate (jika harus rilis)
   → /state-keeper → sprint berikutnya ♻️
```

### 27.6.2 Kasus B — Revisi Fitur (ubah perilaku fitur yang sudah ada)

Revisi lebih berisiko daripada fitur baru: ada perilaku lama yang
**sedang dipakai user**. Karena itu aturan tambahannya:

```
1. /state-keeper → catat permintaan revisi + risiko regersi

2. /idea-clarifier mini → pertanyaan KUNCI: "Perilaku LAMA mana yang
   HARUS tetap (compatibility) dan mana yang BOLEH berubah?"
   → daftar eksplisit: KEEP / CHANGE / REMOVE

3. /entity-modeler → cek dampak data: schema berubah? data lama
   harus dimigrasi? apa yang terjadi pada data user yang sudah ada?

4. /sprint-planner dengan 3 aturan khusus revisi:
   a. ACCEPTANCE.MD WAJIB berisi REGRESI:
      - test untuk perilaku LAMA yang harus tetap jalan (KEEP)
      - test untuk perilaku BARU (CHANGE)
      - bukti perilaku yang dihapus benar-benar hilang (REMOVE)
   b. BLUEPRINT wajib menyebut file lama mana yang disentuh
   c. /browser-skill dijadwalkan sejak awal: tangkap screenshot
      kondisi SEBELUM revisi → bandingkan SESUDAH

5. Loop standar dengan fokus regresi:
   build → /acceptance-runner (item regresi diuji DULUAN)
   → /security-dependency-auditor → deploy gate → /state-keeper
```

### 27.6.3 Kasus C — Ganti Fitur (hapus fitur X, jadi fitur Y)

Kasus paling jarang dan paling mahal kalau salah. Dua sprint kecil
lebih aman daripada satu sprint besar:

```
1. /idea-clarifier mini → validasi: kenapa fitur X diganti?
   Siapa yang masih pakai X? (kalau masih ada → pertanyaan ke user,
   JANGAN lanjut — catat di QUESTIONS.MD)

2. /sprint-planner → PISAHKAN jadi dua sprint:
   Sprint A: DEKOMISI fitur X
     - pack ringkas: hapus UI/endpoint X, migrasi data terkait,
       komunikasi ke user (changelog/catatan),
       ACCEPTANCE: X benar-benar hilang + tidak ada jejak broken
       (link mati, error kosong) — dibuktikan via /browser-skill
   Sprint B: FITUR baru Y (mengikuti Kasus A penuh)

3. Antar dua sprint: /state-keeper mencatat transisi, dan
   /security-dependency-auditor sprint B mengecek dependensi yatim
   (library yang hanya dipakai fitur X — kini boleh dibuang)
```

### 27.6.4 Matriks Keputusan Cepat

| Kondisi | Jalur | Pack |
|---|---|---|
| Fitur baru kecil, scope jelas | Kasus A, perencanaan mini | Pack ringkas (goal + blueprint ringkas + 3 acceptance) |
| Fitur baru besar / ganti arsitektur | Kasus A penuh | Pack lengkap 4 dokumen |
| Revisi perilaku fitur existing | Kasus B | Pack lengkap + wajib acceptance regresi (KEEP/CHANGE/REMOVE) |
| Ganti fitur X → Y | Kasus C | 2 sprint: dekomisi X + sprint Y |
| Bug kecil, penyebab jelas | Perbaikan langsung, TANPA sprint | Log ke STATE.MD via /state-keeper |
| Typo / copy change | Langsung fix | Log STATE.MD |

> **Aturan keputusan:** kalau Anda ragu masuk kategori mana — pilih jalur
> yang LEBIH FORMAL. Birokrasi 15 menit lebih murah daripada regersi 3 hari.

---

## 27.7 Workflow Berpindah AI Agent di Tengah Pipeline (Handoff Antar Tool)

Kasus nyata: planning + PRD dibuat di agent A (mis. **zcode**), build dilanjutkan
 di agent B (mis. **opencode**). Dasar aturannya sudah tertulis di Pilar #3 (Bab 6.2):

> **Source of truth = folder proyek, BUKAN chat history.** Agent hanyalah
> "pekerja" yang boleh berganti kapan saja — folder-lah yang diwariskan.

Berpindah agent BUKAN mekanisme khusus — ia adalah handoff Architect ↔ Builder
 biasa (Bab 2.1), hanya kedua ujungnya tool berbeda. Yang dibutuhkan hanya
 disiplin checklist (Bab 14 session hygiene + Bab 7 kontrak file + Bab 8 ritel handoff).

### 27.7.1 Checklist A — Menutup Session di Agent Lama (sebelum pindah)

```
[SEBELUM PINDAH — SEMUA HARUS ✅, GAGAL SATU → JANGAN PINDAH DULU]
═══════════════════════════════════════════════════
1. □ /state-keeper   → STATE.MD, DECISIONS.MD, RISKS.MD,
                       QUESTIONS.MD ter-update (27.3 langkah 23)
2. □ Pack sprint aktif tersimpan lengkap:
     planning/sprints/sprint-XXX/
       ├─ REQUIREMENTS.MD   ├─ BLUEPRINT.MD
       ├─ ACCEPTANCE.MD     └─ HANDOFF-PROMPT.MD
     + salinan di architect-packs/     (Bab 8.5 langkah 4.1)
3. □ Semua keputusan punya entri ADR di DECISIONS.MD
     (keputusan / alasan / dampak — Bab 7.4)
4. □ Pertanyaan terbuka tercatat di QUESTIONS.MD —
     tidak ada keputusan yang hanya hidup di chat (Bab 7.7)
5. □ Commit + catat commit hash di STATE.MD (27.3 langkah 23)
6. □ Chat lama DITUTUP — pindah tool SELALU = chat baru (Bab 14.3)
═══════════════════════════════════════════════════
```

### 27.7.2 Checklist B — Membuka Proyek di Agent Baru

```
[MEMBUKA DI AGENT BARU — zcode → opencode, atau sebaliknya]
═══════════════════════════════════════════════════
1. □ Buka tool DI FOLDER proyek (Bab 8.5 langkah 4.2)
2. □ Chat BARU — jangan impor history chat lama (Bab 14.3:
     konteks bersih > konteks penuh)
3. □ Minta agent membaca file dengan URUTAN (Bab 7.1):
     AGENTS.MD → STATE.MD → DECISIONS.MD → DOMAIN.MD
     → file sprint aktif
4. □ Paste / arahkan ke HANDOFF-PROMPT.MD sprint aktif
5. □ Sesuaikan peran agent baru:
     BUILDER   → /ai-coding-coach MODE DRY RUN: baca pack +
                 AGENTS.MD + STATE.MD → laporkan rencana →
                 TUNGGU approve sebelum coding (27.3 langkah 15–16)
     ARCHITECT → lanjutkan urutan skill 27.3 dari tahap
                 terakhir yang tercatat di STATE.MD
═══════════════════════════════════════════════════
PINDAH DI TAHAP MANA PUN CARANYA SAMA: baca STATE.MD → temukan
posisi di ritel 27.3 → jalankan skill pemilik tahap itu di agent
baru, hormati kontrak folder (tabel 25.4).
```

### 27.7.3 Aturan Wajib Agent Baru (tertulis di AGENTS.MD — Bab 7.1)

```
- DILARANG mulai coding tanpa architect pack (aturan keras AGENTS.MD)
- DILARANG mengubah requirements tanpa persetujuan
- DILARANG pakai library di luar BLUEPRINT.MD (versi pinned — Bab 17.2)
- Dry run dulu → tunggu approve → baru build (27.3 langkah 15–16)
- Bukti, bukan klaim: output test asli + screenshot (27.3 langkah 19)
- Selesai = folder ikut ter-update via /state-keeper — tinggalkan
  jejak yang sama seperti yang dia baca
- JANGAN memutuskan ulang: cek DECISIONS.MD dulu; pertanyaan baru
  → QUESTIONS.MD, bukan asumsi diam-diam
- /acceptance-runner WAJIB di konteks segar / fresh context
  (Bab 12.4) — agent yang baru dibuka justru konteks ideal
- Konsultasi /materi-reference sebelum langkah penting (Lapis 0, 27.1)
```

### 27.7.4 Catatan Khusus Antar Tool

```
1. SKILL = FILE PROMPT, bukan milik satu tool. Salin folder skills
   ke dalam proyek agar semua agent bisa memanggilnya, mis.:
   .opencode/skills/  .claude/skills/  .agents/skills/
2. Aturan spesifik tool → file adapter per tool (CLAUDE.MD /
   CODEX.MD, Bab 6.1); AGENTS.MD tetap router lintas-tool.
3. JANGAN "menghidupkan kembali" konteks dengan paste history
   chat lama — cukup folder (Bab 9: the answer is cleaner context).
4. Setelah pindah, ritual fitur baru / revisi / bug tetap ikuti
   27.5b, 27.6, dan routing bug fix 27.4b — pindah tool TIDAK
   mengubah aturan workflow.
```

### 27.7.5 Contoh Ritel: zcode (planning) → opencode (build)

```
DI ZCODE (architect):
 /idea-clarifier → /prd-generator → /tech-stack-advisor
 → /entity-modeler → /module-planner → /sprint-planner
 → /state-keeper → commit → tutup chat

DI OPENCODE (builder):
 cd folder-proyek && opencode   (chat baru)
 "Kamu BUILDER (Bab 7.1). Baca AGENTS.MD, STATE.MD, DECISIONS.MD,
  lalu planning/sprints/sprint-001/HANDOFF-PROMPT.MD.
  Jalankan dry run dan TUNGGU persetujuan. JANGAN coding dulu."
 → dry run dilaporkan → user: "Approved. Mulai coding."
 → build + bukti → /acceptance-runner → dst. (27.3 Tahap 5–6)
```

---

## 27.8 Jalur Adopsi: Masuk ke Proyek Existing yang Belum Pernah Memakai Workflow Ini

Kasus nyata: kode sudah ada, git sudah jalan, mungkin sudah live di
production — tetapi proyek belum pernah memakai pipeline Bab 25–27.
Pertanyaannya: "Apakah saya harus memindah kode, mengganti struktur
folder, atau membuat PRD untuk semua fitur yang sudah rilis?" **Tidak.**

> **Aturan emas adopsi:** workflow ini berlaku MAJU, bukan mundur.
> Sejak titik adopsi, semua kerja BARU mengikuti pipeline penuh 27.3.
> Kode dan fitur lama cukup DIDOKUMENTASIKAN apa adanya (backfill) —
> jangan pernah menambal retroaktif atau memperlakukan proyek existing
> seperti proyek baru.

### 27.8.1 Pilih Jalur Adopsi Dulu

| Kondisi proyek | Jalur | Biaya kira-kira |
|---|---|---|
| Kecil–menengah, 1 tim, bisa alokasi 1 hari onboarding | **A — Onboarding standar** | 1 hari |
| Besar / multi-tim / rilis rutin tidak boleh berhenti | **B — Bertahap per sprint** | 2–4 sprint |
| Sudah kacau & memang akan dirombak besar | **C — Re-baseline (ulang total)** | Seperti proyek baru di atas kode existing |

> Ragu pilih yang mana? Aturan keputusan sama dengan 27.6.4: pilih
> jalur yang LEBIH FORMAL. Jalur A adalah default.

### 27.8.2 Jalur A — Onboarding Standar (default)

```
RITEL ONBOARDING (SEKALI DI AWAL — SEBELUM sprint fitur pertama)
 1. /materi-reference     → baca Bab 06 + 07 (struktur & template file)
 2. /scaffolder MODE ADOPS → "Mode ADOPS: proyek existing [NAMA] —
                             buatkan folder source-of-truth SAJA,
                             JANGAN sentuh kode existing"
                             → AGENTS.MD STATE.MD DECISIONS.MD
                               RISKS.MD QUESTIONS.MD DOMAIN.MD
                               planning/ architect-packs/ docs/runbooks/
                             Kode existing TIDAK dipindah/diubah.
 3. BACKFILL folder dari kondisi AKTUAL (bukan kondisi ideal):
    a. /state-keeper → STATE.MD: "sprint-000 ONBOARDING — titik
       adopsi workflow, commit hash <hash>"
    b. DECISIONS.MD → ADR "as adopted": stack, database, hosting,
       library utama SEBAGAIMANA ADANYA + alasan yang masih
       diketahui (alasannya hilang? tulis jujur: "legacy, belum
       terdokumentasi" — JANGAN menebak)
    c. DOMAIN.MD  → ringkas domain, pengguna, fitur utama saat ini
    d. RISKS.MD + QUESTIONS.MD → isi semua yang sudah diketahui tim
 4. /constitution          → aturan proyek + standar keamanan
                             (untuk kerja MAJU)
 5. AGENTS.MD              → aturan 27.7.3 + satu baris tambahan:
                             "Kode lama: JANGAN refactor di luar
                              cakupan sprint yang disetujui"
 6. /security-dependency-auditor → BASELINE pertama: npm audit +
    secret scan + checklist P1 → hasil dicatat STATE.MD sebagai
    garis awal (temuan belum wajib diperbaiki semua — jadwalkan
    bertahap lewat RISKS.MD)
 7. /deploy-production-gate → kalau sudah live: jalankan checklist
    P1 SEKALI sebagai pengukuran (GO/NO-GO dokumentatif,
    bukan deploy baru)
 8. /observability-and-instrumentation → produksi jalan tanpa
    telemetri? jadwalkan instrumentasi sebagai sprint
    onboarding-001 (mulai dari pertanyaan on-call — 27.4b)

ATURAN: TIDAK ADA sprint fitur sebelum langkah 1–6 selesai.
```

### 27.8.3 Jalur B — Adopsi Bertahap (proyek besar)

Prinsip: adopsi SKILL berurutan dari yang paling murah ke paling
mahal, satu–dua skill per sprint, TANPA menghentikan rilis yang
sedang jalan.

```
Sprint adopsi-1 : /scaffolder MODE ADOPS + backfill /state-keeper
                  + /constitution + aturan AGENTS.MD
                  (langkah 2–5 Jalur A)
Sprint adopsi-2 : /security-dependency-auditor baseline
                  + bug fix routing 27.4b aktif penuh
Sprint adopsi-3 : sprint fitur pertama dengan PIPELINE PENUH
                  (/idea-clarifier → … → /sprint-planner → loop 27.3)
Sprint adopsi-4 : /deploy-production-gate + observability
Setelahnya      : semua kerja baru = pipeline penuh 27.3
```

Catatan: fitur baru / revisi / ganti fitur SELAMA masa adopsi tetap
ikuti 27.5b + 27.6 — jalur perubahan TIDAK menunggu adopsi selesai.

### 27.8.4 Jalur C — Re-baseline (Ulang Total)

Dipakai kalau proyek memang akan dirombak besar dan kondisi existing
sudah tidak layak jadi dasar. Perlakukan sebagai PROYEK BARU yang
kebetulan punya kode lama:

```
1. /idea-clarifier     → kondisi existing = "kondisi awal",
                         BUKAN requirement baru
2. /prd-generator      → PRD untuk kondisi yang DIINGINKAN
3. /tech-stack-advisor → boleh menilai ulang stack lama (ADR baru;
                         stack lama tetap tercatat di DECISIONS.MD)
4. /entity-modeler     → model data aktual vs target (+ migrasi)
5. /module-planner + /sprint-planner → rencana migrasi bertahap;
                         penggantian/pemusnahan komponen lama
                         mengikuti pola dekomisi 27.6.3
6. Lanjut pipeline penuh 27.3 — backfill langkah 3 Jalur A untuk
   bagian kode lama yang TIDAK diubah
```

### 27.8.5 DO & DON'T Adopsi

```
DO
 - Adopsi berlaku MAJU — sejak titik adopsi semua kerja baru pakai
   pipeline penuh (ritel 27.3)
 - Backfill dari kondisi AKTUAL — folder adalah peta kondisi
   nyata, bukan harapan
 - Keputusan lama → ADR "as adopted" tanpa menghakimi; alasan
   yang hilang ditulis jujur "legacy"
 - Baseline keamanan DULU sebelum sprint fitur pertama
 - Tandai titik adopsi: sprint-000 + commit hash di STATE.MD

DON'T
 - DILARANG memindahkan/menimpa struktur kode existing agar
   "cocok" dengan scaffold — folder source-of-truth MELENGKAPI
   kode, bukan menggantikannya
 - DILARANG membuat PRD retroaktif untuk fitur yang sudah rilis —
   cukup tercatat di DOMAIN.MD
 - DILARANG refactor kode lama "sekalian" di luar cakupan sprint
   (aturan AGENTS.MD 27.7.3; perubahan lewat 27.5b/27.6)
 - DILARANG menunda adopsi sampai "sempurna" — adopsi 80% hari
   ini lebih baik daripada 100% tidak pernah
 - DILARANG melewati baseline keamanan dengan alasan
   "proyek lama sudah aman"
```

### 27.8.6 Setelah Adopsi: Semua Kembali ke Ritel Normal

| Situasi | Rujukan |
|---|---|
| Sprint fitur baru | 27.3 Tahap 2–6 ♻️ |
| Fitur baru / revisi / ganti fitur di tengah jalan | 27.5b + 27.6 |
| Bug / error | Routing 27.4b |
| Pindah AI agent (zcode ↔ opencode) | Checklist 27.7 |
| Ragu kategori kerja | Matriks 27.6.4 + aturan "lebih formal" |

---

**📅 Ditambahkan:** September 2026 (27.4b + routing bug fix + 27.7 handoff antar AI agent + 27.8 jalur adopsi proyek existing; 13 Sep 2026: Tahap 3.4b `constraint-driven-development` + Lapis 3 jadi 4 skill vendor; 18 Sep 2026: 27.4c Task Gate & Bootstrap — DoD mesin per task di BLUEPRINT/ACCEPTANCE + blok bootstrap di HANDOFF-PROMPT + formalisasi MODE DRY RUN/BUILD & DRYRUN-REPORT.MD di ai-coding-coach + caveman di adversarial-verifier & google-apps-script, hasil riset harness engineering OpenAI/Anthropic/Fowler/spec-kit/Cline/superpowers)
**📚 Referensi utama:** Bab 8, 10, 12, 13, 14, 22, 25, 26 + SKILL.md asli dari taste-skill, impeccable, browser-skill, pen-design + skill otentik dari addyosmani/agent-skills dan obra/superpowers (27.4b)
**🎯 Tujuan:** Panduan operasional harian: ritel semua skill — utama, pendukung, skill otentik pihak ketiga, dan router — dari ide sampai aplikasi dipantau di production, termasuk alur bug fix, handoff antar AI agent, dan jalur adopsi untuk proyek existing (27.8)
