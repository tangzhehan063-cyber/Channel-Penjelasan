// Adegan "breakdown" isometrik: potongan dinding berlapis (bata, plester, aci, cat) di atas pondasi + tanah. Dipakai video #25 (dinding retak).
// Gaya: kamera isometrik kit (CanvasIso), warna material NYATA (R1) dan cat tembok biru sebagai lawan latar krem (R2), tepi tinta tipis.
// Struktur (generik, bisa dipakai objek berlapis lain): lapisan terurai (gap), sorot satu lapisan (yang lain meredup), garis retak yang menggambar diri,
// dan "penurunan" (settle): satu sisi turun sehingga retak diagonal terbuka tembus semua lapis. Semua waktu dari `w` (detik absolut, [mulai, selesai]).
import {useMemo} from 'react';
import * as THREE from 'three';
import {Edges} from '@react-three/drei';
import {Easing} from 'remotion';
import {r} from '../waktu';
import {Bx, INK} from '../prim';
import type {AdeganP} from './AdeganStopkontak';

/** warna nyata material (keputusan user 20 Nov: bata, semen, dll seperti dunia nyata; tembok biru melawan krem) */
export const WARNA_DINDING = {
  bata: '#b5543c', bataGelap: '#8f3f2e', spesi: '#a9a59d', plester: '#b8b4ac', aci: '#e6e8e8', cat: '#6e9ac8',
  beton: '#8d8f92', tanah: '#8b6b4a', tanahTurun: '#6f5238', kayu: '#a06f45', kaca: '#bfd9e6', retak: '#2a2724', dempul: '#f1f1ec', pensil: '#e8c547',
};
const C = WARNA_DINDING;

const W = 2.4, H = 1.5;                       // lebar dan tinggi dinding (satuan dunia)
const X0 = 0.35, CX = 1.35, CY = 0.62;        // retak miring: dari dasar (X0,0) ke sudut kiri-bawah jendela (CX,CY), lalu lurus ke atas
type P2 = [number, number];
const LP: P2[] = [[0, 0], [X0, 0], [CX, CY], [CX, H], [0, H]];
const RP: P2[] = [[X0, 0], [W, 0], [W, H], [CX, H], [CX, CY]];
export const RETAK_MIRING: P2[] = [[X0, 0], [CX, CY], [CX, H]];
export const RETAK_HALUS: P2[] = [[0.42, 0.95], [0.5, 1.03], [0.46, 1.11], [0.58, 1.18], [0.54, 1.27], [0.66, 1.33]];
const RETAK_MENDATAR: P2[] = [[0.1, 1.1], [0.7, 1.12], [1.3, 1.08], [2.3, 1.12]];
const RETAK_TANGGA: P2[] = [[0.15, 0.3], [0.35, 0.3], [0.35, 0.42], [0.65, 0.42], [0.65, 0.54], [0.95, 0.54], [0.95, 0.66], [1.15, 0.66]];

// lapisan dari belakang ke depan: [tebal, z awal, kunci waktu sorot]
const LAPIS = [
  {k: 'bata', tebal: 0.46, z: 0.0, warna: C.bata},
  {k: 'plester', tebal: 0.14, z: 0.46, warna: C.plester},
  {k: 'aci', tebal: 0.08, z: 0.6, warna: C.aci},
  {k: 'cat', tebal: 0.06, z: 0.68, warna: C.cat},
];
const GAPZ = 0.38;

const useBata = () => useMemo(() => {
  const c = document.createElement('canvas'); c.width = 256; c.height = 86; const g = c.getContext('2d')!;
  g.fillStyle = C.spesi; g.fillRect(0, 0, 256, 86);
  const sx = 256 / 0.6, sy = 86 / 0.2;
  g.fillStyle = C.bata;
  const bata = (x0: number, y0: number) => g.fillRect(x0 * sx + 3, y0 * sy + 3, 0.3 * sx - 6, 0.1 * sy - 6);
  for (const x of [0, 0.3]) bata(x, 0);
  for (const x of [-0.15, 0.15, 0.45]) bata(x, 0.1);
  g.fillStyle = C.bataGelap; g.fillRect(0, 0, 256, 2);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1 / 0.6, 1 / 0.2); t.colorSpace = THREE.SRGBColorSpace; return t;
}, []);

const Bagian: React.FC<{poly: P2[]; z: number; tebal: number; warna: string; map?: THREE.Texture; op: number}> = ({poly, z, tebal, warna, map, op}) => {
  const geo = useMemo(() => new THREE.ExtrudeGeometry(new THREE.Shape(poly.map(([x, y]) => new THREE.Vector2(x, y))), {depth: tebal, bevelEnabled: false}), [poly, tebal]);
  const tr = op < 0.999;
  return (
    <mesh geometry={geo} position={[0, 0, z]} castShadow>
      <meshStandardMaterial attach="material-0" color={map ? '#ffffff' : warna} map={map} roughness={0.75} transparent={tr} opacity={op} />
      <meshStandardMaterial attach="material-1" color={warna} roughness={0.75} transparent={tr} opacity={op} />
      {op > 0.55 && <Edges color={INK} threshold={20} lineWidth={1.2} />}
    </mesh>
  );
};

/** garis retak yang menggambar diri (p 0..1), kotak tipis datar; flat (tidak terpengaruh cahaya) */
export const Garis: React.FC<{pts: P2[]; z: number; p: number; c?: string; tebal?: number}> = ({pts, z, p, c = C.retak, tebal = 0.034}) => {
  if (p <= 0) return null;
  const seg = pts.slice(1).map((q, i) => ({a: pts[i], b: q, l: Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1])}));
  const tot = seg.reduce((s, x) => s + x.l, 0); let sisa = tot * Math.min(1, p);
  return <>{seg.map((s, i) => {
    if (sisa <= 0) return null; const l = Math.min(s.l, sisa); sisa -= s.l;
    const dx = (s.b[0] - s.a[0]) / s.l, dy = (s.b[1] - s.a[1]) / s.l;
    return <mesh key={i} position={[s.a[0] + dx * l / 2, s.a[1] + dy * l / 2, z]} rotation={[0, 0, Math.atan2(dy, dx)]}><boxGeometry args={[l + tebal * 0.6, tebal, 0.02]} /><meshBasicMaterial color={c} /></mesh>;
  })}</>;
};

const W_ = (w: AdeganP['w'], k: string, d: [number, number]) => (w && w[k]) || d;
const ez = Easing.inOut(Easing.cubic);
const rr = (t: number, a: [number, number]) => r(t, a[0], a[1], ez);

/** mode: dinding (semua adegan memakai satu garis waktu; yang beda hanya kamera). Kunci `w` (detik): lihat bagian `K` di bawah. */
export const AdeganDinding: React.FC<AdeganP> = ({t, w}) => {
  const bata = useBata();
  const g = (k: string, d: [number, number]) => W_(w, k, d);
  // ---- penurunan satu sisi (s): naik/turun beberapa kali sepanjang video
  const s = 0.7 * rr(t, g('turun2', [9.2, 10.2])) - 0.7 * rr(t, g('rapat2', [10.9, 11.3]))
    + rr(t, g('turun', [26.4, 28.4])) - rr(t, g('rapat', [32.9, 33.3])) + rr(t, g('turun3', [36.4, 37.0]))
    + 0.7 * rr(t, g('lebar', [40.2, 41.6])) + 0.5 * rr(t, g('lebar2', [47.6, 48.6]));
  // ---- terurai
  const gap = rr(t, g('gap', [11.4, 12.4])) - rr(t, g('rakit', [24.2, 25.0]));
  // ---- sorot: bata, plester, aci, cat; yang lain meredup selama jendela `redup`
  const redup = rr(t, [g('redup', [12.3, 24.4])[0], g('redup', [12.3, 24.4])[0] + 0.4]) * (1 - rr(t, [g('redup', [12.3, 24.4])[1] - 0.4, g('redup', [12.3, 24.4])[1]]));
  const sorot = (k: string) => { const [a, b] = g(k, [99, 100]); return r(t, a, a + 0.3, ez) * (1 - r(t, b - 0.3, b, ez)); };
  const fokus = LAPIS.map((l) => Math.min(1, sorot('sorot_' + l.k) + sorot('sorot_' + l.k + '2')));
  const op = fokus.map((f) => 1 - redup * (1 - f) * 0.8);
  // ---- garis retak
  const pHook = rr(t, g('hook', [0.3, 1.2])) * (1 - rr(t, g('hookOut', [5.7, 6.1])));
  const pHalus2 = rr(t, g('halus2', [7.2, 8.0])) * (1 - rr(t, g('halus2Out', [10.9, 11.3])));
  const pHalus = rr(t, g('halus', [18.3, 19.5]));
  const dempul = rr(t, g('tambal', [23.2, 23.9]));
  const pMendatar = rr(t, g('mendatar', [33.45, 34.2])) * (1 - rr(t, g('mendatarOut', [34.3, 34.6])));
  const pTangga = rr(t, g('bertangga', [34.5, 35.9])) * (1 - rr(t, g('banggaOut', [36.2, 36.6])));
  const pPensil = rr(t, g('pensil', [42.9, 44.0]));
  // ---- jendela macet
  const macet = rr(t, g('macet', [36.9, 37.6]));
  const zc = (i: number) => LAPIS[i].z + GAPZ * gap * i;
  const zCatDepan = zc(3) + LAPIS[3].tebal + 0.014, zPlesterDepan = zc(1) + LAPIS[1].tebal + 0.014;
  const geserR: [number, number, number] = [0.035 * s, -0.08 * s, 0];
  const tanahWarna = new THREE.Color(C.tanah).lerp(new THREE.Color(C.tanahTurun), Math.min(1, s)).getStyle();
  // pensil mengikuti garis tanda
  const tick: P2[] = [[0.78, 0.4], [0.9, 0.5]];
  const px = lerpPensil(pPensil);
  return (
    <group position={[-W / 2, 0.3, -0.4 - 0.57 * gap]}>
      {/* inti gelap di belakang: terlihat lewat celah retak */}
      <mesh position={[W / 2, H / 2, -0.03]}><boxGeometry args={[W - 0.02, H - 0.02, 0.02]} /><meshBasicMaterial color={C.retak} /></mesh>
      {/* kiri */}
      <group>
        {LAPIS.map((l, i) => <Bagian key={l.k + 'L'} poly={LP} z={zc(i)} tebal={l.tebal} warna={l.warna} map={i === 0 ? bata : undefined} op={op[i]} />)}
      </group>
      {/* kanan (turun) */}
      <group position={geserR}>
        {LAPIS.map((l, i) => <Bagian key={l.k + 'R'} poly={RP} z={zc(i)} tebal={l.tebal} warna={l.warna} map={i === 0 ? bata : undefined} op={op[i]} />)}
        {/* jendela di lapisan cat (ikut sisi kanan) */}
        <group position={[CX, CY, zc(3) + LAPIS[3].tebal]}>
          <Bx p={[0.35, 0.3, 0.03]} s={[0.7, 0.6, 0.06]} c={C.kayu} />
          <group position={[0.35, 0.3, 0.07]} rotation={[0, 0, -0.1 * macet]}><Bx p={[0.04 * macet, -0.03 * macet, 0]} s={[0.56, 0.46, 0.03]} c={C.kaca} /></group>
        </group>
      </group>
      {/* garis retak (di atas lapisan depan) */}
      <Garis pts={RETAK_MIRING} z={zCatDepan} p={pHook} />
      <Garis pts={RETAK_HALUS} z={zCatDepan} p={pHalus2} />
      <Garis pts={RETAK_HALUS} z={zPlesterDepan} p={pHalus} c={dempul > 0.5 ? C.dempul : C.retak} tebal={dempul > 0.5 ? 0.06 : 0.04} />
      <Garis pts={RETAK_MENDATAR} z={zCatDepan} p={pMendatar} tebal={0.04} />
      <Garis pts={RETAK_TANGGA} z={zCatDepan} p={pTangga} tebal={0.04} />
      <Garis pts={tick} z={zCatDepan} p={pPensil} c="#3b3b3b" tebal={0.03} />
      {/* pensil */}
      {pPensil > 0 && t < g('pensilOut', [44.8, 44.8])[0] && (
        <group position={[px[0], px[1], zCatDepan + 0.08]} rotation={[0, 0, -0.75]}>
          <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.035, 0.035, 0.9, 6]} /><meshStandardMaterial color={C.pensil} roughness={0.6} /></mesh>
          <mesh position={[0, 0.02, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.035, 0.12, 6]} /><meshStandardMaterial color="#d9b48a" roughness={0.7} /></mesh>
        </group>
      )}
      {/* pondasi + tanah (kiri tetap, kanan turun) */}
      <Bx p={[(-0.1 + X0) / 2, -0.15, 0.4]} s={[X0 + 0.1, 0.3, 1.0]} c={C.beton} />
      <Bx p={[(X0 + W + 0.1) / 2 + geserR[0], -0.15 + geserR[1], 0.4]} s={[W + 0.1 - X0, 0.3, 1.0]} c={C.beton} />
      <Bx p={[(-0.35 + X0) / 2, -0.6, 0.4]} s={[X0 + 0.35, 0.6, 1.25]} c={C.tanah} />
      <Bx p={[(X0 + W + 0.35) / 2, -0.6 - 0.12 * Math.min(1.4, s) / 2, 0.4]} s={[W + 0.35 - X0, 0.6 + 0.12 * Math.min(1.4, s), 1.25]} c={tanahWarna} />
    </group>
  );
};

/** posisi ujung pensil sepanjang garis tanda (0..1) */
function lerpPensil(p: number): [number, number] { const a: P2 = [0.78, 0.4], b: P2 = [0.9, 0.5]; return [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p]; }
