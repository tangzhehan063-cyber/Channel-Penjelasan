// Video #13 (remake #5) "Tembokmu Minum Air" — MOODBOARD visual (tanpa suara), gaya diorama kertas halus (#10).
// 6 adegan × 3 dtk, kamera terbang mulus antar-adegan. Timing final menyusul setelah VO.
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Grain, TikTokBox} from '../aset/Aset';
import {PaperPlus, Kicker} from '../aset/Gabung';
import {Table, ChalkRing, KT} from '../v10/Tangga';
import {Wall, Ground, Tissue, Ruler} from './Tembok13';

export const FPS = 30;
const SC = 3; // detik per adegan
export const V13_FRAMES = 6 * SC * FPS;
const FOV = 34;
const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
type V3 = [number, number, number];
type Key = {pos: V3; look: V3};
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
/* kamera tiap adegan: [awal, akhir] (drift pelan), terbang 0,7 dtk dari adegan sebelumnya */
const CAMS: [Key, Key][] = [
  [{pos: [1.2, 2.2, 4.6], look: [0, 0.6, 0]}, {pos: [0.9, 1.7, 3.9], look: [0, 0.55, 0]}],          // 1 hook: tembok minum air
  [{pos: [-1.2, 0.9, 3.2], look: [-0.2, 0.45, 0]}, {pos: [-0.9, 0.8, 2.8], look: [-0.2, 0.45, 0]}],   // 2 cat mengelupas
  [{pos: [2.3, 1.2, 3.0], look: [0.6, 0.5, 0.1]}, {pos: [2.0, 1.0, 2.6], look: [0.65, 0.45, 0.1]}],     // 3 dive ke bata + tisu
  [{pos: [-2.4, 0.5, 3.4], look: [-0.5, 0.5, 0]}, {pos: [-2.2, 1.3, 3.4], look: [-0.5, 0.75, 0]}],  // 4 crane ± 1 m
  [{pos: [0.25, 0.5, 1.5], look: [-0.25, 0.36, 0.1]}, {pos: [0.2, 0.48, 1.25], look: [-0.25, 0.36, 0.1]}], // 5 makro garam
  [{pos: [-2.6, 1.6, 3.6], look: [0, 0.5, 0]}, {pos: [2.6, 1.6, 3.6], look: [0, 0.5, 0]}],          // 6 orbit trasram
];
const DIST = 1.5;
const far = (k: Key): Key => ({look: k.look, pos: lerp3(k.look, k.pos, DIST)});
function camAt(t: number): Key {
  const s = Math.min(5, Math.floor(t / SC)), u = (t - s * SC) / SC;
  const cur = far({pos: lerp3(CAMS[s][0].pos, CAMS[s][1].pos, ease(u)), look: lerp3(CAMS[s][0].look, CAMS[s][1].look, ease(u))});
  if (s === 0 || t - s * SC > 0.7) return cur;
  const prev = far(CAMS[s - 1][1]), k = ease((t - s * SC) / 0.7);
  return {pos: lerp3(prev.pos, cur.pos, k), look: lerp3(prev.look, cur.look, k)};
}
const Rig: React.FC<{k: Key}> = ({k}) => { const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera; cam.position.set(...k.pos); cam.fov = FOV; cam.near = 0.03; cam.updateProjectionMatrix(); cam.lookAt(...k.look); return null; };
const Lights: React.FC = () => (
  <>
    <hemisphereLight args={['#fffaf0', '#d8cfbd', 0.9]} />
    <directionalLight position={[2.5, 4.5, 3.0]} intensity={2.2} color="#fff4e6" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={3} shadow-camera-bottom={-3} shadow-radius={6} shadow-bias={-0.0004} />
    <directionalLight position={[-3, 1.5, 2]} intensity={0.35} color="#ffe2da" />
  </>
);
const Title: React.FC<{p: number; small: string; big: string; color?: string; size?: number}> = ({p, small, big, color = KT.coral, size = 112}) => p <= 0 ? null : (
  <div style={{position: 'absolute', left: 60, top: 450, padding: '20px 30px 24px', borderRadius: 26, background: 'rgba(250,249,246,0.96)', boxShadow: '0 12px 40px rgba(28,28,30,0.18)', fontFamily: 'Inter', color: KT.ink, opacity: p, transform: `translateY(${(1 - p) * 22}px)`}}>
    <div style={{fontSize: 50, fontWeight: 700, letterSpacing: -1}}>{small}</div>
    <div style={{whiteSpace: 'nowrap', fontSize: size, fontWeight: 900, letterSpacing: -2, lineHeight: 1, color, marginTop: 6}}>{big}</div>
  </div>
);
const Chip: React.FC<{x: number; y: number; p: number; text: string; color?: string}> = ({x, y, p, text, color = KT.ink}) => p <= 0 ? null : (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${interpolate(p, [0, 0.6, 1], [0.6, 1.06, 1])})`, opacity: Math.min(1, p * 2), padding: '8px 20px', borderRadius: 14, background: 'rgba(250,249,246,0.97)', border: `4px solid ${color}`, fontFamily: 'Inter', fontWeight: 800, fontSize: 42, color, whiteSpace: 'nowrap'}}>{text}</div>
);
const TITLES: [string, string, string?, number?][] = [
  ['Tembokmu', 'MINUM AIR'], ['Cat bawah', 'NGELUPAS LAGI'], ['Pori bata', 'KAYAK TISU'], ['Bisa naik', '± 1 METER'], ['Garam numpuk,', 'CAT KEDORONG', undefined, 100], ['Putus dari tanah:', 'TRASRAM', KT.sage, 130],
];

export const Video13: React.FC = () => {
  const t = useCurrentFrame() / FPS, cam = camAt(t), s = Math.min(5, Math.floor(t / SC)), u = t - s * SC;
  const level = s === 0 ? 0.1 + 0.35 * r(t, 0.3, 2.6) : s === 3 ? 0.3 + 0.2 * r(u, 0.2, 2) : 0.45;
  const seal = 0; // twist (cat kedap) disiapkan, tidak ditampilkan di moodboard
  return (
    <AbsoluteFill>
      <PaperPlus />
      <ThreeCanvas width={1080} height={1920} shadows camera={{position: cam.pos, fov: FOV}} gl={{alpha: true, antialias: true}}>
        <Lights /><Rig k={cam} />
        <fog attach="fog" args={['#efece4', 8, 20]} />
        <Table />
        <Ground p={r(t, 0, 0.5)} />
        <Wall rise={r(t, 0.1, 0.9)} level={level} t={t} cut={s === 2 ? 1 + r(u, 0, 0.8) : 1} peel={s === 1 ? r(u, 0.2, 2.2) : s > 1 && s < 5 ? 1 : 0} salt={s === 4 ? r(u, 0.1, 2.4) : 0} seal={seal} trasram={s === 5 ? r(u, 0.2, 1.4) : 0} />
        <Tissue p={s === 2 ? r(u, 0.1, 0.7) : 0} level={0.1 + 0.35 * r(u, 0.5, 2.5)} />
        <Ruler p={s === 3 ? r(u, 0, 0.6) : 0} mark={0.5} />
        {s === 5 && <ChalkRing p={[0, 0.01, 0.55]} r={0.5} k={r(u, 1.2, 2.2, Easing.linear)} />}
      </ThreeCanvas>
      <Kicker text="FAKTA RUMAH · #13" y={292} start={0} />
      <TikTokBox text="Kenapa cat bawah ngelupas?" p={r(t, 0.2, 1.0, Easing.linear)} y={338} size={40} />
      {TITLES.map(([a, b, c, z], i) => <Title key={i} p={r(t, i * SC + 0.1, i * SC + 0.6) * (1 - r(t, (i + 1) * SC - 0.3, (i + 1) * SC))} small={a} big={b} color={c} size={z} />)}
      <Chip x={290} y={1180} p={s === 3 ? r(u, 0.8, 1.2) : 0} text="± 1 m (perkiraan)" color={KT.coral} />
      <Chip x={700} y={1250} p={s === 2 ? r(u, 1.0, 1.4) : 0} text="naik kayak tisu" color="#1f7fdc" />
      <Chip x={540} y={1250} p={s === 5 ? r(u, 1.3, 1.7) : 0} text="air berhenti di sini ✓" color={KT.sage} />
      <Grain o={0.06} id="g13" />
    </AbsoluteFill>
  );
};
