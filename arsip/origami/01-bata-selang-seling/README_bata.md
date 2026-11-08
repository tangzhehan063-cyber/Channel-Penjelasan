# Video Explainer: Kenapa Bata Disusun Selang-seling?

Style Origami Studio (Paper & Craft), dipindahkan ke portrait 1080x1920, 30 fps, 44 detik (1.320 frame), H.264 + AAC.
Audiens: orang tua 35+, Bahasa Indonesia santai, tujuan edukasi + CTA follow.

## File di folder ini
- `explainer.js`: seluruh animasi 3D kertas. `EXPLAIN(ctx, W, H, t)` menggambar satu frame dan timeline-nya sudah disinkronkan ke VO.
- `extras.js`: `CUES` (subtitle; VO mulai di t = 0,3 dtk), `drawSubs` (subtitle burn-in), dan `scoreSound` (efek suara kertas, mode voiceover).
- `build_pages.py`: membuat ulang `frame.html` (halaman render) dan `storyboard.html`. Pemakaian: `python3 build_pages.py ../styles/origami-studio-prompt_part1_libs.txt`. Font Space Grotesk/Mono diambil lewat `npm pack @fontsource/...`.
- `render.py`: `python3 render.py <frame_awal> <frame_akhir> out.mp4`. Jalankan 4 proses paralel (masing-masing 330 frame), lalu gabungkan dengan concat.
- `sfx.py`: merender `scoreSound` ke `audio/sfx.wav` lewat `SOUND.renderOffline` (mode voiceover).
- `shot.py`: screenshot keyframe untuk cek visual, contoh `python3 shot.py 2,10.6,26.9 v`.
- `sb_body.html`, `sb_script.js`, `storyboard.css`: sumber halaman storyboard. Waktu keyframe di sini masih memakai timing draft 38 detik.
- `Bata_Selang-seling.srt`: subtitle final (22 baris).
- `konten.md`: riset tren, script VO, voice ID, perintah proses audio, caption + hashtag per platform, judul Shorts, jam posting, sumber fakta.
- Storyboard (artifact): https://claude.ai/artifact/SgGvVuHXnEmjRt5ghASihc
- `../styles/origami-studio-prompt_part1_libs.txt`: prompt style Origami Studio (instruksi + library H + SOUND kit, tidak diubah). Bagian kode referensi aslinya (crane, brain, rocket) hanya ada di file upload asli user.

## Tidak tersimpan di sini (file biner)
VO dari Google AI (aslinya 48,8 dtk, dirapikan jadi 42,3 dtk), sfx.wav, MP4 final (`Bata_Selang-seling_FINAL_1080x1920.mp4`, 33 MB), dan preview.

## Mix final
`[VO adelay 300ms] + [sfx lowpass 6500 Hz, volume 0,55] -> amix -> alimiter 0,95`, AAC 192k, sekitar -16 LUFS.
Encode final: libx264 preset slow, CRF 21, High profile, yuv420p, faststart.

## Riwayat
- Riset tren (TikTok, 31 Okt–7 Nov 2026): topik dari @howcomeid (573 rb views).
- v1 preview: tempo VO dipercepat dengan atempo.
- v2 (final): VO memakai rubberband + de-esser + EQ hangat, efek suara dibuat lebih lembut.

## Fakta yang dipakai
- Siar tegak tidak boleh segaris (Frick 2001, via jurnal Arsitektur UB).
- Beban menyebar ±45° pada pasangan selang-seling (AS3700). Pada tumpuk lurus, beban hanya ditahan satu kolom (NCMA TEK 14-6).
- ±30%: kekuatan lentur dinding tumpuk lurus tanpa tulangan yang membentang horizontal dibanding selang-seling (NCMA TEK 14-6). Untuk kuat tekan, keduanya kurang lebih sama.

## Pelajaran teknis (untuk video berikutnya)
- Portrait: kamera F=1560, PCY=900. Papan judul berupa tent card tinggi di belakang objek supaya headline ada di atas layar, sementara subtitle di y 1380–1470 (di dalam safe zone).
- Painter's sort: lapisan backing besar (mortar) perlu `bias` +0,6 supaya tidak menutupi bata di depannya.
- Kartu di depan pada shot lebar jangan menempel ke tepi frame. CTA dibuat dengan me-refold kartu takeaway di posisi yang sama supaya tidak bertabrakan dengan subtitle.
