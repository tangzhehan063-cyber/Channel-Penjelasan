// Video #12 "Ngontrak vs Nyicil": timbangan dua rumah kertas, kunci sewa, jalan ke kantor, motor, koin ongkos.
import * as THREE from 'three';
import {PBox, MT} from '../v10/Tangga';
import {MK, useTextTex} from '../v11/Kpr';

type V3 = [number, number, number];
const mat = (color: string, rough = 0.9) => new THREE.MeshStandardMaterial({color, roughness: rough, metalness: 0});
export const M12 = {sewa: mat('#c9ccd3'), sewaRoof: mat('#7d8796'), roof: mat('#9c7b5e', 0.85), door: mat('#5b4a3d'), glass: mat('#bfe0ea', 0.4), gold: mat('#e0b453', 0.45), road: mat('#5e6066', 1), line: mat('#fbfaf6'), office: mat('#8fa3bd'), officeDark: mat('#5d6f88'), wheel: mat('#2b2b2e', 0.8), plank: mat('#e8dcc6'), coin: mat('#e0b453', 0.5)};

/* rumah kecil: badan + atap pelana + pintu + jendela; tinggi badan 0.46 */
export const MiniHouse: React.FC<{kind: 'sewa' | 'subsidi'; s?: number}> = ({kind, s = 1}) => {
  const W = 0.64, Hh = 0.46, D = 0.52, a = 0.6, half = W / 2 + 0.07, L = half / Math.cos(a);
  const body = kind === 'sewa' ? M12.sewa : MT.coral, roof = kind === 'sewa' ? M12.sewaRoof : M12.roof;
  if (s <= 0.001) return null;
  return (
    <group scale={[s, s, s]}>
      <PBox p={[0, Hh / 2, 0]} s={[W, Hh, D]} m={body} />
      <mesh position={[0, Hh, -D / 2]} material={MT.paper} castShadow receiveShadow>
        <extrudeGeometry args={[new THREE.Shape([new THREE.Vector2(-W / 2, 0), new THREE.Vector2(W / 2, 0), new THREE.Vector2(0, Math.tan(a) * W / 2)]), {depth: D, bevelEnabled: false}]} />
      </mesh>
      <PBox p={[-half / 2, Hh + (Math.tan(a) * half) / 2 + 0.02, 0]} s={[L + 0.05, 0.05, D + 0.12]} r={[0, 0, a]} m={roof} />
      <PBox p={[half / 2, Hh + (Math.tan(a) * half) / 2 + 0.02, 0]} s={[L + 0.05, 0.05, D + 0.12]} r={[0, 0, -a]} m={roof} />
      <PBox p={[-0.12, 0.13, D / 2 + 0.006]} s={[0.15, 0.26, 0.012]} m={M12.door} />
      <PBox p={[0.14, 0.27, D / 2 + 0.006]} s={[0.16, 0.12, 0.012]} m={M12.glass} />
    </group>
  );
};

/* kunci emas (cincin + batang + gigi) */
export const Key: React.FC<{p: V3; s?: number; rot?: V3}> = ({p, s = 1, rot = [0, 0, 0]}) => s <= 0.001 ? null : (
  <group position={p} rotation={rot} scale={[s, s, s]}>
    <mesh material={M12.gold} castShadow><torusGeometry args={[0.07, 0.022, 12, 28]} /></mesh>
    <PBox p={[0.17, 0, 0]} s={[0.2, 0.034, 0.03]} m={M12.gold} />
    <PBox p={[0.24, -0.04, 0]} s={[0.03, 0.05, 0.03]} m={M12.gold} />
    <PBox p={[0.19, -0.035, 0]} s={[0.025, 0.04, 0.03]} m={M12.gold} />
  </group>
);

/* timbangan: tiang segitiga + papan; anak-anak diletakkan di atas papan (y=0 = permukaan papan) */
export const PH = 0.62, PL = 3.0;
export const Scale: React.FC<{tilt: number; children?: React.ReactNode}> = ({tilt, children}) => (
  <group>
    <mesh material={MT.paper} position={[0, PH / 2, 0]} castShadow receiveShadow><cylinderGeometry args={[0.02, 0.32, PH, 3]} /></mesh>
    <group position={[0, PH, 0]} rotation={[0, 0, tilt]}>
      <PBox p={[0, 0.03, 0]} s={[PL, 0.06, 0.7]} m={M12.plank} />
      <group position={[0, 0.06, 0]}>{children}</group>
    </group>
  </group>
);

/* jalan dari x0 ke x0+len (tumbuh), di tanah, z tetap */
export const Road: React.FC<{x0: number; len: number; z: number}> = ({x0, len, z}) => len <= 0.01 ? null : (
  <group>
    <PBox p={[x0 + len / 2, 0.006, z]} s={[len, 0.012, 0.42]} m={M12.road} />
    {Array.from({length: Math.floor(len / 0.4)}, (_, i) => <PBox key={i} p={[x0 + 0.2 + i * 0.4, 0.0135, z]} s={[0.18, 0.003, 0.03]} m={M12.line} />)}
  </group>
);

export const Office: React.FC<{p: V3; s: number}> = ({p, s}) => {
  const sign = useTextTex('KANTOR', 512, 128, '#fbfaf6', '#5d6f88', '900 92px Inter, sans-serif');
  if (s <= 0.001) return null;
  return (
    <group position={p} scale={[s, s, s]}>
      <PBox p={[0, 0.85, 0]} s={[0.9, 1.7, 0.7]} m={M12.office} />
      {Array.from({length: 15}, (_, i) => <PBox key={i} p={[-0.27 + (i % 3) * 0.27, 0.35 + Math.floor(i / 3) * 0.28, 0.352]} s={[0.17, 0.15, 0.01]} m={i % 4 === 1 ? M12.glass : M12.officeDark} />)}
      <mesh position={[0, 1.82, 0.2]}><planeGeometry args={[0.8, 0.2]} /><meshStandardMaterial map={sign} roughness={0.9} /></mesh>
      <PBox p={[0, 1.82, 0.19]} s={[0.84, 0.24, 0.02]} m={MK.roof} />
    </group>
  );
};

export const Motor: React.FC<{p: V3}> = ({p}) => (
  <group position={p}>
    <PBox p={[0, 0.1, 0]} s={[0.26, 0.07, 0.07]} m={MT.coral} />
    <PBox p={[0.1, 0.17, 0]} s={[0.03, 0.1, 0.03]} m={MT.ink as unknown as THREE.Material} />
    <PBox p={[-0.04, 0.155, 0]} s={[0.12, 0.03, 0.08]} m={M12.door} />
    {[-0.1, 0.11].map((x) => <mesh key={x} position={[x, 0.055, 0]} rotation={[Math.PI / 2, 0, 0]} material={M12.wheel} castShadow><cylinderGeometry args={[0.055, 0.055, 0.035, 18]} /></mesh>)}
  </group>
);

/* koin ongkos yang tercecer di jalan */
export const Coin: React.FC<{p: V3; s: number}> = ({p, s}) => s <= 0.001 ? null : (
  <mesh position={p} scale={[s, s, s]} material={M12.coin} castShadow><cylinderGeometry args={[0.06, 0.06, 0.016, 24]} /></mesh>
);
