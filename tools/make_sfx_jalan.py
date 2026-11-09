#!/usr/bin/env python3
"""SFX tambahan tema jalan/kendaraan (video #9), disintesis bebas lisensi.
Pakai: python3 tools/make_sfx_jalan.py <folder_out>"""
import sys, wave, os
import numpy as np
SR = 44100; rng = np.random.default_rng(9); out = sys.argv[1]; os.makedirs(out, exist_ok=True)
def t(d): return np.arange(int(SR * d)) / SR
def lp(x, k): return np.convolve(x, np.ones(k) / k, mode='same')
def save(name, x, peak=0.8):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak; f = int(0.02 * SR); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
    with wave.open(os.path.join(out, name + '.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
# mesin mobil mendekat (4 dtk): dengung 2 harmonik + noise, makin keras
x = t(4.0); f = 38 + 6 * x / 4; ph = 2 * np.pi * np.cumsum(f) / SR
en = (np.sin(ph) + 0.6 * np.sin(2 * ph) + 0.3 * np.sin(3 * ph)) * (1 + 0.25 * np.sin(2 * np.pi * 11 * x)) + 0.4 * lp(rng.normal(0, 1, len(x)), 30)
save('engine', lp(en, 6) * (0.25 + 0.75 * (x / 4) ** 1.5), 0.6)
# decit ban (1,2 dtk): nada tinggi bergetar + desis
x = t(1.2); f = 1900 + 120 * np.sin(2 * np.pi * 23 * x) - 300 * x
sq = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.6 + 0.5 * (rng.normal(0, 1, len(x)) - lp(rng.normal(0, 1, len(x)), 8))
save('screech', sq * np.minimum(1, x / 0.05) * np.exp(-np.maximum(0, x - 0.8) / 0.15), 0.5)
# benturan pelan ke pagar (kayu): dug + kretek
x = t(0.5); th = np.sin(2 * np.pi * 70 * x) * np.exp(-x / 0.08) + 0.6 * lp(rng.normal(0, 1, len(x)), 5) * np.exp(-x / 0.05)
save('thud', th, 0.85)
# lonceng kasir "ting"
x = t(1.0); save('ting', (np.sin(2 * np.pi * 2637 * x) + 0.4 * np.sin(2 * np.pi * 3951 * x)) * np.minimum(1, x / 0.002) * np.exp(-x / 0.3), 0.45)
print('ok')
