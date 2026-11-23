# Keputusan user yang berlaku (satu sumber kebenaran)
Tambahkan baris baru di bawah, jangan mengedit yang lama (beri tanggal). Bila dokumen lain bertentangan, file ini menang.

| Tanggal | Keputusan | Sumber |
|---|---|---|
| 9 Nov | Setelah video selesai, PR ke `main` dan Claude merge sendiri | `WORKFLOW.md` langkah 7 |
| 11 Nov | Hasil jadi (MP4, cover, info) disimpan di Google Drive, bukan GitHub | `CLAUDE.md` |
| 11 Nov | Platform utama YouTube Shorts (Facebook hanya cadangan; TikTok untuk repo RAKA) | `CLAUDE.md` |
| 11 Nov | VO cukup 1 take (hemat kredit ElevenLabs) | `CLAUDE.md` |
| 12 Nov | Mode cepat konfirmasi: ACC wajib hanya di 2 titik (naskah dan contact sheet) | `WORKFLOW.md` 0.6 |
| 13 Nov | Sebelum VO final selalu tanya: Gemini TTS atau ElevenLabs | `CLAUDE.md` |
| 13 Nov | Durasi video fleksibel, naik bertahap (patokan Riri ±2,2 kata/dtk) | `WORKFLOW.md` 2 |
| 13 Nov | SFX bersama di `remotion/public/sfx/` (tidak disalin per video) | `style/aset.md` |
| 13 Nov | Template video baru: salin video terbaru yang sejenis (bukan selalu `v08`); kamera 2,5D ada di `v13` | `WORKFLOW.md` 5 |
| 13 Nov | Animatic ringan: `node tools/animatic.mjs NN` dicek/ACC sebelum animasi | `WORKFLOW.md` 5 |
| 14 Nov | Identitas channel = sistem (kartu terang, kicker, tipografi, bentuk membulat, peran warna), bukan warna latar; latar boleh berganti lewat palet (`style/palet.json`) | `style/identitas.md` |
| 14 Nov | `cek-sutradara` memeriksa animasi, bentuk, warna; `cek-visual.py` memeriksa perpaduan warna dari still | `.claude/skills/sutradara/SKILL.md` F |
| 16 Nov | Setiap video selesai: PR ke `main` lalu Claude langsung merge sendiri (semua channel); cek nomor video terakhir di `main` sebelum mulai | `STATUS.md` |
| 23 Nov | E1: semua aset visual dibuat dari kode (Remotion + Three.js + React/TS + CSS/SVG); API AI eksternal untuk gambar/video/3D/tekstur dilarang; AI hanya asisten kode; cek `node tools/cek-mandiri.mjs`. Struktur workflow, gerbang approval, evaluasi tidak berubah | `WORKFLOW.md`, `e1/AUDIT-ketergantungan-api.md` |
