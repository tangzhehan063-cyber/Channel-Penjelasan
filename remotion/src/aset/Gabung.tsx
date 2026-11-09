// Sistem gabungan referensi 05 (gerak editorial), 06 (cerita produk: jangkar pertanyaan, cincin fokus, deretan prop, tombol follow)
// dan 07 (kolase editorial: kicker mono, judul serif + italic koral, cakram warna, panel angka, gelembung komentar).
// Semantik warna: koral = masalah/sorotan · biru = air · hijau sage = solusi/benar. Tinta untuk teks & garis.
import '@fontsource/ibm-plex-mono/400.css'; import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/playfair-display/900.css'; import '@fontsource/playfair-display/900-italic.css';
import '@fontsource/inter/700.css'; import '@fontsource/inter/800-italic.css';
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C} from './Aset';
import {rise} from './Gerak';

export const K = {...C, blue: '#1f7fdc', sage: '#6fae6a', line: 'rgba(28,28,30,0.85)'};
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const pop = (f: number, s: number, d = 12) => Easing.out(Easing.back(1.8))(interpolate(f, [s, s + d], [0, 1], cl));
const fadeOut = (f: number, out?: number) => (out === undefined ? 1 : 1 - rise(f, out, 8));
const mix = (a: string, b: string, t: number) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const A = h(a), B = h(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
};

/* Kertas + tekstur kusut halus (ref 07). Tekstur sudah dipanggang ke public/aset/kertas.png (komposisi BakeAset). */
export const PaperPlus: React.FC = () => {
  // Latar + kertas kusut dipanggang jadi satu PNG; hanya bayangan lembut yang bergeser pelan (4 px/dtk).
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Img src={staticFile('aset/kertas-dasar.png')} style={{position: 'absolute', width: 1080, height: 1920}} />
      <Img src={staticFile('aset/kertas-bayang.png')} style={{position: 'absolute', width: 1080, height: 1920, transform: `translateX(${(f / 30) * 4}px)`}} />
    </AbsoluteFill>
  );
};

/* Kicker mono di atas: —— FAKTA RUMAH · #05 —— */
export const Kicker: React.FC<{text: string; y?: number; start?: number}> = ({text, y = 300, start = 0}) => {
  const f = useCurrentFrame(), t = rise(f, start, 14);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, fontFamily: 'IBM Plex Mono', fontWeight: 500, fontSize: 24, letterSpacing: 5, color: K.coral}}>
      <div style={{width: 60 * t, height: 2, background: K.coral}} /><span style={{opacity: t}}>{text}</span><div style={{width: 60 * t, height: 2, background: K.coral}} />
    </div>
  );
};

/* Subtitle mono di bawah (ref 07): teks VO, ganti per beat. */
export const MonoSub: React.FC<{lines: [number, string][]; y?: number}> = ({lines, y = 1440}) => {
  const f = useCurrentFrame();
  return <>{lines.map(([s, txt], i) => {
    const next = lines[i + 1]?.[0] ?? 1e9, o = rise(f, s, 8) * (1 - rise(f, next - 6, 6));
    return o > 0.01 && <div key={i} style={{position: 'absolute', left: 120, right: 120, top: y, textAlign: 'center', fontFamily: 'IBM Plex Mono', fontSize: 30, lineHeight: 1.45, color: K.ink, opacity: o}}>{txt}</div>;
  })}</>;
};

/* Judul serif tebal + baris kedua italic koral, kata per kata abu → tinta (ref 07). */
export const SerifHead: React.FC<{l1: string; l2: string; start: number; out?: number; top?: number; size?: number}> = ({l1, l2, start, out, top = 470, size = 118}) => {
  const f = useCurrentFrame(), o = fadeOut(f, out);
  const words = [...l1.split(' ').map((w) => ({w, it: false})), ...l2.split(' ').map((w) => ({w, it: true}))];
  const n1 = l1.split(' ').length;
  const Word = ({w, it, i}: {w: string; it: boolean; i: number}) => {
    const t = rise(f, start + i * 5, 10);
    return <span style={{display: 'inline-block', marginRight: size * 0.22, opacity: t, transform: `translateY(${(1 - t) * 26}px)`, fontStyle: it ? 'italic' : 'normal', color: it ? K.coral : mix('#c4c3c0', K.ink, t)}}>{w}</span>;
  };
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top, textAlign: 'center', fontFamily: 'Playfair Display', fontWeight: 900, fontSize: size, lineHeight: 0.98, letterSpacing: -size * 0.02, opacity: o}}>
      <div>{words.slice(0, n1).map((x, i) => <Word key={i} {...x} i={i} />)}</div>
      <div>{words.slice(n1).map((x, i) => <Word key={i} {...x} i={i + n1} />)}</div>
    </div>
  );
};

/* Cakram warna di belakang objek, mengambang pelan (ref 07). */
export const Disc: React.FC<{x: number; y: number; r: number; color: string; start: number; out?: number; o?: number}> = ({x, y, r, color, start, out, o = 1}) => {
  const f = useCurrentFrame(), s = pop(f, start, 16) * fadeOut(f, out), fy = Math.sin((f + x) / 35) * 8;
  return <div style={{position: 'absolute', left: x - r, top: y - r + fy, width: r * 2, height: r * 2, borderRadius: '50%', background: color, opacity: o, transform: `scale(${s})`}} />;
};

/* Cincin fokus putus-putus berputar; flood > 0 = cincin membesar jadi layar koral penuh (transisi ref 06). */
export const FocusRing: React.FC<{x: number; y: number; r: number; start: number; out?: number; flood?: number; floodOut?: number}> = ({x, y, r, start, out, flood = 0, floodOut = 0}) => {
  const f = useCurrentFrame(), t = rise(f, start, 14) * fadeOut(f, out);
  const fl = Easing.inOut(Easing.cubic)(flood), back = Easing.inOut(Easing.cubic)(floodOut);
  const R = r + fl * 2300 - back * (r + 2300);
  return (
    <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {fl > 0 && R > 0 && <circle cx={x} cy={y} r={R} fill={K.coral} />}
      {t > 0 && fl < 0.3 && <circle cx={x} cy={y} r={r * (0.85 + 0.15 * t)} fill="none" stroke={K.ink} strokeWidth={5} strokeDasharray="16 14" opacity={t * (1 - fl * 3)}
        transform={`rotate(${f * 0.8} ${x} ${y})`} />}
    </svg>
  );
};

/* Ikon prop sederhana bergaya potongan (bayangan jatuh). */
export const Icon: React.FC<{kind: 'tetes' | 'bata' | 'panah' | 'penggaris' | 'centang' | 'tanah' | 'baja' | 'kayu' | 'rayap'; s?: number}> = ({kind, s = 1}) => (
  <svg width={150 * s} height={150 * s} viewBox="-75 -75 150 150" style={{filter: 'drop-shadow(6px 10px 8px rgba(0,0,0,0.25))', overflow: 'visible'}}>
    {kind === 'tetes' && <path d="M0 -52 C 22 -20, 40 2, 40 22 A40 40 0 0 1 -40 22 C -40 2, -22 -20, 0 -52 Z" fill={K.blue} />}
    {kind === 'bata' && <g><rect x={-56} y={-30} width={112} height={60} rx={4} fill={K.coral} />{[-28, 0, 28].map((x) => <circle key={x} cx={x} cy={0} r={7} fill="#7e2a20" />)}</g>}
    {kind === 'panah' && <path d="M0 -56 L40 -10 H16 V54 H-16 V-10 H-40 Z" fill={K.ink} />}
    {kind === 'penggaris' && <g transform="rotate(-35)"><rect x={-70} y={-16} width={140} height={32} rx={3} fill="#e3b04b" />{Array.from({length: 9}, (_, i) => <rect key={i} x={-62 + i * 15} y={-16} width={3} height={i % 2 ? 9 : 15} fill={K.ink} />)}</g>}
    {kind === 'centang' && <g><circle r={50} fill={K.sage} /><path d="M-24 2 L-6 20 L26 -16" fill="none" stroke="#fff" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" /></g>}
    {kind === 'baja' && <path d="M30 -50 H-30 V50 H30 V34 H-12 V-34 H30 Z" fill="#c3c8ce" stroke={K.ink} strokeWidth={6} strokeLinejoin="round" />}
    {kind === 'kayu' && <g><rect x={-58} y={-34} width={116} height={68} rx={6} fill="#c98a4b" stroke={K.ink} strokeWidth={6} />{[-12, 10].map((y) => <path key={y} d={`M-44 ${y} Q 0 ${y - 10} 44 ${y}`} fill="none" stroke="#8a5528" strokeWidth={5} strokeLinecap="round" />)}</g>}
    {kind === 'rayap' && <g fill={K.coral} stroke={K.ink} strokeWidth={5}><ellipse cx={0} cy={22} rx={20} ry={30} /><circle cx={0} cy={-18} r={15} /><circle cx={0} cy={-42} r={14} /><path d="M-10 -52 L-26 -66 M10 -52 L26 -66 M-18 10 L-44 0 M18 10 L44 0 M-18 30 L-44 40 M18 30 L44 40" fill="none" strokeLinecap="round" /></g>}
    {kind === 'tanah' && <g><path d="M-62 10 Q -30 -14 0 6 T 62 0 V 40 H -62 Z" fill="#8b6a4f" />{[-36, -6, 26].map((x, i) => <circle key={i} cx={x} cy={24} r={5} fill={K.blue} />)}</g>}
  </svg>
);

/* Deretan prop: muncul bergiliran dengan cincin putus-putus + label italic tebal (ref 06). */
export const PropRow: React.FC<{items: {icon: Parameters<typeof Icon>[0]['kind']; label: string}[]; start: number; gap?: number; y: number; out?: number}> = ({items, start, gap = 9, y, out}) => {
  const f = useCurrentFrame(), o = fadeOut(f, out), w = 1080 / items.length;
  return <>{items.map((it, i) => {
    const t = pop(f, start + i * gap, 14), x = w * i + w / 2;
    return (
      <div key={i} style={{position: 'absolute', left: x - 130, top: y, width: 260, textAlign: 'center', opacity: o * Math.min(1, t * 1.5), transform: `scale(${0.6 + 0.4 * t})`}}>
        <div style={{position: 'relative', width: 220, height: 220, margin: '0 auto'}}>
          <svg width={220} height={220} style={{position: 'absolute', left: 0, top: 0}}><circle cx={110} cy={110} r={100} fill="none" stroke={K.ink} strokeWidth={4} strokeDasharray="12 11" transform={`rotate(${f * 0.9 + i * 30} 110 110)`} /></svg>
          <div style={{position: 'absolute', left: 35, top: 35}}><Icon kind={it.icon} /></div>
        </div>
        <div style={{fontFamily: 'Inter', fontWeight: 800, fontStyle: 'italic', fontSize: 40, color: K.ink, marginTop: 10, letterSpacing: -0.5}}>{it.label}</div>
      </div>
    );
  })}</>;
};

/* Panel angka bergaris (ref 07): ikon + angka serif menghitung + label mono. */
export const StatPanel: React.FC<{rows: {icon: Parameters<typeof Icon>[0]['kind']; to: number; dec?: number; pre?: string; suf: string; label: string; accent?: string}[]; start: number; y: number; gap?: number; out?: number}> = ({rows, start, y, gap = 16, out}) => {
  const f = useCurrentFrame(), o = fadeOut(f, out);
  return (
    <div style={{position: 'absolute', left: 110, right: 110, top: y, opacity: o}}>
      {rows.map((r, i) => {
        const s = start + i * gap, line = rise(f, s, 14), t = rise(f, s + 4, 14), cnt = interpolate(f, [s + 4, s + 24], [0, r.to], {...cl, easing: Easing.out(Easing.cubic)});
        return (
          <div key={i} style={{position: 'relative', height: 210}}>
            <div style={{position: 'absolute', left: 0, top: 0, height: 3, width: `${line * 100}%`, background: K.line}} />
            <div style={{position: 'absolute', left: -10, top: 30, opacity: t, transform: `scale(${0.7 + 0.3 * t})`}}><Icon kind={r.icon} s={0.95} /></div>
            <div style={{position: 'absolute', left: 190, top: 22, opacity: t}}>
              <div style={{fontFamily: 'Playfair Display', fontWeight: 900, fontSize: 112, lineHeight: 1, color: r.accent ?? K.ink, letterSpacing: -2}}>{r.pre ?? ''}{cnt.toFixed(r.dec ?? 0).replace('.', ',')}{r.suf}</div>
              <div style={{fontFamily: 'IBM Plex Mono', fontSize: 26, color: K.ink, marginTop: 10}}>{r.label}</div>
            </div>
          </div>
        );
      })}
      <div style={{height: 3, width: `${rise(f, start + rows.length * gap, 14) * 100}%`, background: K.line}} />
    </div>
  );
};

/* Gelembung komentar dengan kata yang diketik (CTA, ref 07). */
export const CommentBubble: React.FC<{word: string; start: number; y: number; out?: number}> = ({word, start, y, out}) => {
  const f = useCurrentFrame(), t = pop(f, start, 14) * fadeOut(f, out), n = Math.floor(interpolate(f, [start + 12, start + 12 + word.length * 3], [0, word.length], cl));
  const caret = Math.floor(f / 8) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: 170, top: y, width: 740, height: 230, transform: `scale(${t})`, transformOrigin: '20% 100%'}}>
      <svg width={760} height={290} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d="M14 14 H726 V214 H130 L70 270 L82 214 H14 Z" fill={K.ink} transform="translate(12 12)" />
        <path d="M14 14 H726 V214 H130 L70 270 L82 214 H14 Z" fill="#fbfaf8" stroke={K.ink} strokeWidth={6} strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', left: 14, width: 712, top: 52, textAlign: 'center', fontFamily: 'Playfair Display', fontWeight: 900, fontStyle: 'italic', fontSize: 104, color: K.coral, lineHeight: 1, letterSpacing: -2}}>
        {word.slice(0, n)}<span style={{color: K.ink, opacity: caret ? 1 : 0, fontStyle: 'normal', fontWeight: 400}}>|</span>
      </div>
    </div>
  );
};

/* Tombol Follow ditekan kursor → Following (ref 06). */
export const FollowButton: React.FC<{start: number; click: number; y: number}> = ({start, click, y}) => {
  const f = useCurrentFrame(), t = pop(f, start, 14), done = f >= click + 3;
  const press = f >= click && f < click + 6 ? 0.92 : 1;
  const cx = interpolate(f, [click - 22, click - 2], [900, 600], {...cl, easing: Easing.inOut(Easing.cubic)}), cy = interpolate(f, [click - 22, click - 2], [y + 260, y + 60], {...cl, easing: Easing.inOut(Easing.cubic)});
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', transform: `scale(${t * press})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '22px 54px', borderRadius: 60, fontFamily: 'Inter', fontWeight: 700, fontSize: 46,
          background: done ? 'transparent' : K.coral, color: done ? K.ink : '#fff', border: `4px solid ${done ? K.ink : K.coral}`, boxShadow: done ? 'none' : '0 14px 30px rgba(226,86,63,0.35)'}}>
          {done ? '✓ Following' : '+ Follow'}
        </div>
      </div>
      {f >= click - 22 && f < click + 25 && <svg width={60} height={70} style={{position: 'absolute', left: cx, top: cy, filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.3))'}}>
        <path d="M4 4 L4 52 L17 40 L27 62 L36 58 L26 37 L44 37 Z" fill="#fff" stroke={K.ink} strokeWidth={3} strokeLinejoin="round" /></svg>}
    </>
  );
};

/* Ornamen tegel berputar pelan di sudut; warnanya bisa berganti saat momen aksen (ref 06 bunga hitam → merah). */
export const Ornament: React.FC<{cx: number; cy: number; size?: number; start?: number; accent?: number}> = ({cx, cy, size = 420, start = 0, accent = 0}) => {
  // PNG panggang (BakeAset): tegel 840 px + bayangan di kanvas 960 px; warna tinta → koral lewat crossfade.
  const f = useCurrentFrame(), t = pop(f, start, 16), W = size * 960 / 840;
  const st: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: W, height: W};
  return (
    <div style={{position: 'absolute', left: cx - W / 2, top: cy - W / 2, width: W, height: W, transform: `rotate(${f * 0.35}deg) scale(${t})`}}>
      <Img src={staticFile('aset/tegel-ink.png')} style={{...st, opacity: 1 - accent}} />
      {accent > 0 && <Img src={staticFile('aset/tegel-coral.png')} style={{...st, opacity: accent}} />}
    </div>
  );
};
