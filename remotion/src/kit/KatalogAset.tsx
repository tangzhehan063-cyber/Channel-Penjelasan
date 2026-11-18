// Katalog visual aset luar yang tersedia (style/aset-luar.md). Urutan baris demi baris (3 kolom) sama dengan daftar di katalog.
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill} from 'remotion';
import {PaperPalet} from '../aset/PaperPalet';
import {Lights, Rig} from './stage';
import {Gambar, Model3D, useModels} from './model';
import {SedanSiluet} from './objek/SedanSiluet';

export const KATALOG = [
  'kenney/kota/building-small-a.glb', 'kenney/kota/building-small-b.glb', 'kenney/kota/building-small-c.glb',
  'kenney/kota/building-small-d.glb', 'kenney/kota/building-garage.glb', 'kenney/kota/road-straight-lightposts.glb',
  'kenney/kota/road-intersection.glb', 'kenney/kota/pavement-fountain.glb', 'kenney/arena/stairs.glb',
  'kenney/arena/wall-gate.glb', 'kenney/arena/bricks.glb', 'kenney/arena/column.glb',
  'kenney/racing/vehicle-truck-red.glb', 'kenney/racing/vehicle-motorcycle.glb',
];
export const KatalogAset: React.FC = () => {
  const {m, siap} = useModels(KATALOG);
  return (
    <AbsoluteFill>
      <PaperPalet palet="batu" />
      <ThreeCanvas width={1080} height={1920} camera={{position: [0, 12, 10], fov: 34}} gl={{alpha: true, antialias: true}}>
        <Lights /><Rig k={{t: 0, pos: [0, 15.5, 11.5], look: [0, 0, 0.3]}} />
        {m && <>
          {KATALOG.map((f, i) => <Model3D key={f} scene={m[f]} fit={1.25} p={[((i % 3) - 1) * 1.55, 0, (Math.floor(i / 3) - 2) * 1.75]} rot={0.6} />)}
          <SedanSiluet p={[1.55, 0, 1.75 * 2]} rot={0.6} />
          <Gambar onSiap={siap} />
        </>}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
