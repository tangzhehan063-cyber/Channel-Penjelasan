// CATATAN 24 Nov: gaya sinematik/semi-realistis; BUKAN arah channel (lihat docs/visual-system/VISUAL_STYLE_SPEC.md). Dipertahankan sebagai riwayat.
// PILOT v3 E1 #02 (sutradara, 24 Nov): sequence 20,4-31,0 dtk. Satu dunia: foto rumah ber-grade low-key (elemen terolah) + garis cahaya hangat di garis tanah
// + penampang noir 3D (lampu hangat, rim biru) + lempung BERPORI berisi air yang mengecil (metafora spons di dalam adegan) + kembali ke foto yang turun.
// Arahan: e1/02/direction-v3.md; kamera dari e1/02/shots3.json. 1 satuan = 1 m. Pemampatan 0,57 m = ILUSTRASI. Deterministik (fungsi frame, seed).
import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import * as THREE from 'three';
import {AbsoluteFill, Audio, Easing, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/inter/600.css';
import {Env} from '../pengetahuan/Scene';
import {Rig} from '../kit/stage';
import {FPS, nudgeKey, proj, r} from '../kit/waktu';
import {Blok} from './look';
import {FotoBidang, useFoto} from './lib/footage';
import {kameraShots, type ShotKamera} from './lib/kamera';
import {GroundSlice} from './lib/transisi';
import {Anot, type Anotasi} from './lib/anot';
import {Grain, SINK, T0, usePenampang} from './Pilot02';
import shotsJson from '../../../e1/02/shots3.json';

export const PILOT02C_FRAMES = Math.round(10.6 * FPS);
const SHOTS = (shotsJson as unknown as {shots: ShotKamera[]}).shots;
const FW = 9, FH = (FW * 576) / 1024, XP = 1.2, ZB = 1.55;
const HU = FH * (455 / 576), HL = FH * (121 / 576);
const HANGAT = '#ffb27a';
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const kompres = (t: number) => Math.min(1, r(t, 26.2, 28.1) * 0.76 + r(t, 28.7, 29.7) * 0.24);
const turun = (t: number) => SINK * kompres(t) + (t > 28.9 ? 0.035 * Math.sin((t - 28.9) * 13) * Math.exp(-(t - 28.9) * 3.2) : 0); // + endapan kecil setelah beban (tindak lanjut)

const glowTex = () => { const c = document.createElement('canvas'); c.width = 4; c.height = 64; const g = c.getContext('2d')!; const gr = g.createLinearGradient(0, 0, 0, 64); gr.addColorStop(0, 'rgba(255,170,110,0)'); gr.addColorStop(0.5, 'rgba(255,190,140,1)'); gr.addColorStop(1, 'rgba(255,170,110,0)'); g.fillStyle = gr; g.fillRect(0, 0, 4, 64); return new THREE.CanvasTexture(c); };

const Dunia: React.FC<{t: number; tx: THREE.Texture | null}> = ({t, tx}) => {
  const x = usePenampang(); const gl = useMemo(glowTex, []);
  const c = kompres(t), d = turun(t), hClay = 1.5 - SINK * c;
  const act = r(t, 23.8, 24.6) * (1 - r(t, 28.6, 29.3)), PX = 1.15, YP = -2.45;
  const g = r(t, 21.7, 22.3, Easing.inOut(Easing.cubic)), lamp = r(t, 22.0, 22.9, Easing.out(Easing.cubic));
  const bebanO = r(t, 28.7, 29.2) * (1 - r(t, 30.0, 30.5));
  return (<group>
    <Env intensity={0.12} />
    <hemisphereLight args={['#1c2433', '#0a0908', 0.28]} />
    <directionalLight position={[6, 2, 4]} intensity={0.5} color="#6f8fbf" />
    <pointLight position={[-1.3, -0.3, 3.6]} intensity={22 * lamp} distance={10} decay={1.7} color={HANGAT} />
    <Blok p={[0, -2.85 - 4.15 / 2, 0]} s={[9, 4.15, 3.0]} map={x.batuan} rep={[5, 2.5]} bump={1.0} bayang={false} />
    <Blok p={[0, -2.05 - 0.4, 0.002]} s={[9, 0.8, 3.0]} map={x.pasir} rep={[5, 0.6]} bump={0.7} bayang={false} />
    <Blok p={[0, -2.05 + hClay / 2, 0.004]} s={[9, hClay, 3.0]} map={x.lempung} rep={[5, 1]} bump={0.6} r={0.34} bayang={false} />
    {/* pori berisi air pada lempung: mengecil dan memudar saat air terperas (spons) */}
    {Array.from({length: 120}, (_, i) => {
      const px = -2.4 + rnd(i, 5) * 4.8, py = -2.05 + hClay * (0.06 + 0.88 * rnd(i, 6)), rx = 0.025 + 0.05 * rnd(i, 7), sq = hClay / 1.5;
      return <mesh key={i} position={[px, py, 1.518]} scale={[rx, rx * 0.62 * sq, 0.02]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#1d4f86" emissive="#2a74c4" emissiveIntensity={0.3 * (1 - 0.5 * c)} transparent opacity={0.55 - 0.3 * c} roughness={0.2} /></mesh>;
    })}
    <group position={[0, -d, 0]}>
      <Blok p={[0, -0.55 / 2, 0.006]} s={[9, 0.55, 3.0]} map={x.urugan} rep={[5, 0.45]} bump={0.9} bayang={false} />
      <Blok p={[-0.85, -0.27, 0.36]} s={[2.5, 0.46, 2.32]} map={x.pondasi} rep={[2.2, 0.45]} bump={0.8} bayang={false} />
      <FotoBidang tx={tx} crop={[0, 121 / 576 - 0.03 / FH, 1, 1]} lebar={FW} tinggi={HU + 0.03} p={[XP, HU / 2 - 0.015, ZB]} buluAtas={0.14} warna="#aeb6c6" />
      {bebanO > 0.02 && <group position={[-0.85, 1.1 - 0.25 * r(t, 28.8, 29.8, Easing.out(Easing.cubic)), 1.62]}>
        <mesh position={[0, 0.5, 0]} renderOrder={7}><boxGeometry args={[0.07, 1.0, 0.03]} /><meshBasicMaterial color={HANGAT} transparent opacity={bebanO * 0.9} depthTest={false} toneMapped={false} /></mesh>
        <mesh position={[0, -0.1, 0]} rotation={[0, 0, Math.PI]} renderOrder={7}><coneGeometry args={[0.16, 0.26, 3]} /><meshBasicMaterial color={HANGAT} transparent opacity={bebanO * 0.9} depthTest={false} toneMapped={false} /></mesh>
      </group>}
    </group>
    {/* sumur */}
    <mesh position={[PX, (YP - d) / 2 - 0.05, 1.56]}><cylinderGeometry args={[0.07, 0.07, -YP - d - 0.1, 12]} /><meshStandardMaterial color="#6a7078" metalness={0.6} roughness={0.45} /></mesh>
    <mesh position={[PX - 0.3, YP, 1.56]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.07, 0.07, 0.6, 12]} /><meshStandardMaterial color="#6a7078" metalness={0.6} roughness={0.45} /></mesh>
    {/* titik air bercahaya: lempung -> pasir -> pipa -> permukaan */}
    {act > 0.02 && Array.from({length: 64}, (_, i) => {
      const u = (t * 0.2 + rnd(i, 3)) % 1, sx = -1.2 + rnd(i, 1) * 1.9, sy = -2.05 + 0.2 + rnd(i, 2) * Math.max(0.3, hClay - 0.4); let px: number, py: number;
      if (u < 0.4) { const k = u / 0.4; px = lerp(sx, 0.7, k); py = lerp(sy, YP, k); } else if (u < 0.55) { const k = (u - 0.4) / 0.15; px = lerp(0.7, PX, k); py = YP; } else { const k = (u - 0.55) / 0.45; px = PX; py = lerp(YP, -d - 0.12, k); }
      const o = Math.min(1, u / 0.06, (1 - u) / 0.1) * act, z = 1.6 + rnd(i, 4) * 0.05;
      return <group key={i} position={[px, py, z]}>
        <mesh><sphereGeometry args={[0.035, 10, 8]} /><meshBasicMaterial color="#9bd2ff" transparent opacity={o} toneMapped={false} /></mesh>
        <mesh><sphereGeometry args={[0.1, 10, 8]} /><meshBasicMaterial color="#4aa3ff" transparent opacity={o * 0.16} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
      </group>;
    })}
    {/* debu di cahaya lampu: kedalaman dan atmosfer */}
    {lamp > 0.1 && Array.from({length: 40}, (_, i) => {
      const px = -2.6 + rnd(i, 8) * 5.2 + 0.08 * Math.sin(t * 0.7 + i), py = -3.2 + rnd(i, 9) * 3.6 + 0.06 * Math.sin(t * 0.5 + i * 2), pz = 1.9 + rnd(i, 10) * 1.6;
      return <mesh key={i} position={[px, py, pz]}><sphereGeometry args={[0.012 + 0.012 * rnd(i, 11), 6, 5]} /><meshBasicMaterial color="#ffe2c0" transparent opacity={0.35 * lamp} toneMapped={false} depthWrite={false} /></mesh>;
    })}
    {/* garis cahaya hangat = garis tanah = garis acuan (glow tipis) */}
    {g > 0.01 && <mesh position={[-4.5 + 4.5 * g, 0, 1.73]} renderOrder={6}><planeGeometry args={[9 * g, 0.5]} /><meshBasicMaterial map={gl} transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>}
    <GroundSlice t={t} tx={tx} w={{garis: [21.7, 22.3], jatuh: [22.1, 22.7], terang: [22.0, 22.9]}} lebar={FW} xp={XP} zb={ZB} zGaris={1.74} zTirai={1.72} cropStrip={[0, 0, 1, 121 / 576]} tinggiStrip={HL} lebarGaris={9} warna={HANGAT} />
  </group>);
};

const Sfx: React.FC<{n: string; t: number; v: number}> = ({n, t, v}) => (<Sequence from={Math.round((t - T0) * FPS)} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>);

export const Pilot02C: React.FC<{nudge?: number}> = ({nudge = 0}) => {
  const f = useCurrentFrame(), t = T0 + f / FPS, cam = nudgeKey(kameraShots(SHOTS, t), nudge);
  const tx = useFoto('e1-02/rumah-ditinggikan.jpg');
  const d = turun(t);
  const AN: Anotasi[] = [
    {a: 22.9, b: 23.6, teks: 'Pondasi', di: [-1.9, -0.3 - d, 1.52], sisi: 'L', gaya: 'huruf'},
    {a: 23.8, b: 26.0, teks: 'Lempung lunak', di: [-0.5, -1.2, 1.5], sisi: 'L', gaya: 'huruf'},
    {a: 29.4, b: 31.4, teks: 'Posisi awal', di: [2.4, 0, 1.74], sisi: 'R', gaya: 'huruf', warna: HANGAT},
  ];
  const [fx, fy] = proj(cam, [-0.9, 0.35 - d, 1.55]);
  const kolam = r(t, 20.5, 21.2) * (1 - r(t, 21.7, 22.3)) + r(t, 29.6, 30.4);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#7f90ab 0%,#9fb0c9 45%,#aebbd0 100%)'}}>
      <Audio src={staticFile('e1-02/vo.wav')} startFrom={Math.round(T0 * FPS)} />
      <Audio src={staticFile('sfx/ambient.wav')} volume={0.1} />
      <Sfx n="whoosh" t={21.7} v={0.28} /><Sfx n="thud" t={22.1} v={0.4} />
      {[24.2, 24.9, 25.5, 26.1].map((s) => <Sfx key={s} n="drip" t={s} v={0.3} />)}
      <Sfx n="bass" t={26.3} v={0.5} /><Sfx n="thud" t={28.8} v={0.5} />
      <AbsoluteFill style={{filter: 'contrast(1.1) saturate(0.86) brightness(0.96)'}}>
        <ThreeCanvas width={1080} height={1920} camera={{position: cam.pos, fov: 34, near: 1, far: 90}} gl={{alpha: true, antialias: true}}>
          <Rig k={cam} /><Dunia t={t} tx={tx} />
        </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 420px 360px at ${fx}px ${fy}px, rgba(255,170,100,${0.34 * Math.min(1, kolam)}) 0%, rgba(255,170,100,0) 100%)`, mixBlendMode: 'screen', pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 40%, rgba(8,10,16,0.6) 100%)', pointerEvents: 'none'}} />
      {AN.map((a) => <Anot key={a.teks} an={a} t={t} cam={cam} />)}
      <Grain f={f} />
    </AbsoluteFill>
  );
};
