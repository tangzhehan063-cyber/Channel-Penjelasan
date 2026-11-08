    // ================= SCENE: kWh meter =================
    const S = 0.115;
    const sign = (x, a, b, lines, w = 1.45, z = -1.0, sc = 1) => tent(x, z, w, 3.35, 0, win(a, b), printer(lines.map(([tx, f, y, c, fo]) => [tx, f * sc, y, c, fo])));
    const GREY = '#6a6a70';
    // LED state: blinks with a given period, short flash
    const ledOn = (period, t0 = 0) => ((t - t0) % period + period) % period < Math.min(0.12, period * 0.4);
    // printed face of a prepaid meter
    const meterFace = (lcd, led, imp = '1000 imp/kWh') => (c, w, h) => {
      c.fillStyle = 'rgba(0,0,0,0.05)'; c.fillRect(w * 0.06, h * 0.05, w * 0.88, h * 0.9);
      c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = INK; c.font = SG(w * 0.075); c.fillText('kWh METER', w * 0.12, h * 0.12);
      c.font = SM(w * 0.045); c.fillStyle = GREY; c.fillText('PRABAYAR', w * 0.12, h * 0.19);
      // LED
      const lx = w * 0.8, ly = h * 0.14, r = w * 0.055;
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

    // ---- station 1 (hook): the prepaid meter with its red LED blinking ----
    {
      const mu = pop(0.15, 0.55) * (1 - seg(3.6, 3.95));
      if (mu > 0) {
        const k = Math.min(1, mu), hw = 0.5, hh = 1.4 * k;
        const token = (45.67 - Math.max(0, t - 0.6) * 0.01).toFixed(2);
        box(XM - hw, 0, -0.18, XM + hw, hh, 0.18, METERC, (p) => p, meterFace(token, ledOn(0.42, 0.6) && t > 0.6));
        // cable going up out of frame
        tube([XM, hh, 0], [XM, hh + 1.6, 0], 0.035, 6, CABLE);
      }
      sign(XM, 0.05, 3.7, [['Lampu kedip ini lagi', S * 0.62, 0.11], ['NGITUNG UANGMU', S * 0.95, 0.21, REDH], ['meteran listrik prabayar', S * 0.55, 0.3, GREY, 'mono']], 1.45, -0.8);
    }

    // ---- station 2: appliances with their watt tags; kWh = watt x jam ----
    {
      const A = [['lampu LED', 10, -1.15], ['kipas', 45, -0.4], ['setrika', 350, 0.4], ['rice cooker', 400, 1.15]];
      A.forEach(([nm, wt, dx], i) => {
        const st = 4.0 + i * 0.32, u = pop(st, 0.45) * (1 - seg(9.4, 9.8)); if (u <= 0) return;
        const k = Math.min(1, u), x = XA + dx, z = 0.15;
        if (i === 0) { tube([x, 0, z], [x, 0.2 * k, z], 0.07, 8, METERC); rock([x, 0.2 * k - 0.02, z], 0.17 * k, 3, t > 4.5 ? BULB : CREAM, 1, 1.15); }
        if (i === 1) { tube([x, 0, z], [x, 0.03, z], 0.18, 10, FANC); tube([x, 0.03, z], [x, 0.62 * k, z], 0.03, 6, FANC); const hub = [x, 0.62 * k, z + 0.04]; for (let b = 0; b < 3; b++) { const an = t * 9 + (b * TAU) / 3; face([hub, add(hub, [Math.cos(an) * 0.28 * k, Math.sin(an) * 0.28 * k, 0.02]), add(hub, [Math.cos(an + 0.5) * 0.24 * k, Math.sin(an + 0.5) * 0.24 * k, 0.02])], TEAL); } }
        if (i === 2) { const P = (px, py, pz) => [x + px * k, py * k, z + pz]; face([P(-0.24, 0.02, 0.12), P(0.24, 0.02, 0.12), P(0.14, 0.14, 0.1), P(-0.24, 0.14, 0.1)], STEEL2); face([P(-0.24, 0.14, 0.1), P(0.14, 0.14, 0.1), P(0.14, 0.14, -0.1), P(-0.24, 0.14, -0.1)], RED); face([P(0.24, 0.02, 0.12), P(0.24, 0.02, -0.12), P(0.14, 0.14, -0.1), P(0.14, 0.14, 0.1)], STEEL2.map((v) => v * 0.9)); tube(P(-0.18, 0.14, 0), P(-0.18, 0.3, 0), 0.025, 6, INKC); tube(P(-0.18, 0.3, 0), P(0.08, 0.3, 0), 0.03, 6, INKC); }
        if (i === 3) { tube([x, 0, z], [x, 0.32 * k, z], 0.22 * k, 12, CREAM, 0, null, CREAM); rock([x, 0.3 * k, z], 0.2 * k, 7, STEEL2, 1, 0.45); }
        lab(x, 0.95, 0.32, 0.26, u, wt + ' W', 0.62, i > 1 ? REDH : INK, 0, CREAM, 'mono');
      });
      sign(XA, 3.5, 6.95, [['Watt = seberapa', S * 0.62, 0.11], ['RAKUS ALATNYA', S * 0.95, 0.21, REDH], ['lihat label di tiap alat', S * 0.55, 0.3, GREY, 'mono']]);
      sign(XA, 6.75, 9.8, [['kWh =', S * 0.62, 0.11], ['WATT × JAM', S * 1.05, 0.21, REDH], ['1.000 W nyala 1 jam = 1 kWh', S * 0.55, 0.3, GREY, 'mono']]);
    }

    // ---- station 3: inside the meter: voltage + current sensed, multiplied by a chip, summed into Wh ----
    {
      const ou = pop(9.9, 0.5) * (1 - seg(20.2, 20.6));
      if (ou > 0) {
        const k = Math.min(1, ou), x0 = XI - 0.85, x1 = XI + 0.85, hh = 1.45 * k, zb = -0.25, zf = 0.15;
        box(x0, 0, zb - 0.04, x1, hh, zb, METERC.map((v) => v * 0.92), (p) => p); // back plate
        box(x0 - 0.04, 0, zb, x0, hh, zf, METERC, (p) => p); box(x1, 0, zb, x1 + 0.04, hh, zf, METERC, (p) => p);
        box(x0 - 0.04, hh, zb, x1 + 0.04, hh + 0.04, zf, METERC, (p) => p);
        // front flap folded down onto the table
        const fa = seg(10.2, 10.8) * Math.PI / 2;
        const hinge = (yy) => [0, Math.cos(fa) * yy, zf + Math.sin(fa) * yy];
        const h1 = hinge(hh), Q = (xx, v) => [xx, v[1] + 0.003, v[2]];
        face([Q(x0, hinge(0)), Q(x1, hinge(0)), Q(x1, h1), Q(x0, h1)], METERC, { map: [Q(x0, h1), Q(x1, h1), Q(x0, hinge(0))], paint: meterFace('45.12', false) });
        // two sensors: voltage coil (left) and current coil (right)
        const cu = pop(11.0, 0.45);
        if (cu > 0) {
          const c2 = Math.min(1, cu);
          [[-0.5, 'V'], [0.5, 'A']].forEach(([dx, l]) => { tube([XI + dx - 0.2 * c2, 0.32, -0.05], [XI + dx + 0.2 * c2, 0.32, -0.05], 0.13 * c2, 10, COPPER, t * 0.5, COPPER.map((v) => v * 0.8), COPPER.map((v) => v * 0.8)); });
          lab(XI - 0.5, 0.75, 0.3, 0.2, cu, 'VOLT', 0.55, INK, 0, CREAM, 'mono'); lab(XI + 0.5, 0.75, 0.3, 0.2, cu, 'AMPERE', 0.45, INK, 0, CREAM, 'mono');
        }
        // waves rising from both sensors into the chip
        const wu = H.clamp((t - 11.6) / 0.5) * (1 - seg(19.8, 20.2));
        if (wu > 0) [-0.5, 0.5].forEach((dx, j) => { const pts = []; for (let i = 0; i <= 14; i++) { const f = i / 14; pts.push([XI + dx * (1 - f * 0.85) + 0.07 * Math.sin(f * 14 - t * 9 + j), 0.48 + f * 0.5, 0.02]); } polyStrip(pts, 14 * wu, 0.016, j ? MUS : TEAL); });
        const chu = pop(12.0, 0.45);
        if (chu > 0) box(XI - 0.2, 0.98, -0.12, XI + 0.2, 0.98 + 0.26 * Math.min(1, chu), 0.05, CHIP, (p) => p, printer([['×', 0.8, 0.5, '#f6f2e9']]));
        // watt readout card on top of the chip output
        lab(XI, 1.2, 0.5, 0.3, win(12.8, 20.2), Math.round(400 + 360 * (0.5 + 0.5 * Math.sin(t * 2.3))) + ' W', 0.6, REDH, 0, CREAM, 'mono');
      }
      sign(XI, 9.7, 15.6, [['Di dalamnya, chip ngukur', S * 0.62, 0.11], ['VOLT × AMPERE', S * 0.95, 0.21, REDH], ['ribuan kali tiap detik', S * 0.55, 0.3, GREY, 'mono']], 1.45, -0.9);
      // Wh chips drop onto a stack: the energy adds up
      const n = Math.max(0, Math.min(14, Math.floor((t - 15.9) / 0.26)));
      const su = 1 - seg(20.2, 20.6);
      if (t > 15.9 && su > 0) {
        for (let i = 0; i <= n; i++) {
          const u = H.clamp((t - 15.9 - i * 0.26) / 0.25); if (u <= 0) continue;
          const y = 0.03 + i * 0.065 + (1 - H.ease.in(u)) * 0.9;
          disc([XI + 1.35, y, 0.45], 0.2, 0.055, i % 2 ? GOLD : GOLD.map((v) => v * 0.93));
        }
        lab(XI + 1.35, 1.12, 0.36, 0.24, win(15.9, 20.3), (n * 0.001).toFixed(3).replace('.', ',') + ' kWh', 0.48, INK, 0, CREAM, 'mono');
      }
      sign(XI, 15.4, 20.6, [['Lalu dijumlahkan terus', S * 0.62, 0.11], ['JADI kWh', S * 1.15, 0.21, REDH], ['token berkurang sedikit demi sedikit', S * 0.5, 0.3, GREY, 'mono']], 1.45, -0.9);
    }

    // ---- station 4: the LED: 1 blink = 1 Wh; counting to 1,000 ----
    {
      const mu = pop(20.7, 0.5) * (1 - seg(32.4, 32.8));
      if (mu > 0) {
        const k = Math.min(1, mu), hw = 0.62, hh = 1.7 * k;
        const blinkP = t < 27.2 ? 0.36 : 0.18;
        box(XL - hw, 0, -0.2, XL + hw, hh, 0.2, METERC, (p) => p, meterFace('44.98', ledOn(blinkP, 21.0) && t > 21.0));
      }
      // blink counter card refolds to the key number
      const cu = win(21.6, 26.6);
      const cnt = Math.round(1000 * H.ease.inOut(H.clamp((t - 22.0) / 2.4)));
      tent(XL - 0.95, 0.95, 0.5, 0.48, 0.08, cu, printer([['kedipan', 0.18, 0.2, GREY, 'mono'], [cnt.toLocaleString('id-ID'), 0.4, 0.6, t > 24.4 ? REDH : INK]]));
      tent(XL + 0.95, 0.95, 0.5, 0.48, -0.08, win(24.4, 26.6), printer([['=', 0.24, 0.2, GREY, 'mono'], ['1 kWh', 0.36, 0.6, REDH]]));
      sign(XL, 20.6, 27.0, [['1 kedip =', S * 0.62, 0.11], ['1 WATT-JAM', S * 1.05, 0.21, REDH], ['1000 imp/kWh: 1.000 kedip = 1 kWh', S * 0.48, 0.3, GREY, 'mono']], 1.45, -0.9);
      // wrong guess: fast blinking = broken meter?
      sign(XL, 26.8, 29.25, [['Kedip cepat =', S * 0.62, 0.11], ['METERAN RUSAK?', S * 0.9, 0.21, REDH]], 1.45, -0.9);
      if (t > 27.9 && t < 29.1) cross2([XL + 0.1, 2.38, -0.52], 0.32 * pop(27.9, 0.3), RED);
      sign(XL, 29.0, 32.8, [['Bukan! Pemakaian lagi', S * 0.62, 0.11], ['BESAR', S * 1.3, 0.21, TEALH], ['makin rakus, makin cepat kedip', S * 0.5, 0.3, GREY, 'mono']], 1.45, -0.9);
      // stopwatch + formula
      const su = pop(29.5, 0.5) * (1 - seg(32.4, 32.8));
      if (su > 0) {
        const k = Math.min(1, su), c0 = [XL + 1.0, 0.42, 0.45];
        disc(c0, 0.3 * k, 0.07, CREAM, [0, 0, 1], 0, 20);
        tube(add(c0, [0, 0.3 * k, 0]), add(c0, [0, 0.38 * k, 0]), 0.04, 6, INKC);
        const an = Math.PI / 2 - H.clamp((t - 29.8) / 1.6) * 3.6 / 60 * TAU * 8;
        strip(add(c0, [0, 0, 0.05]), add(c0, [Math.cos(an) * 0.24 * k, Math.sin(an) * 0.24 * k, 0.05]), 0.012, RED);
      }
      tent(XL - 0.75, 0.95, 0.72, 0.5, 0.06, win(30.2, 32.7), printer([['watt ≈', 0.17, 0.18, GREY, 'mono'], ['3.600 ÷ detik', 0.3, 0.52, INK], ['jarak antar kedip', 0.15, 0.85, GREY, 'mono']]));
    }

    // ---- station 5: the old analog meter with its spinning aluminium disc ----
    {
      const mu = pop(32.8, 0.55) * (1 - seg(36.9, 37.3));
      if (mu > 0) {
        const k = Math.min(1, mu), hw = 0.55, hh = 1.35 * k;
        box(XO - hw, 0, -0.22, XO + hw, hh, 0.12, OLDM, (p) => p, (c, w, h) => {
          c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.roundRect(w * 0.12, h * 0.12, w * 0.76, h * 0.55, w * 0.06); c.fill();
          c.fillStyle = INK; c.font = SM(w * 0.08); c.textAlign = 'center'; c.textBaseline = 'middle';
          c.fillRect(w * 0.22, h * 0.2, w * 0.56, h * 0.11); c.fillStyle = '#f2efe4'; c.fillText('0 4 7 2 9', w * 0.5, h * 0.255);
          c.fillStyle = GREY; c.font = SM(w * 0.06); c.fillText('900 putaran/kWh', w * 0.5, h * 0.8);
        });
        // disc pokes out through the window slot, spinning with a black mark
        disc([XO, 0.62 * k, 0.12], 0.36 * k, 0.03, ALU, [0, 1, 0], t * 6, 18, INKC.map((v) => v + 10));
      }
      sign(XO, 32.6, 37.3, [['Meteran lama?', S * 0.62, 0.11], ['PIRINGAN BERPUTAR', S * 0.85, 0.21, REDH], ['makin cepat = makin boros', S * 0.55, 0.3, GREY, 'mono']], 1.45, -0.9);
    }

    // ---- station 6: what 1 kWh costs, then CTA ----
    {
      const cu = pop(37.6, 0.5) * (1 - seg(40.2, 40.6));
      if (cu > 0) for (let i = 0; i < 7; i++) disc([XP - 0.6 + (i % 3) * 0.08, 0.03 + i * 0.06, 0.2], 0.2 * Math.min(1, cu), 0.05, i % 2 ? GOLD : GOLD.map((v) => v * 0.93));
      tent(XP + 0.25, 0.95, 0.85, 0.5, -0.04, win(37.9, 40.5), printer([['1 kWh ≈', 0.2, 0.22, GREY, 'mono'], ['Rp1.444,70', 0.36, 0.6, REDH], ['1.300–2.200 VA · Nov 2026', 0.13, 0.88, GREY, 'mono']]));
      sign(XP, 37.4, DURATION + 1, [['Matikan yang nggak dipakai,', S * 0.55, 0.11], ['HEMAT kWh', S * 1.1, 0.21, TEALH]], 1.45, -0.9);
      tent(XP, 0.95, 1.4, 0.68, 0, win(40.4, DURATION + 1), printer([['FOLLOW', 0.48, 0.4, '#f6f2e9'], ['buat fakta rumah berikutnya', 0.17, 0.8, '#f6f2e9', 'mono']]), TEAL);
      if (t > 40.9) star([XP + 1.2, 1.05 + 0.05 * Math.sin(t * 3), 1.2], 0.22 * pop(40.9, 0.5), (t - 40.9) * 2);
    }
