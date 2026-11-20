// Adegan breakdown #27: potongan samping atap miring (lean-to) yang menempel dinding, di atas plafon dan ember. Empat jalan air masuk walau genteng utuh:
// (1) sambungan atap-dinding tanpa flashing, (2) kemiringan terlalu landai, (3) talang mampet, (4) genteng bergeser / bubungan. Satu tetes ditelusuri dari titik masuk ke titik netes.
// Gaya: isometrik terang (CanvasIso), warna material nyata. Semua waktu dari `w` (detik absolut [mulai, selesai]); bawaan sesuai naskah #27.
import {Edges} from '@react-three/drei';
import {Easing} from 'remotion';
import {r, type V3} from '../waktu';
import {INK} from '../prim';
import type {AdeganP} from './AdeganStopkontak';

export const WARNA_ATAP = {genteng: '#c2623f', usuk: '#a06f45', reng: '#8b5e3c', membran: '#9aa7b4', dinding: '#d8d0c0', plafon: '#efece6', flashing: '#cfd4da', talang: '#8e949c', air: '#6fb3e0', ember: '#4a6fa5', sampah: '#6b5a3a', celah: '#2a2724', sorot: '#e2563f'};
const C = WARNA_ATAP;
const ez = Easing.inOut(Easing.cubic);
const W_ = (w: AdeganP['w'], k: string, d: [number, number]) => (w && w[k]) || d;
const rr = (t: number, a: [number, number]) => r(t, a[0], a[1], ez);
const frac = (x: number) => x - Math.floor(x);
const D2R = Math.PI / 180;

const EX = -1.6, EY = 0.45, SPAN = 3.6, DEPAN = 1.12; // eave (x,y), bentang datar sampai dinding, bidang potong z

const Kotak: React.FC<{p: V3; s: V3; c: string; op?: number; edge?: boolean; rot?: number}> = ({p, s, c, op = 1, edge = true, rot = 0}) => (
  <mesh position={p} rotation={[0, 0, rot]}><boxGeometry args={s} /><meshStandardMaterial color={c} roughness={0.55} metalness={0.15} transparent={op < 1} opacity={op} depthWrite={op >= 1} />{edge && <Edges color={INK} lineWidth={1.1} />}</mesh>
);
const Titik: React.FC<{p: V3; rad?: number; c?: string}> = ({p, rad = 0.06, c = C.air}) => (<mesh position={p}><sphereGeometry args={[rad, 12, 10]} /><meshStandardMaterial color={c} roughness={0.25} /></mesh>);
/** posisi pada polyline, s 0..1 */
function pada(pts: V3[], s: number): V3 {
  const ls = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1], q[2] - pts[i][2])), tot = ls.reduce((a, b) => a + b, 0);
  let d = s * tot;
  for (let i = 0; i < ls.length; i++) { if (d <= ls[i] || i === ls.length - 1) { const u = Math.min(1, d / ls[i]), a = pts[i], b = pts[i + 1]; return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; } d -= ls[i]; }
  return pts[pts.length - 1];
}
/** aliran partikel sepanjang jalur */
const Aliran: React.FC<{pts: V3[]; t: number; a: number; n?: number; kec?: number}> = ({pts, t, a, n = 12, kec = 0.16}) => {
  if (a <= 0.01) return null;
  return <>{Array.from({length: n}, (_, i) => { const p = pada(pts, frac(i / n + kec * t)); return <Titik key={i} p={p} rad={0.065 * Math.min(1, a * 1.5)} />; })}</>;
};

export const AdeganAtap: React.FC<AdeganP> = ({t, w}) => {
  const g = (k: string, d: [number, number]) => W_(w, k, d);
  // ---- sudut atap: 32° normal, turun ke 14° saat "terlalu landai"
  const sudut = 32 - 18 * rr(t, g('landai', [31.7, 33.0])) + 18 * rr(t, g('landaiOut', [36.0, 37.2]));
  const th = sudut * D2R, tn = Math.tan(th), cs = Math.cos(th), sn = Math.sin(th), Ls = SPAN / cs;
  const urai = rr(t, g('urai', [3.5, 5.5])) - rr(t, g('rakit', [7.5, 8.4]));
  const topY = EY + SPAN * tn + 0.33 / cs, wallTop = topY + 0.6;
  const yU = (x: number) => EY + (x - EX) * tn;             // sisi bawah atap
  const yS = (x: number, n = 0.36) => yU(x) + n / cs;          // permukaan genteng
  // lokal (u sepanjang lereng, n tegak lurus) -> dunia
  const loc = (u: number, n: number, z = 0): V3 => [EX + u * cs - n * sn, EY + u * sn + n * cs, z];
  // lapisan: usuk, membran, reng, genteng
  const dn = [0, 0.38 * urai, 0.76 * urai, 1.14 * urai];
  const NT = 7, LT = Ls / NT;
  const flashing = rr(t, g('flashing', [18.6, 19.8])), longgar = rr(t, g('longgar', [21.1, 22.0]));
  const berg = rr(t, g('berg', [44.8, 45.8])), buLepas = rr(t, g('bubungan', [46.3, 47.4]));
  const mampet = rr(t, g('mampet', [38.5, 40.0])), naik = rr(t, g('naik', [39.8, 42.8]));
  // ---- jalur air (entri != titik netes)
  const aA = rr(t, g('aliranA', [13.8, 15.0])) * (1 - rr(t, g('aliranAOut', [19.6, 20.4]))) + rr(t, g('aliranA2', [22.0, 22.8])) * (1 - rr(t, g('aliranA2Out', [24.4, 25.0]))) + rr(t, g('trace', [54.8, 55.6])) * (1 - rr(t, g('traceOut', [63.4, 64.2])));
  const aB = rr(t, g('aliranB', [33.2, 34.0])) * (1 - rr(t, g('aliranBOut', [36.0, 36.6])));
  const aC = rr(t, g('aliranC', [40.9, 41.6])) * (1 - rr(t, g('aliranCOut', [43.0, 43.6])));
  const aD = rr(t, g('aliranD', [48.2, 49.0])) * (1 - rr(t, g('aliranDOut', [52.0, 52.6])));
  const dripX = aB > 0.05 ? -0.2 : aC > 0.05 ? -1.5 : aD > 0.05 ? 1.0 : 0.9;
  const pathA: V3[] = [[1.9, yU(1.9) + 0.9, DEPAN], [1.9, yU(1.9) + 0.06, DEPAN], [1.5, yU(1.5) - 0.05, DEPAN], [0.9, yU(0.9) - 0.06, DEPAN], [0.9, 0.05, DEPAN]];
  const pathB: V3[] = [[-0.2, yS(-0.2) + 0.4, DEPAN], [-0.2, yU(-0.2) + 0.1, DEPAN], [-0.2, 0.05, DEPAN]];
  const pathC: V3[] = [[-1.75, 0.62, DEPAN], [-1.55, yU(-1.55) + 0.12, DEPAN], [-1.5, 0.05, DEPAN]];
  const pathD: V3[] = [[1.0, yS(1.0) + 0.5, DEPAN], [1.0, yU(1.0) + 0.08, DEPAN], [1.0, 0.05, DEPAN]];
  const dripOn = Math.max(aA, aB, aC, aD, rr(t, [0.0, 0.2]) * (1 - rr(t, [13.8, 14.4])) , rr(t, g('gema', [78.0, 78.6])));
  const tau = (t % 0.95) / 0.95;
  // ---- hujan: jatuh lalu meluncur ke talang
  const NR = 22, hujan = rr(t, g('hujan', [0.1, 0.6])) * (1 - rr(t, g('hujanOut', [76.0, 77.0])));
  const lambat = 1 - 0.55 * (1 - sn / Math.sin(32 * D2R)) / (1 - 0) * 1;
  const rain = hujan > 0.01 ? Array.from({length: NR}, (_, i) => {
    const x0 = -1.35 + 3.0 * frac(i * 0.618 + 0.13), p = frac(i * 0.37 + 0.55 * t), yh = yS(x0, 0.4);
    if (p < 0.45) return <Titik key={i} p={[x0, 4.3 - (4.3 - yh) * (p / 0.45), DEPAN]} rad={0.045} />;
    const s = Math.pow((p - 0.45) / 0.55, 1 / Math.max(0.5, lambat)); const x = x0 + (-1.72 - x0) * s;
    return <Titik key={i} p={[x, yS(x, 0.4) + 0.02, DEPAN]} rad={0.05} />;
  }) : null;
  // ---- sorot empat titik (aksi)
  const pulsa = (a: number, b: number) => rr(t, [a, a + 0.25]) * (1 - rr(t, [b - 0.2, b]));
  const sorot = [
    {p: [1.9, topY + 0.1, DEPAN] as V3, a: pulsa(68.1, 69.0)}, {p: [-0.3, yS(-0.3) + 0.1, DEPAN] as V3, a: pulsa(69.0, 70.0)},
    {p: [-1.75, 0.45, DEPAN] as V3, a: pulsa(70.0, 70.7)}, {p: [1.95, topY + 0.2, DEPAN] as V3, a: pulsa(70.8, 72.0)},
  ];
  const angin = rr(t, g('angin', [50.4, 51.0])) * (1 - rr(t, g('anginOut', [51.9, 52.4])));
  const arc = rr(t, g('busur', [28.3, 29.0])) * (1 - rr(t, g('busurOut', [36.4, 37.0])));
  return (
    <group>
      {/* dinding + plafon + ember */}
      <Kotak p={[2.25, wallTop / 2, 0]} s={[0.5, wallTop, 2.2]} c={C.dinding} />
      <Kotak p={[0.05, -0.04, 0]} s={[3.9, 0.08, 2.2]} c={C.plafon} />
      <mesh position={[dripX, -1.25, DEPAN - 0.1]}><cylinderGeometry args={[0.34, 0.27, 0.42, 24]} /><meshStandardMaterial color={C.ember} roughness={0.5} metalness={0.2} /><Edges color={INK} lineWidth={1.1} /></mesh>
      {dripOn > 0.05 && <mesh position={[dripX, -0.08 - 0.95 * tau * tau * 1.0, DEPAN]} scale={[1, 1.3, 1]}><sphereGeometry args={[0.075 * Math.min(1, dripOn * 1.5), 14, 12]} /><meshStandardMaterial color={C.air} roughness={0.2} /></mesh>}
      {/* talang: U dari tiga papan */}
      <group position={[-1.75, 0.3, 0]}>
        <Kotak p={[0, -0.02, 0]} s={[0.46, 0.04, 2.3]} c={C.talang} /><Kotak p={[-0.21, 0.1, 0]} s={[0.04, 0.24, 2.3]} c={C.talang} /><Kotak p={[0.21, 0.1, 0]} s={[0.04, 0.24, 2.3]} c={C.talang} />
        {mampet > 0.05 && [-0.12, 0.0, 0.1, -0.06, 0.12].map((x, i) => <Kotak key={i} p={[x, 0.04 + (i % 2) * 0.04, -0.8 + i * 0.4]} s={[0.12, 0.08, 0.2]} c={C.sampah} op={mampet} edge={false} />)}
        {naik > 0.02 && <Kotak p={[0, 0.0 + (0.04 + 0.2 * naik) / 2, 0]} s={[0.38, 0.04 + 0.2 * naik, 2.2]} c={C.air} op={0.8} edge={false} />}
      </group>
      {/* atap: usuk, membran, reng, genteng (urai = terurai sepanjang normal) */}
      <group>
        {[-0.8, 0.8].map((z) => { const p = loc(Ls / 2, 0.07 + dn[0], z); return <Kotak key={z} p={p} s={[Ls, 0.14, 0.14]} c={C.usuk} rot={th} />; })}
        <Kotak p={loc(Ls / 2, 0.16 + dn[1], 0)} s={[Ls, 0.02, 2.2]} c={C.membran} rot={th} op={0.95} />
        {Array.from({length: 8}, (_, k) => <Kotak key={k} p={loc((k + 0.5) * (Ls / 8), 0.22 + dn[2], 0)} s={[0.08, 0.06, 2.1]} c={C.reng} rot={th} edge={false} />)}
        {Array.from({length: NT}, (_, k) => {
          const geser = k === 4 ? -0.16 * berg : 0, lepas = k === NT - 1 ? buLepas * 0.14 : 0;
          return <Kotak key={k} p={loc((k + 0.5) * LT + geser, 0.30 + dn[3] + lepas * 0.3, 0)} s={[LT - 0.03, 0.06, 2.1]} c={C.genteng} rot={th + (k === 4 ? -0.05 * berg : 0) + (k === NT - 1 ? 0.12 * buLepas : 0)} />;
        })}
        {/* bubungan: penutup puncak */}
        <Kotak p={[2.0 - 0.1, topY + 0.04 + 0.05 * buLepas, 0]} s={[0.5, 0.1, 2.25]} c={C.genteng} rot={0.1 * buLepas} />
      </group>
      {/* celah di sambungan (sebelum flashing) dan flashing */}
      {(flashing < 0.98 || longgar > 0.3) && <Kotak p={[1.93, topY - 0.05, 0]} s={[0.12, 0.28, 2.1]} c={C.celah} edge={false} />}
      {flashing > 0.01 && (
        <group position={[0, (1 - flashing) * 0.8 + 0.32 * longgar, 0]}>
          <Kotak p={loc(Ls - 0.35, 0.37, 0)} s={[0.7, 0.03, 2.15]} c={C.flashing} rot={th} />
          <Kotak p={[1.96, topY + 0.25, 0]} s={[0.04, 0.55, 2.15]} c={C.flashing} />
        </group>
      )}
      {/* busur sudut kemiringan */}
      {arc > 0.02 && <group position={[EX, EY - 0.02, DEPAN]}>
        <mesh><torusGeometry args={[0.95, 0.025, 8, 36, th]} /><meshBasicMaterial color={C.sorot} /></mesh>
        <mesh position={[0.7, 0, 0]}><boxGeometry args={[1.4, 0.03, 0.03]} /><meshBasicMaterial color={C.sorot} /></mesh>
      </group>}
      {/* angin */}
      {angin > 0.02 && [0, 1, 2].map((i) => <Kotak key={i} p={[2.6 - 4.2 * frac(0.9 * t + i / 3), topY + 0.35 + i * 0.28, DEPAN]} s={[0.7, 0.03, 0.03]} c="#ffffff" edge={false} op={0.7 * angin} />)}
      {/* air */}
      {rain}
      <Aliran pts={pathA} t={t} a={aA} /><Aliran pts={pathB} t={t} a={aB} n={8} /><Aliran pts={pathC} t={t} a={aC} n={8} /><Aliran pts={pathD} t={t} a={aD} n={8} />
      {/* sorot empat titik */}
      {sorot.map((s, i) => s.a > 0.02 && <mesh key={i} position={s.p} scale={[1 + 0.2 * Math.sin(t * 9), 1 + 0.2 * Math.sin(t * 9), 1]}><torusGeometry args={[0.38, 0.045, 10, 30]} /><meshBasicMaterial color={C.sorot} transparent opacity={s.a} /></mesh>)}
    </group>
  );
};
