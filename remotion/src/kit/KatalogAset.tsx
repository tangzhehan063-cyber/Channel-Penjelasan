// Katalog visual aset luar (style/aset-luar.md). Komposisi: KatalogAset (CC0 awal), KatalogRumah1 (perabot), KatalogRumah2 (struktur, kendaraan, alat). 3 kolom, urut baris demi baris.
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill} from 'remotion';
import {PaperPalet} from '../aset/PaperPalet';
import {Lights, Rig} from './stage';
import {Gambar, Model3D, useModels} from './model';
import {SedanSiluet} from './objek/SedanSiluet';

const K = (f: string) => `kenney/${f}.glb`;
export const KATALOG = [
  'kota/building-small-a', 'kota/building-small-b', 'kota/building-small-c', 'kota/building-small-d', 'kota/building-garage', 'kota/road-straight-lightposts',
  'kota/road-intersection', 'kota/pavement-fountain', 'arena/stairs', 'arena/wall-gate', 'arena/bricks', 'arena/column', 'racing/vehicle-truck-red', 'racing/vehicle-motorcycle',
].map(K);
export const RUMAH1 = ['furnitur/toilet', 'furnitur/bathroomSink', 'furnitur/bathtub', 'furnitur/shower', 'furnitur/kitchenSink', 'furnitur/kitchenStove',
  'furnitur/kitchenFridge', 'furnitur/washer', 'furnitur/bedDouble', 'furnitur/loungeSofa', 'furnitur/table', 'furnitur/chair'].map(K);
export const RUMAH2 = ['furnitur/doorway', 'furnitur/wallWindow', 'furnitur/stairs', 'furnitur/ceilingFan', 'mobil/sedan', 'mobil/suv',
  'mobil/van', 'rumah-suburban/building-type-a', 'rumah-suburban/building-type-c', 'alat-survival/tool-hammer', 'alat-survival/tool-axe', 'properti-jalan/detail-light-single'].map(K);

const Katalog: React.FC<{daftar: string[]; sedan?: boolean; fit?: number; redup?: number}> = ({daftar, sedan, fit = 1.25, redup = 0.72}) => {
  const {m, siap} = useModels(daftar);
  const baris = Math.ceil((daftar.length + (sedan ? 1 : 0)) / 3);
  return (
    <AbsoluteFill>
      <PaperPalet palet="batu" />
      <ThreeCanvas width={1080} height={1920} camera={{position: [0, 12, 10], fov: 34}} gl={{alpha: true, antialias: true}}>
        <Lights /><Rig k={{t: 0, pos: [0, 5 + baris * 2.2, 3.5 + baris * 1.6], look: [0, 0, 0.3]}} />
        {m && <>
          {daftar.map((f, i) => <Model3D key={f} scene={m[f]} fit={fit} redup={redup} p={[((i % 3) - 1) * 1.55, 0, (Math.floor(i / 3) - (baris - 1) / 2) * 1.75]} rot={0.6} />)}
          {sedan && <SedanSiluet p={[1.55, 0, (baris - 1 - (baris - 1) / 2) * 1.75]} rot={0.6} />}
          <Gambar onSiap={siap} />
        </>}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
export const KatalogAset: React.FC = () => <Katalog daftar={KATALOG} sedan />;
export const KatalogRumah1: React.FC = () => <Katalog daftar={RUMAH1} redup={0.3} />;
export const KatalogRumah2: React.FC = () => <Katalog daftar={RUMAH2} />;
