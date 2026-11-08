    // ================= SCENE: keramik meledak (popping) =================
    const S = 0.115;
    const sign = (x, a, b, lines, w = 1.45, z = -1.0, sc = 1) => tent(x, z, w, 3.35, 0, win(a, b), printer(lines.map(([tx, f, y, c, fo]) => [tx, f * sc, y, c, fo])));
    const GREY = '#6a6a70';
    const TILE = [240, 236, 226], TILE2 = [226, 220, 206], GROUT = [128, 128, 126], MORT = [178, 172, 158], SLAB = [150, 152, 150];
    const WALLC = [222, 214, 196], HOT = [232, 104, 64], SUNC = [252, 200, 70], OKG = [72, 156, 110], PLINT = [190, 150, 110];
    const ID = (p) => p;
    const rotZ = (pv, a) => (p) => { const dx = p[0] - pv[0], dy = p[1] - pv[1], c = Math.cos(a), s = Math.sin(a); return [pv[0] + dx * c - dy * s, pv[1] + dx * s + dy * c, p[2]]; };
    const jit = (amp, seed) => amp * Math.sin(t * 61 + seed * 7.3) * Math.sin(t * 23 + seed);
    // printed faces
    const slabPaint = (c, w, h) => { const r = H.rng(5); c.fillStyle = 'rgba(60,60,60,0.18)'; for (let i = 0; i < 160; i++) { c.beginPath(); c.arc(r() * w, r() * h, 1 + r() * 3, 0, TAU); c.fill(); } };
    const mortPaint = (c, w, h) => { const r = H.rng(9); c.fillStyle = 'rgba(90,80,60,0.18)'; for (let i = 0; i < 90; i++) c.fillRect(r() * w, r() * h, 2, 2); };
    const tilePaint = (c, w, h) => { const g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.35, 'rgba(255,255,255,0.35)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); };
    const tileTop = (c, w, h) => { c.strokeStyle = 'rgba(160,150,130,0.35)'; c.lineWidth = w * 0.02; c.strokeRect(w * 0.06, h * 0.06, w * 0.88, h * 0.88); const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0.2, 'rgba(255,255,255,0)'); g.addColorStop(0.45, 'rgba(255,255,255,0.4)'); g.addColorStop(0.6, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); };
    // a cross-section slab: concrete + mortar (full, or dabs), z from -ZD to ZD
    const ZD = 0.25, Y1 = 0.46, Y2 = 0.62, TT = 0.15;
    const base = (x, half, u, dabs = null) => {
      if (u <= 0) return; const k = Math.min(1, u);
      box(x - half, 0, -ZD, x + half, Y1 * k, ZD, SLAB, ID, slabPaint);
      if (k < 0.98) return;
      if (!dabs) box(x - half, Y1, -ZD, x + half, Y2, ZD, MORT, ID, mortPaint);
      else dabs.forEach(([a, b, full]) => full ? box(a, Y1, -ZD, b, Y2, ZD, MORT, ID, mortPaint) : box(a, Y1, -ZD * 0.6, b, Y2, ZD * 0.6, MORT.map((v) => v * 0.97), ID, mortPaint));
    };
    const tileB = (x0, x1, col, T = ID, y0 = Y2) => box(x0, y0, -ZD, x1, y0 + TT, ZD, col, T, tilePaint, -0.01);
    const wall = (x, side, u, hgt = 1.45) => { if (u <= 0) return; const k = Math.min(1, u), w = 0.16; box(side < 0 ? x - w : x, 0, -ZD - 0.03, side < 0 ? x : x + w, hgt * k, ZD + 0.03, WALLC, ID, (c, w2, h2) => { c.strokeStyle = 'rgba(120,90,70,0.25)'; c.lineWidth = 3; for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(0, h2 * i / 6); c.lineTo(w2, h2 * i / 6); c.stroke(); } }); };
    // heat waves rising
    const heat = (x0, x1, y, u, n = 4) => { if (u <= 0) return; for (let i = 0; i < n; i++) { const xx = H.lerp(x0, x1, (i + 0.5) / n), ph = t * 3 + i * 1.7; const pts = []; for (let j = 0; j <= 6; j++) pts.push([xx + 0.05 * Math.sin(ph + j * 1.2), y + j * 0.09, 0.3]); polyStrip(pts, 6 * Math.min(1, u) * (0.6 + 0.4 * ((i % 2) ? 1 : 0.8)), 0.018, HOT); } };
    // the sun: a paper disc with rays
    const sun = (c, r, u) => { if (u <= 0) return; const k = Math.min(1, u); disc(c, r * k, 0.05, SUNC, [0, 0, 1], 0, 18); for (let i = 0; i < 10; i++) { const a = i * TAU / 10 + t * 0.4, d = [Math.cos(a), Math.sin(a), 0]; strip(add(c, mul(d, r * k * 1.25)), add(c, mul(d, r * k * (1.7 + 0.08 * Math.sin(t * 5 + i)))), 0.02 * k, SUNC.map((v) => v * 0.95)); } };
    // DUK! starburst cut-out
    const BURST_O = (() => { const P = []; for (let i = 0; i < 22; i++) { const a = Math.PI / 2 + i * TAU / 22, r = i % 2 ? 0.2 : 0.34; P.push([Math.cos(a) * r * 1.25, 0.36 + Math.sin(a) * r]); } return { P, bb: [Math.min(...P.map((p) => p[0])), Math.min(...P.map((p) => p[1])), Math.max(...P.map((p) => p[0])), Math.max(...P.map((p) => p[1]))] }; })();
    const paintBurst = (txt) => (c, w, h, M, O) => { c.fillStyle = '#ffd64a'; c.fillRect(0, 0, w, h); const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.5); g.addColorStop(0, '#fff2b0'); g.addColorStop(1, 'rgba(255,214,74,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = '#d9472c'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = SG(w * 0.24); c.fillText(txt, w / 2, h * 0.53); rim(c, M, O, 8); };
    const shards = (c0, t0, n, seed) => { const r = H.rng(seed); for (let i = 0; i < n; i++) { const vx = (r() - 0.5) * 1.6, vy = 1.2 + r() * 1.2, vz = 0.2 + r() * 0.8, s = 0.03 + r() * 0.03, sd = r() * 10; const u = t - t0; if (u <= 0) continue; const tt = Math.min(u, 0.9); let y = c0[1] + vy * tt - 4.5 * tt * tt; y = Math.max(0.02, y); rock([c0[0] + vx * tt, y, c0[2] + vz * tt], s, sd, i % 3 ? TILE : TILE2, 1, 0.45); } };
    const card = (x, z, w, h, a, b, lines, col = CREAM, rot = 0) => tent(x, z, w, h, rot, win(a, b), printer(lines), col);

    // ---- station 1 (hook): a tiled floor; two tiles snap up into a tent with a DUK! ----
    {
      const fu = pop(0.15, 0.6) * (1 - seg(3.9, 4.3));
      if (fu > 0) {
        const k = Math.min(1, fu), n = 6, s = 0.46, g = 0.04, x0 = X1 - (n * (s + g) - g) / 2;
        const shake = t > 0.9 && t < 1.25 ? 1 : 0, a = 0.72 * Math.min(1.12, pop(1.25, 0.28));
        for (let r = 0; r < 4; r++) for (let i = 0; i < n; i++) {
          const xa = x0 + i * (s + g), za = -0.45 + r * (s + g) * k, T0 = (p) => [p[0] + jit(0.01 * shake, i + r * 7), p[1], p[2]];
          if (r === 1 && (i === 2 || i === 3)) {
            const pv = i === 2 ? [xa, 0.0] : [xa + s, 0.0], ang = i === 2 ? a : -a;
            if (a > 0.01) face([[xa, 0.003, za], [xa + s, 0.003, za], [xa + s, 0.003, za + s], [xa, 0.003, za + s]], [70, 66, 60]);
            box(xa, 0, za, xa + s, 0.07 * k, za + s, TILE, (p) => T0(rotZ(pv, ang)(p)), tileTop, -0.02);
          } else box(xa, 0, za, xa + s, 0.07 * k, za + s, (i + r) % 2 ? TILE : TILE2, T0);
        }
        if (t > 1.25) { shards([X1, 0.4, 0.3], 1.25, 12, 3); cutout(X1 + 1.0, 0.95, BURST_O, pop(1.28, 0.3) * (1 - seg(3.9, 4.2)), paintBurst('DUK!'), [255, 214, 74], 1.4); }
      }
      sign(X1, 0.05, 2.75, [['Keramik bisa', S * 0.62, 0.11], ['MELEDAK SENDIRI', S * 0.92, 0.21, REDH], ['tanpa disentuh siapa pun', S * 0.55, 0.3, GREY, 'mono']], 1.45, -0.8);
      sign(X1, 2.55, 4.4, [['Bukan mistis,', S * 0.62, 0.11], ['INI FISIKA', S * 1.15, 0.21, TEALH], ['panas + celah + perekat', S * 0.55, 0.3, GREY, 'mono']], 1.45, -0.8);
    }

    // ---- station 2: cross-section; the sun heats the tiles and they grow (expansion) ----
    {
      const u = pop(4.6, 0.55) * (1 - seg(11.0, 11.4));
      if (u > 0) {
        const n = 6, P = 0.4, half = n * P / 2 + 0.02, hk = seg(6.0, 8.0) * (1 - seg(10.4, 10.9));
        base(X2, half, u);
        if (u > 0.98) for (let i = 0; i < n; i++) {
          const cx = X2 + (i - (n - 1) / 2) * P, tw = 0.34 * (1 + 0.1 * hk), tu = pop(4.9 + i * 0.07, 0.35);
          if (tu > 0) tileB(cx - tw / 2, cx + tw / 2, i % 2 ? TILE : TILE2, (p) => [p[0], Y2 + (p[1] - Y2) * Math.min(1, tu), p[2]]);
          if (i < n - 1 && tu > 0.9) { const gx = cx + P / 2, gw = (P - tw) / 2; box(gx - gw, Y2, -ZD * 0.98, gx + gw, Y2 + TT * 0.88, ZD * 0.98, hk > 0.5 ? [150, 110, 100] : GROUT, ID, null, 0.02); }
        }
        sun([X2 - 1.0, 1.75, 0.15], 0.24, pop(5.3, 0.5) * (1 - seg(10.6, 11.0)));
        heat(X2 - 1.0, X2 + 1.0, Y2 + TT + 0.05, seg(5.9, 6.8) * (1 - seg(10.4, 10.9)));
        const au = seg(7.0, 7.5) * (1 - seg(10.4, 10.9));
        arrowG([X2 - half + 0.05, 1.05, 0.3], [-1, 0, 0], [0, 1, 0], [0, 0, 1], 0.5, au, HOT, 0.06);
        arrowG([X2 + half - 0.05, 1.05, 0.3], [1, 0, 0], [0, 1, 0], [0, 0, 1], 0.5, au, HOT, 0.06);
        card(X2, 0.95, 0.95, 0.52, 8.2, 10.9, [['lantai 5 m, panas naik 30°C', 0.13, 0.22, GREY, 'mono'], ['± 1 mm memanjang', 0.3, 0.58, REDH], ['(perkiraan)', 0.11, 0.86, GREY, 'mono']]);
      }
      sign(X2, 4.4, 11.2, [['Kena panas, keramik', S * 0.62, 0.11], ['MEMUAI', S * 1.25, 0.21, REDH], ['sedikit, tapi dorongannya kuat', S * 0.5, 0.3, GREY, 'mono']], 1.45, -0.9);
    }

    // ---- station 3: tiles laid tight between two walls; pressure builds, the middle pair pops ----
    {
      const u = pop(11.5, 0.55) * (1 - seg(19.0, 19.4));
      if (u > 0) {
        const L = 2.4, x0 = X3 - L / 2, n = 6, s = L / n;
        base(X3, L / 2, u); wall(x0, -1, u); wall(x0 + L, 1, u);
        const hk = seg(12.3, 13.4), shake = t > 13.6 && t < 14.6 ? (t - 13.6) : 0, a = 0.5 * Math.min(1.1, pop(14.6, 0.25));
        if (u > 0.98) for (let i = 0; i < n; i++) {
          const xa = x0 + i * s, tu = pop(11.8 + i * 0.06, 0.35); if (tu <= 0) continue;
          const T0 = (p) => [p[0] + jit(0.012 * shake, i), Y2 + (p[1] - Y2) * Math.min(1, tu), p[2]];
          if ((i === 2 || i === 3) && a > 0.005) { const pv = i === 2 ? [xa, Y2] : [xa + s, Y2]; tileB(xa, xa + s, TILE, rotZ(pv, i === 2 ? a : -a)); }
          else tileB(xa + 0.003, xa + s - 0.003, i % 2 ? TILE : TILE2, T0);
        }
        if (a > 0.05) { face([[X3 - s, Y2 + 0.002, -ZD], [X3 + s, Y2 + 0.002, -ZD], [X3 + s, Y2 + 0.002, ZD], [X3 - s, Y2 + 0.002, ZD]], [92, 86, 76]); polyStrip([[X3 - 0.25, Y2 - 0.01, ZD + 0.01], [X3 - 0.12, Y2 - 0.05, ZD + 0.01], [X3, Y2 - 0.02, ZD + 0.01], [X3 + 0.1, Y2 - 0.07, ZD + 0.01], [X3 + 0.24, Y2 - 0.03, ZD + 0.01]], 4 * seg(14.6, 14.9), 0.008, INKC); }
        heat(x0 + 0.2, x0 + L - 0.2, Y2 + TT + 0.05, hk * (1 - seg(16.4, 17.0)), 5);
        const au = seg(13.0, 13.5) * (1 - seg(14.6, 14.9));
        arrowG([x0 + 0.08, 1.1, 0.35], [1, 0, 0], [0, 1, 0], [0, 0, 1], 0.55 + 0.1 * Math.sin(t * 12) * shake, au, HOT, 0.06);
        arrowG([x0 + L - 0.08, 1.1, 0.35], [-1, 0, 0], [0, 1, 0], [0, 0, 1], 0.55 + 0.1 * Math.sin(t * 12) * shake, au, HOT, 0.06);
        if (t > 14.6) { shards([X3, Y2 + 0.35, 0.25], 14.6, 10, 8); cutout(X3 + 0.62, 0.55, BURST_O, pop(14.65, 0.3) * (1 - seg(16.3, 16.6)), paintBurst('DUK!'), [255, 214, 74], 1.3); }
        card(X3, 0.95, 1.0, 0.5, 16.6, 19.2, [['nat =', 0.2, 0.25, GREY, 'mono'], ['RUANG NAPAS KERAMIK', 0.24, 0.65, TEALH]]);
      }
      sign(X3, 11.2, 15.6, [['Dipasang mepet?', S * 0.62, 0.11], ['NGGAK ADA RUANG', S * 0.9, 0.21, REDH], ['keramik saling dorong ke dinding', S * 0.5, 0.3, GREY, 'mono']], 1.45, -0.9);
      sign(X3, 15.4, 19.4, [['Tekanan numpuk, lalu', S * 0.62, 0.11], ['POPPING!', S * 1.25, 0.21, REDH], ['terangkat + bunyi keras', S * 0.55, 0.3, GREY, 'mono']], 1.45, -0.9);
    }

    // ---- station 4: hollow (kopong) under a tile: tap test, then water gets in ----
    {
      const u = pop(19.8, 0.55) * (1 - seg(27.6, 28.0));
      if (u > 0) {
        const s = 0.74, g = 0.05, x0 = X4 - (3 * s + 2 * g) / 2, half = (3 * s + 2 * g) / 2 + 0.03;
        const m1 = x0 + s + g;
        base(X4, half, u, [[X4 - half, m1 - g / 2, true], [m1 + 0.04, m1 + 0.14, false], [m1 + s / 2 - 0.05, m1 + s / 2 + 0.05, false], [m1 + s - 0.14, m1 + s - 0.04, false], [m1 + s + g / 2, X4 + half, true]]);
        if (u > 0.98) face([[m1, Y1 + 0.003, -ZD * 0.62], [m1 + s, Y1 + 0.003, -ZD * 0.62], [m1 + s, Y2 - 0.003, -ZD * 0.62], [m1, Y2 - 0.003, -ZD * 0.62]], [48, 44, 40], { bias: 0.04 });
        if (u > 0.98) for (let i = 0; i < 3; i++) {
          const xa = x0 + i * (s + g), tu = pop(20.1 + i * 0.08, 0.35); if (tu <= 0) continue;
          const wob = i === 1 && t > 22.5 && t < 23.3 ? 0.012 * Math.sin((t - 22.5) * 40) * (1 - (t - 22.5) / 0.8) : 0;
          tileB(xa, xa + s, i === 1 ? TILE : TILE2, (p) => [p[0], Y2 + (p[1] - Y2) * Math.min(1, tu) + wob, p[2]]);
          if (i < 2) box(xa + s, Y2, -ZD * 0.98, xa + s + g, Y2 + TT * 0.88, ZD * 0.98, GROUT, ID, null, 0.02);
        }
        // the mallet taps tile 0 twice, then the hollow tile twice
        const hu = win(20.6, 24.0);
        if (hu > 0) {
          const hits = [21.2, 21.55, 22.5, 22.85]; let lift = 0.32;
          hits.forEach((h) => { const d = t - h; if (d > -0.18 && d < 0.2) lift = Math.min(lift, d < 0 ? 0.32 * (-d / 0.18) : 0.32 * (d / 0.2)); });
          const hx = H.lerp(x0 + s / 2, m1 + s / 2, seg(21.8, 22.3)), hy = Y2 + TT + 0.1 + lift * 1.3 * hu + (1 - hu) * 0.8;
          box(hx - 0.26, hy - 0.1, -0.13, hx + 0.26, hy + 0.1, 0.13, [176, 120, 82], ID, null, -0.05);
          tube([hx + 0.0, hy + 0.09, 0], [hx + 0.6, hy + 0.9, 0], 0.05, 6, [214, 190, 150]);
        }
        card(X4 - 0.65, 0.95, 0.52, 0.48, 21.3, 26.9, [['padat', 0.17, 0.25, GREY, 'mono'], ['"tok"', 0.34, 0.62, INK]]);
        card(X4 + 0.55, 0.95, 0.62, 0.48, 22.6, 26.9, [['kopong = ada rongga', 0.15, 0.25, REDH, 'mono'], ['"DUG.."', 0.34, 0.62, REDH]]);
        const ru = pop(23.4, 0.4) * (1 - seg(26.8, 27.2));
        
        // water seeping through the grout and running along the hollow
        for (let i = 0; i < 4; i++) { const t0 = 24.9 + i * 0.45, d = t - t0; if (d < 0 || d > 1.2) continue; const gx = i % 2 ? m1 - g / 2 : m1 + s + g / 2; const yy = d < 0.5 ? 1.0 - d * 1.2 : Y2 + TT - (d - 0.5) * 0.25; drop([gx, Math.max(Y1 + 0.02, yy + 0.3), 0.2], 0.1, 1); }
        if (t > 25.4) face([[m1 + 0.02, Y1 + 0.004, -ZD * 0.7], [m1 + s - 0.02, Y1 + 0.004, -ZD * 0.7], [m1 + s - 0.02, Y1 + 0.004, ZD * 0.7], [m1 + 0.02, Y1 + 0.004, ZD * 0.7]], WATER.map((v) => v * 0.95), { bias: -0.02 });
      }
      sign(X4, 19.5, 24.8, [['Perekat nggak penuh?', S * 0.62, 0.11], ['KOPONG', S * 1.3, 0.21, REDH], ['bunyinya beda saat diketuk', S * 0.55, 0.3, GREY, 'mono']], 1.45, -0.9);
      sign(X4, 24.6, 28.0, [['Air masuk lewat nat,', S * 0.62, 0.11], ['MAKIN LEPAS', S * 1.05, 0.21, REDH], ['banjir & bocor bikin perekat terkikis', S * 0.45, 0.3, GREY, 'mono']], 1.45, -0.9);
    }

    // ---- station 5: the right way: grout gaps, edge gap under the skirting, full adhesive bed; then CTA ----
    {
      const u = pop(28.4, 0.55);
      if (u > 0) {
        const L = 2.4, x0 = X5 - L / 2, n = 5, eg = 0.07, ng = 0.05, s = (L - 2 * eg - (n - 1) * ng) / n;
        base(X5, L / 2, u); wall(x0, -1, u); wall(x0 + L, 1, u);
        const hk = seg(30.7, 31.1) * (1 - seg(31.6, 31.95)), du = 1 - seg(35.6, 36.0);
        if (u > 0.98) for (let i = 0; i < n; i++) {
          const cx = x0 + eg + s / 2 + i * (s + ng), tw = s * (1 + 0.06 * hk), tu = pop(28.7 + i * 0.07, 0.35); if (tu <= 0) continue;
          tileB(cx - tw / 2, cx + tw / 2, i % 2 ? TILE : TILE2, (p) => [p[0], Y2 + (p[1] - Y2) * Math.min(1, tu), p[2]]);
          if (i < n - 1) { const gx = cx + (s + ng) / 2, gw = (s + ng - tw) / 2 - 0.004; box(gx - gw, Y2, -ZD * 0.98, gx + gw, Y2 + TT * 0.88, ZD * 0.98, GROUT, ID, null, 0.02); }
        }
        // skirting (plint) covering the edge gap at both walls
        const pu = pop(29.9, 0.35);
        if (pu > 0) [-1, 1].forEach((sd) => { const xw = sd < 0 ? x0 : x0 + L; box(sd < 0 ? xw : xw - 0.1, Y2 + TT, -ZD - 0.02, sd < 0 ? xw + 0.1 : xw, Y2 + TT + 0.12 * Math.min(1, pu), ZD + 0.05, PLINT, ID, null, -0.03); });
        heat(x0 + 0.3, x0 + L - 0.3, Y2 + TT + 0.05, hk, 5);
        const lu = [pop(29.2, 0.4), pop(29.9, 0.4), pop(30.6, 0.4)].map((v) => v * du);
        if (lu[0] > 0) { lab(X5 - 0.85, 0.95, 0.4, 0.44, lu[0], 'nat 2–3 mm', 0.3, INK, 0, CREAM, 'mono'); tick2([X5 - 0.85, 0.82, 1.05], 0.1 * Math.min(1, lu[0]), OKG); }
        if (lu[1] > 0) { lab(X5, 0.95, 0.4, 0.44, lu[1], 'celah tepi', 0.3, INK, 0, CREAM, 'mono'); tick2([X5, 0.82, 1.05], 0.1 * Math.min(1, lu[1]), OKG); }
        if (lu[2] > 0) { lab(X5 + 0.85, 0.95, 0.4, 0.44, lu[2], 'perekat penuh', 0.27, INK, 0, CREAM, 'mono'); tick2([X5 + 0.85, 0.82, 1.05], 0.1 * Math.min(1, lu[2]), OKG); }
        if (t > 31.3 && t < 35.9) tick2([X5 + 0.95, 1.55, 0.4], 0.24 * pop(31.3, 0.4) * (1 - seg(35.5, 35.9)), OKG);
        tent(X5, 0.95, 1.4, 0.68, 0, win(38.0, DURATION + 1), printer([['FOLLOW', 0.48, 0.4, '#f6f2e9'], ['buat fakta rumah berikutnya', 0.17, 0.8, '#f6f2e9', 'mono']]), TEAL);
        if (t > 38.5) star([X5 + 1.2, 1.05 + 0.05 * Math.sin(t * 3), 1.2], 0.22 * pop(38.5, 0.5), (t - 38.5) * 2);
      }
      sign(X5, 28.1, 36.0, [['Biar aman:', S * 0.62, 0.11], ['BERI CELAH', S * 1.1, 0.21, TEALH], ['nat + celah tepi + perekat penuh', S * 0.48, 0.3, GREY, 'mono']], 1.45, -0.9);
      sign(X5, 35.8, DURATION + 1, [['Coba ketuk lantaimu,', S * 0.62, 0.11], ['ADA YANG KOPONG?', S * 0.85, 0.21, REDH], ['bunyi "dug" = periksa sebelum meledak', S * 0.44, 0.3, GREY, 'mono']], 1.45, -0.9);
    }
