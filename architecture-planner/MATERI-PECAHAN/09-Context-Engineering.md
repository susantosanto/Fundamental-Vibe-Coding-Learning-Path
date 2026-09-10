## 9. CONTEXT ENGINEERING: RAHASIA TERBESAR

### 9.1 Apa Itu Context Engineering?

> **💡 Kutipan dari Anthropic:**
> *"Most best practices are based on one constraint: Claude's context window fills up fast, and performance degrades as it fills."*

**Context Engineering** adalah seni mengelola **apa informasi** yang diberikan ke AI, **kapan** informasi itu diberikan, dan **dalam format apa**.

### 9.2 Mengapa Context Window Itu Penting?

```
Context Window AI:
┌─────────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░ KAPASITAS TOTAL ░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░ (misal: 200K tokens) ░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└─────────────────────────────────────────────────────┘

Masalah:
- Setiap message, file yang dibaca, command output → mengisi context
- Satu debugging session bisa menghabiskan puluhan ribu tokens
- Semakin penuh context → AI semakin sering "lupa" dan membuat kesalahan
```

### 9.3 Perbandingan: Context Messy vs Context Clean

```
❌ VIBE CODING (Context Messy):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Chat 1: "Buat app inventaris" → AI menebak
Chat 2: "Tambahkan approval" → AI bingung konteks sebelumnya
Chat 3: "Eh salah, yang tadi" → Chat sudah terlalu panjang
Chat 4: "Dimana keputusan yang tadi?" → Tidak ada yang mencatat

Context window:
[████████████████████████████████] 100% PENUH!
→ AI mulai "lupa" instruksi awal
→ AI mulai improvisasi
→ Error semakin banyak

✅ ARCHITECT-BUILDER (Context Clean):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Architect Pack 001: Requirements + Blueprint + Acceptance
Architect Pack 002: Persis setelah Sprint 1 selesai
Architect Pack 003: Persis setelah Sprint 2 selesai

Context window per sprint:
[████████░░░░░░░░░░░░] 40% — Masih banyak ruang!
→ AI punya konteks yang tepat dan terkini
→ Tidak perlu "menggali" chat lama
→ Error berkurang drastis
```

### 9.4 Prinsip Context Engineering

| Prinsip | Penjelasan | Contoh |
|---------|-----------|--------|
| **Minimal Context** | Berikan hanya informasi yang dibutuhkan saat itu | Jangan upload seluruh codebase jika hanya butuh 1 file |
| **Right Time** | Informasi diberikan saat dibutuhkan | Requirements diberikan SEBELUM coding, bukan sesudah |
| **Structured** | Konteks diorganisir dalam folder/file | Gunakan folder system, bukan chat history |
| **Updated** | Konteks selalu diperbarui | Update STATE.MD setelah setiap sprint |
| **Traceable** | Setiap keputusan bisa ditelusuri | DECISIONS.MD mencatat semua keputusan |

### 9.5 Strategi Mengelola Context

> **💡 Kutipan dari Anthropic:**
> *"Use /clear frequently between tasks to reset the context window entirely."*

```
Strategi Mengelola Context:
═══════════════════════════════════════════════════

1. RESET ANTAR TASK
   Gunakan /clear (Claude Code) atau mulai chat baru (Codex)
   untuk setiap sprint yang berbeda

2. FILE-BASED CONTEXT
   Baca dari file (STATE.MD, DECISIONS.MD) bukan dari
   riwayat chat

3. PRIORITAS INFORMASI
   ┌─────────────────────────────────────────┐
   │ WAJIB BACA (setiap sesi):               │
   │ ├── AGENTS.MD                           │
   │ ├── STATE.MD                            │
   │ └── Sprint file yang aktif              │
   │                                         │
   │ BACA JIKA PERLU:                        │
   │ ├── DECISIONS.MD                        │
   │ ├── DOMAIN.MD                           │
   │ └── RISKS.MD                            │
   │                                         │
   │ BACA SAAT DIBUTUHKAN:                   │
   │ ├── docs/*                              │
   │ ├── QUESTIONS.MD                        │
   │ └── FILE-INVENTORY.MD                   │
   └─────────────────────────────────────────┘

4. GUNAKAN SUBAGENTS
   Untuk riset atau verifikasi, gunakan subagent
   yang berjalan di context terpisah

5. COMPACTION
   Jika session terlalu panjang, gunakan /compact
   untuk merangkum percakapan
═══════════════════════════════════════════════════
```

---

