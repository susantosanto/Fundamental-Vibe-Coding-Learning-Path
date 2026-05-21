# 03: Agent Quickstart

> **Pahami arsitektur Agent secara mendalam dan buat custom Agent pertamamu**

**Estimasi**: 30 menit belajar + 30 menit praktik | **Level**: Intermediate → Advanced

## 🎯 Outcome

Setelah menyelesaikan modul ini, kamu akan:
- Memahami arsitektur internal agent: context management, tool access, session isolation
- Membedakan Primary Agent vs Subagent beserta pola komunikasi antar keduanya
- Membuat custom Agent via Markdown dan JSON dengan konfigurasi advanced
- Mengatur model selection, temperature, step limits, dan permission per agent
- Mendesain system prompt yang efektif dan menguji agent secara sistematis
- Mengoptimasi performa agent dan menerapkan security best practices
- Membangun 8+ agent spesialis untuk berbagai use case nyata

---

## 🤖 Apa itu Agent?

### Definisi Fundamental

Dalam konteks OpenCode, **Agent** adalah unit AI yang dapat dikonfigurasi dengan role, capabilities, dan behavior tertentu. Berbeda dengan workflow yang mengikuti langkah-langkah tetap (fixed steps), agent memiliki kemampuan untuk **mengarahkan dirinya sendiri secara dinamis** — memilih tool yang tepat, memutuskan urutan eksekusi, dan beradaptasi dengan konteks yang berubah.

| Tipe | Keterangan | Karakteristik | Use Case |
|------|------------|---------------|----------|
| **Workflow** | LLM + tools via predefined path | Fixed steps, predictable, deterministic | CI/CD pipeline, code generation template |
| **Agent** | LLM dynamically directs itself | Autonomous, flexible, context-aware | Code review, bug fixing, feature development |

### Agent di OpenCode

Setiap agent di OpenCode terdiri dari tiga komponen utama:

1. **Identity** — Siapa agent ini, keahlian apa yang dimiliki, dan kapan harus digunakan
2. **Capabilities** — Tools apa yang bisa diakses (read, edit, bash, webfetch, dll)
3. **Behavior** — Cara kerja, batasan, permission model, dan pola interaksi

### Kenapa Custom Agent?

Bayangkan kamu bekerja di tim dan setiap hari melakukan tugas yang berulang:

| Skenario | Tanpa Agent | Dengan Agent |
|----------|-------------|--------------|
| Code review | Setiap kali ketik "Kamu ahli review kode, fokus ke security dan performance..." | Langsung `@reviewer` |
| Doc writing | Setiap kali deskripsi style, format, struktur dokumen | Langsung `@docs-writer` |
| Security audit | Setiap kali jelaskan konteks, vulnerability types, compliance | Langsung `@security` |
| Test generation | Setiap kali jelaskan framework, coverage target, edge cases | Langsung `@test-gen` |

**Keuntungan utama:** Konsistensi, efisiensi token, dan reusability. Agent menyimpan "kepribadian" dan "aturan kerja" yang bisa dipanggil kapan saja tanpa perlu menjelaskan ulang.

---

## 🏗️ Agent Architecture

### Bagaimana Agent Bekerja Secara Internal

Ketika kamu memanggil agent (baik melalui Tab switch, `@mention`, atau TaskTool), OpenCode menjalankan serangkaian proses internal:

```
┌─────────────────────────────────────────────────────────┐
│                    User Input / Request                  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  1. Agent Resolution                                     │
│     - Cari agent by name (@agent-name)                   │
│     - Atau gunakan default_agent / primary agent         │
│     - Load konfigurasi dari Markdown + JSON (merge)      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  2. Context Assembly                                     │
│     - System prompt (dari .md body atau JSON prompt)     │
│     - Conversation history (hanya primary agent)         │
│     - Tool definitions (filtered by tools config)        │
│     - Permission rules (global + agent-specific merge)   │
│     - Model parameters (temperature, top_p, steps)       │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  3. Session Creation                                     │
│     - Primary: main session, full history                │
│     - Subagent: isolated sub-session, prompt only        │
│     - Apply hardcoded restrictions (subagent only)       │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  4. Tool Call Loop                                       │
│     - LLM generates response + tool calls                │
│     - Permission check per tool call                     │
│     - Execute tool → return result → loop                │
│     - Stop when: max steps, task done, or user interrupt │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  5. Result Return                                        │
│     - Primary: display to user                           │
│     - Subagent: return compressed result to parent       │
└─────────────────────────────────────────────────────────┘
```

### Context Management

Context adalah "memori" agent. Pemahaman tentang bagaimana context dikelola sangat penting untuk mendesain agent yang efisien:

**Primary Agent Context:**
- Full conversation history (semua pesan user dan response)
- System prompt dari konfigurasi agent
- Tool definitions yang di-enable
- Session state (todo list, file changes, dll)
- Context compaction otomatis saat terlalu panjang

**Subagent Context (Isolated):**
- **Hanya** prompt yang diberikan saat invocasi
- System prompt dari konfigurasi subagent
- Tool definitions (dengan hardcoded restrictions)
- **TIDAK** bisa melihat conversation history parent
- **TIDAK** bisa mengakses todo list parent
- **TIDAK** bisa spawn subagent lain (kecuali di-override)

### Tool Access Pipeline

Setiap tool call melewati pipeline keamanan:

```
Tool Call → Enablement Check → Permission Check → Execution
                │                    │
                ▼                    ▼
         Tool loaded?         allow/ask/deny?
         (tools config)       (permission config)
```

1. **Enablement Layer** — Boolean flags di `tools` menentukan apakah tool dimuat
2. **Permission Layer** — Fine-grained rules menentukan apakah aksi spesifik diizinkan
3. **Built-in Security** — Hardcoded rules (env file protection, doom loop detection, external directory blocking)

---

## 📊 Tipe Agent

| Tipe | Keterangan | Cara Panggil | Session | Can Delegate |
|------|------------|--------------|---------|--------------|
| **Primary** | Main agent, interaksi langsung | Tab key, `<Leader>+a` | Main session, full history | Ya, via TaskTool |
| **Subagent** | Dipanggil primary untuk task spesifik | `@agentName` atau auto | Isolated sub-session | Tidak (hardcoded deny) |
| **All** | Dual identity: primary atau subagent | Tab ATAU `@` | Tergantung cara panggil | Ya jika primary, Tidak jika subagent |

### Kolaborasi Agent

```
User ←→ Primary Agent (build/plan)
              │
              │ TaskTool (buat Session baru)
              ▼
         ┌──────────────────┐
         │   Subagent 1     │  ← Isolated session, prompt only
         │   (explore)      │
         └────────┬─────────┘
                  │ Return result
                  ▼
         ┌──────────────────┐
         │   Subagent 2     │  ← Isolated session, prompt only
         │   (code-reviewer)│
         └────────┬─────────┘
                  │ Return result
                  ▼
         Primary Agent menggabungkan hasil → Response ke User
```

### ⚠️ Subagent运行机制 (PENTING — WAJIB PAHAM)

Ini adalah konsep paling kritis dalam agent system:

1. **Session Isolation**: Subagent TIDAK melihat history primary agent. Setiap subagent berjalan di session terpisah yang terisolasi.
2. **Context = Prompt Only**: Subagent hanya menerima task description yang kamu berikan saat invocasi. Jika kamu tidak menyertakan informasi penting di prompt, subagent tidak akan tahu.
3. **Must Provide Full Context**: Tulis SEMUA info yang dibutuhkan di prompt — file paths, code snippets, konteks proyek, batasan, dan kriteria sukses.
4. **Hardcoded Restrictions**: Subagent tidak bisa modify/read todo list parent dan tidak bisa spawn subagent lain (mencegah infinite recursion).

**Contoh buruk (kurang konteks):**
```
@explorer Cari fungsi auth
```

**Contoh baik (full context):**
```
@explorer Cari semua fungsi authentication di proyek ini. Fokus ke:
- File di src/auth/ dan src/middleware/
- Fungsi yang menangani login, logout, token refresh
- Pattern middleware yang memvalidasi JWT
Kembalikan: nama file, nama fungsi, dan baris kode relevan.
```

---

## 📦 Built-in Agents

### User-Visible Agents

| Nama | Mode | Permission Default | Keterangan |
|------|------|-------------------|------------|
| `build` | primary | All tools enabled | Default development agent untuk code modification |
| `plan` | primary | `edit: deny` kecuali `.opencode/plan/*.md` | Planning mode, read-only kecuali dokumen plan |
| `general` | subagent | `todoread: deny`, `todowrite: deny` | Multi-step research dan general tasks |
| `explore` | subagent | Hanya `grep`, `glob`, `list`, `bash`, `read`, `webfetch`, `websearch`, `codesearch` | Fast code exploration tanpa modification |

**Detail Plan Agent:** Plan agent dikonfigurasi sebagai `edit: deny` dengan pengecualian hanya boleh menulis ke file `.opencode/plan/*.md`. Ini memaksa behavior read-only selama fase planning.

### Internal System Agents (Hidden)

| Nama | Fungsi | Model |
|------|--------|-------|
| `title` | Generate session title | `small_model` config |
| `summary` | Generate conversation summary untuk compaction | `small_model` config |
| `compaction` | Context compression saat context terlalu panjang | Main model |

---

## 📁 Lokasi Konfigurasi dan Priority

| Lokasi | Scope | Prioritas |
|--------|-------|-----------|
| Project `opencode.json` field `agent` | Current project | **Tertinggi** |
| Project `.opencode/agent/*.md` | Current project | Tinggi |
| Global `opencode.json` field `agent` | Semua project | Sedang |
| Global `~/.config/opencode/agent/*.md` | Semua project | **Terendah** |

### Aturan Merging

Ketika agent yang sama didefinisikan di beberapa lokasi:
1. **JSON fields override Markdown fields** untuk agent name yang sama
2. **Field-level merging** — hanya field yang konflik yang di-overwrite
3. **Use case praktis:** Definisi prompt di `.md` (mudah edit text panjang), gunakan `opencode.json` untuk override parameter seperti `temperature` atau `disable`

> **Filename = Agent name**: `docs-writer.md` → agent bernama `docs-writer`. Nested directory: `team/backend.md` → agent `team/backend`.

---

## 🚀 Buat Agent Pertama (Markdown)

### Struktur Dasar

```markdown
---
description: Deskripsi singkat apa yang agent lakukan
mode: subagent
---

System prompt di sini.
Beritahu agent siapa mereka, ahli di apa, cara kerja.
```

### Contoh 1: Docs Writer Agent

Buat file `.opencode/agent/docs-writer.md`:

```markdown
---
description: |
  Ahli technical writing: API docs, README, user manual.
  Cocok untuk: dokumentasi proyek baru, update docs, jelaskan kode.
  Tidak cocok: code review, bug fixing, implementasi fitur.
mode: subagent
temperature: 0.3
---

# Role
Kamu adalah ahli technical documentation. Dokumentasimu dinilai "langsung bisa dipakai setelah baca".

# Document Standards
- Markdown format
- Code example harus runnable
- Include input/output说明
- Bahasa Indonesia, istilah teknis保留英文

# Structure
1. Overview (1 kalimat)
2. Quick Start (30 detik runnable)
3. API Details (parameter lengkap)
4. Examples (common scenarios)
5. FAQ

# Constraints
- ✅ Quick Start code harus copy-paste runnable
- ✅ Parameter include type dan default
- ❌ Jangan asumsi user punya background knowledge
```

### Contoh 2: Code Reviewer Agent (Read-Only)

Buat file `.opencode/agent/code-reviewer.md`:

```markdown
---
description: |
  Ahli code review: security vulnerabilities, performance issues, code style, maintainability.
  Mode read-only — tidak mengubah kode.
mode: subagent
temperature: 0.2
steps: 25
permission:
  edit: deny
  write: deny
  bash:
    "git diff*": allow
    "git log*": allow
    "git show*": allow
    "*": deny
---

# Role
Kamu adalah senior code reviewer dengan pengalaman 10+ tahun.

# Review Checklist
1. **Security**: SQL injection, XSS, CSRF, hardcoded secrets
2. **Performance**: N+1 queries, memory leaks, inefficient loops
3. **Maintainability**: DRY, SOLID, naming conventions
4. **Error Handling**: Try-catch coverage, meaningful error messages

# Output Format
Untuk setiap issue, berikan:
- **File**: path:line_number
- **Severity**: Critical / Warning / Info
- **Issue**: Deskripsi masalah
- **Suggestion**: Cara fix dengan code example
```

### Contoh 3: Test Generator Agent

Buat file `.opencode/agent/test-gen.md`:

```markdown
---
description: |
  Generate unit test dan integration test. Mendukung Jest, Vitest, Pytest.
  Fokus: edge cases, boundary conditions, error scenarios.
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.4
steps: 30
---

# Role
Kamu adalah QA engineer spesialis test automation.

# Testing Principles
1. Test behavior, bukan implementation
2. Satu assertion per test (kecuali related assertions)
3. Arrange-Act-Assert pattern
4. Test nama deskriptif: "should [expected behavior] when [condition]"

# Coverage Target
- Happy path: 100%
- Error path: semua exception handler
- Edge cases: null, empty, boundary values
- Integration: API contract, database interaction

# Output
- Tulis test file baru di lokasi yang sesuai
- Sertakan setup/teardown jika diperlukan
- Mock external dependencies
```

### Contoh 4: Security Auditor Agent

Buat file `.opencode/agent/security.md`:

```markdown
---
description: |
  Security audit specialist: OWASP Top 10, dependency vulnerabilities, secrets detection.
mode: subagent
temperature: 0.1
steps: 40
permission:
  edit: deny
  write: deny
  bash:
    "npm audit*": allow
    "pip list*": allow
    "grep -r*": allow
    "git log*": allow
    "*": deny
  read:
    "package.json": allow
    "requirements.txt": allow
    "*.env*": deny
    "*": allow
---

# Role
Kamu adalah security engineer dengan sertifikasi CISSP dan OSCP.

# Audit Scope
1. **OWASP Top 10**: Injection, broken auth, sensitive data exposure, dll
2. **Dependencies**: Known CVEs, outdated packages
3. **Secrets**: API keys, passwords, tokens di source code
4. **Configuration**: CORS, CSP, HTTPS enforcement

# Output
Laporan dengan format:
- [SEVERITY] Deskripsi vulnerability
- Lokasi: file:line
- CWE reference
- Remediation steps
```

### Contoh 5: Database Migrator Agent

Buat file `.opencode/agent/db-migrator.md`:

```markdown
---
description: |
  Database migration specialist: schema changes, data migration, rollback planning.
  Mendukung PostgreSQL, MySQL, SQLite.
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
steps: 20
permission:
  edit: allow
  bash:
    "prisma migrate*": allow
    "alembic*": allow
    "knex*": allow
    "*": ask
---

# Role
Kamu adalah database administrator dan migration specialist.

# Migration Rules
1. SELALU buat rollback script bersamaan dengan migration
2. Tidak pernah DROP kolom/data tanpa backup plan
3. Gunakan transactional migration jika database support
4. Test migration di staging sebelum production

# Output
- Migration file (up + down)
- Impact analysis: tabel affected, estimasi waktu
- Rollback plan
- Data migration script jika diperlukan
```

### Contoh 6: API Tester Agent

Buat file `.opencode/agent/api-tester.md`:

```markdown
---
description: |
  API testing specialist: endpoint validation, response schema, performance benchmarking.
mode: subagent
temperature: 0.3
steps: 35
permission:
  edit: deny
  bash:
    "curl*": allow
    "http*": allow
    "node*": allow
    "python*": allow
    "*": ask
---

# Role
Kamu adalah API QA engineer.

# Testing Strategy
1. **Functional**: Status code, response body, headers
2. **Schema**: JSON schema validation, required fields
3. **Performance**: Response time < 200ms (p95)
4. **Error Handling**: 4xx/5xx responses, error messages
5. **Security**: Auth required, rate limiting, CORS

# Output
- Test script (curl atau code)
- Expected vs actual response
- Performance metrics
- Issues found dengan severity
```

### Contoh 7: Frontend Specialist Agent

Buat file `.opencode/agent/frontend.md`:

```markdown
---
description: |
  Frontend development expert: React, Vue, TypeScript, CSS, accessibility.
mode: all
model: anthropic/claude-sonnet-4-20250514
temperature: 0.5
color: "#2196F3"
---

# Role
Kamu adalah senior frontend engineer dengan fokus pada:
- Component architecture dan composition patterns
- Performance optimization (Core Web Vitals)
- Accessibility (WCAG 2.1 AA)
- Responsive design dan cross-browser compatibility

# Coding Standards
- TypeScript strict mode
- Functional components dengan hooks
- CSS modules atau Tailwind
- Semantic HTML
- ARIA labels untuk interactive elements

# Review Checklist
- [ ] Component reusable dan composable
- [ ] No unnecessary re-renders (React.memo, useMemo, useCallback)
- [ ] Accessible (keyboard navigation, screen reader)
- [ ] Responsive (mobile-first)
- [ ] Error boundaries implemented
```

### Contoh 8: DevOps Agent

Buat file `.opencode/agent/devops.md`:

```markdown
---
description: |
  DevOps engineer: CI/CD pipelines, Docker, deployment automation, monitoring.
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.2
steps: 30
permission:
  edit: allow
  bash:
    "docker*": allow
    "kubectl*": ask
    "terraform*": ask
    "git*": allow
    "*": ask
---

# Role
Kamu adalah DevOps engineer dengan pengalaman di cloud infrastructure.

# Responsibilities
1. **CI/CD**: GitHub Actions, GitLab CI pipeline optimization
2. **Containerization**: Dockerfile best practices, multi-stage builds
3. **Deployment**: Blue-green, canary, rolling updates
4. **Monitoring**: Health checks, logging, alerting
5. **Security**: Image scanning, secret management, least privilege

# Output Standards
- Infrastructure as Code (Terraform/Pulumi)
- Dockerfile: multi-stage, non-root user, minimal base image
- CI/CD: caching, parallel jobs, artifact management
- Runbook: troubleshooting steps, rollback procedure
```

### Config Fields Reference (Lengkap)

| Field | Type | Default | Keterangan |
|-------|------|---------|------------|
| `description` | string | — | **Isi**. Mempengaruhi auto-selection oleh primary agent. Jelaskan kapan cocok dan tidak cocok digunakan. |
| `mode` | enum | `"all"` | `subagent` \| `primary` \| `all`. Menentukan cara invocasi dan session behavior. |
| `model` | string | Inherits | Format `provider/model`. Contoh: `anthropic/claude-sonnet-4-20250514`, `openai/gpt-4o`. |
| `temperature` | number | Provider default | 0-1, randomness. 0 = deterministic (code review), 0.5 = balanced (dev), 0.8+ = creative (writing). |
| `top_p` | number | Provider default | Nucleus sampling parameter (0-1). Alternatif temperature untuk mengontrol diversity. |
| `steps` | number | — | Max iterasi, cegah infinite loop. Ganti deprecated `maxSteps`. |
| `hidden` | boolean | `false` | `true` = hide dari @ autocomplete. Gunakan untuk internal-only agents. |
| `color` | string | — | Hex color `#RRGGBB` untuk UI differentiation. |
| `permission` | object | Global defaults | Agent-level permission overrides. Pattern-based rules. |
| `tools` | object | Global defaults | Agent-level tool enablement (boolean flags). |
| `disable` | boolean | `false` | `true` = agent completely disabled. |
| `options` | object | — | Container untuk provider-specific parameters. |

**Parameter transparency:** Field yang tidak dikenali OpenCode otomatis diteruskan ke model provider API. Contoh: `reasoningEffort: "high"` akan dikirim ke Anthropic API jika supported.

---

## 🔧 Buat Agent (JSON)

Di `opencode.json`:

### Contoh 9: Code Reviewer via JSON

```jsonc
{
  "agent": {
    "code-reviewer": {
      "description": "Ahli code review: security, performance, maintainability",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-4-20250514",
      "temperature": 0.2,
      "steps": 30,
      "color": "#4CAF50",
      "permission": {
        "edit": "deny",
        "write": "deny",
        "bash": {
          "git diff*": "allow",
          "git log*": "allow",
          "*": "deny"
        }
      },
      "prompt": "Kamu adalah ahli code review dengan pengalaman 10+ tahun.\n\n## Check Points\n- Security vulnerabilities (SQL injection, XSS, hardcoded secrets)\n- Performance issues (N+1 queries, memory leaks)\n- Code style dan maintainability (DRY, SOLID)\n- Error handling coverage\n\n## Output Format\nUntuk setiap issue: File (path:line), Severity (Critical/Warning/Info), Issue description, Suggestion dengan code example."
    }
  }
}
```

### Contoh 10: External Prompt File

Untuk prompt yang panjang, gunakan file terpisah:

```jsonc
{
  "agent": {
    "code-reviewer": {
      "description": "Ahli code review",
      "mode": "subagent",
      "prompt": "{file:./prompts/code-reviewer.txt}"
    },
    "docs-writer": {
      "description": "Technical documentation expert",
      "mode": "subagent",
      "prompt": "{file:./prompts/docs-writer.md}"
    }
  }
}
```

Path relatif terhadap direktori file konfigurasi.

### Contoh 11: Agent dengan Tool Restrictions

```jsonc
{
  "agent": {
    "auditor": {
      "description": "Read-only code audit agent",
      "mode": "subagent",
      "tools": {
        "write": false,
        "edit": false,
        "bash": true,
        "read": true,
        "glob": true,
        "grep": true
      },
      "permission": {
        "edit": "deny",
        "bash": {
          "git log*": "allow",
          "git diff*": "allow",
          "grep*": "allow",
          "*": "ask"
        },
        "read": {
          "*.env*": "deny",
          "*": "allow"
        }
      }
    }
  }
}
```

---

## 💬 Agent Communication Patterns

### Bagaimana Primary dan Subagent Berbagi Informasi

Karena subagent berjalan di isolated session, strategi komunikasi menjadi krusial:

#### Pattern 1: Explicit Context Passing (Recommended)

Primary agent menyertakan SEMUA konteks yang dibutuhkan dalam task prompt:

```
@explorer Cari semua endpoint API di src/routes/. Kembalikan:
- Route path (GET/POST/PUT/DELETE)
- Handler function name
- Middleware yang digunakan
- File location: line number

Format output: Markdown table dengan kolom Method, Path, Handler, Middleware, File.
```

#### Pattern 2: Sequential Delegation dengan Accumulated Results

Primary agent mengumpulkan hasil dari beberapa subagent:

```
Langkah 1: @explorer → cari semua auth-related code
Langkah 2: @code-reviewer → review hasil dari explorer
Langkah 3: Primary → gabungkan dan presentasikan ke user
```

#### Pattern 3: Structured Output Agreement

Primary agent dan subagent "berjanji" pada format output tertentu:

```
@db-migrator Analisis schema changes yang diperlukan untuk menambahkan
fitur "user roles". Kembalikan dalam format JSON:
{
  "migrations": [{"file": "...", "sql": "..."}],
  "risk_assessment": "...",
  "rollback_plan": "..."
}
```

### Context Passing Strategies

| Strategy | Kapan Pakai | Contoh |
|----------|-------------|--------|
| **Full code snippet** | File kecil (< 100 baris) | Paste kode langsung di prompt |
| **File path + line range** | File besar | `src/auth.ts:45-120` |
| **Summary + key details** | Banyak file | "3 files affected: auth.ts, middleware.ts, routes.ts" |
| **Structured data** | Data terstruktur | JSON, CSV, atau Markdown table |

### ⚠️ Anti-Patterns (HINDARI)

1. **Vague prompts**: "Cari bug di kode" — terlalu umum
2. **Missing constraints**: Tidak specify batasan atau kriteria sukses
3. **Assuming context**: Mengira subagent tahu conversation history
4. **Over-delegation**: Memanggil subagent untuk task yang bisa dikerjakan primary
5. **No output format**: Tidak specify format hasil yang diharapkan

---

## ⚙️ Advanced Agent Configuration

### Model Selection per Agent

Tidak semua agent butuh model yang sama. Strategi pemilihan model:

| Agent Type | Recommended Model | Alasan |
|------------|-------------------|--------|
| Code review (analitis) | `anthropic/claude-opus-4-20250514` | Reasoning depth tinggi |
| Code generation | `anthropic/claude-sonnet-4-20250514` | Balance speed dan quality |
| Exploration/search | `openai/gpt-4o-mini` | Cepat, murah, cukup akurat |
| Documentation | `anthropic/claude-sonnet-4-20250514` | Writing quality baik |
| Security audit | `anthropic/claude-opus-4-20250514` | Perlu reasoning mendalam |
| Test generation | `anthropic/claude-sonnet-4-20250514` | Pattern recognition baik |

```jsonc
{
  "agent": {
    "reviewer": {
      "model": "anthropic/claude-opus-4-20250514",
      "temperature": 0.1
    },
    "explorer": {
      "model": "openai/gpt-4o-mini",
      "temperature": 0.3
    },
    "docs-writer": {
      "model": "anthropic/claude-sonnet-4-20250514",
      "temperature": 0.4
    }
  }
}
```

### Temperature Tuning Guide

| Temperature | Range | Use Case | Effect |
|-------------|-------|----------|--------|
| **0.0 - 0.1** | Deterministic | Security audit, code review, data processing | Output konsisten, minimal variasi |
| **0.2 - 0.3** | Focused | Code generation, bug fixing, refactoring | Kreatif tapi terkontrol |
| **0.4 - 0.6** | Balanced | Documentation, planning, general tasks | Balance antara kreativitas dan akurasi |
| **0.7 - 0.9** | Creative | Brainstorming, UI design, naming | Variasi tinggi, mungkin kurang konsisten |
| **1.0** | Maximum | Eksperimen, creative writing | Sangat tidak terduga |

### Step Limits Strategy

`steps` membatasi berapa kali agent bisa melakukan tool call iteration:

| Task Complexity | Recommended Steps | Contoh |
|-----------------|-------------------|--------|
| Simple lookup | 5-10 | Cari fungsi spesifik |
| Medium analysis | 15-25 | Code review satu file |
| Complex task | 30-50 | Refactor multi-file |
| Research | 40-60 | Audit security seluruh proyek |

**Tip:** Set `steps` cukup tinggi untuk task kompleks, tapi tidak infinite. Agent yang stuck akan consume token tanpa hasil.

### Custom Permissions per Tool

```yaml
---
description: Agent dengan permission granular
mode: subagent
permission:
  read:
    "src/**": allow        # Baca semua di src/
    "*.env*": deny          # Blokir file environment
    "tests/**": allow      # Baca test files
  edit:
    "src/**/*.ts": allow   # Edit TypeScript di src/
    "package.json": ask    # Tanya sebelum edit package.json
    "*.lock": deny          # Jangan edit lock files
    "*": deny              # Default deny
  bash:
    "npm test*": allow     # Jalankan test
    "npm run build*": ask  # Tanya sebelum build
    "git*": allow          # Git operations OK
    "rm*": deny            # Blokir delete commands
    "*": ask               # Default ask
  task:
    "*": deny              # Tidak boleh spawn subagent
---
```

---

## 🎨 Agent Design Best Practices

### Writing Effective System Prompts

Struktur system prompt yang baik:

```markdown
# Role
[Siapa agent ini, keahlian utama, pengalaman]

# Scope
[Apa yang agent ini LAKUKAN dan TIDAK lakukan]

# Standards
[Kualitas, format, konvensi yang harus diikuti]

# Process
[Langkah-langkah yang harus diambil saat mengerjakan task]

# Output Format
[Bagaimana hasil harus diformat]

# Constraints
[Batasan keras yang tidak boleh dilanggar]
```

### Tips Menulis Prompt yang Efektif

1. **Spesifik, bukan general**: "Review security vulnerabilities" > "Review kode"
2. **Berikan contoh**: Tunjukkan format output yang diharapkan
3. **Definisikan batasan**: Apa yang TIDAK boleh dilakukan
4. **Prioritaskan**: Urutkan checklist dari yang paling penting
5. **Gunakan bahasa imperatif**: "Lakukan X", "Jangan lakukan Y"
6. **Include edge cases**: "Perhatikan juga kasus null, empty, dan boundary values"

### Scoping Agent Capabilities

**Rule of thumb:** Satu agent = satu domain keahlian.

| ✅ Good Scoping | ❌ Bad Scoping |
|-----------------|----------------|
| "Code review specialist" | "Semua tugas development" |
| "API documentation writer" | "Technical writer untuk semua jenis dokumen" |
| "Database migration expert" | "Backend developer fullstack" |
| "Security auditor" | "Developer yang juga bisa security" |

### Avoiding Agent Overlap

Ketika kamu punya banyak agent, pastikan tidak ada overlap yang membingungkan:

```jsonc
{
  "agent": {
    "reviewer": {
      "description": "Code review: security, performance, maintainability. BUKAN untuk documentation."
    },
    "docs-writer": {
      "description": "Technical documentation: API docs, README, tutorials. BUKAN untuk code review."
    },
    "security": {
      "description": "Security audit ONLY: OWASP, CVE, secrets detection. BUKAN untuk general code review."
    }
  }
}
```

Gunakan frasa "BUKAN untuk..." di description agar primary agent tidak salah pilih subagent.

---

## 🧪 Agent Testing and Debugging

### Cara Menguji Agent

1. **Direct invocation**: Panggil agent langsung dengan task yang jelas
2. **Check output**: Apakah format sesuai yang diminta?
3. **Verify constraints**: Apakah agent melanggar batasan (edit file yang seharusnya read-only)?
4. **Test edge cases**: Task yang ambigu, task yang di luar scope
5. **Monitor token usage**: Apakah agent consume token berlebihan?

### Common Failure Modes

| Gejala | Kemungkinan Penyebab | Solusi |
|--------|---------------------|--------|
| Agent tidak muncul di autocomplete | File di `agents/` bukan `agent/` | Pindahkan ke `.opencode/agent/` |
| Agent tidak ikuti instruksi | Prompt terlalu panjang/fuzzy | Simplify, prioritaskan core rules |
| Agent edit file yang seharusnya read-only | Permission tidak dikonfigurasi | Set `edit: deny` di permission |
| Agent stuck dalam loop | Tidak ada exit condition | Set `steps` limit, tambahkan constraint |
| Agent pilih model salah | Field `model` typo | Cek format `provider/model-name` |
| Subagent tidak tahu konteks | Prompt invocasi kurang detail | Sertakan full context di task prompt |
| Agent terlalu lambat | Model terlalu besar untuk task sederhana | Gunakan model lebih kecil (mini/flash) |
| `maxSteps` tidak生效 | Field deprecated | Ganti dengan `steps` |
| Color tidak muncul di UI | Format hex salah | Gunakan `#RRGGBB` (6 digit) |
| Nested agent tidak bisa dipanggil | Nama salah format | Gunakan `folder/agent-name` |

### Debugging Checklist

```
[ ] 1. Cek lokasi file: .opencode/agent/ (bukan agents/)
[ ] 2. Cek mode: primary/subagent/all (bukan nama agent)
[ ] 3. Cek frontmatter: valid YAML, field yang benar
[ ] 4. Cek prompt: di body .md, BUKAN di frontmatter
[ ] 5. Cek permission: edit/bash/read sesuai kebutuhan
[ ] 6. Cek model: format provider/model-name valid
[ ] 7. Cek steps: bukan maxSteps (deprecated)
[ ] 8. Cek description: jelas, spesifik, include "tidak cocok untuk"
[ ] 9. Test invocasi: @agent-name dengan task sederhana
[ ] 10. Monitor output: apakah sesuai format yang diminta?
```

---

## 🔒 Agent Security

### Permission Models

OpenCode menggunakan **three-tier permission hierarchy**:

1. **Global defaults** — Di `opencode.json` root `permission`
2. **Agent overrides** — Di konfigurasi individual agent
3. **Hardcoded rules** — Tidak bisa di-override (env file protection, dll)

Setiap permission rule menghasilkan salah satu dari tiga aksi:

| Aksi | Behavior | Kapan Pakai |
|------|----------|-------------|
| `allow` | Eksekusi langsung tanpa konfirmasi | Operasi aman dan rutin |
| `ask` | Prompt user untuk approval | Operasi yang perlu verifikasi |
| `deny` | Blokir eksekusi, return error | Operasi berbahaya |

### Last-Match-Wins Algorithm

Ketika multiple pattern match, **rule terakhir yang menang**:

```yaml
permission:
  bash:
    "*": deny          # Rule 1: default deny semua
    "git*": allow      # Rule 2: allow git commands
    "git push*": deny  # Rule 3: deny git push (terakhir = menang)
```

Hasil: `git status` → allow, `git push` → deny, `npm install` → deny.

### Preventing Unauthorized Actions

#### Environment File Protection
OpenCode secara hardcoded melindungi file `.env` — agent tidak bisa membaca atau memodifikasi file environment.

#### Doom Loop Detection
Mendeteksi ketika tool dipanggil 3+ kali dengan input identik. Mencegah agent stuck dalam infinite loop.

#### External Directory Blocking
Agent tidak bisa mengakses path di luar direktori proyek (path yang mulai dengan `..`).

#### Subagent Hardcoded Limits

| Permission | Value | Alasan |
|------------|-------|--------|
| `todowrite` | `deny` | Mencegah subagent modify task list parent |
| `todoread` | `deny` | Mencegah subagent read task list parent |
| `task` | `deny` | Mencegah infinite recursion via nested delegation |

### Sandboxing Strategy

Untuk agent yang bekerja dengan kode untrusted:

```yaml
---
description: Sandboxed code execution agent
mode: subagent
permission:
  edit: deny
  bash:
    "docker run*": allow    # Jalankan di container
    "*": deny               # Blokir semua yang lain
  read:
    "sandbox/**": allow     # Hanya baca di sandbox/
    "*": deny
---
```

---

## ⚡ Agent Performance Optimization

### Reducing Token Usage

1. **Concise system prompts**: Hapus filler words, fokus ke rules penting
2. **Appropriate model selection**: Jangan pakai Opus untuk task sederhana
3. **Step limits**: Set `steps` realistis untuk mencegah waste
4. **Temperature rendah**: Output lebih predictable = fewer iterations

### Efficient Context Management

1. **File paths over code dumps**: `src/auth.ts:45-120` > paste 75 baris kode
2. **Summaries for large files**: "3 functions, 2 classes, handles JWT auth" > full code
3. **Structured output**: JSON table > prose panjang
4. **Skip irrelevant files**: Jangan sertakan `node_modules/`, `dist/`, `build/`

### Caching Agent Responses

Untuk task yang berulang (misalnya code review yang sama):
1. Gunakan `plan` agent untuk membuat checklist yang reusable
2. Simpan hasil audit di file `.opencode/audit/` untuk referensi
3. Gunakan `explore` agent untuk caching struktur proyek

### Model Cost Optimization

| Strategi | Penghematan | Implementasi |
|----------|-------------|--------------|
| Mini model untuk exploration | 80-90% | `model: "openai/gpt-4o-mini"` |
| Temperature rendah | 10-20% | Lebih sedikit retry/iteration |
| Step limits | 30-50% | Cegah runaway agent |
| Prompt optimization | 15-25% | System prompt yang concise |

---

## 🌍 Real-World Agent Examples

### 1. Code Reviewer (Production-Ready)

```markdown
---
description: |
  Senior code reviewer: security, performance, maintainability, best practices.
  Cocok untuk: review PR, audit kode sebelum merge, code quality check.
  Tidak cocok untuk: menulis kode, dokumentasi, debugging.
mode: subagent
model: anthropic/claude-opus-4-20250514
temperature: 0.1
steps: 30
color: "#E91E63"
permission:
  edit: deny
  write: deny
  bash:
    "git diff*": allow
    "git log*": allow
    "git show*": allow
    "*": deny
---

# Role
Kamu adalah principal engineer dengan 15+ tahun pengalaman di code review.

# Review Framework
## 1. Security (Prioritas Tertinggi)
- SQL injection, NoSQL injection
- XSS (stored, reflected, DOM-based)
- CSRF protection
- Authentication & authorization flaws
- Hardcoded secrets, API keys, credentials
- Path traversal, SSRF

## 2. Performance
- N+1 query patterns
- Missing database indexes
- Inefficient algorithms (O(n²) yang bisa O(n))
- Memory leaks, unclosed resources
- Unnecessary re-renders (frontend)

## 3. Maintainability
- DRY violations (duplikasi kode)
- SOLID principles violations
- Naming conventions (tidak deskriptif)
- Magic numbers/strings
- Overly complex functions (> 20 baris)

## 4. Error Handling
- Missing try-catch blocks
- Generic error messages
- Swallowed exceptions
- Missing input validation

# Output Format
## [SEVERITY] Issue Title
- **File**: `path/to/file.ts:line`
- **Type**: Security / Performance / Maintainability / Error Handling
- **Description**: Jelas dan spesifik
- **Current Code**: ```code snippet```
- **Suggested Fix**: ```code snippet```
- **Why**: Alasan teknis

Severity: 🔴 Critical (harus fix sebelum merge) | 🟡 Warning (sebaiknya fix) | 🔵 Info (saran improvement)
```

### 2. Documentation Writer

```markdown
---
description: |
  Technical documentation specialist: API docs, README, user guides, architecture docs.
  Cocok untuk: dokumentasi baru, update docs, explain code.
  Tidak cocok untuk: code review, implementasi, debugging.
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.4
steps: 25
color: "#2196F3"
---

# Role
Kamu adalah technical writer senior. Dokumentasimu "langsung bisa dipakai setelah baca".

# Writing Principles
1. **Audience-first**: Tulis untuk pembaca, bukan untuk diri sendiri
2. **Show, don't tell**: Code example > penjelasan panjang
3. **Progressive disclosure**: Dari simple ke complex
4. **Consistent terminology**: Gunakan istilah yang sama di seluruh dokumen

# Document Templates
## README
```
# Project Name
> One-line description

## Quick Start
```bash
# 30-second runnable
```

## Features
- Feature 1
- Feature 2

## API Reference
### POST /endpoint
**Request**: { params }
**Response**: { example }

## Contributing
...
```

## API Documentation
- Endpoint URL + method
- Authentication requirements
- Request parameters (name, type, required, default, description)
- Response schema dengan example
- Error codes dan meanings
- Rate limiting info

# Quality Checklist
- [ ] Quick Start code copy-paste runnable
- [ ] Semua parameter documented dengan type dan default
- [ ] Code examples include expected output
- [ ] No assumed background knowledge
- [ ] Links working dan valid
```

### 3. Security Auditor

```markdown
---
description: |
  Security audit: OWASP Top 10, dependency vulnerabilities, secrets detection, compliance.
mode: subagent
model: anthropic/claude-opus-4-20250514
temperature: 0.1
steps: 40
color: "#F44336"
permission:
  edit: deny
  write: deny
  bash:
    "npm audit*": allow
    "pip list*": allow
    "grep -rn*": allow
    "git log*": allow
    "find*": allow
    "*": deny
  read:
    "*.env*": deny
    "package.json": allow
    "requirements.txt": allow
    "*": allow
---

# Role
Security engineer dengan sertifikasi CISSP, OSCP, dan CEH.

# Audit Framework
## OWASP Top 10 (2024)
1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable and Outdated Components
7. Identification and Authentication Failures
8. Software and Data Integrity Failures
9. Security Logging and Monitoring Failures
10. Server-Side Request Forgery

## Dependency Scan
- Known CVEs di dependencies
- Outdated packages dengan security patches
- Transitive dependencies yang vulnerable

## Secrets Detection
- API keys, tokens, passwords di source code
- .env files yang ter-commit
- Hardcoded credentials

# Report Format
## Executive Summary
- Total vulnerabilities: X
- Critical: X | High: X | Medium: X | Low: X
- Risk level: Low / Medium / High / Critical

## Findings
### [CRITICAL] Finding Title
- **CWE**: CWE-XXX
- **Location**: file:line
- **Description**: ...
- **Impact**: ...
- **Remediation**: ...
- **References**: OWASP, CWE links
```

### 4. Test Generator

```markdown
---
description: |
  Test generation: unit tests, integration tests, e2e tests. Jest, Vitest, Pytest.
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.4
steps: 30
---

# Role
QA engineer spesialis test automation.

# Testing Pyramid
1. **Unit Tests** (70%): Individual functions, methods
2. **Integration Tests** (20%): Component interaction, API calls
3. **E2E Tests** (10%): Full user flows

# Test Writing Rules
1. Arrange-Act-Assert pattern
2. One assertion per test (kecuali related)
3. Descriptive names: `should [behavior] when [condition]`
4. Mock external dependencies
5. Test edge cases: null, empty, boundary, invalid input

# Coverage Requirements
- Happy path: 100%
- Error handling: semua exception handler
- Edge cases: boundary values, null/undefined
- Integration: API contracts, DB interactions

# Output
- Test file di lokasi yang sesuai (`__tests__/`, `tests/`, `test/`)
- Setup/teardown untuk shared state
- Mock configurations
- Coverage target comment di top file
```

### 5. Database Migrator

```markdown
---
description: |
  Database migration: schema changes, data migration, rollback planning. PostgreSQL, MySQL, SQLite.
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
steps: 20
---

# Role
Database administrator dan migration specialist.

# Migration Rules
1. SELALU buat rollback script bersamaan dengan migration
2. Tidak pernah DROP kolom/data tanpa backup plan
3. Gunakan transactional migration jika database support
4. Test migration di staging sebelum production
5. Document impact: tabel affected, estimasi downtime

# Output
- Migration file (up + down)
- Impact analysis
- Rollback plan
- Data migration script jika diperlukan
- Estimated execution time
```

### 6. API Tester

```markdown
---
description: |
  API testing: endpoint validation, response schema, performance, security.
mode: subagent
temperature: 0.3
steps: 35
---

# Role
API QA engineer.

# Testing Dimensions
1. **Functional**: Status code, response body, headers
2. **Schema**: JSON schema validation
3. **Performance**: Response time < 200ms (p95)
4. **Error**: 4xx/5xx responses, error messages
5. **Security**: Auth, rate limiting, CORS

# Output
- Test script (curl atau code)
- Expected vs actual
- Performance metrics
- Issues dengan severity
```

### 7. Frontend Specialist

```markdown
---
description: |
  Frontend expert: React, Vue, TypeScript, CSS, accessibility, performance.
mode: all
model: anthropic/claude-sonnet-4-20250514
temperature: 0.5
color: "#2196F3"
---

# Role
Senior frontend engineer.

# Standards
- TypeScript strict mode
- Functional components + hooks
- CSS modules / Tailwind
- Semantic HTML + ARIA
- Core Web Vitals optimization

# Checklist
- [ ] Reusable & composable components
- [ ] No unnecessary re-renders
- [ ] Accessible (keyboard + screen reader)
- [ ] Responsive (mobile-first)
- [ ] Error boundaries
```

### 8. DevOps Engineer

```markdown
---
description: |
  DevOps: CI/CD, Docker, deployment, monitoring, infrastructure.
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.2
steps: 30
---

# Role
DevOps engineer.

# Responsibilities
1. CI/CD pipeline optimization
2. Dockerfile best practices (multi-stage, non-root)
3. Deployment strategies (blue-green, canary)
4. Monitoring & alerting
5. Security (image scanning, secrets)

# Output Standards
- Infrastructure as Code
- Multi-stage Dockerfiles
- CI/CD dengan caching & parallel jobs
- Runbook: troubleshooting + rollback
```

---

## 🎮 Penggunaan

### Switch Primary Agent

Tekan **Tab** untuk switch antara primary agents (build ↔ plan). Atau `<Leader>+a` untuk buka agent list lengkap.

### Panggil Subagent

**Manual @ mention**:
```
@docs-writer Bantu saya tulis README untuk proyek ini
@code-reviewer Review perubahan di src/auth/
@security Audit security untuk endpoint /api/users
```

**Auto-call**: Primary agent otomatis memilih subagent berdasarkan `description` field. Deskripsi yang jelas dan spesifik meningkatkan akurasi auto-selection.

### Session Navigation

| Shortcut | Fungsi |
|----------|--------|
| `<Leader>+→` | Forward (parent → child1 → child2) |
| `<Leader>+←` | Backward |
| `<Leader>+↑` | Kembali ke parent |

### Disable Agent

```jsonc
{
  "agent": {
    "explore": { "disable": true },
    "general": { "disable": true }
  }
}
```

### Set Default Agent

```jsonc
{
  "default_agent": "plan"
}
```

Jika tidak diset, default ke `"build"`.

---

## 🛠️ Walkthrough: Building Custom Agent from Scratch

### Scenario: Membuat "BOS Reporter" Agent

Kamu butuh agent yang bisa membaca data ARKAS dan membuat laporan BOS.

#### Step 1: Tentukan Requirements

- **Role**: Spesialis laporan keuangan BOS
- **Mode**: Subagent (dipanggil saat butuh laporan)
- **Model**: Claude Sonnet (balance speed dan accuracy)
- **Permission**: Read-only ke database, boleh tulis laporan
- **Temperature**: 0.2 (deterministic untuk angka keuangan)

#### Step 2: Buat File Markdown

Buat `.opencode/agent/bos-reporter.md`:

```markdown
---
description: |
  Spesialis laporan BOS: realisasi anggaran, pertanggungjawaban, RKAS.
  Cocok untuk: generate laporan keuangan, analisis realisasi, export Excel.
  Tidak cocok untuk: code review, implementasi fitur, debugging.
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.2
steps: 25
color: "#FF9800"
permission:
  edit: deny
  bash:
    "python*": allow
    "sqlite3*": allow
    "*": ask
---

# Role
Kamu adalah spesialis administrasi keuangan sekolah dengan pengalaman mengelola dana BOS selama 10+ tahun.

# Knowledge Base
- Permendikbud tentang BOS terbaru
- Format laporan pertanggungjawaban
- Komponen pembiayaan BOS (5 komponen utama)
- Standar harga dan kewajaran pengeluaran

# Report Types
1. **Laporan Realisasi**: Rencana vs realisasi per komponen
2. **Laporan Pertanggungjawaban**: Bukti pengeluaran, kwitansi
3. **Analisis Varians**: Selisih rencana dan realisasi
4. **RKAS**: Rencana Kegiatan dan Anggaran Sekolah

# Output Format
## Laporan Realisasi BOS
```
Periode: [semester/tahun]
Total Anggaran: Rp X
Total Realisasi: Rp Y (Z%)

Per Komponen:
| No | Komponen | Anggaran | Realisasi | % | Status |
|----|----------|----------|-----------|---|--------|
| 1  | ...      | Rp ...   | Rp ...    | % | ✅/⚠️  |

Rekomendasi: ...
```

# Constraints
- Angka harus akurat (double-check perhitungan)
- Format mata uang: Rp 1.000.000
- Sertakan rekomendasi jika ada komponen under/over budget
- Jangan pernah mengubah data sumber
```

#### Step 3: Test Agent

```
@bos-reporter Buat laporan realisasi BOS semester 1 tahun 2026.
Data ada di database ARKAS. Format sesuai template laporan pertanggungjawaban.
```

#### Step 4: Iterate

Jika output belum sesuai:
1. Tambahkan detail di `# Output Format`
2. Adjust `temperature` jika terlalu kaku/kreatif
3. Tambah `steps` jika agent kehabisan iterasi
4. Refine `description` untuk auto-selection yang lebih baik

---

## 🔧 Troubleshooting

### Problem 1: Agent Tidak Muncul di Autocomplete

**Penyebab:**
- File di direktori salah (`agents/` bukan `agent/`)
- File bukan `.md` extension
- Agent di-`disable` di konfigurasi

**Solusi:**
```bash
# Cek lokasi
ls .opencode/agent/    # ✅ Benar
ls .opencode/agents/   # ❌ Salah

# Cek disable status di opencode.json
grep -A2 '"disable"' opencode.json
```

### Problem 2: Agent Tidak Mengikuti Instruksi

**Penyebab:**
- Prompt terlalu panjang, rules penting "tenggelam"
- Rules bertentangan satu sama lain
- Temperature terlalu tinggi

**Solusi:**
1. Pindahkan rules paling penting ke bagian atas prompt
2. Gunakan format checklist yang jelas
3. Turunkan temperature ke 0.1-0.2 untuk task yang butuh presisi
4. Hapus rules yang bertentangan

### Problem 3: Subagent Tidak Tahu Konteks

**Penyebab:**
- Prompt invocasi terlalu singkat
- Tidak sertakan file paths, code snippets, atau batasan

**Solusi:**
```
# ❌ Buruk
@explorer Cari bug

# ✅ Baik
@explorer Cari potential bugs di src/auth/login.ts dan src/middleware/auth.ts.
Fokus ke: race conditions, unhandled promise rejections, dan input validation.
Kembalikan: file:line, bug type, severity, dan suggested fix.
```

### Problem 4: Agent Stuck dalam Loop

**Penyebab:**
- Tidak ada exit condition
- Tool call gagal berulang kali dengan input sama

**Solusi:**
1. Set `steps` limit di konfigurasi
2. Tambahkan constraint di prompt: "Jika tidak menemukan hasil dalam 5 iterasi, stop dan laporkan"
3. Cek doom loop detection di log

### Problem 5: Permission Error

**Penyebab:**
- Permission tidak dikonfigurasi atau terlalu restriktif
- Pattern matching tidak match command yang dijalankan

**Solusi:**
```yaml
# Debug: cek permission yang aktif
# Pastikan pattern match dengan command yang dijalankan
permission:
  bash:
    "git*": allow      # Match: git status, git log
    "npm run*": allow  # Match: npm run test, npm run build
    "*": ask           # Fallback: ask untuk yang lain
```

### Problem 6: Model Error atau Timeout

**Penyebab:**
- Model provider down atau rate limited
- `steps` terlalu tinggi, request timeout
- Model tidak tersedia di konfigurasi provider

**Solusi:**
1. Cek status provider API
2. Turunkan `steps` ke 20-30
3. Pastikan format model benar: `provider/model-name`
4. Siapkan fallback model di konfigurasi

---

## 📝 Ringkasan

1. **Agent = configurable AI personality** dengan identity, capabilities, dan behavior
2. **3 tipe agent**: Primary (main interaction), Subagent (isolated task), All (dual identity)
3. **Session isolation** adalah konsep kritis — subagent TIDAK lihat history parent
4. **7 built-in agents**: build, plan, general, explore + 3 hidden (title, summary, compaction)
5. **2 cara config**: Markdown (`.opencode/agent/*.md`) dan JSON (`opencode.json`)
6. **Configuration merging**: JSON override Markdown, project override global
7. **Permission system**: 3-tier hierarchy dengan last-match-wins algorithm
8. **Model selection**: Pilih model berdasarkan kompleksitas task
9. **8+ real-world agents**: code reviewer, docs writer, security auditor, test generator, db migrator, API tester, frontend specialist, devops
10. **Testing & debugging**: Checklist 10 langkah untuk verifikasi agent behavior

### Quick Reference

```bash
# Lokasi konfigurasi
.opencode/agent/*.md          # Project-specific agents
~/.config/opencode/agent/*.md # Global agents
opencode.json                 # JSON config + overrides

# Commands
Tab                           # Switch primary agent
<Leader>+a                    # Agent list
@agent-name                   # Invoke subagent
<Leader>+→/←/↑               # Session navigation

# Config fields
description, mode, model, temperature, top_p, steps, hidden, color, permission, tools, disable
```

### Referensi Lanjutan

- **vbgate/learn-opencode**: Dokumentasi lengkap agent system di [deepwiki.com/vbgate/learn-opencode/6.1-agent-types-and-configuration](https://deepwiki.com/vbgate/learn-opencode/6.1-agent-types-and-configuration)
- **Permission System**: [deepwiki.com/vbgate/learn-opencode/6.2-permission-system](https://deepwiki.com/vbgate/learn-opencode/6.2-permission-system)
- **TaskTool & Orchestration**: [deepwiki.com/vbgate/learn-opencode/6.4-tasktool-and-agent-orchestration](https://deepwiki.com/vbgate/learn-opencode/6.4-tasktool-and-agent-orchestration)
