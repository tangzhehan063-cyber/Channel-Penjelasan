// Moodboard #13 "Kaca pecah karena sound horeg": 1 frame = 1 adegan kunci (still), kamera 2,5D ortografis.
// Identitas channel tetap (latar kertas, kicker, TikTokBox, TwoTier, PatternBreak); objek warna pekat.
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {Grain, TikTokBox, TwoTier, PatternBreak, C} from '../aset/Aset';
import {PaperPlus, Kicker, Ornament} from '../aset/Gabung';
import {Env} from '../pengetahuan/Scene';
import {Edges} from '@react-three/drei';

export const M13_FRAMES = 6;
export const P13 = {
  wallA: '#5d8fd6', wallB: '#ef7663', roofA: '#3f6fb8', roofB: '#c95a46', frame: '#2a2522', glass: '#5fb4d6', glassHi: '#bfe6f5',
  truck: '#2b2b30', speaker: '#141416', cone: '#3a3a40', coral: '#e2563f', ink: '#1c1c1e', paper: '#f8f6f0', base: '#d9d4c7',
};

// ---------- kaca: bidang bersegmen yang bisa melengkung (ayunan resonansi) ----------
const Glass: React.FC<{w: number; h: number; flex?: number}> = ({w, h, flex = 0}) => {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(w, h, 20, 20), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const u = p.getX(i) / w + 0.5, v = p.getY(i) / h + 0.5; p.setZ(i, flex * Math.sin(Math.PI * u) * Math.sin(Math.PI * v)); }
    g.computeVertexNormals(); return g;
  }, [w, h, flex]);
  return (
    <group>
      <mesh geometry={geo}><meshPhysicalMaterial clearcoat={1} clearcoatRoughness={0.1} color={P13.glass} roughness={0.15} metalness={0.1} transparent opacity={0.92} side={THREE.DoubleSide} /></mesh>
      {/* kilau diagonal kertas */}
      <mesh position={[-w * 0.12, h * 0.1, 0.012 + flex * 0.6]} rotation={[0, 0, 0.7]}><planeGeometry args={[w * 0.09, h * 0.9]} /><meshBasicMaterial color={P13.glassHi} toneMapped={false} transparent opacity={0.8} /></mesh>
    </group>
  );
};

// retak bercabang dari satu titik (gompal di tepi)
type Seg = [number, number, number, number];
function crackSegs(ox: number, oy: number, seed: string, n = 6, len = 0.6): Seg[] {
  const out: Seg[] = [];
  for (let b = 0; b < n; b++) {
    let x = ox, y = oy, a = Math.PI * (0.05 + 0.5 * (b / (n - 1))) + (random(`${seed}a${b}`) - 0.5) * 0.3;
    const steps = 4 + Math.floor(random(`${seed}s${b}`) * 3);
    for (let s = 0; s < steps; s++) {
      const L = (len / steps) * (0.6 + random(`${seed}l${b}${s}`) * 0.8);
      a += (random(`${seed}t${b}${s}`) - 0.5) * 0.7;
      const nx = x + Math.cos(a) * L, ny = y + Math.sin(a) * L; out.push([x, y, nx, ny]); x = nx; y = ny;
    }
  }
  return out;
}
const Crack: React.FC<{segs: Seg[]; k: number; z?: number; wdt?: number}> = ({segs, k, z = 0.03, wdt = 0.018}) => (
  <group position={[0, 0, z]}>
    {segs.slice(0, Math.ceil(segs.length * k)).map(([ax, ay, bx, by], i) => {
      const len = Math.hypot(bx - ax, by - ay), ang = Math.atan2(by - ay, bx - ax);
      return (
        <group key={i} position={[(ax + bx) / 2, (ay + by) / 2, 0]} rotation={[0, 0, ang]}>
          <mesh position={[0.006, -0.006, -0.002]}><planeGeometry args={[len + wdt, wdt * 2.2]} /><meshBasicMaterial color={P13.paper} toneMapped={false} /></mesh>
          <mesh><planeGeometry args={[len + wdt, wdt]} /><meshBasicMaterial color={P13.ink} toneMapped={false} /></mesh>
        </group>
      );
    })}
  </group>
);

// ---------- jendela: kusen + kaca ----------
const Window: React.FC<{w: number; h: number; flex?: number; crack?: number; chip?: boolean}> = ({w, h, flex = 0, crack = 0, chip = false}) => {
  const t = 0.07, segs = useMemo(() => crackSegs(-w / 2 + 0.06, -h / 2 + 0.06, `c${w}`, 6, Math.min(w, h) * 0.9), [w, h]);
  return (
    <group>
      {[[0, h / 2 + t / 2, w + 2 * t, t], [0, -h / 2 - t / 2, w + 2 * t, t], [-w / 2 - t / 2, 0, t, h], [w / 2 + t / 2, 0, t, h]].map(([x, y, ww, hh], i) => (
        <mesh key={i} position={[x, y, 0.03]} castShadow><boxGeometry args={[ww, hh, 0.08]} /><meshPhysicalMaterial clearcoat={0.4} clearcoatRoughness={0.3} color={P13.frame} roughness={0.8} /></mesh>
      ))}
      <Glass w={w} h={h} flex={flex} />
      {chip && <mesh position={[-w / 2 + 0.035, -h / 2 + 0.035, 0.02]} rotation={[0, 0, 0.4]}><circleGeometry args={[0.05, 3]} /><meshBasicMaterial color={P13.paper} toneMapped={false} /></mesh>}
      {crack > 0 && <Crack segs={segs} k={crack} />}
    </group>
  );
};

// ---------- rumah kertas ----------
const House: React.FC<{x: number; wall: string; roof: string; crack?: number; chip?: boolean; flex?: number}> = ({x, wall, roof, crack = 0, chip, flex = 0}) => {
  const W = 1.5, H = 1.2;
  const roofShape = useMemo(() => { const s = new THREE.Shape(); s.moveTo(-W / 2 - 0.15, 0); s.lineTo(0, 0.62); s.lineTo(W / 2 + 0.15, 0); s.lineTo(-W / 2 - 0.15, 0); return s; }, []);
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow><boxGeometry args={[W, H, 0.9]} /><meshPhysicalMaterial clearcoat={0.4} clearcoatRoughness={0.3} color="#fbfaf6" roughness={0.55} /><Edges color={P13.ink} lineWidth={2.5} /></mesh>
      <mesh position={[0, H, -0.5]} castShadow><extrudeGeometry args={[roofShape, {depth: 1.0, bevelEnabled: false}]} /><meshPhysicalMaterial clearcoat={0.4} clearcoatRoughness={0.3} color={wall} roughness={0.55} /><Edges color={P13.ink} lineWidth={2.5} threshold={20} /></mesh>
      <group position={[-0.2, H * 0.52, 0.46]}><Window w={0.62} h={0.5} crack={crack} chip={chip} flex={flex} /></group>
      <mesh position={[0.48, 0.32, 0.455]}><boxGeometry args={[0.3, 0.62, 0.02]} /><meshPhysicalMaterial clearcoat={0.4} clearcoatRoughness={0.3} color={roof} /></mesh>
    </group>
  );
};

// ---------- truk sound horeg ----------
const Truck: React.FC<{x: number}> = ({x}) => (
  <group position={[x, 0, 1.3]}>
    <mesh position={[0.85, 0.42, 0]} castShadow><boxGeometry args={[0.55, 0.62, 0.7]} /><meshPhysicalMaterial clearcoat={0.4} clearcoatRoughness={0.3} color={P13.coral} roughness={0.8} /></mesh>
    <mesh position={[0.98, 0.55, 0.36]}><planeGeometry args={[0.24, 0.22]} /><meshPhysicalMaterial clearcoat={0.4} clearcoatRoughness={0.3} color={P13.glass} /></mesh>
    <mesh position={[-0.15, 0.2, 0]} castShadow><boxGeometry args={[1.5, 0.14, 0.72]} /><meshPhysicalMaterial clearcoat={0.4} clearcoatRoughness={0.3} color={P13.truck} /></mesh>
    {[-0.5, 0.08].map((wx) => [0, 1].map((row) => (
      <group key={`${wx}${row}`} position={[wx - 0.15, 0.55 + row * 0.62, 0]}>
        <mesh castShadow><boxGeometry args={[0.56, 0.6, 0.6]} /><meshPhysicalMaterial clearcoat={0.4} clearcoatRoughness={0.3} color={P13.speaker} roughness={0.7} /></mesh>
        <mesh position={[0, 0, 0.305]}><circleGeometry args={[0.22, 32]} /><meshPhysicalMaterial clearcoat={0.4} clearcoatRoughness={0.3} color={P13.cone} /></mesh>
        <mesh position={[0, 0, 0.31]}><circleGeometry args={[0.07, 24]} /><meshPhysicalMaterial clearcoat={0.4} clearcoatRoughness={0.3} color={P13.coral} /></mesh>
      </group>
    )))}
    {[-0.65, 0.55].map((wx) => <mesh key={wx} position={[wx, 0.09, 0.37]}><circleGeometry args={[0.12, 24]} /><meshPhysicalMaterial clearcoat={0.4} clearcoatRoughness={0.3} color={P13.ink} /></mesh>)}
  </group>
);

// cincin gelombang bass (koral, makin pudar)
const Rings: React.FC<{x: number; y: number; z: number; n?: number; r0?: number}> = ({x, y, z, n = 4, r0 = 0.5}) => (
  <group position={[x, y, z]}>
    {Array.from({length: n}, (_, i) => <mesh key={i}><ringGeometry args={[r0 + i * 0.38, r0 + i * 0.38 + 0.05, 64]} /><meshBasicMaterial color={P13.coral} toneMapped={false} transparent opacity={0.9 - i * 0.2} /></mesh>)}
  </group>
);

const Rig: React.FC<{x: number; y: number; zoom: number}> = ({x, y, zoom}) => {
  const {camera} = useThree();
  camera.position.set(x + 9, y + 14, 30); camera.lookAt(x, y, 0);
  (camera as THREE.OrthographicCamera).zoom = zoom; camera.updateProjectionMatrix();
  return null;
};
const Base: React.FC<{w: number}> = ({w}) => <mesh position={[0, -0.04, 0.4]} receiveShadow><boxGeometry args={[w, 0.06, 2.6]} /><meshPhysicalMaterial clearcoat={0.4} clearcoatRoughness={0.3} color={P13.base} roughness={1} /></mesh>;

const Stage: React.FC<{cam: [number, number, number]; children: React.ReactNode}> = ({cam, children}) => (
  <ThreeCanvas width={1080} height={1920} shadows orthographic camera={{position: [0, 4, 30], zoom: 200, near: 0.1, far: 100}} gl={{alpha: true, antialias: true}}>
    <Rig x={cam[0]} y={cam[1]} zoom={cam[2]} />
    <Env intensity={0.35} /><hemisphereLight args={['#fffaf0', '#cfc6b4', 0.6]} />
    <directionalLight position={[2.5, 4.5, 3.0]} intensity={2.2} color="#fff4e6" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-radius={6} shadow-bias={-0.0004} />
    <directionalLight position={[-3, 1.5, 2]} intensity={0.35} color="#ffe2da" />
    {children}
  </ThreeCanvas>
);

const Title: React.FC<{small: string; big: string; color?: string; size?: number; top?: number}> = ({small, big, color = P13.coral, size = 104, top = 450}) => (
  <div style={{position: 'absolute', left: 60, top, maxWidth: 960, padding: '20px 30px 24px', borderRadius: 26, background: 'rgba(250,249,246,0.95)', boxShadow: '0 12px 40px rgba(28,28,30,0.18)', fontFamily: 'Inter', color: C.ink}}>
    <div style={{fontSize: 50, fontWeight: 700, letterSpacing: -1}}>{small}</div>
    <div style={{whiteSpace: 'nowrap', fontSize: size, fontWeight: 900, letterSpacing: -2, lineHeight: 1.0, color, marginTop: 6}}>{big}</div>
  </div>
);
const Sub: React.FC<{pre: string; hi: string; post?: string}> = ({pre, hi, post = ''}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 1400, display: 'flex', justifyContent: 'center'}}>
    <div style={{fontFamily: 'Inter', fontWeight: 700, fontSize: 54, color: C.ink, background: 'rgba(250,249,246,0.95)', borderRadius: 18, padding: '10px 26px', boxShadow: '0 8px 30px rgba(28,28,30,0.15)'}}>{pre} <span style={{color: P13.coral}}>{hi}</span> {post}</div>
  </div>
);
const Orn: React.FC = () => (<><Ornament cx={1030} cy={150} size={360} start={0} /><Ornament cx={40} cy={1800} size={360} start={0} /></>);
const Head: React.FC<{q: string}> = ({q}) => (<><Kicker text="FAKTA RUMAH · #13" y={292} start={0} /><TikTokBox text={q} p={1} y={338} size={40} /></>);
const Tag: React.FC<{x: number; y: number; text: string; color?: string}> = ({x, y, text, color = C.ink}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', fontFamily: 'Inter', fontWeight: 800, fontSize: 40, color, background: 'rgba(250,249,246,0.97)', border: `3px solid ${color}`, borderRadius: 14, padding: '6px 18px'}}>{text}</div>
);

export const Mood13: React.FC = () => {
  const s = useCurrentFrame();
  const Q = 'Kaca pecah karena sound horeg?';
  return (
    <AbsoluteFill>
      <PaperPlus />
      {s === 0 && (<>
        <Stage cam={[0, 1.55, 250]}>
          <Base w={4.6} />
          <House x={-0.85} wall={P13.wallB} roof={P13.roofB} crack={1} chip />
          <House x={0.85} wall={P13.wallA} roof={P13.roofA} />
          <group position={[-1.3, 0, 1.1]} scale={0.6}><Truck x={0} /></group>
          <Rings x={-1.45} y={0.6} z={2.0} n={3} r0={0.45} />
        </Stage>
        <Head q={Q} />
        <Tag x={290} y={560} text="tetangga" color={P13.coral} /><Tag x={800} y={560} text="rumahmu" color={P13.wallA} />
        <Title small="Kaca tetangga pecah," big="KACAMU AMAN?" /><Sub pre="kaca rumahmu" hi="utuh." />
      </>)}
      {s === 1 && <PatternBreak lines={['KARENA', 'KENCANGNYA?']} sub="angkanya bilang lain" p={1} />}
      {s === 2 && (<>
        <Head q={Q} />
        {/* meteran kertas: horeg 135 dB di bawah garis kaca pecah 150 dB */}
        {[{x: 330, v: 135, label: 'sound horeg', col: P13.coral}, {x: 750, v: 150, label: 'kaca utuh pecah', col: P13.wallA}].map((b) => (
          <div key={b.x}>
            <div style={{position: 'absolute', left: b.x - 110, top: 1250 - (b.v - 90) * 11, width: 220, height: (b.v - 90) * 11, background: b.col, borderRadius: '18px 18px 0 0', boxShadow: '12px 12px 0 rgba(28,28,30,0.15)'}} />
            <div style={{position: 'absolute', left: b.x - 160, width: 320, top: 1250 - (b.v - 90) * 11 - 110, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 92, color: b.col}}>{b.v}<span style={{fontSize: 44}}> dB</span></div>
            <div style={{position: 'absolute', left: b.x - 160, width: 320, top: 1270, textAlign: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: 36, color: C.ink}}>{b.label}</div>
          </div>
        ))}
        <div style={{position: 'absolute', left: 120, right: 120, top: 1250 - 60 * 11, borderTop: '5px dashed #1c1c1e'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1350, textAlign: 'center', fontFamily: 'Space Mono, monospace', fontSize: 30, color: C.sub}}>(perkiraan, data ledakan)</div>
      </>)}
      {s === 3 && (<>
        <Stage cam={[0, 0.35, 480]}>
          <Window w={1.35} h={1.1} flex={0.16} />
          <Rings x={0} y={0} z={-0.5} n={5} r0={0.95} />
        </Stage>
        <Head q={Q} />
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          {[{y: 1420, col: P13.wallA, l: 'getar kaca'}, {y: 1560, col: P13.coral, l: 'getar bass'}].map((w) => (
            <g key={w.y}>
              <path d={Array.from({length: 61}, (_, i) => `${i ? 'L' : 'M'}${150 + i * 13} ${w.y + Math.sin(i / 4) * 34}`).join(' ')} stroke={w.col} strokeWidth={9} fill="none" strokeLinecap="round" />
              <text x={150} y={w.y - 48} fontFamily="Inter" fontWeight={800} fontSize={34} fill={w.col}>{w.l}</text>
            </g>
          ))}
        </svg>
        <Tag x={540} y={1690} text="±20 kali per detik · sama" color={C.ink} />
      </>)}
      {s === 4 && (<>
        <Stage cam={[0, 0.2, 560]}>
          <Window w={1.35} h={1.1} crack={1} chip />
        </Stage>
        <Head q={Q} />
        <div style={{position: 'absolute', left: 70, top: 1130, width: 200, height: 200, borderRadius: '50%', border: `8px solid ${P13.coral}`}} />
        <Tag x={430} y={1420} text="gompal kecil di tepi" color={P13.coral} />
      </>)}
      {s === 5 && (<>
        <Stage cam={[0, 1.4, 250]}>
          <Base w={4.6} />
          <House x={-0.85} wall={P13.wallB} roof={P13.roofB} crack={1} chip />
          <House x={0.85} wall={P13.wallA} roof={P13.roofA} />
        </Stage>
        <Kicker text="FAKTA RUMAH · #13" y={292} start={0} />
        <Title small="Bass yang getarnya sama" big="+ PINGGIR GOMPAL" size={96} /><Sub pre="ditambah pinggir kaca yang" hi="gompal." />
      </>)}
      {s !== 1 && <Orn />}
      <Grain o={0.08} />
    </AbsoluteFill>
  );
};
