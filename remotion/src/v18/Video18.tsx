// Video #18 "Rumah hadap barat itu panas?" DNA v8–17, palet `terakota`, TANPA Ornament. Pelajaran #17: tiap beat objek hero sendiri, BESAR, kamera dekat.
// VO ElevenLabs Riri Rida (flow 0Rn9dQNRXEMcHS1Ng1Cs), timestamp public/v18/words.json (align_teks). Naskah: naskah/video-18-rumah-hadap-barat.md
// Warna tambahan sengaja: kuning matahari (benda bercahaya).
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Grain, TikTokBox, PatternBreak, C} from '../aset/Aset';
import {Kicker, FollowButton, CommentBubble} from '../aset/Gabung';
import {PaperPalet, PALET} from '../aset/PaperPalet';
import {Env} from '../pengetahuan/Scene';
import {Rig} from '../v13/Mood13';
import words from '../../public/v18/words.json';
import {Edges} from '@react-three/drei';
import {useMemo} from 'react';
import {Shape, ExtrudeGeometry} from 'three';

const PL = PALET.terakota;
export const P18 = {coral: PL.accent, good: PL.good, hot: '#d9482b', sun: '#f0a830', ink: '#1c1c1e', wall: '#f6efe0', wallHot: '#d9482b', roof: PL.accent, soil: '#8a5a3c', earth: '#b07a50', green: '#4f8a4a', leaf: '#5fa055', trunk: '#6b4630', glass: '#9ec7de'};
export const FPS = 30;
export const V18_END = 51.6;
export const V18_FRAMES = Math.ceil(V18_END * FPS);
const CC_TOP = 1400, CORAL = P18.coral, INK = C.ink;
const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- beat (detik dari words.json) ----------
const B = {hook: 0, hook2: 1.55, takut: 3.8, pagi: 8.26, sore: 10.51, siang: 14.75, simpan: 18.47, payoff: 23.36, denah: 25.6, utara: 28.39, solusi: 30.97, pohon: 32.39, teritis: 36.54, aksi: 39.2, kosong: 42.6, gema: 46.38, follow: 49.19, end: V18_END};

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

// ---------- helper warna ----------
const hex2 = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a: string, b: string, k: number) => { const x = hex2(a), y = hex2(b); return '#' + [0, 1, 2].map((i) => Math.round(lerp(x[i], y[i], k)).toString(16).padStart(2, '0')).join(''); };

// ---------- objek 3D ----------
const Tanah: React.FC<{w?: number}> = ({w = 9}) => (
  <group>
    <Bx p={[0, -0.35, 0]} s={[w, 0.7, 3.2]} c={P18.soil} edge={false} />
    <Bx p={[0, 0.0, 0]} s={[w, 0.06, 3.2]} c={P18.earth} edge={false} />
  </group>
);
const Matahari: React.FC<{p: V3; s: number; t: number}> = ({p, s, t}) => (
  <group position={p}>
    <Ball p={[0, 0, 0]} s={s} c={P18.sun} basic />
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[s * 1.28 + 0.03 * Math.sin(t * 3), 0.035, 10, 48]} /><meshBasicMaterial color={P18.sun} transparent opacity={0.55} /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[s * 1.6 + 0.04 * Math.sin(t * 3 + 1), 0.025, 10, 48]} /><meshBasicMaterial color={P18.sun} transparent opacity={0.3} /></mesh>
  </group>
);
// sinar: butiran bergerak dari matahari ke titik tujuan
const Sinar: React.FC<{from: V3; to: V3; t: number; n?: number; o?: number}> = ({from, to, t, n = 9, o = 1}) => o <= 0 ? null : (
  <group>
    {Array.from({length: n}).map((_, i) => { const f = (t * 0.55 + i / n) % 1; return <Ball key={i} p={[lerp(from[0], to[0], f), lerp(from[1], to[1], f), lerp(from[2], to[2], f)]} s={0.06 * o} c={P18.sun} sx={1.8} basic />; })}
  </group>
);
const Dinding: React.FC<{p: V3; h: number; k: number; hot?: number}> = ({p, h, k, hot = 0}) => {
  const c = mix(P18.wall, P18.wallHot, hot);
  return (
    <group position={p}>
      <Bx p={[0, h / 2, 0]} s={[0.7, h, 2.2]} c={c} />
      {Array.from({length: Math.floor(h / 0.3)}).map((_, i) => <Bx key={i} p={[-0.355, 0.15 + i * 0.3, 0]} s={[0.025, 0.03, 2.2]} c="#4a3626" edge={false} />)}
      {Array.from({length: 5}).map((_, i) => <Bx key={i} p={[-0.358, h / 2, -0.88 + i * 0.44]} s={[0.025, h, 0.03]} c="#4a3626" edge={false} />)}
      <Bx p={[0.0, 0.05, 0]} s={[0.9, 0.1, 2.5]} c="#8d7a68" edge={false} />
      {k > 0 && Array.from({length: 10}).map((_, i) => { const f = (k * 3 + i * 0.37 + hash(i)) % 1; return <Ball key={i} p={[-0.45 - f * 0.25, 0.4 + hash(i + 5) * (h - 0.5) + f * 0.9, -0.9 + hash(i + 11) * 1.8]} s={0.05 * hot} c={P18.hot} sy={1.6} basic />; })}
    </group>
  );
};
const Rumah18: React.FC<{p: V3; hot?: number}> = ({p, hot = 0}) => (
  <group position={p}>
    <Bx p={[0, 0.55, 0]} s={[1.9, 1.1, 1.4]} c={mix(P18.wall, '#e8b8a0', hot)} />
    <Bx p={[-0.96, 0.55, 0]} s={[0.04, 1.1, 1.4]} c={mix(P18.wall, P18.wallHot, hot)} edge={false} />
    <Prism p={[0, 1.1, 0]} w={1.6} h={0.62} d={2.15} c={P18.roof} rot={[0, Math.PI / 2, 0]} />
    <Bx p={[0.2, 0.4, 0.72]} s={[0.36, 0.7, 0.03]} c="#6b3b24" />
    <Bx p={[-0.45, 0.62, 0.72]} s={[0.4, 0.34, 0.03]} c={P18.glass} edge={false} />
    <Bx p={[0.65, 0.62, 0.72]} s={[0.36, 0.34, 0.03]} c={P18.glass} edge={false} />
  </group>
);
const Pohon: React.FC<{p: V3; s: number; grow: number}> = ({p, s, grow}) => grow <= 0 ? null : (
  <group position={p} scale={s * (0.3 + 0.7 * grow)}>
    <Cyl p={[0, 0.9, 0]} r={0.16} h={1.8} c={P18.trunk} />
    <Ball p={[0, 2.2, 0]} s={0.9} c={P18.leaf} />
    <Ball p={[-0.55, 1.9, 0.1]} s={0.65} c={P18.green} />
    <Ball p={[0.55, 2.0, -0.1]} s={0.7} c={P18.green} />
    <Ball p={[0.0, 2.7, 0.0]} s={0.55} c={P18.leaf} />
  </group>
);
const Teritis: React.FC<{p: V3; grow: number}> = ({p, grow}) => grow <= 0 ? null : (
  <group position={p} scale={[grow, 1, 1]}>
    <Bx p={[-0.6, 0, 0]} s={[1.5, 0.1, 2.5]} c={P18.roof} rot={[0, 0, 0.12]} />
    <Cyl p={[-1.25, -0.55, 1.1]} r={0.05} h={1.1} c="#6b4630" /><Cyl p={[-1.25, -0.55, -1.1]} r={0.05} h={1.1} c="#6b4630" />
  </group>
);

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
const Denah: React.FC<{t: number; p: number}> = ({t, p}) => {
  if (p <= 0) return null;
  const cyc = t < 28.3 ? Math.floor(Math.max(0, t - 25.9) / 0.7) % 3 : 0; // utara, timur, selatan, ...
  const door = [{x: 540, y: 780, w: 90, h: 16, l: 'utara'}, {x: 755, y: 1040, w: 16, h: 90, l: 'timur'}, {x: 540, y: 1298, w: 90, h: 16, l: 'selatan'}][cyc];
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: p}}>
      <div style={{position: 'absolute', left: 325, top: 790, width: 430, height: 510, background: '#faf9f6', border: `10px solid ${INK}`, borderRadius: 18, boxShadow: '0 16px 40px rgba(28,28,30,0.22)'}} />
      <div style={{position: 'absolute', left: 316, top: 786, width: 22, height: 520, borderRadius: 10, background: P18.hot, border: `4px solid ${INK}`, boxShadow: `0 0 0 ${6 + 4 * Math.sin(t * 6)}px rgba(217,72,43,0.25)`}} />
      <div style={{position: 'absolute', left: door.x - door.w / 2, top: door.y - door.h / 2, width: door.w, height: door.h, background: P18.green, border: `4px solid ${INK}`, borderRadius: 6}} />
      <div style={{position: 'absolute', left: 340, top: 1030, width: 400, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 56, color: INK}}>rumah</div>
      <div style={{position: 'absolute', left: 64, top: 1010, fontFamily: 'Inter', fontWeight: 900, fontSize: 52, color: INK}}>BARAT</div>
      <div style={{position: 'absolute', left: 120, top: 905, width: 150, height: 150, borderRadius: '50%', background: P18.sun, border: `6px solid ${INK}`, display: 'none'}} />
      <div style={{position: 'absolute', left: 60, top: 840, width: 150, height: 150, borderRadius: '50%', background: P18.sun, border: `6px solid ${INK}`, boxShadow: '0 0 0 14px rgba(246,185,59,0.35)'}} />
      <div style={{position: 'absolute', left: 790, top: 1015, fontFamily: 'Inter', fontWeight: 900, fontSize: 48, color: INK}}>TIMUR</div>
      <div style={{position: 'absolute', left: 470, top: 700, fontFamily: 'Inter', fontWeight: 900, fontSize: 50, color: INK, opacity: 0.0}}>UTARA</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1335, textAlign: 'center', fontFamily: 'Inter', fontWeight: 800, fontSize: 38, color: P18.green, opacity: t < 28.3 ? 1 : 0}}>pintu hadap {door.l}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1335, textAlign: 'center', fontFamily: 'Inter', fontWeight: 800, fontSize: 38, color: P18.green, opacity: t >= 28.3 ? 1 : 0}}>hadap utara, dinding barat tetap kena</div>
    </div>
  );
};
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
  // matahari: pagi tinggi, sore rendah
  const morning = t < B.sore - 0.15;
  const sunP: V3 = morning ? [lerp(-2.6, -2.2, r(t, 8.3, 10.4)), lerp(3.1, 2.8, r(t, 8.3, 10.4)), -0.4] : [lerp(-2.9, -2.7, r(t, 10.5, 14.7)), lerp(1.5, 1.0, r(t, 10.5, 14.7)), -0.4];
  const heat = r(t, 14.9, 17.6);
  return (
    <AbsoluteFill>
      <PaperPalet palet="terakota" />

      {/* 1. hook: matahari sore raksasa di atas rumah */}
      <Seg a={0} b={B.takut}>
        <Stage cam={camAt(t, [[0, [0.2, 1.1, 128]], [3.8, [0.2, 1.1, 142]]])}>
          <Tanah /><Rumah18 p={[0.9, 0, 0]} hot={r(t, 1.5, 3.3) * 0.5} /><Matahari p={[-2.6, 1.5, -0.6]} s={0.8} t={t} /><Sinar from={[-2.2, 1.4, -0.3]} to={[-0.2, 0.7, 0.3]} t={t} n={7} o={r(t, 0.6, 1.2)} />
        </Stage>
        <Chip x={800} y={1180} p={r(t, 2.3, 2.7)} text="rumah panas?" color={P18.hot} size={44} />
      </Seg>
      {/* 2. orang jadi takut beli: papan DIJUAL besar */}
      <Seg a={B.takut} b={B.pagi}>
        <Papan t={t} p={r(t, B.takut, B.takut + 0.4)} />
        <Chip x={230} y={1200} p={r(t, 5.2, 5.6)} text="panas?" color={P18.hot} size={48} />
        <Chip x={850} y={1260} p={r(t, 6.0, 6.4)} text="ragu beli" color={INK} size={48} />
      </Seg>
      {/* 3. matahari pagi tinggi vs sore rendah, sinar ke dinding barat */}
      <Seg a={B.pagi} b={B.simpan}>
        <Stage cam={camAt(t, [[8.26, [-0.2, 1.7, 118]], [10.5, [-0.2, 1.4, 118]], [14.7, [0.9, 1.2, 128]], [18.4, [1.1, 1.3, 168]]])}>
          <Tanah w={10} />
          <Dinding p={[1.7, 0, 0]} h={2.4} k={r(t, 14.9, 17.6)} hot={heat} />
          <Matahari p={sunP} s={morning ? 0.55 : 0.7} t={t} />
          <Sinar from={[sunP[0] + 0.3, sunP[1] - 0.2, -0.2]} to={[1.3, morning ? 0.2 : 1.1, 0.1]} t={t} n={11} />
          {morning && <Bx p={[1.7, 0.02, 0.2]} s={[0.4, 0.02, 1.8]} c="#6b4630" edge={false} op={0.5} />}
        </Stage>
        <Chip x={330} y={1040} p={r(t, B.pagi + 0.6, B.pagi + 1.0) * (1 - r(t, 10.3, 10.5))} text="pagi: tinggi" color={P18.sun === '' ? INK : '#b07a14'} size={42} />
        <Chip x={300} y={1190} p={r(t, 11.2, 11.6)} text="sore: rendah" color={P18.hot} size={42} />
        <Termometer x={900} y={760} k={r(t, 15.4, 18.2)} />
        <Chip x={540} y={1290} p={r(t, 15.0, 15.4)} text="± jam 14.00" color={P18.hot} size={40} />
      </Seg>
      {/* 4. dinding bata menyimpan panas sampai kamar */}
      <Seg a={B.simpan} b={B.payoff}>
        <Stage cam={camAt(t, [[18.47, [1.0, 1.3, 120]], [23.3, [1.2, 1.5, 128]]])}>
          <Tanah w={9} />
          <Bx p={[0.2, 1.1, 0]} s={[0.55, 2.2, 1.8]} c="#d9482b" /><Bx p={[0.75, 1.1, 0]} s={[0.55, 2.2, 1.8]} c="#e88a4e" /><Bx p={[1.3, 1.1, 0]} s={[0.55, 2.2, 1.8]} c="#f2cfa8" />
          <Bx p={[2.55, 0.55, 0]} s={[1.6, 1.1, 1.6]} c={mix(P18.wall, '#e8956a', r(t, 20.2, 22.6))} />
          <Bx p={[2.6, 0.2, 0.2]} s={[0.9, 0.24, 0.5]} c="#faf9f6" />
          {Array.from({length: 12}).map((_, i) => { const f2 = ((t - 18.8) * 0.28 + i / 12 + hash(i) * 0.1); const g = Math.max(0, Math.min(1, f2 % 1)); return t > 18.8 ? <Ball key={i} p={[lerp(-0.1, 1.6, g), 0.3 + hash(i + 3) * 1.8, -0.7 + hash(i + 8) * 1.4]} s={0.06} c={mix('#d9482b', '#f6b93b', g)} basic /> : null; })}
        </Stage>
        <Termometer x={860} y={770} k={r(t, 18.7, 22.2)} />
        <Chip x={300} y={1010} p={r(t, 19.4, 19.8)} text="dinding bata" color={P18.hot} size={40} />
        <Chip x={780} y={1300} p={r(t, 21.2, 21.6)} text="kamar hangat" color={INK} size={40} />
      </Seg>
      {/* 5. payoff: denah, dinding barat yang panas apa pun arah pintu */}
      <Seg a={B.denah} b={B.solusi}><Denah t={t} p={r(t, B.denah, B.denah + 0.4)} /></Seg>
      {/* 6. solusi: pohon rindang dan teritis menahan sinar */}
      <Seg a={B.solusi} b={B.aksi}>
        <Stage cam={camAt(t, [[30.97, [0.4, 1.4, 112]], [36.5, [0.7, 1.3, 128]], [39.2, [0.9, 1.4, 135]]])}>
          <Tanah w={10} />
          <Dinding p={[1.9, 0, 0]} h={2.4} k={0} hot={0} />
          <Matahari p={[-3.0, 1.1, -0.4]} s={0.7} t={t} />
          <Pohon p={[-0.9, 0, 0.2]} s={1.15} grow={r(t, 32.4, 34.0, Easing.out(Easing.back(1.4)))} />
          <Sinar from={[-2.6, 1.0, -0.2]} to={[r(t, 33.9, 34.3) > 0 ? -1.2 : 1.4, 1.1, 0.1]} t={t} n={9} />
          <Teritis p={[1.0, 2.5, 0]} grow={r(t, 36.6, 37.6)} />
        </Stage>
        <Chip x={290} y={1050} p={r(t, 34.2, 34.6)} text="pohon rindang" color={P18.green} size={42} />
        <Chip x={800} y={1160} p={r(t, 37.4, 37.8)} text="teritis" color={P18.green} size={44} />
        <Chip x={540} y={1300} p={r(t, 37.9, 38.3)} text="dinding tetap adem" color={P18.green} size={38} />
      </Seg>
      {/* 7. aksi: kompas HP, cek sisi barat */}
      <Seg a={B.aksi} b={B.gema}>
        <HP t={t} p={r(t, B.aksi, B.aksi + 0.4)} />
        <Chip x={250} y={1250} p={r(t, 42.7, 43.1)} text="pohon?" color={P18.green} size={44} />
        <Chip x={540} y={1330} p={r(t, 43.5, 43.9)} text="teritis?" color={P18.green} size={44} />
        <Chip x={830} y={1250} p={r(t, 44.3, 44.7)} text="kosong?" color={P18.hot} size={44} />
      </Seg>
      {/* 8. gema + CTA: rumah dengan sinar tertahan pohon */}
      <Seg a={B.gema} b={B.end}>
        <Stage cam={camAt(t, [[46.38, [0.3, 1.2, 128]], [51.6, [0.3, 1.1, 120]]])}>
          <Tanah w={10} /><Rumah18 p={[1.2, 0, 0]} hot={0} /><Matahari p={[-3.0, 1.3, -0.5]} s={0.7} t={t} /><Pohon p={[-0.8, 0, 0.3]} s={1.0} grow={1} />
          <Sinar from={[-2.6, 1.2, -0.2]} to={[-1.0, 1.4, 0.2]} t={t} n={7} />
        </Stage>
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

      <Kicker text="FAKTA RUMAH · #18" y={292} start={0} color={t >= 23.5 && t < 25.9 ? '#ffffff' : CORAL} />
      <TikTokBox text="Rumah hadap barat itu panas?" p={r(t, 0.2, 1.0, Easing.linear)} y={338} size={40} />
      <FollowButton start={Math.round(49.4 * FPS)} click={Math.round(50.8 * FPS)} y={760} />
      <Captions ms={ms} />

      <Audio src={staticFile('v18/vo.mp3')} />
      <Audio src={staticFile('sfx/ambient.wav')} volume={0.08} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
      <Grain o={0.08} />
    </AbsoluteFill>
  );
};
