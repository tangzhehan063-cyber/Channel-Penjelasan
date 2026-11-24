> **Status (24 Nov 2026):** katalog model CC0 (Kenney, low-poly) **opsional**; pakai hanya bila cocok dengan gaya terstilisasi dan lebih jelas daripada SVG/CSS. Bukan default.

# Aset luar: model CC0 dan siluet SVG (18 Nov 2026)
Tiga lapis memilih objek (urutan dicoba): **1. model CC0 siap pakai** → **2. siluet SVG diekstrusi** → **3. bentuk dasar dari kode** (`kit/prim.tsx`, untuk objek sederhana atau yang perlu animasi khusus).
Kit: `remotion/src/kit/model.tsx` (`useModels`, `Model3D`, `Siluet`, `Gambar`), katalog visual: komposisi `KatalogAset` (`npx remotion still KatalogAset out/katalog.png --scale=0.5`).

## Katalog (path di `remotion/public/aset-luar/`, lisensi CC0, lihat `kenney/LISENSI.txt`)
| # | Berkas | Isi | Cocok untuk |
|---|---|---|---|
| 1–4 | `kenney/kota/building-small-a…d.glb` | rumah/gedung kecil 4 varian | struktur rumah, kompleks, tata letak |
| 5 | `kenney/kota/building-garage.glb` | garasi | garasi, carport |
| 6 | `kenney/kota/road-straight-lightposts.glb` | jalan lurus + tiang lampu | jalan, tiang listrik, lampu jalan |
| 7 | `kenney/kota/road-intersection.glb` (+ `road-straight`, `road-corner`, `road-split`) | perempatan, jalan | jalan, lalu lintas, tusuk sate |
| 8 | `kenney/kota/pavement-fountain.glb` (+ `pavement`, `grass`, `grass-trees*`) | trotoar, air mancur, rumput, pohon | halaman, taman |
| 9 | `kenney/arena/stairs.glb` (+ `stairs-corner`) | tangga | anak tangga |
| 10 | `kenney/arena/wall-gate.glb` (+ `wall`, `wall-corner`) | dinding, gerbang | dinding, pagar |
| 11 | `kenney/arena/bricks.glb` (+ `block`) | tumpukan bata/blok | bata, material |
| 12 | `kenney/arena/column.glb` (+ `column-damaged`) | kolom | tiang, struktur |
| 13–14 | `kenney/racing/vehicle-truck-*.glb`, `vehicle-motorcycle.glb` | truk mainan (jip), motor chopper | kendaraan sebagai beban/properti |
| 15 | `kit/objek/SedanSiluet.tsx` (siluet SVG) | sedan kecil, bodi membulat | mobil; contoh lapis 2 |
Tidak ada di katalog (harus lapis 2 atau 3): perabot dapur/kamar mandi, kran, pipa, saklar, MCB, genteng, kasur, jendela, pintu rumah. Situs unduhan besar (kenney.nl, poly.pizza) diblokir; sumber baru hanya repo GitHub publik berlisensi CC0 yang bisa di-clone (`add_repo`, read).


## Paket tambahan (perabot, mobil, rumah, alat): Kenney lewat repo agregat
Sumber: `series-ai/jam-ready-assets` (repo publik berisi 383 paket, tiap paket punya `License.txt`; Kenney = CC0). Berkas besar disimpan lewat Git LFS: unduh dari `media.githubusercontent.com/media/series-ai/jam-ready-assets/main/<path>` (raw hanya memberi penunjuk). Skrip: `tools/ambil-aset.sh <paket> <folder>`; cari paket lain dengan `gh api -X GET search/code -f q='repo:series-ai/jam-ready-assets filename:License.txt'`.
Katalog visual: komposisi `KatalogRumah1` (perabot) dan `KatalogRumah2` (struktur, mobil, rumah, alat). Ukuran total aset ±15 MB.
| Folder `kenney/` | Jumlah | Isi penting |
|---|---|---|
| `furnitur/` | 140 | toilet(+Square), bathroomSink(+Square), bathtub, shower(+Round), bathroomMirror/Cabinet, kitchenSink/Stove(+Electric)/Fridge(4)/Microwave/Cabinet(banyak)/Blender/Toaster/hood, washer, dryer, washerDryerStacked, bedSingle/Double/Bunk, lounge sofa/kursi, table*, chair*, stool, lamp*, ceilingFan, television*, doorway*, wall*(Window, Doorway), floor*, stairs*, pottedPlant, trashcan |
| `mobil/` | 50 | sedan, sedan-sports, hatchback-sports, suv, suv-luxury, van, taxi, police, ambulance, firetruck, garbage-truck, delivery, truck, tractor, kart-*, roda, pecahan (debris) |
| `rumah-suburban/` | 40 | building-type-a…u (rumah), fence*, driveway*, path*, planter, tree* |
| `bangunan-modular/` | 79 | dinding/border, lantai, pintu (door-rotate-*), roda atap (roof-flat-*), tangga, detail-pipe, gutter-vertical, column |
| `properti-jalan/` | 100 | detail-light-* (tiang lampu), road-asphalt/dirt, wall-a/b, scaffolding, detail-dumpster, bench, cables, truk, pohon |
| `alat-survival/` | 80 | tool-hammer/axe/pickaxe/hoe, bucket, barrel, box, chest, tent, fence, rock, resource-planks/stone |
| `jalan-raya/` | 100 | ubin jalan `tileNNN` (aspal, trotoar) |
Warna: perabot memakai material berwarna (nama seperti `metal`, `wood`, `carpetWhite`, `metalDark`); ganti per bahan lewat `warna={{wood: '#c9402a'}}`. Paket lain memakai tekstur `Textures/colormap.png` (sudah diunduh); `redup` (0,3–1) menggelapkan model putih yang terlalu terang di bawah lampu adegan.
Tidak ada: kran/keran, pipa U, saklar, MCB, stop kontak, genteng, kunci. Itu tetap lapis 2 (siluet) atau 3 (kode). Catatan: perabot Kenney sangat putih; pakai `warna`/`redup` agar sesuai palet video.

## Pakai di adegan
```tsx
const {m, siap} = useModels(['kenney/kota/building-garage.glb']);   // di komponen DOM (komposisi), BUKAN di dalam kanvas
<ThreeCanvas ...><Lights /><Rig .../>
  {m && <><Model3D scene={m['kenney/kota/building-garage.glb']} fit={2.4} warna={{body: '#3f6fb8'}} /><Gambar onSiap={siap} /></>}
</ThreeCanvas>
```
- `fit` = sisi terpanjang dalam satuan dunia; alas di y=0, dipusatkan. `warna={{namaNode: hex}}` mengganti warna bagian bernama itu saja (nama node dibaca dari berkas glb); `flat` = satu warna untuk semua (kehilangan detail).
- **Wajib** `<Gambar onSiap={siap} />` paling akhir di dalam kanvas: ia merender satu frame lalu melepas `delayRender`. Tanpa itu still/render bisa KOSONG (kejadian 18 Nov: gambar kosong karena foto diambil sebelum model tergambar; jeda waktu tetap tidak andal).
- Muat model hanya di komponen DOM dan lempar sebagai prop; konteks React tidak menyeberang ke kanvas R3F.
- Siluet SVG: `Siluet lapis={[{d, warna, depth, z, bevel}]} pusat skala`; lapisan kaca/lampu dibuat lebih tebal dari bodi supaya menonjol. Jalur gambar bebas pakai (atau buatan sendiri); dilarang menyalin SVG ber-hak-cipta.
- Warna datar sesuai palet video (aturan KUNCI KARAKTER lama diarsipkan; jumlah objek per adegan mengikuti kebutuhan penjelasan). Model gaya "mainan" (Kenney) dipakai sebagai properti/objek, bukan diorama lebar.
