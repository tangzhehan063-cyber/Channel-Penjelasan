// Cover video #9: jalan lurus menuju rumah + cap "BUKAN SIAL", 1080×1920.
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {AbsoluteFill} from 'remotion';
import {Env} from '../pengetahuan/Scene';
import {PaperPlus} from '../aset/Gabung';
import {Scene} from './Jalan';

const CORAL = '#ef7663', INK = '#1c1c1e';
const Cam: React.FC = () => { const c = useThree((s) => s.camera) as THREE.PerspectiveCamera; c.position.set(0, 3.2, 24); c.fov = 32; c.updateProjectionMatrix(); c.lookAt(0, 0.3, 4); return null; };
export const Cover09: React.FC = () => (
  <AbsoluteFill>
    <PaperPlus />
    <ThreeCanvas width={1080} height={1920} camera={{position: [0, 3.2, 24], fov: 32}} gl={{alpha: true, antialias: true}}>
      <Env /><ambientLight intensity={0.18} /><directionalLight position={[4, 6, 5]} intensity={3.0} /><directionalLight position={[-4, 1, 3]} intensity={0.45} color="#ffe2da" />
      <Cam />
      <Scene dash={1} car={{z: 9}} />
    </ThreeCanvas>
    <div style={{position: 'absolute', left: 70, right: 60, top: 300, fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 60, fontWeight: 700, letterSpacing: -1, marginBottom: 18}}>Rumah tusuk sate bawa sial?</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${CORAL}`, borderRadius: 24, background: 'rgba(250,249,246,0.95)', color: CORAL, fontSize: 124, fontWeight: 900, letterSpacing: -3, lineHeight: 1, whiteSpace: 'nowrap'}}>BUKAN SIAL</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 34, color: '#6b6b70', letterSpacing: -0.5}}>fakta rumah · bukan sial #1</div>
    </div>
  </AbsoluteFill>
);
