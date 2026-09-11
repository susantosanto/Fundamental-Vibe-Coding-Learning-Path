# Scaffold Structure (Bab 6.1)

Create exactly this structure. No additions, no removals.

```
<NAMA_PROYEK>/
│
├── AGENTS.MD                    # Router utama — baca PERTAMA
├── CLAUDE.MD                    # Config untuk Claude Code
├── CODEX.MD                     # Config untuk OpenAI Codex
├── README.MD                    # Overview untuk manusia
│
├── docs/
│   ├── ARCHITECTURE.MD
│   ├── DATA-MODEL.MD
│   ├── API.MD
│   ├── PERMISSIONS.MD
│   └── VALIDATION.MD
│
├── planning/
│   ├── meetings/
│   └── sprints/
│       └── sprint-001/          # directory only — diisi /sprint-planner
│
├── STATE.MD
├── DECISIONS.MD
├── DOMAIN.MD
├── RISKS.MD
├── QUESTIONS.MD
├── FILE-INVENTORY.MD
│
├── references/
├── src/
├── architect-packs/
│
└── .claude/
    ├── settings.json
    ├── skills/
    ├── agents/
    └── hooks/
```

## File templates (minimum content)

### AGENTS.MD

```markdown
# AGENTS.MD — Router Utama

## Model Operasi
- Metode Architect-Builder (folder = source of truth, bukan chat history)
- Architect: ChatGPT/Claude — Builder: <tool yang dipakai user>

## File yang Harus Dibaca (urutan wajib)
1. AGENTS.MD (file ini)
2. STATE.MD (status terkini)
3. DECISIONS.MD (keputusan yang sudah dibuat)
4. DOMAIN.MD (konteks bisnis)
5. Pack sprint aktif (planning/sprints/sprint-XXX/)

## Aturan Builder
- JANGAN mulai coding tanpa architect pack
- SELALU dry run dulu → laporkan rencana → TUNGGU persetujuan
- SELALU berikan bukti (test output asli, screenshot)
- JANGAN mengubah requirements tanpa persetujuan
- JANGAN pakai library yang tidak ada di BLUEPRINT.MD

## Workflow
1. Baca architect pack sprint aktif
2. Dry run → lapor hasil
3. Disetujui → coding + test
4. Selesai → lapor hasil dengan bukti
```

### STATE.MD

```markdown
# STATE.MD — Status Proyek

## Informasi Proyek
- Nama: <nama>
- Mulai: <tanggal>

## Status Saat Ini
- Sprint Aktif: (belum ada)
- Status: Perencanaan awal
- Terakhir Diperbarui: <tanggal>

## Riwayat Sprint
| Sprint | Nama | Status | Tanggal |
|--------|------|--------|---------|

## Langkah Selanjutnya
- Jalankan /idea-clarifier

## Blockers
- (tidak ada)
```

### DECISIONS.MD

```markdown
# DECISIONS.MD — Log Keputusan

## Format
[YYYY-MM-DD] Keputusan: <apa>
  Status: proposed | accepted | superseded
  Alasan: <mengapa>
  Dibuat oleh: <siapa>
  Dampak: <apa yang berubah>
```

### DOMAIN.MD

```markdown
# DOMAIN.MD — Domain Bisnis

## Tentang <perusahaan/user>
## Terminologi Penting
## Pengguna Sistem
## Aturan Bisnis
## Pain Points
```

### RISKS.MD

```markdown
# RISKS.MD — Daftar Risiko

## Format
⚠️ [Kemungkinan: Tinggi/Sedang/Rendah] RISIKO: <deskripsi>
  Dampak: <Tinggi/Sedang/Rendah>
  Mitigasi: <solusi>
```

### QUESTIONS.MD

```markdown
# QUESTIONS.MD — Pertanyaan Terbuka

## Format
❓ [OPEN] Pertanyaan: <isi>
  Ditanya: <tanggal> | Dari: <siapa> | Status: Menunggu jawaban
✅ [CLOSED] Pertanyaan: <isi> — Jawaban: <isi> — Ditutup: <tanggal>
```

### FILE-INVENTORY.MD

```markdown
# FILE-INVENTORY.MD

| File | Sumber | Format | Catatan |
|------|--------|--------|---------|
```

### docs/* (each of the five)

```markdown
# <JUDUL>
(Masih kosong — diisi oleh skill perencanaan yang relevan.)
```
