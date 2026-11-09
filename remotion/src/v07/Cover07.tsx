// Cover video #7: profil C baja ringan vs balok kayu + judul "BAJANYA NGGAK RINGAN", 1080×1920.
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {AbsoluteFill} from 'remotion';
import {Env, Paper, Ghost, PALETTE} from '../pengetahuan/Scene';
import {Profile, Beam} from './Atap';

const Cam: React.FC = () => { const c = useThree((s) => s.camera) as THREE.PerspectiveCamera; c.position.set(0.3, 1.6, 9.4); c.fov = 34; c.updateProjectionMatrix(); c.lookAt(0, 0.4, 0); return null; };
export const Cover07: React.FC = () => (
  <AbsoluteFill>
    <Paper t={0} />
    <Ghost lines={['Musuh', 'Beda']} y={1250} />
    <ThreeCanvas width={1080} height={1920} camera={{position: [0.3, 1.6, 9.4], fov: 34}} gl={{alpha: true, antialias: true}}>
      <Env /><ambientLight intensity={0.18} /><directionalLight position={[4, 6, 5]} intensity={3.0} /><directionalLight position={[-4, 1, 3]} intensity={0.45} color="#ffe2da" />
      <Cam />
      <group position={[0.9, -0.5, 0]} rotation={[0.3, -0.55, 0.12]}><Profile L={4.2} /></group>
      <group position={[-0.7, -2.0, 0.4]} rotation={[0.2, 0.45, -0.08]}><Beam L={3.4} /></group>
    </ThreeCanvas>
    <div style={{position: 'absolute', left: 80, right: 60, top: 300, fontFamily: 'Inter', color: PALETTE.ink}}>
      <div style={{fontSize: 54, fontWeight: 700, letterSpacing: -1, marginBottom: 14}}>Baja ringan itu</div>
      <div style={{fontSize: 150, fontWeight: 900, letterSpacing: -5, lineHeight: 0.95}}>BAJANYA</div>
      <div style={{fontSize: 112, fontWeight: 900, letterSpacing: -4, lineHeight: 0.95, color: '#ef7663', whiteSpace: 'nowrap'}}>NGGAK RINGAN</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 26, color: PALETTE.sub, letterSpacing: -0.5}}>kayu vs baja ringan · bongkar barang #1</div>
    </div>
  </AbsoluteFill>
);
