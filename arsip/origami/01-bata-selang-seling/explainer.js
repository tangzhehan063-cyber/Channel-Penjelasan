// Origami Studio, portrait 1080x1920: "Kenapa bata disusun selang-seling?"
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

  // ---------------- timeline (seconds) ----------------
  const DURATION = 44;
  const WX1 = -1.5, WX2 = 1.5; // stack wall (lurus) / running bond wall (selang-seling)
  // camera stops: [cx, eyeY, eyeZ, targetY]
  const CAM = {
    wide: [0, 3.0, 8.5, 1.3],
    s1: [WX1, 2.25, 5.6, 1.45],
    s2: [WX2, 2.25, 5.6, 1.45],
  };
  const CAMPATH = [ // [startMove, endMove, stop]
    [0, 0, 'wide'], [3.8, 4.6, 's1'], [14.7, 15.5, 's2'], [21.1, 21.9, 'wide'], [30.1, 30.9, 's2'], [35.3, 36.1, 'wide'],
  ];

  const L = 0.7, G = 0.035, BH = 0.17, D = 0.34, ROWS = 8, WW = 3 * L + 2 * G; // brick and wall size
  const build = (row) => 0.25 + row * 0.13; // bricks fold up row by row in the hook

  function bricksOf(kind) { // local wall coords: x from -WW/2..WW/2, row 0 at bottom
    const out = [];
    for (let r = 0; r < ROWS; r++) {
      const y0 = r * (BH + G) + 0.01;
      let xs;
      if (kind === 'stack' || r % 2 === 0) xs = [[0, L], [L + G, 2 * L + G], [2 * L + 2 * G, 3 * L + 2 * G]];
      else { const hl = (L - G) / 2; xs = [[0, hl], [hl + G, hl + G + L], [hl + 2 * G + L, hl + 2 * G + 2 * L], [hl + 3 * G + 2 * L, WW]]; }
      xs.forEach(([a, b], c) => out.push({ r, c, x0: a - WW / 2, x1: b - WW / 2, y0, y1: y0 + BH }));
    }
    return out;
  }
  const BR1 = bricksOf('stack'), BR2 = bricksOf('run');

  const EXPLAIN = (ctx, W, H_, t) => {
    const seg = (a, b) => H.ease.inOut(H.clamp((t - a) / (b - a)));
    const pop = (a, d = 0.45) => { const u = H.clamp((t - a) / d); if (u <= 0) return 0; const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
    const win = (a, b, fi = 0.35, fo = 0.3) => seg(a, a + fi) * (1 - seg(b - fo, b)); // fold up at a, fold down by b

    // ---- camera ----
    let cam = CAM.wide.slice();
    for (const [a, b, k] of CAMPATH) { const u = b > a ? seg(a, b) : (t >= a ? 1 : 0); cam = cam.map((v, i) => H.lerp(v, CAM[k][i], u)); }
    const push = seg(12.3, 12.7) * (1 - seg(14.2, 14.7)); // push-in on the wrong moment (crack)
    const E = [cam[0], cam[1] - push * 0.15, cam[2] - push * 1.1], TG = [cam[0], cam[3] - push * 0.25, 0];
    const fwd = norm(sub(TG, E)), right = norm(cross(fwd, [0, 1, 0])), up = cross(right, fwd);
    const F = 1560, PCX = W / 2, PCY = 900;
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

    // ---- walls ----
    const zf = D / 2; // brick front plane (local z)
    const tintR = H.rng(17), TINT = Array.from({ length: 64 }, () => 0.92 + tintR() * 0.14);
    // load highlight per brick (0..1)
    const loadStack = (b) => (b.c === 1 ? H.clamp((t - (10.3 + (ROWS - 1 - b.r) * 0.16)) / 0.25) : 0) * (1 - seg(14.6, 15.0));
    const loadRun = (b) => {
      const k = ROWS - 1 - b.r, st = 16.6 + k * 0.2; // spreads one course every 0.2 s
      if (t < st) return 0;
      const spread = L / 2 + k * (BH + G) * 1.0; // 45 degrees
      const ov = Math.min(b.x1, spread) - Math.max(b.x0, -spread);
      return ov > 0.04 ? H.clamp((t - st) / 0.25) * (1 - seg(20.9, 21.3)) : 0;
    };
    // out-of-plane push (beat 5): stack columns split apart and lean back; running bond holds together
    const pushU = seg(22.9, 24.0) * (1 - seg(29.5, 30.1));
    const TOPY = ROWS * (BH + G) + 0.01;
    // shear for column c (-1 = whole running-bond wall): pushed back and apart, more at the top
    const shear = (kind, c) => (p) => {
      const k = H.clamp(p[1] / TOPY);
      if (kind === 'stack') return [p[0] + pushU * [-0.07, 0, 0.07][c] * k, p[1], p[2] - pushU * [0.2, 0.5, 0.26][c] * k];
      return [p[0], p[1], p[2] - pushU * 0.045 * k];
    };
    const wall = (kind, X) => {
      const list = kind === 'stack' ? BR1 : BR2;
      const mortU = H.ease.out(H.clamp((t - 0.15) / 0.5));
      const mTop = (TOPY - G + 0.005) * mortU;
      if (mortU > 0) {
        if (kind === 'stack') [0, 1, 2].forEach((c) => { const b = BR1[c], sh = shear(kind, c); box(b.x0 - (c ? G / 2 : -0.02), 0, -zf + 0.03, b.x1 + (c < 2 ? G / 2 : -0.02), mTop, zf - 0.035, MORTAR, (p) => add(sh(p), [X, 0, 0]), null, 0.6); });
        else { const sh = shear(kind, -1); box(-WW / 2 + 0.02, 0, -zf + 0.03, WW / 2 - 0.02, mTop, zf - 0.035, MORTAR, (p) => add(sh(p), [X, 0, 0]), null, 0.6); }
      }
      list.forEach((b, i) => {
        const u = pop(build(b.r) + b.c * 0.03, 0.4); if (u <= 0) return;
        const lf = kind === 'stack' ? loadStack(b) : loadRun(b);
        const base = BRICK.map((v) => v * TINT[i % 64]);
        const col = H.mix(base, MUS, lf * 0.85);
        const hgt = (b.y1 - b.y0) * Math.min(1, u), bob = (1 - Math.min(1, u)) * 0.25;
        const slip = kind === 'stack' && b.c === 1 ? -0.03 * seg(12.45, 12.75) * (1 - seg(14.6, 15.0)) : 0;
        const sh = shear(kind, kind === 'stack' ? b.c : -1);
        box(b.x0, b.y0, -zf, b.x1, b.y0 + hgt, zf, col, (p) => add(sh(p), [X, slip + bob, 0]));
      });
      const pu = H.clamp((t - 0.2) / 0.6);
      if (pu > 0) [-1, 1].forEach((s) => {
        const hx = s * (WW / 2 + 0.11);
        box(hx - 0.1, 0, -zf - 0.02, hx + 0.1, (TOPY + 0.07) * H.ease.out(pu), zf + 0.02, POST, (p) => add(p, [X, 0, 0]));
      });
    };
    wall('stack', WX1); wall('run', WX2);

    // ---- signs: tall tent cards behind the wall carry the headline (they refold between beats) ----
    const sign = (x, a, b, lines, w = 1.45, z = -0.85, sc = 1) => tent(x, z, w, 3.35, 0, win(a, b), printer(lines.map(([tx, f, y, c, fo]) => [tx, f * sc, y, c, fo])));
    const S = 0.115; // headline size as fraction of card height
    sign(0, 0.05, 4.0, [['Kenapa bata disusun', S * 0.62, 0.085], ['SELANG-SELING?', S, 0.23, REDH]], 2.75, -1.1, 1.75);
    sign(WX1, 4.0, 9.15, [['Coba kalau disusun', S * 0.62, 0.11], ['LURUS', S * 1.25, 0.21, REDH], ['sambungan segaris atas-bawah', S * 0.55, 0.3, '#6a6a70', 'mono']]);
    sign(WX1, 9.0, 14.85, [['Beban cuma ditahan', S * 0.62, 0.11], ['1 KOLOM', S * 1.25, 0.21, REDH]]);
    sign(WX2, 15.0, 21.15, [['Selang-seling:', S * 0.62, 0.11], ['MENYEBAR', S * 1.1, 0.21, TEALH], ['dibagi ke bata di bawahnya', S * 0.55, 0.3, '#6a6a70', 'mono']]);
    sign(0, 21.3, 30.2, [['Didorong angin', S * 0.62, 0.085], ['DARI DEPAN', S, 0.23, REDH]], 2.75, -1.1, 1.75);
    sign(WX2, 30.5, 35.5, [['Retaknya pun', S * 0.62, 0.11], ['HARUS BELOK', S * 1.0, 0.21, TEALH]]);
    sign(0, 35.6, DURATION + 1, [['Bukan cuma', S * 0.62, 0.085], ['BIAR RAPI', S * 1.1, 0.24, REDH]], 2.75, -1.1, 1.75);

    // ---- beat 2: the continuous vertical seams of the stack wall get traced in red ----
    {
      const p = seg(5.6, 8.8) * (1 - seg(8.9, 9.25));
      if (p > 0) [0, 1].forEach((j) => {
        const sx = WX1 - WW / 2 + (j + 1) * L + (j + 0.5) * G;
        const z = zf + 0.03, y1 = TOPY + 0.05, y0 = 0.02;
        strip([sx, y1, z], [sx, H.lerp(y1, y0, p), z], 0.03, RED);
      });
    }
    // ---- beat 3: weight lands on the middle column, load runs straight down, crack follows the seam ----
    {
      const drop = H.clamp((t - 9.25) / 0.6), dy = (1 - H.ease.in(drop)) * 2.4, gone = seg(14.6, 15.0);
      if (t > 9.25 && gone < 1) {
        const cx = WX1 + (BR1[1].x0 + BR1[1].x1) / 2, slip = -0.03 * seg(12.45, 12.75);
        box(cx - L / 2 + 0.01, TOPY + dy + slip, -zf, cx + L / 2 - 0.01, TOPY + dy + slip + 0.42 * (1 - gone), zf, IND, (p) => p,
          printer([['BEBAN', 0.42, 0.52, '#f6f2e9']]));
        // load arrow down the column (in wall plane)
        arrowG([cx, TOPY - 0.08, zf + 0.06], [0, -1, 0], [1, 0, 0], [0, 0, 1], TOPY - 0.25, seg(10.3, 11.6) * (1 - gone), MUS, 0.1);
      }
      const ck = H.clamp((t - 12.35) / 1.7) * 9 * (1 - seg(14.6, 15.0));
      if (ck > 0) {
        const r = H.rng(91), sx = WX1 - WW / 2 + 2 * L + 1.5 * G, pts = [];
        for (let i = 0; i <= 9; i++) pts.push([sx + (i % 2 ? 1 : -1) * r.range(0.004, 0.02), TOPY - i * (TOPY / 9), zf + 0.04]);
        polyStrip(pts, ck, 0.022, RED);
      }
    }
    // ---- beat 4: the same weight on the running-bond wall, load fans out at 45 degrees ----
    {
      const drop = H.clamp((t - 15.9) / 0.6), dy = (1 - H.ease.in(drop)) * 2.4, gone = seg(20.9, 21.3);
      if (t > 15.9 && gone < 1) {
        box(WX2 - L / 2 + 0.01, TOPY + dy, -zf, WX2 + L / 2 - 0.01, TOPY + dy + 0.42 * (1 - gone), zf, IND, (p) => p,
          printer([['BEBAN', 0.42, 0.52, '#f6f2e9']]));
        const a = seg(18.6, 19.9) * (1 - gone), len = TOPY * 1.02;
        [-1, 1].forEach((s) => arrowG([WX2 + s * 0.12, TOPY - 0.1, zf + 0.06], norm([s * 0.85, -1, 0]), [1, 0, 0], [0, 0, 1], len, a, MUS, 0.07));
        arrowG([WX2, TOPY - 0.1, zf + 0.06], [0, -1, 0], [1, 0, 0], [0, 0, 1], TOPY * 0.55, a, MUS, 0.07);
      }
    }
    // ---- beat 5: wind push arrows on the table, key number card ----
    {
      const a = seg(22.3, 23.1) * (1 - seg(29.6, 30.1));
      [WX1, WX2].forEach((X) => [-0.55, 0.55].forEach((o) => arrowG([X + o, 0.012, 2.9], [0, 0, -1], [1, 0, 0], [0, 1, 0], 1.0, a, CREAM, 0.18)));
      // key number on a tent card in front of the stack wall: refolds from "?" to the number
      const nu = win(25.1, 30.2);
      tent(WX1 + 0.3, 1.45, 1.05, 1.15, 0.06, nu, (c, w, h) => printer([['tumpuk lurus', 0.15, 0.18, '#6a6a70', 'mono'], ['±30%', 0.5, 0.55, t > 26.85 ? REDH : INK], ['kekuatannya', 0.15, 0.88, '#6a6a70', 'mono']])(c, w, h));
      tent(WX2 - 0.3, 1.45, 1.05, 1.15, -0.06, win(28.2, 30.2), printer([['selang-seling', 0.15, 0.18, '#6a6a70', 'mono'], ['100%', 0.5, 0.55, TEALH], ['patokan', 0.15, 0.88, '#6a6a70', 'mono']]));
    }
    // ---- beat 6: crack on the running-bond wall has to step brick by brick, then stops ----
    {
      const k = H.clamp((t - 32.35) / 1.5) * 7 * (1 - seg(35.2, 35.6));
      if (k > 0) {
        // a stepped crack: down a head joint, along the bed joint to the next head joint (offset half a brick), down again
        const z = zf + 0.04, pts = [], hj = (r) => { const row = BR2.filter((b) => b.r === r); return row.slice(0, -1).map((b, i) => WX2 + (b.x1 + row[i + 1].x0) / 2); };
        let x = hj(ROWS - 1)[1];
        for (let i = 0; i < 4; i++) {
          const r = ROWS - 1 - i, yt = r * (BH + G) + 0.01 + BH + G / 2, yb = r * (BH + G) + 0.01 - G / 2;
          if (i) { const nx = hj(r).reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a)); pts.push([nx, yt, z]); x = nx; }
          else pts.push([x, yt, z]);
          pts.push([x, yb, z]);
        }
        polyStrip(pts, k, 0.022, RED);
        const stopU = pop(34.1, 0.35) * (1 - seg(35.2, 35.6));
        if (stopU > 0) { const c0 = add(pts[pts.length - 1], [0.42, -0.02, 0.05]); strip(add(c0, [-0.22 * stopU, 0.02, 0]), add(c0, [-0.06 * stopU, -0.16 * stopU, 0]), 0.05, GREEN); strip(add(c0, [-0.06 * stopU, -0.16 * stopU, 0.01]), add(c0, [0.3 * stopU, 0.26 * stopU, 0.01]), 0.05, GREEN); }
      }
    }
    // ---- beat 7 / 8: takeaway and CTA cards fold up in front ----
    tent(0, 1.25, 2.2, 0.66, 0, win(38.95, 40.45), (c, w, h) => {
      c.font = SG(100); const k = Math.min(h * 0.42, (100 * w * 0.86) / (c.measureText('Selang-seling  beban dibagi').width + 60));
      c.textBaseline = 'middle'; c.font = SG(k); c.fillStyle = INK; c.textAlign = 'right'; c.fillText('Selang-seling', w * 0.47, h * 0.5);
      c.fillStyle = REDH; c.beginPath(); c.moveTo(w * 0.495, h * 0.42); c.lineTo(w * 0.535, h * 0.5); c.lineTo(w * 0.495, h * 0.58); c.fill(); c.fillRect(w * 0.48, h * 0.48, w * 0.03, h * 0.04);
      c.textAlign = 'left'; c.fillStyle = REDH; c.fillText('beban dibagi', w * 0.55, h * 0.5);
    });
    tent(0, 1.25, 1.6, 0.72, 0, win(40.35, DURATION + 1), printer([['FOLLOW', 0.48, 0.4, '#f6f2e9'], ['buat fakta rumah berikutnya', 0.17, 0.8, '#f6f2e9', 'mono']]), TEAL);
    if (t > 40.8) { const sp = pop(40.8, 0.5); const c = [1.55, 0.95 + 0.05 * Math.sin(t * 3), 1.7]; for (let i = 0; i < 10; i++) { const a0 = -Math.PI / 2 + (i / 10) * TAU, a1 = -Math.PI / 2 + ((i + 1) / 10) * TAU, r0 = (i % 2 ? 0.42 : 1) * 0.26 * sp, r1 = ((i + 1) % 2 ? 0.42 : 1) * 0.26 * sp, sp2 = (t - 40.8) * 2; face([add(c, rotY([Math.cos(a0) * r0, -Math.sin(a0) * r0, 0], sp2)), add(c, rotY([Math.cos(a1) * r1, -Math.sin(a1) * r1, 0], sp2)), add(c, rotY([0, 0, 0.07 * sp], sp2))], i % 2 ? MUS : MUS.map((v) => v * 0.85)); } }

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
    const flash = Math.max(Math.exp(-Math.pow((t - 12.45) * 5, 2)), Math.exp(-Math.pow((t - 26.85) * 5, 2)));
    if (flash > 0.01) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = `rgba(255,240,215,${flash * 0.18})`; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
    H.vignette(ctx, W, H_, 0.28, '30,40,40');
    H.grain(ctx, W, H_, 0.022, 3 + Math.floor(t * 24));
  };

  window.EXPLAIN = EXPLAIN;
  window.DURATION = DURATION;
})();
