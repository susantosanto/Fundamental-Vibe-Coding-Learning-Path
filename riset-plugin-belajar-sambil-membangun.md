# Riset — Plugin/Skill "Belajar Sambil Membangun" (fungsi sama dengan VibeWise)

> **MULAI:** cari plugin/skill dari repo **resmi / populer / terpercaya** yang fungsinya
> **sama persis** dengan `nykooi1/vibe-wise` (belajar sambil AI menulis kode).
> **SELESAI:** daftar kandidat + tingkat kecocokan + status resmi + bukti (bintang, lisensi,
> tanggal) + mana yang layak dipakai.
> **Tanggal riset:** 14 Okt 2026 · **Metode:** GitHub REST API (`gh api`) — pencarian repo,
> isi berkas mentah (`raw.githubusercontent.com`), daftar berkas per direktori.
> Sesuai `MEMORY.md` §2: hanya repo/dokumen resmi.

---

## 0. Jawaban langsung

**Tidak ada satu pun plugin resmi dari perusahaan besar yang fungsinya sama persis.**

Tiga fakta yang menentukan:

1. **Resmi — hanya SATU, dan arahnya TERBALIK.** Anthropic punya
   `learning-output-style` di direktori plugin resminya. Tapi di situ **pelajar yang menulis
   5–10 baris kode**, bukan AI. VibeWise sebaliknya: **AI menulis kode**, pelajar merancang.
   → **Bukan fungsi yang sama.**
2. **OpenAI resmi: NOL.** `openai/skills` (28.055 ⭐, katalog skill resmi Codex) dan
   `openai/plugins` (7.433 ⭐) **tidak punya satu pun skill/plugin belajar**. Sudah dicek
   seluruh isi `skills/.curated` dan `skills/.system`.
3. **Yang bintangnya ribuan fungsinya BEDA.** `codebase-to-course` (5.680 ⭐) mengubah kode
   jadi kursus HTML — belajar **dari** kode yang sudah jadi, bukan belajar **sambil**
   membangun. Begitu juga `cc-thinking-skills` (1.632 ⭐) dan `learn-faster-kit` (384 ⭐).

**Kesimpulan:** VibeWise **tidak punya saingan yang mapan**. Yang fungsinya benar-benar
mirip semuanya kecil (**3–42 bintang**), dan yang populer justru menjawab pertanyaan lain.

---

## 1. Dua pertanyaan yang harus dipisah

Supaya tidak tercampur, "belajar + AI" itu sebenarnya **tiga fungsi berbeda**:

| Fungsi | Pertanyaannya | Contoh |
|---|---|---|
| **A. Belajar sambil membangun** | *"AI menulis kodenya, tapi aku harus tetap paham."* | ← **ini VibeWise** |
| **B. Belajar dari kode jadi** | *"Jelaskan kode ini / ubah jadi kursus."* | `codebase-to-course` |
| **C. Latihan berpikir/nalar** | *"Latih aku berpikir kritis."* | `cc-thinking-skills` |

Repo ini (Mode Inspeksi) sebenarnya ada **di antara A dan B**: pelajar menulis kode **dan**
membedah kode. Itu sebabnya tidak ada satu plugin pun yang cocok utuh.

---

## 2. 🏛️ Yang RESMI — hanya satu

### 2.1 `anthropics/claude-plugins-official` → `learning-output-style`

| Item | Nilai |
|---|---|
| Repo induk | `anthropics/claude-plugins-official` — **37.832 ⭐** · **Apache-2.0** |
| Sifat | **Direktori plugin RESMI Anthropic** (dikelola Anthropic, 40 plugin terkurasi) |
| Push terakhir | **13 Okt 2026** (aktif) |
| Ukuran plugin | **4 berkas** — `plugin.json` (295 B) · `hooks.json` (320 B) · `hooks-handlers/session-start.sh` (3.564 B) · `README.md` (4.687 B) |

**Cara kerjanya** — satu skrip shell, bukan skill:

```json
{ "hooks": { "SessionStart": [ { "matcher": "startup|resume|clear|compact|fork",
  "hooks": [ { "type": "command", "command": "${CLAUDE_PLUGIN_ROOT}/hooks-handlers/session-start.sh" } ] } ] } }
```

Skripnya `cat` sebuah JSON berisi `additionalContext` — instruksi yang disuntikkan ke
setiap sesi. Isinya (dikutip dari berkas asli):

> *"Instead of implementing everything yourself, identify opportunities where the user can
> write 5-10 lines of meaningful code that shapes the solution."*

> *"Don't request contributions for: Boilerplate or repetitive code · Obvious implementations
> with no meaningful choices · Configuration or setup code · Simple CRUD operations."*

Plus bagian **Explanatory Mode**: blok `★ Insight ─────` berisi 2–3 poin pelajaran, ditulis
di percakapan (bukan di kode).

**🔴 Perbedaan krusial dari VibeWise:**

| | Anthropic `learning-output-style` | VibeWise |
|---|---|---|
| Yang menulis kode | **PELAJAR** (5–10 baris di titik keputusan) | **AI** (pelajar merancang) |
| Titik kontrol | AI menyiapkan tempat + TODO, pelajar mengisi | Pelajar konfirmasi desain, AI menulis |
| Ada berkas status? | ❌ tidak ada | ✅ `.vibe-wise/` (3 berkas) |
| Ada level pengalaman? | ❌ | ✅ Beginner/Intermediate/Advanced |
| Panjang instruksi | ~1 halaman | ~136 baris + 4 berkas pendamping |

**Ini justru lebih dekat ke Mode Inspeksi repo ini** daripada ke VibeWise — karena pelajar
yang menulis. Tapi ia tetap **bukan** Mode Inspeksi: tidak ada latihan LACAK/SUSUN/KLAIM/
TELUSUR, tidak ada prediksi sebelum menjalankan, tidak ada gerbang terukur.

**Catatan penting:** VibeWise sendiri menyebut plugin ini di `docs/development.md` sebagai
pembanding. Jadi VibeWise **mengakui** ia bukan yang pertama.

### 2.2 `openai/skills` dan `openai/plugins` — TIDAK ADA

| Repo | Bintang | Lisensi | Isi | Ada skill belajar? |
|---|---|---|---|---|
| `openai/skills` — *"Skills Catalog for Codex"* | **28.055** | ⚠️ **tanpa berkas lisensi** | `skills/.curated` (30 item: figma, notion, playwright, netlify, linear, pdf, jupyter…) + `skills/.system` (5 item: imagegen, openai-docs, plugin-creator, skill-creator, skill-installer) | ❌ **tidak ada** |
| `openai/plugins` | **7.433** | — | puluhan plugin vendor (adobe, airtable, canva, datadog, figma, github, gmail, …) | ❌ **tidak ada** |
| `openai/role-specific-plugins` | 554 | — | hanya `README.md` | ❌ kosong |

Pencarian kode di `openai/skills` untuk `learning OR teach OR tutor` → **hanya menemukan
`references/tutorial-patterns.md`** di dalam skill `jupyter-notebook`. Itu pola tutorial
notebook, bukan plugin belajar.

**Artinya:** ekosistem resmi OpenAI **tidak menganggap** "belajar sambil membangun" sebagai
kategori yang perlu diisi. Semua yang ada di Codex datang dari komunitas.

---

## 3. Bintang tinggi — tapi fungsinya BEDA

Ini jebakan paling mudah: bintang besar ≠ fungsi sama. Semua yang di bawah ini
**mengubah kode jadi bahan belajar**, bukan mendampingi proses membangun.

| Repo | ⭐ | Lisensi | Fungsi sebenarnya | Cocok? |
|---|---|---|---|---|
| `zarazhangrui/codebase-to-course` | **5.680** | ⚠️ **tanpa lisensi** | Ubah codebase jadi kursus HTML interaktif (modul, kuis, animasi) | ❌ fungsi B |
| `tjboudreaux/cc-thinking-skills` | **1.632** | MIT | 28 model mental & skill berpikir kritis, berbasis eval | ❌ fungsi C |
| `hluaguo/learn-faster-kit` | **384** | MIT | Coach belajar + *spaced repetition* (Python, `src/` + tes) | ❌ fungsi B |
| `bevibing/socrates-skill` | **333** | MIT | Metode Socratic murni — **tidak pernah memberi jawaban langsung** | ⚠️ mirip tapi sempit |
| `Li-Evan/Bloom` | **284** | MIT | Tutor pribadi + backend FastAPI/React (riset Bloom 2-Sigma) | ❌ aplikasi terpisah |
| `diet103/claude-code-infrastructure-showcase` | **10.029** | MIT | Aktivasi skill otomatis lewat hook | ❌ infrastruktur, bukan belajar |

**Detail yang perlu diwaspadai:**

- **`codebase-to-course` (5.680 ⭐) tidak punya berkas lisensi.** Repo tanpa lisensi =
  secara hukum **"semua hak dilindungi"** — tidak boleh dipakai ulang. Push terakhir
  **30 Mar 2026** (7 bulan lalu, cenderung mandek). Jangan tertipu bintangnya.
- **`bevibing/socrates-skill`** aturannya keras: *"NEVER give a direct answer... even if the
  user begs for the answer."* Ini kebalikan dari VibeWise — dan bertabrakan dengan
  `SOUL.md` repo ini ("kalau sebuah pertanyaan terdengar dasar, itu tanda kamu harus
  melambat"). Menahan jawaban bisa jadi menyiksa, bukan mengajar.
- **`Li-Evan/Bloom`** bukan skill — ia **aplikasi penuh** (Python 3.11+, Node 18+, React 19,
  FastAPI). Tidak bisa disalin ke folder skill.

---

## 4. Fungsi PALING MIRIP — semuanya kecil

Inilah yang benar-benar menjawab pertanyaan xcode. Diurutkan dari yang **paling mirip**.

### 4.1 `rizukirr/no-vibe` — 42 ⭐ · MIT · push 12 Jun 2026

**Paling dekat secara teknis DAN paling relevan untuk masalah 12 agen xcode.**

> *"You write every line of project code. AI refuses to. Hard-guarded by hooks across all
> five surfaces."*

> *"You predict before you run. Every layer ends with a one-question prediction gate: name
> the edge case, the failing branch, or the intermediate value before the program runs."*

**🔴 Ini yang penting: ia jalan di LIMA agen sekaligus.**

| Fitur | Claude Code | OpenCode | Pi | Codex | Gemini CLI |
|---|:-:|:-:|:-:|:-:|:-:|
| Penjaga tulis berkas (hook) | ✓ | ✓ | ✓ | ✓* | soft |
| Penjaga tulis Bash (hook) | ✓ | ✓ | ✓ | ✓* | soft |
| Status + petunjuk lanjut | ✓ | ✓ | ✓ | ✓* | soft |
| Perintah | ✓ | ✓ | ✓ | ✓ | ✓ |
| `PROFILE.md` + `SUMMARY.md` + override `user/` | ✓ | ✓ | ✓ | ✓ | ✓ |

`soft` = ditegakkan lewat instruksi (tidak ada hook). `*` = hook Codex hidup hanya pada
instalasi marketplace.

**Struktur berkas statusnya juga lebih matang dari VibeWise** — dipisah berdasarkan
**irama penulisan**:

| Berkas | Cakupan | Ditulis | Isi |
|---|---|---|---|
| `~/.no-vibe/PROFILE.md` | **global** — identitas lintas proyek | **jarang** | gaya belajar, kekuatan, celah |
| `.no-vibe/SUMMARY.md` | **proyek ini** | **sering** | fokus sekarang, `Open Questions` |
| `~/.no-vibe/user/*.md` + `.no-vibe/user/*.md` | override | **hanya manusia** | AI **dilarang** menulis ke sini |

Dua disiplin yang bagus: **"silent default"** (kebanyakan penutupan layer **tidak menulis**
apa-apa) dan **"NO_CHANGE"** (AI dilarang menulis ulang berkas dengan isi yang setara —
tulis no-op dianggap bug).

**Cara pasang:** Claude Code & Codex lewat marketplace plugin; Pi `pi install npm:no-vibe`;
Gemini `gemini extensions install`; OpenCode lewat `opencode.json` + unduh perintah.

### 4.2 `melsayedx/learning-mode` — 5 ⭐ · MIT · push 28 Jul 2026

**Alurnya paling mirip Mode Inspeksi repo ini.** Dikutip dari README:

```
Tentukan niat: jawaban cepat / belajar terpandu / serahkan
    ↓
Definisikan SATU hasil belajar
    ↓
Periksa prasyarat terkecil yang relevan
    ↓
Prediksi → coba → umpan balik → ulangi
    ↓
Validasi terhadap hasil yang didefinisikan
    ├─ Gagal → diagnosis, revisi, ulangi
    └─ Lulus → lanjut
    ↓
Bisakah pelajar menjelaskannya dan memindahkannya?
    ├─ Tidak → tangga petunjuk atau contoh analog
    └─ Ya → checkpoint berikutnya atau selesai
```

> *"...the learner own the selected learning target... guides prediction and attempts,
> **reviews without rewriting**, verifies consequential technical claims."*

**`Prediksi → coba → umpan balik`** itu hampir persis `PREDIKSI → JALANKAN → BEDAH → UBAH →
PERBAIKI → CATAT` repo ini. Dan **"reviews without rewriting"** = AI tidak menulis ulang.

Dipaking untuk **Claude Code dan Codex** (inti perilakunya sama).

### 4.3 `tempoloss/mentor-skill` — 3 ⭐ · MIT · push 8 Okt 2026 (paling baru)

> *"An agent skill that refuses to let you ship code you can't explain."*

Menargetkan **"comprehension debt"** — kode yang terkirim tanpa ada yang bisa membelanya.
Loop-nya: **jelaskan dalam 4 langkah → berhenti → minta pelajar mengulang dengan kata
sendiri → nilai → kalau salah, lacak model mental yang rusak ke depan.**

Yang paling berharga dari berkas ini adalah **aturan bahasanya**:

> *"Assume a smart user with no CS vocabulary. Those are different things — **simplify the
> wording, never the substance**."*

> *"The target is **the formal term AND a real-life analogy in the same breath**. The term
> buys precision and interview vocabulary; the analogy buys the shape. Never one without
> the other."*

> *"**Never invent a calque or transliteration for a technical term.** Keep the term exactly
> as it appears in the code — `lease`, `reaper`, `advisory lock` — and put the plain-language
> meaning beside it once."*

Dua mode: `SKILL.md` (dipanggil manual) dan `ALWAYS-ON.md` (ditempel ke berkas yang selalu
dimuat — `~/.omp/agent/APPEND_SYSTEM.md`, `~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`,
`.cursor/rules/mentor.mdc`). Ia **jujur soal biayanya**: ~2 KB konteks di **setiap** permintaan.

Menarik: berkas ini menyebut **omp** sebagai salah satu target — artinya penulisnya
memperhitungkan agen yang sama dengan yang dipakai xcode.

### 4.4 `AzamatRaimbekov/vibe-coding-mentor` — 3 ⭐ · MIT · push 6 Sep 2026

**Satu-satunya kandidat yang strukturnya benar-benar setara VibeWise:** ada `skills/`
(3 skill) + `hooks/` (`vibecoding-session-start.sh`, `vibecoding-always.sh`) + `agents/` +
`references/` + `scripts/`. SKILL.md utama **39.471 byte** — jauh lebih besar dari
`behavior.md` VibeWise (8.097 byte).

Tesisnya: *"человек формулирует и проверяет, агент объясняет и страхует"* (manusia
merumuskan dan memeriksa, agen menjelaskan dan mengawal).

Prinsip dasarnya: **"pengguna harus bisa menjelaskan setiap perubahan yang dibuat. Kalau
tidak bisa — langkahnya terlalu besar."**

Ada juga **dua berkas belajar-diri**: `references/lessons.md` (kesalahan AI sendiri — 
*"pelajaran dari sana lebih mahal dari aturan dari kepala: aturan ditulis di teori,
pelajaran dibayar dengan kesalahan nyata"*) dan berkas profil.

⚠️ **Isinya Bahasa Rusia.** Pemicunya dwibahasa (Rusia + Inggris), tapi seluruh isi
instruksinya Rusia. Perlu diterjemahkan dulu.

### 4.5 Sisanya — daftar pendek

| Repo | ⭐ | Catatan |
|---|---|---|
| `smixs/mentor` | 84 | Skill *session-insights* — membaca log sesi, bukan mendampingi membangun |
| `Lyn-77/ProMentor` | 77 | Memindai arsitektur proyek → Chapter bertahap. Isi Bahasa Mandarin |
| `genkovich/sdd` | 172 | 12 skill Socratic atomik + mesin TDD. Multi-harness (`.agents`/`.claude-plugin`/`.codex-plugin`/`.cursor-plugin`) + folder `evals/`. **Push 13 Okt 2026** — paling aktif |
| `m4vic/socratic` | 128 | Skill bertanya-diri. Punya `grades/` + `questions/` + `packs/` — **ada sistem penilaian** |
| `deniz-miro/claude-learn-skill` | 20 | Tutor Socratic untuk *vibe coder* |
| `Pontinn/mentor-skill` | 1 | Socratic, tidak pernah menulis kode. Punya 19 gaya humor (!) |
| `augmnt/collab` | 0 | Socratic mentor, satu berkas |
| `Akshat-2011/vibe-wise-opencode` | 1 | **Port VibeWise ke opencode** — tidak resmi, 0–1 ⭐ |
| `everclear077/codex-learning-plugin` | 2 | Khusus Codex: konsep inti, latihan terpandu, *teach-back*, *spaced recall* |

---

## 5. Tabel master — semua kandidat

Diurutkan dari **kecocokan fungsi**, bukan bintang.

| Repo | ⭐ | Lisensi | Siapa menulis kode | Agen | Cocok |
|---|---|---|---|---|---|
| **`anthropics/claude-plugins-official`** → `learning-output-style` | **37.832** (repo) | Apache-2.0 | **Pelajar** (5–10 baris) | Claude Code | ⭐⭐⭐ **resmi** |
| `rizukirr/no-vibe` | 42 | MIT | **Pelajar** (semua baris) | **5 agen** | ⭐⭐⭐⭐ **mirip + multi-agen** |
| `melsayedx/learning-mode` | 5 | MIT | Pelajar | Claude Code, Codex | ⭐⭐⭐⭐ **alur mirip** |
| `tempoloss/mentor-skill` | 3 | MIT | Pelajar | banyak (lewat `ALWAYS-ON.md`) | ⭐⭐⭐⭐ **loop pemahaman** |
| `AzamatRaimbekov/vibe-coding-mentor` | 3 | MIT | Pelajar | Claude Code | ⭐⭐⭐ struktur setara |
| `genkovich/sdd` | 172 | MIT | Pelajar | 4 agen | ⭐⭐⭐ paling aktif |
| `m4vic/socratic` | 128 | MIT | Pelajar | banyak | ⭐⭐⭐ ada penilaian |
| `smixs/mentor` | 84 | MIT | — | — | ⭐⭐ beda arah |
| `Lyn-77/ProMentor` | 77 | MIT | Pelajar | — | ⭐⭐⭐ Bahasa Mandarin |
| `rizukirr/no-vibe` | 42 | MIT | Pelajar | 5 agen | (lihat atas) |
| `deniz-miro/claude-learn-skill` | 20 | MIT | Pelajar | Claude Code | ⭐⭐ |
| `melsayedx/learning-mode` | 5 | MIT | Pelajar | 2 agen | (lihat atas) |
| `zarazhangrui/codebase-to-course` | 5.680 | ⚠️ **none** | — | — | ❌ fungsi beda |
| `tjboudreaux/cc-thinking-skills` | 1.632 | MIT | — | — | ❌ fungsi beda |
| `hluaguo/learn-faster-kit` | 384 | MIT | — | — | ❌ fungsi beda |
| `bevibing/socrates-skill` | 333 | MIT | Pelajar | banyak | ⚠️ Socratic murni |
| `Li-Evan/Bloom` | 284 | MIT | — | — | ❌ aplikasi, bukan skill |
| `nykooi1/vibe-wise` (pembanding) | 3.392 | MIT | **AI** | Claude Code, Codex | ⭐⭐⭐⭐ |

**Tidak ada satu pun** yang: (a) resmi dari perusahaan besar, (b) populer (>1.000 ⭐),
**dan** (c) fungsinya sama persis. Ketiganya tidak pernah bertemu di satu repo.

---

## 6. Yang paling layak dipertimbangkan untuk repo ini

Bukan rekomendasi untuk dipasang — hanya bahan pertimbangan.

1. **`anthropics/claude-plugins-official` → `learning-output-style`** — satu-satunya yang
   **resmi dan terkurasi**. Kalau tujuannya "aman & terpercaya", ini satu-satunya jawaban.
   Bonus: arahnya (pelajar menulis kode) **lebih cocok** dengan Mode Inspeksi daripada
   VibeWise. ⚠️ Tapi: tidak ada berkas status, tidak ada level, tidak ada latihan bedah kode.
2. **`rizukirr/no-vibe`** — satu-satunya yang memecahkan masalah **12 agen** secara
   sungguhan (5 agen, dengan matriks kompatibilitas jujur soal `soft` vs hook). Struktur
   `PROFILE.md`/`SUMMARY.md`/`user/` adalah desain berkas status **terbaik** yang saya
   temukan di seluruh riset ini — pemisahan berdasarkan *irama penulisan* itu prinsip yang
   benar.
3. **`tempoloss/mentor-skill` §"aturan bahasa"** — bagian yang paling bisa dipakai langsung.
   Tiga aturan: *sederhanakan kata, jangan substansinya* · *istilah formal DAN analogi
   dalam satu tarikan napas* · *jangan pernah mengarang terjemahan istilah teknis*.
   Ini bisa jadi butir checklist di skill `teach-*` repo ini.
4. **`melsayedx/learning-mode`** — alur `Prediksi → coba → umpan balik` + aturan
   *"reviews without rewriting"* + pertanyaan penutup *"bisakah pelajar menjelaskan dan
   memindahkannya?"* — semua selaras dengan Mode Inspeksi.

---

## 7. Jebakan & catatan

1. 🔴 **Bintang besar ≠ fungsi sama.** `codebase-to-course` 5.680 ⭐ tapi mengubah kode jadi
   kursus — bukan mendampingi membangun. Membandingkan angka bintang antar kategori
   menghasilkan kesimpulan salah.
2. 🔴 **Banyak repo belajar TIDAK punya lisensi.** `codebase-to-course` (5.680 ⭐) dan
   `openai/skills` (28.055 ⭐) sama-sama tanpa berkas lisensi. Tanpa lisensi = **tidak boleh
   dipakai ulang**. Ini pembeda penting dari MIT.
3. ⚠️ **Repo belajar berumur pendek.** Mayoritas push terakhir Mar–Ags 2026, sudah mandek.
   Hanya `genkovich/sdd` (13 Okt), `tempoloss/mentor-skill` (8 Okt), dan
   `anthropics/claude-plugins-official` (13 Okt) yang benar-benar segar.
4. ⚠️ **Tidak ada satu pun yang punya dasar riset pedagogis.** Sama seperti VibeWise
   (`riset-vibe-wise.md` §4). Yang menyebut riset hanya `Li-Evan/Bloom` (Bloom 2-Sigma 1984)
   — dan itu pun aplikasi terpisah, bukan skill.
5. ⚠️ **Bahasa.** `vibe-coding-mentor` (Rusia), `ProMentor` (Mandarin), `learning-journey`
   (Mandarin) — perlu terjemahan sebelum bisa dipakai.
6. ⚠️ **`bevibing/socrates-skill` bertabrakan dengan `SOUL.md` repo ini.** Aturannya
   *"NEVER give a direct answer... even if the user begs"* — sedangkan repo ini menganut
   *"kalau pertanyaannya terdengar dasar, itu tanda melambat, bukan menahan jawaban"*.
7. ℹ️ **Nama "VibeWise" sekarang dipakai di tempat lain.** Ada `Akshat-2011/vibe-wise-opencode`
   (port tidak resmi, 1 ⭐). Kalau mencari, hati-hati tertukar.

---

## 8. Sumber

Semua diakses **14 Oktober 2026** via `gh api` (GitHub REST API) dan `raw.githubusercontent.com`.

**Resmi:**
1. `anthropics/claude-plugins-official` — daftar 40 plugin, `plugins/learning-output-style/`
   (`README.md`, `hooks/hooks.json`, `hooks-handlers/session-start.sh`, `.claude-plugin/plugin.json`)
2. `openai/skills` — `skills/.curated` (30 item), `skills/.system` (5 item)
3. `openai/plugins` — daftar plugin vendor
4. `openai/role-specific-plugins` — isi (hanya README)
5. `anthropics/skills` — `skills/academy-guide/SKILL.md`, `skills/discernment-nudge/SKILL.md`

**Populer:**
6. `obra/superpowers` (298.721 ⭐) — daftar `skills/` (15 skill, tidak ada yang belajar)
7. `wshobson/agents` (40.637 ⭐) — 92 plugin, **tidak ada** yang belajar
8. `hesreallyhim/awesome-claude-code` (55.618 ⭐) — bagian *"From Anthropic"*,
   *"Documentation, Knowledge & Learning"*, *"Skills"*
9. `diet103/claude-code-infrastructure-showcase` (10.029 ⭐)
10. `zarazhangrui/codebase-to-course` (5.680 ⭐) · `tjboudreaux/cc-thinking-skills` (1.632 ⭐)

**Kandidat fungsi-mirip:**
11. `rizukirr/no-vibe` — README + matriks kompatibilitas 5 platform
12. `melsayedx/learning-mode` — README
13. `tempoloss/mentor-skill` — `README.md` + `SKILL.md`
14. `AzamatRaimbekov/vibe-coding-mentor` — `README.en.md` + `skills/vibe-coding-mentor/SKILL.md`
15. `bevibing/socrates-skill` — `SKILL.md`
16. `genkovich/sdd` · `m4vic/socratic` · `smixs/mentor` · `Lyn-77/ProMentor` ·
    `deniz-miro/claude-learn-skill` · `everclear077/codex-learning-plugin` — struktur + metadata

---

**📅 Riset:** 14 Oktober 2026 · **Untuk:** `xcode`
**📚 Terkait:** `riset-vibe-wise.md` · `.workbuddy-ai/memory/MEMORY.md` §3 (Mode Inspeksi) ·
§4 (dasar riset)
