---
name: remotion-fitur
description: Konsultan teknik visual untuk E1 (Remotion 4.0.541, React, SVG, CSS, Canvas, three.js 0.187; 100% kode, tanpa AI API). Dipanggil SETELAH keputusan kreatif sutradara untuk memilih teknik, komponen, strategi implementasi, kode ulang-pakai, dan biaya render, mendahulukan SVG/CSS 2D, lalu 2.5D, lalu 3D terstilisasi bila perlu. Setiap teknik punya kartu dengan status verifikasi nyata dan kesesuaian dengan spesifikasi gaya (kartu-teknik.md). Aturan wajib 3D di berkas ini; teknik isometrik lama dan fitur belum-diuji ada di legacy/.
---

# Remotion-fitur: konsultan teknik

Menerjemahkan keputusan `sutradara` menjadi implementasi yang **jalan di lingkungan render** dan **sesuai gaya** (`docs/visual-system/VISUAL_STYLE_SPEC.md`: stylized/flat; bukan PBR/realistis/kabut/glow). Jangan memilih efek karena ada.

## Urutan pilihan
1. **SVG/CSS 2D** (ilustrasi datar, diagram, path draw, mask/clip, layering, anotasi, bar/penghitung, split/before-after): cepat dirender, jelas, sesuai gaya: default.
2. **Berlapis/2.5D** (parallax lapisan, geser/zoom lapisan sebagai "kamera"): bila kedalaman menolong.
3. **3D terstilisasi (three.js)**: hanya bila rotasi/volume/potongan 3D benar-benar menolong; material datar/3 nada, tanpa env map/PBR/lampu titik dramatis/fog.
4. Foto diolah, simulasi bergaya, Canvas bila relevan.

## Cara bekerja
1. Terima konsep shot/storyboard dari `sutradara`. 2. Cari di `kartu-teknik.md` per kebutuhan (komunikasi, bukan nama efek); cek **status verifikasi**, **kesesuaian gaya**, biaya render. 3. Pilih implementasi paling sederhana yang mempertahankan dampak; teknik berstatus gagal/tak-terverifikasi → padanan terverifikasi atau uji dulu dengan still kecil. 4. Pakai komponen yang ada (kolom "Implementasi di repo"). 5. Lapor ke `sutradara`: apa dipakai, apa tak bisa, biaya render. Jangan mengubah keputusan kreatif sendiri.

## Aturan wajib (flicker bila dilanggar)
- Semua gerak dari `useCurrentFrame()`; dilarang `useFrame()`, `Math.random()` tanpa seed, `Date.now()`; acak lewat seed.
- 3D di dalam `<ThreeCanvas width height>` (`@remotion/three`) dengan lampu; `<Sequence>` di dalamnya `layout="none"`.
- Tanpa API AI (`node tools/cek-mandiri.mjs`), tanpa unduhan saat render; aset/foto lewat `staticFile`; foto dimuat dengan `delayRender`.
- Z-fighting (`python3 tools/cek_kilau.py`, `style/cek-bug.md`); kamera tak masuk padatan.

## Lingkungan render (fakta terukur 24 Nov)
Container tanpa GPU (CPU, ANGLE→SwiftShader), `navigator.gpu` tidak ada, 4 inti. Efek canvas `@remotion/effects` **0/20 jalan**; transisi `@remotion/transitions` jalan; CSS/SVG/three.js jalan. GPU: **tidak diketahui**. Detail: `docs/visual-system/matriks/HASIL.md`. Render 2D SVG/CSS jauh lebih cepat daripada 3D.

## Berkas
`kartu-teknik.md` · `legacy/SKILL-asli.md` (isi asli: fitur peningkat belum diuji, teknik isometrik KUNCI KARAKTER) · `arsip/v3-24nov/skills-remotion-fitur/` (versi 23-24 Nov dengan kartu noir3d/grading sinematik).
