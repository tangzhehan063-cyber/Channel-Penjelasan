#!/usr/bin/env python3
"""Validator shot list E1 (skema: .claude/skills/visual-director/style/visual/shots-skema.md).

Pakai: python3 tools/cek_shots.py e1/NN/shots.json [--dur DETIK]
Keluar kode 1 bila ada GAGAL. PERINGATAN tidak menggagalkan, tapi harus dibaca.
Memeriksa struktur dan variasi; TIDAK menilai apakah videonya bagus (itu tugas menonton).
"""
import json, sys, argparse

KAMERA = {'push', 'pull', 'dolly-in', 'crane-turun', 'crane-naik', 'orbit', 'tracking', 'pan', 'tilt', 'macro', 'pov', 'terkunci', 'whip', 'rack-focus'}
MODE = {'footage', '3d', '2d', 'tipografi', 'data', 'hening'}
PERAN = {'bukti', 'konteks', 'jangkar-ke-3D', 'callback'}
WAJIB = ['id', 'ref_kalimat', 'mulai', 'durasi', 'tujuan_visual', 'mode', 'alasan_mode', 'subjek', 'lingkungan', 'ukuran_shot', 'sudut_kamera',
         'gerak_kamera', 'gerak_subjek', 'cahaya', 'komposisi', 'kedalaman', 'fokus', 'teks', 'transisi', 'frame_akhir', 'aset', 'implementasi']
FOOT = ['sumber', 'peran', 'alasan', 'bagian', 'crop', 'gerak', 'transisi_masuk', 'transisi_keluar', 'relasi_narasi']
UKURAN = {'lebar', 'sedang', 'dekat', 'detail'}

ap = argparse.ArgumentParser(); ap.add_argument('berkas'); ap.add_argument('--dur', type=float, default=None)
a = ap.parse_args()
d = json.load(open(a.berkas)); S = d.get('shots', []); pilot = d.get('skala') == 'pilot'
gagal, warn = [], []
G = lambda m: gagal.append(m); W = lambda m: warn.append(m)

if not S: G('tidak ada shot')
ids = set()
for i, s in enumerate(S):
    k = s.get('id', f'#{i}')
    if k in ids: G(f'{k}: id ganda')
    ids.add(k)
    for f in WAJIB:
        if f not in s or s[f] in (None, '') : G(f'{k}: kolom "{f}" kosong/tidak ada')
    if s.get('mode') not in MODE: G(f'{k}: mode "{s.get("mode")}" tidak dikenal ({sorted(MODE)})')
    if s.get('ukuran_shot') not in UKURAN: G(f'{k}: ukuran_shot "{s.get("ukuran_shot")}" bukan {sorted(UKURAN)}')
    gk = s.get('gerak_kamera') or {}
    if gk.get('jenis') not in KAMERA: G(f'{k}: gerak_kamera.jenis "{gk.get("jenis")}" tidak dikenal')
    if not gk.get('alasan'): G(f'{k}: gerak_kamera.alasan kosong (kamera tanpa alasan = terkunci)')
    if not isinstance(s.get('durasi'), (int, float)) or s.get('durasi', 0) <= 0: G(f'{k}: durasi tidak valid')
    asetfoto = any(str(x).lower().endswith(('.jpg', '.jpeg', '.png', '.webp')) for x in s.get('aset', []))
    if s.get('mode') == 'footage' or asetfoto:
        ft = s.get('footage') or {}
        for f in FOOT:
            if not ft.get(f): G(f'{k}: footage.{f} kosong')
        if ft.get('peran') and ft['peran'] not in PERAN: G(f'{k}: footage.peran "{ft["peran"]}" bukan {sorted(PERAN)}')
        if ft.get('sumber') and not any(ft['sumber'] in str(x) for x in s.get('aset', [])): W(f'{k}: footage.sumber tidak tercantum di aset')
    if s.get('durasi', 0) > 5 and gk.get('jenis') == 'terkunci' and not s.get('gerak_subjek') and s.get('mode') != 'hening':
        W(f'{k}: {s["durasi"]} dtk terkunci tanpa gerak subjek (shot panjang tanpa perubahan internal)')
    if s.get('durasi', 0) > 5 and not s.get('gerak_subjek') and gk.get('jenis') == 'terkunci' : pass
    narasi = ' '.join(s.get('narasi', '').lower().split()) if isinstance(s.get('narasi'), str) else ''
    for t in s.get('teks', []) or []:
        isi = ' '.join(str(t.get('isi', '')).lower().split())
        if narasi and isi and len(isi.split()) > 3 and isi in narasi: W(f'{k}: teks "{t.get("isi")}" menyalin narasi')
        if not t.get('alasan'): W(f'{k}: teks "{t.get("isi")}" tanpa alasan')

# urutan waktu
S2 = sorted(S, key=lambda s: s.get('mulai', 0))
for p, q in zip(S2, S2[1:]):
    end = p['mulai'] + p['durasi']; gap = q['mulai'] - end
    if abs(gap) > 0.05: G(f'{p["id"]}→{q["id"]}: {"celah" if gap > 0 else "tumpang-tindih"} {gap:+.2f} dtk')
if S2 and a.dur is not None:
    tot = S2[-1]['mulai'] + S2[-1]['durasi'] - S2[0]['mulai']
    if abs(tot - a.dur) > 0.3 and not pilot: G(f'total shot {tot:.2f} dtk ≠ durasi {a.dur:.2f} dtk')

# kontinuitas (dua shot berturut-turut identik)
for p, q in zip(S, S[1:]):
    kp = (p.get('mode'), p.get('ukuran_shot'), (p.get('gerak_kamera') or {}).get('jenis')); kq = (q.get('mode'), q.get('ukuran_shot'), (q.get('gerak_kamera') or {}).get('jenis'))
    if kp == kq: G(f'{p["id"]}→{q["id"]}: mode, ukuran, dan gerak kamera identik berturut-turut ({kp})')

# variasi
jk = {(s.get('gerak_kamera') or {}).get('jenis') for s in S}; md = {s.get('mode') for s in S}
if not pilot or len(S) >= 8:
    if len(jk) < 4: G(f'hanya {len(jk)} jenis gerak kamera (butuh ≥4): {sorted(x for x in jk if x)}')
    if len(md) < 3: G(f'hanya {len(md)} mode visual (butuh ≥3): {sorted(x for x in md if x)}')
    if not any((s.get('gerak_kamera') or {}).get('jenis') == 'terkunci' or s.get('mode') == 'hening' for s in S): G('tidak ada shot diam/hening yang disengaja')
else:
    if len(jk) < 3: W(f'pilot: hanya {len(jk)} jenis kamera')
    if len(md) < 2: W(f'pilot: hanya {len(md)} mode')
du = [s.get('durasi', 0) for s in S]
if len(du) >= 4 and max(du) - min(du) < 0.8: W(f'durasi shot nyaris seragam ({min(du):.1f}-{max(du):.1f} dtk): ritme datar')

print(f'{len(S)} shot, kamera: {sorted(x for x in jk if x)}, mode: {sorted(x for x in md if x)}')
for w in warn: print('PERINGATAN:', w)
for g in gagal: print('GAGAL:', g)
print('OK: shot list lulus validasi struktural' if not gagal else f'{len(gagal)} GAGAL')
sys.exit(1 if gagal else 0)
