# Prinsip 1: Prompt Skills, Bukan Claude

> **"Prompt Skills, Not Claude"**
> "Bangun Skills, jangan hanya menulis prompt baru setiap saat"

---

## 📖 Ringkasan Prinsip

**Kebanyakan orang** membuka Claude Code dan menulis prompt baru untuk setiap tugas yang mereka kerjakan. **Anthropic engineer tidak.** Mereka membangun **skills** — folder yang memberi tahu Claude cara mengerjakan tugas tertentu dengan cara yang SAMA setiap kali. Kemudian mereka memanggil skill tersebut dengan perintah slash (`/`).

---

## 🧩 Apa Itu "Skill" di Claude Code?

### Definisi dari Anthropic

> *"Skills are organized collections of files that package composable procedural knowledge for agents."*
>
> "Skills adalah kumpulan file terorganisir yang mengemas pengetahuan prosedural yang dapat digabungkan untuk agen AI."

**— Barry Zhang, Anthropic**

### Dalam Bahasa yang Lebih Sederhana

Dalam kata-kata Barry sendiri di sesi yang sama:

> *"In other words, they're folders. This simplicity is deliberate."*
>
> "Dengan kata lain, mereka hanyalah folder. Kesederhanaan ini disengaja."

### 🏗️ Struktur Skill

Sebuah skill hanyalah sebuah folder. Di dalamnya berisi:

```
nama-skill/
├── SKILL.md          # File instruksi utama (wajib)
├── script.py         # Script pendukung (opsional)
├── template.md       # Template referensi (opsional)
└── tools/            # Tools/pendukung lain (opsional)
```

---

## 🧠 Model Mental: 3 Lapisan

| Lapisan | Apa Itu | Siapa yang Membangun |
|---------|---------|---------------------|
| **Model** | AI itu sendiri (Claude Sonnet, Claude Opus, dll.) | **Anthropic** |
| **Agent + Prompts** | Runtime AI plus prompt kustom kamu | **Kamu (sebagian)** |
| **Skills** | Prosedur yang bisa diulang, berbasis folder | **Kamu. INI tempat kamu menciptakan nilai tambah.** |

### 🎯 Analogi Penting

> Barry Zhang membuat analogi sederhana:
> **Anthropic membangun teleponnya. Kamu yang membangun aplikasinya.**

Artinya:
- Anthropic menyediakan **mesin AI** yang canggih (ini setara dengan hardware smartphone)
- Kamu sebagai pengguna yang **membangun skills** (ini setara dengan aplikasi di smartphone)
- Makin bagus "aplikasi" (skills) yang kamu buat, makin kuat hasil yang bisa kamu capai

---

## 📂 Lokasi Folder Skills

Ada **dua tempat** di mana skills disimpan:

### 1️⃣ Global Skills — Tersedia di Semua Proyek

```
~/.claude/skills/
```

✅ Tersedia di **setiap sesi Claude Code**, di proyek mana pun di komputer kamu
⚠️ Selalu dimuat ke konteks (meskipun tidak digunakan)
💰 Biaya: ~70-150 token per skill per sesi

**Cara membukanya:**
```bash
# Dari terminal (berfungsi dari mana saja)
open ~/.claude/skills/
```

Atau di **Windows**:
```bash
explorer %USERPROFILE%\.claude\skills\
```

Atau di **Finder (Mac)**:
- Tekan `Cmd+Shift+G`
- Paste `~/.claude/skills/`
- Tekan Enter

### 2️⃣ Project Skills — Hanya untuk Proyek Tertentu

```
.proyek-anda/.claude/skills/
```

✅ Hanya tersedia saat kamu bekerja di proyek itu
💰 Biaya: ~70-150 token per skill, hanya di proyek itu
🎯 Ideal untuk: Workflow spesifik proyek (deploy aplikasi ini, publish pipeline repo ini, testing proyek ini)

**Cara membukanya:**
```bash
# Dari dalam folder proyek
open .claude/skills/
```

---

## 💡 Progressive Disclosure: Kenapa Skills Tidak Memenuhi Konteks

Ini pertanyaan yang sering muncul:

> "Kalau saya punya 30 skills global, apa SEMUA skills masuk ke konteks Claude setiap kali saya mengirim prompt?"

**Jawaban singkat: TIDAK.**

Inilah yang disebut **progressive disclosure**:

1. **Saat sesi dimulai** → Hanya **nama** dan **deskripsi** setiap skill yang dimuat
2. **Saat Claude memutuskan menggunakan skill** → Barulah **isi lengkap SKILL.md** dimuat

Jadi kamu bisa punya **ratusan skills** tanpa khawatir meledakkan jendela konteks.

### 💰 Biaya per Skill

| Lapisan | Biaya Token |
|---------|-------------|
| Nama + Deskripsi (selalu dimuat) | ~70-150 token per skill |
| Isi SKILL.md lengkap (hanya saat digunakan) | Bervariasi, tergantung panjang instruksi |

> **Tips:** 70-150 token per skill memang kecil, tapi kalau kamu punya 100+ skills global, itu bisa 7000-15000 token yang terpakai setiap sesi tanpa kamu sadari!

---

## ⚖️ Global vs Project Skills: Kapan Pakai Yang Mana?

| Aspek | Global (`~/.claude/skills/`) | Project (`<project>/.claude/skills/`) |
|-------|------------------------------|---------------------------------------|
| **Ketersediaan** | Setiap sesi, proyek mana pun | Hanya di proyek itu |
| **Dimuat ke konteks** | Setiap sesi (meski tidak dipakai) | Hanya saat bekerja di proyek itu |
| **Biaya token** | ~70-150/skill, selalu | ~70-150/skill, hanya di proyek itu |
| **Muncul di menu slash (`/`)** | Ya, di proyek mana pun | Ya, hanya di proyek itu |
| **Terbaik untuk** | Utilitas lintas proyek (git workflow, code review patterns, helper umum) | Workflow spesifik proyek (deploy, publish pipeline, testing) |
| **Risiko** | Membengkakkan setiap sesi, memakai token yang tidak terpakai | Terkandung — hanya memengaruhi sesi proyek itu |

### 📝 Aturan Praktis

> **Aturan yang saya pakai:** Jika saya ingin skill ini tersedia saat membuka proyek baru dengan nol konteks, saya taruh di global. Sisanya tetap di folder proyek.

---

## 🔍 Discovery Prompt: Temukan 5 Skill Pertama Kamu Hari Ini

Prompt ini bisa langsung kamu paste ke Claude Code:

```
"Based on my recent sessions, what tasks am I doing repeatedly 
that should be skills instead of one off prompts?"
```

**Terjemahan:**
> "Berdasarkan sesi-sesi terbaru saya, tugas apa yang saya lakukan berulang kali yang seharusnya menjadi skills, bukan prompt satu kali?"

### Cara Kerjanya:
1. Paste prompt di atas ke Claude Code
2. Claude akan melihat rivayat chat kamu
3. Claude akan mengidentifikasi 3-5 tugas berulang yang seharusnya jadi skills
4. Kamu tinggal eksekusi rekomendasinya

**Contoh hasil yang mungkin:** Mungkin kamu sering:
- Meminta Claude membuat commit message → **buat skill `/git-commit`**
- Meminta Claude mereview kode → **buat skill `/code-review`**
- Meminta Claude menulis test → **buat skill `/write-tests`**

---

## ⚠️ Peringatan Penting: Jangan Over-Engineer Skills

Tidak semua engineer Anthropic setuju bahwa skills harus rumit. **Thariq Shihipar** dari tim Claude Code mengatakan:

> *"When I see people with a lot of over-built skills, kind of like 'you're an expert planner', that is usually outsourcing too much and constraining it."*
>
> "Ketika saya melihat orang dengan skill yang terlalu rumit, seperti 'kamu adalah perencana ahli', itu biasanya terlalu banyak mengalihdayakan dan malah membatasi."

### 📌 Artinya:

- **Jaga instruksi skill tetap tipis** (ringkas)
- **Sebutkan tugasnya saja** — jangan detail berlebihan
- **Biarkan model melakukan sisanya** — percayakan pada kecerdasan Claude

---

## ✅ Intisari Prinsip 1

> **Jika kamu mengetik prompt yang sama dua kali, itu sudah bukan prompt — itu skill. Tapi jaga skill itu tetap tipis.**

### 🎯 Action Items untuk Kamu:

1. ✅ Buka folder skills kamu (global atau project)
2. ✅ Cari 3 tugas yang sering kamu lakukan berulang di Claude Code
3. ✅ Buat skill sederhana untuk masing-masing (cukup folder + SKILL.md)
4. ✅ Jaga instruksi tetap ringkas — jangan terlalu panjang
5. ❌ Jangan membuat skill yang terlalu rumit dan membatasi

---

## 📝 Contoh Skill Sederhana: `/git-commit`

Buat folder: `~/.claude/skills/git-commit/`

Buat file `SKILL.md`:

```markdown
---
name: git-commit
description: Membuat commit message yang baik untuk perubahan kode
---

Buatkan commit message yang:
1. Singkat dan deskriptif (max 50 karakter untuk subject line)
2. Menggunakan Bahasa Indonesia atau Inggris (ikuti preferensi proyek)
3. Sertakan penjelasan mengapa perubahan dilakukan
4. Format: conventional commits (feat:, fix:, docs:, dll.)
```

**Itu saja!** Cukup 10 baris instruksi. Tidak perlu panjang dan rumit.

---

**👉 Lanjut ke [Prinsip 2: Skills Lebih dari Sekadar Prompt](./02-prinsip-2-skills-lebih-dari-prompt.md)**  
**👈 [Kembali ke Daftar Isi](./README.md)**
