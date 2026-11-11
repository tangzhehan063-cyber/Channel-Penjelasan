// Video #11 "10 Tahun Nyicil, Rumahmu Baru Separuh Lunas": rumah kertas dari 180 bata (1 bata = 1 bulan cicilan),
// tumpukan koin cicilan (abu = bunga, koral = jadi rumah), menara sisa utang. Satuan meter, gaya diorama kertas #10.
import * as THREE from 'three';
import {Easing, interpolate} from 'remotion';
import {PBox, MT, KT} from '../v10/Tangga';

type V3 = [number, number, number];
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const spring = Easing.bezier(0.34, 1.28, 0.64, 1);
const mat = (color: string, rough = 0.9) => new THREE.MeshStandardMaterial({color, roughness: rough, metalness: 0});
export const MK = {bank: mat('#cfc9bc'), blue: mat('#5d8fd6', 0.85), coin: mat('#bdb7aa', 0.7), roof: mat('#e9e4d8')};
export const BLUE = '#5d8fd6';

// ---------- simulasi KPR (perkiraan): 400 jt, 15 th, 3 th 3,5% lalu 11% ----------
const P = 400, N = 180;
const pmt = (p: number, r: number, n: number) => (p * (r / 12)) / (1 - Math.pow(1 + r / 12, -n));
const CUM: number[] = (() => {
  const out = [0]; let bal = P, c = pmt(P, 0.035, N), cum = 0;
  for (let m = 1; m <= N; m++) {
    const r = m <= 36 ? 0.035 : 0.11;
    if (m === 37) c = pmt(bal, 0.11, N - 36);
    const p = c - (bal * r) / 12; bal -= p; cum += p; out.push(cum);
  }
  return out;
})();
/* bata koral setelah bulan m (boleh pecahan) */
export const bricksAt = (m: number) => { const a = Math.floor(Math.max(0, Math.min(N, m))), b = Math.min(N, a + 1), k = m - a; return ((CUM[a] + (CUM[b] - CUM[a]) * k) / P) * N; };

// ---------- rumah bata ----------
export const H = {cols: 12, rows: 15, bw: 0.14, bh: 0.09, bd: 0.12, gap: 0.008, z: -1.0};
export const houseW = H.cols * H.bw, houseH = H.rows * H.bh;
const bx = (c: number) => -houseW / 2 + (c + 0.5) * H.bw;
const by = (r: number) => (r + 0.5) * H.bh;
/* fill: jumlah bata koral (pecahan = bata berikutnya sedang "pop") */
export const House: React.FC<{fill: number; build?: number}> = ({fill, build = 1}) => {
  const n = H.cols * H.rows, roofA = 0.62, half = houseW / 2 + 0.08, L = half / Math.cos(roofA);
  const rk = interpolate(build, [0.7, 1], [0, 1], {...cl, easing: spring});
  return (
    <group position={[0, 0, H.z]}>
      {Array.from({length: n}, (_, k) => {
        const row = Math.floor(k / H.cols), col = k % H.cols;
        const g = interpolate(build * (H.rows + 3) - row, [0, 1.6], [0, 1], {...cl, easing: spring});
        if (g <= 0.001) return null;
        const on = k < Math.floor(fill), part = k === Math.floor(fill) ? fill - Math.floor(fill) : 0;
        const pop = on ? 1 : part > 0 ? 1 + 0.25 * Math.sin(Math.PI * part) : 1;
        return <PBox key={k} p={[bx(col), by(row) * g, 0]} s={[(H.bw - H.gap) * g * pop, (H.bh - H.gap) * g * pop, H.bd * pop]} m={on || part > 0.5 ? MT.coral : MK.bank} />;
      })}
      {rk > 0 && (
        <group scale={[1, rk, 1]} position={[0, houseH, 0]}>
          <PBox p={[-half / 2, (Math.tan(roofA) * half) / 2, 0]} s={[L, 0.03, H.bd + 0.12]} r={[0, 0, roofA]} m={MK.roof} />
          <PBox p={[half / 2, (Math.tan(roofA) * half) / 2, 0]} s={[L, 0.03, H.bd + 0.12]} r={[0, 0, -roofA]} m={MK.roof} />
        </group>
      )}
    </group>
  );
};
export const roofTop = houseH + Math.tan(0.62) * (houseW / 2 + 0.08);

// ---------- tumpukan koin (1 koin = 0,1 juta) ----------
const COIN = new THREE.CylinderGeometry(0.16, 0.16, 0.022, 36);
export const CT = 0.025; // tebal koin + celah
/* gray = koin bunga (bawah), coral = koin jadi rumah (atas); appear 0..1 = koin muncul satu per satu; fly 0..1 = koin koral terbang ke rumah */
export const Coins: React.FC<{p: V3; gray: number; coral: number; appear?: number; fly?: number; to?: V3}> = ({p, gray, coral, appear = 1, fly = 0, to = [0, 0, 0]}) => {
  const n = Math.round(gray + coral), shown = appear * n;
  return (
    <group>
      {Array.from({length: n}, (_, i) => {
        const a = interpolate(shown - i, [0, 1], [0, 1], cl);
        if (a <= 0) return null;
        const isC = i >= Math.round(gray);
        let pos: V3 = [p[0], p[1] + 0.011 + i * CT + (1 - a) * 0.25, p[2]], s = 1;
        if (isC && fly > 0) {
          const j = i - Math.round(gray), k = Easing.inOut(Easing.cubic)(interpolate(fly * 1.6 - j * 0.035, [0, 1], [0, 1], cl));
          pos = [pos[0] + (to[0] - pos[0]) * k, pos[1] + (to[1] - pos[1]) * k + Math.sin(Math.PI * k) * 0.5, pos[2] + (to[2] - pos[2]) * k]; s = 1 - k;
        }
        if (s <= 0.01) return null;
        return <mesh key={i} geometry={COIN} material={isC ? MT.coral : MK.coin} position={pos} scale={[s, s, s]} castShadow receiveShadow />;
      })}
    </group>
  );
};

// ---------- menara sisa utang ----------
export const Tower: React.FC<{p: V3; h: number; s: number}> = ({p, h, s}) => s <= 0.001 ? null : (
  <group position={p} scale={[s, 1, s]}>
    <PBox p={[0, (h * s) / 2, 0]} s={[0.42, h * s, 0.42]} m={MK.blue} />
    {Array.from({length: Math.floor((h * s) / 0.2)}, (_, i) => <PBox key={i} p={[0, 0.2 * (i + 1), 0.213]} s={[0.36, 0.006, 0.004]} m={MT.ink} />)}
  </group>
);

// ---------- balok uang ekstra (20 juta) ----------
export const Block: React.FC<{p: V3; s: number}> = ({p, s}) => s <= 0.001 ? null : <PBox p={p} s={[0.5 * s, 0.22 * s, 0.32 * s]} m={MT.coral} />;
export {KT};
