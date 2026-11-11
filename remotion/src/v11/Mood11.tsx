// Moodboard #11 (sementara): semua properti baru dari beberapa sudut. frame 0..3 = sudut berbeda.
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {PaperPlus} from '../aset/Gabung';
import {Table} from '../v10/Tangga';
import {House, Bills, Envelope, Calendar, Bank, Folders} from './Kpr';

type V3 = [number, number, number];
export const LAYOUT = {bank: [-1.25, 0, -3.0] as V3, bills: [1.25, 0, -0.2] as V3, env: [1.3, 0, 0.35] as V3, cal: [-0.8, 0, 0.15] as V3, folders: [-1.45, 0, -0.55] as V3};
const CAMS: [V3, V3][] = [[[1.6, 3.2, 7.6], [-0.1, 1.1, -1.4]], [[2.9, 1.3, 2.6], [1.2, 0.45, -0.3]], [[-1.0, 2.4, 3.8], [-0.6, 0.9, -2.4]], [[-2.4, 1.6, 3.4], [-1.0, 0.5, -0.2]]];
const Cam: React.FC<{i: number}> = ({i}) => { const c = useThree((s) => s.camera) as THREE.PerspectiveCamera; c.position.set(...CAMS[i][0]); c.fov = 34; c.updateProjectionMatrix(); c.lookAt(...CAMS[i][1]); return null; };
export const Mood11: React.FC = () => {
  const f = useCurrentFrame(), i = Math.min(3, f);
  return (
    <AbsoluteFill>
      <PaperPlus />
      <ThreeCanvas width={1080} height={1920} shadows camera={{position: CAMS[i][0], fov: 34}} gl={{alpha: true, antialias: true}}>
        <hemisphereLight args={['#fffaf0', '#d8cfbd', 0.9]} />
        <directionalLight position={[2.5, 4.5, 3.0]} intensity={2.2} color="#fff4e6" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-radius={6} shadow-bias={-0.0004} />
        <directionalLight position={[-3, 1.5, 2]} intensity={0.35} color="#ffe2da" />
        <Cam i={i} />
        <fog attach="fog" args={['#efece4', 11, 26]} />
        <Table />
        <Bank p={LAYOUT.bank} s={1.15} />
        <House fill={90} />
        <Bills p={LAYOUT.bills} gray={12} coral={17} />
        <Envelope p={LAYOUT.env} />
        <Calendar p={LAYOUT.cal} text="TAHUN 10" sub="separuh lunas" />
        <Folders p={LAYOUT.folders} h={0.9} s={1} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
