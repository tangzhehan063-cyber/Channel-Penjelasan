// Cover video #17: potongan jalan + rumah di cekungan + judul. Palet langit.
import {AbsoluteFill} from 'remotion';
import {PaperPalet} from '../aset/PaperPalet';
import {Stage, P17, Dunia, Rumah, Tanam, Hujan, Genangan} from './Video17';

const INK = '#1c1c1e';
export const Cover17: React.FC = () => (
  <AbsoluteFill>
    <PaperPalet palet="langit" />
    <Stage cam={[1.1, 0.35, 118]}><Dunia k={0} /><Rumah k={0} wet={1} glow={0} t={0.5} /><Tanam k={0} /><Hujan t={0.5} o={1} k={0} /><Genangan lvl={0.17} /></Stage>
    <div style={{position: 'absolute', left: 70, right: 60, top: 300, fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 60, fontWeight: 700, letterSpacing: -1, marginBottom: 18}}>Rumah lebih rendah dari jalan,</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${P17.coral}`, borderRadius: 24, background: 'rgba(250,249,246,0.95)', color: P17.coral, fontSize: 104, fontWeight: 900, letterSpacing: -3, lineHeight: 1, whiteSpace: 'nowrap'}}>BUKAN SIAL</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 34, color: '#4a5a6b', letterSpacing: -0.5}}>fakta rumah · bukan sial #03</div>
    </div>
  </AbsoluteFill>
);
