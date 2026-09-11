---
name: security-dependency-auditor
description: >-
  Runs real security and dependency tools (npm audit, secret scanning with
  gitleaks/trufflehog, .env hygiene, input validation, rate limiting checks)
  and compares installed dependencies against BLUEPRINT.MD to catch drift.
  Produces a severity-classified report (Kritis/Tinggi/Sedang/Rendah with
  CWE/OWASP tags) and a CLEAN / FINDINGS gate decision. Use after
  acceptance-runner APPROVED and before deploy-production-gate, and on any
  sprint that added dependencies or touched auth/input. NOT for fixing code
  or upgrading dependencies on its own initiative.
license: MIT
compatibility: Requires any SKILL.md-compatible agent (Freebuff, Claude Code, Codex, opencode, pi, zcode) plus the project's package manager for audit commands.
---

# Security & Dependency Auditor

Bab 13 owner — the mandatory gate between "verified" and "deployable".
Ground rule (Bab 13.1): *LLMs are useful, but they are not reliable dependency
managers or security auditors* — so this skill **runs tools first** and uses
its own reasoning only to triage and classify what the tools found.

## Input

- Codebase + lockfile (package.json / requirements.txt / etc.)
- `BLUEPRINT.MD` of the sprint (dependency baseline)
- `.env.example`, CI config, auth/input-related code paths

## Workflow

### Step 1: Run the Tools (always in this order)

```
1. Dependency vulnerability scan
   Node:    npm audit --audit-level=high   (paste raw output)
   Python:  pip-audit
   Report exit codes and counts verbatim.

2. Secret scan
   gitleaks detect --redact --report-format json
   (pre-commit/CI: blocks secrets before history; fast diff scans)
   trufflehog filesystem . (verifies whether a found secret is LIVE)
   If neither tool is installed: fall back to manual pattern scan
   (sk-, api[_-]?key, password\s*=, BEGIN PRIVATE KEY, JWT secrets)
   and mark the run as MANUAL — recommend installing gitleaks.

3. Environment hygiene
   - .env present AND .env is in .gitignore
   - .env.example exists and documents every variable
   - no real credentials in code or committed files

4. Code-level checks (Checklist P1 Bab 22.2)
   - input validation present on user-facing endpoints (Zod/Joi/Yup or equivalent)
   - rate limiting on login (max ~5 attempts / 5 minutes) and API (≈100 req/min)
   - auth on every endpoint that needs it (OWASP A01)
   - error messages do not leak stack traces or secrets
```

### Step 2: Blueprint Drift Check

Compare installed dependencies against BLUEPRINT.MD:

```
□ Every installed dependency is named in BLUEPRINT.MD
  → anything else = flag "library di luar rencana"
  (builder rule: JANGAN pakai library yang tidak disebutkan)
□ Every version is pinned exactly (no ^ or ~ ranges)
□ No dependency was silently removed
```

### Step 3: Classify Findings

Per finding: severity + tag (CWE ID / OWASP Top 10 category where known) +
evidence (raw tool output line).

| Severity | Meaning | Gate effect |
|----------|---------|-------------|
| KRITIS | exploitable now, or a verified-live secret, or blueprint drift with new network-facing lib | BLOCKS deploy |
| TINGGI | vuln in a direct dependency, missing input validation on an auth path | BLOCKS deploy |
| SEDANG | unverified secret match, missing rate limit, hygiene issue | Must be scheduled; recorded in RISKS.MD |
| RENDAH | informational, dev-only exposure | Log only |

### Step 4: Report

Write `docs/SECURITY-AUDIT-XXX.md` (raw tool outputs + table of findings +
decision). Open items that are not fixed this sprint go to RISKS.MD — hand
that to `/state-keeper`, do not edit it silently.

### Step 5: Gate Decision

- **CLEAN** (no KRITIS/TINGGI open) → next: `/deploy-production-gate`
- **FINDINGS** → REWORK to the builder with the findings list; re-run this
  audit after the fix (bounded by the acceptance-runner loop limit).

## Rules

MUST:
- Run real tools and paste their raw output — never report model opinion as
  scan results
- Compare installed deps vs BLUEPRINT.MD and flag everything unnamed
- Verify Checklist P1 items as a pass condition
- Classify with CWE/OWASP tags so findings are trackable across sprints
- Re-scan every PR/sprint that changed dependencies (a green check from an
  older commit proves nothing about the latest code)

MUST NOT:
- Bypass a KRITIS finding to pass the gate — no exceptions
- Upgrade or downgrade dependencies on its own initiative (scope!)
- Fix code directly — findings and REWORK, not edits
- Commit .env or "temporary" credentials anywhere

## False Positives

| You are tempted to | Do instead |
|--------------------|------------|
| "The code looks safe, skip npm audit" | Run the tool. Opinion is not a scan |
| Ignore a devDependency finding | Log it — dev deps ship to CI runners too |
| Accept `^1.2.3` in lockfile absence | Flag it — unpinned versions are drift |
| Skip re-audit because "nothing changed" | Dependencies changed = re-scan, always |

## Next Step

→ CLEAN: `/deploy-production-gate`. FINDINGS: builder rework → re-run this
skill → then `/state-keeper` records open items in RISKS.MD.

## Materi Reference (WAJIB)

Sebelum menjalankan langkah mana pun, baca bab sumbernya lewat skill
`/materi-reference` — folder materi adalah sumber kebenaran, memori model bukan:

- Path: `D:\Programming\fundamental-vibe-coding\architecture-planner\MATERI-PECAHAN\`
- Bab utama skill ini: `13-Keamanan-Dependency-Check.md`, `22-Standar-Production-Ready.md` (Checklist P1)
- Kutip aturan/template verbatim + sebut nomor babnya (Bab X.Y) di output.
  Jika ragu: baca dulu, baru bertindak. Jangan mengarang dari ingatan.
