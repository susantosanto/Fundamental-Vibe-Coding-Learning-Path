# 08 — Multi-Agent Collaboration

> **Estimasi:** 1 jam | **Level:** Menengah
> **Sumber:** [`feiskyer/claude-code-settings — deep-research`](https://github.com/feiskyer/claude-code-settings/tree/main/skills/deep-research), [`analyticalrohit/awesome-vibe-coding-guide`](https://github.com/analyticalrohit/awesome-vibe-coding-guide)

---

## 📖 TEORI

### Apa itu Multi-Agent Collaboration?

**Multi-agent collaboration** adalah pendekatan di mana **beberapa AI agent bekerja bersama** untuk menyelesaikan tugas yang terlalu kompleks untuk satu agent saja. Ini mirip dengan tim developer manusia yang bekerja bersama, di mana setiap anggota punya role dan keahlian khusus.

Dalam konteks vibe coding, multi-agent collaboration memungkinkan Anda untuk:

1. **Mempercepat development** — Parallel execution mengurangi waktu total
2. **Meningkatkan kualitas** — Setiap agent fokus pada area keahliannya
3. **Menangani kompleksitas** — Tugas besar dipecah jadi bagian-bagian kecil
4. **Simulasi tim** — Satu orang bisa "memimpin" tim AI virtual

### Analogi: Tim Developer

```
Tim Developer Tradisional:
┌─────────────────────────────────────────────┐
│              Project Manager                │
│  (Koordinasi, planning, review)             │
└──────┬──────────┬──────────┬────────────────┘
       │          │          │
       ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Backend  │ │ Frontend │ │ QA/Test  │
│ Developer│ │ Developer│ │ Engineer │
└──────────┘ └──────────┘ └──────────┘

Tim Multi-Agent AI:
┌─────────────────────────────────────────────┐
│              Orchestrator Agent             │
│  (Koordinasi, planning, review)             │
└──────┬──────────┬──────────┬────────────────┘
       │          │          │
       ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Backend  │ │ Frontend │ │ QA/Test  │
│ Agent    │ │ Agent    │ │ Agent    │
└──────────┘ └──────────┘ └──────────┘

Hasil: Sama, tapi AI team bisa bekerja 24/7 tanpa lelah!
```

### Kapan Menggunakan Multi-Agent?

| **Cocok Multi-Agent** | **Tidak Cocok Multi-Agent** |
|---|---|
| Project besar dengan banyak komponen | Fitur kecil (1-2 file) |
| Tasks yang bisa diparalelkan | Tasks yang harus sequential |
| Butuh expertise berbeda (backend, frontend, docs) | Tasks yang butuh satu context utuh |
| Deadline ketat, perlu percepat | Tidak ada urgency |
| Code review yang thorough | Review sederhana |
| Dokumentasi lengkap (API, user guide, changelog) | Dokumentasi minimal |

### Keuntungan Multi-Agent vs Single Agent

```
Single Agent:
┌─────────────────────────────────────────────┐
│ 1 Agent mengerjakan semua                   │
│ Waktu: 100 menit (sequential)               │
│ Context: Satu agent handle semua            │
│ Risiko: Agent fatigue, context loss         │
└─────────────────────────────────────────────┘

Multi-Agent (3 agents, parallel):
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Agent A      │ │ Agent B      │ │ Agent C      │
│ 30 menit     │ │ 35 menit     │ │ 25 menit     │
│              │ │              │ │              │
│              │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
       │               │               │
       └───────────────┼───────────────┘
                       ▼
              Merge: 10 menit
              Total: 45 menit (vs 100 menit)
              Speedup: 2.2x
```

---

## 👥 AGENT ROLES AND RESPONSIBILITIES

### Role-Based Agent Assignment

Dalam multi-agent system, setiap agent diberi **role** spesifik dengan **responsibilities** yang jelas:

#### 1. Architect Agent

**Role**: Merancang arsitektur sistem dan technical decisions.

```
Responsibilities:
- Desain sistem secara keseluruhan
- Pilih tech stack dan libraries
- Desain database schema
- Desain API contracts
- Buat technical specification

Output yang dihasilkan:
- Architecture document
- Database schema
- API specification
- Tech stack recommendation
- File structure

Skills yang dibutuhkan:
- System design expertise
- Knowledge of best practices
- Understanding of tradeoffs
```

#### 2. Backend Agent

**Role**: Implementasi backend logic dan API.

```
Responsibilities:
- Implementasi models/data access layer
- Implementasi API endpoints
- Business logic implementation
- Error handling
- Database migrations

Output yang dihasilkan:
- Backend source code
- API implementations
- Database migrations
- Backend unit tests

Skills yang dibutuhkan:
- Server-side programming
- Database design
- API development
- Security best practices
```

#### 3. Frontend Agent

**Role**: Implementasi user interface dan client-side logic.

```
Responsibilities:
- Implementasi UI components
- Client-side state management
- API integration (fetch calls)
- Form validation
- Responsive design

Output yang dihasilkan:
- Frontend source code
- UI components
- CSS/styling
- Frontend unit tests

Skills yang dibutuhkan:
- HTML/CSS/JavaScript
- UI/UX best practices
- Client-side frameworks
- Accessibility
```

#### 4. QA/Test Agent

**Role**: Menulis dan menjalankan tests.

```
Responsibilities:
- Write unit tests
- Write integration tests
- Write E2E tests
- Run test suite
- Report failures

Output yang dihasilkan:
- Test files
- Test coverage report
- Bug reports
- Test execution logs

Skills yang dibutuhkan:
- Testing frameworks
- Test design patterns
- Edge case identification
- Debugging
```

#### 5. Documentation Agent

**Role**: Menulis dokumentasi.

```
Responsibilities:
- API documentation
- README.md
- User guides
- Changelog
- Code comments review

Output yang dihasilkan:
- README.md
- API docs (OpenAPI/Swagger)
- User guide
- Developer guide
- Changelog

Skills yang dibutuhkan:
- Technical writing
- Documentation tools
- API documentation standards
- Markdown proficiency
```

#### 6. Reviewer Agent

**Role**: Code review dan quality assurance.

```
Responsibilities:
- Review code dari agent lain
- Check coding standards
- Identify potential bugs
- Suggest improvements
- Security review

Output yang dihasilkan:
- Code review comments
- Quality report
- Security findings
- Improvement suggestions

Skills yang dibutuhkan:
- Code review experience
- Security awareness
- Best practices knowledge
- Attention to detail
```

### Role Assignment Matrix

Berikut adalah contoh role assignment untuk project "Sistem Absensi Sekolah":

| Agent | Role | Tasks | Output |
|---|---|---|---|
| Agent 1 | Architect | Desain DB, API spec, file structure | architecture.md, api-spec.json |
| Agent 2 | Backend | Models, routes, middleware | src/models/, src/routes/ |
| Agent 3 | Frontend | HTML pages, JS, CSS | public/*.html, public/js/, public/css/ |
| Agent 4 | QA | Unit tests, integration tests | tests/ |
| Agent 5 | Docs | README, API docs, user guide | docs/, README.md |
| Agent 6 | Reviewer | Review semua kode | review-report.md |

---

## 🔗 AGENT COMMUNICATION PATTERNS

### Pattern 1: Hub-and-Spoke (Orchestrator-Centric)

Pattern paling umum — satu orchestrator agent berkomunikasi dengan semua worker agents.

```
┌─────────────────────────────────────────────┐
│              Orchestrator Agent             │
│                                             │
│  - Menerima goal dari user                  │
│  - Memecah jadi sub-tasks                   │
│  - Mendistribusikan ke worker agents        │
│  - Mengumpulkan hasil                       │
│  - Merge dan deliver final result           │
└──────┬──────────┬──────────┬────────────────┘
       │          │          │
       ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Backend  │ │ Frontend │ │ QA Agent │
│ Agent    │ │ Agent    │ │          │
│          │ │          │ │          │
│ Result ──┼─┼──────────┼─┼── Result │
└──────────┘ └──────────┘ └──────────┘
       │          │          │
       └──────────┼──────────┘
                  ▼
         Orchestrator merges
         and delivers result
```

**Kelebihan:**
- Simple dan mudah dipahami
- Orchestrator punya full control
- Mudah tracking progress

**Kekurangan:**
- Orchestrator bisa jadi bottleneck
- Single point of failure

**Cocok untuk:** Project dengan scope jelas, tasks bisa diparalelkan

### Pattern 2: Pipeline (Sequential)

Agents bekerja secara berurutan, output dari satu agent jadi input untuk agent berikutnya.

```
User Goal
    │
    ▼
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Architect│───→│ Backend  │───→│ Frontend │───→│ QA Agent │
│ Agent    │    │ Agent    │    │ Agent    │    │          │
│          │    │          │    │          │    │          │
│ Spec ────┘    │ Code ────┘    │ UI ──────┘    │ Tests ───┘
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

**Kelebihan:**
- Dependencies terkelola dengan baik
- Setiap agent punya context lengkap dari sebelumnya
- Hasil lebih konsisten

**Kekurangan:**
- Tidak bisa parallel (lebih lambat)
- Bottleneck di agent yang lambat

**Cocok untuk:** Tasks dengan dependency kuat, output satu agent jadi input agent lain

### Pattern 3: Peer-to-Peer (Collaborative)

Agents bisa berkomunikasi langsung satu sama lain tanpa melalui orchestrator.

```
┌──────────┐         ┌──────────┐
│ Backend  │◄───────►│ Frontend │
│ Agent    │  API    │ Agent    │
│          │ contract│          │
└──────────┘         └──────────┘
     ▲                     ▲
     │                     │
     │                     │
┌──────────┐         ┌──────────┐
│ QA Agent │◄───────►│   Docs   │
│          │  Tests  │  Agent   │
└──────────┘         └──────────┘
```

**Kelebihan:**
- Flexible dan adaptif
- Agents bisa resolve conflicts langsung
- Lebih resilient

**Kekurangan:**
- Kompleks untuk di-manage
- Risiko inconsistency
- Harder to debug

**Cocok untuk:** Tasks yang butuh kolaborasi erat antar agents

### Pattern 4: Hierarchical (Multi-Level)

Orchestrator punya sub-orchestrators yang manage kelompok agents.

```
┌─────────────────────────────────────────────┐
│              Main Orchestrator              │
└──────┬──────────────────────┬───────────────┘
       │                      │
       ▼                      ▼
┌──────────────┐      ┌──────────────┐
│ Sub-Orch:    │      │ Sub-Orch:    │
│ Backend Team │      │ Frontend Team│
└──┬───────┬───┘      └──┬───────┬───┘
   │       │              │       │
   ▼       ▼              ▼       ▼
┌─────┐ ┌─────┐      ┌─────┐ ┌─────┐
│Model│ │Route│      │  UI │ │ CSS │
│Agent│ │Agent│      │Agent│ │Agent│
└─────┘ └─────┘      └─────┘ └─────┘
```

**Kelebihan:**
- Scale ke banyak agents
- Organized by domain
- Each sub-team bisa parallel

**Kekurangan:**
- Overhead koordinasi
- Kompleksitas tinggi

**Cocok untuk:** Project sangat besar (100+ files, multiple modules)

### Communication Protocol

Agents berkomunikasi melalui **artifacts** (file-based communication):

```
Communication via shared files:

/shared/
├── spec/
│   ├── api-spec.json        # Architect → Backend, Frontend
│   └── db-schema.sql        # Architect → Backend
├── backend/
│   ├── models/              # Backend output
│   └── routes/              # Backend output
├── frontend/
│   ├── components/          # Frontend output
│   └── pages/               # Frontend output
├── tests/
│   ├── unit/                # QA output
│   └── integration/         # QA output
└── docs/
    ├── README.md            # Docs output
    └── api-docs.md          # Docs output

Status file:
├── task_status.json         # Orchestrator tracks all tasks
└── communication_log.md     # Log semua inter-agent communication
```

---

## 🧩 TASK DECOMPOSITION FOR MULTI-AGENT

### Prinsip Task Decomposition

Task decomposition adalah proses **memecah tugas besar** menjadi **sub-tasks kecil** yang bisa dikerjakan oleh agents berbeda.

#### Prinsip 1: Independence

Sub-tasks harus **independen** sebanyak mungkin agar bisa dikerjakan parallel.

```
❌ Dependent tasks (harus sequential):
Task A: Buat database schema
Task B: Buat models (butuh schema dari Task A)
Task C: Buat API endpoints (butuh models dari Task B)

✅ Independent tasks (bisa parallel):
Task A: Buat database schema
Task B: Buat UI components (tidak butuh schema)
Task C: Buat CSS styling (tidak butuh schema)
Task D: Buat README.md (tidak butuh code)
```

#### Prinsip 2: Cohesion

Setiap sub-task harus **cohesive** — fokus pada satu area/domain.

```
✅ Cohesive decomposition:
- Backend agent: Semua backend code (models, routes, middleware)
- Frontend agent: Semua frontend code (HTML, JS, CSS)
- QA agent: Semua test files
- Docs agent: Semua documentation

❌ Non-cohesive decomposition:
- Agent 1: Model User + UI Login Page + Test Login
- Agent 2: Model Siswa + UI Dashboard + Test Dashboard
(Masalah: Setiap agent harus switch context antara backend, frontend, testing)
```

#### Prinsip 3: Balanced Workload

Sub-tasks harus memiliki **workload yang seimbang** agar tidak ada agent yang idle.

```
✅ Balanced:
Agent 1: 5 tasks × ~10 menit = 50 menit
Agent 2: 5 tasks × ~10 menit = 50 menit
Agent 3: 5 tasks × ~10 menit = 50 menit

❌ Unbalanced:
Agent 1: 10 tasks × ~10 menit = 100 menit
Agent 2: 2 tasks × ~10 menit = 20 menit
Agent 3: 1 task × ~10 menit = 10 menit
(Agent 2 dan 3 idle 80 menit)
```

### Task Decomposition Framework

Berikut adalah framework untuk melakukan task decomposition:

```markdown
# Task Decomposition: [Project Name]

## 1. Identify Major Components
- Component A: [Deskripsi]
- Component B: [Deskripsi]
- Component C: [Deskripsi]

## 2. Map Components to Agent Roles
- Component A → Agent Role X
- Component B → Agent Role Y
- Component C → Agent Role Z

## 3. Break Down Each Component
### Component A (Agent X)
- Task A.1: [Deskripsi] — Estimate: X menit
- Task A.2: [Deskripsi] — Estimate: X menit
- Task A.3: [Deskripsi] — Estimate: X menit

### Component B (Agent Y)
- Task B.1: [Deskripsi] — Estimate: Y menit
- Task B.2: [Deskripsi] — Estimate: Y menit

### Component C (Agent Z)
- Task C.1: [Deskripsi] — Estimate: Z menit
- Task C.2: [Deskripsi] — Estimate: Z menit

## 4. Identify Dependencies
- Task A.2 depends on Task A.1
- Task B.1 depends on Task A.1 (API spec)
- Task C.1 has no dependencies

## 5. Create Execution Plan
### Wave 1 (Parallel): A.1, C.1
### Wave 2 (Parallel): A.2, B.1, C.2
### Wave 3 (Parallel): A.3, B.2
### Wave 4 (Sequential): Integration & Testing
```

### Contoh: Task Decomposition untuk "Sistem Absensi"

```markdown
# Task Decomposition: Sistem Absensi Sekolah

## 1. Major Components
- Backend API (Express + SQLite)
- Frontend UI (HTML + CSS + JS)
- Testing Suite
- Documentation

## 2. Component → Agent Mapping
- Backend API → Backend Agent
- Frontend UI → Frontend Agent
- Testing Suite → QA Agent
- Documentation → Docs Agent

## 3. Breakdown

### Backend Agent (Estimate: 60 menit)
- B.1: Setup project & database schema (10 min)
- B.2: Implement User model + auth (15 min)
- B.3: Implement Siswa & Kelas models (10 min)
- B.4: Implement Absensi model (10 min)
- B.5: Implement API endpoints (15 min)

### Frontend Agent (Estimate: 50 menit)
- F.1: Setup HTML structure (10 min)
- F.2: Implement login page (10 min)
- F.3: Implement absensi input page (15 min)
- F.4: Implement rekap page (15 min)

### QA Agent (Estimate: 40 menit)
- Q.1: Write unit tests untuk models (15 min)
- Q.2: Write integration tests untuk API (15 min)
- Q.3: Write E2E tests untuk user flows (10 min)

### Docs Agent (Estimate: 30 menit)
- D.1: Write README.md (10 min)
- D.2: Generate API documentation (10 min)
- D.3: Write user guide (10 min)

## 4. Dependencies
- F.2 depends on B.2 (auth API harus ready)
- F.3 depends on B.4, B.5 (absensi API harus ready)
- Q.1 depends on B.2, B.3, B.4 (models harus ready)
- Q.2 depends on B.5 (endpoints harus ready)
- D.2 depends on B.5 (API harus ready)

## 5. Execution Plan

### Wave 1 (Parallel): B.1, F.1, D.1
- Backend setup, Frontend setup, README draft
- Duration: 10 menit

### Wave 2 (Parallel): B.2, B.3, B.4, F.2, D.3
- Models development, Login page, User guide
- Duration: 15 menit (B.2 is longest)

### Wave 3 (Parallel): B.5, F.3, F.4
- API endpoints, Absensi page, Rekap page
- Duration: 15 menit

### Wave 4 (Sequential): Q.1, Q.2
- Unit tests, Integration tests
- Duration: 30 menit

### Wave 5 (Parallel): Q.3, D.2
- E2E tests, API docs
- Duration: 10 menit

### Wave 6 (Sequential): Integration & Final Review
- Integration testing, bug fixes, final polish
- Duration: 15 menit

Total sequential estimate: 60 + 50 + 40 + 30 = 180 menit
Total parallel estimate: 10 + 15 + 15 + 30 + 10 + 15 = 95 menit
Speedup: 1.9x
```

---

## ⚔️ CONFLICT RESOLUTION BETWEEN AGENTS

### Jenis Konflik yang Mungkin Terjadi

#### 1. API Contract Conflicts

Backend agent dan Frontend agent tidak sepakat tentang format API.

```
Masalah:
Backend Agent: POST /api/absensi
  Request: { tanggal: "2025-01-15", entries: [...] }
  Response: { success: true, count: 25 }

Frontend Agent: POST /api/absensi
  Request: { date: "2025-01-15", data: [...] }
  Response: { status: "ok", total: 25 }

Solusi:
Orchestrator menetapkan API contract di awal:
- Semua agents harus mengikuti spec di /shared/spec/api-spec.json
- Backend agent implement sesuai spec
- Frontend agent consume sesuai spec
- QA agent test sesuai spec
```

#### 2. Data Model Conflicts

Dua agents mendefinisikan model yang berbeda untuk entity yang sama.

```
Masalah:
Backend Agent: Siswa model
  { id, nisn, nama, kelas_id, ttl }

Docs Agent: Siswa entity documentation
  { id, nisn, nama_lengkap, kelas, tanggal_lahir }

Solusi:
- Architect Agent menetapkan canonical data model
- Semua agents reference model yang sama
- Gunakan single source of truth (schema file)
```

#### 3. Naming Convention Conflicts

Agents menggunakan naming convention yang berbeda.

```
Masalah:
Backend Agent: camelCase (userId, createdAt)
Frontend Agent: snake_case (user_id, created_at)
QA Agent: PascalCase (UserId, CreatedAt)

Solusi:
- Orchestrator menetapkan coding standard di awal
- Masukkan standard ke context file setiap agent
- Reviewer agent check consistency
```

#### 4. Dependency Version Conflicts

Agents menggunakan versi library yang berbeda.

```
Masalah:
Backend Agent: express@4.18.2
QA Agent: supertest@6.3.3 (compatible dengan express@4.x)
Docs Agent: Contoh code pakai express@5.x syntax

Solusi:
- Architect Agent menetapkan tech stack dengan versi spesifik
- Semua agents gunakan versi yang sama
- package.json sebagai single source of truth
```

### Conflict Resolution Framework

```markdown
# Conflict Resolution Protocol

## Step 1: Identify Conflict
- Agent A reports: "I found inconsistency in [area]"
- Agent B reports: "I found inconsistency in [area]"
- Orchestrator logs conflict in /shared/conflicts.md

## Step 2: Analyze Impact
- Orchestrator assess: How many agents affected?
- Check: Is this a breaking change?
- Check: Does this affect deliverables?

## Step 3: Resolve
- Orchestrator makes decision based on:
  a. Architecture spec (if exists)
  b. Best practices
  c. Team consensus (if needed)
- Decision documented in /shared/decisions.md

## Step 4: Communicate
- Orchestrator notifies all affected agents
- Agents update their work accordingly
- QA agent adds test case for this scenario

## Step 5: Prevent Recurrence
- Update context files with resolved decision
- Add to coding standards
- Reviewer agent checks for similar issues
```

---

## 🎭 AGENT ORCHESTRATION

### Orchestrator Responsibilities

Orchestrator agent adalah "project manager" dari multi-agent system:

```
Responsibilities:
1. Task Planning
   - Decompose goal into tasks
   - Assign tasks to agents
   - Set priorities and deadlines

2. Resource Management
   - Allocate agents to tasks
   - Manage dependencies
   - Balance workload

3. Progress Tracking
   - Monitor each agent's progress
   - Update task status
   - Report to user

4. Conflict Resolution
   - Detect inconsistencies
   - Make decisions
   - Communicate changes

5. Quality Control
   - Review deliverables
   - Run integration tests
   - Ensure consistency

6. Delivery
   - Merge all outputs
   - Final verification
   - Deliver to user
```

### Orchestrator Implementation

```markdown
# Orchestrator Workflow

## Phase 1: Initialization
1. Receive goal from user
2. Load context files
3. Analyze goal complexity
4. Determine required agents
5. Create execution plan

## Phase 2: Task Distribution
1. Decompose goal into tasks
2. Assign tasks to agents
3. Share context with each agent
4. Set communication channels

## Phase 3: Execution Monitoring
1. Poll each agent for status
2. Update progress dashboard
3. Handle blockers and issues
4. Rebalance if needed

## Phase 4: Integration
1. Collect all deliverables
2. Run integration tests
3. Resolve conflicts
4. Merge outputs

## Phase 5: Delivery
1. Final verification
2. Generate summary report
3. Deliver to user
4. Archive session data
```

### Orchestrator Configuration

```json
{
  "orchestrator": {
    "project_name": "Sistem Absensi Sekolah",
    "agents": {
      "architect": {
        "id": "agent-architect-001",
        "role": "architect",
        "context_files": ["./context/architect.md"],
        "output_dir": "./shared/spec/"
      },
      "backend": {
        "id": "agent-backend-001",
        "role": "backend",
        "context_files": ["./context/backend.md", "./shared/spec/api-spec.json"],
        "output_dir": "./src/"
      },
      "frontend": {
        "id": "agent-frontend-001",
        "role": "frontend",
        "context_files": ["./context/frontend.md", "./shared/spec/api-spec.json"],
        "output_dir": "./public/"
      },
      "qa": {
        "id": "agent-qa-001",
        "role": "qa",
        "context_files": ["./context/qa.md", "./shared/spec/api-spec.json"],
        "output_dir": "./tests/"
      },
      "docs": {
        "id": "agent-docs-001",
        "role": "docs",
        "context_files": ["./context/docs.md"],
        "output_dir": "./docs/"
      },
      "reviewer": {
        "id": "agent-reviewer-001",
        "role": "reviewer",
        "context_files": ["./context/reviewer.md"],
        "output_dir": "./reviews/"
      }
    },
    "execution_plan": {
      "waves": [
        {
          "wave": 1,
          "tasks": ["architect:spec", "docs:readme-draft"],
          "parallel": true
        },
        {
          "wave": 2,
          "tasks": ["backend:models", "frontend:setup", "docs:user-guide"],
          "parallel": true
        },
        {
          "wave": 3,
          "tasks": ["backend:api", "frontend:pages"],
          "parallel": true
        },
        {
          "wave": 4,
          "tasks": ["qa:tests"],
          "parallel": false
        },
        {
          "wave": 5,
          "tasks": ["reviewer:review", "docs:api-docs"],
          "parallel": true
        }
      ]
    },
    "communication": {
      "shared_dir": "./shared/",
      "status_file": "./shared/task_status.json",
      "conflict_file": "./shared/conflicts.md",
      "decision_file": "./shared/decisions.md"
    }
  }
}
```

---

## ⚡ PARALLEL VS SEQUENTIAL AGENT EXECUTION

### Parallel Execution

Agents bekerja **bersamaan** pada tasks yang independen.

```
Parallel Execution:
Time: 0 min     10 min    20 min    30 min    40 min
      │         │         │         │         │
Agent A: [Task 1] [Task 2] [Task 3]
Agent B: [Task 4] [Task 5]
Agent C: [Task 6] [Task 7] [Task 8] [Task 9]
      │         │         │         │         │
      └─────────┴─────────┴─────────┴─────────┘
                    Total: 40 menit
```

**Kapan pakai parallel:**
- Tasks independen (tidak ada dependency)
- Agents tidak perlu share state
- Resources cukup untuk semua agents
- Speed adalah prioritas

**Risiko parallel:**
- Race conditions (agents modify same file)
- Inconsistent state (agents out of sync)
- Resource contention (memory, CPU)

### Sequential Execution

Agents bekerja **satu per satu**, output dari satu agent jadi input untuk agent berikutnya.

```
Sequential Execution:
Time: 0 min     10 min    20 min    30 min    40 min    50 min
      │         │         │         │         │         │
Agent A: [Task 1]
                   │
Agent B:           [Task 2]
                              │
Agent C:                      [Task 3]
                                         │
Agent A:                                 [Task 4]
                                                    │
Agent B:                                           [Task 5]
      │         │         │         │         │         │
      └─────────┴─────────┴─────────┴─────────┴─────────┘
                          Total: 50 menit
```

**Kapan pakai sequential:**
- Tasks punya dependency kuat
- Output satu agent jadi input agent lain
- Konsistensi lebih penting dari speed
- Resources terbatas

**Risiko sequential:**
- Lebih lambat (no parallelism)
- Bottleneck di agent yang lambat
- Agent idle saat menunggu

### Hybrid Execution (Recommended)

Kombinasi parallel dan sequential — parallel dalam waves, sequential antar waves.

```
Hybrid Execution:
Wave 1 (Parallel): 10 min
Agent A: [Task 1]
Agent B: [Task 2]
Agent C: [Task 3]

Wave 2 (Parallel): 15 min
Agent A: [Task 4] (depends on Task 1)
Agent B: [Task 5] (depends on Task 2)
Agent C: [Task 6] (depends on Task 3)

Wave 3 (Sequential): 20 min
Agent A: [Task 7] (depends on Task 4, 5, 6)
Agent B: [Task 8] (depends on Task 7)

Wave 4 (Parallel): 10 min
Agent A: [Task 9]
Agent C: [Task 10]

Total: 10 + 15 + 20 + 10 = 55 menit
(vs 100 menit full sequential)
```

### Decision Matrix: Parallel vs Sequential

| Faktor | Parallel | Sequential | Hybrid |
|---|---|---|---|
| Speed | ✅ Tercepat | ❌ Ter lambat | ⚡ Medium |
| Konsistensi | ⚠️ Risiko | ✅ Terjamin | ✅ Terjamin |
| Complexity | ⚠️ Tinggi | ✅ Rendah | ⚡ Medium |
| Resource Usage | ⚠️ Tinggi | ✅ Rendah | ⚡ Medium |
| Debugging | ❌ Sulit | ✅ Mudah | ⚡ Medium |

---

## 🐛 MULTI-AGENT DEBUGGING

### Tantangan Debugging Multi-Agent

Debugging multi-agent system lebih kompleks karena:

1. **Multiple execution contexts** — Setiap agent punya context sendiri
2. **Asynchronous execution** — Agents bekerja tidak sinkron
3. **Shared state issues** — Konflik saat access shared resources
4. **Communication failures** — Messages lost atau corrupted
5. **Non-deterministic behavior** — Hasil bisa berbeda setiap run

### Debugging Strategy

#### 1. Logging

Setiap agent harus **log semua aktivitas** secara detail.

```
Log format:
[TIMESTAMP] [AGENT_ID] [LEVEL] [MESSAGE]

Contoh:
[2025-01-15 09:00:01] [agent-backend-001] [INFO] Starting Task B.1: Setup project
[2025-01-15 09:00:02] [agent-backend-001] [INFO] Running: npm init -y
[2025-01-15 09:00:03] [agent-backend-001] [INFO] package.json created
[2025-01-15 09:00:04] [agent-backend-001] [INFO] Running: npm install express better-sqlite3
[2025-01-15 09:00:15] [agent-backend-001] [INFO] Dependencies installed (12 packages)
[2025-01-15 09:00:15] [agent-backend-001] [INFO] Task B.1 completed successfully
```

#### 2. State Snapshots

Agent harus **save state snapshot** secara berkala.

```
Snapshot format:
{
  "agent_id": "agent-backend-001",
  "timestamp": "2025-01-15T09:00:15Z",
  "current_task": "B.1",
  "task_status": "completed",
  "files_modified": ["package.json"],
  "files_created": ["package-lock.json"],
  "next_task": "B.2",
  "blockers": [],
  "errors": []
}
```

#### 3. Communication Log

Semua **inter-agent communication** harus di-log.

```
Communication log:
[TIMESTAMP] FROM → TO: [MESSAGE_TYPE] [CONTENT]

Contoh:
[09:00:01] orchestrator → agent-backend-001: TASK_ASSIGN { task: "B.1", spec: "/shared/spec/api-spec.json" }
[09:00:15] agent-backend-001 → orchestrator: TASK_COMPLETE { task: "B.1", output: "/src/package.json" }
[09:00:16] orchestrator → agent-frontend-001: TASK_ASSIGN { task: "F.1", spec: "/shared/spec/api-spec.json" }
[09:00:20] agent-backend-001 → agent-frontend-001: ARTIFACT_READY { artifact: "api-spec.json" }
```

#### 4. Reproduction

Untuk debug issue, **reproduce dengan single agent** terlebih dahulu.

```
Debug workflow:
1. Identify which agent caused the issue
2. Run that agent in isolation with same inputs
3. Check if issue reproduces
4. If yes → bug in agent logic
5. If no → bug in inter-agent interaction
```

### Debugging Tools

```bash
#!/bin/bash
# debug-multi-agent.sh - Tool untuk debugging multi-agent session

SESSION_DIR="./.multi-agent/session-2025-01-15"

echo "=== Multi-Agent Debug Report ==="
echo ""

# 1. Check all agent logs
echo "--- Agent Logs ---"
for log in "$SESSION_DIR"/logs/*.log; do
  agent=$(basename "$log" .log)
  errors=$(grep -c "\[ERROR\]" "$log")
  warnings=$(grep -c "\[WARN\]" "$log")
  echo "$agent: $errors errors, $warnings warnings"
done
echo ""

# 2. Check task status
echo "--- Task Status ---"
cat "$SESSION_DIR/task_status.json" | jq '.tasks[] | select(.status != "completed")'
echo ""

# 3. Check conflicts
echo "--- Conflicts ---"
if [ -f "$SESSION_DIR/conflicts.md" ]; then
  cat "$SESSION_DIR/conflicts.md"
else
  echo "No conflicts recorded"
fi
echo ""

# 4. Check communication log
echo "--- Recent Communication ---"
tail -20 "$SESSION_DIR/communication_log.md"
echo ""

# 5. Check resource usage
echo "--- Resource Usage ---"
for snapshot in "$SESSION_DIR"/snapshots/*.json; do
  agent=$(basename "$snapshot" .json)
  files=$(jq '.files_modified | length' "$snapshot")
  echo "$agent: $files files modified"
done
```

---

## 🌍 REAL-WORLD MULTI-AGENT WORKFLOWS

### Workflow 1: Dev Team Simulation

Simulasi tim development lengkap untuk build project dari nol.

```
Scenario: "Build aplikasi manajemen perpustakaan sekolah"

Agent Roles:
┌─────────────────────────────────────────────┐
│              Orchestrator                   │
│  (Project Manager)                          │
└──────┬──────────┬──────────┬────────────────┘
       │          │          │
       ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Architect│ │ Backend  │ │ Frontend │
│ (1 agent)│ │ (1 agent)│ │ (1 agent)│
└──────────┘ └──────────┘ └──────────┘
       │          │          │
       ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ QA (1    │ │ Docs (1  │ │ Reviewer │
│ agent)   │ │ agent)   │ │ (1 agent)│
└──────────┘ └──────────┘ └──────────┘

Execution:
Wave 1: Architect →系统设计, API spec, DB schema
Wave 2: Backend → Models, Routes | Frontend → UI Setup | Docs → README draft
Wave 3: Backend → API endpoints | Frontend → Pages | Docs → User guide
Wave 4: QA → Tests (depends on Backend + Frontend)
Wave 5: Reviewer → Code review | Docs → API docs
Wave 6: Orchestrator → Integration, final delivery

Timeline: ~2 jam (vs ~5 jam sequential)
```

### Workflow 2: Code Review Pipeline

Multi-agent code review yang thorough dan otomatis.

```
Scenario: "Review pull request untuk fitur absensi"

Agent Roles:
┌─────────────────────────────────────────────┐
│              Orchestrator                   │
│  (Review Coordinator)                       │
└──────┬──────────┬──────────┬────────────────┘
       │          │          │
       ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Style    │ │ Security │ │ Logic    │
│ Reviewer │ │ Reviewer │ │ Reviewer │
│ (linting,│ │ (vulns,  │ │ (bugs,   │
│ formatting)│ │ auth,    │ │ edge     │
│          │ │ injection)│ │ cases)   │
└──────────┘ └──────────┘ └──────────┘
       │          │          │
       ▼          ▼          ▼
┌──────────────────────────────────────────┐
│           Summary Agent                  │
│  (Aggregate all reviews into one report) │
└──────────────────────────────────────────┘

Execution:
1. Orchestrator: Clone PR, setup review environment
2. Parallel review:
   - Style Reviewer: Run ESLint, check formatting, naming
   - Security Reviewer: Check for SQL injection, XSS, auth issues
   - Logic Reviewer: Check business logic, edge cases, error handling
3. Summary Agent: Aggregate all findings into review report
4. Orchestrator: Post review comments to PR

Review Report Format:
┌─────────────────────────────────────────────┐
│ Code Review Report: PR #42                  │
├─────────────────────────────────────────────┤
│ Style Issues: 3                             │
│   - Line 45: Variable name too generic      │
│   - Line 78: Missing semicolon              │
│   - Line 102: Inconsistent indentation      │
│                                             │
│ Security Issues: 1                          │
│   - Line 67: SQL injection risk             │
│     → Use parameterized queries             │
│                                             │
│ Logic Issues: 2                             │
│   - Line 89: Missing null check             │
│   - Line 134: Off-by-one error in loop      │
│                                             │
│ Overall: 6 issues (1 critical, 2 major,     │
│                   3 minor)                   │
│ Recommendation: Request changes             │
└─────────────────────────────────────────────┘
```

### Workflow 3: Documentation Pipeline

Multi-agent documentation generation yang lengkap.

```
Scenario: "Buat dokumentasi lengkap untuk API yang sudah ada"

Agent Roles:
┌─────────────────────────────────────────────┐
│              Orchestrator                   │
│  (Documentation Coordinator)                │
└──────┬──────────┬──────────┬────────────────┘
       │          │          │
       ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ API Docs │ │ User     │ │ Developer│
│ Agent    │ │ Guide    │ │ Guide    │
│ (extract │ │ Agent    │ │ Agent    │
│  specs)  │ │ (end-user│ │ (setup,  │
│          │ │  docs)   │ │  deploy) │
└──────────┘ └──────────┘ └──────────┘
       │          │          │
       ▼          ▼          ▼
┌──────────────────────────────────────────┐
│           Review & Merge Agent           │
│  (Check consistency, merge into single   │
│   documentation site)                    │
└──────────────────────────────────────────┘

Execution:
1. Orchestrator: Analyze codebase, identify documentation needs
2. Parallel documentation:
   - API Docs Agent: Extract endpoints, generate OpenAPI spec
   - User Guide Agent: Write user-facing documentation
   - Developer Guide Agent: Write setup, deployment, contribution guides
3. Review & Merge Agent:
   - Check consistency across all docs
   - Cross-reference links
   - Merge into documentation site structure
4. Orchestrator: Build and deploy documentation site

Output:
docs/
├── api/
│   ├── openapi.json
│   ├── endpoints/
│   │   ├── auth.md
│   │   ├── siswa.md
│   │   └── absensi.md
├── user-guide/
│   ├── getting-started.md
│   ├── features.md
│   └── faq.md
├── developer-guide/
│   ├── setup.md
│   ├── architecture.md
│   ├── deployment.md
│   └── contributing.md
└── README.md
```

### Workflow 4: Feature Development + Testing + Docs

End-to-end workflow untuk development fitur baru.

```
Scenario: "Tambah fitur export laporan absensi ke Excel"

Agent Roles & Execution:

Phase 1: Planning (Sequential)
┌──────────────┐
│ Architect    │ → Desain fitur, update API spec
│ Agent        │ → Output: feature-spec.md
└──────┬───────┘
       │
       ▼
Phase 2: Development (Parallel)
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Backend      │  │ Frontend     │  │ QA           │
│ Agent        │  │ Agent        │  │ Agent        │
│              │  │              │  │              │
│ - Excel lib  │  │ - Export     │  │ - Test spec  │
│ - Endpoint   │  │   button     │  │ - Test cases │
│ - Logic      │  │ - Loading UI │  │ (prepare)    │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
Phase 3: Integration (Sequential)
┌──────────────┐
│ QA Agent     │ → Run tests, report bugs
│              │ → Fix bugs (Backend/Frontend agents)
│              │ → Re-run tests
└──────┬───────┘
       │
       ▼
Phase 4: Documentation (Parallel)
┌──────────────┐  ┌──────────────┐
│ Docs Agent   │  │ Reviewer     │
│              │  │ Agent        │
│ - API docs   │  │ - Code review│
│ - User guide │  │ - Quality    │
│ - Changelog  │  │   check      │
└──────────────┘  └──────────────┘

Timeline: ~90 menit (vs ~3 jam sequential)
```

---

## 📋 PRACTICAL IMPLEMENTATION

### Cara Setup Multi-Agent dengan Claude Code

Berikut adalah cara praktis mengimplementasikan multi-agent collaboration menggunakan Claude Code:

#### Step 1: Buat Directory Structure

```bash
mkdir -p .multi-agent/{shared,logs,snapshots}
mkdir -p .multi-agent/shared/{spec,backend,frontend,tests,docs}
```

#### Step 2: Buat Context Files

```bash
# Context untuk setiap agent
cat > .multi-agent/context-architect.md << 'EOF'
# Architect Agent Context

## Role
Kamu adalah Architect Agent. Tugas kamu:
1. Menganalisis requirements
2. Mendesain arsitektur sistem
3. Membuat API specification
4. Membuat database schema
5. Menentukan tech stack

## Output
- /shared/spec/architecture.md
- /shared/spec/api-spec.json
- /shared/spec/db-schema.sql

## Standards
- RESTful API design
- Normalized database (3NF)
- JWT authentication
- Error handling dengan HTTP status codes
EOF
```

#### Step 3: Spawn Agents dengan Claude Code

```bash
# Spawn Architect Agent
claude "Sebagai Architect Agent, desain sistem untuk [goal].
Output ke: .multi-agent/shared/spec/
Context: .multi-agent/context-architect.md"

# Spawn Backend Agent (setelah architect selesai)
claude "Sebagai Backend Agent, implementasi backend berdasarkan spec.
Spec: .multi-agent/shared/spec/api-spec.json
Output ke: src/
Context: .multi-agent/context-backend.md"

# Spawn Frontend Agent (setelah architect selesai)
claude "Sebagai Frontend Agent, implementasi frontend berdasarkan spec.
Spec: .multi-agent/shared/spec/api-spec.json
Output ke: public/
Context: .multi-agent/context-frontend.md"

# Spawn QA Agent (setelah backend + frontend selesai)
claude "Sebagai QA Agent, buat dan jalankan tests.
Code: src/, public/
Spec: .multi-agent/shared/spec/api-spec.json
Output ke: tests/
Context: .multi-agent/context-qa.md"
```

#### Step 4: Monitor Progress

```bash
# Monitor semua agent logs
tail -f .multi-agent/logs/*.log

# Check task status
cat .multi-agent/shared/task_status.json | jq

# Check for conflicts
cat .multi-agent/shared/conflicts.md
```

### Multi-Agent dengan Deep Research Skill

Dari repo `feiskyer/claude-code-settings`, deep-research skill mengimplementasikan multi-agent pattern:

```
/deep-research "Bandingkan framework AI Agent terbaik 2026"

Claude akan:
1. Pecah research goal jadi sub-objectives:
   - Sub-objective 1: Framework untuk coding agents
   - Sub-objective 2: Framework untuk research agents
   - Sub-objective 3: Framework untuk multi-agent systems

2. Spawn parallel claude sub-processes:
   - Sub-process 1: Research coding frameworks (CrewAI, AutoGen, LangGraph)
   - Sub-process 2: Research research frameworks (OpenDeepSearch, Tavily)
   - Sub-process 3: Research multi-agent frameworks (CAMEL, MetaGPT)

3. Aggregasi hasil dari semua agent:
   - Combine findings
   - Remove duplicates
   - Cross-reference information

4. Hasilkan laporan lengkap:
   - Comparison table
   - Pros/cons setiap framework
   - Recommendation berdasarkan use case
```

---

## ✅ CHECKLIST

- [ ] Paham konsep multi-agent collaboration dan keuntungannya
- [ ] Tahu 6 role agent utama (Architect, Backend, Frontend, QA, Docs, Reviewer)
- [ ] Paham 4 communication patterns (Hub-and-Spoke, Pipeline, P2P, Hierarchical)
- [ ] Bisa melakukan task decomposition untuk multi-agent
- [ ] Tahu prinsip decomposition: independence, cohesion, balanced workload
- [ ] Paham cara resolve conflicts antar agents
- [ ] Tahu cara orchestrate multi-agent execution
- [ ] Paham perbedaan parallel vs sequential vs hybrid execution
- [ ] Bisa debug multi-agent system (logging, snapshots, communication log)
- [ ] Tahu real-world workflows: dev team simulation, code review pipeline, docs pipeline
- [ ] Bisa setup multi-agent workflow dengan Claude Code
- [ ] Paham cara menggunakan deep-research skill untuk multi-agent research

---

> **Lanjut ke:** [`09-ringkasan-fase-3.md`](./09-ringkasan-fase-3.md)
