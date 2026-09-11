---
name: acceptance-runner
description: >-
  Independently verifies a finished sprint by executing every criterion in the
  sprint's ACCEPTANCE.MD and returning a per-item PASS / FAIL / UNTESTED
  verdict with real evidence (raw test output, build exit codes, screenshots).
  Runs in FRESH context, separate from the coding session, changes no code,
  and judges only what ACCEPTANCE.MD defines. Use whenever the builder reports
  a sprint or task complete — before any security audit or deploy decision.
  NOT for reviewing code style or implementing fixes.
license: MIT
compatibility: Requires any SKILL.md-compatible agent (Freebuff, Claude Code, Codex, opencode, pi, zcode).
---

# Acceptance Runner

Stage 6 (verification) owner — the gate that turns "the builder says it's
done" into "it is provably done". Method references: Bab 12 (Writer/Reviewer
pattern), Bab 17 #4 (TRUST-THEN-VERIFY GAP), plus the community-verified
Iron Law from obra/superpowers `verification-before-completion`.

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you did not run the verification command **in this session**, you cannot
claim it passes. Reporting a verdict without evidence is lying, not verifying.

## Input

- `planning/sprints/sprint-XXX/ACCEPTANCE.MD` (the contract)
- `BLUEPRINT.MD` (for scope) + builder report (claims to check, not trust)
- Access to run tests/build/lint in the project

## Workflow

### Step 1: Load Fresh

Confirm you are NOT the session that wrote the code. If you are, hand this
skill to a fresh context (new session / subagent). A reviewer that inherits
the writer's context reviews its own memories, not the code.

### Step 2: Map Every Criterion to a Command

For each ACCEPTANCE.MD item, identify the command that proves it and the
expected observable output. Criteria that cannot be mapped → record as
`UNTESTED` and report them back to `/sprint-planner` as gaps.

### Step 3: The Gate Function (per criterion)

```
1. IDENTIFY  — what command proves this claim?
2. RUN       — execute the FULL command (fresh, complete)
3. READ      — full output, exit code, count failures
4. VERIFY    — does the output actually confirm the claim?
5. ONLY THEN — record the verdict WITH the evidence
```

### Step 4: Record the Evidence

Write `planning/sprints/sprint-XXX/VERIFICATION-REPORT.MD`:

```markdown
# VERIFICATION-REPORT — Sprint XXX

| # | Kriteria | Perintah | Hasil | Bukti |
|---|----------|----------|-------|-------|
| 1 | Parse Excel valid | npm test -- parser | PASS | "12 passed, 0 failed" |
| 2 | Excel kosong → error rapi | npm test -- parser-empty | FAIL | expected graceful, got throw |
| 3 | Dashboard tampil | (screenshot) | PASS | dashboard-2026-09-11.png |

## GAPS (correctness only)
- Item 2: edge case kosong tidak tertangani...

## Verdict: REWORK (1 FAIL, 0 UNTESTED)
```

### Step 5: Verdict

- **APPROVED** — all criteria PASS with evidence → next:
  `/security-dependency-auditor`
- **REWORK** — any FAIL or load-bearing UNTESTED → return to the builder with
  the gap list.

### Step 6: Bounded Fix Loop

- Rounds 1–3: builder (same context) fixes; re-verify only the failed items.
- Round 4–5 (if still failing): hand rework to a **fresh** builder with a
  stronger model.
- After 5 failed rounds: STOP. Escalate to the human with the full gap list.
  A plan whose every path forward is a guess is not a plan.

## Rules

MUST:
- Run every verification command yourself, this session
- Report GAPS only (correctness) — never style preferences
- Include raw evidence: real command output, exit codes, screenshots
- Judge ONLY what ACCEPTANCE.MD defines (no scope creep)
- Stay read-only on src/ and tests — you verify, you do not fix

MUST NOT:
- Accept "should pass", "probably works", or a builder's success report as
  evidence
- Count a previous run as verification
- Skip UNTESTED items silently — they are gaps

## Evidence Table (what each claim requires)

| Klaim | Butuh | TIDAK cukup |
|-------|-------|-------------|
| Tests pass | output: 0 failures | run sebelumnya |
| Build sukses | exit code 0 | linter lolos |
| Bug fixed | test gejala asli: pass | kode berubah |
| Requirements met | checklist per baris | "tests passing" |
| Agent selesai | git diff shows changes | laporan "success" |

## False Positives

| You are tempted to | Do instead |
|--------------------|------------|
| "Output looks fine, probably passes" | Read the exit code and failure count |
| Suggest a nicer architecture while reviewing | Stop — report gaps only |
| Fix the failing line yourself | Stop — verdict REWORK, builder fixes |
| Mark a flaky test PASS because it passed once | Run again; flaky = FAIL + gap |

## Next Step

→ APPROVED: `/security-dependency-auditor`. REWORK: builder loop (max 5
rounds, then human). After the final sprint APPROVED:
`/deploy-production-gate`, then `/state-keeper`.

## Materi Reference (WAJIB)

Sebelum menjalankan langkah mana pun, baca bab sumbernya lewat skill
`/materi-reference` — folder materi adalah sumber kebenaran, memori model bukan:

- Path: `D:\Programming\fundamental-vibe-coding\architecture-planner\MATERI-PECAHAN\`
- Bab utama skill ini: `12-Sistem-Verifikasi-Review.md`, `21-Agentic-Patterns.md` (pola 8 bounded execution)
- Kutip aturan/template verbatim + sebut nomor babnya (Bab X.Y) di output.
  Jika ragu: baca dulu, baru bertindak. Jangan mengarang dari ingatan.
