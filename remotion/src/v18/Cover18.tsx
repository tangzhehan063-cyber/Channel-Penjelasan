// Cover video #18: matahari sore + dinding barat memerah + judul. Palet terakota.
import {AbsoluteFill} from 'remotion';
import {PaperPalet} from '../aset/PaperPalet';
import {Stage, P18} from './Video18';

const INK = '#1c1c1e';
export const Cover18: React.FC = () => (
  <AbsoluteFill>
    <PaperPalet palet="terakota" />
    <div style={{position: 'absolute', left: 70, right: 60, top: 300, fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 60, fontWeight: 700, letterSpacing: -1, marginBottom: 18}}>Rumah hadap barat katanya panas,</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${P18.coral}`, borderRadius: 24, background: 'rgba(250,249,246,0.95)', color: P18.coral, fontSize: 96, fontWeight: 900, letterSpacing: -3, lineHeight: 1, whiteSpace: 'nowrap'}}>DINDINGNYA</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 34, color: '#6b4630', letterSpacing: -0.5}}>fakta rumah · panas sore</div>
    </div>
  </AbsoluteFill>
);
export {Stage};
