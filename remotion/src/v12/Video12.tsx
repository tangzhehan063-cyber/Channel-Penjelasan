// Video #12 "Ngontrak Sejuta vs Nyicil Sejuta" (Hitung Rumah #02). Gaya VS video #7 (timbangan, layar dua kubu koral)
// di satu kanvas 3D + kamera terbang (#10–#11). Timing dari public/v12/words.json. Shot list: naskah/video-12-ngontrak-vs-nyicil.md
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import * as THREE from 'three';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Grain, PatternBreak, TikTokBox} from '../aset/Aset';
import {PaperPlus, Kicker, CommentBubble, FollowButton, Ornament} from '../aset/Gabung';
import {Table, KT} from '../v10/Tangga';
import {Bills, Calendar, BLUE} from '../v11/Kpr';
import {MiniHouse, Key as KeyObj, Scale, Road, Office, Motor, Coin, PH} from './Timbang';
import words from '../../public/v12/words.json';

export const FPS = 30;
export const V12_END = 85.2;
export const V12_FRAMES = Math.ceil(V12_END * FPS);
const FOV = 34, ASPECT = 1080 / 1920;
const CC_TOP = 1400; // posisi subtitle baku channel, jangan diubah
const INK = KT.ink, CORAL = KT.coral, SAGE = KT.sage;

const ease = Easing.inOut(Easing.cubic);
const sp = Easing.bezier(0.34, 1.28, 0.64, 1);
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
const B = {hook: 0, subsidi: 1.76, beda: 4.96, janji: 7.92, nyicil: 12.4, sewa: 25.92, twist: 31.44, angka: 41.04, tunggu: 53.04, payoff: 66.32, aksi: 72.08, tanya: 79.84, follow: 82.28, end: V12_END};

// posisi objek
const HX = 0.95;                                   // rumah di atas papan, x = ±HX
const SS: V3 = [-HX, 0, 0.95], SN: V3 = [HX, 0, 0.95]; // dasar tumpukan sewa / nyicil
const CAL: V3 = [0, 0, 1.05];
const ROAD_X = 1.75, ROAD_Z = 0.25, OFF: V3 = [8.6, 0, -0.2];
const STK = 0.7; // skala tinggi tumpukan (1 ikat = 25 rb)

// ---------- kamera (shot list) ----------
const WIDE: V3 = [0, 1.8, 8.6], WLOOK: V3 = [0, 0.7, 0.3];
const CAM_HOOK: Key[] = [{t: 0, pos: [0.4, 1.7, 9.8], look: [0, 0.75, 0.2]}, {t: 7.9, pos: [0.2, 1.5, 7.9], look: [0, 0.75, 0.2]}];
const CAM_JANJI: Key[] = [{t: 7.92, pos: [-3.6, 1.9, 7.0], look: [0, 0.7, 0]}, {t: 12.35, pos: [3.6, 1.9, 7.0], look: [0, 0.7, 0]}];
const CAM_NYICIL: Key[] = [{t: 12.4, pos: [2.8, 3.6, 5.4], look: [0.95, 0.8, 0]}, {t: 21.3, pos: [2.2, 1.35, 3.7], look: [0.95, 0.75, 0.3]}, {t: 25.85, pos: [2.5, 1.5, 4.4], look: [0.95, 0.6, 0.6]}];
const CAM_SEWA: Key[] = [{t: 25.92, pos: [-2.5, 1.5, 4.4], look: [-0.95, 0.6, 0.6]}, {t: 29.3, pos: [-2.1, 1.4, 4.1], look: [-0.95, 0.6, 0.6]}, {t: 31.4, pos: [0, 1.5, 6.9], look: [0, 0.6, 0.5]}];
const CAM_TWIST: Key[] = [{t: 31.44, pos: [0, 0.5, 7.2], look: [0, 0.6, 0.7]}, {t: 36.2, pos: [0, 0.6, 7.4], look: [0, 0.65, 0.7]}, {t: 41.0, pos: [0, 1.3, 8.6], look: [0, 0.95, 0.6]}];
const CAM_ANGKA: Key[] = [{t: 41.04, pos: [0, 1.5, 8.2], look: [0, 0.8, 0.5]}, {t: 52.95, pos: [0.6, 2.3, 9.4], look: [0, 0.75, 0.3]}];
const CAM_TUNGGU: Key[] = [{t: 53.04, pos: [3.2, 1.3, 3.4], look: [1.4, 0.7, 0]}, {t: 54.2, pos: [3.3, 1.35, 3.4], look: [1.6, 0.6, 0]}, {t: 56.9, pos: [5.4, 2.0, 5.6], look: [8.0, 1.5, 0]}, {t: 60.6, pos: [5.8, 1.9, 5.3], look: [8.0, 1.5, 0]},
  {t: 61.0, pos: [1.2, 0.9, 2.1], look: [2.4, 0.25, 0.25]}, {t: 63.6, pos: [6.9, 0.9, 2.1], look: [8.1, 0.3, 0.25]}, {t: 64.3, pos: [0.4, 1.8, 8.4], look: [0.2, 0.7, 0.3]}, {t: 66.25, pos: [0.3, 1.7, 8.0], look: [0.2, 0.7, 0.3]}];
const CAM_PAY: Key[] = [{t: 66.32, pos: [0, 1.8, 8.6], look: [0, 0.7, 0.3]}, {t: 72.0, pos: [0, 1.5, 7.3], look: [0, 0.7, 0.3]}];
const CAM_AKSI: Key[] = [{t: 72.08, pos: [-1.3, 2.5, 1.3], look: [8.6, 0.4, 0]}, {t: 79.8, pos: [-0.5, 1.9, 0.9], look: [8.6, 0.6, 0]}];
const CAM_END: Key[] = [{t: 79.84, pos: [0, 1.8, 8.6], look: [0, 0.7, 0.3]}, {t: 85.2, pos: [0.3, 2.0, 9.4], look: [0, 0.7, 0.3]}];

/* [mulai, keys, potong keras?] ; tanpa potong = kamera terbang 0,7 dtk dari pose sebelumnya */
const SETS: [number, Key[], boolean][] = [[0, CAM_HOOK, true], [B.janji, CAM_JANJI, false], [B.nyicil, CAM_NYICIL, false], [B.sewa, CAM_SEWA, false], [B.twist, CAM_TWIST, true], [B.angka, CAM_ANGKA, false], [B.tunggu, CAM_TUNGGU, true], [B.payoff, CAM_PAY, true], [B.aksi, CAM_AKSI, false], [B.tanya, CAM_END, false]];
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
    <directionalLight position={[3.0, 4.5, 3.0]} intensity={2.2} color="#fff4e6" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-3} shadow-camera-right={9} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-radius={6} shadow-bias={-0.0004} />
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

// subtitle: angka panjang hasil skrip → "166 juta", "1,08 juta", "80 ribu"
const fmt = (w: string) => w.replace(/^(\d{4,})([.,!?]?)$/, (_, d: string, p: string) => {
  const n = Number(d);
  const s = n >= 1e6 ? `${String(+(n / 1e6).toFixed(2)).replace('.', ',')} juta` : `${n / 1000} ribu`;
  return s + p;
}).replace(/^satu$/, '1').replace(/^lima$/, '5');
const caps: Caption[] = (words as {words: {word: string; start: number; end: number}[]}).words.map((w, i) => ({text: (i ? ' ' : '') + fmt(w.word), startMs: w.start * 1000, endMs: w.end * 1000, timestampMs: w.start * 1000, confidence: 1}));
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
  return <div style={{position: 'absolute', left: Math.max(160, Math.min(920, x)), top: Math.max(720, y), transform: `translate(-50%,-50%) scale(${s})`, opacity: Math.min(1, p * 2), padding: '8px 20px', borderRadius: 14, background: solid ? color : 'rgba(250,249,246,0.97)', border: `4px solid ${color}`, fontFamily: 'Inter', fontWeight: 800, fontSize: size, color: solid ? '#fff' : color, whiteSpace: 'nowrap', boxShadow: '0 8px 0 rgba(28,28,30,0.12), 0 14px 26px rgba(28,28,30,0.16)'}}>{text}</div>;
};

const LightLeak: React.FC<{p: number}> = ({p}) => {
  if (p <= 0 || p >= 1) return null;
  const x = interpolate(p, [0, 1], [-30, 130]), o = Math.sin(Math.PI * p) * 0.55;
  return <AbsoluteFill style={{background: `radial-gradient(60% 45% at ${x}% 30%, rgba(255,196,120,${o}) 0%, rgba(255,140,90,${o * 0.4}) 40%, rgba(255,140,90,0) 75%)`, mixBlendMode: 'screen'}} />;
};

// layar dua kubu (ciri video #7): koral, "TIM NGONTRAK vs TIM NYICIL"
const Camps: React.FC<{t: number; p: number}> = ({t, p}) => {
  const q = (a: number) => r(t, a, a + 0.35, Easing.out(Easing.cubic));
  const camp = (a: number, x: number, label: string) => (
    <div style={{position: 'absolute', left: x, top: 700, width: 400, textAlign: 'center', opacity: q(a), transform: `translateY(${(1 - q(a)) * 40}px)`,
      fontFamily: 'Inter', fontWeight: 900, fontSize: 58, color: '#fff', letterSpacing: -1.5, padding: '26px 0', border: '6px solid #fff', borderRadius: 26, lineHeight: 1.0}}>{label}</div>
  );
  return (
    <AbsoluteFill style={{opacity: p, background: `radial-gradient(110% 80% at 50% 35%, ${CORAL} 0%, #e2563f 100%)`, clipPath: `circle(${ease(Math.min(1, p)) * 150}% at 50% 55%)`}}>
      {camp(8.6, 50, 'TIM NGONTRAK')}{camp(9.0, 630, 'TIM NYICIL')}
      <div style={{position: 'absolute', left: 440, top: 712, width: 200, textAlign: 'center', fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 900, fontSize: 70, color: INK, opacity: q(8.8)}}>vs</div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 960, textAlign: 'center', fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 900, color: INK, fontSize: 100, lineHeight: 1.05, opacity: q(10.6), transform: `scale(${0.85 + 0.15 * q(10.6)})`}}>Kita timbang.</div>
      <Grain o={0.12} id="gpb12" />
    </AbsoluteFill>
  );
};

const SFX: [string, number, number][] = [
  ['whoosh', 0.1, 0.25], ['pop', 0.5, 0.35], ['pop', 1.9, 0.35], ['tick', 5.0, 0.3], ['knock', 6.4, 0.4],
  ['whoosh', 8.0, 0.3], ['pop', 8.6, 0.4], ['pop', 9.0, 0.4], ['chime', 10.7, 0.35],
  ['whoosh', 12.4, 0.25], ['tick', 14.5, 0.3], ['pop', 16.5, 0.35], ['ting', 18.5, 0.35], ['tick', 22.8, 0.25], ['tick', 23.3, 0.25], ['tick', 23.8, 0.25], ['pop', 24.6, 0.35],
  ['whoosh', 25.92, 0.25], ['tick', 28.2, 0.25], ['tick', 28.6, 0.25], ['knock', 29.6, 0.4],
  ['crackle', 31.5, 0.45], ['tick', 33.4, 0.3], ['tick', 34.4, 0.3], ['tick', 35.4, 0.3], ['buzz', 36.4, 0.3], ['riser', 38.9, 0.3], ['chime', 40.9, 0.35],
  ['whoosh', 41.04, 0.25], ['thud', 46.1, 0.5], ['chime', 46.6, 0.35], ['pop', 48.3, 0.35], ['crystal', 51.1, 0.35], ['whoosh', 51.5, 0.25],
  ['screech', 53.05, 0.2], ['whoosh', 54.2, 0.3], ['pop', 57.3, 0.35], ['engine', 60.9, 0.3], ['tick', 61.6, 0.25], ['tick', 62.2, 0.25], ['tick', 62.8, 0.25], ['knock', 64.1, 0.4],
  ['whoosh', 66.32, 0.3], ['chime', 69.5, 0.45],
  ['whoosh', 72.08, 0.25], ['pop', 73.3, 0.35], ['pop', 76.3, 0.35], ['ting', 78.5, 0.35],
  ['pop', 80.0, 0.4], ['pop', 82.3, 0.4], ['chime', 83.3, 0.4],
];

/* tahun berjalan di adegan twist */
function yearAt(t: number) {
  if (t < 33.2) return 1;
  if (t < 38.9) return Math.min(3, 1 + Math.floor(interpolate(t, [33.2, 36.2], [0, 2.999], {extrapolateRight: 'clamp'})));
  return Math.min(20, 3 + Math.floor(interpolate(t, [38.9, 40.8], [0, 17.999], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})));
}
const rentAt = (y: number) => Math.pow(1.05, y - 1); // juta per bulan
const jt = (v: number) => `${v.toFixed(2).replace('.', ',')} jt`;

export const Video12: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const cam = camFor(t);

  // ---- timbangan: tilt > 0 = sisi sewa (kiri) turun ----
  const tilt = 0.05 * r(t, 29.5, 30.2, sp) * (1 - r(t, 31.3, 31.6)) - 0.2 * r(t, 46.0, 46.8, sp) * (1 - r(t, 63.9, 64.8)) + 0.12 * r(t, 63.9, 64.8, sp) * (1 - r(t, 66.4, 67.0)) - 0.2 * r(t, 79.9, 80.4) * 0;

  // ---- rumah muncul ----
  const hS = r(t, 0.1, 0.6, sp), hN = r(t, 0.5, 1.0, sp);

  // ---- tumpukan uang (1 ikat = 25 rb per bulan) ----
  const y = t >= B.twist ? yearAt(t) : 1;
  const nS = Math.round(40 * rentAt(y)), nN = 43;
  const apN = r(t, 22.8, 24.6, Easing.linear), apS = r(t, 28.1, 29.4, Easing.linear);
  const stkOut = 1 - r(t, 52.6, 53.0); // tumpukan hilang setelah angka besar

  // ---- kunci terbang ----
  const keyFly = r(t, 51.1, 52.5, Easing.in(Easing.cubic));

  // ---- jalan, kantor, motor, koin ----
  const roadLen = interpolate(t, [54.2, 56.4], [0, OFF[0] - ROAD_X - 0.3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const roadVis = t >= B.tunggu && t < B.tanya ? 1 : 0;
  const offS = r(t, 55.8, 56.5, sp) * roadVis;
  const motorX = interpolate(t, [61.0, 63.6], [2.4, OFF[0] - 0.6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const coins = Array.from({length: 9}, (_, i) => ROAD_X + 0.6 + i * 0.68);

  // ---- kalender ----
  const calS = 0.75 * (r(t, 4.96, 5.3, sp) * (1 - r(t, 7.7, 7.95)));
  const calText = t < 8 ? '20 TAHUN LAGI' : `TAHUN ${y}`;

  // ---- overlay dari proyeksi 3D ----
  const pS = proj(cam, [-HX, PH - 0.25, 0.4]), pN = proj(cam, [HX, PH - 0.25, 0.4]);
  const topS = proj(cam, [SS[0], nS * 0.022 * STK + 0.12, SS[2]]), topN = proj(cam, [SN[0], nN * 0.022 * STK + 0.12, SN[2]]);
  const pHome = proj(cam, [HX, PH + 1.0, 0]);

  const flood = r(t, 8.0, 8.45) * (1 - r(t, 12.0, 12.4));

  return (
    <AbsoluteFill>
      <PaperPlus />
      <ThreeCanvas width={1080} height={1920} shadows camera={{position: cam.pos, fov: cam.fov ?? FOV}} gl={{alpha: true, antialias: true}}>
        <Lights /><Rig k={cam} />
        <fog attach="fog" args={['#efece4', 11, 26]} />
        <Table />
        <Scale tilt={tilt}>
          <group position={[-HX, 0, 0]}><MiniHouse kind="sewa" s={hS} /></group>
          <group position={[HX, 0, 0]}><MiniHouse kind="subsidi" s={hN} /></group>
          <KeyObj p={[-HX + keyFly * -3.2, 0.3 + keyFly * 1.6, 0.31 + keyFly * 0.5]} s={hS * (1 - r(t, 52.3, 52.6))} rot={[0, 0, -0.5 + keyFly * 6]} />
        </Scale>
        {stkOut > 0 && <>
          <group position={SS} scale={[1.3 * stkOut, STK, 1.3 * stkOut]}><Bills p={[0, 0, 0]} gray={nS} coral={0} appear={apS} /></group>
          <group position={SN} scale={[1.3 * stkOut, STK, 1.3 * stkOut]}><Bills p={[0, 0, 0]} gray={0} coral={nN} appear={apN} /></group>
        </>}
        <Calendar s={calS} p={CAL} text={calText} done={false} />
        {roadVis > 0 && <>
          <Road x0={ROAD_X} len={roadLen} z={ROAD_Z} />
          <Office p={OFF} s={offS} />
          {t >= 60.9 && t < B.payoff + 6 && <Motor p={[motorX, 0.012, ROAD_Z]} />}
          {coins.map((x, i) => <Coin key={i} p={[x, 0.02, ROAD_Z + (i % 2 ? 0.1 : -0.1)]} s={motorX > x ? 1 : 0} />)}
        </>}
      </ThreeCanvas>

      {/* jangkar atas */}
      <Kicker text="HITUNG RUMAH · #02" y={292} start={0} />
      <TikTokBox text="Ngontrak atau nyicil?" p={r(t, 0.2, 1.1, Easing.linear)} y={338} size={40} />

      {/* ---------- hook ---------- */}
      <Title t={t} a={0} b={2.0} small="Ngontrak" big="SEJUTA" size={150} />
      <Title t={t} a={1.9} b={4.9} small="Nyicil rumah subsidi" big="JUGA SEJUTAAN" size={104} />
      <Chip x={pS[0]} y={pS[1]} p={r(t, 0.4, 0.8) * (1 - r(t, 7.6, 7.9))} text="sewa" color={BLUE} />
      <Chip x={pN[0]} y={pN[1]} p={r(t, 1.8, 2.2) * (1 - r(t, 7.6, 7.9))} text="subsidi" color={CORAL} />
      <Title t={t} a={4.96} b={7.9} small="20 tahun lagi, bedanya" big="SATU RUMAH" size={130} />

      {/* ---------- nyicil ---------- */}
      <Title t={t} a={B.nyicil} b={16.35} small="Rumah subsidi di Jawa" big="Rp166 JUTA" size={140} />
      <Title t={t} a={16.4} b={21.3} small="DP cuma 1%, bunganya" big="TETAP 5% 🔒" size={130} />
      <Title t={t} a={21.36} b={25.85} small="Cicilan 20 tahun" big="±1,08 JUTA" size={140} />
      <Chip x={topN[0]} y={topN[1] - 30} p={r(t, 24.5, 24.9) * (1 - r(t, 25.6, 25.9))} text="1,08 jt / bulan" color={CORAL} size={36} />
      <Chip x={540} y={1270} p={r(t, 13.0, 13.4) * (1 - r(t, 16.0, 16.3))} text="batas harga 2026 (Jawa, luar Jabodetabek)" size={30} />

      {/* ---------- sewa ---------- */}
      <Title t={t} a={B.sewa} b={29.4} small="Ngontrak rumah sejenis" big="±1 JUTA" bigColor={BLUE} size={150} />
      <Chip x={540} y={1270} p={r(t, 26.6, 27.0) * (1 - r(t, 29.1, 29.4))} text="perkiraan, beda tiap daerah" size={34} />
      <Title t={t} a={29.44} b={31.75} small="Lebih murah" big="80 RIBU" bigColor={BLUE} size={150} />

      {/* ---------- twist ---------- */}
      {t >= B.twist && t < 33.4 && <AbsoluteFill style={{opacity: 1 - r(t, 33.0, 33.35)}}><PatternBreak lines={['TAPI SEWA', 'ITU NAIK']} p={r(t, 31.46, 32.3)} /></AbsoluteFill>}
      <Title t={t} a={33.15} b={35.25} small="Anggap naik" big="5% SETAHUN" bigColor={BLUE} size={130} />
      <Title t={t} a={35.28} b={38.85} small="Tahun ke-3, sewanya" big="LEBIH MAHAL" bigColor={BLUE} size={130} />
      <Title t={t} a={38.88} b={41.0} small="Cicilan subsidi" big="NGGAK IKUT NAIK" size={104} />
      <Chip x={topS[0]} y={topS[1] - 30} p={r(t, 33.4, 33.8) * (1 - r(t, 41.0, 41.3))} text={jt(rentAt(y))} color={BLUE} size={40} solid={y >= 3} />
      <Chip x={topN[0]} y={topN[1] - 30} p={r(t, 33.6, 34.0) * (1 - r(t, 41.0, 41.3))} text="1,08 jt" color={CORAL} size={40} />
      <Chip x={540} y={1270} p={r(t, 33.3, 33.7) * (1 - r(t, 40.9, 41.2))} text={`TAHUN ${y} · simulasi`} color={INK} solid size={40} />

      {/* ---------- angka besar ---------- */}
      <Title t={t} a={B.angka} b={48.0} small="Nyicil 20 tahun, bayar" big="±260 JUTA" size={140} />
      <Chip x={pN[0]} y={pN[1] - 20} p={r(t, 46.2, 46.6) * (1 - r(t, 52.7, 53.0))} text="MILIKMU ✓" color={SAGE} solid size={40} />
      <Title t={t} a={48.08} b={53.0} small="Ngontrak 20 tahun, bayar hampir" big="±400 JUTA" bigColor={BLUE} size={140} />
      <Chip x={pS[0]} y={pS[1] - 20} p={r(t, 51.2, 51.6) * (1 - r(t, 52.7, 53.0))} text="kunci balik 🔑" color={BLUE} size={38} />
      <Chip x={540} y={1270} p={r(t, 41.4, 41.8) * (1 - r(t, 52.6, 52.95))} text="simulasi (perkiraan): sewa naik 5%/tahun" size={30} />

      {/* ---------- tunggu ---------- */}
      <Title t={t} a={B.tunggu} b={57.1} small="Tapi tunggu." big="RUMAHNYA JAUH?" size={100} />
      <Chip x={pHome[0]} y={pHome[1] - 10} p={r(t, 55.5, 55.9) * (1 - r(t, 56.4, 56.7))} text="pinggir kota" size={36} />
      <Title t={t} a={57.2} b={60.7} small="Selisih tadi" big="±560 RIBU/BULAN" bigColor={SAGE} size={100} />
      <Title t={t} a={60.8} b={63.8} small="Ongkos jalan nambah" big="LEBIH DARI ITU?" size={110} />
      <Title t={t} a={63.84} b={66.25} small="Ngontrak dekat kantor" big="BISA LEBIH UNTUNG" bigColor={BLUE} size={96} />

      {/* ---------- payoff ---------- */}
      <Title t={t} a={B.payoff} b={B.aksi} small="Bukan cicilan atau sewanya," big="TAPI JARAKNYA" bigColor={SAGE} size={112} />
      <LightLeak p={r(t, 69.4, 70.6, Easing.linear)} />

      {/* ---------- aksi ---------- */}
      <Title t={t} a={B.aksi} b={76.2} small="Sebelum akad, hitung" big="ONGKOS JALAN" bigColor={SAGE} size={112} />
      <Chip x={540} y={1270} p={r(t, 73.3, 73.7) * (1 - r(t, 75.9, 76.2))} text="sebulan, dari rumah itu ke kantor" size={34} />
      <Title t={t} a={76.24} b={B.tanya} small="Lagi bingung? Kirim ke" big="PASANGAN" size={140} />

      {/* ---------- CTA ---------- */}
      <Title t={t} a={B.tanya} b={B.follow} small="Kamu tim" big="NGONTRAK / NYICIL?" size={96} />
      <CommentBubble word="ngontrak / nyicil?" start={Math.round(80.0 * FPS)} y={1000} out={Math.round(82.2 * FPS)} />
      <FollowButton start={Math.round(82.3 * FPS)} click={Math.round(83.3 * FPS)} y={1080} />

      {/* layar dua kubu (ciri #7) */}
      {flood > 0 && <Camps t={t} p={flood} />}
      <Captions ms={t * 1000} />

      <Ornament cx={1030} cy={150} size={360} start={0} accent={flood} />
      <Ornament cx={40} cy={1800} size={360} start={6} accent={flood} />
      <Grain o={0.06} id="g12" />

      <Audio src={staticFile('v12/vo.mp3')} />
      <Audio src={staticFile('v12/sfx/ambient.wav')} volume={0.08} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`v12/sfx/${n}.wav`)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
