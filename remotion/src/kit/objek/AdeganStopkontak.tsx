// Kit Penjelasan / objek: adegan-adegan stop kontak (dari Scene #20). Jendela waktu animasi dikirim dari beats.json (`w`, detik absolut).
import * as THREE from 'three';
import {Easing} from 'remotion';
import {Bx, Cy, Sp} from '../prim';
import {lerp3, r, type V3} from '../waktu';
import {Iron, Outlet, Plug} from './Stopkontak';

export type Warna = {accent: string; good: string};
export type AdeganP = {t: number; mode: string; w?: Record<string, [number, number]>; warna: Warna};
const W = (w: AdeganP['w'], k: string, d: [number, number]) => (w && w[k]) || d;

/** mode: hook | klip | colok | tanpa | cek | bocor */
export const AdeganStopkontak: React.FC<AdeganP> = ({t, mode, w, warna}) => {
  if (mode === 'hook') return <Outlet warna={warna} />;
  if (mode === 'klip') return <Outlet warna={warna} glow={r(t, ...W(w, 'glow', [17.8, 18.4]))} ring={r(t, ...W(w, 'ring', [18.6, 19.2]))} />;
  if (mode === 'cek') return <Outlet warna={warna} ring={r(t, ...W(w, 'ring', [45.2, 46.0]))} glow={0} />;
  if (mode === 'colok' || mode === 'tanpa') {
    const z0 = 2.2 - 1.71 * r(t, ...W(w, 'colok', mode === 'colok' ? [23.0, 26.6] : [38.0, 41.0]), Easing.inOut(Easing.cubic)); // pin tiba di pelat saat z0 = 0.49
    const glow = mode === 'colok' && z0 < 0.95 ? 1 : 0;
    return <group><Outlet warna={warna} glow={glow} clips={mode === 'colok'} /><Plug warna={warna} z0={z0} glow={glow} /></group>;
  }
  // bocor: setrika kiri, stop kontak + steker kanan; arus bocor lari lewat jalur ground hijau: badan setrika -> klip -> tanah
  const s = r(t, ...W(w, 'arus', [29.2, 34.0]), Easing.linear);
  const pts: V3[] = [[-0.55, 0.0, 0.5], [0.68, -0.2, 0.5], [0.68, -1.1, 0.0], [0.68, -1.9, 0.0]];
  const seg = Math.min(2.999, s * 3), i = Math.floor(seg), f = seg - i;
  const cur = lerp3(pts[i], pts[i + 1], f);
  return (
    <group>
      <group position={[1.15, -0.1, 0]}><Outlet warna={warna} glow={1} /><Plug warna={warna} z0={0.49} glow={1} /></group>
      <Iron warna={warna} p={[-0.95, -0.35, 0.4]} spark={r(t, ...W(w, 'percik', [29.0, 29.6]))} />
      {[0, 1, 2].map((q) => { const a = pts[q], b = pts[q + 1], m = lerp3(a, b, 0.5); const d = new THREE.Vector3(...b).sub(new THREE.Vector3(...a)); const len = d.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); const eu = new THREE.Euler().setFromQuaternion(quat);
        return <Cy key={q} p={m} rad={0.05} h={len} c={warna.good} rot={[eu.x, eu.y, eu.z]} edge={false} />; })}
      <Bx p={[0, -2.2, 0.2]} s={[3.8, 0.5, 1.6]} c="#a07850" />
      {s > 0 && s < 1 && <Sp p={cur} rad={0.13} c={warna.accent} />}
    </group>
  );
};
