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

## 📑 DAFTAR ISI (Klik untuk membuka bab terkait)

### BAGIAN 1: FONDASI (Bab 1-5)
| No | Judul | File | Deskripsi |
|----|-------|------|-----------|
| 1 | [Mengapa Vibe Coding Gagal](01-Mengapa-Vibe-Coding-Gagal.md) | `01-Mengapa-Vibe-Coding-Gagal.md` | Analisis mendalam mengapa pendekatan tanpa perencanaan selalu gagal untuk production |
| 2 | [Konsep Inti: Architect-Builder Method](02-Konsep-Inti-Architect-Builder.md) | `02-Konsep-Inti-Architect-Builder.md` | Pemisahan peran antara Perencana (Architect) dan Pelaksana (Builder) |
| 3 | [Tiga Pilar Metode Ini](03-Tiga-Pilar-Metode.md) | `03-Tiga-Pilar-Metode.md` | Architect Layer, Builder Layer, dan Source of Truth (Folder System) |
| 4 | [Analogi Membangun Rumah](04-Analogi-Membangun-Rumah.md) | `04-Analogi-Membangun-Rumah.md` | Perbandingan visual antara cara salah (vibe coding) vs cara benar (architect-builder) |
| 5 | [Persiapan Sebelum Memulai](05-Persiapan-Sebelum-Memulai.md) | `05-Persiapan-Sebelum-Memulai.md` | Tool yang dibutuhkan, keterampilan yang sudah dimiliki, setup project di LLM |

### BAGIAN 2: STRUKTUR & FILE (Bab 6-7)
| No | Judul | File | Deskripsi |
|----|-------|------|-----------|
| 6 | [Struktur Folder Proyek (Scaffold)](06-Struktur-Folder-Proyek.md) | `06-Struktur-Folder-Proyek.md` | Template folder lengkap yang menjadi source of truth proyek |
| 7 | [Penjelasan Detail Setiap File](07-Penjelasan-Detail-Setiap-File.md) | `07-Penjelasan-Detail-Setiap-File.md` | Penjelasan mendalam setiap file dalam folder scaffold (AGENTS.MD, STATE.MD, DECISIONS.MD, dll) |

### BAGIAN 3: WORKFLOW (Bab 8-12)
| No | Judul | File | Deskripsi |
|----|-------|------|-----------|
| 8 | [Workflow Lengkap 6 Tahap](08-Workflow-Lengkap-6-Tahap.md) | `08-Workflow-Lengkap-6-Tahap.md` | Panduan step-by-step dari persiapan hingga deployment |
| 9 | [Context Engineering: Rahasia Terbesar](09-Context-Engineering.md) | `09-Context-Engineering.md` | Seni mengelola informasi yang diberikan ke AI agar tidak terjadi context overflow |
| 10 | [Sprint-Based Development](10-Sprint-Based-Development.md) | `10-Sprint-Based-Development.md` | Memecah proyek besar menjadi sprint-sprint kecil yang terukur |
| 11 | [Cara Menulis Prompt yang Benar](11-Cara-Menulis-Prompt.md) | `11-Cara-Menulis-Prompt.md` | Template prompt untuk berbagai situasi (architect, builder, review) |
| 12 | [Sistem Verifikasi & Review](12-Sistem-Verifikasi-Review.md) | `12-Sistem-Verifikasi-Review.md` | Automated testing, linting, security check, dan AI review |

### BAGIAN 4: KEAMANAN & MANAJEMEN (Bab 13-15)
| No | Judul | File | Deskripsi |
|----|-------|------|-----------|
| 13 | [Keamanan & Dependency Check](13-Keamanan-Dependency-Check.md) | `13-Keamanan-Dependency-Check.md` | Tools keamanan (Dependabot, CodeQL) dan CI/CD pipeline |
| 14 | [Manajemen Session AI](14-Manajemen-Session-AI.md) | `14-Manajemen-Session-AI.md` | Strategi mengelola context window dan kapan harus mulai chat baru |
| 15 | [Tools & Teknologi](15-Tools-Teknologi.md) | `15-Tools-Teknologi.md` | Perbandingan ChatGPT vs Claude, Codex vs Claude Code vs Cursor |

### BAGIAN 5: BEST PRACTICES (Bab 16-18)
| No | Judul | File | Deskripsi |
|----|-------|------|-----------|
| 16 | [Tips Praktis & Best Practices](16-Tips-Praktis-Best-Practices.md) | `16-Tips-Praktis-Best-Practices.md` | Yang HARUS dilakukan dan yang TIDAK BOLEH dilakukan |
| 17 | [Kesalahan Umum & Cara Menghindarinya](17-Kesalahan-Umum.md) | `17-Kesalahan-Umum.md` | 6 kesalahan paling umum dan solusinya |
| 18 | [Contoh Kasus Nyata](18-Contoh-Kasus-Nyata.md) | `18-Contoh-Kasus-Nyata.md` | Studi kasus Dashboard Keuangan CEO dan Review Workflow |

### BAGIAN 6: GLOSARIUM & REFERENSI (Bab 19, 24)
| No | Judul | File | Deskripsi |
|----|-------|------|-----------|
| 19 | [Glosarium Lengkap](19-Glosarium-Lengkap.md) | `19-Glosarium-Lengkap.md` | Definisi semua istilah teknis yang digunakan |
| 24 | [Referensi & Sumber](24-Referensi-Sumber.md) | `24-Referensi-Sumber.md` | 12 sumber utama dan konsep pendukung |

### BAGIAN 7: SYSTEM DESIGN & PRODUCTION (Bab 20-23) ⭐ BARU
| No | Judul | File | Deskripsi |
|----|-------|------|-----------|
| 20 | [System Design Architecture untuk Fullstack Web Developer](20-System-Design-Architecture.md) | `20-System-Design-Architecture.md` | 4 layer arsitektur, Monolith vs Microservices, API design, Database, Deployment |
| 21 | [Agentic Patterns & AI Agent Workflow](21-Agentic-Patterns.md) | `21-Agentic-Patterns.md` | 6 pola agentic utama, production reliability patterns, peta ke Architect-Builder |
| 22 | [Standar Production-Ready & Deployment](22-Standar-Production-Ready.md) | `22-Standar-Production-Ready.md` | Checklist production, CI/CD, deployment strategies, monitoring |
| 23 | [Vibe Engineering: Evolusi dari Vibe Coding](23-Vibe-Engineering.md) | `23-Vibe-Engineering.md` | Dinding 3 bulan, transition triggers, hybrid workflow, SDD |

---

## 📊 Statistik Materi

| Metrik | Nilai |
|--------|-------|
| Total Bab | 24 bab |
| Total Baris | 4.524 baris |
| Sumber Utama | 12 sumber |
| Bahasa | Indonesia |
| Target | Pemula hingga menengah |

---

## 🎯 Cara Membaca

**Untuk Pemula Absolut:**
1. Mulai dari Bab 1-4 (fondasi konsep)
2. Lanjut ke Bab 5-6 (persiapan & struktur)
3. Praktikkan Bab 8 (workflow)
4. Rujuk Bab 16-17 (tips & kesalahan)

**Untuk Developer yang Ingin Paham System Design:**
1. Baca Bab 20 (System Design Architecture)
2. Baca Bab 21 (Agentic Patterns)
3. Baca Bab 22 (Production-Ready)
4. Baca Bab 23 (Vibe Engineering)

**Untuk yang Ingin Langsung Praktik:**
1. Baca Bab 5 (Persiapan)
2. Ikuti Bab 6 (Buat folder scaffold)
3. Ikuti Bab 8 (Workflow 6 tahap)
4. Gunakan Bab 11 (Template prompt)

---

**📅 Terakhir diperbarui:** Agustus 2026  
**✍️ Disusun dari:** 12 sumber utama  
**🎯 Tujuan:** Materi pembelajaran ultra-detail untuk membangun perangkat lunak dengan AI secara terstruktur dan profesional
