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

/** Kamera isometrik (ortografis, arah X=Y=Z): zoom = piksel per satuan dunia. Gerak: zoom (push/pull) dan look (pan/crane); arah kamera tetap. Teknik: .claude/skills/remotion-fitur (isometrik). */
const IsoRig: React.FC<{k: Key}> = ({k}) => {
  const cam = useThree((s) => s.camera) as THREE.OrthographicCamera;
  const az = (k.az ?? 45) * Math.PI / 180, el = Math.min(84, k.el ?? 35.264) * Math.PI / 180, D = 34.64; // jarak tetap; az/el berganti = kamera mengitari objek (tetap ortografis)
  cam.position.set(k.look[0] + D * Math.cos(el) * Math.sin(az), k.look[1] + D * Math.sin(el), k.look[2] + D * Math.cos(el) * Math.cos(az)); cam.zoom = k.zoom ?? 300; cam.near = -50; cam.far = 120;
  cam.updateProjectionMatrix(); cam.lookAt(...k.look);
  return null;
};
/** cahaya satu arah: sisi atas paling terang, kiri sedang, kanan paling gelap; tidak boleh berubah antar-adegan */
export const LightsIso: React.FC<{az?: number}> = ({az = 45}) => {
  const f = (az - 45) * Math.PI / 180, x = -5, z = 4; // cahaya ikut berputar bersama kamera: pembagian tiga nada (atas terang, kiri sedang, kanan gelap) tetap
  return <><ambientLight intensity={0.6} /><directionalLight position={[x * Math.cos(f) + z * Math.sin(f), 9, -x * Math.sin(f) + z * Math.cos(f)]} intensity={2.3} /></>;
};
export const CanvasIso: React.FC<{k: Key; children: React.ReactNode}> = ({k, children}) => (
  <ThreeCanvas orthographic width={1080} height={1920} camera={{position: [20, 20, 20], zoom: k.zoom ?? 300, near: -50, far: 120}} gl={{alpha: true, antialias: true}}>
    <LightsIso az={k.az} /><IsoRig k={k} />{children}
  </ThreeCanvas>
);
