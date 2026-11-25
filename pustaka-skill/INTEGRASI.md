# Aturan integrasi pustaka skill motion

Pustaka: `pustaka-skill/motion/` = 19 paket iart-ai (MIT), 56 skill, disalin utuh (SKILL.md, references, scripts, LICENSE). Asal dan commit: `SUMBER.txt`. Media demo pemasaran >300 KB (showcase.gif, contoh mp4) tidak disimpan (`media-dibuang.txt`); instruksi skill tidak berubah.
Lapisan channel hanya tiga file: `kompatibilitas.json` (status, fase, kata kunci, catatan), `registry.json`/`REGISTRY.md` (dibuat `node tools/skill-registry.mjs`), dan dokumen ini. **SKILL.md asli tidak diedit**; perbedaan aturan ditulis di `kompatibilitas.json`.

## Cara memuat (selektif, jangan memuat semua)
1. `node tools/pilih-skill.mjs "<tugas visual>" [--fase N]` → 1–3 kandidat beserta path dan aturan channel.
2. Baca SKILL.md kandidat terpilih saja. Baca file `references/` hanya bila langkahnya membutuhkan.
3. Ikuti alur dan teknik skill, lalu terjemahkan ke arsitektur proyek (di bawah). Catat skill yang dipakai di log video (`e1/eNN-*.md`).
4. Skill baru/ diperbarui: salin ke `pustaka-skill/motion/<paket>/`, nilai di `kompatibilitas.json`, jalankan `node tools/skill-registry.mjs` (gagal bila ada skill belum dinilai).

## Urutan kewenangan (bila bertentangan)
`KEPUTUSAN.md` (keputusan user) → `CLAUDE.md` → `style/gaya-e1-03.md` (identitas visual) → `WORKFLOW.md` (fase) → dokumen ini + `kompatibilitas.json` → SKILL.md pustaka.
Skill pustaka mengajarkan TEKNIK; ia tidak boleh mengubah identitas visual, urutan fase, atau batasan teknis.

## Penerjemahan ke proyek (wajib)
- **Satu renderer: Remotion di `remotion/`.** Jangan `npm init`, jangan proyek/komposisi baru di luar `remotion/src/`, jangan pasang renderer lain (HyperFrames, Manim, After Effects, Lottie player baru, Vite/Next). Deliverable "satu file HTML" dari skill = adegan Remotion (`remotion/src/e1/<Video>.tsx`).
- **Harness `?t=N` skill = `npx remotion still <Komposisi> --frame=N`**; contact sheet = `tools/pratinjau.sh`. Skrip `scripts/` skill (seek-shot, contact-sheet, probe-mp4) boleh dipakai bila cocok, tanpa memasang dependensi baru.
- **Waktu:** semua gerak fungsi `useCurrentFrame()` (via `t = frame/30`); tanpa `useFrame`, `Clock`, `Date`, `Math.random()` tanpa seed, CSS transition, timeline GSAP yang berjalan sendiri. Easing skill → `Easing` Remotion / fungsi `r()` di `kit/waktu.ts`.
- **Three.js:** SATU `ThreeCanvas` per komposisi (berganti kanvas = frame rusak). Tampilan isometrik = kamera perspektif tele FOV ±3° (`tele()` di `remotion/src/e1/Tiang03.tsx`). Komponen, `THREE.Shape`, geometri, tekstur dibuat di tingkat modul atau `useMemo`, tidak di dalam komponen lain.
- **Tanpa API AI** untuk gambar/video/3D/tekstur/musik (`node tools/cek-mandiri.mjs`). Skill berstatus `dilarang` tidak dipakai; bagian skill yang memanggil layanan AI (mis. `soundtrack/references/ai-music.md`, Whisper/ElevenLabs transkripsi) diganti alat lokal proyek (`tools/align_teks.py`).
- **Biaya CPU (cloud tanpa GPU, swangle):** tidak memakai bloom/DOF/SSAO, motion blur multi-sampel, shadow map > 2048, shader layar penuh, ribuan partikel, atau adegan 3D penuh bila 2,5D/SVG cukup. Efek yang hanya demo dalam skill tidak diikutkan.
- **Pratinjau dulu:** still → contact sheet → render potongan adegan (`tools/render-bagian.sh --dari --sampai`). Render penuh hanya di fase 7.
