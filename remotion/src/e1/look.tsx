// "Tampilan E1": material prosedural berrelief + model rumah kampung detail + lingkungan. 100% kode (CanvasTexture ber-seed, three.js), tanpa aset luar.
// Aturan z-fighting: benda yang menumpu menancap 0,02 m ke penopang; tak ada dua permukaan sebidang.
import {useMemo} from 'react';
import * as THREE from 'three';
import {rng, tex} from './AnatomiRumah';
import type {V3} from '../kit/waktu';

const R = (rd: () => number, a: number, b: number) => a + (b - a) * rd();
export const useBahan = () => useMemo(() => ({
  plester: tex(256, 256, (g, rd) => {
    g.fillStyle = '#ddd3be'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 70; i++) { const p = [[120, 150, 110], [160, 135, 100], [205, 195, 175]][Math.floor(rd() * 3)]; g.fillStyle = `rgba(${p[0]},${p[1]},${p[2]},${R(rd, 0.07, 0.2)})`; g.beginPath(); g.arc(rd() * 256, rd() * 256, R(rd, 10, 42), 0, 7); g.fill(); }
    for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(60,55,45,${R(rd, 0.05, 0.13)})`; g.fillRect(rd() * 256, rd() * 150, R(rd, 1, 3), R(rd, 40, 130)); }
    const gr = g.createLinearGradient(0, 170, 0, 256); gr.addColorStop(0, 'rgba(70,95,70,0)'); gr.addColorStop(1, 'rgba(60,85,62,0.5)'); g.fillStyle = gr; g.fillRect(0, 170, 256, 86);
  }, [1, 1], 21),
  lempung: tex(256, 256, (g, rd) => {
    g.fillStyle = '#857b6d'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 16; i++) { const y = i * 16 + rd() * 8; g.fillStyle = i % 2 ? 'rgba(60,48,38,0.12)' : 'rgba(190,175,150,0.10)'; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= 256; x += 32) g.lineTo(x, y + Math.sin(x * 0.05 + i) * 4); g.lineTo(256, y + 16); g.lineTo(0, y + 16); g.fill(); }
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(50,40,30,${R(rd, 0.15, 0.4)})`; g.beginPath(); g.arc(rd() * 256, rd() * 256, R(rd, 0.8, 2.6), 0, 7); g.fill(); }
  }, [1, 1], 22),
  pasir: tex(256, 256, (g, rd) => {
    g.fillStyle = '#d6be84'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1500; i++) { const v = R(rd, -40, 40); g.fillStyle = `rgba(${200 + v},${170 + v},${110 + v},0.7)`; g.fillRect(rd() * 256, rd() * 256, R(rd, 1, 2.6), R(rd, 1, 2.6)); }
    for (let i = 0; i < 160; i++) { g.fillStyle = 'rgba(90,150,200,0.45)'; g.beginPath(); g.arc(rd() * 256, rd() * 256, R(rd, 0.8, 1.8), 0, 7); g.fill(); }
  }, [1, 1], 23),
  batuan: tex(256, 256, (g, rd) => {
    g.fillStyle = '#50555d'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 140; i++) { const v = R(rd, 60, 118); g.fillStyle = `rgba(${v},${v + 2},${v + 7},${R(rd, 0.1, 0.22)})`; g.beginPath(); g.arc(rd() * 256, rd() * 256, R(rd, 8, 30), 0, 7); g.fill(); }
    for (let i = 0; i < 2200; i++) { const v = R(rd, 40, 140); g.fillStyle = `rgba(${v},${v},${v + 4},0.55)`; g.fillRect(rd() * 256, rd() * 256, R(rd, 1, 2.4), R(rd, 1, 2.4)); }
  }, [1, 1], 24),
  rumput: tex(256, 256, (g, rd) => {
    g.fillStyle = '#6d9a49'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1600; i++) { g.strokeStyle = `hsl(${R(rd, 80, 105)},${R(rd, 40, 55)}%,${R(rd, 28, 50)}%)`; g.lineWidth = R(rd, 1, 2); const x = rd() * 256, y = rd() * 256; g.beginPath(); g.moveTo(x, y); g.lineTo(x + R(rd, -3, 3), y - R(rd, 5, 12)); g.stroke(); }
  }, [3, 1], 25),
  jalan: tex(256, 256, (g, rd) => {
    g.fillStyle = '#8f8c86'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i++) { const v = R(rd, 90, 170); g.fillStyle = `rgba(${v},${v},${v - 4},0.55)`; g.fillRect(rd() * 256, rd() * 256, 2, 2); }
    g.strokeStyle = 'rgba(40,40,40,0.4)'; g.lineWidth = 1.4; for (let i = 0; i < 5; i++) { g.beginPath(); let x = rd() * 256, y = rd() * 256; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += R(rd, -22, 22); y += R(rd, -22, 22); g.lineTo(x, y); } g.stroke(); }
  }, [2, 1], 26),
  kayu: tex(256, 256, (g, rd) => {
    g.fillStyle = '#8d6a3f'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(${R(rd, 50, 90)},${R(rd, 32, 55)},20,${R(rd, 0.15, 0.4)})`; g.lineWidth = R(rd, 1, 2.5); const x = rd() * 256; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + R(rd, -8, 8), 80, x + R(rd, -8, 8), 170, x + R(rd, -5, 5), 256); g.stroke(); }
  }, [1, 1], 27),
  air: tex(256, 256, (g, rd) => {
    const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#5b9bc3'); gr.addColorStop(1, '#3d7aa3'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 90; i++) { g.strokeStyle = `rgba(230,245,255,${R(rd, 0.1, 0.35)})`; g.lineWidth = R(rd, 1, 2.4); const y = rd() * 256, x = rd() * 256; g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + 20, y - 3, x + 40, y + 3, x + R(rd, 50, 90), y); g.stroke(); }
  }, [3, 1], 28),
}), []);
export type Bahan = ReturnType<typeof useBahan>;

const ulang = (m: THREE.Texture | undefined, rx: number, ry: number) => { if (!m) return undefined; const c = m.clone(); c.repeat.set(rx, ry); c.needsUpdate = true; return c; };
/** kotak bertekstur: rep = pengulangan tekstur (kira-kira ukuran muka / ukuran ubin) supaya tidak melar */
export const Blok: React.FC<{p: V3; s: V3; c?: string; map?: THREE.Texture; rep?: [number, number]; bump?: number; r?: number; o?: number; rot?: V3; bayang?: boolean}> =
  ({p, s, c = '#fff', map, rep = [1, 1], bump = 0, r: ro = 0.9, o = 1, rot = [0, 0, 0], bayang = true}) => {
    const m = useMemo(() => ulang(map, rep[0], rep[1]), [map, rep[0], rep[1]]);
    return (<mesh position={p} rotation={rot} castShadow={bayang && o >= 1} receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={m ? '#ffffff' : c} map={m} bumpMap={bump && m ? m : undefined} bumpScale={bump} roughness={ro} transparent={o < 1} opacity={o} depthWrite={o >= 1} />
    </mesh>);
  };

/** dinding berlubang (extrude); tekstur diulang tiap 1,6 m */
export const DindingLubang: React.FC<{L: number; H: number; T: number; holes: [number, number, number, number][]; map: THREE.Texture}> = ({L, H, T, holes, map}) => {
  const g = useMemo(() => {
    const s = new THREE.Shape(); s.moveTo(-L / 2, 0); s.lineTo(L / 2, 0); s.lineTo(L / 2, H); s.lineTo(-L / 2, H); s.closePath();
    holes.forEach(([x, y, w, h]) => { const p = new THREE.Path(); p.moveTo(x - w / 2, y); p.lineTo(x + w / 2, y); p.lineTo(x + w / 2, y + h); p.lineTo(x - w / 2, y + h); p.closePath(); s.holes.push(p); });
    const e = new THREE.ExtrudeGeometry(s, {depth: T, bevelEnabled: false}); e.translate(0, 0, -T / 2); return e;
  }, [L, H, T, holes]);
  const m = useMemo(() => ulang(map, 1 / 1.6, 1 / 1.6), [map]);
  return <mesh geometry={g} castShadow receiveShadow><meshStandardMaterial map={m} bumpMap={m} bumpScale={0.5} roughness={0.95} /></mesh>;
};

/** rumah kampung: pondasi bertumpuk, dinding plester kusam, pintu + jendela berjalusi, atap genteng dengan teritis, tiang teras, tangga.
 *  Titik 0 = permukaan tanah; lantai di tinggi `floor`. Lebar 3,6 (x), dalam 2,6 (z). */
export const RumahKampung: React.FC<{floor: number; extra: number; b: Bahan; genteng: THREE.Texture; beton: THREE.Texture; tanah: THREE.Texture}> = ({floor, extra, b, genteng, beton, tanah}) => {
  const W = 3.6, Dp = 2.6, T = 0.16, H = 2.5, hs = Dp / 2 + 0.75, rise = 1.05, ang = Math.atan2(rise, hs), Lr = Math.hypot(hs, rise) + 0.04;
  const fz = Dp / 2 - T / 2;
  const slab = [0.3, 0.3, 0.3];
  const n = Math.min(7, Math.ceil(floor / 0.28));
  return (<group>
    {slab.map((h, k) => <Blok key={k} p={[0, 0.15 + k * 0.3 - 0.01, 0]} s={[W + 0.2, h, Dp + 0.2]} map={k % 2 ? b.batuan : beton} rep={[2, 1]} bump={0.6} c="#b9b5ac" />)}
    {extra > 0.01 && <Blok p={[0, 0.89 + extra / 2, 0]} s={[W + 0.24, extra, Dp + 0.24]} map={tanah} rep={[2, 1]} bump={0.8} />}
    <group position={[0, floor - 0.02, 0]}>
      <group position={[0, 0, fz]}><DindingLubang L={W} H={H} T={T} holes={[[-0.9, 0.02, 0.9, 2.0], [0.85, 0.95, 1.0, 1.05]]} map={b.plester} /></group>
      <Blok p={[0, H / 2, -fz]} s={[W, H, T]} map={b.plester} rep={[2, 1.5]} bump={0.5} />
      <Blok p={[-(W / 2 - T / 2), H / 2, 0]} s={[T, H, Dp - 2 * T]} map={b.plester} rep={[1.5, 1.5]} bump={0.5} />
      <Blok p={[W / 2 - T / 2, H / 2, 0]} s={[T, H, Dp - 2 * T]} map={b.plester} rep={[1.5, 1.5]} bump={0.5} />
      {/* pintu kayu + kusen */}
      <Blok p={[-0.9, 1.0, fz]} s={[0.82, 1.96, 0.05]} map={b.kayu} bump={0.4} />
      <Blok p={[-0.9, 2.04, fz]} s={[1.0, 0.08, 0.12]} map={b.kayu} /><Blok p={[-1.36, 1.02, fz]} s={[0.07, 2.04, 0.12]} map={b.kayu} /><Blok p={[-0.44, 1.02, fz]} s={[0.07, 2.04, 0.12]} map={b.kayu} />
      {/* jendela: kaca + kusen + jalusi */}
      <Blok p={[0.85, 1.47, fz]} s={[0.94, 0.99, 0.02]} c="#9fc3d6" o={0.5} r={0.1} bayang={false} />
      <Blok p={[0.85, 2.0, fz]} s={[1.1, 0.07, 0.12]} map={b.kayu} /><Blok p={[0.85, 0.94, fz]} s={[1.1, 0.07, 0.24]} map={b.kayu} />
      <Blok p={[0.3, 1.47, fz]} s={[0.07, 1.14, 0.12]} map={b.kayu} /><Blok p={[1.4, 1.47, fz]} s={[0.07, 1.14, 0.12]} map={b.kayu} />
      {[0, 1, 2, 3, 4].map((i) => <Blok key={i} p={[0.85, 1.1 + i * 0.2, fz + 0.01]} s={[0.92, 0.035, 0.03]} map={b.kayu} />)}
      {/* atap genteng + teritis, bubungan, papan lisplang */}
      {[-1, 1].map((s) => <mesh key={s} position={[0, H + 0.06 + rise / 2, s * hs / 2]} rotation={[s * ang, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[W + 1.0, 0.07, Lr]} /><meshStandardMaterial map={ulang(genteng, 4, 3)} bumpMap={ulang(genteng, 4, 3)} bumpScale={0.9} roughness={0.85} /></mesh>)}
      <Blok p={[0, H + rise + 0.1, 0]} s={[W + 1.05, 0.12, 0.26]} c="#a34a2a" r={0.8} />
      <Blok p={[0, H - 0.04, hs - 0.04]} s={[W + 1.0, 0.1, 0.06]} map={b.kayu} />
      {/* tiang teras */}
      {[-1, 1].map((s) => <Blok key={s} p={[s * (W / 2 - 0.12), (H - 0.1) / 2, hs - 0.22]} s={[0.14, H - 0.1, 0.14]} map={b.kayu} bump={0.4} />)}
    </group>
    {Array.from({length: n}, (_, i) => i + 1).map((i) => { const top = (floor - 0.03) * (1 - (i - 1) / n), z = Dp / 2 + 0.2 + (i - 1) * 0.3; return <Blok key={`t${i}`} p={[1.55, (top - 0.05) / 2, z]} s={[0.9, top + 0.05, 0.3]} map={beton} rep={[1, 1]} bump={0.5} c="#b5b1a8" />; })}
  </group>);
};

/** tetangga + pohon pisang + tiang listrik: konteks kampung (latar) */
export const Kampung: React.FC<{b: Bahan; genteng: THREE.Texture}> = ({b, genteng}) => {
  const Rm: React.FC<{x: number; z: number; w: number; h: number; c: string}> = ({x, z, w, h, c}) => (<group position={[x, 0, z]}>
    <Blok p={[0, h / 2, 0]} s={[w, h, 1.8]} c={c} map={b.plester} rep={[1.2, 1]} bump={0.4} />
    {[-1, 1].map((s) => <mesh key={s} position={[0, h + 0.4, s * 0.55]} rotation={[s * 0.5, 0, 0]} castShadow><boxGeometry args={[w + 0.5, 0.06, 1.35]} /><meshStandardMaterial map={ulang(genteng, 3, 2)} roughness={0.85} /></mesh>)}
  </group>);
  return (<group>
    <Rm x={-3.9} z={-2.7} w={2.4} h={1.9} c="#cfe0dc" /><Rm x={4.3} z={-3.0} w={2.6} h={2.1} c="#e0d2b6" />
    <group position={[3.1, 0, -2.0]}>
      <mesh position={[0, 0.9, 0]} castShadow><cylinderGeometry args={[0.1, 0.13, 1.8, 10]} /><meshStandardMaterial color="#8aa05a" roughness={0.9} /></mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => <mesh key={i} position={[Math.cos(i * 1.05) * 0.55, 1.85 + (i % 2) * 0.12, Math.sin(i * 1.05) * 0.55]} rotation={[0.9 * Math.sin(i * 1.05), 0, -0.9 * Math.cos(i * 1.05)]} castShadow><boxGeometry args={[0.35, 0.03, 1.5]} /><meshStandardMaterial color="#5f9a43" roughness={0.8} side={THREE.DoubleSide} /></mesh>)}
    </group>
    <mesh position={[-3.0, 2.1, -2.4]} castShadow><cylinderGeometry args={[0.05, 0.07, 4.2, 8]} /><meshStandardMaterial color="#6b5a46" roughness={0.9} /></mesh>
    <Blok p={[-3.0, 3.85, -2.4]} s={[1.0, 0.05, 0.05]} c="#5a4a38" />
  </group>);
};
