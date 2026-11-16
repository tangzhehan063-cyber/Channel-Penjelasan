// Video #16 "Air PDAM direbus vs galon isi ulang" (VS). DNA v8–14, kamera 2,5D ortografis, TANPA Ornament (perintah user 16 Nov).
// VO ElevenLabs Riri Rida (flow Jz54PYCD0D5rHTinLwWx), timestamp public/v16/words.json (align_teks). Naskah: naskah/video-15-air-pdam-rebus-vs-galon.md
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Grain, TikTokBox, PatternBreak, C} from '../aset/Aset';
import {PaperPlus, Kicker, FollowButton} from '../aset/Gabung';
import {Env} from '../pengetahuan/Scene';
import {Rig} from '../v13/Mood13';
import words from '../../public/v16/words.json';
import {Edges, RoundedBox} from '@react-three/drei';
import {useMemo} from 'react';
import {Shape, ExtrudeGeometry} from 'three';

export const P16 = {coral: '#e2563f', ink: '#1c1c1e', ac: '#f4f2ec', acEdge: '#cfcac0', wall: '#e9e1d2', wallOut: '#b9c7cf', floor: '#d9d4c7', ground: '#a8b59a', bed: '#5d8fd6', pillow: '#f8f6f0', fin: '#7fa6c4', water: '#4fa3d9', hose: '#e8e3d8', moss: '#6f8a4a', dust: '#8a7d6b'};
export const FPS = 30;
export const V16_END = 56.7;
export const V16_FRAMES = Math.ceil(V16_END * FPS);
const CC_TOP = 1400, CORAL = P16.coral, INK = C.ink;
const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ---------- beat (detik dari words.json) ----------

// ---------- beat (detik dari words.json, Scribe) ----------
const B = {hook: 0, hook2: 3.9, standar: 6.36, rebus: 16.26, isi: 28.77, payoff: 42.5, aksi: 46.37, cta: 52.5, end: V16_END};
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

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
const Ring2D: React.FC<{x: number; y: number; s: number; p: number}> = ({x, y, s, p}) => p > 0 ? <div style={{position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: '50%', border: `8px solid ${CORAL}`, opacity: p, transform: `scale(${1.4 - 0.4 * p})`}} /> : null;

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
    <directionalLight position={[2.5, 4.5, 3.0]} intensity={2.2} color="#fff4e6" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-radius={6} shadow-bias={-0.0004} />
    <directionalLight position={[-3, 1.5, 2]} intensity={0.35} color="#ffe2da" />
    {children}
  </ThreeCanvas>
);
const Seg: React.FC<{a: number; b: number; children: React.ReactNode}> = ({a, b, children}) => {
  const fa = Math.round(a * FPS), fb = Math.round(b * FPS);
  return <Sequence from={fa} durationInFrames={fb - fa} layout="none">{children}</Sequence>;
};

// ---------- objek 3D ----------
const Mat: React.FC<{c: string; cc?: number; r?: number}> = ({c, cc = 0.3, r = 0.8}) => <meshPhysicalMaterial color={c} roughness={r} clearcoat={cc} clearcoatRoughness={0.4} />;
const Bx: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; edge?: boolean; rot?: [number, number, number]}> = ({p, s, c, edge = true, rot}) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><boxGeometry args={s} /><Mat c={c} />{edge && <Edges color="#1c1c1e" lineWidth={1.5} />}</mesh>
);
const Drop: React.FC<{p: [number, number, number]; s?: number}> = ({p, s = 0.05}) => (
  <mesh position={p} scale={[s, s * 1.25, s]}><sphereGeometry args={[1, 20, 16]} /><meshPhysicalMaterial color={P16.water} roughness={0.1} clearcoat={1} transmission={0.2} /></mesh>
);
// unit AC dinding: badan putih membulat, sirip udara, lampu kecil
const Mark: React.FC<{x: number; y: number; ok: boolean; p: number; text: string}> = ({x, y, ok, p, text}) => p > 0 ? (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * p})`, opacity: p, display: 'flex', alignItems: 'center', gap: 16, padding: '12px 26px', borderRadius: 20, background: 'rgba(250,249,246,0.97)', border: `5px solid ${ok ? '#3f9a5a' : CORAL}`, fontFamily: 'Inter', fontWeight: 800, fontSize: 46, color: INK, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(28,28,30,0.18)'}}>
    <span style={{color: ok ? '#3f9a5a' : CORAL, fontSize: 54, fontWeight: 900}}>{ok ? '✓' : '✗'}</span>{text}
  </div>
) : null;


// ---------- objek 3D air ----------
const Cyl: React.FC<{p: [number, number, number]; r: number; h: number; c: string; rot?: [number, number, number]; op?: number; open?: boolean}> = ({p, r: rad, h, c, rot, op = 1, open}) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[rad, rad, h, 36, 1, open]} /><meshPhysicalMaterial color={c} roughness={0.5} clearcoat={0.4} transparent={op < 1} opacity={op} side={open ? 2 : 0} />{op >= 1 && <Edges color="#1c1c1e" lineWidth={1.2} />}</mesh>
);
const Ball: React.FC<{p: [number, number, number]; s: number; c: string; sx?: number}> = ({p, s, c, sx = 1}) => (
  <mesh position={p} scale={[s * sx, s, s]} castShadow><sphereGeometry args={[1, 20, 16]} /><meshPhysicalMaterial color={c} roughness={0.4} clearcoat={0.6} /></mesh>
);
const PIPE = '#c9d1d6';
const Ground: React.FC<{w?: number}> = ({w = 14}) => <Bx p={[0, -0.12, 0]} s={[w, 0.24, 3]} c="#e6dfd0" edge={false} />;
const Faucet: React.FC<{p: [number, number, number]; t: number; flow?: number}> = ({p, t, flow = 0}) => (
  <group position={p}>
    <Bx p={[-0.25, 0, 0]} s={[0.3, 1.3, 0.5]} c="#e9e1d2" />
    <Cyl p={[0.2, 0.15, 0]} r={0.09} h={0.8} c="#b9c2c8" rot={[0, 0, Math.PI / 2]} />
    <Cyl p={[0.55, 0.0, 0]} r={0.09} h={0.3} c="#b9c2c8" />
    <Cyl p={[0.12, 0.35, 0]} r={0.1} h={0.12} c={CORAL} />
    {[0, 1, 2].map((i) => { const k = ((t * 1.4 + i / 3) % 1); return flow > 0 ? <Ball key={i} p={[0.55, -0.1 - k * 0.7, 0]} s={0.055 * flow} c={P16.water} /> : null; })}
  </group>
);
const Tree: React.FC<{p: [number, number, number]; k?: number}> = ({p, k = 1}) => (
  <group position={p} scale={k}>
    <Cyl p={[0, 0.2, 0]} r={0.06} h={0.4} c="#8a5634" />
    <mesh position={[0, 0.75, 0]} castShadow><coneGeometry args={[0.32, 0.7, 7]} /><Mat c="#4f8a4a" /></mesh>
    <mesh position={[0, 1.15, 0]} castShadow><coneGeometry args={[0.24, 0.55, 7]} /><Mat c="#5a9a55" /></mesh>
  </group>
);
const Fence: React.FC<{x0: number; x1: number; z: number}> = ({x0, x1, z}) => (
  <group>
    <Bx p={[(x0 + x1) / 2, 0.3, z]} s={[x1 - x0, 0.05, 0.04]} c="#3a3d42" edge={false} />
    {Array.from({length: Math.round((x1 - x0) / 0.14)}).map((_, i) => <Bx key={i} p={[x0 + i * 0.14, 0.2, z]} s={[0.03, 0.4, 0.03]} c="#3a3d42" edge={false} />)}
  </group>
);
const Prism: React.FC<{p: [number, number, number]; w: number; h: number; d: number; c: string; rot?: [number, number, number]; apex?: number}> = ({p, w, h, d, c, rot, apex = 0}) => {
  const geo = useMemo(() => { const sh = new Shape(); sh.moveTo(-w / 2, 0); sh.lineTo(w / 2, 0); sh.lineTo((apex * w) / 2, h); sh.closePath(); const g = new ExtrudeGeometry(sh, {depth: d, bevelEnabled: false}); g.translate(0, 0, -d / 2); return g; }, [w, h, d, apex]);
  return <mesh position={p} rotation={rot} geometry={geo} castShadow receiveShadow><Mat c={c} /><Edges color="#1c1c1e" lineWidth={1.5} /></mesh>;
};
const Win: React.FC<{p: [number, number, number]; w?: number; h?: number}> = ({p, w = 0.34, h = 0.32}) => (
  <group position={p}>
    <Bx p={[0, 0, 0]} s={[w + 0.08, h + 0.08, 0.04]} c="#f6f2ea" edge={false} />
    <Bx p={[0, 0, 0.03]} s={[w, h, 0.03]} c="#9ec7de" edge={false} />
    <Bx p={[0, 0, 0.055]} s={[0.025, h, 0.02]} c="#f6f2ea" edge={false} />
    <Bx p={[0, 0, 0.055]} s={[w, 0.025, 0.02]} c="#f6f2ea" edge={false} />
  </group>
);
const Bush: React.FC<{p: [number, number, number]; s?: number}> = ({p, s = 1}) => <group position={p} scale={s}><Ball p={[0, 0.12, 0]} s={0.14} c="#5a9a55" /><Ball p={[0.12, 0.09, 0.03]} s={0.1} c="#6aab63" /></group>;
const House: React.FC<{p: [number, number, number]}> = ({p}) => (
  <group position={p}>
    {/* badan utama + atap pelana */}
    <Bx p={[0, 0.55, 0]} s={[1.7, 1.1, 1.2]} c="#f6efe0" />
    <Prism p={[0, 1.1, 0]} w={1.5} h={0.62} d={1.95} c="#f08a3c" rot={[0, Math.PI / 2, 0]} />
    <Bx p={[0.5, 1.7, -0.2]} s={[0.2, 0.42, 0.2]} c="#c9bfae" />
    {/* teras depan dengan atap pelana kecil menghadap depan */}
    <Bx p={[-0.45, 0.4, 0.78]} s={[0.8, 0.8, 0.5]} c="#f6efe0" />
    <Prism p={[-0.45, 0.8, 0.78]} w={1.0} h={0.42} d={0.62} c="#f08a3c" />
    <Bx p={[-0.45, 0.33, 1.04]} s={[0.3, 0.62, 0.03]} c="#a65a3a" />
    <Bx p={[-0.45, 0.04, 1.2]} s={[0.55, 0.08, 0.26]} c="#d9d2c3" />
    {/* jendela */}
    <Win p={[0.5, 0.62, 0.62]} w={0.42} h={0.4} />
    <Win p={[0.86, 0.62, 0.0]} w={0.4} h={0.4} />
    <Bx p={[0.86, 0.62, 0.0]} s={[0.02, 0.4, 0.4]} c="#9ec7de" edge={false} />
    <Bush p={[-0.95, 0.05, 1.05]} s={1.3} /><Bush p={[0.2, 0.05, 0.75]} s={1.1} />
  </group>
);
const Instalasi: React.FC<{t: number}> = ({t}) => (
  <group>
    <Bx p={[-4.45, -0.55, 0]} s={[2.9, 1.1, 2.4]} c="#8b5e3c" edge={false} />
    <Bx p={[-4.45, 0.04, 0]} s={[2.9, 0.08, 2.4]} c="#d7d9db" />
    {/* gedung utama + atap gigi gergaji */}
    <Bx p={[-4.1, 0.55, -0.3]} s={[1.3, 1.0, 0.8]} c="#e9e9eb" />
    {[-4.5, -4.15, -3.8].map((x, i) => <Prism key={i} p={[x, 1.05, -0.3]} w={0.36} h={0.32} d={0.86} c="#f08a3c" apex={-1} />)}
    {[-4.5, -4.15, -3.8].map((x, i) => <Bx key={i} p={[x + 0.0, 0.72, 0.12]} s={[0.22, 0.26, 0.03]} c="#9ec7de" edge={false} />)}
    <Bx p={[-3.45, 0.38, -0.3]} s={[0.5, 0.64, 0.6]} c="#e9e9eb" />
    <Bx p={[-3.45, 0.74, -0.3]} s={[0.58, 0.08, 0.68]} c="#f08a3c" />
    {/* cerobong */}
    {[-4.7, -4.5].map((x, i) => <group key={i}><Cyl p={[x, 1.05, -0.62]} r={0.09} h={2.0} c="#cfd3d6" /><Cyl p={[x, 1.95, -0.62]} r={0.095} h={0.14} c="#f08a3c" /><Cyl p={[x, 1.55, -0.62]} r={0.095} h={0.1} c="#f08a3c" /></group>)}
    {/* tangki */}
    {[-5.55, -5.2].map((x, i) => <group key={i}><Cyl p={[x, 0.78, -0.35]} r={0.26} h={1.5} c="#c8ced3" /><mesh position={[x, 1.53, -0.35]} scale={[1, 0.45, 1]}><sphereGeometry args={[0.26, 24, 16]} /><Mat c="#c8ced3" /></mesh><Bx p={[x + 0.27, 0.78, -0.35]} s={[0.03, 1.4, 0.06]} c="#8b949a" edge={false} /></group>)}
    {/* kolam pengendap + jembatan */}
    <Bx p={[-4.4, 0.13, 0.45]} s={[2.4, 0.14, 0.7]} c="#d9dbdd" />
    <Bx p={[-4.4, 0.2, 0.45]} s={[2.2, 0.04, 0.55]} c={P16.water} edge={false} />
    {[-5.1, -4.7, -4.3, -3.9, -3.5].map((x, i) => <Bx key={i} p={[x, 0.22, 0.45]} s={[0.03, 0.05, 0.55]} c="#eef3f6" edge={false} />)}
    <Bx p={[-4.4, 0.3, 0.45]} s={[2.3, 0.04, 0.1]} c="#f4f2ec" />
    {/* pompa + pipa biru */}
    {[-3.5, -3.25].map((x, i) => <Cyl key={i} p={[x, 0.2, 0.9]} r={0.1} h={0.28} c="#3b82d6" rot={[0, 0, Math.PI / 2]} />)}
    <Cyl p={[-3.1, -0.45, 0.86]} r={0.12} h={0.5} c="#cfd3d6" rot={[0, 0, Math.PI / 2]} />
    <Cyl p={[-3.4, 0.1, 0.86]} r={0.05} h={0.25} c="#3b82d6" />
    <Cyl p={[-5.55, 0.4, 0.2]} r={0.05} h={0.8} c="#3b82d6" />
    {[0, 1, 2, 3].map((i) => { const k = (t * 0.6 + i / 4) % 1; return <Ball key={i} p={[-5.9 + k * 1.0, 0.04, 0.45]} s={0.05} c="#e8f6fc" />; })}
    <Bx p={[-6.1, 0.0, 0.4]} s={[0.8, 0.1, 1.0]} c={P16.water} edge={false} />
  </group>
);
const FZ = 1.26;
const Pipe3: React.FC<{a: number; b: number; y?: number; t?: number}> = ({a, b, y = -0.45, t = 0}) => (
  <group>
    <Cyl p={[(a + b) / 2, y, FZ]} r={0.2} h={Math.abs(b - a)} c="#cfd3d6" op={0.5} rot={[0, 0, Math.PI / 2]} />
    <Cyl p={[(a + b) / 2, y, FZ]} r={0.14} h={Math.abs(b - a)} c={P16.water} rot={[0, 0, Math.PI / 2]} />
    {[-2.4, -0.9, 0.6, 2.1].map((x, i) => <mesh key={i} position={[x, y, FZ]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.2, 0.05, 10, 28]} /><Mat c="#9aa3a9" /></mesh>)}
    {Array.from({length: 14}).map((_, i) => { const k = (t * 0.4 + i / 14) % 1; return <Ball key={i} p={[a + (b - a) * k, y, FZ + 0.12]} s={0.05} c="#e8f6fc" />; })}
  </group>
);
const TestPoint: React.FC<{x: number; p: number; ok?: boolean}> = ({x, p, ok = true}) => (
  <group position={[x, -0.45, FZ - 0.05]}>
    <Cyl p={[0, 0.52, 0]} r={0.07} h={1.0} c="#9aa3a9" />
    <Cyl p={[0, 1.05, 0]} r={0.1} h={0.14} c="#f08a3c" />
    <Bx p={[0, 0.6, 0.1]} s={[0.26, 0.16, 0.1]} c="#7d868c" edge={false} />
    {p > 0 && <group scale={[0.5 + 0.5 * p, 0.5 + 0.5 * p, 0.5 + 0.5 * p]}>
      <Ball p={[0, 1.4, 0]} s={0.17} c={ok ? '#3f9a5a' : CORAL} />
      <mesh position={[0, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.38, 0.035, 12, 40]} /><meshBasicMaterial color={CORAL} transparent opacity={p} /></mesh>
    </group>}
  </group>
);
const FenceZ: React.FC<{x: number; z0: number; z1: number}> = ({x, z0, z1}) => (
  <group>
    <Bx p={[x, 0.3, (z0 + z1) / 2]} s={[0.04, 0.05, Math.abs(z1 - z0)]} c="#3a3d42" edge={false} />
    {Array.from({length: Math.round(Math.abs(z1 - z0) / 0.14)}).map((_, i) => <Bx key={i} p={[x, 0.2, Math.min(z0, z1) + i * 0.14]} s={[0.03, 0.4, 0.03]} c="#3a3d42" edge={false} />)}
  </group>
);
const Jalur: React.FC<{t: number; test: number}> = ({t, test}) => (
  <group>
    <Bx p={[0.55, -0.55, 0]} s={[7.1, 1.1, 2.4]} c="#8b5e3c" edge={false} />
    <Bx p={[0.55, 0.05, 0]} s={[7.1, 0.1, 2.4]} c="#82b46c" edge={false} />
    <Bx p={[0.1, 0.11, 0.78]} s={[6.2, 0.04, 0.46]} c="#4a4f55" edge={false} />
    {Array.from({length: 10}).map((_, i) => <Bx key={i} p={[-2.7 + i * 0.62, 0.14, 0.78]} s={[0.3, 0.02, 0.05]} c="#f4f2ec" edge={false} />)}
    <Bx p={[3.15, 0.11, 0.45]} s={[0.42, 0.04, 0.32]} c="#bfc3c6" edge={false} />
    <Bx p={[3.05, 0.11, -0.05]} s={[0.3, 0.04, 0.9]} c="#d9d2c3" edge={false} />
    <Instalasi t={t} />
    <Tree p={[-1.3, 0.1, -0.25]} /><Tree p={[-0.2, 0.1, -0.35]} k={1.25} /><Tree p={[0.9, 0.1, -0.2]} k={0.95} /><Tree p={[-0.7, 0.1, -0.95]} k={1.1} /><Tree p={[0.5, 0.1, -0.9]} />
    <Pipe3 a={-5.3} b={2.9} t={t} />
    <Cyl p={[-5.3, -0.12, FZ]} r={0.2} h={0.66} c="#cfd3d6" op={0.55} />
    <Cyl p={[-5.3, -0.12, FZ]} r={0.14} h={0.66} c={P16.water} />
    <Ball p={[-5.3, -0.45, FZ]} s={0.2} c="#cfd3d6" />
    <TestPoint x={-2.6} p={test} />
    <TestPoint x={-0.4} p={test} />
    <TestPoint x={1.3} p={0} />
    {/* sambungan rumah: dari pipa utama naik ke meter, lalu pipa menuju rumah */}
    <Cyl p={[2.9, -0.2, FZ]} r={0.075} h={0.5} c="#cfd3d6" />
    <Cyl p={[2.9, 0.12, FZ]} r={0.2} h={0.2} c="#f4f2ec" rot={[Math.PI / 2, 0, 0]} />
    <mesh position={[2.9, 0.12, FZ + 0.11]}><torusGeometry args={[0.17, 0.03, 10, 28]} /><meshBasicMaterial color={P16.water} /></mesh>
    <Cyl p={[3.2, -0.0, FZ - 0.5]} r={0.07} h={1.0} c="#cfd3d6" rot={[Math.PI / 2, 0, 0]} />
    <House p={[3.2, 0.1, -0.45]} />
    <Fence x0={2.3} x1={2.95} z={0.3} /><Fence x0={3.35} x1={4.05} z={0.3} /><FenceZ x={2.3} z0={-1.1} z1={0.3} /><FenceZ x={4.05} z0={-1.1} z1={0.3} />
  </group>
);

// ---------- keran wastafel (adegan hook ke-2 dan payoff) ----------
const Chrome: React.FC = () => <meshPhysicalMaterial color="#f4f6f8" metalness={0.5} roughness={0.28} clearcoat={1} clearcoatRoughness={0.08} />;
const Keran: React.FC<{t: number}> = ({t}) => (
  <group>
    <Bx p={[0, -0.1, 0]} s={[4.4, 0.2, 2.2]} c="#ecebe7" edge={false} />
    <Bx p={[0, 1.0, -1.0]} s={[4.4, 2.2, 0.12]} c="#e3e1db" edge={false} />
    <Bx p={[0.1, 0.03, 0.05]} s={[2.5, 0.07, 1.5]} c="#f7f7f5" edge={false} />
    <Bx p={[0.1, 0.075, 0.05]} s={[2.3, 0.02, 1.3]} c="#dfe9ee" edge={false} />
    <mesh position={[0.2, 0.1, -0.45]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.14, 0.035, 12, 32]} /><Chrome /></mesh>
    <mesh position={[1.1, 0.3, -0.45]} castShadow><cylinderGeometry args={[0.17, 0.2, 0.6, 28]} /><Chrome /></mesh>
    <mesh position={[0.65, 0.78, -0.45]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.09, 0.11, 0.95, 28]} /><Chrome /></mesh>
    <mesh position={[0.2, 0.7, -0.45]} castShadow><cylinderGeometry args={[0.1, 0.09, 0.14, 24]} /><Chrome /></mesh>
    <mesh position={[1.35, 0.78, -0.45]} rotation={[0, 0, 0.12]} castShadow><boxGeometry args={[0.55, 0.07, 0.12]} /><Chrome /></mesh>
    <Cyl p={[0.2, 0.38, -0.45]} r={0.045} h={0.62} c="#c9e8f7" op={0.85} />
    {[0, 1, 2, 3, 4].map((i) => { const k = (t * 1.8 + i / 5) % 1; return <Ball key={i} p={[0.2, 0.68 - k * 0.6, -0.45]} s={0.05} c="#f3fafd" />; })}
    {[0, 1, 2, 3, 4, 5].map((i) => { const a = i * 1.05 + t * 6; return <Ball key={i} p={[0.2 + Math.cos(a) * 0.2, 0.12 + 0.07 * Math.abs(Math.sin(t * 9 + i)), -0.45 + Math.sin(a) * 0.2]} s={0.045} c="#e8f6fc" />; })}
    <mesh position={[0.2, 0.085, -0.45]} rotation={[Math.PI / 2, 0, 0]} scale={1 + 0.15 * Math.sin(t * 8)}><torusGeometry args={[0.3, 0.015, 8, 36]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.8} /></mesh>
  </group>
);


const INK2 = '#1c1c1e';
const SK = {stroke: INK2, strokeWidth: 3, strokeLinejoin: 'round' as const};
// ---------- wastafel + keran leher angsa: ilustrasi datar gaya channel + aliran air dari kode ----------
const KeranArt: React.FC = () => (
  <svg width={1280} height={720} viewBox="0 0 1280 720" style={{display: 'block', overflow: 'visible'}}>
    <defs><filter id="shk" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#1c1c1e" floodOpacity="0.18" /></filter></defs>
    <g filter="url(#shk)">
      <rect x={320} y={470} width={640} height={230} rx={16} fill="#f6f3ec" {...SK} />
      <line x1={640} y1={478} x2={640} y2={694} stroke={INK2} strokeWidth={3} />
      <rect x={612} y={500} width={8} height={40} rx={4} fill="#9aa3a9" {...SK} strokeWidth={2} /><rect x={660} y={500} width={8} height={40} rx={4} fill="#9aa3a9" {...SK} strokeWidth={2} />
      <polygon points="330,330 950,330 992,440 288,440" fill="#efe6d4" {...SK} />
      <rect x={288} y={438} width={704} height={40} rx={12} fill="#e2d6bf" {...SK} />
      <rect x={366} y={372} width={500} height={64} rx={30} fill="#4a4f55" {...SK} />
      <rect x={392} y={384} width={448} height={40} rx={20} fill="#2f3338" />
      <ellipse cx={620} cy={414} rx={24} ry={9} fill="#14161a" stroke="#6b7178" strokeWidth={3} />
      <rect x={360} y={296} width={36} height={54} rx={9} fill={CORAL} {...SK} /><rect x={372} y={270} width={12} height={26} fill="#4a4f55" {...SK} strokeWidth={2} /><rect x={372} y={266} width={32} height={9} rx={4} fill="#4a4f55" {...SK} strokeWidth={2} />
      <rect x={880} y={346} width={84} height={22} rx={8} fill="#2f3338" {...SK} /><circle cx={906} cy={357} r={7} fill="#9aa3a9" stroke={INK2} strokeWidth={2} /><circle cx={940} cy={357} r={7} fill="#9aa3a9" stroke={INK2} strokeWidth={2} />
      <path d="M 780 336 L 780 232 Q 780 148 700 148 Q 620 148 620 232 L 620 266" fill="none" stroke={INK2} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 780 336 L 780 232 Q 780 148 700 148 Q 620 148 620 232 L 620 266" fill="none" stroke="#8d949b" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 770 300 L 770 232 Q 770 160 700 160" fill="none" stroke="#c4cad0" strokeWidth={5} strokeLinecap="round" />
      <rect x={756} y={326} width={48} height={30} rx={8} fill="#6b7178" {...SK} />
      <rect x={602} y={252} width={36} height={30} rx={10} fill="#4a4f55" {...SK} />
      <rect x={790} y={294} width={52} height={13} rx={6} fill="#8d949b" {...SK} strokeWidth={2} transform="rotate(-22 790 300)" />
    </g>
  </svg>
);
export const KeranFlat: React.FC<{t: number; flow: number; cx?: number; cy?: number; sc?: number; y0?: number; clip?: [number, number]}> = ({t, flow, cx = 640, cy = 330, sc = 1.45, y0 = 1130, clip}) => {
  const off = clip ? clip[0] : 0;
  const tf = `translate(${540 - cx * sc}px, ${y0 - off - cy * sc}px) scale(${sc})`;
  const box: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transformOrigin: '0 0', transform: tf};
  const h = 132 * Math.min(1, flow * 1.4);
  const ph = (t * 1.25) % 1;
  const body = (
    <div style={box}>
      <KeranArt />
      {flow > 0 && <>
        <div style={{position: 'absolute', left: 614, top: 280, width: 12, height: h, borderRadius: 6, opacity: 0.95, backgroundImage: 'repeating-linear-gradient(180deg, #7cc4f0 0px, #7cc4f0 14px, #f3fbff 14px, #f3fbff 22px)', backgroundPositionY: (t * 280) % 22, boxShadow: '0 0 8px 2px rgba(255,255,255,0.8)'}} />
        {[0, 1, 2].map((i) => { const k = (ph + i / 3) % 1; return <div key={i} style={{position: 'absolute', left: 620 - (14 + 14 * k), top: 414 - 4 - 2 * k, width: 2 * (14 + 14 * k), height: 8 + 6 * k, borderRadius: '50%', border: '3px solid #f3fbff', opacity: flow * (1 - k)}} />; })}
        {[0, 1, 2, 3, 4, 5].map((i) => { const k = (t * 1.6 + i / 6) % 1, dx = (i - 2.5) * 9; return <div key={i} style={{position: 'absolute', left: 620 + dx * k - 4, top: 412 - 4 * k * (1 - k) * 56, width: 8, height: 8, borderRadius: '50%', background: '#f3fbff', opacity: flow * (1 - 0.6 * k), boxShadow: '0 0 6px rgba(120,200,245,0.9)'}} />; })}
      </>}
    </div>
  );
  return clip ? <div style={{position: 'absolute', left: 0, top: clip[0], width: 1080, height: clip[1], overflow: 'hidden'}}>{body}</div> : body;
};

// ---------- panci rebus ----------
const MICROS: [number, number, number][] = [[-0.45, 0.35, 0], [0.1, 0.55, 0.1], [0.5, 0.3, -0.1], [-0.2, 0.7, 0.1], [0.4, 0.62, 0.1], [-0.55, 0.62, 0], [0.0, 0.25, 0.1]];
const Pot: React.FC<{t: number; dead: number; back?: number; ground?: boolean}> = ({t, dead, back = 0, ground = true}) => (
  <group>
    {ground && <Ground w={8} />}
    <Bx p={[0, 0.3, 0]} s={[3.0, 0.6, 1.8]} c="#c5cacf" />
    <Bx p={[0, 0.62, 0]} s={[2.9, 0.06, 1.7]} c="#aeb4b9" edge={false} />
    <Bx p={[0, 0.3, 0.92]} s={[2.5, 0.36, 0.03]} c="#3b3f45" edge={false} />
    <Cyl p={[-0.4, 0.3, 0.97]} r={0.15} h={0.1} c="#1c1c1e" rot={[Math.PI / 2, 0, 0]} />
    <Bx p={[-0.4, 0.38, 1.03]} s={[0.04, 0.12, 0.02]} c="#f4f2ec" edge={false} />
    <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.55, 0.1, 12, 36]} /><Mat c="#2c2f33" /></mesh>
    {[0, 60, 120].map((d, i) => <Bx key={i} p={[0, 0.88, 0]} s={[1.7, 0.07, 0.1]} c="#2c2f33" edge={false} rot={[0, (d * Math.PI) / 180, 0]} />)}
    {Array.from({length: 12}).map((_, i) => { const a = (i / 12) * Math.PI * 2, fl = 0.85 + 0.25 * Math.sin(t * 14 + i * 1.7); return <group key={i} position={[Math.cos(a) * 0.52, 0.8, Math.sin(a) * 0.52]} scale={[1, fl, 1]}><mesh position={[0, 0.1, 0]}><coneGeometry args={[0.065, 0.24, 10]} /><meshBasicMaterial color="#5aa7e8" /></mesh><mesh position={[0, 0.06, 0]}><coneGeometry args={[0.035, 0.13, 10]} /><meshBasicMaterial color="#f08a3c" /></mesh></group>; })}
    <Cyl p={[0, 1.65, 0]} r={1.0} h={1.5} c="#e8edf0" op={0.3} open />
    <Cyl p={[0, 1.55, 0]} r={0.93} h={1.2} c={P16.water} op={0.7} />
    <Bx p={[-1.22, 2.0, 0]} s={[0.35, 0.12, 0.12]} c="#303338" />
    <Bx p={[1.22, 2.0, 0]} s={[0.35, 0.12, 0.12]} c="#303338" />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const k = (t * 0.9 + i * 0.37) % 1; return <Ball key={i} p={[-0.7 + (i % 4) * 0.45, 1.0 + k * 1.15, 0.5]} s={0.07 + 0.08 * (i % 3) / 2} c="#f3f9fc" />; })}
    {MICROS.map(([x, y, z], i) => {
      const kind = i % 3, live = (1 - Math.min(1, Math.max(0, dead * 1.4 - kind * 0.2))) * (1 - back) + back * Math.min(1, Math.max(0, back * 1.4 - i * 0.05));
      const s = 0.13 * Math.max(0.001, live);
      const pos: [number, number, number] = [x, 1.0 + y * 0.9, 0.45 + z];
      return kind === 0 ? <Ball key={i} p={pos} s={s} c={CORAL} sx={1.7} /> : kind === 1 ? <Ball key={i} p={pos} s={s * 0.85} c="#7a5bd1" /> : <mesh key={i} position={pos} scale={s * 1.7} rotation={[0.8, 0, 0]}><torusGeometry args={[1, 0.28, 10, 24]} /><meshPhysicalMaterial color="#6f8a4a" /></mesh>;
    })}
  </group>
);
const DirtyGlass: React.FC<{t: number; fill: number; germs: number; clean?: boolean}> = ({fill, germs, clean}) => (
  <group>
    <Ground w={6} />
    <Cyl p={[0, 0.9, 0]} r={0.62} h={1.8} c="#e8edf0" op={0.35} open />
    <Cyl p={[0, 0.13 + fill * 0.6, 0]} r={0.58} h={0.1 + fill * 1.2} c={P16.water} op={0.7} />
    {!clean && <Ball p={[-0.2, 0.1, 0.4]} s={0.2} c="#8a7d6b" sx={1.6} />}
    {!clean && <Ball p={[0.25, 0.07, 0.45]} s={0.14} c="#6f6252" sx={1.4} />}
    {[0, 1, 2, 3, 4].map((i) => <Ball key={i} p={[-0.3 + i * 0.15, 0.5 + (i % 3) * 0.3, 0.4]} s={0.12 * germs} c={i % 2 ? CORAL : '#7a5bd1'} sx={i % 2 ? 1.7 : 1} />)}
  </group>
);

// ---------- depot ----------
const Galon: React.FC<{p: [number, number, number]; s?: number; c?: string}> = ({p, s = 1, c = P16.water}) => (
  <group position={p} scale={s}>
    <Cyl p={[0, 0.55, 0]} r={0.42} h={1.1} c={c} op={0.6} />
    <Cyl p={[0, 1.2, 0]} r={0.2} h={0.25} c={c} op={0.7} />
    <Cyl p={[0, 1.38, 0]} r={0.14} h={0.12} c="#f8f6f0" />
  </group>
);
const Depot: React.FC<{t: number; wash?: number}> = ({t, wash = 0}) => (
  <group>
    <Ground w={9} />
    <Bx p={[-0.5, 0.7, 0]} s={[2.4, 1.4, 1.3]} c="#fbfaf6" />
    <Prism p={[-0.5, 1.4, 0]} w={1.5} h={0.5} d={2.6} c="#f08a3c" rot={[0, Math.PI / 2, 0]} />
    <Cyl p={[-1.3, 2.0, 0]} r={0.27} h={0.5} c="#c8ced3" />
    <Cyl p={[-1.3, 1.45, 0.5]} r={0.05} h={0.35} c="#9aa3a9" />
    <Bx p={[-0.5, 0.62, 0.66]} s={[1.3, 0.8, 0.04]} c="#2b2e33" edge={false} />
    <Bx p={[-0.5, 0.34, 0.9]} s={[1.5, 0.1, 0.42]} c="#a06a42" />
    <Bx p={[-0.5, 0.15, 0.9]} s={[1.4, 0.3, 0.36]} c="#d9c9a8" />
    <Bx p={[-0.5, 1.12, 0.95]} s={[1.7, 0.07, 0.75]} c="#e2563f" rot={[0.28, 0, 0]} />
    <Bx p={[-0.5, 1.28, 0.7]} s={[1.5, 0.22, 0.05]} c="#3b82d6" />
    <Galon p={[-0.3, 0.39, 0.9]} s={0.5} />
    <Cyl p={[-0.3, 0.98, 0.9]} r={0.035} h={0.3} c="#9aa3a9" />
    {wash > 0 && [0, 1, 2, 3].map((i) => { const k = (t * 1.5 + i / 4) % 1; return <Ball key={i} p={[-0.3, 0.9 - k * 0.45, 0.9]} s={0.04} c="#bfe3f6" />; })}
    <Galon p={[1.2, 0, 0.5]} s={0.8} /><Galon p={[1.7, 0, 0.5]} s={0.8} /><Galon p={[1.45, 0, -0.15]} s={0.8} />
  </group>
);

// ---------- overlay 2D ----------
const Ring10: React.FC<{p: number; x: number; y: number}> = ({p, x, y}) => {
  if (p <= 0) return null;
  const left = Math.max(0, Math.ceil(10 * (1 - p)));
  return (
    <div style={{position: 'absolute', left: x - 90, top: y - 90, width: 180, height: 180, borderRadius: '50%', background: `conic-gradient(${CORAL} ${p * 360}deg, rgba(250,249,246,0.95) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 30px rgba(28,28,30,0.2)'}}>
      <div style={{width: 138, height: 138, borderRadius: '50%', background: '#faf9f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 72, color: INK}}>{left}</div>
    </div>
  );
};
const Clock24: React.FC<{p: number; x: number; y: number}> = ({p, x, y}) => p <= 0 ? null : (
  <div style={{position: 'absolute', left: x - 90, top: y - 90, width: 180, height: 180, borderRadius: '50%', background: '#faf9f6', border: `8px solid ${INK}`, boxShadow: '0 12px 30px rgba(28,28,30,0.2)'}}>
    <div style={{position: 'absolute', left: 82, top: 22, width: 8, height: 68, borderRadius: 4, background: CORAL, transformOrigin: '4px 60px', transform: `rotate(${p * 360}deg)`}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 28, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 30, color: INK}}>24 JAM</div>
  </div>
);
const Timeline: React.FC<{t: number; a: number; gap?: number; you?: number}> = ({t, a, gap = 0, you = 0}) => {
  const k = r(t, a, a + 0.5);
  if (k <= 0) return null;
  const xs = [90, 330, 570, 810], names = ['bulan 0', 'bulan 3', 'bulan 6', 'bulan 9'];
  return (
    <div style={{position: 'absolute', left: 60, top: 655, width: 960, height: 225, opacity: k, borderRadius: 28, background: 'rgba(250,249,246,0.88)', boxShadow: '0 10px 30px rgba(28,28,30,0.15)'}}>
      <div style={{position: 'absolute', left: 30, right: 30, top: 80, height: 10, borderRadius: 5, background: INK, opacity: 0.85}} />
      {xs.map((x, i) => <div key={i} style={{position: 'absolute', left: x - 6, top: 56, textAlign: 'center', transform: `translateX(-50%) scale(${Math.min(1, Math.max(0, k * 3 - i * 0.5))})`}}>
        <div style={{margin: '0 auto', width: 58, height: 58, borderRadius: '50%', background: CORAL, border: '5px solid #faf9f6', boxShadow: '0 6px 16px rgba(28,28,30,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 30, color: '#faf9f6'}}>{i + 1}</div>
        <div style={{marginTop: 12, fontFamily: 'Inter', fontWeight: 800, fontSize: 28, color: INK, whiteSpace: 'nowrap', position: 'relative', left: 6}}>{names[i]}</div>
      </div>)}
      {gap > 0 && [210, 450, 690].map((x, i) => { const g = Math.min(1, Math.max(0, gap * 3 - i)); return <div key={i} style={{position: 'absolute', left: x, top: 22, transform: 'translateX(-50%)', fontFamily: 'Inter', fontWeight: 900, fontSize: 34, color: CORAL, opacity: g}}>+3 bln</div>; })}
      {you > 0 && <div style={{position: 'absolute', left: 330, top: 168, width: 200, padding: '6px 0', textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 34, color: '#faf9f6', background: CORAL, borderRadius: 16, opacity: you, transform: `scale(${0.7 + 0.3 * you})`}}>KAMU</div>}
    </div>
  );
};
const StatCard: React.FC<{p: number; x: number; y: number; big: string; small: string}> = ({p, x, y, big, small}) => p <= 0 ? null : (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * p})`, opacity: p, padding: '14px 34px 18px', borderRadius: 22, background: 'rgba(250,249,246,0.97)', border: `5px solid ${CORAL}`, textAlign: 'center', fontFamily: 'Inter', color: INK, boxShadow: '0 12px 34px rgba(28,28,30,0.2)'}}>
    <div style={{fontSize: 92, fontWeight: 900, letterSpacing: -2, color: CORAL, lineHeight: 1}}>{big}</div>
    <div style={{fontSize: 34, fontWeight: 700, marginTop: 4}}>{small}</div>
  </div>
);

// ---------- SFX ----------
const SFX: [string, number, number][] = [
  ['drip', 0.4, 0.5], ['drip', 1.4, 0.45], ['tick', 3.9, 0.35], ['pop', 5.3, 0.4],
  ['whoosh', 6.35, 0.3], ['pop', 10.8, 0.4], ['pop', 12.4, 0.4], ['ting', 13.2, 0.35],
  ['whoosh', 16.25, 0.3], ['flow', 17.0, 0.25], ['pop', 19.4, 0.3], ['crystal', 22.8, 0.3], ['ting', 23.6, 0.3], ['ting', 24.1, 0.3], ['ting', 24.6, 0.3],
  ['thud', 25.8, 0.4], ['drip', 26.9, 0.4], ['pop', 27.6, 0.4],
  ['whoosh', 28.75, 0.3], ['pop', 30.9, 0.4], ['tick', 31.4, 0.3], ['tick', 32.0, 0.3], ['ting', 32.6, 0.4], ['flow', 33.6, 0.25], ['tick', 35.0, 0.3], ['thud', 36.9, 0.4], ['pop', 40.7, 0.4],
  ['whoosh', 42.45, 0.3], ['chime', 44.3, 0.4],
  ['whoosh', 46.35, 0.3], ['pop', 47.8, 0.4], ['pop', 49.9, 0.4],
  ['whoosh', 52.45, 0.3], ['pop', 53.7, 0.35], ['chime', 56.0, 0.4],
];

export const Video16: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, ms = t * 1000;
  return (
    <AbsoluteFill>
      <PaperPlus />

      {/* A. hook 1: PDAM menyambung air ke rumah (pan dari instalasi ke rumah) */}
      <Seg a={0} b={3.9}>
        <Stage cam={camAt(t, [[0, [-3.0, 1.25, 150]], [3.9, [2.2, 1.25, 156]]])}><Jalur t={t} test={0} /></Stage>
      </Seg>
      {/* A2. hook 2: air mengalir dari keran (kata "keran rumahmu") */}
      <Seg a={3.9} b={B.standar}>
        <KeranFlat t={t} flow={r(t, 4.0, 4.5)} cx={640} cy={330} sc={1.45} y0={1100} />
        <Mark x={540} y={1250} ok={false} p={r(t, 5.4, 5.8)} text="bukan diuji di sini" />
      </Seg>
      {/* B. standar: jalur lebar, dua titik uji, rumah di luar titik uji */}
      <Seg a={B.standar} b={B.rebus}>
        <Stage cam={camAt(t, [[6.36, [-0.8, 1.3, 104]], [16.2, [-0.8, 1.3, 108]]])}><Jalur t={t} test={Math.max(r(t, 10.5, 11.2), 0.001)} /></Stage>
        <StatCard p={r(t, 7.3, 7.8) * (1 - r(t, 9.4, 9.7))} x={540} y={745} big="0" small="E. coli per 100 ml" />
        <Chip x={190} y={1330} p={r(t, 10.8, 11.2)} text="instalasi" color={P16.water} size={36} />
        <Chip x={540} y={1330} p={r(t, 12.4, 12.8)} text="jaringan pipa" color={P16.water} size={36} />
        <Chip x={880} y={1330} p={r(t, 14.2, 14.6)} text="di luar titik uji" color={CORAL} size={36} />
      </Seg>
      {/* C. perbandingan: langsung dari keran (atas) vs direbus dulu (bawah) */}
      <Seg a={B.rebus} b={25.4}>
        <KeranFlat t={t} flow={1} cx={640} cy={300} sc={0.66} y0={830} clip={[640, 330]} />
        <Stage cam={camAt(t, [[16.26, [0, 1.78, 215]], [25.4, [0, 1.78, 222]]])}>
          <group position={[0, 0, 0.4]} scale={0.62}><Pot t={t} dead={r(t, 22.6, 25.0)} ground={false} /></group>
        </Stage>
        <Chip x={250} y={690} p={r(t, 17.0, 17.4)} text="langsung dari keran" color={P16.water} size={34} />
        <Chip x={250} y={1110} p={r(t, 17.4, 17.8)} text="direbus dulu" color={CORAL} size={34} />
        <StatCard p={r(t, 18.6, 19.0) * (1 - r(t, 25.0, 25.3))} x={880} y={880} big="?" small="tidak diuji di titik ini" />
        <Chip x={880} y={1130} p={r(t, 23.5, 23.9) * (1 - r(t, 25.0, 25.3))} text="kuman mati" color="#3f9a5a" size={36} />
      </Seg>
      {/* C2. gelas kotor, mikroba balik */}
      <Seg a={25.4} b={B.isi}>
        <Stage cam={camAt(t, [[25.4, [0, 1.0, 300]], [28.77, [0, 1.0, 320]]])}><DirtyGlass t={t} fill={r(t, 25.6, 26.6)} germs={r(t, 27.3, 28.0, Easing.out(Easing.back(2)))} /></Stage>
        <Chip x={540} y={1150} p={r(t, 26.5, 26.9)} text="wadah kotor" color={P16.dust} size={40} />
      </Seg>
      {/* D. depot */}
      <Seg a={B.isi} b={B.payoff}>
        <Stage cam={camAt(t, [[28.77, [0.3, 2.3, 158]], [42.5, [0.3, 2.3, 164]]])}><Depot t={t} wash={r(t, 33.4, 33.9) * (1 - r(t, 35.0, 35.3))} /></Stage>
        {(t < 33.2 || t >= 39.0) && <Timeline t={t} a={t < 33.2 ? 30.6 : 39.0} gap={r(t, 32.3, 32.8)} you={r(t, 40.7, 41.2)} />}
        <Ring10 p={r(t, 33.6, 35.0) * (t < 35.2 ? 1 : 0)} x={870} y={780} />
        <Clock24 p={r(t, 36.0, 38.4) * (t > 35.4 && t < 39.0 ? 1 : 0)} x={870} y={780} />
        {t > 35.4 && t < 39.0 && <Mark x={540} y={1250} ok={false} p={r(t, 37.9, 38.3)} text="lebih dari sehari" />}
      </Seg>
      {/* E. payoff: PDAM (instalasi) dan depot, dua pihak penguji */}
      <Seg a={B.payoff} b={B.aksi}>
        <Stage cam={camAt(t, [[42.5, [0, 1.6, 150]], [46.37, [0, 1.6, 158]]])}>
          <Ground w={12} />
          <group position={[0.36, 0, 0]} scale={0.62}><Instalasi t={t} /></group>
          <TestPoint x={-0.5} p={r(t, 43.0, 43.6)} />
          <group position={[2.35, 0, 0]} scale={0.7}><Depot t={t} wash={1} /></group>
        </Stage>
        <Chip x={290} y={1220} p={r(t, 43.8, 44.2)} text="PDAM" color={P16.water} size={40} />
        <Chip x={800} y={1220} p={r(t, 44.2, 44.6)} text="depot" color={CORAL} size={40} />
      </Seg>
      {/* F1. aksi: air PDAM, rebus dulu */}
      <Seg a={B.aksi} b={48.9}>
        <Stage cam={camAt(t, [[46.37, [0, 1.55, 200]], [48.9, [0, 1.55, 210]]])}><Pot t={t} dead={r(t, 47.9, 48.6)} /></Stage>
        <Mark x={540} y={1325} ok p={r(t, 47.9, 48.3)} text="rebus dulu" />
      </Seg>
      {/* F2. aksi: isi ulang, tanya uji lab */}
      <Seg a={48.9} b={B.cta}>
        <Stage cam={camAt(t, [[48.9, [0.3, 2.3, 158]], [52.5, [0.3, 2.3, 166]]])}><Depot t={t} wash={1} /></Stage>
        <Mark x={540} y={1325} ok p={r(t, 50.0, 50.4)} text="tanya uji lab" />
      </Seg>
      {/* G. CTA */}
      <Seg a={B.cta} b={B.end}>
        <Stage cam={camAt(t, [[52.5, [0, 1.6, 230]], [56.7, [0, 1.6, 238]]])}>
          <Ground w={8} />
          <group position={[-0.9, 0, 0]}><DirtyGlass t={t} fill={1} germs={0} clean /></group>
          <Galon p={[1.1, 0, 0]} s={1.0} />
        </Stage>
        <Chip x={300} y={1180} p={r(t, 53.7, 54.1)} text="PDAM direbus" color={P16.water} size={40} />
        <Chip x={790} y={1180} p={r(t, 54.0, 54.4)} text="isi ulang" color={CORAL} size={40} />
      </Seg>

      {/* teks layar */}
      <Title t={t} a={0.5} b={B.standar} small="Boleh langsung diminum?" big="DIUJI DI MANA?" bigAt={4.0} size={96} />
      <Title t={t} a={B.standar} b={B.rebus} small="Standar air minum" big="NOL E. COLI" bigAt={7.2} size={100} />
      <Title t={t} a={B.rebus} b={25.4} small="Mendidih besar," big="CUKUP (WHO)" bigAt={19.5} size={100} />
      <Title t={t} a={25.4} b={B.isi} small="Wadah kotor," big="TERCEMAR LAGI" bigAt={27.4} size={96} />
      <Title t={t} a={B.isi} b={33.2} small="Depot diuji lab" big="3 BULAN SEKALI" bigAt={32.1} size={92} />
      <Title t={t} a={33.2} b={35.4} small="Galon dibilas" big="10 DETIK" bigAt={34.5} size={110} />
      <Title t={t} a={35.4} b={39.0} small="Disimpan di depot" big="MAKS. 1×24 JAM" bigAt={37.0} size={90} />
      <Title t={t} a={39.0} b={B.payoff} small="Di antara dua uji," big="SISANYA KAMU" bigAt={40.7} size={96} />
      <Title t={t} a={B.payoff} b={B.aksi} small="Air aman itu soal" big="SIAPA YANG MENGUJI" bigAt={43.6} size={84} />
      <Title t={t} a={B.aksi} b={48.9} small="Minum air PDAM?" big="REBUS DULU" bigAt={47.7} size={104} />
      <Title t={t} a={48.9} b={B.cta} small="Beli isi ulang?" big="TANYA UJI LAB" bigAt={49.9} size={100} />
      <Title t={t} a={B.cta} b={55.7} small="Kamu minum" big="YANG MANA?" bigAt={53.3} size={110} />

      <Kicker text="FAKTA RUMAH · #16" y={292} start={0} />
      <TikTokBox text="Air PDAM boleh langsung diminum?" p={r(t, 0.2, 1.0, Easing.linear)} y={338} size={40} />
      <FollowButton start={Math.round(54.3 * FPS)} click={Math.round(55.3 * FPS)} y={760} />
      <Captions ms={ms} />

      <Audio src={staticFile('v16/vo.mp3')} />
      <Audio src={staticFile('sfx/ambient.wav')} volume={0.08} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
      <Grain o={0.08} />
    </AbsoluteFill>
  );
};
