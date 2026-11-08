// Subtitles (burn-in) + sound score, timed to the final VO (VO starts at t = 0.3 s).
(function () {
  const CUES = [
    [0.30, 2.89, 'Tembok rumahmu itu dilem pakai batu yang dibakar.'],
    [3.20, 5.70, 'Batu kapur dan tanah liat dibakar di tungku…'],
    [6.00, 7.00, 'jadi butiran klinker.'],
    [7.22, 9.00, 'Digiling bareng sedikit gipsum,'],
    [9.22, 10.07, 'biar nggak cepat keras.'],
    [10.37, 11.52, 'Tapi semen bukan beton,'],
    [11.77, 12.64, 'cuma *lemnya*.'],
    [12.95, 14.65, 'Tambah air, pasir,'],
    [14.82, 16.45, 'kerikil, baru jadi beton.'],
    [16.78, 18.00, 'Semen mengeras karena kering?'],
    [18.22, 18.83, '*Salah!*'],
    [19.11, 20.43, 'Ia bereaksi dengan air,'],
    [20.73, 22.78, 'membentuk kristal pengikat.'],
    [22.97, 23.95, 'Makanya beton harus disiram.'],
    [24.29, 26.41, 'Kuatnya diuji di umur *28 hari*.'],
    [26.71, 28.16, 'Mundur 1.900 tahun…'],
    [28.47, 30.78, 'Romawi sudah pakai kapur dan abu gunung api.'],
    [31.08, 32.98, 'Lompat ke tahun *1824*:'],
    [33.16, 34.98, 'semen modern lahir di Inggris.'],
    [35.37, 36.65, 'Tahun *1910*…'],
    [37.08, 39.50, 'pabrik semen pertama Asia Tenggara berdiri di *Padang*.'],
    [39.81, 41.50, 'Semen itu lem batu buatan.'],
    [41.96, 43.27, 'Follow buat fakta rumah berikutnya!'],
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
    // 1 hook: kiln + piles fold up, fire crackles under everything until the mill station
    F(0.05, 0.4, 1.2); F(0.15, 0.15 + POP * 0.6, 1.0, -0.1, false); T(0.35 + POP * 0.5, 0.5, -0.4); T(0.55 + POP * 0.5, 0.5, -0.3);
    { const r = H.rng(3); for (let x = I(0.9); x < I(13.0); x += 0.07 + r() * 0.09) k.noise(x, { dur: 0.03, filter: 'bandpass', f: 1800 + r() * 2200, q: 1.2, gain: 0.05 * (0.5 + r()), a: 0.002, pan: 0.35, minor: true }); }
    k.noise(I(0.9), { dur: I(13) - I(0.9), color: 'brown', filter: 'lowpass', f: 260, gain: 0.07, a: 0.4, hold: I(13) - I(0.9) - 0.9, minor: true });
    // 2 stones hop into the kiln, the temperature card counts up and locks
    unfold(I(3.2)); F(3.5, 3.85, 0.8);
    for (let i = 0; i < 5; i++) T(4.2 + i * 0.38 + 0.55, 0.45, -0.2);
    F(4.3, 4.65, 0.8, -0.1);
    { let last = -1, lt = -1; for (let x = 4.62; x < 7.0; x += 0.01) { const v = Math.round(1450 * H.ease.out(H.clamp((x - 4.6) / 2.4)) / 25); const tv = I(x); if (v !== last && tv - lt >= 1 / 12) { tick(tv, 0.55, -0.1, 1500); last = v; lt = tv; } } }
    C(7.0, 1.1, -0.1, false); k.tone(I(7.0), { f: 'G3', type: 'triangle', dur: 0.25, gain: 0.12, filter: 'lowpass', f2: 900 });
    for (let i = 0; i < 9; i++) T(6.6 + i * 0.22 + 0.4, 0.3, 0.4);
    // 3 mill + gypsum + sack
    glide(I(9.0), I(9.8) - I(9.0)); unfold(I(8.9)); F(9.0, 9.35, 0.8); F(9.4, 9.4 + POP * 0.5, 0.8, 0.1);
    k.noise(I(10.0), { dur: I(12.6) - I(10.0), color: 'brown', filter: 'bandpass', f: 190, q: 1.2, gain: 0.16, a: 0.3, hold: 0.8, minor: true });
    F(10.1, 10.45, 0.5, -0.3); slideSheet(I(10.2), I(10.9), 0.8, -0.2);
    k.noise(I(10.9), { dur: I(12.3) - I(10.9), color: 'pink', filter: 'highpass', f: 2500, gain: 0.05, a: 0.3, minor: true });
    F(12.1, 12.1 + POP * 0.5, 1.0, 0.2, false);
    // 4 ingredients pop, slide together, the block lands
    glide(I(13.4), I(14.2) - I(13.4)); unfold(I(13.6)); F(13.9, 14.25, 0.8);
    ['C5', 'E5', 'G5', 'C6'].forEach((n, i) => { const tt = I(14.2 + i * 0.35 + 0.18); k.play('pop', tt, { gain: 0.35, f: 420 + i * 90, pan: -0.45 + i * 0.3, minor: true }); if (i === 1) k.tone(tt + 0.03, { f: [[0, 1500], [0.08, 600]], dur: 0.1, gain: 0.08, minor: true }); });
    slideSheet(I(16.4), I(17.1), 0.9, 0); k.play('thud', I(17.0 + POP * 0.55), { f: 110, gain: 0.45 });
    // 5 water drops, the wrong guess, the crystals
    glide(I(19.9), I(20.7) - I(19.9)); unfold(I(19.95)); F(20.3, 20.65, 0.8);
    for (let i = 0; i < 5; i++) T(20.4 + i * 0.08 + POP * 0.45, 0.35, -0.3 + i * 0.15);
    for (let i = 0; i < 4; i++) k.tone(I(21.0 + i * 0.18 + 0.5), { f: [[0, 1600], [0.07, 520]], dur: 0.11, gain: 0.1, pan: -0.3 + i * 0.2, minor: true });
    { const tX = I(22.3 + POP * 0.3); k.play('slap', tX, { gain: 0.55 }); k.play('thud', tX, { f: 120, gain: 0.5 }); k.tone(tX + 0.02, { f: 'D3', type: 'triangle', dur: 0.16, gain: 0.2, filter: 'lowpass', f2: 700 }); k.tone(tX + 0.18, { f: 'A2', type: 'triangle', dur: 0.32, gain: 0.22, filter: 'lowpass', f2: 600 }); }
    k.noise(I(23.6), { dur: 0.32, color: 'pink', filter: 'bandpass', f: [[0, 420], [0.16, 900], [0.32, 420]], q: 0.7, gain: 0.16, a: 0.14 }); C(23.95, 0.8, 0, false);
    k.play('paper', I(24.3), { dur: I(26.5) - I(24.3), gain: 0.22, pan: 0.1, minor: true });
    // 6 strength columns, the 28-day card (biggest hit)
    glide(I(27.0), I(27.7) - I(27.0)); unfold(I(26.95)); F(27.2, 27.55, 0.8);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) k.noise(I(27.9 + i * 0.45) + j * 0.045, { dur: 0.03, filter: 'bandpass', f: 1100 + j * 90, q: 1.3, gain: 0.13 * (1 - j * 0.15), a: 0.002, pan: 0.3, minor: true });
    F(29.4, 29.6, 0.8, -0.3); k.play('impact', I(29.6), { gain: 1.0, pan: -0.2 }); k.play('ding', I(29.6), { f: 'E5', gain: 0.45, pan: -0.2 });
    // 7-9 TIME JUMP: whooshes, the year card spinning (<=12 ticks/s), a landing hit at each era
    [[31.0, 31.95, 2026, 125, 1.0], [33.75, 34.35, 125, 1824, 0.75], [35.55, 36.05, 1824, 1910, 0.85]].forEach(([a, b, y0, y1, g]) => {
      const ta = I(a), tb = I(b);
      k.play('whoosh', ta, { dur: tb - ta + 0.1, top: 3400, gain: 0.7 * g });
      let last = -1, lt = -1;
      for (let x = a; x < b; x += 0.004) { const v = Math.round(H.lerp(y0, y1, H.ease.inOut(H.clamp((x - a) / (b - a))))); const tv = I(x); if (v !== last && tv - lt >= 1 / 12) { tick(tv, 0.5, 0.35, 1700); last = v; lt = tv; } }
      k.play('thud', tb, { f: 95, gain: 0.55 * g, pan: 0.3 }); C(b, 0.9 * g, 0.35, false);
    });
    F(31.0, 31.35, 0.7); F(31.55, 31.55 + POP * 0.55, 0.9, 0, false);
    F(33.7, 34.05, 0.6); F(34.0, 34.0 + POP * 0.55, 0.9, 0, false);
    F(35.55, 35.9, 0.6); F(35.85, 35.85 + POP * 0.55, 1.0, 0, false);
    k.play('sparkle', I(36.4), { gain: 0.55, n: 5 }); k.play('ding', I(36.45), { f: 'G5', gain: 0.35 });
    // 10 takeaway, CTA
    unfold(I(39.9)); F(40.1, 40.45, 1.2, 0, false);
    ['C4', 'G4', 'E5'].forEach((f, i) => k.play('ding', I(40.5) + i * 0.09, { f, gain: 0.34 - i * 0.03, pan: (i - 1) * 0.25 }));
    F(41.45, 41.8, 1.1, 0, false); k.play('sparkle', I(41.9), { gain: 0.55, n: 5 });
  };
})();
