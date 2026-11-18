// Kit Penjelasan: teks layar (kartu judul 2 lapis, subtitle per frasa, stiker). Dari v20; aturan KUNCI KARAKTER:
// teks maksimal dua lapis di atas (kicker + kartu judul dua baris), subtitle di CC_TOP 1400 (ACC user).
import {createContext, useContext, useMemo} from 'react';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {Easing} from 'remotion';
import {INK} from './prim';
import {CC_TOP, r} from './waktu';

export type Tema = {accent: string; cool: string; good: string};
const TemaCtx = createContext<Tema>({accent: '#e2563f', cool: '#5d8fd6', good: '#4d9a6a'});
/** bungkus komposisi: warna teks mengikuti palet video (PALET.<nama> dari aset/PaperPalet) */
export const TemaProvider = TemaCtx.Provider;
export const useTema = () => useContext(TemaCtx);

const CARD = 'rgba(250,249,246,0.95)';

/** kartu judul: baris kecil + baris besar berwarna. Hanya dua baris, tidak boleh ada baris kosong. */
export const Title: React.FC<{t: number; a: number; b: number; small: string; big: string; bigColor?: string; size?: number; top?: number}> = ({t, a, b, small, big, bigColor, size = 112, top = 450}) => {
  const tema = useTema();
  const i = r(t, a, a + 0.45, Easing.out(Easing.cubic)), o = 1 - r(t, b - 0.3, b);
  if (i * o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 60, top, maxWidth: 960, padding: '20px 30px 24px', borderRadius: 26, background: CARD, boxShadow: '0 12px 40px rgba(28,28,30,0.18)', fontFamily: 'Inter', color: INK, opacity: i * o, transform: `translateY(${(1 - i) * 26}px)`}}>
      <div style={{fontSize: 50, fontWeight: 700, letterSpacing: -1}}>{small}</div>
      <div style={{whiteSpace: 'nowrap', fontSize: size, fontWeight: 900, letterSpacing: -2, lineHeight: 1.0, color: bigColor ?? tema.accent, marginTop: 6}}>{big}</div>
    </div>
  );
};

export type KataVO = {word: string; start: number; end: number};
/** subtitle per frasa dari public/vNN/words.json; kata yang sedang diucapkan berwarna aksen */
export const Captions: React.FC<{ms: number; words: KataVO[]}> = ({ms, words}) => {
  const tema = useTema();
  const pages = useMemo(() => {
    const caps: Caption[] = words.map((w, i) => ({text: (i ? ' ' : '') + w.word, startMs: w.start * 1000, endMs: w.end * 1000, timestampMs: w.start * 1000, confidence: 1}));
    return createTikTokStyleCaptions({captions: caps, combineTokensWithinMilliseconds: 950}).pages;
  }, [words]);
  const pg = pages.find((p, i) => ms >= p.startMs && ms < (pages[i + 1]?.startMs ?? p.startMs + p.durationMs + 400));
  if (!pg) return null;
  const k = r(ms / 1000, pg.startMs / 1000, pg.startMs / 1000 + 0.15);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: CC_TOP, textAlign: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: 60, letterSpacing: -0.8, lineHeight: 1.15, color: INK, opacity: k, transform: `translateY(${(1 - k) * 10}px)`}}>
      <span style={{display: 'inline-block', padding: '12px 28px 16px', borderRadius: 22, background: CARD, boxShadow: '0 10px 30px rgba(28,28,30,0.18)'}}>
        {pg.tokens.map((tk, i) => <span key={i} style={{color: ms >= tk.fromMs && ms < tk.toMs + 120 ? tema.accent : INK}}>{tk.text}</span>)}
      </span>
    </div>
  );
};

/** stiker kecil (penjelas sekunder; pesan utama tetap di kartu judul + objek). Clamp x ke 250..900 bila memakai proj(). */
export const Chip: React.FC<{x: number; y: number; p: number; text: string; color?: string; size?: number}> = ({x, y, p, text, color = INK, size = 40}) => {
  if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * p})`, opacity: p, padding: '10px 22px', borderRadius: 16, background: 'rgba(250,249,246,0.97)', border: `4px solid ${color}`, fontFamily: 'Inter', fontWeight: 800, fontSize: size, color, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(28,28,30,0.18)'}}>{text}</div>;
};
/** pasang stiker pada titik 3D tanpa terpotong tepi layar */
export const klem = (x: number, y: number, dx = 0, dy = 0): [number, number] => [Math.max(250, Math.min(900, x + dx)), Math.max(900, Math.min(1260, y + dy))];
