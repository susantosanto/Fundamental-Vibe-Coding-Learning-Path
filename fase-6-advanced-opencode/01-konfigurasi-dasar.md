# 01: Konfigurasi Dasar (opencode.json)

> **Kontrol perilaku inti OpenCode via file konfigurasi**

**Estimasi**: 15 menit | **Level**: Intermediate

## 🎯 Outcome
- Paham lokasi dan prioritas file konfigurasi
- Kuasai model dan provider config
- Variable substitution untuk dynamic config
- Setup username, tema, auto-update
- Permission system dan plugin management
- Workspace management dan best practices

## 📍 Lokasi & Prioritas Konfigurasi

OpenCode load konfigurasi dengan prioritas (rendah→tinggi):

| Prioritas | Lokasi | Keterangan |
|-----------|--------|------------|
| 1 (terendah) | Remote `.well-known/opencode` | Default organisasi |
| 2 | `~/.config/opencode/opencode.json` | Global user config |
| 3 | `OPENCODE_CONFIG` env var | Custom path |
| 4 | `./opencode.json` | Project root |
| 5 | `./.opencode/opencode.json` | Project .opencode (recommended) |
| 6 | `OPENCODE_CONFIG_CONTENT` env | Inline JSON |
| 7 (tertinggi) | Managed config dir | Enterprise |

> **Merge, bukan overwrite**. Config prioritas tinggi override key yang konflik, sisanya tetap.

### Cara Kerja Merge

Ketika ada multiple config files, OpenCode melakukan deep merge:

```
Global config:     { "model": "anthropic/claude-sonnet", "theme": "dark" }
Project config:    { "model": "anthropic/claude-opus" }
Hasil akhir:       { "model": "anthropic/claude-opus", "theme": "dark" }
```

Key `model` dari project override global, tapi `theme` dari global tetap dipakai.

### Verifikasi Config Aktif

Untuk melihat config mana yang sedang aktif:

```bash
# Cek config yang sedang diload
opencode config show

# Atau lihat log startup
opencode --verbose
```

### Strategi Multi-Level Config

**Rekomendasi untuk operator sekolah:**

```
Global (~/.config/opencode/opencode.json):
  - API keys (shared semua project)
  - Theme preferences
  - Default model

Project (.opencode/opencode.json):
  - Model spesifik project
  - Agents untuk project ini
  - MCP servers yang dibutuhkan
  - Permission rules
```

## 📝 Format

Support JSON dan JSONC (dengan komentar):

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-opus-4-5-thinking"
}
```

> **Tips**: Selalu pakai JSONC agar bisa kasih komentar penjelasan di config.

### Schema Validation

Field `$schema` memberikan autocomplete dan validation di editor:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  // Editor akan kasih autocomplete untuk semua field
  "model": "anthropic/claude-sonnet-4-20250514"
}
```

## 🤖 Model Config

### Primary & Small Model

```json
{
  "model": "anthropic/claude-opus-4-5-thinking",
  "small_model": "anthropic/claude-haiku-4-5"
}
```

| Field | Keterangan |
|-------|------------|
| `model` | Primary model (format: provider/model) |
| `small_model` | Model murah untuk task ringan (generate title, dll) |

### Kapan Small Model Dipakai?

OpenCode otomatis pakai `small_model` untuk task-task ringan:

- Generate session title
- Simple classification
- Quick summarization
- Token counting operations

**Estimasi penghematan biaya:**

| Task | Primary Model Cost | Small Model Cost | Hemat |
|------|-------------------|------------------|-------|
| Generate title | $0.01 | $0.001 | 90% |
| Classify intent | $0.005 | $0.0005 | 90% |
| Quick summary | $0.02 | $0.002 | 90% |

### Model Selection Strategy

**Untuk penggunaan harian operator sekolah:**

```jsonc
{
  // Model utama untuk task kompleks (laporan, analisis)
  "model": "anthropic/claude-sonnet-4-20250514",

  // Model murah untuk task ringan
  "small_model": "anthropic/claude-haiku-4-5",

  // Model alternatif kalau primary down
  "fallback_models": [
    "google/gemini-2.5-pro",
    "openai/gpt-4o"
  ]
}
```

**Budget-conscious setup (model lokal/China):**

```jsonc
{
  "model": "zhipu/glm-4-plus",
  "small_model": "deepseek/deepseek-chat",
  "provider": {
    "zhipu": {
      "options": {
        "apiKey": "{env:ZHIPU_API_KEY}"
      }
    },
    "deepseek": {
      "options": {
        "apiKey": "{env:DEEPSEEK_API_KEY}"
      }
    }
  }
}
```

### Default Agent

```json
{
  "default_agent": "build"
}
```

Opsi: `"build"`, `"plan"`, atau custom primary agent.

| Agent | Kapan Dipakai | Karakteristik |
|-------|---------------|---------------|
| `build` | Coding, editing, automation | Langsung eksekusi |
| `plan` | Desain arsitektur, planning | Pikir dulu, baru action |
| Custom | Sesuai kebutuhan | Definisi sendiri di `agent` |

## 🔌 Provider Config

### Basic

```json
{
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}",
        "baseURL": "https://api.anthropic.com",
        "timeout": 600000,
        "setCacheKey": true
      }
    }
  }
}
```

> ⚠️ Key-nya `provider` (singular), BUKAN `providers`.

### Options Fields

| Field | Type | Keterangan |
|-------|------|------------|
| `apiKey` | string | API key |
| `baseURL` | string | Custom API URL (proxy) |
| `timeout` | number/false | Timeout ms, default 300000 |
| `setCacheKey` | boolean | Enable prompt cache key |

### Multi-Provider Setup

Konfigurasi beberapa provider sekaligus:

```jsonc
{
  "model": "anthropic/claude-sonnet-4-20250514",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}",
        "timeout": 600000
      }
    },
    "openai": {
      "options": {
        "apiKey": "{env:OPENAI_API_KEY}",
        "baseURL": "https://api.openai.com/v1"
      }
    },
    "google": {
      "options": {
        "apiKey": "{env:GOOGLE_API_KEY}"
      }
    },
    "zhipu": {
      "options": {
        "apiKey": "{env:ZHIPU_API_KEY}",
        "baseURL": "https://open.bigmodel.cn/api/paas/v4"
      }
    },
    "deepseek": {
      "options": {
        "apiKey": "{env:DEEPSEEK_API_KEY}",
        "baseURL": "https://api.deepseek.com/v1"
      }
    }
  }
}
```

### Provider Whitelist/Blacklist

```json
{
  "disabled_providers": ["openai", "gemini"],
  "enabled_providers": ["anthropic"]
}
```

> `disabled_providers` punya prioritas lebih tinggi dari `enabled_providers`.

**Logika prioritas:**

```
1. Cek disabled_providers → kalau ada, SKIP
2. Cek enabled_providers → kalau ada list, hanya yang di list boleh
3. Kalau keduanya kosong → semua provider aktif
```

### Proxy Configuration

Untuk lingkungan dengan firewall/proxy:

```jsonc
{
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}",
        "baseURL": "https://proxy.sekolah.id/anthropic",
        "timeout": 120000,
        "headers": {
          "X-Proxy-Token": "{env:PROXY_TOKEN}"
        }
      }
    }
  }
}
```

## 🔄 Variable Substitution

### Environment Variables

```json
{
  "model": "{env:OPENCODE_MODEL}",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

### File Content

```json
{
  "provider": {
    "openai": {
      "options": {
        "apiKey": "{file:~/.secrets/openai-key}"
      }
    }
  }
}
```

Path support: relative, absolute (`/`), home (`~`).

### Variable Substitution Patterns

| Pattern | Contoh | Keterangan |
|---------|--------|------------|
| `{env:VAR}` | `{env:API_KEY}` | Baca dari environment variable |
| `{file:path}` | `{file:~/.key}` | Baca dari file |
| `{file:./key}` | `{file:./secrets/key}` | Path relatif dari config |

### Keamanan Variable Substitution

**JANGAN pernah hardcode API key:**

```json
// ❌ SALAH - API key terlihat di config
{
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "sk-ant-1234567890abcdef"
      }
    }
  }
}

// ✅ BENAR - Pakai environment variable
{
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

**Setup environment variable di Windows:**

```powershell
# Temporary (session ini saja)
$env:ANTHROPIC_API_KEY = "sk-ant-..."

# Permanent (user level)
[System.Environment]::SetEnvironmentVariable(
    "ANTHROPIC_API_KEY", "sk-ant-...", "User"
)

# Permanent (system level, butuh admin)
[System.Environment]::SetEnvironmentVariable(
    "ANTHROPIC_API_KEY", "sk-ant-...", "Machine"
)
```

**Setup di Linux/Mac:**

```bash
# Tambah ke ~/.bashrc atau ~/.zshrc
export ANTHROPIC_API_KEY="sk-ant-..."
source ~/.bashrc
```

## 🎨 Theme dan UI

### Tema Tersedia

```json
{ "theme": "tokyonight" }
```

**Daftar tema built-in:**

| Tema | Karakteristik | Cocok Untuk |
|------|---------------|-------------|
| `dark` | Default dark theme | Umum |
| `light` | Light theme | Siang hari, layar terang |
| `catppuccin` | Warm pastel | Estetika, nyaman di mata |
| `tokyonight` | Blue-purple night | Coding malam |
| `dracula` | Dark vampire | Dark mode fan |
| `monokai` | Classic coding | Developer familiar |
| `nord` | Arctic blue | Minimalis |
| `solarized-dark` | Yellow-green dark | Kontras rendah |
| `solarized-light` | Yellow-green light | Kontras rendah |
| `gruvbox` | Retro earth tones | Vintage feel |
| `rose-pine` | Pink-purple | Estetika modern |

### Custom Theme

```jsonc
{
  "theme": {
    "name": "sekolah-dark",
    "colors": {
      "background": "#1a1b26",
      "foreground": "#a9b1d6",
      "accent": "#7aa2f7",
      "error": "#f7768e",
      "success": "#9ece6a",
      "warning": "#e0af68"
    }
  }
}
```

### Keybindings

```jsonc
{
  "keybindings": {
    "ctrl+enter": "submit",
    "ctrl+k": "clear",
    "ctrl+n": "new_session",
    "ctrl+p": "toggle_plan_mode",
    "ctrl+b": "toggle_build_mode"
  }
}
```

### Layout Preferences

```jsonc
{
  "ui": {
    "show_token_count": true,
    "show_cost_estimate": true,
    "max_display_lines": 50,
    "auto_scroll": true,
    "show_timestamps": false
  }
}
```

## 🔐 Permission System

### File Permissions

```jsonc
{
  "permission": {
    "file": {
      "read": "allow",
      "write": "ask",
      "delete": "deny"
    }
  }
}
```

| Permission | Value | Keterangan |
|------------|-------|------------|
| `read` | allow/ask/deny | Baca file |
| `write` | allow/ask/deny | Tulis/edit file |
| `delete` | allow/ask/deny | Hapus file |

### Command Permissions

```jsonc
{
  "permission": {
    "bash": {
      "read": "allow",
      "edit": "ask",
      "full": "deny"
    }
  }
}
```

| Level | Akses | Contoh Command |
|-------|-------|----------------|
| `read` | Read-only commands | `ls`, `cat`, `grep` |
| `edit` | File modification | `sed`, `touch`, `mkdir` |
| `full` | Semua command | `rm -rf`, `sudo`, dll |

### Network Permissions

```jsonc
{
  "permission": {
    "network": {
      "allowed_domains": ["api.anthropic.com", "github.com"],
      "blocked_domains": ["malicious-site.com"]
    }
  }
}
```

### Granular Permission Rules

```jsonc
{
  "permission": {
    "rules": [
      {
        "pattern": "*.md",
        "actions": ["read", "write"],
        "level": "allow"
      },
      {
        "pattern": "*.config.json",
        "actions": ["write"],
        "level": "ask"
      },
      {
        "pattern": "node_modules/**",
        "actions": ["*"],
        "level": "deny"
      }
    ]
  }
}
```

## 🌍 Environment Variables

### Konfigurasi via Environment Variables

| Variable | Fungsi | Contoh |
|----------|--------|--------|
| `OPENCODE_CONFIG` | Custom config path | `C:\config\opencode.json` |
| `OPENCODE_CONFIG_CONTENT` | Inline JSON config | `{"model":"anthropic/..."}` |
| `OPENCODE_MODEL` | Override model | `anthropic/claude-sonnet-4` |
| `OPENCODE_HOME` | Custom home directory | `D:\opencode-home` |
| `ANTHROPIC_API_KEY` | Anthropic API key | `sk-ant-...` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `GOOGLE_API_KEY` | Google API key | `AIza...` |

### .env File Support

Buat file `.env` di project root:

```env
ANTHROPIC_API_KEY=sk-ant-1234567890abcdef
OPENAI_API_KEY=sk-proj-1234567890abcdef
ZHIPU_API_KEY=abc123def456
OPENCODE_MODEL=anthropic/claude-sonnet-4-20250514
```

OpenCode otomatis load `.env` saat startup.

### Secret Management Best Practices

**Level keamanan:**

```
Level 1 (Basic): Environment variables
Level 2 (Better): .env file + .gitignore
Level 3 (Best): Secret manager (Vault, AWS Secrets Manager)
Level 4 (Enterprise): File-based dengan {file:path}
```

**Selalu tambahkan ke .gitignore:**

```gitignore
# Secrets
.env
*.key
*.pem
secrets/

# Config dengan sensitive data
opencode.local.json
```

## 🔌 Plugin System

### Installing Plugins

```jsonc
{
  "plugins": {
    "github": {
      "enabled": true,
      "config": {
        "token": "{env:GITHUB_TOKEN}"
      }
    },
    "filesystem": {
      "enabled": true,
      "config": {
        "allowed_dirs": ["./", "../projects/"]
      }
    }
  }
}
```

### Creating Custom Plugins

Struktur plugin:

```
.opencode/
└── plugins/
    └── my-plugin/
        ├── plugin.json
        ├── index.js
        └── README.md
```

plugin.json:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "Plugin untuk automasi tugas sekolah",
  "main": "index.js",
  "tools": ["dapodik_lookup", "arkas_export"]
}
```

### Plugin Configuration

```jsonc
{
  "plugins": {
    "mcp-servers": {
      "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "D:/"]
      },
      "github": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"]
      }
    }
  }
}
```

## 📂 Workspace Management

### Multiple Projects

OpenCode bisa manage multiple workspace:

```jsonc
{
  "workspaces": {
    "sekolah-admin": {
      "path": "D:/sekolah/admin",
      "model": "anthropic/claude-sonnet-4",
      "agents": ["build", "plan"]
    },
    "arkas-finance": {
      "path": "D:/sekolah/arkas",
      "model": "anthropic/claude-opus",
      "agents": ["build"]
    },
    "dapodik-tools": {
      "path": "D:/sekolah/dapodik",
      "model": "zhipu/glm-4-plus",
      "agents": ["build", "plan", "debug"]
    }
  }
}
```

### Workspace Switching

```bash
# Switch workspace
opencode workspace switch sekolah-admin

# List semua workspace
opencode workspace list

# Buat workspace baru
opencode workspace create nama-workspace --path /path/to/project
```

### Context Preservation

OpenCode menyimpan context per workspace:

```
~/.config/opencode/
└── workspaces/
    ├── sekolah-admin/
    │   ├── sessions/
    │   ├── history.json
    │   └── context.json
    ├── arkas-finance/
    │   ├── sessions/
    │   ├── history.json
    │   └── context.json
    └── dapodik-tools/
        ├── sessions/
        ├── history.json
        └── context.json
```

## ✅ Configuration Best Practices

### Security

```jsonc
{
  // ✅ Pakai variable substitution
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}"
      }
    }
  },

  // ✅ Batasi permission
  "permission": {
    "file": {
      "delete": "deny"
    },
    "bash": {
      "full": "deny"
    }
  },

  // ✅ Disable provider yang tidak dipakai
  "disabled_providers": ["openai", "gemini"]
}
```

### Performance

```jsonc
{
  // ✅ Pakai small model untuk task ringan
  "small_model": "anthropic/claude-haiku-4-5",

  // ✅ Set timeout yang reasonable
  "provider": {
    "anthropic": {
      "options": {
        "timeout": 600000
      }
    }
  },

  // ✅ Enable caching kalau supported
  "provider": {
    "anthropic": {
      "options": {
        "setCacheKey": true
      }
    }
  }
}
```

### Team Sharing

```jsonc
{
  // ✅ Config yang bisa di-share (tanpa secrets)
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-20250514",
  "small_model": "anthropic/claude-haiku-4-5",
  "theme": "catppuccin",
  "autoupdate": true,

  // ❌ JANGAN commit API keys
  // API keys harus di .env atau environment
}
```

**.gitignore untuk project:**

```gitignore
# OpenCode
.opencode/sessions/
.env
*.local.json
```

## 🔧 Troubleshooting

### Common Configuration Issues

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Config tidak生效 | Prioritas | Project-level override global |
| Variable substitution gagal | Env var tidak ada | Cek env var sudah diset |
| JSON parse error | Format salah | Pakai JSONC atau cek syntax |
| Pakai `providers` | Key salah | Harus `provider` (singular) |
| Provider tidak load | Ada di disabled list | Cek `disabled_providers` |
| Model tidak ditemukan | Provider tidak aktif | Cek provider config |
| Permission denied | Rule terlalu strict | Review permission rules |
| Plugin tidak load | Path salah | Cek plugin path |

### Debug Steps

```bash
# 1. Cek config yang aktif
opencode config show

# 2. Cek environment variables
echo $ANTHROPIC_API_KEY  # Linux/Mac
echo %ANTHROPIC_API_KEY% # Windows CMD
$env:ANTHROPIC_API_KEY   # PowerShell

# 3. Test koneksi provider
opencode test connection anthropic

# 4. Cek log
opencode --verbose
```

### Reset Config

```bash
# Reset ke default
rm ~/.config/opencode/opencode.json

# Atau rename untuk backup
mv ~/.config/opencode/opencode.json ~/.config/opencode/opencode.json.bak
```

## 📝 Ringkasan

1. **Lokasi dan prioritas** konfigurasi (7 level merge)
2. **Model config** (model, small_model, default_agent, fallback)
3. **Provider config** (options, multi-provider, whitelist/blacklist, proxy)
4. **Variable substitution** (env, file, security best practices)
5. **Theme dan UI** (tema, keybindings, layout)
6. **Permission system** (file, command, network, granular)
7. **Environment variables** (.env, secret management)
8. **Plugin system** (install, create, configure)
9. **Workspace management** (multiple projects, switching, context)
10. **Best practices** (security, performance, team sharing)
11. **Troubleshooting** (common issues, debug steps, reset)
