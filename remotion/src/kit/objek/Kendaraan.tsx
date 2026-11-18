// Kit Penjelasan / objek: kendaraan sederhana (motor, mobil) sebagai properti beban di atas pelat. Menghadap +z, alas di y=0.
import {Bx, Cy} from '../prim';

const RODA = '#2c2c30', KACA = '#d9dde2', HUB = '#c9ccd1';
/** motor: panjang ±0,95 (sumbu z). warna = warna badan/tangki */
export const Motor: React.FC<{warna: string}> = ({warna}) => (
  <group>
    {[-0.36, 0.36].map((z) => (
      <group key={z}><Cy p={[0, 0.2, z]} rad={0.2} h={0.1} c={RODA} rot={[0, 0, Math.PI / 2]} /><Cy p={[0, 0.2, z]} rad={0.08} h={0.12} c={HUB} rot={[0, 0, Math.PI / 2]} edge={false} /></group>
    ))}
    <Bx p={[0, 0.3, 0]} s={[0.12, 0.1, 0.7]} c="#4a4f57" />
    <Bx p={[0, 0.46, 0.14]} s={[0.2, 0.16, 0.3]} c={warna} />
    <Bx p={[0, 0.44, -0.18]} s={[0.17, 0.07, 0.3]} c="#2c2c30" />
    <Bx p={[0, 0.42, 0.33]} s={[0.05, 0.4, 0.05]} c="#4a4f57" rot={[0.3, 0, 0]} />
    <Bx p={[0, 0.62, 0.4]} s={[0.4, 0.05, 0.05]} c="#2c2c30" />
  </group>
);
/** mobil: lebar 0,85, panjang 1,6 */
export const Mobil: React.FC<{warna: string}> = ({warna}) => (
  <group>
    {[-0.46, 0.46].flatMap((x) => [-0.5, 0.5].map((z) => (
      <group key={`${x}${z}`}><Cy p={[x, 0.24, z]} rad={0.24} h={0.14} c={RODA} rot={[0, 0, Math.PI / 2]} /><Cy p={[x, 0.24, z]} rad={0.1} h={0.16} c={HUB} rot={[0, 0, Math.PI / 2]} edge={false} /></group>
    )))}
    <Bx p={[0, 0.4, 0]} s={[0.85, 0.3, 1.6]} c={warna} />
    <Bx p={[0, 0.68, -0.1]} s={[0.72, 0.26, 0.82]} c={warna} />
    <Bx p={[0, 0.69, -0.1]} s={[0.74, 0.16, 0.7]} c={KACA} edge={false} />
  </group>
);
