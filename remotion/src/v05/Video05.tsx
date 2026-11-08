// Video #5 "Tembokmu Minum Air dari Tanah" (style pengetahuan / editorial 3D). Semua timing diambil dari timestamp kata VO.
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import * as THREE from 'three';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Env, Paper, Ghost, Callout, PALETTE} from '../pengetahuan/Scene';
import {Wall, PoriBata, Lapisan, YAW, ZP, W} from './Tembok';
import words from '../../public/v05/words.json';

export const FPS = 30;
export const V05_FRAMES = Math.ceil(47 * FPS);
const FOV = 34, ASPECT = 1080 / 1920;
const INK = PALETTE.ink, CORAL = '#ef7663';

// ---------- util waktu ----------
const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
type V3 = [number, number, number];
type Key = {t: number; pos: V3; look: V3};
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
function camAt(keys: Key[], t: number) {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) { const k = ease((t - a.t) / (b.t - a.t)); return {t, pos: lerp3(a.pos, b.pos, k), look: lerp3(a.look, b.look, k)}; }
  }
  return keys[keys.length - 1];
}
// proyeksi titik 3D (koordinat lokal objek) ke piksel layar, untuk label garis tipis
function proj(cam: Key, p: V3, yaw: number, gpos: V3 = [0, 0, 0]): [number, number] {
  const c = new THREE.PerspectiveCamera(FOV, ASPECT, 0.1, 100);
  c.position.set(...cam.pos); c.lookAt(...cam.look); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = new THREE.Vector3(...p).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw).add(new THREE.Vector3(...gpos)).project(c);
  return [(v.x + 1) * 540, (1 - v.y) * 960];
}

// ---------- beat (detik dari timestamp VO) ----------
const B = {hook: 0, kelupas: 3.45, pori: 7.94, meter: 14.5, garam: 17.0, mitos: 25.6, solusi: 33.95, cek: 41.0, cta: 43.8, end: 47};

const WALL_KEYS: Key[] = [
  {t: 0, pos: [1.1, 1.75, 11.22], look: [0.25, 1.25, 0.0]},
  {t: 3.4, pos: [0.8, 1.45, 9.9], look: [0.15, 1.15, 0.0]},
  {t: 4.2, pos: [-0.1, 0.62, 5.2], look: [-0.15, 0.42, 0.0]},
  {t: 7.2, pos: [-0.2, 0.6, 4.8], look: [-0.15, 0.42, 0.0]},
  {t: 8.2, pos: [0.15, 1.95, 1.9], look: [0.83, 1.95, 0.57]},
  {t: 14.4, pos: [0.6, 1.65, 11.66], look: [0.05, 1.2, 0.0]},
  {t: 17.0, pos: [0.7, 1.55, 11.0], look: [0.05, 1.2, 0.0]},
  {t: 25.5, pos: [0.7, 1.55, 11.0], look: [0.05, 1.2, 0.0]},
  {t: 33.5, pos: [0.4, 1.45, 10.56], look: [0.05, 1.15, 0.0]},
  {t: 34.6, pos: [0.2, 0.75, 6.4], look: [0.05, 0.5, 0.0]},
  {t: 40.8, pos: [0.25, 0.8, 6.8], look: [0.05, 0.5, 0.0]},
  {t: 41.8, pos: [0.6, 1.45, 11.0], look: [0.05, 1.15, 0.0]},
  {t: 43.8, pos: [0.6, 1.45, 11.0], look: [0.05, 1.15, 0.0]},
  {t: 45.0, pos: [0.3, 2.05, 11.88], look: [0.05, 0.75, 0.0]},
];
const PORI_KEYS: Key[] = [
  {t: 7.94, pos: [0.0, 1.3, 3.6], look: [0.2, 1.1, 0]},
  {t: 11.8, pos: [0.25, 1.05, 4.4], look: [0.45, 0.85, 0]},
  {t: 12.8, pos: [0.95, 1.05, 6.6], look: [0.95, 0.72, 0]},
  {t: 14.6, pos: [1.0, 1.05, 6.3], look: [0.95, 0.72, 0]},
];
const LAP_YAW = -0.5;
const LAP_KEYS: Key[] = [
  {t: 17.0, pos: [0.5, 1.6, 9.4], look: [0.2, 1.05, 0]},
  {t: 21.0, pos: [0.7, 1.4, 8.2], look: [0.35, 1.0, 0]},
  {t: 25.8, pos: [0.85, 1.3, 7.2], look: [0.45, 0.95, 0]},
];

function wallState(t: number) {
  let level = 0.4 * r(t, 0.3, 3.3);
  level += 0.18 * r(t, 3.6, 7.0);
  level += 0.42 * r(t, 14.6, 16.4);                    // ± 1 m
  const coat = r(t, 25.9, 27.0) * (1 - r(t, 34.0, 34.8));
  level += 0.55 * r(t, 31.0, 33.4, Easing.out(Easing.cubic));   // malah naik lebih tinggi
  const trasram = r(t, 35.8, 36.7, Easing.out(Easing.back(1.4)));
  level -= 1.31 * r(t, 38.6, 40.6);                    // jalur air putus, tertahan di kaki tembok
  const waterOp = 1 - r(t, 41.0, 41.8);
  const stain = r(t, 41.4, 42.2) * (0.75 + 0.25 * Math.sin(t * 7)) * (1 - r(t, 44.2, 45.2));
  return {t, level: Math.max(0, level), waterOp, bubbles: r(t, 4.0, 6.2) * (1 - r(t, 7.6, 8.0)), peel: r(t, 5.1, 7.0), coat, trasram, stain};
}

// ---------- komponen ----------
const Rig: React.FC<{k: Key}> = ({k}) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  cam.position.set(...k.pos); cam.fov = FOV; cam.updateProjectionMatrix(); cam.lookAt(...k.look);
  return null;
};
const Lights: React.FC = () => (<><Env /><ambientLight intensity={0.35} /><directionalLight position={[3, 5, 6]} intensity={2.2} /><directionalLight position={[-4, 1, 3]} intensity={0.6} color="#ffe2da" /></>);
const Canvas3D: React.FC<{k: Key; children: React.ReactNode}> = ({k, children}) => (
  <ThreeCanvas width={1080} height={1920} camera={{position: k.pos, fov: FOV}} gl={{alpha: true, antialias: true}}>
    <Lights /><Rig k={k} />{children}
  </ThreeCanvas>
);
// segmen 3D dengan crossfade lembut (tanpa cut keras)
const OV = 9;
const Seg: React.FC<{a: number; b: number; f: number; first?: boolean; children: React.ReactNode}> = ({a, b, f, first, children}) => {
  const fa = Math.round(a * FPS) - (first ? 0 : OV), fb = Math.round(b * FPS) + OV;
  const o = interpolate(f, [fa, fa + 2 * OV, fb - 2 * OV, fb], [first ? 1 : 0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Sequence from={fa} durationInFrames={fb - fa} layout="none"><AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill></Sequence>;
};

const Title: React.FC<{t: number; a: number; b: number; small: string; big: string; bigColor?: string; size?: number}> = ({t, a, b, small, big, bigColor = CORAL, size = 116}) => {
  const i = r(t, a, a + 0.45, Easing.out(Easing.cubic)), o = 1 - r(t, b - 0.3, b);
  if (i * o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 84, right: 60, top: 300, fontFamily: 'Inter', color: INK, opacity: i * o, transform: `translateY(${(1 - i) * 26}px)`}}>
      <div style={{fontSize: 54, fontWeight: 700, letterSpacing: -1}}>{small}</div>
      <div style={{fontSize: size, fontWeight: 900, letterSpacing: -2, lineHeight: 1.0, color: bigColor, marginTop: 6}}>{big}</div>
    </div>
  );
};

const caps: Caption[] = (words as {words: {word: string; start: number; end: number}[]}).words.map((w, i) => ({
  text: (i ? ' ' : '') + (w.word === 'satu' ? '1' : w.word), startMs: w.start * 1000, endMs: w.end * 1000, timestampMs: w.start * 1000, confidence: 1,
}));
const {pages} = createTikTokStyleCaptions({captions: caps, combineTokensWithinMilliseconds: 950});
const Captions: React.FC<{ms: number}> = ({ms}) => {
  const pg = pages.find((p, i) => ms >= p.startMs && ms < (pages[i + 1]?.startMs ?? p.startMs + p.durationMs + 400));
  if (!pg) return null;
  const k = r(ms / 1000, pg.startMs / 1000, pg.startMs / 1000 + 0.15);
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 1400, textAlign: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: 62, letterSpacing: -0.8, lineHeight: 1.15, color: INK, opacity: k, transform: `translateY(${(1 - k) * 10}px)`}}>
      {pg.tokens.map((tk, i) => <span key={i} style={{color: ms >= tk.fromMs && ms < tk.toMs + 120 ? CORAL : INK}}>{tk.text}</span>)}
    </div>
  );
};

const Ruler: React.FC<{a: [number, number]; b: [number, number]; p: number; label: string; sub: string}> = ({a, b, p, label, sub}) => {
  const y2 = a[1] + (b[1] - a[1]) * p, lab = r(p, 0.7, 1, Easing.linear);
  return (
    <>
      <svg width="1080" height="1920" style={{position: 'absolute'}}>
        <line x1={a[0]} y1={a[1]} x2={b[0]} y2={y2} stroke={INK} strokeWidth="3" />
        {[0, 0.25, 0.5, 0.75, 1].filter((k) => k <= p + 0.001).map((k) => <line key={k} x1={a[0] - (k % 0.5 ? 10 : 18)} x2={a[0] + (k % 0.5 ? 10 : 18)} y1={a[1] + (b[1] - a[1]) * k} y2={a[1] + (b[1] - a[1]) * k} stroke={INK} strokeWidth="3" />)}
      </svg>
      <div style={{position: 'absolute', left: b[0] - 250, top: b[1] - 40, width: 220, textAlign: 'right', fontFamily: 'Inter', color: INK, opacity: lab}}>
        <div style={{fontSize: 46, fontWeight: 900, letterSpacing: -1}}>{label}</div>
        <div style={{fontSize: 26, color: PALETTE.sub, marginTop: 4}}>{sub}</div>
      </div>
    </>
  );
};
const Dashed: React.FC<{a: [number, number]; b: [number, number]; p: number; label: string}> = ({a, b, p, label}) => (
  <>
    <svg width="1080" height="1920" style={{position: 'absolute'}}><line x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * p} y2={a[1] + (b[1] - a[1]) * p} stroke={INK} strokeWidth="3" strokeDasharray="14 10" /></svg>
    <div style={{position: 'absolute', left: a[0], top: a[1] - 56, fontFamily: 'Inter', fontWeight: 700, fontSize: 32, color: INK, opacity: r(p, 0.5, 1, Easing.linear)}}>{label}</div>
  </>
);
const Mark: React.FC<{x: number; y: number; p: number; ok?: boolean}> = ({x, y, p, ok}) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.6, 1], [0.4, 1.12, 1]);
  return (
    <svg width="1080" height="1920" style={{position: 'absolute'}}>
      <g transform={`translate(${x} ${y}) scale(${s})`} opacity={Math.min(1, p * 2)}>
        <circle r="58" fill={ok ? CORAL : '#fff'} stroke={ok ? CORAL : INK} strokeWidth="5" />
        {ok ? <path d="M -26 2 L -7 22 L 28 -20" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M -22 -22 L 22 22 M 22 -22 L -22 22" stroke={INK} strokeWidth="10" strokeLinecap="round" />}
      </g>
    </svg>
  );
};

const CTA: React.FC<{t: number}> = ({t}) => {
  const i = r(t, B.cta + 0.05, B.cta + 0.6, Easing.out(Easing.back(1.3)));
  if (i <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 140, right: 140, top: 1040, padding: '44px 40px', borderRadius: 34, background: CORAL, color: '#fff', fontFamily: 'Inter', textAlign: 'center',
      boxShadow: '0 30px 70px rgba(239,118,99,0.35)', opacity: Math.min(1, i * 1.5), transform: `translateY(${(1 - i) * 60}px) scale(${0.92 + 0.08 * i})`}}>
      <div style={{fontSize: 120, fontWeight: 900, letterSpacing: -3, lineHeight: 1}}>FOLLOW</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 14, letterSpacing: -0.5}}>buat fakta rumah berikutnya</div>
    </div>
  );
};

const SFX: [string, number, number][] = [
  // [file, detik, volume]
  ['drip', 0.15, 0.5], ['drip', 1.6, 0.35], ['crackle', 5.0, 0.45], ['whoosh', 7.6, 0.45], ['flow', 10.7, 0.35], ['flow', 12.9, 0.3],
  ['tick', 14.7, 0.5], ['tick', 15.3, 0.4], ['tick', 15.9, 0.4], ['tick', 16.35, 0.55], ['whoosh', 16.75, 0.35],
  ['crystal', 21.3, 0.45], ['pop', 23.75, 0.5], ['pop', 24.8, 0.4], ['whoosh', 25.4, 0.3], ['buzz', 28.6, 0.4], ['riser', 31.0, 0.35],
  ['pop', 36.1, 0.5], ['chime', 40.3, 0.45], ['knock', 41.4, 0.5], ['knock', 42.6, 0.45], ['chime', 43.95, 0.4],
];

export const Video05: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const wc = camAt(WALL_KEYS, t), pc = camAt(PORI_KEYS, t), lc = camAt(LAP_KEYS, t);
  const ws = wallState(t);
  const ctaSpin = YAW + 0.25 * r(t, B.cta, B.end, Easing.linear);
  // label & penanda dari proyeksi 3D
  const zf = ZP + 0.03;
  const rulA = proj(wc, [-W / 2 - 0.12, 0, zf], YAW), rulB = proj(wc, [-W / 2 - 0.12, 1.0, zf], YAW);
  const oldA = proj(wc, [-W / 2, 1.0, zf], YAW), oldB = proj(wc, [W / 2, 1.0, zf], YAW);
  const coatPt = proj(wc, [-0.6, 0.3, zf], YAW), trasPt = proj(camAt(WALL_KEYS, 37), [-0.9, 0.15, zf], YAW), trasPt2 = proj(camAt(WALL_KEYS, 37), [0.9, 0.2, zf], YAW);
  const knee = proj(wc, [-0.3, 0.48, zf], YAW);
  const poriPt = proj(pc, [-0.15, 0.7, 0.62], -0.0), tisuPt = proj(pc, [1.62, 0.75, 0.3], 0);
  const lp = (p: V3) => proj(lc, p, LAP_YAW);
  return (
    <AbsoluteFill>
      <Paper t={t} />
      {t < B.pori && <Ghost lines={['Air', 'Tanah']} o={1 - r(t, 7.3, 7.9)} />}
      {t >= B.pori && t < B.garam && <Ghost lines={['Pori', 'Kapiler']} />}
      {t >= B.garam && t < B.mitos && <Ghost lines={['Garam', 'Kristal']} />}
      {t >= B.mitos && <Ghost lines={['Kedap', 'Lembap']} />}

      {/* 3D: tembok → makro pori → tembok → penampang lapisan → tembok */}
      <Seg a={0} b={B.pori} f={f} first><Canvas3D k={wc}><group rotation={[0, YAW, 0]}><Wall {...ws} /></group></Canvas3D></Seg>
      <Seg a={B.pori} b={B.meter} f={f}><Canvas3D k={pc}><group rotation={[0, -0.0, 0]}>
        <PoriBata t={t} p={r(t, 10.6, 12.3, Easing.inOut(Easing.quad))} tissue={r(t, 12.9, 14.3, Easing.out(Easing.quad))} /></group></Canvas3D></Seg>
      <Seg a={B.meter} b={B.garam} f={f}><Canvas3D k={wc}><group rotation={[0, YAW, 0]}><Wall {...ws} /></group></Canvas3D></Seg>
      <Seg a={B.garam} b={B.mitos} f={f}><Canvas3D k={lc}><group rotation={[0, LAP_YAW, 0]}>
        <Lapisan t={t} water={r(t, 17.1, 18.6)} crystal={r(t, 20.2, 22.4)} bulge={r(t, 22.6, 24.2, Easing.out(Easing.cubic))} powder={r(t, 24.5, 25.7, Easing.linear)} spread={r(t, 17.0, 18.0, Easing.out(Easing.cubic))} />
      </group></Canvas3D></Seg>
      <Seg a={B.mitos} b={B.end} f={f}><Canvas3D k={wc}><group rotation={[0, t >= B.cta ? ctaSpin : YAW, 0]}><Wall {...ws} /></group></Canvas3D></Seg>

      {/* judul 2 baris per beat */}
      <Title t={t} a={0.05} b={B.kelupas} small="Tembokmu" big="MINUM AIR" />
      <Title t={t} a={B.kelupas} b={B.pori} small="Cat bawah" big="NGELUPAS TERUS" size={108} />
      <Title t={t} a={B.pori} b={B.meter} small="Pori bata" big="NYEDOT AIR" />
      <Title t={t} a={B.meter} b={B.garam} small="Bisa naik" big="± 1 METER" />
      <Title t={t} a={B.garam} b={B.mitos} small="Garam mengkristal," big="CAT KEDORONG" />
      <Title t={t} a={B.mitos} b={B.solusi} small={t < 28.5 ? 'Cat anti air?' : 'Cat anti air? Salah!'} big={t < 31.0 ? 'BUKAN SOLUSI' : 'AIRNYA MALAH NAIK'} size={t < 31.0 ? 116 : 98} />
      <Title t={t} a={B.solusi} b={B.cek} small="Putus dari bawah:" big="TRASRAM" />
      <Title t={t} a={B.cek} b={B.cta} small="Ada noda" big="SETINGGI LUTUT?" size={104} />

      {/* label garis tipis */}
      <Callout from={poriPt} to={[poriPt[0] + 60, poriPt[1] - 330]} label="Pori kapiler" sub="saluran super kecil" p={r(t, 9.4, 10.4) * (1 - r(t, 12.4, 12.8))} />
      <Callout from={tisuPt} to={[tisuPt[0] - 330, tisuPt[1] - 240]} label="Kayak tisu" sub="ujungnya dicelup air" p={r(t, 12.6, 13.4) * (1 - r(t, 14.2, 14.5))} />
      {t > B.meter && t < B.garam && <Ruler a={rulA} b={rulB} p={r(t, 14.6, 16.4)} label="± 1 m" sub="(perkiraan)" />}
      {(() => { const pb = lp([1.1, 1.9, 0.1]), pp = lp([0.9, 1.75, 0.6]), pc2 = lp([-0.7, 0.45, 0.98]), px = lp([0.62, 0.8, 0.75]);
        const cl = (p: [number, number], dx: number, dy: number): [number, number] => [Math.max(40, Math.min(760, p[0] + dx)), Math.max(660, Math.min(1290, p[1] + dy))];
        const on = t > B.garam && t < B.mitos ? 1 - r(t, 25.2, 25.6) : 0;
        return on > 0 && <>
          <Callout from={pb} to={cl(pb, 30, -110)} label="Bata" p={r(t, 17.4, 18.2) * on} />
          <Callout from={pp} to={cl(pp, -330, -60)} label="Plester" p={r(t, 17.8, 18.6) * on} />
          <Callout from={pc2} to={cl(pc2, -40, 170)} label="Cat" p={r(t, 18.2, 19.0) * on} />
          <Callout from={px} to={cl(px, 60, 220)} label="Kristal garam" sub="(efflorescence)" p={r(t, 21.4, 22.4) * on} />
        </>; })()}
      {t > 30.4 && t < B.solusi && <Dashed a={oldA} b={oldB} p={r(t, 30.4, 31.2)} label="batas tadi" />}
      {t > B.mitos && t < B.solusi && <Callout from={coatPt} to={[coatPt[0] + 120, coatPt[1] + 150]} label="Cat kedap" sub="air nggak bisa keluar" p={r(t, 26.6, 27.6) * (1 - r(t, 33.4, 33.9))} />}
      <Mark x={coatPt[0] - 40} y={coatPt[1] + 150} p={r(t, 28.6, 29.1) * (1 - r(t, 33.4, 33.9))} />
      {t > B.solusi && t < B.cek && <Callout from={trasPt} to={[trasPt[0] + 100, trasPt[1] + 160]} label="Trasram" sub="adukan kedap air" p={r(t, 36.0, 36.9) * (1 - r(t, 40.7, 41.0))} />}
      <Mark ok x={trasPt2[0]} y={trasPt2[1] - 230} p={r(t, 40.3, 40.7) * (1 - r(t, 40.8, 41.1))} />
      {t > B.cek && t < B.cta + 0.4 && <Callout from={knee} to={[knee[0] + 160, knee[1] + 160]} label="Noda garam" sub="± setinggi lutut" p={r(t, 41.6, 42.6) * (1 - r(t, 43.8, 44.2))} />}
      <CTA t={t} />
      <Captions ms={t * 1000} />

      <Audio src={staticFile('v05/vo.mp3')} />
      <Audio src={staticFile('v05/sfx/ambient.wav')} volume={0.12} />
      {SFX.map(([n, s, v], i) => <Sequence key={i} from={Math.round(s * FPS)} layout="none"><Audio src={staticFile(`v05/sfx/${n}.wav`)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
