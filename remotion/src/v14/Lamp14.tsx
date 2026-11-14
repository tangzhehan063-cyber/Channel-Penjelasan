// Objek 3D prosedural video #14 (lampu pijar vs LED), gaya diorama kertas, kamera 2,5D ortografis.
// Dipakai oleh Video14.tsx. Palet turunan P13 (identitas channel: latar krem, objek warna pekat).
import {Edges} from '@react-three/drei';
import {P13} from '../v13/Mood13';

export const P14 = {...P13, yellow: '#f6c445', glow: '#ffe08a', hot: '#ff8a3d', metal: '#a9a59a', ledBody: '#f3efe6', fin: '#8f8b82', elec: '#5d8fd6'};

// halo cahaya di belakang lampu (bidang bulat transparan)
const Halo: React.FC<{k: number; r?: number; color?: string}> = ({k, r = 1.25, color = P14.glow}) =>
  k <= 0.01 ? null : (
    <group position={[0, 0.95, -0.35]}>
      <mesh><circleGeometry args={[r, 48]} /><meshBasicMaterial color={color} transparent opacity={0.18 * k} toneMapped={false} depthWrite={false} /></mesh>
      <mesh><circleGeometry args={[r * 0.62, 48]} /><meshBasicMaterial color={color} transparent opacity={0.28 * k} toneMapped={false} depthWrite={false} /></mesh>
    </group>
  );

// sekrup/pangkal lampu (E27 disederhanakan)
const Screw: React.FC = () => (
  <group>
    {[0.0, 0.1, 0.2].map((y, i) => (
      <mesh key={i} position={[0, 0.08 + y, 0]} castShadow><cylinderGeometry args={[0.27, 0.27, 0.07, 32]} /><meshPhysicalMaterial color={P14.metal} metalness={0.5} roughness={0.45} /><Edges color="#1c1c1e" lineWidth={1.5} /></mesh>
    ))}
    <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.12, 0.12, 0.05, 24]} /><meshPhysicalMaterial color="#2a2522" roughness={0.6} /></mesh>
  </group>
);

// lampu pijar: kaca bulat bening, kawat pijar (kumparan) yang menyala sesuai glow (0..1)
export const Incandescent: React.FC<{x?: number; glow: number; cut?: boolean}> = ({x = 0, glow, cut = false}) => {
  const col = glow > 0.5 ? P14.glow : glow > 0.15 ? P14.hot : '#5a4a3f';
  return (
    <group position={[x, 0, 0]}>
      <Halo k={glow} />
      <Screw />
      <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.2, 0.27, 0.3, 32]} /><meshPhysicalMaterial color={P14.glassHi} transparent opacity={0.55} roughness={0.15} /></mesh>
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.55, 40, 32, 0, Math.PI * 2, 0, cut ? Math.PI * 0.62 : Math.PI]} />
        <meshPhysicalMaterial color={P14.glassHi} transparent opacity={0.32} roughness={0.08} clearcoat={1} side={2} />
      </mesh>
      {/* tiang penyangga + kawat pijar */}
      {[-0.07, 0.07].map((dx) => <mesh key={dx} position={[dx, 0.7, 0]}><cylinderGeometry args={[0.012, 0.012, 0.5, 8]} /><meshBasicMaterial color="#6b6760" /></mesh>)}
      <group position={[0, 0.95, 0]}>
        {Array.from({length: 7}, (_, i) => (
          <mesh key={i} position={[-0.09 + i * 0.03, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.035, 0.012, 8, 14]} /><meshBasicMaterial color={col} toneMapped={false} /></mesh>
        ))}
      </group>
    </group>
  );
};

// lampu LED: kap buram putih, chip kuning kecil di dalam, sirip pendingin
export const LedLamp: React.FC<{x?: number; glow: number; cut?: boolean; chipPulse?: number}> = ({x = 0, glow, cut = false, chipPulse = 0}) => (
  <group position={[x, 0, 0]}>
    <Halo k={glow} />
    <Screw />
    {/* sirip pendingin */}
    {[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.42 + i * 0.07, 0]} castShadow><cylinderGeometry args={[0.3 - i * 0.015, 0.3 - i * 0.015, 0.045, 32]} /><meshPhysicalMaterial color={P14.fin} roughness={0.55} /><Edges color="#1c1c1e" lineWidth={1.2} /></mesh>)}
    <mesh position={[0, 0.9, 0]}>
      <sphereGeometry args={[0.5, 40, 32, 0, Math.PI * 2, 0, cut ? Math.PI * 0.6 : Math.PI]} />
      <meshPhysicalMaterial color={P14.ledBody} transparent opacity={cut ? 0.4 : 0.85} roughness={0.55} side={2} />
    </mesh>
    {/* chip */}
    <group position={[0, 0.78, 0]}>
      <mesh><boxGeometry args={[0.3, 0.07, 0.2]} /><meshBasicMaterial color={glow > 0.2 ? P14.glow : '#c9c2a8'} toneMapped={false} /></mesh>
      <mesh position={[0, 0.03, 0]} scale={1 + 0.12 * chipPulse}><boxGeometry args={[0.24, 0.04, 0.15]} /><meshBasicMaterial color={P14.yellow} toneMapped={false} /></mesh>
    </group>
  </group>
);
