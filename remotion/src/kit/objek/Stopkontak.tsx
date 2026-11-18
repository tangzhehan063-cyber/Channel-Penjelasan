// Kit Penjelasan / objek: stop kontak Schuko, steker, setrika (video #20). Menghadap +z. Warna aksen dilewatkan lewat tema.
import {Bx, Cy, Sp, Mat} from '../prim';
import type {V3} from '../waktu';

export const PLATE = '#fbf7ec', DARK = '#33302a', METAL = '#b4b9c0', IRON = '#d4d6dc';
type Warna = {accent: string; good: string};

/** lubang bulat di x=±0.19, klip logam di tepi kiri-kanan cekungan; glow>0.5 = klip menyala hijau; ring = cincin penanda */
export const Outlet: React.FC<{clips?: boolean; glow?: number; ring?: number; warna: Warna}> = ({clips = true, glow = 0, ring = 0, warna}) => (
  <group>
    <Bx p={[0, 0, 0]} s={[1.3, 1.3, 0.12]} c={PLATE} />
    <Cy p={[0, 0, 0.065]} rad={0.52} h={0.03} c="#e8e1cf" />
    <Cy p={[0, 0, 0.085]} rad={0.5} h={0.02} c={DARK} edge={false} />
    {[-0.19, 0.19].map((x) => <Cy key={x} p={[x, 0, 0.1]} rad={0.085} h={0.02} c="#0d0d0f" edge={false} />)}
    {clips && [-1, 1].map((s) => <Bx key={s} p={[s * 0.47, 0, 0.12]} s={[0.05, 0.26, 0.07]} c={glow > 0.5 ? warna.good : METAL} m={0.4} />)}
    {ring > 0 && [-1, 1].map((s) => <mesh key={s} position={[s * 0.47, 0, 0.16]} scale={ring}><torusGeometry args={[0.2, 0.03, 12, 32]} /><Mat c={warna.accent} /></mesh>)}
  </group>
);
/** badan hitam bulat, dua pin, area kontak samping; z0 = muka depan badan */
export const Plug: React.FC<{z0: number; glow?: number; warna: Warna}> = ({z0, glow = 0, warna}) => (
  <group>
    <Cy p={[0, 0, z0 + 0.19]} rad={0.45} h={0.38} c="#2c2c30" />
    {[-0.19, 0.19].map((x) => <Cy key={x} p={[x, 0, z0 - 0.2]} rad={0.07} h={0.42} c={METAL} edge={false} m={0.5} />)}
    {[-1, 1].map((s) => <Bx key={s} p={[s * 0.465, 0, z0 + 0.08]} s={[0.04, 0.2, 0.12]} c={glow > 0.5 ? warna.good : METAL} m={0.4} />)}
    <Cy p={[0, 0, z0 + 0.9]} rad={0.12} h={1.0} c="#2c2c30" edge={false} />
  </group>
);
export const Iron: React.FC<{p: V3; spark?: number; warna: Warna}> = ({p, spark = 0, warna}) => (
  <group position={p}>
    <Bx p={[0, 0, 0]} s={[1.5, 0.28, 0.75]} c={warna.accent} />
    <Bx p={[0.05, 0.38, 0]} s={[1.2, 0.5, 0.65]} c={IRON} m={0.3} />
    <Bx p={[-0.1, 0.85, 0]} s={[0.9, 0.12, 0.12]} c={DARK} />
    {spark > 0 && <Sp p={[0.35, 0.45, 0.4]} rad={0.12 * spark} c={warna.accent} />}
  </group>
);
