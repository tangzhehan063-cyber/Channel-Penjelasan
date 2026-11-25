#!/usr/bin/env python3
"""Deteksi frame rusak pada video render (kasus E1 #03: frame "bertumpuk"/tile dan kanvas 3D hilang).

Frame tile: isi layar berulang vertikal, jadi baris y mirip baris y+periode. Frame polos (std kecil) dilaporkan
terpisah sebagai info, karena fade antar-adegan yang disengaja juga polos.
Pakai: python3 tools/cek-frame-rusak.py video.mp4 [--ambang 0.35]
Tidak mendeteksi kanvas 3D yang hilang tanpa pola berulang: itu tetap dicek lewat contact sheet (fase 8).
Keluar kode 1 bila ada frame tile.
"""
import argparse, subprocess, numpy as np
ap = argparse.ArgumentParser(); ap.add_argument('video'); ap.add_argument('--ambang', type=float, default=0.35); a = ap.parse_args()
W, H = 270, 480
p = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-i', a.video, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], stdout=subprocess.PIPE)
tile, polos, i = [], [], 0
while True:
    b = p.stdout.read(W * H)
    if len(b) < W * H: break
    x = np.frombuffer(b, np.uint8).reshape(H, W).astype(float)
    s = x.std()
    if s < 6: polos.append(i)
    else:
        d = [np.abs(x[:-k] - x[k:]).mean() for k in range(24, 241, 8)]
        if min(d) < a.ambang * float(np.median(d)): tile.append(i)  # satu periode jauh lebih mirip daripada geseran lain = konten berulang
    i += 1
def kelompok(fr):
    g = []
    for f in fr:
        if g and f - g[-1][1] <= 1: g[-1][1] = f
        else: g.append([f, f])
    return ', '.join(f'{x}' if x == y else f'{x}-{y}' for x, y in g) or '-'
print(f'{a.video}: {i} frame | tile/rusak: {len(tile)} [{kelompok(tile)}] | polos (cek apakah fade disengaja): {len(polos)} [{kelompok(polos)}]')
raise SystemExit(1 if tile else 0)
