#!/usr/bin/env python3
"""Animatic E1: video kasar resolusi rendah dari komposisi Remotion yang sama (renderer nyata, bukan sketsa).

Pakai: python3 tools/animatic.py <Komposisi> [--shots e1/NN/shots.json] [--frames A-B | --dtk MULAI-AKHIR] [--skala 0.25] -o e1/NN/animatic.mp4
Bila --shots diberikan dan --dtk tidak, rentang diambil dari shot pertama sampai terakhir.
Audio ikut dari komposisi (VO uji) lewat Remotion. Skala 0.25 => 270x480, render cepat dibanding render penuh.
Tonton sebagai urutan: durasi shot, ritme, gerak kamera, transisi. Perubahan dilakukan di shots.json lalu animatic dirender ulang.
"""
import argparse, json, os, subprocess, sys
ap = argparse.ArgumentParser(); ap.add_argument('komposisi'); ap.add_argument('--shots'); ap.add_argument('--frames'); ap.add_argument('--dtk'); ap.add_argument('--skala', default='0.25')
ap.add_argument('-o', '--out', required=True); ap.add_argument('--fps', type=int, default=30)
a = ap.parse_args()
if a.frames: fr = a.frames
elif a.dtk: s, e = (float(x) for x in a.dtk.split('-')); fr = f'{int(s * a.fps)}-{int(e * a.fps) - 1}'
elif a.shots:
    S = json.load(open(a.shots))['shots']; s = min(x['mulai'] for x in S); e = max(x['mulai'] + x['durasi'] for x in S); fr = f'{int(s * a.fps)}-{int(e * a.fps) - 1}'
else: fr = None
rem = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'remotion'); out = os.path.abspath(a.out); os.makedirs(os.path.dirname(out), exist_ok=True)
cmd = ['npx', 'remotion', 'render', 'src/index.ts', a.komposisi, out, f'--scale={a.skala}', '--crf=30'] + ([f'--frames={fr}'] if fr else [])
print(' '.join(cmd)); sys.exit(subprocess.run(cmd, cwd=rem).returncode)
