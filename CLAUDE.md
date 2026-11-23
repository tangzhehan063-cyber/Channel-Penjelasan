# Channel Penjelasan: aturan kerja untuk Claude

Channel pengetahuan, seri utama **"fakta rumah"**, Bahasa Indonesia santai, audiens 35+.
(Channel stickman self-improvement ada di repo terpisah `RAKA`; jangan campur gaya.)

## ARAH AKTIF: EKSPERIMEN E1 (semi-realistis AI), menang atas semua aturan lama di bawah
- **Alur kerja video baru = `WORKFLOW.md` (E1 Visual Experiment Workflow).** Workflow 3D diorama lama ada di `arsip/WORKFLOW-3d-diorama-lama.md`.
- **Penulisan script:** skill `script-writer` (otomatis dipanggil saat menulis, mengembangkan, menganalisis, atau merevisi script) + `prompts/ScriptForge.md` (3 langkah: ide, riset & angle, script). Target **47–50 dtk, ±100–125 kata**, struktur mengikuti video #9. Skill lama `naskah-viral` diarsipkan di `arsip/skills/`.
- **Visual E1 (diperbarui 23 Nov 2026): 100% dari kode.** Semi-realistic architectural visualization dibangun dengan Remotion + Three.js + React/TS + CSS/SVG + JS/TS prosedural; **dilarang** API AI eksternal untuk gambar/video/model 3D/tekstur (AI hanya asisten penulis kode). Wajib `node tools/cek-mandiri.mjs` sebelum render. Panduan: `style/e1-visual-kode.md`; audit: `e1/AUDIT-ketergantungan-api.md`. Bukan gaya diorama kertas datar (kontrol); Remotion kini dipakai untuk visual DAN penyusunan/teks.
- **Persetujuan wajib (pemilik channel)** sebelum: memilih topik final, finalisasi script, style reference, render batch besar, memakai aset lokal eksternal baru, publish/upload publik, dan **merge ke `main`**. Tanpa approval = tanpa generasi skala besar. **Claude TIDAK merge sendiri** (aturan "PR ke main, Claude merge sendiri" dicabut untuk E1). PR hanya dibuat bila user minta.
- **Pilot dulu:** 1 adegan 3D + 1 klip render ±5 dtk sebelum produksi 3 video; lapor waktu render, hasil `cek-mandiri`/`cek-sutradara`, risiko sebelum render penuh.
- **Tetap berlaku dari aturan lama:** fakta akurat dan bersumber (tandai `[CEK]`), humanizer untuk semua teks publik, CTA "Follow buat fakta rumah berikutnya!", hemat ElevenLabs, caption/komentar pin, penyimpanan hasil di Google Drive (struktur `Fakta Rumah / E1 / #NN - Judul Video`), VO tanya pilihan TTS (Gemini atau ElevenLabs) ke user.
- **Status alat lama (diaudit 23 Nov):** `tools/produksi.sh`, `tools/gerbang.mjs`, `checklist/`, skill `sutradara`, `remotion-fitur`, dan `naskah/alur-naskah.md` = alat pipeline 3D/Remotion; **tidak dipanggil oleh alur E1**, tetap berfungsi dan sengaja tidak diubah. Prinsip umum sutradara (bagian B) dan Remotion untuk teks/penyusunan boleh dipakai di E1.
- **Awal setiap sesi:** baca `STATUS.md`, lalu `WORKFLOW.md` hanya bagian tahap yang dikerjakan. Perbarui `STATUS.md` setiap ada kemajuan dan push (cabang kerja, bukan `main`). Catat log per video E1 dari template `e1/_template-log.md` (WORKFLOW bagian 11).

---
# ATURAN LAMA: video 3D diorama (#1–#26). Hanya berlaku bila user secara eksplisit meminta video bergaya 3D lama; untuk E1 abaikan bagian ini kecuali yang disebut "tetap berlaku" di atas.

## ATURAN KAKU: gerbang tahap (perintah user 16 Nov 2026, TIDAK BOLEH dilewati)
- Setiap video punya `checklist/vNN.md` (salin dari `checklist/_template.md` di awal, sebelum langkah apa pun). **Selama masih ada langkah `[ ]` di tahap sebelumnya, DILARANG masuk tahap berikutnya.** Centang `[x]` hanya setelah benar-benar selesai; keputusan milik user (palet, suara, ACC) hanya dicentang bila user sudah menjawab di chat.
- Gerbang otomatis: `node tools/gerbang.mjs NN <tahap>`; `tools/produksi.sh` memanggilnya (`sheet` butuh T1–T3, `final|bagian|cover` butuh T1–T5). Jangan mematikan atau menyiasati gerbang; kalau gagal, selesaikan langkahnya.
- **Palet latar WAJIB diputuskan user di Tahap 2** (tawarkan tabel `style/identitas.md` + rekomendasi + alasan, lalu tunggu jawaban). Dilarang memakai `krem` diam-diam.
- **Revisi/referensi user:** tulis semuanya di daftar R pada checklist, tafsirkan 1 kalimat (referensi = acuan penempatan, bukan render realistis), kerjakan SEMUA butir, lalu lapor. Dilarang loncat ke tahap lain (cek, render, caption, distribusi) sebelum semua butir R selesai dan dilaporkan.
- Awal video: `git fetch`, cek nomor di `main` dan cabang `claude/*` sebelum menamai video.

## ATURAN KAKU: KUNCI KARAKTER (perintah user 17 Nov 2026, setelah #16 dan #17 dinilai sangat jelek)
Video baru HARUS terlihat seperti keluarga **#7, #8, #10, #13, #14**. Bukan eksperimen, bukan tata letak baru. Yang dikunci:
1. **Mulai dari salinan `remotion/src/v08/` (atau v14)**; yang diganti hanya data (beat, judul, kamera, objek). Dilarang mengganti struktur adegan, tipografi, kartu, kicker, atau subtitle.
2. **Satu objek 3D besar per adegan, close-up**: objek kunci ≥ 1/3 tinggi layar (idealnya mengisi lebar layar), terpotong tepi layar boleh. **DILARANG diorama/irisan tanah lebar yang membuat objek kecil** (ciri gagal #16/#17), dan dilarang label kecil sebagai pembawa pesan; pesan dibawa kartu judul + objek.
3. **Teks maksimal dua lapis** di atas (kicker + kartu judul dua baris); kartu dengan baris kosong dilarang; subtitle dipecah per frasa utuh.
4. **Kontras tegas, warna datar, bentuk membulat**, pola pemutus (panel 2D / banjir koral) di titik balik. Sudut tegas: beda tinggi, ukuran, atau perubahan harus terbaca dalam 1 detik di layar HP.
5. **Pengecualian yang diizinkan hanya yang sudah diputuskan user**: palet latar (Tahap 2) dan tanpa ornamen sudut (16 Nov). Referensi user hanya mengubah penempatan di dalam gaya ini, tidak mengganti gaya.
6. **Bukti wajib sebelum minta ACC sheet:** buat contact sheet 6 still video baru **berdampingan dengan 2 still referensi (#8 dan #14)** dan tulis di checklist satu kalimat per poin 2–4 bahwa lolos. Ukuran objek diperiksa dengan mata terhadap referensi, bukan dengan skrip.
7. **Bila video dinilai user menyimpang dari karakter ini, TIDAK ADA perbaikan tambal-sulam: video dibuang dan dimulai dari awal** (salin ulang v08/v14, naskah dan VO yang sudah di-ACC dipakai lagi). Catat penyebabnya di `style/cek-bug.md`.
8. **Tahap 4 wajib baca `style/gaya-penjelasan.md`** (kit, format `beats.json`, skala objek, kosakata kamera bagian 4, tempo, daftar cek) dan skill `sutradara` sebelum menulis kamera; kamera dari kosakata itu (≥4 jenis gerak, satu signature shot), bukan karangan baru. Tulis di `checklist/vNN.md` bahwa panduan sudah dibaca.

## ATURAN HEMAT TOKEN (perintah user 18 Nov 2026, setelah #21; menang atas aturan lain yang lebih boros)
**Ruang lingkup (user 18 Nov): hanya berlaku saat memproduksi video (tahap revisi, moodboard, sheet, render). Saat berdiskusi dengan user (tanya jawab, usul topik, bahas gaya, bahas referensi), aturan ini TIDAK berlaku: jawab selengkapnya dan boleh menampilkan gambar bila membantu.**
1. **Revisi ditampung semua dulu.** Setiap permintaan revisi user dicatat di daftar R `checklist/vNN.md` dan TIDAK langsung dikerjakan/dirender satu per satu. Setelah user menyatakan revisi cukup (atau menyuruh lanjut), kerjakan SEMUA butir R sekaligus.
2. **Urutan sesudahnya:** render moodboard akhir (1 sheet) → render video penuh. Tidak ada putaran moodboard/sheet per revisi.
3. **Gambar ke user: 1 still per bagian besar, tanpa sheet.** Pada moodboard akhir (sebelum render), kirim ke user 1 still per bagian besar video (5 bagian framework: hook, masalah, penjelasan, demonstrasi/titik balik, aksi+CTA) sebagai file gambar terpisah lewat SendUserFile, supaya user tetap melihat gambaran kasar. Pilih still paling mewakili tiap bagian; tidak perlu dibuka lagi oleh Claude bila sudah lolos cek skrip. Di luar itu (revisi per putaran, contact sheet, QC sheet) gambar dikirim hanya bila user meminta.
4. **Cek gambar oleh Claude sendiri dibatasi 1 sheet per putaran**, hanya sebelum render, tidak sesudah setiap perubahan kecil. Cek yang bisa dilakukan lewat skrip (`cek-sutradara`, selisih piksel, `tsc`) didahulukan daripada melihat gambar.
5. Render berjalan di latar belakang dan tidak memakai token; satu notifikasi selesai, tanpa laporan progres.

## Hemat token (wajib)
- Baca sesuai tahap: Tahap 1–2 → skill `script-writer` + `prompts/ScriptForge.md` (E1); alur lama `naskah/alur-naskah.md` hanya untuk video 3D lama; Tahap 4–5 → `style/style.md` + `style/aset.md` (Gaya A) atau `style/diorama-kertas/README.md` (Gaya B, diorama kertas); caption → bagian caption di file ini. Jangan membaca ulang file yang tidak berubah.
- Pakai `grep`/`sed -n` untuk bagian tertentu, bukan membaca file utuh. Gambar dibaca hanya untuk cek visual: still `--scale=0.5`, gabung jadi satu contact sheet, maks. 1–2 sheet per putaran.
- Video baru = salin `remotion/src/v08/` sebagai template, ganti data (timeline beat, judul, kamera), jangan menulis ulang dari nol.
- **Sebelum render penuh, cek contact sheet still terhadap `style/cek-bug.md`** (daftar bug yang pernah terjadi; tambahkan bug baru di sana).
- Render penuh (±25 menit) hanya setelah still disetujui; kumpulkan revisi lalu render sekali. Tunggu render dengan satu notifikasi selesai, tanpa laporan progres per event.
- Hasil ScrapeMedsos selalu disimpan ringkas di `riset/` agar tidak di-scrape ulang.
- Jawaban ke user singkat: hasil, file, keputusan yang dibutuhkan.
- Pekerjaan selesai per tahap di-merge ke `main` (sesi baru selalu mulai dari `main`).

## Aturan inti
- Fakta harus akurat dengan sumber; tandai "(perkiraan)" dan penyederhanaan visual; jangan mengarang angka, kutipan, atau jumlah tayangan.
- **Platform utama: YouTube (Shorts), sejak 11 Nov 2026** (progres paling cepat). Riset di YouTube: ScrapeMedsos `v1_youtube_search` / `v1_youtube_shorts_trending` + `v1_youtube_video_comments` (bahasa penonton). Facebook hanya cadangan; TikTok untuk repo `RAKA`. **Semua output ditulis ringkas** (riset, storyboard, caption, laporan).
- Tahap ide: riset tren YouTube + **saran improvisasi topik** + satu rekomendasi; simpan ringkas ke `riset/`.
- Skill tambahan `social-video-scriptwriting` (umum: review naskah user, skor kualitas, analisis performa); aturan channel tetap menang.
- **Saat menulis/merevisi naskah, pakai skill `script-writer`** (otomatis; kerangka tiga langkah di `prompts/ScriptForge.md`). `naskah-viral` sudah diarsipkan (`arsip/skills/naskah-viral/`); `naskah/alur-naskah.md` dan `riset/2026-11-08-bedah-10-video-viral.md` tinggal acuan data untuk video 3D lama.
- Storyboard (Tahap 2) memuat bagian "Fakta, tren & asumsi" lalu tabel beat; contoh nada & format di `referensi/` (video #1–#4).
- **Setelah video selesai, SELALU buat caption posting + cover**: caption ringkas ke `caption/<slug>.md` (Facebook/Reels, YouTube Shorts, komentar pin, 3 judul alternatif, 5 tag), cover 1080×1920 ke `cover/<slug>.png`.
- **Hasil jadi disimpan di Google Drive, BUKAN GitHub (perintah user, 11 Nov 2026, berlaku untuk semua video ke depan):** video render (MP4), cover, dan info video (caption, komentar pin, judul/deskripsi YouTube, judul alternatif, tag) diunggah ke folder Drive "Fakta Rumah" (`1Dx9nqhifWRbixFb_2u4XrHMIaHHJloAt`), satu subfolder per video `#NN <judul singkat>`. MP4 & PNG cover tidak di-commit ke repo (`.gitignore`). Konektor Drive dari cloud maks ±3 MB per panggilan: cover (kompres bila perlu) + info langsung diunggah; MP4 dikirim ke user (SendUserFile, versi ringan <10 MB juga) untuk diunggah manual, kecuali user memberi cara lain.
- **Tes sutradara OTOMATIS (perintah user 16 Nov):** `tools/produksi.sh final|bagian` menjalankan `node tools/cek-sutradara.mjs NN` lebih dulu dan **membatalkan render bila ada GAGAL**. Jalankan juga setelah setiap revisi komposisi dan sebelum mengirim contact sheet (`sheet` sudah memanggilnya); jangan kirim sheet atau minta ACC saat masih ada GAGAL.
- Penutup video: "Follow buat fakta rumah berikutnya!"

## Produksi
- **Kit gaya (18 Nov 2026):** `remotion/src/kit/` + `style/gaya-penjelasan.md` (template `beats.json`, objek, kamera, skala, daftar cek) dan `referensi/moodboard/`; untuk video baru, kit ini cara cepat memenuhi KUNCI KARAKTER. `cek-sutradara` bagian 9 memeriksanya.
- Engine: Remotion + three.js di `remotion/` (`npx remotion studio`, `npx remotion render <Komposisi> out/<slug>.mp4`). `remotion.config.ts` memakai `swangle` + Chromium `/opt/pw-browsers/chromium` untuk container cloud tanpa GPU.
- Objek 3D dibuat prosedural (contoh: `remotion/src/pengetahuan/Brain.tsx`), warna koral `#f27a63`, latar kertas, label garis tipis (`Scene.tsx`: `Paper`, `Ghost`, `Callout`).
- Suara: ElevenLabs `eleven_v4` (default voice Riri Rida `tCKeP99grYL9wZRg6sQ9`) atau Google AI Studio bila user memilih; angka di teks TTS ditulis sebagai kata. Unduh dari `elevenlabsusercontent.com`.
- Timestamp: ElevenLabs Scribe → `python3 tools/scribe_to_timeline.py <words.json> <out.json>` (angka jadi numeral, tag audio dibuang). Whisper/huggingface diblokir di cloud.
- **Penyutradaraan: pakai skill `sutradara`** (`.claude/skills/sutradara/SKILL.md`): DNA video #7–#8 dikunci + shot list, kamera beralasan, ritme, suara; cek otomatis `node tools/cek-sutradara.mjs NN` sebelum render.
- **Animasi/render (Tahap 4–5): pakai skill `remotion-fitur`** (`.claude/skills/remotion-fitur/SKILL.md`): aturan 3D wajib + fitur peningkat (light leak, transisi, color correction, motion blur, gerak ikut suara). Paket sudah ada di `remotion/package.json`.
- Container baru: `./setup.sh`.

## Aturan hemat ElevenLabs (wajib, permintaan user 12 Nov)
1. **Selalu 1 take**: `creative_generate_speech` dengan `generations_count: 1`, bukan 2 (bawaan konektor = 2, jadi wajib diisi).
2. **Naskah final dulu**: ElevenLabs baru dipanggil setelah naskah dinyatakan final dan di-ACC user (tombol ACC di panel atau "ACC" di chat).
3. **Revisi hanya kalimat yang berubah**: generate ulang kalimat itu saja (1 take), lalu sambung ke VO lama dengan ffmpeg (potong di jeda kalimat, crossfade ±30 ms), lalu ulang timestamp. Jangan generate ulang naskah penuh.
4. **Sebelum VO final, selalu tanya user: Gemini TTS atau ElevenLabs** (perintah user 13 Nov; jangan pilih sendiri). Draf & tes pakai Gemini TTS atau edge-tts** (`python3 tools/gemini_tts.py`, atau workflow GitHub Actions "Gemini TTS" di repo RAKA). ElevenLabs hanya untuk versi final.
5. **Satu flow per video**: buat `creative_create_flow` sekali, catat `flow_id` di naskah/STATUS video itu, dan pakai lagi untuk semua generate & transkripsi video yang sama. Jangan buat flow baru untuk video yang sama.

## Caption & komentar pertama (berlaku setelah user ACC naskah final)
- **Humanizer wajib (perintah user 13 Nov, berlaku untuk semua teks publik):** naskah, caption, judul (termasuk alternatif), deskripsi, komentar pin, dan komentar pertama SELALU dilewatkan skill `anthropic-skills:humanizer` (hapus pola "bukan X tapi Y", penutup satu baris, triad paksa, tanda "—", dan sapaan khas AI) sebelum dikirim ke user atau diunggah ke Drive. Fakta, angka, dan sumber tidak boleh berubah; batas karakter caption tetap berlaku.
- Begitu user menyatakan **ACC/final** untuk naskah, langsung kirim **caption posting + komentar pertama** (jangan tunggu video selesai; cover tetap dibuat setelah render).
- **Pegangan utama: `caption/gaya-caption.md`** (gaya sudah disimpan; scrape tidak wajib). Scrape hanya bila topik/istilahnya baru dan kredit masih ada; temuan baru ditambahkan ke file itu.
- Riset bahasa (opsional): pakai ScrapeMedsos YouTube (`v1_youtube_search`, lalu komentar video teratas dengan `v1_youtube_video_comments`) untuk topik yang sama. Catat kata, singkatan, dan gaya yang benar-benar dipakai orang (mis. "jeglek", "kopong", "rembes", "wkwk", "auto", "relate banget").
- Tulis caption & komentar pertama meniru ritme itu: kalimat pendek, boleh tidak baku, emoji secukupnya (0–2), tanpa frasa khas AI ("Yuk simak!", "Tahukah kamu", "di era modern ini", "mari kita", "penting untuk diingat", tanda "—" berlebihan, daftar berpoin di caption).
- Komentar pertama = pancingan diskusi dari sudut pandang kreator (pertanyaan spesifik atau "aku dulu juga…"), bukan ringkasan video.
- Simpan contoh bahasa hasil scrape (maks. 5 kutipan pendek) di file caption sebagai bukti, jangan menyalin komentar orang utuh ke caption.
