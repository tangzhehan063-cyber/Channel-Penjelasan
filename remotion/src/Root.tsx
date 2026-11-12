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
import {Cover12} from './v12/Cover12';
import {AsetDemo} from './aset/AsetDemo';
import {GerakDemo} from './aset/GerakDemo';
import {GabungDemo} from './aset/GabungDemo';
import {BakeAset} from './aset/BakeAset';

export const RemotionRoot: React.FC = () => (
  <>
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
