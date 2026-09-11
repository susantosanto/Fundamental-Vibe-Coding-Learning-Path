---
name: sprint-planner
description: >-
  Assembles the Architect Pack for a sprint: plans sprints 1..N from the PRD,
  tech stack, data model and architecture, then for the active sprint writes
  the four pack documents (REQUIREMENTS.MD, BLUEPRINT.MD with pinned
  dependency versions, ACCEPTANCE.MD with testable Given/When/Then criteria,
  HANDOFF-PROMPT.MD with dry-run-first rules), runs a cross-artifact
  consistency check, and saves a copy to architect-packs/. Use after
  module-planner output is confirmed, or after acceptance-runner rework to
  plan the next sprint. NOT for writing code or choosing the tech stack.
license: MIT
compatibility: Requires any SKILL.md-compatible agent (Freebuff, Claude Code, Codex, opencode, pi, zcode).
---

# Sprint Planner

Stage 3 owner of the Architect-Builder workflow — the assembler. Six planning
skills produce raw material (PRD, stack, data model, architecture); this skill
packages them into the artefact the builder actually works from: the
**Architect Pack** (method Bab 8.4).

## Input

- PRD (from `/prd-generator`)
- Tech stack + ADR entries (from `/tech-stack-advisor`)
- Data model (from `/entity-modeler`)
- Module plan / file list (from `/module-planner`)
- For next sprints: builder report + `VERIFICATION-REPORT.MD` + updated
  STATE.MD / DECISIONS.MD / RISKS.MD / QUESTIONS.MD

## Workflow

### Step 1: Right-Size the Process

Not every change needs the full pack (BMAD right-sized process):

| Change type | Pack depth |
|---|---|
| New feature / new module | Full 4 documents, complete blueprint |
| Small bug fix with known cause | Pack ringkas: goal + 1-paragraph blueprint + 3 acceptance checks |
| Typo / copy change | No sprint — fix directly, log in STATE.MD |

If in doubt, use the full pack. Never skip ACCEPTANCE.MD.

### Step 2: Plan Sprints 1..N

- Order sprints like Bab 10.3: start with Discovery, end with Testing &
  Deployment.
- ONE goal per sprint. If a sprint has two goals, split it.
- Record the plan in STATE.MD (sprint table) — via `/state-keeper` if active.

### Step 3: Write the Four Pack Documents

Write to `planning/sprints/sprint-XXX/`:

1. **REQUIREMENTS.MD** — what & why only. Goals, users, data sources,
   constraints. NO implementation detail.
2. **BLUEPRINT.MD** — how: system sketch, tech stack (from the advisor,
   unchanged), exact file list, dependency table **with pinned versions**
   (`exceljs: 4.4.0` — never `^4.4.0`), tasks broken down to 2–5 minutes each
   with the files each task touches.
3. **ACCEPTANCE.MD** — each criterion in testable Given/When/Then form with
   the exact command to run and the expected observable output. A criterion
   that cannot be mapped to a command + expected output must be rewritten
   until it can. Include 1–2 edge-case scenarios (empty input, partial data).
4. **HANDOFF-PROMPT.MD** — the builder prompt: read pack + AGENTS.MD +
   STATE.MD first, DRY RUN first (report plan, files, dependencies, risks),
   WAIT for approval before coding, and the JANGAN list (no changing
   requirements, no libraries outside BLUEPRINT, no scope creep).

### Step 4: Cross-Artifact Consistency Check (mandatory)

Before handoff, verify — this catches expensive bugs cheaply (spec-kit
`/speckit.analyze` pattern):

```
□ Every REQUIREMENTS item appears in BLUEPRINT (file list or task)
□ Every BLUEPRINT task has at least one ACCEPTANCE criterion
□ ACCEPTANCE criteria do not require features absent from BLUEPRINT
□ Dependencies in BLUEPRINT == dependencies the advisor chose (no drift)
□ One sprint == one goal (no giant-prompt sprint, Bab 17 #6)
```

If a check fails, fix the documents — do not hand off a broken pack.

### Step 5: Save the Pack Copy

Copy the four documents to `architect-packs/architect-pack-XXX.md` (audit
trail, Bab 8.5).

## Rules

MUST:
- Produce all four documents before any handoff (no partial packs)
- Pin every dependency version in BLUEPRINT
- Make ACCEPTANCE criteria runnable commands with expected output
- Run the cross-artifact check and record its result
- Follow the format of Bab 7 for any folder file it updates

MUST NOT:
- Re-decide the tech stack (that is `/tech-stack-advisor` + DECISIONS.MD)
- Put "how" into REQUIREMENTS or "what" into BLUEPRINT
- Create a sprint without acceptance criteria
- Hand off while QUESTIONS.MD has OPEN questions that block this sprint

## False Positives

| You are tempted to | Do instead |
|--------------------|------------|
| One sprint with many goals to "save overhead" | Split — one goal per sprint |
| Loose versions (`^1.2.3`) "for flexibility" | Pin exact versions (Bab 17.2) |
| Acceptance = "works correctly" | Rewrite as Given/When/Then + command |
| Skip the pack copy in architect-packs/ | Always save the copy — audit trail |
| Hand off with open blocking questions | Close them first via QUESTIONS.MD |

## Next Step

→ Hand `HANDOFF-PROMPT.MD` to the builder tool running `/ai-coding-coach`
(MODE DRY RUN). After the sprint: `/acceptance-runner`, then
`/security-dependency-auditor`, then `/state-keeper` closes the loop and
returns here for the next sprint.

## Materi Reference (WAJIB)

Sebelum menjalankan langkah mana pun, baca bab sumbernya lewat skill
`/materi-reference` — folder materi adalah sumber kebenaran, memori model bukan:

- Path: `D:\Programming\fundamental-vibe-coding\architecture-planner\MATERI-PECAHAN\`
- Bab utama skill ini: `08-Workflow-Lengkap-6-Tahap.md` (8.4 Architect Pack), `10-Sprint-Based-Development.md`
- Kutip aturan/template verbatim + sebut nomor babnya (Bab X.Y) di output.
  Jika ragu: baca dulu, baru bertindak. Jangan mengarang dari ingatan.
