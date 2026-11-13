// Video #11 "10 Tahun Nyicil, Rumahmu Baru Separuh Lunas" (Hitung Rumah #01). Gaya #10: satu kanvas 3D, kamera terbang mulus.
// Timing dari timestamp kata VO take 1 (public/v11/words.json). Shot list: naskah/video-11-kpr-separuh-lunas.md
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import * as THREE from 'three';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Grain, PatternBreak, TikTokBox} from '../aset/Aset';
import {PaperPlus, Kicker, CommentBubble, FollowButton} from '../aset/Gabung';
import {Table} from '../v10/Tangga';
import {House, Bills, Folders, Block, Bank, Envelope, Calendar, bankDoor, bricksAt, houseH, BT as CT, KT, BLUE} from './Kpr';
import words from '../../public/v11/words.json';

export const FPS = 30;
export const V11_END = 74.2;
export const V11_FRAMES = Math.ceil(V11_END * FPS);
const FOV = 34, ASPECT = 1080 / 1920;
const CC_TOP = 1400; // posisi subtitle baku channel, jangan diubah
const INK = KT.ink, CORAL = KT.coral, SAGE = KT.sage;

const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
type V3 = [number, number, number];
type Key = {t: number; pos: V3; look: V3; fov?: number};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerp3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
function camAt(keys: Key[], t: number): Key {
  if (t <= keys[0].t) return {...keys[0], t};
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) { const k = ease((t - a.t) / (b.t - a.t)); return {t, pos: lerp3(a.pos, b.pos, k), look: lerp3(a.look, b.look, k), fov: lerp(a.fov ?? FOV, b.fov ?? FOV, k)}; }
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
const B = {hook: 0, janji: 4.0, contoh: 7.12, split: 15.52, kenapa: 22.72, twist: 30.0, turun: 39.6, angka: 41.92, payoff: 48.72, aksi: 53.68, tanya: 67.52, follow: 70.8, end: V11_END};

// posisi objek
const HC: V3 = [0, 0.75, -1.0];          // tengah rumah
const CP: V3 = [1.25, 0, -0.2];         // dasar tumpukan uang
const TP: V3 = [-1.3, 0, 0.05];       // dasar tumpukan map kontrak
const BANK: V3 = [-2.0, 0, -2.6], ENV: V3 = [1.3, 0, 0.35], CAL: V3 = [0.62, 0, -0.1];
const DOOR: V3 = [BANK[0], 0.55, BANK[2] + 0.5];

// ---------- kamera per adegan (shot list) ----------
const CAM_HOOK: Key[] = [{t: 0.0, pos: [2.0, 2.6, 7.6], look: [-0.1, 1.05, -1.3]}, {t: 4.0, pos: [1.4, 2.0, 5.8], look: [-0.1, 0.95, -1.2]}];
const CAM_JANJI: Key[] = [{t: 4.0, pos: [-2.8, 2.3, 5.2], look: [-0.3, 1.0, -1.4]}, {t: 7.05, pos: [3.0, 2.3, 5.2], look: [0, 1.0, -1.3]}];
const CAM_CONTOH: Key[] = [{t: 7.12, pos: [0.6, 5.2, 6.4], look: [0.3, 0.8, -1.0]}, {t: 12.6, pos: [1.3, 2.2, 6.6], look: [0.6, 0.8, -0.6]}, {t: 15.45, pos: [2.2, 1.4, 3.6], look: [1.2, 0.5, -0.1]}];
const CAM_SPLIT: Key[] = [{t: 15.52, pos: [2.3, 1.2, 2.6], look: [1.25, 0.45, -0.2]}, {t: 17.4, pos: [2.2, 1.25, 2.8], look: [1.2, 0.45, -0.2]}, {t: 18.3, pos: [-0.6, 2.3, 2.8], look: [-2.0, 1.25, -2.4]}, {t: 19.7, pos: [-0.75, 2.2, 2.5], look: [-2.0, 1.2, -2.4]}, {t: 20.5, pos: [1.6, 2.3, 5.6], look: [-0.2, 0.6, -1.0]}, {t: 22.65, pos: [1.4, 2.2, 5.2], look: [-0.2, 0.6, -1.0]}];
const CAM_KENAPA: Key[] = [{t: 22.72, pos: [-0.2, 1.9, 4.9], look: [-1.25, 0.7, -0.1]}, {t: 29.95, pos: [0.1, 2.5, 6.8], look: [-0.9, 0.85, -0.5]}];
const CAM_TWIST: Key[] = [{t: 30.0, pos: [2.9, 1.7, 4.8], look: [1.2, 0.8, -0.2]}, {t: 37.0, pos: [2.4, 1.6, 3.8], look: [1.2, 0.75, -0.2]}, {t: 39.5, pos: [2.3, 1.55, 3.6], look: [1.2, 0.72, -0.2]}, {t: 40.3, pos: [-0.6, 2.3, 2.8], look: [-2.0, 1.25, -2.4]}, {t: 41.85, pos: [-0.75, 2.2, 2.5], look: [-2.0, 1.2, -2.4]}];
const CAM_ANGKA: Key[] = [{t: 41.92, pos: [0.4, 0.8, 4.4], look: [0, 0.75, -1.0]}, {t: 48.65, pos: [0.7, 3.4, 6.3], look: [0, 0.95, -1.0]}];
const CAM_PAY: Key[] = [{t: 48.72, pos: [1.4, 1.9, 5.2], look: [0.2, 0.9, -1.0]}, {t: 53.6, pos: [2.2, 2.5, 7.6], look: [0.3, 0.95, -1.0]}];
const CAM_AKSI: Key[] = [{t: 53.68, pos: [-3.0, 2.2, 6.6], look: [-0.35, 1.3, -1.0]}, {t: 58.0, pos: [-2.3, 2.0, 6.0], look: [-0.3, 1.2, -1.0]}, {t: 67.45, pos: [-0.9, 1.9, 5.4], look: [0, 0.95, -1.0]}];
const CAM_TANYA: Key[] = [{t: 67.52, pos: [2.6, 2.1, 6.2], look: [0.2, 0.95, -1.0]}, {t: 70.75, pos: [1.6, 2.2, 6.8], look: [0.2, 0.95, -1.0]}];
const CAM_END: Key[] = [{t: 70.8, pos: [1.6, 2.2, 6.8], look: [0.2, 0.95, -1.0]}, {t: 74.2, pos: [0.4, 2.4, 7.4], look: [0.1, 1.0, -1.0]}];

/* adegan: [mulai, keys, potong keras?] ; tanpa potong = kamera terbang 0,7 dtk dari pose adegan sebelumnya */
const SETS: [number, Key[], boolean][] = [[0, CAM_HOOK, true], [B.janji, CAM_JANJI, false], [B.contoh, CAM_CONTOH, false], [B.split, CAM_SPLIT, false], [B.kenapa, CAM_KENAPA, false], [B.twist, CAM_TWIST, true], [B.angka, CAM_ANGKA, false], [B.payoff, CAM_PAY, true], [B.aksi, CAM_AKSI, false], [B.tanya, CAM_TANYA, false], [B.follow, CAM_END, false]];
const FLY = 0.7;
function camFor(t: number): Key {
  let s = 0; for (let i = 0; i < SETS.length; i++) if (t >= SETS[i][0]) s = i;
  const cur = camAt(SETS[s][1], t);
  if (s === 0 || SETS[s][2] || t > SETS[s][0] + FLY) return cur;
  const prev = camAt(SETS[s - 1][1], SETS[s][0]), k = ease((t - SETS[s][0]) / FLY);
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
    <directionalLight position={[2.5, 4.5, 3.0]} intensity={2.2} color="#fff4e6" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-radius={6} shadow-bias={-0.0004} />
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

const Chip: React.FC<{x: number; y: number; p: number; text: string; color?: string; size?: number; solid?: boolean}> = ({x, y, p, text, color = INK, size = 40, solid}) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.6, 1], [0.6, 1.06, 1]);
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, opacity: Math.min(1, p * 2), padding: '8px 20px', borderRadius: 14, background: solid ? color : 'rgba(250,249,246,0.97)', border: `4px solid ${color}`, fontFamily: 'Inter', fontWeight: 800, fontSize: size, color: solid ? '#fff' : color, whiteSpace: 'nowrap', boxShadow: '0 8px 0 rgba(28,28,30,0.12), 0 14px 26px rgba(28,28,30,0.16)'}}>{text}</div>;
};

const AnswerBox: React.FC<{p: number; y: number; text: string}> = ({p, y, text}) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.6, 1], [0.7, 1.05, 1]);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 2)}}>
      <span style={{transform: `scale(${s})`, background: SAGE, color: '#fff', padding: '6px 18px', borderRadius: 12, fontFamily: 'Inter', fontWeight: 700, fontSize: 40}}>{text}</span>
    </div>
  );
};

const LightLeak: React.FC<{p: number}> = ({p}) => {
  if (p <= 0 || p >= 1) return null;
  const x = interpolate(p, [0, 1], [-30, 130]), o = Math.sin(Math.PI * p) * 0.55;
  return <AbsoluteFill style={{background: `radial-gradient(60% 45% at ${x}% 30%, rgba(255,196,120,${o}) 0%, rgba(255,140,90,${o * 0.4}) 40%, rgba(255,140,90,0) 75%)`, mixBlendMode: 'screen'}} />;
};

const SFX: [string, number, number][] = [
  ['pop', 0.2, 0.3], ['chime', 2.75, 0.35], ['tick', 3.4, 0.35],
  ['whoosh', 4.24, 0.25], ['tick', 5.95, 0.3], ['tick', 6.15, 0.3], ['tick', 6.35, 0.3], ['tick', 6.55, 0.3], ['tick', 6.75, 0.3],
  ['whoosh', 7.12, 0.25], ['pop', 7.9, 0.3], ['pop', 9.5, 0.3], ['tick', 12.9, 0.3], ['tick', 13.4, 0.3], ['tick', 13.9, 0.3], ['ting', 14.6, 0.4],
  ['whoosh', 15.52, 0.25], ['knock', 16.7, 0.35], ['pop', 19.75, 0.35], ['whoosh', 20.55, 0.25], ['pop', 21.45, 0.45],
  ['whoosh', 22.72, 0.25], ['thud', 23.0, 0.5], ['tick', 26.6, 0.3], ['tick', 27.4, 0.3], ['tick', 28.2, 0.3], ['tick', 29.0, 0.3],
  ['whoosh', 30.0, 0.3], ['ting', 32.5, 0.35], ['riser', 34.4, 0.3], ['crackle', 37.05, 0.45], ['knock', 39.65, 0.35],
  ['whoosh', 41.92, 0.25], ['tick', 42.5, 0.25], ['tick', 43.1, 0.25], ['tick', 43.7, 0.25], ['tick', 44.3, 0.25], ['chime', 45.0, 0.4], ['thud', 45.8, 0.5],
  ['whoosh', 48.72, 0.3], ['chime', 49.4, 0.45],
  ['whoosh', 53.68, 0.25], ['tick', 54.1, 0.25], ['tick', 54.4, 0.25], ['pop', 55.15, 0.4], ['thud', 57.0, 0.7], ['pop', 57.4, 0.3], ['ting', 60.55, 0.45], ['knock', 63.25, 0.35], ['pop', 65.25, 0.35],
  ['whoosh', 67.52, 0.25], ['pop', 67.7, 0.35], ['chime', 70.4, 0.4],
  ['pop', 70.87, 0.4], ['chime', 71.9, 0.4],
];

/* tahun di kalender */
function yearText(t: number): string {
  if (t < B.contoh) return 'TAHUN 10';
  if (t < B.twist) return t < 12.08 ? 'TAHUN 1' : 'TAHUN 1–3 · PROMO';
  if (t < B.angka) return 'TAHUN 4';
  if (t < B.aksi) return `TAHUN ${Math.max(1, Math.round(interpolate(t, [42.3, 45.2], [1, 10], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})))}`;
  if (t < B.tanya) return t < 54.9 ? 'TAHUN 4' : 'TAHUN 4';
  return t < 70.6 ? 'NYICIL TERUS…' : 'LUNAS ✓';
}

export const Video11: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const cam = camFor(t);

  // ---- isi rumah (jumlah bata koral) ----
  let fill = 90;
  if (t >= 5.9 && t < 7.0) fill = 90 * (1 - r(t, 5.9, 6.9));
  else if (t >= 7.0 && t < B.angka) fill = r(t, 21.3, 21.75, Easing.out(Easing.cubic)) * 1.0;
  else if (t >= B.angka && t < B.aksi) fill = bricksAt(interpolate(t, [42.3, 45.2], [1, 118], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)}));
  else if (t >= B.aksi && t < B.tanya) fill = lerp(90, bricksAt(36), r(t, 53.9, 54.7)) + 9 * r(t, 57.25, 57.9, Easing.out(Easing.cubic));
  else if (t >= B.tanya) fill = lerp(bricksAt(36) + 9, 180, r(t, 67.8, 70.5, Easing.inOut(Easing.sin)));
  const build = t < 7.0 ? 1 : 1;

  // ---- koin cicilan ----
  let gray = 12, coral = 17;
  const twistGrow = r(t, 34.4, 36.2);
  if (t >= 26.24 && t < 29.7) { const k = r(t, 26.24, 29.4); gray = Math.round(lerp(12, 6, k)); coral = 29 - gray; }
  if (t >= B.twist) { gray = Math.round(lerp(12, 31, twistGrow)); coral = Math.round(lerp(17, 11, twistGrow)); }
  const appear = t < 12.8 ? 0 : r(t, 12.8, 14.6, Easing.linear);
  const fly = t >= 20.5 && t < 22.72 ? r(t, 20.5, 21.4, Easing.linear) : 0;
  const coinTo: V3 = [-0.77, 0.05, -0.95];
  const sp = Easing.bezier(0.34, 1.28, 0.64, 1);
  const calS = 0.85 * (r(t, 0, 0.3, sp) * (1 - r(t, 4.0, 4.3)) + r(t, 67.6, 68.0, sp));
  const flyGray = t >= 17.9 && t < 22.72 ? r(t, 17.9, 19.5, Easing.linear) : t >= 39.7 && t < B.angka ? r(t, 39.7, 41.2, Easing.linear) : 0;

  // ---- menara utang & balok ----
  const towerS = r(t, 22.85, 23.5, Easing.bezier(0.34, 1.28, 0.64, 1)) * (1 - r(t, 29.7, 30.0));
  const towerH = lerp(1.15, 0.58, r(t, 26.24, 29.4));
  const blockS = r(t, 55.1, 55.6, Easing.bezier(0.34, 1.28, 0.64, 1)) * (1 - r(t, 57.15, 57.6));
  const blockY = lerp(1.1, 0.11, r(t, 56.2, 57.0, Easing.in(Easing.quad)));

  // ---- overlay dari proyeksi 3D ----
  const legBank = proj(cam, [-0.5, houseH * 0.8, -0.94]), legMine = proj(cam, [-0.4, houseH * 0.2, -0.94]);
  const grayTop = proj(cam, [CP[0] + 0.2, gray * CT * 0.5, CP[2]]), coralMid = proj(cam, [CP[0] + 0.2, (gray + coral * 0.5) * CT, CP[2]]);
  const stackTop = proj(cam, [CP[0], (gray + coral) * CT + 0.12, CP[2]]);
  const brick1 = proj(cam, [-0.77, 0.25, -0.94]);

  const showYear = calS < 0.05 && ((t >= 7.5 && t < 15.4) || (t >= 30.4 && t < 34.2) || (t >= 42.0 && t < 48.6) || (t >= 54.0 && t < 60.3));
  return (
    <AbsoluteFill>
      <PaperPlus />
      <ThreeCanvas width={1080} height={1920} shadows camera={{position: cam.pos, fov: cam.fov ?? FOV}} gl={{alpha: true, antialias: true}}>
        <Lights /><Rig k={cam} />
        <fog attach="fog" args={['#efece4', 10, 24]} />
        <Table />
        <House fill={fill} build={build} />
        <Bank p={BANK} s={1.15} />
        <Envelope p={ENV} s={r(t, 12.6, 13.0, Easing.bezier(0.34, 1.28, 0.64, 1))} />
        <Calendar s={calS} p={CAL} text={yearText(t)} sub={t < B.contoh ? 'separuh lunas' : undefined} done={t >= 70.6} />
        <Bills p={CP} gray={gray} coral={coral} appear={appear} fly={fly} to={coinTo} flyGray={flyGray} toBank={DOOR} />
        <Folders p={TP} h={towerH} s={towerS} />
        <Block p={[0.1, blockY, -0.45]} s={blockS} />
      </ThreeCanvas>

      {/* jangkar atas */}
      <Kicker text="HITUNG RUMAH · #01" y={292} start={0} />
      <TikTokBox text="Kok lama lunasnya?" p={r(t, 0.23, 1.2, Easing.linear) * (1 - r(t, 49.3, 49.4, Easing.linear))} y={338} size={40} />
      <AnswerBox p={r(t, 49.35, 49.6)} y={338} text="Karena bunga dari sisa utang ✓" />

      {/* kalender */}

      {showYear && <Chip x={800} y={770} p={1} text={yearText(t)} size={38} />}
      {/* ---------- hook ---------- */}
      <Title t={t} a={0.08} b={4.2} small="10 tahun nyicil," big="BARU SEPARUH LUNAS" size={76} />
      <Chip x={legBank[0]} y={legBank[1]} p={r(t, 1.9, 2.3) * (1 - r(t, 5.6, 5.9))} text="abu: punya bank" size={34} color="#8a857a" />
      <Chip x={legMine[0]} y={legMine[1]} p={r(t, 2.7, 3.1) * (1 - r(t, 5.6, 5.9))} text="koral: punyamu" size={34} color={CORAL} />
      <Title t={t} a={B.janji} b={B.contoh} small="Bukan bank curang." big="INI CARA HITUNGNYA" size={82} />

      {/* ---------- contoh ---------- */}
      <Title t={t} a={B.contoh} b={12.7} small="Pinjam 400 juta," big="15 TAHUN" size={140} />
      <Chip x={540} y={1250} p={r(t, 9.5, 9.9) * (1 - r(t, 12.3, 12.7))} text="1 bata = 1 bulan cicilan" size={40} />
      <Title t={t} a={12.8} b={B.split} small="Cicilan promo" big="2,9 JUTA" size={150} />
      <Chip x={stackTop[0]} y={stackTop[1] - 20} p={r(t, 14.2, 14.6) * (1 - r(t, 15.2, 15.5))} text="2,9 jt" size={40} color={CORAL} />

      {/* ---------- ke mana uangnya ---------- */}
      <Title t={t} a={B.split} b={19.6} small="Bayar bunga dulu" big="1,2 JUTA" bigColor={BLUE} size={150} />
      <Chip x={grayTop[0] + 150} y={grayTop[1]} p={r(t, 16.7, 17.1) * (1 - r(t, 17.5, 17.8))} text="← bunga" size={40} color={BLUE} />
      <Title t={t} a={19.68} b={B.kenapa} small="Yang jadi rumah" big="1,7 JUTA" size={150} />
      <Chip x={540} y={1250} p={r(t, 18.3, 18.6) * (1 - r(t, 19.5, 19.7))} text="bunga masuk ke bank" size={40} color={BLUE} />
      <Chip x={540} y={1250} p={r(t, 19.75, 20.1) * (1 - r(t, 22.3, 22.6))} text="sisanya jadi rumah" size={40} color={CORAL} />
      <Chip x={brick1[0]} y={brick1[1] - 70} p={r(t, 21.45, 21.8) * (1 - r(t, 22.4, 22.7))} text="+1 bata" size={40} color={CORAL} />

      {/* ---------- kenapa ---------- */}
      <Title t={t} a={B.kenapa} b={B.twist} small="Bunga dihitung dari" big="SISA UTANG" size={120} />
      <Chip x={540} y={1250} p={r(t, 23.3, 23.7) * (1 - r(t, 27.0, 27.3))} text="map utang: 400 jt" size={40} color={BLUE} />
      <Chip x={540} y={1250} p={r(t, 27.4, 27.8) * (1 - r(t, 29.5, 29.9))} text="utang turun → bunga turun" size={40} color={BLUE} />

      {/* ---------- twist ---------- */}
      <Title t={t} a={B.twist} b={34.3} small="Tahun ke-4, promo habis" big="BUNGA 11%" size={140} />
      <Title t={t} a={34.4} b={37.0} small="Cicilan jadi" big="4,2 JUTA" size={150} />
      <Chip x={stackTop[0]} y={stackTop[1] - 20} p={r(t, 35.6, 36.0) * (1 - r(t, 36.7, 37.0))} text="naik 1,4 jt" size={40} color={BLUE} />
      {t >= 37.0 && t < 39.6 && <AbsoluteFill style={{opacity: 1 - r(t, 39.2, 39.55)}}><PatternBreak lines={['CICILAN NAIK,', 'TAPI RUMAHNYA', 'MALAH TURUN']} p={r(t, 37.04, 37.9)} /></AbsoluteFill>}
      <Title t={t} a={39.6} b={B.angka} small="Yang jadi rumah" big="1,1 JUTA" bigColor={BLUE} size={150} />
      <Chip x={540} y={1250} p={r(t, 39.7, 40.1) * (1 - r(t, 41.5, 41.85))} text="cuma segini yang jadi rumah" size={40} color={CORAL} />

      {/* ---------- angka besar ---------- */}
      <Title t={t} a={B.angka} b={45.7} small="Separuh lunas di" big="TAHUN KE-10" size={130} />
      <Title t={t} a={45.76} b={B.payoff} small="Total bunga" big="±300 JUTA" bigColor={BLUE} size={150} />
      <Chip x={540} y={1250} p={r(t, 46.0, 46.4) * (1 - r(t, 48.3, 48.65))} text="(simulasi, perkiraan)" size={34} />

      {/* ---------- payoff ---------- */}
      <Title t={t} a={B.payoff} b={B.aksi} small="Yang mahal bukan cicilannya," big="TAPI LAMANYA" bigColor={SAGE} size={120} />
      <LightLeak p={r(t, 49.2, 50.3, Easing.linear)} />

      {/* ---------- aksi ---------- */}
      <Title t={t} a={B.aksi} b={57.8} small="Punya uang lebih?" big="+20 JUTA" size={150} />
      <Chip x={540} y={1250} p={r(t, 55.2, 55.6) * (1 - r(t, 56.9, 57.2))} text="setor pas promo habis" size={38} color={CORAL} />
      <Title t={t} a={57.84} b={60.4} small="Cicilan tetap," big="WAKTU DIPOTONG" bigColor={SAGE} size={100} />
      <Chip x={540} y={1250} p={r(t, 58.3, 58.7) * (1 - r(t, 62.6, 62.95))} text="lunas ±16 bulan lebih cepat" size={38} color={SAGE} />
      <Title t={t} a={60.48} b={63.15} small="Hemat bunga" big="±49 JUTA" bigColor={SAGE} size={150} />
      <Title t={t} a={63.2} b={B.tanya} small="Sebelum setor," big="TANYA DENDANYA" size={100} />
      <Chip x={540} y={1250} p={r(t, 65.25, 65.6) * (1 - r(t, 67.1, 67.45))} text="yang mau akad: hitung dulu 🔖" size={38} color={CORAL} />

      {/* ---------- CTA ---------- */}
      <Title t={t} a={B.tanya} b={70.7} small="Cicilanmu masih" big="PROMO / NAIK?" size={110} />
      <CommentBubble word="promo / naik?" start={Math.round(67.7 * FPS)} y={1000} out={Math.round(70.6 * FPS)} />
      <FollowButton start={Math.round(70.87 * FPS)} click={Math.round(71.9 * FPS)} y={1080} />
      <Captions ms={t * 1000} />
      <Grain o={0.06} id="g11" />

      <Audio src={staticFile('v11/vo.mp3')} />
      <Audio src={staticFile('sfx/ambient.wav')} volume={0.08} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
