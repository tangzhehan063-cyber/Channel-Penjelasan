// E1 #01 "Rumah Belanda Tua Kok Adem Tanpa AC?" (hook B). 100% kode: Remotion + three.js, tanpa API AI.
// Dua rumah potongan (kolonial K kiri, modern M kanan), satu matahari. Aliran udara = partikel berbenih tetap.
// Penyederhanaan visual: tebal dinding, tinggi plafon, dan arah aliran udara adalah ilustrasi, bukan hasil ukur.
import {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Audio, Easing, Img, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/inter/600.css'; import '@fontsource/inter/900.css';
import {Env} from '../pengetahuan/Scene';
import {Rig} from '../kit/stage';
import {Captions} from '../kit/teks';
import {camAt, FPS, r, type Key, type V3} from '../kit/waktu';
import {Bar, Bx, C, Kicker, Label, M as Mat, type Lb} from './AnatomiRumah';
import wordsJson from '../../public/e1-01/words.json';
import peta from '../../public/e1-01/peta.json';

export const R01_FRAMES = Math.round(58.94 * FPS);
// Semua cue adegan di bawah ditulis dalam "waktu lama" (VO v1). VO diganti, jadi waktu nyata dipetakan per kalimat ke waktu lama.
const wt = (x: number) => { const B = peta.baru, L = peta.lama; if (x <= B[0]) return L[0]; for (let i = 0; i < B.length - 1; i++) if (x <= B[i + 1]) return L[i] + (L[i + 1] - L[i]) * (x - B[i]) / (B[i + 1] - B[i]); return L[L.length - 1]; };
// Foto real-life dari user (public/e1-01/foto-a.jpg, foto-b.jpg; di-gitignore, asal-usul/lisensi: risiko user, 23 Nov 2026)
const D = 0.9, WI = 3.0;
type Rm = {cx: number; H: number; tw: number; rise: number; floor: string; ceil: string; wall: string};
const K: Rm = {cx: -2.1, H: 4.0, tw: 0.35, rise: 1.5, floor: '#8a6a45', ceil: '#a88458', wall: '#d8c294'};
const MD: Rm = {cx: 2.1, H: 2.6, tw: 0.12, rise: 0.7, floor: '#cfcac0', ceil: '#f4f1ea', wall: '#a9a49b'};
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const orb = (t: number, az: number, el: number, d: number, look: V3): Key => { const A = az * Math.PI / 180, E = el * Math.PI / 180; return {t, pos: [look[0] + d * Math.cos(E) * Math.sin(A), look[1] + d * Math.sin(E), look[2] + d * Math.cos(E) * Math.cos(A)], look}; };

// ---------- dinding samping dengan lubang (plug 0 terbuka .. 1 tertutup) ----------
type Hole = [number, number, number];
const WallV: React.FC<{x: number; tw: number; H: number; holes: Hole[]; col: string}> = ({x, tw, H, holes, col}) => {
  const hs = [...holes].sort((a, b) => a[0] - b[0]); let cur = 0; const segs: [number, number][] = [];
  hs.forEach(([a, b]) => { segs.push([cur, a]); cur = b; }); segs.push([cur, H]);
  return (<group>
    {segs.filter(([a, b]) => b - a > 0.001).map(([a, b], i) => <Bx key={i} p={[x, (a + b) / 2, 0]} s={[tw, b - a, D]} c={col} />)}
    {hs.flatMap(([a, b], i) => [a, b].map((y, j) => <Bx key={`f${i}${j}`} p={[x, y, 0]} s={[tw + 0.04, 0.06, D + 0.02]} c="#5b3d22" />))}
    {hs.map(([a, b, pl], i) => pl > 0.01 ? <Bx key={`p${i}`} p={[x, a + (b - a) * pl / 2, 0]} s={[tw * 0.96, (b - a) * pl, D * 0.96]} c={col} /> : null)}
  </group>);
};

const Orang: React.FC<{x: number}> = ({x}) => (
  <group position={[x, 0, 0.15]}>
    <mesh position={[0, 0.45, 0]} castShadow><cylinderGeometry args={[0.1, 0.1, 0.9, 12]} /><meshStandardMaterial color="#51607a" roughness={0.8} /></mesh>
    <mesh position={[0, 1.2, 0]} castShadow><cylinderGeometry args={[0.17, 0.14, 0.62, 12]} /><meshStandardMaterial color="#d8714e" roughness={0.8} /></mesh>
    <mesh position={[0, 1.65, 0]} castShadow><sphereGeometry args={[0.14, 16, 12]} /><meshStandardMaterial color="#e2b896" roughness={0.7} /></mesh>
  </group>
);

const Layer: React.FC<{cx: number; y0: number; y1: number; col: string; o: number}> = ({cx, y0, y1, col, o}) => y1 - y0 < 0.02 || o <= 0.005 ? null :
  <mesh position={[cx, (y0 + y1) / 2, 0.02]}><boxGeometry args={[WI - 0.04, y1 - y0, D - 0.06]} /><meshBasicMaterial color={col} transparent opacity={o} depthWrite={false} /></mesh>;

const Udara: React.FC<{rm: Rm; t: number; vent: number; win: number; vis: number}> = ({rm, t, vent, win, vis}) => {
  const {cx, H, tw} = rm;
  return (<group>
    {Array.from({length: 30}, (_, i) => {
      const sd = rnd(i, 1) > 0.5 ? 1 : -1, ph = rnd(i, 2), sp = 0.1 + rnd(i, 3) * 0.04, u = (t * sp + ph) % 1;
      const x0 = cx + (rnd(i, 4) - 0.5) * WI * 0.8, z = (rnd(i, 5) - 0.5) * D * 0.7, y0 = 0.4 + rnd(i, 6) * 0.9, yT = H - 0.2 - rnd(i, 7) * 0.35;
      const up = u < 0.5 ? y0 + (yT - y0) * (1 - (1 - u / 0.5) ** 2) : yT;
      const k = Math.max(0, (u - 0.5) / 0.5), hx = u < 0.5 ? x0 : x0 + Math.sin((u - 0.5) * 12 + i) * 0.25;
      const ex = lerp(x0, cx + sd * (WI / 2 + tw + 0.8), k * k), ey = lerp(yT, H - 0.35, k);
      const x = lerp(hx, ex, vent), y = lerp(up, u < 0.5 ? up : ey, vent), o = Math.min(1, u / 0.08, (1 - u) / 0.1) * vis;
      return o > 0.02 ? <mesh key={`h${i}`} position={[x, y, z]}><sphereGeometry args={[0.06, 10, 8]} /><meshBasicMaterial color="#ff7a3c" transparent opacity={o * 0.9} /></mesh> : null;
    })}
    {win > 0.02 && Array.from({length: 18}, (_, i) => {
      const sd = i % 2 ? 1 : -1, ph = rnd(i, 11), u = (t * 0.13 + ph) % 1, z = (rnd(i, 12) - 0.5) * D * 0.7;
      const x = lerp(cx + sd * (WI / 2 + tw + 1.0), cx + sd * 0.2, u), y = lerp(1.6, 0.9, u), o = Math.min(1, u / 0.1, (1 - u) / 0.2) * win * vis;
      return <mesh key={`c${i}`} position={[x, y, z]}><sphereGeometry args={[0.06, 10, 8]} /><meshBasicMaterial color="#4f9dff" transparent opacity={o * 0.9} /></mesh>;
    })}
  </group>);
};

const Potong: React.FC<{rm: Rm; kind: 'K' | 'M'; t: number}> = ({rm, kind, t}) => {
  const {cx, H, tw, rise} = rm, isK = kind === 'K';
  const ventOpen = isK ? 1 : r(t, 43.6, 44.8), winR = isK ? 1 : r(t, 46, 47.2), winL = isK ? 1 : r(t, 46.6, 47.6);
  const vh: [number, number] = isK ? [H - 0.65, H - 0.2] : [H - 0.5, H - 0.15];
  const wl: [number, number] = isK ? [0.9, 2.4] : [0.9, 1.9];
  const hl: Hole[] = [[wl[0], wl[1], isK ? 0 : 0], [vh[0], vh[1], 1 - ventOpen]], hr: Hole[] = [[wl[0], wl[1], isK ? 0 : 1 - winR], [vh[0], vh[1], 1 - ventOpen]];
  const xw = WI / 2 + tw / 2, ang = Math.atan2(rise, WI / 2 + tw + 0.5), hsp = WI / 2 + tw + 0.5, L = Math.hypot(hsp, rise);
  const hotH = isK ? 0.95 : lerp(1.55, 0.7, r(t, 44, 50)), hotO = isK ? 0.26 : lerp(lerp(0.3, 0.46, r(t, 36, 42)), 0.16, r(t, 44, 50));
  return (<group>
    <Bx p={[cx, -0.06, 0]} s={[WI + 2 * tw + 0.2, 0.12, D + 0.1]} c={rm.floor} />
    <Bx p={[cx, H / 2, -D / 2 - 0.03]} s={[WI + 2 * tw, H, 0.06]} c={isK ? '#c9b283' : '#8f8b83'} />
    <WallV x={cx - xw} tw={tw} H={H} holes={hl} col={rm.wall} /><WallV x={cx + xw} tw={tw} H={H} holes={hr} col={rm.wall} />
    {!isK && winL < 0.99 && <Bx p={[cx - xw, 1.4, 0]} s={[tw * 0.5, 1.0 * (1 - winL), D * 0.95]} c={C.kaca} o={0.35} r={0.1} />}
    <Bx p={[cx, H + 0.03, 0]} s={[WI, 0.06, D]} c={rm.ceil} />
    {[-1, 1].map((s) => <mesh key={s} position={[cx + s * hsp / 2, H + 0.06 + rise / 2, 0]} rotation={[0, 0, -s * ang]} castShadow><boxGeometry args={[L, 0.06, D + 0.3]} /><Mat c={C.genteng} r={0.8} /></mesh>)}
    {[-1, 1].map((s) => <Bar key={`r${s}`} a={[cx + s * hsp, H + 0.06, D / 2 - 0.03]} b={[cx, H + 0.06 + rise, D / 2 - 0.03]} th={0.07} c={C.kayu} />)}
    <Bar a={[cx, H + 0.06, D / 2 - 0.03]} b={[cx, H + 0.06 + rise, D / 2 - 0.03]} th={0.06} c={C.kayuTua} />
    {!isK && <Bx p={[cx - WI / 2 + 0.2, 2.15, 0]} s={[0.35, 0.22, 0.7]} c="#f6f6f4" r={0.4} />}
    {(() => { const g = isK ? r(t, 25.0, 25.7) * (1 - r(t, 29.4, 30)) : r(t, 44.4, 45) * (1 - r(t, 50, 50.4)); const o = g * (0.5 + 0.2 * Math.sin(t * 5));
      return o > 0.02 ? [-1, 1].map((s) => <mesh key={s} position={[cx + s * xw, (vh[0] + vh[1]) / 2, 0]}><boxGeometry args={[tw + 0.6, vh[1] - vh[0] + 0.1, D * 0.95]} /><meshBasicMaterial color="#ffe07a" transparent opacity={o} depthWrite={false} /></mesh>) : null; })()}
    <Orang x={cx + 0.6} />
    <Layer cx={cx} y0={H - hotH} y1={H - 0.02} col="#ff7a3c" o={hotO} />
    <Layer cx={cx} y0={0.03} y1={H - hotH} col="#5aa7ff" o={0.1} />
    <Udara rm={rm} t={t} vent={ventOpen} win={isK ? 1 : Math.min(winL, winR)} vis={r(t, 0.6, 2)} />
  </group>);
};

// panah panas matahari ke dinding tebal (9–14 dtk)
const Panah: React.FC<{t: number}> = ({t}) => {
  const p = r(t, 9.4, 10.6), o = (1 - r(t, 13.4, 14.2));
  if (p <= 0 || o <= 0) return null;
  const wx = K.cx - (WI / 2 + K.tw);
  return (<group>
    {[0, 0.7, 1.4].map((dy, i) => {
      const a: V3 = [wx - 1.7, 4.0 + dy * 0.5, 0.2 - dy * 0.15], b: V3 = [lerp(a[0], wx - 0.05, p), lerp(a[1], 2.9 + dy * 0.5, p), a[2]];
      return <Bar key={i} a={a} b={b} th={0.045} c="#ff7a3c" o={o} />;
    })}
    <Bx p={[wx - 0.03, 2.2, 0.02]} s={[0.04, 3.3, D * 0.98]} c="#ffb04a" o={0.35 * p * o} />
  </group>);
};

const LABELS: Lb[] = [
  {a: 10.2, b: 14.0, text: 'Tembok tebal', at: [K.cx - WI / 2 - K.tw, 2.3, 0.45], side: 'L'},
  {a: 17.4, b: 22.6, text: 'Plafon tinggi', at: [K.cx + 1.4, 4.0, 0.45], side: 'R'},
  {a: 19.0, b: 22.6, text: 'Panas naik', at: [K.cx - 0.6, 3.3, 0], side: 'L'},
  {a: 25.6, b: 29.8, text: 'Lubang angin', at: [K.cx + WI / 2 + K.tw / 2, 3.6, 0.45], side: 'R'},
  {a: 26.0, b: 29.8, text: 'Udara sejuk masuk', at: [K.cx - WI / 2 - K.tw / 2, 1.5, 0.45], side: 'L'},
  {a: 38.2, b: 43.5, text: 'Plafon rendah', at: [MD.cx + 1.3, 2.6, 0.45], side: 'R'},
  {a: 41.6, b: 43.5, text: 'Panas terjebak', at: [MD.cx - 0.4, 2.1, 0], side: 'L'},
  {a: 44.4, b: 50.4, text: 'Ventilasi dekat plafon', at: [MD.cx + WI / 2 + MD.tw / 2, 2.3, 0.45], side: 'R'},
  {a: 47.0, b: 50.4, text: 'Jendela berhadapan', at: [MD.cx - WI / 2 - MD.tw / 2, 1.4, 0.45], side: 'L'},
];

const KEYS: Key[] = [orb(0, 3, 8, 30, [0, 1.8, 0]), orb(9, 3, 8, 28, [0, 1.8, 0]), orb(9.9, -14, 6, 12.5, [-3.3, 2.0, 0]), orb(14, -14, 6, 13, [-3.3, 2.0, 0]),
  orb(15.6, 0, 4, 16, [-2.1, 2.0, 0]), orb(22.4, 0, 4, 15.5, [-2.1, 2.2, 0]), orb(29.6, 8, 5, 16, [-2.1, 2.1, 0]), orb(30.2, 8, 8, 19, [-1.4, 1.8, 0]),
  orb(37.2, 6, 8, 18, [-0.6, 1.7, 0]), orb(38.6, 0, 4, 12.5, [2.1, 1.1, 0]), orb(43.4, 0, 4, 12.5, [2.1, 1.2, 0]), orb(50.3, -8, 5, 13, [2.1, 1.3, 0]),
  orb(53.6, 3, 8, 29, [0, 1.8, 0]), orb(61.4, -4, 9, 31, [0, 1.8, 0])];

// ---------- overlay 2D ----------
const Matahari: React.FC<{p: number}> = ({p}) => p <= 0.01 ? null : (
  <svg width={170} height={170} viewBox="-130 -130 260 260" style={{position: 'absolute', right: 24, top: 90, opacity: p}}>
    {Array.from({length: 12}, (_, i) => <line key={i} x1={0} y1={-78} x2={0} y2={-108} stroke="#f5a623" strokeWidth={9} strokeLinecap="round" transform={`rotate(${i * 30})`} />)}
    <circle r={58} fill="#ffcf4a" stroke="#f5a623" strokeWidth={6} />
  </svg>);
type Kotak = [number, number, number, number]; // x, y, lebar, tinggi di dalam kartu foto
/** momen real-life: foto menutup layar sebentar, lingkaran/kotak menyorot lubang angin */
const FotoMomen: React.FC<{src: string; t: number; a: number; b: number; w: number; h: number; pos?: string; kotak: Kotak[]; teks: string}> = ({src, t, a, b, w, h, pos = 'center', kotak, teks}) => {
  const i = r(t, a, a + 0.35, Easing.out(Easing.cubic)), o = 1 - r(t, b - 0.35, b), p = i * o;
  if (p <= 0.01) return null;
  const ring = r(t, a + 0.5, a + 1.1);
  return (<>
    <AbsoluteFill style={{background: '#f6f1e6', opacity: 0.9 * p}} />
    <div style={{position: 'absolute', left: (1080 - w) / 2, top: 300, width: w, height: h, opacity: p, transform: `scale(${0.95 + 0.05 * p})`, borderRadius: 22, overflow: 'hidden', boxShadow: '0 16px 48px rgba(30,30,30,0.35)', border: '8px solid #fbf8f1', boxSizing: 'content-box'}}>
      <Img src={staticFile(src)} style={{width: w, height: h, objectFit: 'cover', objectPosition: pos, display: 'block'}} />
      <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
        {kotak.map(([x, y, kw, kh], k) => <rect key={k} x={x} y={y} width={kw} height={kh} rx={16} fill="none" stroke="#ef6a4c" strokeWidth={8} strokeDasharray={2 * (kw + kh)} strokeDashoffset={2 * (kw + kh) * (1 - ring)} />)}
      </svg>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 300 + h + 50, textAlign: 'center', opacity: p, fontFamily: 'Inter', fontWeight: 700, fontSize: 44, color: '#2a2a2e'}}>{teks}</div>
  </>);
};
const Termo: React.FC<{x: number; label: string; val: string; fill: number; col: string}> = ({x, label, val, fill, col}) => (
  <g transform={`translate(${x},0)`}>
    <rect x={-34} y={0} width={68} height={420} rx={34} fill="#e9e4d8" /><rect x={-34} y={420 * (1 - fill)} width={68} height={420 * fill} rx={34} fill={col} />
    <circle cx={0} cy={440} r={62} fill={col} />
    <text x={0} y={560} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={64} fill="#2a2a2e">{val}</text>
    <text x={0} y={620} textAnchor="middle" fontFamily="Inter" fontWeight={600} fontSize={38} fill="#5a5a5e">{label}</text>
  </g>);
const KartuKasus: React.FC<{t: number}> = ({t}) => {
  const i = r(t, 30.0, 30.6, Easing.out(Easing.cubic)), o = 1 - r(t, 36.9, 37.5);
  if (i * o <= 0.01) return null;
  const a = r(t, 30.8, 32.4), b = r(t, 34.4, 36.0);
  return (<>
    <AbsoluteFill style={{background: '#f6f1e6', opacity: 0.86 * i * o}} />
    <div style={{position: 'absolute', left: 60, right: 60, top: 200, opacity: i * o, textAlign: 'center', fontFamily: 'Inter'}}>
      <div style={{fontWeight: 900, fontSize: 64, letterSpacing: -1.5, color: '#25252a'}}>Rumah kuno di Solo</div>
      <div style={{fontWeight: 600, fontSize: 38, color: '#5a5a5e', marginTop: 6}}>Kampung Batik Laweyan</div>
    </div>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, opacity: i * o}}>
      <g transform="translate(0,420)"><Termo x={340} label="Luar" val={`${Math.round(lerp(25, 35, a))}°C`} fill={lerp(0.25, 0.85, a)} col="#ef6a4c" /><Termo x={740} label="Dalam" val={`±${Math.round(lerp(25, 30, b))}°C`} fill={lerp(0.25, 0.62, b)} col="#f2a24a" /></g>
    </svg>
    <div style={{position: 'absolute', left: 60, right: 60, top: 1180, textAlign: 'center', opacity: i * o, fontFamily: 'Inter', fontWeight: 600, fontSize: 32, color: '#4a4a4e'}}>Penelitian dosen UMS, dikutip detikProperti (18 Feb 2025). Hasil satu rumah.</div>
  </>);
};

export const Rumah01: React.FC<{nudge?: number}> = ({nudge = 0}) => {
  // nudge: geser kamera sangat kecil, hanya untuk uji z-fighting (render frame sama dua kali, bandingkan)
  const f = useCurrentFrame(), tr = f / FPS, t = wt(tr), ms = tr * 1000, c0 = camAt(KEYS, t), cam: Key = {...c0, pos: [c0.pos[0] + nudge, c0.pos[1], c0.pos[2]]};
  const words = (wordsJson as {words: {word: string; start: number; end: number}[]}).words;
  const sun = Math.max(r(t, 0.5, 1.5) * (1 - r(t, 8.6, 9.2)), r(t, 50.4, 51.2) * (1 - r(t, 57.4, 58.2)));
  const hide = r(t, 30.0, 30.6) * (1 - r(t, 37.0, 37.5));
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#bcd8ee 0%,#e6eef0 55%,#f3e9d6 100%)'}}>
      <Audio src={staticFile('e1-01/vo.wav')} />
      <ThreeCanvas width={1080} height={1920} camera={{position: cam.pos, fov: 34}} gl={{alpha: true, antialias: true}} shadows>
        <Env intensity={0.8} /><Rig k={cam} />
        <hemisphereLight args={['#dbeaff', '#8a7a62', 0.55]} />
        <directionalLight position={[-6, 12, 8]} intensity={2.6} color="#fff4e0" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-3} shadow-camera-near={1} shadow-camera-far={45} shadow-bias={-0.0004} shadow-normalBias={0.03} />
        <fog attach="fog" args={['#e8eef0', 40, 90]} />
        <Bx p={[0, -0.6, 0]} s={[16, 1, 6]} c="#7b6650" /><Bx p={[0, -0.07, 1.6]} s={[16, 0.06, 3.4]} c="#7aa05a" r={1} />
        <Potong rm={K} kind="K" t={t} /><Potong rm={MD} kind="M" t={t} /><Panah t={t} />
      </ThreeCanvas>
      {LABELS.map((l) => <Label key={l.text} l={l} t={t} e={0} e2={0} cam={cam} />)}
      <Matahari p={sun} />
      <FotoMomen src="e1-01/foto-b.jpg" t={t} a={6.8} b={9.5} w={1000} h={562} kotak={[]} teks="Rumah zaman Belanda" />
      <FotoMomen src="e1-01/foto-a.jpg" t={t} a={22.4} b={25.5} w={1000} h={700} pos="50% 32%" kotak={[[215, 385, 130, 100], [480, 395, 130, 100]]} teks="Lubang angin di atas jendela" />
      <FotoMomen src="e1-01/foto-b.jpg" t={t} a={54.2} b={58.0} w={1000} h={562} kotak={[[470, 282, 380, 50]]} teks="Masih ada di rumahmu?" />
      <Kicker t={t} a={0.3} b={8.8} text="Adem vs panas" />
      <Kicker t={t} a={9.3} b={14.2} text="Tembok tebal" />
      <Kicker t={t} a={15.2} b={29.8} text="Jalan keluar panas" />
      <Kicker t={t} a={37.6} b={43.6} text="Panas terjebak" />
      <Kicker t={t} a={43.8} b={50.4} text="Beri jalan keluar" />
      <Kicker t={t} a={50.8} b={57.6} text="Rumahmu?" />
      <Kicker t={t} a={58.0} b={61.4} text="Fakta Rumah" />
      <KartuKasus t={t} />
      <div style={{opacity: 1 - hide * 0}}><Captions ms={ms} words={words} /></div>
    </AbsoluteFill>
  );
};
