// Adegan #24 (rumah hook): satu dunia malam yang berjalan terus; hanya kamera yang berganti antar-adegan (seperti #23).
// Rumah sudut dengan dua sisi menghadap dua jalan (L). Mobil lewat dengan berkas lampu datar; fasad dan jendela terkena sinar sesuai sudut sebenarnya.
// Waktu dari beats.json (`w`): sisi [a,b] garis koral dua sisi, angin [a,b] pita angin, panah [a,b] panah harga, pagar [a,b], tanam [a,b].
// Penyederhanaan visual: jalan L dan sudut berkas digambar ideal, bukan peta nyata.
import {useMemo} from 'react';
import * as THREE from 'three';
import {Edges, RoundedBox} from '@react-three/drei';
import {Easing} from 'remotion';
import {r, type V3} from '../waktu';
import {Bx, Cy, Sp, INK} from '../prim';
import {Mobil} from './Kendaraan';
import type {AdeganP} from './AdeganStopkontak';

const DINDING = '#f0e6cf', JENDELA = '#ffd98a', KACA_SILAU = '#fffbe6', JALAN = '#4b5a7e', GARIS = '#e9e4d1', PLOT = '#33426f', KAYU = '#8a5a44';
const SISI = 1.3; // setengah lebar rumah (2,6 x 2,6)
const RR = 1, L1 = 12.2, ARC = (Math.PI / 2) * RR, TOT = 2 * L1 + ARC;

type Pose = {x: number; z: number; hx: number; hz: number};
/** jalur B -> A: lurus di x=3,2 (menuju +z), belok di sudut, lurus di z=3,2 (menuju -x). s = jarak tempuh */
function jalurBA(s: number): Pose {
  if (s < L1) return {x: 3.2, z: -10 + s, hx: 0, hz: 1};
  if (s < L1 + ARC) { const th = (s - L1) / RR; return {x: 2.2 + Math.cos(th), z: 2.2 + Math.sin(th), hx: -Math.sin(th), hz: Math.cos(th)}; }
  return {x: 2.2 - (s - L1 - ARC), z: 3.2, hx: -1, hz: 0};
}
/** lajur kiri (lalu lintas Indonesia): geser 0,3 ke kiri arah gerak */
function pose(rev: boolean, s: number): Pose {
  const p = jalurBA(rev ? TOT - s : s), g = rev ? -1 : 1, hx = g * p.hx, hz = g * p.hz;
  return {x: p.x + hz * 0.3, z: p.z - hx * 0.3, hx, hz};
}

const MOBIL: {rev: boolean; T: number; v: number; warna: string}[] = [
  {rev: false, T: 0.9, v: 8, warna: '#7fa8e8'},
  {rev: true, T: 24.6, v: 8, warna: '#e9e4d4'},
  {rev: false, T: 28.5, v: 8, warna: '#f2c14e'},
  {rev: true, T: 30.0, v: 8, warna: '#7fa8e8'},
  {rev: false, T: 46.6, v: 8, warna: '#7fa8e8'},
];
const sActive = (m: (typeof MOBIL)[number], t: number) => (t - (m.T - (L1 + ARC / 2) / m.v)) * m.v;

const HALF = (34 * Math.PI) / 180, JAUH = 8;
/** seberapa terang titik (px,pz) oleh lampu mobil di pose p */
function sinar(p: Pose, px: number, pz: number) {
  const vx = px - p.x, vz = pz - p.z, d = Math.hypot(vx, vz);
  if (d < 0.01 || d > JAUH) return 0;
  const c = (vx * p.hx + vz * p.hz) / d;
  if (c <= 0) return 0;
  const ang = Math.acos(Math.min(1, c));
  if (ang > HALF) return 0;
  return Math.pow(1 - ang / HALF, 0.7) * (1 - d / JAUH);
}

const NS = 9, LS = (2 * SISI) / NS;
const Baji: React.FC<{p: V3; s: V3; c: string}> = ({p, s, c}) => (
  <RoundedBox args={s} radius={0.1} smoothness={4} position={p} castShadow receiveShadow>
    <meshStandardMaterial color={c} roughness={0.55} /><Edges color={INK} threshold={40} lineWidth={1.4} />
  </RoundedBox>
);

const Atap: React.FC<{c: string}> = ({c}) => {
  const geo = useMemo(() => {
    const sh = new THREE.Shape(); sh.moveTo(-1.62, 0); sh.lineTo(1.62, 0); sh.lineTo(0, 0.85); sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, {depth: 3.2, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 3});
    g.translate(0, 0, -1.6); return g;
  }, []);
  return <mesh geometry={geo} position={[0, 1.8, 0]} rotation={[0, Math.PI / 2, 0]} castShadow><meshStandardMaterial color={c} roughness={0.5} /><Edges color={INK} threshold={35} lineWidth={1.4} /></mesh>;
};

const Baji2: React.FC<{p: V3; s: V3; c: string; o?: number}> = ({p, s, c, o = 1}) => (
  <mesh position={p}><boxGeometry args={s} /><meshBasicMaterial color={c} transparent opacity={o} depthWrite={false} /></mesh>
);

const Sorot: React.FC<{pose: Pose; panjang: number; o: number}> = ({pose: p, panjang, o}) => {
  const geo = useMemo(() => { const w = Math.tan(HALF); const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(-w, 1); s.lineTo(w, 1); s.closePath(); return new THREE.ShapeGeometry(s); }, []);
  return (
    <group position={[p.x + p.hx * 0.75, 0.42, p.z + p.hz * 0.75]} rotation={[0, Math.atan2(p.hx, p.hz), 0]}>
      <mesh geometry={geo} rotation={[Math.PI / 2, 0, 0]} scale={[panjang, panjang, panjang]}><meshBasicMaterial color="#fff3c4" transparent opacity={o} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    </group>
  );
};

const Pita: React.FC<{t: number; a: number; dari: V3; ke: V3; warna: string}> = ({t, a, dari, ke, warna}) => {
  const dir = new THREE.Vector3(ke[0] - dari[0], 0, ke[2] - dari[2]), yaw = Math.atan2(dir.x, dir.z);
  const out: React.ReactElement[] = [];
  for (let lane = 0; lane < 3; lane++) for (let k = 0; k < 6; k++) {
    const f = (((t * 0.45 + k / 6 + lane * 0.13) % 1) + 1) % 1, v = Math.sin(Math.PI * f) * a;
    if (v < 0.02) continue;
    const y = 1.1 + (lane - 1) * 0.17 + Math.sin(f * 6.28 + lane) * 0.07;
    out.push(<group key={`${lane}-${k}`} position={[dari[0] + (ke[0] - dari[0]) * f, y, dari[2] + (ke[2] - dari[2]) * f]} rotation={[0, yaw, 0]} scale={[v, v, 1]}>
      <mesh><boxGeometry args={[0.05, 0.05, 0.3]} /><meshStandardMaterial color={warna} roughness={0.5} /></mesh></group>);
  }
  return <>{out}</>;
};

export const AdeganHook: React.FC<AdeganP> = ({t, w, warna}) => {
  const g = (k: string, d: [number, number]): [number, number] => (w && w[k]) || d;
  const [s0, s1] = g('sisi', [4.3, 7.4]), [a0, a1] = g('angin', [10.9, 21.4]), [p0, p1] = g('panah', [15.2, 21.2]);
  const [f0, f1] = g('pagar', [38.3, 40.3]), [n0, n1] = g('tanam', [40.0, 43.0]);
  const pagar = r(t, f0, f1, Easing.out(Easing.cubic)), tanam = r(t, n0, n1, Easing.out(Easing.cubic));
  const att = 1 - 0.9 * (0.5 * pagar + 0.5 * tanam);
  const cool = warna.cool ?? '#7fa8e8';

  const aktif = MOBIL.map((m) => ({m, s: sActive(m, t)})).filter(({s}) => s >= 0 && s <= TOT).map(({m, s}) => ({m, p: pose(m.rev, s)}));
  const depan = Array.from({length: NS}, (_, i) => Math.min(1, aktif.reduce((a, {p}) => a + sinar(p, -SISI + (i + 0.5) * LS, SISI), 0)) * att);
  const kanan = Array.from({length: NS}, (_, i) => Math.min(1, aktif.reduce((a, {p}) => a + sinar(p, SISI, SISI - (i + 0.5) * LS), 0)) * att);
  const idxD = Math.floor((0.55 + SISI) / LS), idxK1 = Math.floor((SISI - 0.55) / LS), idxK2 = Math.floor((SISI + 0.7) / LS);

  const garisK = r(t, s0, s0 + 1.3), garisD = r(t, s0 + 0.5, s0 + 1.8), garisHilang = r(t, s1, s1 + 0.6);
  const garis = (pa: number) => pa * (1 - garisHilang);
  const panah = r(t, p0, p0 + 0.9, Easing.out(Easing.back(2))), naik = r(t, p0 + 0.9, p1) * 0.7;

  return (
    <group>
      {/* tapak dan jalan L */}
      <Bx p={[0.4, -0.05, 0.4]} s={[4.9, 0.1, 4.9]} c={PLOT} />
      <Bx p={[-4.5, -0.02, 3.2]} s={[17, 0.06, 1.7]} c={JALAN} edge={false} />
      <Bx p={[3.2, -0.02, -4.5]} s={[1.7, 0.06, 17]} c={JALAN} edge={false} />
      {Array.from({length: 12}, (_, i) => <Bx key={`a${i}`} p={[-12 + i * 1.3, 0.03, 3.2]} s={[0.6, 0.02, 0.07]} c={GARIS} edge={false} />)}
      {Array.from({length: 12}, (_, i) => <Bx key={`b${i}`} p={[3.2, 0.03, -12 + i * 1.3]} s={[0.07, 0.02, 0.6]} c={GARIS} edge={false} />)}

      {/* rumah */}
      <Baji p={[0, 0.9, 0]} s={[2.6, 1.8, 2.6]} c={DINDING} />
      <Atap c={warna.accent} />
      <Bx p={[-0.6, 0.55, SISI + 0.02]} s={[0.55, 1.1, 0.06]} c={KAYU} />
      {/* jendela depan (x=0,55) dan kanan (z=0,55 dan -0,7), menyala dari dalam */}
      <Bx p={[0.55, 1.1, SISI + 0.03]} s={[0.7, 0.55, 0.04]} c={JENDELA} />
      <Bx p={[SISI + 0.03, 1.1, 0.55]} s={[0.04, 0.55, 0.7]} c={JENDELA} />
      <Bx p={[SISI + 0.03, 1.1, -0.7]} s={[0.04, 0.55, 0.7]} c={JENDELA} />
      <Sp p={[0.55, 1.03, SISI + 0.06]} rad={0.09} c={INK} />
      <mesh position={[0.55, 0.88, SISI + 0.06]}><boxGeometry args={[0.34, 0.2, 0.03]} /><meshStandardMaterial color={INK} /></mesh>

      {/* sinar di fasad dan silau di jendela */}
      {depan.map((v, i) => v > 0.02 && <Baji2 key={`d${i}`} p={[-SISI + (i + 0.5) * LS, 0.9, SISI + 0.012]} s={[LS * 0.98, 1.7, 0.01]} c="#fff3c4" o={0.5 * v} />)}
      {kanan.map((v, i) => v > 0.02 && <Baji2 key={`k${i}`} p={[SISI + 0.012, 0.9, SISI - (i + 0.5) * LS]} s={[0.01, 1.7, LS * 0.98]} c="#fff3c4" o={0.5 * v} />)}
      {depan[idxD] > 0.02 && <Baji2 p={[0.55, 1.1, SISI + 0.075]} s={[0.7, 0.55, 0.01]} c={KACA_SILAU} o={Math.min(0.95, depan[idxD] * 1.6)} />}
      {kanan[idxK1] > 0.02 && <Baji2 p={[SISI + 0.075, 1.1, 0.55]} s={[0.01, 0.55, 0.7]} c={KACA_SILAU} o={Math.min(0.95, kanan[idxK1] * 1.6)} />}
      {kanan[idxK2] > 0.02 && <Baji2 p={[SISI + 0.075, 1.1, -0.7]} s={[0.01, 0.55, 0.7]} c={KACA_SILAU} o={Math.min(0.95, kanan[idxK2] * 1.6)} />}

      {/* dua sisi: garis koral di kaki dinding yang menghadap jalan */}
      {garis(garisK) > 0.01 && <Bx p={[SISI + 0.42, 0.06, 0.0]} s={[0.1, 0.12, 2.6 * garis(garisK)]} c={warna.accent} edge={false} rot={[0, 0, 0]} />}
      {garis(garisD) > 0.01 && <Bx p={[0.0, 0.06, SISI + 0.42]} s={[2.6 * garis(garisD), 0.12, 0.1]} c={warna.accent} edge={false} />}

      {/* pita angin masuk dari dua arah */}
      <Pita t={t} a={r(t, a0, a0 + 0.8) * (1 - r(t, a1 - 0.6, a1))} dari={[1.6, 1.1, 4.5]} ke={[0.55, 1.1, SISI + 0.1]} warna={cool} />
      <Pita t={t} a={r(t, a0, a0 + 0.8) * (1 - r(t, a1 - 0.6, a1))} dari={[4.5, 1.1, 1.6]} ke={[SISI + 0.1, 1.1, 0.55]} warna={cool} />
      <Pita t={t} a={r(t, a0 + 0.3, a0 + 1.1) * (1 - r(t, a1 - 0.6, a1))} dari={[4.5, 1.1, -0.2]} ke={[SISI + 0.1, 1.1, -0.7]} warna={cool} />

      {/* panah harga naik di atas atap */}
      {panah > 0.01 && (
        <group position={[0.9, 3.1 + naik, 0.9]} scale={[panah, panah, panah]}>
          <Cy p={[0, 0, 0]} rad={0.13} h={0.7} c={warna.accent} rot={[0, 0, 0]} />
          <mesh position={[0, 0.55, 0]} castShadow><coneGeometry args={[0.34, 0.5, 28]} /><meshStandardMaterial color={warna.accent} roughness={0.5} /><Edges color={INK} threshold={30} lineWidth={1.2} /></mesh>
        </group>
      )}

      {/* pagar dan tanaman di sisi tikungan */}
      {pagar > 0.01 && Array.from({length: 10}, (_, i) => {
        const gI = Math.max(0.001, Math.min(1, pagar * 1.6 - i * 0.06));
        const zp = 2.1 - i * 0.385, xp = 2.1 - i * 0.385;
        return (
          <group key={i}>
            <group position={[2.1, 0, zp]} scale={[1, gI, 1]}><Bx p={[0, 0.5, 0]} s={[0.13, 1.0, 0.13]} c="#e8dfc8" /></group>
            {i > 0 && <group position={[xp, 0, 2.1]} scale={[1, gI, 1]}><Bx p={[0, 0.5, 0]} s={[0.13, 1.0, 0.13]} c="#e8dfc8" /></group>}
          </group>
        );
      })}
      {pagar > 0.5 && <Bx p={[2.1, 0.88, 0.35]} s={[0.07, 0.08, 3.9 * Math.min(1, (pagar - 0.5) * 2)]} c="#e8dfc8" edge={false} />}
      {pagar > 0.5 && <Bx p={[0.35, 0.88, 2.1]} s={[3.9 * Math.min(1, (pagar - 0.5) * 2), 0.08, 0.07]} c="#e8dfc8" edge={false} />}
      {tanam > 0.01 && ([[1.72, 1.45], [1.72, -0.05], [1.72, -1.1], [0.05, 1.72], [-1.1, 1.72]] as [number, number][]).map(([x, z], i) => {
        const s = Math.max(0.001, Math.min(1, tanam * 1.5 - i * 0.12));
        return (
          <group key={i} position={[x, 0, z]} scale={[s, s, s]}>
            <Cy p={[0, 0.25, 0]} rad={0.06} h={0.5} c="#7b5a48" rot={[0, 0, 0]} edge={false} />
            <Sp p={[0, 0.62, 0]} rad={0.3} c={warna.good} />
            <Sp p={[0.1, 0.92, 0.05]} rad={0.22} c={warna.good} />
          </group>
        );
      })}

      {/* mobil + berkas lampu */}
      {aktif.map(({m, p}, i) => (
        <group key={i}>
          <group position={[p.x, 0, p.z]} rotation={[0, Math.atan2(p.hx, p.hz), 0]} scale={[0.85, 0.85, 0.85]}><Mobil warna={m.warna} /></group>
          <Sorot pose={p} panjang={7 * (0.35 + 0.65 * att)} o={0.2 * (0.35 + 0.65 * att)} />
        </group>
      ))}
    </group>
  );
};
