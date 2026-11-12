// Cover video #12: timbangan dua rumah (sewa abu vs subsidi koral) + tumpukan uang + judul.
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {AbsoluteFill} from 'remotion';
import {PaperPlus} from '../aset/Gabung';
import {Table} from '../v10/Tangga';
import {Bills} from '../v11/Kpr';
import {MiniHouse, Key, Scale} from './Timbang';

const CORAL = '#f27a63', INK = '#1c1c1e';
const POS: [number, number, number] = [0.2, 1.7, 10.2];
const Cam: React.FC = () => { const c = useThree((s) => s.camera) as THREE.PerspectiveCamera; c.position.set(...POS); c.fov = 34; c.updateProjectionMatrix(); c.lookAt(0, 0.95, 0.3); return null; };
export const Cover12: React.FC = () => (
  <AbsoluteFill>
    <PaperPlus />
    <ThreeCanvas width={1080} height={1920} shadows camera={{position: POS, fov: 34}} gl={{alpha: true, antialias: true}}>
      <hemisphereLight args={['#fffaf0', '#d8cfbd', 0.9]} />
      <directionalLight position={[3, 4.5, 3]} intensity={2.2} color="#fff4e6" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-radius={6} shadow-bias={-0.0004} />
      <Cam />
      <fog attach="fog" args={['#efece4', 11, 26]} />
      <Table />
      <Scale tilt={-0.18}>
        <group position={[-0.95, 0, 0]}><MiniHouse kind="sewa" /></group>
        <group position={[0.95, 0, 0]}><MiniHouse kind="subsidi" /></group>
        <Key p={[-0.95, 0.3, 0.31]} rot={[0, 0, -0.5]} />
      </Scale>
      <group position={[-0.95, 0, 0.95]} scale={[1.3, 0.7, 1.3]}><Bills p={[0, 0, 0]} gray={101} coral={0} /></group>
      <group position={[0.95, 0, 0.95]} scale={[1.3, 0.7, 1.3]}><Bills p={[0, 0, 0]} gray={0} coral={43} /></group>
    </ThreeCanvas>
    <div style={{position: 'absolute', left: 70, right: 60, top: 300, fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 60, fontWeight: 700, letterSpacing: -1, marginBottom: 18}}>Ngontrak vs nyicil subsidi,</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${CORAL}`, borderRadius: 24, background: 'rgba(250,249,246,0.95)', color: CORAL, fontSize: 96, fontWeight: 900, letterSpacing: -3, lineHeight: 1, whiteSpace: 'nowrap'}}>20 TAHUN LAGI?</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 34, color: '#6b6b70', letterSpacing: -0.5}}>fakta rumah · hitung rumah #2</div>
    </div>
  </AbsoluteFill>
);
