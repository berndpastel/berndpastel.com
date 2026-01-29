#!/bin/zsh
set -euo pipefail

JUNK_DIR=${1:-"$(dirname "$0")/../junk"}

# Convert any non-PNG image in junk/ to PNG using sips (macOS)
# Only convert when output is missing or older than source.
setopt NULL_GLOB
for f in "$JUNK_DIR"/*.{ico,icns,bmp,jpg,jpeg,gif,tiff,tif,svg,webp}; do
  [ -f "$f" ] || continue
  base="${f%.*}"
  out="${base}.png"
  if [ ! -f "$out" ] || [ "$f" -nt "$out" ]; then
    if sips -s format png "$f" --out "$out" >/dev/null; then
      rm -f "$f"
    else
      echo "convert failed: $f" >&2
    fi
  fi
done
