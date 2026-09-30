#!/usr/bin/env bash
# Verifikasi md5 teach-api-design di semua lokasi distribusi.
SRC="D:/Programming/fundamental-vibe-coding/skills/teach-api-design"
LOKASI=(
  "$HOME/.agents/skills/teach-api-design"
  "$HOME/.workbuddy-ai/skills/teach-api-design"
  "$HOME/.config/opencode/skills/teach-api-design"
  "$HOME/.pi/agent/skills/teach-api-design"
  "$HOME/.omp/agent/skills/teach-api-design"
  "D:/Programming/fundamental-vibe-coding/.agents/skills/teach-api-design"
  "D:/Programming/fundamental-vibe-coding/.opencode/skills/teach-api-design"
  "D:/Programming/fundamental-vibe-coding/.pi/skills/teach-api-design"
  "D:/Programming/fundamental-vibe-coding/.workbuddy-ai/skills/teach-api-design"
  "$HOME/.gemini/config/skills/teach-api-design"
)
FILE=(
  "SKILL.md"
  "references/roadmap-4-tingkat.md"
  "references/peta-unit.md"
  "references/korpus-ai.md"
  "references/sintaks-http-api.md"
  "references/cakupan-vs-dokumen-resmi.md"
)

total=0
cocok=0
for f in "${FILE[@]}"; do
  a=$(md5sum "$SRC/$f" | cut -d' ' -f1)
  for l in "${LOKASI[@]}"; do
    total=$((total+1))
    if [ ! -f "$l/$f" ]; then
      echo "HILANG: $l/$f"
      continue
    fi
    b=$(md5sum "$l/$f" | cut -d' ' -f1)
    if [ "$a" = "$b" ]; then
      cocok=$((cocok+1))
    else
      echo "BEDA  : $l/$f"
    fi
  done
done
echo "----"
echo "cocok: $cocok / $total"
echo "---- md5 sumber ----"
md5sum "$SRC"/SKILL.md "$SRC"/references/*.md
