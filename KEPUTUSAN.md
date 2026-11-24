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
| 23 Nov | E1: skill `breakdown` dipakai selektif per video (hanya shot yang butuh bongkar struktur), Remotion + Three.js saja, tanpa HyperFrames/API AI, bukan workflow terpisah | `WORKFLOW.md` Breakdown |
| 23 Nov | E1: semua aset visual dibuat dari kode (Remotion + Three.js + React/TS + CSS/SVG); API AI eksternal untuk gambar/video/3D/tekstur dilarang; AI hanya asisten kode; cek `node tools/cek-mandiri.mjs`. Struktur workflow, gerbang approval, evaluasi tidak berubah | `WORKFLOW.md`, `e1/AUDIT-ketergantungan-api.md` |
| 23 Nov | E1: naskah 50–70 dtk (±110–155 kata), tidak terlalu pendek dan tidak terlalu panjang; disisipi perbandingan kasus nyata (real-life) yang dicari sendiri, bersumber dan berlisensi | `WORKFLOW.md` Perbandingan real-life |
| 23 Nov | Topik E1 dicari sendiri (bukan dari usulan awal); contoh topik dari user hanya ilustrasi | chat |
| 23 Nov | Creative Overhaul: workflow E1 v3 10 tahap (riset, sudut cerita, naskah, audit cerita, arahan visual, shot list, storyboard, animatic, produksi, visual QA); ACC pemilik di topik+angle, storyboard, animatic | `WORKFLOW.md`, `PROPOSAL_ARCHITECTURE.md` |
| 23 Nov | Skill `sutradara`, `remotion-fitur`, `breakdown` digabung jadi `visual-director`; aturan KUNCI KARAKTER, tata letak tetap, gerbang T1-T7, `cek-sutradara` diarsipkan (batasan kreatif). Aturan konsistensi (skala, warna peran, material, model, anti-bug) dipertahankan | `.claude/skills/visual-director/`, `arsip/` |
| 23 Nov | Subtitle default MATI; didukung: subtitle penuh bila diminta, teks penekanan selektif, label informasi, data/anotasi. Visual harus bisa dipahami tanpa subtitle penuh | `CLAUDE.md`, `style/visual/teks.md` |
| 23 Nov | Pilot Creative Overhaul memakai #02 (sequence 20,4-31,0 dtk) dengan foto rumah-ditinggikan; transisi footage ke 3D harus menjelaskan hubungan objek nyata dan mekanisme | `e1/02/`, `CHANGELOG_CREATIVE.md` |
| 24 Nov | Identitas: stylized/flat illustration; detail B default (A/C fleksibel), outline tipis opsional, kartu/kicker/hook opsional, foto fleksibel, peran warna + preset (krem salah satu); bukan semi-realistis/PBR/CGI; teknik SVG/CSS → 2.5D → 3D terstilisasi | `docs/visual-system/VISUAL_STYLE_SPEC.md` |
| 24 Nov | Workflow 8 langkah (brief+kategori → analisis → arah visual → naskah → storyboard → review → produksi → QA), anti-birokrasi; kategori video wajib dipastikan di proyek baru; breakdown hanya bila perlu | `WORKFLOW.md`, `CLAUDE.md` |
| 24 Nov | Papan kategori = contoh visual language, bukan template; delapan langkah animasi = panduan berpikir; akurasi mekanisme dijaga; kualitas animasi prioritas | `VISUAL_STYLE_SPEC.md` §0 |
