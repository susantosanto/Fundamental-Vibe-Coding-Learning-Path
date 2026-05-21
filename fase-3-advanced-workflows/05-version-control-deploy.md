# 05 — Version Control & Deployment

> **Estimasi:** 2.5 jam | **Level:** Menengah-Lanjut
> **Referensi:** [awesome-vibe-coding-guide](https://github.com/analyticalrohit/awesome-vibe-coding-guide) — Version Control and Deployment

---

## 📖 TEORI

### 1. Advanced Git — Interactive Rebase dengan AI

Interactive rebase memungkinkan Anda **mengedit, squash, reorder, dan split commits** sebelum push. Ini sangat berguna untuk membersihkan history sebelum merge ke main branch.

#### Kapan Pakai Interactive Rebase?

```
✅ Gunakan interactive rebase untuk:
- Membersihkan commit history sebelum merge ke main
- Menggabungkan commit kecil yang terkait ("fix typo", "oops", "fix again")
- Mengubah urutan commit agar lebih logis
- Mengedit commit message yang kurang jelas
- Split commit yang terlalu besar

❌ Jangan gunakan untuk:
- Commit yang sudah di-push dan di-share dengan orang lain
- Merge commits (bisa menyebabkan konflik)
- Branch yang sudah jadi base branch orang lain
```

#### Interactive Rebase Basics

```bash
# Rebase 5 commit terakhir
git rebase -i HEAD~5

# Rebase dari commit tertentu
git rebase -i abc1234

# Editor akan terbuka dengan daftar commits:
pick abc1234 feat: tambah form absensi
pick def5678 fix: typo di label
pick ghi9012 fix: validasi NISN
pick jkl3456 feat: tambah rekap bulanan
pick mno7890 fix: error di export Excel

# Ubah menjadi:
pick abc1234 feat: tambah form absensi
squash def5678 fix: typo di label          # ← Gabung ke commit sebelumnya
fixup ghi9012 fix: validasi NISN           # ← Gabung tanpa simpan message
pick jkl3456 feat: tambah rekap bulanan
reword mno7890 fix: error di export Excel  # ← Edit commit message
```

#### Rebase Commands Reference

```
pick   = gunakan commit ini (default)
reword = gunakan commit, tapi edit message
edit   = pause untuk edit commit (tambah/hapus file)
squash = gabung dengan commit sebelumnya (gabungkan message)
fixup  = gabung dengan commit sebelumnya (buang message)
drop   = hapus commit ini
```

#### AI-Assisted Interactive Rebase

```
Prompt:

"Saya punya commit history berikut di branch fitur-absensi:

abc1234 feat: WIP absensi
def5678 fix: typo
ghi9012 fix: fix validation
jkl3456 feat: add rekap
mno7890 fix: oops forgot to save
pqr2345 chore: format code
stu6789 feat: export excel

Saya ingin rebase menjadi commits yang bersih dan logis:
1. Gabungkan semua WIP/fix/oops menjadi 1 commit per fitur
2. Hapus commit yang tidak perlu (format code jika sudah di .editorconfig)
3. Commit message yang mengikuti Conventional Commits

Buatkan urutan rebase -i yang ideal."
```

#### AI Response — Rebase Plan

```markdown
## Rebase Plan

### Original → Clean History

```
# Rebase commands:
pick abc1234 feat: WIP absensi
edit def5678 fix: typo           # ← Edit: tambahkan file yang lupa
fixup ghi9012 fix: fix validation # ← Fixup: gabung ke atas
fixup mno7890 fix: oops forgot to save # ← Fixup: gabung ke atas
pick jkl3456 feat: add rekap
reword stu6789 feat: export excel # ← Reword: perbaiki message
drop pqr2345 chore: format code   # ← Drop: tidak perlu

### Hasil Clean History:
abc1234 feat(absensi): implement form input absensi
jkl3456 feat(rekap): implement tabel rekap bulanan
stu6789 feat(export): implement export Excel untuk rekap
```

### Conventional Commits Format:
```
feat(absensi): implement form input absensi

- Tambah form input kehadiran per kelas
- Validasi NISN dan status kehadiran
- Simpan ke database SQLite

feat(rekap): implement tabel rekap bulanan

- Tabel rekap per siswa per bulan
- Filter per kelas dan per bulan
- Highlight status dengan warna

feat(export): implement export Excel untuk rekap

- Export rekap ke format .xlsx
- Format tabel dengan header dan border
- Auto-download file
```
```

#### Interactive Rebase dengan Edit

```bash
# Saat rebase -i, gunakan 'edit' untuk pause di commit tertentu
# Editor akan terbuka, ubah 'pick' menjadi 'edit':

edit abc1234 feat: WIP absensi

# Rebase akan berhenti di commit ini. Sekarang Anda bisa:

# 1. Tambah file yang lupa di-commit
git add src/validasi.py

# 2. Amend commit
git commit --amend

# 3. Lanjut rebase
git rebase --continue

# Jika ingin abort:
git rebase --abort

# Jika ada konflik:
# - Resolve konflik di file yang ditandai
# - git add <file>
# - git rebase --continue
```

---

### 2. Git Bisect untuk Bug Finding

`git bisect` menggunakan **binary search** untuk menemukan commit yang memperkenalkan bug. Sangat berguna saat Anda tahu "bug ini tidak ada 2 minggu lalu tapi ada sekarang" tapi tidak tahu commit mana yang menyebabkan.

#### Git Bisect Workflow

```bash
# 1. Mulai bisect
git bisect start

# 2. Tandai commit saat ini sebagai "bad" (ada bug)
git bisect bad

# 3. Tandai commit lama sebagai "good" (tidak ada bug)
git bisect good abc1234  # Commit dari 2 minggu lalu

# Git akan checkout ke commit di tengah-tengah
# Git bilang: "Bisecting: 15 revisions left to test"

# 4. Test aplikasi di commit ini
# - Jika bug ADA: git bisect bad
# - Jika bug TIDAK ADA: git bisect good

# 5. Ulangi step 4 sampai git menemukan commit pertama yang bad
# Biasanya butuh log2(N) steps, jadi untuk 32 commits = 5 steps

# 6. Git akan report:
# abc5678 is the first bad commit
# commit abc5678
# Author: Developer
# Date: ...
# feat: refactor absensi calculation

# 7. Selesai
git bisect reset
```

#### Git Bisect Otomatis dengan Script

```bash
# Jika Anda punya test script yang bisa detect bug secara otomatis:
git bisect start
git bisect bad HEAD
git bisect good abc1234

# Jalankan bisect otomatis dengan test script
git bisect run pytest tests/test_absensi.py -k test_rekap

# Git akan otomatis:
# 1. Checkout ke commit tengah
# 2. Jalankan test
# 3. Jika test pass → good, jika fail → bad
# 4. Ulangi sampai menemukan commit pertama yang bad
```

#### AI-Assisted Bisect

```
Prompt:

"Saya menemukan bug: rekap absensi menampilkan total hari salah
(seharusnya 20, tapi menampilkan 22). Saya tahu bug ini tidak ada
di commit abc1234 (2 minggu lalu) tapi ada di HEAD sekarang.

Ada 47 commits di antara abc1234 dan HEAD.

Buatkan script test yang bisa detect bug ini secara otomatis,
lalu jelaskan cara menjalankan git bisect run dengan script tersebut."
```

#### AI-Generated Bisect Script

```python
# bisect_test.py
"""Script untuk git bisect run — detect bug total hari salah."""
import sqlite3
import sys

def test_rekap_total_hari():
    """Test bahwa rekap menghitung total hari kerja dengan benar."""
    # Setup test database
    conn = sqlite3.connect("test_bisect.db")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS absensi (
            id INTEGER PRIMARY KEY,
            siswa_id INTEGER,
            tanggal TEXT,
            status TEXT
        )
    """)

    # Insert test data: Mei 2026, Senin-Jumat saja (20 hari kerja)
    test_dates = [
        "2026-05-01", "2026-05-04", "2026-05-05", "2026-05-06", "2026-05-07",
        "2026-05-08", "2026-05-11", "2026-05-12", "2026-05-13", "2026-05-14",
        "2026-05-15", "2026-05-18", "2026-05-19", "2026-05-20", "2026-05-21",
        "2026-05-22", "2026-05-25", "2026-05-26", "2026-05-27", "2026-05-28",
    ]
    for d in test_dates:
        conn.execute(
            "INSERT INTO absensi (siswa_id, tanggal, status) VALUES (1, ?, 'H')",
            (d,)
        )
    conn.commit()

    # Jalankan fungsi rekap
    from absensi import hitung_total_hari_kerja
    total = hitung_total_hari_kerja("2026-05-01", "2026-05-31")

    # Cleanup
    conn.close()

    # Assert: harus 20 hari kerja (exclude weekend)
    if total != 20:
        print(f"FAIL: Expected 20, got {total}")
        sys.exit(1)  # Exit code 1 = bad (git bisect akan mark sebagai bad)
    else:
        print("PASS: Total hari kerja = 20")
        sys.exit(0)  # Exit code 0 = good

if __name__ == "__main__":
    test_rekap_total_hari()
```

```bash
# Jalankan bisect dengan script
git bisect start
git bisect bad HEAD
git bisect good abc1234
git bisect run python bisect_test.py

# Output:
# Bisecting: 23 revisions left
# Bisecting: 11 revisions left
# Bisecting: 5 revisions left
# Bisecting: 2 revisions left
# Bisecting: 1 revision left
# abc5678 is the first bad commit
```

---

### 3. Git Worktrees

Git worktrees memungkinkan Anda **bekerja di multiple branches secara bersamaan** tanpa perlu stash atau switch branch. Setiap worktree adalah folder terpisah yang terhubung ke repository yang sama.

#### Kapan Pakai Worktrees?

```
✅ Gunakan worktrees untuk:
- Test bug fix di branch terpisah sambil tetap coding di branch utama
- Review pull request tanpa mengganggu pekerjaan saat ini
- Build dan deploy dari branch berbeda
- Hotfix production tanpa stash perubahan yang sedang dikerjakan

❌ Tidak perlu worktrees untuk:
- Branch switching sederhana (git switch sudah cukup)
- Stash perubahan kecil (git stash sudah cukup)
```

#### Worktree Commands

```bash
# Buat worktree baru untuk branch yang sudah ada
git worktree add ../absensi-hotfix hotfix/absensi-bug

# Buat worktree baru dengan branch baru
git worktree add ../absensi-feature -b fitur/export-pdf main

# List semua worktrees
git worktree list
# /project/absensi          abc1234 [main]
# /project/absensi-hotfix   def5678 [hotfix/absensi-bug]
# /project/absensi-feature  ghi9012 [fitur/export-pdf]

# Masuk ke worktree dan kerja
cd ../absensi-hotfix
# Edit, commit, push seperti biasa

# Hapus worktree setelah selesai
git worktree remove ../absensi-hotfix

# Prune worktrees yang sudah dihapus manual
git worktree prune
```

#### AI-Assisted Worktree Workflow

```
Prompt:

"Saya sedang mengerjakan fitur export Excel di branch 'fitur/export-excel'.
Tiba-tiba ada laporan bug di production: absensi tidak tersimpan untuk
siswa dengan NISN yang mengandung huruf.

Saya tidak ingin stash perubahan saya karena masih dalam progress.

Buatkan workflow dengan git worktrees untuk:
1. Tetap kerja di fitur export Excel
2. Parallel: fix bug di worktree terpisah
3. Test bug fix
4. Merge bug fix ke main
5. Kembali ke fitur export Excel"
```

#### Worktree Workflow Example

```bash
# 1. Saat ini di branch fitur/export-excel
git status
# On branch fitur/export-excel
# Changes not staged for commit: src/export.py

# 2. Buat worktree untuk hotfix dari main
git worktree add ../absensi-hotfix -b hotfix/nisn-validation main

# 3. Masuk ke worktree hotfix
cd ../absensi-hotfix

# 4. Fix bug
# Edit src/validasi.py — fix NISN validation
git add src/validasi.py
git commit -m "fix: handle NISN dengan huruf dalam validasi"

# 5. Test fix
pytest tests/test_validasi.py -k test_nisn

# 6. Push dan buat PR
git push origin hotfix/nisn-validation
# Buat PR di GitHub → merge ke main

# 7. Kembali ke worktree utama
cd ../absensi
# Perubahan di src/export.py masih ada, tidak terganggu

# 8. Cleanup worktree hotfix
git worktree remove ../absensi-hotfix
```

---

### 4. Git Submodules

Git submodules memungkinkan Anda **menyertakan repository lain sebagai sub-direktori** di repository Anda. Berguna untuk shared libraries, template, atau konfigurasi yang di-share antar proyek.

#### Kapan Pakai Submodules?

```
✅ Gunakan submodules untuk:
- Shared library yang digunakan multiple proyek
- Template proyek yang di-maintain terpisah
- Dokumentasi yang di-share antar tim
- Dependencies yang tidak ada di package manager

❌ Pertimbangkan alternatif untuk:
- Package yang sudah ada di npm/pip → pakai package manager
- File konfigurasi kecil → copy paste saja
- Code yang sering berubah → monorepo mungkin lebih baik
```

#### Submodule Commands

```bash
# Tambah submodule
git submodule add https://github.com/org/shared-template.git templates

# Clone repository dengan submodules
git clone --recursive https://github.com/org/proyek.git

# Atau clone biasa, lalu init submodules
git clone https://github.com/org/proyek.git
cd proyek
git submodule init
git submodule update

# Update submodule ke versi terbaru
cd templates
git pull origin main
cd ..
git add templates
git commit -m "chore: update submodule templates"

# Update semua submodules
git submodule update --remote

# Hapus submodule
git submodule deinit templates
git rm templates
git commit -m "chore: remove submodule templates"
```

---

### 5. Git Hooks Advanced

Git hooks adalah **script yang otomatis berjalan** saat event tertentu terjadi (pre-commit, pre-push, dll).

#### Pre-Commit Hook — Auto Lint & Format

```bash
#!/bin/bash
# .git/hooks/pre-commit
# Otomatis lint dan format sebelum commit

echo "🔍 Running pre-commit checks..."

# 1. Python linting
echo "  → Running ruff..."
ruff check --fix src/ tests/
if [ $? -ne 0 ]; then
    echo "❌ Ruff found issues. Fix them before committing."
    exit 1
fi

# 2. Python formatting
echo "  → Running black..."
black --check src/ tests/
if [ $? -ne 0 ]; then
    echo "❌ Black found formatting issues. Run 'black src/ tests/'"
    exit 1
fi

# 3. Type checking
echo "  → Running mypy..."
mypy src/
if [ $? -ne 0 ]; then
    echo "❌ Mypy found type errors."
    exit 1
fi

# 4. Run tests
echo "  → Running tests..."
pytest tests/ -q
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Fix them before committing."
    exit 1
fi

# 5. Check for secrets
echo "  → Checking for secrets..."
if grep -r "API_KEY\|SECRET_KEY\|PASSWORD" src/ --include="*.py" | grep -v ".env"; then
    echo "❌ Potential secrets found in source code!"
    exit 1
fi

echo "✅ All pre-commit checks passed!"
exit 0
```

#### Pre-Push Hook — Prevent Push to Main

```bash
#!/bin/bash
# .git/hooks/pre-push
# Prevent direct push ke main branch

protected_branch="main"

current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if [ "$current_branch" = "$protected_branch" ]; then
    echo "❌ Direct push to '$protected_branch' is not allowed."
    echo "   Please create a pull request instead."
    echo "   git checkout -b feature/your-feature"
    echo "   git push origin feature/your-feature"
    exit 1
fi

# Check if commit message follows Conventional Commits
echo "  → Checking commit messages..."
commits=$(git log @{push}..HEAD --pretty=format:"%s")
while IFS= read -r msg; do
    if ! echo "$msg" | grep -qE "^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .+"; then
        echo "❌ Commit message tidak mengikuti Conventional Commits:"
        echo "   $msg"
        echo "   Format: type(scope): description"
        echo "   Contoh: feat(absensi): tambah form input"
        exit 1
    fi
done <<< "$commits"

echo "✅ Pre-push checks passed!"
exit 0
```

#### Post-Merge Hook — Auto Install Dependencies

```bash
#!/bin/bash
# .git/hooks/post-merge
# Auto install dependencies setelah merge

echo "📦 Checking for dependency changes..."

# Check if requirements.txt changed
if git diff-tree -r --name-only HEAD@{1} HEAD | grep -q "requirements.txt"; then
    echo "  → requirements.txt changed, installing dependencies..."
    pip install -r requirements.txt
fi

# Check if package.json changed
if git diff-tree -r --name-only HEAD@{1} HEAD | grep -q "package.json"; then
    echo "  → package.json changed, installing dependencies..."
    npm install
fi

# Run database migrations
if [ -f "migrations/latest.sql" ]; then
    echo "  → Running database migrations..."
    sqlite3 absensi.db < migrations/latest.sql
fi

echo "✅ Post-merge tasks completed!"
```

#### Pre-Commit Framework (Python)

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
      - id: detect-private-key

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.3.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
        additional_dependencies: [types-requests, types-python-dateutil]

  - repo: local
    hooks:
      - id: pytest
        name: Run tests
        entry: pytest tests/ -q
        language: system
        pass_filenames: false
        always_run: true

      - id: check-secrets
        name: Check for secrets
        entry: bash -c 'grep -r "API_KEY\|SECRET_KEY" src/ --include="*.py" | grep -v ".env" || exit 0'
        language: system
        pass_filenames: false
```

```bash
# Install pre-commit
pip install pre-commit
pre-commit install

# Run manually
pre-commit run --all-files
```

---

### 6. Deployment Strategies

#### Blue-Green Deployment

Blue-green deployment menggunakan **dua environment identik** (blue dan green). Satu environment melayani traffic production, yang lain siap untuk deploy versi baru.

```
┌─────────────────────────────────────────────┐
│              Load Balancer                   │
│         (switch traffic here)                │
└──────┬───────────────────────┬──────────────┘
       │                       │
       ▼                       ▼
┌──────────────┐      ┌──────────────┐
│   BLUE       │      │   GREEN      │
│   v1.0.0     │      │   v1.1.0     │
│   (Active)   │      │   (Standby)  │
└──────────────┘      └──────────────┘
```

```bash
# Blue-Green Deployment Script
#!/bin/bash
# deploy-blue-green.sh

BLUE_PORT=8001
GREEN_PORT=8002
ACTIVE_PORT=8001  # Saat ini blue aktif

echo "🚀 Starting blue-green deployment..."

# 1. Deploy versi baru di green (inactive)
echo "  → Deploying v1.1.0 to green (port $GREEN_PORT)..."
docker build -t absensi:v1.1.0 .
docker run -d --name absensi-green -p $GREEN_PORT:8000 absensi:v1.1.0

# 2. Health check green
echo "  → Running health checks..."
sleep 5
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$GREEN_PORT/health)
if [ "$response" != "200" ]; then
    echo "❌ Health check failed! Rolling back..."
    docker stop absensi-green
    docker rm absensi-green
    exit 1
fi

# 3. Switch traffic ke green
echo "  → Switching traffic to green..."
# Update load balancer / reverse proxy
sed -i "s/proxy_pass http:\/\/localhost:$BLUE_PORT/proxy_pass http:\/\/localhost:$GREEN_PORT/" /etc/nginx/conf.d/absensi.conf
nginx -s reload

# 4. Verify
echo "  → Verifying deployment..."
sleep 2
response=$(curl -s http://localhost:8000/api/version)
echo "  → Active version: $response"

# 5. Stop blue (bisa di-keep untuk rollback cepat)
echo "  → Stopping blue environment..."
docker stop absensi-blue

echo "✅ Blue-green deployment complete! v1.1.0 is now active."
```

#### Canary Deployment

Canary deployment **secara bertahap** mengalihkan traffic ke versi baru, dimulai dari persentase kecil.

```
Traffic Distribution:

Phase 1: 95% v1.0.0, 5% v1.1.0    (canary 5%)
Phase 2: 80% v1.0.0, 20% v1.1.0   (canary 20%)
Phase 3: 50% v1.0.0, 50% v1.1.0   (canary 50%)
Phase 4: 0% v1.0.0, 100% v1.1.0   (full rollout)
```

```yaml
# canary-deploy.yaml — Kubernetes
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: absensi-rollout
spec:
  replicas: 5
  strategy:
    canary:
      steps:
        - setWeight: 5       # 5% traffic ke v1.1.0
        - pause: {duration: 5m}  # Tunggu 5 menit
        - setWeight: 20      # 20% traffic
        - pause: {duration: 10m}
        - setWeight: 50      # 50% traffic
        - pause: {duration: 15m}
        - setWeight: 100     # 100% traffic
      analysis:
        templates:
          - templateName: error-rate-check
        startingStep: 1  # Mulai analysis dari step 1

---
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: error-rate-check
spec:
  metrics:
    - name: error-rate
      interval: 1m
      successCondition: result[0] < 0.01  # Error rate < 1%
      provider:
        prometheus:
          query: |
            sum(rate(http_requests_total{status=~"5.."}[1m]))
            /
            sum(rate(http_requests_total[1m]))
```

#### Rolling Deployment

Rolling deployment **mengganti instance satu per satu** tanpa downtime.

```
┌─────────────────────────────────────────────┐
│              Kubernetes                      │
│         (managed rollout)                    │
└─────────────────────────────────────────────┘

Pod 1: v1.0.0 → v1.1.0  ✅
Pod 2: v1.0.0 → v1.1.0  ⏳
Pod 3: v1.0.0            ✅ (masih serving)
Pod 4: v1.0.0            ✅ (masih serving)
Pod 5: v1.0.0            ✅ (masih serving)
```

```yaml
# rolling-deploy.yaml — Kubernetes
apiVersion: apps/v1
kind: Deployment
metadata:
  name: absensi
spec:
  replicas: 5
  strategy:
    rollingUpdate:
      maxSurge: 1        # Max 1 pod tambahan saat update
      maxUnavailable: 0  # Tidak boleh ada pod down
  template:
    spec:
      containers:
        - name: absensi
          image: absensi:v1.1.0
          readinessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 15
            periodSeconds: 20
```

#### A/B Testing Deployment

A/B testing deployment mengarahkan **user berbeda ke versi berbeda** untuk membandingkan performa atau UX.

```python
# ab_testing.py — Middleware untuk A/B testing
import random
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

class ABTestingMiddleware(BaseHTTPMiddleware):
    """Middleware untuk A/B testing deployment."""

    async def dispatch(self, request: Request, call_next):
        # Check cookie untuk consistent assignment
        variant = request.cookies.get("ab_variant")

        if not variant:
            # Assign user ke A atau B (50/50)
            variant = random.choice(["A", "B"])

        # Set cookie untuk consistent experience
        response = await call_next(request)
        response.set_cookie(key="ab_variant", value=variant, max_age=86400 * 30)

        # Log variant assignment untuk analytics
        if variant == "B":
            # Versi B: new UI
            request.state.ab_variant = "B"

        return response

# Usage di endpoint
@app.get("/absensi/{kelas}")
async def halaman_absensi(kelas: str, request: Request):
    if request.state.ab_variant == "B":
        # Versi B: UI baru dengan HTMX
        return templates.TemplateResponse("absensi_v2.html", {"kelas": kelas})
    else:
        # Versi A: UI lama
        return templates.TemplateResponse("absensi_v1.html", {"kelas": kelas})
```

---

### 7. CI/CD Pipeline Design

#### GitHub Actions — Full CI/CD Pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  PYTHON_VERSION: "3.11"
  DATABASE_URL: "sqlite:///test.db"

jobs:
  # === PHASE 1: Quality Gates ===
  quality:
    name: Quality Checks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}

      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Lint (Ruff)
        run: ruff check src/ tests/

      - name: Format check (Black)
        run: black --check src/ tests/

      - name: Type check (Mypy)
        run: mypy src/

      - name: Security scan (Bandit)
        run: bandit -r src/ -ll

      - name: Dependency audit
        run: pip audit

  # === PHASE 2: Testing ===
  test:
    name: Test Suite
    runs-on: ubuntu-latest
    needs: quality
    strategy:
      matrix:
        python-version: ["3.10", "3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python ${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}

      - name: Install dependencies
        run: pip install -r requirements.txt -r requirements-dev.txt

      - name: Run unit tests
        run: pytest tests/unit/ -v --cov=src/ --cov-report=xml

      - name: Run integration tests
        run: pytest tests/integration/ -v

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          file: ./coverage.xml

  # === PHASE 3: E2E Testing ===
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}

      - name: Install dependencies
        run: pip install -r requirements.txt -r requirements-dev.txt

      - name: Start application
        run: |
          uvicorn main:app --host 0.0.0.0 --port 8000 &
          sleep 5

      - name: Run E2E tests
        run: pytest tests/e2e/ -v

      - name: Run accessibility tests
        run: pytest tests/accessibility/ -v

  # === PHASE 4: Build & Deploy ===
  build-and-deploy:
    name: Build & Deploy
    runs-on: ubuntu-latest
    needs: e2e
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t absensi:${{ github.sha }} .

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Push Docker image
        run: |
          docker tag absensi:${{ github.sha }} ghcr.io/${{ github.repository }}/absensi:${{ github.sha }}
          docker tag absensi:${{ github.sha }} ghcr.io/${{ github.repository }}/absensi:latest
          docker push ghcr.io/${{ github.repository }}/absensi:${{ github.sha }}
          docker push ghcr.io/${{ github.repository }}/absensi:latest

      - name: Deploy to Railway
        uses: railwayapp/cli-action@v2
        with:
          railwayToken: ${{ secrets.RAILWAY_TOKEN }}
          args: up --detach

      - name: Post-deployment health check
        run: |
          sleep 30
          response=$(curl -s -o /dev/null -w "%{http_code}" https://absensi-production.up.railway.app/health)
          if [ "$response" != "200" ]; then
            echo "❌ Deployment failed! Health check returned $response"
            exit 1
          fi
          echo "✅ Deployment successful!"
```

#### Pipeline Stages Explained

```
┌─────────────────────────────────────────────────────────────┐
│                    CI/CD Pipeline                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐ │
│  │ Quality  │──▶│  Test    │──▶│   E2E    │──▶│  Deploy  │ │
│  │ Checks   │   │  Suite   │   │  Tests   │   │          │ │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘ │
│       │              │              │              │         │
│   Lint/Format    Unit/Integ     Browser       Build/Push    │
│   Type check     Coverage       Accessibility  Deploy       │
│   Security       Multi-Python   Load test     Health check  │
│                                                              │
│  Fail → Stop    Fail → Stop    Fail → Stop   Auto-rollback  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 8. Infrastructure as Code (IaC)

#### Terraform — Deploy Infrastructure

```hcl
# main.tf — Infrastructure untuk aplikasi absensi
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-southeast-1"  # Singapore (dekat Indonesia)
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "absensi-vpc"
    Project = "absensi-sekolah"
  }
}

# Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-southeast-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "absensi-public-subnet"
  }
}

# Security Group
resource "aws_security_group" "app" {
  name        = "absensi-app-sg"
  description = "Security group for absensi app"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "absensi-app-sg"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "absensi-cluster"

  tags = {
    Name = "absensi-cluster"
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "absensi-app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  execution_role_arn = aws_iam_role.ecs_execution.arn

  container_definitions = jsonencode([
    {
      name  = "absensi"
      image = "ghcr.io/${var.github_repo}/absensi:latest"
      portMappings = [
        {
          containerPort = 8000
          hostPort      = 8000
        }
      ]
      environment = [
        { name = "DATABASE_URL", value = var.database_url },
        { name = "SECRET_KEY", value = var.secret_key },
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/absensi"
          awslogs-region        = "ap-southeast-1"
          awslogs-stream-prefix = "app"
        }
      }
    }
  ])

  tags = {
    Name = "absensi-task"
  }
}

# ECS Service
resource "aws_ecs_service" "app" {
  name            = "absensi-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public.id]
    security_groups  = [aws_security_group.app.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "absensi"
    container_port   = 8000
  }

  tags = {
    Name = "absensi-service"
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "absensi-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.app.id]
  subnets            = [aws_subnet.public.id]

  tags = {
    Name = "absensi-alb"
  }
}

resource "aws_lb_target_group" "app" {
  name     = "absensi-tg"
  port     = 8000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  tags = {
    Name = "absensi-tg"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.ssl_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# Variables
variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

variable "database_url" {
  description = "Database connection URL"
  type        = string
  sensitive   = true
}

variable "secret_key" {
  description = "Application secret key"
  type        = string
  sensitive   = true
}

variable "ssl_certificate_arn" {
  description = "ACM certificate ARN for HTTPS"
  type        = string
}

# Outputs
output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "app_url" {
  value = "https://${aws_lb.main.dns_name}"
}
```

```bash
# Terraform workflow
terraform init          # Initialize
terraform plan          # Preview changes
terraform apply         # Apply changes
terraform destroy       # Destroy all resources (hati-hati!)

# State management
terraform state list    # List resources in state
terraform state show <resource>  # Show resource details
```

#### Pulumi — Infrastructure with Python

```python
# __main__.py — Pulumi dengan Python
import pulumi
import pulumi_aws as aws

# VPC
vpc = aws.ec2.Vpc("absensi-vpc",
    cidr_block="10.0.0.0/16",
    enable_dns_hostnames=True,
    enable_dns_support=True,
    tags={"Name": "absensi-vpc"}
)

# Subnet
subnet = aws.ec2.Subnet("absensi-subnet",
    vpc_id=vpc.id,
    cidr_block="10.0.1.0/24",
    availability_zone="ap-southeast-1a",
    map_public_ip_on_launch=True,
    tags={"Name": "absensi-subnet"}
)

# Security Group
sg = aws.ec2.SecurityGroup("absensi-sg",
    vpc_id=vpc.id,
    description="Security group for absensi app",
    ingress=[
        aws.ec2.SecurityGroupIngressArgs(
            protocol="tcp",
            from_port=443,
            to_port=443,
            cidr_blocks=["0.0.0.0/0"],
        ),
    ],
    egress=[
        aws.ec2.SecurityGroupEgressArgs(
            protocol="-1",
            from_port=0,
            to_port=0,
            cidr_blocks=["0.0.0.0/0"],
        ),
    ],
    tags={"Name": "absensi-sg"}
)

# ECS Cluster
cluster = aws.ecs.Cluster("absensi-cluster",
    tags={"Name": "absensi-cluster"}
)

# Outputs
pulumi.export("vpc_id", vpc.id)
pulumi.export("subnet_id", subnet.id)
pulumi.export("cluster_name", cluster.name)
```

```bash
# Pulumi workflow
pulumi stack init dev     # Create dev stack
pulumi up                 # Preview and apply
pulumi stack output       # Show outputs
pulumi destroy            # Destroy resources
pulumi stack rm dev       # Remove stack
```

---

### 9. Container Deployment

#### Docker — Production-Ready Dockerfile

```dockerfile
# Dockerfile — Multi-stage build untuk production
# Stage 1: Build
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /app/wheels -r requirements.txt

# Stage 2: Production
FROM python:3.11-slim AS production

WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy wheels from builder
COPY --from=builder /app/wheels /wheels
RUN pip install --no-cache /wheels/*

# Copy application code
COPY src/ ./src/
COPY main.py .

# Create non-root user
RUN useradd --create-home appuser
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Expose port
EXPOSE 8000

# Run with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

```yaml
# docker-compose.yml — Development
version: "3.8"

services:
  app:
    build:
      context: .
      target: production
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///data/absensi.db
      - SECRET_KEY=dev-secret-key-change-in-production
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  # Optional: Adminer untuk manage SQLite
  adminer:
    image: adminer
    ports:
      - "8080:8080"
    volumes:
      - ./data:/data
```

#### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: absensi
  labels:
    app: absensi
    version: v1.1.0
spec:
  replicas: 3
  selector:
    matchLabels:
      app: absensi
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: absensi
        version: v1.1.0
    spec:
      containers:
        - name: absensi
          image: ghcr.io/org/absensi:v1.1.0
          ports:
            - containerPort: 8000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: absensi-secrets
                  key: database-url
            - name: SECRET_KEY
              valueFrom:
                secretKeyRef:
                  name: absensi-secrets
                  key: secret-key
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 256Mi
          readinessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 15
            periodSeconds: 20
          volumeMounts:
            - name: data
              mountPath: /app/data
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: absensi-data

---
apiVersion: v1
kind: Service
metadata:
  name: absensi-service
spec:
  selector:
    app: absensi
  ports:
    - port: 80
      targetPort: 8000
  type: LoadBalancer

---
apiVersion: v1
kind: Secret
metadata:
  name: absensi-secrets
type: Opaque
data:
  database-url: c3FsaXRlOi8vL2FwcC9kYXRhL2Fic2Vuc2kuZGI=  # base64 encoded
  secret-key: cHJvZHVjdGlvbi1zZWNyZXQta2V5LWNoYW5nZS10aGlz  # base64 encoded
```

---

### 10. Serverless Deployment

#### AWS Lambda dengan FastAPI (Mangum)

```python
# lambda_handler.py
from mangum import Mangum
from main import app

# Mangum adapter untuk FastAPI → Lambda
handler = Mangum(app, lifespan="off")
```

```yaml
# serverless.yml — Serverless Framework
service: absensi-api

provider:
  name: aws
  runtime: python3.11
  region: ap-southeast-1
  environment:
    DATABASE_URL: ${ssm:/absensi/database-url}
    SECRET_KEY: ${ssm:/absensi/secret-key}
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - ssm:GetParameter
          Resource: arn:aws:ssm:ap-southeast-1:*:parameter/absensi/*

functions:
  api:
    handler: lambda_handler.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
      - http:
          path: /
          method: ANY

plugins:
  - serverless-python-requirements

custom:
  pythonRequirements:
    dockerizePip: true
    slim: true
```

```bash
# Deploy
serverless deploy

# Deploy specific stage
serverless deploy --stage production

# Invoke function locally
serverless invoke local --function api --path test-event.json
```

#### Google Cloud Functions

```python
# main.py — Cloud Functions
from functions_framework import http
from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/absensi")
def input_absensi():
    # ... logic
    return {"success": True}

# Cloud Functions entry point
@http
def handler(request):
    mangum = Mangum(app)
    return mangum(request)
```

```bash
# Deploy
gcloud functions deploy absensi-api \
    --runtime python311 \
    --trigger-http \
    --allow-unauthenticated \
    --region asia-southeast2 \
    --memory 256MB \
    --timeout 30s \
    --set-env-vars DATABASE_URL=sqlite:///tmp/absensi.db
```

---

### 11. Deployment Monitoring dan Rollback

#### Health Check Endpoints

```python
# health.py
from fastapi import APIRouter
import sqlite3
import time
import os

router = APIRouter()

@router.get("/health")
def health_check():
    """Basic health check — is the app running?"""
    return {
        "status": "ok",
        "timestamp": time.time(),
        "version": os.getenv("APP_VERSION", "unknown"),
    }

@router.get("/health/ready")
def readiness_check():
    """Readiness check — is the app ready to serve traffic?"""
    checks = {}

    # Database check
    try:
        conn = sqlite3.connect("data/absensi.db")
        conn.execute("SELECT 1")
        conn.close()
        checks["database"] = "ok"
    except Exception as e:
        checks["database"] = f"error: {str(e)}"

    # Disk space check
    stat = os.statvfs("data")
    free_gb = (stat.f_bavail * stat.f_frsize) / (1024 ** 3)
    checks["disk_free_gb"] = round(free_gb, 2)
    if free_gb < 1:
        checks["disk"] = "warning: low disk space"

    # Overall status
    all_ok = all(v == "ok" for k, v in checks.items() if k != "disk_free_gb")
    status_code = 200 if all_ok else 503

    return {
        "status": "ready" if all_ok else "not_ready",
        "checks": checks,
    }, status_code

@router.get("/health/live")
def liveness_check():
    """Liveness check — should Kubernetes restart this pod?"""
    # Check if process is alive (simple)
    return {"status": "alive"}, 200
```

#### Monitoring dengan Prometheus + Grafana

```python
# metrics.py — Prometheus metrics
from prometheus_client import Counter, Histogram, generate_latest
from fastapi import APIRouter, Response
import time

router = APIRouter()

# Metrics definitions
REQUEST_COUNT = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status"]
)

REQUEST_DURATION = Histogram(
    "http_request_duration_seconds",
    "HTTP request duration",
    ["method", "endpoint"]
)

ERROR_COUNT = Counter(
    "http_errors_total",
    "Total HTTP errors",
    ["method", "endpoint", "error_type"]
)

# Middleware untuk collect metrics
@app.middleware("http")
async def metrics_middleware(request, call_next):
    start_time = time.time()

    response = await call_next(request)

    duration = time.time() - start_time

    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()

    REQUEST_DURATION.labels(
        method=request.method,
        endpoint=request.url.path
    ).observe(duration)

    if response.status_code >= 500:
        ERROR_COUNT.labels(
            method=request.method,
            endpoint=request.url.path,
            error_type="server_error"
        ).inc()

    return response

@router.get("/metrics")
def metrics():
    """Prometheus metrics endpoint."""
    return Response(content=generate_latest(), media_type="text/plain")
```

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "absensi"
    static_configs:
      - targets: ["localhost:8000"]
    metrics_path: "/metrics"
```

#### Rollback Strategy

```bash
#!/bin/bash
# rollback.sh — Automated rollback script

set -e

echo "🔄 Starting rollback..."

# 1. Get current and previous version
CURRENT_VERSION=$(curl -s http://localhost:8000/health | jq -r '.version')
PREVIOUS_VERSION=$(git log --oneline -2 | tail -1 | cut -d' ' -f1)

echo "  Current version: $CURRENT_VERSION"
echo "  Rolling back to: $PREVIOUS_VERSION"

# 2. Confirm rollback
read -p "Continue with rollback? (y/N) " confirm
if [ "$confirm" != "y" ]; then
    echo "Rollback cancelled."
    exit 0
fi

# 3. Rollback Docker
echo "  → Rolling back Docker image..."
docker stop absensi-app
docker rm absensi-app
docker run -d --name absensi-app -p 8000:8000 absensi:$PREVIOUS_VERSION

# 4. Health check
echo "  → Running health check..."
sleep 5
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health)
if [ "$response" != "200" ]; then
    echo "❌ Rollback failed! Health check returned $response"
    exit 1
fi

# 5. Verify version
version=$(curl -s http://localhost:8000/health | jq -r '.version')
echo "  → Active version after rollback: $version"

# 6. Notify
echo "✅ Rollback complete! $PREVIOUS_VERSION is now active."

# Optional: Send notification
# curl -X POST $SLACK_WEBHOOK -d '{"text": "Rollback complete: '$CURRENT_VERSION' → '$PREVIOUS_VERSION'"}'
```

#### Kubernetes Rollback

```bash
# Kubernetes automatic rollback
kubectl rollout status deployment/absensi --timeout=300s

# Manual rollback
kubectl rollout undo deployment/absensi

# Rollback to specific revision
kubectl rollout undo deployment/absensi --to-revision=2

# Check rollout history
kubectl rollout history deployment/absensi

# Pause rollout (untuk investigate)
kubectl rollout pause deployment/absensi

# Resume rollout
kubectl rollout resume deployment/absensi
```

#### Deployment Monitoring Dashboard

```markdown
## Deployment Monitoring Checklist

### Pre-Deployment
- [ ] CI/CD pipeline semua stage passed
- [ ] Database migration sudah di-test di staging
- [ ] Environment variables sudah di-set
- [ ] Rollback plan sudah disiapkan

### During Deployment
- [ ] Monitor error rate (harus tetap < 1%)
- [ ] Monitor response time (P95 < 500ms)
- [ ] Monitor CPU/memory usage
- [ ] Monitor database connections

### Post-Deployment (15 menit pertama)
- [ ] Health check endpoint returns 200
- [ ] Error rate tidak meningkat
- [ ] Response time tidak meningkat
- [ ] No new errors di log
- [ ] User feedback positif (jika ada monitoring)

### Post-Deployment (1 jam pertama)
- [ ] Business metrics normal (jumlah absensi input, dll)
- [ ] No increase in support tickets
- [ ] Database performance normal
- [ ] Backup berjalan normal

### Rollback Triggers
Rollback JIKA:
- Error rate > 5% selama 5 menit
- Response time P95 > 2 detik selama 10 menit
- Database connection pool exhausted
- Critical bug ditemukan oleh user
- Health check fail 3x berturut-turut
```

---

## ✅ CHECKLIST

- [ ] Bisa melakukan interactive rebase untuk membersihkan commit history
- [ ] Paham git bisect dan bisa gunakan untuk menemukan bug-introducing commit
- [ ] Bisa setup dan menggunakan git worktrees untuk parallel development
- [ ] Paham git submodules dan kapan harus menggunakannya
- [ ] Bisa setup pre-commit hooks untuk quality gates otomatis
- [ ] Paham perbedaan blue-green, canary, rolling, dan A/B deployment
- [ ] Bisa mendesain CI/CD pipeline dengan GitHub Actions
- [ ] Paham Infrastructure as Code (Terraform/Pulumi)
- [ ] Bisa membuat production-ready Dockerfile
- [ ] Paham Kubernetes deployment dan service configuration
- [ ] Bisa deploy ke serverless platform (AWS Lambda, Cloud Functions)
- [ ] Bisa setup health check endpoints dan monitoring
- [ ] Paham rollback strategy dan bisa execute rollback
- [ ] Memahami prinsip dari awesome-vibe-coding-guide: commit early and often, deploy early

---

## 📚 REFERENSI

- [awesome-vibe-coding-guide](https://github.com/analyticalrohit/awesome-vibe-coding-guide) — Version Control and Deployment
- [Git Documentation](https://git-scm.com/doc) — Official Git docs
- [Conventional Commits](https://www.conventionalcommits.org/) — Commit message format
- [GitHub Actions](https://docs.github.com/en/actions) — CI/CD automation
- [Terraform](https://developer.hashicorp.com/terraform) — Infrastructure as Code
- [Docker](https://docs.docker.com/) — Container platform
- [Kubernetes](https://kubernetes.io/docs/) — Container orchestration
- [Prometheus](https://prometheus.io/) — Monitoring system

---

> **Lanjut ke:** [`06-spesifikasi-driven-dev.md`](./06-spesifikasi-driven-dev.md)
