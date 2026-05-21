# 07 — Hooks & Otomasi

> **Estimasi:** 1.5 jam | **Level:** Menengah
> **Sumber:**
> - [`feiskyer/claude-code-settings — Scripts`](https://github.com/feiskyer/claude-code-settings#scripts)
> - [`Anthropic Docs — Hooks`](https://docs.anthropic.com/en/docs/claude-code/hooks)
> - [`awattar/claude-code-best-practices — Hooks & Automation`](https://github.com/awattar/claude-code-best-practices#-hooks--automation)

---

## 📖 TEORI

### Apa itu Hooks?

**Hooks** adalah shell commands (bash, PowerShell, Python, dll) yang dijalankan secara otomatis saat event tertentu terjadi di Claude Code. Hooks memungkinkan Anda mengotomatisasi workflow tanpa perlu menjalankan command secara manual setiap kali.

Analogi sederhana: Hooks seperti "trigger" di database atau "event listener" di JavaScript — sesuatu terjadi → sesuatu dijalankan otomatis.

### Mengapa Hooks Penting?

1. **Konsistensi** — Otomatis enforce coding standards, formatting, dan conventions
2. **Keamanan** — Auto-check security issues sebelum commit atau deploy
3. **Efisiensi** — Kurangi manual work yang repetitif
4. **Kualitas** — Auto-test dan auto-lint memastikan kode selalu dalam kondisi baik
5. **Visibility** — Auto-notify saat task selesai atau ada masalah

### Arsitektur Hooks

```
Event di Claude Code
        │
        ├── pre-prompt ──→ Hook dijalankan SEBELUM AI memproses request
        ├── post-tool-use ─→ Hook dijalankan SETELAH tool digunakan
        ├── on-apply-diff ─→ Hook dijalankan SETELAH diff diterapkan
        ├── notification ──→ Hook untuk notifikasi
        ├── pre-commit ───→ Hook SEBELUM commit dibuat
        └── post-commit ──→ Hook SETELAH commit dibuat
                │
                ↓
        Shell Command / Script
                │
                ├── ✅ Success → lanjutkan workflow
                └── ❌ Failed → stop workflow + error message
```

---

## 🔧 JENIS-JENIS HOOKS

### A. Pre-Prompt Hook

**Kapan Dijalankan:** SEBELUM Claude Code memproses setiap request dari user.

**Use Cases:**
- Logging dan auditing
- Validasi context
- Load project-specific settings
- Check prerequisites

**Contoh: `.claude/hooks/pre-prompt.sh`**
```bash
#!/bin/bash
# pre-prompt hook — dijalankan sebelum setiap request AI

# Log setiap request
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Request: $CLAUDE_CODE_PROMPT" \
  >> ~/.claude/logs/requests.log

# Check jika project punya CLAUDE.md
if [ ! -f "CLAUDE.md" ] && [ ! -f ".claude/CLAUDE.md" ]; then
  echo "⚠️  Warning: Tidak ada CLAUDE.md di project ini."
  echo "   Consider membuat CLAUDE.md untuk context AI."
fi

# Check jika git branch adalah main/master (hati-hati!)
BRANCH=$(git branch --show-current 2>/dev/null)
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
  echo "⚠️  Warning: Anda di branch '$BRANCH'. Pertimbangkan buat branch baru."
fi

# Check disk space
DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
  echo "🚨 CRITICAL: Disk usage ${DISK_USAGE}%! Bersihkan space sekarang."
  exit 1
fi
```

**Contoh: Pre-prompt untuk Validasi Dapodik**
```bash
#!/bin/bash
# pre-prompt hook khusus untuk project Dapodik

# Check jika Dapodik service running
if curl -s http://localhost:5774 > /dev/null 2>&1; then
  echo "✅ Dapodik service running di localhost:5774"
else
  echo "⚠️  Dapodik service TIDAK running di localhost:5774"
  echo "   Jalankan Dapodik sebelum operasi data."
fi

# Check config file
if [ -f "dapodik_config.json" ]; then
  echo "✅ Config file ditemukan"
else
  echo "❌ Config file 'dapodik_config.json' tidak ditemukan"
  exit 1
fi
```

### B. Post-Tool-Use Hook

**Kapan Dijalankan:** SETELAH Claude Code menggunakan salah satu tools (Read, Edit, Write, Bash, dll).

**Use Cases:**
- Auto-format setelah edit file
- Auto-lint setelah write
- Backup sebelum perubahan besar
- Update index/cache

**Contoh: `.claude/hooks/post-tool-use.sh`**
```bash
#!/bin/bash
# post-tool-use hook — dijalankan setelah setiap tool digunakan

# Auto-format file yang baru diedit
if [ -n "$CLAUDE_CODE_EDITED_FILE" ]; then
  FILE="$CLAUDE_CODE_EDITED_FILE"
  EXT="${FILE##*.}"

  case "$EXT" in
    js|jsx|ts|tsx)
      echo "🎨 Formatting $FILE dengan Prettier..."
      npx prettier --write "$FILE" 2>/dev/null
      ;;
    py)
      echo "🎨 Formatting $FILE dengan Black..."
      black "$FILE" 2>/dev/null
      ;;
    go)
      echo "🎨 Formatting $FILE dengan gofmt..."
      gofmt -w "$FILE" 2>/dev/null
      ;;
    json)
      echo "🎨 Formatting $FILE..."
      npx prettier --write "$FILE" 2>/dev/null
      ;;
  esac
fi

# Auto-lint setelah write
if [ "$CLAUDE_CODE_TOOL" = "Write" ] || [ "$CLAUDE_CODE_TOOL" = "Edit" ]; then
  echo "🔍 Running linter..."

  # Check jika ada package.json
  if [ -f "package.json" ]; then
    # Check script lint
    if grep -q '"lint"' package.json 2>/dev/null; then
      npm run lint --silent 2>/dev/null || true
    fi
  fi

  # Check jika ada pyproject.toml atau setup.py
  if [ -f "pyproject.toml" ] || [ -f "setup.py" ]; then
    ruff check . --silent 2>/dev/null || true
  fi
fi
```

### C. On-Apply-Diff Hook

**Kapan Dijalankan:** SETELAH Claude Code menerapkan perubahan (diff) ke file.

**Use Cases:**
- Validasi diff sebelum save
- Auto-commit setelah perubahan
- Generate changelog
- Update documentation

**Contoh: `.claude/hooks/on-apply-diff.sh`**
```bash
#!/bin/bash
# on-apply-diff hook — dijalankan setelah diff diterapkan

# Log perubahan
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Diff applied:" >> ~/.claude/logs/changes.log
echo "  Files: $CLAUDE_CODE_CHANGED_FILES" >> ~/.claude/logs/changes.log
echo "  Lines: +$CLAUDE_CODE_ADDED_LINES -$CLAUDE_CODE_REMOVED_LINES" >> ~/.claude/logs/changes.log
echo "---" >> ~/.claude/logs/changes.log

# Auto-commit jika perubahan kecil (kurang dari 5 file)
FILE_COUNT=$(echo "$CLAUDE_CODE_CHANGED_FILES" | tr ',' '\n' | wc -l)
if [ "$FILE_COUNT" -le 5 ] && [ "$CLAUDE_CODE_AUTO_COMMIT" = "true" ]; then
  echo "📝 Auto-commit untuk $FILE_COUNT file..."
  git add $CLAUDE_CODE_CHANGED_FILES
  git commit -m "chore: auto-commit changes by Claude Code"
fi

# Update CHANGELOG.md jika ada
if [ -f "CHANGELOG.md" ]; then
  echo "📝 Updating CHANGELOG.md..."
  # Tambah entry ke changelog (simplified)
  DATE=$(date '+%Y-%m-%d')
  echo "- [$DATE] Changes in: $CLAUDE_CODE_CHANGED_FILES" >> CHANGELOG.md
fi
```

### D. Notification Hook

**Kapan Dijalankan:** Saat event tertentu yang butuh notifikasi ke user.

**Use Cases:**
- Notifikasi saat task selesai
- Alert saat error terjadi
- Progress update untuk task panjang
- Integration dengan Slack/Telegram/Discord

**Contoh: `.claude/hooks/notification.sh`**
```bash
#!/bin/bash
# notification hook — kirim notifikasi saat event tertentu

NOTIFICATION_TYPE="$CLAUDE_CODE_NOTIFICATION_TYPE"
MESSAGE="$CLAUDE_CODE_NOTIFICATION_MESSAGE"

case "$NOTIFICATION_TYPE" in
  "task-complete")
    # Kirim notifikasi Windows toast
    powershell -Command "
      [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
      [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null

      \$template = @'
      <toast>
        <visual>
          <binding template=\"ToastText02\">
            <text id=\"1\">Claude Code — Task Selesai</text>
            <text id=\"2\">$MESSAGE</text>
          </binding>
        </visual>
      </toast>
'@

      \$xml = New-Object Windows.Data.Xml.Dom.XmlDocument
      \$xml.LoadXml(\$template)
      \$toast = [Windows.UI.Notifications.ToastNotification]::new(\$xml)
      [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('Claude Code').Show(\$toast)
    "
    ;;

  "error")
    # Kirim notifikasi error
    echo "🚨 ERROR: $MESSAGE"
    # Bisa juga kirim ke Telegram, Slack, dll
    ;;

  "progress")
    # Log progress
    echo "📊 Progress: $MESSAGE"
    ;;
esac
```

**Contoh: Notifikasi ke Telegram**
```bash
#!/bin/bash
# notification hook — kirim ke Telegram bot

TELEGRAM_BOT_TOKEN="YOUR_BOT_TOKEN"
TELEGRAM_CHAT_ID="YOUR_CHAT_ID"

send_telegram() {
  local message="$1"
  curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d "chat_id=${TELEGRAM_CHAT_ID}" \
    -d "text=${message}" \
    -d "parse_mode=Markdown"
}

case "$CLAUDE_CODE_NOTIFICATION_TYPE" in
  "task-complete")
    send_telegram "✅ *Task Selesai*
${CLAUDE_CODE_NOTIFICATION_MESSAGE}
⏱️ Waktu: $(date '+%H:%M:%S')"
    ;;
  "error")
    send_telegram "🚨 *Error Terjadi*
${CLAUDE_CODE_NOTIFICATION_MESSAGE}"
    ;;
esac
```

---

## 🛠️ MEMBUAT CUSTOM HOOKS

### Struktur Direktori Hooks

```
.claude/
├── hooks/
│   ├── pre-prompt.sh          # Sebelum AI process request
│   ├── post-tool-use.sh       # Setelah tool digunakan
│   ├── on-apply-diff.sh       # Setelah diff diterapkan
│   ├── notification.sh        # Untuk notifikasi
│   ├── pre-commit.sh          # Sebelum commit
│   ├── post-commit.sh         # Setelah commit
│   └── custom/
│       ├── backup.sh          # Custom: backup sebelum perubahan
│       ├── validate-dapodik.sh # Custom: validasi data Dapodik
│       └── export-report.sh   # Custom: export laporan
├── CLAUDE.md                  # Context untuk AI
└── settings.json              # Settings Claude Code
```

### Cara Membuat Hook Baru

**Step 1: Buat file hook**
```bash
mkdir -p .claude/hooks
touch .claude/hooks/pre-commit.sh
chmod +x .claude/hooks/pre-commit.sh
```

**Step 2: Tulis script hook**
```bash
#!/bin/bash
# .claude/hooks/pre-commit.sh

echo "🔍 Running pre-commit checks..."

# 1. Lint check
if command -v eslint &> /dev/null; then
  echo "  Running ESLint..."
  eslint . --fix 2>/dev/null
  if [ $? -ne 0 ]; then
    echo "❌ ESLint failed. Commit dibatalkan."
    exit 1
  fi
fi

# 2. Test check
if [ -f "package.json" ] && grep -q '"test"' package.json; then
  echo "  Running tests..."
  npm test -- --passWithNoTests 2>/dev/null
  if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Commit dibatalkan."
    exit 1
  fi
fi

# 3. Type check (TypeScript)
if [ -f "tsconfig.json" ]; then
  echo "  Running TypeScript check..."
  npx tsc --noEmit 2>/dev/null
  if [ $? -ne 0 ]; then
    echo "❌ TypeScript check failed. Commit dibatalkan."
    exit 1
  fi
fi

echo "✅ All pre-commit checks passed!"
exit 0
```

**Step 3: Daftarkan hook di settings**
```json
// .claude/settings.json
{
  "hooks": {
    "pre-prompt": ".claude/hooks/pre-prompt.sh",
    "post-tool-use": ".claude/hooks/post-tool-use.sh",
    "on-apply-diff": ".claude/hooks/on-apply-diff.sh",
    "notification": ".claude/hooks/notification.sh",
    "pre-commit": ".claude/hooks/pre-commit.sh"
  }
}
```

---

## 📋 HOOK USE CASES UNTUK DEVELOPMENT WORKFLOW

### Use Case 1: Auto-Format Setelah Edit

```bash
#!/bin/bash
# .claude/hooks/auto-format.sh

# Trigger: post-tool-use, hanya untuk file yang diedit
FILE="$CLAUDE_CODE_EDITED_FILE"
[ -z "$FILE" ] && exit 0

EXT="${FILE##*.}"

format_file() {
  local file="$1"
  local ext="$2"

  case "$ext" in
    js|jsx|ts|tsx)
      if command -v prettier &> /dev/null; then
        prettier --write "$file" --log-level silent
      fi
      ;;
    py)
      if command -v black &> /dev/null; then
        black "$file" -q
      elif command -v ruff &> /dev/null; then
        ruff format "$file" -q
      fi
      ;;
    go)
      gofmt -w "$file" 2>/dev/null
      ;;
    rs)
      if command -v rustfmt &> /dev/null; then
        rustfmt "$file" 2>/dev/null
      fi
      ;;
    css|scss|html|md|json|yaml|yml)
      if command -v prettier &> /dev/null; then
        prettier --write "$file" --log-level silent
      fi
      ;;
  esac
}

format_file "$FILE" "$EXT"
```

### Use Case 2: Auto-Test Setelah Perubahan

```bash
#!/bin/bash
# .claude/hooks/auto-test.sh

# Trigger: post-tool-use atau on-apply-diff
# Hanya test file yang terkait dengan perubahan

FILE="$CLAUDE_CODE_EDITED_FILE"
[ -z "$FILE" ] && exit 0

# Cari test file yang terkait
find_related_test() {
  local source_file="$1"
  local base_name="${source_file%.*}"
  local ext="${source_file##*.}"

  # Pattern test files
  local test_patterns=(
    "${base_name}.test.${ext}"
    "${base_name}_test.${ext}"
    "${base_name}.spec.${ext}"
    "tests/$(basename "$base_name").test.${ext}"
    "test/$(basename "$base_name").test.${ext}"
  )

  for pattern in "${test_patterns[@]}"; do
    if [ -f "$pattern" ]; then
      echo "$pattern"
      return 0
    fi
  done
  return 1
}

TEST_FILE=$(find_related_test "$FILE")

if [ -n "$TEST_FILE" ]; then
  echo "🧪 Running test untuk $TEST_FILE..."

  if [ -f "package.json" ]; then
    # Jest / Vitest
    npx jest "$TEST_FILE" --silent 2>/dev/null || \
    npx vitest run "$TEST_FILE" --silent 2>/dev/null
  elif [ -f "pyproject.toml" ] || [ -f "setup.py" ]; then
    # pytest
    pytest "$TEST_FILE" -q 2>/dev/null
  fi
fi
```

### Use Case 3: Auto-Commit dengan Conventional Commits

```bash
#!/bin/bash
# .claude/hooks/auto-commit.sh

# Trigger: on-apply-diff, auto-commit jika CLAUDE_CODE_AUTO_COMMIT=true
[ "$CLAUDE_CODE_AUTO_COMMIT" != "true" ] && exit 0

# Generate conventional commit message dari diff
generate_commit_message() {
  local diff_summary="$CLAUDE_CODE_DIFF_SUMMARY"

  # Tentukan type berdasarkan perubahan
  if echo "$diff_summary" | grep -qi "fix\|bug\|error\|repair"; then
    TYPE="fix"
  elif echo "$diff_summary" | grep -qi "feat\|add\|new\|implement"; then
    TYPE="feat"
  elif echo "$diff_summary" | grep -qi "doc\|readme\|comment"; then
    TYPE="docs"
  elif echo "$diff_summary" | grep -qi "style\|format\|lint\|prettier"; then
    TYPE="style"
  elif echo "$diff_summary" | grep -qi "refactor\|restructure\|reorganize"; then
    TYPE="refactor"
  elif echo "$diff_summary" | grep -qi "test\|spec"; then
    TYPE="test"
  elif echo "$diff_summary" | grep -qi "chore\|config\|setup\|install"; then
    TYPE="chore"
  else
    TYPE="chore"
  fi

  # Tentukan scope dari file yang diubah
  local changed_files="$CLAUDE_CODE_CHANGED_FILES"
  local first_file=$(echo "$changed_files" | tr ',' '\n' | head -1 | tr -d ' ')
  local scope=$(basename "${first_file%.*}")

  # Generate description
  local description="update ${scope} based on AI changes"

  echo "${TYPE}(${scope}): ${description}"
}

COMMIT_MSG=$(generate_commit_message)

echo "📝 Auto-commit: $COMMIT_MSG"
git add -A
git commit -m "$COMMIT_MSG"
```

### Use Case 4: Auto-Backup Sebelum Perubahan Besar

```bash
#!/bin/bash
# .claude/hooks/backup-before-change.sh

# Trigger: pre-prompt, backup sebelum perubahan besar
# Hanya backup jika perubahan > 10 file

BACKUP_DIR=".claude/backups/$(date '+%Y%m%d_%H%M%S')"

backup_project() {
  mkdir -p "$BACKUP_DIR"

  # Backup file penting
  local important_files=(
    "CLAUDE.md"
    ".claude/CLAUDE.md"
    ".claude/settings.json"
    "package.json"
    "pyproject.toml"
    "tsconfig.json"
  )

  for file in "${important_files[@]}"; do
    if [ -f "$file" ]; then
      cp "$file" "$BACKUP_DIR/"
    fi
  done

  # Backup seluruh project jika perlu
  if [ "$CLAUDE_CODE_CHANGE_SCOPE" = "large" ]; then
    echo "📦 Backup project ke $BACKUP_DIR..."
    tar -czf "$BACKUP_DIR/project-backup.tar.gz" \
      --exclude="node_modules" \
      --exclude=".git" \
      --exclude="dist" \
      --exclude="build" \
      .
  fi

  echo "✅ Backup selesai di $BACKUP_DIR"
}

# Check jika ini perubahan besar
if [ "$CLAUDE_CODE_CHANGE_SCOPE" = "large" ]; then
  backup_project
fi
```

---

## 🔒 HOOK SECURITY

### Prinsip Keamanan Hooks

1. **Review Hooks** — Selalu review script hook sebelum mengaktifkan
2. **Limit Permissions** — Hook hanya punya permission yang dibutuhkan
3. **Validate Input** — Selalu validate environment variables dari Claude Code
4. **Error Handling** — Hook harus handle error dengan graceful
5. **No Secrets** — Jangan hardcode secrets di hook scripts

### Contoh Hook dengan Security Best Practices

```bash
#!/bin/bash
# .claude/hooks/secure-hook.sh

# Exit on error
set -euo pipefail

# Validate environment variables
validate_env() {
  local required_vars=("$@")
  for var in "${required_vars[@]}"; do
    if [ -z "${!var:-}" ]; then
      echo "⚠️  Environment variable $var not set"
      return 1
    fi
  done
  return 0
}

# Sanitize input (remove potential injection)
sanitize_input() {
  local input="$1"
  # Remove dangerous characters
  echo "$input" | sed 's/[;&|`$()]//g'
}

# Main hook logic
main() {
  # Validate required env vars
  validate_env "CLAUDE_CODE_TOOL" || exit 0

  # Sanitize inputs
  local tool=$(sanitize_input "$CLAUDE_CODE_TOOL")
  local file=$(sanitize_input "${CLAUDE_CODE_EDITED_FILE:-}")

  # Log action
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Tool: $tool, File: $file" \
    >> ~/.claude/logs/hooks.log

  # Execute based on tool type
  case "$tool" in
    "Write"|"Edit")
      # Auto-format
      if [ -n "$file" ] && [ -f "$file" ]; then
        format_file "$file"
      fi
      ;;
    "Bash")
      # Log command execution
      echo "  Command executed" >> ~/.claude/logs/commands.log
      ;;
  esac
}

format_file() {
  local file="$1"
  # Safe file formatting
  if [ -f "$file" ]; then
    # Check file size (don't format huge files)
    local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    if [ "${size:-0}" -gt 1000000 ]; then
      echo "⚠️  File too large to format: $file"
      return 0
    fi
    # Format logic here...
  fi
}

main "$@"
```

### Hook Permission Matrix

| Hook Type | Read | Write | Execute | Network |
|-----------|------|-------|---------|---------|
| pre-prompt | ✅ | ❌ | ✅ | ❌ |
| post-tool-use | ✅ | ✅ | ✅ | ❌ |
| on-apply-diff | ✅ | ✅ | ✅ | ❌ |
| notification | ✅ | ✅ | ✅ | ✅ |
| pre-commit | ✅ | ❌ | ✅ | ❌ |

---

## 🏫 REAL-WORLD HOOK EXAMPLES UNTUK ADMINISTRASI SEKOLAH

### Hook 1: Validasi Data Sebelum Export

```bash
#!/bin/bash
# .claude/hooks/validate-before-export.sh

# Trigger: pre-prompt saat user minta export data

validate_arkas_data() {
  echo "🔍 Validasi data ARKAS sebelum export..."

  # Check database file
  if [ ! -f "arkas.db" ]; then
    echo "❌ Database ARKAS tidak ditemukan"
    return 1
  fi

  # Check tabel penting
  local tables=("RAPBS" "Anggaran" "KasUmum" "PTK")
  for table in "${tables[@]}"; do
    local count=$(sqlite3 arkas.db "SELECT COUNT(*) FROM $table;" 2>/dev/null)
    if [ -z "$count" ]; then
      echo "❌ Tabel $table tidak ada atau error"
      return 1
    fi
    echo "  ✅ Tabel $table: $count records"
  done

  # Check konsistensi data
  local total_anggaran=$(sqlite3 arkas.db "SELECT SUM(jumlah) FROM Anggaran;" 2>/dev/null)
  local total_realisasi=$(sqlite3 arkas.db "SELECT SUM(jumlah) FROM KasUmum WHERE jenis='Pengeluaran';" 2>/dev/null)

  echo "  📊 Total Anggaran: Rp ${total_anggaran:-0}"
  echo "  📊 Total Realisasi: Rp ${total_realisasi:-0}"

  # Check jika realisasi melebihi anggaran
  if [ "${total_realisasi:-0}" -gt "${total_anggaran:-0}" ]; then
    echo "⚠️  WARNING: Realisasi melebihi anggaran!"
  fi

  echo "✅ Validasi selesai"
  return 0
}

validate_arkas_data
```

### Hook 2: Auto-Backup Database ARKAS

```bash
#!/bin/bash
# .claude/hooks/backup-arkas.sh

# Trigger: post-tool-use setelah operasi write ke database

BACKUP_DIR="D:\Programming\arkas-backups"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')

backup_database() {
  if [ ! -f "arkas.db" ]; then
    return 0
  fi

  mkdir -p "$BACKUP_DIR"

  local backup_file="$BACKUP_DIR/arkas_${TIMESTAMP}.db"

  echo "📦 Backup database ARKAS..."
  cp "arkas.db" "$backup_file"

  # Compress backup
  if command -v gzip &> /dev/null; then
    gzip "$backup_file"
    echo "✅ Backup: ${backup_file}.gz"
  else
    echo "✅ Backup: $backup_file"
  fi

  # Cleanup old backups (keep last 30 days)
  find "$BACKUP_DIR" -name "arkas_*.db*" -mtime +30 -delete 2>/dev/null

  echo "📊 Total backups: $(ls "$BACKUP_DIR" | wc -l) files"
}

# Hanya backup jika ada perubahan ke database
if echo "$CLAUDE_CODE_CHANGED_FILES" | grep -q "arkas.db"; then
  backup_database
fi
```

### Hook 3: Generate Laporan Otomatis

```bash
#!/bin/bash
# .claude/hooks/generate-report.sh

# Trigger: notification saat task selesai

generate_monthly_report() {
  local report_dir="reports/$(date '+%Y-%m')"
  mkdir -p "$report_dir"

  echo "📝 Generate laporan bulanan..."

  # Laporan keuangan
  sqlite3 arkas.db <<EOF > "$report_dir/keuangan.md"
# Laporan Keuangan - $(date '+%B %Y')

## Ringkasan
- Total Pemasukan: $(sqlite3 arkas.db "SELECT COALESCE(SUM(jumlah),0) FROM KasUmum WHERE jenis='Pemasukan';")
- Total Pengeluaran: $(sqlite3 arkas.db "SELECT COALESCE(SUM(jumlah),0) FROM KasUmum WHERE jenis='Pengeluaran';")
- Saldo: $(sqlite3 arkas.db "SELECT COALESCE(SUM(CASE WHEN jenis='Pemasukan' THEN jumlah ELSE -jumlah END),0) FROM KasUmum;")

## Detail Pengeluaran per Kategori
$(sqlite3 arkas.db "SELECT kategori, SUM(jumlah) as total FROM KasUmum WHERE jenis='Pengeluaran' GROUP BY kategori ORDER BY total DESC;")
EOF

  echo "✅ Laporan disimpan di $report_dir/keuangan.md"
}

if [ "$CLAUDE_CODE_NOTIFICATION_TYPE" = "task-complete" ]; then
  generate_monthly_report
fi
```

---

## 🔧 INTEGRASI HOOKS DENGAN SCRIPTS (feiskyer/claude-code-settings)

Repo `feiskyer/claude-code-settings` menyediakan utility scripts yang bisa dipanggil dari hooks:

### Update Plugins Otomatis

```bash
#!/bin/bash
# .claude/hooks/update-plugins.sh

# Trigger: pre-prompt (mingguan)

LAST_UPDATE_FILE="$HOME/.claude/.last-plugin-update"
TODAY=$(date '+%Y-%m-%d')

# Check jika sudah update hari ini
if [ -f "$LAST_UPDATE_FILE" ]; then
  LAST_UPDATE=$(cat "$LAST_UPDATE_FILE")
  if [ "$LAST_UPDATE" = "$TODAY" ]; then
    exit 0
  fi
fi

echo "🔄 Checking for plugin updates..."
bash ~/.claude/scripts/update-cc-plugins.sh 2>/dev/null

echo "$TODAY" > "$LAST_UPDATE_FILE"
echo "✅ Plugin update check selesai"
```

### Script Utility Lainnya

| Script | Fungsi | Trigger Hook |
|--------|--------|-------------|
| `update-cc-plugins.sh` | Update semua plugins | pre-prompt (mingguan) |
| `backup-settings.sh` | Backup settings | on-apply-diff |
| `validate-config.sh` | Validasi konfigurasi | pre-prompt |
| `cleanup-temp.sh` | Bersihkan file temporary | post-commit |

---

## 📝 KONFIGURASI HOOKS DI SETTINGS

### Full Configuration Example

```json
// .claude/settings.json
{
  "hooks": {
    "pre-prompt": {
      "command": "bash .claude/hooks/pre-prompt.sh",
      "timeout": 10,
      "onFailure": "warn"
    },
    "post-tool-use": {
      "command": "bash .claude/hooks/post-tool-use.sh",
      "timeout": 30,
      "onFailure": "continue"
    },
    "on-apply-diff": {
      "command": "bash .claude/hooks/on-apply-diff.sh",
      "timeout": 30,
      "onFailure": "warn"
    },
    "notification": {
      "command": "bash .claude/hooks/notification.sh",
      "timeout": 15,
      "onFailure": "continue"
    },
    "pre-commit": {
      "command": "bash .claude/hooks/pre-commit.sh",
      "timeout": 60,
      "onFailure": "block"
    }
  },
  "env": {
    "CLAUDE_CODE_AUTO_COMMIT": "false",
    "CLAUDE_CODE_AUTO_FORMAT": "true",
    "CLAUDE_CODE_BACKUP_ENABLED": "true"
  }
}
```

### Hook Configuration Options

| Option | Value | Deskripsi |
|--------|-------|-----------|
| `command` | string | Command yang dijalankan |
| `timeout` | number | Timeout dalam detik |
| `onFailure` | `warn` / `continue` / `block` | Behavior saat hook gagal |
| `env` | object | Environment variables tambahan |

---

## ⚠️ TROUBLESHOOKING HOOKS

### Masalah Umum dan Solusi

**1. Hook tidak dijalankan**
```bash
# Check permission
ls -la .claude/hooks/pre-prompt.sh
# Harus executable
chmod +x .claude/hooks/pre-prompt.sh

# Check shebang
head -1 .claude/hooks/pre-prompt.sh
# Harus #!/bin/bash atau #!/usr/bin/env bash
```

**2. Hook error tapi tidak jelas**
```bash
# Test hook secara manual
bash -x .claude/hooks/pre-prompt.sh
# -x flag menampilkan setiap command yang dijalankan
```

**3. Hook terlalu lambat**
```bash
# Tambah timeout di settings
{
  "hooks": {
    "pre-prompt": {
      "command": "bash .claude/hooks/pre-prompt.sh",
      "timeout": 30  # Increase from default 10
    }
  }
}
```

**4. Hook conflict dengan git hooks**
```bash
# Claude Code hooks dan git hooks berjalan terpisah
# Claude hooks: .claude/hooks/
# Git hooks: .git/hooks/
# Pastikan tidak ada conflict logic
```

---

## ✅ CHECKLIST

- [ ] Paham apa itu hooks dan cara kerjanya
- [ ] Tahu 4+ jenis hooks (pre-prompt, post-tool-use, on-apply-diff, notification)
- [ ] Bisa membuat custom hook sederhana
- [ ] Paham hook configuration di settings.json
- [ ] Tahu use cases: auto-format, auto-test, auto-commit, notification
- [ ] Paham hook security best practices
- [ ] Bisa membuat hook untuk administrasi sekolah
- [ ] Tahu integrasi hooks dengan scripts dari feiskyer/claude-code-settings
- [ ] Bisa troubleshoot masalah hooks

---

> **Lanjut ke:** [`08-git-workflow-dengan-ai.md`](./08-git-workflow-dengan-ai.md)
