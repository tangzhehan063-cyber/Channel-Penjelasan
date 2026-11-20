// Cover video #26: kran putar vs kran tuas. Palet mint, adegan breakdown isometrik.
import {AbsoluteFill} from 'remotion';
import {PaperPalet, PALET} from '../aset/PaperPalet';
import {CanvasIso} from '../kit';
import {AdeganKran} from '../kit/objek/AdeganKran';

const INK = '#1c1c1e', PL = PALET.mint;
export const Cover26: React.FC = () => (
  <AbsoluteFill>
    <PaperPalet palet="mint" />
    <CanvasIso k={{t: 0, pos: [8, 9, 8], look: [0.1, 0.55, 0], zoom: 300, az: 55, el: 30}}>
      <AdeganKran t={14.5} mode="putar" warna={{accent: PL.accent, cool: PL.cool, good: PL.good}} w={{berg: [13, 14], putar: [99, 100]}} />
    </CanvasIso>
    <div style={{position: 'absolute', left: 50, right: 50, top: 290, padding: '30px 30px 26px', borderRadius: 36, background: 'rgba(250,249,246,0.94)', border: `6px solid ${INK}`, fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 60, fontWeight: 700, letterSpacing: -1, marginBottom: 18}}>Kran putar vs kran tuas,</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${PL.accent}`, borderRadius: 24, background: '#fff', color: PL.accent, fontSize: 80, fontWeight: 900, letterSpacing: -2, whiteSpace: 'nowrap'}}>JALAN AIR BEDA</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 26, color: '#3a5a4e', letterSpacing: -0.5}}>fakta rumah · #26</div>
    </div>
  </AbsoluteFill>
);
