// Video #26 "Kran Putar vs Kran Tuas: Jalan Airnya Beda" dirakit dari beats.json lewat kit <Penjelasan>. Palet mint. Gaya: breakdown isometrik terang, dua benda, sudut kamera berganti (az/el).
// Pola pemutus: banjir aksen saat payoff (39,75-40,3 dtk) + panel 2D jalur berbelok vs lurus (40,3-43,4 dtk).
import {Easing} from 'remotion';
import {Penjelasan, r, type DataVideo} from '../kit';
import {PALET} from '../aset/PaperPalet';
import data from './beats.json';
import words from '../../public/v26/words.json';

export const V26_END = 52.2;
export const V26_FRAMES = Math.ceil(V26_END * 30);
export const PL = PALET.mint;

export const Banjir: React.FC<{t: number}> = ({t}) => {
  const a = r(t, 39.75, 39.95, Easing.out(Easing.cubic)) * (1 - r(t, 40.05, 40.55));
  if (a <= 0) return null;
  return <div style={{position: 'absolute', inset: 0, background: PL.accent, opacity: 0.55 * a}} />;
};
/** panel 2D di bawah kartu judul dan di atas subtitle: jalur air kran putar (berbelok) vs kran bola (lurus) */
export const PanelJalur: React.FC<{t: number}> = ({t}) => {
  const p = r(t, 40.2, 40.7) * (1 - r(t, 43.1, 43.45));
  if (p <= 0) return null;
  const d1 = r(t, 40.5, 41.9), d2 = r(t, 41.6, 42.6);
  const dash = (L: number, k: number) => ({strokeDasharray: L, strokeDashoffset: L * (1 - k)});
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 780, height: 470, borderRadius: 32, background: 'rgba(250,249,246,0.96)', border: '6px solid #1c1c1e', opacity: p, transform: `translateY(${(1 - p) * 20}px)`, fontFamily: 'Inter', color: '#1c1c1e'}}>
      <div style={{position: 'absolute', left: 36, top: 28, fontSize: 40, fontWeight: 800, color: PL.accent}}>KRAN PUTAR · berbelok 2×</div>
      <svg width={960} height={170} style={{position: 'absolute', left: 0, top: 80}} viewBox="0 0 960 170">
        <polyline points="60,130 360,130 360,40 800,40" fill="none" stroke={PL.accent} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" {...dash(1000, d1)} />
        <circle cx={360} cy={130} r={13} fill="#1c1c1e" opacity={d1 > 0.35 ? 1 : 0} /><circle cx={360} cy={40} r={13} fill="#1c1c1e" opacity={d1 > 0.6 ? 1 : 0} />
      </svg>
      <div style={{position: 'absolute', left: 36, top: 270, fontSize: 40, fontWeight: 800, color: PL.good}}>KRAN TUAS (BOLA) · lurus</div>
      <svg width={960} height={170} style={{position: 'absolute', left: 0, top: 310}} viewBox="0 0 960 170">
        <polyline points="60,85 880,85" fill="none" stroke={PL.good} strokeWidth={14} strokeLinecap="round" {...dash(820, d2)} />
      </svg>
    </div>
  );
};
export const Video26: React.FC = () => <Penjelasan data={data as unknown as DataVideo} words={(words as {words: {word: string; start: number; end: number}[]}).words} ekstra={[Banjir, PanelJalur]} />;
