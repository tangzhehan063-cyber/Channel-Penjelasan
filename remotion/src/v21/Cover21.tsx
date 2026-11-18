// Cover video #21: cor garasi pakai besi, kok retak? Palet batu.
import {AbsoluteFill} from 'remotion';
import {PaperPalet} from '../aset/PaperPalet';
import {Canvas3D, Pelat} from '../kit';
import {PALET} from '../aset/PaperPalet';

const INK = '#1c1c1e', PL = PALET.batu;
export const Cover21: React.FC = () => (
  <AbsoluteFill>
    <PaperPalet palet="batu" />
    <Canvas3D k={{t: 0, pos: [0.4, 1.9, 7.6], look: [0, 0.3, 0.2]}}><Pelat warna={PL} gap={0.045} glow={1} /></Canvas3D>
    <div style={{position: 'absolute', left: 70, right: 60, top: 300, fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 60, fontWeight: 700, letterSpacing: -1, marginBottom: 18}}>Garasi dicor pakai besi,</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${PL.accent}`, borderRadius: 24, background: 'rgba(250,249,246,0.92)', color: PL.accent, fontSize: 96, fontWeight: 900, letterSpacing: -3, lineHeight: 1, whiteSpace: 'nowrap'}}>KOK RETAK?</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 34, color: '#4b5560', letterSpacing: -0.5}}>fakta rumah · cara kerja #21</div>
    </div>
  </AbsoluteFill>
);
