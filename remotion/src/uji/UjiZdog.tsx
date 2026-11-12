// Uji kecepatan: 3D ringan Zdog (kanvas 2D, tanpa WebGL) vs three.js swangle.
import React, {useEffect, useRef} from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';
import Zdog from 'zdog';

const KORAL = '#f27a63', KORAL_G = '#d9604b', KREM = '#f4ede1', TINTA = '#2b2b2b', ATAP = '#3d4a5c', ATAP_G = '#2c3644', KACA = '#bfe0ea';

export const UjiZdog: React.FC = () => {
  const f = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ill = new Zdog.Illustration({element: c, resize: false, zoom: 4.2});
    const putar = interpolate(f, [0, 150], [-0.9, 0.9], {easing: Easing.inOut(Easing.cubic)});
    ill.rotate.y = putar; ill.rotate.x = -0.38;
    const rumah = new Zdog.Anchor({addTo: ill, translate: {y: 10}});
    // bayangan lembut
    new Zdog.Ellipse({addTo: rumah, diameter: 150, quarters: 4, rotate: {x: Zdog.TAU / 4}, translate: {y: 46}, color: 'rgba(60,40,20,0.10)', fill: true, stroke: 0});
    // badan rumah
    new Zdog.Box({addTo: rumah, width: 90, height: 70, depth: 70, stroke: 6, color: KORAL, leftFace: KORAL_G, rightFace: KORAL_G, topFace: false, bottomFace: false, translate: {y: 8}});
    // atap pelana
    const naik = interpolate(f, [0, 40], [-60, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.6))});
    const atap = new Zdog.Anchor({addTo: rumah, translate: {y: -27 + naik}});
    [-1, 1].forEach((s) => new Zdog.Shape({addTo: atap, path: [{x: -54, y: -42, z: 0}, {x: 54, y: -42, z: 0}, {x: 54, y: 4, z: s * 46}, {x: -54, y: 4, z: s * 46}], closed: true, fill: true, stroke: 5, color: s < 0 ? ATAP_G : ATAP}));
    [-1, 1].forEach((s) => new Zdog.Shape({addTo: atap, path: [{z: -35}, {z: 35}, {y: -38, z: 0}], closed: true, fill: true, stroke: 6, color: KORAL, translate: {x: s * 45}}));
    // pintu & jendela
    new Zdog.RoundedRect({addTo: rumah, width: 22, height: 38, cornerRadius: 8, fill: true, stroke: 3, color: TINTA, translate: {z: 36, y: 25, x: -18}});
    new Zdog.RoundedRect({addTo: rumah, width: 24, height: 20, cornerRadius: 5, fill: true, stroke: 4, color: KACA, translate: {z: 36, y: 0, x: 22}});
    // pohon bulat
    const pohon = new Zdog.Anchor({addTo: ill, translate: {x: 78, y: 30, z: -20}});
    new Zdog.Shape({addTo: pohon, path: [{y: 0}, {y: 26}], stroke: 6, color: '#7a5a3a'});
    new Zdog.Shape({addTo: pohon, stroke: 42, color: '#6fae7a', translate: {y: -6}});
    ill.updateRenderGraph();
  }, [f]);
  return (
    <AbsoluteFill style={{background: KREM}}>
      <canvas ref={ref} width={1080} height={1920} style={{width: 1080, height: 1920}} />
      <div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center', font: '800 72px Inter', color: TINTA}}>Uji Zdog</div>
    </AbsoluteFill>
  );
};
