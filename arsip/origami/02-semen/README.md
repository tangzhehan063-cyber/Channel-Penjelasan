# Video #2 seri fakta rumah: Semen (fungsi & asal-usul)

Style Origami Studio portrait 1080x1920, 30 fps, 44,6 dtk (1.338 frame), H.264 + AAC, hanya VO.
Mesin render dan pipeline sama dengan `../bata-selang-seling/` (build_pages.py, render.py, shot.py, sfx.py dipakai ulang; ubah path /home/claude/<folder>).

## File
- `explainer.js`: scene semen. Prop baru: `rock` (batu low-poly), `tube` (tungku putar/gilingan/cerobong), `pile` (tumpukan bubuk/pasir), `drop` (tetes air), `column` (kolom lipit), `cross2`/`tick2`, `star`, `arrowFlat`. Ada `TMAP`/`INV` untuk retime ke VO tanpa mengubah timeline storyboard.
- `extras.js`: CUES (23 baris subtitle) + scoreSound (efek kertas + whoosh lompatan waktu; tidak dipakai di final karena user memilih tanpa efek).
- `sb_body.html`, `sb_script.js`: sumber halaman storyboard (10 panel). Pakai `../bata-selang-seling/storyboard.css`.
- `Semen.srt`, `konten.md` (script, audio chain, caption, hashtag, judul, jam posting, sumber).
- Storyboard: https://claude.ai/artifact/Hz3MzdbCyjqcFXq4YChHM4

## Pelajaran baru
- Kartu di depan (z > 1.2) bertabrakan dengan subtitle. Taruh kartu depan di z ~0.95–1.0, PCY=780 (scene naik 120 px), subtitle BASE=1530.
- Lompatan waktu: kamera whip ±4 unit dalam 0,5–0,95 dtk, garis kecepatan dari strip kertas, kartu TAHUN mengikuti kamera dan menghitung tahun, flare saat mendarat.
- Suara "lebih rapi": fade 12 ms di setiap potongan jeda, afftdn + adeclick + deesser lebih kuat, agate, loudnorm LRA 6. Kalau efek suara dipakai, duck dengan sidechaincompress.
- User lebih suka hanya VO kalau efek suara terasa ramai. Tanyakan sejak awal untuk video berikutnya.
