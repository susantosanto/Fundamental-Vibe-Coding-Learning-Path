# B4: CI/CD Integration dengan AI

> **Desain pipeline CI/CD lengkap: build → test → security scan → deploy, GitHub Actions, environment management, rollback, monitoring, dan release automation**

**Estimasi**: 40 menit belajar + 60 menit praktik | **Level**: Intermediate → Advanced

## 🎯 Outcome

Setelah menyelesaikan modul ini, kamu akan mampu:

1. Mendesain pipeline CI/CD dengan stage build → test → security → deploy
2. Membuat GitHub Actions workflow untuk berbagai jenis proyek
3. Mengkonfigurasi automated testing di CI (unit, integration, E2E, performance)
4. Setup code quality gates: linting, type checking, coverage, security scan
5. Mengimplementasikan automated deployment: staging → production
6. Mengelola environment: dev, staging, production, secrets management
7. Membuat rollback strategy: automatic dan manual rollback
8. Integrasi monitoring: health checks, post-deployment verification, alerting
9. Setup security scanning di CI/CD: SAST, DAST, dependency, container scanning
10. Otomatisasi release: version bumping, changelog, tag, release notes
11. Menerapkan CI/CD untuk aplikasi administrasi sekolah

## 🤔 Masalah yang Diselesaikan

CI/CD (Continuous Integration / Continuous Deployment) adalah praktik yang sering dianggap rumit dan memakan waktu. AI mengubah ini secara fundamental:

| Masalah Tradisional | Solusi dengan AI |
|---------------------|------------------|
| Menulis workflow YAML butuh trial-error | AI generate workflow lengkap dari analisis proyek |
| Test di CI sering fail karena konfigurasi | AI auto-detect framework dan setup environment |
| Security scan manual dan lambat | AI integrasi SAST/DAST otomatis di pipeline |
| Deploy manual berisiko human error | AI setup auto-deploy dengan approval gate |
| Rollback saat deploy gagal butuh waktu | AI buat rollback strategy otomatis |
| Environment variable management berantakan | AI setup secrets management terstruktur |
| Release notes manual dan tidak konsisten | AI generate dari commit history + changelog |
| Monitoring post-deploy lupa di-setup | AI integrasi health check dan alerting |

---

## 🔑 Konsep Inti

### Pipeline CI/CD Modern

Pipeline CI/CD adalah serangkaian stage yang otomatis dijalankan setiap ada perubahan kode:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CI/CD PIPELINE FLOW                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Trigger (push/PR)                                                      │
│       │                                                                 │
│       ▼                                                                 │
│  ┌─────────────┐                                                        │
│  │   LINT      │ ← ESLint, Prettier, Style Check                        │
│  └──────┬──────┘                                                        │
│         │ ✅                                                            │
│         ▼                                                               │
│  ┌─────────────┐                                                        │
│  │   TYPE      │ ← TypeScript check, Type validation                    │
│  └──────┬──────┘                                                        │
│         │ ✅                                                            │
│         ▼                                                               │
│  ┌─────────────┐                                                        │
│  │   TEST      │ ← Unit Test → Integration Test → E2E Test              │
│  └──────┬──────┘                                                        │
│         │ ✅                                                            │
│         ▼                                                               │
│  ┌─────────────┐                                                        │
│  │   BUILD     │ ← Compile, Bundle, Optimize                            │
│  └──────┬──────┘                                                        │
│         │ ✅                                                            │
│         ▼                                                               │
│  ┌─────────────┐                                                        │
│  │  SECURITY   │ ← SAST → DAST → Dependency Scan → Container Scan       │
│  └──────┬──────┘                                                        │
│         │ ✅                                                            │
│         ▼                                                               │
│  ┌─────────────┐                                                        │
│  │  DEPLOY     │ ← Staging → Approval → Production                      │
│  └─────────────┘                                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Environment Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENVIRONMENT PROMOTION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Development ──────▶ Staging ──────▶ Production                 │
│  (dev)               (staging)       (prod)                      │
│                                                                 │
│  ├─ Auto-deploy      ├─ Auto-deploy   ├─ Manual approval        │
│  ├─ Debug mode       ├─ Test data     ├─ Real data              │
│  ├─ Hot reload       ├─ Staging DB    ├─ Production DB          │
│  ├─ Local secrets    ├─ Staging keys  ├─ Production secrets     │
│  └─ Setiap commit    └─ Setiap merge  └─ Setiap release tag     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### AI-Generated CI/CD

AI bisa menganalisis proyek dan generate pipeline yang sesuai:

1. **Deteksi tech stack** — Baca package.json, requirements.txt, go.mod
2. **Deteksi test framework** — Jest, Vitest, pytest, Go test
3. **Deteksi build tool** — Vite, Webpack, esbuild, tsc
4. **Deteksi deployment target** — Vercel, AWS, Docker, Kubernetes
5. **Generate workflow** — YAML lengkap dengan semua stage
6. **Setup secrets** — Daftar environment variable yang dibutuhkan
7. **Configure monitoring** — Health check endpoint, alerting

---

## 🚀 Praktik Lengkap

### Step 1: Pipeline Design — Build → Test → Security → Deploy

#### 1.1 Analisis Proyek untuk Pipeline

Sebelum membuat pipeline, AI perlu memahami proyek:

```
@explore Analisis proyek ini untuk CI/CD pipeline:

1. Baca package.json / requirements.txt / go.mod
2. Identifikasi test framework yang digunakan
3. Cek build script dan dependencies
4. Lihat ada Dockerfile atau docker-compose.yml
5. Cek environment variable di .env.example
6. Identifikasi deployment target (jika ada)

Buat summary:
- Tech stack dan versi
- Test framework dan lokasi test
- Build command dan output
- Deployment method
- Environment variable yang dibutuhkan
- Security concern (API keys, database credentials)
```

#### 1.2 Pipeline Design untuk Node.js/TypeScript Project

```
Buatkan CI/CD pipeline untuk proyek Node.js/TypeScript dengan:

Tech Stack:
- Runtime: Node.js 20 LTS
- Framework: Express.js / Fastify
- Database: PostgreSQL
- Test: Vitest + Supertest
- Build: TypeScript (tsc) + esbuild
- Deploy: Docker → VPS / Cloud

Pipeline Stage:
1. Lint (ESLint + Prettier)
2. Type Check (tsc --noEmit)
3. Unit Test (Vitest)
4. Integration Test (Supertest)
5. Build (tsc + esbuild)
6. Security Scan (npm audit + SAST)
7. Docker Build & Push
8. Deploy to Staging
9. Deploy to Production (manual approval)
```

### Step 2: GitHub Actions Workflows

#### 2.1 Workflow Lengkap untuk Node.js API

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  POSTGRES_VERSION: '15'

jobs:
  # ─────────────────────────────────────────
  # STAGE 1: LINT
  # ─────────────────────────────────────────
  lint:
    name: 🔍 Lint Code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check Prettier formatting
        run: npm run format:check

  # ─────────────────────────────────────────
  # STAGE 2: TYPE CHECK
  # ─────────────────────────────────────────
  typecheck:
    name: 🔎 Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run TypeScript check
        run: npx tsc --noEmit

  # ─────────────────────────────────────────
  # STAGE 3: UNIT TEST
  # ─────────────────────────────────────────
  test-unit:
    name: 🧪 Unit Tests
    runs-on: ubuntu-latest
    needs: [lint, typecheck]
    services:
      postgres:
        image: postgres:${{ env.POSTGRES_VERSION }}
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run database migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db

      - name: Run unit tests
        run: npm run test:unit
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db
          JWT_SECRET: test-secret-key
          NODE_ENV: test

      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

  # ─────────────────────────────────────────
  # STAGE 4: INTEGRATION TEST
  # ─────────────────────────────────────────
  test-integration:
    name: 🔗 Integration Tests
    runs-on: ubuntu-latest
    needs: [lint, typecheck]
    services:
      postgres:
        image: postgres:${{ env.POSTGRES_VERSION }}
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run database migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret-key
          NODE_ENV: test

  # ─────────────────────────────────────────
  # STAGE 5: BUILD
  # ─────────────────────────────────────────
  build:
    name: 📦 Build Application
    runs-on: ubuntu-latest
    needs: [test-unit, test-integration]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  # ─────────────────────────────────────────
  # STAGE 6: SECURITY SCAN
  # ─────────────────────────────────────────
  security:
    name: 🔒 Security Scan
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --audit-level=moderate
        continue-on-error: true

      - name: Run SAST with Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/javascript
            p/owasp-top-ten
            p/security-audit

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'

  # ─────────────────────────────────────────
  # STAGE 7: DOCKER BUILD & PUSH
  # ─────────────────────────────────────────
  docker:
    name: 🐳 Docker Build & Push
    runs-on: ubuntu-latest
    needs: [security]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=sha,prefix=
            type=ref,event=branch
            type=semver,pattern={{version}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ─────────────────────────────────────────
  # STAGE 8: DEPLOY TO STAGING
  # ─────────────────────────────────────────
  deploy-staging:
    name: 🚀 Deploy to Staging
    runs-on: ubuntu-latest
    needs: [docker]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment:
      name: staging
      url: https://staging.sdnpasirhalang.sch.id
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to staging server
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /opt/app
            docker compose pull
            docker compose up -d --remove-orphans
            docker system prune -f

      - name: Health check staging
        run: |
          echo "Waiting for staging to start..."
          sleep 30
          curl -f https://staging.sdnpasirhalang.sch.id/health || exit 1

  # ─────────────────────────────────────────
  # STAGE 9: DEPLOY TO PRODUCTION (Manual)
  # ─────────────────────────────────────────
  deploy-production:
    name: 🎯 Deploy to Production
    runs-on: ubuntu-latest
    needs: [deploy-staging]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment:
      name: production
      url: https://sdnpasirhalang.sch.id
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to production server
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /opt/app
            docker compose pull
            docker compose up -d --remove-orphans
            docker system prune -f

      - name: Health check production
        run: |
          echo "Waiting for production to start..."
          sleep 30
          curl -f https://sdnpasirhalang.sch.id/health || exit 1

      - name: Notify deployment success
        if: success()
        uses: slackapi/slack-github-action@v1.25.0
        with:
          channel-id: 'deployments'
          slack-message: "✅ Production deploy successful: ${{ github.sha }}"
        env:
          SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

#### 2.2 Workflow untuk Frontend (React/Vite)

```yaml
# .github/workflows/frontend-ci.yml
name: Frontend CI/CD

on:
  push:
    branches: [main]
    paths: ['frontend/**']
  pull_request:
    branches: [main]
    paths: ['frontend/**']

defaults:
  run:
    working-directory: frontend

jobs:
  quality:
    name: 🔍 Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript check
        run: npx tsc --noEmit

      - name: Run Prettier check
        run: npm run format:check

  test:
    name: 🧪 Tests
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Run E2E tests
        uses: cypress-io/github-action@v6
        with:
          working-directory: frontend
          start: npm run dev
          wait-on: 'http://localhost:5173'

      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: frontend-coverage
          path: frontend/coverage/

  build:
    name: 📦 Build & Deploy
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Build production
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: frontend
          vercel-args: '--prod'
```

#### 2.3 Workflow untuk Python/Flask Project

```yaml
# .github/workflows/python-ci.yml
name: Python CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    name: 🐍 Python CI
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: 'pip'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Run flake8 lint
        run: flake8 src/ --max-line-length=100

      - name: Run mypy type check
        run: mypy src/

      - name: Run pytest
        run: pytest tests/ --cov=src --cov-report=xml
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db
          FLASK_ENV: testing

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          file: ./coverage.xml
          fail_ci_if_error: true

      - name: Run Bandit security scan
        run: bandit -r src/ -f json -o bandit-results.json

      - name: Run pip-audit
        run: pip-audit -r requirements.txt --format json -o pip-audit-results.json
```

### Step 3: Automated Testing di CI

#### 3.1 Test Strategy Matrix

```
┌──────────────────────────────────────────────────────────────────────┐
│                        TEST PYRAMID                                   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                         /\                                           │
│                        /  \    E2E Tests (10%)                       │
│                       /    \   Full browser, real user flows          │
│                      /──────\  Cypress, Playwright                    │
│                     /        \                                       │
│                    /  ──────  \                                      │
│                   / /        \ \   Integration Tests (20%)           │
│                  / /          \ \  API endpoints, DB interaction     │
│                 / /            \ \ Supertest, HTTP clients           │
│                / /              \ \                                  │
│               / /────────────────\ \                                │
│              / /                  \ \                               │
│             / /                    \ \  Unit Tests (70%)            │
│            / /                      \ \ Functions, modules, utils   │
│           /_/________________________\_\ Vitest, Jest, pytest       │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

#### 3.2 Unit Test Configuration

```yaml
# Test job dengan coverage threshold
test-unit:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4

    - name: Run tests with coverage
      run: npm run test:unit -- --coverage

    - name: Check coverage threshold
      run: |
        # Pastikan coverage minimal 80%
        node -e "
          const report = require('./coverage/coverage-summary.json').total;
          const thresholds = { lines: 80, branches: 75, functions: 80, statements: 80 };
          for (const [key, threshold] of Object.entries(thresholds)) {
            const actual = report[key].pct;
            if (actual < threshold) {
              console.error(\`❌ \${key} coverage \${actual}% < \${threshold}%\`);
              process.exit(1);
            }
            console.log(\`✅ \${key} coverage \${actual}% >= \${threshold}%\`);
          }
        "

    - name: Upload coverage report
      uses: actions/upload-artifact@v4
      with:
        name: unit-test-coverage
        path: coverage/
```

#### 3.3 E2E Test dengan Playwright

```yaml
test-e2e:
  name: 🌐 E2E Tests
  runs-on: ubuntu-latest
  needs: [test-unit, test-integration]
  steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Install Playwright browsers
      run: npx playwright install --with-deps

    - name: Start application
      run: npm run dev &
      env:
        DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
        NODE_ENV: test

    - name: Wait for app to be ready
      run: npx wait-on http://localhost:3000/health

    - name: Run E2E tests
      run: npx playwright test
      env:
        BASE_URL: http://localhost:3000

    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: playwright-report
        path: playwright-report/
```

#### 3.4 Performance Test dengan k6

```yaml
test-performance:
  name: ⚡ Performance Tests
  runs-on: ubuntu-latest
  needs: [deploy-staging]
  steps:
    - uses: actions/checkout@v4

    - name: Run k6 load test
      uses: grafana/k6-action@v0.3.0
      with:
        filename: tests/performance/load-test.js
        flags: --out json=results.json
      env:
        BASE_URL: https://staging.sdnpasirhalang.sch.id

    - name: Check performance thresholds
      run: |
        node -e "
          const results = require('./results.json');
          const httpReqDuration = results.metrics.http_req_duration;
          const p95 = httpReqDuration.values['p(95)'];
          if (p95 > 500) {
            console.error(\`❌ P95 response time \${p95}ms > 500ms threshold\`);
            process.exit(1);
          }
          console.log(\`✅ P95 response time \${p95}ms < 500ms\`);
        "
```

### Step 4: Code Quality Gates

#### 4.1 Linting dan Formatting

```yaml
quality-gates:
  name: 🚦 Quality Gates
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    # ESLint — JavaScript/TypeScript linting
    - name: ESLint
      run: npx eslint . --max-warnings=0

    # Prettier — Code formatting
    - name: Prettier
      run: npx prettier --check .

    # TypeScript — Type checking
    - name: TypeScript
      run: npx tsc --noEmit

    # Commit message format
    - name: Check commit messages
      uses: webiny/action-conventional-commits@v1.3.0
      with:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    # File size check
    - name: Check file sizes
      run: |
        # Tidak ada file > 1MB di repo
        find . -type f -size +1M | grep -v node_modules | grep -v .git && exit 1 || true

    # No console.log in production code
    - name: No console.log in src/
      run: |
        if grep -r "console\.log" src/ --include="*.ts" --include="*.js"; then
          echo "❌ Found console.log in production code"
          exit 1
        fi
```

#### 4.2 Coverage Threshold di CI

```yaml
# Di workflow, tambahkan coverage check
coverage-check:
  runs-on: ubuntu-latest
  needs: test-unit
  steps:
    - uses: actions/checkout@v4

    - name: Download coverage
      uses: actions/download-artifact@v4
      with:
        name: unit-test-coverage

    - name: Check coverage thresholds
      run: |
        # Coverage threshold configuration
        THRESHOLD_LINES=80
        THRESHOLD_BRANCHES=75
        THRESHOLD_FUNCTIONS=80
        THRESHOLD_STATEMENTS=80

        # Parse coverage summary
        node -e "
          const fs = require('fs');
          const summary = JSON.parse(fs.readFileSync('coverage-summary.json', 'utf8'));
          const total = summary.total;

          const checks = [
            { name: 'Lines', actual: total.lines.pct, threshold: $THRESHOLD_LINES },
            { name: 'Branches', actual: total.branches.pct, threshold: $THRESHOLD_BRANCHES },
            { name: 'Functions', actual: total.functions.pct, threshold: $THRESHOLD_FUNCTIONS },
            { name: 'Statements', actual: total.statements.pct, threshold: $THRESHOLD_STATEMENTS },
          ];

          let failed = false;
          for (const check of checks) {
            const status = check.actual >= check.threshold ? '✅' : '❌';
            console.log(\`\${status} \${check.name}: \${check.actual}% (threshold: \${check.threshold}%)\`);
            if (check.actual < check.threshold) failed = true;
          }

          if (failed) process.exit(1);
        "
```

#### 4.3 Security Scanning di CI/CD

```yaml
security-scan:
  name: 🔒 Security Scanning
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4

    # SAST — Static Application Security Testing
    - name: Semgrep SAST
      uses: returntocorp/semgrep-action@v1
      with:
        config: >-
          p/javascript
          p/owasp-top-ten
          p/security-audit
          p/cwe-top-25

    # Dependency scanning
    - name: npm audit
      run: npm audit --audit-level=high --json > npm-audit.json
      continue-on-error: true

    - name: Check for critical vulnerabilities
      run: |
        CRITICAL=$(cat npm-audit.json | jq '.metadata.vulnerabilities.critical')
        HIGH=$(cat npm-audit.json | jq '.metadata.vulnerabilities.high')
        if [ "$CRITICAL" -gt 0 ] || [ "$HIGH" -gt 5 ]; then
          echo "❌ Too many vulnerabilities: $CRITICAL critical, $HIGH high"
          exit 1
        fi

    # Secret scanning
    - name: Detect secrets
      uses: trufflesecurity/trufflehog@main
      with:
        extra_args: --only-verified

    # Container scanning (jika pakai Docker)
    - name: Trivy container scan
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'ghcr.io/${{ github.repository }}:latest'
        format: 'sarif'
        output: 'trivy-results.sarif'
        severity: 'CRITICAL,HIGH'

    # DAST — Dynamic Application Security Testing (post-deploy)
    - name: OWASP ZAP DAST
      uses: zaproxy/action-baseline@v0.10.0
      with:
        target: 'https://staging.sdnpasirhalang.sch.id'
        rules_file_name: '.zap/rules.tsv'
        cmd_options: '-a'
```

### Step 5: Automated Deployment

#### 5.1 Environment Promotion Strategy

```yaml
# .github/workflows/deploy.yml
name: Deploy Pipeline

on:
  push:
    tags:
      - 'v*'

jobs:
  # Deploy ke staging otomatis saat tag dibuat
  deploy-staging:
    name: 🚀 Deploy Staging
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to staging
        run: |
          echo "Deploying ${{ github.ref_name }} to staging..."
          # Deploy script
          ./scripts/deploy.sh staging ${{ github.ref_name }}

      - name: Post-deployment verification
        run: |
          # Health check
          curl -f https://staging.sdnpasirhalang.sch.id/health

          # Smoke test — test critical endpoints
          curl -f https://staging.sdnpasirhalang.sch.id/api/health
          curl -f https://staging.sdnpasirhalang.sch.id/api/version

          # Database connectivity check
          curl -f https://staging.sdnpasirhalang.sch.id/api/db/check

  # Deploy ke production butuh manual approval
  deploy-production:
    name: 🎯 Deploy Production
    runs-on: ubuntu-latest
    needs: deploy-staging
    environment:
      name: production
      # GitHub akan pause dan tunggu approval manual
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to production
        run: |
          echo "Deploying ${{ github.ref_name }} to production..."
          ./scripts/deploy.sh production ${{ github.ref_name }}

      - name: Post-deployment verification
        run: |
          # Health check
          curl -f https://sdnpasirhalang.sch.id/health

          # Smoke test
          curl -f https://sdnpasirhalang.sch.id/api/health
          curl -f https://sdnpasirhalang.sch.id/api/version

          # Database connectivity
          curl -f https://sdnpasirhalang.sch.id/api/db/check

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
          tag_name: ${{ github.ref_name }}

      - name: Notify deployment
        uses: slackapi/slack-github-action@v1.25.0
        with:
          channel-id: 'deployments'
          slack-message: |
            🎉 Production Deploy Success!
            Version: ${{ github.ref_name }}
            Commit: ${{ github.sha }}
            Deployed by: ${{ github.actor }}
        env:
          SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

#### 5.2 Deployment Script

```bash
#!/bin/bash
# scripts/deploy.sh
# Usage: ./scripts/deploy.sh <environment> <version>

set -e

ENVIRONMENT=$1
VERSION=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$VERSION" ]; then
  echo "Usage: $0 <environment> <version>"
  exit 1
fi

echo "🚀 Deploying version $VERSION to $ENVIRONMENT..."

# Load environment-specific config
if [ "$ENVIRONMENT" == "staging" ]; then
  HOST="${STAGING_HOST}"
  USER="${STAGING_USER}"
  DEPLOY_DIR="/opt/app-staging"
elif [ "$ENVIRONMENT" == "production" ]; then
  HOST="${PROD_HOST}"
  USER="${PROD_USER}"
  DEPLOY_DIR="/opt/app"
else
  echo "❌ Unknown environment: $ENVIRONMENT"
  exit 1
fi

# SSH deploy
ssh -o StrictHostKeyChecking=no ${USER}@${HOST} << EOF
  set -e

  echo "📦 Pulling Docker image..."
  cd ${DEPLOY_DIR}
  docker compose pull

  echo "🔄 Starting new version..."
  docker compose up -d --remove-orphans

  echo "🧹 Cleaning up old images..."
  docker system prune -f

  echo "✅ Deploy complete!"
  docker compose ps
EOF

echo "✅ Deployment to $ENVIRONMENT successful!"
```

### Step 6: Environment Management

#### 6.1 Environment Variables Structure

```
┌────────────────────────────────────────────────────────────────────┐
│                    ENVIRONMENT VARIABLES                           │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  .env.development     .env.staging         .env.production         │
│  ─────────────────    ────────────────     ─────────────────       │
│  NODE_ENV=dev         NODE_ENV=staging     NODE_ENV=production     │
│  DEBUG=true           DEBUG=false          DEBUG=false             │
│  LOG_LEVEL=debug      LOG_LEVEL=info       LOG_LEVEL=warn          │
│  DB_HOST=localhost    DB_HOST=staging-db   DB_HOST=prod-db         │
│  DB_NAME=app_dev      DB_NAME=app_staging  DB_NAME=app_prod        │
│  JWT_SECRET=dev-key   JWT_SECRET=***       JWT_SECRET=***          │
│  API_RATE_LIMIT=1000  API_RATE_LIMIT=500   API_RATE_LIMIT=100      │
│  CORS_ORIGIN=*        CORS_ORIGIN=staging  CORS_ORIGIN=production  │
│  EMAIL_MOCK=true      EMAIL_MOCK=true      EMAIL_MOCK=false        │
│  CACHE_TTL=0          CACHE_TTL=300        CACHE_TTL=3600          │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### 6.2 GitHub Secrets Management

```yaml
# Setup environment di GitHub Settings → Environments

# Environment: staging
# Variables:
#   STAGING_HOST: staging.sdnpasirhalang.sch.id
#   STAGING_USER: deploy
#   DATABASE_URL: postgresql://... (staging)
#   REDIS_URL: redis://... (staging)
#   JWT_SECRET: staging-secret-key
#   API_URL: https://staging.sdnpasirhalang.sch.id

# Environment: production
# Variables:
#   PROD_HOST: sdnpasirhalang.sch.id
#   PROD_USER: deploy
#   DATABASE_URL: postgresql://... (production)
#   REDIS_URL: redis://... (production)
#   JWT_SECRET: production-secret-key
#   API_URL: https://sdnpasirhalang.sch.id
#   SLACK_BOT_TOKEN: xoxb-...
```

#### 6.3 Secrets di Local Development

```bash
# .env.example — Template untuk developer
# Copy ke .env dan isi value yang sesuai

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app_dev

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=development

# API
API_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:5173

# Email (mock untuk development)
EMAIL_MOCK=true
SMTP_HOST=localhost
SMTP_PORT=1025

# Logging
LOG_LEVEL=debug
LOG_FORMAT=pretty
```

### Step 7: Rollback Strategies

#### 7.1 Automatic Rollback on Failure

```yaml
deploy-production:
  name: 🎯 Deploy Production
  runs-on: ubuntu-latest
  environment: production
  steps:
    - uses: actions/checkout@v4

    - name: Deploy to production
      id: deploy
      run: |
        ./scripts/deploy.sh production ${{ github.ref_name }}

    - name: Post-deployment health check
      id: healthcheck
      run: |
        # Wait for deployment to stabilize
        sleep 30

        # Run health checks
        MAX_RETRIES=5
        RETRY_COUNT=0

        while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
          if curl -sf https://sdnpasirhalang.sch.id/health; then
            echo "✅ Health check passed"
            exit 0
          fi
          RETRY_COUNT=$((RETRY_COUNT + 1))
          echo "⏳ Health check failed, retry $RETRY_COUNT/$MAX_RETRIES..."
          sleep 10
        done

        echo "❌ Health check failed after $MAX_RETRIES retries"
        exit 1

    - name: Automatic rollback on failure
      if: failure() && steps.deploy.outcome == 'success'
      run: |
        echo "🔄 Health check failed, initiating automatic rollback..."
        ./scripts/rollback.sh production
        echo "✅ Rollback complete"

    - name: Notify rollback
      if: failure() && steps.deploy.outcome == 'success'
      uses: slackapi/slack-github-action@v1.25.0
      with:
        channel-id: 'deployments'
        slack-message: |
          🚨 AUTOMATIC ROLLBACK TRIGGERED!
          Version: ${{ github.ref_name }}
          Reason: Health check failed
          Status: Rolled back to previous version
        env:
          SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

#### 7.2 Rollback Script

```bash
#!/bin/bash
# scripts/rollback.sh
# Usage: ./scripts/rollback.sh <environment>

set -e

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
  echo "Usage: $0 <environment>"
  exit 1
fi

echo "🔄 Rolling back $ENVIRONMENT to previous version..."

if [ "$ENVIRONMENT" == "staging" ]; then
  HOST="${STAGING_HOST}"
  USER="${STAGING_USER}"
  DEPLOY_DIR="/opt/app-staging"
elif [ "$ENVIRONMENT" == "production" ]; then
  HOST="${PROD_HOST}"
  USER="${PROD_USER}"
  DEPLOY_DIR="/opt/app"
fi

# SSH rollback
ssh -o StrictHostKeyChecking=no ${USER}@${HOST} << EOF
  set -e

  echo "📋 Getting previous image tag..."
  cd ${DEPLOY_DIR}

  # Get previous image from Docker history
  PREVIOUS_TAG=\$(docker images --format "{{.Tag}}" | grep -v latest | head -n 1)

  if [ -z "\$PREVIOUS_TAG" ]; then
    echo "❌ No previous image found"
    exit 1
  fi

  echo "🔄 Rolling back to: \$PREVIOUS_TAG"

  # Pull previous image
  docker compose pull

  # Start previous version
  docker compose up -d --remove-orphans

  echo "✅ Rollback to \$PREVIOUS_TAG complete"
  docker compose ps
EOF

echo "✅ Rollback to $ENVIRONMENT successful!"
```

#### 7.3 Database Rollback

```yaml
# Migration dengan rollback support
deploy-production:
  steps:
    - name: Run database migrations
      id: migrate
      run: |
        echo "📊 Running database migrations..."
        npm run db:migrate

        # Verify migration
        npm run db:verify

    - name: Rollback migration on failure
      if: failure() && steps.migrate.outcome == 'failure'
      run: |
        echo "🔄 Rolling back database migration..."
        npm run db:rollback

        # Verify rollback
        npm run db:verify
```

### Step 8: Monitoring Integration

#### 8.1 Health Checks

```yaml
# Health check endpoint di aplikasi
# GET /api/health
# Response:
# {
#   "status": "ok",
#   "timestamp": "2026-04-20T10:30:00Z",
#   "version": "1.2.0",
#   "checks": {
#     "database": { "status": "up", "latency": "12ms" },
#     "redis": { "status": "up", "latency": "2ms" },
#     "storage": { "status": "up", "disk_usage": "45%" }
#   }
# }

# CI health check
monitoring:
  steps:
    - name: Health check
      run: |
        RESPONSE=$(curl -sf https://sdnpasirhalang.sch.id/api/health)
        echo "$RESPONSE" | jq '.'

        # Check all services are up
        DB_STATUS=$(echo "$RESPONSE" | jq -r '.checks.database.status')
        REDIS_STATUS=$(echo "$RESPONSE" | jq -r '.checks.redis.status')

        if [ "$DB_STATUS" != "up" ] || [ "$REDIS_STATUS" != "up" ]; then
          echo "❌ Service health check failed"
          exit 1
        fi
```

#### 8.2 Post-Deployment Verification

```yaml
post-deploy-verify:
  name: ✅ Post-Deployment Verification
  runs-on: ubuntu-latest
  needs: deploy-production
  steps:
    - name: Run smoke tests
      run: |
        BASE_URL="https://sdnpasirhalang.sch.id"

        # Test critical endpoints
        echo "Testing health endpoint..."
        curl -f "$BASE_URL/api/health"

        echo "Testing API version..."
        curl -f "$BASE_URL/api/version"

        echo "Testing database connection..."
        curl -f "$BASE_URL/api/db/check"

        # Test authentication
        echo "Testing login endpoint..."
        TOKEN=$(curl -sf -X POST "$BASE_URL/api/auth/login" \
          -H "Content-Type: application/json" \
          -d '{"username":"test","password":"test"}' | jq -r '.data.token')

        if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
          echo "❌ Login failed"
          exit 1
        fi

        echo "Testing authenticated endpoint..."
        curl -f "$BASE_URL/api/users/me" \
          -H "Authorization: Bearer $TOKEN"

    - name: Run synthetic monitoring
      run: |
        # Simulate user journey
        node tests/synthetic/user-journey.js
      env:
        BASE_URL: https://sdnpasirhalang.sch.id
```

#### 8.3 Alerting Integration

```yaml
notify:
  name: 📢 Notifications
  runs-on: ubuntu-latest
  if: always()
  needs: [deploy-production, post-deploy-verify]
  steps:
    - name: Notify Slack on success
      if: success()
      uses: slackapi/slack-github-action@v1.25.0
      with:
        channel-id: 'deployments'
        slack-message: |
          ✅ Deploy Success
          Version: ${{ github.ref_name }}
          Commit: ${{ github.sha }}
          Duration: ${{ job.duration }}s
          Deployed by: ${{ github.actor }}
      env:
        SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}

    - name: Notify Slack on failure
      if: failure()
      uses: slackapi/slack-github-action@v1.25.0
      with:
        channel-id: 'deployments'
        slack-message: |
          🚨 Deploy Failed!
          Version: ${{ github.ref_name }}
          Commit: ${{ github.sha }}
          Failed job: ${{ github.job }}
          Deployed by: ${{ github.actor }}
          Check logs: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
      env:
        SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

### Step 9: Security Scanning di CI/CD

#### 9.1 SAST (Static Application Security Testing)

```yaml
sast-scan:
  name: 🔍 SAST Scan
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4

    # Semgrep — Multi-language SAST
    - name: Semgrep scan
      uses: returntocorp/semgrep-action@v1
      with:
        config: >-
          p/javascript
          p/owasp-top-ten
          p/security-audit
          p/cwe-top-25
          p/r2c-security-audit

    # CodeQL — GitHub native SAST
    - name: Initialize CodeQL
      uses: github/codeql-action/init@v3
      with:
        languages: javascript

    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v3
```

#### 9.2 Dependency Scanning

```yaml
dependency-scan:
  name: 📦 Dependency Scan
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    # npm audit
    - name: npm audit
      run: npm audit --json > npm-audit.json
      continue-on-error: true

    - name: Check vulnerability severity
      run: |
        CRITICAL=$(jq '.metadata.vulnerabilities.critical' npm-audit.json)
        HIGH=$(jq '.metadata.vulnerabilities.high' npm-audit.json)

        if [ "$CRITICAL" -gt 0 ]; then
          echo "❌ Found $CRITICAL critical vulnerabilities"
          jq '.vulnerabilities[] | select(.severity == "critical") | {name, severity, via: [.via[].name]}' npm-audit.json
          exit 1
        fi

        if [ "$HIGH" -gt 5 ]; then
          echo "⚠️ Found $HIGH high vulnerabilities (threshold: 5)"
          exit 1
        fi

        echo "✅ Dependency scan passed"

    # Snyk — Advanced dependency scanning
    - name: Snyk scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high --json-file-output=snyk-results.json
```

#### 9.3 Container Scanning

```yaml
container-scan:
  name: 🐳 Container Scan
  runs-on: ubuntu-latest
  needs: docker-build
  steps:
    - uses: actions/checkout@v4

    # Trivy — Comprehensive container scanner
    - name: Trivy scan
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'ghcr.io/${{ github.repository }}:${{ github.sha }}'
        format: 'table'
        exit-code: '1'
        ignore-unfixed: true
        severity: 'CRITICAL,HIGH'
        vuln-type: 'os,library'

    # Docker Scout — Docker native scanning
    - name: Docker Scout
      uses: docker/scout-action@v1
      with:
        command: cves
        only-severities: critical,high
        exit-code: true
```

### Step 10: Release Automation

#### 10.1 Version Bumping dan Changelog

```yaml
release:
  name: 🏷️ Release Automation
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0
        token: ${{ secrets.GITHUB_TOKEN }}

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: Install semantic-release
      run: npm install -g semantic-release @semantic-release/changelog @semantic-release/git @semantic-release/exec

    - name: Run semantic-release
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
      run: |
        npx semantic-release

    # semantic-release akan otomatis:
    # 1. Analisis commit messages (Conventional Commits)
    # 2. Tentukan version bump (major/minor/patch)
    # 3. Update CHANGELOG.md
    # 4. Bump version di package.json
    # 5. Create Git tag
    # 6. Create GitHub Release
    # 7. Publish ke npm (jika applicable)
```

#### 10.2 Release Notes Generation

```yaml
release-notes:
  name: 📝 Release Notes
  runs-on: ubuntu-latest
  if: startsWith(github.ref, 'refs/tags/v')
  steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0

    - name: Generate release notes
      run: |
        PREVIOUS_TAG=$(git describe --tags --abbrev=0 HEAD^ 2>/dev/null || echo "")

        if [ -z "$PREVIOUS_TAG" ]; then
          COMMITS=$(git log --oneline ${{ github.ref_name }})
        else
          COMMITS=$(git log --oneline $PREVIOUS_TAG..${{ github.ref_name }})
        fi

        # Group commits by type
        FEATS=$(echo "$COMMITS" | grep "^feat" || true)
        FIXES=$(echo "$COMMITS" | grep "^fix" || true)
        REFACTOR=$(echo "$COMMITS" | grep "^refactor" || true)
        DOCS=$(echo "$COMMITS" | grep "^docs" || true)

        # Generate markdown
        cat > RELEASE_NOTES.md << EOF
        ## 🎉 Release ${{ github.ref_name }}

        ### ✨ New Features
        $(echo "$FEATS" | sed 's/^/- /' || echo "- None")

        ### 🐛 Bug Fixes
        $(echo "$FIXES" | sed 's/^/- /' || echo "- None")

        ### 🔧 Refactoring
        $(echo "$REFACTOR" | sed 's/^/- /' || echo "- None")

        ### 📚 Documentation
        $(echo "$DOCS" | sed 's/^/- /' || echo "- None")

        ### 📊 Statistics
        - Total commits: $(echo "$COMMITS" | wc -l | tr -d ' ')
        - Contributors: $(git log $PREVIOUS_TAG..${{ github.ref_name }} --format='%an' | sort -u | wc -l | tr -d ' ')
        EOF

    - name: Update GitHub Release
      uses: softprops/action-gh-release@v1
      with:
        body_path: RELEASE_NOTES.md
        tag_name: ${{ github.ref_name }}
```

---

## 🏫 Real-World: CI/CD untuk Aplikasi Administrasi Sekolah

### Scenario: SD Negeri Pasirhalang

Aplikasi administrasi sekolah memiliki kebutuhan khusus:
- Data sensitif (siswa, GTK, keuangan BOS)
- Compliance dengan regulasi Kemendikbud
- Backup data berkala
- Audit trail untuk perubahan data

### Pipeline Khusus Sekolah

```yaml
# .github/workflows/sekolah-ci.yml
name: Sekolah Admin CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    # Backup database setiap hari jam 2 pagi
    - cron: '0 2 * * *'

env:
  SCHOOL_NPSN: '20228835'
  SCHOOL_NAME: 'SD Negeri Pasirhalang'

jobs:
  # ─────────────────────────────────────────
  # DATA VALIDATION — Khusus untuk data sekolah
  # ─────────────────────────────────────────
  validate-data:
    name: 📋 Data Validation
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4

      - name: Validate Dapodik schema
        run: |
          # Validasi format NISN (10 digit)
          node scripts/validate-nisn.js

          # Validasi format NUPTK (16 digit)
          node scripts/validate-nuptk.js

          # Validasi data keuangan BOS
          node scripts/validate-bos-data.js

      - name: Check data integrity
        run: |
          # Cek NISN duplikat
          node scripts/check-duplicate-nisn.js

          # Cek data GTK lengkap
          node scripts/check-gtk-completeness.js

          # Cek realisasi BOS tidak melebihi anggaran
          node scripts/check-bos-budget.js

  # ─────────────────────────────────────────
  # SECURITY — Khusus untuk data sensitif
  # ─────────────────────────────────────────
  security-school:
    name: 🔒 School Security Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check for exposed student data
        run: |
          # Pastikan tidak ada data siswa di log
          if grep -r "NISN:" src/ --include="*.ts" | grep -v "// "; then
            echo "❌ Found hardcoded NISN in source code"
            exit 1
          fi

          # Pastikan tidak ada password hardcoded
          if grep -r "password" src/ --include="*.ts" | grep -v "hash" | grep -v "Password"; then
            echo "❌ Found potential hardcoded password"
            exit 1
          fi

      - name: Audit trail check
        run: |
          # Pastikan semua perubahan data punya audit trail
          node scripts/check-audit-trail.js

  # ─────────────────────────────────────────
  # BACKUP — Database backup otomatis
  # ─────────────────────────────────────────
  backup-database:
    name: 💾 Database Backup
    runs-on: ubuntu-latest
    if: github.event_name == 'schedule'
    environment: production
    steps:
      - name: Backup production database
        run: |
          # SSH ke production dan backup
          ssh ${PROD_USER}@${PROD_HOST} << 'EOF'
            BACKUP_DIR="/opt/backups"
            DATE=$(date +%Y%m%d_%H%M%S)
            BACKUP_FILE="$BACKUP_DIR/school_db_$DATE.sql.gz"

            mkdir -p $BACKUP_DIR
            pg_dump school_prod_db | gzip > $BACKUP_FILE

            # Keep only last 30 days of backups
            find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

            echo "✅ Backup created: $BACKUP_FILE"
          EOF

      - name: Verify backup
        run: |
          # Download dan verify backup
          ssh ${PROD_USER}@${PROD_HOST} "ls -t /opt/backups/*.sql.gz | head -1" | xargs -I {} ssh ${PROD_USER}@${PROD_HOST} "gunzip -t {}"
          echo "✅ Backup verified"

      - name: Notify backup status
        uses: slackapi/slack-github-action@v1.25.0
        with:
          channel-id: 'school-ops'
          slack-message: |
            💾 Daily Database Backup Complete
            School: ${{ env.SCHOOL_NAME }} (NPSN: ${{ env.SCHOOL_NPSN }})
            Status: ✅ Success
        env:
          SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}

  # ─────────────────────────────────────────
  # DEPLOY — Deployment dengan data migration
  # ─────────────────────────────────────────
  deploy-school:
    name: 🚀 Deploy School App
    runs-on: ubuntu-latest
    needs: [validate-data, security-school]
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v4

      - name: Pre-deploy backup
        run: |
          # Backup sebelum deploy
          ssh ${PROD_USER}@${PROD_HOST} << 'EOF'
            DATE=$(date +%Y%m%d_%H%M%S)
            pg_dump school_prod_db | gzip > /opt/backups/pre_deploy_$DATE.sql.gz
          EOF

      - name: Deploy application
        run: ./scripts/deploy.sh production ${{ github.sha }}

      - name: Run data migrations
        run: |
          # Jalankan migration data jika ada
          ssh ${PROD_USER}@${PROD_HOST} "cd /opt/app && npm run db:migrate"

      - name: Post-deploy data validation
        run: |
          # Validasi data setelah deploy
          curl -f https://sdnpasirhalang.sch.id/api/health
          curl -f https://sdnpasirhalang.sch.id/api/db/check
          curl -f https://sdnpasirhalang.sch.id/api/data/validate

      - name: Notify deployment
        uses: slackapi/slack-github-action@v1.25.0
        with:
          channel-id: 'school-ops'
          slack-message: |
            🚀 School App Deployed
            School: ${{ env.SCHOOL_NAME }}
            Version: ${{ github.sha }}
            Status: ✅ Success
        env:
          SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

---

## 📋 Magic Prompt Templates

### Template 1: CI/CD Pipeline Generator

```
## Role
DevOps engineer senior dengan pengalaman 10+ tahun setup CI/CD.

## Task
Generate CI/CD pipeline lengkap untuk proyek ini.

## Input
- Path proyek: [path]
- Tech stack: [stack]
- Deployment target: [Vercel/AWS/Docker/K8s]
- Environment: [dev/staging/prod]

## Output yang Dihasilkan
1. .github/workflows/ci.yml — Full pipeline
2. .github/workflows/deploy.yml — Deployment workflow
3. scripts/deploy.sh — Deployment script
4. scripts/rollback.sh — Rollback script
5. .env.example — Environment template
6. docs/DEPLOYMENT.md — Deployment documentation

## Constraints
- ✅ Semua stage: lint → test → build → security → deploy
- ✅ Coverage threshold minimal 80%
- ✅ Security scan: SAST + dependency + container
- ✅ Automatic rollback on health check failure
- ✅ Environment-specific configuration
- ✅ Notification on success/failure
```

### Template 2: Security Audit Pipeline

```
## Role
Security engineer spesialis CI/CD security.

## Task
Setup security scanning pipeline lengkap.

## Output
1. SAST scan (Semgrep + CodeQL)
2. Dependency scan (npm audit + Snyk)
3. Container scan (Trivy)
4. DAST scan (OWASP ZAP)
5. Secret scan (TruffleHog)

## Constraints
- ✅ Block deployment jika ada CRITICAL vulnerability
- ✅ Warning jika ada HIGH vulnerability > threshold
- ✅ Generate security report dalam SARIF format
- ✅ Integrate dengan GitHub Security tab
```

---

## ✅ Checklist

### Pipeline Design
- [ ] Pipeline stage lengkap: lint → test → build → security → deploy
- [ ] Parallel job untuk independent stage
- [ ] Proper dependency antar job (needs)
- [ ] Conditional execution (if) untuk environment

### GitHub Actions
- [ ] Workflow untuk CI (setiap push/PR)
- [ ] Workflow untuk CD (setiap merge/tag)
- [ ] Workflow untuk scheduled tasks (backup)
- [ ] Environment protection rules

### Testing di CI
- [ ] Unit test dengan coverage threshold
- [ ] Integration test dengan test database
- [ ] E2E test dengan browser automation
- [ ] Performance test dengan k6/Locust

### Quality Gates
- [ ] ESLint/Prettier check
- [ ] TypeScript type check
- [ ] Coverage threshold enforcement
- [ ] Commit message format check

### Deployment
- [ ] Staging auto-deploy
- [ ] Production manual approval
- [ ] Health check post-deploy
- [ ] Smoke test critical endpoints

### Environment Management
- [ ] GitHub secrets configured
- [ ] Environment-specific variables
- [ ] .env.example untuk developer
- [ ] Secrets rotation schedule

### Rollback
- [ ] Automatic rollback on failure
- [ ] Manual rollback script
- [ ] Database migration rollback
- [ ] Pre-deploy backup

### Monitoring
- [ ] Health check endpoint
- [ ] Post-deployment verification
- [ ] Slack/Email notification
- [ ] Synthetic monitoring

### Security
- [ ] SAST scan (Semgrep/CodeQL)
- [ ] Dependency scan (npm audit/Snyk)
- [ ] Container scan (Trivy)
- [ ] Secret scan (TruffleHog)
- [ ] DAST scan (OWASP ZAP)

### Release
- [ ] Semantic versioning
- [ ] Auto changelog generation
- [ ] Git tag creation
- [ ] GitHub Release notes

---

## ⚠️ Pitfalls

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Workflow fail di test | Database tidak ready | Pakai services dengan health check |
| Deploy gagal timeout | App tidak start dalam waktu | Tambah sleep atau health check retry |
| Secrets tidak terbaca | Environment tidak configured | Setup GitHub Environments dengan secrets |
| Rollback tidak jalan | Script tidak executable | `chmod +x scripts/rollback.sh` |
| Coverage threshold fail | Test tidak cover edge case | Tambah test untuk boundary condition |
| Security scan false positive | Rule terlalu strict | Configure ignore file atau custom rules |
| Pipeline terlalu lama | Job tidak parallel | Group independent job, pakai matrix |
| Deploy ke production tanpa approval | Environment protection tidak set | Setup required reviewers di GitHub |
| Backup gagal | Disk penuh | Setup cleanup old backups |
| Notification tidak terkirim | Token expired | Rotate Slack/Discord token |

---

## 📝 Ringkasan

1. **Pipeline modern** — lint → typecheck → test → build → security → deploy
2. **GitHub Actions** — workflow YAML dengan job parallel dan conditional execution
3. **Testing strategy** — unit (70%), integration (20%), E2E (10%) dengan coverage threshold
4. **Quality gates** — ESLint, Prettier, TypeScript, coverage enforcement
5. **Auto deployment** — staging otomatis, production dengan manual approval
6. **Environment management** — GitHub secrets, environment-specific config
7. **Rollback strategy** — automatic on health check failure, manual script, database rollback
8. **Monitoring** — health checks, post-deploy verification, Slack notifications
9. **Security scanning** — SAST, DAST, dependency, container, secret scanning
10. **Release automation** — semantic versioning, changelog, tags, release notes
11. **School-specific** — data validation, audit trail, daily backup, compliance checks

---

> **Lanjut ke:** [`07-custom-dev-agents.md`](./07-custom-dev-agents.md)