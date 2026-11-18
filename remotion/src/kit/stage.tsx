// Kit Penjelasan: kanvas 3D, rig kamera, lampu, segmen (cross-fade antar-adegan). Dari v08/v19/v20.
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {AbsoluteFill, interpolate, Sequence} from 'remotion';
import {Env} from '../pengetahuan/Scene';
import {FOV, FPS, type Key} from './waktu';

export const Rig: React.FC<{k: Key}> = ({k}) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  cam.position.set(...k.pos); cam.fov = FOV; cam.updateProjectionMatrix(); cam.lookAt(...k.look);
  return null;
};
export const Lights: React.FC = () => (<><Env /><ambientLight intensity={0.4} /><directionalLight position={[-3, 5, 6]} intensity={2.6} /><directionalLight position={[4, 1, 3]} intensity={0.5} color="#fff1d6" /></>);
export const Canvas3D: React.FC<{k: Key; children: React.ReactNode}> = ({k, children}) => (
  <ThreeCanvas width={1080} height={1920} camera={{position: k.pos, fov: FOV}} gl={{alpha: true, antialias: true}}>
    <Lights /><Rig k={k} />{children}
  </ThreeCanvas>
);

const OV = 8;
/** adegan detik a..b dengan tumpang-tindih 8 frame; first = adegan pertama (tanpa fade-in). Render SEBELUM Kicker/TikTokBox di DOM. */
export const Seg: React.FC<{a: number; b: number; f: number; first?: boolean; children: React.ReactNode}> = ({a, b, f, first, children}) => {
  const fa = Math.max(0, Math.round(a * FPS) - (first ? 0 : OV)), fb = Math.round(b * FPS) + OV;
  const o = interpolate(f, [fa, fa + 2 * OV, fb - 2 * OV, fb], [first ? 1 : 0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Sequence from={fa} durationInFrames={fb - fa} layout="none"><AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill></Sequence>;
};
