---
name: state-keeper
description: >-
  Updates the source-of-truth folder files after every workflow stage or
  milestone: STATE.MD (active sprint, history, next steps, blockers, commit
  hash), DECISIONS.MD (ADR-style entries with status), RISKS.MD, QUESTIONS.MD
  — append/update only, exact Bab 7 formats. Use at the close of every stage:
  planning done, sprint finished, decision made, risk found, question
  answered. Also recommends session hygiene (new chat / clear context). NOT
  for writing code or editing sprint pack documents.
license: MIT
compatibility: Requires any SKILL.md-compatible agent (Freebuff, Claude Code, Codex, opencode, pi, zcode).
---

# State Keeper

Cross-stage owner of Pilar #3. The folder is the source of truth; this skill
is the mechanism that keeps it true — "Updated" and "Traceable" (Bab 9.4).
Without it, documents silently rot and the chat history becomes the real
memory again.

## Input

A stage-completion event, for example:
- "Perencanaan sprint 001 selesai"
- "Sprint 002 selesai" (+ builder report, verification verdict)
- "Keputusan baru: pakai ExcelJS"
- "Risiko baru: format Excel tidak konsisten"
- "Pertanyaan baru / pertanyaan terjawab"

## Workflow

### Step 1: Read Current State

Read AGENTS.MD, STATE.MD, DECISIONS.MD, RISKS.MD, QUESTIONS.MD. Never update
blind — sync with what is actually there.

### Step 2: Update Files (append/update only — never rewrite)

- **STATE.MD** — active sprint, status, sprint history row, **next steps**,
  blockers, and the milestone's commit hash (ledger pattern: after context
  loss, trust STATE.MD + git log over anyone's recollection).
- **DECISIONS.MD** — new entry in the format: date, decision, **status**
  (proposed/accepted/superseded — ADR pattern), reason, author, impact.
  Superseding never deletes the old entry.
- **RISKS.MD** — new risks with probability, impact, mitigation. Known risks
  that materialized get a status update, not deletion.
- **QUESTIONS.MD** — open new questions; close answered ones **only with the
  recorded answer** (never close without one).

### Step 3: Sync Docs With Reality

If this stage changed architecture, data model, or API behavior, flag the
matching docs/ file as stale so the next planning sprint refreshes it
(Memory Bank "update after significant change" rule).

### Step 4: Session Hygiene Reminder

New sprint = new chat. Recommend explicitly: "Sprint baru = mulai chat baru /
clear context (Bab 14.3)" — and note that the next session only needs
AGENTS.MD + STATE.MD + the active sprint pack to continue.

### Step 5: Report

Show a compact summary of exactly what changed in each file.

## Rules

MUST:
- Follow the Bab 7.3–7.7 file formats exactly
- Give every decision a Reason + Impact (and a status)
- Record commit hashes for sprint milestones
- Show the change summary to the user after updating

MUST NOT:
- Modify approved sprint pack documents
- Close a question without an answer
- Rewrite history (append/update only)
- Touch src/ or test files (not this skill's job)

## False Positives

| You are tempted to | Do instead |
|--------------------|------------|
| "Small update, no need to read STATE.MD first" | Read first, always — sync beats memory |
| Rewrite STATE.MD from scratch for neatness | Append/update only — audit trail matters |
| Close an old question "because it seems resolved" | Close only with a recorded answer |
| Skip the commit hash "later" | Record it now — this is the recovery map |

## Next Step

→ If a sprint just closed: back to `/sprint-planner` for the next sprint, or
`/deploy-production-gate` if this was the final sprint. If problems remain:
`/acceptance-runner` re-verifies after rework.

## Materi Reference (WAJIB)

Sebelum menjalankan langkah mana pun, baca bab sumbernya lewat skill
`/materi-reference` — folder materi adalah sumber kebenaran, memori model bukan:

- Path: `D:\Programming\fundamental-vibe-coding\architecture-planner\MATERI-PECAHAN\`
- Bab utama skill ini: `07-Penjelasan-Detail-Setiap-File.md` (7.3–7.7), `14-Manajemen-Session-AI.md`
- Kutip aturan/template verbatim + sebut nomor babnya (Bab X.Y) di output.
  Jika ragu: baca dulu, baru bertindak. Jangan mengarang dari ingatan.

## Communication — Caveman Mode (terse output)

Respond in caveman style (see /caveman skill): terse, no filler, fragments OK,
default intensity **full**. Technical terms, error strings, evidence quotes:
always exact. Code, commits, PR content: written normal (caveman boundary).

Auto-clarity override (write FULL clarity, no caveman) for:
- security warnings and findings
- irreversible/destructive actions and confirmations
- GO / NO-GO verdicts and gate decisions
- multi-step instructions where order matters

This is an EXECUTION skill: it conducts NO developer interviews. If required
input is missing, state what is missing in one terse line and stop.
