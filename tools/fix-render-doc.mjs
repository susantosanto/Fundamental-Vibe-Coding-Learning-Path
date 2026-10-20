import fs from 'node:fs';
const files = [
  'C:/.freebuff/skills/WORKFLOW.md',
  'C:/Users/Acer/.opencode/skills/WORKFLOW.md',
  'C:/Users/Acer/.omp/agent/skills/WORKFLOW.md',
  'C:/Users/Acer/.pi/skills/WORKFLOW.md',
  'C:/Users/Acer/.gemini/skills/WORKFLOW.md',
  'C:/Users/Acer/.agents/skills/WORKFLOW.md',
  'C:/Users/Acer/.workbuddy-ai/skills/WORKFLOW.md',
];
let n = 0;
for (const f of files) {
  let t = fs.readFileSync(f, 'utf8');
  const o = t;
  t = t.replace('node scripts/render.mjs <arsitektur.json> <output.html> \\\n         [--constraints constraints.reviewed.json] [--activity activity.jsonl]',
    'node scripts/render.mjs <arsitektur.json> <output.html> [activity.jsonl] \\\n         [--constraints constraints.reviewed.json] [--simulation]');
  if (t !== o) { fs.writeFileSync(f, t); n++; }
}
console.log('fixed:', n, 'file');
