// Kit Penjelasan / objek: pelat beton lantai garasi dipotong (video #21). Sumbu x = lebar pelat, z = ke arah kamera, y = naik.
// Potongan: lapis atas beton hanya di separuh belakang, sehingga jaring besi (di sepertiga atas) terlihat di separuh depan.
// Penyederhanaan visual: ukuran tidak skala; retak = celah vertikal yang melebar.
import {Bx, Cy} from '../prim';
import type {V3} from '../waktu';

export const BETON = '#f1f1ec', TANAH = '#a07850', BESI = '#59616d';
const W = 2.2, D = 2.4, HL = 0.5, HU = 0.25, SOIL = 0.4;
type Warna = {accent: string; cool: string; good: string};

export type PelatP = {
  warna: Warna;
  gap?: number;          // lebar retak (satuan dunia); 0 = utuh
  glow?: number;         // 1 = jaring besi menyala hijau (bekerja)
  meshY?: number;        // tinggi jaring dari dasar pelat (default di atas badan bawah)
  pour?: number;         // 0..1 tinggi beton tercor (aksi); 1 = penuh
  drop?: number;         // turunnya tanah+pelat sisi kanan (tanah turun)
  tekan?: number;        // 0..1 panah tekan (biru) dari atas
  tarik?: number;        // 0..1 panah tarik (koral) ke samping
  roda?: number;         // 0..1 roda mobil menekan dari atas (tinggi turun)
  chairs?: boolean;      // kursi penopang jaring
  mesh?: boolean;
  squash?: number;       // 0..1 tanah dipadatkan
};

export const Pelat: React.FC<PelatP> = ({warna, gap = 0, glow = 0, meshY, pour = 1, drop = 0, tekan = 0, tarik = 0, roda = 0, chairs = false, mesh = true, squash = 0}) => {
  const g = gap, hw = (W - g) / 2;            // lebar tiap blok
  const lowH = HL * pour, upH = HU * pour;
  const my = meshY ?? HL + 0.045;
  const meshC = glow > 0.5 ? warna.good : BESI;
  const soilH = SOIL * (1 - 0.25 * squash);
  const block = (side: -1 | 1) => {
    const cx = side * (g / 2 + hw / 2), dy = side === 1 ? -drop : 0;
    return (
      <group key={side} position={[0, dy, 0]}>
        <Bx p={[cx, lowH / 2, 0]} s={[hw, Math.max(lowH, 0.001), D]} c={BETON} />
        <Bx p={[cx, lowH + upH / 2, -D / 4]} s={[hw, Math.max(upH, 0.001), D / 2]} c={BETON} />
      </group>
    );
  };
  const zBars = [-0.95, -0.6, -0.3, 0.3, 0.6, 0.95];
  return (
    <group>
      {/* tanah */}
      <Bx p={[-(W + 0.5) / 4, -soilH / 2 - 0.01, 0]} s={[(W + 0.5) / 2, soilH, D + 0.3]} c={TANAH} />
      <Bx p={[(W + 0.5) / 4, -soilH / 2 - 0.01 - drop, 0]} s={[(W + 0.5) / 2, soilH, D + 0.3]} c={TANAH} />
      {/* retak: celah berwarna koral */}
      {g > 0 && <Bx p={[0, (HL + HU) / 2 * pour - drop / 2, 0]} s={[g, (HL + HU) * pour + drop, D - 0.01]} c={warna.accent} edge={false} />}
      {block(-1)}{block(1)}
      {/* jaring besi: batang sejajar x menyeberangi retak; batang sejajar z menempel di tiap blok */}
      {mesh && (
        <group>
          {[0.25, 0.6, 0.95].map((z) => <Cy key={z} p={[0, my, z]} rad={0.036} h={W + 0.12} c={meshC} rot={[0, 0, Math.PI / 2]} edge={false} m={0.5} />)}
          {[-0.5, -0.85].map((z) => <Cy key={`b${z}`} p={[0, my, z]} rad={0.036} h={W + 0.12} c={meshC} rot={[0, 0, Math.PI / 2]} edge={false} m={0.5} />)}
          {zBars.map((x) => { const side = x < 0 ? -1 : 1; return <Cy key={x} p={[x + side * g / 2, my + 0.07, 0]} rad={0.036} h={D - 0.1} c={meshC} rot={[Math.PI / 2, 0, 0]} edge={false} m={0.5} />; })}
          {chairs && [-0.9, 0.9].flatMap((x) => [-0.4, 0.4].map((z) => <Cy key={`${x}${z}`} p={[x, my / 2, z]} rad={0.045} h={my} c="#555" rot={[0, 0, 0]} edge={false} />))}
        </group>
      )}
      {/* panah tekan (biru, dari atas) dan tarik (koral, ke samping) */}
      {tekan > 0 && [-0.8, 0, 0.8].map((x) => <group key={x} position={[x, 0.95 - 0.12 * tekan, 0.9]}><Cy p={[0, 0.25, 0]} rad={0.06} h={0.5} c={warna.cool} rot={[0, 0, 0]} edge={false} /><mesh position={[0, -0.04, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.16, 0.28, 24]} /><meshStandardMaterial color={warna.cool} roughness={0.5} /></mesh></group>)}
      {tarik > 0 && [-1, 1].map((s) => <group key={s} position={[s * (W / 2 + 0.2 + 0.3 * tarik), HL * 0.7 - (s === 1 ? drop : 0), 0.9]} rotation={[0, 0, -s * Math.PI / 2]} scale={[tarik, tarik, tarik]}><Cy p={[0, -0.3, 0]} rad={0.07} h={0.6} c={warna.accent} rot={[0, 0, 0]} edge={false} /><mesh><coneGeometry args={[0.18, 0.32, 24]} /><meshStandardMaterial color={warna.accent} roughness={0.5} /></mesh></group>)}
      {/* roda mobil */}
      {roda > 0 && (
        <group position={[0.65, HL + HU + 0.4 - 0.0 * roda + (1 - roda) * 1.6 - drop, 0.8]}>
          <Cy p={[0, 0, 0]} rad={0.42} h={0.38} c="#2c2c30" rot={[0, 0, Math.PI / 2]} />
          <Cy p={[0, 0, 0]} rad={0.2} h={0.4} c="#c9ccd1" rot={[0, 0, Math.PI / 2]} edge={false} m={0.4} />
        </group>
      )}
    </group>
  );
};
