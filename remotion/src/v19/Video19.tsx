// Video #19 "Pintu depan sejajar pintu belakang" (Bukan Sial #04). KUNCI KARAKTER: kerangka v08 (kamera perspektif, Seg, Title, Captions, Chip), palet `mint`, TANPA Ornament.
// Satu objek besar per adegan (lorong dengan dua pintu), timing dari public/v19/words.json.
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import * as THREE from 'three';
import {Edges} from '@react-three/drei';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Env, Ghost, PALETTE} from '../pengetahuan/Scene';
import {Grain, TikTokBox} from '../aset/Aset';
import {Kicker, CommentBubble, FollowButton} from '../aset/Gabung';
import {PaperPalet, PALET} from '../aset/PaperPalet';
import words from '../../public/v19/words.json';

export const FPS = 30;
export const V19_END = 52.5;
export const V19_FRAMES = Math.ceil(V19_END * FPS);
const FOV = 34, ASPECT = 1080 / 1920, CC_TOP = 1400;
export const PL = PALET.mint;
const INK = PALETTE.ink, CORAL = PL.accent, COOL = PL.cool, GOOD = PL.good;

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
const B = {hook: 0, rezeki: 2.45, mitos: 5.4, ilmiah: 9.0, angin: 11.4, silang: 19.8, jamur: 22.0, privasi: 26.4, pandang: 28.5, rak: 32.2, feng: 39.3, denah: 43.0, tanya: 48.3, follow: 50.0, end: V19_END};

// ---------- kamera ----------
const CAM_HOOK: Key[] = [{t: 0, pos: [0.25, 1.3, 8.0], look: [0, 1.1, -2]}, {t: 5.6, pos: [0.1, 1.2, 6.4], look: [0, 1.1, -2.5]}];
const CAM_WIND: Key[] = [{t: 11.2, pos: [-3.6, 8.4, 5.0], look: [0, 0, -0.3]}, {t: 19.9, pos: [0.3, 9.4, 5.6], look: [0, 0, -0.3]}, {t: 26.6, pos: [3.6, 8.4, 5.0], look: [0, 0, -0.3]}];
const CAM_PRIV: Key[] = [{t: 26.3, pos: [0.2, 10.4, 7.8], look: [0, 0, -0.3]}, {t: 32.4, pos: [0.1, 7.6, 4.6], look: [0, 0, -0.3]}];
const CAM_RACK: Key[] = [{t: 32.1, pos: [-3.6, 7.2, 5.0], look: [0, 0.3, -0.2]}, {t: 43.2, pos: [-2.6, 5.0, 4.2], look: [0, 0.5, -0.2]}];
const CAM_PLAN: Key[] = [{t: 42.9, pos: [0, 24, 0], look: [0, 0, -0.8]}, {t: 48.5, pos: [0, 27, 0], look: [0, 0, -0.8]}];
const CAM_END: Key[] = [{t: 48.2, pos: [1.3, 1.8, 8.2], look: [0, 1.1, 0]}, {t: 52.5, pos: [0.6, 1.7, 9.8], look: [0, 1.1, 0]}];

// ---------- 3D: lorong dua pintu ----------
const WALL = '#f6efe0', WOOD = '#d9b48a', DOOR = '#b98a5a', CHAR = '#2c2c30';
const Mat: React.FC<{c: string}> = ({c}) => <meshStandardMaterial color={c} roughness={0.6} metalness={0} />;
const Bx: React.FC<{p: V3; s: V3; c: string; rot?: V3; edge?: boolean}> = ({p, s, c, rot = [0, 0, 0], edge = true}) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><boxGeometry args={s} /><Mat c={c} />{edge && <Edges color={INK} lineWidth={1.4} />}</mesh>
);
const Cy: React.FC<{p: V3; rad: number; h: number; c: string; rot?: V3}> = ({p, rad, h, c, rot = [0, 0, 0]}) => (
  <mesh position={p} rotation={rot} castShadow><cylinderGeometry args={[rad, rad, h, 28]} /><Mat c={c} /><Edges color={INK} lineWidth={1.2} /></mesh>
);
const Sp: React.FC<{p: V3; rad: number; c: string; s?: V3}> = ({p, rad, c, s = [1, 1, 1]}) => (
  <mesh position={p} scale={s} castShadow><sphereGeometry args={[rad, 24, 18]} /><Mat c={c} /></mesh>
);
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/* dinding berlubang pintu di z */
const WallDoor: React.FC<{z: number}> = ({z}) => (
  <group>
    <Bx p={[-0.8, 1.2, z]} s={[0.6, 2.4, 0.14]} c={WALL} />
    <Bx p={[0.8, 1.2, z]} s={[0.6, 2.4, 0.14]} c={WALL} />
    <Bx p={[0, 2.2, z]} s={[1.0, 0.4, 0.14]} c={WALL} />
    <Bx p={[-0.53, 1.0, z]} s={[0.06, 2.0, 0.2]} c={DOOR} />
    <Bx p={[0.53, 1.0, z]} s={[0.06, 2.0, 0.2]} c={DOOR} />
    <Bx p={[0, 2.03, z]} s={[1.12, 0.06, 0.2]} c={DOOR} />
  </group>
);
const DoorLeaf: React.FC<{z: number; open: number; side?: 1 | -1}> = ({z, open, side = 1}) => (
  <group position={[side * 0.5, 1.0, z]} rotation={[0, -open * 1.35, 0]}>
    <Bx p={[-side * 0.45, 0, 0]} s={[0.9, 1.96, 0.07]} c={DOOR} />
    <Sp p={[-side * 0.8, 0, 0.07]} rad={0.045} c="#f2c25c" />
  </group>
);

type HallP = {wl?: number; wr?: number; open?: number; coin?: number; wind?: number; sight?: number; shelf?: number; curtain?: number; plant?: number; t: number; fade?: number};
const Hall: React.FC<HallP> = ({wl = 1, wr, open = 1, coin = -1, wind = 0, sight = 0, shelf = 0, curtain = 0, plant = 0, t}) => {
  const streaks = Array.from({length: 15}, (_, i) => {
    const spd = 2.2 + hash(i) * 1.2, len = 10.5;
    const z = 5.2 - ((t * spd + hash(i + 9) * len) % len);
    const sw = Math.sin(z * 1.7 + i) * 0.26, y = 0.55 + (i % 6) * 0.26 + Math.sin(z * 2.2 + i * 2) * 0.07;
    const x = (hash(i + 3) - 0.5) * 0.55 + sw;
    return {z, x, y};
  });
  return (
    <group>
      {/* lantai + halaman */}
      <Bx p={[0, -0.05, 0]} s={[2.4, 0.1, 5.4]} c={WOOD} />
      <Bx p={[0, -0.07, 18]} s={[60, 0.08, 31]} c="#cfd4cf" edge={false} />
      <Bx p={[0, -0.07, -18]} s={[60, 0.08, 31]} c="#8fc27a" edge={false} />
      {/* pohon halaman belakang */}
      <Cy p={[0.9, 0.5, -5.2]} rad={0.1} h={1.0} c="#8a6544" />
      <Sp p={[0.9, 1.5, -5.2]} rad={0.75} c="#6fae5d" s={[1, 1.1, 1]} />
      {/* dinding */}
      <Bx p={[1.2, 1.2 * (wr ?? wl), 0]} s={[0.12, 2.4 * Math.max(wr ?? wl, 0.03), 5]} c={WALL} />
      <Bx p={[-1.2, 1.2 * wl, 0]} s={[0.12, 2.4 * Math.max(wl, 0.03), 5]} c={WALL} />
      <WallDoor z={2.5} /><WallDoor z={-2.5} />
      <DoorLeaf z={2.5} open={open} side={1} /><DoorLeaf z={-2.5} open={open} side={-1} />
      {/* dapur kecil di sisi kiri dalam */}
      <Bx p={[-0.78, 0.45, -1.7]} s={[0.5, 0.9, 1.1]} c="#e9e2d2" />
      <Cy p={[-0.78, 0.93, -1.55]} rad={0.12} h={0.04} c={CHAR} /><Cy p={[-0.78, 0.93, -1.9]} rad={0.12} h={0.04} c={CHAR} />
      {/* koin rezeki */}
      {coin > -1 && <group position={[0, 1.15, 4.2 - coin * 9.2]} rotation={[0, 0, 0]}><Cy p={[0, 0, 0]} rad={0.2} h={0.05} c={CORAL} rot={[Math.PI / 2, 0, 0]} /><Sp p={[0, 0, 0]} rad={0.07} c="#ffe29a" /></group>}
      {/* angin */}
      {wind > 0 && streaks.map((s, i) => <Bx key={i} p={[s.x, s.y, s.z]} s={[0.14 * wind, 0.14 * wind, 1.2]} c={COOL} edge={false} />)}
      {wind > 0 && Array.from({length: 4}, (_, i) => { const z = -2.2 - ((t * 1.1 + i * 0.9) % 3.2); return <Sp key={i} p={[-0.2 + i * 0.12, 1.4 - i * 0.2, z]} rad={0.07} c="#9a9488" />; })}
      {/* garis pandang koral */}
      {sight > 0 && <Bx p={[0, 1.3, 4.0 - sight * 4.5]} s={[0.07, 0.07, 9.0 * sight]} c={CORAL} edge={false} />}
      {sight > 0.98 && <mesh position={[0, 1.3, -4.9]}><torusGeometry args={[0.3, 0.05, 12, 32]} /><Mat c={CORAL} /></mesh>}
      {/* rak */}
      {shelf > 0 && (
        <group position={[0, 0, 0.3]} scale={[1, shelf, 1]}>
          <Bx p={[-0.42, 0.95, 0]} s={[0.07, 1.9, 0.34]} c={WOOD} /><Bx p={[0.42, 0.95, 0]} s={[0.07, 1.9, 0.34]} c={WOOD} />
          {[0.4, 1.0, 1.6].map((y) => <Bx key={y} p={[0, y, 0]} s={[0.86, 0.05, 0.34]} c={WOOD} />)}
          <Bx p={[-0.2, 0.55, 0]} s={[0.22, 0.2, 0.2]} c={CORAL} /><Bx p={[0.18, 1.15, 0]} s={[0.2, 0.28, 0.2]} c={COOL} /><Bx p={[-0.1, 1.75, 0]} s={[0.3, 0.2, 0.2]} c={GOOD} />
        </group>
      )}
      {/* gorden */}
      {curtain > 0 && <group position={[0.55, 2.02, 1.0]} rotation={[0, 0, Math.sin(t * 2) * 0.02]} scale={[1, curtain, 1]}>
        <Bx p={[0, -0.9, 0]} s={[0.85, 1.8, 0.05]} c="#e6b25f" /><Cy p={[0, 0.05, 0]} rad={0.03} h={1.1} c={INK} rot={[0, 0, Math.PI / 2]} />
      </group>}
      {/* tanaman */}
      {plant > 0 && <group position={[0.85, 0, 0.2]} scale={plant}>
        <Cy p={[0, 0.2, 0]} rad={0.19} h={0.4} c={CORAL} />
        {[0, 1, 2, 3, 4].map((i) => <Sp key={i} p={[Math.cos(i * 1.26) * 0.14, 0.62 + (i % 2) * 0.16, Math.sin(i * 1.26) * 0.14]} rad={0.15} c={GOOD} s={[0.6, 1.6, 0.6]} />)}
      </group>}
    </group>
  );
};

const Rig: React.FC<{k: Key}> = ({k}) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  cam.position.set(...k.pos); cam.fov = FOV; cam.updateProjectionMatrix(); cam.lookAt(...k.look);
  return null;
};
const Lights: React.FC = () => (<><Env /><ambientLight intensity={0.35} /><directionalLight position={[4, 7, 5]} intensity={2.6} color="#ffffff" /><directionalLight position={[-4, 2, 3]} intensity={0.5} color="#e6fff3" /></>);
const Canvas3D: React.FC<{k: Key; children: React.ReactNode}> = ({k, children}) => (
  <ThreeCanvas width={1080} height={1920} camera={{position: k.pos, fov: FOV}} gl={{alpha: true, antialias: true}}>
    <Lights /><Rig k={k} />{children}
  </ThreeCanvas>
);
const OV = 8;
const Seg: React.FC<{a: number; b: number; f: number; first?: boolean; children: React.ReactNode}> = ({a, b, f, first, children}) => {
  const fa = Math.max(0, Math.round(a * FPS) - (first ? 0 : OV)), fb = Math.round(b * FPS) + OV;
  const o = interpolate(f, [fa, fa + 2 * OV, fb - 2 * OV, fb], [first ? 1 : 0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Sequence from={fa} durationInFrames={fb - fa} layout="none"><AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill></Sequence>;
};

// ---------- teks layar ----------
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
const Chip: React.FC<{x: number; y: number; p: number; text: string; color?: string; size?: number}> = ({x, y, p, text, color = INK, size = 40}) => {
  if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * p})`, opacity: p, padding: '10px 22px', borderRadius: 16, background: 'rgba(250,249,246,0.97)', border: `4px solid ${color}`, fontFamily: 'Inter', fontWeight: 800, fontSize: size, color, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(28,28,30,0.18)'}}>{text}</div>;
};

/* panel 2D pemutus pola: "katanya" vs "belum terbukti" */
const Katanya: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 5.45, 5.9, Easing.out(Easing.cubic)), o = 1 - r(t, 11.0, 11.35);
  const arrow = r(t, 6.2, 8.2, Easing.linear), st = r(t, 9.2, 9.6, Easing.out(Easing.back(2.2)));
  return (
    <div style={{position: 'absolute', inset: 0, opacity: a * o}}>
      <div style={{position: 'absolute', left: 60, right: 60, top: 700, height: 560, borderRadius: 34, background: '#fff6e2', border: `6px solid ${INK}`, transform: `translateY(${(1 - a) * 40}px)`, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 36, top: 26, fontFamily: 'IBM Plex Mono', fontWeight: 500, fontSize: 40, color: INK}}>KATANYA</div>
        <svg width="960" height="560" style={{position: 'absolute'}}>
          <rect x="60" y="190" width="90" height="190" rx="14" fill="#b98a5a" stroke={INK} strokeWidth="8" />
          <rect x="810" y="190" width="90" height="190" rx="14" fill="#b98a5a" stroke={INK} strokeWidth="8" />
          <line x1="170" y1="285" x2={170 + 620 * arrow} y2="285" stroke={CORAL} strokeWidth="14" strokeLinecap="round" strokeDasharray="4 26" />
          <circle cx={170 + 620 * arrow} cy="285" r="34" fill={CORAL} stroke={INK} strokeWidth="8" />
        </svg>
        <div style={{position: 'absolute', left: 120, top: 400, fontFamily: 'Inter', fontWeight: 800, fontSize: 44, color: INK}}>energi baik masuk, langsung lewat</div>
        <div style={{position: 'absolute', right: 40, top: 40, transform: `rotate(-8deg) scale(${0.6 + 0.4 * st})`, opacity: st, padding: '10px 28px', border: `10px solid ${CORAL}`, borderRadius: 20, color: CORAL, background: 'rgba(250,249,246,0.92)', fontFamily: 'Inter', fontWeight: 900, fontSize: 64, whiteSpace: 'nowrap'}}>BELUM TERBUKTI</div>
      </div>
    </div>
  );
};

const SFX: [string, number, number][] = [
  ['pop', 0.5, 0.4], ['whoosh', 5.4, 0.3], ['tick', 6.4, 0.4], ['ting', 9.3, 0.4], ['whoosh', 11.3, 0.3],
  ['flow', 12.0, 0.25], ['pop', 15.6, 0.35], ['pop', 19.86, 0.4], ['whoosh', 22.0, 0.25],
  ['whoosh', 26.4, 0.3], ['riser', 27.4, 0.3], ['knock', 28.55, 0.4], ['thud', 30.5, 0.35],
  ['whoosh', 32.2, 0.3], ['pop', 33.0, 0.4], ['pop', 35.2, 0.35], ['chime', 39.5, 0.4],
  ['whoosh', 43.0, 0.3], ['pop', 44.2, 0.4], ['pop', 45.0, 0.4], ['tick', 47.0, 0.35],
  ['pop', 48.4, 0.4], ['chime', 50.3, 0.4],
];

export const Video19: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const ch = camAt(CAM_HOOK, t), cw = camAt(CAM_WIND, t), cp = camAt(CAM_PRIV, t), cr = camAt(CAM_RACK, t), cn = camAt(CAM_PLAN, t), ce = camAt(CAM_END, t);
  const coin = (t % 2.4) / 2.4 * (t < B.mitos ? 1 : 0);
  const wind = r(t, 11.6, 12.3);
  const sightP = r(t, 27.4, 29.6, Easing.out(Easing.cubic)) * (t < B.rak ? 1 : 0);
  const sightRack = t >= B.rak ? 0.55 * (1 - r(t, 34.3, 35.2)) : 0;
  const coinPos = (c: number): V3 => [0, 1.15, 4.2 - c * 9.2];
  const cp1 = proj(ch, coinPos(coin));
  const d1 = proj(cn, [0, 0, 2.5]), d2 = proj(cn, [0, 0, -2.5]);

  return (
    <AbsoluteFill>
      <PaperPalet palet="mint" />
      {t >= B.mitos && t < B.angin && <Ghost lines={['Katanya', 'Lewat']} />}

      {/* ---------- 3D ---------- */}
      <Seg a={0} b={B.mitos} f={f} first><Canvas3D k={ch}><Hall coin={coin} t={t} wl={1} /></Canvas3D></Seg>
      <Seg a={B.angin} b={B.privasi} f={f}><Canvas3D k={cw}><Hall wl={0.18} wind={wind} t={t} /></Canvas3D></Seg>
      <Seg a={B.privasi} b={B.rak} f={f}><Canvas3D k={cp}><Hall wl={0.18} sight={sightP} t={t} /></Canvas3D></Seg>
      <Seg a={B.rak} b={B.denah} f={f}><Canvas3D k={cr}><Hall wl={0.18} wind={1} sight={sightRack} shelf={r(t, 32.5, 34.0, Easing.out(Easing.back(1.6)))} curtain={r(t, 35.9, 37.4, Easing.out(Easing.cubic))} plant={r(t, 39.6, 40.5, Easing.out(Easing.back(2)))} t={t} /></Canvas3D></Seg>
      <Seg a={B.denah} b={B.follow} f={f}><Canvas3D k={cn}><Hall wl={0.18} open={1} t={t} /></Canvas3D></Seg>
      <Seg a={B.follow} b={B.end} f={f}><Canvas3D k={ce}><Hall wl={1} t={t} /></Canvas3D></Seg>

      <Kicker text="BUKAN SIAL · #19" y={292} start={0} color={CORAL} />
      <TikTokBox text="Pintu sejajar, sial?" p={r(t, 0.15, 0.8, Easing.linear)} y={338} size={40} />
      <Katanya t={t} />
      <Chip x={Math.min(900, Math.max(180, cp1[0]))} y={Math.max(700, Math.min(1300, cp1[1] + 130))} p={r(t, 1.2, 1.6) * (1 - r(t, 4.7, 5.0)) * (t < B.mitos ? 1 : 0)} text="rezeki" color={CORAL} size={54} />

      {/* ---------- judul ---------- */}
      <Title t={t} a={0.2} b={B.rezeki} small="Pintu depan dan belakang" big="SEJAJAR?" size={140} />
      <Title t={t} a={B.rezeki} b={B.mitos} small="Katanya rezeki masuk," big="LANGSUNG LEWAT" size={104} />
      <Title t={t} a={B.mitos} b={B.ilmiah} small="Kata orang tua," big="ENERGI LEWAT" size={112} />
      <Title t={t} a={B.ilmiah} b={B.angin} small="Secara ilmiah," big="BELUM TERBUKTI" size={96} />
      <Title t={t} a={B.angin} b={B.silang} small="Yang pasti lewat lurus:" big="ANGIN" bigColor={COOL} size={150} />
      <Title t={t} a={B.silang} b={B.privasi} small="Namanya" big="VENTILASI SILANG" bigColor={COOL} size={88} />
      <Title t={t} a={B.privasi} b={B.rak} small="Harganya ada di" big="PRIVASI" size={140} />
      <Title t={t} a={B.rak} b={B.feng} small="Rak, sekat, atau" big="GORDEN" bigColor={GOOD} size={140} />
      <Title t={t} a={B.feng} b={B.denah} small="Solusi feng shui" big="SAMA SAJA" bigColor={GOOD} size={118} />
      <Title t={t} a={B.denah} b={B.follow} small="Cek denahnya" big="SEGARIS?" size={140} />

      {/* ---------- stiker ---------- */}
      <Chip x={540} y={1230} p={r(t, 28.7, 29.1) * (1 - r(t, 31.6, 31.95))} text="terlihat sampai dapur" color={CORAL} size={46} />
      <Chip x={540} y={1230} p={r(t, 34.6, 35.0) * (1 - r(t, 37.9, 38.3))} text="angin lewat, mata terhalang" color={GOOD} size={44} />
      {t >= B.denah && t < B.tanya + 0.2 && (
        <svg width="1080" height="1920" style={{position: 'absolute', opacity: r(t, 44.0, 44.5) * (1 - r(t, 48.0, 48.4))}}>
          <circle cx={d1[0]} cy={d1[1]} r="62" fill="none" stroke={CORAL} strokeWidth="12" /><circle cx={d2[0]} cy={d2[1]} r="62" fill="none" stroke={CORAL} strokeWidth="12" />
          <line x1={d1[0]} y1={d1[1] - 62} x2={d2[0]} y2={d2[1] + 62} stroke={CORAL} strokeWidth="10" strokeDasharray="6 26" strokeLinecap="round" />
        </svg>
      )}
      <CommentBubble word="segaris?" start={Math.round(48.4 * FPS)} y={600} out={Math.round(52.2 * FPS)} />
      <FollowButton start={Math.round(50.0 * FPS)} click={Math.round(51.1 * FPS)} y={1250} />
      <Captions ms={t * 1000} />
      <Grain o={0.05} id="g19" />

      <Audio src={staticFile('v19/vo.mp3')} />
      <Audio src={staticFile('sfx/ambient.wav')} volume={0.1} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
