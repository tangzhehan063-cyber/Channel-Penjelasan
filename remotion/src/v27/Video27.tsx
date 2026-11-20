// Video #27 "Atap Bocor Padahal Genteng Utuh? 4 Biang Keroknya" dirakit dari beats.json lewat kit <Penjelasan>. Palet langit. Format lebih panjang (±82 dtk), penghitung 1/4…4/4, sudut kamera berganti.
// Pola pemutus: banjir aksen + panel 2D "titik masuk vs titik netes" saat janji kedua dibayar (54,7-58,6 dtk).
import {Easing} from 'remotion';
import {Penjelasan, r, type DataVideo} from '../kit';
import {PALET} from '../aset/PaperPalet';
import data from './beats.json';
import words from '../../public/v27/words.json';

export const V27_END = 82.7;
export const V27_FRAMES = Math.ceil(V27_END * 30);
export const PL = PALET.langit;

export const Banjir: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 54.7, 54.95, Easing.out(Easing.cubic)) * (1 - r(t, 55.05, 55.6));
  if (a <= 0) return null;
  return <div style={{position: 'absolute', inset: 0, background: PL.accent, opacity: 0.55 * a}} />;
};
/** panel 2D di bawah kartu judul dan di atas subtitle: titik air masuk (atas) vs titik netes (plafon) */
export const PanelJejak: React.FC<{t: number}> = ({t}) => {
  const p = r(t, 55.3, 55.8) * (1 - r(t, 58.1, 58.5));
  if (p <= 0) return null;
  const d = r(t, 55.9, 57.3);
  const L = 760;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 790, height: 430, borderRadius: 32, background: 'rgba(250,249,246,0.96)', border: '6px solid #1c1c1e', opacity: p, transform: `translateY(${(1 - p) * 20}px)`, fontFamily: 'Inter', color: '#1c1c1e'}}>
      <svg width={960} height={430} viewBox="0 0 960 430" style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={60} y1={350} x2={900} y2={350} stroke="#8a8f98" strokeWidth={10} strokeLinecap="round" />
        <line x1={80} y1={250} x2={880} y2={70} stroke="#c2623f" strokeWidth={16} strokeLinecap="round" />
        <polyline points="860,100 500,200 500,350" fill="none" stroke={PL.cool} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - d)} />
        <circle cx={860} cy={100} r={20} fill={PL.accent} stroke="#1c1c1e" strokeWidth={5} />
        <circle cx={500} cy={350} r={20} fill={PL.good} stroke="#1c1c1e" strokeWidth={5} opacity={d > 0.9 ? 1 : 0} />
        <text x={700} y={50} fontSize={34} fontWeight={800} fill={PL.accent}>TITIK MASUK</text>
        <text x={330} y={405} fontSize={34} fontWeight={800} fill={PL.good}>TITIK NETES</text>
      </svg>
    </div>
  );
};
export const Video27: React.FC = () => <Penjelasan data={data as unknown as DataVideo} words={(words as {words: {word: string; start: number; end: number}[]}).words} ekstra={[Banjir, PanelJejak]} />;
