# 23: AI Coding Agents Advanced Guide

> **Panduan komprehensif 7 pilar AI coding agent — Subagents, Skills, MCP, LSP, Commands, AGENTS.md, Hooks. Referensi video: [AI Coding Agents Advanced Guide](https://www.youtube.com/watch?v=DAaw7Ao_zUc) by pookie. Materi disusun berdasarkan judul & topik video, diperkaya dengan sintesis kurikulum Fase 6.**

**Estimasi**: 30 menit belajar + 60 menit praktik | **Level**: Advanced

## 🎯 Outcome

Setelah menyelesaikan modul ini, kamu akan:
- Memahami evolusi AI coding dari autocomplete hingga autonomous development
- Menguasai arsitektur agent canggih: ReAct, Plan-and-Execute, Reflexion, Tree of Thoughts
- Mampu melakukan multi-agent orchestration dengan role assignment dan conflict resolution
- Memahami agent memory: short-term vs long-term, knowledge graphs, context persistence
- Menguasai agent tool use: selection, chaining, composition, dan creation
- Memahami agent safety: guardrails, permission models, sandboxing, audit logging
- Mampu melakukan agent evaluation: benchmarking, quality metrics, performance measurement
- Bisa melakukan agent customization: domain-specific, personalized, team agents
- Memahami tren dan masa depan AI coding
- Mampu membangun advanced AI coding workflow untuk tim development

---

## 📺 Tentang Video Ini

Video **"AI Coding Agents Advanced Guide"** oleh **pookie** adalah panduan komprehensif yang membahas 7 konsep inti dalam ekosistem AI coding agent modern.

Berbeda dengan tutorial terpisah-pisah, video ini menyajikan **gambaran utuh** bagaimana semua komponen bekerja bersama dalam satu pipeline pengembangan.

### 7 Pilar Utama

```
┌─────────────────────────────────────────────────────┐
│              AI Coding Agent Ecosystem              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Subagents  → Spesialisasi task                  │
│  2. Skills     → Domain expertise reusable          │
│  3. MCP        → Koneksi ke external services       │
│  4. LSP        → Code intelligence & navigation     │
│  5. Commands   → 1-klik shortcut kompleks task      │
│  6. AGENTS.md  → Definisi agent terstruktur         │
│  7. Hooks      → Otomasi event-driven               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Evolusi AI Coding Agent

### Dari Autocomplete hingga Autonomous Development

Evolusi AI dalam coding terjadi dalam beberapa fase:

```
Fase 1: Autocomplete (2021-2022)
├── GitHub Copilot awal
├── Tab-tab-tab coding
├── Line-by-line suggestion
└── Tidak ada context awareness

Fase 2: Context-Aware Completion (2022-2023)
├── Multi-file context
├── Chat-based coding
├── Code explanation
└── Basic refactoring

Fase 3: Agentic Coding (2023-2024)
├── Multi-step task execution
├── Tool use (file, terminal, browser)
├── Self-correction
└── Planning before execution

Fase 4: Autonomous Development (2024-2025)
├── Multi-agent orchestration
├── Long-running tasks (hours)
├── Self-evaluation dan improvement
└── Production-ready output

Fase 5: AI Orchestration (2025+)
├── AI sebagai system architect
├── Human-in-the-loop design
├── Cross-domain integration
└── Autonomous project management
```

### Tiga Role Evolusi Developer

Berdasarkan learning path AI Engineer:

| Role | Fokus | Tools | Output |
|------|-------|-------|--------|
| **Problem Solver** | Prompt engineering, single-shot | Chat interface, basic tools | Code snippets, fixes |
| **System Architect** | Multi-step planning, agent design | Subagents, skills, MCP | Systems, workflows |
| **AI Orchestrator** | Full automation, team coordination | Multi-agent, hooks, evaluation | Production apps |

**Referensi**: [vbgate/learn-opencode](https://github.com/vbgate/learn-opencode) — bagian agent evolution dan advanced patterns.

---

## 1. 🧩 Subagents — Spesialisasi Task

### Konsep Dasar

Subagent adalah **AI personality khusus** yang dirancang untuk satu jenis task tertentu. Mereka seperti "anggota tim" yang masing-masing punya keahlian spesifik.

### Mengapa Subagent?

| Tanpa Subagent | Dengan Subagent |
|---------------|-----------------|
| Satu agent untuk semua task | Tiap task punya spesialis |
| Konteks campur aduk | Setiap agent fokus domainnya |
| Prompt panjang setiap ganti task | Prompt sekali, panggil kapan saja |
| Hasil generic | Hasil tailored per domain |
| Token boros | Token efisien (context terisolasi) |

### Arsitektur Subagent

```
User Request
      │
      ▼
┌──────────────────┐
│   Primary Agent  │ ← Router / Orchestrator
│   (build/plan)   │
└──────┬───────────┘
       │
       ├── @security-auditor    → Cek keamanan
       ├── @performance-review  → Analisis performa
       ├── @docs-writer         → Tulis dokumentasi
       ├── @test-analyzer       → Analisis coverage test
       └── @data-migrator       → Migrasi database
```

### Best Practices dari Video

1. **Satu subagent = satu tanggung jawab**
   - Jangan buat subagent yang bisa banyak hal
   - `@bug-fixer` hanya fix bug, bukan refactor

2. **Deskripsi yang jelas = kunci auto-selection**
   - Primary agent memilih subagent berdasarkan `description`
   - Makin spesifik deskripsi, makin tepat pemilihan

3. **Permission minimal**
   - Subagent hanya perlu akses ke file yang relevan
   - Batasi dengan `permission` field

4. **Chain subagents untuk workflow kompleks**
   - `@security-auditor` → `@bug-fixer` → `@docs-writer`

### Contoh Implementasi Lengkap

```markdown
--- 
description: |
  Ahli security audit: OWASP Top 10, dependency scanning,
  authentication flow review, hardcoded secrets detection.
  Trigger: saat ada PR baru, dependency update, security concern.
  TIDAK untuk: performance optimization, code style review.
mode: subagent
permission:
  edit: deny
  bash:
    "*": deny
    "npm audit*": allow
    "pip audit*": allow
    "git log*": allow
    "git diff*": allow
---

# Security Auditor Agent

Kamu adalah spesialis keamanan kode dengan pengalaman 10+ tahun.

## Checklist Otomatis
1. Scan dependency → `npm audit` atau `pip audit`
2. Cek OWASP Top 10 di kode:
   - Injection (SQL, NoSQL, OS, LDAP)
   - Broken Authentication
   - Sensitive Data Exposure
   - XML External Entities (XXE)
   - Broken Access Control
   - Security Misconfiguration
   - Cross-Site Scripting (XSS)
   - Insecure Deserialization
   - Using Components with Known Vulnerabilities
   - Insufficient Logging & Monitoring
3. Review authentication flow
4. Cek hardcoded secrets (API keys, passwords, tokens)
5. Validasi input handling

## Output Format
- ⚠️ Critical: [Deskripsi masalah + lokasi file + line]
- 🔸 High: [Deskripsi masalah + lokasi file + line]
- 📝 Medium: [Deskripsi masalah + lokasi file + line]
- ✅ OK: [Area yang sudah aman]

## Referensi
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- CWE Top 25: https://cwe.mitre.org/top25/
```

---

## 2. 🎯 Skills — Domain Expertise Reusable

### Konsep

Skill adalah **paket pengetahuan reusable** yang bisa di-load on-demand. Berbeda dengan agent (yang punya "kepribadian"), skill adalah "pengetahuan" murni.

### Skill vs Agent

```
Agent = "Siapa" (personality + capabilities + permissions)
Skill = "Apa"  (knowledge + instructions + patterns)
```

### Progressive Disclosure

Skill menggunakan prinsip **progressive disclosure** — hanya load konten saat relevan:

```
Layer 1: name + description  (~50 token)   → Selalu terlihat di available_skills
Layer 2: SKILL.md            (~500 token)  → Load saat task match
Layer 3: references/         (~2k+ token)  → Load saat detail dibutuhkan
```

Ini menghemat context window secara signifikan.

### Kapan Pakai Skill?

| Skenario | Solusi |
|----------|--------|
| Setiap SQL query butuh filter khusus | Skill `sql-analysis` |
| Perusahaan punya istilah internal | Skill `company-glossary` |
| Coding standards tim | Skill `coding-standards` |
| Prosedur deployment | Skill `deploy-procedure` |
| Format laporan BOS | Skill `bos-report-format` |
| Template surat sekolah | Skill `school-letter-template` |

### Contoh Skill Lengkap

```markdown
---
name: api-patterns
description: |
  Panduan design REST API: versioning, error handling, pagination.
  Menyediakan: response format, status codes, auth patterns.
  Cocok untuk: API design, endpoint review, error handling.
  Tidak cocok: Database design, frontend code.
---

# API Design Patterns

## Response Format
```json
{
  "status": "success|error",
  "data": {},
  "meta": { "page": 1, "total": 100 },
  "error": { "code": "VALIDATION_ERROR", "message": "..." }
}
```

## Pagination
- `page` dan `per_page` sebagai query params
- Default: `per_page=20`, max: `per_page=100`
- Response include `meta.total` dan `meta.pages`

## Error Codes
| HTTP Code | Kode | Keterangan |
|-----------|------|------------|
| 400 | VALIDATION_ERROR | Input tidak valid |
| 401 | UNAUTHORIZED | Belum login |
| 403 | FORBIDDEN | Tidak punya akses |
| 404 | NOT_FOUND | Resource tidak ada |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

## Rate Limiting
- Header: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Default: 100 requests per minute
- Response 429 dengan `Retry-After` header

## Lihat Juga
- `references/auth.md` → Auth flow detail
- `references/pagination.md` → Pagination strategies
- `references/rate-limiting.md` → Rate limiting patterns
```

---

## 3. 🔌 MCP — Model Context Protocol

### Konsep

MCP adalah **standard protocol** untuk menghubungkan AI agent dengan external services. Ibaratnya `USB-C` untuk AI — satu konektor universal.

### Arsitektur MCP

```
AI Agent ──MCP Client──→ MCP Server ──→ External Service
                            │
                            ├── Database (SQLite, PostgreSQL)
                            ├── API (GitHub, Slack, Notion)
                            ├── File System
                            ├── Browser (Puppeteer)
                            ├── Knowledge Graph
                            └── Custom services
```

### Local vs Remote MCP

| Aspek | Local MCP | Remote MCP |
|-------|-----------|------------|
| Koneksi | stdio (proses lokal) | HTTP/SSE |
| Latency | Rendah (<10ms) | Medium (50-500ms) |
| Keamanan | Akses lokal penuh | Terbatas API key |
| Offline | ✅ Bekerja tanpa internet | ❌ Butuh internet |
| Contoh | Filesystem, Git, SQLite | GitHub, Context7, Sentry |

### Use Cases dari Video

1. **Filesystem MCP** — Biarkan AI akses folder tertentu
2. **GitHub MCP** — Query issues, PR, code search
3. **Database MCP** — AI query database langsung
4. **Browser MCP** — AI scrape web pages
5. **Sentry/Monitoring MCP** — AI debug production errors
6. **Doc Search MCP** — AI search internal documentation

### ⚠️ Peringatan Penting

> **MCP servers consume context tokens.** Setiap MCP tool menambah token. Lebih banyak MCP = context lebih cepat penuh. Hanya aktifkan yang benar-benar diperlukan.

### Konfigurasi Praktis

```jsonc
{
  "mcp": {
    // Local: filesystem access
    "filesystem": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem", "."],
      "enabled": true
    },
    // Remote: GitHub code search
    "github-grep": {
      "type": "remote",
      "url": "https://mcp.grep.app",
      "enabled": true
    },
    // Remote: Documentation search
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "enabled": false  // Aktifkan hanya saat butuh
    }
  }
}
```

---

## 4. 📝 LSP — Language Server Protocol

### Konsep

LSP (Language Server Protocol) adalah protokol standar untuk memberikan **code intelligence** ke editor/IDE. Di konteks AI coding agent, LSP digunakan untuk:

- **Navigate** — Jump to definition, find references
- **Analyze** — Diagnostics, type checking
- **Complete** — Smart code completion
- **Refactor** — Rename symbol, extract method

### Kenapa LSP Penting untuk AI Agent?

| Tanpa LSP | Dengan LSP |
|-----------|------------|
| AI baca kode sebagai text mentah | AI paham struktur kode |
| Tidak tahu type variable | Tahu type, interface, inheritance |
| Tidak bisa bedain fungsi vs kelas | Paham symbol hierarchy |
| Cari referensi manual | Jump to definition otomatis |
| Error tidak terdeteksi | Diagnostics real-time |

### LSP di OpenCode

```bash
# Cek diagnostics file
opencode debug lsp diagnostics src/index.ts

# Search workspace symbols
opencode debug lsp symbols "AppController"

# Lihat struktur file
opencode debug lsp document-symbols src/index.ts
```

### Integrasi LSP + AI Agent Workflow

```
AI membaca file
    ↓
AI pakai LSP untuk cari definition fungsi X
    ↓
LSP return lokasi definition
    ↓
AI baca definition untuk paham signature
    ↓
AI implementasi perubahan dengan type-safe
    ↓
LSP validate perubahan (diagnostics)
    ↓
AI fix error jika ada
```

---

## 5. ⚡ Commands — 1-Klik Shortcut

### Konsep

Commands adalah **shortcut satu-klik** untuk mengeksekusi task kompleks yang sering diulang.

### Hierarki Produktivitas

```
Tanpa shortcut         → Ketik prompt panjang setiap kali
Custom commands        → /command-name + parameter
Shell injection        → /command yang auto-execute shell
Chained commands       → Multi-step workflow otomatis
```

### Pattern Command Efektif

Dari video, ada 3 pattern command yang paling powerful:

#### Pattern 1: Review Pipeline
```
/review <file> → /lint <file> → /test <module> → /fix-issues
```

#### Pattern 2: Git Workflow
```
/commit     → Generate conventional commit
/pr         → Create PR dengan deskripsi
/changelog  → Generate changelog
```

#### Pattern 3: Development Loop
```
/feature "nama"  → Buat branch + scaffold
/test            → Jalankan test + coverage
/deploy-staging  → Deploy ke staging
```

### Contoh Command Advanced

```markdown
---
description: Smart commit dengan analisis otomatis
agent: build
model: anthropic/claude-sonnet-4-20250514
---

Analisis perubahan yang di-staging:
!`git diff --staged --stat`

Buat commit message:
!`git diff --staged`

Format: Conventional Commits
- type: feat|fix|refactor|docs|test|chore
- scope: optional
- subject: ≤50 chars, imperative
- body: jelaskan "kenapa" bukan "apa"
- footer: BREAKING CHANGE atau issue references

Setelah setuju, langsung commit:
!`git commit -m "{message}"`
```

---

## 6. 📄 AGENTS.md — Definisi Agent Terstruktur

### Konsep

AGENTS.md adalah file **manifesto** untuk mendefinisikan seluruh agent ecosystem dalam satu project. Ini adalah file yang dibaca AI saat startup untuk memahami agent apa saja yang tersedia.

### Struktur AGENTS.md

```markdown
# Agent Ecosystem — Project Name

## Agent Definitions

### @security-auditor
**Role**: Security specialist
**Trigger**: Saat ada security concern, PR, dependency update
**Capabilities**:
- OWASP vulnerability scanning
- Dependency audit (npm, pip, mvn)
- Authentication flow review
- Secrets detection

### @performance-reviewer
**Role**: Performance optimizer
**Trigger**: Saat ada PR yang ubah kode kritikal
**Capabilities**:
- Bundle size analysis
- Query optimization review
- Memory leak detection
- Rendering performance

### @docs-writer
**Role**: Technical writer
**Trigger**: Saat ada API baru, feature, atau public method
**Capabilities**:
- README generation
- API documentation
- Inline code comments
- Architecture decision records
```

### Kenapa AGENTS.md?

| Manfaat | Keterangan |
|---------|------------|
| **Single source of truth** | Semua definisi agent di satu tempat |
| **Auto-discovery** | AI baca otomatis saat startup |
| **Onboarding** | Anggota tim baru langsung paham ekosistem |
| **Consistency** | Pattern seragam untuk semua agent |

### AGENTS.md vs Agent Files

```
AGENTS.md                 = Katalog / Daftar Isi agent ecosystem
.opencode/agent/*.md      = Definisi detail tiap agent
```

**Rule of thumb:**
- AGENTS.md → overview, trigger conditions, capabilities
- agent/*.md → full prompt, permission, konfigurasi detail

---

## 7. 🔗 Hooks — Otomasi Event-Driven

### Konsep

Hooks adalah **trigger otomatis** yang menjalankan action tertentu saat event terjadi. Ibarat "webhook" tapi untuk AI coding agent.

### Event Flow

```
Event terjadi
    ↓
Hook terpicu (jika kondisi match)
    ↓
Action dijalankan (command, agent, script)
    ↓
Hasil dilaporkan
```

### Use Cases Hooks

| Event | Hook Action | Manfaat |
|-------|-------------|---------|
| File `.ts` di-save | Jalankan `tsc --noEmit` | Type check otomatis |
| PR dibuat | Trigger `@security-auditor` | Security review auto |
| Commit di-push | Jalankan test suite | CI pipeline |
| Dependency berubah | Jalankan `npm audit` | Vulnerability check |
| File konfigurasi berubah | Restart dev server | Hot reload |

### Contoh Hook

**.opencode/hooks/on-save-ts.md:**
```markdown
---
event: file:save
pattern: "**/*.ts"
action: 
  command: "tsc --noEmit"
  showOutput: true
---

TypeScript type check otomatis setiap save file .ts.
```

**.opencode/hooks/on-pr-create.md:**
```markdown
---
event: git:pr:created
action:
  agent: security-auditor
  autoAccept: false
---

PR masuk → trigger security review.
```

---

## 🧠 Advanced Agent Architectures

Selain 7 pilar dasar, ada beberapa arsitektur agent canggih yang perlu dipahami:

### 1. ReAct (Reasoning + Acting)

ReAct menggabungkan **reasoning** (berpikir) dengan **acting** (bertindak) secara interleaved:

```
Thought: Saya perlu mencari fungsi yang menangani authentication
Action: grep "authenticate" src/
Observation: Ditemukan di src/auth/login.ts line 45
Thought: Sekarang saya perlu baca fungsi tersebut
Action: read src/auth/login.ts
Observation: Fungsi menggunakan bcrypt untuk hash password
Thought: bcrypt sudah aman, tapi perlu cek salt rounds
Action: grep "saltRounds" src/auth/
Observation: saltRounds = 10, sudah sesuai best practice
Thought: Authentication flow sudah aman. Tidak ada masalah.
```

**Implementasi di OpenCode**: Agent secara otomatis menggunakan pattern ReAct saat melakukan debugging atau investigasi kode.

### 2. Plan-and-Execute

Agent membuat **plan** terlebih dahulu, baru execute:

```
Plan:
1. Baca requirements dari issue #123
2. Cari file yang perlu diubah
3. Buat implementasi
4. Jalankan test
5. Update dokumentasi

Execute:
Step 1: ✅ Issue #123 dibaca - perlu tambah fitur export PDF
Step 2: ✅ File ditemukan: src/export/, src/utils/pdf.ts
Step 3: ✅ Implementasi selesai
Step 4: ⚠️ Test gagal - dependency pdfkit belum diinstall
Step 5: Fix dependency, test pass ✅
Step 6: ✅ Dokumentasi updated
```

**Implementasi di OpenCode**: Agent `plan` menggunakan pattern ini untuk task kompleks.

### 3. Reflexion

Agent **merefleksi** hasil kerjanya dan improve:

```
Attempt 1: Implementasi fitur export
→ Test gagal: type error di line 45

Reflection: Type error terjadi karena saya tidak import type PdfOptions
→ Fix: Tambah import { PdfOptions } from './types'

Attempt 2: Re-run test
→ Test pass ✅

Reflection: Implementasi berhasil, tapi performa lambat untuk file besar
→ Improvement: Tambah streaming support untuk file > 10MB

Attempt 3: Final implementation
→ Test pass ✅, performa OK ✅
```

**Implementasi di OpenCode**: Agent otomatis retry dan self-correct saat error.

### 4. Tree of Thoughts

Agent mengeksplorasi **multiple paths** secara paralel:

```
Problem: Optimasi query database lambat

Path A: Tambah index
├── Thought: Index di kolom 'created_at' bisa speed up 10x
├── Action: EXPLAIN ANALYZE sebelum/sesudah
└── Result: ✅ 15x faster

Path B: Query rewrite
├── Thought: Subquery bisa diganti JOIN
├── Action: Rewrite query
└── Result: ✅ 3x faster

Path C: Caching
├── Thought: Result bisa di-cache 5 menit
├── Action: Implement cache layer
└── Result: ✅ 100x faster untuk repeated queries

Decision: Path C (caching) paling efektif, combine dengan Path A (index)
```

---

## 🤝 Multi-Agent Orchestration

### Agent Teams

Dalam skenario kompleks, multiple agents bekerja bersama:

```
┌─────────────────────────────────────────────────────────┐
│                    Project Request                      │
│  "Buat fitur export laporan BOS ke PDF"                 │
└──────────────────────┬──────────────────────────────────┘
                       │
              ┌────────▼────────┐
              │  Primary Agent  │
              │  (Orchestrator) │
              └────────┬────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
│ @pdf-expert  │ │@bos-logic│ │@test-writer│
│ Generate PDF │ │Business  │ │Write tests │
│ template     │ │rules     │ │for feature │
└───────┬──────┘ └────┬─────┘ └─────┬──────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
              ┌────────▼────────┐
              │  @docs-writer   │
              │  Write docs     │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  Final Output   │
              │  Feature + Docs │
              │  + Tests        │
              └─────────────────┘
```

### Role Assignment

| Role | Agent | Responsibility |
|------|-------|----------------|
| **Orchestrator** | Primary (build) | Koordinasi, routing, quality check |
| **Specialist** | Subagents | Task spesifik (PDF, BOS, test) |
| **Reviewer** | @code-reviewer | Code review, quality assurance |
| **Writer** | @docs-writer | Dokumentasi, README, API docs |

### Task Distribution

**Strategi distribusi task**:

1. **Sequential**: Agent A → Agent B → Agent C
   - Cocok untuk pipeline linear (build → test → deploy)

2. **Parallel**: Agent A + Agent B + Agent C bersamaan
   - Cocok untuk task independen (test unit + test integration + lint)

3. **Hierarchical**: Orchestrator → Specialists → Sub-specialists
   - Cocok untuk project besar dengan banyak komponen

### Conflict Resolution

Ketika agents punya pendapat berbeda:

```
@pdf-expert: "Gunakan library pdfkit untuk generate PDF"
@performance-reviewer: "pdfkit lambat untuk file besar, gunakan pdf-lib"

Resolution:
1. Orchestrator compare: pdfkit vs pdf-lib benchmark
2. Decide: pdf-lib untuk performa, pdfkit untuk simplicity
3. Final: Gunakan pdf-lib dengan wrapper untuk simplicity
```

**Rule of thumb**: Orchestrator punya final say, berdasarkan data dan tradeoff analysis.

---

## 🧠 Agent Memory Systems

### Short-Term Memory

Memory yang bertahan dalam **satu session**:

- **Conversation history**: Semua turn dalam percakapan
- **Tool call results**: Hasil dari tools yang dipanggil
- **File references**: File yang sedang dibaca/diedit
- **Current plan**: Plan yang sedang di-execute

**Limitasi**: Hilang saat session baru (`/new`)

### Long-Term Memory

Memory yang bertahan **antar session**:

1. **Knowledge Graph** (MCP Memory Server):
   ```json
   {
     "entities": [
       {
         "name": "SD Negeri Pasirhalang",
         "type": "School",
         "observations": [
           "NPSN: 20246040",
           "Lokasi: Desa Mandalamukti",
           "Jumlah siswa: 245"
         ]
       }
     ],
     "relations": [
       {
         "from": "SD Negeri Pasirhalang",
         "to": "Operator",
         "relationType": "hasEmployee"
       }
     ]
   }
   ```

2. **AGENTS.md**: Definisi agent ecosystem
3. **Skills**: Domain knowledge reusable
4. **Config files**: Setup dan preferences

### Context Persistence

Strategi untuk maintain context antar session:

```
Session 1: Analisis data BOS
├── Hasil: "Total pengeluaran Q1: Rp 45.000.000"
├── Simpan ke: findings.md
└── Simpan ke: Knowledge Graph

Session 2: Buat laporan Q2
├── Load: findings.md
├── Load: Knowledge Graph
├── Context: "Q1 sudah Rp 45jt, budget total Rp 120jt"
└── Continue analysis
```

### Context Window Optimization

| Strategi | Token Saved | Trade-off |
|----------|-------------|-----------|
| Subtask isolation | 30-50% | Context terpisah |
| Skill progressive disclosure | 20-40% | Load on-demand |
| MCP selective enable | 10-30% | Tool tidak available |
| Context compaction | 40-60% | Detail hilang |
| File reference pruning | 15-25% | File perlu re-read |

---

## 🛠️ Agent Tool Use

### Tool Selection

Agent memilih tool berdasarkan:

1. **Task type**:
   - Baca file → `read`
   - Cari pattern → `grep`
   - Execute command → `bash`
   - Search file → `glob`

2. **Tool availability**:
   - Built-in tools: selalu available
   - MCP tools: tergantung config
   - Custom tools: dari skills

3. **Permission**:
   - Agent permission menentukan tool mana yang bisa dipakai
   - Subagent biasanya lebih restricted

### Tool Chaining

Menggabungkan multiple tools dalam sequence:

```
Task: "Cari semua file yang import 'express' dan ganti ke 'fastify'"

Step 1: grep "import.*express" src/
Step 2: glob "**/*.ts" (dari hasil grep)
Step 3: read <file> (untuk setiap file)
Step 4: edit <file> (ganti import)
Step 5: bash "npm install fastify" (install dependency)
Step 6: bash "npm run typecheck" (verify)
```

### Tool Composition

Membuat "meta-tool" dari kombinasi tools:

```markdown
# Skill: database-migration

## Migration Tool (composition)
1. read <schema-file> → Baca schema saat ini
2. bash "prisma migrate diff" → Generate diff
3. edit <migration-file> → Review dan fix migration
4. bash "prisma migrate deploy" → Apply migration
5. bash "prisma validate" → Verify
```

### Tool Creation (MCP)

Membuat tool custom via MCP server:

```python
# Python FastMCP
from fastmcp import FastMCP

mcp = FastMCP("School Tools")

@mcp.tool()
def calculate_bos_remaining(budget: float, spent: float) -> str:
    """Hitung sisa anggaran BOS"""
    remaining = budget - spent
    percentage = (remaining / budget) * 100
    return f"Sisa: Rp {remaining:,.0f} ({percentage:.1f}%)"

@mcp.tool()
def validate_student_nisn(nisn: str) -> bool:
    """Validasi format NISN (10 digit)"""
    return len(nisn) == 10 and nisn.isdigit()
```

---

## 🛡️ Agent Safety

### Guardrails

Batasan yang mencegah agent melakukan hal berbahaya:

```json
{
  "permission": {
    "edit": "allow",
    "bash": {
      "*": "allow",
      "rm -rf*": "deny",
      "sudo*": "deny",
      "curl*|wget*": "deny",
      "chmod 777*": "deny"
    }
  }
}
```

### Permission Models

| Level | Deskripsi | Contoh |
|-------|-----------|--------|
| **Full access** | Semua tool, semua file | Primary agent untuk development |
| **Scoped access** | Tool tertentu, file tertentu | Subagent untuk review |
| **Read-only** | Hanya baca, tidak edit | Auditor agent |
| **No bash** | Tool file saja, tidak terminal | Documentation agent |

### Sandboxing

Isolasi agent execution:

1. **File system sandboxing**:
   - Agent hanya akses direktori tertentu
   - MCP filesystem server dengan allowed directories

2. **Network sandboxing**:
   - Agent tidak bisa akses external network
   - MCP server sebagai proxy terkontrol

3. **Process sandboxing**:
   - Agent tidak bisa spawn arbitrary process
   - Command whitelist di permission

### Audit Logging

Mencatat semua action agent untuk review:

```json
{
  "timestamp": "2025-04-15T10:30:00Z",
  "agent": "build",
  "action": "edit",
  "file": "src/auth/login.ts",
  "changes": "+5 lines, -2 lines",
  "result": "success"
}
```

**Log location**: `~/.local/share/opencode/log/`

---

## 📊 Agent Evaluation

### Measuring Agent Performance

| Metric | Cara Ukur | Target |
|--------|-----------|--------|
| **Task completion rate** | % task yang selesai | >90% |
| **Error rate** | % task yang error | <5% |
| **Time to completion** | Rata-rata waktu per task | <5 menit |
| **Code quality** | Lint score, test coverage | >80% coverage |
| **Token efficiency** | Token per task | <50K tokens |
| **User satisfaction** | Rating dari user | >4/5 |

### Benchmarking

**Test suite untuk agent evaluation**:

```
Benchmark Tasks:
├── Task 1: Fix bug di function sederhana
├── Task 2: Tambah feature baru
├── Task 3: Refactor code
├── Task 4: Write test cases
├── Task 5: Generate documentation
├── Task 6: Security review
└── Task 7: Performance optimization
```

### Quality Metrics

**Code quality checklist**:

- [ ] Code compiles tanpa error
- [ ] All tests pass
- [ ] No linting warnings
- [ ] Type safety maintained
- [ ] No security vulnerabilities
- [ ] Performance acceptable
- [ ] Documentation updated

---

## 🎨 Agent Customization

### Domain-Specific Agents

Agent yang dikhususkan untuk domain tertentu:

```markdown
---
description: |
  Ahli administrasi sekolah SD: ARKAS, Dapodik, BOS,
  surat-menyurat, inventaris, data GTK dan peserta didik.
  Trigger: tugas administrasi sekolah, laporan BOS,
  data Dapodik, surat keterangan, slip gaji.
mode: subagent
permission:
  edit: allow
  bash:
    "python*": allow
    "sqlite3*": allow
---

# School Admin Agent

Kamu adalah asisten AI untuk operator SD Negeri Pasirhalang.

## Kapabilitas
1. ARKAS: Baca database, generate laporan keuangan
2. Dapodik: Download data PD/GTK, validasi data
3. BOS: Perencanaan RKAS, realisasi, LPJ
4. Surat: Generate surat keterangan, surat pindah
5. GTK: Data guru, slip gaji, sertifikasi
```

### Personalized Agents

Agent yang disesuaikan dengan preferensi user:

```markdown
---
description: Personal coding agent dengan preferensi user
mode: primary
---

## Coding Style Preferences
- TypeScript strict mode
- Functional programming over OOP
- Named exports over default exports
- Async/await over promises
- Descriptive variable names (bahasa Indonesia + English)

## Project Conventions
- Folder structure: feature-based
- Testing: Vitest + Testing Library
- Linting: ESLint + Prettier
- Commit: Conventional Commits
```

### Team Agents

Agent yang dikonfigurasi untuk tim:

```markdown
# Team Agent Ecosystem

## @frontend-dev
**Role**: Frontend specialist
**Focus**: React, TypeScript, UI/UX
**Tools**: Vite, Tailwind, Storybook

## @backend-dev
**Role**: Backend specialist
**Focus**: Node.js, API, Database
**Tools**: Express, Prisma, PostgreSQL

## @devops
**Role**: Infrastructure specialist
**Focus**: CI/CD, Docker, Cloud
**Tools**: GitHub Actions, Docker, Vercel

## @qa-engineer
**Role**: Quality assurance
**Focus**: Testing, security, performance
**Tools**: Vitest, Playwright, OWASP ZAP
```

---

## 🔮 Future of AI Coding

### Tren yang Sedang Terjadi

1. **Autonomous Development**: Agent bisa kerja berjam-jam tanpa intervensi
2. **Multi-Agent Teams**: Tim AI yang berkolaborasi seperti tim manusia
3. **Self-Improving Agents**: Agent yang belajar dari feedback dan improve
4. **Cross-Modal Coding**: Agent yang paham code + design + docs sekaligus
5. **Real-Time Collaboration**: Human + AI pair programming yang seamless

### Prediksi 2025-2026

| Tren | Impact | Timeline |
|------|--------|----------|
| Agent orchestration | Developer jadi "manager AI" | 2025 |
| Autonomous PR | Agent buat PR sendiri | 2025 |
| AI code review | Review otomatis di CI/CD | 2025 |
| Self-healing code | Auto-fix production bugs | 2026 |
| AI system design | AI arsitek sistem end-to-end | 2026 |

### Mempersiapkan Diri

1. **Belajar prompt engineering** → Skill fundamental AI interaction
2. **Pahami agent architecture** → Bisa design workflow yang efektif
3. **Kuasai debugging AI** → Troubleshoot saat AI salah
4. **Bangun domain expertise** → AI butuh guidance dari expert
5. **Stay updated** → Field ini berkembang sangat cepat

---

## 🎬 Integrasi: Semua Komponen Bersama

Inilah yang membedakan video ini — bagaimana **semua 7 komponen bekerja bersama** dalam satu workflow.

### Workflow End-to-End

```
1. Developer push perubahan
    ↓
2. [HOOK] Trigger: git:push
    ↓
3. [COMMAND] Jalankan /review-all
    ↓
4. [AGENTS.md] Router pilih subagents:
       ├── @lint-checker     → ESLint + Prettier
       ├── @type-checker     → TypeScript check
       ├── @test-analyzer    → Jest coverage
       └── @security-auditor → OWASP scan
    ↓
5. [SKILL] @security-auditor load skill `owasp-patterns`
       → Dapat knowledge OWASP terbaru
    ↓
6. [MCP] @security-auditor call MCP `npm-audit`
       → Scan dependency vulnerability
    ↓
7. [LSP] @security-auditor pakai LSP untuk navigate kode
       → Cari import, definition, references
    ↓
8. Semua hasil dikumpulkan
    ↓
9. [COMMAND] /generate-report
    ↓
10. Developer dapat laporan lengkap
```

### Diagram Integrasi

```
                    ┌─────────────┐
                    │   HOOKS     │ ← Event triggers
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  COMMANDS   │ ← 1-klik shortcuts
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼────┐ ┌────▼────┐ ┌────▼────┐
       │ AGENTS.md │ │  SKILL  │ │   MCP   │
       │  Router   │ │  Load   │ │  Call   │
       └──────┬────┘ └─────────┘ └────┬────┘
              │                       │
       ┌──────▼────┐          ┌───────▼──────┐
       │ SUBAGENTS │          │ LSP + Tools  │
       └───────────┘          └──────────────┘
```

---

## 🏫 Real-World: Advanced AI Coding Workflow untuk Tim Development

### Skenario: Tim Development Sekolah

**Tim**: 1 operator + 2 developer + 1 QA

**Project**: Sistem informasi sekolah (Dapodik integration, BOS reporting, ARKAS dashboard)

### Setup Workflow

```
┌─────────────────────────────────────────────────────────┐
│              School Info System Workflow                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. [HOOK] git:push → trigger CI pipeline               │
│  2. [COMMAND] /review → code review pipeline            │
│  3. [SUBAGENTS]                                         │
│     ├── @backend-reviewer → API, database, security     │
│     ├── @frontend-reviewer → UI, accessibility, perf    │
│     └── @test-reviewer → coverage, edge cases           │
│  4. [MCP] GitHub → auto-create PR comment dengan hasil  │
│  5. [SKILL] coding-standards → enforce team standards   │
│  6. [LSP] TypeScript → type-safe review                 │
│  7. [AGENTS.md] Router → assign task ke agent yang tepat│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Konfigurasi Tim

**AGENTS.md**:
```markdown
# School Info System - Agent Ecosystem

## @backend-reviewer
**Role**: Backend code review specialist
**Trigger**: PR yang mengubah src/api/, src/database/
**Capabilities**: API design, security, performance, database queries

## @frontend-reviewer
**Role**: Frontend code review specialist
**Trigger**: PR yang mengubah src/components/, src/pages/
**Capabilities**: UI/UX, accessibility, responsive design, performance

## @test-reviewer
**Role**: Testing specialist
**Trigger**: Semua PR
**Capabilities**: Test coverage, edge cases, integration tests

## @docs-generator
**Role**: Documentation specialist
**Trigger**: PR yang mengubah public API
**Capabilities**: API docs, changelog, README updates
```

**Hooks**:
```markdown
# .opencode/hooks/on-pr-created.md
---
event: git:pr:created
action:
  command: "/review"
  autoAccept: false
---

PR baru dibuat → trigger full review pipeline.
```

**MCP Config**:
```jsonc
{
  "mcp": {
    "github": {
      "type": "remote",
      "url": "https://api.githubcopilot.com/mcp",
      "headers": {
        "Authorization": "Bearer {env:GITHUB_TOKEN}"
      }
    },
    "database": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-sqlite", "school.db"],
      "enabled": true
    }
  }
}
```

### Daily Workflow

```
Pagi:
├── Developer A: Push feature branch
├── [HOOK] Trigger review pipeline
├── [SUBAGENTS] Parallel review (backend + frontend + test)
├── [MCP] GitHub: PR comment dengan hasil review
└── Developer A: Fix issues berdasarkan review

Siang:
├── Developer B: Merge PR ke main
├── [HOOK] Trigger deployment
├── [COMMAND] /deploy-staging
├── [SUBAGENTS] @qa-engineer: Smoke test di staging
└── Deploy ke production jika test pass

Sore:
├── Operator: Request laporan BOS
├── [COMMAND] /generate-bos-report
├── [SUBAGENTS] @bos-expert: Generate dari database
├── [MCP] Database: Query data keuangan
└── Export ke Excel/PDF
```

---

## 🧪 Praktik Langsung

### Workshop: Setup Agent Ecosystem

Ikuti langkah-langkah berikut untuk setup agent ecosystem di project kamu:

#### Step 1: Buat AGENTS.md
```markdown
# Agent Ecosystem

## Available Agents
- @code-reviewer — Full code review pipeline
- @test-writer — Generate test cases
- @docs-generator — API documentation
```

#### Step 2: Buat Subagent Pertama
File `.opencode/agent/code-reviewer.md`:
```markdown
---
description: Full code review: lint, type, security, performance
mode: subagent
permission:
  edit: deny
  bash:
    "npm run lint*": allow
    "npm run typecheck*": allow
---

Lakukan code review lengkap:
1. Lint check
2. Type check
3. Security scan
4. Performance review
```

#### Step 3: Buat Skill untuk Review Patterns
File `.opencode/skill/review-patterns/SKILL.md`:
```markdown
---
name: review-patterns
description: Code review standards and patterns for this project
---

## Project Review Standards
- React: functional components + hooks
- State: Zustand, not Redux
- API: tRPC with Zod validation
```

#### Step 4: Setup Command
File `.opencode/command/review.md`:
```markdown
---
description: Full code review pipeline
---

@code-reviewer Review $ARGUMENTS
```

#### Step 5: Setup Hook (Opsional)
File `.opencode/hooks/pre-commit.md`:
```markdown
---
event: git:pre-commit
action:
  command: "npm run typecheck && npm run lint"
  autoAccept: true
---
```

#### Step 6: Setup MCP (Opsional)
```jsonc
{
  "mcp": {
    "npm-audit": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-npm-audit"],
      "enabled": true
    }
  }
}
```

---

## 📊 Checklist Penguasaan

Gunakan checklist ini untuk mengukur penguasaan kamu terhadap materi:

### Subagents
- [ ] Bisa bedakan primary agent vs subagent
- [ ] Bisa buat subagent dengan prompt efektif
- [ ] Paham cara subagent auto-selection bekerja
- [ ] Bisa chain subagents untuk workflow kompleks

### Skills
- [ ] Paham progressive disclosure
- [ ] Bisa buat SKILL.md dengan frontmatter proper
- [ ] Bisa bedakan Skill vs Agent vs AGENTS.md
- [ ] Paham permission system Skill

### MCP
- [ ] Paham arsitektur MCP (client-server)
- [ ] Bisa config local dan remote MCP
- [ ] Paham cara debug MCP connection
- [ ] Sadar akan token consumption MCP

### LSP
- [ ] Paham peran LSP dalam AI coding agent
- [ ] Bisa pakai LSP debug tools
- [ ] Paham integrasi LSP + AI workflow

### Commands
- [ ] Bisa buat custom command (Markdown & JSON)
- [ ] Kuasai template syntax ($ARGUMENTS, $1, shell)
- [ ] Paham subtask dan agent per command

### AGENTS.md
- [ ] Paham fungsi AGENTS.md sebagai manifest
- [ ] Bisa mendesain agent ecosystem
- [ ] Paham AGENTS.md vs agent/*.md

### Hooks
- [ ] Paham event-driven architecture
- [ ] Bisa setup hooks untuk otomasi
- [ ] Paham use cases hooks

### Advanced Architectures
- [ ] Paham ReAct pattern
- [ ] Paham Plan-and-Execute pattern
- [ ] Paham Reflexion pattern
- [ ] Paham Tree of Thoughts

### Multi-Agent
- [ ] Bisa design agent team
- [ ] Paham role assignment
- [ ] Paham task distribution strategies
- [ ] Paham conflict resolution

### Memory
- [ ] Paham short-term vs long-term memory
- [ ] Paham knowledge graphs
- [ ] Paham context persistence strategies
- [ ] Paham context window optimization

### Safety
- [ ] Paham guardrails dan permission models
- [ ] Paham sandboxing concepts
- [ ] Paham audit logging

---

## ⚠️ Common Mistakes (dari Video)

| Kesalahan | Dampak | Solusi |
|-----------|--------|--------|
| **Over-engineering** | Kompleksitas tidak perlu | Mulai dengan 1-2 agent, tambah gradual |
| **Semua jadi subagent** | Fragmentasi berlebihan | Subagent untuk task yang >2 step dan sering |
| **MCP overloading** | Context penuh cepat | Hanya aktifkan MCP yang penting |
| **Hook terlalu banyak** | Setiap save trigger 5 hooks | Prioritaskan, jangan semua event |
| **AGENTS.md tidak update** | Agent ecosystem usang | Review setiap sprint |
| **Skill duplikasi** | Conflict dan ambiguity | Satu skill = satu domain |
| **Commands tanpa dokumentasi** | Tim tidak tahu command | Update AGENTS.md + bikin command list |
| **No permission scoping** | Security risk | Selalu set permission minimal |
| **Ignore token usage** | Cost membengkak | Monitor dan optimasi token |
| **No evaluation** | Tidak tahu kualitas agent | Setup benchmark dan metrics |

---

## 📚 Referensi Lanjutan

### Dari Video
- **Full video**: https://www.youtube.com/watch?v=DAaw7Ao_zUc
- **Channel pookie**: https://www.youtube.com/@pookiehd

### Modul Terkait di Fase Ini
| Modul | Topik | Link |
|-------|-------|------|
| 03 | Agent Quickstart | [Baca](03-agent-quickstart.md) |
| 04 | Agent Design Patterns | [Baca](04-agent-design-patterns.md) |
| 07 | Skill Dasar | [Baca](07-skill-dasar.md) |
| 10 | Custom Commands | [Baca](10-custom-commands.md) |
| 14 | MCP Dasar | [Baca](14-mcp-dasar.md) |
| 17 | IDE Integration | [Baca](17-ide-integration.md) |
| 22 | Debugging Tools | [Baca](22-debugging-tools.md) |

### Referensi Eksternal
- [Anthropic: Agent Design Patterns](https://docs.anthropic.com/en/docs/build-with-claude/agent-patterns)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [LSP Specification](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/)
- [vbgate/learn-opencode](https://github.com/vbgate/learn-opencode)
- [ReAct Paper](https://arxiv.org/abs/2210.03629)
- [Tree of Thoughts Paper](https://arxiv.org/abs/2305.10601)

---

## 📝 Ringkasan

1. **Evolusi AI coding**: Autocomplete → Context-Aware → Agentic → Autonomous → Orchestration
2. **7 pilar AI coding agent**: Subagents, Skills, MCP, LSP, Commands, AGENTS.md, Hooks
3. **Subagent** = spesialis task, dipanggil lewat `@nama`, deskripsi spesifik untuk auto-selection
4. **Skill** = knowledge reusable, load on-demand via progressive disclosure, hemat context
5. **MCP** = protokol standar koneksi AI ke external services (local: stdio, remote: HTTP/SSE)
6. **LSP** = code intelligence untuk navigate, analyze, complete kode
7. **Commands** = shortcut `/command` untuk task kompleks, support parameter dan shell injection
8. **AGENTS.md** = manifest agent ecosystem dalam satu project, single source of truth
9. **Hooks** = otomasi event-driven (pre-commit, on-save, PR created)
10. **Advanced architectures**: ReAct, Plan-and-Execute, Reflexion, Tree of Thoughts
11. **Multi-agent orchestration**: Agent teams, role assignment, task distribution, conflict resolution
12. **Agent memory**: Short-term (session) vs long-term (knowledge graph, skills, config)
13. **Agent safety**: Guardrails, permission models, sandboxing, audit logging
14. **Kekuatan sejati** ada di **integrasi semua komponen** dalam satu workflow