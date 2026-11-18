// Video #20 "Stop kontak mirip hidung babi" (cara kerja bagian rumah). KUNCI KARAKTER: kerangka v08/v19 (kamera perspektif, Seg, Title, Captions, Chip), palet `madu`, TANPA Ornament.
// Satu objek besar per adegan (stop kontak, steker, setrika), timing dari public/v20/words.json.
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
import words from '../../public/v20/words.json';

export const FPS = 30;
export const V20_END = 54.95;
export const V20_FRAMES = Math.ceil(V20_END * FPS);
const FOV = 34, ASPECT = 1080 / 1920, CC_TOP = 1400;
export const PL = PALET.madu;
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
const B = {hook: 0, sejarah: 2.7, belum: 13.0, klip: 16.9, colok: 22.7, bocor: 28.1, tanpa: 37.4, cek: 44.4, tanya: 50.3, follow: 52.7, end: V20_END};

// ---------- kamera ----------
const CAM_HOOK: Key[] = [{t: 0, pos: [0.1, 0.05, 4.8], look: [0, 0, 0]}, {t: 2.8, pos: [0.05, 0.02, 4.0], look: [0, 0, 0]}];
const CAM_KLIP: Key[] = [{t: 16.7, pos: [-2.2, 0.9, 3.9], look: [0, 0, 0]}, {t: 22.9, pos: [2.0, 0.7, 3.9], look: [0, 0, 0]}];
const CAM_COLOK: Key[] = [{t: 22.5, pos: [4.1, 1.0, 3.6], look: [0.6, 0, 1.0]}, {t: 28.3, pos: [3.2, 0.5, 2.4], look: [0.5, 0, 0.7]}];
const CAM_BOCOR: Key[] = [{t: 28.0, pos: [0.1, 0.9, 10.6], look: [0.3, -0.7, 0]}, {t: 37.6, pos: [0.2, 0.3, 9.4], look: [0.3, -0.7, 0]}];
const CAM_TANPA: Key[] = [{t: 37.2, pos: [3.0, 0.8, 4.8], look: [0.5, 0, 0.9]}, {t: 44.6, pos: [3.8, 1.2, 6.4], look: [0.5, 0, 0.6]}];
const CAM_CEK: Key[] = [{t: 44.2, pos: [0.4, 0.2, 5.6], look: [0, 0, 0]}, {t: 50.5, pos: [0.1, 0.05, 4.0], look: [0, 0, 0]}];
const CAM_END: Key[] = [{t: 50.2, pos: [0.3, 0.1, 4.2], look: [0, 0, 0]}, {t: 54.95, pos: [0.1, 0.05, 5.4], look: [0, 0, 0]}];

// ---------- 3D ----------
const PLATE = '#fbf7ec', DARK = '#33302a', METAL = '#b4b9c0', IRON = '#d4d6dc';
const Mat: React.FC<{c: string; m?: number}> = ({c, m = 0}) => <meshStandardMaterial color={c} roughness={0.5} metalness={m} />;
const Bx: React.FC<{p: V3; s: V3; c: string; rot?: V3; edge?: boolean; m?: number}> = ({p, s, c, rot = [0, 0, 0], edge = true, m = 0}) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><boxGeometry args={s} /><Mat c={c} m={m} />{edge && <Edges color={INK} lineWidth={1.4} />}</mesh>
);
const Cy: React.FC<{p: V3; rad: number; h: number; c: string; rot?: V3; edge?: boolean; m?: number}> = ({p, rad, h, c, rot = [Math.PI / 2, 0, 0], edge = true, m = 0}) => (
  <mesh position={p} rotation={rot} castShadow><cylinderGeometry args={[rad, rad, h, 36]} /><Mat c={c} m={m} />{edge && <Edges color={INK} lineWidth={1.2} />}</mesh>
);
const Sp: React.FC<{p: V3; rad: number; c: string}> = ({p, rad, c}) => (<mesh position={p}><sphereGeometry args={[rad, 20, 14]} /><Mat c={c} /></mesh>);

/* stop kontak tipe Schuko menghadap +z; lubang bulat di x=±0.19, klip logam di tepi kiri-kanan cekungan */
const Outlet: React.FC<{clips?: boolean; glow?: number; ring?: number}> = ({clips = true, glow = 0, ring = 0}) => (
  <group>
    <Bx p={[0, 0, 0]} s={[1.3, 1.3, 0.12]} c={PLATE} />
    <Cy p={[0, 0, 0.065]} rad={0.52} h={0.03} c="#e8e1cf" />
    <Cy p={[0, 0, 0.085]} rad={0.5} h={0.02} c={DARK} edge={false} />
    {[-0.19, 0.19].map((x) => <Cy key={x} p={[x, 0, 0.1]} rad={0.085} h={0.02} c="#0d0d0f" edge={false} />)}
    {clips && [-1, 1].map((s) => <Bx key={s} p={[s * 0.47, 0, 0.12]} s={[0.05, 0.26, 0.07]} c={glow > 0.5 ? GOOD : METAL} m={0.4} />)}
    {ring > 0 && [-1, 1].map((s) => <mesh key={s} position={[s * 0.47, 0, 0.16]} scale={ring}><torusGeometry args={[0.2, 0.03, 12, 32]} /><Mat c={CORAL} /></mesh>)}
  </group>
);
/* steker: badan hitam bulat, dua pin, area kontak samping; z0 = muka depan badan */
const Plug: React.FC<{z0: number; glow?: number}> = ({z0, glow = 0}) => (
  <group>
    <Cy p={[0, 0, z0 + 0.19]} rad={0.45} h={0.38} c="#2c2c30" />
    {[-0.19, 0.19].map((x) => <Cy key={x} p={[x, 0, z0 - 0.2]} rad={0.07} h={0.42} c={METAL} edge={false} m={0.5} />)}
    {[-1, 1].map((s) => <Bx key={s} p={[s * 0.465, 0, z0 + 0.08]} s={[0.04, 0.2, 0.12]} c={glow > 0.5 ? GOOD : METAL} m={0.4} />)}
    <Cy p={[0, 0, z0 + 0.9]} rad={0.12} h={1.0} c="#2c2c30" edge={false} />
  </group>
);
const Iron: React.FC<{p: V3; spark?: number}> = ({p, spark = 0}) => (
  <group position={p}>
    <Bx p={[0, 0, 0]} s={[1.5, 0.28, 0.75]} c={CORAL} />
    <Bx p={[0.05, 0.38, 0]} s={[1.2, 0.5, 0.65]} c={IRON} m={0.3} />
    <Bx p={[-0.1, 0.85, 0]} s={[0.9, 0.12, 0.12]} c={DARK} />
    {spark > 0 && <Sp p={[0.35, 0.45, 0.4]} rad={0.12 * spark} c={CORAL} />}
  </group>
);

type SceneP = {t: number; mode: 'hook' | 'klip' | 'colok' | 'bocor' | 'tanpa' | 'cek'; k?: number};
export const Scene: React.FC<SceneP> = ({t, mode, k = 0}) => {
  if (mode === 'hook') return <Outlet />;
  if (mode === 'klip') return <Outlet glow={r(t, 17.8, 18.4)} ring={r(t, 18.6, 19.2)} />;
  if (mode === 'cek') return <Outlet ring={r(t, 45.2, 46.0)} glow={0} />;
  if (mode === 'colok') {
    const z0 = 2.2 - 1.71 * r(t, 23.0, 26.6, Easing.inOut(Easing.cubic));   // pin tiba di pelat saat z0 = 0.49
    const glow = z0 < 0.95 ? 1 : 0;
    return <group><Outlet glow={glow} /><Plug z0={z0} glow={glow} /></group>;
  }
  if (mode === 'tanpa') {
    const z0 = 2.2 - 1.71 * r(t, 38.0, 41.0, Easing.inOut(Easing.cubic));
    return <group><Outlet clips={false} /><Plug z0={z0} glow={0} /></group>;
  }
  // bocor: setrika di kiri, stop kontak + steker di kanan; arus bocor (koral) lari lewat jalur ground hijau: badan setrika -> klip -> tanah
  const s = r(t, 29.2, 34.0, Easing.linear);
  const pts: V3[] = [[-0.55, 0.0, 0.5], [0.68, -0.2, 0.5], [0.68, -1.1, 0.0], [0.68, -1.9, 0.0]];
  const seg = Math.min(2.999, s * 3), i = Math.floor(seg), f = seg - i;
  const cur = lerp3(pts[i], pts[i + 1], f);
  return (
    <group>
      <group position={[1.15, -0.1, 0]}><Outlet glow={1} /><Plug z0={0.49} glow={1} /></group>
      <Iron p={[-0.95, -0.35, 0.4]} spark={r(t, 29.0, 29.6)} />
      {[0, 1, 2].map((q) => { const a = pts[q], b = pts[q + 1], m = lerp3(a, b, 0.5); const d = new THREE.Vector3(...b).sub(new THREE.Vector3(...a)); const len = d.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); const eu = new THREE.Euler().setFromQuaternion(quat);
        return <Cy key={q} p={m} rad={0.05} h={len} c={GOOD} rot={[eu.x, eu.y, eu.z]} edge={false} />; })}
      <Bx p={[0, -2.2, 0.2]} s={[3.8, 0.5, 1.6]} c="#a07850" />
      {s > 0 && s < 1 && <Sp p={cur} rad={0.13} c={CORAL} />}
    </group>
  );
};

const Rig: React.FC<{k: Key}> = ({k}) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  cam.position.set(...k.pos); cam.fov = FOV; cam.updateProjectionMatrix(); cam.lookAt(...k.look);
  return null;
};
const Lights: React.FC = () => (<><Env /><ambientLight intensity={0.4} /><directionalLight position={[-3, 5, 6]} intensity={2.6} /><directionalLight position={[4, 1, 3]} intensity={0.5} color="#fff1d6" /></>);
export const Canvas3D: React.FC<{k: Key; children: React.ReactNode}> = ({k, children}) => (
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

/* panel 2D pemutus pola: sejarah colokan bulat */
const Sejarah: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 2.75, 3.2, Easing.out(Easing.cubic)), o = 1 - r(t, 16.6, 16.9);
  const yr = r(t, 3.4, 4.0, Easing.out(Easing.back(2))), pl = r(t, 8.3, 9.0, Easing.out(Easing.cubic)), st = r(t, 13.2, 13.7, Easing.out(Easing.back(2.2)));
  return (
    <div style={{position: 'absolute', inset: 0, opacity: a * o}}>
      <div style={{position: 'absolute', left: 60, right: 60, top: 700, height: 600, borderRadius: 34, background: '#fff6e2', border: `6px solid ${INK}`, transform: `translateY(${(1 - a) * 40}px)`, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 36, top: 26, fontFamily: 'IBM Plex Mono', fontWeight: 500, fontSize: 40, color: INK}}>EROPA</div>
        <div style={{position: 'absolute', right: 40, top: 20, transform: `scale(${0.6 + 0.4 * yr})`, opacity: yr, fontFamily: 'Inter', fontWeight: 900, fontSize: 96, color: CORAL, letterSpacing: -3}}>±1900</div>
        <svg width="960" height="600" style={{position: 'absolute'}}>
          {[[260, 360], [700, 360]].map(([x, y], i) => (
            <g key={i} opacity={pl} transform={`translate(${x} ${y + (1 - pl) * 40})`}>
              <circle r="110" fill="#2c2c30" stroke={INK} strokeWidth="8" /><circle cx="-38" r="20" fill="#b4b9c0" /><circle cx="38" r="20" fill="#b4b9c0" />
            </g>))}
          <text x="480" y="372" textAnchor="middle" fontFamily="Inter" fontWeight="900" fontSize="64" fill={INK} opacity={pl}>=</text>
        </svg>
        <div style={{position: 'absolute', left: 60, bottom: 30, fontFamily: 'Inter', fontWeight: 800, fontSize: 42, color: INK, opacity: pl}}>pabrik sepakat satu bentuk</div>
        <div style={{position: 'absolute', right: 40, bottom: 28, transform: `rotate(-6deg) scale(${0.6 + 0.4 * st})`, opacity: st, padding: '8px 22px', border: `8px solid ${COOL}`, borderRadius: 18, color: COOL, background: 'rgba(250,249,246,0.92)', fontFamily: 'Inter', fontWeight: 900, fontSize: 44, whiteSpace: 'nowrap'}}>BULAT BELUM TERBUKTI LEBIH AMAN</div>
      </div>
    </div>
  );
};

const SFX: [string, number, number][] = [
  ['pop', 0.4, 0.4], ['whoosh', 2.7, 0.3], ['tick', 3.6, 0.35], ['pop', 8.4, 0.4], ['ting', 13.3, 0.4],
  ['whoosh', 16.8, 0.3], ['pop', 18.0, 0.4], ['pop', 18.8, 0.35],
  ['whoosh', 22.7, 0.3], ['tick', 25.0, 0.4], ['thud', 26.7, 0.45],
  ['whoosh', 28.0, 0.3], ['flow', 29.5, 0.25], ['chime', 34.0, 0.4],
  ['whoosh', 37.3, 0.3], ['knock', 40.9, 0.4],
  ['whoosh', 44.3, 0.3], ['pop', 45.6, 0.4], ['pop', 48.2, 0.35],
  ['pop', 50.4, 0.4], ['chime', 52.8, 0.4],
];

export const Video20: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const ch = camAt(CAM_HOOK, t), ck = camAt(CAM_KLIP, t), cc = camAt(CAM_COLOK, t), cb = camAt(CAM_BOCOR, t), cn = camAt(CAM_TANPA, t), cj = camAt(CAM_CEK, t), ce = camAt(CAM_END, t);
  const clipPt = proj(ck, [0.47, 0, 0.14]), clipPt2 = proj(cj, [-0.47, 0, 0.14]);
  const tPt = proj(cn, [0.0, 0.0, 0.5]);

  return (
    <AbsoluteFill>
      <PaperPalet palet="madu" />
      {t >= B.sejarah && t < B.klip && <Ghost lines={['Kebiasaan', 'Lama']} />}

      {/* ---------- 3D ---------- */}
      <Seg a={0} b={B.sejarah} f={f} first><Canvas3D k={ch}><Scene t={t} mode="hook" /></Canvas3D></Seg>
      <Seg a={B.klip} b={B.colok} f={f}><Canvas3D k={ck}><Scene t={t} mode="klip" /></Canvas3D></Seg>
      <Seg a={B.colok} b={B.bocor} f={f}><Canvas3D k={cc}><Scene t={t} mode="colok" /></Canvas3D></Seg>
      <Seg a={B.bocor} b={B.tanpa} f={f}><Canvas3D k={cb}><Scene t={t} mode="bocor" /></Canvas3D></Seg>
      <Seg a={B.tanpa} b={B.cek} f={f}><Canvas3D k={cn}><Scene t={t} mode="tanpa" /></Canvas3D></Seg>
      <Seg a={B.cek} b={B.tanya} f={f}><Canvas3D k={cj}><Scene t={t} mode="cek" /></Canvas3D></Seg>
      <Seg a={B.tanya} b={B.end} f={f}><Canvas3D k={ce}><Scene t={t} mode="hook" /></Canvas3D></Seg>

      <Kicker text="FAKTA RUMAH · #20" y={292} start={0} color={CORAL} />
      <TikTokBox text="Kenapa mirip hidung babi?" p={r(t, 0.15, 0.8, Easing.linear)} y={338} size={40} />
      <Sejarah t={t} />

      {/* ---------- judul ---------- */}
      <Title t={t} a={0.2} b={B.sejarah} small="Stop kontakmu" big="MIRIP HIDUNG BABI?" size={92} />
      <Title t={t} a={B.sejarah} b={B.belum} small="Dua lubang bulat itu" big="KEBIASAAN LAMA" size={96} />
      <Title t={t} a={B.belum} b={B.klip} small="Sumber bilang bulat lebih aman?" big="BELUM ADA" size={140} bigColor={COOL} />
      <Title t={t} a={B.klip} b={B.colok} small="Dua klip logam di tepi" big="PEMBUMIAN" bigColor={GOOD} size={128} />
      <Title t={t} a={B.colok} b={B.bocor} small="Klip menyentuh" big="DULUAN" bigColor={GOOD} size={150} />
      <Title t={t} a={B.bocor} b={B.tanpa} small="Badan alat bocor?" big="LARI KE TANAH" bigColor={GOOD} size={110} />
      <Title t={t} a={B.tanpa} b={B.cek} small="Stop kontak tanpa ground," big="TIDAK BEKERJA" size={96} />
      <Title t={t} a={B.cek} b={B.tanya} small="Cek stop kontakmu," big="ADA KLIPNYA?" size={124} />

      {/* ---------- stiker ---------- */}
      <Chip x={Math.max(240, Math.min(840, clipPt[0] + 140))} y={Math.max(900, Math.min(1260, clipPt[1] + 150))} p={r(t, 18.0, 18.5) * (1 - r(t, 22.2, 22.6))} text="klip ground" color={GOOD} size={48} />
      <Chip x={540} y={1210} p={r(t, 25.1, 25.5) * (1 - r(t, 26.6, 26.9))} text="klip nyentuh dulu" color={GOOD} size={46} />
      <Chip x={540} y={1210} p={r(t, 26.9, 27.3) * (1 - r(t, 28.0, 28.3))} text="baru pin berarus" color={CORAL} size={46} />
      <Chip x={540} y={1210} p={r(t, 30.0, 30.4) * (1 - r(t, 36.8, 37.2))} text="arus bocor ke tanah" color={CORAL} size={46} />
      <Chip x={Math.max(300, Math.min(780, tPt[0]))} y={Math.max(900, Math.min(1260, tPt[1] + 260))} p={r(t, 41.3, 41.7) * (1 - r(t, 44.2, 44.5))} text="nggak ada kontak ground" color={COOL} size={44} />
      <Chip x={Math.max(250, Math.min(900, clipPt2[0] + 130))} y={Math.max(900, Math.min(1250, clipPt2[1] + 180))} p={r(t, 46.2, 46.6) * (1 - r(t, 50.0, 50.3))} text="ada klip logam?" color={GOOD} size={46} />
      <CommentBubble word="ada klipnya?" start={Math.round(50.3 * FPS)} y={600} out={Math.round(54.7 * FPS)} />
      <FollowButton start={Math.round(52.7 * FPS)} click={Math.round(53.8 * FPS)} y={1250} />
      <Captions ms={t * 1000} />
      <Grain o={0.05} id="g20" />

      <Audio src={staticFile('v20/vo.mp3')} />
      <Audio src={staticFile('sfx/ambient.wav')} volume={0.1} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
