// Video #21 "Cor garasi pakai besi, kok masih retak?" dirakit dari beats.json lewat kit <Penjelasan>. Palet batu, tanpa ornamen sudut.
// Panel 2D pemutus pola (Banding): penampang pelat tanpa besi vs dengan besi, di beat 42,4-48,5 dtk.
import {Easing} from 'remotion';
import {Penjelasan, INK, r, type DataVideo} from '../kit';
import {PALET} from '../aset/PaperPalet';
import data from './beats.json';
import words from '../../public/v21/words.json';

export const FPS = 30;
export const V21_END = 63.7;
export const V21_FRAMES = Math.ceil(V21_END * FPS);
export const PL = PALET.batu;
const B = (data as unknown as DataVideo).beats;

const Penampang: React.FC<{x: number; y: number; gap: number; besi: boolean; label: string; color: string; p: number}> = ({x, y, gap, besi, label, color, p}) => (
  <g opacity={p} transform={`translate(${x} ${y + (1 - p) * 30})`}>
    <rect x={-380 - gap / 2} y={0} width={380} height={86} rx={12} fill="#f1f1ec" stroke={INK} strokeWidth={6} />
    <rect x={gap / 2} y={0} width={380} height={86} rx={12} fill="#f1f1ec" stroke={INK} strokeWidth={6} />
    <rect x={-gap / 2} y={4} width={gap} height={78} fill={PL.accent} opacity={0.9} />
    {besi && <line x1={-370} y1={22} x2={370} y2={22} stroke={PL.good} strokeWidth={9} strokeLinecap="round" />}
    <text x={0} y={-22} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={46} fill={color}>{label}</text>
  </g>
);
export const Banding: React.FC<{t: number}> = ({t}) => {
  const a = r(t, B.banding, B.banding + 0.5, Easing.out(Easing.cubic)), o = 1 - r(t, B.aksi - 0.3, B.aksi);
  const p1 = r(t, 43.0, 43.6, Easing.out(Easing.cubic)), p2 = r(t, 45.6, 46.2, Easing.out(Easing.cubic));
  const g1 = 150 * r(t, 43.6, 45.4), g2 = 22;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: a * o}}>
      <div style={{position: 'absolute', left: 60, right: 60, top: 720, height: 560, borderRadius: 34, background: '#f4f5f2', border: `6px solid ${INK}`, transform: `translateY(${(1 - a) * 40}px)`, overflow: 'hidden'}}>
        <svg width="960" height="560" style={{position: 'absolute'}}>
          <Penampang x={480} y={110} gap={g1} besi={false} label="TANPA BESI" color={PL.accent} p={p1} />
          <Penampang x={480} y={380} gap={g2} besi label="DENGAN BESI" color={PL.good} p={p2} />
        </svg>
      </div>
    </div>
  );
};

export const Video21: React.FC = () => <Penjelasan data={data as unknown as DataVideo} words={(words as {words: {word: string; start: number; end: number}[]}).words} ekstra={[Banding]} />;
