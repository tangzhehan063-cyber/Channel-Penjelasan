// Cover video #18: dinding bata memerah dihantam matahari sore + judul. Palet terakota. Gaya perspektif #8/#9.
import {AbsoluteFill} from 'remotion';
import {PaperPalet} from '../aset/PaperPalet';
import {Canvas3D, Tanah3, Wall3, Sun3, Beam3, P18} from './Video18';

const INK = '#1c1c1e';
export const Cover18: React.FC = () => (
  <AbsoluteFill>
    <PaperPalet palet="terakota" />
    <Canvas3D k={{t: 0, pos: [0.5, 1.5, 7.4], look: [0.35, 1.45, 0]}}>
      <Tanah3 /><Wall3 p={[0.55, 0, 0]} hot={0.9} t={0.6} /><Sun3 p={[-1.2, 2.3, 0.8]} s={0.42} t={0.6} /><Beam3 a={[-0.9, 2.1, 0.8]} b={[-0.6, 1.5, 0.8]} t={0.6} n={5} />
    </Canvas3D>
    <div style={{position: 'absolute', left: 70, right: 60, top: 300, fontFamily: 'Inter', color: INK}}>
      <div style={{fontSize: 60, fontWeight: 700, letterSpacing: -1, marginBottom: 18}}>Rumah hadap barat katanya panas,</div>
      <div style={{display: 'inline-block', transform: 'rotate(-4deg)', padding: '14px 34px', border: `12px solid ${P18.coral}`, borderRadius: 24, background: 'rgba(250,249,246,0.95)', color: P18.coral, fontSize: 96, fontWeight: 900, letterSpacing: -3, lineHeight: 1, whiteSpace: 'nowrap'}}>DINDINGNYA</div>
      <div style={{fontSize: 44, fontWeight: 700, marginTop: 34, color: '#6b4630', letterSpacing: -0.5}}>fakta rumah · panas sore</div>
    </div>
  </AbsoluteFill>
);
