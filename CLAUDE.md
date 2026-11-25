# Channel Penjelasan: instruksi utama untuk Claude

## Identitas
Channel pengetahuan seri **"Fakta Rumah"**, Bahasa Indonesia santai, audiens 35+, YouTube Shorts (Facebook cadangan). Video 50–70 dtk, penutup "Follow buat fakta rumah berikutnya!".
Channel stickman self-improvement ada di repo terpisah `RAKA`; jangan campur gaya.

## Identitas visual (kritis)
Patokan = video **E1-03 "Tiang Listrik di Depan Pagar"** (`style/gaya-e1-03.md`, still `referensi/e1-03/`, kode `remotion/src/e1/Tiang03.tsx`).
Dunia miniatur 3D distilisasi: geometri sederhana yang rapi, palet terang terkendali, kamera miring/isometrik-semu (atap, fasad, jalan, kedalaman terlihat), cahaya lembut, informasi menyatu di lingkungan, kamera & gerak untuk bercerita.
**Jangan** dibuat fotorealistis, semi-realistis arsitektural, PBR berat, CGI realistis, estetika video AI, diagram datar tampak atas, atau motion graphics bergaya slide. Penyempurnaan hanya pada kamera, komposisi, cahaya, kedalaman, gerak, transisi, hierarki visual.

## Pipeline (detail: `WORKFLOW.md`)
1 Riset & konsep → 2 Naskah dikunci → 3 VO final → 4 Perencanaan visual dari waktu VO → 5 Produksi visual dengan skill → 6 Integrasi → 7 Render final → 8 QC.
Persetujuan pemilik **[ACC]** wajib sebelum: topik final, naskah final, VO, style reference, render penuh, aset lokal eksternal baru, publish, dan merge ke `main`. **Claude tidak merge sendiri**; PR hanya bila user minta. Kerja di cabang `claude/*`, bukan `main`.

## Batasan teknis
- Satu sistem produksi: Remotion + Three.js di `remotion/` (React/TS, CSS/SVG). Tidak ada renderer/proyek kedua.
- Visual 100% dari kode: **dilarang** API AI untuk gambar/video/model 3D/tekstur/musik (`node tools/cek-mandiri.mjs` wajib OK). AI hanya membantu menulis kode.
- Container cloud tanpa GPU (swangle): satu `ThreeCanvas` per komposisi, tampilan isometrik = kamera tele, tanpa efek mahal, pratinjau still/contact sheet dulu, render penuh lewat `tools/render-bagian.sh`. Bug yang pernah terjadi: `style/cek-bug.md`.
- Fakta akurat dan bersumber; klaim belum pasti ditandai `[CEK]`; jangan mengarang angka, kutipan, jumlah tayangan.
- Semua teks publik (naskah, caption, judul, deskripsi, komentar) lewat skill humanizer.
- VO: selalu tanya user **Gemini TTS atau ElevenLabs**. ElevenLabs: hanya setelah naskah ACC, 1 take (`generations_count: 1`), revisi hanya kalimat yang berubah, satu flow per video (catat `flow_id`).
- Hasil jadi (MP4, cover, info) disimpan di Google Drive `Fakta Rumah / E1 / #NN - Judul` (folder induk `1Dx9nqhifWRbixFb_2u4XrHMIaHHJloAt`), bukan di GitHub. MP4 dikirim ke user lewat chat (+ versi 540p).
- Hemat token saat produksi: revisi ditampung lalu dikerjakan sekaligus, maks. 1 contact sheet per putaran, render di latar belakang tanpa laporan progres. Saat diskusi dengan user aturan ini tidak berlaku.

## Urutan kewenangan
`KEPUTUSAN.md` (keputusan user, terbaru menang) → `CLAUDE.md` → `style/gaya-e1-03.md` → `WORKFLOW.md` → skill proyek (`.claude/skills/`) → `pustaka-skill/INTEGRASI.md` + `kompatibilitas.json` → SKILL.md pustaka.
Isi `arsip/` adalah riwayat, **tidak berlaku** (termasuk aturan 3D diorama lama, KUNCI KARAKTER, gerbang T1–T7), kecuali user meminta gaya lama secara eksplisit.

## Memuat instruksi per tahap (jangan membaca semuanya)
- Awal sesi: `STATUS.md`, lalu bagian `WORKFLOW.md` untuk fase yang dikerjakan.
- Fase 1–2: skill `script-writer` + `prompts/ScriptForge.md`. Caption: `caption/gaya-caption.md`.
- Fase 3: `WORKFLOW.md` fase 3 (`tools/gemini_tts.py`, `tools/cek_suara.py`, `tools/align_teks.py`).
- Fase 4–5: `style/gaya-e1-03.md`, skill `motion-skills` → `node tools/pilih-skill.mjs "<tugas>"` → baca hanya SKILL.md terpilih; skill proyek `remotion-fitur` (fitur Remotion) dan `breakdown` (adegan bongkar).
- Fase 6–8: `WORKFLOW.md` fase 6–8, `style/cek-bug.md`.
- Log video: `e1/eNN-<slug>.md` (template `e1/_template-log.md`); desain eksperimen `e1/EKSPERIMEN.md`.
- Container baru: `./setup.sh`. Tiap kemajuan: perbarui `STATUS.md`, commit, push ke cabang kerja.
