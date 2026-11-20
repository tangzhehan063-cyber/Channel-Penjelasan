// Daftar objek untuk template berbasis data. Tambah objek baru: buat komponen adegan (t, mode, w, warna) lalu daftarkan di sini.
import {AdeganStopkontak, type AdeganP} from './AdeganStopkontak';
import {AdeganPelat} from './AdeganPelat';
import {AdeganKpr} from './AdeganKpr';
import {AdeganSifon} from './AdeganSifon';
import {AdeganHook} from './AdeganHook';
import {AdeganDinding} from './AdeganDinding';
import {AdeganKran} from './AdeganKran';
import {AdeganAtap} from './AdeganAtap';

export const OBJEK: Record<string, React.FC<AdeganP>> = {
  stopkontak: AdeganStopkontak,
  pelat: AdeganPelat as React.FC<AdeganP>,
  kpr: AdeganKpr,
  sifon: AdeganSifon,
  hook: AdeganHook,
  dinding: AdeganDinding,
  kran: AdeganKran,
  atap: AdeganAtap,
};
