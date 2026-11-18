// Kit Penjelasan (rencana kit, STATUS 18 Nov 2026). Impor semua dari '../kit'. Panduan: style/gaya-penjelasan.md
export * from './waktu';
export * from './stage';
export * from './prim';
export * from './teks';
export * from './objek/Stopkontak';
// objek lama (tetap di tempat asal, tampilan tidak diubah): rumah atap seng dari #8, ruang AC dari #14
export {House, Seng, RoofCut} from '../v08/Rumah';
export {Penjelasan, type DataVideo} from './Penjelasan';
export {OBJEK} from './objek/registry';
export {AdeganStopkontak} from './objek/AdeganStopkontak';
export {AdeganPelat} from './objek/AdeganPelat';
export {Pelat} from './objek/Pelat';
