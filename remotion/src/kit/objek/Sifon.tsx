// Kit Penjelasan / objek: sifon pipa U di bawah wastafel (gaya "mekanisme minimal": pipa kaca bening, air biru mengalir, bau got tertahan).
// Satuan bebas. Jalur pipa pusat: dari bawah wastafel turun, lengkung U, naik, lalu mendatar ke dinding (kanan). Muka air diam di kedua kaki U = penutup bau.
import {useMemo} from 'react';
import * as THREE from 'three';
import {Bx, Cy, Sp} from '../prim';
import {r} from '../waktu';
import {Easing} from 'remotion';

export const KAPUR = '#f1f1ec', BAJA = '#59616d';
type Warna = {accent: string; cool: string; good: string};
const RPIPA = 0.2, RAIR = 0.155, YAIR = 0.95, YOUT = 1.15, XL = -0.6, XR = 0.6, YB = 0.4, XWALL = 2.0;

/** titik jalur pipa (rapat) */
function jalurTitik(): THREE.Vector3[] {
  const p: THREE.Vector3[] = [];
  for (let y = 2.1; y > YB; y -= 0.05) p.push(new THREE.Vector3(XL, y, 0));
  for (let a = 0; a <= 180; a += 6) { const th = (Math.PI * a) / 180; p.push(new THREE.Vector3(-Math.cos(th) * XR, YB - Math.sin(th) * XR, 0)); }
  for (let y = YB; y < YOUT - 0.3; y += 0.05) p.push(new THREE.Vector3(XR, y, 0));
  for (let a = 0; a <= 90; a += 6) { const th = (Math.PI * a) / 180; p.push(new THREE.Vector3(XR + 0.3 - Math.cos(th) * 0.3, YOUT - 0.3 + Math.sin(th) * 0.3, 0)); }
  for (let x = XR + 0.3; x <= XWALL + 0.05; x += 0.05) p.push(new THREE.Vector3(x, YOUT, 0));
  return p;
}
const POLY = jalurTitik();
const KURVA = new THREE.CatmullRomCurve3(POLY, false, 'centripetal');
const at = (u: number) => KURVA.getPointAt(Math.max(0, Math.min(1, u)));
/** u (0..1) pertama di mana jalur melewati y = YAIR pada kaki kiri (turun) dan kaki kanan (naik) */
const U_KIRI = (() => { for (let u = 0; u <= 1; u += 0.001) if (at(u).y <= YAIR) return u; return 0.3; })();
const Y_SAMB = 0.7; // tinggi sambungan di kedua kaki (mur slip)
const U_A = (() => { for (let u = 0; u <= 1; u += 0.001) if (at(u).y <= Y_SAMB) return u; return 0.35; })();
const U_B = (() => { let mid = false; for (let u = 0; u <= 1; u += 0.001) { const p = at(u); if (p.x > 0 && p.y > YB) mid = true; if (mid && p.y >= Y_SAMB) return u; } return 0.62; })();
const U_KANAN = (() => { let mid = false; for (let u = 0; u <= 1; u += 0.001) { const p = at(u); if (p.x > 0 && p.y > YB) mid = true; if (mid && p.y >= YAIR) return u; } return 0.6; })();

const Air: React.FC<{u0: number; u1: number; c: string}> = ({u0, u1, c}) => {
  const geo = useMemo(() => {
    if (u1 - u0 < 0.004) return null;
    const pts: THREE.Vector3[] = []; const n = 70;
    for (let k = 0; k <= n; k++) pts.push(at(u0 + ((u1 - u0) * k) / n));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, RAIR, 14, false);
  }, [Math.round(u0 * 400), Math.round(u1 * 400)]);
  return geo ? <mesh geometry={geo}><meshStandardMaterial color={c} roughness={0.25} /></mesh> : null;
};

const Bagian: React.FC<{u0: number; u1: number; opacity?: number}> = ({u0, u1}) => {
  const geo = useMemo(() => { const pts: THREE.Vector3[] = []; for (let k = 0; k <= 60; k++) pts.push(at(u0 + ((u1 - u0) * k) / 60)); return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, RPIPA, 18, false); }, [u0, u1]);
  return <mesh geometry={geo}><meshStandardMaterial color="#e8eef2" transparent opacity={0.3} depthWrite={false} roughness={0.2} /></mesh>;
};
/** pembongkaran: lengkungan U (bagian B) turun dilepas dari pipa tegak (A) dan pipa ke dinding (C); mur slip dan karet penyekat terlihat. gap 0 = terpasang, 1 = terbongkar. */
export const GAP_B = 0.95;

/** t = detik absolut; w = jendela waktu (detik): buka (keran buka, aliran mulai), mengalir (kepala air tiba di ujung), tutup (keran tutup, air surut), gas (bau datang) */
export const Sifon: React.FC<{t: number; gap?: number; w: {buka: number; ujung: number; tutup: number; surut: number; gas: number; gasSelesai: number}; warna: Warna}> = ({t, w, warna, gap = 0}) => {
  const head = r(t, w.buka + 0.3, w.ujung, Easing.inOut(Easing.cubic));            // kepala air berjalan 0 -> 1
  const turun = r(t, w.tutup, w.surut, Easing.inOut(Easing.cubic));               // pangkal air surut ke muka air kiri, ujung air surut ke muka air kanan
  const u0 = turun * U_KIRI, u1 = 1 - turun * (1 - U_KANAN);
  const kepala = t < w.tutup ? head : 1;                                          // sebelum tutup: air memenuhi sampai kepala
  const ujung = Math.min(kepala, u1);
  const keranBuka = t >= w.buka && t < w.tutup;
  // bau got: bola koral masuk dari dinding, sampai muka air kanan, tertahan lalu memudar
  const gas = r(t, w.gas, w.gasSelesai, Easing.out(Easing.cubic));
  const gasPuff = Array.from({length: 5}, (_, i) => {
    const k = Math.min(1, Math.max(0, gas * 1.25 - i * 0.12));
    const x = XWALL + 0.55 - k * (XWALL + 0.55 - XR - 0.02);                       // dari kanan menuju kaki kanan
    const y = k < 0.78 ? YOUT : YOUT - ((k - 0.78) / 0.22) * (YOUT - YAIR - 0.1);   // lalu turun ke muka air
    const op = (k > 0 ? 1 : 0) * (1 - r(t, w.gasSelesai - 0.6, w.gasSelesai + 0.4));
    return {x, y: y + Math.sin(i * 2.1 + t * 3) * 0.03, s: 0.09 + 0.02 * (i % 3), op, ok: k > 0};
  });
  return (
    <group position={[0, 0, 0]}>
      {/* wastafel: mangkuk keramik + keran */}
      <Bx p={[0, 2.38, 0]} s={[2.3, 0.28, 1.3]} c={KAPUR} />
      <Cy p={[XL, 2.2, 0]} rad={0.26} h={0.1} c={BAJA} rot={[0, 0, 0]} />
      <Cy p={[XL - 0.8, 2.85, 0]} rad={0.07} h={0.9} c={BAJA} rot={[0, 0, 0]} />
      <Bx p={[XL - 0.4, 3.28, 0]} s={[0.9, 0.12, 0.14]} c={BAJA} />
      {keranBuka && <Cy p={[XL, 2.95, 0]} rad={0.045} h={0.7} c={warna.cool} rot={[0, 0, 0]} edge={false} />}
      {/* dinding kanan */}
      <Bx p={[XWALL + 0.45, 1.5, 0]} s={[0.5, 3.2, 1.4]} c={KAPUR} />
      {/* pipa kaca bening + mur sambungan */}
      <Bagian u0={0} u1={U_A} />
      <group position={[0, -GAP_B * gap, 0]}><Bagian u0={U_A} u1={U_B} /></group>
      <Bagian u0={U_B} u1={1} />
      {/* karet penyekat (cincin gelap) dan mur slip di dua sambungan */}
      {[0, 1].map((i) => { const pt = at(i === 0 ? U_A : U_B); const dy = -GAP_B * gap;
        return (
          <group key={i}>
            <Cy p={[pt.x, pt.y + dy * 0.2 + 0.0, 0]} rad={RPIPA + 0.03} h={0.05} c="#2c2c30" rot={[0, 0, 0]} />
            <Cy p={[pt.x, pt.y + dy * 0.55 + 0.02, 0]} rad={RPIPA + 0.1} h={0.2} c={KAPUR} rot={[0, 0, 0]} />
          </group>
        ); })}
      <Cy p={[XL, 2.06, 0]} rad={RPIPA + 0.06} h={0.14} c={KAPUR} rot={[0, 0, 0]} />
      <Cy p={[XWALL - 0.05, YOUT, 0]} rad={RPIPA + 0.06} h={0.14} c={KAPUR} rot={[0, 0, Math.PI / 2]} />
      <Cy p={[XR + 0.62, YOUT, 0]} rad={RPIPA + 0.05} h={0.12} c={KAPUR} rot={[0, 0, Math.PI / 2]} />
      {/* air */}
      <Air u0={u0} u1={Math.max(u0, ujung)} c={warna.cool} />
      {/* gelembung kecil ikut mengalir (hanya saat air benar-benar mengalir) */}
      {t >= w.buka + 0.5 && t < w.surut && Array.from({length: 14}, (_, i) => {
        const fr = (((t - w.buka) * 0.42 + i / 14) % 1), uu = u0 + (Math.max(u0 + 0.01, ujung) - u0) * fr;
        const alir = 1 - r(t, w.tutup + 0.2, w.surut);
        const p = at(uu); const off = Math.sin(i * 5.3) * 0.05;
        return alir > 0.02 ? <group key={i} position={[p.x + off, p.y, off]} scale={alir}><Sp p={[0, 0, 0]} rad={0.045 + 0.015 * (i % 3)} c="#eaf4fb" /></group> : null;
      })}
      {/* muka air diam bergetar halus (penutup bau) */}
      {t >= w.surut && <mesh position={[XL, YAIR + 0.002, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1 + 0.03 * Math.sin(t * 5), 1 + 0.03 * Math.cos(t * 5), 1]}><circleGeometry args={[RAIR * 1.02, 24]} /><meshStandardMaterial color="#cfe6f5" roughness={0.2} /></mesh>}
      {/* bau got */}
      {gasPuff.map((g, i) => g.ok && g.op > 0.02 ? <group key={i} position={[g.x, g.y, 0]} scale={g.op}><Sp p={[0, 0, 0]} rad={g.s} c={warna.accent} /></group> : null)}
    </group>
  );
};
