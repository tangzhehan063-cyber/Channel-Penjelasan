// Video #15 "Air PDAM direbus vs galon isi ulang" (VS). DNA v8–14, kamera 2,5D ortografis, TANPA Ornament (perintah user 16 Nov).
// VO ElevenLabs Riri Rida (flow Jz54PYCD0D5rHTinLwWx), timestamp public/v15/words.json (align_teks). Naskah: naskah/video-15-air-pdam-rebus-vs-galon.md
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Grain, TikTokBox, PatternBreak, C} from '../aset/Aset';
import {PaperPlus, Kicker, FollowButton} from '../aset/Gabung';
import {Env} from '../pengetahuan/Scene';
import {Rig} from '../v13/Mood13';
import words from '../../public/v15/words.json';
import {Edges, RoundedBox} from '@react-three/drei';

export const P15 = {coral: '#e2563f', ink: '#1c1c1e', ac: '#f4f2ec', acEdge: '#cfcac0', wall: '#e9e1d2', wallOut: '#b9c7cf', floor: '#d9d4c7', ground: '#a8b59a', bed: '#5d8fd6', pillow: '#f8f6f0', fin: '#7fa6c4', water: '#4fa3d9', hose: '#e8e3d8', moss: '#6f8a4a', dust: '#8a7d6b'};
export const FPS = 30;
export const V15_END = 56.7;
export const V15_FRAMES = Math.ceil(V15_END * FPS);
const CC_TOP = 1400, CORAL = P15.coral, INK = C.ink;
const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ---------- beat (detik dari words.json) ----------

// ---------- beat (detik dari words.json, Scribe) ----------
const B = {hook: 0, standar: 6.36, rebus: 16.26, isi: 28.77, payoff: 42.5, aksi: 46.37, cta: 52.5, end: V15_END};
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
  <mesh position={p} scale={[s, s * 1.25, s]}><sphereGeometry args={[1, 20, 16]} /><meshPhysicalMaterial color={P15.water} roughness={0.1} clearcoat={1} transmission={0.2} /></mesh>
);
// unit AC dinding: badan putih membulat, sirip udara, lampu kecil
const Mark: React.FC<{x: number; y: number; ok: boolean; p: number; text: string}> = ({x, y, ok, p, text}) => p > 0 ? (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * p})`, opacity: p, display: 'flex', alignItems: 'center', gap: 16, padding: '12px 26px', borderRadius: 20, background: 'rgba(250,249,246,0.97)', border: `5px solid ${ok ? '#3f9a5a' : CORAL}`, fontFamily: 'Inter', fontWeight: 800, fontSize: 46, color: INK, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(28,28,30,0.18)'}}>
    <span style={{color: ok ? '#3f9a5a' : CORAL, fontSize: 54, fontWeight: 900}}>{ok ? '✓' : '✗'}</span>{text}
  </div>
) : null;


// ---------- objek 3D air ----------
const Cyl: React.FC<{p: [number, number, number]; r: number; h: number; c: string; rot?: [number, number, number]; op?: number; open?: boolean}> = ({p, r: rad, h, c, rot, op = 1, open}) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[rad, rad, h, 36, 1, open]} /><meshPhysicalMaterial color={c} roughness={0.5} clearcoat={0.4} transparent={op < 1} opacity={op} side={open ? 2 : 0} /></mesh>
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
    {[0, 1, 2].map((i) => { const k = ((t * 1.4 + i / 3) % 1); return flow > 0 ? <Ball key={i} p={[0.55, -0.1 - k * 0.7, 0]} s={0.055 * flow} c={P15.water} /> : null; })}
  </group>
);
const House: React.FC<{p: [number, number, number]}> = ({p}) => (
  <group position={p}>
    <Bx p={[0, 0.6, 0]} s={[1.7, 1.2, 1.1]} c="#efe8da" />
    <mesh position={[0, 1.55, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1.3, 1, 0.9]} castShadow><coneGeometry args={[1.0, 0.75, 4]} /><Mat c={CORAL} /><Edges color="#1c1c1e" lineWidth={1.5} /></mesh>
    <Cyl p={[0.35, 2.15, 0]} r={0.28} h={0.5} c="#b8c4cb" />
    <Bx p={[-0.35, 0.55, 0.57]} s={[0.4, 0.6, 0.04]} c="#8a5634" />
  </group>
);
const Plant: React.FC<{p: [number, number, number]}> = ({p}) => (
  <group position={p}>
    <Bx p={[0, 0.55, 0]} s={[1.0, 1.1, 0.8]} c="#dfe5e8" />
    <Cyl p={[-0.9, 0.55, 0.0]} r={0.38} h={1.1} c="#b8c4cb" />
    <Cyl p={[0.9, 0.55, 0.0]} r={0.38} h={1.1} c="#b8c4cb" />
    <Bx p={[0, 1.2, 0]} s={[1.3, 0.14, 0.9]} c={CORAL} />
  </group>
);
const Pipe3: React.FC<{a: number; b: number; y?: number; flow?: number; t?: number}> = ({a, b, y = 0.32, flow = 0, t = 0}) => (
  <group>
    <Cyl p={[(a + b) / 2, y, 0.3]} r={0.1} h={Math.abs(b - a)} c={PIPE} rot={[0, 0, Math.PI / 2]} />
    {flow > 0 && [0, 1, 2, 3, 4, 5, 6].map((i) => { const k = (t * 0.5 + i / 7) % 1; return <Ball key={i} p={[a + (b - a) * k, y, 0.42]} s={0.05} c={P15.water} />; })}
  </group>
);
const TestPoint: React.FC<{x: number; p: number; ok?: boolean}> = ({x, p, ok = true}) => (
  <group position={[x, 0.32, 0.3]} scale={[0.5 + 0.5 * p, 0.5 + 0.5 * p, 0.5 + 0.5 * p]}>
    <Cyl p={[0, 0.5, 0]} r={0.05} h={0.9} c="#7d868c" />
    <Ball p={[0, 1.05, 0]} s={0.2} c={ok ? '#3f9a5a' : CORAL} />
    <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.42, 0.035, 12, 40]} /><meshBasicMaterial color={CORAL} transparent opacity={p} /></mesh>
  </group>
);
const Jalur: React.FC<{t: number; test: number; hose?: number}> = ({t, test}) => (
  <group>
    <Ground w={14} />
    <Plant p={[-4.6, 0, 0]} />
    <Pipe3 a={-3.5} b={2.1} flow={1} t={t} />
    <TestPoint x={-3.1} p={test} />
    <TestPoint x={-0.7} p={test} />
    <House p={[3.0, 0, 0]} />
    <Faucet p={[2.05, 0.55, 0.9]} t={t} flow={1} />
  </group>
);

// ---------- panci rebus ----------
const MICROS: [number, number, number][] = [[-0.45, 0.35, 0], [0.1, 0.55, 0.1], [0.5, 0.3, -0.1], [-0.2, 0.7, 0.1], [0.4, 0.62, 0.1], [-0.55, 0.62, 0], [0.0, 0.25, 0.1]];
const Pot: React.FC<{t: number; dead: number; back?: number}> = ({t, dead, back = 0}) => (
  <group>
    <Ground w={8} />
    <Bx p={[0, 0.35, 0]} s={[3.0, 0.7, 1.5]} c="#dfe3e6" />
    <Bx p={[0, 0.72, 0.5]} s={[1.6, 0.05, 0.5]} c="#303338" edge={false} />
    {[-0.5, -0.17, 0.17, 0.5].map((x, i) => <mesh key={i} position={[x, 0.82, 0.5]} scale={[1, 0.8 + 0.3 * Math.sin(t * 12 + i), 1]}><coneGeometry args={[0.1, 0.3, 12]} /><meshBasicMaterial color={CORAL} /></mesh>)}
    <Cyl p={[0, 1.65, 0]} r={1.0} h={1.5} c="#e8edf0" op={0.3} open />
    <Cyl p={[0, 1.55, 0]} r={0.93} h={1.2} c={P15.water} op={0.7} />
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
    <Cyl p={[0, 0.13 + fill * 0.6, 0]} r={0.58} h={0.1 + fill * 1.2} c={P15.water} op={0.7} />
    {!clean && <Ball p={[-0.2, 0.1, 0.4]} s={0.2} c="#8a7d6b" sx={1.6} />}
    {!clean && <Ball p={[0.25, 0.07, 0.45]} s={0.14} c="#6f6252" sx={1.4} />}
    {[0, 1, 2, 3, 4].map((i) => <Ball key={i} p={[-0.3 + i * 0.15, 0.5 + (i % 3) * 0.3, 0.4]} s={0.12 * germs} c={i % 2 ? CORAL : '#7a5bd1'} sx={i % 2 ? 1.7 : 1} />)}
  </group>
);

// ---------- depot ----------
const Galon: React.FC<{p: [number, number, number]; s?: number; c?: string}> = ({p, s = 1, c = P15.water}) => (
  <group position={p} scale={s}>
    <Cyl p={[0, 0.55, 0]} r={0.42} h={1.1} c={c} op={0.6} />
    <Cyl p={[0, 1.2, 0]} r={0.2} h={0.25} c={c} op={0.7} />
    <Cyl p={[0, 1.38, 0]} r={0.14} h={0.12} c="#f8f6f0" />
  </group>
);
const Depot: React.FC<{t: number; wash?: number}> = ({t, wash = 0}) => (
  <group>
    <Ground w={9} />
    <Bx p={[-0.4, 1.0, 0]} s={[2.6, 2.0, 1.4]} c="#efe8da" />
    <Bx p={[-0.4, 2.1, 0.2]} s={[2.9, 0.25, 1.8]} c={CORAL} />
    <Cyl p={[-1.1, 2.7, 0]} r={0.38} h={0.9} c="#b8c4cb" />
    <Cyl p={[0.2, 1.35, 0.78]} r={0.16} h={0.8} c="#e8edf0" op={0.7} />
    <Cyl p={[0.55, 1.35, 0.78]} r={0.16} h={0.8} c="#e8edf0" op={0.7} />
    <Bx p={[-1.0, 0.35, 0.78]} s={[0.5, 0.08, 0.6]} c="#7d868c" />
    <Galon p={[1.6, 0, 0.3]} />
    {wash > 0 && [0, 1, 2, 3].map((i) => { const k = (t * 1.5 + i / 4) % 1; return <Ball key={i} p={[1.6, 1.3 - k * 0.9, 0.3]} s={0.05} c="#bfe3f6" />; })}
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
  const xs = [90, 330, 570, 810];
  return (
    <div style={{position: 'absolute', left: 60, top: 1040, width: 960, height: 240, opacity: k, borderRadius: 28, background: 'rgba(250,249,246,0.88)', boxShadow: '0 10px 30px rgba(28,28,30,0.15)'}}>
      <div style={{position: 'absolute', left: 30, right: 30, top: 80, height: 10, borderRadius: 5, background: INK, opacity: 0.85}} />
      {xs.map((x, i) => <div key={i} style={{position: 'absolute', left: x - 6, top: 56, textAlign: 'center', transform: `translateX(-50%) scale(${Math.min(1, Math.max(0, k * 3 - i * 0.5))})`}}>
        <div style={{margin: '0 auto', width: 54, height: 54, borderRadius: '50%', background: CORAL, border: '5px solid #faf9f6', boxShadow: '0 6px 16px rgba(28,28,30,0.25)'}} />
        <div style={{marginTop: 12, fontFamily: 'Inter', fontWeight: 800, fontSize: 30, color: INK, whiteSpace: 'nowrap', position: 'relative', left: 6}}>uji lab</div>
      </div>)}
      {gap > 0 && <div style={{position: 'absolute', left: 150, top: 8, width: 150, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 40, color: CORAL, opacity: gap}}>3 bln</div>}
      {you > 0 && <div style={{position: 'absolute', left: 330, top: 160, width: 200, padding: '8px 0', textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 38, color: '#faf9f6', background: CORAL, borderRadius: 16, opacity: you, transform: `scale(${0.7 + 0.3 * you})`}}>KAMU</div>}
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

export const Video15: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, ms = t * 1000;
  return (
    <AbsoluteFill>
      <PaperPlus />

      {/* A. hook: keran rumah, lalu mundur: titik uji jauh di jaringan pipa */}
      <Seg a={0} b={B.standar}>
        <Stage cam={camAt(t, [[0, [2.6, 1.25, 240]], [3.6, [2.6, 1.25, 250]], [5.9, [-0.35, 1.1, 118]]])}><Jalur t={t} test={r(t, 4.6, 5.6)} /></Stage>
      </Seg>
      {/* B. standar: wide, dua titik uji, rumah di luar titik */}
      <Seg a={B.standar} b={B.rebus}>
        <Stage cam={camAt(t, [[6.36, [-0.35, 1.1, 118]], [16.2, [-0.35, 1.1, 122]]])}><Jalur t={t} test={Math.max(r(t, 10.5, 11.2), 0.001)} /></Stage>
        <StatCard p={r(t, 7.3, 7.8) * (1 - r(t, 9.4, 9.7))} x={540} y={1040} big="0" small="E. coli per 100 ml" />
        <Chip x={190} y={1110} p={r(t, 10.8, 11.2)} text="instalasi" color={P15.water} size={38} />
        <Chip x={500} y={1110} p={r(t, 12.4, 12.8)} text="jaringan pipa" color={P15.water} size={38} />
        <Chip x={880} y={1090} p={r(t, 14.2, 14.6)} text="di luar titik uji" color={CORAL} size={38} />
      </Seg>
      {/* C. rebus: panci, mikroba hilang */}
      <Seg a={B.rebus} b={25.4}>
        <Stage cam={camAt(t, [[16.26, [0, 1.5, 240]], [25.4, [0, 1.5, 255]]])}><Pot t={t} dead={r(t, 22.6, 25.0)} /></Stage>
        <Chip x={290} y={1090} p={r(t, 23.5, 23.8) * (1 - r(t, 25.0, 25.3))} text="bakteri" color={CORAL} size={36} />
        <Chip x={540} y={1050} p={r(t, 24.0, 24.3) * (1 - r(t, 25.0, 25.3))} text="virus" color="#7a5bd1" size={36} />
        <Chip x={790} y={1090} p={r(t, 24.5, 24.8) * (1 - r(t, 25.0, 25.3))} text="parasit" color={P15.moss} size={36} />
      </Seg>
      {/* C2. gelas kotor, mikroba balik */}
      <Seg a={25.4} b={B.isi}>
        <Stage cam={camAt(t, [[25.4, [0, 1.0, 300]], [28.77, [0, 1.0, 320]]])}><DirtyGlass t={t} fill={r(t, 25.6, 26.6)} germs={r(t, 27.3, 28.0, Easing.out(Easing.back(2)))} /></Stage>
        <Chip x={540} y={1150} p={r(t, 26.5, 26.9)} text="wadah kotor" color={P15.dust} size={40} />
      </Seg>
      {/* D. depot */}
      <Seg a={B.isi} b={B.payoff}>
        <Stage cam={camAt(t, [[28.77, [0.3, 2.1, 175]], [42.5, [0.3, 2.1, 182]]])}><Depot t={t} wash={r(t, 33.4, 33.9) * (1 - r(t, 35.0, 35.3))} /></Stage>
        {(t < 33.2 || t >= 39.0) && <Timeline t={t} a={t < 33.2 ? 30.6 : 39.0} gap={r(t, 32.3, 32.8)} you={r(t, 40.7, 41.2)} />}
        <Ring10 p={r(t, 33.6, 35.0) * (t < 35.2 ? 1 : 0)} x={850} y={1010} />
        <Clock24 p={r(t, 36.0, 38.4) * (t > 35.4 && t < 39.0 ? 1 : 0)} x={850} y={1010} />
        {t > 35.4 && t < 39.0 && <Mark x={540} y={1250} ok={false} p={r(t, 37.9, 38.3)} text="lebih dari sehari" />}
      </Seg>
      {/* E. payoff */}
      <Seg a={B.payoff} b={B.aksi}>
        <Stage cam={camAt(t, [[42.5, [0, 1.7, 190]], [46.37, [0, 1.7, 200]]])}>
          <Ground w={12} />
          <Faucet p={[-1.5, 1.0, 0]} t={t} flow={1} />
          <TestPoint x={-0.3} p={r(t, 43.0, 43.6)} />
          <Galon p={[1.7, 0, 0]} s={1.3} />
        </Stage>
        <Chip x={270} y={1180} p={r(t, 43.8, 44.2)} text="PDAM" color={P15.water} size={40} />
        <Chip x={800} y={1180} p={r(t, 44.2, 44.6)} text="depot" color={CORAL} size={40} />
      </Seg>
      {/* F. aksi */}
      <Seg a={B.aksi} b={B.cta}>
        <Stage cam={camAt(t, [[46.37, [-0.1, 2.0, 135]], [52.5, [-0.1, 2.0, 142]]])}>
          <Ground w={12} />
          <group position={[-2.7, 0, 0]} scale={0.75}><Pot t={t} dead={r(t, 47.9, 48.6)} /></group>
          <group position={[1.6, 0, 0]}><Depot t={t} /></group>
        </Stage>
        <Mark x={300} y={1210} ok p={r(t, 47.9, 48.3)} text="rebus dulu" />
        <Mark x={780} y={1210} ok p={r(t, 50.0, 50.4)} text="tanya uji lab" />
      </Seg>
      {/* G. CTA */}
      <Seg a={B.cta} b={B.end}>
        <Stage cam={camAt(t, [[52.5, [0, 1.6, 230]], [56.7, [0, 1.6, 238]]])}>
          <Ground w={8} />
          <group position={[-0.9, 0, 0]}><DirtyGlass t={t} fill={1} germs={0} clean /></group>
          <Galon p={[1.1, 0, 0]} s={1.0} />
        </Stage>
        <Chip x={300} y={1180} p={r(t, 53.7, 54.1)} text="PDAM direbus" color={P15.water} size={40} />
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
      <Title t={t} a={B.cta} b={54.3} small="Kamu minum" big="YANG MANA?" bigAt={53.7} size={110} />

      <Kicker text="FAKTA RUMAH · #15" y={292} start={0} />
      <TikTokBox text="Air PDAM boleh langsung diminum?" p={r(t, 0.2, 1.0, Easing.linear)} y={338} size={40} />
      <FollowButton start={Math.round(54.3 * FPS)} click={Math.round(55.3 * FPS)} y={760} />
      <Captions ms={ms} />

      <Audio src={staticFile('v15/vo.mp3')} />
      <Audio src={staticFile('sfx/ambient.wav')} volume={0.08} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
      <Grain o={0.08} />
    </AbsoluteFill>
  );
};
