// Demo bahasa gerak (hook video #5) meniru ritme referensi 05: judul-objek → objek abu naik jadi koral → daftar fokus → whip pan → daftar kedua.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {Paper, Env} from '../pengetahuan/Scene';
import {Grain, C} from './Aset';
import {ObjectWord, KineticWords, FocusList, Squiggle, whip, rise} from './Gerak';

const grey = new THREE.Color('#8f8f92'), coral = new THREE.Color(C.coral), wetC = new THREE.Color('#c4473a');

const Wall: React.FC<{tint: number; water: number}> = ({tint, water}) => {
  const rows = 9, cols = 4, bw = 0.62, bh = 0.26, g = 0.035;
  return <group>{Array.from({length: rows * cols}, (_, k) => {
    const r = Math.floor(k / cols), c = k % cols, off = r % 2 ? bw / 2 : 0, y = r * (bh + g) - 1.15;
    const wet = y < -1.15 + water * 1.3, col = grey.clone().lerp(wet ? wetC : coral, tint);
    return <mesh key={k} position={[c * (bw + g) - 1.1 + off, y, 0]}><boxGeometry args={[bw, bh, 0.34]} />
      <meshPhysicalMaterial color={col} roughness={wet ? 0.18 : 0.42} clearcoat={0.7} clearcoatRoughness={0.2} /></mesh>;
  })}</group>;
};

const Lights: React.FC = () => <><Env intensity={0} /><ambientLight intensity={0.35} /><directionalLight position={[3, 4, 5]} intensity={2.2} /><directionalLight position={[-4, -1, 2]} intensity={0.6} color="#ffe2da" /></>;

const Brick: React.FC = () => {
  const f = useCurrentFrame();
  return <ThreeCanvas width={230} height={210} camera={{position: [0, 0, 3.2], fov: 30}} gl={{alpha: true, antialias: true}}>
    <Lights /><mesh rotation={[0.35, 0.6 + f * 0.03, 0.1]}><boxGeometry args={[1.0, 0.45, 0.5]} /><meshPhysicalMaterial color="#8f8f92" roughness={0.5} clearcoat={0.5} /></mesh>
  </ThreeCanvas>;
};

export const GerakDemo: React.FC = () => {
  const f = useCurrentFrame();
  const cam = whip(f, [[58, 120, 1500, 0.5], [84, 260, 230, 0.58], [104, 300, 200, 0.68], [168, 300, 200, 0.68], [184, -330, -430, 0.7], [246, -330, -430, 0.7], [262, -1300, -430, 0.7]]);
  const tint = rise(f, 64, 20), heroOn = f >= 56 ? 1 : 0;
  return (
    <AbsoluteFill>
      <Paper t={f / 30} />
      {/* Babak 1: judul dengan bata menggantikan huruf O */}
      <Squiggle x={-30} y={240} start={8} rot={-8} out={60} />
      <Squiggle x={930} y={1330} start={12} rot={10} out={60} />
      <ObjectWord word="tembok" slot={4} start={0} top={560} small="kenapa" out={60}><Brick /></ObjectWord>
      <KineticWords words={['rumahmu', 'tiap', 'hari', 'minum', 'air?']} start={22} gap={6} top={800} left={150} out={60} />
      {/* Babak 2: objek utama naik dari bawah, abu → koral, lalu kamera mendekat */}
      <AbsoluteFill style={{opacity: heroOn, transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`, filter: `blur(${cam.blur}px)`}}>
        <ThreeCanvas width={1080} height={1920} camera={{position: [0, 0, 6.4], fov: 30}} gl={{alpha: true, antialias: true}}>
          <Lights />
          <group rotation={[0.08, 0.55 + interpolate(f, [56, 90], [1.2, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) + f * 0.0015, 0]} scale={0.9}><Wall tint={tint} water={interpolate(f, [190, 240], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} /></group>
        </ThreeCanvas>
      </AbsoluteFill>
      {/* Babak 3: gejala yang kelihatan */}
      <FocusList items={['Cat ngelupas', 'Noda lembap', 'Bubuk putih']} start={108} x={60} y={260} size={84} out={166} />
      {/* Babak 4: setelah whip pan, penyebabnya */}
      <FocusList items={['Naik dari tanah', 'Lewat pori bata', '± 1 meter']} start={190} x={380} y={1120} size={84} out={244} />
      <Grain o={0.05} id="gg" />
    </AbsoluteFill>
  );
};
