// Video #15 "LED Nggak Lebih Terang, Tapi Hemat": DNA video 8–13, kamera 2,5D ortografis (sudut tetap; geser/zoom saja).
// VO Gemini TTS (Achernar), timestamp public/v15/words.json (tools/align_teks.py). Naskah: naskah/video-15-led-lebih-terang.md
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Grain, TikTokBox, PatternBreak, C} from '../aset/Aset';
import {Kicker, Ornament, FollowButton} from '../aset/Gabung';
import {PaperPalet, PALET, type PaletName} from '../aset/PaperPalet';
import {Env} from '../pengetahuan/Scene';
import {P13, Rig, Base} from '../v13/Mood13';
import {P14, Incandescent, LedLamp} from './Lamp15';
import words from '../../public/v15/words.json';

export const FPS = 30;
export const V15_END = 67.0;
export const V15_FRAMES = Math.ceil(V15_END * FPS);
const CC_TOP = 1400, INK = C.ink;
// peran warna (diisi per render dari palet; krem = warna asli yang sudah di-ACC)
const R = {ink: C.ink as string, sub: C.sub as string, acc: P13.coral as string, led: P14.elec as string, ledT: P14.elec as string, cool: P14.elec as string, coolT: P14.elec as string};
const setRoles = (palet: PaletName) => {
  if (palet === 'krem') { Object.assign(R, {ink: C.ink, sub: C.sub, acc: P13.coral, led: P14.elec, ledT: P14.elec, cool: P14.elec, coolT: P14.elec}); return; }
  const p = PALET[palet]; Object.assign(R, {ink: p.terang ? C.ink : '#e8eefc', sub: p.terang ? C.sub : '#aab6d6', acc: p.accentTeks, led: p.good, ledT: p.goodTeks, cool: p.cool, coolT: p.coolTeks});
};
const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ---------- beat (detik dari words.json) ----------
const B = {hook: 0, tujuh: 2.9, kok: 4.7, bantah: 6.4, biasa: 15.1, panas: 19.4, pegang: 24.4, led: 31.5, angka: 39.9, payoff: 47.6, aksi: 51.8, tanya: 60.1, follow: 64.7, end: V15_END};

// ---------- subtitle ----------
const caps: Caption[] = (words as {words: {word: string; start: number; end: number}[]}).words.map((w, i) => ({text: (i ? ' ' : '') + w.word, startMs: w.start * 1000, endMs: w.end * 1000, timestampMs: w.start * 1000, confidence: 1}));
const {pages} = createTikTokStyleCaptions({captions: caps, combineTokensWithinMilliseconds: 950});
const Captions: React.FC<{ms: number}> = ({ms}) => {
  const pg = pages.find((p, i) => ms >= p.startMs && ms < (pages[i + 1]?.startMs ?? p.startMs + p.durationMs + 400));
  if (!pg) return null;
  const k = r(ms / 1000, pg.startMs / 1000, pg.startMs / 1000 + 0.15);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: CC_TOP, textAlign: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: 60, letterSpacing: -0.8, lineHeight: 1.15, color: INK, opacity: k, transform: `translateY(${(1 - k) * 10}px)`}}>
      <span style={{display: 'inline-block', padding: '12px 28px 16px', borderRadius: 22, background: 'rgba(250,249,246,0.95)', boxShadow: '0 10px 30px rgba(28,28,30,0.18)'}}>
        {pg.tokens.map((tk, i) => <span key={i} style={{color: ms >= tk.fromMs && ms < tk.toMs + 120 ? R.acc : INK}}>{tk.text}</span>)}
      </span>
    </div>
  );
};

// ---------- teks layar ----------
const Title: React.FC<{t: number; a: number; b: number; small: string; big: string; bigAt?: number; color?: string; size?: number; top?: number}> = ({t, a, b, small, big, bigAt, color = R.acc, size = 104, top = 450}) => {
  const i = r(t, a, a + 0.45, Easing.out(Easing.cubic)), o = 1 - r(t, b - 0.3, b), j = bigAt === undefined ? 1 : r(t, bigAt, bigAt + 0.35, Easing.out(Easing.back(2)));
  if (i * o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 60, top, maxWidth: 960, padding: '20px 30px 24px', borderRadius: 26, background: 'rgba(250,249,246,0.95)', boxShadow: '0 12px 40px rgba(28,28,30,0.18)', fontFamily: 'Inter', color: INK, opacity: i * o, transform: `translateY(${(1 - i) * 26}px)`}}>
      <div style={{fontSize: 50, fontWeight: 700, letterSpacing: -1}}>{small}</div>
      <div style={{whiteSpace: 'nowrap', fontSize: size, fontWeight: 900, letterSpacing: -2, lineHeight: 1.0, color, marginTop: 6, opacity: j, transform: `scale(${0.85 + 0.15 * j})`, transformOrigin: 'left center'}}>{big}</div>
    </div>
  );
};
const Chip: React.FC<{x: number; y: number; p: number; text: string; color?: string; size?: number}> = ({x, y, p, text, color = INK, size = 40}) => {
  if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * p})`, opacity: p, padding: '10px 22px', borderRadius: 16, background: 'rgba(250,249,246,0.97)', border: `4px solid ${color}`, fontFamily: 'Inter', fontWeight: 800, fontSize: size, color, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(28,28,30,0.18)'}}>{text}</div>;
};
const Ring2D: React.FC<{x: number; y: number; s: number; p: number}> = ({x, y, s, p}) => p > 0 ? <div style={{position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: '50%', border: `8px solid ${R.acc}`, opacity: p, transform: `scale(${1.4 - 0.4 * p})`}} /> : null;

// ---------- panggung 3D 2,5D ----------
type Cam = [number, number, number];
const camAt = (t: number, keys: [number, Cam][]): Cam => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) { const [ta, a] = keys[i], [tb, b] = keys[i + 1]; if (t <= tb) { const k = ease((t - ta) / (tb - ta)); return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; } }
  return keys[keys.length - 1][1];
};
const Stage: React.FC<{cam: Cam; children: React.ReactNode}> = ({cam, children}) => (
  <ThreeCanvas width={1080} height={1920} shadows orthographic camera={{position: [0, 4, 30], zoom: 200, near: 0.1, far: 100}} gl={{alpha: true, antialias: true}}>
    <Rig x={cam[0]} y={cam[1]} zoom={cam[2]} />
    <Env intensity={0.35} /><hemisphereLight args={['#fffaf0', '#cfc6b4', 0.6]} />
    <directionalLight position={[2.5, 4.5, 3.0]} intensity={2.2} color="#fff4e6" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-radius={6} shadow-bias={-0.0004} />
    <directionalLight position={[-3, 1.5, 2]} intensity={0.35} color="#ffe2da" />
    {children}
  </ThreeCanvas>
);
const Seg: React.FC<{a: number; b: number; children: React.ReactNode}> = ({a, b, children}) => {
  const fa = Math.round(a * FPS), fb = Math.round(b * FPS);
  return <Sequence from={fa} durationInFrames={fb - fa} layout="none">{children}</Sequence>;
};

// ---------- adegan ----------
// dua lampu bersebelahan: kiri pijar, kanan LED; keduanya menyala sama terang
const Pair: React.FC<{t: number; a: number; cam: Cam}> = ({t, a, cam}) => {
  const g = r(t, a + 0.2, a + 0.8);
  return (
    <Stage cam={cam}>
      <Base w={4.6} />
      <Incandescent x={-0.95} glow={g} />
      <LedLamp x={0.95} glow={g} cut />
    </Stage>
  );
};

// uap panas: garis koral bergelombang naik
const Heat: React.FC<{t: number; cx: number; y: number; k: number; col?: string; lines?: number}> = ({t, cx, y, k, col = R.acc, lines = 5}) => k <= 0.01 ? null : (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    {Array.from({length: lines}, (_, i) => {
      const x0 = cx + (i - (lines - 1) / 2) * 46;
      const pts = Array.from({length: 11}, (_, j) => `${j ? 'L' : 'M'}${x0 + Math.sin(j / 2 + t * 5 + i * 1.7) * 14 * k} ${y - j * 20}`).join(' ');
      return <path key={i} d={pts} stroke={col} strokeWidth={8} fill="none" strokeLinecap="round" opacity={k * (0.35 + 0.4 * ((i + 1) % 2))} />;
    })}
  </svg>
);

// kartu LUMEN vs WATT (setelah pemutus pola)
const LumenWatt: React.FC<{t: number}> = ({t}) => {
  const card = (x: number, p: number, title: string, sub: string, col: string, icon: React.ReactNode) => p > 0 && (
    <div style={{position: 'absolute', left: x, top: 660, width: 400, height: 580, borderRadius: 34, background: 'rgba(250,249,246,0.98)', boxShadow: '0 16px 50px rgba(28,28,30,0.2)', opacity: p, transform: `translateY(${(1 - p) * 40}px)`, fontFamily: 'Inter', textAlign: 'center'}}>
      <svg width={400} height={340} viewBox="0 0 440 360">{icon}</svg>
      <div style={{fontWeight: 900, fontSize: 72, color: col, letterSpacing: -2}}>{title}</div>
      <div style={{fontWeight: 700, fontSize: 34, color: INK, marginTop: 6}}>{sub}</div>
    </div>
  );
  const sun = <g transform="translate(220 180)"><circle r={78} fill={P14.yellow} stroke={INK} strokeWidth={8} />{Array.from({length: 12}, (_, i) => { const a = (i / 12) * Math.PI * 2; return <line key={i} x1={Math.cos(a) * 104} y1={Math.sin(a) * 104} x2={Math.cos(a) * 140} y2={Math.sin(a) * 140} stroke={INK} strokeWidth={9} strokeLinecap="round" />; })}</g>;
  const gauge = <g transform="translate(220 200)"><path d="M-130 0 A130 130 0 0 1 130 0" fill="none" stroke={INK} strokeWidth={18} strokeLinecap="round" /><path d="M-130 0 A130 130 0 0 1 60 -115" fill="none" stroke={R.cool} strokeWidth={18} strokeLinecap="round" /><line x1={0} y1={0} x2={70} y2={-95} stroke={R.acc} strokeWidth={12} strokeLinecap="round" /><circle r={16} fill={INK} /><rect x={-60} y={44} width={120} height={46} rx={14} fill={INK} /></g>;
  return <AbsoluteFill>{card(60, r(t, 10.9, 11.4), 'LUMEN', 'seberapa terang', '#b8860b', sun)}{card(480, r(t, 11.8, 12.3), 'WATT', 'listrik yang disedot', R.coolT, gauge)}</AbsoluteFill>;
};

// sepuluh kotak "listrik": sembilan jadi panas (koral), satu jadi cahaya (kuning)
const Boxes: React.FC<{t: number}> = ({t}) => {
  const size = 66, gap = 14, x0 = (1080 - (10 * size + 9 * gap)) / 2, y0 = 1215;
  const hot = r(t, 20.9, 21.7), light = r(t, 22.7, 23.3);
  return (
    <AbsoluteFill>
      {Array.from({length: 10}, (_, i) => {
        const p = r(t, 19.6 + i * 0.09, 19.9 + i * 0.09, Easing.out(Easing.back(2)));
        if (p <= 0) return null;
        const isLight = i === 9, wob = isLight ? 0 : hot * Math.sin(t * 14 + i) * 5, rise = isLight ? 0 : hot * (14 + (i % 3) * 8);
        return (
          <div key={i} style={{position: 'absolute', left: x0 + i * (size + gap), top: y0 - rise + wob, width: size, height: size, borderRadius: 14, transform: `scale(${p * (isLight ? 1 + 0.28 * light : 1)})`, background: isLight ? (light > 0 ? P14.yellow : R.cool) : R.cool, border: `5px solid ${INK}`, boxShadow: isLight && light > 0 ? `0 0 ${50 * light}px ${P14.glow}` : '6px 6px 0 rgba(28,28,30,0.15)'}}>
            {!isLight && <div style={{position: 'absolute', inset: 0, borderRadius: 9, background: R.acc, opacity: hot}} />}
          </div>
        );
      })}
      <Chip x={440} y={1340} p={r(t, 21.7, 22.1)} text="9 jadi panas (perkiraan)" color={R.acc} size={34} />
      <Chip x={895} y={1340} p={r(t, 23.2, 23.6)} text="1 jadi cahaya" color="#b8860b" size={34} />
    </AbsoluteFill>
  );
};

// tangan kertas: menyentuh lampu lalu menarik diri karena panas
const Hand: React.FC<{t: number}> = ({t}) => {
  const come = r(t, 24.8, 26.4), recoil = r(t, 27.5, 27.9, Easing.out(Easing.cubic));
  const x = lerp(1120, 770, come) + recoil * 280, shake = t > 27.5 && t < 28.6 ? Math.sin(t * 60) * 5 : 0;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <g transform={`translate(${x + shake} 980)`}>
        <rect x={0} y={-60} width={170} height={120} rx={36} fill="#f1c9a5" stroke={INK} strokeWidth={6} />
        {[-50, -18, 14, 46].map((y, i) => <rect key={i} x={-70 + (i % 2) * 14} y={y - 14} width={110} height={30} rx={15} fill="#f1c9a5" stroke={INK} strokeWidth={6} />)}
        <rect x={150} y={-34} width={150} height={68} rx={30} fill="#e9b88f" stroke={INK} strokeWidth={6} />
      </g>
    </svg>
  );
};

// batang lumen per watt: pijar (±15) vs LED (80+)
const Bars: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 40.2, 41.6), b = r(t, 43.3, 45.0);
  const bar = (x: number, v: number, k: number, num: string, label: string, col: string) => (
    <div key={x}>
      <div style={{position: 'absolute', left: x - 120, top: 1250 - v * 6.2 * k, width: 240, height: v * 6.2 * k, background: col, borderRadius: '18px 18px 0 0', border: `5px solid ${INK}`, boxShadow: '12px 12px 0 rgba(28,28,30,0.15)'}} />
      <div style={{position: 'absolute', left: x - 170, width: 340, top: 1250 - v * 6.2 * k - 110, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 92, color: col === P14.yellow ? '#b8860b' : col, opacity: k}}>{num}</div>
      <div style={{position: 'absolute', left: x - 170, width: 340, top: 1265, textAlign: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: 36, color: R.ink}}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      {bar(330, 15, a, '±15', 'lampu biasa', R.acc)}
      {bar(750, 83, b, '80+', 'lampu LED', R.led)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1320, textAlign: 'center', fontFamily: 'Space Mono, monospace', fontSize: 28, color: R.sub, opacity: b}}>lumen per watt (perkiraan, angka EIA)</div>
    </AbsoluteFill>
  );
};

// dus lampu kertas: "1100 LUMEN = lampu biasa 75 W"
const Dus: React.FC<{t: number}> = ({t}) => {
  const p = r(t, 51.9, 52.6, Easing.out(Easing.back(1.6))), n = r(t, 54.9, 55.5), eq = r(t, 56.8, 57.5, Easing.out(Easing.back(2))), point = r(t, 53.2, 53.8);
  if (p <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 130, top: 720, width: 740, height: 620, transform: `scale(${0.85 + 0.15 * p})`, opacity: p, transformOrigin: '50% 50%'}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 30, background: '#fbf3dd', border: `8px solid ${INK}`, boxShadow: '16px 16px 0 rgba(28,28,30,0.18)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 120, borderRadius: '22px 22px 0 0', background: R.led, borderBottom: `8px solid ${INK}`, fontFamily: 'Inter', fontWeight: 900, fontSize: 56, color: '#fff', textAlign: 'center', lineHeight: '120px'}}>LAMPU LED</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 160, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 190, letterSpacing: -6, color: INK, opacity: n}}>1100</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 110, color: '#b8860b'}}>LUMEN</div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 520, textAlign: 'center', fontFamily: 'Inter', fontWeight: 800, fontSize: 48, color: INK, padding: '10px 0', borderRadius: 18, background: '#fff', border: `5px solid ${R.acc}`, opacity: eq, transform: `scale(${0.8 + 0.2 * eq})`}}>≈ lampu biasa 75 W</div>
      <svg width={780} height={640} style={{position: 'absolute', inset: 0, opacity: point * (1 - r(t, 54.9, 55.3))}}>
        <g transform={`translate(${470 + (1 - point) * 160} 470)`}><rect x={0} y={-24} width={140} height={48} rx={24} fill="#f1c9a5" stroke={INK} strokeWidth={6} /><rect x={-90} y={-12} width={110} height={26} rx={13} fill="#f1c9a5" stroke={INK} strokeWidth={6} /></g>
      </svg>
    </div>
  );
};

// ---------- SFX (dibaca juga oleh tools/mix-audio.mjs) ----------
const SFX: [string, number, number][] = [
  ['tick', 0.7, 0.35], ['tick', 2.9, 0.3], ['tick', 3.5, 0.35], ['pop', 4.7, 0.35],
  ['whoosh', 6.4, 0.3], ['thud', 6.55, 0.5], ['pop', 10.9, 0.4], ['pop', 11.8, 0.4],
  ['whoosh', 15.1, 0.3], ['buzz', 16.8, 0.25], ['riser', 17.4, 0.25],
  ['tick', 19.6, 0.3], ['tick', 19.7, 0.3], ['tick', 19.8, 0.3], ['tick', 19.9, 0.3], ['tick', 20.0, 0.3], ['tick', 20.1, 0.3], ['tick', 20.2, 0.3], ['tick', 20.3, 0.3], ['tick', 20.4, 0.3], ['tick', 20.5, 0.3],
  ['crackle', 20.9, 0.5], ['ting', 22.7, 0.45],
  ['whoosh', 24.4, 0.3], ['pop', 24.8, 0.35], ['pop', 26.1, 0.3], ['thud', 27.5, 0.45], ['pop', 29.8, 0.3],
  ['whoosh', 31.5, 0.3], ['chime', 33.9, 0.4], ['pop', 34.2, 0.35], ['pop', 35.0, 0.3],
  ['whoosh', 39.9, 0.3], ['tick', 40.2, 0.35], ['tick', 43.3, 0.35], ['pop', 46.3, 0.45],
  ['whoosh', 47.6, 0.3], ['chime', 47.9, 0.4],
  ['whoosh', 51.8, 0.3], ['pop', 53.2, 0.4], ['pop', 54.9, 0.4], ['chime', 56.8, 0.4],
  ['whoosh', 60.1, 0.3], ['pop', 61.2, 0.4], ['pop', 62.4, 0.4], ['chime', 64.9, 0.4], ['chime', 65.7, 0.4],
];

export const Video15: React.FC<{palet?: PaletName}> = ({palet = 'krem'}) => {
  setRoles(palet);
  const gelap = !PALET[palet].terang;
  const f = useCurrentFrame(), t = f / FPS, ms = t * 1000;
  const inPB = t >= B.bantah && t < 10.9;
  return (
    <AbsoluteFill>
      <PaperPalet palet={palet} />

      {/* A. hook: dua lampu sama terang, 75 W vs 9 W */}
      <Seg a={0} b={B.bantah}>
        <Pair t={t} a={0} cam={camAt(t, [[0, [0, 0.95, 270]], [5.8, [0, 0.95, 295]]])} />
        <Chip x={264} y={1310} p={r(t, 3.2, 3.6)} text="75 W" color={R.acc} size={54} />
        <Chip x={816} y={1310} p={r(t, 3.6, 4.0)} text="9 W" color={R.ledT} size={54} />
      </Seg>
      {/* B. bantah: LED sebenarnya nggak lebih terang; lumen vs watt */}
      <Seg a={10.9} b={B.biasa}><LumenWatt t={t} /></Seg>
      {/* C. lampu biasa: kawat membara, 9 dari 10 listrik jadi panas */}
      <Seg a={B.biasa} b={B.pegang}>
        <Stage cam={camAt(t, [[15.1, [0, 0.95, 225]], [18.4, [0, 0.95, 240]], [24.4, [0, 0.95, 240]]])}>
          <Base w={3.2} />
          <Incandescent glow={r(t, 16.6, 18.4)} cut />
        </Stage>
        <Heat t={t} cx={540} y={832} k={r(t, 18.2, 19.6) * 0.85} />
        <Boxes t={t} />
      </Seg>
      {/* D. pegang lampu yang baru dimatiin: panas */}
      <Seg a={B.pegang} b={B.led}>
        <Stage cam={camAt(t, [[24.4, [0.35, 0.95, 250]], [31.5, [0.35, 0.95, 260]]])}>
          <Base w={3.2} />
          <Incandescent glow={1 - r(t, 26.0, 26.6)} />
        </Stage>
        <Heat t={t} cx={450} y={805} k={0.7 * r(t, 26.3, 27.2)} lines={4} />
        <Hand t={t} />
        <Chip x={780} y={800} p={r(t, 27.5, 27.9) * (1 - r(t, 30.8, 31.2))} text="PANAS!" color={R.acc} size={60} />
      </Seg>
      {/* E. LED: cahaya langsung dari chip, panas jauh lebih sedikit */}
      <Seg a={B.led} b={B.angka}>
        <Stage cam={camAt(t, [[31.5, [0, 0.95, 260]], [33.4, [0, 0.95, 260]], [34.5, [0, 0.82, 420]], [37.0, [0, 0.82, 420]], [38.6, [0, 0.95, 260]]])}>
          <Base w={3.2} />
          <LedLamp glow={r(t, 31.6, 32.1)} cut chipPulse={0.5 + 0.5 * Math.sin(t * 6)} />
        </Stage>
        <Chip x={540} y={1090} p={r(t, 34.2, 34.7) * (1 - r(t, 34.9, 35.3))} text="chip kecil" color={R.ledT} />
        <Chip x={540} y={1090} p={r(t, 35.0, 35.5) * (1 - r(t, 37.0, 37.4))} text="nggak perlu membara" color={R.ledT} />
        <Heat t={t} cx={540} y={850} k={0.28 * r(t, 37.5, 38.3)} lines={3} />
      </Seg>
      {/* F. angka lumen per watt */}
      <Seg a={B.angka} b={B.payoff}><Bars t={t} /></Seg>
      {/* G. payoff: dua lampu lagi, sama terang */}
      <Seg a={B.payoff} b={B.aksi}>
        <Pair t={t} a={B.payoff} cam={[0, 0.95, 290]} />
        <Chip x={264} y={1310} p={r(t, 48.4, 48.8)} text="75 W" color={R.acc} size={54} />
        <Chip x={816} y={1310} p={r(t, 49.5, 49.9)} text="9 W" color={R.ledT} size={54} />
      </Seg>
      {/* H. aksi: dus lampu, cek angka lumen */}
      <Seg a={B.aksi} b={B.tanya}><Dus t={t} /></Seg>
      {/* I. tanya + follow */}
      <Seg a={B.tanya} b={B.end}>
        <Pair t={t} a={B.tanya} cam={[0, 0.95, 290]} />
        <Chip x={264} y={1310} p={r(t, 61.2, 61.6) * (1 - r(t, 64.5, 64.9))} text="LED SEMUA" color={R.ledT} size={50} />
        <Chip x={700} y={1310} p={r(t, 62.4, 62.8) * (1 - r(t, 64.5, 64.9))} text="MASIH PANAS" color={R.acc} size={42} />
      </Seg>

      {/* teks layar (judul dua tingkat) */}
      <Title t={t} a={0.3} b={B.bantah} small="Lampu 9 watt =" big="LAMPU 75 WATT?" bigAt={3.2} size={96} />
      <Title t={t} a={10.9} b={B.biasa} small="Terang itu diukur" big="PAKAI LUMEN" bigAt={10.9} color="#b8860b" top={450} size={110} />
      <Title t={t} a={B.biasa} b={B.panas} small="Kawat dipanaskan" big="SAMPAI MEMBARA" bigAt={18.0} size={96} />
      <Title t={t} a={B.panas} b={B.pegang} small="9 dari 10 listrik jadi" big="PANAS" bigAt={21.4} size={130} />
      <Title t={t} a={B.pegang} b={B.led} small="Dibayar, tapi" big="NGGAK JADI TERANG" bigAt={29.8} size={84} />
      <Title t={t} a={B.led} b={B.angka} small="Cahaya langsung" big="DARI CHIP" bigAt={33.9} color={R.ledT} size={120} />
      <Title t={t} a={B.angka} b={B.payoff} small="Lumen per watt" big="±5× LEBIH HEMAT" bigAt={46.3} color={R.ledT} size={92} />
      <Title t={t} a={B.payoff} b={B.aksi} small="Seterang, tapi listriknya" big="JAUH LEBIH SEDIKIT" bigAt={49.5} color={R.ledT} size={80} />
      <Title t={t} a={B.aksi} b={B.tanya} small="Cek angka" big="LUMEN DI DUS" bigAt={53.5} color="#b8860b" size={110} />
      <Title t={t} a={B.tanya} b={B.follow} small="Rumahmu sudah" big="LED SEMUA?" bigAt={61.2} size={120} />

      {/* bantah: pemutus pola */}
      {inPB && <PatternBreak lines={['LED NGGAK', 'LEBIH TERANG']} sub={t > 9.5 ? 'terang = lumen' : undefined} p={r(t, B.bantah, B.bantah + 0.6)} />}

      {!inPB && <><Kicker text="FAKTA RUMAH · #15" y={292} start={0} color={gelap ? PALET[palet].accent : undefined} /><TikTokBox text="Lampu LED lebih terang?" p={r(t, 0.2, 1.0, Easing.linear)} y={338} size={40} /></>}
      {!inPB && <div style={{filter: gelap ? 'invert(1)' : 'none'}}><Ornament cx={1030} cy={150} size={360} start={0} /><Ornament cx={40} cy={1800} size={360} start={6} /></div>}
      <FollowButton start={Math.round(B.follow * FPS)} click={Math.round((B.follow + 1.0) * FPS)} y={760} />
      {!inPB && <Captions ms={ms} />}

      <Audio src={staticFile('v15/vo.mp3')} />
      <Audio src={staticFile('sfx/ambient.wav')} volume={0.08} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
      <Grain o={0.08} />
    </AbsoluteFill>
  );
};
