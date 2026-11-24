# Channel Penjelasan: aturan kerja untuk Claude

Channel pengetahuan, seri utama **"fakta rumah"**, Bahasa Indonesia santai, audiens 35+, YouTube Shorts 1080×1920, 50–70 dtk (±110–155 kata).
(Channel stickman ada di repo terpisah `RAKA`; jangan campur gaya.)

Aturan era lama (diorama kertas #1–#26, gerbang T1–T7, KUNCI KARAKTER, hemat token yang melarang inspeksi) sudah dipindah ke `arsip/CLAUDE-aturan-lama.md`. **Tidak berlaku** kecuali user eksplisit minta video gaya lama.

## Arah aktif: E1, dokumenter penjelasan yang diarahkan (Creative Overhaul, 23 Nov 2026)
- **Satu pertanyaan uji untuk setiap video:** terasa seperti dokumenter penjelasan yang diarahkan, atau slide beranimasi? Kalau slide, kembali ke tahap Arahan Visual.
- **Proses = `WORKFLOW.md`** (10 tahap, tiap tahap punya Input/Tugas/Output/Kriteria/Selesai; tahap berikutnya dilarang sebelum gerbang tahap ini lulus). Evaluasi eksperimen E1 ada di `e1/EVALUASI.md`.
- **Keputusan visual = skill `sutradara`** (Visual Director, `.claude/skills/sutradara/`): bebas memilih medium, shot, kamera, komposisi, cahaya, ritme, suara per shot; tanpa kuota (jenis kamera, mode, signature shot). Spesialis dipanggil sutradara: `breakdown` (referensi/struktur), `remotion-fitur` (implementasi, kartu teknik berstatus), `script-writer` (naskah), `social-video-scriptwriting` (peninjau opsional). Preset dan template lama hanya referensi.
- **Foto nyata boleh diolah** (crop, layering, paralaks, kedalaman, topeng, kamera, cahaya, compositing, tipografi, transisi bermotif); bukan slideshow; tanpa AI image/video API.
- **Naskah = skill `script-writer`** + `prompts/ScriptForge.md`. Naskah boleh direvisi setelah Arahan Visual (demi visual), dikunci setelah animatic di-ACC.
- **Visual 100% dari kode** (Remotion + three.js + React/TS + CSS/SVG). **Dilarang API AI eksternal** untuk gambar/video/model 3D/tekstur; AI hanya asisten penulis kode. Wajib `node tools/cek-mandiri.mjs`. Animasi = fungsi murni `useCurrentFrame`, acak ber-seed, tanpa `Date`/`Math.random`, hasil sama tiap render.
- **Foto nyata dicari USER.** Claude hanya memberi nama berkas dan spesifikasi (apa yang terlihat, sudut, resolusi minimal). Dilarang mengarang atau menyintesis footage.
- **Subtitle default MATI.** Sistem mendukung: subtitle penuh (bila diminta), teks penekanan selektif, label informasi, angka/anotasi. Teks bagian dari art direction, bukan transkripsi; visual harus bisa menyampaikan informasi tanpa subtitle penuh.

## Aturan konsistensi (dipertahankan) vs batasan kreatif (diarsipkan)
- **Dipertahankan:** skala 1 satuan = 1 m dan proporsi nyata; peran warna (aksen=masalah/sorotan, dingin=air/negatif, hijau=solusi); pustaka material `remotion/src/e1/look.tsx`; satu komponen model per objek berulang (rumah sama di semua shot); aturan anti-bug di `style/cek-bug.md` (z-fighting, objek tembus, teks terpotong); CTA tetap. Rinci di `.claude/skills/sutradara/referensi/konsistensi.md`.
- **Diarsipkan (bukan aturan wajib lagi; teks asli di `.claude/skills/sutradara/legacy/`, `arsip/`):** tata letak tetap (subtitle y=1400, kicker atas, kartu judul), "objek ≥ 1/3 layar di tengah", maksimal 3 preset kamera, ≥4 jenis gerak, tanpa kamera diam, crossfade seragam, pemeriksaan `cek-sutradara`.

## Persetujuan pemilik (di titik murah, sebelum render)
ACC dibutuhkan untuk: **topik + sudut cerita**, **storyboard**, **animatic (naskah dikunci)**, render besar, memakai aset eksternal baru, publikasi, dan **merge ke `main`**. **Claude TIDAK merge sendiri.** PR hanya dibuat bila user minta (PR yang ada: #59; dorong commit ke cabang yang sama).

## Gerbang kualitas (rinci di WORKFLOW.md)
Sebelum render: `python3 tools/cek_shots.py e1/NN/shots.json`, `node tools/cek-mandiri.mjs`, `python3 tools/cek_kilau.py <Komposisi> --dur N` (z-fighting), `python3 tools/cek_suara.py audio/x.wav --kata N` (suara). Sesudah render: `python3 tools/review_video.py <mp4> --shots <shots.json>` dan **menonton hasilnya** (strip frame/klip), lalu loudness −15..−13 LUFS. Gerbang mekanis lulus ≠ video bagus; catat penilaian kreatif di `e1/NN/qa.md`.

## Tetap berlaku
- Fakta akurat dan bersumber; klaim belum pasti ditandai `[CEK]`; jangan mengarang angka/kutipan.
- **Humanizer** (`anthropic-skills:humanizer`) untuk semua teks publik: naskah, caption, judul, deskripsi, komentar pin. Fakta/angka tidak berubah.
- CTA penutup: **"Follow buat fakta rumah berikutnya!"**
- **Suara:** sebelum VO final tanya user, Gemini TTS atau ElevenLabs (jangan pilih sendiri). ElevenLabs: 1 take (`generations_count: 1`), naskah final dulu, revisi hanya kalimat yang berubah, satu flow per video. Draf: `python3 tools/gemini_tts.py`. Angka di teks TTS ditulis dengan kata.
- **Setelah video selesai:** caption + komentar pin ke `caption/<slug>.md` (gaya: `caption/gaya-caption.md`), cover 1080×1920 ke `cover/<slug>.png`.
- **Hasil disimpan di Google Drive**, bukan GitHub: `Fakta Rumah / E1 / #NN - Judul` (root `1Dx9nqhifWRbixFb_2u4XrHMIaHHJloAt`). MP4 penuh dikirim ke user lewat chat; konektor Drive maks ±3 MB (versi ringan 540p + berkas teks).
- Container baru: `./setup.sh`. Render: `cd remotion && npx remotion render <Komposisi> out/x.mp4` (swangle, tanpa GPU, ±10 mnt per ±58 dtk).
- Awal sesi: baca `STATUS.md`, lalu bagian `WORKFLOW.md` untuk tahap yang dikerjakan. Perbarui `STATUS.md` dan push ke cabang kerja.
- **Jujur:** jangan menyatakan video/pilot berhasil kecuali hasil render sungguhan sudah ditonton dan dinilai. Jangan mengklaim sudah dirender/diperiksa bila belum.
