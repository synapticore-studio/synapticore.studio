#!/usr/bin/env bash
# Schneidet einen durchgehenden Kameraflug in die neun Segmente der Engine.
# Schnitte ueber Frame-Nummern (nicht Zeit) und mit einem Frame Ueberlappung
# an jeder Grenze: das letzte Frame von Segment N ist dasselbe Master-Frame
# wie das erste von Segment N+1 — genau dort blendet die Engine ueber.
set -euo pipefail
MASTER="${1:?usage: segment-world.sh <master.mp4> <outdir>}"
OUTDIR="${2:?usage: segment-world.sh <master.mp4> <outdir>}"
mkdir -p "$OUTDIR"

# name:start_frame:end_frame  (beide inklusive)
SEGMENTS="
origin:0:240
conn1:240:390
enterprise:390:630
conn2:630:780
neural:780:1020
conn3:1020:1170
agentic:1170:1410
conn4:1410:1560
finale:1560:1799
"

for seg in $SEGMENTS; do
  name="${seg%%:*}"; rest="${seg#*:}"
  start="${rest%%:*}"; end="${rest##*:}"
  ffmpeg -v error -y -i "$MASTER" \
    -vf "select='between(n\,${start}\,${end})',setpts=PTS-STARTPTS" \
    -an -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
    -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart \
    "$OUTDIR/${name}.mp4"
  frames=$(ffprobe -v error -count_frames -select_streams v:0 \
    -show_entries stream=nb_read_frames -of csv=p=0 "$OUTDIR/${name}.mp4")
  printf '%-12s %4s frames  %6s\n' "$name" "$frames" "$(du -h "$OUTDIR/${name}.mp4" | cut -f1)"
done
