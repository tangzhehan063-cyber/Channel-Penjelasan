// Video #17 "Rumah lebih rendah dari jalan" (Bukan Sial #03). DNA v8–16, kamera 2,5D ortografis, palet `langit`, TANPA Ornament.
// VO ElevenLabs Riri Rida (flow 1rtisfRaRpSMv2jMNDmF), timestamp public/v17/words.json (align_teks). Naskah: naskah/video-17-rumah-lebih-rendah-dari-jalan.md
// Warna tambahan sengaja: kuning cahaya (titik "energi") = benda bercahaya.
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Grain, TikTokBox, PatternBreak, C} from '../aset/Aset';
import {Kicker, FollowButton, CommentBubble} from '../aset/Gabung';
import {PaperPalet, PALET} from '../aset/PaperPalet';
import {Env} from '../pengetahuan/Scene';
import {Rig} from '../v13/Mood13';
import words from '../../public/v17/words.json';
import {Edges} from '@react-three/drei';
import {useMemo} from 'react';
import {Shape, ExtrudeGeometry} from 'three';

const PL = PALET.langit;
export const P17 = {coral: PL.accent, cool: PL.cool, good: PL.good, water: '#4f8fcf', waterLt: '#cfe6f7', ink: '#1c1c1e', wall: '#f6efe0', roof: PL.accent, soil: '#a07850', soilDk: '#7d5c3c', grass: '#82b46c', asphalt: '#4a4f55', glow: '#f2c14e', dust: '#a89478', floor: '#d9d2c3', gutter: '#3a3d42'};
export const FPS = 30;
export const V17_END = 53.4;
export const V17_FRAMES = Math.ceil(V17_END * FPS);
const CC_TOP = 1400, CORAL = P17.coral, INK = C.ink;
const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- beat (detik dari words.json) ----------
const B = {hook: 0, hook2: 2.29, mitos: 4.6, air: 8.8, rain: 10.95, debu: 16.53, angin: 19.92, payoff: 22.38, solusi: 27.64, urug: 29.71, selokan: 37.19, aksi: 43.06, gema: 47.67, follow: 50.85, end: V17_END};

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
const Mark: React.FC<{x: number; y: number; ok: boolean; p: number; text: string}> = ({x, y, ok, p, text}) => p > 0 ? (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * p})`, opacity: p, display: 'flex', alignItems: 'center', gap: 16, padding: '12px 26px', borderRadius: 20, background: 'rgba(250,249,246,0.97)', border: `5px solid ${ok ? P17.good : CORAL}`, fontFamily: 'Inter', fontWeight: 800, fontSize: 46, color: INK, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(28,28,30,0.18)'}}>
    <span style={{color: ok ? P17.good : CORAL, fontSize: 54, fontWeight: 900}}>{ok ? '✓' : '✗'}</span>{text}
  </div>
) : null;

// ---------- panggung 3D 2,5D ----------
type Cam = [number, number, number];
const camAt = (t: number, keys: [number, Cam][]): Cam => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) { const [ta, a] = keys[i], [tb, b] = keys[i + 1]; if (t <= tb) { const k = ease((t - ta) / (tb - ta)); return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; } }
  return keys[keys.length - 1][1];
};
export const Stage: React.FC<{cam: Cam; children: React.ReactNode}> = ({cam, children}) => (
  <ThreeCanvas width={1080} height={1920} shadows orthographic camera={{position: [0, 4, 30], zoom: 200, near: 0.1, far: 100}} gl={{alpha: true, antialias: true}}>
    <Rig x={cam[0]} y={cam[1]} zoom={cam[2]} />
    <Env intensity={0.35} /><hemisphereLight args={['#fffaf0', '#cfc6b4', 0.6]} />
    <directionalLight position={[2.5, 4.5, 3.0]} intensity={2.2} color="#fff4e6" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-radius={6} shadow-bias={-0.0004} />
    <directionalLight position={[-3, 1.5, 2]} intensity={0.35} color="#ffe2da" />
    {children}
  </ThreeCanvas>
);
const Seg: React.FC<{a: number; b: number; children: React.ReactNode}> = ({a, b, children}) => {
  const fa = Math.round(a * FPS), fb = Math.round(b * FPS);
  return <Sequence from={fa} durationInFrames={fb - fa} layout="none">{children}</Sequence>;
};

// ---------- primitif 3D ----------
const Mat: React.FC<{c: string; cc?: number; r?: number}> = ({c, cc = 0.3, r: rough = 0.8}) => <meshPhysicalMaterial color={c} roughness={rough} clearcoat={cc} clearcoatRoughness={0.4} />;
type V3 = [number, number, number];
const Bx: React.FC<{p: V3; s: V3; c: string; edge?: boolean; rot?: V3; op?: number}> = ({p, s, c, edge = true, rot, op = 1}) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><boxGeometry args={s} />{op < 1 ? <meshPhysicalMaterial color={c} roughness={0.2} clearcoat={0.8} transparent opacity={op} /> : <Mat c={c} />}{edge && op >= 1 && <Edges color="#1c1c1e" lineWidth={1.5} />}</mesh>
);
const Cyl: React.FC<{p: V3; r: number; h: number; c: string; rot?: V3}> = ({p, r: rad, h, c, rot}) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[rad, rad, h, 28]} /><Mat c={c} /><Edges color="#1c1c1e" lineWidth={1.2} /></mesh>
);
const Ball: React.FC<{p: V3; s: number; c: string; sx?: number; sy?: number; basic?: boolean}> = ({p, s, c, sx = 1, sy = 1, basic}) => (
  <mesh position={p} scale={[s * sx, s * sy, s]} castShadow={!basic}><sphereGeometry args={[1, 18, 14]} />{basic ? <meshBasicMaterial color={c} /> : <meshPhysicalMaterial color={c} roughness={0.35} clearcoat={0.6} />}</mesh>
);
const Prism: React.FC<{p: V3; w: number; h: number; d: number; c: string; rot?: V3; apex?: number}> = ({p, w, h, d, c, rot, apex = 0}) => {
  const geo = useMemo(() => { const sh = new Shape(); sh.moveTo(-w / 2, 0); sh.lineTo(w / 2, 0); sh.lineTo((apex * w) / 2, h); sh.closePath(); const g = new ExtrudeGeometry(sh, {depth: d, bevelEnabled: false}); g.translate(0, 0, -d / 2); return g; }, [w, h, d, apex]);
  return <mesh position={p} rotation={rot} geometry={geo} castShadow receiveShadow><Mat c={c} /><Edges color="#1c1c1e" lineWidth={1.5} /></mesh>;
};

// ---------- dunia: jalan, cekungan, rumah ----------
const ROAD_TOP = 0, YARD0 = -0.55, WALL_X = 0.4;
const yardTopAt = (k: number) => lerp(YARD0, 0.16, k);
export const Dunia: React.FC<{k: number}> = ({k}) => {
  const yt = yardTopAt(k), h = Math.max(0.0001, ROAD_TOP - yt);
  return (
    <group>
      {/* jalan */}
      <Bx p={[-3.7, -0.3, 0]} s={[4.6, 0.6, 2.4]} c={P17.soil} edge={false} />
      <Bx p={[-3.7, 0.02, 0]} s={[4.6, 0.06, 2.4]} c={P17.asphalt} edge={false} />
      {Array.from({length: 6}).map((_, i) => <Bx key={i} p={[-5.5 + i * 0.7, 0.06, 0]} s={[0.34, 0.015, 0.06]} c="#f4f2ec" edge={false} />)}
      {/* lereng penghubung jalan ke halaman */}
      {h > 0.002 && <Prism p={[-1.0, yt, 0]} w={0.8} h={h} d={2.4} c={P17.soil} apex={-1} />}
      {/* halaman: balok tanah naik saat diurug */}
      <Bx p={[1.95, yt - 0.35, 0]} s={[5.1, 0.7, 2.4]} c={P17.soil} edge={false} />
      <Bx p={[1.95, yt - 0.02, 0]} s={[5.1, 0.04, 2.4]} c={P17.grass} edge={false} />
    </group>
  );
};
const Selokan: React.FC<{t: number; p: number}> = ({t, p}) => p <= 0 ? null : (
  <group scale={[1, p, 1]} position={[-1.65, 0, 0]}>
    <Bx p={[-0.2, 0.05, 0]} s={[0.1, 0.1, 2.4]} c={P17.gutter} edge={false} />
    <Bx p={[0.2, 0.05, 0]} s={[0.1, 0.1, 2.4]} c={P17.gutter} edge={false} />
    <Bx p={[0, 0.0, 0]} s={[0.3, 0.06, 2.4]} c="#2a2c30" edge={false} />
    {Array.from({length: 6}).map((_, i) => { const k = (t * 0.7 + i / 6) % 1; return <Ball key={i} p={[0, 0.045, -1.1 + k * 2.2]} s={0.07} c={P17.waterLt} sx={1} sy={0.6} />; })}
  </group>
);
export const Rumah: React.FC<{k: number; wet: number; glow: number; t: number}> = ({k, wet, glow, t}) => {
  const yt = yardTopAt(k);
  return (
    <group position={[1.5, yt, 0]}>
      <Bx p={[0, 0.04, 0]} s={[2.2, 0.08, 1.5]} c={P17.floor} />
      <Bx p={[0, 0.62, -0.7]} s={[2.2, 1.1, 0.08]} c={P17.wall} />
      <Bx p={[1.1, 0.62, 0]} s={[0.08, 1.1, 1.5]} c={P17.wall} />
      <Bx p={[-1.1, 0.62, -0.515]} s={[0.08, 1.1, 0.47]} c={P17.wall} />
      <Bx p={[-1.1, 0.62, 0.515]} s={[0.08, 1.1, 0.47]} c={P17.wall} />
      <Bx p={[-1.1, 1.12, 0]} s={[0.08, 0.16, 0.56]} c={P17.wall} />
      <Bx p={[-1.1, 0.6, 0]} s={[0.05, 0.9, 0.56]} c="#a65a3a" />
      <Bx p={[-1.12, 0.65, 0.18]} s={[0.04, 0.05, 0.05]} c="#e9e1d2" edge={false} />
      <Prism p={[0, 1.17, 0]} w={1.7} h={0.6} d={2.5} c={P17.roof} rot={[0, Math.PI / 2, 0]} />
      <Bx p={[0.4, 0.22, -0.3]} s={[0.7, 0.26, 0.4]} c="#8a5634" />
      <Bx p={[-0.2, 0.09, 0.35]} s={[0.9, 0.02, 0.5]} c="#7aa6c4" edge={false} />
      <Bx p={[0.9, 0.7, -0.64]} s={[0.4, 0.4, 0.04]} c="#9ec7de" edge={false} />
      {/* air masuk lewat bawah pintu */}
      {wet > 0 && <Bx p={[-0.4, 0.085, 0]} s={[1.5 * wet, 0.03, 1.2]} c={P17.water} op={0.75} edge={false} />}
      {/* titik "energi" yang katanya mengendap */}
      {glow > 0 && Array.from({length: 14}).map((_, i) => { const base = 0.35 + hash(i) * 0.7, sink = glow, y = lerp(base, 0.13 + 0.03 * (i % 3), sink) + 0.03 * Math.sin(t * 2.2 + i * 1.7); return <Ball key={i} p={[-0.8 + hash(i + 9) * 1.7, y, -0.5 + hash(i + 3) * 0.95]} s={0.07 * Math.min(1, glow * 5)} c={P17.glow} basic />; })}
    </group>
  );
};
const Awan: React.FC<{p: number}> = ({p}) => p <= 0 ? null : (
  <group position={[-1.6, 3.7, -0.4]} scale={p}>
    <Ball p={[0, 0, 0]} s={0.5} c="#9fb4c6" sx={1.4} /><Ball p={[0.6, -0.05, 0.05]} s={0.42} c="#8fa5b8" sx={1.3} /><Ball p={[-0.65, -0.08, 0.05]} s={0.4} c="#8fa5b8" sx={1.3} /><Ball p={[0.2, 0.25, 0]} s={0.38} c="#a9bdcf" sx={1.2} />
  </group>
);
export const Hujan: React.FC<{t: number; o: number; k: number}> = ({t, o, k}) => o <= 0 ? null : (
  <group>
    {Array.from({length: 26}).map((_, i) => {
      const x = -3.4 + hash(i) * 7.6, f = (t * 1.5 + hash(i + 50)) % 1, y = 3.4 - f * 3.5;
      const floor = x < -1.4 ? 0.06 : yardTopAt(k) + 0.04;
      return y > floor ? <Ball key={i} p={[x, y, 0.6 - hash(i + 20) * 1.2]} s={0.035} c={P17.water} sy={2.6} /> : null;
    })}
  </group>
);
// aliran air di jalan dan lereng; berhenti di selokan setelah halaman ditinggikan
const Aliran: React.FC<{t: number; o: number; k: number}> = ({t, o, k}) => {
  if (o <= 0) return null;
  const raised = k > 0.9, xEnd = raised ? -1.65 : -0.65;
  return (
    <group>
      {Array.from({length: 11}).map((_, i) => {
        const s = (t * 0.35 + i / 11) % 1, x = lerp(-4.6, xEnd, s);
        const y = x < -1.4 || raised ? 0.07 : 0.07 - ((x + 1.4) / 0.8) * 0.55;
        return <Ball key={i} p={[x, y, 0.3 - hash(i + 5) * 0.6]} s={0.07 * o} c={P17.waterLt} sx={1.4} sy={0.7} />;
      })}
    </group>
  );
};
export const Genangan: React.FC<{lvl: number}> = ({lvl}) => lvl <= 0.001 ? null : <Bx p={[-0.12, YARD0 + lvl / 2, 0]} s={[1.0, lvl, 2.0]} c={P17.water} op={0.75} edge={false} />;
const Mobil: React.FC<{x: number}> = ({x}) => (
  <group position={[x, 0.05, 0.45]}>
    <Bx p={[0, 0.2, 0]} s={[0.85, 0.24, 0.45]} c="#e8e3d8" />
    <Bx p={[-0.05, 0.4, 0]} s={[0.46, 0.2, 0.4]} c="#cfe6f7" />
    <Cyl p={[-0.27, 0.1, 0.22]} r={0.1} h={0.08} c="#2c2f33" rot={[Math.PI / 2, 0, 0]} /><Cyl p={[0.27, 0.1, 0.22]} r={0.1} h={0.08} c="#2c2f33" rot={[Math.PI / 2, 0, 0]} />
  </group>
);
const Debu: React.FC<{t: number; k: number; pile: number}> = ({t, k, pile}) => {
  const yt = yardTopAt(k);
  return (
    <group>
      {Array.from({length: 18}).map((_, i) => {
        const f = (t * 0.5 + hash(i)) % 1, x = lerp(-1.6, 0.2, hash(i + 4)) + f * 0.4, y = lerp(1.3, yt + 0.06, f);
        return <Ball key={i} p={[x, y, 0.8 - hash(i + 30) * 1.4]} s={0.05} c={P17.dust} />;
      })}
      {pile > 0.01 && <Prism p={[-0.12, yt, 0.0]} w={0.9} h={0.18 * pile} d={1.9} c={P17.dust} apex={0.2} />}
    </group>
  );
};
const Angin: React.FC<{t: number; o: number; k: number}> = ({t, o, k}) => o <= 0 ? null : (
  <group>
    {[0, 1, 2].map((i) => { const f = (t * 0.45 + i / 3) % 1, x = lerp(-1.4, 0.2, f), y = yardTopAt(k) + 0.45 + i * 0.28; return (
      <group key={i} position={[x, y, 0.85]} scale={o * (1 - 0.6 * f)}>
        <Cyl p={[-0.12, 0, 0]} r={0.025} h={0.28} c={P17.cool} rot={[0, 0, Math.PI / 2]} />
        <mesh position={[0.08, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.07, 0.14, 10]} /><Mat c={P17.cool} /></mesh>
      </group>); })}
  </group>
);
export const Tanam: React.FC<{k: number}> = ({k}) => (
  <group position={[4.0, yardTopAt(k), 0.2]}>
    <Cyl p={[0, 0.22, 0]} r={0.06} h={0.44} c="#8a5634" />
    <mesh position={[0, 0.8, 0]} castShadow><coneGeometry args={[0.34, 0.75, 7]} /><Mat c="#4f8a4a" /></mesh>
    <mesh position={[0, 1.2, 0]} castShadow><coneGeometry args={[0.25, 0.55, 7]} /><Mat c="#5a9a55" /></mesh>
  </group>
);
// penggaris/garis level di tinggi jalan
const GarisJalan: React.FC<{p: number}> = ({p}) => p <= 0 ? null : (
  <group>
    {Array.from({length: 22}).map((_, i) => <Bx key={i} p={[-2.0 + i * 0.28 * p, 0.06, 1.25]} s={[0.16, 0.03, 0.03]} c={CORAL} edge={false} />)}
  </group>
);

// ---------- SFX ----------
const SFX: [string, number, number][] = [
  ['tick', 0.5, 0.3], ['pop', 3.0, 0.4], ['whoosh', 4.55, 0.3], ['pop', 5.8, 0.4], ['pop', 7.0, 0.4],
  ['whoosh', 8.75, 0.3], ['flow', 11.0, 0.25], ['drip', 12.4, 0.4], ['drip', 14.0, 0.4], ['thud', 15.0, 0.4],
  ['whoosh', 16.5, 0.3], ['engine', 17.4, 0.25], ['pop', 17.9, 0.4], ['pop', 20.2, 0.4],
  ['crystal', 24.4, 0.3], ['chime', 24.9, 0.4],
  ['whoosh', 27.6, 0.3], ['thud', 31.0, 0.35], ['thud', 33.2, 0.35], ['thud', 35.0, 0.35],
  ['whoosh', 37.15, 0.3], ['flow', 38.0, 0.25], ['ting', 40.5, 0.3],
  ['whoosh', 43.0, 0.3], ['ting', 45.3, 0.4], ['chime', 45.9, 0.4],
  ['pop', 48.6, 0.4], ['chime', 52.0, 0.4],
];

// ---------- komposisi ----------
export const Video17: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, ms = t * 1000;
  const k = r(t, 30.3, 36.2);
  const rain = r(t, B.rain, B.rain + 0.5);
  const genangan = 0.17 * r(t, 12.2, 15.2) * (1 - r(t, 31.8, 35.4));
  const wet = r(t, 14.6, 16.3) * (1 - r(t, 31.8, 35.4));
  const glow = r(t, 4.9, 8.6);
  const pile = r(t, 17.6, 21.5) * (1 - r(t, 32.0, 35.6));
  return (
    <AbsoluteFill>
      <PaperPalet palet="langit" />

      {/* A. hook: potongan jalan, rumah di cekungan */}
      <Seg a={0} b={B.mitos}>
        <Stage cam={camAt(t, [[0, [1.1, 0.75, 118]], [4.6, [1.2, 0.7, 128]]])}>
          <Dunia k={0} /><Rumah k={0} wet={0} glow={0} t={t} /><Tanam k={0} />
        </Stage>
        <Chip x={200} y={1030} p={r(t, 3.0, 3.4)} text="jalan" color={P17.asphalt} size={36} />
        <Chip x={800} y={1150} p={r(t, 3.3, 3.7)} text="rumahmu" color={CORAL} size={36} />
      </Seg>
      {/* B. mitos: "energi" mengendap di dalam rumah */}
      <Seg a={B.mitos} b={B.air}>
        <Stage cam={camAt(t, [[4.6, [1.5, 0.8, 175]], [8.8, [1.5, 0.55, 190]]])}>
          <Dunia k={0} /><Rumah k={0} wet={0} glow={glow} t={t} />
        </Stage>
        <Chip x={540} y={1140} p={r(t, 5.9, 6.3)} text="energi mengendap" color="#b8860b" size={40} />
        <Chip x={540} y={1250} p={r(t, 7.0, 7.4)} text="keuangan seret" color={CORAL} size={40} />
      </Seg>
      {/* C. air hujan: dive dari awan ke bawah pintu */}
      <Seg a={B.air} b={B.debu}>
        <Stage cam={camAt(t, [[8.8, [-1.6, 1.9, 150]], [11.0, [-1.6, 1.9, 150]], [13.0, [-1.1, 0.5, 215]], [16.5, [0.5, 0.05, 250]]])}>
          <Dunia k={0} /><Rumah k={0} wet={wet} glow={0} t={t} /><Awan p={r(t, 10.5, 11.2)} /><Hujan t={t} o={rain} k={0} /><Aliran t={t} o={rain} k={0} /><Genangan lvl={genangan} />
        </Stage>
        <Chip x={300} y={1150} p={r(t, 12.6, 13.0)} text="air dari jalan" color={P17.water} size={38} />
        <Chip x={800} y={1270} p={r(t, 14.8, 15.2)} text="masuk bawah pintu" color={CORAL} size={38} />
      </Seg>
      {/* D. debu & asap kendaraan, angin susah masuk */}
      <Seg a={B.debu} b={B.payoff}>
        <Stage cam={camAt(t, [[16.53, [-2.8, 0.7, 160]], [19.9, [0.1, 0.45, 170]], [22.4, [0.9, 0.5, 168]]])}>
          <Dunia k={0} /><Rumah k={0} wet={1} glow={0} t={t} />
          <Mobil x={-5.2 + (t - 16.9) * 1.05} /><Mobil x={-5.2 + (t - 18.6) * 1.05} />
          <Debu t={t} k={0} pile={pile} /><Angin t={t} o={r(t, 19.9, 20.4)} k={0} />
        </Stage>
        <Chip x={300} y={1110} p={r(t, 17.4, 17.8)} text="debu & asap" color="#8a7358" size={38} />
        <Chip x={790} y={1260} p={r(t, 20.6, 21.0)} text="angin susah masuk" color={P17.cool} size={38} />
      </Seg>
      {/* E. payoff: dua penyebab asli */}
      <Seg a={B.payoff} b={B.solusi}>
        <Stage cam={camAt(t, [[22.38, [1.0, 0.6, 135]], [27.64, [1.1, 0.6, 142]]])}>
          <Dunia k={0} /><Rumah k={0} wet={1} glow={0} t={t} /><Hujan t={t} o={1} k={0} /><Genangan lvl={0.17} /><Debu t={t} k={0} pile={1} />
        </Stage>
        <Chip x={290} y={1130} p={r(t, 25.6, 26.0)} text="air hujan" color={P17.water} size={42} />
        <Chip x={790} y={1130} p={r(t, 26.0, 26.4)} text="debu" color="#8a7358" size={42} />
      </Seg>
      {/* F. solusi: lantai & ambang diurug sampai lebih tinggi dari jalan */}
      <Seg a={B.solusi} b={B.selokan}>
        <Stage cam={camAt(t, [[27.64, [1.0, 0.55, 140]], [30.3, [1.0, 0.55, 140]], [36.97, [1.1, 1.0, 148]]])}>
          <Dunia k={k} /><Rumah k={k} wet={wet} glow={0} t={t} /><Tanam k={k} />
          <Hujan t={t} o={1} k={k} /><Aliran t={t} o={1} k={k} /><Genangan lvl={genangan} />
          <Debu t={t} k={k} pile={pile} /><GarisJalan p={r(t, 32.5, 34.0)} />
          {Array.from({length: 8}).map((_, i) => { const f2 = (t * 0.8 + i / 8) % 1; return k > 0.02 && k < 0.98 ? <Ball key={i} p={[-0.2 + hash(i) * 3.6, 2.2 - f2 * 1.8, 0.2 + hash(i + 9) * 0.8]} s={0.06} c={P17.soilDk} /> : null; })}
        </Stage>
        <Chip x={540} y={1150} p={r(t, 33.9, 34.3)} text="lantai di atas jalan" color={P17.good} size={38} />
      </Seg>
      {/* G. selokan: air punya jalan keluar */}
      <Seg a={B.selokan} b={B.aksi}>
        <Stage cam={camAt(t, [[37.19, [-0.9, 0.35, 190]], [42.8, [-1.5, 0.3, 205]]])}>
          <Dunia k={1} /><Rumah k={1} wet={0} glow={0} t={t} /><Tanam k={1} />
          <Hujan t={t} o={1} k={1} /><Aliran t={t} o={1} k={1} />
          <Selokan t={t} p={r(t, 37.6, 38.4)} />
        </Stage>
        <Chip x={300} y={1170} p={r(t, 40.0, 40.4)} text="selokan" color={P17.gutter} size={40} />
        <Chip x={790} y={1000} p={r(t, 40.7, 41.1)} text="rumah kering" color={P17.good} size={38} />
      </Seg>
      {/* H. aksi: cek lantai terhadap jalan sebelum beli */}
      <Seg a={B.aksi} b={B.gema}>
        <Stage cam={camAt(t, [[43.06, [1.0, 0.45, 205]], [47.67, [1.1, 0.7, 150]]])}>
          <Dunia k={1} /><Rumah k={1} wet={0} glow={0} t={t} /><Tanam k={1} /><GarisJalan p={r(t, 43.5, 45.0)} />
        </Stage>
        <Mark x={540} y={1260} ok p={r(t, 45.2, 45.6)} text="lantai > jalan" />
      </Seg>
      {/* I. gema + CTA + follow: rumah kering, tetes berhenti di ambang */}
      <Seg a={B.gema} b={B.end}>
        <Stage cam={camAt(t, [[47.67, [1.1, 0.75, 128]], [53.4, [1.2, 0.7, 138]]])}>
          <Dunia k={1} /><Rumah k={1} wet={0} glow={0} t={t} /><Tanam k={1} /><Hujan t={t} o={1} k={1} /><Aliran t={t} o={1} k={1} /><Selokan t={t} p={1} />
        </Stage>
        <CommentBubble word="tinggi atau rendah?" start={Math.round(48.6 * FPS)} y={1000} />
      </Seg>

      {/* pemutus pola: BUKAN ENERGI */}
      {t >= 24.3 && t < 27.7 && <div style={{opacity: 1 - r(t, 27.1, 27.6)}}><PatternBreak lines={['BUKAN', 'ENERGI']} p={r(t, 24.4, 25.4)} sub="air hujan & debu" /></div>}

      {/* teks layar */}
      <Title t={t} a={0.5} b={B.mitos} small="Rumah lebih rendah dari jalan?" big="KATANYA SIAL" bigAt={2.4} size={104} />
      <Title t={t} a={B.mitos} b={B.air} small="Katanya energi" big="MENGENDAP" bigAt={5.6} size={110} />
      <Title t={t} a={B.air} b={B.rain + 1.2} small="Yang mengendap itu" big="AIR" bigAt={9.4} size={130} />
      <Title t={t} a={B.rain + 1.2} b={B.debu} small="Dari jalan, ke bawah" big="PINTUMU" bigAt={14.4} size={110} />
      <Title t={t} a={B.debu} b={B.angin} small="Debu & asap" big="NUMPUK DI BAWAH" bigAt={17.6} size={84} />
      <Title t={t} a={B.angin} b={B.payoff} small="Angin susah masuk," big="UDARA PENGAP" bigAt={20.8} size={90} />
      <Title t={t} a={B.payoff} b={24.4} small="Yang disebut" big="ENERGI BURUK" bigAt={23.0} size={92} />
      <Title t={t} a={B.solusi} b={B.urug} small="Solusinya" big="TANPA PINDAH" bigAt={28.2} size={100} />
      <Title t={t} a={B.urug} b={B.selokan} small="Tinggikan" big="LANTAI & AMBANG" bigAt={30.8} size={88} />
      <Title t={t} a={B.selokan} b={B.aksi} small="Air perlu" big="JALAN KELUAR" bigAt={38.6} size={96} />
      <Title t={t} a={B.aksi} b={B.gema} small="Mau beli? Cek" big="LANTAI vs JALAN" bigAt={44.2} size={84} />
      <Title t={t} a={B.gema} b={B.follow} small="Rumahmu" big="TINGGI / RENDAH?" bigAt={48.2} size={82} />

      <Kicker text="FAKTA RUMAH · #17" y={292} start={0} />
      <TikTokBox text="Rumah lebih rendah dari jalan itu sial?" p={r(t, 0.2, 1.0, Easing.linear)} y={338} size={40} />
      <FollowButton start={Math.round(51.0 * FPS)} click={Math.round(52.3 * FPS)} y={760} />
      <Captions ms={ms} />

      <Audio src={staticFile('v17/vo.mp3')} />
      <Audio src={staticFile('sfx/ambient.wav')} volume={0.08} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
      <Grain o={0.08} />
    </AbsoluteFill>
  );
};
