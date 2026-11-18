// Cover video #20: stop kontak mirip hidung babi. Palet madu.
import {AbsoluteFill} from 'remotion';
import {PaperPalet} from '../aset/PaperPalet';
import {Canvas3D, Scene, PL} from './Video20';

const INK = '#1c1c1e';
export const Cover20: React.FC = () => (
  <AbsoluteFill>
    <PaperPalet palet="madu" />
    <Canvas3D k={{t: 0, pos: [0.0, -0.1, 4.6], look: [0, -0.1, 0]}}><Scene t={0} mode="hook" /></Canvas3D>
    <div style={{position: 'absolute', left: 70, right: 60, top: 300, fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 60, fontWeight: 700, letterSpacing: -1, marginBottom: 18}}>Stop kontakmu mirip</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${PL.accent}`, borderRadius: 24, background: 'rgba(250,249,246,0.92)', color: PL.accent, fontSize: 96, fontWeight: 900, letterSpacing: -3, lineHeight: 1, whiteSpace: 'nowrap'}}>HIDUNG BABI?</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 34, color: '#6b5a2e', letterSpacing: -0.5}}>fakta rumah · cara kerja #20</div>
    </div>
  </AbsoluteFill>
);
