// Kit Penjelasan: waktu, kamera, proyeksi. Diekstrak dari v08/v19/v20 tanpa mengubah perilaku.
import * as THREE from 'three';
import {Easing, interpolate} from 'remotion';

export const FPS = 30;
export const FOV = 34;
export const ASPECT = 1080 / 1920;
export const CC_TOP = 1400; // posisi subtitle (ACC user, jangan diubah)

export const ease = Easing.inOut(Easing.cubic);
/** progres 0..1 dari detik a ke b */
export const r = (t: number, a: number, b: number, e = ease) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

export type V3 = [number, number, number];
export type Key = {t: number; pos: V3; look: V3; zoom?: number};
export const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

/** kamera di detik t dari daftar keyframe (CAM_*). */
export function camAt(keys: Key[], t: number): Key {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) { const k = ease((t - a.t) / (b.t - a.t)); return {t, pos: lerp3(a.pos, b.pos, k), look: lerp3(a.look, b.look, k), zoom: a.zoom !== undefined && b.zoom !== undefined ? a.zoom + (b.zoom - a.zoom) * k : undefined}; }
  }
  return keys[keys.length - 1];
}

/** titik dunia 3D -> piksel layar 1080x1920 (untuk menempel stiker 2D pada objek). Clamp hasilnya sendiri (x 250..900). */
export function proj(cam: Key, p: V3): [number, number] {
  const c = new THREE.PerspectiveCamera(FOV, ASPECT, 0.1, 100);
  c.position.set(...cam.pos); c.lookAt(...cam.look); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = new THREE.Vector3(...p).project(c);
  return [(v.x + 1) * 540, (1 - v.y) * 960];
}

/** Resep kamera baku (sutradara): hasil berupa Key[] siap dipakai camAt. look = titik objek kunci. */
export const kamera = {
  /** dorong pelan ke objek (hook/payoff) */
  push: (t0: number, t1: number, look: V3, dari = 4.8, ke = 4.0): Key[] => [
    {t: t0, pos: [look[0] + 0.1, look[1] + 0.05, look[2] + dari], look}, {t: t1, pos: [look[0] + 0.05, look[1] + 0.02, look[2] + ke], look}],
  /** mengitari objek dari kiri ke kanan */
  orbit: (t0: number, t1: number, look: V3, jarak = 3.9, dari = -2.2, ke = 2.0): Key[] => [
    {t: t0, pos: [look[0] + dari, look[1] + 0.9, look[2] + jarak], look}, {t: t1, pos: [look[0] + ke, look[1] + 0.7, look[2] + jarak], look}],
  /** mundur untuk memperlihatkan adegan majemuk (jarak ±10, geser look agar semua objek masuk) */
  pull: (t0: number, t1: number, look: V3, dari = 10.6, ke = 9.4): Key[] => [
    {t: t0, pos: [look[0] - 0.2, look[1] + 1.6, look[2] + dari], look}, {t: t1, pos: [look[0] - 0.1, look[1] + 1.0, look[2] + ke], look}],
};

/** proyeksi isometrik (kamera ortografis X=Y=Z, lihat IsoRig di stage.tsx): titik dunia -> piksel 1080x1920. Dipakai stiker/callout yang menempel di adegan `iso`. Clamp sendiri. */
export function projIso(cam: Key, p: V3): [number, number] {
  const z = cam.zoom ?? 300, a = p[0] - cam.look[0], b = p[1] - cam.look[1], c = p[2] - cam.look[2];
  return [540 + z * (a - c) / Math.SQRT2, 960 - z * (-a + 2 * b - c) / Math.sqrt(6)];
}
