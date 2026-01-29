#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
JUNK_DIR=${1:-"$ROOT_DIR/junk"}
OUT_FILE=${2:-"$JUNK_DIR/manifest.json"}

python3 - "$JUNK_DIR" "$OUT_FILE" <<'PY'
import json
import os
import sys

junk_dir = sys.argv[1]
out_file = sys.argv[2]

root = os.path.dirname(junk_dir)
paths = []
for dirpath, _, filenames in os.walk(junk_dir):
    for name in filenames:
        if not name.lower().endswith('.png'):
            continue
        if name == 'manifest.json':
            continue
        full = os.path.join(dirpath, name)
        rel = os.path.relpath(full, root).replace(os.sep, '/')
        paths.append(rel)

paths.sort()
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(paths, f, ensure_ascii=True, indent=2)
    f.write('\n')
PY

printf "Wrote %s\n" "$OUT_FILE"
