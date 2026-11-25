# Alat produksi

## Aktif (pipeline `WORKFLOW.md`)
| Fase | Alat | Fungsi |
|---|---|---|
| 3 VO | `gemini_tts.py` | naskah `.txt` → `audio/*.wav` (Gemini TTS; `--engine edge` tanpa kunci) |
| 3 VO | `cek_suara.py` | durasi, kata/dtk, nada VO; `--video` untuk loudness hasil render |
| 3 VO | `align_teks.py` | timestamp per kata (`words.json`) dari wav + teks |
| 3 VO | `scribe_to_timeline.py` | timestamp dari ElevenLabs Scribe (bila VO ElevenLabs) |
| 4–5 | `pilih-skill.mjs` | router pustaka skill motion (`node tools/pilih-skill.mjs "<tugas>" --fase N`) |
| 4–5 | `skill-registry.mjs` | bangun ulang `pustaka-skill/registry.json` + `REGISTRY.md` |
| 5 | `pratinjau.sh` | still per detik + contact sheet |
| 6 | `make_sfx.py`, `make_sfx_jalan.py`, `mix-audio.mjs` | SFX dari kode & mix (dipakai video lama; boleh dipakai ulang) |
| 7 | `cek-mandiri.mjs` | larangan API AI / jaringan di kode visual (wajib OK) |
| 7 | `cek_kilau.py` | z-fighting (render dua kali dengan kamera digeser sedikit) |
| 7 | `render-bagian.sh` | render per bagian 300 frame, satu tab, cek frame rusak, VO + loudnorm −14 LUFS |
| 8 | `cek-frame-rusak.py` | deteksi frame bertumpuk/tile pada MP4 |
| aset | `ambil-aset.sh` | unduh paket aset CC0 Kenney (aset lokal eksternal = perlu ACC) |

## Alat pipeline 3D lama (tidak dipanggil pipeline aktif; tetap berfungsi untuk video #1–#26)
`produksi.sh`, `gerbang.mjs` (+ `checklist/`), `cek-sutradara.mjs`, `cek-visual.py`, `cek-gerak.sh` (+ `gerak-target.json`), `animatic.mjs`, `ref-analyze.py` (+ `requirements-ref.txt`, `ref-analyze.SUMBER.txt`).
