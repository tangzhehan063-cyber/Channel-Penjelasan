// Cover video #25: dinding retak. Palet krem, adegan breakdown isometrik.
import {AbsoluteFill} from 'remotion';
import {PaperPalet, PALET} from '../aset/PaperPalet';
import {CanvasIso} from '../kit';
import {AdeganDinding} from '../kit/objek/AdeganDinding';

const INK = '#1c1c1e', PL = PALET.krem;
export const Cover25: React.FC = () => (
  <AbsoluteFill>
    <PaperPalet palet="krem" />
    <CanvasIso k={{t: 0, pos: [8, 8.4, 8], look: [0.1, 0.55, 0.1], zoom: 360}}>
      <AdeganDinding t={29} mode="dinding" warna={{accent: PL.accent, cool: PL.cool, good: PL.good}} w={{hook: [0, 0.1], hookOut: [99, 100], turun: [26.4, 28.4], rapat: [99, 100]}} />
    </CanvasIso>
    <div style={{position: 'absolute', left: 50, right: 50, top: 290, padding: '30px 30px 26px', borderRadius: 36, background: 'rgba(250,249,246,0.94)', border: `6px solid ${INK}`, fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 60, fontWeight: 700, letterSpacing: -1, marginBottom: 18}}>Dinding rumahmu retak?</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${PL.accent}`, borderRadius: 24, background: '#fff', color: PL.accent, fontSize: 84, fontWeight: 900, letterSpacing: -3}}>BELUM TENTU ROBOH</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 26, color: '#5a5a5e', letterSpacing: -0.5}}>fakta rumah · #25</div>
    </div>
  </AbsoluteFill>
);
