# 📘 Panduan Lengkap: Prinsip Anthropic Engineer dalam Menggunakan Claude Code

> **Terjemahan dan Penjelasan Detail dari "How Anthropic Engineers ACTUALLY Prompt Claude Code"**
> 
> Sumber asli: Compiled by **Frank Nillard** · Agentic Architects · May 2026
> 
> 🌐 **Bahasa Indonesia** — Disusun untuk pemula yang ingin belajar AI Agent
> untuk membangun aplikasi sederhana maupun kompleks.

---

## 📋 Daftar Isi

| # | Prinsip | File |
|---|---------|------|
| 1 | **Prompt Skills, Bukan Claude** | [01-prinsip-1-prompt-skills-bukan-claude.md](./01-prinsip-1-prompt-skills-bukan-claude.md) |
| 2 | **Skills Lebih dari Sekadar Prompt** | [02-prinsip-2-skills-lebih-dari-prompt.md](./02-prinsip-2-skills-lebih-dari-prompt.md) |
| 3 | **Skills Composable untuk Tugas Berulang, Tools Sekali Pakai untuk Tugas Spesifik** | [03-prinsip-3-composable-dan-throwaway.md](./03-prinsip-3-composable-dan-throwaway.md) |
| 4 | **Skills yang Semakin Pintar Setiap Sesi** | [04-prinsip-4-skills-semakin-pintar.md](./04-prinsip-4-skills-semakin-pintar.md) |
| 5 | **Format Output Adalah Prompt** | [05-prinsip-5-format-output-adalah-prompt.md](./05-prinsip-5-format-output-adalah-prompt.md) |
| — | **Lembar Cheat Sheet & Ringkasan** | [06-cheat-sheet-dan-ringkasan.md](./06-cheat-sheet-dan-ringkasan.md) |
| — | **Panduan Memulai untuk Pemula** | [07-panduan-memulai-untuk-pemula.md](./07-panduan-memulai-untuk-pemula.md) |
| — | **Glossarium Istilah Teknis** | [08-glossarium-istilah-teknis.md](./08-glossarium-istilah-teknis.md) |

---

## 🎯 Target Pembaca

Panduan ini dirancang untuk:

- **Pemula total** yang baru pertama kali mendengar tentang Claude Code dan AI Agent
- **Developer pemula** yang ingin memanfaatkan AI untuk coding
- **Pembuat konten** yang ingin mengotomatisasi workflow mereka
- **Siapa saja** yang ingin memahami cara kerja Claude Code secara mendalam

---

## 🧠 Apa Itu Claude Code?

Sebelum masuk ke prinsip-prinsipnya, mari pahami dulu **Claude Code**:

> **Claude Code** adalah alat berbasis CLI (Command Line Interface / antarmuka baris perintah) buatan Anthropic (perusahaan di balik Claude AI) yang memungkinkan kamu berinteraksi dengan AI langsung dari terminal atau command prompt komputer kamu.

**Analogi sederhana:**
- Bayangkan Claude Code seperti **asisten programmer pribadi** yang bisa kamu ajak bicara
- Kamu bisa minta dia menulis kode, memperbaiki bug, menjelaskan konsep, dan banyak lagi
- Yang membedakan dengan ChatGPT biasa: Claude Code bisa **langsung mengedit file** di proyek kamu

---

## 📂 Struktur Folder Skills

Sepanjang panduan ini, kamu akan sering mendengar istilah **"skills"**. Secara teknis, skills adalah folder yang berisi instruksi untuk Claude:

```
~/.claude/skills/          # Global skills — tersedia di SEMUA proyek
.project/.claude/skills/   # Project skills — hanya untuk proyek tertentu
```

Di dalam setiap folder skill, ada file `SKILL.md` yang berisi instruksi, plus script dan tools pendukung.

---

## 🚀 Cara Menggunakan Panduan Ini

1. **Baca secara berurutan** — Setiap prinsip membangun pemahaman dari prinsip sebelumnya
2. **Praktekkan langsung** — Setiap prinsip dilengkapi contoh prompt yang bisa kamu coba
3. **Jangan takut bereksperimen** — Claude Code dirancang untuk kamu coba-coba
4. **Gunakan discovery prompt** — Setiap bab punya prompt yang bisa kamu gunakan untuk audit workflow kamu sendiri

---

Selamat belajar! 🎉

👉 Lanjut ke [Prinsip 1: Prompt Skills, Bukan Claude](./01-prinsip-1-prompt-skills-bukan-claude.md)
