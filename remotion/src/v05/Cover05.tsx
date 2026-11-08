// Cover video #5: objek tembok koral + judul Inter Black (2–5 kata), 1080×1920.
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {AbsoluteFill} from 'remotion';
import {Env, Paper, Ghost, PALETTE} from '../pengetahuan/Scene';
import {Wall, YAW} from './Tembok';

const Cam: React.FC = () => { const c = useThree((s) => s.camera) as THREE.PerspectiveCamera; c.position.set(1.0, 1.9, 10.4); c.fov = 34; c.updateProjectionMatrix(); c.lookAt(0.15, 1.75, 0); return null; };
export const Cover05: React.FC = () => (
  <AbsoluteFill>
    <Paper t={0} />
    <Ghost lines={['Air', 'Tanah']} y={1180} />
    <ThreeCanvas width={1080} height={1920} camera={{position: [1, 1.2, 8.6], fov: 34}} gl={{alpha: true, antialias: true}}>
      <Env /><ambientLight intensity={0.35} /><directionalLight position={[3, 5, 6]} intensity={2.2} /><directionalLight position={[-4, 1, 3]} intensity={0.6} color="#ffe2da" />
      <Cam />
      <group rotation={[0, YAW, 0]}><Wall t={1.3} level={0.95} bubbles={0.8} peel={0.45} /></group>
    </ThreeCanvas>
    <div style={{position: 'absolute', left: 80, right: 60, top: 300, fontFamily: 'Inter', color: PALETTE.ink}}>
      <div style={{fontSize: 150, fontWeight: 900, letterSpacing: -5, lineHeight: 0.95}}>TEMBOK</div>
      <div style={{fontSize: 150, fontWeight: 900, letterSpacing: -5, lineHeight: 0.95, color: '#ef7663'}}>MINUM AIR</div>
      <div style={{fontSize: 46, fontWeight: 700, marginTop: 26, color: PALETTE.sub, letterSpacing: -0.5}}>dari tanah · fakta rumah #5</div>
    </div>
  </AbsoluteFill>
);
