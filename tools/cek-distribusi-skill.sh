#!/usr/bin/env bash
# cek-distribusi-skill.sh — verifikasi md5 satu skill di 11 lokasi distribusi.
#
# Pakai:  bash tools/cek-distribusi-skill.sh teach-api-design
#
# Latar: pada 7 Okt 2026, "sebar ulang" dilaporkan sukses tapi 4 lokasi in-repo
# ternyata masih memegang versi lama. Skrip ini yang menemukannya. Jalankan
# SETELAH setiap distribusi, jangan percaya exit-code saja.
#
# Ditemukan juga: JEBAKAN SARANG (cp -r ke folder yang sudah ada -> dst/src).
# Skrip ini melaporkannya sebagai baris "SARANG".

set -u

NAMA="${1:-}"
if [ -z "$NAMA" ]; then
  echo "Pakai: bash tools/cek-distribusi-skill.sh <nama-skill>"
  exit 1
fi

REPO="D:/Programming/fundamental-vibe-coding"
SRC="$REPO/skills/$NAMA"

if [ ! -d "$SRC" ]; then
  echo "Sumber tidak ada: $SRC"
  exit 1
fi

# 7 salinan global + 4 salinan in-repo + 1 junction agy = 12 lokasi.
# Urutan mengikuti `distribusi-skill-agen` §1.
LOKASI=(
  "$HOME/.agents/skills/$NAMA"            # freebuff + pi + omp
  "$HOME/skills/$NAMA"                    # global kedua (dipilih xcode)
  "$HOME/.workbuddy-ai/skills/$NAMA"      # workbuddy
  "$HOME/.config/opencode/skills/$NAMA"   # opencode
  "$HOME/.cline/skills/$NAMA"             # cline cli
  "$HOME/.pi/agent/skills/$NAMA"          # pi
  "$HOME/.omp/agent/skills/$NAMA"         # omp
  "$REPO/.agents/skills/$NAMA"
  "$REPO/.opencode/skills/$NAMA"
  "$REPO/.pi/skills/$NAMA"
  "$REPO/.workbuddy-ai/skills/$NAMA"
  "$HOME/.gemini/config/skills/$NAMA"     # agy (junction)
)

# Kumpulkan daftar file dari sumber — rekursif, jadi bekerja untuk struktur
# apa pun: references/ (skill teach-*), resources/ (skill pihak ketiga), dll.
FILE=()
while IFS= read -r f; do
  FILE+=("${f#"$SRC"/}")
done < <(find "$SRC" -type f | sort)

total=0
cocok=0
masalah=0

for f in "${FILE[@]}"; do
  a=$(md5sum "$SRC/$f" | cut -d' ' -f1)
  for l in "${LOKASI[@]}"; do
    total=$((total+1))
    if [ ! -f "$l/$f" ]; then
      echo "HILANG: $l/$f"
      masalah=$((masalah+1))
      continue
    fi
    b=$(md5sum "$l/$f" | cut -d' ' -f1)
    if [ "$a" = "$b" ]; then
      cocok=$((cocok+1))
    else
      echo "BEDA  : $l/$f"
      masalah=$((masalah+1))
    fi
  done
done

# Deteksi JEBAKAN SARANG di lokasi in-repo.
for l in "$REPO/.agents/skills" "$REPO/.opencode/skills" "$REPO/.pi/skills"; do
  if [ -d "$l/$NAMA/$NAMA" ]; then
    echo "SARANG: $l/$NAMA/$NAMA"
    masalah=$((masalah+1))
  fi
done

echo "----"
echo "cocok: $cocok / $total   masalah: $masalah"
echo "---- md5 sumber ($NAMA) ----"
( cd "$SRC" && find . -type f | sort | while IFS= read -r f; do md5sum "${f#./}"; done )

[ "$masalah" -eq 0 ] && exit 0 || exit 1
