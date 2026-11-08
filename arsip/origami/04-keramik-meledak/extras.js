// Subtitles (burn-in) + sound score, timed to the final VO (VO starts at t = 0.3 s).
(function () {
  const CUES = [
    [0.52, 3.05, 'Keramik di lantai rumahmu bisa *meledak sendiri.*'],
    [3.6, 4.77, 'Tanpa disentuh siapa pun.'],
    [5.42, 7.29, 'Ini bukan mistis. Ini *fisika.*'],
    [8.23, 10.17, 'Saat kena panas, keramik *memuai.*'],
    [10.69, 14.79, 'Cuma sedikit: lantai 5 meter memanjang sekitar *1 milimeter.*'],
    [15.25, 16.06, 'Tapi dorongannya *kuat.*'],
    [16.63, 20.68, 'Kalau keramik dipasang mepet tanpa celah, dorongan itu nggak punya *tempat lari.*'],
    [21.39, 23.2, 'Tekanannya numpuk, lalu... *duk!*'],
    [23.58, 25.83, 'Keramik terangkat. Ini disebut *popping.*'],
    [26.44, 29.95, 'Penyebab kedua: perekatnya nggak penuh, jadi ada *rongga* di bawahnya.'],
    [30.5, 33.15, 'Coba ketuk. Yang padat bunyinya *"tok",*'],
    [33.33, 34.58, 'yang kopong bunyinya *"dug".*'],
    [35.49, 38.09, 'Kalau air masuk lewat nat, perekatnya *makin lepas.*'],
    [38.7, 41.55, 'Biar aman: pakai *nat 2–3 milimeter,*'],
    [41.9, 43.4, 'sisakan *celah* di tepi dinding,'],
    [43.58, 44.92, 'dan pastikan perekatnya *penuh.*'],
    [45.59, 47.76, 'Coba ketuk lantai rumahmu. Ada yang *kopong?*'],
    [48.21, 49.97, '*Follow* buat fakta rumah berikutnya!'],
  ];
  window.CUES = CUES;

  // paper subtitle slip: cream strip, ink text, key words in red; lands inside the safe zone (y < 1536)
  const FS = 54, LH = 68, MAXW = 880, BASE = 1530;
  function wrap(ctx, words) {
    const lines = [[]]; let w = 0;
    for (const wd of words) {
      const ww = ctx.measureText(wd.t + ' ').width;
      if (w + ww > MAXW && lines[lines.length - 1].length) { lines.push([]); w = 0; }
      lines[lines.length - 1].push(wd); w += ww;
    }
    return lines;
  }
  window.drawSubs = function (ctx, W, H_, t) {
    const c = CUES.find(([a, b]) => t >= a && t < b + 0.08);
    if (!c) return;
    const [a, b, txt] = c;
    const u = H.clamp((t - a) / 0.14), o = H.clamp((b + 0.08 - t) / 0.08);
    let em = false; const words = [];
    txt.split(' ').forEach((raw) => { let s = raw; const st = s.startsWith('*'); if (st) { em = true; s = s.slice(1); } const en = s.includes('*'); s = s.replace('*', ''); words.push({ t: s, em }); if (en) em = false; });
    ctx.save();
    ctx.font = `700 ${FS}px "Space Grotesk"`; ctx.textBaseline = 'middle';
    const lines = wrap(ctx, words);
    const widths = lines.map((ln) => ctx.measureText(ln.map((x) => x.t).join(' ')).width);
    const bw = Math.max(...widths) + 64, bh = lines.length * LH + 34;
    const by = BASE - bh + (1 - H.ease.out(u)) * 18, bx = (W - bw) / 2;
    ctx.globalAlpha = Math.min(u * 1.4, 1) * o;
    ctx.shadowColor = 'rgba(30,30,20,0.28)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
    ctx.fillStyle = 'rgba(248,245,236,0.96)';
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 14); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(bx + bw / 2 - 1, by + 4, 2, bh - 8); // centre crease of the slip
    lines.forEach((ln, i) => {
      let x = W / 2 - widths[i] / 2; const y = by + 17 + LH * (i + 0.5);
      ln.forEach((wd) => { ctx.fillStyle = wd.em ? '#d9472c' : '#23242a'; ctx.fillText(wd.t, x, y); x += ctx.measureText(wd.t + ' ').width; });
    });
    ctx.restore();
  };

  // ---------- sound: paper on a studio table, sitting under the voiceover ----------
  window.scoreSound = function (k) {
    const POP = 1 - 1.5 / 2.5;
    const crease = (t, g = 1, p = 0, minor = true) => {
      k.noise(t, { dur: 0.028, filter: 'bandpass', f: 1700, q: 1.1, gain: 0.55 * g, a: 0.001, pan: p, minor });
      k.noise(t, { dur: 0.07, color: 'brown', filter: 'lowpass', f: 520, gain: 0.42 * g, a: 0.002, pan: p, minor });
    };
    const fold = (t0, t1, g = 1, p = 0, minor = true) => {
      const d = t1 - t0;
      k.noise(t0, { dur: d, color: 'pink', filter: 'bandpass', f: [[0, 520], [d, 1300]], q: 0.6, gain: 0.095 * g, a: d * 0.55, pan: p, minor: true });
      for (let i = 1; i <= 3; i++) k.noise(t0 + d * (0.25 + i * 0.17), { dur: 0.018, filter: 'bandpass', f: 1500 + i * 250, q: 1.2, gain: 0.07 * g, a: 0.001, pan: p, minor: true });
      crease(t1, g, p, minor);
    };
    const unfold = (t0, g = 0.6, p = 0) => { k.noise(t0, { dur: 0.3, color: 'pink', filter: 'bandpass', f: [[0, 1200], [0.3, 500]], q: 0.6, gain: 0.08 * g, a: 0.12, pan: p, minor: true }); crease(t0 + 0.3, 0.4 * g, p); };
    const slideSheet = (t0, t1, g = 1, p = 0) => { const d = t1 - t0; k.noise(t0, { dur: d, filter: 'bandpass', f: [[0, 700], [d, 1000]], q: 0.7, gain: 0.08 * g, a: d * 0.4, hold: d * 0.3, pan: p, minor: true }); crease(t1, 0.45 * g, p); };
    const tap = (t, g = 1, p = 0) => { k.noise(t, { dur: 0.03, color: 'brown', filter: 'lowpass', f: 700, gain: 0.3 * g, a: 0.001, pan: p, minor: true }); k.noise(t, { dur: 0.015, filter: 'bandpass', f: 1300, q: 1, gain: 0.08 * g, a: 0.001, pan: p, minor: true }); };
    const glide = (t, d) => k.noise(t, { dur: d, color: 'brown', filter: 'lowpass', f: [[0, 220], [d * 0.5, 420], [d, 220]], gain: 0.09, a: d * 0.5, minor: true });
    const tick = (t, g, p, f = 1500) => { k.noise(t, { dur: 0.02, filter: 'bandpass', f, q: 1.6, gain: 0.26 * g, a: 0.001, pan: p, minor: true }); k.tone(t, { f: 240, dur: 0.03, gain: 0.05 * g, pan: p, minor: true }); };
    const tear = (t, d, g = 1, p = 0) => { const r = H.rng(Math.round(t * 100)); for (let x = 0; x < d; x += 0.022 + r() * 0.02) k.noise(t + x, { dur: 0.03, filter: 'bandpass', f: 1800 + r() * 2200, q: 1.4, gain: 0.16 * g * (0.6 + r() * 0.5), a: 0.002, pan: p }); };

    const I = window.INV; // storyboard time -> video time (sounds land on the frame their event appears)
    const F = (a, b, g, p, m) => fold(I(a), I(b), g, p, m), C = (a, g, p, m) => crease(I(a), g, p, m), T = (a, g, p) => tap(I(a), g, p);
    const duk = (t0, g = 1, p = 0) => { k.play('impact', t0, { gain: 0.9 * g, pan: p }); k.play('thud', t0, { f: 90, gain: 0.6 * g, pan: p }); k.play('slap', t0 + 0.01, { gain: 0.35 * g, pan: p }); const r = H.rng(Math.round(t0 * 10)); for (let i = 0; i < 9; i++) { const x = t0 + 0.12 + r() * 0.6; k.noise(x, { dur: 0.02, filter: 'bandpass', f: 2200 + r() * 2000, q: 1.5, gain: 0.12 * g * (0.5 + r()), a: 0.001, pan: p + (r() - 0.5) * 0.6 }); } };
    const creak = (a, b, g = 1, p = 0) => { const d = b - a; k.noise(a, { dur: d, color: 'brown', filter: 'bandpass', f: [[0, 260], [d, 520]], q: 3, gain: 0.07 * g, a: d * 0.8, pan: p, minor: true }); const r = H.rng(Math.round(a * 10)); for (let x = a; x < b; x += 0.06 + r() * 0.08) k.noise(x, { dur: 0.015, filter: 'bandpass', f: 1400 + r() * 900, q: 2, gain: 0.05 * g * (x - a) / d + 0.02, a: 0.001, pan: p, minor: true }); };
    const warm = (a, b) => k.noise(a, { dur: b - a, color: 'pink', filter: 'lowpass', f: 900, gain: 0.035, a: 0.5, hold: Math.max(0, b - a - 1.0), minor: true });
    // 1 hook
    F(0.15, 0.75, 1.0); for (let x = 0.9; x < 1.25; x += 0.07) T(x, 0.25, 0.1);
    duk(I(1.25), 1.0, 0.1); C(1.3, 0.7, 0.3, false);
    unfold(I(2.55)); C(2.95, 0.8, 0, false);
    // 2 expansion
    glide(I(4.0), I(4.8) - I(4.0)); unfold(I(4.4)); F(4.6, 5.0, 0.9);
    for (let i = 0; i < 6; i++) T(4.9 + i * 0.07 + 0.2, 0.3, -0.4 + i * 0.16);
    k.play('ding', I(5.4), { f: 'G5', gain: 0.14, pan: -0.4 }); warm(I(5.9), I(10.9));
    F(7.0, 7.4, 0.6, -0.4); F(7.05, 7.45, 0.6, 0.4); F(8.2, 8.55, 0.7, 0, false);
    // 3 tight between walls, popping
    glide(I(11.0), I(11.8) - I(11.0)); unfold(I(11.2)); F(11.5, 11.9, 1.0); F(11.55, 11.95, 0.6, -0.5); F(11.6, 12.0, 0.6, 0.5);
    warm(I(12.3), I(16.4)); F(13.0, 13.4, 0.6, -0.4); F(13.05, 13.45, 0.6, 0.4);
    creak(I(13.6), I(14.6), 1.2);
    duk(I(14.6), 1.15, 0.2); C(14.65, 0.8, 0.35, false);
    unfold(I(15.4)); C(15.8, 0.8, 0, false); F(16.6, 16.95, 0.7, 0, false);
    // 4 hollow tile: tap test, water
    glide(I(19.2), I(20.0) - I(19.2)); unfold(I(19.5)); F(19.8, 20.2, 1.0);
    for (let i = 0; i < 3; i++) T(20.1 + i * 0.08 + 0.2, 0.3, -0.4 + i * 0.4);
    F(20.6, 20.95, 0.6, 0.3);
    [21.2, 21.55].forEach((h) => { const x = I(h); k.noise(x, { dur: 0.03, color: 'brown', filter: 'lowpass', f: 1400, gain: 0.5, a: 0.001, pan: -0.3 }); k.tone(x, { f: 620, dur: 0.05, gain: 0.08, pan: -0.3 }); });
    F(21.3, 21.6, 0.5, -0.3, false);
    [22.5, 22.85].forEach((h) => { const x = I(h); k.play('thud', x, { f: 130, gain: 0.5, pan: 0.2 }); k.tone(x, { f: 170, type: 'triangle', dur: 0.28, gain: 0.12, filter: 'lowpass', f2: 500, pan: 0.2 }); k.noise(x, { dur: 0.25, color: 'brown', filter: 'bandpass', f: 220, q: 4, gain: 0.1, a: 0.002, pan: 0.2 }); });
    F(22.6, 22.9, 0.5, 0.3, false);
    unfold(I(24.6));
    for (let i = 0; i < 4; i++) k.tone(I(24.9 + i * 0.45 + 0.4), { f: [[0, 1500], [0.07, 520]], dur: 0.1, gain: 0.08, pan: -0.2 + i * 0.15, minor: true });
    // 5 the right way
    glide(I(27.8), I(28.6) - I(27.8)); unfold(I(28.1)); F(28.4, 28.8, 1.0);
    for (let i = 0; i < 5; i++) T(28.7 + i * 0.07 + 0.2, 0.3, -0.4 + i * 0.2);
    [29.2, 29.9, 30.6].forEach((x, i) => { k.play('pop', I(x) + 0.12, { gain: 0.3, f: 460 + i * 90, pan: -0.5 + i * 0.5, minor: true }); k.tone(I(x) + 0.2, { f: ['C5', 'E5', 'G5'][i], dur: 0.15, gain: 0.07, pan: -0.5 + i * 0.5 }); });
    F(29.9, 30.2, 0.5, 0, false);
    warm(I(30.7), I(31.95));
    ['C5', 'E5', 'G5', 'C6'].forEach((f, i) => k.play('ding', I(31.3) + 0.05 + i * 0.07, { f, gain: 0.22 - i * 0.03, pan: 0.3 }));
    // 6 CTA
    unfold(I(35.8)); C(36.2, 0.8, 0, false);
    F(38.0, 38.4, 1.2, 0, false);
    ['C4', 'G4', 'E5'].forEach((f, i) => k.play('ding', I(38.4) + i * 0.09, { f, gain: 0.32 - i * 0.03, pan: (i - 1) * 0.25 }));
    k.play('sparkle', I(38.6), { gain: 0.5, n: 5 });
  };
})();
