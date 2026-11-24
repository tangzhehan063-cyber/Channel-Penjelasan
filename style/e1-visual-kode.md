# E1: visual dari kode (aktif, diringkas 24 Nov 2026)

Gaya: `docs/visual-system/VISUAL_STYLE_SPEC.md`. Teknik dipilih berurutan: **SVG/CSS 2D → 2.5D berlapis → 3D terstilisasi bila perlu → foto diolah bila konten butuh** (`remotion-fitur/SKILL.md`, `kartu-teknik.md`). Pilih yang paling jelas menjelaskan, bukan yang paling mirip foto. Versi lama (tabel aset 3D, material/lighting realistis, kabut, rencana adegan dengan "subtitle y=1400" dan aturan ukuran objek): `arsip/style-lama/e1-visual-kode-v3b.md` dan `arsip/v3-24nov/style-e1-visual-kode.md` (riwayat, tidak berlaku).

## Prinsip kode (tetap)
- Visual = fungsi murni dari nomor frame (`useCurrentFrame`). Tanpa API AI, tanpa jaringan, hasil sama setiap render. AI hanya membantu menulis kode.
- Acak lewat `mulberry32(seed)`, bukan `Math.random()`; tanpa `fetch`/`Date`; aset lewat `staticFile()`; tanpa CSS transition/animasi berbasis waktu nyata.
- Bila 3D dipakai (terstilisasi): 1 satuan = 1 meter supaya proporsi masuk akal; hindari permukaan sebidang (z-fighting, selisih ≥ 0,02 m); `python3 tools/cek_kilau.py`.
- Rencana per shot ada di `e1/NN/storyboard.md` (`sutradara/referensi/templat-storyboard.md`); shot tanpa tujuan penjelasan yang jelas adalah dekorasi.

## Cek otomatis
| Cek | Alat |
|---|---|
| Tanpa API AI / jaringan | `node tools/cek-mandiri.mjs` (wajib sebelum render) |
| Struktur shot list (opsional) | `python3 tools/cek_shots.py e1/NN/shots.json` (variasi hanya saran) |
| Menonton render / gerak | `python3 tools/review_video.py <mp4>` (atau `tools/cek-gerak.sh`) |
| Z-fighting, objek tembus, teks terpotong | still awal/tengah/akhir tiap shot, `style/cek-bug.md` |
| Render deterministik | still frame sama dua kali, byte identik |
