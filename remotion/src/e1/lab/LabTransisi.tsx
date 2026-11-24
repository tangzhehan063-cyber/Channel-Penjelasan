// LAB transisi foto -> penampang: iris | crosszoom | pushcut (library, bisa berbasis shader) | peel (bermotif: garis tanah) | push (masuk ke dinding dasar).
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {iris} from '@remotion/transitions/iris';
import {crossZoom} from '@remotion/transitions/cross-zoom';
import {pushCut} from '@remotion/transitions/push-cut';
import {FX, FY, GY, Pita, SekEditorial} from './shared';

const A = () => <AbsoluteFill style={{background: '#14161a'}}><Pita s={1.25} filter="contrast(1.1) saturate(0.85)" /></AbsoluteFill>;
const B = () => <SekEditorial c={0} f={2} />;
const lib = (p: unknown) => (<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={45}><A /></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={p as never} timing={linearTiming({durationInFrames: 30})} />
  <TransitionSeries.Sequence durationInFrames={45}><B /></TransitionSeries.Sequence>
</TransitionSeries>);

export const LabTransisi: React.FC<{v?: string}> = ({v = 'peel'}) => {
  const f = useCurrentFrame(), u = Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, (f - 15) / 30)));
  if (v === 'iris') return lib(iris({width: 1080, height: 1920}));
  if (v === 'crosszoom') return lib(crossZoom({} as never));
  if (v === 'pushcut') return lib(pushCut());
  if (v === 'peel') { // strip jalan di bawah garis tanah jatuh; penampang di bawahnya menyala; garis cahaya menggambar di garis tanah
    const j = Easing.in(Easing.cubic)(Math.min(1, Math.max(0, (f - 24) / 20))), g = Math.min(1, Math.max(0, (f - 12) / 14));
    return (<AbsoluteFill style={{background: '#12151b'}}>
      <div style={{position: 'absolute', inset: 0, opacity: Math.min(1, Math.max(0, (f - 24) / 14))}}><SekEditorial c={0} f={2} terang={g} /></div>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: GY, overflow: 'hidden', transform: `translateY(${-u * 0}px)`}}><div style={{position: 'absolute', inset: 0}}><Pita s={1.25} filter="contrast(1.1) saturate(0.85)" oy={GY} /></div></div>
      <div style={{position: 'absolute', left: 0, top: GY, width: 1080, height: 1920 - GY, overflow: 'hidden', transform: `translateY(${j * 900}px)`}}><div style={{position: 'absolute', left: 0, top: -GY, width: 1080, height: 1920}}><Pita s={1.25} filter="contrast(1.1) saturate(0.85)" oy={GY} /></div></div>
      <div style={{position: 'absolute', left: 0, top: GY - 2, width: 1080 * g, height: 5, background: 'linear-gradient(90deg,#ef6a4c,#ffb089)', boxShadow: '0 0 18px 4px rgba(255,150,100,0.7)'}} />
    </AbsoluteFill>);
  }
  // push: dorong ke kaki dinding, foto membesar dan memudar, penampang naik dari skala kecil
  return (<AbsoluteFill style={{background: '#12151b'}}>
    <div style={{position: 'absolute', inset: 0, opacity: u, transform: `scale(${0.7 + 0.3 * u})`, transformOrigin: '50% 50%'}}><SekEditorial c={0} f={2} /></div>
    <div style={{position: 'absolute', inset: 0, opacity: 1 - u, transformOrigin: `${FX}px ${FY}px`, transform: `scale(${1 + 2.6 * u})`}}><Pita s={1.25} filter="contrast(1.1) saturate(0.85)" /></div>
  </AbsoluteFill>);
};
