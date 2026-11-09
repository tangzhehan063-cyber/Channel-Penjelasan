// Video #9 "Rumah Tusuk Sate Bukan Bawa Sial" (Bukan Sial #01). DNA v07/v08 + skill sutradara (shot list di naskah/video-09-rumah-tusuk-sate.md).
// Timing dari timestamp kata VO take 2 (public/v09/words.json).
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import * as THREE from 'three';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Env, Callout, PALETTE} from '../pengetahuan/Scene';
import {Grain, TikTokBox, PatternBreak} from '../aset/Aset';
import {K, PaperPlus, Kicker, CommentBubble, FollowButton, Ornament} from '../aset/Gabung';
import {Scene, W} from './Jalan';
import words from '../../public/v09/words.json';

export const FPS = 30;
export const V09_END = 46.4;
export const V09_FRAMES = Math.ceil(V09_END * FPS);
const FOV = 34, ASPECT = 1080 / 1920;
// posisi subtitle baku channel (lihat CLAUDE.md): top 1400, sudah ACC user, jangan diubah
const CC_TOP = 1400;
const INK = PALETTE.ink, CORAL = '#ef7663', BLUE = '#5d8fd6', NAVY = '#1b2640';

const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
type V3 = [number, number, number];
type Key = {t: number; pos: V3; look: V3; fov?: number; e?: 'lin' | 'out'};
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
function camAt(keys: Key[], t: number): Key {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) { const u = (t - a.t) / (b.t - a.t), k = a.e === 'lin' ? u : a.e === 'out' ? 1 - (1 - u) * (1 - u) : ease(u); return {t, pos: lerp3(a.pos, b.pos, k), look: lerp3(a.look, b.look, k), fov: a.fov}; }
  }
  return keys[keys.length - 1];
}
function proj(cam: Key, p: V3): [number, number] {
  const c = new THREE.PerspectiveCamera(cam.fov ?? FOV, ASPECT, 0.1, 200);
  c.position.set(...cam.pos); c.lookAt(...cam.look); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = new THREE.Vector3(...p).project(c);
  return [(v.x + 1) * 540, (1 - v.y) * 960];
}

// ---------- beat (detik dari timestamp VO) ----------
const B = {hook: 0, lurus: 3.76, mobil: 6.96, rem: 11.44, malam: 14.4, payoff: 18.72, twist: 25.76, saran: 32.0, nahan: 35.36, cek: 37.52, tanya: 40.4, follow: 43.44, end: V09_END};

// ---------- kamera per adegan (shot list: naskah/video-09) ----------
// e: easing segmen yang dimulai di key itu ('lin' = laju tetap, 'out' = mengerem)
const CAM_HOOK: Key[] = [{t: 0, pos: [6.0, 9.5, 20.0], look: [0, 2.6, 2.0]}, {t: 3.9, pos: [5.4, 8.6, 18.4], look: [0, 2.4, 2.0]}];
const CAM_LURUS: Key[] = [{t: 3.6, pos: [0, 8.0, 26.0], look: [0, 0.5, 4.0]}, {t: 7.1, pos: [0, 1.5, 20.0], look: [0, 1.0, 1.0]}];
const CAM_MOBIL: Key[] = [{t: 6.96, pos: [0.5, 1.5, 44.2], look: [0, 0.6, 33.0], e: 'lin'}, {t: 11.44, pos: [0.5, 1.5, 12.2], look: [0, 0.6, 1.0]}];
const CAM_POV: Key[] = [{t: 11.44, pos: [0, 1.5, 10.4], look: [0, 0.9, 0.0], fov: 50, e: 'out'}, {t: 13.3, pos: [0, 1.5, 4.76], look: [0, 1.1, -3.0], fov: 50}];
const CAM_MALAM: Key[] = [{t: 14.2, pos: [8.5, 3.0, 10.0], look: [0, 1.4, 1.5]}, {t: 18.9, pos: [6.0, 3.4, 14.5], look: [0, 1.4, 1.5]}];
const CAM_PAY: Key[] = [{t: 22.8, pos: [2.6, 2.2, 8.0], look: [0, 0.9, 1.5]}, {t: 25.9, pos: [5.0, 5.5, 16.0], look: [0, 0.8, 2.5]}];
const CAM_TWIST: Key[] = [{t: 25.6, pos: [1.4, 1.7, 30.0], look: [-7.0, 0.4, 24.0], fov: 30}, {t: 27.4, pos: [1.4, 1.7, 30.0], look: [0, 1.2, 0], fov: 30}, {t: 32.1, pos: [0.9, 1.6, 24.0], look: [0, 1.2, 0], fov: 30}];
const CAM_SARAN: Key[] = [{t: 31.9, pos: [5.6, 3.4, 15.0], look: [0, 1.4, 1.2]}, {t: 35.5, pos: [4.3, 2.5, 11.0], look: [0, 1.4, 1.2]}];
const CAM_NAHAN: Key[] = [{t: 35.2, pos: [4.0, 0.8, 9.5], look: [0, 1.2, 1.5]}, {t: 37.6, pos: [4.6, 3.6, 12.0], look: [0, 1.4, 1.5]}];
const CAM_CEK: Key[] = [{t: 37.52, pos: [0, 1.5, 19.4], look: [0, 0.9, 8.0], fov: 50}, {t: 40.2, pos: [0, 1.5, 5.8], look: [0, 1.1, -3.0], fov: 50}];
const CAM_END: Key[] = [{t: 40.2, pos: [-5.5, 4.4, 14.0], look: [0, 2.45, 1.5]}, {t: 46.4, pos: [-2.2, 3.8, 15.5], look: [0, 2.45, 1.5]}];

// ---------- komponen ----------
const Rig: React.FC<{k: Key}> = ({k}) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  cam.position.set(...k.pos); cam.fov = k.fov ?? FOV; cam.updateProjectionMatrix(); cam.lookAt(...k.look);
  return null;
};
const Lights: React.FC<{night?: number}> = ({night = 0}) => (<><Env /><ambientLight intensity={0.18} /><directionalLight position={[4, 6, 5]} intensity={3.0 - 1.4 * night} color={night > 0.5 ? '#cfe0ff' : '#ffffff'} /><directionalLight position={[-4, 1, 3]} intensity={0.45} color="#ffe2da" /></>);
const Canvas3D: React.FC<{k: Key; night?: number; children: React.ReactNode}> = ({k, night, children}) => (
  <ThreeCanvas width={1080} height={1920} camera={{position: k.pos, fov: k.fov ?? FOV}} gl={{alpha: true, antialias: true}}>
    <Lights night={night} /><Rig k={k} />{children}
  </ThreeCanvas>
);
const OV = 8;
const Seg: React.FC<{a: number; b: number; f: number; first?: boolean; children: React.ReactNode}> = ({a, b, f, first, children}) => {
  const fa = Math.max(0, Math.round(a * FPS) - (first ? 0 : OV)), fb = Math.round(b * FPS) + OV;
  const o = interpolate(f, [fa, fa + 2 * OV, fb - 2 * OV, fb], [first ? 1 : 0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Sequence from={fa} durationInFrames={fb - fa} layout="none"><AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill></Sequence>;
};

const Title: React.FC<{t: number; a: number; b: number; small: string; big: string; bigColor?: string; size?: number; top?: number}> = ({t, a, b, small, big, bigColor = CORAL, size = 112, top = 450}) => {
  const i = r(t, a, a + 0.45, Easing.out(Easing.cubic)), o = 1 - r(t, b - 0.3, b);
  if (i * o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 60, top, maxWidth: 960, padding: '20px 30px 24px', borderRadius: 26, background: 'rgba(250,249,246,0.95)', boxShadow: '0 12px 40px rgba(28,28,30,0.18)', fontFamily: 'Inter', color: INK, opacity: i * o, transform: `translateY(${(1 - i) * 26}px)`}}>
      <div style={{fontSize: 50, fontWeight: 700, letterSpacing: -1}}>{small}</div>
      <div style={{whiteSpace: 'nowrap', fontSize: size, fontWeight: 900, letterSpacing: -2, lineHeight: 1.0, color: bigColor, marginTop: 6}}>{big}</div>
    </div>
  );
};

// subtitle: angka kata → numeral
const NUM: Record<string, string> = {};
const caps: Caption[] = (() => {
  const ws = (words as {words: {word: string; start: number; end: number}[]}).words;
  return ws.map((w, i) => {
    const txt = NUM[w.word] ?? w.word;
    return {text: (i ? ' ' : '') + txt, startMs: w.start * 1000, endMs: w.end * 1000, timestampMs: w.start * 1000, confidence: 1};
  });
})();
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

const Chip: React.FC<{x: number; y: number; p: number; text: string; color?: string; size?: number}> = ({x, y, p, text, color = INK, size = 40}) => {
  if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * p})`, opacity: p, padding: '10px 22px', borderRadius: 16, background: 'rgba(250,249,246,0.97)', border: `4px solid ${color}`, fontFamily: 'Inter', fontWeight: 800, fontSize: size, color, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(28,28,30,0.18)'}}>{text}</div>;
};

/* gelembung bunyi "TEK!" berbentuk ledakan kecil */
const TekBurst: React.FC<{x: number; y: number; p: number; size?: number; color?: string; text?: string}> = ({x, y, p, size = 1, color = CORAL, text = 'TEK!'}) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.35, 1], [0.2, 1.15, 1]) * size, o = Math.min(1, p * 3);
  const pts = Array.from({length: 16}, (_, i) => { const a = (i / 16) * Math.PI * 2, rr = i % 2 ? 120 : 175; return `${Math.cos(a) * rr},${Math.sin(a) * rr * 0.78}`; }).join(' ');
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(-6deg)`, opacity: o}}>
      <svg width="400" height="320" style={{position: 'absolute', left: -200, top: -160, overflow: 'visible'}}>
        <polygon points={pts} transform="translate(200 160)" fill="#fff" stroke={INK} strokeWidth="10" strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', left: -200, top: -70, width: 400, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontStyle: 'italic', fontSize: 120, color, letterSpacing: -4, lineHeight: 1}}>{text}</div>
    </div>
  );
};

/* cap stempel miring "BUKAN HANTU" */
const Stamp: React.FC<{p: number; text: string; y?: number}> = ({p, text, y = 760}) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.5, 1], [2.2, 0.94, 1]), o = Math.min(1, p * 2.5);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{transform: `rotate(-9deg) scale(${s})`, padding: '18px 44px', border: `12px solid ${CORAL}`, borderRadius: 24, color: CORAL, background: 'rgba(250,249,246,0.92)', fontFamily: 'Inter', fontWeight: 900, fontSize: 108, letterSpacing: -2, lineHeight: 1, whiteSpace: 'nowrap', boxShadow: '0 16px 40px rgba(0,0,0,0.25)'}}>{text}</div>
    </div>
  );
};


/* cap stempel dipakai dari v08 (Stamp); burst bunyi dipakai untuk "DUK!" */

const SFX: [string, number, number][] = [
  ['pop', 0.25, 0.4], ['knock', 2.5, 0.8],
  ['whoosh', 3.76, 0.3], ['tick', 4.4, 0.35], ['tick', 4.9, 0.35], ['tick', 5.4, 0.35], ['tick', 5.9, 0.35], ['pop', 6.4, 0.4],
  ['engine', 6.74, 0.55], ['pop', 9.5, 0.45],
  ['whoosh', 11.44, 0.35], ['screech', 11.75, 0.55], ['thud', 13.3, 0.9],
  ['whoosh', 14.4, 0.35], ['whoosh', 15.1, 0.25], ['tick', 16.2, 0.4],
  ['crackle', 18.75, 0.45], ['chime', 21.6, 0.4], ['whoosh', 23.04, 0.3],
  ['whoosh', 25.76, 0.3], ['pop', 27.5, 0.45], ['ting', 27.9, 0.5], ['pop', 29.9, 0.4],
  ['whoosh', 32.0, 0.3], ['pop', 33.3, 0.4], ['pop', 33.55, 0.4], ['pop', 33.8, 0.4], ['pop', 34.45, 0.5],
  ['whoosh', 35.36, 0.35], ['knock', 36.1, 0.45],
  ['engine', 37.2, 0.35], ['whoosh', 37.52, 0.25], ['knock', 40.1, 0.3],
  ['pop', 40.5, 0.45], ['pop', 43.5, 0.45], ['chime', 44.6, 0.4],
];

export const Video09: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const ch = camAt(CAM_HOOK, t), cl = camAt(CAM_LURUS, t), cm = camAt(CAM_MOBIL, t), cv = camAt(CAM_POV, t), cn = camAt(CAM_MALAM, t);
  const cp = camAt(CAM_PAY, t), ct = camAt(CAM_TWIST, t), cs = camAt(CAM_SARAN, t), cx = camAt(CAM_NAHAN, t), cc = camAt(CAM_CEK, t), ce = camAt(CAM_END, t);

  // mobil ikut kamera (kamera = mata/pengikut mobil)
  const carMobil = cm.pos[2] - 4.2, carPov = cv.pos[2] - 2.4, carCek = cc.pos[2] - 2.4;
  // tabrakan pelan ke pagar di 13,3 dtk
  const dt = t - 13.3, hit = dt > 0 ? Math.exp(-dt * 4) : 0;
  const wob = dt > 0 ? -0.2 * hit * Math.sin(dt * 20) : 0;
  const shake = dt > 0 ? 0.035 * hit * Math.sin(dt * 55) : 0;
  const povK: Key = {...cv, pos: [cv.pos[0], cv.pos[1] + shake, cv.pos[2]], look: [cv.look[0], cv.look[1] - 0.08 * hit, cv.look[2]]};

  const night = Math.max(r(t, 14.2, 14.6) * (1 - r(t, 18.55, 18.85)), r(t, 35.2, 35.5) * (1 - r(t, 37.35, 37.65)));
  const shop = r(t, 27.3, 27.9, Easing.linear);
  const pots = r(t, 33.2, 33.95, Easing.linear), tree = r(t, 34.3, 34.8, Easing.linear);
  const glowM = r(t, 15.4, 16.0);
  const pb = r(t, 18.72, 19.35) * (1 - r(t, 22.75, 23.05));

  const sign = proj(ct, [0, 1.8, W.front + 0.02]), signEnd = proj(ce, [0, 1.8, W.front + 0.02]);
  const potPt = proj(cs, [-1.2, 0.5, W.fenceZ + 0.55]), treePt = proj(cs, [0.75, 1.5, 2.05]);

  return (
    <AbsoluteFill>
      <PaperPlus />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${NAVY} 0%, #2b3a5e 100%)`, opacity: 0.94 * night}} />


      {/* ---------- 3D ---------- */}
      <Seg a={0} b={B.lurus} f={f} first><Canvas3D k={ch}><Scene /></Canvas3D></Seg>
      <Seg a={B.lurus} b={B.mobil} f={f}><Canvas3D k={cl}><Scene dash={r(t, 4.1, 6.5, Easing.linear)} /></Canvas3D></Seg>
      <Seg a={B.mobil} b={B.rem} f={f}><Canvas3D k={cm}><Scene dash={1} band={[21.75, W.fenceZ, r(t, 9.45, 10.4)]} car={{z: carMobil}} /></Canvas3D></Seg>
      <Seg a={B.rem} b={B.malam} f={f}><Canvas3D k={povK}><Scene dash={1} band={[21.75, W.fenceZ, 1]} wob={wob} car={{z: carPov, pitch: -0.05 * Math.sin(Math.PI * r(t, 11.44, 13.3, Easing.linear)) + 0.03 * hit * Math.sin(dt * 30)}} /></Canvas3D></Seg>
      <Seg a={B.malam} b={B.payoff} f={f}><Canvas3D k={cn} night={1}><Scene dash={1} car={{z: 12, lights: r(t, 14.9, 15.3), beam: 10.3 * r(t, 15.2, 16.0)}} night={1} glow={glowM} /></Canvas3D></Seg>
      <Seg a={B.payoff} b={B.twist} f={f}><Canvas3D k={cp}><Scene dash={1} /></Canvas3D></Seg>
      <Seg a={B.twist} b={B.saran} f={f}><Canvas3D k={ct}><Scene dash={1} shop={shop} /></Canvas3D></Seg>
      <Seg a={B.saran} b={B.nahan} f={f}><Canvas3D k={cs}><Scene dash={1} shop={1} pots={pots} tree={tree} /></Canvas3D></Seg>
      <Seg a={B.nahan} b={B.cek} f={f}><Canvas3D k={cx} night={1}><Scene dash={1} shop={1} pots={1} tree={1} night={1} glow={0.15} car={{z: 12, lights: 1, beam: 9.4 * r(t, 35.5, 36.1)}} /></Canvas3D></Seg>
      <Seg a={B.cek} b={B.tanya} f={f}><Canvas3D k={cc}><Scene dash={1} shop={1} pots={1} tree={1} car={{z: carCek}} /></Canvas3D></Seg>
      <Seg a={B.tanya} b={B.end} f={f}><Canvas3D k={ce}><Scene dash={1} shop={1} pots={1} tree={1} /></Canvas3D></Seg>

      {/* jangkar atas */}
      <Kicker text="BUKAN SIAL · #01" y={292} start={0} />
      <TikTokBox text="Sial beneran?" p={r(t, 0.15, 0.8, Easing.linear)} y={338} size={40} />

      {/* ---------- hook ---------- */}
      <Stamp p={r(t, 2.45, 2.8, Easing.out(Easing.cubic)) * (1 - r(t, 3.45, 3.75))} text="BUKAN SIAL" y={1060} />

      {/* ---------- judul ---------- */}
      <Title t={t} a={0.05} b={2.6} small="Rumah tusuk sate," big="BAWA SIAL?" size={120} />
      <Title t={t} a={B.lurus} b={B.mobil} small="Jalannya lurus," big="UJUNGNYA RUMAHMU" size={82} />
      <Title t={t} a={B.mobil} b={B.rem} small="Mobil 40 km/jam, berhenti" big="± 20 METER" size={140} />
      <Title t={t} a={B.malam} b={B.payoff} small="Malam, lampu mobil" big="40 M KE KAMARMU" bigColor={'#f6c453'} size={92} />
      <Title t={t} a={23.04} b={B.twist} small="Orang tua nggak salah," big="BAHASANYA BEDA" bigColor={K.sage} size={104} />
      <Title t={t} a={B.twist} b={29.68} small="Justru karena itu," big="PEDAGANG NYARI" size={102} />
      <Title t={t} a={29.68} b={B.saran} small="Kelihatan" big="DARI UJUNG JALAN" size={96} />
      <Title t={t} a={B.saran} b={B.nahan} small="Saran orang tua:" big="PAGAR & POHON" bigColor={K.sage} size={116} />
      <Title t={t} a={B.nahan} b={B.cek} small="Itu nahan" big="MOBIL & SILAU" bigColor={'#f6c453'} size={116} />
      <Title t={t} a={B.cek} b={B.tanya} small="Cari rumah? Cek" big="UJUNG JALANNYA" bigColor={K.sage} size={96} />

      {/* ---------- mobil & rem ---------- */}
      <Chip x={540} y={1210} p={r(t, 9.5, 9.9) * (1 - r(t, 11.1, 11.4))} text="jarak berhenti (perkiraan)" size={42} color={CORAL} />
      <Chip x={540} y={760} p={r(t, 11.55, 11.85) * (1 - r(t, 12.9, 13.2))} text="rem telat…" size={56} />
      <TekBurst x={540} y={860} p={r(t, 13.28, 13.45, Easing.linear) * (1 - r(t, 14.0, 14.35))} size={1.1} text="DUK!" />

      {/* ---------- malam ---------- */}
      <Chip x={540} y={1230} p={r(t, 16.2, 16.6) * (1 - r(t, 18.3, 18.6))} text="lampu dekat mobil ≥ 40 m" size={44} color={INK} />

      {/* ---------- payoff ---------- */}
      {pb > 0 && <AbsoluteFill style={{opacity: Math.min(1, (1 - r(t, 22.75, 23.05)) * 1.0)}}><PatternBreak lines={['BUKAN SIAL,', 'KETABRAK', '& SILAU']} p={r(t, 18.72, 19.6)} /></AbsoluteFill>}

      {/* ---------- warung ---------- */}
      <Chip x={sign[0]} y={sign[1]} p={r(t, 27.6, 28.0) * (1 - r(t, 31.7, 32.0))} text="WARUNG" size={30} color={CORAL} />
      <Chip x={540} y={1230} p={r(t, 30.0, 30.4) * (1 - r(t, 31.6, 31.95))} text="kelihatan dari jauh" size={44} />

      <Chip x={signEnd[0]} y={signEnd[1]} p={r(t, 40.5, 40.9)} text="WARUNG" size={34} color={CORAL} />

      {/* ---------- saran ---------- */}
      <Chip x={Math.max(200, potPt[0])} y={potPt[1] + 120} p={r(t, 33.5, 33.8) * (1 - r(t, 35.0, 35.3))} text="pot beton" size={40} />
      <Chip x={Math.min(860, treePt[0] + 120)} y={Math.max(780, treePt[1] - 150)} p={r(t, 34.6, 34.9) * (1 - r(t, 35.0, 35.3))} text="pohon" size={40} color={K.sage} />
      <Chip x={540} y={1230} p={r(t, 36.2, 36.5) * (1 - r(t, 37.2, 37.45))} text="silau ketahan" size={44} color={INK} />

      {/* ---------- ajak komentar + follow ---------- */}
      <CommentBubble word="buat apa?" start={Math.round(40.5 * FPS)} y={520} out={Math.round(43.3 * FPS)} />
      <FollowButton start={Math.round(43.5 * FPS)} click={Math.round(44.6 * FPS)} y={1250} />
      <Captions ms={t * 1000} />

      <Ornament cx={1030} cy={150} size={360} start={0} accent={pb} />
      <Ornament cx={40} cy={1800} size={360} start={6} accent={pb} />
      <Grain o={0.05} id="g9" />

      <Audio src={staticFile('v09/vo.mp3')} />
      <Audio src={staticFile('v09/sfx/ambient.wav')} volume={0.1} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`v09/sfx/${n}.wav`)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
