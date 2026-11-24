# Identitas channel "fakta rumah" dan sistem palet

> **Status (24 Nov 2026):** identitas visual yang berlaku ada di `docs/visual-system/VISUAL_STYLE_SPEC.md` (stylized/flat illustration; tingkat detail B default; peran warna; kartu/kicker/teks opsional). Berkas ini = riwayat gaya #7–#26 dan sumber preset palet; aturan 'wajib sama setiap video', 'SATU objek 3D glossy per adegan', dan jangkar tata letak **tidak lagi mengikat**. Salinan sebelum perubahan: `arsip/v3-24nov/`.


**Prinsip:** identitas channel adalah *sistem* (bentuk, tipografi, tata letak, bahasa gerak, peran warna), bukan warna latar. Latar boleh berganti-ganti selama jangkar identitas di bawah tetap ada. Demo: `style/contoh-aset/palet-demo.jpg` (adegan sama di 7 latar).
Palet: `style/palet.json`. Komponen: `remotion/src/aset/PaperPalet.tsx`. Cek: `python3 tools/cek-visual.py palet` dan `node tools/cek-sutradara.mjs NN` (bagian 6–8).

## Yang TETAP (jangkar identitas, jangan diganti antar-palet)
| Jangkar | Aturan |
|---|---|
| Kicker + TikTokBox | `FAKTA RUMAH · #NN` (IBM Plex Mono) y≈292 dan kotak hitam pertanyaan hook y≈338. Di palet gelap pakai `<Kicker color={palet.accent}>`. |
| Kartu judul dua tingkat | Kartu **selalu terang** `#faf9f6` (`KARTU`), kalimat kecil 50 px + KATA BESAR Inter Black, y≈450. Kartu terang inilah yang menjaga keterbacaan dan "wajah" channel di latar apa pun. |
| Subtitle | Kotak terang, top 1400, kata aktif berwarna aksen. |
| Chip, stiker, callout | Selalu di kartu terang berbingkai warna peran. |
| Grain | Grain 0,05–0,08. **Tanpa ornamen tegel di sudut** (dihapus atas perintah user 16 Nov 2026; jangan pakai `Ornament`/`Cutout` tegel di video baru). |
| Tipografi | Inter (judul/label), IBM Plex Mono (kicker), Space Mono (catatan kecil). |
| Bentuk | Membulat (kotak 2D radius ≥ 14; objek 3D dari lengkung + outline tinta tipis). Satu objek hero prosedural per adegan. |
| Bahasa gerak | Aturan sutradara B.8–B.10 (ease-out masuk, hierarki gerak, antisipasi → aksi → follow-through). |
| Peran warna semantik | **aksen** (koral/merah) = masalah, sorotan, kata aktif · **cool** (biru) = dingin, air, negatif · **good** (hijau) = solusi, benar. Kuning cahaya hanya untuk benda bercahaya (deklarasikan sebagai `--extra`). |
| Penutup | "Follow buat fakta rumah berikutnya!" + kartu FOLLOW. |

## Yang BOLEH BERGANTI per video
Warna/gradien latar (preset palet), intensitas tekstur kertas, warna material objek (nilainya dari `PALET[nama]`, perannya tetap), suasana (siang/malam), warna ornamen (gelap = terang).

## Pilih palet (usulan, bukan aturan keras)
| Palet | Cocok untuk |
|---|---|
| `krem` (baku #1–#14) | netral, seri berjalan, pembuka seri baru |
| `mint` | air, kebersihan, kesehatan, udara segar |
| `terakota` | bata, tanah, panas, biaya/uang rumah |
| `batu` | beton, struktur, teknis, konstruksi |
| `madu` | listrik, cahaya, lampu, uang hangat |
| `langit` | atap, cuaca, hujan, angin |
| `malam` | "Bukan Hantu", bunyi malam, misteri |
Satu palet per video; ganti palet di tengah video hanya sekali dan hanya di titik pemutus pola. Hindari palet yang sama lebih dari 2 video berturut-turut supaya feed beragam; keseragaman tetap terjaga oleh jangkar di atas.

## Pakai di kode
```tsx
import {PaperPalet, PALET, KARTU} from '../aset/PaperPalet';
<PaperPalet palet="mint" />            // ganti <PaperPlus />; 'krem' = PaperPlus apa adanya
const p = PALET.mint;                  // p.accent/cool/good (objek, stiker langsung di latar), p.accentTeks/coolTeks/goodTeks (teks besar di kartu)
<Kicker text="FAKTA RUMAH · #15" color={p.terang ? undefined : p.accent} />
```
Warna objek 3D ambil dari `p.accent/p.cool/p.good` (bukan hex baru). Warna tambahan yang sengaja (mis. kuning lampu) ditulis di storyboard dan diberikan ke cek lewat `--extra`.

## Aturan angka (divalidasi `tools/cek-visual.py`)
- Aksen/cool/good terhadap latar ≥ 2,5:1 (objek besar berisi + outline); teks besar di kartu ≥ 3:1; tinta terhadap latar terang ≥ 4,5:1.
- Hue aksen/cool/good berjarak ≥ 40° satu sama lain.
- ≤ 4 keluarga warna dominan per frame; ≤ 18% piksel berwarna di luar palet; tanpa neon (jenuh > 0,92 dan terang).
- Objek utama berkontras ≥ 1,8:1 terhadap latar (GAGAL < 1,25).

## Batas yang masih ada (jujur)
- Teknik latar non-krem = gradien palet + tekstur `kertas-dasar.png` dicampur (multiply/soft-light), bukan kertas sungguhan; hanya **still** yang sudah diuji, belum render video penuh dengan palet non-krem.
- Video #1–#14 tetap krem; objek 3D lama (`P13`, `P14`) belum terhubung ke `PALET`. Video baru yang memakai palet lain harus mengambil warna dari `PALET`.
- Angka kontras objek di still bergantung frame; cek visual ini membantu, bukan pengganti melihat sheet.
