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

