# STATUS & log kerja (baca ini dulu di sesi baru)

## Posisi terakhir (8 Nov 2026)
- Video #1–#4 (bata, semen, meteran kWh, keramik): naskahnya jadi referensi di `referensi/`; kolom visual sudah ditulis ulang ke gaya editorial 3D + aset (gaya lama dihapus total, 8 Nov).
- **Kit aset tambahan** (8 Nov): `style/aset.md` + `remotion/src/aset/` (bayangan teralis, siluet tegel/daun, kotak teks TikTok, judul dua tingkat, sinar, layar koral pemutus pola, grid teka-teki, grain). Dari 4 referensi user di `style/referensi-visual/`. Claude membuat aset sendiri dari screenshot referensi.
- Gaya visual sudah diganti ke **editorial 3D bersih** (`style/style.md`, contoh `style/contoh-frame.png`).
- **Video #5 "Tembokmu Minum Air dari Tanah"**: Tahap 1 selesai; **Tahap 2 storyboard draft selesai** di `naskah/video-05-tembok-minum-air.md`. **Naskah ACC final** (8 Nov). Caption + komentar pertama SELESAI di `caption/video-05-tembok-minum-air.md`. Tahap 3 suara SELESAI: Riri Rida (eleven_v4), 45,9 dtk, `remotion/public/v05/vo.mp3` + timestamp `remotion/public/v05/words.json` (ElevenLabs flow 2GY0rXzG7PVOaAnGzjCC). Tahap 4–5 SELESAI: komposisi `Video05` (`remotion/src/v05/`), render final `video/video-05-tembok-minum-air.mp4` (47 dtk, 1080×1920, audio −14 LUFS), cover `cover/video-05-tembok-minum-air.png` (komposisi `Cover05`). SFX/ambient disintesis `tools/make_sfx.py`. Caption sudah ada di `caption/`. Berikutnya: user review video → revisi bila perlu → posting; lalu Tahap 1 video #6.
- Belum diputuskan: nama channel/handle, voice: Riri Rida dipilih user untuk video #5, realisme objek 3D (prosedural vs model CC0/public domain).

## Sesi berikutnya (mulai dari sini)
1. User review/posting video #5 (`video/`, `cover/`, `caption/`). Revisi kecil yang tertunda (opsional): noda garam setinggi lutut masih samar; label "Kayak tisu" sedikit menimpa bata.
2. **Video #6 memakai gabungan: `naskah/alur-naskah.md` (ScriptForge: Tahap 1–5, 10 ide, rumus 10 beat) + skill `/naskah-viral`** (3 alternatif hook, mode HYBRID, isi berlapis, payoff 1 kalimat, pemicu share, tanda [⚠ CEK]). Mulai dari Tahap 1: 10 ide + riset tren ScrapeMedsos (±59 kredit).
3. Animasi video #6: pakai kit aset `style/aset.md` (TikTokBox, PatternBreak, PuzzleGrid, ShadowCast, Grain) + aturan kontras video #5 (`style/style.md` baris "Kontras", contoh `style/contoh-frame-v05-kontras.png`). Video #5 dibuat sebelum kit aset masuk, jadi belum memakainya.

## Preferensi user
- Bahasa Indonesia; suka saran "out of the box".
- Visual harus **kontras/tegas**, jangan "saru" (pucat menyatu dengan latar).
- Selalu caption + cover setelah video selesai.
- Tahap ide: selalu riset tren + saran improvisasi topik.
- Setelah ACC naskah final: kirim caption + komentar pertama berbahasa manusia (hasil scrape sosmed), bukan gaya AI.

## Lingkungan
- `elevenlabsusercontent.com` diizinkan di environment Default; huggingface diblokir.
- ScrapeMedsos: ±59 kredit per 8 Nov 2026 (siang).
- Kompetitor yang dipantau: @howcomeid (TikTok), niche "kenapa di rumah".

## Log
- 8 Nov 2026: referensi video gerak (05) dipelajari → `remotion/src/aset/Gerak.tsx` (ObjectWord, KineticWords, FocusList, Squiggle, whip) + `GerakDemo` (hook video #5, `style/contoh-aset/gerak-demo.mp4`). Env kini sinkron (still = video); kit aset pakai `Env intensity={0}`, default tetap 1 agar Video05 tidak berubah.
- 8 Nov 2026 (sesi 2, revisi kontras atas permintaan user "terlalu saru"): plester/bata lebih pekat, air biru tegas + garis tepi gelap, outline tinta di objek, lampu lebih kontras; judul/subtitle/label diberi kartu putih kertas. Aturan ini dipakai untuk video berikutnya (lihat style.md).
- 8 Nov 2026 (sesi 2): render final video #5 + cover; loudnorm −14 LUFS via ffmpeg (render Remotion keluar −16,7). Catatan teknis: render 1410 frame ±25 menit di container (swangle, concurrency 4); `remotion still` sesekali hang → kill & ulang.
- 8 Nov 2026 (sesi 2, awal): Video05 draft animasi lengkap 9 beat mengikuti timestamp VO; still dicek, perbaikan framing judul/tisu/penampang.
- 8 Nov 2026: gaya lama dihapus dari semua file; kit aset prosedural + komposisi `AsetDemo` (still dicek, contoh di `style/contoh-aset/`). Video #5 Tahap 4 sebaiknya langsung memakai aset ini.
- 8 Nov 2026: bedah 10 video viral info rumah (`riset/2026-11-08-bedah-10-video-viral.md`) → skill `/naskah-viral` (`.claude/skills/naskah-viral/`) ditambahkan sebagai lapisan di atas alur naskah. ScrapeMedsos tersisa ±59 kredit.
- 8 Nov 2026: repo dibuat; dipindahkan dari repo RAKA (style, alur naskah, referensi #1–#4, riset ide #5, kode Remotion + otak 3D prosedural).
