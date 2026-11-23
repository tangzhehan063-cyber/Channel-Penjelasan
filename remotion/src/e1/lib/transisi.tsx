// Transisi footage -> 3D: "potong di garis tanah" (ground-slice).
// Foto berdiri di dunia 3D dengan garis tanah di y=0. Garis acuan menggambar sepanjang garis tanah, strip bawah foto (jalan) jatuh,
// tirai gelap di bawah garis terangkat, dan penampang tanah 3D yang sudah menempel pada garis itu terlihat. Garis yang sama tetap jadi acuan posisi awal.
import {Easing} from 'remotion';
import type * as THREE from 'three';
import {r} from '../../kit/waktu';
import {FotoBidang} from './footage';

export type SliceWaktu = {garis: [number, number]; jatuh: [number, number]; terang: [number, number]};
export const GroundSlice: React.FC<{t: number; tx: THREE.Texture | null; w: SliceWaktu; lebar: number; xp: number; zb: number; zGaris: number; zTirai: number; cropStrip: [number, number, number, number]; tinggiStrip: number; lebarGaris?: number; warna?: string}> =
  ({t, tx, w, lebar, xp, zb, zGaris, zTirai, cropStrip, tinggiStrip, lebarGaris = 9, warna = '#ef6a4c'}) => {
    const g = r(t, w.garis[0], w.garis[1], Easing.inOut(Easing.cubic));
    const j = r(t, w.jatuh[0], w.jatuh[1], Easing.in(Easing.cubic)), veil = 0.96 * (1 - r(t, w.terang[0], w.terang[1], Easing.out(Easing.cubic)));
    return (<group>
      {j < 1 && <FotoBidang tx={tx} crop={cropStrip} lebar={lebar} tinggi={tinggiStrip} p={[xp, -tinggiStrip / 2 - j * (tinggiStrip + 5.5), zTirai - 0.02]} />}
      {veil > 0.01 && <mesh position={[0, -3.6 - tinggiStrip / 2, zTirai]} renderOrder={5}><planeGeometry args={[14, 7.2 - tinggiStrip]} /><meshBasicMaterial color="#0f1115" transparent opacity={veil} depthWrite={false} /></mesh>}
      {g > 0.001 && <mesh position={[-lebarGaris / 2 + (lebarGaris * g) / 2, 0, zGaris]} renderOrder={6}><boxGeometry args={[lebarGaris * g, 0.035, 0.03]} /><meshBasicMaterial color={warna} toneMapped={false} /></mesh>}
    </group>);
  };
