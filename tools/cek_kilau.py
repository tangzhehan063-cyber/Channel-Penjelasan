#!/usr/bin/env python3
"""Cek z-fighting ("glitter") pada komposisi three.js. Dibuat setelah E1 #01 v1: lantai rumah berkedip, lolos dari cek still.

Cara: render frame yang sama dua kali, kamera digeser 0,0004 m (prop `nudge`), hitung piksel yang berubah >40.
Permukaan sehat nyaris tidak berubah; permukaan sebidang yang berebut kedalaman berkedip.
Komposisi WAJIB menerima prop `nudge?: number` (lihat `nudgeKey` di remotion/src/kit/waktu.ts).

Pakai: python3 tools/cek_kilau.py Rumah01 --dur 59 [--tiap 3] [--batas 300]
Keluar kode 1 bila ada frame di atas batas. Hasil acuan #01: sebelum perbaikan 726/564/248/10251 piksel, sesudah 0-144.
"""
import argparse, os, subprocess, sys, tempfile
import numpy as np
from PIL import Image

ap = argparse.ArgumentParser(); ap.add_argument('komposisi'); ap.add_argument('--dur', type=float, required=True); ap.add_argument('--tiap', type=float, default=3.0)
ap.add_argument('--batas', type=int, default=300); ap.add_argument('--fps', type=int, default=30); ap.add_argument('--frames', default='')
a = ap.parse_args()
frames = [int(x) for x in a.frames.split(',')] if a.frames else [int(t * a.fps) for t in np.arange(1.0, a.dur - 0.5, a.tiap)]
tmp = tempfile.mkdtemp(); bad = []; rem = os.path.join(os.path.dirname(__file__), '..', 'remotion')
for f in frames:
    ps = []
    for n in ('0', '0.0004'):
        p = f'{tmp}/{f}_{n}.png'; ps.append(p)
        subprocess.run(['npx', 'remotion', 'still', 'src/index.ts', a.komposisi, p, f'--frame={f}', '--image-format=png', f'--props={{"nudge":{n}}}'], cwd=rem, capture_output=True)
    x, y = (np.asarray(Image.open(p).convert('RGB')).astype(int) for p in ps)
    m = np.abs(x - y).max(axis=2) > 40; n_ = int(m.sum()); ys = np.nonzero(m)[0]
    print(f'frame {f:>5} ({f / a.fps:5.1f} dtk): {n_:>6} piksel berkedip' + (f'  baris {ys.min()}-{ys.max()}' if n_ else ''))
    if n_ > a.batas: bad.append((f, n_))
for f, n_ in bad: print(f'GAGAL: frame {f} ({f / a.fps:.1f} dtk) berkedip {n_} piksel (> {a.batas}); cari dua permukaan sebidang (selisih tinggi < 0,02 m)')
print('OK: tidak ada z-fighting' if not bad else f'{len(bad)} GAGAL')
sys.exit(1 if bad else 0)
