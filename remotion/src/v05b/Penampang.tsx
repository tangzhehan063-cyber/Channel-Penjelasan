// Video #5B: SATU objek penampang tembok (bata | plester | cat) dipakai di semua adegan. Satuan: 1 unit = 1 m.
// Penyederhanaan visual: ketebalan tembok dilebihkan agar lapisannya terbaca; semua gerak dari props (frame), tanpa useFrame/random.
import {useMemo} from 'react';
import * as THREE from 'three';
import {Ink, useWaterMat} from '../v05/Tembok';

const phys = (color: string, o: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
  new THREE.MeshPhysicalMaterial({color, roughness: 0.42, clearcoat: 0.55, clearcoatRoughness: 0.32, sheen: 0.6, sheenColor: new THREE.Color('#ffd6cc'), sheenRoughness: 0.6, ...o});
const setU = (m: THREE.ShaderMaterial, level: number, time: number, op = 1) => { m.uniforms.uLevel.value = level; m.uniforms.uTime.value = time; m.uniforms.uOp.value = op; };
function facePlane(w: number, h: number, axis: 'z' | 'x', x0: number, z0: number) {
  const g = new THREE.PlaneGeometry(w, h, 1, 1);
  if (axis === 'x') g.rotateY(Math.PI / 2);
  g.translate(x0, h / 2, z0);
  return g;
}
const hash = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };


// serpihan cat bersudut (segitiga/segi-lima), engsel di tepi atas; koordinat (z, y) relatif engsel. Bentuk di bidang x-y lalu diputar ke muka luar (+x).
const shard = (pts: [number, number][]) => { const sh = new THREE.Shape(pts.map(([z, y]) => new THREE.Vector2(-z, y))); const g = new THREE.ShapeGeometry(sh); g.rotateY(Math.PI / 2); return g; };
const TRI = (w: number, h: number): [number, number][] => [[-w / 2, 0], [w / 2, 0], [w * 0.12, -h]];
const PENTA: [number, number][] = [[-0.2, 0], [0.2, 0], [0.24, -0.22], [0.04, -0.46], [-0.18, -0.26]];
const LIFT: [number, number, number, number][] = [[-0.22, 0.8, 0.26, 0.34], [0.08, 0.7, 0.3, 0.4], [0.28, 0.5, 0.22, 0.3], [-0.12, 0.42, 0.24, 0.3], [0.3, 0.82, 0.18, 0.22]];

export const H = 2.4, ZH = 0.4;                 // tinggi tembok, setengah lebar irisan
export const X0 = -0.6, X1 = 0.2, X2 = 0.34, X3 = 0.37;  // batas: bata | plester | cat
export const FACE = ZH + 0.006;                  // muka potong
export const OUT = X3 + 0.004;                   // muka luar (cat)

// retakan campuran: ruas lurus, belokan siku dan lancip bergantian, meruncing; koordinat (z, y)
export type Crack = {pts: [number, number][]; w: number};
export function makeCrack(seed: number, z: number, y: number, base: number, len: number, w: number): Crack {
  const pts: [number, number][] = [[z, y]]; let tot = 0, sign = hash(seed) > 0.5 ? 1 : -1, i = 0;
  while (tot < len) {
    const step = 0.05 + hash(seed + i * 3.1) * 0.05; sign = -sign;
    const dev = (30 + hash(seed + i * 7.7) * 65) * Math.PI / 180;
    const a = base + sign * dev; z += Math.cos(a) * step; y += Math.sin(a) * step; pts.push([z, y]); tot += step; i++;
  }
  return {pts, w};
}
export const CRACKS: Crack[] = [makeCrack(2, 0.0, 1.25, Math.PI / 2, 0.5, 0.022), makeCrack(5, 0.04, 0.75, -Math.PI / 2, 0.5, 0.022), makeCrack(9, -0.18, 1.17, 2.2, 0.3, 0.018), makeCrack(14, 0.18, 0.83, -0.9, 0.3, 0.018)];


export type PState = {
  t: number; level: number; waterOp?: number; bubbles?: number; peel?: number; coat?: number; trasram?: number; stain?: number;
  salt?: number; bulge?: number; crack?: number; flakes?: number;
};

export const Penampang: React.FC<PState> = ({t, level, waterOp = 1, bubbles = 0, peel = 0, coat = 0, trasram = 0, stain = 0, salt = 0, bulge = 0, crack = 0, flakes = 0}) => {
  const m = useMemo(() => ({
    brick: phys('#9b1c16', {sheen: 0, clearcoat: 0.12, roughness: 0.75}), mortar: phys('#fbe6de', {roughness: 0.7, clearcoat: 0.1}), plaster: phys('#f39a85', {roughness: 0.5, clearcoat: 0.4}),
    paint: phys('#fff7ea', {roughness: 0.3, clearcoat: 0.9, side: THREE.DoubleSide}), under: phys('#d9806c', {roughness: 0.8, clearcoat: 0.1, side: THREE.DoubleSide}), coat: phys('#7e2a20', {roughness: 0.25, clearcoat: 1}), tras: phys('#6fae6a', {roughness: 0.35, clearcoat: 0.8, sheen: 0}),
    ground: phys('#b9b1a6', {roughness: 0.9, clearcoat: 0, sheen: 0}), gw: phys('#2f8fe6', {roughness: 0.1, clearcoat: 1, transparent: true, opacity: 0.8, sheen: 0}),
    salt: phys('#ffffff', {roughness: 0.15, clearcoat: 1, sheen: 0, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0.25}), ink: new THREE.MeshBasicMaterial({color: '#1c1c1e'}),
  }), []);
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const dome = useMemo(() => new THREE.SphereGeometry(1, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const oct = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);
  const tri = useMemo(() => LIFT.map(([, , w, h]) => shard(TRI(w, h))), []);
  const penta = useMemo(() => shard(PENTA), []);
  const geo = useMemo(() => ({
    front: facePlane(X3 - X0 + 0.01, H, 'z', (X0 + X3) / 2, FACE + 0.004), outer: facePlane(2 * ZH, H, 'x', OUT + 0.004, 0), stain: facePlane(2 * ZH, H, 'x', OUT + 0.006, 0),
  }), []);
  const wF = useWaterMat(), wO = useWaterMat(), st = useWaterMat('#fff', true);
  setU(wF, level, t, waterOp); setU(wO, level, t + 0.7, waterOp * 0.34); setU(st, 0.48, t, stain);
  const tr = Math.min(1, trasram * 1.2);
  const nSeg = (c: Crack) => c.pts.length - 1;
  return (
    <group>
      {/* tanah + air tanah */}
      <mesh geometry={box} material={m.ground} position={[0, -0.2, 0]} scale={[3.0, 0.4, 2.0]} /><Ink p={[0, -0.2, 0]} s={[3.0, 0.4, 2.0]} />
      <mesh geometry={box} material={m.gw} position={[0, -0.27, 0.0]} scale={[3.02, 0.2, 2.02]} />
      {/* bata (inti) + garis adukan di muka potong */}
      <mesh geometry={box} material={m.brick} position={[(X0 + X1) / 2, H / 2, 0]} scale={[X1 - X0, H, 2 * ZH]} /><Ink p={[(X0 + X1) / 2, H / 2, 0]} s={[X1 - X0, H, 2 * ZH]} w={0.03} />
      {Array.from({length: 14}, (_, i) => <mesh key={i} geometry={box} material={m.mortar} position={[(X0 + X1) / 2, 0.16 * (i + 1), FACE - 0.004]} scale={[X1 - X0 + 0.002, 0.02, 0.012]} />)}
      <mesh geometry={box} material={m.plaster} position={[(X1 + X2) / 2, H / 2, 0]} scale={[X2 - X1, H, 2 * ZH]} />
      <mesh geometry={box} material={m.paint} position={[(X2 + X3) / 2, H / 2, 0]} scale={[X3 - X2, H, 2 * ZH]} />
      {/* cat ngelupas bawah: serpihan segitiga terangkat dari tepi atas, plester terlihat di bawahnya; lalu jatuh */}
      {LIFT.map(([z, yTop, w, h], i) => { const g = THREE.MathUtils.clamp(bubbles * 1.6 - i * 0.1, 0, 1); if (g <= 0) return null;
        const fall = THREE.MathUtils.clamp(peel * 1.4 - i * 0.18 - 0.3, 0, 1);
        return (<group key={i} position={[X3 + 0.002, yTop - fall * fall * 0.5, z]}>
          {fall < 0.01 && <mesh geometry={tri[i]} material={m.under} position={[0.001, 0, 0]} />}
          <group rotation={[0, 0, g * 0.75 + fall * 0.5]} position={[fall * 0.18, 0, 0]}><mesh geometry={tri[i]} material={m.paint} scale={1 - 0.15 * fall} /></group>
        </group>); })}
      {/* kristal garam di antar muka plester-cat (terlihat di muka potong) + gelembung besar */}
      {Array.from({length: 34}, (_, i) => { const g = THREE.MathUtils.clamp(salt * 1.4 - hash(i + 11) * 0.4, 0, 1);
        return g > 0 ? <mesh key={i} geometry={oct} material={m.salt} position={[X2 + (hash(i) - 0.5) * 0.03, 0.88 + hash(i + 4) * 0.26, FACE + 0.004 + hash(i + 8) * 0.03]} rotation={[hash(i) * 3, hash(i + 2) * 3, 0]} scale={(0.012 + hash(i + 3) * 0.02) * g} /> : null; })}
      {bulge > 0 && <group position={[X3 + 0.002, 1.2, 0]}><mesh geometry={penta} material={m.under} position={[0.001, 0, 0]} /><group rotation={[0, 0, bulge * 0.5]}><mesh geometry={penta} material={m.paint} /></group></group>}
      {/* retakan campuran tumbuh ruas demi ruas */}
      {crack > 0 && CRACKS.map((c, ci) => { const n = nSeg(c), upto = crack * n * 1.15 - ci * 0.3;
        return c.pts.slice(0, -1).map((p, k) => { const q = c.pts[k + 1], g = THREE.MathUtils.clamp(upto - k, 0, 1); if (g <= 0) return null;
          const dz = (q[0] - p[0]) * g, dy = (q[1] - p[1]) * g, L = Math.hypot(dz, dy), w = Math.max(0.004, c.w * (1 - 0.8 * k / n));
          return <mesh key={ci + '-' + k} geometry={box} material={m.ink} position={[OUT + 0.012, p[1] + dy / 2, p[0] + dz / 2]} rotation={[Math.atan2(dz, dy), 0, 0]} scale={[0.004, L, w]} />; }); })}
      {flakes > 0 && [[0.1, 0.78, 0.0], [-0.25, 0.7, 0.6]].map(([z, y, d], i) => { const p = THREE.MathUtils.clamp(flakes * 1.5 - d * 0.5, 0, 1), fall = Math.max(0, p - 0.4) / 0.6; if (p <= 0) return null;
        return <mesh key={'f' + i} geometry={tri[i + 1]} material={m.paint} position={[X3 + 0.03 + fall * 0.2, y - fall * fall * 0.6, z]} rotation={[0, 0, p * 0.9]} />; })}
      {/* cat kedap (kaki) + trasram (pita sage menembus ketebalan) */}
      {coat > 0 && <mesh geometry={box} material={m.coat} position={[X3 + 0.008, 0.3 * coat, 0]} scale={[0.016, 0.6 * coat, 2 * ZH + 0.02]} />}
      {coat > 0 && <mesh geometry={box} material={m.coat} position={[(X0 + X3) / 2, 0.3 * coat, FACE + 0.002]} scale={[X3 - X0 + 0.004, 0.6 * coat, 0.014]} />}
      {tr > 0 && <mesh geometry={box} material={m.tras} position={[(X0 + X3) / 2 - 0.01, 0.15 * tr, 0]} scale={[X3 - X0 + 0.06, 0.3 * tr, 2 * ZH + 0.06]} />}
      {stain > 0 && <mesh geometry={geo.stain} material={st} />}
      {level > 0.001 && <mesh geometry={geo.front} material={wF} />}
      {level > 0.001 && <mesh geometry={geo.outer} material={wO} />}
    </group>
  );
};
