// Cover video #14: kamar dengan AC menetes ke kasur ala referensi + judul.
import {AbsoluteFill} from 'remotion';
import {PaperPlus} from '../aset/Gabung';
import {Room, Stage} from './Video14';

const CORAL = '#e2563f', INK = '#1c1c1e';
export const Cover14: React.FC = () => (
  <AbsoluteFill>
    <PaperPlus />
    <Stage cam={[0.2, 1.75, 330]}><Room t={0.37} leak={1} /></Stage>
    <div style={{position: 'absolute', left: 70, right: 60, top: 300, fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 60, fontWeight: 700, letterSpacing: -1, marginBottom: 18}}>AC netes ke kasur,</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${CORAL}`, borderRadius: 24, background: 'rgba(250,249,246,0.95)', color: CORAL, fontSize: 104, fontWeight: 900, letterSpacing: -3, lineHeight: 1, whiteSpace: 'nowrap'}}>BUKAN BOCOR</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 34, color: '#6b6b70', letterSpacing: -0.5}}>fakta rumah · bongkar barang</div>
    </div>
  </AbsoluteFill>
);
