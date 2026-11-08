// Subtitles (burn-in) + sound score, timed to the final VO (VO starts at t = 0.3 s).
(function () {
  const CUES = [
    [0.55, 3.35, 'Lampu merah yang kedip-kedip di meteran listrikmu itu...'],
    [3.66, 4.84, 'lagi *ngitung uangmu.*'],
    [5.78, 9.56, 'Tiap alat punya watt, tanda seberapa *rakus* dia makan listrik.'],
    [10.15, 13.06, 'Lampu 10 watt, rice cooker *400.*'],
    [13.77, 15.87, '*kWh* itu watt dikali jam.'],
    [16.21, 19.18, '1.000 watt nyala sejam, itu *1 kWh.*'],
    [19.96, 23.17, 'Di dalam meteran, ada chip yang ngukur *tegangan dan arus*'],
    [23.17, 26.10, 'ribuan kali tiap detik, lalu dikali jadi watt.'],
    [26.62, 28.99, 'Terus dijumlahkan, jadi *kWh.*'],
    [29.33, 30.67, 'Itu yang motong *tokenmu.*'],
    [31.47, 32.61, 'Nah, kedipan tadi?'],
    [33.12, 34.86, '*1 kedip* = 1 watt-jam.'],
    [35.13, 36.97, '*1.000 kedip* = 1 kWh.'],
    [37.75, 39.83, 'Kedip cepat bukan berarti meteran *rusak.*'],
    [40.09, 42.26, 'Artinya pemakaianmu lagi *besar.*'],
    [42.93, 44.89, 'Meteran lama pakai *piringan berputar.*'],
    [44.89, 46.82, 'Makin kencang, makin *boros.*'],
    [47.21, 49.97, '1 kWh sekitar *Rp1.400-an.*'],
    [50.45, 52.02, 'Jadi, matikan yang nggak dipakai.'],
    [52.53, 54.42, '*Follow* buat fakta rumah berikutnya!'],
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
    // 1 hook: meter stands, every LED blink ticks and a paper coin flips onto the pile
    F(0.05, 0.4, 1.2); F(0.15, 0.7, 0.9, -0.1, false);
    for (let i = 0; i < 8; i++) { const b = 0.6 + i * 0.42; if (b > 3.6) break; tick(I(b), 0.35, 0.2, 2100); const land = I(b + 0.5); k.tone(land, { f: 2600, dur: 0.05, gain: 0.04, pan: 0.35, minor: true }); tap(land, 0.4, 0.35); }
    // 2 appliances pop up one by one; the bulb lights; the fan hums
    glide(I(3.4), I(4.2) - I(3.4)); unfold(I(3.5));
    for (let i = 0; i < 4; i++) { const tt = I(4.0 + i * 0.32 + 0.2); F(4.0 + i * 0.32, 4.0 + i * 0.32 + 0.3, 0.6, -0.45 + i * 0.3); k.play('pop', tt, { gain: 0.3, f: 420 + i * 90, pan: -0.45 + i * 0.3, minor: true }); }
    k.play('ding', I(4.55), { f: 'E6', gain: 0.18, pan: -0.45 });
    k.noise(I(4.6), { dur: I(9.4) - I(4.6), color: 'pink', filter: 'bandpass', f: 320, q: 1.4, gain: 0.035, a: 0.5, hold: I(9.4) - I(4.6) - 1, pan: -0.15, minor: true });
    // 3 sign refolds into the formula
    unfold(I(6.75)); C(7.15, 0.9, 0, false); k.tone(I(7.15), { f: 'G4', type: 'triangle', dur: 0.2, gain: 0.08, filter: 'lowpass', f2: 1200 });
    // 4 inside the meter: door, coils, chip, watt readout
    glide(I(9.4), I(10.2) - I(9.4)); unfold(I(9.7)); F(9.9, 10.3, 0.9);
    slideSheet(I(10.2), I(10.9), 0.7, -0.3);
    F(11.0, 11.35, 0.6, -0.2); F(11.1, 11.45, 0.6, 0.2); F(12.0, 12.35, 0.8, 0, false);
    k.noise(I(12.0), { dur: I(15.6) - I(12.0), color: 'brown', filter: 'bandpass', f: 140, q: 2, gain: 0.05, a: 0.4, hold: 1, minor: true });
    for (let x = 12.9; x < 15.5; x += 0.3) tick(I(x), 0.25, 0.4, 1800);
    // 5 Wh discs stack up
    unfold(I(15.4)); for (let x = 16.1; x < 20.0; x += 0.32) T(x, 0.32, 0.45);
    // 6 the big meter: blink ticks, counter to 1.000, lock
    glide(I(20.3), I(21.1) - I(20.3)); unfold(I(20.6)); F(20.7, 21.1, 1.0);
    { let last = -1, lt = -1; for (let x = 22.0; x < 24.4; x += 0.005) { const v = Math.round(1000 * H.ease.inOut(H.clamp((x - 22.0) / 2.4)) / 40); const tv = I(x); if (v !== last && tv - lt >= 1 / 12) { tick(tv, 0.45, -0.3, 1500); last = v; lt = tv; } } }
    k.play('impact', I(24.4), { gain: 0.8, pan: 0.2 }); k.play('ding', I(24.45), { f: 'E5', gain: 0.4, pan: 0.2 }); F(24.4, 24.75, 0.7, 0.3, false);
    // 7 wrong guess stamped, refold, stopwatch
    unfold(I(26.8));
    { const tX = I(27.9 + 0.1); k.play('slap', tX, { gain: 0.45 }); k.play('thud', tX, { f: 120, gain: 0.4 }); k.tone(tX + 0.02, { f: 'D3', type: 'triangle', dur: 0.16, gain: 0.16, filter: 'lowpass', f2: 700 }); k.tone(tX + 0.18, { f: 'A2', type: 'triangle', dur: 0.3, gain: 0.18, filter: 'lowpass', f2: 600 }); }
    unfold(I(29.0)); C(29.4, 0.8, 0, false);
    F(29.5, 29.9, 0.7, 0.35); for (let x = 30.0; x < 32.3; x += 0.5) tick(I(x), 0.3, 0.35, 2400);
    F(30.2, 30.55, 0.6, -0.3);
    // 8 old meter, spinning disc
    glide(I(32.4), I(33.2) - I(32.4)); unfold(I(32.6)); F(32.8, 33.2, 0.9);
    k.noise(I(33.3), { dur: I(36.9) - I(33.3), color: 'pink', filter: 'bandpass', f: [[0, 500], [I(36.9) - I(33.3), 900]], q: 1.2, gain: 0.04, a: 0.6, hold: 1.5, minor: true });
    // 9 coins + tariff card
    glide(I(37.1), I(37.9) - I(37.1)); unfold(I(37.4));
    for (let i = 0; i < 4; i++) { const tt = I(37.7 + i * 0.12); tap(tt, 0.4, -0.2); k.tone(tt, { f: 2400 + i * 200, dur: 0.05, gain: 0.04, minor: true }); }
    F(37.9, 38.25, 0.8, 0.1);
    // 10 CTA
    F(40.4, 40.8, 1.2, 0, false);
    ['C4', 'G4', 'E5'].forEach((f, i) => k.play('ding', I(40.8) + i * 0.09, { f, gain: 0.32 - i * 0.03, pan: (i - 1) * 0.25 }));
    k.play('sparkle', I(41.0), { gain: 0.5, n: 5 });
  };
})();
