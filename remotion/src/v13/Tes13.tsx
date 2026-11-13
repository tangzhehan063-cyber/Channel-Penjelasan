// Tes gaya #13: tembok bata kertas retak, kamera 2,5D (ortografis, sudut tetap; hanya geser/zoom + parallax lapisan).
// Warna berani (bukan pastel). Port logika retak tangga dari arsip/origami/01-bata-selang-seling/explainer.js.
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {Grain, TikTokBox} from '../aset/Aset';

export const T13_FRAMES = 150;
const P = {bg: '#16307a', bg2: '#0f2260', brick: '#e8542e', brickHi: '#ff7a4d', mortar: '#ffe9c2', ink: '#14110f', sun: '#ffc531', leaf: '#21b36b', paper: '#fff6e3'};
const ease = Easing.inOut(Easing.cubic);
const r = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

// ---------- tembok selang-seling ----------
const BW = 0.62, BH = 0.26, G = 0.045, ROWS = 9, COLS = 5;
type Brick = {r: number; x0: number; x1: number; id: string};
const BRICKS: Brick[] = [];
for (let row = 0; row < ROWS; row++) {
  const off = row % 2 ? -BW / 2 - G / 2 : 0;
  for (let c = -1; c <= COLS; c++) {
    let x0 = off + c * (BW + G), x1 = x0 + BW;
    const L = -0.05, R = COLS * (BW + G) - G + 0.05;
    if (x1 <= L || x0 >= R) continue;
    x0 = Math.max(x0, L); x1 = Math.min(x1, R);
    BRICKS.push({r: row, x0, x1, id: `${row}-${c}`});
  }
}
const WALL_W = COLS * (BW + G) - G + 0.1, X0 = -(COLS * (BW + G) - G) / 2;
const yOf = (row: number) => row * (BH + G);

// jalur retak tangga: turun nat tegak, menyusur nat datar ke nat tegak berikutnya (geser ½ bata), turun lagi
function crackPath(): [number, number][] {
  const hj = (row: number) => { const rw = BRICKS.filter((b) => b.r === row).sort((a, b) => a.x0 - b.x0); return rw.slice(0, -1).map((b, i) => X0 + (b.x1 + rw[i + 1].x0) / 2); };
  const pts: [number, number][] = [];
  let x = hj(ROWS - 1)[3];
  for (let i = 0; i < 7; i++) {
    const row = ROWS - 1 - i, yt = yOf(row) + BH + G / 2, yb = yOf(row) - G / 2;
    if (i) { const nx = hj(row).reduce((a, b) => (Math.abs(b - x - (i % 3 ? -0.2 : 0.2)) < Math.abs(a - x - (i % 3 ? -0.2 : 0.2)) ? b : a)); pts.push([nx, yt]); x = nx; } else pts.push([x, yt - G / 2]);
    pts.push([x, yb]);
  }
  return pts;
}
const CRACK: [number, number][] = (() => {
  const raw = crackPath(), out: [number, number][] = [raw[0]];
  for (let i = 1; i < raw.length; i++) {
    const [ax, ay] = raw[i - 1], [bx, by] = raw[i], n = 4;
    for (let j = 1; j <= n; j++) {
      const u = j / n, jit = j < n ? (random(`j${i}-${j}`) - 0.5) * 0.045 : 0;
      out.push([ax + (bx - ax) * u + (ay !== by ? jit : 0), ay + (by - ay) * u + (ax !== bx ? jit : 0)]);
    }
  }
  return out;
})();
const SEG_LEN = CRACK.slice(1).map((p, i) => Math.hypot(p[0] - CRACK[i][0], p[1] - CRACK[i][1]));
const TOTAL = SEG_LEN.reduce((a, b) => a + b, 0);

const Brk: React.FC<{b: Brick; k: number}> = ({b, k}) => {
  // bata kertas: sedikit miring & beda tinggi acak (rasa potongan tangan); bata di kanan retak bergeser turun saat retak
  const cx = X0 + (b.x0 + b.x1) / 2, w = b.x1 - b.x0, y = yOf(b.r) + BH / 2;
  const rot = (random(`r${b.id}`) - 0.5) * 0.03, dz = random(`z${b.id}`) * 0.03;
  const right = (() => { const ys = yOf(b.r) + BH / 2, pts = CRACK.filter((p) => Math.abs(p[1] - ys) < BH / 2 + G); return pts.length ? cx > pts.reduce((a, p) => a + p[0], 0) / pts.length : false; })();
  const drop = right ? -0.025 * k : 0, tilt = right ? -0.012 * k : 0;
  const hue = random(`h${b.id}`);
  const col = hue > 0.85 ? P.brickHi : hue < 0.12 ? '#c9441f' : P.brick;
  return (
    <group position={[cx + (right ? 0.012 * k : 0), y + drop, 0.06 + dz]} rotation={[0, 0, rot + tilt]}>
      <mesh castShadow receiveShadow><boxGeometry args={[w, BH, 0.09]} /><meshStandardMaterial color={col} roughness={0.95} /></mesh>
      {/* tepi kertas terang di atas = ciri potongan kertas */}
      <mesh position={[0, BH / 2 - 0.006, 0.046]}><boxGeometry args={[w, 0.012, 0.002]} /><meshBasicMaterial color={P.paper} toneMapped={false} /></mesh>
    </group>
  );
};

const Crack: React.FC<{k: number}> = ({k}) => {
  let left = k * TOTAL;
  return (
    <group position={[0, 0, 0.13]}>
      {SEG_LEN.map((L, i) => {
        if (left <= 0) return null;
        const u = Math.min(1, left / L); left -= L;
        const [ax, ay] = CRACK[i], [bx, by] = CRACK[i + 1], ex = ax + (bx - ax) * u, ey = ay + (by - ay) * u;
        const len = Math.hypot(ex - ax, ey - ay), ang = Math.atan2(ey - ay, ex - ax);
        return (
          <group key={i}>
            <mesh position={[(ax + ex) / 2, (ay + ey) / 2, 0]} rotation={[0, 0, ang]}><boxGeometry args={[len + 0.035, 0.035, 0.01]} /><meshBasicMaterial color={P.ink} toneMapped={false} /></mesh>
            <mesh position={[(ax + ex) / 2 + 0.012, (ay + ey) / 2 - 0.012, -0.004]} rotation={[0, 0, ang]}><boxGeometry args={[len + 0.06, 0.06, 0.006]} /><meshBasicMaterial color={P.paper} toneMapped={false} /></mesh>
          </group>
        );
      })}
    </group>
  );
};

// serpihan kertas jatuh dari retakan
const Chips: React.FC<{t: number}> = ({t}) => (
  <group>
    {Array.from({length: 12}, (_, i) => {
      const t0 = 1.4 + i * 0.13, a = t - t0; if (a < 0) return null;
      const p = CRACK[(i * 3) % CRACK.length];
      const x = p[0] + (random(`cx${i}`) - 0.5) * 0.3 + a * 0.25 * (random(`vx${i}`) - 0.5), y = p[1] - 2.4 * a * a, rz = a * 6 * (random(`rz${i}`) + 0.3);
      if (y < -0.3) return null;
      return <mesh key={i} position={[x, y, 0.2]} rotation={[a * 3, 0, rz]} castShadow><planeGeometry args={[0.07, 0.05]} /><meshStandardMaterial color={i % 3 ? P.brick : P.mortar} side={THREE.DoubleSide} /></mesh>;
    })}
  </group>
);

// ---------- kamera 2,5D: ortografis, sudut tetap; hanya geser & zoom ----------
const Rig: React.FC<{x: number; y: number; zoom: number; shake: number}> = ({x, y, zoom, shake}) => {
  const {camera} = useThree();
  camera.position.set(x + shake, y + 1.2 + shake * 0.5, 10);
  camera.lookAt(x + shake, y + shake * 0.5, 0);
  (camera as THREE.OrthographicCamera).zoom = zoom;
  camera.updateProjectionMatrix();
  return null;
};

export const Tes13: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const crack = r(t, 1.0, 2.6, Easing.in(Easing.quad));
  const zoom = interpolate(t, [0, 1, 2.6, 5], [255, 270, 305, 320], {extrapolateRight: 'clamp', easing: ease});
  const camX = interpolate(t, [0, 5], [-0.15, 0.15]);
  const shake = t > 1 && t < 2.8 ? Math.sin(t * 90) * 0.012 * (1 - r(t, 2.2, 2.8)) : 0;
  // parallax: lapisan jauh bergerak lebih lambat (dikali faktor < 1) dari kamera
  const par = (k: number) => camX * (1 - k);
  return (
    <AbsoluteFill style={{background: `radial-gradient(90% 60% at 50% 40%, ${P.bg} 0%, ${P.bg2} 100%)`}}>
      <ThreeCanvas width={1080} height={1920} shadows orthographic camera={{position: [0, 1.2, 10], zoom: 300, near: 0.1, far: 50}} gl={{alpha: true, antialias: true}}>
        <Rig x={camX} y={1.0} zoom={zoom} shake={shake} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[-3, 5, 6]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={5} shadow-camera-bottom={-3} shadow-radius={6} />
        {/* lapisan jauh: matahari + awan kertas */}
        <group position={[par(0.3), 0, -3]}>
          <mesh position={[1.1, 3.4, 0]}><circleGeometry args={[0.55, 48]} /><meshBasicMaterial color={P.sun} toneMapped={false} /></mesh>
          {[[-1.3, 3.0, 0.9], [0.4, 3.75, 0.6]].map(([x, y, s], i) => (
            <group key={i} position={[x, y, 0.1]} scale={s}>
              {[[-0.35, 0, 0.32], [0, 0.12, 0.42], [0.38, 0, 0.3]].map(([cx, cy, cr], j) => <mesh key={j} position={[cx, cy, 0]}><circleGeometry args={[cr, 40]} /><meshBasicMaterial color={P.paper} toneMapped={false} /></mesh>)}
            </group>
          ))}
        </group>
        {/* lapisan tengah: dinding (nat krem di belakang bata) */}
        <mesh position={[0, yOf(ROWS) / 2 - G / 2, 0]} receiveShadow><boxGeometry args={[WALL_W + 0.06, yOf(ROWS) + 0.02, 0.04]} /><meshStandardMaterial color={P.mortar} roughness={1} /></mesh>
        {BRICKS.map((b) => <Brk key={b.id} b={b} k={r(t, 2.0, 2.8, Easing.out(Easing.back(2)))} />)}
        <Crack k={crack} />
        <Chips t={t} />
        {/* lapisan depan: tanah + rumput kertas, bergerak lebih cepat */}
        <group position={[-camX * 0.35, 0, 1.5]}>
          <mesh position={[0, -1.57, 0]} receiveShadow><boxGeometry args={[8, 3, 0.3]} /><meshStandardMaterial color="#7a3d1c" roughness={1} /></mesh>
          {Array.from({length: 14}, (_, i) => (
            <mesh key={i} position={[-2.6 + i * 0.4 + random(`gx${i}`) * 0.15, -0.02, 0.16]} rotation={[0, 0, (random(`ga${i}`) - 0.5) * 0.5]} castShadow>
              <coneGeometry args={[0.09, 0.35 + random(`gh${i}`) * 0.25, 3]} /><meshStandardMaterial color={P.leaf} flatShading />
            </mesh>
          ))}
        </group>
      </ThreeCanvas>
      <TikTokBox text="Retak tangga di tembok, bahaya?" p={r(t, 0.1, 0.9, Easing.linear)} y={300} size={46} />
      <Grain o={0.1} />
    </AbsoluteFill>
  );
};
