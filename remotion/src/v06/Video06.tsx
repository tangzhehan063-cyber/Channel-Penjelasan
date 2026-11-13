// Video #6 "Lantai Rumahmu Sengaja Dibuat Miring" (Gaya A editorial 3D + sistem gabungan). Timing dari timestamp kata VO (public/v06/words.json).
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import * as THREE from 'three';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Env, Ghost, Callout, PALETTE} from '../pengetahuan/Scene';
import {Grain, TikTokBox} from '../aset/Aset';
import {Squiggle} from '../aset/Gerak';
import {K, PaperPlus, Kicker, Disc, FocusRing, StatPanel, CommentBubble, FollowButton, Ornament} from '../aset/Gabung';
import {Floor, Marble, Puddle, Stream, Crust, Potongan, DRAIN, FD, FW, POT} from './Lantai';
import words from '../../public/v06/words.json';

export const FPS = 30;
export const V06_FRAMES = Math.ceil(56.2 * FPS);
const FOV = 34, ASPECT = 1080 / 1920;
const INK = PALETTE.ink, CORAL = '#ef7663';

// ---------- util waktu ----------
const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
type V3 = [number, number, number];
type Key = {t: number; pos: V3; look: V3};
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
function camAt(keys: Key[], t: number) {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) { const k = ease((t - a.t) / (b.t - a.t)); return {t, pos: lerp3(a.pos, b.pos, k), look: lerp3(a.look, b.look, k)}; }
  }
  return keys[keys.length - 1];
}
// proyeksi titik lokal lantai (setelah tilt + yaw) ke piksel layar
function proj(cam: Key, p: V3, yaw: number, tilt = 0): [number, number] {
  const c = new THREE.PerspectiveCamera(FOV, ASPECT, 0.1, 100);
  c.position.set(...cam.pos); c.lookAt(...cam.look); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = new THREE.Vector3(...p).applyEuler(new THREE.Euler(tilt, 0, -tilt * 0.6)).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw).project(c);
  return [(v.x + 1) * 540, (1 - v.y) * 960];
}

// ---------- beat (detik dari timestamp VO) ----------
const B = {hook: 0, janji: 4.32, angka: 8.0, a1: 14.88, a2: 19.84, a3: 24.24, dua: 30.88, split: 38.2, twist: 42.56, tes: 46.0, tanya: 51.12, follow: 52.8, end: 56.2};

const FLOOR_KEYS: Key[] = [
  {t: 0, pos: [1.6, 4.3, 5.4], look: [0, 0.3, 0]},
  {t: 7.6, pos: [1.4, 4.0, 5.0], look: [0, 0.3, 0]},
  {t: 8.6, pos: [0.0, 0.5, 7.6], look: [0, -0.12, 0]},
  {t: 14.3, pos: [0.0, 0.5, 7.3], look: [0, -0.12, 0]},
  {t: 15.3, pos: [1.3, 3.6, 4.6], look: [0, 0.3, 0]},
  {t: 19.4, pos: [1.2, 3.5, 4.4], look: [0, 0.3, 0]},
  {t: 20.4, pos: [0.25, 1.75, 1.35], look: [-0.38, 0, -0.78]},
  {t: 24.4, pos: [0.2, 1.6, 1.2], look: [-0.38, 0, -0.78]},
  {t: 42.5, pos: [1.6, 4.3, 5.4], look: [0, 0.3, 0]},
  {t: 43.3, pos: [2.2, 1.3, 5.6], look: [0, 0.2, 0]},
  {t: 45.3, pos: [2.2, 1.3, 5.4], look: [0, 0.2, 0]},
  {t: 46.2, pos: [1.4, 4.0, 5.0], look: [0, 0.3, 0]},
  {t: 51.0, pos: [1.3, 3.8, 4.8], look: [0, 0.3, 0]},
  {t: 56.2, pos: [1.6, 4.5, 5.6], look: [0, 0.1, 0]},
];
const POT_KEYS: Key[] = [
  {t: 24.0, pos: [1.6, 1.7, 4.9], look: [0, 0.25, 0]},
  {t: 31.2, pos: [1.3, 1.4, 4.3], look: [0, 0.2, 0]},
];
const YAW0 = -0.55, YAW_SIDE = -Math.PI / 2, POT_YAW = -0.4;
const START: [number, number] = [-0.62, -0.45];

function floorState(t: number) {
  const side = r(t, 8.0, 8.8) * (1 - r(t, 14.4, 15.3));
  const yaw = YAW0 + (YAW_SIDE - YAW0) * side + (t < B.twist ? 0 : 0.18 * r(t, B.twist, B.end, Easing.linear)) + (t < 8 ? -1.1 * (1 - r(t, 0, 1.1, Easing.out(Easing.cubic))) : 0);
  // kemiringan: tampak kecil, dilebih-lebihkan saat tampak samping, sangat curam saat twist
  let tilt = 0.035 + 0.06 * side;
  tilt += 0.5 * r(t, 43.0, 43.5) * (1 - r(t, 45.4, 46.0));
  tilt *= 1 - 1.0 * r(t, 19.9, 20.4) * (1 - r(t, 24.1, 24.3));   // pojok rata: air diam
  // kelereng
  let mx = START[0], mz = START[1], mo = 0, lift = 0, dist = 0;
  const path = (k: number, a = START, b = DRAIN) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const L = Math.hypot(DRAIN[0] - START[0], DRAIN[1] - START[1]);
  if (t < 8.0) {
    mo = r(t, 0.9, 1.3, Easing.out(Easing.back(1.5))) * (1 - r(t, 7.6, 7.95)); lift = 0.5 * (1 - r(t, 0.9, 1.5, Easing.bounce));
    const k = r(t, 4.6, 7.5, Easing.in(Easing.quad)); [mx, mz] = path(k * 0.96); dist = L * k;
  } else if (t >= B.twist && t < B.tes) {
    const far: [number, number] = [FW / 2 + 0.5, FD / 2 + 0.5];
    mo = r(t, 42.6, 42.9) * (1 - r(t, 44.6, 44.8));
    const k = r(t, 43.4, 44.6, Easing.in(Easing.quad)); [mx, mz] = path(k, START, far); dist = 3 * k;
    lift = -Math.max(0, (k - 0.72) * 2.2);
  } else if (t >= B.tes) {
    mo = r(t, 46.3, 46.6, Easing.out(Easing.back(1.5))) * (1 - r(t, 49.5, 49.8)); lift = 0.5 * (1 - r(t, 46.3, 46.9, Easing.bounce));
    const k = r(t, 47.0, 49.5, Easing.in(Easing.quad)); [mx, mz] = path(k); dist = L * k;
  }
  return {yaw, tilt, mx, mz, mo, lift, roll: dist / 0.075};
}

// ---------- komponen ----------
const Rig: React.FC<{k: Key}> = ({k}) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  cam.position.set(...k.pos); cam.fov = FOV; cam.updateProjectionMatrix(); cam.lookAt(...k.look);
  return null;
};
const Lights: React.FC = () => (<><Env /><ambientLight intensity={0.18} /><directionalLight position={[4, 6, 5]} intensity={3.0} /><directionalLight position={[-4, 1, 3]} intensity={0.4} color="#ffe2da" /></>);
const Canvas3D: React.FC<{k: Key; children: React.ReactNode}> = ({k, children}) => (
  <ThreeCanvas width={1080} height={1920} camera={{position: k.pos, fov: FOV}} gl={{alpha: true, antialias: true}}>
    <Lights /><Rig k={k} />{children}
  </ThreeCanvas>
);
const OV = 9;
const Seg: React.FC<{a: number; b: number; f: number; first?: boolean; children: React.ReactNode}> = ({a, b, f, first, children}) => {
  const fa = Math.round(a * FPS) - (first ? 0 : OV), fb = Math.round(b * FPS) + OV;
  const o = interpolate(f, [fa, fa + 2 * OV, fb - 2 * OV, fb], [first ? 1 : 0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Sequence from={fa} durationInFrames={fb - fa} layout="none"><AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill></Sequence>;
};

const Title: React.FC<{t: number; a: number; b: number; small: string; big: string; bigColor?: string; size?: number}> = ({t, a, b, small, big, bigColor = CORAL, size = 112}) => {
  const i = r(t, a, a + 0.45, Easing.out(Easing.cubic)), o = 1 - r(t, b - 0.3, b);
  if (i * o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 60, top: 450, maxWidth: 960, padding: '20px 30px 24px', borderRadius: 26, background: 'rgba(250,249,246,0.94)', boxShadow: '0 12px 40px rgba(28,28,30,0.12)', fontFamily: 'Inter', color: INK, opacity: i * o, transform: `translateY(${(1 - i) * 26}px)`}}>
      <div style={{fontSize: 50, fontWeight: 700, letterSpacing: -1}}>{small}</div>
      <div style={{whiteSpace: 'nowrap', fontSize: size, fontWeight: 900, letterSpacing: -2, lineHeight: 1.0, color: bigColor, marginTop: 6}}>{big}</div>
    </div>
  );
};

const NUM: Record<string, string> = {tiga: '3', dua: '2', satu: '1'};
const caps: Caption[] = (words as {words: {word: string; start: number; end: number}[]}).words.map((w, i) => {
  const txt = w.word === 'persen' ? '%' : (NUM[w.word] ?? w.word);
  return {text: (i && w.word !== 'persen' ? ' ' : '') + txt, startMs: w.start * 1000, endMs: w.end * 1000, timestampMs: w.start * 1000, confidence: 1};
});
const {pages} = createTikTokStyleCaptions({captions: caps, combineTokensWithinMilliseconds: 950});
const Captions: React.FC<{ms: number}> = ({ms}) => {
  const pg = pages.find((p, i) => ms >= p.startMs && ms < (pages[i + 1]?.startMs ?? p.startMs + p.durationMs + 400));
  if (!pg) return null;
  const k = r(ms / 1000, pg.startMs / 1000, pg.startMs / 1000 + 0.15);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1400, textAlign: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: 60, letterSpacing: -0.8, lineHeight: 1.15, color: INK, opacity: k, transform: `translateY(${(1 - k) * 10}px)`}}>
      <span style={{display: 'inline-block', padding: '12px 28px 16px', borderRadius: 22, background: 'rgba(250,249,246,0.94)', boxShadow: '0 10px 30px rgba(28,28,30,0.12)'}}>
        {pg.tokens.map((tk, i) => <span key={i} style={{color: ms >= tk.fromMs && ms < tk.toMs + 120 ? CORAL : INK}}>{tk.text}</span>)}
      </span>
    </div>
  );
};

const Mark: React.FC<{x: number; y: number; p: number; ok?: boolean}> = ({x, y, p, ok}) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.6, 1], [0.4, 1.12, 1]);
  return (
    <svg width="1080" height="1920" style={{position: 'absolute'}}>
      <g transform={`translate(${x} ${y}) scale(${s})`} opacity={Math.min(1, p * 2)}>
        <circle r="58" fill={ok ? K.sage : '#fff'} stroke={ok ? K.sage : INK} strokeWidth="5" />
        {ok ? <path d="M -26 2 L -7 22 L 28 -20" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M -22 -22 L 22 22 M 22 -22 L -22 22" stroke={CORAL} strokeWidth="11" strokeLinecap="round" />}
      </g>
    </svg>
  );
};

// garis datar putus-putus + braket "turun" untuk tampak samping
const SideGuide: React.FC<{hi: [number, number]; lo: [number, number]; p: number}> = ({hi, lo, p}) => {
  if (p <= 0) return null;
  const x2 = hi[0] + (lo[0] - hi[0]) * Math.min(1, p * 1.6), br = r(p, 0.55, 1, Easing.linear);
  return (
    <>
      <svg width="1080" height="1920" style={{position: 'absolute'}}>
        <line x1={hi[0]} y1={hi[1]} x2={x2} y2={hi[1]} stroke={INK} strokeWidth="4" strokeDasharray="16 12" />
        <g opacity={br}><line x1={lo[0]} y1={hi[1]} x2={lo[0]} y2={lo[1]} stroke={CORAL} strokeWidth="6" />
          <line x1={lo[0] - 18} x2={lo[0] + 18} y1={hi[1]} y2={hi[1]} stroke={CORAL} strokeWidth="6" /><line x1={lo[0] - 18} x2={lo[0] + 18} y1={lo[1]} y2={lo[1]} stroke={CORAL} strokeWidth="6" /></g>
      </svg>
      <div style={{position: 'absolute', left: hi[0] - 10, top: hi[1] - 70, padding: '4px 12px', borderRadius: 10, background: 'rgba(250,249,246,0.94)', fontFamily: 'IBM Plex Mono', fontWeight: 500, fontSize: 30, color: INK, opacity: r(p, 0.3, 0.6, Easing.linear)}}>datar</div>
      <div style={{position: 'absolute', left: lo[0] + 26, top: (hi[1] + lo[1]) / 2 - 24, padding: '4px 12px', borderRadius: 10, background: 'rgba(250,249,246,0.94)', fontFamily: 'IBM Plex Mono', fontWeight: 500, fontSize: 26, color: INK, opacity: br}}>(dilebih-lebihkan)</div>
    </>
  );
};

// layar dua pendapat (setelah layar koral): kamar tidur RATA vs kamar mandi MIRING
const SplitCards: React.FC<{t: number}> = ({t}) => {
  const out = 1 - r(t, 42.2, 42.6);
  const card = (a: number, x: number, small: string, big: string, color: string, art: React.ReactNode) => {
    const i = r(t, a, a + 0.5, Easing.out(Easing.back(1.3))) * out;
    if (i <= 0) return null;
    return (
      <div style={{position: 'absolute', left: x, top: 640, width: 450, height: 640, borderRadius: 30, background: 'rgba(250,249,246,0.97)', boxShadow: '0 16px 44px rgba(28,28,30,0.16)', border: `5px solid ${color}`,
        fontFamily: 'Inter', textAlign: 'center', opacity: Math.min(1, i * 1.4), transform: `translateY(${(1 - i) * 50}px)`}}>
        <div style={{marginTop: 44, fontSize: 44, fontWeight: 700, color: INK, letterSpacing: -0.8, lineHeight: 1.1}}>{small}</div>
        <div style={{marginTop: 10, fontSize: 104, fontWeight: 900, color, letterSpacing: -3}}>{big}</div>
        <svg width="450" height="300" style={{marginTop: 10}}>{art}</svg>
      </div>
    );
  };
  const bub = 225 + 6 * Math.sin(t * 3);
  return (
    <>
      {card(B.split, 60, 'Kamar tidur', 'RATA', K.sage, <g>
        <rect x="60" y="110" width="330" height="70" rx="14" fill="#e3b04b" stroke={INK} strokeWidth="5" />
        <rect x="160" y="125" width="130" height="40" rx="20" fill="#d9f0d6" stroke={INK} strokeWidth="4" />
        <ellipse cx={bub} cy="145" rx="22" ry="14" fill="#fff" stroke={INK} strokeWidth="3" />
        <line x1="40" x2="410" y1="215" y2="215" stroke={INK} strokeWidth="6" /></g>)}
      {card(40.16, 570, 'Kamar mandi & teras', 'MIRING', K.blue, <g>
        <line x1="40" y1="150" x2="410" y2="215" stroke={INK} strokeWidth="6" />
        <path d="M120 120 L300 152" stroke={K.blue} strokeWidth="10" strokeLinecap="round" />
        <path d="M300 152 L272 130 M300 152 L268 168" stroke={K.blue} strokeWidth="10" strokeLinecap="round" />
        <rect x="350" y="200" width="56" height="16" rx="3" fill="#d9d7d3" stroke={INK} strokeWidth="4" /></g>)}
    </>
  );
};

const SFX: [string, number, number][] = [
  ['pop', 1.3, 0.5], ['knock', 1.55, 0.35], ['whoosh', 4.3, 0.3], ['flow', 5.2, 0.25], ['drip', 7.6, 0.45], ['whoosh', 8.1, 0.35],
  ['tick', 9.3, 0.5], ['tick', 11.2, 0.45], ['tick', 12.4, 0.5], ['flow', 15.6, 0.35], ['drip', 18.6, 0.4], ['whoosh', 19.9, 0.3],
  ['crystal', 21.8, 0.45], ['crackle', 22.6, 0.35], ['whoosh', 24.3, 0.35], ['drip', 27.4, 0.45], ['drip', 28.3, 0.4], ['drip', 29.1, 0.35],
  ['riser', 30.2, 0.35], ['pop', 31.4, 0.4], ['pop', 34.3, 0.4], ['whoosh', 38.2, 0.35], ['pop', 38.4, 0.45], ['pop', 40.3, 0.45],
  ['whoosh', 43.4, 0.4], ['buzz', 44.8, 0.4], ['pop', 46.4, 0.45], ['knock', 46.7, 0.35], ['flow', 47.4, 0.3], ['drip', 49.6, 0.45], ['chime', 49.8, 0.45],
  ['pop', 51.2, 0.4], ['chime', 54.0, 0.4],
];

export const Video06: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const fc = camAt(FLOOR_KEYS, t), pc = camAt(POT_KEYS, t);
  const s = floorState(t);
  const P = (p: V3) => proj(fc, p, s.yaw, s.tilt);
  const Q = (p: V3) => proj(pc, p, POT_YAW);
  // air
  const flowK = r(t, 15.4, 18.6, Easing.inOut(Easing.quad));
  const a1Start: [number, number] = [-0.5, -0.3];
  const pud1 = {x: a1Start[0] + (DRAIN[0] - a1Start[0]) * flowK, z: a1Start[1] + (DRAIN[1] - a1Start[1]) * flowK, r: 0.3 * (1 - flowK * 0.85) * r(t, 14.9, 15.3), o: 1 - r(t, 19.0, 19.6)};
  const still = r(t, 20.0, 20.6) * (1 - r(t, 24.0, 24.4));
  const flood = r(t, 30.9, 31.6), floodOut = r(t, 38.0, 38.6);
  const pbIn = r(t, 31.2, 31.6) * (1 - r(t, 37.9, 38.2));
  const quote = (a: number, b: number) => r(t, a, a + 0.35) * (1 - r(t, b - 0.25, b));
  const accent = r(t, 30.9, 31.3) * (1 - r(t, 38.0, 38.4));
  const drainPt = P([DRAIN[0], 0, DRAIN[1]]), startPt = P([START[0], 0, START[1]]);
  const hi = P([0, 0.0, -FD / 2]), lo = P([0, 0, FD / 2]);
  return (
    <AbsoluteFill>
      <PaperPlus />
      {t < B.a1 && <Ghost lines={['Sengaja', 'Miring']} o={1 - r(t, 14.2, 14.8)} />}
      {t >= B.a1 && t < B.dua && <Ghost lines={['Air', 'Diam']} />}
      {t >= B.twist && <Ghost lines={['Tes', 'Kelereng']} />}

      {/* jangkar atas */}
      <Kicker text="FAKTA RUMAH · #06" y={292} start={0} />
      <TikTokBox text="Lantai kamar mandimu rata?" p={r(t, 0.15, 0.9, Easing.linear)} y={338} size={40} />

      <Disc x={540} y={1010} r={330} color="#f6c9bd" start={6} out={Math.round(7.8 * FPS)} />
      <Squiggle x={70} y={600} start={10} out={Math.round(4.2 * FPS)} />
      <Squiggle x={860} y={1230} start={16} rot={180} out={Math.round(4.2 * FPS)} />

      {/* 3D */}
      <Seg a={0} b={B.a3} f={f} first><Canvas3D k={fc}><group rotation={[0, s.yaw, 0]}><group rotation={[s.tilt, 0, -s.tilt * 0.6]}>
        <Floor />
        <Marble x={s.mx} z={s.mz} roll={s.roll} o={s.mo} lift={s.lift} />
        <Puddle x={pud1.x} z={pud1.z} r={pud1.r} o={pud1.o} />
        <Stream a={a1Start} p={r(t, 15.0, 15.8) * (1 - r(t, 18.8, 19.4))} />
        <Puddle x={-0.72} z={-0.5} r={0.26 * still} o={still} sx={1.25} />
        <Crust p={r(t, 20.6, 23.4, Easing.linear) * still} cx={-0.72} cz={-0.5} />
      </group></group></Canvas3D></Seg>
      <Seg a={B.a3} b={B.dua + 0.6} f={f}><Canvas3D k={pc}><group rotation={[0, POT_YAW, 0]}>
        <Potongan explode={r(t, 24.5, 25.6, Easing.out(Easing.cubic))} drops={r(t, 26.3, 26.8) } wet={r(t, 27.6, 30.4, Easing.out(Easing.quad))} t={t} />
      </group></Canvas3D></Seg>
      <Seg a={B.twist} b={B.end} f={f}><Canvas3D k={fc}><group rotation={[0, s.yaw, 0]}><group rotation={[s.tilt, 0, -s.tilt * 0.6]}>
        <Floor />
        <Marble x={s.mx} z={s.mz} roll={s.roll} o={s.mo} lift={s.lift} />
      </group></group></Canvas3D></Seg>

      {/* judul 2 baris per beat */}
      <Title t={t} a={0.05} b={B.janji} small="Lantai kamar mandimu" big="NGGAK RATA" />
      <Title t={t} a={B.janji} b={B.angka} small="Sengaja, karena" big="3 ALASAN" />
      <Title t={t} a={B.angka} b={B.a1} small="Miringnya cuma" big="± 2%" size={140} />
      <Title t={t} a={B.a1} b={B.a2} small="1. Air nggak diam," big="NGGAK LICIN" />
      <Title t={t} a={B.a2} b={B.a3} small="2. Air diam ninggalin" big="KERAK & LUMUT" size={100} />
      <Title t={t} a={B.a3} b={B.dua} small="3. Air nyerep lewat" big="SELA KERAMIK" size={104} />
      <Title t={t} a={B.twist} b={B.tes} small="Kalau kelihatan miring," big="KEBANYAKAN" />
      <Title t={t} a={B.tes} b={48.3} small="Tes pakai" big="KELERENG" />
      <Title t={t} a={48.3} b={B.tanya} small="Lagi pasang keramik?" big="TES DULU" bigColor={K.sage} />

      {/* label & panel */}
      <Callout from={drainPt} to={[Math.min(820, drainPt[0] + 110), Math.min(1290, drainPt[1] + 150)]} label="Lubang buang" p={r(t, 5.0, 5.8) * (1 - r(t, 7.6, 8.0))} />
      <SideGuide hi={hi} lo={lo} p={r(t, 9.0, 10.6, Easing.linear) * (1 - r(t, 14.2, 14.6))} />
      {t > 10.9 && t < B.a1 && <StatPanel rows={[{icon: 'penggaris', to: 2, pre: '± ', suf: ' cm', label: 'turun tiap 1 meter (perkiraan)'}]} start={Math.round(10.95 * FPS)} y={1140} out={Math.round(14.4 * FPS)} />}
      {(() => { const pp = P([pud1.x, 0, pud1.z]); return <Callout from={pp} to={[pp[0] - 60, pp[1] + 300]} label="Air ngalir" sub="ke lubang buang" p={r(t, 16.0, 16.8) * (1 - r(t, 18.9, 19.3))} />; })()}
      {(() => { const pp = P([-0.72, 0, -0.5]); return t > B.a2 && t < B.a3 && <>
        <Callout from={pp} to={[pp[0] + 120, pp[1] + 360]} label="Genangan diam" sub="pojok yang rata" p={r(t, 20.6, 21.3) * (1 - r(t, 23.8, 24.2))} />
      </>; })()}
      {(() => { const on = t > B.a3 && t < B.dua ? 1 - r(t, 30.5, 30.85) : 0; if (on <= 0) return null;
        const cl = (p: [number, number], dx: number, dy: number): [number, number] => [Math.max(40, Math.min(760, p[0] + dx)), Math.max(720, Math.min(1300, p[1] + dy))];
        const lift = 0.32 * r(t, 24.5, 25.6, Easing.out(Easing.cubic));
        const pT = Q([-0.4, POT.tTH + lift, 0.2]), pG = Q([0, POT.tTH / 2 + lift, 0.35]), pA = Q([0.45, -POT.aTH / 2, 0.35]), pC = Q([-0.45, -POT.aTH - POT.cTH / 2 - 0.22, 0.35]);
        return <>
          <Callout from={pT} to={cl(pT, -40, -150)} label="Keramik" sub="kedap air" p={r(t, 25.4, 26.1) * on} />
          <Callout from={pG} to={cl(pG, 160, -170)} label="Sela keramik" sub="berpori, tembus air" p={r(t, 26.4, 27.2) * on} />
          <Callout from={pA} to={cl(pA, 40, 200)} label="Adukan semen" sub="ikut basah" p={r(t, 28.4, 29.2) * on} />
          <Callout from={pC} to={cl(pC, -40, 180)} label="Cor lantai" p={r(t, 28.8, 29.6) * on} />
        </>; })()}
      <Mark x={drainPt[0] + 150} y={drainPt[1] - 200} p={r(t, 44.6, 45.0) * (1 - r(t, 45.8, 46.0))} />
      <Mark ok x={drainPt[0] + 20} y={drainPt[1] - 190} p={r(t, 49.7, 50.1) * (1 - r(t, 50.9, 51.2))} />
      {t > B.tes && t < 48.6 && <Callout from={startPt} to={[Math.max(60, startPt[0] - 160), startPt[1] + 200]} label="Taruh di sini" p={r(t, 46.5, 47.1) * (1 - r(t, 48.2, 48.6))} />}

      {/* dua pendapat: cincin → layar koral */}
      <FocusRing x={540} y={1000} r={150} start={Math.round(30.1 * FPS)} flood={flood} floodOut={floodOut} />
      {pbIn > 0 && <AbsoluteFill style={{opacity: pbIn}}>
        <div style={{position: 'absolute', left: 60, right: 60, top: 640, textAlign: 'center', fontFamily: 'Playfair Display', fontWeight: 900, color: '#fff', fontSize: 104, lineHeight: 1.02, letterSpacing: -2, textShadow: '0 8px 0 rgba(0,0,0,0.16)'}}>
          <div style={{opacity: quote(30.9, 37.9), transform: `translateY(${(1 - quote(30.9, 37.9)) * 30}px)`}}>“Miring = tukang nggak becus.”</div>
          <div style={{marginTop: 40, opacity: quote(34.1, 37.9), transform: `translateY(${(1 - quote(34.1, 37.9)) * 30}px)`}}>“Semua lantai harus miring.”</div>
          <div style={{marginTop: 60, fontStyle: 'italic', color: INK, opacity: quote(36.5, 37.9)}}>Dua-duanya setengah benar.</div>
        </div>
        <Grain o={0.12} id="gpb6" />
      </AbsoluteFill>}
      {t > B.split - 0.2 && t < B.twist && <SplitCards t={t} />}

      {/* ajak komentar + follow */}
      <CommentBubble word="lari ke mana?" start={Math.round(51.2 * FPS)} y={560} out={Math.round(55.6 * FPS)} />
      <FollowButton start={Math.round(52.8 * FPS)} click={Math.round(53.9 * FPS)} y={1250} />
      <Captions ms={t * 1000} />

      <Ornament cx={1030} cy={150} size={360} start={0} accent={accent} />
      <Ornament cx={40} cy={1800} size={360} start={6} accent={accent} />
      <Grain o={0.05} id="g6" />

      <Audio src={staticFile('v06/vo.mp3')} />
      <Audio src={staticFile('sfx/ambient.wav')} volume={0.1} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
