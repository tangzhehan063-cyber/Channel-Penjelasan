// Cover video #10: tangga kertas, anak tangga ke-5 lebih tinggi (koral) + judul.
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {AbsoluteFill} from 'remotion';
import {PaperPlus} from '../aset/Gabung';
import {Stairs, Table} from './Tangga';

const CORAL = '#f27a63', INK = '#1c1c1e';
const Cam: React.FC = () => { const c = useThree((s) => s.camera) as THREE.PerspectiveCamera; c.position.set(5.2, 3.6, 4.6); c.fov = 34; c.updateProjectionMatrix(); c.lookAt(0, 1.5, -1.0); return null; };
export const Cover10: React.FC = () => (
  <AbsoluteFill>
    <PaperPlus />
    <ThreeCanvas width={1080} height={1920} shadows camera={{position: [5.2, 3.6, 4.6], fov: 34}} gl={{alpha: true, antialias: true}}>
      <hemisphereLight args={['#fffaf0', '#d8cfbd', 0.9]} />
      <directionalLight position={[2.5, 4.5, 3.0]} intensity={2.2} color="#fff4e6" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-radius={6} shadow-bias={-0.0004} />
      <Cam />
      <fog attach="fog" args={['#efece4', 9, 22]} />
      <Table /><Stairs fold={1} bump={1} hi={[4]} />
    </ThreeCanvas>
    <div style={{position: 'absolute', left: 70, right: 60, top: 300, fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 60, fontWeight: 700, letterSpacing: -1, marginBottom: 18}}>Anak tangga harus ganjil?</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${CORAL}`, borderRadius: 24, background: 'rgba(250,249,246,0.95)', color: CORAL, fontSize: 104, fontWeight: 900, letterSpacing: -3, lineHeight: 1, whiteSpace: 'nowrap'}}>BUKAN ITU</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 34, color: '#6b6b70', letterSpacing: -0.5}}>fakta rumah · bukan sial #2</div>
    </div>
  </AbsoluteFill>
);
