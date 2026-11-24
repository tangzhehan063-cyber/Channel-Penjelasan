import {Composition} from 'remotion';
import {Scene3D} from './Scene3D';
import {PengetahuanTest} from './pengetahuan/Scene';
import {Video05, V05_FRAMES} from './v05/Video05';
import {Cover05} from './v05/Cover05';
import {Video06, V06_FRAMES} from './v06/Video06';
import {Cover06} from './v06/Cover06';
import {Video07, V07_FRAMES} from './v07/Video07';
import {Cover07} from './v07/Cover07';
import {Video08, V08_FRAMES} from './v08/Video08';
import {Cover08} from './v08/Cover08';
import {Video09, V09_FRAMES} from './v09/Video09';
import {Cover09} from './v09/Cover09';
import {Video10, V10_FRAMES} from './v10/Video10';
import {Cover10} from './v10/Cover10';
import {Video11, V11_FRAMES} from './v11/Video11';
import {Cover11} from './v11/Cover11';
import {Video12, V12_FRAMES} from './v12/Video12';
import {Tes13, T13_FRAMES} from './v13/Tes13';
import {Mood13, M13_FRAMES} from './v13/Mood13';
import {Video13, V13_FRAMES} from './v13/Video13';
import {Video14, V14_FRAMES} from './v14/Video14';
import {Cover14} from './v14/Cover14';
import {Video15, V15_FRAMES} from './v15/Video15';
import {Cover15} from './v15/Cover15';
import {Video16, V16_FRAMES} from './v16/Video16';
import {Cover16} from './v16/Cover16';
import {Video17, V17_FRAMES} from './v17/Video17';
import {Video19, V19_FRAMES} from './v19/Video19';
import {Cover19} from './v19/Cover19';
import {Video20, V20_FRAMES} from './v20/Video20';
import {Cover20} from './v20/Cover20';
import {Video20Data} from './v20/Video20Data';
import {Video21, V21_FRAMES} from './v21/Video21';
import {Video22, V22_FRAMES} from './v22/Video22';
import {PilotSifon, PILOT_SIFON_FRAMES} from './v23/PilotSifon';
import {AnatomiRumah, ANATOMI_FRAMES} from './e1/AnatomiRumah';
import {Rumah01, R01_FRAMES} from './e1/Rumah01';
import {Tanah02, R02_FRAMES} from './e1/Tanah02';
import {Tiang03, R03_FRAMES} from './e1/Tiang03';
import {Cover22} from './v22/Cover22';
import {Video23, V23_FRAMES} from './v23/Video23';
import {Video24, V24_FRAMES} from './v24/Video24';
import {Cover24} from './v24/Cover24';
import {SampelBlueprint, SB_FRAMES} from './sampel/SampelBlueprint';
import {SampelKurz, SK_FRAMES} from './sampel/SampelKurz';
import {Cover23} from './v23/Cover23';
import {KatalogAset, KatalogRumah1, KatalogRumah2} from './kit/KatalogAset';
import {UjiGayaAset} from './kit/UjiGayaAset';
import {Cover21} from './v21/Cover21';
import {Cover17} from './v17/Cover17';
import {PaletDemo} from './aset/PaletDemo';
import {Cover12} from './v12/Cover12';
import {AsetDemo} from './aset/AsetDemo';
import {GerakDemo} from './aset/GerakDemo';
import {GabungDemo} from './aset/GabungDemo';
import {BakeAset} from './aset/BakeAset';

export const RemotionRoot: React.FC = () => (
  <>
  <Composition id="AnatomiRumah" component={AnatomiRumah} durationInFrames={ANATOMI_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Rumah01" component={Rumah01} durationInFrames={R01_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Tanah02" component={Tanah02} durationInFrames={R02_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Tiang03" component={Tiang03} durationInFrames={R03_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Video13" component={Video13} durationInFrames={V13_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Cover14" component={Cover14} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Cover16" component={Cover16} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Video20" component={Video20} durationInFrames={V20_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="UjiGayaAset" component={UjiGayaAset} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="KatalogRumah1" component={KatalogRumah1} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="KatalogRumah2" component={KatalogRumah2} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="KatalogAset" component={KatalogAset} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="PilotSifon" component={PilotSifon} durationInFrames={PILOT_SIFON_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Video22" component={Video22} durationInFrames={V22_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Video23" component={Video23} durationInFrames={V23_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Video24" component={Video24} durationInFrames={V24_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Cover23" component={Cover23} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Cover24" component={Cover24} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="SampelBlueprint" component={SampelBlueprint} durationInFrames={SB_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="SampelKurz" component={SampelKurz} durationInFrames={SK_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Cover22" component={Cover22} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Video21" component={Video21} durationInFrames={V21_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Cover21" component={Cover21} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Video20Data" component={Video20Data} durationInFrames={V20_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Cover20" component={Cover20} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Cover19" component={Cover19} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Cover17" component={Cover17} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Video14" component={Video14} durationInFrames={V14_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Video15" component={Video15} durationInFrames={V15_FRAMES} fps={30} width={1080} height={1920} defaultProps={{palet: 'krem' as const}} />
  <Composition id="Cover15" component={Cover15} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Video16" component={Video16} durationInFrames={V16_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Video19" component={Video19} durationInFrames={V19_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Video17" component={Video17} durationInFrames={V17_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="PaletDemo" component={PaletDemo} durationInFrames={60} fps={30} width={1080} height={1920} defaultProps={{palet: 'krem' as const}} />
  <Composition id="Mood13" component={Mood13} durationInFrames={M13_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Tes13" component={Tes13} durationInFrames={T13_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Cover05" component={Cover05} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Cover06" component={Cover06} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Cover07" component={Cover07} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Cover08" component={Cover08} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Video08" component={Video08} durationInFrames={V08_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Cover09" component={Cover09} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Video09" component={Video09} durationInFrames={V09_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Video10" component={Video10} durationInFrames={V10_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Cover11" component={Cover11} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Video11" component={Video11} durationInFrames={V11_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Cover12" component={Cover12} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Video12" component={Video12} durationInFrames={V12_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Cover10" component={Cover10} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Video07" component={Video07} durationInFrames={V07_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Video06" component={Video06} durationInFrames={V06_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Video05" component={Video05} durationInFrames={V05_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="BakeAset" component={BakeAset} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{kind: 'kertas-dasar' as const}}
    calculateMetadata={({props}) => ({width: props.kind === 'grain' ? 512 : props.kind.startsWith('kertas') ? 1080 : 960, height: props.kind === 'grain' ? 512 : props.kind.startsWith('kertas') ? 1920 : 960})} />
  <Composition id="GabungDemo" component={GabungDemo} durationInFrames={450} fps={30} width={1080} height={1920} />
  <Composition id="GerakDemo" component={GerakDemo} durationInFrames={270} fps={30} width={1080} height={1920} />
  <Composition id="AsetDemo" component={AsetDemo} durationInFrames={240} fps={30} width={1080} height={1920} />
  <Composition id="PengetahuanTest" component={PengetahuanTest} durationInFrames={120} fps={30} width={1080} height={1920} />
  <Composition
    id="Scene3D"
    component={Scene3D}
    durationInFrames={150}
    fps={30}
    width={1920}
    height={1080}
  />
  </>
);
