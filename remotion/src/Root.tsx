import {Composition} from 'remotion';
import {Scene3D} from './Scene3D';
import {PengetahuanTest} from './pengetahuan/Scene';
import {Video05, V05_FRAMES} from './v05/Video05';
import {Cover05} from './v05/Cover05';
import {AsetDemo} from './aset/AsetDemo';
import {GerakDemo} from './aset/GerakDemo';

export const RemotionRoot: React.FC = () => (
  <>
  <Composition id="Cover05" component={Cover05} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Video05" component={Video05} durationInFrames={V05_FRAMES} fps={30} width={1080} height={1920} />
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
