// Video #11 "10 Tahun Nyicil, Rumahmu Baru Separuh Lunas": rumah kertas dari 180 bata (1 bata = 1 bulan cicilan),
// tumpukan koin cicilan (abu = bunga, koral = jadi rumah), menara sisa utang. Satuan meter, gaya diorama kertas #10.
import * as THREE from 'three';
import {useMemo} from 'react';
import {Easing, interpolate} from 'remotion';
import {PBox, MT, KT} from '../v10/Tangga';

type V3 = [number, number, number];
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const spring = Easing.bezier(0.34, 1.28, 0.64, 1);
const mat = (color: string, rough = 0.9) => new THREE.MeshStandardMaterial({color, roughness: rough, metalness: 0});
export const MK = {bank: mat('#cfc9bc'), blue: mat('#5d8fd6', 0.85), coin: mat('#bdb7aa', 0.7), roof: mat('#e9e4d8'), tile: mat('#9c7b5e', 0.85)};
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
          {/* dinding segitiga (kertas) */}
          <mesh position={[0, 0, -H.bd / 2]} material={MT.paper} castShadow receiveShadow>
            <extrudeGeometry args={[new THREE.Shape([new THREE.Vector2(-houseW / 2, 0), new THREE.Vector2(houseW / 2, 0), new THREE.Vector2(0, Math.tan(roofA) * houseW / 2)]), {depth: H.bd, bevelEnabled: false}]} />
          </mesh>
          <PBox p={[-half / 2, (Math.tan(roofA) * half) / 2 + 0.03, 0]} s={[L + 0.06, 0.06, H.bd + 0.22]} r={[0, 0, roofA]} m={MK.tile} />
          <PBox p={[half / 2, (Math.tan(roofA) * half) / 2 + 0.03, 0]} s={[L + 0.06, 0.06, H.bd + 0.22]} r={[0, 0, -roofA]} m={MK.tile} />
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

// ================= v2: properti uang nyata + gedung bank mini =================

/* tekstur tulisan dari kanvas 2D (dibuat ulang hanya bila teks berubah) */
export function useTextTex(text: string, w: number, h: number, bg: string, fg: string, font: string, sub?: string) {
  return useMemo(() => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d')!;
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = font;
    g.fillText(text, w / 2, sub ? h * 0.42 : h / 2);
    if (sub) { g.font = `700 ${Math.round(h * 0.13)}px Inter, sans-serif`; g.globalAlpha = 0.7; g.fillText(sub, w / 2, h * 0.8); }
    const tx = new THREE.CanvasTexture(c); tx.anisotropy = 4; tx.colorSpace = THREE.SRGBColorSpace; return tx;
  }, [text, w, h, bg, fg, font, sub]);
}

// ---------- uang kertas (1 ikat = 0,1 juta) ----------
export const BT = 0.022; // tebal satu ikat
const BILL = new THREE.BoxGeometry(0.34, 0.018, 0.17);
const BAND = new THREE.BoxGeometry(0.05, 0.0186, 0.1715);
export const MB = {blue: mat('#a9c0e2', 0.85), coral: mat('#f6a493', 0.85), band: mat('#fbfaf6', 0.9), blueEdge: mat('#5d8fd6'), coralEdge: mat(KT.coral)};
const jit = (i: number) => Math.sin(i * 12.9898) * 43758.5453 % 1;
/* gray = ikat bunga (bawah, biru muda), coral = ikat jadi rumah (atas)
   flyGray 0..1 = ikat bunga terbang ke bank; fly 0..1 = ikat koral terbang ke rumah */
export const Bills: React.FC<{p: V3; gray: number; coral: number; appear?: number; fly?: number; to?: V3; flyGray?: number; toBank?: V3}> = ({p, gray, coral, appear = 1, fly = 0, to = [0, 0, 0], flyGray = 0, toBank = [0, 0, 0]}) => {
  const g = Math.round(gray), n = g + Math.round(coral), shown = appear * n;
  const drop = Easing.inOut(Easing.cubic)(interpolate(flyGray, [0.55, 1], [0, 1], cl)) * g;
  return (
    <group>
      {Array.from({length: n}, (_, i) => {
        const a = interpolate(shown - i, [0, 1], [0, 1], cl);
        if (a <= 0) return null;
        const isC = i >= g, j = isC ? i - g : i;
        const lvl = isC ? i - drop : i;
        let pos: V3 = [p[0] + jit(i) * 0.012, p[1] + 0.009 + lvl * BT + (1 - a) * 0.25, p[2] + jit(i + 7) * 0.012], s = 1, rot = jit(i + 3) * 0.035;
        const flyK = isC ? fly : flyGray, dest = isC ? to : toBank, order = isC ? j : g - 1 - j;
        if (flyK > 0) {
          const cnt = isC ? n - g : g, st = 0.45 / Math.max(1, cnt - 1), k = Easing.inOut(Easing.cubic)(interpolate(flyK * 1.45 - order * st, [0, 1], [0, 1], cl));
          pos = [pos[0] + (dest[0] - pos[0]) * k, pos[1] + (dest[1] - pos[1]) * k + Math.sin(Math.PI * k) * 0.7, pos[2] + (dest[2] - pos[2]) * k]; s = 1 - k * 0.35; rot += k * 3;
          if (k >= 0.999) return null;
        }
        return (
          <group key={i} position={pos} rotation={[0, rot, 0]} scale={[s, s, s]}>
            <mesh geometry={BILL} material={isC ? MB.coral : MB.blue} castShadow receiveShadow />
            <mesh geometry={BAND} material={MB.band} />
          </group>
        );
      })}
    </group>
  );
};

// ---------- amplop gaji ----------
export const Envelope: React.FC<{p: V3; s?: number; label?: string}> = ({p, s = 1, label = 'CICILAN'}) => {
  const tex = useTextTex(label, 256, 128, '#f1e7cf', '#8a6d3b', '800 52px Inter, sans-serif');
  if (s <= 0.001) return null;
  return (
    <group position={p} scale={[s, s, s]} rotation={[0, -0.25, 0]}>
      <PBox p={[0, 0.012, 0]} s={[0.44, 0.024, 0.26]} m={mat('#f1e7cf')} />
      <mesh position={[0, 0.0255, 0.03]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.3, 0.15]} /><meshStandardMaterial map={tex} roughness={0.9} /></mesh>
      <mesh position={[0, 0.026, -0.09]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}><planeGeometry args={[0.18, 0.18]} /><meshStandardMaterial color="#e6d9b8" roughness={0.9} /></mesh>
    </group>
  );
};

// ---------- kalender meja ----------
export const Calendar: React.FC<{p: V3; text: string; sub?: string; s?: number; done?: boolean}> = ({p, text, sub, s = 1, done}) => {
  const tex = useTextTex(text, 512, 400, done ? '#6fae6a' : '#fbfaf6', done ? '#ffffff' : '#1c1c1e', `900 ${text.length > 7 ? 92 : 120}px Inter, sans-serif`, sub);
  if (s <= 0.001) return null;
  const tilt = -0.32;
  return (
    <group position={p} scale={[s, s, s]} rotation={[0, 0.35, 0]}>
      {/* penyangga segitiga */}
      <PBox p={[0, 0.16, -0.05]} s={[0.5, 0.34, 0.012]} r={[tilt, 0, 0]} m={MK.roof} />
      <PBox p={[0, 0.16, -0.17]} s={[0.5, 0.34, 0.012]} r={[-tilt, 0, 0]} m={MK.roof} />
      {/* halaman */}
      <mesh position={[0, 0.165, -0.04]} rotation={[tilt, 0, 0]}><planeGeometry args={[0.46, 0.32]} /><meshStandardMaterial map={tex} roughness={0.9} /></mesh>
      <PBox p={[0, 0.33, -0.1]} s={[0.5, 0.03, 0.03]} m={MT.coral} />
    </group>
  );
};

// ---------- gedung bank mini ----------
export const Bank: React.FC<{p: V3; s?: number}> = ({p, s = 1}) => {
  const sign = useTextTex('BANK', 512, 128, '#fbfaf6', '#5d8fd6', '900 96px Inter, sans-serif');
  if (s <= 0.001) return null;
  const W = 1.5, D = 0.7, colH = 1.15, base = 0.18;
  return (
    <group position={p} scale={[s, s, s]}>
      {/* tangga */}
      <PBox p={[0, 0.03, 0.06]} s={[W + 0.2, 0.06, D + 0.22]} m={MK.roof} />
      <PBox p={[0, 0.09, 0.03]} s={[W + 0.1, 0.06, D + 0.12]} m={MK.roof} />
      <PBox p={[0, 0.15, 0]} s={[W, 0.06, D]} m={MK.roof} />
      {/* dinding dalam */}
      <PBox p={[0, base + colH / 2, -0.12]} s={[W - 0.16, colH, D - 0.3]} m={MK.bank} />
      {/* pintu */}
      <PBox p={[0, base + 0.3, 0.035]} s={[0.3, 0.6, 0.02]} m={MK.blue} />
      {/* kolom */}
      {Array.from({length: 6}, (_, i) => <mesh key={i} position={[-W / 2 + 0.12 + i * ((W - 0.24) / 5), base + colH / 2, 0.22]} castShadow receiveShadow material={MT.paper}><cylinderGeometry args={[0.055, 0.065, colH, 20]} /></mesh>)}
      {/* balok atas + papan nama */}
      <PBox p={[0, base + colH + 0.07, 0.02]} s={[W + 0.06, 0.14, D + 0.04]} m={MT.paper} />
      <mesh position={[0, base + colH + 0.07, D / 2 + 0.041]}><planeGeometry args={[0.8, 0.12]} /><meshStandardMaterial map={sign} roughness={0.9} /></mesh>
      {/* atap segitiga (pedimen) */}
      <mesh position={[0, base + colH + 0.14, 0.02]} rotation={[0, 0, 0]} castShadow receiveShadow material={MK.blue}>
        <extrudeGeometry args={[new THREE.Shape([new THREE.Vector2(-(W + 0.1) / 2, 0), new THREE.Vector2((W + 0.1) / 2, 0), new THREE.Vector2(0, 0.38)]), {depth: D, bevelEnabled: false}]} />
      </mesh>
    </group>
  );
};
export const bankDoor = (p: V3): V3 => [p[0], p[1] + 0.48, p[2] + 0.1];

// ---------- tumpukan map kontrak (sisa utang) ----------
const FOLD = new THREE.BoxGeometry(0.42, 0.04, 0.3);
export const Folders: React.FC<{p: V3; h: number; s: number}> = ({p, h, s}) => {
  if (s <= 0.001) return null;
  const n = Math.max(1, Math.round(h / 0.045));
  return (
    <group position={p} scale={[s, s, s]}>
      {Array.from({length: n}, (_, i) => (
        <group key={i} position={[jit(i) * 0.03, 0.02 + i * 0.045, jit(i + 5) * 0.03]} rotation={[0, jit(i + 9) * 0.12, 0]}>
          <mesh geometry={FOLD} material={i % 3 === 0 ? MK.blue : MT.paper} castShadow receiveShadow />
          <PBox p={[0, 0.0, 0.151]} s={[0.36, 0.034, 0.004]} m={i % 3 === 0 ? MT.paper : MK.bank} />
        </group>
      ))}
    </group>
  );
};
