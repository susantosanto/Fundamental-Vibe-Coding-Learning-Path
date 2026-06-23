# 🎯 Panduan Lengkap Crit — Review Agent AI dalam Workflow Development

> **Crit** adalah alat *local-first* yang memungkinkan Anda memberikan umpan balik presisi ke AI coding agent melalui antarmuka browser.
> Layaknya *Pull Request review*, tapi instan, lokal, dan untuk setiap iterasi agent Anda.

---

## 📋 Daftar Isi

1. [Apa Itu Crit?](#apa-itu-crit)
2. [Ringkasan Instalasi](#ringkasan-instalasi)
3. [Mengapa Crit Penting dalam Workflow](#mengapa-crit-penting-dalam-workflow)
4. [Mode Review Crit](#mode-review-crit)
5. [Workflow Lengkap: PRD → Use-Case Flow → Design](#workflow-lengkap-prd%20--%20use-case-flow%20--%20design)
6. [Panduan Perintah Crit](#panduan-perintah-crit)
7. [Studi Kasus Praktis](#studi-kasus-praktis)
8. [Tips & Best Practices](#tips--best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Apa Itu Crit?

Crit adalah *review surface* berbasis browser yang menjembatani komunikasi antara Anda dan AI coding agent. Alih-alih menjelaskan perubahan melalui teks di terminal, Anda bisa:

- 🖱️ **Klik baris kode** tertentu untuk memberi komentar
- 📄 **Lihat plan/dokumen** dalam format Markdown yang rapi
- 🌐 **Review aplikasi live** — klik elemen UI yang bermasalah
- 🔄 **Lihat diff per round** — apa yang berubah sejak review terakhir

**Prinsip kerja:** Crit menulis file review terstruktur (JSON) yang bisa dibaca oleh agent AI. Agent bisa membalas komentar dan memperbaiki sesuai masukan Anda.

---

## Ringkasan Instalasi

Crit sudah terinstall di sistem Anda:

| Komponen | Lokasi |
|----------|--------|
| **Binary** | `~/bin/crit.exe` (`crit v0.16.1`, sudah di PATH) |
| **OpenCode** | Plugin + Command + Skill terinstall |
| **Claude Code** | Plugin marketplace terinstall |
| **Pi Agent** | Skill `crit` & `crit-cli` |
| **Mistral / Vibe** | Skill `crit` & `crit-cli` |
| **OpenClaude** | Skill `crit` & `crit-cli` |

Cek instalasi kapan saja:
```bash
crit --version
```

---

## Mengapa Crit Penting dalam Workflow

### Masalah yang Dipecahkan Crit

| Tanpa Crit | Dengan Crit |
|-----------|-------------|
| Mengetik instruksi panjang di terminal | Klik + komentar singkat di browser |
| AI sering salah interpretasi karena instruksi ambigu | Komentar tepat pada baris/elemen spesifik |
| Harus scroll bolak-balik di diff terminal | Lihat perubahan dengan syntax highlighting |
| Sulit review plan 300+ baris di terminal | Plan dirender rapi di browser |
| Tidak ada riwayat review per-round | Round-to-round diff tersimpan |

### Kapan Crit Paling Berguna

1. **Review plan/dokumen** — saat agent membuat PRD atau use-case flow
2. **Review code diff** — setelah agent selesai coding
3. **Review UI** — saat agent membangun frontend

---

## Mode Review Crit

Crit memiliki **4 mode review** yang bisa dideteksi secara otomatis:

### 1. 📄 Files / Markdown — Plans & Docs
**Gunakan saat:** Agent membuat rencana, PRD, atau dokumen Markdown.

```bash
crit path/to/plan.md
```

- Render Markdown dengan rapi di browser
- Komentar per-seksi, bukan per-dokumen
- Lihat diff antar-round

### 2. 💻 Branch / PR Changes — Code
**Gunakan saat:** Agent selesai menulis kode dan Anda ingin review perubahan.

```bash
crit                        # auto-detect branch diff
crit --pr 42                # review GitHub PR #42
crit --range main..feature  # review commit range
```

- Syntax highlighting
- Komentar per-baris kode
- Dukungan stacked PRs (git, jj, sapling)

### 3. 🌐 Running App / Dev Server — Live
**Gunakan saat:** Agent menjalankan aplikasi di localhost.

```bash
crit http://localhost:5173
```

- Proxy halaman ke review surface
- Klik elemen DOM langsung untuk komentar
- Auto-reload

### 4. 🖼️ Static HTML Artifact — Preview
**Gunakan saat:** Agent menghasilkan file HTML statis.

```bash
crit path/to/output.html
```

- Render di iframe
- Klik elemen untuk komentar
- Asset siblings ikut terserve

---

## Workflow Lengkap: PRD → Use-Case Flow → Design

Berikut adalah workflow end-to-end pengembangan fitur dengan Crit sebagai *quality gate* di setiap fase.

```
 PRD  ──▶  User Flow  ──▶  Tech Design  ──▶  Coding  ──▶  Live Review  ──▶  SHIP!
  │            │               │                │              │
  ▼            ▼               ▼                ▼              ▼
 Crit         Crit            Crit             Crit           Crit
Review       Review          Review           Review         Review
```

---

### FASE 1: PRD (Product Requirements Document)

**Tujuan:** Mendefinisikan kebutuhan fitur secara detail.

**Workflow:**

1. **Prompt agent** untuk membuat PRD:
   ```
   Buat PRD untuk fitur [nama fitur] di file docs/PRD.md
   ```

2. **Review PRD dengan Crit:**
   ```bash
   crit docs/PRD.md
   ```
   Browser terbuka → Anda lihat PRD dirender rapi.

3. **Beri komentar:**
   - Klik baris yang perlu diperbaiki
   - Tulis komentar spesifik, misal:
     - *"Scope-nya terlalu luas, fokus ke MVP saja"*
     - *"Tambah metric keberhasilan"*
     - *"Hilangkan bagian ini, tidak relevan"*

4. **Agent perbaiki:**
   Agent baca komentar dari Crit → perbaiki PRD → ulang review.

5. **Review round 2:**
   ```bash
   crit docs/PRD.md
   ```
   Lihat diff dari round sebelumnya. Pastikan semua komentar terresolve.

6. **Setuju:** Jika semua komentar resolved → lanjut ke fase berikutnya.

> **💡 Tips PRD:** Minta agent buat PRD dengan format:
> `# PRD: [Fitur]` → `## Latar Belakang` → `## Tujuan` → `## Scope` → `## Spesifikasi Fungsional` dan `## Spesifikasi Non-Fungsional` → `## Metrik`

---

### FASE 2: Use-Case Flow

**Tujuan:** Mendefinisikan alur pengguna (user flow) berdasarkan PRD.

**Langkah-langkah:**

1. **Prompt agent** berdasarkan PRD:
   ```
   Berdasarkan PRD di docs/PRD.md, buat user flow diagram di docs/user-flow.md.
   Gunakan format Mermaid untuk diagramnya.
   ```

2. **Review user flow dengan Crit:**
   ```bash
   crit docs/user-flow.md
   ```

3. **Beri komentar:**
   - *"Tambahkan error handling di step 5"*
   - *"Flow ini terlalu kompleks, split menjadi 2 flow terpisah"*
   - *"Tambah kondisi: jika user belum login, redirect ke halaman login"*
   - *"Hapus step ini, user tidak perlu melihat halaman ini"*

4. **Iterasi:** Agent perbaiki → review lagi → sampai setuju.

> **💡 Tips User Flow:** Gunakan format Mermaid agar flow bisa divisualisasikan.
> Contoh:
> ````md
> ```mermaid
> flowchart TD
>   A[Start] --> B{Login?}
> ```
> ````

---

### FASE 3: Desain / Spesifikasi Teknis

**Tujuan:** Mendefinisikan arsitektur, komponen, database, dan API.

**Langkah-langkah:**

1. **Prompt agent** untuk buat tech spec:
   ```
   Berdasarkan PRD di docs/PRD.md dan user flow di docs/user-flow.md,
   buat technical specification di docs/tech-spec.md yang mencakup:
   - Arsitektur sistem (Mermaid diagram)
   - Database schema
   - API endpoints
   - Component tree (React)
   - Data flow
   ```

2. **Review tech spec dengan Crit:**
   ```bash
   crit docs/tech-spec.md
   ```

3. **Beri komentar spesifik:**
   - *"Gunakan PostgreSQL, bukan SQLite"*
   - *"Endpoint /api/users perlu pagination"*
   - *"Tambah validasi input di layer controller"*
   - *"Component ini perlu di-split jadi child components"*

4. **Iterasi hingga matang.**

---

### FASE 4: Implementasi (Coding)

**Tujuan:** Agent menulis kode berdasarkan tech spec.

**Langkah-langkah:**

1. **Prompt agent** untuk implementasi:
   ```
   Implementasi fitur berdasarkan tech-spec.md.
   Gunakan branch baru.
   ```

2. **Setelah agent selesai coding**, review perubahan:
   ```bash
   cd project-directory
   crit
   ```
   (auto-detect branch diff)

3. **Review code di browser:**
   - Lihat file-by-file diff
   - Klik baris kode untuk komentar
   - Cek: apakah ada code yang tidak sesuai spec?
   - Cek: apakah ada bug potensial?
   - Cek: apakah ada missing edge case?

4. **Beri komentar:**
   - *"Baris 47-52: fungsi ini perlu validasi input"*
   - *"File ini tidak perlu, sudah ada fungsi serupa di utils.ts"*
   - *"Tambah unit test untuk edge case ini"*

5. **Iterasi:** Agent perbaiki → review lagi → sampai kode bersih.

---

### FASE 5: Review Aplikasi Live

**Tujuan:** Memastikan aplikasi berjalan dengan benar secara visual dan fungsional.

**Langkah-langkah:**

1. **Jalankan dev server:**
   ```bash
   pnpm dev  # atau perintah sesuai project
   ```

2. **Review aplikasi live dengan Crit:**
   ```bash
   crit http://localhost:5173
   ```

3. **Beri komentar dengan klik elemen:**
   - Klik tombol yang tidak berfungsi
   - Klik teks yang typo
   - Klik layout yang berantakan
   - Tambah komentar: *"Tombol ini tidak align dengan input di atasnya"*

4. **Iterasi:** Agent perbaiki → refresh browser → review lagi.

---

### Ringkasan Workflow Lengkap

```
FASE 1: PRD
    Prompt: "Buat PRD untuk fitur X"
    Crit:   crit docs/PRD.md
    ↓ ACCEPTED

FASE 2: User Flow
    Prompt: "Buat user flow dari PRD"
    Crit:   crit docs/user-flow.md
    ↓ ACCEPTED

FASE 3: Technical Design
    Prompt: "Buat tech spec dari PRD + user flow"
    Crit:   crit docs/tech-spec.md
    ↓ ACCEPTED

FASE 4: Implementation
    Prompt: "Implementasi berdasarkan tech spec"
    Crit:   crit (auto branch diff)
    ↓ ACCEPTED

FASE 5: Live Review
    Crit:   crit http://localhost:5173
    ↓ ACCEPTED

🚀 SHIP!
```

---

## Panduan Perintah Crit

### Perintah Dasar

```bash
# Review file/dokumen (Markdown, code, dll)
crit path/to/file.md

# Review branch diff (auto-detect)
crit

# Review GitHub PR
crit --pr 123

# Review commit range
crit --range main..feature

# Review aplikasi live
crit http://localhost:5173

# Review file HTML statis
crit path/to/output.html
```

### Mengelola Komentar

```bash
# Komentar umum (review-level)
crit comment --author 'NamaAgent' 'Pesan komentar'

# Komentar untuk satu file (file-level)
crit comment --author 'NamaAgent' path/to/file.ts 'Pesan komentar'

# Komentar untuk baris spesifik (line-level)
crit comment --author 'NamaAgent' path/to/file.ts:42 'Pesan komentar'

# Komentar untuk range baris
crit comment --author 'NamaAgent' path/to/file.ts:42-47 'Pesan komentar'

# Membalas komentar
crit comment --reply-to <comment-id> --author 'NamaAgent' 'Pesan balasan'
```

### Bulk Comments (3+ komentar)

```bash
# Via file JSON
crit comment --json --file /tmp/comments.json --author 'NamaAgent'
```

Format file JSON:
```json
[
  {
    "path": "src/components/Button.tsx",
    "line": 15,
    "body": "Ganti warna primary jadi biru"
  },
  {
    "path": "src/components/Button.tsx",
    "line": 22,
    "body": "Tambah loading state"
  },
  {
    "scope": "review",
    "body": "Overall bagus, tapi perlu polish di bagian styling"
  }
]
```

### Sinkronisasi GitHub

```bash
# Pull komentar dari GitHub PR
crit pull 123

# Push komentar lokal ke GitHub PR
crit push --event comment -m "Review done!" 123
crit push --event approve 123
crit push --event request-changes 123
```

### Sharing Review

```bash
# Share review (upload ke crit.md)
crit share

# Share dengan QR code
crit share --qr

# Share dengan visibility tertentu
crit share --visibility public

# Unpublish review
crit unpublish
```

### Plan Mode

```bash
# Review plan spesifik
crit --plan nama-plan

# Comment dengan plan scope
crit comment --plan nama-plan --author 'Agent' 'Pesan'
```

---

## Studi Kasus Praktis

### Studi Kasus 1: Review PRD

**Situasi:** Anda minta Claude Code buat PRD untuk fitur "Dark Mode".

**Prompt ke agent:**
```
Buat PRD untuk fitur Dark Mode di docs/prd-dark-mode.md.
Format: Latar Belakang, Tujuan, Scope, Spesifikasi, Metrik.
```

**Review:**
```bash
crit docs/prd-dark-mode.md
```
Browser terbuka → Anda lihat PRD.

**Komentar yang bisa diberikan:**
- Di baris "Scope: Semua halaman" → komentar: *"Scope sebaiknya dibatasi ke halaman utama dulu, dashboard dan settings bisa di fase 2"*
- Di baris "Metrik: User engagement" → komentar: *"Tambah metrik: waktu penggunaan fitur dark mode per user"*

**Agent akan:** Membaca komentar → memperbaiki PRD → siap untuk review round 2.

---

### Studi Kasus 2: Review Code

**Situasi:** Agent selesai implementasi fitur "User Profile Page".

**Review:**
```bash
cd project/
crit
```
Browser terbuka dengan daftar file yang berubah.

**Komentar yang bisa diberikan:**
- Di baris `const UserProfile = () => {` → *"Tambahkan loading skeleton"*
- Di baris `await fetch('/api/user')` → *"Tambah error handling, kalau network error gimana?"*
- Di baris `<img src={avatar} />` → *"Tambah fallback image kalau avatar null"*

---

### Studi Kasus 3: Review Aplikasi Live

**Situasi:** Agent menjalankan frontend di `localhost:5173`.

**Review:**
```bash
crit http://localhost:5173
```
Browser Crit menampilkan aplikasi Anda. Klik elemen langsung.

**Komentar yang bisa diberikan:**
- Klik tombol "Save" yang tidak sejajar → *"Tombol ini perlu 8px margin-top"*
- Klik teks yang typo → *"Typo: seharusnya 'Welcome'"*
- Klik card yang tidak responsive → *"Card ini overflow di viewport 320px"*

---

## Tips & Best Practices

### Untuk Reviewer (Anda)

1. **Spesifik dalam komentar**
   - ❌ "Ini kurang bagus"
   - ✅ "Ganti algoritma sorting dari bubble sort ke quick sort di baris 42"

2. **Review dalam batch**
   - Kumpulkan 3-5 komentar dulu, baru kirim ke agent
   - Gunakan `crit comment --json` untuk banyak komentar

3. **Gunakan anchor, bukan nomor baris**
   - Agent lebih mudah mencari konten daripada nomor baris yang bisa berubah

4. **Review plan dulu, baru code**
   - PRD → User Flow → Tech Spec → Code
   - Jangan langsung coding sebelum plan disetujui

5. **Satu round review = satu fokus**
   - Round 1: Arsitektur
   - Round 2: Implementasi detail
   - Round 3: Styling/Polish

### Untuk Agent (AI)

1. **Jangan auto-resolve komentar**
   - Tunggu instruksi eksplisit dari user
   - Hanya tandai resolved jika user bilang "done"

2. **Baca review file sebagai source of truth**
   - Jangan andalkan ingatan percakapan
   - Selalu cek file review JSON untuk status komentar

3. **Tanya jika ada yang tidak jelas**
   - Jika komentar "Ganti warna", tanya: "Warna apa yang diinginkan?"

4. **Iterasi bertahap**
   - Jangan coba selesaikan semua komentar sekaligus jika terlalu banyak
   - Selesaikan 2-3 komentar, lalu minta review lagi

---

## Troubleshooting

### Masalah Umum

| Masalah | Solusi |
|---------|--------|
| **Browser tidak terbuka** | Jalankan `crit` dengan `--print` untuk lihat output di terminal |
| **Port sudah dipakai** | Crit pilih port otomatis. Cek terminal untuk URL-nya |
| **File review tidak ditemukan** | Pastikan path file benar |
| **Agent tidak membaca komentar** | Pastikan agent punya skill `crit` atau `crit-cli` |
| **Double komentar di beberapa file** | Gunakan `--path` untuk disambiguasi file |
| **Nomor baris berubah setelah edit** | Crit punya `anchor` — cari konten, bukan nomor baris |

### Cek Instalasi

```bash
crit --version
ls ~/.agents/skills/crit/
ls ~/.agents/skills/crit-cli/
cat ~/.claude/settings.json | grep crit
ls ~/.config/opencode/plugins/crit.ts
```

### Reset / Uninstall

```bash
# Hapus file review
rm -rf ~/.crit/

# Hapus skill dari agent tertentu
rm -rf ~/.vibe/skills/crit ~/.vibe/skills/crit-cli
rm -rf ~/.openclaude/skills/crit ~/.openclaude/skills/crit-cli
rm -rf ~/.pi/agent/skills/crit ~/.pi/agent/skills/crit-cli

# Hapus dari Claude Code plugin
# Edit ~/.claude/settings.json, hapus entri crit
```

---

## Referensi

- **Website Crit:** [https://crit.md](https://crit.md)
- **GitHub Repo:** [https://github.com/tomasz-tomczyk/crit](https://github.com/tomasz-tomczyk/crit)
- **Binary terinstall di:** `~/bin/crit.exe`

---

> **Ingat:** Crit bukan pengganti komunikasi dengan agent — Crit adalah alat untuk membuat komunikasi lebih presisi.
> Gunakan Crit di setiap fase pengembangan: **Rencanakan → Review → Iterasi → Setuju → Lanjut**. 🚀
