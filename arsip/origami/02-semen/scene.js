    // ---- extra builders for this topic ----
    const ICO = OXC.ico1 || (OXC.ico1 = icosphere(1));
    const NZ = OXC.nzr || (OXC.nzr = H.makeNoise(23));
    // low-poly paper rock resting on the table (flattened bottom)
    const rock = (c, s, seed, col, u = 1, sq = 0.75) => {
      if (u <= 0) return;
      const k = Math.min(1, u);
      const vs = ICO.v.map((v) => {
        const j = 1 + 0.28 * NZ.n3(v[0] * 1.7 + seed, v[1] * 1.7, v[2] * 1.7 + seed * 0.3);
        let p = [v[0] * s * j, v[1] * s * j * sq, v[2] * s * j];
        p[1] = Math.max(p[1], -s * sq * 0.55);
        return [c[0] + p[0] * k, c[1] + (p[1] + s * sq * 0.55) * k, c[2] + p[2] * k];
      });
      ICO.f.forEach(([a, b, d], i) => face([vs[a], vs[b], vs[d]], col.map((x) => x * (0.94 + 0.06 * ((i * 7) % 3)))));
    };
    // faceted paper tube between a and b (n sides), spinning about its axis; optional end caps
    const tube = (a, b, r, n, col, spin = 0, capA = null, capB = null, stripe = null) => {
      const ax = norm(sub(b, a)), t1 = norm(cross(ax, Math.abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0])), t2 = cross(ax, t1);
      const ring = (o) => Array.from({ length: n }, (_, k) => { const an = spin + (k / n) * TAU; return add(o, add(mul(t1, Math.cos(an) * r), mul(t2, Math.sin(an) * r))); });
      const A = ring(a), B = ring(b);
      for (let k = 0; k < n; k++) { const k2 = (k + 1) % n; face([A[k], A[k2], B[k2], B[k]], stripe && k % 2 ? stripe : col.map((v) => v * (k % 2 ? 0.95 : 1))); }
      if (capA) for (let k = 0; k < n; k++) face([A[k], A[(k + 1) % n], a], capA);
      if (capB) for (let k = 0; k < n; k++) face([B[k], B[(k + 1) % n], b], capB);
    };
    // conical pile (powder / sand), grows with u
    const pile = (c, r, h, col, u = 1, n = 10) => {
      if (u <= 0) return;
      const rr = r * Math.min(1, 0.3 + 0.7 * u), hh = h * u, top = [c[0], hh, c[2]];
      const base = Array.from({ length: n }, (_, k) => { const an = (k / n) * TAU + 0.3; const w = 1 + 0.12 * Math.sin(k * 2.7); return [c[0] + Math.cos(an) * rr * w, 0.004, c[2] + Math.sin(an) * rr * w]; });
      for (let k = 0; k < n; k++) face([base[k], base[(k + 1) % n], top], col.map((v) => v * (k % 2 ? 0.96 : 1.02)));
    };
    // water drop: paper teardrop (two cones)
    const drop = (c, s, u = 1) => {
      if (u <= 0) return;
      const n = 8, rr = s * 0.55, mid = add(c, [0, s * 0.45, 0]), tip = add(c, [0, s * 1.35, 0]), bot = add(c, [0, 0, 0]);
      const ring = Array.from({ length: n }, (_, k) => add(mid, [Math.cos((k / n) * TAU) * rr, 0, Math.sin((k / n) * TAU) * rr]));
      for (let k = 0; k < n; k++) { face([ring[k], ring[(k + 1) % n], tip], WATER.map((v) => v * (k % 2 ? 0.95 : 1.03))); face([ring[(k + 1) % n], ring[k], bot], WATER.map((v) => v * 0.9)); }
    };
    // accordion-pleated paper column (reference)
    const column = (x, z, hgt, col) => {
      const n = 12, r0 = 0.2;
      const ringC = (y) => Array.from({ length: n }, (_, k) => { const a = ((k + 0.5) / n) * TAU, r = k % 2 ? r0 * 0.82 : r0; return [x + Math.cos(a) * r, y, z + Math.sin(a) * r]; });
      const A = ringC(0.01), B = ringC(hgt);
      for (let k = 0; k < n; k++) { const k2 = (k + 1) % n; face([A[k], A[k2], B[k2], B[k]], k % 2 ? col.map((v) => v * 0.92) : col); }
      const cc = [x, hgt + 0.03, z];
      for (let k = 0; k < n; k++) face([B[k], B[(k + 1) % n], cc], col.map((v) => Math.min(255, v * (k % 2 ? 1.0 : 1.06))));
    };
    const cross2 = (c0, s, col) => { strip(add(c0, [-s, s, 0]), add(c0, [s, -s, 0]), s * 0.22, col); strip(add(c0, [-s, -s, 0.02]), add(c0, [s, s, 0.02]), s * 0.22, col); };
    const tick2 = (c0, s, col) => { strip(add(c0, [-s * 0.7, 0.02, 0]), add(c0, [-s * 0.2, -s * 0.5, 0]), s * 0.16, col); strip(add(c0, [-s * 0.2, -s * 0.5, 0.01]), add(c0, [s * 0.9, s * 0.8, 0.01]), s * 0.16, col); };
    const lab = (x, z, w, h, u, txt, size = 0.62, col, rot = 0, bg = CREAM, font) => tent(x, z, w, h, rot, u, printer([[txt, size, 0.55, col, font]]), bg);

    // ================= SCENE =================
    const S = 0.115;
    const sign = (x, a, b, lines, w = 1.45, z = -1.0, sc = 1) => tent(x, z, w, 3.35, 0, win(a, b), printer(lines.map(([tx, f, y, c, fo]) => [tx, f * sc, y, c, fo])));

    // ---- station 1: raw stones -> rotary kiln -> clinker ----
    {
      const K0 = [X1 - 1.25, 0.86, 0], K1 = [X1 + 1.2, 0.66, 0];
      const ku = pop(0.15, 0.6);
      if (ku > 0) {
        const kk = Math.min(1, ku);
        const a = add(mul(sub(K0, [X1, 0, 0]), kk), [X1, 0, 0]), b = add(mul(sub(K1, [X1, 0, 0]), kk), [X1, 0, 0]);
        tube([a[0], a[1] * kk, a[2]], [b[0], b[1] * kk, b[2]], 0.42 * kk, 12, STEEL, t * 1.1, STEEL.map((v) => v * 0.8), GLOW, RUST);
        // two support cradles
        [-0.7, 0.75].forEach((o) => box(X1 + o - 0.12, 0, -0.32, X1 + o + 0.12, 0.42 * kk, 0.32, POSTC, (p) => p));
      }
      // fire tongues at the outlet (paper flames flickering)
      const fu = H.clamp((t - 0.9) / 0.4) * (1 - seg(13.0, 13.5));
      if (fu > 0) {
        const r = H.rng(5);
        for (let i = 0; i < 6; i++) {
          const ph = r() * 6, ln = (0.32 + 0.22 * Math.sin(t * (7 + i) + ph)) * fu, an = -0.9 + i * 0.36;
          const base = add(K1, [0.02, Math.sin(an) * 0.28, Math.cos(an) * 0.28]);
          face([add(base, [0, 0.07, 0]), add(base, [0, -0.07, 0]), add(base, [ln, Math.sin(an) * 0.12 + 0.05, Math.cos(an) * 0.1])], i % 2 ? FLAME : FLAME2);
        }
      }
      // limestone + clay piles, a few stones travel into the inlet
      const lu = pop(0.35, 0.5), cu = pop(0.55, 0.5);
      [[-0.18, 0.5, 0.2], [0.12, 0.62, 0.17], [-0.02, 0.85, 0.15]].forEach(([dx, dz, s], i) => rock([X1 - 1.95 + dx, 0, dz], s, i * 3.1, LIME, lu));
      [[0.1, -0.35, 0.16], [-0.16, -0.2, 0.14], [0.05, -0.05, 0.12]].forEach(([dx, dz, s], i) => rock([X1 - 1.95 + dx, 0, dz], s, 9 + i * 2.3, CLAY, cu, 0.6));
      for (let i = 0; i < 5; i++) {
        const st = 4.2 + i * 0.38, u = H.clamp((t - st) / 0.55);
        if (u <= 0 || u >= 1) continue;
        const p0 = [X1 - 1.95, 0.12, 0.35 - i * 0.1], p1 = [K0[0] + 0.05, K0[1] + 0.05, 0];
        const e = H.ease.inOut(u), pos = [H.lerp(p0[0], p1[0], e), H.lerp(p0[1], p1[1], e) + Math.sin(e * Math.PI) * 0.35, H.lerp(p0[2], p1[2], e)];
        rock(pos, 0.1 * (1 - 0.5 * e), 20 + i, i % 2 ? CLAY : LIME);
      }
      // clinker nodules roll out of the outlet onto a pile
      for (let i = 0; i < 9; i++) {
        const st = 6.6 + i * 0.22, u = H.clamp((t - st) / 0.5);
        if (u <= 0) continue;
        const e = H.ease.out(u), tx = X1 + 1.6 + (i % 3) * 0.13 - 0.13, tz = 0.15 + Math.floor(i / 3) * 0.12 - 0.1;
        const pos = [H.lerp(K1[0], tx, e), H.lerp(K1[1] - 0.3, 0, Math.min(1, e * 1.3)) + Math.max(0, Math.sin(e * Math.PI * 2)) * 0.06 * (1 - e) + (Math.floor(i / 3) * 0.05) * e, H.lerp(0, tz, e)];
        rock(pos, 0.075, 40 + i, CLINKER, 1, 0.9);
      }
      sign(X1, 0.05, 3.7, [['Lem tembok rumahmu =', S * 0.62, 0.11], ['BATU DIBAKAR', S * 1.1, 0.21, REDH], ['di tungku putar raksasa', S * 0.55, 0.3, '#6a6a70', 'mono']]);
      sign(X1, 3.5, 9.2, [['Bahannya:', S * 0.62, 0.11], ['KAPUR + TANAH LIAT', S * 0.8, 0.21, REDH], ['keluar jadi butiran "klinker"', S * 0.55, 0.3, '#6a6a70', 'mono']]);
      // temperature counter card
      const tu = win(4.3, 9.2);
      tent(X1 - 0.15, 1.5, 0.95, 0.8, 0.05, tu, (c, w, h) => {
        const v = Math.round(1450 * H.ease.out(H.clamp((t - 4.6) / 2.4)));
        const s = v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        printer([['suhu tungku', 0.17, 0.2, '#6a6a70', 'mono'], [s + '°C', 0.42, 0.62, t > 7.0 ? REDH : INK]])(c, w, h);
      });
    }

    // ---- station 2: clinker + gypsum -> mill -> cement powder + sack ----
    {
      const M0 = [X2 - 0.25, 0.52, 0], M1 = [X2 + 0.7, 0.52, 0];
      const mu = pop(9.4, 0.5);
      if (mu > 0) {
        const k = Math.min(1, mu);
        tube([M0[0], M0[1] * k, 0], [M0[0] + (M1[0] - M0[0]) * k, M1[1] * k, 0], 0.34 * k, 10, STEEL2, t * 3.2 * seg(10.0, 10.4), STEEL2.map((v) => v * 0.85), STEEL2.map((v) => v * 0.85));
        [0.1, 0.55].forEach((o) => box(M0[0] + o - 0.08, 0, -0.26, M0[0] + o + 0.08, 0.22 * k, 0.26, POSTC, (p) => p));
      }
      // clinker pile + gypsum pile on the left
      for (let i = 0; i < 6; i++) rock([X2 - 1.35 + (i % 3) * 0.13, 0, 0.2 + Math.floor(i / 3) * 0.13], 0.075, 60 + i, CLINKER, pop(9.5 + i * 0.03, 0.4), 0.9);
      const gu = pop(9.9, 0.45);
      rock([X2 - 0.95, 0, 0.75], 0.09, 70, GYPS, gu); rock([X2 - 0.82, 0, 0.88], 0.07, 71, GYPS, gu);
      lab(X2 - 0.9, 1.3, 0.52, 0.26, win(10.1, 13.6), 'gipsum 3–5%', 0.42, TEALH);
      arrowG([X2 - 1.0, 0.012, 0.55], norm([1, 0, -0.45]), norm([0.45, 0, 1]), [0, 1, 0], 0.62, seg(10.2, 10.9), MUSC, 0.11);
      // powder pile grows from the outlet, then the sack folds up
      pile([X2 + 1.08, 0, 0.32], 0.32, 0.34, CEM, H.ease.out(H.clamp((t - 10.9) / 1.4)));
      const su = pop(12.1, 0.5);
      if (su > 0) {
        const k = Math.min(1, su), sx = X2 + 0.45, sz = 0.95, hw = 0.3, hh = 0.78 * k, hd = 0.16;
        box(sx - hw, 0, sz - hd, sx + hw, hh, sz + hd, SACK, (p) => p, (c, w, h) => {
          c.fillStyle = 'rgba(214,74,58,0.9)'; c.fillRect(0, h * 0.12, w, h * 0.16);
          printer([['SEMEN', 0.2, 0.47, INK], ['PORTLAND', 0.09, 0.62, '#6a6a70', 'mono'], ['40 kg', 0.11, 0.82, INK, 'mono']])(c, w, h);
        });
        // folded top
        face([[sx - hw, hh, sz + hd], [sx + hw, hh, sz + hd], [sx + hw, hh + 0.08 * k, sz], [sx - hw, hh + 0.08 * k, sz]], SACK.map((v) => v * 1.03));
        face([[sx - hw, hh + 0.08 * k, sz], [sx + hw, hh + 0.08 * k, sz], [sx + hw, hh, sz - hd], [sx - hw, hh, sz - hd]], SACK.map((v) => v * 0.97));
      }
      sign(X2, 9.0, 13.9, [['Klinker digiling +', S * 0.62, 0.11], ['GIPSUM', S * 1.2, 0.21, TEALH], ['biar nggak keburu mengeras', S * 0.55, 0.3, '#6a6a70', 'mono']]);
    }

    // ---- station 3: semen + air + pasir + kerikil -> beton ----
    {
      const items = [['semen', -1.05], ['air', -0.35], ['pasir', 0.35], ['kerikil', 1.05]];
      items.forEach(([nm, dx], i) => {
        const st = 14.2 + i * 0.35, u = pop(st, 0.45), x = X3 + dx, z = 0.75;
        const go = seg(16.4, 17.1);
        const pz = H.lerp(z, z - 0.55, go);
        if (nm === 'semen') pile([x, 0, pz], 0.27, 0.3, CEM, u * (1 - go * 0.6));
        if (nm === 'air') { drop([x - 0.08, 0.02, pz], 0.2, u * (1 - go * 0.6)); drop([x + 0.12, 0.02, pz + 0.08], 0.14, u * (1 - go * 0.6)); }
        if (nm === 'pasir') pile([x, 0, pz], 0.27, 0.22, SAND, u * (1 - go * 0.6));
        if (nm === 'kerikil') for (let j = 0; j < 4; j++) rock([x + (j % 2) * 0.16 - 0.08, 0, pz + Math.floor(j / 2) * 0.14 - 0.07], 0.09, 80 + j, GRAVEL, u * (1 - go * 0.6));
        lab(x, 1.55, 0.33, 0.24, win(st + 0.15, 17.0), nm, 0.6, nm === 'semen' ? REDH : INK);
      });
      // the mixed block (beton) folds up behind
      const bu = pop(17.0, 0.55) * (1 - seg(19.9, 20.3));
      if (bu > 0) {
        const k = Math.min(1, bu);
        box(X3 - 0.85, 0, -0.55, X3 + 0.85, 0.5 * k, 0.05, BETON, (p) => p, printer([['BETON', 0.42, 0.5, '#f6f2e9']]));
        // aggregate specks on the block top
        const r = H.rng(13);
        for (let j = 0; j < 9; j++) rock([X3 - 0.7 + r() * 1.4, 0.5 * k - 0.02, -0.5 + r() * 0.5], 0.05, 90 + j, GRAVEL, k, 0.5);
      }
      sign(X3, 13.9, 20.3, [['Semen itu cuma', S * 0.62, 0.11], ['LEM-NYA', S * 1.25, 0.21, REDH], ['beton = semen+air+pasir+kerikil', S * 0.5, 0.3, '#6a6a70', 'mono']]);
    }

    // ---- station 4: why it hardens (wrong guess -> hydration crystals) + 28 days ----
    {
      const RK = [[-0.75, 0.15, 0.3], [-0.2, 0.45, 0.26], [0.35, 0.1, 0.32], [-0.45, -0.25, 0.22], [0.15, -0.3, 0.24]];
      RK.forEach(([dx, dz, s], i) => rock([X4 + dx, 0, dz], s, 100 + i * 1.7, GRAVEL, pop(20.4 + i * 0.08, 0.45)));
      // water drops fall
      for (let i = 0; i < 4; i++) { const st = 21.0 + i * 0.18, u = H.clamp((t - st) / 0.5); if (u > 0 && u < 1) drop([X4 - 0.6 + i * 0.35, 1.6 * (1 - H.ease.in(u)) + 0.1, 0.2 - i * 0.08], 0.12); }
      // crystals: grey paper needles growing between the stones
      const cu = H.ease.out(H.clamp((t - 24.3) / 2.2));
      if (cu > 0) {
        const r = H.rng(77);
        for (let j = 0; j < 22; j++) {
          const A = RK[r.int(0, 4)], B = RK[r.int(0, 4)]; if (A === B) continue;
          const a = [X4 + A[0], A[2] * 0.9 + r.range(0.05, 0.25), A[1]], b = [X4 + B[0], B[2] * 0.9 + r.range(0.05, 0.25), B[1]];
          const mid = add(mul(add(a, b), 0.5), [0, r.range(0.05, 0.2), 0.15]);
          const k = H.clamp(cu * 1.4 - j * 0.02);
          if (k > 0) strip(a, add(a, mul(sub(mid, a), k)), 0.012, CRYS), strip(b, add(b, mul(sub(mid, b), k)), 0.012, CRYS.map((v) => v * 0.94));
        }
      }
      sign(X4, 20.3, 23.85, [['Mengeras karena', S * 0.62, 0.11], ['KERING?', S * 1.3, 0.21, REDH]]);
      if (t > 22.3 && t < 23.6) cross2([X4 + 1.05, 2.75, -0.6], 0.32 * pop(22.3, 0.3), RED);
      sign(X4, 23.6, 27.2, [['Bukan! Bereaksi dengan', S * 0.62, 0.11], ['AIR', S * 1.4, 0.21, TEALH], ['membentuk kristal pengikat', S * 0.55, 0.3, '#6a6a70', 'mono']]);
      // strength columns: 3, 7, 28 days
      [[3, 0.55, MUS], [7, 0.85, TEAL], [28, 1.25, RED]].forEach(([d, hgt, col], i) => {
        const st = 27.9 + i * 0.45, u = H.clamp((t - st) / 0.4);
        if (u <= 0) return;
        const x = X4b + 0.35 + i * 0.5;
        column(x, -0.15, hgt * H.ease.out(u), col);
        lab(x, 0.42, 0.24, 0.2, u, d + ' hr', 0.62, INK, 0, CREAM, 'mono');
      });
      tent(X4b - 0.75, 1.35, 0.8, 0.8, 0.05, win(29.4, 31.2), printer([['kekuatan penuh', 0.15, 0.2, '#6a6a70', 'mono'], ['28', 0.5, 0.58, t > 29.6 ? REDH : INK], ['HARI', 0.16, 0.88, INK]]));
      sign(X4b, 27.2, 31.3, [['Jaga tetap basah,', S * 0.62, 0.11], ['JANGAN', S * 1.05, 0.2, REDH], ['cepat kering', S * 0.75, 0.29, INK]]);
    }

    // ---- station 5: origin timeline Romawi -> 1824 -> 1910 ----
    {
      const pu = (a) => pop(a, 0.5) * (1 - seg(37.0, 37.4));
      // Pantheon: drum + dome + portico columns
      const p1 = pu(32.0);
      if (p1 > 0) {
        const k = Math.min(1, p1), x = X5 - 1.25, z = -0.1;
        tube([x, 0, z], [x, 0.38 * k, z], 0.36 * k, 14, STONE, 0, null, null);
        const n = 14, rings = [0, 0.35, 0.7, 1.0].map((f) => Array.from({ length: n }, (_, j) => { const an = (j / n) * TAU, rr = 0.36 * Math.cos(f * Math.PI / 2) * k; return [x + Math.cos(an) * rr, 0.38 * k + Math.sin(f * Math.PI / 2) * 0.3 * k, z + Math.sin(an) * rr]; }));
        for (let q = 0; q < 3; q++) for (let j = 0; j < n; j++) face([rings[q][j], rings[q][(j + 1) % n], rings[q + 1][(j + 1) % n], rings[q + 1][j]], STONE.map((v) => v * (j % 2 ? 0.97 : 1.02)));
        for (let c = 0; c < 4; c++) tube([x - 0.27 + c * 0.18, 0, z + 0.42], [x - 0.27 + c * 0.18, 0.36 * k, z + 0.42], 0.04, 6, STONE.map((v) => v * 1.03));
        face([[x - 0.36, 0.36 * k, z + 0.47], [x + 0.36, 0.36 * k, z + 0.47], [x, 0.5 * k, z + 0.47]], STONE.map((v) => v * 1.05));
        face([[x - 0.36, 0.36 * k, z + 0.47], [x + 0.36, 0.36 * k, z + 0.47], [x + 0.36, 0.36 * k, z + 0.2], [x - 0.36, 0.36 * k, z + 0.2]], STONE);
      }
      // Portland stone block (pale limestone) with a chisel line
      const p2 = pu(33.6);
      if (p2 > 0) { const k = Math.min(1, p2), x = X5; box(x - 0.36, 0, -0.35, x + 0.36, 0.5 * k, 0.15, PSTONE, (p) => p, printer([['PORTLAND', 0.2, 0.5, '#6a6a70', 'mono']])); }
      // Indarung factory: hall + chimney + small kiln
      const p3 = pu(35.0);
      if (p3 > 0) {
        const k = Math.min(1, p3), x = X5 + 1.25;
        box(x - 0.42, 0, -0.4, x + 0.2, 0.42 * k, 0.1, BRICKC, (p) => p);
        face([[x - 0.42, 0.42 * k, 0.1], [x + 0.2, 0.42 * k, 0.1], [x - 0.11, 0.6 * k, -0.15]], ROOF);
        tube([x + 0.33, 0, -0.2], [x + 0.33, 1.15 * k, -0.2], 0.08, 8, BRICKC.map((v) => v * 0.9));
        tube([x - 0.45, 0.16, 0.3], [x + 0.35, 0.08, 0.3], 0.1 * k, 8, STEEL);
      }
      arrowFlat(X5 - 1.7, 1.05, X5 + 1.75, 1.05, seg(32.3, 35.4) * (1 - seg(37.0, 37.4)), CREAM);
      lab(X5 - 1.25, 1.75, 0.52, 0.42, win(32.3, 37.3), 'Romawi', 0.4, INK);
      lab(X5, 1.75, 0.52, 0.42, win(33.9, 37.3), '1824', 0.5, INK);
      lab(X5 + 1.25, 1.75, 0.52, 0.42, win(35.3, 37.3), '1910', 0.5, REDH);
      sign(X5, 31.3, 37.3, [['Asal-usulnya:', S * 0.62, 0.11], ['ROMA → PADANG', S * 0.95, 0.21, REDH], ['Pantheon · Aspdin 1824 · Indarung', S * 0.5, 0.3, '#6a6a70', 'mono']]);
      if (t > 35.5 && t < 37.3) { const sp = pop(35.5, 0.5) * (1 - seg(37.0, 37.3)); star([X5 + 1.6, 1.4 + 0.05 * Math.sin(t * 3), 0.1], 0.2 * sp, (t - 35.5) * 2); }
    }
    // ---- takeaway, then it refolds into the CTA ----
    tent(X5, 1.3, 2.2, 0.66, 0, win(37.3, 38.75), (c, w, h) => {
      c.font = SG(100); const k = Math.min(h * 0.42, (100 * w * 0.86) / (c.measureText('Semen  lem batu buatan').width + 60));
      c.textBaseline = 'middle'; c.font = SG(k); c.fillStyle = INK; c.textAlign = 'right'; c.fillText('Semen', w * 0.38, h * 0.5);
      c.fillStyle = REDH; c.beginPath(); c.moveTo(w * 0.405, h * 0.42); c.lineTo(w * 0.445, h * 0.5); c.lineTo(w * 0.405, h * 0.58); c.fill(); c.fillRect(w * 0.39, h * 0.48, w * 0.03, h * 0.04);
      c.textAlign = 'left'; c.fillStyle = REDH; c.fillText('lem batu buatan', w * 0.46, h * 0.5);
    });
    sign(X5, 37.3, DURATION + 1, [['Bukan sekadar', S * 0.62, 0.11], ['BUBUK ABU-ABU', S * 0.9, 0.21, REDH]]);
    tent(X5, 1.3, 1.6, 0.72, 0, win(38.65, DURATION + 1), printer([['FOLLOW', 0.48, 0.4, '#f6f2e9'], ['buat fakta rumah berikutnya', 0.17, 0.8, '#f6f2e9', 'mono']]), TEAL);
    if (t > 39.1) star([X5 + 1.55, 0.95 + 0.05 * Math.sin(t * 3), 1.7], 0.26 * pop(39.1, 0.5), (t - 39.1) * 2);
