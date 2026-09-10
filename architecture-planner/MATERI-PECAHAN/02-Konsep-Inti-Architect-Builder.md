## 2. KONSEP INTI: ARCHITECT-BUILDER METHOD

### 2.1 Apa Itu Architect-Builder Method?

Metode **Architect-Builder** adalah pendekatan terstruktur di mana peran dibagi menjadi dua:

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│   🏛️ ARCHITECT (Perencana)                                    │
│   ┌─────────────────────────────────────┐                    │
│   │  Tools: ChatGPT / Claude (LLM)      │                    │
│   │                                      │                    │
│   │  Tugas:                              │                    │
│   │  • Brainstorming & klarifikasi ide   │                    │
│   │  • Membuat requirements              │                    │
│   │  • Merancang blueprint               │                    │
│   │  • Mendefinisikan acceptance criteria│                    │
│   │  • Review & sanity check hasil       │                    │
│   │  • Membuat architect pack            │                    │
│   └──────────────────┬──────────────────┘                    │
│                      │                                        │
│              Handoff (via Folder)                              │
│                      │                                        │
│   🔨 BUILDER (Pelaksana)                                      │
│   ┌──────────────────┴──────────────────┐                    │
│   │  Tools: Codex / Claude Code / Cursor │                    │
│   │                                      │                    │
│   │  Tugas:                              │                    │
│   │  • Membaca architect pack            │                    │
│   │  • Dry run (simulasi)                │                    │
│   │  • Implementasi kode                 │                    │
│   │  • Menulis test                      │                    │
│   │  • Memperbarui folder proyek         │                    │
│   │  • Melaporkan hasil ke architect     │                    │
│   └─────────────────────────────────────┘                    │
│                                                               │
│   📁 SOURCE OF TRUTH: Folder Proyek                           │
│   (Bukan chat history!)                                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Mengapa Metode Ini Bekerja?

> **💡 Kutipan dari 120x.ai:**
> *"The answer was not more context. The answer was to get cleaner context."*

Metode ini bekerja karena:

1. **Architect Layer** memastikan semua pertanyaan dijawab SEBELUM coding dimulai
2. **Builder Layer** mendapat rencana yang spesifik, bukan tebakan
3. **Folder System** menjadi source of truth yang terstruktur
4. **Sprint-based approach** memecah proyek besar menjadi bagian kecil
5. **Review loop** memastikan kualitas di setiap tahap

---

