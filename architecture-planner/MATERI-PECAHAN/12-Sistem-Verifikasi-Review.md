## 12. SISTEM VERIFIKASI & REVIEW

### 12.1 Mengapa Verifikasi Itu Penting?

> **💡 Kutipan dari Anthropic:**
> *"Give Claude a check it can run: tests, a build, a screenshot to compare. It's the difference between a session you watch and one you walk away from."*

> **💡 Kutipan dari Chris Titus Tech:**
> *"Spend More Effort on Review Than Generation. This is where most of my AI usage goes."*

### 12.2 Jenis Verifikasi

```
┌─────────────────────────────────────────────────────────────┐
│              JENIS VERIFIKASI                                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. 🧪 AUTOMATED TESTING                                     │
│     ├── Unit tests                                            │
│     ├── Integration tests                                     │
│     ├── E2E tests                                             │
│     └── Test runner: Jest, Vitest, Pytest, dll               │
│                                                               │
│  2. 🔍 LINTING & TYPE CHECK                                  │
│     ├── ESLint, Prettier (JavaScript)                         │
│     ├── mypy (Python)                                         │
│     └── TypeScript compiler                                   │
│                                                               │
│  3. 🏗️ BUILD CHECK                                           │
│     ├── Production build                                      │
│     ├── Bundle size check                                     │
│     └── Dependency audit                                      │
│                                                               │
│  4. 👁️ VISUAL VERIFICATION                                   │
│     ├── Screenshot comparison                                 │
│     ├── Browser testing                                       │
│     └── Responsive design check                               │
│                                                               │
│  5. 🔒 SECURITY CHECK                                        │
│     ├── Dependency vulnerability scan                         │
│     ├── CodeQL analysis                                       │
│     └── Secret detection                                      │
│                                                               │
│  6. 🤖 AI REVIEW (Subagent)                                  │
│     ├── Code review oleh AI lain                              │
│     ├── Fresh context review                                  │
│     └── Adversarial review                                    │
│                                                               │
│  7. 👤 HUMAN REVIEW                                          │
│     ├── Manual code review                                    │
│     ├── Functional testing                                    │
│     └── Acceptance testing                                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 12.3 Workflow Review dari Chris Titus Tech

```
WORKFLOW REVIEW CHRIS TITUS TECH:
═══════════════════════════════════════════════════

1. LOCAL VALIDATION
   ├── git diff --check
   ├── Run formatter & linter
   ├── Run focused tests
   ├── Build production artifact
   └── Screenshot/visual check

2. PULL REQUEST
   ├── Buat PR kecil (small PRs are critical!)
   ├── Terangkan perubahan dengan jelas
   └── Tunggu CI passing

3. INDEPENDENT REVIEW
   ├── CodeRabbit review (AI review)
   ├── Codex/Claude review (AI lain)
   └── Human review (jika ada tim)

4. ADDRESS FEEDBACK
   ├── Review setiap komentar
   ├── Fix root cause, bukan symptom
   ├── Update test jika perlu
   └── Push perbaikan

5. MANUAL VERIFICATION
   ├── Cek diff hanya berisi perubahan yang dimaksud
   ├── Tests & builds passing di commit terakhir
   ├── Independent review selesai
   ├── Documentation match behavior
   └── Feature works di real environment

6. MERGE
   └── Setelah semua gate passed
═══════════════════════════════════════════════════
```

### 12.4 Writer/Reviewer Pattern

> **💡 Kutipan dari Anthropic:**
> *"Use a Writer/Reviewer pattern: Session A (Writer), Session B (Reviewer)."*

```
Pola Writer/Reviewer:
═══════════════════════════════════════════════════

Session A (Writer):
├── Implement fitur sesuai plan
├── Tulis test
└── Laporkan hasil

Session B (Reviewer):
├── Review diff dengan FRESH context
├── Cari edge cases yang terlewat
├── Cek consistency dengan codebase
├── Laporkan gaps (bukan style preferences)
└── Reviewer HANYA mencari correctness issues

Loop:
Writer fix → Re-review → sampai tidak ada critical findings

═══════════════════════════════════════════════════
```

### 12.5 Adversarial Review

> **💡 Kutipan dari Anthropic:**
> *"Before treating a task as done, have a subagent review the diff in a fresh context and report gaps."*

```
CONTOH ADVERSARIAL REVIEW PROMPT:
═══════════════════════════════════════════════════

Use a subagent to review the [feature name] diff 
against PLAN.md. Check that:
1. Every requirement is implemented
2. The listed edge cases have tests
3. Nothing outside the task's scope changed

Report gaps, not style preferences.
Flag only gaps that affect correctness or 
the stated requirements.

═══════════════════════════════════════════════════
```

---

