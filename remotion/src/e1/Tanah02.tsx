// E1 #02 "Tanah Turun, Lantai Rumah Ditinggikan Berkali-kali". 100% kode: Remotion + three.js, tanpa API AI.
// 1 satuan = 1 meter. Laju 10 cm/tahun dipakai konsisten: 0,3 m = tahun 3, 1,0 m = tahun 10 (simulasi, jika lajunya tetap).
// Aturan z-fighting (cek_kilau): tak ada permukaan sebidang; benda yang menumpu menancap 0,02 m ke penopangnya.
// Breakdown (skill breakdown) = SATU scene khusus (20,9-30,4 dtk): potongan tanah terurai + pemampatan lempung.
import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import {AbsoluteFill, Audio, Easing, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/inter/600.css'; import '@fontsource/inter/900.css';
import {Env} from '../pengetahuan/Scene';
import {Rig} from '../kit/stage';
import {Captions} from '../kit/teks';
import {camAt, FPS, nudgeKey, r, type Key, type V3} from '../kit/waktu';
import {Bx, C, Kicker, Label, useTex, type Lb} from './AnatomiRumah';
import {Blok, Kampung, RumahKampung, useBahan} from './look';
import * as THREE from 'three';
import {FotoMomen} from './Rumah01';
import wordsJson from '../../public/e1-02/words.json';

export const R02_FRAMES = Math.round(58.4 * FPS);
// Foto real-life dari user: ubah true setelah berkas ada di public/e1-02/ (rumah-ditinggikan.jpg, rob-permukiman.jpg, rumah-tertanam.jpg)
const FOTO = {rumah: true, rob: true, tertanam: true};
const SB = 40; // posisi scene breakdown di dunia
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const orb = (t: number, az: number, el: number, d: number, look: V3): Key => { const A = az * Math.PI / 180, E = el * Math.PI / 180; return {t, pos: [look[0] + d * Math.cos(E) * Math.sin(A), look[1] + d * Math.sin(E), look[2] + d * Math.cos(E) * Math.cos(A)], look}; };
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- keadaan dunia per waktu ----------
const lin = (t: number, a: number, b: number) => r(t, a, b, (x) => x);
const keadaan = (t: number) => {
  const sea = t < 38.9 ? lerp(1.05, 1.2, r(t, 6.1, 9.5)) : 1.2;
  let drop: number;
  if (t < 38.9) drop = t < 16.5 ? lerp(0, 0.3, lin(t, 10.5, 16.0)) : lerp(0.3, 1.0, lin(t, 16.8, 20.2));
  else drop = lerp(0.2, 0.7, lin(t, 41.7, 45.5));
  const extra = t < 38.9 ? 0 : lerp(0, 0.6, r(t, 39.8, 41.2));
  return {sea, drop, extra};
};

// ---------- dunia: tanah berlapis + rumah + air + tiang acuan ----------
const GX = 0.4, GW = 11, GD = 3.4; // blok tanah
const useBahanE1 = () => { const b = useBahan(), x = useTex(); return {b, genteng: x.genteng, beton: x.beton, tanah: x.tanah}; };
const Dunia: React.FC<{t: number}> = ({t}) => {
  const {b, genteng, beton, tanah} = useBahanE1();
  const {sea, drop, extra} = keadaan(t);
  const floor = 0.9 + extra; // tinggi lantai di atas permukaan tanah
  const air = useMemo(() => { const m = b.air.clone(); m.needsUpdate = true; return m; }, [b]);
  air.offset.x = (t * 0.04) % 1; air.offset.y = Math.sin(t * 0.8) * 0.01;
  return (<group>
    {/* tiang acuan tetap (tertanam di tanah keras) + penggaris merah-putih tiap 0,5 m */}
    <mesh position={[-2.6, -0.2, 1.95]}><cylinderGeometry args={[0.06, 0.06, 7.4, 12]} /><meshStandardMaterial color="#f4f1ea" roughness={0.6} /></mesh>
    {Array.from({length: 13}, (_, i) => -2 + i * 0.5).map((y, i) => <mesh key={i} position={[-2.6, y + 0.12, 1.95]}><cylinderGeometry args={[0.075, 0.075, 0.12, 12]} /><meshStandardMaterial color="#e2563f" roughness={0.6} /></mesh>)}
    {/* garis permukaan tanah awal */}
    <Bx p={[GX, 0.0, 1.85]} s={[GW + 0.4, 0.025, 0.025]} c="#ef6a4c" />
    {/* tanah berlapis (turun bersama rumah) */}
    <group position={[0, -drop, 0]}>
      <Blok p={[GX, 0.0, 0]} s={[GW, 0.06, GD]} map={b.rumput} rep={[5, 1.5]} bump={0.8} r={1} />
      <Blok p={[GX, -0.265, 0]} s={[GW, 0.47, GD]} map={tanah} rep={[5, 1]} bump={0.8} />
      <Blok p={[GX, -1.2, 0]} s={[GW, 1.4, GD]} map={b.lempung} rep={[4, 1]} bump={0.5} />
      <Blok p={[GX, -2.15, 0]} s={[GW, 0.5, GD]} map={b.pasir} rep={[4, 1]} bump={0.6} />
      <Blok p={[GX, -3.2, 0]} s={[GW, 1.6, GD]} map={b.batuan} rep={[4, 1]} bump={0.9} />
      <group position={[0.4, 0, 0]}><RumahKampung floor={floor} extra={extra} b={b} genteng={genteng} beton={beton} tanah={tanah} /></group>
      <Kampung b={b} genteng={genteng} />
    </group>
    {/* air: dasar menancap 0,03 m ke tanah atas (tidak sebidang), bergerak pelan */}
    <mesh position={[GX, (sea - drop - 0.015) / 2, 0.02]}><boxGeometry args={[GW - 0.1, sea + drop + 0.015, GD + 0.5]} /><meshStandardMaterial map={air} color="#ffffff" transparent opacity={0.5} roughness={0.15} depthWrite={false} /></mesh>
  </group>);
};
const useTexSafe = () => { const t = useBahanE1(); return {tanah: t.tanah, beton: t.beton, b: t.b}; };

// ---------- BREAKDOWN: potongan tanah terurai, lempung memampat, air tersedot ----------
const Bongkar: React.FC<{t: number}> = ({t}) => {
  const e = r(t, 21.2, 23.2, Easing.inOut(Easing.cubic)), c0 = r(t, 24.1, 27.6), beban = r(t, 28.7, 29.6), c = Math.min(1, c0 * 0.76 + beban * 0.24);
  const gap = 0.45 * e, W = 2.6, D = 1.2;
  const h = {dasar: 0.7, pasir: 0.8, lempung: 1.5 * (1 - 0.38 * c), urug: 0.5};
  const y0 = 0, y1 = y0 + h.dasar + gap, y2 = y1 + h.pasir + gap, y3 = y2 + h.lempung + gap, y4 = y3 + h.urug + gap;
  const tex = useTexSafe();
  const act = r(t, 24.0, 24.8) * (1 - r(t, 29.8, 30.6));
  return (<group position={[SB, 0, 0]}>
    <Bx p={[0, -0.06, 0]} s={[5, 0.1, 3.2]} c="#cfc8ba" r={0.9} />
    <Blok p={[0, y0 + h.dasar / 2, 0]} s={[W, h.dasar, D]} map={tex.b.batuan} rep={[1.5, 1]} bump={0.9} />
    <Blok p={[0, y1 + h.pasir / 2, 0]} s={[W, h.pasir, D]} map={tex.b.pasir} rep={[1.5, 1]} bump={0.6} />
    <Blok p={[0, y2 + h.lempung / 2, 0]} s={[W, h.lempung, D]} map={tex.b.lempung} rep={[1.5, 1.2]} bump={0.5} />
    <Blok p={[0, y3 + h.urug / 2, 0]} s={[W, h.urug, D]} map={tex.tanah} rep={[1.5, 1]} bump={0.8} />
    <group position={[0, y4 - 0.02, 0]}>
      <Blok p={[0, 0.45, 0]} s={[1.5, 0.9, 0.8]} map={tex.b.plester} rep={[1, 1]} bump={0.4} /><mesh position={[0, 0.93, 0]}><boxGeometry args={[1.7, 0.1, 1.0]} /><meshStandardMaterial color={C.genteng} roughness={0.8} /></mesh>
    </group>
    {/* sumur bor di sisi kanan: pipa + pompa + pipa isap ke lapisan pasir */}
    <mesh position={[1.75, (y1 + h.pasir / 2 + y4 + 0.95) / 2, 0]}><cylinderGeometry args={[0.07, 0.07, y4 + 0.95 - (y1 + h.pasir / 2), 12]} /><meshStandardMaterial color="#4a4f57" metalness={0.7} roughness={0.4} /></mesh>
    <mesh position={[1.52, y1 + h.pasir / 2, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.07, 0.07, 0.5, 12]} /><meshStandardMaterial color="#4a4f57" metalness={0.7} roughness={0.4} /></mesh>
    <Bx p={[1.75, y4 + 1.1, 0]} s={[0.4, 0.3, 0.4]} c="#2d6cc0" r={0.5} />
    {/* titik air: dari lempung turun ke pasir, masuk pipa, naik keluar */}
    {act > 0.02 && Array.from({length: 44}, (_, i) => {
      const u = (t * 0.22 + rnd(i, 3)) % 1, sx = (rnd(i, 1) - 0.5) * 1.8, sy = y2 + 0.15 + rnd(i, 2) * (h.lempung - 0.3), sz = (rnd(i, 4) - 0.5) * 0.8;
      const pasirY = y1 + h.pasir / 2; let x: number, y: number;
      if (u < 0.4) { const k = u / 0.4; x = lerp(sx, 1.0, k); y = lerp(sy, pasirY, k); }
      else if (u < 0.55) { const k = (u - 0.4) / 0.15; x = lerp(1.0, 1.75, k); y = pasirY; }
      else { const k = (u - 0.55) / 0.45; x = 1.75; y = lerp(pasirY, y4 + 0.95, k); }
      const o = Math.min(1, u / 0.06, (1 - u) / 0.08) * act;
      return <mesh key={i} position={[x, y, u < 0.55 ? sz : 0]}><sphereGeometry args={[0.11, 12, 10]} /><meshBasicMaterial color="#2f8bff" transparent opacity={o} /></mesh>;
    })}
    {/* panah beban dari rumah */}
    {beban > 0.02 && <group position={[0, y4 + 1.7, 0]}>
      <mesh position={[0, 0.3 - 0.5 * (1 - beban) * 0, 0]}><boxGeometry args={[0.07, 0.8, 0.07]} /><meshBasicMaterial color="#ef6a4c" transparent opacity={beban * (1 - r(t, 30.0, 30.6))} depthTest={false} /></mesh>
      <mesh position={[0, -0.2, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.16, 0.3, 14]} /><meshBasicMaterial color="#ef6a4c" transparent opacity={beban * (1 - r(t, 30.0, 30.6))} depthTest={false} /></mesh>
    </group>}
  </group>);
};
const bongkarLabels = (t: number): Lb[] => {
  const e = r(t, 21.2, 23.2, Easing.inOut(Easing.cubic)), c0 = r(t, 24.1, 27.6), c = Math.min(1, c0 * 0.76 + r(t, 28.7, 29.6) * 0.24), gap = 0.45 * e;
  const hL = 1.5 * (1 - 0.38 * c), y1 = 0.7 + gap, y2 = y1 + 0.8 + gap, y3 = y2 + hL + gap, y4 = y3 + 0.5 + gap;
  return [
    {a: 22.0, b: 30.4, text: 'Lantai + urugan', at: [SB - 1.3, y3 + 0.25, 0.6], side: 'L'},
    {a: 22.5, b: 30.4, text: 'Lempung lunak', at: [SB - 1.3, y2 + hL / 2, 0.6], side: 'L'},
    {a: 23.0, b: 30.4, text: 'Pasir berair', at: [SB - 1.3, y1 + 0.4, 0.6], side: 'L'},
    {a: 23.5, b: 30.4, text: 'Lempung keras', at: [SB - 1.3, 0.35, 0.6], side: 'L'},
    {a: 24.4, b: 30.4, text: 'Sumur bor', at: [SB + 1.75, y1 + 0.4, 0.1], side: 'R'},
  ];
};

// ---------- kamera ----------
const KD: Key[] = [orb(0, 8, 6, 20, [0.4, 2.0, 0]), orb(5.6, -6, 6, 19.5, [0.4, 2.0, 0]), orb(9.8, -16, 5, 19, [0.0, 1.5, 0]), orb(16.5, 0, 6, 20, [0.4, 0.8, 0]),
  orb(20.4, -8, 8, 21, [0.4, 0.4, 0]), orb(30.9, 4, 8, 21, [0.4, 0.6, 0]), orb(38.9, 0, 5, 19.5, [0.4, 1.9, 0]), orb(45.5, 6, 6, 19.5, [0.4, 1.5, 0]), orb(52, 0, 8, 22, [0.4, 1.6, 0]), orb(58.4, -4, 9, 24, [0.4, 1.6, 0])];
const KB: Key[] = [orb(20.9, 22, 8, 16, [SB, 3.0, 0]), orb(25.5, -4, 11, 16, [SB, 2.9, 0]), orb(30.4, -22, 14, 16.5, [SB, 2.7, 0])];

// ---------- overlay 2D ----------
const Penghitung: React.FC<{t: number}> = ({t}) => {
  const foto = r(t, 11.4, 11.8) * (1 - r(t, 14.4, 14.8)), p = r(t, 10.6, 11.2) * (1 - r(t, 20.6, 21.0)) * (1 - foto); if (p <= 0.01) return null;
  const d = keadaan(t).drop, th = Math.min(10, Math.round(d * 10));
  return (<div style={{position: 'absolute', left: 0, right: 0, top: 215, textAlign: 'center', fontFamily: 'Inter', opacity: p}}>
    <div style={{display: 'inline-block', padding: '10px 30px 14px', borderRadius: 24, background: 'rgba(250,249,246,0.95)', boxShadow: '0 10px 32px rgba(30,30,30,0.2)'}}>
      <div style={{fontWeight: 900, fontSize: 54, color: '#2a2a2e', letterSpacing: -1.5}}>Tahun ke-{th}</div>
      <div style={{fontWeight: 700, fontSize: 40, color: '#ef6a4c'}}>tanah turun {Math.round(d * 100)} cm</div>
      {t < 16.5 && <div style={{fontWeight: 600, fontSize: 30, color: '#5a5a5e', marginTop: 4}}>±10 cm per tahun, di beberapa titik</div>}
      {t >= 16.5 && <div style={{fontWeight: 600, fontSize: 30, color: '#5a5a5e', marginTop: 4}}>simulasi, kalau lajunya tetap</div>}
    </div>
  </div>);
};
const KartuStudi: React.FC<{t: number}> = ({t}) => {
  const i = r(t, 33.4, 34.0, Easing.out(Easing.cubic)), o = 1 - r(t, 38.0, 38.6); if (i * o <= 0.01) return null;
  const rows: [string, string, boolean][] = [['1', 'Tianjin', false], ['2', 'Semarang', true], ['3', 'Jakarta', false]];
  return (<>
    <AbsoluteFill style={{background: '#f6f1e6', opacity: 0.9 * i * o}} />
    <div style={{position: 'absolute', left: 60, right: 60, top: 230, opacity: i * o, textAlign: 'center', fontFamily: 'Inter'}}>
      <div style={{fontWeight: 900, fontSize: 58, letterSpacing: -1.5, color: '#25252a'}}>Tanah turun tercepat</div>
      <div style={{fontWeight: 600, fontSize: 36, color: '#5a5a5e', marginTop: 8}}>dari 99 kota pesisir dunia</div>
    </div>
    <div style={{position: 'absolute', left: 90, right: 90, top: 520, opacity: i * o, fontFamily: 'Inter'}}>
      {rows.map(([n, nama, hi], k) => (<div key={n} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '22px 34px', marginBottom: 26, borderRadius: 26, background: hi ? '#ef6a4c' : '#fbf8f1', boxShadow: '0 10px 30px rgba(30,30,30,0.16)', transform: `translateX(${(1 - r(t, 33.6 + k * 0.25, 34.2 + k * 0.25)) * 80}px)`, opacity: r(t, 33.6 + k * 0.25, 34.2 + k * 0.25)}}>
        <div style={{fontWeight: 900, fontSize: 80, color: hi ? '#fff' : '#ef6a4c', width: 70}}>{n}</div>
        <div style={{fontWeight: 900, fontSize: 70, color: hi ? '#fff' : '#2a2a2e', letterSpacing: -1.5}}>{nama}</div>
      </div>))}
    </div>
    <div style={{position: 'absolute', left: 60, right: 60, top: 1180, textAlign: 'center', opacity: i * o, fontFamily: 'Inter', fontWeight: 600, fontSize: 30, color: '#4a4a4e'}}>Studi InSAR 2022 (Wu, Wei, D'Hondt), dikutip detikJateng 28 Mei 2022</div>
  </>);
};
const Saran: React.FC<{t: number}> = ({t}) => {
  const i = r(t, 46.2, 46.8, Easing.out(Easing.cubic)), o = 1 - r(t, 52.0, 52.6); if (i * o <= 0.01) return null;
  const rows = [['1', 'Kurangi sedot air tanah', 46.4], ['2', 'Beli rumah di pesisir? Tanya: lantai pernah ditinggikan berapa kali?', 49.2]] as const;
  return (<>
    <AbsoluteFill style={{background: '#f6f1e6', opacity: 0.88 * i * o}} />
    <div style={{position: 'absolute', left: 80, right: 80, top: 360, fontFamily: 'Inter', opacity: i * o}}>
      {rows.map(([n, tx, a]) => { const p = r(t, a, a + 0.5, Easing.out(Easing.cubic)); return (<div key={n} style={{display: 'flex', gap: 26, alignItems: 'center', padding: '26px 34px', marginBottom: 34, borderRadius: 26, background: '#fbf8f1', boxShadow: '0 10px 30px rgba(30,30,30,0.16)', opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
        <div style={{fontWeight: 900, fontSize: 84, color: '#ef6a4c'}}>{n}</div>
        <div style={{fontWeight: 800, fontSize: 52, color: '#2a2a2e', lineHeight: 1.15, letterSpacing: -1}}>{tx}</div>
      </div>); })}
    </div>
  </>);
};
const Langit: React.FC<{t: number}> = ({t}) => (
  <svg width={1080} height={1000} style={{position: 'absolute', left: 0, top: 0}}>
    <defs><filter id="kabur"><feGaussianBlur stdDeviation="18" /></filter><radialGradient id="mt" cx="0.15" cy="0.05" r="0.6"><stop offset="0" stopColor="#fff6d8" stopOpacity="0.85" /><stop offset="1" stopColor="#fff6d8" stopOpacity="0" /></radialGradient></defs>
    <rect width={1080} height={1000} fill="url(#mt)" />
    {[[120, 300, 210, 46, 7], [620, 220, 260, 52, 5], [900, 420, 200, 40, 9], [330, 520, 240, 44, 6]].map(([x, y, rx, ry, v], i) => <g key={i} filter="url(#kabur)" opacity={0.7}>
      <ellipse cx={((x + t * v) % 1500) - 200} cy={y} rx={rx} ry={ry} fill="#ffffff" /><ellipse cx={((x + t * v) % 1500) - 200 + rx * 0.5} cy={y - ry * 0.5} rx={rx * 0.6} ry={ry * 0.8} fill="#ffffff" />
    </g>)}
  </svg>
);

export const Tanah02: React.FC<{nudge?: number}> = ({nudge = 0}) => {
  const f = useCurrentFrame(), t = f / FPS, ms = t * 1000, words = (wordsJson as {words: {word: string; start: number; end: number}[]}).words;
  const bk = t >= 20.9 && t < 30.9, c0 = camAt(bk ? KB : KD, t), cam = nudgeKey(c0, nudge);
  const dip = Math.max(0, r(t, 20.4, 20.9) * (1 - r(t, 20.9, 21.4)) + r(t, 30.4, 30.9) * (1 - r(t, 30.9, 31.4)) + r(t, 38.9, 39.3) * (1 - r(t, 39.3, 39.8)));
  const L = bk ? bongkarLabels(t) : [];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#bcd8ee 0%,#e6eef0 55%,#f3e9d6 100%)'}}>
      <Audio src={staticFile('e1-02/vo.wav')} />
      <Langit t={t} />
      <AbsoluteFill style={{filter: 'contrast(1.07) saturate(1.12)'}}>
      <ThreeCanvas width={1080} height={1920} camera={{position: cam.pos, fov: 34}} gl={{alpha: true, antialias: true}} shadows>
        <Env intensity={0.8} /><Rig k={cam} />
        <hemisphereLight args={['#dbeaff', '#8a7a62', 0.55]} />
        <directionalLight position={[-6, 12, 8]} intensity={2.6} color="#fff4e0" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-6} shadow-camera-near={1} shadow-camera-far={45} shadow-bias={-0.0004} shadow-normalBias={0.03} />
        <fog attach="fog" args={['#e8eef0', 45, 100]} />
        {!bk && <Dunia t={t} />}
        {bk && <Bongkar t={t} />}
      </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,24,34,0.3) 100%)', pointerEvents: 'none'}} />
      {L.map((l) => <Label key={l.text} l={l} t={t} e={0} e2={0} cam={cam} />)}
      <Penghitung t={t} />
      {FOTO.rumah && <FotoMomen src="e1-02/rumah-ditinggikan.jpg" t={t} a={0.3} b={4.9} w={1000} h={640} kotak={[]} teks="Rumah ini" />}
      {FOTO.tertanam && <FotoMomen src="e1-02/rumah-tertanam.jpg" t={t} a={11.6} b={14.6} w={1000} h={640} kotak={[]} teks="Rumah yang jadi lebih rendah dari jalan" />}
      {FOTO.rob && <FotoMomen src="e1-02/rob-permukiman.jpg" t={t} a={30.9} b={33.6} w={1000} h={640} kotak={[]} teks="Rob di permukiman pesisir" />}
      {FOTO.rumah && <FotoMomen src="e1-02/rumah-ditinggikan.jpg" t={t} a={53.0} b={55.8} w={1000} h={640} kotak={[]} teks="Rumah di dekatmu?" />}
      <Kicker t={t} a={0.3} b={5.7} text="Masih kebanjiran?" />
      <Kicker t={t} a={6.0} b={9.8} text="Air laut naik" />
      <Kicker t={t} a={10.0} b={20.4} text="Tanah ikut turun" />
      <Kicker t={t} a={21.2} b={30.6} text="Kenapa bisa turun?" />
      <Kicker t={t} a={39.4} b={45.8} text="Ditinggikan lagi" />
      <Kicker t={t} a={53.0} b={55.9} text="Rumah di dekatmu?" />
      <Kicker t={t} a={56.1} b={58.4} text="Fakta Rumah" />
      <KartuStudi t={t} />
      <Saran t={t} />
      <AbsoluteFill style={{background: '#fbf8f1', opacity: dip, pointerEvents: 'none'}} />
      <Captions ms={ms} words={words} />
    </AbsoluteFill>
  );
};
