// Origami Studio, portrait 1080x1920: "Fungsi semen & asal-usulnya"
// Every frame is a pure function of t. Randomness only from H.rng / H.makeNoise.
(function () {
  const TAU = Math.PI * 2;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const rotY = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; };
  const rotZ = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; };

  // paper fibre texture (reference makeTex, unchanged)
  const makeTex = (seed) => {
    const S = 256, cv = H.layer(S, S), x = cv.getContext('2d'), r = H.rng(seed);
    const img = x.createImageData(S, S), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const n = r(); const w = n > 0.5; d[i] = d[i + 1] = d[i + 2] = w ? 255 : 0; d[i + 3] = Math.abs(n - 0.5) * 34; }
    x.putImageData(img, 0, 0);
    x.lineCap = 'round';
    for (let n = 0; n < 260; n++) {
      const px = r() * S, py = r() * S, len = r.range(3, 14), a = r() * TAU;
      x.strokeStyle = r() < 0.6 ? `rgba(255,255,255,${r.range(0.06, 0.16)})` : `rgba(60,40,20,${r.range(0.04, 0.09)})`;
      x.lineWidth = r.range(0.4, 0.9);
      for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
        x.beginPath(); x.moveTo(px + ox * S, py + oy * S); x.lineTo(px + ox * S + Math.cos(a) * len, py + oy * S + Math.sin(a) * len); x.stroke();
      }
    }
    return cv;
  };

  const OXC = {};
  const SG = (px) => `700 ${px}px "Space Grotesk"`;
  const SM = (px) => `400 ${px}px "Space Mono"`;
  const CREAM = [246, 242, 233], INK = '#23242a', RED = [214, 74, 58], GREEN = [92, 170, 104], MUS = [241, 182, 68], IND = [58, 82, 150], TEAL = [44, 160, 150];
  const BRICK = [196, 102, 68], MORTAR = [214, 207, 192], POST = [168, 166, 158];
  const REDH = '#e45a3e', TEALH = '#2f8a80';
  const icosphere = (subdiv) => {
    const g = (1 + Math.sqrt(5)) / 2;
    const v = [[-1, g, 0], [1, g, 0], [-1, -g, 0], [1, -g, 0], [0, -1, g], [0, 1, g], [0, -1, -g], [0, 1, -g], [g, 0, -1], [g, 0, 1], [-g, 0, -1], [-g, 0, 1]].map(norm);
    let f = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
    for (let s = 0; s < subdiv; s++) {
      const cache = {}, nf = [];
      const mid = (a, b) => { const k = a < b ? a + '_' + b : b + '_' + a; if (cache[k] == null) { cache[k] = v.length; v.push(norm(mul(add(v[a], v[b]), 0.5))); } return cache[k]; };
      f.forEach(([a, b, c]) => { const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a); nf.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]); });
      f = nf;
    }
    return { v, f };
  };
  const STEEL = [126, 134, 146], STEEL2 = [150, 156, 162], RUST = [178, 112, 78], GLOW = [246, 150, 60], POSTC = [168, 166, 158];
  const FLAME = [244, 132, 52], FLAME2 = [250, 196, 72], LIME = [232, 226, 206], CLAY = [176, 104, 72], CLINKER = [84, 84, 90];
  const GYPS = [244, 244, 240], MUSC = [241, 182, 68], CEM = [158, 160, 160], SACK = [226, 214, 188], WATER = [96, 160, 214];
  const SAND = [226, 190, 120], GRAVEL = [128, 126, 120], BETON = [138, 140, 140], CRYS = [240, 242, 246];
  const STONE = [214, 204, 182], PSTONE = [232, 226, 210], BRICKC = [180, 98, 70], ROOF = [92, 96, 108];

  // ---------------- timeline (seconds) ----------------
  const DURATION = 44.6;
  const X1 = -6, X2 = -2, X3 = 2, X4 = 6, X4b = 7, X5a = 11.5, X5b = 15.5, X5c = 19.5;
  const CAM = { s1: [X1, 2.25, 5.6, 1.4], s2: [X2, 2.25, 5.6, 1.4], s3: [X3, 2.25, 5.6, 1.4], s4: [X4, 2.25, 5.6, 1.4], s4b: [X4b, 2.25, 5.6, 1.4], s5a: [X5a, 2.25, 5.6, 1.4], s5b: [X5b, 2.25, 5.6, 1.4], s5c: [X5c, 2.25, 5.6, 1.4] };
  const CAMPATH = [[0, 0, 's1'], [9.0, 9.8, 's2'], [13.4, 14.2, 's3'], [19.9, 20.7, 's4'], [27.0, 27.7, 's4b'], [31.0, 31.95, 's5a'], [33.75, 34.35, 's5b'], [35.55, 36.05, 's5c']];

  // ---- retime: final video time (synced to the VO) -> storyboard time ----
  const TM = [[0, 0], [3.2, 3.5], [7.1, 9.0], [10.2, 13.4], [12.9, 14.2], [15.6, 17.0], [16.6, 19.9], [18.22, 22.3], [19.1, 23.6], [22.9, 27.0], [25.3, 29.6], [26.6, 31.0], [27.7, 31.95], [31.08, 33.75], [32.0, 34.35], [35.37, 35.55], [36.0, 36.05], [39.7, 40.1], [41.9, 41.45], [44.6, 43.9]];
  const lin = (P, x, i, j) => { for (let k = 1; k < P.length; k++) if (x <= P[k][i] || k === P.length - 1) { const a = P[k - 1], b = P[k]; return a[j] + (b[j] - a[j]) * (x - a[i]) / (b[i] - a[i]); } };
  const TMAP = (t) => lin(TM, t, 0, 1), INV = (t) => lin(TM, t, 1, 0);
  window.TMAP = TMAP; window.INV = INV;
  const EXPLAIN = (ctx, W, H_, t) => {
    t = TMAP(t);
    const seg = (a, b) => H.ease.inOut(H.clamp((t - a) / (b - a)));
    const pop = (a, d = 0.45) => { const u = H.clamp((t - a) / d); if (u <= 0) return 0; const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
    const win = (a, b, fi = 0.35, fo = 0.3) => seg(a, a + fi) * (1 - seg(b - fo, b));
    let cam = CAM.s1.slice();
    for (const [a, b, k] of CAMPATH) { const u = b > a ? seg(a, b) : (t >= a ? 1 : 0); cam = cam.map((v, i) => H.lerp(v, CAM[k][i], u)); }
    const push = seg(22.3, 22.7) * (1 - seg(23.5, 24.0)); // push-in on the wrong guess
    const E = [cam[0], cam[1] - push * 0.15, cam[2] - push * 1.0], TG = [cam[0], cam[3] + push * 0.35, 0];
    const fwd = norm(sub(TG, E)), right = norm(cross(fwd, [0, 1, 0])), up = cross(right, fwd);
    const F = 1560, PCX = W / 2, PCY = 780;
    const proj = (p) => { const d = sub(p, E); const z = dot(d, fwd); return [PCX + (F * dot(d, right)) / z, PCY - (F * dot(d, up)) / z, z]; };
    const orbit = 0.08 * Math.sin(t * 0.25);
    const Lkey = norm([-0.55 + orbit, 1.0, 0.55]), Lfill = norm([0.9, 0.25, 0.35]), Ls = mul(Lkey, -1);
    const faces = [];
    const face = (pts, col, extra = {}) => faces.push({ pts, col, bias: 0, ...extra });

    // ---- prop builders ----
    const printer = (lines, opt = {}) => (c, w, h) => {
      c.textAlign = 'center'; c.textBaseline = 'middle';
      lines.forEach(([txt, fr, yy, col, font]) => {
        const F2 = font === 'mono' ? SM : SG;
        let px = fr * h; c.font = F2(px); const mw = c.measureText(txt).width; if (mw > w * 0.9) { px *= (w * 0.9) / mw; c.font = F2(px); }
        c.fillStyle = col || opt.ink || INK; c.fillText(txt, w / 2, h * yy);
      });
    };
    // tent card (reference): folds up from flat with u 0..1, front face printed
    const tent = (x, z, w, h, rot, u, paint, col = CREAM, y0 = 0) => {
      if (u <= 0) return;
      const dz = 0.34, Lf = Math.hypot(h, dz), th = Math.atan2(h, dz) * Math.min(1, u);
      const T = (p) => add(rotY(p, rot), [x, y0, z]);
      const rid = [0, Lf * Math.sin(th), dz - Lf * Math.cos(th)];
      const BLf = [-w, 0.003, dz], BRf = [w, 0.003, dz], TR = [w, rid[1], rid[2]], TL = [-w, rid[1], rid[2]];
      const bz = rid[2] - dz * Math.min(1, u);
      face([TL, TR, [w, 0.003, bz], [-w, 0.003, bz]].map(T), col.map((v) => v * 0.97));
      face([BLf, BRf, TR, TL].map(T), col, { map: [T(TL), T(TR), T(BLf)], paint });
    };
    // folded paper arrow in any plane: origin o, direction u, in-plane side v, crease lifts along N
    const arrowG = (o, u, v, N, len, p, col, hw = 0.13) => {
      if (p <= 0) return;
      const l = len * p, hl = Math.min(0.36, l * 0.5), cr = 0.035, sEnd = l - hl;
      const P = (s, n, lift = 0) => add(add(add(o, mul(u, s)), mul(v, n)), mul(N, lift));
      face([P(0, -hw), P(sEnd, -hw), P(sEnd, 0, cr), P(0, 0, cr)], col);
      face([P(0, 0, cr), P(sEnd, 0, cr), P(sEnd, hw), P(0, hw)], col.map((x) => x * 0.97));
      face([P(sEnd, -hw * 2.2), P(l, 0, cr * 0.4), P(sEnd, 0, cr * 1.6)], col);
      face([P(sEnd, 0, cr * 1.6), P(l, 0, cr * 0.4), P(sEnd, hw * 2.2)], col.map((x) => x * 0.95));
    };
    // a paper box (bricks, posts, weight); T maps local->world; front face optionally printed
    const box = (x0, y0, z0, x1, y1, z1, col, T, paint, bias = 0) => {
      const n0 = faces.length;
      const c = (x, y, z) => T([x, y, z]);
      const A = c(x0, y0, z1), B = c(x1, y0, z1), C = c(x1, y1, z1), Dd = c(x0, y1, z1);
      const A2 = c(x0, y0, z0), B2 = c(x1, y0, z0), C2 = c(x1, y1, z0), D2 = c(x0, y1, z0);
      face([A, B, C, Dd], col, paint ? { map: [Dd, C, A], paint } : {});
      face([Dd, C, C2, D2], col.map((v) => Math.min(255, v * 1.05)));
      face([B, B2, C2, C], col.map((v) => v * 0.97));
      face([A2, A, Dd, D2], col.map((v) => v * 0.97));
      face([B2, A2, D2, C2], col.map((v) => v * 0.9));
      for (let i = n0; i < faces.length; i++) faces[i].bias = bias;
    };
    // flat strip standing in a plane facing camera, with one centre fold (reference strip)
    const strip = (a, b, wdt, col) => {
      const d = sub(b, a), n = norm([-d[1], d[0], 0]), m = mul(add(a, b), 0.5);
      face([add(a, mul(n, wdt)), add(m, [n[0] * wdt, n[1] * wdt, 0.025]), add(m, [-n[0] * wdt, -n[1] * wdt, 0.025]), add(a, mul(n, -wdt))], col);
      face([add(m, [n[0] * wdt, n[1] * wdt, 0.025]), add(b, mul(n, wdt)), add(b, mul(n, -wdt)), add(m, [-n[0] * wdt, -n[1] * wdt, 0.025])], col.map((v) => v * 0.94));
    };
    const polyStrip = (pts, k, wdt, col) => { // draws the first k (fractional) segments of a polyline
      for (let i = 0; i < pts.length - 1; i++) {
        const f = H.clamp(k - i); if (f <= 0) break;
        strip(pts[i], add(pts[i], mul(sub(pts[i + 1], pts[i]), f)), wdt, col);
      }
    };
    const arrowFlat = (x0, z0, x1, z1, p, col) => {
      if (p <= 0) return;
      const ex = H.lerp(x0, x1, p), ez = H.lerp(z0, z1, p), a = Math.atan2(ez - z0, ex - x0);
      const len = Math.hypot(ex - x0, ez - z0), dx = Math.cos(a), dz = Math.sin(a), nx = -dz, nz2 = dx;
      const hw = 0.16, hl = Math.min(0.4, len * 0.5), y = 0.012, cr = 0.04;
      const P = (s, n, yy = y) => [x0 + dx * s + nx * n, yy, z0 + dz * s + nz2 * n];
      const sEnd = len - hl;
      face([P(0, -hw), P(sEnd, -hw), P(sEnd, 0, y + cr), P(0, 0, y + cr)], col);
      face([P(0, 0, y + cr), P(sEnd, 0, y + cr), P(sEnd, hw), P(0, hw)], col.map((v) => v * 0.98));
      face([P(sEnd, -hw * 2.2), P(len, 0, y + cr * 0.4), P(sEnd, 0, y + cr * 1.6)], col);
      face([P(sEnd, 0, y + cr * 1.6), P(len, 0, y + cr * 0.4), P(sEnd, hw * 2.2)], col);
    };
    const star = (c, s, spin) => {
      if (s <= 0) return; const pts = [];
      for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i / 10) * TAU, rr = (i % 2 ? 0.42 : 1) * s; pts.push(add(c, rotY([Math.cos(a) * rr, -Math.sin(a) * rr, 0], spin))); }
      const f1 = add(c, rotY([0, 0, 0.3 * s], spin)), f2 = add(c, rotY([0, 0, -0.3 * s], spin));
      for (let i = 0; i < 10; i++) { face([pts[i], pts[(i + 1) % 10], f1], i % 2 ? MUS : MUS.map((v) => v * 0.85)); face([pts[(i + 1) % 10], pts[i], f2], MUS.map((v) => v * 0.8)); }
    };

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
        const A2 = [a[0], a[1] * kk, a[2]], B2 = [b[0], b[1] * kk, b[2]];
        tube(A2, B2, 0.42 * kk, 12, STEEL, t * 1.1, STEEL.map((v) => v * 0.8), GLOW);
        [0.22, 0.78].forEach((f) => { const c0 = add(A2, mul(sub(B2, A2), f - 0.03)), c1 = add(A2, mul(sub(B2, A2), f + 0.03)); tube(c0, c1, 0.47 * kk, 12, RUST, t * 1.1, RUST, RUST); });
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
      [[-0.18, 0.5, 0.2], [0.12, 0.62, 0.17], [-0.02, 0.85, 0.15]].forEach(([dx, dz, s], i) => rock([X1 - 1.5 + dx, 0, dz + 0.45], s, i * 3.1, LIME, lu));
      [[0.1, -0.35, 0.16], [-0.16, -0.2, 0.14], [0.05, -0.05, 0.12]].forEach(([dx, dz, s], i) => rock([X1 - 1.15 + dx, 0, dz + 1.25], s, 9 + i * 2.3, CLAY, cu, 0.6));
      for (let i = 0; i < 5; i++) {
        const st = 4.2 + i * 0.38, u = H.clamp((t - st) / 0.55);
        if (u <= 0 || u >= 1) continue;
        const p0 = [X1 - 1.4 + (i % 2) * 0.3, 0.12, 0.9 + (i % 2) * 0.2], p1 = [K0[0] + 0.05, K0[1] + 0.05, 0];
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
      tent(X1 - 0.15, 0.95, 0.95, 0.8, 0.05, tu, (c, w, h) => {
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
      lab(X2 - 0.9, 1.15, 0.52, 0.26, win(10.1, 13.6), 'gipsum 3–5%', 0.42, TEALH);
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
        if (nm === 'semen') pile([x, 0, pz], 0.33, 0.38, CEM, u * (1 - go * 0.6));
        if (nm === 'air') { drop([x - 0.08, 0.02, pz], 0.26, u * (1 - go * 0.6)); drop([x + 0.14, 0.02, pz + 0.08], 0.18, u * (1 - go * 0.6)); }
        if (nm === 'pasir') pile([x, 0, pz], 0.33, 0.28, SAND, u * (1 - go * 0.6));
        if (nm === 'kerikil') for (let j = 0; j < 4; j++) rock([x + (j % 2) * 0.2 - 0.1, 0, pz + Math.floor(j / 2) * 0.17 - 0.08], 0.12, 80 + j, GRAVEL, u * (1 - go * 0.6));
        lab(x, 1.25, 0.33, 0.24, win(st + 0.15, 17.0), nm, 0.6, nm === 'semen' ? REDH : INK);
      });
      // the mixed block (beton) folds up behind
      const bu = pop(17.0, 0.55) * (1 - seg(19.9, 20.3));
      if (bu > 0) {
        const k = Math.min(1, bu);
        box(X3 - 1.05, 0, -0.6, X3 + 1.05, 0.72 * k, 0.05, BETON, (p) => p, printer([['BETON', 0.42, 0.5, '#f6f2e9']]));
        // aggregate specks on the block top
        const r = H.rng(13);
        for (let j = 0; j < 9; j++) rock([X3 - 0.9 + r() * 1.8, 0.72 * k - 0.02, -0.52 + r() * 0.5], 0.06, 90 + j, GRAVEL, k, 0.5);
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
          if (k > 0) strip(a, add(a, mul(sub(mid, a), k)), 0.02, CRYS), strip(b, add(b, mul(sub(mid, b), k)), 0.02, CRYS.map((v) => v * 0.94));
        }
      }
      sign(X4, 20.3, 23.85, [['Mengeras karena', S * 0.62, 0.11], ['KERING?', S * 1.3, 0.21, REDH]]);
      if (t > 22.3 && t < 23.6) cross2([X4 + 0.15, 2.6, -0.62], 0.3 * pop(22.3, 0.3), RED);
      sign(X4, 23.6, 27.2, [['Bukan! Bereaksi dengan', S * 0.62, 0.11], ['AIR', S * 1.4, 0.21, TEALH], ['membentuk kristal pengikat', S * 0.55, 0.3, '#6a6a70', 'mono']]);
      // strength columns: 3, 7, 28 days
      [[3, 0.55, MUS], [7, 0.85, TEAL], [28, 1.25, RED]].forEach(([d, hgt, col], i) => {
        const st = 27.9 + i * 0.45, u = H.clamp((t - st) / 0.4);
        if (u <= 0) return;
        const x = X4b + 0.3 + i * 0.6;
        column(x, -0.15, hgt * H.ease.out(u), col);
        lab(x, 0.45, 0.27, 0.22, u, d + ' hr', 0.6, INK, 0, CREAM, 'mono');
      });
      tent(X4b - 0.6, 0.95, 0.68, 0.78, 0.05, win(29.4, 31.2), printer([['diuji di umur', 0.15, 0.2, '#6a6a70', 'mono'], ['28', 0.5, 0.58, t > 29.6 ? REDH : INK], ['HARI', 0.16, 0.88, INK]]));
      sign(X4b, 27.2, 31.3, [['Jaga tetap basah,', S * 0.62, 0.11], ['JANGAN', S * 1.05, 0.2, REDH], ['cepat kering', S * 0.75, 0.29, INK]]);
    }

    // ---- station 5: TIME JUMP. camera whips along the table; a year card spins back to 125 M, then forward ----
    {
      const G = 1.55; // props are bigger: each era gets its own stage
      // 1) Pantheon (Roman concrete: lime + volcanic ash)
      const p1 = pop(31.55, 0.55) * (1 - seg(39.9, 40.3));
      if (p1 > 0) {
        const k = Math.min(1, p1) * G, x = X5a, z = -0.15;
        tube([x, 0, z], [x, 0.38 * k, z], 0.36 * k, 16, STONE, 0, null, null);
        const n = 16, rings = [0, 0.35, 0.7, 1.0].map((f) => Array.from({ length: n }, (_, j) => { const an = (j / n) * TAU, rr = 0.36 * Math.cos(f * Math.PI / 2) * k; return [x + Math.cos(an) * rr, 0.38 * k + Math.sin(f * Math.PI / 2) * 0.3 * k, z + Math.sin(an) * rr]; }));
        for (let q = 0; q < 3; q++) for (let j = 0; j < n; j++) face([rings[q][j], rings[q][(j + 1) % n], rings[q + 1][(j + 1) % n], rings[q + 1][j]], STONE.map((v) => v * (j % 2 ? 0.97 : 1.02)));
        for (let c = 0; c < 4; c++) tube([x - 0.27 * k + c * 0.18 * k, 0, z + 0.42 * k], [x - 0.27 * k + c * 0.18 * k, 0.36 * k, z + 0.42 * k], 0.04 * k, 6, STONE.map((v) => v * 1.03));
        face([[x - 0.36 * k, 0.36 * k, z + 0.47 * k], [x + 0.36 * k, 0.36 * k, z + 0.47 * k], [x, 0.5 * k, z + 0.47 * k]], STONE.map((v) => v * 1.05));
        face([[x - 0.36 * k, 0.36 * k, z + 0.47 * k], [x + 0.36 * k, 0.36 * k, z + 0.47 * k], [x + 0.36 * k, 0.36 * k, z + 0.2 * k], [x - 0.36 * k, 0.36 * k, z + 0.2 * k]], STONE);
        pile([x - 0.75, 0, 0.75], 0.2, 0.16, LIME, Math.min(1, p1)); pile([x + 0.75, 0, 0.75], 0.2, 0.16, [96, 88, 86], Math.min(1, p1));
      }
      // 2) Portland stone block, 1824
      const p2 = pop(34.0, 0.55) * (1 - seg(39.9, 40.3));
      if (p2 > 0) { const k = Math.min(1, p2), x = X5b; box(x - 0.8, 0, -0.6, x + 0.8, 1.15 * k, 0.25, PSTONE, (p) => p, printer([['PORTLAND', 0.16, 0.42, '#6a6a70', 'mono'], ['STONE', 0.12, 0.6, '#8a8a90', 'mono']])); }
      // 3) Indarung factory, Padang 1910 (+ paper smoke puffs)
      const p3 = pop(35.85, 0.55) * (1 - seg(39.9, 40.3));
      if (p3 > 0) {
        const k = Math.min(1, p3) * G, x = X5c;
        box(x - 0.42 * k, 0, -0.45, x + 0.2 * k, 0.42 * k, 0.1, BRICKC, (p) => p);
        face([[x - 0.42 * k, 0.42 * k, 0.1], [x + 0.2 * k, 0.42 * k, 0.1], [x - 0.11 * k, 0.6 * k, -0.18]], ROOF);
        tube([x + 0.33 * k, 0, -0.25], [x + 0.33 * k, 1.15 * k, -0.25], 0.08 * k, 8, BRICKC.map((v) => v * 0.9));
        tube([x - 0.48 * k, 0.16 * k, 0.4], [x + 0.35 * k, 0.08 * k, 0.4], 0.1 * k, 10, STEEL);
        for (let i = 0; i < 3; i++) { const ph = ((t - 36.2) * 0.6 + i / 3) % 1; if (t > 36.2) rock([x + 0.33 * k + ph * 0.75, 1.15 * k + ph * 0.35, -0.25], 0.08 + ph * 0.1, 200 + i, [236, 234, 228], 1 - ph * 0.6, 0.9); }
      }
      sign(X5a, 31.0, 33.75, [['±1.900 tahun lalu', S * 0.62, 0.11], ['ROMAWI', S * 1.25, 0.21, REDH], ['kapur + abu gunung api', S * 0.55, 0.3, '#6a6a70', 'mono']]);
      sign(X5b, 33.7, 35.6, [['Lompat ke', S * 0.62, 0.11], ['1824', S * 1.35, 0.21, REDH], ['semen modern lahir di Inggris', S * 0.55, 0.3, '#6a6a70', 'mono']]);
      sign(X5c, 35.55, 40.3, [['Lalu di Padang', S * 0.62, 0.11], ['1910', S * 1.35, 0.21, REDH], ['pabrik semen pertama Asia Tenggara', S * 0.48, 0.3, '#6a6a70', 'mono']]);
      if (t > 36.4 && t < 40.3) { const sp = pop(36.4, 0.5) * (1 - seg(39.9, 40.3)); star([X5c + 0.95, 1.25 + 0.05 * Math.sin(t * 3), 0.6], 0.2 * sp, (t - 36.4) * 2); }
      // the year card rides along with the camera and spins through the years
      const yr = (() => {
        if (t < 31.0) return 2026;
        if (t < 31.95) return Math.round(H.lerp(2026, 125, H.ease.inOut(H.clamp((t - 31.0) / 0.95))));
        if (t < 33.75) return 125;
        if (t < 34.35) return Math.round(H.lerp(125, 1824, H.ease.inOut(H.clamp((t - 33.75) / 0.6))));
        if (t < 35.55) return 1824;
        return Math.round(H.lerp(1824, 1910, H.ease.inOut(H.clamp((t - 35.55) / 0.5))));
      })();
      const flick = (t > 31.0 && t < 31.95) || (t > 33.75 && t < 34.35) || (t > 35.55 && t < 36.05);
      tent(cam[0] + 0.8, 1.0, 0.66, 0.52, -0.08, win(30.8, 40.2) * (flick ? 0.86 + 0.14 * Math.abs(Math.sin(t * 40)) : 1), printer([['TAHUN', 0.2, 0.2, '#6a6a70', 'mono'], [yr === 125 ? '125 M' : String(yr), 0.42, 0.62, flick ? INK : REDH]]));
      // speed lines while the camera whips
      const whip = Math.max(seg(31.0, 31.3) * (1 - seg(31.6, 31.95)), seg(33.75, 33.95) * (1 - seg(34.1, 34.35)), seg(35.55, 35.7) * (1 - seg(35.85, 36.05)));
      if (whip > 0.02) { const r = H.rng(Math.floor(t * 30)); for (let i = 0; i < 9; i++) { const y = 0.3 + r() * 2.6, z = 1.0 + r() * 1.2, x = cam[0] - 1.6 + r() * 3.2, l = (0.6 + r()) * whip; strip([x - l, y, z], [x + l, y, z], 0.012, CREAM); } }
    }
    // ---- takeaway, then it refolds into the CTA ----
    tent(X5c, 0.95, 1.38, 0.58, 0, win(40.1, 41.55), (c, w, h) => {
      c.font = SG(100); const k = Math.min(h * 0.42, (100 * w * 0.86) / (c.measureText('Semen  lem batu buatan').width + 60));
      c.textBaseline = 'middle'; c.font = SG(k); c.fillStyle = INK; c.textAlign = 'right'; c.fillText('Semen', w * 0.38, h * 0.5);
      c.fillStyle = REDH; c.beginPath(); c.moveTo(w * 0.405, h * 0.42); c.lineTo(w * 0.445, h * 0.5); c.lineTo(w * 0.405, h * 0.58); c.fill(); c.fillRect(w * 0.39, h * 0.48, w * 0.03, h * 0.04);
      c.textAlign = 'left'; c.fillStyle = REDH; c.fillText('lem batu buatan', w * 0.46, h * 0.5);
    });
    sign(X5c, 40.2, DURATION + 1, [['Bukan sekadar', S * 0.62, 0.11], ['BUBUK ABU-ABU', S * 0.9, 0.21, REDH]]);
    tent(X5c, 0.95, 1.4, 0.68, 0, win(41.45, DURATION + 1), printer([['FOLLOW', 0.48, 0.4, '#f6f2e9'], ['buat fakta rumah berikutnya', 0.17, 0.8, '#f6f2e9', 'mono']]), TEAL);
    if (t > 41.9) star([X5c + 1.2, 1.05 + 0.05 * Math.sin(t * 3), 1.2], 0.22 * pop(41.9, 0.5), (t - 41.9) * 2);
    // ================= render (reference pipeline) =================
    faces.forEach((f) => {
      const [a, b, c] = f.pts;
      let n = norm(cross(sub(b, a), sub(c, a)));
      const cen = mul(f.pts.reduce((s, p) => add(s, p), [0, 0, 0]), 1 / f.pts.length);
      if (dot(n, sub(E, cen)) < 0) n = mul(n, -1);
      const I = 0.36 + 0.7 * Math.max(0, dot(n, Lkey)) + 0.16 * Math.max(0, dot(n, Lfill)) + 0.1 * Math.max(0, -n[1]);
      f.rgb = f.col.map((ch, i) => Math.min(255, ch * I * [1.04, 1, 0.95][i]));
      f.I = I; f.n = n; f.cen = cen;
      f.sp = f.pts.map(proj); f.z = f.sp.reduce((s, p) => s + p[2], 0) / f.sp.length;
    });
    // cull faces turned away (closed boxes) so their creases don't bleed through
    const vis = faces.filter((f) => f.sp.every((p) => p[2] > 0.5));
    {
      const ek = (p) => Math.round(p[0] * 1000) + ',' + Math.round(p[1] * 1000) + ',' + Math.round(p[2] * 1000);
      const edges = new Map();
      vis.forEach((f, fi) => f.pts.forEach((p, i) => {
        const q = f.pts[(i + 1) % f.pts.length], a = ek(p), b = ek(q), k = a < b ? a + '|' + b : b + '|' + a;
        const e = edges.get(k); if (e) e.push(fi); else edges.set(k, [fi]);
        (f.ek || (f.ek = []))[i] = k;
      }));
      vis.forEach((f, fi) => {
        f.ekind = f.ek.map((k) => {
          const fs = edges.get(k);
          if (!fs || fs.length !== 2) return 0;
          const g = vis[fs[0] === fi ? fs[1] : fs[0]];
          const d = dot(sub(g.cen, f.cen), f.n);
          return d > 0.004 ? -1 : d < -0.004 ? 1 : 0;
        });
      });
    }
    vis.sort((a, b) => (b.z + b.bias) - (a.z + a.bias));
    ctx.drawImage(OXC.bg || (OXC.bg = (() => {
      const C = H.layer(W, H_), c = C.getContext('2d');
      const bg = c.createLinearGradient(0, 0, 0, H_);
      bg.addColorStop(0, '#c9d3cf'); bg.addColorStop(0.42, '#dde3de'); bg.addColorStop(0.6, '#e6e6de'); bg.addColorStop(1, '#d8d5ca');
      c.fillStyle = bg; c.fillRect(0, 0, W, H_);
      const spot = c.createRadialGradient(W * 0.44, H_ * 0.44, 60, W * 0.47, H_ * 0.5, 1250); spot.addColorStop(0, 'rgba(255,252,240,0.6)'); spot.addColorStop(1, 'rgba(255,252,240,0)');
      c.fillStyle = spot; c.fillRect(0, 0, W, H_);
      c.globalAlpha = 0.6; c.fillStyle = c.createPattern(OXC.tex || (OXC.tex = makeTex(5)), 'repeat'); c.fillRect(0, 0, W, H_);
      return C;
    })()), 0, 0);
    const lowL = (key, sc0) => { const w = Math.ceil(W * sc0), h = Math.ceil(H_ * sc0); let Lr = OXC[key]; if (!Lr || Lr.width !== w) { Lr = OXC[key] = H.layer(w, h); } const c = Lr.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, w, h); c.setTransform(sc0, 0, 0, sc0, 0, 0); return [Lr, c]; };
    {
      const [SL, sc] = lowL('SLh', 0.5); sc.fillStyle = '#000';
      vis.forEach((f) => { if (f.pts.every((p) => p[1] < 0.02)) return; sc.beginPath(); f.pts.forEach((p, i) => { const s = proj(add(p, mul(Ls, p[1] / -Ls[1]))); i ? sc.lineTo(s[0], s[1]) : sc.moveTo(s[0], s[1]); }); sc.closePath(); sc.fill(); });
      const [CL, cc] = lowL('CLh', 0.5); cc.fillStyle = '#000';
      vis.forEach((f) => {
        let mn = 1e9; f.pts.forEach((p) => { if (p[1] < mn) mn = p[1]; });
        if (mn > 0.22) return;
        cc.beginPath(); f.pts.forEach((p, i) => { const s = proj([p[0], 0, p[2]]); i ? cc.lineTo(s[0], s[1]) : cc.moveTo(s[0], s[1]); }); cc.closePath(); cc.fill();
      });
      const w = SL.width, h = SL.height; let M = OXC.SM; if (!M || M.width !== w) M = OXC.SM = H.layer(w, h);
      const m = M.getContext('2d'); m.globalAlpha = 1; m.filter = 'none'; m.fillStyle = '#fff'; m.fillRect(0, 0, w, h);
      m.filter = 'blur(9px)'; m.globalAlpha = 0.38; m.drawImage(SL, 0, 0);
      m.filter = 'blur(3.5px)'; m.globalAlpha = 0.6; m.drawImage(CL, 0, 0);
      m.filter = 'none'; m.globalAlpha = 1;
      ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(M, 0, 0, W, H_); ctx.restore();
    }
    const OL = OXC.OL || (OXC.OL = H.layer(W, H_)), o = OL.getContext('2d');
    o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, W, H_); o.lineJoin = 'round';
    const Lscr = [-0.6, -0.8];
    vis.forEach((f) => {
      const sp = f.sp;
      let mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9;
      sp.forEach((p) => { if (p[0] < mnx) mnx = p[0]; if (p[0] > mxx) mxx = p[0]; if (p[1] < mny) mny = p[1]; if (p[1] > mxy) mxy = p[1]; });
      if (mxx < -20 || mnx > W + 20 || mxy < -20 || mny > H_ + 20) return;
      const gx = (mnx + mxx) / 2, gy = (mny + mxy) / 2, rr = Math.max(1, Math.max(mxx - mnx, mxy - mny) / 2);
      const g = o.createLinearGradient(gx + Lscr[0] * rr, gy + Lscr[1] * rr, gx - Lscr[0] * rr, gy - Lscr[1] * rr);
      g.addColorStop(0, H.rgba(f.rgb.map((v) => Math.min(255, v * 1.05)), 1)); g.addColorStop(1, H.rgba(f.rgb.map((v) => v * 0.94), 1));
      o.beginPath(); sp.forEach((p, i) => (i ? o.lineTo(p[0], p[1]) : o.moveTo(p[0], p[1]))); o.closePath();
      o.fillStyle = g; o.fill();
      o.strokeStyle = H.rgba(f.rgb, 1); o.lineWidth = 1.0; o.stroke();
      o.strokeStyle = `rgba(255,255,250,${0.05 + 0.08 * Math.min(1, f.I)})`; o.lineWidth = 0.9; o.stroke();
      for (const kind of [-1, 1]) {
        let any = false;
        sp.forEach((p, i) => { if (f.ekind[i] !== kind) return; if (!any) { o.beginPath(); any = true; } const q = sp[(i + 1) % sp.length]; o.moveTo(p[0], p[1]); o.lineTo(q[0], q[1]); });
        if (!any) continue;
        if (kind < 0) { o.strokeStyle = H.rgba(f.rgb.map((v) => v * 0.55), 0.55); o.lineWidth = 1.3; }
        else { o.strokeStyle = `rgba(255,250,242,${0.1 + 0.2 * H.clamp(f.I - 0.5)})`; o.lineWidth = 1.2; }
        o.stroke();
      }
      if (f.paint) {
        const [p0, p1, p3] = f.map.map(proj), cw = 400, ch = 400 * (Math.hypot(p3[0] - p0[0], p3[1] - p0[1]) / Math.max(1, Math.hypot(p1[0] - p0[0], p1[1] - p0[1])));
        if (ch > 2 && ch < 4000) {
          o.save(); o.beginPath(); sp.forEach((p, i) => (i ? o.lineTo(p[0], p[1]) : o.moveTo(p[0], p[1]))); o.closePath(); o.clip();
          o.setTransform((p1[0] - p0[0]) / cw, (p1[1] - p0[1]) / cw, (p3[0] - p0[0]) / ch, (p3[1] - p0[1]) / ch, p0[0], p0[1]);
          f.paint(o, cw, ch); o.restore();
        }
      }
    });
    o.save(); o.globalCompositeOperation = 'source-atop'; o.globalAlpha = 0.9; o.fillStyle = o.createPattern(OXC.tex, 'repeat'); o.fillRect(0, 0, W, H_); o.restore();
    ctx.drawImage(OL, 0, 0);
    // key-light flares: the wrong moment (crack) and the key number
    const flash = Math.max(Math.exp(-Math.pow((t - 22.35) * 5, 2)), Math.exp(-Math.pow((t - 29.65) * 5, 2)), 0.6 * Math.exp(-Math.pow((t - 7.05) * 5, 2)), 0.7 * Math.exp(-Math.pow((t - 31.95) * 6, 2)), 0.5 * Math.exp(-Math.pow((t - 34.35) * 6, 2)), 0.7 * Math.exp(-Math.pow((t - 36.05) * 6, 2)));
    if (flash > 0.01) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = `rgba(255,240,215,${flash * 0.18})`; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
    H.vignette(ctx, W, H_, 0.28, '30,40,40');
    H.grain(ctx, W, H_, 0.022, 3 + Math.floor(t * 24));
  };
  window.EXPLAIN = EXPLAIN;
  window.DURATION = DURATION;
})();
