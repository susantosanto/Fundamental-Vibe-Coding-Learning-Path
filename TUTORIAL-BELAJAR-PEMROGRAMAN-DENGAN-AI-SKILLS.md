# 📚 Tutorial Lengkap: Belajar Pemrograman dengan AI Skills Workflow

> **Mulai dari NOL → Menjadi Software Engineer, System Architect, Fullstack Developer, AI Engineer**
> *Menggunakan skill-skill AI yang sudah diinstall di semua agent Anda*

---

## 📋 Daftar Isi

1. [Apa yang Sudah Terinstall](#1-apa-yang-sudah-terinstall)
2. [Cara Menggunakan Skill-Skill Ini](#2-cara-menggunakan-skill-skill-ini)
3. [Learning Path Lengkap](#3-learning-path-lengkap)
4. [Workflow Harian Belajar](#4-workflow-harian-belajar)
5. [Studi Kasus: Belajar JavaScript dari Nol](#5-studi-kasus-belajar-javascript-dari-nol)
6. [Troubleshooting & Tips](#6-troubleshooting--tips)

---

## 1. Apa yang Sudah Terinstall

### 1.1 Daftar Skill

| Skill | Fungsi | Cocok Untuk |
|-------|--------|-------------|
| **`/teach`** | Tutor pribadi dengan workspace belajar, bikin lesson, tracking progress | Belajar topik baru terstruktur |
| **`/gentle-teaching`** | Metode Socratic — tidak kasih jawaban, bikin Anda berpikir | Saat stuck, ingin paham secara deep |
| **`/coding-tutor`** | Tutorial instan step-by-step dengan analogi dan contoh kode | Belajar konsep baru cepat |
| **`/code-documentation-code-explain`** | Menjelaskan kode kompleks dalam bahasa sederhana | Memahami kode orang lain |
| **`/learning-opportunities`** | Latihan interaktif untuk penguatan pemahaman | Setelah selesai belajar topik |
| **`/learning-javascript`** | Learning workflow JavaScript dari fundamental | Belajar JavaScript |
| **`/learning-python`** | Learning workflow Python dari fundamental | Belajar Python |
| **`/learning-php`** | Learning workflow PHP dari fundamental | Belajar PHP |
| **`/learning-fullstack`** | Learning workflow Fullstack Development | Menjadi Fullstack Developer |
| **`/learning-system-design`** | Learning workflow System Architecture | Menjadi System Architect |
| **`/learning-ai-engineering`** | Learning workflow AI Engineering | Menjadi AI Engineer |

### 1.2 Dimana Skill Terinstall

Semua skill di atas sudah terinstall di **5 lokasi**:

| Agent | Lokasi | Cara Akses |
|-------|--------|------------|
| **Claude Code** | `~/.claude/skills/` | Ketik `/teach` di Claude CLI |
| **OpenClaude** | `~/.openclaude/skills/` | Ketik `/teach` di OpenClaude |
| **OpenCode** | `~/.config/opencode/skills/` | Ketik `/teach` di OpenCode |
| **Pi Agent** | `~/pi-agent/skills/` | Ketik `/teach` di Pi Agent CLI |
| **Global (semua agent)** | `~/.agent/skills/` | Semua agent compatible |

---

## 2. Cara Menggunakan Skill-Skill Ini

### 2.1 Pattern Dasar Penggunaan

```
SETIAP SESI BELAJAR, IKUTI WORKFLOW INI:

   ╔═══════════════════════════════╗
   ║  1. PILIH TOPIK              ║
   ║     /learning-javascript      ║
   ╚═══════════════════════════════╝
                │
                ▼
   ╔═══════════════════════════════╗
   ║  2. MULAI BELAJAR             ║
   ║     /teach "Saya ingin...     ║
   ║     belajar [topik] dari nol" ║
   ╚═══════════════════════════════╝
                │
                ▼
   ╔═══════════════════════════════╗
   ║  3. SAAT STUCK                ║
   ║     /gentle-teaching          ║
   ║     atau                      ║
   ║     /coding-tutor [topik]     ║
   ╚═══════════════════════════════╝
                │
                ▼
   ╔═══════════════════════════════╗
   ║  4. PENGUATAN                 ║
   ║     /learning-opportunities   ║
   ║     (latihan soal)            ║
   ╚═══════════════════════════════╝
                │
                ▼
   ╔═══════════════════════════════╗
   ║  5. REVIEW                    ║
   ║     /code-documentation-      ║
   ║     code-explain              ║
   ╚═══════════════════════════════╝
```

### 2.2 Cara Memicu Setiap Skill

| Skill | Cara Memicu | Contoh |
|-------|-------------|--------|
| **teach** | `/teach "Saya ingin..."` | `/teach "Saya ingin belajar JavaScript dari nol"` |
| **gentle-teaching** | `/gentle-teaching [pertanyaan]` | `/gentle-teaching "Apa itu closure?"` |
| **coding-tutor** | `/coding-tutor [bahasa] [topik]` | `/coding-tutor javascript function` |
| **code-documentation-code-explain** | Tempelkan kode, lalu `/code-documentation-code-explain` | `[tempel kode]` lalu panggil skill |
| **learning-opportunities** | `/learning-opportunities` (setelah selesai topik) | `/learning-opportunities` |
| **learning-* | `/learning-javascript` (lihat path belajar) | `/learning-javascript` |

---

## 3. Learning Path Lengkap

### 🅰️ Path: Belajar Coding dari NOL (Recommended Start)

```
Bulan 1-2:              Bulan 3-4:              Bulan 5-6:              Bulan 7-8+:
┌─────────────┐        ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│ JavaScript   │ ─────→ │ Python       │ ─────→ │ PHP/SQL     │ ─────→ │ Pilih       │
│ (Fundamental)│        │ (Programming)│        │ (Web Dev)   │        │ Spesialisasi│
└─────────────┘        └─────────────┘         └─────────────┘         └─────────────┘
                                                                              │
     ▼                                                                        ▼
┌─────────────┐                                              ┌─────────────────────────┐
│ HTML + CSS  │                                              │ Fullstack Developer    │
│ (Web Dasar) │                                              │ System Architect       │
└─────────────┘                                              │ AI Engineer            │
                                                             │ (pilih salah satu)     │
                                                             └─────────────────────────┘
```

### 🅱️ Detail Per Fase

#### Fase 1: JavaScript Fundamental (Bulan 1-2)
| Minggu | Topik | Skill yang Digunakan | Target |
|--------|-------|---------------------|--------|
| 1 | Variables, tipe data, operators | `/teach` + `/coding-tutor` | Bikin kalkulator sederhana |
| 2 | Function, scope, array | `/teach` + `/gentle-teaching` | Bikin function sendiri |
| 3 | Object, DOM, events | `/teach` + `/coding-tutor` | Bikin halaman interaktif |
| 4 | Mini project | `/learning-opportunities` + review | Todo List |

#### Fase 2: Python & Problem Solving (Bulan 3-4)
| Minggu | Topik | Skill yang Digunakan | Target |
|--------|-------|---------------------|--------|
| 1-2 | Python dasar | `/learning-python` + `/teach` | Script Python sederhana |
| 3 | Data structures | `/coding-tutor` + `/gentle-teaching` | Manipulasi data |
| 4 | Problem solving | `/learning-opportunities` | 10 soal programming |

#### Fase 3: Fullstack Web (Bulan 5-6)
| Minggu | Topik | Skill yang Digunakan | Target |
|--------|-------|---------------------|--------|
| 1-2 | HTML/CSS + PHP dasar | `/learning-php` + `/teach` | Landing page |
| 3 | Database + CRUD | `/coding-tutor` + `/code-documentation-code-explain` | CRUD app |
| 4 | Fullstack app | `/learning-fullstack` | Aplikasi lengkap |

#### Fase 4: Spesialisasi (Bulan 7-8+)
| Path | Topik | Skill |
|------|-------|-------|
| **Fullstack** | React/Next.js, deployment | `/learning-fullstack` |
| **System Architect** | Scalability, microservices, design patterns | `/learning-system-design` |
| **AI Engineer** | Machine Learning, LLM, AI agents | `/learning-ai-engineering` |

---

## 4. Workflow Harian Belajar

### ☀️ Sesi Pagi (30-45 menit) — BELAJAR KONSEP BARU

```
1. Buka AI agent (Claude/OpenCode/OpenClaude)
2. Ketik: /teach "Saya ingin belajar [topik]"
3. Ikuti lesson yang dibuat AI
4. Catat poin-poin penting
```

### 🌤️ Sesi Siang (15-20 menit) — PRAKTIK & STUCK

```
1. Coba koding sendiri tanpa bantuan AI
2. Jika stuck: /gentle-teaching "saya stuck di [masalah]"
3. Jawab pertanyaan AI, jangan minta jawaban langsung!
4. Jika masih stuck: /coding-tutor [topik]
```

### 🌙 Sesi Malam (15-20 menit) — PENGUATAN

```
1. Review apa yang dipelajari hari ini
2. /learning-opportunities (latihan soal)
3. Review kode yang sudah ditulis:
   /code-documentation-code-explain
```

---

## 5. Studi Kasus: Belajar JavaScript dari Nol

### 📅 Hari 1: Setup & Variables

**Langkah 1: Mulai dengan `/learning-javascript`**
```
Anda: /learning-javascript
AI: Menampilkan learning path JavaScript
    Fase 1: Variables → Functions → Loops → DOM
    Mulai dari sini? (y/n)
Anda: y
```

**Langkah 2: Belajar dengan `/teach`**
```
Anda: /teach "Saya ingin belajar JavaScript variabel dari nol"
AI: [Membuat workspace belajar]
    ✅ MISSION.md dibuat
    ✅ ./lessons/0001-variables.html dibuat
    ✅ ./reference/javascript-cheatsheet.html dibuat
    
    Buka ./lessons/0001-variables.html di browser untuk mulai!
    
    Isi lesson:
    - Apa itu variabel? → Kotak penyimpanan
    - let vs const vs var
    - Tipe data: string, number, boolean
    - Latihan: bikin variabel nama dan umur
```

**Langkah 3: Praktik Mandiri**
```
Anda: [Membuka file lesson di browser]
      [Mencoba kode sendiri]
      [Stuck: "variable tidak tampil di console"]

Anda: /gentle-teaching "Kenapa variable saya tidak tampil?"
AI: Hmm, menarik! Coba ceritakan:
    1. Apa yang kamu tulis?
    2. Apa yang kamu harapkan terjadi?
    3. Apakah sudah panggil console.log()?
    
    Coba periksa langkah #3 dulu...
```

**Langkah 4: Penguatan**
```
Anda: /learning-opportunities
AI: Oke! Coba tebak output dari kode ini:
    let x = 5;
    let y = "10";
    console.log(x + y);
    
    Apa yang akan tampil? "510" atau 15? Jelaskan!
```

### 📅 Hari 2: Functions (Lanjutan)

```
1. /teach "Saya ingin belajar function JavaScript"
2. /coding-tutor javascript function arrow
3. /learning-opportunities (latihan)
```

### 📅 Hari 7: Mini Project Pertama

```
1. Buat kalkulator sederhana sendiri
2. Jika stuck: /gentle-teaching
3. Review kode: /code-documentation-code-explain
4. /learning-opportunities untuk penguatan
```

---

## 6. Troubleshooting & Tips

### ❌ Skill Tidak Terdeteksi

```
Penyebab: Agent belum di-restart setelah instalasi
Solusi: Restart AI agent CLI/TUI Anda
```

### ❌ `/teach` Tidak Membuat File HTML

```
Penyebab: Skill perlu diaktifkan dengan stateful mode
Solusi: Pastikan Anda menggunakan agent yang mendukung write file
```

### ❌ Lupa Cara Menggunakan Skill

```
Cek panduan cepat:
  ~/.agent/skills/INSTALL-WORKFLOW.md
Atau tanyakan langsung ke AI:
  "Skill apa saja yang terinstall dan bagaimana cara pakainya?"
```

### 💡 Tips Penting

| # | Tips |
|---|------|
| 1 | **Konsisten**: 30 menit/hari > 5 jam/minggu |
| 2 | **Jangan copy-paste**: Ketik manual setiap kode untuk membangun muscle memory |
| 3 | **Gunakan `/gentle-teaching` saat stuck**: Ini yang paling membangun pemahaman |
| 4 | **Buat mini project**: Jangan lanjut sebelum project selesai |
| 5 | **Review kode**: Setiap selesai nulis kode, review dengan `/code-documentation-code-explain` |
| 6 | **Catat progress**: Gunakan `/teach` yang otomatis tracking di learning-records |
| 7 | **Bergantian skill**: Teach → Practice → Gentle-teaching → Learning-opportunities → Review |

---

## 🎯 Target Akhir

Setelah menyelesaikan semua learning path, Anda akan mampu:

| Kemampuan | Level |
|-----------|-------|
| Menulis kode JavaScript, Python, PHP | 🔵🔵🔵🔵⚪ |
| Problem solving dan debugging | 🔵🔵🔵🔵🔵 |
| System design & architecture | 🔵🔵🔵⚪⚪ |
| Fullstack web development | 🔵🔵🔵🔵⚪ |
| AI Engineering basics | 🔵🔵🔵⚪⚪ |
| Berpikir seperti software engineer | 🔵🔵🔵🔵🔵 |

---

> **📌 Ingat:** Kunci sukses belajar programming adalah **KONSISTENSI** dan **PRAKTIK**.
> Tools ini hanya pemandu — yang belajar adalah Anda!
>
> *"Tell me and I forget, teach me and I remember, involve me and I learn."*
> — Benjamin Franklin

---

*Tutorial ini dibuat: 15 Juni 2026*
*Skill terinstall di: Claude Code, OpenClaude, OpenCode, Pi Agent, dan Global Agent Skills*
