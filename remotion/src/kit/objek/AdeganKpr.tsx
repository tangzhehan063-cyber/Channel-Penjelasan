// Adegan #22 (KPR) bergaya #21: objek putih kapur beroutline + warna peran. Jendela waktu animasi dari beats.json (`w`).
// mode: bank | rumah | naik | tetap | mengambang | simulasi | loncat | kontrak | tanya | cta
import {r} from '../waktu';
import {BankB, Gembok, JamBunga, KalenderB, MapKontrak, RumahB, UangB} from './Kpr21';
import type {AdeganP} from './AdeganStopkontak';

const W = (w: AdeganP['w'], k: string, d: [number, number]): [number, number] => (w && w[k]) || d;

export const AdeganKpr: React.FC<AdeganP> = ({t, mode, w, warna}) => {
  const c = {accent: warna.accent, good: warna.good, cool: warna.cool ?? '#2f6aa8'};
  switch (mode) {
    case 'bank': return <BankB warna={c} />;
    case 'rumah': return <RumahB warna={c} />;
    case 'naik': { // 12 ikat bunga; ikat ke-13 (seperempat persen) jatuh ke atas tumpukan
      const k = r(t, ...W(w, 'tambah', [9.6, 10.4]));
      return <group scale={[1.5, 1.5, 1.5]}><UangB n={12} warna={c} />{k > 0 && <group position={[0, (1 - k) * 0.6, 0]}><UangB n={0} extra={0} warna={c} /><group position={[0, 12 * 0.058, 0]}><UangB n={0} extra={1} warna={c} /></group></group>}</group>;
    }
    case 'tetap': return <group scale={[1.6, 1.6, 1.6]}><Gembok warna={c} /></group>;
    case 'mengambang': return <group scale={[1.2, 1.2, 1.2]}><JamBunga t={t} warna={c} /></group>;
    case 'simulasi': return <group scale={[1.5, 1.5, 1.5]}><UangB n={14} extra={1} warna={c} /></group>;
    case 'loncat': { // tumpukan melonjak dari 12 jadi 24 ikat; ikat tambahan berwarna aksen
      const k = r(t, ...W(w, 'naik', [37.8, 41.6])), tambah = Math.round(12 * k);
      return <group scale={[1.2, 1.2, 1.2]}><UangB n={12} extra={tambah} warna={c} /></group>;
    }
    case 'kontrak': return <group scale={[1.5, 1.5, 1.5]}><MapKontrak warna={c} /></group>;
    case 'tanya': return <group scale={[1.5, 1.5, 1.5]}><KalenderB warna={c} /></group>;
    default: return <RumahB warna={c} />; // cta
  }
};
