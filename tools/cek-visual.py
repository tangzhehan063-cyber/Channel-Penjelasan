#!/usr/bin/env python3
"""Cek visual "fakta rumah": perpaduan warna material, kontras, dan bentuk, langsung dari still hasil render.

Dua mode (aturan: arsip/style-lama/identitas.md, palet: style/palet.json):
  python3 tools/cek-visual.py palet
      validasi semua preset palet (kontras aksen/teks, tinta, beda hue). Keluar 1 bila ada GAGAL.
  python3 tools/cek-visual.py frame <preset> <still1.png> [still2.png ...] [--extra #f6c445,#...]
      analisis tiap still: latar cocok palet?, warna di luar palet (hue), jumlah keluarga warna dominan,
      kontras objek vs latar, warna neon, kebulatan bentuk (rasio sudut tajam terhadap tepi).
      --extra = warna tambahan yang sengaja dipakai video ini (mis. kuning cahaya) supaya tidak dihitung "di luar palet".
Hanya numpy + Pillow. Keluaran ringkas: GAGAL (wajib diperbaiki) / SARAN (pertimbangkan) / info.
"""
import sys, json, colorsys, pathlib
import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAL = json.load(open(ROOT / "style/palet.json", encoding="utf8"))
RULE = PAL["aturan"]


def rgb(h):
    h = h.lstrip("#"); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def lin(c):
    c = np.asarray(c, dtype=float) / 255.0
    return np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def lum(c):
    l = lin(c); return 0.2126 * l[..., 0] + 0.7152 * l[..., 1] + 0.0722 * l[..., 2]


def cr(a, b):
    la, lb = float(lum(rgb(a))), float(lum(rgb(b)))
    hi, lo = max(la, lb), min(la, lb); return (hi + 0.05) / (lo + 0.05)


def hue(h):
    r, g, b = [x / 255 for x in rgb(h)]; return colorsys.rgb_to_hsv(r, g, b)[0] * 360


def hd(a, b):
    d = abs(a - b) % 360; return min(d, 360 - d)


# ---------------- mode palet ----------------
def cmd_palet():
    fail = 0
    print(f"{'preset':10s} {'aksen/latar':>11s} {'cool/latar':>10s} {'good/latar':>10s} {'aksenT/kartu':>12s} {'coolT/kartu':>11s} {'goodT/kartu':>11s} {'tinta/latar':>11s}  hasil")
    for k, p in PAL["presets"].items():
        probs = []
        a, c, g = cr(p["accent"], p["bg"]), cr(p["cool"], p["bg"]), cr(p["good"], p["bg"])
        at, ct, gt = cr(p["accentTeks"], PAL["kartu"]), cr(p["coolTeks"], PAL["kartu"]), cr(p["goodTeks"], PAL["kartu"])
        ti = cr(PAL["ink"], p["bg"])
        for n, v, lim in (("aksen/latar", a, RULE["kontrasAksenDiLatar"]), ("cool/latar", c, RULE["kontrasAksenDiLatar"]), ("good/latar", g, RULE["kontrasAksenDiLatar"]),
                          ("aksenTeks/kartu", at, RULE["kontrasTeksDiKartu"]), ("coolTeks/kartu", ct, RULE["kontrasTeksDiKartu"]), ("goodTeks/kartu", gt, RULE["kontrasTeksDiKartu"])):
            if v < lim: probs.append(f"{n} {v:.1f} < {lim}")
        if p["terang"] and ti < RULE["kontrasTintaDiLatarTerang"]: probs.append(f"tinta/latar {ti:.1f}")
        ha, hc, hg = hue(p["accent"]), hue(p["cool"]), hue(p["good"])
        if min(hd(ha, hc), hd(ha, hg), hd(hc, hg)) < 40: probs.append("hue aksen/cool/good terlalu dekat (<40°)")
        if probs: fail += 1
        print(f"{k:10s} {a:11.1f} {c:10.1f} {g:10.1f} {at:12.1f} {ct:11.1f} {gt:11.1f} {ti:11.1f}  {'OK' if not probs else 'GAGAL: ' + '; '.join(probs)}")
    print(f"\nHasil: {fail} preset GAGAL dari {len(PAL['presets'])}")
    sys.exit(1 if fail else 0)


# ---------------- mode frame ----------------
def to_hsv(a):
    a = a.astype(float) / 255.0; r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(-1), a.min(-1); d = mx - mn
    h = np.zeros_like(mx)
    m = d > 1e-9
    rc = m & (mx == r); gc = m & (mx == g) & ~rc; bc = m & ~rc & ~gc
    h[rc] = ((g - b)[rc] / d[rc]) % 6; h[gc] = (b - r)[gc] / d[gc] + 2; h[bc] = (r - g)[bc] / d[bc] + 4
    s = np.where(mx > 0, d / np.maximum(mx, 1e-9), 0)
    return h * 60, s, mx


def corner_ratio(gray, mask):
    """rasio piksel sudut tajam / piksel tepi pada area objek berwarna (kecil = bentuk membulat)."""
    gy, gx = np.gradient(gray)
    ixx, iyy, ixy = gx * gx, gy * gy, gx * gy
    def box(a):
        k = np.ones(3) / 3
        a = np.apply_along_axis(lambda v: np.convolve(v, k, mode="same"), 0, a)
        return np.apply_along_axis(lambda v: np.convolve(v, k, mode="same"), 1, a)
    sxx, syy, sxy = box(ixx), box(iyy), box(ixy)
    R = sxx * syy - sxy ** 2 - 0.05 * (sxx + syy) ** 2
    mag = np.hypot(gx, gy)
    # tepi dan sudut hanya di sekitar objek berwarna
    near = mask.copy()
    for _ in range(3):
        near = near | np.roll(near, 1, 0) | np.roll(near, -1, 0) | np.roll(near, 1, 1) | np.roll(near, -1, 1)
    edges = (mag > 0.08) & near
    corners = (R > 0.0003) & near
    return corners.sum() / max(1, edges.sum()), int(edges.sum())


def cmd_frame(preset, files, extra):
    if preset not in PAL["presets"]:
        sys.exit(f"preset '{preset}' tidak ada; pilih: {', '.join(PAL['presets'])}")
    p = PAL["presets"][preset]
    allowed = [hue(p["accent"]), hue(p["cool"]), hue(p["good"])] + [hue(x) for x in extra]
    bgs = [np.array(rgb(p["bg"])), np.array(rgb(p["bg2"]))]
    fail = warn = 0
    print(f"Palet '{preset}' ({p['nama']}); warna tambahan: {', '.join(extra) or '-'}")
    for f in files:
        im = Image.open(f).convert("RGB"); im = im.resize((270, 480))
        a = np.asarray(im)
        h, s, v = to_hsv(a)
        # piksel berwarna = jenuh DAN bukan latar palet (latar berwarna/gradien/bayangan kertas tidak dihitung sebagai objek)
        mid = (bgs[0] + bgs[1]) / 2
        dbgmap = np.minimum.reduce([np.linalg.norm(a.astype(float) - b, axis=-1) for b in (bgs[0], bgs[1], mid)])
        chrom = (s > 0.28) & (v > 0.25) & (dbgmap > 70)
        cover = chrom.mean()
        name = pathlib.Path(f).name
        notes = []
        # latar: median 4 sudut 24x24
        corners = np.concatenate([a[:24, :24].reshape(-1, 3), a[:24, -24:].reshape(-1, 3), a[-24:, :24].reshape(-1, 3), a[-24:, -24:].reshape(-1, 3)])
        bgm = np.median(corners, 0)
        dbg = min(np.linalg.norm(bgm - b) for b in bgs)
        if cover > 0.6:
            notes.append(f"layar penuh berwarna ({cover:.0%}), cek latar dilewati")
        elif dbg > 55:
            notes.append(("GAGAL", f"latar {tuple(int(x) for x in bgm)} jauh dari palet (selisih {dbg:.0f}); pakai preset lain atau samakan"))
        # warna di luar palet
        if chrom.sum() > 200:
            hh = h[chrom]
            off = np.array([min(hd(x, al) for al in allowed) > 22 for x in hh[::7]]).mean() * 100
            if off > RULE["diLuarPaletMaksPersen"]:
                notes.append(("SARAN", f"{off:.0f}% warna berwarna di luar palet (>{RULE['diLuarPaletMaksPersen']}%); tambah ke --extra bila memang sengaja"))
            bins = np.histogram(hh, bins=12, range=(0, 360))[0] / len(hh)
            fam = int((bins >= 0.05).sum())
            if fam > RULE["warnaDominanMaks"]:
                notes.append(("SARAN", f"{fam} keluarga warna dominan (maks {RULE['warnaDominanMaks']}); kurangi supaya perpaduan tenang"))
            neon = ((s[chrom] > RULE["jenuhMaks"]) & (v[chrom] > 0.85)).mean() * 100
            if neon > 3:
                notes.append(("GAGAL", f"{neon:.0f}% piksel neon (jenuh >{RULE['jenuhMaks']}, terang); larangan di sutradara B.10"))
            # kontras objek vs latar
            if cover > 0.004:
                lo = lum(a[chrom]); lb = float(lum(bgm))
                med = float(np.median(lo))
                ratio = (max(med, lb) + 0.05) / (min(med, lb) + 0.05)
                if ratio < 1.25: notes.append(("GAGAL", f"objek hampir sama terang dengan latar (rasio {ratio:.2f}); beri outline/ganti warna"))
                elif ratio < 1.8: notes.append(("SARAN", f"kontras objek vs latar rendah ({ratio:.2f}); disarankan >= 1,8"))
            # bentuk
            gray = (0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]) / 255.0
            cr_, ne = corner_ratio(gray, chrom)
            if ne > 400:
                notes.append(f"kebulatan kasar: rasio sudut/tepi {cr_:.3f} (info saja; hasil bergantung palet dan teks di frame, patokan bentuk ada di cek-sutradara bagian 7)")
        line = f"- {name}: latar≈{tuple(int(x) for x in bgm)}, berwarna {cover:.0%}"
        for n in notes:
            if isinstance(n, tuple):
                tag, msg = n
                if tag == "GAGAL": fail += 1
                else: warn += 1
                line += f"\n    {tag} {msg}"
            else:
                line += f"\n    info  {n}"
        print(line)
    print(f"\nHasil: {fail} GAGAL, {warn} SARAN")
    sys.exit(1 if fail else 0)


if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in ("palet", "frame"):
        print(__doc__); sys.exit(2)
    if sys.argv[1] == "palet":
        cmd_palet()
    else:
        args = sys.argv[2:]; extra = []
        if "--extra" in args:
            i = args.index("--extra"); extra = [x for x in args[i + 1].split(",") if x]; del args[i:i + 2]
        cmd_frame(args[0], args[1:], extra)
