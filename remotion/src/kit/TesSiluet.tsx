// Uji ide #2: siluet vektor (SVG) diekstrusi jadi 3D dengan SVGLoader + bevel. Siluet bisa diganti SVG bebas pakai dari user.
import {ThreeCanvas} from '@remotion/three';
import {SVGLoader} from 'three/examples/jsm/loaders/SVGLoader.js';
import {AbsoluteFill} from 'remotion';
import * as THREE from 'three';
import {useMemo} from 'react';
import {PaperPalet} from '../aset/PaperPalet';
import {Lights, Rig} from './stage';

type Lapis = {d: string; warna: string; depth: number; z?: number; bevel?: number};
/** ubah daftar path SVG menjadi grup mesh 3D (satuan 1 = 100 px SVG; sumbu y SVG dibalik) */
const Ekstrusi: React.FC<{lapis: Lapis[]; skala?: number; pusat: [number, number]}> = ({lapis, skala = 0.01, pusat}) => {
  const grup = useMemo(() => {
    const g = new THREE.Group();
    const loader = new SVGLoader();
    for (const l of lapis) {
      const data = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${l.d}"/></svg>`);
      for (const p of data.paths) for (const shape of SVGLoader.createShapes(p)) {
        const geo = new THREE.ExtrudeGeometry(shape, {depth: l.depth, bevelEnabled: (l.bevel ?? 0) > 0, bevelSize: l.bevel ?? 0, bevelThickness: l.bevel ?? 0, bevelSegments: 4, curveSegments: 24});
        geo.translate(-pusat[0], -pusat[1], (l.z ?? 0) - l.depth / 2);
        const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({color: l.warna, roughness: 0.5}));
        g.add(m);
      }
    }
    g.scale.set(skala, -skala, skala);
    return g;
  }, [lapis, skala, pusat]);
  return <primitive object={grup} />;
};

// siluet mobil (sedan kecil) buatan tangan, viewBox 0..400 x 0..150
const roda = (cx: number, z: number): Lapis[] => [
  {d: `M${cx - 30},108 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0 Z`, warna: '#2c2c30', depth: 20, z},
  {d: `M${cx - 14},108 a14,14 0 1,0 28,0 a14,14 0 1,0 -28,0 Z`, warna: '#c9ccd1', depth: 22, z},
];
const MOBIL: Lapis[] = [
  {d: 'M8,112 L8,92 Q8,80 26,77 L88,70 Q112,36 152,30 L250,30 Q292,36 318,68 L362,76 Q394,80 394,98 L394,112 Z', warna: '#3f6fb8', depth: 80, bevel: 5},
  {d: 'M116,66 L134,44 Q142,40 152,40 L196,40 L196,66 Z', warna: '#e4ebf1', depth: 98},
  {d: 'M208,66 L208,40 L246,40 Q262,42 276,66 Z', warna: '#e4ebf1', depth: 98},
  {d: 'M376,84 L394,84 L394,98 L376,98 Z', warna: '#fff3c4', depth: 96},
  {d: 'M8,86 L22,86 L22,98 L8,98 Z', warna: '#d6462f', depth: 96},
  ...roda(96, 52), ...roda(96, -52), ...roda(304, 52), ...roda(304, -52),
];
export const TesSiluet: React.FC = () => (
  <AbsoluteFill>
    <PaperPalet palet="batu" />
    <ThreeCanvas width={1080} height={1920} camera={{position: [0, 2, 7], fov: 34}} gl={{alpha: true, antialias: true}}>
      <Lights /><Rig k={{t: 0, pos: [3.6, 3.0, 10.5], look: [0.2, 0.3, 0]}} />
      <group rotation={[0, -0.3, 0]}><Ekstrusi lapis={MOBIL} pusat={[200, 70]} /></group>
    </ThreeCanvas>
  </AbsoluteFill>
);
