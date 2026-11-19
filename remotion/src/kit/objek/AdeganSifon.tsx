// Adegan #23 (sifon pipa U). Waktu dari beats.json (`w`): bongkar [a,b], pasang [a,b], buka, ujung, tutup, surut, gas, kering, gas2, isi (4 angka).
// mode: bebas (semua adegan memakai satu garis waktu yang sama; yang beda hanya kamera).
import {Easing} from 'remotion';
import {r} from '../waktu';
import {Sifon} from './Sifon';
import type {AdeganP} from './AdeganStopkontak';

const ease = Easing.inOut(Easing.cubic);
export const AdeganSifon: React.FC<AdeganP> = ({t, w, warna}) => {
  const g = (k: string, d: [number, number]): [number, number] => (w && w[k]) || d;
  const [b0, b1] = g('bongkar', [9.5, 11.3]), [p0, p1] = g('pasang', [14.0, 14.7]);
  const gap = ease(r(t, b0, b1, Easing.linear)) - ease(r(t, p0, p1, Easing.linear));
  const A = g('alir', [15.0, 19.0]), T = g('tutup', [21.0, 23.0]), G = g('gas', [28.8, 33.4]);
  const K = w?.kering, G2 = w?.gas2;
  const isi = w?.isiA && w?.isiB ? ([w.isiA[0], w.isiA[1], w.isiB[0], w.isiB[1]] as [number, number, number, number]) : undefined;
  return <Sifon t={t} gap={gap} warna={warna as any} w={{buka: A[0], ujung: A[1], tutup: T[0], surut: T[1], gas: G[0], gasSelesai: G[1], awal: true, kering: K, gas2: G2, isi}} />;
};
