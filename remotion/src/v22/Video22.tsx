// Video #22 "BI Rate naik jadi 6%: dampak ke KPR" dirakit dari beats.json lewat kit <Penjelasan>. Palet terakota, tanpa ornamen sudut.
// Panel 2D pemutus pola (Lonjakan): cicilan bunga 3% vs 13% (perkiraan), di beat 38,0-42,6 dtk.
import {Easing} from 'remotion';
import {Penjelasan, INK, r, type DataVideo} from '../kit';
import {PALET} from '../aset/PaperPalet';
import data from './beats.json';
import words from '../../public/v22/words.json';

export const FPS = 30;
export const V22_END = 54.1;
export const V22_FRAMES = Math.ceil(V22_END * FPS);
export const PL = PALET.terakota;

export const Lonjakan: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 38.0, 38.5, Easing.out(Easing.cubic)), o = 1 - r(t, 42.3, 42.64);
  if (a * o <= 0) return null;
  const b1 = r(t, 38.4, 39.2, Easing.out(Easing.cubic)), b2 = r(t, 39.4, 41.2, Easing.out(Easing.cubic));
  const H = 330, h1 = (2.77 / 5.86) * H * b1, h2 = H * b2;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: a * o}}>
      <div style={{position: 'absolute', left: 60, right: 60, top: 720, height: 600, borderRadius: 34, background: '#faf3ec', border: `6px solid ${INK}`, transform: `translateY(${(1 - a) * 40}px)`, overflow: 'hidden', fontFamily: 'Inter'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 22, textAlign: 'center', fontWeight: 800, fontSize: 38, color: INK}}>cicilan per bulan (perkiraan)</div>
        {[{x: 230, h: h1, c: PL.cool, v: '±Rp2,77 jt', n: 'bunga 3%', k: b1}, {x: 650, h: h2, c: PL.accent, v: '±Rp5,86 jt', n: 'bunga 13%', k: b2}].map((b) => (
          <div key={b.n}>
            <div style={{position: 'absolute', left: b.x - 120, width: 240, bottom: 130, height: b.h, background: b.c, border: `5px solid ${INK}`, borderRadius: '16px 16px 4px 4px'}} />
            <div style={{position: 'absolute', left: b.x - 150, width: 300, bottom: 140 + b.h, textAlign: 'center', fontWeight: 900, fontSize: 46, color: b.c, opacity: b.k}}>{b.v}</div>
            <div style={{position: 'absolute', left: b.x - 150, width: 300, bottom: 78, textAlign: 'center', fontWeight: 800, fontSize: 42, color: INK}}>{b.n}</div>
          </div>
        ))}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 22, textAlign: 'center', fontWeight: 700, fontSize: 34, color: '#6b5a4e'}}>pinjaman Rp500 jt, 20 tahun</div>
      </div>
    </div>
  );
};
export const Video22: React.FC = () => <Penjelasan data={data as unknown as DataVideo} words={(words as {words: {word: string; start: number; end: number}[]}).words} ekstra={[Lonjakan]} />;
