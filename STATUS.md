# STATUS (baca ini dulu, lalu ikuti `WORKFLOW.md`)

## Posisi terakhir (9 Nov 2026)
- **Video #1–#9 selesai** (MP4 + SRT di `video/`, cover di `cover/`, caption di `caption/`). Terbaru: #8 "Bunyi Tek di Atap Bukan Hantu" (Bukan Hantu #01), #9 "Rumah Tusuk Sate Bukan Bawa Sial" (seri baru Bukan Sial #01, video pertama dengan skill `sutradara`).
- Jadwal posting lama: #3 meteran kWh Sen 9 Nov 19.00 WIB, #4 keramik Rab 11 Nov 19.00 WIB.
- **Video #10 selesai (11 Nov):** "Anak Tangga Harus Ganjil?" (Bukan Sial #02), naskah dari user, 77,2 dtk, -14 LUFS, gaya diorama kertas halus (`remotion/src/v10/`). MP4+SRT `video/video-10-anak-tangga-ganjil.*`, cover, caption. Render per bagian: `tools/produksi.sh bagian NN slug`.
- Revisi kecil tertunda (opsional): #5 noda garam setinggi lutut samar; label "Kayak tisu" sedikit menimpa bata.
- Branding baru (10 Nov): logo `branding/logo-fakta-rumah.png` + bio 41 karakter di `branding/bio.md`, seragam 3 platform (nama sementara "Fakta Rumah"). Belum diputuskan: nama channel/handle, realisme objek 3D.

## Preferensi user
- **Gaya animasi baku = video #7 & #8** (`remotion/src/v07/`, `remotion/src/v08/`): disukai user, sudah sesuai. Video baru menyalin gaya ini; tweak hanya bila user minta.
- **Satu chat = satu repo.** Repo lain → chat baru.
- **Setiap video selesai: PR ke `main` lalu Claude langsung merge sendiri (izin user 9 Nov).** User bukan programmer; laporan cukup "sudah masuk main".
- **Durasi fleksibel, naik bertahap ke video panjang** (11 Nov); naskah dari user dipakai apa adanya.
- Bahasa naskah **sederhana, tanpa istilah teknis**. Bahasa Indonesia; suka saran "out of the box".
- VO tidak diolah (tanpa potong jeda/tempo); animasi mengikuti VO.
- Visual **kontras/tegas**, objek halus membulat. Posisi subtitle (top 1400) sudah ACC, jangan diubah.
- Selalu caption + cover setelah video. Caption & komentar pertama berbahasa manusia (`caption/gaya-caption.md`), tanpa gaya AI.
- Riset cukup di Facebook, output ringkas.

## Lingkungan
- `elevenlabsusercontent.com` diizinkan; huggingface diblokir. ElevenLabs: pakai koneksi `ElevenLabs-3f8d1d88` (akun upgrade).
- ScrapeMedsos ±14 kredit (prabayar, tidak kedaluwarsa).
- Render penuh ±20 mnt (swangle, concurrency 4). Efek 2D berat sudah dipanggang ke PNG (`remotion/public/aset/`).

## Log (5 terakhir; lebih lama lihat `git log`)
- 11 Nov: workflow hemat: suara dicampur `tools/mix-audio.mjs` (3 dtk, dulu render frame ±menit + sering timeout), bayangan 1024, render per bagian (`produksi.sh bagian`) jadi cara baku, still 4–6 frame.
- 11 Nov: video #10 selesai. Gaya baru: satu kanvas 3D, kamera terbang mulus antar-adegan, bayangan lembut, lipatan lentur. Render per bagian 15 dtk + audio terpisah (timeout 120 dtk wajib, audio sempat gagal di 28 dtk).
- 10 Nov: mulai upload ke YouTube Shorts. Paket judul+deskripsi #1–#9 di `caption/youtube-shorts-semua.md`; video+cover dikirim ke user. Thumbnail Shorts hanya bisa dipasang lewat aplikasi HP. Opsi menyisipkan cover ±0,3 dtk di awal video ditawarkan, belum dibuat.
- 9 Nov: video #9 selesai (46,4 dtk, -14 LUFS, render ±30 mnt). Kamera 6 jenis (chase cam mobil + rem = momen khas). Bug baru dicatat: papan menembus atap.
- 9 Nov: skill `sutradara` (dari repo Motion-videos: DIRECTOR lemo-opuscar, LottieFiles, motion-lab) + `tools/cek-sutradara.mjs`; DNA #7–#8 dikunci. Baseline: #07 kamera 6 jenis, #08 hanya 3 (push) → #9 wajib pull/crane/dive.
- 9 Nov: skill `remotion-fitur` + paket `@remotion/transitions`, `motion-blur`, `effects` dipasang (siap dipakai mulai video #9; belum dicoba di video).
- 9 Nov: workflow disederhanakan (`WORKFLOW.md` + `tools/produksi.sh`); STATUS diringkas.
- 9 Nov: video #8 selesai; daftar cek bug `style/cek-bug.md` dibuat (bug pelana menembus atap, dll.).
- 10 Nov: caption TikTok santai #1–#9: artifact https://claude.ai/artifact/JQDzoS6HFpjuFCFDAGk7b2, salinan `caption/tiktok-semua.md`.
