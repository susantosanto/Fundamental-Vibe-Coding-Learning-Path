# 07 — Autonomous Agents

> **Estimasi:** 1 jam | **Level:** Menengah
> **Sumber:** [`feiskyer/claude-code-settings — autonomous-skill`](https://github.com/feiskyer/claude-code-settings/tree/main/plugins/autonomous-skill), [`analyticalrohit/awesome-vibe-coding-guide`](https://github.com/analyticalrohit/awesome-vibe-coding-guide)

---

## 📖 TEORI

### Apa itu Autonomous Agents?

**Autonomous agents** adalah mode di mana AI bekerja secara mandiri untuk menyelesaikan tugas kompleks yang membutuhkan banyak langkah, tanpa perlu intervensi manusia di setiap step. Berbeda dengan vibe coding konvensional di mana Anda memberikan prompt dan langsung mendapat respons, autonomous agents bisa:

1. **Merencanakan** — Membuat task list dan strategi sendiri
2. **Mengeksekusi** — Menjalankan task satu per satu secara otomatis
3. **Memantau** — Melacak progress dan menyesuaikan rencana jika perlu
4. **Melaporkan** — Memberikan update status dan hasil akhir

Dalam konteks vibe coding, autonomous agents adalah **level tertinggi** dari automasi — Anda memberikan tujuan, dan AI mengerjakan semuanya dari awal sampai selesai.

### Analogi: Karyawan vs Manajer

```
Vibe Coding Konvensional:
Anda = Manajer yang micromanage
AI = Karyawan yang butuh instruksi detail setiap langkah
Proses: "Buat file X" → "Isi dengan Y" → "Tambahkan fungsi Z" → ...

Autonomous Agents:
Anda = Manajer yang delegate
AI = Karyawan senior yang bisa bekerja mandiri
Proses: "Build REST API todo app" → [AI bekerja sendiri] → "Selesai, ini hasilnya"
```

### Kapan Menggunakan Autonomous Agents?

| **Cocok Pakai Autonomous** | **Tidak Cocok Pakai Autonomous** |
|---|---|
| Build fitur besar (100+ file) | Perubahan kecil (1-2 file) |
| Refactoring besar-besaran | Bug fix sederhana |
| Migrasi dari satu tech stack ke lain | Update konfigurasi |
| Setup project dari nol | Edit cepat satu fungsi |
| Generate dokumentasi lengkap | Tambah satu endpoint |
| Codebase analysis menyeluruh | Rename variabel |
| Testing suite generation | Fix typo di string |

### Prinsip Dasar Autonomous Agents

#### 1. Goal-Oriented, Not Task-Oriented

Dalam autonomous mode, Anda memberikan **tujuan** (goal), bukan **task** individual.

```
❌ Task-oriented (konvensional):
"Buat file models/User.js"
"Buat file routes/auth.js"
"Buat file middleware/auth.js"
...

✅ Goal-oriented (autonomous):
"Build authentication system untuk aplikasi web dengan fitur:
- Register, login, logout
- JWT-based session
- Password hashing
- Role-based access control (admin, user)
AI akan merencanakan dan mengeksekusi semuanya sendiri."
```

#### 2. Self-Correcting

Autonomous agents harus bisa **mendeteksi dan memperbaiki error** sendiri.

```
Workflow self-correcting:
1. Agent menjalankan task
2. Agent memverifikasi hasil (run test, check output)
3. Jika gagal → agent analisis error → fix → retry
4. Jika berhasil → lanjut ke task berikutnya
5. Jika gagal berulang → agent escalate ke human
```

#### 3. Progress Tracking

Autonomous agents harus **melaporkan progress** secara berkala.

```
Progress report format:
┌─────────────────────────────────────────────┐
│ Task List: Build REST API Todo App          │
├─────────────────────────────────────────────┤
│ ✅ Task 1: Setup project structure          │
│ ✅ Task 2: Create database models            │
│ 🔄 Task 3: Implement API endpoints          │
│ ⏳ Task 4: Add authentication                │
│ ⏳ Task 5: Write tests                       │
│ ⏳ Task 6: Documentation                     │
├─────────────────────────────────────────────┤
│ Progress: 2/6 tasks completed (33%)         │
│ Estimated remaining: ~30 minutes            │
│ Current issue: None                         │
└─────────────────────────────────────────────┘
```

---

## 🏗️ AGENT ARCHITECTURES

### 1. ReAct (Reasoning + Acting)

**ReAct** adalah arsitektur agent yang menggabungkan **reasoning** (berpikir) dengan **acting** (bertindak) secara interleaved.

```
ReAct Loop:
┌─────────────────────────────────────────────┐
│  Thought: "Saya perlu membuat database"     │
│  Action:  Buat file database.js             │
│  Obs:     File berhasil dibuat              │
│                                               │
│  Thought: "Sekarang saya perlu schema"      │
│  Action:  Tulis schema migration            │
│  Obs:     Schema berhasil dibuat            │
│                                               │
│  Thought: "Sekarang test connection"        │
│  Action:  Run node test-connection.js       │
│  Obs:     Connection failed: missing driver │
│                                               │
│  Thought: "Perlu install driver"            │
│  Action:  npm install better-sqlite3        │
│  Obs:     Driver installed successfully     │
│                                               │
│  Thought: "Test lagi connection"            │
│  Action:  Run node test-connection.js       │
│  Obs:     Connection successful!            │
│  → Lanjut ke step berikutnya                │
└─────────────────────────────────────────────┘
```

#### Implementasi ReAct dalam Vibe Coding

```
Prompt untuk ReAct-style agent:
"Kerjakan task berikut dengan pendekatan ReAct:
[task description]

Untuk setiap langkah:
1. Thought: Jelaskan apa yang akan kamu lakukan dan mengapa
2. Action: Lakukan aksi (buat file, run command, dll)
3. Observation: Catat hasil aksi
4. Ulangi sampai task selesai"
```

#### Contoh ReAct dalam Aksi

```
Task: "Setup Express project dengan database SQLite"

Thought 1: "Saya perlu initialize npm project dulu sebelum install dependencies."
Action 1: `npm init -y`
Observation 1: "package.json created successfully"

Thought 2: "Sekarang install dependencies yang diperlukan: express, better-sqlite3, dotenv."
Action 2: `npm install express better-sqlite3 dotenv`
Observation 2: "3 packages installed, 12 dependencies total"

Thought 3: "Buat struktur folder: src/config, src/models, src/routes, src/middleware."
Action 3: `mkdir -p src/config src/models src/routes src/middleware`
Observation 3: "Folders created successfully"

Thought 4: "Buat file konfigurasi database di src/config/database.js."
Action 4: [Menulis file database.js dengan konfigurasi SQLite]
Observation 4: "File created with database connection setup"

Thought 5: "Test apakah database connection bekerja."
Action 5: `node src/config/database.js`
Observation 5: "Database connected successfully. Tables created."

Thought 6: "Buat file utama app.js dengan Express setup."
Action 6: [Menulis file app.js dengan Express configuration]
Observation 6: "app.js created with basic Express server"

Thought 7: "Test server bisa start."
Action 7: `node src/app.js & curl http://localhost:3000/health`
Observation 7: "Server running on port 3000. Health check: { status: 'ok' }"

→ Task selesai!
```

### 2. Plan-and-Execute

**Plan-and-Execute** adalah arsitektur di mana agent pertama-tama membuat **rencana lengkap**, baru kemudian **mengeksekusi** rencana tersebut.

```
Plan-and-Execute Flow:
┌──────────────────────┐       ┌──────────────────────┐
│     PLANNER          │       │     EXECUTOR         │
│                      │       │                      │
│ 1. Analisis goal     │──────→│ 1. Ambil task pertama│
│ 2. Pecah jadi tasks  │       │ 2. Kerjakan task     │
│ 3. Urutkan by dep    │       │ 3. Verifikasi hasil  │
│ 4. Estimate effort   │       │ 4. Update progress   │
│                      │       │ 5. Lanjut task berikut│
└──────────────────────┘       └──────────────────────┘
                                        │
                                        ▼
                              ┌──────────────────────┐
                              │    VERIFIER          │
                              │                      │
                              │ 1. Check output      │
                              │ 2. Run tests         │
                              │ 3. Validate result   │
                              │ 4. Pass/Fail → loop  │
                              └──────────────────────┘
```

#### Contoh Plan-and-Execute

```
Goal: "Build CRUD API untuk manajemen data siswa"

PLANNER menghasilkan:
┌─────────────────────────────────────────────────────────────┐
│ Plan: CRUD API Data Siswa                                   │
├─────────────────────────────────────────────────────────────┤
│ Task 1: Setup project (npm init, install deps)              │
│   Dependencies: none                                        │
│   Estimate: 5 menit                                         │
│                                                             │
│ Task 2: Buat database schema (migration script)             │
│   Dependencies: Task 1                                      │
│   Estimate: 10 menit                                        │
│                                                             │
│ Task 3: Implement Student model                             │
│   Dependencies: Task 2                                      │
│   Estimate: 15 menit                                        │
│                                                             │
│ Task 4: Implement POST /api/students (Create)               │
│   Dependencies: Task 3                                      │
│   Estimate: 10 menit                                        │
│                                                             │
│ Task 5: Implement GET /api/students (Read All)              │
│   Dependencies: Task 3                                      │
│   Estimate: 10 menit                                        │
│                                                             │
│ Task 6: Implement GET /api/students/:id (Read One)          │
│   Dependencies: Task 3                                      │
│   Estimate: 5 menit                                         │
│                                                             │
│ Task 7: Implement PUT /api/students/:id (Update)            │
│   Dependencies: Task 3, Task 6                              │
│   Estimate: 10 menit                                        │
│                                                             │
│ Task 8: Implement DELETE /api/students/:id (Delete)         │
│   Dependencies: Task 3                                      │
│   Estimate: 5 menit                                         │
│                                                             │
│ Task 9: Write tests untuk semua endpoints                   │
│   Dependencies: Task 4-8                                    │
│   Estimate: 20 menit                                        │
│                                                             │
│ Task 10: Documentation (README + API docs)                  │
│   Dependencies: Task 4-8                                    │
│   Estimate: 10 menit                                        │
├─────────────────────────────────────────────────────────────┤
│ Total estimate: ~100 menit                                  │
│ Critical path: Task 1 → 2 → 3 → 4 → 9                       │
└─────────────────────────────────────────────────────────────┘

EXECUTOR menjalankan task satu per satu sesuai plan.
VERIFIER memvalidasi setiap task sebelum lanjut.
```

### 3. Reflexion

**Reflexion** adalah arsitektur di mana agent **belajar dari kesalahan** dengan melakukan self-reflection setelah setiap failure.

```
Reflexion Loop:
┌─────────────────────────────────────────────┐
│ 1. Attempt: Agent mencoba menyelesaikan task│
│ 2. Evaluate: Hasil diverifikasi (pass/fail) │
│ 3. Reflect: Jika fail, agent analisis:      │
│    - Apa yang salah?                        │
│    - Mengapa salah?                         │
│    - Apa yang harus diperbaiki?             │
│ 4. Store: Reflection disimpan sebagai       │
│    "lesson learned" untuk percobaan berikut │
│ 5. Retry: Agent mencoba lagi dengan         │
│    mempertimbangkan lesson learned          │
│ 6. Ulangi sampai pass atau max attempts     │
└─────────────────────────────────────────────┘
```

#### Contoh Reflexion dalam Aksi

```
Task: "Buat fungsi untuk menghitung persentase kehadiran siswa"

Attempt 1:
function hitungPersentase(hadir, total) {
  return (hadir / total) * 100;
}

Evaluate: FAIL — Test case: hitungPersentase(20, 0) menghasilkan Infinity

Reflect:
- Apa yang salah? Tidak handle kasus total = 0 (division by zero)
- Mengapa salah? Tidak mempertimbangkan edge case siswa tanpa data absensi
- Perbaikan: Tambah check untuk total === 0

Lesson learned: "Selalu handle division by zero dalam fungsi perhitungan persentase"

Attempt 2:
function hitungPersentase(hadir, total) {
  if (total === 0) return 0;
  return (hadir / total) * 100;
}

Evaluate: FAIL — Test case: hitungPersentase(-1, 20) menghasilkan -5 (negatif tidak valid)

Reflect:
- Apa yang salah? Tidak validasi input negatif
- Mengapa salah? Hanya fokus pada edge case division by zero, lupa validasi input
- Perbaikan: Tambah validasi untuk input negatif

Lesson learned: "Selalu validasi input: hadir >= 0, total >= 0, hadir <= total"

Attempt 3:
function hitungPersentase(hadir, total) {
  if (total === 0) return 0;
  if (hadir < 0 || total < 0 || hadir > total) {
    throw new Error('Input tidak valid');
  }
  return Math.round((hadir / total) * 100 * 10) / 10; // 1 decimal place
}

Evaluate: PASS — Semua test cases berhasil

→ Task selesai dengan 3 attempt dan 2 lesson learned
```

---

## 🛠️ AGENT TOOLS AND CAPABILITIES

### Tools yang Diperlukan Autonomous Agent

Agar autonomous agent bisa bekerja efektif, agent perlu akses ke berbagai tools:

#### 1. File System Tools

```
Kemampuan:
- Baca file: Membaca kode existing untuk memahami context
- Tulis file: Membuat file baru atau mengupdate file existing
- Hapus file: Membersihkan file yang tidak diperlukan
- List directory: Memahami struktur project
- Search files: Mencari file atau pattern tertentu

Contoh penggunaan:
Agent perlu memahami struktur project sebelum menambah fitur:
1. List directory → lihat struktur folder
2. Baca package.json → pahami dependencies
3. Baca file konfigurasi → pahami setup
4. Baru mulai implementasi
```

#### 2. Code Execution Tools

```
Kemampuan:
- Run commands: Menjalankan terminal commands
- Run tests: Menjalankan test suite untuk verifikasi
- Run linter: Memastikan kode mengikuti standar
- Run build: Membuild project untuk verifikasi

Contoh penggunaan:
Setelah agent membuat perubahan kode:
1. Run linter → cek style issues
2. Run tests → cek functional issues
3. Run build → cek compilation issues
4. Jika semua pass → commit changes
```

#### 3. Search & Analysis Tools

```
Kemampuan:
- Grep/Ripgrep: Mencari pattern dalam kode
- AST parsing: Menganalisis struktur kode
- Dependency analysis: Memahami hubungan antar modul
- Error parsing: Membaca dan memahami error messages

Contoh penggunaan:
Agent perlu refactoring fungsi yang digunakan di banyak tempat:
1. Grep nama fungsi → temukan semua usage
2. AST parsing → pahami context setiap usage
3. Update semua usage secara konsisten
4. Run tests → verifikasi tidak ada yang break
```

#### 4. Version Control Tools

```
Kemampuan:
- Git status: Cek perubahan yang belum di-commit
- Git diff: Lihat perubahan detail
- Git commit: Commit changes dengan pesan yang deskriptif
- Git branch: Buat branch untuk isolasi perubahan
- Git push: Push changes ke remote

Contoh penggunaan:
Agent bekerja di branch terpisah:
1. Git branch feature/absensi → buat branch baru
2. [Kerjakan task-task]
3. Git add . → stage changes
4. Git commit -m "feat: implement absensi module" → commit
5. Git push → push ke remote
```

### Konfigurasi Agent Tools

Berikut adalah contoh konfigurasi tools untuk autonomous agent:

```json
{
  "agent": {
    "name": "developer-agent",
    "tools": {
      "file_system": {
        "allowed_directories": ["./src", "./tests", "./docs"],
        "max_file_size_mb": 10,
        "allowed_extensions": [".js", ".ts", ".json", ".md", ".css", ".html"]
      },
      "code_execution": {
        "allowed_commands": ["npm", "node", "git", "jest", "eslint"],
        "timeout_seconds": 60,
        "max_memory_mb": 512
      },
      "version_control": {
        "auto_commit": true,
        "commit_message_format": "conventional",
        "branch_prefix": "agent/"
      },
      "safety": {
        "max_files_modified_per_task": 20,
        "require_human_approval_for": ["database migrations", "config changes"],
        "max_retries_per_task": 3
      }
    }
  }
}
```

---

## 🛡️ AGENT SAFETY AND GUARDRAILS

### Mengapa Safety Penting?

Autonomous agents memiliki kekuatan besar — mereka bisa **mengubah banyak file**, **menjalankan commands**, dan **membuat keputusan** sendiri. Tanpa guardrails yang tepat, agent bisa:

1. **Menghapus file penting** — Tanpa sengaja menghapus file produksi
2. **Menjalankan command berbahaya** — `rm -rf` atau command destruktif lain
3. **Membuat perubahan irreversibel** — Perubahan yang tidak bisa di-undo
4. **Infinite loop** — Agent terjebak dalam loop tanpa henti
5. **Resource exhaustion** — Agent menghabiskan semua resource (CPU, memory, disk)

### Guardrails yang Diperlukan

#### 1. File System Guardrails

```
Aturan:
- Hanya modifikasi file di direktori yang diizinkan
- Tidak boleh menghapus file di luar direktori kerja
- Backup file sebelum modifikasi (auto-git-commit)
- Batasi jumlah file yang dimodifikasi per task

Implementasi:
{
  "allowed_paths": ["./src/**", "./tests/**"],
  "forbidden_paths": ["./node_modules/**", "./.git/**", "./production/**"],
  "max_files_per_commit": 20,
  "auto_backup": true
}
```

#### 2. Command Execution Guardrails

```
Aturan:
- Whitelist commands yang boleh dijalankan
- Tidak boleh menjalankan commands destruktif
- Timeout untuk setiap command
- Batasi resource usage (memory, CPU)

Whitelist commands:
✅ npm install, npm run, npm test
✅ node, npx
✅ git (status, add, commit, push, branch, diff)
✅ jest, eslint, prettier
✅ mkdir, cp, mv (dalam direktori kerja)

Blacklist commands:
❌ rm -rf, del /f/q
❌ sudo, runas
❌ curl/wget ke URL eksternal (kecuali whitelist)
❌ Commands yang butuh interaksi user
❌ Commands yang modify system files
```

#### 3. Decision-Making Guardrails

```
Aturan:
- Agent harus log setiap keputusan penting
- Agent harus minta approval untuk perubahan kritis
- Agent harus rollback jika terlalu banyak failure
- Agent harus stop jika melebihi budget (waktu/resource)

Approval triggers:
- Modifikasi file konfigurasi produksi
- Database migration yang mengubah schema
- Perubahan yang mempengaruhi > 10 file
- Operasi yang tidak bisa di-undo

Rollback triggers:
- 3 consecutive failures pada task yang sama
- Test coverage turun > 10%
- Linter errors > 5 setelah perubahan
- Build failure setelah 3 retry
```

#### 4. Resource Guardrails

```
Aturan:
- Batasi waktu eksekusi per task
- Batasi total waktu eksekusi per session
- Batasi memory usage
- Batasi jumlah API calls (jika agent pakai external APIs)

Limits:
{
  "max_task_time_seconds": 300,
  "max_session_time_seconds": 3600,
  "max_memory_mb": 1024,
  "max_api_calls_per_hour": 100,
  "max_tokens_per_task": 50000
}
```

### Implementasi Safety dalam Autonomous-Skill

Dari repo `feiskyer/claude-code-settings`, autonomous-skill mengimplementasikan safety melalui:

```
1. Task isolation: Setiap task dikerjakan di context terpisah
2. Progress tracking: File progress.md mencatat status setiap task
3. Error recovery: Agent retry dengan strategy berbeda jika gagal
4. Human escalation: Agent minta bantuan jika stuck
5. Audit trail: Semua aksi agent di-log untuk review
```

---

## 📊 MONITORING AGENT PROGRESS

### File-Based Progress Tracking

Autonomous agents menggunakan file untuk melacak progress:

#### task_list.md

```markdown
# Task List: Build REST API Todo App

## Status Legend
- ⬜ Not started
- 🔄 In progress
- ✅ Completed
- ❌ Failed
- ⏸️ Paused (waiting for dependency)

## Tasks

### Phase 1: Setup
- [✅] Task 1: Initialize npm project
  - Started: 2025-01-15 09:00
  - Completed: 2025-01-15 09:02
  - Notes: package.json created, dependencies installed

- [✅] Task 2: Setup Express app structure
  - Started: 2025-01-15 09:02
  - Completed: 2025-01-15 09:05
  - Notes: src/ folder created with config, models, routes, middleware

### Phase 2: Database
- [🔄] Task 3: Create database schema
  - Started: 2025-01-15 09:05
  - ETA: 10 menit
  - Notes: Writing migration script for todos table

- [⬜] Task 4: Implement Todo model
  - Dependencies: Task 3

### Phase 3: API Endpoints
- [⬜] Task 5: POST /api/todos (Create)
- [⬜] Task 6: GET /api/todos (Read All)
- [⬜] Task 7: GET /api/todos/:id (Read One)
- [⬜] Task 8: PUT /api/todos/:id (Update)
- [⬜] Task 9: DELETE /api/todos/:id (Delete)

### Phase 4: Testing
- [⬜] Task 10: Unit tests untuk models
- [⬜] Task 11: Integration tests untuk endpoints

### Phase 5: Documentation
- [⬜] Task 12: README.md
- [⬜] Task 13: API documentation
```

#### progress.md

```markdown
# Progress Report

## Session Info
- Started: 2025-01-15 09:00
- Current time: 2025-01-15 09:15
- Elapsed: 15 menit

## Overall Progress
- Total tasks: 13
- Completed: 2
- In progress: 1
- Failed: 0
- Progress: 15% (2/13)

## Current Task
- Task 3: Create database schema
- Status: In progress
- Started: 09:05
- ETA: 10 menit
- Blockers: None

## Recent Activity
- 09:05 - Started Task 3
- 09:02 - Completed Task 2
- 09:02 - Started Task 2
- 09:02 - Completed Task 1

## Issues
- None

## Next Steps
1. Complete Task 3 (database schema)
2. Start Task 4 (Todo model)
3. Start Task 5-9 (API endpoints)
```

### Real-Time Monitoring

Untuk monitoring real-time, Anda bisa menggunakan:

```
1. File watcher: Pantau perubahan pada task_list.md dan progress.md
2. Log stream: Baca log agent secara real-time
3. Dashboard: Visualisasi progress dalam format HTML/terminal
4. Notification: Alert jika ada issue atau task selesai
```

#### Contoh Monitoring Script

```bash
#!/bin/bash
# monitor-agent.sh - Script untuk monitoring autonomous agent

WATCH_DIR="./.autonomous/build-todo-api"

echo "=== Autonomous Agent Monitor ==="
echo "Watching: $WATCH_DIR"
echo ""

while true; do
  clear
  echo "=== $(date) ==="
  echo ""

  if [ -f "$WATCH_DIR/progress.md" ]; then
    echo "--- Progress ---"
    head -20 "$WATCH_DIR/progress.md"
    echo ""
  fi

  if [ -f "$WATCH_DIR/task_list.md" ]; then
    echo "--- Task Summary ---"
    grep -E "^\- \[" "$WATCH_DIR/task_list.md" | head -10
    echo ""
  fi

  if [ -f "$WATCH_DIR/agent.log" ]; then
    echo "--- Recent Logs ---"
    tail -10 "$WATCH_DIR/agent.log"
    echo ""
  fi

  sleep 10
done
```

---

## 🌍 REAL-WORLD AUTONOMOUS AGENT EXAMPLES

### Contoh 1: Build Full-Stack App dari Nol

```
Goal: "Build aplikasi manajemen inventaris sekolah"

Agent bekerja secara autonomous:

Phase 1: Planning (5 menit)
- Analisis requirements
- Buat technical plan
- Generate task list (25 tasks)

Phase 2: Backend Development (30 menit)
- Setup Express project
- Buat database schema (5 tabel)
- Implement 5 models dengan CRUD
- Implement 15 API endpoints
- Write 30 unit tests

Phase 3: Frontend Development (25 menit)
- Buat HTML pages (8 halaman)
- Implement JavaScript untuk setiap halaman
- Style dengan CSS
- Integrasi dengan API

Phase 4: Testing & Polish (15 menit)
- Run semua tests (30 tests, all pass)
- Fix 2 minor issues yang ditemukan
- Buat README.md

Total waktu: ~75 menit (tanpa human intervention)
Hasil: Aplikasi full-stack yang siap deploy
```

### Contoh 2: Refactoring Besar-Besaran

```
Goal: "Refactor codebase dari callback-based ke async/await"

Agent bekerja secara autonomous:

Phase 1: Analysis (10 menit)
- Scan semua file .js
- Identifikasi 47 fungsi yang menggunakan callback
- Buat dependency graph
- Generate refactoring plan

Phase 2: Refactoring (40 menit)
- Convert 47 fungsi ke async/await
- Update semua caller
- Fix 3 edge cases (error handling, Promise.all)
- Run linter setelah setiap batch

Phase 3: Verification (15 menit)
- Run 120 existing tests (all pass)
- Run performance benchmark (no regression)
- Generate diff report

Total waktu: ~65 menit
Hasil: Codebase fully converted, semua tests pass
```

### Contoh 3: Generate Documentation

```
Goal: "Buat dokumentasi lengkap untuk API yang sudah ada"

Agent bekerja secara autonomous:

Phase 1: Analysis (10 menit)
- Scan semua route files
- Extract endpoint definitions
- Identify request/response schemas

Phase 2: Documentation Generation (30 menit)
- Generate API reference (OpenAPI/Swagger spec)
- Generate usage examples untuk setiap endpoint
- Generate authentication guide
- Generate error handling guide

Phase 3: README & Guides (15 menit)
- Generate README.md dengan quick start
- Generate getting started guide
- Generate troubleshooting guide

Total waktu: ~55 menit
Hasil: Dokumentasi lengkap (5 dokumen, 200+ baris)
```

---

## 🚧 LIMITATIONS AND RISKS

### Batasan Autonomous Agents

#### 1. Context Window Limitations

Autonomous agents terbatas oleh **context window** AI model. Jika task terlalu besar, agent bisa kehilangan context.

```
Solusi:
- Pecah task besar menjadi sub-tasks kecil
- Gunakan file-based memory (task_list.md, progress.md)
- Agent periodically "refresh" context dari file
```

#### 2. Complex Decision Making

Agent mungkin kesulitan dengan keputusan yang membutuhkan **business context** atau **domain knowledge** yang dalam.

```
Contoh masalah:
- "Apakah fitur ini sesuai dengan visi produk?"
- "Apakah UX ini baik untuk user kita?"
- "Apakah arsitektur ini scalable untuk 2 tahun ke depan?"

Solusi:
- Human-in-the-loop untuk keputusan strategis
- Agent escalates ke human untuk keputusan non-teknis
```

#### 3. Creative Tasks

Agent kurang efektif untuk tugas yang membutuhkan **kreativitas** atau **design sense**.

```
Contoh masalah:
- "Desain UI yang menarik untuk dashboard"
- "Buat copywriting yang engaging"
- "Pilih color scheme yang sesuai brand"

Solusi:
- Human provides design direction
- Agent implements, human reviews design
- Agent generates multiple options, human chooses
```

#### 4. External Dependencies

Agent mungkin kesulitan dengan **external services** yang butuh setup manual.

```
Contoh masalah:
- Setup database server di production
- Konfigurasi SSL certificate
- Setup CI/CD pipeline di platform baru

Solusi:
- Human setup external dependencies
- Agent works dengan dependencies yang sudah ready
- Agent generates setup scripts untuk human review
```

### Risiko yang Perlu Diwaspadai

#### 1. Silent Failures

Agent mungkin "berpikir" task berhasil padahal sebenarnya gagal.

```
Mitigasi:
- Agent harus verify setiap action dengan concrete check
- Run tests setelah setiap perubahan
- Human review hasil akhir
```

#### 2. Drift from Requirements

Agent bisa "drift" dari requirements asli seiring waktu.

```
Mitigasi:
- Agent periodically re-read requirements
- Agent compare current state dengan spec
- Human checkpoint di milestone penting
```

#### 3. Security Issues

Agent mungkin introduce security vulnerabilities tanpa sadar.

```
Mitigasi:
- Agent follow security best practices (dari constitution)
- Run security linter setelah perubahan
- Human security review sebelum deploy
```

#### 4. Resource Waste

Agent bisa menghabiskan banyak resource (tokens, waktu) untuk task yang seharusnya sederhana.

```
Mitigasi:
- Set budget limits (max tokens, max time)
- Agent estimate effort sebelum mulai
- Human intervene jika agent terlalu lama di satu task
```

---

## 🔨 BUILDING YOUR OWN AUTONOMOUS AGENT WORKFLOW

### Step 1: Definisikan Goal yang Jelas

```
Goal yang baik:
✅ "Build REST API untuk manajemen data siswa dengan CRUD lengkap"
✅ "Refactor semua callback ke async/await di folder src/"
✅ "Generate dokumentasi API untuk semua endpoints"

Goal yang buruk:
❌ "Buat aplikasi sekolah" (terlalu luas)
❌ "Fix bugs" (tidak spesifik)
❌ "Improve code" (tidak measurable)
```

### Step 2: Siapkan Context yang Cukup

```
Context yang perlu disiapkan:
1. Tech stack yang digunakan
2. Coding standards yang harus diikuti
3. Existing codebase structure
4. Constraints dan limitations
5. Definition of done
```

#### Template Context File

```markdown
# Agent Context: Build Absensi API

## Tech Stack
- Backend: Node.js 20 + Express 4
- Database: SQLite (better-sqlite3)
- Testing: Jest + Supertest
- Linting: ESLint dengan Airbnb config

## Coding Standards
- ES6+ syntax, async/await (no callbacks)
- Error handling: try-catch dengan custom error classes
- Naming: camelCase untuk variabel/fungsi, PascalCase untuk class
- File structure: Feature-based (models, routes, middleware per feature)
- Comments: Jelaskan "mengapa", bukan "apa"

## Project Structure
```
src/
├── config/      # Database config, app config
├── models/      # Data access layer
├── routes/      # API route handlers
├── middleware/  # Auth, validation, error handling
└── utils/       # Helper functions
```

## Constraints
- Max response time: 500ms per endpoint
- Max file size: 200 lines per file (split jika lebih)
- No external API calls (semua data dari local database)
- Must work on Node.js 20+

## Definition of Done
- [ ] Semua endpoint implemented sesuai spec
- [ ] Semua tests pass (min 80% coverage)
- [ ] No ESLint errors
- [ ] README.md updated
- [ ] API documentation generated
```

### Step 3: Buat Task List

```
Gunakan format ini untuk task list:

# Task List

## Phase 1: [Nama Phase]
- [ ] Task 1: [Deskripsi]
  - Input: [Apa yang diperlukan]
  - Output: [Apa yang dihasilkan]
  - Verification: [Cara verifikasi berhasil]
  - Dependencies: [Task apa yang harus selesai dulu]

## Phase 2: [Nama Phase]
...
```

### Step 4: Konfigurasi Agent

```json
{
  "agent_config": {
    "goal": "Build REST API untuk manajemen data siswa",
    "context_file": "./.autonomous/context.md",
    "task_list_file": "./.autonomous/task_list.md",
    "progress_file": "./.autonomous/progress.md",
    "log_file": "./.autonomous/agent.log",
    "working_directory": "./src",
    "max_retries": 3,
    "max_time_minutes": 120,
    "human_checkpoints": [
      "After Phase 1 complete",
      "After all tests pass",
      "Before final commit"
    ],
    "safety_rules": {
      "allowed_commands": ["npm", "node", "git", "jest", "eslint"],
      "max_files_per_commit": 15,
      "require_approval_for": ["database migrations"]
    }
  }
}
```

### Step 5: Jalankan Agent dan Monitor

```bash
# Start autonomous agent
# (Ini adalah pseudo-command, implementasi tergantung platform)

$ autonomous-agent run \
  --goal "Build REST API untuk manajemen data siswa" \
  --context ./.autonomous/context.md \
  --task-list ./.autonomous/task_list.md \
  --progress ./.autonomous/progress.md \
  --config ./.autonomous/agent_config.json

# Monitor progress di terminal lain
$ tail -f ./.autonomous/agent.log
$ watch -n 10 cat ./.autonomous/progress.md
```

### Step 6: Review dan Iterate

```
Setelah agent selesai:
1. Review semua perubahan (git diff)
2. Run semua tests sekali lagi
3. Manual testing untuk critical paths
4. Jika ada issue → fix manual atau re-run agent dengan feedback
5. Commit dan push jika semua OK
```

---

## ✅ CHECKLIST

- [ ] Paham konsep autonomous agents dan perbedaannya dengan vibe coding konvensional
- [ ] Tahu kapan harus menggunakan autonomous agents (task besar, kompleks, repetitif)
- [ ] Paham 3 arsitektur agent: ReAct, Plan-and-Execute, Reflexion
- [ ] Tahu tools dan capabilities yang diperlukan autonomous agent
- [ ] Paham safety guardrails (file system, commands, decision-making, resources)
- [ ] Bisa monitoring progress agent (task_list.md, progress.md, logs)
- [ ] Tahu batasan dan risiko autonomous agents
- [ ] Bisa membangun autonomous agent workflow sendiri
- [ ] Tahu cara menyiapkan context yang cukup untuk agent
- [ ] Paham pentingnya human checkpoints dan review

---

> **Lanjut ke:** [`08-multi-agent-collaboration.md`](./08-multi-agent-collaboration.md)
