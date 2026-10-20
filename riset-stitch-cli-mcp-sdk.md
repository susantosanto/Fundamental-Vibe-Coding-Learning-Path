# Riset — Google Stitch: CLI, MCP, SDK

> **MULAI:** apa itu Stitch CLI/MCP/SDK, dan bisakah agent di sistem saya membaca
> design hasil generate Stitch?
> **SELESAI:** jawaban berbasis bukti + posisi di workflow Bab 27 + daftar jebakan.
> **Tanggal riset:** 7 Okt 2026 · **Metode:** GitHub API + `raw.githubusercontent.com` +
> registry npm (sesuai `MEMORY.md` §2 — hanya repo/dokumen resmi).
>
> 🔄 **Direvisi 7 Okt 2026 (sesi pemasangan).** Riset awal menyimpulkan *"belum ada CLI
> resmi"* — **itu salah.** Ada: `@google/stitch` v0.11.0. Lihat §1b.
> Juga: jumlah tool MCP = **15**, bukan 14 (§2).

---

## 1. 🔴 Koreksi alamat: `stitch.google.com/docs/cli/overview` bukan sumbernya

URL yang xcode berikan **tidak mengembalikan isi apa pun**. Halaman itu cuma mengirim:

```
Stitch - Design with AI
```

Saya uji tiga cara — semuanya gagal:

| Cara | Hasil |
|---|---|
| `WebFetch` | hanya judul + tagline |
| `curl` HTTP 200 (25.159 byte) | setelah `<script>`/`<style>` dibuang → **1 baris teks** |
| Cari tag `<script src=…>` | **tidak ada** — bundelnya dimuat lewat `gstatic.com` |

Jadi ini **SPA** (single-page app): isinya baru muncul setelah JavaScript jalan.
Statis tidak bisa membacanya.

**Alamat yang benar — dan ini terverifikasi:**

| Ada di | URL | Status |
|---|---|---|
| Repo SDK | `github.com/google-labs-code/stitch-sdk` | ✅ **1.826 ⭐**, Apache-2.0, TypeScript |
| Repo skills resmi | `github.com/google-labs-code/stitch-skills` | ✅ **8.436 ⭐**, Apache-2.0 |
| Paket npm CLI | `@google/stitch` | ✅ **v0.11.0** (lihat §1b) |
| Situs produk | `stitch.withgoogle.com` | (dari kolom `homepage` repo) |
| **Server MCP** | **`https://stitch.googleapis.com/mcp`** | dari README SDK — **ini yang penting** |

Repo `google-labs-code/stitch-cli` **tidak ada** (`404`), dan tidak ada paket npm
bernama `@google/stitch-cli`. **Tapi** CLI-nya ada di dalam paket `@google/stitch` —
lihat §1b.

---

## 1b. ✅ Koreksi: CLI resmi memang ada — `@google/stitch`

Riset awal saya berhenti di *"repo `stitch-cli` 404, berarti tidak ada CLI"*. Itu
**kesimpulan yang terlalu cepat**: CLI-nya tidak berada di repo terpisah, tapi
dibundel di paket npm `@google/stitch`.

```
name        : @google/stitch
version     : 0.11.0
license     : Apache-2.0
bin         : { stitch: 'dist/stitch.js',  stitch-mcp: 'dist/mcp.js' }
description : Agent-first CLI and MCP server for Google Stitch
repository  : git+https://github.com/google-labs-code/stitch-sdk.git
homepage    : https://stitch.withgoogle.com
engines     : { node: '>=20' }
dependencies: { zod: '^4.3.6' }   ← hanya satu dependensi
```

Perhatikan `description`: **"Agent-first CLI and MCP server"**. Paket ini menyediakan
**dua binary** — `stitch` (CLI) dan `stitch-mcp` (server MCP stdio). Jadi CLI dan MCP
bukan pilihan terpisah; keduanya dari satu paket.

⚠️ **Node ≥ 20** (bukan ≥18 seperti SDK-nya). Sistem ini punya v22.22.2 → aman.

⚠️ **Ada paket `stitch-cli` v0.0.19 (MIT) di npm yang BUKAN Google.** Jangan salah pasang.

### Perintah CLI yang penting (terverifikasi dari `--help`)

```
stitch login                  → OAuth 2.0 PKCE lewat browser, ATAU simpan API key
stitch login --api-key <k>    → simpan API key permanen
stitch status                 → cek auth + status proyek
stitch config set project <id>→ set project default per-repo
stitch mcp install            → daftarkan MCP ke editor (6 target)
stitch mcp start              → jalankan server MCP lewat stdio
stitch agent-skills add --user → pasang skill Stitch bawaan ke ~/.agents/skills
stitch find projects          → daftar proyek
stitch capture <url|path>     → tangkap halaman jadi HTML mandiri
stitch upload <file>          → unggah aset ke proyek
stitch open <project|screen>  → buka di browser
stitch serve                  → preview dev server lokal
```

⚠️ **Yang TIDAK ada** meski saya cari: perintah `download` / `export`. Mengunduh
HTML design tetap lewat **MCP tool** (`get_screen`) atau **SDK** (`downloadAssets`).
CLI bisa `capture` (halaman → HTML) dan `upload` (berkas → Stitch), tapi arah
Stitch → disk lewat jalur lain. Ini pembatas nyata; jangan diasumsikan ada.

### `stitch mcp install` — cakupan resminya

`--target` yang didukung (dari `--help`): `gemini-cli`, `antigravity`, `claude-desktop`,
`claude-code`, `cursor`, `vscode`, `jetski`, `all`.

**Yang TIDAK didukung: opencode, workbuddy, pi, omp.** Untuk agen-agen itu config
harus ditulis manual. `--dry-run` tersedia — pakai untuk melihat path sebelum menulis.

---

## 2. Tiga hal itu ternyata SATU hal

Ini temuan inti yang menyederhanakan semuanya:

```
              ┌──────────────────────────────────┐
              │  Stitch MCP Server (HOSTED)      │
              │  https://stitch.googleapis.com/mcp│
              │  15 tool · HTTP · tanpa install  │
              └───────────────┬──────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼─────┐        ┌──────▼──────┐       ┌──────▼──────┐
   │ MCP      │        │ CLI         │       │ SDK         │
   │ langsung │        │ @google/    │       │ @google/    │
   │ (klien   │        │ stitch      │       │ stitch-sdk  │
   │  MCP apa │        │ stich +     │       │ + AI SDK    │
   │  pun)    │        │ stitch-mcp  │       │             │
   └──────────┘        └─────────────┘       └─────────────┘
```

**CLI dan SDK hanyalah pembungkus di atas server MCP yang sama.** Jadi pertanyaannya
bukan "CLI atau MCP atau SDK" — ketiganya menembak **endpoint yang sama**.

### Angka yang terverifikasi (direvisi)

| Item | Nilai | Sumber |
|---|---|---|
| Tool yang diekspos server MCP | **15** | diuji langsung: `POST /mcp` → `tools/list` |
| Versi npm `@google/stitch` (CLI) | **0.11.0** | registry npm |
| Versi npm `@google/stitch-sdk` | 0.3.5 (12 Mei 2026) | registry npm |
| Lisensi | **Apache-2.0** | README + GitHub API |
| Node — CLI | **≥ 20** | `engines` paket npm |
| Node — SDK | ≥ 18, ES modules saja | `packages/sdk/README.md` |

**15 tool (terverifikasi langsung dari endpoint):**

`create_project` · `get_project` · `delete_project` · `list_projects` · `list_screens` ·
`get_screen` · `generate_screen_from_text` · `edit_screens` · `generate_variants` ·
`upload_design_md` · `create_design_system` · `create_design_system_from_design_md` ·
`update_design_system` · `list_design_systems` · `apply_design_system`

⚠️ **Catatan keamanan penting yang saya temukan saat menguji:** endpoint `/mcp`
menjawab **`200` dan mengembalikan daftar tool lengkap meski API key-nya palsu**.
Artinya autentikasi **tidak** dijaga di handshake — ia dijaga **per pemanggilan tool**.
Konsekuensi untuk diagnosis: *"MCP-nya konek"* **bukan** bukti kredensialnya benar.
Uji dengan tool nyata (`list_projects`), bukan dengan melihat status koneksi.

### Disclaimer resmi — penting

> *"This is not an officially supported Google product. This project is not eligible
> for the Google Open Source Software Vulnerability Rewards Program."*

Jadi ini **Google Labs**, bukan produk Google yang didukung resmi. Pengaruhnya ke
keputusan: jangan taruh di jalur kritis tanpa rencana cadangan.

---

## 2b. Skills resmi — `google-labs-code/stitch-skills`

Ditemukan saat pemasangan (URL xcode tidak menyebutkannya). **8.436 ⭐, Apache-2.0.**

Repo ini berisi **15 skill dalam 3 plugin**, mengikuti standar Agent Skills:

| Plugin | Skill | Guna |
|---|---|---|
| **stitch-design** | `code-to-design` | kode frontend → design Stitch (rantai: ekstrak HTML → design system → upload) |
| | `generate-design` | generate screen baru dari teks/gambar, edit, buat varian |
| | `manage-design-system` | upload DESIGN.md, terapkan tema ke screens |
| | `extract-design-md` | tarik design system dari kode sumber |
| | `extract-static-html` | ekstrak HTML mandiri dari web app berjalan (inline CSS + gambar) |
| | `upload-to-stitch` | unggah aset lokal; **bypass batas token base64 MCP** |
| **stitch-build** | `react-components` | screen Stitch → komponen React + validasi AST |
| | `react-native` | screen Stitch → React Native StyleSheet |
| | `react-vite-dashboard` | → dashboard React + Vite + TanStack Query |
| | `remotion` | → video walkthrough proyek Stitch |
| | `shadcn-ui` | panduan integrasi shadcn/ui |
| **stitch-utilities** | `design-md` | analisis proyek Stitch → DESIGN.md |
| | `enhance-prompt` | ubah ide UI mentah → prompt Stitch yang bagus |
| | `stitch-loop` | bangun situs multi-halaman dari satu prompt |
| | `taste-design` | DESIGN.md bergaya premium / anti-generik |

⚠️ **Dependensi antar-skill nyata** — README memperingatkan: *"Stitch Design Skills often
have inter-dependencies. If you choose to install skills selectively, ensure you include
all required dependencies."* Jangan pasang sebagian tanpa memeriksa.

⚠️ **Install OpenCode: MANUAL.** README menyatakan tegas: *"OpenCode does **not** use
`npx plugins` / `npx skills` or the Codex/Claude marketplace layout."* Salin folder ke
`.opencode/skills/` (proyek) atau dir yang didiscovery.

⚠️ **Batasan nama OpenCode:** *"OpenCode requires skill `name` frontmatter to be
lowercase kebab-case and match the directory name."* Enam skill memakai nama
`stitch::<nama>` (`stitch::generate-design`, dst.) — **ini akan ditolak OpenCode**
sampai field `name` dan folder diganti. Frontmatter tambahan seperti `allowed-tools`
diabaikan.

⚠️ **Nama tool di dalam instruksi skill memakai konvensi Claude/Codex** (`web_fetch`,
`run_command`). Di OpenCode nama builtin-nya `webfetch` / `bash`. Perlu penyesuaian.

⚠️ **Prasyarat mutlak:** README §Prerequisites — *"These skills require the **Stitch MCP**
server to be configured and running in your agent's environment."* Skill tanpa MCP =
tidak berguna.

⚠️ **Menyimpan API key:** `stitch::upload-to-stitch` menyuruh agent **membaca config MCP
untuk mengekstrak API key**. Di repo yang sudah punya 9 API key bocor, ini instruksi
yang harus dibatasi — jangan pernah menyalin key ke berkas di dalam repo.

### Alternatif: skill gabungan bawaan CLI

CLI punya jalur pemasangan sendiri yang lebih rapi:

```bash
stitch agent-skills add --user     # → ~/.agents/skills/stitch (18 berkas, "set: design")
```

Isinya **satu skill router** + `flows/` + `references/`:

```
~/.agents/skills/stitch/
├── SKILL.md                    ← router: "Route by intent"
├── flows/design.md             ← state machine design flow
├── flows/review.md             ← review app berjalan vs DESIGN.md
└── references/
    ├── capture-screens.md      ├── code-to-design.md
    ├── design-mappings.md      ├── design-md.md
    ├── design-system.md        ├── generate-screens.md
    ├── prompt-keywords.md      ├── upload.md
    ├── examples/DESIGN.md      ├── examples/enhanced-prompt.md
    └── frameworks/{angular,plain-css,react-tailwind,svelte,vue}.md
```

**Ini yang dipakai** (keputusan xcode, 7 Okt 2026): satu entri skill yang rapi, bukan
15 entri yang membengkakkan daftar skill setiap agen. Isinya **setara** — `frameworks/`
sudah menutup `extract-design-md` dalil, `generate-screens.md` menutup `generate-design`,
dst. Yang **tidak** tertutup: skill `stitch-build` (react-components, react-native,
remotion, shadcn-ui, react-vite-dashboard) — itu untuk **generasi kode dari design**, dan
di repo ini kode ditulis oleh builder, bukan dari mockup (§4.2). Jadi tidak hilang apa pun
yang dibutuhkan.

⚠️ `stitch agent-skills` akan **menimpa** folder `stitch` yang bukan buatan CLI
(ada flag `--overwrite`; aslinya di-backup). Pakai `stitch agent-skills update` untuk
resync ke versi CLI.

---

## 3. Jawaban pertanyaan inti: YA, agent bisa membacanya

### Jalur 1 — agent sebagai KLIEN MCP (paling bersih)

Server MCP-nya **hosted** — tidak perlu `npm install` apa pun:

```bash
claude mcp add --transport http stitch https://stitch.googleapis.com/mcp
```

Di WorkBuddy: tulis ke `~/.workbuddy-ai/mcp.json`. Tool yang tersedia (terverifikasi
dari katalog MCP):

`create_project` · `get_project` · `list_projects` · `list_screens` · `get_screen` · …

Alur baca design-nya:

```
1. list_projects        → dapat projectId
2. list_screens         → dapat screenId
3. get_screen           → detail screen
4. screen.getHtml()     → URL unduh HTML  ← INI kode frontend-nya
   screen.getImage()    → URL unduh screenshot
```

**`getHtml()` mengembalikan URL unduhan HTML.** Jadi agent tidak cuma "melihat
gambar" — ia dapat **kode HTML-nya**, bisa langsung ditulis ke repo.

### Jalur 2 — SDK + `downloadAssets` (paling kuat untuk repo)

Ini temuan yang membuat jawabannya tegas **ya**. SDK punya langkah ekspor bawaan
(`packages/sdk/src/spec/download.ts`, terverifikasi):

```
Tool: downloadAssets
Input:
  projectId     : string
  outputDir     : string   ← "Absolute path to the directory where screens
                            and assets should be saved"
  fileMode      : number   (default 0o600)
  assetsSubdir  : string   (default "assets")
Output:
  success: true
  downloadedScreens: [ { screenId, screenSlug, filePath } ]
```

**Ia menulis HTML + aset ke disk.** Ada juga proteksi `PATH_TRAVERSAL_ATTEMPT` di
daftar error — tanda penulisnya memikirkan keamanan path.

Artinya: **design Stitch bisa mendarat sebagai berkas nyata di repo** — HTML
per-screen, plus subfolder aset.

---

## 4. Cek terhadap workflow Bab 27-mu

### 4.1 Ini bukan slot kosong — sudah ada `/pen-design`

Bab 27.4 sudah punya aturan batin untuk `/pen-design`:

```
/pen-design (MCP Pencil / pen.dev CLI)
KAPAN  : Tahap 2 (mockup pra-coding) dan saat user berkata "buatkan
         visual/mockup/design untuk..."
BUTUH  : pen CLI (npm i -g @pen.dev/cli) + auth (pen status/login)
OUTPUT : file .pen → export gambar → references/mockups/
ATURAN : Mockup BUKAN kode. Jangan pernah membiarkan mockup menjadi
         implementasi — ia lampiran BLUEPRINT, builder yang menulis kode.
BATAL  : Proyek tanpa UI; perubahan kecil pada UI existing (edit langsung).
```

**Stitch cocok di slot yang PERSIS sama** — visualisasi mockup Tahap 2, dan
sistemmu sudah menyatakan slot itu ada.

Bedanya penting, dan justru menguntungkan Stitch:

| | `/pen-design` (sekarang) | **Stitch** |
|---|---|---|
| Output | `.pen` → **export gambar** | **HTML + screenshot** |
| Untuk agent | gambar — agent harus *menafsirkan* | **HTML nyata** — bisa dibaca langsung |
| Baca design | visual saja | `getHtml()` → **kode** |
| Ekspor ke repo | manual | **`downloadAssets` → tulis ke disk** |
| Integrasi MCP | via pen.dev CLI | **server MCP hosted, 14 tool** |
| Biaya | pen.dev (proprietary) | Apache-2.0 (tapi butuh API key) |

### 4.2 Cocok, tapi ada satu tabrakan aturan

Aturan mu: **"Mockup BUKAN kode. Jangan pernah membiarkan mockup menjadi
implementasi — ia lampiran BLUEPRINT, builder yang menulis kode."**

Stitch **justru menghasilkan HTML**. Ini bagus *dan* berbahaya sekaligus:

- ✅ Bagus: agent bisa membaca design sebagai **bukti terstruktur**, bukan tebakan visual.
- 🔴 Bahaya: HTML dari Stitch **menggoda untuk disalin langsung** sebagai implementasi —
  persis yang aturanmu larang.

**Rumusan yang aman:** HTML Stitch tetap **lampiran BLUEPRINT**, bukan kode produksi.
Builder tetap yang menulis kode. Kalau HTML-nya dipakai, ia dipakai sebagai
**spesifikasi** (struktur, hierarki, komponen), bukan sebagai sumber yang di-copy.

### 4.3 Di mana saja ia menyentuh workflow

| Tahap | Bagaimana |
|---|---|
| **Tahap 2** (mockup pra-coding) | **slot utama** — bersaing langsung dengan `/pen-design` |
| **Tahap 2–3** | `/pen-design` sekarang menangani ini (27.1 Lapis 2) |
| **Tahap 3.5** | ❌ **jangan** — itu milik `/birdview` (lihat riset Cocoon §7) |
| **Tahap 5** | `/impeccable` + `/taste` yang berkuasa; Stitch tidak masuk |
| **Tahap 6** | `/browser-skill` untuk bukti visual — Stitch bukan bukti |

**Kesimpulan: satu slot saja — Tahap 2.**

### 4.4 🔴 Tabrakan dengan hukum inti workflow-mu

Tiga hukummu, dan bagaimana Stitch berinteraksi:

1. **"Bukti, bukan klaim"** — Stitch menghasilkan artefak nyata (HTML + PNG ke disk).
   ✅ **Tidak masalah.** Ini lebih kuat dari mockup gambar.

2. **"folder = source of truth"** — `downloadAssets` menulis ke folder. ✅ Cocok,
   asal foldernya benar (`references/mockups/` mengikuti pola `/pen-design`).

3. **"DILARANG memilih model"** (`MODEL-POLICY.md`) — 🔴 **ini yang perlu diwaspadai.**
   Stitch SDK punya parameter `modelId`:
   `"GEMINI_3_8_FLASH"` | `"GEMINI_3_5_FLASH_LITE"` (opsional, default dari backend).
   **Kalau agent memanggil Stitch, agent tidak boleh memilih `modelId`** — itu pilihan
   manusia, persis seperti aturanmu untuk subagent. Biarkan default, atau minta xcode.

---

## 5. Rancangan aturan (gaya 27.4, kalau xcode setuju)

```
/stitch-design  (nama kerja — belum diputuskan)
KAPAN  : Tahap 2 (mockup pra-coding) — ALTERNATIF /pen-design, bukan tambahan
         Dipakai kalau: butuh HTML (bukan sekadar gambar), atau pen.dev tidak tersedia
BUTUH  : STITCH_API_KEY dari stitch.withgoogle.com/settings
         → simpan sebagai environment variable, JANGAN di repo
OUTPUT : downloadAssets → references/mockups/<slug>/ (HTML) + assets/
         + screenshot PNG
ATURAN : 🔴 HTML Stitch = LAMPIRAN BLUEPRINT, BUKAN implementasi.
         Builder tetap yang menulis kode. Jangan copy-paste HTML Stitch.
         DILARANG memilih modelId — serahkan ke default atau tanya xcode.
         DILARANG taruh di Tahap 3.5 (itu /birdview) atau Tahap 5 (/impeccable).
BATAL  : Proyek tanpa UI; perubahan kecil UI existing; pen.dev sudah cukup.
```

⚠️ **Belum dipasang.** Menunggu keputusan xcode.

---

## 6. Jebakan yang sudah ditemukan

| Jebakan | Akibat |
|---|---|
| **Halaman docs-nya SPA** | Agent/browser statis tidak bisa membacanya — cari repo, bukan situsnya |
| **Butuh API key** `STITCH_API_KEY` | Gagal `AUTH_FAILED`. Key **jangan** masuk repo (repo ini sudah punya 9 API key bocor — jangan tambah) |
| **`CLARIFICATION_REQUIRED`** | `generate()` bisa **balas dengan pertanyaan**, bukan screen. Kode error `recoverable: true`; jawabannya dikirim sebagai prompt ulang. Kalau tidak ditangani → dianggap gagal padahal belum |
| **SDK 0.3.5 — masih 0.x** | API bisa berubah. Ini Google Labs, **bukan produk Google didukung resmi** |
| **Node ≥18 + ES modules saja** | Bukan CommonJS. Proyek `require()` tidak bisa langsung pakai |
| **`modelId` = pilihan manusia** | Melanggar `MODEL-POLICY.md` kalau agent memilih sendiri |
| **HTML hasil generate** | Tergoda disalin jadi implementasi → melanggar aturanmu sendiri |
| **Nama paket mirip** | `stitch-sdk` (npm, **2024**, bukan Google) vs `@google/stitch-sdk` (resmi). Jangan salah pasang |
| **Belum ada CLI resmi terbukti** | URL `/docs/cli/overview` kosong; repo `stitch-cli` 404. Jangan asumsikan ada |
| **14 tool, tapi batas token** | Catatan SDK sendiri: panggilan MCP lewat agent **kena batas token output**; `uploadAssets`/`downloadAssets` lewat REST **tidak**. → pakai SDK untuk transfer berkas, bukan MCP |

---

## 7. Sumber

1. `https://api.github.com/repos/google-labs-code/stitch-sdk` — metadata, lisensi, bintang
2. `https://raw.githubusercontent.com/google-labs-code/stitch-sdk/main/README.md` — API lengkap
3. `.../main/package.json` — versi, scripts, workspaces
4. `.../main/packages/sdk/README.md` — install, entry point, batas Node
5. `.../main/packages/sdk/src/spec/download.ts` — kontrak `downloadAssets`
6. `.../main/.agents/skills/stitch-sdk-usage/SKILL.md` — catatan batas token MCP
7. `https://registry.npmjs.org` — versi `@google/stitch-sdk` 0.3.5
8. `https://stitch.google.com/docs/cli/overview` — **diuji, kosong** (SPA)
9. `https://skillselion.com/mcp/tool/com.googleapis.stitch/mcp` — katalog 14 tool ⚠️ pihak ketiga
10. `https://www.npmjs.com/package/@andclans/mcp-google-stitch` — contoh config ⚠️ pihak ketiga

⚠️ Untuk 9 dan 10: **bukan** sumber resmi. Dipakai hanya untuk bentuk config & jumlah
tool; detail tool diverifikasi ulang lewat README SDK resmi.
