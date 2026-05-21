# 08 — Git Workflow dengan AI

> **Estimasi:** 2 jam | **Level:** Menengah
> **Sumber:**
> - [`awattar/claude-code-best-practices — Git`](https://github.com/awattar/claude-code-best-practices#version-control--git)
> - [`Anthropic Docs — Common Workflows`](https://docs.anthropic.com/en/docs/claude-code/common-workflows)
> - [`Anthropic Docs — GitHub Actions`](https://docs.anthropic.com/en/docs/claude-code/github-actions)

---

## 📖 TEORI

### Mengapa Git Workflow dengan AI?

Git workflow yang baik sangat penting saat bekerja dengan AI coding assistant. AI bisa membuat banyak perubahan dengan cepat, dan tanpa workflow yang terstruktur, perubahan ini bisa menjadi chaos. Git workflow dengan AI memastikan:

1. **Traceability** — Setiap perubahan AI bisa di-track dan di-review
2. **Safety** — Perubahan AI terisolasi di branch, tidak langsung ke main
3. **Quality** — Code review dan testing sebelum merge
4. **Reversibility** — Bisa rollback jika AI membuat kesalahan
5. **Collaboration** — Tim bisa review dan approve perubahan AI

---

## 🌿 BRANCH STRATEGY

### A. GitHub Flow (Recommended untuk AI)

GitHub Flow adalah branch strategy paling cocok untuk AI-assisted development karena sederhana dan aman.

```
main ────────────────────────────────────────────────────────
      \           \              \              \
       \           \              \              \
        feat/absensi fix/login-bug  docs/api      chore/deps
              \           \              \              \
               PR ──────── PR ────────── PR ────────── PR
                 \           \              \              \
                  merge ───── merge ──────── merge ──────── merge
```

**Workflow:**
1. Dari `main`, buat branch baru untuk setiap task
2. Kerjakan perubahan di branch tersebut (dengan bantuan AI)
3. Commit perubahan secara atomic
4. Buat Pull Request
5. Review (bisa dengan AI reviewer)
6. Merge ke `main`
7. Hapus branch

**Naming Convention:**
```
feat/        → Fitur baru
fix/         → Bug fix
docs/        → Dokumentasi
chore/       → Maintenance, dependency update
refactor/    → Refactoring tanpa perubahan behavior
test/        → Penambahan atau perbaikan test
style/       → Formatting, styling tanpa perubahan logic
perf/        → Performance improvement
ci/          → CI/CD configuration
```

**Contoh:**
```bash
# Fitur baru
git checkout -b feat/absensi-siswa
git checkout -b feat/laporan-kehadiran
git checkout -b feat/export-excel-bos

# Bug fix
git checkout -b fix/login-error-500
git checkout -b fix/validasi-nisn

# Dokumentasi
git checkout -b docs/api-absensi
git checkout -b docs/user-guide-arkas

# Maintenance
git checkout -b chore/update-dependencies
git checkout -b chore/cleanup-temp-files
```

### B. GitFlow (Untuk Project Besar)

GitFlow lebih kompleks, cocok untuk project besar dengan release cycle yang terencana.

```
main ───────────────────────────── v1.0 ─────────────────── v2.0
  \                                   \                      \
   \                                   \                      \
develop ────────────────────┐  ──────── release/1.0 ────────┐
  \                          \          \                    \
   \ feat/absensi ── merge ── \          \                    \
    \                          \          \                    \
     \ feat/laporan ── merge ── \          \                    \
                                 \          merge ────────────── merge
                                  \
                                   hotfix/urgent-fix ── merge to main + develop
```

**Branch Types:**
| Branch | Fungsi | Lifetime |
|--------|--------|----------|
| `main` | Production-ready code | Permanent |
| `develop` | Integration branch | Permanent |
| `feature/*` | Fitur baru | Temporary |
| `release/*` | Persiapan release | Temporary |
| `hotfix/*` | Fix urgent di production | Temporary |

**Kapan Pakai GitFlow:**
- Project dengan scheduled releases (bulanan, quarterly)
- Tim besar (5+ developer)
- Butuh maintenance multiple versi simultaneously
- Ada proses QA yang formal

**Kapan Pakai GitHub Flow:**
- Project kecil-menengah
- Continuous deployment
- Tim kecil (1-4 developer)
- **Kebanyakan project AI-assisted**

### C. Trunk-Based Development

Untuk tim yang sangat experienced dengan CI/CD dan automated testing.

```
main ──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──
       │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │
      c1 c2 c3 c4 c5 c6 c7 c8 c9 c10c11c12c13c14c15c16
```

Semua commit langsung ke `main` (trunk). Feature flags digunakan untuk menyembunyikan fitur yang belum siap.

**Kapan Pakai:**
- Tim sangat experienced
- CI/CD pipeline yang sangat robust
- Test coverage > 90%
- Feature flags infrastructure
- **Tidak recommended untuk project AI-assisted pemula**

---

## 📝 COMMIT MESSAGES DENGAN AI

### Conventional Commits Format

Format standar yang digunakan oleh `awattar/claude-code-best-practices`:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
| Type | Kapan Digunakan | Contoh |
|------|-----------------|--------|
| `feat` | Fitur baru | `feat(absensi): menambahkan endpoint input absensi` |
| `fix` | Bug fix | `fix(login): memperbaiki error 500 saat submit` |
| `docs` | Dokumentasi | `docs(api): menambahkan dokumentasi endpoint absensi` |
| `style` | Formatting | `style(absensi): format kode dengan prettier` |
| `refactor` | Refactoring | `refactor(absensi): extract validation ke separate function` |
| `test` | Testing | `test(absensi): menambahkan test untuk edge cases` |
| `chore` | Maintenance | `chore(deps): update dependency packages` |
| `perf` | Performance | `perf(query): optimasi query laporan kehadiran` |
| `ci` | CI/CD | `ci(github): menambahkan workflow test otomatis` |
| `build` | Build system | `build(docker): menambahkan multi-stage build` |

### Menggunakan `/commit` Command

Repo `awattar/claude-code-best-practices` menyediakan custom `/commit` command yang otomatis generate conventional commit messages:

```bash
# Stage semua perubahan
git add .

# Minta Claude generate commit message
/commit

# Claude akan:
# 1. Analisis git diff
# 2. Group perubahan secara logical
# 3. Generate conventional commit message
# 4. Tampilkan preview untuk review
# 5. Commit setelah user approve

# Contoh output:
# ┌─────────────────────────────────────────────────┐
# │ Proposed Commit Messages:                       │
# │                                                 │
# │ 1. feat(absensi): menambahkan endpoint CRUD     │
# │    - POST /api/absensi untuk input kehadiran     │
# │    - GET /api/absensi/:id untuk detail           │
# │    - PUT /api/absensi/:id untuk edit             │
# │    - DELETE /api/absensi/:id untuk hapus         │
# │                                                 │
# │ 2. test(absensi): menambahkan unit tests         │
# │    - Test validasi input NISN                   │
# │    - Test validasi tanggal                       │
# │    - Test CRUD operations                        │
# │                                                 │
# │ 3. docs(absensi): update API documentation       │
# │    - Endpoint documentation                      │
# │    - Request/Response examples                   │
# │                                                 │
# │ [Approve] [Edit] [Split] [Cancel]               │
# └─────────────────────────────────────────────────┘
```

### AI-Generated Commit Message Best Practices

```markdown
## ✅ DO
1. Review commit message sebelum approve
2. Pastikan message menggambarkan perubahan yang sebenarnya
3. Gunakan scope yang spesifik (nama modul/file)
4. Tulis body jika perubahan kompleks
5. Reference issue number di footer: `Closes #123`

## ❌ DON'T
1. Jangan accept commit message yang terlalu generic
2. Jangan commit perubahan besar dalam satu commit
3. Jangan skip review diff sebelum commit
4. Jangan gunakan "fix stuff" atau "update files"
5. Jangan commit code yang belum di-test
```

### Contoh Commit Messages yang Baik

```bash
# ✅ Good — spesifik, jelas scope
feat(absensi): menambahkan validasi NISN 10 digit
- Menambahkan regex validation untuk format NISN
- Menampilkan error message jika format tidak valid
- Menambahkan unit test untuk validasi
Closes #45

# ✅ Good — body menjelaskan "why"
fix(arkas): memperbaiki perhitungan saldo yang salah

Perhitungan saldo sebelumnya menggunakan SUM tanpa mempertimbangkan
jenis transaksi (pemasukan/pengeluaran). Fix ini mengubah query
untuk menggunakan CASE WHEN yang benar.

Before: SELECT SUM(jumlah) FROM KasUmum
After:  SELECT SUM(CASE WHEN jenis='Pemasukan' THEN jumlah
                       ELSE -jumlah END) FROM KasUmum

Closes #67

# ✅ Good — multiple changes dalam satu commit (jika related)
feat(laporan): menambahkan export laporan ke Excel dan PDF
- Export Excel dengan formatting (header, border, number format)
- Export PDF dengan template resmi sekolah
- Tombol download di halaman laporan
- Test untuk kedua format export
Refs #89

# ❌ Bad — terlalu generic
chore: update files

# ❌ Bad — tidak jelas apa yang diubah
fix: fixed some bugs

# ❌ Bad — terlalu panjang di subject
feat(absensi): menambahkan fitur absensi siswa dengan validasi NISN dan tanggal dan status dan waktu dan notifikasi ke orang tua dan export ke Excel
```

### Commit Template

Buat file `.gitmessage` di root project untuk template commit:

```bash
# .gitmessage
# <type>(<scope>): <description>
#
# [body: explain WHAT and WHY, not HOW]
#
# [footer: Closes #123, Refs #456]

# Types:
# feat:     Fitur baru
# fix:      Bug fix
# docs:     Dokumentasi
# style:    Formatting, missing semi colons, etc
# refactor: Refactoring code
# test:     Adding missing tests
# chore:    Maintenance, dependencies, etc
# perf:     Performance improvement
# ci:       CI/CD configuration
# build:    Build system changes

# Scope examples:
# absensi, arkas, dapodik, sarpras, rombel, laporan, auth, api, ui
```

Daftarkan template:
```bash
git config commit.template .gitmessage
```

---

## 🔍 CODE REVIEW DENGAN AI

### A. AI sebagai Reviewer

Claude Code bisa melakukan code review secara otomatis melalui custom command `/reviewpr`:

```bash
# Review pull request
/reviewpr

# Claude akan:
# 1. Fetch PR diff dari GitHub
# 2. Analisis perubahan per file
# 3. Check untuk:
#    - Bug dan logic errors
#    - Security vulnerabilities
#    - Performance issues
#    - Code style dan conventions
#    - Test coverage
#    - Documentation
# 4. Generate review comments
# 5. Post comments ke PR
```

### B. Review Checklist Otomatis

AI reviewer akan check berdasarkan checklist:

```markdown
## Code Review Checklist

### 🔴 Critical (Must Fix)
- [ ] No security vulnerabilities (SQL injection, XSS, etc.)
- [ ] No logic errors yang bisa cause data corruption
- [ ] Error handling untuk semua edge cases
- [ ] Input validation untuk semua user input

### 🟡 Important (Should Fix)
- [ ] Code mengikuti project conventions
- [ ] Function/method tidak terlalu panjang (< 50 lines)
- [ ] Variable naming jelas dan konsisten
- [ ] No dead code atau unused imports
- [ ] Test coverage untuk perubahan baru

### 🟢 Nice to Have (Could Fix)
- [ ] Code bisa lebih readable
- [ ] Performance bisa dioptimasi
- [ ] Documentation lengkap
- [ ] Comments untuk complex logic
```

### C. Contoh Review Output

```markdown
## Review untuk PR #123: feat(absensi): CRUD endpoint

### 🔴 Critical Issues

**1. SQL Injection Risk** — `src/controllers/absensi.js:45`
```javascript
// ❌ Vulnerable
const query = `SELECT * FROM absensi WHERE nisn = '${req.body.nisn}'`;

// ✅ Fix
const query = 'SELECT * FROM absensi WHERE nisn = $1';
await db.query(query, [req.body.nisn]);
```

**2. Missing Input Validation** — `src/controllers/absensi.js:12`
```javascript
// ❌ No validation
const { nisn, tanggal, status } = req.body;

// ✅ Fix
const schema = z.object({
  nisn: z.string().regex(/^\d{10}$/),
  tanggal: z.string().date().max(new Date().toISOString().slice(0, 10)),
  status: z.enum(['hadir', 'sakit', 'izin', 'alpha']),
});
const data = schema.parse(req.body);
```

### 🟡 Important Issues

**3. Function Too Long** — `src/services/laporan.js:23-180`
Function `generateLaporanKehadiran` (157 lines) sebaiknya dipecah:
- `fetchDataKehadiran()`
- `aggregateData()`
- `formatLaporan()`
- `exportToExcel()`

**4. Missing Error Handler** — `src/routes/absensi.js:34`
```javascript
// ❌ No error handler
router.post('/absensi', createAbsensi);

// ✅ Fix
router.post('/absensi', asyncHandler(createAbsensi));
```

### 🟢 Suggestions

**5. Consider Adding Caching**
Data absensi per tanggal jarang berubah. Pertimbangkan cache dengan TTL 5 menit untuk endpoint `GET /api/absensi/:tanggal`.

**6. Add API Documentation**
Tambahkan JSDoc/OpenAPI spec untuk semua endpoint.

### Summary
- 🔴 2 critical issues (harus fix sebelum merge)
- 🟡 2 important issues (sebaiknya fix)
- 🟢 2 suggestions (optional)
```

### D. Local Code Review (Sebelum Push)

```bash
# Review perubahan lokal sebelum commit
/commit

# Claude akan review diff dan suggest improvements:
# "Saya menemukan 3 potensi issue di perubahan ini:
#  1. Variable 'data' tidak di-validate sebelum digunakan
#  2. Function 'prosesAbsensi' tidak handle error
#  3. Tidak ada test untuk perubahan baru
#
#  Mau saya fix sebelum commit?"
```

---

## 🔀 MERGE CONFLICT RESOLUTION DENGAN AI

### Apa itu Merge Conflict?

Merge conflict terjadi ketika dua branch mengubah bagian yang sama dari file yang sama dengan cara yang berbeda.

### Contoh Merge Conflict

```javascript
// File: src/controllers/absensi.js

// Branch A (feat/absensi) mengubah:
<<<<<<< HEAD
function getAbsensi(req, res) {
  const data = db.query('SELECT * FROM absensi');
  res.json(data);
}
=======
async function getAbsensi(req, res) {
  try {
    const data = await db.query('SELECT * FROM absensi');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
>>>>>>> feat/absensi
```

### AI-Assisted Conflict Resolution

```bash
# Saat conflict terjadi, minta Claude resolve
"Resolve merge conflict di src/controllers/absensi.js"

# Claude akan:
# 1. Analisis kedua versi
# 2. Identify perubahan dari masing-masing branch
# 3. Suggest resolution yang menggabungkan keduanya
# 4. Tampilkan hasil untuk review
```

### Strategi Resolution

**Strategi 1: Accept Both (Merge Changes)**
```javascript
// Claude menggabungkan perubahan dari kedua branch:
async function getAbsensi(req, res) {
  try {
    const data = await db.query('SELECT * FROM absensi');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

**Strategi 2: Accept Incoming (Branch Baru)**
```bash
# Gunakan perubahan dari branch yang sedang di-merge
git checkout --theirs src/controllers/absensi.js
git add src/controllers/absensi.js
```

**Strategi 3: Accept Current (Branch Sekarang)**
```bash
# Gunakan perubahan dari branch sekarang
git checkout --ours src/controllers/absensi.js
git add src/controllers/absensi.js
```

**Strategi 4: Manual Resolution dengan AI**
```
"Resolve conflict di absensi.js. Prioritaskan:
1. Error handling dari branch feat/absensi
2. Query optimization dari branch main
3. Tambah logging untuk debugging"

# Claude akan generate resolution yang menggabungkan
# yang terbaik dari kedua branch
```

### Workflow Conflict Resolution

```bash
# 1. Pull latest dari main
git checkout main
git pull origin main

# 2. Rebase feature branch
git checkout feat/absensi
git rebase main

# 3. Jika conflict, Claude bantu resolve
# (Edit file yang conflict)

# 4. Mark resolved
git add <resolved-files>

# 5. Continue rebase
git rebase --continue

# 6. Jika stuck, abort dan coba lagi
git rebase --abort
```

---

## 📤 PR CREATION DAN DESCRIPTION

### AI-Generated PR Description

Claude Code bisa generate PR description yang komprehensif:

```bash
# Buat PR dengan description otomatis
/issue "Tambahkan fitur absensi siswa"

# Claude akan:
# 1. Buat branch: feat/absensi-siswa
# 2. Implementasi fitur
# 3. Commit dengan conventional commits
# 4. Push branch
# 5. Buat PR dengan description otomatis
```

### Template PR Description

```markdown
## Summary
<!-- Jelaskan apa yang diubah dan kenapa -->

Menambahkan fitur CRUD absensi siswa untuk SD Negeri Pasirhalang.
Fitur ini memungkinkan operator untuk:
- Input kehadiran siswa harian
- Lihat rekap absensi per tanggal
- Export data absensi ke Excel

## Changes
<!-- List perubahan utama -->

### Backend
- `src/controllers/absensi.js` — CRUD endpoints
- `src/models/absensi.js` — Database model
- `src/routes/absensi.js` — Route definitions
- `src/middleware/validation.js` — Input validation

### Frontend
- `src/pages/AbsensiList.jsx` — Halaman list absensi
- `src/pages/AbsensiForm.jsx` — Form input absensi
- `src/components/AbsensiTable.jsx` — Tabel data

### Tests
- `tests/absensi.test.js` — Unit tests untuk controller
- `tests/absensi.validation.test.js` — Validation tests

## Testing
<!-- Bagaimana cara test perubahan ini -->

```bash
# Run tests
npm test

# Test specific file
npm test -- absensi.test.js

# Test coverage
npm run test:coverage
```

## Screenshots
<!-- Jika ada perubahan UI -->

| Before | After |
|--------|-------|
| [image] | [image] |

## Checklist
- [ ] Code mengikuti project conventions
- [ ] Test coverage > 80%
- [ ] Documentation updated
- [ ] No console.log atau debug code
- [ ] Error handling untuk semua edge cases
- [ ] Input validation untuk semua user input
- [ ] Security review (SQL injection, XSS, etc.)

## Related Issues
Closes #45
Refs #67, #89
```

### AI-Enhanced PR Review Process

```
User: /issue "Fix error 500 di halaman login"
         ↓
Claude Workflow:
1. 📋 Plan — Analisis issue dan buat rencana fix
2. 🌿 Branch — Buat branch: fix/login-error-500
3. 🔧 Implement — Fix bug dengan minimal perubahan
4. 🧪 Test — Jalankan dan fix tests
5. 📝 Commit — Generate conventional commit message
6. 📤 Push — Push branch ke remote
7. 📋 PR — Buat PR dengan description otomatis
8. 🔍 Review — Auto-review PR untuk quality check
9. ✅ Merge — Merge setelah approval
         ↓
Output: Issue fixed, PR merged, branch deleted
```

---

## 🔗 GIT HOOKS DENGAN AI

### Pre-Commit Hook (Git Hooks, bukan Claude Hooks)

Git hooks berbeda dengan Claude Code hooks. Git hooks ada di `.git/hooks/` dan dijalankan oleh Git.

```bash
#!/bin/bash
# .git/hooks/pre-commit
# Dijalankan sebelum commit dibuat

echo "🔍 Pre-commit check..."

# 1. Check jika ada console.log
if git diff --cached | grep -q "console\.log"; then
  echo "❌ Found console.log in staged files!"
  echo "   Remove console.log sebelum commit."
  exit 1
fi

# 2. Check jika ada TODO/FIXME
if git diff --cached | grep -q "TODO\|FIXME"; then
  echo "⚠️  Found TODO/FIXME in staged files."
  echo "   Consider resolving sebelum commit."
  # Warning saja, tidak block
fi

# 3. Run linter
if command -v eslint &> /dev/null; then
  echo "  Running ESLint..."
  npx eslint --fix $(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx)$')
  if [ $? -ne 0 ]; then
    echo "❌ ESLint failed!"
    exit 1
  fi
fi

# 4. Run tests
if [ -f "package.json" ] && grep -q '"test"' package.json; then
  echo "  Running tests..."
  npm test -- --passWithNoTests --findRelatedTests \
    $(git diff --cached --name-only --diff-filter=ACM)
  if [ $? -ne 0 ]; then
    echo "❌ Tests failed!"
    exit 1
  fi
fi

echo "✅ Pre-commit checks passed!"
exit 0
```

### Commit-msg Hook (Validate Commit Message)

```bash
#!/bin/bash
# .git/hooks/commit-msg
# Validasi format commit message

commit_msg=$(cat "$1")

# Check conventional commit format
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|perf|ci|build)(\(.+\))?: .+"; then
  echo "❌ Commit message tidak mengikuti Conventional Commits format!"
  echo ""
  echo "Format: <type>(<scope>): <description>"
  echo ""
  echo "Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build"
  echo "Examples:"
  echo "  feat(absensi): menambahkan endpoint input absensi"
  echo "  fix(login): memperbaiki error 500 saat submit"
  echo "  docs(api): update dokumentasi endpoint"
  echo ""
  echo "Gunakan /commit untuk generate message otomatis."
  exit 1
fi

# Check subject length (max 72 chars)
subject=$(echo "$commit_msg" | head -1)
if [ ${#subject} -gt 72 ]; then
  echo "⚠️  Commit subject terlalu panjang (${#subject} chars, max 72)"
  echo "   Pertimbangkan untuk shorten subject line."
  # Warning saja
fi

echo "✅ Commit message valid!"
exit 0
```

### Pre-Push Hook (Run Tests Before Push)

```bash
#!/bin/bash
# .git/hooks/pre-push
# Jalankan tests sebelum push ke remote

echo "🚀 Pre-push: Running full test suite..."

# Run all tests
if [ -f "package.json" ]; then
  npm test
  if [ $? -ne 0 ]; then
    echo "❌ Tests failed! Push dibatalkan."
    echo "   Fix tests dulu sebelum push."
    exit 1
  fi
elif [ -f "pyproject.toml" ] || [ -f "setup.py" ]; then
  pytest
  if [ $? -ne 0 ]; then
    echo "❌ Tests failed! Push dibatalkan."
    exit 1
  fi
fi

# Run type check (TypeScript)
if [ -f "tsconfig.json" ]; then
  echo "  Running TypeScript check..."
  npx tsc --noEmit
  if [ $? -ne 0 ]; then
    echo "❌ TypeScript check failed! Push dibatalkan."
    exit 1
  fi
fi

echo "✅ Pre-push checks passed!"
exit 0
```

### AI-Generated Git Hooks

Claude Code bisa generate git hooks untuk project Anda:

```
"Buatkan git hooks untuk project ini:
1. pre-commit: lint + test
2. commit-msg: validate conventional commits
3. pre-push: full test suite"

# Claude akan:
# 1. Deteksi tech stack project
# 2. Generate hooks yang sesuai
# 3. Install hooks ke .git/hooks/
# 4. Test hooks bekerja
```

---

## 🌳 BRANCHING MODELS COMPARISON

### Comparison Table

| Aspek | GitHub Flow | GitFlow | Trunk-Based |
|-------|-------------|---------|-------------|
| **Kompleksitas** | Rendah | Tinggi | Rendah |
| **Branch Types** | 1 (feature) | 5 (feature, release, hotfix, develop, main) | 1 (short-lived) |
| **Release Cycle** | Continuous | Scheduled | Continuous |
| **Team Size** | 1-10 | 5-50+ | 10+ |
| **CI/CD Required** | Recommended | Optional | Mandatory |
| **Test Coverage** | Recommended | Recommended | >90% Required |
| **AI-Friendly** | ✅ Sangat | ⚠️ Cukup | ❌ Kurang |
| **Learning Curve** | Mudah | Sulit | Sedang |

### Recommendation untuk Administrasi Sekolah

Untuk project administrasi sekolah (ARKAS, Dapodik tools, dll):

**Gunakan GitHub Flow karena:**
1. Tim kecil (1-3 operator/developer)
2. Perubahan bisa deploy langsung
3. Simple dan mudah dipahami
4. AI bisa handle branch creation dan PR secara otomatis
5. Tidak perlu release planning yang kompleks

```bash
# Workflow harian untuk administrasi sekolah
# Pagi: Check main branch
git checkout main
git pull origin main

# Buat branch untuk task hari ini
git checkout -b feat/laporan-bos-april

# Kerjakan dengan bantuan AI
# ... coding ...

# Commit perubahan
git add .
/commit  # AI generate commit message

# Push dan buat PR
git push origin feat/laporan-bos-april
# Buat PR via GitHub CLI
gh pr create --title "feat(laporan): generate laporan BOS April 2026" \
  --body "Laporan realisasi BOS semester 2 tahun ajaran 2025/2026"

# Setelah approval, merge
gh pr merge --squash --delete-branch
```

---

## 🔄 AI-ASSISTED REBASING DAN CHERRY-PICKING

### Rebase dengan AI

Rebase = memindahkan commit dari satu branch ke branch lain (biasanya ke latest main).

```bash
# Scenario: Branch feat/absensi sudah lama tidak sync dengan main
git checkout feat/absensi
git rebase main

# Jika conflict terjadi:
"Resolve rebase conflicts. Prioritaskan perubahan dari main
untuk file konfigurasi, dan perubahan dari branch untuk file fitur."

# Claude akan:
# 1. Identify conflicted files
# 2. Analyze changes from both sides
# 3. Suggest resolution
# 4. Apply resolution
# 5. Continue rebase

git add <resolved-files>
git rebase --continue
```

### Interactive Rebase dengan AI

```bash
# Squash multiple commits menjadi satu
git rebase -i HEAD~5

# Claude bisa bantu restructure commit history:
"Restructure commit history:
1. Squash 3 commit formatting jadi satu
2. Split commit besar jadi 3 commit kecil
3. Reorder commits: docs dulu, lalu code, lalu test"

# Claude akan generate rebase plan:
# pick abc123 docs: setup project structure
# pick def456 feat: implement absensi API
# fixup ghi789 style: format code
# fixup jkl012 style: fix linting
# pick mno345 test: add unit tests
# fixup pqr678 test: fix test failures
```

### Cherry-Picking dengan AI

Cherry-pick = mengambil commit spesifik dari branch lain dan menerapkannya ke branch sekarang.

```bash
# Scenario: Bug fix di branch feat/absensi juga dibutuhkan di main
# Commit hash: abc123

# Manual cherry-pick
git checkout main
git cherry-pick abc123

# AI-assisted cherry-pick
"Cherry-pick commit abc123 dari branch feat/absensi ke main.
Check jika ada dependency changes yang juga perlu di-cherry-pick."

# Claude akan:
# 1. Analisis commit abc123
# 2. Check dependencies (apakah commit ini butuh commit lain?)
# 3. Cherry-pick commit + dependencies jika perlu
# 4. Resolve conflicts jika ada
# 5. Verify cherry-pick berhasil
```

### Cherry-Pick Range

```bash
# Cherry-pick multiple commits
git cherry-pick abc123..def456

# AI-assisted
"Cherry-pick semua commit dari feat/absensi yang related ke
validasi NISN. Jangan cherry-pick commit yang related ke UI."

# Claude akan filter commits berdasarkan content:
# ✅ abc123 feat: add NISN validation
# ✅ def456 fix: fix NISN regex pattern
# ✅ ghi789 test: add NISN validation tests
# ❌ jkl012 feat: add absensi form UI
# ❌ mno345 style: format absensi page
```

---

## 🏆 BEST PRACTICES UNTUK AI-GENERATED COMMITS

### 1. Review Sebelum Commit

```bash
# SELALU review diff sebelum commit
git diff --cached

# Atau minta Claude review
/commit
# Claude akan tampilkan diff + summary perubahan
# Review sebelum approve
```

### 2. Atomic Commits

```bash
# ✅ Good — satu logical change per commit
git add src/controllers/absensi.js
git commit -m "feat(absensi): tambah controller CRUD"

git add tests/absensi.test.js
git commit -m "test(absensi): tambah unit tests"

git add docs/api/absensi.md
git commit -m "docs(absensi): tambah API documentation"

# ❌ Bad — semua perubahan dalam satu commit
git add .
git commit -m "feat: add absensi feature"
```

### 3. Commit Message yang Jelas

```bash
# ✅ Good — menjelaskan WHAT dan WHY
fix(arkas): fix saldo calculation dengan CASE WHEN

Query sebelumnya tidak membedakan pemasukan dan pengeluaran,
menghasilkan saldo yang salah. Fix menggunakan CASE WHEN untuk
menambahkan pemasukan dan mengurangi pengeluaran.

# ❌ Bad — hanya WHAT tanpa WHY
fix: fix saldo calculation
```

### 4. Test Sebelum Commit

```bash
# Jalankan tests sebelum commit
npm test

# Atau minta Claude jalankan
"Jalankan tests dan fix failures sebelum commit"

# Claude akan:
# 1. Run tests
# 2. Identify failures
# 3. Fix failures
# 4. Re-run tests
# 5. Commit setelah all tests pass
```

### 5. Small, Frequent Commits

```bash
# ✅ Good — banyak commit kecil
commit 1: feat(absensi): tambah model database
commit 2: feat(absensi): tambah validation
commit 3: feat(absensi): tambah controller
commit 4: feat(absensi): tambah routes
commit 5: test(absensi): tambah unit tests

# ❌ Bad — satu commit besar
commit 1: feat: add complete absensi feature (500 lines changed)
```

### 6. Reference Issues

```bash
# Selalu reference issue number
git commit -m "fix(absensi): fix NISN validation regex

The regex was allowing 9-digit NISN. Fixed to require exactly 10 digits.

Closes #45"
```

### 7. No Secrets di Commit

```bash
# ❌ JANGAN commit secrets
git commit -m "feat: add API integration"
# File yang mengandung API key, password, token

# ✅ Gunakan environment variables
# .env (tambahkan ke .gitignore)
API_KEY=your-secret-key
DATABASE_URL=postgres://user:pass@localhost/db

# .gitignore
.env
.env.local
*.key
*.pem
```

### 8. Sign-off Commits (Optional)

```bash
# Sign-off commit untuk traceability
git commit -s -m "feat(absensi): tambah fitur absensi"

# Output:
# feat(absensi): tambah fitur absensi
#
# Signed-off-by: Nama <email@sekolah.sch.id>
```

---

## 🏫 REAL-WORLD GIT WORKFLOW UNTUK ADMINISTRASI SEKOLAH

### Workflow 1: Update Data Dapodik

```bash
# 1. Sync dengan main
git checkout main
git pull origin main

# 2. Buat branch untuk update data
git checkout -b chore/update-dapodik-q2

# 3. Jalankan script update data
python scripts/update_dapodik.py

# 4. Review perubahan
git diff

# 5. Commit
git add data/dapodik/
/commit

# 6. Push dan PR
git push origin chore/update-dapodik-q2
gh pr create --title "chore(dapodik): update data Q2 2026"

# 7. Merge setelah review
gh pr merge --squash --delete-branch
```

### Workflow 2: Fix Bug di Laporan BOS

```bash
# 1. Buat branch
git checkout -b fix/laporan-bos-saldo

# 2. Analisis bug dengan AI
"Analisis bug di laporan BOS: saldo tidak sesuai dengan
data di database ARKAS. File: src/reports/bos.js"

# 3. Fix bug
# ... AI membantu fix ...

# 4. Test fix
npm test -- bos.test.js

# 5. Commit
git add .
/commit

# 6. Push dan PR
git push origin fix/laporan-bos-saldo
gh pr create --title "fix(bos): fix saldo calculation di laporan"

# 7. Merge
gh pr merge --squash --delete-branch
```

### Workflow 3: Fitur Baru — Surat Otomatis

```bash
# 1. Buat branch
git checkout -b feat/surat-otomatis

# 2. Implementasi dengan AI
"Buat fitur surat otomatis:
- Template surat keterangan siswa
- Auto-fill data dari Dapodik
- Export ke PDF
- Print langsung"

# 3. Commit secara atomic
git add src/templates/
git commit -m "feat(surat): tambah template surat keterangan"

git add src/services/surat.js
git commit -m "feat(surat): implementasi auto-fill dari Dapodik"

git add src/utils/pdf-generator.js
git commit -m "feat(surat): tambah PDF export"

git add tests/surat.test.js
git commit -m "test(surat): tambah unit tests"

# 4. Push dan PR
git push origin feat/surat-otomatis
gh pr create --title "feat(surat): fitur surat otomatis dengan auto-fill Dapodik"

# 5. Merge setelah review
gh pr merge --squash --delete-branch
```

---

## 📊 GIT COMMANDS REFERENCE

### Essential Commands

```bash
# Branch management
git branch                    # List branches
git branch -a                 # List all branches (local + remote)
git checkout -b <branch>      # Buat dan switch ke branch baru
git branch -d <branch>        # Delete branch (merged)
git branch -D <branch>        # Delete branch (force)

# Staging dan commit
git status                    # Check status
git diff                      # Lihat perubahan
git diff --cached             # Lihat staged changes
git add <file>                # Stage file
git add -p                    # Stage interactively
git commit -m "message"       # Commit dengan message
git commit --amend            # Amend last commit

# Remote operations
git push origin <branch>      # Push branch
git push -u origin <branch>   # Push dan set upstream
git pull origin <branch>      # Pull dari remote
git fetch origin              # Fetch semua remote changes

# History
git log --oneline -10         # 10 commit terakhir
git log --oneline --graph     # Graph view
git log --follow <file>       # History untuk file
git blame <file>              # Siapa yang mengubah tiap line

# Undo
git reset --soft HEAD~1       # Undo commit, keep changes staged
git reset --mixed HEAD~1      # Undo commit, keep changes unstaged
git reset --hard HEAD~1       # Undo commit, discard changes
git checkout -- <file>        # Discard changes in file
git revert <commit>           # Create reverse commit
```

### GitHub CLI Commands

```bash
# PR management
gh pr list                    # List PRs
gh pr view <number>           # View PR details
gh pr create                  # Create PR
gh pr merge --squash          # Squash merge PR
gh pr merge --delete-branch   # Delete branch after merge
gh pr review --approve        # Approve PR
gh pr review --comment        # Comment on PR

# Issue management
gh issue list                 # List issues
gh issue view <number>        # View issue
gh issue create               # Create issue
gh issue close <number>       # Close issue

# Repository
gh repo clone <owner>/<repo>  # Clone repository
gh repo view                  # View repo info
```

---

## ⚠️ COMMON PITFALLS DAN SOLUSI

### Pitfall 1: Commit ke Main Langsung

**Masalah:** AI membuat perubahan langsung ke branch main.
**Solusi:** Selalu buat branch baru sebelum kerja.

```bash
# ❌ Bad
git checkout main
# AI membuat perubahan di main

# ✅ Good
git checkout -b feat/new-feature
# AI membuat perubahan di branch
```

### Pitfall 2: Commit Terlalu Besar

**Masalah:** Satu commit berisi 50+ file changes.
**Solusi:** Commit secara atomic, per logical change.

```bash
# ❌ Bad
git add .
git commit -m "feat: add everything"

# ✅ Good
git add src/models/
git commit -m "feat: add database models"

git add src/controllers/
git commit -m "feat: add API controllers"

git add tests/
git commit -m "test: add unit tests"
```

### Pitfall 3: Tidak Test Sebelum Commit

**Masalah:** AI commit code yang tidak di-test.
**Solusi:** Selalu jalankan tests sebelum commit.

```bash
# Selalu test sebelum commit
npm test
# Atau minta AI
"Jalankan tests sebelum commit"
```

### Pitfall 4: Merge Conflict yang Tidak Terselesaikan

**Masalah:** Branch sudah terlalu lama tidak sync dengan main.
**Solusi:** Rebase secara rutin (setiap hari atau setiap pull main).

```bash
# Rebase rutin
git checkout main
git pull origin main
git checkout feat/my-feature
git rebase main
```

---

## ✅ CHECKLIST

- [ ] Paham 3 branching models (GitHub Flow, GitFlow, Trunk-Based)
- [ ] Tahu kapan pakai masing-masing branching model
- [ ] Paham Conventional Commits format
- [ ] Bisa menggunakan `/commit` untuk generate commit messages
- [ ] Tahu cara review diff sebelum commit
- [ ] Paham code review dengan AI (`/reviewpr`)
- [ ] Bisa resolve merge conflicts dengan bantuan AI
- [ ] Tahu cara buat PR dengan description otomatis
- [ ] Paham Git hooks (pre-commit, commit-msg, pre-push)
- [ ] Bisa menggunakan AI-assisted rebase dan cherry-pick
- [ ] Tahu best practices untuk AI-generated commits
- [ ] Paham real-world workflow untuk administrasi sekolah
- [ ] Bisa menggunakan GitHub CLI untuk PR management
- [ ] Tahu common pitfalls dan solusinya

---

> **Lanjut ke:** [`09-testing-debugging-ai.md`](./09-testing-debugging-ai.md)
