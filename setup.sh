#!/usr/bin/env bash
# Menyiapkan ulang di container baru. Jalankan dari root repo.
set -e
(cd remotion && npm install)
echo "Siap. Preview: (cd remotion && npx remotion studio). Render: npx remotion render <Komposisi> out/<slug>.mp4"
