---
name: remotion-fitur
description: [Dipakai untuk teks/penyusunan E1 dan video 3D lama] Aturan Remotion + three.js dan fitur peningkat kualitas (transisi, light leak, color correction, motion blur, audio-reaktif) untuk video "fakta rumah". Pakai saat Tahap 4–5 (animasi/render) atau saat user minta video lebih halus/"mahal".
---

# Remotion: aturan & fitur siap pakai

> **STATUS (E1):** visual E1 = keyframe AI → image-to-video, bukan Remotion/three.js. Skill ini tetap dipakai bila Remotion dipakai untuk **teks overlay, penyusunan, subtitle, transisi, color correction, light leak**, atau untuk video 3D lama. Bagian aturan 3D wajib dan teknik isometrik hanya relevan untuk adegan three.js. Teks overlay tidak boleh bergantung pada generator AI (lihat `WORKFLOW.md` Step 7).


Paket sudah terpasang di `remotion/package.json` (versi harus sama dengan `remotion`, saat ini 4.0.541):
`@remotion/three`, `@remotion/transitions`, `@remotion/motion-blur`, `@remotion/effects`, `@remotion/media-utils`, `@remotion/captions`.
Bila plugin resmi **Remotion** aktif di sesi, skill `remotion-markup` (3d, transitions, light-leaks, color-correction, motion-blur, audio-visualization) adalah rujukan detail. Sumber: github.com/remotion-dev/skills, remotion.dev/docs.

## Aturan wajib 3D (kalau dilanggar → flicker saat render)
- Semua 3D di dalam `<ThreeCanvas width height>` dari `@remotion/three`, dengan lampu.
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

## Teknik isometrik untuk video "bongkar lapisan" (diuji 17 Nov 2026, dari skill isometric-animation)
Pakai HANYA untuk satu tumpukan/objek besar yang mengisi layar (keramik, lantai, dinding berlapis, exploded view). DILARANG untuk diorama lebar, kota, atau denah kecil (aturan KUNCI KARAKTER di `CLAUDE.md`). Tiga aturan:
1. **Kamera ortografis, posisi X=Y=Z**: `<ThreeCanvas orthographic camera={{position: [10, 10, 10], zoom: ..., near: 0.1, far: 100}} onCreated={({camera}) => camera.lookAt(0, y, 0)}>`. Perspektif BUKAN isometrik. Atur `zoom` supaya objek tidak terpotong sisi layar (uji: zoom 190 terlalu besar untuk balok 4,2 m, turunkan sampai tepi terlihat).
2. **Shading per sisi dari satu arah cahaya**: atas paling terang, kiri sedang, kanan paling gelap (mis. `directionalLight position={[-5, 9, 4]}` + ambient ±0,55) dan garis tepi tipis `<Edges color="#1c1c1e" lineWidth={1.5} />`. Arah cahaya tidak boleh berubah antar-adegan. Inilah yang membuat volume terbaca.
3. **Naikkan lewat posisi Z/Y, jangan di-scale**; build/explode di-stagger menurut posisi fisik (lapisan bawah dulu), jarak antar-lapisan dari satu variabel `gap` bersama (`gap = r(t, a, b) - r(t, c, d)` untuk explode lalu rakit). Skala hanya untuk muncul (0→1) pada tahap awal.
Verifikasi: `remotion still` di awal, tengah, akhir; periksa sudut sumbu, urutan Z, tidak ada z-fighting, lapisan terakhir duduk tepat.

## Setelah memakai fitur baru
- Catat bug yang muncul di `style/cek-bug.md`.
- Bila user suka, jadikan baku di template video berikutnya dan catat di `STATUS.md` (Preferensi user).
