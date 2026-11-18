// Kit Penjelasan / objek: kendaraan (motor, mobil) sebagai properti beban di atas pelat. Menghadap +z, alas di y=0. Bentuk membulat, warna datar.
// R2 (#21): mobil = profil samping diekstrusi (kap, kabin, kaca, lampu); motor = roda berban, garpu, setang, tangki, jok, knalpot.
import {useMemo} from 'react';
import * as THREE from 'three';
import {Edges, RoundedBox} from '@react-three/drei';
import {Cy} from '../prim';
import {INK} from '../prim';
import type {V3} from '../waktu';

const BAN = '#2c2c30', KACA = '#dfe5ea', HUB = '#c9ccd1', LAMPU = '#fff3c4', GELAP = '#3a3d44', LOGAM = '#9aa0a8';
const Rb: React.FC<{p: V3; s: V3; c: string; r?: number; rot?: V3; edge?: boolean}> = ({p, s, c, r = 0.04, rot = [0, 0, 0], edge = false}) => (
  <RoundedBox args={s} radius={r} smoothness={4} position={p} rotation={rot} castShadow>
    <meshStandardMaterial color={c} roughness={0.5} />
    {edge && <Edges color={INK} threshold={40} lineWidth={1.1} />}
  </RoundedBox>
);
const Roda: React.FC<{p: V3; rad: number; w: number}> = ({p, rad, w}) => (
  <group>
    <Cy p={p} rad={rad} h={w} c={BAN} rot={[0, 0, Math.PI / 2]} />
    <Cy p={p} rad={rad * 0.55} h={w + 0.02} c={HUB} rot={[0, 0, Math.PI / 2]} edge={false} m={0.4} />
    <Cy p={p} rad={rad * 0.2} h={w + 0.04} c={GELAP} rot={[0, 0, Math.PI / 2]} edge={false} />
  </group>
);

/** motor tampak samping saat diputar: panjang ±1,0 (sumbu z), tinggi ±0,8 */
export const Motor: React.FC<{warna: string}> = ({warna}) => (
  <group>
    <Roda p={[0, 0.23, 0.42]} rad={0.23} w={0.1} />
    <Roda p={[0, 0.23, -0.42]} rad={0.23} w={0.12} />
    {/* garpu depan + setang + lampu */}
    <Cy p={[0.045, 0.5, 0.36]} rad={0.022} h={0.58} c={LOGAM} rot={[-0.32, 0, 0]} edge={false} m={0.5} />
    <Cy p={[-0.045, 0.5, 0.36]} rad={0.022} h={0.58} c={LOGAM} rot={[-0.32, 0, 0]} edge={false} m={0.5} />
    <Cy p={[0, 0.77, 0.27]} rad={0.022} h={0.5} c={GELAP} rot={[0, 0, Math.PI / 2]} edge={false} />
    <Cy p={[0.24, 0.77, 0.27]} rad={0.035} h={0.1} c={BAN} rot={[0, 0, Math.PI / 2]} edge={false} />
    <Cy p={[-0.24, 0.77, 0.27]} rad={0.035} h={0.1} c={BAN} rot={[0, 0, Math.PI / 2]} edge={false} />
    <mesh position={[0, 0.66, 0.4]}><sphereGeometry args={[0.085, 20, 14]} /><meshStandardMaterial color={LAMPU} roughness={0.4} /></mesh>
    <Rb p={[0, 0.5, 0.46]} s={[0.14, 0.03, 0.3]} c={warna} r={0.012} rot={[-0.25, 0, 0]} />
    {/* badan: mesin, tangki, jok, bodi belakang, knalpot */}
    <Rb p={[0, 0.3, 0.0]} s={[0.18, 0.22, 0.34]} c={GELAP} r={0.06} />
    <Rb p={[0, 0.54, 0.12]} s={[0.22, 0.17, 0.38]} c={warna} r={0.075} edge />
    <Rb p={[0, 0.5, -0.22]} s={[0.2, 0.075, 0.42]} c={BAN} r={0.035} />
    <Rb p={[0, 0.43, -0.45]} s={[0.17, 0.07, 0.28]} c={warna} r={0.03} rot={[0.35, 0, 0]} />
    <Cy p={[0.13, 0.19, -0.18]} rad={0.04} h={0.62} c={LOGAM} rot={[Math.PI / 2, 0, 0]} edge={false} m={0.6} />
    <Rb p={[0.08, 0.26, -0.22]} s={[0.04, 0.05, 0.56]} c={GELAP} r={0.015} />
  </group>
);

const profil = (pts: [number, number][]) => { const s = new THREE.Shape(); pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y))); s.closePath(); return s; };
const Ekstrusi: React.FC<{shape: THREE.Shape; depth: number; c: string; bevel?: number; edge?: boolean}> = ({shape, depth, c, bevel = 0, edge}) => {
  const geo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shape, {depth, bevelEnabled: bevel > 0, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 4, steps: 1});
    g.translate(0, 0, -depth / 2);
    return g;
  }, [shape, depth, bevel]);
  return <mesh geometry={geo} castShadow><meshStandardMaterial color={c} roughness={0.45} />{edge && <Edges color={INK} threshold={35} lineWidth={1.1} />}</mesh>;
};
/** mobil: lebar ±0,9, panjang ±1,7, tinggi ±0,85 */
export const Mobil: React.FC<{warna: string}> = ({warna}) => {
  const badan = useMemo(() => profil([[-0.82, 0.2], [0.82, 0.2], [0.86, 0.36], [0.76, 0.46], [0.46, 0.5], [0.2, 0.74], [-0.3, 0.74], [-0.58, 0.5], [-0.84, 0.46]]), []);
  const kaca = useMemo(() => profil([[0.38, 0.53], [0.19, 0.7], [-0.27, 0.7], [-0.5, 0.53]]), []);
  return (
    <group>
      {/* profil samping: sumbu x profil = depan (+z dunia), diputar -90° agar lebar mobil sepanjang x */}
      <group rotation={[0, -Math.PI / 2, 0]}>
        <Ekstrusi shape={badan} depth={0.74} c={warna} bevel={0.05} edge />
        <Ekstrusi shape={kaca} depth={0.9} c={KACA} />
      </group>
      {[-0.46, 0.46].flatMap((x) => [-0.52, 0.52].map((z) => <Roda key={`${x}${z}`} p={[x, 0.25, z]} rad={0.25} w={0.15} />))}
      {[-0.28, 0.28].map((x) => <mesh key={x} position={[x, 0.4, 0.9]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.075, 0.075, 0.04, 20]} /><meshStandardMaterial color={LAMPU} roughness={0.4} /></mesh>)}
      <Rb p={[0, 0.27, 0.86]} s={[0.84, 0.07, 0.09]} c={GELAP} r={0.03} />
      <Rb p={[0, 0.27, -0.86]} s={[0.84, 0.07, 0.09]} c={GELAP} r={0.03} />
    </group>
  );
};
