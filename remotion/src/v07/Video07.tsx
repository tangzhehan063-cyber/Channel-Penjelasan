// Video #7 "Baja Ringan vs Kayu: Musuhnya Beda" (Bongkar Barang #01). Gaya A editorial 3D + sistem gabungan.
// Template dari v06; timing dari timestamp kata VO take 2 (public/v07/words.json).
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Audio} from '@remotion/media';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import * as THREE from 'three';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Env, Ghost, Callout, PALETTE} from '../pengetahuan/Scene';
import {Grain, TikTokBox} from '../aset/Aset';
import {Squiggle} from '../aset/Gerak';
import {K, PaperPlus, Kicker, Disc, FocusRing, StatPanel, CommentBubble, FollowButton, Ornament} from '../aset/Gabung';
import {Profile, Beam, TermiteBeam, Seesaw, Support, Screw, Rust, PROF} from './Atap';
import words from '../../public/v07/words.json';

export const FPS = 30;
export const V07_END = 52.4;
export const V07_FRAMES = Math.ceil(V07_END * FPS);
const FOV = 34, ASPECT = 1080 / 1920;
const INK = PALETTE.ink, CORAL = '#ef7663';

const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
type V3 = [number, number, number];
type Key = {t: number; pos: V3; look: V3};
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
function camAt(keys: Key[], t: number): Key {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) { const k = ease((t - a.t) / (b.t - a.t)); return {t, pos: lerp3(a.pos, b.pos, k), look: lerp3(a.look, b.look, k)}; }
  }
  return keys[keys.length - 1];
}
function proj(cam: Key, p: V3): [number, number] {
  const c = new THREE.PerspectiveCamera(FOV, ASPECT, 0.1, 100);
  c.position.set(...cam.pos); c.lookAt(...cam.look); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = new THREE.Vector3(...p).project(c);
  return [(v.x + 1) * 540, (1 - v.y) * 960];
}

// ---------- beat (detik dari timestamp VO) ----------
const B = {hook: 0, berat: 2.72, tipis: 6.96, lipat: 10.24, ringan: 12.16, salah: 15.12, rayap: 20.4, baja: 26.48, payoff: 32.64, cekBaja: 37.36, cekKayu: 41.12, simpan: 44.08, tanya: 46.24, follow: 48.8, end: V07_END};

// ---------- kamera per adegan ----------
const CAM_HOOK: Key[] = [{t: 0, pos: [0.6, 1.8, 9.6], look: [0.2, -0.1, 0]}, {t: 2.8, pos: [0.2, 1.4, 9.0], look: [0.2, -0.1, 0]}];
const CAM_SAW: Key[] = [{t: 2.5, pos: [0, 1.6, 10.2], look: [0, -0.1, 0]}, {t: 7.1, pos: [0.4, 1.4, 9.4], look: [0, -0.1, 0]}];
const CAM_SEC: Key[] = [{t: 6.8, pos: [3.6, 1.8, 5.0], look: [-0.6, -0.1, 0.2]}, {t: 8.4, pos: [2.6, 0.2, 0.3], look: [0, -0.1, 0.18]}, {t: 10.4, pos: [2.4, 0.18, 0.28], look: [0, -0.1, 0.18]}];
const CAM_FOLD: Key[] = [{t: 10.0, pos: [3.2, 1.0, 3.6], look: [0, 0.2, 0.15]}, {t: 12.3, pos: [4.0, 2.2, 5.0], look: [0, 0.3, 0.15]}, {t: 15.3, pos: [4.2, 2.3, 5.3], look: [0, 0.3, 0.15]}];
const CAM_RAYAP: Key[] = [{t: 20.0, pos: [0.8, 1.8, 7.4], look: [0, 0.0, 0]}, {t: 22.0, pos: [0.2, 0.5, 5.4], look: [0, -0.05, 0]}, {t: 26.4, pos: [0.0, 0.4, 5.1], look: [0, -0.05, 0]}];
const CAM_BAJA: Key[] = [{t: 26.2, pos: [2.0, 2.8, 9.4], look: [0, -0.3, 0.2]}, {t: 28.8, pos: [1.6, 2.2, 6.4], look: [0.8, 0.1, 0.2]}, {t: 30.6, pos: [0.4, 1.6, 9.0], look: [0, -0.3, 0.2]}, {t: 32.6, pos: [0.2, 1.4, 9.2], look: [0, -0.35, 0.2]}];
const CAM_BOTH: Key[] = [{t: 32.4, pos: [0, 1.3, 8.6], look: [0, -0.3, 0]}, {t: 37.4, pos: [0, 1.1, 8.0], look: [0, -0.3, 0]}];
const CAM_CEK: Key[] = [{t: 37.2, pos: [1.6, 1.0, 4.6], look: [0, 0, 0]}, {t: 41.2, pos: [0.9, 0.8, 4.0], look: [0, 0, 0]}];
const CAM_END: Key[] = [{t: 41.0, pos: [0, 1.3, 8.8], look: [0, -0.3, 0]}, {t: 52.4, pos: [0.3, 1.5, 9.6], look: [0, -0.3, 0]}];

// ---------- komponen ----------
const Rig: React.FC<{k: Key}> = ({k}) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  cam.position.set(...k.pos); cam.fov = FOV; cam.updateProjectionMatrix(); cam.lookAt(...k.look);
  return null;
};
const Lights: React.FC = () => (<><Env /><ambientLight intensity={0.18} /><directionalLight position={[4, 6, 5]} intensity={3.0} /><directionalLight position={[-4, 1, 3]} intensity={0.45} color="#ffe2da" /></>);
const Canvas3D: React.FC<{k: Key; children: React.ReactNode}> = ({k, children}) => (
  <ThreeCanvas width={1080} height={1920} camera={{position: k.pos, fov: FOV}} gl={{alpha: true, antialias: true}}>
    <Lights /><Rig k={k} />{children}
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
    <div style={{position: 'absolute', left: 60, top, maxWidth: 960, padding: '20px 30px 24px', borderRadius: 26, background: 'rgba(250,249,246,0.94)', boxShadow: '0 12px 40px rgba(28,28,30,0.12)', fontFamily: 'Inter', color: INK, opacity: i * o, transform: `translateY(${(1 - i) * 26}px)`}}>
      <div style={{fontSize: 50, fontWeight: 700, letterSpacing: -1}}>{small}</div>
      <div style={{whiteSpace: 'nowrap', fontSize: size, fontWeight: 900, letterSpacing: -2, lineHeight: 1.0, color: bigColor, marginTop: 6}}>{big}</div>
    </div>
  );
};

// subtitle: kata angka → numeral untuk yang belum diubah skrip
const NUM: Record<string, string> = {satu: '1'};
const caps: Caption[] = (() => {
  const ws = (words as {words: {word: string; start: number; end: number}[]}).words;
  const out: Caption[] = [];
  for (let i = 0; i < ws.length; i++) {
    const w = ws[i];
    // "dua koma delapan triliun" → "2,8 triliun"
    if (w.word === 'dua' && ws[i + 1]?.word === 'koma' && ws[i + 2]?.word === 'delapan') {
      out.push({text: ' Rp2,8', startMs: w.start * 1000, endMs: ws[i + 2].end * 1000, timestampMs: w.start * 1000, confidence: 1}); i += 2; continue;
    }
    const txt = NUM[w.word] ?? w.word;
    out.push({text: (i ? ' ' : '') + txt, startMs: w.start * 1000, endMs: w.end * 1000, timestampMs: w.start * 1000, confidence: 1});
  }
  return out;
})();
const {pages} = createTikTokStyleCaptions({captions: caps, combineTokensWithinMilliseconds: 950});
const Captions: React.FC<{ms: number}> = ({ms}) => {
  const pg = pages.find((p, i) => ms >= p.startMs && ms < (pages[i + 1]?.startMs ?? p.startMs + p.durationMs + 400));
  if (!pg) return null;
  const k = r(ms / 1000, pg.startMs / 1000, pg.startMs / 1000 + 0.15);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1400, textAlign: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: 60, letterSpacing: -0.8, lineHeight: 1.15, color: INK, opacity: k, transform: `translateY(${(1 - k) * 10}px)`}}>
      <span style={{display: 'inline-block', padding: '12px 28px 16px', borderRadius: 22, background: 'rgba(250,249,246,0.94)', boxShadow: '0 10px 30px rgba(28,28,30,0.12)'}}>
        {pg.tokens.map((tk, i) => <span key={i} style={{color: ms >= tk.fromMs && ms < tk.toMs + 120 ? CORAL : INK}}>{tk.text}</span>)}
      </span>
    </div>
  );
};

// kartu kecil berlabel (mono) yang muncul di atas titik layar
const Chip: React.FC<{x: number; y: number; p: number; text: string; color?: string; size?: number}> = ({x, y, p, text, color = INK, size = 40}) => {
  if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * p})`, opacity: p, padding: '10px 22px', borderRadius: 16, background: 'rgba(250,249,246,0.96)', border: `4px solid ${color}`, fontFamily: 'Inter', fontWeight: 800, fontSize: size, color, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(28,28,30,0.14)'}}>{text}</div>;
};

// lup: tulisan cetak di batang baja ringan
const Loupe: React.FC<{x: number; y: number; p: number}> = ({x, y, p}) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.6, 1], [0.3, 1.08, 1]);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, opacity: Math.min(1, p * 2)}}>
      <svg width="560" height="560" style={{position: 'absolute', left: -280, top: -280, overflow: 'visible'}}>
        <line x1="410" y1="410" x2="540" y2="540" stroke={INK} strokeWidth="34" strokeLinecap="round" />
        <circle cx="280" cy="280" r="200" fill="#e9ecef" stroke={INK} strokeWidth="14" />
      </svg>
      <div style={{position: 'absolute', left: -170, top: -64, width: 340, textAlign: 'center', fontFamily: 'IBM Plex Mono', fontWeight: 500, color: INK, lineHeight: 1.15}}>
        <div style={{fontSize: 64, color: CORAL, fontWeight: 500}}>0.75 TCT</div>
        <div style={{fontSize: 34}}>G550 · AZ100</div>
      </div>
    </div>
  );
};

// layar dua kubu (setelah cincin membanjir koral)
const TwoCamps: React.FC<{t: number}> = ({t}) => {
  const q = (a: number) => r(t, a, a + 0.35, Easing.out(Easing.cubic));
  const strike = r(t, 17.05, 17.6, Easing.linear), musuh = q(18.6);
  const camp = (a: number, x: number, label: string) => (
    <div style={{position: 'absolute', left: x, top: 700, width: 380, textAlign: 'center', opacity: q(a), transform: `translateY(${(1 - q(a)) * 40}px)`,
      fontFamily: 'Inter', fontWeight: 900, fontSize: 64, color: '#fff', letterSpacing: -1.5, padding: '26px 0', border: '6px solid #fff', borderRadius: 26}}>{label}</div>
  );
  return (
    <>
      {camp(15.2, 60, 'TIM KAYU')}{camp(15.9, 640, 'TIM BAJA')}
      <div style={{position: 'absolute', left: 440, top: 722, width: 200, textAlign: 'center', fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 900, fontSize: 70, color: INK, opacity: q(15.6)}}>vs</div>
      <svg width="1080" height="1920" style={{position: 'absolute'}}><line x1="40" y1="790" x2={40 + 1000 * strike} y2={790 - 40 * strike} stroke={INK} strokeWidth="14" strokeLinecap="round" opacity={strike > 0 ? 1 : 0} /></svg>
      <div style={{position: 'absolute', left: 60, right: 60, top: 960, textAlign: 'center', fontFamily: 'Playfair Display', fontWeight: 900, color: '#fff', fontSize: 92, lineHeight: 1.05, letterSpacing: -2, textShadow: '0 8px 0 rgba(0,0,0,0.16)', opacity: q(17.0)}}>“Mana yang lebih kuat?”</div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 1130, textAlign: 'center', fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 900, color: INK, fontSize: 104, opacity: musuh, transform: `scale(${0.85 + 0.15 * musuh})`}}>Musuhnya beda.</div>
    </>
  );
};

const Bookmark: React.FC<{p: number}> = ({p}) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.6, 1], [0.3, 1.12, 1]);
  return (
    <svg width="1080" height="1920" style={{position: 'absolute'}}>
      <g transform={`translate(540 1000) scale(${s})`} opacity={Math.min(1, p * 2)}>
        <path d="M-90 -130 H90 V140 L0 80 L-90 140 Z" fill={K.sage} stroke={INK} strokeWidth="9" strokeLinejoin="round" />
        <path d="M-34 -10 L-8 16 L38 -36" fill="none" stroke="#fff" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

const SFX: [string, number, number][] = [
  ['whoosh', 0.2, 0.3], ['knock', 0.9, 0.35], ['pop', 1.6, 0.45],
  ['whoosh', 2.8, 0.3], ['pop', 3.3, 0.4], ['pop', 3.6, 0.4], ['knock', 4.9, 0.5], ['tick', 5.6, 0.45], ['whoosh', 7.0, 0.3], ['tick', 8.9, 0.5],
  ['whoosh', 10.2, 0.3], ['crackle', 10.6, 0.3], ['knock', 11.9, 0.45], ['pop', 12.4, 0.35], ['tick', 12.9, 0.4], ['tick', 13.5, 0.4],
  ['riser', 14.4, 0.35], ['pop', 15.3, 0.4], ['pop', 16.0, 0.4], ['buzz', 17.3, 0.35], ['chime', 18.7, 0.4],
  ['whoosh', 20.4, 0.3], ['crackle', 21.6, 0.4], ['crackle', 22.8, 0.35], ['tick', 24.0, 0.4], ['tick', 24.6, 0.4], ['chime', 25.2, 0.3],
  ['whoosh', 26.5, 0.3], ['crystal', 27.7, 0.35], ['pop', 29.5, 0.4], ['pop', 29.9, 0.4], ['pop', 30.3, 0.4], ['buzz', 31.1, 0.3],
  ['whoosh', 32.6, 0.3], ['chime', 33.4, 0.45],
  ['whoosh', 37.3, 0.3], ['pop', 38.7, 0.45], ['chime', 40.2, 0.35], ['whoosh', 41.1, 0.3], ['pop', 42.0, 0.4], ['chime', 43.4, 0.35], ['pop', 44.4, 0.5],
  ['pop', 46.3, 0.4], ['chime', 50.0, 0.4],
];

export const Video07: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const ch = camAt(CAM_HOOK, t), cs = camAt(CAM_SAW, t), cx = camAt(CAM_SEC, t), cf = camAt(CAM_FOLD, t), cr = camAt(CAM_RAYAP, t), cb = camAt(CAM_BAJA, t), c2 = camAt(CAM_BOTH, t), cc = camAt(CAM_CEK, t), ce = camAt(CAM_END, t);

  // hook: profil masuk dari kanan, balok kayu dari kiri
  const hookIn = r(t, 0.0, 1.2, Easing.out(Easing.cubic));
  // timbangan
  const sawIn = r(t, 3.0, 3.6, Easing.out(Easing.back(1.4))), tilt = 0.24 * r(t, 4.6, 5.4, Easing.out(Easing.back(2)));
  // lipat
  const fold = r(t, 10.4, 11.9, Easing.inOut(Easing.quad)), brick = r(t, 11.9, 12.3, Easing.in(Easing.quad));
  // rayap
  const open = r(t, 21.0, 21.9), eaten = r(t, 21.3, 23.6, Easing.linear);
  // baja: karat + sekrup lepas + melengkung
  const rust = r(t, 27.6, 28.4, Easing.linear);
  const screwO = [0, 1, 2, 3].map((i) => 1 - r(t, 29.5 + i * 0.25, 29.8 + i * 0.25));
  const sag = 0.34 * r(t, 30.6, 31.9, Easing.out(Easing.cubic));
  // koral
  const flood = r(t, 14.9, 15.5), floodOut = r(t, 19.9, 20.4), pbIn = r(t, 15.0, 15.4) * (1 - r(t, 19.9, 20.25)), accent = r(t, 15.0, 15.4) * (1 - r(t, 20.0, 20.4));

  const hookProf = proj(ch, [1.6 + 3 * (1 - hookIn), 0.2, 0.2]), hookBeam = proj(ch, [-1.3 - 3 * (1 - hookIn), -0.75, 0]);
  const rot = (x: number, y: number): V3 => [x * Math.cos(tilt) - y * Math.sin(tilt), -0.2 + x * Math.sin(tilt) + y * Math.cos(tilt), 0];
  const sawSteel = proj(cs, rot(-1.1, 0.3)), sawWood = proj(cs, rot(1.1, 0.3));
  const secPt = proj(cx, [0, 0.15, 0.0]);
  const rustPt = proj(cb, [1.45, PROF.h / 2 + 0.02, 0.18]);

  return (
    <AbsoluteFill>
      <PaperPlus />
      {t < B.salah && <Ghost lines={['Baja', 'Ringan']} o={1 - r(t, 14.6, 15.0)} />}
      {t >= B.rayap && t < B.payoff && <Ghost lines={['Musuh', 'Beda']} />}
      {t >= B.cekBaja && t < B.tanya && <Ghost lines={['Cek', 'Dulu']} />}

      {/* jangkar atas */}
      <Kicker text="BONGKAR BARANG · #01" y={292} start={0} />
      <TikTokBox text="Baja ringan atau kayu?" p={r(t, 0.15, 0.9, Easing.linear)} y={338} size={40} />

      <Disc x={540} y={1010} r={330} color="#f6c9bd" start={6} out={Math.round(2.5 * FPS)} />
      <Squiggle x={70} y={640} start={10} out={Math.round(2.4 * FPS)} />
      <Squiggle x={860} y={1250} start={16} rot={180} out={Math.round(2.4 * FPS)} />

      {/* ---------- 3D ---------- */}
      <Seg a={0} b={B.berat} f={f} first><Canvas3D k={ch}>
        <group position={[1.6 + 3 * (1 - hookIn), 0.2, 0]} rotation={[0.25, -0.5 + 0.25 * t, 0]}><Profile L={4.2} /></group>
        <group position={[-1.3 - 3 * (1 - hookIn), -0.75, 0]} rotation={[0.15, 0.5, 0]}><Beam L={3.0} /></group>
      </Canvas3D></Seg>
      <Seg a={B.berat} b={B.tipis} f={f}><Canvas3D k={cs}><group position={[0, -0.2, 0]}><Seesaw tilt={tilt} o={sawIn} /></group></Canvas3D></Seg>
      <Seg a={B.tipis} b={B.lipat} f={f}><Canvas3D k={cx}><group position={[-3, 0, 0]}><Profile L={6} /></group></Canvas3D></Seg>
      <Seg a={B.lipat} b={B.salah} f={f}><Canvas3D k={cf}>
        <group rotation={[0, 0, 0]}><Profile L={1.8} k={fold} /></group>
        {brick > 0 && <group position={[0, PROF.h / 2 + 0.2 + 1.6 * (1 - brick), 0.18]}><mesh><boxGeometry args={[0.7, 0.3, 0.34]} /><meshPhysicalMaterial color="#e65a43" roughness={0.6} /></mesh><mesh scale={1.05}><boxGeometry args={[0.7, 0.3, 0.34]} /><meshBasicMaterial color={INK} side={THREE.BackSide} /></mesh></group>}
      </Canvas3D></Seg>
      <Seg a={B.rayap} b={B.baja} f={f}><Canvas3D k={cr}><TermiteBeam open={open} eaten={eaten} t={t} /></Canvas3D></Seg>
      <Seg a={B.baja} b={B.payoff} f={f}><Canvas3D k={cb}>
        <Profile L={3.6} sag={sag} n={18} />
        <Support x={-1.55} /><Support x={1.55} />
        {[[-1.62, 0.08], [-1.45, 0.28], [1.45, 0.08], [1.62, 0.28]].map(([x, z], i) => <Screw key={i} p={[x, PROF.h / 2 + 0.03 - (Math.abs(x) < 1.7 ? 0 : 0), z]} o={screwO[i]} />)}
        <Rust spots={[[1.45, PROF.h / 2 + 0.02, 0.2], [1.2, PROF.h / 2 + 0.02, 0.12], [1.62, PROF.h / 2 + 0.02, 0.3], [0.95, PROF.h / 2 + 0.02, 0.24], [-1.3, PROF.h / 2 + 0.02, 0.16]]} p={rust} />
      </Canvas3D></Seg>
      <Seg a={B.payoff} b={B.cekBaja} f={f}><Canvas3D k={c2}>
        <group position={[-1.05, -0.4, 0]} rotation={[0.2, 0.6, 0]} scale={0.62}><Beam L={2.6} /></group>
        <group position={[1.05, -0.3, 0]} rotation={[0.25, -0.6, 0]} scale={0.62}><Profile L={2.8} /></group>
      </Canvas3D></Seg>
      <Seg a={B.cekBaja} b={B.cekKayu} f={f}><Canvas3D k={cc}><group rotation={[0.1, -0.35, 0]}><Profile L={4.4} /></group></Canvas3D></Seg>
      <Seg a={B.cekKayu} b={B.end} f={f}><Canvas3D k={ce}>
        <group position={[-1.05, -0.4, 0]} rotation={[0.2, 0.6 + 0.04 * (t - 41), 0]} scale={0.62}><Beam L={2.6} /></group>
        <group position={[1.05, -0.3, 0]} rotation={[0.25, -0.6 - 0.04 * (t - 41), 0]} scale={0.62}><Profile L={2.8} /></group>
      </Canvas3D></Seg>

      {/* ---------- judul 2 baris per beat ---------- */}
      <Title t={t} a={0.05} b={B.berat} small="Baja ringan itu bajanya" big="NGGAK RINGAN" size={120} />
      <Title t={t} a={B.berat} b={B.tipis} small="Ukuran sama, baja lebih dari" big="10× LEBIH BERAT" size={96} />
      <Title t={t} a={B.tipis} b={B.lipat} small="Ringannya karena" big="TIPIS ± 1 MM" size={110} />
      <Title t={t} a={B.lipat} b={B.ringan} small="Dilipat jadi profil," big="JADI KUAT" />
      <Title t={t} a={B.ringan} b={B.salah} small="Rangkanya cuma" big="± 1/3 BERAT KAYU" size={92} />
      <Title t={t} a={B.rayap} b={B.baja} small="Musuh kayu:" big="RAYAP" size={130} />
      <Title t={t} a={B.baja} b={B.payoff} small="Musuh baja ringan:" big="KARAT & SALAH PASANG" size={76} />
      <Title t={t} a={B.payoff} b={B.cekBaja} small="Atap awet bukan soal bahan," big="TAPI MUSUHNYA" size={104} />
      <Title t={t} a={B.cekBaja} b={B.cekKayu} small="Beli baja ringan?" big="CEK TEBALNYA" bigColor={K.sage} />
      <Title t={t} a={B.cekKayu} b={B.simpan} small="Beli kayu? Tanya:" big="SUDAH DIAWETKAN?" bigColor={K.sage} size={88} />
      <Title t={t} a={B.simpan} b={B.tanya} small="Mau ganti atap?" big="SIMPAN INI" bigColor={K.sage} />

      {/* ---------- label & panel ---------- */}
      <Chip x={Math.min(880, hookProf[0])} y={hookProf[1] + 230} p={r(t, 1.0, 1.4) * (1 - r(t, 2.4, 2.7))} text="baja ringan" />
      <Chip x={Math.max(180, hookBeam[0] + 120)} y={hookBeam[1] - 150} p={r(t, 1.2, 1.6) * (1 - r(t, 2.4, 2.7))} text="kayu" />
      <Chip x={sawSteel[0]} y={sawSteel[1] - 150} p={r(t, 3.7, 4.1) * (1 - r(t, 6.6, 6.95))} text="baja" size={44} />
      <Chip x={sawWood[0]} y={sawWood[1] - 150} p={r(t, 3.9, 4.3) * (1 - r(t, 6.6, 6.95))} text="kayu" />
      <Chip x={540} y={1250} p={r(t, 5.3, 5.7, Easing.out(Easing.back(2))) * (1 - r(t, 6.6, 6.95))} text="> 10× lebih berat" color={CORAL} size={52} />
      <Callout from={[secPt[0] - 6, secPt[1]]} to={[Math.max(80, secPt[0] - 330), secPt[1] + 330]} label="± 1 mm" sub="tebal dilebih-lebihkan" p={r(t, 8.6, 9.3) * (1 - r(t, 9.9, 10.2))} />
      <Chip x={540} y={1280} p={r(t, 11.0, 11.4) * (1 - r(t, 12.0, 12.2))} text="lembar tipis → ditekuk" size={40} />
      {t > 12.3 && t < B.salah && <div style={{position: 'absolute', left: 70, right: 70, top: 930, height: 470, borderRadius: 28, background: 'rgba(250,249,246,0.94)', boxShadow: '0 12px 40px rgba(28,28,30,0.12)', opacity: r(t, 12.35, 12.7) * (1 - r(t, 14.7, 15.0))}} />}
      {t > 12.3 && t < B.salah && <StatPanel rows={[{icon: 'baja', to: 7, pre: '± ', suf: ' kg/m²', label: 'rangka baja ringan (perkiraan)'}, {icon: 'kayu', to: 20, pre: '± ', suf: ' kg/m²', label: 'rangka kayu (perkiraan)', accent: CORAL}]} start={Math.round(12.4 * FPS)} y={950} out={Math.round(14.7 * FPS)} />}
      {t > 23.7 && t < B.baja && <div style={{position: 'absolute', left: 70, right: 70, top: 1090, height: 250, borderRadius: 28, background: 'rgba(250,249,246,0.94)', boxShadow: '0 12px 40px rgba(28,28,30,0.12)', opacity: r(t, 23.75, 24.1) * (1 - r(t, 26.0, 26.3))}} />}
      {t > 23.7 && t < B.baja && <StatPanel rows={[{icon: 'rayap', to: 2.8, dec: 1, pre: 'Rp', suf: ' T', label: 'kerugian per tahun di Indonesia (perkiraan)', accent: CORAL}]} start={Math.round(23.8 * FPS)} y={1110} out={Math.round(26.0 * FPS)} />}
      <Callout from={rustPt} to={[Math.min(780, rustPt[0] - 80), rustPt[1] + 300]} label="Karat" sub="dekat laut lebih cepat" p={r(t, 28.0, 28.7) * (1 - r(t, 29.3, 29.6))} />
      <Chip x={540} y={1260} p={r(t, 29.6, 30.0) * (1 - r(t, 31.9, 32.3))} text="sekrup dihemat" color={CORAL} size={48} />
      {(() => { const pw = proj(c2, [-1.05, -0.4, 0]), ps = proj(c2, [1.05, -0.3, 0]); const p = r(t, 33.4, 33.9, Easing.out(Easing.back(1.6))) * (1 - r(t, 36.7, 37.2));
        return <><Chip x={pw[0]} y={pw[1] + 230} p={p} text="rayap" color={CORAL} /><Chip x={ps[0]} y={ps[1] + 230} p={r(t, 33.7, 34.2, Easing.out(Easing.back(1.6))) * (1 - r(t, 36.7, 37.2))} text="karat" color={CORAL} /></>; })()}
      <Loupe x={600} y={1000} p={r(t, 38.6, 39.2) * (1 - r(t, 40.8, 41.1))} />
      {(() => { const pw = proj(ce, [-1.05, -0.4, 0]); const p = r(t, 41.9, 42.4, Easing.out(Easing.back(1.6))) * (1 - r(t, 43.8, 44.1));
        return <><Chip x={Math.max(200, pw[0])} y={pw[1] + 220} p={p} text="kelas awet?" color={INK} size={44} /><Chip x={Math.max(200, pw[0])} y={pw[1] + 310} p={r(t, 42.8, 43.2, Easing.out(Easing.back(1.6))) * (1 - r(t, 43.8, 44.1))} text="diawetkan ✓" color={K.sage} size={44} /></>; })()}
      <Bookmark p={r(t, 44.3, 44.8) * (1 - r(t, 45.9, 46.2))} />

      {/* ---------- dua kubu: cincin → layar koral ---------- */}
      <FocusRing x={540} y={1000} r={150} start={Math.round(14.3 * FPS)} flood={flood} floodOut={floodOut} />
      {pbIn > 0 && <AbsoluteFill style={{opacity: pbIn}}><TwoCamps t={t} /><Grain o={0.12} id="gpb7" /></AbsoluteFill>}

      {/* ---------- ajak komentar + follow ---------- */}
      <CommentBubble word="kayu / baja?" start={Math.round(46.3 * FPS)} y={600} out={Math.round(51.8 * FPS)} />
      <FollowButton start={Math.round(48.8 * FPS)} click={Math.round(50.0 * FPS)} y={1250} />
      <Captions ms={t * 1000} />

      <Ornament cx={1030} cy={150} size={360} start={0} accent={accent} />
      <Ornament cx={40} cy={1800} size={360} start={6} accent={accent} />
      <Grain o={0.05} id="g7" />

      <Audio src={staticFile('v07/vo.mp3')} />
      <Audio src={staticFile('v07/sfx/ambient.wav')} volume={0.1} />
      {SFX.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`v07/sfx/${n}.wav`)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
