// Cover video #8: rumah malam + "TEK!" + judul "BUKAN HANTU", 1080×1920.
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {AbsoluteFill} from 'remotion';
import {Env} from '../pengetahuan/Scene';
import {House} from './Rumah';

const NAVY = '#1b2640', CORAL = '#ef7663';
const Cam: React.FC = () => { const c = useThree((s) => s.camera) as THREE.PerspectiveCamera; c.position.set(3.8, 3.6, 15.0); c.fov = 34; c.updateProjectionMatrix(); c.lookAt(-0.2, 2.2, 0); return null; };
export const Cover08: React.FC = () => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${NAVY} 0%, #2b3a5e 100%)`}}>
    <svg width="1080" height="1920" style={{position: 'absolute'}}>
      <path d="M880 820 a90 90 0 1 0 78 132 a72 72 0 1 1 -78 -132 z" fill="#f4ecd2" stroke="#1c1c1e" strokeWidth="8" />
      {[[160, 820], [420, 760], [640, 900], [300, 1000], [980, 1040]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill="#f4ecd2" />)}
    </svg>
    <ThreeCanvas width={1080} height={1920} camera={{position: [3.8, 3.6, 15.0], fov: 34}} gl={{alpha: true, antialias: true}}>
      <Env /><ambientLight intensity={0.18} /><directionalLight position={[4, 6, 5]} intensity={1.6} color="#cfe0ff" /><directionalLight position={[-4, 1, 3]} intensity={0.45} color="#ffe2da" />
      <Cam />
      <House heat={-0.8} night={1} glow={1} />
    </ThreeCanvas>
    <div style={{position: 'absolute', left: 760, top: 1010, transform: 'rotate(-8deg) scale(0.85)'}}>
      <svg width="420" height="330" style={{position: 'absolute', left: -210, top: -165, overflow: 'visible'}}>
        <polygon transform="translate(210 165)" fill="#fff" stroke="#1c1c1e" strokeWidth="10" strokeLinejoin="round"
          points={Array.from({length: 16}, (_, i) => { const a = (i / 16) * Math.PI * 2, rr = i % 2 ? 125 : 185; return `${Math.cos(a) * rr},${Math.sin(a) * rr * 0.78}`; }).join(' ')} />
      </svg>
      <div style={{position: 'absolute', left: -210, top: -72, width: 420, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontStyle: 'italic', fontSize: 128, color: CORAL, letterSpacing: -4, lineHeight: 1}}>TEK!</div>
    </div>
    <div style={{position: 'absolute', left: 70, right: 60, top: 300, fontFamily: 'Inter', color: '#fff'}}>
      <div style={{fontSize: 56, fontWeight: 700, letterSpacing: -1, marginBottom: 16, color: '#f4ecd2'}}>Bunyi "tek" di atap tengah malam?</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${CORAL}`, borderRadius: 24, background: 'rgba(250,249,246,0.95)', color: CORAL, fontSize: 116, fontWeight: 900, letterSpacing: -3, lineHeight: 1, whiteSpace: 'nowrap'}}>BUKAN HANTU</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 34, color: '#b9c6e4', letterSpacing: -0.5}}>fakta rumah · bukan hantu #1</div>
    </div>
  </AbsoluteFill>
);
