// Video #25 "Dinding Retak, Rumah Mau Roboh?" dirakit dari beats.json lewat kit <Penjelasan>. Palet krem (bawaan). Gaya percobaan: adegan breakdown isometrik.
// Pola pemutus: banjir koral saat "Tapi kalau tanah di bawah pondasi turun" (25,15-25,9 dtk).
import {Easing} from 'remotion';
import {Penjelasan, r, type DataVideo} from '../kit';
import {PALET} from '../aset/PaperPalet';
import data from './beats.json';
import words from '../../public/v25/words.json';

export const V25_END = 54.4;
export const V25_FRAMES = Math.ceil(V25_END * 30);
export const PL = PALET.krem;

export const Banjir: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 25.15, 25.35, Easing.out(Easing.cubic)) * (1 - r(t, 25.45, 25.95));
  if (a <= 0) return null;
  return <div style={{position: 'absolute', inset: 0, background: PL.accent, opacity: 0.55 * a}} />;
};
export const Video25: React.FC = () => <Penjelasan data={data as unknown as DataVideo} words={(words as {words: {word: string; start: number; end: number}[]}).words} ekstra={[Banjir]} />;
