---
name: motion-skills
description: Router ke pustaka 56 skill motion lokal (iart-ai, di pustaka-skill/motion/). Pakai di fase 4 (perencanaan visual) dan 5 (produksi visual) setiap video, atau saat butuh teknik animasi (isometrik, kamera three.js, partikel, diagram, tipografi, subtitle, ritme, warna). Jangan memuat semua skill; pilih dulu lewat registry.
---

# Router pustaka skill motion

1. Cari kandidat: `node tools/pilih-skill.mjs "<tugas visual>" [--fase 4|5|6|7|8]`.
   Daftar lengkap & status: `pustaka-skill/REGISTRY.md` (utama / cocok / terbatas / dilarang / tidak-relevan).
2. Baca HANYA `SKILL.md` skill terpilih (path dari router), lalu `references/` bila perlu.
3. Terapkan menurut `pustaka-skill/INTEGRASI.md`: satu renderer Remotion di `remotion/`, satu `ThreeCanvas`, gerak dari `useCurrentFrame`, tanpa API AI, hemat CPU.
4. Identitas visual `style/gaya-e1-03.md` menang atas saran gaya skill mana pun.
5. Catat skill yang dipakai per adegan di log video `e1/eNN-*.md`.

Skill inti gaya E1-03: `explainer-video-skills/isometric-animation` + `webgl-animation-skills/threejs-animation` (+ `motion-design-skills/shot-composition`, `animation-principles` untuk perencanaan dan rasa gerak).
