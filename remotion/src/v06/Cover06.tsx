// Cover video #6: lantai keramik miring + kelereng + judul "SENGAJA MIRING", 1080×1920.
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {AbsoluteFill} from 'remotion';
import {Env, Paper, Ghost, PALETTE} from '../pengetahuan/Scene';
import {Floor, Marble, Puddle, DRAIN} from './Lantai';

const Cam: React.FC = () => { const c = useThree((s) => s.camera) as THREE.PerspectiveCamera; c.position.set(1.6, 4.0, 5.2); c.fov = 34; c.updateProjectionMatrix(); c.lookAt(0, 0.05, 0); return null; };
const TILT = 0.06;
export const Cover06: React.FC = () => (
  <AbsoluteFill>
    <Paper t={0} />
    <Ghost lines={['Sengaja', 'Miring']} y={1180} />
    <ThreeCanvas width={1080} height={1920} camera={{position: [1.6, 4, 5.2], fov: 34}} gl={{alpha: true, antialias: true}}>
      <Env /><ambientLight intensity={0.18} /><directionalLight position={[4, 6, 5]} intensity={3.0} /><directionalLight position={[-4, 1, 3]} intensity={0.4} color="#ffe2da" />
      <Cam />
      <group rotation={[0, -0.55, 0]}><group rotation={[TILT, 0, -TILT * 0.6]}>
        <Floor />
        <Marble x={0.2} z={0.08} roll={2} />
        <Puddle x={DRAIN[0] - 0.12} z={DRAIN[1] - 0.08} r={0.14} />
      </group></group>
    </ThreeCanvas>
    <div style={{position: 'absolute', left: 80, right: 60, top: 300, fontFamily: 'Inter', color: PALETTE.ink}}>
      <div style={{fontSize: 150, fontWeight: 900, letterSpacing: -5, lineHeight: 0.95}}>SENGAJA</div>
      <div style={{fontSize: 150, fontWeight: 900, letterSpacing: -5, lineHeight: 0.95, color: '#ef7663'}}>MIRING</div>
      <div style={{fontSize: 46, fontWeight: 700, marginTop: 26, color: PALETTE.sub, letterSpacing: -0.5}}>lantai kamar mandimu · fakta rumah #6</div>
    </div>
  </AbsoluteFill>
);
