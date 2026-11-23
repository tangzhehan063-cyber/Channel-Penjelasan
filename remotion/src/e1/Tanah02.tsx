// E1 #02 "Tanah Turun, Lantai Rumah Ditinggikan Berkali-kali". 100% kode: Remotion + three.js, tanpa API AI.
// 1 satuan = 1 meter. Laju 10 cm/tahun dipakai konsisten: 0,3 m = tahun 3, 1,0 m = tahun 10 (simulasi, jika lajunya tetap).
// Aturan z-fighting (cek_kilau): tak ada permukaan sebidang; benda yang menumpu menancap 0,02 m ke penopangnya.
// Breakdown (skill breakdown) = SATU scene khusus (20,9-30,4 dtk): potongan tanah terurai + pemampatan lempung.
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Audio, Easing, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/inter/600.css'; import '@fontsource/inter/900.css';
import {Env} from '../pengetahuan/Scene';
import {Rig} from '../kit/stage';
import {Captions} from '../kit/teks';
import {camAt, FPS, nudgeKey, r, type Key, type V3} from '../kit/waktu';
import {Bx, C, Kicker, Label, type Lb} from './AnatomiRumah';
import {FotoMomen} from './Rumah01';
import wordsJson from '../../public/e1-02/words.json';

export const R02_FRAMES = Math.round(58.4 * FPS);
// Foto real-life dari user: ubah true setelah berkas ada di public/e1-02/ (rumah-ditinggikan.jpg, rob-permukiman.jpg, rumah-tertanam.jpg)
const FOTO = {rumah: false, rob: false, tertanam: false};
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
const GX = 0.3, GW = 6.6, GD = 1.2; // blok tanah
const Dunia: React.FC<{t: number}> = ({t}) => {
  const tex = useTexSafe();
  const {sea, drop, extra} = keadaan(t);
  const floor = 0.9 + extra; // tinggi lantai di atas permukaan tanah
  return (<group>
    {/* tiang acuan tetap (tertanam di tanah keras) + penggaris merah-putih tiap 0,5 m */}
    <mesh position={[-2.0, -0.2, 0.75]}><cylinderGeometry args={[0.06, 0.06, 7.4, 12]} /><meshStandardMaterial color="#f4f1ea" roughness={0.6} /></mesh>
    {Array.from({length: 13}, (_, i) => -2 + i * 0.5).map((y, i) => <mesh key={i} position={[-2.0, y + 0.12, 0.75]}><cylinderGeometry args={[0.075, 0.075, 0.12, 12]} /><meshStandardMaterial color="#e2563f" roughness={0.6} /></mesh>)}
    {/* garis permukaan tanah awal */}
    <Bx p={[GX, 0.0, 0.66]} s={[GW + 0.4, 0.025, 0.025]} c="#ef6a4c" />
    {/* tanah (turun bersama rumah) */}
    <group position={[0, -drop, 0]}>
      <Bx p={[GX, -0.25, 0]} s={[GW, 0.5, GD]} c="#8a7355" map={tex.tanah} />
      <Bx p={[GX, -1.2, 0]} s={[GW, 1.4, GD]} c="#7f8f98" r={0.9} />
      <Bx p={[GX, -2.15, 0]} s={[GW, 0.5, GD]} c="#d4bb7e" r={0.95} />
      <Bx p={[GX, -3.2, 0]} s={[GW, 1.6, GD]} c="#565b63" r={0.95} />
      {/* rumah: 3 lapis urugan lama + urugan baru (extra) */}
      {[0, 1, 2].map((k) => <Bx key={k} p={[0.4, 0.15 + k * 0.3 - 0.01, 0]} s={[3.4, 0.3, 1.0]} c={k % 2 ? '#8f8a7f' : '#cfcabd'} map={tex.beton} />)}
      {extra > 0.01 && <Bx p={[0.4, 0.9 - 0.02 + extra / 2, 0]} s={[3.4, extra, 1.0]} c="#b59f78" map={tex.tanah} />}
      <group position={[0.4, floor - 0.02, 0]}>
        <Bx p={[0, 1.1, -0.42]} s={[3.1, 2.2, 0.12]} c="#e6dcc6" />
        <Bx p={[-1.62, 1.1, 0]} s={[0.14, 2.2, 0.9]} c="#cbbfa4" /><Bx p={[1.62, 1.1, 0]} s={[0.14, 2.2, 0.9]} c="#cbbfa4" />
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.95, 2.62, 0]} rotation={[0, 0, -s * 0.42]}><boxGeometry args={[2.2, 0.08, 1.15]} /><meshStandardMaterial color={C.genteng} roughness={0.8} /></mesh>)}
      </group>
    </group>
    {/* air: menembus rumah, dasar di bawah permukaan tanah supaya tidak sebidang */}
    <mesh position={[GX, (sea - drop - 0.03) / 2, 0.02]}><boxGeometry args={[GW - 0.1, sea + drop + 0.03, GD + 0.5]} /><meshBasicMaterial color="#3d8fd6" transparent opacity={0.4} depthWrite={false} /></mesh>
  </group>);
};
// tekstur kecil lokal (CanvasTexture, seed tetap) lewat useTex milik AnatomiRumah
import {useTex} from './AnatomiRumah';
const useTexSafe = () => { const t = useTex(); return {tanah: t.tanah, beton: t.beton}; };

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
    <Bx p={[0, y0 + h.dasar / 2, 0]} s={[W, h.dasar, D]} c="#565b63" r={0.95} />
    <Bx p={[0, y1 + h.pasir / 2, 0]} s={[W, h.pasir, D]} c="#d4bb7e" r={0.95} />
    <Bx p={[0, y2 + h.lempung / 2, 0]} s={[W, h.lempung, D]} c="#7f8f98" r={0.9} />
    <Bx p={[0, y3 + h.urug / 2, 0]} s={[W, h.urug, D]} c="#9a8f7c" map={tex.tanah} />
    <group position={[0, y4 - 0.02, 0]}>
      <Bx p={[0, 0.45, 0]} s={[1.5, 0.9, 0.8]} c="#e6dcc6" /><mesh position={[0, 0.93, 0]}><boxGeometry args={[1.7, 0.1, 1.0]} /><meshStandardMaterial color={C.genteng} roughness={0.8} /></mesh>
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
const KD: Key[] = [orb(0, 8, 6, 16, [0.0, 2.1, 0]), orb(5.6, -6, 6, 15.5, [0.0, 2.1, 0]), orb(9.8, -16, 5, 15, [-0.4, 1.7, 0]), orb(16.5, 0, 6, 16, [0.0, 1.0, 0]),
  orb(20.4, -8, 8, 17.5, [0.1, 0.6, 0]), orb(30.9, 4, 8, 17.5, [0.1, 0.8, 0]), orb(38.9, 0, 5, 15.5, [0.0, 2.0, 0]), orb(45.5, 6, 6, 15.5, [0.0, 1.8, 0]), orb(52, 0, 8, 19, [0.0, 1.8, 0]), orb(58.4, -4, 9, 21, [0.0, 1.8, 0])];
const KB: Key[] = [orb(20.9, 22, 8, 16, [SB, 3.0, 0]), orb(25.5, -4, 11, 16, [SB, 2.9, 0]), orb(30.4, -22, 14, 16.5, [SB, 2.7, 0])];

// ---------- overlay 2D ----------
const Penghitung: React.FC<{t: number}> = ({t}) => {
  const p = r(t, 10.6, 11.2) * (1 - r(t, 20.6, 21.0)); if (p <= 0.01) return null;
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
const Matahari: React.FC = () => null;

export const Tanah02: React.FC<{nudge?: number}> = ({nudge = 0}) => {
  const f = useCurrentFrame(), t = f / FPS, ms = t * 1000, words = (wordsJson as {words: {word: string; start: number; end: number}[]}).words;
  const bk = t >= 20.9 && t < 30.9, c0 = camAt(bk ? KB : KD, t), cam = nudgeKey(c0, nudge);
  const dip = Math.max(0, r(t, 20.4, 20.9) * (1 - r(t, 20.9, 21.4)) + r(t, 30.4, 30.9) * (1 - r(t, 30.9, 31.4)) + r(t, 38.9, 39.3) * (1 - r(t, 39.3, 39.8)));
  const L = bk ? bongkarLabels(t) : [];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#bcd8ee 0%,#e6eef0 55%,#f3e9d6 100%)'}}>
      <Audio src={staticFile('e1-02/vo.wav')} />
      <ThreeCanvas width={1080} height={1920} camera={{position: cam.pos, fov: 34}} gl={{alpha: true, antialias: true}} shadows>
        <Env intensity={0.8} /><Rig k={cam} />
        <hemisphereLight args={['#dbeaff', '#8a7a62', 0.55]} />
        <directionalLight position={[-6, 12, 8]} intensity={2.6} color="#fff4e0" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-6} shadow-camera-near={1} shadow-camera-far={45} shadow-bias={-0.0004} shadow-normalBias={0.03} />
        <fog attach="fog" args={['#e8eef0', 45, 100]} />
        {!bk && <Dunia t={t} />}
        {bk && <Bongkar t={t} />}
      </ThreeCanvas>
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
