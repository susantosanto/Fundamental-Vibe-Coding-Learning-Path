# 10 — Ringkasan Fase 2: AI Tools & Vibe Coding Dasar

> **Estimasi:** 1.5 jam | **Level:** Semua
> **Sumber:** [`feiskyer/claude-code-settings`](https://github.com/feiskyer/claude-code-settings) + [`awattar/claude-code-best-practices`](https://github.com/awattar/claude-code-best-practices)

---

## 📖 RINGKASAN KESELURUHAN

Fase 2 adalah fondasi untuk menjadi **vibe coder** yang efektif — seseorang yang bisa menggunakan AI coding tools untuk menyelesaikan tugas pemrograman dengan cepat, akurat, dan konsisten. Fase ini mencakup 10 topik yang saling terhubung, membentuk **skill stack** lengkap untuk bekerja dengan AI di terminal.

Berikut adalah ringkasan mendalam dari setiap topik yang telah dipelajari:

---

## 🗂️ RINGKASAN PER TOPIK

### 1. Apa itu Claude Code? (01-apa-itu-claude-code.md)

**Intisari:** Claude Code adalah **agentic coding assistant** dari Anthropic yang bekerja di terminal. Berbeda dari AI coding tradisional (autocomplete), Claude Code bisa bekerja secara mandiri — membaca file, menulis kode, menjalankan terminal, testing, debugging, dan commit ke Git.

**Konsep Kunci:**
- **Agentic by Design** — Claude bisa merencanakan, menulis, menguji, dan memperbaiki kode secara otonom
- **Context-Aware** — Menggunakan `CLAUDE.md` sebagai "otak" proyek untuk memahami konteks
- **Multi-File Editing** — Edit banyak file sekaligus dengan search-and-replace yang presisi
- **Terminal Integration** — Akses penuh ke shell, git, dan system commands
- **Skill System** — Extendable dengan kemampuan baru via skills
- **Permission Model** — Granular control untuk keamanan

**Arsitektur Internal:**
- **Context Window** (200.000 token) — Ruang kerja Claude
- **Tool Calling System** — Mekanisme Claude berinteraksi dengan dunia nyata
- **Agentic Loop** — Siklus: Receive → Analyze → Plan → Execute → Verify → Iterate → Report
- **REPL** — Read-Eval-Print Loop untuk iterasi cepat

**Perbandingan dengan Tools Lain:**
| Tool | Interface | Agentic | Multi-file | Harga |
|---|---|---|---|---|
| Claude Code | Terminal | ✅ Full | ✅ Native | $20/bln |
| Cursor | VS Code Fork | ⚠️ Semi | ✅ Composer | $20/bln |
| GitHub Copilot | IDE Plugin | ❌ | ❌ | $10/bln |
| Windsurf | IDE Khusus | ✅ Cascade | ✅ | $15/bln |
| Devin | Web Dashboard | ✅ Full | ✅ | $50/bln |
| Aider | Terminal | ✅ Full | ✅ | Gratis (BYO key) |

**Keputusan:** Gunakan Claude Code jika nyaman di terminal dan butuh agentic workflow. Gunakan Cursor jika prefer GUI. Gunakan Copilot jika hanya butuh autocomplete.

---

### 2. Setup & Konfigurasi (02-setup-dan-konfigurasi.md)

**Intisari:** Setup Claude Code melibatkan instalasi, login, inisialisasi proyek, dan konfigurasi settings.

**Langkah Setup:**
```bash
# 1. Install
npm install -g @anthropic-ai/claude-code

# 2. Login
claude login

# 3. Inisialisasi di project
cd project-anda
claude init

# 4. Konfigurasi settings
# ~/.claude/settings.json atau .claude/settings.json
```

**Model Provider Options:**
| Provider | Setup | Cocok untuk |
|---|---|---|
| Claude.ai (default) | `claude login` | Langsung pakai |
| GitHub Copilot | Via LiteLLM proxy | Punya subscription Copilot |
| Vertex AI | Via Google Cloud | Enterprise Google |
| DeepSeek | Via API key | Alternatif murah |

**Konfigurasi Penting:**
```json
{
  "model": "claude-sonnet-4-20250515",
  "maxTokens": 64000,
  "theme": "dark",
  "autoApprove": ["ls", "cat", "git status"]
}
```

**Repo feiskyer/claude-code-settings** menyediakan konfigurasi siap pakai:
```bash
# Install dari marketplace
/plugin marketplace add feiskyer/claude-code-settings

# Install skill inti
/plugin install spec-kit-skill
/plugin install autonomous-skill
/plugin install command-creator
```

---

### 3. CLAUDE.md — Konteks Proyek (03-claude-md-konteks-proyek.md)

**Intisari:** `CLAUDE.md` adalah file markdown yang berfungsi sebagai **"otak konteks"** untuk Claude Code. File ini memberi tahu AI tentang aturan coding, tech stack, struktur folder, preferensi developer, dan batasan proyek.

**Hierarki Lokasi (prioritas tertinggi ke terendah):**
1. `.claude/CLAUDE.md` — Sub-proyek spesifik
2. `CLAUDE.md` (project root) — Seluruh proyek
3. `~/.config/opencode/CLAUDE.md` — User-wide
4. `~/.claude/CLAUDE.md` — User-wide (alternatif)

**Struktur CLAUDE.md yang Baik:**
```markdown
# Nama Proyek — Deskripsi Singkat
> Tech Stack: Python 3.12 | FastAPI | PostgreSQL

## Tech Stack (dengan versi spesifik)
## Struktur Folder (dengan deskripsi per folder)
## Coding Conventions (naming, style, function rules, error handling)
## Commands (dev, test, lint, db, docker)
## Don't (batasan spesifik proyek)
## Git Workflow (branch strategy, commit format)
```

**Advanced Patterns:**
- **Conditional Instructions** — Aturan berbeda untuk situasi berbeda
- **Role-Based Rules** — Behavior berbeda berdasarkan peran (Developer, Reviewer, Debugger)
- **Tech-Stack Specific Guidelines** — Aturan khusus untuk framework tertentu
- **Architecture Rules** — Layer dependencies, dependency injection

**Common Mistakes:**
1. Terlalu umum/generic → Tidak ada informasi spesifik
2. Terlalu panjang/overwhelming → Claude ignore bagian penting
3. Tidak update seiring proyek berkembang → Informasi outdated
4. Kontradiksi antar section → Claude bingung mana yang diikuti
5. Tidak ada "Don't" section → Claude tidak tahu batasan
6. Command tidak lengkap → Claude menebak command yang salah

**CLAUDE.md vs AGENTS.md vs .cursorrules vs .windsurfrules:**
| Fitur | CLAUDE.md | AGENTS.md | .cursorrules | .windsurfrules |
|---|---|---|---|---|
| AI Tool | Claude Code | OpenCode | Cursor | Windsurf |
| Priority | Root > .claude/ > Home | Home > Project | Project only | Project only |
| Custom Commands | `.claude/commands/` | Skills system | No | No |

**Context Injection:** Gunakan `@file`, `@folder`, atau inline context untuk memberikan konteks tambahan ke Claude.

---

### 4. Skills Dasar (04-skills-dasar.md)

**Intisari:** **Skills** adalah reusable capabilities yang mengajarkan Claude cara menyelesaikan tugas tertentu. Skills bisa di-invoke via `/skill-name` atau trigger otomatis.

**Cara Install:**
```bash
/plugin marketplace add feiskyer/claude-code-settings
/plugin install spec-kit-skill
/plugin install autonomous-skill
/plugin install command-creator
```

**Skills Penting:**
| Skill | Fungsi | Trigger |
|---|---|---|
| **spec-kit-skill** | Constitution-based development | `/spec-kit`, `/specify` |
| **autonomous-skill** | Long-running task automation | Dual-agent pattern |
| **command-creator** | Buat custom slash commands | `/command-create` |
| **kiro-skill** | Interactive feature development | `/kiro` |
| **reflection** | Analyze sessions & improve CLAUDE.md | `/reflection` |

**Cara Kerja Skills:**
```
User: "Saya mau buat fitur authentication dengan Kiro"
                    ↓
Claude detect trigger → load kiro-skill
                    ↓
Skill memberikan workflow langkah-langkah:
1. Requirements → user stories
2. Design → arsitektur
3. Tasks → step implementasi
4. Execute → implementasi
                    ↓
Claude ikuti workflow dan hasilkan output
```

---

### 5. Custom Slash Commands (05-custom-slash-commands.md)

**Intisari:** **Slash commands** (dimulai dengan `/`) adalah shortcut untuk tugas yang sering dilakukan.

**Commands dari awattar/claude-code-best-practices:**

**Git & Version Control:**
| Command | Fungsi |
|---|---|
| `/commit` | Buat conventional commit dengan analisis diff |
| `/issue` | Fix GitHub issue end-to-end |
| `/reviewpr` | Review pull request komprehensif |

**Testing:**
| Command | Fungsi |
|---|---|
| `/test` | Run test, improve coverage, fix failures |

**Project:**
| Command | Fungsi |
|---|---|
| `/custom-init` | Generate CLAUDE.md otomatis |
| `/help-commands` | Dokumentasi semua commands |

**Contoh Penggunaan `/commit`:**
```bash
/commit "Menambahkan fitur absensi guru"

# Claude akan:
# 1. Analisis perubahan yang di-stage
# 2. Rekomendasi commit message
# 3. Buat commit dengan format conventional
# Output: feat: menambahkan fitur absensi guru
```

---

### 6. Specialized AI Agents (06-spesialis-ai-agents.md)

**Intisari:** **Sub-agents** adalah AI specialist dengan expertise domain-specific. Mereka bekerja otomatis untuk memberikan hasil yang lebih baik.

**Agents Tersedia:**
| Agent | Keahlian | Kapan Digunakan |
|---|---|---|
| **general-solution-architect** | Arsitektur, tech stack, scalability | Desain sistem baru |
| **general-fullstack-developer** | End-to-end feature implementation | Build fitur baru |
| **general-backend-developer** | API, database, server logic | Kerja backend |
| **general-frontend-developer** | UI/UX, component patterns | Kerja frontend |
| **general-qa** | Testing, validation | Testing |
| **general-code-quality-debugger** | Code review, debugging | Debug/fix bug |
| **general-technical-writer** | Dokumentasi, API docs | Buat dokumentasi |
| **general-technical-project-lead** | Security, architecture leadership | Keputusan teknis besar |

**Cara Kerja Agents:**
```
/issue "Tambah fitur login"
        ↓
Claude panggil agents yang relevan:
→ general-solution-architect   → desain arsitektur
→ general-backend-developer    → implementasi API
→ general-frontend-developer   → buat halaman login
→ general-qa                   → generate test
→ general-code-quality-debugger→ review kode
        ↓
Output: fitur login lengkap dengan test
```

---

### 7. Hooks & Otomasi (07-hooks-otomasi.md)

**Intisari:** **Hooks** adalah shell commands yang dijalankan otomatis saat event tertentu terjadi di Claude Code.

**Trigger Otomatis:**
| Event | Hook | Kegunaan |
|---|---|---|
| Sebelum AI proses | `pre-request` | Logging, validasi |
| Setelah AI selesai | `post-request` | Run test, lint |
| Sebelum commit | `pre-commit` | Cek kualitas kode |
| Setelah commit | `post-commit` | Deploy, notify |

**Contoh Hooks:**
```bash
# .claude/hooks/post-commit.sh
#!/bin/bash
echo "Commit berhasil! Menjalankan test..."
pytest tests/

# .claude/hooks/pre-request.sh
#!/bin/bash
echo "Request AI dimulai pada $(date)" >> /var/log/claude.log
```

**Utility Scripts dari feiskyer/claude-code-settings:**
```bash
# Update semua plugin sekaligus
bash ~/.claude/scripts/update-cc-plugins.sh
```

---

### 8. Git Workflow dengan AI (08-git-workflow-dengan-ai.md)

**Intisari:** Claude Code bisa handle Git operations secara otomatis — commit, branch, issue resolution, dan PR creation.

**Commit dengan `/commit`:**
```bash
git add .
/commit "Menambahkan fitur absensi"

# Claude akan:
# 1. Analisis diff perubahan
# 2. Group perubahan logical
# 3. Buat commit message deskriptif
# 4. Commit dengan format conventional
```

**Issue Resolution dengan `/issue`:**
```bash
/issue "Halaman login lambat saat banyak user"

# Claude akan:
# 1. Analisis issue
# 2. Buat branch baru
# 3. Implementasi fix
# 4. Buat PR
```

**Best Practices Git + AI:**
| Praktik | Alasan |
|---|---|
| Commit per logical change | Mudah di-review dan di-rollback |
| Review diff sebelum commit | Pastikan AI tidak buat perubahan tidak diinginkan |
| Branch untuk eksperimen | Isolasi percobaan dari kode stabil |
| Commit message deskriptif | Memudahkan tracking perubahan |

---

### 9. Testing & Debugging dengan AI (09-testing-debugging-ai.md)

**Intisari:** Testing dan debugging adalah **safety net** yang memastikan kode yang AI tulis benar-benar berfungsi sesuai harapan.

**Testing Pyramid:**
```
         /\
        / E2E \          ← Paling lambat, paling mahal
       / Test  \
      /---------\
     / Integration  \    ← Medium speed, medium cost
    /     Test       \
   /------------------\
  /     Unit Test      \  ← Paling cepat, paling murah
 /______________________\
```

**AI-Assisted Testing:**
- **Unit Test Generation** — AI generate test cases komprehensif
- **TDD dengan AI** — Red-Green-Refactor cycle dengan bantuan AI
- **Integration Testing** — Test interaksi antar komponen
- **Coverage Improvement** — AI identify untested code dan generate test
- **Test-Driven Refactoring** — Refactor dengan confidence karena test catch regression

**Debugging dengan AI:**
- **Error Analysis** — AI analisis error message dan suggest fix
- **Stack Trace Interpretation** — AI baca stack trace dari bawah ke atas
- **Root Cause Finding** — AI temukan penyebab, bukan hanya gejala
- **Debugging Strategies** — Binary search, rubber duck, logging
- **Common Patterns** — Off-by-one, mutable default, race condition, SQL injection, floating point

**Test Automation Setup:**
- pytest/Jest configuration
- GitHub Actions CI/CD pipeline
- Coverage thresholds
- Auto-run tests via hooks

---

## 🔗 PETA PENGETAHUAN TERKONEKSI

Berikut adalah bagaimana semua topik di Fase 2 saling terhubung:

```
┌─────────────────────────────────────────────────────────────────┐
│                    FASE 2: AI TOOLS DASAR                        │
│                                                                  │
│  ┌──────────────┐                                               │
│  │ 01 Claude    │ ←── Fondasi: Apa itu AI coding agent?         │
│  │    Code      │                                               │
│  └──────┬───────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐     ┌──────────────────┐                      │
│  │ 02 Setup &   │────▶│ 03 CLAUDE.md     │ ←── Konteks proyek  │
│  │    Konfigurasi│     │    Konteks       │     yang dibaca AI  │
│  └──────┬───────┘     └────────┬─────────┘                      │
│         │                      │                                │
│         ▼                      ▼                                │
│  ┌──────────────┐     ┌──────────────────┐                      │
│  │ 04 Skills    │────▶│ 05 Custom Slash  │ ←── Shortcut tugas  │
│  │    Dasar     │     │    Commands      │     berulang         │
│  └──────┬───────┘     └────────┬─────────┘                      │
│         │                      │                                │
│         ▼                      ▼                                │
│  ┌──────────────┐     ┌──────────────────┐                      │
│  │ 06 Specialized│    │ 07 Hooks &       │ ←── Otomasi event   │
│  │    AI Agents  │    │    Otomasi       │     berbasis trigger│
│  └──────┬───────┘     └────────┬─────────┘                      │
│         │                      │                                │
│         ▼                      ▼                                │
│  ┌──────────────┐     ┌──────────────────┐                      │
│  │ 08 Git       │────▶│ 09 Testing &     │ ←── Quality         │
│  │    Workflow  │     │    Debugging     │     assurance       │
│  └──────┬───────┘     └────────┬─────────┘                      │
│         │                      │                                │
│         └──────────┬───────────┘                                │
│                    ▼                                            │
│           ┌──────────────────┐                                  │
│           │ 10 Ringkasan     │ ←── Konsolidasi semua knowledge  │
│           │    Fase 2        │                                  │
│           └──────────────────┘                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Hubungan Antar Topik:**

1. **Claude Code (01) → Setup (02)** — Paham apa itu Claude Code sebelum install
2. **Setup (02) → CLAUDE.md (03)** — Setelah install, buat konteks proyek
3. **CLAUDE.md (03) → Skills (04)** — Skills membaca CLAUDE.md untuk konteks
4. **Skills (04) → Slash Commands (05)** — Skills bisa expose slash commands
5. **Slash Commands (05) → Agents (06)** — Commands bisa trigger agents
6. **Agents (06) → Hooks (07)** — Agents bisa dipanggil via hooks
7. **Hooks (07) → Git Workflow (08)** — Hooks bisa auto-commit, auto-test
8. **Git Workflow (08) → Testing (09)** — Commit yang baik butuh test yang baik
9. **Semua (01-09) → Ringkasan (10)** — Konsolidasi pengetahuan

---

## 📝 SELF-ASSESSMENT QUIZ (20 Pertanyaan)

### Bagian A: Claude Code & Setup (Pertanyaan 1-4)

**Q1: Apa perbedaan utama antara Claude Code dan GitHub Copilot?**
<details>
<summary>Jawaban</summary>

Claude Code adalah **agentic** — bisa bekerja secara mandiri (membaca file, menulis kode, menjalankan terminal, commit ke Git). GitHub Copilot adalah **autocomplete** — hanya memberikan saran kode saat Anda mengetik, tidak bisa menjalankan terminal atau edit multi-file secara otonom.
</details>

**Q2: Di mana Claude Code menyimpan konfigurasi global?**
<details>
<summary>Jawaban</summary>

Konfigurasi global disimpan di `~/.claude/settings.json`. Konfigurasi per-proyek disimpan di `.claude/settings.json` di root project.
</details>

**Q3: Apa itu "agentic loop" dalam Claude Code?**
<details>
<summary>Jawaban</summary>

Agentic loop adalah siklus kerja Claude Code: Receive Task → Analyze Context → Plan → Execute → Verify → Iterate → Report. Loop ini terus berjalan sampai task selesai atau user intervensi.
</details>

**Q4: Berapa ukuran context window Claude Sonnet 4?**
<details>
<summary>Jawaban</summary>

Hingga 200.000 token. Context window dibagi antara system prompt, project context (CLAUDE.md), file contents, conversation history, dan tool results.
</details>

### Bagian B: CLAUDE.md & Context (Pertanyaan 5-8)

**Q5: Jika ada konflik antara CLAUDE.md di project root dan .claude/CLAUDE.md, mana yang diikuti?**
<details>
<summary>Jawaban</summary>

`.claude/CLAUDE.md` (prioritas 1, tertinggi) akan diikuti. Hierarki prioritas: `.claude/CLAUDE.md` > `CLAUDE.md` (root) > `~/.config/opencode/CLAUDE.md` > `~/.claude/CLAUDE.md`.
</details>

**Q6: Sebutkan 6 section utama yang harus ada di CLAUDE.md yang baik!**
<details>
<summary>Jawaban</summary>

1. Header/Project Overview
2. Tech Stack (dengan versi)
3. Struktur Folder (dengan deskripsi)
4. Coding Conventions
5. Commands (dev, test, lint)
6. Don't (batasan proyek)
</details>

**Q7: Apa itu "context injection" dan bagaimana cara melakukannya?**
<details>
<summary>Jawaban</summary>

Context injection adalah cara memberikan konteks tambahan ke Claude secara dinamis. Caranya:
- `@file` — reference file spesifik
- `@folder` — reference seluruh folder
- Inline context — paste konteks langsung di prompt
- Multi-file reference — reference beberapa file sekaligus
</details>

**Q8: Mengapa CLAUDE.md tidak boleh terlalu panjang (500+ baris)?**
<details>
<summary>Jawaban</summary>

Karena: (1) Memakan context window yang berharga, (2) Claude mungkin ignore bagian penting karena terlalu banyak noise, (3) Lebih sulit di-maintain. Keep di bawah 200 baris untuk project kecil.
</details>

### Bagian C: Skills, Commands & Agents (Pertanyaan 9-12)

**Q9: Apa itu skills dan bagaimana cara install?**
<details>
<summary>Jawaban</summary>

Skills adalah reusable capabilities yang mengajarkan Claude cara menyelesaikan tugas tertentu. Install via: `/plugin marketplace add feiskyer/claude-code-settings` atau `/plugin install nama-skill`.
</details>

**Q10: Apa yang dilakukan command `/commit`?**
<details>
<summary>Jawaban</summary>

`/commit` menganalisis diff perubahan yang di-stage, mengelompokkan perubahan secara logical, membuat commit message deskriptif, dan commit dengan format Conventional Commits.
</details>

**Q11: Kapan harus menggunakan `general-solution-architect` agent?**
<details>
<summary>Jawaban</summary>

Saat mendesain sistem baru — memilih tech stack, merancang arsitektur, mempertimbangkan scalability, dan membuat keputusan teknis besar.
</details>

**Q12: Apa perbedaan antara skills dan agents?**
<details>
<summary>Jawaban</summary>

**Skills** adalah paket instruksi/workflow yang di-load ke Claude untuk tugas spesifik (misal: spec-driven development). **Agents** adalah AI specialist dengan expertise domain-specific yang dipanggil otomatis untuk memberikan hasil lebih baik (misal: architect untuk desain sistem). Skills lebih seperti "buku panduan", agents lebih seperti "konsultan spesialis".
</details>

### Bagian D: Hooks, Git & Testing (Pertanyaan 13-16)

**Q13: Apa itu hooks dan berikan 2 contoh penggunaan!**
<details>
<summary>Jawaban</summary>

Hooks adalah shell commands yang dijalankan otomatis saat event tertentu terjadi. Contoh:
1. `post-commit` hook → jalankan test setelah commit
2. `pre-request` hook → logging sebelum setiap request AI
</details>

**Q14: Apa format Conventional Commits?**
<details>
<summary>Jawaban</summary>

```
type(scope): description

[optional body]

Types: feat, fix, docs, style, refactor, test, chore, perf
Contoh: feat(auth): add JWT token refresh endpoint
```
</details>

**Q15: Jelaskan siklus TDD (Red-Green-Refactor)!**
<details>
<summary>Jawaban</summary>

1. **RED** — Tulis test yang FAIL (karena kode belum ada)
2. **GREEN** — Tulis kode MINIMAL agar test PASS
3. **REFACTOR** — Perbaiki kode tanpa mengubah behavior (test tetap pass)
Ulangi untuk fitur berikutnya.
</details>

**Q16: Berapa target minimal test coverage yang direkomendasikan?**
<details>
<summary>Jawaban</summary>

Minimal 80%. Ini berarti 80% dari kode harus "disentuh" oleh test. Bisa dicek dengan `pytest --cov=src --cov-report=term-missing`.
</details>

### Bagian E: Debugging & Best Practices (Pertanyaan 17-20)

**Q17: Apa itu "rubber duck debugging" dan bagaimana AI membuatnya lebih efektif?**
<details>
<summary>Jawaban</summary>

Rubber duck debugging adalah teknik menjelaskan kode baris per baris kepada sesuatu (karet bebek) untuk menemukan bug. AI membuatnya lebih efektif karena AI bisa **bertanya balik**, **memberikan insight**, dan **mengidentifikasi pola** yang mungkin terlewat oleh manusia.
</details>

**Q18: Sebutkan 3 common debugging patterns yang sering muncul!**
<details>
<summary>Jawaban</summary>

1. **Off-by-One Error** — Loop berhenti 1 iterasi terlalu awal/akhir
2. **Mutable Default Argument** — Default argument mutable yang shared across calls
3. **Race Condition** — Check-then-act di environment concurrent
4. **SQL Injection** — String concatenation di SQL query
5. **Floating Point Comparison** — Membandingkan float dengan `==`
</details>

**Q19: Apa 5 prinsip "Vibe Coding yang Benar"?**
<details>
<summary>Jawaban</summary>

1. **Start Small** — Generate 1 endpoint dulu, validate, baru scale
2. **Context is King** — Selalu update CLAUDE.md dengan konteks proyek
3. **Human-in-the-Loop** — Review diff sebelum commit, jangan auto-approve
4. **Test First** — Minta AI generate test cases sebelum implementasi
5. **Version Control** — Commit per logical change, branch untuk eksperimen
</details>

**Q20: Checklist apa yang harus dipenuhi sebelum lanjut ke Fase 3?**
<details>
<summary>Jawaban</summary>

- [ ] Claude Code terinstall dan berfungsi
- [ ] Bisa membuat CLAUDE.md yang baik
- [ ] Paham cara prompt yang efektif
- [ ] Bisa menggunakan minimal 3 slash commands
- [ ] Paham workflow Git dengan AI
- [ ] Bisa generate unit test dengan AI
- [ ] Paham cara debugging error dengan AI
</details>

---

## ✅ CHECKLIST KESIAPAN FASE 3

### Kompetensi Teknis
- [ ] Claude Code terinstall dan bisa digunakan di terminal
- [ ] Bisa login dan menjalankan session Claude Code
- [ ] Paham cara memilih model yang tepat (Haiku/Sonnet/Opus)
- [ ] Mengerti permission model dan bisa configure auto-approve

### Konteks & Prompting
- [ ] Bisa membuat CLAUDE.md yang baik untuk proyek sendiri
- [ ] Paham hierarki prioritas CLAUDE.md
- [ ] Bisa menggunakan `@file` dan `@folder` untuk context injection
- [ ] Paham cara menulis prompt yang efektif dan spesifik

### Skills & Automation
- [ ] Bisa install dan menggunakan skills dari marketplace
- [ ] Paham cara menggunakan minimal 3 slash commands
- [ ] Mengerti konsep sub-agents dan kapan menggunakannya
- [ ] Bisa membuat hooks sederhana untuk otomasi

### Git & Quality
- [ ] Bisa menggunakan `/commit` untuk conventional commits
- [ ] Paham cara review diff sebelum commit
- [ ] Bisa generate unit test dengan AI
- [ ] Paham konsep TDD (Red-Green-Refactor)
- [ ] Bisa debugging error dengan bantuan AI
- [ ] Paham cara membaca stack trace

### Workflow
- [ ] Bisa menggunakan Claude Code untuk task sehari-hari
- [ ] Paham kapan harus intervensi dan kapan membiarkan AI bekerja
- [ ] Bisa manage context window (compact, clear)
- [ ] Paham best practices vibe coding

---

## 📚 RECOMMENDED FURTHER READING

### Dokumentasi Resmi
1. [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code/overview) — Panduan lengkap dari Anthropic
2. [Anthropic API Documentation](https://docs.anthropic.com/en/api/getting-started) — API reference
3. [Claude Model Cards](https://docs.anthropic.com/en/docs/about-claude/models) — Perbandingan model

### Komunitas & Best Practices
4. [`feiskyer/claude-code-settings`](https://github.com/feiskyer/claude-code-settings) — Konfigurasi dan plugin komunitas
5. [`awattar/claude-code-best-practices`](https://github.com/awattar/claude-code-best-practices) — Best practices dan custom commands
6. [Anthropic Discord](https://www.anthropic.com/discord) — Komunitas resmi
7. [GitHub Discussions](https://github.com/anthropics/claude-code/discussions) — Forum diskusi

### Testing & Debugging
8. [pytest Documentation](https://docs.pytest.org/) — Testing framework Python
9. [Jest Documentation](https://jestjs.io/) — Testing framework JavaScript
10. [The Art of Debugging](https://www.jetbrains.com/guide/techniques/debugging/) — JetBrains guide

### Vibe Coding & AI Engineering
11. [Cursor Documentation](https://docs.cursor.com/) — AI IDE alternatif
12. [Aider Documentation](https://aider.chat/) — CLI tool open-source
13. [Google Labs DESIGN.md](https://github.com/google-labs/design.md) — Design system untuk coding agents

### Konteks Indonesia
14. [Dapodik Documentation](https://dapo.kemdikbud.go.id/) — Data Pokok Pendidikan
15. [ARKAS Documentation](https://arkas.kemdikbud.go.id/) — Aplikasi Rencana Kegiatan dan Anggaran Sekolah
16. [BOS Online](https://bos.kemdikbud.go.id/) — Sistem Bantuan Operasional Sekolah

---

## 💡 PRACTICAL PROJECT IDEAS

Berikut adalah proyek-proyek praktis untuk melatih skill Fase 2:

### Proyek 1: Script Absensi Otomatis (Beginner)
**Skill yang dilatih:** CLAUDE.md, prompt engineering, testing

**Deskripsi:** Buat script Python untuk rekap absensi harian guru.
- Input: file CSV dengan kolom tanggal, nama_guru, status
- Output: laporan rekap per bulan dalam format Excel
- Fitur: hitung persentase kehadiran, sort by nama, export PDF

**Langkah:**
1. Buat CLAUDE.md untuk proyek
2. Minta AI generate test cases dulu (TDD)
3. Implementasi fitur satu per satu
4. Setup GitHub Actions untuk CI testing
5. Commit dengan `/commit`

### Proyek 2: Template Generator Surat Sekolah (Beginner)
**Skill yang dilatih:** Skills, slash commands, file operations

**Deskripsi:** Buat generator surat resmi sekolah menggunakan Python.
- Template: surat keterangan siswa, surat pindah, surat tugas guru
- Input: data dari file JSON
- Output: file .docx dengan format surat resmi

**Langkah:**
1. Install skills yang relevan
2. Buat custom slash command `/generate-surat`
3. Implementasi dengan AI
4. Test dengan berbagai input

### Proyek 3: Dashboard Keuangan BOS Sederhana (Intermediate)
**Skill yang dilatih:** Multi-file editing, agents, hooks

**Deskripsi:** Buat web dashboard untuk monitoring keuangan BOS.
- Tech stack: Flask + SQLite + HTML/CSS/JS
- Fitur: CRUD transaksi, grafik distribusi, export laporan
- Kategori: operasional, pengembangan, kesiswaan

**Langkah:**
1. Gunakan `general-solution-architect` untuk desain arsitektur
2. `general-backend-developer` untuk implementasi API
3. `general-frontend-developer` untuk UI
4. `general-qa` untuk generate test
5. Setup post-commit hook untuk auto-test

### Proyek 4: Script Download Data Dapodik (Intermediate)
**Skill yang dilatih:** Error handling, debugging, retry logic

**Deskripsi:** Buat script untuk download data peserta didik dari Dapodik.
- Fitur: retry otomatis, rate limiting, progress bar, logging
- Output: file Excel dengan data lengkap PD

**Langkah:**
1. Implementasi basic download
2. Tambahkan retry logic dengan tenacity
3. Tambahkan error handling dan logging
4. Debug connection issues dengan AI
5. Test dengan mock server

### Proyek 5: CLI Database Sekolah (Advanced)
**Skill yang dilatih:** Full workflow Fase 2

**Deskripsi:** Buat CLI tool untuk manajemen data sekolah offline.
- Tech stack: Python + SQLite + Click CLI + Rich
- Fitur: CRUD siswa/guru, laporan, backup/restore

**Langkah:**
1. Buat CLAUDE.md yang komprehensif
2. Install dan configure skills
3. Buat custom slash commands
4. Setup hooks untuk auto-test
5. Git workflow dengan `/commit` dan `/issue`
6. Full test coverage (unit + integration)
7. CI/CD dengan GitHub Actions

---

## 🎯 TRANSISI KE FASE 3

Fase 3 akan membahas **Advanced Workflows** — teknik-teknik yang lebih sophisticated untuk memaksimalkan produktivitas dengan AI. Berikut adalah preview topik yang akan dipelajari:

### Apa yang Akan Dipelajari di Fase 3:
1. **Multi-Agent Workflows** — Koordinasi beberapa agents untuk task kompleks
2. **Spec-Driven Development** — Development berdasarkan spesifikasi formal
3. **Advanced Prompt Engineering** — Teknik prompt yang lebih sophisticated
4. **Custom Plugin Development** — Membuat plugin dan skills sendiri
5. **Enterprise Integration** — Integrasi dengan sistem enterprise
6. **Performance Optimization** — Optimasi token usage dan response time

### Persiapan yang Diperlukan:
- Semua checklist Fase 2 harus terpenuhi
- Minimal 1 proyek praktis dari daftar di atas sudah selesai
- Paham konsep dasar yang dibahas di Fase 2
- Siap untuk belajar teknik yang lebih advanced

---

## 📊 METRIK KEBERHASILAN FASE 2

Gunakan metrik berikut untuk mengukur kemajuan Anda:

| Metrik | Target | Cara Ukur |
|---|---|---|
| **Claude Code Usage** | 5+ sesi/minggu | Hitung session di terminal |
| **CLAUDE.md Quality** | Lengkap 6 section | Review file CLAUDE.md |
| **Slash Commands** | 3+ commands digunakan | Catatan usage |
| **Test Coverage** | 80%+ di proyek | `pytest --cov=src` |
| **Commit Quality** | Conventional Commits | `git log --oneline` |
| **Debugging Speed** | Fix bug < 30 menit | Track waktu debugging |
| **Prompt Efficiency** | 1-2 prompt per task | Hitung prompt per task |

---

## 🏁 PENUTUP

Selamat! Anda telah menyelesaikan **Fase 2: AI Tools & Vibe Coding Dasar**. Anda sekarang memiliki fondasi yang kuat untuk:

1. **Setup dan configure** Claude Code dengan benar
2. **Membuat konteks proyek** yang efektif dengan CLAUDE.md
3. **Menggunakan skills dan agents** untuk workflow otomatis
4. **Integrasi Git** untuk version control dengan AI
5. **Testing dan debugging** kode yang dihasilkan AI

Ingat prinsip utama vibe coding:
> **"AI menulis kode, Anda mengarahkan AI. Kualitas output bergantung pada kualitas input."**

Fase 3 akan membawa Anda ke level berikutnya — advanced workflows yang memungkinkan Anda menangani proyek yang lebih besar dan kompleks dengan AI.

---

> **Lanjut ke:** [`../fase-3-advanced-workflows/00-panduan-fase.md`](../fase-3-advanced-workflows/00-panduan-fase.md)
