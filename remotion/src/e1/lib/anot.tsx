// Anotasi: label kecil + garis penunjuk, tempel ke titik dunia. Tipis, di bawah subjek dalam hierarki; muncul saat kamera sampai ke bagiannya.
import {Easing} from 'remotion';
import {proj, r, type Key, type V3} from '../../kit/waktu';

export type Anotasi = {a: number; b: number; teks: string; di: V3; sisi: 'L' | 'R'; dy?: number; warna?: string};
export const Anot: React.FC<{an: Anotasi; t: number; cam: Key}> = ({an, t, cam}) => {
  const i = r(t, an.a, an.a + 0.4, Easing.out(Easing.cubic)), o = 1 - r(t, an.b - 0.3, an.b), p = i * o;
  if (p <= 0.01) return null;
  const [px, py0] = proj(cam, an.di); const py = Math.max(300, Math.min(1500, py0 + (an.dy ?? 0))); const L = an.sisi === 'L'; const x0 = L ? 54 : 1026; const w = Math.round(an.teks.length * 23 + 52);
  const wr = an.warna ?? '#ffffff';
  return (<>
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: p, pointerEvents: 'none'}}>
      <path d={`M ${L ? x0 + w : x0 - w} ${py} L ${px} ${py0}`} stroke={wr} strokeWidth={3} fill="none" strokeLinecap="round" strokeDasharray="1200" strokeDashoffset={1200 * (1 - i)} style={{filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'}} />
      <circle cx={px} cy={py0} r={7} fill={wr} stroke="rgba(0,0,0,0.35)" strokeWidth={2} />
    </svg>
    <div style={{position: 'absolute', top: py - 26, [L ? 'left' : 'right']: L ? x0 : 1080 - x0, width: w, boxSizing: 'border-box', padding: '8px 18px 10px', borderRadius: 14, background: 'rgba(16,18,24,0.62)', textAlign: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: 40, letterSpacing: -0.5, color: wr, opacity: p, whiteSpace: 'nowrap', transform: `translateX(${(L ? -1 : 1) * (1 - i) * 24}px)`}}>{an.teks}</div>
  </>);
};
