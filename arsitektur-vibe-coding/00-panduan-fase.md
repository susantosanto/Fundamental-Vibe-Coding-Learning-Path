# 🗺️ Arsitektur Vibe Coding — Panduan Fase

> **"Arsitektur itu gampang kalau diajarkan dengan cara yang benar."**
>
> Modul ini menjembatani dua materi yang sudah Anda punya:
> - **`prompting-fundamental/`** → Gaya belajar yang mudah, analogi, step-by-step
> - **`fase-1-arsitektur-dasar/`** → Konsep arsitektur yang lengkap tapi terasa rumit
>
> Di sini Anda belajar **arsitektur aplikasi dengan cara langsung dipraktikkan**
> bersama AI (Claude Code / OpenCode), memakai **React / Next.js**,
> dan di setiap langkah ada **template prompt siap pakai**.

---

## 🎯 Tujuan Fase Ini

Di akhir fase ini, Anda akan mampu:

1. **Menggambar denah (arsitektur) aplikasi** sebelum minta AI menulis kode
2. **Mengenal 4 komponen inti** aplikasi web: Frontend, Backend, Database, API
3. **Memahami struktur folder Next.js** dan kenapa rapi itu penting
4. **Membuat komponen, state, API, dan database** dengan bantuan AI
5. **Membuat keputusan trade-off sederhana** (kapan perlu database? kapan cukup localStorage?)
6. **Membangun SATU aplikasi semi-kompleks** dari nol sampai jalan

> 🎯 **Beda dengan fase-1-arsitektur-dasar:** di sana Anda belajar konsep
> berskala raksasa (DNS, CDN, load balancer, CAP theorem). Di sini Anda belajar
> **arsitektur untuk aplikasi Anda sendiri** — skala kecil sampai menengah,
> yang langsung bisa dipraktikkan hari ini.

---

## 🧱 Prasyarat

| Materi | Status yang Disarankan |
|--------|------------------------|
| `prompting-fundamental/fase-01` s/d `fase-04` | Sudah paham (Konteks → Tugas → Format, Input → Proses → Output) |
| `prompting-fundamental/fase-05` s/d `fase-06` | Sudah pernah coba (bisa bikin aplikasi HTML/CSS/JS) |
| Node.js terpasang di komputer | `node --version` di terminal harus muncul angka |
| Claude Code / OpenCode terpasang | Bisa dijalankan dari terminal di folder proyek |

> 💡 **Belum punya Node.js?** Minta AI bantu:
> ```text
> Saya belum punya Node.js di Windows. Jelaskan langkah demi langkah
> cara install Node.js versi LTS, dengan perintah terminal yang bisa saya
> copy-paste. Saya pemula, tolong detail.
> ```

---

## 📚 Urutan Belajar — TAHAP 1: Fondasi Arsitektur (Modul 0-9)

| # | File | Topik | Kaitan dengan fase-1-arsitektur-dasar | Estimasi |
|---|------|-------|----------------------------------------|----------|
| **0** | `00-panduan-fase.md` | Peta belajar ini | — | 5 menit |
| **1** | `01-arsitektur-itu-gampang.md` | Apa itu arsitektur + 3 pertanyaan ajaib | File `01` (intro system design) | 30 menit |
| **2** | `02-peta-aplikasi-modern.md` | 4 komponen inti aplikasi web | File `11` (application layer) | 30 menit |
| **3** | `03-struktur-folder-nextjs.md` | Struktur folder Next.js App Router | File `11` (layering) | 40 menit |
| **4** | `04-komponen-dan-props.md` | Komponen React = lego | File `01` (modularitas) | 40 menit |
| **5** | `05-state-dan-data-flow.md` | State & alur data | File `05` (konsistensi data) | 45 menit |
| **6** | `06-api-dan-database.md` | API & database (CRUD) | File `12`-`13` (database) | 50 menit |
| **7** | `07-trade-off-pemula.md` | Trade-off: kapan butuh apa | File `02`-`04` (performa, trade-off) | 30 menit |
| **8** | `08-proyek-semi-kompleks.md` | 🏗️ Proyek akhir: bangun aplikasi lengkap | File `18` (studi kasus) | 2-3 jam |
| **9** | `09-ringkasan-dan-glosarium.md` | Ringkasan + kamus istilah | File `21` (ringkasan fase) | 20 menit |

**Total Tahap 1:** ~7 jam belajar aktif → selesai dalam **1-2 minggu**.

---

## 📚 Urutan Belajar — TAHAP 2: Tech Stack Lengkap (Modul 10-18)

> Setelah paham fondasi arsitektur, Anda belajar **satu per satu tech stack**
> secara mendetail — setiap modul ada teori + prompt AI + latihan.
> Urutan dimulai dari ReactJS → NodeJS → NextJS → Laravel, lalu database
> → networking → API → deployment.

| # | File | Tech Stack | Yang Akan Anda Kuasai | Estimasi |
|---|------|-----------|----------------------|----------|
| **10** | `10-reactjs.md` | ⚛️ ReactJS | Komponen, JSX, hooks, state, fetch data | 3-4 jam |
| **11** | `11-nodejs.md` | 🟩 NodeJS | Runtime, npm, Express, REST API dasar | 3-4 jam |
| **12** | `12-nextjs.md` | ▲ NextJS | App Router dalam, server/client, data fetching | 3-4 jam |
| **13** | `13-laravel.md` | 🐘 Laravel | Dasar PHP + routing, Blade, Eloquent ORM | 5-6 jam |
| **14** | `14-sqlite.md` | 🗃️ SQLite | SQL dasar, koneksi dari app, Prisma | 3 jam |
| **15** | `15-postgresql.md` | 🐘 PostgreSQL | Beda vs SQLite, schema, relasi, JOIN | 3-4 jam |
| **16** | `16-networking.md` | 🌐 Networking | IP, port, DNS, HTTP/HTTPS, status code | 3 jam |
| **17** | `17-api.md` | 🔌 API | REST design, JSON, autentikasi, versioning | 3-4 jam |
| **18** | `18-vps-server.md` | 🖥️ VPS Server | Pondasi server/hosting/VPS dari 0 (lengkap untuk pemula), hosting gratis vs berbayar, SSH, deploy Node/Next/Laravel, SSL, bonus AI model (Ollama) | 8-10 jam |

**Total Tahap 2:** ~35 jam → selesai dalam **4-6 minggu** (1 jam/hari).

---

## 📚 Urutan Belajar — TAHAP 3: Loop Engineering, Proyek Final, Prompting, Arsitektur & Integrasi AI (Modul 19-23)

> Gabungkan SEMUA: arsitektur + tech stack + workflow AI profesional.

| # | File | Topik | Estimasi |
|---|------|-------|----------|
| **19** | `19-loop-engineering.md` | 🔁 Loop engineering: brainstorming → planning → PRD → desain UI → implementasi → testing | 4-5 jam |
| **20** | `20-proyek-akhir.md` | 🏆 Proyek final: bangun aplikasi dari 0 dengan vibe coding | 6-8 jam |
| **21** | `21-prompting-engineering.md` | 🤖 Prompting engineering (dari prompting-fundamental, disederhanakan): 4 komponen prompt, persona, CoT, few-shot, chaining, XML tags | 4-5 jam |
| **22** | `22-arsitektur-desain-sistem.md` | 🏛️ Arsitektur desain sistem (fundamental mendalam): client-server, monolith vs microservices, pola arsitektur, database design, skalabilitas, CAP, keamanan, framework 7 pertanyaan | 6-8 jam |
| **23** | `23-arsitektur-integrasi-ai.md` | 🤖 Arsitektur integrasi AI: alur data chat AI (frontend→backend→provider→streaming), API key di backend, SSE, RAG, AI Gateway, peta provider (Gemini/ChatGPT/Grok/DeepSeek/FLUX/PuterJS), studi kasus aplikasi besar, keamanan OWASP LLM | 6-8 jam |

**Total Tahap 3:** ~29 jam → selesai dalam **4-5 minggu**.

**Total keseluruhan:** ~71 jam → **2-3 bulan** jika konsisten 1 jam/hari.

---

## 🗺️ Peta Tambahan: Modul 21 vs prompting-fundamental

> Modul 21 adalah versi **ringkas & mudah** dari folder `prompting-fundamental/`.
> Setelah menguasai modul 21, buka `prompting-fundamental/` untuk pendalaman:

| Modul 21 (di sini) | Pendalaman di prompting-fundamental |
|-------------------|--------------------------------------|
| 4 komponen prompt | `fase-01-prompting-dasar.md` |
| Persona, CoT, few-shot, self-correction, chaining | `fase-02-teknik-prompting.md` |
| (baca kode hasil AI) | `fase-03-dari-prompt-ke-kode.md` |
| Input → Proses → Output | `fase-04-logika-arsitektur.md` |
| Bangun aplikasi HTML/CSS/JS | `fase-05-membangun-aplikasi.md` |
| Aplikasi semi-kompleks | `fase-06-aplikasi-semi-kompleks.md` |

---

## 🔄 Pola Kerja Setiap Modul

```
┌────────────────────────────────────────────────────────────┐
│  SETIAP MODUL MENGIKUTI POLA INI:                          │
│                                                            │
│  1. 🧠 TEORI SINGKAT  → konsep dengan analogi sehari-hari  │
│  2. 🎯 CONTOH NYATA   → aplikasi yang Anda kenal            │
│  3. 🤖 PROMPT AI      → template prompt siap copy-paste    │
│  4. 🏗️ PRAKTIK        → kerjakan bersama AI                │
│  5. ✅ CHECKLIST      → pastikan paham sebelum lanjut      │
└────────────────────────────────────────────────────────────┘
```

**Aturan emas:**

```text
❌ JANGAN:  Baca semua modul dalam 1 hari → OVERWHELM
❌ JANGAN:  Copy-paste prompt tanpa paham → GAK NGEH
❌ JANGAN:  Minta AI langsung tulis semua kode → SPAGHETTI

✅ LAKUKAN: 1 modul per hari, konsisten
✅ LAKUKAN: Prompt arsitektur DULU, kode belakangan
✅ LAKUKAN: Ketik ulang contoh, jangan cuma copas
✅ LAKUKAN: Simpan hasil di folder proyek sendiri
```

---

## 🤖 Cara Pakai Prompt di Claude Code / OpenCode

Prompt di modul ini ditulis **untuk CLI agent** (Claude Code / OpenCode),
bukan untuk chat web. Bedanya:

| Chat web (Claude.ai/ChatGPT) | CLI agent (Claude Code/OpenCode) |
|------------------------------|----------------------------------|
| Semua konteks harus diketik dalam 1 pesan | Agent bisa **membaca file** di folder proyek |
| Hasil di-copy manual ke file | Agent **menulis langsung ke file** |
| Harus repost kode setiap iterasi | Agent mengingat konteks dalam sesi |

**Pola prompt CLI yang ampuh:**

```text
[Beri peran]           → "Kamu adalah arsitek Next.js senior..."
[Berikan konteks]      → "Proyek saya ada di folder ini. Baca file README.md..."
[Minta rencana dulu]   → "...jangan langsung menulis kode. Jelaskan rencanamu dulu."
[Beri batasan]         → "Gunakan App Router, jangan Pages Router..."
[Minta konfirmasi]     → "Setujui rencana saya sebelum mulai."
```

> 💡 **Tips: Selalu minta AI "membaca" file yang sudah ada.** Contoh:
> ```text
> Baca file app/page.tsx dan komponen yang ada di folder components/.
> Lalu jelaskan struktur aplikasi saya saat ini dengan diagram sederhana.
> ```

---

## 📁 Struktur Folder yang Akan Anda Bangun

```text
aplikasi-anda/
├── app/                      ← Halaman & API (jantung Next.js)
│   ├── layout.tsx            ← Kerangka halaman (header, footer)
│   ├── page.tsx              ← Halaman utama
│   ├── globals.css           ← Styling global
│   └── api/                  ← Backend (route handlers)
├── components/               ← Komponen UI (lego)
│   ├── ui/                   ← Komponen umum (Tombol, Kartu)
│   └── features/             ← Komponen khusus fitur
├── lib/                      ← Helper & koneksi database
├── public/                   ← Gambar & file statis
└── package.json              ← Daftar "bahan" proyek
```

> Jangan hafal dulu! Modul 3 akan menjelaskan satu per satu.

---

## 🗺️ Peta: Modul Ini vs fase-1-arsitektur-dasar

```text
ANDA DI SINI (arsitektur-vibe-coding/)
├── Fokus: aplikasi yang Anda bangun SENDIRI
├── Skala: 1 pengguna → puluhan pengguna
├── Alat: AI menulis kode, Anda yang mendesain
└── Tujuan: aplikasi JADI & jalan

SETELAH INI, fase-1-arsitektur-dasar terasa MUDAH karena:
├── Anda sudah tahu "kenapa" butuh struktur
├── Konsep seperti scaling, cache, database terlihat nyata
└── Anda tinggal "memperbesar" pemahaman yang sudah ada
```

> 💡 **Rekomendasi:** Setelah menyelesaikan modul 8 (proyek akhir), barulah
> kembali ke `fase-1-arsitektur-dasar/` untuk pendalaman — kali ini Anda
> sudah punya pengalaman nyata, jadi konsepnya akan "klik".

---

## ✅ Checklist Awal

Sebelum mulai, pastikan:

```
☐ Node.js terpasang (cek dengan: node --version)
☐ Claude Code / OpenCode bisa dijalankan di terminal
☐ Sudah pernah menyelesaikan minimal fase 1-4 prompting-fundamental
☐ Sudah bikin folder untuk proyek latihan (contoh: D:\belajar\aplikasi-pertama)
☐ Siap belajar 45-60 menit per hari
```

---

**📂 Buka `01-arsitektur-itu-gampang.md` sekarang untuk mulai! 🚀**
