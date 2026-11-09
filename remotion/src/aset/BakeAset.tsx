// Komposisi khusus untuk "memanggang" efek SVG mahal jadi PNG sekali jadi (lihat riset/2026-11-09-evaluasi-video-6.md).
// Hasil di public/aset/: kertas-dasar.png (latar + kertas kusut), kertas-bayang.png (bayangan lembut), grain.png (tile noise 512 px, bisa diulang), tegel-ink.png & tegel-coral.png (ornamen + bayangan).
// Jalankan: npx remotion still BakeAset public/aset/<file>.png --props='{"kind":"..."}' --image-format=png
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Tegel} from './Aset';
import {PALETTE} from '../pengetahuan/Scene';

export type BakeKind = 'kertas-dasar' | 'kertas-bayang' | 'grain' | 'tegel-ink' | 'tegel-coral';
export const BakeAset: React.FC<{kind: BakeKind}> = ({kind}) => {
  // kertas-dasar = Paper (tanpa bayangan gelap yang bergeser) + kertas kusut; kertas-bayang = bayangan gelap lembut (transparan) yang digeser pelan di PaperPlus
  if (kind === 'kertas-dasar') return (
    <AbsoluteFill style={{background: `radial-gradient(120% 80% at 70% 30%, #fbfaf8 0%, ${PALETTE.paper} 45%, ${PALETTE.paper2} 100%)`}}>
      <svg width="1080" height="1920" style={{position: 'absolute'}}>
        <defs>
          <pattern id="dots" width="44" height="44" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2.2" fill="#9a9a9e" /></pattern>
          <pattern id="lines" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M0 2 H44" stroke="#b5b5b8" strokeWidth="1" strokeDasharray="3 5" /></pattern>
          <linearGradient id="fade" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="1" /><stop offset="0.75" stopColor="#fff" stopOpacity="0.6" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
          <mask id="m"><rect x="0" y="0" width="720" height="1920" fill="url(#fade)" /></mask>
          <filter id="soft"><feGaussianBlur stdDeviation="10" /></filter>
        </defs>
        <path d="M 1200 -100 C 900 300, 1000 700, 1300 900" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="180" filter="url(#soft)" />
        <g mask="url(#m)" opacity="0.55"><rect x="0" y="300" width="720" height="1360" fill="url(#lines)" /><rect x="0" y="300" width="720" height="1360" fill="url(#dots)" /></g>
      </svg>
      <svg width="1080" height="1920" style={{position: 'absolute', mixBlendMode: 'multiply', opacity: 0.22}}>
        <filter id="crumple"><feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="4" seed="4" result="n" />
          <feDiffuseLighting in="n" lightingColor="#fff" surfaceScale="2.2"><feDistantLight azimuth="45" elevation="58" /></feDiffuseLighting></filter>
        <rect width="1080" height="1920" filter="url(#crumple)" />
      </svg>
    </AbsoluteFill>
  );
  if (kind === 'kertas-bayang') return (
    <svg width="1080" height="1920" style={{position: 'absolute'}}>
      <filter id="soft"><feGaussianBlur stdDeviation="10" /></filter>
      <path d="M -200 120 C 500 260, 820 760, 760 1260 S 980 1900, 1240 2100" fill="none" stroke="rgba(20,20,24,0.06)" strokeWidth="230" filter="url(#soft)" />
    </svg>
  );
  if (kind === 'grain') return (
    <svg width="512" height="512" style={{position: 'absolute'}}>
      <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="512" height="512" filter="url(#g)" />
    </svg>
  );
  // ornamen 840 px (dipakai sampai ukuran ±420 px tetap tajam), bayangan sama dengan versi lama: drop-shadow(12px 20px 14px rgba(0,0,0,.28)) pada ukuran 420
  const col = kind === 'tegel-coral' ? '#f27a63' : '#1c1c1e';
  return (
    <div style={{position: 'absolute', left: 60, top: 60, width: 840, height: 840, filter: 'drop-shadow(24px 40px 28px rgba(0,0,0,0.28))'}}>
      <svg width={840} height={840} viewBox="-320 -320 640 640"><g fill={col}><Tegel /></g></svg>
    </div>
  );
};
