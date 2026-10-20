# SINKRONISASI SKILL WORKFLOW — 11 LOKASI

> **Aturan:** ubah skill di **satu tempat**, jalankan **satu perintah**, 11 lokasi ikut.
> Ruang lingkup: **24 skill alur pengembangan aplikasi** (Bab 27). `teach-*`, `dsa-review`,
> `latihan-*`, `architecture-diagram` **tidak** termasuk.

---

## 1. Aturan yang mengikat

1. **Sumber kebenaran:** `skills/<nama>/` di repo ini. Kalau skill belum ada di repo,
   `~/.agents/skills/<nama>/` jadi sumber sementara — dan itu **utang** yang harus
   dipindahkan ke repo, bukan kebiasaan.
2. **Jangan salin manual** ke 11 lokasi. Satu perintah, satu hasil.
3. **Setelah setiap perubahan** skill (SKILL.md, `references/`, `scripts/`, frontmatter)
   → jalankan sync → jalankan verifikasi. Tanpa verifikasi, perubahan dianggap belum ada.
4. **Jangan percaya exit-code saja.** Baca output: `HILANG` dan `BEDA` harus nol.
5. **Gemini memakai junction**, bukan salinan. `cp -R` ke `.gemini/config/skills` akan
   membuat salinan kedua yang membeku — persis kegagalan yang ingin dihindari.
6. **CRLF bukan drift.** Verifikasi memakai md5 setelah normalisasi `\r`. File yang
   "berbeda 1.200 byte" tapi identik setelah normalisasi = tidak perlu disentuh.
7. **Satu skill, satu nama folder.** `design-taste-frontend` disimpan sebagai
   `taste-skill` di lokasi yang sudah memakai nama itu. Jangan membuat dua folder dengan
   `name:` yang sama — agent bisa memuat keduanya.
8. **Mengubah = sengaja.** Kalau hanya ingin melihat keadaan, pakai `--check` (read-only).

## 2. Perintah

```bash
python tools/sync-skill-workflow.py            # backup → salin → verifikasi
python tools/sync-skill-workflow.py --check    # verifikasi saja, tidak menulis
python tools/sync-skill-workflow.py --prune    # + hapus file sisa versi lama
```

Skrip membuat backup dulu di `_backup/sync-skills-<stamp>/` (satu folder per lokasi),
lalu **menimpa** file. Tanpa `--prune`, ia **tidak menghapus** apa pun; file sisa versi
lama hanya dilaporkan sebagai `SISA VERSI LAMA`. Dengan `--prune`, file yang tidak ada di
sumber dihapus, lalu folder yang jadi kosong ikut dibuang — hanya di dalam 24 skill itu,
tidak menyentuh skill lain.

## 3. Sebelas lokasi

| # | Lokasi | Cara | Dibaca oleh |
|---|---|---|---|
| 1 | `~/.agents/skills/` | salinan (sumber cadangan) | freebuff + agen berbasis `.agents` |
| 2 | `~/.claude/skills/` | salinan | Claude Code |
| 3 | `~/.codex/skills/` | salinan | Codex |
| 4 | `~/.config/opencode/skills/` | salinan | opencode (`skills.paths` di `opencode.json`) |
| 5 | `~/.omp/agent/skills/` | salinan | omp |
| 6 | `~/.pi/agent/skills/` | salinan | pi |
| 7 | `~/.workbuddy-ai/skills/` | salinan | WorkBuddy |
| 8 | `~/.zcode/skills/` | salinan | ZCode |
| 9 | `~/.cline/skills/` | salinan | Cline CLI |
| 10 | `~/skills/` | salinan | "global kedua" |
| 11 | `~/.gemini/config/skills/` | **junction** per skill → `.agents/skills/<nama>` | agy / Gemini |

⚠️ Lokasi hantu yang **tidak** dipakai skrip: `~/.gemini/skills/`, `~/.pi/skills/`,
`~/.opencode/skills/`. Ketiganya salinan lama; mengubahnya tidak berpengaruh ke agent.
Kalau mau dipakai, itu keputusan terpisah — jangan disinkronkan diam-diam.

## 4. Dua puluh empat skill

**Lapis 1 — pipeline utama (13):**
`scaffolder` · `idea-clarifier` · `prd-generator` · `tech-stack-advisor` ·
`entity-modeler` · `module-planner` · `sprint-planner` · `ai-coding-coach` ·
`acceptance-runner` · `security-dependency-auditor` · `deploy-production-gate` ·
`state-keeper` · `constitution`

**Lapis 2 — pendukung (6):**
`pen-design` · `stitch` · `design-taste-frontend` · `birdview` · `impeccable` · `browser-skill`

**Lapis 3 — produksi (4):**
`observability-and-instrumentation` · `debugging-and-error-recovery` ·
`systematic-debugging` · `constraint-driven-development`

**Router (1):** `materi-reference`

## 5. Kalau verifikasi gagal

- **`HILANG`** — sumber tidak ada, atau lokasi tidak bisa ditulis. Cek `src_of()` di skrip.
- **`BEDA`** — ada dua versi berbeda. Jangan "pilih yang lebih baru" dari tanggal file;
  cari dulu mana yang memuat aturan terbaru (mis. `sprint-planner` wajib memuat
  `DSA line (27.4c ATURAN 3)`).
- **`SISA VERSI LAMA`** — file lama yang tidak ada di sumber. Jalankan
  `python tools/sync-skill-workflow.py --prune` (backup sudah dibuat lebih dulu).
- Pulihkan dari `_backup/sync-skills-<stamp>/<lokasi>/<skill>/`.

---

**📅 Dibuat:** 17 Oktober 2026
**📚 Terkait:** `tools/sync-skill-workflow.py` · `AGENTS.MD` §5 ·
`architecture-planner/MATERI-PECAHAN/27-Panduan-EndToEnd-Semua-Skill.md`
