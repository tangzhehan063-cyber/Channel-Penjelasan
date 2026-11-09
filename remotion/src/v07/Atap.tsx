// Video #7 "Baja Ringan vs Kayu: Musuhnya Beda": objek 3D prosedural.
// Satuan bebas (bukan skala nyata): profil C dilebih-lebihkan tebalnya agar terbaca (penyederhanaan visual).
import * as THREE from 'three';

export const K3 = {steel: '#c3c8ce', steelDark: '#8d949c', wood: '#c98a4b', woodDark: '#8a5528', tunnel: '#3b2414', coral: '#ef7663', rust: '#b5502c', ink: '#1c1c1e', wall: '#d9d7d3'};

const phys = (color: string, o: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
  new THREE.MeshPhysicalMaterial({color, roughness: 0.35, clearcoat: 0.7, clearcoatRoughness: 0.2, ...o});
export const M = {
  steel: phys(K3.steel, {metalness: 0.75, roughness: 0.3, clearcoat: 0.5}),
  wood: phys(K3.wood, {roughness: 0.65, clearcoat: 0.15}),
  woodDark: new THREE.MeshBasicMaterial({color: K3.woodDark}),
  tunnel: new THREE.MeshBasicMaterial({color: K3.tunnel}),
  coral: phys(K3.coral),
  rust: phys(K3.rust, {roughness: 0.9, clearcoat: 0}),
  wall: phys(K3.wall, {roughness: 0.8, clearcoat: 0}),
  screw: phys('#6b7178', {metalness: 0.8, roughness: 0.3}),
  ink: new THREE.MeshBasicMaterial({color: K3.ink, side: THREE.BackSide}),
  inkFront: new THREE.MeshBasicMaterial({color: K3.ink}),
};
const UBOX = new THREE.BoxGeometry(1, 1, 1);
type V3 = [number, number, number];

export const Box: React.FC<{p?: V3; s: V3; m: THREE.Material; ink?: number; r?: V3}> = ({p = [0, 0, 0], s, m, ink = 0.02, r}) => (
  <group position={p} rotation={r}>
    <mesh geometry={UBOX} material={m} scale={s} />
    {ink > 0 && <mesh geometry={UBOX} material={M.ink} scale={[s[0] + ink, s[1] + ink, s[2] + ink]} />}
  </group>
);

// ---------- profil C berbibir (lipped channel) ----------
// Penampang di bidang (y,z): badan tegak di z=0, sayap ke +z, bibir menekuk ke dalam. k = 0 lembar datar, 1 profil jadi.
export const PROF = {h: 0.75, b: 0.36, lip: 0.11, t: 0.035};
function sections(k: number) {
  const {h, b, lip} = PROF;
  const seg: {c: [number, number]; th: number; len: number}[] = [];
  const add = (from: [number, number], th: number, len: number): [number, number] => {
    const d: [number, number] = [Math.cos(th), Math.sin(th)];
    seg.push({c: [from[0] + d[0] * len / 2, from[1] + d[1] * len / 2], th, len});
    return [from[0] + d[0] * len, from[1] + d[1] * len];
  };
  seg.push({c: [0, 0], th: 0, len: h});
  const a = add([h / 2, 0], (Math.PI / 2) * k, b); add(a, Math.PI * k, lip);
  const c = add([-h / 2, 0], Math.PI - (Math.PI / 2) * k, b); add(c, Math.PI - Math.PI * k, lip);
  return seg;
}
const Section: React.FC<{k: number; len: number; m: THREE.Material}> = ({k, len, m}) => {
  const t = PROF.t;
  return (<>{sections(k).map((s, i) => (
    <group key={i} position={[0, s.c[0], s.c[1]]} rotation={[s.th, 0, 0]}>
      <mesh geometry={UBOX} material={m} scale={[len, s.len + t * 0.9, t]} />
      <mesh geometry={UBOX} material={M.ink} scale={[len, s.len + t * 0.9 + 0.016, t + 0.016]} />
    </group>
  ))}</>);
};

/* Batang profil C sepanjang sumbu x. sag = lendutan tengah (melengkung), n = jumlah potongan untuk lengkung. */
export const Profile: React.FC<{L?: number; k?: number; sag?: number; n?: number; m?: THREE.Material}> = ({L = 4, k = 1, sag = 0, n = 1, m = M.steel}) => {
  if (n <= 1 || sag === 0) return <Section k={k} len={L} m={m} />;
  const pieces = [];
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n, x = -L / 2 + u * L;
    const y = -sag * Math.sin(Math.PI * u), slope = -sag * Math.PI / L * Math.cos(Math.PI * u);
    pieces.push(<group key={i} position={[x, y, 0]} rotation={[0, 0, Math.atan(slope)]}><Section k={k} len={L / n + 0.01} m={m} /></group>);
  }
  return <>{pieces}</>;
};

// ---------- balok kayu dengan serat ----------
export const Beam: React.FC<{L?: number; H?: number; D?: number; grain?: boolean}> = ({L = 3.2, H = 0.55, D = 0.42, grain = true}) => (
  <group>
    <Box s={[L, H, D]} m={M.wood} ink={0.03} />
    {grain && [-0.17, -0.06, 0.05, 0.16].map((y, i) => (
      <mesh key={i} geometry={UBOX} material={M.woodDark} position={[(i % 2 ? 0.2 : -0.15), y * (H / 0.5), D / 2 + 0.002]} scale={[L * (0.62 + 0.08 * i), 0.012, 0.002]} />
    ))}
    {grain && [-0.12, 0.1].map((z, i) => (
      <mesh key={'t' + i} geometry={UBOX} material={M.woodDark} position={[i ? -0.3 : 0.25, H / 2 + 0.002, z]} scale={[L * 0.7, 0.002, 0.012]} />
    ))}
  </group>
);

// ---------- balok kayu dibelah: luar utuh, dalam berongga terowongan rayap ----------
const TUN: [number, number][][] = [
  [[-1.3, -0.12], [-0.8, -0.05], [-0.4, -0.14], [0.1, -0.02], [0.6, -0.1], [1.2, 0.0]],
  [[-1.1, 0.12], [-0.6, 0.15], [-0.2, 0.06], [0.3, 0.14], [0.9, 0.1]],
  [[-0.4, -0.14], [-0.3, 0.06]], [[0.6, -0.1], [0.5, 0.12]],
];
const along = (pts: [number, number][], u: number): [number, number] => {
  const L: number[] = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const d = ((u % 1) + 1) % 1 * L[L.length - 1];
  for (let i = 1; i < pts.length; i++) if (d <= L[i]) { const k = (d - L[i - 1]) / (L[i] - L[i - 1]); return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]; }
  return pts[pts.length - 1];
};
export const TermiteBeam: React.FC<{open: number; eaten: number; t: number}> = ({open, eaten, t}) => {
  const L = 3.2, H = 0.55, D = 0.42;
  return (
    <group>
      {/* belahan belakang: muka potong menghadap kamera (+z) */}
      <group position={[0, 0, -D / 4]}>
        <Box s={[L, H, D / 2]} m={M.wood} ink={0.03} />
        {TUN.map((pts, j) => pts.slice(1).map((q, i) => {
          const a = pts[i], dx = q[0] - a[0], dy = q[1] - a[1], len = Math.hypot(dx, dy);
          const show = Math.min(1, Math.max(0, eaten * 1.4 - j * 0.12));
          return <mesh key={`${j}-${i}`} geometry={UBOX} material={M.tunnel} position={[(a[0] + q[0]) / 2, (a[1] + q[1]) / 2, D / 4 + 0.003]} rotation={[0, 0, Math.atan2(dy, dx)]} scale={[(len + 0.06) * show, 0.07, 0.004]} />;
        }))}
        {eaten > 0.2 && TUN.slice(0, 2).flatMap((pts, j) => [0, 0.33, 0.66].map((o, i) => {
          const [x, y] = along(pts, o + t * 0.09 * (j ? -1 : 1));
          return <mesh key={`r${j}${i}`} material={M.coral} position={[x, y, D / 4 + 0.03]} scale={[0.07, 0.035, 0.03]}><sphereGeometry args={[1, 12, 8]} /></mesh>;
        }))}
      </group>
      {/* belahan depan: bergeser ke depan-atas lalu hilang */}
      {open < 1 && <group position={[0, 0.9 * open, D / 4 + 0.7 * open]} rotation={[-0.5 * open, 0, 0]}>
        <Box s={[L, H, D / 2]} m={M.wood} ink={0.03} />
        {[-0.17, -0.06, 0.05, 0.16].map((y, i) => <mesh key={i} geometry={UBOX} material={M.woodDark} position={[(i % 2 ? 0.2 : -0.15), y, D / 4 + 0.002]} scale={[L * (0.62 + 0.08 * i), 0.012, 0.002]} />)}
      </group>}
    </group>
  );
};

// ---------- timbangan jungkat-jungkit: kubus baja vs kubus kayu ukuran sama ----------
export const Seesaw: React.FC<{tilt: number; o?: number}> = ({tilt, o = 1}) => (
  <group scale={o}>
    <mesh material={M.wall} position={[0, -0.32, 0]}><cylinderGeometry args={[0.001, 0.36, 0.6, 3]} /></mesh>
    <mesh material={M.ink} position={[0, -0.32, 0]}><cylinderGeometry args={[0.02, 0.39, 0.64, 3]} /></mesh>
    <group rotation={[0, 0, tilt]}>
      <Box s={[3.0, 0.07, 0.6]} m={M.wall} />
      <Box p={[-1.1, 0.3, 0]} s={[0.52, 0.52, 0.52]} m={M.steel} ink={0.03} />
      <group position={[1.1, 0.3, 0]}><Box s={[0.52, 0.52, 0.52]} m={M.wood} ink={0.03} />
        <mesh geometry={UBOX} material={M.woodDark} position={[0, 0.08, 0.262]} scale={[0.4, 0.012, 0.002]} />
        <mesh geometry={UBOX} material={M.woodDark} position={[0, -0.09, 0.262]} scale={[0.34, 0.012, 0.002]} /></group>
    </group>
  </group>
);

// ---------- dudukan + sekrup + karat untuk adegan salah pasang ----------
export const Support: React.FC<{x: number}> = ({x}) => <Box p={[x, -0.75, 0.18]} s={[0.55, 0.7, 0.8]} m={M.wall} ink={0.025} />;
export const Screw: React.FC<{p: V3; o: number}> = ({p, o}) => {
  if (o <= 0.001) return null;
  return (
    <group position={[p[0], p[1] + (1 - o) * 0.6, p[2]]} scale={o}>
      <mesh material={M.screw}><cylinderGeometry args={[0.055, 0.055, 0.03, 18]} /></mesh>
      <mesh material={M.ink}><cylinderGeometry args={[0.068, 0.068, 0.045, 18]} /></mesh>
      <mesh material={M.inkFront} position={[0, 0.017, 0]} scale={[0.07, 0.004, 0.014]} geometry={UBOX} />
    </group>
  );
};
export const Rust: React.FC<{spots: V3[]; p: number}> = ({spots, p}) => (
  <>{spots.map((s, i) => {
    const k = Math.min(1, Math.max(0, p * 1.6 - i * 0.12));
    return k > 0 ? <mesh key={i} material={M.rust} position={s} scale={[0.09 * k * (1 + (i % 3) * 0.3), 0.012, 0.07 * k]}><sphereGeometry args={[1, 14, 8]} /></mesh> : null;
  })}</>
);
