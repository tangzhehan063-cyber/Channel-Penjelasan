# PROPOSAL workflow sadar-konten (versi final untuk review, 24 Nov 2026)

Menggantikan versi sebelumnya. Dasar: `AUDIT_IDENTITAS_DAN_WORKFLOW.md`, `VISUAL_STYLE_SPEC.md`, keputusan pemilik 24 Nov (7 poin + tambahan). **Tidak ada skill, `CLAUDE.md`, `WORKFLOW.md`, atau kode video yang sudah diubah.** Yang ada hanya dokumen di `docs/visual-system/` (termasuk draf isi baru di `drafts/`). Setelah Anda menyetujui, baru diterapkan.

## 1. Alur 8 langkah (praktis, tidak birokratis)
| # | Langkah | Inti | Tanya/ACC hanya bila |
|---|---|---|---|
| 1 | Brief + kategori | topik, kategori, tujuan, apa yang harus dipahami, preferensi visual | belum jelas dari brief. Bila jelas: tulis rekomendasi dan lanjut; satu pertanyaan konfirmasi paling banyak |
| 2 | Analisis konten | riset, audiens, informasi penting, konsep sulit, bagian yang butuh demonstrasi/lingkungan/breakdown/diagram/simulasi | – |
| 3 | Arah visual | identitas dari spesifikasi + pilihan untuk video ini (palet, bentuk, lingkungan, perspektif, pendekatan animasi) | arah **belum pernah ditetapkan** untuk seri/kategori ini → 2–3 alternatif yang benar-benar berbeda, Anda memilih. Bila sudah disepakati: tidak diulang |
| 4 | Naskah | `script-writer` | ACC naskah seperti biasa |
| 5 | Storyboard | per shot: narasi, tujuan, konsep, komposisi, subjek+posisi, latar, hierarki, sudut, gerak kamera (bila perlu), gerak objek, **urutan animasi**, transisi, durasi, pendekatan teknis; sketsa SVG kasar | – |
| 6 | Review | tampilkan storyboard (+ arah visual bila baru) | ACC sebelum coding; **dilewati bila** storyboard hanya menurunkan arah yang sudah disetujui tanpa keputusan kreatif besar baru (cukup dilaporkan) |
| 7 | Produksi | Remotion, React, SVG, CSS, Canvas bila relevan, three.js hanya bila perlu; tanpa AI API | gerbang teknis otomatis |
| 8 | Visual QA | menonton render; kesesuaian gaya (spesifikasi §17) | ACC publikasi |
**Aturan anti-birokrasi:** jangan menanyakan ulang yang sudah ada di brief; jangan mengulang approval yang tidak perlu; keputusan kreatif besar yang belum jelas (kategori, arah visual baru, perubahan gaya) → tanya; sisanya putuskan dan catat. Proyek baru: **kategori dan pendekatan visual wajib dipastikan** sebelum keputusan kreatif besar.
Animatic dan "audit cerita" terpisah (v3) tidak lagi tahap; dipakai hanya bila ada risiko timing/cerita.

## 2. Draf isi baru (tinjau teksnya)
- `drafts/DRAFT_WORKFLOW.md`: isi `WORKFLOW.md` baru (±90 baris, 8 langkah, Input/Tugas/Output/Kriteria/Selesai ringkas).
- `drafts/DRAFT_CLAUDE_PERUBAHAN.md`: perubahan tepat pada `CLAUDE.md` (apa dihapus, apa ditambah).
- `drafts/DRAFT_SKILL_PERUBAHAN.md`: perubahan per skill (bagian apa diganti/ditambah/dipindah ke legacy).

## 3. Daftar file yang akan diubah (setelah review)
| Berkas | Tindakan |
|---|---|
| `docs/visual-system/VISUAL_STYLE_SPEC.md` | menjadi spesifikasi berlaku (sumber tunggal identitas) |
| `CLAUDE.md` | aturan wajib kategori; rujukan spesifikasi; hapus "semi-realistis"; foto fleksibel; teks opsional (lihat draf) |
| `WORKFLOW.md` | diganti draf 8 langkah (versi v3 ke `arsip/`) |
| `style/style.md`, `style/identitas.md`, `style/e1-visual-kode.md` | diberi kepala "digantikan oleh `VISUAL_STYLE_SPEC.md`"; §4 semi-realistis e1 diarsipkan; isi lama tetap tersedia |
| `.claude/skills/sutradara/SKILL.md` + `referensi/` | tambah `kategori-video.md`, `animasi-mekanisme.md`, `templat-storyboard.md`; ganti hierarki teknik; perbarui `kualitas-3d.md`, `footage.md`, `teks.md`, `konsistensi.md` sesuai keputusan; ringkas duplikasi |
| `.claude/skills/breakdown/SKILL.md` | syarat pemakaian Mode A; perluas pedoman aliran/detail/hubungan; rujuk spesifikasi |
| `.claude/skills/remotion-fitur/SKILL.md`, `kartu-teknik.md` | 2D dulu; kartu SVG/CSS (path draw, mask, clip, layering, parallax 2.5D, anotasi); hapus rekomendasi `noir3d`/grading realistis |
| `docs/visual-system/matriks/HASIL.md`, `e1/02/qa-v2.md` | catatan "arah ditolak pemilik" |
| `remotion/src/e1/Pilot02B.tsx`, `Pilot02C.tsx`, `look.tsx` | tidak diubah; hanya diberi komentar kepala "gaya semi-realistis, bukan arah" (satu baris) |
| `e1/_template-log.md` | kolom kategori dan arah visual |
Tidak diubah: video lama, alat suara/kilau, naskah, `script-writer`, `social-video-scriptwriting`.

## 4. Pemetaan ke kriteria penerimaan
1 tidak semua video breakdown: langkah 1 + syarat pemakaian `breakdown` · 2 tanya kategori: aturan wajib di `CLAUDE.md` · 3 mitos/lingkungan tanpa breakdown: spesifikasi §13.2 · 4 mekanisme jelas: §12, §13.1 · 5 bukan photoreal: §1, §7, §8 · 6 tidak generik/slide: §9–§12, §17 · 7 animasi menjelaskan: §12 · 8 storyboard berbasis shot: langkah 5 + `templat-storyboard.md` · 9 gaya konsisten, teknik berbeda: §13.7, §15 · 10 tidak coding sebelum arah+storyboard disetujui: langkah 6 · 11 praktis: 8 langkah, tanpa skill baru, anti-birokrasi · 12 render dinilai visual: langkah 8.

## 5. Setelah implementasi (urutan kerja berikutnya)
1. Terapkan dokumen/skill sesuai draf yang Anda setujui (satu commit per kelompok; arsip lama dipertahankan).
2. Berhenti dan tampilkan hasil. **Tidak ada pilot atau perubahan kode video** sebelum fondasi ini selesai dan Anda setujui.
3. Pilot #02 (rumah → pondasi → lempung): dimulai dari brief + kategori + 2–3 arah visual (stylized 2D/2.5D), bukan dari kode yang ada.

## 6. Risiko
Spesifikasi bisa menjadi template baru: dicegah §15 dan aturan "kategori hanya titik awal". Ilustrasi 2D bergaya butuh iterasi desain, bukan hanya kode. Papan gaya adalah ilustrasi kasar; kualitas final ditentukan di pilot.
