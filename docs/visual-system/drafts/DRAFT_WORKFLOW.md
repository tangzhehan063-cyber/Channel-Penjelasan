# WORKFLOW E1 v4 (DRAFT): dokumenter penjelasan bergaya, sadar-konten

> Draf, belum berlaku. Menggantikan `WORKFLOW.md` v3 (akan diarsipkan). Aturan keras: `CLAUDE.md`. Gaya: `docs/visual-system/VISUAL_STYLE_SPEC.md`. Keputusan visual dipimpin skill `sutradara`; spesialis dipanggil sesuai kebutuhan (`breakdown`, `remotion-fitur`, `script-writer`). **Jangan birokratis:** jangan menanyakan ulang yang sudah jelas; jangan mengulang approval yang tidak perlu.

Berkas per video (`NN`): `e1/NN/brief.md`, `riset/<tgl>-<slug>.md`, `e1/NN/arah-visual.md`, `naskah/e1-NN-<slug>.*`, `e1/NN/storyboard.md`, `e1/NN/qa.md`, log `e1/eNN-*.md`. Kecil dan cukup; jangan membuat berkas yang tak dipakai.

## 1. Brief + kategori
- **Input:** topik. **Tugas:** pastikan topik, kategori (Breakdown/How it works · Mitos vs Fakta · Fenomena/Science · Perbandingan · Cerita/Investigasi · Hybrid: dominan + pendukung), tujuan, apa yang harus dipahami penonton, preferensi visual. Tanyakan **hanya yang belum jelas**; bila kategori jelas dari topik, rekomendasikan dan minta konfirmasi singkat.
- **Output:** `brief.md` (setengah halaman). **Selesai bila:** kategori dikonfirmasi. **Wajib untuk proyek baru** sebelum keputusan kreatif besar.
## 2. Analisis konten
- Riset (min. 2 sumber per klaim utama, `[CEK]` bila belum pasti), audiens, informasi penting, konsep sulit, potensi visual: bagian yang butuh demonstrasi, lingkungan, breakdown, diagram, simulasi. Catat bukti visual (foto yang perlu dicari pemilik: nama berkas + spesifikasi).
- **Output:** `riset/…md` + bagian analisis di `brief.md`.
## 3. Arah visual
- **Tugas:** `sutradara` menetapkan identitas (spesifikasi), art direction, palet (preset atau variasi terkendali), bentuk objek dan tingkat detail, lingkungan, perspektif, pendekatan animasi. Bila arah belum pernah ditetapkan untuk seri/kategori ini: 2–3 alternatif yang benar-benar berbeda (art direction, bentuk, komposisi, palet, cara menggambar objek, cara animasi, kelebihan, kekurangan, kenapa cocok), maksimal; tanpa alternatif formalitas.
- **Output:** `arah-visual.md`. **ACC:** bila arah baru; setelah disepakati tidak diubah tanpa alasan dan persetujuan.
## 4. Naskah
- `script-writer`: tulis untuk telinga, 110–155 kata (50–70 dtk), CTA tetap; tidak dipaksa menyesuaikan teknik visual; visual dan narasi saling mendukung. Humanizer. **ACC naskah** (dikunci sebelum produksi).
## 5. Storyboard (dirancang sebelum kode)
- **Tugas:** per shot: narasi · tujuan bercerita · konsep visual · komposisi · subjek dan posisinya · latar · hierarki · sudut kamera · gerak kamera (bila perlu) · gerak objek · **urutan animasi (bagaimana objek dianimasikan untuk menjelaskan)** · transisi · durasi · pendekatan teknis. Visual memperjelas/menguatkan/menambah, bukan mengulang narasi harfiah. Komposisi sama untuk beberapa shot boleh bila perubahan objek progresif lebih efektif; komposisi baru bila bermakna. Sketsa SVG kasar per shot (bukan tangkapan render).
- **Output:** `storyboard.md` (template: `sutradara/referensi/templat-storyboard.md`).
## 6. Review
- Tampilkan storyboard (dan arah visual bila baru). **ACC sebelum coding.** Dilewati (cukup dilaporkan) bila storyboard hanya menurunkan arah yang sudah disetujui tanpa keputusan kreatif besar baru.
## 7. Produksi
- Remotion, React, SVG, CSS, Canvas bila relevan, three.js hanya bila benar-benar perlu (3D terstilisasi). Tanpa AI image/video/3D API. VO: tanya Gemini atau ElevenLabs; `align_teks.py`; desain suara (SFX/ambience/hening) sesuai storyboard.
- **Gerbang teknis:** `node tools/cek-mandiri.mjs`, `python3 tools/cek_kilau.py` (bila 3D), `python3 tools/cek_suara.py`, `tsc`. Render kecil dulu (still/klip), render penuh sekali.
## 8. Visual QA
- Tonton render aktual (`python3 tools/review_video.py` untuk strip/klip). Periksa: kejelasan, komposisi, konsistensi gaya (spesifikasi §17), animasi (urutan sebab-akibat terbaca), timing, transisi, hierarki, repetisi, storytelling, kesesuaian narasi. Kode berhasil dan render tanpa galat **bukan** bukti video bagus. Gagal → perbaiki shot terkait, bukan tambal teks.
- **Output:** `qa.md` (jujur, termasuk sisa kelemahan). **ACC publikasi**; caption + komentar pin (humanizer), cover, Drive, MP4 dikirim ke pemilik.

## Sumber daya dan kerja
Render lambat (swangle ±10 mnt per ±58 dtk; 2D SVG/CSS jauh lebih cepat). Perbarui `STATUS.md`; commit/push ke cabang kerja; bug baru → `style/cek-bug.md`.
