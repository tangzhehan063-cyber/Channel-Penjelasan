// Cover video #14: dua lampu sama terang + "LED NGGAK LEBIH TERANG", 1080×1920 (teks di pita tengah, aman untuk crop 3:4).
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill} from 'remotion';
import {PaperPlus, Kicker} from '../aset/Gabung';
import {Env} from '../pengetahuan/Scene';
import {Rig, Base} from '../v13/Mood13';
import {Incandescent, LedLamp, P14} from './Lamp14';
import {C} from '../aset/Aset';

export const Cover14: React.FC = () => (
  <AbsoluteFill>
    <PaperPlus />
    <Kicker text="FAKTA RUMAH · #14" y={250} start={0} />
    <div style={{position: 'absolute', left: 60, right: 60, top: 330, fontFamily: 'Inter', color: C.ink}}>
      <div style={{fontSize: 70, fontWeight: 800, letterSpacing: -1.5}}>Lampu LED itu</div>
      <div style={{fontSize: 150, fontWeight: 900, letterSpacing: -5, lineHeight: 0.95, color: '#e2563f', whiteSpace: 'nowrap'}}>NGGAK</div>
      <div style={{fontSize: 150, fontWeight: 900, letterSpacing: -5, lineHeight: 0.95, color: C.ink, whiteSpace: 'nowrap'}}>LEBIH TERANG</div>
    </div>
    <ThreeCanvas width={1080} height={1920} shadows orthographic camera={{position: [0, 4, 30], zoom: 200, near: 0.1, far: 100}} gl={{alpha: true, antialias: true}}>
      <Rig x={0} y={0.25} zoom={300} />
      <Env intensity={0.35} /><hemisphereLight args={['#fffaf0', '#cfc6b4', 0.6]} />
      <directionalLight position={[2.5, 4.5, 3.0]} intensity={2.2} color="#fff4e6" castShadow />
      <Base w={4.6} />
      <Incandescent x={-1.0} glow={1} />
      <LedLamp x={1.0} glow={1} cut chipPulse={1} />
    </ThreeCanvas>
    <div style={{position: 'absolute', left: 60, right: 60, top: 1500, fontFamily: 'Inter', fontWeight: 800, fontSize: 56, color: P14.elec, textAlign: 'center'}}>cuma nggak boros panas</div>
  </AbsoluteFill>
);
