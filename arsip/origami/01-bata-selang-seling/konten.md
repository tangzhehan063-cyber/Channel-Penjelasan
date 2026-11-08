# Konten: Kenapa Bata Disusun Selang-seling?

## Riset tren (Tahap 1, TikTok ID, 31 Okt–7 Nov 2026)
| # | Topik | Contoh | Metrik |
|---|---|---|---|
| 1 | Kipas angin paling berdebu | tiktok.com/@sinyal.fakta/video/7704515445927316756 | 864 rb views, 13,5 rb share |
| 2 | Pantai utara tenang vs selatan ganas | tiktok.com/@sejengkalpeta/video/7705079028721405205 | 659 rb |
| 3 | Smartwatch & skor tidur | tiktok.com/@harinesia/video/7704893261764136199 | 507 rb |
| 4 | **Bata selang-seling (DIPILIH)** | tiktok.com/@howcomeid/video/7703818507594566919 | 573 rb |
| 5 | Kucing minum air toilet | tiktok.com/@dialogshorts/video/7704530715064421684 | 1,66 jt, 26,8 rb share |
Catatan: hasil IG Reels dan YT Shorts dari Scrape Creators tipis pada minggu ini. Akun @howcomeid ("Kenapa X?" sains sehari-hari) dapat 2–4,5 jt views per video.

## Storyboard
Artifact: https://claude.ai/artifact/SgGvVuHXnEmjRt5ghASihc (draft timing 38 dtk; final di-retime ke VO 44 dtk)

## Script VO final (91 kata)
1. Kenapa tukang nggak pernah nyusun bata lurus-lurus?
2. Coba tumpuk lurus. Sambungannya jadi satu garis, dari atas sampai bawah.
3. Kasih beban... yang nahan cuma satu kolom. Kalau retak, langsung ikut garis itu.
4. Kalau selang-seling, tiap bata ditopang dua bata di bawahnya. Bebannya menyebar ke kanan-kiri, kayak piramida.
5. Menurut uji, didorong angin dari depan... tembok tumpuk lurus cuma sekitar tiga puluh persen sekuat tembok selang-seling.
6. Retaknya nggak bisa lari lurus. Harus belok di tiap bata, jadi susah merambat.
7. Jadi, selang-seling itu bukan cuma biar rapi... biar bebannya dibagi.
8. Follow, buat fakta rumah berikutnya!

## Suara
- Pilihan ElevenLabs: Genesius (2lcxSPWqG78QhJnKPyMX), pria paruh baya santai. Opsi lain: Sikedewi (yLyL4E4r0QfLyYpCwPir), Ghaisan (vLsH4ENK3zGpAuW1lSh4).
- Flow ElevenLabs "VO Bata Selang-seling": r6bRCRJC9I7H8hqBvCEU. Generate gratis waktu itu sedang penuh, jadi user membuat VO di Google AI.
- Proses audio dari VO Google AI (48,8 dtk menjadi 42,3 dtk):
  1. Pangkas jeda > 0,4 dtk (silencedetect -35 dB, d = 0,18).
  2. `rubberband=tempo=1.08:transients=smooth:detector=soft:phase=laminar:window=long:smoothing=on:formant=preserved:pitchq=quality`
  3. `highpass=75, deesser=i=0.45:m=0.5:f=0.5, equalizer=220Hz +1.5, equalizer=3200Hz -2.5, highshelf=8500Hz -3, acompressor ratio 2.2, loudnorm I=-16:TP=-1.5:LRA=8`
- Mix: VO adelay 300 ms + sfx (SOUND.renderOffline mode voiceover) dengan lowpass 6500 Hz dan volume 0,55, lalu alimiter 0,95.

## Caption
**IG Reels**
Pernah perhatiin? Tukang nggak pernah nyusun bata lurus-lurus 🧱
Ternyata bukan biar rapi aja. Kalau sambungannya segaris, beban cuma ditahan satu kolom, dan retak bisa "lari" lurus dari atas ke bawah. Kalau selang-seling, beban dibagi ke bata di bawahnya.
Simpan buat referensi pas renovasi rumah, dan kirim ke yang lagi bangun rumah 👷‍♂️
*Angka ±30%: uji NCMA pada dinding tanpa tulangan yang didorong dari samping.
#faktaunik #edukasi #renovasirumah #bangunrumah #tukangbangunan #tipsrumah #sipil #ilmupengetahuan

**TikTok**
Tukang nggak pernah nyusun bata lurus. Ini alasannya 🧱👇 #faktaunik #edukasi #sains #bangunrumah #renovasirumah #tipsrumah #fyp

**YouTube Shorts**
Judul: Kenapa Bata Nggak Pernah Disusun Lurus? 🧱 (alternatif: "Rahasia Tukang: Bata Harus Selang-seling, Ini Alasannya" / "Tembok Bata Lurus Cuma 30% Kekuatannya?! Ini Penjelasannya")
Deskripsi: Kenapa bata disusun selang-seling? Karena beban jadi dibagi ke bata di bawahnya, dan retak nggak bisa merambat lurus. Sumber: NCMA TEK 14-6, Frick (2001). #Shorts #faktaunik #bangunrumah #tekniksipil #edukasi

## Jam posting (WIB)
Audiens 35+: utama pukul 19.00–20.00. Alternatif pukul 11.30–12.30. Upload di tiap platform dengan jeda ±1 jam. Sumber: romisaputra.com (blog, 2026); cek ulang lewat analytics akun sendiri.

## Sumber fakta
- https://www.cmha.org/resource/tek-14-06/ (stack bond: beban ditahan 1 kolom; kekuatan saat membentang horizontal ±30% dari running bond)
- https://www.canadamasonrydesigncentre.com/research/behaviour-of-stack-bonded-masonry-under-concentrated-compression-loading/ (penyebaran beban 45°, AS3700)
- https://arsitektur.studentjournal.ub.ac.id/index.php/jma/article/view/41/42 (siar tegak tidak boleh segaris, Frick 2001)
