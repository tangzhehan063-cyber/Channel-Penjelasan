# CHANGE PLAN Tahap 4 (24 Nov 2026): file yang diubah, dan cara memulihkan

Keputusan pemilik: pulihkan empat skill; `sutradara` = Visual Director (pusat keputusan visual); lainnya spesialis; semua kuota jadi rekomendasi; foto boleh sebagai elemen terolah; aturan lama diarsipkan (dapat dipulihkan).

| # | Tindakan | Berkas |
|---|---|---|
| 1 | Pulihkan (git mv) | `arsip/skills/{sutradara,remotion-fitur,breakdown,social-video-scriptwriting}` → `.claude/skills/` |
| 2 | Salin isi asli sebelum diubah | `.claude/skills/sutradara/legacy/SKILL-asli.md`, `.claude/skills/remotion-fitur/legacy/SKILL-asli.md`, `.claude/skills/breakdown/legacy/SKILL-asli.md` |
| 3 | Pindahkan referensi `visual-director` ke `sutradara` | `.claude/skills/visual-director/style/visual/*.md` → `.claude/skills/sutradara/referensi/` ; hapus folder `visual-director` (git mv, riwayat terjaga) |
| 4 | Tulis ulang | `sutradara/SKILL.md` (prinsip universal + proses keputusan E1 + routing, tanpa kuota) |
| 5 | Tulis ulang | `remotion-fitur/SKILL.md` (konsultan teknik, kartu teknik dengan status verifikasi) + `remotion-fitur/kartu-teknik.md` |
| 6 | Tambah | `breakdown/SKILL.md` Mode B analisis referensi + `breakdown/templat-analisis-referensi.md` |
| 7 | Tambah catatan routing | `social-video-scriptwriting/SKILL.md` (peninjau opsional; tidak menulis naskah ganda) |
| 8 | Hapus kuota | `tools/cek_shots.py` (jadi PERINGATAN), `WORKFLOW.md` tahap 6 dan 10, `referensi/bahasa-kamera.md`, `ritme.md`, `shots-skema.md`, `footage.md` (foto terolah) |
| 9 | Perbarui rujukan | `CLAUDE.md`, `WORKFLOW.md`, `style/e1-visual-kode.md` §5, `e1/02/*.md` (nama skill) |
| 10 | Catat | `docs/visual-system/CHANGELOG_SKILLS.md` |

**Pemulihan:** semua perubahan di commit tersendiri. `git revert <commit>` atau salin dari `legacy/SKILL-asli.md` tiap skill. Tidak ada berkas yang dihapus tanpa salinan di `legacy/` atau `arsip/`.
Tidak diubah: `script-writer`, video lama, `Tanah02.tsx`, `Rumah01.tsx`, `look.tsx`, alat suara/kilau, pilot `Pilot02*.tsx`.
