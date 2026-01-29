#!/bin/zsh
set -euo pipefail

JUNK_DIR=${1:-"$(dirname "$0")/../junk"}
INTERVAL=${2:-2}

# Simple watcher: poll for new/updated files and convert to PNG.
# Run in a separate terminal: scripts/watch-junk.sh
while true; do
  "$(dirname "$0")/convert-junk-to-png.sh" "$JUNK_DIR"
  "$(dirname "$0")/build-junk-manifest.sh" "$JUNK_DIR"
  sleep "$INTERVAL"
done
