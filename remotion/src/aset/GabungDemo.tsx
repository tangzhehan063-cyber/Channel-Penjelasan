// Demo sistem gabungan (15 dtk) dengan fakta video #5. Lihat style/aset.md bagian "Sistem gabungan".
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {Env} from '../pengetahuan/Scene';
import {Grain, TikTokBox} from './Aset';
import {whip, rise} from './Gerak';
import {K, PaperPlus, Kicker, MonoSub, SerifHead, Disc, FocusRing, PropRow, StatPanel, CommentBubble, FollowButton, Ornament} from './Gabung';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const coral = new THREE.Color(K.coral), wetC = new THREE.Color('#9e3a2f'), blue = new THREE.Color(K.blue);

const Wall: React.FC<{water: number}> = ({water}) => {
  const rows = 9, cols = 4, bw = 0.62, bh = 0.26, g = 0.035, h = rows * (bh + g);
  return (
    <group>
      {Array.from({length: rows * cols}, (_, k) => {
        const r = Math.floor(k / cols), c = k % cols, off = r % 2 ? bw / 2 : 0, y = r * (bh + g) - 1.15, wet = y < -1.15 + water * 1.15;
        return <mesh key={k} position={[c * (bw + g) - 1.1 + off, y, 0]}><boxGeometry args={[bw, bh, 0.34]} />
          <meshPhysicalMaterial color={wet ? wetC : coral} roughness={wet ? 0.2 : 0.45} clearcoat={0.6} clearcoatRoughness={0.25} /></mesh>;
      })}
      {water > 0.01 && <mesh position={[0, -1.15 - bh / 2 + water * 1.15, 0.2]}><boxGeometry args={[2.75, 0.045, 0.02]} /><meshBasicMaterial color={blue} /></mesh>}
      <mesh position={[0, -1.15 - bh / 2 - 0.12, 0]}><boxGeometry args={[3.4, 0.22, 0.9]} /><meshPhysicalMaterial color="#8b6a4f" roughness={0.9} /></mesh>
      {h > 0 && null}
    </group>
  );
};

export const GabungDemo: React.FC = () => {
  const f = useCurrentFrame();
  const cam = whip(f, [[0, -800, 340, 0.36], [24, -90, 120, 0.36], [98, -90, 120, 0.36], [116, -1300, 120, 0.36]]);
  const entryRot = interpolate(f, [0, 30], [1.1, 0.42], cl);
  const flood = rise(f, 200, 22), floodOut = rise(f, 262, 16);
  const pbIn = rise(f, 214, 10) * (1 - rise(f, 258, 6));
  return (
    <AbsoluteFill>
      <PaperPlus />
      {/* jangkar: kicker + pertanyaan tetap di atas sepanjang video */}
      <Kicker text="FAKTA RUMAH · #05" y={292} start={0} />
      <TikTokBox text="Kenapa cat bawah tembok ngelupas?" p={interpolate(f, [4, 22], [0, 1], cl)} y={338} size={40} />

      {/* Babak 1: objek + cakram + cincin fokus */}
      <Disc x={450} y={1040} r={280} color="#f6c9bd" start={4} out={100} />
      <Disc x={720} y={800} r={64} color={K.blue} start={14} out={100} o={0.85} />
      <SerifHead l1="Tembokmu" l2="minum air." start={10} out={92} />
      <AbsoluteFill style={{transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`, filter: `blur(${cam.blur}px)`}}>
        <ThreeCanvas width={1080} height={1920} camera={{position: [0, 0, 6.4], fov: 30}} gl={{alpha: true, antialias: true}}>
          <Env intensity={0} /><ambientLight intensity={0.35} /><directionalLight position={[3, 4, 5]} intensity={2.2} /><directionalLight position={[-4, -1, 2]} intensity={0.6} color="#ffe2da" />
          <group rotation={[0.1, entryRot + f * 0.0015, 0]}><Wall water={interpolate(f, [30, 90], [0, 1], cl)} /></group>
        </ThreeCanvas>
      </AbsoluteFill>
      <FocusRing x={450} y={1265} r={120} start={52} out={100} />

      {/* Babak 2: dari mana airnya? */}
      <SerifHead l1="Dari mana" l2="airnya?" start={102} out={194} />
      <PropRow items={[{icon: 'tanah', label: 'Tanah lembap'}, {icon: 'bata', label: 'Pori bata'}, {icon: 'panah', label: 'Naik pelan'}]} start={124} y={900} out={194} />

      {/* Babak 3: cincin membesar → layar koral (pemutus pola) */}
      <FocusRing x={540} y={1010} r={118} start={180} flood={flood} floodOut={floodOut} />
      {pbIn > 0 && <AbsoluteFill style={{opacity: pbIn}}>
        <div style={{position: 'absolute', left: 60, right: 60, top: 720, textAlign: 'center', fontFamily: 'Playfair Display', fontWeight: 900, color: '#fff', fontSize: 132, lineHeight: 0.98, letterSpacing: -3, textShadow: '0 8px 0 rgba(0,0,0,0.16)'}}>
          <div>Cat anti air?</div><div style={{fontStyle: 'italic', color: K.ink}}>Salah.</div></div>
      </AbsoluteFill>}

      {/* Babak 4: panel angka (fakta bersumber, lihat naskah #5) */}
      <SerifHead l1="Seberapa" l2="tinggi?" start={276} out={366} />
      <StatPanel rows={[
        {icon: 'penggaris', to: 1, pre: '±', suf: ' m', label: 'air bisa naik dari tanah (perkiraan)'},
        {icon: 'centang', to: 50, pre: '±', suf: ' cm', label: 'trasram di kaki tembok', accent: K.sage},
      ]} start={292} y={760} gap={20} out={366} />

      {/* Babak 5: CTA komentar → follow */}
      <SerifHead l1="Tembokmu" l2="ada yang…" start={370} top={520} size={104} />
      <CommentBubble word="ngelupas?" start={380} y={790} />
      <FollowButton start={402} click={428} y={1160} />

      <MonoSub lines={[[6, 'Tembok rumahmu tiap hari minum air. Dari tanah.'], [104, 'Bata dan plester penuh pori. Air naik lewat situ.'], [214, 'Cat anti air cuma nutup permukaan. Jalurnya masih nyambung.'], [280, 'Bisa naik sampai sekitar satu meter. Putus dari bawah: trasram.'], [372, 'Follow buat fakta rumah berikutnya!']]} />

      <Ornament cx={1030} cy={150} size={380} start={0} accent={rise(f, 200, 10) * (1 - rise(f, 262, 10))} />
      <Ornament cx={40} cy={1800} size={380} start={6} accent={rise(f, 200, 10) * (1 - rise(f, 262, 10))} />
      <Grain o={0.05} id="gb" />
    </AbsoluteFill>
  );
};
