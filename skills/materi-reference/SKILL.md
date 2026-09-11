---
name: materi-reference
description: >-
  Router to the authoritative Architect-Builder course material in
  D:\Programming\fundamental-vibe-coding\architecture-planner\MATERI-PECAHAN\
  (Bab 1-26). Use BEFORE and DURING every skill in the pipeline
  (scaffolder, idea-clarifier, prd-generator, tech-stack-advisor,
  entity-modeler, module-planner, sprint-planner, ai-coding-coach,
  acceptance-runner, security-dependency-auditor, deploy-production-gate,
  state-keeper) to quote exact rules, templates and formats from the source
  chapters instead of relying on model memory. Prevents hallucination: when
  in doubt about a template, format, threshold or rule — READ the bab file,
  quote it verbatim with its bab number, and cite it in the output.
license: MIT
compatibility: Requires local access to D:\Programming\fundamental-vibe-coding\architecture-planner\MATERI-PECAHAN\. Read-only skill: it never writes to the materi folder.
---

# Materi Reference — Anti-Halusinasi Router

Metode Architect-Builder punya satu sumber kebenaran tertulis: folder
`MATERI-PECAHAN` (26 bab). Memori model TIDAK boleh menjadi penggantinya.

## The Iron Rule

```
SEBELUM menjalankan langkah penting dalam skill mana pun:
1. Temukan bab yang relevan lewat tabel routing di bawah
2. BACA file bab-nya (jangan mengandalkan ingatan)
3. Kutip aturan/template verbatim + sebut nomor babnya
4. Cite di output: (Bab X.Y)
```

**Jika ragu tentang template, format, ambang batas, atau aturan — baca dulu
bab-nya, baru bertindak.** Merujuk tanpa membaca = halusinasi yang rapi.

## Master Path

```
D:\Programming\fundamental-vibe-coding\architecture-planner\MATERI-PECAHAN\
```

## Bab Routing Table

| Skill / situasi | Baca bab ini | Untuk apa |
|---|---|---|
| scaffolder | `06-Struktur-Folder-Proyek.md`, `07-Penjelasan-Detail-Setiap-File.md` | struktur folder + template tiap file |
| idea-clarifier | `08-Workflow-Lengkap-6-Tahap.md` (8.3), `09-Context-Engineering.md` | pertanyaan discovery + context rules |
| prd-generator | `08-Workflow-Lengkap-6-Tahap.md` (8.4), `10-Sprint-Based-Development.md` | isi REQUIREMENTS: apa & mengapa |
| tech-stack-advisor | `15-Tools-Teknologi.md`, `20-System-Design-Architecture.md`, `07-... (7.4 ADR)` | pilihan stack + format keputusan |
| entity-modeler | `20-System-Design-Architecture.md`, `07-... (7.5)` | model data + keputusan storage |
| module-planner | `20-System-Design-Architecture.md`, `21-Agentic-Patterns.md` | arsitektur + file list |
| sprint-planner | `08-... (8.4 Architect Pack)`, `10-Sprint-Based-Development.md` | 4 dokumen pack + pola sprint |
| ai-coding-coach | `08-... (8.5-8.6)`, `11-Cara-Menulis-Prompt.md`, `21-Agentic-Patterns.md` | dry run, aturan builder, bounded loop |
| acceptance-runner | `12-Sistem-Verifikasi-Review.md`, `21-Agentic-Patterns.md` | Writer/Reviewer, 7 jenis verifikasi |
| security-dependency-auditor | `13-Keamanan-Dependency-Check.md`, `22-Standar-Production-Ready.md` | tool keamanan + checklist P1 |
| deploy-production-gate | `22-Standar-Production-Ready.md` | ci.yml, monitoring, GO/NO-GO |
| state-keeper | `07-... (7.3-7.7)`, `09-Context-Engineering.md`, `14-Manajemen-Session-AI.md` | format file state + session hygiene |
| format AGENTS/CLAUDE.MD | `07-Penjelasan-Detail-Setiap-File.md` | router + adapter tool |
| kesalahan umum | `17-Kesalahan-Umum.md` | 6 jebakan + solusinya |
| tips praktis | `16-Tips-Praktis-Best-Practices.md` | do/don't harian |
| dasar metode & pilar | `02-Konsep-Inti-Architect-Builder.md`, `03-Tiga-Pilar-Metode.md` | Architect-Builder + 3 pilar |
| riset repo eksternal | `26-Riset-Referensi-GitHub-Skill-7-12.md` | pola spec-kit/superpowers/BMAD dll |
| workflow 12 skill | `25-Skill-Lengkap-Workflow.md` | peta skill × tahap × kontrak folder |
| studi kasus end-to-end | `18-Contoh-Kasus-Nyata.md` | contoh dashboard keuangan CEO |

## Daftar File Lengkap

```
00-HEADER.md, 00-INDEX.md
01-Mengapa-Vibe-Coding-Gagal.md       14-Manajemen-Session-AI.md
02-Konsep-Inti-Architect-Builder.md   15-Tools-Teknologi.md
03-Tiga-Pilar-Metode.md               16-Tips-Praktis-Best-Practices.md
04-Analogi-Membangun-Rumah.md         17-Kesalahan-Umum.md
05-Persiapan-Sebelum-Memulai.md       18-Contoh-Kasus-Nyata.md
06-Struktur-Folder-Proyek.md          19-Glosarium-Lengkap.md
07-Penjelasan-Detail-Setiap-File.md   20-System-Design-Architecture.md
08-Workflow-Lengkap-6-Tahap.md        21-Agentic-Patterns.md
09-Context-Engineering.md             22-Standar-Production-Ready.md
10-Sprint-Based-Development.md        23-Vibe-Engineering.md
11-Cara-Menulis-Prompt.md             24-Referensi-Sumber.md
12-Sistem-Verifikasi-Review.md        25-Skill-Lengkap-Workflow.md
13-Keamanan-Dependency-Check.md       26-Riset-Referensi-GitHub-Skill-7-12.md
```

## Cara Mengutip dengan Benar

```
✅ BENAR: "Sesuai Bab 7.3, STATE.MD memakai tabel riwayat sprint
          dengan kolom: Sprint | Nama | Status | Tanggal."
          (setelah benar-benar membaca file bab)

✅ BENAR: "Template persisnya ada di Bab 6.1 — saya baca ulang
          sebelum membuat scaffold."

❌ SALAH: "Seperti biasa di metode ini, kira-kira formatnya..."
          (mengarang dari ingatan = jalur halusinasi)

❌ SALAH: Mencantumkan "(Bab X.Y)" tanpa membaca file-nya
          (sitasi palsu lebih berbahaya daripada tidak ada sitasi)
```

## Fallback

Jika folder materi tidak dapat diakses (path berpindah/dipindah): STOP dan
tanyakan lokasi barunya ke user. Jangan melanjutkan dengan asumsi memori —
melainkan permintaan user yang menegaskan bahwa melanjutkan tanpa materi
diterima.
