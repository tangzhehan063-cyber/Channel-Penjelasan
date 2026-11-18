// Daftar objek untuk template berbasis data. Tambah objek baru: buat komponen adegan (t, mode, w, warna) lalu daftarkan di sini.
import {AdeganStopkontak, type AdeganP} from './AdeganStopkontak';

export const OBJEK: Record<string, React.FC<AdeganP>> = {
  stopkontak: AdeganStopkontak,
};
