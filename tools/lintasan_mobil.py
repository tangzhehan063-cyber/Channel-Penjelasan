#!/usr/bin/env python3
"""Lintasan mobil mundur #03 (tiang listrik): hitung jalur sumbu belakang (Catmull-Rom), arah mobil dari singgung,
lalu periksa celah bodi ke tiang dan tiang gerbang dan kelengkungan (batas belok roda depan).
Keluaran: remotion/src/e1/tiang03-lintasan.json (sampel [x,y,arah] per 2 px). Skala 1 m = 48 px.
Pakai: python3 tools/lintasan_mobil.py [--cek]   (kode keluar 1 bila celah < batas)
"""
import json, math, sys
PX = 48
L_BELAKANG, WHEELBASE, L_DEPAN, LEBAR = 0.9*PX, 2.7*PX, 0.8*PX, 1.8*PX   # dari sumbu belakang
TIANG = (540.0, 1090.0, 11.0)                      # x, y, jari-jari (Ø 0,46 m dilebihkan dari 0,3 m agar terbaca); 2,9 m di depan garis pagar
POS_GERBANG = [(440.0, 950.0, 7.0), (640.0, 950.0, 7.0)]  # tiang gerbang; bukaan 4,2 m (gerbang ganda umum)
STEER_MAKS = math.radians(33)

def catmull(pts, n=60):
    P = [pts[0]] + pts + [pts[-1]]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i-1], P[i], P[i+1], P[i+2]
        for k in range(n):
            t = k / n
            out.append(tuple(0.5*((2*p1[j]) + (-p0[j]+p2[j])*t + (2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t*t + (-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t**3) for j in (0, 1)))
    out.append(pts[-1]); return out

def resample(poly, step=2.0):
    out = [poly[0]]; acc = 0.0
    for a, b in zip(poly, poly[1:]):
        d = math.dist(a, b)
        while acc + d >= step:
            r = (step - acc) / d; a = (a[0] + (b[0]-a[0])*r, a[1] + (b[1]-a[1])*r); out.append(a); d = math.dist(a, b); acc = 0.0
        acc += d
    if math.dist(out[-1], poly[-1]) > 0.5: out.append(poly[-1])
    return out

# Segmen: (nama, arah gerak, titik kendali sumbu belakang). mundur: mobil menghadap berlawanan arah gerak.
SEGMEN = [
  ('lurus',  'mundur', [(540, 790), (540, 1034)]),
  ('maju',   'maju',   [(540, 1034), (540, 770)]),
  ('belok',  'mundur', [(540, 770), (549.76, 880), (585.32, 990), (662.08, 1090), (752.70, 1170), (871.72, 1230), (900, 1245)]),
  ('keluar', 'maju',   [(900, 1245), (700, 1262), (400, 1272), (80, 1278), (-340, 1280)]),
]

def bangun():
    hasil = {}
    for nama, arah, pts in SEGMEN:
        poly = resample(catmull([tuple(map(float, p)) for p in pts]))
        samp = []
        for i, p in enumerate(poly):
            a = poly[min(i+1, len(poly)-1)]; b = poly[max(i-1, 0)]
            dx, dy = a[0]-b[0], a[1]-b[1]
            if dx == 0 and dy == 0: dx, dy = poly[-1][0]-poly[-2][0], poly[-1][1]-poly[-2][1]
            th = math.atan2(dy, dx)                  # arah gerak
            head = th + math.pi if arah == 'mundur' else th   # arah hadap mobil
            samp.append((round(p[0], 2), round(p[1], 2), round(head, 4)))
        hasil[nama] = {'arah': arah, 'sampel': samp}
    return hasil

def badan(x, y, h):
    c, s = math.cos(h), math.sin(h)
    def w(f, l): return (x + c*f - s*l, y + s*f + c*l)
    return [w(-L_BELAKANG, -LEBAR/2), w(WHEELBASE+L_DEPAN, -LEBAR/2), w(WHEELBASE+L_DEPAN, LEBAR/2), w(-L_BELAKANG, LEBAR/2)]

def jarak_titik_poligon(p, poly):
    # jarak titik ke poligon konveks (0 bila di dalam)
    n = len(poly); inside = True; best = 1e9
    for i in range(n):
        a, b = poly[i], poly[(i+1) % n]
        ex, ey = b[0]-a[0], b[1]-a[1]; t = max(0, min(1, ((p[0]-a[0])*ex + (p[1]-a[1])*ey)/(ex*ex+ey*ey)))
        best = min(best, math.dist(p, (a[0]+ex*t, a[1]+ey*t)))
        if ex*(p[1]-a[1]) - ey*(p[0]-a[0]) < 0: inside = False
    return 0 if inside else best

def cek(h):
    laporan = []; gagal = False
    for nama, d in h.items():
        S = d['sampel']; mn_t = mn_g = 1e9; kmax = 0
        for i, (x, y, hd) in enumerate(S):
            B = badan(x, y, hd)
            mn_t = min(mn_t, jarak_titik_poligon(TIANG[:2], B) - TIANG[2])
            for gx, gy, r in POS_GERBANG: mn_g = min(mn_g, jarak_titik_poligon((gx, gy), B) - r)
            if 2 <= i < len(S)-2:
                dh = (S[i+1][2] - S[i-1][2] + math.pi) % (2*math.pi) - math.pi; ds = 4.0
                kmax = max(kmax, abs(dh)/ds)
        steer = math.degrees(math.atan(WHEELBASE * kmax))
        laporan.append((nama, round(mn_t, 1), round(mn_g, 1), round(steer, 1)))
        if nama in ('belok', 'keluar'):
            if mn_t < 5 or mn_g < 5 or steer > math.degrees(STEER_MAKS): gagal = True
    return laporan, gagal

if __name__ == '__main__':
    h = bangun(); lap, gagal = cek(h)
    print('segmen | celah min ke tiang (px) | celah min ke tiang gerbang (px) | sudut setir maks (derajat, batas 33)')
    for r in lap: print(*r, sep=' | ')
    json.dump({'px_per_m': PX, 'mobil': {'belakang': L_BELAKANG, 'wheelbase': WHEELBASE, 'depan': L_DEPAN, 'lebar': LEBAR}, 'tiang': TIANG, 'gerbang': POS_GERBANG, 'segmen': h},
              open('remotion/src/e1/tiang03-lintasan.json', 'w'), separators=(',', ':'))
    print('GAGAL: celah < 5 px atau setir > 33 derajat' if gagal else 'OK: lintasan lolos (celah >= 5 px, setir <= 33 derajat)')
    sys.exit(1 if gagal else 0)
