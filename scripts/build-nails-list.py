#!/usr/bin/env python3
"""Write nails-list.js from the photo folders in images/nails/.

Each folder (one-color, level-1, ...) becomes one carousel. Run this after
adding or removing photos; the GitHub Pages deploy also runs it.
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NAILS_DIR = os.path.join(ROOT, 'images', 'nails')
OUT_FILE = os.path.join(ROOT, 'nails-list.js')
EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp', '.gif')


def natural_key(name):
    return [int(part) if part.isdigit() else part.lower() for part in re.split(r'(\d+)', name)]


folders = {}
for folder in sorted(os.listdir(NAILS_DIR)):
    folder_path = os.path.join(NAILS_DIR, folder)
    if not os.path.isdir(folder_path):
        continue
    names = [
        name for name in os.listdir(folder_path)
        if not name.startswith('.') and name.lower().endswith(EXTENSIONS)
    ]
    folders[folder] = ['images/nails/%s/%s' % (folder, name) for name in sorted(names, key=natural_key)]

with open(OUT_FILE, 'w', encoding='utf-8') as f:
    f.write('window.NAIL_IMAGES = ')
    json.dump(folders, f, ensure_ascii=False, indent=2)
    f.write(';\n')

print('Wrote %s' % OUT_FILE)
