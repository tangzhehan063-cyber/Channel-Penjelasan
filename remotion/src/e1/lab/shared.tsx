// LAB: bahan bersama eksperimen (foto sebagai pita, penampang editorial 2D). Eksperimen saja.
import {Img, staticFile} from 'remotion';
export const K = 1080 / 1024, TOP = 480; // foto lebar 1080 => tinggi 607,5; tepi atas di y=480; garis tanah (455 px) jatuh di y~960
export const GY = TOP + 455 * K, FX = 300 * K, FY = TOP + 440 * K; // titik fokus: kaki dinding rumah
export const SRC = staticFile('e1-02/rumah-ditinggikan.jpg');
export const Pita: React.FC<{s?: number; ox?: number; oy?: number; tx?: number; filter?: string; children?: React.ReactNode; bawah?: string}> = ({s = 1, ox = FX, oy = FY, tx = 0, filter, children, bawah = '#14161a'}) => (
  <div style={{position: 'absolute', inset: 0, transformOrigin: `${ox}px ${oy}px`, transform: `translateX(${tx}px) scale(${s})`}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: TOP + 2, background: 'linear-gradient(180deg,#9fb4cf 0%,#bfcfe6 100%)'}} />
    <div style={{position: 'absolute', left: 0, top: TOP + 600, width: 1080, height: 1500, background: bawah}} />
    <Img src={SRC} width={1080} height={608} style={{position: 'absolute', left: 0, top: TOP, filter}} />
    {children}
  </div>
);
export const Grain: React.FC<{f: number; o?: number}> = ({f, o = 0.16}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'overlay', opacity: o, pointerEvents: 'none'}}>
    <filter id={`g${f % 7}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 7} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width={1080} height={1920} filter={`url(#g${f % 7})`} />
  </svg>
);
/** Penampang editorial 2D: latar gelap, strata sebagai garis tipis, satu garis cahaya hangat di garis tanah, lempung mengerut sesuai c (0..1). */
export const SekEditorial: React.FC<{c?: number; f?: number; terang?: number}> = ({c = 0, f = 0, terang = 1}) => {
  const gy = 960, yBawah = 1780, hLem = 330 * (1 - 0.38 * c), sink = 330 * 0.38 * c * 0.8;
  const yl1 = gy + 90, yl2 = yl1 + hLem, yl3 = yl2 + 150;
  return (<div style={{position: 'absolute', inset: 0, background: '#12151b'}}>
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <linearGradient id="cahaya" x1="0" x2="1"><stop offset="0" stopColor="#ef6a4c" stopOpacity="0" /><stop offset="0.5" stopColor="#ffb089" stopOpacity="1" /><stop offset="1" stopColor="#ef6a4c" stopOpacity="0" /></linearGradient>
        <radialGradient id="kolam" cx="0.5" cy="0" r="0.8"><stop offset="0" stopColor="#ff9a6a" stopOpacity="0.28" /><stop offset="1" stopColor="#ff9a6a" stopOpacity="0" /></radialGradient>
        <filter id="kabur"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <rect x="0" y={gy} width="1080" height="520" fill="url(#kolam)" opacity={terang} />
      {/* rumah sebagai siluet di atas garis (ikut turun) */}
      <g transform={`translate(0 ${sink})`}>
        <path d={`M 170 ${gy - 60} L 170 ${gy - 330} L 330 ${gy - 330} L 540 ${gy - 520} L 750 ${gy - 330} L 910 ${gy - 330} L 910 ${gy - 60} Z`} fill="#0a0c10" stroke="#2a2f3a" strokeWidth="3" />
        <rect x="150" y={gy - 60} width="780" height="60" fill="#0a0c10" stroke="#2a2f3a" strokeWidth="3" />
      </g>
      {/* strata */}
      {[[gy, '#3a342c'], [yl1, '#2b3238'], [yl2, '#4a4030'], [yl3, '#25282e']].map(([y, col], i) => <line key={i} x1="40" x2="1040" y1={y as number} y2={y as number} stroke={col as string} strokeWidth="3" />)}
      <rect x="0" y={yl1} width="1080" height={hLem} fill="#1a2128" opacity="0.9" />
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M 60 ${yl1 + 20 + i * (hLem / 7)} Q 300 ${yl1 + 8 + i * (hLem / 7)} 540 ${yl1 + 20 + i * (hLem / 7)} T 1020 ${yl1 + 20 + i * (hLem / 7)}`} stroke="#3c4a55" strokeWidth="2" fill="none" />)}
      {/* garis cahaya = garis tanah awal */}
      <rect x="0" y={gy - 3} width="1080" height="6" fill="url(#cahaya)" filter="url(#kabur)" opacity={terang} />
      <rect x="40" y={gy - 1.5} width="1000" height="3" fill="url(#cahaya)" opacity={terang} />
    </svg>
    <div style={{position: 'absolute', left: 50, top: yl1 + hLem / 2 - 20, fontFamily: 'Inter', fontWeight: 600, fontSize: 34, color: '#8fa0ae', letterSpacing: 4}}>LEMPUNG LUNAK</div>
    <div style={{position: 'absolute', left: 50, top: gy + 14, fontFamily: 'Inter', fontWeight: 600, fontSize: 28, color: '#d98a66', letterSpacing: 4, opacity: c > 0.5 ? 1 : 0}}>POSISI AWAL</div>
    <Grain f={f} o={0.18} />
  </div>);
};
