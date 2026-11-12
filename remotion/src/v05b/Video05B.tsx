// Video #5B "Tembokmu Minum Air": kerangka animasi baru (satu penampang, kamera hampir tetap, kaca pembesar untuk pori).
// Timing dari timestamp VO #5 yang sama (public/v05). Patokan gaya: #7/#8 (judul, caption 1400, label garis tipis).
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import * as THREE from 'three';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Env, Paper, Ghost, Callout, PALETTE} from '../pengetahuan/Scene';
import {PoriBata} from '../v05/Tembok';
import {Penampang} from './Penampang';
import words from '../../public/v05/words.json';

export const FPS = 30;
export const V05B_FRAMES = Math.ceil(47 * FPS);
const FOV = 34, ASPECT = 1080 / 1920, CC_TOP = 1400, YAW = -0.35;
const INK = PALETTE.ink, CORAL = '#ef7663', WATER = '#1f7fdc';

const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
type V3 = [number, number, number];
type Key = {t: number; pos: V3; look: V3};
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
function camAt(keys: Key[], t: number): Key {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) { const a = keys[i], b = keys[i + 1];
    if (t <= b.t) { const k = ease((t - a.t) / (b.t - a.t)); return {t, pos: lerp3(a.pos, b.pos, k), look: lerp3(a.look, b.look, k)}; } }
  return keys[keys.length - 1];
}
function proj(cam: Key, p: V3, yaw: number = YAW): [number, number] {
  const c = new THREE.PerspectiveCamera(FOV, ASPECT, 0.1, 100);
  c.position.set(...cam.pos); c.lookAt(...cam.look); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = new THREE.Vector3(...p).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw).project(c);
  return [(v.x + 1) * 540, (1 - v.y) * 960];
}

const B = {hook: 0, kelupas: 3.45, pori: 7.94, meter: 14.5, garam: 17.0, mitos: 25.6, solusi: 33.95, cek: 41.0, cta: 43.8, end: 47};
const CX = 0.35;  // geser supaya tembok di kiri-tengah layar
const KEYS: Key[] = [
  {t: 0, pos: [CX, 1.6, 11.0], look: [CX, 1.2, 0]}, {t: 3.4, pos: [CX, 1.5, 10.3], look: [CX, 1.2, 0]},
  {t: 4.4, pos: [CX, 1.15, 9.0], look: [CX, 0.8, 0]}, {t: 7.4, pos: [CX, 1.15, 9.0], look: [CX, 0.8, 0]},
  {t: 8.4, pos: [CX, 1.5, 10.3], look: [CX, 1.2, 0]}, {t: 25.5, pos: [CX, 1.5, 10.3], look: [CX, 1.2, 0]},
  {t: 26.5, pos: [CX, 1.2, 9.4], look: [CX, 0.9, 0]}, {t: 33.5, pos: [CX, 1.3, 9.9], look: [CX, 1.0, 0]},
  {t: 34.6, pos: [CX, 1.0, 9.0], look: [CX, 0.7, 0]}, {t: 40.8, pos: [CX, 1.0, 9.0], look: [CX, 0.7, 0]},
  {t: 41.8, pos: [CX, 1.5, 10.3], look: [CX, 1.2, 0]}, {t: 43.8, pos: [CX, 1.5, 10.3], look: [CX, 1.2, 0]}, {t: 45.0, pos: [CX, 1.9, 11.4], look: [CX, 1.0, 0]},
];
const LOUPE_CAM: Key = {t: 0, pos: [0, 0.85, 2.9], look: [0, 0.85, 0]};

function state(t: number) {
  let level = 0.4 * r(t, 0.3, 3.3);
  level += 0.18 * r(t, 3.6, 7.0);
  level += 0.42 * r(t, 14.6, 16.4);
  level += 0.55 * r(t, 31.0, 33.4, Easing.out(Easing.cubic));
  level -= 1.31 * r(t, 38.6, 40.6);
  return {t, level: Math.max(0, level), waterOp: 1 - r(t, 41.0, 41.8),
    bubbles: r(t, 4.0, 6.2) * (1 - r(t, 7.6, 8.0)), peel: r(t, 5.1, 7.0),
    salt: r(t, 20.2, 22.4), bulge: r(t, 22.6, 24.2, Easing.out(Easing.cubic)) * (1 - r(t, 25.4, 25.9)), crack: r(t, 23.0, 25.2, Easing.linear) * (1 - r(t, 25.6, 26.0)), flakes: r(t, 24.2, 25.5, Easing.linear) * (1 - r(t, 25.6, 26.0)),
    coat: r(t, 25.9, 27.0) * (1 - r(t, 34.0, 34.8)), trasram: r(t, 35.8, 36.7, Easing.out(Easing.back(1.4))),
    stain: r(t, 41.4, 42.2) * (0.75 + 0.25 * Math.sin(t * 7)) * (1 - r(t, 44.2, 45.2))};
}

const Rig: React.FC<{k: Key}> = ({k}) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  cam.position.set(...k.pos); cam.fov = FOV; cam.updateProjectionMatrix(); cam.lookAt(...k.look);
  return null;
};
const Lights: React.FC = () => (<><Env /><ambientLight intensity={0.15} /><directionalLight position={[4, 6, 5]} intensity={3.0} /><directionalLight position={[-4, 1, 3]} intensity={0.35} color="#ffe2da" /></>);
const Canvas3D: React.FC<{k: Key; children: React.ReactNode}> = ({k, children}) => (
  <ThreeCanvas width={1080} height={1920} camera={{position: k.pos, fov: FOV}} gl={{alpha: true, antialias: true}}><Lights /><Rig k={k} />{children}</ThreeCanvas>
);

const Title: React.FC<{t: number; a: number; b: number; small: string; big: string; bigColor?: string; size?: number}> = ({t, a, b, small, big, bigColor = CORAL, size = 112}) => {
  const i = r(t, a, a + 0.45, Easing.out(Easing.cubic)), o = 1 - r(t, b - 0.3, b);
  if (i * o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 60, top: 300, maxWidth: 960, padding: '20px 30px 24px', borderRadius: 26, background: 'rgba(250,249,246,0.95)', boxShadow: '0 12px 40px rgba(28,28,30,0.18)', fontFamily: 'Inter', color: INK, opacity: i * o, transform: `translateY(${(1 - i) * 26}px)`}}>
      <div style={{fontSize: 50, fontWeight: 700, letterSpacing: -1}}>{small}</div>
      <div style={{whiteSpace: 'nowrap', fontSize: size, fontWeight: 900, letterSpacing: -2, lineHeight: 1.0, color: bigColor, marginTop: 6}}>{big}</div>
    </div>
  );
};
const caps: Caption[] = (words as {words: {word: string; start: number; end: number}[]}).words.map((w, i) => ({
  text: (i ? ' ' : '') + (w.word === 'satu' ? '1' : w.word), startMs: w.start * 1000, endMs: w.end * 1000, timestampMs: w.start * 1000, confidence: 1}));
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
const Ruler: React.FC<{a: [number, number]; b: [number, number]; p: number}> = ({a, b, p}) => {
  const y2 = a[1] + (b[1] - a[1]) * p, lab = r(p, 0.7, 1, Easing.linear);
  return (<>
    <svg width="1080" height="1920" style={{position: 'absolute'}}>
      <line x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * p} y2={y2} stroke={INK} strokeWidth="3" />
      {[0, 0.25, 0.5, 0.75, 1].filter((k) => k <= p + 0.001).map((k) => <line key={k} x1={a[0] + (b[0] - a[0]) * k - (k % 0.5 ? 10 : 18)} x2={a[0] + (b[0] - a[0]) * k + (k % 0.5 ? 10 : 18)} y1={a[1] + (b[1] - a[1]) * k} y2={a[1] + (b[1] - a[1]) * k} stroke={INK} strokeWidth="3" />)}
    </svg>
    <div style={{position: 'absolute', left: b[0] - 250, top: (a[1] + b[1]) / 2 - 40, width: 210, textAlign: 'right', padding: '8px 14px', borderRadius: 14, background: 'rgba(250,249,246,0.95)', fontFamily: 'Inter', color: INK, opacity: lab}}>
      <div style={{fontSize: 46, fontWeight: 900, letterSpacing: -1}}>± 1 m</div><div style={{fontSize: 26, color: PALETTE.sub, marginTop: 4}}>(perkiraan)</div>
    </div></>);
};
const Dashed: React.FC<{a: [number, number]; b: [number, number]; p: number; label: string}> = ({a, b, p, label}) => (<>
  <svg width="1080" height="1920" style={{position: 'absolute'}}><line x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * p} y2={a[1] + (b[1] - a[1]) * p} stroke={INK} strokeWidth="3" strokeDasharray="14 10" /></svg>
  <div style={{position: 'absolute', left: a[0] + 10, top: a[1] - 62, padding: '4px 12px', borderRadius: 10, background: 'rgba(250,249,246,0.95)', fontFamily: 'Inter', fontWeight: 700, fontSize: 32, color: INK, opacity: r(p, 0.5, 1, Easing.linear)}}>{label}</div></>);
const Mark: React.FC<{x: number; y: number; p: number; ok?: boolean}> = ({x, y, p, ok}) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.6, 1], [0.4, 1.12, 1]);
  return (<svg width="1080" height="1920" style={{position: 'absolute'}}><g transform={`translate(${x} ${y}) scale(${s})`} opacity={Math.min(1, p * 2)}>
    <circle r="58" fill={ok ? CORAL : '#fff'} stroke={ok ? CORAL : INK} strokeWidth="5" />
    {ok ? <path d="M -26 2 L -7 22 L 28 -20" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M -22 -22 L 22 22 M 22 -22 L -22 22" stroke={INK} strokeWidth="10" strokeLinecap="round" />}
  </g></svg>);
};
const Vapor: React.FC<{pts: [number, number][]; t: number; p: number}> = ({pts, t, p}) => p <= 0 ? null : (
  <svg width="1080" height="1920" style={{position: 'absolute'}}>{pts.map(([x, y], i) => { const ph = (t * 0.9 + i * 0.33) % 1;
    return <path key={i} d={`M ${x} ${y - ph * 60} q 14 -18 0 -36 q -14 -18 0 -36`} fill="none" stroke="#8a8a8e" strokeWidth="6" strokeLinecap="round" opacity={p * (1 - ph) * 0.9} />; })}</svg>);
const CTA: React.FC<{t: number}> = ({t}) => {
  const i = r(t, B.cta + 0.05, B.cta + 0.6, Easing.out(Easing.back(1.3)));
  if (i <= 0) return null;
  return (<div style={{position: 'absolute', left: 140, right: 140, top: 1040, padding: '44px 40px', borderRadius: 34, background: CORAL, color: '#fff', fontFamily: 'Inter', textAlign: 'center', boxShadow: '0 30px 70px rgba(239,118,99,0.35)', opacity: Math.min(1, i * 1.5), transform: `translateY(${(1 - i) * 60}px) scale(${0.92 + 0.08 * i})`}}>
    <div style={{fontSize: 120, fontWeight: 900, letterSpacing: -3, lineHeight: 1}}>FOLLOW</div><div style={{fontSize: 44, fontWeight: 700, marginTop: 14, letterSpacing: -0.5}}>buat fakta rumah berikutnya</div></div>);
};
// kaca pembesar: kanvas 3D kedua (pori) dipotong lingkaran, bingkai tinta, garis penghubung ke tembok
const LX = 790, LY = 930, LR = 215;
const Loupe: React.FC<{t: number; from: [number, number]}> = ({t, from}) => {
  const o = r(t, B.pori, B.pori + 0.5) * (1 - r(t, B.meter - 0.3, B.meter));
  if (o <= 0) return null;
  const s = 0.55, p = r(t, 10.6, 12.3, Easing.inOut(Easing.quad));
  return (<>
    <svg width="1080" height="1920" style={{position: 'absolute', opacity: o}}><line x1={from[0]} y1={from[1]} x2={LX - LR * 0.8} y2={LY - LR * 0.6} stroke={INK} strokeWidth="3" strokeDasharray="10 8" /><circle cx={from[0]} cy={from[1]} r="9" fill={INK} /></svg>
    <div style={{position: 'absolute', left: LX - LR, top: LY - LR, width: LR * 2, height: LR * 2, borderRadius: '50%', overflow: 'hidden', border: `8px solid ${INK}`, boxSizing: 'border-box', background: '#f3f2ef', boxShadow: '0 20px 50px rgba(28,28,30,0.25)', opacity: o, transform: `scale(${0.9 + 0.1 * o})`}}>
      <div style={{position: 'absolute', left: LR - 540 * s, top: LR - 960 * s, width: 1080, height: 1920, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <Canvas3D k={LOUPE_CAM}><PoriBata t={t} p={p} tissue={0} /></Canvas3D>
      </div>
    </div></>);
};

const SFX: [string, number, number][] = [
  ['drip', 0.15, 0.5], ['drip', 1.6, 0.35], ['crackle', 5.0, 0.45], ['whoosh', 7.6, 0.45], ['flow', 10.7, 0.35], ['flow', 12.9, 0.3],
  ['tick', 14.7, 0.5], ['tick', 15.3, 0.4], ['tick', 15.9, 0.4], ['tick', 16.35, 0.55], ['whoosh', 16.75, 0.35],
  ['crystal', 21.3, 0.45], ['pop', 23.75, 0.5], ['pop', 24.8, 0.4], ['whoosh', 25.4, 0.3], ['buzz', 28.6, 0.4], ['riser', 31.0, 0.35],
  ['pop', 36.1, 0.5], ['chime', 40.3, 0.45], ['knock', 41.4, 0.5], ['knock', 42.6, 0.45], ['chime', 43.95, 0.4],
];

export const Video05B: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const cam = camAt(KEYS, t), st = state(t);
  const spin = YAW + 0.2 * r(t, B.cta, B.end, Easing.linear);
  const yawT = t >= B.cta ? spin : YAW - 0.7 * r(t, 22.8, 24.4) * (1 - r(t, 25.6, 26.6));
  const FZ = 0.42;
  const rulA = proj(cam, [-0.68, 0, FZ]), rulB = proj(cam, [-0.68, 1.0, FZ]);
  const oldA = proj(cam, [-0.72, 1.0, FZ]), oldB = proj(cam, [0.42, 1.0, -0.42]);
  const poriPt = proj(cam, [-0.2, 0.6, FZ]);
  const coatPt = proj(cam, [0.38, 0.3, 0.0]), trasPt = proj(camAt(KEYS, 37), [-0.1, 0.15, FZ]), trasOk = proj(camAt(KEYS, 40.5), [0.38, 1.2, 0.0]);
  const knee = proj(cam, [0.38, 0.48, 0.1]);
  const lab = t > B.garam && t < B.mitos ? 1 - r(t, 22.3, 22.8) : 0;
  const vap = [proj(cam, [0.38, st.level + 0.04, -0.25]), proj(cam, [0.38, st.level + 0.04, 0.0]), proj(cam, [0.38, st.level + 0.04, 0.25])];
  const cl = (p: [number, number], dx: number, dy: number): [number, number] => [Math.max(40, Math.min(1040, p[0] + dx)), p[1] + dy];
  return (
    <AbsoluteFill>
      <Paper t={t} />
      {t < B.pori && <Ghost lines={['Air', 'Tanah']} o={1 - r(t, 7.3, 7.9)} />}
      {t >= B.pori && t < B.garam && <Ghost lines={['Pori', 'Kapiler']} />}
      {t >= B.garam && t < B.mitos && <Ghost lines={['Garam', 'Kristal']} />}
      {t >= B.mitos && <Ghost lines={['Kedap', 'Lembap']} />}
      <Canvas3D k={cam}><group rotation={[0, yawT, 0]}><Penampang {...st} /></group></Canvas3D>

      <Title t={t} a={0.05} b={B.kelupas} small="Tembokmu" big="MINUM AIR" />
      <Title t={t} a={B.kelupas} b={B.pori} small="Cat bawah" big="NGELUPAS TERUS" size={94} />
      <Title t={t} a={B.pori} b={B.meter} small="Pori bata" big="NYEDOT AIR" />
      <Title t={t} a={B.meter} b={B.garam} small="Bisa naik" big="± 1 METER" />
      <Title t={t} a={B.garam} b={B.mitos} small="Garam mengkristal," big="CAT KEDORONG" size={104} />
      <Title t={t} a={B.mitos} b={B.solusi} small={t < 28.5 ? 'Cat anti air?' : 'Cat anti air? Salah!'} big={t < 31.0 ? 'BUKAN SOLUSI' : 'AIRNYA MALAH NAIK'} size={t < 31.0 ? 110 : 86} />
      <Title t={t} a={B.solusi} b={B.cek} small="Putus dari bawah:" big="TRASRAM" />
      <Title t={t} a={B.cek} b={B.cta} small="Ada noda" big="SETINGGI LUTUT?" size={94} />

      <Loupe t={t} from={poriPt} />
      {t > B.meter && t < B.garam && <Ruler a={rulA} b={rulB} p={r(t, 14.6, 16.4)} />}
      <Vapor pts={vap} t={t} p={(t > 18.5 && t < B.mitos ? 1 : 0) * r(t, 18.5, 19.5) * (1 - r(t, 24.8, 25.4))} />
      {lab > 0 && <>
        <Callout from={proj(cam, [-0.2, 1.85, FZ])} to={cl(proj(cam, [-0.2, 1.85, FZ]), -230, -40)} label="Bata" p={r(t, 17.4, 18.2) * lab} />
        <Callout from={proj(cam, [0.27, 1.6, FZ])} to={cl(proj(cam, [0.27, 1.6, FZ]), -260, 40)} label="Plester" p={r(t, 17.8, 18.6) * lab} />
        <Callout from={proj(cam, [0.38, 1.4, 0.25])} to={cl(proj(cam, [0.38, 1.4, 0.25]), 200, -60)} label="Cat" p={r(t, 18.2, 19.0) * lab} />
        <Callout from={proj(cam, [0.34, 1.0, FZ])} to={cl(proj(cam, [0.34, 1.0, FZ]), -300, 190)} label="Kristal garam" sub="(efflorescence)" p={r(t, 21.4, 22.4) * lab} />
      </>}
      {t > 30.4 && t < B.solusi && <Dashed a={oldA} b={oldB} p={r(t, 30.4, 31.2)} label="batas tadi" />}
      {t > B.mitos && t < B.solusi && <Callout from={coatPt} to={cl(coatPt, 150, 130)} label="Cat kedap" sub="air nggak bisa keluar" p={r(t, 26.6, 27.6) * (1 - r(t, 33.4, 33.9))} />}
      <Mark x={coatPt[0] + 230} y={coatPt[1] - 260} p={r(t, 28.6, 29.1) * (1 - r(t, 33.4, 33.9))} />
      {t > B.solusi && t < B.cek && <Callout from={trasPt} to={cl(trasPt, -220, 190)} label="Trasram" sub="adukan kedap air" p={r(t, 36.0, 36.9) * (1 - r(t, 40.7, 41.0))} />}
      <Mark ok x={trasOk[0]} y={trasOk[1] - 120} p={r(t, 40.3, 40.7) * (1 - r(t, 40.8, 41.1))} />
      {t > B.cek && t < B.cta + 0.4 && <Callout from={knee} to={cl(knee, 170, 160)} label="Noda garam" sub="± setinggi lutut" p={r(t, 41.6, 42.6) * (1 - r(t, 43.8, 44.2))} />}
      <CTA t={t} />
      <Captions ms={t * 1000} />

      <Audio src={staticFile('v05/vo.mp3')} />
      <Audio src={staticFile('v05/sfx/ambient.wav')} volume={0.12} />
      {SFX.map(([n, s, v], i) => <Sequence key={i} from={Math.round(s * FPS)} layout="none"><Audio src={staticFile(`v05/sfx/${n}.wav`)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
