// E1 #03 pilot v4: "Tiang listrik di depan pagar". Arah visual A (denah dari atas, 2D SVG) lalu C (urutan proses, terhubung ke tiang di denah).
// Storyboard: e1/03/storyboard.md. Waktu dari audio/e1-03-words.json (VO Gemini). Semua gerak = fungsi murni dari frame (tanpa Date/Math.random).
// Lintasan mobil: tools/lintasan_mobil.py (model kinematik, celah dan sudut setir diperiksa). Skala 1 m = 48 px.
import React from 'react';
import {AbsoluteFill, Audio, Easing, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/inter/700.css';
import '@fontsource/inter/900.css';
import lintasan from './tiang03-lintasan.json';

const FPS = 30;
export const TIANG03_FRAMES = 1740; // 58,0 dtk (VO 56,5 dtk + ekor)

// palet `batu` (style/palet.json) + turunan netral
const C = {ink: '#1c1c1e', accent: '#c23d27', cool: '#2f6aa8', good: '#2f7a4f', page: '#e9ebed', ground: '#d5d9dc', yard: '#dde3d6', road: '#aab2b8', lane: '#f1f2f3', roof: '#b9a999', ridge: '#9d8d7e', card: '#faf9f6'};
const cl = (x: number) => Math.min(1, Math.max(0, x));
const sg = (t: number, a: number, b: number) => cl((t - a) / (b - a));
const eO = (x: number) => 1 - Math.pow(1 - x, 3);
const eIO = Easing.inOut(Easing.cubic);
const eBack = (x: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const lp = (a: number, b: number, k: number) => a + (b - a) * k;
const fade = (t: number, a: number, b: number, c: number, d: number) => sg(t, a, b) * (1 - sg(t, c, d)); // naik a-b, turun c-d

// ---- dunia ----
const POLE = {x: 540, y: 1090, r: 11};
const GATE = [{x: 440, y: 950}, {x: 640, y: 950}];
const M = lintasan.mobil; // belakang, wheelbase, depan, lebar (px dari sumbu belakang)
type S3 = number[]; // [x, y, arah]
const SEG = lintasan.segmen as unknown as Record<string, {arah: string; sampel: S3[]}>;
const at = (nama: string, u: number): S3 => { const S = SEG[nama].sampel, f = cl(u) * (S.length - 1), i = Math.floor(f), j = Math.min(S.length - 1, i + 1), k = f - i; const h = lp(S[i][2], S[j][2], k); return [lp(S[i][0], S[j][0], k), lp(S[i][1], S[j][1], k), nama === 'belok' ? lp(1.5 * Math.PI, h, cl(u / 0.05)) : h]; };

function carPose(t: number): {p: S3; vis: number; seg: string; u: number} | null {
  if (t < 7.6 || t > 15.4) return null;
  const vis = fade(t, 7.6, 8.1, 14.9, 15.3);
  if (t < 8.6) return {p: at('lurus', 0), vis, seg: 'lurus', u: 0};
  if (t < 9.7) { const u = eIO(sg(t, 8.6, 9.7)); return {p: at('lurus', u), vis, seg: 'lurus', u}; }
  if (t < 10.1) return {p: at('lurus', 1), vis, seg: 'lurus', u: 1};
  if (t < 10.7) { const u = eIO(sg(t, 10.1, 10.7)); return {p: at('maju', u), vis, seg: 'maju', u}; }
  if (t < 10.9) return {p: at('maju', 1), vis, seg: 'maju', u: 1};
  if (t < 13.4) { const u = eIO(sg(t, 10.9, 13.4)); return {p: at('belok', u), vis, seg: 'belok', u}; }
  if (t < 13.7) return {p: at('belok', 1), vis, seg: 'belok', u: 1};
  const u = Math.pow(sg(t, 13.7, 15.2), 1.6); return {p: at('keluar', u), vis, seg: 'keluar', u};
}

const bodyCorners = (x: number, y: number, h: number): [number, number][] => {
  const c = Math.cos(h), s = Math.sin(h), w = (f: number, l: number): [number, number] => [x + c * f - s * l, y + s * f + c * l];
  return [w(-M.belakang, -M.lebar / 2), w(M.wheelbase + M.depan, -M.lebar / 2), w(M.wheelbase + M.depan, M.lebar / 2), w(-M.belakang, M.lebar / 2)];
};
const nearest = (px: number, py: number, P: [number, number][]) => {
  let best = 1e9, bx = 0, by = 0;
  for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], ex = b[0] - a[0], ey = b[1] - a[1], k = cl(((px - a[0]) * ex + (py - a[1]) * ey) / (ex * ex + ey * ey)); const qx = a[0] + ex * k, qy = a[1] + ey * k, d = Math.hypot(px - qx, py - qy); if (d < best) { best = d; bx = qx; by = qy; } }
  return {d: best, x: bx, y: by};
};

const Car: React.FC<{x: number; y: number; h: number; vis: number; brake: number; shake: number}> = ({x, y, h, vis, brake, shake}) => (
  <g transform={`translate(${x + shake},${y}) rotate(${(h * 180) / Math.PI})`} opacity={vis}>
    <rect x={-M.belakang} y={-M.lebar / 2} width={M.belakang + M.wheelbase + M.depan} height={M.lebar} rx={22} fill="#f5f2ea" stroke={C.ink} strokeWidth={2.5} />
    <rect x={28} y={-M.lebar / 2 + 9} width={86} height={M.lebar - 18} rx={14} fill="#e5e1d6" stroke={C.ink} strokeWidth={1.5} />
    <rect x={96} y={-M.lebar / 2 + 12} width={24} height={M.lebar - 24} rx={8} fill="#7e8d99" />
    <rect x={14} y={-M.lebar / 2 + 12} width={14} height={M.lebar - 24} rx={6} fill="#7e8d99" />
    {[0, M.wheelbase].map((wx) => [-1, 1].map((sd) => <rect key={`${wx}${sd}`} x={wx - 15} y={sd * (M.lebar / 2) - (sd > 0 ? 3 : 7)} width={30} height={10} rx={3} fill={C.ink} />))}
    {[-1, 1].map((sd) => <rect key={`b${sd}`} x={-M.belakang - 1} y={sd * 28 - 5} width={5} height={10} rx={2} fill={C.accent} opacity={0.35 + 0.65 * brake} />)}
    {[-1, 1].map((sd) => <rect key={`h${sd}`} x={M.wheelbase + M.depan - 5} y={sd * 28 - 5} width={5} height={10} rx={2} fill="#f6dd7a" />)}
  </g>
);

const Person: React.FC<{x: number; y: number; h: number; vis: number; hat?: boolean}> = ({x, y, h, vis, hat}) => (
  <g transform={`translate(${x},${y}) rotate(${(h * 180) / Math.PI})`} opacity={vis}>
    <ellipse cx={0} cy={0} rx={10} ry={21} fill="#3a4147" stroke={C.ink} strokeWidth={2} />
    <circle cx={2} cy={0} r={11} fill="#d9b99b" stroke={C.ink} strokeWidth={2} />
    {hat && <path d="M -2 -12 A 13 13 0 0 1 -2 12 Z" fill={C.cool} stroke={C.ink} strokeWidth={2} />}
  </g>
);

// jalur orang: [t, x, y]
const WALK1: number[][] = [[14.5, 540, 1455], [15.2, 540, 1270], [15.6, 546, 1175], [15.95, 592, 1118], [16.3, 596, 1068], [16.75, 566, 990], [17.25, 541, 930], [17.9, 540, 850]];
const WALK2: number[][] = [[21.3, 650, 1230], [22.0, 585, 1150], [22.4, 575, 1128]];
function walk(W: number[][], t: number) {
  if (t < W[0][0]) return null;
  let i = W.findIndex((w) => w[0] > t); if (i < 0) i = W.length - 1; if (i === 0) i = 1;
  const a = W[i - 1], b = W[i], k = cl((t - a[0]) / (b[0] - a[0]));
  return {x: lp(a[1], b[1], k), y: lp(a[2], b[2], k), h: Math.atan2(b[2] - a[2], b[1] - a[1])};
}

// ---- peta (dunia) ----
const MapWorld: React.FC<{t: number}> = ({t}) => {
  const cp = carPose(t);
  const bump = sg(t, 9.7, 9.95) * (1 - sg(t, 9.95, 10.3));
  const shake = Math.sin((t - 9.7) * 70) * 3.5 * bump;
  const brake = t > 8.0 && t < 8.55 ? (Math.floor((t - 8.0) * 8) % 2 === 0 ? 1 : 0.2) : t >= 9.4 && t < 10.15 ? 1 : 0;
  // area sapuan (mobil digambar ulang tiap 3 sampel, satu grup berbayangan = tanpa penumpukan)
  const sweep: React.ReactNode[] = [];
  const sweepVis = fade(t, 8.6, 9.0, 18.0, 19.0);
  if (cp && sweepVis > 0) {
    const segs: {n: string; upto: number}[] = [];
    if (t >= 8.6) segs.push({n: 'lurus', upto: t >= 9.7 ? 1 : cp.seg === 'lurus' ? cp.u : 1});
    if (t >= 10.1) segs.push({n: 'maju', upto: 1});
    if (t >= 10.9) segs.push({n: 'belok', upto: cp.seg === 'belok' ? cp.u : 1});
    // hanya sapuan 'belok' dan 'lurus' ditampilkan (maju = menumpuk lurus)
    for (const sgm of segs) if (sgm.n !== 'maju') {
      const S = SEG[sgm.n].sampel, n = Math.floor(sgm.upto * (S.length - 1));
      for (let i = 0; i <= n; i += 3) { const P = bodyCorners(S[i][0], S[i][1], S[i][2]); sweep.push(<polygon key={`${sgm.n}${i}`} points={P.map((q) => q.join(',')).join(' ')} fill={C.cool} />); }
    }
  }
  const lateStay = cp ? 0 : 1; void lateStay;
  // penanda celah: garis aksen dari bodi ke tiang / tiang gerbang kanan saat dekat (data nyata, bukan gambar tangan)
  const marks: React.ReactNode[] = [];
  if (cp && (cp.seg === 'belok' || (cp.seg === 'lurus' && cp.u > 0.95))) {
    const P = bodyCorners(cp.p[0], cp.p[1], cp.p[2]);
    const np = nearest(POLE.x, POLE.y, P);
    if (np.d - POLE.r < 40) marks.push(<line key="p" x1={np.x} y1={np.y} x2={POLE.x} y2={POLE.y} stroke={C.accent} strokeWidth={4} strokeLinecap="round" />);
    GATE.forEach((g, i) => { const ng = nearest(g.x, g.y, P); if (ng.d - 7 < 30) marks.push(<line key={`g${i}`} x1={ng.x} y1={ng.y} x2={g.x} y2={g.y} stroke={C.accent} strokeWidth={4} strokeLinecap="round" />); });
  }
  const bumpRing = fade(t, 9.65, 9.8, 10.1, 10.4);
  // orang
  const w1 = walk(WALK1, t), w1v = fade(t, 14.5, 14.8, 18.4, 18.9);
  const w2 = walk(WALK2, t), w2v = fade(t, 21.3, 21.6, 24.0, 24.6);
  // kerucut pandang (mata di jalan, ke bagian depan rumah) dan bayangan tiang
  const eye = {x: 540, y: 1430}, wallY = 500, houseL = 370, houseR = 710;
  const coneK = eO(sg(t, 16.7, 17.5)), wedgeK = eO(sg(t, 17.5, 18.2)), coneV = 1 - sg(t, 18.6, 19.2);
  const dP = eye.y - POLE.y, half = Math.asin(POLE.r / dP), reach = (eye.y - wallY) / Math.cos(half), wl = eye.x - Math.sin(half) * reach, wr = eye.x + Math.sin(half) * reach;
  // tiang
  const drop = eBack(sg(t, 0.25, 0.7)), poleScale = lp(2.6, 1, drop), poleOp = sg(t, 0.25, 0.4);
  const cab = sg(t, 0.4, 1.2);
  const energized = fade(t, 23.4, 23.8, 25.0, 25.6);
  const cabDash = -t * 90;
  // bayangan tiang (calon posisi)
  const g1 = t >= 3.0 && t < 4.6 ? {x: t < 3.75 ? lp(540, 640, eIO(sg(t, 3.0, 3.75))) : lp(640, 540, eIO(sg(t, 3.9, 4.4))), a: fade(t, 3.0, 3.2, 4.4, 4.6)} : null;
  const g2x = lp(540, 770, eIO(sg(t, 19.8, 21.0))), g2a = fade(t, 19.8, 20.0, 51.5, 52.0);
  const g3 = t >= 53.4 ? {x: lp(540, 770, eIO(sg(t, 54.2, 55.0))), a: fade(t, 53.4, 53.7, 55.0, 55.5)} : null;
  // jalur akses (dashed biru) dari pintu ke jalan
  const acc = eO(sg(t, 5.4, 7.0)), accA = 1 - sg(t, 8.0, 8.6);
  // sorotan gerbang (hook)
  const gateGlow = fade(t, 1.7, 1.95, 2.2, 2.6);
  // tanda stop
  const stopK = eBack(sg(t, 22.3, 22.7)) * (1 - sg(t, 24.0, 24.5));
  // mobil lewat di akhir (S9)
  const endCarT = sg(t, 52.6, 55.2), endCar = t >= 52.6 && t < 55.4;
  // panel: cincin di tiang, petugas, rumah
  const ring = fade(t, 24.9, 25.3, 51.6, 52.0) * 1, ringPulse = 1 + 0.35 * Math.sin(sg(t, 25.3, 26.2) * Math.PI) * (t < 26.4 ? 1 : 0);
  const ringTok = t >= 26.4 && t < 52.3 ? 0 : 1; // cincin "terlepas" (jadi token) selama perjalanan
  const off = walk([[36.0, 780, 1330], [36.9, 596, 1136], [37.1, 590, 1130]], t), offV = fade(t, 36.0, 36.3, 38.3, 38.9);
  const tape = sg(t, 36.9, 37.5) * (1 - sg(t, 38.3, 38.9));
  const houseHi = fade(t, 34.6, 34.9, 35.5, 36.2);
  const houseLine = sg(t, 34.7, 35.4) * (1 - sg(t, 36.0, 36.6));
  return (
    <g>
      {/* tanah, halaman, jalan */}
      <rect x={-500} y={-300} width={2080} height={2700} fill={C.ground} />
      <rect x={-500} y={-300} width={2080} height={1250} fill={C.yard} />
      <rect x={-500} y={1150} width={2080} height={320} fill={C.road} />
      <g stroke={C.lane} strokeWidth={5} strokeDasharray="46 38"><line x1={-500} y1={1310} x2={1580} y2={1310} /></g>
      <rect x={440} y={500} width={200} height={450} fill="#e8e9e3" />
      {/* rumah (tampak atas) */}
      <rect x={330} y={140} width={420} height={360} rx={14} fill={C.roof} stroke={C.ink} strokeWidth={2.5} />
      <line x1={330} y1={320} x2={750} y2={320} stroke={C.ridge} strokeWidth={5} />
      <rect x={510} y={494} width={60} height={12} rx={3} fill={C.ink} />
      <circle cx={260} cy={230} r={46} fill="#c8d3c0" /><circle cx={820} cy={720} r={52} fill="#c8d3c0" /><circle cx={190} cy={760} r={40} fill="#c8d3c0" />
      {/* pagar + gerbang */}
      <g stroke={C.ink} strokeWidth={6}><line x1={-500} y1={950} x2={GATE[0].x - 7} y2={950} /><line x1={GATE[1].x + 7} y1={950} x2={1580} y2={950} /></g>
      {GATE.map((g, i) => <rect key={i} x={g.x - 8} y={g.y - 8} width={16} height={16} fill={C.ink} />)}
      {/* jalur akses */}
      <path d={`M 540 506 L 540 ${506 + 700 * acc}`} fill="none" stroke={C.cool} strokeWidth={6} strokeDasharray="16 14" strokeLinecap="round" opacity={accA * 0.9} />
      {/* area sapuan mobil */}
      <g opacity={0.26 * sweepVis}>{sweep}</g>
      {/* kerucut pandang */}
      {coneV > 0 && coneK > 0 && (
        <g opacity={coneV}>
          <polygon points={`${eye.x},${eye.y} ${lp(eye.x, houseL, coneK)},${lp(eye.y, wallY, coneK)} ${lp(eye.x, houseR, coneK)},${lp(eye.y, wallY, coneK)}`} fill={C.cool} opacity={0.14} />
          <polygon points={`${POLE.x},${POLE.y} ${lp(POLE.x, wl, wedgeK)},${lp(POLE.y, wallY, wedgeK)} ${lp(POLE.x, wr, wedgeK)},${lp(POLE.y, wallY, wedgeK)}`} fill={C.accent} opacity={0.4} />
          <g transform={`translate(${eye.x},${eye.y})`}><ellipse rx={24} ry={13} fill="#fff" stroke={C.ink} strokeWidth={3} /><circle r={7} fill={C.ink} /></g>
        </g>
      )}
      {/* sorot gerbang di hook */}
      {gateGlow > 0 && <rect x={GATE[0].x - 4} y={940} width={GATE[1].x - GATE[0].x + 8} height={20} rx={10} fill="none" stroke={C.accent} strokeWidth={5} opacity={gateGlow} />}
      {/* mobil */}
      {cp && <Car x={cp.p[0]} y={cp.p[1]} h={cp.p[2]} vis={cp.vis} brake={brake} shake={shake} />}
      {endCar && <Car x={lp(1300, -340, eIO(endCarT))} y={1262} h={Math.PI} vis={fade(t, 52.6, 52.9, 55.0, 55.4)} brake={0} shake={0} />}
      {marks}
      {bumpRing > 0 && <circle cx={POLE.x} cy={POLE.y} r={30} fill="none" stroke={C.accent} strokeWidth={5} opacity={bumpRing} />}
      {/* orang */}
      {w1 && <Person x={w1.x} y={w1.y} h={w1.h} vis={w1v} />}
      {w2 && <Person x={w2.x} y={w2.y} h={w2.h} vis={w2v} />}
      {off && <Person x={off.x} y={off.y} h={off.h} vis={offV} hat />}
      {tape > 0 && off && <line x1={off.x} y1={off.y} x2={lp(off.x, POLE.x + 6, tape)} y2={lp(off.y, POLE.y + 10, tape)} stroke={C.cool} strokeWidth={4} strokeDasharray="10 8" opacity={offV} />}
      {stopK > 0 && (
        <g transform={`translate(612,1070) scale(${stopK * 0.8})`}>
          <polygon points="-18,-44 18,-44 44,-18 44,18 18,44 -18,44 -44,18 -44,-18" fill={C.accent} stroke="#fff" strokeWidth={5} />
          <rect x={-26} y={-6} width={52} height={12} rx={3} fill="#fff" />
        </g>
      )}
      {/* kabel (di atas mobil) */}
      {[-24, 0, 24].map((dy) => (
        <g key={dy}>
          <line x1={-500} y1={POLE.y + dy} x2={lp(-500, 1580, cab)} y2={POLE.y + dy} stroke={C.ink} strokeWidth={2.2} opacity={0.75} />
          {energized > 0 && <line x1={-500} y1={POLE.y + dy} x2={1580} y2={POLE.y + dy} stroke={C.accent} strokeWidth={4.5} strokeDasharray="22 26" strokeDashoffset={cabDash} opacity={energized} />}
        </g>
      ))}
      {/* bayangan calon posisi tiang */}
      {g1 && <g opacity={g1.a}><circle cx={g1.x} cy={POLE.y} r={POLE.r + 6} fill="none" stroke={C.ink} strokeWidth={3} strokeDasharray="8 7" /><line x1={540} y1={POLE.y + 40} x2={g1.x} y2={POLE.y + 40} stroke={C.ink} strokeWidth={2} strokeDasharray="6 6" /></g>}
      {g2a > 0 && <g opacity={g2a}><circle cx={g2x} cy={POLE.y} r={POLE.r + 6} fill="none" stroke={C.ink} strokeWidth={3} strokeDasharray="8 7" /><line x1={560} y1={POLE.y + 40} x2={g2x} y2={POLE.y + 40} stroke={C.ink} strokeWidth={2} strokeDasharray="6 6" /></g>}
      {g3 && g3.a > 0 && <g opacity={g3.a}><circle cx={g3.x} cy={POLE.y} r={POLE.r + 6} fill="none" stroke={C.ink} strokeWidth={3} strokeDasharray="8 7" /></g>}
      {/* tiang */}
      <g transform={`translate(${POLE.x},${POLE.y}) scale(${poleScale})`} opacity={poleOp}>
        <circle r={24} fill="#c5cbcf" stroke="#9aa2a8" strokeWidth={3} />
        <line x1={0} y1={-40} x2={0} y2={40} stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
        <circle r={14} fill={C.ink} /><circle r={6} fill="#f4f4f4" />
      </g>
      {/* panel: cincin pada tiang, sambungan rumah */}
      {ring > 0 && <circle cx={POLE.x} cy={POLE.y} r={30 * ringPulse} fill="none" stroke={C.cool} strokeWidth={6} opacity={ring * (ringTok > 0 ? 1 : 0.4)} />}
      {houseHi > 0 && <rect x={326} y={136} width={428} height={368} rx={16} fill="none" stroke={C.cool} strokeWidth={8} opacity={houseHi} />}
      {houseLine > 0 && <line x1={540} y1={506} x2={540} y2={lp(506, POLE.y - 30, houseLine)} stroke={C.cool} strokeWidth={5} strokeDasharray="12 10" opacity={0.9} />}
    </g>
  );
};

// ---- jalur proses (C), koordinat layar ----
const NODE_Y = [900, 1060, 1220, 1380, 1540, 1700];
const TRACK_X = 150;
const OLD_Y = [800, 970, 1140, 1310, 1480, 1650]; // koordinat isi kartu (digeser ke NODE_Y saat digambar)
const PS = 0.72, PANEL = {x: 60, y: 40, w: 960, h: 780};
const STOPS: {s: number; a: number; to: number}[] = [{s: 26.4, a: 27.2, to: 1}, {s: 27.7, a: 28.2, to: 2}, {s: 32.7, a: 33.0, to: 3}, {s: 36.0, a: 36.3, to: 4}, {s: 37.4, a: 37.8, to: 5}, {s: 48.5, a: 48.8, to: 6}];
const RETURN = {s: 51.4, a: 52.3};
function tokenPos(t: number, PO: {x: number; y: number}): {x: number; y: number; vis: number} {
  if (t < 26.4 || t > RETURN.a) return {x: PO.x, y: PO.y, vis: 0};
  const pos = (idx: number) => (idx === 0 ? PO : {x: TRACK_X, y: NODE_Y[idx - 1]});
  if (t >= RETURN.s) { const k = eIO(sg(t, RETURN.s, RETURN.a)), a = pos(6); return {x: lp(a.x, PO.x, k), y: lp(a.y, PO.y, k), vis: 1}; }
  let from = 0, cur = {x: PO.x, y: PO.y};
  for (const st of STOPS) {
    const a = pos(from), b = pos(st.to);
    if (t < st.s) return {x: a.x, y: a.y, vis: 1};
    if (t < st.a) {
      const k = eIO(sg(t, st.s, st.a));
      if (from === 0) { const mx = (a.x + b.x) / 2 - 130, my = (a.y + b.y) / 2; const u = 1 - k; return {x: u * u * a.x + 2 * u * k * mx + k * k * b.x, y: u * u * a.y + 2 * u * k * my + k * k * b.y, vis: 1}; }
      return {x: lp(a.x, b.x, k), y: lp(a.y, b.y, k), vis: 1};
    }
    from = st.to; cur = b;
  }
  return {x: cur.x, y: cur.y, vis: 1};
}

const ARRIVE = [27.2, 28.2, 33.0, 36.3, 37.8, 48.8];
const Card: React.FC<{i: number; t: number; arrive: number; children: (k: number) => React.ReactNode}> = ({i, t, arrive, children}) => {
  const k = eO(sg(t, arrive - 0.3, arrive + 0.2)), out = 1 - sg(t, 51.3, 52.0), y = NODE_Y[i];
  const nextA = i < 5 ? ARRIVE[i + 1] : 1e9, dim = sg(t, nextA - 0.2, nextA + 0.4) * 0.5; // kartu yang sudah selesai diredupkan
  const act = 1 - sg(t, nextA - 0.2, nextA + 0.4);
  if (k <= 0 || out <= 0) return null;
  return (
    <g opacity={k * out * (1 - dim)} transform={`translate(${lp(60, 0, k)},0)`}>
      <circle cx={TRACK_X} cy={y} r={15 + 5 * act} fill={act > 0.5 ? C.cool : "#fff"} stroke={C.cool} strokeWidth={5} />
      <rect x={230} y={y - 70} width={790} height={140} rx={28} fill={C.card} stroke={act > 0.5 ? C.cool : "#d9d9d4"} strokeWidth={act > 0.5 ? 5 : 2} />
      <g transform={`translate(230 ${y}) scale(1.2) translate(-230 ${-OLD_Y[i]})`}>{children(k)}</g>
    </g>
  );
};
const PhoneIcon: React.FC<{x: number; y: number; label?: string; op?: number}> = ({x, y, label, op = 1}) => (
  <g transform={`translate(${x},${y})`} opacity={op}>
    <rect x={-24} y={-44} width={48} height={88} rx={10} fill="#fff" stroke={C.ink} strokeWidth={4} />
    <rect x={-17} y={-34} width={34} height={58} rx={4} fill="#e8eef5" />
    {label && <text x={0} y={4} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={26} fill={C.cool}>{label}</text>}
    <circle cx={0} cy={34} r={4} fill={C.ink} />
  </g>
);
const Officer: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x},${y})`}>
    <circle cx={0} cy={-10} r={20} fill="#d9b99b" stroke={C.ink} strokeWidth={3} />
    <path d="M -24 -14 A 24 24 0 0 1 24 -14 Z" fill={C.cool} stroke={C.ink} strokeWidth={3} />
    <path d="M -30 40 Q -30 14 0 14 Q 30 14 30 40 Z" fill="#3a4147" stroke={C.ink} strokeWidth={3} />
  </g>
);

const TrackLayer: React.FC<{t: number; pole: {x: number; y: number}}> = ({t, pole}) => {
  if (t < 26.3 || t > 52.4) return null;
  const tk = tokenPos(t, pole), out = 1 - sg(t, 51.3, 52.0);
  const lineTo = Math.max(NODE_Y[0], Math.min(NODE_Y[5], t >= RETURN.s ? NODE_Y[5] : tk.y));
  return (
    <g>
      <path d={`M ${pole.x} ${pole.y} Q ${(pole.x + TRACK_X) / 2 - 130} ${(pole.y + NODE_Y[0]) / 2} ${TRACK_X} ${NODE_Y[0]}`} fill="none" stroke={C.cool} strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" opacity={out * eO(sg(t, 26.4, 27.2)) * 0.8} />
      <line x1={TRACK_X} y1={NODE_Y[0]} x2={TRACK_X} y2={lineTo} stroke={C.cool} strokeWidth={5} strokeDasharray="2 12" strokeLinecap="round" opacity={out} />
      {/* N1: tiang PLN dipastikan */}
      <Card i={0} t={t} arrive={27.2}>{() => (
        <g>
          <g transform="translate(320,800)"><line x1={0} y1={-46} x2={0} y2={46} stroke={C.ink} strokeWidth={8} strokeLinecap="round" /><line x1={-26} y1={-30} x2={26} y2={-30} stroke={C.ink} strokeWidth={6} strokeLinecap="round" /></g>
          <g transform={`translate(430,800) scale(${eBack(sg(t, 27.3, 27.7))})`}><circle r={30} fill={C.good} /><path d="M -14 0 L -4 11 L 15 -11" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /></g>
        </g>
      )}</Card>
      {/* N2: telepon 123 / PLN Mobile menu Pengaduan */}
      <Card i={1} t={t} arrive={28.2}>{() => (
        <g>
          <PhoneIcon x={310} y={970} label={t > 28.8 ? '123' : undefined} op={eO(sg(t, 28.0, 28.4))} />
          <g opacity={eO(sg(t, 29.7, 30.2))}>
            <rect x={400} y={926} width={80} height={80} rx={20} fill={C.cool} />
            {[0, 1, 2].map((r) => <rect key={r} x={416} y={944 + r * 18} width={r === 2 ? 34 : 48} height={8} rx={4} fill="#fff" opacity={r === 2 && t > 31.4 ? 1 : 0.75} />)}
          </g>
          <text x={520} y={984} fontFamily="Inter" fontWeight={700} fontSize={38} fill={C.ink} opacity={eO(sg(t, 31.4, 31.8))}>Pengaduan</text>
        </g>
      )}</Card>
      {/* N3: alamat + nomor pelanggan */}
      <Card i={2} t={t} arrive={33.0}>{() => (
        <g>
          <g transform="translate(300,1140)" opacity={eO(sg(t, 33.2, 33.5))}><path d="M 0 -34 C 22 -34 30 -14 30 -4 C 30 14 0 40 0 40 C 0 40 -30 14 -30 -4 C -30 -14 -22 -34 0 -34 Z" fill={C.accent} /><circle cy={-6} r={9} fill="#fff" /></g>
          <rect x={360} y={1133} width={lp(0, 180, eO(sg(t, 33.2, 33.8)))} height={14} rx={7} fill="#b9bec2" />
          <g transform="translate(600,1140)" opacity={eO(sg(t, 33.7, 34.0))}><rect x={-34} y={-30} width={68} height={60} rx={12} fill="#fff" stroke={C.ink} strokeWidth={4} />{[0, 1, 2].map((r) => <rect key={r} x={-20} y={-16 + r * 14} width={r === 1 ? 28 : 40} height={6} rx={3} fill={C.ink} />)}</g>
          <rect x={650} y={1133} width={lp(0, 150, eO(sg(t, 33.7, 34.4)))} height={14} rx={7} fill="#b9bec2" />
        </g>
      )}</Card>
      {/* N4: survei */}
      <Card i={3} t={t} arrive={36.3}>{() => (
        <g>
          <Officer x={310} y={1318} />
          <rect x={390} y={1296} width={lp(0, 380, eO(sg(t, 36.6, 37.3)))} height={18} rx={4} fill="#f0d98a" stroke={C.ink} strokeWidth={2} />
          {Array.from({length: 12}).map((_, k) => <line key={k} x1={400 + k * 30} y1={1296} x2={400 + k * 30} y2={k % 2 ? 1305 : 1314} stroke={C.ink} strokeWidth={2} opacity={400 + k * 30 < 390 + lp(0, 380, eO(sg(t, 36.6, 37.3))) ? 1 : 0} />)}
        </g>
      )}</Card>
      {/* N5: biaya dan waktu */}
      <Card i={4} t={t} arrive={37.8}>{() => {
        const full = eO(sg(t, 43.5, 45.4)), more = eO(sg(t, 46.0, 47.8)), tx = 500, bw = 380, by = 1480;
        return (
          <g>
            <g transform="translate(290,1480)" opacity={eO(sg(t, 38.2, 38.6))}><circle r={34} fill="#f3d27a" stroke={C.ink} strokeWidth={4} /><text y={11} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={30} fill={C.ink}>Rp</text></g>
            <g transform="translate(400,1480)" opacity={eO(sg(t, 38.7, 39.1))}><circle r={30} fill="#fff" stroke={C.ink} strokeWidth={4} /><line x1={0} y1={0} x2={0} y2={-18} stroke={C.ink} strokeWidth={4} strokeLinecap="round" transform={`rotate(${(t - 38.7) * 90})`} /><line x1={0} y1={0} x2={12} y2={0} stroke={C.ink} strokeWidth={4} strokeLinecap="round" /></g>
            <rect x={tx} y={by - 12} width={bw} height={24} rx={12} fill="#e3e5e6" stroke="#c9ccce" strokeWidth={2} opacity={eO(sg(t, 40.9, 41.4))} />
            <rect x={tx + 50} y={by - 12} width={lp(0, 120, full)} height={24} rx={12} fill={C.cool} />
            <text x={tx + 40} y={by - 26} fontFamily="Inter" fontWeight={700} fontSize={34} fill={C.ink} opacity={full}>contoh Rp1–4 jt</text>
            <defs><linearGradient id="bar" x1="0" x2="1"><stop offset="0" stopColor={C.cool} stopOpacity={0.9} /><stop offset="1" stopColor={C.cool} stopOpacity={0} /></linearGradient></defs>
            <rect x={tx + 170} y={by - 12} width={lp(0, 210, more)} height={24} rx={12} fill="url(#bar)" />
          </g>
        );
      }}</Card>
      {/* N6: bayar lewat payment online bank, bukan ke petugas */}
      <Card i={5} t={t} arrive={48.8}>{() => {
        const ck = eBack(sg(t, 49.9, 50.3)), cut = sg(t, 50.3, 50.9);
        return (
          <g>
            <PhoneIcon x={300} y={1650} op={eO(sg(t, 49.0, 49.4))} />
            <g transform="translate(400,1650)" opacity={eO(sg(t, 49.4, 49.8))}>
              <path d="M -36 -22 L 0 -44 L 36 -22 Z" fill={C.ink} />{[-24, -8, 8, 24].map((x) => <rect key={x} x={x - 4} y={-20} width={8} height={40} fill={C.ink} />)}<rect x={-40} y={24} width={80} height={10} fill={C.ink} />
            </g>
            <g transform={`translate(480,1650) scale(${ck})`}><circle r={26} fill={C.good} /><path d="M -12 0 L -3 9 L 13 -9" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /></g>
            <g opacity={eO(sg(t, 50.2, 50.6))}>
              <Officer x={800} y={1658} />
              <line x1={540} y1={1650} x2={lp(540, 740, 1)} y2={1650} stroke={C.ink} strokeWidth={4} strokeDasharray="10 10" opacity={1 - cut} />
              <g transform="translate(650,1650)" opacity={cut}><line x1={-18} y1={-18} x2={18} y2={18} stroke={C.accent} strokeWidth={9} strokeLinecap="round" /><line x1={-18} y1={18} x2={18} y2={-18} stroke={C.accent} strokeWidth={9} strokeLinecap="round" /></g>
            </g>
          </g>
        );
      }}</Card>
      {tk.vis > 0 && <circle cx={tk.x} cy={tk.y} r={16} fill="none" stroke={C.cool} strokeWidth={5} opacity={Math.min(1, tk.vis)} />}
    </g>
  );
};

export const Tiang03: React.FC = () => {
  const frame = useCurrentFrame(), t = frame / FPS;
  const kIn = eIO(sg(t, 24.6, 25.5)), kOut = eIO(sg(t, 51.8, 53.0)), k = cl(kIn - kOut);
  // kamera dunia (bermotif): dekat tiang di hook, mundur untuk akses, mendekat saat manuver, lebar untuk orang dan garis pandang,
  // dekat lagi untuk solusi; di akhir kembali dekat ke tiang (gema hook).
  const KEY: [number, number, number, number][] = [ // [t, skala, cx, cy]
    [0, 2.2, 540, 1030], [3.9, 2.2, 540, 1030], [7.0, 1.35, 540, 1000], [8.4, 1.9, 640, 1040], [13.6, 1.9, 640, 1040],
    [14.8, 1.3, 540, 1000], [18.9, 1.3, 540, 1000], [19.8, 1.6, 600, 1060], [24.5, 1.6, 600, 1060], [53.0, 1.6, 600, 1060], [54.2, 2.0, 540, 1030],
  ];
  let ki = KEY.findIndex((q) => q[0] > t); if (ki < 0) ki = KEY.length - 1; if (ki === 0) ki = 1;
  const ka = KEY[ki - 1], kb = KEY[ki], kk = eIO(cl((t - ka[0]) / (kb[0] - ka[0])));
  const s0 = lp(ka[1], kb[1], kk), cx0 = lp(ka[2], kb[2], kk), cy0 = lp(ka[3], kb[3], kk);
  const q = fade(t, 35.9, 36.6, 38.4, 39.2); // panel mendekat ke tiang saat petugas survei
  const s = lp(s0, PS * (1 + 0.7 * q), k), cx = lp(cx0, lp(540, POLE.x, q), k), cy = lp(cy0, lp(900, 1055, q), k), sx = 540, sy = lp(960, PANEL.y + PANEL.h / 2, k);
  const rect = {x: lp(0, PANEL.x, k), y: lp(0, PANEL.y, k), w: lp(1080, PANEL.w, k), h: lp(1920, PANEL.h, k), r: lp(0, 36, k)};
  const poleScr = {x: sx + (POLE.x - cx) * s, y: sy + (POLE.y - cy) * s};
  const frameOp = k;
  return (
    <AbsoluteFill style={{background: C.page}}>
      <Audio src={staticFile('e1-03/vo.wav')} />
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <defs><clipPath id="mapclip"><rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx={rect.r} /></clipPath></defs>
        <g clipPath="url(#mapclip)"><g transform={`translate(${sx},${sy}) scale(${s}) translate(${-cx},${-cy})`}><MapWorld t={t} /></g></g>
        <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx={rect.r} fill="none" stroke="#9aa2a8" strokeWidth={4} opacity={frameOp} />
        <TrackLayer t={t} pole={poleScr} />
      </svg>
    </AbsoluteFill>
  );
};
