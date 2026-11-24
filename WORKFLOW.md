# WORKFLOW E1 v4: penjelasan bergaya, sadar-konten

Menggantikan v3 (arsip: `arsip/v3-24nov/WORKFLOW-v3.md`; v2: `arsip/WORKFLOW-E1-v2-lengkap.md`). Aturan keras: `CLAUDE.md`. Gaya: `docs/visual-system/VISUAL_STYLE_SPEC.md`. Evaluasi eksperimen: `e1/EVALUASI.md`.
Keputusan visual dipimpin skill **`sutradara`**; spesialis dipanggil sesuai kebutuhan (`breakdown`, `remotion-fitur`, `script-writer`). **Tidak birokratis:** jangan menanyakan ulang yang sudah jelas; jangan mengulang approval yang tidak perlu; keputusan kreatif besar yang belum jelas (kategori, arah visual baru) → tanya; sisanya putuskan dan catat.

Berkas per video (`NN`): `e1/NN/brief.md`, `riset/<tgl>-<slug>.md`, `e1/NN/arah-visual.md`, `naskah/e1-NN-<slug>.*`, `e1/NN/storyboard.md`, `e1/NN/qa.md`, log `e1/eNN-*.md` (`e1/_template-log.md`). Buat hanya yang dipakai.

## 1. Brief + kategori
- **Tugas:** pastikan topik, **kategori** (Breakdown / How it works · Mitos vs Fakta · Fenomena / Science · Perbandingan · Cerita / Investigasi · Hybrid: dominan + pendukung), tujuan, apa yang harus dipahami penonton, preferensi visual. Tanyakan **hanya yang belum jelas**; bila kategori jelas dari topik, rekomendasikan dan minta konfirmasi singkat.
- **Output:** `brief.md` (setengah halaman). **Selesai bila:** kategori dan pendekatan visual awal dikonfirmasi. Wajib untuk proyek baru sebelum keputusan kreatif besar; tidak ada naskah/storyboard/kode sebelum ini.
## 2. Analisis konten
- Riset (≥2 sumber per klaim utama, `[CEK]` bila belum pasti), audiens, informasi penting, konsep sulit, potensi visual: bagian yang butuh demonstrasi, lingkungan, breakdown, diagram, simulasi. Catat mekanisme/hubungan yang harus **akurat** dan bukti visual (foto yang dicari pemilik: nama berkas + spesifikasi).
- **Output:** `riset/…md` + bagian analisis di `brief.md`.
## 3. Arah visual
- **Tugas:** `sutradara` menetapkan identitas (spesifikasi), art direction, palet (preset atau variasi terkendali), bentuk objek dan tingkat detail, lingkungan, perspektif, pendekatan animasi dan teknik (SVG/CSS → 2.5D → 3D terstilisasi bila perlu). Bila arah belum pernah ditetapkan untuk seri/kategori ini: **2–3 alternatif yang benar-benar berbeda** (art direction, bentuk, komposisi, palet, cara menggambar objek, cara animasi, kelebihan, kekurangan, kenapa cocok); bukan alternatif formalitas.
- **Output:** `arah-visual.md`. **ACC** bila arah baru; setelah disepakati tidak diubah tanpa alasan dan persetujuan.
## 4. Naskah
- `script-writer`: untuk telinga, 110–155 kata (50–70 dtk), CTA tetap, angka dengan kata (TTS); tidak dipaksa menyesuaikan teknik visual; visual dan narasi saling mendukung; humanizer. **ACC naskah**; dikunci sebelum produksi.
## 5. Storyboard (dirancang sebelum kode)
- **Tugas:** per shot: narasi · tujuan bercerita · konsep visual · komposisi · subjek dan posisinya · latar · hierarki · sudut · gerak kamera (bila perlu) · gerak objek · **urutan animasi** (staging, timing, anticipation, interaksi, sebab-akibat, kejelasan) · transisi · durasi · pendekatan teknis. Visual memperjelas/menguatkan/menambah, bukan mengulang narasi harfiah. Komposisi sama untuk beberapa shot boleh bila perubahan objek progresif lebih efektif; komposisi baru bila bermakna. **Tidak ada jumlah panel/layout/urutan wajib per kategori.** Mekanisme: tuliskan hubungan sebenarnya dan periksa akurasinya.
- **Output:** `storyboard.md` (`.claude/skills/sutradara/referensi/templat-storyboard.md`); sketsa SVG kasar per shot, bukan tangkapan render.
## 6. Review
- Tampilkan storyboard (+ arah visual bila baru). **ACC sebelum coding.** Dilewati (cukup dilaporkan) bila storyboard hanya menurunkan arah yang sudah disetujui tanpa keputusan kreatif besar baru.
## 7. Produksi
- Remotion, React, SVG, CSS, Canvas bila relevan, three.js hanya bila perlu (terstilisasi). Tanpa AI image/video/3D API. VO: tanya Gemini atau ElevenLabs; `tools/align_teks.py`; desain suara sesuai storyboard.
- **Gerbang teknis:** `node tools/cek-mandiri.mjs`, `python3 tools/cek_kilau.py` (bila 3D), `python3 tools/cek_suara.py`, `tsc`. Periksa lewat still/klip pendek dulu; render penuh sekali.
## 8. Visual QA
- Tonton render aktual (`python3 tools/review_video.py`). Periksa: kejelasan, komposisi, konsistensi gaya (spesifikasi §17), animasi (staging, timing, urutan sebab-akibat terbaca), akurasi mekanisme, transisi, hierarki, repetisi, storytelling, kesesuaian narasi. Kode berhasil dan render tanpa galat **bukan** bukti video bagus. Gagal → perbaiki shot terkait.
- **Output:** `qa.md` (jujur, termasuk sisa kelemahan). **ACC publikasi**; caption + komentar pin (humanizer), cover, Drive, MP4 dikirim ke pemilik.

## Kerja
Tidak ada template video default: kit lama (`kit/Penjelasan.tsx`, `beats.json`, kicker/kartu/subtitle terkunci) hanya legacy. Aturan di `arsip/` tidak aktif. Aturan audio tetap manual (`tools/mix-audio.mjs` belum diadaptasi; di luar scope tahap ini).
Render swangle ±10 mnt per ±58 dtk (2D SVG/CSS jauh lebih cepat). Perbarui `STATUS.md`; commit/push ke cabang kerja; bug baru → `style/cek-bug.md`.
