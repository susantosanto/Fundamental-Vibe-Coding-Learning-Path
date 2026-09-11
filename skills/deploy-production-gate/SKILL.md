---
name: deploy-production-gate
description: >-
  Owns production readiness (Bab 22): sets up the CI/CD pipeline
  (lint → typecheck → test → build → audit → deploy), creates the
  GET /health endpoint, configures monitoring (Sentry, UptimeRobot,
  structured logging), moves secrets to environment variables with
  .env.example, documents the deployment strategy and rollback plan, and
  checks the Priority-1 checklist item by item WITH evidence before issuing
  an evidence-based GO / NO-GO decision. Use for the final deployment sprint
  and before every first production deploy. NOT for feature development or
  for bypassing failed gates.
license: MIT
compatibility: Requires any SKILL.md-compatible agent (Freebuff, Claude Code, Codex, opencode, pi, zcode) plus access to the target hosting platform config.
---

# Deploy & Production Readiness Gate

Bab 22 owner — the skill that turns a finished prototype into a
production-ready application. Default stance: the pipeline's other skills end
at "code reviewed"; this skill refuses to let the result stop there
(Bab 22.1: prototype ≠ production).

## Input

- Codebase + `ACCEPTANCE.MD` verdict APPROVED (from `/acceptance-runner`)
- `VERIFICATION-REPORT.MD` + latest `SECURITY-AUDIT-XXX.md` CLEAN
- Target hosting platform (Vercel / Railway / Render / VPS / ...)

If either upstream verdict is missing → stop and run those skills first.
The gate never assumes upstream results.

## Workflow

### Step 1: CI/CD Pipeline

Create `.github/workflows/ci.yml` (template Bab 22.3):

```
lint → typecheck → test → build → npm audit → deploy
```

Every gate must be a real red/green check. **If ANY step fails → deploy is
refused automatically.** Adapt command names to the project's tooling.

### Step 2: Health & Monitoring Minimum (Bab 22.5)

- `GET /health` → `{ "status": "ok" }` (used by uptime monitoring)
- Sentry (free tier) wired for error tracking
- UptimeRobot (free tier) watching the URL — give the user the exact setup
  steps if it needs manual signup
- Structured logging (e.g. pino) with no secrets in log lines

### Step 3: Secrets & Environment

- Every secret moved to environment variables
- `.env.example` lists every variable (no real values)
- `.env` present and gitignored (verified, not assumed)

### Step 4: Deployment Strategy + Rollback

For vibe-coder projects choose the simplest safe strategy (Bab 22.4):
Vercel (frontend) + Railway/Render (backend), dashboard rollback. Write
`docs/DEPLOYMENT.MD`: strategy chosen + why + **step-by-step rollback plan**
(which dashboard, which button, how long it takes). A rollback plan that has
never been read is not a plan — walk the user through it once.

### Step 5: Priority-1 Checklist (Bab 22.2) — item by item, with evidence

```
□ HTTPS aktif                      → bukti: URL https:// resolves
□ Secrets di env vars              → bukti: grep codebase = 0 hardcoded
□ Input divalidasi                 → bukti: validation layer + test
□ Rate limiting aktif              → bukti: config + blocked-request test
□ Error tracking (Sentry)          → bukti: test error muncul di dashboard
□ Uptime monitoring                → bukti: monitor created & green
□ Health endpoint                  → bukti: curl /health output
□ Minimal 5–10 unit tests          → bukti: test runner output
□ CI jalan di push                 → bukti: workflow run link/status
□ Database backup diketahui        → bukti: backup setting + restore step
```

For projects with real users, add the SRE-grade extras (community checklists):
graceful shutdown, structured logs with correlation IDs, DB restore actually
attempted once.

### Step 6: The GO / NO-GO Decision

- **GO** — every P1 item checked with evidence + CI green on the final commit.
- **NO-GO** — anything missing: output the blocker list and route the rework.
  There is no "GO with known critical gaps".

Record the decision via `/state-keeper` (STATE.MD deploy status).

## Rules

MUST:
- Check P1 items one by one, each with concrete evidence
- Refuse deployment whenever any CI gate fails (Bab 22.3)
- Install the monitoring minimum BEFORE any GO
- Prefer the simplest strategy that is safe for the user's skill level
- Document the rollback plan in a way a non-expert can execute

MUST NOT:
- Issue GO with an unchecked P1 box
- Hardcode or "temporarily inline" any secret
- Skip Sentry/uptime monitoring to save setup time
- Deploy on Friday evening "because it's ready" — note the risk and let the
  human decide timing

## False Positives

| You are tempted to | Do instead |
|--------------------|------------|
| "CI was green yesterday" | Verify green on THIS commit |
| "Monitoring nanti saja dulu" | It is a GO condition, not a nice-to-have |
| "Secret satu ini aman di kode" | Move it. There are no safe hardcoded secrets |
| Assume rollback works | Document it and have the human walk through it once |

## Next Step

→ After GO: `/state-keeper` (deploy status + monitoring notes). Production is
now watched by Sentry + UptimeRobot; new work returns to `/sprint-planner`.

## Materi Reference (WAJIB)

Sebelum menjalankan langkah mana pun, baca bab sumbernya lewat skill
`/materi-reference` — folder materi adalah sumber kebenaran, memori model bukan:

- Path: `D:\Programming\fundamental-vibe-coding\architecture-planner\MATERI-PECAHAN\`
- Bab utama skill ini: `22-Standar-Production-Ready.md`
- Kutip aturan/template verbatim + sebut nomor babnya (Bab X.Y) di output.
  Jika ragu: baca dulu, baru bertindak. Jangan mengarang dari ingatan.
