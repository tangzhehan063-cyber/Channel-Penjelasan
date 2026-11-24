# Kualitas 3D (Three.js, 100% kode)

## Cahaya (putuskan per shot, tulis di `cahaya`)
- Dasar: satu matahari (`directionalLight`, bayangan lembut) + `hemisphereLight` + `fog` tipis. Warna matahari mengikuti cuaca foto bila 3D berdampingan dengan footage.
- Arah matahari konsisten dalam satu urutan (tidak berubah antar shot yang saling terhubung).
- Cutaway/penampang: cahaya depan-samping agar relief tanah terbaca; tambah pencahayaan lokal kecil pada titik fokus (spot hangat) bukan glow.
- Suasana: mendung = difus, kontras rendah; ancaman = rendah, hangat-gelap; penjelasan = terang, jelas.

## Material dan detail
- Pakai `remotion/src/e1/look.tsx` (`useBahan`, `Blok`): relief bump, variasi warna ±3%, tekstur ber-seed. Skala tekstur = ukuran ubin nyata (jangan melar).
- Penampang lapisan: batas tidak lurus sempurna; tambah sedikit variasi/lipatan; kerikil/akar kecil pada tanah dekat.
- Detail dekat (macro) butuh tekstur lebih halus: jangan dolly ke permukaan yang tekstur prosedurnya kasar.
- Air: transparan, bergerak pelan; partikel bukan bola neon: kecil, ber-seed, mengikuti arah fisika.

## Kedalaman dan lensa
- Kabut jauh untuk pemisahan bidang; shot macro boleh latar lebih gelap/redup.
- FOV baku 34°. Untuk kesan lebih intim, dekatkan kamera daripada memperbesar FOV.
- Rack focus tiruan: redupkan bidang lain (opasitas/desaturasi), bukan blur gaussian murahan.

## Skala dan fakta
- 1 satuan = 1 m. Proporsi benda nyata (pintu 0,9×2,1; tembok 0,15–0,22; lantai ditinggikan sesuai angka).
- Simulasi memakai angka bersumber dan konsisten (mis. 10 cm/th → 0,3 m = tahun 3, 1,0 m = tahun 10); tandai "ilustrasi/simulasi" di teks anotasi bila angka tidak diukur.

## Breakdown / potongan (selektif: satu adegan khusus per video)
- Pakai bila ada struktur/lapisan/mekanisme tersembunyi. Bentuk: penampang (clip), exploded view (lapisan dipisah dengan `gap`), atau kamera masuk.
- Labeling: nama saja (maks 2 baris), titik tempel ke lapisan, tidak menutupi subjek. Label muncul ketika kamera/cerita sampai ke lapisan itu, bukan serentak.
- Setiap lapisan satu fungsi dalam cerita; lapisan tanpa fungsi dibuang.

## Anti-bug (wajib; sejarah di `style/cek-bug.md`)
1. **Z-fighting:** tak ada dua permukaan sebidang; tumpuan menancap ≥0,02 m; `shadow-normalBias`. Uji: `python3 tools/cek_kilau.py <Komposisi> --dur N` (probe geser kamera 0,0004 m, ambang 300 px).
2. Objek tembus/clipping saat gerak: periksa still di awal, tengah, akhir tiap shot.
3. Teks/label terpotong tepi layar atau tertutup subjek.
4. Foto/billboard: bidang foto tidak boleh sebidang dengan bidang 3D di belakangnya (offset ≥0,02 m + `depthWrite`), `toneMapped={false}`, tekstur dimuat lewat `staticFile`.
5. Render deterministik: tanpa `Math.random`/`Date`/`useFrame`; `nudge` prop untuk cek_kilau.
6. Biaya render: swangle ±10 mnt per ±58 dtk; periksa lewat still dan rentang `--frames` dulu.

## Batas jujur
Three.js tanpa path tracing tidak akan menyamai foto. Tujuan: ilustrasi yang meyakinkan dan jelas, dilihat berdampingan dengan foto tanpa terasa mainan. Bila terlihat mainan: tambahkan material/detail/cahaya sebelum menambah gerak; bila masih terlihat mainan, pakai gaya diagram (2D bersih) alih-alih meniru realisme.
