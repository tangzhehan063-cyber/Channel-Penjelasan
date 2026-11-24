// LAB perlakuan foto: raw | grade | layers (2.5D CSS) | persp (2.5D three.js). Parameter u 0..1 = kemajuan gerak kamera. Eksperimen saja.
import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import * as THREE from 'three';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {Rig} from '../../kit/stage';
import {useFoto} from '../lib/footage';
import {FX, FY, GY, Grain, K, Pita, TOP} from './shared';

const ez = (u: number) => Easing.inOut(Easing.cubic)(u);
const HOUSE = '120,330 150,200 330,70 610,100 680,200 690,300 580,340 560,360 440,455 130,430';
const FORE = '0,425 380,456 520,425 1024,385 1024,576 0,576';
const poly = (pts: string, k: number, dx = 0, dy = 0) => `polygon(${pts.split(' ').map((p) => { const [x, y] = p.split(',').map(Number); return `${x * k + dx}px ${y * k + dy}px`; }).join(',')})`;

const Spot: React.FC<{u: number}> = ({u}) => (<>
  <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse 380px 300px at ${FX}px ${FY}px, rgba(0,0,0,0) 0%, rgba(8,10,16,${0.35 + 0.35 * u}) 100%)`}} />
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(255,190,130,0.22) 0%, rgba(255,190,130,0) 55%)', mixBlendMode: 'soft-light'}} />
</>);

const Persp: React.FC<{u: number}> = ({u}) => {
  const tx = useFoto('e1-02/rumah-ditinggikan.jpg'); const k = ez(u);
  const mask = (pts: string, inv = false) => useMemo(() => { const c = document.createElement('canvas'); c.width = 1024; c.height = 576; const g = c.getContext('2d')!; g.fillStyle = inv ? '#fff' : '#000'; g.fillRect(0, 0, 1024, 576); g.fillStyle = inv ? '#000' : '#fff'; g.beginPath(); pts.split(' ').forEach((p, i) => { const [x, y] = p.split(',').map(Number); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); g.fill(); g.filter = 'blur(3px)'; return new THREE.CanvasTexture(c); }, [pts, inv]);
  const mh = mask(HOUSE), mf = mask(FORE);
  const D = 22, cam = {t: 0, pos: [-1.5 + 3.0 * k, 1.6, D - 3 * k] as [number, number, number], look: [0.3, 1.3, 0] as [number, number, number]};
  const W = 9, H = W * 576 / 1024, planes = [{z: -4, m: undefined as THREE.Texture | undefined, z0: 1}, {z: 0, m: mh}, {z: 2.2, m: mf}];
  return (<ThreeCanvas width={1080} height={1920} camera={{position: cam.pos, fov: 34, near: 1, far: 100}} gl={{alpha: true}}>
    <Rig k={cam} />
    {planes.map((p, i) => { const sc = (D - p.z) / D; return tx && <mesh key={i} position={[0, 1.3 * sc, p.z]} renderOrder={i}>
      <planeGeometry args={[W * sc, H * sc]} />
      <meshBasicMaterial map={tx} alphaMap={p.m} transparent={!!p.m} toneMapped={false} depthWrite={false} />
    </mesh>; })}
  </ThreeCanvas>);
};

export const LabFoto: React.FC<{v?: string; u?: number}> = ({v = 'raw', u = 0}) => {
  const k = ez(u);
  if (v === 'raw') return <AbsoluteFill style={{background: '#14161a'}}><Pita s={1 + 0.3 * k} /></AbsoluteFill>;
  if (v === 'grade') return (<AbsoluteFill style={{background: '#14161a'}}>
    <Pita s={1 + 0.3 * k} filter="contrast(1.14) saturate(0.78) brightness(0.92) sepia(0.14)"><Spot u={k} /></Pita>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(8,10,16,0.55) 100%)'}} /><Grain f={7} />
  </AbsoluteFill>);
  if (v === 'layers') {
    const sc = [1 + 0.04 * k, 1 + 0.14 * k, 1 + 0.34 * k], t = [-6 * k, -26 * k, -70 * k];
    return (<AbsoluteFill style={{background: '#14161a'}}>
      <Pita s={sc[0]} tx={t[0]} filter="saturate(0.85) brightness(0.95)" />
      <div style={{position: 'absolute', inset: 0, clipPath: poly(HOUSE, K, 0, TOP)}}><Pita s={sc[1]} tx={t[1]} filter="contrast(1.08)" /></div>
      <div style={{position: 'absolute', inset: 0, clipPath: poly(FORE, K, 0, TOP)}}><Pita s={sc[2]} tx={t[2]} filter="brightness(0.9) contrast(1.1)" /></div>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(8,10,16,0.5) 100%)'}} />
    </AbsoluteFill>);
  }
  return (<AbsoluteFill style={{background: 'linear-gradient(180deg,#9fb4cf 0%,#bfcfe6 55%,#14161a 100%)'}}><Persp u={u} /><AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(8,10,16,0.5) 100%)'}} /></AbsoluteFill>);
};
void GY; void interpolate;
