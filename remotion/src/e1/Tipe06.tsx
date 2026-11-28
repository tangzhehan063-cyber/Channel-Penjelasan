// E1 #06 "Rumah Tipe 36: Naik Tingkat atau Melebar?". Gaya E1-03 (style/gaya-e1-03.md). 100% kode: Remotion + three.js, tanpa API AI.
// Waktu = VO final public/e1-06 (68,5 dtk, Gemini Achernar). Rencana adegan: e1/e06-tipe-36.md.
// Skill pustaka: isometric-animation (kamera tele di satu kanvas, build/angkat di sumbu Y, breakdown x-ray satu momen),
// threejs-animation (semua gerak fungsi waktu, acak ber-seed).
// Bentuk acuan: rumah tipe 36/72 perumahan (fasad 6 m, atap pelana dengan segitiga menghadap jalan, teras kecil, halaman depan & belakang ±3 m, deret berdempetan).
// 1 satuan = 1 m. Aturan z-fighting: tak ada permukaan sebidang; benda menumpu menancap 0,02 m.
import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import {AbsoluteFill, Audio, Easing, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/inter/600.css'; import '@fontsource/inter/700.css'; import '@fontsource/inter/800.css'; import '@fontsource/inter/900.css';
import * as THREE from 'three';
import {Env} from '../pengetahuan/Scene';
import {Captions} from '../kit/teks';
import {camAt, FPS, nudgeKey, r, type Key, type V3} from '../kit/waktu';
import {Kicker, useTex} from './AnatomiRumah';
import {Blok, useBahan, type Bahan} from './look';
import {back, Cahaya, iso, Kabut, Label2, Langit, lerp, orb, proj2, Rig2, tele, type Kam, type Lb} from './Tiang03';
import wordsJson from '../../public/e1-06/words.json';

export const R06_FRAMES = Math.round(68.9 * FPS);
type Tex = ReturnType<typeof useTex>;
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- ukuran (meter) ----------
const Y0 = 0.3, H = 3.0, T = 0.15, TOP = Y0 + H;            // lantai, tinggi dinding, tebal, puncak dinding
const ZF = -1.2, ZB = -6.0, ZPAGAR = 3.0, ZBLK = -9.0;      // muka dinding depan, belakang, pagar depan, batas belakang
const FZ = ZF - T / 2, BZ = ZB + T / 2, SX = 3 - T / 2;     // sumbu dinding
const H2 = 2.9, SLAB = 0.16, NAIK = SLAB + H2;              // lantai 2: pelat + dinding -> atap naik 3,06
const RISE = 1.55, KM = (RISE) / 3, ANG = Math.atan(KM);    // atap pelana: puncak 1,55 di atas dinding (bubungan sejajar z)
const ROW = [-12, -6, 0, 6, 12];
const WARNA = ['#e9dcc4', '#dfe7df', '#efe5d2', '#e6dccd', '#e2e4dc'];

// ---------- shot & keadaan per waktu ----------
type Shot = {a: number; b: number; tele: boolean; keys: Key[]; bdg?: boolean};
const L36: V3 = [0, 2.4, -2.5];
const SHOTS: Shot[] = [
  {a: 0, b: 6.15, tele: false, keys: [orb(0, 32, 19, 35, [0, 2.4, -2.6]), orb(6.15, 25, 20, 30, [0, 2.6, -2.8])]},
  {a: 6.15, b: 11.05, tele: true, keys: [iso(6.15, [0, 0.4, -3], 47, 30, 62), iso(11.05, [0, 0.4, -3], 49, 40, 64)]},
  {a: 11.05, b: 25.0, tele: true, keys: [iso(11.05, [0, 1.8, -5.0], 62, 214, 36), iso(14.4, [0, 1.8, -5.0], 64, 220, 38), iso(19.6, [0, 1.6, -4.4], 62, 208, 42),
    iso(22.6, [0, 1.2, -3.0], 50, 200, 58), iso(25.0, [0, 1.2, -3.0], 52, 196, 60)]},
  {a: 25.0, b: 35.5, tele: false, keys: [orb(25.0, 34, 16, 32, [0, 4.4, -3]), orb(30.6, 40, 16, 32, [0, 5.2, -3]), orb(31.4, 42, 13, 28, [0, 3.0, -3.4]), orb(35.5, 50, 11, 27, [0, 2.6, -3.4])]},
  {a: 35.5, b: 47.0, tele: false, bdg: true, keys: [orb(35.5, 26, 13, 33, [0, 6.4, -3]), orb(38.3, 22, 13, 32, [0, 6.2, -3]), orb(42.6, 14, 12, 31, [0, 6.0, -3]), orb(47.0, 6, 12, 30, [0, 6.2, -3])]},
  {a: 47.0, b: 56.5, tele: false, keys: [orb(47.0, 36, 12, 30, [0, 3.2, -3.4]), orb(51.0, 28, 13, 31, [0, 4.0, -3.2]), orb(56.5, 20, 15, 33, [0, 4.6, -3])]},
  {a: 56.5, b: 62.8, tele: true, keys: [iso(56.5, [0, 1.6, -5.2], 60, 214, 38), iso(62.8, [0, 1.8, -5.0], 56, 228, 42)]},
  {a: 62.8, b: 69, tele: false, keys: [orb(62.8, 32, 19, 35, [0, 2.4, -2.6]), orb(69, 22, 22, 40, [0, 3.0, -2.6])]},
];
const shotAt = (t: number) => SHOTS.find((s) => t < s.b) ?? SHOTS[SHOTS.length - 1];
const di = (t: number, a: number, b: number) => t >= a && t < b;

const keadaan = (t: number) => {
  const s4 = di(t, 25.0, 35.5), s6 = di(t, 47.0, 56.5), s7 = di(t, 56.5, 62.8);
  const turun = s4 ? r(t, 25.9, 26.9, back) : s6 ? 1 : 0;
  const angkat = s4 ? 1.4 * r(t, 25.7, 26.1) * (1 - r(t, 26.5, 27.0)) : 0;
  return {
    hantuNaik: r(t, 2.6, 3.2) * (1 - r(t, 5.5, 6.0)) + r(t, 62.9, 63.5) + (s7 ? 0.7 * r(t, 60.0, 60.8) : 0),
    hantuLebar: r(t, 3.9, 4.5) * (1 - r(t, 5.5, 6.0)) + r(t, 63.6, 64.2),
    ext: di(t, 11.05, 25.0) ? r(t, 12.3, 13.7, back) * 3 : s7 ? r(t, 58.0, 59.3, back) * 1.5 : 0,
    lt2: turun, atap: NAIK * Math.min(1, turun) + angkat,
    dinding: s4 ? 1 - 0.74 * r(t, 31.0, 31.8) : s6 ? 0.26 : 1,
    tanah: s4 ? 1 - 0.72 * r(t, 31.0, 31.8) : s6 ? 0.28 : s7 ? 1 - 0.68 * r(t, 59.7, 60.4) : 1,
    struktur: s4 ? r(t, 31.0, 31.8) : s6 ? 1 : 0,
    beban: s4 ? r(t, 33.0, 33.5) : 0,
    kolomBaru: s6 ? r(t, 47.2, 49.3, Easing.out(Easing.cubic)) : 0,
    telapak: s6 ? 1 : s7 ? r(t, 59.8, 60.5) : 0,
    gelap: di(t, 11.05, 25.0) ? r(t, 21.4, 22.2) : 0,
    hujan: di(t, 11.05, 25.0) ? r(t, 22.4, 23.0) : 0,
    genang: di(t, 11.05, 25.0) ? r(t, 22.9, 24.6) : 0,
    ukur: di(t, 6.15, 11.05) ? r(t, 6.3, 6.9) : 0,
    ukurTanah: di(t, 6.15, 11.05) ? r(t, 8.9, 9.6) : 0,
  };
};
type K = ReturnType<typeof keadaan>;

// ---------- objek ----------
/** dinding berlubang dengan opasitas (extrude); tekstur diulang tiap 1,6 m */
const Dinding: React.FC<{L: number; Ht: number; holes: [number, number, number, number][]; map: THREE.Texture; o: number; c?: string}> = ({L, Ht, holes, map, o, c = '#ffffff'}) => {
  const g = useMemo(() => {
    const s = new THREE.Shape(); s.moveTo(-L / 2, 0); s.lineTo(L / 2, 0); s.lineTo(L / 2, Ht); s.lineTo(-L / 2, Ht); s.closePath();
    holes.forEach(([x, y, w, h]) => { const p = new THREE.Path(); p.moveTo(x - w / 2, y); p.lineTo(x + w / 2, y); p.lineTo(x + w / 2, y + h); p.lineTo(x - w / 2, y + h); p.closePath(); s.holes.push(p); });
    const e = new THREE.ExtrudeGeometry(s, {depth: T, bevelEnabled: false}); e.translate(0, 0, -T / 2); return e;
  }, [L, Ht, JSON.stringify(holes)]);
  const m = useMemo(() => { const k = map.clone(); k.repeat.set(1 / 1.6, 1 / 1.6); k.needsUpdate = true; return k; }, [map]);
  return <mesh geometry={g} castShadow={o >= 1} receiveShadow><meshStandardMaterial color={c} map={m} bumpMap={m} bumpScale={0.4} roughness={0.95} transparent={o < 1} opacity={o} depthWrite={o >= 1} side={THREE.DoubleSide} /></mesh>;
};
const SEGITIGA = (() => { const s = new THREE.Shape(); s.moveTo(-3, 0); s.lineTo(3, 0); s.lineTo(0, RISE - 0.08); s.closePath(); return s; })();
const Gevel: React.FC<{map: THREE.Texture; o: number; c: string}> = ({map, o, c}) => {
  const g = useMemo(() => { const e = new THREE.ExtrudeGeometry(SEGITIGA, {depth: 0.12, bevelEnabled: false}); e.translate(0, 0, -0.06); return e; }, []);
  const m = useMemo(() => { const k = map.clone(); k.repeat.set(1 / 1.6, 1 / 1.6); k.needsUpdate = true; return k; }, [map]);
  return <mesh geometry={g} castShadow={o >= 1}><meshStandardMaterial color={c} map={m} roughness={0.95} transparent={o < 1} opacity={o} depthWrite={o >= 1} side={THREE.DoubleSide} /></mesh>;
};
/** jendela kaca + kusen; terang = kaca memantulkan langit, gelap = ruang di belakangnya gelap */
const Jendela: React.FC<{x: number; y: number; z: number; w: number; h: number; b: Bahan; gelap?: number; o: number}> = ({x, y, z, w, h, b, gelap = 0, o}) => {
  const kaca = new THREE.Color('#bfe1ef').lerp(new THREE.Color('#2b3138'), gelap);
  return (<group position={[x, y, z]}>
    <mesh><boxGeometry args={[w - 0.04, h - 0.04, 0.03]} /><meshStandardMaterial color={kaca} emissive={new THREE.Color('#9fd3ea')} emissiveIntensity={0.25 * (1 - gelap)} roughness={0.15} transparent opacity={0.85 * o} depthWrite={false} /></mesh>
    {o > 0.5 && <><Blok p={[0, h / 2, 0]} s={[w + 0.1, 0.07, 0.17]} map={b.kayu} /><Blok p={[0, -h / 2, 0]} s={[w + 0.1, 0.07, 0.2]} map={b.kayu} />
      <Blok p={[-w / 2, 0, 0]} s={[0.07, h, 0.17]} map={b.kayu} /><Blok p={[w / 2, 0, 0]} s={[0.07, h, 0.17]} map={b.kayu} /><Blok p={[0, 0, 0]} s={[0.05, h, 0.12]} map={b.kayu} /></>}
  </group>);
};

/** struktur lama: pondasi menerus (batu kali), sloof, kolom praktis, ring balk. Muncul saat x-ray. */
const KOLOM: [number, number][] = [[-SX, FZ], [SX, FZ], [-SX, BZ], [SX, BZ], [-SX, -3.6], [SX, -3.6], [0, FZ], [0, BZ]];
const Struktur: React.FC<{k: K; b: Bahan; x: Tex}> = ({k, b, x}) => {
  if (k.struktur < 0.01) return null;
  const o = k.struktur, merah = k.beban;
  const kol = new THREE.Color('#ef6a4c').lerp(new THREE.Color('#e0442e'), merah);
  const garis: [V3, V3][] = [[[0, 0, FZ], [6, 0, 0.7]], [[0, 0, BZ], [6, 0, 0.7]], [[-SX, 0, -3.6], [0.7, 0, 4.8]], [[SX, 0, -3.6], [0.7, 0, 4.8]]];
  return (<group>
    {garis.map(([p, s], i) => <group key={i}>
      <Blok p={[p[0], -0.62, p[2]]} s={[s[0] || 0.7, 0.36, s[2] || 0.7]} map={b.batuan} bump={0.6} c="#8b8b86" o={o} />
      <Blok p={[p[0], -0.24, p[2]]} s={[s[0] ? s[0] - 0.1 : 0.4, 0.42, s[2] ? s[2] - 0.1 : 0.4]} map={b.batuan} bump={0.6} c={merah > 0.01 ? `#${new THREE.Color('#8b8b86').lerp(new THREE.Color('#e0442e'), merah * 0.7).getHexString()}` : '#8b8b86'} o={o} />
      <Blok p={[p[0], 0.2, p[2]]} s={[s[0] ? s[0] : 0.16, 0.18, s[2] ? s[2] : 0.16]} map={x.beton} c="#b8b4aa" o={o} />
    </group>)}
    {KOLOM.map(([cx, cz], i) => <mesh key={i} position={[cx, Y0 + H / 2, cz]}><boxGeometry args={[0.16, H, 0.16]} /><meshStandardMaterial color={kol} emissive={new THREE.Color('#e0442e')} emissiveIntensity={0.5 * merah * (0.6 + 0.4 * Math.sin(i + merah * 9))} roughness={0.7} transparent={o < 1} opacity={o} depthWrite={o >= 1} /></mesh>)}
  </group>);
};

/** struktur baru untuk lantai 2: pondasi telapak + kolom besar, tumbuh dari bawah */
const KBARU: [number, number][] = [[-2.55, -1.65], [2.55, -1.65], [-2.55, -5.55], [2.55, -5.55], [-2.55, -3.6], [2.55, -3.6]];
const KolomBaru: React.FC<{k: K; x: Tex}> = ({k, x}) => {
  if (k.telapak < 0.01) return null;
  const hMax = TOP + NAIK + 1.0, h = k.kolomBaru * hMax;
  return (<group>
    {KBARU.map(([cx, cz], i) => <group key={i}>
      <Blok p={[cx, -1.15, cz]} s={[0.95, 0.3, 0.95]} map={x.beton} c="#f08a6c" o={Math.min(1, k.telapak)} />
      {h > 0.02 && <Blok p={[cx, -1.0 + h / 2, cz]} s={[0.26, h, 0.26]} c="#ef6a4c" r={0.6} />}
    </group>)}
  </group>);
};

/** perluasan belakang: dinding samping + belakang + dak, kedalaman D (m) */
const Perluasan: React.FC<{D: number; b: Bahan; x: Tex; c: string; o?: number}> = ({D, b, x, c, o = 1}) => {
  if (D < 0.02) return null;
  const z0 = ZB, z1 = ZB - D, cz = (z0 + z1) / 2;
  return (<group>
    <Blok p={[0, 0.15, cz]} s={[5.7, 0.3, D]} map={x.beton} c="#c9c4b8" o={o} />
    {[-SX, SX].map((sx) => <Blok key={sx} p={[sx, Y0 + H / 2, cz]} s={[T, H, D]} map={b.plester} rep={[Math.max(0.3, D / 1.6), 1.8]} bump={0.4} c={c} o={o} />)}
    {D > 0.3 && <Blok p={[0, Y0 + H / 2, z1 + T / 2]} s={[6 - 2 * T - 0.02, H, T]} map={b.plester} rep={[3, 1.8]} bump={0.4} c={c} o={o} />}
    <Blok p={[0, TOP + 0.08, cz - 0.04]} s={[6.04, 0.16, D + 0.08]} map={x.beton} c="#cfcbc2" o={o} />
  </group>);
};

/** rumah tipe 36: teras + pintu + jendela depan, jendela belakang, atap pelana genteng (segitiga gevel di depan & belakang) */
const Rumah36: React.FC<{k: K; b: Bahan; x: Tex; c: string; utama: boolean}> = ({k, b, x, c, utama}) => {
  const o = utama ? k.dinding : 1, lt2 = utama ? k.lt2 : 0, atap = utama ? k.atap : 0;
  const hs = 3.1, Ls = hs / Math.cos(ANG) + 0.02, RZ0 = 0.35, RZ1 = ZB - 0.3, rl = RZ0 - RZ1, rc = (RZ0 + RZ1) / 2;
  const gt = useMemo(() => { const m = x.genteng.clone(); m.repeat.set(3, 4); m.needsUpdate = true; return m; }, [x.genteng]);
  return (<group>
    {/* lantai/pondasi tampak + teras */}
    <Blok p={[0, Y0 / 2, (ZF + ZB) / 2]} s={[6, Y0, ZF - ZB]} map={x.beton} c="#bdb8ad" o={o} />
    <Blok p={[0, 0.12, ZF / 2]} s={[5.9, 0.24, -ZF]} map={x.beton} rep={[2, 1]} c="#d2cdc2" />
    {/* dinding */}
    <group position={[0, Y0, FZ]}><Dinding L={6} Ht={H} holes={[[-1.5, 0, 0.9, 2.1], [1.2, 0.9, 1.5, 1.1]]} map={b.plester} o={o} c={c} /></group>
    <group position={[0, Y0, BZ]}><Dinding L={6} Ht={H} holes={[[1.2, 0.9, 1.2, 1.0]]} map={b.plester} o={o} c={c} /></group>
    {[-SX, SX].map((sx) => <Blok key={sx} p={[sx, Y0 + H / 2, -3.6]} s={[T, H, ZF - ZB - 2 * T]} map={b.plester} rep={[3, 1.8]} bump={0.4} c={c} o={o} />)}
    {/* pintu + jendela */}
    <Blok p={[-1.5, Y0 + 1.04, FZ + 0.01]} s={[0.86, 2.06, 0.05]} map={b.kayu} bump={0.4} o={o} />
    <Jendela x={1.2} y={Y0 + 1.45} z={FZ} w={1.5} h={1.1} b={b} o={o} />
    <Jendela x={1.2} y={Y0 + 1.4} z={BZ} w={1.2} h={1.0} b={b} o={o} gelap={utama ? k.gelap : 0} />
    {/* teras: 2 tiang + balok */}
    {[-2.78, 2.78].map((sx) => <Blok key={sx} p={[sx, 0.24 + (3.13 - 0.24) / 2, -0.15]} s={[0.2, 3.13 - 0.24 + 0.02, 0.2]} c="#f4efe4" map={b.plester} o={o} />)}
    <Blok p={[0, 3.22, -0.15]} s={[6.0, 0.22, 0.22]} c="#f4efe4" map={b.plester} o={o} />
    {/* lantai 2 (turun dari atas: angkat di sumbu Y, bukan skala) */}
    {lt2 > 0.001 && <group position={[0, TOP - 0.02 + (1 - Math.min(1, lt2)) * 4.2, 0]}>
      <Blok p={[0, SLAB / 2, (ZF + ZB) / 2]} s={[6.06, SLAB, ZF - ZB + 0.06]} map={x.beton} c="#cfcbc2" o={Math.max(o, 0.35)} />
      <group position={[0, SLAB, FZ]}><Dinding L={6} Ht={H2} holes={[[-1.4, 0.85, 1.2, 1.1], [1.4, 0.85, 1.2, 1.1]]} map={b.plester} o={o} c={c} /></group>
      <group position={[0, SLAB, BZ]}><Dinding L={6} Ht={H2} holes={[[0, 0.9, 1.2, 1.0]]} map={b.plester} o={o} c={c} /></group>
      {[-SX, SX].map((sx) => <Blok key={sx} p={[sx, SLAB + H2 / 2, -3.6]} s={[T, H2, ZF - ZB - 2 * T]} map={b.plester} rep={[3, 1.8]} bump={0.4} c={c} o={o} />)}
      <Jendela x={-1.4} y={SLAB + 1.4} z={FZ} w={1.2} h={1.1} b={b} o={o} /><Jendela x={1.4} y={SLAB + 1.4} z={FZ} w={1.2} h={1.1} b={b} o={o} />
    </group>}
    {/* atap pelana: bubungan sejajar z, segitiga gevel di depan & belakang */}
    <group position={[0, TOP + atap, 0]}>
      <group position={[0, 0, FZ]}><Gevel map={b.plester} o={o} c={c} /></group>
      <group position={[0, 0, BZ]}><Gevel map={b.plester} o={o} c={c} /></group>
      {[-1, 1].map((s) => <mesh key={s} position={[s * hs / 2, RISE - KM * hs / 2 + 0.06, rc]} rotation={[0, 0, -s * ANG]} castShadow receiveShadow>
        <boxGeometry args={[Ls, 0.08, rl]} /><meshStandardMaterial map={gt} bumpMap={gt} bumpScale={0.8} roughness={0.85} /></mesh>)}
      <Blok p={[0, RISE + 0.1, rc]} s={[0.26, 0.12, rl + 0.04]} c="#a34a2a" r={0.8} />
    </group>
    {/* halaman depan (cor) + pagar rendah, gerbang terbuka di kiri */}
    <Blok p={[0, 0.05, (0 + ZPAGAR) / 2]} s={[5.96, 0.1, ZPAGAR - 0.02]} map={x.beton} rep={[2, 1]} c="#c9c5bb" />
    <Blok p={[1.55, 0.5, ZPAGAR]} s={[2.7, 0.8, 0.14]} map={b.plester} rep={[2, 0.5]} c={c} />
    {Array.from({length: 10}, (_, i) => 0.35 + i * 0.27).map((xx) => <Blok key={xx} p={[xx, 1.18, ZPAGAR]} s={[0.04, 0.58, 0.04]} c="#2f3236" r={0.4} />)}
    <Blok p={[1.55, 1.48, ZPAGAR]} s={[2.7, 0.05, 0.05]} c="#2f3236" r={0.4} />
    {[-2.9, 0.15, 2.9].map((xx) => <Blok key={xx} p={[xx, 0.65, ZPAGAR]} s={[0.24, 1.3, 0.24]} map={b.plester} c="#d8cdb9" />)}
    {/* sekat halaman belakang */}
    <Blok p={[3, 0.85, (ZB + ZBLK) / 2 - 0.02]} s={[0.12, 1.7, ZB - ZBLK - 0.04]} map={b.plester} rep={[2, 1]} c="#d8cdb9" />
  </group>);
};

/** hujan: tetes ber-seed jatuh di atas kavling (fungsi waktu) */
const Hujan: React.FC<{k: number; t: number}> = ({k, t}) => {
  if (k < 0.01) return null;
  return (<group>{Array.from({length: 150}, (_, i) => { const y = 9.5 - ((t * 10 + rnd(i, 3) * 9.5) % 9.5);
    return <mesh key={i} position={[lerp(-8, 8, rnd(i, 1)), y, lerp(-9.5, 3, rnd(i, 2))]}><boxGeometry args={[0.025, 0.36, 0.025]} /><meshBasicMaterial color="#6fa6d0" transparent opacity={0.75 * k} depthWrite={false} /></mesh>; })}</group>);
};

/** rumah kasus Kab. Bandung: 3 lantai, lantai 1 warung (ilustrasi, bukan replika) */
const Rumah3: React.FC<{c: number; merah: number; b: Bahan; x: Tex; t: number}> = ({c, merah, b, x, t}) => {
  const W = 5.2, D = 6.5, h1 = 3.0 * (1 - 0.72 * c), cz = -D / 2;
  const jit = t > 37.9 && t < 38.5 ? Math.sin(t * 70) * 0.03 : 0;
  const tint = `#${new THREE.Color('#d9cbb3').lerp(new THREE.Color('#e06650'), merah * 0.75).getHexString()}`;
  const Lt: React.FC<{y: number; win: boolean; col: string}> = useMemo(() => ({y, win, col}) => (<group position={[0, y, 0]}>
    <Blok p={[0, 0.08, cz]} s={[W + 0.1, 0.16, D + 0.1]} map={x.beton} c="#cfcbc2" />
    <Blok p={[0, 1.55, -D + 0.08]} s={[W, 2.9, 0.16]} map={b.plester} rep={[3, 1.8]} c={col} />
    {[-1, 1].map((s) => <Blok key={s} p={[s * (W / 2 - 0.08), 1.55, cz]} s={[0.16, 2.9, D - 0.32]} map={b.plester} rep={[3, 1.8]} c={col} />)}
    <Blok p={[0, 1.55, -0.08]} s={[W, 2.9, 0.16]} map={b.plester} rep={[3, 1.8]} c={col} />
    {win && [-1.3, 1.3].map((xx) => <Blok key={xx} p={[xx, 1.6, 0.0]} s={[1.3, 1.1, 0.04]} c="#9fc3d6" r={0.15} />)}
  </group>), [b, x]);
  return (<group position={[jit, 0, 0]}>
    {/* lantai 1: warung, rolling door + tenda */}
    <group>
      <Blok p={[0, 0.15, cz]} s={[W + 0.2, 0.3, D + 0.2]} map={x.beton} c="#bdb8ad" />
      <Blok p={[0, 0.3 + h1 / 2, -D + 0.08]} s={[W, h1, 0.16]} map={b.plester} rep={[3, 1.8]} c={tint} />
      {[-1, 1].map((s) => <Blok key={s} p={[s * (W / 2 - 0.08), 0.3 + h1 / 2, cz]} s={[0.16, h1, D - 0.32]} map={b.plester} rep={[3, 1.8]} c={tint} />)}
      <Blok p={[0, 0.3 + h1 / 2, -0.06]} s={[W - 0.34, h1, 0.06]} c="#9aa0a6" r={0.5} />
      {c < 0.3 && <Blok p={[0, 3.0, 0.7]} s={[W + 0.3, 0.06, 1.4]} c="#2f7fb8" r={0.6} rot={[0.18, 0, 0]} />}
    </group>
    {/* lantai 2-3 turun & miring saat ambruk */}
    <group position={[0, 0.3 + h1 - 0.02, cz]} rotation={[0.05 * c, 0, -0.11 * c]}>
      <group position={[0, 0, -cz]}>
        <Lt y={0} win col="#d9cbb3" /><Lt y={3.06} win col="#d9cbb3" />
        <group position={[0, 6.12, cz]}>
          {[-1, 1].map((s) => <mesh key={s} position={[s * W / 4, 0.75, 0]} rotation={[0, 0, -s * 0.52]} castShadow><boxGeometry args={[W / 2 / Math.cos(0.52) + 0.3, 0.08, D + 0.6]} /><meshStandardMaterial map={x.genteng} roughness={0.85} /></mesh>)}
          <Blok p={[0, 1.55, 0]} s={[0.26, 0.12, D + 0.64]} c="#a34a2a" />
        </group>
      </group>
    </group>
    {/* puing */}
    {c > 0.5 && Array.from({length: 14}, (_, i) => { const k = r(c, 0.5, 1); return <Blok key={i} p={[lerp(-3.4, 3.4, rnd(i, 7)), lerp(1.6, 0.12 + rnd(i, 8) * 0.2, k), lerp(-0.4, 1.8, rnd(i, 9))]} s={[0.2 + rnd(i, 4) * 0.4, 0.14 + rnd(i, 5) * 0.2, 0.2 + rnd(i, 6) * 0.4]} map={b.plester} c="#cbbfa8" rot={[rnd(i, 1), rnd(i, 2), rnd(i, 3)]} />; })}
  </group>);
};

const Garis: React.FC<{a: V3; b: V3; k: number; c?: string}> = ({a, b, k, c = '#ef6a4c'}) => {
  if (k < 0.01) return null;
  const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), L = d.length() * k, mid: V3 = [a[0] + d.x * k / 2, a[1] + d.y * k / 2, a[2] + d.z * k / 2];
  const rotY = Math.atan2(d.x, d.z);
  return (<group position={mid} rotation={[0, rotY, 0]}>
    <mesh><boxGeometry args={[0.09, 0.09, L]} /><meshBasicMaterial color={c} /></mesh>
    {[-1, 1].map((s) => <mesh key={s} position={[0, 0, s * L / 2]}><boxGeometry args={[0.5, 0.09, 0.09]} /><meshBasicMaterial color={c} /></mesh>)}
  </group>);
};

const Dunia: React.FC<{t: number; bdg: boolean}> = ({t, bdg}) => {
  const b = useBahan(), x = useTex(), k = keadaan(t);
  const go = k.tanah;
  return (<group>
    {/* tanah (bisa tembus pandang saat x-ray), tanah dalam, jalan, selokan */}
    <Blok p={[0, -0.1, 0]} s={[80, 0.2, 60]} map={b.rumput} rep={[24, 16]} bump={0.6} o={go} />
    {go < 0.99 && <Blok p={[0, -1.4, -3]} s={[30, 2.36, 16]} map={b.lempung} rep={[8, 2]} c="#8a7b68" o={0.22 * (1 - go)} bayang={false} />}
    <Blok p={[0, -0.04, 6.3]} s={[80, 0.14, 5.4]} map={b.jalan} rep={[16, 1.5]} bump={0.4} c="#8f8c86" />
    <Blok p={[0, -0.03, 3.35]} s={[80, 0.1, 0.5]} c="#6e6a62" r={0.9} />
    {[-24, -16, -8, 0, 8, 16, 24].map((xx) => <Blok key={xx} p={[xx, 0.045, 6.3]} s={[3, 0.02, 0.12]} c="#e8e3d6" r={0.8} bayang={false} />)}
    {bdg ? (<group>
      <Rumah3 c={r(t, 38.4, 39.4, Easing.in(Easing.quad)) * (1 - r(t, 42.0, 42.8))} merah={r(t, 43.9, 44.4) * (1 - r(t, 46.4, 46.9))} b={b} x={x} t={t} />
      {[-6.2, 6.2].map((xx, i) => <group key={xx} position={[xx, 0, 0]}><Blok p={[0, 1.6, -3.3]} s={[5.4, 3.2, 6.4]} map={b.plester} rep={[3, 1.6]} c={WARNA[i + 1]} />
        {[-1, 1].map((s) => <mesh key={s} position={[s * 1.4, 3.95, -3.3]} rotation={[0, 0, -s * 0.5]} castShadow><boxGeometry args={[3.3, 0.08, 7.0]} /><meshStandardMaterial map={x.genteng} roughness={0.85} /></mesh>)}</group>)}
    </group>) : (<group>
      {ROW.map((rx, i) => <group key={rx} position={[rx, 0, 0]}><Rumah36 k={k} b={b} x={x} c={WARNA[i]} utama={rx === 0} /></group>)}
      <Blok p={[0, 0.9, ZBLK - 0.08]} s={[60, 1.8, 0.14]} map={b.plester} rep={[30, 1]} c="#d8cdb9" />
      <Struktur k={k} b={b} x={x} />
      <KolomBaru k={k} x={x} />
      <Perluasan D={k.ext} b={b} x={x} c={WARNA[2]} />
      {/* hantu: lantai 2 (oranye) dan perluasan belakang (biru) */}
      {k.hantuNaik > 0.01 && <Blok p={[0, TOP + 0.08 + H2 / 2 + 0.1, (ZF + ZB) / 2]} s={[6.1, H2, ZF - ZB + 0.1]} c="#ef6a4c" o={0.32 * Math.min(1, k.hantuNaik)} bayang={false} />}
      {k.hantuLebar > 0.01 && <Blok p={[0, Y0 + H / 2, (ZB + ZBLK) / 2 - 0.05]} s={[6.1, H, ZB - ZBLK - 0.1]} c="#3e9ad6" o={0.32 * Math.min(1, k.hantuLebar)} bayang={false} />}
      {/* beban lantai 2: panah merah ke bawah */}
      {k.beban > 0.01 && [-1.8, 0, 1.8].flatMap((ax) => [-2.4, -4.8].map((az) => { const y = TOP + NAIK + 1.6 - ((t * 1.6 + ax + az) % 1.2) * 0.6; return <group key={`${ax}${az}`} position={[ax, y, az]}>
        <mesh position={[0, 0.35, 0]}><boxGeometry args={[0.12, 0.7, 0.12]} /><meshBasicMaterial color="#e0442e" transparent opacity={k.beban} /></mesh>
        <mesh rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.28, 0.45, 12]} /><meshBasicMaterial color="#e0442e" transparent opacity={k.beban} /></mesh></group>; }))}
      {/* garis ukur */}
      <Garis a={[-3, 0.35, 0.35]} b={[3, 0.35, 0.35]} k={k.ukur} />
      <Garis a={[3.35, 0.35, 0]} b={[3.35, 0.35, -6]} k={k.ukur} />
      <Garis a={[-3.4, 0.12, ZPAGAR]} b={[-3.4, 0.12, ZBLK]} k={k.ukurTanah} c="#3e9ad6" />
      {k.ukurTanah > 0.01 && <Blok p={[0, 0.03, (ZPAGAR + ZBLK) / 2]} s={[6, 0.02, ZPAGAR - ZBLK]} c="#3e9ad6" o={0.25 * k.ukurTanah} bayang={false} />}
      {/* genangan: halaman cor & dak tidak menyerap air */}
      {k.genang > 0.01 && <>
        <Blok p={[0, 0.115, 1.5]} s={[5.6 * k.genang, 0.02, 2.6 * k.genang]} c="#5b9bc3" o={0.7} r={0.1} bayang={false} />
        <Blok p={[0, TOP + 0.175, ZB - 1.5]} s={[5.4 * k.genang, 0.02, 2.4 * k.genang]} c="#5b9bc3" o={0.7} r={0.1} bayang={false} />
      </>}
      <Hujan k={k.hujan} t={t} />
    </group>)}
  </group>);
};

// ---------- overlay 2D ----------
const LABELS: Lb[] = [
  {a: 6.5, b: 10.9, text: 'Bangunan 6 × 6 m', at: [3.35, 0.35, -3], side: 'R'},
  {a: 9.1, b: 10.9, text: 'Tanah 6 × 12 m', at: [-3.4, 0.12, -6], side: 'L'},
  {a: 12.5, b: 15.2, text: 'Halaman belakang ditutup', at: [0, 3.5, -7.5], side: 'R'},
  {a: 21.6, b: 22.9, text: 'Jendela belakang ketutup', at: [1.2, 1.7, -6.0], side: 'L', merah: true},
  {a: 23.1, b: 24.9, text: 'Air nggak meresap', at: [0, 0.12, 1.5], side: 'R', merah: true},
  {a: 27.8, b: 30.8, text: 'Dirancang 1 lantai', at: [3.0, 1.6, -1.2], side: 'R'},
  {a: 31.6, b: 35.3, text: 'Kolom kecil', at: [SX, 2.0, FZ], side: 'R'},
  {a: 32.1, b: 35.3, text: 'Pondasi', at: [-SX, -0.45, FZ], side: 'L', dy: 80},
  {a: 33.2, b: 35.3, text: 'Beban lantai 2', at: [0, TOP + NAIK + 0.8, -2.4], side: 'L', merah: true},
  {a: 37.4, b: 38.6, text: 'Rumah 3 lantai', at: [2.6, 6.5, -1], side: 'R'},
  {a: 43.9, b: 46.8, text: 'Lantai 1: tembok lama', at: [2.6, 1.5, 0], side: 'R', merah: true},
  {a: 45.7, b: 46.8, text: 'Yang atas aman', at: [-2.6, 6.0, 0], side: 'L', dy: -40},
  {a: 47.6, b: 52.3, text: 'Kolom baru', at: [2.55, 2.4, -1.65], side: 'R'},
  {a: 48.4, b: 52.3, text: 'Pondasi baru', at: [-2.55, -1.15, -1.65], side: 'L', dy: 60},
  {a: 58.3, b: 62.6, text: 'Melebar sedikit', at: [0, 3.4, -6.75], side: 'R'},
  {a: 60.3, b: 62.6, text: 'Pondasi siap 2 lantai', at: [2.55, -1.1, -5.55], side: 'L', dy: 60},
];
const Chip: React.FC<{t: number; a: number; b: number; text: string; x: number; y: number; c?: string; kecil?: string}> = ({t, a, b, text, x, y, c = '#ef6a4c', kecil}) => {
  const i = r(t, a, a + 0.4, back), o = 1 - r(t, b - 0.3, b); if (i * o <= 0.01) return null;
  return (<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * i})`, opacity: Math.min(1, i) * o, padding: '14px 30px 16px', borderRadius: 22, background: c, color: '#fff', fontFamily: 'Inter', fontWeight: 900, fontSize: 46, whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(30,30,30,0.25)', textAlign: 'center'}}>
    {text}{kecil && <div style={{fontWeight: 700, fontSize: 28, opacity: 0.92, marginTop: 2}}>{kecil}</div>}
  </div>);
};
const Persen: React.FC<{t: number}> = ({t}) => {
  const i = r(t, 15.5, 16.0, back), o = 1 - r(t, 20.6, 21.0); if (i * o <= 0.01) return null;
  const naik = r(t, 16.6, 17.8), v = 50 + 25 * naik, lewat = naik > 0.5;
  return (<div style={{position: 'absolute', left: 90, right: 90, top: 300, padding: '26px 34px 30px', borderRadius: 26, background: 'rgba(251,248,241,0.97)', boxShadow: '0 12px 34px rgba(30,30,30,0.22)', fontFamily: 'Inter', opacity: Math.min(1, i) * o, transform: `scale(${0.9 + 0.1 * Math.min(1, i)})`}}>
    <div style={{fontWeight: 800, fontSize: 40, color: '#2a2a2e'}}>Tanah tertutup bangunan</div>
    <div style={{position: 'relative', height: 44, borderRadius: 22, background: '#e8e2d4', marginTop: 18, overflow: 'hidden'}}>
      <div style={{width: `${v}%`, height: '100%', background: lewat ? '#e0442e' : '#3f8a5c'}} />
    </div>
    <div style={{position: 'relative', height: 0}}><div style={{position: 'absolute', left: '62%', top: -62, width: 6, height: 80, background: '#2a2a2e', borderRadius: 3}} /></div>
    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 16, fontWeight: 900, fontSize: 44}}>
      <span style={{color: lewat ? '#e0442e' : '#3f8a5c'}}>{Math.round(v)}%</span>
      <span style={{fontWeight: 700, fontSize: 30, color: '#5a5a5e', alignSelf: 'center'}}>│ batas aturan pemda (beda tiap daerah)</span>
    </div>
  </div>);
};
const Kartu: React.FC<{t: number}> = ({t}) => {
  const i = r(t, 53.0, 53.5, back), o = 1 - r(t, 56.0, 56.4); if (i * o <= 0.01) return null;
  const p2 = r(t, 55.3, 55.7, back);
  return (<div style={{position: 'absolute', left: 110, right: 110, top: 300, padding: '28px 36px', borderRadius: 26, background: 'rgba(251,248,241,0.97)', boxShadow: '0 12px 34px rgba(30,30,30,0.22)', fontFamily: 'Inter', opacity: Math.min(1, i) * o, textAlign: 'center'}}>
    <div style={{fontWeight: 700, fontSize: 36, color: '#5a5a5e'}}>Rumah subsidi</div>
    <div style={{fontWeight: 900, fontSize: 56, color: '#2a2a2e', letterSpacing: -1}}>Ada aturan 5 tahun</div>
    <div style={{fontWeight: 900, fontSize: 48, color: '#ef6a4c', marginTop: 8, opacity: Math.min(1, p2), transform: `translateY(${(1 - Math.min(1, p2)) * 20}px)`}}>Tanya bank dulu</div>
  </div>);
};
const Sumber: React.FC<{t: number}> = ({t}) => {
  const p = r(t, 36.0, 36.5) * (1 - r(t, 46.5, 46.9)); if (p <= 0.01) return null;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 248, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 28, color: '#3a3a3e', opacity: p, textShadow: '0 1px 0 rgba(255,255,255,0.8)'}}>Sumber: detikProperti, 7 Agustus 2024 (kesaksian penghuni)</div>;
};

export const Tipe06: React.FC<{nudge?: number}> = ({nudge = 0}) => {
  const f = useCurrentFrame(), t = f / FPS, ms = t * 1000, words = (wordsJson as {words: {word: string; start: number; end: number}[]}).words;
  const sh = shotAt(t);
  const cam: Kam = sh.tele ? tele(camAt(sh.keys, t)) : {...nudgeKey(camAt(sh.keys, t), nudge), fov: 34};
  const dip = Math.max(0, ...SHOTS.slice(1).map((s) => r(t, s.a - 0.3, s.a) * (1 - r(t, s.a, s.a + 0.3))));
  const hookCam = (tt: number) => tt < 6.15 || tt >= 62.8;
  const [nx, ny] = hookCam(t) ? proj2(cam, [0, TOP + 2.2, -3.6]) : [0, 0];
  const [lx, ly] = hookCam(t) ? proj2(cam, [0, 2.0, -7.5]) : [0, 0];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#bcd8ee 0%,#e6eef0 55%,#f3e9d6 100%)'}}>
      <Audio src={staticFile('e1-06/vo.wav')} />
      <Langit t={t} />
      <AbsoluteFill style={{filter: 'contrast(1.07) saturate(1.1)'}}>
        <ThreeCanvas width={1080} height={1920} camera={{position: cam.pos, fov: 34}} gl={{alpha: true, antialias: true}} shadows>
          <Env intensity={0.8} /><Rig2 k={cam} /><Cahaya /><Kabut tele={cam.fov < 10} /><Dunia t={t} bdg={!!sh.bdg} />
        </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,24,34,0.3) 100%)', pointerEvents: 'none'}} />
      {LABELS.map((l) => <Label2 key={l.text} l={l} t={t} cam={cam} />)}
      {hookCam(t) && <>
        <Chip t={t} a={2.6} b={5.9} text="TIM NAIK" x={Math.min(820, Math.max(260, nx + 150))} y={Math.max(470, ny - 40)} />
        <Chip t={t} a={3.9} b={5.9} text="TIM MELEBAR" x={Math.min(820, Math.max(260, lx - 150))} y={Math.max(470, ly - 150)} c="#3e9ad6" />
        <Chip t={t} a={62.9} b={68.9} text="TIM NAIK" x={Math.min(820, Math.max(260, nx + 150))} y={Math.max(470, ny - 40)} />
        <Chip t={t} a={63.6} b={68.9} text="TIM MELEBAR" x={Math.min(820, Math.max(260, lx - 150))} y={Math.max(470, ly - 150)} c="#3e9ad6" />
      </>}
      <Persen t={t} />
      <Chip t={t} a={40.2} b={42.3} text="Dirombak 3 tahun sebelumnya" x={540} y={520} c="#2a2a2e" />
      <Chip t={t} a={42.8} b={46.8} text="Sebelum ambruk" x={540} y={520} c="#2a2a2e" />
      <Chip t={t} a={50.0} b={52.6} text="Dihitung ahli struktur" x={540} y={470} />
      <Chip t={t} a={51.4} b={52.6} text="+ Izin PBG" x={540} y={600} c="#3f8a5c" />
      <Kartu t={t} />
      <Sumber t={t} />
      <Kicker t={t} a={0.3} b={6.0} text="Naik atau melebar?" />
      <Kicker t={t} a={6.3} b={10.9} text="Tipe 36/72" />
      <Kicker t={t} a={11.3} b={24.9} text="Tim melebar" />
      <Kicker t={t} a={25.1} b={35.3} text="Tim naik" />
      <Kicker t={t} a={35.7} b={46.8} text="Kab. Bandung, 2024" />
      <Kicker t={t} a={47.2} b={52.8} text="Kalau mau naik" />
      <Kicker t={t} a={56.7} b={62.6} text="Jalan tengah" />
      <Kicker t={t} a={64.0} b={66.3} text="Tim mana?" />
      <Kicker t={t} a={66.4} b={68.9} text="Fakta Rumah" />
      <AbsoluteFill style={{background: '#fbf8f1', opacity: dip, pointerEvents: 'none'}} />
      <Captions ms={ms} words={words} />
    </AbsoluteFill>
  );
};
