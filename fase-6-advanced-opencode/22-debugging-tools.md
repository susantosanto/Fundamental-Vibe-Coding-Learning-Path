# 22: Debugging & Diagnostic Tools

> **Diagnosa masalah OpenCode seperti developer profesional**

**Estimasi**: 20 menit belajar + 30 menit praktik | **Level**: Advanced

## 🎯 Outcome

Setelah menyelesaikan modul ini, kamu akan:
- Menguasai built-in debugging tools OpenCode (`opencode debug`)
- Memahami cara inspect context window dan tool call behavior
- Mampu mendiagnosa konfigurasi yang tidak生效
- Bisa troubleshoot file system, LSP, Agent, dan Skill issues
- Memahami performance debugging: token usage, response time, cost monitoring
- Mampu melakukan network debugging: API connectivity, proxy, rate limiting
- Bisa melakukan memory debugging: context compaction, session recovery
- Menguasai diagnostic commands untuk health check sistem
- Mampu debug masalah umum dalam workflow administrasi sekolah

## 🛠️ OpenCode Debug Toolbox

OpenCode menyediakan built-in debug tools melalui command `opencode debug`. Ini adalah Swiss Army knife untuk mendiagnosa segala masalah di OpenCode.

### Kategori Debug Tools

```
┌─────────────────────────────────────────────────────────┐
│              OpenCode Debug Toolbox                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Config Debug     → Lihat final merged config        │
│  2. File System      → Search, read, tree inspection    │
│  3. Agent & Skill    → Inspect loaded agents & skills   │
│  4. LSP              → Code intelligence diagnostics    │
│  5. System Paths     → Data, config, log, cache paths   │
│  6. Snapshot         → Context compression tracking     │
│  7. Scrap            → Project history & worktrees      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Referensi**: [vbgate/learn-opencode](https://github.com/vbgate/learn-opencode) — bagian debugging dan troubleshooting.

---

## 🔍 1. Debug Konfigurasi

### Mengapa Config Debug Penting?

Config OpenCode tidak hanya berasal dari satu file. Ada **7 layer prioritas** yang di-merge saat startup:

| Prioritas | Sumber | Keterangan |
|-----------|--------|------------|
| 1 (terendah) | Remote `.well-known/opencode` | Default organisasi |
| 2 | `~/.config/opencode/opencode.json` | Global user config |
| 3 | `OPENCODE_CONFIG` env var | Custom path |
| 4 | `./opencode.json` | Project root |
| 5 | `./.opencode/opencode.json` | Project .opencode (recommended) |
| 6 | `OPENCODE_CONFIG_CONTENT` env | Inline JSON |
| 7 (tertinggi) | Managed config dir | Enterprise |

**Plugin juga bisa inject config saat startup**. Ini berarti config yang生效 bisa sangat berbeda dari yang kamu tulis di file.

### Cara Debug Config

```bash
opencode debug config
```

**Output contoh**:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-20250514",
  "small_model": "anthropic/claude-haiku-4-5",
  "default_agent": "build",
  "agent": {
    "build": {
      "description": "General-purpose coding agent",
      "mode": "primary"
    },
    "plan": {
      "description": "Planning agent for complex tasks",
      "mode": "primary"
    },
    "my-custom-agent": {
      "description": "Custom agent for school admin",
      "mode": "subagent"
    }
  },
  "mcp": {
    "filesystem": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem", "."],
      "enabled": true
    }
  },
  "plugin_injected_config": {
    "theme": "catppuccin",
    "username": "Operator"
  }
}
```

### Apa yang Harus Dicek?

1. **Model yang生效**: Apakah model yang kamu set benar-benar digunakan?
2. **Agent ter-load**: Cek field `agent` — apakah custom agent kamu ada di sana?
3. **MCP enabled**: Apakah MCP server yang kamu config statusnya `enabled: true`?
4. **Plugin injection**: Apakah plugin mengoverride config yang kamu harapkan?
5. **Variable substitution**: Apakah `{env:VAR_NAME}` sudah ter-resolve?

### Debug Variable Substitution

Kalau variable substitution tidak jalan:

```bash
# Cek environment variable
echo $ANTHROPIC_API_KEY

# Test config dengan explicit env
OPENCODE_CONFIG_CONTENT='{"model":"anthropic/claude-sonnet-4-20250514"}' opencode debug config
```

**Common issues**:
- Environment variable tidak diset → `{env:VAR_NAME}` tetap sebagai string literal
- File path salah → `{file:~/.secrets/key}` tidak bisa dibaca
- Syntax salah → `{env:VAR_NAME}` harus exact, tidak boleh `{env: VAR_NAME}` (ada spasi)

---

## 📁 2. Debug File System

OpenCode menggunakan **ripgrep (rg)** untuk search super cepat. Kalau hasil search tidak sesuai ekspektasi, ini langkah debugging-nya.

### Test Search

```bash
# Search keyword di seluruh project
opencode debug rg search "function calculateBOS"

# Search dengan regex
opencode debug rg search "class\s+\w+Model"

# Search di file tertentu saja
opencode debug rg search "import" --include "*.ts"
```

### Lihat Tree Direktori

```bash
# Lihat struktur project (versi OpenCode)
opencode debug rg tree

# Output contoh:
# .
# ├── src/
# │   ├── index.ts
# │   ├── utils/
# │   │   └── helpers.ts
# │   └── models/
# │       └── student.ts
# ├── package.json
# └── .opencode/
#     ├── opencode.json
#     └── agent/
#         └── school-admin.md
```

### Baca File dengan Metadata

```bash
# Baca file (JSON format, include metadata)
opencode debug file read package.json
```

**Output**:
```json
{
  "path": "package.json",
  "size": 1234,
  "modified": "2025-04-15T10:30:00Z",
  "content": "{\n  \"name\": \"my-project\",\n  \"version\": \"1.0.0\"\n}"
}
```

### Debug File Tidak Ketemu

**Gejala**: AI bilang "file tidak ditemukan" padahal file ada.

**Penyebab dan solusi**:

| Penyebab | Solusi |
|----------|--------|
| File di `.gitignore` | OpenCode respect `.gitignore`, gunakan `!` prefix di `.gitignore` |
| File terlalu besar | OpenCode punya limit file size, split file atau gunakan `head`/`tail` |
| Permission denied | Check file permission, pastikan readable |
| Path salah | Gunakan `opencode debug rg tree` untuk verify path |
| Binary file | ripgrep skip binary by default, gunakan flag `--binary` |

### Debug .gitignore Issues

```bash
# Cek apakah file di-ignore
git check-ignore -v path/to/file.txt

# Lihat semua pattern yang meng-ignore file
git status --ignored
```

---

## 🤖 3. Debug Agent & Skill

### List Semua Skill yang Ter-load

```bash
opencode debug skill
```

**Output contoh**:
```json
[
  {
    "name": "fanyi",
    "description": "Translation skill for multi-language support",
    "location": "/Users/user/.claude/skills/fanyi/SKILL.md"
  },
  {
    "name": "sync-changelog",
    "description": "Auto-sync changelog on version bump",
    "location": "/Users/user/.config/opencode/skill/sync-changelog/SKILL.md"
  },
  {
    "name": "arkasku",
    "description": "Akses data ARKAS untuk keuangan sekolah",
    "location": "/Users/user/.agents/skills/arkasku/SKILL.md"
  }
]
```

### Cek Detail Agent

```bash
# Cek detail agent (include permission, prompt)
opencode debug agent build

# Cek subagent
opencode debug agent security-auditor
```

**Output contoh**:
```json
{
  "name": "build",
  "description": "General-purpose coding agent",
  "mode": "primary",
  "permission": {
    "edit": "allow",
    "bash": {
      "*": "allow",
      "rm -rf*": "deny",
      "sudo*": "deny"
    }
  },
  "prompt": "You are a general-purpose coding agent...",
  "tools": ["bash", "read", "write", "edit", "glob", "grep"]
}
```

### Test Tool Execution (Advanced)

```bash
# Simulate tool execution untuk test
opencode debug agent build --tool bash --params '{"command":"ls -la"}'
```

Ini berguna untuk:
- Verifikasi permission agent benar
- Test tool parameters sebelum pakai di production
- Debug kenapa agent tidak bisa execute tool tertentu

### Debug Skill Tidak Ter-load

**Gejala**: Skill tidak muncul di `opencode debug skill`.

**Checklist troubleshooting**:

1. **File path benar?**
   ```bash
   # Skill harus di salah satu lokasi ini:
   ~/.agents/skills/<skill-name>/SKILL.md
   ~/.config/opencode/skills/<skill-name>/SKILL.md
   .opencode/skills/<skill-name>/SKILL.md
   ```

2. **Frontmatter valid?**
   ```markdown
   ---
   name: my-skill
   description: Deskripsi skill yang jelas
   ---
   ```
   Pastikan `name` dan `description` ada di frontmatter.

3. **File encoding benar?**
   ```bash
   # Cek file encoding
   file .opencode/skills/my-skill/SKILL.md
   # Harus UTF-8
   ```

4. **Syntax YAML valid?**
   ```bash
   # Test YAML parsing
   python -c "import yaml; yaml.safe_load(open('.opencode/skills/my-skill/SKILL.md'))"
   ```

### Debug Agent Auto-Selection

**Gejala**: Primary agent tidak memilih subagent yang benar.

**Penyebab**: Deskripsi subagent tidak spesifik enough.

**Solusi**: Buat deskripsi yang sangat spesifik:

```markdown
---
description: |
  Ahli security audit: OWASP Top 10, dependency scanning,
  authentication flow review, hardcoded secrets detection.
  Trigger: saat ada security concern, PR baru, dependency update.
  TIDAK untuk: performance optimization, code style review.
mode: subagent
---
```

Semakin spesifik deskripsi, semakin tepat auto-selection.

---

## 🔧 4. Debug LSP (Language Server Protocol)

LSP memberikan **code intelligence** ke OpenCode: jump to definition, find references, diagnostics, code completion.

### Diagnostic Info

```bash
# Lihat errors/warnings untuk file tertentu
opencode debug lsp diagnostics src/index.ts
```

**Output contoh**:
```json
{
  "diagnostics": [
    {
      "severity": "error",
      "message": "Cannot find name 'undefinedVar'",
      "line": 15,
      "column": 10,
      "source": "typescript"
    },
    {
      "severity": "warning",
      "message": "'unusedImport' is declared but never used",
      "line": 3,
      "column": 1,
      "source": "typescript"
    }
  ]
}
```

### Search Workspace Symbols

```bash
# Cari symbol di seluruh workspace
opencode debug lsp symbols "AppController"

# Output: lokasi definisi, type, file path
```

### Symbol Structure Satu File

```bash
# Lihat struktur symbol dalam 1 file
opencode debug lsp document-symbols src/index.ts
```

**Output contoh**:
```json
{
  "symbols": [
    {
      "name": "AppController",
      "kind": "Class",
      "range": { "start": 10, "end": 50 }
    },
    {
      "name": "handleRequest",
      "kind": "Method",
      "range": { "start": 15, "end": 30 }
    },
    {
      "name": "validateInput",
      "kind": "Function",
      "range": { "start": 35, "end": 45 }
    }
  ]
}
```

### Debug LSP Tidak Jalan

**Gejala**: Code completion atau jump-to-definition tidak bekerja.

**Troubleshooting steps**:

1. **Cek LSP server running**:
   ```bash
   # Untuk TypeScript
   which typescript-language-server
   tsserver --version
   ```

2. **Cek file type detection**:
   ```bash
   # Pastikan file extension benar
   file src/index.ts
   ```

3. **Restart LSP**:
   ```bash
   # Di OpenCode, trigger re-initialization
   opencode debug lsp diagnostics src/index.ts
   ```

4. **Cek LSP config**:
   ```jsonc
   // .opencode/opencode.json
   {
     "lsp": {
       "typescript": {
         "enabled": true,
         "command": ["typescript-language-server", "--stdio"]
       }
     }
   }
   ```

---

## 📂 5. System Status dan Paths

### Lihat Path-Path Penting

```bash
opencode debug paths
```

**Output**:
```
data       C:\Users\USER\AppData\Local\opencode
config     C:\Users\USER\.config\opencode
log        C:\Users\USER\AppData\Local\opencode\log
cache      C:\Users\USER\AppData\Local\opencode\cache
```

### Fungsi Setiap Directory

| Directory | Isi | Kapan Dibutuhkan |
|-----------|-----|------------------|
| `data` | Session data, project history | Recovery session, backup |
| `config` | Global config, skills, agents | Setup, migration |
| `log` | Log files, error traces | Debugging, troubleshooting |
| `cache` | Cached responses, LSP cache | Clear cache, performance |

### Lihat Project History

```bash
# Lihat semua project yang pernah dibuka
opencode debug scrap
```

**Output**:
```json
[
  {
    "id": "project-abc123",
    "path": "D:\\Projects\\school-admin",
    "lastOpened": "2025-04-15T10:30:00Z",
    "sessions": 15
  },
  {
    "id": "project-def456",
    "path": "D:\\Projects\\bos-report",
    "lastOpened": "2025-04-14T08:00:00Z",
    "sessions": 8
  }
]
```

### Clear Cache

Kalau OpenCode terasa lambat atau behavior aneh:

```bash
# Windows PowerShell
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\opencode\cache\*"

# Linux/macOS
rm -rf ~/.cache/opencode/*
```

---

## 📸 6. Debug Snapshot (Context Compression)

OpenCode menggunakan **snapshot** untuk context compression. Snapshot adalah "foto" state percakapan yang digunakan untuk compress context saat window penuh.

### Track Snapshot State

```bash
# Lihat snapshot state saat ini
opencode debug snapshot track
```

**Output**:
```json
{
  "currentSnapshot": "abc123def456",
  "timestamp": "2025-04-15T10:30:00Z",
  "tokenCount": 45000,
  "compressionRatio": 0.65
}
```

### Lihat Perbedaan Snapshot

```bash
# Bandingkan dengan snapshot sebelumnya
opencode debug snapshot diff abc123def456
```

**Output**:
```
Changes since snapshot abc123def456:
+ Added: 3 new file references
- Removed: 2 old tool call results
~ Modified: 1 conversation turn
Token delta: +2500 tokens
```

### Debug Context Overflow

**Gejala**: AI mulai "lupa" percakapan sebelumnya atau behavior jadi aneh.

**Penyebab**: Context window penuh, compression kehilangan informasi penting.

**Solusi**:

1. **Kompact session manual**:
   ```
   /compact
   ```

2. **Start session baru**:
   ```
   /new
   ```

3. **Optimasi context usage**:
   - Gunakan `subtask: true` untuk command yang tidak perlu di main context
   - Disable MCP yang tidak dipakai
   - Gunakan skill on-demand, bukan auto-load

### Context Window Management

| Model | Context Window | Estimasi Token per File |
|-------|----------------|------------------------|
| Claude Sonnet 4 | 200K tokens | ~50 files (avg 4K tokens/file) |
| Claude Opus 4 | 200K tokens | ~50 files |
| Claude Haiku 4 | 200K tokens | ~50 files |

**Tips**: Satu file TypeScript 500 baris ≈ 3000-5000 tokens. Satu conversation turn ≈ 500-2000 tokens.

---

## ⚡ 7. Performance Debugging

### Response Time Analysis

Untuk mengukur response time OpenCode:

```bash
# Time command execution
time opencode --help

# Measure specific operation
Measure-Command { opencode debug config }
```

### Token Usage Tracking

Token usage bisa dicek melalui:

1. **Provider dashboard**: Anthropic Console, OpenAI Dashboard, dll.
2. **Log files**: Check `log` directory untuk token usage per session
3. **In-session**: Beberapa provider menampilkan token usage di response

### Cost Monitoring

**Estimasi cost per operasi**:

| Operasi | Estimasi Token | Cost (Claude Sonnet) |
|---------|----------------|---------------------|
| Simple question | 1K-3K | $0.003-$0.01 |
| Code review 1 file | 5K-15K | $0.015-$0.05 |
| Full project analysis | 50K-100K | $0.15-$0.30 |
| MCP tool call | 2K-5K | $0.006-$0.015 |

**Tips hemat cost**:
- Gunakan `small_model` untuk task ringan (generate title, summarize)
- Disable MCP yang tidak dipakai
- Gunakan subtask untuk operasi isolasi
- Compact session secara berkala

---

## 🔌 8. Network Debugging

### API Connectivity Test

```bash
# Test koneksi ke Anthropic API
curl -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     https://api.anthropic.com/v1/messages \
     -d '{"model":"claude-sonnet-4-20250514","max_tokens":10,"messages":[{"role":"user","content":"hi"}]}'

# Test koneksi ke OpenAI API
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models
```

### Proxy Configuration

Kalau kamu di belakang proxy:

```jsonc
// .opencode/opencode.json
{
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}",
        "baseURL": "https://api.anthropic.com",
        "httpAgent": {
          "proxy": "http://proxy.sekolah:8080"
        }
      }
    }
  }
}
```

Atau via environment variable:

```bash
# Windows PowerShell
$env:HTTP_PROXY = "http://proxy.sekolah:8080"
$env:HTTPS_PROXY = "http://proxy.sekolah:8080"

# Linux/macOS
export HTTP_PROXY="http://proxy.sekolah:8080"
export HTTPS_PROXY="http://proxy.sekolah:8080"
```

### Rate Limiting

**Gejala**: Error 429 (Too Many Requests).

**Solusi**:

1. **Increase timeout**:
   ```jsonc
   {
     "provider": {
       "anthropic": {
         "options": {
           "timeout": 600000
         }
       }
     }
   }
   ```

2. **Retry dengan backoff**:
   - OpenCode otomatis retry untuk transient errors
   - Kalau manual: tunggu 30-60 detik sebelum retry

3. **Switch model**:
   - Gunakan model dengan rate limit lebih tinggi
   - Gunakan `small_model` untuk task ringan

### Timeout Issues

**Gejala**: Request timeout setelah 300 detik (default).

**Solusi**:

```jsonc
{
  "provider": {
    "anthropic": {
      "options": {
        "timeout": 600000  // 10 menit
      }
    }
  }
}
```

**Timeout recommendations**:

| Use Case | Recommended Timeout |
|----------|-------------------|
| Simple query | 30 detik |
| Code generation | 5 menit |
| Large file analysis | 10 menit |
| MCP heavy operations | 15 menit |

---

## 📁 9. File System Debugging

### File Access Issues

**Gejala**: "Permission denied" saat akses file.

**Troubleshooting**:

1. **Cek permission file**:
   ```bash
   # Windows
   Get-Acl "D:\Projects\data.db"

   # Linux/macOS
   ls -la data.db
   ```

2. **Cek file lock**:
   ```bash
   # Windows - cek file yang di-lock
   handle.exe data.db
   ```

3. **Cek path resolution**:
   ```bash
   # Verify path exists
   Test-Path "D:\Projects\data.db"

   # Resolve relative path
   Resolve-Path "./data.db"
   ```

### Permission Errors

**Common scenarios**:

| Scenario | Penyebab | Solusi |
|----------|----------|--------|
| Read-only file | File attribute read-only | `attrib -r file.txt` |
| File in use | File di-lock process lain | Close aplikasi yang pakai file |
| Directory permission | No write access to dir | Run as administrator |
| Antivirus blocking | AV block file access | Add exception |

### Path Resolution Debugging

```bash
# Cek current working directory
pwd

# Cek path resolution
Resolve-Path "./src/index.ts"

# Cek symbolic links
Get-ChildItem -Recurse -Attributes ReparsePoint
```

---

## 🧠 10. Memory Debugging

### Context Compaction

Context compaction terjadi otomatis saat context window mendekati limit. Tapi kamu bisa trigger manual:

```
/compact
```

**Apa yang terjadi saat compact**:
1. Conversation history di-summarize
2. Tool call results yang lama dihapus
3. File references yang tidak aktif di-remove
4. Summary dikirim ke LLM sebagai "memory" baru

### Memory Management Best Practices

1. **Gunakan subtask untuk operasi besar**:
   ```markdown
   ---
   description: Analisis seluruh project
   subtask: true
   ---
   ```

2. **Disable MCP yang tidak dipakai**:
   ```jsonc
   {
     "mcp": {
       "context7": {
         "enabled": false  // Aktifkan hanya saat butuh
       }
     }
   }
   ```

3. **Compact session berkala**:
   - Setiap 20-30 conversation turns
   - Sebelum operasi besar

### Session Recovery

Kalau session crash atau hilang:

1. **Cek session history**:
   ```bash
   opencode debug scrap
   ```

2. **Resume session**:
   ```
   /sessions
   # Pilih session yang mau di-resume
   ```

3. **Recover dari log**:
   ```bash
   # Windows
   Get-Content "$env:LOCALAPPDATA\opencode\log\*.log" -Tail 100
   ```

---

## 🔍 11. Diagnostic Commands Cheat Sheet

### Complete Command Reference

| Command | Fungsi | Kapan Dipakai |
|---------|--------|---------------|
| `debug config` | Lihat final merged config | Cek config生效, lihat plugin injection |
| `debug agent <nama>` | Detail Agent | Cek prompt, permission, tools |
| `debug agent --tool` | **Manual execute tool** | Test tool params, verify permissions |
| `debug skill` | List Skills | Confirm Skill loaded, check path |
| `debug rg search` | Test search | Debug file tidak ketemu |
| `debug rg tree` | Lihat directory tree | Verify project structure |
| `debug file read` | Baca file | Cek file content + metadata |
| `debug paths` | Lihat paths | Cari log files, clear cache |
| `debug lsp diagnostics` | Debug LSP | Fix code completion/jump issues |
| `debug lsp symbols` | Search symbols | Cari definisi class/function |
| `debug lsp document-symbols` | File structure | Lihat struktur symbol 1 file |
| `debug snapshot track` | Context state | Monitor context compression |
| `debug snapshot diff` | Snapshot comparison | Cek apa yang berubah |
| `debug scrap` | List projects | Cari project ID lama |

### Quick Diagnostic Flowchart

```
OpenCode bermasalah?
    │
    ├── Config aneh?         → opencode debug config
    ├── File tidak ketemu?   → opencode debug rg search
    ├── Agent tidak jalan?   → opencode debug agent <name>
    ├── Skill tidak load?    → opencode debug skill
    ├── LSP error?           → opencode debug lsp diagnostics
    ├── Context penuh?       → opencode debug snapshot track
    ├── Cari project lama?   → opencode debug scrap
    └── Cari log files?      → opencode debug paths
```

---

## 🏫 12. Real-World: Debug Common OpenCode Issues di School Admin Workflows

### Masalah 1: ARKAS Database Tidak Terbaca

**Gejala**: AI tidak bisa baca database ARKAS (`arkas.db`).

**Diagnosa**:
```bash
# Cek file ada
Test-Path "D:\School\arkas.db"

# Cek file size (kalau 0 byte, kemungkinan corrupt)
Get-Item "D:\School\arkas.db" | Select-Object Length

# Cek file lock (apakah ARKAS sedang running)
Get-Process -Name "ARKAS" -ErrorAction SilentlyContinue
```

**Solusi**:
1. Pastikan ARKAS tidak sedang running (file SQLite di-lock saat digunakan)
2. Copy database ke lokasi lain sebelum analisis
3. Gunakan MCP SQLite server untuk query

### Masalah 2: Dapodik Token Expired

**Gejala**: AI tidak bisa akses Dapodik Web Service.

**Diagnosa**:
```bash
# Cek config
opencode debug config | Select-String "dapodik"

# Test API connectivity
curl -H "Authorization: Bearer $DAPODIK_TOKEN" \
     https://data.dikdasmen.kemdikbud.go.id/api/v1/sekolah
```

**Solusi**:
1. Refresh token di `dapodik_config.json`
2. Update environment variable: `$env:DAPODIK_TOKEN = "new-token"`
3. Restart OpenCode

### Masalah 3: BOS Report Generation Slow

**Gejala**: Generate laporan BOS memakan waktu sangat lama.

**Diagnosa**:
```bash
# Cek token usage
# Lihat di provider dashboard

# Cek MCP yang aktif
opencode mcp list

# Cek file size data
Get-ChildItem "D:\School\BOS\*.xlsx" | Select-Object Name, Length
```

**Solusi**:
1. Disable MCP yang tidak diperlukan saat generate report
2. Gunakan `small_model` untuk task formatting
3. Split data besar menjadi batch kecil

### Masalah 4: Skill ARKAS Tidak Ter-load

**Gejala**: Skill `arkasku` tidak muncul saat dibutuhkan.

**Diagnosa**:
```bash
# Cek skill loaded
opencode debug skill | Select-String "arkasku"

# Cek file path
Test-Path "C:\Users\USER\.agents\skills\arkasku\SKILL.md"

# Cek frontmatter valid
Get-Content "C:\Users\USER\.agents\skills\arkasku\SKILL.md" -Head 10
```

**Solusi**:
1. Pastikan file ada di path yang benar
2. Verify frontmatter YAML valid
3. Restart OpenCode

### Masalah 5: Context Overflow Saat Analisis Data PD

**Gejala**: AI "lupa" data peserta didik saat analisis berlangsung.

**Diagnosa**:
```bash
# Cek snapshot state
opencode debug snapshot track

# Cek context size
# Lihat token count di output snapshot
```

**Solusi**:
1. Gunakan subtask untuk analisis data PD:
   ```
   /new
   # Analisis data PD di session terpisah
   ```
2. Export data ke Excel, analisis per-sheet
3. Compact session sebelum mulai analisis baru

---

## ⚠️ Pitfalls dan Troubleshooting

### Tabel Troubleshooting Lengkap

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| `command not found` | OpenCode versi lama | Upgrade ke versi terbaru |
| Output terlalu banyak | JSON data besar | Redirect ke file: `> debug.txt` |
| `debug agent` error | Tidak specify nama Agent | Harus kasih nama: `opencode debug agent coder` |
| Config tidak生效 | Prioritas config | Project-level override global |
| Variable substitution gagal | Env var tidak ada | Cek env var sudah diset |
| MCP timeout | Timeout too short | Increase `timeout` di config |
| Skill tidak load | Path salah | Cek lokasi file SKILL.md |
| LSP tidak jalan | LSP server tidak running | Install language server |
| Context overflow | Session terlalu panjang | `/compact` atau `/new` |
| File tidak ketemu | `.gitignore` atau permission | Cek `.gitignore` dan file permission |

### Debug Mode Verbose

Enable verbose logging untuk debugging mendalam:

```bash
# Windows PowerShell
$env:RUST_LOG = "debug"
opencode

# Linux/macOS
RUST_LOG=debug opencode
```

Log akan menampilkan:
- Semua tool calls yang dilakukan AI
- Parameter dan response dari setiap tool
- Context window usage
- MCP connection events

---

## 📝 Ringkasan

1. **Config debugging**: `opencode debug config` untuk lihat final merged config termasuk plugin injection
2. **File system debugging**: `opencode debug rg search/tree` dan `opencode debug file read` untuk inspect file
3. **Agent & Skill debugging**: `opencode debug agent/skill` untuk verify loading dan inspect behavior
4. **LSP debugging**: `opencode debug lsp diagnostics/symbols` untuk code intelligence issues
5. **System paths**: `opencode debug paths` untuk locate log, cache, config directories
6. **Snapshot debugging**: `opencode debug snapshot track/diff` untuk monitor context compression
7. **Performance debugging**: Monitor token usage, response time, dan cost per operasi
8. **Network debugging**: Test API connectivity, configure proxy, handle rate limiting dan timeout
9. **File system debugging**: Resolve permission errors, path issues, dan file locks
10. **Memory debugging**: Context compaction, session recovery, dan memory management best practices
11. **Diagnostic commands**: Cheat sheet lengkap untuk semua debug commands
12. **School admin workflows**: Troubleshooting spesifik untuk ARKAS, Dapodik, BOS, dan data PD

## 🎯 Next Steps

Setelah menguasai debugging tools:
- **AI Coding Agents Advanced Guide** → Modul 23 untuk pemahaman ekosistem agent secara menyeluruh
- **MCP Advanced** → Custom tool development dan resource subscriptions
- **Production Deployment** → Monitoring dan observability di production environment

**Referensi**:
- [vbgate/learn-opencode](https://github.com/vbgate/learn-opencode)
- [OpenCode Documentation](https://opencode.ai)
- [MCP Protocol Specification](https://modelcontextprotocol.io/specification)