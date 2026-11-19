# STATUS (baca ini dulu, lalu ikuti `WORKFLOW.md`)

## Video #22 selesai (18 Nov 2026, malam): "BI Rate Naik Jadi 6%: Cicilan KPR Ikut Naik?" (Hitung Rumah, berita)
- 54,1 dtk, −14,8 LUFS, `remotion/src/v22/`, palet **`terakota`** (user), VO **Gemini TTS Achernar** (2 generasi gratis: 45,4 dtk terlalu pendek, ulang dengan gaya tempo santai 54,1 dtk). Topik dari user: BI Rate naik jadi 6% hari ini; riset `riset/2026-11-18-bi-rate-6-kpr.md` (sumber = berita CNBC/detik/merdeka/liputan6 18 Nov; rilis resmi BI belum dibaca). Klaim [⚠ CEK] diterima user: "promo 3% bisa melompat jadi 13%" (contoh), "hampir dua kali lipat" (simulasi sendiri). Drive #22 `1b_KcWk_lvTX1dIYWzQwTBdRGn1uMo8EY` (cover, info, versi ringan 480p); MP4 penuh + SRT + cover dikirim ke user.
- **Gaya:** objek bergaya #21 (putih kapur, outline, warna peran) di `kit/objek/Kpr21.tsx` (bank, rumah atap terakota, uang biru+merah, gembok, jam bunga, map coklat, kalender) + **kamera isometrik pertama kali dipakai** (`CanvasIso`/`LightsIso` di `kit/stage.tsx`, per adegan `iso: {zoom}` di beats.json; panduan bagian 8 `style/gaya-penjelasan.md`). `cek-sutradara` kini mengukur adegan isometrik dari zoom. Revisi user R1–R4: gaya #21, uang biru-merah, kamera isometrik, map coklat.
- **Aturan hemat token (user 18 Nov, di CLAUDE.md) dipakai pertama kali:** revisi ditampung, ke user hanya 1 still per bagian besar. Gerbang sempat menahan render karena butir template `R1: (tulis revisi…)` belum dicentang; selesaikan butir R di checklist sebelum render.
- Kelemahan #22: objek masih berbentuk kotak (belum sebulat #14), warna sisi kanan gelap karena cahaya satu arah, beat "bunga loncat" kecil di awal.
- Aset luar (model CC0 Kenney: perabot, mobil, rumah, jalan; `style/aset-luar.md`, `tools/ambil-aset.sh`) ikut masuk di PR ini. Tidak dipakai di #22; model Kenney kurang relate Indonesia (rumah suburban), pakai untuk properti pendukung.
- Video berikutnya: #23, cek nomor di `main`.

## Aset luar untuk kit (18 Nov 2026, malam, berlaku untuk video berikutnya)
- User minta cara menggambar objek lebih detail untuk SEMUA benda (alat rumah, struktur bangunan, jalan, benda fungsional). Dibuat: `kit/model.tsx` (`useModels`, `Model3D`, `Siluet`, `Gambar`), `kit/objek/SedanSiluet.tsx`, komposisi `KatalogAset`, aset di `remotion/public/aset-luar/` (Kenney CC0: kota, arena, racing), katalog `style/aset-luar.md`. Jebakan: render kosong bila tanpa `<Gambar>` (lihat katalog). Belum dipakai di video. Paket tambahan (19 Nov: perabot 140, mobil 50, rumah suburban 40, bangunan modular 79, properti jalan 100, alat survival 80, ubin jalan 100) dari repo agregat `series-ai/jam-ready-assets` (CC0 Kenney), lihat `style/aset-luar.md` dan `tools/ambil-aset.sh`. Belum ada kran/pipa U/saklar/MCB/stop kontak/genteng/kunci (lapis 2 atau 3).

## Posisi terakhir (18 Nov 2026, malam): Video #21 selesai
- **Video #21 selesai:** "Cor Garasi Pakai Besi, Kok Masih Retak?" (cara kerja), 63,7 dtk, −14,2 LUFS, `remotion/src/v21/` (beats.json + Video21 + Cover21), palet **`batu`** (user "oke"), dirakit dari kit `<Penjelasan>` dengan objek baru `kit/objek/Pelat.tsx`, `Kendaraan.tsx` (motor kuning-jingga, mobil biru), `Retak.tsx` (retak bergerigi). VO **Gemini TTS Achernar** (ElevenLabs gagal: kredit 673/844, flow `bcxCKSLbvpSoOkBklKLC`, 0 terpakai); durasi 63,7 di atas 50–60 diterima user. Drive #21 `1dDMejml7sLOXX5L-T-g8dSHqOefoO2s1` (cover, info, versi ringan 480p); MP4 penuh + SRT + cover dikirim ke user.
- **Revisi user (R1–R4, semua selesai):** kendaraan di atas beton, bentuk motor/mobil diperbaiki, warna dibedakan, retak bergerigi ala retak tembok. Moodboard di-ACC (`referensi/moodboard/v21-moodboard.jpg`).
- **Klaim [⚠ CEK] diterima apa adanya:** "besi di bagian atas" dan "tanah dipadatkan" (praktik AS, tanpa sumber Indonesia). Tebal pelat dan ukuran besi sengaja tidak disebut.
- **Perbaikan kit saat #21:** subtitle tidak menyeberang batas kalimat (render pertama dibuang dan diulang), `tools/mix-audio.mjs` dan `cek-sutradara` mendukung `beats.json`. Bug baru di `style/cek-bug.md`.
- **Kelemahan #21:** tanpa beat cepat ≤2,5 dtk; beton putih polos; mobil sederhana dilihat dari depan; gelembung komentar penutup menimpa motor.
- **Pelajaran biaya:** moodboard/sheet berulang paling banyak memakai token; kumpulkan revisi dulu. Render sendiri tidak memakai token.
- Video berikutnya: #22, cek nomor di `main`. Mulai dari `beats.json` kit; objek baru dibuat di `kit/objek/` lalu didaftarkan di `registry.tsx`.

## Kit gaya "Penjelasan" SELESAI (18 Nov 2026, cabang `claude/bold-gates-d1kdbi`; dari rencana sesi RAKA)
- **Langkah 1:** `remotion/src/kit/` (waktu/kamera/proj, stage, primitif, teks, objek stop kontak, template). v20 dipindah memakai kit; **still identik piksel** dengan sebelum refactor.
- **Langkah 2:** template `<Penjelasan data words ekstra>` + `v20/beats.json` + `Video20Data` (komposisi `Video20Data`); 5 still identik dengan `Video20`. Belum diuji dengan video baru (#21 butuh topik + palet dari user, gerbang T1–T3).
- **Langkah 3:** `style/gaya-penjelasan.md` (isi kit, alur, format beats.json, skala objek, kosakata shot, tempo, palet, daftar cek).
- **Langkah 4:** `tools/cek-sutradara.mjs` bagian 9 (judul 2 baris, tumpang-tindih, judul vs gelembung komentar, zona aman stiker, ukuran objek ≥1/3 layar dari `ukuran` di beats.json). Video lama tanpa beats.json hanya dapat SARAN. Efek: `cek-sutradara 20` kini **1 GAGAL** (adegan "tanpa" akhir 44,6 dtk, objek 31% tinggi/56% lebar); ini temuan benar, #20 sudah dirender dan diterima user, tapi render ulang #20 akan terhenti di gerbang ini.
- **Langkah 5:** `referensi/moodboard/` berisi 16 still #8, #14, #19, #20 + README.
- Belum diekstrak ke kit: kasur/AC (v14), lorong pintu (v19), lampu (v15). Tidak ada PR dibuat; menunggu perintah user.
- Video berikutnya: #21, cek nomor di `main`, mulai dari `beats.json` kit.

## Posisi terakhir (18 Nov 2026)
- **Video #20 selesai:** "Kenapa Stop Kontak Mirip Hidung Babi?" (cara kerja bagian rumah: klip ground Schuko), 55,0 dtk, −14,7 LUFS, `remotion/src/v20/`, palet **`madu`** (user pilih). VO ElevenLabs Riri Rida 1 take (flow `a18yToEDaW4diMDMP8p7`); TTS memakai "Syuko" untuk "Schuko" (belum didengar user, cek bagian detik ±17 dan ±38). Timestamp `tools/align_teks.py`. Drive #20 `1LMumppD0iiNKEmpEU-pmFqz0EzoR5Esx` (cover, info, versi ringan 540p); MP4 penuh + SRT + cover dikirim ke user.
- **Alur topik #20 (pelajaran):** "cara kerja seperti biasa" ternyata berarti video CARA KERJA alat/bagian rumah (bukan mitos). Draf mitos "kasur lurus ke pintu" ditunda di `naskah/video-20-kasur-lurus-pintu.*` dan `riset/2026-11-18-kasur-lurus-pintu.md`. Tanyakan arti bila instruksi user ambigu.
- **Kelemahan #20 yang diterima user:** adegan "lari ke tanah" (±33 dtk) objek lebih kecil dan setrika terpotong tepi kiri. Jalur arus (setrika, klip, tanah) = penyederhanaan visual.
- **Bug baru** di `style/cek-bug.md`: kamera terlalu dekat di adegan majemuk, stiker proj() terpotong tepi layar.
- Teknik isometrik (3 aturan) sudah di skill `remotion-fitur`; belum dipakai di video. Perpustakaan referensi: `referensi/moodboard/` (kosong; user tidak menemukan referensi yang cocok, gaya #19 dijadikan patokan).
- Video berikutnya: cek nomor (kemungkinan #21; #18 "rumah hadap barat" dikerjakan sesi lain). Ide cara kerja: sifon pipa U wastafel, rice cooker mati sendiri, kulkas, saklar tangga, kran.

## Posisi sebelumnya (17 Nov 2026, siang)
- **Video #19 selesai:** "Pintu Depan Sejajar Pintu Belakang: Rezeki Lewat?" (Bukan Sial #04), 52,5 dtk, −14,5 LUFS, `remotion/src/v19/`, palet **`mint`** (user ACC rekomendasi). VO ElevenLabs Riri Rida 1 take (flow `KPqcwGVUrgFEA0rp4pee`); timestamp `tools/align_teks.py`. Drive #19 `1rnxaURKj5cWoth1y8_R2U_3fGYD4yyeJ` (cover + info); MP4 + SRT + cover + versi ringan dikirim ke user. Tanpa angka; klaim "maling" dibuang (tanpa sumber). Sumber = artikel populer, bukan kajian akademik.
- **Aturan baru KUNCI KARAKTER** (`CLAUDE.md`, perintah user 17 Nov setelah #16/#17 dinilai sangat jelek): video baru wajib kerangka v08/v14, objek besar satu per adegan, teks ≤2 lapis, sheet berdampingan dengan #8/#14 sebelum ACC; menyimpang = buang dan mulai dari awal. #19 lolos dan di-ACC user ("nah ini mantap").
- **#18 "rumah hadap barat"** dikerjakan sesi lain (cabang `happy-mendel-0268t4`), belum di-merge saat #19 dibuat. Video berikutnya: cek nomor lagi (kemungkinan #20). Ide mitos lanjutan: tiang listrik depan pagar, cermin/tangga di depan pintu, rumah hook (`riset/2026-11-17-ide-video-17-mitos.md`).
- Catatan jujur #19: detail material objek lebih polos dari #8/#14 (kotak putih); bug judul menimpa gelembung komentar ditemukan lewat QC sheet dan diperbaiki sebelum final.

## Posisi sebelumnya (17 Nov 2026, pagi)
- **Video #17 selesai:** "Rumah Lebih Rendah dari Jalan Itu Sial?" (Bukan Sial #03), 53,4 dtk, −14,6 LUFS, `remotion/src/v17/`, palet **`langit`** (pilihan user, pertama non-krem yang dirender penuh). VO ElevenLabs Riri Rida 1 take + 1 kalimat sambungan "selokan" (flow `1rtisfRaRpSMv2jMNDmF`); timestamp `tools/align_teks.py`. Drive #17 `1yYRyM6a8naln4CdyJrqvs2TXa1sbFr_8` (cover, info, versi ringan 540p); MP4 penuh + SRT + cover dikirim ke user.
- **Tata letak (R1–R3 user):** irisan tanah utuh ala #16 → blok isometrik diagonal ala referensi user → **jalan vertikal, mobil dari atas ke bawah, rumah di samping jalan sedikit lebih rendah (±0,4)**, rumah tetangga berjajar, label "Level Jalan/Level Rumah" di hook. Stage 2,5D diputar `ROT` (Video17.tsx).
- **Angka tidak dipakai di video:** peil 20 cm (PP 12/2021), lantai 40–50 cm, biaya Rp10–12 jt belum terverifikasi (sumber diblokir jaringan 17 Nov); isi mitos feng shui dibaca dari cuplikan (ditulis "katanya"). Host jdih.pkp.go.id, detik, kontan, kompas sudah ditambahkan ke environment tapi agen pembaca halaman tetap gagal pada sesi itu.
- **Bug baru** di `style/cek-bug.md`: awan menutupi kicker, z-fighting tanah/rumput, celah tanah, mobil di luar jalan.
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
- **ARAH GAYA CHANNEL (user 19 Nov 2026): "seperti Lesics tapi versi minimalisnya"; TANPA karakter AI.** Lesics = animasi 3D mekanisme yang halus dan jelas (potongan penampang, aliran, bagian bergerak, label bersih) dengan narasi. Versi kita: minimal (satu objek/mekanisme, warna datar, sedikit label) tetapi gerakannya nyata dan terus berjalan. Dilarang karakter, gambar AI, foto realistis. Dasar diagnosis (19 Nov, `ref-analyze.py` dari unclejobs-ai/motion-video-skill): #22 punya 82% frame nyaris diam (meanFlow 0,19) dibanding #21 46% (meanFlow 0,65): #22 terasa slideshow. Repo kajian: iart-ai/motion-skills, Win-Hao/knowledge-video, unclejobs-ai/motion-video-skill (alat ukur + verifikasi), arthurkatcher/explainer-video (musik/SFX dari kode, timeline.json), explainer-video-skills (cerita, isometrik).
- **HEMAT TOKEN (user 18 Nov 2026, aturan lengkap di `CLAUDE.md`):** revisi ditampung semua dulu, baru dikerjakan sekaligus; lalu 1 moodboard akhir + render video; ke user dikirim 1 still per bagian besar (5 bagian framework) sebagai file terpisah, di luar itu gambar hanya bila user minta.
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
