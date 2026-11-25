// E1 #04 "Kenapa Air Rob Bikin Motor Karatan?". Gaya E1-03 (style/gaya-e1-03.md). 100% kode: Remotion + three.js, tanpa API AI.
// Waktu = VO final public/e1-04 (61,4 dtk). Rencana adegan: e1/e04-karat-rob.md.
// Skill pustaka: short-form-video, shot-composition, beat-sync-editing (rencana), isometric-animation + threejs-animation (kamera tele, satu kanvas),
// particle-system (partikel = fungsi waktu + seed, bukan integrasi berstatus), diagram-animation (label bertahap, sorot yang aktif).
// Lokasi dunia: rumah/gang (x≈0), makro "baterai" (x=MK), breakdown cat (x=BC), rangka (x=RG). Skala makro = ilustrasi diperbesar.
import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import {AbsoluteFill, Audio, Easing, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/inter/600.css'; import '@fontsource/inter/700.css'; import '@fontsource/inter/900.css';
import * as THREE from 'three';
import {Env} from '../pengetahuan/Scene';
import {Captions} from '../kit/teks';
import {camAt, FPS, nudgeKey, r, type Key, type V3} from '../kit/waktu';
import {Kicker, tex, useTex} from './AnatomiRumah';
import {Blok, useBahan} from './look';
import {back, Cahaya, iso, Kabut, Label2, Langit, lerp, orb, Pagar, PAGAR_Z, Pipa, proj2, Rig2, Rumah03, tele, Tetangga, type Kam, type Lb} from './Tiang03';
import wordsJson from '../../public/e1-04/words.json';

export const R04_FRAMES = Math.round(61.8 * FPS);
const MK = 200, BC = 400, RG = 600; // lokasi adegan makro, breakdown cat, rangka
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const MOTOR: V3 = [-1.9, 0.14, 0.6]; // motor di carport, hidung ke +z (menghadap jalan)

// ---------- bahan bersama (modul, dibuat sekali) ----------
const G = {bola: new THREE.SphereGeometry(1, 10, 8), kubus: new THREE.BoxGeometry(1, 1, 1)};
const useKarat = () => useMemo(() => tex(256, 256, (g, rd) => {
  g.fillStyle = '#8a4a26'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 260; i++) { const v = rd(); g.fillStyle = `rgba(${150 + v * 80},${70 + v * 50},${30 + v * 20},${0.25 + rd() * 0.4})`; g.beginPath(); g.arc(rd() * 256, rd() * 256, 2 + rd() * 14, 0, 7); g.fill(); }
  for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(60,28,12,${0.2 + rd() * 0.4})`; g.fillRect(rd() * 256, rd() * 256, 2, 2); }
}, [1, 1], 41), []);

/** titik partikel (≤150 per adegan): posisi = fungsi murni t + indeks; s ≤ 0 = tidak tampil. Geometri & material dipakai bersama. */
const Titik: React.FC<{n: number; c: string; f: (i: number) => [number, number, number, number]; glow?: number; kubus?: boolean}> = ({n, c, f, glow = 0.3, kubus = false}) => {
  const m = useMemo(() => new THREE.MeshStandardMaterial({color: c, emissive: c, emissiveIntensity: glow, roughness: 0.4}), [c, glow]);
  return (<group>{Array.from({length: n}, (_, i) => { const [x, y, z, s] = f(i); return s > 0.001 ? <mesh key={i} geometry={kubus ? G.kubus : G.bola} material={m} rotation={kubus ? [i, i * 2, 0] : [0, 0, 0]} position={[x, y, z]} scale={s} /> : null; })}</group>);
};

// ---------- motor skuter matik generik (R3, referensi foto user 25 Nov; tanpa logo/merek) ----------
// Lokal: x = panjang (hidung +x), y = atas (lantai y=0, ban menyentuh tepat y=0), z = lebar (+z = sisi kanan pengendara).
// Panjang ±1,95 m, tinggi spion ±1,42 m, jarak sumbu roda 1,28 m, ban luar r 0,27.
const RB = 0.27, XD = 0.66, XB = -0.62; // jari-jari luar ban, sumbu roda depan, belakang
const ekstrusi = (s: THREE.Shape, d: number, bev: number) => { const e = new THREE.ExtrudeGeometry(s, {depth: d, bevelEnabled: true, bevelSize: bev, bevelThickness: bev, bevelSegments: 5, curveSegments: 24}); e.translate(0, 0, -d / 2); return e; };
/** pahat lebar setelah ekstrusi: lebar (sumbu z) dikali f(x, y), supaya buritan meruncing dan moncong menyempit (bukan balok) */
const pahat = (e: THREE.BufferGeometry, f: (x: number, y: number) => number) => { const p = e.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, p.getZ(i) * f(p.getX(i), p.getY(i))); p.needsUpdate = true; return e; };
const lebarBodi = (x: number, y: number) => { let k = 1; if (x < -0.35) k *= 1 - 0.5 * Math.min(1, (-0.35 - x) / 0.65); if (x > 0.6) k *= 1 - 0.32 * Math.min(1, (x - 0.6) / 0.28); if (y > 0.85 && x > 0.3) k *= 0.82; if (y < 0.4 && x < -0.2) k *= 0.85; return k; };
const GM = (() => {
  // bodi: buritan meruncing -> dek rata rendah -> tameng depan ±72° -> kepala depan, lengkung roda dipotong
  const b = new THREE.Shape(); b.moveTo(-0.12, 0.36); b.lineTo(0.36, 0.36);
  b.bezierCurveTo(0.42, 0.55, 0.47, 0.78, 0.52, 0.95); b.quadraticCurveTo(0.56, 1.02, 0.64, 1.0);
  b.bezierCurveTo(0.8, 0.95, 0.88, 0.8, 0.86, 0.66); b.quadraticCurveTo(0.84, 0.58, 0.78, 0.6);
  b.absarc(XD, RB, 0.36, 0.95, Math.PI - 0.2, false); b.lineTo(0.36, 0.25); b.lineTo(-0.12, 0.25);
  b.bezierCurveTo(-0.28, 0.27, -0.33, 0.33, -0.36, 0.44); b.absarc(XB, RB, 0.33, 0.55, Math.PI - 0.62, false);
  b.bezierCurveTo(-0.9, 0.55, -0.98, 0.7, -0.99, 0.8); b.quadraticCurveTo(-0.98, 0.86, -0.9, 0.84);
  b.bezierCurveTo(-0.6, 0.79, -0.3, 0.78, -0.18, 0.78); b.quadraticCurveTo(-0.13, 0.7, -0.14, 0.5); b.quadraticCurveTo(-0.15, 0.38, -0.12, 0.36);
  // jok bertingkat: pengendara lebih rendah dari pembonceng
  const j = new THREE.Shape(); j.moveTo(0.04, 0.79); j.quadraticCurveTo(0.06, 0.86, 0.0, 0.87); j.lineTo(-0.48, 0.87);
  j.quadraticCurveTo(-0.54, 0.87, -0.57, 0.92); j.lineTo(-0.88, 0.93); j.quadraticCurveTo(-0.97, 0.92, -0.95, 0.85); j.lineTo(-0.9, 0.8); j.closePath();
  // batok kepala: trapesium membulat
  const k = new THREE.Shape(); k.moveTo(0.5, 1.02); k.lineTo(0.78, 1.04); k.quadraticCurveTo(0.84, 1.1, 0.78, 1.17); k.lineTo(0.56, 1.2); k.quadraticCurveTo(0.46, 1.16, 0.5, 1.02);
  // box CVT (sisi kiri) dengan sudut membulat
  const c = new THREE.Shape(); c.moveTo(-0.08, 0.26); c.lineTo(-0.5, 0.2); c.quadraticCurveTo(-0.72, 0.2, -0.74, 0.32); c.quadraticCurveTo(-0.72, 0.46, -0.52, 0.46); c.lineTo(-0.1, 0.44); c.quadraticCurveTo(-0.04, 0.35, -0.08, 0.26);
  return {bodi: pahat(ekstrusi(b, 0.36, 0.075), lebarBodi), jok: pahat(ekstrusi(j, 0.3, 0.045), (x) => (x < -0.6 ? 1 - 0.35 * Math.min(1, (-0.6 - x) / 0.35) : 1)), batok: pahat(ekstrusi(k, 0.34, 0.045), (x) => (x > 0.68 ? 0.8 : 1)), cvt: ekstrusi(c, 0.08, 0.035),
    ban: new THREE.TorusGeometry(RB - 0.07, 0.07, 12, 32), velg: new THREE.CylinderGeometry(0.19, 0.19, 0.05, 28), cakram: new THREE.CylinderGeometry(0.11, 0.11, 0.008, 24),
    spakbor: new THREE.TorusGeometry(RB + 0.05, 0.06, 8, 24, Math.PI * 0.62),
    behel: new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[-0.6, 0.93, 0.19], [-0.92, 0.95, 0.18], [-1.0, 0.95, 0], [-0.92, 0.95, -0.18], [-0.6, 0.93, -0.19]].map((p) => new THREE.Vector3(...(p as V3)))), 24, 0.016, 6, false),
    spion: [-1, 1].map((s) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[0.58, 1.17, s * 0.22], [0.57, 1.28, s * 0.27], [0.62, 1.38, s * 0.31]].map((p) => new THREE.Vector3(...(p as V3)))), 12, 0.01, 6, false)),
    garpu: new THREE.CylinderGeometry(0.022, 0.022, 0.72, 10), knalpot: new THREE.CylinderGeometry(0.06, 0.055, 0.5, 18), tameng: new THREE.CylinderGeometry(0.075, 0.075, 0.36, 18, 1, true, 0, Math.PI),
    standar: new THREE.CylinderGeometry(0.014, 0.012, 0.36, 8)};
})();
const Roda: React.FC<{x: number; depan?: boolean; karat: number; kk: ReturnType<typeof useKarat>}> = ({x, depan, karat, kk}) => (
  <group position={[x, RB, 0]}>
    <mesh geometry={GM.ban} castShadow><meshStandardMaterial color="#1b1c1f" roughness={0.85} /></mesh>
    <mesh geometry={GM.velg} rotation={[Math.PI / 2, 0, 0]}><meshStandardMaterial color="#2a2c30" roughness={0.45} metalness={0.5} map={karat > 0.4 ? kk : undefined} /></mesh>
    {Array.from({length: 5}, (_, i) => <mesh key={i} rotation={[0, 0, i * Math.PI * 2 / 5]} position={[0, 0, 0]}><boxGeometry args={[0.36, 0.025, 0.055]} /><meshStandardMaterial color="#3a3d42" roughness={0.4} metalness={0.5} /></mesh>)}
    {depan && <mesh geometry={GM.cakram} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.07]}><meshStandardMaterial color="#b9bcc0" roughness={0.3} metalness={0.8} /></mesh>}
  </group>);
const Motor: React.FC<{basah: number; karat: number; kk: ReturnType<typeof useKarat>}> = ({basah, karat, kk}) => {
  const cat = new THREE.Color('#2f6fb3').multiplyScalar(1 - 0.22 * basah), kilap = 0.4 - 0.3 * basah;
  const doff = (c = '#1d1e21', ro = 0.8) => <meshStandardMaterial color={c} roughness={Math.max(0.15, ro - 0.5 * basah)} />;
  return (<group rotation={[0, -Math.PI / 2, 0]}>
    {/* miring natural ±5° ke kiri di atas standar samping; poros = garis kontak ban (y=0) */}
    <group rotation={[0.085, 0, 0]}>
      <mesh geometry={GM.bodi} castShadow receiveShadow><meshStandardMaterial color={cat} roughness={kilap} metalness={0.25} /></mesh>
      {/* dek pijakan & bagian bawah hitam (lebih lebar 0,02 dari bodi, tidak sebidang) */}
      <mesh position={[0.12, 0.31, 0]} castShadow>{<boxGeometry args={[0.5, 0.13, 0.52]} />}{doff('#232428', 0.75)}</mesh>
      <mesh geometry={GM.jok} castShadow>{doff('#1a1b1e', 0.8)}</mesh>
      <mesh geometry={GM.behel}><meshStandardMaterial color="#2b2d31" roughness={0.35} metalness={0.6} /></mesh>
      <mesh geometry={GM.batok} castShadow><meshStandardMaterial color={cat} roughness={kilap} metalness={0.25} /></mesh>
      <mesh position={[0.83, 1.1, 0]} rotation={[0, 0, -0.25]}><boxGeometry args={[0.03, 0.08, 0.3]} /><meshStandardMaterial color="#fff3dc" emissive="#ffd9a0" emissiveIntensity={0.7} roughness={0.1} /></mesh>
      {[-1, 1].map((s) => <mesh key={`l${s}`} position={[0.9, 0.8, s * 0.1]} rotation={[s * 0.45, -s * 0.35, -0.45]}><boxGeometry args={[0.03, 0.035, 0.17]} /><meshStandardMaterial color="#e9e4d6" emissive="#ffd9a0" emissiveIntensity={0.3} roughness={0.15} /></mesh>)}
      <mesh position={[0.885, 0.66, 0]}><boxGeometry args={[0.02, 0.05, 0.16]} /><meshStandardMaterial color="#1d1e21" roughness={0.6} /></mesh>
      {/* setang + grip, spion bertangkai lengkung */}
      <mesh position={[0.58, 1.14, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.016, 0.016, 0.74, 8]} /><meshStandardMaterial color="#2b2d31" metalness={0.5} roughness={0.4} /></mesh>
      {[-1, 1].map((s) => <group key={s}>
        <mesh position={[0.58, 1.14, s * 0.33]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.024, 0.024, 0.12, 10]} />{doff()}</mesh>
        <mesh geometry={GM.spion[(s + 1) / 2]}><meshStandardMaterial color="#1d1e21" roughness={0.5} /></mesh>
        <mesh position={[0.63, 1.41, s * 0.32]} rotation={[0, 0, Math.PI / 2 - 0.15]} scale={[1, 0.25, 0.7]}><cylinderGeometry args={[0.075, 0.075, 0.1, 18]} /><meshStandardMaterial color="#1d1e21" roughness={0.35} /></mesh>
      </group>)}
      {/* garpu teleskopik + spakbor depan (ikut garpu) */}
      {[-1, 1].map((s) => <mesh key={s} geometry={GM.garpu} position={[(0.6 + XD) / 2, 0.62, s * 0.075]} rotation={[0, 0, 0.09]}><meshStandardMaterial color="#c3c6ca" metalness={0.8} roughness={0.25} /></mesh>)}
      <mesh geometry={GM.spakbor} position={[XD, RB, 0]} rotation={[0, 0, 0.55]} scale={[1, 1, 1.6]}><meshStandardMaterial color={cat} roughness={kilap} metalness={0.25} /></mesh>
      {/* lampu rem, spakbor belakang menggantung, pelat nomor polos hitam */}
      <mesh position={[-0.985, 0.84, 0]}><boxGeometry args={[0.04, 0.07, 0.24]} /><meshStandardMaterial color="#c42a1e" emissive="#c42a1e" emissiveIntensity={0.35} roughness={0.2} /></mesh>
      <mesh position={[-0.99, 0.62, 0]} rotation={[0, 0, -0.35]}>{<boxGeometry args={[0.04, 0.32, 0.16]} />}{doff('#202124', 0.7)}</mesh>
      <mesh position={[-1.06, 0.5, 0]} rotation={[0, 0, -0.1]}>{<boxGeometry args={[0.02, 0.12, 0.25]} />}{doff('#111214', 0.6)}</mesh>
      {/* box CVT sisi kiri (-z), knalpot + pelindung panas sisi kanan (+z) */}
      <mesh geometry={GM.cvt} position={[0, 0, -0.2]} castShadow><meshStandardMaterial color="#3b3e43" roughness={0.5} metalness={0.3} map={karat > 0.2 ? kk : undefined} /></mesh>
      <mesh geometry={GM.knalpot} position={[-0.62, 0.36, 0.2]} rotation={[0, 0, Math.PI / 2 + 0.12]}><meshStandardMaterial color="#5d6066" metalness={0.7} roughness={0.35} map={karat > 0.1 ? kk : undefined} /></mesh>
      <mesh geometry={GM.tameng} position={[-0.62, 0.37, 0.215]} rotation={[0, Math.PI / 2, Math.PI / 2 + 0.12]}><meshStandardMaterial color="#1d1e21" roughness={0.8} side={THREE.DoubleSide} /></mesh>
      <Roda x={XD} depan karat={karat} kk={kk} /><Roda x={XB} karat={karat} kk={kk} />
      {/* bercak karat di kolong (bawah dek, CVT, dudukan knalpot) */}
      {Array.from({length: 28}, (_, i) => { const k = Math.min(1, Math.max(0, karat * 1.4 - rnd(i, 7) * 0.6)); return k > 0.02 ? <mesh key={i} geometry={G.bola} position={[-0.6 + rnd(i, 1) * 1.0, 0.24, (rnd(i, 3) - 0.5) * 0.5]} scale={[0.04 * k + 0.012, 0.008, 0.04 * k + 0.012]}><meshStandardMaterial color="#9a4f24" map={kk} roughness={0.95} /></mesh> : null; })}
    </group>
    {/* standar samping kiri menopang */}
    <mesh geometry={GM.standar} position={[-0.02, 0.15, -0.26]} rotation={[-0.55, 0, 0.25]}><meshStandardMaterial color="#2b2d31" metalness={0.5} roughness={0.4} /></mesh>
  </group>);
};

// ---------- dunia gang pesisir ----------
const KR = {atapNaik: 0, lantai2: 0, kanopi: 1, zona: 0, dijual: 0, pindah: 0, lt2: false};
const muka = (t: number) => lerp(0.36, -0.02, r(t, 0.0, 3.1)); // tinggi air rob
const Dunia: React.FC<{t: number}> = ({t}) => {
  const b = useBahan(), x = useTex(), kk = useKarat();
  const air = useMemo(() => { const m = b.lempung.clone(); m.wrapS = m.wrapT = THREE.RepeatWrapping; m.repeat.set(10, 4); m.needsUpdate = true; return m; }, [b]);
  air.offset.x = (t * 0.02) % 1;
  const h = muka(t), basah = 1 - r(t, 0.6, 3.0), karat = Math.max(r(t, 3.6, 5.6) * 0.5, r(t, 35.5, 40.0) * 0.9 + 0.5 * (t > 35 ? 1 : 0));
  const semprot = t > 46.4 && t < 53.6;
  const target: V3 = t < 50.4 ? [MOTOR[0], 0.38, MOTOR[2]] : t < 51.1 ? [MOTOR[0], 0.41, MOTOR[2] + 0.62] : [MOTOR[0], 0.4, MOTOR[2] - 0.3];
  const nozzle: V3 = [MOTOR[0] + 1.6, 0.9, MOTOR[2] + 0.9];
  return (<group>
    <Blok p={[0, -0.1, -2]} s={[40, 0.2, 14]} map={b.rumput} rep={[12, 4]} bump={0.6} />
    <Blok p={[0, -0.06, 6.0]} s={[40, 0.14, 5.4]} map={b.jalan} rep={[10, 1.5]} bump={0.4} c="#7f7c76" />
    <Blok p={[0, -0.12, 3.05]} s={[40, 0.1, 0.5]} c="#6e6a62" r={0.9} />
    <Rumah03 k={KR} b={b} x={x} />
    <Pagar b={b} dijual={0} />
    <Tetangga x0={-8.6} c="#d9e3dc" b={b} g={x.genteng} /><Tetangga x0={8.6} c="#e8dcc4" b={b} g={x.genteng} />
    {/* garis bekas rob di pagar dan tetangga (pita gelap tipis, di depan permukaan) */}
    {[[2.0, PAGAR_Z + 0.115, 3.2], [-8.6, 2.65, 6.2], [8.6, 2.65, 6.2]].map(([px, pz, w], i) => <Blok key={i} p={[px, 0.18, pz]} s={[w, 0.36, 0.01]} c="#6b5132" o={0.45} bayang={false} />)}
    {/* air rob surut */}
    {h > 0 && <mesh position={[0, h / 2 - 0.12, 2.5]}><boxGeometry args={[40, h + 0.12, 13]} /><meshStandardMaterial map={air} color="#8b6a44" transparent opacity={0.9} roughness={0.3} depthWrite={false} /></mesh>}
    <group position={MOTOR}><Motor basah={basah} karat={karat} kk={kk} /></group>
    {/* kerak garam di kolong + uap air tertarik (adegan 7-8) */}
    {t > 31 && t < 46.5 && <group position={MOTOR}>
      <Titik n={60} kubus c="#f4f1ea" glow={0.05} f={(i) => [ (rnd(i, 4) - 0.5) * 0.3, 0.215 + rnd(i, 5) * 0.02, -0.6 + rnd(i, 6) * 1.3, 0.02 * r(t, 31.4 + rnd(i, 8) * 0.8, 32.4 + rnd(i, 8) * 0.8)]} />
      <Titik n={70} c="#7fc3ff" glow={0.5} f={(i) => { const u = ((t - 31.6) * 0.35 + rnd(i, 9)) % 1, a0 = rnd(i, 10) * 6.28, R0 = 0.9 + rnd(i, 11) * 0.6, k = Easing.in(Easing.quad)(u);
        const tx = (rnd(i, 4) - 0.5) * 0.3, tz = -0.6 + rnd(i, 6) * 1.3; return [lerp(Math.cos(a0) * R0, tx, k), lerp(0.4 + rnd(i, 12) * 0.9, 0.24, k), lerp(tz + Math.sin(a0) * R0, tz, k), t < 31.6 ? 0 : 0.011 * Math.min(1, u * 8, (1 - u) * 8)]; }} />
    </group>}
    {/* selang + semprotan air tawar (adegan 10) */}
    {t > 46.0 && t < 56.6 && <Pipa pts={[[nozzle[0] + 2.5, 0.05, nozzle[2] + 1.5], [nozzle[0] + 1.0, 0.1, nozzle[2] + 0.6], nozzle]} rad={0.025} c="#2e8b57" />}
    {semprot && <Titik n={90} c="#bfe6ff" glow={0.35} f={(i) => { const u = ((t - 46.4) * 1.6 + rnd(i, 13)) % 1, j = (rnd(i, 14) - 0.5) * 0.25;
      return [lerp(nozzle[0], target[0], u) + j * u, lerp(nozzle[1], target[1], u) + 0.25 * Math.sin(u * Math.PI), lerp(nozzle[2], target[2], u) + j * u, 0.025]; }} />}
  </group>);
};

// ---------- makro "baterai kecil" (adegan 3-5) ----------
const Tetes: React.FC<{x: number; t: number; laut: boolean; mulai: number; kk: ReturnType<typeof useKarat>}> = ({x, t, laut, mulai, kk}) => {
  const tampil = r(t, mulai, mulai + 0.5, back), cepat = laut ? 3.2 : 0.8, kikis = Math.min(1, Math.max(0, (t - mulai) * (laut ? 0.18 : 0.05)));
  if (tampil <= 0.01) return null;
  return (<group position={[x, 0, 0]}>
    <mesh position={[0, 0.0, 0]} scale={[1.05 * tampil, 0.55 * tampil, 1.05 * tampil]}><sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={laut ? '#8fc6e8' : '#b9def5'} transparent opacity={0.45} roughness={0.05} depthWrite={false} /></mesh>
    {/* lekuk + karat di bawah tetes (menancap 0,02 ke pelat, tidak sebidang) */}
    <mesh position={[0, -0.02 - 0.06 * kikis, 0]}><cylinderGeometry args={[0.25 + 0.35 * kikis, 0.2 + 0.25 * kikis, 0.06 + 0.12 * kikis, 28]} /><meshStandardMaterial color="#8a4a26" map={kk} roughness={0.95} /></mesh>
    {/* elektron (kuning): tengah tetes -> tepi lewat besi */}
    <Titik n={laut ? 40 : 10} c="#ffd23f" glow={0.6} f={(i) => { const u = ((t - mulai) * cepat * 0.35 + rnd(i, 1)) % 1, a = rnd(i, 2) * 6.28, R = 0.15 + 0.9 * u; return [Math.cos(a) * R, -0.05, Math.sin(a) * R, t < mulai + 0.3 ? 0 : 0.045]; }} />
    {/* oksigen (biru) masuk di tepi tetes */}
    <Titik n={laut ? 16 : 6} c="#3d7dd8" glow={0.4} f={(i) => { const u = ((t - mulai) * cepat * 0.25 + rnd(i, 3)) % 1, a = rnd(i, 4) * 6.28; return [Math.cos(a) * 0.95, lerp(1.2, 0.12, u), Math.sin(a) * 0.95, t < mulai + 0.3 ? 0 : 0.05]; }} />
    {/* ion garam (hanya air laut): putih & hijau bergetar di dalam tetes */}
    {laut && <Titik n={60} c={'#e9f7ee'} glow={0.2} f={(i) => { const a = rnd(i, 5) * 6.28, R = rnd(i, 6) * 0.8, y = 0.08 + rnd(i, 7) * 0.35 * (1 - R / 1.1); return [Math.cos(a) * R + Math.sin(t * 7 + i) * 0.02, y, Math.sin(a) * R + Math.cos(t * 6 + i) * 0.02, 0.03 * tampil]; }} />}
  </group>);
};
const Makro: React.FC<{t: number}> = ({t}) => {
  const b = useBahan(), kk = useKarat();
  const satu = t < 14.9;
  return (<group position={[MK, 0, 0]}>
    <Blok p={[0, -0.32, 0]} s={[6.4, 0.6, 3.2]} c="#8d9298" map={b.batuan} rep={[3, 1.5]} bump={0.4} r={0.55} />
    {satu ? <Tetes x={0} t={t} laut={false} mulai={6.7} kk={kk} />
      : <><Tetes x={-1.6} t={t} laut={false} mulai={15.1} kk={kk} /><Tetes x={1.6} t={t} laut mulai={17.9} kk={kk} /></>}
  </group>);
};

// ---------- breakdown penampang cat + besi (adegan 6) ----------
const NS = 48, LBR = 5.2;
const Penampang: React.FC<{t: number}> = ({t}) => {
  const b = useBahan(), kk = useKarat();
  const gx = -1.6, lebar = 0.18; // goresan
  const rambat = r(t, 26.0, 29.4, Easing.inOut(Easing.quad)) * 2.6, gelembung = r(t, 29.0, 30.4, back);
  const tinggiKarat = (xx: number) => { const d = Math.abs(xx - gx); return d < lebar / 2 ? 0.02 : d < rambat ? 0.06 * (1 - d / (rambat + 0.01)) + 0.02 : 0; };
  const bulge = (xx: number) => { const c = gx + 1.0, d = Math.abs(xx - c); return gelembung * Math.max(0, 0.32 * (1 - (d / 0.9) ** 2)); };
  return (<group position={[BC, 0, 0]}>
    <Blok p={[0, -0.4, 0]} s={[LBR, 0.8, 2.0]} c="#8d9298" map={b.batuan} rep={[3, 1]} bump={0.4} r={0.55} />
    {Array.from({length: NS}, (_, i) => { const x0 = -LBR / 2 + (i + 0.5) * (LBR / NS); if (Math.abs(x0 - gx) < lebar / 2) return null; const hk = tinggiKarat(x0), y = hk + bulge(x0);
      return (<group key={i}>
        {hk > 0.001 && <mesh position={[x0, hk / 2 - 0.02, 0]}><boxGeometry args={[LBR / NS + 0.002, hk + 0.02, 1.98]} /><meshStandardMaterial color="#9a4f24" map={kk} roughness={0.95} /></mesh>}
        <mesh position={[x0, y + 0.05, 0]} castShadow><boxGeometry args={[LBR / NS + 0.004, 0.1, 2.02]} /><meshStandardMaterial color="#2f6fb3" roughness={0.35} metalness={0.15} /></mesh>
      </group>); })}
    {/* ion klorida (hijau) masuk lewat goresan lalu merambat di bawah cat */}
    <Titik n={50} c="#39c46a" glow={0.5} f={(i) => { const u = ((t - 23.7) * 0.45 + rnd(i, 1)) % 1, side = rnd(i, 2) < 0.5 ? -1 : 1, z = (rnd(i, 3) - 0.5) * 1.6;
      if (t < 23.7) return [0, 0, 0, 0]; if (u < 0.45) return [gx + (rnd(i, 4) - 0.5) * 0.1, lerp(0.9, 0.05, u / 0.45), z, 0.04];
      return [gx + side * Math.min(rambat + 0.2, (u - 0.45) * 4), 0.04, z, t > 26 ? 0.035 : 0.04]; }} />
  </group>);
};

// ---------- rangka berlubang (adegan 9) ----------
const Rangka: React.FC<{t: number}> = ({t}) => {
  const kk = useKarat(), lubang = r(t, 41.0, 44.8), patah = r(t, 45.0, 45.5, back);
  return (<group position={[RG, 0.8, 0]}>
    {[-1, 1].map((s) => <group key={s} position={[s * 0.02 * patah * 8, -0.25 * patah * (s > 0 ? 1 : 0.3), 0]} rotation={[0, 0, s * 0.18 * patah]}>
      <mesh position={[s * 1.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.32, 0.32, 2.2, 32, 1, true]} /><meshStandardMaterial color="#6d5a4d" map={kk} roughness={0.9} side={THREE.DoubleSide} /></mesh>
      {Array.from({length: 9}, (_, i) => { const k = Math.min(1, Math.max(0, lubang * 1.6 - rnd(i + s * 20, 1) * 0.6)); const a = rnd(i + s * 20, 2) * 3 - 1.5;
        return k > 0.02 ? <mesh key={i} position={[s * (0.2 + rnd(i + s * 20, 3) * 1.8), Math.sin(a) * 0.325, Math.cos(a) * 0.325]} rotation={[a, 0, 0]} scale={[0.09 * k, 0.005, 0.07 * k]} geometry={G.bola}><meshBasicMaterial color="#1a1310" /></mesh> : null; })}
    </group>)}
  </group>);
};

// ---------- kamera ----------
const KP: Key[] = [orb(0, 24, 14, 7.6, [-1.6, 0.7, 1.0]), orb(3.2, 20, 14, 5.8, [-1.8, 0.6, 0.8]), orb(3.5, 30, 12, 4.0, MOTOR.map((v, i) => v + [0, 0.35, 0][i]) as V3), orb(6.2, 22, 6, 2.6, MOTOR.map((v, i) => v + [0, 0.3, 0][i]) as V3),
  orb(31.0, 86, -3, 2.4, MOTOR.map((v, i) => v + [0, 0.24, 0][i]) as V3), orb(34.8, 78, 4, 3.4, MOTOR.map((v, i) => v + [0, 0.4, 0][i]) as V3), orb(40.4, -10, 10, 6.5, MOTOR.map((v, i) => v + [0, 0.6, 0][i]) as V3),
  orb(46.3, 40, 10, 6.2, MOTOR.map((v, i) => v + [0, 0.5, 0][i]) as V3), orb(56.3, 18, 12, 6.0, MOTOR.map((v, i) => v + [0, 0.5, 0][i]) as V3), orb(61.8, 24, 14, 7.6, [-1.6, 0.7, 1.0])];
const KM: Key[] = [iso(6.2, [MK, 0.2, 0], 300, 30, 32), iso(14.6, [MK, 0.2, 0], 320, 20, 30), iso(15.0, [MK - 0.2, 0.2, 0], 175, 0, 30), iso(19.0, [MK + 0.2, 0.2, 0], 180, -4, 30), iso(23.3, [MK + 0.4, 0.2, 0], 188, -8, 31)];
const KB: Key[] = [iso(23.3, [BC - 0.6, 0.3, 0], 230, 28, 26), iso(30.4, [BC - 0.4, 0.2, 0], 250, 20, 20)];
const KG: Key[] = [iso(40.4, [RG, 0.8, 0], 260, 25, 20), iso(46.3, [RG, 0.8, 0], 275, 18, 18)];
type Mode = 'dunia' | 'makro' | 'cat' | 'rangka';
const mode = (t: number): Mode => (t >= 6.2 && t < 23.3 ? 'makro' : t >= 23.3 && t < 30.9 ? 'cat' : t >= 40.4 && t < 46.3 ? 'rangka' : 'dunia');

// ---------- overlay ----------
const LABELS: Lb[] = [
  {a: 0.4, b: 3.2, text: 'Bekas air rob', at: [2.6, 0.32, PAGAR_Z + 0.1], side: 'R', dy: 80},
  {a: 9.2, b: 14.6, text: 'Besi', at: [MK - 2.2, -0.05, 0.8], side: 'L', dy: 120},
  {a: 9.6, b: 14.6, text: 'Air', at: [MK + 0.4, 0.4, 0.4], side: 'R', dy: -60},
  {a: 10.4, b: 14.6, text: 'Oksigen', at: [MK + 0.95, 1.0, 0.0], side: 'R', dy: -180},
  {a: 11.2, b: 14.6, text: 'Listrik (elektron)', at: [MK - 0.55, -0.04, 0.3], side: 'L', dy: -40},
  {a: 15.2, b: 23.1, text: 'Air hujan', at: [MK - 1.6, 0.6, 0], side: 'L', dy: -120},
  {a: 17.9, b: 23.1, text: 'Air laut (bergaram)', at: [MK + 1.6, 0.6, 0], side: 'R', dy: -120, merah: true},
  {a: 23.9, b: 30.6, text: 'Goresan cat', at: [BC - 1.6, 0.12, 1.0], side: 'L', dy: -160},
  {a: 24.6, b: 30.6, text: 'Cat', at: [BC + 1.8, 0.1, 1.0], side: 'R', dy: -140},
  {a: 26.4, b: 30.6, text: 'Karat di bawah cat', at: [BC - 0.6, 0.03, 1.0], side: 'L', dy: 160, merah: true},
  {a: 35.2, b: 40.2, text: 'Kelihatan kering', at: [MOTOR[0], 1.0, MOTOR[2]], side: 'R', dy: -100},
  {a: 36.4, b: 40.2, text: 'Kolong tetap lembap', at: [MOTOR[0], 0.38, MOTOR[2]], side: 'L', dy: 120, merah: true},
  {a: 50.5, b: 53.4, text: 'Kolong', at: [MOTOR[0], 0.38, MOTOR[2]], side: 'L', dy: 60},
  {a: 51.2, b: 53.4, text: 'Pelek', at: [MOTOR[0] + 0.4, 0.41, MOTOR[2] + 0.62], side: 'R', dy: 40},
  {a: 51.9, b: 53.4, text: 'Bagian bawah', at: [MOTOR[0], 0.4, MOTOR[2] - 0.3], side: 'L', dy: 190},
];
const TagIlustrasi: React.FC<{t: number}> = ({t}) => { const p = r(t, 6.5, 7.0) * (1 - r(t, 30.4, 30.9)); return p > 0.01 ? <div style={{position: 'absolute', right: 40, top: 270, padding: '6px 16px', borderRadius: 12, background: 'rgba(42,42,46,0.72)', color: '#fff', fontFamily: 'Inter', fontWeight: 600, fontSize: 26, opacity: p}}>ilustrasi, diperbesar</div> : null; };
const KartuKasus: React.FC<{t: number}> = ({t}) => {
  const i = r(t, 40.8, 41.3, Easing.out(Easing.cubic)), o = 1 - r(t, 45.8, 46.3); if (i * o <= 0.01) return null;
  return (<div style={{position: 'absolute', left: 70, right: 70, top: 290, padding: '26px 34px', borderRadius: 26, background: '#fbf8f1', boxShadow: '0 12px 34px rgba(30,30,30,0.2)', fontFamily: 'Inter', opacity: i * o, transform: `translateY(${(1 - i) * 30}px)`}}>
    <div style={{fontWeight: 900, fontSize: 56, color: '#2a2a2e', letterSpacing: -1.2}}>Pesisir Semarang</div>
    <div style={{fontWeight: 700, fontSize: 38, color: '#e0442e', marginTop: 6}}>langganan rob · rangka keropos</div>
    <div style={{fontWeight: 600, fontSize: 24, color: '#6a6a6e', marginTop: 10}}>Sumber: GridOto, detikJateng</div>
  </div>);
};
const Larangan: React.FC<{t: number; a: number; b: number; teks: string}> = ({t, a, b, teks}) => {
  const i = r(t, a, a + 0.5, back), o = 1 - r(t, b - 0.4, b); if (i * o <= 0.01) return null;
  return (<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', opacity: i * o}}>
    <svg width={240} height={240} style={{transform: `scale(${i})`}}><circle cx={120} cy={120} r={100} fill="rgba(255,255,255,0.9)" stroke="#e0442e" strokeWidth={20} />
      <circle cx={95} cy={120} r={30} fill="none" stroke="#2a2a2e" strokeWidth={14} /><rect x={120} y={112} width={60} height={16} fill="#2a2a2e" /><rect x={158} y={112} width={12} height={34} fill="#2a2a2e" />
      <line x1={48} y1={48} x2={192} y2={192} stroke="#e0442e" strokeWidth={20} /></svg>
    <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 46, color: '#2a2a2e', marginTop: 10}}>{teks}</div>
  </div>);
};

export const Karat04: React.FC<{nudge?: number}> = ({nudge = 0}) => {
  const f = useCurrentFrame(), t = f / FPS, ms = t * 1000, words = (wordsJson as {words: {word: string; start: number; end: number}[]}).words;
  const m = mode(t);
  const cam: Kam = m === 'makro' ? tele(camAt(KM, t)) : m === 'cat' ? tele(camAt(KB, t)) : m === 'rangka' ? tele(camAt(KG, t)) : {...nudgeKey(camAt(KP, t), nudge), fov: 34};
  const dip = Math.max(0, ...[6.2, 23.3, 30.9, 40.4, 46.3].map((c) => r(t, c - 0.3, c) * (1 - r(t, c, c + 0.3))));
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#bcd8ee 0%,#e6eef0 55%,#f3e9d6 100%)'}}>
      <Audio src={staticFile('e1-04/vo.wav')} />
      <Langit t={t} />
      <AbsoluteFill style={{filter: 'contrast(1.07) saturate(1.1)'}}>
        <ThreeCanvas width={1080} height={1920} camera={{position: cam.pos, fov: 34}} gl={{alpha: true, antialias: true}} shadows>
          <Env intensity={0.8} /><Rig2 k={cam} /><Cahaya /><Kabut tele={cam.fov < 10} />
          {m === 'dunia' && <Dunia t={t} />}
          {m === 'makro' && <Makro t={t} />}
          {m === 'cat' && <Penampang t={t} />}
          {m === 'rangka' && <Rangka t={t} />}
        </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,24,34,0.3) 100%)', pointerEvents: 'none'}} />
      {LABELS.map((l) => <Label2 key={l.text} l={l} t={t} cam={cam} />)}
      <TagIlustrasi t={t} />
      <KartuKasus t={t} />
      <Larangan t={t} a={53.9} b={56.5} teks="Terendam? Jangan langsung dinyalakan" />
      <Kicker t={t} a={-1} b={3.2} text="Udah kering, aman?" />
      <Kicker t={t} a={3.4} b={6.0} text="Karatnya mulai kerja" />
      <Kicker t={t} a={6.6} b={14.6} text="Karat = baterai kecil" />
      <Kicker t={t} a={15.1} b={23.1} text="Air hujan vs air laut" />
      <Kicker t={t} a={23.7} b={30.5} text="Tumbuh di bawah cat" />
      <Kicker t={t} a={31.4} b={40.2} text="Kering, tapi lembap" />
      <Kicker t={t} a={46.6} b={53.6} text="Siram hari itu juga" />
      <Kicker t={t} a={56.9} b={59.0} text="Motormu juga?" />
      <Kicker t={t} a={59.0} b={61.8} text="Fakta Rumah" />
      <AbsoluteFill style={{background: '#fbf8f1', opacity: dip, pointerEvents: 'none'}} />
      <Captions ms={ms} words={words} />
    </AbsoluteFill>
  );
};
void proj2;
