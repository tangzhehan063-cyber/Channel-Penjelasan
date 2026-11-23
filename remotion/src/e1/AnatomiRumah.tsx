// E1 pilot visual-saja (tanpa naskah): "Anatomi Rumah" 36 dtk. 100% kode: Remotion + three.js, tanpa aset luar, tanpa jaringan.
// Beat: 0-5 establishing | 5-13.4 rumah dibongkar (exploded) | 14.2-24.6 potongan dinding | 24.6-32 jalur beban | 32-36 penutup.
// Satuan = meter. Penyederhanaan visual: besi tulangan digambar lebih tebal; jalur beban disederhanakan (di rumah nyata dinding ikut menyalurkan beban).
import {useMemo} from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import '@fontsource/inter/600.css'; import '@fontsource/inter/900.css';
import {Env} from '../pengetahuan/Scene';
import {Rig} from '../kit/stage';
import {camAt, FPS, proj, r, type Key, type V3} from '../kit/waktu';

export const ANATOMI_FRAMES = 36 * FPS;
const W = 4, D = 3.2, T = 0.15, H = 2.8; // lebar, dalam, tebal dinding, tinggi dinding
const SX = 30; // posisi potongan dinding di dunia
const C = {tanah: '#7b6650', rumput: '#6f9150', bata: '#b8573b', plester: '#e8e1d4', beton: '#a3a29d', kayu: '#a97b42', kayuTua: '#7d5a30', genteng: '#b24d2c', batu: '#78756f', lantai: '#d8cfc0', kaca: '#a9d3e6', besi: '#4a4f57', cat: '#f3efe6', aksen: '#ef6a4c'};

// ---------- tekstur prosedural (CanvasTexture, seed tetap) ----------
const rng = (s: number) => () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
function tex(w: number, h: number, draw: (g: CanvasRenderingContext2D, rnd: () => number) => void, rep: [number, number], seed = 1) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  draw(cv.getContext('2d')!, rng(seed));
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
const useTex = () => useMemo(() => ({
  // tile 0,5 m x 0,28 m: 4 baris bata, 2 bata per baris
  bata: tex(256, 256, (g, rd) => {
    g.fillStyle = '#d9d2c4'; g.fillRect(0, 0, 256, 256);
    for (let row = 0; row < 4; row++) for (let i = -1; i < 3; i++) {
      const off = row % 2 ? 64 : 0, x = i * 128 + off, y = row * 64, v = (rd() - 0.5) * 36;
      g.fillStyle = `rgb(${184 + v},${86 + v * 0.6},${60 + v * 0.5})`; g.fillRect(x + 3, y + 3, 122, 58);
    }
  }, [1 / 0.5, 1 / 0.28], 3),
  genteng: tex(256, 256, (g, rd) => {
    for (let row = 0; row < 8; row++) {
      const y = row * 32, v = (rd() - 0.5) * 14, gr = g.createLinearGradient(0, y, 0, y + 32);
      gr.addColorStop(0, `rgb(${196 + v},${96 + v * 0.5},${62 + v * 0.4})`); gr.addColorStop(1, `rgb(${150 + v},${64 + v * 0.4},${38 + v * 0.3})`);
      g.fillStyle = gr; g.fillRect(0, y, 256, 32);
      g.fillStyle = 'rgba(0,0,0,0.28)'; g.fillRect(0, y + 29, 256, 3);
    }
    for (let i = 0; i < 8; i++) { g.fillStyle = 'rgba(0,0,0,0.16)'; g.fillRect(i * 32, 0, 3, 256); g.fillStyle = 'rgba(255,255,255,0.10)'; g.fillRect(i * 32 + 3, 0, 3, 256); }
  }, [3, 3], 5),
  batu: tex(256, 256, (g, rd) => {
    g.fillStyle = '#6a6762'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 70; i++) { const v = 90 + rd() * 70; g.fillStyle = `rgb(${v},${v - 4},${v - 10})`; g.beginPath(); g.ellipse(rd() * 256, rd() * 256, 14 + rd() * 22, 10 + rd() * 14, rd() * 3, 0, 7); g.fill(); }
  }, [3, 1], 7),
  beton: tex(128, 128, (g, rd) => { g.fillStyle = '#a3a29d'; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 500; i++) { const v = 120 + rd() * 70; g.fillStyle = `rgba(${v},${v},${v - 6},0.5)`; g.fillRect(rd() * 128, rd() * 128, 2, 2); } }, [2, 2], 9),
  tanah: tex(128, 128, (g, rd) => { g.fillStyle = '#7b6650'; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 700; i++) { const v = 70 + rd() * 70; g.fillStyle = `rgba(${v + 40},${v + 20},${v},0.35)`; g.fillRect(rd() * 128, rd() * 128, 3, 2); } }, [5, 1], 11),
}), []);

// ---------- primitif ----------
const M: React.FC<{c: string; map?: THREE.Texture; r?: number; m?: number; o?: number}> = ({c, map, r: ro = 0.8, m = 0, o = 1}) =>
  <meshStandardMaterial color={map ? '#ffffff' : c} map={map} roughness={ro} metalness={m} transparent={o < 1} opacity={o} depthWrite={o >= 1} />;
const Bx: React.FC<{p: V3; s: V3; c: string; map?: THREE.Texture; o?: number; r?: number; m?: number}> = ({p, s, c, map, o = 1, r: ro, m}) =>
  <mesh position={p} castShadow receiveShadow><boxGeometry args={s} /><M c={c} map={map} o={o} r={ro} m={m} /></mesh>;
const Bar: React.FC<{a: V3; b: V3; th: number; c: string; o?: number}> = ({a, b, th, c, o = 1}) => {
  const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b), d = vb.clone().sub(va), len = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  return <mesh position={va.clone().add(vb).multiplyScalar(0.5).toArray()} quaternion={q} castShadow receiveShadow><boxGeometry args={[th, len, th]} /><M c={c} r={0.9} o={o} /></mesh>;
};
/** bingkai persegi panjang dari 4 balok: lebar w (x), dalam d (z), tebal bw, tinggi h */
const Frame: React.FC<{w: number; d: number; bw: number; h: number; y: number; c: string; map?: THREE.Texture}> = ({w, d, bw, h, y, c, map}) => (
  <group position={[0, y + h / 2, 0]}>
    <Bx p={[0, 0, d / 2 - bw / 2]} s={[w, h, bw]} c={c} map={map} /><Bx p={[0, 0, -d / 2 + bw / 2]} s={[w, h, bw]} c={c} map={map} />
    <Bx p={[-w / 2 + bw / 2, 0, 0]} s={[bw, h, d - 2 * bw]} c={c} map={map} /><Bx p={[w / 2 - bw / 2, 0, 0]} s={[bw, h, d - 2 * bw]} c={c} map={map} />
  </group>
);
/** dinding berlubang (ExtrudeGeometry): panjang L, tinggi H, lubang [x tengah, y bawah, lebar, tinggi] */
const Wall: React.FC<{L: number; holes: [number, number, number, number][]; map: THREE.Texture; o?: number}> = ({L, holes, map, o = 1}) => {
  const g = useMemo(() => {
    const s = new THREE.Shape(); s.moveTo(-L / 2, 0); s.lineTo(L / 2, 0); s.lineTo(L / 2, H); s.lineTo(-L / 2, H); s.closePath();
    holes.forEach(([x, y, w, h]) => { const p = new THREE.Path(); p.moveTo(x - w / 2, y); p.lineTo(x + w / 2, y); p.lineTo(x + w / 2, y + h); p.lineTo(x - w / 2, y + h); p.closePath(); s.holes.push(p); });
    const e = new THREE.ExtrudeGeometry(s, {depth: T, bevelEnabled: false}); e.translate(0, 0, -T / 2); return e;
  }, [L, holes]);
  return <mesh geometry={g} castShadow receiveShadow><M c={C.bata} map={map} o={o} /></mesh>;
};
const Jendela: React.FC<{x: number; y: number; w: number; h: number; z?: number}> = ({x, y, w, h}) => (
  <group position={[x, y + h / 2, 0]}>
    <Bx p={[0, 0, 0]} s={[w - 0.02, h - 0.02, 0.02]} c={C.kaca} o={0.45} r={0.1} m={0.1} />
    <Bx p={[0, h / 2 - 0.025, 0]} s={[w, 0.05, 0.08]} c={C.kayuTua} /><Bx p={[0, -h / 2 + 0.025, 0]} s={[w, 0.05, 0.08]} c={C.kayuTua} />
    <Bx p={[-w / 2 + 0.025, 0, 0]} s={[0.05, h, 0.08]} c={C.kayuTua} /><Bx p={[w / 2 - 0.025, 0, 0]} s={[0.05, h, 0.08]} c={C.kayuTua} /><Bx p={[0, 0, 0]} s={[0.04, h, 0.06]} c={C.kayuTua} />
  </group>
);

// ---------- rumah (layer dengan offset bongkar e = 0..1) ----------
const OFF = {sloof: 0.6, lantai: 1.1, dinding: 1.9, ring: 3.1, kuda: 4.1, genteng: 5.2};
const LX = W - 2 * T, LZ = D - 2 * T;
const HOLE_F: [number, number, number, number][] = [[-0.9, 0, 0.9, 2.1], [0.95, 1.0, 0.9, 0.9]];
const HOLE_B: [number, number, number, number][] = [[0, 1.0, 1.0, 0.9]];
const HOLE_S: [number, number, number, number][] = [[0, 1.0, 0.8, 0.9]];
const Rumah: React.FC<{e: number; o: number}> = ({e, o}) => {
  const t = useTex();
  const y0 = 0.3, rise = 1.4, hs = D / 2 + 0.4;
  const trusses = [-1.8, -0.9, 0, 0.9, 1.8];
  return (
    <group>
      {/* tanah + rumput: blok potong */}
      <Bx p={[0, -1.05, 0]} s={[9, 1.1, 9]} c={C.tanah} map={t.tanah} />
      <Bx p={[0, -0.47, 0]} s={[9, 0.06, 9]} c={C.rumput} r={1} />
      {/* pondasi batu kali */}
      <Frame w={W + 0.5} d={D + 0.5} bw={0.5} h={0.5} y={-0.5} c={C.batu} map={t.batu} />
      {/* sloof */}
      <group position={[0, e * OFF.sloof, 0]}><Frame w={W} d={D} bw={T} h={0.2} y={0} c={C.beton} map={t.beton} /></group>
      {/* lantai */}
      <group position={[0, e * OFF.lantai, 0]}><Bx p={[0, 0.2, 0]} s={[LX, 0.1, LZ]} c={C.lantai} r={0.4} /></group>
      {/* dinding + kolom + kusen */}
      <group position={[0, e * OFF.dinding + y0 - 0.1, 0]}>
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz]) => <Bx key={`${sx}${sz}`} p={[sx * (W / 2 - T / 2), H / 2, sz * (D / 2 - T / 2)]} s={[T, H, T]} c={C.beton} map={t.beton} o={o} />)}
        <group position={[0, 0, D / 2 - T / 2]}><Wall L={LX} holes={HOLE_F} map={t.bata} o={o} /><Jendela x={0.95} y={1.0} w={0.9} h={0.9} /><Bx p={[-0.9, 1.05, 0]} s={[0.84, 2.04, 0.05]} c={C.kayu} /></group>
        <group position={[0, 0, -D / 2 + T / 2]}><Wall L={LX} holes={HOLE_B} map={t.bata} o={o} /><Jendela x={0} y={1.0} w={1.0} h={0.9} /></group>
        <group position={[W / 2 - T / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}><Wall L={LZ} holes={HOLE_S} map={t.bata} o={o} /><Jendela x={0} y={1.0} w={0.8} h={0.9} /></group>
        <group position={[-W / 2 + T / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}><Wall L={LZ} holes={HOLE_S} map={t.bata} o={o} /><Jendela x={0} y={1.0} w={0.8} h={0.9} /></group>
      </group>
      {/* ring balok */}
      <group position={[0, e * OFF.ring, 0]}><Frame w={W} d={D} bw={T} h={0.2} y={y0 + H - 0.1} c={C.beton} map={t.beton} /></group>
      {/* kuda-kuda kayu */}
      <group position={[0, e * OFF.kuda + y0 + H + 0.1, 0]}>
        {trusses.map((x) => (<group key={x}>
          <Bar a={[x, 0.04, -hs]} b={[x, 0.04, hs]} th={0.08} c={C.kayu} />
          <Bar a={[x, 0.04, -hs]} b={[x, rise, 0]} th={0.08} c={C.kayu} /><Bar a={[x, 0.04, hs]} b={[x, rise, 0]} th={0.08} c={C.kayu} />
          <Bar a={[x, 0.04, 0]} b={[x, rise, 0]} th={0.06} c={C.kayuTua} />
          <Bar a={[x, 0.04, -hs / 2]} b={[x, rise / 2, -hs / 4]} th={0.05} c={C.kayuTua} /><Bar a={[x, 0.04, hs / 2]} b={[x, rise / 2, hs / 4]} th={0.05} c={C.kayuTua} />
        </group>))}
        {[0.35, 0.7, 1.05].map((k) => [-1, 1].map((s) => <Bar key={`${k}${s}`} a={[-2.3, rise * (1 - k) + 0.05, s * hs * k]} b={[2.3, rise * (1 - k) + 0.05, s * hs * k]} th={0.06} c={C.kayuTua} />))}
      </group>
      {/* genteng */}
      <group position={[0, e * OFF.genteng + y0 + H + 0.1, 0]}>
        {[-1, 1].map((s) => {
          const ang = Math.atan2(rise, hs), len = Math.hypot(rise, hs) + 0.06;
          return <mesh key={s} position={[0, rise / 2 + 0.08 * Math.cos(ang), s * hs / 2]} rotation={[s * ang, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[4.9, 0.06, len]} /><M c={C.genteng} map={t.genteng} o={o} /></mesh>;
        })}
        <Bx p={[0, rise + 0.1, 0]} s={[4.9, 0.1, 0.22]} c={C.genteng} r={0.7} o={o} />
      </group>
    </group>
  );
};

// ---------- potongan dinding (di x = SX) ----------
const Potongan: React.FC<{e: number}> = ({e}) => {
  const t = useTex();
  const g = 0.34 * e, hh = 1.7, ww = 1.4;
  // urutan dari luar (+z) ke dalam (-z): cat, plester, bata, plester, cat
  const L: [string, number, string, THREE.Texture | undefined, number][] = [['cat l', 0.012, '#e9c978', undefined, 2], ['plester l', 0.03, C.plester, undefined, 1], ['bata', 0.1, C.bata, t.bata, 0], ['plester d', 0.03, C.plester, undefined, -1], ['cat d', 0.012, '#9fc4cf', undefined, -2]];
  let zc = 0; const pos = L.map(([, th, , , i]) => { const z = i * (0.07 + g) * 1; zc += th; return z; });
  return (
    <group position={[SX, 0, 0]}>
      <Bx p={[0, -0.05, 0]} s={[5, 0.1, 4]} c="#cfc8ba" r={0.9} />
      {L.map(([n, th, c, map], i) => (
        <mesh key={n} position={[-0.05, hh / 2, pos[i]]} castShadow receiveShadow><boxGeometry args={[1.2, hh, th]} /><M c={c} map={map} r={n === 'bata' ? 0.9 : 0.6} /></mesh>
      ))}
      {/* kolom beton transparan + besi */}
      <group position={[0.7 + e * 0.12, 0, 0]}>
        <mesh position={[0, hh / 2, 0]} castShadow><boxGeometry args={[0.16, hh, 0.16]} /><M c={C.beton} map={t.beton} o={1 - 0.65 * Math.min(1, e * 1.6)} /></mesh>
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => <mesh key={`${a}${b}`} position={[a * 0.055, hh / 2, b * 0.055]} castShadow><cylinderGeometry args={[0.014, 0.014, hh + 0.1, 10]} /><M c={C.besi} r={0.4} m={0.8} /></mesh>)}
        {Array.from({length: 8}, (_, i) => 0.12 + i * 0.2).map((y) => <group key={y} position={[0, y, 0]}>
          {[[0, 0.06, 0.14, 0.008], [0, -0.06, 0.14, 0.008]].map(([x, z, w, h], k) => <Bx key={k} p={[x, 0, z]} s={[w, h, 0.008]} c={C.besi} m={0.8} r={0.4} />)}
          {[-0.06, 0.06].map((x) => <Bx key={x} p={[x, 0, 0]} s={[0.008, 0.008, 0.14]} c={C.besi} m={0.8} r={0.4} />)}
        </group>)}
      </group>
    </group>
  );
};

// ---------- jalur beban ----------
const Beban: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 24.9, 25.7) * (1 - r(t, 31.2, 32));
  if (a <= 0) return null;
  const px = W / 2 - T / 2, pz = D / 2 - T / 2;
  const corners: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  const pts = (sx: number, sz: number): V3[] => [[sx * 1.0, 4.2, sz * 0.9], [sx * px, 3.35, sz * pz], [sx * px, 0.3, sz * pz], [sx * px, -0.25, sz * pz], [sx * (px + 0.4), -1.0, sz * (pz + 0.4)]];
  return (<group>
    {corners.map(([sx, sz]) => {
      const P = pts(sx, sz).map((p) => new THREE.Vector3(...p)), cu = new THREE.CatmullRomCurve3(P, false, 'catmullrom', 0.05);
      return <group key={`${sx}${sz}`}>
        <mesh><tubeGeometry args={[cu, 40, 0.025, 6]} /><meshBasicMaterial color={C.aksen} transparent opacity={0.35 * a} depthTest={false} /></mesh>
        {Array.from({length: 6}, (_, i) => { const u = (((t - 25) * 0.16 + i / 6) % 1 + 1) % 1; const p = cu.getPoint(u); return <mesh key={i} position={p.toArray()}><sphereGeometry args={[0.09, 12, 10]} /><meshBasicMaterial color={C.aksen} transparent opacity={a} depthTest={false} /></mesh>; })}
      </group>;
    })}
  </group>);
};

// ---------- kamera ----------
const orb = (t: number, az: number, el: number, d: number, look: V3): Key => { const A = az * Math.PI / 180, E = el * Math.PI / 180; return {t, pos: [look[0] + d * Math.cos(E) * Math.sin(A), look[1] + d * Math.sin(E), look[2] + d * Math.cos(E) * Math.cos(A)], look}; };
const KA: Key[] = [orb(0, 38, 12, 24, [0, 1.7, 0]), orb(5, -22, 20, 24, [0, 1.9, 0]), orb(9.5, 10, 14, 26, [0, 4.6, 0]), orb(14.2, 42, 20, 26, [0, 4.6, 0])];
const KB: Key[] = [orb(14.2, 6, 6, 5.6, [SX, 0.85, 0]), orb(16.2, 10, 8, 5.6, [SX, 0.85, 0]), orb(20.5, 62, 13, 6.2, [SX, 0.85, 0]), orb(24.6, 48, 22, 6, [SX, 0.85, 0])];
const KC: Key[] = [orb(24.6, -35, 18, 22, [0, 1.8, 0]), orb(31, 20, 16, 21, [0, 1.8, 0]), orb(36, 52, 14, 24, [0, 1.9, 0])];
const camera = (t: number): Key => (t < 14.2 ? camAt(KA, t) : t < 24.6 ? camAt(KB, t) : camAt(KC, t));

// ---------- label ----------
type Lb = {a: number; b: number; text: string; sub?: string; at: V3 | ((e: number, e2: number) => V3); side: 'L' | 'R'; dy?: number};
const lift = (y: number, k: number): ((e: number) => V3) => (e) => [W / 2 - 0.1, y + e * k, D / 2];
const LABELS: Lb[] = [
  {a: 8.6, b: 14, text: 'Genteng', at: (e) => [1.2, 4.9 + e * OFF.genteng - 0.3, 0.9], side: 'R'},
  {a: 9.0, b: 14, text: 'Kuda-kuda kayu', at: (e) => [-1.8, 3.6 + e * OFF.kuda, 0.6], side: 'L'},
  {a: 9.4, b: 14, text: 'Ring balok', at: (e) => [W / 2, 3.2 + e * OFF.ring, D / 2], side: 'R'},
  {a: 9.8, b: 14, text: 'Dinding bata + kolom', at: (e) => [-W / 2, 1.8 + e * OFF.dinding, D / 2], side: 'L'},
  {a: 10.2, b: 14, text: 'Lantai', at: (e) => [W / 2 - 0.3, 0.25 + e * OFF.lantai, D / 2 - 0.4], side: 'R'},
  {a: 10.6, b: 14, text: 'Sloof', at: (e) => [-W / 2, 0.1 + e * OFF.sloof, D / 2], side: 'L'},
  {a: 11.0, b: 14, text: 'Pondasi batu kali', at: () => [W / 2 + 0.25, -0.25, D / 2 + 0.25], side: 'R'},
  {a: 17.6, b: 24.4, text: 'Cat', at: (_, g) => [SX + 0.4, 1.5, 2 * (0.07 + 0.34 * g)], side: 'L'},
  {a: 18.0, b: 24.4, text: 'Plester', at: (_, g) => [SX + 0.4, 1.2, 1 * (0.07 + 0.34 * g)], side: 'L'},
  {a: 18.4, b: 24.4, text: 'Bata', at: () => [SX + 0.4, 0.9, 0], side: 'L'},
  {a: 18.8, b: 24.4, text: 'Plester + cat dalam', at: (_, g) => [SX + 0.4, 0.6, -1.5 * (0.07 + 0.34 * g)], side: 'L'},
  {a: 19.6, b: 24.4, text: 'Kolom beton', at: (_, g) => [SX + 0.7 + 0.12 * g, 1.55, 0.08], side: 'R'},
  {a: 20.2, b: 24.4, text: 'Besi tulangan', at: (_, g) => [SX + 0.7 + 0.12 * g + 0.055, 0.7, 0.055], side: 'R'},
  {a: 26.0, b: 31.4, text: 'Beban atap', at: () => [0, 4.3, 0.8], side: 'R'},
  {a: 27.2, b: 31.4, text: 'Turun lewat kolom', at: () => [W / 2 - T / 2, 1.8, D / 2 - T / 2], side: 'L'},
  {a: 28.6, b: 31.4, text: 'Disebar pondasi ke tanah', at: () => [W / 2 + 0.25, -0.5, D / 2 + 0.3], side: 'R'},
];
const Label: React.FC<{l: Lb; t: number; e: number; e2: number; cam: Key}> = ({l, t, e, e2, cam}) => {
  const i = r(t, l.a, l.a + 0.35, Easing.out(Easing.cubic)), o = 1 - r(t, l.b - 0.3, l.b);
  if (i * o <= 0.01) return null;
  const [px, py0] = proj(cam, typeof l.at === 'function' ? l.at(e, e2) : l.at), py = Math.max(260, Math.min(1330, py0 + (l.dy ?? 0)));
  const L = l.side === 'L', ex = L ? 70 : 1010, p = i * o;
  return (<>
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: p, pointerEvents: 'none'}}>
      <path d={`M ${L ? ex + 250 : ex - 250} ${py} L ${px} ${py0}`} stroke={C.aksen} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 * (1 - i)} />
      <circle cx={px} cy={py0} r={9} fill={C.aksen} stroke="#fff" strokeWidth={3} />
    </svg>
    <div style={{position: 'absolute', top: py - 36, [L ? 'left' : 'right']: L ? ex : 1080 - ex, padding: '10px 22px 12px', borderRadius: 18, background: 'rgba(252,250,245,0.96)', boxShadow: '0 8px 28px rgba(30,30,30,0.22)', fontFamily: 'Inter', fontWeight: 700, fontSize: 40, color: '#2a2a2e', whiteSpace: 'nowrap', opacity: p, transform: `translateX(${(L ? -1 : 1) * 40 * (1 - i)}px)`}}>{l.text}</div>
  </>);
};

const Kicker: React.FC<{t: number; a: number; b: number; text: string}> = ({t, a, b, text}) => {
  const p = r(t, a, a + 0.5, Easing.out(Easing.cubic)) * (1 - r(t, b - 0.4, b));
  if (p <= 0.01) return null;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 76, letterSpacing: -2, color: '#25252a', opacity: p, transform: `translateY(${(1 - p) * -24}px)`, textShadow: '0 2px 0 rgba(255,255,255,0.7)'}}>{text}</div>;
};

export const AnatomiRumah: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, cam = camera(t);
  const e = t < 14.2 ? r(t, 5, 10, Easing.inOut(Easing.cubic)) : 0, e2 = r(t, 16, 20.5, Easing.inOut(Easing.cubic));
  const showHouse = t < 14.2 || t >= 24.6, o = 1 - 0.78 * r(t, 24.8, 25.6) + 0.78 * r(t, 32, 33.2);
  const dip = Math.max(r(t, 13.5, 14.2), 0) * (t < 14.3 ? 1 : 1 - r(t, 14.3, 15)) + (t > 23.9 ? r(t, 23.9, 24.6) * (t < 24.7 ? 1 : 1 - r(t, 24.7, 25.4)) : 0);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#bcd8ee 0%,#e6eef0 55%,#f3e9d6 100%)'}}>
      <ThreeCanvas width={1080} height={1920} camera={{position: cam.pos, fov: 34}} gl={{alpha: true, antialias: true}} shadows>
        <Env intensity={0.8} /><Rig k={cam} />
        <hemisphereLight args={['#dbeaff', '#8a7a62', 0.5]} />
        <directionalLight position={[-6, 11, 7]} intensity={2.8} color="#fff4e0" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={12} shadow-camera-bottom={-6} shadow-camera-near={1} shadow-camera-far={40} shadow-bias={-0.0004} />
        <fog attach="fog" args={['#e8eef0', 30, 70]} />
        {showHouse && <Rumah e={e} o={o} />}
        {showHouse && <Beban t={t} />}
        {!showHouse && <Potongan e={e2} />}
      </ThreeCanvas>
      {LABELS.map((l) => <Label key={l.text} l={l} t={t} e={e} e2={e2} cam={cam} />)}
      <Kicker t={t} a={0.4} b={4.6} text="ISI RUMAH" />
      <Kicker t={t} a={5.2} b={13} text="Dibongkar lapis demi lapis" />
      <Kicker t={t} a={15} b={24} text="Potongan dinding" />
      <Kicker t={t} a={25.3} b={31.6} text="Jalur beban" />
      <Kicker t={t} a={33.4} b={36} text="Fakta Rumah" />
      <AbsoluteFill style={{background: '#fbf8f1', opacity: dip, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
