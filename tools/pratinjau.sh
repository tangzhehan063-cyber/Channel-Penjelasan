#!/usr/bin/env bash
# Pratinjau murah (fase 4-5): still per detik + satu contact sheet. Render satu per satu (paralel = kehabisan memori).
# Pakai: tools/pratinjau.sh <Komposisi> <keluaran.jpg> <detik> [detik ...]
# Contoh: tools/pratinjau.sh Tiang03 /tmp/sheet.jpg 2 15 26 43 60
set -euo pipefail
KOMP=$1; OUT=$2; shift 2
ROOT=$(cd "$(dirname "$0")/.." && pwd); TMP=$(mktemp -d)
cd "$ROOT/remotion"
for s in "$@"; do
  f=$(python3 -c "print(round($s*30))")
  npx remotion still "$KOMP" "$TMP/$(printf %08.2f "$s").png" --frame="$f" --scale=0.5 --log=error
done
python3 - "$OUT" "$TMP" <<'PY'
import sys, glob
from PIL import Image
out, d = sys.argv[1], sys.argv[2]
fs = sorted(glob.glob(d + '/*.png')); n = len(fs); kol = min(n, 5); bar = (n + kol - 1) // kol
W = Image.new('RGB', (270 * kol, 480 * bar), 'white')
for i, f in enumerate(fs): W.paste(Image.open(f).convert('RGB').resize((270, 480)), ((i % kol) * 270, (i // kol) * 480))
W.save(out, quality=85); print(f'contact sheet: {out} ({n} still)')
PY
rm -rf "$TMP"
