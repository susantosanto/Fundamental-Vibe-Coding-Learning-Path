# 17: IDE Integration — Deep Dive

> **Pakai OpenCode langsung di VS Code, Cursor, Neovim, JetBrains, dan terminal multiplexer**

**Estimasi**: 15 menit belajar + 30 menit praktik | **Level**: Intermediate → Advanced

## 🎯 Outcome
- Install dan konfigurasi OpenCode di berbagai IDE
- Setup keybindings dan shortcuts yang efisien
- Konfigurasi external editor untuk `/editor` dan `/export`
- Integrasi debugging AI-assisted di IDE
- Setup LSP dan autocomplete dengan OpenCode context
- Build development environment lengkap untuk proyek sekolah

## 🖥️ Editor yang Disupport

| Editor | Support Level | Extension | Keterangan |
|--------|---------------|-----------|------------|
| **VS Code** | First-class | ✅ Official | Extension resmi, full integration |
| **Cursor** | First-class | ✅ Built-in | Fork VS Code, compatible |
| **Windsurf** | First-class | ✅ Built-in | AI-first IDE, compatible |
| **VSCodium** | First-class | ✅ Official | Open-source VS Code, compatible |
| **Neovim** | Via ACP | ⚠️ Plugin | ACP Protocol integration |
| **JetBrains** | Via ACP | ⚠️ Plugin | ACP Protocol integration |
| **Zed** | Via ACP | ⚠️ Plugin | ACP Protocol integration |
| **Emacs** | Via terminal | ⚠️ Manual | Terminal mode only |

> **Catatan**: VS Code, Cursor, dan Windsurf mendapat support penuh dengan extension resmi. Editor lain menggunakan ACP (Agent Communication Protocol) untuk integrasi.

---

## 📦 VS Code Integration — Setup Lengkap

### Instalasi Extension

#### Auto Install (Recommended)
1. Buka VS Code
2. Buka **Integrated Terminal** (`Ctrl+`` `) — BUKAN terminal external
3. Jalankan `opencode` → Extension otomatis terinstall

**Mengapa harus integrated terminal?**
- OpenCode detect VS Code environment dari process tree
- Extension di-install ke VS Code instance yang sedang running
- Terminal external tidak bisa trigger auto-install

#### Manual Install
1. Buka Extension Marketplace (`Ctrl+Shift+X`)
2. Cari "OpenCode"
3. Klik **Install**
4. Reload VS Code (`Ctrl+Shift+P` → `Developer: Reload Window`)

#### Install via Command Line
```bash
# Install extension secara manual
code --install-extension opencode.opencode

# Verify installation
code --list-extensions | grep opencode
```

### Konfigurasi Extension

#### Settings JSON
Buka VS Code Settings (`Ctrl+,`) → klik icon `{}` di kanan atas untuk buka `settings.json`:

```jsonc
{
  // OpenCode extension settings
  "opencode.terminal.autoStart": true,        // Auto-start OpenCode saat VS Code dibuka
  "opencode.terminal.name": "OpenCode",        // Nama terminal tab
  "opencode.terminal.location": "right",       // Lokasi panel: right, bottom, left
  "opencode.editor.insertFormat": "reference", // reference atau inline
  "opencode.keybindings.enabled": true,        // Enable default keybindings
  "opencode.model.default": "anthropic/claude-sonnet-4-20250514",
  "opencode.model.small": "anthropic/claude-haiku-4-5"
}
```

#### Settings Detail

| Setting | Type | Default | Keterangan |
|---------|------|---------|------------|
| `opencode.terminal.autoStart` | Boolean | `false` | Auto-start OpenCode saat VS Code dibuka |
| `opencode.terminal.name` | String | `"OpenCode"` | Nama yang tampil di terminal tab |
| `opencode.terminal.location` | String | `"right"` | Lokasi panel: `right`, `bottom`, `left` |
| `opencode.editor.insertFormat` | String | `"reference"` | Format insert: `reference` (`@file#L10-20`) atau `inline` (paste kode) |
| `opencode.keybindings.enabled` | Boolean | `true` | Enable default keybindings |
| `opencode.model.default` | String | Config default | Override model default |
| `opencode.model.small` | String | Config default | Override small model |

### Keybindings — Default dan Custom

#### Default Keybindings

| Fungsi | Windows/Linux | macOS | Command ID |
|--------|---------------|-------|------------|
| Buka panel | `Ctrl+Esc` | `Cmd+Esc` | `opencode.togglePanel` |
| Session baru | `Ctrl+Shift+Esc` | `Cmd+Shift+Esc` | `opencode.newSession` |
| Insert file reference | `Alt+Ctrl+K` | `Cmd+Option+K` | `opencode.insertFileReference` |

#### Custom Keybindings

Buka Keyboard Shortcuts (`Ctrl+K Ctrl+S`) → klik icon `{}` untuk buka `keybindings.json`:

```jsonc
[
  // Buka OpenCode dengan shortcut custom
  {
    "key": "ctrl+shift+o",
    "command": "opencode.togglePanel",
    "when": "editorTextFocus"
  },
  // Insert file reference dengan Alt+R
  {
    "key": "alt+r",
    "command": "opencode.insertFileReference",
    "when": "editorTextFocus"
  },
  // New session dengan Ctrl+Alt+N
  {
    "key": "ctrl+alt+n",
    "command": "opencode.newSession",
    "when": "editorTextFocus"
  },
  // Kirim seleksi ke OpenCode
  {
    "key": "ctrl+shift+s",
    "command": "opencode.sendSelection",
    "when": "editorHasSelection"
  }
]
```

### Auto-detect Seleksi Baris — Deep Dive

Extension otomatis detect baris yang diseleksi dan generate reference:

| Yang Diseleksi | Reference yang Dihasilkan | Keterangan |
|----------------|--------------------------|------------|
| Baris 10 | `@file.ts#L10` | 1 baris |
| Baris 10-20 | `@file.ts#L10-20` | Range |
| Tidak seleksi | `@file.ts` | Seluruh file |
| Multiple cursor | `@file.ts#L10,L15,L20` | Multiple lines |
| Selection di multiple file | `@file1.ts#L10-20` `@file2.ts#L5-15` | Multiple files |

**Workflow contoh**:
1. Buka `src/utils/helpers.ts`
2. Seleksi baris 15-25 (fungsi `calculateGrade`)
3. Tekan `Alt+Ctrl+K`
4. Input OpenCode otomatis terisi `@src/utils/helpers.ts#L15-25`
5. Ketik "Optimalkan fungsi ini, tambahkan error handling"
6. Enter → AI hanya lihat 10 baris yang diseleksi + context file

**Kenapa pakai line number, bukan paste kode?**
- AI lihat context lengkap (fungsi sekitar, type definitions, imports)
- Reference tetap akurat meski kode berubah (AI baca file terbaru)
- Hemat token, tidak perlu paste kode panjang
- AI bisa suggest perubahan spesifik dengan line number

### Multi-Root Workspace Support

Untuk proyek dengan multiple folders:

```jsonc
// .vscode/settings.json di workspace root
{
  "opencode.workspaceRoot": "${workspaceFolder}",
  "opencode.terminal.cwd": "${workspaceFolder}"
}
```

Ini memastikan OpenCode berjalan di root workspace yang benar.

---

## 🎯 Cursor Integration — Cursor-Specific Features

### Apa Itu Cursor?

Cursor adalah **AI-first code editor** yang merupakan fork dari VS Code. Karena berbasis VS Code, extension OpenCode compatible secara langsung.

### Instalasi di Cursor

1. Buka Cursor
2. Buka Extensions (`Ctrl+Shift+X`)
3. Cari "OpenCode"
4. Install dan reload

### Cursor-Specific Configuration

```jsonc
// Cursor settings.json
{
  // Disable Cursor's built-in AI untuk avoid conflict
  "cursor.ai.inlineSuggestions": false,

  // OpenCode sebagai primary AI
  "opencode.terminal.autoStart": true,
  "opencode.terminal.location": "right",

  // Gunakan Cursor's file picker untuk reference
  "opencode.editor.insertFormat": "reference"
}
```

### Cursor Best Practices

| Praktik | Alasan |
|---------|--------|
| Disable Cursor AI jika pakai OpenCode | Hindari conflict dan double token usage |
| Pakai OpenCode untuk task kompleks | Cursor AI bagus untuk quick fix, OpenCode untuk deep analysis |
| Gunakan `@file` reference di OpenCode | Lebih powerful dari Cursor's context |
| Custom commands di `.opencode/command/` | Reusable workflow yang Cursor AI tidak punya |

### Cursor + OpenCode Workflow

```
1. Tulis kode di Cursor (dengan Cursor AI untuk autocomplete)
2. Seleksi kode yang perlu review
3. Alt+Ctrl+K → insert reference ke OpenCode
4. Ketik /review → custom command trigger
5. OpenCode analyze dengan context lengkap
6. Apply suggestions di Cursor
```

---

## 🌿 Neovim Integration — Plugin Setup

### Plugin Installation

#### Lazy.nvim (Recommended)
```lua
-- ~/.config/nvim/lua/plugins/opencode.lua
return {
  -- OpenCode ACP integration via terminal
  {
    "anomalyco/opencode.nvim",
    lazy = false,
    config = function()
      require("opencode").setup({
        terminal = {
          auto_start = true,
          position = "right",    -- right, left, bottom, float
          size = 0.3,            -- 30% of window
        },
        keymaps = {
          toggle = "<C-e>",      -- Toggle OpenCode panel
          send_selection = "<leader>os",  -- Send selection
          insert_ref = "<leader>oi",      -- Insert file reference
        },
        editor = {
          insert_format = "reference",    -- reference atau inline
        },
      })
    end,
  },
}
```

#### Packer.nvim
```lua
-- ~/.config/nvim/init.lua
use({
  "anomalyco/opencode.nvim",
  config = function()
    require("opencode").setup({
      -- same config as above
    })
  end,
})
```

### Manual Setup (Tanpa Plugin)

Jika tidak ada plugin resmi, gunakan terminal integration:

```lua
-- ~/.config/nvim/lua/opencode.lua
local M = {}

-- Toggle OpenCode terminal
function M.toggle()
  vim.cmd("vsplit | terminal opencode")
  vim.cmd("set nonumber norelativenumber")
end

-- Send current file reference
function M.send_file_ref()
  local bufname = vim.api.nvim_buf_get_name(0)
  local relpath = vim.fn.fnamemodify(bufname, ":.")
  local ref = "@" .. relpath
  vim.fn.setreg("+", ref)  -- Copy to clipboard
  vim.notify("Copied: " .. ref, vim.log.levels.INFO)
end

-- Send selection reference
function M.send_selection_ref()
  local bufname = vim.api.nvim_buf_get_name(0)
  local relpath = vim.fn.fnamemodify(bufname, ":.")
  local start_line = vim.fn.line("v")
  local end_line = vim.fn.line(".")
  local ref = "@" .. relpath .. "#L" .. start_line
  if start_line ~= end_line then
    ref = ref .. "-" .. end_line
  end
  vim.fn.setreg("+", ref)
  vim.notify("Copied: " .. ref, vim.log.levels.INFO)
end

-- Keybindings
vim.keymap.set("n", "<C-e>", M.toggle, { desc = "Toggle OpenCode" })
vim.keymap.set("n", "<leader>of", M.send_file_ref, { desc = "Send file ref" })
vim.keymap.set("v", "<leader>os", M.send_selection_ref, { desc = "Send selection ref" })

return M
```

### LSP Integration dengan OpenCode

Neovim LSP + OpenCode = powerful combination:

```lua
-- ~/.config/nvim/lua/lsp/config.lua
local lspconfig = require("lspconfig")

-- Setup LSP untuk TypeScript
lspconfig.tsserver.setup({
  on_attach = function(client, bufnr)
    -- LSP capabilities
    local opts = { buffer = bufnr }

    -- Go to definition
    vim.keymap.set("n", "gd", vim.lsp.buf.definition, opts)
    -- Hover
    vim.keymap.set("n", "K", vim.lsp.buf.hover, opts)
    -- Rename
    vim.keymap.set("n", "<leader>rn", vim.lsp.buf.rename, opts)
    -- Code action
    vim.keymap.set("n", "<leader>ca", vim.lsp.buf.code_action, opts)

    -- OpenCode integration: send LSP diagnostics to AI
    vim.keymap.set("n", "<leader>od", function()
      local diagnostics = vim.diagnostic.get(bufnr)
      local msg = "Fix diagnostics in @" .. vim.fn.fnamemodify(vim.api.nvim_buf_get_name(bufnr), ":.")
      for _, d in ipairs(diagnostics) do
        msg = msg .. "\nLine " .. (d.lnum + 1) .. ": " .. d.message
      end
      vim.fn.setreg("+", msg)
      vim.notify("Diagnostics copied to clipboard", vim.log.levels.INFO)
    end, opts)
  end,
})
```

---

## 🧠 JetBrains Integration — Plugin dan Konfigurasi

### Plugin Installation

#### Via JetBrains Marketplace
1. Buka **Settings** (`Ctrl+Alt+S`)
2. Navigate ke **Plugins** → **Marketplace**
3. Cari "OpenCode"
4. Klik **Install**
5. Restart IDE

#### Manual Install
1. Download plugin dari [OpenCode JetBrains Plugin](https://plugins.jetbrains.com/plugin/opencode)
2. **Settings** → **Plugins** → ⚙️ → **Install Plugin from Disk**
3. Select `.zip` file
4. Restart IDE

### JetBrains-Specific Configuration

```jsonc
// .opencode/opencode.jsonc di project root
{
  "$schema": "https://opencode.ai/config.json",
  "editor": {
    "external": "idea --wait",  // IntelliJ IDEA
    // "external": "webstorm --wait",  // WebStorm
    // "external": "pycharm --wait",   // PyCharm
    "insertFormat": "reference"
  }
}
```

### IDE-Specific Features

| Fitur | IntelliJ IDEA | WebStorm | PyCharm |
|-------|---------------|----------|---------|
| File reference | ✅ `@file#L10-20` | ✅ | ✅ |
| Selection detection | ✅ | ✅ | ✅ |
| LSP integration | ✅ (built-in) | ✅ | ✅ |
| Terminal integration | ✅ | ✅ | ✅ |
| Code action → OpenCode | ✅ | ✅ | ✅ |

### JetBrains + OpenCode Workflow

```
1. Develop di JetBrains IDE (dengan built-in inspections)
2. Seleksi kode bermasalah (highlighted by IDE)
3. Copy reference via plugin shortcut
4. Paste ke OpenCode terminal
5. AI analyze dengan context LSP + selection
6. Apply fix di IDE
```

---

## 🖥️ Terminal Integration — Tmux dan Screen

### Tmux Integration

#### Setup Tmux Session dengan OpenCode

```bash
#!/bin/bash
# ~/.config/tmux/opencode-session.sh

# Create new tmux session
tmux new-session -d -s dev

# Split window: code di kiri, OpenCode di kanan
tmux split-window -h -p 35
tmux send-keys -t dev:0.1 "opencode" Enter

# Attach to session
tmux attach-session -t dev
```

#### Tmux Keybindings

Tambahkan ke `~/.tmux.conf`:

```tmux
# Toggle OpenCode pane
bind-key o run-shell 'tmux send-keys -t dev:0.1 "C-c" && tmux send-keys -t dev:0.1 "opencode" Enter'

# Send current file to OpenCode
bind-key f run-shell 'tmux send-keys -t dev:0.1 "@$(git rev-parse --show-toplevel 2>/dev/null || pwd)/$(pwd | sed "s|$(git rev-parse --show-toplevel 2>/dev/null || pwd)/||")"'
```

#### Tmux + OpenCode Workflow

```
┌─────────────────────────────────────────┐
│  Tmux Session: dev                      │
├──────────────────┬──────────────────────┤
│                  │                      │
│  Code Editor     │   OpenCode Terminal  │
│  (nvim/vim)      │                      │
│                  │   /review @file.ts   │
│  $ nvim src/     │   → AI response      │
│    main.ts       │                      │
│                  │   /commit            │
│                  │   → Commit message   │
│                  │                      │
└──────────────────┴──────────────────────┘
```

### GNU Screen Integration

```bash
# ~/.screenrc
# Split screen: code (70%) + OpenCode (30%)
screen -t code 0
screen -t opencode 1

# Auto-start OpenCode in window 1
select 1
stuff "opencode^M"
select 0
```

### Terminal Multiplexer Comparison

| Fitur | Tmux | Screen | Wezterm | Kitty |
|-------|------|--------|---------|-------|
| Session persistence | ✅ | ✅ | ✅ | ❌ |
| Pane splitting | ✅ | ✅ | ✅ | ✅ |
| Scriptable | ✅ | ✅ | ✅ | ✅ |
| OpenCode integration | ✅ Mudah | ✅ Mudah | ✅ Mudah | ✅ Mudah |
| Remote access | ✅ (detach/attach) | ✅ | ❌ | ❌ |

---

## ⚙️ Editor Configuration — Shared Settings

### VS Code Settings Sync

Untuk konsistensi antar mesin:

1. **Settings Sync** (`Ctrl+Shift+P` → `Preferences: Configure Settings Sync`)
2. Sign in dengan GitHub/Microsoft account
3. Pilih apa yang di-sync:
   - ✅ Settings
   - ✅ Keybindings
   - ✅ Extensions
   - ✅ Snippets
   - ✅ UI State

### Shared `.vscode/settings.json` untuk Tim

```jsonc
// .vscode/settings.json di project root
{
  // Editor
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.tabSize": 2,
  "editor.insertSpaces": true,

  // OpenCode
  "opencode.terminal.autoStart": true,
  "opencode.terminal.location": "right",
  "opencode.editor.insertFormat": "reference",
  "opencode.keybindings.enabled": true,

  // Files
  "files.exclude": {
    "**/.git": true,
    "**/node_modules": true,
    "**/.opencode/sessions": true
  },

  // Search
  "search.exclude": {
    "**/node_modules": true,
    "**/.opencode": true
  }
}
```

### Workspace Recommendations

```jsonc
// .vscode/extensions.json
{
  "recommendations": [
    "opencode.opencode",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next"
  ],
  "unwantedRecommendations": [
    // Extension yang tidak compatible dengan OpenCode
  ]
}
```

---

## 🐛 Debugging di IDE — AI-Assisted Debugging

### Breakpoint Integration

#### VS Code Debug Config + OpenCode

```jsonc
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug with OpenCode",
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "tsc: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "console": "integratedTerminal",
      "env": {
        "DEBUG": "true"
      }
    }
  ]
}
```

#### Workflow Debugging dengan AI

```
1. Set breakpoint di VS Code (F9)
2. Start debugging (F5)
3. Saat hit breakpoint, copy stack trace
4. Alt+Ctrl+K → insert reference ke OpenCode
5. Ketik: "Analyze this stack trace and suggest fix"
6. AI analyze dengan context kode di breakpoint
7. Apply suggestion, continue debugging
```

### Variable Inspection via OpenCode

Buat custom command untuk inspect variable:

`.opencode/command/debug/inspect.md`:
```markdown
---
description: Inspect variable value dan suggest fix
---

Variable inspection:

Name: $1
Expected value: $2
Actual value: $3
Context: @$4

Analisis:
1. Kenapa variable tidak sesuai expected?
2. Di mana value berubah (trace back)?
3. Bagaimana fix yang benar?
```

**Cara pakai**:
```
/debug/inspect userData undefined "null" src/services/user.ts#L45-60
```

### Step-Through Debugging dengan AI

Buat command untuk guide debugging:

`.opencode/command/debug/guide.md`:
```markdown
---
description: Pandu step-through debugging
agent: plan
---

Error yang terjadi:
$ARGUMENTS

Buat step-by-step debugging guide:
1. Di mana set breakpoint pertama
2. Variable apa yang perlu di-inspect di setiap breakpoint
3. Apa yang expected vs actual
4. Kapan step over vs step into
5. Common pitfall untuk error type ini

Sertakan command VS Code debug shortcut di setiap step.
```

---

## 🔌 Language Server Protocol (LSP) Integration

### LSP + OpenCode Architecture

```
┌─────────────────────────────────────────────┐
│                    IDE                       │
│  ┌──────────┐    ┌──────────┐               │
│  │  Editor   │───→│   LSP    │               │
│  │  (code)   │    │  Server  │               │
│  └──────────┘    └──────────┘               │
│       │                  │                   │
│       │    Diagnostics   │                   │
│       │    Definitions   │                   │
│       │    References    │                   │
│       ▼                  ▼                   │
│  ┌──────────────────────────────┐            │
│  │       OpenCode Terminal      │            │
│  │  @file#L10-20 + LSP context  │            │
│  │  → AI analysis + fix suggest │            │
│  └──────────────────────────────┘            │
└─────────────────────────────────────────────┘
```

### LSP Configuration untuk Berbagai Bahasa

#### TypeScript/JavaScript
```jsonc
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "javascript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "javascript.suggest.autoImports": true
}
```

#### Python
```jsonc
{
  "python.languageServer": "Pylance",
  "python.analysis.typeCheckingMode": "strict",
  "python.analysis.autoImportCompletions": true,
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true
}
```

#### Go
```jsonc
{
  "go.useLanguageServer": true,
  "gopls": {
    "ui.semanticToken": true,
    "completeUnimported": true,
    "staticcheck": true
  }
}
```

#### Rust
```jsonc
{
  "rust-analyzer.checkOnSave.command": "clippy",
  "rust-analyzer.inlayHints.enable": true,
  "rust-analyzer.procMacro.enable": true
}
```

### Autocomplete dengan OpenCode Context

Buat custom command untuk autocomplete suggestion:

`.opencode/command/autocomplete.md`:
```markdown
---
description: Suggest autocomplete untuk kode
---

Lengkapi kode berikut:

@${1:file_path}#L${2:line_number}

Context:
- Bahasa: $3
- Framework: $4
- Pattern yang digunakan: $5

Berikan 3 opsi completion dengan penjelasan pro/kontra masing-masing.
```

### Go-to-Definition + OpenCode

Workflow:
1. `F12` → Go to definition di VS Code
2. Lihat implementasi function
3. `Alt+Ctrl+K` → insert reference function ke OpenCode
4. Ketik "Jelaskan cara kerja function ini dan apakah ada bug"
5. AI analyze dengan context full implementation

---

## 🏫 Real-World: Setup Development Environment untuk Proyek Sekolah

### Arsitektur Proyek

```
sdn-pasirhalang-admin/
├── .opencode/
│   ├── opencode.jsonc           # OpenCode config
│   ├── AGENTS.md                # Project context
│   └── command/                 # Custom commands
│       ├── sekolah/
│       │   ├── generate-lpj.md
│       │   ├── check-dapodik.md
│       │   ├── export-arkas.md
│       │   └── send-reminder.md
│       ├── git/
│       │   ├── commit.md
│       │   └── changelog.md
│       └── debug/
│           ├── inspect.md
│           └── guide.md
│
├── .vscode/
│   ├── settings.json            # VS Code settings
│   ├── extensions.json          # Recommended extensions
│   ├── keybindings.json         # Custom keybindings
│   └── launch.json              # Debug config
│
├── src/
│   ├── index.ts                 # Main entry
│   ├── services/
│   │   ├── dapodik.ts           # Dapodik integration
│   │   ├── arkas.ts             # ARKAS integration
│   │   └── bos.ts               # BOS reporting
│   ├── models/
│   │   ├── student.ts           # Student model
│   │   ├── teacher.ts           # Teacher model
│   │   └── finance.ts           # Finance model
│   └── utils/
│       ├── excel.ts             # Excel export
│       └── pdf.ts               # PDF generation
│
├── tests/
│   ├── services/
│   │   ├── dapodik.test.ts
│   │   └── arkas.test.ts
│   └── utils/
│       └── excel.test.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

### Step-by-Step Setup

#### Step 1: Inisialisasi Proyek
```bash
# Buat project
mkdir sdn-pasirhalang-admin && cd sdn-pasirhalang-admin

# Init npm + TypeScript
npm init -y
npm install typescript @types/node --save-dev
npx tsc --init

# Install dependencies
npm install express sqlite3 xlsx pdfkit
npm install -D jest ts-jest @types/jest
```

#### Step 2: Setup OpenCode
```bash
# Buat folder config
mkdir -p .opencode/command/sekolah
mkdir -p .opencode/command/git
mkdir -p .opencode/command/debug

# Buat opencode.jsonc
cat > .opencode/opencode.jsonc << 'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-20250514",
  "small_model": "anthropic/claude-haiku-4-5",
  "default_agent": "build",
  "mcp": {
    "filesystem": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem", "."]
    },
    "sequential-thinking": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
EOF
```

#### Step 3: Setup VS Code
```bash
# Buat .vscode folder
mkdir -p .vscode

# settings.json
cat > .vscode/settings.json << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.tabSize": 2,
  "opencode.terminal.autoStart": true,
  "opencode.terminal.location": "right",
  "opencode.editor.insertFormat": "reference",
  "opencode.keybindings.enabled": true,
  "typescript.preferences.importModuleSpecifier": "relative",
  "files.exclude": {
    "**/node_modules": true,
    "**/.opencode/sessions": true
  }
}
EOF

# extensions.json
cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "opencode.opencode",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode"
  ]
}
EOF
```

#### Step 4: Buat Custom Commands

```markdown
<!-- .opencode/command/sekolah/generate-lpj.md -->
---
description: Generate LPJ BOS
agent: build
---

Generate Laporan Pertanggungjawaban BOS SD Negeri Pasirhalang.
Periode: $1

Struktur:
1. Pendahuluan
2. Perencanaan (RKAS)
3. Realisasi (penerimaan + pengeluaran)
4. Pencapaian program
5. Hambatan dan solusi
6. Penutup
```

```markdown
<!-- .opencode/command/sekolah/check-dapodik.md -->
---
description: Cek status Dapodik
---

Cek status Dapodik service:
!`curl -s http://localhost:5774/api/status 2>&1 || echo "Dapodik tidak running"`

Analisis status dan beri rekomendasi.
```

```markdown
<!-- .opencode/command/git/commit.md -->
---
description: Smart commit
---

Generate commit message:
!`git diff --staged`

Format: Conventional Commits. Jelaskan "kenapa" bukan "apa".
```

#### Step 5: Setup AGENTS.md

```markdown
<!-- .opencode/AGENTS.md -->
# SD Negeri Pasirhalang Admin System

## Project Context
- Sekolah: SD Negeri Pasirhalang
- NPSN: 20246040
- Alamat: Desa Mandalamukti, Kec. Cikalongwetan, Kab. Bandung Barat
- Provinsi: Jawa Barat

## Tech Stack
- TypeScript + Node.js
- Express.js (API)
- SQLite (Database)
- XLSX (Excel export)
- PDFKit (PDF generation)

## Domain Knowledge
- Dapodik: Data Pokok Pendidikan (PD, GTK, Sarpras, Rombel)
- ARKAS: Aplikasi Rencana Kegiatan dan Anggaran Sekolah
- BOS: Bantuan Operasional Sekolah
- LPJ: Laporan Pertanggungjawaban

## Custom Commands
- `/sekolah/generate-lpj` - Generate LPJ BOS
- `/sekolah/check-dapodik` - Cek status Dapodik
- `/sekolah/export-arkas` - Export data ARKAS
- `/sekolah/send-reminder` - Buat template reminder
- `/git/commit` - Smart commit
```

#### Step 6: Setup Debug Configuration

```jsonc
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "tsc: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "console": "integratedTerminal"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal"
    }
  ]
}
```

#### Step 7: Setup Tasks

```jsonc
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "tsc: build",
      "type": "typescript",
      "tsconfig": "tsconfig.json",
      "problemMatcher": ["$tsc"],
      "group": "build"
    },
    {
      "label": "npm: test",
      "type": "npm",
      "script": "test",
      "problemMatcher": [],
      "group": "test"
    },
    {
      "label": "npm: dev",
      "type": "npm",
      "script": "dev",
      "isBackground": true,
      "problemMatcher": {
        "pattern": {
          "regexp": "^.*$"
        },
        "background": {
          "activeOnStart": true,
          "beginsPattern": "Starting server",
          "endsPattern": "Server running"
        }
      }
    }
  ]
}
```

### Final Environment Check

```bash
# Verify semua setup
echo "=== Project Structure ==="
find . -maxdepth 3 -not -path "*/node_modules/*" -not -path "*/.git/*" | head -30

echo "=== OpenCode Config ==="
cat .opencode/opencode.jsonc

echo "=== VS Code Extensions ==="
code --list-extensions | grep -E "opencode|eslint|prettier"

echo "=== TypeScript Check ==="
npx tsc --noEmit

echo "=== Test Run ==="
npm test

echo "=== Setup Complete ==="
echo "Run 'opencode' untuk memulai AI coding session"
```

### Daily Workflow

```
PAGI:
1. Buka VS Code → OpenCode auto-start
2. /git/status → cek perubahan kemarin
3. /git/commit → commit perubahan

SIANG:
4. Develop feature baru
5. Ctrl+Esc → buka OpenCode panel
6. Seleksi kode → Alt+Ctrl+K → insert reference
7. Tanya AI: "Refactor fungsi ini"
8. Apply suggestion

SORE:
9. /test/run → jalankan test
10. /sekolah/generate-lpj "Semester 1 2025/2026" → generate laporan
11. /git/commit → commit akhir hari
```

---

## ⚠️ Troubleshooting — Lengkap

### VS Code Issues

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Extension tidak auto-install | Bukan integrated terminal | Jalankan `opencode` di terminal bawaan VS Code (`Ctrl+`` `) |
| Shortcut tidak jalan | Konflik keybinding | Cek `Ctrl+K Ctrl+S`, ubah yang konflik |
| Panel tidak muncul | Extension tidak loaded | Reload window (`Ctrl+Shift+P` → `Developer: Reload Window`) |
| File reference salah format | Settings `insertFormat` | Set ke `"reference"` di settings |

### Cursor Issues

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Cursor AI conflict | Kedua AI aktif bersamaan | Disable Cursor AI di settings |
| Extension tidak compatible | Cursor version outdated | Update Cursor ke versi terbaru |

### Neovim Issues

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Plugin tidak load | Lazy.nvim config error | Cek `:Lazy` untuk error |
| Terminal tidak split | Tmux tidak install | Install tmux atau pakai native split |
| LSP tidak connect | LSP server tidak running | `:LspInfo` untuk debug |

### JetBrains Issues

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Plugin tidak muncul | Marketplace belum sync | Restart IDE, cek marketplace |
| External editor tidak jalan | EDITOR env var | Set `export EDITOR="idea --wait"` |
| Terminal integration gagal | Terminal path salah | Cek terminal path di settings |

### Terminal Multiplexer Issues

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Tmux session tidak persist | Session tidak saved | Pakai `tmux-resurrect` plugin |
| OpenCode tidak start di tmux | PATH issue | Gunakan full path: `/usr/local/bin/opencode` |
| Screen tidak split | Screen config error | Cek `.screenrc` syntax |

---

## 📝 Ringkasan

1. **VS Code**: Extension official, keybindings, auto-detect selection, multi-root workspace
2. **Cursor**: Compatible via VS Code extension, disable Cursor AI untuk avoid conflict
3. **Neovim**: Plugin setup (Lazy.nvim), manual terminal integration, LSP integration
4. **JetBrains**: Plugin dari marketplace, IDE-specific config, LSP built-in
5. **Terminal**: Tmux/Screen integration, session management, keybindings
6. **Shared config**: VS Code Settings Sync, `.vscode/settings.json` untuk tim
7. **Debugging**: Breakpoint integration, variable inspection, step-through guide
8. **LSP**: Language server config per bahasa, autocomplete, go-to-definition
9. **Real-world**: Setup lengkap untuk proyek administrasi sekolah
10. **Troubleshooting**: Editor-specific issue resolution

**Referensi**:
- [vbgate/learn-opencode](https://github.com/vbgate/learn-opencode) — IDE Integration module
- [OpenCode Documentation](https://opencode.ai) — VS Code Extension reference
- [OpenCode GitHub](https://github.com/anomalyco/opencode) — Source code dan examples
- [ACP Protocol](https://agentcommunicationprotocol.dev) — Agent Communication Protocol spec
