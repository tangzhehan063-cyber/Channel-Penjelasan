// Bahasa gerak dari referensi video (style/referensi-visual/05-gerak-*): ritme 0,4–0,6 dtk per kejadian.
import '@fontsource/inter/700.css'; import '@fontsource/inter/900.css';
import '@fontsource/playfair-display/400-italic.css'; import '@fontsource/playfair-display/700-italic.css';
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {C} from './Aset';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const rise = (f: number, start: number, dur = 12) => Easing.out(Easing.cubic)(interpolate(f, [start, start + dur], [0, 1], cl));
const mix = (a: string, b: string, t: number) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const A = h(a), B = h(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
};

/* Judul dengan objek menggantikan satu huruf, objek berdiri di atas tiang (seperti "br🧠ins"). */
export const ObjectWord: React.FC<{word: string; slot: number; start: number; size?: number; top?: number; small?: string; children: React.ReactNode; out?: number}> = ({word, slot, start, size = 210, top = 560, small, children, out = 1e9}) => {
  const f = useCurrentFrame(), a = rise(f, start, 18), o = 1 - rise(f, out, 10);
  const slotW = size * 0.78;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{position: 'relative', display: 'flex', alignItems: 'flex-end', fontFamily: 'Inter', fontWeight: 900, fontSize: size, letterSpacing: -size * 0.04, lineHeight: 1, color: mix('#e6e5e2', C.ink, a)}}>
        {small && <div style={{position: 'absolute', left: 6, top: -size * 0.12, fontSize: size * 0.13, fontWeight: 700, letterSpacing: 0, color: C.ink, opacity: a}}>{small}</div>}
        {word.split('').map((ch, i) => i === slot
          ? <div key={i} style={{position: 'relative', width: slotW, height: size * 0.78}}>
              <div style={{position: 'absolute', left: slotW / 2 - 5, top: size * 0.62, width: 10, height: 1920, background: 'linear-gradient(#9a9a9c,#b8b8ba)', opacity: a}} />
              <div style={{position: 'absolute', left: slotW / 2 - 26, top: size * 0.6, width: 0, height: 0, borderLeft: '26px solid transparent', borderRight: '26px solid transparent', borderTop: `30px solid #9a9a9c`, opacity: a}} />
              <div style={{position: 'absolute', left: -size * 0.15, top: -size * 0.2, width: slotW + size * 0.3, height: size}}>{children}</div>
            </div>
          : <span key={i}>{ch}</span>)}
      </div>
    </div>
  );
};

/* Kalimat muncul kata per kata: naik dari bawah, abu → tinta; kata terakhir koral & besar. */
export const KineticWords: React.FC<{words: string[]; start: number; gap?: number; top: number; left?: number; size?: number; out?: number}> = ({words, start, gap = 6, top, left = 150, size = 40, out = 1e9}) => {
  const f = useCurrentFrame(), o = 1 - rise(f, out, 10);
  return (
    <div style={{position: 'absolute', left, top, display: 'flex', alignItems: 'baseline', gap: 12, fontFamily: 'Inter', opacity: o}}>
      {words.map((w, i) => {
        const t = rise(f, start + i * gap, 10), last = i === words.length - 1;
        return <span key={i} style={{fontWeight: last ? 900 : 700, fontSize: last ? size * 1.9 : size, letterSpacing: last ? -2 : -0.5,
          color: last ? C.coral : mix('#a9a9ab', C.ink, t), opacity: t, transform: `translateY(${(1 - t) * 34}px)`, display: 'inline-block'}}>{w}</span>;
      })}
    </div>
  );
};

/* Daftar serif italic: tiap butir masuk dari blur + abu → tajam + hitam (efek fokus kamera). */
export const FocusList: React.FC<{items: string[]; start: number; gap?: number; x: number; y: number; size?: number; out?: number}> = ({items, start, gap = 18, x, y, size = 92, out = 1e9}) => {
  const f = useCurrentFrame(), ob = rise(f, out, 12);
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 400, fontSize: size, lineHeight: 1.12, letterSpacing: -1}}>
      {items.map((it, i) => {
        const t = rise(f, start + i * gap, 14);
        return <div key={i} style={{opacity: t * (1 - ob), filter: `blur(${(1 - t) * 14 + ob * 16}px)`, color: mix('#b0b0b2', C.ink, t),
          transform: `translateX(${(1 - t) * -20}px)`, textShadow: '0 6px 14px rgba(0,0,0,0.18)', whiteSpace: 'nowrap'}}>· {it}</div>;
      })}
    </div>
  );
};

/* Coretan zigzag yang tergambar (ornamen sudut). */
export const Squiggle: React.FC<{x: number; y: number; start: number; s?: number; rot?: number; out?: number}> = ({x, y, start, s = 1, rot = 0, out = 1e9}) => {
  const f = useCurrentFrame(), t = rise(f, start, 14), o = 1 - rise(f, out, 8), wob = Math.sin(f / 9) * 4;
  return (
    <svg width={160} height={80} style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot + wob}deg) scale(${s})`, opacity: o, overflow: 'visible'}}>
      <path d="M6 24 L36 58 L66 24 L96 58 L126 24" fill="none" stroke={C.ink} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={260} strokeDashoffset={260 * (1 - t)} />
    </svg>
  );
};

/* Gerak kamera "whip": posisi dengan easing kuat + motion blur sebanding kecepatan. */
export const whip = (f: number, keys: [number, number, number, number][]) => {
  // keys: [frame, x, y, scale]; kembalikan {x,y,s,blur}
  const fr = keys.map((k) => k[0]);
  const at = (ff: number) => {
    const opt = {...cl, easing: Easing.inOut(Easing.cubic)};
    return [1, 2, 3].map((j) => interpolate(ff, fr, keys.map((k) => k[j]), opt));
  };
  const [x, y, s] = at(f), [x2, y2] = at(f + 1);
  return {x, y, s, blur: Math.min(18, Math.hypot(x2 - x, y2 - y) * 0.35)};
};
