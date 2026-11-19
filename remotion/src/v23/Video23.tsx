// Video #23 "Kenapa pipa wastafel dibengkokkan kayak U?" dirakit dari beats.json lewat kit <Penjelasan>. Palet mint, gaya mekanisme minimal (pilot sifon v2).
// Pola pemutus: banjir warna aksen saat bau got datang (28,7-29,6 dtk).
import {Easing} from 'remotion';
import {Penjelasan, r, type DataVideo} from '../kit';
import {PALET} from '../aset/PaperPalet';
import data from './beats.json';
import words from '../../public/v23/words.json';

export const V23_END = 57.0;
export const V23_FRAMES = Math.ceil(V23_END * 30);
export const PL = PALET.mint;

export const Banjir: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 28.7, 28.95, Easing.out(Easing.cubic)) * (1 - r(t, 29.0, 29.6));
  if (a <= 0) return null;
  return <div style={{position: 'absolute', inset: 0, background: PL.accent, opacity: 0.55 * a}} />;
};
export const Video23: React.FC = () => <Penjelasan data={data as unknown as DataVideo} words={(words as {words: {word: string; start: number; end: number}[]}).words} ekstra={[Banjir]} />;
