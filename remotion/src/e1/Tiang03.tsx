// E1 #03 "Tiang Listrik di Depan Pagar, Tolak Rezeki?". 100% kode: Remotion + three.js, tanpa API AI.
// 1 satuan = 1 meter. Skill motion iart-ai: isometric-animation (kamera ortografis, build lapis bawah-ke-atas, angkat di sumbu Y bukan skala,
// cahaya satu arah tetap) + threejs-animation (semua gerak fungsi waktu, peredaman kamera, acak ber-seed).
// Aturan z-fighting: tak ada permukaan sebidang; benda yang menumpu menancap 0,02 m ke penopang.
// Breakdown = SATU adegan (22,0-33,6 dtk): atap diangkat, lantai 2 + balkon + kanopi masuk, zona kabel bertegangan (ilustrasi, tanpa angka jarak).
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {useMemo} from 'react';
import {AbsoluteFill, Audio, Easing, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/inter/600.css'; import '@fontsource/inter/700.css'; import '@fontsource/inter/900.css';
import * as THREE from 'three';
import {Env} from '../pengetahuan/Scene';
import {Rig} from '../kit/stage';
import {Captions} from '../kit/teks';
import {camAt, FPS, nudgeKey, proj, projIso, r, type Key, type V3} from '../kit/waktu';
import {C, Kicker, useTex} from './AnatomiRumah';
import {Blok, useBahan} from './look';
import wordsJson from '../../public/e1-03/words.json';

export const R03_FRAMES = Math.round(68.4 * FPS);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const back = Easing.out(Easing.back(1.4));
const orb = (t: number, az: number, el: number, d: number, look: V3): Key => { const A = az * Math.PI / 180, E = el * Math.PI / 180; return {t, pos: [look[0] + d * Math.cos(E) * Math.sin(A), look[1] + d * Math.sin(E), look[2] + d * Math.cos(E) * Math.cos(A)], look}; };
const iso = (t: number, look: V3, zoom: number, az = 45, el = 35.264): Key => ({t, pos: [0, 0, 0], look, zoom, az, el});

// ---------- tata letak (meter) ----------
const PAGAR_Z = 2.6, TIANG: V3 = [-0.3, 0, 3.0], FASAD_Z = -2.2, H1 = 3.2, H2 = 3.0, RW = 7.2;
const KABEL_TR = 7.0, KABEL_TM = 8.7; // tinggi kabel tegangan rendah (pilin) dan menengah (3 kawat)

// ---------- keadaan per waktu ----------
const pose = (t: number): {x: number; z: number; yaw: number} => {
  const a = r(t, 10.8, 15.4), b = r(t, 15.4, 20.3, Easing.inOut(Easing.quad));
  const shake = t > 20.3 && t < 21.0 ? Math.sin((t - 20.3) * 60) * 0.025 * (1 - (t - 20.3) / 0.7) : 0;
  if (t >= 22.05) return {x: -1.95, z: -0.2, yaw: 0}; // setelah adegan denah: mobil kembali parkir
  return {x: lerp(-1.95, -2.18, b) + shake, z: lerp(lerp(-0.2, 3.1, a), 4.5, b), yaw: lerp(0, -25, b) * Math.PI / 180};
};
const keadaan = (t: number) => ({
  atapNaik: r(t, 29.6, 30.4, Easing.inOut(Easing.cubic)) * (1 - r(t, 31.0, 31.7, Easing.inOut(Easing.cubic))),
  lantai2: r(t, 30.3, 31.3, back),
  kanopi: r(t, 31.6, 32.5, back),
  zona: r(t, 25.6, 26.4) * (1 - r(t, 33.4, 33.9)),
  dijual: r(t, 34.0, 34.8, back) * (1 - r(t, 41.0, 41.5)),
  pindah: r(t, 42.2, 44.4, Easing.inOut(Easing.cubic)) * (1 - r(t, 45.8, 46.3)),
  lt2: t >= 30.3 && t < 33.9,
});

// ---------- objek ----------
const Pipa: React.FC<{pts: V3[]; rad: number; c: string; o?: number}> = ({pts, rad, c, o = 1}) => {
  const g = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), 48, rad, 8, false), [JSON.stringify(pts), rad]);
  return <mesh geometry={g} castShadow={o >= 1}><meshStandardMaterial color={c} roughness={0.5} transparent={o < 1} opacity={o} depthWrite={o >= 1} /></mesh>;
};
const sag = (x0: number, x1: number, y: number, z: number, d = 0.35): V3[] => Array.from({length: 9}, (_, i) => { const k = i / 8; return [lerp(x0, x1, k), y - d * 4 * k * (1 - k), z]; });

/** tiang beton PLN 9 m: lancip, palang besi, isolator, kabel pilin TR terikat di bawah */
const TiangPLN: React.FC<{beton: THREE.Texture; o?: number; hi?: number}> = ({beton, o = 1, hi = 0}) => {
  const m = useMemo(() => { const c = beton.clone(); c.repeat.set(1, 6); c.needsUpdate = true; return c; }, [beton]);
  const col = new THREE.Color('#b9b6ae').lerp(new THREE.Color('#ef6a4c'), hi);
  return (<group>
    <mesh position={[0, 4.5, 0]} castShadow={o >= 1} receiveShadow><cylinderGeometry args={[0.1, 0.15, 9.0, 18]} /><meshStandardMaterial color={col} map={m} bumpMap={m} bumpScale={0.4} roughness={0.85} transparent={o < 1} opacity={o} depthWrite={o >= 1} /></mesh>
    <mesh position={[0, 8.62, 0]}><boxGeometry args={[0.09, 0.09, 1.9]} /><meshStandardMaterial color="#5c6066" metalness={0.6} roughness={0.45} transparent={o < 1} opacity={o} /></mesh>
    {[-0.8, 0, 0.8].map((z) => <mesh key={z} position={[0, 8.72, z]}><cylinderGeometry args={[0.06, 0.07, 0.16, 10]} /><meshStandardMaterial color="#d9d4c4" roughness={0.3} transparent={o < 1} opacity={o} /></mesh>)}
    <mesh position={[0, KABEL_TR, 0.17]}><boxGeometry args={[0.12, 0.22, 0.14]} /><meshStandardMaterial color="#3a3d42" roughness={0.5} transparent={o < 1} opacity={o} /></mesh>
    <mesh position={[0, 2.6, 0.155]}><boxGeometry args={[0.24, 0.32, 0.02]} /><meshStandardMaterial color="#e8c43a" roughness={0.6} transparent={o < 1} opacity={o} /></mesh>
  </group>);
};

/** mobil skala nyata (4,2 x 1,75 x 1,5). Lokal: hidung ke -z. Spion & bemper bisa disorot merah. */
const Mobil03: React.FC<{hi: number}> = ({hi}) => {
  const cat = '#7d8fa3', merah = new THREE.Color('#e0442e');
  const sorot = (c: string) => new THREE.Color(c).lerp(merah, hi);
  return (<group>
    <mesh position={[0, 0.62, 0]} castShadow><boxGeometry args={[1.74, 0.62, 4.15]} /><meshStandardMaterial color={cat} roughness={0.35} metalness={0.3} /></mesh>
    <mesh position={[0, 1.18, 0.25]} castShadow><boxGeometry args={[1.5, 0.52, 2.1]} /><meshStandardMaterial color={cat} roughness={0.35} metalness={0.3} /></mesh>
    <mesh position={[0, 1.2, 0.25]}><boxGeometry args={[1.54, 0.4, 1.96]} /><meshStandardMaterial color="#2c3a48" roughness={0.1} metalness={0.4} /></mesh>
    {[-1.32, 1.32].flatMap((z) => [-0.8, 0.8].map((x) => <mesh key={`${x}${z}`} position={[x, 0.33, z]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.32, 0.32, 0.22, 20]} /><meshStandardMaterial color="#1e1f22" roughness={0.8} /></mesh>))}
    {/* bemper depan & belakang */}
    <mesh position={[0, 0.42, -2.1]}><boxGeometry args={[1.8, 0.26, 0.14]} /><meshStandardMaterial color={sorot('#3a3d42')} emissive={merah} emissiveIntensity={hi * 0.6} roughness={0.6} /></mesh>
    <mesh position={[0, 0.42, 2.1]}><boxGeometry args={[1.8, 0.26, 0.14]} /><meshStandardMaterial color="#3a3d42" roughness={0.6} /></mesh>
    {/* spion */}
    {[-1, 1].map((s) => <mesh key={s} position={[s * 0.98, 1.0, -0.62]}><boxGeometry args={[0.24, 0.15, 0.12]} /><meshStandardMaterial color={sorot(cat)} emissive={merah} emissiveIntensity={hi * 0.6} roughness={0.4} /></mesh>)}
    {[-0.55, 0.55].map((x) => <mesh key={x} position={[x, 0.7, -2.09]}><boxGeometry args={[0.36, 0.14, 0.04]} /><meshStandardMaterial color="#f4f0e0" roughness={0.3} /></mesh>)}
    {[-0.6, 0.6].map((x) => <mesh key={x} position={[x, 0.75, 2.09]}><boxGeometry args={[0.32, 0.12, 0.04]} /><meshStandardMaterial color="#b43a2a" roughness={0.3} /></mesh>)}
  </group>);
};

/** rumah depan: carport kiri, teras + pintu + jendela kanan, atap pelana genteng. Fasad di z = FASAD_Z. Lantai 2 + balkon (breakdown). */
const Rumah03: React.FC<{k: ReturnType<typeof keadaan>; b: ReturnType<typeof useBahan>; x: ReturnType<typeof useTex>}> = ({k, b, x}) => {
  const D = 7, cz = FASAD_Z - D / 2, T = 0.16;
  const tinggi = H1 + (k.lt2 ? H2 * Math.min(1, k.lantai2) : 0);
  const atapY = tinggi + k.atapNaik * 2.6;
  const Lantai: React.FC<{y: number; h: number; pintu: boolean}> = ({y, h, pintu}) => (<group position={[0, y, 0]}>
    <Blok p={[0, h / 2, cz]} s={[RW, h, D]} map={b.plester} rep={[3, 1.4]} bump={0.4} c="#e6dccb" />
    {/* bukaan fasad: pintu + jendela (menonjol 0,03 dari dinding) */}
    {pintu && <Blok p={[1.0, 1.0, FASAD_Z + 0.03]} s={[0.9, 2.0, 0.08]} map={b.kayu} bump={0.4} />}
    <Blok p={[pintu ? 2.6 : -1.6, h * 0.55, FASAD_Z + 0.03]} s={[1.3, 1.1, 0.06]} c="#86aac0" r={0.12} />
    <Blok p={[pintu ? 2.6 : -1.6, h * 0.55 - 0.6, FASAD_Z + 0.06]} s={[1.45, 0.08, 0.14]} map={b.kayu} />
    {!pintu && <Blok p={[1.6, h * 0.55, FASAD_Z + 0.03]} s={[1.3, 1.1, 0.06]} c="#86aac0" r={0.12} />}
  </group>);
  return (<group>
    <Lantai y={0.15} h={H1} pintu />
    {/* lantai 2 jatuh dari atas (isometric build: angkat di sumbu Y, bukan skala) */}
    {k.lt2 && <group position={[0, 0.15 + H1 + (1 - k.lantai2) * 4.0 - 0.02, 0]}>
      <Lantai y={0} h={H2} pintu={false} />
      {/* balkon menjorok ke depan, mendekati kabel */}
      <Blok p={[1.8, 0.05, FASAD_Z + 1.5]} s={[3.4, 0.16, 3.0]} c="#cfc9bd" map={x.beton} rep={[2, 1]} bump={0.3} />
      {[0.15, 3.45].map((xx) => <Blok key={xx} p={[xx, 0.6, FASAD_Z + 2.95]} s={[0.06, 1.0, 0.06]} c="#2f3236" r={0.4} />)}
      <Blok p={[1.8, 1.1, FASAD_Z + 2.95]} s={[3.4, 0.06, 0.06]} c="#2f3236" r={0.4} />
    </group>}
    {/* atap pelana */}
    <group position={[0, 0.15 + atapY - 0.02, cz]}>
      {[-1, 1].map((s) => <mesh key={s} position={[0, 0.7, s * 1.95]} rotation={[s * 0.62, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[RW + 0.8, 0.08, 4.75]} /><meshStandardMaterial color="#ffffff" map={x.genteng} bumpMap={x.genteng} bumpScale={0.8} roughness={0.85} /></mesh>)}
      <Blok p={[0, 1.45, 0]} s={[RW + 0.85, 0.12, 0.28]} c="#a34a2a" r={0.8} />
    </group>
    {/* kanopi carport (breakdown): rangka + atap polikarbonat menjorok ke pagar */}
    {k.kanopi > 0.01 && <group position={[-1.9, 0.15 + 2.9, FASAD_Z]}>
      <Blok p={[0, 0, 2.4 * k.kanopi]} s={[3.3, 0.06, 4.8 * k.kanopi]} c="#9fb7c4" o={0.75} r={0.2} bayang={false} />
      {[-1.6, 1.6].map((xx) => <Blok key={xx} p={[xx, -0.05, 2.4 * k.kanopi]} s={[0.08, 0.1, 4.8 * k.kanopi]} c="#2f3236" r={0.4} />)}
    </group>}
    {/* lantai carport + teras */}
    <Blok p={[-1.9, 0.07, (FASAD_Z + PAGAR_Z) / 2]} s={[3.4, 0.14, PAGAR_Z - FASAD_Z]} map={x.beton} rep={[2, 3]} bump={0.3} c="#bdb8ad" />
    <Blok p={[1.85, 0.1, (FASAD_Z + PAGAR_Z) / 2]} s={[3.5, 0.2, PAGAR_Z - FASAD_Z]} map={b.rumput} rep={[2, 3]} bump={0.6} />
  </group>);
};

/** pagar: tembok rendah + teralis, gerbang carport terbuka (kiri) */
const Pagar: React.FC<{b: ReturnType<typeof useBahan>; dijual: number}> = ({b, dijual}) => (<group position={[0, 0, PAGAR_Z]}>
  <Blok p={[2.0, 0.4, 0]} s={[3.2, 0.8, 0.2]} map={b.plester} rep={[2, 0.5]} bump={0.4} c="#e6dccb" />
  {Array.from({length: 13}, (_, i) => 0.55 + i * 0.25).map((xx) => <Blok key={xx} p={[xx, 1.15, 0]} s={[0.04, 0.7, 0.04]} c="#2f3236" r={0.4} />)}
  <Blok p={[2.0, 1.5, 0]} s={[3.2, 0.05, 0.05]} c="#2f3236" r={0.4} />
  {[-3.55, 0.4, 3.55].map((xx) => <Blok key={xx} p={[xx, 0.8, 0]} s={[0.3, 1.6, 0.3]} map={b.plester} bump={0.4} c="#d8cdb9" />)}
  {/* daun gerbang terbuka, dilipat ke dalam di kiri */}
  <group position={[-3.4, 0, -0.1]} rotation={[0, -1.35, 0]}>
    {Array.from({length: 9}, (_, i) => 0.15 + i * 0.16).map((xx) => <Blok key={xx} p={[xx, 0.85, 0]} s={[0.04, 1.5, 0.04]} c="#2f3236" r={0.4} />)}
    <Blok p={[0.8, 1.55, 0]} s={[1.5, 0.05, 0.05]} c="#2f3236" r={0.4} /><Blok p={[0.8, 0.15, 0]} s={[1.5, 0.05, 0.05]} c="#2f3236" r={0.4} />
  </group>
  {/* papan DIJUAL */}
  {dijual > 0.01 && <group position={[2.0, 1.55 + 0.35 * dijual, 0.14]} scale={[1, dijual, 1]}>
    <mesh><boxGeometry args={[1.5, 0.7, 0.03]} /><meshStandardMaterial color="#fbf6ea" roughness={0.7} /></mesh>
    <mesh position={[0, 0.12, 0.02]}><boxGeometry args={[1.25, 0.24, 0.01]} /><meshStandardMaterial color="#d23b2a" roughness={0.6} /></mesh>
    <mesh position={[0, -0.18, 0.02]}><boxGeometry args={[1.0, 0.1, 0.01]} /><meshStandardMaterial color="#2f3236" roughness={0.6} /></mesh>
  </group>}
</group>);

const Tetangga: React.FC<{x0: number; c: string; b: ReturnType<typeof useBahan>; g: THREE.Texture}> = ({x0, c, b, g}) => (<group position={[x0, 0, FASAD_Z - 3.5]}>
  <Blok p={[0, 1.6, 0]} s={[6.4, 3.2, 7]} c={c} map={b.plester} rep={[3, 1.4]} bump={0.4} />
  {[-1, 1].map((s) => <mesh key={s} position={[0, 3.9, s * 1.95]} rotation={[s * 0.62, 0, 0]} castShadow><boxGeometry args={[7.0, 0.08, 4.75]} /><meshStandardMaterial map={g} roughness={0.85} /></mesh>)}
  <Blok p={[0, 0.5, 6.1]} s={[6.2, 1.0, 0.2]} map={b.plester} rep={[2, 0.5]} c={c} bump={0.3} />
</group>);

const Dunia: React.FC<{t: number}> = ({t}) => {
  const b = useBahan(), x = useTex(), k = keadaan(t), p = pose(t);
  const hiMobil = t > 10 && t < 23 ? r(t, 20.2, 20.6) * (1 - r(t, 22.0, 22.6)) : 0;
  const tempelRumah: V3 = [2.6, 2.9, FASAD_Z + 0.05];
  const tiangX = lerp(TIANG[0], 4.6, k.pindah);
  return (<group>
    {/* tanah, jalan, selokan */}
    <Blok p={[0, -0.1, -2]} s={[40, 0.2, 14]} map={b.rumput} rep={[12, 4]} bump={0.6} />
    <Blok p={[0, -0.06, 6.0]} s={[40, 0.14, 5.4]} map={b.jalan} rep={[10, 1.5]} bump={0.4} c="#8f8c86" />
    <Blok p={[0, -0.12, 3.05]} s={[40, 0.1, 0.5]} c="#6e6a62" r={0.9} />
    {[-14, -9, -4, 1, 6, 11, 16].map((xx) => <Blok key={xx} p={[xx, 0.015, 6.0]} s={[2.2, 0.02, 0.12]} c="#e8e3d6" r={0.8} bayang={false} />)}
    <Rumah03 k={k} b={b} x={x} />
    <Pagar b={b} dijual={k.dijual} />
    <Tetangga x0={-8.6} c="#d9e3dc" b={b} g={x.genteng} /><Tetangga x0={8.6} c="#e8dcc4" b={b} g={x.genteng} />
    {/* tiang + kabel */}
    <group position={TIANG}><TiangPLN beton={x.beton} hi={t > 57.6 && t < 63.6 ? 0.25 * r(t, 58.0, 58.6) : 0} /></group>
    {k.pindah > 0.01 && <group position={[tiangX, 0, TIANG[2]]}><TiangPLN beton={x.beton} o={0.4 * Math.min(1, k.pindah * 4)} /></group>}
    {[-0.8, 0, 0.8].map((dz) => <Pipa key={dz} pts={sag(-20, 20, KABEL_TM + 0.08, TIANG[2] + dz, 0.5)} rad={0.012} c="#6d7178" />)}
    <Pipa pts={sag(-20, 20, KABEL_TR + 0.02, TIANG[2] + 0.17, 0.4)} rad={0.035} c="#1d1e21" />
    {/* sambungan rumah (SR) dari tiang ke rumah */}
    <Pipa pts={[[TIANG[0], KABEL_TR - 0.05, TIANG[2] + 0.1], [1.4, 4.9, 0.3], [tempelRumah[0], tempelRumah[1], tempelRumah[2]]]} rad={0.015} c="#1d1e21" />
    {/* zona kabel bertegangan (ilustrasi, bukan ukuran resmi) */}
    {k.zona > 0.01 && <group>
      <mesh position={[0, KABEL_TR + 0.4, TIANG[2]]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.85, 0.85, 22, 32, 1, true]} /><meshBasicMaterial color="#ef4b33" transparent opacity={(0.16 + 0.1 * (k.kanopi > 0.5 ? Math.abs(Math.sin(t * 5)) : 0)) * k.zona} depthWrite={false} side={THREE.DoubleSide} /></mesh>
    </group>}
    <group position={[p.x, 0.02, p.z]} rotation={[0, p.yaw, 0]}><Mobil03 hi={hiMobil} /></group>
  </group>);
};

// ---------- kamera ----------
// perspektif (adegan rumah) dan ortografis-isometrik (adegan denah mobil 10,2-22 dan breakdown 22-33,6)
const KP: Key[] = [orb(0, 30, 4, 21, [1.4, 3.4, 2.6]), orb(4.8, 22, 4, 16.5, [1.2, 3.4, 2.8]), orb(9.9, -14, 8, 19, [0, 3.4, 1.5]),
  orb(33.6, 22, 6, 20, [0.6, 2.6, 1.5]), orb(41.0, 10, 6, 19, [0.6, 2.8, 1.8]), orb(45.8, -6, 9, 23, [2.0, 3.6, 2.0]), orb(57.6, -10, 9, 23, [1.4, 3.4, 2.0]),
  orb(58.4, 28, 4, 10.5, [-0.3, 2.6, 3.0]), orb(63.4, 38, 6, 9.5, [-0.3, 3.0, 3.0]), orb(64.2, 10, 10, 24, [0, 3.6, 1.5]), orb(68.4, 2, 14, 30, [0, 3.6, 1.0])];
const KI: Key[] = [iso(10.2, [-1.4, 0.5, 2.6], 82, 20, 58), iso(15.5, [-1.4, 0.5, 3.0], 90, 16, 60), iso(21.8, [-1.0, 0.6, 3.4], 108, 12, 58),
  iso(22.3, [0, 4.2, 0], 84, 62, 16), iso(29.4, [0, 4.4, 0.2], 86, 56, 15), iso(33.6, [0, 4.8, 0.4], 90, 48, 14)];
const isIso = (t: number) => t >= 10.2 && t < 33.6;

const IsoRig: React.FC<{k: Key}> = ({k}) => {
  const cam = useThree((s) => s.camera) as THREE.OrthographicCamera;
  const az = (k.az ?? 45) * Math.PI / 180, el = (k.el ?? 35.264) * Math.PI / 180, D = 40;
  cam.position.set(k.look[0] + D * Math.cos(el) * Math.sin(az), k.look[1] + D * Math.sin(el), k.look[2] + D * Math.cos(el) * Math.cos(az));
  cam.zoom = k.zoom ?? 100; cam.near = -60; cam.far = 160; cam.updateProjectionMatrix(); cam.lookAt(...k.look);
  return null;
};

// ---------- overlay 2D ----------
type Lb = {a: number; b: number; text: string; at: V3 | ((t: number) => V3); side: 'L' | 'R'; dy?: number; merah?: boolean};
const Label2: React.FC<{l: Lb; t: number; cam: Key; isoCam: boolean}> = ({l, t, cam, isoCam}) => {
  const i = r(t, l.a, l.a + 0.35, Easing.out(Easing.cubic)), o = 1 - r(t, l.b - 0.3, l.b); if (i * o <= 0.01) return null;
  const at = typeof l.at === 'function' ? l.at(t) : l.at;
  const [px, py0] = isoCam ? projIso(cam, at) : proj(cam, at), py = Math.max(400, Math.min(1320, py0 + (l.dy ?? 0)));
  const L = l.side === 'L', ex = L ? 60 : 1020, p = i * o, col = l.merah ? '#e0442e' : '#ef6a4c';
  return (<>
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: p, pointerEvents: 'none'}}>
      <path d={`M ${L ? ex + 230 : ex - 230} ${py} L ${px} ${py0}`} stroke={col} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 * (1 - i)} />
      <circle cx={px} cy={py0} r={9} fill={col} stroke="#fff" strokeWidth={3} />
    </svg>
    <div style={{position: 'absolute', top: py - 36, [L ? 'left' : 'right']: L ? ex : 1080 - ex, padding: '10px 22px 12px', borderRadius: 18, background: l.merah ? '#e0442e' : 'rgba(252,250,245,0.96)', boxShadow: '0 8px 28px rgba(30,30,30,0.22)', fontFamily: 'Inter', fontWeight: 700, fontSize: 40, color: l.merah ? '#fff' : '#2a2a2e', whiteSpace: 'nowrap', opacity: p, transform: `translateX(${(L ? -1 : 1) * 40 * (1 - i)}px)`}}>{l.text}</div>
  </>);
};
const sudut = (t: number, lx: number, lz: number): V3 => { const p = pose(t); const c = Math.cos(p.yaw), s = Math.sin(p.yaw); return [p.x + lx * c + lz * s, 0.9, p.z - lx * s + lz * c]; };
const LABELS: Lb[] = [
  {a: 0.6, b: 4.7, text: 'Tiang listrik', at: [TIANG[0], 5.5, TIANG[2]], side: 'R'},
  {a: 1.6, b: 4.7, text: 'Pagar', at: [2.6, 1.2, PAGAR_Z], side: 'R', dy: 120},
  {a: 15.4, b: 21.8, text: 'Belok tajam', at: (t) => sudut(t, 0, 2.1), side: 'L'},
  {a: 20.4, b: 21.8, text: 'Spion', at: (t) => sudut(t, 0.98, -0.62), side: 'R', merah: true, dy: -170},
  {a: 20.6, b: 21.8, text: 'Bemper', at: (t) => sudut(t, 0.8, -2.1), side: 'R', merah: true, dy: 90},
  {a: 25.6, b: 33.4, text: 'Kabel bertegangan', at: [-4.2, KABEL_TR, TIANG[2] + 0.17], side: 'L'},
  {a: 28.0, b: 33.4, text: 'Sambungan ke rumah', at: [1.6, 4.85, 0.4], side: 'R', dy: -110},
  {a: 30.6, b: 33.4, text: 'Lantai 2 + balkon', at: [2.6, 3.9, FASAD_Z + 2.9], side: 'R', dy: 110},
  {a: 31.8, b: 33.4, text: 'Kanopi', at: [-2.6, 3.06, 1.6], side: 'L', dy: 60},
  {a: 58.6, b: 63.4, text: 'Aset PLN', at: [TIANG[0], 2.6, TIANG[2] + 0.2], side: 'R'},
  {a: 59.6, b: 63.4, text: 'Kabel tetap bertegangan', at: [-1.6, KABEL_TR, TIANG[2] + 0.17], side: 'L', merah: true, dy: 330},
];

const Kartu: React.FC<{t: number; a: number; b: number; rows: [string, string, number][]; catatan?: string}> = ({t, a, b, rows, catatan}) => {
  const i = r(t, a, a + 0.5, Easing.out(Easing.cubic)), o = 1 - r(t, b - 0.5, b); if (i * o <= 0.01) return null;
  return (<>
    <AbsoluteFill style={{background: '#f6f1e6', opacity: 0.86 * i * o}} />
    <div style={{position: 'absolute', left: 70, right: 70, top: 330, fontFamily: 'Inter', opacity: i * o}}>
      {rows.map(([n, tx, at]) => { const p = r(t, at, at + 0.5, Easing.out(Easing.cubic)); return (<div key={n} style={{display: 'flex', gap: 26, alignItems: 'center', padding: '24px 32px', marginBottom: 30, borderRadius: 26, background: '#fbf8f1', boxShadow: '0 10px 30px rgba(30,30,30,0.16)', opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
        <div style={{fontWeight: 900, fontSize: 80, color: '#ef6a4c', minWidth: 60}}>{n}</div>
        <div style={{fontWeight: 800, fontSize: 50, color: '#2a2a2e', lineHeight: 1.15, letterSpacing: -1}}>{tx}</div>
      </div>); })}
      {catatan && <div style={{textAlign: 'center', fontWeight: 600, fontSize: 30, color: '#5a5a5e', opacity: r(t, 53.8, 54.3)}}>{catatan}</div>}
    </div>
  </>);
};
const Tawar: React.FC<{t: number}> = ({t}) => {
  const i = r(t, 36.6, 37.1, back), o = 1 - r(t, 40.6, 41.0); if (i * o <= 0.01) return null;
  const turun = r(t, 37.4, 39.6, Easing.inOut(Easing.cubic));
  return (<div style={{position: 'absolute', right: 70, top: 300, width: 420, padding: '24px 28px', borderRadius: 26, background: '#fbf8f1', boxShadow: '0 12px 34px rgba(30,30,30,0.22)', fontFamily: 'Inter', opacity: i * o, transform: `scale(${0.85 + 0.15 * i})`}}>
    <div style={{fontWeight: 700, fontSize: 36, color: '#5a5a5e'}}>Harga rumah</div>
    <div style={{height: 34, borderRadius: 17, background: '#e8e2d4', marginTop: 16, overflow: 'hidden'}}><div style={{width: `${100 - 32 * turun}%`, height: '100%', background: turun > 0.5 ? '#e0442e' : '#3f8a5c'}} /></div>
    <div style={{fontWeight: 900, fontSize: 46, color: '#e0442e', marginTop: 14, opacity: r(t, 38.2, 38.7)}}>ditawar turun ↓</div>
  </div>);
};
const Larangan: React.FC<{t: number}> = ({t}) => {
  const i = r(t, 58.2, 58.7, back), o = 1 - r(t, 63.0, 63.5); if (i * o <= 0.01) return null;
  return (<svg width={260} height={260} style={{position: 'absolute', left: 410, top: 300, opacity: i * o, transform: `scale(${i})`}}>
    <circle cx={130} cy={130} r={110} fill="rgba(255,255,255,0.85)" stroke="#e0442e" strokeWidth={22} />
    <path d="M 115 60 L 80 140 L 125 140 L 105 205 L 175 110 L 130 110 L 150 60 Z" fill="#2a2a2e" />
    <line x1={52} y1={52} x2={208} y2={208} stroke="#e0442e" strokeWidth={22} />
  </svg>);
};
const Langit: React.FC<{t: number}> = ({t}) => (
  <svg width={1080} height={1100} style={{position: 'absolute', left: 0, top: 0}}>
    <defs><filter id="kabur3"><feGaussianBlur stdDeviation="18" /></filter><radialGradient id="mt3" cx="0.15" cy="0.05" r="0.6"><stop offset="0" stopColor="#fff6d8" stopOpacity="0.85" /><stop offset="1" stopColor="#fff6d8" stopOpacity="0" /></radialGradient></defs>
    <rect width={1080} height={1100} fill="url(#mt3)" />
    {[[120, 300, 210, 46, 7], [620, 220, 260, 52, 5], [900, 420, 200, 40, 9], [330, 560, 240, 44, 6]].map(([x, y, rx, ry, v], i) => <g key={i} filter="url(#kabur3)" opacity={0.7}>
      <ellipse cx={((x + t * v) % 1500) - 200} cy={y} rx={rx} ry={ry} fill="#ffffff" /><ellipse cx={((x + t * v) % 1500) - 200 + rx * 0.5} cy={y - ry * 0.5} rx={rx * 0.6} ry={ry * 0.8} fill="#ffffff" />
    </g>)}
  </svg>
);

const Cahaya: React.FC = () => (<>
  <hemisphereLight args={['#dbeaff', '#8a7a62', 0.55]} />
  <directionalLight position={[-8, 14, 10]} intensity={2.6} color="#fff4e0" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-10} shadow-camera-near={1} shadow-camera-far={60} shadow-bias={-0.0004} shadow-normalBias={0.03} />
</>);

export const Tiang03: React.FC<{nudge?: number}> = ({nudge = 0}) => {
  const f = useCurrentFrame(), t = f / FPS, ms = t * 1000, words = (wordsJson as {words: {word: string; start: number; end: number}[]}).words;
  const isoNow = isIso(t);
  const cam = isoNow ? camAt(KI.filter((k) => (t < 22.05 ? k.t <= 21.8 : k.t >= 22.3)), t) : nudgeKey(camAt(KP, t), nudge);
  const dip = Math.max(0, ...[10.2, 22.05, 33.6, 58.0, 64.0].map((c) => r(t, c - 0.35, c) * (1 - r(t, c, c + 0.35))));
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#bcd8ee 0%,#e6eef0 55%,#f3e9d6 100%)'}}>
      <Audio src={staticFile('e1-03/vo.wav')} />
      <Langit t={t} />
      <AbsoluteFill style={{filter: 'contrast(1.07) saturate(1.1)'}}>
        {isoNow
          ? <ThreeCanvas orthographic width={1080} height={1920} camera={{position: [20, 20, 20], zoom: 100, near: -60, far: 160}} gl={{alpha: true, antialias: true}} shadows>
              <Env intensity={0.8} /><IsoRig k={cam} /><Cahaya /><Dunia t={t} />
            </ThreeCanvas>
          : <ThreeCanvas width={1080} height={1920} camera={{position: cam.pos, fov: 34}} gl={{alpha: true, antialias: true}} shadows>
              <Env intensity={0.8} /><Rig k={cam} /><Cahaya /><fog attach="fog" args={['#e8eef0', 40, 110]} /><Dunia t={t} />
            </ThreeCanvas>}
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,24,34,0.3) 100%)', pointerEvents: 'none'}} />
      {LABELS.map((l) => <Label2 key={l.text} l={l} t={t} cam={cam} isoCam={isoNow} />)}
      <Tawar t={t} />
      <Larangan t={t} />
      <Kicker t={t} a={0.3} b={4.8} text="Tolak rezeki?" />
      <Kicker t={t} a={5.0} b={10.0} text="Yang seret apa?" />
      <Kicker t={t} a={10.6} b={21.9} text="1. Keluar masuk" />
      <Kicker t={t} a={22.4} b={33.4} text="2. Kabel di atasnya" />
      <Kicker t={t} a={33.9} b={40.0} text="3. Pas mau dijual" />
      <Kicker t={t} a={40.1} b={42.6} text="Ini yang seret" />
      <Kicker t={t} a={42.8} b={57.6} text="Bisa dipindah" />
      <Kicker t={t} a={58.2} b={63.4} text="Jangan geser sendiri" />
      <Kicker t={t} a={63.9} b={66.4} text="Rumahmu juga?" />
      <Kicker t={t} a={66.5} b={68.4} text="Fakta Rumah" />
      <Kartu t={t} a={46.3} b={57.6} rows={[['1', 'Lapor PLN 123 atau aplikasi PLN Mobile', 46.4], ['2', 'Petugas survei lokasi', 49.9], ['3', 'Biaya ditanggung pemilik rumah', 51.3]]}
        catatan="Kasus berita: beberapa juta s.d. Rp11 juta (detik.com)" />
      <AbsoluteFill style={{background: '#fbf8f1', opacity: dip, pointerEvents: 'none'}} />
      <Captions ms={ms} words={words} />
    </AbsoluteFill>
  );
};
void C;
