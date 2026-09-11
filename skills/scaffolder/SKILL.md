---
name: scaffolder
description: >-
  Creates the complete Architect-Builder project scaffold: folder structure,
  AGENTS.MD router, STATE.MD, DECISIONS.MD, DOMAIN.MD, RISKS.MD, QUESTIONS.MD,
  FILE-INVENTORY.MD, docs/, planning/sprints/, architect-packs/ — every file
  pre-filled with its minimal template. Use at the very start of a new project,
  BEFORE idea-clarifier or any planning. NOT for filling in technical decisions
  or writing application code.
license: MIT
compatibility: Requires any SKILL.md-compatible agent (Freebuff, Claude Code, Codex, opencode, pi, zcode).
---

# Scaffolder

Stage 1 owner of the Architect-Builder workflow. Creates the folder system that
becomes the project's source of truth.

**Pilar #3: "Folder system adalah source of truth — bukan chat history."**
Without a scaffold, every other skill produces documents with no home, and the
source of truth silently drifts back to the chat. This skill runs ONCE at
project start. After it finishes, it never touches the folder again.

## Input

- Project name
- Application type (web app / dashboard / API / automation / Google Apps Script / CLI)
- Builder tool that will be used (Claude Code, Codex, Cursor, ...)

## Workflow

### Step 1: Create the Folder Structure

Create exactly the structure in [references/scaffold-structure.md](references/scaffold-structure.md).
Do not add or remove directories.

### Step 2: Fill Every File With Its Minimal Template

Never leave a file empty. Minimum content per file:

- **AGENTS.MD** → the router: operation model (Architect-Builder), file read
  order (AGENTS → STATE → DECISIONS → DOMAIN → active sprint pack), and builder
  rules: NO coding without an architect pack, ALWAYS dry run first and WAIT for
  approval, ALWAYS report evidence (test output, screenshots).
- **CLAUDE.MD / CODEX.MD** → only rules that change agent behavior for the
  chosen builder tool. Every line must earn its place: "Would removing this
  line cause mistakes? If not, cut it."
- **STATE.MD** → project info, "no sprint yet", empty sprint history table.
- **DECISIONS.MD** → format header only (date / decision / reason / author / impact).
- **DOMAIN.MD** → placeholder sections (company, terminology, users, business rules).
- **RISKS.MD** → format header only (probability / impact / mitigation).
- **QUESTIONS.MD** → format header only (OPEN/CLOSED status).
- **FILE-INVENTORY.MD** → empty inventory table.
- **docs/** → placeholder headers for ARCHITECTURE, DATA-MODEL, API, PERMISSIONS, VALIDATION.
- **planning/sprints/sprint-001/** → create the directory only. Sprint pack
  documents are produced later by `/sprint-planner`.
- **architect-packs/, .claude/, references/, src/** → directories only.

### Step 3: Report

List everything created. State explicitly what was intentionally left unfilled
(all technical decisions) and which skill owns each next step.

## Rules

MUST:
- Fill every file with its minimal template (method Bab 6–7)
- Make AGENTS.MD the complete router: read order + builder rules
- Adapt CLAUDE.MD / CODEX.MD to the user's builder tool

MUST NOT:
- Create files outside the standard structure
- Fill in technical decisions (stack, database, framework — that belongs to
  `/tech-stack-advisor` and `/entity-modeler`)
- Touch the folder again after this run

## False Positives

| You are tempted to | Do instead |
|--------------------|------------|
| Pre-fill STATE.MD with a sprint plan | Leave the sprint table empty — `/sprint-planner` owns that |
| Choose a database or framework "to save time" | Stop — `/tech-stack-advisor` decides |
| Create extra "nice to have" files | Stop — only the standard structure |
| Start asking discovery questions yourself | Stop — hand off to `/idea-clarifier` |

## Next Step

→ `/idea-clarifier` (guided interview → problem brief → fills DOMAIN.MD and QUESTIONS.MD)

## Materi Reference (WAJIB)

Sebelum menjalankan langkah mana pun, baca bab sumbernya lewat skill
`/materi-reference` — folder materi adalah sumber kebenaran, memori model bukan:

- Path: `D:\Programming\fundamental-vibe-coding\architecture-planner\MATERI-PECAHAN\`
- Bab utama skill ini: `06-Struktur-Folder-Proyek.md`, `07-Penjelasan-Detail-Setiap-File.md`
- Kutip aturan/template verbatim + sebut nomor babnya (Bab X.Y) di output.
  Jika ragu: baca dulu, baru bertindak. Jangan mengarang dari ingatan.
