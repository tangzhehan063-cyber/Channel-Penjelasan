// Uji adaptasi aset Kenney ke gaya channel (19 Nov): atas = model asli (digelapkan), bawah = diwarnai palet batu + outline tinta + warna peran.
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill} from 'remotion';
import {PaperPalet, PALET} from '../aset/PaperPalet';
import {Lights, Rig} from './stage';
import {Gambar, Model3D, useModels} from './model';

const F = ['kenney/furnitur/toilet.glb', 'kenney/furnitur/kitchenFridge.glb', 'kenney/furnitur/washer.glb'];
const PL = PALET.batu;
// peta bahan -> warna channel (putih kapur seperti beton #21, baja gelap seperti jaring besi, biru = dingin/air, koral = sorotan)
const DASAR = {carpetWhite: '#f1f1ec', _defaultMat: '#f1f1ec', metalLight: '#f1f1ec', metal: '#9aa0a8', metalMedium: '#59616d', metalDark: '#59616d', glass: '#8fb4dc'};
const GAYA: Record<string, Record<string, string>> = {
  'kenney/furnitur/toilet.glb': {...DASAR, cover: PL.accent},
  'kenney/furnitur/kitchenFridge.glb': {...DASAR, doorFreezer: PL.cool},
  'kenney/furnitur/washer.glb': {...DASAR, washerDoor: PL.cool},
};
export const UjiGayaAset: React.FC = () => {
  const {m, siap} = useModels(F);
  return (
    <AbsoluteFill>
      <PaperPalet palet="batu" />
      <ThreeCanvas width={1080} height={1920} camera={{position: [0, 12, 10], fov: 34}} gl={{alpha: true, antialias: true}}>
        <Lights /><Rig k={{t: 0, pos: [0, 11.5, 9.5], look: [0, 0.2, 0.2]}} />
        {m && <>
          {F.map((f, i) => <Model3D key={`a${f}`} scene={m[f]} fit={1.5} redup={0.3} p={[(i - 1) * 1.7, 0, -1.6]} rot={0.6} />)}
          {F.map((f, i) => <Model3D key={`b${f}`} scene={m[f]} fit={1.5} warna={GAYA[f]} garis p={[(i - 1) * 1.7, 0, 1.5]} rot={0.6} />)}
          <Gambar onSiap={siap} />
        </>}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
