#!/usr/bin/env bash
# Menyiapkan library lokal (GSAP + three.js) dari npm karena CDN (cdn.jsdelivr.net) diblokir proxy cloud. Jalankan sekali di folder ini.
set -e
cd "$(dirname "$0")"
mkdir -p vendor .tmp && (cd .tmp && npm init -y >/dev/null && npm i gsap three >/dev/null)
cp .tmp/node_modules/gsap/dist/gsap.min.js vendor/
cp .tmp/node_modules/three/build/three.module.js .tmp/node_modules/three/build/three.core.js vendor/
cp .tmp/node_modules/three/examples/jsm/geometries/RoundedBoxGeometry.js vendor/
rm -rf .tmp
echo "vendor/ siap. Render: npm i hyperframes && npx hyperframes render -o ../video/sampel-hyperframes.mp4"
