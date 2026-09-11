# PANDUAN END-TO-END: Semua Skill dari Ide sampai Aplikasi Siap Production

> **💬 Bayangkan ini:** Bab 25 memetakan 12 skill utama, Bab 26 memberi dasar risetnya, dan folder skill Anda kini berisi pipeline lengkap plus router anti-halusinasi (`materi-reference`). Bab ini adalah **buku panduan operasionalnya**: ritel persis dari ide pertama sampai aplikasi ter-deploy dan dipantau — termasuk **di mana dan kapan** memakai 4 skill pendukung: **taste**, **impeccable**, **browser-skill**, dan **pen-design (MCP Pencil)**.

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
| `/scaffolder` | Tahap 1 | Proyek baru, sekali jalan | Proyek existing |
| `/idea-clarifier` | Tahap 2 | Ide masih mentah/ambigu | Requirement sudah jelas & teruji |
| `/pen-design` ⭐ | Tahap 2–3 | Saat user butuh MELIHAT bentuk UI sebelum setuju: mockup halaman, wireframe dashboard, slide, aset marketing. Output `.pen` → diekspor gambar → jadi lampiran BLUEPRINT | Aplikasi tanpa UI; saat UI sudah ada dan hanya perlu diubah kecil |
| `/prd-generator` | Tahap 3.1 | Setelah problem brief disetujui | — |
| `/tech-stack-advisor` | Tahap 3.2 | Setelah PRD; catat ADR ke DECISIONS.MD | Stack sudah terkunci proyek existing |
| `/entity-modeler` | Tahap 3.3 | Setelah stack | Sprint tanpa perubahan data |
| `/module-planner` | Tahap 3.4 | Setelah model data | — |
| `/sprint-planner` | Tahap 3.5 + loop | Rakit pack 4 dokumen; ulang tiap sprint baru | Bug sekecil typo (langsung fix, catat STATE.MD) |
| `/state-keeper` | Setiap penutup tahap | Sprint selesai, keputusan baru, risiko/pertanyaan baru | — |
| `/ai-coding-coach` | Tahap 4–5 | MODE DRY RUN dulu → approve → MODE BUILD | Tanpa architect pack (dilarang AGENTS.MD) |
| `/taste` ⭐ | Tahap 5 (UI build) | Halaman **marketing-facing**: landing page, portfolio, redesign, halaman publik. Agent membaca brief → keluarkan satu baris "Design Read" → set 3 dial (VARIANCE/MOTION/DENSITY) → tulis UI yang tidak terlihat template | **Dashboard, data table, product UI multi-step** (di luar scope-nya — di sana pakai `/impeccable` mode Operate) |
| `/impeccable` ⭐ | Tahap 5–6 | **Semua permukaan UI**: product UI, dashboard, form, settings, empty state. Perintah kunci: `shape` (rencana UX), `critique` (review heuristik), `audit` (a11y/perf/responsive), `polish` (final pass), `harden` (error state, i18n, edge case), `adapt` (multi-device), `live` (varian visual di browser) | Backend-only / non-UI |
| `/acceptance-runner` | Tahap 6a | Builder lapor "selesai" — fresh context, jalankan ACCEPTANCE.MD | Review gaya/penyusunan (bukan correctness) |
| `/browser-skill` ⭐ | Tahap 6a, 6c, Discovery | Butuh **bukti dari browser nyata**: screenshot halaman sebagai bukti acceptance, regresi UI setelah PR, validasi halaman live pasca-deploy (`/health`, halaman utama), ambil data dari web untuk Discovery. Siklus wajib: `bsk session start` → observe-act-observe → `bsk session stop` | Tugas tanpa browser; mengekstrak kredensial/cookie (dilarang) |
| `/security-dependency-auditor` | Tahap 6b | Setelah acceptance PASS; wajib ulang jika dependensi berubah | — |
| `/deploy-production-gate` | Sprint akhir | Checklist P1 berbukti → GO/NO-GO | Deploy "sekalian coba-coba" tanpa gate |
| `/constitution` | Awal proyek (opsional tapi disarankan) | Tetapkan aturan proyek + standar keamanan sekali di awal | — |

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
12. /sprint-planner       → rencana sprint 1..N + pack sprint-001:
                             REQUIREMENTS / BLUEPRINT (+ mockup terpilih
                             + Design Read) / ACCEPTANCE (Given-When-Then
                             + command persis) / HANDOFF-PROMPT
                             → cross-artifact check WAJIB
13. /state-keeper         → catat: perencanaan selesai
```

### TAHAP 4 — Handoff & Dry Run

```
14. Buka builder tool di folder proyek (chat BARU — Bab 14.3)
15. /ai-coding-coach MODE DRY RUN → baca pack + AGENTS.MD + STATE.MD
    → laporkan rencana → TUNGGU approve
16. User review dry run → ubah poin yang salah ATAU "Approved"
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

## 27.5 Cheat Sheet Satu Halaman

```
IDE ──────────────────────────────────────────────► PRODUCTION
 │
 ├─ /materi-reference ................ selalu: baca bab dulu, sitasi
 ├─ /scaffolder ...................... folder + template
 ├─ /constitution .................... aturan proyek
 ├─ /idea-clarifier .................. problem brief
 ├─ /pen-design ...................... mockup → setuju dulu, kode kemudian
 ├─ /prd-generator / /tech-stack-advisor / /entity-modeler / /module-planner
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
```

**Tiga kesalahan yang paling sering:**
1. Membangun UI tanpa memilih skill desain dulu → hasilnya slop. Pilih `/taste` ATAU `/impeccable` sebelum baris kode pertama.
2. Menyetujui "selesai" tanpa bukti browser → pakai `/browser-skill` untuk kriteria visual, selalu.
3. Mockup dianggap kode → mockup adalah lampiran BLUEPRINT, bukan implementasi.

---

**📅 Ditambahkan:** September 2026
**📚 Referensi utama:** Bab 8, 10, 12, 13, 22, 25, 26 + SKILL.md asli dari taste-skill, impeccable, browser-skill, pen-design
**🎯 Tujuan:** Panduan operasional harian: ritel semua skill — utama, pendukung, dan router — dari ide sampai aplikasi dipantau di production
