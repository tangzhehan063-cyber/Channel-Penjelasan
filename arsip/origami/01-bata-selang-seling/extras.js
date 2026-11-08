// Subtitles (burn-in) + sound score, timed to the final VO (VO starts at t = 0.3 s).
(function () {
  const CUES = [
    [0.30, 3.79, 'Kenapa tukang nggak pernah nyusun bata lurus-lurus?'],
    [3.95, 5.20, 'Coba tumpuk lurus.'],
    [5.30, 7.25, 'Sambungannya jadi satu garis,'],
    [7.30, 9.05, 'dari atas sampai bawah.'],
    [9.20, 10.10, 'Kasih beban…'],
    [10.20, 11.95, 'yang nahan cuma *satu kolom*.'],
    [12.20, 12.95, 'Kalau retak,'],
    [13.00, 14.65, 'langsung ikut garis itu.'],
    [14.90, 15.75, 'Kalau selang-seling,'],
    [15.85, 18.55, 'tiap bata ditopang dua bata di bawahnya.'],
    [18.70, 20.05, 'Bebannya *menyebar* ke kanan-kiri,'],
    [20.15, 21.05, 'kayak piramida.'],
    [21.25, 22.10, 'Menurut uji,'],
    [22.30, 24.95, 'didorong angin dari depan…'],
    [25.05, 26.65, 'tembok tumpuk lurus cuma sekitar'],
    [26.75, 30.10, '*30 persen* sekuat tembok selang-seling.'],
    [30.30, 32.25, 'Retaknya nggak bisa lari lurus.'],
    [32.35, 33.90, 'Harus belok di tiap bata,'],
    [34.00, 35.35, 'jadi susah merambat.'],
    [35.55, 38.85, 'Jadi, selang-seling itu bukan cuma biar rapi…'],
    [39.00, 40.15, 'biar bebannya *dibagi*.'],
    [40.30, 42.70, 'Follow, buat fakta rumah berikutnya!'],
  ];
  window.CUES = CUES;

  // paper subtitle slip: cream strip, ink text, key words in red; lands inside the safe zone (y < 1536)
  const FS = 54, LH = 68, MAXW = 880, BASE = 1468;
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

    // 1 hook: walls fold up course by course (both walls together), title card
    fold(0.05, 0.4, 1.3, 0, false);
    for (let r = 0; r < 8; r++) tap(0.25 + r * 0.13 + POP * 0.4, 0.55, (r % 2 ? 0.2 : -0.2));
    // 2 stack wall: camera glide, card refold, seams traced
    glide(3.8, 0.8); unfold(3.75); fold(4.0, 4.35, 0.9, -0.1);
    k.play('tape', 5.6, { dur: 3.2, gain: 0.35, pan: -0.1, minor: true });
    // 3 weight lands, column lights, crack (the wrong moment)
    unfold(8.85); fold(9.0, 9.35, 0.8, -0.1);
    k.noise(9.25, { dur: 0.6, color: 'pink', filter: 'bandpass', f: [[0, 400], [0.6, 1500]], q: 0.7, gain: 0.08, a: 0.5, minor: true });
    k.play('slap', 9.85, { gain: 0.5 }); k.play('thud', 9.85, { f: 120, gain: 0.5 });
    for (let i = 0; i < 8; i++) tick(10.3 + i * 0.16, 0.55, 0, 1300 - i * 60);
    tear(12.35, 1.7, 0.75, 0.1);
    k.tone(12.47, { f: 'D3', type: 'triangle', dur: 0.16, gain: 0.18, filter: 'lowpass', f2: 700 });
    k.tone(12.63, { f: 'A2', type: 'triangle', dur: 0.32, gain: 0.2, filter: 'lowpass', f2: 600 });
    // 4 running bond: same weight, load fans out, arrows
    glide(14.7, 0.8); unfold(14.7); fold(15.0, 15.35, 0.8, 0.1);
    k.play('slap', 16.5, { gain: 0.45, pan: 0.1 }); k.play('thud', 16.5, { f: 120, gain: 0.45, pan: 0.1 });
    for (let i = 0; i < 8; i++) tick(16.6 + i * 0.2, 0.5, 0.1, 1100 + i * 110);
    slideSheet(18.6, 19.9, 0.9, 0.1);
    // 5 wide: wind arrows, columns split, the key number (biggest hit), 100% card
    glide(21.1, 0.8); unfold(20.95); fold(21.3, 21.65, 1.0);
    slideSheet(22.3, 23.1, 1.0, 0);
    k.noise(22.9, { dur: 1.1, color: 'brown', filter: 'bandpass', f: [[0, 260], [1.1, 520]], q: 1.4, gain: 0.18, a: 0.3, pan: -0.3 });
    for (const x of [23.15, 23.4, 23.7]) tear(x, 0.08, 0.6, -0.35);
    fold(25.1, 25.45, 0.9, -0.3);
    k.play('impact', 26.85, { gain: 1.05, pan: -0.25 });
    k.play('ding', 26.85, { f: 'E5', gain: 0.5, pan: -0.2 });
    fold(28.2, 28.55, 0.8, 0.3);
    // 6 crack must step brick by brick, then stops: tick
    unfold(29.9); glide(30.1, 0.8); fold(30.5, 30.85, 0.8, 0.1);
    for (let i = 0; i < 7; i++) tear(32.35 + i * 0.214, 0.09, 0.55, 0.1);
    const tV = 34.1 + POP * 0.35; crease(tV, 1.1, 0.15, false); k.play('success', tV, { f: 'G5', gain: 0.45, pan: 0.15 });
    // 7 takeaway
    unfold(35.2); glide(35.3, 0.8); fold(35.6, 35.95, 1.0);
    fold(38.95, 39.3, 1.2, 0, false);
    ['C4', 'G4', 'E5'].forEach((f, i) => k.play('ding', 39.35 + i * 0.09, { f, gain: 0.36 - i * 0.03, pan: (i - 1) * 0.25 }));
    // 8 CTA
    fold(40.3, 40.65, 1.1, 0, false);
    k.play('sparkle', 40.8, { gain: 0.6, n: 5 });
  };
})();
