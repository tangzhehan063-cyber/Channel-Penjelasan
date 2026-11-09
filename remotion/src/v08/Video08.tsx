// Video #8 "Bunyi Tek di Atap Tengah Malam Bukan Hantu" (Bukan Hantu #01). Gaya A editorial 3D + sistem gabungan.
// Template dari v07; timing dari timestamp kata VO take 2 (public/v08/words.json).
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import * as THREE from 'three';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Env, Ghost, Callout, PALETTE} from '../pengetahuan/Scene';
import {Grain, TikTokBox} from '../aset/Aset';
import {K, PaperPlus, Kicker, CommentBubble, FollowButton, Ornament} from '../aset/Gabung';
import {RoofCut, House} from './Rumah';
import words from '../../public/v08/words.json';

export const FPS = 30;
export const V08_END = 52.2;
export const V08_FRAMES = Math.ceil(V08_END * FPS);
const FOV = 34, ASPECT = 1080 / 1920;
const INK = PALETTE.ink, CORAL = '#ef7663', BLUE = '#5d8fd6', NAVY = '#1b2640';

const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
type V3 = [number, number, number];
type Key = {t: number; pos: V3; look: V3};
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
function camAt(keys: Key[], t: number): Key {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) { const k = ease((t - a.t) / (b.t - a.t)); return {t, pos: lerp3(a.pos, b.pos, k), look: lerp3(a.look, b.look, k)}; }
  }
  return keys[keys.length - 1];
}
function proj(cam: Key, p: V3): [number, number] {
  const c = new THREE.PerspectiveCamera(FOV, ASPECT, 0.1, 100);
  c.position.set(...cam.pos); c.lookAt(...cam.look); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = new THREE.Vector3(...p).project(c);
  return [(v.x + 1) * 540, (1 - v.y) * 960];
}

// ---------- beat (detik dari timestamp VO) ----------
const B = {hook: 0, siang: 3.6, panjang: 7.45, kerut: 9.62, enam: 12.25, sekrup: 15.95, ramai: 22.65, payoff: 26.98, beda: 31.78, bukti: 36.98, share: 43.55, tanya: 46.98, follow: 49.22, end: V08_END};

// ---------- kamera per adegan ----------
const CAM_HOUSE: Key[] = [{t: 0, pos: [3.8, 3.4, 13.4], look: [-0.3, 1.7, 0]}, {t: 3.7, pos: [2.8, 3.1, 12.2], look: [-0.3, 1.7, 0]}];
const CAM_ROOF: Key[] = [{t: 3.4, pos: [1.2, 3.0, 6.4], look: [0, -0.1, 0]}, {t: 7.4, pos: [0.4, 2.2, 5.2], look: [0, -0.1, 0]}, {t: 12.2, pos: [0.0, 1.9, 5.0], look: [0, -0.1, 0]}, {t: 16.0, pos: [-0.6, 1.4, 4.2], look: [0.6, -0.1, 0]}];
const CAM_SNAP: Key[] = [{t: 15.8, pos: [2.4, 1.5, 3.6], look: [0.1, -0.1, 0]}, {t: 22.8, pos: [1.7, 1.1, 2.8], look: [0.1, -0.1, 0]}];
const CAM_PAY: Key[] = [{t: 26.8, pos: [-3.8, 3.0, 12.4], look: [0, 0.8, 0]}, {t: 31.9, pos: [-2.8, 2.6, 11.2], look: [0, 0.85, 0]}];
const CAM_DAY: Key[] = [{t: 36.8, pos: [3.8, 3.6, 13.6], look: [-0.3, 2.1, 0]}, {t: 43.6, pos: [3.0, 3.3, 12.6], look: [-0.3, 2.1, 0]}];
const CAM_END: Key[] = [{t: 43.4, pos: [-3.4, 3.0, 13.0], look: [0, 0.7, 0]}, {t: 52.2, pos: [-2.6, 2.7, 12.0], look: [0, 0.75, 0]}];

// ---------- komponen ----------
const Rig: React.FC<{k: Key}> = ({k}) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  cam.position.set(...k.pos); cam.fov = FOV; cam.updateProjectionMatrix(); cam.lookAt(...k.look);
  return null;
};
const Lights: React.FC<{night?: number}> = ({night = 0}) => (<><Env /><ambientLight intensity={0.18} /><directionalLight position={[4, 6, 5]} intensity={3.0 - 1.4 * night} color={night > 0.5 ? '#cfe0ff' : '#ffffff'} /><directionalLight position={[-4, 1, 3]} intensity={0.45} color="#ffe2da" /></>);
const Canvas3D: React.FC<{k: Key; night?: number; children: React.ReactNode}> = ({k, night, children}) => (
  <ThreeCanvas width={1080} height={1920} camera={{position: k.pos, fov: FOV}} gl={{alpha: true, antialias: true}}>
    <Lights night={night} /><Rig k={k} />{children}
  </ThreeCanvas>
);
const OV = 8;
const Seg: React.FC<{a: number; b: number; f: number; first?: boolean; children: React.ReactNode}> = ({a, b, f, first, children}) => {
  const fa = Math.max(0, Math.round(a * FPS) - (first ? 0 : OV)), fb = Math.round(b * FPS) + OV;
  const o = interpolate(f, [fa, fa + 2 * OV, fb - 2 * OV, fb], [first ? 1 : 0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Sequence from={fa} durationInFrames={fb - fa} layout="none"><AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill></Sequence>;
};

const Title: React.FC<{t: number; a: number; b: number; small: string; big: string; bigColor?: string; size?: number; top?: number}> = ({t, a, b, small, big, bigColor = CORAL, size = 112, top = 450}) => {
  const i = r(t, a, a + 0.45, Easing.out(Easing.cubic)), o = 1 - r(t, b - 0.3, b);
  if (i * o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 60, top, maxWidth: 960, padding: '20px 30px 24px', borderRadius: 26, background: 'rgba(250,249,246,0.95)', boxShadow: '0 12px 40px rgba(28,28,30,0.18)', fontFamily: 'Inter', color: INK, opacity: i * o, transform: `translateY(${(1 - i) * 26}px)`}}>
      <div style={{fontSize: 50, fontWeight: 700, letterSpacing: -1}}>{small}</div>
      <div style={{whiteSpace: 'nowrap', fontSize: size, fontWeight: 900, letterSpacing: -2, lineHeight: 1.0, color: bigColor, marginTop: 6}}>{big}</div>
    </div>
  );
};

// subtitle: angka kata → numeral
const NUM: Record<string, string> = {enam: '6', dua: '2'};
const caps: Caption[] = (() => {
  const ws = (words as {words: {word: string; start: number; end: number}[]}).words;
  return ws.map((w, i) => {
    const txt = NUM[w.word] ?? w.word;
    return {text: (i ? ' ' : '') + txt, startMs: w.start * 1000, endMs: w.end * 1000, timestampMs: w.start * 1000, confidence: 1};
  });
})();
const {pages} = createTikTokStyleCaptions({captions: caps, combineTokensWithinMilliseconds: 950});
const Captions: React.FC<{ms: number}> = ({ms}) => {
  const pg = pages.find((p, i) => ms >= p.startMs && ms < (pages[i + 1]?.startMs ?? p.startMs + p.durationMs + 400));
  if (!pg) return null;
  const k = r(ms / 1000, pg.startMs / 1000, pg.startMs / 1000 + 0.15);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1400, textAlign: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: 60, letterSpacing: -0.8, lineHeight: 1.15, color: INK, opacity: k, transform: `translateY(${(1 - k) * 10}px)`}}>
      <span style={{display: 'inline-block', padding: '12px 28px 16px', borderRadius: 22, background: 'rgba(250,249,246,0.95)', boxShadow: '0 10px 30px rgba(28,28,30,0.18)'}}>
        {pg.tokens.map((tk, i) => <span key={i} style={{color: ms >= tk.fromMs && ms < tk.toMs + 120 ? CORAL : INK}}>{tk.text}</span>)}
      </span>
    </div>
  );
};

const Chip: React.FC<{x: number; y: number; p: number; text: string; color?: string; size?: number}> = ({x, y, p, text, color = INK, size = 40}) => {
  if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * p})`, opacity: p, padding: '10px 22px', borderRadius: 16, background: 'rgba(250,249,246,0.97)', border: `4px solid ${color}`, fontFamily: 'Inter', fontWeight: 800, fontSize: size, color, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(28,28,30,0.18)'}}>{text}</div>;
};

/* gelembung bunyi "TEK!" berbentuk ledakan kecil */
const TekBurst: React.FC<{x: number; y: number; p: number; size?: number; color?: string}> = ({x, y, p, size = 1, color = CORAL}) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.35, 1], [0.2, 1.15, 1]) * size, o = Math.min(1, p * 3);
  const pts = Array.from({length: 16}, (_, i) => { const a = (i / 16) * Math.PI * 2, rr = i % 2 ? 120 : 175; return `${Math.cos(a) * rr},${Math.sin(a) * rr * 0.78}`; }).join(' ');
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(-6deg)`, opacity: o}}>
      <svg width="400" height="320" style={{position: 'absolute', left: -200, top: -160, overflow: 'visible'}}>
        <polygon points={pts} transform="translate(200 160)" fill="#fff" stroke={INK} strokeWidth="10" strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', left: -200, top: -70, width: 400, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontStyle: 'italic', fontSize: 120, color, letterSpacing: -4, lineHeight: 1}}>TEK!</div>
    </div>
  );
};

/* cap stempel miring "BUKAN HANTU" */
const Stamp: React.FC<{p: number; text: string; y?: number}> = ({p, text, y = 760}) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.5, 1], [2.2, 0.94, 1]), o = Math.min(1, p * 2.5);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{transform: `rotate(-9deg) scale(${s})`, padding: '18px 44px', border: `12px solid ${CORAL}`, borderRadius: 24, color: CORAL, background: 'rgba(250,249,246,0.92)', fontFamily: 'Inter', fontWeight: 900, fontSize: 108, letterSpacing: -2, lineHeight: 1, whiteSpace: 'nowrap', boxShadow: '0 16px 40px rgba(0,0,0,0.25)'}}>{text}</div>
    </div>
  );
};

/* termometer kertas */
const Thermo: React.FC<{x: number; y: number; level: number; p: number; label: string; color: string}> = ({x, y, level, p, label, color}) => {
  if (p <= 0) return null;
  const h = 380, fill = h * Math.max(0.05, Math.min(1, level));
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
      <svg width="140" height="520" style={{overflow: 'visible'}}>
        <rect x="40" y="10" width="60" height={h + 40} rx="30" fill="#fbfaf8" stroke={INK} strokeWidth="8" />
        <rect x="56" y={10 + 20 + (h - fill)} width="28" height={fill + 30} rx="14" fill={color} />
        <circle cx="70" cy={h + 70} r="52" fill={color} stroke={INK} strokeWidth="8" />
      </svg>
      <div style={{position: 'absolute', left: 140, top: 10 + (h - fill), padding: '8px 18px', borderRadius: 14, background: 'rgba(250,249,246,0.97)', border: `4px solid ${color}`, fontFamily: 'Inter', fontWeight: 900, fontSize: 52, color, whiteSpace: 'nowrap'}}>{label}</div>
    </div>
  );
};

/* panah dua arah (memanjang) atau ke dalam (mengkerut) */
const Arrows: React.FC<{y: number; p: number; out: boolean; color: string; span?: number}> = ({y, p, out, color, span = 360}) => {
  if (p <= 0) return null;
  const d = out ? 40 * p : -40 * p;
  const head = (x: number, dir: number) => `M${x} ${y} l${-dir * 34} -28 M${x} ${y} l${-dir * 34} 28`;
  const xl = 540 - span - d, xr = 540 + span + d;
  return (
    <svg width="1080" height="1920" style={{position: 'absolute', opacity: Math.min(1, p * 2)}}>
      <line x1={540 - 120} y1={y} x2={xl} y2={y} stroke={color} strokeWidth="14" strokeLinecap="round" />
      <line x1={540 + 120} y1={y} x2={xr} y2={y} stroke={color} strokeWidth="14" strokeLinecap="round" />
      {out ? <><path d={head(xl, -1)} stroke={color} strokeWidth="14" strokeLinecap="round" fill="none" /><path d={head(xr, 1)} stroke={color} strokeWidth="14" strokeLinecap="round" fill="none" /></>
        : <><path d={head(540 - 120, 1)} stroke={color} strokeWidth="14" strokeLinecap="round" fill="none" /><path d={head(540 + 120, -1)} stroke={color} strokeWidth="14" strokeLinecap="round" fill="none" /></>}
    </svg>
  );
};

/* matahari, bulan, awan (2D) */
const Sun: React.FC<{x: number; y: number; p: number; dim?: number}> = ({x, y, p, dim = 0}) => p > 0 ? (
  <svg width="1080" height="1920" style={{position: 'absolute', opacity: p * (1 - 0.55 * dim)}}>
    <g transform={`translate(${x} ${y})`}>
      {Array.from({length: 12}, (_, i) => <line key={i} x1="0" y1="-120" x2="0" y2="-165" stroke="#f2b13c" strokeWidth="14" strokeLinecap="round" transform={`rotate(${i * 30})`} />)}
      <circle r="92" fill="#f6c453" stroke={INK} strokeWidth="9" />
    </g>
  </svg>) : null;
const Moon: React.FC<{x: number; y: number; p: number}> = ({x, y, p}) => p > 0 ? (
  <svg width="1080" height="1920" style={{position: 'absolute', opacity: p}}>
    <path d={`M${x} ${y - 80} a80 80 0 1 0 70 118 a64 64 0 1 1 -70 -118 z`} fill="#f4ecd2" stroke={INK} strokeWidth="8" />
    {[[x - 300, y + 40], [x - 520, y - 40], [x + 120, y + 160], [x - 160, y + 240]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={6} fill="#f4ecd2" />)}
  </svg>) : null;
const Cloud: React.FC<{x: number; y: number; p: number}> = ({x, y, p}) => p > 0 ? (
  <svg width="1080" height="1920" style={{position: 'absolute', opacity: p}}>
    <g transform={`translate(${x} ${y})`}>
      <path d="M-180 40 a70 70 0 0 1 40 -120 a95 95 0 0 1 170 -20 a80 80 0 0 1 150 70 a60 60 0 0 1 -10 110 z" fill="#ffffff" stroke={INK} strokeWidth="9" strokeLinejoin="round" />
    </g>
  </svg>) : null;

/* siang ramai vs malam sepi: dua panel */
const NoisePanels: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 22.75, 23.2, Easing.out(Easing.cubic)), b = r(t, 24.6, 25.05, Easing.out(Easing.cubic)), o = 1 - r(t, 26.7, 27.05);
  const noise = ['brrrm', 'tin tin!', 'TV', 'ngobrol', 'kipas', 'ayam'];
  return (
    <div style={{position: 'absolute', inset: 0, opacity: o}}>
      <div style={{position: 'absolute', left: 60, right: 60, top: 540, height: 420, borderRadius: 30, background: '#fff6e2', border: `6px solid ${INK}`, opacity: a, transform: `translateY(${(1 - a) * 40}px)`, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 34, top: 24, fontFamily: 'IBM Plex Mono', fontWeight: 500, fontSize: 40, color: INK}}>SIANG</div>
        {noise.map((n, i) => { const k = r(t, 23.0 + i * 0.12, 23.3 + i * 0.12, Easing.out(Easing.back(2)));
          return <div key={i} style={{position: 'absolute', left: 60 + (i % 3) * 300, top: 100 + Math.floor(i / 3) * 105 + (i % 2) * 14, transform: `scale(${k}) rotate(${(i % 2 ? 1 : -1) * 6}deg)`, padding: '8px 18px', borderRadius: 14, background: CORAL, color: '#fff', fontFamily: 'Inter', fontWeight: 900, fontSize: 46}}>{n}</div>; })}
        <div style={{position: 'absolute', left: 34, bottom: 20, fontFamily: 'Inter', fontWeight: 800, fontSize: 40, color: INK}}>tek? nggak kedengeran</div>
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 1000, height: 380, borderRadius: 30, background: NAVY, border: `6px solid ${INK}`, opacity: b, transform: `translateY(${(1 - b) * 40}px)`}}>
        <div style={{position: 'absolute', left: 34, top: 24, fontFamily: 'IBM Plex Mono', fontWeight: 500, fontSize: 40, color: '#f4ecd2'}}>MALAM</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontStyle: 'italic', fontSize: 130, color: '#fff', transform: `scale(${r(t, 25.9, 26.15, Easing.out(Easing.back(2.5)))})`}}>tek!</div>
      </div>
    </div>
  );
};

/* plafon dipotong: jejak hewan berpindah vs satu titik "tek" diam */
const Plafon: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 31.9, 32.3), o = 1 - r(t, 36.6, 36.95);
  const steps = 8, go = r(t, 32.3, 34.2, Easing.linear);
  return (
    <svg width="1080" height="1920" style={{position: 'absolute', opacity: a * o}}>
      <path d="M80 1060 L540 760 L1000 1060 Z" fill="#f5efe3" stroke={INK} strokeWidth="10" strokeLinejoin="round" />
      <rect x="80" y="1060" width="920" height="26" fill="#d8cbb4" stroke={INK} strokeWidth="8" />
      <text x="540" y="1150" textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight={500} fontSize="36" fill={INK}>ruang di atas plafon</text>
      {Array.from({length: steps}, (_, i) => {
        const k = i / (steps - 1); if (go < k) return null;
        const x = 220 + k * 640, y = 1030 - (i % 2) * 22;
        return <g key={i} transform={`translate(${x} ${y})`}><ellipse rx="16" ry="11" fill={CORAL} /><circle cx="-14" cy="-16" r="5" fill={CORAL} /><circle cx="0" cy="-20" r="5" fill={CORAL} /><circle cx="14" cy="-16" r="5" fill={CORAL} /></g>;
      })}
    </svg>
  );
};

const Bookmark: React.FC<{p: number}> = ({p}) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.6, 1], [0.3, 1.12, 1]);
  return (
    <svg width="1080" height="1920" style={{position: 'absolute'}}>
      <g transform={`translate(540 1010) scale(${s})`} opacity={Math.min(1, p * 2)}>
        <path d="M-90 -130 H90 V140 L0 80 L-90 140 Z" fill={K.sage} stroke={INK} strokeWidth="9" strokeLinejoin="round" />
        <path d="M-34 -10 L-8 16 L38 -36" fill="none" stroke="#fff" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

const SFX: [string, number, number][] = [
  ['knock', 0.5, 0.7], ['pop', 2.3, 0.5], ['knock', 2.35, 0.4],
  ['whoosh', 3.6, 0.3], ['riser', 4.6, 0.25], ['tick', 6.4, 0.45], ['pop', 6.8, 0.4], ['whoosh', 7.6, 0.25], ['crackle', 8.5, 0.25],
  ['whoosh', 9.7, 0.35], ['tick', 10.8, 0.4], ['tick', 11.2, 0.4], ['tick', 13.0, 0.4], ['pop', 14.7, 0.45],
  ['whoosh', 16.0, 0.3], ['riser', 17.6, 0.3], ['buzz', 18.6, 0.2], ['knock', 20.56, 0.9], ['pop', 21.4, 0.4],
  ['whoosh', 22.7, 0.3], ['pop', 23.1, 0.3], ['pop', 23.4, 0.3], ['pop', 23.7, 0.3], ['whoosh', 24.6, 0.25], ['knock', 25.95, 0.7],
  ['whoosh', 27.0, 0.3], ['chime', 29.5, 0.45],
  ['whoosh', 31.85, 0.3], ['tick', 32.4, 0.35], ['tick', 32.7, 0.35], ['tick', 33.0, 0.35], ['tick', 33.3, 0.35], ['tick', 33.6, 0.35], ['pop', 35.5, 0.4],
  ['whoosh', 37.0, 0.3], ['flow', 39.5, 0.25], ['knock', 42.5, 0.6],
  ['whoosh', 43.6, 0.3], ['pop', 45.3, 0.5],
  ['pop', 47.1, 0.4], ['chime', 50.2, 0.4],
];

export const Video08: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const chH = camAt(CAM_HOUSE, t), cr = camAt(CAM_ROOF, t), cs = camAt(CAM_SNAP, t), cp = camAt(CAM_PAY, t), cd = camAt(CAM_DAY, t), ce = camAt(CAM_END, t);

  // malam: 0–3.6, 9.6–22.6 (mengkerut & sekrup), 24.6–31.8 (panel malam, payoff)
  const night = Math.max(1 - r(t, 3.4, 3.9), r(t, 9.6, 10.2) * (1 - r(t, 22.55, 22.9)), r(t, 26.8, 27.2) * (1 - r(t, 31.6, 32.0)));
  // panas seng: naik di siang, turun jadi dingin di malam
  const heat = r(t, 4.4, 6.8) - 1.8 * r(t, 9.7, 11.3);
  const stretch = 1 + 0.06 * r(t, 7.6, 8.9) - 0.12 * r(t, 10.6, 11.8);
  const shake = r(t, 17.6, 20.4, Easing.in(Easing.quad)) * (t < 20.56 ? 1 : 0);
  const slip = t < 20.56 ? 0 : -0.07 * r(t, 20.56, 20.64, Easing.out(Easing.cubic));
  const glow = 1 - r(t, 3.4, 3.8);
  const coral = r(t, 15.85, 16.3) * (1 - r(t, 22.5, 22.85));
  const cloudX = interpolate(t, [38.6, 41.6], [-260, 1340], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cover = Math.max(0, 1 - Math.abs(cloudX - 800) / 360);
  const dayHeat = 0.85 - 0.9 * r(t, 40.2, 41.6);

  const roofTop = proj(chH, [0, 2.45, 0.3]);
  const screwPt = proj(cs, [0.055, 0.07, 0]);

  return (
    <AbsoluteFill>
      <PaperPlus />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${NAVY} 0%, #2b3a5e 100%)`, opacity: 0.94 * night}} />
      {t >= B.ramai && t < B.payoff && <Ghost lines={['Malam', 'Sepi']} />}
      {t >= B.beda && t < B.bukti && <Ghost lines={['Beda', 'Cerita']} />}

      {/* jangkar atas */}
      <Kicker text="BUKAN HANTU · #01" y={292} start={0} />
      <TikTokBox text="Bunyi apa itu?" p={r(t, 0.15, 0.8, Easing.linear)} y={338} size={40} />

      <Moon x={850} y={700} p={night * (t < 22 || t > 27 ? 1 : 0)} />
      <Sun x={850} y={640} p={r(t, 3.7, 4.2) * (1 - r(t, 9.4, 9.8))} />
      <Sun x={800} y={860} p={r(t, 37.0, 37.5) * (1 - r(t, 43.3, 43.6))} dim={cover} />
      <Cloud x={cloudX} y={830} p={t > 38.5 && t < 41.8 ? 1 : 0} />

      {/* ---------- 3D ---------- */}
      <Seg a={0} b={B.siang} f={f} first><Canvas3D k={chH} night={1}><House heat={-0.6} night={1} glow={glow} /></Canvas3D></Seg>
      <Seg a={B.siang} b={B.sekrup} f={f}><Canvas3D k={cr} night={night}><RoofCut heat={heat} stretch={stretch} t={t} /></Canvas3D></Seg>
      {coral > 0 && <AbsoluteFill style={{background: `radial-gradient(110% 80% at 50% 35%, ${CORAL} 0%, #e2563f 100%)`, clipPath: `circle(${coral * 150}% at 50% 50%)`}}><Grain o={0.12} id="gpb8" /></AbsoluteFill>}
      <Seg a={B.sekrup} b={B.ramai} f={f}><Canvas3D k={cs}><RoofCut heat={-0.5} shake={shake} slip={slip} t={t} /></Canvas3D></Seg>
      <Seg a={B.payoff} b={B.beda} f={f}><Canvas3D k={cp} night={1}><House heat={-1} night={1} glow={1} /></Canvas3D></Seg>
      <Seg a={B.bukti} b={B.share} f={f}><Canvas3D k={cd}><House heat={dayHeat} /></Canvas3D></Seg>
      <Seg a={B.share} b={B.end} f={f}><Canvas3D k={ce}><group rotation={[0, 0.05 * (t - 43.5), 0]}><House heat={0} /></group></Canvas3D></Seg>

      {/* ---------- hook ---------- */}
      <TekBurst x={Math.min(800, roofTop[0] + 160)} y={Math.max(640, roofTop[1] - 120)} p={r(t, 0.45, 0.75, Easing.linear) * (1 - r(t, 2.0, 2.3))} size={0.9} />
      <Stamp p={r(t, 2.2, 2.55, Easing.out(Easing.cubic)) * (1 - r(t, 3.3, 3.6))} text="BUKAN HANTU" y={1060} />

      {/* ---------- judul ---------- */}
      <Title t={t} a={B.siang} b={B.panjang} small="Siang, atap seng" big="> 40 °C" size={140} />
      <Title t={t} a={B.panjang} b={B.kerut} small="Kena panas, besi" big="MEMANJANG" />
      <Title t={t} a={B.kerut} b={B.enam} small="Malam dingin, besi" big="MENGKERUT" bigColor={BLUE} />
      <Title t={t} a={B.enam} b={B.sekrup} small="Besi atap 6 meter" big="−2 MM" bigColor={BLUE} size={140} />
      <Title t={t} a={B.payoff + 0.4} b={B.beda} small="Bukan penunggu rumah," big="ATAPMU KEDINGINAN" size={84} />
      <Title t={t} a={B.beda} b={B.bukti} small="Pindah-pindah kayak jalan?" big="CEK TIKUS/MUSANG" size={84} />
      <Title t={t} a={B.bukti} b={B.share} small="Mau bukti? Dengar pas" big="KETUTUP AWAN" bigColor={K.sage} size={104} />
      <Title t={t} a={B.share} b={B.tanya} small="Takut bunyi atap?" big="PERLU TAHU INI" bigColor={K.sage} size={104} />

      {/* ---------- siang/malam: termometer & panah ---------- */}
      <Thermo x={70} y={820} level={0.15 + 0.7 * r(t, 4.4, 6.8)} p={r(t, 4.2, 4.6) * (1 - r(t, 7.2, 7.5))} label="43–53 °C" color={CORAL} />
      <Arrows y={1240} p={r(t, 7.6, 8.2) * (1 - r(t, 9.3, 9.6))} out color={CORAL} />
      <Arrows y={1240} p={r(t, 10.6, 11.2) * (1 - r(t, 12.0, 12.3))} out={false} color={BLUE} />
      <Callout from={[540, 1130]} to={[300, 1290]} label="6 m → ± 2 mm" sub="perkiraan, gerak dilebih-lebihkan" p={r(t, 13.0, 13.6) * (1 - r(t, 15.5, 15.85))} />

      {/* ---------- sekrup menahan → TEK ---------- */}
      <Chip x={540} y={700} p={r(t, 16.4, 16.8) * (1 - r(t, 20.3, 20.5))} text="sekrup nahan…" size={56} />
      <Chip x={screwPt[0] + 200} y={screwPt[1] - 230} p={r(t, 17.7, 18.0) * (1 - r(t, 18.5, 18.6))} text="ditahan" color={INK} size={50} />
      <Chip x={screwPt[0] - 160} y={screwPt[1] - 300} p={r(t, 18.6, 18.9) * (1 - r(t, 20.3, 20.5))} text="ditahan…" color={INK} size={50} />
      <TekBurst x={540} y={760} p={r(t, 20.52, 20.7, Easing.linear) * (1 - r(t, 22.2, 22.55))} size={1.25} color={CORAL} />
      <Chip x={540} y={1180} p={r(t, 21.3, 21.6) * (1 - r(t, 22.3, 22.6))} text="kayak jentik jari" size={54} color={CORAL} />

      {/* ---------- siang ramai / malam sepi ---------- */}
      {t > 22.6 && t < 27.1 && <NoisePanels t={t} />}

      {/* ---------- bedakan ---------- */}
      {t > 31.8 && t < 37 && <Plafon t={t} />}
      <Chip x={540} y={1290} p={r(t, 35.4, 35.7) * (1 - r(t, 36.6, 36.95))} text="tikus · musang" color={CORAL} size={50} />

      {/* ---------- bukti: awan ---------- */}
      <TekBurst x={380} y={1080} p={r(t, 42.45, 42.6, Easing.linear) * (1 - r(t, 43.2, 43.5))} size={0.7} />
      <Bookmark p={r(t, 45.2, 45.7) * (1 - r(t, 46.6, 46.95))} />

      {/* ---------- ajak komentar + follow ---------- */}
      <CommentBubble word="jam berapa?" start={Math.round(47.0 * FPS)} y={600} out={Math.round(51.8 * FPS)} />
      <FollowButton start={Math.round(49.2 * FPS)} click={Math.round(50.3 * FPS)} y={1250} />
      <Captions ms={t * 1000} />

      <Ornament cx={1030} cy={150} size={360} start={0} accent={coral} />
      <Ornament cx={40} cy={1800} size={360} start={6} accent={coral} />
      <Grain o={0.05} id="g8" />

      <Audio src={staticFile('v08/vo.mp3')} />
      <Audio src={staticFile('v08/sfx/ambient.wav')} volume={0.1} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`v08/sfx/${n}.wav`)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
