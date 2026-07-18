#!/usr/bin/env bash
# Erzeugt einen synthetischen 60s-Master (1800 Frames @ 30fps) mit sichtbarem
# Frame-Zaehler. Ersetzt den Blender-Render, solange es noch keinen gibt.
set -euo pipefail
OUT="${1:?usage: make-test-master.sh <out.mp4>}"
mkdir -p "$(dirname "$OUT")"
ffmpeg -v error -y -f lavfi -i "testsrc2=size=1920x1080:rate=30:duration=60" \
  -c:v libx264 -preset ultrafast -crf 18 -pix_fmt yuv420p -an "$OUT"
echo "master: $OUT ($(ffprobe -v error -count_frames -select_streams v:0 \
  -show_entries stream=nb_read_frames -of csv=p=0 "$OUT") frames)"
