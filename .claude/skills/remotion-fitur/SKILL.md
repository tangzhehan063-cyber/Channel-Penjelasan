---
name: remotion-fitur
description: Fitur Remotion + three.js untuk adegan video "Fakta Rumah" gaya E1-03 (aturan 3D wajib, transisi, grading, efek, gerak ikut suara). Pakai di fase 5–6 (produksi visual, integrasi) bersama router `motion-skills`.
---

# Remotion: aturan & fitur siap pakai

> **STATUS (25 Nov 2026):** gaya aktif = E1-03 (`style/gaya-e1-03.md`), urutan kerja `WORKFLOW.md`, teknik animasi tambahan dari pustaka skill (`node tools/pilih-skill.mjs`, aturan `pustaka-skill/INTEGRASI.md`). Wajib: gerak hanya fungsi `useCurrentFrame`, acak ber-seed, aset lewat `staticFile`, `node tools/cek-mandiri.mjs` sebelum render.


Paket sudah terpasang di `remotion/package.json` (versi harus sama dengan `remotion`, saat ini 4.0.541):
`@remotion/three`, `@remotion/transitions`, `@remotion/motion-blur`, `@remotion/effects`, `@remotion/media-utils`, `@remotion/captions`.
Bila plugin resmi **Remotion** aktif di sesi, skill `remotion-markup` (3d, transitions, light-leaks, color-correction, motion-blur, audio-visualization) adalah rujukan detail. Sumber: github.com/remotion-dev/skills, remotion.dev/docs.

## Aturan wajib 3D (kalau dilanggar → flicker saat render)
- Semua 3D di dalam SATU `<ThreeCanvas width height>` dari `@remotion/three` per komposisi, dengan lampu. Jangan berganti kanvas (perspektif ↔ ortografis) di tengah video: konteks WebGL baru = frame rusak di render panjang (E1 #03).
- Komponen React, `THREE.Shape`, geometri, dan tekstur dibuat di tingkat modul atau `useMemo`, tidak didefinisikan di dalam komponen lain (dibuat ulang tiap frame = memori GPU bocor).
- Semua gerak dihitung dari `useCurrentFrame()`. **Dilarang `useFrame()`** r3f, animasi bawaan model/shader yang jalan sendiri, `Math.random()` tanpa seed, `Date.now()`.
- `<Sequence>` di dalam `<ThreeCanvas>` wajib `layout="none"`.

## Fitur peningkat (belum dipakai di #1–#8, coba bertahap)
Selalu uji dengan still/contact sheet dulu; render penuh di container ini lambat (swangle, tanpa GPU).

1. **Light leak di titik potong beat** — `lightLeak({seed, hueShift, progress})` dari `@remotion/effects/light-leak` pada `<Solid>`. Pasang sebagai overlay pendek (±15–20 frame) di atas pergantian adegan; `progress` 0→1 dari `useCurrentFrame()`. Cocok untuk payoff/twist. Jangan menutupi subtitle (top 1400).
2. **Transisi** — `@remotion/transitions` (`fade`, `slide`, `wipe`, `clockWipe`). PENTING: `<TransitionSeries.Transition>` **memendekkan timeline** (dua adegan tumpang tindih), padahal animasi channel ini dikunci ke detik VO. Pakai `<TransitionSeries.Overlay>` (tidak memendekkan) atau pertahankan `Seg` crossfade di v08 dan tambahkan presentasi sendiri (slide/wipe) di dalamnya.
3. **Color correction / grading** — `colorCorrection({exposure, temperature, contrast, saturation, vibrance, ...})` dari `@remotion/effects/color-correction` lewat prop `effects` pada komponen yang mendukung (`<Solid>`, `<Video>` @remotion/media, dll.). Satu "look" konsisten channel: sedikit hangat, kontras tegas (sesuai preferensi user).
4. **Efek lain di `@remotion/effects`** — `vignette`, `glow`, `film-burn`, `paper`, `halftone`, `chromatic-aberration`, `zoom-blur`, `shine`, dll. Pakai hemat; gaya tetap editorial bersih.
5. **Motion blur** — `<CameraMotionBlur samples shutterAngle>` merender anak **N kali per frame** → waktu render ×N. Hanya untuk potongan pendek bergerak cepat (mis. sekrup "lepas", kamera menukik), samples 4–6. `<HtmlInCanvasMotionBlur>` butuh dukungan HTML-in-canvas Chromium; uji still dulu dengan Chromium `/opt/pw-browsers/chromium`, kalau gagal pakai `CameraMotionBlur`.
6. **Gerak mengikuti suara VO** — `useWindowedAudioData()` + `visualizeAudio()` dari `@remotion/media-utils` (pakai `.wav`). Contoh: label/objek "berdenyut" mengikuti volume narator, atau burst "TEK" mengikuti SFX.

## Teknik isometrik gaya E1-03 (skill pustaka `isometric-animation`)
Tampilan isometrik/denah/breakdown = **kamera perspektif tele** (FOV ±3°, jarak = (1920/zoom/2)/tan(1,5°)) di kanvas yang sama dengan adegan perspektif; lihat `tele()`, `Rig2`, `proj2`, `Kabut` di `remotion/src/e1/Tiang03.tsx`. Kabut diatur lewat `scene.fog` near/far (mode tele: jauh).
Aturan dari skill: satu arah cahaya untuk semua adegan; naikkan lewat posisi Y, bukan skala; build/explode berurutan dari bawah; gerak kamera kecil dan pelan. Verifikasi dengan `tools/pratinjau.sh` (awal, tengah, akhir adegan): sumbu, urutan kedalaman, tanpa z-fighting, lapisan terakhir duduk tepat.

## Setelah memakai fitur baru
- Catat bug yang muncul di `style/cek-bug.md`.
- Bila user suka, catat di `KEPUTUSAN.md`/`style/gaya-e1-03.md` dan `STATUS.md`.
