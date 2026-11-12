// Video #13 (remake #5) "Tembokmu Minum Air": tembok diorama kertas (Gaya B halus, seperti #10).
// Satuan meter. Penyederhanaan visual: air naik rata bergelombang; skala tinggi dilebihkan.
import * as THREE from 'three';
import {Easing, interpolate} from 'remotion';
import {MT, KT, PBox} from '../v10/Tangga';

const mat = (c: string, o = 1, rough = 0.9) => new THREE.MeshStandardMaterial({color: c, roughness: rough, metalness: 0, transparent: o < 1, opacity: o});
export const M13 = {
  brick: mat('#f27a63', 1, 0.85), brickDeep: mat('#c95a46', 1, 0.85), mortar: mat('#e9e3d6'),
  water: mat('#1f7fdc', 0.5, 0.6), waterSoft: mat('#1f7fdc', 0.22, 0.6), bare: mat('#cfc8b8'), waterSolid: mat('#1f7fdc', 1, 0.5), soil: mat('#cbb89a', 1, 1), soilDark: mat('#a8916f', 1, 1),
  paint: mat('#f0d9a0', 1, 0.95), salt: mat('#ffffff', 1, 0.6), dark: mat('#4a4f5c', 1, 0.7), sage: MT.sage, ink: MT.ink, side: MT.side, paper: MT.paper,
};
type V3 = [number, number, number];
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const spring = Easing.bezier(0.34, 1.28, 0.64, 1);
export const W = {w: 1.6, h: 1.5, t: 0.2, bh: 0.075, bw: 0.24, cutX: 0.25};

/* lapisan air: tepi atas bergelombang halus (shape), dua lapis = pudar lembut ke atas */
const DampShape: React.FC<{a: number; b: number; z: number; level: number; t: number; m: THREE.Material; ph?: number}> = ({a, b, z, level, t, m, ph = 0}) => {
  const sh = new THREE.Shape(); sh.moveTo(a, 0);
  const n = 48, amp = 0.03 * Math.min(1, level * 4);
  for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n; sh.lineTo(x, level + amp * (Math.sin(x * 7 + t * 1.2 + ph) + 0.5 * Math.sin(x * 15 - t * 0.8 + ph))); }
  sh.lineTo(b, 0); sh.closePath();
  return <mesh position={[0, 0, z]} material={m}><shapeGeometry args={[sh]} /></mesh>;
};
const Damp: React.FC<{a: number; b: number; z: number; level: number; t: number}> = ({a, b, z, level, t}) => level <= 0.005 ? null : (
  <group><DampShape a={a} b={b} z={z} level={level * 1.12 + 0.02} t={t} m={M13.waterSoft} ph={2} /><DampShape a={a} b={b} z={z + 0.001} level={level} t={t} m={M13.water} /></group>
);

/* tembok: bata kertas koral + plester putih (dibuka di kanan = potongan), air naik, cat mengelupas, garam, trasram */
export const Wall: React.FC<{rise: number; level: number; t: number; peel?: number; salt?: number; seal?: number; trasram?: number; cut?: number}> = ({rise, level, t, peel = 0, salt = 0, seal = 0, trasram = 0, cut = 1}) => {
  const g = interpolate(rise, [0, 1], [0, 1], {...cl, easing: spring});
  if (g <= 0.001) return null;
  const rows = Math.round(W.h / W.bh), zf = W.t / 2;
  const cutL = W.w / 2 - W.cutX * cut; // plester berakhir di sini, kanan = bata terbuka
  const cap = trasram > 0 ? interpolate(trasram, [0, 1], [level, 0.12], cl) : level;
  const lv = Math.min(level, cap) + seal * 0.35;
  return (
    <group scale={[1, g, 1]}>
      {/* bata */}
      {Array.from({length: rows}, (_, r) => {
        const off = r % 2 ? W.bw / 2 : 0, n = Math.ceil(W.w / W.bw) + 1;
        return Array.from({length: n}, (_, c) => {
          const x0 = -W.w / 2 + c * W.bw - off, x1 = Math.min(W.w / 2, x0 + W.bw - 0.012), xa = Math.max(-W.w / 2, x0);
          if (x1 - xa < 0.02) return null;
          return <PBox key={`${r}-${c}`} p={[(xa + x1) / 2, r * W.bh + W.bh / 2, 0]} s={[x1 - xa, W.bh - 0.012, W.t - 0.02]} m={(r + c) % 5 ? M13.brick : M13.brickDeep} />;
        });
      })}
      <PBox p={[0, W.h / 2, 0]} s={[W.w - 0.01, W.h - 0.005, W.t - 0.05]} m={M13.mortar} />
      {/* plester + cat (muka depan & belakang) */}
      <PBox p={[(-W.w / 2 + cutL) / 2, W.h / 2, zf + 0.008]} s={[cutL + W.w / 2, W.h, 0.016]} m={M13.paint} />
      <PBox p={[0, W.h / 2, -zf - 0.008]} s={[W.w, W.h, 0.016]} m={M13.paint} />
      <PBox p={[0, W.h + 0.01, 0]} s={[W.w + 0.02, 0.02, W.t + 0.04]} m={M13.side} />
      {/* tepi plester bertinta di garis potong */}
      <PBox p={[cutL, W.h / 2, zf + 0.017]} s={[0.006, W.h, 0.004]} m={M13.ink} />
      {/* air di plester dan di bata terbuka */}
      <Damp a={-W.w / 2} b={cutL} z={zf + 0.019} level={lv} t={t} />
      <Damp a={cutL + 0.004} b={W.w / 2} z={W.t / 2 - 0.006} level={lv} t={t + 1} />
      {/* cat kedap gelap (twist) */}
      {seal > 0 && <PBox p={[(-W.w / 2 + cutL) / 2, 0.2, zf + 0.024]} s={[(cutL + W.w / 2) * seal, 0.4, 0.008]} m={M13.dark} />}
      {/* trasram sage di kaki tembok */}
      {trasram > 0 && <PBox p={[0, 0.06, 0]} s={[W.w + 0.04, 0.12 * Math.min(1, trasram * 1.5), W.t + 0.06]} m={M13.sage} />}
      {/* cat mengelupas: serpih melengkung keluar */}
      {peel > 0 && [[-0.55, 0.2], [-0.25, 0.1], [0.0, 0.26], [-0.4, 0.4], [0.2, 0.14]].map(([x, y], i) => {
        const k = interpolate(peel, [i * 0.12, i * 0.12 + 0.5], [0, 1], {...cl, easing: spring});
        return k > 0 && <group key={i}>
          <PBox p={[x, y, zf + 0.0215]} s={[0.17 * k, 0.13 * k, 0.002]} m={M13.bare} />
          <group position={[x, y + 0.065, zf + 0.024]} rotation={[k * 1.25, 0, (i % 2 ? 1 : -1) * 0.2 * k]}><PBox p={[0, -0.065, 0]} s={[0.17, 0.13, 0.005]} m={M13.paint} /></group>
        </group>;
      })}
      {/* garam: kristal tumbuh + gelembung cat */}
      {salt > 0 && <group position={[-0.25, 0.3, zf + 0.02]}>
        {Array.from({length: 14}, (_, i) => { const a = i * 2.4, rr = 0.03 + (i % 4) * 0.025, k = interpolate(salt, [i * 0.04, i * 0.04 + 0.35], [0, 1], {...cl, easing: spring}); return k > 0 && <PBox key={i} p={[Math.cos(a) * rr, Math.sin(a) * rr * 0.8, 0.01]} s={[0.03 * k, 0.03 * k, 0.03 * k]} r={[i, i * 0.7, i * 1.3]} m={M13.salt} />; })}
        <mesh position={[0, 0, 0.012]} scale={[0.13, 0.11, 0.05 * interpolate(salt, [0.3, 1], [0, 1], cl)]} material={M13.paint} castShadow><sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
      </group>}
    </group>
  );
};

/* tanah: lempeng kertas berlapis + genangan air */
export const Ground: React.FC<{p: number}> = ({p}) => p > 0 ? (
  <group scale={[1, Math.max(0.01, p), 1]}>
    <PBox p={[0, -0.06, 0]} s={[2.4, 0.12, 1.0]} m={M13.soil} />
    <PBox p={[0, -0.16, 0]} s={[2.42, 0.08, 1.02]} m={M13.soilDark} />
    {[[-0.7, 0.3], [0.5, 0.35], [0.9, -0.3], [-0.9, -0.3]].map(([x, z], i) => <mesh key={i} position={[x, 0.002, z]} rotation={[-Math.PI / 2, 0, 0]} material={M13.waterSolid}><circleGeometry args={[0.12 + i * 0.02, 32]} /></mesh>)}
  </group>
) : null;

/* tisu kertas berdiri di gelas air, biru merambat naik */
export const Tissue: React.FC<{p: number; level: number}> = ({p, level}) => p > 0 ? (
  <group position={[1.0, 0, 0.5]} scale={[1, interpolate(p, [0, 1], [0.01, 1], {...cl, easing: spring}), 1]}>
    <mesh position={[0, 0.09, 0]} material={M13.paper} castShadow receiveShadow><cylinderGeometry args={[0.11, 0.09, 0.18, 32, 1, true]} /></mesh>
    <mesh position={[0, 0.07, 0]} material={M13.waterSolid}><cylinderGeometry args={[0.1, 0.085, 0.13, 32]} /></mesh>
    <PBox p={[0, 0.35, 0]} s={[0.12, 0.62, 0.006]} m={M13.paper} r={[0, 0, 0.04]} />
    <mesh position={[0, (0.05 + level) / 2, 0.005]} scale={[0.12, 0.05 + level, 0.004]} rotation={[0, 0, 0.04]} material={M13.water}><boxGeometry /></mesh>
  </group>
) : null;

/* meteran kertas berdiri di samping tembok */
export const Ruler: React.FC<{p: number; mark: number}> = ({p, mark}) => p > 0 ? (
  <group position={[-0.95, 0, 0.15]} scale={[1, interpolate(p, [0, 1], [0.01, 1], {...cl, easing: spring}), 1]}>
    <PBox p={[0, 0.6, 0]} s={[0.1, 1.2, 0.02]} m={M13.paper} />
    {Array.from({length: 13}, (_, i) => <PBox key={i} p={[0.03, i * 0.1, 0.012]} s={[i % 5 ? 0.03 : 0.06, 0.008, 0.004]} m={M13.ink} />)}
    <PBox p={[0.02, mark, 0.014]} s={[0.16, 0.016, 0.006]} m={MT.coral} />
  </group>
) : null;
export {KT};
