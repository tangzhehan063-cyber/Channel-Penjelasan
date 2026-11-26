// E1 #05 "Sumur Kering gara-gara Sumur Bor Tetangga". Gaya E1-03 (style/gaya-e1-03.md). 100% kode: Remotion + three.js, tanpa API AI.
// Waktu = VO final public/e1-05 (65,9 dtk, Gemini Achernar). Rencana adegan: e1/e05-sumur-kering.md.
// Skill pustaka: isometric-animation (potongan tanah, kamera tele di satu kanvas), beat-sync-editing (cue dari words.json),
// color-motion (sumur kering = merah), particle-system (aliran air = fungsi waktu + seed).
// Lokasi dunia: gelas es teh (x=GX), dua rumah + potongan tanah (x=0), kasus Miliran (x=KX). Penampang = ilustrasi, skala disederhanakan.
import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import {AbsoluteFill, Audio, Easing, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/inter/600.css'; import '@fontsource/inter/700.css'; import '@fontsource/inter/900.css';
import * as THREE from 'three';
import {Env} from '../pengetahuan/Scene';
import {Captions} from '../kit/teks';
import {camAt, FPS, nudgeKey, r, type Key, type V3} from '../kit/waktu';
import {Kicker, useTex} from './AnatomiRumah';
import {Blok, useBahan, type Bahan} from './look';
import {back, Cahaya, iso, Kabut, Label2, Langit, lerp, orb, Pipa, Rig2, tele, type Kam, type Lb} from './Tiang03';
import wordsJson from '../../public/e1-05/words.json';

export const R05_FRAMES = Math.round(66.6 * FPS);
const GX = 300, KX = 600;
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- hidrologi ilustrasi: muka air tanah + corong penurunan (log, gaya Thiem) ----------
const FZ = 1.5;            // bidang potong depan
const WT = -3.5;           // muka air tanah awal
const DASAR = -4.6;        // dasar sumur gali
const BOR_Y = -11.4, SARING = -9.6; // ujung sumur bor, awal saringan
const RR = 12, R0 = 0.3;   // jari-jari pengaruh bawaan, jari-jari pipa
type Bor = {x: number; s: number; R?: number};
const turun = (d: number, R = RR) => Math.max(0, Math.min(1, Math.log(R / Math.max(d, R0)) / Math.log(R / R0)));
const muka = (x: number, bor: Bor[]) => WT - bor.reduce((a, b) => a + b.s * turun(Math.abs(x - b.x), b.R), 0);

/** air tanah di bidang potong: isian biru dari dasar sampai muka(x) + garis muka air. Geometri dibuat sekali, posisi diperbarui tiap frame. */
const N = 140;
const useStrip = () => useMemo(() => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array((N + 1) * 2 * 3), 3));
  const idx: number[] = []; for (let i = 0; i < N; i++) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } g.setIndex(idx); return g; }, []);
const isiStrip = (g: THREE.BufferGeometry, W: number, bawah: (x: number) => number, atas: (x: number) => number) => {
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i <= N; i++) { const x = -W / 2 + (W * i) / N; p.setXYZ(i * 2, x, bawah(x), 0); p.setXYZ(i * 2 + 1, x, atas(x), 0); }
  p.needsUpdate = true; g.computeBoundingSphere();
};
const AirTanah: React.FC<{W: number; bor: Bor[]; denyut: number}> = ({W, bor, denyut}) => {
  const isi = useStrip(), garis = useStrip();
  isiStrip(isi, W, () => -12, (x) => Math.min(-2.55, muka(x, bor)));
  isiStrip(garis, W, (x) => Math.min(-2.55, muka(x, bor)) - 0.07, (x) => Math.min(-2.5, muka(x, bor)) + 0.03);
  return (<group position={[0, 0, FZ + 0.015]}>
    <mesh geometry={isi}><meshBasicMaterial color="#3c8fd4" transparent opacity={0.5 + 0.22 * denyut} depthWrite={false} side={THREE.DoubleSide} /></mesh>
    <mesh geometry={garis} position={[0, 0, 0.01]}><meshBasicMaterial color="#1f63a8" side={THREE.DoubleSide} /></mesh>
  </group>);
};

/** balok tanah terpotong: rumput, lapisan lempung, pasir pembawa air, batuan dasar */
const Tanah: React.FC<{W: number; b: Bahan}> = ({W, b}) => { const D = 9.5, cz = FZ - D / 2; return (<group>
  <Blok p={[0, -0.1, cz]} s={[W, 0.2, D]} map={b.rumput} rep={[W / 3, 3]} bump={0.6} />
  <Blok p={[0, -1.35, cz]} s={[W, 2.3, D]} map={b.lempung} rep={[W / 4, 0.8]} bump={0.3} c="#857b6d" />
  <Blok p={[0, -7.25, cz]} s={[W, 9.5, D]} map={b.pasir} rep={[W / 3, 3]} bump={0.2} c="#d6be84" />
  <Blok p={[0, -12.6, cz]} s={[W, 1.2, D]} map={b.batuan} rep={[W / 3, 0.5]} bump={0.4} c="#50555d" />
</group>); };

/** sumur gali: bibir beton setengah (dipotong) + lubang di bidang potong + air di dalamnya */
const SumurGali: React.FC<{x: number; air: number; kering: number; tex: ReturnType<typeof useTex>}> = ({x, air, kering, tex}) => {
  const lb = 1.1, lv = Math.max(DASAR, Math.min(-0.3, air)), adaAir = air > DASAR + 0.03;
  return (<group position={[x, 0, 0]}>
    <mesh position={[0, 0.35, FZ]} castShadow><cylinderGeometry args={[0.62, 0.62, 0.7, 28, 1, true, Math.PI / 2, Math.PI]} /><meshStandardMaterial color="#bdb8ad" map={tex.beton} roughness={0.9} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.71, FZ]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.5, 0.64, 28, 1, Math.PI, Math.PI]} /><meshStandardMaterial color="#cfc9bd" roughness={0.9} side={THREE.DoubleSide} /></mesh>
    {/* tiang + palang katrol */}
    {[-0.66, 0.66].map((s) => <Blok key={s} p={[s, 1.0, FZ - 0.25]} s={[0.08, 2.0, 0.08]} c="#7d5a30" />)}
    <Blok p={[0, 1.95, FZ - 0.25]} s={[1.5, 0.08, 0.08]} c="#7d5a30" />
    {/* lubang di bidang potong (2,5D, menempel 0,01 di depan tanah) */}
    <group position={[0, 0, FZ + 0.02]}>
      <mesh position={[0, DASAR / 2, 0]}><planeGeometry args={[lb, -DASAR]} /><meshBasicMaterial color="#3b332c" /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[s * (lb / 2 + 0.06), DASAR / 2, 0.005]}><planeGeometry args={[0.12, -DASAR]} /><meshStandardMaterial color="#b3aea3" map={tex.beton} roughness={0.9} /></mesh>)}
      {adaAir && <mesh position={[0, (DASAR + lv) / 2, 0.01]}><planeGeometry args={[lb, lv - DASAR]} /><meshBasicMaterial color="#4a9be0" /></mesh>}
      <mesh position={[0, DASAR + 0.06, 0.012]}><planeGeometry args={[lb + 0.24, 0.12]} /><meshBasicMaterial color={new THREE.Color('#6b5a48').lerp(new THREE.Color('#e0442e'), kering)} /></mesh>
    </group>
  </group>);
};

/** sumur bor: pipa di bidang potong sampai saringan, kepala pipa + pompa di permukaan */
const SumurBor: React.FC<{x: number; jalan: number; t: number; mati?: number}> = ({x, jalan, t, mati = 0}) => {
  const getar = jalan > 0.05 ? Math.sin(t * 60) * 0.012 * jalan : 0;
  return (<group position={[x, 0, 0]}>
    <group position={[0, 0, FZ + 0.02]}>
      <mesh position={[0, (0 + SARING) / 2, 0]}><planeGeometry args={[0.2, -SARING]} /><meshStandardMaterial color="#8a9096" roughness={0.5} metalness={0.3} /></mesh>
      {Array.from({length: 9}, (_, i) => <mesh key={i} position={[0, SARING - 0.1 - i * 0.2, 0]}><planeGeometry args={[0.2, 0.1]} /><meshBasicMaterial color="#5a6066" /></mesh>)}
    </group>
    <mesh position={[0, 0.25, FZ]} castShadow><cylinderGeometry args={[0.1, 0.1, 0.5, 16]} /><meshStandardMaterial color="#8a9096" roughness={0.4} metalness={0.4} /></mesh>
    <group position={[0.62 + getar, 0.3, FZ - 0.5]}>
      <Blok p={[0, 0, 0]} s={[0.75, 0.55, 0.5]} c={mati > 0.5 ? '#8a8f95' : '#2f6fb3'} r={0.5} />
      <mesh position={[-0.42, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.18, 0.18, 0.12, 20]} /><meshStandardMaterial color="#26282c" roughness={0.6} /></mesh>
    </group>
    <Pipa pts={[[0, 0.5, FZ], [0, 0.62, FZ - 0.2], [0.3, 0.55, FZ - 0.5]]} rad={0.045} c="#8a9096" />
  </group>);
};

/** aliran air tanah menuju saringan sumur bor (titik di bidang potong) */
const G = {bola: new THREE.SphereGeometry(1, 10, 8)};
const Aliran: React.FC<{W: number; bor: Bor[]; t: number; k: number}> = ({W, bor, t, k}) => {
  const m = useMemo(() => new THREE.MeshBasicMaterial({color: '#e6f4ff'}), []);
  if (k < 0.05) return null;
  return (<group position={[0, 0, FZ + 0.05]}>{Array.from({length: 110}, (_, i) => {
    const b = bor[i % bor.length], u = ((t * 0.16 + rnd(i, 1)) % 1), x0 = b.x + (rnd(i, 2) - 0.5) * W * 0.95, y0 = lerp(-11.6, muka(x0, bor) - 0.3, rnd(i, 3));
    const e = Easing.in(Easing.quad)(u), x = lerp(x0, b.x, e), y = lerp(y0, (SARING + BOR_Y) / 2, e);
    if (y > muka(x, bor) - 0.15 || Math.abs(x) > W / 2) return null;
    return <mesh key={i} geometry={G.bola} material={m} position={[x, y, 0]} scale={0.07 * k * Math.min(1, u * 6, (1 - u) * 6)} />;
  })}</group>);
};

const Rumah: React.FC<{x: number; c: string; b: Bahan; g: THREE.Texture; z?: number; w?: number}> = ({x, c, b, g, z = -3.0, w = 4.0}) => (<group position={[x, 0, z]} scale={[w / 4, 1, 1]}>
  <Blok p={[0, 1.4, 0]} s={[4.0, 2.8, 4.0]} c={c} map={b.plester} rep={[2, 1.2]} bump={0.4} />
  {[-1, 1].map((s) => <mesh key={s} position={[0, 3.3, s * 1.1]} rotation={[s * 0.62, 0, 0]} castShadow receiveShadow><boxGeometry args={[4.6, 0.08, 2.75]} /><meshStandardMaterial map={g} roughness={0.85} /></mesh>)}
  <Blok p={[0.9, 0.9, 2.03]} s={[0.8, 1.8, 0.08]} map={b.kayu} bump={0.4} />
  <Blok p={[-0.9, 1.6, 2.03]} s={[1.1, 0.9, 0.06]} c="#86aac0" r={0.12} />
</group>);

const Hotel: React.FC<{x: number; naik: number; b: Bahan}> = ({x, naik, b}) => {
  const H = 13, y = -H + 0.02 + (H - 0.02) * naik + 0.0;
  if (naik <= 0.01) return null;
  return (<group position={[x, y, -3.4]}>
    <Blok p={[0, H / 2, 0]} s={[5.6, H, 5.0]} c="#e9e4da" map={b.plester} rep={[2, 4]} bump={0.3} />
    {Array.from({length: 4 * 5}, (_, i) => <Blok key={i} p={[-1.95 + (i % 4) * 1.3, 2.0 + Math.floor(i / 4) * 2.4, 2.53]} s={[0.9, 1.3, 0.06]} c="#7fa4bd" r={0.15} bayang={false} />)}
    <Blok p={[0, H + 0.2, 0]} s={[5.9, 0.4, 5.3]} c="#c9c2b4" />
  </group>);
};

// ---------- gelas es teh (hook) ----------
const TEH0 = 1.5, TEH1 = 0.72, UJUNG_PENDEK = 1.05;
const tinggiTeh = (t: number) => lerp(TEH0, TEH1, r(t, 9.5, 11.2, Easing.inOut(Easing.quad))) - 0.06 * r(t, 4.6, 9.3);
const Gelas: React.FC<{t: number; b: Bahan}> = ({t, b}) => {
  const h = tinggiTeh(t), angin = r(t, 10.9, 11.4), mTeh = useMemo(() => new THREE.MeshBasicMaterial({color: '#6e2f0e'}), []), mUdara = useMemo(() => new THREE.MeshBasicMaterial({color: '#ffffff'}), []);
  const sedot = t > 4.4;
  const straw = (x: number, top: number, tip: number, c: string, tilt: number) => (<group position={[x, (top + tip) / 2, 0]} rotation={[0, 0, tilt]}>
    <mesh castShadow><cylinderGeometry args={[0.07, 0.07, top - tip, 18, 1, true]} /><meshStandardMaterial color={c} roughness={0.4} transparent opacity={0.85} side={THREE.DoubleSide} /></mesh></group>);
  return (<group position={[GX, 0, 0]}>
    <Blok p={[0, -0.12, 0]} s={[4.4, 0.24, 3.0]} map={b.kayu} rep={[2, 1]} bump={0.4} />
    {/* teh (isi), es batu, gelas transparan */}
    <mesh position={[0, h / 2 + 0.06, 0]}><cylinderGeometry args={[0.6, 0.54, h, 40]} /><meshStandardMaterial color="#8e3f14" roughness={0.25} transparent opacity={0.86} /></mesh>
    {[[-0.22, 0.1, 0.3], [0.25, -0.18, 1.1], [0.02, 0.24, 2.0]].map(([ix, iz, a], i) => <mesh key={i} position={[ix, h - 0.06 + 0.02 * Math.sin(t * 2 + i), iz]} rotation={[a, a * 0.7, 0.3]}><boxGeometry args={[0.24, 0.22, 0.24]} /><meshStandardMaterial color="#eaf6ff" roughness={0.1} transparent opacity={0.75} /></mesh>)}
    <mesh position={[0, 0.95, 0]}><cylinderGeometry args={[0.66, 0.58, 1.9, 40, 1, true]} /><meshStandardMaterial color="#e8f3f8" roughness={0.05} transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.58, 0.58, 0.06, 40]} /><meshStandardMaterial color="#e8f3f8" roughness={0.05} transparent opacity={0.4} /></mesh>
    {/* sedotan pendek (kamu) & panjang (teman) */}
    {straw(-0.22, 2.4, UJUNG_PENDEK, angin > 0.5 ? '#e0442e' : '#ef6a4c', 0.08)}
    {straw(0.24, 2.6, 0.12, '#3d7dd8', -0.1)}
    {/* isi yang tersedot: teh naik di sedotan; udara di sedotan pendek setelah teh di bawah ujungnya */}
    {sedot && Array.from({length: 14}, (_, i) => { const u = ((t * 0.9 + i / 14) % 1); const y = lerp(0.12, 2.6, u); return <mesh key={`p${i}`} geometry={G.bola} material={mTeh} position={[0.24 + 0.1 * (y - 1.36), y, 0]} scale={0.045} />; })}
    {sedot && Array.from({length: 10}, (_, i) => { const u = ((t * 0.9 + i / 10) % 1); const y = lerp(UJUNG_PENDEK, 2.4, u); return <mesh key={`q${i}`} geometry={G.bola} material={angin > 0.5 ? mUdara : mTeh} position={[-0.22 - 0.08 * (y - 1.725), y, 0]} scale={angin > 0.5 ? 0.055 : 0.045} />; })}
  </group>);
};

// ---------- dunia ----------
const BOR_X = 2.4, GALI_X = -2.2;
const sUtama = (t: number) => 6 * r(t, 25.9, 30.6, Easing.inOut(Easing.quad));
const Dunia: React.FC<{t: number}> = ({t}) => {
  const b = useBahan(), x = useTex(), bor: Bor[] = [{x: BOR_X, s: sUtama(t)}], air = muka(GALI_X, bor);
  const kering = r(t, 33.6, 34.4), denyut = t > 19.6 && t < 25.4 ? 0.5 + 0.5 * Math.sin((t - 19.6) * 4.4) : 0;
  const cincin = t > 59.2 && t < 63.4 ? ((t - 59.2) / 1.4) % 1 : -1;
  return (<group>
    <Tanah W={14} b={b} />
    <AirTanah W={14} bor={bor} denyut={denyut} />
    <Rumah x={-3.6} c="#e6dccb" b={b} g={x.genteng} /><Rumah x={3.6} c="#d9e3dc" b={b} g={x.genteng} />
    <SumurGali x={GALI_X} air={air} kering={kering} tex={x} />
    <SumurBor x={BOR_X} jalan={r(t, 25.9, 26.4)} t={t} />
    <Aliran W={14} bor={bor} t={t} k={r(t, 26.2, 27.4)} />
    {/* bor lebih dalam? (bayangan merah putus-putus di bawah sumur gali) */}
    {t > 55.2 && t < 59.0 && Array.from({length: 10}, (_, i) => { const y = DASAR - 0.25 - i * 0.55, k = r(t, 55.4 + i * 0.08, 55.7 + i * 0.08) * (1 - r(t, 58.4, 58.9));
      return k > 0.01 ? <mesh key={i} position={[GALI_X, y, FZ + 0.03]}><planeGeometry args={[0.5, 0.3]} /><meshBasicMaterial color="#e0442e" transparent opacity={0.85 * k} /></mesh> : null; })}
    {/* cincin cek sekitar rumah */}
    {cincin >= 0 && <mesh position={[GALI_X, 0.04, -1.2]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.6 + cincin * 7.5, 0.75 + cincin * 7.5, 64]} /><meshBasicMaterial color="#ef6a4c" transparent opacity={0.8 * (1 - cincin)} depthWrite={false} side={THREE.DoubleSide} /></mesh>}
  </group>);
};

// ---------- kasus Miliran (ilustrasi lokasi, bukan peta) ----------
const KB_X = 4.6, WARGA = [-5.6, -2.8, 0.0], RK = 22;
const sKasus = (t: number) => 7.5 * r(t, 38.4, 41.0, Easing.inOut(Easing.quad)) * (1 - r(t, 46.6, 50.6, Easing.inOut(Easing.quad)));
const Kasus: React.FC<{t: number}> = ({t}) => {
  const b = useBahan(), x = useTex(), bor: Bor[] = [{x: KB_X, s: sKasus(t), R: RK}];
  return (<group position={[KX, 0, 0]}>
    <Tanah W={20} b={b} />
    <AirTanah W={20} bor={bor} denyut={0} />
    {WARGA.map((wx, i) => <group key={wx}><Rumah x={wx - 0.3} w={2.6} c={['#e6dccb', '#d9e3dc', '#e8dcc4'][i]} b={b} g={x.genteng} z={-3.4} />
      <SumurGali x={wx} air={muka(wx, bor)} kering={muka(wx, bor) < DASAR ? 1 : 0} tex={x} /></group>)}
    <Hotel x={KB_X + 1.4} naik={r(t, 37.5, 38.9, back)} b={b} />
    <SumurBor x={KB_X} jalan={r(t, 38.4, 38.9) * (1 - r(t, 44.2, 44.6))} t={t} mati={r(t, 44.2, 44.6)} />
    <Aliran W={20} bor={bor} t={t} k={r(t, 38.6, 39.6) * (1 - r(t, 44.4, 45.4))} />
  </group>);
};

// ---------- kamera ----------
const KG: Key[] = [orb(0, 26, 12, 9.0, [GX, 1.1, 0]), orb(4.2, 18, 10, 8.4, [GX, 1.1, 0]), orb(9.5, 10, 8, 8.0, [GX, 1.0, 0]), orb(11.2, 4, 6, 6.6, [GX - 0.1, 1.2, 0]), orb(15.4, 0, 6, 6.2, [GX - 0.15, 1.2, 0])];
const KD: Key[] = [orb(15.4, 24, 16, 44, [0, -2.2, 0]), orb(19.4, 22, 12, 42, [0, -2.4, 0]), orb(25.6, 16, 9, 41, [0.2, -2.6, 0]), orb(31.4, 12, 8, 36, [0, -3.4, 0]),
  orb(36.9, 6, 6, 22, [GALI_X + 0.3, -2.0, 0])];
const KA: Key[] = [orb(54.9, 10, 8, 26, [GALI_X + 0.6, -3.4, 0]), orb(58.6, 14, 10, 28, [GALI_X + 0.8, -3.0, 0]), orb(59.4, 26, 34, 28, [0.2, -1.6, -1.0]), orb(63.4, 34, 30, 30, [0.2, -2.0, -1.0]), orb(66.6, 38, 20, 36, [0, -3.4, 0])];
const KK: Key[] = [iso(37.4, [KX + 0.4, -2.2, 0], 52, 18, 14), iso(46.4, [KX + 0.6, -2.6, 0], 55, 14, 12), iso(54.9, [KX + 0.4, -2.8, 0], 58, 10, 11)];
type Mode = 'gelas' | 'dunia' | 'kasus' | 'akhir';
const mode = (t: number): Mode => (t < 15.4 ? 'gelas' : t < 37.4 ? 'dunia' : t < 54.9 ? 'kasus' : 'akhir');

// ---------- overlay ----------
const g0 = (y: number, dx = 0): V3 => [GX + dx, y, 0];
const muka0 = (t: number) => muka(GALI_X, [{x: BOR_X, s: sUtama(t)}]);
const LABELS: Lb[] = [
  {a: 4.4, b: 14.6, text: 'Sedotanmu', at: g0(1.75, -0.26), side: 'L', dy: -160},
  {a: 5.6, b: 14.6, text: 'Sedotan teman', at: g0(1.9, 0.28), side: 'R', dy: -230},
  {a: 11.2, b: 14.8, text: 'Nyedot angin', at: g0(UJUNG_PENDEK + 0.05, -0.18), side: 'L', dy: 120, merah: true},
  {a: 15.8, b: 25.4, text: 'Sumur gali (dangkal)', at: [GALI_X, 0.6, FZ], side: 'L', dy: -120},
  {a: 16.8, b: 25.4, text: 'Sumur bor (dalam)', at: [BOR_X + 0.6, 0.6, FZ - 0.5], side: 'R', dy: -220},
  {a: 20.0, b: 25.4, text: 'Air tanah, satu lapisan', at: [4.4, -7.0, FZ], side: 'R', dy: 160},
  {a: 27.6, b: 31.4, text: 'Muka air turun', at: (t) => [BOR_X + 1.4, muka(BOR_X + 1.4, [{x: BOR_X, s: sUtama(t)}]), FZ], side: 'R', dy: 120},
  {a: 32.4, b: 36.9, text: 'Dasar sumur', at: [GALI_X, DASAR, FZ], side: 'L', dy: 80},
  {a: 34.2, b: 36.9, text: 'Kering', at: (t) => [GALI_X + 0.3, Math.min(DASAR, muka0(t)), FZ], side: 'R', dy: 60, merah: true},
  {a: 38.4, b: 46.0, text: 'Hotel', at: [KX + KB_X + 1.4, 6.0, -0.9], side: 'R', dy: 0},
  {a: 40.8, b: 46.0, text: 'Sumur warga kering', at: [KX + WARGA[1], DASAR, FZ], side: 'L', dy: 140, merah: true},
  {a: 44.4, b: 48.2, text: 'Izin sedot dicabut', at: [KX + KB_X + 0.6, 0.4, FZ - 0.5], side: 'R', dy: 180, merah: true},
  {a: 48.6, b: 54.6, text: '±8 hari: air kembali', at: (t) => [KX + WARGA[1], muka(WARGA[1], [{x: KB_X, s: sKasus(t), R: RK}]), FZ], side: 'L', dy: 140},
  {a: 55.6, b: 58.8, text: 'Bor lebih dalam?', at: [GALI_X, DASAR - 2.6, FZ], side: 'L', dy: 0, merah: true},
  {a: 59.8, b: 63.4, text: 'Sumur bor besar?', at: [BOR_X + 0.6, 0.6, FZ - 0.5], side: 'R', dy: 120},
];
const Tag: React.FC<{t: number}> = ({t}) => { const p = Math.max(r(t, 0.2, 0.7) * (1 - r(t, 14.9, 15.4)), r(t, 15.8, 16.3) * (1 - r(t, 36.9, 37.3))); return p > 0.01 ? <div style={{position: 'absolute', right: 40, top: 270, padding: '6px 16px', borderRadius: 12, background: 'rgba(42,42,46,0.72)', color: '#fff', fontFamily: 'Inter', fontWeight: 600, fontSize: 26, opacity: p}}>{t < 15.4 ? 'ilustrasi' : 'ilustrasi, skala disederhanakan'}</div> : null; };
const KartuKasus: React.FC<{t: number}> = ({t}) => {
  const i = r(t, 37.6, 38.1, Easing.out(Easing.cubic)), o = 1 - r(t, 54.3, 54.8); if (i * o <= 0.01) return null; const bt = r(t, 52.8, 53.2, back);
  return (<div style={{position: 'absolute', left: 70, right: 70, top: 280, padding: '22px 32px', borderRadius: 26, background: '#fbf8f1', boxShadow: '0 12px 34px rgba(30,30,30,0.2)', fontFamily: 'Inter', opacity: i * o, transform: `translateY(${(1 - i) * 30}px)`}}>
    <div style={{fontWeight: 900, fontSize: 52, color: '#2a2a2e', letterSpacing: -1.2}}>Kampung Miliran, Yogyakarta</div>
    <div style={{fontWeight: 600, fontSize: 24, color: '#6a6a6e', marginTop: 8}}>Menurut laporan media: Mongabay, The Jakarta Post (2014)</div>
    {bt > 0.01 && <div style={{fontWeight: 800, fontSize: 40, color: '#e0442e', marginTop: 12, opacity: bt, transform: `scale(${0.9 + 0.1 * bt})`, transformOrigin: 'left'}}>Pihak hotel membantah</div>}
  </div>);
};
const Langkah: React.FC<{t: number}> = ({t}) => {
  const o = 1 - r(t, 63.0, 63.5);
  return (<div style={{position: 'absolute', left: 90, right: 90, top: 290, fontFamily: 'Inter'}}>
    {([['1', 'Ada sumur bor besar di sekitar?', 59.3], ['2', 'Tanya izinnya ke dinas setempat', 61.0]] as [string, string, number][]).map(([n, tx, a]) => { const p = r(t, a, a + 0.45, Easing.out(Easing.cubic)) * o; return p > 0.01 ? (
      <div key={n} style={{display: 'flex', gap: 22, alignItems: 'center', padding: '16px 26px', marginBottom: 20, borderRadius: 22, background: 'rgba(251,248,241,0.96)', boxShadow: '0 10px 30px rgba(30,30,30,0.16)', opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
        <div style={{fontWeight: 900, fontSize: 60, color: '#ef6a4c', minWidth: 44}}>{n}</div><div style={{fontWeight: 800, fontSize: 42, color: '#2a2a2e', letterSpacing: -0.8}}>{tx}</div></div>) : null; })}
  </div>);
};

export const Sumur05: React.FC<{nudge?: number}> = ({nudge = 0}) => {
  const f = useCurrentFrame(), t = f / FPS, ms = t * 1000, words = (wordsJson as {words: {word: string; start: number; end: number}[]}).words;
  const m = mode(t), b = useBahan();
  const cam: Kam = m === 'kasus' ? tele(camAt(KK, t)) : {...nudgeKey(camAt(m === 'gelas' ? KG : m === 'dunia' ? KD : KA, t), nudge), fov: 34};
  const dip = Math.max(0, ...[15.4, 37.4, 54.9].map((c) => r(t, c - 0.3, c) * (1 - r(t, c, c + 0.3))));
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#bcd8ee 0%,#e6eef0 55%,#f3e9d6 100%)'}}>
      <Audio src={staticFile('e1-05/vo.wav')} />
      <Langit t={t} />
      <AbsoluteFill style={{filter: 'contrast(1.07) saturate(1.1)'}}>
        <ThreeCanvas width={1080} height={1920} camera={{position: cam.pos, fov: 34}} gl={{alpha: true, antialias: true}} shadows>
          <Env intensity={0.8} /><Rig2 k={cam} /><Cahaya /><Kabut tele={cam.fov < 10} />
          {m === 'gelas' && <Gelas t={t} b={b} />}
          {(m === 'dunia' || m === 'akhir') && <Dunia t={t} />}
          {m === 'kasus' && <Kasus t={t} />}
        </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,24,34,0.3) 100%)', pointerEvents: 'none'}} />
      {LABELS.map((l) => <Label2 key={l.text} l={l} t={t} cam={cam} />)}
      <Tag t={t} />
      <KartuKasus t={t} />
      <Langkah t={t} />
      <Kicker t={t} a={-1} b={9.3} text="Satu es teh, dua sedotan" />
      <Kicker t={t} a={9.5} b={15.0} text="Siapa yang kering duluan?" />
      <Kicker t={t} a={15.6} b={19.2} text="Sumur gali vs sumur bor" />
      <Kicker t={t} a={19.5} b={25.5} text="Minum dari lapisan sama" />
      <Kicker t={t} a={25.9} b={31.4} text="Turun kayak corong" />
      <Kicker t={t} a={31.7} b={37.0} text="Yang dangkal kena duluan" />
      <Kicker t={t} a={37.6} b={54.4} text="Kejadian nyata" />
      <Kicker t={t} a={55.1} b={58.8} text="Jangan buru-buru bor" />
      <Kicker t={t} a={58.9} b={63.4} text="Cek dulu sekitarmu" />
      <Kicker t={t} a={63.7} b={66.6} text="Fakta Rumah" />
      <AbsoluteFill style={{background: '#fbf8f1', opacity: dip, pointerEvents: 'none'}} />
      <Captions ms={ms} words={words} />
    </AbsoluteFill>
  );
};
