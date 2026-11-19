// Video #24 "Rumah Hook Bawa Sial?" dirakit dari beats.json lewat kit <Penjelasan>. Palet malam. Satu dunia 3D (kit/objek/AdeganHook), hanya kamera yang berganti.
// Pola pemutus: banjir warna aksen di titik balik "tapi ada yang harus ditanggung" (21,7 dtk) + kertas "SIAL" disobek (31,8-35,4 dtk).
import {Easing} from 'remotion';
import {Penjelasan, r, type DataVideo} from '../kit';
import {PALET} from '../aset/PaperPalet';
import data from './beats.json';
import words from '../../public/v24/words.json';

export const V24_END = 53.6;
export const V24_FRAMES = Math.ceil(V24_END * 30);
export const PL = PALET.malam;

export const Banjir: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 21.7, 21.95, Easing.out(Easing.cubic)) * (1 - r(t, 22.0, 22.6));
  if (a <= 0) return null;
  return <div style={{position: 'absolute', inset: 0, background: PL.accent, opacity: 0.55 * a}} />;
};

const KARTU = (kiri: boolean): React.CSSProperties => ({
  position: 'absolute', inset: 0, borderRadius: 44, background: '#faf9f6', border: '5px solid #1c1c1e', display: 'flex', alignItems: 'center', justifyContent: 'center',
  clipPath: kiri ? 'polygon(0 0, 52% 0, 46% 30%, 54% 60%, 48% 100%, 0 100%)' : 'polygon(52% 0, 100% 0, 100% 100%, 48% 100%, 54% 60%, 46% 30%)',
});
export const Sobek: React.FC<{t: number}> = ({t}) => {
  const a = 31.8;
  if (t < a || t > 35.5) return null;
  const masuk = r(t, a, a + 0.3, Easing.out(Easing.back(1.8))), hilang = r(t, 35.0, 35.4), sobek = r(t, 33.3, 34.3, Easing.in(Easing.cubic)), coret = r(t, 32.4, 33.0);
  const kata = <div style={{position: 'relative', fontFamily: 'Inter, Arial Black, sans-serif', fontWeight: 900, fontSize: 190, color: PL.accentTeks, letterSpacing: 6}}>
    SIAL<div style={{position: 'absolute', left: -20, top: '52%', height: 16, width: `${(coret * 112).toFixed(1)}%`, background: '#1c1c1e', borderRadius: 8}} /></div>;
  return (
    <div style={{position: 'absolute', left: 90, top: 800, width: 900, height: 300, opacity: 1 - hilang, transform: `scale(${masuk})`}}>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${-sobek * 170}px) rotate(${-sobek * 9}deg)`}}><div style={KARTU(true)}>{kata}</div></div>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${sobek * 170}px) rotate(${sobek * 9}deg)`}}><div style={KARTU(false)}>{kata}</div></div>
    </div>
  );
};
export const Video24: React.FC = () => <Penjelasan data={data as unknown as DataVideo} words={(words as {words: {word: string; start: number; end: number}[]}).words} ekstra={[Banjir, Sobek]} />;
