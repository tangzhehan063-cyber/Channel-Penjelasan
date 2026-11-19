#!/usr/bin/env bash
# Cek gerak video jadi (OpenCV, lokal): seberapa banyak frame hampir diam, kecepatan gerak, perubahan layar. Mode SARAN (tidak membatalkan apa pun).
# Pakai: tools/cek-gerak.sh <NN | file.mp4>      (NN = video/video-NN-*.mp4)
# Target: tools/gerak-target.json. Alat ukur: tools/ref-analyze.py (sumber: tools/ref-analyze.SUMBER.txt).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; T="$ROOT/tools"
arg="${1:?usage: cek-gerak.sh <NN|file.mp4>}"
if [ -f "$arg" ]; then f="$arg"; else nn=$(printf '%02d' "$((10#$arg))"); f=$(ls "$ROOT"/video/video-$nn-*.mp4 2>/dev/null | head -1); fi
[ -f "${f:-}" ] || { echo "tidak ada file video untuk '$arg'"; exit 2; }
if [ ! -x "$T/.venv-ref/bin/python" ]; then python3 -m venv "$T/.venv-ref" && "$T/.venv-ref/bin/pip" install -q -r "$T/requirements-ref.txt"; fi
out="$(mktemp --suffix=.json)"
"$T/.venv-ref/bin/python" -I "$T/ref-analyze.py" "$f" -o "$out" >/dev/null
python3 - "$out" "$T/gerak-target.json" "$f" <<'PY'
import json, sys
d = json.load(open(sys.argv[1])); t = json.load(open(sys.argv[2])); e = d['edit']; m = d['motion']
print(f"CEK GERAK · {sys.argv[3].split('/')[-1]} · {d['source']['seconds']:.1f} dtk")
rows = [("frame hampir diam", e['stillShare'], f"≤ {t['stillShareMaks']:.0%}", e['stillShare'] <= t['stillShareMaks'], f"{e['stillShare']:.0%}"),
        ("gerak rata-rata (meanFlow)", m['meanFlow'], f"≥ {t['meanFlowMin']}", m['meanFlow'] >= t['meanFlowMin'], f"{m['meanFlow']:.2f}"),
        ("perubahan layar (meanDiff)", e['meanDiff'], f"≥ {t['meanDiffMin']}", e['meanDiff'] >= t['meanDiffMin'], f"{e['meanDiff']:.2f}"),
        ("hold terpanjang (dtk)", e['holdLongestS'], f"≤ {t['holdTerpanjangMaksDtk']}", e['holdLongestS'] <= t['holdTerpanjangMaksDtk'], f"{e['holdLongestS']:.2f}")]
bad = 0
for n, v, tg, ok, s in rows:
    print(f"  {'OK   ' if ok else 'SARAN'} {n:30} {s:>7}  (target {tg})"); bad += (not ok)
print(f"Hasil: {bad} SARAN (video terasa {'hidup' if bad == 0 else 'kurang bergerak: tambah gerak objek/aliran, bukan hanya kamera'})")
PY
# gerak lokal: porsi piksel yang berubah antar-frame (peka pada gerak kecil seperti air di pipa; alat global di atas tidak peka)
"$T/.venv-ref/bin/python" -I - "$f" <<'PY'
import sys, cv2, numpy as np
cap = cv2.VideoCapture(sys.argv[1]); prev = None; a = []
while True:
    ok, im = cap.read()
    if not ok: break
    g = cv2.cvtColor(cv2.resize(im, (270, 480)), cv2.COLOR_BGR2GRAY)
    if prev is not None: a.append(float((cv2.absdiff(g, prev) > 8).mean()))
    prev = g
a = np.array(a)
print(f"  info  gerak lokal: piksel berubah rata-rata {a.mean()*100:.2f}% | frame bergerak {np.mean(a > 0.003)*100:.0f}% | frame mati {np.mean(a < 0.0005)*100:.0f}%  (patokan #19: 5,0%, #8: 6,1%, #14: 1,7%, #21: 2,7%, #22: 1,9%)")
PY
rm -f "$out"
