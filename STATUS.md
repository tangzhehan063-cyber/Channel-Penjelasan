# STATUS (baca ini dulu, lalu ikuti `WORKFLOW.md`)

## Posisi terakhir (17 Nov 2026)
- **Video #17 selesai:** "Rumah Lebih Rendah dari Jalan Itu Sial?" (Bukan Sial #03), 53,4 dtk, −14,6 LUFS, `remotion/src/v17/`, palet **`langit`** (pilihan user, pertama non-krem yang dirender penuh). VO ElevenLabs Riri Rida 1 take + 1 kalimat sambungan "selokan" (flow `1rtisfRaRpSMv2jMNDmF`); timestamp `tools/align_teks.py`. Drive #17 `1yYRyM6a8naln4CdyJrqvs2TXa1sbFr_8` (cover, info, versi ringan 540p); MP4 penuh + SRT + cover dikirim ke user.
- **Tata letak (R1–R3 user):** irisan tanah utuh ala #16 → blok isometrik diagonal ala referensi user → **jalan vertikal, mobil dari atas ke bawah, rumah di samping jalan sedikit lebih rendah (±0,4)**, rumah tetangga berjajar, label "Level Jalan/Level Rumah" di hook. Stage 2,5D diputar `ROT` (Video17.tsx).
- **Angka tidak dipakai di video:** peil 20 cm (PP 12/2021), lantai 40–50 cm, biaya Rp10–12 jt belum terverifikasi (sumber diblokir jaringan 17 Nov); isi mitos feng shui dibaca dari cuplikan (ditulis "katanya"). Host jdih.pkp.go.id, detik, kontan, kompas sudah ditambahkan ke environment tapi agen pembaca halaman tetap gagal pada sesi itu.
- **Bug baru** di `style/cek-bug.md`: awan menutupi kicker, z-fighting tanah/rumput, celah tanah, mobil di luar jalan.
- **Pelajaran dari user (17 Nov, setelah #17 dirilis):** #17 terasa lebih jelek dari #7 dan #13 karena satu diorama dipakai 53 dtk, objek kecil (≈⅓ tinggi layar), tanpa close-up. Video baru: **tiap beat objek hero sendiri yang besar memenuhi bingkai** (seperti #7/#13), diorama lebar hanya untuk pembuka/penutup, jangan perlebar bingkai demi 'semua terlihat'. Peringatkan user bila revisi tata letak membuat objek mengecil/monoton. #17 dipakai apa adanya (user tidak minta v2).
- Video berikutnya: nomor #18. Ide mitos lanjutan di `riset/2026-11-17-ide-video-17-mitos.md` (tiang listrik depan pagar, pintu depan sejajar belakang, rumah hadap barat, rumah hook).

## Posisi sebelumnya (16 Nov 2026)
- **Video #15 selesai (render 14 Nov, nomor dipindah 16 Nov):** "LED Nggak Lebih Terang, Tapi Hemat" (lampu pijar vs LED, lumen vs watt), 67,0 dtk, −14,7 LUFS, `remotion/src/v15/` (palet krem, kamera 2,5D, objek lampu di `Lamp15.tsx`; prop `palet` untuk varian). VO Gemini TTS Achernar, timestamp `tools/align_teks.py`. Dibuat di sesi lain bersamaan dengan #14 "Air AC", jadi nomornya dipindah ke #15. MP4 sudah dikirim ke user; folder Drive berlabel #15.
- **Aturan merge (user 16 Nov):** setiap video selesai → PR ke `main` → Claude langsung merge sendiri (semua channel). Rollback lewat Revert PR.
- **Cek sebelum mulai video:** `git fetch` dan lihat nomor video terakhir di `main` (sesi lain bisa sedang membuat video juga) supaya nomor tidak bentrok.

## Video #16 (16 Nov 2026, malam; nomor #15 dipakai video LED dari sesi lain) · DITUTUP user: dipakai apa adanya, tanpa render ulang
- **Video #16 selesai:** "Air PDAM Direbus vs Galon Isi Ulang" (VS), 56,7 dtk, −14,5 LUFS, `remotion/src/v16/`. VO ElevenLabs Riri Rida 1 take (flow `Jz54PYCD0D5rHTinLwWx`). Tes sutradara 0 GAGAL (otomatis lewat `tools/produksi.sh final|bagian`). Drive #16 `19qBAVWJlgTJzWEYRYnFRF9PA7HmdwbjN` (cover, info, versi ringan 540p); MP4 penuh + SRT + cover dikirim ke user. Versi 720p (3,5 MB) gagal diunggah (batas 3,1 MB per panggilan).
- **Cek isi yang tersisa (diterima user):** angka Permenkes 2/2023 (3 bulan, 10 detik, 1×24 jam) dari PDF berjudul "RANCANGAN"; salinan bertanda tangan belum terbaca. Catatan sumber sudah ada di deskripsi YouTube. Galon merek (SNI) = bahan video #16.
- **Layar menampilkan "#15" (render awal), repo/Drive memakai #16; user menerima tanpa render ulang.** Palet tetap krem; aturan palet wajib dan gerbang tahap (`checklist/`, `tools/gerbang.mjs`) berlaku mulai video berikutnya (#17).
- **Aturan baru:** referensi user = acuan penempatan, bukan render realistis; tanpa ornamen tegel sudut; tes sutradara otomatis sebelum render.

## Catatan teknis (16 Nov 2026)
- **Akses sumber resmi dari container:** `curl -A "Mozilla/5.0"` ke pajak.go.id, setkab.go.id, jdih.kemenkeu.go.id (`/api/download/...`), jdih.kemkes.go.id (`/storage/documents/pdfs/...`), who.int/iris.who.int berhasil; bsn.go.id, peraturan.go.id (reset), peraturan.bpk.go.id (Cloudflare), cdc.gov (Akamai) menolak. `pdftotext -layout` tersedia.

## Posisi sebelumnya (15 Nov 2026)
- **Video #14 selesai (15 Nov):** "Air AC yang Menetes Itu Bukan Bocor" (Bongkar Barang), 60,9 dtk, −14,6 LUFS, `remotion/src/v14/` (kamera 2,5D, kasur ala referensi user: rangka kayu, headboard panel, meja melayang). VO ElevenLabs Riri Rida 1 take (flow `ToIeOERE8lrRsidYIvXS`). Drive #14 `1SoZyehAAFk8QOpTE0U6rpqbJdT9TXR3I` (cover + info); MP4 + versi ringan dikirim ke user. Bug baru di `style/cek-bug.md`.

## Posisi sebelumnya (13 Nov 2026)
- **Video #13 selesai (13 Nov):** "Kaca Pecah Gara-Gara Sound Horeg?", 74,2 dtk, `remotion/src/v13/` (DNA v8–10 + **kamera 2,5D ortografis**). VO **Gemini TTS Achernar**; timestamp `tools/align_teks.py` (tanpa Scribe). Drive #13 `1EGwBQ0K62lfbJA3IkFgcUUd-8VBWd11p` (cover + info); MP4 dikirim ke user untuk diunggah manual.
- **Video #12 selesai (12 Nov)**, lihat Log. Berikutnya: Hitung Rumah #03 "DP 0% Bikin Cicilan Berapa Lama?" atau ide di `riset/`.
- **Video #11 selesai (11 Nov):** "10 Tahun Nyicil, Rumahmu Baru Separuh Lunas" (seri baru Hitung Rumah #01), 74,2 dtk, `remotion/src/v11/`. Properti baru (user minta visual lebih kaya): gedung bank mini, uang kertas berikat (biru = bunga, koral = rumah), amplop, kalender meja, map kontrak. MP4+SRT, cover, caption. Kredit ScrapeMedsos habis (0).
- **Video #1–#9 selesai** (SRT di `video/`, caption di `caption/`; MP4 dan cover ada di Drive/user, tidak di Git). Terbaru: #8 "Bunyi Tek di Atap Bukan Hantu" (Bukan Hantu #01), #9 "Rumah Tusuk Sate Bukan Bawa Sial" (seri baru Bukan Sial #01, video pertama dengan skill `sutradara`).
- Jadwal posting lama: #3 meteran kWh Sen 9 Nov 19.00 WIB, #4 keramik Rab 11 Nov 19.00 WIB.
- **Video #10 selesai (11 Nov):** "Anak Tangga Harus Ganjil?" (Bukan Sial #02), naskah dari user, 77,2 dtk, -14 LUFS, gaya diorama kertas halus (`remotion/src/v10/`). MP4+SRT `video/video-10-anak-tangga-ganjil.*`, cover, caption. Render per bagian: `tools/produksi.sh bagian NN slug`.
- Revisi kecil tertunda (opsional): #5 noda garam setinggi lutut samar; label "Kayak tisu" sedikit menimpa bata.
- Branding baru (10 Nov): logo `branding/logo-fakta-rumah.png` + bio 41 karakter di `branding/bio.md`, seragam 3 platform (nama sementara "Fakta Rumah"). Belum diputuskan: nama channel/handle, realisme objek 3D.

## Preferensi user
- **Referensi dari user = acuan penempatan/komposisi, BUKAN untuk ditiru persis atau dirender realistis** (user 16 Nov, setelah 10+ putaran revisi #15). Terjemahkan ke gaya channel (2,5D prosedural, bentuk membulat, warna datar, outline tipis; contoh benar: kasur #14, jalur PDAM #15). Jangan pakai gambar AI/foto-realistis di video. Bila ragu, tanya satu kali, jangan menebak.
- **Tanpa ornamen tegel hitam-putih di sudut kanan atas dan kiri bawah (yang user sebut "kipas"; komponen `Ornament` di `remotion/src/aset/Gabung.tsx`, dipakai v08–v14)** (user 16 Nov, berlaku untuk video #16 dan seterusnya). Video baru menyalin v14 tanpa `<Ornament .../>`; jangan pakai `Cutout kind="tegel"`.
- **Kontrol lewat Panel Studio** (12 Nov): https://claude.ai/artifact/4Aiv5HDCLRRfVLdEapvt3s. Tombol ACC/revisi/topik mengirim komentar ke Claude; status video & ide disimpan di database panel (lihat WORKFLOW langkah 0.4–0.5). Status posting #1–#12 belum diisi user.
- **Hasil jadi (video render, cover, info/caption) disimpan di Google Drive, bukan GitHub** (user 11 Nov). Folder induk "Fakta Rumah" `1Dx9nqhifWRbixFb_2u4XrHMIaHHJloAt`, satu subfolder per video (#11: `11PIHgG1XQ8QXw9FVGMLQaAJObItaWnSP`). Batas upload konektor dari cloud ±3 MB per panggilan: cover + info bisa, MP4 belum (cara upload MP4 menunggu keputusan user).
- **Gaya animasi baku = video #7 & #8** (`remotion/src/v07/`, `remotion/src/v08/`): disukai user, sudah sesuai. Video baru menyalin gaya ini; tweak hanya bila user minta.
- **Satu chat = satu repo.** Repo lain → chat baru.
- **Setiap video selesai: PR ke `main` lalu Claude langsung merge sendiri (izin user 9 Nov).** User bukan programmer; laporan cukup "sudah masuk main".
- **Durasi Fakta Rumah tetap 50–60 dtk** (keputusan user 12 Nov: fakta yang terlalu panjang membosankan; cerita panjang untuk RAKA/Yesterlife). Naskah dari user dipakai apa adanya.
- Bahasa naskah **sederhana, tanpa istilah teknis**. Bahasa Indonesia; suka saran "out of the box".
- VO tidak diolah (tanpa potong jeda/tempo); animasi mengikuti VO. **VO cukup 1 take** (hemat kredit ElevenLabs, 11 Nov).
- Visual **kontras/tegas**, objek halus membulat. Posisi subtitle (top 1400) sudah ACC, jangan diubah.
- Selalu caption + cover setelah video. Caption & komentar pertama berbahasa manusia (`caption/gaya-caption.md`), tanpa gaya AI.
- **Pindah fokus ke YouTube (11 Nov)**: riset & paket upload utama di YouTube Shorts; output ringkas.
- Ide visual tertunda: variasi warna latar (bukan krem saja) di video berikutnya.
- Render tetap di cloud (keputusan user 13 Nov: laptop kantor, tanpa GPU; opsi Remote Control/Lambda tidak dipakai). Jangan tawarkan lagi.

## Lingkungan
- `elevenlabsusercontent.com` diizinkan; huggingface diblokir. ElevenLabs: pakai koneksi `ElevenLabs-3f8d1d88` (akun upgrade).
- ScrapeMedsos ±14 kredit (prabayar, tidak kedaluwarsa).
- Render penuh ±20 mnt (swangle, concurrency 4). Efek 2D berat sudah dipanggang ke PNG (`remotion/public/aset/`).

## Log (5 terakhir; lebih lama lihat `git log`)
- 13 Nov: keputusan user untuk video #13: **gaya origami lewat Gaya B diorama kertas di Remotion** (bukan mesin canvas lama), efek retak bata (`arsip/origami/01-*/explainer.js`) & keramik pecah (`04-keramik-meledak`) di-port. **Kamera 2,5D** (bukan orbit 3D): sudut tetap, geser/zoom + parallax lapisan, supaya ringan. Tetap three.js (bukan Zdog). VO: tanya Gemini/ElevenLabs. Topik belum dipilih.
- 13 Nov: #13 "Kaca Pecah Gara-Gara Sound Horeg?": riset `riset/2026-11-13-sound-horeg-kaca.md`, naskah ACC (versi humanis, `naskah/video-13-kaca-sound-horeg.md`), caption dibuat. VO **Gemini TTS suara Achernar** (pilihan user; durasi 73,9 dtk boleh lewat batas). Moodboard 6 adegan = komposisi `Mood13` (`remotion/src/v13/`). Selesai (lihat Posisi terakhir). Pelajaran user: adegan jangan monoton satu objek (jangan semua close-up kaca); identitas channel (latar, font, kartu) tetap, yang boleh beda hanya warna objek.
- 12 Nov: **video #12 selesai** "Ngontrak Sejuta vs Nyicil Sejuta" (Hitung Rumah #02, gaya VS #7 di satu kanvas 3D: timbangan 2 rumah, tumpukan uang, jalan ke kantor), 85,2 dtk, `remotion/src/v12/`. Drive #12 `1GnbpbE7vDu6gXvrUVKLyjtKNsbc75mgf` (cover + info); MP4 dikirim ke user untuk diunggah manual. Rumah subsidi Rp166 jt (400 jt bukan subsidi).
- 12 Nov: uji Zdog (3D kanvas 2D, ±6x lebih cepat) **ditolak user: tetap three.js cara biasa**. Jangan tawarkan ganti engine lagi.
- 11 Nov: video #11 KPR selesai. VO cukup 1 take (hemat ElevenLabs). Moodboard = still Remotion dulu sebelum ubah animasi. Bug baru: subtitle angka "koma".
- 11 Nov: platform utama pindah ke YouTube (riset via ScrapeMedsos YouTube). User puas kualitas #10; minta opsi warna latar nanti.
- 11 Nov: workflow hemat: suara dicampur `tools/mix-audio.mjs` (3 dtk, dulu render frame ±menit + sering timeout), bayangan 1024, render per bagian (`produksi.sh bagian`) jadi cara baku, still 4–6 frame.
- 11 Nov: video #10 selesai. Gaya baru: satu kanvas 3D, kamera terbang mulus antar-adegan, bayangan lembut, lipatan lentur. Render per bagian 15 dtk + audio terpisah (timeout 120 dtk wajib, audio sempat gagal di 28 dtk).
- 10 Nov: mulai upload ke YouTube Shorts. Paket judul+deskripsi #1–#9 di `caption/youtube-shorts-semua.md`; video+cover dikirim ke user. Thumbnail Shorts hanya bisa dipasang lewat aplikasi HP. Opsi menyisipkan cover ±0,3 dtk di awal video ditawarkan, belum dibuat.
- 9 Nov: video #9 selesai (46,4 dtk, -14 LUFS, render ±30 mnt). Kamera 6 jenis (chase cam mobil + rem = momen khas). Bug baru dicatat: papan menembus atap.
- 9 Nov: skill `sutradara` (dari repo Motion-videos: DIRECTOR lemo-opuscar, LottieFiles, motion-lab) + `tools/cek-sutradara.mjs`; DNA #7–#8 dikunci. Baseline: #07 kamera 6 jenis, #08 hanya 3 (push) → #9 wajib pull/crane/dive.
- 9 Nov: skill `remotion-fitur` + paket `@remotion/transitions`, `motion-blur`, `effects` dipasang (siap dipakai mulai video #9; belum dicoba di video).
- 9 Nov: workflow disederhanakan (`WORKFLOW.md` + `tools/produksi.sh`); STATUS diringkas.
- 9 Nov: video #8 selesai; daftar cek bug `style/cek-bug.md` dibuat (bug pelana menembus atap, dll.).
- 10 Nov: caption TikTok santai #1–#9: artifact https://claude.ai/artifact/JQDzoS6HFpjuFCFDAGk7b2, salinan `caption/tiktok-semua.md`.
