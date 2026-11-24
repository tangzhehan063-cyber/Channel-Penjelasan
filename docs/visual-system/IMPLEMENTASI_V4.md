# IMPLEMENTASI workflow v4 dan Visual Style Specification (24 Nov 2026)

Diterapkan setelah persetujuan pemilik (dengan enam penegasan, tercantum di `VISUAL_STYLE_SPEC.md` §0). **Tidak ada pilot, render, atau perubahan perilaku kode video.** Backup semua berkas yang diganti: `arsip/v3-24nov/` (+ `legacy/` tiap skill, `arsip/CLAUDE-aturan-lama.md`).

## 1. File yang diubah
| Kelompok | Berkas | Tindakan |
|---|---|---|
| Aturan | `CLAUDE.md` | ditulis ulang: kategori dulu, spesifikasi sebagai identitas, anti-birokrasi, bukan-realistis, teknik berurutan, kartu/teks opsional, foto fleksibel, animasi menjelaskan + akurasi, breakdown bila perlu |
| Alur | `WORKFLOW.md` | diganti 8 langkah (v3 → `arsip/v3-24nov/WORKFLOW-v3.md`) |
| Gaya | `docs/visual-system/VISUAL_STYLE_SPEC.md` | berlaku; ditambah §0 enam penegasan, §12.1 akurasi, kualitas animasi |
| Skill | `.claude/skills/sutradara/SKILL.md` + `referensi/` (baru: `kategori-video.md`, `animasi-mekanisme.md`, `templat-storyboard.md`; ditulis ulang: `kualitas-3d.md`, `footage.md`, `teks.md`, `konsistensi.md`, `mode-visual.md`, `arahan-animasi.md`; disunting: `komposisi.md`, `bahasa-kamera.md`, `shots-skema.md`) | pusat keputusan visual |
| | `.claude/skills/breakdown/SKILL.md` | tambah "Kapan breakdown dipakai" (bukan default), hubungan antarkomponen, gaya; Mode B dipertegas |
| | `.claude/skills/remotion-fitur/SKILL.md`, `kartu-teknik.md` | 2D dulu; kartu SVG/CSS; kolom Gaya (✔/○/✘); `noir3d`/low-key/kabut/material berrelief = ✘ |
| | `.claude/skills/script-writer/SKILL.md` | bagian 12 disesuaikan alur v4 |
| Gaya lama | `style/style.md`, `identitas.md`, `gaya-penjelasan.md`, `rencana-sudut-kamera-iso.md`, `aset.md`, `e1-visual-kode.md` | diberi kepala status; `e1-visual-kode.md` §4 (semi-realistis) dinonaktifkan |
| Eksperimen | `e1/EVALUASI.md`, `e1/AUDIT-ketergantungan-api.md`, `e1/02/qa-v2.md`, `docs/visual-system/matriks/HASIL.md` | catatan "arah ditolak/diselaraskan" |
| Template | `e1/_template-log.md` | baris kategori, arah visual, breakdown dipakai? |
| Alat | `tools/cek_shots.py` | docstring rujukan skill |
| Kode | `remotion/src/e1/Pilot02B.tsx`, `Pilot02C.tsx`, `look.tsx` | **hanya komentar kepala** (tsc bersih); perilaku tak berubah |
Tidak diubah: video lama, `Tanah02.tsx`, `Rumah01.tsx`, alat suara/kilau, naskah, `social-video-scriptwriting`, dokumen audit/proposal sebelumnya (riwayat).

## 2. Ringkasan perubahan
Kategori video ditanyakan dulu; identitas = stylized/flat illustration (B default, A/C fleksibel; outline tipis tidak wajib; kartu/kicker/hook opsional; foto fleksibel; peran warna dengan preset dan variasi); alur 8 langkah anti-birokrasi; teknik berurutan SVG/CSS → 2.5D → 3D terstilisasi; semi-realistis/PBR/kabut/CGI bukan default; animasi menjelaskan dengan akurasi dan kualitas sebagai prioritas; breakdown hanya bila perlu; tanpa kuota; papan kategori = contoh, bukan template.

## 3. Skill/workflow terdampak
`sutradara` (pusat, ditulis ulang) · `breakdown` (syarat pemakaian) · `remotion-fitur` (urutan teknik, kartu) · `script-writer` (rujukan alur) · `WORKFLOW.md`, `CLAUDE.md`. `social-video-scriptwriting` tidak berubah (peninjau opsional).

## 4. Hasil pengecekan konsistensi
- Pencarian istilah lama di berkas aktif (`CLAUDE.md`, `WORKFLOW.md`, `.claude/skills`, `style`, `e1`, `docs`, `tools`) tanpa `arsip/`, `legacy/`: "semi-realistis", "PBR", "kabut", "noir3d", "look.tsx" kini hanya muncul sebagai **larangan, catatan arsip, atau riwayat**. "visual-director" hanya di dokumen riwayat. Tidak ada kuota (≥4 jenis kamera, ≥3 mode, wajib shot) di berkas aktif; hanya di dokumen audit/changelog lama dan `style/rencana-sudut-kamera-iso.md` (diberi status "opsi").
- Rujukan path dalam `CLAUDE.md`, `WORKFLOW.md`, `SKILL.md`: semua ada; sisa 15 "tak ditemukan" adalah nama relatif per-video (`brief.md`, `storyboard.md`, `shots.json`, dst.), `./setup-vendor.sh` (HyperFrames, arsip), dan rujukan relatif antar-skill.
- `tsc` bersih; `cek-mandiri` OK; `cek_shots.py` lulus pada `shots.json`, `shots2.json`, `shots3.json` (variasi tidak lagi menggagalkan).
- Batas pengecekan: konsistensi diperiksa lewat pencarian teks dan path, bukan dengan menjalankan alur nyata; **belum diuji pada proyek baru**.

## 5. Instruksi yang masih bertentangan atau perlu keputusan
1. **`style/gaya-penjelasan.md` §3 (objek ≥1/3 layar), `style/identitas.md` (jangkar kicker/kartu/subtitle y=1400), `style/style.md` (SATU objek 3D glossy, 50/30/20)**: masih berisi aturan lama di badan teks; hanya diberi kepala "tidak mengikat". Usul: arsipkan badan teksnya sepenuhnya atau biarkan sebagai riwayat. **Butuh keputusan.**
2. **`remotion/src/kit/Penjelasan.tsx` + `beats.json`** (template video 3D lama: kicker, kartu, subtitle terkunci) masih ada; tidak sesuai "tidak template", tapi tidak dipakai E1. Biarkan atau tandai.
3. **`remotion/src/e1/look.tsx`, `Pilot02B/C`, `Rumah01/Tanah02`** (video E1 #01/#02 berlandaskan gaya semi-realistis): konten lama masih bergaya semi-realistis; nasib #01/#02 (dibuat ulang bergaya baru atau dibiarkan) belum diputuskan.
4. **Fondasi kategori belum punya "arah visual" tertulis per seri**: arah baru dibuat saat proyek berikutnya (langkah 3).
5. `docs/visual-system/drafts/` kini usang (sudah diterapkan); dipertahankan sebagai catatan.
6. `tools/mix-audio.mjs` belum diadaptasi ke E1 (desain suara tetap manual).

## 6. Berikutnya (menunggu Anda)
Review hasil ini. Tidak ada pilot atau coding video sebelum Anda menyetujui. Setelah itu: pilot #02 dimulai dari brief + kategori + 2–3 arah visual stylized.
