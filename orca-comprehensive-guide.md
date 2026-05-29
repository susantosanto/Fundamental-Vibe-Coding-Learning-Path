# Panduan Lengkap Orca untuk Pemula

> **Orca** adalah aplikasi desktop gratis dan open source yang membantu kamu menjalankan banyak AI coding agent secara bersamaan. Bayangkan kamu punya 3 programmer AI yang bisa bekerja paralel, masing-masing di ruang kerja sendiri-sendiri, dan kamu bisa lihat semuanya dari satu layar.

---

## 📖 Daftar Isi

1. [Orca Itu Apa Sih?](#1-orca-itu-apa-sih)
2. [Cara Install](#2-cara-install)
3. [Istilah-Istilah Penting](#3-istilah-istilah-penting)
4. [Cara Pakai Orca (Langkah Demi Langkah)](#4-cara-pakai-orca-langkah-demi-langkah)
5. [Bekerja dengan Agent AI](#5-bekerja-dengan-agent-ai)
6. [Review dan Mengirim Kode](#6-review-dan-mengirim-kode)
7. [Browser & Design Mode](#7-browser--design-mode)
8. [Terminal](#8-terminal)
9. [Remote & SSH (Mesin Jarak Jauh)](#9-remote--ssh-mesin-jarak-jauh)
10. [Fitur Automations (Jadwal Otomatis)](#10-fitur-automations-jadwal-otomatis)
11. [CLI Orca (Perintah dari Terminal)](#11-cli-orca-perintah-dari-terminal)
12. [Mobile & Notifikasi](#12-mobile--notifikasi)
13. [Resep-Resep Berguna](#13-resep-resep-berguna)
14. [Tahapan Membangun Aplikasi dari Nol](#14-tahapan-membangun-aplikasi-dari-nol)
15. [Referensi Cepat](#15-referensi-cepat)

---

## 1. Orca Itu Apa Sih?

Orca itu **tempat kerja untuk AI coding agent**. Coba bayangin:

Kamu mau bikin fitur baru di aplikasi. Biasanya kamu:
1. Bikin branch baru
2. Coding sendiri
3. Stash kalau mau ganti task
4. Ribet kalau mau cobain 2 pendekatan berbeda

**Dengan Orca:**
1. Klik tombol ➕ → tulis task name → pilih AI agent → **beres!**
2 Setiap task punya folder sendiri, branch sendiri, AI agent sendiri
3 Kalau mau cobain 3 pendekatan berbeda → bikin 3 worktree → jalanin 3 agent → pilih yang terbaik

### 🔥 Kapan Harus Pakai Orca?

- ✅ Mau 3 agent AI mengerjakan bug yang sama, pilih hasil terbaik
- ✅ Mau review kode hasil AI secara serius sebelum di-commit
- ✅ Punya langganan Claude Code, Codex, atau Cursor CLI, mau atur dari satu tempat
- ✅ Mau agent jalan di server remote (SSH) tapi tetap ngerjain dari laptop

### ❌ Yang BUKAN Orca

- ❌ **Bukan AI model** — Orca cuma "rumah"-nya. AI agent-nya (Claude, Codex, dll) tetap punya langganan masing-masing
- ❌ **Bukan pengganti git** — setiap worktree adalah `git worktree` beneran. Kamu bisa `cd` masuk dan pake git biasa
- ❌ **Bukan cloud-only** — Orca jalan di laptop kamu. Kalau mau remote, pake SSH ke server punya kamu sendiri

---

## 2. Cara Install

### 📥 Download

| Sistem Operasi | Cara Install |
|----------------|--------------|
| **macOS** | Bisa download DMG dari GitHub, atau pake Homebrew |
| **Windows** | Download dari [GitHub Releases](https://github.com/stablyai/orca/releases) |
| **Linux** | AppImage atau `.deb` |

### 🍺 macOS via Homebrew (Terminal)

```bash
# Install
brew install --cask orca

# Upgrade nanti-nanti
brew upgrade --cask orca
```

### 🚀 Pertama Kali Jalan

Pas pertama buka, Orca bakal:
1. Minta izin akses folder rumah kamu (biar bisa tambah repo)
2. Nawarin import setting dari `~/.claude` (buat Claude Code) dan Ghostty terminal
3. Nampilin layar kosong — tinggal tambah repo pertama kamu

### 🔄 Update Orca

Orca update otomatis secara default (stable channel). Kalau mau coba fitur baru yang masih RC (Release Candidate):

- **Hold Shift** sambil klik **Check for Updates** — nanti bakal include versi RC
- Atau download langsung dari [GitHub Releases](https://github.com/stablyai/orca/releases)

### ⚠️ Catetan per Platform

- **macOS**: Sudah di-sign dan notarized. Pas pertama buka, macOS mungkin minta konfirmasi — itu normal buat app berbasis Electron
- **Windows**: Shell bawaan bisa diatur ke PowerShell atau CMD di **Settings → Terminal**
- **Linux**: Ada AppImage sama `.deb`

---

## 3. Istilah-Istilah Penting

Sebelum mulai, pahami dulu istilah-istilah ini:

### 📂 Worktree

**Worktree** itu = "ruang kerja" untuk satu task. Setiap worktree punya:
- Folder sendiri di disk
- Branch git sendiri
- Terminal sendiri
- Browser sendiri

Gampangnya: **1 task = 1 worktree**. Mau ngerjain 3 fitur beda? Bikin 3 worktree.

### 🤖 Agent

**Agent** itu = "programmer AI". Contohnya Claude Code, Codex, Cursor CLI. Kamu tinggal pilih agent apa yang mau dipake di setiap worktree.

### 🟢 Status Dot (Titik Status)

Di setiap tab ada titik kecil yang kasih tau status agent:
- 🟢 **Hijau (kedip-kedip)** — agent sedang bekerja
- 🟡 **Kuning** — agent nunggu input dari kamu
- ⚪ **Abu-abu** — agent lagi nganggur
- ⚫ **Gak ada titik** — itu terminal biasa, bukan agent AI

### 📑 Tab & Pane

- **Tab** = satu jendela kecil (bisa terminal, editor, browser, diff)
- **Pane** = area tempat tab berada
- **Split** = memecah layar jadi beberapa pane

Contoh: Kamu bisa punya terminal agent di kiri, browser di kanan atas, diff view di kanan bawah — semua kelihatan bareng.

---

## 4. Cara Pakai Orca (Langkah Demi Langkah)

### Langkah 1: Tambah Repository

Klik **Add Repo** di sidebar kiri. Arahkan ke folder project kamu. Orca bakal baca git repo kamu dan ambil branch utama sebagai **base ref** (branch acuan).

Base ref ini nantinya dipake sebagai titik awal setiap worktree baru.

### Langkah 2: Buat Worktree

Klik tombol **+** di sebelah nama repo. Sebuah jendela launcher akan terbuka.

**Isi yang diminta:**
- **Task name**: Nama tugas (misal "fitur-login"). Kalau dikosongin, Orca kasih nama random dari hewan laut 🐟
- **Agent**: Pilih AI agent yang mau dipake, atau pilih empty terminal kalau mau mulai manual
- **Start-from ref**: Pilih mau branching dari mana. Biasanya `origin/main` tapi bisa juga dari branch lain atau commit tertentu

**Yang terjadi:** Orca bikin real git worktree, checkout branch baru, dan siap kerja.

### Langkah 3: Pilih Agent

Di terminal worktree yang baru, ada **agent combobox** (kotak pilihan agent). Pilih agent AI yang kamu mau:
- Claude Code
- Codex
- Cursor CLI
- Atau agent lain yang sudah di-setup

Orca akan otomatis menjalankan agent CLI dengan working directory yang benar.

### Langkah 4: Jalankan Paralel (3 Agent Sekaligus!)

Ulangi Langkah 2-3 sebanyak 3 kali. Sekarang kamu punya 3 worktree:

| Worktree | Agent |
|----------|-------|
| `fitur-login` | Claude Code |
| `fitur-login-2` | Codex |
| `fitur-login-3` | Cursor CLI |

**Copy paste prompt yang sama ke ketiganya.** Tiga branch, tiga pendekatan, satu masalah. Biarkan mereka bekerja!

### Langkah 5: Split Pane Biar Bisa Liat Semua

Drag tab worktree ke pinggir pane buat split layar. Kamu bisa lihat 3 agent bekerja bareng. Seru kan? 😄

### Langkah 6: Pilih Pemenang, Review, Ship

Pas agent selesai:
1. Buka **diff viewer** tiap worktree (lihat perubahan kode)
2. Pilih yang hasilnya paling bagus
3. Pake **Annotate AI Diff** buat kasih komentar atau minta revisi
4. Commit → Push → Open PR — langsung dari Orca
5. Dua worktree lainnya tinggal di-delete — satu klik, branch ikut terhapus

---

## 5. Bekerja dengan Agent AI

### 5.1 Agent yang Didukung Orca

Orca support **24+ agent AI**. Yang paling populer:

| Agent | Level Integrasi | Cara Setup |
|-------|----------------|------------|
| **Claude Code** | Dalam (usage, hot-swap, hooks) | `npm i -g @anthropic-ai/claude-code` |
| **Codex** | Dalam (usage, hot-swap) | Install dari OpenAI |
| **Cursor CLI** | Dalam | Install dari Cursor |
| **Gemini** | Auto-setup | Install dari Google |
| **OpenCode** | Auto-setup | `npm i -g @anthropic-ai/claude-code` |
| **GitHub Copilot CLI** | Auto-setup | Install dari GitHub |
| **Cline** | Auto-setup | Install dari Cline |

**Auto-setup** artinya tinggal install, Orca otomatis detect.

### 5.2 Claude Code di Orca

Ini yang paling lengkap integrasinya.

**Setup:**
```bash
npm i -g @anthropic-ai/claude-code
```

Login sekali dari terminal biasa. Orca bakal otomatis baca setting dari folder `~/.claude`.

**Yang bisa dilakukan:**
- Launch Claude Code dari combobox — langsung pake folder worktree sebagai working directory
- Lihat status agent (working/idle) dari titik warna
- Lihat pemakaian token dan rate limit di status bar
- Ganti akun Claude dalam satu klik
- Pake hooks dan memory files (CLAUDE.md)

### 5.3 Custom CLI Agent (Tambah Agent Sendiri)

Punya agent AI lain yang mau dipake? Bisa ditambah sendiri.

**Caranya:**
1. Buka **Settings → Agents**
2. Klik **Add custom agent**
3. Isi:
   - **Nama** agent (misal "My AI")
   - **Perintah** untuk menjalankannya (misal `my-ai-cli`)
   - **Argumen default** (opsional)
   - **Startup hook** (opsional) — perintah yang dijalankan SEBELUM agent mulai. Contoh: `source .envrc`

**Yang kamu dapet:**
- Agent muncul di combobox semua terminal
- Working directory otomatis pake folder worktree
- Kalau agent-nya mati, ada tombol **Restart**
- Titik status (🟢🟡⚪) bakal muncul KALAU agent-nya emit sinyal OSC title

### 5.4 Agent Hooks & Memory

**Per-repo hooks:**
Orca baca setting `.claude/` dan `.codex/` di repo kamu. Hook yang sudah ada bakal jalan pas Orca launch agent.

**Worktree setup hooks:**
Kamu bisa setting perintah yang otomatis jalan SETELAH worktree dibuat. Contoh:
- `pnpm install` — install dependencies
- `direnv allow` — izinin environment variable
- `cp .env.example .env` — copy file environment

Setting di: **Settings → Repository → Hooks**

**Memory files:**
- `CLAUDE.md` — memory file buat Claude Code
- `AGENTS.md` — memory file buat Codex

Orca gak bakal ganggu file-file ini. Kamu bisa edit dari file explorer Orca seperti file biasa.

### 5.5 Melihat Pemakaian & Rate Limit

Orca bisa baca pemakaian token agent langsung dari file lokal:

| Agent | File yang Dibaca |
|-------|------------------|
| Claude Code | `~/.claude` |
| Codex | `~/.codex` |
| Gemini | Setting Gemini |
| OpenCode | Setting OpenCode |

**Yang ditampilkan di status bar:**
- ✅ Berapa banyak yang udah dipake vs batas plan
- ⏳ Waktu reset (5 jam, harian, mingguan)
- ⚠️ Peringatan kalau udah lewat 80%

**Multi-akun:** Status bar nunjukin akun yang aktif. Akun lain bisa dilihat di switcher.

---

## 6. Review dan Mengirim Kode

### 6.1 Diff Viewer (Melihat Perubahan)

Setiap worktree punya diff viewer bawaan. Ini buat lihat apa aja yang berubah dibandingkan start-from ref.

**Tombol pintas (shortcut):**

| Tombol | Fungsi |
|--------|--------|
| `j` / `k` | Loncat ke file berikutnya/sebelumnya |
| `n` / `p` | Loncat ke hunk (blok perubahan) berikutnya/sebelumnya |
| `s` | Stage hunk (tandai mau di-commit) |
| `c` | Mulai komentar (Annotate AI Diff) |

**Fitur keren:**
- ✅ **Combined diff** — semua perubahan (staged, unstaged, untracked) jadi satu
- ✅ **Line numbers** — bisa dihidupin/dimatikan
- ✅ **Image diffs** — side-by-side, swipe, onion-skin buat gambar
- ✅ **Merge-conflict UI** — tampilan 3 arah + resolusi inline
- ✅ **Staging by hunk** — sama kayak `git add -p` tapi pake visual

**Scoping:**
Default-nya nampilin perubahan sejak start-from ref. Bisa ganti ke:
- Commit tertentu
- Branch tertentu
- Base ref

### 6.2 Annotate AI Diff (Review Loop)

Ini fitur buat ngasih feedback ke agent AI. Kamu tinggal kasih komentar di baris kode tertentu, kirim semua komentar sekaligus, dan agent bakal revisi.

**Caranya:**
1. Arahkan mouse ke baris kode di diff → muncul **+** di gutter (pinggir kiri)
2. Klik **+** (atau tekan `c`)
3. Ketik feedback kamu (Markdown bisa dipake)
4. `Cmd-Enter` untuk simpan, `Esc` untuk batal
5. Kalau udah selesai review semua, klik **Send to agent**
6. Orca bikin satu prompt yang berisi SEMUA komentar kamu + lokasi barisnya, lalu kirim ke agent
7. Agent revisi — komentar tetap nempel biar kamu bisa verifikasi
8. Klik **Resolve** kalau udah oke

**Kenapa dikirim sekaligus (batch)?**
Kalau komentar dikirim satu-satu, agent bakal bolak-balik. Lebih efisien kalau dikirim semua sekaligus — agent mikir sekali, revisi sekali.

### 6.3 Attribution (Asal-Usul Kode)

Orca bisa nandain baris kode mana yang ditulis AI dan mana yang ditulis manusia.

**Cara kerjanya:**
- Pas agent nulis file, Orca catet baris-barisnya
- Di diff viewer, baris AI dikasih tanda kecil di gutter
- Kalau kamu edit manual di atas kode AI, tandanya balik ke "human"

**Kenapa penting:**
- Kamu tau bagian mana yang perlu diperiksa lebih teliti
- Cocok buat audit keamanan
- Review jadi lebih cepat — gak usah baca ulang kode yang kamu tulis sendiri

**Catatan:** Attribution cuma lokal di Orca, gak ikut ke git.

### 6.4 Commit & Push

**Commit (Menyimpan Perubahan):**
1. Stage perubahan — pake `s` di diff atau dari Source Control panel
2. Tulis pesan commit di panel bawah
3. Atau klik **Generate with AI** biar Orca bikin pesan otomatis
4. Tekan **Commit** (`Cmd-Enter`)

Pre-commit hooks dari repo tetap jalan. Kalau gagal, output-nya muncul langsung.

**Kalau commit gagal:** Klik **Fix with AI** — Orca bakal jalanin agent dengan konteks error-nya.

**Push (Mengirim ke Server):**
- Tekan **Push** — Orca push ke `origin`
- Kalau branch ketinggalan, Orca gak bakal force-push. Kamu harus rebase atau merge dulu

**Amend (Memperbaiki Commit Terakhir):**
- Explicit — klik **Commit → Amend**
- Orca gak bakal amend commit yang udah di-push tanpa konfirmasi

**Source Control Panel (Sidebar):**
- Stage, discard file, tulis pesan commit
- Tombol: Commit, Push, Pull, Sync
- Kalau ada merge conflict, ada tombol **Resolve with AI**

### 6.5 Integrasi GitHub

**Hubungkan ke GitHub:**
1. Buka **Settings → Integrations**
2. Pilih provider (GitHub, GitLab, Bitbucket, Gitea, Azure DevOps)

**Yang bisa dilakukan:**
- **Buat PR** — dari Source Control setelah push
- **Link PR** — sidebar nunjukkin status PR (open/merged/closed)
- **Cek GitHub Actions** — hasil check muncul inline, log bisa dibaca
- **Fix broken checks** — dari tampilan PR, kasih ke agent buat diperbaiki
- **Browse issues** — liat, filter, edit GitHub/GitLab issues
- **GitHub Projects** — liat project cards di sidebar **Tasks**

---

## 7. Browser & Design Mode

### 7.1 Browser Per Worktree

Setiap worktree punya **browser sendiri** — Chromium beneran yang nempel di pane Orca.

**Tombol pintas:**

| Tombol | Fungsi |
|--------|--------|
| `Cmd-F` | Cari di halaman |
| `Cmd-T` | Tab baru (masih dalam worktree yang sama) |
| `Cmd-Shift-T` | Buka tab yang baru ditutup |

**Fitur-fitur:**
- ✅ Address bar dengan history dan saran URL
- ✅ Tombol back/forward/reload/stop
- ✅ **Import cookie dari Chrome/Edge** — satu klik, langsung login
- ✅ **Viewport emulation** — ganti ukuran layar buat test responsive design
- ✅ **Bisa dikontrol agent AI** — via CLI (`orca snapshot`, `orca click`, `orca fill`)

### 7.2 Design Mode (Mode Desain)

Ini fitur paling keren buat frontend developer!

**Design Mode** mengubah browser Orca jadi alat "klik → feedback → fix". Kamu tinggal klik elemen di halaman, dan elemen itu otomatis dikirim ke agent AI sebagai konteks.

**Caranya:**
1. Buka browser pane → navigasi ke halaman yang mau diperbaiki
2. Klik toggle **Design Mode** di toolbar browser
3. Kursor kamu berubah jadi pointer 🎯 — arahkan ke elemen yang salah
4. **Klik elemen** → Orca capture:
   - HTML elemen (plus sedikit sekitar-nya)
   - CSS yang dipake (warna, font, spacing)
   - Screenshot elemen yang dipotong
   - File sumber + baris (kalau ada source map)
5. Semua itu masuk ke terminal agent sebagai SATU attachment
6. **Ketik perintah:** "padding-nya terlalu rapat, ganti biar sama kayak card di atas"
7. Agent edit kode → Orca hot-reload → browser refresh
8. Klik lagi elemen yang sama buat verifikasi

**Kenapa ini cepet banget:** Gak perlu screenshot manual, gak perlu cari DOM, gak perlu copy selector. Agent dapet konteks yang sama kayak yang kamu lihat.

### 7.3 Browser-Use Profiles

Profile browser = identitas terpisah (cookies, user-agent, ukuran layar).

**Buat profile:**
1. Buka **Settings → Browser → Profiles**
2. Klik **Add profile**, kasih nama
3. Opsional: seed dengan cookies, user-agent, dan ukuran viewport

**Pake profile:**
Pilih dari toolbar browser. Semua tab di pane itu pake profile tersebut sampai kamu ganti.

**Isolasi:** Setiap profile punya storage sendiri — cookies, local storage, cache. Profile gak bocor ke profile lain.

---

## 8. Terminal

Terminal Orca itu pake teknologi yang sama kayak VS Code (xterm.js), tapi ada tambahan khusus buat AI agent.

### 8.1 Fitur Terminal

- ✅ **Pane & tabs** — terminal juga tab. Split buat 2 shell bersebelahan
- ✅ **Search di scrollback** — `Cmd-F`, bisa pake regex
- ✅ **Themes** — banyak tema bawaan, bisa kustom (Settings → Terminal)
- ✅ **Import dari Ghostty** — bisa ambil tema, font, cursor dari Ghostty
- ✅ **Windows shell** — pilih PowerShell, CMD, atau WSL
- ✅ **WSL support** — otomatis detect `wsl.exe`, translate path ke `/mnt/...`
- ✅ **Kitty keyboard protocol** — `Shift+Enter`, `Ctrl+Enter`, shortcut lainnya jalan normal

### 8.2 Floating Terminal

Terminal "ngambang" yang bisa dipanggil kapan aja, dari worktree mana pun.

- **Toggle:** `Cmd+Option+A` (macOS) / `Ctrl+Alt+A` (Windows/Linux)
- **Pencet lagi:** fokus kalau udah kebuka, nutup kalau udah fokus
- Bisa punya tab sendiri
- Cocok buat jalanin background task (misal `npm run dev`) tanpa ganggu pane worktree

### 8.3 Quick Commands

Simpan perintah yang sering kamu pake, terus jalankan dengan satu klik.

Contoh:
- `npm run dev`
- `pnpm test`
- `python manage.py migrate`

**Cara bikin:**
1. Buka **Settings → Quick Commands**
2. Klik **Add command**
3. Isi label, perintah, dan scope:
   - **Global** — muncul di semua repo
   - **Project** — muncul cuma di repo tertentu

**Jalankan:** Dari tombol Quick Commands di tab bar, atau dari context menu terminal.

---

## 9. Remote & SSH (Mesin Jarak Jauh)

Orca bisa jalanin agent di server remote (VPS, GPU box, cloud server). Semua kerasa kayak lokal.

### 9.1 Setup SSH

1. Buka **Settings → SSH**
2. Klik **Add target**
3. Isi:
   - **Host**: alamat server (misal `192.168.1.100`)
   - **User**: username SSH
   - **Port**: port SSH (default 22)
   - **Identity file**: file kunci SSH (opsional)
4. Klik **Test** untuk cek koneksi
5. Orca juga bisa import host dari file `~/.ssh/config`

Kalau kunci SSH dipassword, Orca bakal nanya pas pertama kali.

### 9.2 Pakai SSH Target

Pas bikin worktree baru, pilih **SSH target** bukan **Local**:
1. Orca bikin git worktree di server remote
2. Agent jalan di server remote (pake CPU/GPU server!)
3. File events sync — editor, diff, browser tetep terasa lokal
4. Kamu bisa edit file kaya biasa

**Yang keren:**
- Laptop kamu tidur, WiFi putus → **agent tetap jalan di server**
- Orca reconnect otomatis pas koneksi balik
- Status agent (working/idle) tetep kelihatan real-time

### 9.3 Port Forwarding

Butuh akses ke service yang jalan di server? Misal web server di port 3000.

1. Buka **Ports** tab di sidebar kanan (`Cmd+Shift+I`)
2. Orca otomatis detect port yang lagi listening di server
3. Satu klik → port di-forward ke laptop kamu
4. Contoh: port 3000 remote → `localhost:3000` di laptop

Kalau port remote pake port privileged (misal 80), Orca otomatis remap (misal → `localhost:10080`).

---

## 10. Fitur Automations (Jadwal Otomatis)

Ini fitur penting! **Automations** memungkinkan kamu menjadwalkan agent AI untuk mengerjakan task secara otomatis pada waktu tertentu. Mirip cron job tapi pake AI.

### 10.1 Automations Itu Untuk Apa?

Bayangin skenario ini:

**Daily Standup Automation**
```bash
Setiap jam 09:00 pagi, agent otomatis:
1. Buka repo project
2. Cek issue baru yang masuk semalam
3. Summarize perubahan kemarin
4. Tulis status update
```
Kamu tinggal baca hasilnya pas selesai. ✅

**Skenario Lain:**
| Automation | Kegunaan |
|------------|----------|
| **Weekly code review** | Setiap Jumat jam 16:00, agent review PR yang belum di-review |
| **Nightly build check** | Setiap malam jam 23:00, agent cek hasil build dan laporkan error |
| **Dependency update** | Setiap Senin, agent cek dependency yang outdated dan bikin PR update |
| **Bug triage** | Setiap hari, agent kategorisasi issue baru dan assign priority |
| **Test monitoring** | Setiap jam, agent cek test hasil dan laporkan yang fail |

### 10.2 Cara Membuat Automation

Pertama, pastiin Orca CLI sudah terdaftar di **Settings → Experimental → CLI**.

**Buat automation sederhana:**
```bash
orca automations create \
  --name "Triage Harian" \
  --trigger weekdays \
  --time 09:00 \
  --prompt "Lihat issue baru di repo ini, kelompokkan mana yang urgent dan mana yang bisa ditunda. Tulis summary singkat." \
  --provider claude \
  --repo my-repo \
  --json
```

Perintah di atas bikin automation yang:
- Nama: "Triage Harian"
- Jalan: Setiap hari kerja (Senin-Jumat) jam 09:00
- Agent: Claude Code
- Target: Repo "my-repo"
- Prompt: Nanya issue baru dan kategorisasi

### 10.3 Trigger (Jadwal)

Orca support beberapa jenis jadwal:

**Preset (Gampang):**
```
hourly    → setiap jam
daily     → setiap hari jam tertentu
weekdays  → setiap hari kerja jam tertentu
weekly    → setiap minggu
```

**Cron expression (Advanced):**
```bash
--trigger "0 18 * * 1-5"   # Setiap hari kerja jam 18:00
--trigger "0 0 * * 1"       # Setiap Senin jam 00:00
--trigger "*/30 * * * *"    # Setiap 30 menit
```

**Timezone:**
```bash
--timezone Asia/Jakarta   # Biar jadwal pake WIB
```

### 10.4 Target: Repo vs Worktree

Automation bisa jalan di dua tempat:

**Di Repo (bikin worktree baru setiap kali):**
```bash
orca automations create \
  --name "Weekly Review" \
  --trigger weekly \
  --time "15:00" \
  --prompt "Review semua PR yang belum direview dan kasih komentar" \
  --provider codex \
  --repo id:abc123 \
  --disabled \
  --json
```

Setiap minggu, Orca bikin worktree baru, jalanin agent, lalu lapor hasilnya.

**Di Worktree yang Sudah Ada (pake worktree yang sama terus):**
```bash
orca automations create \
  --name "Nightly Status" \
  --trigger "0 18 * * 1-5" \
  --prompt "Summarize today's changes" \
  --provider claude \
  --workspace active \
  --disabled
```

Agent jalan di worktree yang lagi aktif.

**Reuse Session:** Kalau automation pake `--workspace`, kamu bisa tambah `--reuse-session`. Artinya, setiap kali automation jalan, dia LANJUTIN di terminal yang sama (bukan mulai dari blank tiap kali). Berguna kalau agent perlu ingat konteks sesi sebelumnya.

### 10.5 Review dan Jalankan Automation

**Lihat semua automation:**
```bash
orca automations list --json
```

**Lihat detail:**
```bash
orca automations show <automationId> --json
```

**Edit automation:**
```bash
orca automations edit <automationId> --enabled --json   # Aktifkan
orca automations edit <automationId> --disabled --json  # Nonaktifkan
```

**Jalankan manual (tanpa nunggu jadwal):**
```bash
orca automations run <automationId> --json
```

Ini berguna buat test prompt dan target automation sebelum dijadwalkan.

**Lihat history:**
```bash
orca automations runs --id <automationId> --json
```

### 10.6 Contoh Automation Lengkap

**1. Automation Harian untuk Cek Kesehatan Project:**
```bash
orca automations create \
  --name "Daily Health Check" \
  --trigger weekdays \
  --time 08:00 \
  --prompt "Cek repo ini:
1. Ada issue baru yang butuh perhatian?
2. Ada PR yang sudah lama belum di-review?
3. Ada test yang fail?
4. Tulis summary dalam 3-5 poin" \
  --provider claude \
  --repo my-project \
  --timezone Asia/Jakarta \
  --json
```

**2. Automation Mingguan untuk Dependency:**
```bash
orca automations create \
  --name "Dependency Check" \
  --trigger weekly \
  --time "10:00" \
  --prompt "Cek file package.json:
1. Library apa yang outdated?
2. Mana yang butuh major version update?
3. Mana yang Cuma patch?
4. Rekomendasi update mana yang aman dilakukan" \
  --provider codex \
  --repo my-project \
  --disabled \
  --json
```

**3. Automation dengan Reuse Session:**
```bash
orca automations create \
  --name "Inbox Cleanup" \
  --trigger hourly \
  --prompt "Cek dan bersihkan issue yang sudah selesai, tutup yang duplicate" \
  --provider codex \
  --workspace active \
  --reuse-session \
  --disabled
```

### 10.7 Tips Automation

1. **Mulai dengan `--disabled`** — bikin dulu, tes jalanin manual, kalau ok baru diaktifin
2. **Prompt harus jelas** — makin jelas prompt, makin bagus hasilnya
3. **Pake timezone** — biar jadwal sesuai waktu lokal kamu
4. **Cek history** — `orca automations runs` buat lihat apakah automation berjalan dengan baik
5. **Jangan terlalu sering** — automation tiap 5 menit bisa boros token AI

---

## 11. CLI Orca (Perintah dari Terminal)

Selain pake mouse, Orca juga bisa dikontrol dari terminal biasa. Ini berguna kalau kamu mau bikin script otomatis.

### 11.1 Setup CLI

Buka **Settings → Experimental → CLI** dan daftarkan. Cek:
```bash
orca status --json
```

### 11.2 Perintah Worktree

```bash
# Lihat semua worktree
orca worktree ps --json

# Bikin worktree baru
orca worktree create --repo id:<repoId> --name tugas-saya --json

# Lihat worktree yang lagi aktif
orca worktree current --json

# Kasih catatan ke worktree
orca worktree set --worktree active --comment "lagi ngerjain fitur login" --json

# Hapus worktree
orca worktree rm --worktree id:<id> --json
```

### 11.3 Perintah Terminal

```bash
# Kirim teks ke terminal agent
orca terminal send --text "lanjutkan" --enter --json

# Tunggu sampe agent selesai
orca terminal wait --for tui-idle --timeout-ms 30000 --json

# Bikin terminal baru di worktree
orca terminal create --worktree path:/projects/app --command "npm test" --json

# Split terminal
orca terminal split --direction vertical --command "npm run dev" --json
```

### 11.4 Perintah Browser

```bash
# Buka URL
orca goto --url https://example.com --json

# Screenshot
orca snapshot --json

# Klik elemen
orca click --element @e3 --json

# Isi form
orca fill --element @e1 --value "user@example.com" --json
```

### 11.5 Computer Use (Kontrol Desktop)

Agent AI bisa mengontrol aplikasi desktop lain! Misalnya:
- Buka Spotify, pencet play
- Isi form di aplikasi Windows
- Screenshot app lain

**Pertama, cek izin:**
```bash
orca computer permissions --json
```

**Cara pake:**
```bash
# Lihat app yang berjalan
orca computer list-apps --json

# Lihat state app (apa aja tombolnya)
orca computer get-app-state --app com.spotify.client --json

# Klik tombol tertentu
orca computer click --app com.spotify.client --element-index 42 --json
```

**Kegunaan:**
- Testing aplikasi desktop secara otomatis
- Mengisi form di app lain
- Screenshot dan analisis UI

---

## 12. Mobile & Notifikasi

### 12.1 Mobile Companion (Aplikasi HP)

Orca punya aplikasi iOS/Android yang bisa pairing dengan desktop kamu. Fungsinya buat **monitoring**.

**Yang bisa dilakukan dari HP:**
- ✅ Lihat status semua worktree (working/done/waiting)
- ✅ Baca scrollback terminal (ngapain aja agent-nya)
- ✅ Copy-paste teks
- ✅ Kirim reply: `continue`, `yes`, atau ketik bebas
- ✅ Bisa voice dictation (ngomong → agent)
- ✅ Stage/unstage/commit dari HP
- ✅ Ganti akun agent
- ✅ Dapat push notification

**Cara pairing:**
1. Di desktop, buka pairing flow dari menu account
2. Orca nampilin kode pairing (berlaku beberapa menit)
3. Di HP, buka app Orca → pilih **Pair**
4. Masukkan kode → langsung terhubung

**Catatan:** Komunikasi langsung desktop-HP (P2P), gak lewat cloud. Kalau desktop ditutup, koneksi putus. Buka desktop lagi, HP reconnect otomatis.

### 12.2 Notifikasi

Orca tau kapan agent selesai kerja, bukan cuma "lagi istirahat" (idle).

**Jenis notifikasi:**
- 🔔 **System notification** — muncul di OS
- 🔊 **Sound** — bunyi pas agent selesai
- 🔴 **Chip di worktree** — tanda di sidebar

**Bell di header:** Klik bell → lihat semua notifikasi → klik salah satu → langsung loncat ke worktree itu.

**Dock badge (macOS):** Angka di icon Orca kasih tau ada berapa notifikasi yang belum dibaca.

**Custom sounds:** Kamu bisa ganti suara notifikasi dengan file audio sendiri (MP3, WAV, OGG, M4A, AAC, FLAC). Setting di **Settings → Notifications**.

### 12.3 Agents Feed

Ini feed berisi semua aktivitas agent:
- ✅ Agent selesai kerja
- 🔴 Agent butuh bantuan (blocked)
- 🆕 Worktree baru dibuat
- 💬 Response preview

Bisa dibaca dari sidebar — kayak timeline semua agent.

---

## 13. Resep-Resep Berguna

### Resep 1: Balapan 3 Agent untuk Bug yang Sama

**Masalah:** Ada bug yang susah diperbaiki, gak tau pendekatan mana yang bener.

**Solusi Orca:**
1. Buat 3 worktree dari base ref yang sama
2. Masing-masing pake agent berbeda: Claude Code, Codex, Cursor CLI
3. Paste prompt yang sama ke ketiganya: "Fix bug di file X, gejalanya Y"
4. Split panes biar bisa liat mereka kerja bareng
5. Pas selesai, review diff masing-masing
6. Pilih yang paling bener → commit + push
7. Delete 2 worktree lainnya (satu klik, branch ikut hilang)

**Kenapa ini works:** Agent beda bikin mistake beda. Kalau 3 agent setuju, jawabannya pasti bener. Kalau beda, berarti itu bagian yang SUSAH dan perlu perhatian lebih.

### Resep 2: Fix UI Bug dengan Design Mode

**Masalah:** Tombol di halaman web kelihatan jelek, padding kurang, warna salah.

**Solusi Orca (kurang dari 1 menit!):**
1. Buka browser pane di worktree → navigasi ke halaman yang bermasalah
2. Toggle **Design Mode** ON
3. Klik elemen yang jelek
4. Ketik: "padding-nya tambahin jadi 16px, warna background-nya #f0f0f0"
5. Agent edit → hot-reload → browser refresh
6. Klik lagi elemennya buat verifikasi
7. Kalau oke → commit

**Kenapa cepet:** Gak perlu screenshot, gak perlu cari selector CSS, gak perlu buka DevTools. Agent dapet HTML + CSS + gambar elemen langsung.

### Resep 3: Kerja di Server Remote

**Masalah:** Mau pake GPU server buat development tapi gak mau ninggalin IDE.

**Solusi Orca:**
1. Setup SSH target di Settings → SSH
2. Buat worktree → pilih SSH target (bukan Local)
3. Agent jalan di server remote (GPU kenceng!)
4. Kamu edit file, review diff dari laptop
5. Laptop tidur → agent tetap jalan di server
6. Buka laptop lagi → Orca reconnect otomatis

**Port forwarding:** Butuh akses web server yang jalan di port 3000 remote? Buka **Ports** tab → satu klik → `localhost:3000` di laptop.

### Resep 4: Review Diff Baris Per Baris

**Masalah:** Agent udah selesai kerja, mau review hasilnya dengan teliti.

**Solusi Orca:**
1. Buka diff viewer di worktree
2. Attribution lines: yang ada tanda = AI-written, yang tanpa = human
3. `j`/`k` buat navigasi file, `n`/`p` buat navigasi hunk
4. `s` buat stage hunk yang udah oke
5. `c` buat kasih komentar di baris yang perlu direvisi
6. Klik **Send to agent** → agent revisi semua komentar
7. Verify → Resolve → selesai

---

## 14. Tahapan Membangun Aplikasi dari Nol

Ini panduan langkah demi langkah buat bikin aplikasi kompleks dari nol pake Orca.

### 🟢 Tahap 1: Persiapan

**Tujuan:** Setup project dan agent.

**Langkah:**
1. **Buat repo baru** (di GitHub/GitLab)
2. **Clone ke laptop**, lalu Add Repo di Orca
3. **Install agent yang mau dipake:**
   ```bash
   npm i -g @anthropic-ai/claude-code
   ```
4. **Buat memory file** di root repo:
   - `CLAUDE.md` — isi: deskripsi project, stack, aturan coding
   - Contoh isi: "Project ini pake Next.js 14, TypeScript, Prisma. Gak pake class component."
5. **Setup hooks** (opsional):
   - Settings → Repository → Hooks
   - Tambah: `pnpm install` (biar otomatis install dependencies pas bikin worktree baru)
6. **Setup SSH** (kalau butuh server remote) — Settings → SSH

**✅ Hasil:** Satu repo siap pakai + agent terkonfigurasi.

### 🟢 Tahap 2: Rencana Arsitektur

**Tujuan:** Mutusin gimana struktur aplikasi.

**Langkah:**
1. **Buat worktree "arsitektur"**
2. **Launch Claude Code** — minta analisis arsitektur: "Bikin desain arsitektur untuk e-commerce, pake Next.js + Prisma"
3. **Buat worktree "arsitektur-v2"**
4. **Launch Codex** — minta pendekatan alternatif: "Desain arsitektur alternatif pake microservices"
5. **Split panes** — liat kedua agent kerja bareng
6. **Review hasilnya** — mana yang lebih cocok
7. **Gabungin ide terbaik** dari keduanya
8. **Simpan keputusan**:
   ```bash
   orca worktree set --worktree active --comment "arsitektur: Next.js monolith dulu, microservices nanti" --json
   ```
9. **Hapus worktree yang kalah** — satu klik, semua beres

**✅ Hasil:** Keputusan arsitektur jelas dengan analisis dari 2 agent.

### 🟢 Tahap 3: Pecah Jadi Task-Task Kecil

**Tujuan:** Bikin banyak task yang bisa dikerjakan paralel.

**Contoh:**
```
fitur-auth        → Claude Code    (bikin login, register)
fitur-produk      → Codex           (bikin CRUD produk)
fitur-keranjang   → Cursor CLI      (bikin fitur keranjang)
```

**Langkah:**
1. **Buat 3 worktree** — masing-masing untuk 1 fitur
2. **Pilih agent berbeda** di masing-masing
3. **Tulis prompt spesifik** per fitur: "Bikin halaman login pake Next.js App Router, simpan session di cookies"
4. **Pantau progress** dari sidebar — titik hijau berarti lagi kerja
5. Kalau ada yang **kuning** (nunggu input) — buruan kasih jawaban

**Tips:**
- Fitur yang sharing model → bikin worktree "model" dulu, baru fitur worktree dari branch model
- Fitur independen → jalanin paralel semua dari base ref
- Fitur dependen → jalanin urut, pake start-from ref ke branch dependency

**✅ Hasil:** Banyak fitur dikerjakan paralel oleh agent berbeda.

### 🟢 Tahap 4: Development Sehari-Hari

**Tujuan:** Loop development cepat.

**Rutinitas Pagi:**
1. Cek **Agents Feed** — lihat apa yang beres semalam
2. Cek **Notifications** — ada agent yang minta tolong?
3. Buka worktree yang **kuning** — kasih input yang diminta
4. Buat worktree baru buat task hari ini

**Selama Ngoding:**
1. **UI work** → pake **Design Mode**:
   - Buka browser pane
   - Toggle Design Mode
   - Klik elemen → feedback → agent fix
   - Hot-reload → verify
2. **Backend work** → pake terminal + Quick Commands:
   - `Cmd-P` buat cari file cepat
   - Quick Commands buat `npm run dev` atau test
3. **Review code**:
   - Buka diff viewer
   - `n`/`p` jalanin hunk
   - `s` stage yang oke
   - `c` kasih komentar yang perlu revisi
   - **Send to agent** buat revisi batch

**Checkpoints:** Catat progress:
```bash
orca worktree set --worktree active --comment "selesai bikin halaman login, tinggal integrasi API" --json
```

**✅ Hasil:** Development cepat dengan loop: kerja → review → fix.

### 🟢 Tahap 5: Gabungin Semua Fitur

**Tujuan:** Gabungin hasil kerja dari semua worktree.

**Langkah:**
1. **Buat worktree "integrasi"** dari base ref
2. **Merge branch** dari setiap fitur:
   ```bash
   git merge fitur/auth
   git merge fitur/produk
   git merge fitur/keranjang
   ```
3. **Handle conflict** — Orca punya UI merge conflict 3 arah
4. Kalau conflict rumit, pake **Resolve with AI**
5. **Jalanin test** — pake Quick Command atau terminal biasa
6. **Buat worktree "bug-hunt"** — jalanin 3 agent paralel:
   - Prompt: "Cari bug di branch integrasi ini"
   - Bandingkan temuan mereka
7. **Fix bugs** — pake Annotate AI Diff

**✅ Hasil:** Semua fitur tergabung, konflik beres, test jalan.

### 🟢 Tahap 6: Review & Quality Check

**Tujuan:** Pastikan kode beneran bagus.

**Langkah:**
1. Buka **diff viewer** setiap worktree
2. **Attribution**: baris dengan tanda AI → periksa lebih teliti
3. **Annotate** setiap bagian yang perlu diperbaiki
4. Kirim batch comments ke agent
5. Verify hasil revisi → Resolve
6. **Cek usage tracking** — pastikan gak kena rate limit pas mau ship

**✅ Hasil:** Semua kode tereview dengan komentar terverifikasi.

### 🟢 Tahap 7: Ship ke Production

**Tujuan:** Commit, push, deploy.

**Langkah:**
1. **Stage by hunk** di diff viewer (tekan `s`)
2. **Generate AI commit message** biar otomatis
3. **Commit** (`Cmd-Enter`)
4. **Push** ke GitHub
5. **Open PR** — Orca otomatis deteksi branch, tinggal konfirm
6. **Cek GitHub Actions** — hasil check muncul di Orca
7. Kalau ada check yang **fail** → **Fix broken checks** → agent fix
8. **Merge PR** — dari Orca atau dari website GitHub
9. **Delete worktree** — satu klik, branch ikut terhapus

**✅ Hasil:** Fitur ter-deploy, PR ter-merge, worktree bersih.

### 🟢 Tahap 8: Maintenance Otomatis

**Tujuan:** Setup automation biarjalan terus tanpa kamu harus ingat.

**Langkah:**
1. **Setup Automation Harian:**
   ```bash
   orca automations create \
     --name "Daily Triage" \
     --trigger weekdays \
     --time 09:00 \
     --prompt "Cek issue baru, PR yang pending, test yang fail. Tulis summary." \
     --provider claude \
     --repo my-repo \
     --json
   ```

2. **Pair Orca Mobile** — biar bisa pantau dari HP
3. **Pipeline Bug Fix:**
   - Issue masuk → bikin worktree (auto-link issue)
   - Agent fix → review → commit → PR
   - Delete worktree → issue auto-close

**✅ Hasil:** Aplikasi jalan dengan maintenance otomatis.

### 🟢 Tahap 9: Scaling & Optimasi

**Tujuan:** Pake resource lebih besar buat project yang lebih kompleks.

**Langkah:**
1. **Setup SSH remote** buat heavy compute:
   - GPU server buat fitur AI/ML
   - Build server biar gak makan resource laptop
2. **Port forwarding** — akses service remote dari lokal
3. **Computer Use** — testing end-to-end
4. **Bikin skills** buat team:
   ```bash
   npx skills add https://github.com/stablyai/orca --skill orca-cli
   ```
5. **MCP servers** buat tools kustom — Setting → Integrations → MCP

**✅ Hasil:** Pipeline development scalable.

---

## 15. Referensi Cepat

### Tabel Workflow

| Tahap | Jumlah Worktree | Agent | Fitur Orca yang Dipake |
|-------|----------------|-------|----------------------|
| Persiapan | 1 | - | Settings, Agents, Hooks, SSH |
| Arsitektur | 2-3 | Claude, Codex | Parallel agents, Split panes, Checkpoints |
| Development | 3-8 | Bebas | Design Mode, Quick Open, Quick Commands |
| Integrasi | 1 | 1-3 | Merge conflict UI, Resolve with AI |
| Review | Per worktree | - | Diff viewer, Annotate, Attribution |
| Ship | 1 | - | Commit/Push, GitHub |
| Maintenance | 0-N | Claude | Automations, Mobile, Notifications |
| Scaling | 0-N | Bebas | SSH, Computer Use, MCP |

### Semua Shortcut Keyboard

| Shortcut | Fungsi |
|----------|--------|
| `Cmd-P` | Quick Open — cari file di worktree |
| `Cmd-J` | Jump Palette — loncat antar worktree/tab |
| `Cmd-T` | Tab terminal baru |
| `Cmd-W` | Tutup tab |
| `Cmd-\` | Split ke kanan |
| `Cmd-Shift-\` | Split ke bawah |
| `Cmd-F` | Cari di halaman / di terminal |
| `Cmd-Shift-F` | Cari di seluruh worktree |
| `Cmd-Enter` | Commit / Simpan komentar |
| `Cmd-Option-A` (Mac) / `Ctrl-Alt-A` (Win) | Floating terminal |
| `Cmd-Shift-I` | Ports tab (SSH) |
| `j` / `k` | Diff: file berikutnya/sebelumnya |
| `n` / `p` | Diff: hunk berikutnya/sebelumnya |
| `s` | Stage hunk (diff view) |
| `c` | Mulai komentar (Annotate AI Diff) |
| `Cmd-D` | Monaco: pilih kata yang sama berikutnya |

### Istilah Penting

| Istilah | Arti Gampang |
|---------|--------------|
| **Worktree** | Satu ruang kerja untuk satu task. Punya folder, branch, terminal sendiri |
| **Agent** | Programmer AI yang ngerjain task (Claude Code, Codex, dll) |
| **Base ref** | Branch acuan (biasanya `main` atau `origin/main`) |
| **Start-from ref** | Titik awal worktime branching |
| **Split** | Memecah layar jadi beberapa bagian |
| **Pane** | Satu bagian layar hasil split |
| **State dot** | Titik warna yang kasih tau status agent |
| **Diff** | Perubahan kode (sebelum vs sesudah) |
| **Hunk** | Satu blok perubahan dalam diff |
| **Stage** | Tandai perubahan yang mau di-commit |
| **Annotate** | Kasih komentar di baris kode tertentu |
| **Attribution** | Tanda apakah kode ditulis AI atau manusia |
| **Automations** | Task AI yang jalan otomatis sesuai jadwal |
| **Trigger** | Waktu/jadwal automation jalan |
| **Floating terminal** | Terminal "ngambang" yang bisa dipanggil kapan aja |
| **Quick Commands** | Tombol pintas buat perintah yang sering dipake |
| **Design Mode** | Mode klik-elemen → otomatis dikirim ke agent |
| **Computer Use** | Agent bisa kontrol app desktop lain |
| **Skills** | Paket perintah Orca yang bisa di-install ke agent |

---

> **Sumber:** Dokumentasi resmi Orca di [orcabuild.ai/docs](https://www.onorca.dev/docs)
>
> **Repo GitHub:** [github.com/stablyai/orca](https://github.com/stablyai/orca)
