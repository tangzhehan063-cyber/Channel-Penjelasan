// E1 #06 "Rajin Cabut Charger, Magic Com Nyala Seharian" versi GAYA LAMA (keputusan user 27 Nov: pakai gaya sebelum perubahan besar 25 Nov).
// Kerangka v20 (kamera perspektif per adegan, Seg, Title, Captions, Chip, TikTokBox, PaperPalet). Satu objek besar per adegan.
// Naskah & VO tetap (ACC 27 Nov): public/e1-06. Visual 100% kode, tanpa API AI.
import {Audio} from '@remotion/media';
import {AbsoluteFill, Easing, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Grain, TikTokBox} from '../aset/Aset';
import {CommentBubble, FollowButton, Kicker} from '../aset/Gabung';
import {PaperPalet, PALET} from '../aset/PaperPalet';
import {PALETTE} from '../pengetahuan/Scene';
import {Bx, camAt, Canvas3D, Captions, Chip, Cy, FPS, Outlet, r, Seg, Sp, TemaProvider, Title, type Key} from '../kit';
import words from '../../public/e1-06/words.json';
const WORDS = (words as {words: {word: string; start: number; end: number}[]}).words;

export const L06_END = 67.2;
export const L06_FRAMES = Math.round(L06_END * FPS);
const PL = PALET.langit, INK = PALETTE.ink, CORAL = PL.accent, COOL = PL.cool, GOOD = PL.good;
const WARNA = {accent: CORAL, good: GOOD};
const EMAS = '#e2b84f', EMAS2 = '#c2922e';

// ---------- beat (detik dari words.json) ----------
const B = {hook: 0, rp: 3.85, modern: 7.3, sebulan: 13.4, lama: 23.2, aturan: 28.3, magic: 32.8, hitung: 41.3, kali: 47.8, balik: 51.0, matikan: 55.3, aman: 58.1, follow: 64.2, end: L06_END};

// ---------- objek ----------
/** charger tertancap di stop kontak (menghadap +z). keluar 0..1 = ditarik keluar. lama = model trafo besar hitam. rusak = kabel merah berdenyut */
const Charger: React.FC<{keluar?: number; lama?: number; rusak?: number; t: number}> = ({keluar = 0, lama = 0, rusak = 0, t}) => {
  const z = 0.12 + keluar * 1.4, besar = lama > 0.5;
  const s: [number, number, number] = besar ? [0.95, 1.05, 0.75] : [0.62, 0.7, 0.5];
  const merah = rusak * (0.55 + 0.45 * Math.abs(Math.sin(t * 6)));
  return (<group position={[0, 0, z]}>
    <Bx p={[0, 0, s[2] / 2 + 0.02]} s={s} c={besar ? '#34343a' : '#f4f1ea'} />
    <Bx p={[0, 0.05, s[2] + 0.03]} s={[s[0] * 0.5, 0.1, 0.02]} c={besar ? '#55555c' : '#b9bdc4'} edge={false} />
    <Sp p={[s[0] * 0.3, s[1] * 0.34, s[2] + 0.04]} rad={0.035} c={besar ? '#ff8a3a' : GOOD} />
    {besar && <Sp p={[0, 0, s[2] / 2]} rad={0.01} c={CORAL} />}
    {/* kabel: turun dari bawah charger */}
    <Cy p={[0, -s[1] / 2 - 0.9, s[2] / 2]} rad={0.05} h={1.8} c={merah > 0.05 ? '#f1eee6' : '#f1eee6'} rot={[0, 0, 0]} edge={false} />
    {merah > 0.02 && <Cy p={[0, -s[1] / 2 - 0.55, s[2] / 2]} rad={0.075} h={0.45} c={CORAL} rot={[0, 0, 0]} edge={false} />}
  </group>);
};

/** magic com besar: badan, tutup, panel lampu masak/hangat. warm = lampu hangat menyala. balik = diangkat & dibalik (dasar menghadap kamera) */
const MagicCom: React.FC<{warm: number; balik?: number}> = ({warm, balik = 0}) => {
  const putar = r(balik, 0.1, 0.5, Easing.inOut(Easing.cubic)) * (1 - r(balik, 0.8, 1, Easing.inOut(Easing.cubic)));
  return (<group position={[0, -0.2 + 0.5 * putar, 0]} rotation={[-1.9 * putar, 0, 0]}>
    <Cy p={[0, 0, 0]} rad={1.05} h={1.35} c="#f4f1ea" rot={[0, 0, 0]} />
    <mesh position={[0, 0.66, 0]} scale={[1, 0.42, 1]}><sphereGeometry args={[1.07, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#e6e0d2" roughness={0.45} /></mesh>
    <Bx p={[0, 1.2, 0]} s={[0.8, 0.14, 0.22]} c="#5a5a60" />
    <Bx p={[0, -0.05, 1.03]} s={[0.78, 0.46, 0.1]} c="#6a6d73" />
    <Sp p={[-0.2, 0.03, 1.1]} rad={0.06} c="#7a3b33" />
    <Sp p={[0.2, 0.03, 1.1]} rad={0.06 + 0.02 * warm} c={warm > 0.5 ? '#ffb040' : '#5c5048'} />
    <Bx p={[0, -0.2, 1.09]} s={[0.26, 0.09, 0.04]} c="#3d3f44" edge={false} />
    {[[0.6, 0.6], [-0.6, 0.6], [0.6, -0.6], [-0.6, -0.6]].map(([x, z]) => <Cy key={`${x}${z}`} p={[x, -0.71, z]} rad={0.1} h={0.08} c="#2a2b2f" rot={[0, 0, 0]} edge={false} />)}
    {/* stiker dasar */}
    <Bx p={[0, -0.69, 0]} s={[1.2, 0.02, 0.85]} c="#fbf8f1" edge={false} />
    <Bx p={[0, -0.701, 0.18]} s={[1.0, 0.01, 0.2]} c={CORAL} edge={false} />
  </group>);
};

/** tumpukan keping (1 keping = Rp104) */
const Keping: React.FC<{n: number; x?: number; rad?: number; tk?: number}> = ({n, x = 0, rad = 0.55, tk = 0.09}) => (<group position={[x, 0, 0]}>
  {Array.from({length: Math.floor(n)}, (_, i) => <Cy key={i} p={[0, tk * (i + 0.5), 0]} rad={rad} h={tk * 0.9} c={i % 2 ? EMAS : EMAS2} rot={[0, 0, 0]} edge={i === Math.floor(n) - 1} m={0.3} />)}
</group>);

// ---------- kamera (objek di zona y 700–1330, di bawah kartu judul) ----------
const C_OUT: Key[] = [{t: 0, pos: [1.2, 0.8, 7.6], look: [0, 0.4, 0]}, {t: 3.9, pos: [0.6, 0.6, 7.0], look: [0, 0.4, 0]}];
const C_RP: Key[] = [{t: 3.6, pos: [0, 1.8, 8.4], look: [0, 0.9, 0]}, {t: 7.5, pos: [0, 1.6, 7.8], look: [0, 0.9, 0]}];
const C_MOD: Key[] = [{t: 7.1, pos: [2.6, 0.9, 7.4], look: [0, 0.35, 0]}, {t: 13.6, pos: [-1.8, 0.7, 7.6], look: [0, 0.35, 0]}];
const C_LAMA: Key[] = [{t: 23.0, pos: [2.8, 1.2, 7.8], look: [0, 0.35, 0.3]}, {t: 28.5, pos: [1.4, 0.8, 7.4], look: [0, 0.35, 0.3]}];
const C_MC: Key[] = [{t: 32.6, pos: [-2.6, 3.0, 10.4], look: [0, 0.45, 0]}, {t: 41.5, pos: [-1.0, 2.2, 10.0], look: [0, 0.45, 0]}];
const C_HIT: Key[] = [{t: 41.1, pos: [2.0, 2.6, 15], look: [0.4, 1.7, 0]}, {t: 44.9, pos: [1.8, 3.0, 16], look: [0.3, 2.0, 0]}, {t: 47.9, pos: [1.5, 3.2, 18], look: [0.3, 2.1, 0]}];
const C_KALI: Key[] = [{t: 47.6, pos: [1.2, 3.2, 18], look: [0, 2.1, 0]}, {t: 51.2, pos: [0.6, 3.0, 17], look: [0, 2.0, 0]}];
const C_BALIK: Key[] = [{t: 50.8, pos: [0, 1.6, 9.4], look: [0, 0.3, 0]}, {t: 58.3, pos: [0.6, 1.4, 8.8], look: [0, 0.2, 0]}];
const C_AMAN: Key[] = [{t: 57.9, pos: [-1.8, 0.7, 7.6], look: [0, 0.4, 0]}, {t: 64.4, pos: [-0.8, 0.5, 7.0], look: [0, 0.4, 0]}];
const C_END: Key[] = [{t: 64.0, pos: [0.6, 3.0, 24], look: [0, 2.9, 0]}, {t: 67.2, pos: [0.3, 3.2, 27], look: [0, 3.1, 0]}];
const TK = 0.022; // tebal keping: 225 keping = 4,95 satuan (perbandingan tinggi tetap 1 : 225)
const MC0 = 0.91; // magic com: dasar ke pusat grup

// ---------- panel 2D ----------
const PANEL = {position: 'absolute' as const, left: 60, right: 60, top: 720, borderRadius: 34, background: '#fff6e2', border: `6px solid ${INK}`, overflow: 'hidden' as const, padding: '30px 40px'};
const Sebulan: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 13.5, 13.95, Easing.out(Easing.cubic)), o = 1 - r(t, 22.9, 23.2); if (a * o <= 0.01) return null;
  const isi = r(t, 13.8, 15.0), h1 = r(t, 15.2, 15.6), h2 = r(t, 16.9, 17.4, Easing.out(Easing.back(2))), h3 = r(t, 18.9, 19.3), h4 = r(t, 21.35, 21.8, Easing.out(Easing.back(2)));
  return (<div style={{...PANEL, opacity: a * o, transform: `translateY(${(1 - a) * 40}px)`}}>
    <div style={{fontFamily: 'IBM Plex Mono', fontWeight: 500, fontSize: 38, color: INK}}>30 HARI DICOLOK</div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 10, marginTop: 18}}>
      {Array.from({length: 30}, (_, i) => { const k = r(isi, i / 30, i / 30 + 0.1); return <div key={i} style={{height: 46, borderRadius: 10, border: `4px solid ${INK}`, background: k > 0.5 ? CORAL : '#fffaf0'}} />; })}
    </div>
    <div style={{fontFamily: 'Inter', fontWeight: 700, fontSize: 40, color: INK, marginTop: 22, opacity: h1}}>0,1 W × 24 jam × 30 hari</div>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 84, color: INK, letterSpacing: -2, opacity: h2}}>≈ 0,07 kWh</div>
    <div style={{fontFamily: 'Inter', fontWeight: 700, fontSize: 38, color: INK, opacity: h3}}>× Rp1.445/kWh (nonsubsidi)</div>
    <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 96, color: GOOD, letterSpacing: -3, opacity: h4, transform: `scale(${0.8 + 0.2 * h4})`, transformOrigin: 'left'}}>≈ Rp100</div>
  </div>);
};
const Batang: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 28.4, 28.85, Easing.out(Easing.cubic)), o = 1 - r(t, 32.5, 32.8); if (a * o <= 0.01) return null;
  const b1 = r(t, 28.8, 29.6, Easing.out(Easing.cubic)), b2 = r(t, 30.0, 30.8, Easing.out(Easing.cubic)), st = r(t, 31.5, 31.9, Easing.out(Easing.back(2.2)));
  const bar = (lbl: string, v: number, k: number, c: string) => (<div style={{marginTop: 26}}>
    <div style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 44, color: INK}}>{lbl}</div>
    <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 10}}>
      <div style={{height: 70, width: `${(v / 0.43) * 62 * k}%`, borderRadius: 14, border: `5px solid ${INK}`, background: c}} />
      <div style={{fontFamily: 'Inter', fontWeight: 900, fontSize: 64, color: c, opacity: k}}>{v.toFixed(2).replace('.', ',')} W</div>
    </div></div>);
  return (<div style={{...PANEL, opacity: a * o, transform: `translateY(${(1 - a) * 40}px)`}}>
    <div style={{fontFamily: 'IBM Plex Mono', fontWeight: 500, fontSize: 34, color: INK}}>ADAPTOR TANPA BEBAN · EROPA 2020</div>
    {bar('Tanpa aturan', 0.43, b1, CORAL)}
    {bar('Dengan aturan', 0.10, b2, GOOD)}
    <div style={{fontFamily: 'Inter', fontWeight: 600, fontSize: 28, color: '#6a6a6e', marginTop: 22}}>Sumber: Komisi Eropa (Ecodesign 2019/1782)</div>
    <div style={{position: 'absolute', right: 34, top: 120, transform: `rotate(-6deg) scale(${0.6 + 0.4 * st})`, opacity: st, padding: '8px 22px', border: `8px solid ${GOOD}`, borderRadius: 18, color: GOOD, background: 'rgba(250,249,246,0.92)', fontFamily: 'Inter', fontWeight: 900, fontSize: 50}}>TURUN JAUH</div>
  </div>);
};
/** stiker label magic com (muncul saat dibalik) */
const Stiker: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 52.4, 52.9, Easing.out(Easing.back(1.6))), o = 1 - r(t, 55.0, 55.3); if (a * o <= 0.01) return null;
  const hi = r(t, 53.9, 54.3);
  return (<div style={{position: 'absolute', left: 170, right: 170, top: 760, padding: '26px 34px', borderRadius: 18, background: '#fbf8f1', border: `5px solid ${INK}`, fontFamily: 'Inter', color: INK, textAlign: 'center', opacity: a * o, transform: `scale(${0.7 + 0.3 * a}) rotate(-2deg)`, boxShadow: '0 14px 40px rgba(28,28,30,0.25)'}}>
    <div style={{fontWeight: 900, fontSize: 44}}>RICE COOKER</div>
    <div style={{fontWeight: 600, fontSize: 36, marginTop: 6}}>220V ~ 50Hz</div>
    <div style={{fontWeight: 700, fontSize: 40, marginTop: 6}}>MASAK 350 W</div>
    <div style={{display: 'inline-block', fontWeight: 900, fontSize: 64, color: CORAL, marginTop: 8, padding: '2px 18px', borderRadius: 14, outline: hi > 0.5 ? `6px solid ${CORAL}` : 'none', outlineOffset: 4}}>WARM 45 W</div>
  </div>);
};
const Hitung: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 45.0, 45.3), o = 1 - r(t, 47.5, 47.8); if (a * o <= 0.01) return null;
  const v = Math.round(r(t, 44.95, 46.7, Easing.inOut(Easing.quad)) * 23409 / 100) * 100;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 130, letterSpacing: -4, color: t > 46.7 ? CORAL : INK, opacity: a * o, textShadow: '0 4px 0 rgba(255,255,255,0.85)'}}>Rp{v.toLocaleString('id-ID')}</div>;
};

const SFX: [string, number, number][] = [
  ['pop', 1.5, 0.45], ['whoosh', 3.85, 0.3], ['ting', 4.5, 0.4], ['pop', 7.4, 0.35], ['whoosh', 13.4, 0.3], ['tick', 13.9, 0.3], ['ting', 21.4, 0.4],
  ['whoosh', 23.2, 0.3], ['thud', 25.6, 0.4], ['whoosh', 28.3, 0.3], ['ting', 31.6, 0.35], ['whoosh', 32.8, 0.3], ['ting', 36.8, 0.3],
  ['whoosh', 41.3, 0.3], ['riser', 44.95, 0.3], ['ting', 46.75, 0.45], ['whoosh', 47.8, 0.3], ['whoosh', 51.0, 0.3], ['pop', 52.5, 0.4],
  ['tick', 57.0, 0.4], ['whoosh', 58.1, 0.3], ['pop', 61.1, 0.45], ['chime', 64.4, 0.4],
];

export const Charger06Lama: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const keluarHook = r(t, 1.45, 2.2, Easing.in(Easing.cubic));
  const nTower = 225 * r(t, 44.95, 46.7, Easing.inOut(Easing.quad));
  const warm = r(t, 36.6, 36.9);
  return (
    <TemaProvider value={{accent: CORAL, cool: COOL, good: GOOD}}>
    <AbsoluteFill>
      <PaperPalet palet="langit" />

      {/* ---------- 3D: satu objek besar per adegan ---------- */}
      <Seg a={B.hook} b={B.rp} f={f} first><Canvas3D k={camAt(C_OUT, t)}><Outlet warna={WARNA} /><Charger keluar={keluarHook} t={t} /></Canvas3D></Seg>
      <Seg a={B.rp} b={B.modern} f={f}><Canvas3D k={camAt(C_RP, t)}><group rotation={[0, t * 1.2, 0]} position={[0, 0.2 - 0.6 * (1 - r(t, 4.0, 4.5, Easing.out(Easing.back(1.6)))), 0]}><Cy p={[0, 0, 0]} rad={0.95} h={0.16} c={EMAS} rot={[Math.PI / 2, 0, 0]} m={0.3} /></group></Canvas3D></Seg>
      <Seg a={B.modern} b={B.sebulan} f={f}><Canvas3D k={camAt(C_MOD, t)}><Outlet warna={WARNA} /><Charger t={t} /></Canvas3D></Seg>
      <Seg a={B.lama} b={B.aturan} f={f}><Canvas3D k={camAt(C_LAMA, t)}><Outlet warna={WARNA} /><Charger lama={r(t, 25.4, 25.7)} t={t} /></Canvas3D></Seg>
      <Seg a={B.magic} b={B.hitung} f={f}><Canvas3D k={camAt(C_MC, t)}><MagicCom warm={warm} /></Canvas3D></Seg>
      <Seg a={B.hitung} b={B.kali} f={f}><Canvas3D k={camAt(C_HIT, t)}><group position={[-1.2, MC0, 0]}><MagicCom warm={1} /></group><Keping n={nTower} x={1.7} rad={0.5} tk={TK} /></Canvas3D></Seg>
      <Seg a={B.kali} b={B.balik} f={f}><Canvas3D k={camAt(C_KALI, t)}><Keping n={1} x={-1.6} rad={0.5} tk={TK} /><Keping n={225} x={1.4} rad={0.5} tk={TK} /></Canvas3D></Seg>
      <Seg a={B.balik} b={B.aman} f={f}><Canvas3D k={camAt(C_BALIK, t)}><MagicCom warm={1 - r(t, 56.98, 57.3)} balik={r(t, 51.3, 55.4)} /></Canvas3D></Seg>
      <Seg a={B.aman} b={B.follow} f={f}><Canvas3D k={camAt(C_AMAN, t)}><Outlet warna={WARNA} /><Charger keluar={r(t, 61.05, 61.8, Easing.in(Easing.cubic))} rusak={r(t, 58.4, 58.9)} t={t} /></Canvas3D></Seg>
      <Seg a={B.follow} b={B.end} f={f}><Canvas3D k={camAt(C_END, t)}><Keping n={1} x={-2.3} rad={0.5} tk={TK} /><group position={[-0.4, MC0 * 0.7, 0]} scale={0.7}><MagicCom warm={0} /></group><Keping n={225} x={2.2} rad={0.5} tk={TK} /></Canvas3D></Seg>

      <Kicker text="FAKTA RUMAH · #06" y={292} start={0} color={CORAL} />
      <TikTokBox text="Cabut charger biar hemat?" p={r(t, 0.15, 0.8, Easing.linear)} y={338} size={40} />
      <Sebulan t={t} />
      <Batang t={t} />
      <Stiker t={t} />

      {/* ---------- judul ---------- */}
      <Title t={t} a={0.2} b={B.rp} small="Rajin nyabutin" big="CHARGER?" size={140} />
      <Title t={t} a={B.rp} b={B.modern} small="Hematnya sebulan cuma" big="± RP100" size={150} bigColor={COOL} />
      <Title t={t} a={B.modern} b={B.sebulan} small="Charger tanpa HP nyedot" big="0,1 WATT" size={140} bigColor={GOOD} />
      <Title t={t} a={B.sebulan} b={B.lama} small="Dicolok sebulan penuh" big="CUMA SEGINI" size={124} bigColor={GOOD} />
      <Title t={t} a={B.lama} b={B.aturan} small="Charger model lama" big="LEBIH BOROS" size={124} />
      <Title t={t} a={B.aturan} b={B.magic} small="Aturan efisiensi" big="ANGKA TURUN" size={124} bigColor={GOOD} />
      <Title t={t} a={B.magic} b={37.8} small="Yang makan listrik" big="MAGIC COM" size={140} />
      <Title t={t} a={37.8} b={B.hitung} small="Mode warm di label" big="40–80 WATT" size={132} />
      <Title t={t} a={B.hitung} b={44.9} small="45 watt, nyala" big="12 JAM/HARI" size={124} />
      <Title t={t} a={44.9} b={B.kali} small="Sebulan bisa" big={`± RP${(Math.round(r(t, 44.95, 46.7, Easing.inOut(Easing.quad)) * 23409 / 100) * 100).toLocaleString('id-ID')}`} size={130} />
      <Title t={t} a={B.kali} b={B.balik} small="Dibanding charger" big="> 200× LIPAT" size={124} />
      <Title t={t} a={B.balik} b={B.matikan} small="Balik magic com-mu," big="CEK LABELNYA" size={120} bigColor={COOL} />
      <Title t={t} a={B.matikan} b={B.aman} small="Nasi habis siang?" big="MATIKAN" size={150} bigColor={GOOD} />
      <Title t={t} a={B.aman} b={B.follow} small="Kabel panas atau rusak?" big="TETAP CABUT" size={124} />

      {/* ---------- stiker ---------- */}
      <Chip x={540} y={1230} p={r(t, 9.4, 9.8) * (1 - r(t, 12.9, 13.2))} text="nggak ngisi apa-apa" color={INK} size={46} />
      <Chip x={540} y={1230} p={r(t, 36.8, 37.2) * (1 - r(t, 41.0, 41.3))} text="lampu warm nyala" color={CORAL} size={46} />
      <Chip x={800} y={1270} p={r(t, 45.2, 45.6) * (1 - r(t, 47.4, 47.7))} text="1 keping = Rp104" color={INK} size={46} />
      <Chip x={270} y={1265} p={r(t, 48.3, 48.7) * (1 - r(t, 50.7, 51.0))} text="charger" color={GOOD} size={46} />
      <Chip x={790} y={1265} p={r(t, 48.6, 49.0) * (1 - r(t, 50.7, 51.0))} text="magic com" color={CORAL} size={46} />
      <Chip x={540} y={1230} p={r(t, 61.6, 62.0) * (1 - r(t, 63.8, 64.1))} text="demi keamanan" color={CORAL} size={46} />
      <CommentBubble word="kamu tim cabut?" start={Math.round(64.3 * FPS)} y={470} out={Math.round(67.0 * FPS)} />
      <FollowButton start={Math.round(64.6 * FPS)} click={Math.round(65.8 * FPS)} y={1250} />
      <Captions ms={t * 1000} words={WORDS} />
      <Grain o={0.05} id="g06l" />

      <Audio src={staticFile('e1-06/vo.wav')} />
      <Audio src={staticFile('sfx/ambient.wav')} volume={0.1} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
    </AbsoluteFill>
    </TemaProvider>
  );
};
