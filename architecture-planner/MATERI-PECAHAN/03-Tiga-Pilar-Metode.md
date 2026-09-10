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

