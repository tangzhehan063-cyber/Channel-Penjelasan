// Video #6 "Lantai Rumahmu Sengaja Dibuat Miring": objek 3D prosedural.
// Satuan: 1 unit = 1 meter. Lantai kamar mandi 2 × 1,5 m, keramik 50 × 50 cm, lubang buang di depan-kanan.
import {useMemo} from 'react';
import * as THREE from 'three';

export const K3 = {coral: '#e65a43', tile: '#ec7a60', grout: '#3a2a26', adukan: '#c9bfb2', cor: '#8d8781', blue: '#1f7fdc', sage: '#6fae6a', lumut: '#4f8a4a', ink: '#1c1c1e'};
export const FW = 2.0, FD = 1.5, TS = 0.5, GAP = 0.014, TH = 0.05;
export const DRAIN: [number, number] = [0.75, 0.5];      // posisi lubang buang (x, z) di koordinat lantai
export const MARBLE_R = 0.075;

const phys = (color: string, o: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
  new THREE.MeshPhysicalMaterial({color, roughness: 0.35, clearcoat: 0.7, clearcoatRoughness: 0.2, ...o});
const INKM = new THREE.MeshBasicMaterial({color: K3.ink, side: THREE.BackSide});
const UBOX = new THREE.BoxGeometry(1, 1, 1);
const Ink: React.FC<{p: [number, number, number]; s: [number, number, number]; w?: number}> = ({p, s, w = 0.022}) =>
  <mesh geometry={UBOX} material={INKM} position={p} scale={[s[0] + w, s[1] + w, s[2] + w]} />;

// ---------- lantai keramik ----------
export const Floor: React.FC<{dim?: number}> = ({dim = 0}) => {
  const tileM = useMemo(() => phys(K3.tile), []), base = useMemo(() => phys(K3.grout, {roughness: 0.8, clearcoat: 0}), []);
  const side = useMemo(() => phys(K3.coral, {roughness: 0.6, clearcoat: 0.2}), []);
  const tiles = [];
  for (let i = 0; i < FW / TS; i++) for (let j = 0; j < FD / TS; j++) {
    const x = -FW / 2 + TS / 2 + i * TS, z = -FD / 2 + TS / 2 + j * TS;
    tiles.push(<mesh key={`${i}-${j}`} material={tileM} position={[x, -TH / 2, z]} scale={[TS - GAP, TH, TS - GAP]} geometry={UBOX} />);
  }
  return (
    <group>
      {tiles}
      <mesh geometry={UBOX} material={base} position={[0, -TH / 2 - 0.004, 0]} scale={[FW - 0.002, TH, FD - 0.002]} />
      <mesh geometry={UBOX} material={side} position={[0, -TH - 0.09, 0]} scale={[FW, 0.18, FD]} />
      <Ink p={[0, -0.115, 0]} s={[FW, 0.23, FD]} w={0.03} />
      <Drain />
      {dim > 0 && <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[FW, FD]} /><meshBasicMaterial color="#000" transparent opacity={dim} /></mesh>}
    </group>
  );
};

export const Drain: React.FC = () => {
  const m = useMemo(() => phys('#d9d7d3', {metalness: 0.8, roughness: 0.25}), []);
  return (
    <group position={[DRAIN[0], 0.002, DRAIN[1]]}>
      <mesh material={m} scale={[0.17, 0.008, 0.17]} geometry={UBOX} />
      <Ink p={[0, 0, 0]} s={[0.17, 0.008, 0.17]} w={0.018} />
      {[-0.05, -0.025, 0, 0.025, 0.05].map((z) => <mesh key={z} position={[0, 0.006, z]} scale={[0.12, 0.004, 0.009]} geometry={UBOX}><meshBasicMaterial color={K3.ink} /></mesh>)}
    </group>
  );
};

// ---------- kelereng ----------
export const Marble: React.FC<{x: number; z: number; roll: number; o?: number; lift?: number}> = ({x, z, roll, o = 1, lift = 0}) => {
  const m = useMemo(() => phys('#ffffff', {roughness: 0.08, clearcoat: 1, transmission: 0, sheen: 0}), []);
  const band = useMemo(() => phys('#1f7fdc', {roughness: 0.2}), []);
  if (o <= 0) return null;
  return (
    <group position={[x, MARBLE_R + lift, z]} rotation={[roll, 0, -roll * 0.6]} scale={o}>
      <mesh material={m}><sphereGeometry args={[MARBLE_R, 32, 24]} /></mesh>
      <mesh material={band} rotation={[0.4, 0, 0.3]}><torusGeometry args={[MARBLE_R * 0.72, MARBLE_R * 0.18, 10, 32]} /></mesh>
      <mesh material={INKM}><sphereGeometry args={[MARBLE_R * 1.12, 24, 16]} /></mesh>
    </group>
  );
};

// ---------- genangan air (piringan pipih biru + tepi gelap) ----------
export const Puddle: React.FC<{x: number; z: number; r: number; o?: number; sx?: number}> = ({x, z, r, o = 1, sx = 1.3}) => {
  if (r <= 0.002 || o <= 0) return null;
  return (
    <group position={[x, 0.004, z]} rotation={[-Math.PI / 2, 0, 0]} scale={[sx, 1, 1]}>
      <mesh><circleGeometry args={[r, 40]} /><meshBasicMaterial color={K3.blue} transparent opacity={0.62 * o} depthWrite={false} /></mesh>
      <mesh position={[0, 0, 0.001]}><ringGeometry args={[r * 0.93, r, 48]} /><meshBasicMaterial color="#0a3d7a" transparent opacity={0.9 * o} depthWrite={false} /></mesh>
      <mesh position={[-r * 0.3, r * 0.25, 0.002]}><circleGeometry args={[r * 0.18, 20]} /><meshBasicMaterial color="#cfe6ff" transparent opacity={0.7 * o} depthWrite={false} /></mesh>
    </group>
  );
};

// aliran air tipis dari titik a ke lubang buang
export const Stream: React.FC<{a: [number, number]; p: number; o?: number}> = ({a, p, o = 1}) => {
  if (p <= 0 || o <= 0) return null;
  const dx = DRAIN[0] - a[0], dz = DRAIN[1] - a[1], L = Math.hypot(dx, dz) * p, ang = Math.atan2(dx, dz);
  return (
    <group position={[a[0] + dx * p / 2, 0.005, a[1] + dz * p / 2]} rotation={[0, ang, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.05, L]} /><meshBasicMaterial color={K3.blue} transparent opacity={0.8 * o} depthWrite={false} /></mesh>
    </group>
  );
};

// kerak putih & lumut di sela keramik sekitar genangan diam (pojok belakang-kiri)
export const Crust: React.FC<{p: number; cx: number; cz: number}> = ({p, cx, cz}) => {
  const dots = useMemo(() => Array.from({length: 26}, (_, i) => {
    const a = i * 2.39, rr = 0.06 + ((i * 37) % 23) / 23 * 0.28;
    return {x: cx + Math.cos(a) * rr * 1.3, z: cz + Math.sin(a) * rr, s: 0.012 + ((i * 13) % 7) / 7 * 0.016, d: ((i * 7) % 26) / 26};
  }), [cx, cz]);
  // lumut: titik-titik hijau di garis sela keramik terdekat (x = -0.5 dan z = -0.25)
  const moss = useMemo(() => Array.from({length: 22}, (_, i) => {
    const onX = i % 2 === 0, k = (i / 22) * 0.7 - 0.35;
    return {x: onX ? -0.5 : cx + k * 1.3, z: onX ? cz + k : -0.25, s: 0.014 + ((i * 11) % 5) / 5 * 0.012, d: ((i * 5) % 22) / 22};
  }), [cx, cz]);
  return (
    <group>
      {dots.map((d, i) => { const k = Math.max(0, Math.min(1, p * 1.6 - d.d * 0.6)); return k > 0 &&
        <mesh key={i} position={[d.x, 0.007, d.z]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[d.s * k, 12]} /><meshBasicMaterial color="#ffffff" /></mesh>; })}
      {moss.map((d, i) => { const k = Math.max(0, Math.min(1, p * 1.6 - 0.3 - d.d * 0.6)); return k > 0 &&
        <mesh key={i} position={[d.x, 0.006, d.z]} scale={[k, k, k]}><sphereGeometry args={[d.s, 10, 8]} /><meshPhysicalMaterial color={K3.lumut} roughness={0.9} /></mesh>; })}
    </group>
  );
};

// ---------- potongan lapis (cutaway): keramik / sela / adukan / cor ----------
export const Potongan: React.FC<{explode: number; drops: number; wet: number; t: number}> = ({explode, drops, wet, t}) => {
  const tileM = useMemo(() => phys(K3.tile), []), adM = useMemo(() => phys(K3.adukan, {roughness: 0.9, clearcoat: 0.1}), []);
  const corM = useMemo(() => phys(K3.cor, {roughness: 0.95, clearcoat: 0}), []), groutM = useMemo(() => phys('#6b5d57', {roughness: 0.9, clearcoat: 0}), []);
  const W = 1.2, D = 0.7, tTH = 0.07, aTH = 0.14, cTH = 0.24, G = 0.03;
  const lift = 0.32 * explode, drop = 0.22 * explode;
  const yT = tTH / 2 + lift, yA = -aTH / 2, yC = -aTH - cTH / 2 - drop;
  // tetes air turun lewat sela (x = 0): siklus berulang
  const N = 4, dropsEl = [];
  for (let i = 0; i < N; i++) {
    const ph = (t * 0.9 + i / N) % 1, y = tTH + lift - ph * (tTH + lift + 0.02);
    if (drops > 0) dropsEl.push(<mesh key={i} position={[0, y, 0.0 + (i - 1.5) * 0.12]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.022, 14, 10]} /><meshBasicMaterial color={K3.blue} transparent opacity={drops} /></mesh>);
  }
  return (
    <group>
      {/* keramik kiri & kanan + sela */}
      {[-1, 1].map((s) => <group key={s}>
        <mesh material={tileM} geometry={UBOX} position={[s * (W / 4 + G / 4), yT, 0]} scale={[W / 2 - G / 2, tTH, D]} />
        <Ink p={[s * (W / 4 + G / 4), yT, 0]} s={[W / 2 - G / 2, tTH, D]} />
      </group>)}
      <mesh material={groutM} geometry={UBOX} position={[0, yT, 0]} scale={[G, tTH * 0.92, D * 0.99]} />
      {/* adukan */}
      <mesh material={adM} geometry={UBOX} position={[0, yA, 0]} scale={[W, aTH, D]} />
      <Ink p={[0, yA, 0]} s={[W, aTH, D]} />
      {wet > 0 && <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.05 + 0.33 * wet, 40]} /><meshBasicMaterial color={K3.blue} transparent opacity={0.55} depthWrite={false} /></mesh>}
      {wet > 0 && <mesh position={[0, yA, D / 2 + 0.002]}><planeGeometry args={[0.04 + 0.5 * wet, aTH * 0.96 * Math.min(1, wet * 1.4)]} /><meshBasicMaterial color={K3.blue} transparent opacity={0.45} depthWrite={false} /></mesh>}
      {/* cor */}
      <mesh material={corM} geometry={UBOX} position={[0, yC, 0]} scale={[W, cTH, D]} />
      <Ink p={[0, yC, 0]} s={[W, cTH, D]} />
      {dropsEl}
    </group>
  );
};
export const POT = {tTH: 0.07, aTH: 0.14, cTH: 0.24};
