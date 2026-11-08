# Konten: Semen, fungsinya di bangunan & asal-usulnya (seri fakta rumah #2)

## Konteks
Sama dengan video #1: edukasi umum, orang tua 35+, Bahasa Indonesia santai, CTA follow, style Origami portrait, VO suara Google AI (ElevenLabs penuh waktu itu).
Topik dipilih langsung oleh user, jadi tidak ada riset tren.
Storyboard (artifact): https://claude.ai/artifact/Hz3MzdbCyjqcFXq4YChHM4 (v2: hook tanpa suhu, adegan 7 diganti lompatan waktu)

## Script VO final
1. Tembok rumahmu itu dilem pakai batu yang dibakar.
2. Batu kapur dan tanah liat dibakar di tungku... jadi butiran klinker.
3. Digiling bareng sedikit gipsum, biar nggak cepat keras.
4. Tapi semen bukan beton, cuma lemnya. Tambah air, pasir, kerikil, baru jadi beton.
5. Semen mengeras karena kering? Salah! Ia bereaksi dengan air, membentuk kristal pengikat.
6. Makanya beton harus disiram. Kuatnya diuji di umur dua puluh delapan hari.
7. Mundur seribu sembilan ratus tahun... Romawi sudah pakai kapur dan abu gunung api.
8. Lompat ke tahun seribu delapan ratus dua puluh empat: semen modern lahir di Inggris.
9. Tahun seribu sembilan ratus sepuluh... pabrik semen pertama Asia Tenggara berdiri di Padang.
10. Semen itu lem batu buatan. Follow buat fakta rumah berikutnya!

## Audio
- VO Google AI 47,2 dtk menjadi 42,97 dtk. Jeda dipangkas jadi maksimal 0,4 dtk, dengan fade 12 ms di tiap sambungan supaya tidak ada klik.
- Rantai filter: `highpass 80, afftdn nr=12, adeclick, rubberband tempo 1.06 (formant preserved), deesser i=0.6, EQ +1.5 @180 / -1.5 @350 / -2 @3k, highshelf -3.5 @8k, lowpass 12.5k, acompressor 2.8:1, agate, loudnorm I=-16 LRA=6`
- Final: hanya VO, tanpa efek suara (keputusan user), VO offset 0,3 dtk, durasi 44,6 dtk.
- Sinkronisasi: `TMAP` di explainer.js memetakan waktu video ke waktu storyboard (anchor per frasa VO dari silencedetect). scoreSound memakai `INV` kalau nanti efek suara mau dipakai lagi.

## Caption
**IG Reels**
Tembok rumahmu itu sebenarnya "dilem" pakai batu yang dibakar 🧱🔥
Semen dibuat dari batu kapur + tanah liat yang dibakar ±1.450°C, lalu digiling bareng sedikit gipsum. Fungsinya? Jadi LEM yang mengikat pasir dan kerikil, dan mengerasnya bukan karena kering, tapi karena bereaksi dengan air 💧
Bonus: pabrik semen pertama di Asia Tenggara ada di Padang, berdiri tahun 1910 🇮🇩
Simpan & kirim ke yang lagi bangun rumah 👷‍♂️
#faktaunik #edukasi #semen #bangunrumah #renovasirumah #tipsrumah #sejarahindonesia #sainssehari

**TikTok**
Semen itu lem dari batu yang dibakar 🔥🧱 Dan pabrik pertamanya di Asia Tenggara ada di Padang! #faktaunik #edukasi #semen #bangunrumah #sejarah #fyp

**YouTube Shorts**
Judul: Semen Itu Ternyata Batu yang Dibakar! 🔥 (alternatif: "Kenapa Beton Harus Disiram? Ini Rahasia Semen" / "Pabrik Semen Pertama Asia Tenggara Ada di Indonesia!")
Deskripsi: Dari tungku 1.450°C sampai kristal pengikat. Plus perjalanan semen dari Romawi, 1824 di Inggris, hingga Indarung, Padang (1910). Sumber: Wikipedia (Portland cement, Joseph Aspdin), Semen Padang/UNESCO MOWCAP, literatur hidrasi semen. #Shorts #faktaunik #semen #bangunrumah #edukasi

## Jam posting (WIB)
Utama pukul 19.00–20.00, alternatif 11.30–12.30. Beri jeda 1–2 hari setelah video bata supaya seri terasa rutin.

## Sumber fakta
- https://en.wikipedia.org/wiki/Portland_cement dan https://en.wikipedia.org/wiki/Joseph_Aspdin (paten 21 Okt 1824, nama dari batu Portland)
- https://industri.kontan.co.id/news/semen-indonesia-dorong-arsip-pabrik-indarung-i-jadi-memory-of-the-world-mow?page=all (Indarung I, 1910, pertama di Asia Tenggara, UNESCO MOWCAP 2024)
- https://www.goodnewsfromindonesia.id/2015/04/20/semen-padang-sejarah-perjalanan-pabrik-semen-tertua-di-indonesia (18 Maret 1910, NV NIPCM)
- https://www.mc-bauchemie.com/mcpedia/cement-hydration (hidrasi, C-S-H, gipsum memperlambat pengikatan)
- https://historycrunch.com/concrete-in-ancient-rome/ (kapur + pozzolana, Pantheon)
