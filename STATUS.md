# STATUS & log kerja (baca ini dulu di sesi baru)

## Posisi terakhir (8 Nov 2026)
- **Aset video #1–#4 masuk repo** (8 Nov, sore): MP4 final + SRT di `video/`, caption di `caption/`, cover (frame hook) di `cover/`, sumber engine kertas origami + VO asli di `arsip/origami/`. Jadwal posting: #3 meteran kWh Senin 9 Nov 19.00 WIB, #4 keramik Rabu 11 Nov 19.00 WIB.
- **Branding** (8 Nov): foto profil rumah kertas + bohlam (`branding/FaktaRumah_PP_teal.png` rekomendasi, `..._mustard.png`) + bio IG/TikTok/YT di `branding/bio.md` (nama sementara "Fakta Rumah").
- Video #1–#4 (bata, semen, meteran kWh, keramik): naskahnya jadi referensi di `referensi/`; kolom visual sudah ditulis ulang ke gaya editorial 3D + aset (gaya lama dihapus total, 8 Nov).
- **Kit aset tambahan** (8 Nov): `style/aset.md` + `remotion/src/aset/` (bayangan teralis, siluet tegel/daun, kotak teks TikTok, judul dua tingkat, sinar, layar koral pemutus pola, grid teka-teki, grain). Dari 4 referensi user di `style/referensi-visual/`. Claude membuat aset sendiri dari screenshot referensi.
- Gaya visual sudah diganti ke **editorial 3D bersih** (`style/style.md`, contoh `style/contoh-frame.png`).
- **Video #5 "Tembokmu Minum Air dari Tanah"**: Tahap 1 selesai; **Tahap 2 storyboard draft selesai** di `naskah/video-05-tembok-minum-air.md`. **Naskah ACC final** (8 Nov). Caption + komentar pertama SELESAI di `caption/video-05-tembok-minum-air.md`. Tahap 3 suara SELESAI: Riri Rida (eleven_v4), 45,9 dtk, `remotion/public/v05/vo.mp3` + timestamp `remotion/public/v05/words.json` (ElevenLabs flow 2GY0rXzG7PVOaAnGzjCC). Tahap 4–5 SELESAI: komposisi `Video05` (`remotion/src/v05/`), render final `video/video-05-tembok-minum-air.mp4` (47 dtk, 1080×1920, audio −14 LUFS), cover `cover/video-05-tembok-minum-air.png` (komposisi `Cover05`). SFX/ambient disintesis `tools/make_sfx.py`. Caption sudah ada di `caption/`. Berikutnya: user review video → revisi bila perlu → posting; lalu Tahap 1 video #6.
- Belum diputuskan: nama channel/handle, voice: Riri Rida dipilih user untuk video #5, realisme objek 3D (prosedural vs model CC0/public domain).

- **Video #6 Tahap 1** (9 Nov): 10 ide + riset tren di `riset/2026-11-09-ide-video-6.md`; rekomendasi "Bunyi 'Tek!' di Atap Tengah Malam Bukan Hantu" (calon mini-seri "Bukan Hantu"). Dipilih: "Lantai Rumahmu Sengaja Dibuat Miring". **Naskah ACC final** (`naskah/video-06-lantai-miring.md`, istilah "nat" diganti "sela-sela keramik", semua klaim bersumber). Caption + komentar pertama di `caption/video-06-lantai-miring.md` (tanpa scrape, keputusan user). Tahap 3: VO Riri Rida eleven_v4 **55,1 dtk** di `remotion/public/v06/vo.mp3` (flow ElevenLabs Tbl0UbYD8RZVPmFoEEKp, node AvT03lHlAVcmUCbfyrzl). Timestamp `remotion/public/v06/words.json`. Animasi `Video06` (`remotion/src/v06/`). **SELESAI 9 Nov:** `video/video-06-lantai-miring.mp4` (56,2 dtk, −14 LUFS) + `.srt`, cover `cover/video-06-lantai-miring.png` (`Cover06`), caption `caption/video-06-lantai-miring.md`. Render ±100 mnt (4 bagian, audio dirakit ffmpeg). ScrapeMedsos ±48 kredit.

- **Sub-seri barang/produk "Bongkar Barang"** (9 Nov): user tanya bisa video soal barang seperti semen → bisa. Riset tren + format 5 bagian + 10 ide di `riset/2026-11-09-ide-seri-barang.md`; rekomendasi "Pasir di Genteng Metal Itu Bukan Hiasan", wildcard "Bata yang Bisa Ngapung". Dipilih user: **Baja Ringan vs Kayu** (video #7 = Bongkar Barang #01). **Tahap 2 storyboard DRAFT** di `naskah/video-07-baja-ringan-vs-kayu.md` (±107 kata, ±46 dtk, semua klaim bersumber). **Naskah ACC final** (9 Nov). Caption + komentar pertama di `caption/video-07-baja-ringan-vs-kayu.md` (riset komentar TikTok: penonton curiga ke penjual → posisi netral). Tahap 3: 2 take VO Riri Rida eleven_v4 di `remotion/public/v07/take1.mp3` (50,5 dtk) & `take2.mp3` (51,0 dtk), flow ElevenLabs 597IMPSQjZbuZc6ty9IC node Kbz1elRQfXr1CbWPOU5V. **Dipilih take 2** → `remotion/public/v07/vo.mp3` (51,0 dtk) + timestamp `words.json` (Scribe). Tahap 4: draft animasi `Video07` (`remotion/src/v07/`: `Atap.tsx` profil C/balok kayu/rayap/timbangan prosedural, 10 beat, durasi 52,4 dtk). Still review `style/contoh-frame-v07-review.png`. Still ACC. **SELESAI 9 Nov:** `video/video-07-baja-ringan-vs-kayu.mp4` (52,4 dtk, −14 LUFS) + `.srt`, cover `cover/video-07-baja-ringan-vs-kayu.png` (`Cover07`), caption `caption/video-07-baja-ringan-vs-kayu.md`. Render penuh ±16 mnt (satu kali, concurrency 4). Berikutnya: user review/posting; ide lanjutan Bongkar Barang: genteng metal pasir, bata ringan ngapung, "baja ringan gampang terbang?" (dari komentar). ScrapeMedsos sisa ±38 kredit.

- **Video #8 "Bunyi 'Tek!' di Atap Tengah Malam Bukan Hantu"** (mini-seri "Bukan Hantu" #01, untuk Facebook; 9 Nov): topik dari rekomendasi riset #6, tanpa scrape (keputusan user). **Tahap 2 storyboard DRAFT** di `naskah/video-08-bunyi-tek-atap.md` (±107 kata, ±47 dtk, semua klaim bersumber). **MENUNGGU ACC naskah.**
- Catatan 9 Nov: cabang `claude/inspiring-hawking-d7gijp` (video #7) belum di-merge ke `main`; sudah digabung ke `claude/epic-pasteur-j87tc4`. Di awal sesi: cek cabang `claude/*` yang belum masuk.

## Sesi berikutnya (mulai dari sini)
0. **Evaluasi video #6** di `riset/2026-11-09-evaluasi-video-6.md`: render lambat karena efek 2D SVG (kertas kusut/grain/bayangan ornamen ±85–90% waktu), bukan 3D. **Sudah diterapkan:** `PaperPlus`/`Grain`/`Ornament` pakai PNG panggang (`remotion/public/aset/`), uji 40 frame 182→49 dtk, perkiraan render penuh ±25 mnt. Untuk video #7: VO ≤105 kata (Riri ±2,3 kata/dtk); hindari istilah tukang.
1. User review/posting video #5 (`video/`, `cover/`, `caption/`). Revisi kecil yang tertunda (opsional): noda garam setinggi lutut masih samar; label "Kayak tisu" sedikit menimpa bata.
2. **Video #6 memakai gabungan: `naskah/alur-naskah.md` (ScriptForge: Tahap 1–5, 10 ide, rumus 10 beat) + skill `/naskah-viral`** (3 alternatif hook, mode HYBRID, isi berlapis, payoff 1 kalimat, pemicu share, tanda [⚠ CEK]). Mulai dari Tahap 1: 10 ide + riset tren ScrapeMedsos (±59 kredit).
3. Animasi video #6: pakai kit aset `style/aset.md` (TikTokBox, PatternBreak, PuzzleGrid, ShadowCast, Grain) + aturan kontras video #5 (`style/style.md` baris "Kontras", contoh `style/contoh-frame-v05-kontras.png`). Video #5 dibuat sebelum kit aset masuk, jadi belum memakainya.

## Preferensi user
- Suara VO tidak diolah (tanpa potong jeda/tempo/kompresi); animasi & durasi video yang mengikuti VO (diminta user setelah VO video #3 "pecah").
- Objek digambar halus/membulat seperti line-art referensi, bukan kotak kaku.
- Bahasa Indonesia; suka saran "out of the box".
- Visual harus **kontras/tegas**, jangan "saru" (pucat menyatu dengan latar).
- Selalu caption + cover setelah video selesai.
- Tahap ide: selalu riset tren + saran improvisasi topik.
- Setelah ACC naskah final: kirim caption + komentar pertama berbahasa manusia, bukan gaya AI.
- **(9 Nov) Riset channel ini cukup di Facebook; semua output ringkas.** TikTok = channel self-improve (RAKA).

## Lingkungan
- `elevenlabsusercontent.com` diizinkan di environment Default; huggingface diblokir.
- ScrapeMedsos (Scrape Creators): ±27 kredit per 9 Nov; kredit prabayar, **tidak reset bulanan & tidak kedaluwarsa**; habis = beli lagi. Gaya caption tersimpan di `caption/gaya-caption.md`, jadi scrape opsional.
- Kompetitor yang dipantau: @howcomeid (TikTok), niche "kenapa di rumah".

## Log
- 9 Nov 2026: storyboard draft video #8 (Bunyi Tek, Bukan Hantu #01); cabang video #7 digabung.
- 9 Nov 2026: video #7 "Baja Ringan vs Kayu" selesai (sub-seri Bongkar Barang #01); render 16 mnt.
- 9 Nov 2026: riset sub-seri barang/produk (4 kredit ScrapeMedsos).
- 9 Nov 2026: video #6 selesai + evaluasi (render 100 mnt; penyebab diukur).
- 9 Nov 2026: Tahap 1 video #6 (5 kredit ScrapeMedsos).
- 8 Nov 2026: **gaya dipisah jadi dua**: Gaya A editorial 3D (`style/style.md`, `style/aset.md`) dan Gaya B diorama kertas = origami × editorial (`style/diorama-kertas/README.md` + `moodboard.html`; keputusan user: latar krem + meja, pertanyaan hook tetap di atas lalu berganti jadi jawaban). Belum ada kode/still Gaya B; calon gaya video #6.
- 8 Nov 2026: 2 referensi video baru (06 cerita produk, 07 kolase editorial) digabung dengan 05 jadi **sistem gabungan** (`remotion/src/aset/Gabung.tsx`, demo `GabungDemo` → `style/contoh-aset/gabung-demo.mp4`, aturan di `style/aset.md`): semantik warna koral/biru/sage, tipografi mono + serif + Inter, jangkar kicker + pertanyaan. Dipakai mulai video #6.
- 8 Nov 2026 (sore): aset video #1–#4 (MP4, SRT, caption, cover, kode engine origami, VO asli) + branding (foto profil, bio) di-push ke repo.
- 8 Nov 2026: referensi video gerak (05) dipelajari → `remotion/src/aset/Gerak.tsx` (ObjectWord, KineticWords, FocusList, Squiggle, whip) + `GerakDemo` (hook video #5, `style/contoh-aset/gerak-demo.mp4`). Env kini sinkron (still = video); kit aset pakai `Env intensity={0}`, default tetap 1 agar Video05 tidak berubah.
- 8 Nov 2026 (sesi 2, revisi kontras atas permintaan user "terlalu saru"): plester/bata lebih pekat, air biru tegas + garis tepi gelap, outline tinta di objek, lampu lebih kontras; judul/subtitle/label diberi kartu putih kertas. Aturan ini dipakai untuk video berikutnya (lihat style.md).
- 8 Nov 2026 (sesi 2): render final video #5 + cover; loudnorm −14 LUFS via ffmpeg (render Remotion keluar −16,7). Catatan teknis: render 1410 frame ±25 menit di container (swangle, concurrency 4); `remotion still` sesekali hang → kill & ulang.
- 8 Nov 2026 (sesi 2, awal): Video05 draft animasi lengkap 9 beat mengikuti timestamp VO; still dicek, perbaikan framing judul/tisu/penampang.
- 8 Nov 2026: gaya lama dihapus dari semua file; kit aset prosedural + komposisi `AsetDemo` (still dicek, contoh di `style/contoh-aset/`). Video #5 Tahap 4 sebaiknya langsung memakai aset ini.
- 8 Nov 2026: bedah 10 video viral info rumah (`riset/2026-11-08-bedah-10-video-viral.md`) → skill `/naskah-viral` (`.claude/skills/naskah-viral/`) ditambahkan sebagai lapisan di atas alur naskah. ScrapeMedsos tersisa ±59 kredit.
- 8 Nov 2026: repo dibuat; dipindahkan dari repo RAKA (style, alur naskah, referensi #1–#4, riset ide #5, kode Remotion + otak 3D prosedural).
