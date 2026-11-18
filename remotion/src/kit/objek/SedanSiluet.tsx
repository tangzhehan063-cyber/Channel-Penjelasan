// Contoh objek dari siluet SVG (lapis 2 di style/aset-luar.md): sedan kecil, bodi membulat. Ganti jalur d untuk bentuk lain.
import {Siluet, type Lapis} from '../model';

const roda = (cx: number, z: number): Lapis[] => [
  {d: `M${cx - 30},108 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0 Z`, warna: '#2c2c30', depth: 20, z},
  {d: `M${cx - 14},108 a14,14 0 1,0 28,0 a14,14 0 1,0 -28,0 Z`, warna: '#c9ccd1', depth: 22, z},
];
export const sedanLapis = (bodi = '#3f6fb8'): Lapis[] => [
  {d: 'M8,112 L8,92 Q8,80 26,77 L88,70 Q112,36 152,30 L250,30 Q292,36 318,68 L362,76 Q394,80 394,98 L394,112 Z', warna: bodi, depth: 80, bevel: 5},
  {d: 'M116,66 L134,44 Q142,40 152,40 L196,40 L196,66 Z', warna: '#e4ebf1', depth: 98},
  {d: 'M208,66 L208,40 L246,40 Q262,42 276,66 Z', warna: '#e4ebf1', depth: 98},
  {d: 'M376,84 L394,84 L394,98 L376,98 Z', warna: '#fff3c4', depth: 96},
  {d: 'M8,86 L22,86 L22,98 L8,98 Z', warna: '#d6462f', depth: 96},
  ...roda(96, 52), ...roda(96, -52), ...roda(304, 52), ...roda(304, -52),
];
export const SedanSiluet: React.FC<{p?: [number, number, number]; rot?: number; bodi?: string; skala?: number}> = ({p, rot, bodi, skala = 0.0036}) => (
  <Siluet lapis={sedanLapis(bodi)} pusat={[200, 112]} skala={skala} p={p} rot={rot} />
);
