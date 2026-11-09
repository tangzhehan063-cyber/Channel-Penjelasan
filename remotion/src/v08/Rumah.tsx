// Video #8 "Bunyi Tek di Atap Bukan Hantu": objek 3D prosedural (rumah, seng gelombang, gording + sekrup).
// Satuan bebas, bukan skala nyata. Pemuaian dilebih-lebihkan agar terlihat (penyederhanaan visual).
import {useMemo} from 'react';
import * as THREE from 'three';
import {M as M7, Box, Profile, Screw} from '../v07/Atap';

export const K8 = {wall: '#efe6d6', wallDark: '#d8cbb4', door: '#8a5528', glass: '#ffd77a', glassOff: '#5b6b85', seng: '#b9c0c8', hot: '#ef7663', cold: '#5d8fd6', ink: '#1c1c1e'};
const phys = (color: string, o: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
  new THREE.MeshPhysicalMaterial({color, roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.25, ...o});
export const M8 = {wall: phys(K8.wall, {roughness: 0.85, clearcoat: 0}), wallDark: phys(K8.wallDark, {roughness: 0.85, clearcoat: 0}), door: phys(K8.door, {roughness: 0.7, clearcoat: 0.1})};

const lerpC = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), Math.max(0, Math.min(1, k)));
/** warna seng: heat 0 = netral, >0 menuju koral (panas), <0 menuju biru (dingin) */
export const sengColor = (heat: number) => (heat >= 0 ? lerpC(K8.seng, K8.hot, heat) : lerpC(K8.seng, K8.cold, -heat));

/* Lembar seng gelombang di bidang xz, gelombang sepanjang x (punggung gelombang searah z). */
export const Seng: React.FC<{W?: number; D?: number; amp?: number; pitch?: number; heat?: number}> = ({W = 3, D = 1.6, amp = 0.05, pitch = 0.22, heat = 0}) => {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(W, D, Math.round(W / pitch) * 10, 1);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) p.setY(i, amp * Math.sin((p.getX(i) / pitch) * Math.PI * 2));
    g.computeVertexNormals();
    return g;
  }, [W, D, amp, pitch]);
  const mat = useMemo(() => phys(K8.seng, {metalness: 0.7, roughness: 0.32, side: THREE.DoubleSide}), []);
  mat.color.copy(sengColor(heat));
  return (
    <group>
      <mesh geometry={geo} material={mat} />
      {/* tepi tinta: bingkai tipis di bawah lembar */}
      <Box p={[0, -amp - 0.012, 0]} s={[W + 0.03, 0.012, D + 0.03]} m={M7.inkFront} ink={0} />
    </group>
  );
};

/* Potongan atap close-up: gording (profil C) di bawah, seng di atas, sekrup di puncak gelombang.
   stretch = skala panjang (1 = normal), shake = getar tegang, slip = geser seng setelah "lepas". */
export const RoofCut: React.FC<{heat?: number; stretch?: number; shake?: number; slip?: number; t?: number; screws?: number}> = ({heat = 0, stretch = 1, shake = 0, slip = 0, t = 0, screws = 1}) => {
  const jit = shake * 0.012 * Math.sin(t * 90);
  const pitch = 0.22;
  return (
    <group>
      <group position={[0, -0.42, 0]} scale={[stretch, 1, 1]}><Profile L={3.4} /></group>
      <group position={[slip + jit, 0, 0]} scale={[stretch, 1, 1]}>
        <Seng W={3.2} D={1.8} heat={heat} pitch={pitch} />
      </group>
      {[-1.1, 0, 1.1].map((x, i) => <Screw key={i} p={[x * stretch + pitch / 4, 0.065, 0]} o={screws} />)}
    </group>
  );
};

/* Rumah sederhana: dinding, pintu, jendela (menyala malam), atap pelana seng. */
export const House: React.FC<{heat?: number; night?: number; glow?: number}> = ({heat = 0, night = 0, glow = 0}) => {
  const W = 3.0, H = 1.5, D = 2.2, rise = 0.95, slope = Math.atan2(rise, D / 2 + 0.25), len = Math.hypot(rise, D / 2 + 0.25);
  const glass = useMemo(() => new THREE.MeshBasicMaterial({color: K8.glass}), []);
  glass.color.copy(lerpC(K8.glassOff, K8.glass, glow));
  return (
    <group>
      <Box p={[0, H / 2, 0]} s={[W, H, D]} m={M8.wall} ink={0.03} />
      {/* segitiga pelana depan & belakang */}
      {[D / 2, -D / 2].map((z, i) => (
        <mesh key={i} position={[0, H, z * 0.999]} material={M8.wallDark}>
          <shapeGeometry args={[(() => { const s = new THREE.Shape(); s.moveTo(-W / 2, 0); s.lineTo(W / 2, 0); s.lineTo(0, rise * 0.92); s.closePath(); return s; })()]} />
        </mesh>
      ))}
      <Box p={[-0.65, 0.5, D / 2 + 0.01]} s={[0.55, 1.0, 0.04]} m={M8.door} ink={0.02} />
      <Box p={[0.7, 0.85, D / 2 + 0.01]} s={[0.7, 0.55, 0.04]} m={glass} ink={0.03} />
      <Box p={[0.7, 0.85, D / 2 + 0.035]} s={[0.04, 0.55, 0.01]} m={M7.inkFront} ink={0} />
      {/* atap: dua bidang seng */}
      {[1, -1].map((sd) => (
        <group key={sd} position={[0, H + rise / 2 + 0.02, sd * (D / 4 + 0.125)]} rotation={[sd * slope, 0, 0]}>
          <Seng W={W + 0.5} D={len + 0.08} heat={heat} amp={0.035} pitch={0.18} />
        </group>
      ))}
      <Box p={[0, H + rise - 0.02, 0]} s={[W + 0.55, 0.06, 0.12]} m={M7.screw} ink={0.02} />
      {night > 0 && <pointLight position={[0.7, 0.85, D / 2 + 0.6]} intensity={2.5 * glow} distance={3} color={K8.glass} />}
    </group>
  );
};
