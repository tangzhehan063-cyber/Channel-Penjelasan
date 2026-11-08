// Demo kit aset (4 adegan × 60 frame) memakai contoh video #5 "Tembokmu Minum Air".
// Render cek: npx remotion still AsetDemo out/aset-a.png --frame=55 (B=110, C=175, D=235)
import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Paper, Env, Ghost} from '../pengetahuan/Scene';
import {Grain, ShadowCast, Cutout, TikTokBox, TwoTier, LightBeam, PatternBreak, PuzzleGrid, C, clamp} from './Aset';

// Tembok bata 3D sederhana (koral glossy), dipotong di tepi kiri; air koral tua merambat dari bawah.
const Wall: React.FC<{water: number}> = ({water}) => {
  const rows = 9, cols = 4, bw = 0.62, bh = 0.26, g = 0.035;
  return (
    <group>
      {Array.from({length: rows * cols}, (_, k) => {
        const r = Math.floor(k / cols), c = k % cols, off = r % 2 ? bw / 2 : 0;
        const y = r * (bh + g) - 1.15, wet = y < -1.15 + water * 1.3;
        return <mesh key={k} position={[c * (bw + g) - 1.6 + off, y, 0]}>
          <boxGeometry args={[bw, bh, 0.34]} />
          <meshPhysicalMaterial color={wet ? '#c9483a' : C.coral} roughness={wet ? 0.18 : 0.42} clearcoat={wet ? 1 : 0.6} clearcoatRoughness={0.2} />
        </mesh>;
      })}
    </group>
  );
};

const SceneA: React.FC = () => {
  const f = useCurrentFrame(), p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Paper t={f / 30} />
      <ShadowCast kind="teralis" x={430} y={-60} o={0.13} />
      <Ghost lines={['Kapiler', 'Rembes']} y={1180} />
      <ThreeCanvas width={1080} height={1920} camera={{position: [0, 0, 6.4], fov: 30}} gl={{alpha: true, antialias: true}}>
        <Env /><ambientLight intensity={0.35} /><directionalLight position={[3, 4, 5]} intensity={2.2} /><directionalLight position={[-4, -1, 2]} intensity={0.6} color="#ffe2da" />
        <group position={[-0.75, 0.55, 0]} scale={0.62} rotation={[0.05, 0.5 + f * 0.002, 0]}><Wall water={p(10, 55)} /></group>
      </ThreeCanvas>
      <Cutout kind="daun" x={1130} y={1180} s={0.85} rot={200} p={p(0, 20)} />
      <TikTokBox text="Kenapa cat bawah tembok ngelupas terus?" p={p(2, 22)} y={250} />
      <LightBeam p={p(20, 45)} x={130} y={1330} rot={-8} len={360} o={0.12} />
      <TwoTier small="Tembokmu diam-diam" big="MINUM AIR" p={p(25, 50)} x={90} y={1400} size={150} />
      <Grain o={0.05} id="ga" />
    </AbsoluteFill>
  );
};

const SceneB: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill><Paper t={0} /><PatternBreak lines={['CAT ANTI AIR?', 'SALAH.']} sub="airnya malah naik lebih tinggi" p={interpolate(f, [0, 40], [0, 1], clamp)} /></AbsoluteFill>;
};

const SceneC: React.FC = () => {
  const f = useCurrentFrame(), p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Paper t={0} />
      <Cutout kind="tegel" x={-150} y={-150} s={0.55} rot={0} p={p(0, 15)} />
      <Cutout kind="tegel" x={930} y={1560} s={0.55} rot={45} p={p(0, 15)} />
      <TikTokBox text="Coba cari: ubin mana yang kopong?" p={p(0, 18)} y={330} size={50} />
      <PuzzleGrid mode="ubin" target={[5, 3]} p={p(5, 35)} reveal={p(42, 58)} y={560} />
      <TwoTier small="bunyinya" big="DUG..." p={p(42, 58)} y={1560} size={120} accent />
      <Grain o={0.05} id="gc" />
    </AbsoluteFill>
  );
};

const SceneD: React.FC = () => {
  const f = useCurrentFrame(), p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: `radial-gradient(110% 80% at 50% 35%, ${C.coral} 0%, ${C.coralDeep} 100%)`}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 260, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: 88, color: '#fff', letterSpacing: -2, textShadow: '0 8px 0 rgba(0,0,0,0.18)'}}>KUNCINYA BUKAN CAT</div>
      <PuzzleGrid mode="huruf" word="TRASRAM" row={4} p={p(0, 30)} reveal={p(35, 55)} bg="coral" y={520} />
      <Grain o={0.12} id="gd" />
    </AbsoluteFill>
  );
};

export const AsetDemo: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={60}><SceneA /></Sequence>
    <Sequence from={60} durationInFrames={60}><SceneB /></Sequence>
    <Sequence from={120} durationInFrames={60}><SceneC /></Sequence>
    <Sequence from={180} durationInFrames={60}><SceneD /></Sequence>
  </AbsoluteFill>
);
