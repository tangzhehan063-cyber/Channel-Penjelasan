// Kit Penjelasan / objek bergaya #21 (putih kapur, outline tinta tipis, warna peran): bank, rumah, tumpukan uang, gembok, jam bunga, map kontrak, kalender.
// Dibuat untuk video #22 (KPR). Semua menghadap +z, alas di y=0. warna = peran palet (accent = masalah, cool = bunga/uang, good = aman).
import {useMemo} from 'react';
import * as THREE from 'three';
import {Edges} from '@react-three/drei';
import {Bx, Cy, INK} from '../prim';
import type {V3} from '../waktu';

export const KAPUR = '#f1f1ec', BAJA = '#59616d', BIRU_MUDA = '#b4cdea';
type Warna = {accent: string; cool: string; good: string};

/** prisma segitiga (gable/pediment): lebar w sepanjang x, tinggi h, tebal d sepanjang z */
const Prisma: React.FC<{p: V3; w: number; h: number; d: number; c: string}> = ({p, w, h, d, c}) => {
  const geo = useMemo(() => { const s = new THREE.Shape([new THREE.Vector2(-w / 2, 0), new THREE.Vector2(w / 2, 0), new THREE.Vector2(0, h)]); const g = new THREE.ExtrudeGeometry(s, {depth: d, bevelEnabled: false}); g.translate(0, 0, -d / 2); return g; }, [w, h, d]);
  return <mesh geometry={geo} position={p} castShadow><meshStandardMaterial color={c} roughness={0.5} /><Edges color={INK} threshold={20} lineWidth={1.4} /></mesh>;
};

export const BankB: React.FC<{warna: Warna}> = ({warna}) => (
  <group>
    <Bx p={[0, 0.06, 0.05]} s={[2.1, 0.12, 1.05]} c={KAPUR} />
    <Bx p={[0, 0.18, 0.03]} s={[1.9, 0.12, 0.95]} c={KAPUR} />
    <Bx p={[0, 0.78, -0.1]} s={[1.5, 1.08, 0.5]} c={KAPUR} />
    <Bx p={[0, 0.5, 0.17]} s={[0.34, 0.62, 0.04]} c={warna.cool} />
    {[-0.66, -0.33, 0, 0.33, 0.66].map((x) => <Cy key={x} p={[x * 1.0 + (x === 0 ? 0 : 0), 0.8, 0.36]} rad={0.07} h={1.08} c={KAPUR} rot={[0, 0, 0]} />)}
    <Bx p={[0, 1.4, 0.04]} s={[1.9, 0.16, 0.92]} c={KAPUR} />
    <Prisma p={[0, 1.48, 0.04]} w={1.9} h={0.5} d={0.92} c={warna.cool} />
  </group>
);

export const RumahB: React.FC<{warna: Warna}> = ({warna}) => (
  <group>
    <Bx p={[0, 0.5, 0]} s={[1.7, 1.0, 1.15]} c={KAPUR} />
    <Prisma p={[0, 1.0, 0]} w={1.7} h={0.55} d={1.15} c={KAPUR} />
    {/* atap genteng terakota: dua bidang miring menutup pelana */}
    {[-1, 1].map((sd) => <Bx key={sd} p={[sd * 0.47, 1.3, 0]} s={[1.08, 0.1, 1.32]} c={warna.accent} rot={[0, 0, -sd * 0.495]} />)}
    <Bx p={[-0.4, 0.34, 0.585]} s={[0.36, 0.68, 0.04]} c={warna.cool} />
    <Bx p={[0.42, 0.55, 0.585]} s={[0.44, 0.38, 0.04]} c={BIRU_MUDA} />
    <Bx p={[0, 0.03, 0.75]} s={[1.9, 0.06, 0.4]} c={KAPUR} />
  </group>
);

/** tumpukan uang berikat: n ikat putih-kebiruan, ekstra = ikat aksen di atas (kenaikan) */
export const UangB: React.FC<{n: number; extra?: number; warna: Warna}> = ({n, extra = 0, warna}) => (
  <group>
    {Array.from({length: n + extra}, (_, i) => {
      const e = i >= n, y = 0.03 + i * 0.058, j = Math.sin(i * 12.9898) * 0.03;
      return (
        <group key={i} position={[j, y, j * 0.7]} rotation={[0, j * 1.6, 0]}>
          <Bx p={[0, 0, 0]} s={[0.95, 0.052, 0.5]} c={e ? warna.accent : warna.cool} />
          <Bx p={[0, 0, 0]} s={[0.14, 0.056, 0.51]} c={KAPUR} edge={false} />
        </group>
      );
    })}
  </group>
);

export const Gembok: React.FC<{warna: Warna}> = ({warna}) => (
  <group>
    <Bx p={[0, 0.3, 0]} s={[1.0, 0.6, 0.4]} c={warna.good} />
    <mesh position={[0, 0.6, 0]} castShadow><torusGeometry args={[0.28, 0.07, 14, 28, Math.PI]} /><meshStandardMaterial color={BAJA} roughness={0.4} metalness={0.4} /></mesh>
    <Cy p={[-0.28, 0.6, 0]} rad={0.07} h={0.0} c={BAJA} edge={false} rot={[0, 0, 0]} />
    <Cy p={[0, 0.32, 0.21]} rad={0.07} h={0.04} c={KAPUR} />
    <Bx p={[0, 0.2, 0.21]} s={[0.05, 0.14, 0.04]} c={KAPUR} />
  </group>
);

/** jam bunga: piringan putih dengan jarum aksen yang bergoyang (bunga mengambang) */
export const JamBunga: React.FC<{t: number; warna: Warna}> = ({t, warna}) => {
  const ang = 0.9 * Math.sin(t * 1.8) - 0.2;
  return (
    <group>
      <Bx p={[0, 0.06, 0]} s={[1.4, 0.12, 0.5]} c={KAPUR} />
      <Cy p={[0, 0.75, 0]} rad={0.7} h={0.2} c={KAPUR} />
      <mesh position={[0, 0.75, 0.12]} castShadow><torusGeometry args={[0.7, 0.05, 14, 40]} /><meshStandardMaterial color={warna.cool} roughness={0.5} /></mesh>
      {[-1.1, -0.55, 0, 0.55, 1.1].map((a) => <Bx key={a} p={[Math.sin(a) * 0.55, 0.75 + Math.cos(a) * 0.55, 0.12]} s={[0.05, 0.14, 0.03]} c={BAJA} rot={[0, 0, -a]} edge={false} />)}
      <group position={[0, 0.75, 0.16]} rotation={[0, 0, -ang]}><Bx p={[0, 0.25, 0]} s={[0.07, 0.5, 0.04]} c={warna.accent} /></group>
      <Cy p={[0, 0.75, 0.17]} rad={0.07} h={0.05} c={BAJA} />
    </group>
  );
};

export const COKLAT = '#b0804e', COKLAT_TUA = '#8c6238';
/** map coklat (kraft) bertumpuk: tab di sisi, tali pengikat putih, satu lembar kertas menyembul dari map teratas */
export const MapKontrak: React.FC<{warna: Warna}> = ({warna}) => (
  <group>
    {Array.from({length: 5}, (_, i) => {
      const j = Math.sin(i * 4.1) * 0.05;
      return (
        <group key={i} position={[j, 0.07 + i * 0.13, j * 0.6]} rotation={[0, j * 1.2, 0]}>
          <Bx p={[0, 0, 0]} s={[1.0, 0.12, 0.74]} c={COKLAT} />
          <Bx p={[0.26, 0, 0.375]} s={[0.34, 0.125, 0.03]} c={COKLAT_TUA} edge={false} />
          <Bx p={[0, 0.062, 0]} s={[1.0, 0.004, 0.06]} c={KAPUR} edge={false} />
        </group>
      );
    })}
    <Bx p={[-0.1, 0.72, -0.02]} s={[0.78, 0.012, 0.56]} c={KAPUR} rot={[0, 0.08, 0]} />
    <Bx p={[0.26, 0.58, 0.39]} s={[0.26, 0.03, 0.02]} c={warna.accent} edge={false} />
  </group>
);

export const KalenderB: React.FC<{warna: Warna}> = ({warna}) => (
  <group>
    <Bx p={[0, 0.7, 0]} s={[1.3, 1.0, 0.12]} c={KAPUR} rot={[-0.18, 0, 0]} />
    <Bx p={[0, 1.13, 0.045]} s={[1.3, 0.26, 0.14]} c={warna.accent} rot={[-0.18, 0, 0]} />
    {[-0.4, 0.4].map((x) => <Cy key={x} p={[x, 1.28, 0.02]} rad={0.05} h={0.3} c={BAJA} rot={[0, 0, 0]} />)}
    <Bx p={[0, 0.06, -0.15]} s={[1.0, 0.12, 0.3]} c={KAPUR} />
  </group>
);
