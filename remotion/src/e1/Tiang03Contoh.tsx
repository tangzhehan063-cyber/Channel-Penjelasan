// CONTOH STILL (bukan video): momen yang sama (mobil mundur lurus dari gerbang, bumper hampir menyentuh tiang) dalam dua tampilan.
//  A = 2.5D (SVG, proyeksi isometrik, 3 nada) ; B = 3D terstilisasi (three.js, MeshToon 3 nada + tepi tinta tipis).
// Dunia (meter): x sepanjang jalan, z menuju penonton, y atas. Pagar di z=0, gerbang |x|<2,1, tiang (0,3), jalan z 4,5..11, rumah z -12..-5.
import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Edges, RoundedBox} from '@react-three/drei';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';

const C = {ink: '#1c1c1e', accent: '#c23d27', cool: '#2f6aa8', ground: '#d5d9dc', yard: '#dde3d6', road: '#aab2b8', lane: '#f1f2f3', wall: '#e8dfd2', roof: '#b9886f', car: '#3f7fc0', glass: '#7e8d99'};

/* ------------------------- A: 2.5D isometrik (SVG) ------------------------- */
const S = 50, CX = 470, CY = 1040, c30 = Math.cos(Math.PI / 6), s30 = 0.5;
const P = (x: number, y: number, z: number): [number, number] => [CX + (x - z) * c30 * S, CY + (x + z) * s30 * S - y * S];
const pts = (a: [number, number, number][]) => a.map(([x, y, z]) => P(x, y, z).join(',')).join(' ');
const shade = (hex: string, k: number) => { const n = parseInt(hex.slice(1), 16), r = Math.min(255, Math.round(((n >> 16) & 255) * k)), g = Math.min(255, Math.round(((n >> 8) & 255) * k)), b = Math.min(255, Math.round((n & 255) * k)); return `rgb(${r},${g},${b})`; };
// kotak: x0..x1, y0..y1, z0..z1; tiga sisi terlihat (atas terang, kiri sedang, kanan gelap)
const Box: React.FC<{x0: number; x1: number; y0: number; y1: number; z0: number; z1: number; c: string; edge?: boolean}> = ({x0, x1, y0, y1, z0, z1, c, edge = true}) => {
  const st = edge ? {stroke: C.ink, strokeWidth: 2.4, strokeLinejoin: 'round' as const} : {};
  return (
    <g>
      <polygon points={pts([[x0, y1, z1], [x1, y1, z1], [x1, y0, z1], [x0, y0, z1]])} fill={shade(c, 0.86)} {...st} />{/* sisi z+ (menghadap penonton kiri) */}
      <polygon points={pts([[x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [x1, y0, z0]])} fill={shade(c, 0.66)} {...st} />{/* sisi x+ */}
      <polygon points={pts([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]])} fill={shade(c, 1.08)} {...st} />{/* atas */}
    </g>
  );
};
const Shadow: React.FC<{x: number; z: number; rx: number; rz: number}> = ({x, z, rx, rz}) => <polygon points={pts([[x - rx, 0, z - rz], [x + rx + 1.2, 0, z - rz], [x + rx + 1.2, 0, z + rz], [x - rx, 0, z + rz]])} fill="#000" opacity={0.12} />;

export const Tiang03ContohA: React.FC = () => (
  <AbsoluteFill style={{background: '#e9ebed'}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      {/* tanah, halaman, jalan */}
      <polygon points={pts([[-12, 0, -13], [12, 0, -13], [12, 0, 13], [-12, 0, 13]])} fill={C.ground} />
      <polygon points={pts([[-12, 0, -13], [12, 0, -13], [12, 0, 0], [-12, 0, 0]])} fill={C.yard} />
      <polygon points={pts([[-12, 0, 4.6], [12, 0, 4.6], [12, 0, 11], [-12, 0, 11]])} fill={C.road} />
      <polygon points={pts([[-2.1, 0, -5], [2.1, 0, -5], [2.1, 0, 0], [-2.1, 0, 0]])} fill="#e8e9e3" />
      {[-10, -7, -4, -1, 2, 5, 8].map((x) => <polygon key={x} points={pts([[x, 0, 7.6], [x + 1.6, 0, 7.6], [x + 1.6, 0, 7.8], [x, 0, 7.8]])} fill={C.lane} />)}
      {/* rumah */}
      <Shadow x={-4} z={-8} rx={4} rz={3.5} />
      <Box x0={-4} x1={4} y0={0} y1={3} z0={-12} z1={-5} c={C.wall} />
      <polygon points={pts([[-4.4, 3, -5.4], [4.4, 3, -5.4], [4.4, 4.6, -8.5], [-4.4, 4.6, -8.5]])} fill={shade(C.roof, 0.9)} stroke={C.ink} strokeWidth={2.4} strokeLinejoin="round" />
      <polygon points={pts([[4.4, 3, -5.4], [4.4, 4.6, -8.5], [4.4, 3, -11.6]])} fill={shade(C.roof, 0.66)} stroke={C.ink} strokeWidth={2.4} strokeLinejoin="round" />
      <polygon points={pts([[-4.4, 4.6, -8.5], [4.4, 4.6, -8.5], [4.4, 3, -11.6], [-4.4, 3, -11.6]])} fill={shade(C.roof, 1.12)} stroke={C.ink} strokeWidth={2.4} strokeLinejoin="round" />
      <polygon points={pts([[-0.6, 0, -4.98], [0.6, 0, -4.98], [0.6, 2.1, -4.98], [-0.6, 2.1, -4.98]])} fill="#7a5a44" stroke={C.ink} strokeWidth={2} />
      {/* pagar dan gerbang */}
      <Box x0={-12} x1={-2.1} y0={0} y1={1.2} z0={-0.1} z1={0.1} c="#c9c4ba" />
      <Box x0={2.1} x1={12} y0={0} y1={1.2} z0={-0.1} z1={0.1} c="#c9c4ba" />
      <Box x0={-2.35} x1={-2.05} y0={0} y1={1.6} z0={-0.15} z1={0.15} c="#8d8f91" />
      <Box x0={2.05} x1={2.35} y0={0} y1={1.6} z0={-0.15} z1={0.15} c="#8d8f91" />
      {/* jalur lurus yang dituju mobil (putus-putus) */}
      <polyline points={[[0, 0.02, 2.8], [0, 0.02, 9]].map(([x, y, z]) => P(x, y, z).join(',')).join(' ')} fill="none" stroke={C.cool} strokeWidth={7} strokeDasharray="14 12" strokeLinecap="round" opacity={0.85} />
      {/* mobil: badan + kabin + roda; bumper belakang di z=2,7 */}
      <Shadow x={-0.9} z={0.5} rx={0.9} rz={2.3} />
      {[[-0.95, -1.3], [0.95, -1.3], [-0.95, 1.3], [0.95, 1.3]].map(([wx, wz], i) => <Box key={i} x0={wx - 0.12} x1={wx + 0.12} y0={0} y1={0.55} z0={0.5 + wz - 0.35} z1={0.5 + wz + 0.35} c="#2b2f33" edge={false} />)}
      <Box x0={-0.9} x1={0.9} y0={0.25} y1={0.95} z0={-1.7} z1={2.7} c={C.car} />
      <Box x0={-0.75} x1={0.75} y0={0.95} y1={1.5} z0={-0.9} z1={1.6} c="#d7e3ef" />
      <polygon points={pts([[-0.7, 1.4, 1.61], [0.7, 1.4, 1.61], [0.7, 1.0, 1.61], [-0.7, 1.0, 1.61]])} fill={C.glass} stroke={C.ink} strokeWidth={2} />
      <polygon points={pts([[0.76, 1.42, 1.5], [0.76, 1.42, -0.7], [0.76, 1.0, -0.7], [0.76, 1.0, 1.5]])} fill={C.glass} stroke={C.ink} strokeWidth={2} />
      <polygon points={pts([[-0.85, 0.55, 2.71], [-0.6, 0.55, 2.71], [-0.6, 0.45, 2.71], [-0.85, 0.45, 2.71]])} fill={C.accent} />
      {/* kabel (sepanjang x) dan tiang */}
      {[2.55, 3, 3.45].map((z) => <polyline key={z} points={[[-12, 7.6, z], [12, 7.6, z]].map(([x, y, zz]) => P(x, y, zz).join(',')).join(' ')} fill="none" stroke={C.ink} strokeWidth={2.4} opacity={0.8} />)}
      <Shadow x={-0.25} z={3} rx={0.3} rz={0.3} />
      <Box x0={-0.23} x1={0.23} y0={0} y1={8} z0={2.77} z1={3.23} c="#8b9096" />
      <polygon points={pts([[-0.1, 7.6, 2.4], [0.1, 7.6, 2.4], [0.1, 7.6, 3.6], [-0.1, 7.6, 3.6]])} fill={C.ink} />
      <line x1={P(0, 7.6, 2.4)[0]} y1={P(0, 7.6, 2.4)[1]} x2={P(0, 7.6, 3.6)[0]} y2={P(0, 7.6, 3.6)[1]} stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
      {/* titik hampir menyentuh */}
      <circle cx={P(0, 0.5, 2.75)[0]} cy={P(0, 0.5, 2.75)[1]} r={26} fill="none" stroke={C.accent} strokeWidth={6} />
    </svg>
  </AbsoluteFill>
);

/* ------------------------- B: 3D terstilisasi (three.js) ------------------------- */
const useToon = () => useMemo(() => { const t = new THREE.DataTexture(new Uint8Array([95, 175, 255]), 3, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; }, []);
const Toon: React.FC<{c: string; g: THREE.Texture}> = ({c, g}) => <meshToonMaterial color={c} gradientMap={g} />;
const Bx3: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; g: THREE.Texture; r?: number}> = ({p, s, c, g, r}) => (
  <mesh position={p}>{r ? <></> : <boxGeometry args={s} />}<Toon c={c} g={g} /><Edges color={C.ink} lineWidth={1.4} /></mesh>
);
const Cam: React.FC = () => { const cam = useThree((s) => s.camera); cam.position.set(11, 8.5, 24); cam.lookAt(0, 2.8, 0.5); cam.updateProjectionMatrix(); return null; };

const Scene3D: React.FC = () => {
  const g = useToon();
  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[-6, 12, 8]} intensity={1.9} />
      <Cam />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}><planeGeometry args={[40, 40]} /><meshBasicMaterial color={C.ground} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -7]}><planeGeometry args={[40, 14]} /><meshBasicMaterial color={C.yard} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 7.8]}><planeGeometry args={[40, 6.4]} /><meshBasicMaterial color={C.road} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, -2.5]}><planeGeometry args={[4.2, 5]} /><meshBasicMaterial color="#e8e9e3" /></mesh>
      {[-10, -6, -2, 2, 6, 10].map((x) => <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, 7.7]}><planeGeometry args={[2, 0.18]} /><meshBasicMaterial color={C.lane} /></mesh>)}
      {/* rumah */}
      <Bx3 p={[0, 1.5, -8.5]} s={[8, 3, 7]} c={C.wall} g={g} />
      <mesh position={[0, 3.95, -8.5]} rotation={[0, Math.PI / 4, 0]} scale={[1, 1, 0.78]}><coneGeometry args={[6.5, 1.9, 4]} /><Toon c={C.roof} g={g} /><Edges color={C.ink} lineWidth={1.4} /></mesh>
      <Bx3 p={[0, 1.05, -4.98]} s={[1.2, 2.1, 0.1]} c="#7a5a44" g={g} />
      {/* pagar + gerbang */}
      <Bx3 p={[-7.05, 0.6, 0]} s={[9.9, 1.2, 0.2]} c="#c9c4ba" g={g} />
      <Bx3 p={[7.05, 0.6, 0]} s={[9.9, 1.2, 0.2]} c="#c9c4ba" g={g} />
      <Bx3 p={[-2.2, 0.8, 0]} s={[0.3, 1.6, 0.3]} c="#8d8f91" g={g} />
      <Bx3 p={[2.2, 0.8, 0]} s={[0.3, 1.6, 0.3]} c="#8d8f91" g={g} />
      {/* mobil (bumper belakang di z=2,7) */}
      <RoundedBox args={[1.8, 0.7, 4.4]} radius={0.22} smoothness={4} position={[0, 0.6, 0.5]}><Toon c={C.car} g={g} /><Edges color={C.ink} lineWidth={1.4} /></RoundedBox>
      <RoundedBox args={[1.5, 0.55, 2.5]} radius={0.2} smoothness={4} position={[0, 1.2, 0.35]}><Toon c="#d7e3ef" g={g} /><Edges color={C.ink} lineWidth={1.4} /></RoundedBox>
      <mesh position={[0, 1.2, 1.65]}><boxGeometry args={[1.42, 0.38, 0.05]} /><meshToonMaterial color={C.glass} gradientMap={g} /></mesh>
      {[[-0.95, -1.4], [0.95, -1.4], [-0.95, 1.4], [0.95, 1.4]].map(([x, z], i) => <mesh key={i} position={[x, 0.36, 0.5 + z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.36, 0.36, 0.24, 24]} /><meshToonMaterial color="#2b2f33" gradientMap={g} /></mesh>)}
      <mesh position={[-0.6, 0.55, 2.72]}><boxGeometry args={[0.5, 0.14, 0.05]} /><meshBasicMaterial color={C.accent} /></mesh>
      {/* tiang + kabel */}
      <mesh position={[0, 4, 3]}><cylinderGeometry args={[0.2, 0.26, 8, 20]} /><Toon c="#8b9096" g={g} /><Edges color={C.ink} lineWidth={1.4} /></mesh>
      <Bx3 p={[0, 7.6, 3]} s={[0.2, 0.2, 2.4]} c="#3a4147" g={g} />
      {[2.0, 3, 4.0].map((z) => <mesh key={z} position={[0, 7.6, z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.025, 0.025, 40, 6]} /><meshBasicMaterial color={C.ink} /></mesh>)}
      <mesh position={[0, 0.5, 2.75]} rotation={[0, 0, 0]}><torusGeometry args={[0.45, 0.04, 8, 32]} /><meshBasicMaterial color={C.accent} /></mesh>
    </>
  );
};

export const Tiang03ContohB: React.FC = () => (
  <AbsoluteFill style={{background: '#e9ebed'}}>
    <ThreeCanvas width={1080} height={1920} camera={{position: [11, 8.5, 24], fov: 38}} gl={{antialias: true, alpha: true}}><Scene3D /></ThreeCanvas>
  </AbsoluteFill>
);
