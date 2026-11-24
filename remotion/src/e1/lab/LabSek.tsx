// LAB penampang: diagram (pita datar) | editorial (SVG gelap, satu garis cahaya) | pbr3d (three, cahaya depan) | noir3d (three, low-key + lampu hangat + kabut + rim).
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing} from 'remotion';
import {Env} from '../../pengetahuan/Scene';
import {Rig} from '../../kit/stage';
import {usePenampang} from '../Pilot02';
import {Grain, SekEditorial} from './shared';

const Diagram: React.FC<{c: number}> = ({c}) => {
  const hL = 330 * (1 - 0.38 * c), y0 = 960;
  return (<AbsoluteFill style={{background: '#eef1f4'}}>
    {[['#cdb892', 90, 'Urugan'], ['#8aa0ad', hL, 'Lempung lunak'], ['#e6cf8a', 150, 'Pasir berair'], ['#7c818a', 600, 'Batuan keras']].reduce<{y: number; els: React.ReactNode[]}>((a, [col, h, nm], i) => {
      a.els.push(<div key={i} style={{position: 'absolute', left: 0, right: 0, top: a.y, height: h as number, background: col as string, borderTop: '4px solid #555', fontFamily: 'Inter', fontWeight: 700, fontSize: 40, color: '#222', padding: 20}}>{nm}</div>); a.y += h as number; return a;
    }, {y: y0, els: []}).els}
    <div style={{position: 'absolute', left: 170, top: y0 - 330 + 330 * 0.38 * c * 0.8, width: 740, height: 330, background: '#ddd', border: '4px solid #555', fontFamily: 'Inter', fontWeight: 700, fontSize: 44, color: '#333', padding: 20}}>Rumah</div>
  </AbsoluteFill>);
};

const Sek3D: React.FC<{c: number; noir: boolean}> = ({c, noir}) => {
  const m = usePenampang(); const hL = 1.5 - 0.57 * c, cam = {t: 0, pos: [0.3, -0.9, 10.5] as [number, number, number], look: [0.3, -0.9, 0] as [number, number, number]};
  return (<ThreeCanvas width={1080} height={1920} camera={{position: cam.pos, fov: 34, near: 0.5, far: 80}} gl={{alpha: true, antialias: true}} shadows>
    <Env intensity={noir ? 0.12 : 0.6} /><Rig k={cam} />
    {noir ? <>
      <hemisphereLight args={['#1b2433', '#0b0a09', 0.35]} />
      <pointLight position={[-1.6, 0.4, 3.2]} intensity={46} distance={9} color="#ffb27a" decay={1.6} castShadow />
      <directionalLight position={[5, 3, 2]} intensity={0.9} color="#6f8fbf" />
      <fog attach="fog" args={['#0b0d12', 8, 22]} />
    </> : <>
      <hemisphereLight args={['#fff', '#cdbb9b', 1.1]} />
      <directionalLight position={[2, 6, 9]} intensity={2.4} color="#fff" />
    </>}
    {[[-0.7, 8, 0.55, m.urugan, 0.5, 0.9], [-2.05 + hL / 2, 8, hL, m.lempung, 1.2, 0.6], [-2.45, 8, 0.8, m.pasir, 0.8, 0.7], [-5.2, 8, 5.0, m.batuan, 3, 1.0]].map(([y, w, h, map, ry, bump], i) => {
      const yy = i === 0 ? -0.275 - 0.57 * c : (y as number); return <mesh key={i} position={[0, yy, i * 0.004]} receiveShadow><boxGeometry args={[w as number, h as number, 3]} /><meshStandardMaterial map={map as never} bumpMap={map as never} bumpScale={bump as number} roughness={i === 1 ? 0.38 : 0.9} color={noir ? '#b9b2a8' : '#ffffff'} /></mesh>; })}
    <mesh position={[-1.6, 0.35 - 0.57 * c, 1.0]} castShadow><boxGeometry args={[3.0, 0.5, 1.6]} /><meshStandardMaterial map={m.pondasi} bumpMap={m.pondasi} bumpScale={0.8} roughness={0.9} /></mesh>
    <mesh position={[-1.6, 1.6 - 0.57 * c, 0.7]} castShadow><boxGeometry args={[2.4, 2.0, 1.0]} /><meshStandardMaterial color={noir ? '#2b2f36' : '#e4dcc8'} roughness={0.95} /></mesh>
  </ThreeCanvas>);
};

export const LabSek: React.FC<{v?: string; u?: number}> = ({v = 'diagram', u = 0}) => {
  const c = Easing.inOut(Easing.cubic)(u);
  if (v === 'diagram') return <Diagram c={c} />;
  if (v === 'editorial') return <SekEditorial c={c} f={3} />;
  const noir = v === 'noir3d';
  return (<AbsoluteFill style={{background: noir ? '#0b0d12' : '#e9edf0'}}><Sek3D c={c} noir={noir} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 40% 45%, rgba(0,0,0,0) 40%, rgba(5,6,10,${noir ? 0.7 : 0.25}) 100%)`}} /><Grain f={5} o={noir ? 0.2 : 0.1} /></AbsoluteFill>);
};
