// Sampel gaya "Kurzgesagt": vektor datar, warna jenuh, bentuk membulat, latar ungu-biru tua bertabur bintang. Tanpa suara, tanpa naskah. Geometri dan kamera sama dengan SampelBlueprint.
import {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBox} from '@react-three/drei';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {camAt, FPS, projIso, r, type Key, type V3} from '../kit/waktu';
import {anchor, CAM, ez, layout, NAMA, Rig, SOROT, URUT} from './SampelBlueprint';

export const SK_FRAMES = 30 * FPS;
const WARNA: Record<string, string> = {cat: '#4aa8f0', aci: '#f4f1ea', plester: '#cfc6b4', bata: '#e8643c', besi: '#ffc933', kolom: '#9ea6b3', sloof: '#8790a0', tanah: '#8a5a3a'};

const useBata = () => useMemo(() => {
  const c = document.createElement('canvas'); c.width = 512; c.height = 512; const g = c.getContext('2d')!;
  g.fillStyle = '#f2d9c4'; g.fillRect(0, 0, 512, 512); g.fillStyle = '#e8643c';
  const bh = 512 / 13, bw = 512 / 7;
  for (let j = 0; j < 13; j++) { const off = j % 2 ? -bw / 2 : 0; for (let x = off; x < 512; x += bw) g.fillRect(x + 4, j * bh + 4, bw - 8, bh - 8); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}, []);

const Blok: React.FC<{c: V3; s: V3; warna: string; hi: number; dim: number; tex?: THREE.Texture}> = ({c, s, warna, hi, dim, tex}) => {
  const redup = dim * (1 - hi);
  return (
    <RoundedBox args={s} radius={Math.min(0.03, Math.min(...s) / 2.2)} smoothness={3} position={c}>
      <meshStandardMaterial color={tex ? '#ffffff' : warna} map={tex} roughness={0.9} metalness={0} transparent={redup > 0.01} opacity={1 - 0.8 * redup} depthWrite={redup < 0.5} emissive={warna} emissiveIntensity={0.18 * hi} />
    </RoundedBox>
  );
};

const Scene: React.FC<{t: number}> = ({t}) => {
  const tex = useBata();
  const {anyHi, P, sorot} = layout(t);
  const dim = anyHi * 0.9, hiB = sorot('besi');
  const rod = (key: string, pos: V3, len: number, rot: V3) => (
    <mesh key={key} position={pos} rotation={rot}><cylinderGeometry args={[0.022, 0.022, len, 12]} /><meshStandardMaterial color={WARNA.besi} roughness={0.5} transparent={dim * (1 - hiB) > 0.01} opacity={1 - 0.8 * dim * (1 - hiB)} /></mesh>
  );
  const rods: V3[] = [[-0.045, 0, -0.07], [0.045, 0, -0.07], [-0.045, 0, 0.07], [0.045, 0, 0.07]];
  return (
    <>
      <ambientLight intensity={1.1} /><directionalLight position={[-3, 6, 5]} intensity={2.2} /><directionalLight position={[4, 2, -3]} intensity={0.6} color="#a9b8ff" />
      <Blok {...P.tanah} warna={WARNA.tanah} dim={dim} />
      <Blok {...P.sloof} warna={WARNA.sloof} dim={dim} />
      <Blok {...P.bata} warna={WARNA.bata} dim={dim} tex={tex} />
      <Blok {...P.kolomL} warna={WARNA.kolom} dim={dim} /><Blok {...P.kolomR} warna={WARNA.kolom} dim={dim} />
      <Blok {...P.plester} warna={WARNA.plester} dim={dim} /><Blok {...P.aci} warna={WARNA.aci} dim={dim} /><Blok {...P.cat} warna={WARNA.cat} dim={dim} />
      {(['kolomL', 'kolomR'] as const).flatMap((k) => rods.map((o, i) => rod(k + i, [P[k].c[0] + o[0], P[k].c[1], P[k].c[2] + o[2]], 1.46, [0, 0, 0])))}
      {[-0.07, 0.07].flatMap((dz) => [-0.06, 0.06].map((dy, i) => rod('s' + dz + i, [0, P.sloof.c[1] + dy, P.sloof.c[2] + dz], 2.36, [0, 0, Math.PI / 2])))}
    </>
  );
};

const Label: React.FC<{t: number; cam: Key; k: string; n: number}> = ({t, cam, k, n}) => {
  const [a, b] = SOROT[k];
  const o = r(t, a, a + 0.35, ez) * (1 - r(t, b - 0.35, b, ez));
  if (o <= 0.01) return null;
  const [ax, ay] = projIso(cam, anchor(k, t));
  const left = ax > 520, by = Math.max(150, Math.min(1560, ay - 330)), bx = left ? 80 : 1000;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: o}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d={`M ${ax} ${ay} L ${left ? 430 : 650} ${by + 50} L ${bx} ${by + 50}`} stroke="#fff" strokeWidth={4} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={ax} cy={ay} r={12} fill={WARNA[k]} stroke="#fff" strokeWidth={4} />
      </svg>
      <div style={{position: 'absolute', top: by + (1 - o) * 24, ...(left ? {left: bx} : {right: 1080 - bx}), whiteSpace: 'nowrap', background: 'rgba(14,10,44,0.82)', border: `5px solid ${WARNA[k]}`, borderRadius: 44, padding: '18px 34px', display: 'flex', alignItems: 'center', gap: 22, fontFamily: '"Arial Rounded MT Bold", "Trebuchet MS", Arial, sans-serif', fontWeight: 800, color: '#fff'}}>
        <div style={{width: 56, height: 56, borderRadius: 28, background: WARNA[k], color: '#17123f', fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{n}</div>
        <div style={{fontSize: 52, lineHeight: 1.05}}>{NAMA[k].map((x) => <div key={x}>{x}</div>)}</div>
      </div>
    </div>
  );
};

const bintang = Array.from({length: 90}, (_, i) => { const h = (x: number) => { const v = Math.sin(i * 127.1 + x * 311.7) * 43758.5453; return v - Math.floor(v); }; return {x: h(1) * 1080, y: h(2) * 1920, s: 2 + h(3) * 5, o: 0.25 + h(4) * 0.6}; });

export const SampelKurz: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const cam = camAt(CAM, t);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #3b2a86 0%, #1e1559 45%, #0c0827 100%)'}}>
      {bintang.map((b, i) => <div key={i} style={{position: 'absolute', left: b.x, top: b.y, width: b.s, height: b.s, borderRadius: '50%', background: '#fff', opacity: b.o * (0.7 + 0.3 * Math.sin(t * 2 + i))}} />)}
      <ThreeCanvas orthographic width={1080} height={1920} camera={{position: [20, 20, 20], zoom: cam.zoom ?? 300, near: -50, far: 120}} gl={{alpha: true, antialias: true}}>
        <Rig k={cam} /><Scene t={t} />
      </ThreeCanvas>
      {URUT.map((k, i) => <Label key={k} t={t} cam={cam} k={k} n={i + 1} />)}
      <div style={{position: 'absolute', left: 60, top: 70, fontFamily: '"Arial Rounded MT Bold", Arial, sans-serif', fontWeight: 800, fontSize: 40, color: '#ffd24a', letterSpacing: 2}}>ISI DINDING BATA</div>
    </AbsoluteFill>
  );
};
