# Channel Penjelasan: aturan kerja untuk Claude

Channel pengetahuan, seri utama **"fakta rumah"** (topik edukasi, penjelasan, fenomena, mitos, mekanisme, hal sehari-hari), Bahasa Indonesia santai, audiens 35+, YouTube Shorts 1080×1920, 50–70 dtk (±110–155 kata).
(Channel stickman ada di repo terpisah `RAKA`; jangan campur gaya.)

Aturan era lama (diorama kertas #1–#26, gerbang T1–T7, KUNCI KARAKTER) ada di `arsip/CLAUDE-aturan-lama.md`; versi sebelum perubahan 24 Nov di `arsip/v3-24nov/`. Tidak berlaku kecuali pemilik eksplisit meminta gaya lama.

## Proyek video baru: kategori dan pendekatan visual dulu
- **Sebelum keputusan kreatif besar, pastikan kategori video dan pendekatan visual:** Breakdown / How it works · Mitos vs Fakta · Fenomena / Science · Perbandingan · Cerita / Investigasi · Hybrid (kategori dominan + pendukung). **Jangan menulis naskah, storyboard, atau kode sebelum kategori dikonfirmasi.**
- **Tidak birokratis:** tanyakan hanya yang belum jelas; bila kategori jelas dari topik/brief, rekomendasikan dan minta konfirmasi singkat. Jangan menanyakan ulang yang sudah disepakati; jangan mengulang approval yang tidak perlu.
- **Proses = `WORKFLOW.md`** (8 langkah): brief + kategori → analisis konten → arah visual → naskah → storyboard → review → produksi → visual QA. Evaluasi eksperimen E1: `e1/EVALUASI.md`.
- **Tidak coding sebelum arah visual dan storyboard disetujui**, kecuali storyboard hanya menurunkan arah yang sudah disetujui tanpa keputusan kreatif besar baru (cukup dilaporkan).

## Identitas visual: `docs/visual-system/VISUAL_STYLE_SPEC.md` (sumber utama)
- **Stylized illustration, flat graphic illustration, ilustrasi berdimensi sederhana.** Tingkat detail B (outline tipis + bayangan sederhana) default; A (datar) dan C (volume tiga nada) sesuai kebutuhan; tidak semua objek harus sama. Palet = **sistem peran warna** (latar, objek utama, fokus, perbandingan, informasi, netral); preset di `style/palet.json` (krem salah satu, bukan kewajiban), variasi terkendali boleh; warna berubah hanya bila ada tujuan.
- **Bukan default:** semi-realistis, 3D realistis, material realistis, PBR, pencahayaan realistis, kabut/atmosfer, CGI sinematik, tampilan demo software 3D.
- **Teknik berurutan:** SVG/CSS 2D → berlapis/2.5D → 3D terstilisasi hanya bila perlu → foto diolah bila konten butuh. Visual dari kode (Remotion, React, SVG, CSS, Canvas bila relevan, three.js bila perlu). **Dilarang** API AI eksternal untuk gambar/video/model 3D/tekstur (AI hanya asisten penulis kode). Wajib `node tools/cek-mandiri.mjs`. Animasi = fungsi murni `useCurrentFrame`, acak ber-seed, tanpa `Date`/`Math.random`.
- **Kartu judul, kicker, hook box, kotak teks: opsional**, bukan template; subtitle penuh default mati. Teks/grafis hanya bila menekankan, menyampaikan data, atau memudahkan pemahaman.
- **Foto nyata fleksibel** (crop, pan/zoom bertujuan, layering/parallax, masking/reveal, anotasi, compositing); treatment grafis (duotone/posterize) opsional, tidak diwajibkan. Dipilih karena kebutuhan konten, bukan sebagai latar. **Foto dicari USER**; Claude memberi nama berkas dan spesifikasi; dilarang mengarang/menyintesis footage.
- **Animasi menjelaskan, kualitas animasi prioritas besar:** staging, timing, anticipation, urutan gerak, interaksi, sebab-akibat, kejelasan. Bukan sekadar muncul/berpindah/zoom. **Akurasi mekanisme dijaga** (hubungan komponen, aliran, sebab-akibat tidak boleh keliru).
- **Breakdown hanya bila perlu** (kategori how-it-works atau narasi menuntut); mitos/lingkungan tidak dibongkar objeknya.
- Aturan konsistensi: skala/proporsi masuk akal; satu model per objek berulang; anti-bug di `style/cek-bug.md` (z-fighting, objek tembus, teks terpotong); CTA tetap. Konsistensi ≠ keseragaman.

## Keputusan visual: skill `sutradara`
Pusat arahan visual (storytelling visual, art direction, komposisi, sinematografi, staging, animasi, ritme, suara, kontinuitas), tanpa kuota (jenis kamera, mode, signature shot). Spesialis dipanggil sesuai kebutuhan: `breakdown` (referensi/struktur/mekanisme), `remotion-fitur` (implementasi, kartu teknik berstatus), `script-writer` (naskah), `social-video-scriptwriting` (peninjau opsional). Teks aturan lama ada di `.claude/skills/*/legacy/`.

## Persetujuan pemilik
ACC untuk: **kategori** (bila belum jelas), **arah visual baru**, **naskah**, **storyboard** (kecuali bagian anti-birokrasi di atas), render besar, aset eksternal baru, publikasi, dan **merge ke `main`**. **Claude TIDAK merge sendiri.** PR hanya bila diminta (PR yang ada: #59; dorong commit ke cabang yang sama).

## Gerbang kualitas (rinci di WORKFLOW.md)
Sebelum render: `node tools/cek-mandiri.mjs`, `python3 tools/cek_kilau.py <Komposisi> --dur N` (bila 3D), `python3 tools/cek_suara.py audio/x.wav --kata N`, `tsc`; `python3 tools/cek_shots.py` hanya memeriksa struktur (variasi = saran). Sesudah render: **menonton hasilnya** (`python3 tools/review_video.py`), loudness −15..−13 LUFS. Gerbang mekanis lulus ≠ video bagus; catat penilaian di `e1/NN/qa.md`.

## Tetap berlaku
- Fakta akurat dan bersumber; klaim belum pasti `[CEK]`; jangan mengarang angka/kutipan.
- **Humanizer** (`anthropic-skills:humanizer`) untuk semua teks publik (naskah, caption, judul, deskripsi, komentar pin). Fakta/angka tidak berubah.
- CTA penutup: **"Follow buat fakta rumah berikutnya!"**
- **Suara:** sebelum VO final tanya Gemini TTS atau ElevenLabs. ElevenLabs: 1 take, naskah final dulu, revisi hanya kalimat yang berubah, satu flow per video. Draf: `python3 tools/gemini_tts.py`. Angka di teks TTS ditulis dengan kata.
- **Setelah video selesai:** caption + komentar pin ke `caption/<slug>.md` (`caption/gaya-caption.md`), cover 1080×1920 ke `cover/<slug>.png`.
- **Hasil di Google Drive**: `Fakta Rumah / E1 / #NN - Judul` (root `1Dx9nqhifWRbixFb_2u4XrHMIaHHJloAt`). MP4 penuh dikirim lewat chat; konektor Drive ±3 MB (versi ringan + berkas teks).
- Container baru: `./setup.sh`. Render: `cd remotion && npx remotion render <Komposisi> out/x.mp4` (swangle, tanpa GPU; 2D SVG/CSS jauh lebih cepat dari 3D).
- Awal sesi: baca `STATUS.md`, lalu bagian `WORKFLOW.md` untuk langkah yang dikerjakan. Perbarui `STATUS.md`; commit dan push ke cabang kerja.
- **Jujur:** jangan menyatakan video/pilot berhasil kecuali render sungguhan sudah ditonton dan dinilai; jangan mengklaim sudah dirender/diperiksa bila belum.
