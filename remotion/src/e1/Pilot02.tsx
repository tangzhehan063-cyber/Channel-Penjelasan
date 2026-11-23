// PILOT workflow v3 untuk E1 #02: sequence "Di bawah rumah" (20,4-31,0 dtk dari video penuh). 100% kode: Remotion + three.js, tanpa API AI.
// Kamera dan pembagian shot dibaca dari e1/02/shots.json (kamera = data). 1 satuan = 1 m.
// Dunia: muka penampang tanah di z=1,5 (tiap lapisan bergeser 2 mm agar tak sebidang); foto nyata sebagai bidang di z=1,55 dengan garis tanah di y=0.
// Pemampatan 0,57 m = ILUSTRASI (sama dengan versi lama Tanah02), bukan hasil ukur.
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Audio, Easing, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/inter/600.css'; import '@fontsource/inter/700.css';
import {Env} from '../pengetahuan/Scene';
import {Rig} from '../kit/stage';
import {FPS, nudgeKey, r} from '../kit/waktu';
import {rng, tex, useTex} from './AnatomiRumah';
import {useMemo} from 'react';
import {Blok, useBahan} from './look';
import {FotoBidang, useFoto} from './lib/footage';
import {kameraShots, type ShotKamera} from './lib/kamera';
import {GroundSlice} from './lib/transisi';
import {Anot, type Anotasi} from './lib/anot';
import shotsJson from '../../../e1/02/shots.json';

export const T0 = 20.4;
export const PILOT02_FRAMES = Math.round(10.6 * FPS);
const SHOTS = (shotsJson as unknown as {shots: ShotKamera[]}).shots;

const FW = 9, FH = (FW * 576) / 1024, XP = 1.2, ZB = 1.55, ZF = 1.5;
const HU = FH * (455 / 576), HL = FH * (121 / 576); // bagian foto di atas / di bawah garis tanah (455 px dari atas)
const ACUAN = '#ef6a4c';
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// pemampatan lempung (ilustrasi): bertahan, menekan, melambat; beban memperparah di akhir
export const kompres = (t: number) => { const c0 = r(t, 26.2, 28.1), beban = r(t, 28.7, 29.7); return Math.min(1, c0 * 0.76 + beban * 0.24); };
export const SINK = 0.57;


// Tekstur penampang khusus pilot: lebih gelap, basah, berlapis (prosedural, ber-seed). Menggantikan tampilan "kertas krem" putaran pertama.
const R_ = (rd: () => number, a: number, b: number) => a + (b - a) * rd();
export const usePenampang = () => useMemo(() => ({
  urugan: tex(256, 256, (g, rd) => {
    g.fillStyle = '#5d4a37'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i++) { const v = R_(rd, 60, 120); g.fillStyle = `rgba(${v + 30},${v + 14},${v - 4},${R_(rd, 0.25, 0.55)})`; g.fillRect(rd() * 256, rd() * 256, R_(rd, 2, 5), R_(rd, 2, 4)); }
    for (let i = 0; i < 70; i++) { const v = R_(rd, 120, 190); g.fillStyle = `rgba(${v},${v - 6},${v - 18},0.85)`; g.beginPath(); g.ellipse(rd() * 256, rd() * 256, R_(rd, 3, 9), R_(rd, 2, 6), rd() * 3, 0, 7); g.fill(); }
  }, [1, 1], 41),
  lempung: tex(256, 256, (g, rd) => {
    g.fillStyle = '#4f5a60'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 22; i++) { const y = i * 12 + rd() * 6; g.fillStyle = i % 2 ? 'rgba(25,32,38,0.30)' : 'rgba(120,138,148,0.16)'; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= 256; x += 16) g.lineTo(x, y + Math.sin(x * 0.04 + i * 1.7) * 3 + R_(rd, -1.5, 1.5)); g.lineTo(256, y + 7); g.lineTo(0, y + 7); g.fill(); }
    for (let i = 0; i < 600; i++) { g.fillStyle = `rgba(${R_(rd, 20, 50)},${R_(rd, 28, 56)},${R_(rd, 34, 62)},${R_(rd, 0.2, 0.5)})`; g.beginPath(); g.arc(rd() * 256, rd() * 256, R_(rd, 0.8, 2.6), 0, 7); g.fill(); }
    for (let i = 0; i < 120; i++) { g.fillStyle = 'rgba(170,190,200,0.35)'; g.beginPath(); g.arc(rd() * 256, rd() * 256, R_(rd, 0.7, 1.6), 0, 7); g.fill(); }
  }, [1, 1], 42),
  pasir: tex(256, 256, (g, rd) => {
    g.fillStyle = '#a98d58'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2200; i++) { const v = R_(rd, -34, 34); g.fillStyle = `rgba(${176 + v},${148 + v},${96 + v},0.75)`; g.fillRect(rd() * 256, rd() * 256, R_(rd, 1, 2.8), R_(rd, 1, 2.8)); }
    for (let i = 0; i < 12; i++) { g.fillStyle = 'rgba(60,90,120,0.10)'; g.fillRect(0, rd() * 256, 256, R_(rd, 4, 14)); }
    for (let i = 0; i < 220; i++) { g.fillStyle = 'rgba(70,130,190,0.5)'; g.beginPath(); g.arc(rd() * 256, rd() * 256, R_(rd, 0.8, 1.8), 0, 7); g.fill(); }
  }, [1, 1], 43),
  batuan: tex(256, 256, (g, rd) => {
    g.fillStyle = '#3d4249'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 160; i++) { const v = R_(rd, 50, 110); g.fillStyle = `rgba(${v},${v + 2},${v + 8},${R_(rd, 0.12, 0.3)})`; g.beginPath(); g.ellipse(rd() * 256, rd() * 256, R_(rd, 8, 34), R_(rd, 5, 22), rd() * 3, 0, 7); g.fill(); }
    for (let i = 0; i < 1800; i++) { const v = R_(rd, 30, 120); g.fillStyle = `rgba(${v},${v},${v + 4},0.5)`; g.fillRect(rd() * 256, rd() * 256, R_(rd, 1, 2.4), R_(rd, 1, 2.4)); }
  }, [1, 1], 44),
  pondasi: tex(256, 256, (g, rd) => {
    g.fillStyle = '#7f7e78'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i++) { const v = R_(rd, 90, 160); g.fillStyle = `rgba(${v},${v},${v - 6},0.5)`; g.fillRect(rd() * 256, rd() * 256, R_(rd, 1, 3), R_(rd, 1, 3)); }
    g.strokeStyle = 'rgba(40,40,38,0.55)'; g.lineWidth = 3; for (let y = 0; y <= 256; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); for (let x = (y / 64) % 2 ? 0 : 64; x <= 256; x += 128) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 64); g.stroke(); } }
  }, [1, 1], 45),
}), []);

const Penampang: React.FC<{t: number}> = ({t}) => {
  const x = usePenampang();
  const c = kompres(t), d = SINK * c; // d = turunnya permukaan (m)
  const hClay = 1.5 - d; // 1,5 m -> 0,93 m
  const act = r(t, 24.0, 24.8) * (1 - r(t, 28.6, 29.3));
  const PX = 1.15, YP = -2.45;
  return (<group>
    {/* lapisan, depan masing-masing bergeser 2 mm: tak ada permukaan sebidang */}
    <Blok p={[0, -2.85 - 4.15 / 2, 0]} s={[9, 4.15, 3.0]} map={x.batuan} rep={[5, 2.5]} bump={1.0} bayang={false} />
    <Blok p={[0, -2.05 - 0.4, 0.002]} s={[9, 0.8, 3.0]} map={x.pasir} rep={[5, 0.6]} bump={0.7} bayang={false} />
    <Blok p={[0, -2.05 + hClay / 2, 0.004]} s={[9, hClay, 3.0]} map={x.lempung} rep={[5, 1]} bump={0.6} r={0.38} bayang={false} />
    <group position={[0, -d, 0]}>
      <Blok p={[0, -0.55 / 2, 0.006]} s={[9, 0.55, 3.0]} map={x.urugan} rep={[5, 0.45]} bump={0.9} bayang={false} />
      {/* pondasi beton persis di bawah dinding dasar pada foto: menonjol 2 cm dari muka potongan */}
      <Blok p={[-0.85, -0.27, 0.36]} s={[2.5, 0.46, 2.32]} map={x.pondasi} rep={[2.2, 0.45]} bump={0.8} bayang={false} />
      <FotoBidang tx={useFotoCtx()} crop={[0, 121 / 576 - 0.03 / FH, 1, 1]} lebar={FW} tinggi={HU + 0.03} p={[XP, HU / 2 - 0.015, ZB]} buluAtas={0.14} />
      {/* panah beban: menekan pondasi */}
      {r(t, 28.7, 29.6) > 0.02 && <group position={[-0.85, 1.05 - 0.3 * r(t, 28.8, 29.8, Easing.out(Easing.cubic)), 1.62]}>
        <mesh position={[0, 0.55, 0]} renderOrder={7}><boxGeometry args={[0.16, 1.1, 0.04]} /><meshBasicMaterial color={ACUAN} transparent opacity={r(t, 28.7, 29.2) * (1 - r(t, 30.3, 30.8))} depthTest={false} toneMapped={false} /></mesh>
        <mesh position={[0, -0.12, 0]} rotation={[0, 0, Math.PI]} renderOrder={7}><coneGeometry args={[0.28, 0.4, 3]} /><meshBasicMaterial color={ACUAN} transparent opacity={r(t, 28.7, 29.2) * (1 - r(t, 30.3, 30.8))} depthTest={false} toneMapped={false} /></mesh>
      </group>}
    </group>
    {/* sumur bor: pipa di muka potongan dari pasir sampai permukaan */}
    <mesh position={[PX, (YP - d) / 2 - 0.05, 1.56]} renderOrder={4}><cylinderGeometry args={[0.07, 0.07, -YP - d - 0.1 + 0.0, 12]} /><meshStandardMaterial color="#6a7078" metalness={0.6} roughness={0.45} /></mesh>
    <mesh position={[PX - 0.3, YP, 1.56]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.07, 0.07, 0.6, 12]} /><meshStandardMaterial color="#6a7078" metalness={0.6} roughness={0.45} /></mesh>
    {/* titik air: lempung -> pasir -> pipa -> permukaan */}
    {act > 0.02 && Array.from({length: 72}, (_, i) => {
      const u = (t * 0.2 + rnd(i, 3)) % 1, sx = -1.2 + rnd(i, 1) * 1.9, sy = -2.05 + 0.2 + rnd(i, 2) * Math.max(0.3, hClay - 0.4); let px: number, py: number;
      if (u < 0.4) { const k = u / 0.4; px = lerp(sx, 0.7, k); py = lerp(sy, YP, k); }
      else if (u < 0.55) { const k = (u - 0.4) / 0.15; px = lerp(0.7, PX, k); py = YP; }
      else { const k = (u - 0.55) / 0.45; px = PX; py = lerp(YP, -d - 0.12, k); }
      const o = Math.min(1, u / 0.06, (1 - u) / 0.1) * act;
      return <mesh key={i} position={[px, py, 1.6 + rnd(i, 4) * 0.05]} renderOrder={4}><sphereGeometry args={[0.04, 10, 8]} /><meshBasicMaterial color="#5fb0ff" transparent opacity={o * 0.95} toneMapped={false} /></mesh>;
    })}
  </group>);
};

// konteks tekstur foto (satu pemuatan untuk seluruh adegan)
import {createContext, useContext} from 'react';
import type * as THREE from 'three';
const FotoCtx = createContext<THREE.Texture | null>(null);
const useFotoCtx = () => useContext(FotoCtx);

export const Grain: React.FC<{f: number}> = ({f}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'overlay', opacity: 0.16, pointerEvents: 'none'}}>
    <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 6} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width={1080} height={1920} filter="url(#g)" />
  </svg>
);

export const Pilot02: React.FC<{nudge?: number}> = ({nudge = 0}) => {
  const f = useCurrentFrame(), t = T0 + f / FPS, cam = nudgeKey(kameraShots(SHOTS, t), nudge);
  const tx = useFoto('e1-02/rumah-ditinggikan.jpg');
  const d = SINK * kompres(t);
  const AN: Anotasi[] = [
    {a: 22.3, b: 23.55, teks: 'Pondasi', di: [-1.9, -0.3 - d, 1.52], sisi: 'L'},
    {a: 23.7, b: 28.4, teks: 'Lempung lunak', di: [-0.7, -1.2, 1.5], sisi: 'L'},
    {a: 24.3, b: 28.4, teks: 'Pasir berair', di: [-0.6, -2.45, 1.5], sisi: 'L'},
    {a: 24.6, b: 28.4, teks: 'Sumur bor', di: [1.15, -1.0, 1.56], sisi: 'R', dy: -150},
    {a: 29.3, b: 31.8, teks: 'Posisi awal', di: [2.6, 0, 1.58], sisi: 'R', warna: ACUAN},
  ];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#a8bcd6 0%,#b9cbe3 45%,#c3d3e8 100%)'}}>
      <Audio src={staticFile('e1-02/vo.wav')} startFrom={Math.round(T0 * FPS)} />
      <AbsoluteFill style={{filter: 'contrast(1.05) saturate(1.05)'}}>
        <ThreeCanvas width={1080} height={1920} camera={{position: cam.pos, fov: 34, near: 1, far: 90}} gl={{alpha: true, antialias: true}}>
          <FotoCtx.Provider value={tx}>
            <Env intensity={0.32} /><Rig k={cam} />
            <hemisphereLight args={['#dbe6f5', '#6d5f4d', 0.5]} />
            <directionalLight position={[-11, 7, 9]} intensity={1.7} color="#fff0dc" />
            <Penampang t={t} />
            <GroundSlice t={t} tx={tx} w={{garis: [21.4, 22.0], jatuh: [21.75, 22.4], terang: [21.9, 22.8]}} lebar={FW} xp={XP} zb={ZB} zGaris={1.74} zTirai={1.72} cropStrip={[0, 0, 1, 121 / 576]} tinggiStrip={HL} lebarGaris={9} warna={ACUAN} />
          </FotoCtx.Provider>
        </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 52%, rgba(14,18,28,0.36) 100%)', pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,12,16,0) 62%, rgba(10,12,16,0.62) 100%)', pointerEvents: 'none', opacity: r(t, 21.9, 22.9)}} />
      {AN.map((a) => <Anot key={a.teks} an={a} t={t} cam={cam} />)}
      <Grain f={f} />
    </AbsoluteFill>
  );
};
