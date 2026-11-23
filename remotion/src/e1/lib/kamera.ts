// Kamera dari shot list: tiap shot punya pose awal/akhir + easing; waktu absolut (detik). Kamera = data, bukan kode tulisan tangan per video.
import {Easing} from 'remotion';
import type {Key, V3} from '../../kit/waktu';

export type Pose = {pos: V3; look: V3};
export type ShotKamera = {id: string; mulai: number; durasi: number; posisi_kamera: {dari: Pose; ke: Pose}; gerak_kamera: {jenis: string; easing?: string}};

const EZ: Record<string, (x: number) => number> = {
  'in-out': Easing.inOut(Easing.cubic), out: Easing.out(Easing.cubic), in: Easing.in(Easing.cubic), linear: (x) => x, tahan: () => 0,
  // gerak lambat di tengah, cocok untuk "menahan" lalu bergerak: ease in-out kuat
  'in-out-kuat': Easing.inOut(Easing.poly(4)),
};
const l3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

/** kamera di detik t. Di luar semua shot: pose terdekat. */
export function kameraShots(S: ShotKamera[], t: number): Key {
  const s = S.find((x) => t >= x.mulai && t < x.mulai + x.durasi) ?? (t < S[0].mulai ? S[0] : S[S.length - 1]);
  const u = Math.min(1, Math.max(0, (t - s.mulai) / s.durasi)), k = (EZ[s.gerak_kamera.easing ?? 'in-out'] ?? EZ['in-out'])(u);
  const {dari, ke} = s.posisi_kamera;
  return {t, pos: l3(dari.pos, ke.pos, k), look: l3(dari.look, ke.look, k)};
}
