// Cover video #19: pintu depan sejajar pintu belakang + koin rezeki. Palet mint.
import {AbsoluteFill} from 'remotion';
import {PaperPalet} from '../aset/PaperPalet';
import {Canvas3D, Hall, PL} from './Video19';

const INK = '#1c1c1e';
export const Cover19: React.FC = () => (
  <AbsoluteFill>
    <PaperPalet palet="mint" />
    <Canvas3D k={{t: 0, pos: [0.2, 1.3, 8.4], look: [0, 1.0, -2]}}><Hall coin={0.28} t={1} /></Canvas3D>
    <div style={{position: 'absolute', left: 70, right: 60, top: 300, fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 60, fontWeight: 700, letterSpacing: -1, marginBottom: 18}}>Pintu depan sejajar pintu belakang,</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${PL.accent}`, borderRadius: 24, background: 'rgba(250,249,246,0.92)', color: PL.accent, fontSize: 104, fontWeight: 900, letterSpacing: -3, lineHeight: 1, whiteSpace: 'nowrap'}}>REZEKI LEWAT?</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 34, color: '#4a5a6b', letterSpacing: -0.5}}>fakta rumah · bukan sial #04</div>
    </div>
  </AbsoluteFill>
);
