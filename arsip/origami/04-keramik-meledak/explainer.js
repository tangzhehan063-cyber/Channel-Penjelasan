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

  const METERC = [222, 220, 212], CABLE = [60, 62, 68], FANC = [236, 236, 230], BULB = [255, 226, 140], INKC = [52, 54, 60];
  const COPPER = [196, 122, 72], CHIP = [44, 120, 112], GOLD = [232, 186, 80], OLDM = [196, 198, 196], ALU = [210, 214, 218];
  // ---------------- timeline (seconds) ----------------
  const DURATION = 50.6;
  const X1 = -6, X2 = -2, X3 = 2, X4 = 6, X5 = 10;
  const CAM = { s1: [X1, 2.25, 5.6, 1.4], s2: [X2, 2.25, 5.6, 1.4], s3: [X3, 2.25, 5.6, 1.4], s4: [X4, 2.25, 5.6, 1.4], s5: [X5, 2.25, 5.6, 1.4] };
  const CAMPATH = [[0, 0, 's1'], [4.0, 4.8, 's2'], [11.0, 11.8, 's3'], [19.2, 20.0, 's4'], [27.8, 28.6, 's5']];
  // ---- retime: final video time (synced to the VO) -> storyboard time ----
  const TM = [[0, 0], [2.3, 1.25], [5.3, 2.55], [7.35, 4.0], [11.7, 8.2], [16.2, 11.0], [19.25, 13.0], [23.0, 14.6], [23.4, 14.85], [24.8, 15.4], [26.3, 19.2], [27.0, 19.85], [29.0, 20.35], [30.4, 20.6], [32.3, 21.2], [34.1, 22.5], [35.4, 24.6], [38.0, 27.8], [39.6, 29.2], [41.8, 29.9], [43.5, 30.6], [45.0, 32.0], [45.4, 35.8], [48.1, 38.0], [50.6, 41.5]];
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
    const push = seg(14.3, 14.9) * (1 - seg(16.0, 16.6)); // push-in on the wrong guess
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

    // ================= SCENE: kWh meter =================
    // LED state: blinks with a given period, short flash
    const ledOn = (period, t0 = 0) => ((t - t0) % period + period) % period < Math.min(0.12, period * 0.4);
    // printed face of a prepaid meter
    const meterFace = (lcd, led, imp = '1000 imp/kWh') => (c, w, h) => {
      c.fillStyle = 'rgba(0,0,0,0.05)'; c.fillRect(w * 0.06, h * 0.05, w * 0.88, h * 0.9);
      c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = INK; c.font = SG(w * 0.075); c.fillText('kWh METER', w * 0.12, h * 0.12);
      c.font = SM(w * 0.045); c.fillStyle = GREY; c.fillText('PRABAYAR', w * 0.12, h * 0.19);
      // LED
      const lx = w * 0.8, ly = h * 0.14, r = w * 0.07;
      if (led) { const g = c.createRadialGradient(lx, ly, 0, lx, ly, r * 4); g.addColorStop(0, 'rgba(255,90,60,0.85)'); g.addColorStop(1, 'rgba(255,90,60,0)'); c.fillStyle = g; c.beginPath(); c.arc(lx, ly, r * 4, 0, TAU); c.fill(); }
      c.fillStyle = led ? '#ff4a33' : '#7a2a22'; c.beginPath(); c.arc(lx, ly, r, 0, TAU); c.fill();
      c.fillStyle = GREY; c.font = SM(w * 0.04); c.textAlign = 'center'; c.fillText(imp, lx, ly + r * 2.3);
      // LCD
      c.fillStyle = '#2f4a3c'; c.beginPath(); c.roundRect(w * 0.12, h * 0.29, w * 0.76, h * 0.17, w * 0.03); c.fill();
      c.fillStyle = '#b9f0c8'; c.font = SM(w * 0.11); c.textAlign = 'right'; c.fillText(lcd, w * 0.84, h * 0.38);
      // keypad
      for (let i = 0; i < 12; i++) { const kx = w * (0.2 + (i % 3) * 0.22), ky = h * (0.56 + Math.floor(i / 3) * 0.095); c.fillStyle = '#d9d4c6'; c.beginPath(); c.roundRect(kx - w * 0.08, ky - h * 0.035, w * 0.16, h * 0.07, w * 0.02); c.fill(); c.fillStyle = INK; c.font = SM(w * 0.05); c.textAlign = 'center'; c.fillText('123456789*0#'[i], kx, ky + 1); }
    };
    const disc = (c, r, hgt, col, axis = [0, 1, 0], spin = 0, n = 16, mark = null) => {
      const a = add(c, mul(axis, -hgt / 2)), b = add(c, mul(axis, hgt / 2));
      tube(a, b, r, n, col, spin, col.map((v) => v * 0.92), col.map((v) => Math.min(255, v * 1.06)), mark);
    };

    // ---- smooth paper cut-outs (outline sampled from curves, ink-line illustration printed on it) ----
    function shape(cmds) { const P = []; let cur = [0, 0];
      cmds.forEach((c) => {
        if (c[0] === 'M') { cur = [c[1], c[2]]; P.push(cur); }
        else if (c[0] === 'L') { cur = [c[1], c[2]]; P.push(cur); }
        else if (c[0] === 'Q') { const a = cur, q = [c[1], c[2]], b = [c[3], c[4]]; for (let k = 1; k <= 14; k++) { const s2 = k / 14, m = 1 - s2; P.push([m * m * a[0] + 2 * m * s2 * q[0] + s2 * s2 * b[0], m * m * a[1] + 2 * m * s2 * q[1] + s2 * s2 * b[1]]); } cur = b; }
        else if (c[0] === 'A') { const [, cx, cy, rx, ry, a0, a1] = c, n = Math.max(8, Math.round(Math.abs(a1 - a0) * 12)); for (let k = 0; k <= n; k++) { const a = a0 + (a1 - a0) * k / n; P.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); } cur = P[P.length - 1]; }
      });
      const bb = [Math.min(...P.map((p) => p[0])), Math.min(...P.map((p) => p[1])), Math.max(...P.map((p) => p[0])), Math.max(...P.map((p) => p[1]))];
      return { P, bb };
    }
    const DEG = Math.PI / 180;
    const BULB_O = shape([['M', -0.055, 0.0], ['L', 0.055, 0.0], ['L', 0.062, 0.115], ['Q', 0.075, 0.17, 0.115, 0.215], ['A', 0, 0.33, 0.165, 0.165, -45 * DEG, 225 * DEG], ['Q', -0.075, 0.17, -0.062, 0.115], ['L', -0.055, 0.0]]);
    const FAN_O = shape([['M', -0.17, 0.0], ['L', 0.17, 0.0], ['Q', 0.18, 0.06, 0.12, 0.07], ['L', 0.022, 0.075], ['L', 0.022, 0.215], ['A', 0, 0.44, 0.23, 0.23, -84 * DEG, 264 * DEG], ['L', -0.022, 0.215], ['L', -0.022, 0.075], ['L', -0.12, 0.07], ['Q', -0.18, 0.06, -0.17, 0.0]]);
    const IRON_O = shape([['M', -0.25, 0.0], ['L', 0.2, 0.0], ['Q', 0.29, 0.0, 0.31, 0.03], ['Q', 0.22, 0.13, 0.1, 0.15], ['Q', 0.11, 0.3, -0.02, 0.31], ['L', -0.17, 0.31], ['Q', -0.24, 0.31, -0.24, 0.26], ['L', -0.22, 0.15], ['Q', -0.255, 0.14, -0.255, 0.1], ['L', -0.25, 0.0]]);
    const RICE_O = shape([['M', -0.19, 0.0], ['L', -0.13, 0.0], ['L', -0.13, 0.025], ['L', 0.13, 0.025], ['L', 0.13, 0.0], ['L', 0.19, 0.0], ['L', 0.19, 0.025], ['Q', 0.235, 0.03, 0.235, 0.08], ['L', 0.235, 0.33], ['L', 0.265, 0.335], ['L', 0.265, 0.39], ['Q', 0.24, 0.5, 0.0, 0.5], ['Q', -0.24, 0.5, -0.265, 0.39], ['L', -0.265, 0.335], ['L', -0.235, 0.33], ['L', -0.235, 0.08], ['Q', -0.235, 0.03, -0.19, 0.025], ['L', -0.19, 0.0]]);
    // stand the outline up from flat (hinged on its bottom edge), with a darker paper backing for thickness
    const cutout = (x, z, O, u, paint, col, sc = 1.25) => {
      if (u <= 0) return;
      const th = (1 - Math.min(1.08, u)) * Math.PI / 2, cs = Math.cos(th), sn = Math.sin(th);
      const W3 = (px, py, dz = 0) => [x + px * sc, py * sc * cs + 0.004, z + dz - py * sc * sn];
      face(O.P.map(([px, py]) => W3(px, py, -0.03)), col.map((v) => v * 0.8), { bias: 0.05 });
      const [x0, y0, x1, y1] = O.bb;
      face(O.P.map(([px, py]) => W3(px, py)), col, { map: [W3(x0, y1), W3(x1, y1), W3(x0, y0)], paint: (c, w, h) => paint(c, w, h, (px, py) => [(px - x0) / (x1 - x0) * w, (y1 - py) / (y1 - y0) * h], O) });
      // little easel leg behind
      const L0 = W3(-0.03, 0.02, -0.03), L1 = W3(0.03, 0.02, -0.03), Lt = W3(0, Math.min(0.2, (y1 - y0) * 0.45), -0.03);
      face([L0, L1, [Lt[0], 0.004, Lt[2] - 0.18 * cs], ], col.map((v) => v * 0.72), { bias: 0.1 });
    };
    const INKL = '#33353b';
    const pathOf = (c, M, pts) => { c.beginPath(); pts.forEach(([px, py], i) => { const q = M(px, py); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); };
    const rim = (c, M, O, lw = 9) => { pathOf(c, M, O.P); c.closePath(); c.lineWidth = lw; c.lineJoin = 'round'; c.strokeStyle = INKL; c.stroke(); };
    const ln = (c, M, pts, lw = 5, col = INKL) => { pathOf(c, M, pts); c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = col; c.stroke(); };
    const sc2 = (M, r) => Math.abs(M(r, 0)[0] - M(0, 0)[0]);
    const paintBulb = (on) => (c, w, h, M, O) => {
      const g = c.createRadialGradient(...M(-0.05, 0.4), 10, ...M(0, 0.3), sc2(M, 0.24));
      g.addColorStop(0, on ? '#fff6c4' : '#f4efdc'); g.addColorStop(0.55, on ? '#ffd43a' : '#e8e2c8'); g.addColorStop(1, on ? '#f2b21c' : '#d8d2b8');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      // crayon highlight strokes
      c.save(); c.globalAlpha = on ? 0.55 : 0.3; c.strokeStyle = '#fffbe8'; c.lineCap = 'round';
      for (let i = 0; i < 9; i++) { const a = M(-0.11 + i * 0.012, 0.42 - i * 0.004), b = M(-0.06 + i * 0.016, 0.27 + i * 0.006); c.lineWidth = 4; c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.stroke(); }
      c.restore();
      // screw base
      const b0 = M(-0.07, 0.12), b1 = M(0.07, -0.01); c.fillStyle = '#8f9196'; c.fillRect(b0[0], b0[1], b1[0] - b0[0], b1[1] - b0[1]);
      for (let k = 0; k < 4; k++) { const yy = 0.105 - k * 0.026; ln(c, M, [[-0.062, yy], [0.062, yy - 0.012]], 5); }
      ln(c, M, [[-0.025, 0.004], [0.025, 0.004]], 7);
      // filament
      ln(c, M, [[-0.022, 0.13], [-0.03, 0.27]], 5); ln(c, M, [[0.022, 0.13], [0.03, 0.27]], 5);
      ln(c, M, [[-0.05, 0.29], [-0.03, 0.27], [-0.012, 0.3], [0.0, 0.275], [0.012, 0.3], [0.03, 0.27], [0.05, 0.29]], 5, on ? '#b2560e' : INKL);
      ln(c, M, [[-0.062, 0.118], [0.062, 0.118]], 6);
      rim(c, M, O);
    };
    const paintFan = (tt) => (c, w, h, M, O) => {
      c.fillStyle = '#ecebe4'; c.fillRect(0, 0, w, h);
      const C0 = M(0, 0.44), R = sc2(M, 0.215);
      c.fillStyle = '#e3e6e2'; c.beginPath(); c.arc(C0[0], C0[1], R, 0, TAU); c.fill();
      // blades (spinning)
      c.save(); c.translate(C0[0], C0[1]); c.rotate(tt * 9);
      for (let b = 0; b < 3; b++) { c.rotate(TAU / 3); c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(R * 0.25, -R * 0.55, R * 0.85, -R * 0.45, R * 0.82, -R * 0.08); c.bezierCurveTo(R * 0.7, R * 0.12, R * 0.3, R * 0.12, 0, 0); c.fillStyle = 'rgba(48,140,128,0.9)'; c.fill(); c.lineWidth = 4; c.strokeStyle = INKL; c.stroke(); }
      c.restore();
      // grill
      c.save(); c.strokeStyle = 'rgba(51,53,59,0.55)'; c.lineWidth = 2.5;
      for (let r = 1; r <= 3; r++) { c.beginPath(); c.arc(C0[0], C0[1], R * r / 3.2, 0, TAU); c.stroke(); }
      for (let a = 0; a < 16; a++) { const an = a * TAU / 16; c.beginPath(); c.moveTo(C0[0] + Math.cos(an) * R * 0.2, C0[1] + Math.sin(an) * R * 0.2); c.lineTo(C0[0] + Math.cos(an) * R, C0[1] + Math.sin(an) * R); c.stroke(); }
      c.restore();
      c.fillStyle = '#f4f2ea'; c.beginPath(); c.arc(C0[0], C0[1], R * 0.17, 0, TAU); c.fill(); c.lineWidth = 5; c.strokeStyle = INKL; c.stroke();
      c.lineWidth = 7; c.beginPath(); c.arc(C0[0], C0[1], R * 0.98, 0, TAU); c.stroke();
      // base buttons
      [[-0.08, '#d8584a'], [0, '#c9cbc8'], [0.08, '#c9cbc8']].forEach(([bx, bc]) => { const q = M(bx, 0.04); c.fillStyle = bc; c.beginPath(); c.ellipse(q[0], q[1], sc2(M, 0.022), sc2(M, 0.012), 0, 0, TAU); c.fill(); c.lineWidth = 3; c.stroke(); });
      rim(c, M, O);
    };
    const paintIron = () => (c, w, h, M, O) => {
      const g = c.createLinearGradient(...M(0, 0.31), ...M(0, 0.05)); g.addColorStop(0, '#e06a52'); g.addColorStop(1, '#c84c3a');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      // handle hole
      pathOf(c, M, [[-0.17, 0.2], [-0.03, 0.2], [0.03, 0.2], [0.04, 0.24], [-0.02, 0.255], [-0.15, 0.255], [-0.18, 0.24], [-0.17, 0.2]]); c.closePath(); c.fillStyle = '#dfe2dc'; c.fill(); c.lineWidth = 5; c.strokeStyle = INKL; c.stroke();
      // soleplate
      pathOf(c, M, [[-0.25, 0.0], [0.2, 0.0], [0.31, 0.03], [0.26, 0.055], [-0.252, 0.055]]); c.closePath(); c.fillStyle = '#b9bdc2'; c.fill(); c.lineWidth = 5; c.stroke();
      ln(c, M, [[-0.23, 0.03], [0.22, 0.03]], 2.5, 'rgba(51,53,59,0.45)');
      // dial + highlight
      const d = M(0.0, 0.12); c.fillStyle = '#f4f2ea'; c.beginPath(); c.arc(d[0], d[1], sc2(M, 0.035), 0, TAU); c.fill(); c.lineWidth = 5; c.stroke();
      ln(c, M, [[0.0, 0.12], [0.022, 0.14]], 4);
      ln(c, M, [[-0.2, 0.28], [-0.05, 0.28]], 6, 'rgba(255,230,215,0.6)');
      // cord
      ln(c, M, [[-0.24, 0.1], [-0.26, 0.08]], 8);
      rim(c, M, O);
    };
    const paintRice = (tt) => (c, w, h, M, O) => {
      const g = c.createLinearGradient(...M(-0.24, 0), ...M(0.24, 0)); g.addColorStop(0, '#f7f6f0'); g.addColorStop(0.6, '#efeee7'); g.addColorStop(1, '#dddcd4');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      // lid
      pathOf(c, M, [[-0.265, 0.335], [0.265, 0.335], [0.265, 0.39], [0.24, 0.45], [0.0, 0.5], [-0.24, 0.45], [-0.265, 0.39]]); c.closePath(); c.fillStyle = '#e4e3dc'; c.fill();
      ln(c, M, [[-0.262, 0.335], [0.262, 0.335]], 6); ln(c, M, [[-0.235, 0.36], [0.235, 0.36]], 3, 'rgba(51,53,59,0.5)');
      ln(c, M, [[-0.235, 0.09], [0.235, 0.09]], 5);
      // handle nub on top
      const tp = M(-0.09, 0.49), tq = M(-0.04, 0.505); c.fillStyle = '#cfcfc8'; c.fillRect(tp[0], tq[1], tq[0] - tp[0], tp[1] - tq[1]);
      // front panel arch
      const pc = M(0, 0.24), pw = sc2(M, 0.055); c.fillStyle = '#d9d8d0';
      c.beginPath(); c.moveTo(pc[0] - pw, M(0, 0.12)[1]); c.lineTo(pc[0] - pw, pc[1]); c.arc(pc[0], pc[1], pw, Math.PI, 0); c.lineTo(pc[0] + pw, M(0, 0.12)[1]); c.closePath(); c.fill(); c.lineWidth = 4.5; c.strokeStyle = INKL; c.stroke();
      const cook = 0.6 + 0.4 * Math.sin(tt * 4);
      [[0.215, `rgba(240,120,40,${cook})`], [0.19, '#c9cbc8']].forEach(([yy, cc]) => { const q = M(-0.03, yy); c.fillStyle = cc; c.beginPath(); c.arc(q[0], q[1], sc2(M, 0.009), 0, TAU); c.fill(); c.lineWidth = 2.5; c.stroke(); ln(c, M, [[-0.012, yy], [0.035, yy]], 2.5); });
      const s0 = M(-0.035, 0.165), s1 = M(0.035, 0.13); c.fillStyle = '#c8c7bf'; c.fillRect(s0[0], s0[1], s1[0] - s0[0], s1[1] - s0[1]); c.lineWidth = 3.5; c.strokeRect(s0[0], s0[1], s1[0] - s0[0], s1[1] - s0[1]);
      ln(c, M, [[-0.02, 0.142], [0.02, 0.142]], 5);
      // feet
      [[-0.16], [0.16]].forEach(([fx]) => { const a = M(fx - 0.03, 0.025), b = M(fx + 0.03, 0.0); c.fillStyle = '#8f9196'; c.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); });
      rim(c, M, O);
    };

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
    const flash = Math.max(Math.exp(-Math.pow((t - 28.0) * 5, 2)), Math.exp(-Math.pow((t - 24.45) * 5, 2)), 0.5 * Math.exp(-Math.pow((t - 0.62) * 6, 2)));
    if (flash > 0.01) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = `rgba(255,240,215,${flash * 0.18})`; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
    H.vignette(ctx, W, H_, 0.28, '30,40,40');
    H.grain(ctx, W, H_, 0.022, 3 + Math.floor(t * 24));
  };
  window.EXPLAIN = EXPLAIN;
  window.DURATION = DURATION;
})();
