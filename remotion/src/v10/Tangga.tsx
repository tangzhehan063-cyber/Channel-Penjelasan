// Video #10 "Anak Tangga Harus Ganjil?": tangga dari selembar kertas yang terlipat (Gaya B diorama kertas, versi halus).
// Satuan meter. Selisih tinggi anak tangga ke-5 dibesarkan agar terlihat (penyederhanaan visual).
import * as THREE from 'three';
import {Easing, interpolate} from 'remotion';

export const KT = {table: '#e4dfd3', paper: '#f8f6f0', side: '#d9d4c7', ink: '#1c1c1e', coral: '#f27a63', coralDeep: '#c95a46', sage: '#6fae6a'};
const mat = (color: string, rough = 0.92) => new THREE.MeshStandardMaterial({color, roughness: rough, metalness: 0});
export const MT = {table: mat(KT.table, 1), paper: mat(KT.paper), side: mat(KT.side), ink: new THREE.MeshBasicMaterial({color: KT.ink}), coral: mat(KT.coral, 0.8), sage: mat(KT.sage, 0.8), white: mat('#fbfaf6')};
const UBOX = new THREE.BoxGeometry(1, 1, 1);
type V3 = [number, number, number];

/* kotak kertas: menerima & membuang bayangan */
export const PBox: React.FC<{p: V3; s: V3; m: THREE.Material; r?: V3}> = ({p, s, m, r}) => (
  <mesh geometry={UBOX} material={m} position={p} scale={s} rotation={r} castShadow receiveShadow />
);
/* garis tinta tipis (tepi lipatan) */
const Ink: React.FC<{p: V3; s: V3}> = ({p, s}) => <mesh geometry={UBOX} material={MT.ink} position={p} scale={s} />;

export const S = {n: 7, h: 0.17, t: 0.28, w: 1.0, bumpIdx: 4, bumpMax: 0.06};
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const spring = Easing.bezier(0.34, 1.28, 0.64, 1); // lentur halus, sedikit lewat lalu kembali

/* tinggi puncak anak tangga i (0 = paling bawah) */
export const topY = (i: number, bump = 0) => (i + 1) * S.h + (i === S.bumpIdx ? bump * S.bumpMax : 0);
export const zMid = (i: number) => -(i + 0.5) * S.t;

/* fold 0..1: lembar terlipat jadi tangga, anak tangga bawah duluan; bump 0..1; tint per anak tangga (0..1 sage) */
export const Stairs: React.FC<{fold?: number; bump?: number; sage?: number; hi?: number[]}> = ({fold = 1, bump = 0, sage = 0, hi = []}) => {
  const n = S.n;
  return (
    <group>
      {Array.from({length: n}, (_, i) => {
        const g = interpolate(fold * (n + 2) - i * 1.0, [0, 2.2], [0, 1], {...cl, easing: spring});
        if (g <= 0.001) return null;
        const top = topY(i, bump) * g, z = zMid(i);
        const m = hi.includes(i) ? MT.coral : MT.paper;
        return (
          <group key={i}>
            {/* badan anak tangga (kertas tebal terlipat) */}
            <PBox p={[0, top / 2, z]} s={[S.w, top, S.t]} m={MT.side} />
            {/* muka pijakan (lembar atas, sedikit menjorok) */}
            <PBox p={[0, top + 0.006, z - 0.004]} s={[S.w + 0.02, 0.012, S.t + 0.02]} m={m} />
            {sage > 0 && <PBox p={[0, top + 0.014, z + S.t / 2 - 0.012]} s={[S.w * sage, 0.006, 0.018]} m={MT.sage} />}
            {/* tepi lipatan bertinta */}
            <Ink p={[0, top + 0.012, z + S.t / 2 + 0.006]} s={[S.w + 0.022, 0.006, 0.006]} />
            <Ink p={[0, top / 2, z + S.t / 2 + 0.006]} s={[0.004, 0.0001, 0.0001]} />
          </group>
        );
      })}
      {/* sisi samping kertas: garis tinta tipis di ujung kiri-kanan */}
    </group>
  );
};

/* meja + bayangan */
export const Table: React.FC = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.8]} material={MT.table} receiveShadow><planeGeometry args={[30, 30]} /></mesh>
);

/* jejak kaki kertas di pijakan i; side -1 kiri / 1 kanan */
export const Foot: React.FC<{i: number; side: number; p: number; coral?: boolean; bump?: number}> = ({i, side, p, coral, bump = 0}) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 1], [0.4, 1], {...cl, easing: spring});
  return (
    <group position={[side * 0.18, topY(i, bump) + 0.02, zMid(i)]} scale={[s, 1, s]}>
      <PBox p={[0, 0, 0.02]} s={[0.1, 0.008, 0.17]} m={coral ? MT.coral : MT.ink} />
      <PBox p={[0, 0, -0.085]} s={[0.085, 0.008, 0.06]} m={coral ? MT.coral : MT.ink} />
    </group>
  );
};

/* lingkar putus-putus "kapur" di lantai/pijakan */
export const ChalkRing: React.FC<{p: V3; r: number; k: number}> = ({p, r, k}) => {
  if (k <= 0) return null;
  const n = 22, on = Math.ceil(k * n);
  return (
    <group position={p}>
      {Array.from({length: on}, (_, j) => { const a = (j / n) * Math.PI * 2; return <PBox key={j} p={[Math.cos(a) * r, 0, Math.sin(a) * r]} s={[0.05, 0.006, 0.018]} r={[0, -a, 0]} m={MT.coral} />; })}
    </group>
  );
};
