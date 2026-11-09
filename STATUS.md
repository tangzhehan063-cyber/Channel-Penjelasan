# STATUS (baca ini dulu, lalu ikuti `WORKFLOW.md`)

## Posisi terakhir (9 Nov 2026)
- **Video #1–#8 selesai** (MP4 + SRT di `video/`, cover di `cover/`, caption di `caption/`). Terbaru: #7 "Baja Ringan vs Kayu" (Bongkar Barang #01), #8 "Bunyi Tek di Atap Bukan Hantu" (Bukan Hantu #01, untuk Facebook).
- Jadwal posting lama: #3 meteran kWh Sen 9 Nov 19.00 WIB, #4 keramik Rab 11 Nov 19.00 WIB.
- **Video berikutnya (#9), ide siap pakai:** Bukan Hantu #02 "Lampu LED Nyala Redup Padahal Saklar Mati" atau "Pintu Kebuka Sendiri"; Bongkar Barang #02 "Pasir di Genteng Metal Itu Bukan Hiasan". Detail di `riset/2026-11-09-ide-video-6.md`, `riset/2026-11-09-ide-seri-barang.md`.
- Revisi kecil tertunda (opsional): #5 noda garam setinggi lutut samar; label "Kayak tisu" sedikit menimpa bata.
- Branding: foto profil `branding/FaktaRumah_PP_teal.png`, bio `branding/bio.md` (nama sementara "Fakta Rumah"). Belum diputuskan: nama channel/handle, realisme objek 3D.

## Preferensi user
- **Gaya animasi baku = video #7 & #8** (`remotion/src/v07/`, `remotion/src/v08/`): disukai user, sudah sesuai. Video baru menyalin gaya ini; tweak hanya bila user minta.
- **Satu chat = satu repo.** Repo lain → chat baru.
- **Setiap video selesai: PR ke `main` → user klik Merge.** (User bukan programmer; jelaskan singkat bila perlu.)
- Bahasa naskah **sederhana, tanpa istilah teknis**. Bahasa Indonesia; suka saran "out of the box".
- VO tidak diolah (tanpa potong jeda/tempo); animasi mengikuti VO.
- Visual **kontras/tegas**, objek halus membulat. Posisi subtitle (top 1400) sudah ACC, jangan diubah.
- Selalu caption + cover setelah video. Caption & komentar pertama berbahasa manusia (`caption/gaya-caption.md`), tanpa gaya AI.
- Riset cukup di Facebook, output ringkas.

## Lingkungan
- `elevenlabsusercontent.com` diizinkan; huggingface diblokir. ElevenLabs: pakai koneksi `ElevenLabs-3f8d1d88` (akun upgrade).
- ScrapeMedsos ±27 kredit (prabayar, tidak kedaluwarsa).
- Render penuh ±20 mnt (swangle, concurrency 4). Efek 2D berat sudah dipanggang ke PNG (`remotion/public/aset/`).

## Log (5 terakhir; lebih lama lihat `git log`)
- 9 Nov: workflow disederhanakan (`WORKFLOW.md` + `tools/produksi.sh`); STATUS diringkas.
- 9 Nov: video #8 selesai; daftar cek bug `style/cek-bug.md` dibuat (bug pelana menembus atap, dll.).
- 9 Nov: cabang video #7 (`claude/inspiring-hawking-d7gijp`) digabung ke cabang kerja.
- 9 Nov: video #7 selesai (render 16 mnt); riset pindah ke Facebook.
- 9 Nov: video #6 selesai + evaluasi render lambat (efek 2D SVG → PNG panggang).
