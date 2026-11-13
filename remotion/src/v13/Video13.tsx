// Video #13 "Kaca Pecah Gara-Gara Sound Horeg?" DNA video 8–10 + kamera 2,5D (ortografis, sudut tetap; geser/zoom saja).
// VO Gemini TTS (Achernar), timestamp public/v13/words.json (tools/align_teks.py). Naskah: naskah/video-13-kaca-sound-horeg.md
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Grain, TikTokBox, PatternBreak, C} from '../aset/Aset';
import {PaperPlus, Kicker, Ornament, FollowButton} from '../aset/Gabung';
import {Env} from '../pengetahuan/Scene';
import {P13, Window, House, Truck, Rings, Rig, Base} from './Mood13';
import words from '../../public/v13/words.json';
import {Edges} from '@react-three/drei';

export const FPS = 30;
export const V13_END = 74.2;
export const V13_FRAMES = Math.ceil(V13_END * FPS);
const CC_TOP = 1400, CORAL = P13.coral, INK = C.ink;
const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ---------- beat (detik dari words.json) ----------
const B = {hook: 0, pecah: 3.1, utuh: 4.8, sama: 6.4, mitos: 9.0, angka: 13.6, bass: 21.3, ayun: 31.6, gompal: 42.4, payoff: 49.3, aksi: 55.9, tanya: 67.0, follow: 71.6, end: V13_END};
const BEAT = 0.5; // dentuman bass tiap 0,5 dtk (penyederhanaan visual)
const thump = (t: number, from: number) => (t < from ? 0 : Math.exp(-((t - from) % BEAT) * 9));

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

// ---------- adegan ----------
const Street: React.FC<{t: number; truck?: boolean; crackK: number; cam: Cam; shake?: number}> = ({t, truck = true, crackK, cam, shake = 0}) => {
  const tx = interpolate(t, [0, 2.6], [-3.6, -1.3], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const th = thump(t, 1.0), flexN = 0.05 * th * (crackK < 1 ? 1 : 0.3);
  return (
    <Stage cam={[cam[0] + shake * Math.sin(t * 80) * 0.01, cam[1], cam[2]]}>
      <Base w={5.6} />
      <House x={-0.85} wall={P13.wallB} roof={P13.roofB} crack={crackK} chip flex={flexN} />
      <House x={0.85} wall={P13.wallA} roof={P13.roofA} flex={0.02 * th} />
      {truck && <group position={[tx, 0, 1.1]} scale={0.6}><group position={[0, 0.02 * th, 0]}><Truck x={0} /></group></group>}
      {truck && t > 1.0 && <group scale={1 + 0.15 * (1 - th)}><Rings x={tx - 0.15} y={0.6} z={2.0} n={3} r0={0.45 + 0.15 * (1 - th)} /></group>}
    </Stage>
  );
};

const Bars: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 15.2, 16.7), b = r(t, 19.6, 20.6), ln = r(t, 17.6, 18.3);
  const bar = (x: number, v: number, k: number, label: string, col: string) => (
    <div key={x}>
      <div style={{position: 'absolute', left: x - 110, top: 1300 - (v - 90) * 9 * k, width: 220, height: (v - 90) * 9 * k, background: col, borderRadius: '18px 18px 0 0', boxShadow: '12px 12px 0 rgba(28,28,30,0.15)'}} />
      <div style={{position: 'absolute', left: x - 160, width: 320, top: 1300 - (v - 90) * 9 * k - 110, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 92, color: col, opacity: k}}>{Math.round(90 + (v - 90) * k)}<span style={{fontSize: 44}}> dB</span></div>
      <div style={{position: 'absolute', left: x - 160, width: 320, top: 1315, textAlign: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: 36, color: INK}}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      {bar(330, 135, a, 'sound horeg', CORAL)}
      {bar(750, 150, b, 'kaca utuh pecah', P13.wallA)}
      <div style={{position: 'absolute', left: 120, width: 840 * ln, top: 1300 - 60 * 9, borderTop: '5px dashed #1c1c1e'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1365, textAlign: 'center', fontFamily: 'Space Mono, monospace', fontSize: 30, color: C.sub, opacity: b}}>(perkiraan, data ledakan)</div>
    </AbsoluteFill>
  );
};

const Waves: React.FC<{t: number}> = ({t}) => {
  const ws = [{y: 1250, col: P13.wallA, l: 'getar kaca', at: 25.2}, {y: 1340, col: CORAL, l: 'getar bass', at: 29.4}];
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {ws.map((w) => {
        const k = r(t, w.at, w.at + 0.8), n = Math.floor(61 * k);
        if (n < 2) return null;
        return (
          <g key={w.y}>
            <path d={Array.from({length: n}, (_, i) => `${i ? 'L' : 'M'}${150 + i * 13} ${w.y + Math.sin(i / 4 - t * 6) * 30}`).join(' ')} stroke={w.col} strokeWidth={9} fill="none" strokeLinecap="round" />
            <text x={150} y={w.y - 44} fontFamily="Inter" fontWeight={800} fontSize={34} fill={w.col} opacity={k}>{w.l}</text>
          </g>
        );
      })}
    </svg>
  );
};

// subwoofer kertas: kotak hitam + kerucut besar yang memompa tiap dentuman
const Sub: React.FC<{pump: number}> = ({pump}) => (
  <group rotation={[0, -0.35, 0]}>
    <mesh castShadow><boxGeometry args={[1.25, 1.35, 0.9]} /><meshPhysicalMaterial color={P13.truck} roughness={0.6} clearcoat={0.4} /><Edges color="#000" lineWidth={2} /></mesh>
    <group position={[0, -0.05, 0.46 + 0.05 * pump]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.52, 0.52, 0.03, 48]} /><meshPhysicalMaterial color={P13.cone} roughness={0.7} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.02 - 0.05 * pump]}><coneGeometry args={[0.44, 0.2, 48, 1, true]} /><meshPhysicalMaterial color="#26262b" roughness={0.8} side={2} /></mesh>
      <mesh position={[0, 0, 0.02]}><circleGeometry args={[0.15, 32]} /><meshPhysicalMaterial color={CORAL} clearcoat={0.6} /></mesh>
    </group>
    <mesh position={[0.42, 0.52, 0.455]}><circleGeometry args={[0.06, 24]} /><meshBasicMaterial color={CORAL} toneMapped={false} /></mesh>
  </group>
);

// ayunan anak (inset 2D, analogi)
const Swing: React.FC<{t: number; p: number}> = ({t, p}) => {
  if (p <= 0) return null;
  const amp = interpolate(t, [38.3, 42.0], [8, 34], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), ang = amp * Math.sin((t - 38.3) * 3.2);
  return (
    <div style={{position: 'absolute', left: 640, top: 840, width: 360, height: 360, borderRadius: 30, background: 'rgba(250,249,246,0.97)', boxShadow: '0 12px 40px rgba(28,28,30,0.18)', opacity: p, transform: `scale(${0.8 + 0.2 * p})`}}>
      <svg width={360} height={360}>
        <line x1={40} y1={40} x2={320} y2={40} stroke={INK} strokeWidth={10} strokeLinecap="round" />
        <g transform={`rotate(${ang} 180 40)`}>
          <line x1={150} y1={40} x2={150} y2={250} stroke={INK} strokeWidth={5} /><line x1={210} y1={40} x2={210} y2={250} stroke={INK} strokeWidth={5} />
          <rect x={135} y={248} width={90} height={14} rx={6} fill={CORAL} />
          <circle cx={180} cy={205} r={22} fill={P13.wallA} /><rect x={165} y={226} width={30} height={26} rx={8} fill={P13.wallA} />
        </g>
      </svg>
    </div>
  );
};

const CheckRow: React.FC<{y: number; text: string; p: number; tick: number}> = ({y, text, p, tick}) => p > 0 ? (
  <div style={{position: 'absolute', left: 120, top: y, display: 'flex', alignItems: 'center', gap: 24, padding: '14px 28px', borderRadius: 22, background: 'rgba(250,249,246,0.97)', boxShadow: '0 10px 26px rgba(28,28,30,0.18)', opacity: p, transform: `translateX(${(1 - p) * -40}px)`, fontFamily: 'Inter', fontWeight: 800, fontSize: 52, color: INK}}>
    <div style={{width: 64, height: 64, borderRadius: 14, border: `6px solid ${INK}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: CORAL, fontSize: 56}}>{tick > 0 ? '✓' : ''}</div>{text}
  </div>
) : null;

// ayunan layar penuh (analogi): anak di ayunan, tangan mendorong pas di titik balik
const BigSwing: React.FC<{t: number}> = ({t}) => {
  const amp = interpolate(t, [38.3, 42.2], [10, 38], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), ph = (t - 38.3) * 3.0, ang = amp * Math.sin(ph);
  const push = Math.max(0, -Math.cos(ph)) ** 6; // dorongan muncul tepat saat ayunan kembali
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}><g transform="translate(0 70) scale(1 0.92)">
      <rect x={140} y={640} width={800} height={26} rx={13} fill={INK} />
      <line x1={190} y1={660} x2={150} y2={1330} stroke={INK} strokeWidth={22} strokeLinecap="round" /><line x1={890} y1={660} x2={930} y2={1330} stroke={INK} strokeWidth={22} strokeLinecap="round" />
      <g transform={`rotate(${ang} 540 660)`}>
        <line x1={480} y1={660} x2={480} y2={1150} stroke={INK} strokeWidth={8} /><line x1={600} y1={660} x2={600} y2={1150} stroke={INK} strokeWidth={8} />
        <rect x={450} y={1145} width={180} height={30} rx={10} fill={CORAL} stroke={INK} strokeWidth={5} />
        <circle cx={540} cy={1030} r={46} fill={P13.wallA} stroke={INK} strokeWidth={5} /><rect x={505} y={1074} width={70} height={74} rx={18} fill={P13.wallA} stroke={INK} strokeWidth={5} />
      </g>
      <g opacity={push} transform={`translate(${-60 * (1 - push)} 0)`}>
        <rect x={250} y={1080} width={150} height={52} rx={26} fill="#f1c9a5" stroke={INK} strokeWidth={5} />
        <text x={190} y={1010} fontFamily="Inter" fontWeight={900} fontSize={56} fill={CORAL}>dorong!</text>
      </g>
    </g></svg>
  );
};

// kaca pembesar: sudut kaca tetangga diperbesar (2D), gompal lalu retak menjalar
const Magnifier: React.FC<{t: number}> = ({t}) => {
  const p = r(t, 44.6, 45.2, Easing.out(Easing.back(1.6))), k = r(t, 47.5, 48.9, Easing.out(Easing.quad));
  if (p <= 0) return null;
  const cracks = [[0, 0, 120, -60, 210, -70, 320, -150], [0, 0, 60, -110, 90, -200, 160, -300], [0, 0, 150, -10, 260, 10, 360, -20]];
  return (
    <div style={{position: 'absolute', left: 430, top: 690, width: 520, height: 520, transform: `scale(${p * 0.82})`, transformOrigin: '0 100%'}}>
      <svg width={620} height={720} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <defs><clipPath id="lens"><circle cx={260} cy={260} r={244} /></clipPath></defs>
        <line x1={430} y1={430} x2={600} y2={620} stroke={INK} strokeWidth={46} strokeLinecap="round" />
        <g clipPath="url(#lens)">
          <rect x={0} y={0} width={520} height={520} fill="#fbfaf6" />
          <rect x={60} y={0} width={460} height={420} fill={P13.glass} />
          <rect x={20} y={0} width={40} height={460} fill={P13.frame} /><rect x={20} y={420} width={500} height={40} fill={P13.frame} />
          <polygon points="60,420 60,372 104,420" fill="#fbfaf6" />
          <g transform="translate(66 414)">
            {cracks.map((c, i) => { const n = Math.max(2, Math.ceil((c.length / 2) * k)); if (k <= 0) return null; const pts = c.slice(0, n * 2).join(' ');
              return <g key={i}><polyline points={pts} fill="none" stroke="#fbfaf6" strokeWidth={14} strokeLinejoin="round" /><polyline points={pts} fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" /></g>; })}
          </g>
        </g>
        <circle cx={260} cy={260} r={244} fill="none" stroke={INK} strokeWidth={22} />
        <circle cx={82} cy={398} r={52} fill="none" stroke={CORAL} strokeWidth={8} opacity={r(t, 45.0, 45.4)} />
      </svg>
    </div>
  );
};

// kartu cek: ikon gompal & karet keras
const CheckCards: React.FC<{t: number}> = ({t}) => {
  const card = (x: number, title: string, p: number, tick: number, icon: React.ReactNode) => p > 0 && (
    <div style={{position: 'absolute', left: x, top: 700, width: 420, height: 560, borderRadius: 34, background: 'rgba(250,249,246,0.98)', boxShadow: '0 16px 50px rgba(28,28,30,0.2)', opacity: p, transform: `translateY(${(1 - p) * 60}px) rotate(${x < 500 ? -3 : 3}deg)`}}>
      <svg width={420} height={380}>{icon}</svg>
      <div style={{textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 48, color: INK}}>{title}</div>
      <div style={{position: 'absolute', right: 24, top: 24, width: 84, height: 84, borderRadius: 20, border: `7px solid ${INK}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 74, color: CORAL, fontWeight: 900}}>{tick > 0 ? '✓' : ''}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      {card(70, 'pinggir gompal?', r(t, 56.3, 56.8), r(t, 59.3, 59.4), <g><rect x={60} y={60} width={300} height={260} fill={P13.glass} /><rect x={40} y={40} width={22} height={300} fill={P13.frame} /><rect x={40} y={318} width={320} height={22} fill={P13.frame} /><polygon points="62,318 62,270 104,318" fill="#fbfaf6" /><circle cx={84} cy={298} r={46} fill="none" stroke={CORAL} strokeWidth={7} /></g>)}
      {card(590, 'karet keras?', r(t, 59.7, 60.2), r(t, 60.5, 60.6), <g><rect x={60} y={150} width={300} height={70} rx={18} fill="#3a3a40" />{[110, 180, 250, 310].map((x) => <polyline key={x} points={`${x},150 ${x + 12},175 ${x - 6},195 ${x + 8},220`} fill="none" stroke="#fbfaf6" strokeWidth={6} />)}<text x={210} y={290} textAnchor="middle" fontFamily="Inter" fontWeight={800} fontSize={34} fill={C.sub}>retak, mengeras</text></g>)}
    </AbsoluteFill>
  );
};

// ---------- SFX (dibaca juga oleh tools/mix-audio.mjs) ----------
const SFX: [string, number, number][] = [
  ['engine', 0.1, 0.45], ['bass', 1.0, 0.7], ['bass', 1.5, 0.7], ['bass', 2.0, 0.7], ['bass', 2.5, 0.7], ['bass', 3.0, 0.7], ['crackle', 3.9, 0.7], ['whoosh', 4.75, 0.3], ['whoosh', 6.35, 0.25],
  ['whoosh', 9.0, 0.35], ['thud', 9.4, 0.5], ['whoosh', 13.55, 0.25], ['tick', 15.3, 0.35], ['tick', 19.7, 0.35], ['pop', 20.4, 0.4],
  ['whoosh', 21.3, 0.3], ['bass', 22.6, 0.6], ['bass', 23.1, 0.5], ['bass', 23.6, 0.4], ['riser', 25.2, 0.25], ['ting', 30.9, 0.4],
  ['whoosh', 31.55, 0.25], ['bass', 32.9, 0.5], ['bass', 33.9, 0.55], ['bass', 34.9, 0.6], ['bass', 35.9, 0.65], ['bass', 36.9, 0.7], ['whoosh', 38.3, 0.25], ['pop', 40.4, 0.3], ['pop', 42.0, 0.3],
  ['whoosh', 42.4, 0.3], ['pop', 45.0, 0.45], ['crackle', 47.5, 0.7], ['chime', 49.5, 0.4], ['pop', 53.4, 0.45],
  ['whoosh', 55.9, 0.3], ['pop', 56.3, 0.35], ['pop', 59.3, 0.4], ['pop', 59.7, 0.35], ['pop', 60.5, 0.4], ['whoosh', 61.4, 0.3], ['engine', 61.5, 0.35], ['pop', 64.1, 0.4], ['whoosh', 67.0, 0.3], ['pop', 68.4, 0.4], ['chime', 71.8, 0.4],
];

export const Video13: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, ms = t * 1000;
  const inPB = t >= B.mitos && t < B.angka;
  return (
    <AbsoluteFill>
      <PaperPlus />

      {/* A. hook: jalan, truk, kaca tetangga retak */}
      <Seg a={0} b={B.mitos}><Street t={t} crackK={r(t, 3.6, 4.4, Easing.out(Easing.quad))} cam={camAt(t, [[0, [0, 1.55, 235]], [3.1, [0, 1.55, 245]], [3.8, [-0.85, 0.8, 380]], [4.6, [-0.85, 0.8, 390]], [5.4, [0.85, 0.75, 430]], [6.4, [0.85, 0.75, 440]], [7.2, [0, 1.5, 255]], [9, [0, 1.5, 262]]])} shake={t > 3.6 && t < 4.4 ? 1 : 0} /></Seg>
      {/* C. angka */}
      <Seg a={B.angka} b={B.bass}><Bars t={t} /></Seg>
      {/* D. bass: subwoofer memompa + gelombang */}
      <Seg a={B.bass} b={B.ayun}>
        <Stage cam={camAt(t, [[21.3, [0, 0.1, 380]], [25, [0, 0.1, 470]], [31.6, [0, 0.2, 480]]])}>
          <Sub pump={thump(t, 21.3)} />
          <group scale={1 + 0.1 * (1 - thump(t, 21.3))}><Rings x={0} y={0} z={-0.5} n={5} r0={0.95} /></group>
        </Stage>
        <Waves t={t} />
        <Chip x={540} y={1530} p={r(t, 27.2, 27.6) * (1 - r(t, 30.0, 30.3))} text="±20 kali per detik" />
        <Chip x={540} y={1530} p={r(t, 30.3, 30.7) * (1 - r(t, 31.2, 31.6))} text="getarnya mirip" color={CORAL} />
      </Seg>
      {/* E. tampak samping: subwoofer mendorong udara, kaca melengkung seperti busur */}
      <Seg a={B.ayun} b={38.3}>
        <Stage cam={camAt(t, [[31.6, [0, 0.4, 300]], [38.3, [0, 0.4, 330]]])}>
          <group position={[-1.0, 0.1, 0]} scale={0.75}><Sub pump={thump(t, 32.9)} /></group>
          {[0, 1, 2].map((i) => { const ph = ((t - 32.9) / BEAT + i / 3) % 1; return t > 32.9 && <mesh key={i} position={[-0.35 + ph * 1.0, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}><ringGeometry args={[0.3 + ph * 0.25, 0.34 + ph * 0.25, 48, 1, -Math.PI / 2, Math.PI]} /><meshBasicMaterial color={CORAL} toneMapped={false} transparent opacity={1 - ph} side={2} /></mesh>; })}
          <group position={[1.05, 0.1, 0]} rotation={[0, Math.PI / 2 - 0.25, 0]}>
            <Window w={1.4} h={1.5} flex={interpolate(t, [32.9, 37.5], [0.03, 0.28], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * Math.sin((t - 32.9) * Math.PI * 2)} />
          </group>
        </Stage>
        <Chip x={300} y={1180} p={r(t, 33.1, 33.5)} text="dorong" color={CORAL} />
        <Chip x={780} y={1180} p={r(t, 36.4, 36.8)} text="makin lebar" color={P13.wallA} />
      </Seg>
      {/* E2. analogi ayunan, layar penuh */}
      <Seg a={38.3} b={B.gompal}><BigSwing t={t} /></Seg>
      {/* F. kaca tetangga + kaca pembesar di sudut gompal */}
      <Seg a={B.gompal} b={B.payoff}>
        <Street t={t - B.gompal + 9} truck={false} crackK={0} cam={camAt(t, [[42.4, [0, 1.4, 250]], [44.6, [-0.85, 0.8, 400]], [49.3, [-0.85, 0.8, 420]]])} />
        <Magnifier t={t} />
      </Seg>
      {/* G. payoff: dua rumah */}
      <Seg a={B.payoff} b={B.aksi}><Street t={t - B.payoff + 9} truck={false} crackK={1} cam={[0, 1.4, interpolate(t, [B.payoff, B.aksi], [270, 245])]} /></Seg>
      {/* H. aksi: kartu ikon cek, lalu jalan arak-arakan */}
      <Seg a={B.aksi} b={61.4}><CheckCards t={t} /></Seg>
      <Seg a={61.4} b={B.tanya}>
        <Street t={t - 61.4} crackK={0} cam={[0, 1.55, interpolate(t, [61.4, 67], [250, 270])]} />
        <Chip x={540} y={760} p={r(t, 64.1, 64.5)} text="rumah di pinggir jalan: wajib" color={CORAL} />
      </Seg>
      {/* I. tanya + follow */}
      <Seg a={B.tanya} b={B.end}>
        <Street t={t - B.tanya + 9} truck={false} crackK={0} cam={[0, 1.4, 250]} />
        <Chip x={330} y={1180} p={r(t, 68.4, 68.8) * (1 - r(t, 71.2, 71.6))} text="PERNAH" color={CORAL} size={52} />
        <Chip x={750} y={1180} p={r(t, 68.7, 69.1) * (1 - r(t, 71.2, 71.6))} text="AMAN" color={P13.wallA} size={52} />
      </Seg>

      {/* teks layar (judul dua tingkat) */}
      <Title t={t} a={2.9} b={B.mitos} small="Kaca tetangga pecah," big="KACAMU AMAN?" bigAt={4.8} />
      <Title t={t} a={B.angka} b={B.bass} small="Kaca utuh baru pecah" big="DI ATAS 150 dB" bigAt={17.6} color={P13.wallA} />
      <Title t={t} a={B.bass} b={B.ayun} small="Masalahnya ada di" big="BASS" bigAt={22.6} size={130} />
      <Title t={t} a={B.ayun + 0.2} b={B.gompal} small="Didorong pas waktunya," big="MAKIN LEBAR" bigAt={36.4} />
      <Title t={t} a={B.gompal} b={B.payoff} small="Ternyata ada" big="GOMPAL DI TEPI" bigAt={45.0} />
      <Title t={t} a={B.payoff} b={B.aksi} small="Bass yang getarnya sama" big="+ PINGGIR GOMPAL" bigAt={53.4} size={96} />
      <Title t={t} a={B.aksi} b={61.4} small="Raba pinggir kaca" big="HARI INI" bigAt={57.6} size={120} />
      <Title t={t} a={61.4} b={B.tanya} small="Ganti sebelum" big="MUSIM ARAK-ARAKAN" bigAt={62.3} size={84} />
      <Title t={t} a={B.tanya} b={B.follow} small="Kacamu pernah" big="IKUT BERGETAR?" bigAt={68.4} size={100} />

      {/* mitos: pemutus pola */}
      {inPB && <PatternBreak lines={['KARENA', 'KENCANGNYA?']} sub={t > 11.8 ? 'angkanya bilang lain' : undefined} p={r(t, B.mitos, B.mitos + 0.6)} />}

      {!inPB && <><Kicker text="FAKTA RUMAH · #13" y={292} start={0} /><TikTokBox text="Kaca pecah karena sound horeg?" p={r(t, 0.2, 1.0, Easing.linear)} y={338} size={40} /></>}
      {!inPB && <><Ornament cx={1030} cy={150} size={360} start={0} /><Ornament cx={40} cy={1800} size={360} start={6} /></>}
      <FollowButton start={Math.round(B.follow * FPS)} click={Math.round((B.follow + 1.0) * FPS)} y={760} />
      {!inPB && <Captions ms={ms} />}

      <Audio src={staticFile('v13/vo.mp3')} />
      <Audio src={staticFile('v13/sfx/ambient.wav')} volume={0.08} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`v13/sfx/${n}.wav`)} volume={v} /></Sequence>)}
      <Grain o={0.08} />
    </AbsoluteFill>
  );
};
