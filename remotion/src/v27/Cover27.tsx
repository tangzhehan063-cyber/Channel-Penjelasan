// Cover video #27: atap bocor padahal genteng utuh. Palet langit, adegan breakdown isometrik.
import {AbsoluteFill} from 'remotion';
import {PaperPalet, PALET} from '../aset/PaperPalet';
import {CanvasIso} from '../kit';
import {AdeganAtap} from '../kit/objek/AdeganAtap';

const INK = '#1c1c1e', PL = PALET.langit;
export const Cover27: React.FC = () => (
  <AbsoluteFill>
    <PaperPalet palet="langit" />
    <CanvasIso k={{t: 0, pos: [8, 9, 8], look: [0.3, 0.9, 0], zoom: 175, az: 28, el: 20}}>
      <AdeganAtap t={60} mode="atap" warna={{accent: PL.accent, cool: PL.cool, good: PL.good}} w={{}} />
    </CanvasIso>
    <div style={{position: 'absolute', left: 50, right: 50, top: 290, padding: '30px 30px 26px', borderRadius: 36, background: 'rgba(250,249,246,0.94)', border: `6px solid ${INK}`, fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 58, fontWeight: 700, letterSpacing: -1, marginBottom: 18}}>Genteng utuh, atap bocor?</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${PL.accent}`, borderRadius: 24, background: '#fff', color: PL.accent, fontSize: 80, fontWeight: 900, letterSpacing: -2, whiteSpace: 'nowrap'}}>4 BIANG KEROK</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 26, color: '#3f5b73', letterSpacing: -0.5}}>fakta rumah · #27</div>
    </div>
  </AbsoluteFill>
);
