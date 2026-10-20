# Riset — Alternatif VibeWise untuk SEMUA Agen (build + review sambil belajar)

> **Pertanyaan:** skill/plugin yang (a) jalan di **semua** agen di sistem xcode,
> (b) bisa **membangun sambil belajar**, (c) bisa **mereview sambil belajar** — seperti VibeWise.
> Sumber: repo **resmi** dan/atau **populer**.
>
> **Tanggal riset:** 14 Okt 2026 · **Metode:** `gh api` langsung (bukan katalog pihak ketiga)
> · Semua angka bintang & lisensi diverifikasi satu per satu.

---

## 0. Jawaban langsung

**Tidak ada satu repo pun yang memenuhi ketiga syarat sekaligus.**

Repo yang fungsinya **persis** seperti VibeWise semuanya **kecil** (0–11 ⭐, umur < 1 tahun,
1 penulis). Repo yang **resmi & populer** tidak melakukan build+review sambil belajar.

**Tapi ada jalan keluarnya — dan justru lebih baik:** masalahnya dipecah jadi **2 lapis**.

| Lapis | Repo | ⭐ | Fungsi |
|---|---|---|---|
| **1. Pengangkut** | `vercel-labs/skills` | **34.704** | Installer skill ke **80 agen** sekaligus |
| **2. Isi pelajaran** | `anthropics/claude-plugins-official` | **37.881** | Plugin resmi: build **dan** review sambil belajar |

Kuncinya: `vercel-labs/skills` mengangkut skill apa pun ke `.agents/skills/` — **path yang
sudah dipakai sebagian besar agen xcode**. Jadi skill belajar tidak perlu dibuat ulang per agen.

---

## 1. Dua hal yang harus dipisah (akar kesalahpahaman)

Pertanyaan "bisa jalan di semua agen?" sebenarnya dua pertanyaan berbeda:

**a. Bisakah *berkas*-nya diangkut?** → **Ya**, kalau ikut format **Agent Skills**
(`SKILL.md` + frontmatter `name`/`description`). Format ini **standar terbuka**, bukan milik
satu vendor.

**b. Bisakah *perilaku otomatis*-nya (hook) jalan?** → **Tidak.** Hook `SessionStart` memakai
variabel milik agen masing-masing (`${CLAUDE_PLUGIN_ROOT}`, `.codex/hooks.json`, dst).
Ini yang tidak bisa diseragamkan.

**Konsekuensi praktis:** semua agen bisa **membaca** skill-nya, tapi yang **pulih otomatis
tiap sesi** cuma segelintir. Selebihnya perlu dipanggil manual.

---

## 2. 🏛️ Yang RESMI — dan ternyata ada DUA, bukan satu

`anthropics/claude-plugins-official` — **37.881 ⭐** · Apache-2.0 · push 14 Okt 2026.

Dari 40 plugin resmi, **dua** yang menyangkut belajar — dan keduanya menjawab **dua sisi
pertanyaan xcode**:

### 2.1 `learning-output-style` — MEMBANGUN sambil belajar

> `"Interactive learning mode that requests meaningful code contributions at decision points"`
> — `.claude-plugin/plugin.json`

Cara kerja: hook `SessionStart` (skrip shell **3.564 byte**) menyuntik instruksi tiap sesi.
Pelajar diminta menulis **5–10 baris kode** di titik keputusan.

⚠️ **Arahnya TERBALIK dari VibeWise.** Di sini **manusia yang menulis kode**, AI yang
memandu. VibeWise sebaliknya: AI menulis, manusia merancang.

### 2.2 `explanatory-output-style` — MEREVIEW sambil belajar ⭐ INI YANG BARU

> `"This plugin recreates the deprecated Explanatory output style as a SessionStart hook."`
> — README

Menyuntik instruksi supaya AI menyisipkan blok penjelasan:

```
★ Insight ─────────────────────────────────────
[2-3 poin edukasi]
─────────────────────────────────────────────────
```

Fokusnya **spesifik ke kodebase xcode**, bukan konsep umum:
- pilihan implementasi untuk kodebase ini
- pola & konvensi yang dipakai
- trade-off dan keputusan desain

**Inilah "review sambil belajar" yang paling dekat dengan permintaan xcode — dan resmi dari
Anthropic.** Setiap kali AI menulis/mengubah kode, ia menjelaskan *kenapa*.

⚠️ README-nya memperingatkan sendiri: *"Do not install this plugin unless you are fine with
incurring the token cost."*

### 2.3 Batasnya

| | `learning-output-style` | `explanatory-output-style` |
|---|---|---|
| Agen | **Claude Code saja** | **Claude Code saja** |
| Isi | 1 skrip shell (3.564 B) | 1 skrip shell (1.468 B) |
| Berkas status | tidak ada | tidak ada |
| Level pengalaman | tidak ada | tidak ada |
| Port ke agen lain | **tidak ada** (sudah dicari) | **tidak ada** (sudah dicari) |

Sudah saya cari khusus port-nya ke Codex/OpenCode/Gemini — **nol hasil**. Ini murni Claude Code.

### 2.4 Plugin resmi lain yang menyentuh belajar

- `math-olympiad` · `math-proof` — belajar matematika (bukan pemrograman)
- `code-review` · `pr-review-toolkit` — review **kode**, tapi **tidak** mengajar pelajar
- `code-simplifier` — merapikan kode, bukan mengajar

---

## 3. 🚚 Pengangkut resmi — kunci "semua agen"

### 3.1 `vercel-labs/skills` — 34.704 ⭐ · MIT · push 9 Okt 2026

> `"The open agent skills tool - npx skills"`

Satu perintah, **80 agen**:

```bash
npx skills add <pemilik/repo>                    # pilih agen lewat prompt
npx skills add <repo> -a claude-code -a codex    # atau sebutkan langsung
```

**Ini yang penting untuk repo ini** — tabel target resminya (dari README):

| Agen | Nama di CLI | Path proyek | Path global |
|---|---|---|---|
| **Antigravity** | `antigravity` | `.agents/skills/` | `~/.gemini/antigravity/skills/` |
| **Cline, Codex, Pi, Warp, Zed, Dexto, fx, Kimi, Loaf, Sarvam** | `cline`,`codex`,`pi`,… | `.agents/skills/` | `~/.agents/skills/` |
| **OpenCode** | `opencode` | `.agents/skills/` | `~/.config/opencode/skills/` |
| **Gemini CLI** | `gemini-cli` | `.agents/skills/` | `~/.gemini/skills/` |
| **Claude Code** | `claude-code` | `.claude/skills/` | `~/.claude/skills/` |
| **Cursor** | `cursor` | `.agents/skills/` | `~/.cursor/skills/` |
| **GitHub Copilot** | `github-copilot` | `.agents/skills/` | `~/.copilot/skills/` |
| **Windsurf** | `windsurf` | `.windsurf/skills/` | `~/.codeium/windsurf/skills/` |

🔑 **Temuan penentu:** mayoritas agen xcode (Codex · OpenCode · Cline · Pi · **Antigravity**)
semuanya membaca **`.agents/skills/`** — **path yang sudah dipakai repo ini** untuk distribusi
12 skill `teach-*`. Artinya: **satu instalasi ke `.agents/skills/` langsung terbaca oleh
hampir semua agen**, tanpa 12 salinan manual.

⚠️ Antigravity di tabel ini pakai `~/.gemini/antigravity/skills/`, sedangkan junction xcode
ada di `~/.gemini/config/skills/` — **berbeda**. Perlu dicek ulang saat pemasangan nyata.

### 3.2 `agentskills/agentskills` — 26.118 ⭐ · Apache-2.0

> `"Specification and documentation for Agent Skills"`

Format standarnya. Isinya: satu folder = satu skill, `SKILL.md` wajib, `scripts/`/
`references/`/`assets/` opsional. **Progressive disclosure** 3 tahap:
discovery (nama+deskripsi saja) → aktivasi (SKILL.md penuh) → eksekusi (berkas pendukung).

Salinan spec juga ada di `anthropics/skills/spec/agent-skills-spec.md`.

### 3.3 `anthropics/skills` — 180.984 ⭐ · ⚠️ **TANPA LISENSI**

19 skill resmi (`docx`, `pdf`, `pptx`, `xlsx`, `mcp-builder`, `skill-creator`, …).
Dua yang menyentuh belajar:

- **`academy-guide`** — merekomendasikan kursus Claude Academy saat xcode bertanya "how do I…".
  Bukan belajar sambil membangun; hanya menunjuk materi.
- **`discernment-nudge`** — setelah menjawab, AI menambahkan 2–3 pertanyaan lanjutan supaya
  xcode memeriksa asumsi. Ini **"review sambil belajar" versi ringan** — tapi umum, bukan
  kode, dan **maksimal sekali per percakapan**.

🔴 **JEBAKAN LISENSI:** repo ini **tidak punya `LICENSE` di root** (HTTP 404). Tiap skill
membawa `LICENSE.txt` berisi:

> `© 2025 Anthropic, PBC. All rights reserved.`
> `Use of these materials ... is governed by your agreement with Anthropic ...`
> `Consumer Terms of Service or Commercial Terms of Service`

**Ini bukan lisensi open-source.** 180.984 ⭐ tidak berarti bebas dipakai ulang.

---

## 4. 🧩 Yang benar-benar MULTI-AGEN + build + review

Ini yang menjawab pertanyaan xcode paling langsung — tapi semuanya **kecil**.

### 4.1 ⭐ `jeanvincenttran/student-agent-skills` — 1 ⭐ · MIT · push 3 Okt 2026

**Paling lengkap untuk build + review, dan agent-agnostic.**

> `"Agent-agnostic skills for students learning to debug, test, and review code."`

Pemasangan lewat `npx skills` (Vercel) — jadi mengikuti jalur `.agents/skills/` di atas:

```bash
npx skills@latest add jeanvincenttran/student-agent-skills
```

**9 skill, dibagi dua sisi persis seperti yang xcode minta:**

| Sisi | Skill | Fungsi |
|---|---|---|
| **BUILD** | `tdd-coach` | Memandu siklus red-green-refactor |
| | `test-from-spec` | Menurunkan tes dari spesifikasi |
| | `minimal-reproducer` | Mengecilkan kegagalan jadi reproducer |
| | `trace-before-run` | Melatih **prediksi** sebelum menjalankan |
| | `debug-with-me` | Menuntun debug berbasis bukti |
| | `test-your-tests` | Menguji tes sendiri dengan cacat buatan |
| **REVIEW** | **`review-for-learning`** | **Review kode dengan bukti + pertanyaan belajar** |
| | **`review-practice`** | **Melatih review yang konstruktif** |
| | `compare-solutions` | Membandingkan solusi benar (bukan memilih "yang terbaik") |

Aturan yang selaras dengan repo ini (dikutip dari README):

> `"Preserve assignment interfaces ... Coaching and review are not permission to rewrite or commit student code."`
> `"Reviewing correct code may produce no confirmed defects."`
> `"Procedures are language-agnostic."`

⚠️ `review-for-learning` dan `review-practice` — **dua nama berbeda untuk dua peran berbeda**:
satu untuk *dilatih*, satu untuk *melatih*. Jangan tertukar.

### 4.2 ⭐ `mrdulasolutions/DevLearn` — 1 ⭐ · MIT · push 24 Mei 2026

**Dukungan agen paling eksplisit** — punya tabel kompatibilitas sendiri:

| Agen | Path skill | Konfigurasi ambient |
|---|---|---|
| Cursor | `~/.cursor/skills/` | `.cursor/rules/devlearn.mdc` |
| Claude Code | `~/.claude/skills/` | `DEVLEARN.md` |
| Codex CLI | `~/.agents/skills/` | `AGENTS.md` |
| OpenCode | `~/.config/opencode/skills/` | `DEVLEARN.md` |
| Factory Droid | `~/.factory/skills/` | `DEVLEARN.md` |
| Kiro CLI | `~/.kiro/skills/` | `DEVLEARN.md` |

```bash
./install.sh --harnesses cursor,claude,codex,opencode --verify
```

**26 skill**, dibagi dua sisi:

| Sisi | Skill |
|---|---|
| **BUILD** | `teach-while-coding` · `javascript` · `react` · `next` · `html-css` · `apis` · `debugging` · `git` · `deploy` · `devops` |
| **REVIEW** | **`lesson-review`** · **`recap`** · **`explain-diff`** · `before-you-ship` · `pre-ship` · `post-ship` · `security` · `glossary` · `analyze-website` |

Fitur menarik: **persona** (`viber` = rasa dulu, `seasoned` = keputusan/alternatif/risiko),
memori sesi (`.devlearn/progress.md`, `.devlearn/decisions.md` gaya ADR), routing sadar-stack
(React/Next dideteksi dari `package.json`).

⚠️ **Jarang dipakai** (1 ⭐, terakhir push Mei 2026). Isinya paling luas, tapi paling berisiko
tak terawat.

### 4.3 `tenzing-lunn/vibe-learn` — 0 ⭐ · MIT · push 9 Okt 2026

**VibeWise yang sudah dipindah ke banyak agen** — ini yang paling dekat dengan "VibeWise tapi
jalan di semua agen".

> `"Works with Claude Code, Codex, Gemini CLI, and any agent that reads AGENTS.md and .agents/skills/."`
> `"vibe-learn is built on VibeWise by Noah Kim ... and extends it to other agents."`

| Agen | Cara mulai | Cara pulih otomatis |
|---|---|---|
| Claude Code | `/vibe-learn` | hook `SessionStart` di `.claude/settings.local.json` |
| Codex | `$vibe-learn` | hook `.codex/hooks.json` + baris di `AGENTS.md` |
| Gemini CLI | baca `SKILL.md` | baris di `GEMINI.md` |
| Lainnya | baca `SKILL.md` | baris di `AGENTS.md` |

**Punya ketiga checkpoint** (lebih banyak dari VibeWise):

| Checkpoint | Isi |
|---|---|
| **Design** | Tinjau desain — **tidak ada kode** yang ditulis |
| **Build** | Tinjau langkah pembangunan |
| **Implementation** | Tinjau perubahan spesifik — "Implement this step" baru mengizinkan kode |

Plus: **teach mode** (eksplorasi sambil bertanya), **manual bahasa manusia** proyek yang
tumbuh, pengaturan frekuensi checkpoint (Light/Normal/Frequent), dan level
(Beginner/Intermediate/Advanced).

> `"Review when it matters. When new work builds on something you learned earlier..."`

⚠️ **0 ⭐, 5 hari umur, 1 penulis.** Statusnya disimpan di `.vibe-notes/` + `vibe-journal.md`
(global per proyek, bukan per agen) — jadi bisa ganti agen di tengah tugas.

### 4.4 `sco11-Angus/learn-while-building` — 0 ⭐ · MIT · push 30 Jul 2026

> `"Turn AI-assisted coding into explainable engineering experience you can confidently discuss in an interview."`

Alur: **Rencana → bangun bertahap → verifikasi → review → cerita portofolio**.
Yang menarik: label bukti eksplisit — memisahkan `verified` (sudah dijalankan) dari
inspeksi statis dan klaim tak terverifikasi. Menghasilkan cerita STAR + poin resume.

⚠️ Fokusnya **karier/wawancara**, bukan pemahaman murni. 0 ⭐.

### 4.5 Sisanya — daftar pendek

| Repo | ⭐ | Lisensi | Agen | Catatan |
|---|---|---|---|---|
| `renky1025/agent-skills` | 11 | MIT | Claude Code, Codex, Cursor | 20+ skill; ada `curriculum-design`, `clean-code` |
| `FavioVazquez/agentic-learning` | 11 | MIT | Agent Skills spec | Berbasis neurosains; dari sisi pelajar |
| `Bhala-Srinivash/agent-tutor-skill` | 11 | MIT | Claude Code saja | Ilmu kognitif + FSRS (spaced repetition) |
| `Hainrixz/aprende-skill` | 27 | MIT | Claude Code & Codex | Belajar dari **kesalahan**, bukan sambil membangun |
| `CHplus0/dsh-learning-mode` | 8 | ⚠️ NOASSERTION | **DeepSeek Harness saja** | Meniru output style resmi Claude Code |
| `kkrlstrm/runtune` | 9 | Apache-2.0 | Claude Code, Codex, Cursor, Antigravity | ⚠️ **Bukan untuk pelajar** — tuning harness |

---

## 5. ⚠️ Yang ⭐-nya besar tapi fungsinya BEDA (jebakan utama)

| Repo | ⭐ | Lisensi | Fungsi sebenarnya |
|---|---|---|---|
| `anthropics/skills` | 180.984 | 🔴 TANPA LISENSI | Katalog skill; belajar hanya sampingan |
| `wshobson/agents` | 40.649 | MIT | Marketplace plugin multi-harness — **tidak ada** plugin belajar |
| `anthropics/claude-plugins-official` | 37.881 | Apache-2.0 | ✅ **Ada** — `learning-` + `explanatory-output-style` |
| `vercel-labs/skills` | 34.704 | MIT | ✅ **Pengangkut**, bukan isi pelajaran |
| `agentskills/agentskills` | 26.118 | Apache-2.0 | ✅ Spesifikasi, bukan skill |
| `tigerless-labs/autoharness` | 11.064 | MIT | **AI belajar SKILL** dari sesi — **bukan mengajar manusia** |
| `revfactory/harness` | 9.174 | Apache-2.0 | Meta-skill untuk tim agen |
| `marckohlbrugge/37signals-skills` | 725 | 🔴 TANPA LISENSI | Rails/DHH — bukan belajar |
| `iantbutler01/code_diver` | 76 | Apache-2.0 | Peta kode + MCP — **memahami**, bukan mengajar |
| `caapapx/teacher` | 8 | 🔴 TANPA LISENSI | README 404 — tidak bisa diverifikasi |

**`autoharness` paling mudah disalahpahami.** Namanya "Self-Learning Skills", tapi yang
belajar adalah **agen**-nya (mendistil skill dari sesi kerja), bukan xcode. Beda tujuan.

---

## 6. 🎯 Rekomendasi untuk repo ini (12 lokasi)

**Masalah nyata xcode:** 12 agen, satu sumber skill, dan mode belajar hilang begitu konteks
terpotong. Tidak ada satu repo yang menyelesaikan semuanya. Jadi pakai **kombinasi**:

### Jalur A — aman & resmi (rekomendasi utama)

**MULAI:** pasang pengangkut + plugin resmi Anthropic.

1. `vercel-labs/skills` → jadikan jalur pemasangan standar (`npx skills add …`)
2. `anthropics/claude-plugins-official` → `learning-output-style` (build) +
   `explanatory-output-style` (review) — **untuk Claude Code**
3. `jeanvincenttran/student-agent-skills` → 9 skill build+review lewat `npx skills`
   → mendarat di `.agents/skills/` → terbaca Codex, OpenCode, Cline, Pi, Antigravity

**SELESAI:** xcode bisa membangun **dan** mereview sambil belajar di Claude Code dengan
plugin resmi, dan skill build+review yang sama terbaca di seluruh agen lewat `.agents/skills/`.

### Jalur B — VibeWise di semua agen

`tenzing-lunn/vibe-learn` — satu-satunya yang memindahkan **seluruh** mekanisme VibeWise
(checkpoint + hook + status) ke Codex/Gemini/AGENTS.md. Cocok kalau yang diinginkan
persis alur VibeWise. ⚠️ 0 ⭐ → tinjau kodenya dulu sebelum dipakai.

### Jalur C — cakupan terluas

`mrdulasolutions/DevLearn` — 26 skill, 6 agen, wizard instalasi. Cocok kalau mau materi
per-bahasa (React/Next/JS). ⚠️ 1 ⭐, mandek Mei 2026.

### Yang **tidak** disarankan

- **Menyalin skill VibeWise ke 12 lokasi** — yang hilang justru bagian terbaiknya (hook + state).
- **Memakai `anthropics/skills`** untuk belajar — lisensinya bukan open-source.
- **Membuat skill baru dari nol** sebelum mencoba yang sudah ada — repo ini sudah punya
  aturan "tanya dulu sebelum membangun".

---

## 7. Jebakan & catatan

1. 🔴 **Repo 180 ribu bintang tanpa lisensi.** `anthropics/skills` tidak punya `LICENSE` di
   root; tiap skill berlisensi "All rights reserved" + ToS Anthropic. Bintang ≠ izin pakai.
2. 🔴 **`marckohlbrugge/37signals-skills` (725 ⭐) dan `caapapx/teacher` juga tanpa lisensi.**
   Cek lisensi **sebelum** mengunduh, bukan sesudah.
3. ⚠️ **Yang fungsinya persis semuanya kecil & baru.** 0–11 ⭐, dibuat 2026, 1 penulis,
   0 rilis. Jangan perlakukan sebagai alat produksi tanpa meninjau isinya.
4. ⚠️ **Hook tidak portabel.** Skill bisa diangkut; `SessionStart` tidak. Yang pulih otomatis
   tiap sesi cuma Claude Code (dan sebagian Codex/Gemini lewat baris penanda di `AGENTS.md`).
5. ⚠️ **`vercel-labs/skills` menaruh Antigravity di `~/.gemini/antigravity/skills/`**, bukan
   `~/.gemini/config/skills/` (tempat junction xcode sekarang). Perlu dicek saat pemasangan.
6. ⚠️ **Tidak satu pun punya dasar riset pedagogis** — sama seperti VibeWise. Yang mengaku
   berbasis riset: `Bhala-Srinivash/agent-tutor-skill` (Roediger & Karpicke, Bjork, Ebbinghaus)
   dan `FavioVazquez/agentic-learning` (neurosains) — **belum saya verifikasi**.
7. ⚠️ **Banyak butuh Python 3 dengan nama `python3` di PATH.** Di Windows ini sering tidak ada
   (biasanya `python`). VibeWise, vibe-learn, autoharness semua bergantung pada ini.
8. ⚠️ **Beban token.** `explanatory-output-style` memperingatkan sendiri biaya token-nya.
   Dengan model gratis dari beberapa provider, ini bisa memakan kuota cepat.

---

## 8. Penilaian khusus: `AzamatRaimbekov/vibe-coding-mentor` (14 Okt 2026)

xcode bertanya: *"worth it untuk pelajar seperti saya?"* — ini penilaian setelah membaca
**SKILL.md penuh (466 baris)**, 14 `references/`, 2 hook, 2 agent, dan README Inggrisnya.

**Fakta terverifikasi:** 3 ⭐ · 0 fork · **MIT** · dibuat 28 Agu 2026 · push terakhir
**6 Sep 2026** · 431 KB · **1 kontributor, 20 commit, 0 rilis** (semua commit di satu hari).

**Isi:** 3 skill (`vibe-coding-mentor` 39.471 B / **466 baris** · `vibecoding` 17.484 B ·
`mcp-setup` 10.777 B) · 14 `references/` (~140 KB) · 2 hook · 2 agent (docker, mobile) ·
`ralph/` (integrasi Ralph loop) · 5 skrip.

### 8.1 ✅ Jawaban singkat: **belum layak dipasang** — tapi **layak ditambang**

Alasannya bukan kualitas. Isinya justru **paling dalam** dari semua kandidat. Alasannya
**enam hal yang membuatnya tidak cocok untuk xcode**, dan **lima di antaranya tidak bisa
diperbaiki tanpa mengubah isinya**.

### 8.2 🔴 Enam penghalang

1. **Isinya Bahasa Rusia.** README-nya mengakui sendiri: *"The skill body is Russian, which
   narrows the audience."* Trigger-nya bilingual, tapi seluruh 466 baris + 140 KB referensi
   Bahasa Rusia. xcode belajar dalam Bahasa Indonesia → tidak bisa dipakai tanpa terjemahan.
2. **Khusus Claude Code.** Pengakuannya: *"Checks use `claude mcp list` and the `~/.claude/skills/`
   layout."* Hook-nya `UserPromptSubmit` di `~/.claude/settings.json`. xcode punya **12 lokasi** —
   di 11 agen sisanya yang jalan hanya berkas `SKILL.md`-nya, tanpa hook dan tanpa diagnostik.
3. **Persona "Азамат" bentrok dengan `SOUL.md`.** Skill ini memperkenalkan diri:
   *"Меня зовут Азамат — вайб-кодер-учитель. Представляюсь в первом сообщении сессии,
   говорю от первого лица."* xcode sudah punya identitas sendiri: **erka code 🌱**.
   Dua persona akan bertabrakan di sesi yang sama.
4. **⚠️ Memasang skill sendiri tanpa bertanya.** *"Всё, что можно сделать за ученика — делаю сам.
   Ставлю скилы, создаю агентов, подключаю MCP."* Hook `SessionStart` mencari di katalog
   (`npx skills find`) dan **memasang hasil teratas kalau >1.000 instalasi**. Ini **melanggar
   aturan xcode sendiri** — *"jangan menambah struktur yang tidak diminta"* dan *"tanya dulu"*.
   (Sisi baiknya: ia memverifikasi **di disk, bukan dari output installer** — persis pelajaran
   §1.8 repo ini.)
5. **AI mengerjakan bagian yang membawa pelajarannya.** Batas Mode Inspeksi repo ini jelas:
   *memilih aktivitas yang kalau diserahkan ke AI, pelajarannya ikut hilang.* Skill ini
   mengambil arah sebaliknya — meringankan sebanyak mungkin untuk pelajar.
6. **Belum pernah diuji.** Pengakuan jujurnya: *"Not tested. Per the `writing-skills`
   methodology a skill should be run against subagents... That step was never done."*

### 8.3 ✅ Lima hal yang bagus — dan patut ditambang

Bukan untuk dipasang, tapi **idenya bisa dipakai**:

1. ⭐ **Langkah 4 "Red test" dalam loop 7 langkahnya:**

   | # | Langkah | Agent | Pelajar |
   |---|---|---|---|
   | 4 | **Red test** | Menulis tes yang gagal | **Memprediksi kenapa gagal** |

   Kalimatnya: *"Step 4 is where learning happens. Predicting **before** running builds a
   mental model. Agreeing with a finished answer doesn't."*
   → **Ini persis tahap `PREDIKSI` Mode Inspeksi repo ini.** Konfirmasi dari sumber independen
   bahwa pendekatannya benar — bukan hal baru, tapi memperkuat.

2. ⭐ **Format `references/lessons.md`** — pelajaran dari kesalahannya sendiri, format wajib:
   *apa yang terjadi · **kenapa salah** · aturan untuk lain kali.* Bagian tengah **wajib** —
   *"tanpa itu yang diingat kasusnya, bukan penyebabnya, dan pelajarannya tidak berpindah."*

3. ⭐ **`references/student-profile.md`** — 5 bagian (yakin · sulit · cara kerja · arah ·
   keputusan). Isinya **observasi, bukan dugaan**: bukan *"mungkin lemah di basis data"*,
   tapi *"menulis sendiri penjaga race condition untuk stok"*. Bagian "sulit" paling cepat
   basi → kalau sudah teratasi, barisnya **dipindah ke "yakin" dan dikatakan terang-terangan**
   — *"pujian terbaik yang mungkin, karena bisa diukur."*

4. **Kolom "biaya keterlambatan"** di checklist proyek — jawabannya tidak pernah *"memang
   begitu caranya"*, tapi *"ini yang akan rusak"*.

5. **Aturan bahasa yang tegas:** kata *"tinggal"* dan *"jelas"* **dilarang** (menandai
   penjelasan yang dilewati) · satu perintah wajib bawa 3 hal (**di mana dijalankan · apa
   yang dilakukannya · apa yang harus muncul**) · ≤2 istilah baru per pesan · umpan balik
   hijau menyebut **tindakan spesifik**, bukan orangnya (*"bagus"* = derau, *"kamu sendiri
   yang menyadari X"* = umpan balik).

### 8.4 Perbandingan dengan yang sudah dimiliki repo ini

| Fitur | vibe-coding-mentor | Repo ini |
|---|---|---|
| Prediksi sebelum menjalankan | ✅ langkah 4 | ✅ tahap `PREDIKSI` |
| Gerbang terukur | ❌ tidak ada | ✅ ambang **50% tracing** (Lister 2004) |
| Bukti prediksi | ❌ tidak ada | ✅ `prediksi.md` + **verifikasi timestamp** |
| Dasar riset pedagogis | ❌ **nol** (grep PRIMM/Parsons/Lister → 0 hit) | ✅ PRIMM · Parsons · Lister · RCT Anthropic |
| Profil pelajar yang menua | ✅ `student-profile.md` | ❌ tidak ada |
| Pelajaran dari kesalahan AI | ✅ `lessons.md` | ❌ tidak ada |
| Bahasa | 🇷🇺 Rusia | 🇮🇩 Indonesia |
| Agen | 1 (Claude Code) | 12 lokasi |
| Teruji | ❌ **belum pernah** | ⚠️ sebagian |

### 8.5 Kalau tetap mau mencobanya — cara aman

**Jangan pasang skillnya.** Ambil tiga idenya saja, tulis ulang dalam Bahasa Indonesia:

1. **`lessons.md`** — format *apa · kenapa salah · aturan*, ditulis AI untuk dirinya sendiri.
2. **`student-profile.md`** — 5 bagian, observasi bukan dugaan, baris dipindah saat teratasi.
3. **Kolom "biaya keterlambatan"** di checklist.

Kalau tetap ingin memasangnya: `npx skills add AzamatRaimbekov/vibe-coding-mentor -g -y`
akan mendarat di `.agents/skills/` — **tapi matikan dulu hook `SessionStart`-nya**, karena
itu yang memasang skill sendiri tanpa bertanya.

---

### 8.6 Cara kerja `student-profile.md` dan `lessons.md` (14 Okt 2026)

Dibaca **penuh** kedua berkasnya + 2 skrip pengelolanya (`note-student.sh`, `learn.sh`).

**Prinsip yang diakui sendiri** (dari SKILL.md, bagian «Самообучение»):

> *"Модель не переобучается — накапливают опыт инструкции, по которым я работаю.
> Это единственное настоящее самообучение здесь; **не обещай большего**."*
> (= Model tidak dilatih ulang — yang menumpuk pengalaman adalah **instruksi** yang saya
> pakai. Ini satu-satunya pembelajaran-sendiri yang nyata di sini; jangan menjanjikan lebih.)

Jujur dan penting: **bukan machine learning.** Ini berkas teks yang bertambah dan
**dibaca ulang tiap awal sesi**.

#### Dua berkas, dua arah

| | `lessons.md` | `student-profile.md` |
|---|---|---|
| Tentang siapa | **AI sendiri** (kesalahannya) | **Pelajar** (cara bekerja dengannya) |
| Ukuran | 10.679 B · **10 pelajaran terisi** | 4.024 B · 5 bagian · 2 baris terisi |
| Kapan dibaca | awal sesi, **sebelum penjelasan pertama** | awal sesi, **sebelum penjelasan pertama** |
| Kapan ditulis | **langsung**, bukan di akhir sesi | **langsung**, bukan di akhir sesi |
| Skrip | `scripts/learn.sh` (4 argumen) | `scripts/note-student.sh` (2 argumen) |

#### `lessons.md` — format yang dipaksa skrip

```
## <judul singkat>
**Дата:** YYYY-MM-DD
**Что случилось:** fakta, tanpa pembelaan
**Почему ошибся:** asumsi mana yang ternyata salah   ← WAJIB
**Правило:** apa yang harus dilakukan lain kali, bisa diperiksa
```

Bagian **«Почему ошибся» wajib**: *"tanpa itu pelajarannya tidak berpindah ke kasus
serupa — yang diingat kekhususannya, bukan penyebabnya."*

**5 pemicu menulis:** bilang "selesai" padahal belum · menyebut masalah yang tidak ada
(alarm palsu) · melewatkan masalah yang ada · manusia mengoreksi dengan benar ·
perintah berjalan tidak seperti dugaan.

**Dilarang masuk:** kesalahan **manusia** (itu jalannya dia, bukan pelajaran AI) ·
kecelakaan sekali tanpa kesimpulan · kebenaran umum dari dokumentasi · >1 pelajaran
per kesalahan. Skripnya **menolak judul duplikat** — *"tambahkan ke yang ada, jangan
duplikasi."*

**Isi aslinya — 10 pelajaran nyata**, yang paling berguna:
- **«Вывод установщика не равен результату»** — `npx skills add` mencetak 8 baris error,
  tapi di disk semuanya terpasang benar. Salah paham: mengira output perintah = hasil
  perintah. → **persis pelajaran §1.8 repo ini.**
- **«Скил обещал ставить сам, но только проверял»** — aturan "saya kerjakan sendiri"
  ditulis sebagai prosa, tapi satu-satunya perintah di SKILL.md mencetak TIDAK dan tidak
  memasang apa pun; pelajar memasang semuanya manual. → *"Aturan tanpa perintah = bukan aturan."*
- **«Отправил читать инструкцию вместо того, чтобы прочитать самому»** — menyuruh manusia
  membuka dokumentasi, login, cari alamat server, lalu kirim. Salah paham: mengira
  *"butuh akunnya"* = *"seluruh tugasnya miliknya"*. → **Bagi tugas sampai atom** — manusia
  hanya menyimpan yang benar-benar ada padanya: kunci, login browser, uang.
- **«Правило можно соблюсти формально»** — aturan "sebut nama alat hanya dengan
  penjelasan" tidak menyebut sedetail apa → bisa dipenuhi satu kata. **Pelajar menemukan
  celahnya lebih dulu.** → aturan soal bentuk harus diberi **contoh format**, bukan imbauan.

#### `student-profile.md` — 5 bagian, kosong secara default

```
## Что уже уверенно знает     (yang sudah dikuasai)
## Что даётся тяжело          (yang sulit)
## Как ему удобно работать    (cara kerja yang nyaman)
## Куда движется              (arah tujuan)
## Принятые решения           (keputusan yang diambil)
```

**3 titik pakai** — *sebelum* bertindak:
- **sebelum menjelaskan** → cek «знает»: jangan ulangi yang sudah lewat. *"Penjelasan ulang
  tentang hal yang sudah diketahui terbaca sebagai 'dia tidak mengingat saya'."*
- **sebelum memilih tempo** → cek «трудно»: di sini langkahnya lebih lambat & kecil.
- **sebelum bertanya** → cek «стиль»: pertanyaan yang tidak cocok gaya orangnya akan
  dijawab formal, bukan sungguhan.

**Aturan penulisan: observasi, bukan dugaan.** Dasarnya = apa yang orang itu **lakukan
atau katakan**, bukan yang kamu **duga**:

| Buruk | Baik |
|---|---|
| "mungkin lemah di basis data" | "menulis sendiri penjaga race condition untuk stok" |
| "suka detail" | "dua kali bertanya baris ini tepatnya melakukan apa" |
| "mahir" | "menangkap bahwa seed-nya tidak di tempat yang dicari skrip" |

Skripnya **menolak observasi duplikat** (`grep -qiF`) → *"⚠️ observasi seperti itu sudah
tercatat."* Tanggal dicap otomatis.

**Bagian yang paling cepat basi = «трудно».** Aturannya:

> Kalau kesulitan lama sudah teratasi → **pindahkan barisnya** ke «что уже знает» dan
> **katakan terang-terangan**. Ini pujian terbaik yang mungkin:
> *"🟢 Tiga minggu lalu kamu minta dijelaskan apa itu migrasi. Hari ini kamu sendiri bilang
> migrasi itu harus di-rollback. Saya keluarkan dari daftar kesulitan. 🎉"*

#### Bagaimana keduanya menutup lingkaran

Keduanya masuk ke **langkah 0 loop** — yang **tidak terlihat manusia**:

| # | Langkah | Agent | Pelajar |
|---|---|---|---|
| **0** | Persiapan **(senyap)** | **Baca `student-profile.md` + `lessons.md`**, jalankan `ensure-tools.sh`, checklist. **Level diambil dari profil; bertanya hanya kalau topik itu masih kosong di sana** | Tidak ada. Hanya lihat banner |
| 4 | Cek sebelum kode | Tulis tes yang belum lolos | **Menebak apa yang akan ditampilkan** |
| 5 | Kode | Kode minimal agar lolos | Lihat diff, **menceritakan ulang dengan kata sendiri** |
| 7 | Bedah | 3 baris: apa yang dikuasai · apa yang masih goyah · apa berikutnya | Bertanya |

Dua arah penulisan balik:

```
profile.md «трудно»
   → dibaca di langkah 0 → tempo & penjelasan disesuaikan
   → langkah 4 menebak → langkah 5 menceritakan ulang → langkah 6 bukti
   → langkah 7 «goyah» → ditulis balik ke «трудно»
   → kalau sudah teratasi: baris DIPINDAH ke «знает» + dikatakan → 🟢

lessons.md (kesalahan AI)
   → dibaca di langkah 0 → kesalahan yang sama dihindari
   → kesalahan terjadi / manusia mengoreksi
   → learn.sh: apa · KENAPA salah · aturan → lessons.md bertambah
```

#### Empat mekanisme yang membuatnya "paham", bukan sekadar dapat jawaban

1. **Retrieval sebelum diberi tahu** — langkah 4 memaksa pelajar **memproduksi** tebakan
   sebelum melihat. Ini *retrieval practice*, bukan *recognition*.
2. **Menceritakan ulang** — langkah 5: pelajar mengulang diff dengan kata sendiri.
3. **Gerbangnya "bisa kamu jelaskan?"** — prinsip dasarnya: *"pengguna harus bisa
   menjelaskan setiap perubahan yang diterima. Kalau tidak bisa — langkahnya terlalu besar."*
4. **Profil mencegah perasaan "dia tidak mengingat saya"** — yang membuat pelajar
   mengulang pertanyaan atau diam. Dan pemindahan «трудно»→«знает» memberi
   **pujian yang bisa diukur**, bukan *"bagus"*.

#### Catatan jujur

- ⚠️ **Dasar riset: NOL.** Tidak menyebut PRIMM/Parsons/Lister sekali pun. Mekanismenya
  *kebetulan* selaras dengan *retrieval practice*, tapi penulisnya tidak menyitir apa pun.
- ⚠️ **Belum pernah diuji** (pengakuan sendiri di README).
- ⚠️ **Profil bisa membusuk.** Dokumennya sendiri bilang «трудно» paling cepat basi, tapi
  **tidak ada yang memaksa pembaruan** — bergantung pada AI ingat memeriksa.
- ⚠️ Skrip = Bash + **Python 3** dengan nama `python3`; path di-hardcode ke
  `~/.claude/skills/vibe-coding-mentor/`.
- ✅ **Yang paling layak ditiru:** perpindahan «трудно»→«знает» (pujian terukur) dan
  bagian tengah **«Почему ошибся»** yang wajib di `lessons.md`.

---

## 9. Sumber (semua diverifikasi 14 Okt 2026 via `gh api`)

| # | Repo | ⭐ | Lisensi |
|---|---|---|---|
| 1 | `vercel-labs/skills` | 34.704 | MIT |
| 2 | `agentskills/agentskills` | 26.118 | Apache-2.0 |
| 3 | `anthropics/skills` | 180.984 | ⚠️ TANPA LISENSI |
| 4 | `anthropics/claude-plugins-official` | 37.881 | Apache-2.0 |
| 5 | `jeanvincenttran/student-agent-skills` | 1 | MIT |
| 6 | `mrdulasolutions/DevLearn` | 1 | MIT |
| 7 | `tenzing-lunn/vibe-learn` | 0 | MIT |
| 8 | `sco11-Angus/learn-while-building` | 0 | MIT |
| 9 | `renky1025/agent-skills` | 11 | MIT |
| 10 | `FavioVazquez/agentic-learning` | 11 | MIT |
| 11 | `Bhala-Srinivash/agent-tutor-skill` | 11 | MIT |
| 12 | `Hainrixz/aprende-skill` | 27 | MIT |
| 13 | `CHplus0/dsh-learning-mode` | 8 | ⚠️ NOASSERTION |
| 14 | `kkrlstrm/runtune` | 9 | Apache-2.0 |
| 15 | `tigerless-labs/autoharness` | 11.064 | MIT |
| 16 | `wshobson/agents` | 40.649 | MIT |
| 17 | `iantbutler01/code_diver` | 76 | Apache-2.0 |
| 18 | `marckohlbrugge/37signals-skills` | 725 | ⚠️ TANPA LISENSI |
| 19 | `nykooi1/vibe-wise` (pembanding) | 3.392 | MIT |
| 20 | `AzamatRaimbekov/vibe-coding-mentor` (§8) | 3 | MIT |

Spesifikasi: `agentskills.io/specification` · `anthropics/skills/spec/agent-skills-spec.md`
