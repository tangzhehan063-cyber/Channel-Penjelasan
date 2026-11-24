# Kartu teknik (status per 24 Nov 2026; uji: container CPU/SwiftShader, tanpa GPU)

Kolom **Gaya**: ✔ sesuai spesifikasi (stylized/flat) · ○ boleh bila perlu · ✘ tidak sesuai (jangan direkomendasikan). Versi 23–24 Nov dengan kartu cahaya low-key/kabut/material berrelief: `arsip/v3-24nov/skills-remotion-fitur/kartu-teknik.md`.

Status: **V** = terverifikasi jalan (render dilihat) · **G** = gagal di lingkungan CPU ini · **?** = belum diuji. Biaya render: rendah/sedang/tinggi relatif di swangle (video penuh ±10 mnt per 58 dtk sebagai pembanding).
Format: *apa* · *komunikasi* · *pakai bila* · *jangan bila* · *kombinasi* · *syarat* · *biaya* · *implementasi di repo* · *status*.

## 2D SVG/CSS (default)
- **Ilustrasi datar bertingkat detail A/B/C** (SVG: isian, outline tipis, bayangan alas) · objek dikenali · hampir semua scene · detail berlebihan · bayangan elips lembut; level C = lapisan terang/gelap berpotongan klip · rendah · `docs/visual-system/style-board/*.html` (contoh) · **V** · Gaya ✔
- **Path draw / garis tergambar** (`stroke-dasharray` dari frame) · hubungan, jalur, anotasi · menunjukkan sambungan/aliran · dekoratif · SVG · rendah · `e1/lib/anot.tsx` (label bergaris) · **V** · ✔
- **Aliran sepanjang jalur** (titik/garis berwarna aksen berjalan pada path) · listrik/air/panas/tekanan · mekanisme yang butuh aliran · bila arah/urutan tak pasti (akurasi) · `getPointAtLength` atau interpolasi seed · rendah · — · **?** (belum dibuat) · ✔
- **Terurai/menyatu (gap seragam)** · komponen dan hubungan · how-it-works · tanpa menerangkan hubungan · translate bertahap, lapisan bawah dulu · rendah · `kit/objek/*` (isometrik lama, referensi) · **V** (lama) · ○
- **Mask / `clip-path` / reveal** · pengungkapan, jendela pembesar · pembesaran detail, penampang · menutup informasi · CSS · rendah · `e1/lab/LabTransisi.tsx` (peel/push) · **V** · ✔
- **Layering / parallax 2D (geser/zoom lapisan)** · kedalaman, "kamera" 2D · lapisan jelas · lapisan tipis tak terasa · CSS transform · rendah · `e1/lab/LabFoto.tsx` (`layers`) · **V** · ✔
- **Bar/penghitung/penanda ukur tetap, split screen, before/after** · perbandingan dan perubahan · angka bersumber · beda tak relevan · CSS/SVG · rendah · `kit/teks.tsx` (`Chip`), `lab/shared.tsx` · **V** · ✔
- **Tipografi: penekanan, label, angka** · opsional · menekankan/menyampaikan data · mengisi layout · CSS · rendah · `kit/teks.tsx`, `e1/lib/anot.tsx` · **V** · ✔
- **Grain halus (SVG `feTurbulence`), vignette gradien** · penyatu tekstur · hemat (≤0,12) · berlebihan membuat kusam · SVG/CSS · rendah · `lab/shared.tsx` `Grain` · **V** · ○
- **Grading CSS (`filter`)** · penyatu foto dan ilustrasi bila perlu · opsional · memaksakan treatment · CSS · rendah · `Tanah02.tsx` · **V** · ○

## Transisi
- **Garis tergambar + strip jatuh ("peel")**, **dorong ke objek ("push")** · bermotif spasial · ada garis/objek jangkar · hiasan · CSS · rendah · `e1/lab/LabTransisi.tsx` · **V** · ✔
- **`@remotion/transitions`: `iris`, `crossZoom`, `pushCut`** · fokus bulat/blur radial/potong · hanya bila motivasinya jelas (pusat iris dapat diatur) · hiasan · jalan di CPU · sedang · `LabTransisi` · **V** (presentasi lain `cube, flip, ripple, dissolve, ...` **?**; `TransitionSeries.Transition` memendekkan timeline) · ○

## Foto diolah
- **Crop/pan/zoom, mask, anotasi, compositing dengan ilustrasi** · bukti/konteks · konten butuh · foto sebagai latar saja · CSS/SVG · rendah · `e1/lib/footage.tsx` (bidang three.js), `lab/shared.tsx` (`Pita`) · **V** · ✔ (resolusi: ±1,8× untuk 1024 px)
- **Duotone/posterize via CSS (`filter`, `mix-blend-mode`)** · treatment grafis opsional · bila cocok dengan video · diwajibkan demi konsistensi · CSS · rendah · — · **?** (belum diuji khusus) · ○
- **Parallax foto: lapisan CSS (halus) / bidang three.js bertopeng (kuat, topeng harus bersih)** · kedalaman · foto berlapis jelas · topeng kasar · three.js/CSS · rendah-sedang · `lab/LabFoto.tsx` · **V** · ○

## 3D terstilisasi (hanya bila perlu)
- **Primitif membulat, material datar/3 nada, `Edges` tipis, satu arah cahaya, latar ilustrasi** · volume/rotasi/penampang yang menolong · benda banyak sisi, exploded ruang · bila 2D lebih jelas · three.js, `@react-three/drei` `Edges` · sedang · `kit/prim.tsx`, `kit/objek/*` (gaya lama terstilisasi) · **V** (lama) · ✔
- **Bidang potong three.js (`localClippingEnabled`)** · penampang 3D · potongan memang harus 3D · bila 2D cukup · cap per padatan, kamera tak masuk padatan · sedang-tinggi · `e1/Pilot02B.tsx` (gaya semi-realistis; pakai hanya teknik klipnya) · **V** · ○
- **Material prosedural berrelief, cahaya low-key/lampu titik/rim, kabut, env map** · realistis/sinematik · — · **tidak direkomendasikan** (bukan identitas) · — · tinggi · `e1/look.tsx`, `Pilot02C.tsx` · **V** · ✘

## Efek Remotion, blur, suara
- **`@remotion/effects` (light-leak, film-burn, glow, halftone, chromatic-aberration, vignette, noise, duotone, ...)** · efek film · glow/leak umumnya bukan gaya (✘ default) · — · hanya `Img`/`Solid`/`HtmlInCanvas`/`Video`, impor per sub-path, rentang parameter · tak diketahui · — · **G** di CPU ini (0/20); GPU **?** · ✘/○
- **Motion blur (`CameraMotionBlur`)** · gerak cepat pendek · jarang diperlukan · menurunkan keterbacaan · render N× per frame · tinggi · — · **?** · ○
- **Audio-reaktif (`@remotion/media-utils`)** · gerak dari suara · bila suara pemicu visual · dekorasi · .wav · rendah · — · **?** · ○
- **SFX tersintesis + ambience + campuran** · bobot, ruang, hening · keputusan sutradara per shot · menutupi VO · loudnorm −15..−13 LUFS · `tools/make_sfx*.py`, `tools/mix-audio.mjs` (perlu adaptor untuk E1), `remotion/public/sfx/` · **?** · ✔

## Kamera dari data
- **`e1/lib/kamera.ts` (`kameraShots`)** · kamera 3D dari `shots.json` · bila ada 3D bershot · — · — · tidak ada · **V** · ○
