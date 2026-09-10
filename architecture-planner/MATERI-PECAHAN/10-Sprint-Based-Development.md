## 10. SPRINT-BASED DEVELOPMENT

### 10.1 Apa Itu Sprint?

**Sprint** adalah unit pekerjaan terkecil dalam metode ini. Setiap sprint memiliki:
- **Awal yang jelas** — Apa yang akan dikerjakan
- **Akhir yang jelas** — Kapan sprint dianggap selesai
- **Kriteria keberhasilan** — Bagaimana menilai sprint berhasil
- **Deliverable yang konkret** — Apa yang dihasilkan

### 10.2 Struktur Sprint

```
╔═══════════════════════════════════════════════════════╗
║  SPRINT N                                             ║
╠═══════════════════════════════════════════════════════╣
║  📋 Nama: [Nama Sprint]                               ║
║  🎯 Tujuan: [Apa yang ingin dicapai]                  ║
║  📊 Status: [Belum dimulai / Berjalan / Selesai]      ║
║  📅 Tanggal: [Mulai - Selesai]                        ║
╠═══════════════════════════════════════════════════════╣
║                                                        ║
║  1. 📄 REQUIREMENTS (Apa & Mengapa)                    ║
║     ├── Definisi masalah                               ║
║     ├── Pengguna yang terdampak                        ║
║     └── Output yang diharapkan                         ║
║                                                        ║
║  2. 📐 BLUEPRINT (Bagaimana)                           ║
║     ├── Arsitektur teknis                              ║
║     ├── File yang akan dibuat/diubah                   ║
║     ├── Dependensi yang diperlukan                     ║
║     └── Rencana implementasi                           ║
║                                                        ║
║  3. ✅ ACCEPTANCE (Kriteria Selesai)                   ║
║     ├── Checklist yang harus terpenuhi                 ║
║     ├── Test cases                                     ║
║     └── Output yang bisa didemonstrasikan              ║
║                                                        ║
║  4. 🤝 HANDOFF PROMPT                                  ║
║     └── Prompt lengkap untuk builder                   ║
║                                                        ║
╚═══════════════════════════════════════════════════════╝
```

### 10.3 Contoh Rencana Sprint untuk Proyek Dashboard

```
SPRINT 001: Discovery & Architecture Planning
─────────────────────────────────────────────
Tujuan: Memahami masalah dan membuat rencana awal
Output: Architect Pack pertama, folder structure
Kriteria: Semua pertanyaan terjawab, rencana tersusun
Durasi: 1-2 hari

SPRINT 002: Sample Bundle (Proof of Concept)
─────────────────────────────────────────────
Tujuan: Membuat prototype pertama yang bisa dilihat
Output: HTML dashboard + newsletter contoh
Kriteria: Output bisa dibuka di browser, data dummy tampil
Durasi: 2-3 hari

SPRINT 003: Executive Output Polish
─────────────────────────────────────────────
Tujuan: Menyempurnakan output agar siap presentasi
Output: Dashboard & newsletter versi final
Kriteria: Format profesional, data akurat
Durasi: 2-3 hari

SPRINT 004: Data Integration
─────────────────────────────────────────────
Tujuan: Menghubungkan dengan data Excel real
Output: Sistem parsing Excel yang berfungsi
Kriteria: Berhasil parse semua 5 spreadsheet
Durasi: 3-4 hari

SPRINT 005: Testing & Refinement
─────────────────────────────────────────────
Tujuan: Memastikan semua berfungsi dengan benar
Output: Hasil test, bug fixes
Kriteria: Semua test passing, tidak ada error kritis
Durasi: 2-3 hari

SPRINT 006: Deployment & Documentation
─────────────────────────────────────────────
Tujuan: Menyiapkan untuk produksi
Output: Deployed app + dokumentasi
Kriteria: Bisa diakses oleh pengguna akhir
Durasi: 1-2 hari
```

### 10.4 Alur Kerja Detail per Sprint

```
┌─────────────────────────────────────────────────────────────┐
│                ALUR KERJA DETAIL PER SPRINT                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  PHASE A: ARCHITECT WORK                                      │
│  ─────────────────────                                        │
│  1. Architect membuat Architect Pack                          │
│     ├── Requirements.MD                                       │
│     ├── Blueprint.MD                                          │
│     ├── Acceptance.MD                                         │
│     └── Handoff-Prompt.MD                                     │
│  2. Save pack di root folder proyek                           │
│  3. Update planning/sprints/sprint-XXX/                       │
│       ↓                                                       │
│  PHASE B: BUILDER SETUP                                       │
│  ────────────────────                                         │
│  4. Buka Builder (Codex/Claude Code)                          │
│  5. Mulai chat baru                                           │
│  6. Rename: "Sprint XXX - [Nama Sprint]"                     │
│  7. Arahkan ke folder proyek                                  │
│       ↓                                                       │
│  PHASE C: DRY RUN                                             │
│  ──────────────                                               │
│  8. Paste prompt dari Handoff-Prompt.MD                       │
│  9. Builder membaca architect pack                            │
│  10. Builder melakukan dry run                                │
│  11. Builder melapor rencana implementasi                     │
│       ↓                                                       │
│  PHASE D: REVIEW DRY RUN                                      │
│  ────────────────────                                         │
│  12. Anda review rencana builder                              │
│  13. Jika ada masalah → Minta perbaikan                       │
│  14. Jika sudah OK → Approve                                  │
│       ↓                                                       │
│  PHASE E: IMPLEMENTASI                                        │
│  ───────────────────                                          │
│  15. Builder mulai coding                                     │
│  16. Builder menulis test                                     │
│  17. Builder menjalankan test                                 │
│  18. Builder memperbaiki error                                │
│       ↓                                                       │
│  PHASE F: LAPOR HASIL                                        │
│  ──────────────────                                           │
│  19. Builder melapor hasil                                    │
│     ├── Files yang dibuat                                     │
│     ├── Test results                                          │
│     ├── Output files                                          │
│     └── Known limitations                                     │
│       ↓                                                       │
│  PHASE G: REVIEW & VALIDATE                                   │
│  ────────────────────────                                     │
│  20. Anda review output                                       │
│  21. Architect sanity check                                   │
│  22. Update STATE.MD                                          │
│  23. Update DECISIONS.MD jika ada keputusan baru              │
│       ↓                                                       │
│  PHASE H: PERSIAPAN SPRINT BERIKUTNYA                         │
│  ──────────────────────────────────                           │
│  24. Architect membuat pack baru                              │
│  25. Ulangi dari Phase B                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

