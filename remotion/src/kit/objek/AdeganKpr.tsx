// Adegan #22 (KPR): objek diorama kertas dari v11 (bank, rumah bata, uang berikat, kalender, amplop, map kontrak), dipakai satu per adegan dan dibesarkan.
// Jendela waktu animasi dari beats.json (`w`, detik absolut). mode: bank | rumah | naik | tetap | mengambang | simulasi | loncat | kontrak | tanya | cta
import {Bank, Bills, Calendar, Folders, House} from '../../v11/Kpr';
import {r} from '../waktu';
import type {AdeganP} from './AdeganStopkontak';

const W = (w: AdeganP['w'], k: string, d: [number, number]): [number, number] => (w && w[k]) || d;

export const AdeganKpr: React.FC<AdeganP> = ({t, mode, w}) => {
  switch (mode) {
    case 'bank': return <group position={[0, 0, 0]}><Bank p={[0, 0, 0]} /></group>;
    case 'rumah': return <House fill={54} build={1} />;
    case 'naik': { // 12 ikat bunga + 1 ikat tambahan jatuh di atas (seperempat persen)
      const a = 12 / 13 + (1 / 13) * r(t, ...W(w, 'tambah', [9.6, 10.4]));
      return <group scale={[2.6, 2.6, 2.6]}><Bills p={[0, 0, 0]} gray={12} coral={1} appear={a} /></group>;
    }
    case 'tetap': return <group scale={[3, 3, 3]}><Calendar p={[0, 0, 0]} text="TETAP" sub="aman sampai habis" done /></group>;
    case 'mengambang': return <group scale={[3, 3, 3]} rotation={[0, 0, 0.05 * Math.sin(t * 2.2)]}><Calendar p={[0, 0, 0]} text="MENGAMBANG" sub="ikut pasar" /></group>;
    case 'simulasi': return <group scale={[2.6, 2.6, 2.6]}><Bills p={[0, 0, 0]} gray={14} coral={1} appear={1} /></group>; // satu tumpukan uang (14 ikat bunga + 1 ikat tambahan)
    case 'loncat': { // ikat bertambah dari 12 jadi 24: cicilan melonjak
      const a = 0.5 + 0.5 * r(t, ...W(w, 'naik', [37.8, 41.6]));
      return <group scale={[2.2, 2.2, 2.2]}><Bills p={[0, 0, 0]} gray={12} coral={12} appear={a} /></group>;
    }
    case 'kontrak': return <group scale={[3, 3, 3]}><Folders p={[0, 0, 0]} h={0.5} s={1} /></group>;
    case 'tanya': return <group scale={[3, 3, 3]}><Calendar p={[0, 0, 0]} text="?" sub="masa tetapmu" /></group>;
    default: return <House fill={90} build={1} />; // cta
  }
};
