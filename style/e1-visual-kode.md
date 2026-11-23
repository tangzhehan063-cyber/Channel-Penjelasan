# E1: visual 100% dari kode (Remotion + Three.js)

Acuan untuk `WORKFLOW.md` Step 3–5 dan bagian 05. Prinsip: **visual = fungsi murni dari nomor frame**. Tanpa API AI, tanpa jaringan, hasil sama setiap render, biaya kredit nol. AI hanya membantu menulis kode.

## 1. Pilih metode visual (aturan: yang paling jelas menjelaskan narasi, bukan yang paling mirip foto)
| Isi narasi | Metode utama | Cadangan |
|---|---|---|
| Letak/orientasi/relasi bangunan (hadap barat, lebih rendah dari jalan, pintu sejajar) | Model 3D rumah + kamera orbit/crane + matahari/sumbu arah | Denah SVG animasi |
| Bagian dalam (pipa, kabel, tulangan, lapisan lantai) | **Cutaway / cross-section / exploded view** (clipping plane, lapisan dipisah, stagger) | Diagram SVG berlapis |
| Aliran (air, udara, panas, listrik, cahaya matahari) | Flow animation: partikel ber-instancing, garis dash SVG | Panah + warna peran |
| Perbandingan (A vs B, benar vs mitos) | Dua objek berdampingan, split-screen, pola pemutus | Bagan batang SVG |
| Angka/tren | Graph SVG animasi (path draw, count-up) | Kartu angka |
| Konsep abstrak (tekanan, pemuaian, beban) | Simulasi sederhana (pegas, partikel, gradien warna) + highlight | Diagram + label |
| Suasana/ancaman (hook "rumah sial") | Adegan malam, lighting preset, kamera POV | Siluet + vignette |

Semi-realistis bukan tujuan akhir: bila diagram menjelaskan lebih cepat dalam 1–2 detik, pakai diagram. Catat pilihannya di rencana adegan.

## 2. Rencana adegan (wajib per shot, menggantikan prompt generator)
Isi di beat sheet (Step 3) selain kolom lama (Shot ID, Duration, VO, Text overlay, SFX, Fact note, Transition):
| Field | Isi |
|---|---|
| Tujuan penjelasan | Satu kalimat: penonton harus paham apa setelah shot ini |
| Objek utama | Satu objek kunci (ikut aturan ukuran `style/gaya-penjelasan.md` §3) |
| Geometri | Primitif/ekstrusi/lathe/BufferGeometry apa, ukuran nyata (meter) |
| Metode visual | Dari tabel §1 |
| Gerakan objek | Apa yang bergerak, kapan (frame/detik), easing |
| Kamera | Preset (§4), posisi awal → akhir, alasan |
| Komposisi | Titik fokus, ruang kosong untuk teks (subtitle y=1400) |
| Material | Dari pustaka material (§3) |
| Lighting | Preset (§4) |
| Durasi | Detik, sesuai VO |
Aturan: shot tanpa "tujuan penjelasan" yang jelas = dekorasi, dibuang.

## 3. Sistem aset (dibuat sekali, dipakai ulang)
Lokasi aset baru E1: `remotion/src/kit/arsitektur/` (daftarkan adegan di `kit/objek/registry.tsx`). Skala: **1 satuan = 1 meter** supaya proporsi masuk akal (pintu 0,9×2,1; langit-langit 2,8; bata 0,22×0,07; pipa 1/2" ≈ 0,02).

| Kategori | Status | Teknik |
|---|---|---|
| Komponen rumah: dinding, lantai, atap, pondasi, kolom, balok, jendela, pintu | Ada sebagian (`AdeganDinding`, `AdeganAtap`, `AdeganPelat`, `AdeganHook`); **perlu dirapikan jadi komponen parametrik** (`<Dinding panjang tinggi tebal bukaan[]>`) | `BoxGeometry`, `ExtrudeGeometry` dari `Shape` (dinding berlubang), atap pelana via `Shape` |
| Pipa, kabel, saluran air | Ada `Sifon`, `Stopkontak`, `AdeganKran` | `TubeGeometry` di sepanjang `CatmullRomCurve3`, `LatheGeometry` untuk sambungan |
| Struktur berulang (genteng, bata, besi tulangan, pagar) | Belum | `InstancedMesh` |
| Furniture | Model CC0 (`style/aset-luar.md`) atau primitif | Lapis 1 → 2 → 3 di `gaya-penjelasan.md` |
| Pohon, landscape, jalan | Parsial (`AdeganHook`, tanah/jalan v17) | Kerucut/ikosahedron ber-seed; tanah `PlaneGeometry` + displacement |
| Material bangunan | Belum | Pustaka `material.ts`: beton, bata, kayu, genteng, keramik, kaca, logam, rumput |
| Lighting preset | Ada `Lights`, `LightsIso` | Tambah: `siang`, `senja`, `malam`, `kaca-mendung` (matahari = `DirectionalLight` dari azimut nyata, sehingga "hadap barat" akurat) |
| Camera preset | Ada `kamera.push/orbit/pull` | Tambah: `crane`, `pov-maju`, `iso-bongkar`, `pan-banding` |
| Motion preset | Ada `r()`, ease | Tambah stagger, spring, draw-on |
| Diagram, label, callout | Ada `Chip`, `Title`, `proj()` | SVG: panah, dimensi/ukuran, bagan, path-draw |
| Background/environment | Ada palet latar | Gradien langit, kabut, `Environment` preset lokal |

Prioritas tekstur: (1) material procedural Three.js (`MeshStandardMaterial`, roughness/metalness, bump dari noise) → (2) CSS/SVG → (3) `CanvasTexture` buatan sendiri (bata, kayu, noise; di-seed) → (4) aset lokal berlisensi yang sudah ada di proyek (persetujuan pemilik). Dilarang: tekstur/model hasil layanan AI, unduhan saat render.

Aturan kode: semua acak lewat `mulberry32(seed)`, bukan `Math.random()`; tanpa `fetch`; aset lewat `staticFile()`; tanpa animasi berbasis `Date`/CSS transition (Remotion hanya mengenal `useCurrentFrame`).

## 4. "Semi-realistis" lewat kode (arah E1)
Yang membedakan dari kontrol (diorama kertas, warna datar): 
- Material PBR: roughness bervariasi, bump halus, sedikit ketidaksempurnaan (noise warna ±3%).
- Cahaya: satu matahari + `HemisphereLight`, bayangan lembut (`PCFSoftShadowMap`/`VSM`), `fog` tipis untuk kedalaman.
- Warna: grading di akhir (`@remotion/effects`/CSS filter), tidak terlalu jenuh.
- Detail nyata: ukuran sesuai meter, ambang pintu, tebal dinding, overhang atap.
Batas jujur: Three.js tanpa path tracing tidak akan menyamai foto. Tujuan: "cukup meyakinkan, jelas ilustrasi". Bila hasil pilot tampak seperti diorama polos, tambah material/cahaya dulu, jangan ganti arsitektur.

## 5. Cek otomatis (pengganti QC warping/flicker)
| Cek | Alat |
|---|---|
| Tanpa API AI / jaringan | `node tools/cek-mandiri.mjs` (wajib sebelum render; GAGAL = berhenti) |
| Komposisi, ukuran objek, teks | `node tools/cek-sutradara.mjs NN` |
| Gerak (frame diam, hold) | `tools/cek-gerak.sh NN` |
| Z-fighting, objek tembus, celah | Still di awal/tengah/akhir tiap shot (`remotion still`), cek manual 1 sheet |
| Render deterministik | Render still frame sama dua kali, byte identik |
