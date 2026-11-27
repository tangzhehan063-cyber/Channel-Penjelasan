// E1 #06 "Rajin Cabut Charger, Magic Com Nyala Seharian". Gaya E1-03 (style/gaya-e1-03.md). 100% kode: Remotion + three.js, tanpa API AI.
// Waktu = VO final public/e1-06 (66,6 dtk, Gemini Achernar). Rencana adegan: e1/e06-cabut-charger.md.
// Skill pustaka: isometric-animation (rumah potong/dollhouse di satu kanvas), diagram-animation (kalender, batang, rumus: muncul bertahap),
// chart-animation (menara koin sebanding: 1 keping = Rp104, 225 keping = Rp23.400), color-motion (boros/bahaya = merah).
// Dunia: rumah tanpa atap & dinding depan. Kamar (x<0): stop kontak + charger. Dapur (x>0): meja + magic com. Skala 1 satuan = 1 m.
import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/inter/600.css'; import '@fontsource/inter/700.css'; import '@fontsource/inter/900.css';
import * as THREE from 'three';
import {Env} from '../pengetahuan/Scene';
import {Captions} from '../kit/teks';
import {camAt, FPS, r, type Key, type V3} from '../kit/waktu';
import {Kicker, tex, useTex} from './AnatomiRumah';
import {Blok, useBahan} from './look';
import {back, Cahaya, Kabut, Label2, Langit, lerp, orb, Pipa, proj2, Rig2, type Kam, type Lb} from './Tiang03';
import wordsJson from '../../public/e1-06/words.json';

export const R06_FRAMES = Math.round(67.2 * FPS);
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- tata letak ----------
const LT = 0.1;                           // tinggi permukaan lantai
const SK: V3 = [-1.0, 0.45, -2.985];      // stop kontak kamar (permukaan dinding)
const MJ = 1.0;                           // tinggi permukaan meja dapur
const MC: V3 = [2.6, MJ, -2.6];           // magic com (dasar)
const KOIN1: V3 = [-0.72, LT, -2.55];     // koin charger
const MENARA: V3 = [4.05, LT, -1.55];     // menara koin magic com
const N_KOIN = 225, TK = 0.02, RK = 0.14;  // 225 keping (Rp23.400 / Rp104), tebal 2 cm, jari-jari 14 cm (keping stilisasi, bukan koin asli)

// ---------- benda ----------
const mPutih = new THREE.MeshStandardMaterial({color: '#f4f1ea', roughness: 0.55});
const mKoin = new THREE.MeshStandardMaterial({color: '#e2b84f', roughness: 0.35, metalness: 0.45});
const mKoinTepi = new THREE.MeshStandardMaterial({color: '#b98d2c', roughness: 0.4, metalness: 0.4});
const gKoin = new THREE.CylinderGeometry(RK, RK, TK * 0.92, 32);

const StopKontak: React.FC = () => (<group position={SK}>
  <Blok p={[0, 0, 0.012]} s={[0.12, 0.12, 0.024]} c="#f6f4ee" r={0.5} />
  <mesh position={[0, 0, 0.026]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.042, 0.042, 0.006, 32]} /><meshStandardMaterial color="#e7e3da" roughness={0.6} /></mesh>
  {[-0.016, 0.016].map((x) => <mesh key={x} position={[x, 0, 0.03]}><circleGeometry args={[0.0065, 16]} /><meshBasicMaterial color="#3a3a3e" /></mesh>)}
</group>);

/** charger modern (kecil) atau model lama (trafo, besar, panas). keluar = 0 tertancap, 1 tercabut jatuh ke lantai */
const Charger: React.FC<{keluar: number; lama: number; rusak: number; t: number}> = ({keluar, lama, rusak, t}) => {
  const s = lerp(1, 1.75, lama), tarik = r(keluar, 0, 0.35), jatuh = r(keluar, 0.35, 1, Easing.in(Easing.quad));
  const z = SK[2] + 0.03 + 0.024 * s + tarik * 0.09, y = lerp(SK[1], LT + 0.024 * s, jatuh);
  const rot = jatuh * 1.45;
  const panas = Math.max(lama * 0.55, rusak * (0.55 + 0.45 * Math.abs(Math.sin(t * 6))));
  const warna = new THREE.Color(lama > 0.5 ? '#2c2d31' : '#f4f1ea').lerp(new THREE.Color('#e0442e'), panas * 0.22);
  return (<group position={[SK[0], y, z]} rotation={[-rot, 0, 0]} scale={s}>
    <mesh castShadow><boxGeometry args={[0.055, 0.062, 0.048]} /><meshStandardMaterial color={warna} roughness={0.5} /></mesh>
    <mesh position={[0, 0.0, 0.0245]}><planeGeometry args={[0.03, 0.01]} /><meshBasicMaterial color="#9aa0a8" /></mesh>
    {/* lampu kecil indikator */}
    <mesh position={[0.017, 0.022, 0.0245]}><circleGeometry args={[0.003, 12]} /><meshBasicMaterial color={lama > 0.5 ? '#ff8a3a' : '#7fd6a0'} /></mesh>
  </group>);
};

/** kabel charger: dari bawah charger turun ke lantai lalu ke meja samping. Ujung tanpa HP. */
const KabelCharger: React.FC<{keluar: number; rusak: number; t: number}> = ({keluar, rusak, t}) => {
  if (keluar > 0.3) return null;
  const pts: V3[] = [[SK[0], SK[1] - 0.03, SK[2] + 0.055], [SK[0] - 0.02, 0.22, -2.9], [SK[0] - 0.12, LT + 0.012, -2.75], [-1.2, LT + 0.012, -2.62], [-1.38, LT + 0.012, -2.5], [-1.3, LT + 0.012, -2.36]];
  const merah = rusak * (0.6 + 0.4 * Math.abs(Math.sin(t * 6)));
  return (<group>
    <Pipa pts={pts} rad={0.006} c="#f1eee6" />
    {merah > 0.01 && <Pipa pts={[[SK[0] - 0.006, 0.36, -2.955], [SK[0] - 0.015, 0.26, -2.92]]} rad={0.011} c="#e0442e" o={merah} />}
    {/* ujung USB */}
    <Blok p={[-1.29, LT + 0.012, -2.34]} s={[0.02, 0.012, 0.04]} c="#d6d2c8" bayang={false} />
  </group>);
};

/** magic com: badan, tutup kubah, panel lampu (masak/hangat), kabel ke stop kontak dapur. balik = 0..1 diangkat & dibalik */
const stiker = () => tex(512, 360, (g) => {
  g.fillStyle = '#f2f0ea'; g.fillRect(0, 0, 512, 360);
  g.strokeStyle = '#9a968c'; g.lineWidth = 6; g.strokeRect(10, 10, 492, 340);
  g.fillStyle = '#3a3a3e'; g.font = 'bold 44px Inter, sans-serif'; g.textAlign = 'center';
  g.fillText('RICE COOKER', 256, 72);
  g.font = '600 38px Inter, sans-serif'; g.fillText('220V ~ 50Hz', 256, 132); g.fillText('MASAK  350 W', 256, 196);
  g.fillStyle = '#e0442e'; g.font = 'bold 52px Inter, sans-serif'; g.fillText('WARM  45 W', 256, 278);
}, [1, 1], 61);
const MagicCom: React.FC<{t: number; warm: number; balik: number; lingkar: number}> = ({t, warm, balik, lingkar}) => {
  const st = useMemo(stiker, []);
  const naik = r(balik, 0, 0.4) * (1 - r(balik, 0.85, 1)), putar = r(balik, 0.15, 0.6, Easing.inOut(Easing.cubic)) * (1 - r(balik, 0.7, 1, Easing.inOut(Easing.cubic)));
  return (<group position={MC}>
    <Pipa pts={[[0.12, 0.05, -0.12], [0.22, 0.03, -0.3], [0.3, 0.17, -0.37]]} rad={0.007} c="#2a2b2f" />
    <Blok p={[0.3, 0.17, -0.38]} s={[0.1, 0.1, 0.02]} c="#f6f4ee" r={0.5} />
    <group position={[0, 0.13 + naik * 0.32, 0]} rotation={[-1.95 * putar, 0, 0]}>
      <group position={[0, -0.13, 0]}>
        <mesh position={[0, 0.12, 0]} castShadow material={mPutih}><cylinderGeometry args={[0.17, 0.16, 0.22, 40]} /></mesh>
        <mesh position={[0, 0.23, 0]} scale={[1, 0.42, 1]} castShadow><sphereGeometry args={[0.172, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#e9e4d8" roughness={0.45} /></mesh>
        <mesh position={[0, 0.235, 0]}><torusGeometry args={[0.171, 0.008, 8, 40]} /><meshStandardMaterial color="#c7c1b4" roughness={0.5} /></mesh>
        <Blok p={[0, 0.315, 0]} s={[0.12, 0.025, 0.035]} c="#5a5a60" r={0.5} />
        <mesh position={[0.07, 0.3, 0.05]}><cylinderGeometry args={[0.012, 0.012, 0.012, 12]} /><meshStandardMaterial color="#8a8d93" /></mesh>
        {/* panel depan */}
        <Blok p={[0, 0.1, 0.163]} s={[0.12, 0.07, 0.02]} c="#6a6d73" r={0.4} />
        <mesh position={[-0.03, 0.115, 0.174]}><circleGeometry args={[0.009, 16]} /><meshBasicMaterial color="#7a3b33" /></mesh>
        <mesh position={[0.03, 0.115, 0.174]}><circleGeometry args={[0.009, 16]} /><meshBasicMaterial color={new THREE.Color('#5c5048').lerp(new THREE.Color('#ffb040'), warm)} /></mesh>
        {warm > 0.05 && <mesh position={[0.03, 0.115, 0.175]}><ringGeometry args={[0.011, 0.02, 20]} /><meshBasicMaterial color="#ffb040" transparent opacity={0.35 * warm} depthWrite={false} /></mesh>}
        <Blok p={[0, 0.07, 0.172]} s={[0.04, 0.016, 0.006]} c="#3d3f44" bayang={false} />
        {/* kaki + stiker di dasar */}
        {[[0.1, 0.1], [-0.1, 0.1], [0.1, -0.1], [-0.1, -0.1]].map(([x, z]) => <mesh key={`${x}${z}`} position={[x, 0.005, z]}><cylinderGeometry args={[0.015, 0.015, 0.01, 10]} /><meshStandardMaterial color="#2a2b2f" /></mesh>)}
        <mesh position={[0, 0.006, 0]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.158, 40]} /><meshStandardMaterial color="#dcd8cf" side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, -0.001, 0.0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[0.2, 0.14]} /><meshBasicMaterial map={st} side={THREE.DoubleSide} /></mesh>
        {lingkar > 0.01 && <mesh position={[0, -0.003, 0.033]} rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.036, 40, 1, 0, Math.PI * 2 * lingkar]} /><meshBasicMaterial color="#ef6a4c" side={THREE.DoubleSide} /></mesh>}
      </group>
    </group>
    {/* uap tipis saat hangat */}
    {warm > 0.05 && balik < 0.05 && Array.from({length: 7}, (_, i) => { const u = (t * 0.35 + rnd(i, 1)) % 1;
      return <mesh key={i} position={[0.07 + (rnd(i, 2) - 0.5) * 0.06 + u * 0.04, 0.32 + u * 0.4, 0.05 + (rnd(i, 3) - 0.5) * 0.05]} scale={0.02 + u * 0.035}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.35 * warm * Math.sin(u * Math.PI)} depthWrite={false} /></mesh>; })}
  </group>);
};

/** tumpukan koin. n = jumlah keping terlihat (boleh pecahan: keping teratas sedang jatuh) */
const Koin: React.FC<{p: V3; n: number; jatuh?: number}> = ({p, n, jatuh = 0}) => {
  const full = Math.floor(n), fr = n - full;
  return (<group position={p}>
    {Array.from({length: Math.min(full, N_KOIN)}, (_, i) => <mesh key={i} geometry={gKoin} material={i % 2 ? mKoin : mKoinTepi} position={[0, TK * (i + 0.5), 0]} castShadow={i % 6 === 0} receiveShadow />)}
    {fr > 0.02 && full < N_KOIN && <mesh geometry={gKoin} material={mKoin} position={[0, TK * (full + 0.5) + (1 - fr) * 0.5 + jatuh, 0]} />}
  </group>);
};

// ---------- rumah potong (tanpa atap & dinding depan) ----------
const Rumah: React.FC = () => {
  const b = useBahan();
  return (<group>
    <Blok p={[0, -0.1, 0]} s={[60, 0.2, 60]} map={b.rumput} rep={[18, 18]} bump={0.6} />
    <Blok p={[0, 0.02, 0]} s={[10.4, 0.16, 6.4]} c="#cfc7b8" r={0.9} />
    {/* lantai: kayu (kamar), ubin (dapur); turun 0,02 dari tepi balok supaya tidak sebidang */}
    <Blok p={[-2.5, 0.09, 0]} s={[4.94, 0.02, 5.94]} map={b.kayu} rep={[4, 4]} bump={0.15} />
    <Blok p={[2.5, 0.09, 0]} s={[4.94, 0.02, 5.94]} c="#e6e1d6" r={0.6} />
    {Array.from({length: 9}, (_, i) => <Blok key={`u${i}`} p={[0.3 + i * 0.55, 0.101, 0]} s={[0.012, 0.004, 5.94]} c="#c9c2b4" bayang={false} />)}
    {/* dinding belakang, samping, sekat rendah */}
    <Blok p={[-2.5, 1.6, -3.05]} s={[5.1, 3.0, 0.12]} c="#b9d2d4" r={0.95} />
    <Blok p={[2.55, 1.6, -3.05]} s={[5.0, 3.0, 0.12]} c="#f0d9b2" r={0.95} />
    <Blok p={[-5.05, 1.6, 0]} s={[0.12, 3.0, 6.2]} c="#b9d2d4" r={0.95} />
    <Blok p={[5.05, 1.6, 0]} s={[0.12, 3.0, 6.2]} c="#f0d9b2" r={0.95} />
    <Blok p={[0, 0.65, -1.3]} s={[0.12, 1.1, 3.4]} c="#e8e2d6" r={0.95} />
    {/* list atas dinding (potongan) */}
    <Blok p={[0, 3.12, -3.05]} s={[10.3, 0.05, 0.16]} c="#b8ad99" />
    {/* jendela */}
    <Blok p={[-3.4, 1.85, -2.98]} s={[1.3, 1.0, 0.04]} c="#9cc1d6" r={0.15} />
    <Blok p={[3.4, 2.05, -2.98]} s={[1.1, 0.8, 0.04]} c="#9cc1d6" r={0.15} />
    {/* kamar: kasur, bantal, meja samping */}
    <Blok p={[-3.4, 0.3, -1.7]} s={[1.9, 0.4, 2.3]} map={b.kayu} rep={[1, 1]} />
    <Blok p={[-3.4, 0.6, -1.65]} s={[1.8, 0.22, 2.15]} c="#f3f0e8" r={0.85} />
    <Blok p={[-3.4, 0.77, -2.5]} s={[1.2, 0.14, 0.42]} c="#cfe0ea" r={0.85} />
    <Blok p={[-3.4, 0.73, -1.1]} s={[1.84, 0.06, 1.2]} c="#e7a07b" r={0.85} />
    <Blok p={[-2.15, 0.34, -2.62]} s={[0.42, 0.5, 0.42]} map={b.kayu} rep={[0.6, 0.6]} />
    {/* dapur: meja, kabinet atas, kompor, rak */}
    <Blok p={[2.9, 0.5, -2.69]} s={[3.9, 0.82, 0.58]} c="#e3ddd0" r={0.8} />
    <Blok p={[2.9, 0.955, -2.69]} s={[3.96, 0.09, 0.62]} c="#9b8f7c" r={0.6} />
    {[1.4, 2.4, 3.4, 4.4].map((x) => <Blok key={x} p={[x, 0.5, -2.39]} s={[0.9, 0.7, 0.02]} c="#d2c9b8" r={0.8} bayang={false} />)}
    <Blok p={[1.5, 2.35, -2.82]} s={[1.6, 0.6, 0.34]} c="#e3ddd0" r={0.8} />
    <Blok p={[3.9, 1.06, -2.68]} s={[0.6, 0.12, 0.42]} c="#3c3e43" r={0.5} />
    {[3.75, 4.05].map((x) => <mesh key={x} position={[x, 1.125, -2.68]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.05, 0.09, 24]} /><meshStandardMaterial color="#222327" /></mesh>)}
    <mesh position={[1.45, MJ + 0.12, -2.72]} castShadow><cylinderGeometry args={[0.09, 0.1, 0.24, 24]} /><meshStandardMaterial color="#9fbad0" roughness={0.3} /></mesh>
  </group>);
};

// ---------- waktu cerita ----------
const keluarAt = (t: number) => (t < 7.2 ? r(t, 1.45, 2.1) : t < 58 ? 1 - r(t, 7.4, 7.9, back) : r(t, 61.05, 61.7));
const lamaAt = (t: number) => r(t, 25.4, 25.75) * (1 - r(t, 30.2, 30.6));
const nMenara = (t: number) => N_KOIN * r(t, 44.95, 46.65, Easing.inOut(Easing.quad));

const Dunia: React.FC<{t: number}> = ({t}) => {
  const warm = r(t, 36.6, 36.9) * (1 - r(t, 56.98, 57.3));
  const koin1 = r(t, 4.0, 4.55, Easing.in(Easing.quad));
  return (<group>
    <Rumah />
    <StopKontak />
    <Charger keluar={keluarAt(t)} lama={lamaAt(t)} rusak={r(t, 58.5, 59.0)} t={t} />
    <KabelCharger keluar={keluarAt(t)} rusak={r(t, 58.5, 59.0)} t={t} />
    {t > 3.9 && <Koin p={KOIN1} n={koin1 >= 1 ? 1 : 0.0001} jatuh={(1 - koin1) * 1.2} />}
    {t > 3.9 && koin1 < 1 && <mesh geometry={gKoin} material={mKoin} position={[KOIN1[0], LT + TK / 2 + (1 - koin1) * 1.2, KOIN1[2]]} rotation={[(1 - koin1) * 2, 0, 0]} />}
    <MagicCom t={t} warm={warm} balik={r(t, 51.3, 56.6)} lingkar={0} />
    {t > 44.9 && <Koin p={MENARA} n={nMenara(t)} />}
  </group>);
};

// ---------- kamera (satu kanvas perspektif FOV 34) ----------
const SKL: V3 = [SK[0], 0.5, SK[2]];
const MCL: V3 = [MC[0], MJ + 0.2, MC[2]];
const KAM: Key[] = [
  orb(0, 24, 12, 2.4, [-1.2, 0.5, -2.8]), orb(1.4, 20, 12, 2.2, [-1.15, 0.48, -2.8]), orb(3.7, 14, 18, 2.3, [-1.0, 0.36, -2.65]), orb(6.9, 8, 20, 2.4, [-1.0, 0.34, -2.62]),
  orb(7.3, 28, 12, 2.1, [-1.2, 0.52, -2.8]), orb(12.9, 14, 12, 1.9, [-1.2, 0.5, -2.8]), orb(22.6, -8, 12, 2.0, [-1.1, 0.48, -2.8]),
  orb(23.2, 24, 14, 1.9, [-1.05, 0.52, -2.85]), orb(32.6, -4, 12, 1.8, [-1.05, 0.52, -2.85]),
  orb(34.3, -4, 38, 6.5, [0.6, 1.4, -1.6]), orb(35.9, -22, 18, 2.2, [MC[0] - 0.1, MJ + 0.12, MC[2]]), orb(41.2, -30, 16, 2.0, [MC[0] - 0.1, MJ + 0.12, MC[2]]),
  orb(44.8, -34, 14, 5.0, [3.2, 1.2, -1.9]), orb(47.4, -28, 20, 9.5, [3.3, 2.9, -1.7]),
  orb(48.2, 10, 28, 23, [1.3, 2.1, -1.0]), orb(50.6, 4, 28, 22, [1.3, 2.1, -1.0]),
  orb(51.2, -12, 12, 1.9, [MC[0], MJ + 0.3, MC[2]]), orb(55.6, -6, 10, 1.7, [MC[0], MJ + 0.32, MC[2]]), orb(57.8, -14, 14, 1.8, [MC[0] - 0.1, MJ + 0.12, MC[2]]),
];
const KAKHIR: Key[] = [orb(57.95, 24, 12, 2.1, [-1.15, 0.44, -2.8]), orb(63.7, 8, 12, 1.9, [-1.15, 0.44, -2.8]), orb(64.2, 8, 28, 20, [1.2, 1.9, -0.9]), orb(67.2, 4, 32, 24, [1.2, 2.3, -1.0])];
const kamAt = (t: number): Kam => ({...camAt(t < 57.95 ? KAM : KAKHIR, t), fov: 34});

// ---------- overlay ----------
const menaraAtas = (t: number): V3 => [MENARA[0], LT + TK * nMenara(t) + 0.05, MENARA[2]];
const LABELS: Lb[] = [
  {a: 0.6, b: 3.6, text: 'Charger, dicabut tiap malam', at: [SK[0], SK[1] + 0.04, SK[2] + 0.05], side: 'R', dy: -200},
  {a: 4.6, b: 6.9, text: 'Rp100 / bulan', at: [KOIN1[0], LT + 0.04, KOIN1[2]], side: 'L', dy: -260},
  {a: 9.3, b: 12.9, text: 'Tanpa HP', at: [-1.3, LT + 0.02, -2.34], side: 'L', dy: -60},
  {a: 11.8, b: 12.9, text: '± 0,1 watt', at: [SK[0], SK[1], SK[2] + 0.06], side: 'R', dy: -140},
  {a: 25.8, b: 30.3, text: 'Model lama, lebih boros', at: [SK[0], SK[1] + 0.05, SK[2] + 0.1], side: 'R', dy: 220, merah: true},
  {a: 36.6, b: 41.0, text: 'Mode warm', at: [MC[0] + 0.03, MJ + 0.115, MC[2] + 0.175], side: 'R', dy: 160},
  {a: 38.2, b: 41.0, text: 'Label: 40 sampai 80 watt', at: [MC[0] - 0.12, MJ + 0.1, MC[2] + 0.1], side: 'L', dy: -120},
  {a: 45.2, b: 47.6, text: '1 keping = Rp104', at: [MENARA[0] - RK, LT + 0.05, MENARA[2]], side: 'L', dy: -60},
  {a: 48.2, b: 50.4, text: 'Charger: 1 keping', at: [KOIN1[0], LT + 0.04, KOIN1[2]], side: 'L', dy: 120},
  {a: 48.6, b: 50.4, text: 'Magic com: 225 keping', at: [MENARA[0], LT + TK * N_KOIN, MENARA[2]], side: 'R', dy: 60, merah: true},
  {a: 57.0, b: 57.8, text: 'Matikan', at: [MC[0] + 0.03, MJ + 0.115, MC[2] + 0.175], side: 'R', dy: 120},
  {a: 58.7, b: 61.4, text: 'Kabel panas / rusak', at: [SK[0] - 0.01, 0.31, -2.94], side: 'L', dy: 80, merah: true},
  {a: 61.6, b: 63.6, text: 'Cabut, demi keamanan', at: [SK[0], 0.3, SK[2] + 0.2], side: 'R', dy: -120},
  {a: 64.8, b: 67.2, text: 'Charger: 1 keping', at: [KOIN1[0], LT + 0.04, KOIN1[2]], side: 'L', dy: 100},
  {a: 65.2, b: 67.2, text: 'Magic com: 225', at: [MENARA[0], LT + TK * N_KOIN, MENARA[2]], side: 'R', dy: 40, merah: true},
];

const kartuGaya = {borderRadius: 26, background: 'rgba(251,248,241,0.96)', boxShadow: '0 12px 34px rgba(30,30,30,0.2)', fontFamily: 'Inter'} as const;
const masuk = (t: number, a: number, b: number) => r(t, a, a + 0.45, Easing.out(Easing.cubic)) * (1 - r(t, b - 0.35, b));

/** kalender 30 hari terisi + hasil kWh + rupiah (13,5–22,6) */
const Sebulan: React.FC<{t: number}> = ({t}) => {
  const p = masuk(t, 13.4, 22.7); if (p <= 0.01) return null;
  const isi = r(t, 13.7, 14.9), h1 = r(t, 15.1, 15.5), h2 = r(t, 17.0, 17.5), h3 = r(t, 18.9, 19.4), h4 = r(t, 21.35, 21.75, back);
  return (<div style={{position: 'absolute', left: 70, right: 70, top: 290, padding: '26px 34px', ...kartuGaya, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8}}>
      {Array.from({length: 30}, (_, i) => { const k = r(isi, i / 30, i / 30 + 0.12); return <div key={i} style={{height: 40, borderRadius: 8, background: k > 0.5 ? '#ef6a4c' : '#e6e0d3', transform: `scale(${0.85 + 0.15 * k})`}} />; })}
    </div>
    <div style={{fontWeight: 700, fontSize: 34, color: '#6a6a6e', marginTop: 14, opacity: h1}}>0,1 W × 24 jam × 30 hari</div>
    <div style={{fontWeight: 900, fontSize: 64, color: '#2a2a2e', letterSpacing: -1.5, opacity: h2}}>≈ 0,07 kWh</div>
    <div style={{fontWeight: 700, fontSize: 34, color: '#6a6a6e', marginTop: 6, opacity: h3}}>× Rp1.445 per kWh (nonsubsidi)</div>
    <div style={{fontWeight: 900, fontSize: 72, color: '#3f8a5c', letterSpacing: -1.5, opacity: h4, transform: `scale(${0.85 + 0.15 * h4})`, transformOrigin: 'left'}}>≈ Rp100 sebulan</div>
  </div>);
};

/** batang: daya tanpa beban adaptor, rata-rata UE 2020 (28,4–32,6) */
const Batang: React.FC<{t: number}> = ({t}) => {
  const p = masuk(t, 28.3, 32.7); if (p <= 0.01) return null;
  const a = r(t, 28.6, 29.4, Easing.out(Easing.cubic)), b = r(t, 30.0, 30.8, Easing.out(Easing.cubic)), hi = r(t, 31.5, 31.9);
  const bar = (lbl: string, v: number, k: number, c: string) => (<div style={{marginTop: 18}}>
    <div style={{fontWeight: 800, fontSize: 38, color: '#2a2a2e'}}>{lbl}</div>
    <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 8}}>
      <div style={{height: 46, width: `${(v / 0.43) * 64 * k}%`, borderRadius: 12, background: c}} />
      <div style={{fontWeight: 900, fontSize: 46, color: c, opacity: k}}>{v.toFixed(2).replace('.', ',')} W</div>
    </div></div>);
  return (<div style={{position: 'absolute', left: 70, right: 70, top: 290, padding: '24px 34px 26px', ...kartuGaya, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
    <div style={{fontWeight: 700, fontSize: 30, color: '#6a6a6e'}}>Adaptor dicolok tanpa beban, rata-rata Eropa 2020</div>
    {bar('Tanpa aturan efisiensi', 0.43, a, '#e0442e')}
    {bar('Dengan aturan efisiensi', 0.10, b, hi > 0.5 ? '#3f8a5c' : '#7a8a80')}
    <div style={{fontWeight: 600, fontSize: 24, color: '#8a8a8e', marginTop: 14}}>Sumber: Komisi Eropa, Ecodesign 2019/1782</div>
  </div>);
};

/** rumus magic com (41,4–50,6) */
const Rumus: React.FC<{t: number}> = ({t}) => {
  const p = masuk(t, 41.3, 47.7); if (p <= 0.01) return null;
  const parts: [string, number][] = [['45 W', 41.6], ['× 12 jam', 43.4], ['× 30 hari', 44.9]];
  return (<div style={{position: 'absolute', left: 70, right: 70, top: 290, padding: '22px 30px', ...kartuGaya, opacity: p, display: 'flex', justifyContent: 'center', gap: 22}}>
    {parts.map(([s, a]) => { const k = r(t, a, a + 0.4, back); return <div key={s} style={{fontWeight: 900, fontSize: 58, color: '#2a2a2e', letterSpacing: -1.2, opacity: k, transform: `translateY(${(1 - k) * 20}px)`}}>{s}</div>; })}
  </div>);
};

/** penghitung rupiah di puncak menara (45–50,4) */
const Hitung: React.FC<{t: number; cam: Kam}> = ({t, cam}) => {
  const p = masuk(t, 45.0, 48.7); if (p <= 0.01) return null;
  const v = Math.round((nMenara(t) / N_KOIN) * 23409 / 100) * 100;
  const [x0, y0] = proj2(cam, menaraAtas(t));
  const x = Math.max(300, Math.min(780, x0)), y = Math.max(540, Math.min(1180, y0 - 110));
  const hi = t > 46.7;
  return (<div style={{position: 'absolute', left: x - 240, top: y - 50, width: 480, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 80, letterSpacing: -2, color: hi ? '#e0442e' : '#2a2a2e', textShadow: '0 3px 0 rgba(255,255,255,0.85)', opacity: p}}>
    Rp{v.toLocaleString('id-ID')}<span style={{fontSize: 40, fontWeight: 700}}> /bulan</span></div>);
};
const Kali: React.FC<{t: number}> = ({t}) => {
  const p = r(t, 48.8, 49.3, back) * (1 - r(t, 50.2, 50.6)); if (p <= 0.01) return null;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 150, color: '#e0442e', letterSpacing: -4, opacity: p, transform: `scale(${0.7 + 0.3 * p})`, textShadow: '0 4px 0 rgba(255,255,255,0.8)'}}>×225</div>;
};

const SFX: [number, string, number][] = [[1.5, 'pop', 0.45], [4.5, 'ting', 0.4], [7.45, 'pop', 0.3], [13.7, 'tick', 0.25], [21.4, 'ting', 0.3], [25.45, 'thud', 0.3],
  [33.0, 'whoosh', 0.3], [36.65, 'ting', 0.25], [44.95, 'riser', 0.25], [46.75, 'ting', 0.4], [51.4, 'whoosh', 0.25], [57.0, 'tick', 0.35], [61.1, 'pop', 0.45]];

export const Charger06: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, ms = t * 1000, words = (wordsJson as {words: {word: string; start: number; end: number}[]}).words;
  const cam = kamAt(t);
  const dip = r(t, 57.65, 57.95) * (1 - r(t, 57.95, 58.25));
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#bcd8ee 0%,#e6eef0 55%,#f3e9d6 100%)'}}>
      <Audio src={staticFile('e1-06/vo.wav')} />
      {SFX.map(([d, n, v]) => <Sequence key={`${d}${n}`} from={Math.round(d * FPS)} durationInFrames={60}><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
      <Langit t={t} />
      <AbsoluteFill style={{filter: 'contrast(1.07) saturate(1.1)'}}>
        <ThreeCanvas width={1080} height={1920} camera={{position: cam.pos, fov: 34}} gl={{alpha: true, antialias: true}} shadows>
          <Env intensity={0.8} /><Rig2 k={cam} /><Cahaya /><Kabut tele={false} />
          <Dunia t={t} />
        </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,24,34,0.3) 100%)', pointerEvents: 'none'}} />
      {LABELS.map((l) => <Label2 key={l.text} l={l} t={t} cam={cam} />)}
      <Sebulan t={t} />
      <Batang t={t} />
      <Rumus t={t} />
      <Hitung t={t} cam={cam} />
      <Kali t={t} />
      <Kicker t={t} a={-1} b={3.7} text="Rajin cabut charger?" />
      <Kicker t={t} a={3.9} b={7.0} text="Hematnya cuma segini" />
      <Kicker t={t} a={7.4} b={13.0} text="Charger tanpa HP" />
      <Kicker t={t} a={13.3} b={22.7} text="Dicolok sebulan penuh" />
      <Kicker t={t} a={23.3} b={32.6} text="Dulu memang boros" />
      <Kicker t={t} a={33.0} b={41.1} text="Yang boros: magic com" />
      <Kicker t={t} a={41.3} b={50.6} text="Hitung sendiri" />
      <Kicker t={t} a={51.0} b={57.8} text="Cek labelnya" />
      <Kicker t={t} a={58.2} b={63.8} text="Kabel rusak? Cabut" />
      <Kicker t={t} a={64.1} b={67.2} text="Fakta Rumah" />
      <AbsoluteFill style={{background: '#fbf8f1', opacity: dip, pointerEvents: 'none'}} />
      <Captions ms={ms} words={words} />
    </AbsoluteFill>
  );
};
