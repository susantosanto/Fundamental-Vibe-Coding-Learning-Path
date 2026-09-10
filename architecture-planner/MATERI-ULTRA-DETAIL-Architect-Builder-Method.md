# 🏗️ PANDUAN ULTRA-DETAIL: Metode Architect-Builder
## Cara Membangun Perangkat Lunak dengan AI secara Terstruktur — Tanpa Vibe Coding

**Sumber Utama:**
- 📹 [120x.ai — How I Use ChatGPT and Codex to Build Software Without Vibe Coding](https://christitus.com/my-ai-workflow/) (transkrip asli)
- 📝 [Chris Titus Tech — My AI Coding Workflow That Actually Works](https://christitus.com/my-ai-workflow/)
- 📘 [Anthropic — Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- 📘 [Anthropic — Prompting Best Practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

**Target Pembaca:** Pemula absolut hingga menengah — pemilik bisnis, konsultan, eksekutif, web developer fullstack, software engineer global, siapa saja  
**Bahasa:** Indonesia  

**📚 Sumber Tambahan (Riset 2026):**
- [Augment Code — Agentic Design Patterns Catalog 2026](https://www.augmentcode.com/guides/agentic-design-patterns)
- [Augment Code — Vibe Coding vs Spec-Driven Development 2026](https://www.augmentcode.com/guides/vibe-coding-vs-spec-driven-development)
- [Addy Osmani — Vibe Coding is Not AI-Assisted Engineering](https://medium.com/@addyosmani/vibe-coding-is-not-the-same-as-ai-assisted-engineering-3f81088d5b98)
- [LangChain — Agentic Engineering: How Swarms of AI Agents Are Redefining Software](https://www.langchain.com/blog/agentic-engineering-redefining-software-engineering)
- [Anthropic — Building Effective AI Agents (Dec 2024)](https://www.anthropic.com/engineering/building-effective-agents)
- [arXiv — Practical Guide for Designing & Deploying Agentic AI Systems](https://arxiv.org/html/2512.08769)
- [System Design Codex — Essential Components of Production-Ready Web Apps](https://newsletter.systemdesigncodex.com/p/essential-components-of-a-production)

---

## 📑 DAFTAR ISI

1. [MENGAPA VIBE CODING GAGAL](#1-mengapa-vibe-coding-gagal)
2. [KONSEP INTI: ARCHITECT-BUILDER METHOD](#2-konsep-inti-architect-builder-method)
3. [TIGA PILAR METODE INI](#3-tiga-pilar-metode-ini)
4. [ANALOGI MEMBANGUN RUMAH](#4-analogi-membangun-rumah)
5. [PERSIAPAN SEBELUM MEMULAI](#5-persiapan-sebelum-memulai)
6. [STRUKTUR FOLDER PROYEK (SCAFFOLD)](#6-struktur-folder-proyek-scaffold)
7. [PENJELASAN DETAIL SETIAP FILE](#7-penjelasan-detail-setiap-file)
8. [WORKFLOW LENGKAP 6 TAHAP](#8-workflow-lengkap-6-tahap)
9. [CONTEXT ENGINEERING: RAHASIA TERBESAR](#9-context-engineering-rahasia-terbesar)
10. [SPRINT-BASED DEVELOPMENT](#10-sprint-based-development)
11. [CARA MENULIS PROMPT YANG BENAR](#11-cara-menulis-prompt-yang-benar)
12. [SISTEM VERIFIKASI & REVIEW](#12-sistem-verifikasi--review)
13. [KEAMANAN & DEPENDENCY CHECK](#13-keamanan--dependency-check)
14. [MANAJEMEN SESSION AI](#14-manajemen-session-ai)
15. [TOOLS & TEKNOLOGI YANG DIGUNAKAN](#15-tools--teknologi-yang-digunakan)
16. [TIPS PRAKTIS & BEST PRACTICES](#16-tips-praktis-dan-best-practices)
17. [KESALAHAN UMUM & CARA MENGHINDARINYA](#17-kesalahan-umum--cara-menghindarinya)
18. [CONTOH KASUS NYATA](#18-contoh-kasus-nyata)
19. [GLOSARIUM LENGKAP](#19-glosarium-lengkap)
20. [SYSTEM DESIGN ARCHITECTURE UNTUK FULLSTACK WEB DEVELOPER](#20-system-design-architecture-untuk-fullstack-web-developer)
21. [AGENTIC PATTERNS & AI AGENT WORKFLOW](#21-agentic-patterns--ai-agent-workflow)
22. [STANDAR PRODUCTION-READY & DEPLOYMENT](#22-standar-production-ready--deployment)
23. [VIBE ENGINEERING: EVOLUSI DARI VIBE CODING](#23-vibe-engineering-evolusi-dari-vibe-coding)
24. [REFERENSI & SUMBER](#24-referensi--sumber)

---

## 1. MENGAPA VIBE CODING GAGAL

### 1.1 Apa Itu Vibe Coding?

**Vibe Coding** adalah pendekatan di mana seseorang langsung membuka tool AI coding dan mengatakan: *"Buatkan saya aplikasi!"* tanpa perencanaan apapun.

Istilah ini dipopulerkan oleh **Andrej Karpathy** (co-founder OpenAI) pada awal 2025. Ia mendeskripsikan pendekatan "sepenuhnya vibes" di mana Anda *"lupa bahwa kode itu bahkan ada"* — AI yang menulis semua kode berdasarkan deskripsi kasar.

### 1.2 Mengapa Vibe Coding Gagal untuk Perangkat Lunak Serius?

#### ❌ Masalah #1: AI Harus Menebak Aturan Bisnis

Saat Anda memberikan ide yang samar-samar ke AI, AI harus **menebak** semua hal ini:

```
Anda: "Buatkan aplikasi manajemen inventaris"

AI harus menebak:
├── Aturan bisnis apa yang berlaku?
├── Siapa yang boleh akses data apa?
├── Workflow approval seperti apa?
├── Bagaimana dengan kasus edge (situasi tak terduga)?
├── Apa definisi "selesai" dari fitur ini?
├── Bagaimana dengan error handling?
├── Format output seperti apa yang diinginkan?
└── Siapa pengguna akhirnya?
```

> **💡 Kutipan dari 120x.ai:**
> *"I don't want Codex or Claude Code guessing at my business model. I don't want these tools inventing permissions, and I don't want these tools deciding what done looks like."*

#### ❌ Masalah #2: Konteks yang Tersebar dan Berantakan

Dalam vibe coding, pengetahuan proyek tersebar di sepanjang chat history:

```
Chat History (berantakan):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Message #3:  "Tambahkan approval step" ← Keputusan penting!
Message #12: "Eh, yang tadi salah" ← Koreksi dari 3 hari lalu
Message #18: "Kolom X di spreadsheet selalu bermasalah" ← Fakta kritis
Message #27: "Kecualikan data lama" ← Pengecualian tersembunyi
Message #34: "User admin boleh edit, viewer tidak boleh" ← Aturan akses
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Masalah: Tidak ada yang mencatat! Semua terkubur di chat.
```

#### ❌ Masalah #3: AI Improvisasi Tanpa Batas

Saat tidak ada instruksi yang jelas, AI akan mulai **mengarang**:

| AI Menebak... | Akibatnya... |
|---------------|-------------|
| Membuat izin sendiri | User yang tidak seharusnya bisa akses data sensitif |
| Menentukan workflow sendiri | Proses bisnis menjadi tidak sesuai kebutuhan |
| Menciptakan fitur yang tidak diminta | Codebase menjadi kompleks dan sulit dipelihara |
| Memilih dependensi sendiri | Menggunakan library yang sudah usang atau tidak cocok |
| Menentukan format output | Output tidak sesuai kebutuhan bisnis |

#### ❌ Masalah #4: Tidak Ada Skala untuk Proyek Besar

Vibe coding mungkin berhasil untuk **MVP sederhana** atau **demo**, tapi gagal saat:
- Proyek memiliki 10+ fitur
- Ada banyak pengguna dengan role berbeda
- Perlu integrasi dengan sistem lain
- Butuh maintenance jangka panjang
- Tim lebih dari 1 orang

> **💡 Kutipan dari Chris Titus Tech:**
> *"One giant prompt that loops until an agent declares victory may produce a demo, but it is not how I build software I plan to maintain."*

### 1.3 Perbandingan: Vibe Coding vs Structured Development

```
╔══════════════════════╦══════════════════════╦══════════════════════╗
║       Aspek          ║    VIBE CODING       ║  STRUCTURED METHOD   ║
╠══════════════════════╬══════════════════════╬══════════════════════╣
║ Perencanaan          ║ Tidak ada            ║ Sangat detail        ║
║ Konteks              ║ Berantakan di chat   ║ Terstruktur di folder║
║ Aturan Bisnis        ║ AI menebak           ║ Dokumentasi jelas    ║
║ Risiko               ║ Tinggi (banyak error)║ Rendah (terkontrol)  ║
║ Review               ║ Tidak systematic     ║ Setiap sprint di-    ║
║                      ║                      ║ review               ║
║ Dokumentasi          ║ Tidak ada            ║ Selalu diperbarui    ║
║ Skalabilitas         ║ Hanya untuk kecil    ║ Sangat scalable      ║
║ Maintenance          ║ Sulit                ║ Mudah                ║
║ Hasil                ║ MVP yang messy       ║ Perangkat lunak      ║
║                      ║                      ║ yang solid           ║
║ Waktu awal           ║ Cepat                ║ Lebih lama           ║
║ Waktu total          ║ Lama (banyak fix)    ║ Lebih cepat overall  ║
╚══════════════════════╩══════════════════════╩══════════════════════╝
```

---

## 2. KONSEP INTI: ARCHITECT-BUILDER METHOD

### 2.1 Apa Itu Architect-Builder Method?

Metode **Architect-Builder** adalah pendekatan terstruktur di mana peran dibagi menjadi dua:

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│   🏛️ ARCHITECT (Perencana)                                    │
│   ┌─────────────────────────────────────┐                    │
│   │  Tools: ChatGPT / Claude (LLM)      │                    │
│   │                                      │                    │
│   │  Tugas:                              │                    │
│   │  • Brainstorming & klarifikasi ide   │                    │
│   │  • Membuat requirements              │                    │
│   │  • Merancang blueprint               │                    │
│   │  • Mendefinisikan acceptance criteria│                    │
│   │  • Review & sanity check hasil       │                    │
│   │  • Membuat architect pack            │                    │
│   └──────────────────┬──────────────────┘                    │
│                      │                                        │
│              Handoff (via Folder)                              │
│                      │                                        │
│   🔨 BUILDER (Pelaksana)                                      │
│   ┌──────────────────┴──────────────────┐                    │
│   │  Tools: Codex / Claude Code / Cursor │                    │
│   │                                      │                    │
│   │  Tugas:                              │                    │
│   │  • Membaca architect pack            │                    │
│   │  • Dry run (simulasi)                │                    │
│   │  • Implementasi kode                 │                    │
│   │  • Menulis test                      │                    │
│   │  • Memperbarui folder proyek         │                    │
│   │  • Melaporkan hasil ke architect     │                    │
│   └─────────────────────────────────────┘                    │
│                                                               │
│   📁 SOURCE OF TRUTH: Folder Proyek                           │
│   (Bukan chat history!)                                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Mengapa Metode Ini Bekerja?

> **💡 Kutipan dari 120x.ai:**
> *"The answer was not more context. The answer was to get cleaner context."*

Metode ini bekerja karena:

1. **Architect Layer** memastikan semua pertanyaan dijawab SEBELUM coding dimulai
2. **Builder Layer** mendapat rencana yang spesifik, bukan tebakan
3. **Folder System** menjadi source of truth yang terstruktur
4. **Sprint-based approach** memecah proyek besar menjadi bagian kecil
5. **Review loop** memastikan kualitas di setiap tahap

---

## 3. TIGA PILAR METODE INI

### Pilar #1: Architect Layer

Architect menggunakan **Large Language Model (LLM)** seperti ChatGPT atau Claude.

**Mengapa LLM cocok sebagai Architect?**
- Mampu brainstorming dan mengajukan pertanyaan
- Bisa melihat big picture
- Mampu membuat rencana terstruktur
- Bisa review hasil builder dari perspektif yang berbeda
- Tidak lelah dan selalu konsisten

**Yang HARUS dilakukan Architect:**
```
✅ Mendefinisikan tujuan proyek secara jelas
✅ Mengidentifikasi semua pengguna dan role
✅ Merancang workflow lengkap
✅ Menentukan requirements per fitur
✅ Membuat blueprints teknis
✅ Mengidentifikasi risiko sejak awal
✅ Membuat rencana validasi
✅ Mendefinisikan kriteria penerimaan yang spesifik
✅ Menyiapkan handoff untuk builder
✅ Review dan sanity check hasil builder
```

**Yang TIDAK BOLEH dilakukan Architect:**
```
❌ Menulis kode (itu tugas builder)
❌ Mengambil keputusan teknis tanpa input manusia
❌ Mengabaikan pertanyaan terbuka
❌ Terburu-buru ke coding tanpa perencanaan
```

### Pilar #2: Builder Layer

Builder menggunakan **coding tool** seperti Codex, Claude Code, atau Cursor.

> **💡 Kutipan dari Anthropic:**
> *"Claude Code is an agentic coding environment. Unlike a chatbot that answers questions and waits, Claude Code can read your files, run commands, make changes, and autonomously work through problems."*

**Yang HARUS dilakukan Builder:**
```
✅ Membaca architect pack dengan seksama
✅ Melakukan dry run sebelum coding
✅ Mengimplementasi kode SESUAI rencana
✅ Menulis test untuk setiap fitur
✅ Memperbarui folder proyek
✅ Melaporkan hasil secara detail
✅ Memberikan bukti (test output, screenshot)
```

**Yang TIDAK BOLEH dilakukan Builder:**
```
❌ Menebak aturan bisnis
❌ Mengarang fitur yang tidak diminta
❌ Mengambil keputusan arsitektural
❌ Mengubah requirements tanpa persetujuan
❌ Skip testing
```

### Pilar #3: Source of Truth (Folder System)

> **💡 Kutipan dari 120x.ai:**
> *"The source of truth isn't the history of the chats per se. No, the source of truth is the project folder or the folder system."*

Folder system berfungsi sebagai:
1. **Knowledge Base** — Seluruh pengetahuan proyek tersentralisasi
2. **Context Provider** — Builder membaca dari file, bukan dari chat
3. **Handoff Mechanism** — Cara "menyerahkan" pekerjaan
4. **Audit Trail** — Jejak keputusan dan perubahan
5. **Onboarding Tool** — Siapa saja bisa paham proyek dengan membaca folder

---

## 4. ANALOGI MEMBANGUN RUMAH

### 4.1 Cara yang Salah (Vibe Coding)

```
Anda: [memberikan sketsa di atas tisu ke tukang]
      "Bangun yang modern, 3 kamar tidur, dapur yang bagus,
       terserah kalian atur."

Tukang: "Oke..." [mulai membangun sesuai tebakan]

Hasil: ❌ Rumah TIDAK sesuai keinginan Anda
       ❌ Kamar terlalu kecil
       ❌ Dapur di tempat yang salah
       ❌ Listrik tidak mencukupi
       ❌ Perlu renovasi besar-besaran (= rewrite kode)
```

### 4.2 Cara yang Benar (Architect-Builder)

```
Anda → Berbicara dengan Arsitek (Architect Layer)
       ↓
Arsitek bertanya banyak hal:
       • Berapa budget?
       • Gaya hidup seperti apa?
       • Berapa banyak anggota keluarga?
       • Butuh ruang kerja?
       • Preferensi material?
       • Apa yang paling penting?
       ↓
Arsitek membuat gambar teknis lengkap:
       • Denah lantai (floor plan)
       • Tampak depan/samping/belakang
       • Detail struktur
       • Spesifikasi material
       • Estimasi biaya
       • Jadwal pengerjaan
       ↓
Gambar teknis diserahkan ke Tukang (Builder Layer)
       ↓
Tukang membangun SESUAI gambar teknis
       ↓
Arsitek melakukan inspeksi berkala
       ↓
Hasil: ✅ Rumah sesuai impian Anda!
       ✅ Sesuai budget
       ✅ Sesuai jadwal
       ✅ Sesuai standar keamanan
```

### 4.3 Peta Perbandingan

| Dunia Konstruksi | Dunia Software |
|------------------|---------------|
| Anda (pemilik rumah) | Anda (pemilik bisnis/ide) |
| Arsitek | ChatGPT/Claude (Architect) |
| Tukang/Bangunan | Codex/Claude Code (Builder) |
| Gambar teknis | Architect Pack (rencana) |
| Material & struktur | Kode sumber (source code) |
| Inspeksi rumah | Testing & validasi |
| IMB (Izin Mendirikan Bangunan) | Code review & approval |
| Kontrak kerja | Acceptance criteria |

---

## 5. PERSIAPAN SEBELUM MEMULAI

### 5.1 Yang Perlu Anda Siapkan

Sebelum memulai, pastikan Anda memiliki:

```
✅ 1. Komputer dengan akses internet
✅ 2. Akun ChatGPT (Plus/Pro) ATAU Claude (Pro/Team)
✅ 3. Akun OpenAI Codex ATAU Claude Code ATAU Cursor
✅ 4. Text editor untuk melihat file markdown (Opsional: Obsidian)
✅ 5. Git (untuk version control — optional di awal)
✅ 6. Pengetahuan tentang bisnis Anda sendiri (paling penting!)
```

### 5.2 Keterampilan yang SUDAH Anda Miliki

Anda **tidak perlu** jadi programmer untuk menggunakan metode ini:

```
Keterampilan bisnis yang sudah Anda miliki:
├── ✅ Menggunakan Excel dan pivot table
├── ✅ Memahami workflow bisnis
├── ✅ Mengetahui input dan output
├── ✅ Memahami aturan dan approval
├── ✅ Mengetahui laporan yang penting
├── ✅ Memahami pain points organisasi
├── ✅ Mengetahui siapa pengguna sistem
└── ✅ Memahami data apa yang perlu diakses

→ Semua ini adalah "bahan mentah" untuk menjadi architect yang baik!
```

> **💡 Kutipan dari 120x.ai:**
> *"You don't need to learn how to become a full-time developer. It helps, but what really is most important is you need to learn how to turn this operational knowledge, this tribal knowledge you have in some cases, into builder-ready instructions."*

### 5.3 Setup Project di LLM (Architect)

#### Langkah 1: Buat Project Baru

**Di ChatGPT:**
```
1. Klik "+" atau "New Chat"
2. Pilih "Project" (bukan sekadar chat)
3. Beri nama project yang jelas
   Contoh: "Dashboard Keuangan CEO"
4. Upload file referensi ke Sources/Attachments:
   - Dokumen bisnis
   - Contoh output yang diinginkan
   - Data sampel
```

**Di Claude:**
```
1. Klik "Create Project"
2. Beri nama project
3. Upload file-file referensi:
   - Filosofi pengembangan Anda
   - Template folder structure
   - Dokumen bisnis yang relevan
4. Set Custom Instructions
```

#### Langkah 2: Set Custom Instructions

Custom instructions adalah "peraturan dasar" untuk architect. Berikut contohnya:

```
CONTOH CUSTOM INSTRUCTIONS:
═══════════════════════════════════════════════════

Anda adalah ARCHITECT dalam metode Architect-Builder.

ATURAN UTAMA:
1. Jangan pernah langsung ke coding. Selalu brainstorm dulu.
2. Setiap sprint harus menghasilkan 4 dokumen:
   - Requirements.MD
   - Blueprint.MD
   - Acceptance.MD
   - Handoff-Prompt.MD
3. Selalu tanya pertanyaan sebelum membuat asumsi
4. Review semua hasil builder sebelum melanjutkan
5. Gunakan folder system sebagai source of truth
6. Dokumentasikan SETIAP keputusan
7. Jangan biarkan pertanyaan terbuka terlalu lama

WORKFLOW:
1. Brainstorm & Discovery → 2. Requirements → 
3. Blueprint → 4. Handoff ke Builder → 
5. Builder bekerja → 6. Review hasil → 
7. Ulangi untuk sprint berikutnya

BATASAN:
- Ini untuk proyek internal, bukan aplikasi client
- Fokus pada MVP dulu, jangan over-engineering
- Selalu prioritaskan fitur yang paling berdampak

═══════════════════════════════════════════════════
```

#### Langkah 3: Upload Referensi ke Project

```
File yang perlu di-upload:
├── 📄 Filosofi Architect-Builder (dari materi ini)
├── 📄 Template folder structure
├── 📄 Contoh architect pack yang sudah jadi
├── 📄 Dokumen bisnis (data flow, aturan bisnis)
├── 📄 Contoh output yang diinginkan
└── 📄 Template prompt untuk builder
```

---

## 6. STRUKTUR FOLDER PROYEK (SCAFFOLD)

### 6.1 Struktur Folder Lengkap

```
📁 NAMA_PROYEK/
│
├── 📄 AGENTS.MD                    ← Router utama (BAKA PERTAMA!)
├── 📄 CLAUDE.MD                    ← Config untuk Claude Code
├── 📄 CODEX.MD                     ← Config untuk OpenAI Codex
├── 📄 README.MD                    ← Overview untuk manusia
│
├── 📁 docs/                          ← Dokumentasi teknis tahan lama
│   ├── 📄 ARCHITECTURE.MD           ← Peta sistem & komponen
│   ├── 📄 DATA-MODEL.MD             ← Model data & relasi
│   ├── 📄 API.MD                    ← Endpoint & integrasi
│   ├── 📄 PERMISSIONS.MD            ← Role & aturan akses
│   └── 📄 VALIDATION.MD             ← Cara validasi sistem
│
├── 📁 planning/                      ← Semua perencanaan
│   ├── 📁 meetings/                 ← Catatan rapat
│   ├── 📁 sprints/                  ← Detail per sprint
│   │   ├── 📁 sprint-001/
│   │   │   ├── 📄 REQUIREMENTS.MD
│   │   │   ├── 📄 BLUEPRINT.MD
│   │   │   ├── 📄 ACCEPTANCE.MD
│   │   │   └── 📄 HANDOFF-PROMPT.MD
│   │   ├── 📁 sprint-002/
│   │   └── 📁 sprint-003/
│   └── 📄 ...
│
├── 📄 STATE.MD                       ← Status saat ini (DIPERBARUI TERUS)
├── 📄 DECISIONS.MD                   ← Log keputusan
├── 📄 DOMAIN.MD                      ← Domain bisnis
├── 📄 RISKS.MD                       ← Daftar risiko
├── 📄 QUESTIONS.MD                   ← Pertanyaan terbuka
├── 📄 FILE-INVENTORY.MD              ← Inventaris file sumber
│
├── 📁 references/                    ← File referensi (PDF, Excel, dll)
├── 📁 src/                           ← Kode sumber (dibuat oleh builder)
├── 📁 architect-packs/               ← Output dari architect
│
└── 📁 .claude/                       ← Konfigurasi Claude Code
    ├── 📄 settings.json
    ├── 📁 skills/                    ← Skills reusable
    ├── 📁 agents/                    ← Subagents
    └── 📁 hooks/                     ← Automation hooks
```

### 6.2 Mengapa Folder System Ini Penting?

> **💡 Kutipan dari Chris Titus Tech:**
> *"Do not get distracted by the terminology. These are plain-text files."*

Folder system ini berfungsi sebagai:

```
┌─────────────────────────────────────────────────┐
│        MANFAAT FOLDER SYSTEM                      │
├─────────────────────────────────────────────────┤
│                                                   │
│  1. 📋 SOURCE OF TRUTH                            │
│     Bukan chat history, tapi folder yang jadi     │
│     acuan utama seluruh proyek                    │
│                                                   │
│  2. 🧠 CONTEXT ENGINEERING                        │
│     Memberikan informasi yang tepat pada waktu     │
│     yang tepat kepada AI                          │
│                                                   │
│  3. 🤝 HANDOFF MECHANISM                          │
│     Cara "menyerahkan" pekerjaan dari architect   │
│     ke builder dengan jelas                       │
│                                                   │
│  4. 📚 KNOWLEDGE BASE                             │
│     Seluruh pengetahuan proyek tersentralisasi     │
│     dan terorganisir                              │
│                                                   │
│  5. 🔍 AUDIT TRAIL                                 │
│     Jejak keputusan dan perubahan bisa ditelusuri  │
│                                                   │
│  6. 👥 ONBOARDING TOOL                             │
│     Siapa saja bisa paham proyek dengan membaca    │
│     folder ini                                    │
│                                                   │
│  7. 🔄 SCALABILITY                                 │
│     Proyek bisa berkembang tanpa kehilangan        │
│     konteks                                       │
│                                                   │
└─────────────────────────────────────────────────┘
```

---

## 7. PENJELASAN DETAIL SETIAP FILE

### 7.1 AGENTS.MD — Router Utama

**Fungsi:** File pertama yang harus dibaca oleh setiap AI agent atau human builder.

> **💡 Kutipan dari Chris Titus Tech:**
> *"AGENTS.md tells the coding agent how I want it to work."*

**Isi yang harus ada:**
```markdown
# AGENTS.MD - Router Utama

## Model Operasi
- Kami menggunakan metode Architect-Builder
- Architect: ChatGPT/Claude
- Builder: Codex/Claude Code

## File yang Harus Dibaca (Urutan)
1. AGENTS.MD (file ini)
2. STATE.MD (status terkini)
3. DECISIONS.MD (keputusan yang sudah dibuat)
4. Domain.MD (konteks bisnis)
5. File sprint yang sedang aktif

## Aturan Builder
- JANGAN mulai coding tanpa architect pack
- SELALU lakukan dry run dulu
- SELALU berikan bukti (test output, screenshot)
- JANGAN mengubah requirements tanpa persetujuan

## Workflow
1. Baca architect pack untuk sprint aktif
2. Dry run → Lapor hasil
3. Jika disetujui → Mulai coding
4. Selesai → Lapor hasil dengan bukti
5. Tunggu review dari architect
```

### 7.2 CLAUDE.MD / CODEX.MD — Adapter Tool

> **💡 Kutipan dari Anthropic:**
> *"CLAUDE.md is a special file that Claude reads at the start of every conversation. Include Bash commands, code style, and workflow rules."*

**CLAUDE.MD yang baik:**
```markdown
# Code Style
- Gunakan ES modules (import/export), bukan CommonJS (require)
- Destructure import jika memungkinkan
- Gunakan TypeScript untuk semua file baru

# Workflow
- Jalankan typecheck setelah perubahan kode
- Jalankan test spesifik, bukan seluruh test suite
- Gunakan single test untuk performa

# Aturan Penting
- JANGAN mengubah file di luar scope sprint
- SELALU update dokumentasi jika ada perubahan API
- Gunakan conventional commits
```

**Yang TIDAK boleh ada di CLAUDE.MD:**
```
❌ Deskripsi panjang tentang codebase (AI bisa baca sendiri)
❌ Informasi yang sudah umum diketahui AI
❌ Aturan yang sering berubah (gunakan file lain)
❌ Penjelasan tutorial panjang
❌ "Tulis kode yang bersih" (terlalu generik)
```

> **💡 Kutipan dari Anthropic:**
> *"Keep it concise. For each line, ask: 'Would removing this cause Claude to make mistakes?' If not, cut it. Bloated CLAUDE.md files cause Claude to ignore your actual instructions!"*

### 7.3 STATE.MD — Status Saat Ini (PALING PENTING!)

**Fungsi:** Peta real-time proyek. **Diperbarui terus-menerus** setelah setiap sprint.

```markdown
# STATE.MD - Status Proyek

## Informasi Proyek
- Nama: Dashboard Keuangan CEO
- Mulai: 2025-01-15
- Target Selesai: 2025-03-01

## Status Saat Ini
- Sprint Aktif: Sprint 3 (Executive Output Polish)
- Status: Berjalan
- Terakhir Diperbarui: 2025-02-01

## Riwayat Sprint
| Sprint | Nama | Status | Tanggal |
|--------|------|--------|---------|
| 001 | Discovery & Architecture | ✅ Selesai | 2025-01-16 |
| 002 | Sample Bundle | ✅ Selesai | 2025-01-22 |
| 003 | Executive Output Polish | 🔄 Berjalan | - |
| 004 | Testing & Refinement | ⏳ Belum | - |
| 005 | Final Integration | ⏳ Belum | - |
| 006 | Deployment | ⏳ Belum | - |

## Langkah Selanjutnya
- Selesaikan testing untuk output HTML
- Review dengan CEO

## Blokir (Blockers)
- Menunggu keputusan klien tentang format PDF

## Catatan Penting
- Sprint 2 berhasil menghasilkan prototype HTML
- Output sementara menggunakan data dummy
```

### 7.4 DECISIONS.MD — Log Keputusan

> **💡 Kutipan dari 120x.ai:**
> *"Decisions is important. I found this is critical. That's the house rules. What we decide when something is important."*

```markdown
# DECISIONS.MD - Log Keputusan

## Format
[YYYY-MM-DD] Keputusan: [Apa yang diputuskan]
  Alasan: [Mengapa]
  Dibuat oleh: [Siapa]
  Dampak: [Apa yang berubah]

## Daftar Keputusan

[2025-01-16] Keputusan: Menggunakan ExcelJS untuk parsing Excel
  Alasan: Lebih ringan dari SheetJS, cukup untuk kebutuhan demo
  Dibuat oleh: Tim
  Dampak: Perlu install exceljs sebagai dependency

[2025-01-16] Keputusan: Output newsletter dalam format HTML
  Alasan: Mudah di-share via email, tidak perlu software khusus
  Dibuat oleh: CEO
  Dampak: Output berupa file .html yang bisa dibuka di browser

[2025-01-22] Keputusan: Data dummy untuk sprint 2
  Alasan: Fokus pada UI/UX dulu, data real di sprint berikutnya
  Dibuat oleh: Tim
  Dampak: Sprint 2 menggunakan data sampel
```

### 7.5 DOMAIN.MD — Domain Bisnis

**Fungsi:** Dunia bisnis klien Anda (bukan domain internet).

```markdown
# DOMAIN.MD - Domain Bisnis

## Tentang Perusahaan
- Nama: PT. Maju Bersama
- Bidang: Manufaktur
- Jumlah Karyawan: 50 orang

## Terminologi Penting
- "Invoice" = Tagihan yang dikirim ke klien
- "Bill" = Tagihan yang diterima dari vendor
- "SO" = Sales Order (pesanan penjualan)
- "PO" = Purchase Order (pesanan pembelian)

## Pengguna Sistem
| Role | Akses | Keterangan |
|------|-------|------------|
| CEO | Full access | Melihat semua laporan |
| CFO | Keuangan | Edit & approve laporan keuangan |
| Manager | Departemen | Akses data departemen sendiri |
| Staff | Terbatas | Input data saja |

## Aturan Bisnis
1. Laporan keuangan harus di-approve CFO sebelum dikirim ke CEO
2. Invoice > 100 juta butuh approval direktur
3. Data inventory di-update real-time
4. Backup data dilakukan setiap hari jam 6 sore

## Pain Points
- Proses konsolidasi data dari 5 spreadsheet memakan 3-4 jam/minggu
- Format laporan tidak konsisten antar departemen
- Sulit melacak perubahan data dari waktu ke waktu
```

### 7.6 RISKS.MD — Daftar Risiko

```markdown
# RISKS.MD - Daftar Risiko

## Format
⚠️ [KEMungkinan: Tinggi/Sedang/Rendah] RISIKO: [Deskripsi]
  Dampak: [Tinggi/Sedang/Rendah]
  Mitigasi: [Solusi]

## Daftar Risiko

⚠️ [TINGGI] RISIKO: API pihak ketiga memiliki rate limit ketat
  Dampak: Tinggi — aplikasi bisa error saat banyak request
  Mitigasi: Implementasi caching, retry logic, dan queue

⚠️ [SEDANG] RISIKO: Data Excel dari klien format tidak konsisten
  Dampak: Sedang — parsing bisa gagal
  Mitigasi: Buat parser fleksibel dengan validasi input

⚠️ [SEDANG] RISIKO: Perubahan kebutuhan di tengah sprint
  Dampak: Sedang — scope creep
  Mitigasi: Dokumentasikan semua perubahan, buat sprint baru jika perlu

⚠️ [RENDAH] RISIKO: Tool AI mengubah dependensi ke versi lama
  Dampak: Rendah — compatibility issues
  Mitigasi: Pin versi di specification, verifikasi manual
```

### 7.7 QUESTIONS.MD — Pertanyaan Terbuka

```markdown
# QUESTIONS.MD - Pertanyaan Terbuka

## Format
❓ [OPEN] Pertanyaan: [Isi]
  Ditanya: [Tanggal]
  Dari: [Siapa]
  Status: [Menunggu jawaban / Dijawab]

## Pertanyaan Terbuka

❓ [OPEN] Pertanyaan: Bagaimana format laporan yang diinginkan CEO?
  Ditanya: 2025-01-15
  Dari: Architect
  Status: Menunggu jawaban dari CEO

❓ [OPEN] Pertanyaan: Apakah perlu integrasi dengan sistem ERP yang ada?
  Ditanya: 2025-01-16
  Dari: Builder
  Status: Menunggu keputusan CTO

## Pertanyaan yang Sudah Dijawab

✅ [CLOSED] Pertanyaan: Berapa banyak spreadsheet yang perlu diproses?
  Jawaban: 5 spreadsheet utama + 2 PDF pendukung
  Ditutup: 2025-01-14

✅ [CLOSED] Pertanyaan: Siapa pengguna utama?
  Jawaban: CEO, CFO, dan Business Owner
  Ditutup: 2025-01-15
```

---

## 8. WORKFLOW LENGKAP 6 TAHAP

### 8.1 Gambaran Besar Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    WORKFLOW 6 TAHAP                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  TAHAP 1: PERSIAPAN                                               │
│  ├── Buat folder proyek                                          │
│  ├── Setup project di LLM                                        │
│  ├── Set custom instructions                                     │
│  └── Upload referensi                                            │
│       ↓                                                           │
│  TAHAP 2: DISCOVERY & BRAINSTORMING                              │
│  ├── Mulai percakapan dengan architect                           │
│  ├── Jawab semua pertanyaan architect                            │
│  ├── Brainstorm solusi                                           │
│  └── Definisikan masalah & tujuan                                │
│       ↓                                                           │
│  TAHAP 3: BUAT ARCHITECT PACK                                    │
│  ├── Requirements (Apa & Mengapa)                                │
│  ├── Blueprint (Bagaimana)                                       │
│  ├── Acceptance Criteria (Kriteria Selesai)                      │
│  └── Handoff Prompt (Prompt untuk Builder)                       │
│       ↓                                                           │
│  TAHAP 4: HANDOFF KE BUILDER                                     │
│  ├── Simpan architect pack di folder                             │
│  ├── Buka builder tool                                           │
│  ├── Paste handoff prompt                                        │
│  └── Builder dry run → Lapor hasil                               │
│       ↓                                                           │
│  TAHAP 5: BUILDER BEKERJA                                        │
│  ├── Review dry run result                                       │
│  ├── Approve → Builder mulai coding                              │
│  ├── Builder selesai → Lapor hasil                               │
│  └── Builder update folder proyek                                │
│       ↓                                                           │
│  TAHAP 6: REVIEW & LANJUT                                        │
│  ├── Architect review hasil builder                              │
│  ├── Sanity check dengan data asli                               │
│  ├── Buat architect pack untuk sprint berikutnya                 │
│  └── Ulangi dari Tahap 3 untuk sprint berikutnya                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Tahap 1: Persiapan (Detail)

#### Langkah 1.1: Buat Folder Proyek
```bash
# Di terminal atau file manager:
mkdir dashboard-keuangan-ceo
cd dashboard-keuangan-ceo

# Buat struktur folder:
mkdir -p docs planning/meetings planning/sprints/sprint-001
mkdir -p planning/sprints/sprint-02 references src architect-packs
mkdir -p .claude/skills .claude/agents .claude/hooks
```

#### Langkah 1.2: Buat File Kosong
```bash
# Buat semua file markdown yang diperlukan:
touch AGENTS.MD CLAUDE.MD README.MD STATE.MD DECISIONS.MD
touch DOMAIN.MD RISKS.MD QUESTIONS.MD FILE-INVENTORY.MD
touch docs/ARCHITECTURE.MD docs/DATA-MODEL.MD docs/API.MD
touch docs/PERMISSIONS.MD docs/VALIDATION.MD
```

#### Langkah 1.3: Isi File Kosong dengan Template
Copy template dari Bagian 7 ke masing-masing file.

### 8.3 Tahap 2: Discovery & Brainstorming (Detail)

#### Mulai Percakapan dengan Architect

```
CONTOH PROMPT AWAL:
═══════════════════════════════════════════════════

Saya ingin membangun [deskripsi aplikasi].

Saya menggunakan metode Architect-Builder. Tolong bantu saya 
brainstorm dan buat rencana awal.

Masalah yang ingin diselesaikan:
[Deskripsi masalah bisnis]

Pengguna utama:
[Siapa yang akan menggunakan]

Pain points saat ini:
[Apa yang menjadi masalah]

Format output yang diinginkan:
[Apa yang diharapkan]

═══════════════════════════════════════════════════
```

#### Architect Akan Bertanya Banyak Hal

```
Architect: "Ini ide bagus. Sebelum saya buat rencana, 
            saya perlu memahami beberapa hal:

  1. Workflow saat ini seperti apa?
     → Bagaimana proses berjalan sekarang?

  2. Dimana waktu terbuang?
     → Berapa lama proses ini sekarang?

  3. Siapa saja pengguna utama?
     → Berapa banyak role yang berbeda?

  4. Apa format output yang diinginkan?
     → HTML? PDF? Dashboard?

  5. Apa batasan teknis yang ada?
     → Budget? Timeline? Tools yang sudah ada?

  6. Apa data sumber yang tersedia?
     → Spreadsheet? Database? API?

  7. Bagaimana dengan keamanan data?
     → Data sensitif? Compliance?

  8. Apa success metric-nya?
     → Bagaimana kita tahu proyek ini berhasil?"
```

**Tips untuk tahap ini:**
```
✅ Jawab dengan detail, meski masih kasar
✅ Gunakan bahasa bisnis Anda sehari-hari
✅ Jangan takut salah — architect akan mengklarifikasi
✅ Berikan contoh konkret jika memungkinkan
✅ Jangan terburu-buru ke coding
✅ Jika tidak tahu jawabannya, bilang "belum tahu" — nanti diisi
```

### 8.4 Tahap 3: Membuat Architect Pack (Detail)

Setelah semua pertanyaan terjawab:

```
Anda: "Baik, semua pertanyaan sudah terjawab. 
       Sekarang buatkan Architect Pack untuk Sprint 1."
```

#### Isi Architect Pack (4 Dokumen)

**Dokumen 1: REQUIREMENTS.MD**
```markdown
# REQUIREMENTS - Sprint 001: Discovery & Architecture

## Tujuan Sprint
Memahami masalah bisnis secara mendalam dan membuat rencana awal.

## Apa yang Dibangun
- Dashboard untuk CEO yang menampilkan KPI utama
- Newsletter otomatis dari data spreadsheet

## Mengapa
- CEO menghabiskan 3-4 jam/minggu untuk mengkonsolidasi data
- Dengan dashboard, waktu bisa dikurangi menjadi < 30 menit

## Pengguna
- CEO (view only)
- CFO (edit & approve)
- Business Owner (view & download)

## Data Sumber
- 5 spreadsheet Excel dari departemen berbeda
- 2 PDF laporan dari accountant

## Output yang Diharapkan
- Dashboard HTML interaktif
- Newsletter HTML mingguan
- Laporan bulanan untuk board meeting

## Batasan
- Tidak perlu database (gunakan Excel sebagai source)
- Tidak perlu authentication (internal tool)
- Output harus bisa di-share via email
```

**Dokumen 2: BLUEPRINT.MD**
```markdown
# BLUEPRINT - Sprint 001: Discovery & Architecture

## Arsitektur Sistem

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Excel Files  │────▶│  Parser/     │────▶│  Generator   │
│  (5 files)    │     │  Processor   │     │  (HTML)      │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                      │
                     ┌──────┴──────┐        ┌──────┴──────┐
                     │  Validation │        │  Output     │
                     │  Engine     │        │  (HTML)     │
                     └─────────────┘        └─────────────┘

## Tech Stack
- Runtime: Node.js
- Parsing: ExcelJS
- Template: Handlebars
- Testing: Jest

## File yang Akan Dibuat
1. src/parser/excel-parser.js — Parsing Excel
2. src/generator/html-generator.js — Generate HTML
3. src/validator/data-validator.js — Validasi data
4. src/index.js — Entry point

## Dependensi
- exceljs: ^4.4.0
- handlebars: ^4.7.8
- jest: ^29.7.0
```

**Dokumen 3: ACCEPTANCE.MD**
```markdown
# ACCEPTANCE CRITERIA - Sprint 001

## Definisi "Selesai"

Sprint ini dianggap SELESAI jika:

### Checklist
- [ ] Dashboard HTML bisa dibuka di browser
- [ ] Data dari Excel berhasil di-parse
- [ ] Newsletter HTML ter-generate dengan benar
- [ ] Tidak ada error saat运行
- [ ] Test cases passing

### Test Cases
1. Parse file Excel dengan data valid → Berhasil
2. Parse file Excel dengan data kosong → Error handling OK
3. Generate HTML dengan data lengkap → Output valid
4. Generate HTML dengan data parsial → Graceful degradation

### Output yang Bisa Didemonstrasikan
- Buka dashboard.html di browser → Tampil data
- Buka newsletter.html di browser → Tampil newsletter
```

**Dokumen 4: HANDOFF-PROMPT.MD**
```markdown
# HANDOFF PROMPT - Sprint 001

## Prompt untuk Builder

Anda adalah BUILDER dalam metode Architect-Builder.

Tugas Anda untuk Sprint 001:
1. Baca architect pack ini dengan seksama
2. Baca AGENTS.MD untuk aturan umum
3. Baca STATE.MD untuk status terkini
4. Lakukan dry run (simulasi tanpa kode)
5. Laporkan rencana implementasi
6. TUNGGU persetujuan sebelum coding

JANGAN:
- Mulai coding tanpa persetujuan
- Mengubah requirements
- Menggunakan library yang tidak disebutkan di blueprint

SETUJU:
- Setelah dry run disetujui, mulai coding
- Buat test untuk setiap fitur
- Update STATE.MD saat selesai
```

### 8.5 Tahap 4: Handoff ke Builder (Detail)

#### Langkah 4.1: Simpan Architect Pack
```
1. Download/copy architect pack dari architect
2. Simpan di root folder proyek:
   /dashboard-keuangan-ceo/architect-pack-001-discovery.md

3. Update folder sprint:
   /planning/sprints/sprint-001/REQUIREMENTS.MD
   /planning/sprints/sprint-001/BLUEPRINT.MD
   /planning/sprints/sprint-001/ACCEPTANCE.MD
   /planning/sprints/sprint-001/HANDOFF-PROMPT.MD
```

#### Langkah 4.2: Buka Builder Tool

**Di Codex:**
```
1. Buka Codex
2. Mulai new project
3. Point ke folder proyek:
   /Users/nama/Desktop/dashboard-keuangan-ceo
4. Mulai new chat
5. Rename chat: "Sprint 001 - Discovery & Architecture"
6. Paste prompt dari HANDOFF-PROMPT.MD
```

**Di Claude Code:**
```bash
# Buka terminal di folder proyek:
cd ~/Desktop/dashboard-keuangan-ceo

# Jalankan Claude Code:
claude

# Mulai dengan plan mode:
# Tekan Shift+Tab sampai status bar menunjukkan "⏸ plan mode"
# Lalu paste prompt dari HANDOFF-PROMPT.MD
```

#### Langkah 4.3: Builder Melakukan Dry Run

Builder akan:
```
1. Membaca architect pack
2. Membaca AGENTS.MD dan STATE.MD
3. Melakukan dry run (simulasi)
4. Melaporkan:
   ├── Apa yang akan dibangun
   ├── File apa saja yang akan dibuat/diubah
   ├── Dependensi yang diperlukan
   ├── Risiko yang teridentifikasi
   └── Rencana implementasi
5. MENUNGGU persetujuan sebelum menulis kode
```

### 8.6 Tahap 5: Builder Bekerja (Detail)

#### Review Dry Run Result
```
Anda: [review rencana builder]
     [jika ada masalah] "Tolong ubah bagian X..."
     [jika sudah OK] "Approved. Mulai coding."
```

#### Builder Mulai Coding
```
Builder akan:
1. Membuat file-file sesuai blueprint
2. Menginstall dependensi
3. Menulis kode
4. Menulis test
5. Menjalankan test
6. Memperbaiki error jika ada
7. Update folder proyek
8. Melaporkan hasil
```

#### Builder Melapor
```
Builder: "Sprint 001 selesai. Berikut hasilnya:

Files yang dibuat:
├── src/parser/excel-parser.js ✓
├── src/generator/html-generator.js ✓
├── src/validator/data-validator.js ✓
├── src/index.js ✓
├── test/parser.test.js ✓
└── test/generator.test.js ✓

Test Results:
✓ Parse valid Excel → Pass
✓ Handle empty Excel → Pass  
✓ Generate HTML → Pass
✓ Validate data → Pass

Known Limitations:
- Belum handle Excel dengan multiple sheets
- Output masih menggunakan data dummy

Output files:
├── output/dashboard.html ✓
└── output/newsletter.html ✓
```

### 8.7 Tahap 6: Review & Lanjut (Detail)

#### Langkah 6.1: Review Hasil Builder
```
1. Buka output files di browser
2. Cek apakah tampil sesuai harapan
3. Jalankan test sekali lagi
4. Catat masalah jika ada
```

#### Langkah 6.2: Sanity Check dengan Architect
```
Anda: "Builder baru saja selesai Sprint 1. 
       Ini ringkasan hasilnya:
       [paste ringkasan builder]
       
       Output files bisa dibuka di:
       - output/dashboard.html
       - output/newsletter.html
       
       Bagaimana menurut Anda? Apakah sesuai rencana?"
```

#### Langkah 6.3: Architect Review
```
Architect akan:
1. Memvalidasi hasil sesuai rencana
2. Mengidentifikasi masalah yang terlewat
3. Membuat architect pack untuk sprint berikutnya
4. Memberikan prompt baru untuk builder
```

#### Langkah 6.4: Update Folder Proyek
```
Update:
├── STATE.MD → Sprint 1 selesai, status terbaru
├── DECISIONS.MD → Keputusan yang diambil selama sprint
├── RISKS.MD → Risiko baru yang teridentifikasi
└── QUESTIONS.MD → Pertanyaan baru yang muncul
```

#### Langkah 6.5: Ulangi untuk Sprint Berikutnya
```
Mulai dari Tahap 3 untuk Sprint 2:
1. Architect membuat architect pack baru
2. Save di folder
3. Buka builder, mulai chat baru
4. Rename: "Sprint 002 - [Nama Sprint]"
5. Paste prompt baru
6. Builder bekerja
7. Review
8. Ulangi...
```

---

## 9. CONTEXT ENGINEERING: RAHASIA TERBESAR

### 9.1 Apa Itu Context Engineering?

> **💡 Kutipan dari Anthropic:**
> *"Most best practices are based on one constraint: Claude's context window fills up fast, and performance degrades as it fills."*

**Context Engineering** adalah seni mengelola **apa informasi** yang diberikan ke AI, **kapan** informasi itu diberikan, dan **dalam format apa**.

### 9.2 Mengapa Context Window Itu Penting?

```
Context Window AI:
┌─────────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░ KAPASITAS TOTAL ░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░ (misal: 200K tokens) ░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└─────────────────────────────────────────────────────┘

Masalah:
- Setiap message, file yang dibaca, command output → mengisi context
- Satu debugging session bisa menghabiskan puluhan ribu tokens
- Semakin penuh context → AI semakin sering "lupa" dan membuat kesalahan
```

### 9.3 Perbandingan: Context Messy vs Context Clean

```
❌ VIBE CODING (Context Messy):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Chat 1: "Buat app inventaris" → AI menebak
Chat 2: "Tambahkan approval" → AI bingung konteks sebelumnya
Chat 3: "Eh salah, yang tadi" → Chat sudah terlalu panjang
Chat 4: "Dimana keputusan yang tadi?" → Tidak ada yang mencatat

Context window:
[████████████████████████████████] 100% PENUH!
→ AI mulai "lupa" instruksi awal
→ AI mulai improvisasi
→ Error semakin banyak

✅ ARCHITECT-BUILDER (Context Clean):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Architect Pack 001: Requirements + Blueprint + Acceptance
Architect Pack 002: Persis setelah Sprint 1 selesai
Architect Pack 003: Persis setelah Sprint 2 selesai

Context window per sprint:
[████████░░░░░░░░░░░░] 40% — Masih banyak ruang!
→ AI punya konteks yang tepat dan terkini
→ Tidak perlu "menggali" chat lama
→ Error berkurang drastis
```

### 9.4 Prinsip Context Engineering

| Prinsip | Penjelasan | Contoh |
|---------|-----------|--------|
| **Minimal Context** | Berikan hanya informasi yang dibutuhkan saat itu | Jangan upload seluruh codebase jika hanya butuh 1 file |
| **Right Time** | Informasi diberikan saat dibutuhkan | Requirements diberikan SEBELUM coding, bukan sesudah |
| **Structured** | Konteks diorganisir dalam folder/file | Gunakan folder system, bukan chat history |
| **Updated** | Konteks selalu diperbarui | Update STATE.MD setelah setiap sprint |
| **Traceable** | Setiap keputusan bisa ditelusuri | DECISIONS.MD mencatat semua keputusan |

### 9.5 Strategi Mengelola Context

> **💡 Kutipan dari Anthropic:**
> *"Use /clear frequently between tasks to reset the context window entirely."*

```
Strategi Mengelola Context:
═══════════════════════════════════════════════════

1. RESET ANTAR TASK
   Gunakan /clear (Claude Code) atau mulai chat baru (Codex)
   untuk setiap sprint yang berbeda

2. FILE-BASED CONTEXT
   Baca dari file (STATE.MD, DECISIONS.MD) bukan dari
   riwayat chat

3. PRIORITAS INFORMASI
   ┌─────────────────────────────────────────┐
   │ WAJIB BACA (setiap sesi):               │
   │ ├── AGENTS.MD                           │
   │ ├── STATE.MD                            │
   │ └── Sprint file yang aktif              │
   │                                         │
   │ BACA JIKA PERLU:                        │
   │ ├── DECISIONS.MD                        │
   │ ├── DOMAIN.MD                           │
   │ └── RISKS.MD                            │
   │                                         │
   │ BACA SAAT DIBUTUHKAN:                   │
   │ ├── docs/*                              │
   │ ├── QUESTIONS.MD                        │
   │ └── FILE-INVENTORY.MD                   │
   └─────────────────────────────────────────┘

4. GUNAKAN SUBAGENTS
   Untuk riset atau verifikasi, gunakan subagent
   yang berjalan di context terpisah

5. COMPACTION
   Jika session terlalu panjang, gunakan /compact
   untuk merangkum percakapan
═══════════════════════════════════════════════════
```

---

## 10. SPRINT-BASED DEVELOPMENT

### 10.1 Apa Itu Sprint?

**Sprint** adalah unit pekerjaan terkecil dalam metode ini. Setiap sprint memiliki:
- **Awal yang jelas** — Apa yang akan dikerjakan
- **Akhir yang jelas** — Kapan sprint dianggap selesai
- **Kriteria keberhasilan** — Bagaimana menilai sprint berhasil
- **Deliverable yang konkret** — Apa yang dihasilkan

### 10.2 Struktur Sprint

```
╔═══════════════════════════════════════════════════════╗
║  SPRINT N                                             ║
╠═══════════════════════════════════════════════════════╣
║  📋 Nama: [Nama Sprint]                               ║
║  🎯 Tujuan: [Apa yang ingin dicapai]                  ║
║  📊 Status: [Belum dimulai / Berjalan / Selesai]      ║
║  📅 Tanggal: [Mulai - Selesai]                        ║
╠═══════════════════════════════════════════════════════╣
║                                                        ║
║  1. 📄 REQUIREMENTS (Apa & Mengapa)                    ║
║     ├── Definisi masalah                               ║
║     ├── Pengguna yang terdampak                        ║
║     └── Output yang diharapkan                         ║
║                                                        ║
║  2. 📐 BLUEPRINT (Bagaimana)                           ║
║     ├── Arsitektur teknis                              ║
║     ├── File yang akan dibuat/diubah                   ║
║     ├── Dependensi yang diperlukan                     ║
║     └── Rencana implementasi                           ║
║                                                        ║
║  3. ✅ ACCEPTANCE (Kriteria Selesai)                   ║
║     ├── Checklist yang harus terpenuhi                 ║
║     ├── Test cases                                     ║
║     └── Output yang bisa didemonstrasikan              ║
║                                                        ║
║  4. 🤝 HANDOFF PROMPT                                  ║
║     └── Prompt lengkap untuk builder                   ║
║                                                        ║
╚═══════════════════════════════════════════════════════╝
```

### 10.3 Contoh Rencana Sprint untuk Proyek Dashboard

```
SPRINT 001: Discovery & Architecture Planning
─────────────────────────────────────────────
Tujuan: Memahami masalah dan membuat rencana awal
Output: Architect Pack pertama, folder structure
Kriteria: Semua pertanyaan terjawab, rencana tersusun
Durasi: 1-2 hari

SPRINT 002: Sample Bundle (Proof of Concept)
─────────────────────────────────────────────
Tujuan: Membuat prototype pertama yang bisa dilihat
Output: HTML dashboard + newsletter contoh
Kriteria: Output bisa dibuka di browser, data dummy tampil
Durasi: 2-3 hari

SPRINT 003: Executive Output Polish
─────────────────────────────────────────────
Tujuan: Menyempurnakan output agar siap presentasi
Output: Dashboard & newsletter versi final
Kriteria: Format profesional, data akurat
Durasi: 2-3 hari

SPRINT 004: Data Integration
─────────────────────────────────────────────
Tujuan: Menghubungkan dengan data Excel real
Output: Sistem parsing Excel yang berfungsi
Kriteria: Berhasil parse semua 5 spreadsheet
Durasi: 3-4 hari

SPRINT 005: Testing & Refinement
─────────────────────────────────────────────
Tujuan: Memastikan semua berfungsi dengan benar
Output: Hasil test, bug fixes
Kriteria: Semua test passing, tidak ada error kritis
Durasi: 2-3 hari

SPRINT 006: Deployment & Documentation
─────────────────────────────────────────────
Tujuan: Menyiapkan untuk produksi
Output: Deployed app + dokumentasi
Kriteria: Bisa diakses oleh pengguna akhir
Durasi: 1-2 hari
```

### 10.4 Alur Kerja Detail per Sprint

```
┌─────────────────────────────────────────────────────────────┐
│                ALUR KERJA DETAIL PER SPRINT                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  PHASE A: ARCHITECT WORK                                      │
│  ─────────────────────                                        │
│  1. Architect membuat Architect Pack                          │
│     ├── Requirements.MD                                       │
│     ├── Blueprint.MD                                          │
│     ├── Acceptance.MD                                         │
│     └── Handoff-Prompt.MD                                     │
│  2. Save pack di root folder proyek                           │
│  3. Update planning/sprints/sprint-XXX/                       │
│       ↓                                                       │
│  PHASE B: BUILDER SETUP                                       │
│  ────────────────────                                         │
│  4. Buka Builder (Codex/Claude Code)                          │
│  5. Mulai chat baru                                           │
│  6. Rename: "Sprint XXX - [Nama Sprint]"                     │
│  7. Arahkan ke folder proyek                                  │
│       ↓                                                       │
│  PHASE C: DRY RUN                                             │
│  ──────────────                                               │
│  8. Paste prompt dari Handoff-Prompt.MD                       │
│  9. Builder membaca architect pack                            │
│  10. Builder melakukan dry run                                │
│  11. Builder melapor rencana implementasi                     │
│       ↓                                                       │
│  PHASE D: REVIEW DRY RUN                                      │
│  ────────────────────                                         │
│  12. Anda review rencana builder                              │
│  13. Jika ada masalah → Minta perbaikan                       │
│  14. Jika sudah OK → Approve                                  │
│       ↓                                                       │
│  PHASE E: IMPLEMENTASI                                        │
│  ───────────────────                                          │
│  15. Builder mulai coding                                     │
│  16. Builder menulis test                                     │
│  17. Builder menjalankan test                                 │
│  18. Builder memperbaiki error                                │
│       ↓                                                       │
│  PHASE F: LAPOR HASIL                                        │
│  ──────────────────                                           │
│  19. Builder melapor hasil                                    │
│     ├── Files yang dibuat                                     │
│     ├── Test results                                          │
│     ├── Output files                                          │
│     └── Known limitations                                     │
│       ↓                                                       │
│  PHASE G: REVIEW & VALIDATE                                   │
│  ────────────────────────                                     │
│  20. Anda review output                                       │
│  21. Architect sanity check                                   │
│  22. Update STATE.MD                                          │
│  23. Update DECISIONS.MD jika ada keputusan baru              │
│       ↓                                                       │
│  PHASE H: PERSIAPAN SPRINT BERIKUTNYA                         │
│  ──────────────────────────────────                           │
│  24. Architect membuat pack baru                              │
│  25. Ulangi dari Phase B                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. CARA MENULIS PROMPT YANG BENAR

### 11.1 Prinsip Dasar Prompt Engineering

> **💡 Kutipan dari Anthropic:**
> *"The more precise your instructions, the fewer corrections you'll need. Claude can infer intent, but it can't read your mind."*

#### Aturan Emas: Prompt yang Baik

```
❌ PROMPT YANG BURUK:
"buatkan saya fitur login"

✅ PROMPT YANG BAIK:
"Buat fitur login di src/auth/login.js dengan:
- Input: email dan password
- Validasi: email harus format valid, password minimal 8 karakter
- Output: JWT token jika berhasil, error message jika gagal
- Test: tulis test untuk kasus berhasil dan gagal
- Refer: lihat pattern di src/auth/register.js sebagai contoh"
```

### 11.2 Template Prompt untuk Berbagai Situasi

#### Prompt untuk Architect (Brainstorming)
```
Saya ingin membangun [deskripsi aplikasi].

Masalah yang ingin diselesaikan:
[Deskripsi masalah]

Pengguna utama:
[Siapa]

Saat ini proses dilakukan dengan cara:
[Workflow sekarang]

Saya ingin mengurangi waktu dari [X jam] menjadi [Y menit].

Tolong bantu saya brainstorm:
1. Apa saja fitur yang dibutuhkan?
2. Apa workflow yang ideal?
3. Apa risiko yang perlu diperhatikan?
4. Berapa sprint yang diperlukan?
```

#### Prompt untuk Builder (Implementasi)
```
Anda adalah BUILDER. Tugas: implementasi Sprint [X].

Baca file-file berikut:
1. AGENTS.MD (aturan umum)
2. STATE.MD (status terkini)
3. architect-pack-[XXX].md (rencana sprint ini)

Lakukan:
1. Dry run dulu — rencanakan apa yang akan dibuat
2. Laporkan rencana implementasi
3. TUNGGU persetujuan sebelum coding

JANGAN mulai coding tanpa persetujuan.
```

#### Prompt untuk Review
```
Tolong review hasil Sprint [X].

File yang dihasilkan:
[list file]

Test results:
[paste test output]

Yang perlu di-review:
1. Apakah sesuai requirements?
2. Ada bug atau issue?
3. Ada improvement yang bisa dilakukan?
4. Apakah siap untuk sprint berikutnya?
```

### 11.3 Prompt Spesifik Berdasarkan Tool

#### Untuk Claude Code
```
# Gunakan plan mode untuk eksplorasi:
/read /src/auth and understand how we handle sessions

# Gunakan @ untuk reference file:
implement the OAuth flow from @docs/BLUEPRINT.MD

# Gunakan /clear antar task:
/clear

# Gunakan subagent untuk verifikasi:
Use a subagent to review this diff against PLAN.md
```

#### Untuk Codex
```
# Mulai dengan context yang jelas:
You are the builder. First apply this architect pack.
Read all files, then summarize what we're building.

# Rename chat untuk organisasi:
Sprint 001 - Discovery & Architecture

# Laporkan hasil dengan detail:
Here is the results of sprint X from Codex:
[ringkasan lengkap]
```

---

## 12. SISTEM VERIFIKASI & REVIEW

### 12.1 Mengapa Verifikasi Itu Penting?

> **💡 Kutipan dari Anthropic:**
> *"Give Claude a check it can run: tests, a build, a screenshot to compare. It's the difference between a session you watch and one you walk away from."*

> **💡 Kutipan dari Chris Titus Tech:**
> *"Spend More Effort on Review Than Generation. This is where most of my AI usage goes."*

### 12.2 Jenis Verifikasi

```
┌─────────────────────────────────────────────────────────────┐
│              JENIS VERIFIKASI                                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. 🧪 AUTOMATED TESTING                                     │
│     ├── Unit tests                                            │
│     ├── Integration tests                                     │
│     ├── E2E tests                                             │
│     └── Test runner: Jest, Vitest, Pytest, dll               │
│                                                               │
│  2. 🔍 LINTING & TYPE CHECK                                  │
│     ├── ESLint, Prettier (JavaScript)                         │
│     ├── mypy (Python)                                         │
│     └── TypeScript compiler                                   │
│                                                               │
│  3. 🏗️ BUILD CHECK                                           │
│     ├── Production build                                      │
│     ├── Bundle size check                                     │
│     └── Dependency audit                                      │
│                                                               │
│  4. 👁️ VISUAL VERIFICATION                                   │
│     ├── Screenshot comparison                                 │
│     ├── Browser testing                                       │
│     └── Responsive design check                               │
│                                                               │
│  5. 🔒 SECURITY CHECK                                        │
│     ├── Dependency vulnerability scan                         │
│     ├── CodeQL analysis                                       │
│     └── Secret detection                                      │
│                                                               │
│  6. 🤖 AI REVIEW (Subagent)                                  │
│     ├── Code review oleh AI lain                              │
│     ├── Fresh context review                                  │
│     └── Adversarial review                                    │
│                                                               │
│  7. 👤 HUMAN REVIEW                                          │
│     ├── Manual code review                                    │
│     ├── Functional testing                                    │
│     └── Acceptance testing                                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 12.3 Workflow Review dari Chris Titus Tech

```
WORKFLOW REVIEW CHRIS TITUS TECH:
═══════════════════════════════════════════════════

1. LOCAL VALIDATION
   ├── git diff --check
   ├── Run formatter & linter
   ├── Run focused tests
   ├── Build production artifact
   └── Screenshot/visual check

2. PULL REQUEST
   ├── Buat PR kecil (small PRs are critical!)
   ├── Terangkan perubahan dengan jelas
   └── Tunggu CI passing

3. INDEPENDENT REVIEW
   ├── CodeRabbit review (AI review)
   ├── Codex/Claude review (AI lain)
   └── Human review (jika ada tim)

4. ADDRESS FEEDBACK
   ├── Review setiap komentar
   ├── Fix root cause, bukan symptom
   ├── Update test jika perlu
   └── Push perbaikan

5. MANUAL VERIFICATION
   ├── Cek diff hanya berisi perubahan yang dimaksud
   ├── Tests & builds passing di commit terakhir
   ├── Independent review selesai
   ├── Documentation match behavior
   └── Feature works di real environment

6. MERGE
   └── Setelah semua gate passed
═══════════════════════════════════════════════════
```

### 12.4 Writer/Reviewer Pattern

> **💡 Kutipan dari Anthropic:**
> *"Use a Writer/Reviewer pattern: Session A (Writer), Session B (Reviewer)."*

```
Pola Writer/Reviewer:
═══════════════════════════════════════════════════

Session A (Writer):
├── Implement fitur sesuai plan
├── Tulis test
└── Laporkan hasil

Session B (Reviewer):
├── Review diff dengan FRESH context
├── Cari edge cases yang terlewat
├── Cek consistency dengan codebase
├── Laporkan gaps (bukan style preferences)
└── Reviewer HANYA mencari correctness issues

Loop:
Writer fix → Re-review → sampai tidak ada critical findings

═══════════════════════════════════════════════════
```

### 12.5 Adversarial Review

> **💡 Kutipan dari Anthropic:**
> *"Before treating a task as done, have a subagent review the diff in a fresh context and report gaps."*

```
CONTOH ADVERSARIAL REVIEW PROMPT:
═══════════════════════════════════════════════════

Use a subagent to review the [feature name] diff 
against PLAN.md. Check that:
1. Every requirement is implemented
2. The listed edge cases have tests
3. Nothing outside the task's scope changed

Report gaps, not style preferences.
Flag only gaps that affect correctness or 
the stated requirements.

═══════════════════════════════════════════════════
```

---

## 13. KEAMANAN & DEPENDENCY CHECK

### 13.1 Mengapa Keamanan Itu Penting?

> **💡 Kutipan dari Chris Titus Tech:**
> *"LLMs are useful, but they are not reliable dependency managers or security auditors."*

### 13.2 Tools Keamanan yang Direkomendasikan

```
TOOLS KEAMANAN:
═══════════════════════════════════════════════════

1. DEPENDABOT (GitHub)
   ├── Auto-update dependencies
   ├── Security alerts
   └── PR untuk dependency updates

2. CODEQL (GitHub)
   ├── Code scanning
   ├── Vulnerability detection
   └── Pattern matching untuk security issues

3. DEPENDENCY REVIEW (GitHub)
   ├── Risky dependency changes detection
   ├── License compliance
   └── Vulnerability check

4. NPM AUDIT / YARN AUDIT
   ├── Check untuk known vulnerabilities
   └── Fix recommendations

═══════════════════════════════════════════════════
```

### 13.3 CI/CD Pipeline

> **💡 Kutipan dari Chris Titus Tech:**
> *"CI must run on every pull request update. A green check from an older commit does not prove that the latest review fix is safe."*

```
CI/CD PIPELINE:
═══════════════════════════════════════════════════

Setiap Pull Request harus melalui:
│
├── 🧪 Unit Tests
├── 🔍 Linting & Type Check
├── 🏗️ Production Build
├── 🔒 Security Scan (CodeQL)
├── 📦 Dependency Review
├── 🧪 Integration Tests
├── 📸 Visual Regression Tests (jika UI)
└── ✅ Semua harus PASS sebelum merge

═══════════════════════════════════════════════════
```

---

## 14. MANAJEMEN SESSION AI

### 14.1 Prinsip Dasar

> **💡 Kutipan dari Anthropic:**
> *"Conversations are persistent and reversible. Use this to your advantage!"*

### 14.2 Strategi Manajemen Session

```
MANAJEMEN SESSION:
═══════════════════════════════════════════════════

1. NAMA SETIAP SESSION
   ├── Sprint 001 - Discovery
   ├── Sprint 002 - Sample Bundle
   ├── Sprint 003 - Executive Output
   └── etc.

2. RESET ANTAR TASK
   ├── /clear (Claude Code)
   ├── New chat (Codex)
   └── Alasan: Konteks yang bersih > Konteks yang penuh

3. GUNAKAN CHECKPOINT
   ├── Claude Code: Esc + Esc → Rewind
   ├── Codex: Undo/Redo
   └── Alasan: Bisa coba sesuatu yang berisiko, lalu rollback

4. RESUME CONVERSATION
   ├── claude --continue (session terakhir)
   ├── claude --resume (pilih dari list)
   └── Alasan: Task bisa dilanjutkan di lain waktu

═══════════════════════════════════════════════════
```

### 14.3 Kapan Harus Mulai Chat Baru?

```
MULAI CHAT BARU KETIKA:
✅ Berganti sprint
✅ Topik yang dibahas sudah tidak relevan
✅ Sudah mengoreksi AI lebih dari 2 kali untuk hal sama
✅ Context sudah penuh (AI mulai "lupa")
✅ Ingin fokus pada task baru yang berbeda

JANGAN MULAI CHAT BARU KETIKA:
❌ Masih dalam sprint yang sama
❌ Butuh konteks dari percakapan sebelumnya
❌ Sedang dalam flow yang baik
```

### 14.4 Tanda-tanda Context Problems

```
TANDA CONTEXT PROBLEMS:
═══════════════════════════════════════════════════

⚠️ AI mulai mengulang pertanyaan yang sudah dijawab
⚠️ AI melupakan instruksi yang diberikan di awal
⚠️ AI membuat kesalahan yang sama berulang kali
⚠️ AI mengubah kode yang seharusnya tidak diubah
⚠️ AI menggunakan dependensi yang sudah usang
⚠️ AI memberikan jawaban yang tidak relevan

SOLUSI:
→ /clear dan mulai dengan prompt baru yang lebih spesifik
→ atau Mulai chat baru dengan context yang lebih fokus

═══════════════════════════════════════════════════
```

---

## 15. TOOLS & TEKNOLOGI YANG DIGUNAKAN

### 15.1 Daftar Tools

| Tool | Kategori | Kegunaan | Harga |
|------|----------|----------|-------|
| **ChatGPT** | LLM (Architect) | Brainstorming, perencanaan, review | Free / Plus $20/bln |
| **Claude** | LLM (Architect) | Brainstorming, perencanaan, review | Free / Pro $20/bln |
| **OpenAI Codex** | Coding Tool (Builder) | Menulis kode dari rencana | Included dengan ChatGPT Plus |
| **Claude Code** | Coding Tool (Builder) | Menulis kode dari rencana | Included dengan Claude Pro |
| **Cursor** | Coding Tool (Builder) | IDE dengan AI integration | Free / Pro $20/bln |
| **Obsidian** | Markdown Viewer | Membaca file markdown | Free |
| **GitHub** | Version Control | Menyimpan & mengelola kode | Free / Pro $4/bln |
| **CodeRabbit** | AI Review | Code review otomatis | Free tier available |

### 15.2 Perbandingan Architect Tools

```
CHATGPT vs CLAUDE untuk Architect:
═══════════════════════════════════════════════════

ChatGPT (GPT-4o/4.5):
├── ✅ Lebih cepat dalam respons
├── ✅ Integrasi Codex langsung
├── ✅ Project features lengkap
├── ✅ Custom instructions yang kuat
└── ❌ Kadang terlalu "顺应" user

Claude (Opus/Sonnet):
├── ✅ Lebih detail dalam analisis
├── ✅ Lebih konsisten dalam formatting
├── ✅ Plan mode yang sangat berguna
├── ✅ Subagents untuk verifikasi
└── ❌ Kadang terlalu verbose

KEDUANYA BAIK! Pilih yang paling nyaman untuk Anda.
═══════════════════════════════════════════════════
```

### 15.3 Perbandingan Builder Tools

```
CODEX vs CLAUDE CODE vs CURSOR untuk Builder:
═══════════════════════════════════════════════════

OpenAI Codex:
├── ✅ Terintegrasi dengan ChatGPT
├── ✅ Cloud-based execution
├── ✅ Background execution
├── ✅ Multi-file editing
└── ❌ Kontrol lebih terbatas

Claude Code:
├── ✅ CLI-based, full control
├── ✅ Plan mode untuk eksplorasi
├── ✅ Skills, hooks, subagents
├── ✅ Checkpoint & rewind
├── ✅ Sangat detail dalam reporting
└── ❌ Perlu terminal familiarity

Cursor:
├── ✅ IDE-based, visual
├── ✅ Inline editing
├── ✅ Multi-model support
├── ✅ Familiar untuk VS Code users
└── ❌ Context window lebih kecil

PILIH SESUAI KEBUTUHAN ANDA!
═══════════════════════════════════════════════════
```

---

## 16. TIPS PRAKTIS DAN BEST PRACTICES

### 16.1 Yang HARUS Dilakukan

#### ✅ Tips #1: Buat Project di LLM, Bukan Sekadar Chat
```
Di ChatGPT: Buat "Project" baru
Di Claude: Buat "Project" baru
Upload semua file referensi
Set custom instructions
Alasan: Lebih banyak context memory dan bisa set behavior
```

#### ✅ Tips #2: Rename Setiap Chat di Builder
```
Contoh naming:
- Sprint 001 - Discovery & Architecture
- Sprint 002 - Sample Bundle
- Sprint 003 - Executive Output Polish

Alasan: Mudah melacak apa yang dilakukan kapan
```

#### ✅ Tips #3: Selalu Kembali ke Architect untuk Review
```
Setelah builder selesai:
1. Copy hasilnya
2. Kembali ke architect
3. "Builder baru selesai Sprint X. Ini hasilnya. Bagaimana menurut Anda?"

Alasan: Architect melihat big picture dan bisa catch masalah
```

#### ✅ Tips #4: Update STATE.MD Secara Berkala
```
Setelah setiap sprint selesai:
- Update status sprint
- Update apa yang baru saja terjadi
- Update langkah selanjutnya
- Update jika ada blokir
```

#### ✅ Tips #5: Dokumentasikan Setiap Keputusan
```
Setiap kali ada keputusan → Tulis di DECISIONS.MD
Jangan biarkan keputusan "terkubur" di chat history
```

#### ✅ Tips #6: Gunakan Bahasa Bisnis, Bukan Teknis
```
Anda tidak perlu jadi programmer untuk jadi architect.
Gunakan bahasa bisnis Anda sehari-hari.
AI akan mengerti dan menerjemahkan ke bahasa teknis.
```

#### ✅ Tips #7: Buat PR Kecil (dari Chris Titus Tech)
```
> "Small pull requests are critical. They are faster to 
> understand, cheaper to review, and easier to fix or revert."

Praktik:
- 1 sprint = 1 PR (idealnya)
- Jika PR > 200 baris, pertimbangkan untuk split
- Jika review > 20 menit, PR terlalu besar
```

#### ✅ Tips #8: Berikan Bukti, Bukan Klaim (dari Anthropic)
```
> "Have Claude show evidence rather than asserting success."

Contoh:
❌ "Sudah berhasil"
✅ "Test results: 15/15 passing. Build: success. Screenshot: [link]"

Bukti yang bisa diberikan:
- Test output
- Command output
- Screenshot
- Build log
```

### 16.2 Yang TIDAK Boleh Dilakukan

#### ❌ Anti-Tip #1: Jangan Langsung ke Coding
```
❌ "Buatkan saya aplikasi manajemen inventaris"
✅ "Saya ingin membangun aplikasi manajemen inventaris. 
    Mari kita mulai dengan brainstorming requirements-nya."
```

#### ❌ Anti-Tip #2: Jangan Simpan Semua di Satu Chat Panjang
```
❌ Chat dengan 50+ message yang berisi semua keputusan
✅ Chat per sprint, dengan konteks yang segar
```

#### ❌ Anti-Tip #3: Jangan Biarkan AI Menebak Aturan Bisnis
```
❌ Biarkan AI menentukan siapa yang boleh akses apa
✅ Definisikan aturan akses di PERMISSIONS.MD
```

#### ❌ Anti-Tip #4: Jangan Skip Documentation
```
❌ "Nanti aja dokumentasinya"
✅ Update folder system SETELAH setiap sprint selesai
```

#### ❌ Anti-Tip #5: Jangan Trust Builder Tanpa Review
```
❌ Builder selesai → langsung push ke production
✅ Builder selesai → review → architect sanity check → baru lanjut
```

#### ❌ Anti-Tip #6: Jangan Trust AI untuk Security (dari Chris Titus Tech)
```
❌ Biarkan AI memilih semua dependensi
✅ Pin versi di specification, verifikasi manual
✅ Gunakan Dependabot & CodeQL
```

### 16.3 Tips untuk Non-Programmer

```
Anda tidak perlu belajar jadi full-time developer.
Yang Anda butuhkan:
1. Pahami gambaran besar (big picture)
2. Bisa mendefinisikan workflow
3. Bisa mendefinisikan aturan bisnis
4. Bisa mengorganisir informasi
5. Bisa mengevaluasi output

Keterampilan yang sudah Anda miliki:
✅ Menggunakan Excel dan pivot table
✅ Memahami workflow bisnis
✅ Mengetahui input dan output
✅ Memahami aturan dan approval
✅ Mengetahui laporan yang penting
→ Semua ini adalah "bahan mentah" untuk menjadi architect yang baik!
```

---

## 17. KESALAHAN UMUM & CARA MENGHINDARINYA

### 17.1 Daftar Kesalahan Umum

> **💡 Kutipan dari Anthropic:**
> *"These are common mistakes. Recognizing them early saves time."*

```
KESALAHAN UMUM:
═══════════════════════════════════════════════════

1. 🚨 THE KITCHEN SINK SESSION
   Masalah: Mulai dengan 1 task, lalu tiba-tiba pindah ke 
            task lain yang tidak relevan. Context penuh 
            dengan informasi yang tidak berguna.
   
   Solusi: /clear antar task yang tidak berhubungan.

2. 🚨 CORRECTING OVER AND OVER
   Masalah: AI melakukan kesalahan, Anda koreksi, masih 
            salah, koreksi lagi. Context terpolusi dengan 
            pendekatan yang gagal.
   
   Solusi: Setelah 2 koreksi gagal, /clear dan buat 
           prompt baru yang lebih spesifik.

3. 🚨 OVER-SPECIFIED CLAUDE.MD
   Masalah: CLAUDE.MD terlalu panjang, AI mengabaikan 
            setengah isinya karena aturan penting tenggelam.
   
   Solusi: Prune secara agresif. Jika AI sudah bisa 
           melakukan sesuatu tanpa instruksi, hapus.

4. 🚨 THE TRUST-THEN-VERIFY GAP
   Masalah: AI menghasilkan implementasi yang terlihat 
            meyakinkan tapi tidak handle edge cases.
   
   Solusi: Selalu sediakan verifikasi (tests, scripts, 
           screenshots). Jika tidak bisa verifikasi, 
           jangan deploy.

5. 🚨 JUMPING STRAIGHT TO CODE
   Masalah: Langsung minta AI coding tanpa plan mode.
            Menghasilkan kode yang menyelesaikan masalah 
            yang salah.
   
   Solusi: Explore → Plan → Implement. Pisahkan 
           riset dari implementasi.

6. 🚨 ONE GIANT PROMPT
   Masalah: Satu prompt besar yang loop sampai AI 
            "declare victory". Menghasilkan demo, 
            bukan perangkat lunak yang maintainable.
   
   Solusi: Break menjadi sprint-sprint kecil dengan 
           architect pack masing-masing.

═══════════════════════════════════════════════════
```

### 17.2 Troubleshooting Guide

```
MASALAH: AI menghasilkan kode yang berbeda dari yang diharapkan
─────────────────────────────────────────────────────────────
Kemungkinan penyebab:
├── Prompt terlalu samar
├── Context tidak cukup
├── Requirements tidak jelas
└── AI menggunakan asumsi yang salah

Solusi:
├── Berikan prompt yang lebih spesifik
├── Refer file spesifik dengan @
├── Berikan contoh (few-shot prompting)
└── Gunakan plan mode dulu

MASALAH: AI mengubah kode yang seharusnya tidak diubah
─────────────────────────────────────────────────────────────
Kemungkinan penyebab:
├── Scope creep
├── AI terlalu agresif
└── Tidak ada batasan yang jelas

Solusi:
├── Batasi scope di prompt
├── Gunakan --allowedTools
├── Set batasan di AGENTS.MD
└── Review diff sebelum commit

MASALAH: AI menggunakan dependensi yang salah
─────────────────────────────────────────────────────────────
Kemungkinan penyebab:
├── AI mengingat versi lama dari training data
├── Tidak ada pinning versi
└── Tidak ada dependency review

Solusi:
├── Pin versi di specification
├── Verifikasi current versions
├── Gunakan Dependabot
└── CI dependency review

═══════════════════════════════════════════════════
```

---

## 18. CONTOH KASUS NYATA

### 18.1 Kasus: Dashboard Keuangan CEO

**Latar Belakang:**
- CEO menghabiskan 3-4 jam/minggu mengkonsolidasi data
- Data tersebar di 5 spreadsheet + 2 PDF
- Butuh newsletter mingguan + laporan bulanan

**Proses:**

```
SPRINT 001: Discovery
━━━━━━━━━━━━━━━━━━━━━━
Architect bertanya:
- Workflow saat ini seperti apa?
- Siapa pengguna utama?
- Format output apa yang diinginkan?
- Data apa saja yang tersedia?

Hasil:
- Architect Pack 001 dibuat
- 5 sprint direncanakan
- Folder structure dibuat

SPRINT 002: Sample Bundle
━━━━━━━━━━━━━━━━━━━━━━━━
Builder menghasilkan:
- Dashboard HTML dengan data dummy
- Newsletter HTML contoh
- Prototype yang bisa dibuka di browser

Hasil:
- CEO bisa lihat konsep awal
- Feedback diberikan
- Architect pack baru dibuat

SPRINT 003: Executive Output Polish
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Builder menyempurnakan:
- Format profesional
- Layout yang menarik
- Responsive design

Hasil:
- Output siap presentasi
- CEO puas dengan tampilan

SPRINT 004: Data Integration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Builder mengintegrasikan:
- Parser Excel yang robust
- Validasi data otomatis
- Error handling yang baik

Hasil:
- 5 spreadsheet berhasil di-parse
- Data real tampil di dashboard

SPRINT 005: Testing & Refinement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Builder melakukan:
- Unit tests (15 test cases)
- Integration tests
- Bug fixes

Hasil:
- Semua test passing
- Error handling teruji

SPRINT 006: Deployment
━━━━━━━━━━━━━━━━━━━━━━━
Builder menyiapkan:
- Production build
- Documentation
- User guide

Hasil:
- Aplikasi siap digunakan
- Waktu proses turun dari 4 jam → 30 menit!
```

### 18.2 Kasus: Review Workflow (Chris Titus Tech)

**Latar Belakang:**
- Chris ingin menambahkan persentase audio di panel DWM
- Menggunakan Codex sebagai builder

**Proses:**

```
1. SPECIFICATION
   ├── Definisikan: tambahkan % di samping ikon volume
   ├── Scope: hanya perubahan UI, tidak ubah logic audio
   └── Acceptance: % muncul, hide saat audio unavailable

2. IMPLEMENTATION
   ├── Codex menemukan Quickskill (skill untuk QML)
   ├── Inspeksi code yang ada
   ├── Buat perubahan QML
   ├── Update regression test
   ├── Deploy ke live install
   └── Verifikasi di screen

3. PULL REQUEST
   ├── PR dibuat (bukan langsung ke main)
   ├── Manual gate untuk review
   └── Inspect diff, cek screenshot

4. INDEPENDENT REVIEW
   ├── CodeRabbit review
   ├── Temuan 1: Hide % saat audio unavailable
   └── Temuan 2: Document perubahan di changelog

5. FIX & ITERATE
   ├── Fix unavailable-audio state
   ├── Update test
   ├── Add changelog entry
   └── Push perbaikan

6. MANUAL VERIFICATION
   ├── Cek volume % di live panel
   ├── Cek fix untuk unavailable audio
   ├── Cek test & changelog
   └── Tunggu CI passing

7. MERGE
   └── Setelah semua gate passed
```

---

## 19. GLOSARIUM LENGKAP (Diperbarui)

| Istilah | Penjelasan |
|---------|-----------|
| **Vibe Coding** | Pendekatan coding tanpa perencanaan, hanya "ikut feeling" |
| **Architect** | LLM (ChatGPT/Claude) yang bertindak sebagai perencana |
| **Builder** | Tool coding (Codex/Claude Code/Cursor) yang menulis kode |
| **Architect Pack** | Paket 4 dokumen (Requirements, Blueprint, Acceptance, Handoff) per sprint |
| **Context Engineering** | Seni mengelola informasi yang diberikan ke AI |
| **Sprint** | Unit pekerjaan terkecil dengan awal dan akhir yang jelas |
| **Dry Run** | Simulasi tanpa kode untuk memvalidasi rencana |
| **Source of Truth** | Sumber kebenaran utama (folder system, bukan chat history) |
| **Context Window** | Batas memori/konteks yang bisa diakses AI dalam satu percakapan |
| **Handoff** | Proses penyerahan pekerjaan dari architect ke builder |
| **MVP** | Minimum Viable Product — produk minimum yang bisa berfungsi |
| **LLM** | Large Language Model — model AI berbasis bahasa besar |
| **AGENTS.MD** | File router utama yang dibaca pertama kali oleh AI |
| **CLAUDE.MD** | File konfigurasi untuk Claude Code |
| **Plan Mode** | Mode eksplorasi tanpa perubahan kode (Claude Code) |
| **Subagent** | AI agent yang berjalan di context terpisah untuk tugas spesifik |
| **Skills** | Pengetahuan reusable yang bisa di-load on-demand |
| **Hooks** | Script yang otomatis jalan di titik tertentu dalam workflow |
| **PR** | Pull Request — request untuk merge kode ke branch utama |
| **CI/CD** | Continuous Integration/Continuous Deployment — otomasi build & deploy |
| **Scope Crek** | Perluasan scope yang tidak terkontrol |
| **Sanity Check** | Pemeriksaan cepat untuk memastikan hasil masuk akal |
| **Few-shot Prompting** | Teknik prompt dengan memberikan contoh |
| **Adversarial Review** | Review yang mencari kesalahan secara aktif |
| **Compaction** | Rangkuman percakapan untuk menghemat context |
| **Modular Monolith** | Arsitektur monolith yang dipecah menjadi module independen |
| **Microservices** | Arsitektur yang memecah aplikasi menjadi layanan kecil mandiri |
| **API Gateway** | Titik masuk tunggal untuk semua request API |
| **Load Balancer** | Distributor beban lintas beberapa server |
| **CDN** | Content Delivery Network — caching konten statis di lokasi global |
| **CI/CD** | Continuous Integration / Continuous Deployment — otomasi build & deploy |
| **Observability** | Kemampuan memahami status internal sistem dari output eksternal |
| **Agentic System** | Sistem AI yang bisa mengambil keputusan dan menjalankan aksi secara otonom |
| **Agentic Workflow** | Alur kerja yang melibatkan AI agent untuk menjalankan sub-tugas |
| **Tool Use** | Pola di mana AI memanggil API atau tools eksternal |
| **Reflection** | Pola di mana AI mengevaluasi outputnya sendiri untuk perbaikan |
| **Planning** | Pola di mana AI memecah tugas besar menjadi sub-tugas kecil |
| **Prompt Chaining** | Pipeline di mana output satu LLM call menjadi input LLM berikutnya |
| **Evaluator-Optimizer** | Pola di mana satu LLM generate, LLM lain evaluate |
| **Bounded Execution** | Mekanisme pembatasan langkah maksimum AI agent |
| **Guardrail Layering** | Lapisan keamanan di 4 titik eksekusi AI agent |
| **Vibe Engineering** | Pendekatan hybrid: eksplorasi bebas + formalisasi spesifikasi |
| **Spec-Driven Development** | Pendekatan di mana spesifikasi formal mendahului implementasi |
| **Living Spec** | Spesifikasi yang diperbarui otomatis mengikuti perubahan kode |

---

## 20. SYSTEM DESIGN ARCHITECTURE UNTUK FULLSTACK WEB DEVELOPER

> **💬 Bayangkan ini:** Anda adalah pemilik restoran. Anda punya juru masak (backend), pelayan (frontend), gudang bahan makanan (database), dan gedung restoran itu sendiri (infrastruktur). **System Design** adalah cara Anda mengatur semua elemen ini agar restoran berjalan lancar — dari dapur yang efisien hingga pelayanan yang cepat ke pelanggan.

### 20.1 Mengapa System Design Penting untuk Vibe Coder?

**Jawaban singkatnya:** Tanpa memahami system design, Anda seperti pemilik restoran yang tidak tahu cara mengatur dapur — hasilnya pasti berantakan.

**Mengapa ini KRITIS untuk vibe coder:**

Saat Anda berkata ke AI *"Buatkan saya aplikasi e-commerce"*, AI akan langsung menulis kode. Tapi AI **tidak tahu**:
- Apakah Anda butuh 1 server atau 10 server?
- Data pelanggan disimpan di mana?
- Bagaimana jika 1000 orang akses bersamaan?
- Bagaimana cara agar aplikasi tetap jalan jika server mati?

**Itulah yang diselesaikan oleh System Design.**

> **💡 Analogi Sederhana:**
> System Design seperti **Denah Rumah**. Sebelum tukang bangun rumah, Anda harus punya denah yang jelas: mana kamar tidur, mana dapur, mana toilet. Tanpa denah, tukang akan bangun sesuai tebakannya — dan hasilnya pasti tidak sesuai keinginan Anda.
>
> Dalam dunia software:
> - **Denah rumah** = System Design / Arsitektur
> - **Tukang** = AI Builder (Codex, Claude Code)
> - **Anda** = Architect (pemilik ide)

**Yang terjadi TANPA System Design:**
```
Anda: "Buatkan e-commerce"
AI: [membuat semua kode dalam 1 file besar]
Hasil:
├── ❌ Aplikasi lambat saat banyak user
├── ❌ Data corrupt karena tidak ada validasi
├── ❌ Tidak bisa di-scale saat populer
├── ❌ Semua kode saling ketergantungan (spaghetti)
└── ❌ Satu bug bisa menjatuhkan seluruh aplikasi
```

**Yang terjadi DENGAN System Design:**
```
Anda: "Buatkan e-commerce dengan arsitektur terpisah:
       frontend terpisah, backend API terpisah,
       database terpisah, deploy ke Vercel + Railway"
AI: [membuat kode dengan struktur yang rapi]
Hasil:
├── ✅ Frontend & backend bisa di-scale independen
├── ✅ Data aman dengan validasi di setiap layer
├── ✅ Mudah ditambah fitur baru tanpa rusak yang lama
├── ✅ Bug di satu modul tidak menjatuhkan modul lain
└── ✅ Siap untuk 10, 100, atau 10.000 user
```

> **💡 Insight dari riset 2026:**
> *"The vibe coder who understands system design is 10x more dangerous than the developer who doesn't. They can direct AI to build the RIGHT architecture, not just ANY architecture."*

### 20.2 Arsitektur Bertingkat: 4 Lapisan Setiap Aplikasi Web

Setiap aplikasi web — dari Instagram sampai Tokopedia — punya **4 lapisan utama**. Mari kita pahami satu per satu dengan analogi restoran:

```
ANALOGI RESTORAN:
═══════════════════════════════════════════════════════════════

LAYER 1: 🍽️ RUANG MAKAN (Frontend)
├── Ini yang dilihat dan disentuh pelanggan
├── Menu, dekorasi, meja, kursi
├── Dalam software: halaman website / mobile app
├── Teknologi: React, Vue, Next.js, Tailwind CSS
└── Tugas: Tampil bagus dan mudah digunakan

LAYER 2: 👨‍🍳 DAPUR (Backend / API)
├── Tempat pesanan diproses
├── Juru masak menerima pesanan dari pelayan
├── Dalam software: server yang memproses data
├── Teknologi: Express.js, Fastify, NestJS, Django
└── Tugas: Memproses permintaan dan mengembalikan hasil

LAYER 3: 📦 GUDANG (Database)
├── Tempat semua bahan makanan / data disimpan
├── Harus terorganisir agar mudah diambil
├── Dalam software: tempat menyimpan data pengguna
├── Teknologi: PostgreSQL, MySQL, MongoDB, Redis
└── Tugas: Menyimpan dan mengambil data dengan aman

LAYER 4: 🏗️ GEDUNG (Infrastructure / Deployment)
├── Gedung restoran, listrik, air, GPS
├── Tanpa gedung, restoran tidak bisa buka
├── Dalam software: server cloud, domain, SSL
├── Teknologi: Vercel, Railway, AWS, Cloudflare
└── Tugas: Membuat aplikasi bisa diakses dari internet
```

**Bagaimana 4 Layer Ini Bekerja Sama:**

```
ALUR PESANAN DI RESTORAN:
═══════════════════════════════════════════════════════════════

Pelanggan (User) memesan nasi goreng
        │
        ▼
🍽️ PELAYAN (Frontend)
├── Mencatat pesanan dengan benar
├── Menampilkan menu yang tersedia
└── Mengirim pesanan ke dapur
        │
        ▼
👨‍🍳 JURU MASAK (Backend/API)
├── Menerima pesanan dari pelayan
├── Memeriksa apakah bahan tersedia
├── Memasak nasi goreng sesuai permintaan
└── Mengirim hasil masakan ke pelayan
        │
        ▼
📦 GUDANG (Database)
├── Menyimpan stok bahan makanan
├── Mencatat setiap pesanan yang masuk
├── Memperbarui stok setelah dipakai
└── Menyimpan resep dan data pelanggan
        │
        ▼
🏗️ GEDUNG (Infrastructure)
├── Menyediakan listrik untuk dapur
├── Menyediakan air untuk mencuci
├── Membuka pintu agar pelanggan bisa masuk
└── Menjaga keamanan gedung
```

**Dalam Dunia Software:**
```
User membuka website toko online
        │
        ▼
🖥️ FRONTEND (React/Next.js)
├── Menampilkan halaman produk
├── User klik "Beli"
├── Mengirim permintaan pembelian ke server
└── Menampilkan hasil ke user
        │
        ▼
⚙️ BACKEND API (Express/Fastify)
├── Menerima permintaan pembelian
├── Memeriksa apakah user sudah login
├── Memeriksa stok produk
├── Membuat pesanan baru
└── Mengirim konfirmasi ke frontend
        │
        ▼
💾 DATABASE (PostgreSQL)
├── Menyimpan data produk
├── Menyimpan data pesanan
├── Menyimpan data user
└── Memperbarui stok produk
        │
        ▼
🏗️ INFRASTRUCTURE (Vercel/Railway)
├── Frontend di-host di Vercel (gratis!)
├── Backend di-host di Railway ($5/bulan)
├── Database di-host di Supabase (gratis!)
└── Domain + SSL di Cloudflare (gratis!)
```

> **💡 Tips untuk Vibe Coder Pemula:**
> Saat Anda berkata ke AI "Buatkan saya aplikasi X", **selalu tentukan** di layer mana setiap fitur berada:
> - "Halaman login ada di **frontend**"
> - "Validasi password ada di **backend**"
> - "Data user disimpan di **database**"
> - "Deploy ke **Vercel + Railway**"
>
> Dengan cara ini, AI akan membuat kode yang terstruktur dan tidak campur aduk.

### 20.3 3 Pola Arsitektur: Mana yang Cocok untuk Anda?

Ini adalah **keputusan terpenting** yang harus Anda buat sebelum memulai proyek. Mari kita pahami dengan analogi:

```
ANALOGI: RESTORAN VS RUMAH SAKIT
═══════════════════════════════════════════════════════════════

─── POLA 1: MONOLITH (Restoran Kecil) ───

Bayangkan warung nasi goreng:
├── Semua masakan dibuat di 1 dapur kecil
├── 1 juru masak handle semua pesanan
├── Semua bahan disimpan di 1 gudang
├── Cukup untuk 20-30 pelanggan/hari
└── MUDAH dijalankan, MURAH, CEPAT buka

KELEBIHAN:
├── ✅ deploy hanya 1 kali, selesai
├── ✅ debug mudah (semua di 1 tempat)
├── ✅ tidak butuh tim besar
└── ✅ biaya operasional rendah

KEKURANGAN:
├── ❌ Jika juru masak sakit → SEMUA berhenti
├── ❌ Jika pesanan naik 10x → kewalahan
├── ❌ Tidak bisa pisahkan masakan Indonesia & Jepang
└── ❌ Semua masakan ketergantungan satu sama lain

🎯 COCOK UNTUK:
├── MVP (produk minimum)
├── Proyek pribadi / side project
├── Tim 1-3 orang
└── Aplikasi yang belum punya banyak user

─── POLA 2: MODULAR MONOLITH (Restoran dengan Sekat) ───

Bayangkan restoran dengan DINDING PEMBATAS:
├── Dapur Indonesia terpisah dari Dapur Jepang
├── Masing-masing punya juru masak sendiri
├── Tapi masih dalam 1 gedung yang sama
├── Gudang bahan masih SHARED
└── Cukup untuk 50-200 pelanggan/hari

KELEBIHAN:
├── ✅ Masakan Indonesia tidak rusak jika Dapur Jepang error
├── ✅ Bisa hire juru masak Jepang tanpa ubah Dapur Indonesia
├── ✅ Masih mudah dijalankan (1 gedung)
├── ✅ Jika mau, bisa pindah ke 2 gedung terpisah nanti
└── ✅ Struktur rapi tapi tidak serumit microservices

KEKURANGAN:
├── ❌ Perlu disiplin menjaga batas (jangan campur aduk)
├── ❌ Gudang shared → ada batasan ukuran
└── ❌ Butuh perencanaan awal yang lebih matang

🎯 COCOK UNTUK:
├── ✅ REKOMENDASI UNTUK 90% PROYEK VIBE CODER!
├── Proyek yang serius tapi tidak terlalu besar
├── Tim 3-15 orang
└── Aplikasi yang ingin di-scale perlahan

─── POLA 3: MICROSERVICES (Rumah Sakit) ───

Bayangkan rumah sakit besar:
├── Ruang Bedah terpisah dari Ruang Radiologi
├── Masing-masing punya dokter, perawat, alat sendiri
├── Setiap ruangan punya sistem pencatatan sendiri
├── Ada koridor (API Gateway) yang menghubungkan semua
└── Cukup untuk 1000+ pasien/hari

KELEBIHAN:
├── ✅ Ruang Bedah error → Ruang Radiologi tetap jalan
├── ✅ Bisa hire spesialis per ruangan
├── ✅ Bisa upgrade peralatan per ruangan
└── ✅ Sangat scalable

KEKURANGAN:
├── ❌ SANGAT kompleks untuk dijalankan
├── ❌ Butuh tim DevOps yang berpengalaman
├── ❌ Biaya operasional TINGGI
├── ❌ Debugging → harus cek banyak ruangan
└── ❌ Komunikasi antar ruangan bisa lambat

🎯 COCOK UNTUK:
├── Perusahaan besar (Gojek, Tokopedia, Shopee)
├── Tim > 15 orang
├── Traffic > 10.000 request/detik
└── BUTUH isolation antar layanan
```

**Decision Framework Sederhana untuk Vibe Coder:**
```
TANYA DIRI ANDA:

1. "Apakah ini baru MVP / prototipe?"
   YA → Mulai dengan MONOLITH biasa

2. "Apakah ini akan dipakai user sungguhan?"
   YA → Gunakan MODULAR MONOLITH

3. "Apakah tim saya > 15 orang?"
   YA → Pertimbangkan MICROSERVICES

4. "Apakah traffic > 10.000 request/detik?"
   YA → Baru butuh MICROSERVICES

REKOMENDASI DEFAULT:
┌─────────────────────────────────────────┐
│  Mulai dengan MODULAR MONOLITH.          │
│  Upgrade ke Microservices HANYA jika     │
│  Anda SUDAH merasakan bottleneck-nya.    │
│                                          │
│  "Start simple, scale when needed."      │
└─────────────────────────────────────────┘
```

> **💡 Tips untuk Vibe Coder Pemula:**
> Saat Anda mulai proyek baru, **jangan langsung mikir microservices**. Itu seperti mau buka warung nasi goreng tapi sudah sewa gedung 10 lantai. Mulai dari yang kecil, rapi, dan bisa berkembang. **Modular Monolith** adalah pilihan terbaik — cukup mudah untuk pemula, tapi cukup kuat untuk production.

### 20.4 Desain API: Cara Frontend Berbicara ke Backend

**API** adalah "pelayan" yang mengantarkan pesanan dari pelanggan (frontend) ke juru masak (backend). Tanpa API, frontend dan backend tidak bisa berkomunikasi.

```
ANALOGI API:
═══════════════════════════════════════════════════════════════

Bayangkan Anda memesan makanan lewat TELEPON:

Pelanggan (Frontend): "Saya mau pesan nasi goreng spesial"
        │
        ▼ [TELEPON = API]
        │
Juru Masak (Backend): "Oke, nasi goreng spesial. Ada tambahan?"
        │
Pelanggan: "Pakai telur tambah"
        │
Juru Masak: "Oke, total Rp 25.000. Sebentar ya."
        │
        ▼
Pelanggan: [menerima makanan]

───

3 JENIS "TELEPON" (API):

1. 📞 REST API (Telepon Biasa)
   Cara kerja: Kirim pesan singkat, terima jawaban
   Contoh: GET /api/produk/123 → { nama: "Nasi Goreng", harga: 25000 }
   Kelebihan: Simple, universal, mudah dipahami
   Kekurangan: Kadang dapat data lebih banyak dari yang dibutuhkan
   Cocok untuk: 90% aplikasi web

2. 📞 GRAPHQL (Video Call)
   Cara kerja: Anda JELAS minta data spesifik
   Contoh: "Saya mau nama produk DAN nama kategori, tapi TIDAK perlu harga"
   Kelebihan: Dapat data persis yang dibutuhkan
   Kekurangan: Lebih kompleks untuk dipelajari
   Cocok untuk: Aplikasi dengan data sangat kompleks

3. 📞 tRPC (Walkie-Talkie Langsung)
   Cara kerja: Frontend dan backend BAHASA SAMA (TypeScript)
   Contoh: frontend langsung panggil backend tanpa konfigurasi
   Kelebihan: Super cepat development, tidak ada error tipe data
   Kekurangan: Hanya untuk TypeScript fullstack
   Cocok untuk: Next.js + TypeScript project
```

**Contoh Nyata: REST API untuk Toko Online**
```
FRONTEND MEMBERITAHU BACKEND:

1. "Tampilkan semua produk"
   → GET /api/products
   → Backend: ambil semua produk dari database, kirim ke frontend

2. "Saya mau lihat produk nomor 42"
   → GET /api/products/42
   → Backend: ambil produk #42 dari database, kirim ke frontend

3. "Saya mau beli produk #42"
   → POST /api/orders
   → Body: { productId: 42, quantity: 1 }
   → Backend: buat pesanan baru, kurangi stok, kirim konfirmasi

4. "Update alamat saya"
   → PUT /api/users/me/address
   → Body: { address: "Jl. Sudirman No. 10" }
   → Backend: update alamat user di database

5. "Hapus pesanan saya"
   → DELETE /api/orders/123
   → Backend: hapus pesanan #123 dari database
```

**Rekomendasi untuk Vibe Coder Pemula:**
```
PILIH API BERDASARKAN SITUASI ANDA:

├── Mulai dengan REST API → untuk MVP dan prototipe
├── Pindah ke tRPC → jika pakai Next.js + TypeScript fullstack
└── Gunakan GraphQL → HANYA jika data sangat kompleks
    (misal: social media dengan banyak relasi data)

Katakan ke AI:
"Buatkan REST API untuk [nama fitur]
 dengan endpoint: [GET/POST/PUT/DELETE] /api/[nama]"
```

### 20.5 Database: Gudang Penyimpanan Data Anda

Database adalah "gudang" tempat semua data disimpan. Pilih database yang tepat seperti memilih jenis gudang yang tepat untuk bisnis Anda.

```
ANALOGI DATABASE:
═══════════════════════════════════════════════════════════════

─── DATABASE RELASIONAL (SQL) — Gudang dengan Rak Teratur ───

Bayangkan gudang supermarket:
├── Setiap barang ada di rak yang JELAS
├── Setiap rak punya LABEL (nama, harga, stok)
├── Ada BUKU PANDUAN yang mencatat semua barang
├── Jika stok habis, buku panduan otomatis update
└── Contoh: PostgreSQL, MySQL, SQLite

Contoh Data:
┌────┬──────────────┬────────┬───────┐
│ ID │ Nama Produk  │ Harga  │ Stok  │
├────┼──────────────┼────────┼───────┤
│ 1  │ Nasi Goreng  │ 25.000 │  50   │
│ 2  │ Mie Ayam     │ 20.000 │  30   │
│ 3  │ Es Teh       │  5.000 │ 100   │
└────┴──────────────┴────────┴───────┘

KELEBIHAN:
├── ✅ Data sangat terorganisir
├── ✅ Bisa "gabungkan" data dari beberapa tabel
│   (Contoh: "Tampilkan semua pesanan Budi")
├── ✅ Data dijamin konsisten (ACID)
└── ✅ Tools dan tutorial sangat banyak

KEKURANGAN:
├── ❌ Schema (struktur tabel) harus ditentukan duluan
└── ❌ Jika data sangat beragam, agak kaku

🎯 COCOK UNTUK:
├── ✅ 90% aplikasi web!
├── Toko online, blog, dashboard, SaaS
├── Data yang terstruktur (nama, email, harga)
└── Aplikasi yang butuh data KONSISTEN

─── DATABASE NoSQL (MongoDB) — Gudang Fleksibel ───

Bayangkan gudang barang bekas:
├── Setiap barang bisa bentuk APA SAJA
├── Tidak ada rak yang harus diikuti
├── Bisa simpan sepatu, baju, elektronik
├── Tapi pencarian lebih sulit
└── Contoh: MongoDB, CouchDB

Contoh Data:
{
  "nama": "Budi",
  "email": "budi@email.com",
  "hobi": ["memasak", "fotografi"],
  "alamat": {
    "jalan": "Jl. Merdeka",
    "kota": "Jakarta"
  }
}

KELEBIHAN:
├── ✅ Sangat fleksibel (schema bisa berubah kapan saja)
├── ✅ Cocok untuk data yang beragam
└── ✅ Horizontal scaling mudah

KEKURANGAN:
├── ❌ Data bisa tidak konsisten
├── ❌ Query kompleks lebih sulit
└── ❌ Tidak ada "buku panduan" yang memaksa struktur

🎯 COCOK UNTUK:
├── Content management (blog, CMS)
├── Real-time apps (chat, notifikasi)
├── Data IoT (sensor, log)
└── Prototipe cepat (tidak perlu definisi schema)

─── CACHE (Redis) — Gudang Sementara di Depan ───

Bayangkan etalase di depan kasir:
├── Barang yang PALING SERING dibeli ditaruh di depan
├── Tidak perlu masuk gudang setiap kali
├── Sangat CEPAT diambil
├── Tapi terbatas (tidak muat semua barang)
└── Contoh: Redis, Memcached

🎯 COCOK UNTUK:
├── Menyimpan session login user
├── Menyimpan data yang sering diakses
├── Rate limiting (membatasi request)
└── Real-time leaderboard / counter
```

**Rekomendasi untuk Vibe Coder Pemula:**
```
DEFAULT: PostgreSQL (atau SQLite untuk development lokal)

MENGGUNAKAN Redis:
├── ✅ Jika butuh session management
├── ✅ Jika butuh caching data sering diakses
└── ❌ JANGAN jadikan sebagai primary database

MENGGUNAKAN MongoDB:
├── ✅ Jika data benar-benar tidak berstruktur
├── ✅ Jika butuh schema yang sangat fleksibel
└── ❌ JANGAN gunakan hanya karena "trend"

Katakan ke AI:
"Gunakan PostgreSQL untuk database.
 Tabel yang dibutuhkan: users, products, orders.
 Relasi: orders belongs_to users, orders has_many products"
```

### 20.6 Dari Laptop ke Internet: Deployment untuk Pemula

**Deployment** adalah proses membuat aplikasi Anda bisa diakses dari internet. Tanpa deployment, aplikasi hanya bisa dijalankan di laptop Anda sendiri.

```
ANALOGI DEPLOYMENT:
═══════════════════════════════════════════════════════════════

Bayangkan Anda punya resep masakan enak:

TAHAP 1: MASAK DI DAPUR RUMAH (Local Development)
├── Anda memasak sendiri di dapur rumah
├── Hanya Anda yang bisa mencicipi
├── Tidak ada yang tahu masakan Anda ada
└── Dalam software: aplikasi jalan di laptop Anda

TAHAP 2: BUKA WARUNG KECIL (Staging / Preview)
├── Anda buka warung kecil di depan rumah
├── Tetangga bisa mencicipi
├── Anda minta feedback sebelum buka resmi
└── Dalam software: deploy ke Vercel Preview / Railway

TAHAP 3: BUKA RESTORAN RESMI (Production)
├── Anda buka restoran dengan papan nama
├── Semua orang bisa datang
├── Ada menu, layanan, dan prosedur yang jelas
└── Dalam software: deploy ke production environment
```

**Panduan Deployment Termudah untuk Vibe Coder:**
```
STACK DEPLOYMENT GRATIS/TERMURAH:
═══════════════════════════════════════════════════════════════

FRONTEND (Tampilan Website):
├── Vercel (GRATIS untuk personal project)
│   ├── Auto-deploy saat push ke GitHub
│   ├── SSL gratis (https://)
│   ├── CDN global (cepat diakses dari mana saja)
│   └── Custom domain gratis
├── Netlify (alternatif Vercel)
└── Cloudflare Pages (alternatif lain)

BACKEND (API Server):
├── Railway ($5/bulan, sangat murah)
│   ├── Deploy dari GitHub langsung
│   ├── Auto-sleep saat tidak ada traffic
│   └── Bisa jalankan PostgreSQL juga
├── Render (GRATIS tier available)
├── Fly.io (GRATIS tier available)
└── Vercel (bisa juga untuk API dengan Next.js API Routes)

DATABASE:
├── Supabase (GRATIS 500MB)
│   ├── PostgreSQL as a Service
│   ├── Dashboard cantik untuk manage data
│   └── Built-in auth & storage
├── Neon (GRATIS 512MB)
│   ├── PostgreSQL serverless
│   └── Auto-sleep saat tidak dipakai
└── PlanetScale (MySQL, GRATIS tier)

DOMAIN & SSL:
├── Cloudflare (GRATIS)
│   ├── DNS management
│   ├── SSL certificate otomatis
│   └── CDN global
└── Namecheap / Porkbunt ($8-12/tahun untuk .com)
```

**Langkah-langkah Deployment untuk Pemula:**
```
STEP 1: Push kode ke GitHub
├── git init
├── git add .
├── git commit -m "Initial commit"
├── git remote add origin https://github.com/username/project.git
└── git push -u origin main

STEP 2: Deploy Frontend ke Vercel
├── Buka vercel.com → Sign in dengan GitHub
├── Klik "New Project" → Pilih repository Anda
├── Vercel otomatis detect framework (Next.js, React, dll)
├── Klik "Deploy"
├── Selesai! Dapat URL: https://project.vercel.app
└── Tambah custom domain di Vercel dashboard

STEP 3: Deploy Backend ke Railway
├── Buka railway.app → Sign in dengan GitHub
├── Klik "New Project" → "Deploy from GitHub"
├── Pilih repository backend
├── Set environment variables (DATABASE_URL, dll)
├── Railway otomatis deploy
└── Dapat URL: https://project-production.up.railway.app

STEP 4: Deploy Database ke Supabase
├── Buka supabase.com → Sign in
├── Klik "New Project"
├── Buat password database
├── Pilih region terdekat (Singapore untuk Indonesia)
├── Dapat connection string: postgresql://xxx:xxx@xxx/dbname
└── Copy connection string ke Railway environment variables

STEP 5: Hubungkan Semuanya
├── Frontend → panggil API di URL Railway
├── Backend → koneksi ke database di Supabase
├── Test semuanya berfungsi
└── Deploy berhasil! 🎉
```

> **💡 Tips untuk Vibe Coder Pemula:**
> Jangan takut dengan deployment! Dengan Vercel + Railway + Supabase, Anda bisa deploy aplikasi dalam **15 menit** dan biayanya **GRATIS** untuk mulai. Bookmark halaman ini dan ikuti langkah-langkahnya saat Anda siap deploy.

### 20.7 Komponen Wajib Aplikasi Siap Production

Aplikasi yang hanya jalan di laptop = **prototipe**.
Aplikasi yang bisa diakses orang lain dan tetap berjalan = **production**.

Berikut **komponen wajib** yang harus ada sebelum Anda bilang "aplikasi saya siap production":

```
CHECKLIST PRODUCTION READINESS:
═══════════════════════════════════════════════════════════════

1. 🔒 KEAMANAN (Security)
   │
   ├── HTTPS (Wajib!)
   │   └── Tanpa HTTPS, data user bisa dicuri
   │       → Gunakan Cloudflare untuk SSL gratis
   │
   ├── Login & Password yang Aman
   │   ├── Gunakan JWT atau session cookies
   │   ├── Password harus di-hash (jangan simpan plain text!)
   │   └── Tambahkan "lupa password" feature
   │
   ├── Validasi Input
   │   ├── Jangan percaya data dari user!
   │   ├── Cek email format valid
   │   ├── Cek password minimal 8 karakter
   │   └── Bersihkan input dari kode berbahaya (XSS)
   │
   ├── Rate Limiting
   │   ├── Batasi jumlah request per menit
   │   ├── Cegah brute force (tebak password)
   │   └── Contoh: maksimal 5 login percobaan per 5 menit
   │
   └── Environment Variables
       ├── JANGAN simpan API key di kode!
       ├── Simpan di .env file
       ├── .env TIDAK di-commit ke Git
       └── Gunakan .env.example sebagai template

2. 📊 MONITORING (Supaya Tahu Jika Ada Masalah)
   │
   ├── Error Tracking (Sentry - GRATIS)
   │   ├── Meng捕捉 error otomatis
   │   ├── Memberitahu Anda via email jika ada error
   │   └── Menunjukkan error-nya di kode mana
   │
   ├── Uptime Monitoring (UptimeRobot - GRATIS)
   │   ├── Memeriksa apakah website Anda hidup setiap 5 menit
   │   ├── Jika mati → kirim email/WhatsApp alert
   │   └── Status page publik untuk user
   │
   └── Log Sederhana
       ├── Catat semua request yang masuk
       ├── Catat error yang terjadi
       └── Gunakan console.log untuk mulai, structured log untuk production

3. 🔄 CI/CD (Otomasi Build & Deploy)
   │
   ├── Gunakan GitHub Actions (GRATIS)
   │   ├── Setiap push ke GitHub → otomatis jalankan test
   │   ├── Setiap test pass → otomatis deploy
   │   └── Tidak perlu deploy manual lagi!
   │
   ├── Minimal punya:
   │   ├── Linting (ESLint) → cek kode rapi
   │   ├── Type checking (TypeScript) → cek tipe data
   │   ├── Unit test (Jest/Vitest) → cek fungsi berfungsi
   │   └── Build check → cek aplikasi bisa di-build
   │
   └── Auto-deploy saat merge ke main branch

4. 📈 SCALABILITY (Supaya Tidak Crash Saat Ramai)
   │
   ├── Stateless API
   │   ├── Jangan simpan session di memory server
   │   ├── Simpan di Redis atau database
   │   └── Supaya bisa tambah server tanpa masalah
   │
   ├── Caching
   │   ├── Cache data yang sering diakses
   │   ├── Contoh: daftar produk populer
   │   └── Kurangi beban database
   │
   └── CDN (Cloudflare)
       ├── Gambar, CSS, JS di-cache di server terdekat
       └── Website lebih cepat diakses dari mana saja

5. 🛡️ RELIABILITY (Supaya Tetap Jalan Jika Ada Masalah)
   │
   ├── Health Check Endpoint
   │   ├── Buat endpoint: GET /health
   │   ├── Mengembalikan: { status: "ok", uptime: 12345 }
   │   └── Dipakai oleh monitoring untuk cek server hidup
   │
   ├── Error Handling
   │   ├── Jangan biarkan aplikasi crash!
   │   ├── Tangkap error, tampilkan pesan yang jelas
   │   └── Log error untuk debugging
   │
   └── Backup Database
       ├── Supabase/Neon sudah auto-backup
       └── Pastikan Anda tahu cara restore jika perlu
```

> **💡 Tips untuk Vibe Coder Pemula:**
> **Jangan coba implementasi SEMUA komponen sekaligus!** Mulai dari yang paling penting:
> 1. HTTPS (wajib!)
> 2. Environment variables (jangan simpan secrets di kode)
> 3. Error tracking (Sentry GRATIS)
> 4. Basic test (minimal 5-10 test cases)
>
> Tambahkan komponen lain seiring waktu. Yang penting **aplikasi aman dan bisa dimonitor**.

---

## 21. AGENTIC PATTERNS & AI AGENT WORKFLOW

> **💬 Bayangkan ini:** Anda punya asisten pribadi yang tidak hanya menjawab pertanyaan, tapi bisa **mengerjakan tugas sendiri** — membaca email, membuat janji, memperbaiki jadwal, bahkan menelepon vendor. Itulah bedanya **chatbot biasa** dengan **AI Agent**.

### 21.1 Apa Itu Agentic System? (Penjelasan Super Sederhana)

**Chatbot biasa** = seperti punya kamus pintar. Anda tanya, dia jawab. Selesai.

**AI Agent** = seperti punya karyawan yang bisa **bekerja sendiri** — membaca, berpikir, bertindak, memperbaiki kesalahan, dan melaporkan hasil.

```
PERBANDINGAN NYATA:
═══════════════════════════════════════════════════════════════

ASISTEN BIASA (Chatbot):
─────────────────────
Anda: "Buatkan saya fitur login"
AI: [menulis kode login] → Kirim ke Anda → Selesai

Anda HARUS:
├── Copy-paste kode ke project
├── Jalankan test sendiri
├── Jika error, Anda yang debug
├── Jika perlu file lain, Anda yang beritahu AI
└── Anda yang deploy

───

ASISTEN PINTAR (AI Agent):
─────────────────────────
Anda: "Buatkan saya fitur login"
AI: [melakukan SEMUA ini sendiri!]
├── 📖 Membaca project Anda (file apa saja yang ada)
├── 📋 Merencanakan langkah implementasi
├── ✍️ Menulis kode login
├── 🧪 Menjalankan test otomatis
├── 🔧 Jika test gagal → MEMPERBAIKI KODE SENDIRI
├── 🧪 Menjalankan test ulang
├── 🧹 Menjalankan linting (cek kode rapi)
├── 📊 Melaporkan hasil dengan bukti
└── ✅ Selesai — Anda tinggal review!

→ ANDA HANYA PERLU MEREVIEW, BUKAN MENGERJAKAN!
```

> **💡 Dari Anthropic (Desember 2024):**
> *"Claude Code is an agentic coding environment. Unlike a chatbot that answers questions and waits, Claude Code can read your files, run commands, make changes, and autonomously work through problems."*

**Analogi Sederhana:**
- **Chatbot** seperti tukang yang hanya kasih resep masakan — Anda harus masak sendiri.
- **AI Agent** seperti tukang yang masak sendiri, cicip sendiri, koreksi sendiri, dan sajikan ke meja Anda.

### 21.2 Mengapa Vibe Coder PERLU Memahami Agentic Patterns?

**Jawaban singkatnya:** Semua tool yang Anda pakai sehari-hari (Claude Code, Codex, Cursor) **sudah menggunakan pola-pola ini**. Memahami polanya = Anda bisa mengarahkan AI dengan lebih efektif.

**Contoh Nyata:**
```
Tanpa memahami agentic patterns:
Anda: "Buatkan fitur login"
AI: [membuat kode yang salah]
Anda: "Eh, yang tadi salah"
AI: [membuat kode yang benar tapi melupakan hal lain]
Anda: "Eh, yang itu juga salah"
→ LOOP TANPA AKHIR! 😫

Dengan memahami agentic patterns:
Anda: "Buatkan fitur login. Gunakan JWT. 
       Test dengan email valid & invalid. 
       Jika test gagal, perbaiki sendiri."
AI: [membuat kode → test → perbaiki → test lagi → selesai]
→ SELESAI DALAM 1 STEP! 🎉
```

### 21.3 6 Pola Agentic yang PALING Penting untuk Vibe Coder

Dari 12+ pola agentic yang ada, berikut **6 pola yang paling sering Anda gunakan** — dijelaskan dengan bahasa sehari-hari:

```
═══════════════════════════════════════════════════════════════
POLA 1: 🔁 REFLECTION (AI Mengevaluasi Dirinya Sendiri)
═══════════════════════════════════════════════════════════════

ANALOGI:
Bayangkan Anda menulis surat lamaran kerja:
1. Anda tulis draft pertama
2. Anda baca ulang → "Hmm, ada typo"
3. Anda perbaiki → "Hmm, kalimat ini kurang jelas"
4. Anda perbaiki lagi → "Oke, sudah bagus!"

Itulah REFLECTION — AI melakukan hal yang sama!

CONTOH DALAM VIBE CODING:
AI menulis kode fitur login
   → AI menjalankan test
   → Test GAGAL
   → AI BERPIKIR: "Kenapa gagal? Ah, saya lupa import module"
   → AI memperbaiki kode
   → AI menjalankan test lagi
   → Test PASS! ✅

BAGAIMANA ANDA MEMANFAATKAN POLA INI:
Katakan ke AI:
"Buatkan fitur login. Setelah selesai, JALANKAN test.
 Jika ada error, PERBAIKI sendiri tanpa saya minta."

→ AI akan otomatis menulis kode, test, dan memperbaiki
   errornya sendiri — tanpa Anda perlu bolak-balik koreksi!

═══════════════════════════════════════════════════════════════
POLA 2: 🛠️ TOOL USE (AI Memanggil Alat Bantu)
═══════════════════════════════════════════════════════════════

ANALOGI:
Bayangkan koki yang tidak hanya bisa masak, tapi juga:
├── Membaca resep dari buku (membaca file)
├── Menimbang bahan (menjalankan command)
├── Mencari info nutrisi di internet (search web)
├── Menggunakan oven, blender, dll ( menjalankan tools)
└── Merekam proses masak (logging)

AI Agent juga bisa "memanggil alat bantu"!

CONTOH DALAM VIBE CODING:
AI bisa:
├── 📖 Membaca file di project Anda (read file)
├── ✍️ Menulis file baru atau mengubah yang ada (write file)
├── 🖥️ Menjalankan command di terminal (run command)
├── 🧪 Menjalankan test (npm test)
├── 📦 Install package baru (npm install)
├── 🔍 Mencari di codebase (code search)
└── 🌐 Mencari informasi di web (web search)

BAGAIMANA ANDA MEMANFAATKAN POLA INI:
Katakan ke AI:
"Baca file src/auth/login.js, pahami strukturnya,
 lalu buat fitur OAuth di file baru src/auth/oauth.js"

→ AI akan MEMBACA file yang ada, MEMAHAMI strukturnya,
   lalu MENULIS kode yang KONSISTEN dengan kode yang sudah ada.

═══════════════════════════════════════════════════════════════
POLA 3: 📋 PLANNING (AI Merencanakan Langkah)
═══════════════════════════════════════════════════════════════

ANALOGI:
Bayangkan Anda mau bangun rumah:
1. Arsitek merencanakan: fondasi → dinding → atap → interior
2. Tukang eksekusi: fondasi dulu, baru dinding, baru atap
3. Tidak mungkin atap dulu baru fondasi!

AI juga bisa merencanakan sebelum menulis kode!

CONTOH DALAM VIBE CODING:
Anda: "Buatkan fitur keranjang belanja"

AI (dengan Planning):
"Oke, saya akan:
1. Buat model Cart di database
2. Buat API GET /api/cart (lihat isi keranjang)
3. Buat API POST /api/cart/items (tambah item)
4. Buat API DELETE /api/cart/items/:id (hapus item)
5. Buat API PUT /api/cart/items/:id (update jumlah)
6. Tulis test untuk setiap API
7. Update dokumentasi

Apakah rencana ini sudah benar?"

BAGAIMANA ANDA MEMANFAATKAN POLA INI:
Katakan ke AI:
"Buatkan fitur [nama fitur]. TAPI JANGAN LANGSUNG CODING!
 Buat dulu RENCANA implementasi-nya. Saya review dulu."

→ AI akan membuat rencana dulu, Anda approve,
   baru AI eksekusi. Hasilnya lebih akurat!

═══════════════════════════════════════════════════════════════
POLA 4: 🔗 PROMPT CHAINING (Satu Output = Input Berikutnya)
═══════════════════════════════════════════════════════════════

ANALOGI:
Bayangkan pabrik sepatu:
1. Bahan mentah → Dipotong → 2. Potongan dijahit →
3. Sepatu jadi → Dikemas → 4. Dikirim ke toko

Setiap tahap HASILNYA menjadi BAHAN untuk tahap berikutnya.

CONTOH DALAM VIBE CODING:
Step 1: AI membuat Requirements.MD
   ↓ (output = input step 2)
Step 2: AI membuat Blueprint.MD berdasarkan Requirements
   ↓ (output = input step 3)
Step 3: AI membuat kode berdasarkan Blueprint
   ↓ (output = input step 4)
Step 4: AI membuat test berdasarkan kode
   ↓ (output = input step 5)
Step 5: AI menjalankan test dan melaporkan hasil

→ Inilah yang terjadi dalam Architect-Builder Method!
   Requirements → Blueprint → Code → Test → Deploy

═══════════════════════════════════════════════════════════════
POLA 5: 👤 HUMAN-IN-THE-LOOP (Manusia Tetap Mengontrol!)
═══════════════════════════════════════════════════════════════

ANALOGI:
Bayangkan autopilot di pesawat:
├── Pesawat bisa terbang sendiri (AI bekerja)
├── Tapi pilot TETAP MEMANTAU (Anda review)
├── Jika ada masalah, pilot ambil alih (Anda approve)
└── Pilot tidak tidur selama penerbangan (Anda tetap kontrol)

POLA INI ADALAH YANG PALING PENTING!

CONTOH DALAM VIBE CODING:
AI selesai menulis kode fitur baru
   → ANDA review kode tersebut
   → ANDA approve atau minta perubahan
   → BARU deploy ke production

TANPA Human-in-the-Loop:
AI menulis kode → AI deploy sendiri → Error production!
→ Anda tidak tahu apa yang terjadi!

DENGAN Human-in-the-Loop:
AI menulis kode → ANDA review → ANDA approve → Deploy aman!
→ Anda tetap punya kontrol penuh!

BAGAIMANA ANDA MEMANFAATKAN POLA INI:
Katakan ke AI:
"Buatkan fitur [nama]. TAPI JANGAN deploy!
 Hanya buat kode dan test-nya saja.
 Saya review dulu sebelum deploy."

→ AI akan menulis kode TANPA deploy.
   Anda review, approve, baru deploy manual.

═══════════════════════════════════════════════════════════════
POLA 6: 🏗️ ORCHESTRATOR-WORKERS (Satu Pengawas, Banyak Pekerja)
═══════════════════════════════════════════════════════════════

ANALOGI:
Bayangkan manajer restoran:
├── Manajer (Orchestrator): Menerima pesanan, menugaskan
├── Koki Indonesia (Worker 1): Masak nasi goreng
├── Koki Jepang (Worker 2): Masak sushi
├── Pelayan (Worker 3): Antarkan ke meja
└── Manajer mengkoordinasi semua pekerja!

Dalam Architect-Builder Method:
├── Architect = Orchestrator (mengkoordinasi)
├── Builder = Worker 1 (menulis kode)
├── Tester = Worker 2 (menjalankan test)
└── Reviewer = Worker 3 (review kode)

BAGAIMANA ANDA MEMANFAATKAN POLA INI:
Anda bertindak sebagai "manajer" yang mengkoordinasi:
1. Bertanya ke Architect (LLM) tentang rencana
2. Menugaskan Builder (Claude Code/Codex) untuk coding
3. Menugaskan Tester untuk testing
4. Review semua hasilnya
5. Approve atau minta perubahan

→ ANDA adalah Orchestrator-nya!
   AI tools adalah Worker-nya!
```

### 21.4 Pola Tambahan yang Perlu Diketahui

Selain 6 pola utama di atas, ada beberapa pola tambahan yang sudah Anda gunakan tanpa sadar:

```
POLA TAMBAHAN:
═══════════════════════════════════════════════════════════════

7. 🧠 CONTEXT ENGINEERING
   Analogi: Membawa catatan saat rapat
   Anda tidak bisa ingat SEMUA hal dari rapat kemarin.
   Anda tulis catatan penting dan bawa saat rapat berikutnya.
   
   Dalam vibe coding:
   STATE.MD = Catatan status proyek
   DECISIONS.MD = Catatan keputusan
   Folder system = Gudang catatan lengkap
   
   AI yang BAIK membaca catatan ini sebelum bekerja.

8. ⛔ BOUNDED EXECUTION (Batas Eksekusi)
   Analogi: Timer saat ujian
   Anda punya 2 jam untuk ujian. Jika belum selesai,
   Anda harus serahkan apa yang ada.
   
   Dalam vibe coding:
   AI juga harus punya BATAS.
   Jika AI sudah loop > 3 kali memperbaiki error yang sama,
   → STOP! Mulai ulang dengan pendekatan baru.
   
   Tips: Gunakan /clear jika AI sudah "bingung".

9. 🛡️ GUARDRAIL (Pengaman)
   Analogi: Pagar di jembatan
   Pagar tidak menghalangi Anda berjalan,
   tapi MENCEGAH Anda jatuh ke jurang.
   
   Dalam vibe coding:
   ├── AGENTS.MD = Aturan yang harus diikuti AI
   ├── Acceptance criteria = Batas "apa yang benar"
   ├── Code review = Pengaman sebelum deploy
   └── Test cases = Pengaman jika ada regression

10. 💾 MEMORY (Ingatan)
    Analogi: Otak manusia
    ├── Short-term memory = Apa yang sedang saya kerjakan
    │   → STATE.MD dalam metode ini
    ├── Long-term memory = Pengetahuan yang sudah saya miliki
    │   → Folder system dalam metode ini
    └── Episodic memory = Pengalaman masa lalu
        → DECISIONS.MD dalam metode ini
```

### 21.5 Peta: Pola Agentic × Architect-Builder Method

**Kabar baiknya:** Metode Architect-Builder yang sudah Anda pelajari di Bagian 1-18 **SUDAH mengadopsi semua pola agentic ini** secara natural!

```
BAGAIMANA SETIAP POLA TEREKSPLIKASI:
═══════════════════════════════════════════════════════════════

Pola Agentic           │ Di Mana dalam Metode Ini?
───────────────────────┼─────────────────────────────────────
🔄 Reflection          │ Architect review hasil Builder
🛠️ Tool Use            │ Builder menjalankan test, build, lint
📋 Planning            │ Architect membuat sprint plan
🔗 Prompt Chaining     │ Requirements → Blueprint → Code
👤 Human-in-the-Loop   │ ANDA approve sebelum deploy
🏗️ Orchestrator-Workers│ Architect (orch) → Builder (worker)
🧠 Context Engineering │ Folder system (STATE.MD, dll)
⛔ Bounded Execution   │ Scope sprint dibatasi
🛡️ Guardrail           │ AGENTS.MD + Acceptance criteria
💾 Memory              │ DECISIONS.MD + git log

→ Metode Architect-Builder SUDAH mengadopsi
  SEMUA pola agentic yang dibutuhkan untuk production!
```

### 21.6 Workflow Agentic untuk Vibe Coder: Step-by-Step

Berikut **alur kerja lengkap** bagaimana AI Agent bekerja dalam konteks vibe coding:

```
WORKFLOW AGENTIC UNTUK VIBE CODER:
═══════════════════════════════════════════════════════════════

TAHAP 1: EKSPLORASI (Anda + Architect AI)
──────────────────────────────────────────
Anda: "Saya ingin menambahkan fitur X"
Architect AI:
├── 📖 Membaca project Anda (Tool Use)
├── 🧠 Mengerti konteks yang ada (Context Engineering)
├── ❓ Mengajukan pertanyaan klarifikasi
├── 📋 Membuat rencana implementasi (Planning)
└── 📄 Menghasilkan: Architect Pack

TAHAP 2: HANDOFF (Anda → Builder AI)
──────────────────────────────────────
Anda:
├── Menyimpan Architect Pack di folder
├── Membuka Builder AI (Claude Code/Codex)
├── Menyuruh Builder membaca Architect Pack
└── Builder: "Oke, saya paham. Ini rencana saya..."

TAHAP 3: IMPLEMENTASI (Builder AI)
───────────────────────────────────
Builder AI:
├── 📖 Membaca file yang relevan (Tool Use)
├── ✍️ Menulis kode baru (Tool Use)
├── 🧪 Menjalankan test (Tool Use)
├── 🔁 Jika test gagal → Perbaiki (Reflection)
├── 🧪 Test ulang (Reflection)
├── 🧹 Linting (Tool Use)
└── 📊 Melaporkan hasil dengan bukti

TAHAP 4: VERIFICATION (Anda + AI Reviewer)
───────────────────────────────────────────
Anda:
├── Review kode yang dihasilkan (Human-in-the-Loop)
├── Minta AI reviewer untuk second opinion (Evaluator-Optimizer)
├── Jika ada masalah → Minta Builder perbaiki (Reflection)
└── Approve jika sudah sesuai

TAHAP 5: DEPLOYMENT (Anda + CI/CD)
────────────────────────────────────
Anda:
├── Push ke GitHub
├── CI/CD otomatis jalankan test
├── Jika test pass → Auto-deploy (Tool Use)
├── Monitoring aktif (Tool Use)
└── 🎉 Fitur baru live!

TAHAP 6: DOCUMENTATION (Architect AI)
───────────────────────────────────────
Architect AI:
├── Update STATE.MD
├── Update DECISIONS.MD
├── Update dokumentasi yang terpengaruh
└── Siap untuk sprint berikutnya!
```

> **💡 Pesan Penting dari MIT Sloan (2026):**
> *"Agentic AI integrates with other software systems to complete tasks independently or with minimal human supervision. The agentic AI age is already here — we have agents deployed at scale in the economy to perform all kinds of tasks."*
>
> Artinya: AI Agent bukan lagi konsep masa depan. Ini sudah terjadi SEKARANG, dan Anda sudah menggunakannya setiap hari lewat Claude Code, Codex, dan Cursor!

---

## 22. STANDAR PRODUCTION-READY & DEPLOYMENT

> **💬 Bayangkan ini:** Anda sudah membangun rumah yang bagus. Tapi sebelum orang lain boleh tinggal, rumah itu harus **dicek** — apakah listrik aman, air mengalir, pintu bisa dikunci, atap tidak bocor. Itulah yang dilakukan **Production Readiness Check**.

### 22.1 Apa Itu "Production-Ready"? (Penjelasan untuk Pemula)

```
PERBANDINGAN:
═══════════════════════════════════════════════════════════════

PROTOTIPE (Belum Production-Ready):
├── Hanya jalan di laptop Anda
├── Tidak ada test
├── Error handling minimal
├── Tidak ada monitoring
├── Deploy manual
├── API key di-hardcode di kode
└── Contoh: Project tugas kuliah, side project pribadi

PRODUCTION-READY (Siap untuk User Sungguhan):
├── Bisa diakses dari internet
├── Ada test yang berfungsi
├── Error ditangani dengan Graceful
├── Ada monitoring (tahu jika error)
├── Deploy otomatis via CI/CD
├── API key di environment variables
├── Ada backup database
└── Contoh: Aplikasi yang dipakai klien/bisnis
```

**Mengapa Ini Penting untuk Vibe Coder?**

Banyak vibe coder membuat prototipe yang terlihat bagus, lalu langsung deploy ke production **tanpa**:
- Test → Error muncul di production, user marah
- Monitoring → Server mati, Anda tidak tahu
- Security → Data user bocor, reputasi hancur
- Backup → Database corrupt, semua data hilang

> **💡 Dari riset CMU (2025):**
> Setelah adopsi AI coding tools, kompleksitas kode meningkat 41% dan peringatan static analysis naik 30%. Artinya, kode AI **lebih rentan** terhadap bug — makanya test dan monitoring LEBIH PENTING dari sebelumnya.

### 22.2 Checklist Production-Ready (Langkah demi Langkah)

Berikut **checklist yang bisa Anda cetak dan centang satu per satu**. Jangan coba centang SEMUA sekaligus — mulai dari yang paling penting:

```
CHECKLIST PRIORITAS 1 (WAJIB SEBELUM DEPLOY):
═══════════════════════════════════════════════════════════════

┌─ 🔒 KEAMANAN DASAR ──────────────────────────────────────┐
│                                                            │
│  □ HTTPS aktif                                            │
│    → Cara: Aktifkan di Vercel/Railway (otomatis)          │
│    → Atau: Gunakan Cloudflare (GRATIS)                    │
│                                                            │
│  □ Environment variables terpisah dari kode                │
│    → Buat file .env untuk secrets                          │
│    → Tambahkan .env ke .gitignore                          │
│    → Buat .env.example sebagai template                    │
│    → Contoh: DATABASE_URL=postgresql://xxx                │
│                                                            │
│  □ Input divalidasi                                       │
│    → Cek email format valid                                │
│    → Cek password minimal 8 karakter                       │
│    → Bersihkan input dari kode berbahaya                   │
│    → Gunakan library: Zod, Joi, atau Yup                   │
│                                                            │
│  □ Rate limiting aktif                                    │
│    → Maksimal 100 request per menit per user              │
│    → Login: maksimal 5 percobaan per 5 menit              │
│    → Gunakan: express-rate-limit atau library sejenis      │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌─ 📊 MONITORING DASAR ────────────────────────────────────┐
│                                                            │
│  □ Error tracking aktif (Sentry)                          │
│    → Signup di sentry.io (GRATIS tier)                    │
│    → Install: npm install @sentry/node                    │
│    → Setiap error → Anda dapat email notifikasi           │
│                                                            │
│  □ Uptime monitoring aktif (UptimeRobot)                  │
│    → Signup di uptimerobot.com (GRATIS)                   │
│    → Tambahkan URL website Anda                           │
│    → Setiap 5 menit → cek apakah website hidup            │
│    → Jika mati → kirim email/WhatsApp alert               │
│                                                            │
│  □ Health check endpoint                                  │
│    → Buat: GET /health → { status: "ok" }                 │
│    → Dipakai oleh monitoring untuk cek server hidup       │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌─ 🧪 TESTING DASAR ───────────────────────────────────────┐
│                                                            │
│  □ Minimal ada 5-10 unit test                              │
│    → Test fungsi login (berhasil + gagal)                  │
│    → Test fungsi register (berhasil + duplikat)            │
│    → Test validasi input                                   │
│    → Gunakan: Jest atau Vitest                             │
│                                                            │
│  □ Test berjalan saat push ke GitHub                       │
│    → Buat GitHub Actions workflow                          │
│    → Setiap push → otomatis jalankan test                  │
│    → Jika test gagal → push ditolak                       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

```
CHECKLIST PRIORITAS 2 (TAMBAH SAAT PROYEK BERKEMBANG):
═══════════════════════════════════════════════════════════════

┌─ 🚀 CI/CD ───────────────────────────────────────────────┐
│                                                            │
│  □ GitHub Actions workflow aktif                          │
│    → Linting otomatis saat push                           │
│    → Type checking otomatis                                │
│    → Test otomatis                                         │
│    → Build check otomatis                                  │
│    → Auto-deploy saat merge ke main                       │
│                                                            │
│  □ Minimal punya:
│    ├── Linting (ESLint) → cek kode rapi                    │
│    ├── Type checking (TypeScript) → cek tipe data          │
│    ├── Unit test (Jest/Vitest) → cek fungsi berfungsi     │
│    └── Build check → cek aplikasi bisa di-build           │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌─ 📈 PERFORMANCE ─────────────────────────────────────────┐
│                                                            │
│  □ API response time < 200ms (p95)                        │
│    → Cara: Tambahkan logging waktu respons                │
│    → Jika lambat: optimasi database query                 │
│                                                            │
│  □ Page load time < 3 detik                               │
│    → Cara: Gunakan CDN (Cloudflare)                       │
│    → Kompres gambar (TinyPNG, Sharp)                       │
│    → Lazy loading untuk gambar/video                       │
│                                                            │
│  □ Database queries dioptimasi                            │
│    → Hindari N+1 queries                                  │
│    → Gunakan index di kolom yang sering di-query          │
│    → Gunakan connection pooling                            │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌─ 🛡️ RELIABILITY ─────────────────────────────────────────┐
│                                                            │
│  □ Error handling di semua API endpoint                   │
│    → Setiap API harus punya try-catch                     │
│    → Kembalikan pesan error yang jelas                    │
│    → Jangan biarkan aplikasi crash!                        │
│                                                            │
│  □ Database backup aktif                                  │
│    → Supabase/Neon sudah auto-backup                      │
│    → Pastikan Anda tahu cara restore                      │
│                                                            │
│  □ Rollback plan tersedia                                 │
│    → Jika deploy gagal, bagaimana rollback?               │
│    → Vercel: klik "Rollback" di dashboard                 │
│    → Railway: revert ke versi sebelumnya                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

> **💡 Tips untuk Vibe Coder Pemula:**
> **Jangan coba implementasi SEMUA sekaligus!** Ikuti urutan ini:
> 1. **Minggu 1:** HTTPS + Environment variables + Sentry
> 2. **Minggu 2:** Minimal 5 test + GitHub Actions
> 3. **Minggu 3:** Error handling + Health check
> 4. **Minggu 4:** Performance check + Backup verification
>
> Seiring waktu, tambahkan komponen lain. Yang penting **aplikasi aman dan bisa dimonitor**.

### 22.3 CI/CD: Otomasi Build & Deploy untuk Pemula

**CI/CD** mungkin terdengar menakutkan, tapi sebenarnya sangat sederhana:

```
ANALOGI CI/CD:
═══════════════════════════════════════════════════════════════

Tanpa CI/CD (Manual):
1. Anda tulis kode di laptop
2. Anda test manual di laptop
3. Anda push ke GitHub
4. Anda deploy manual ke Vercel/Railway
5. Jika error → Anda yang fix, ulang dari langkah 1

DENGAN CI/CD (Otomatis):
1. Anda tulis kode di laptop
2. Anda push ke GitHub
3. GitHub Actions OTOMATIS:
   ├── ✅ Jalankan linting (cek kode rapi)
   ├── ✅ Jalankan type check (cek tipe data)
   ├── ✅ Jalankan test (cek fungsi berfungsi)
   ├── ✅ Jalankan build (cek bisa di-build)
   ├── ✅ Security scan (cek keamanan)
   └── ✅ Deploy ke production
4. Jika ADA YANG GAGAL → deploy DITOLAK otomatis!
5. Anda fix, push lagi, proses berulang

→ ANDA TIDAK PERLU LAGI DEPLOY MANUAL!
→ CI/CD YANG HANDLE SEMUANYA!
```

**Setup CI/CD Termudah dengan GitHub Actions:**

```yaml
# File: .github/workflows/ci.yml
# Copy-paste ini ke project Anda!

name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      # 1. Checkout kode
      - uses: actions/checkout@v4

      # 2. Setup Node.js
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      # 3. Install dependencies
      - run: npm ci

      # 4. Linting (cek kode rapi)
      - run: npm run lint

      # 5. Type checking (cek tipe data)
      - run: npm run typecheck

      # 6. Unit test (cek fungsi berfungsi)
      - run: npm test

      # 7. Build (cek bisa di-build)
      - run: npm run build

      # 8. Security scan (cek keamanan)
      - run: npm audit --audit-level=high
```

**Bagaimana Cara Kerjanya?**
```
Anda push kode ke GitHub
        │
        ▼
GitHub Actions OTOMATIS menjalankan:
        │
├── Step 1: LINTING (5 detik)
│   └── Cek apakah kode mengikuti style guide
│   └── Jika ada error → STOP, Anda harus fix
│
├── Step 2: TYPE CHECK (10 detik)
│   └── Cek apakah tipe data benar
│   └── Jika ada error → STOP, Anda harus fix
│
├── Step 3: UNIT TEST (30-60 detik)
│   └── Jalankan semua test cases
│   └── Jika ada test gagal → STOP, Anda harus fix
│
├── Step 4: BUILD (60 detik)
│   └── Buat versi production
│   └── Jika build gagal → STOP, Anda harus fix
│
├── Step 5: SECURITY SCAN (30 detik)
│   └── Cek vulnerability di dependencies
│   └── Jika ada vulnerability kritis → STOP
│
└── ✅ SEMUA PASS → Deploy otomatis ke production!

Jika ADA YANG GAGAL di step manapun:
→ Deploy DITOLAK
→ Anda dapat notifikasi di GitHub
→ Anda fix, push lagi, proses berulang
```

> **💡 Tips untuk Vibe Coder Pemula:**
> Copy-paste file `.github/workflows/ci.yml` di atas ke project Anda. Sesuaikan commands-nya (npm run lint, npm test, dll) sesuai project Anda. Dengan ini, setiap kali Anda push kode, **semua pengecekan berjalan otomatis** — tidak perlu lagi test manual!

### 22.4 Deployment Strategies: Mana yang Cocok untuk Anda?

```
4 STRATEGI DEPLOYMENT (Dijelaskan dengan Analogi Restoran):
═══════════════════════════════════════════════════════════════

1. 🟢 BLUE-GREEN (Restoran dengan Dapur Cadangan)
   ├── Ada 2 dapur IDENTIK (Biru & Hijau)
   ├── Dapur Biru = production (yang dipakai sekarang)
   ├── Dapur Hijau = cadangan (untuk update)
   ├── Untuk update: masak di Dapur Hijau → test → switch!
   ├── Jika error di Dapur Hijau → switch balik ke Biru
   └── Hasil: ZERO DOWNTIME! User tidak merasakan gangguan.

   Cocok untuk: Aplikasi yang TIDAK BOLEH mati sebentar pun

2. 🐤 CANARY (Restoran dengan Test Taste)
   ├── Sajikan masakan baru ke 5% pelanggan dulu
   ├── Jika mereka suka → naikkan ke 25%, 50%, 100%
   ├── Jika mereka komplain →rollback, masak ulang
   └── Hasil: Risiko MINIMAL, pelanggan terlindungi.

   Cocok untuk: Aplikasi dengan banyak user, ingin aman

3. 🔄 ROLLING (Restoran dengan Update Bertahap)
   ├── Update meja 1 dulu → test → update meja 2 → dst
   ├── Jika meja 1 error → stop update, fix dulu
   └── Hasil: Update secara bertahap, tidak sekaligus.

   Cocok untuk: Server farm, Kubernetes

4. 📦 ONE-SHOT (Restoran Tutup Sebentar untuk Renovasi)
   ├── Matikan restoran sebentar
   ├── Renovasi semua sekaligus
   ├── Buka kembali setelah selesai
   └── Hasil: Sederhana, tapi ADA DOWNTIME.

   Cocok untuk: Maintenance window, MVP yang belum banyak user
```

**Rekomendasi untuk Vibe Coder Pemula:**
```
UNTUK VIBE CODER, GUNAKAN YANG PALING SEDERHANA:

FRONTEND (Vercel/Netlify):
├── Auto-deploy saat push ke main branch
├── Preview deploy untuk setiap pull request
├── Rollback via dashboard (klik 1 tombol)
└── ZERO CONFIG, ZERO DOWNTIME!

BACKEND (Railway/Render):
├── Auto-deploy saat push ke main branch
├── Health check otomatis
├── Rollback via dashboard
└── Sangat mudah!

Katakan ke AI:
"Buatkan deployment script untuk Vercel (frontend) 
 dan Railway (backend). Gunakan environment variables 
 untuk semua secrets."
```

### 22.5 Monitoring: Tahu Jika Ada Masalah

**Monitoring** adalah "CCTV untuk aplikasi Anda" — tanpa monitoring, Anda tidak akan tahu ada masalah sampai user komplain.

```
ANALOGI MONITORING:
═══════════════════════════════════════════════════════════════

Tanpa Monitoring:
├── Server mati → Anda tidak tahu
├── User dapat error → Anda tidak tahu
├── Database penuh → Anda tidak tahu
├── Ada security breach → Anda tidak tahu
└── Semua diketahui dari komplain user → TERLAMBAT!

DENGAN Monitoring:
├── Server mati → ALERT ke email/WhatsApp Anda
├── User dapat error → Error tercatat di Sentry
├── Database penuh → Warning di dashboard
├── Ada security breach → Alert keamanan
└── Semua diketahui SEBELUM user komplain!
```

**Stack Monitoring Termudah (GRATIS):**
```
1. 🐛 ERROR TRACKING: Sentry (GRATIS tier)
   ├── Signup: sentry.io
   ├── Install: npm install @sentry/node (backend)
   │           npm install @sentry/nextjs (Next.js)
   ├── Fitur:
   │   ├──捕捉 semua error otomatis
   │   ├── Kirim email saat error baru muncul
   │   ├── Tunjukkan error-nya di kode mana
   │   ├── Tracking affected users
   │   └── Regression detection
   └── Setup: 5 menit!

2. 📡 UPTIME MONITORING: UptimeRobot (GRATIS)
   ├── Signup: uptimerobot.com
   ├── Tambahkan URL website Anda
   ├── Setiap 5 menit → cek apakah website hidup
   ├── Jika mati → kirim email/WhatsApp/SMS alert
   └── Setup: 2 menit!

3. 📊 HEALTH CHECK ENDPOINT:
   ├── Buat route: GET /health
   ├── Response: { status: "ok", uptime: 12345, timestamp: "..." }
   ├── UptimeRobot monitor endpoint ini
   └── Anda bisa cek manual juga!

4. 📝 LOGGING SEDERHANA:
   ├── Console.log untuk development
   │   console.log("[INFO] User login: ", userId)
   │   console.error("[ERROR] Database connection failed:", err)
   ├── Untuk production: gunakan structured logging
   │   │   npm install pino (sangat cepat!)
   │   │   Atau gunakan console.log dengan JSON format
   └── Catat: waktu, level (info/error), pesan, context
```

> **💡 Tips untuk Vibe Coder Pemula:**
> **Paling tidak, pasang ini SEBELUM deploy:**
> 1. **Sentry** (5 menit setup) → Tahu jika ada error
> 2. **UptimeRobot** (2 menit setup) → Tahu jika server mati
> 3. **Health check endpoint** (10 menit setup) → Bukti server hidup
>
> Tiga hal ini saja sudah membuat Anda **10x lebih siap** dibanding kebanyakan vibe coder yang deploy tanpa monitoring!

---

## 23. VIBE ENGINEERING: EVOLUSI DARI VIBE CODING

> **💬 Bayangkan ini:** Anda suka memasak dengan bebas — tanpa resep, ikut feeling. Di awal, masakan Anda enak dan cepat. Tapi setelah beberapa bulan, masakan mulai tidak konsisten, bahan terbuang, dan Anda lupa apa yang sudah dibuat. **Vibe Engineering** adalah cara memasak yang tetap kreatif, tapi dengan catatan resep yang rapi agar hasilnya konsisten.

### 23.1 Apa Itu Vibe Engineering? (Penjelasan untuk Pemula)

```
PERBANDINGAN 3 PENDAKATAN:
═══════════════════════════════════════════════════════════════

1. VIBE CODING (2025)
   Analogi: Memasak tanpa resep
   ├── Anda deskripsikan ke AI: "Buatkan toko online"
   ├── AI langsung menulis kode
   ├── Anda coba → ada error → koreksi
   ├── AI perbaiki → coba lagi → error lagi
   └── Loop sampai "kelihatannya" berfungsi

   Kelebihan: SANGAT CEPAT untuk mulai!
   Kekurangan: 3-6 bulan lagi → berantakan!

2. STRUCTURED METHOD / ARCHITECT-BUILDER (Metode di materi ini)
   Analogi: Memasak dengan resep lengkap
   ├── Buat resep dulu (requirements)
   ├── Buat daftar belanja (blueprint)
   ├── Masak step by step (implementation)
   ├── Cicip dan koreksi (testing)
   └── Sajikan ke meja (deployment)

   Kelebihan: HASIL KONSISTEN, SIAP PRODUCTION!
   Kekurangan: Lebih lambat di awal.

3. VIBE ENGINEERING (2026 - Pendekatan Baru!)
   Analogi: Memasak bebas di awal, lalu CATAT resepnya
   ├── Masak bebas tanpa resep (eksplorasi)
   ├── Temukan resep yang enak (formalisasi)
   ├── Tulis resepnya dengan rapi (living spec)
   ├── Masak pakai resep itu (implementasi)
   └── Sajikan ke meja (deployment)

   Kelebihan: CEPAT di awal + RAPI untuk production!
   Kekurangan: Perlu disiplin transisi.
```

**Intinya:** Vibe Engineering menggabungkan yang terbaik dari kedua dunia:
- **Kecepatan** vibe coding di awal (eksplorasi)
- **Disiplin** structured method untuk production

> **💡 Dari riset Augment Code (2026):**
> *"Vibe coding delivers discovery speed; SDD delivers production durability. The three-month wall is real, requirements drift is measurable, and the synthesis is structured exploration with living specs."*

### 23.2 Dinding 3 Bulan: Mengapa Vibe Coding Tidak Bertahan

Ini adalah **fenomena nyata** yang dialami hampir semua vibe coder. Mari kita pahami:

```
POLA DECAY VIBE CODING:
═══════════════════════════════════════════════════════════════

BULAN 1-3: EUPHORIA (Keceriaan) 😄
─────────────────────────────────
Anda: "Wah, AI bisa buat aplikasi dalam sehari!"
├── ✅ Fitur baru ship dengan cepat
├── ✅ Semua terasa mudah
├── ✅ Teman-teman kagum
└── ⚠️ TAPI: Anda tidak mencatat keputusan!
    ⚠️ TAPI: Anda tidak menulis test!
    ⚠️ TAPI: Kode tidak terstruktur!

BULAN 4-9: PLATEAU (Datar) 😐
─────────────────────────────
Anda: "Kok error-nya makin banyak ya..."
├── ⚠️ Bug yang diperbaiki justru memecah fitur lain
├── ⚠️ AI mulai "lupa" instruksi awal
├── ⚠️ Kode duplikat di mana-mana
├── ⚠️ Waktu fix bug > waktu buat fitur baru
└── ⚠️ Codebase mulai sulit dipahami

BULAN 10-15: DECLINE (Penurunan) 😰
────────────────────────────────────
Anda: "Kenapa fitur baru butuh waktu berminggu-minggu?"
├── ❌ Setiap fitur baru → harus debug 3 fitur lama
├── ❌ Kode duplikat naik 8x lipat!
├── ❌ Refactoring activity turun 60%
├── ❌ Anda tidak pahami kode Anda sendiri!
└── ❌ AI juga bingung dengan kode yang berantakan

BULAN 16-18: STALL (Mandek) 🚫
───────────────────────────────
Anda: "Saya harus mulai dari nol lagi..."
├── 🚫 Delivery berhenti total
├── 🚫 Rewrite menjadi satu-satunya opsi
└── 🚫 Semua investasi waktu sebelumnya TERBUANG
```

**Mengapa Ini Terjadi?**

```
ANALOGI: MEMBANGUN RUMAH TANPA DENAH
═══════════════════════════════════════════════════════════════

Bulan 1: Anda bilang ke tukang "Bangun rumah 2 lantai"
├── Tukang bangun sesuai tebakan
├── Rumah kelihatan bagus dari luar
└── TAPI: tidak ada denah, tidak ada struktur

Bulan 3: Anda minta tambah kamar mandi
├── Tukang tambah kamar mandi di mana saja
├── Listrik jadi kacau
└── Pipa air bocor

Bulan 6: Anda minta tambah dapur
├── Dapur harusnya dekat kamar mandi (untuk pipa air)
├── TAPI kamar mandi sudah di tempat yang salah
├── Harus bongkar dulu → biaya besar
└── Rumah jadi berantakan

Bulan 12: Anda sadar harus BONGKAR TOTAL
└── Semua yang dibangun 12 bulan lalu TERBUANG

───

ITU PERSIS APA YANG TERJADI DENGAN VIBE CODING!
Tanpa denah (system design) dan catatan (documentation),
proyek akan COLLAPSE setelah beberapa bulan.
```

> **💡 Dari riset GitClear (211 juta baris kode):**
> *"Code duplication increased ~48% since 2021. Copy-pasted lines exceeded refactored lines for the first time in 2024. Models generate self-contained snippets rather than discovering existing abstractions."*
>
> Artinya: AI cenderung membuat kode yang **terisolasi** dan **berulang** — bukan kode yang **terstruktur** dan **reusable**.

> **💡 Dari Addy Osmani (Chrome Engineering Lead, Google):**
> *"Vibe coding is not the same as AI-assisted engineering. The consensus from leaders is that vibe coding puts critical software qualities at risk: security, clarity, maintainability, and team knowledge."*

### 23.3 Kapan Harus Transisi? (Tanda-tanda yang Harus Anda Waspadai)

Jangan menunggu sampai bulan 12! **Transisi SEGERA** saat Anda melihat tanda-tanda ini:

```
TANDA-TANDA ANDA HARUS BERPINDAH KE STRUCTURED METHOD:
═══════════════════════════════════════════════════════════════

🟡 TANDA 1: CONTEXT DRIFT (Konteks Terpengaruh)
──────────────────────────────────────────────────
Gejala:
├── AI memperbaiki 1 bug, tapi MEMECAH 3 file lain
├── Anda harus koreksi AI lebih dari 2 kali untuk hal SAMA
└── AI mulai "lupa" instruksi yang sudah Anda berikan

Contoh nyata:
Anda: "Tambahkan kolom 'telepon' di form registrasi"
AI: [menambah kolom telepon] TAPI [menghapus validasi email]!
Anda: "Eh, kok validasi email hilang?"
AI: [memperbaiki validasi] TAPI [mengubah warna button]!
→ INI=context drift! AI tidak bisa melihat big picture.

Solusi: Mulai pakai architect pack + acceptance criteria.

───

🟡 TANDA 2: REGRESSION PATTERNS (Bug Berulang)
──────────────────────────────────────────────────
Gejala:
├── Fitur yang sudah benar, jadi error lagi
├── Bug yang sama muncul berulang kali
└── Anda merasa "sudah pernah fix ini"

Contoh nyata:
Bulan 1: Login berhasil → Deploy
Bulan 2: Login error "Cannot read property 'email'"
Bulan 3: Login berhasil lagi → Deploy
Bulan 4: Login error "Cannot read property 'email'" LAGI!
→ INI=regression! Tidak ada test yang mencegah.

Solusi: Tulis test! Minimal test untuk fitur kritis.

───

🟡 TANDA 3: TEAM EXPANSION (Tim Bertambah)
──────────────────────────────────────────────────
Gejala:
├── Ada orang baru yang harus memahami codebase
├── Orang baru bertanya: "Kenapa kodenya begini?"
└── Tidak ada dokumentasi yang menjelaskan

Contoh nyata:
Anda: "Oh, yang ini... ya... intinya gitu deh..."
→ Anda sendiri juga tidak ingat kenapa menulis kode begitu!

Solusi: Buat folder system + documentation.

───

🟡 TANDA 4: PRODUCTION INTENT (Siap Dipakai User)
──────────────────────────────────────────────────
Gejala:
├── User/client sudah menunggu aplikasi Anda
├── Bisnis process akan bergantung pada sistem
└── Jika error → ada dampak finansial/reputasi

Contoh nyata:
Klien: "Kapan aplikasinya selesai? Sudah 2 bulan..."
Anda: "Sebentar, masih ada bug..."
→ Jika dipakai user, error = DSA PUBLIK!

Solusi: Full Architect-Builder method + production checklist.

───

🟡 TANDA 5: SCOPE MELEBIHI 10 FITUR
──────────────────────────────────────
Gejala:
├── Proyek sudah punya > 10 fitur
├── Satu chat AI sudah terlalu panjang
└── AI mulai "bingung" dengan codebase

Contoh nyata:
Chat AI sudah 200+ message
Anda: "Buatkan fitur baru..."
AI: "Maaf, saya tidak bisa menemukan file yang Anda maksuk"
→ Context window sudah penuh!

Solusi: Mulai pakai sprint-based development.

───

🟡 TANDA 6: AI LOOP (AI Terjebak)
───────────────────────────────────
Gejala:
├── AI mengoreksi error yang SAMA lebih dari 2 kali
├── AI membuat perubahan yang tidak relevan
└── Anda sudah 10 menit koreksi tapi belum selesai

Contoh nyata:
Anda: "Fix error di line 42"
AI: [fix line 42] TAPI [error di line 87]
Anda: "Fix error di line 87"
AI: [fix line 87] TAPI [error di line 42 LAGI!]
→ AI terjebak dalam loop!

Solusi: /clear lalu buat prompt baru yang lebih spesifik.
```

### 23.4 Hybrid Workflow: Best of Both Worlds (Step-by-Step)

Berikut **alur kerja hybrid** yang bisa langsung Anda praktikkan:

```
HYBRID WORKFLOW: 5 TAHAP
═══════════════════════════════════════════════════════════════

TAHAP 1: VIBE EXPLORATION (Hari 1-2)
──────────────────────────────────────
Tujuan: Eksplorasi ide dengan BEBAS tanpa tekanan

Cara:
1. Buka ChatGPT/Claude
2. Deskripsikan ide Anda secara bebas:
   "Saya ingin membuat [deskripsi aplikasi]"
   "Masalah yang ingin diselesaikan: [masalah]"
   "Pengguna: [siapa]"
3. AI generate prototype cepat
4. Coba prototype-nya
5. Catat apa yang WORKS dan apa yang TIDAK

Yang Anda dapatkan:
├── Prototype yang bisa dilihat
├── Pemahaman awal tentang requirements
├── Tahu fitur mana yang sudah jelas
└── Tahu pertanyaan yang masih terbuka

Contoh output:
"Prototype toko online sudah jadi.
 Fitur yang sudah jelas:
 - Daftar produk ✓
 - Keranjang belanja ✓
 - Checkout (belum jelas cara pembayarannya)
 Pertanyaan: Bayar via apa? Transfer? QRIS? Kartu?"

───

TAHAP 2: FORMALIZATION TRIGGER (Hari 2-3)
──────────────────────────────────────────
Tujuan: Putuskan kapan harus berpindah ke structured method

Tanyakan diri Anda:
□ Apakah prototype ini akan dipakai user sungguhan?
□ Apakah ada lebih dari 1 fitur yang sudah jelas?
□ Apakah Anda sudah mulai "bingung" dengan kode yang ada?
□ Apakah ada open questions yang perlu dijawab?

Jika jawabannya YA untuk 2 atau lebih pertanyaan:
→ SAATNYA BERPINDAH KE STRUCTURED METHOD!

Yang Anda lakukan:
1. Buat folder proyek dengan struktur scaffold
   (lihat Bagian 6 materi ini)
2. Buat file-file dasar:
   ├── STATE.MD (status proyek)
   ├── DECISIONS.MD (keputusan yang sudah dibuat)
   ├── DOMAIN.MD (konteks bisnis)
   └── AGENTS.MD (aturan untuk AI)
3. Jawab pertanyaan-pertanyaan yang masih terbuka

Yang Anda dapatkan:
├── Foundation yang rapi untuk proyek
├── Semua keputusan terdokumentasi
└── Siap untuk sprint-based development

───

TAHAP 3: LIVING SPEC CREATION (Hari 3-5)
──────────────────────────────────────────
Tujuan: Buat "resep masak" yang bisa diikuti AI

Cara:
1. Buka Architect AI (ChatGPT/Claude Project)
2. Upload prototype + findings dari Tahap 1
3. Minta Architect buat:
   ├── Requirements.MD (apa yang harus dibangun)
   ├── Blueprint.MD (bagaimana cara membangunnya)
   ├── Acceptance.MD (kriteria "sudah selesai")
   └── Handoff-Prompt.MD (prompt untuk Builder)
4. Save di folder planning/sprints/sprint-001/

Yang Anda dapatkan:
├── Architect Pack lengkap untuk Sprint 1
├── Rencana yang bisa di-review
└── Prompt yang siap di-paste ke Builder

───

TAHAP 4: ITERATE WITHIN SPEC (Hari 5+)
─────────────────────────────────────────
Tujuan: Bangun aplikasi secara terstruktur

Cara (ulangi untuk setiap sprint):
1. Buka Builder AI (Claude Code/Codex)
2. Paste prompt dari Handoff-Prompt.MD
3. Builder dry run → Anda review
4. Builder coding → Anda review
5. Builder test → Anda review hasil
6. Update STATE.MD
7. Buat Architect Pack untuk sprint berikutnya
8. Ulangi!

Yang Anda dapatkan:
├── Fitur baru setiap sprint
├── Kode yang terstruktur dan terdokumentasi
├── Test yang berfungsi
└── Aplikasi yang siap production

───

TAHAP 5: PRODUCTION LAUNCH (Kapan saja siap)
──────────────────────────────────────────────
Tujuan: Deploy ke production dengan aman

Cara:
1. Centang Production Readiness Checklist (Bagian 22)
2. Deploy frontend ke Vercel
3. Deploy backend ke Railway
4. Deploy database ke Supabase
5. Aktifkan monitoring (Sentry + UptimeRobot)
6. Test dari browser yang berbeda
7. 🎉 Aplikasi LIVE!

Yang Anda dapatkan:
├── Aplikasi yang bisa diakses dari internet
├── Monitoring aktif
├── Siap untuk user sungguhan
└── Dibangun dengan cara yang BENAR! 🎉
```

### 23.5 Kapan Tetap Vibe Coding? Kapan Pindah?

```
DECISION MATRIX:
═══════════════════════════════════════════════════════════════

TETAP VIBE CODING JIKA:
────────────────────────
✅ Prototype / MVP yang tidak akan dipakai lama
✅ Personal automation script (cron job, scraper)
✅ Learning exercise / tutorial project
✅ Hackathon project (< 1 minggu)
✅ "Home-cooked software" (hanya untuk Anda)
✅ Eksplorasi ide sebelum commit ke project besar

Berapa lama? Biasanya 1-2 minggu. Setelah itu, review:
"Apakah ini akan jadi project serius?"
Jika YA → transisi ke Structured Method.

───

PINDAH KE STRUCTURED METHOD JIKA:
─────────────────────────────────
🟡 Aplikasi akan dipakai user sungguhan
🟡 Tim lebih dari 1 orang
🟡 Fitur sudah > 10
🟡 Ada requirement yang berubah-ubah
🟡 AI mulai "bingung" (context drift)
🟡 Bug yang sama berulang (regression)

Berapa lama transisi? 1-2 hari untuk setup foundation.
Setelah itu, workflow tetap sama dengan vibe coding
TAPI dengan arsitektur yang rapi.

───

GUNAKAN FULL ARCHITECT-BUILDER METHOD JIKA:
─────────────────────────────────────────────
🔴 Proyek untuk klien / bisnis
🔴 Tim > 3 orang
🔴 Deadline yang ketat
🔴 Compliance / regulasi harus dipenuhi
🔴 Aplikasi menangani data sensitif
🔴 Butuh maintenance jangka panjang (> 1 tahun)
```

> **💡 Pesan Penting:**
> **Tidak ada yang salah dengan vibe coding!** Andrej Karpathy sendiri bilang vibe coding cocok untuk "throwaway weekend projects." Masalahnya adalah ketika vibe coding dipakai untuk project yang **seharusnya** production-ready.
>
> **Vibe Engineering** adalah jawabannya: mulai dengan bebas (vibe coding), lalu formalisasi saat project mulai serius (structured method). Ini adalah practice yang **emerging** di tahun 2026 dan menjadi standar baru untuk developer yang ingin cepat TAPI tetap berkualitas.
```

---

## 24. REFERENSI & SUMBER

### Sumber Utama yang Digunakan

1. **120x.ai** — "How I Use ChatGPT and Codex to Build Software Without Vibe Coding"
   - Transkrip lengkap dari video tutorial
   - Metode Architect-Builder
   - Struktur folder scaffold
   - Sprint-based development

2. **Chris Titus Tech** — "My AI Coding Workflow That Actually Works"
   - https://christitus.com/my-ai-workflow/
   - Plain-text guardrails
   - Specification-driven development
   - Review-focused workflow
   - Security & dependency checks

3. **Anthropic** — "Best Practices for Claude Code"
   - https://code.claude.com/docs/en/best-practices
   - Context window management
   - Explore-Plan-Implement workflow
   - Verification & testing
   - Skills, hooks, subagents

4. **Anthropic** — "Prompting Best Practices"
   - https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
   - Clear and direct prompting
   - XML structuring
   - Few-shot examples
   - Long context handling

5. **Augment Code** — "Agentic Design Patterns: 2026 Pattern Catalog"
   - https://www.augmentcode.com/guides/agentic-design-patterns
   - 12 pola agentic fondational (Ng + Anthropic)
   - Pola emergent production reliability
   - Pattern selection framework

6. **Augment Code** — "Vibe Coding vs Spec-Driven Development 2026"
   - https://www.augmentcode.com/guides/vibe-coding-vs-spec-driven-development
   - Three-month wall phenomenon
   - Hybrid workflow: structured exploration + living specs
   - Transition triggers from vibe to structured

7. **Addy Osmani (Google)** — "Vibe Coding is Not AI-Assisted Engineering"
   - https://medium.com/@addyosmani/vibe-coding-is-not-the-same-as-ai-assisted-engineering-3f81088d5b98
   - Critical analysis of vibe coding risks
   - Security, clarity, maintainability concerns

8. **LangChain** — "Agentic Engineering: How Swarms of AI Agents Are Redefining Software"
   - https://www.langchain.com/blog/agentic-engineering-redefining-software-engineering
   - Agentic engineering systems
   - Task-level to system-level collaboration

9. **Anthropic** — "Building Effective AI Agents" (Dec 2024)
   - https://www.anthropic.com/engineering/building-effective-agents
   - Workflows vs Agents distinction
   - 5 workflow patterns

10. **arXiv** — "Practical Guide for Designing, Developing, and Deploying Agentic AI Systems"
    - https://arxiv.org/html/2512.08769
    - Production-quality agentic AI systems
    - End-to-end deployment guide

11. **System Design Codex** — "Essential Components of Production-Ready Web Applications"
    - https://newsletter.systemdesigncodex.com/p/essential-components-of-a-production
    - Production architecture checklist
    - CI/CD, CDN, Load Balancer, API Gateway

12. **GitClear** — "AI Code Quality Study" (211 juta baris kode)
    - Analisis dampak AI terhadap code quality
    - Code churn, duplication, refactoring metrics

### Konsep Pendukung

- **Agile/Scrum Methodology** — Metodologi pengembangan iteratif dengan sprint
- **Specification-Driven Development** — Pendekatan di mana spesifikasi mendahului kode
- **Test-Driven Development (TDD)** — Penulisan test sebelum kode
- **Context Window Management** — Pengelolaan batas konteks LLM
- **Prompt Engineering** — Seni membuat prompt yang efektif untuk AI
- **Documentation-Driven Development** — Pendekatan di mana dokumentasi mendahului kode
- **Modular Monolith Architecture** — Arsitektur monolith dengan modular boundaries yang jelas
- **Agentic Design Patterns** — Pola desain untuk sistem AI otonom
- **Production Readiness** — Standar kesiapan aplikasi untuk production
- **Observability** — Kemampuan memahami status internal sistem dari output eksternal
- **Vibe Engineering** — Pendekatan hybrid eksplorasi + formalisasi spesifikasi
- **Guardrail Pattern** — Lapisan keamanan di 4 titik eksekusi AI agent

### Tools yang Direkomendasikan

| Tool | URL | Kegunaan |
|------|-----|----------|
| ChatGPT | chat.openai.com | Architect (LLM) |
| Claude | claude.ai | Architect (LLM) |
| OpenAI Codex | codex.openai.com | Builder (Coding) |
| Claude Code | docs.anthropic.com/claude-code | Builder (Coding) |
| Cursor | cursor.com | Builder (IDE) |
| Obsidian | obsidian.md | Markdown Viewer |
| GitHub | github.com | Version Control |
| CodeRabbit | coderabbit.ai | AI Code Review |

---

**📅 Terakhir diperbarui:** Agustus 2026  
**✍️ Disusun dari:** 12 sumber utama (120x.ai, Chris Titus Tech, Anthropic, Augment Code, Addy Osmani, LangChain, arXiv, System Design Codex, GitClear)  
**🎯 Tujuan:** Materi pembelajaran ultra-detail untuk pemula hingga menengah yang ingin membangun perangkat lunak dengan AI secara terstruktur, memahami system design architecture, agentic patterns, dan standar production-ready — untuk web developer fullstack dan software engineer global

---

> **💬 Pesan Penutup:**
>
> *"Don't wait for a mythical future model to fix a bad development process. Use the tools available today, keep the parts that work, remove the parts that do not, and make the process better every time."*
> — Chris Titus Tech
>
> *"The answer was not more context. The answer was to get cleaner context."*
> — 120x.ai
>
> *"Give Claude a check it can run: tests, a build, a screenshot to compare. It's the difference between a session you watch and one you walk away from."*
> — Anthropic
