# 🐑 Panduan Lengkap Herdr — Terminal Workspace Manager untuk AI Coding Agents

> **Versi:** 0.6.8-preview  
> **Website:** [https://herdr.dev](https://herdr.dev)  
> **GitHub:** [https://github.com/ogulcancelik/herdr](https://github.com/ogulcancelik/herdr)

---

## 📋 Daftar Isi

1. [Apa Itu Herdr?](#apa-itu-herdr)
2. [Instalasi](#instalasi)
3. [Quick Start](#quick-start)
4. [Konsep Dasar](#konsep-dasar)
5. [CLI Commands Reference](#cli-commands-reference)
6. [Keybindings](#keybindings)
7. [Agent Awareness & Integrations](#agent-awareness--integrations)
8. [Konfigurasi](#konfigurasi)
9. [Remote Usage](#remote-usage)
10. [Update](#update)
11. [Tips & Tricks](#tips--tricks)
12. [Troubleshooting](#troubleshooting)

---

## Apa Itu Herdr?

**Herdr** adalah *terminal workspace manager* yang dirancang khusus untuk mengelola dan mengorkestrasi berbagai AI coding agent. Berbeda dengan `tmux` yang dibuat sebelum era AI agents, herdr menggabungkan:

- **Persistent sessions** — pane processes tetap berjalan meskipun client terputus
- **Agent awareness** — sidebar menunjukkan status agent (blocked, working, done, idle)
- **Mouse-native** — klik, drag, split panel dengan mouse
- **Real terminal views** — Anda melihat terminal agent yang asli
- **Socket API** — agents dapat membuat workspace secara programatis
- **Lightweight binary** — single Rust binary, tanpa dependensi

### Perbandingan dengan Tools Lain

| Fitur | tmux | GUI Managers | herdr |
|-------|------|-------------|-------|
| Persistent sessions |  | — |  |
| Detach / reattach |  | — |  |
| Panes, tabs, workspaces |  |  |  |
| Agent awareness | — |  |  |
| Lives in your terminal |  | — |  |
| Real terminal views |  | — |  |
| Mouse-native | — |  |  |
| Lightweight binary |  | — |  |
| Agents can orchestrate | ? | ? |  |

---

## Instalasi

### Windows (Preview Beta)

```powershell
powershell -ExecutionPolicy Bypass -c "irm https://herdr.dev/install.ps1 | iex"
```

### Linux / macOS

```bash
curl -fsSL https://herdr.dev/install.sh | sh
```

### Homebrew

```bash
brew install herdr
```

### Mise

```bash
mise use -g herdr
```

> **Note Windows:** Setelah instalasi, pastikan `herdr` sudah di PATH.
> Tambahkan ke `~/.bashrc`:
> ```bash
> export PATH="$HOME/.herdr/packages/standalone/current:$PATH"
> ```

---

## Quick Start

### 1. Mulai Herdr

```bash
cd ~/proyek-anda
herdr
```

### 2. Command Dasar dalam Herdr

| Aksi | Keybinding |
|------|------------|
| Buat tab baru | `prefix` + `c` |
| Buat workspace baru | `prefix` + `Shift` + `n` |
| Split pane vertikal | `prefix` + `v` |
| Split pane horizontal | `prefix` + `minus` (-) |
| Tutup pane | `prefix` + `x` |
| Navigasi pane | `prefix` + `h/j/k/l` |
| Toggle sidebar | `prefix` + `b` |
| Detach client | `prefix` + `q` |
| Navigasi workspace | `prefix` + `w` |
| Zoom pane | `prefix` + `z` |

> **Default prefix:** `Ctrl+b`

### 3. Menjalankan Agent

```bash
claude
opencode
codex
```

Sidebar herdr otomatis mendeteksi status agent.

### 4. Detach & Reattach

```bash
# Detach
prefix + q

# Reattach
herdr
```

---

## Konsep Dasar

### Server & Client

**Server** — proses background yang mengelola semua pane

**Client** — terminal UI yang terhubung ke server

```bash
prefix + q       # detach (client tertutup)
herdr server stop  # stop server
herdr              # start ulang
```

### Named Sessions

```bash
herdr --session proyek-a
herdr session list
herdr session stop proyek-a
herdr session delete proyek-a
```

### Workspaces, Tabs, Panes

```
Session
  Workspace (level proyek)
    Tab (grup pane)
      Pane (proses terminal nyata)
```

