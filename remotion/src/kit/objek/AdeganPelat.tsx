// Adegan pelat beton (#21). Jendela waktu animasi dari beats.json (`w`, detik absolut). mode: hook | masalah | tarik | susut | sebab | besi | aksi | tanya
import {Easing} from 'remotion';
import {r} from '../waktu';
import {Pelat} from './Pelat';
import type {AdeganP} from './AdeganStopkontak';

const W = (w: AdeganP['w'], k: string, d: [number, number]): [number, number] => (w && w[k]) || d;
const out = Easing.out(Easing.cubic);

export const AdeganPelat: React.FC<AdeganP & {warna: {accent: string; good: string; cool?: string}}> = ({t, mode, w, warna}) => {
  const wr = {accent: warna.accent, good: warna.good, cool: warna.cool ?? '#2f6aa8'};
  switch (mode) {
    case 'masalah':   // retak halus muncul di lantai
      return <Pelat warna={wr} gap={0.05 * r(t, ...W(w, 'retak', [5.0, 5.6]), out)} />;
    case 'tarik':     // tekan (kuat) lalu tarik (pecah)
      return <Pelat warna={wr} tekan={r(t, ...W(w, 'tekan', [11.6, 12.6])) * (1 - r(t, ...W(w, 'tekanLepas', [13.8, 14.4])))} tarik={r(t, ...W(w, 'tarik', [14.6, 15.4]), out)} />;
    case 'susut':     // susut dan tertahan tanah: tarikan dari kedua ujung
      return <Pelat warna={wr} tarik={r(t, ...W(w, 'tarik', [19.2, 20.4]), out)} />;
    case 'sebab':     // roda menekan, tanah turun, retak terbuka
      return <Pelat warna={wr} roda={r(t, ...W(w, 'roda', [23.5, 24.6]), out)} drop={0.14 * r(t, ...W(w, 'turun', [25.2, 27.2]))} gap={0.05 * r(t, ...W(w, 'retak', [30.6, 31.3]), out)} tarik={r(t, ...W(w, 'tarik', [28.4, 29.6]), out) * (1 - r(t, ...W(w, 'tarikLepas', [31.6, 32.0])))} />;
    case 'besi':      // besi diam selama beton utuh, menyala saat retak muncul
      return <Pelat warna={wr} gap={0.045 * r(t, ...W(w, 'retak', [37.4, 37.9]), out)} glow={r(t, ...W(w, 'nyala', [37.7, 38.1])) > 0.5 ? 1 : 0} tarik={r(t, ...W(w, 'tarik', [36.6, 37.4]), out)} />;
    case 'aksi': {    // jaring diangkat ke atas dengan kursi, beton dicor, tanah dipadatkan
      const lift = r(t, ...W(w, 'angkat', [49.0, 51.2]), out);
      return <Pelat warna={wr} meshY={0.04 + 0.46 * lift} chairs={lift > 0.02} pour={Math.max(0.001, r(t, ...W(w, 'cor', [52.0, 54.2])))} squash={r(t, ...W(w, 'padat', [54.7, 55.7]))} glow={lift > 0.95 ? 1 : 0} />;
    }
    default:          // hook, tanya, follow: pelat utuh, retak halus
      return <Pelat warna={wr} gap={mode === 'tanya' ? 0.03 : 0.03} />;
  }
};
