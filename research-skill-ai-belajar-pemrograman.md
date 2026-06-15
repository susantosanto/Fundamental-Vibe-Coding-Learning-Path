# Research Report: AI Skill untuk Belajar Pemrograman dari Fundamental
**Tanggal:** 15 Juni 2026 | **Sumber:** explainx.ai | **Confidence:** High

---

## Executive Summary

Berdasarkan riset mendalam terhadap 9+ skill AI di explainx.ai, **skill yang paling cocok untuk workflow belajar pemrograman dari fundamental dasar adalah `teach` oleh Matt Pocock**, diikuti oleh `coding-tutor` dan `gentle-teaching`. Kelima skill yang Anda sebutkan (*tutorial-engineer*, *code-documentation-code-explain*, *documentation*, *learning-opportunities*, *prompt-engineering-patterns*) **tidak dirancang untuk pembelajaran pemula**—kebanyakan untuk pembuat konten atau developer tingkat lanjut.

---

## 1. Analisis 5 Skill yang Anda Sebutkan

### 1.1 tutorial-engineer (sickn33)
| Aspek | Detail |
|:---|:---|
| **Tujuan** | Membuat tutorial terstruktur dengan framework pedagogis (Bloom's taxonomy) |
| **Target Pengguna** | Developer/technical writer INTERMEDIATE-ADVANCED yang ingin *membuat* tutorial |
| **Cara Kerja** | Template struktur tutorial, quality checklist, speed scoring metrics |
| **Untuk Pemula?** | **❌ TIDAK.** Skill ini untuk *pembuat konten*, bukan *pembelajar*. Anda harus sudah expert untuk menggunakannya. |
| **Verdict** | Tidak cocok untuk belajar programming |

### 1.2 code-documentation-code-explain (sickn33)
| Aspek | Detail |
|:---|:---|
| **Tujuan** | Menjelaskan kode yang sudah ada dalam bahasa sederhana — seperti tutor kode |
| **Target Pengguna** | SEMUA LEVEL termasuk pemula yang ingin memahami kode |
| **Cara Kerja** | Menganalisis kode → memberikan high-level summary → breakdown detail → pitfalls |
| **Untuk Pemula?** | **⚠️ SEBAGIAN.** Bagus untuk *memahami kode yang sudah ada*, tapi bukan kurikulum terstruktur untuk belajar dari nol. |
| **Verdict** | Cocok sebagai alat bantu, bukan sebagai kurikulum utama |

### 1.3 documentation (mcollina)
| Aspek | Detail |
|:---|:---|
| **Tujuan** | Membuat dokumentasi teknis menggunakan framework Diátaxis (Tutorials, How-to, Reference, Explanation) |
| **Target Pengguna** | Developer/technical writer INTERMEDIATE-ADVANCED |
| **Cara Kerja** | Decision tree untuk format dokumentasi, template, validation checklist |
| **Untuk Pemula?** | **❌ TIDAK.** Skill ini untuk *penulis dokumentasi*, bukan pembelajar. |
| **Verdict** | Tidak cocok untuk belajar programming |

### 1.4 learning-opportunities (tech-leads-club)
| Aspek | Detail |
|:---|:---|
| **Tujuan** | Menyuntikkan latihan belajar *saat coding* (predict → observe, generate → compare, teach it back) |
| **Target Pengguna** | Developer INTERMEDIATE yang sudah bisa coding dan ingin pemahaman lebih dalam |
| **Cara Kerja** | Setelah selesai task coding, AI memberikan challenge 10-15 menit untuk refleksi |
| **Untuk Pemula?** | **❌ TIDAK.** Mengasumsikan Anda *sudah membangun project* dan membuat keputusan arsitektural. |
| **Verdict** | Cocok setelah Anda sudah bisa coding, bukan untuk memulai dari nol |

### 1.5 prompt-engineering-patterns (wshobson)
| Aspek | Detail |
|:---|:---|
| **Tujuan** | Pattern produksi untuk prompt engineering (LangChain, Pydantic, structured output) |
| **Target Pengguna** | AI Engineer / Developer ADVANCED |
| **Cara Kerja** | Code snippets Python, template Chain-of-Thought, Few-Shot learning patterns |
| **Untuk Pemula?** | **❌ TIDAK. Sama sekali tidak.** Ini untuk engineer yang sudah expert membangun aplikasi LLM. |
| **Verdict** | Tidak relevan untuk belajar programming dasar |

---

## 2. Skill yang LEBIH Cocok untuk Belajar (Temuan Baru)

### 2.1 ⭐ teach (mattpocock) — **REKOMENDASI UTAMA**
| Aspek | Detail |
|:---|:---|
| **Tujuan** | Mengubah AI coding assistant menjadi **tutor pribadi** dengan sesi belajar stateful (berkelanjutan) |
| **Target Pengguna** | **SEMUA LEVEL** — AI menyesuaikan dengan *Zone of Proximal Development* Anda |
| **Cara Kerja** | Membuat **teaching workspace** di direktori lokal Anda: |
| | - `MISSION.md` — mengapa Anda ingin belajar (tujuan) |
| | - `./lessons/*.html` — file HTML lesson mandiri, 1 konsep per file |
| | - `./reference/*.html` — cheat sheet, glosarium, syntax guide |
| | - `./learning-records/*.md` — catatan progres belajar (seperti ADR) |
| | - `RESOURCES.md` — daftar sumber belajar eksternal berkualitas |
| **Dukungan Bahasa** | **AGNOSTIK** — bisa untuk JavaScript, Python, HTML, CSS, PHP, ML, apapun |
| **Kelebihan** | ✅ Stateful (AI ingat progres Anda) ✅ Lesson mandiri yang indah ✅ Berbasis praktik bukan teori ✅ Adaptif level pengguna ✅ Referensi kredibel dengan citation |
| **Kekurangan** | Setup awal perlu direktori, butuh partisipasi aktif dari Anda |
| **Untuk Pemula?** | **✅ SANGAT COCOK.** Desainnya memang untuk membimbing dari awal dengan step-by-step. |
| **Verdict** | **🏆 PIL TERBAIK untuk belajar programming dari fundamental** |

### 2.2 coding-tutor (everyinc)
| Aspek | Detail |
|:---|:---|
| **Tujuan** | Memberikan bimbingan interaktif dan penjelasan konsep programming |
| **Target Pengguna** | Pembelajar programming di semua level |
| **Cara Kerja** | Interaktif — Anda bertanya, AI menjawab dengan penjelasan konseptual |
| **Untuk Pemula?** | **✅ COCOK.** Didesain untuk membantu memahami konsep programming. |
| **Verdict** | Alternatif yang baik, tapi kurang terstruktur dibanding `teach` |

### 2.3 ⭐ gentle-teaching (jwynia) — **REKOMENDASI KEDUA**
| Aspek | Detail |
|:---|:---|
| **Tujuan** | **Tidak memberikan jawaban langsung** — memandu Anda menemukan solusi sendiri (metode Socratic) |
| **Target Pengguna** | Pembelajar yang ingin pemahaman **mendalam dan mandiri** |
| **Cara Kerja** | Reflection Prompts → Principles → Targeted Feedback. Menerapkan prinsip *gentle parenting* ke pembelajaran orang dewasa |
| **Untuk Pemula?** | **✅ SANGAT COCOK.** Mencegah *answer dependency* (ketergantungan pada AI). Membangun growth mindset. |
| **Verdict** | **🥈 PIL KEDUA TERBAIK.** Excellent untuk membangun fondasi yang kuat, tapi butuh kesabaran ekstra. |

### 2.4 mentoring-juniors (github/awesome-copilot)
| Aspek | Detail |
|:---|:---|
| **Tujuan** | Framework mentoring Socratic untuk developer junior — mengajarkan workflow profesional |
| **Target Pengguna** | **Junior developer** yang sudah tahu dasar-dasar programming |
| **Cara Kerja** | PEAR Loop (Plan, Explore, Analyze, Rewrite), Golden Rules, CTEX prompting |
| **Untuk Pemula?** | **⚠️ SEBAGIAN.** Cocok SETELAH Anda menguasai basic syntax programming. |
| **Verdict** | Bagus sebagai langkah kedua setelah `teach` atau `gentle-teaching` |

---

## 3. Perbandingan Semua Skill

| Skill | Untuk Pemula? | Structured? | Stateful? | Language Agnostic? | Best For |
|:---|---:|---:|---:|---:|:---|
| **teach** (mattpocock) | ✅✅✅ | ✅✅✅ | ✅✅✅ | ✅✅✅ | **Belajar dari nol secara terstruktur** |
| **coding-tutor** (everyinc) | ✅✅ | ✅ | ❌ | ✅✅ | Konsultasi konsep on-demand |
| **gentle-teaching** (jwynia) | ✅✅✅ | ✅✅ | ❌ | ✅✅✅ | Membangun kemandirian belajar |
| **mentoring-juniors** (github) | ✅ | ✅✅ | ❌ | ✅ | Junior dev setelah basic dikuasai |
| code-documentation-code-explain | ⚠️ | ✅ | ❌ | ✅✅✅ | Memahami kode existing |
| tutorial-engineer | ❌ | ✅✅ | ❌ | ✅✅✅ | Membuat tutorial untuk org lain |
| documentation (mcollina) | ❌ | ✅✅ | ❌ | ✅✅✅ | Menulis dokumentasi |
| learning-opportunities | ❌ | ✅✅ | ✅ | ✅✅✅ | Deep-dive setelah bisa coding |
| prompt-engineering-patterns | ❌❌ | ✅✅ | ❌ | ❌ (Python) | Engineering LLM |

---

## 4. Rekomendasi Workflow Belajar untuk Pemula

Berdasarkan riset, berikut **workflow optimal** untuk belajar JavaScript, HTML, CSS, Python, PHP, dan ML dari fundamental:

### Fase 1: Fondasi Dasar (Bulan 1-2)
**Gunakan: `teach` (mattpocock) + `gentle-teaching` (jwynia)**

```
1. Install skill `teach`:
   npx skills add https://github.com/mattpocock/skills --skill teach

2. Mulai dengan MISSION: "Saya ingin belajar JavaScript dari nol"
   → AI akan membuat lesson HTML: ./lessons/0001-variables.html

3. Setiap selesai 1 lesson, AI akan lanjut ke konsep berikutnya
   → Variables → Functions → Loops → DOM Manipulation

4. Gunakan /gentle-teaching saat stuck:
   → AI tidak akan memberi jawaban, tapi memandu Anda menemukan solusi
```

### Fase 2: Praktik Mandiri (Bulan 2-4)
**Gunakan: `teach` (lanjutan) + `code-documentation-code-explain`**

```
1. Lanjutkan dengan lesson HTML/CSS dari `teach`
2. Saat membaca project orang lain atau dokumentasi:
   → Gunakan /code-documentation-code-explain untuk memahami kode kompleks
```

### Fase 3: Intermediate (Bulan 4-6)
**Gunakan: `learning-opportunities` + `mentoring-juniors`**

```
1. Setelah bisa coding basic, install learning-opportunities
2. Saat mengerjakan project, AI akan menyelipkan challenge:
   → "Coba prediksi output dari kode ini sebelum running"
3. Gunakan mentoring-juniors untuk belajar workflow profesional
```

### Fase 4: Machine Learning (Bulan 6+)
**Gunakan: `teach` dengan ML mission**

```
1. Buat MISSION baru: "Saya ingin belajar Machine Learning dengan Python"
2. AI akan membuat lesson tentang:
   → Basic Python untuk ML → NumPy/Pandas → Scikit-learn → Neural Networks
3. Setiap lesson: satu HTML file, satu konsep, selesai dalam 15-30 menit
```

---

## 5. Cara Install Skill

Semua skill di explainx.ai bisa diinstall dengan perintah:

```bash
# Install teach (REKOMENDASI UTAMA)
npx skills add https://github.com/mattpocock/skills --skill teach

# Install coding-tutor
npx skills add https://github.com/everyinc/skills --skill coding-tutor

# Install gentle-teaching
npx skills add https://github.com/jwynia/agent-skills --skill gentle-teaching

# Install mentoring-juniors
npx skills add https://github.com/github/awesome-copilot --skill mentoring-juniors

# Install code-documentation-code-explain
npx skills add https://github.com/sickn33/antigravity-awesome-skills --skill code-documentation-code-explain

# Install learning-opportunities
npx skills add https://github.com/tech-leads-club/agent-skills --skill learning-opportunities
```

Catatan: Skill-skill ini kompatibel dengan **Cursor**, **Claude Code**, **Windsurf**, **Cline**, **Codex**, dan **Amp**.

---

## 6. Kesimpulan

| Peringkat | Skill | Alasan |
|:---:|:---|:---|
| **🥇** | **teach** (mattpocock) | Paling lengkap, terstruktur, stateful, adaptif untuk pemula |
| **🥈** | **gentle-teaching** (jwynia) | Terbaik untuk membangun pemahaman mendalam tanpa ketergantungan AI |
| **🥉** | **coding-tutor** (everyinc) | Alternatif ringan untuk tanya-jawab konsep |
| **4** | **mentoring-juniors** | Cocok setelah basic dikuasai |
| **5** | **code-documentation-code-explain** | Alat bantu memahami kode existing |

**Rekomendasi final:** Mulailah dengan **`teach` (mattpocock)** untuk belajar JavaScript/HTML/CSS/Python/PHP/ML dari fundamental, dan gunakan **`gentle-teaching` (jwynia)** sebagai pendamping saat Anda stuck untuk memastikan Anda benar-benar memahami konsepnya, bukan hanya menyalin jawaban.

---

## Sumber
1. [tutorial-engineer](https://explainx.ai/skills/sickn33/antigravity-awesome-skills/tutorial-engineer)
2. [code-documentation-code-explain](https://explainx.ai/skills/sickn33/antigravity-awesome-skills/code-documentation-code-explain)
3. [documentation (mcollina)](https://explainx.ai/skills/mcollina/skills/documentation)
4. [learning-opportunities](https://explainx.ai/skills/tech-leads-club/agent-skills/learning-opportunities)
5. [prompt-engineering-patterns](https://explainx.ai/skills/wshobson/agents/prompt-engineering-patterns)
6. [teach (mattpocock)](https://explainx.ai/skills/mattpocock/skills/teach)
7. [coding-tutor](https://explainx.ai/skills/everyinc/skills/coding-tutor)
8. [gentle-teaching](https://explainx.ai/skills/jwynia/agent-skills/gentle-teaching)
9. [mentoring-juniors](https://explainx.ai/skills?q=mentoring-juniors)
10. [explainx.ai skills registry](https://explainx.ai/skills)

## Metodologi
Mencari 15+ query di explainx.ai. Menganalisis 9+ skill pages secara mendalam.
Sub-questions: Apa fungsi setiap skill? Siapa target pengguna? Apakah cocok untuk pemula absolut? Seberapa terstruktur pembelajarannya?
