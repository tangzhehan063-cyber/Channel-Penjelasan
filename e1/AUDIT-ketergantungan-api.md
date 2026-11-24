# Audit ketergantungan API AI untuk aset visual (23 Nov 2026)

> **Catatan (24 Nov 2026):** audit ketergantungan API (riwayat). Larangan API AI tetap; istilah "semi-realistis" di dalamnya tidak lagi arah visual.

Cakupan: `WORKFLOW.md`, `CLAUDE.md`, skill, `e1/_template-log.md`, `tools/`, `remotion/`. Hasil pindai kode: `node tools/cek-mandiri.mjs` = 98 berkas, **0 ketergantungan API AI** (kode Remotion/three.js yang ada sudah mandiri). Ketergantungan hanya ada di **instruksi workflow E1**, belum pernah dijalankan (belum ada generasi E1).

## A. Ketergantungan produksi yang DIHAPUS (diganti kode)
| Lokasi | Isi lama | Pengganti |
|---|---|---|
| `WORKFLOW.md` judul, 01, 02 | "visual semi-realistis AI-generated" sebagai variabel eksperimen | "semi-realistis procedural (Three.js)"; variabel tetap = gaya visual |
| STEP 4 "Keyframe generation" | generate style reference + keyframe per shot | Style reference = still render Three.js; keyframe = still dari komposisi Remotion |
| STEP 5 "Image-to-video" | keyframe → klip lewat generator, start/end frame | Animasi kamera/objek dari kode (`camAt`, kit gerak); rendering Remotion |
| STEP 7 "Text overlay" | catatan "jika generator tidak mampu menulis teks" | Teks selalu dari React/SVG (tak ada teks AI) |
| STEP 8 Visual QC | "tidak ada teks AI rusak", warping, flicker | Diganti cek deterministik: z-fighting, clipping, tembus objek, proporsi |
| 08 Pilot | 1 keyframe + 1 klip AI ±5 dtk, ukur kredit | 1 adegan 3D + 1 klip render ±5 dtk, ukur waktu render & skor cek |
| 09 Credit management | kredit generator, estimasi, regenerate | Anggaran **waktu render & token**; kredit generator = 0 |
| 10 Execution rules | "Before using generator", "large batches of images/videos" | "Sebelum render batch besar"; tanpa generator |
| 11 Log, `_template-log.md` | kolom Credits used, log generasi, "Rencana generator" | Waktu render, jumlah revisi kode, log render |
| 12 Open decisions | generator model, credit budget | dihapus; diganti pilihan material/pencahayaan |
| 13 Sequence | Keyframes → Animation | Scene code → Render |
| `CLAUDE.md` ARAH AKTIF | "keyframe AI → image-to-video", "bukan Remotion untuk visual" | Remotion + three.js dipakai untuk visual |
| `remotion-fitur/SKILL.md` | status "bukan Remotion/three.js" | Dipakai penuh untuk E1 |

## B. Referensi lama yang hanya dokumentasi (dipertahankan)
- `arsip/WORKFLOW-3d-diorama-lama.md`, `arsip/skills/`, `arsip/origami/`: riwayat, tidak diubah.
- `riset/*`, `naskah/*`, `caption/*` yang menyebut "kredit"/"generator": konteks ElevenLabs/riset, bukan visual.
- `STATUS.md` riwayat #5–#24: catatan sejarah.
- `remotion/package-lock.json`: kata "credit" dari paket, bukan layanan.

## C. Fitur berguna yang diganti kode (padanan)
| Kebutuhan dari alur AI | Padanan kode |
|---|---|
| Konsistensi bentuk rumah antarshot (style reference) | **Satu komponen rumah dipakai semua shot** (identik secara matematis, tidak mungkin "berubah bentuk") |
| Start/end frame | `camAt(keys, t)` keyframe kamera + `r(t,a,b)` untuk objek |
| Seed/variasi | Prop `seed` pada generator prosedural (`mulberry32`), hasil selalu sama |
| Warping/flicker QC | Tidak ada pada render kode; diganti cek z-fighting & clipping |
| Pilot kredit | Pilot waktu render |

## D. Di luar cakupan (sengaja tidak diubah, perlu keputusan bila mau)
- **Voice-over** (Gemini TTS / ElevenLabs): layanan AI, tetapi bukan aset visual, dipanggil sekali saat produksi, hasilnya file lokal; render tidak memerlukannya. Bila mau 100% bebas API AI: `edge-tts` atau rekaman sendiri. **Keputusan pemilik.**
- **Riset** (ScrapeMedsos): data, bukan aset visual.
- Pustaka luar CC0 (`remotion/public/aset-luar`, Kenney): aset lokal berizin, boleh dipakai dengan persetujuan (`style/aset-luar.md`).
