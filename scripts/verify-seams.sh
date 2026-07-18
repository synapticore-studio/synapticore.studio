#!/usr/bin/env bash
# Prueft jede Segmentgrenze: ist das letzte Frame von Segment N dasselbe Bild
# wie das erste von Segment N+1? Genau dort blendet die Engine ueber.
#
# Gemessen wird PSNR zwischen den beiden Frames. Beide stammen aus demselben
# Master-Frame, sind aber unabhaengig re-encodiert — daher nicht bit-identisch.
# Schwelle 40 dB: darunter stimmt die Frame-Arithmetik in segment-world.sh nicht.
set -euo pipefail
VID="${1:?usage: verify-seams.sh <viddir>}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

CHAIN="origin conn1 enterprise conn2 neural conn3 agentic conn4 finale"
THRESHOLD=40
fail=0
prev=""

for name in $CHAIN; do
  if [ -n "$prev" ]; then
    ffmpeg -v error -y -sseof -0.04 -i "$VID/$prev.mp4" -frames:v 1 "$TMP/a.png"
    ffmpeg -v error -y            -i "$VID/$name.mp4" -frames:v 1 "$TMP/b.png"
    # -v info ist noetig: die PSNR-Statistik wird auf info-Level ausgegeben,
    # -v error wuerde sie verschlucken.
    psnr=$(ffmpeg -v info -i "$TMP/a.png" -i "$TMP/b.png" -lavfi psnr -f null - 2>&1 \
           | grep -o 'average:[0-9.]*\|average:inf' | cut -d: -f2)
    if [ "$psnr" = "inf" ]; then
      verdict="OK (identisch)"
    elif awk "BEGIN{exit !($psnr >= $THRESHOLD)}"; then
      verdict="OK"
    else
      verdict="FAIL"; fail=1
    fi
    printf '%-12s -> %-12s  PSNR %8s dB  %s\n' "$prev" "$name" "$psnr" "$verdict"
  fi
  prev="$name"
done

if [ "$fail" -ne 0 ]; then
  echo "Mindestens eine Naht unter ${THRESHOLD} dB — Frame-Grenzen in segment-world.sh pruefen." >&2
  exit 1
fi
echo "Alle Naehte >= ${THRESHOLD} dB."
