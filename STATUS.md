# STATUS (baca ini dulu, lalu ikuti `WORKFLOW.md`)

## Posisi terakhir (16 Nov 2026)
- **Video #15 (draf storyboard Tahap 2):** "Air PDAM direbus vs galon isi ulang vs galon merek" (VS), `naskah/video-15-air-pdam-rebus-vs-galon.md`, riset `riset/2026-11-16-air-pdam-rebus-vs-galon.md`. Beat galon merek dihapus (jadi video #16). **Naskah ACC 16 Nov; VO ElevenLabs Riri Rida 1 take selesai** (56,6 dtk, flow `Jz54PYCD0D5rHTinLwWx`, `remotion/public/v15/vo.mp3`, timestamp `align_teks.py` → `words.json`). Caption `caption/video-15-air-pdam-rebus-vs-isi-ulang.md`. Berikutnya: Tahap 4 animasi (salin `remotion/src/v14/`, TANPA Ornament), contact sheet untuk ACC. Sisa cek: salinan Permenkes 2/2023 bertanda tangan, kalimat inferensi titik uji. Topik pajak jual rumah dihentikan user; riset tetap di `riset/2026-11-16-pajak-jual-rumah.md`.
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
- **Tanpa ornamen tegel hitam-putih di sudut kanan atas dan kiri bawah (yang user sebut "kipas"; komponen `Ornament` di `remotion/src/aset/Gabung.tsx`, dipakai v08–v14)** (user 16 Nov, berlaku untuk video #15 dan seterusnya). Video baru menyalin v14 tanpa `<Ornament .../>`; jangan pakai `Cutout kind="tegel"`.
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
