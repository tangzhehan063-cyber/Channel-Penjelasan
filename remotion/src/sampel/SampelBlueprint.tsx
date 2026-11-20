// Sampel gaya "blueprint" (tanpa suara, tanpa naskah): potongan dinding bata terurai, label nama material, kamera isometrik berganti sudut. 30 dtk. Bukan video bernomor.
import {useMemo} from 'react';
import * as THREE from 'three';
import {Edges} from '@react-three/drei';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import {camAt, FPS, projIso, r, type Key, type V3} from '../kit/waktu';

export const SB_FRAMES = 30 * FPS;
const BG = '#0a2a4d', LINE = '#8fe3ff', FILL = '#13508c', HI = '#2f8fe0';
const mix = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), k).getStyle();
const ez = Easing.inOut(Easing.cubic);
const LOOK: V3 = [0, 0.55, 0.55];

const K = (t: number, az: number, el: number, zoom: number, look: V3 = LOOK): Key => ({t, pos: [0, 0, 0], look, zoom, az, el});
const CAM: Key[] = [
  K(0, 45, 35.3, 400), K(4, 30, 32, 400), K(7, 15, 26, 340, [0, 0.7, 0.9]), K(10.5, -25, 28, 340, [0, 0.7, 0.9]),
  K(14, -55, 22, 350, [0, 0.6, 0.5]), K(17.5, 65, 22, 340, [0, 0.8, 0.4]), K(21, 78, 40, 330, [0, 0.4, 0.4]),
  K(24, 45, 62, 330, [0, 0.4, 0.5]), K(27, 40, 35.3, 380), K(30, 25, 30, 360),
];

// jendela sorot per lapisan [mulai, selesai]
const SOROT: Record<string, [number, number]> = {
  cat: [6.2, 8.4], aci: [8.4, 10.6], plester: [10.6, 12.8], bata: [12.8, 15.0], besi: [15.0, 17.4], kolom: [17.4, 19.8], sloof: [19.8, 22.0], tanah: [22.0, 24.2],
};
const NAMA: Record<string, string[]> = {cat: ['CAT TEMBOK'], aci: ['ACI', '(ACIAN)'], plester: ['PLESTER', 'SEMEN'], bata: ['BATA MERAH', '+ SPESI'], besi: ['BESI', 'TULANGAN'], kolom: ['KOLOM PRAKTIS', '(BETON)'], sloof: ['SLOOF', '(BETON BERTULANG)'], tanah: ['TANAH DASAR']};
const URUT = ['cat', 'aci', 'plester', 'bata', 'besi', 'kolom', 'sloof', 'tanah'];

function layout(t: number) {
  const e = r(t, 4.2, 6.2, ez) - r(t, 24.6, 27.2, ez);
  const sorot = (k: string) => { const [a, b] = SOROT[k]; return r(t, a, a + 0.35, ez) * (1 - r(t, b - 0.35, b, ez)); };
  const anyHi = Math.max(...URUT.map(sorot));
  const g = 0.42 * e;
  const P: Record<string, {c: V3; s: V3; hi: number}> = {
    bata: {c: [0, 0.8, 0.12], s: [2.1, 1.3, 0.24], hi: sorot('bata')},
    plester: {c: [0, 0.75, 0.275 + g], s: [2.4, 1.5, 0.07], hi: sorot('plester')},
    aci: {c: [0, 0.75, 0.33 + 2 * g], s: [2.4, 1.5, 0.04], hi: sorot('aci')},
    cat: {c: [0, 0.75, 0.3625 + 3 * g], s: [2.4, 1.5, 0.025], hi: sorot('cat')},
    kolomL: {c: [-1.125 - 0.32 * e, 0.75, 0.12], s: [0.15, 1.5, 0.24], hi: sorot('kolom')},
    kolomR: {c: [1.125 + 0.32 * e, 0.75, 0.12], s: [0.15, 1.5, 0.24], hi: sorot('kolom')},
    sloof: {c: [0, -0.1 - 0.22 * e, 0.12], s: [2.4, 0.2, 0.3], hi: sorot('sloof')},
    tanah: {c: [0, -0.45 - 0.5 * e, 0.12], s: [3.0, 0.5, 1.0], hi: sorot('tanah')},
  };
  return {e, anyHi, P, sorot};
}

const Slab: React.FC<{c: V3; s: V3; hi: number; dim: number; tex?: THREE.Texture}> = ({c, s, hi, dim, tex}) => {
  const fade = 1 - dim * (1 - hi);                       // 1 = terang, turun saat lapisan lain disorot
  const fill = mix(FILL, HI, hi), line = mix(BG, hi > 0.5 ? '#ffffff' : LINE, fade);
  return (
    <mesh position={c}>
      <boxGeometry args={s} />
      <meshBasicMaterial color={tex ? '#ffffff' : fill} map={tex} transparent opacity={0.28 + 0.5 * hi + 0.12 * fade} depthWrite={false} />
      <Edges color={line} lineWidth={hi > 0.5 ? 2.4 : 1.6} />
    </mesh>
  );
};

const useBataTex = () => useMemo(() => {
  const c = document.createElement('canvas'); c.width = 512; c.height = 512; const g = c.getContext('2d')!;
  g.fillStyle = '#1a5a9a'; g.fillRect(0, 0, 512, 512); g.strokeStyle = '#a8ecff'; g.lineWidth = 3;
  const bh = 512 / 13, bw = 512 / 7;
  for (let j = 0; j < 13; j++) { const y = j * bh; g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); const off = j % 2 ? bw / 2 : 0; for (let x = off; x < 512; x += bw) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + bh); g.stroke(); } }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}, []);

const Rig: React.FC<{k: Key}> = ({k}) => {
  const cam = useThree((s) => s.camera) as THREE.OrthographicCamera;
  const az = (k.az ?? 45) * Math.PI / 180, el = (k.el ?? 35.3) * Math.PI / 180, D = 34.64;
  cam.position.set(k.look[0] + D * Math.cos(el) * Math.sin(az), k.look[1] + D * Math.sin(el), k.look[2] + D * Math.cos(el) * Math.cos(az));
  cam.zoom = k.zoom ?? 300; cam.near = -50; cam.far = 120; cam.updateProjectionMatrix(); cam.lookAt(...k.look);
  return null;
};

const Scene: React.FC<{t: number}> = ({t}) => {
  const tex = useBataTex();
  const {e, anyHi, P} = layout(t);
  const dim = anyHi * 0.85;
  const hiK = P.kolomL.hi, hiB = layout(t).sorot('besi');
  const rods: V3[] = [[-0.045, 0, -0.07], [0.045, 0, -0.07], [-0.045, 0, 0.07], [0.045, 0, 0.07]];
  const fadeB = 1 - dim * (1 - hiB);
  return (
    <>
      <Slab {...P.bata} dim={dim} tex={tex} />
      <Slab {...P.plester} dim={dim} /><Slab {...P.aci} dim={dim} /><Slab {...P.cat} dim={dim} />
      <Slab {...P.kolomL} dim={dim} /><Slab {...P.kolomR} dim={dim} />
      <Slab {...P.sloof} dim={dim} /><Slab {...P.tanah} dim={dim} />
      {/* besi tulangan: 4 batang vertikal per kolom + 2 batang memanjang di sloof */}
      {(['kolomL', 'kolomR'] as const).flatMap((k) => rods.map((o, i) => (
        <mesh key={k + i} position={[P[k].c[0] + o[0], P[k].c[1], P[k].c[2] + o[2]]}><cylinderGeometry args={[0.012 + 0.006 * hiB, 0.012 + 0.006 * hiB, 1.46, 8]} /><meshBasicMaterial color={mix(BG, hiB > 0.5 ? '#ffffff' : LINE, fadeB)} /></mesh>
      )))}
      {[-0.07, 0.07].flatMap((dz) => [-0.06, 0.06].map((dy, i) => (
        <mesh key={'s' + dz + i} position={[0, P.sloof.c[1] + dy, P.sloof.c[2] + dz]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012 + 0.006 * hiB, 0.012 + 0.006 * hiB, 2.36, 8]} /><meshBasicMaterial color={mix(BG, hiB > 0.5 ? '#ffffff' : LINE, fadeB)} /></mesh>
      )))}
    </>
  );
};

/** titik tempel label pada tiap lapisan (dunia) */
function anchor(k: string, t: number): V3 {
  const {P} = layout(t);
  switch (k) {
    case 'cat': return [P.cat.c[0] + 0.7, P.cat.c[1] + 0.55, P.cat.c[2]];
    case 'aci': return [P.aci.c[0] + 0.7, P.aci.c[1] + 0.55, P.aci.c[2]];
    case 'plester': return [P.plester.c[0] + 0.7, P.plester.c[1] + 0.55, P.plester.c[2]];
    case 'bata': return [0.2, 0.8, P.bata.c[2] + 0.12];
    case 'besi': return [P.kolomR.c[0], 1.0, P.kolomR.c[2]];
    case 'kolom': return [P.kolomL.c[0], 1.3, P.kolomL.c[2] + 0.12];
    case 'sloof': return [-0.6, P.sloof.c[1], P.sloof.c[2] + 0.15];
    default: return [0.6, P.tanah.c[1], P.tanah.c[2] + 0.5];
  }
}

const Label: React.FC<{t: number; cam: Key; k: string; n: number}> = ({t, cam, k, n}) => {
  const [a, b] = SOROT[k];
  const o = r(t, a, a + 0.35, ez) * (1 - r(t, b - 0.35, b, ez));
  if (o <= 0.01) return null;
  const [ax, ay] = projIso(cam, anchor(k, t));
  const left = ax > 520;                                   // label di tepi layar sisi yang berlawanan dengan titik tempel; teks tidak pernah keluar layar
  const by = Math.max(150, Math.min(1560, ay - 330)), bx = left ? 90 : 990;
  const slide = (1 - o) * 24;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: o}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <polyline points={`${ax},${ay} ${left ? 420 : 660},${by - 8} ${bx + (left ? 0 : 0)},${by - 8}`} stroke="#fff" strokeWidth={3} fill="none" />
        <circle cx={ax} cy={ay} r={9} fill="none" stroke="#fff" strokeWidth={3} /><circle cx={ax} cy={ay} r={3.5} fill="#fff" />
      </svg>
      <div style={{position: 'absolute', top: by + slide, ...(left ? {left: bx} : {right: 1080 - bx}), whiteSpace: 'nowrap', fontFamily: '"Courier New", monospace', fontWeight: 700, color: '#fff', textAlign: left ? 'left' : 'right'}}>
        <div style={{fontSize: 30, color: LINE, letterSpacing: 4}}>{String(n).padStart(2, '0')}</div>
        <div style={{fontSize: 56, lineHeight: 1.05, textShadow: `0 0 12px ${BG}`}}>{NAMA[k].map((x) => <div key={x}>{x}</div>)}</div>
      </div>
    </div>
  );
};

export const SampelBlueprint: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const cam = camAt(CAM, t);
  return (
    <AbsoluteFill style={{background: BG}}>
      <AbsoluteFill style={{backgroundImage: `linear-gradient(${LINE}22 1px, transparent 1px), linear-gradient(90deg, ${LINE}22 1px, transparent 1px), linear-gradient(${LINE}0f 1px, transparent 1px), linear-gradient(90deg, ${LINE}0f 1px, transparent 1px)`, backgroundSize: '216px 216px, 216px 216px, 54px 54px, 54px 54px'}} />
      <ThreeCanvas orthographic width={1080} height={1920} camera={{position: [20, 20, 20], zoom: cam.zoom ?? 300, near: -50, far: 120}} gl={{alpha: true, antialias: true}}>
        <Rig k={cam} /><Scene t={t} />
      </ThreeCanvas>
      {URUT.map((k, i) => <Label key={k} t={t} cam={cam} k={k} n={i + 1} />)}
      {/* bingkai gambar teknik */}
      <div style={{position: 'absolute', inset: 36, border: `3px solid ${LINE}`, opacity: 0.8}} />
      <div style={{position: 'absolute', left: 60, top: 60, fontFamily: '"Courier New", monospace', fontWeight: 700, fontSize: 34, color: LINE, letterSpacing: 5}}>POTONGAN DINDING BATA</div>
      <div style={{position: 'absolute', left: 60, bottom: 60, fontFamily: '"Courier New", monospace', fontSize: 26, color: LINE, letterSpacing: 4, opacity: 0.9}}>SAMPEL GAYA · BLUEPRINT · ISOMETRIK</div>
    </AbsoluteFill>
  );
};
