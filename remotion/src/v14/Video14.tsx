// Video #14 "Air AC yang Menetes Itu Bukan Bocor" (Bongkar Barang). DNA v8–10 + kamera 2,5D ortografis (salinan v13).
// VO ElevenLabs Riri Rida (flow ToIeOERE8lrRsidYIvXS), timestamp public/v14/words.json (Scribe). Naskah: naskah/video-14-air-ac-menetes.md
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Grain, TikTokBox, PatternBreak, C} from '../aset/Aset';
import {PaperPlus, Kicker, Ornament, FollowButton} from '../aset/Gabung';
import {Env} from '../pengetahuan/Scene';
import {Rig} from '../v13/Mood13';
import words from '../../public/v14/words.json';
import {Edges} from '@react-three/drei';

export const P14 = {coral: '#e2563f', ink: '#1c1c1e', ac: '#f4f2ec', acEdge: '#cfcac0', wall: '#e9e1d2', wallOut: '#b9c7cf', floor: '#d9d4c7', ground: '#a8b59a', bed: '#5d8fd6', pillow: '#f8f6f0', fin: '#7fa6c4', water: '#4fa3d9', hose: '#e8e3d8', moss: '#6f8a4a', dust: '#8a7d6b'};
export const FPS = 30;
export const V14_END = 60.9;
export const V14_FRAMES = Math.ceil(V14_END * FPS);
const CC_TOP = 1400, CORAL = P14.coral, INK = C.ink;
const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ---------- beat (detik dari words.json) ----------

// ---------- beat (detik dari words.json, Scribe) ----------
const B = {hook: 0, ember: 2.72, mitos: 5.6, udara: 12.88, sirip: 17.84, angka: 25.76, selang: 32.0, twist: 35.36, payoff: 40.88, aksi: 46.16, kasur: 53.44, tanya: 56.0, follow: 58.4, end: V14_END};
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
const Stage: React.FC<{cam: Cam; children: React.ReactNode}> = ({cam, children}) => (
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
  <mesh position={p} scale={[s, s * 1.25, s]}><sphereGeometry args={[1, 20, 16]} /><meshPhysicalMaterial color={P14.water} roughness={0.1} clearcoat={1} transmission={0.2} /></mesh>
);
// unit AC dinding: badan putih membulat, sirip udara, lampu kecil
const ACUnit: React.FC<{p: [number, number, number]; flap?: number}> = ({p, flap = 0.3}) => (
  <group position={p}>
    <Bx p={[0, 0, 0]} s={[1.3, 0.38, 0.3]} c={P14.ac} />
    <Bx p={[0, -0.16, 0.12]} s={[1.18, 0.05, 0.1]} c={P14.acEdge} rot={[flap, 0, 0]} />
    <mesh position={[0.5, 0.08, 0.152]}><circleGeometry args={[0.025, 16]} /><meshBasicMaterial color="#3fd17a" toneMapped={false} /></mesh>
  </group>
);
// partikel uap air (koral kecil). pull 0..1 = tersedot ke AC
const Vapor: React.FC<{t: number; n: number; box: [number, number, number, number, number, number]; to?: [number, number, number]; pull?: number; show: number}> = ({t, n, box, to, pull = 0, show}) => (
  <group>
    {Array.from({length: n}, (_, i) => {
      const [x0, x1, y0, y1, z0, z1] = box, ph = hash(i) * 6.28;
      let x = x0 + (x1 - x0) * hash(i + 1) + Math.sin(t * 0.7 + ph) * 0.08, y = y0 + (y1 - y0) * hash(i + 2) + Math.sin(t * 0.9 + ph * 2) * 0.06, z = z0 + (z1 - z0) * hash(i + 3);
      const k = to ? Math.min(1, Math.max(0, pull * 1.6 - hash(i + 4) * 0.6)) : 0;
      if (to) { x = lerp(x, to[0] + (hash(i + 5) - 0.5) * 1.0, k); y = lerp(y, to[1], k); z = lerp(z, to[2], k); }
      const sc = 0.035 * show * (1 - k * 0.7);
      return sc > 0.001 ? <mesh key={i} position={[x, y, z]} scale={sc}><sphereGeometry args={[1, 12, 10]} /><meshBasicMaterial color={CORAL} toneMapped={false} transparent opacity={0.85} /></mesh> : null;
    })}
  </group>
);
// tetes jatuh berulang dari titik (x,y,z) sejauh fall, mulai t0
const Dripping: React.FC<{t: number; t0: number; at: [number, number, number]; fall: number; every?: number}> = ({t, t0, at, fall, every = 0.45}) => {
  if (t < t0) return null;
  return <group>{[0, 1, 2].map((i) => { const ph = ((t - t0) / every + i / 3) % 1; return <Drop key={i} p={[at[0], at[1] - ph * ph * fall, at[2]]} s={0.045} />; })}</group>;
};

// kamar: lantai, dinding belakang & kiri, AC, kasur, selang ke dinding
const Room: React.FC<{t: number; leak?: number; vapor?: number; pull?: number}> = ({t, leak = 0, vapor = 0, pull = 0}) => (
  <group>
    <mesh position={[0, -0.04, 0.2]} receiveShadow><boxGeometry args={[4.2, 0.06, 2.6]} /><Mat c={P14.floor} r={1} cc={0.4} /></mesh>
    <Bx p={[0, 1.15, -1.1]} s={[4.2, 2.4, 0.1]} c={P14.wall} edge={false} />
    <Bx p={[-2.05, 1.15, 0.2]} s={[0.1, 2.4, 2.6]} c={P14.wall} edge={false} />
    <ACUnit p={[0.1, 1.85, -0.88]} />
    {/* selang buang: dari sisi kanan AC ke lubang dinding */}
    <Bx p={[0.86, 1.72, -0.95]} s={[0.22, 0.05, 0.05]} c={P14.hose} />
    <mesh position={[0.98, 1.72, -1.04]}><circleGeometry args={[0.05, 16]} /><meshBasicMaterial color="#3a332c" /></mesh>
    {/* kasur di bawah AC */}
    <Bx p={[0.1, 0.2, -0.25]} s={[1.6, 0.4, 1.5]} c={P14.bed} />
    <Bx p={[0.1, 0.47, -0.8]} s={[1.1, 0.14, 0.35]} c={P14.pillow} />
    <Bx p={[-1.4, 0.35, -0.75]} s={[0.5, 0.7, 0.5]} c="#c9a47a" />
    {leak > 0 && <Dripping t={t} t0={0} at={[0.25, 1.62, -0.72]} fall={1.18} every={0.5} />}
    {leak > 0 && <mesh position={[0.25, 0.405, -0.72]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.12 + 0.18 * leak, 32]} /><meshBasicMaterial color="#3f6f99" transparent opacity={0.55} /></mesh>}
    {vapor > 0 && <Vapor t={t} n={46} box={[-1.8, 1.8, 0.4, 2.1, -0.7, 1.2]} to={[0.1, 1.85, -0.75]} pull={pull} show={vapor} />}
  </group>
);
// luar rumah: dinding luar + ujung selang + tanah
const Outside: React.FC<{t: number; drip?: boolean; dry?: number}> = ({t, drip = true, dry = 0}) => (
  <group>
    <mesh position={[0, -0.04, 0.4]} receiveShadow><boxGeometry args={[4.2, 0.06, 2.4]} /><Mat c={P14.ground} r={1} cc={0} /></mesh>
    <Bx p={[0, 1.2, -0.8]} s={[4.2, 2.5, 0.12]} c={P14.wallOut} edge={false} />
    <Bx p={[0.3, 1.55, -0.62]} s={[0.06, 0.06, 0.26]} c={P14.hose} />
    <Bx p={[0.3, 1.2, -0.49]} s={[0.06, 0.72, 0.06]} c={P14.hose} />
    <Bx p={[-1.0, 0.25, -0.4]} s={[0.9, 0.5, 0.6]} c="#8d969c" />
    {drip && dry < 1 && <Dripping t={t} t0={0} at={[0.3, 0.8, -0.49]} fall={0.78} every={0.5} />}
    {drip && <mesh position={[0.3, 0.005, -0.45]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.22 * (1 - dry), 32]} /><meshBasicMaterial color="#5d7a52" transparent opacity={0.7} /></mesh>}
  </group>
);
// sirip evaporator close-up: pelat tipis + pipa tembaga; uap datang, jadi tetes, meluncur turun
const Fins: React.FC<{t: number; t0: number}> = ({t, t0}) => (
  <group>
    {Array.from({length: 11}, (_, i) => <Bx key={i} p={[-0.75 + i * 0.15, 0, 0]} s={[0.025, 1.3, 0.7]} c={P14.fin} edge={false} />)}
    {[-0.35, 0.35].map((y) => <mesh key={y} position={[0, y, 0.1]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.05, 0.05, 1.8, 20]} /><meshPhysicalMaterial color="#c8743f" metalness={0.7} roughness={0.35} /></mesh>)}
    {Array.from({length: 14}, (_, i) => {
      const at = t0 + 1.2 + hash(i + 9) * 3.5, k = Math.max(0, t - at), x = -0.68 + Math.floor(hash(i + 7) * 10) * 0.15, z = 0.36;
      if (t < at - 1.0) return null;
      const grow = Math.min(1, (t - (at - 1.0)) / 1.0), slide = k * k * 0.5;
      return <Drop key={i} p={[x, 0.45 - hash(i + 3) * 0.6 - slide, z]} s={0.025 + 0.025 * grow} />;
    })}
    <Vapor t={t} n={26} box={[-1.0, 1.0, -0.6, 0.7, 1.2, 2.4]} to={[0, 0.1, 0.4]} pull={r(t, t0 + 0.5, t0 + 4.5)} show={1} />
  </group>
);

// ---------- 2D ----------
const FreonLoop: React.FC<{t: number; p: number}> = ({t, p}) => {
  if (p <= 0) return null;
  const off = -t * 120;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: p}}>
      <rect x={190} y={760} width={700} height={460} rx={120} fill="none" stroke="#c8743f" strokeWidth={46} />
      <rect x={190} y={760} width={700} height={460} rx={120} fill="none" stroke="#f3c9a8" strokeWidth={14} strokeDasharray="40 60" strokeDashoffset={off} />
      <rect x={470} y={720} width={140} height={80} rx={16} fill={P14.ac} stroke={INK} strokeWidth={5} />
      <rect x={430} y={1180} width={220} height={90} rx={18} fill="#8d969c" stroke={INK} strokeWidth={5} />
      <text x={540} y={1010} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={64} fill={INK}>FREON = GAS</text>
      <text x={540} y={1080} textAnchor="middle" fontFamily="Inter" fontWeight={700} fontSize={44} fill={C.sub}>muter di pipa tertutup</text>
    </svg>
  );
};
const Bucket: React.FC<{t: number}> = ({t}) => {
  const lv = r(t, 27.0, 30.3, Easing.inOut(Easing.quad)), L = Math.round(17 * lv);
  const top = 760, h = 520, wTop = 560, wBot = 420, cx = 540, wy = top + h - h * 0.92 * lv;
  const at = (y: number) => wBot + (wTop - wBot) * (1 - (y - top) / h);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <defs><clipPath id="ember"><polygon points={`${cx - wTop / 2},${top} ${cx + wTop / 2},${top} ${cx + wBot / 2},${top + h} ${cx - wBot / 2},${top + h}`} /></clipPath></defs>
      <g clipPath="url(#ember)">
        <rect x={0} y={0} width={1080} height={1920} fill="#f3efe6" />
        <path d={`M0 ${wy} ${Array.from({length: 23}, (_, i) => `L${i * 50} ${wy + Math.sin(i * 0.9 + t * 5) * 8}`).join(' ')} L1080 ${wy} L1080 1920 L0 1920 Z`} fill={P14.water} />
      </g>
      <polygon points={`${cx - wTop / 2},${top} ${cx + wTop / 2},${top} ${cx + wBot / 2},${top + h} ${cx - wBot / 2},${top + h}`} fill="none" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      <path d={`M${cx - wTop / 2 + 20} ${top} Q ${cx} ${top - 220} ${cx + wTop / 2 - 20} ${top}`} fill="none" stroke={INK} strokeWidth={8} />
      {[0.25, 0.5, 0.75].map((q) => <line key={q} x1={cx + at(top + h * q) / 2 - 40} x2={cx + at(top + h * q) / 2} y1={top + h * q} y2={top + h * q} stroke={INK} strokeWidth={5} />)}
      <text x={cx} y={wy - 30 > top + 60 ? wy - 30 : top + 90} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={120} fill={INK}>{L}<tspan fontSize={56}> liter</tspan></text>
      <text x={cx} y={top + h + 80} textAnchor="middle" fontFamily="Space Mono, monospace" fontSize={30} fill={C.sub}>(perkiraan: AC 1 PK, nyala 24 jam)</text>
    </svg>
  );
};
const IcedTea: React.FC<{t: number; p: number}> = ({t, p}) => {
  if (p <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 620, top: 1020, width: 360, height: 360, borderRadius: 30, background: 'rgba(250,249,246,0.97)', boxShadow: '0 12px 40px rgba(28,28,30,0.18)', opacity: p, transform: `scale(${0.8 + 0.2 * p})`}}>
      <svg width={360} height={360}>
        <polygon points="105,60 255,60 240,310 120,310" fill="#c98a3c" opacity={0.85} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <rect x={130} y={95} width={50} height={45} rx={8} fill="#f4f8fb" opacity={0.9} /><rect x={185} y={130} width={45} height={40} rx={8} fill="#f4f8fb" opacity={0.9} />
        {Array.from({length: 9}, (_, i) => { const y = 90 + hash(i) * 190 + Math.max(0, t - 24.0 - hash(i + 2)) * 40; return <ellipse key={i} cx={110 + hash(i + 1) * 140} cy={Math.min(300, y)} rx={7} ry={9} fill="#e6f3fb" stroke="#7fa6c4" strokeWidth={2} />; })}
      </svg>
    </div>
  );
};
const HoseClog: React.FC<{t: number}> = ({t}) => {
  const k = r(t, 37.4, 38.4), back = r(t, 38.5, 40.2);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <rect x={80} y={900} width={920} height={180} rx={90} fill={P14.hose} stroke={INK} strokeWidth={8} />
      <rect x={110} y={930} width={860} height={120} rx={60} fill="#f7f4ee" />
      <rect x={110} y={930} width={lerp(380, 600, back)} height={120} rx={60} fill={P14.water} opacity={0.9} />
      <g opacity={k} transform={`translate(${620 - 40 * (1 - k)} 0)`}>
        <ellipse cx={0} cy={990} rx={110} ry={62} fill={P14.moss} stroke={INK} strokeWidth={5} />
        {[[-50, 970], [10, 1010], [55, 975], [-15, 960]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={14} fill={P14.dust} />)}
      </g>
      <text x={620} y={1140} textAnchor="middle" fontFamily="Inter" fontWeight={800} fontSize={44} fill={P14.moss} opacity={k}>lumut + debu</text>
      <path d="M 150 880 Q 150 760 260 740" fill="none" stroke={P14.water} strokeWidth={14} strokeLinecap="round" opacity={back} />
      <text x={150} y={710} fontFamily="Inter" fontWeight={800} fontSize={42} fill={P14.water} opacity={back}>balik ke dalam kamar</text>
    </svg>
  );
};
const Mark: React.FC<{x: number; y: number; ok: boolean; p: number; text: string}> = ({x, y, ok, p, text}) => p > 0 ? (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * p})`, opacity: p, display: 'flex', alignItems: 'center', gap: 16, padding: '12px 26px', borderRadius: 20, background: 'rgba(250,249,246,0.97)', border: `5px solid ${ok ? '#3f9a5a' : CORAL}`, fontFamily: 'Inter', fontWeight: 800, fontSize: 46, color: INK, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(28,28,30,0.18)'}}>
    <span style={{color: ok ? '#3f9a5a' : CORAL, fontSize: 54, fontWeight: 900}}>{ok ? '✓' : '✗'}</span>{text}
  </div>
) : null;

// ---------- SFX (dibaca juga oleh tools/mix-audio.mjs) ----------
const SFX: [string, number, number][] = [
  ['drip', 0.6, 0.5], ['drip', 1.3, 0.45], ['drip', 2.0, 0.45], ['tick', 2.7, 0.35], ['pop', 3.2, 0.35],
  ['whoosh', 5.6, 0.35], ['thud', 8.55, 0.5], ['whoosh', 9.45, 0.25], ['flow', 9.8, 0.25],
  ['whoosh', 12.85, 0.3], ['crystal', 15.9, 0.3],
  ['whoosh', 17.8, 0.25], ['buzz', 18.3, 0.15], ['drip', 22.9, 0.5], ['pop', 23.9, 0.35],
  ['whoosh', 25.7, 0.3], ['tick', 27.2, 0.3], ['tick', 28.2, 0.3], ['tick', 29.2, 0.3], ['ting', 30.4, 0.4],
  ['whoosh', 31.95, 0.25], ['flow', 33.0, 0.3],
  ['whoosh', 35.3, 0.3], ['thud', 37.9, 0.45], ['drip', 38.9, 0.5], ['drip', 39.5, 0.45],
  ['chime', 41.0, 0.4],
  ['whoosh', 46.1, 0.3], ['drip', 48.6, 0.45], ['drip', 49.2, 0.45], ['pop', 49.8, 0.4], ['pop', 51.3, 0.4],
  ['whoosh', 53.4, 0.3], ['knock', 54.6, 0.3], ['whoosh', 55.95, 0.3], ['pop', 56.6, 0.35], ['pop', 56.9, 0.35], ['chime', 58.6, 0.4],
];

export const Video14: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, ms = t * 1000;
  const inPB = t >= B.mitos && t < 9.45;
  return (
    <AbsoluteFill>
      <PaperPlus />

      {/* A. hook: kamar, AC, ember (2D) terisi cepat */}
      <Seg a={0} b={B.mitos}>
        <Stage cam={t < B.ember ? camAt(t, [[0, [0.1, 1.2, 230]], [2.72, [0.1, 1.3, 260]]]) : camAt(t, [[2.72, [0.15, 1.8, 420]], [5.6, [0.15, 1.75, 470]]])}><Room t={t} vapor={r(t, 0.5, 1.5)} pull={r(t, 1.5, 5)} leak={0} /></Stage>
      </Seg>
      {/* B2. freon: pipa tertutup */}
      <Seg a={9.45} b={B.udara}><FreonLoop t={t} p={r(t, 9.45, 9.9)} /></Seg>
      {/* C. udara lembap: butiran koral muncul memenuhi kamar */}
      <Seg a={B.udara} b={B.sirip}>
        <Stage cam={camAt(t, [[12.88, [0, 1.3, 330]], [17.84, [-0.2, 1.1, 250]]])}><Room t={t} vapor={r(t, 13.3, 15.4)} /></Stage>
      </Seg>
      {/* D. sirip dingin close-up, tetes, + gelas es teh */}
      <Seg a={B.sirip} b={B.angka}>
        <Stage cam={camAt(t, [[17.84, [0, 0.2, 330]], [21.2, [0, 0.1, 430]], [25.76, [0.15, 0.0, 470]]])}><Fins t={t} t0={B.sirip} /></Stage>
        <Chip x={300} y={1180} p={r(t, 19.0, 19.4) * (1 - r(t, 23.5, 23.8))} text="sirip dingin" color={P14.fin} />
        <IcedTea t={t} p={r(t, 23.8, 24.2)} />
      </Seg>
      {/* E. angka: ember terisi 0 → 17 liter */}
      <Seg a={B.angka} b={B.selang}><Bucket t={t} /></Seg>
      {/* F. jalan keluar: luar rumah, selang menetes */}
      <Seg a={B.selang} b={B.twist}>
        <Stage cam={camAt(t, [[32.0, [0.3, 1.4, 260]], [35.36, [0.3, 1.0, 360]]])}><Outside t={t} /></Stage>
        <Chip x={720} y={1180} p={r(t, 33.4, 33.8)} text="dibuang ke luar" color={P14.water} />
      </Seg>
      {/* G. twist: selang mampet, air balik */}
      <Seg a={B.twist} b={39.6}><HoseClog t={t} /></Seg>
      <Seg a={39.6} b={B.payoff}>
        <Stage cam={camAt(t, [[39.6, [0.25, 1.0, 380]], [40.88, [0.25, 1.0, 400]]])}><Room t={t} leak={r(t, 39.6, 40.8)} /></Stage>
      </Seg>
      {/* H. payoff: kamar kering, AC normal */}
      <Seg a={B.payoff} b={B.aksi}>
        <Stage cam={camAt(t, [[40.88, [0.1, 1.2, 240]], [46.16, [0.1, 1.2, 255]]])}><Room t={t} /></Stage>
      </Seg>
      {/* I. aksi: ujung selang di luar, netes ✓ lalu kering ✗ */}
      <Seg a={B.aksi} b={B.kasur}>
        <Stage cam={camAt(t, [[46.16, [0.2, 1.3, 260]], [48.2, [0.3, 0.9, 400]], [53.44, [0.3, 0.9, 410]]])}><Outside t={t} dry={r(t, 50.5, 51.0)} /></Stage>
        <Mark x={540} y={1200} ok p={r(t, 49.7, 50.1) * (1 - r(t, 50.4, 50.6))} text="netes = aman" />
        <Mark x={540} y={1200} ok={false} p={r(t, 51.2, 51.6)} text="kering = panggil teknisi" />
      </Seg>
      {/* J. kasur di bawah AC */}
      <Seg a={B.kasur} b={B.end}>
        <Stage cam={camAt(t, [[53.44, [0.1, 1.0, 330]], [56, [0.1, 1.2, 270]], [60.9, [0.1, 1.25, 255]]])}><Room t={t} leak={t < 56 ? r(t, 54.2, 55.4) : 0} /></Stage>
        <Chip x={360} y={1180} p={r(t, 56.6, 57.0) * (1 - r(t, 58.2, 58.5))} text="PERNAH" color={CORAL} size={52} />
        <Chip x={740} y={1180} p={r(t, 56.9, 57.3) * (1 - r(t, 58.2, 58.5))} text="AMAN" color={P14.bed} size={52} />
      </Seg>

      {/* teks layar (judul dua tingkat) */}
      <Title t={t} a={1.7} b={B.mitos} small="Dari udara kamarmu" big="HAMPIR SEEMBER" bigAt={2.7} size={96} />
      <Title t={t} a={9.45} b={B.udara} small="Airnya bukan" big="DARI FREON" bigAt={10.3} />
      <Title t={t} a={B.udara} b={B.sirip} small="Udara lembap," big="PENUH UAP AIR" bigAt={16.5} size={96} />
      <Title t={t} a={B.sirip} b={B.angka} small="Kena sirip dingin," big="JADI TETES" bigAt={23.0} />
      <Title t={t} a={B.angka} b={B.selang} small="AC 1 PK, seharian" big="±17 LITER" bigAt={29.1} size={120} />
      <Title t={t} a={B.selang} b={B.twist} small="Ditampung, lalu" big="KE LUAR" bigAt={34.6} size={120} />
      <Title t={t} a={B.twist} b={B.payoff} small="Netes di dalam?" big="SELANG MAMPET" bigAt={37.9} />
      <Title t={t} a={B.payoff} b={B.aksi} small="Air AC itu wajar," big="ASAL DI LUAR" bigAt={42.2} size={110} />
      <Title t={t} a={B.aksi} b={B.kasur} small="Cek ujung selang" big="HARUSNYA NETES" bigAt={49.7} size={96} />
      <Title t={t} a={B.kasur} b={B.tanya} small="Apalagi kalau AC" big="DI ATAS KASUR" bigAt={55.0} size={100} />
      <Title t={t} a={B.tanya} b={B.follow} small="AC-mu pernah" big="NETES KE DALAM?" bigAt={57.3} size={96} />

      {/* mitos: pemutus pola */}
      {inPB && <PatternBreak lines={['FREON', 'BOCOR?']} sub={t > 8.5 ? 'bukan' : undefined} p={r(t, B.mitos, B.mitos + 0.6)} />}

      {!inPB && <><Kicker text="FAKTA RUMAH · #14" y={292} start={0} /><TikTokBox text="AC netes, berarti bocor?" p={r(t, 0.2, 1.0, Easing.linear)} y={338} size={40} /></>}
      {!inPB && <><Ornament cx={1030} cy={150} size={360} start={0} /><Ornament cx={40} cy={1800} size={360} start={6} /></>}
      <FollowButton start={Math.round(B.follow * FPS)} click={Math.round((B.follow + 1.0) * FPS)} y={760} />
      {!inPB && <Captions ms={ms} />}

      <Audio src={staticFile('v14/vo.mp3')} />
      <Audio src={staticFile('sfx/ambient.wav')} volume={0.08} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
      <Grain o={0.08} />
    </AbsoluteFill>
  );
};
