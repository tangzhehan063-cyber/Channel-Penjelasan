// Adegan "breakdown dua benda" #26: kran putar (ulir, aliran berbelok dua kali, karet menekan lubang) dan kran tuas jenis bola (aliran lurus).
// Gaya: isometrik terang (CanvasIso), warna material nyata (kuningan, krom, karet, air), badan transparan memperlihatkan jalur air.
// mode: 'putar' | 'bola'. Semua waktu dari `w` (detik absolut, [mulai, selesai]); bawaan sesuai naskah #26.
import {useMemo} from 'react';
import * as THREE from 'three';
import {Edges} from '@react-three/drei';
import {Easing} from 'remotion';
import {r, type V3} from '../waktu';
import {INK} from '../prim';
import type {AdeganP} from './AdeganStopkontak';

export const WARNA_KRAN = {kuningan: '#c9a24b', krom: '#cfd4da', karet: '#2b2b2d', karetAus: '#55504a', air: '#6fb3e0', kaca: '#bfd9e6', lever: '#b23a2e'};
const K = WARNA_KRAN;
const ez = Easing.inOut(Easing.cubic);
const W_ = (w: AdeganP['w'], k: string, d: [number, number]) => (w && w[k]) || d;
const rr = (t: number, a: [number, number]) => r(t, a[0], a[1], ez);

/** tabung dari titik a ke b */
const Tabung: React.FC<{a: V3; b: V3; rad: number; c: string; op?: number; edge?: boolean; m?: number}> = ({a, b, rad, c, op = 1, edge = false, m = 0.4}) => {
  const {len, quat} = useMemo(() => { const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]); return {len: d.length(), quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())}; }, [a, b]);
  return (
    <mesh position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]} quaternion={quat}>
      <cylinderGeometry args={[rad, rad, len, 28]} />
      <meshStandardMaterial color={c} roughness={0.35} metalness={m} transparent={op < 1} opacity={op} depthWrite={op >= 1} />
      {edge && <Edges color={INK} lineWidth={1.2} />}
    </mesh>
  );
};
const Bola: React.FC<{p: V3; rad: number; c: string; op?: number; edge?: boolean}> = ({p, rad, c, op = 1, edge}) => (
  <mesh position={p}><sphereGeometry args={[rad, 28, 20]} /><meshStandardMaterial color={c} roughness={0.3} metalness={0.5} transparent={op < 1} opacity={op} depthWrite={op >= 1} />{edge && <Edges color={INK} lineWidth={1.2} />}</mesh>
);
const Kotak: React.FC<{p: V3; s: V3; c: string; op?: number; edge?: boolean; rot?: V3}> = ({p, s, c, op = 1, edge = true, rot = [0, 0, 0]}) => (
  <mesh position={p} rotation={rot}><boxGeometry args={s} /><meshStandardMaterial color={c} roughness={0.5} metalness={0.2} transparent={op < 1} opacity={op} depthWrite={op >= 1} />{edge && <Edges color={INK} lineWidth={1.2} />}</mesh>
);

/** posisi pada polyline, s 0..1 */
function pada(pts: V3[], s: number): V3 {
  const ls = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1], q[2] - pts[i][2])), tot = ls.reduce((a, b) => a + b, 0);
  let d = s * tot;
  for (let i = 0; i < ls.length; i++) { if (d <= ls[i] || i === ls.length - 1) { const u = Math.min(1, d / ls[i]), a = pts[i], b = pts[i + 1]; return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; } d -= ls[i]; }
  return pts[pts.length - 1];
}
const frac = (x: number) => x - Math.floor(x);
const jit = (t: number, i: number, a: number): V3 => [a * Math.sin(t * 9 + i * 2.3), a * Math.cos(t * 7.7 + i * 1.7), a * Math.sin(t * 6.1 + i * 3.1)];

// ---------- kran putar (globe): masuk kiri, naik lewat dudukan karet, belok ke kanan, keluar ke bawah ----------
const PA: V3[] = [[-2.0, 0.4, 0], [-0.2, 0.4, 0], [-0.2, 1.2, 0], [1.9, 1.2, 0], [1.9, -0.4, 0]];
const S_DUDUKAN = (1.8 + 0.45) / (1.8 + 0.8 + 1.7 + 1.6), S_BELOK2 = (1.8 + 0.8) / (1.8 + 0.8 + 1.7 + 1.6);
const KranPutar: React.FC<{t: number; w: AdeganP['w']}> = ({t, w}) => {
  const g = (k: string, d: [number, number]) => W_(w, k, d);
  const tekan = g('tekan', [19.0, 20.2]), aus = g('aus', [21.0, 22.4]), tetes = g('tetes', [22.6, 99]), berg = g('berg', [13.4, 14.4]), putar = g('putar', [15.4, 17.6]), balik = g('balik', [999, 1000]);
  const pTekan = rr(t, tekan) - rr(t, balik), pAus = rr(t, aus) * (1 - rr(t, balik)), pBerg = rr(t, berg);
  const plugY = 1.5 + (0.98 - 1.5) * pTekan;
  const tf = t <= tekan[1] ? t : t < balik[1] ? tekan[1] : tekan[1] + (t - balik[1]); // aliran berhenti setelah karet menekan penuh, jalan lagi setelah `balik`
  const tutupAir = t >= tekan[1] && t < balik[0];
  const N = 28, partikel = [];
  for (let i = 0; i < N; i++) {
    const s = frac(i / N + 0.2 * tf);
    if (tutupAir && s > S_DUDUKAN) continue;
    const p = pada(PA, s), a = 0.075 * pBerg * Math.min(1, Math.max(0, (s - (S_BELOK2 - 0.05)) / 0.1)), j = jit(t, i, a);
    partikel.push(<mesh key={i} position={[p[0] + j[0], p[1] + j[1], p[2] + j[2]]}><sphereGeometry args={[0.07, 12, 10]} /><meshStandardMaterial color={K.air} roughness={0.25} /></mesh>);
  }
  const tau = (t - tetes[0]) % 1.15, drop = t >= tetes[0] && t < tetes[1] && tau < 0.62;
  return (
    <group position={[0.1, 0, 0]}>
      {/* badan transparan + saluran air */}
      <Kotak p={[0, 0.85, 0]} s={[3.5, 1.7, 0.95]} c={K.kuningan} op={0.12} />
      <Tabung a={PA[0]} b={PA[1]} rad={0.22} c={K.kaca} op={0.32} />
      <Tabung a={PA[1]} b={PA[2]} rad={0.22} c={K.kaca} op={0.32} />
      <Tabung a={PA[2]} b={PA[3]} rad={0.22} c={K.kaca} op={0.32} />
      <Bola p={PA[1]} rad={0.22} c={K.kaca} op={0.32} />
      <Bola p={PA[2]} rad={0.22} c={K.kaca} op={0.32} />
      {/* ujung pipa masuk (ulir) */}
      <Tabung a={[-2.35, 0.4, 0]} b={[-1.75, 0.4, 0]} rad={0.34} c={K.kuningan} edge />
      {/* dudukan karet (cincin) */}
      <mesh position={[-0.2, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.27, 0.07, 14, 28]} /><meshStandardMaterial color={K.krom} roughness={0.3} metalness={0.7} /><Edges color={INK} lineWidth={1} /></mesh>
      {/* karet (plug) dan batang */}
      <group position={[-0.2, plugY, 0]}>
        <Tabung a={[0, -0.05, 0]} b={[0, 0.05, 0]} rad={0.3} c={t >= aus[0] && t < balik[0] ? K.karetAus : K.karet} m={0} edge />
        {pAus > 0.5 && <Kotak p={[0.27, -0.03, 0]} s={[0.12, 0.05, 0.14]} c={K.air} edge={false} />}
        <Tabung a={[0, 0.05, 0]} b={[0, 1.0, 0]} rad={0.08} c={K.krom} edge />
        {/* gagang berputar */}
        <group position={[0, 1.0, 0]} rotation={[0, 2 * Math.PI * rr(t, putar), 0]}>
          <Tabung a={[0, 0, 0]} b={[0, 0.16, 0]} rad={0.2} c={K.kuningan} edge />
          <Kotak p={[0, 0.24, 0]} s={[0.9, 0.12, 0.16]} c={K.lever} />
          <Kotak p={[0, 0.24, 0]} s={[0.16, 0.12, 0.9]} c={K.lever} />
        </group>
      </group>
      {partikel}
      {drop && <mesh position={[1.9, 1.2 - 4.5 * tau * tau, 0]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.1, 14, 12]} /><meshStandardMaterial color={K.air} roughness={0.2} /></mesh>}
    </group>
  );
};

// ---------- kran bola: lubang bola sejajar pipa = lurus; tuas diputar 90° = tutup ----------
const KranBola: React.FC<{t: number; w: AdeganP['w']}> = ({t, w}) => {
  const g = (k: string, d: [number, number]) => W_(w, k, d);
  const bola = g('bola', [28.25, 31.0]), seteng = g('setengah', [36.5, 38.7]), setOut = g('setengahOut', [38.7, 39.4]);
  const sampai = g('awal', [20, 20])[0]; // sebelum detik ini bola dianggap terbuka (adegan perkenalan)
  const base = t < sampai ? 0 : 90 * (1 - rr(t, bola));
  const half = t < sampai ? 0 : 45 * rr(t, seteng) * (1 - rr(t, setOut));
  const th = Math.max(0, Math.min(90, base + half)); // derajat, 0 = lubang sejajar pipa (buka)
  const tf = t < sampai ? t : Math.max(0, t - (bola[0] + (bola[1] - bola[0]) * 0.5));
  const N = 26, partikel = [];
  for (let i = 0; i < N; i++) {
    const s = frac(i / N + 0.15 * tf), x = -2.3 + 4.6 * s;
    if (th > 60 && x > -0.45) continue;                      // tertutup: air tertahan di kiri
    if (th > 15 && x > 0.5 && i % 2 === 0) continue;         // setengah terbuka: lebih sedikit yang lolos
    const a = x > 0.5 ? 0.07 * Math.min(1, th / 40) : 0, j = jit(t, i, a);
    partikel.push(<mesh key={i} position={[x + j[0], 0.8 + j[1], j[2]]}><sphereGeometry args={[0.07, 12, 10]} /><meshStandardMaterial color={K.air} roughness={0.25} /></mesh>);
  }
  const rad = (th * Math.PI) / 180;
  return (
    <group position={[0, 0, 0]}>
      <Kotak p={[0, 0.8, 0]} s={[1.9, 1.3, 1.3]} c={K.kuningan} op={0.1} />
      <Tabung a={[-2.3, 0.8, 0]} b={[2.3, 0.8, 0]} rad={0.22} c={K.kaca} op={0.3} />
      <Tabung a={[-1.55, 0.8, 0]} b={[-0.75, 0.8, 0]} rad={0.5} c={K.kuningan} edge />
      <Tabung a={[0.75, 0.8, 0]} b={[1.55, 0.8, 0]} rad={0.5} c={K.kuningan} edge />
      <Tabung a={[-2.45, 0.8, 0]} b={[-1.55, 0.8, 0]} rad={0.36} c={K.kuningan} edge />
      <Tabung a={[1.55, 0.8, 0]} b={[2.45, 0.8, 0]} rad={0.36} c={K.kuningan} edge />
      {/* bola berlubang + tuas: berputar bersama di sumbu y */}
      <group position={[0, 0.8, 0]} rotation={[0, rad, 0]}>
        <Bola p={[0, 0, 0]} rad={0.58} c={K.krom} op={0.38} edge />
        <Tabung a={[-0.58, 0, 0]} b={[0.58, 0, 0]} rad={0.22} c={K.air} op={0.55} m={0} />
        <Tabung a={[0, 0.5, 0]} b={[0, 0.95, 0]} rad={0.1} c={K.krom} edge />
        <Kotak p={[0.55, 1.0, 0]} s={[1.7, 0.1, 0.24]} c={K.lever} />
        <Kotak p={[1.35, 1.0, 0]} s={[0.5, 0.18, 0.3]} c={K.karet} />
      </group>
      {partikel}
    </group>
  );
};

/** mode: putar | bola */
export const AdeganKran: React.FC<AdeganP> = ({t, mode, w}) => (mode === 'bola' ? <KranBola t={t} w={w} /> : <KranPutar t={t} w={w} />);
