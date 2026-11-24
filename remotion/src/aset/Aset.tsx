// [LEGACY] Kit aset editorial gaya lama; opsional di E1. Katalog: arsip/style-lama/aset.md. Diterjemahkan dari referensi di style/referensi-visual/
// Semua komponen menerima `p` (progres 0..1) supaya mudah diikat ke timestamp suara.
import '@fontsource/inter/400.css'; import '@fontsource/inter/700.css'; import '@fontsource/inter/900.css';
import '@fontsource/playfair-display/400-italic.css';
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, Easing} from 'remotion';

export const C = {ink: '#1c1c1e', grey: '#4a4a4c', sub: '#8a8a8e', coral: '#f27a63', coralDeep: '#e2563f', paper: '#f3f2ef'};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = (p: number) => Easing.out(Easing.cubic)(Math.max(0, Math.min(1, p)));

/* ---------- 1. Grain: tekstur film halus di atas semua lapisan ---------- */
export const Grain: React.FC<{o?: number; id?: string}> = ({o = 0.08}) => {
  // Tile noise 512 px yang sudah dipanggang (public/aset/grain.png); posisinya diacak tiap 2 frame = grain hidup, tanpa filter SVG mahal.
  const f = useCurrentFrame(), seed = Math.floor(f / 2), ox = Math.floor(random(`gx${seed}`) * 512), oy = Math.floor(random(`gy${seed}`) * 512);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'multiply', opacity: o, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: -ox, top: -oy, width: 1536, display: 'flex', flexWrap: 'wrap'}}>
        {Array.from({length: 15}, (_, i) => <Img key={i} src={staticFile('aset/grain.png')} style={{width: 512, height: 512, display: 'block'}} />)}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 2. Bayangan jatuh di kertas (teralis jendela / daun) ---------- */
// Seolah ada jendela atau tanaman di antara lampu dan kertas. Bergeser pelan = cahaya matahari bergerak.
export const ShadowCast: React.FC<{kind?: 'teralis' | 'daun'; o?: number; x?: number; y?: number; s?: number; blur?: number}> = ({kind = 'teralis', o = 0.16, x = 420, y = -80, s = 1, blur = 9}) => {
  const f = useCurrentFrame(), drift = Math.sin(f / 90) * 14;
  return (
    <svg width="1080" height="1920" style={{position: 'absolute', pointerEvents: 'none'}}>
      <defs><filter id={`sb${kind}`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={blur} /></filter></defs>
      <g filter={`url(#sb${kind})`} opacity={o} transform={`translate(${x + drift} ${y}) scale(${s}) skewX(-14) rotate(6)`} fill={C.ink}>
        {kind === 'teralis' ? <Teralis /> : <Branch seed={3} />}
      </g>
    </svg>
  );
};

// Teralis jendela gaya rumah lama: bingkai, jeruji, lengkung kipas di atas.
const Teralis: React.FC = () => {
  const W = 620, H = 1100, bar = 16;
  return (
    <g>
      <path fillRule="evenodd" d={`M0 0 H${W} V${H} H0 Z M40 40 H${W - 40} V${H - 40} H40 Z`} />
      <rect x={W / 2 - 14} y={0} width={28} height={H} />
      <rect x={0} y={H * 0.36} width={W} height={26} />
      {[1, 2, 3, 5, 6, 7].map((i) => <rect key={i} x={(W / 8) * i - bar / 2} y={H * 0.36} width={bar} height={H * 0.64} />)}
      {[0, 1].map((k) => {
        const cx = k ? W * 0.75 : W * 0.25;
        return <g key={k}>{[0, 1, 2, 3, 4, 5, 6].map((i) => { const a = Math.PI + (Math.PI * i) / 6; return <line key={i} x1={cx} y1={H * 0.36} x2={cx + Math.cos(a) * 140} y2={H * 0.36 + Math.sin(a) * 140} stroke={C.ink} strokeWidth={12} />; })}
          <circle cx={cx} cy={H * 0.36} r={150} fill="none" stroke={C.ink} strokeWidth={14} /></g>;
      })}
    </g>
  );
};

// Ranting prosedural (dipakai untuk bayangan & siluet).
export const Branch: React.FC<{seed?: number; leaves?: number; len?: number}> = ({seed = 1, leaves = 22, len = 620}) => {
  const pts: React.ReactNode[] = [];
  const P = (t: number) => ({x: t * len, y: Math.sin(t * 2.4 + seed) * 60 - t * 90});
  for (let i = 0; i < leaves; i++) {
    const t = 0.08 + (i / leaves) * 0.9, {x, y} = P(t), side = i % 2 ? 1 : -1;
    const ang = side * (35 + random(`a${seed}${i}`) * 30) - 20, sz = 26 + random(`s${seed}${i}`) * 22 * (1 - t * 0.4);
    pts.push(<g key={i} transform={`translate(${x} ${y}) rotate(${ang})`}>
      <line x1={0} y1={0} x2={sz * 0.5} y2={0} stroke={C.ink} strokeWidth={3} />
      <path d={`M${sz * 0.4} 0 C ${sz * 0.8} ${-sz * 0.45}, ${sz * 1.7} ${-sz * 0.35}, ${sz * 2.1} 0 C ${sz * 1.7} ${sz * 0.35}, ${sz * 0.8} ${sz * 0.45}, ${sz * 0.4} 0 Z`} />
    </g>);
  }
  const stem = Array.from({length: 30}, (_, i) => P(i / 29)).map((q, i) => `${i ? 'L' : 'M'}${q.x} ${q.y}`).join(' ');
  return <g><path d={stem} fill="none" stroke={C.ink} strokeWidth={7} strokeLinecap="round" />{pts}</g>;
};

/* ---------- 3. Siluet potongan dengan bayangan (ornamen sudut) ---------- */
// kind: 'daun' (ranting), 'tegel' (motif ubin kunci), 'bunga' (kembang 5 kelopak). Muncul dari tepi, dipotong layar.
export const Cutout: React.FC<{kind: 'daun' | 'tegel' | 'bunga'; x: number; y: number; s?: number; rot?: number; p?: number; color?: string}> = ({kind, x, y, s = 1, rot = 0, p = 1, color = C.ink}) => {
  const e = ease(p), f = useCurrentFrame(), sway = kind === 'daun' ? Math.sin(f / 40) * 1.5 : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot + sway}deg) scale(${s * (0.85 + 0.15 * e)})`, transformOrigin: '0 0', opacity: e,
      filter: 'drop-shadow(14px 22px 16px rgba(0,0,0,0.28))'}}>
      <svg width="900" height="900" viewBox="-450 -450 900 900" overflow="visible">
        <g fill={color}>
          {kind === 'daun' && <g transform="translate(-300 0)"><Branch seed={7} /></g>}
          {kind === 'bunga' && <g>{[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={0} cy={-120} rx={95} ry={135} transform={`rotate(${i * 72})`} />)}<circle r={52} fill={C.paper} /></g>}
          {kind === 'tegel' && <Tegel />}
        </g>
      </svg>
    </div>
  );
};

// Motif tegel kunci (ubin kuno): bintang 4 kelopak + lingkaran + sudut.
export const Tegel: React.FC = () => (
  <g>
    <path fillRule="evenodd" d="M-300 -300 H300 V300 H-300 Z M-270 -270 H270 V270 H-270 Z" />
    {[0, 90, 180, 270].map((r) => <g key={r} transform={`rotate(${r})`}>
      <path d="M0 -40 C 60 -90, 70 -200, 0 -250 C -70 -200, -60 -90, 0 -40 Z" />
      <path d="M-270 -270 L-170 -270 C -170 -215, -215 -170, -270 -170 Z" />
      <circle cx={0} cy={-215} r={16} fill="#f3f2ef" />
    </g>)}
    <circle r={58} /><circle r={26} fill="#f3f2ef" />
  </g>
);

/* ---------- 4. Kotak teks hitam ala TikTok (untuk pertanyaan hook) ---------- */
export const TikTokBox: React.FC<{text: string; p: number; y?: number; size?: number}> = ({text, p, y = 300, size = 54}) => {
  const words = text.split(' '), n = Math.ceil(ease(p) * words.length);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: p > 0 ? 1 : 0}}>
      <div style={{maxWidth: 820, textAlign: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: size, lineHeight: 1.32, letterSpacing: -0.5}}>
        <span style={{background: C.ink, color: '#fff', padding: '6px 18px', borderRadius: 12, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>
          {words.map((w, i) => <span key={i} style={{opacity: i < n ? 1 : 0}}>{w} </span>)}
        </span>
      </div>
    </div>
  );
};

/* ---------- 5. Judul dua tingkat: kalimat kecil / KATA BESAR (abu gelap, kata kunci koral) ---------- */
export const TwoTier: React.FC<{small: string; big: string; p: number; x?: number; y?: number; accent?: boolean; size?: number; align?: 'left' | 'center'}> = ({small, big, p, x = 90, y = 1360, accent = false, size = 150, align = 'left'}) => {
  const a = ease(p), b = ease(p * 1.4 - 0.3);
  return (
    <div style={{position: 'absolute', left: x, right: align === 'center' ? x : undefined, top: y, fontFamily: 'Inter', textAlign: align}}>
      <div style={{fontSize: size * 0.32, fontWeight: 400, color: C.grey, opacity: a, transform: `translateY(${(1 - a) * 20}px)`}}>{small}</div>
      <div style={{fontSize: size, fontWeight: 900, letterSpacing: -size * 0.02, lineHeight: 0.95, color: accent ? C.coral : C.grey, opacity: b, transform: `translateY(${(1 - b) * 30}px)`}}>{big}</div>
    </div>
  );
};

/* ---------- 6. Sinar diagonal (balok cahaya abstrak) ---------- */
export const LightBeam: React.FC<{p: number; x?: number; y?: number; len?: number; rot?: number; o?: number}> = ({p, x = 140, y = 1400, len = 520, rot = 36, o = 0.22}) => (
  <div style={{position: 'absolute', left: x, top: y, width: len * ease(p), height: 64, background: C.ink, opacity: o, transform: `rotate(${rot}deg)`, transformOrigin: '0 50%', borderRadius: 2}} />
);

/* ---------- 7. Pemutus pola: layar koral penuh + grain + teks putih tebal ---------- */
export const PatternBreak: React.FC<{lines: string[]; p: number; sub?: string}> = ({lines, p, sub}) => {
  const a = ease(p);
  return (
    <AbsoluteFill style={{background: `radial-gradient(110% 80% at 50% 35%, ${C.coral} 0%, ${C.coralDeep} 100%)`, clipPath: `circle(${a * 150}% at 50% 50%)`}}>
      <div style={{position: 'absolute', left: 70, right: 70, top: 640, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, color: '#fff', fontSize: 132, lineHeight: 0.98, letterSpacing: -3,
        textShadow: '0 8px 0 rgba(0,0,0,0.18), 0 18px 30px rgba(0,0,0,0.18)'}}>
        {lines.map((l, i) => <div key={i} style={{opacity: ease(p * 2 - 0.4 - i * 0.2), transform: `translateY(${(1 - ease(p * 2 - 0.4 - i * 0.2)) * 40}px)`}}>{l}</div>)}
      </div>
      {sub && <div style={{position: 'absolute', left: 0, right: 0, top: 1060, textAlign: 'center', fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 52, color: 'rgba(255,255,255,0.85)', opacity: ease(p * 2 - 1)}}>{sub}</div>}
      <Grain o={0.12} id="gpb" />
    </AbsoluteFill>
  );
};

/* ---------- 8. Grid teka-teki: huruf tersembunyi atau ubin "cari yang retak" ---------- */
export const PuzzleGrid: React.FC<{mode: 'huruf' | 'ubin'; word?: string; row?: number; target?: [number, number]; p: number; reveal: number; bg?: 'paper' | 'coral'; y?: number}> = ({mode, word = 'TRASRAM', row = 5, target = [3, 6], p, reveal, bg = 'paper', y = 520}) => {
  const N = 9, size = 104, x0 = (1080 - N * size) / 2, letters = 'AEOUTRSMPLBKNDG';
  const onCoral = bg === 'coral', line = onCoral ? 'rgba(255,255,255,0.75)' : 'rgba(28,28,30,0.25)', ink = onCoral ? '#fff' : C.ink;
  const start = Math.floor((N - word.length) / 2), r = ease(reveal);
  return (
    <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0}}>
      {Array.from({length: N * N}, (_, k) => {
        const i = k % N, j = Math.floor(k / N), on = ease(p * 1.6 - (i + j) * 0.04);
        const x = x0 + i * size, yy = y + j * size;
        const isWord = mode === 'huruf' && j === row && i >= start && i < start + word.length;
        const isTarget = mode === 'ubin' && i === target[0] && j === target[1];
        return (
          <g key={k} opacity={on}>
            {mode === 'ubin'
              ? <rect x={x + 4} y={yy + 4} width={size - 8} height={size - 8} rx={4} fill={isTarget && r > 0 ? `rgba(242,122,99,${0.25 + 0.6 * r})` : onCoral ? 'rgba(255,255,255,0.12)' : '#fbfaf8'} stroke={line} strokeWidth={2} />
              : <rect x={x} y={yy} width={size} height={size} fill="none" stroke={line} strokeWidth={2} />}
            {mode === 'huruf' && <text x={x + size / 2} y={yy + size * 0.66} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={46}
              fill={isWord && r > 0 ? (onCoral ? C.ink : C.coral) : ink}>{isWord ? word[i - start] : letters[Math.floor(random(`l${k}`) * letters.length)]}</text>}
            {isTarget && <path d={`M${x + 20} ${yy + 30} L${x + 46} ${yy + 52} L${x + 40} ${yy + 70} L${x + 78} ${yy + 86}`} fill="none" stroke={C.ink} strokeWidth={2.5} opacity={0.55} />}
          </g>
        );
      })}
      {mode === 'huruf' && r > 0 && <rect x={x0 + start * size + 6} y={y + row * size + 10} width={(word.length * size - 12) * r} height={size - 20} rx={(size - 20) / 2} fill="none" stroke={onCoral ? C.ink : C.coral} strokeWidth={6} />}
      {mode === 'ubin' && r > 0 && <circle cx={x0 + target[0] * size + size / 2} cy={y + target[1] * size + size / 2} r={size * 0.75} fill="none" stroke={C.coral} strokeWidth={6} strokeDasharray={`${r * 360} 999`} />}
    </svg>
  );
};

export {clamp, ease, interpolate};
