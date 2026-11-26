# STATUS (aktif). Baca ini dulu, lalu `WORKFLOW.md` untuk fase yang dikerjakan.
Riwayat lengkap sampai 25 Nov 2026: `arsip/riwayat/STATUS-riwayat-sampai-2026-11-25.md`. Tambahkan entri baru di atas; pindahkan entri lama ke arsip bila sudah tidak aktif.

## Sistem produksi (25 Nov 2026)
- **Satu pipeline aktif:** `WORKFLOW.md` (8 fase). Instruksi utama `CLAUDE.md` diringkas; aturan lama diarsipkan di `arsip/`.
- **Patokan visual:** E1-03 (`style/gaya-e1-03.md`, still `referensi/e1-03/`, kode `remotion/src/e1/Tiang03.tsx`, cadangan branch `backup/e1-03-tiang-listrik`).
- **Pustaka skill:** 56 skill iart-ai di `pustaka-skill/motion/`; registry `pustaka-skill/REGISTRY.md`; router `node tools/pilih-skill.mjs`; aturan `pustaka-skill/INTEGRASI.md`.
- **Alat baru:** `tools/render-bagian.sh` (render per bagian + loudnorm), `tools/pratinjau.sh` (still + contact sheet), `tools/cek-frame-rusak.py`, `tools/skill-registry.mjs`, `tools/pilih-skill.mjs`.

## Video E1
| # | Judul | Status | Catatan |
|---|---|---|---|
| 01 | Rumah Belanda Adem Tanpa AC | dirender (59,0 dtk), belum cover/publish | arah lama semi-realistis; log `e1/e01-rumah-belanda-adem.md` |
| 02 | Tanah Turun, Lantai Ditinggikan | dirender (58,5 dtk), 540p di Drive, belum cover/publish | arah lama; log `e1/e02-tanah-turun.md` |
| 03 | Tiang Listrik di Depan Pagar, Tolak Rezeki? | **berhasil, patokan visual**; dirender 68,4 dtk, MP4 dikirim ke user | log `e1/e03-tiang-listrik.md` |
| 05 | Sumur Kering gara-gara Sumur Bor Tetangga | **selesai, diterima user (26 Nov)**; 66,6 dtk (−14,4 LUFS, puncak −1,4 dB), MP4 + 540p dikirim ke user; tanpa cover/Drive atas keputusan user | log `e1/e05-sumur-kering.md`; VO Gemini Achernar (ElevenLabs kuota habis) |
| 04 | Kenapa Air Rob Bikin Motor Karatan? | **selesai, diterima user (25 Nov)**; 61,8 dtk (−14,6 LUFS), MP4 dikirim ke user; tanpa cover/Drive atas keputusan user | log `e1/e04-karat-rob.md`; video pertama dengan pipeline 8 fase |

### Hasil E1 #03 (berhasil)
- Naskah ACC hook A (152 kata), VO Gemini Achernar 67,7 dtk (F0 163 Hz, lolos `cek_suara`), caption `caption/e1-03-tiang-listrik.md`.
- Render final 1080×1920, 68,4 dtk, −14,6 LUFS, puncak −1,3 dB; `cek-mandiri` OK; `cek_kilau` maks 167 px (batas 300); `cek-frame-rusak` 0 frame rusak.
- Skill dipakai: `isometric-animation` + `threejs-animation` (iart-ai). Revisi R1: mobil hatchback generik dari foto referensi user.
- Pelajaran teknis (di `style/cek-bug.md`): satu `ThreeCanvas`, isometrik = kamera tele; render per bagian satu tab.

## Tugas terbuka
- #05: publish & metrik bila user memutuskan (cover/Drive tidak dibuat, keputusan user 26 Nov). Kasus Miliran: sebab dibantah hotel, naskah memakai "menurut laporan media".
- #04: publish & metrik bila user memutuskan. Klaim rangka patah Semarang masih [CEK]. Cover/Drive tidak dibuat (keputusan user 25 Nov).
- #03: cover 1080×1920, unggah Drive `Fakta Rumah / E1 / #03 - Tiang Listrik Depan Pagar` (cover, info, 540p), publish (ACC), metrik 24/48 jam.
- #01, #02: cover, publish, metrik (keputusan user: tetap terbit dengan gaya lama atau tidak).
- Merge cabang kerja ke `main`: menunggu ACC user (Claude tidak merge sendiri).
- Keputusan terbuka: musik/SFX dari kode untuk seri E1 (belum dipakai di #01–#03).
