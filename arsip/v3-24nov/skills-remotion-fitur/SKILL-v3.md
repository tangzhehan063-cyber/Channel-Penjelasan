---
name: remotion-fitur
description: Konsultan teknik visual untuk E1 (Remotion 4.0.541 + three.js 0.187, 100% kode). Dipanggil SETELAH keputusan kreatif oleh sutradara untuk memilih teknik, komponen, strategi implementasi, kode ulang-pakai, dan biaya render: transisi, masking, grading, cahaya/atmosfer, blur, tekstur, partikel, tipografi, audio-reaktif, simulasi, kamera, material prosedural. Setiap teknik punya kartu dengan status verifikasi nyata (kartu-teknik.md). Aturan wajib 3D di berkas ini; teknik isometrik lama ada di legacy/.
---

# Remotion-fitur: konsultan teknik (bukan katalog)

Peran: menerjemahkan keputusan kreatif `sutradara` menjadi implementasi yang **benar-benar jalan di lingkungan render**. Jangan memilih efek karena ada; pilih karena komunikasi yang diminta shot. Bila tak ada teknik yang cocok, usulkan padanan CSS/SVG/three.js yang terbukti.

## Cara bekerja
1. Terima dari `sutradara`: konsep shot, `shots.json`/`direction.md`, kendala.
2. Buka `kartu-teknik.md`: cari teknik per kebutuhan (komunikasi, bukan nama efek). Cek **status verifikasi** dan **biaya render**.
3. Pilih implementasi paling sederhana yang mempertahankan dampak; bila status `gagal`/`tak-terverifikasi`, pakai padanan `terverifikasi` atau uji dulu dengan still kecil.
4. Gunakan komponen yang sudah ada (kolom "Implementasi di repo"): `e1/lib/` (kamera dari data, bidang foto, label), `e1/look.tsx` (material), `e1/Pilot02B.tsx` (bidang potong), `e1/lab/` (contoh eksperimen), `kit/`.
5. Laporkan ke `sutradara`: apa yang dipakai, apa yang tak bisa, biaya render. Jangan mengubah keputusan kreatif sendiri.

## Aturan wajib 3D (flicker bila dilanggar)
- Semua 3D di dalam `<ThreeCanvas width height>` (`@remotion/three`) dengan lampu; `<Sequence>` di dalamnya `layout="none"`.
- Semua gerak dari `useCurrentFrame()`. **Dilarang** `useFrame()`, `Math.random()` tanpa seed, `Date.now()`, animasi bawaan model/shader yang berjalan sendiri.
- Tanpa API AI (`node tools/cek-mandiri.mjs`), tanpa unduhan saat render. Tekstur/foto lewat `staticFile`; foto dimuat dengan `delayRender` (`e1/lib/footage.tsx`).
- Z-fighting: lulus `python3 tools/cek_kilau.py` (`style/cek-bug.md`). Kamera tidak boleh masuk ke padatan.
- Glow/bloom/partikel/neon boleh bila bermotif (cahaya, lampu); bukan hiasan.

## Lingkungan render (fakta terukur, 24 Nov)
Container: tanpa GPU (CPU, ANGLE→SwiftShader), `navigator.gpu` tidak ada, 4 inti. `remotion.config.ts`: `swangle`. Efek canvas `@remotion/effects` **0/20 jalan** di sini; transisi `@remotion/transitions` (termasuk berbasis shader) jalan; CSS/SVG/three.js jalan. Hasil GPU **tidak diketahui**; jangan mengklaimnya. Detail: `docs/visual-system/matriks/HASIL.md`.

## Berkas
`kartu-teknik.md` (kartu per teknik + status) · `legacy/SKILL-asli.md` (isi asli 17-23 Nov: fitur peningkat belum diuji, teknik isometrik KUNCI KARAKTER).
