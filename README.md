# 🎓 Fundamental Vibe Coding — Learning Path

> **Arsitektur Dulu, AI Kemudian.** Pondasi kuat untuk menjadi Software Engineer yang bisa mendesain sistem dengan benar, lalu menggunakan AI untuk membangunnya dengan cepat.

---

## 📋 Profil Belajar Anda

| Item | Detail |
| --- | --- |
| **Level Saat Ini** | Pemula (sudah paham dasar coding) |
| **Target** | Software Engineer yang bisa desain arsitektur + pakai AI tools secara efektif |
| **Waktu** | 1 jam/hari |
| **Gaya Belajar** | Praktik sambil teori mendalam |
| **Goal** | Bangun aplikasi sekolah, karir engineer, freelance/bisnis |

---

## 🗺️ Peta Perjalanan Belajar

```
┌─────────────────────────────────────────────────────────────┐
│  FASE 1: ARSITEKTUR & DESAIN APLIKASI (Minggu 1-6)         │
│  "Sebelum minta AI membangun, tahu dulu apa yang dibangun"  │
│  Sumber: system-design-primer + awesome-system-design       │
├─────────────────────────────────────────────────────────────┤
│  FASE 2: AI TOOLS & VIBE CODING DASAR (Minggu 7-9)          │
│  "Setup tools, belajar prompting, workflow dasar"           │
│  Sumber: claude-code-settings + claude-code-best-practices  │
├─────────────────────────────────────────────────────────────┤
│  FASE 3: ADVANCED AI WORKFLOWS (Minggu 10-12)               │
│  "Gabungkan arsitektur + AI untuk bangun sistem yang benar" │
│  Sumber: awesome-vibe-coding-guide                          │
├─────────────────────────────────────────────────────────────┤
│  FASE 4: DEEP SYSTEM DESIGN (Minggu 13-16)                  │
│  "Distributed systems, scaling, patterns advanced"          │
│  Sumber: system-design-primer (advanced topics)             │
├─────────────────────────────────────────────────────────────┤
│  FASE 5: SCENARIO PRAKTIS (Minggu 17-19)                    │
│  "Pilih jalur: Content Creator / Programmer / Office"       │
│  Sumber: vbgate/learn-opencode (docs/4-scenarios)           │
├─────────────────────────────────────────────────────────────┤
│  FASE 6: ADVANCED OPENCODE (Reference Manual)               │
│  "Custom Agent, Skill, MCP, IDE, SDK, Plugins"              │
│  Sumber: vbgate/learn-opencode (docs/5-advanced)            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Struktur Folder

```
fundamental-vibe-coding/
│
├── README.md                          ← Anda di sini (peta belajar)
│
├── fase-1-arsitektur-dasar/           ← MULAI DARI SINI
│   ├── 00-panduan-fase.md             ← Cara belajar fase ini
│   ├── 01-apa-itu-system-design.md    ← Konsep dasar
│   ├── 02-performance-vs-scalability.md
│   ├── 03-latency-vs-throughput.md
│   ├── 04-availability-vs-consistency.md
│   ├── 05-konsistensi-data.md
│   ├── 06-availability-patterns.md
│   ├── 07-dns.md
│   ├── 08-cdn.md
│   ├── 09-load-balancer.md
│   ├── 10-reverse-proxy.md
│   ├── 11-application-layer.md
│   ├── 12-database-rdbms.md
│   ├── 13-database-nosql.md
│   ├── 14-cache.md
│   ├── 15-asynchronism.md
│   ├── 16-komunikasi-protokol.md
│   ├── 17-keamanan-sistem.md
│   ├── 18-studi-kasus-pastebin.md
│   ├── 19-studi-kasus-twitter.md
│   ├── 20-studi-kasus-web-crawler.md
│   └── 21-ringkasan-fase-1.md
│
├── fase-2-ai-tools-dasar/
│   ├── 00-panduan-fase.md
│   ├── 01-apa-itu-claude-code.md
│   ├── 02-setup-dan-konfigurasi.md
│   ├── 03-claude-md-konteks-proyek.md
│   ├── 04-skills-dasar.md
│   ├── 05-custom-slash-commands.md
│   ├── 06-spesialis-ai-agents.md
│   ├── 07-hooks-otomasi.md
│   ├── 08-git-workflow-dengan-ai.md
│   ├── 09-testing-debugging-ai.md
│   └── 10-ringkasan-fase-2.md
│
├── fase-3-advanced-workflows/
│   ├── 00-panduan-fase.md
│   ├── 01-vibe-coding-mindset.md
│   ├── 02-setup-planning.md
│   ├── 03-prompting-efektif.md
│   ├── 04-testing-debugging-lanjut.md
│   ├── 05-version-control-deploy.md
│   ├── 06-spesifikasi-driven-dev.md
│   ├── 07-autonomous-agents.md
│   ├── 08-multi-agent-collaboration.md
│   └── 09-ringkasan-fase-3.md
│
├── fase-4-deep-system-design/
│   ├── 00-panduan-fase.md
│   ├── 01-microservices.md
│   ├── 02-service-discovery.md
│   ├── 03-database-sharding.md
│   ├── 04-message-queues.md
│   ├── 05-event-sourcing.md
│   ├── 06-cqrs.md
│   ├── 07-distributed-caching.md
│   ├── 08-arsitektur-twitter.md
│   ├── 09-arsitektur-youtube.md
│   ├── 10-arsitektur-aws-scaling.md
│   └── 11-ringkasan-fase-4.md
│
├── fase-5-scenario-praktis/           ← Pilih jalur sesuai role
│   ├── 00-panduan-fase.md             ← Panduan + pilihan jalur
│   │                                  ← Jalur Programmer:
│   ├── 01-workflow-produksi-konten.md ← A1: Content workflow
│   ├── 02-development-daily.md        ← B1: Developer daily
│   ├── 03-file-management.md          ← C1: Office file mgmt
│   ├── 04-refactoring-testing.md      ← B2: Refactor + test
│   ├── 05-dokumentasi-git.md          ← B3: Docs + Git
│   ├── 06-cicd-integration.md         ← B4: CI/CD
│   └── 07-custom-dev-agents.md        ← B5: Custom agents
│
├── fase-6-advanced-opencode/          ← Reference manual (按需查阅)
│   ├── 00-panduan-fase.md             ← Daftar semua modul
│   ├── 01-konfigurasi-dasar.md        ← opencode.json config
│   ├── 03-agent-quickstart.md         ← Custom Agent
│   ├── 04-agent-design-patterns.md    ← 5 Workflow patterns
│   ├── 07-skill-dasar.md              ← Skill system
│   ├── 10-custom-commands.md          ← Slash commands
│   ├── 14-mcp-dasar.md                ← MCP extension
│   ├── 17-ide-integration.md          ← VS Code / Cursor
│   └── 22-debugging-tools.md          ← Debug & diagnose
│
└── resources/
    ├── glossary.md                    ← Kamus istilah teknis
    ├── cheat-sheet.md                 ← Ringkasan cepat
    └── progress-tracker.md            ← Lacak kemajuan belajar
```

---

## 🚀 Cara Menggunakan Learning Path Ini

### 1. Mulai dari Fase 1
Buka folder `fase-1-arsitektur-dasar/` dan baca file `00-panduan-fase.md` terlebih dahulu.

### 2. Urutan Belajar
Baca file secara berurutan (01 → 02 → 03 → ...). Setiap file dirancang untuk ~1 jam belajar.

### 3. Format Setiap File
Setiap materi memiliki struktur:
- **📖 Teori** — Penjelasan konsep mendalam
- **🎯 Contoh Nyata** — Analogi dan studi kasus
- **💡 Praktik** — Latihan yang bisa dilakukan
- **✅ Checklist** — Poin yang harus dipahami sebelum lanjut
- **🔗 Referensi** — Link ke repo asli untuk eksplorasi lebih lanjut

### 4. Jika Berhenti di Tengah Jalan
- Buka `resources/progress-tracker.md` untuk melihat posisi terakhir
- File bernomor urut memudahkan pencarian (01, 02, 03, ...)
- Setiap fase punya file ringkasan di akhir

### 5. Tips Belajar Efektif
- **Jangan skip teori** — Arsitektur yang kuat = sistem yang baik
- **Catat pertanyaan** — Tulis hal yang belum paham, tanyakan nanti
- **Praktik setiap hari** — 1 jam konsisten > 7 jam sekali seminggu
- **Gunakan AI untuk belajar** — Setelah Fase 2, minta AI jelaskan konsep yang sulit

---

## 📊 Estimasi Waktu

| Fase | Topik | Durasi | Target Selesai |
| --- | --- | --- | --- |
| **Fase 1** | 21 materi arsitektur | ~6 minggu (1 jam/hari) | Minggu ke-6 |
| **Fase 2** | 10 materi AI tools | ~3 minggu | Minggu ke-9 |
| **Fase 3** | 9 materi advanced | ~3 minggu | Minggu ke-12 |
| **Fase 4** | 11 materi deep design | ~4 minggu | Minggu ke-16 |
| **Fase 5** | Scenario praktis (Programmer + Office) | ~3 minggu | Minggu ke-19 |
| **Fase 6** | Advanced OpenCode (reference) | 按需查阅 | Kapan saja |

**Total:** ~19 minggu (5 bulan) untuk menyelesaikan fase 1-5. Fase 6 = reference manual, dibaca saat butuh.

---

## 🎯 Outcome Setelah Selesai

Setelah menyelesaikan learning path ini, Anda akan mampu:

1. **Mendesain arsitektur aplikasi** dari nol dengan pola yang benar
2. **Memahami trade-off** setiap keputusan teknis (SQL vs NoSQL, cache vs no cache, dll)
3. **Menggunakan AI tools** (Claude Code, Cursor, dll) secara efektif
4. **Membuat spesifikasi** yang jelas sebelum meminta AI membangun
5. **Membangun sistem scalable** yang bisa menangani ribuan pengguna
6. **Menerapkan best practices** dalam development workflow
7. **Menerapkan AI ke scenario nyata** - programming (refactor, testing, CI/CD, custom agents) dan office (data processing, automation)
8. **Custom Agent, Skill, Command, MCP** untuk personalized AI workflow
9. **Integrasi IDE** (VS Code, Cursor) dan debugging tools

---

## 📚 Sumber Asli (GitHub Repos)

| Repo | Stars | Fokus |
| --- | --- | --- |
| [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) | ⭐349k | System Design Fundamentals |
| [ashishps1/awesome-system-design-resources](https://github.com/ashishps1/awesome-system-design-resources) | - | Kurasi Resource System Design |
| [feiskyer/claude-code-settings](https://github.com/feiskyer/claude-code-settings) | ⭐1.5k | Claude Code Setup & Skills |
| [awattar/claude-code-best-practices](https://github.com/awattar/claude-code-best-practices) | ⭐151 | Best Practices Claude Code |
| [analyticalrohit/awesome-vibe-coding-guide](https://github.com/analyticalrohit/awesome-vibe-coding-guide) | ⭐340 | Panduan Vibe Coding |
| [vbgate/learn-opencode](https://github.com/vbgate/learn-opencode) | ⭐1.5k | OpenCode 中文实战课 |

---

> **Selamat belajar!** 🚀 Mulai dari `fase-1-arsitektur-dasar/00-panduan-fase.md`
