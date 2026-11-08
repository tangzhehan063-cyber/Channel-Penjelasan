    // ================= PROFILE PICTURE: paper house + glowing idea bulb =================
    const MODE = (window.location.hash || '#b').slice(1);
    const ROOFC = [214, 92, 70], WALL = [246, 240, 226], DOORC = [64, 140, 128];
    // teal paper badge behind
    disc([0, 1.12, -0.9], 1.62, 0.06, MODE === 'b' ? [236, 186, 72] : [56, 146, 132], [0, 0, 1], 0, 72);
    disc([0, 1.12, -0.86], 1.5, 0.02, MODE === 'b' ? [244, 202, 96] : [72, 160, 146], [0, 0, 1], 0, 72);
    // ground slab
    box(-0.95, 0, -0.55, 0.95, 0.08, 0.6, [214, 206, 188], (p) => p);
    // walls with door + window printed on the front
    const wallPaint = (c, w, h) => {
      c.fillStyle = 'rgba(0,0,0,0.04)'; c.fillRect(0, h * 0.92, w, h * 0.08);
      // door
      c.fillStyle = '#3f8c80'; c.beginPath(); c.roundRect(w * 0.16, h * 0.38, w * 0.22, h * 0.62, [w * 0.11, w * 0.11, 0, 0]); c.fill();
      c.fillStyle = '#f2c94c'; c.beginPath(); c.arc(w * 0.33, h * 0.7, w * 0.018, 0, TAU); c.fill();
      // window with warm light
      const g = c.createRadialGradient(w * 0.7, h * 0.5, 2, w * 0.7, h * 0.5, w * 0.2); g.addColorStop(0, '#fff3c0'); g.addColorStop(1, '#f6c450');
      c.fillStyle = g; c.fillRect(w * 0.54, h * 0.32, w * 0.32, h * 0.34);
      c.strokeStyle = '#7a5a3a'; c.lineWidth = w * 0.022; c.strokeRect(w * 0.54, h * 0.32, w * 0.32, h * 0.34);
      c.beginPath(); c.moveTo(w * 0.7, h * 0.32); c.lineTo(w * 0.7, h * 0.66); c.moveTo(w * 0.54, h * 0.49); c.lineTo(w * 0.86, h * 0.49); c.stroke();
    };
    box(-0.62, 0.08, -0.38, 0.62, 0.95, 0.38, WALL, (p) => p, wallPaint);
    // gable roof: front + back gable triangles and two roof planes with overhang
    const ry = 1.62, ey = 0.9, ex = 0.8, zf = 0.5, zb = -0.5;
    face([[-0.62, 0.95, 0.38], [0.62, 0.95, 0.38], [0, ry - 0.06, 0.38]], WALL.map((v) => v * 0.98));
    face([[-0.62, 0.95, -0.38], [0.62, 0.95, -0.38], [0, ry - 0.06, -0.38]], WALL.map((v) => v * 0.9));
    face([[-ex, ey, zf], [0, ry, zf], [0, ry, zb], [-ex, ey, zb]], ROOFC);
    face([[0, ry, zf], [ex, ey, zf], [ex, ey, zb], [0, ry, zb]], ROOFC.map((v) => v * 0.93));
    // round attic window
    disc([0, 1.22, 0.385], 0.1, 0.01, [246, 196, 80], [0, 0, 1], 0, 18);
    // chimney
    box(0.36, 1.2, -0.2, 0.52, 1.62, -0.04, [180, 98, 70], (p) => p);
    // idea bulb floating above, with rays
    const by = 1.78, bx = -0.58, sc = 1.15, th = 0.0;
    const O = BULB_O, [x0, y0, x1, y1] = O.bb;
    const W3 = (px, py, dz = 0) => [bx + px * sc, by + py * sc, 0.3 + dz];
    face(O.P.map(([px, py]) => W3(px, py, -0.03)), [200, 180, 120], { bias: 0.05 });
    face(O.P.map(([px, py]) => W3(px, py)), [250, 236, 190], { map: [W3(x0, y1), W3(x1, y1), W3(x0, y0)], paint: (c, w, h) => paintBulb(true)(c, w, h, (px, py) => [(px - x0) / (x1 - x0) * w, (y1 - py) / (y1 - y0) * h], O) });
    for (let r = 0; r < 7; r++) { const an = Math.PI * (0.05 + r / 6 * 0.9), c0 = [bx + Math.cos(an) * 0.3, by + 0.38 + Math.sin(an) * 0.3, 0.32], d = [Math.cos(an), Math.sin(an), 0], L = 0.1; face([c0, add(c0, mul(d, L)), add(add(c0, mul(d, L)), [-d[1] * 0.016, d[0] * 0.016, 0]), add(c0, [-d[1] * 0.016, d[0] * 0.016, 0])], [58, 58, 62], { bias: -0.2 }); }
    // little paper tree on the right
    tube([0.82, 0.08, 0.25], [0.82, 0.42, 0.25], 0.035, 6, [140, 100, 70]);
    rock([0.82, 0.38, 0.25], 0.2, 4, [96, 170, 110], 1, 1.1);
