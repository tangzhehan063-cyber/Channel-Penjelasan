// Kit Penjelasan / objek: retak bergerigi ala retak tembok (R4 #21). Garis gelap berlebar berubah + cabang halus, datar (bukan tekstur foto).
// Bentuk dibuat deterministik (tanpa Math.random) supaya sama di setiap frame.
import {useMemo} from 'react';
import * as THREE from 'three';

const h = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const WARNA = '#25262b';

/** poligon retak sepanjang sumbu Y dari y0 ke y1, di sekitar x = cx. w = lebar rata-rata. */
function poligon(y0: number, y1: number, w: number, seed: number, cx = 0, amp = 0.085): THREE.Shape {
  const n = Math.max(8, Math.round(Math.abs(y1 - y0) / 0.07));
  let c = 0;
  const L: [number, number][] = [], R: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const k = i / n, y = y0 + (y1 - y0) * k;
    c += (h(i + seed) - 0.5) * 0.11; c = Math.max(-amp, Math.min(amp, c * 0.92));
    const taper = 0.45 + 0.55 * Math.sin(Math.PI * Math.min(1, 0.15 + k * 0.85));
    const wi = Math.max(0.006, w * (0.55 + 0.9 * h(i * 3 + seed + 7)) * taper);
    L.push([cx + c - wi / 2, y]); R.push([cx + c + wi / 2, y]);
  }
  const s = new THREE.Shape();
  L.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  R.reverse().forEach(([x, y]) => s.lineTo(x, y));
  s.closePath();
  return s;
}
/** cabang halus: dari titik (x,y) menuju arah sudut a, panjang len */
function cabang(x: number, y: number, a: number, len: number, w: number, seed: number): THREE.Shape {
  const n = 7, P: [number, number][] = [];
  let px = x, py = y, ang = a;
  for (let i = 0; i <= n; i++) { P.push([px, py]); ang += (h(i + seed) - 0.5) * 0.9; px += Math.cos(ang) * len / n; py += Math.sin(ang) * len / n; }
  const s = new THREE.Shape();
  P.forEach(([qx, qy], i) => { const t = 1 - i / n, ww = Math.max(0.004, w * t); (i ? s.lineTo(qx - ww / 2, qy) : s.moveTo(qx - ww / 2, qy)); });
  [...P].reverse().forEach(([qx, qy], j) => { const i = n - j, t = 1 - i / n, ww = Math.max(0.004, w * t); s.lineTo(qx + ww / 2, qy); });
  s.closePath();
  return s;
}

const Bentuk: React.FC<{shape: THREE.Shape}> = ({shape}) => {
  const geo = useMemo(() => new THREE.ShapeGeometry(shape), [shape]);
  return <mesh geometry={geo}><meshBasicMaterial color={WARNA} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-3} polygonOffsetUnits={-3} /></mesh>;
};

/** Satu bidang retak. bidang 'atas': permukaan datar (sumbu panjang = z dari z0 ke z1, y = tinggi). 'muka': dinding menghadap +z (sumbu panjang = y dari y0 ke y1, z = posisi). */
export const Retak: React.FC<{g: number; bidang: 'atas' | 'muka'; a0: number; a1: number; pos: number; seed?: number}> = ({g, bidang, a0, a1, pos, seed = 1}) => {
  const w = 0.022 + g * 1.05;
  const utama = useMemo(() => poligon(a0, a1, w, seed), [a0, a1, w, seed]);
  const mid = (a0 + a1) / 2, span = Math.abs(a1 - a0);
  const cb = useMemo(() => g > 0.02 ? [cabang(0.0, a0 + (a1 - a0) * 0.35, 0.9, 0.42, 0.03, seed + 11), cabang(0.0, a0 + (a1 - a0) * 0.65, Math.PI - 0.8, 0.36, 0.026, seed + 23)] : [], [g > 0.02, a0, a1, seed]);
  const isi = <>{<Bentuk shape={utama} />}{cb.map((c, i) => <Bentuk key={i} shape={c} />)}</>;
  if (bidang === 'atas') return <group position={[0, pos, 0]} rotation={[-Math.PI / 2, 0, 0]}><group scale={[1, -1, 1]}>{isi}</group></group>;
  return <group position={[0, 0, pos]}>{isi}</group>;
};
