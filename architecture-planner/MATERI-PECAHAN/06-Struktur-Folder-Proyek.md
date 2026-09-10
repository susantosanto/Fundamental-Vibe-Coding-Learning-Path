## 6. STRUKTUR FOLDER PROYEK (SCAFFOLD)

### 6.1 Struktur Folder Lengkap

```
📁 NAMA_PROYEK/
│
├── 📄 AGENTS.MD                    ← Router utama (BAKA PERTAMA!)
├── 📄 CLAUDE.MD                    ← Config untuk Claude Code
├── 📄 CODEX.MD                     ← Config untuk OpenAI Codex
├── 📄 README.MD                    ← Overview untuk manusia
│
├── 📁 docs/                          ← Dokumentasi teknis tahan lama
│   ├── 📄 ARCHITECTURE.MD           ← Peta sistem & komponen
│   ├── 📄 DATA-MODEL.MD             ← Model data & relasi
│   ├── 📄 API.MD                    ← Endpoint & integrasi
│   ├── 📄 PERMISSIONS.MD            ← Role & aturan akses
│   └── 📄 VALIDATION.MD             ← Cara validasi sistem
│
├── 📁 planning/                      ← Semua perencanaan
│   ├── 📁 meetings/                 ← Catatan rapat
│   ├── 📁 sprints/                  ← Detail per sprint
│   │   ├── 📁 sprint-001/
│   │   │   ├── 📄 REQUIREMENTS.MD
│   │   │   ├── 📄 BLUEPRINT.MD
│   │   │   ├── 📄 ACCEPTANCE.MD
│   │   │   └── 📄 HANDOFF-PROMPT.MD
│   │   ├── 📁 sprint-002/
│   │   └── 📁 sprint-003/
│   └── 📄 ...
│
├── 📄 STATE.MD                       ← Status saat ini (DIPERBARUI TERUS)
├── 📄 DECISIONS.MD                   ← Log keputusan
├── 📄 DOMAIN.MD                      ← Domain bisnis
├── 📄 RISKS.MD                       ← Daftar risiko
├── 📄 QUESTIONS.MD                   ← Pertanyaan terbuka
├── 📄 FILE-INVENTORY.MD              ← Inventaris file sumber
│
├── 📁 references/                    ← File referensi (PDF, Excel, dll)
├── 📁 src/                           ← Kode sumber (dibuat oleh builder)
├── 📁 architect-packs/               ← Output dari architect
│
└── 📁 .claude/                       ← Konfigurasi Claude Code
    ├── 📄 settings.json
    ├── 📁 skills/                    ← Skills reusable
    ├── 📁 agents/                    ← Subagents
    └── 📁 hooks/                     ← Automation hooks
```

### 6.2 Mengapa Folder System Ini Penting?

> **💡 Kutipan dari Chris Titus Tech:**
> *"Do not get distracted by the terminology. These are plain-text files."*

Folder system ini berfungsi sebagai:

```
┌─────────────────────────────────────────────────┐
│        MANFAAT FOLDER SYSTEM                      │
├─────────────────────────────────────────────────┤
│                                                   │
│  1. 📋 SOURCE OF TRUTH                            │
│     Bukan chat history, tapi folder yang jadi     │
│     acuan utama seluruh proyek                    │
│                                                   │
│  2. 🧠 CONTEXT ENGINEERING                        │
│     Memberikan informasi yang tepat pada waktu     │
│     yang tepat kepada AI                          │
│                                                   │
│  3. 🤝 HANDOFF MECHANISM                          │
│     Cara "menyerahkan" pekerjaan dari architect   │
│     ke builder dengan jelas                       │
│                                                   │
│  4. 📚 KNOWLEDGE BASE                             │
│     Seluruh pengetahuan proyek tersentralisasi     │
│     dan terorganisir                              │
│                                                   │
│  5. 🔍 AUDIT TRAIL                                 │
│     Jejak keputusan dan perubahan bisa ditelusuri  │
│                                                   │
│  6. 👥 ONBOARDING TOOL                             │
│     Siapa saja bisa paham proyek dengan membaca    │
│     folder ini                                    │
│                                                   │
│  7. 🔄 SCALABILITY                                 │
│     Proyek bisa berkembang tanpa kehilangan        │
│     konteks                                       │
│                                                   │
└─────────────────────────────────────────────────┘
```

---

