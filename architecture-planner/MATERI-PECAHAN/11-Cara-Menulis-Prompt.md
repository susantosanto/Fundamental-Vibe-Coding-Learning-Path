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

