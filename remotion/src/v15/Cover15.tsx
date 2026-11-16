// Cover video #15: wastafel + keran mengalir + judul. Gaya sama Cover14.
import {AbsoluteFill} from 'remotion';
import {PaperPlus} from '../aset/Gabung';
import {KeranFlat} from './Video15';

const CORAL = '#e2563f', INK = '#1c1c1e';
export const Cover15: React.FC = () => (
  <AbsoluteFill>
    <PaperPlus />
    <KeranFlat t={0.5} flow={1} cx={640} cy={330} sc={1.5} y0={1230} />
    <div style={{position: 'absolute', left: 70, right: 60, top: 300, fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 60, fontWeight: 700, letterSpacing: -1, marginBottom: 18}}>Air PDAM katanya aman,</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${CORAL}`, borderRadius: 24, background: 'rgba(250,249,246,0.95)', color: CORAL, fontSize: 104, fontWeight: 900, letterSpacing: -3, lineHeight: 1, whiteSpace: 'nowrap'}}>DIUJI DI MANA?</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 34, color: '#6b6b70', letterSpacing: -0.5}}>fakta rumah · air minum</div>
    </div>
  </AbsoluteFill>
);
