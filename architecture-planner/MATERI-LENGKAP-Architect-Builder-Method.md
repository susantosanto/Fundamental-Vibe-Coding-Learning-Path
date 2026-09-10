# 🏗️ PANDUAN LENGKAP: Metode Architect-Builder
## Cara Membangun Perangkat Lunak dengan AI tanpa Vibe Coding

**Sumber:** Adaptasi dari materi 120x.ai tentang penggunaan ChatGPT/Codex untuk membangun perangkat lunak  
**Target Pembaca:** Pemula, pemilik bisnis, konsultan, eksekutif, siapa saja yang ingin membangun aplikasi dengan AI  
**Bahasa:** Indonesia  

---

## 📑 DAFTAR ISI

1. [Apa Itu Vibe Coding dan Kenapa Gagal?](#1-apa-itu-vibe-coding-dan-kenapa-gagal)
2. [Metode Architect-Builder: Konsep Inti](#2-metode-architect-builder-konsep-inti)
3. [Peran Architect vs Builder](#3-peran-architect-vs-builder)
4. [Analogi Membangun Rumah](#4-analogi-membangun-rumah)
5. [Struktur Folder Proyek (The Scaffold)](#5-struktur-folder-proyek-the-scaffold)
6. [Penjelasan Setiap File dan Folder](#6-penjelasan-setiap-file-dan-folder)
7. [Workflow Lengkap Step-by-Step](#7-workflow-lengkap-step-by-step)
8. [Context Engineering: Rahasia Sukses](#8-context-engineering-rahasia-sukses)
9. [Sprint-Based Development](#9-sprint-based-development)
10. [Tips Praktis dan Best Practices](#10-tips-praktis-dan-best-practices)
11. [Kesimpulan](#11-kesimpulan)

---

## 1. APA ITU VIBE CODING DAN KENAPA GAGAL?

### 🎯 Apa Itu Vibe Coding?

**Vibe Coding** adalah pendekatan di mana seseorang langsung membuka tools AI seperti Cursor, Lovable, Replit, atau Claude Code, lalu mengatakan: *"Buatkan saya aplikasi!"* — tanpa perencanaan yang matang.

Istilah ini dipopulerkan oleh Andrej Karpathy (co-founder OpenAI) pada awal 2025, yang mendeskripsikan pendekatan "sepenuhnya vibes" di mana Anda "lupa bahwa kode itu bahkan ada."

### ❌ Mengapa Vibe Coding Gagal?

Vibe Coding memiliki masalah mendasar yang membuatnya **tidak cocok untuk perangkat lunak serius**:

#### a) Aturan Bisnis yang Tidak Jelas
Saat Anda memberikan ide yang samar-samar ke AI, AI harus **menebak**:
- Aturan bisnis apa yang berlaku?
- Bagaimana workflow-nya?
- Bagaimana dengan kasus-kasus edge (situasi tak terduga)?
- Apa definisi "selesai" dari fitur ini?

**Contoh masalah:**
```
 Anda: "Buatkan aplikasi manajemen inventaris"
 AI: *membuat aplikasi* ✓
 
 Tapi...
 - AI tidak tahu ada approval step yang harus dilewati
 - AI tidak tahu ada kolom spreadsheet yang selalu bermasalah
 - AI tidak tahu siapa yang boleh akses data apa
 - AI tidak tahu laporan mana yang sebenarnya dilihat pemilik
```

#### b) Konteks yang Tersebar
Dalam vibe coding, pengetahuan proyek tersebar di sepanjang chat:
- Keputusan penting terkubur di message #12 dari 3 hari lalu
- Pengecualian kritis ada di message #27
- Kriteria penerimaan tidak ada karena Anda "vibing" saja

#### c) AI Improvisasi Tanpa Batas
AI akan mulai **mengarang** saat tidak mendapat instruksi yang jelas:
- Membuat izin (permission) sendiri
- Menentukan workflow sendiri
- Menciptakan fitur yang tidak diminta

> **💡 INTI MASALAH:** Builder (AI coding tool) tidak seharusnya menebak aturan bisnis Anda. Builder harus membangun dari **rencana yang sudah disetujui**.

---

## 2. METODE ARCHITECT-BUILDER: KONSEP INTI

### 🧠 Apa Itu Architect-Builder Method?

Metode **Architect-Builder** adalah pendekatan terstruktur di mana:

```
┌─────────────────────────────────────────────────┐
│                                                   │
│   ARCHITECT (Perencana)          BUILDER (Pelaksana)   │
│   ┌─────────────────┐          ┌─────────────────┐    │
│   │  ChatGPT / Claude │  ──→    │  Codex / Claude   │    │
│   │  (LLM)            │  Handoff│  Code / Cursor    │    │
│   │                    │  File   │                   │    │
│   │  • Brainstorming   │  Struktur│  • Menulis kode   │    │
│   │  • Perencanaan     │         │  • Mengimplementasi│   │
│   │  • Review          │         │  • Testing         │   │
│   └─────────────────┘          └─────────────────┘    │
│          │                              │              │
│          └──────────────────────────────┘              │
│                     │                                  │
│            ┌─────────────────┐                        │
│            │  SOURCE OF TRUTH │                        │
│            │  (Folder Proyek) │                        │
│            └─────────────────┘                        │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### 🔑 Tiga Pilar Utama

| Pilar | Penjelasan |
|-------|-----------|
| **Architect Layer** | LLM (ChatGPT/Claude) yang bertindak sebagai perencana, brainstorming partner, dan reviewer |
| **Builder Layer** | Tool coding (Codex/Claude Code/Cursor) yang menulis kode berdasarkan rencana |
| **Source of Truth** | Folder/folder system proyek yang menjadi "otak" seluruh proyek |

### 💡 Prinsip Dasar

1. **Architect dulu, Builder kemudian** — Selalu rencanakan sebelum coding
2. **Percayai folder system** — Bukan riwayat chat, tapi folder yang jadi sumber kebenaran
3. **Konteks yang bersih > Konteks yang banyak** — Jawabannya bukan lebih banyak konteks, tapi konteks yang lebih bersih dan terstruktur

---

## 3. PERAN ARCHITECT VS BUILDER

### 🏛️ Peran Architect (Perencana)

Architect menggunakan **Large Language Model (LLM)** seperti ChatGPT atau Claude. Peran utamanya:

```
┌─────────────────────────────────────────────┐
│           PERAN ARCHITECT                      │
├─────────────────────────────────────────────┤
│ ✅ Mendefinisikan tujuan proyek               │
│ ✅ Mengidentifikasi pengguna                  │
│ ✅ Merancang workflow                         │
│ ✅ Menentukan requirements                    │
│ ✅ Membuat blueprints (cetak biru)            │
│ ✅ Mengidentifikasi risiko                    │
│ ✅ Membuat rencana validasi                   │
│ ✅ Mendefinisikan kriteria penerimaan         │
│ ✅ Menyiapkan handoff untuk builder           │
│ ✅ Review dan sanity check hasil builder      │
└─────────────────────────────────────────────┘
```

### 🔨 Peran Builder (Pelaksana)

Builder menggunakan **coding tool** seperti Codex, Claude Code, atau Cursor. Peran utamanya:

```
┌─────────────────────────────────────────────┐
│           PERAN BUILDER                       │
├─────────────────────────────────────────────┤
│ ✅ Membaca architect pack (rencana)           │
│ ✅ Melakukan dry run untuk validasi           │
│ ✅ Mengimplementasi kode                      │
│ ✅ Menulis test                               │
│ ✅ Memperbarui folder proyek                  │
│ ✅ Melaporkan hasil ke architect              │
│ ❌ TIDAK menebak aturan bisnis                │
│ ❌ TIDAK mengarang fitur sendiri              │
│ ❌ TIDAK mengambil keputusan arsitektural     │
└─────────────────────────────────────────────┘
```

### 🔄 Siklus Kerja

```
    ┌──────────┐
    │ Architect │
    │ membuat   │
    │ rencana   │
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │ Builder   │
    │ membaca   │
    │ & build   │
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │ Builder   │
    │ melaporkan│
    │ hasil     │
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │ Architect │
    │ review &  │
    │ approve   │
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │ Lanjut ke │
    │ Sprint    │
    │ berikutnya│
    └──────────┘
```

---

## 4. ANALOGI MEMBANGUN RUMAH

Bayangkan Anda ingin membangun rumah impian:

### ❌ Cara yang Salah (Vibe Coding)
```
Anda: [memberikan sketsa di atas tisu ke tukang]
      "Bangun yang modern, 3 kamar tidur, dapur yang bagus,
       terserah kalian atur."

Hasil: Rumah yang TIDAK sesuai keinginan Anda.
       Karena tukang harus menebak semua detail sendiri.
```

### ✅ Cara yang Benar (Architect-Builder)
```
Anda → Berbicara dengan Arsitek
       ↓
Arsitek bertanya banyak hal:
       • Berapa budget?
       • Gaya hidup seperti apa?
       • Berapa banyak anggota keluarga?
       • Butuh ruang kerja?
       • Preferensi material?
       ↓
Arsitek membuat gambar teknis lengkap:
       • Denah lantai
       • Tampak depan/samping/belakang
       • Detail struktur
       • Spesifikasi material
       ↓
Gambar teknis diserahkan ke Tukang (Builder)
       ↓
Tukang membangun SESUAI gambar teknis
       ↓
Hasil: Rumah sesuai impian Anda!
```

### 🏠 Penerapan dalam Software

| Rumah | Software |
|-------|----------|
| Anda (pemilik rumah) | Anda (pemilik bisnis/ide) |
| Arsitek | ChatGPT/Claude (Architect) |
| Tukang/Bangunan | Codex/Claude Code (Builder) |
| Gambar teknis | Architect Pack (rencana) |
| Material & struktur | Kode sumber (source code) |
| Inspeksi rumah | Testing & validasi |

---

## 5. STRUKTUR FOLDER PROYEK (THE SCAFFOLD)

### 📁 Struktur Folder Lengkap

```
📁 NAMA_PROYEK/
│
├── 📄 AGENTS.MD                    ← Router utama (baca pertama!)
├── 📄 CLAUDE.MD / CODEX.MD         ← Config untuk AI tool spesifik
├── 📄 README.MD                     ← Overview untuk manusia
│
├── 📁 docs/                          ← Dokumentasi teknis tahan lama
│   ├── 📄 ARCHITECTURE.MD           ← Peta sistem
│   ├── 📄 DATA-MODEL.MD             ← Model data
│   ├── 📄 API.MD                    ← Endpoint & integrasi
│   ├── 📄 PERMISSIONS.MD            ← Role & akses
│   └── 📄 VALIDATION.MD             ← Cara validasi sistem
│
├── 📁 planning/                      ← Perencanaan proyek
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
├── 📄 STATE.MD                       ← Status saat ini (diperbarui terus)
├── 📄 DECISIONS.MD                   ← Log keputusan
├── 📄 DOMAIN.MD                      ← Domain bisnis
├── 📄 RISKS.MD                       ← Daftar risiko
├── 📄 QUESTIONS.MD                   ← Pertanyaan terbuka
├── 📄 FILE-INVENTORY.MD              ← Inventaris file sumber
│
├── 📁 references/                    ← File referensi (PDF, Excel, dll)
├── 📁 src/                           ← Kode sumber
└── 📁 architect-packs/               ← Output dari architect
```

### 🎯 Mengapa Folder System Ini Penting?

> **"Jawaban untuk masalah konteks bukan lebih banyak konteks, tapi konteks yang lebih bersih."**

Folder system ini berfungsi sebagai:
1. **Source of Truth** — Bukan chat history, tapi folder yang jadi acuan
2. **Context Engineering** — Memberikan informasi yang tepat pada waktu yang tepat
3. **Handoff Mechanism** — Cara untuk "menyerahkan" pekerjaan dari architect ke builder
4. **Knowledge Base** — Seluruh pengetahuan proyek tersentralisasi dan terorganisir

---

## 6. PENJELASAN SETIAP FILE DAN FOLDER

### 📄 AGENTS.MD — Router Utama

**Fungsi:** File pertama yang harus dibaca oleh setiap AI agent atau human builder.

**Isi:**
- Model operasi proyek
- File mana yang harus dibaca lebih dulu
- Aturan yang harus diikuti builder
- Workflow yang digunakan

**Analogi:** Seperti "judul besar" di toko — memberitahu semua orang ke mana harus pergi.

---

### 📄 CLAUDE.MD / CODEX.MD — Adapter Tool

**Fungsi:** Konfigurasi spesifik untuk AI tool yang digunakan.

**Catatan:**
- Jika pakai Claude Code → isi `CLAUDE.MD`
- Jika pakai OpenAI Codex → isi `CODEX.MD`
- Keduanya melakukan hal yang sama, hanya berbeda nama

**Yang TIDAK boleh dilakukan:** Jangan jadikan file ini sebagai "otak utama" proyek. Ini hanya bagian kecil dari otak.

---

### 📄 README.MD — Overview untuk Manusia

**Fungsi:** Jika seseorang membuka folder ini "dari nol", file ini harus memberitahu mereka:
- Apa proyek ini?
- Ke mana harus mencari selanjutnya?
- Apa isi folder-folder lainnya?

---

### 📁 docs/ — Dokumentasi Teknis

#### 📄 ARCHITECTURE.MD — Peta Sistem
```
Isi:
- Bagian-bagian utama aplikasi
- Cara bagian-bagian tersebut terhubung
- Diagram alur data
- Komponen dan interaksinya
```

#### 📄 DATA-MODEL.MD — Model Data
```
Isi:
- Entitas-entitas inti (User, Product, Order, dll)
- Field/f kolom setiap entitas
- Hubungan antar entitas (relasi)
- Penting untuk proyek yang heavy database/spreadsheet
```

#### 📄 API.MD — Endpoint & Integrasi
```
Isi:
- API endpoint yang tersedia
- Input dan output masing-masing endpoint
- Aturan integrasi dengan tools lain
- Contoh: integrasi dengan Sage Intacct, Stripe, dll
```

#### 📄 PERMISSIONS.MD — Role & Akses
```
Isi:
- Daftar role pengguna (Admin, User, Manager, dll)
- Siapa yang boleh akses apa
- Aturan akses per role
- Contoh: "Manager bisa melihat laporan, tapi tidak bisa edit data keuangan"
```

#### 📄 VALIDATION.MD — Validasi Sistem
```
Isi:
- Cara membuktikan sistem benar
- Bagaimana output terhubung ke data sumber
- Test cases untuk bisnis sistem
- Contoh: "Total di laporan harus sama dengan jumlah di database"
```

---

### 📁 planning/ — Perencanaan

#### 📁 meetings/ — Catatan Rapat
```
Isi:
- Auto-notes dari percakapan dengan klien
- Poin-poin penting
- Keputusan yang diambil (dipindah ke DECISIONS.MD jika sudah final)
```

#### 📁 sprints/ — Detail Per Sprint
```
Isi per sprint:
- REQUIREMENTS.MD — Apa yang dibangun dan mengapa
- BLUEPRINT.MD — Bagaimana rencana membangunnya
- ACCEPTANCE.MD — Apa artinya "selesai" untuk sprint ini
- HANDOFF-PROMPT.MD — Prompt untuk diserahkan ke builder
```

---

### 📄 STATE.MD — Status Saat Ini

**Fungsi:** Peta real-time proyek. Diperbarui terus-menerus.

```
Isi:
- Sprint mana yang sedang berjalan?
- Apa yang baru saja terjadi?
- Apa langkah selanjutnya?
- Apa yang terblokir (blocked)?

Contoh isi:
═══════════════════════════════════
PROYEK: Dashboard Keuangan CEO
STATUS: Sprint 3 sedang berjalan
═══════════════════════════════════
Sprint terakhir: Sprint 2 (Sample Bundle) ✓ Berhasil
Sprint aktif: Sprint 3 (Executive Output Polish)
Sprint berikutnya: Sprint 4 (Testing & Refinement)
═══════════════════════════════════
BLOKIR: Menunggu keputusan klien tentang format PDF
═══════════════════════════════════
```

---

### 📄 DECISIONS.MD — Log Keputusan

**Fungsi:** Mencatat SETIAP keputusan yang dibuat selama proyek.

```
Format:
[YYYY-MM-DD] Keputusan: Menggunakan ExcelJS untuk parsing Excel
  Alasan: Lebih ringan dari SheetJS, cukup untuk kebutuhan demo
  Dibuat oleh: [nama]
  Disetujui: Ya

[YYYY-MM-DD] Keputusan: Output newsletter dalam format HTML
  Alasan: mudah di-share via email, tidak perlu software khusus
  Dibuat oleh: [nama]
  Disetujui: Ya
```

**Mengapa penting?** Agar tidak perlu "mendebat ulang" keputusan yang sama di sprint yang berbeda.

---

### 📄 DOMAIN.MD — Domain Bisnis

**Fungsi:** Dunia bisnis klien Anda (bukan domain internet).

```
Isi:
- Terminologi bisnis yang digunakan
- Workflow operasional
- Siapa saja pengguna/pemangku kepentingan
- Aturan bisnis yang berlaku
- Realita operasional di lapangan

Contoh:
"Di perusahaan kami, istilah 'invoice' merujuk pada tagihan yang 
 dikirim ke klien. 'Bill' merujuk pada tagihan yang kami terima 
 dari vendor. Jangan pernah menukar istilah ini."
```

---

### 📄 RISKS.MD — Daftar Risiko

**Fungsi:** Menjaga asumsi yang rapuh dan risiko proyek tetap terlihat.

```
Format:
⚠️ RISIKO: API pihak ketiga memiliki rate limit yang ketat
  Kemungkinan: Sedang
  Dampak: Tinggi
  Mitigasi: Implementasi caching dan retry logic
  
⚠️ RISIKO: Data Excel dari klien memiliki format yang tidak konsisten
  Kemungkinan: Tinggi
  Dampak: Sedang
  Mitigasi: Buat parser yang fleksibel dengan validasi input
```

---

### 📄 QUESTIONS.MD — Pertanyaan Terbuka

**Fungsi:** Tempat menyimpan pertanyaan yang membutuhkan jawaban dari klien/stakeholder.

```
Format:
❓ [OPEN] Bagaimana format laporan yang diinginkan CEO?
  Ditanya: 2025-01-15
  Status: Menunggu jawaban
  
✅ [CLOSED] Berapa banyak spreadsheet yang perlu diproses?
  Jawaban: 5 spreadsheet utama + 2 PDF pendukung
  Ditutup: 2025-01-14
```

---

### 📄 FILE-INVENTORY.MD — Inventaris File

**Fungsi:** Melacak semua file sumber seperti PDF, spreadsheet, export, screenshot, catatan, dll.

```
Format:
| File | Tipe | Lokasi | Keterangan |
|------|------|--------|------------|
| laporan-keuangan-2024.xlsx | Excel | /references/ | Laporan keuangan Q4 |
| data-klien.pdf | PDF | /references/ | Export dari CRM |
```

---

## 7. WORKFLOW LENGKAP STEP-BY-STEP

### 🚀 Tahap 1: Persiapan

#### Langkah 1: Buat Folder Proyek
```
1. Buat folder baru di desktop atau lokasi yang diinginkan
2. Namakan dengan nama proyek yang jelas
   Contoh: "dashboard-keuangan-ceo"
3. Buat seluruh struktur folder seperti di Bagian 5
4. Isi setiap file dengan template yang sesuai
```

#### Langkah 2: Siapkan Architect (LLM)
```
1. Buka ChatGPT atau Claude
2. Buat Project baru (bukan sekadar chat baru)
3. Upload file-file referensi ke Sources/Attachments:
   - Filosofi pengembangan
   - Template folder structure
   - Dokumen bisnis yang relevan
4. Set Custom Instructions yang menjelaskan:
   - Anda menggunakan metode Architect-Builder
   - Architect harus membuat rencana sebelum builder coding
   - Setiap sprint harus menghasilkan 4 dokumen
```

#### Langkah 3: Mulai Percakapan dengan Architect
```
Contoh prompt awal:
"Saya ingin membangun [deskripsi aplikasi]. 
 Saya menggunakan metode Architect-Builder.
 Tolong bantu saya brainstorm dan buat rencana awal.
 
 [Deskripsi masalah bisnis yang ingin diselesaikan]
 [Siapa pengguna utama]
 [Apa pain points yang ingin diatasi]"
```

---

### 🔄 Tahap 2: Discovery & Brainstorming

Architect akan mulai bertanya banyak hal:

```
Architect: "Ini ide bagus. Sebelum saya buat rencana, 
            saya perlu memahami beberapa hal:
            
  1. Workflow saat ini seperti apa?
  2. Dimana 3-4 jam waktu terbuang?
  3. Siapa saja pengguna utama?
  4. Apa format output yang diinginkan?
  5. Apa batasan teknis yang ada?"
```

**Tips untuk tahap ini:**
- ✅ Jawab dengan detail, meski masih kasar
- ✅ Gunakan bahasa bisnis Anda sehari-hari
- ✅ Jangan takut salah — architect akan mengklarifikasi
- ❌ Jangan terburu-buru ke coding

---

### 📋 Tahap 3: Membuat Architect Pack

Setelah semua pertanyaan terjawab, minta architect untuk membuat **Architect Pack**:

```
Anda: "Baik, semua pertanyaan sudah terjawab. 
       Sekarang buatkan Architect Pack untuk Sprint 1."
```

Architect Pack terdiri dari **4 dokumen**:

```
┌─────────────────────────────────────────────────────┐
│              ARCHITECT PACK (per sprint)              │
├─────────────────────────────────────────────────────┤
│                                                       │
│  1. 📄 REQUIREMENTS.MD                               │
│     → Apa yang dibangun dan mengapa                   │
│                                                       │
│  2. 📄 BLUEPRINT.MD                                  │
│     → Bagaimana rencana membangunnya                  │
│                                                       │
│  3. 📄 ACCEPTANCE.MD                                 │
│     → Apa artinya "selesai" untuk sprint ini          │
│                                                       │
│  4. 📄 HANDOFF-PROMPT.MD                             │
│     → Prompt untuk diserahkan ke builder              │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

### 🔨 Tahap 4: Handoff ke Builder

#### Langkah 1: Simpan Architect Pack
```
1. Download/copy Architect Pack dari architect
2. Simpan di folder proyek (root level)
   Contoh: /nama-proyek/architect-pack-001.md
```

#### Langkah 2: Buka Builder Tool
```
1. Buka Codex / Claude Code / Cursor
2. Mulai chat baru
3. Arahkan ke folder proyek yang benar
4. Paste prompt dari HANDOFF-PROMPT.MD
```

#### Langkah 3: Builder Melakukan Dry Run
```
Builder akan:
1. Membaca architect pack
2. Melakukan dry run (simulasi tanpa kode)
3. Melaporkan rencana implementasi
4. MENUNGGU persetujuan sebelum menulis kode
```

#### Langkah 4: Review Hasil Builder
```
1. Builder melaporkan hasil
2. Anda review secara kasar
3. Copy hasil builder
4. Kembali ke architect untuk sanity check
```

---

### ✅ Tahap 5: Sanity Check dengan Architect

```
Anda: "Builder baru saja selesai Sprint 1. 
       Ini ringkasan hasilnya:
       [paste ringkasan builder]
       
       Bagaimana menurut Anda? Apakah sesuai rencana?"
```

Architect akan:
- Memvalidasi hasil sesuai rencana
- Mengidentifikasi masalah yang terlewat
- Membuat Architect Pack untuk sprint berikutnya
- Memberikan prompt baru untuk builder

---

### 🔄 Tahap 6: Ulangi untuk Setiap Sprint

```
Sprint 1: Discovery & Architecture Planning
    ↓
Sprint 2: Sample Bundle / Proof of Concept
    ↓
Sprint 3: Executive Output Polish
    ↓
Sprint 4: Testing & Refinement
    ↓
Sprint 5: Final Integration
    ↓
Sprint 6: Deployment & Documentation
```

---

## 8. CONTEXT ENGINEERING: RAHASIA SUKSES

### 🧠 Apa Itu Context Engineering?

**Context Engineering** adalah seni memberikan informasi yang **tepat** pada **waktu yang tepat** kepada AI, bukan sekadar memberikan semua informasi sekaligus.

### ❌ Masalah dengan Context Window

```
Masalah:
- Chat AI memiliki batas konteks (context window)
- Semakin panjang chat, semakin "berisik" konteksnya
- Keputusan dari 3 hari lalu mungkin sudah "terlupakan"
- AI mulai improvisasi saat konteks tidak jelas
```

### ✅ Solusi: Structured Context via Folder

```
Solusi:
- Break konteks menjadi bagian-bagian kecil
- Setiap file hanya berisi satu topik
- Builder membaca file yang relevan saja
- Konteks selalu segar karena diambil dari file, bukan chat
```

### 💡 Perbandingan

```
❌ VIBE CODING (Context Messy):
Chat 1: "Buat app inventaris" → AI menebak
Chat 2: "Tambahkan approval" → AI bingung konteks sebelumnya
Chat 3: "Eh salah, yang tadi" → Chat sudah terlalu panjang
Chat 4: "Dimana keputusan yang tadi?" → Tidak ada yang mencatat

✅ ARCHITECT-BUILDER (Context Clean):
Architect Pack 001: Requirements + Blueprint + Acceptance
Architect Pack 002: Persis setelah Sprint 1 selesai
Architect Pack 003: Persis setelah Sprint 2 selesai
→ Builder selalu punya konteks yang tepat dan terkini
```

### 🎯 Prinsip Context Engineering

| Prinsip | Penjelasan |
|---------|-----------|
| **Minimal Context** | Berikan hanya informasi yang dibutuhkan saat itu |
| **Right Time** | Informasi diberikan saat dibutuhkan, bukan semua di awal |
| **Structured** | Konteks diorganisir dalam folder/file yang jelas |
| **Updated** | Konteks selalu diperbarui setelah setiap sprint |
| **Traceable** | Setiap keputusan bisa ditelusuri asalnya |

---

## 9. SPRINT-BASED DEVELOPMENT

### 🏃 Apa Itu Sprint?

**Sprint** adalah unit pekerjaan terkecil dalam metode ini. Setiap sprint memiliki:
- **Awal yang jelas** — Apa yang akan dikerjakan
- **Akhir yang jelas** — Kapan sprint dianggap selesai
- **Kriteria keberhasilan** — Bagaimana menilai sprint berhasil

### 📊 Struktur Sprint

```
SPRINT N
═══════════════════════════════════
📋 Nama: [Nama Sprint]
🎯 Tujuan: [Apa yang ingin dicapai]
📊 Status: [Belum dimulai / Berjalan / Selesai]
═══════════════════════════════════

1. REQUIREMENTS (Apa & Mengapa)
   ├── Definisi masalah
   ├── Pengguna yang terdampak
   └── Output yang diharapkan

2. BLUEPRINT (Bagaimana)
   ├── Arsitektur teknis
   ├── File yang akan dibuat/diubah
   ├── Dependensi yang diperlukan
   └── Rencana implementasi

3. ACCEPTANCE (Kriteria Selesai)
   ├── Checklist yang harus terpenuhi
   ├── Test cases
   └── Output yang bisa didemonstrasikan

4. HANDOFF PROMPT
   └── Prompt lengkap untuk builder
═══════════════════════════════════
```

### 📝 Contoh Sprint dalam Praktek

```
SPRINT 001: Discovery & Architecture Planning
─────────────────────────────────────────────
Tujuan: Memahami masalah dan membuat rencana awal
Output: Architect Pack pertama, folder structure
Kriteria: Semua pertanyaan terjawab, rencana tersusun

SPRINT 002: Sample Bundle (Proof of Concept)
─────────────────────────────────────────────
Tujuan: Membuat prototype pertama yang bisa dilihat
Output: HTML dashboard + newsletter contoh
Kriteria: Output bisa dibuka di browser, data dummy tampil

SPRINT 003: Executive Output Polish
─────────────────────────────────────────────
Tujuan: Menyempurnakan output agar siap presentasi
Output: Dashboard & newsletter versi final
Kriteria: Format profesional, data akurat

SPRINT 004: Testing & Refinement
─────────────────────────────────────────────
Tujuan: Memastikan semua berfungsi dengan benar
Output: Hasil test, bug fixes
Kriteria: Semua test passing, tidak ada error kritis

SPRINT 005: Final Integration
─────────────────────────────────────────────
Tujuan: Mengintegrasikan semua komponen
Output: Aplikasi yang bisa dijalankan
Kriteria: End-to-end workflow berfungsi

SPRINT 006: Deployment & Documentation
─────────────────────────────────────────────
Tujuan: Menyiapkan untuk produksi
Output: Deployed app + dokumentasi
Kriteria: Bisa diakses oleh pengguna akhir
```

### 🔄 Alur Kerja per Sprint

```
┌─────────────────────────────────────────────────────┐
│                ALUR KERJA PER SPRINT                  │
├─────────────────────────────────────────────────────┤
│                                                       │
│  1. Architect membuat Architect Pack                  │
│     ↓                                                 │
│  2. Save Architect Pack di root folder proyek         │
│     ↓                                                 │
│  3. Buka Builder (Codex/Claude Code)                  │
│     ↓                                                 │
│  4. Mulai chat baru, rename: "Sprint XXX - [Nama]"   │
│     ↓                                                 │
│  5. Paste prompt dari HANDOFF-PROMPT.MD               │
│     ↓                                                 │
│  6. Builder melakukan dry run → Lapor hasil           │
│     ↓                                                 │
│  7. Review hasil (Anda + Architect)                   │
│     ↓                                                 │
│  8. Jika OK → Builder mulai coding                    │
│     ↓                                                 │
│  9. Builder selesai → Lapor hasil                     │
│     ↓                                                 │
│  10. Architect review → Buat Pack berikutnya          │
│     ↓                                                 │
│  11. Ulangi untuk sprint berikutnya                   │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## 10. TIPS PRAKTIS DAN BEST PRACTICES

### ✅ Yang Harus Dilakukan

#### 1. **Buat Project di LLM, Bukan Sekadar Chat**
```
- Di ChatGPT: Buat "Project" baru
- Di Claude: Buat "Project" baru
- Upload semua file referensi
- Set custom instructions
- Alasan: Lebih banyak context memory dan bisa set behavior
```

#### 2. **Rename Setiap Chat di Builder**
```
Contoh naming:
- Sprint 001 - Discovery & Architecture
- Sprint 002 - Sample Bundle
- Sprint 003 - Executive Output Polish
- Sprint 004 - Testing

Alasan: Mudah melacak apa yang dilakukan kapan
```

#### 3. **Selalu Kembali ke Architect untuk Review**
```
Setelah builder selesai → Copy hasilnya → Kembali ke architect
"Builder baru selesai Sprint X. Ini hasilnya. Bagaimana menurut Anda?"

Alasan: Architect melihat big picture dan bisa catch masalah
```

#### 4. **Update STATE.MD Secara Berkal**
```
Setelah setiap sprint selesai:
- Update status sprint
- Update apa yang baru saja terjadi
- Update langkah selanjutnya
- Update jika ada blokir
```

#### 5. **Dokumentasikan Setiap Keputusan**
```
Setiap kali ada keputusan → Tulis di DECISIONS.MD
Jangan biarkan keputusan "terkubur" di chat history
```

#### 6. **Gunakan Bahasa Bisnis, Bukan Teknis**
```
Anda tidak perlu jadi programmer untuk jadi architect.
Gunakan bahasa bisnis Anda sehari-hari.
AI akan mengerti dan menerjemahkan ke bahasa teknis.
```

### ❌ Yang TIDAK Boleh Dilakukan

#### 1. **Jangan Langsung ke Coding**
```
❌ "Buatkan saya aplikasi manajemen inventaris"
✅ "Saya ingin membangun aplikasi manajemen inventaris. 
    Mari kita mulai dengan brainstorming requirements-nya."
```

#### 2. **Jangan Simpan Semua di Satu Chat Panjang**
```
❌ Chat dengan 50+ message yang berisi semua keputusan
✅ Chat per sprint, dengan konteks yang segar
```

#### 3. **Jangan Biarkan AI Menebak Aturan Bisnis**
```
❌ Biarkan AI menentukan siapa yang boleh akses apa
✅ Definisikan aturan akses di PERMISSIONS.MD
```

#### 4. **Jangan Skip Documentation**
```
❌ "Nanti aja dokumentasinya"
✅ Update folder system SETELAH setiap sprint selesai
```

#### 5. **Jangan Trust Builder Tanpa Review**
```
❌ Builder selesai → langsung push ke production
✅ Builder selesai → review → architect sanity check → baru lanjut
```

### 💡 Tips untuk Non-Programmer

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

## 11. KESIMPULAN

### 🎯 Pesan Utama

> **Jangan minta AI builder membangun dari ide yang samar. Gunakan architect dulu!**

### 📌 Ringkasan Metode Architect-Builder

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│   1. ANDA punya ide dan pengetahuan bisnis            │
│           ↓                                           │
│   2. ARCHITECT (ChatGPT/Claude) membantu Anda:       │
│      • Brainstorm & clarify ide                       │
│      • Buat requirements                              │
│      • Rancang blueprint                              │
│      • Definisikan acceptance criteria                │
│      • Siapkan handoff untuk builder                  │
│           ↓                                           │
│   3. FOLDER SYSTEM menjadi source of truth            │
│      • Semua rencana tersimpan rapi                   │
│      • Konteks bersih dan terstruktur                 │
│      • Bisa diakses kapan saja                        │
│           ↓                                           │
│   4. BUILDER (Codex/Claude Code) membangun:          │
│      • Baca architect pack                            │
│      • Dry run dulu                                   │
│      • Implementasi kode                              │
│      • Lapor hasil                                    │
│           ↓                                           │
│   5. ARCHITECT review hasil builder                   │
│      • Validasi sesuai rencana?                       │
│      • Ada masalah?                                   │
│      • Buat pack berikutnya                           │
│           ↓                                           │
│   6. ULANGI untuk setiap sprint sampai selesai        │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### 🏆 Mengapa Metode Ini Berhasil?

| Aspek | Vibe Coding | Architect-Builder |
|-------|-------------|-------------------|
| Perencanaan | Tidak ada | Sangat detail |
| Konteks | Berantakan | Terstruktur |
| Aturan Bisnis | AI mendeak | Dokumentasi jelas |
| Risiko | Tinggi (banyak error) | Rendah (terkontrol) |
| Review | Tidak systematic | Setiap sprint di-review |
| Dokumentasi | Tidak ada | Selalu diperbarui |
| Skalabilitas | Sulit untuk proyek besar | Sangat scalable |
| Hasil | MVP yang messy | Perangkat lunak yang solid |

### 🎯 Siapa yang Bisa Menggunakan Metode Ini?

```
✅ Pemilik bisnis (CEO, Founder)
✅ Eksekutif (CFO, COO, CTO)
✅ Konsultan
✅ Manajer operasional
✅ Siapa saja yang memahami workflow bisnis
✅ Developer yang ingin lebih produktif

Yang TERPENTING:
Bukan seberapa banyak Anda tahu tentang coding,
tapi seberapa baik Anda bisa:
→ Memahami masalah bisnis
→ Mendefinisikan workflow
→ Mengorganisir informasi
→ Mengevaluasi hasil
```

---

## 📚 GLOSARIUM

| Istilah | Penjelasan |
|---------|-----------|
| **Vibe Coding** | Pendekatan coding tanpa perencanaan, hanya "ikut feeling" |
| **Architect** | LLM (ChatGPT/Claude) yang bertindak sebagai perencana |
| **Builder** | Tool coding (Codex/Claude Code/Cursor) yang menulis kode |
| **Architect Pack** | Paket 4 dokumen (Requirements, Blueprint, Acceptance, Handoff) per sprint |
| **Context Engineering** | Seni memberikan konteks yang tepat pada waktu yang tepat |
| **Sprint** | Unit pekerjaan terkecil dengan awal dan akhir yang jelas |
| **Dry Run** | Simulasi tanpa kode untuk memvalidasi rencana |
| **Source of Truth** | Sumber kebenaran utama (folder system, bukan chat history) |
| **Context Window** | Batas memori/konteks yang bisa diakses AI dalam satu percakapan |
| **Handoff** | Proses penyerahan pekerjaan dari architect ke builder |
| **MVP** | Minimum Viable Product — produk minimum yang bisa berfungsi |
| **LLM** | Large Language Model — model AI berbasis bahasa besar |

---

## 📖 REFERENSI TAMBAHAN

### Konsep yang Dijelaskan dalam Materi Ini

1. **Software Architecture Patterns** — Pola arsitektur perangkat lunak yang umum digunakan
2. **Agile/Sprint Methodology** — Metodologi pengembangan iteratif
3. **Context Window Management** — Cara mengelola batas konteks AI
4. **Prompt Engineering** — Seni membuat prompt yang efektif untuk AI
5. **Documentation-Driven Development** — Pendekatan di mana dokumentasi mendahului kode

### Tools yang Disebut dalam Materi

| Tool | Kategori | Kegunaan |
|------|----------|----------|
| **ChatGPT** | LLM (Architect) | Brainstorming, perencanaan, review |
| **Claude** | LLM (Architect) | Brainstorming, perencanaan, review |
| **OpenAI Codex** | Coding Tool (Builder) | Menulis kode berdasarkan rencana |
| **Claude Code** | Coding Tool (Builder) | Menulis kode berdasarkan rencana |
| **Cursor** | Coding Tool (Builder) | Menulis kode berdasarkan rencana |
| **Obsidian** | Markdown Viewer | Membaca file markdown dengan mudah |
| **GitHub** | Version Control | Menyimpan dan mengelola kode |

---

## 12. ARSITEKTUR PRODUCTION-READY: DARI VIBE KE STANDAR ENGINEERING

### 12.1 Apa yang Membedakan Proyek "Ready Production" dari Sekadar Demo?

> **💡 Kutipan dari Anthropic (Building Effective Agents):**
> *"When building applications with LLMs, we recommend finding the simplest solution possible, and only increasing complexity when needed."*

Banyak vibe coder bisa membuat demo yang terlihat keren dalam hitungan menit. Tapi **demo ≠ production**. Berikut perbedaan mendasarnya:

```
╔══════════════════════════════╦══════════════════════╦══════════════════════╗
║         Aspek                ║      DEMO            ║  PRODUCTION-READY    ║
╠══════════════════════════════╬══════════════════════╬══════════════════════╣
║ Error Handling               ║ Tidak ada            ║ Comprehensive        ║
║ Testing                      ║ Tidak ada            ║ Unit + Integration   ║
║ Security                     ║ Diabaikan            ║ Defense in depth     ║
║ Performance                  ║ Tidak dioptimasi     ║ Di-benchmark         ║
║ Documentation                ║ Tidak ada            ║ Lengkap              ║
║ Scalability                  ║ Tidak dipikirkan     ║ Di-architect         ║
║ Monitoring                   ║ Tidak ada            ║ Logging + Alerting   ║
║ Backup & Recovery            ║ Tidak ada            ║ Terencana            ║
║ CI/CD                        ║ Manual               ║ Automated            ║
║ Code Quality                 ║ Asal jalan           ║ Linted + Typed       ║
║ Dependency Management        ║ Apa saja             ║ Pinned + Audited     ║
║ Access Control               ║ Tidak ada            ║ Role-based           ║
║ Data Validation              ║ Minimal              ║ Comprehensive        ║
║ Graceful Degradation         ║ Crash                ║ Fallback OK          ║
╚══════════════════════════════╩══════════════════════╩══════════════════════╝
```

### 12.2 Prinsip Arsitektur Production-Ready

Berikut prinsip-prinsip yang harus diterapkan agar aplikasi siap production:

#### Prinsip #1: Defensive Programming

> **💡 Kutipan dari Anthropic:**
> *"Give Claude a check it can run: tests, a build, a screenshot to compare. It's the difference between a session you watch and one you walk away from."*

```
DEFENSIVE PROGRAMMING:
═══════════════════════════════════════════════════

❌ CODING STYLE VIBE CODER:
function parseExcel(filePath) {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}
// Masalah: Tidak handle error, file tidak ada, format salah

✅ CODING STYLE PRODUCTION-READY:
async function parseExcel(filePath) {
  // 1. Validasi input
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('filePath harus berupa string non-kosong');
  }
  
  // 2. Cek file ada
  if (!fs.existsSync(filePath)) {
    throw new Error(`File tidak ditemukan: ${filePath}`);
  }
  
  // 3. Cek extension
  if (!filePath.match(/\.xlsx?$/i)) {
    throw new Error('Format file harus .xls atau .xlsx');
  }
  
  try {
    // 4. Baca dengan timeout
    const data = await fs.promises.readFile(filePath, {
      timeout: 10000 // 10 detik timeout
    });
    
    // 5. Parse dengan validasi
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(data);
    
    // 6. Validasi isi
    if (workbook.worksheets.length === 0) {
      throw new Error('File Excel tidak memiliki worksheet');
    }
    
    return workbook;
  } catch (error) {
    if (error.code === 'EACCES') {
      throw new Error(`Tidak ada akses ke file: ${filePath}`);
    }
    throw error;
  }
}
═══════════════════════════════════════════════════
```

#### Prinsip #2: Structured Error Handling

```
ERROR HANDLING HIERARCHY:
═══════════════════════════════════════════════════

Level 1: User Input Validation
  └── Validasi semua input SEBELUM diproses

Level 2: Business Logic Validation
  └── Validasi aturan bisnis SEBELUM simpan

Level 3: External Service Error Handling
  └── Handle error dari API/database/dll

Level 4: Graceful Degradation
  └── Jika komponen gagal, sistem tetap jalan

Level 5: Crash Recovery
  └── Jika crash, bisa recover tanpa kehilangan data

Level 6: Logging & Alerting
  └── Catat semua error, alert jika critical
═══════════════════════════════════════════════════
```

#### Prinsip #3: Data Integrity

```
DATA INTEGRITY CHECKLIST:
═══════════════════════════════════════════════════

✅ Input Validation
   ├── Sanitize semua input dari user
   ├── Validate tipe data
   ├── Validate range/bounds
   └── Escape untuk prevent injection

✅ Output Validation
   ├── Pastikan output sesuai format yang diharapkan
   ├── Validasi sebelum kirim ke user
   └── Log semua output untuk audit

✅ Data Consistency
   ├── Gunakan transaction untuk operasi multi-step
   ├── Implement idempotency untuk retry
   ├── Validasi referential integrity
   └── Backup sebelum perubahan besar

✅ Audit Trail
   ├── Catat siapa, kapan, apa yang diubah
   ├── Simpan log perubahan
   └── Implement soft delete (jangan hard delete)
═══════════════════════════════════════════════════
```

### 12.3 Checklist Production Readiness

Sebelum deploy ke production, pastikan semua ini terpenuhi:

```
PRODUCTION READINESS CHECKLIST:
═══════════════════════════════════════════════════

🔧 KODE
├── [ ] Semua test passing
├── [ ] Code review selesai
├── [ ] Linting tanpa error
├── [ ] Type checking tanpa error
├── [ ] Tidak ada console.log di production
├── [ ] Error handling comprehensive
├── [ ] Input validation di semua entry point
└── [ ] Logging yang memadai

🔒 KEAMANAN
├── [ ] Authentication implemented
├── [ ] Authorization implemented (RBAC)
├── [ ] Input sanitization
├── [ ] SQL injection prevention
├── [ ] XSS prevention
├── [ ] CSRF protection
├── [ ] Secrets tidak di-hardcode
├── [ ] Dependencies audited
└── [ ] HTTPS enforced

⚡ PERFORMA
├── [ ] Response time < 200ms (target)
├── [ ] Database queries optimized
├── [ ] Caching implemented
├── [ ] N+1 query problems solved
├── [ ] Memory leaks checked
└── [ ] Load testing done

📊 MONITORING
├── [ ] Error tracking (Sentry/Datadog)
├── [ ] Performance monitoring
├── [ ] Uptime monitoring
├── [ ] Alert configured
└── [ ] Log aggregation

🚀 DEPLOYMENT
├── [ ] CI/CD pipeline working
├── [ ] Environment variables configured
├── [ ] Database migrations tested
├── [ ] Rollback plan documented
├── [ ] Backup strategy confirmed
└── [ ] SSL/TLS configured

📝 DOKUMENTASI
├── [ ] API documentation
├── [ ] Setup/installation guide
├── [ ] Environment variables documented
├── [ ] Architecture diagram
├── [ ] Runbook for ops
└── [ ] Changelog maintained
═══════════════════════════════════════════════════
```

---

## 13. POLA AGENT UNTUK VIBE CODER (Dari Anthropic)

### 13.1 Workflows vs Agents: Memahami Perbedaannya

> **💡 Kutipan dari Anthropic (Building Effective Agents):**
> *"Workflows are systems where LLMs and tools are orchestrated through predefined code paths. Agents, on the other hand, are systems where LLMs dynamically direct their own processes and tool usage."*

Untuk vibe coder, penting memahami kapan harus menggunakan pendekatan yang mana:

```
PERBEDAAN WORKFLOWS vs AGENTS:
═══════════════════════════════════════════════════

WORKFLOWS (Arus Kerja Terstruktur):
├── Langkah-langkah sudah didefinisikan sebelumnya
├── Predictable dan konsisten
├── Cocok untuk tugas yang sudah jelas
├── Lebih mudah di-debug
└── Contoh: Pipeline deploy, data processing

AGENTS (Agen Otonom):
├── Langkah ditentukan secara dinamis oleh AI
├── Fleksibel dan adaptif
├── Cocok untuk tugas yang kompleks/tak terduga
├── Lebih sulit di-debug
└── Contoh: Code review, debugging kompleks

UNTUK VIBE CODER:
→ Mulai dengan WORKFLOWS dulu
→ Gunakan AGENTS hanya untuk tugas yang memang butuh fleksibilitas
═══════════════════════════════════════════════════
```

### 13.2 5 Pola Workflow untuk Vibe Coder

Berikut 5 pola workflow yang bisa langsung Anda gunakan:

#### Pola #1: Prompt Chaining (Rantai Prompt)

```
PROMPT CHAINING:
═══════════════════════════════════════════════════

Input → [Prompt 1] → Output 1 → [Gate] → [Prompt 2] → Output 2 → ... → Hasil

Contoh Praktis:
1. Prompt 1: "Buat outline untuk fitur X"
2. Gate: Validasi outline lengkap
3. Prompt 2: "Buat kode berdasarkan outline ini"
4. Gate: Validasi kode compiled
5. Prompt 3: "Tulis test untuk kode ini"
6. Gate: Validasi test passing

Kapan menggunakan:
✅ Tugas bisa dipecah menjadi langkah berurutan
✅ Setiap langkah menghasilkan output yang jelas
✅ Butuh validasi di antara langkah

❌ Jangan gunakan untuk:
- Tugas yang tidak bisa dipecah
- Butuh iterasi bolak-balik
═══════════════════════════════════════════════════
```

#### Pola #2: Routing (Pengalihan Tugas)

```
ROUTING:
═══════════════════════════════════════════════════

Input → [Classifier] → Route A → [Handler A] → Output A
                     → Route B → [Handler B] → Output B
                     → Route C → [Handler C] → Output C

Contoh Praktis:
Input user → Klasifikasi:
  ├── Pertanyaan teknis → Developer docs handler
  ├── Bug report → Issue creation handler
  ├── Feature request → Spec writing handler
  └── General question → FAQ handler

Kapan menggunakan:
✅ Ada beberapa jenis input yang berbeda
✅ Setiap jenis butuh penanganan berbeda
✅ Bisa diklasifikasi dengan akurat

❌ Jangan gunakan untuk:
- Hanya ada 1 jenis input
- Klasifikasi tidak akurat
═══════════════════════════════════════════════════
```

#### Pola #3: Parallelization (Paralelisasi)

```
PARALLELIZATION:
═══════════════════════════════════════════════════

                    ┌── [Worker A] ──┐
Input → [Splitter] ├── [Worker B] ──┼── [Merger] → Output
                    └── [Worker C] ──┘

Contoh Praktis:
- Review kode oleh 3 reviewer berbeda secara bersamaan
- Testing di 3 environment berbeda (Windows, Mac, Linux)
- Generate dokumentasi dalam 3 bahasa sekaligus

Kapan menggunakan:
✅ Tugas bisa dipecah menjadi sub-task independen
✅ Butuh kecepatan (paralel lebih cepat)
✅ Butuh multiple perspectives

❌ Jangan gunakan untuk:
- Sub-task saling bergantung
- Butuh koordinasi ketat
═══════════════════════════════════════════════════
```

#### Pola #4: Orchestrator-Workers (Orkestrator-Pekerja)

```
ORCHESTRATOR-WORKERS:
═══════════════════════════════════════════════════

                    ┌── [Worker 1] ──┐
Input → [Orchestrator]├── [Worker 2] ──┼── [Synthesizer] → Output
                    └── [Worker N] ──┘

Contoh Praktis:
- Builder yang memecah tugas coding menjadi beberapa file
- Proses yang mengumpulkan data dari multiple API
- Sistem yang menganalisis codebase untuk refactoring

Kapan menggunakan:
✅ Tugas kompleks dengan banyak sub-task
✅ Tidak bisa prediksi sub-task apa saja yang diperlukan
✅ Butuh koordinasi dinamis

❌ Jangan gunakan untuk:
- Tugas sederhana (over-engineering)
- Butuh determinisme tinggi
═══════════════════════════════════════════════════
```

#### Pola #5: Evaluator-Optimizer (Evaluator-Pengoptimal)

```
EVALUATOR-OPTIMIZER:
═══════════════════════════════════════════════════

Input → [Generator] → Output → [Evaluator] → Feedback
              ↑                              │
              └──────────────────────────────┘
              (loop sampai kriteria terpenuhi)

Contoh Praktis:
- AI menulis kode → AI lain review → Perbaiki → Review lagi
- AI menulis test → AI lain cek coverage → Tambah test
- AI buat draft → AI lain cek kualitas → Improve

Kapan menggunakan:
✅ Ada kriteria evaluasi yang jelas
✅ Iterasi bisa improve kualitas
✅ Bisa diukur perbaikannya

❌ Jangan gunakan untuk:
- Tidak ada kriteria yang jelas
- Iterasi tidak menghasilkan perbaikan
═══════════════════════════════════════════════════
```

### 13.3 Kapan Harus Gunakan Agents (Bukan Workflows)?

> **💡 Kutipan dari Anthropic:**
> *"Agents can be used for open-ended problems where it's difficult or impossible to predict the required number of steps, and where you can't hardcode a fixed path."*

```
GUNAKAN AGENTS KETIKA:
═══════════════════════════════════════════════════

✅ Tugas open-ended (tidak bisa prediksi langkah)
✅ Butuh keputusan dinamis di setiap langkah
✅ Lingkungan trusted (bukan production langsung)
✅ Ada stopping conditions yang jelas
✅ Bisa di-test di sandbox dulu

Contoh:
- Debugging masalah kompleks yang tidak diketahui penyebabnya
- Refactoring codebase besar
- Security audit otomatis
- Code review dengan adversarial approach

❌ JANGAN GUNAKAN AGENTS UNTUK:
- Tugas yang sudah jelas langkahnya (pakai workflow)
- Production environment langsung
- Tugas yang butuh determinisme tinggi
- Budget terbatas (agents = lebih banyak tokens)
═══════════════════════════════════════════════════
```

---

## 14. TOOL ENGINEERING: SENI MEMBUAT TOOLS YANG BAIK UNTUK AI

### 14.1 Mengapa Tool Engineering Itu Penting?

> **💡 Kutipan dari Anthropic (Building Effective Agents):**
> *"While building our agent for SWE-bench, we actually spent more time optimizing our tools than the overall prompt."*

Tool engineering adalah seni mendesain tools yang bisa digunakan AI dengan efektif. Ini sering diabaikan tapi **sangat krusial** untuk production.

### 14.2 Prinsip Tool Engineering

```
PRINSIP TOOL ENGINEERING:
═══════════════════════════════════════════════════

1. 🎯 JELAS DAN SPESIFIK
   ├── Nama tool harus deskriptif
   ├── Deskripsi harus lengkap
   ├── Parameter harus terdefinisi jelas
   └── Contoh penggunaan harus tersedia

2. 🛡️ POKA-YOKE (ERROR-PROOF)
   ├── Buat error sesulit mungkin
   ├── Validasi input sebelum diproses
   ├── Gunakan absolute paths (bukan relative)
   └── Return error messages yang helpful

3. 📝 DOKUMENTASI LENGKAP
   ├── Include edge cases
   ├── Include batasan
   ├── Include contoh input/output
   └── Include error codes

4. 🔄 IDEMPOTENT
   ├── Bisa dijalankan berulang tanpa side effect
   ├── Safe untuk retry
   └── Tidak duplicate data

5. 🧪 TESTABLE
   ├── Bisa di-test secara independent
   ├── Mock external dependencies
   └── Assert expected behavior
═══════════════════════════════════════════════════
```

### 14.3 Contoh Tool yang Baik vs Buruk

```
❌ TOOL YANG BURUK:
─────────────────
Name: "process"
Description: "Processes data"
Parameters: { data: any, options: any }

Masalah:
- Tidak jelas "process" artinya apa
- Parameter "any" tidak membantu
- Tidak ada contoh
- Tidak ada edge cases

✅ TOOL YANG BAIK:
─────────────────
Name: "parse-excel-workbook"
Description: "Parse an Excel file and return structured data. " +
             "Supports .xls and .xlsx formats. " +
             "Returns object with sheets array, each containing " +
             "rows and columns. Throws on invalid format or " +
             "missing file. Max file size: 50MB."
Parameters: {
  filePath: {
    type: "string",
    description: "Absolute path to the Excel file",
    required: true,
    example: "/Users/data/report.xlsx"
  },
  sheetIndex: {
    type: "number",
    description: "Index of sheet to parse (0-based). Default: 0 (first sheet)",
    required: false,
    default: 0
  },
  maxRows: {
    type: "number",
    description: "Maximum rows to read. Default: 10000",
    required: false,
    default: 10000
  }
}
Returns: {
  sheets: [{ name: string, rows: any[][], rowCount: number }]
}
Errors: {
  FILE_NOT_FOUND: "File does not exist at the specified path",
  INVALID_FORMAT: "File is not a valid Excel file",
  FILE_TOO_LARGE: "File exceeds 50MB limit",
  SHEET_NOT_FOUND: "Sheet at specified index does not exist"
}

Kelebihan:
- Nama spesifik dan deskriptif
- Deskripsi lengkap dengan batasan
- Parameter terdefinisi dengan tipe dan contoh
- Error codes yang jelas
═══════════════════════════════════════════════════
```

### 14.4 Agent-Computer Interface (ACI)

> **💡 Kutipan dari Anthropic:**
> *"One rule of thumb is to think about how much effort goes into human-computer interfaces (HCI), and plan to invest just as much effort in creating good agent-computer interfaces (ACI)."*

ACI (Agent-Computer Interface) adalah cara AI berinteraksi dengan tools. Ini penting karena:

```
ACI UNTUK VIBE CODER:
═══════════════════════════════════════════════════

1. 📖 BUAT AI "MENGERTI" TOOL ANDA
   ├── Gunakan nama yang intuitif
   ├── Deskripsi yang jelas
   ├── Contoh penggunaan
   └── Batasan yang didefinisikan

2. 🛡️ BUAT ERROR SESULIT MUNGKIN
   ├── Validasi input di awal
   ├── Gunakan absolute paths
   ├── Return error messages yang helpful
   └── Jangan biarkan AI menebak

3. 🧪 TEST PENGGUNAAN AI
   ├── Run banyak contoh input
   ├── Lihat kesalahan yang dibuat AI
   ├── Iterate berdasarkan temuan
   └── Poka-yoke tools Anda

4. 📝 DOKUMENTASI YANG BAIK
   ├── Seperti menulis docstring untuk junior developer
   ├── Include edge cases
   ├── Include boundary conditions
   └── Include comparison dengan tools lain
═══════════════════════════════════════════════════
```

---

## 15. WORKFLOW PRODUCTION UNTUK VIBE CODER

### 15.1 Workflow Lengkap dari Chris Titus Tech

> **💡 Kutipan dari Chris Titus Tech:**
> *"My AI development workflow is not perfect, and it will keep changing. What matters is the structure: define the project, build the guardrails, work in small phases, and stop at manual gates."*

```
WORKFLOW PRODUCTION CHRIS TITUS TECH:
═══════════════════════════════════════════════════

1. 📋 DEFINE THE PROJECT
   ├── Buat SPECIFICATION (SPEC.md)
   ├── Definisikan problem dan users
   ├── Definisikan acceptance criteria
   ├── Definisikan non-goals
   └── Pin dependency versions

2. 🛡️ BUILD THE GUARDRAILS
   ├── Tulis AGENTS.md (aturan untuk AI)
   ├── Setup testing framework
   ├── Setup linting & type checking
   ├── Setup CI/CD pipeline
   └── Configure permissions & sandbox

3. 🔨 WORK IN SMALL PHASES
   ├── Break menjadi phase-phase kecil
   ├── Setiap phase punya exit criteria
   ├── 1 phase = 1 PR (idealnya)
   └── PR harus kecil (< 200 baris)

4. 🚧 STOP AT MANUAL GATES
   ├── Local validation (tests, lint, build)
   ├── Pull request review
   ├── Independent AI review
   ├── Manual verification
   └── Human merge approval

5. 🔄 ITERATE
   ├── Fix feedback
   ├── Retest
   ├── Resolve threads
   └── Merge when all gates passed
═══════════════════════════════════════════════════
```

### 15.2 Specification-Driven Development

> **💡 Kutipan dari Chris Titus Tech:**
> *"The specification is repository-specific. Before implementation, I write down: the problem and intended users, required behavior and user experience, architecture and major components, security and privacy requirements, supported tool and dependency versions, non-goals, acceptance criteria."*

```
SPECIFICATION-DRIVEN DEVELOPMENT:
═══════════════════════════════════════════════════

SEBELUM IMPLEMENTASI, TULIS:

1. PROBLEM & USERS
   ├── Apa masalah yang diselesaikan?
   ├── Siapa pengguna akhir?
   └── Apa use case utama?

2. REQUIRED BEHAVIOR
   ├── Fitur apa saja yang harus ada?
   ├── Bagaimana user experience-nya?
   └── Apa batasan fungsional?

3. ARCHITECTURE
   ├── Komponen apa saja yang terlibat?
   ├── Bagaimana komponen terhubung?
   └── Teknologi apa yang digunakan?

4. SECURITY & PRIVACY
   ├── Data apa yang di-handle?
   ├── Siapa yang boleh akses?
   └── Compliance apa yang harus dipenuhi?

5. DEPENDENCY VERSIONS
   ├── Pin semua versi dependensi
   ├── Jangan gunakan "latest"
   └── Verifikasi versi current

6. NON-GOALS
   ├── Apa yang TIDAK akan dibangun?
   ├── Batasi scope dengan jelas
   └── Cegah scope creep

7. ACCEPTANCE CRITERIA
   ├── Kondisi observabel untuk "selesai"
   ├── Test cases yang harus pass
   └── Manual checks yang harus dilakukan
═══════════════════════════════════════════════════
```

### 15.3 Test Harness: Bangun Test DULU Baru Fitur

> **💡 Kutipan dari Chris Titus Tech:**
> *"Before serious implementation, I establish how the project will be tested. If the agent cannot tell whether a change worked, asking it to write more code only creates more uncertainty."*

```
TEST HARNESS WORKFLOW:
═══════════════════════════════════════════════════

SEBELUM CODING:
1. Setup test framework (Jest/Vitest/Pytest)
2. Tulis test cases dari acceptance criteria
3. Jalankan test → pastikan SEMUA GAGAL (belum ada kode)
4. Commit test files

SAAT CODING:
1. Tulis kode untuk pass test
2. Jalankan test
3. Jika semua pass → commit
4. Jika ada yang gagal → fix, repeat

SETELAH CODING:
1. Jalankan full test suite
2. Pastikan semua pass
3. Cek coverage (target: > 80%)
4. Commit hasil

INI ADALAH PENDAPATAN "TEST-DRIVEN DEVELOPMENT"
untuk vibe coder!
═══════════════════════════════════════════════════
```

### 15.4 Review Workflow: Review > Generation

> **💡 Kutipan dari Chris Titus Tech:**
> *"Spend More Effort on Review Than Generation. This is where most of my AI usage goes."*

```
REVIEW WORKFLOW:
═══════════════════════════════════════════════════

SEBELUM REVIEW:
1. Pastikan test passing
2. Pastikan linting clean
3. Pastikan build successful

REVIEW LAYERS:
Layer 1: Local Review
├── Review diff sendiri
├── Cek apakah sesuai spec
└── Cek edge cases

Layer 2: AI Review (Independent)
├── Gunakan AI LAIN (bukan yang nulis kode)
├── Fresh context = review lebih objektif
├── Cek: correctness, edge cases, consistency
└── JANGAN check style preferences

Layer 3: Human Review (jika ada tim)
├── Senior developer review
├── Architecture review
└── Security review

SETIAP LAYER:
├── Fix root cause (bukan symptom)
├── Update test jika perlu
├── Push perbaikan
├── Tunggu CI passing
└── Resolve thread

LOOP sampai tidak ada critical findings
═══════════════════════════════════════════════════
```

### 15.5 Human Merge Gate: Jangan Pernah Skip Ini!

> **💡 Kutipan dari Chris Titus Tech:**
> *"That pause is the difference between using AI as an assistant and letting it run the project."*

```
HUMAN MERGE GATE CHECKLIST:
═══════════════════════════════════════════════════

SEBELUM MERGE, VERIFIKASI:

1. ✅ DIFF HANYA BERISI PERUBAHAN YANG DIMAKSUD
   └── Tidak ada perubahan "bonus" yang tidak diminta

2. ✅ TESTS & BUILDS PASSING DI COMMIT TERAKHIR
   └── Bukan di commit lama!

3. ✅ INDEPENDENT REVIEW SELESAI
   └── Bukan review dari AI yang sama

4. ✅ ACTIONABLE REVIEW THREADS RESOLVED
   └── Tidak ada komentar yang belum dijawab

5. ✅ DOCUMENTATION MATCHES BEHAVIOR
   └── Docs di-update jika ada perubahan API

6. ✅ FEATURE WORKS DI REAL TARGET ENVIRONMENT
   └── Bukan hanya di development

7. ✅ VISIBLE CHANGES CHECKED ON SCREEN
   └── Screenshot/visual verification

JIKA SALAH SATU TIDAK TERPENUHI:
→ JANGAN MERGE! Fix dulu!
═══════════════════════════════════════════════════
```

---

## 16. MANAJEMEN KONTEKS LANJUTAN

### 16.1 Context Window: Sumber Daya Paling Berharga

> **💡 Kutipan dari Anthropic:**
> *"Most best practices are based on one constraint: Claude's context window fills up fast, and performance degrades as it fills."*

```
CONTEXT WINDOW MANAGEMENT:
═══════════════════════════════════════════════════

MENGAPA PENTING:
- Setiap message, file, command output mengisi context
- Semakin penuh → AI semakin sering "lupa" dan salah
- Context window = sumber daya paling berharga

STRATEGI:

1. 🧹 GUNAKAN /CLEAR FREQUENTLY
   ├── Antar task yang tidak berhubungan
   ├── Setelah debugging session
   └── Sebelum mulai topik baru

2. 📁 FILE-BASED CONTEXT
   ├── Baca dari file, bukan dari chat history
   ├── STATE.MD → status terkini
   ├── DECISIONS.MD → keputusan yang sudah dibuat
   └── DOMAIN.MD → konteks bisnis

3. 🎯 PRIORITAS INFORMASI
   ├── WAJIB BACA: AGENTS.MD, STATE.MD, Sprint aktif
   ├── BACA JIKA PERLU: DECISIONS.MD, DOMAIN.MD, RISKS.MD
   └── BISA NANTI: docs/*, QUESTIONS.MD, FILE-INVENTORY.MD

4. 🤖 GUNAKAN SUBAGENTS
   ├── Untuk riset → subagent terpisah
   ├── Untuk verifikasi → fresh context
   └── Main conversation tetap bersih

5. 📦 COMPACTION
   ├── /compact <instructions> untuk rangkum
   ├── Pertahankan yang penting
   └── Buang yang tidak perlu

6. 🔄 REWIND & CHECKPOINT
   ├── Simpan checkpoint sebelum risky change
   ├── Bisa rollback jika gagal
   └── Resume session lain waktu
═══════════════════════════════════════════════════
```

### 16.2 Subagents: Pekerja Paralel untuk AI

> **💡 Kutipan dari Anthropic:**
> *"Use subagents to investigate X. They explore in a separate context, keeping your main conversation clean for implementation."*

```
PENGGUNAAN SUBAGENTS:
═══════════════════════════════════════════════════

KAPAN GUNAKAN SUBAGENTS:
✅ Riset codebase besar
✅ Security review
✅ Performance analysis
✅ Code review independen
✅ Testing di multiple environment

CONTOH PENGGUNAAN:

"Use a subagent to review this code for security issues."
→ Subagent menjalankan security audit di context terpisah
→ Hasil dikembalikan ke main session
→ Main session tidak terkontaminasi

"Use a subagent to investigate how our auth system works."
→ Subagent membaca banyak file
→ Ringkasan dikembalikan
→ Main session tetap bersih

KEUNTUNGAN:
- Context main session tetap bersih
- Bisa paralel banyak subagent
- Fresh perspective (tidak bias)
- Isolasi error
═══════════════════════════════════════════════════
```

---

## 17. KEAMANAN PRODUCTION

### 17.1 Security Checklist untuk Vibe Coder

> **💡 Kutipan dari Anthropic:**
> *"The autonomous nature of agents means higher costs, and the potential for compounding errors. We recommend extensive testing in sandboxed environments, along with the appropriate guardrails."*

```
SECURITY CHECKLIST:
═══════════════════════════════════════════════════

🔐 AUTHENTICATION & AUTHORIZATION
├── [ ] Implement proper authentication
├── [ ] Role-based access control (RBAC)
├── [ ] Session management yang aman
├── [ ] Token expiration
└── [ ] Password hashing (bcrypt/argon2)

🛡️ INPUT VALIDATION
├── [ ] Sanitize semua user input
├── [ ] Parameterized queries (anti SQL injection)
├── [ ] Content Security Policy (anti XSS)
├── [ ] CSRF tokens
└── [ ] File upload validation

🔒 DATA PROTECTION
├── [ ] Encrypt data at rest
├── [ ] Encrypt data in transit (HTTPS)
├── [ ] No secrets in code (use env vars)
├── [ ] No sensitive data in logs
└── [ ] PII handling compliance

📦 DEPENDENCY SECURITY
├── [ ] Run npm audit / pip audit
├── [ ] Pin dependency versions
├── [ ] Enable Dependabot
├── [ ] Review dependency changes
└── [ ] Remove unused dependencies

🏗️ INFRASTRUCTURE
├── [ ] Environment variables configured
├── [ ] No debug mode in production
├── [ ] Rate limiting implemented
├── [ ] CORS configured properly
└── [ ] Security headers set
═══════════════════════════════════════════════════
```

### 17.2 CI/CD Pipeline untuk Production

> **💡 Kutipan dari Chris Titus Tech:**
> *"CI must run on every pull request update. A green check from an older commit does not prove that the latest review fix is safe."*

```
CI/CD PIPELINE:
═══════════════════════════════════════════════════

SETIAP PULL REQUEST:
│
├── 🧪 Unit Tests
│   └── Semua test harus pass
│
├── 🔍 Linting & Type Check
│   └── Tidak ada error
│
├── 🏗️ Production Build
│   └── Build berhasil tanpa warning
│
├── 🔒 Security Scan
│   ├── CodeQL analysis
│   ├── Dependency vulnerability scan
│   └── Secret detection
│
├── 📦 Dependency Review
│   └── Cek dependency baru berisiko
│
├── 🧪 Integration Tests
│   └── End-to-end test passing
│
├── 📸 Visual Regression
│   └── Screenshot comparison (jika UI)
│
└── ✅ SEMUA HARUS PASS SEBELUM MERGE

SETIAP PUSH TO MAIN:
│
├── 🚀 Deploy to Staging
├── 🧪 E2E Tests on Staging
├── 👀 Manual QA (jika perlu)
├── 🚀 Deploy to Production
└── 📊 Post-deploy Monitoring
═══════════════════════════════════════════════════
```

---

## 18. KESALAHAN UMUM VIBE CODER & CARA MENGHINDARINYA

### 18.1 Daftar Kesalahan dari Anthropic

> **💡 Kutipan dari Anthropic:**
> *"These are common mistakes. Recognizing them early saves time."*

```
KESALAHAN UMUM:
═══════════════════════════════════════════════════

1. 🚨 THE KITCHEN SINK SESSION
   Masalah: Mulai 1 task, lalu pindah ke task lain.
            Context penuh dengan info tidak berguna.
   Solusi: /clear antar task yang tidak berhubungan.

2. 🚨 CORRECTING OVER AND OVER
   Masalah: AI salah, koreksi, masih salah, koreksi lagi.
            Context terpolusi dengan pendekatan gagal.
   Solusi: Setelah 2 koreksi gagal, /clear + prompt baru.

3. 🚨 OVER-SPECIFIED CONFIGURATION
   Masalah: AGENTS.md/CLAUDE.MD terlalu panjang.
            AI mengabaikan aturan penting.
   Solusi: Prune secara agresif. Hapus yang AI sudah tahu.

4. 🚨 THE TRUST-THEN-VERIFY GAP
   Masalah: AI hasilkan kode yang terlihat benar.
            Tapi tidak handle edge cases.
   Solusi: Selalu sediakan verification mechanism.

5. 🚨 JUMPING STRAIGHT TO CODE
   Masalah: Langsung minta coding tanpa plan.
            Kode menyelesaikan masalah yang salah.
   Solusi: Explore → Plan → Implement.

6. 🚨 ONE GIANT PROMPT
   Masalah: Satu prompt besar, loop sampai "victory".
            Hasilkan demo, bukan production software.
   Solusi: Break menjadi sprint-sprint kecil.

7. 🚨 INFINITE EXPLORATION
   Masalah: Minta AI "investigate" tanpa scope.
            AI baca ratusan file, context penuh.
   Solusi: Scope investigation atau pakai subagent.

8. 🚨 NO HUMAN VERIFICATION
   Masalah: Trust AI sepenuhnya tanpa cek.
            Bug lolos ke production.
   Solusi: Human merge gate WAJIB.
═══════════════════════════════════════════════════
```

### 18.2 Kapan Harus Mulai Chat Baru?

```
MULAI CHAT BARU KETIKA:
═══════════════════════════════════════════════════

✅ Berganti sprint
✅ Topik sudah tidak relevan
✅ Sudah koreksi AI > 2 kali untuk hal sama
✅ Context sudah penuh (AI mulai "lupa")
✅ Ingin fokus pada task baru
✅ Ingin fresh review (tidak bias)

JANGAN MULAI CHAT BARU KETIKA:
❌ Masih dalam sprint yang sama
❌ Butuh konteks dari chat sebelumnya
❌ Sedang dalam flow yang baik
═══════════════════════════════════════════════════
```

---

## 19. KESIMPulan

### 🎯 Pesan Utama

> **Jangan minta AI builder membangun dari ide yang samar. Gunakan architect dulu!**

> **💡 Kutipan dari Anthropic:**
> *"Success in the LLM space isn't about building the most sophisticated system. It's about building the right system for your needs."*

> **💡 Kutipan dari Chris Titus Tech:**
> *"Don't wait for a mythical future model to fix a bad development process. Use the tools available today, keep the parts that work, remove the parts that do not, and make the process better every time."*

### 📌 Ringkasan: Dari Vibe ke Production

```
TRANSFORMASI VIBE CODER → PRODUCTION ENGINEER:
═══════════════════════════════════════════════════

SEBELUM (Vibe Coder):
├── "Buatkan saya aplikasi X"
├── AI menejak semua hal
├── Tidak ada test
├── Tidak ada documentation
├── Tidak ada security
├── Tidak ada review
└── Hasil: Demo yang berantakan

SESUDAH (Production Engineer):
├── Specification dulu → Architect dulu → Builder
├── Semua keputusan didokumentasikan
├── Test harness dibangun duluan
├── Documentation selalu diperbarui
├── Security checklist dipenuhi
├── Review oleh AI lain + human
├── CI/CD pipeline otomatis
├── Human merge gate
└── Hasil: Perangkat lunak yang solid

TIGA PILAR:
1. ARCHITECT DULU (Brainstorm → Spec → Blueprint)
2. GUARDRAILS (Test → Lint → Security → CI/CD)
3. MANUSIA SEBAGAI GATE (Review → Verify → Merge)

INGAT:
- Tool bisa diganti, tapi gates tidak boleh dihilangkan
- Slow is smooth, smooth is fast
- Quality > Speed
- Production > Demo
═══════════════════════════════════════════════════
```

---

## 20. GLOSARIUM LENGKAP

| Istilah | Penjelasan |
|---------|-----------|
| **Vibe Coding** | Pendekatan coding tanpa perencanaan, hanya "ikut feeling" |
| **Architect** | LLM (ChatGPT/Claude) yang bertindak sebagai perencana |
| **Builder** | Tool coding (Codex/Claude Code/Cursor) yang menulis kode |
| **Architect Pack** | Paket 4 dokumen per sprint (Requirements, Blueprint, Acceptance, Handoff) |
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
| **Workflow** | Sistem di mana LLM dan tools di-orchestrate melalui code paths yang sudah didefinisikan |
| **Agent** | Sistem di mana LLM secara dinamis mengarahkan proses dan penggunaan tools |
| **Prompt Chaining** | Memecah tugas menjadi langkah berurutan dengan validasi di antaranya |
| **Routing** | Mengklasifikasi input dan mengarahkannya ke handler yang sesuai |
| **Parallelization** | Menjalankan beberapa task secara bersamaan |
| **Orchestrator-Workers** | LLM pusat yang memecah tugas dan mendelegasikan ke worker |
| **Evaluator-Optimizer** | Satu LLM generate, LLM lain evaluate, loop sampai memuaskan |
| **ACI** | Agent-Computer Interface — cara AI berinteraksi dengan tools |
| **Poka-yoke** | Teknik error-proofing agar kesulitan membuat error |
| **CI/CD** | Continuous Integration/Continuous Deployment — otomasi build & deploy |
| **RBAC** | Role-Based Access Control — kontrol akses berdasarkan peran |
| **Scope Creep** | Perluasan scope yang tidak terkontrol |
| **Sanity Check** | Pemeriksaan cepat untuk memastikan hasil masuk akal |
| **TDD** | Test-Driven Development — penulisan test sebelum kode |

---

**📅 Terakhir diperbarui:** Agustus 2026  
**✍️ Disusun dari:** 5 sumber utama:
1. 120x.ai — Architect-Builder Method (transkrip asli)
2. Chris Titus Tech — My AI Coding Workflow That Actually Works
3. Anthropic — Best Practices for Claude Code
4. Anthropic — Building Effective Agents
5. Anthropic — Prompting Best Practices

**🎯 Tujuan:** Materi pembelajaran lengkap untuk pemula yang ingin membangun perangkat lunak dengan AI secara terstruktur dan production-ready
