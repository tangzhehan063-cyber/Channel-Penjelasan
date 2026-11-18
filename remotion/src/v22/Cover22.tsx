// Cover video #22: BI Rate naik jadi 6%, KPR kena? Palet terakota.
import {AbsoluteFill} from 'remotion';
import {PaperPalet, PALET} from '../aset/PaperPalet';
import {Canvas3D} from '../kit';
import {Bank} from '../v11/Kpr';

const INK = '#1c1c1e', PL = PALET.terakota;
export const Cover22: React.FC = () => (
  <AbsoluteFill>
    <PaperPalet palet="terakota" />
    <Canvas3D k={{t: 0, pos: [0.3, 1.5, 5.2], look: [0, 0.8, 0.1]}}><Bank p={[0, 0, 0]} /></Canvas3D>
    <div style={{position: 'absolute', left: 70, right: 60, top: 300, fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 60, fontWeight: 700, letterSpacing: -1, marginBottom: 18}}>BI Rate naik jadi 6%,</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${PL.accent}`, borderRadius: 24, background: 'rgba(250,249,246,0.92)', color: PL.accent, fontSize: 96, fontWeight: 900, letterSpacing: -3, lineHeight: 1, whiteSpace: 'nowrap'}}>KPR KENA?</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 34, color: '#6b4a3a', letterSpacing: -0.5}}>fakta rumah · hitung rumah #22</div>
    </div>
  </AbsoluteFill>
);
