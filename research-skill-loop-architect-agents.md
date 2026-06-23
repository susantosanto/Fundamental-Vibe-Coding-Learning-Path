# Research Report: AI Agent untuk Arsitektur Desain & Skill Loop Engineering

*Generated: 2026-06-15 | Sources: 35+ | Confidence: High*

---

## Executive Summary

Ekosistem AI coding agent telah berevolusi dari sekadar code generator menjadi **multi-agent architecture system** yang mampu merencanakan, mendesain, mereview, dan mengiterasi software secara otonom. Dua tren utama muncul: **(1) AI Agent khusus Arsitektur Desain** — tools seperti P3X Architect, Arxitect, SweAgent, dan Arc-Agent yang menghasilkan design dossier, enforce software design principles, dan menghasilkan structured artifacts sebelum coding; **(2) Skill Loop Engineering** — mekanisme self-improving loop di mana agent bisa menulis, mengevaluasi, dan mengoptimasi skill mereka sendiri secara recursive tanpa intervensi manusia. Keduanya saling melengkapi: agent arsitektur menghasilkan blueprints, sementara skill loop memastikan agent terus belajar dan memperbaiki diri dari setiap iterasi.

---

## Part 1: AI Agent untuk Software Design Architect

### 1.1 Landscape Tools Arsitektur

#### P3X Architect — Design-Only Dossier Generator
- **Repo**: [github.com/patrikx3/architect](https://github.com/patrikx3/architect)
- **Konsep**: Multi-agent RUP pipeline (OpenAI + Claude) yang **hanya menghasilkan design dossier**, tidak pernah menulis kode
- **Mode**: Pair mode (30-60s) atau full RUP mode dengan 7 roles (1-3 menit)
- **Output**: Vision, requirements, architecture, file_tree, risks, design-findings di folder `agents/`
- **Key Insight**: Memisahkan desain dari implementasi — arsitek hanya mendesain, implementer (manusia atau agent lain) yang mengeksekusi
- **Fitur**: Scans project root untuk mendeteksi layout existing (src/, monorepo, client/server), dossier menyesuaikan dengan struktur yang sudah ada

#### Arxitect — Enforcing Software Design Principles
- **Repo**: [github.com/andonimichael/arxitect](https://github.com/andonimichael/arxitect)
- **Konsep**: Plugin agentic yang **enforce best-practice software design** — API Design, OOD, Clean Architecture
- **Reviewer Spesialis**: 
  - API Design Reviewer — naming, signatures, REST endpoint design
  - OO Design Reviewer — SOLID, DRY, composition vs inheritance
  - Clean Architecture Reviewer — component cohesion (REP, CRP, CCP), coupling (ADP, SDP, SAP)
- **Commands**: `/architect`, `/architecture-review`, `/api-design-review`, `/oo-design-review`, `/clean-architecture-review`
- **Key Insight**: Software design principles weren't just for humans — they reduce context needed for agents, minimize bugs, and make agents more effective

#### SweAgent — Agentic Compiler for SE
- **Repo**: [github.com/sijeeshmiziha/sweagent](https://github.com/sijeeshmiziha/sweagent)
- **Konsep**: Transform natural-language specs menjadi structured blueprints (requirements, data models, APIs, auth, frontend)
- **Pipeline**: Multi-stage (discovery → analysis → design → synthesis) dengan 8+ sequential LLM calls
- **Sub-agent Orchestration**: Data Modeler spawns entity-analyzer + schema-refiner; React Builder uses graphql-analyzer
- **13 Domain Agents**: Planning, requirements, data modeling, API design, auth, architecture
- **Key Insight**: AI coding agents are powerful executors but fail at planning — SweAgent provides the structured planning layer

#### Arc-Agent — System Design CLI
- **Repo**: [github.com/ariel-frischer/arc-agent](https://github.com/ariel-frischer/arc-agent)
- **Konsep**: Go CLI untuk structured system design documents dan Mermaid diagrams
- **Staged workflow**: Requirements → Entities → API → High-level design → Deep dives → Diagrams
- **Structured YAML artifacts** yang bisa di-validasi, di-diff, di-render
- **Multiple runners**: OpenCode, Codex, Claude Code
- **Output**: DESIGN.md, diagram.mmd, SVG/PNG, Excalidraw files

#### The Architect — Autonomous Development Lifecycle
- **Repo**: [github.com/inetanel/the-architect](https://github.com/inetanel/the-architect)
- **Konsep**: Autonomous development lifecycle layer — plan, execute, retry, review, remember
- **Fitur**: Goal-driven planning, context injection, task dependencies, parallel execution, stuck detection, retry with fallbacks (30 retries with different models)
- **Key Insight**: "Solves the orchestration problem, not the coding problem"

#### Genesis Architect — Research-First Scaffolding
- **Repo**: [github.com/maioio/genesis-architect](https://github.com/maioio/genesis-architect)
- **Konsep**: Scan GitHub Issues dari real repos sebelum menulis kode — mine recurring failures, security patches, architecture regrets
- **Process**: Find 15-20 repos → mine 50 closed issues each → synthesize wise average → generate scaffold with mitigations built-in
- **Development Partner Mode**: Asks before major decisions (architecture, MVP scope, tech selection)

### 1.2 Perbandingan Tools Arsitektur

| Tool | Pendekatan | Output | Multi-Agent | Self-Improving |
|------|-----------|--------|-------------|----------------|
| P3X Architect | RUP phases, design-only | Design dossier (MD) | Claude + Codex cross-check | No |
| Arxitect | Design principles enforcement | Code review + implementation | Sub-agents per principle | No |
| SweAgent | Spec → Blueprint compiler | 11-section markdown plan | 13 domain agents | No |
| Arc-Agent | Staged design workflow | YAML artifacts + diagrams | Multiple runners | No |
| The Architect | Autonomous SDLC orchestration | Goal → tasks → execution | Parallel execution | Retry/fallback |
| Genesis Architect | Research-first scaffolding | Scaffold from GitHub issues | N/A | No |

### 1.3 Rekomendasi untuk Arsitektur Desain

**Stack yang Direkomendasikan:**
1. **Planning Phase**: P3X Architect (pair mode untuk quick design, RUP mode untuk subsystem besar)
2. **Design Principles**: Arxitect (auto-trigger saat implementasi)
3. **Spec → Blueprint**: SweAgent (untuk kompleksitas tinggi, 13 domain agents)
4. **Diagram**: Arc-Agent (Go CLI, structured YAML output)

---

## Part 2: Skill Loop Engineering

### 2.1 Apa itu Skill Loop Engineering?

Skill Loop Engineering adalah pola desain di mana AI agent bisa:
1. **Define** — menulis skill baru (SKILL.md + scripts)
2. **Execute** — menjalankan skill dalam workflow
3. **Evaluate** — menilai kualitas output skill
4. **Iterate** — memperbaiki skill berdasarkan evaluasi
5. **Remember** — menyimpan pengetahuan untuk iterasi berikutnya

### 2.2 OpenCode Skills System

**Architecture** ([deepwiki.com/sst/opencode](https://deepwiki.com/sst/opencode/5.7-skills-system)):
- Skills dikelola oleh `Skill.Service` dengan discovery, parsing, filtering
- **Multi-scope discovery**: Global (~/.config/opencode/skills/), Project (.opencode/skills/), Claude-compatible (.claude/skills/), Agent-compatible (.agents/skills/)
- **Permission system**: allow/deny/ask dengan wildcard patterns
- **Agent filtering**: Skills bisa di-filter per agent berdasarkan metadata/permissions
- **Native `skill` tool**: Agent load skill on-demand, content persist dalam conversation

**SKILL.md Format** ([open-code.ai/en/docs/skills](https://open-code.ai/en/docs/skills)):
```yaml
---
name: my-skill
description: What this skill does
---
# Instructions here
```

**Key Capabilities**:
- Compaction resilient (skills survive context compaction)
- Semantic matching (auto-detect relevant skills)
- Superpowers bootstrapping integration

### 2.3 Skill Loop Tools & Frameworks

#### skill-loop — Agentic Skill Orchestrator
- **Repo**: [github.com/takumiyoshikawa/skill-loop](https://github.com/takumiyoshikawa/skill-loop)
- **Konsep**: Chain multiple coding-agent skills dalam loop-based workflow
- **Config**: YAML dengan skills, routing criteria, iteration limits
- **Supported Agents**: Claude Code, Codex, Cursor CLI, OpenCode
- **Flow**: skill-loop reads YAML → invokes agent with skill → router evaluates stdout → advances workflow
- **Routing**: Router agent evaluates skill output against criteria, decides next skill (approve/rework/done/blocked)
- **Schedule**: Cron-based periodic execution (e.g., daily staleness checks)
- **Install**: `npx skills add takumiyoshikawa/skill-loop`

```yaml
name: feature-review
default_entrypoint: 1-impl
max_iterations: 10
router:
  runtime: claude
  model: claude-sonnet-4-6
skills:
  1-impl:
    agent: { runtime: claude }
    next:
      - id: send-review
        skill: 2-review
  2-review:
    agent: { runtime: codex }
    next:
      - id: approve
        criteria: "Review quality sufficient"
        done: true
      - id: rework
        criteria: "Review found issues"
        skill: 1-impl
```

#### skill-forge — Self-Improving Intelligence Amplifier
- **Repo**: [github.com/Adit-Jain-srm/skill-forge](https://github.com/Adit-Jain-srm/skill-forge)
- **Konsep**: Self-improving pipeline: **Hunt → Devour → Judge → Act → Ship → Evolve**
- **18 Skills**: ai-debt-detector, design-system-enforcer, diagnose, mcp-conductor, web-perf, dll
- **TF-IDF Semantic Routing**: Compound skill matching berdasarkan task
- **SkillOpt Loop**: Data-driven prompt optimization — rewrites heuristics based on outcomes
- **Multi-platform**: Cursor, Claude Code, Codex CLI, Gemini CLI, Copilot
- **CLI**: `skill-forge`, `skill-forge route <task>`, `skill-forge create`

#### Skill RSI — Recursive Self-Improvement
- **Repo**: [github.com/justinwetch/Skill-RSI](https://github.com/justinwetch/Skill-RSI)
- **Konsep**: Recursive self-improvement loop — give a goal → writes skill → tests → improves → loops
- **Process**:
  1. Research domain → compile ontology (who serves, what excellence looks like, failure modes)
  2. Deconstruct champion skill into testable surfaces (hypothesis, regression risk, measurement)
  3. Generate challenger (one variable at a time)
  4. Adversarial preflight review
  5. Evaluate challenger vs champion
  6. Promote or keep
  7. Write history + next-loop plan
- **Key Insight**: "Improves skills the way a research lab works — every loop is an experiment whose results are kept"

#### Autopilot Skills — Universal Self-Driving Mission Runner
- **Repo**: [github.com/PresentJay/autopilot-skills](https://github.com/PresentJay/autopilot-skills)
- **Konsep**: Endless **discover → analyze → plan → execute → verify → learn** cycle
- **Works on**: Claude Code, Codex CLI, Cursor, Gemini CLI, 50+ agents
- **Install**: `npx skills add PresentJay/autopilot-skills`
- **Features**: 8-question boot interview, mission-bound governance, self-pacing via ScheduleWakeup

#### Ralph Loops — Iterative Agent Loops
- **Source**: [market.lobehub.com](https://market.lobehub.com/s/skills/omnimasudo-seraphyagent-ralph-loops)
- **Konsep**: Autonomous iterative loops using Ralph Wiggum technique
- **Features**: Non-blocking background execution, heartbeat monitoring, real-time dashboard (localhost:3939)
- **Use cases**: Requirements interviews, system planning, automated code iteration

#### Review Loop — Cross-LLM Code Review
- **Source**: [market.lobehub.com](https://market.lobehub.com/s/skills/stone16-harness-engineering-skills-review-loop)
- **Konsep**: Spawns peer reviewer (Codex, Claude, atau Gemini CLI) → review → fix → re-review → consensus
- **Features**: Git-based scope detection, configurable max_rounds, read_only mode, persistent audit trail

#### Agent Teams: Simplify & Harden
- **Source**: [explainx.ai](https://explainx.ai/skills/pskoett/pskoett-ai-skills/agent-teams-simplify-and-harden)
- **Konsep**: Two-phase team loop — implement → audit (simplify + harden) → fix → re-audit
- **Exit Conditions**: Clean audit, low-only round, or loop cap (3 rounds)
- **Architecture**: Implementation agents (read-write) + Audit agents (read-only)

### 2.4 Academic Research on Self-Improving Agents

#### Skill-Augmented GRPO for Self-Evolution (SAGE)
- **Paper**: [arxiv.org/abs/2512.17102v2](https://arxiv.org/abs/2512.17102v2)
- **Konsep**: RL framework di mana agent dilatih dengan task chains — skill yang dihasilkan di task pertama tersedia untuk task berikutnya
- **Skill-integrated Reward**: Outcome-based reward + skill generation reward + skill usage reward
- **Key Insight**: Skills become immediately applicable to subsequent tasks, enabling cross-task transfer

#### Memento-Skills: Skill-as-Memory
- **Paper**: [arxiv.org/pdf/2603.18743](https://www.arxiv.org/pdf/2603.18743)
- **Konsep**: Treat executable skills as unit of external memory — Read-Write Reflective Learning loop
- **Read phase**: Skill router selects most relevant skill conditioned on stateful prompt
- **Write phase**: Agent updates and expands skill library based on new experience
- **Key Insight**: "Continual learning need not reside in model weights — an ever-growing skill library can serve as a persistent, non-parametric intelligence layer"

#### ASG-SI: Audited Skill-Graph Self-Improvement
- **Paper**: [arxiv.org/pdf/2512.23760](https://www.arxiv.org/pdf/2512.23760)
- **Konsep**: Self-improvement sebagai iterative compilation ke dalam directed skill graph
- **Verifier-Auditor**: Replays candidate skills, produces evidence bundles for promotion decisions
- **Key Insight**: "Treats self-improvement as accumulation of verifiable, reusable capabilities rather than uncontrolled parameter drift"

#### SkillMaster: Autonomous Skill Mastery
- **Paper**: [arxiv.org/html/2605.08693v1](https://arxiv.org/html/2605.08693v1)
- **Konsep**: Agent self-manages skill bank via tool calls — skill management jadi learned RL objective
- **DualAdv-GRPO**: Normalizes advantages separately for task-solving and skill-editing
- **Key Insight**: "Skill changes are generated through tool calls and credited by counterfactual downstream utility"

#### SkillRL: Recursive Skill Evolution
- **Paper**: [arxiv.org/pdf/2602.08234](https://arxiv.org/pdf/2602.08234)
- **Konsep**: Skill library as dynamic component — co-evolves with agent policy during RL
- **Process**: Analyze failure modes → generate new skills → refine existing ones after each validation epoch
- **Key Insight**: "The skill library and the agent's policy co-evolve, maintaining robustness as task complexity increases"

#### OpenSkill: Open-World Self-Evolution
- **Paper**: [arxiv.org/html/2606.06741](https://arxiv.org/html/2606.06741)
- **Konsep**: Bootstrap learning loop from scratch using only open-world resources (docs, repos, papers)
- **3 Stages**: Knowledge acquisition → Leakage-free skill evolution → Zero-shot target evaluation
- **Key Insight**: "Building both skills AND verification signals from scratch — no target-task supervision during learning"

#### Continual Harness: Online Self-Improvement
- **Source**: [sethkarten.ai/continual-harness](https://sethkarten.ai/continual-harness/)
- **Konsep**: Reset-free self-improving harness — agent alternates between acting and refining its own prompt, sub-agents, skills, and memory
- **Key Achievement**: First AI to complete Pokemon Blue, Yellow Legacy (hard mode), and Crystal without lost battle
- **Key Insight**: "Adapts online within a single run — no episode resets required"

### 2.5 Skill Loop Architecture Patterns

#### Pattern 1: Implement → Review → Rework Loop
```
┌─────────┐     ┌──────────┐     ┌────────┐
│ 1-impl  │ ──▶ │ 2-review │ ──▶ │ router │
└─────────┘     └──────────┘     └────────┘
     ▲                │               │
     │                ▼               │
     │         approve/done ◀────────┤
     │                │               │
     └──── rework ◀───┘               │
                                   blocked
```
**Tools**: skill-loop, autopilot-skills

#### Pattern 2: Implement → Audit → Fix → Re-audit Loop
```
┌────────────┐   ┌──────────┐   ┌─────┐
│ implement  │──▶│  audit   │──▶│ fix │
└────────────┘   └──────────┘   └─────┘
     ▲                │            │
     │                ▼            │
     │         all-pass? ◀────────┘
     │           │    │
     │          yes   no
     │           │    │
     └───────────┘    └──▶ next round
```
**Tools**: agent-teams-simplify-and-harden, review-loop

#### Pattern 3: Self-Improvement Loop (Recursive)
```
┌──────────────┐   ┌──────────┐   ┌──────────┐
│ deconstruct  │──▶│ challenger│──▶│ evaluate │
└──────────────┘   └──────────┘   └──────────┘
     ▲                                  │
     │          champion vs challenger  │
     └──── promote or keep ◀────────────┘
```
**Tools**: Skill RSI, skill-forge

#### Pattern 4: Skill-as-Memory Loop
```
┌────────┐    ┌────────┐    ┌────────┐
│  READ  │───▶│ EXECUTE│───▶│ WRITE  │
│ (route)│    │(skill) │    │(learn) │
└────────┘    └────────┘    └────────┘
     ▲                          │
     └──────────────────────────┘
```
**Tools**: Memento-Skills, SkillMaster

---

## Part 3: Integrasi untuk Software Design Architect

### 3.1 Recommended Stack

| Fase | Tool/Skill | Purpose |
|------|-----------|---------|
| **Research** | genesis-architect | Mine GitHub Issues sebelum coding |
| **Planning** | P3X Architect (RUP mode) | Design dossier untuk subsystem |
| **Spec** | SweAgent | 13 domain agents untuk structured specs |
| **Design Review** | Arxitect | Enforce API/OOD/Clean Architecture |
| **Implementation** | skill-loop (impl → review) | Loop-based implementation |
| **Quality** | agent-teams-simplify-and-harden | Implement → audit → fix loop |
| **Self-Improvement** | skill-forge | Hunt → devour → judge → evolve |
| **Continuous** | autopilot-skills | Endless learn cycle |

### 3.2 Install Commands

```bash
# Arsitektur
npx skills add patrikx3/architect
npx skills add andonimichael/arxitect
npx skills add sijeeshmiziha/sweagent

# Skill Loop
npx skills add takumiyoshikawa/skill-loop
npx skills add Adit-Jain-srm/skill-forge
npx skills add PresentJay/autopilot-skills

# Quality Loops
npx skills add pskoett/pskoett-ai-skills/skills/agent-teams-simplify-and-harden
npx skills add stone16-harness-engineering-skills-review-loop
```

### 3.3 OpenCode Configuration

```json
{
  "skills": {
    "paths": [".opencode/skills", ".claude/skills", ".agents/skills"],
    "urls": []
  },
  "permission": {
    "skill": {
      "*": "allow",
      "experimental-*": "ask"
    }
  }
}
```

---

## Key Takeaways

1. **Separation of Concerns**: AI arsitek menghasilkan blueprints/dossiers, AI implementer mengeksekusi — pisahkan keduanya
2. **Skill Loop = Competitive Advantage**: Agent yang bisa improve skills-nya sendiri akan mengungguli agent statis
3. **Evidence-Based Promotion**: academic research menunjukkan skill promotion harus digate dengan verifier/auditor, bukan hanya outcome reward
4. **Cross-Task Transfer**: Skill yang dihasilkan di satu task harus tersedia dan berguna untuk task berikutnya
5. **Multi-Agent Architecture**: Single agent tidak cukup — perlu orchestrator + specialist agents + reviewers

---

## Sources

1. [P3X Architect](https://github.com/patrikx3/architect) — Design-only dossier generator dengan RUP phases
2. [Arxitect](https://github.com/andonimichael/arxitect) — Enforce software design principles via sub-agents
3. [SweAgent](https://github.com/sijeeshmiziha/sweagent) — Agentic compiler for structured blueprints
4. [Arc-Agent](https://github.com/ariel-frischer/arc-agent) — System design CLI dengan Mermaid diagrams
5. [The Architect](https://github.com/inetanel/the-architect) — Autonomous development lifecycle layer
6. [Genesis Architect](https://github.com/maioio/genesis-architect) — Research-first scaffolding from GitHub Issues
7. [skill-loop](https://github.com/takumiyoshikawa/skill-loop) — Agentic skill orchestrator untuk loop-based workflows
8. [skill-forge](https://github.com/Adit-Jain-srm/skill-forge) — 18 self-improving skills dengan SkillOpt loop
9. [Skill RSI](https://github.com/justinwetch/Skill-RSI) — Recursive self-improvement loop grounded in evals
10. [autopilot-skills](https://github.com/PresentJay/autopilot-skills) — Universal self-driving mission runner
11. [OpenCode Skills System](https://deepwiki.com/sst/opencode/5.7-skills-system) — Native skill discovery dan management
12. [OpenCode Skills Docs](https://open-code.ai/en/docs/skills) — SKILL.md format dan permissions
13. [SAGE (arxiv:2512.17102)](https://arxiv.org/abs/2512.17102v2) — Skill Augmented GRPO for self-evolution
14. [Memento-Skills (arxiv:2603.18743)](https://www.arxiv.org/pdf/2603.18743) — Skill-as-memory for continual learning
15. [ASG-SI (arxiv:2512.23760)](https://www.arxiv.org/pdf/2512.23760) — Audited skill-graph self-improvement
16. [SkillMaster (arxiv:2605.08693)](https://arxiv.org/html/2605.08693v1) — Autonomous skill mastery via RL
17. [SkillRL (arxiv:2602.08234)](https://arxiv.org/pdf/2602.08234) — Recursive skill evolution during RL
18. [OpenSkill (arxiv:2606.06741)](https://arxiv.org/html/2606.06741) — Open-world self-evolution framework
19. [Continual Harness](https://sethkarten.ai/continual-harness/) — Online self-improvement for embodied agents

---

## Methodology

Searched 15+ queries across web and academic sources. Analyzed 35+ sources total.
Sub-questions investigated:
- What AI agent tools exist for software design architects?
- How do skill loop mechanisms work in AI agents?
- What are the academic foundations for self-improving skill libraries?
- How do OpenCode, Claude Code, and other agents handle skill discovery and execution?
- What are the best patterns for implement → review → rework loops?
