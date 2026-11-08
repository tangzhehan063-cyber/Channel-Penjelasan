import {Composition} from 'remotion';
import {Scene3D} from './Scene3D';
import {PengetahuanTest} from './pengetahuan/Scene';
import {AsetDemo} from './aset/AsetDemo';

export const RemotionRoot: React.FC = () => (
  <>
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
