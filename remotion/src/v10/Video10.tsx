// Video #10 "Anak Tangga Harus Ganjil?" (Bukan Sial #02). Gaya B diorama kertas versi halus:
// satu kanvas 3D, kamera terbang mulus antar-adegan (tanpa potong kecuali POV), bayangan lembut, lipatan lentur.
// Timing dari timestamp kata VO take 2 (public/v10/words.json). Shot list: naskah/video-10-anak-tangga-ganjil.md
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import * as THREE from 'three';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Grain, PatternBreak, TikTokBox} from '../aset/Aset';
import {K, PaperPlus, Kicker, CommentBubble, FollowButton} from '../aset/Gabung';
import {Stairs, Table, Foot, ChalkRing, S, topY, zMid, KT} from './Tangga';
import words from '../../public/v10/words.json';

export const FPS = 30;
export const V10_END = 46.0;
export const V10_FRAMES = Math.ceil(V10_END * FPS);
const FOV = 34, ASPECT = 1080 / 1920;
const CC_TOP = 1400; // posisi subtitle baku channel, jangan diubah
const INK = KT.ink, CORAL = KT.coral, SAGE = KT.sage;

const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
type V3 = [number, number, number];
type Key = {t: number; pos: V3; look: V3; fov?: number; e?: 'lin' | 'out'};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerp3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
function camAt(keys: Key[], t: number): Key {
  if (t <= keys[0].t) return {...keys[0], t};
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) { const u = (t - a.t) / (b.t - a.t), k = a.e === 'lin' ? u : a.e === 'out' ? 1 - (1 - u) * (1 - u) : ease(u); return {t, pos: lerp3(a.pos, b.pos, k), look: lerp3(a.look, b.look, k), fov: lerp(a.fov ?? FOV, b.fov ?? FOV, k)}; }
  }
  return {...keys[keys.length - 1], t};
}
function proj(cam: Key, p: V3): [number, number] {
  const c = new THREE.PerspectiveCamera(cam.fov ?? FOV, ASPECT, 0.05, 100);
  c.position.set(...cam.pos); c.lookAt(...cam.look); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = new THREE.Vector3(...p).project(c);
  return [(v.x + 1) * 540, (1 - v.y) * 960];
}

// ---------- beat (detik dari timestamp VO) ----------
const B = {hook: 0, bukan: 2.88, hitung: 4.96, kaki: 9.6, hafal: 15.84, pov: 18.88, payoff: 22.24, angka: 27.12, solusi: 33.28, gema: 40.0, follow: 42.52, end: V10_END};

// ---------- POV turun tangga (kamera = mata) ----------
const EYE = 0.85;
const povPose = (j: number, bump = 0): {pos: V3; look: V3} => ({pos: [0, topY(j, bump) + EYE, zMid(j) + 0.05], look: [0, topY(j, bump) - 0.75, zMid(j) + 1.15]});
/* langkah: [waktu mulai, waktu mendarat, dari j, ke j] ; bob = lengkung naik-turun kepala */
function povAt(t: number, steps: [number, number, number, number][], bump: number, fov = 52): Key {
  let pose = povPose(steps[0][2], bump);
  for (const [a, b, j0, j1] of steps) {
    if (t >= b) pose = povPose(j1, bump);
    else if (t > a) { const u = (t - a) / (b - a), k = Easing.inOut(Easing.sin)(u), p0 = povPose(j0, bump), p1 = povPose(j1, bump); pose = {pos: lerp3(p0.pos, p1.pos, k), look: lerp3(p0.look, p1.look, k)}; pose.pos[1] += Math.sin(Math.PI * u) * 0.035; break; }
    else break;
  }
  return {t, pos: pose.pos, look: pose.look, fov};
}
const STEP_SIG: [number, number, number, number][] = [[18.95, 19.4, 6, 5], [19.55, 20.0, 5, 4]]; // langkah ke-2 mendarat di anak tangga beda tinggi
const STEP_GEMA: [number, number, number, number][] = [0, 1, 2, 3, 4, 5].map((i) => [40.15 + i * 0.36, 40.15 + i * 0.36 + 0.3, 6 - i, 5 - i]);

// ---------- kamera per adegan (shot list) ----------
const C0: V3 = [0, 0.6, -1.0];
const CAM_HOOK: Key[] = [{t: 0, pos: [0.3, 5.2, 0.2], look: [0, 0.2, -1.0]}, {t: 4.9, pos: [2.7, 1.9, 2.4], look: [0, 0.6, -1.0]}];
const CAM_HITUNG: Key[] = [{t: 4.96, pos: [2.0, 1.1, 1.3], look: [0, 0.3, -0.2]}, {t: 9.5, pos: [1.9, 2.1, -0.6], look: [0, 1.1, -1.8]}];
const CAM_KAKI: Key[] = [{t: 9.6, pos: [4.2, 2.2, -0.4], look: [0, 0.65, -1.0]}, {t: 15.8, pos: [3.8, 2.5, -0.6], look: [0, 0.75, -1.05]}];
const CAM_HAFAL: Key[] = [{t: 15.84, pos: [2.5, 1.5, 0.5], look: [0, 0.85, -1.26]}, {t: 18.85, pos: [1.35, 1.15, -0.55], look: [0, 0.85, -1.26]}];
const CAM_POV: Key[] = [{t: 18.88, pos: [0, 2.04, -1.77], look: [0, 0.44, -0.67], fov: 52}, {t: 22.2, pos: [0, 1.7, -1.21], look: [0, 0.1, -0.11], fov: 52}];
const CAM_PAY: Key[] = [{t: 22.24, pos: [2.8, 2.1, 2.3], look: [0, 0.6, -1.0]}, {t: 27.1, pos: [3.2, 2.6, 3.0], look: [0, 0.6, -1.0]}];
const CAM_ANGKA: Key[] = [{t: 27.12, pos: [1.6, 0.95, 0.7], look: [0, 0.45, -0.55]}, {t: 33.2, pos: [1.15, 0.8, 0.3], look: [0, 0.45, -0.55]}];
const CAM_SOLUSI: Key[] = [{t: 33.28, pos: [-2.7, 1.7, 1.4], look: [0, 0.6, -1.0]}, {t: 39.95, pos: [-2.9, 2.3, -0.6], look: [0, 0.75, -1.1]}];
const CAM_GEMA: Key[] = [{t: 40.0, pos: [0, 2.04, -1.77], look: [0, 0.44, -0.67], fov: 52}, {t: 42.4, pos: [0, 1.02, -0.09], look: [0, -0.58, 1.01], fov: 52}];
const CAM_END: Key[] = [{t: 42.52, pos: [2.9, 2.2, 2.2], look: [0, 0.6, -1.0]}, {t: 46.0, pos: [2.2, 2.0, 2.9], look: [0, 0.6, -1.0]}];

/* adegan: [mulai, keys, potong keras?] ; tanpa potong = kamera terbang 0,7 dtk dari pose adegan sebelumnya */
const SETS: [number, Key[], boolean][] = [[0, CAM_HOOK, true], [B.hitung, CAM_HITUNG, false], [B.kaki, CAM_KAKI, false], [B.hafal, CAM_HAFAL, false], [B.pov, CAM_POV, true], [B.payoff, CAM_PAY, true], [B.angka, CAM_ANGKA, false], [B.solusi, CAM_SOLUSI, false], [B.gema, CAM_GEMA, true], [B.follow, CAM_END, true]];
const FLY = 0.7;
/* layar tegak = sudut horizontal sempit → kamera adegan lebar dimundurkan (bukan POV) */
const DIST = 1.95;
const far = (k: Key, set: Key[]): Key => set === CAM_POV || set === CAM_GEMA ? k : {...k, pos: [k.look[0] + (k.pos[0] - k.look[0]) * DIST, k.look[1] + (k.pos[1] - k.look[1]) * DIST, k.look[2] + (k.pos[2] - k.look[2]) * DIST]};
const farK = (i: number, k: Key): Key => far(k, SETS[i][1]);
function camFor(t: number, bump: number): Key {
  let s = 0; for (let i = 0; i < SETS.length; i++) if (t >= SETS[i][0]) s = i;
  const pose = (i: number, tt: number) => SETS[i][1] === CAM_POV ? povAt(tt, STEP_SIG, bump) : SETS[i][1] === CAM_GEMA ? povAt(tt, STEP_GEMA, 0) : camAt(SETS[i][1], tt);
  const cur = far(pose(s, t), SETS[s][1]);
  if (s === 0 || SETS[s][2] || t > SETS[s][0] + FLY) return cur;
  const prev = farK(s - 1, pose(s - 1, Math.min(t, SETS[s][0]))), k = Easing.inOut(Easing.cubic)((t - SETS[s][0]) / FLY);
  return {t, pos: lerp3(prev.pos, cur.pos, k), look: lerp3(prev.look, cur.look, k), fov: lerp(prev.fov ?? FOV, cur.fov ?? FOV, k)};
}

// ---------- komponen ----------
const Rig: React.FC<{k: Key}> = ({k}) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  cam.position.set(...k.pos); cam.fov = k.fov ?? FOV; cam.near = 0.03; cam.updateProjectionMatrix(); cam.lookAt(...k.look);
  return null;
};
const Lights: React.FC = () => (
  <>
    <hemisphereLight args={['#fffaf0', '#d8cfbd', 0.9]} />
    <directionalLight position={[2.5, 4.5, 3.0]} intensity={2.2} color="#fff4e6" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-radius={6} shadow-bias={-0.0004} />
    <directionalLight position={[-3, 1.5, 2]} intensity={0.35} color="#ffe2da" />
  </>
);

const Title: React.FC<{t: number; a: number; b: number; small: string; big: string; bigColor?: string; size?: number; top?: number}> = ({t, a, b, small, big, bigColor = CORAL, size = 112, top = 450}) => {
  const i = r(t, a, a + 0.5, Easing.out(Easing.cubic)), o = 1 - r(t, b - 0.35, b);
  if (i * o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 60, top, maxWidth: 960, padding: '20px 30px 24px', borderRadius: 26, background: 'rgba(250,249,246,0.96)', boxShadow: '0 12px 40px rgba(28,28,30,0.18)', fontFamily: 'Inter', color: INK, opacity: i * o, transform: `translateY(${(1 - i) * 22}px) rotate(${(1 - i) * -2}deg)`, transformOrigin: '0% 100%'}}>
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

const Chip: React.FC<{x: number; y: number; p: number; text: string; color?: string; size?: number; fill?: string}> = ({x, y, p, text, color = INK, size = 40, fill = 'rgba(250,249,246,0.97)'}) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.6, 1], [0.6, 1.06, 1]);
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, opacity: Math.min(1, p * 2), padding: '8px 20px', borderRadius: 14, background: fill, border: `4px solid ${color}`, fontFamily: 'Inter', fontWeight: 800, fontSize: size, color: fill === 'rgba(250,249,246,0.97)' ? color : '#fff', whiteSpace: 'nowrap', boxShadow: '0 8px 0 rgba(28,28,30,0.12), 0 14px 26px rgba(28,28,30,0.16)'}}>{text}</div>;
};

const Stamp: React.FC<{p: number; text: string; y?: number}> = ({p, text, y = 760}) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.5, 1], [2.0, 0.95, 1]), o = Math.min(1, p * 2.5);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{transform: `rotate(-8deg) scale(${s})`, padding: '18px 44px', border: `12px solid ${CORAL}`, borderRadius: 24, color: CORAL, background: 'rgba(250,249,246,0.93)', fontFamily: 'Inter', fontWeight: 900, fontSize: 112, letterSpacing: -2, lineHeight: 1, whiteSpace: 'nowrap', boxShadow: '0 16px 40px rgba(0,0,0,0.22)'}}>{text}</div>
    </div>
  );
};

/* kotak jawaban sage menggantikan kotak pertanyaan hitam */
const AnswerBox: React.FC<{p: number; y: number}> = ({p, y}) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.6, 1], [0.7, 1.05, 1]);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 2)}}>
      <span style={{transform: `scale(${s})`, background: SAGE, color: '#fff', padding: '6px 18px', borderRadius: 12, fontFamily: 'Inter', fontWeight: 700, fontSize: 40}}>Jawabannya: tinggi sama ✓</span>
    </div>
  );
};

/* cahaya hangat menyapu (light leak ringan, dipakai di payoff) */
const LightLeak: React.FC<{p: number}> = ({p}) => {
  if (p <= 0 || p >= 1) return null;
  const x = interpolate(p, [0, 1], [-30, 130]), o = Math.sin(Math.PI * p) * 0.55;
  return <AbsoluteFill style={{background: `radial-gradient(60% 45% at ${x}% 30%, rgba(255,196,120,${o}) 0%, rgba(255,140,90,${o * 0.4}) 40%, rgba(255,140,90,0) 75%)`, mixBlendMode: 'screen'}} />;
};

const SFX: [string, number, number][] = [
  ['whoosh', 0.15, 0.3], ['pop', 0.6, 0.3], ['pop', 0.85, 0.3], ['pop', 1.1, 0.3], ['pop', 1.35, 0.3], ['knock', 2.95, 0.8],
  ['whoosh', 4.96, 0.25], ['tick', 5.6, 0.35], ['tick', 6.05, 0.35], ['tick', 6.5, 0.35], ['tick', 6.95, 0.35], ['tick', 7.4, 0.35], ['tick', 7.85, 0.35], ['ting', 8.8, 0.45],
  ['whoosh', 9.6, 0.25], ['knock', 10.5, 0.3], ['knock', 10.9, 0.3], ['knock', 11.3, 0.3], ['knock', 11.7, 0.3], ['knock', 12.1, 0.3], ['knock', 12.5, 0.3], ['knock', 12.9, 0.3], ['chime', 14.2, 0.3],
  ['whoosh', 15.84, 0.25], ['riser', 16.9, 0.3], ['pop', 17.6, 0.4],
  ['whoosh', 18.88, 0.25], ['knock', 19.4, 0.45], ['thud', 20.0, 0.9],
  ['crackle', 22.24, 0.4], ['chime', 25.0, 0.45],
  ['whoosh', 27.12, 0.25], ['tick', 28.3, 0.4], ['tick', 30.7, 0.4],
  ['whoosh', 33.28, 0.25], ['pop', 35.3, 0.35], ['pop', 35.6, 0.35], ['pop', 35.9, 0.35], ['pop', 36.2, 0.35], ['pop', 36.5, 0.35], ['pop', 36.8, 0.35], ['pop', 37.1, 0.35], ['ting', 38.5, 0.45],
  ['whoosh', 40.0, 0.25], ['knock', 40.45, 0.3], ['knock', 40.81, 0.3], ['knock', 41.17, 0.3], ['knock', 41.53, 0.3], ['knock', 41.89, 0.3], ['knock', 42.25, 0.3], ['chime', 42.3, 0.4],
  ['pop', 40.3, 0.4], ['pop', 42.6, 0.4], ['chime', 43.9, 0.4],
];

export const Video10: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  // tinggi beda di anak tangga ke-5: naik saat "menghafal", hilang di payoff
  const bump = r(t, 16.8, 17.6, Easing.bezier(0.34, 1.28, 0.64, 1)) * (1 - r(t, 25.0, 25.9));
  const cam0 = camFor(t, bump);
  // sentakan saat kesandung (20,0 dtk): kepala tersentak & miring sebentar
  const dj = t - 20.0, jolt = dj > 0 && t < B.payoff ? Math.exp(-dj * 3.2) : 0;
  const cam: Key = jolt > 0 ? {...cam0, pos: [cam0.pos[0] + 0.03 * jolt * Math.sin(dj * 40), cam0.pos[1] - 0.06 * jolt, cam0.pos[2]], look: [cam0.look[0] + 0.12 * jolt, cam0.look[1] - 0.25 * jolt, cam0.look[2]]} : cam0;

  const fold = r(t, 0.2, 1.9, Easing.linear);
  const sage = r(t, 25.2, 26.2);
  const pb = r(t, 22.24, 22.9) * (1 - r(t, 24.7, 25.05));
  const checks = Array.from({length: S.n}, (_, i) => r(t, 35.3 + i * 0.3, 35.6 + i * 0.3));

  // overlay posisi dari proyeksi 3D
  const numPt = Array.from({length: S.n}, (_, i) => proj(cam, [0.36, topY(i, bump) + 0.05, zMid(i)]));
  const bumpPt = proj(cam, [0, topY(4, bump), zMid(4)]);
  const riserPt = proj(cam, [0.52, topY(1) - S.h / 2, zMid(2) + S.t / 2]), treadPt = proj(cam, [0, topY(1) + 0.02, zMid(1)]);
  const topPt = proj(cam, [0, topY(6) + 0.04, zMid(6)]);
  // jejak kaki (adegan kaki): bergantian kanan-kiri, kanan pertama & terakhir koral
  const footT = (i: number) => 10.45 + i * 0.4;
  const inPov = (t >= B.pov && t < B.payoff) || (t >= B.gema && t < B.follow);

  return (
    <AbsoluteFill>
      <PaperPlus />
      <ThreeCanvas width={1080} height={1920} shadows camera={{position: cam.pos, fov: cam.fov ?? FOV}} gl={{alpha: true, antialias: true}}>
        <Lights /><Rig k={cam} />
        <fog attach="fog" args={['#efece4', 9, 22]} />
        <Table />
        <Stairs fold={fold} bump={bump} sage={sage} hi={t >= 19.5 && t < 25.0 ? [4] : []} />
        {t >= 10.3 && t < 15.9 && Array.from({length: S.n}, (_, i) => <Foot key={i} i={i} side={i % 2 ? -1 : 1} p={r(t, footT(i), footT(i) + 0.3)} coral={i === 0 || i === S.n - 1} />)}
        <ChalkRing p={[0, topY(4, bump) + 0.02, zMid(4)]} r={0.3} k={r(t, 17.0, 17.7, Easing.linear) * (1 - r(t, 18.7, 18.9))} />
        {checks.map((c, i) => c > 0 && t < B.gema && <ChalkRing key={i} p={[0, topY(i) + 0.02, zMid(i)]} r={0.1} k={c} />)}
        <ChalkRing p={[0, topY(6) + 0.02, zMid(6)]} r={0.28} k={r(t, 37.9, 38.6, Easing.linear) * (1 - r(t, 39.7, 39.95))} />
      </ThreeCanvas>

      {/* jangkar atas: pertanyaan → jawaban */}
      <Kicker text="BUKAN SIAL · #02" y={292} start={0} />
      <TikTokBox text="Harus ganjil?" p={r(t, 0.15, 0.8, Easing.linear) * (1 - r(t, 25.0, 25.2, Easing.linear))} y={338} size={40} />
      <AnswerBox p={r(t, 25.1, 25.6)} y={338} />

      {/* ---------- hook ---------- */}
      <Stamp p={r(t, 2.9, 3.25, Easing.out(Easing.cubic)) * (1 - r(t, 4.5, 4.9))} text="BUKAN ITU" y={1060} />
      <Title t={t} a={0.05} b={2.85} small="Anak tangga" big="HARUS GANJIL?" size={112} />

      {/* ---------- hitungan ---------- */}
      <Title t={t} a={B.hitung} b={B.kaki} small="Dihitung satu-satu," big="BERHENTI DI BAIK" size={88} />
      {t >= 5.4 && t < 9.7 && numPt.map(([x, y], i) => <Chip key={i} x={x} y={y - 40} p={r(t, 5.55 + i * 0.45, 5.85 + i * 0.45) * (1 - r(t, 9.35, 9.65))} text={String(i + 1)} size={40} color={i === 6 && t > 8.8 ? SAGE : INK} fill={i === 6 && t > 8.8 ? SAGE : 'rgba(250,249,246,0.97)'} />)}

      {/* ---------- kaki ---------- */}
      <Title t={t} a={B.kaki} b={B.hafal} small="Ganjil: kaki mulai" big="& SELESAI SAMA" size={104} />
      <Chip x={540} y={1250} p={r(t, 13.9, 14.3) * (1 - r(t, 15.5, 15.8))} text="langkahnya terasa pas" size={44} color={SAGE} />

      {/* ---------- kaki menghafal + beda tinggi ---------- */}
      <Title t={t} a={B.hafal} b={B.pov} small="Kaki kita" big="SUDAH HAFAL" size={120} />
      <Chip x={bumpPt[0] + 150} y={bumpPt[1] - 120} p={r(t, 17.5, 17.9) * (1 - r(t, 18.6, 18.88))} text="+1 cm" size={52} color={CORAL} />
      <Title t={t} a={B.pov} b={B.payoff} small="Beda 1 cm saja," big="KESANDUNG" size={130} />
      {inPov && t < B.payoff && <AbsoluteFill style={{background: 'radial-gradient(75% 60% at 50% 45%, rgba(0,0,0,0) 55%, rgba(28,28,30,0.35) 100%)'}} />}
      <Chip x={540} y={1180} p={r(t, 21.2, 21.45, Easing.linear) * (1 - r(t, 21.9, 22.2))} text="TUK!" size={80} color={CORAL} />

      {/* ---------- payoff ---------- */}
      {pb > 0 && <AbsoluteFill style={{opacity: 1 - r(t, 24.7, 25.05)}}><PatternBreak lines={['BUKAN', 'GANJILNYA,', 'TINGGINYA SAMA']} p={r(t, 22.24, 23.2)} /></AbsoluteFill>}
      <Title t={t} a={25.0} b={B.angka} small="Yang bikin aman:" big="TINGGI SAMA" bigColor={SAGE} size={124} />
      <LightLeak p={r(t, 24.9, 26.9, Easing.linear)} />

      {/* ---------- angka ---------- */}
      <Title t={t} a={B.angka} b={30.6} small="Tinggi anak tangga" big="15–18 CM" size={150} />
      <Title t={t} a={30.6} b={B.solusi} small="Pijakan" big="25–30 CM" bigColor={SAGE} size={150} />
      <Chip x={riserPt[0] + 70} y={riserPt[1]} p={r(t, 28.3, 28.7) * (1 - r(t, 33.0, 33.28))} text="↕ 15–18" size={44} color={CORAL} />
      <Chip x={treadPt[0]} y={treadPt[1] - 70} p={r(t, 30.7, 31.1) * (1 - r(t, 33.0, 33.28))} text="↔ 25–30" size={44} color={SAGE} />
      <Chip x={540} y={1250} p={r(t, 28.0, 28.4) * (1 - r(t, 32.9, 33.2))} text="(patokan umum, perkiraan)" size={34} />

      {/* ---------- solusi ---------- */}
      <Title t={t} a={B.solusi} b={37.84} small="Sebelum dicor," big="UKUR SEMUA" bigColor={SAGE} size={130} />
      <Title t={t} a={37.84} b={B.gema} small="Cek juga" big="PALING ATAS" size={130} />
      <Chip x={topPt[0]} y={topPt[1] - 80} p={r(t, 38.2, 38.6) * (1 - r(t, 39.7, 40.0))} text="ukur ✓" size={44} color={SAGE} />

      {/* ---------- CTA ---------- */}
      <CommentBubble word="ganjil/genap?" start={Math.round(40.3 * FPS)} y={520} out={Math.round(42.4 * FPS)} />
      <FollowButton start={Math.round(42.6 * FPS)} click={Math.round(43.9 * FPS)} y={1180} />
      <Captions ms={t * 1000} />
      <Grain o={0.06} id="g10" />

      <Audio src={staticFile('v10/vo.mp3')} />
      <Audio src={staticFile('v10/sfx/ambient.wav')} volume={0.08} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`v10/sfx/${n}.wav`)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
