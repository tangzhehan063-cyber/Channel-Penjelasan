// Cover video #23: kenapa pipa wastafel bengkok. Palet mint.
import {AbsoluteFill} from 'remotion';
import {PaperPalet, PALET} from '../aset/PaperPalet';
import {Canvas3D} from '../kit';
import {Sifon} from '../kit/objek/Sifon';

const INK = '#1c1c1e', PL = PALET.mint;
export const Cover23: React.FC = () => (
  <AbsoluteFill>
    <PaperPalet palet="mint" />
    <Canvas3D k={{t: 0, pos: [-0.2, 1.3, 7.4], look: [0.1, 0.95, 0]}}><Sifon t={5} w={{buka: 99, ujung: 100, tutup: 101, surut: 102, gas: 99, gasSelesai: 100, awal: true}} warna={{accent: PL.accent, cool: PL.cool, good: PL.good}} /></Canvas3D>
    <div style={{position: 'absolute', left: 70, right: 60, top: 300, fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 60, fontWeight: 700, letterSpacing: -1, marginBottom: 18}}>Pipa wastafel dibengkokkan,</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${PL.cool}`, borderRadius: 24, background: 'rgba(250,249,246,0.92)', color: PL.cool, fontSize: 96, fontWeight: 900, letterSpacing: -3, lineHeight: 1, whiteSpace: 'nowrap'}}>KENAPA U?</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 34, color: '#3a5a4e', letterSpacing: -0.5}}>fakta rumah · cara kerja #23</div>
    </div>
  </AbsoluteFill>
);
