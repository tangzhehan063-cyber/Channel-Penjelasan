#!/usr/bin/env python3
"""SFX halus + ambient untuk style pengetahuan, disintesis (bebas lisensi).
Pakai: python3 tools/make_sfx.py <folder_out> [durasi_ambient_detik]"""
import sys, wave, os
import numpy as np

SR = 44100
rng = np.random.default_rng(5)
out = sys.argv[1]; amb_dur = float(sys.argv[2]) if len(sys.argv) > 2 else 47
os.makedirs(out, exist_ok=True)

def t(d): return np.arange(int(SR * d)) / SR
def env(n, a=0.005, r=0.2):
    x = np.arange(n) / SR
    return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / r)
def lp(x, k):  # low-pass sederhana (rata-rata bergerak)
    return np.convolve(x, np.ones(k) / k, mode='same')
def save(name, x, peak=0.8):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    fade = min(len(x), int(0.01 * SR)); x[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(os.path.join(out, name + '.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

# tetes air: sinus dengan pitch naik cepat
x = t(0.35); f = 600 + 1400 * (1 - np.exp(-x / 0.03))
save('drip', np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.002, 0.06))
# kresek cat: impuls acak jarang, difilter
n = int(SR * 0.9); c = np.zeros(n); idx = rng.integers(0, n, 140); c[idx] = rng.uniform(-1, 1, 140)
c = lp(c, 6) * np.hanning(n); save('crackle', c, 0.6)
# whoosh lembut: noise ter-filter, naik-turun
n = int(SR * 0.7); w0 = lp(rng.normal(0, 1, n), 40) * np.hanning(n) ** 1.5; save('whoosh', w0, 0.55)
# desir aliran air
n = int(SR * 1.2); fl = lp(rng.normal(0, 1, n), 14) * np.hanning(n) * (1 + 0.3 * np.sin(2 * np.pi * 7 * t(1.2))); save('flow', fl, 0.4)
# tick
x = t(0.08); save('tick', np.sin(2 * np.pi * 2400 * x) * env(len(x), 0.0005, 0.012), 0.6)
# kriuk kristal: banyak tick tinggi acak
n = int(SR * 1.0); cr = np.zeros(n)
for s in rng.integers(0, n - 3000, 40):
    ff = rng.uniform(3000, 6000); xx = t(0.03); cr[s:s + len(xx)] += np.sin(2 * np.pi * ff * xx) * env(len(xx), 0.0003, 0.006) * rng.uniform(0.3, 1)
save('crystal', cr * np.hanning(n), 0.5)
# pop kecil
x = t(0.18); f = 900 * np.exp(-x / 0.04) + 180
save('pop', np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.001, 0.05), 0.7)
# buzzer lembut "nggak"
x = t(0.42); bz = (np.sin(2 * np.pi * 140 * x) + 0.4 * np.sin(2 * np.pi * 210 * x)) * np.minimum(1, x / 0.02) * np.exp(-x / 0.25)
save('buzz', lp(bz, 4), 0.5)
# riser pendek
x = t(1.6); f = 200 + 500 * (x / 1.6) ** 2
rs = np.sin(2 * np.pi * np.cumsum(f) / SR) * (x / 1.6) ** 2 * 0.5 + lp(rng.normal(0, 1, len(x)), 20) * (x / 1.6) ** 3
save('riser', rs, 0.45)
# chime lega (dua nada)
x = t(1.6); ch = sum(a * np.sin(2 * np.pi * fq * x) * env(len(x), 0.003, 0.5) for fq, a in [(1046.5, 1), (1568, 0.6), (2093, 0.25)])
ch2 = np.zeros_like(ch); d = int(0.12 * SR); ch2[d:] = (np.sin(2 * np.pi * 1318.5 * x) * env(len(x), 0.003, 0.5))[:-d]
save('chime', ch + 0.8 * ch2, 0.5)
# ketukan pelan di tembok
x = t(0.25); kn = (np.sin(2 * np.pi * 110 * x) + 0.5 * lp(rng.normal(0, 1, len(x)), 8)) * env(len(x), 0.001, 0.04)
save('knock', kn, 0.7)

# ambient: pad lembut + nada piano jarang (A minor / F mayor), sangat pelan
x = t(amb_dur); pad = np.zeros_like(x)
chords = [[220, 261.6, 329.6], [174.6, 220, 261.6], [196, 246.9, 293.7], [164.8, 207.7, 246.9]]
seg = 6.0
for i, ch in enumerate(chords * int(amb_dur // (seg * 4) + 1)):
    s0 = i * seg
    if s0 >= amb_dur: break
    m = np.clip(np.minimum((x - s0) / 1.5, (s0 + seg + 1.5 - x) / 1.5), 0, 1)
    for fq in ch: pad += m * (np.sin(2 * np.pi * fq * x) + 0.3 * np.sin(2 * np.pi * fq * 2.001 * x)) * 0.25
pad = lp(pad, 30)
notes = [659.3, 523.3, 587.3, 493.9, 440, 523.3, 392, 440]
for i, s0 in enumerate(np.arange(0.5, amb_dur - 2, 3.0)):
    fq = notes[i % len(notes)]; xx = t(2.5); k = int(s0 * SR)
    tone = (np.sin(2 * np.pi * fq * xx) + 0.35 * np.sin(2 * np.pi * fq * 2 * xx) + 0.1 * np.sin(2 * np.pi * fq * 3 * xx)) * env(len(xx), 0.004, 0.7)
    pad[k:k + len(tone)] += tone[:len(pad) - k] * 0.5
fade = int(1.5 * SR); pad[:fade] *= np.linspace(0, 1, fade); pad[-fade:] *= np.linspace(1, 0, fade)
save('ambient', pad, 0.5)
print('ok', sorted(os.listdir(out)))
