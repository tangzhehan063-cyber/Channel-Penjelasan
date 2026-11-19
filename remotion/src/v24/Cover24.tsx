// Cover video #24: rumah hook bukan bawa sial. Palet malam, rumah sudut + mobil kalem.
import {AbsoluteFill} from 'remotion';
import {PaperPalet, PALET} from '../aset/PaperPalet';
import {Canvas3D} from '../kit';
import {AdeganHook} from '../kit/objek/AdeganHook';

const INK = '#1c1c1e', PL = PALET.malam;
export const Cover24: React.FC = () => (
  <AbsoluteFill>
    <PaperPalet palet="malam" />
    <Canvas3D k={{t: 0, pos: [8.2, 4.6, 8.4], look: [1.6, 1.4, 1.6]}}>
      <AdeganHook t={1.0} mode="hook" warna={{accent: PL.accent, cool: PL.cool, good: PL.good}} />
    </Canvas3D>
    <div style={{position: 'absolute', left: 50, right: 50, top: 290, padding: '30px 30px 26px', borderRadius: 36, background: 'rgba(250,249,246,0.94)', border: `6px solid ${INK}`, fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 60, fontWeight: 700, letterSpacing: -1, marginBottom: 18}}>Rumah hook katanya</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${PL.accentTeks}`, borderRadius: 24, background: '#fff', color: PL.accentTeks, fontSize: 96, fontWeight: 900, letterSpacing: -3, lineHeight: 1, whiteSpace: 'nowrap'}}>BAWA SIAL?</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 26, color: '#4a4a52', letterSpacing: -0.5}}>fakta rumah · bukan sial #05</div>
    </div>
  </AbsoluteFill>
);
