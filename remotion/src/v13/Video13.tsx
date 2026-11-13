// Video #13 "Kaca Pecah Gara-Gara Sound Horeg?" DNA video 8–10 + kamera 2,5D (ortografis, sudut tetap; geser/zoom saja).
// VO Gemini TTS (Achernar), timestamp public/v13/words.json (tools/align_teks.py). Naskah: naskah/video-13-kaca-sound-horeg.md
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Grain, TikTokBox, PatternBreak, C} from '../aset/Aset';
import {PaperPlus, Kicker, Ornament, FollowButton} from '../aset/Gabung';
import {Env} from '../pengetahuan/Scene';
import {P13, Window, House, Truck, Rings, Rig, Base} from './Mood13';
import words from '../../public/v13/words.json';

export const FPS = 30;
export const V13_END = 74.2;
export const V13_FRAMES = Math.ceil(V13_END * FPS);
const CC_TOP = 1400, CORAL = P13.coral, INK = C.ink;
const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ---------- beat (detik dari words.json) ----------
const B = {hook: 0, pecah: 3.1, utuh: 4.8, sama: 6.4, mitos: 9.0, angka: 13.6, bass: 21.3, ayun: 31.6, gompal: 42.4, payoff: 49.3, aksi: 55.9, tanya: 67.0, follow: 71.6, end: V13_END};
const BEAT = 0.5; // dentuman bass tiap 0,5 dtk (penyederhanaan visual)
const thump = (t: number, from: number) => (t < from ? 0 : Math.exp(-((t - from) % BEAT) * 9));

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
        {pg.tokens.map((tk, i) => <span key={i} style={{color: ms >= tk.fromMs && ms < tk.toMs + 120 ? CORAL : INK}}>{tk.text}</span>)}
      </span>
    </div>
  );
};

// ---------- teks layar ----------
const Title: React.FC<{t: number; a: number; b: number; small: string; big: string; bigAt?: number; color?: string; size?: number; top?: number}> = ({t, a, b, small, big, bigAt, color = CORAL, size = 104, top = 450}) => {
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
const Ring2D: React.FC<{x: number; y: number; s: number; p: number}> = ({x, y, s, p}) => p > 0 ? <div style={{position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: '50%', border: `8px solid ${CORAL}`, opacity: p, transform: `scale(${1.4 - 0.4 * p})`}} /> : null;

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
const Street: React.FC<{t: number; truck?: boolean; crackK: number; cam: Cam; shake?: number}> = ({t, truck = true, crackK, cam, shake = 0}) => {
  const tx = interpolate(t, [0, 2.6], [-3.6, -1.3], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const th = thump(t, 1.0), flexN = 0.05 * th * (crackK < 1 ? 1 : 0.3);
  return (
    <Stage cam={[cam[0] + shake * Math.sin(t * 80) * 0.01, cam[1], cam[2]]}>
      <Base w={5.6} />
      <House x={-0.85} wall={P13.wallB} roof={P13.roofB} crack={crackK} chip flex={flexN} />
      <House x={0.85} wall={P13.wallA} roof={P13.roofA} flex={0.02 * th} />
      {truck && <group position={[tx, 0, 1.1]} scale={0.6}><group position={[0, 0.02 * th, 0]}><Truck x={0} /></group></group>}
      {truck && t > 1.0 && <group scale={1 + 0.15 * (1 - th)}><Rings x={tx - 0.15} y={0.6} z={2.0} n={3} r0={0.45 + 0.15 * (1 - th)} /></group>}
    </Stage>
  );
};

const Bars: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 15.2, 16.7), b = r(t, 19.6, 20.6), ln = r(t, 17.6, 18.3);
  const bar = (x: number, v: number, k: number, label: string, col: string) => (
    <div key={x}>
      <div style={{position: 'absolute', left: x - 110, top: 1300 - (v - 90) * 9 * k, width: 220, height: (v - 90) * 9 * k, background: col, borderRadius: '18px 18px 0 0', boxShadow: '12px 12px 0 rgba(28,28,30,0.15)'}} />
      <div style={{position: 'absolute', left: x - 160, width: 320, top: 1300 - (v - 90) * 9 * k - 110, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 92, color: col, opacity: k}}>{Math.round(90 + (v - 90) * k)}<span style={{fontSize: 44}}> dB</span></div>
      <div style={{position: 'absolute', left: x - 160, width: 320, top: 1315, textAlign: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: 36, color: INK}}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      {bar(330, 135, a, 'sound horeg', CORAL)}
      {bar(750, 150, b, 'kaca utuh pecah', P13.wallA)}
      <div style={{position: 'absolute', left: 120, width: 840 * ln, top: 1300 - 60 * 9, borderTop: '5px dashed #1c1c1e'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1365, textAlign: 'center', fontFamily: 'Space Mono, monospace', fontSize: 30, color: C.sub, opacity: b}}>(perkiraan, data ledakan)</div>
    </AbsoluteFill>
  );
};

const Waves: React.FC<{t: number}> = ({t}) => {
  const ws = [{y: 1250, col: P13.wallA, l: 'getar kaca', at: 25.2}, {y: 1340, col: CORAL, l: 'getar bass', at: 29.4}];
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {ws.map((w) => {
        const k = r(t, w.at, w.at + 0.8), n = Math.floor(61 * k);
        if (n < 2) return null;
        return (
          <g key={w.y}>
            <path d={Array.from({length: n}, (_, i) => `${i ? 'L' : 'M'}${150 + i * 13} ${w.y + Math.sin(i / 4 - t * 6) * 30}`).join(' ')} stroke={w.col} strokeWidth={9} fill="none" strokeLinecap="round" />
            <text x={150} y={w.y - 44} fontFamily="Inter" fontWeight={800} fontSize={34} fill={w.col} opacity={k}>{w.l}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ayunan anak (inset 2D, analogi)
const Swing: React.FC<{t: number; p: number}> = ({t, p}) => {
  if (p <= 0) return null;
  const amp = interpolate(t, [38.3, 42.0], [8, 34], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), ang = amp * Math.sin((t - 38.3) * 3.2);
  return (
    <div style={{position: 'absolute', left: 640, top: 840, width: 360, height: 360, borderRadius: 30, background: 'rgba(250,249,246,0.97)', boxShadow: '0 12px 40px rgba(28,28,30,0.18)', opacity: p, transform: `scale(${0.8 + 0.2 * p})`}}>
      <svg width={360} height={360}>
        <line x1={40} y1={40} x2={320} y2={40} stroke={INK} strokeWidth={10} strokeLinecap="round" />
        <g transform={`rotate(${ang} 180 40)`}>
          <line x1={150} y1={40} x2={150} y2={250} stroke={INK} strokeWidth={5} /><line x1={210} y1={40} x2={210} y2={250} stroke={INK} strokeWidth={5} />
          <rect x={135} y={248} width={90} height={14} rx={6} fill={CORAL} />
          <circle cx={180} cy={205} r={22} fill={P13.wallA} /><rect x={165} y={226} width={30} height={26} rx={8} fill={P13.wallA} />
        </g>
      </svg>
    </div>
  );
};

const CheckRow: React.FC<{y: number; text: string; p: number; tick: number}> = ({y, text, p, tick}) => p > 0 ? (
  <div style={{position: 'absolute', left: 120, top: y, display: 'flex', alignItems: 'center', gap: 24, padding: '14px 28px', borderRadius: 22, background: 'rgba(250,249,246,0.97)', boxShadow: '0 10px 26px rgba(28,28,30,0.18)', opacity: p, transform: `translateX(${(1 - p) * -40}px)`, fontFamily: 'Inter', fontWeight: 800, fontSize: 52, color: INK}}>
    <div style={{width: 64, height: 64, borderRadius: 14, border: `6px solid ${INK}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: CORAL, fontSize: 56}}>{tick > 0 ? '✓' : ''}</div>{text}
  </div>
) : null;

// ---------- SFX (dibaca juga oleh tools/mix-audio.mjs) ----------
const SFX: [string, number, number][] = [
  ['engine', 0.1, 0.45], ['bass', 1.0, 0.7], ['bass', 1.5, 0.7], ['bass', 2.0, 0.7], ['bass', 2.5, 0.7], ['bass', 3.0, 0.7], ['crackle', 3.9, 0.7], ['whoosh', 4.75, 0.3], ['whoosh', 6.35, 0.25],
  ['whoosh', 9.0, 0.35], ['thud', 9.4, 0.5], ['whoosh', 13.55, 0.25], ['tick', 15.3, 0.35], ['tick', 19.7, 0.35], ['pop', 20.4, 0.4],
  ['whoosh', 21.3, 0.3], ['riser', 25.2, 0.25], ['ting', 30.9, 0.4],
  ['whoosh', 31.55, 0.25], ['bass', 32.9, 0.5], ['bass', 33.9, 0.55], ['bass', 34.9, 0.6], ['bass', 35.9, 0.65], ['bass', 36.9, 0.7], ['whoosh', 38.3, 0.25],
  ['whoosh', 42.4, 0.3], ['pop', 45.0, 0.45], ['crackle', 47.5, 0.7], ['chime', 49.5, 0.4], ['pop', 53.4, 0.45],
  ['whoosh', 55.9, 0.3], ['pop', 59.3, 0.4], ['pop', 59.9, 0.4], ['pop', 64.1, 0.4], ['whoosh', 67.0, 0.3], ['pop', 68.4, 0.4], ['chime', 71.8, 0.4],
];

export const Video13: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS, ms = t * 1000;
  const inPB = t >= B.mitos && t < B.angka;
  return (
    <AbsoluteFill>
      <PaperPlus />

      {/* A. hook: jalan, truk, kaca tetangga retak */}
      <Seg a={0} b={B.mitos}><Street t={t} crackK={r(t, 3.6, 4.4, Easing.out(Easing.quad))} cam={camAt(t, [[0, [0, 1.55, 235]], [3.1, [0, 1.55, 245]], [3.8, [-0.85, 0.8, 380]], [4.6, [-0.85, 0.8, 390]], [5.4, [0.85, 0.75, 430]], [6.4, [0.85, 0.75, 440]], [7.2, [0, 1.5, 255]], [9, [0, 1.5, 262]]])} shake={t > 3.6 && t < 4.4 ? 1 : 0} /></Seg>
      {/* C. angka */}
      <Seg a={B.angka} b={B.bass}><Bars t={t} /></Seg>
      {/* D+E. kaca close-up: getar alami → resonansi */}
      <Seg a={B.bass} b={B.gompal}>
        <Stage cam={camAt(t, [[21.3, [0, 0.1, 380]], [25, [0, 0.1, 470]], [31.6, [0, 0.2, 480]], [38, [0, 0.3, 560]], [42.4, [-0.2, 0.2, 600]]])}>
          {(() => {
            const base = t < 25.2 ? 0 : 0.02 * Math.sin(t * 14);
            const grow = interpolate(t, [32.9, 37.5], [0.02, 0.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            const flex = t < 32.9 ? base : grow * Math.sin((t - 32.9) * Math.PI * 2);
            return <Window w={1.35} h={1.1} flex={flex} />;
          })()}
          {t > 29.4 && <group scale={1 + 0.1 * (1 - thump(t, 29.4))}><Rings x={0} y={0} z={-0.5} n={5} r0={0.95} /></group>}
        </Stage>
        {t < B.ayun && <Waves t={t} />}
        <Chip x={540} y={1530} p={r(t, 27.2, 27.6) * (1 - r(t, 30.0, 30.3))} text="±20 kali per detik" />
        <Chip x={540} y={1530} p={r(t, 30.3, 30.7) * (1 - r(t, 31.2, 31.6))} text="getarnya mirip" color={CORAL} />
        <Swing t={t} p={r(t, 38.3, 38.7) * (1 - r(t, 42.0, 42.4))} />
      </Seg>
      {/* F. gompal di tepi → retak */}
      <Seg a={B.gompal} b={B.payoff}>
        <Stage cam={camAt(t, [[42.4, [0, 0.2, 500]], [45, [-0.4, -0.2, 720]], [47.4, [-0.4, -0.2, 720]], [49.3, [0, 0.15, 560]]])}>
          <Window w={1.35} h={1.1} crack={r(t, 47.5, 48.9, Easing.out(Easing.quad))} chip />
        </Stage>
      </Seg>
      {/* G. payoff: dua rumah */}
      <Seg a={B.payoff} b={B.aksi}><Street t={t - B.payoff + 9} truck={false} crackK={1} cam={[0, 1.4, interpolate(t, [B.payoff, B.aksi], [270, 245])]} /></Seg>
      {/* H. aksi: cek kaca */}
      <Seg a={B.aksi} b={B.tanya}>
        <Stage cam={camAt(t, [[55.9, [-0.3, -0.1, 620]], [61.4, [-0.3, -0.1, 680]], [67, [0, 0.2, 480]]])}>
          <Window w={1.35} h={1.1} chip />
        </Stage>
        <CheckRow y={1040} text="pinggir kaca gompal?" p={r(t, 58.8, 59.2)} tick={r(t, 59.3, 59.4)} />
        <CheckRow y={1170} text="karet sudah keras?" p={r(t, 59.7, 60.1)} tick={r(t, 60.5, 60.6)} />
        <Chip x={540} y={1320} p={r(t, 64.1, 64.5)} text="rumah di pinggir jalan: wajib" color={CORAL} />
      </Seg>
      {/* I. tanya + follow */}
      <Seg a={B.tanya} b={B.end}>
        <Street t={t - B.tanya + 9} truck={false} crackK={0} cam={[0, 1.4, 250]} />
        <Chip x={330} y={1180} p={r(t, 68.4, 68.8) * (1 - r(t, 71.2, 71.6))} text="PERNAH" color={CORAL} size={52} />
        <Chip x={750} y={1180} p={r(t, 68.7, 69.1) * (1 - r(t, 71.2, 71.6))} text="AMAN" color={P13.wallA} size={52} />
      </Seg>

      {/* teks layar (judul dua tingkat) */}
      <Title t={t} a={2.9} b={B.mitos} small="Kaca tetangga pecah," big="KACAMU AMAN?" bigAt={4.8} />
      <Title t={t} a={B.angka} b={B.bass} small="Kaca utuh baru pecah" big="DI ATAS 150 dB" bigAt={17.6} color={P13.wallA} />
      <Title t={t} a={B.bass} b={B.ayun} small="Masalahnya ada di" big="BASS" bigAt={22.6} size={130} />
      <Title t={t} a={B.ayun + 0.2} b={B.gompal} small="Didorong pas waktunya," big="MAKIN LEBAR" bigAt={36.4} />
      <Title t={t} a={B.gompal} b={B.payoff} small="Ternyata ada" big="GOMPAL DI TEPI" bigAt={45.0} />
      <Title t={t} a={B.payoff} b={B.aksi} small="Bass yang getarnya sama" big="+ PINGGIR GOMPAL" bigAt={53.4} size={96} />
      <Title t={t} a={B.aksi} b={61.4} small="Raba pinggir kaca" big="HARI INI" bigAt={57.6} size={120} />
      <Title t={t} a={61.4} b={B.tanya} small="Ganti sebelum" big="MUSIM ARAK-ARAKAN" bigAt={62.3} size={84} />
      <Title t={t} a={B.tanya} b={B.follow} small="Kacamu pernah" big="IKUT BERGETAR?" bigAt={68.4} size={100} />
      {t >= 45.0 && t < 47.6 && <Ring2D x={372} y={1150} s={190} p={r(t, 45.0, 45.4)} />}

      {/* mitos: pemutus pola */}
      {inPB && <PatternBreak lines={['KARENA', 'KENCANGNYA?']} sub={t > 11.8 ? 'angkanya bilang lain' : undefined} p={r(t, B.mitos, B.mitos + 0.6)} />}

      {!inPB && <><Kicker text="FAKTA RUMAH · #13" y={292} start={0} /><TikTokBox text="Kaca pecah karena sound horeg?" p={r(t, 0.2, 1.0, Easing.linear)} y={338} size={40} /></>}
      {!inPB && <><Ornament cx={1030} cy={150} size={360} start={0} /><Ornament cx={40} cy={1800} size={360} start={6} /></>}
      <FollowButton start={Math.round(B.follow * FPS)} click={Math.round((B.follow + 1.0) * FPS)} y={760} />
      {!inPB && <Captions ms={ms} />}

      <Audio src={staticFile('v13/vo.mp3')} />
      <Audio src={staticFile('v13/sfx/ambient.wav')} volume={0.08} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`v13/sfx/${n}.wav`)} volume={v} /></Sequence>)}
      <Grain o={0.08} />
    </AbsoluteFill>
  );
};
