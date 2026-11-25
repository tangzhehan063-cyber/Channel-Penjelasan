# WORKFLOW produksi Fakta Rumah (satu-satunya urutan aktif, sejak 25 Nov 2026)

**Riset → Kunci Naskah → VO Final → Perencanaan Visual → Produksi Visual dengan Skill → Integrasi → Render Final → QC**

Gaya visual: `style/gaya-e1-03.md`. Pustaka skill motion: `pustaka-skill/` (router `node tools/pilih-skill.mjs`). Desain eksperimen & metrik: `e1/EKSPERIMEN.md`.
Workflow lama (diarsipkan, tidak berlaku): `arsip/WORKFLOW-e1-v2-semi-realistis.md`, `arsip/WORKFLOW-3d-diorama-lama.md`.

Setiap video punya log `e1/eNN-<slug>.md` (salin `e1/_template-log.md` di fase 1) dan folder kode `remotion/src/e1/<Nama>NN.tsx`.
Gerbang persetujuan pemilik channel ditandai **[ACC]**: tanpa jawaban user di chat, fase berikutnya tidak dimulai.

---

## FASE 1 — Riset & konsep
- Topik: 10 ide atau topik dari user → rekomendasi → **[ACC] topik final**. Simpan ringkasan di `riset/`.
- Verifikasi klaim dari sumber kredibel (instansi, jurnal, berita yang menyebut sumber). Klaim tanpa sumber ditandai `[CEK]` dan disampaikan ke user.
- Tetapkan angle, hook, struktur cerita (pola #9: anggapan → belokan → penjelasan → payoff → aksi → CTA).
- Alat: skill proyek `script-writer` (bagian riset & angle), `prompts/ScriptForge.md` langkah 1–2.

## FASE 2 — Naskah (dikunci)
- Tulis narasi lengkap dengan skill `script-writer`: 50–70 dtk, ±110–155 kata, penutup "Follow buat fakta rumah berikutnya!", 3 alternatif hook.
- Lewatkan skill humanizer (`anthropic-skills:humanizer`) sebelum dikirim ke user.
- **[ACC] naskah final** → simpan versi terkunci: `naskah/eNN-<slug>.md` (dengan sumber & `[CEK]`) dan `naskah/eNN-<slug>.txt` (teks TTS persis), commit dengan pesan "naskah ACC".
- Setelah ACC: buat caption + komentar pin (`caption/eNN-<slug>.md`, gaya `caption/gaya-caption.md`, humanizer).
- Perubahan isi naskah sesudah dikunci = versi baru (`-v2`), kembali ke fase 3.

## FASE 3 — Voice-over final
- **Tanya user: Gemini TTS atau ElevenLabs** (jangan memilih sendiri).
- Gemini (bawaan seri E1, suara Achernar):
  `GEMINI_TTS_VOICE=Achernar GEMINI_TTS_STYLE="Bacakan dengan santai dan natural, seperti ngobrol dengan tetangga, tempo sedang:" python3 tools/gemini_tts.py naskah/eNN-<slug>.txt` → `audio/eNN-<slug>.wav`.
  ElevenLabs: aturan hemat (1 take, satu flow per video) di `CLAUDE.md`.
- Cek otomatis: `python3 tools/cek_suara.py audio/eNN-<slug>.wav --kata <jumlah kata> --ref audio/e1-03-tiang-listrik.wav` (durasi, kata/dtk, nada).
- Timestamp per kata: `python3 tools/align_teks.py audio/eNN-<slug>.wav naskah/eNN-<slug>.txt audio/eNN-words.json`.
- Tinjau audio utuh: pelafalan (angka & istilah), penyampaian, tempo, jeda, kualitas, kelengkapan, durasi nyata. Kirim MP3 ke user.
- **[ACC] VO** (diam/lanjut dari user dihitung bila user sudah mendengar). Salin ke `remotion/public/eNN/vo.wav` + `words.json`.
- Naskah berubah material → VO dibuat ulang dan di-ACC ulang sebelum fase 4. Revisi kecil: generate kalimat itu saja lalu sambung (ffmpeg, crossfade ±30 ms), ulang timestamp.

## FASE 4 — Perencanaan visual dari VO final
- Sumber waktu = `words.json` VO final. Pecah narasi menjadi adegan (batas di jeda kalimat).
- Per adegan isi tabel `style/gaya-e1-03.md` §7: detik, kalimat, tujuan penjelasan, objek, metode, kamera (mode perspektif/tele + gerak + alasan), gerak objek, teks/label, aset yang dibutuhkan, transisi, SFX, durasi, **skill pustaka**.
- Pilih skill: `node tools/pilih-skill.mjs "<tugas adegan>" --fase 4` (komposisi, ritme, arahan gerak) lalu `--fase 5` (teknik). Baca hanya SKILL.md yang terpilih.
- Breakdown (bongkar struktur/lapisan) hanya untuk adegan yang benar-benar butuh, maksimal satu momen khas per video (skill proyek `breakdown` + `isometric-animation`).
- Tulis rencana ke log video. Tidak ada aset visual lengkap sebelum VO di-ACC.

## FASE 5 — Produksi visual dengan skill
- Ikuti alur & teknik skill terpilih, diterjemahkan menurut `pustaka-skill/INTEGRASI.md` (satu renderer Remotion, satu `ThreeCanvas`, gerak dari `useCurrentFrame`, tanpa API AI, hemat CPU).
- Mulai dari kode acuan `remotion/src/e1/Tiang03.tsx` (+ `look.tsx`): salin jadi `remotion/src/e1/<Nama>NN.tsx`, ganti dunia/adegan/kamera/label; daftarkan di `remotion/src/Root.tsx`. Komponen bersama dipakai ulang, bukan ditulis ulang.
- Aturan kode: komponen & `THREE.Shape` di tingkat modul atau `useMemo`; acak ber-seed; aset lewat `staticFile`; skala 1 satuan = 1 m; tak ada permukaan sebidang (z-fighting).
- **Style reference**: 3 still (hook, adegan inti, breakdown) → **[ACC] style** sebelum lanjut membangun semua adegan.
- Pratinjau: `tools/pratinjau.sh <Komposisi> <sheet.jpg> <detik...>` (1 contact sheet per putaran); `cd remotion && npx tsc --noEmit`.
- Revisi user ditampung dulu (daftar R di log), dikerjakan sekaligus.

## FASE 6 — Integrasi
- VO tetap tulang punggung waktu (`<Audio src={staticFile('eNN/vo.wav')} />`, cue adegan dari detik `words.json`).
- Subtitle: `Captions` dari `remotion/src/kit/teks` dengan `words.json`. Kicker per bagian, label 3D, kartu 2D.
- Musik/SFX (bila dipakai): dari kode atau `remotion/public/sfx/` (skill `soundtrack` bagian sintesis; tanpa musik AI). Hierarki: VO > SFX penting > musik.
- Transisi: dip/crossfade ±0,35 dtk di batas adegan; jangan memendekkan timeline VO.

## FASE 7 — Render final
- Sebelum render: `node tools/cek-mandiri.mjs` (OK), `npx tsc --noEmit`, contact sheet seluruh adegan, `python3 tools/cek_kilau.py <Komposisi> --dur <dtk> --tiap 6` (z-fighting).
- Uji potongan dulu: `tools/render-bagian.sh <Komposisi> /tmp/uji.mp4 --dari 0 --sampai 480`.
- **[ACC] render penuh** (sebutkan komposisi + estimasi waktu ±10 mnt per 60 dtk).
- Render: `tools/render-bagian.sh <Komposisi> remotion/out/eNN-<slug>.mp4 --audio remotion/public/eNN/vo.wav` (per 300 frame, satu tab, cek frame rusak, loudnorm −14 LUFS). Jalankan di latar belakang.

## FASE 8 — QC
- Otomatis: `python3 tools/cek-frame-rusak.py <mp4>` (0 tile), `python3 tools/cek_suara.py audio/eNN-<slug>.wav --kata N --video <mp4>` (−14 LUFS ±1, puncak ≤ −1 dB), `ffprobe` durasi = VO.
- Mata: 1 contact sheet seluruh video (`ffmpeg -vf "select='not(mod(n\,128))',scale=216:384,tile=8x2"`): sinkron VO–gambar, adegan lengkap, konsistensi, aset hilang, frame hitam/kosong, artefak, transisi, keterbacaan teks, keseimbangan audio.
- Fakta: setiap klaim punya sumber; ilustrasi tidak menyesatkan.
- Cacat diperbaiki per adegan: render ulang hanya bagian terkait (`--dari/--sampai`), sambung, cek lagi.
- Hasil: MP4 penuh + 540p ke user (SendUserFile); cover 1080×1920; Drive `Fakta Rumah / E1 / #NN - Judul` (cover, info, 540p). Catat di log video dan `STATUS.md`. **[ACC] publish**, **[ACC] merge ke main** (Claude tidak merge sendiri).
