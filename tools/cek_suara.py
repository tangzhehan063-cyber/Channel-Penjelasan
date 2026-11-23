#!/usr/bin/env python3
"""Cek suara VO (dan loudness video) sebelum dipakai. Dibuat setelah E1 #01 v1: VO terlalu tinggi dan "berlagak".

Pakai:
  python3 tools/cek_suara.py audio/x.wav --kata 146              # cek VO
  python3 tools/cek_suara.py audio/x.wav --kata 146 --video remotion/out/x-final.mp4   # + loudness video akhir
Acuan: VO #23 yang diterima user (F0 median 171 Hz, p90 300 Hz, 2,58 kata/dtk). Ganti dengan --ref.
Keluar kode 1 bila ada GAGAL. Hanya numpy + ffmpeg.
"""
import argparse, json, re, subprocess, sys, wave
import numpy as np

def load(p):
    w = wave.open(p); n = w.getnframes(); sr = w.getframerate(); ch = w.getnchannels()
    a = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32) / 32768
    return (a.reshape(-1, ch).mean(1) if ch > 1 else a), sr

def f0(a, sr):
    fl, hop, out = int(sr * 0.04), int(sr * 0.02), []
    lo, hi = int(sr / 400), int(sr / 70)
    for i in range(0, len(a) - fl, hop):
        x = a[i:i + fl]
        if np.sqrt((x ** 2).mean()) < 0.02: continue
        x = x - x.mean(); ac = np.correlate(x, x, 'full')[fl - 1:]; k = np.argmax(ac[lo:hi]) + lo
        if ac[k] / ac[0] > 0.4: out.append(sr / k)
    return np.array(out)

def stat(p):
    a, sr = load(p); fz = f0(a, sr)
    return {'dur': len(a) / sr, 'f0': float(np.median(fz)), 'p10': float(np.percentile(fz, 10)), 'p90': float(np.percentile(fz, 90)), 'peak': float(np.abs(a).max())}

def lufs(p):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-i', p, '-af', 'loudnorm=I=-14:TP=-1.5:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    j = json.loads(re.search(r'\{.*\}', o, re.S).group(0)); return float(j['input_i']), float(j['input_tp'])

ap = argparse.ArgumentParser(); ap.add_argument('wav'); ap.add_argument('--kata', type=int, required=True); ap.add_argument('--ref', default='naskah/video-23-sifon-pipa-u.wav'); ap.add_argument('--video')
a = ap.parse_args()
s, r = stat(a.wav), stat(a.ref); tempo = a.kata / s['dur']; bad = []
print(f"VO   : {s['dur']:.1f} dtk, {tempo:.2f} kata/dtk, F0 median {s['f0']:.0f} Hz, p10-p90 {s['p10']:.0f}-{s['p90']:.0f} Hz, puncak {s['peak']:.2f}")
print(f"Acuan: F0 median {r['f0']:.0f} Hz, p90 {r['p90']:.0f} Hz")
if abs(s['f0'] - r['f0']) / r['f0'] > 0.12: bad.append(f"nada median {s['f0']:.0f} Hz menyimpang >12% dari acuan {r['f0']:.0f} Hz (terlalu {'tinggi/berlagak' if s['f0'] > r['f0'] else 'rendah'})")
if s['p90'] > r['p90'] * 1.1: bad.append(f"rentang nada p90 {s['p90']:.0f} Hz terlalu lebar (>{r['p90'] * 1.1:.0f}): intonasi dibuat-buat")
if not 2.2 <= tempo <= 2.8: bad.append(f"tempo {tempo:.2f} kata/dtk di luar 2,2-2,8")
if not 50 <= s['dur'] <= 70: bad.append(f"durasi {s['dur']:.1f} dtk di luar 50-70")
if s['peak'] >= 0.99: bad.append('audio clipping (puncak >= 0,99)')
if a.video:
    i, tp = lufs(a.video); print(f"Video: {i:.1f} LUFS, true peak {tp:.1f} dB")
    if not -15 <= i <= -13: bad.append(f"loudness video {i:.1f} LUFS di luar -15..-13")
    if tp > -1.0: bad.append(f"true peak {tp:.1f} dB > -1,0")
for b in bad: print('GAGAL:', b)
print('OK: suara lolos' if not bad else f'{len(bad)} GAGAL')
sys.exit(1 if bad else 0)
