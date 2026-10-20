import fs from 'node:fs';

const SECTION = `---

## BIRDVIEW — Peta Arsitektur & Konfirmasi Visual (Bab 27, Lapis 2)

Skill pendukung ke-5 (Lapis 2, Bab 27) — skill pihak ketiga: Qiuner/birdview
(MIT). Terpasang di folder skills setiap agent; script self-contained
(node_modules + ikon di-vendor), tidak butuh npm install per proyek.

POSISI DI PIPELINE (menumpang tahap yang sudah ada, tanpa tahap baru):
  STAGE 3  setelah /sprint-planner  → langkah 12b: module map +
           dependency graph → architecture.json; CONSTRAINTS.md →
           constraints.reviewed.json → render peta ("architect pack visual")
  STAGE 4  saat DRY RUN             → langkah 15b: builder deklarasikan
           scope ke activity.jsonl → render activity.html → user cek
           cakupan DI PETA sebelum approve MODE BUILD
  STAGE 6a setelah /acceptance-runner → langkah 20b: verdict + daftar check
           yang benar-benar jalan → activity.jsonl → tab Verification peta
  CHANGE MANAGEMENT (revisi fitur)  → comparison view: scope KEEP/CHANGE/
           REMOVE vs arsitektur penuh — konfirmasi visual dampak

ATURAN GATE (konsisten Bab 27):
  - Birdview MENAMPILKAN rencana; keputusan tetap lewat CHAT + DRYRUN-REPORT.MD
    (konfirmasi di peta BUKAN write lock — dinyatakan sendiri oleh birdview).
  - BUKAN pengganti acceptance-runner (fresh context + Iron Law), BUKAN
    security auditor (tool nyata), BUKAN bukti UI (itu browser-skill).
  - Artefak di .birdview/ — milik folder proyek; ikut diwariskan saat
    handoff antar agent (27.7): baca peta lama dulu sebelum membuat baru.
  - Default on-demand: hanya jalan saat diminta / map request; auto mode
    per proyek lewat blok mode di AGENTS.MD (ikuti references/modes.md).

KONTRAK DATA (sumber kebenaran = references/contract.md di folder skill):
  architecture.json ← module map + dependency graph (module-planner)
  constraints.reviewed.json ← CONSTRAINTS.md (Tahap 3.4b)
  activity.jsonl ← ai-coding-coach MODE DRY RUN (bersama DRYRUN-REPORT.MD)

PERINTAH (jalankan dari folder skill birdview; skema = file sumber):
  node scripts/validate.mjs <arsitektur.json> [activity.jsonl]
  node scripts/render.mjs <arsitektur.json> <output.html> \\
         [--constraints constraints.reviewed.json] [--activity activity.jsonl]
  Mode proyek: node scripts/birdview.mjs mode on-demand|auto --project <root>

`;

function patch(file) {
  let t = fs.readFileSync(file, 'utf8');
  const orig = t;
  const lines = t.split('\n');
  const findLine = (prefix) => lines.findIndex((l) => l.startsWith(prefix));
  const insertAfter = (idx, text) => lines.splice(idx + 1, 0, text);

  // 12b — setelah baris sprint-planner (STAGE 3)
  let i = lines.findIndex((l) => l.includes('→ sprint plan + 4-doc ARCHITECT PACK'));
  if (i < 0) throw new Error('anchor 12b tidak ketemu di ' + file);
  insertAfter(i, '          /birdview                    → 12b (Bab 27): architect pack visual —');
  insertAfter(i + 1, '                                          architecture.json + constraints.reviewed.json');
  insertAfter(i + 2, '                                          dari module map + CONSTRAINTS.md → render peta');

  // 15b — setelah baris ai-coding-coach (STAGE 4-5)
  i = lines.findIndex((l) => l.startsWith('STAGE 4-5 /ai-coding-coach'));
  if (i < 0) throw new Error('anchor 15b tidak ketemu di ' + file);
  insertAfter(i, '             └─ 15b (Bab 27): /birdview — builder deklarasikan scope ke');
  insertAfter(i + 1, '                activity.jsonl → peta perubahan tampil → konfirmasi');
  insertAfter(i + 2, '                scope sebelum MODE BUILD');

  // 20b — setelah baris acceptance-runner (STAGE 6a)
  i = lines.findIndex((l) => l.startsWith('STAGE 6a  /acceptance-runner'));
  if (i < 0) throw new Error('anchor 20b tidak ketemu di ' + file);
  insertAfter(i, '             └─ 20b (Bab 27): /birdview — verdict + check tercatat ke');
  insertAfter(i + 1, '                activity.jsonl → tab Verification peta birdview');

  t = lines.join('\n');

  // Section aturan — sebelum CONSTRAINT-DRIVEN DEVELOPMENT
  const anchor = '## CONSTRAINT-DRIVEN DEVELOPMENT';
  const a = t.indexOf(anchor);
  if (a < 0) throw new Error('anchor section tidak ketemu di ' + file);
  t = t.slice(0, a) + SECTION + t.slice(a);

  // CHANGE MANAGEMENT — comparison view
  t = t.replace('SEBELUM vs SESUDAH', 'SEBELUM vs SESUDAH\n                  + /birdview comparison view: scope revisi (KEEP/CHANGE/\n                    REMOVE) vs arsitektur penuh — konfirmasi visual dampak');

  if (t === orig) throw new Error('tidak ada perubahan di ' + file);
  fs.writeFileSync(file, t);
  console.log('PATCHED:', file);
}

const files = [
  'C:/.freebuff/skills/WORKFLOW.md',
  'C:/Users/Acer/.opencode/skills/WORKFLOW.md',
  'C:/Users/Acer/.omp/agent/skills/WORKFLOW.md',
  'C:/Users/Acer/.pi/skills/WORKFLOW.md',
  'C:/Users/Acer/.gemini/skills/WORKFLOW.md',
  'C:/Users/Acer/.agents/skills/WORKFLOW.md',
];
files.forEach(patch);
