// Kit Penjelasan: primitif 3D (material datar membulat, tepi tinta tipis). Satuan bebas, bukan skala nyata.
import {Edges} from '@react-three/drei';
import {PALETTE} from '../pengetahuan/Scene';
import type {V3} from './waktu';

export const INK = PALETTE.ink;
export const Mat: React.FC<{c: string; m?: number; r?: number}> = ({c, m = 0, r = 0.5}) => <meshStandardMaterial color={c} roughness={r} metalness={m} />;
export const Bx: React.FC<{p: V3; s: V3; c: string; rot?: V3; edge?: boolean; m?: number}> = ({p, s, c, rot = [0, 0, 0], edge = true, m = 0}) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><boxGeometry args={s} /><Mat c={c} m={m} />{edge && <Edges color={INK} lineWidth={1.4} />}</mesh>
);
/** silinder; default menghadap sumbu z (rot x = 90°) */
export const Cy: React.FC<{p: V3; rad: number; h: number; c: string; rot?: V3; edge?: boolean; m?: number}> = ({p, rad, h, c, rot = [Math.PI / 2, 0, 0], edge = true, m = 0}) => (
  <mesh position={p} rotation={rot} castShadow><cylinderGeometry args={[rad, rad, h, 36]} /><Mat c={c} m={m} />{edge && <Edges color={INK} lineWidth={1.2} />}</mesh>
);
export const Sp: React.FC<{p: V3; rad: number; c: string}> = ({p, rad, c}) => (<mesh position={p}><sphereGeometry args={[rad, 20, 14]} /><Mat c={c} /></mesh>);
