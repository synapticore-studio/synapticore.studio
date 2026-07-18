#!/usr/bin/env bash
# Erzeugt die Mobile-Varianten. Die tightere GOP (-g 4) halbiert die
# Seek-Decode-Arbeit auf Telefonen — das ist der eigentliche Grund fuer
# diesen Schritt, nicht die Dateigroesse.
#
# Input ist die 9:16-Segmentserie (Task 9). Solange es die nicht gibt,
# skaliert es die 16:9-Segmente als Zwischenstand — die Engine schaltet
# dann korrekt um, das Bild ist aber noch nicht portrait-kadriert.
set -euo pipefail
SRC="${1:?usage: encode-mobile.sh <srcdir>}"
for f in "$SRC"/*.mp4; do
  case "$f" in *-m.mp4) continue ;; esac
  out="${f%.mp4}-m.mp4"
  ffmpeg -v error -y -i "$f" -an -vf "scale=720:-2" \
    -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \
    -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "$out"
  printf '%-16s %6s\n' "$(basename "$out")" "$(du -h "$out" | cut -f1)"
done
