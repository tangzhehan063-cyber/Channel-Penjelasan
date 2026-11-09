// Video #9 "Rumah Tusuk Sate Bukan Bawa Sial": objek 3D prosedural (jalan lurus + pertigaan, mobil, pagar, pot, pohon, warung).
// Satuan ≈ meter tapi jarak dipadatkan (penyederhanaan visual). Rumah memakai House dari v08.
import {useMemo} from 'react';
import * as THREE from 'three';
import {M as M7, Box} from '../v07/Atap';
import {House} from '../v08/Rumah';

export const K9 = {ground: '#e9e2d3', road: '#4b4c52', line: '#f6f2ea', coral: '#ef7663', car: '#5d8fd6', carDark: '#3f6fb8', glass: '#cfe3f5', lamp: '#ffe08a', tyre: '#232326', pot: '#b8b4ad', trunk: '#8a5528', leaf: '#6fae6a', fence: '#fbfaf6', awn: '#ef7663'};
const phys = (color: string, o: Partial<THREE.MeshPhysicalMaterialParameters> = {}) => new THREE.MeshPhysicalMaterial({color, roughness: 0.55, clearcoat: 0.4, clearcoatRoughness: 0.3, ...o});
const basic = (color: string, o: Partial<THREE.MeshBasicMaterialParameters> = {}) => new THREE.MeshBasicMaterial({color, ...o});
export const M9 = {
  ground: phys(K9.ground, {roughness: 0.95, clearcoat: 0}), road: phys(K9.road, {roughness: 0.9, clearcoat: 0}), line: basic(K9.line), coral: basic(K9.coral),
  car: phys(K9.car, {clearcoat: 0.9}), carDark: phys(K9.carDark), glass: phys(K9.glass, {roughness: 0.15}), lamp: basic(K9.lamp), tyre: phys(K9.tyre, {roughness: 0.8, clearcoat: 0}),
  pot: phys(K9.pot, {roughness: 0.9, clearcoat: 0}), trunk: phys(K9.trunk, {roughness: 0.8}), leaf: phys(K9.leaf, {roughness: 0.7}), fence: phys(K9.fence, {roughness: 0.6}),
  awn: phys(K9.awn), white: phys('#fbfaf6'),
};

/* geometri dunia */
export const W = {front: 1.1, fenceZ: 1.75, crossA: 2.3, crossB: 3.9, roadHalf: 0.8, far: 46};

/* tanah + jalan pertigaan; dash = 0..1 garis putus koral digambar dari ujung jalan ke pintu; band = pita "20 m" [z0, z1, p] */
export const Ground: React.FC<{dash?: number; band?: [number, number, number]}> = ({dash = 0, band}) => {
  const zc = (W.crossA + W.crossB) / 2, wc = W.crossB - W.crossA, L = W.far - W.crossB;
  const n = 30, zEnd = W.far, zStart = 1.9, dashLen = (zEnd - zStart) / n;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 12]} material={M9.ground}><planeGeometry args={[80, 90]} /></mesh>
      <Box p={[0, 0.01, zc]} s={[60, 0.02, wc]} m={M9.road} ink={0} />
      <Box p={[0, 0.01, W.crossB + L / 2]} s={[W.roadHalf * 2, 0.02, L]} m={M9.road} ink={0} />
      {/* tepi putih jalan lurus */}
      {[-1, 1].map((s) => <Box key={s} p={[s * (W.roadHalf - 0.06), 0.025, W.crossB + L / 2]} s={[0.05, 0.01, L]} m={M9.line} ink={0} />)}
      <Box p={[0, 0.025, W.crossA + 0.06]} s={[60, 0.01, 0.05]} m={M9.line} ink={0} />
      {/* garis putus koral: dari jauh ke pintu */}
      {Array.from({length: n}, (_, i) => {
        if ((i + 1) / n > dash + 1e-6) return null;
        const z1 = zEnd - i * dashLen, z0 = z1 - dashLen * 0.55;
        return <Box key={i} p={[0, 0.03, (z0 + z1) / 2]} s={[0.12, 0.012, z1 - z0]} m={M9.coral} ink={0} />;
      })}
      {band && band[2] > 0 && (() => { const [a, b, p] = band; const z1 = a, z0 = a - (a - b) * p; return <Box p={[0, 0.028, (z0 + z1) / 2]} s={[W.roadHalf * 1.7, 0.01, Math.max(0.01, z1 - z0)]} m={M9.coral} ink={0} />; })()}
    </group>
  );
};

/* mobil kertas menghadap -z (ke rumah). z = pusat mobil. lights 0..1, beam = panjang sorot (0 = mati) */
export const Car: React.FC<{z: number; x?: number; lights?: number; beam?: number; pitch?: number}> = ({z, x = 0, lights = 0, beam = 0, pitch = 0}) => {
  const R = 0.14, spin = -z / R;
  const beamGeo = useMemo(() => { const g = new THREE.ConeGeometry(1, 1, 28, 1, true); g.rotateX(Math.PI / 2); g.translate(0, 0, -0.5); return g; }, []);
  const beamMat = useMemo(() => new THREE.MeshBasicMaterial({color: K9.lamp, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide}), []);
  beamMat.opacity = 0.24 * lights;
  return (
    <group position={[x, 0, z]} rotation={[pitch, 0, 0]}>
      <Box p={[0, 0.3, 0]} s={[0.62, 0.24, 1.12]} m={M9.car} ink={0.025} />
      <Box p={[0, 0.5, 0.08]} s={[0.54, 0.2, 0.6]} m={M9.carDark} ink={0.02} />
      <Box p={[0, 0.5, -0.23]} s={[0.5, 0.15, 0.02]} m={M9.glass} ink={0.015} />
      {[-0.2, 0.2].map((lx) => <Box key={lx} p={[lx, 0.32, -0.565]} s={[0.12, 0.07, 0.02]} m={lights > 0.05 ? M9.lamp : M9.white} ink={0.012} />)}
      {[[-0.31, -0.33], [0.31, -0.33], [-0.31, 0.33], [0.31, 0.33]].map(([wx, wz], i) => (
        <group key={i} position={[wx, R, wz]} rotation={[spin, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={M9.tyre}><cylinderGeometry args={[R, R, 0.08, 18]} /></mesh>
          <Box p={[0, 0, 0]} s={[0.085, 0.03, R * 1.6]} m={M7.screw} ink={0} />
        </group>
      ))}
      {beam > 0 && lights > 0 && [-0.2, 0.2].map((lx) => (
        <mesh key={lx} geometry={beamGeo} material={beamMat} position={[lx, 0.32, -0.57]} scale={[beam * 0.16, beam * 0.1, beam]} rotation={[-0.012, 0, 0]} />
      ))}
    </group>
  );
};

/* pagar kayu putih; wob = sudut goyang setelah tersenggol */
export const Fence: React.FC<{wob?: number}> = ({wob = 0}) => (
  <group position={[0, 0, W.fenceZ]} rotation={[wob, 0, 0]}>
    {Array.from({length: 13}, (_, i) => <Box key={i} p={[-1.8 + i * 0.3, 0.26, 0]} s={[0.07, 0.52, 0.05]} m={M9.fence} ink={0.015} />)}
    {[0.15, 0.38].map((y) => <Box key={y} p={[0, y, -0.035]} s={[3.7, 0.05, 0.03]} m={M9.fence} ink={0.012} />)}
  </group>
);

const pop = (p: number) => (p <= 0 ? 0 : p >= 1 ? 1 : 1 + 2.4 * Math.pow(p - 1, 3) + 1.4 * Math.pow(p - 1, 2));
/* pot beton (penahan) di depan pagar, muncul satu per satu */
export const Pots: React.FC<{p: number}> = ({p}) => (
  <group>
    {[-1.2, 0, 1.2].map((x, i) => { const s = pop(p * 3 - i); if (s <= 0) return null; return (
      <group key={i} position={[x, 0, W.fenceZ + 0.55]} scale={[s, s, s]}>
        <mesh position={[0, 0.22, 0]} material={M9.pot}><cylinderGeometry args={[0.26, 0.21, 0.44, 24]} /></mesh>
        <mesh position={[0, 0.45, 0]} material={M9.leaf}><sphereGeometry args={[0.2, 18, 12]} /></mesh>
      </group>); })}
  </group>
);
/* pohon di halaman, di jalur sorot lampu */
export const Tree: React.FC<{p: number; x?: number; z?: number}> = ({p, x = 0.75, z = 2.05}) => {
  const s = pop(p); if (s <= 0) return null;
  return (
    <group position={[x, 0, z]} scale={[s, s, s]}>
      <mesh position={[0, 0.5, 0]} material={M9.trunk}><cylinderGeometry args={[0.07, 0.1, 1.0, 12]} /></mesh>
      {[[0, 1.25, 0, 0.5], [-0.28, 1.05, 0.1, 0.34], [0.3, 1.1, -0.05, 0.36]].map(([a, b, c, r], i) => <mesh key={i} position={[a, b, c]} material={M9.leaf}><sphereGeometry args={[r, 20, 14]} /></mesh>)}
    </group>
  );
};
/* tenda warung + papan nama di depan rumah */
export const Awning: React.FC<{p: number}> = ({p}) => {
  const s = pop(p); if (s <= 0) return null;
  return (
    <group position={[0, 1.42, W.front + 0.3]} scale={[1, s, s]}>
      {Array.from({length: 8}, (_, i) => <Box key={i} p={[-1.4 + i * 0.4 + 0.2, 0, 0]} s={[0.4, 0.05, 0.62]} m={i % 2 ? M9.white : M9.awn} ink={0.012} r={[0.28, 0, 0]} />)}
      <Box p={[0, 0.36, -0.28]} s={[1.6, 0.36, 0.05]} m={M9.white} ink={0.025} />
    </group>
  );
};

export const Scene: React.FC<{car?: React.ComponentProps<typeof Car> | null; dash?: number; band?: [number, number, number]; wob?: number; pots?: number; tree?: number; shop?: number; glow?: number; night?: number}> = ({car, dash, band, wob, pots = 0, tree = 0, shop = 0, glow = 0, night = 0}) => (
  <group>
    <Ground dash={dash} band={band} />
    <group rotation={[0, 0, 0]}><House heat={0} night={night} glow={glow} /></group>
    <Fence wob={wob} />
    <Pots p={pots} />
    <Tree p={tree} />
    <Awning p={shop} />
    {car && <Car {...car} />}
  </group>
);
