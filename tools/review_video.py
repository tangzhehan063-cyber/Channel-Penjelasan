#!/usr/bin/env python3
"""Peninjau MP4: bahan untuk MENONTON hasil render (bukan pengganti menonton).

Pakai: python3 tools/review_video.py out/x.mp4 [--shots e1/NN/shots.json] [--out DIR] [--tiap 0.5] [--mulai D --akhir D]
Hasil di DIR (bawaan: <mp4>.review/):
  strip_NN.jpg      contact sheet frame (tiap --tiap detik) berlabel waktu, untuk dilihat mata
  shot_<id>.jpg     (bila --shots) tiga frame (awal/tengah/akhir) tiap shot
  laporan.txt       metrik: frame diam, potongan keras, gerak per detik, ringkasan variasi dari shots.json
Metrik hanya petunjuk: shot "diam" bisa disengaja; potongan keras bisa disengaja. Yang memutuskan adalah penilaian setelah menonton.
"""
import argparse, json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw

ap = argparse.ArgumentParser(); ap.add_argument('mp4'); ap.add_argument('--shots'); ap.add_argument('--out'); ap.add_argument('--tiap', type=float, default=0.5)
ap.add_argument('--mulai', type=float, default=0.0); ap.add_argument('--akhir', type=float, default=None); ap.add_argument('--kolom', type=int, default=8); ap.add_argument('--offset', type=float, default=0.0, help='detik pada shots.json yang bersesuaian dengan detik 0 MP4 (mis. 20.4 untuk pilot)')
a = ap.parse_args()
out = a.out or a.mp4 + '.review'; os.makedirs(out, exist_ok=True)
dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', a.mp4]).decode().strip())
t1 = min(a.akhir or dur, dur)
W, H = 135, 240  # sel kecil di strip

def frames(fps, w, h):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(a.mulai), '-t', str(t1 - a.mulai), '-i', a.mp4, '-vf', f'fps={fps},scale={w}:{h}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
    raw = subprocess.run(cmd, capture_output=True).stdout; n = len(raw) // (w * h * 3)
    return np.frombuffer(raw[:n * w * h * 3], dtype=np.uint8).reshape(n, h, w, 3)

# 1. strip
fr = frames(1 / a.tiap, W, H); per = a.kolom * 6
for si in range(0, len(fr), per):
    blok = fr[si:si + per]; rows = (len(blok) + a.kolom - 1) // a.kolom
    im = Image.new('RGB', (a.kolom * W, rows * H), (20, 20, 20)); d = ImageDraw.Draw(im)
    for i, f in enumerate(blok):
        x, y = (i % a.kolom) * W, (i // a.kolom) * H; im.paste(Image.fromarray(f), (x, y))
        d.rectangle([x, y, x + 46, y + 14], fill=(0, 0, 0)); d.text((x + 3, y + 1), f'{a.mulai + (si + i) * a.tiap:5.1f}s', fill=(255, 255, 255))
    im.save(f'{out}/strip_{si // per:02d}.jpg', quality=88)

# 2. metrik gerak (10 fps, gambar kecil)
g = frames(10, 54, 96).astype(np.float32).mean(axis=3)
dif = np.abs(np.diff(g, axis=0)).mean(axis=(1, 2)) if len(g) > 1 else np.array([0.0])
diam = float((dif < 0.25).mean()); keras = [round(float(a.mulai + (i + 1) / 10), 1) for i in np.nonzero(dif > 12)[0]]
sec = [float(dif[i:i + 10].mean()) for i in range(0, len(dif), 10)]
L = [f'berkas: {a.mp4}  durasi {dur:.2f} dtk (ditinjau {a.mulai:.1f}-{t1:.1f})',
     f'rasio frame hampir diam (selisih <0,25): {diam * 100:.0f}% (angka tinggi bukan salah bila disengaja; periksa dengan mata)',
     f'potongan keras terdeteksi (selisih >12) di detik: {keras if keras else "tidak ada"}',
     'gerak rata-rata per detik (0=diam): ' + ' '.join(f'{x:.1f}' for x in sec)]

# 3. per-shot
if a.shots:
    D = json.load(open(a.shots)); S = D['shots']
    for s in S:
        m0 = s['mulai'] - a.offset; ts = [m0 + 0.1, m0 + s['durasi'] / 2, m0 + s['durasi'] - 0.1]; ts = [min(max(t, 0), dur - 0.05) for t in ts]
        im = Image.new('RGB', (3 * 270, 480), (20, 20, 20))
        for i, t in enumerate(ts):
            p = f'{out}/_t.png'; subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.3f}', '-i', a.mp4, '-frames:v', '1', '-vf', 'scale=270:480', p]); im.paste(Image.open(p), (i * 270, 0))
        im.save(f'{out}/shot_{s["id"]}.jpg', quality=90)
    os.remove(f'{out}/_t.png') if os.path.exists(f'{out}/_t.png') else None
    ks = [s['gerak_kamera']['jenis'] for s in S]; ms = [s['mode'] for s in S]; du = [s['durasi'] for s in S]
    L += ['', f'shots.json: {len(S)} shot; kamera {sorted(set(ks))}; mode {sorted(set(ms))}', f'durasi shot: min {min(du):.1f}, maks {max(du):.1f}, rata-rata {sum(du) / len(du):.1f} dtk',
          'per shot (gerak rata-rata dalam rentangnya):']
    for s in S:
        i0, i1 = int((s['mulai'] - a.offset - a.mulai) * 10), int((s['mulai'] - a.offset + s['durasi'] - a.mulai) * 10)
        seg = dif[max(0, i0):max(i0 + 1, i1)]; L.append(f'  {s["id"]:>4} {s["mode"]:<9} {s["gerak_kamera"]["jenis"]:<11} {s["durasi"]:4.1f}s gerak {seg.mean() if len(seg) else 0:4.1f}')
open(f'{out}/laporan.txt', 'w').write('\n'.join(L)); print('\n'.join(L)); print(f'\nberkas tinjauan: {out}/ (strip_*.jpg, shot_*.jpg). LIHAT strip dan shot sebelum menilai.')
