// Video #18 "Rumah hadap barat itu panas?" Gaya #8/#9: kamera PERSPEKTIF 3D dekat, objek hero memenuhi bingkai, outline tinta, latar bergantian (siang / malam navy / pemutus koral).
// Palet `terakota`, TANPA Ornament. VO ElevenLabs Riri Rida (flow 0Rn9dQNRXEMcHS1Ng1Cs), timestamp public/v18/words.json (align_teks). Naskah: naskah/video-18-rumah-hadap-barat.md
// Warna tambahan sengaja: kuning matahari (benda bercahaya), navy malam (suasana).
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {useMemo} from 'react';
import * as THREE from 'three';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Env} from '../pengetahuan/Scene';
import {Grain, TikTokBox, PatternBreak, C} from '../aset/Aset';
import {Kicker, FollowButton, CommentBubble} from '../aset/Gabung';
import {PALET} from '../aset/PaperPalet';
import {PaperPlus, Ornament} from '../aset/Gabung';
import {Box, M as M7} from '../v07/Atap';
import {House} from '../v08/Rumah';
import words from '../../public/v18/words.json';

const PNAME = 'krem' as 'krem'|'terakota'|'batu'|'mint'|'malam';
const PL = PALET[PNAME];
const EARTH = '#e4e2dd';
export const P18 = {coral: PL.accent, good: PL.good, hot: '#d9482b', sun: '#f0a830', ink: '#1c1c1e', wall: '#f3ead9', roof: PL.accent, earth: EARTH, green: '#4f8a4a', leaf: '#5fa055', trunk: '#6b4630', navy: '#1b2640'};
export const FPS = 30;
export const V18_END = 51.6;
export const V18_FRAMES = Math.ceil(V18_END * FPS);
const FOV = 34;
const CC_TOP = 1400, CORAL = P18.coral, INK = C.ink;
const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];

// ---------- beat (detik dari words.json) ----------
const B = {hook: 0, hook2: 1.55, takut: 3.8, pagi: 8.26, sore: 10.51, siang: 14.75, simpan: 18.47, payoff: 23.36, denah: 25.6, utara: 28.39, solusi: 30.97, pohon: 32.39, teritis: 36.54, aksi: 39.2, kosong: 42.6, gema: 46.38, follow: 49.19, end: V18_END};

// ---------- kamera perspektif (gaya #8/#9) ----------
type Key = {t: number; pos: V3; look: V3; fov?: number};
const lerp3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
function camAt(keys: Key[], t: number): Key {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) { const k = ease((t - a.t) / (b.t - a.t)); return {t, pos: lerp3(a.pos, b.pos, k), look: lerp3(a.look, b.look, k), fov: a.fov}; }
  }
  return keys[keys.length - 1];
}
const CAM_HOOK: Key[] = [{t: 0, pos: [0.3, 2.1, 12.8], look: [0, 1.7, 0]}, {t: 3.8, pos: [0.2, 2.0, 11.0], look: [0, 1.7, 0]}];
const CAM_TAKUT: Key[] = [{t: 3.8, pos: [0.3, 2.0, 15.0], look: [0, 3.0, 0]}, {t: 8.3, pos: [0.1, 2.0, 13.6], look: [0, 3.0, 0]}];
const CAM_PAGI: Key[] = [{t: 8.26, pos: [0.3, 1.9, 11.2], look: [0.1, 1.8, 0]}, {t: 14.7, pos: [0.45, 1.8, 10.0], look: [0.1, 1.7, 0]}, {t: 18.4, pos: [0.55, 1.8, 6.0], look: [0.4, 1.7, 0]}];
const CAM_SIMPAN: Key[] = [{t: 18.47, pos: [1.3, 1.6, 8.2], look: [1.0, 1.3, 0]}, {t: 23.3, pos: [1.6, 1.7, 7.0], look: [1.2, 1.3, 0]}];
const CAM_DENAH: Key[] = [{t: 25.6, pos: [0, 13.4, 1.4], look: [0, 0, 0]}, {t: 31.0, pos: [0, 11.4, 1.2], look: [0, 0, 0]}];
const CAM_SOLUSI: Key[] = [{t: 30.97, pos: [0.2, 1.9, 10.6], look: [0.1, 1.7, 0]}, {t: 39.2, pos: [0.3, 2.1, 11.8], look: [0.2, 1.8, 0]}];
const CAM_END: Key[] = [{t: 46.38, pos: [0.6, 2.2, 13.0], look: [0.4, 1.7, 0]}, {t: 51.6, pos: [0.9, 2.5, 14.8], look: [0.4, 1.7, 0]}];

const Rig: React.FC<{k: Key}> = ({k}) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  cam.position.set(...k.pos); cam.fov = k.fov ?? FOV; cam.updateProjectionMatrix(); cam.lookAt(...k.look);
  return null;
};
const Lights: React.FC<{night?: number}> = ({night = 0}) => (<><Env intensity={0.35} /><ambientLight intensity={0.35} /><directionalLight position={[-3, 6, 6]} intensity={2.6 - 1.4 * night} color={night > 0.5 ? '#cfe0ff' : '#fff1df'} /><directionalLight position={[4, 2, 3]} intensity={0.5} color="#ffd9c2" /></>);
export const Canvas3D: React.FC<{k: Key; night?: number; children: React.ReactNode}> = ({k, night, children}) => (
  <ThreeCanvas width={1080} height={1920} camera={{position: k.pos, fov: k.fov ?? FOV}} gl={{alpha: true, antialias: true}}>
    <Lights night={night} /><Rig k={k} />{children}
  </ThreeCanvas>
);
const OV = 8;
const Seg: React.FC<{a: number; b: number; f: number; first?: boolean; children: React.ReactNode}> = ({a, b, f, first, children}) => {
  const fa = Math.max(0, Math.round(a * FPS) - (first ? 0 : OV)), fb = Math.round(b * FPS) + OV;
  const o = interpolate(f, [fa, fa + 2 * OV, fb - 2 * OV, fb], [first ? 1 : 0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Sequence from={fa} durationInFrames={fb - fa} layout="none"><AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill></Sequence>;
};

// ---------- subtitle ----------
const caps: Caption[] = (words as {words: {word: string; start: number; end: number}[]}).words.map((w, i) => ({text: (i ? ' ' : '') + w.word, startMs: w.start * 1000, endMs: w.end * 1000, timestampMs: w.start * 1000, confidence: 1}));
const {pages} = createTikTokStyleCaptions({captions: caps, combineTokensWithinMilliseconds: 950});
const Captions: React.FC<{ms: number}> = ({ms}) => {
  const pg = pages.find((p, i) => ms >= p.startMs && ms < (pages[i + 1]?.startMs ?? p.startMs + p.durationMs + 400));
  if (!pg) return null;
  const k = r(ms / 1000, pg.startMs / 1000, pg.startMs / 1000 + 0.15);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: CC_TOP, textAlign: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: 60, letterSpacing: -0.8, lineHeight: 1.15, color: INK, opacity: k, transform: `translateY(${(1 - k) * 10}px)`}}>
      <span style={{display: 'inline-block', padding: '12px 28px 16px', borderRadius: 22, background: 'rgba(250,249,246,0.95)', boxShadow: '0 10px 30px rgba(28,28,30,0.18)'}}>
        {pg.tokens.map((tk, i) => <span key={i} style={{color: ms >= tk.fromMs && ms < tk.toMs + 120 ? CORAL : INK}}>{tk.text}</span>)}
      </span>
    </div>
  );
};

// ---------- teks layar ----------
const Title: React.FC<{t: number; a: number; b: number; small: string; big: string; bigAt?: number; color?: string; size?: number; top?: number}> = ({t, a, b, small, big, bigAt, color = CORAL, size = 104, top = 450}) => {
  const i = r(t, a, a + 0.45, Easing.out(Easing.cubic)), o = 1 - r(t, b - 0.3, b), j = bigAt === undefined ? 1 : r(t, bigAt, bigAt + 0.35, Easing.out(Easing.back(2)));
  if (i * o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 60, top, maxWidth: 960, padding: '20px 30px 24px', borderRadius: 26, background: 'rgba(250,249,246,0.95)', boxShadow: '0 12px 40px rgba(28,28,30,0.18)', fontFamily: 'Inter', color: INK, opacity: i * o, transform: `translateY(${(1 - i) * 26}px)`}}>
      <div style={{fontSize: 50, fontWeight: 700, letterSpacing: -1}}>{small}</div>
      <div style={{whiteSpace: 'nowrap', fontSize: size, fontWeight: 900, letterSpacing: -2, lineHeight: 1.0, color, marginTop: 6, opacity: j, transform: `scale(${0.85 + 0.15 * j})`, transformOrigin: 'left center'}}>{big}</div>
    </div>
  );
};
const Chip: React.FC<{x: number; y: number; p: number; text: string; color?: string; size?: number}> = ({x, y, p, text, color = INK, size = 40}) => {
  if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * p})`, opacity: p, padding: '10px 22px', borderRadius: 16, background: 'rgba(250,249,246,0.97)', border: `4px solid ${color}`, fontFamily: 'Inter', fontWeight: 800, fontSize: size, color, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(28,28,30,0.18)'}}>{text}</div>;
};
// label ala referensi R2: gelembung putih + panah tinta menunjuk ke objek
const Callout: React.FC<{x: number; y: number; ax: number; ay: number; p: number; text: string; color?: string}> = ({x, y, ax, ay, p, text, color = INK}) => {
  if (p <= 0) return null;
  const bx = x, by = y + 34, mx = (bx + ax) / 2 + (ax > bx ? 30 : -30), my = (by + ay) / 2 - 10;
  const ang = Math.atan2(ay - my, ax - mx), hx = Math.cos(ang), hy = Math.sin(ang);
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: p, overflow: 'visible', pointerEvents: 'none'}}>
        <path d={`M ${bx} ${by} Q ${mx} ${my} ${ax} ${ay}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" strokeDasharray={600} strokeDashoffset={(1 - p) * 600} />
        <path d={`M ${ax} ${ay} l ${-hx * 24 + hy * 14} ${-hy * 24 - hx * 14} M ${ax} ${ay} l ${-hx * 24 - hy * 14} ${-hy * 24 + hx * 14}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * p})`, opacity: p, padding: '12px 28px', borderRadius: 18, background: 'rgba(250,249,246,0.98)', border: `4px solid ${color}`, fontFamily: 'Inter', fontWeight: 800, fontSize: 42, color: INK, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(28,28,30,0.2)'}}>{text}</div>
    </>
  );
};
const Mark: React.FC<{x: number; y: number; ok: boolean; p: number; text: string}> = ({x, y, ok, p, text}) => p > 0 ? (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * p})`, opacity: p, display: 'flex', alignItems: 'center', gap: 16, padding: '12px 26px', borderRadius: 20, background: 'rgba(250,249,246,0.97)', border: `5px solid ${ok ? P18.good : CORAL}`, fontFamily: 'Inter', fontWeight: 800, fontSize: 46, color: INK, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(28,28,30,0.18)'}}>
    <span style={{color: ok ? P18.good : CORAL, fontSize: 54, fontWeight: 900}}>{ok ? '✓' : '✗'}</span>{text}
  </div>
) : null;

// ---------- objek 3D ----------
const phys = (color: string, o: Partial<THREE.MeshPhysicalMaterialParameters> = {}) => new THREE.MeshPhysicalMaterial({color, roughness: 0.6, clearcoat: 0.3, clearcoatRoughness: 0.35, ...o});
const cx3 = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), Math.max(0, Math.min(1, k)));
const MG = {slab: phys('#d2cec4', {roughness: 0.95, clearcoat: 0}), ground: phys(P18.earth, {roughness: 0.95, clearcoat: 0}), trunk: phys(P18.trunk), leaf: phys(P18.leaf), leaf2: phys(P18.green), sun: new THREE.MeshBasicMaterial({color: P18.sun}), hot: new THREE.MeshBasicMaterial({color: P18.hot}), roof: phys(P18.roof), post: phys('#6b4630'), white: phys('#fbfaf6'), glass: phys('#9ec7de'), green: phys(P18.green)};
export const Tanah3: React.FC<{night?: number}> = ({night = 0}) => {
  MG.ground.color.set(P18.earth).lerp(new THREE.Color('#2a3350'), night * 0.9);
  MG.slab.color.set('#d2cec4').lerp(new THREE.Color('#3a4566'), night * 0.9);
  return <><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.13, 6]} material={MG.ground}><planeGeometry args={[40, 40]} /></mesh><Box p={[0, -0.065, 0.3]} s={[9, 0.13, 8]} m={MG.slab} ink={0.04} /></>;
};
export const Sun3: React.FC<{p: V3; s: number; t: number}> = ({p, s, t}) => (
  <group position={p}>
    <mesh material={MG.sun}><sphereGeometry args={[s, 28, 20]} /></mesh>
    {Array.from({length: 12}).map((_, i) => { const a = (i / 12) * Math.PI * 2 + t * 0.15, rr = s * 1.55 + 0.04 * Math.sin(t * 4 + i); return <group key={i} position={[Math.cos(a) * rr, Math.sin(a) * rr, 0]} rotation={[0, 0, a]}><Box s={[s * 0.5, 0.045, 0.045]} m={MG.sun} ink={0} /></group>; })}
  </group>
);
export const Beam3: React.FC<{a: V3; b: V3; t: number; o?: number; n?: number}> = ({a, b, t, o = 1, n = 8}) => {
  if (o <= 0) return null;
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), ang = Math.atan2(dy, dx);
  return (
    <group>
      <group position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]} rotation={[0, 0, ang]}><mesh><boxGeometry args={[len, 0.1, 0.1]} /><meshBasicMaterial color={P18.sun} transparent opacity={0.3 * o} /></mesh></group>
      {Array.from({length: n}).map((_, i) => { const f = (t * 0.6 + i / n) % 1; return <mesh key={i} position={[lerp(a[0], b[0], f), lerp(a[1], b[1], f), lerp(a[2], b[2], f)]} material={MG.sun} scale={[0.09 * o, 0.05 * o, 0.05 * o]}><sphereGeometry args={[1, 10, 8]} /></mesh>; })}
    </group>
  );
};
// dinding bata besar, memanas (hot 0..1)
export const Wall3: React.FC<{p: V3; hot: number; t: number}> = ({p, hot, t}) => {
  const rows = 9, bh = 0.333, mats = useMemo(() => Array.from({length: rows * 5}, () => phys(P18.wall, {roughness: 0.9, clearcoat: 0})), []);
  const bricks: {x: number; y: number; w: number; i: number}[] = [];
  for (let row = 0; row < rows; row++) {
    const odd = row % 2 === 1;
    const xs: [number, number][] = odd ? [[-1.1375, 0.325], [-0.65, 0.65], [0, 0.65], [0.65, 0.65], [1.1375, 0.325]] : [[-0.975, 0.65], [-0.325, 0.65], [0.325, 0.65], [0.975, 0.65]];
    xs.forEach(([x, w], j) => bricks.push({x, y: bh / 2 + row * bh, w, i: row * 5 + j}));
  }
  return (
    <group position={p}>
      {bricks.map((b) => { const h = Math.max(0, Math.min(1, hot * (0.8 + 0.4 * hash(b.i)))); mats[b.i].color.copy(cx3(['#efdcc3', '#e6cfb2', '#f3e5d0', '#e2c6a6'][b.i % 4], P18.hot, h)); return <Box key={b.i} p={[b.x, b.y, 0]} s={[b.w - 0.035, bh - 0.035, 0.5]} m={mats[b.i]} ink={0.045} />; })}
      <Box p={[0, -0.04, 0.1]} s={[3.0, 0.08, 1.0]} m={MG.white} ink={0.03} />
      {hot > 0.05 && Array.from({length: 12}).map((_, i) => { const f = (t * 0.5 + hash(i) + i * 0.17) % 1; return <mesh key={i} position={[-1.2 + hash(i + 4) * 2.4, 0.4 + f * 2.8, 0.45]} material={MG.hot} scale={[0.07 * hot, 0.1 * hot, 0.07 * hot]}><sphereGeometry args={[1, 10, 8]} /></mesh>; })}
    </group>
  );
};
const Pohon3: React.FC<{p: V3; s: number; grow: number}> = ({p, s, grow}) => grow <= 0 ? null : (
  <group position={p} scale={s * (0.25 + 0.75 * grow)}>
    <mesh position={[0, 0.9, 0]} material={MG.trunk}><cylinderGeometry args={[0.16, 0.22, 1.8, 16]} /></mesh>
    {([[0, 2.3, 0, 0.95, 0], [-0.6, 1.95, 0.1, 0.66, 1], [0.6, 2.05, -0.1, 0.7, 1], [0.0, 2.85, 0, 0.55, 0]] as number[][]).map(([x, y, z, rr, m], i) => <mesh key={i} position={[x, y, z]} material={m ? MG.leaf2 : MG.leaf}><sphereGeometry args={[rr, 20, 16]} /></mesh>)}
  </group>
);
const Teritis3: React.FC<{p: V3; grow: number}> = ({p, grow}) => grow <= 0 ? null : (
  <group position={p} scale={[grow, 1, 1]}>
    <Box p={[-0.5, 0, 0.1]} s={[1.5, 0.1, 1.2]} m={MG.roof} ink={0.03} r={[0, 0, 0.14]} />
    <Box p={[-1.15, -0.62, 0.55]} s={[0.07, 1.25, 0.07]} m={MG.post} ink={0.02} />
  </group>
);
const Slab: React.FC<{x: number; c: string; w?: number}> = ({x, c, w = 0.55}) => { const m = useMemo(() => phys('#fff', {roughness: 0.8, clearcoat: 0}), []); m.color.set(c); return <Box p={[x, 1.2, 0]} s={[w, 2.4, 1.8]} m={m} ink={0.03} />; };
// ---------- hero 2D ----------
const Papan: React.FC<{t: number; p: number}> = ({t, p}) => p <= 0 ? null : (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: p}}>
    <div style={{position: 'absolute', left: 500, top: 1010, width: 80, height: 340, borderRadius: 14, background: '#6b4630', border: `5px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 150, top: 740, width: 780, height: 340, borderRadius: 34, background: '#faf9f6', border: `10px solid ${INK}`, boxShadow: '0 22px 50px rgba(28,28,30,0.25)', transform: `rotate(${Math.sin(t * 2.2) * 2.2 - 1}deg)`, transformOrigin: '50% 0%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 170, fontWeight: 900, letterSpacing: -4, color: CORAL, lineHeight: 1}}>DIJUAL</div>
      <div style={{fontSize: 68, fontWeight: 800, marginTop: 8}}>rumah hadap BARAT</div>
    </div>
  </div>
);
const Termometer: React.FC<{x: number; y: number; k: number}> = ({x, y, k}) => k <= 0 ? null : (
  <div style={{position: 'absolute', left: x, top: y, width: 70, height: 420, opacity: Math.min(1, k * 4)}}>
    <div style={{position: 'absolute', left: 14, top: 0, width: 42, height: 360, borderRadius: 21, background: '#faf9f6', border: `6px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 24, bottom: 62, width: 22, height: 40 + 270 * k, borderRadius: 11, background: P18.hot}} />
    <div style={{position: 'absolute', left: 0, bottom: 0, width: 70, height: 70, borderRadius: '50%', background: P18.hot, border: `6px solid ${INK}`}} />
  </div>
);
const HP: React.FC<{t: number; p: number}> = ({t, p}) => {
  if (p <= 0) return null;
  const k = r(t, 39.6, 40.8, Easing.out(Easing.back(1.8))), ang = lerp(-35, 90, k) + (k >= 1 ? Math.sin(t * 3) * 3 : 0);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: p}}>
      <div style={{position: 'absolute', left: 300, top: 735, width: 480, height: 640, borderRadius: 54, background: '#2a2a2d', border: `10px solid ${INK}`, boxShadow: '0 24px 56px rgba(28,28,30,0.3)'}} />
      <div style={{position: 'absolute', left: 322, top: 780, width: 436, height: 560, borderRadius: 34, background: '#faf9f6'}} />
      <div style={{position: 'absolute', left: 352, top: 850, width: 376, height: 376, borderRadius: '50%', border: `8px solid ${INK}`, background: '#fff'}} />
      {[['U', 540, 872], ['T', 704, 1038], ['S', 540, 1204], ['B', 376, 1038]].map(([l, x, y]) => <div key={String(l)} style={{position: 'absolute', left: Number(x) - 30, top: Number(y) - 30, width: 60, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 44, color: l === 'B' ? CORAL : INK}}>{l}</div>)}
      <div style={{position: 'absolute', left: 536, top: 1030, width: 8, height: 120, background: CORAL, borderRadius: 4, transformOrigin: '4px 8px', transform: `rotate(${ang}deg)`}} />
      <div style={{position: 'absolute', left: 520, top: 1022, width: 40, height: 40, borderRadius: '50%', background: INK}} />
      <div style={{position: 'absolute', left: 300, right: 300, top: 1262, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 46, color: CORAL, opacity: k}}>BARAT</div>
    </div>
  );
};

// ---------- SFX ----------
const SFX: [string, number, number][] = [
  ['tick', 0.5, 0.3], ['pop', 2.3, 0.4], ['whoosh', 3.75, 0.3], ['pop', 5.2, 0.4], ['pop', 6.4, 0.4],
  ['whoosh', 8.2, 0.3], ['pop', 10.55, 0.35], ['riser', 12.2, 0.2], ['pop', 15.3, 0.4],
  ['whoosh', 18.4, 0.3], ['pop', 19.6, 0.35], ['pop', 21.2, 0.35],
  ['crystal', 24.4, 0.3], ['chime', 24.9, 0.4],
  ['whoosh', 25.55, 0.3], ['pop', 27.0, 0.4], ['pop', 28.8, 0.4],
  ['whoosh', 30.9, 0.3], ['thud', 33.3, 0.35], ['thud', 36.9, 0.35],
  ['whoosh', 39.15, 0.3], ['ting', 41.0, 0.3], ['pop', 42.9, 0.4],
  ['whoosh', 46.3, 0.3], ['pop', 47.6, 0.4], ['chime', 50.3, 0.4],
];


// ---------- komposisi ----------
export const Video18: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, ms = t * 1000;
  const k1 = camAt(CAM_HOOK, t), k2 = camAt(CAM_TAKUT, t), k3 = camAt(CAM_PAGI, t), k4 = camAt(CAM_SIMPAN, t), k6 = camAt(CAM_DENAH, t), k7 = camAt(CAM_SOLUSI, t), k9 = camAt(CAM_END, t);
  const morning = t < B.sore - 0.15;
  const sunP: V3 = morning ? [lerp(-0.45, -0.4, r(t, 8.3, 10.4)), lerp(2.75, 2.5, r(t, 8.3, 10.4)), 0.8] : [lerp(-0.7, -0.6, r(t, 10.5, 14.7)), lerp(2.0, 1.45, r(t, 10.5, 14.7)), 0.8];
  const heat = r(t, 14.9, 17.6);
  const night = r(t, 18.2, 18.8) * (1 - r(t, 23.0, 23.4));
  const cyc = Math.floor(Math.max(0, t - 25.9) / 0.7) % 3;
  const doorXZ: V3 = t >= 28.3 ? [0, 0.18, -1.5] : cyc === 0 ? [0, 0.18, -1.5] : cyc === 1 ? [1.2, 0.18, 0] : [0, 0.18, 1.5];
  return (
    <AbsoluteFill>
      <PaperPlus />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${P18.navy} 0%, #2b3a5e 100%)`, opacity: 0.95 * night}} />

      <Ornament cx={1030} cy={150} size={360} start={0} accent={r(t, 23.45, 24.5) * (1 - r(t, 25.5, 25.9))} />
      <Ornament cx={40} cy={1800} size={360} start={6} accent={r(t, 23.45, 24.5) * (1 - r(t, 25.5, 25.9))} />

      {/* 1. hook: matahari sore besar, atap rumah memanas */}
      <Seg a={0} b={B.takut} f={f} first>
        <Canvas3D k={k1}><Tanah3 /><House heat={r(t, 1.4, 3.5) * 0.7} /><Sun3 p={[1.35, 2.5, -1.0]} s={0.4} t={t} /><Beam3 a={[1.1, 2.3, -0.4]} b={[0.5, 2.0, 0.4]} t={t} o={r(t, 0.6, 1.2)} n={6} /></Canvas3D>
        <Chip x={780} y={1180} p={r(t, 2.3, 2.7)} text="rumah panas?" color={P18.hot} size={44} />
      </Seg>
      {/* 2. orang jadi takut beli: papan DIJUAL besar */}
      <Seg a={B.takut} b={B.pagi} f={f}>
        <Canvas3D k={k2}><Tanah3 /><group position={[0.4, 0, -1]}><House heat={0.3} /></group></Canvas3D>
        <Papan t={t} p={r(t, B.takut + 0.1, B.takut + 0.5)} />
        <Chip x={200} y={1230} p={r(t, 5.2, 5.6)} text="panas?" color={P18.hot} size={48} />
        <Chip x={860} y={1290} p={r(t, 6.0, 6.4)} text="ragu beli" color={INK} size={48} />
      </Seg>
      {/* 3. pagi tinggi vs sore rendah: sinar menghantam dinding bata besar (dive) */}
      <Seg a={B.pagi} b={B.simpan} f={f}>
        <Canvas3D k={k3}>
          <Tanah3 /><Wall3 p={[0.55, 0, 0]} hot={heat} t={t} /><Sun3 p={sunP} s={morning ? 0.3 : 0.36} t={t} />
          <Beam3 a={[sunP[0] + 0.3, sunP[1] - 0.15, 0.7]} b={[morning ? 0.3 : -0.2, morning ? 0.4 : 1.55, 0.8]} t={t} n={9} />
        </Canvas3D>
        <Chip x={300} y={1040} p={r(t, B.pagi + 0.6, B.pagi + 1.0) * (1 - r(t, 10.3, 10.5))} text="pagi: tinggi" color="#b07a14" size={42} />
        <Chip x={300} y={1200} p={r(t, 11.2, 11.6)} text="sore: rendah" color={P18.hot} size={42} />
        <Termometer x={920} y={760} k={r(t, 15.4, 18.2)} />
        <Chip x={540} y={1290} p={r(t, 15.0, 15.4)} text="± jam 14.00" color={P18.hot} size={40} />
      </Seg>
      {/* 4. malam: dinding menyimpan panas, kamar hangat */}
      <Seg a={B.simpan} b={B.payoff} f={f}>
        <Canvas3D k={k4} night={1}>
          <Tanah3 night={1} />
          <Slab x={0.2} c="#d9482b" /><Slab x={0.78} c="#e88a4e" /><Slab x={1.36} c="#f2cfa8" />
          <Box p={[2.75, 0.6, 0]} s={[1.6, 1.2, 1.6]} m={MG.white} ink={0.03} />
          <Box p={[2.8, 0.3, 0.15]} s={[1.0, 0.3, 0.6]} m={MG.hot} ink={0.03} />
          {Array.from({length: 14}).map((_, i) => { const g = Math.max(0, Math.min(1, ((t - 18.8) * 0.28 + i / 14 + hash(i) * 0.1) % 1)); return t > 18.8 ? <mesh key={i} position={[lerp(-0.2, 1.7, g), 0.3 + hash(i + 3) * 1.9, 0.95]} material={MG.hot} scale={[0.07, 0.07, 0.07]}><sphereGeometry args={[1, 10, 8]} /></mesh> : null; })}
        </Canvas3D>
        <Termometer x={880} y={770} k={r(t, 18.7, 22.2)} />
        <Chip x={300} y={1010} p={r(t, 19.4, 19.8)} text="dinding bata" color={P18.hot} size={40} />
        <Chip x={780} y={1300} p={r(t, 21.2, 21.6)} text="kamar hangat" color={INK} size={40} />
      </Seg>
      {/* 6. denah dari atas: dinding barat panas, pintu ganti arah */}
      <Seg a={B.denah} b={B.solusi} f={f}>
        <Canvas3D k={k6}>
          <Tanah3 />
          <Box p={[0, 0.04, 0]} s={[2.4, 0.08, 3.0]} m={MG.white} ink={0.03} />
          <mesh position={[-0.75, 0.095, 0]}><boxGeometry args={[0.9, 0.02, 3.0]} /><meshBasicMaterial color={P18.hot} transparent opacity={0.38} /></mesh>
          <mesh position={[-0.25, 0.1, 0]}><boxGeometry args={[0.45, 0.02, 3.0]} /><meshBasicMaterial color="#e88a4e" transparent opacity={0.28} /></mesh>
          <Box p={[-1.2, 0.2, 0]} s={[0.16, 0.34, 3.08]} m={MG.hot} ink={0.03} />
          <Box p={[1.2, 0.2, 0]} s={[0.16, 0.34, 3.08]} m={MG.white} ink={0.03} />
          <Box p={[0, 0.2, -1.5]} s={[2.4, 0.34, 0.16]} m={MG.white} ink={0.03} />
          <Box p={[0, 0.2, 1.5]} s={[2.4, 0.34, 0.16]} m={MG.white} ink={0.03} />
          <Box p={[0.1, 0.16, 0]} s={[2.1, 0.22, 0.1]} m={MG.white} ink={0.03} />
          <Box p={[-1.2, 0.34, -0.6]} s={[0.1, 0.2, 0.6]} m={MG.glass} ink={0.02} /><Box p={[-1.2, 0.34, 0.7]} s={[0.1, 0.2, 0.6]} m={MG.glass} ink={0.02} />
          <Box p={[0.55, 0.16, -0.75]} s={[0.95, 0.2, 0.62]} m={MG.trunk} ink={0.03} /><Box p={[0.55, 0.3, -0.95]} s={[0.9, 0.14, 0.2]} m={MG.white} ink={0.02} />
          <Box p={[-0.1, 0.16, 0.8]} s={[1.0, 0.2, 0.6]} m={MG.leaf} ink={0.03} /><Box p={[0.7, 0.16, 0.8]} s={[0.4, 0.2, 0.4]} m={MG.trunk} ink={0.03} />
          <Box p={doorXZ} s={doorXZ[0] === 0 ? [0.7, 0.4, 0.2] : [0.2, 0.4, 0.7]} m={MG.green} ink={0.03} />
          <Sun3 p={[-2.0, 0.3, 0]} s={0.3} t={t} />
          <Beam3 a={[-1.7, 0.4, 0]} b={[-1.3, 0.4, 0]} t={t} n={4} />
        </Canvas3D>
        <Chip x={190} y={1080} p={r(t, 26.0, 26.4)} text="BARAT" color={P18.hot} size={46} />
        <Chip x={890} y={1080} p={r(t, 26.3, 26.7)} text="TIMUR" color={INK} size={46} />
        <Chip x={540} y={1330} p={r(t, 27.0, 27.4) * (t < 28.3 ? 1 : 0)} text="pintu ganti arah, dinding barat tetap kena" color={P18.good} size={34} />
        <Chip x={540} y={1330} p={r(t, 28.6, 29.0)} text="hadap utara pun kena" color={P18.good} size={38} />
      </Seg>
      {/* 7. solusi: pohon rindang + teritis menahan sinar */}
      <Seg a={B.solusi} b={B.aksi} f={f}>
        <Canvas3D k={k7}>
          <Tanah3 /><Wall3 p={[0.9, 0, 0]} hot={0} t={t} /><Sun3 p={[-0.95, 1.7, 0.9]} s={0.34} t={t} />
          <Pohon3 p={[-0.1, 0, 0.9]} s={1.0} grow={r(t, 32.4, 34.0, Easing.out(Easing.back(1.4)))} />
          <Beam3 a={[-0.7, 1.65, 0.9]} b={[r(t, 33.9, 34.3) > 0 ? -0.3 : 0.3, 1.7, 0.9]} t={t} n={5} />
          <Teritis3 p={[1.6, 3.25, 0.2]} grow={r(t, 36.6, 37.6)} />
        </Canvas3D>
        <Chip x={290} y={1060} p={r(t, 34.2, 34.6)} text="pohon rindang" color={P18.good} size={42} />
        <Chip x={820} y={1000} p={r(t, 37.4, 37.8)} text="teritis" color={P18.good} size={44} />
        <Chip x={540} y={1300} p={r(t, 37.9, 38.3)} text="dinding tetap adem" color={P18.good} size={38} />
      </Seg>
      {/* 8. aksi: kompas HP */}
      <Seg a={B.aksi} b={B.gema} f={f}>
        <HP t={t} p={r(t, B.aksi, B.aksi + 0.4)} />
        <Chip x={250} y={1250} p={r(t, 42.7, 43.1)} text="pohon?" color={P18.good} size={44} />
        <Chip x={540} y={1330} p={r(t, 43.5, 43.9)} text="teritis?" color={P18.good} size={44} />
        <Chip x={830} y={1250} p={r(t, 44.3, 44.7)} text="kosong?" color={P18.hot} size={44} />
      </Seg>
      {/* 9. gema + CTA */}
      <Seg a={B.gema} b={B.end} f={f}>
        <Canvas3D k={k9}>
          <Tanah3 /><House heat={0} /><Sun3 p={[-1.3, 2.6, 0.2]} s={0.4} t={t} /><Pohon3 p={[-1.5, 0, 1.6]} s={0.8} grow={1} />
          <Beam3 a={[-1.1, 2.45, 0.2]} b={[-0.5, 2.2, 0.8]} t={t} n={4} />
        </Canvas3D>
        <CommentBubble word="sisi mana?" start={Math.round(47.6 * FPS)} y={1000} />
      </Seg>

      {/* pemutus pola: DINDING BARAT */}
      {t >= B.payoff && t < 26.0 && <div style={{opacity: 1 - r(t, 25.5, 25.9)}}><PatternBreak lines={['DINDING', 'BARAT']} p={r(t, 23.45, 24.5)} sub="yang kena matahari sore" /></div>}

      {/* teks layar */}
      <Title t={t} a={0.4} b={B.takut} small="Rumahmu hadap barat?" big="KATANYA PANAS" bigAt={1.7} size={100} />
      <Title t={t} a={B.takut} b={B.pagi} small="Orang jadi takut" big="BELI RUMAH" bigAt={5.0} size={108} />
      <Title t={t} a={B.pagi} b={B.sore} small="Pagi, matahari" big="TINGGI" bigAt={8.9} size={130} />
      <Title t={t} a={B.sore} b={B.siang} small="Sore, matahari" big="RENDAH BANGET" bigAt={11.0} size={92} />
      <Title t={t} a={B.siang} b={B.simpan} small="Sekitar jam dua siang" big="DIPANGGANG" bigAt={15.6} size={100} />
      <Title t={t} a={B.simpan} b={B.payoff} small="Dinding nyimpan panas" big="SAMPAI MALAM" bigAt={20.0} size={96} />
      <Title t={t} a={B.denah} b={B.utara} small="Yang bikin panas" big="DINDING BARAT" bigAt={26.0} size={98} />
      <Title t={t} a={B.utara} b={B.solusi} small="Hadap utara pun" big="ADA DINDING BARAT" bigAt={29.0} size={74} />
      <Title t={t} a={B.solusi} b={B.teritis} small="Solusinya murah:" big="POHON RINDANG" bigAt={32.6} size={92} />
      <Title t={t} a={B.teritis} b={B.aksi} small="Teritis & teras" big="TAHAN SINAR" bigAt={37.2} size={100} />
      <Title t={t} a={B.aksi} b={B.kosong} small="Cek dulu" big="SISI BARAT" bigAt={40.0} size={116} />
      <Title t={t} a={B.kosong} b={B.gema} small="Kalau kosong" big="SIAPIN DANA" bigAt={43.4} size={104} />
      <Title t={t} a={B.gema} b={B.follow} small="Sisi mana kena" big="SORE?" bigAt={47.0} size={120} />

      <Kicker text="FAKTA RUMAH · #18" y={292} start={0} color={t >= 23.5 && t < 25.9 ? '#ffffff' : night > 0.5 ? '#f4a58f' : CORAL} />
      <TikTokBox text="Rumah hadap barat itu panas?" p={r(t, 0.2, 1.0, Easing.linear)} y={338} size={40} />
      <FollowButton start={Math.round(49.4 * FPS)} click={Math.round(50.8 * FPS)} y={760} />
      <Captions ms={ms} />

      <Audio src={staticFile('v18/vo.mp3')} />
      <Audio src={staticFile('sfx/ambient.wav')} volume={0.08} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
      <Grain o={0.06} />
    </AbsoluteFill>
  );
};
