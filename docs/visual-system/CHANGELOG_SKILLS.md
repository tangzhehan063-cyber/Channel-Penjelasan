# CHANGELOG SKILLS (24 Nov 2026): Tahap 4

Dasar keputusan: pesan pemilik (5 keputusan) setelah `REPOSITORY_SKILL_AUDIT.md` dan `PROPOSAL.md`; hasil eksperimen: `matriks/HASIL.md`. Rencana file: `CHANGE_PLAN.md`.

## Perubahan
| Skill | Sebelum | Sesudah |
|---|---|---|
| `sutradara` | 62 baris, gaya diorama kertas (A, F), prinsip umum (B), cek-sutradara | **Visual Director**: `SKILL.md` (3 lapis aturan, prinsip universal tanpa angka, proses keputusan + eksplorasi 2-3 konsep, foto terolah, routing); `referensi/` (11 panduan, dari `visual-director`); `legacy/SKILL-asli.md` (isi asli utuh), `legacy/visual-director-SKILL.md` |
| `remotion-fitur` | katalog fitur peningkat "belum dipakai", teknik isometrik KUNCI KARAKTER | **Konsultan teknik**: `SKILL.md` + `kartu-teknik.md` (kartu per teknik: apa, komunikasi, kapan/tidak, kombinasi, syarat, biaya, implementasi di repo, status verifikasi V/G/?); aturan wajib 3D tetap; `legacy/SKILL-asli.md` |
| `breakdown` | exploded view, 4 gaya, dibatasi KUNCI KARAKTER | fungsi exploded utuh (Mode A) + **Mode B analisis referensi** (`templat-analisis-referensi.md`); pembatasan lama ditandai legacy; `legacy/SKILL-asli.md` |
| `social-video-scriptwriting` | skill naskah umum | fungsi utuh; catatan routing: peninjau/strategis opsional, tanpa naskah ganda |
| `script-writer` | (tidak berubah sejak bagian 12) | tidak diubah |
| `visual-director` | skill buatan 23 Nov | **dilebur ke `sutradara`** dan dihapus sebagai skill; isinya dipindah (git mv), salinan `SKILL.md`-nya di `sutradara/legacy/` |

Alat/dokumen: `tools/cek_shots.py` (variasi/ritme jadi PERINGATAN; hanya struktur yang bisa GAGAL), `WORKFLOW.md` tahap 6 dan 10, `referensi/{bahasa-kamera,ritme,shots-skema,footage}.md` (kuota dihapus; foto terolah diizinkan), `CLAUDE.md`, `style/e1-visual-kode.md` §5, `e1/02/direction.md` (nama skill).

## Kuota yang dihapus (daftar)
≥4 jenis gerak kamera; ≥3 mode visual; wajib shot `terkunci`/`hening`; GAGAL untuk shot berturut-turut identik; ≥1 shot cepat dan ≥1 shot napas; (lama) tanpa kamera diam, signature shot, momen khas 3D kertas, objek ≥1/3 layar, outline wajib, bentuk membulat, isometrik wajib, subtitle y=1400.

## Pemulihan
Semua berkas lama ada di `.claude/skills/*/legacy/` dan `arsip/` (termasuk `arsip/CLAUDE-aturan-lama.md`, `arsip/alat-3d-lama/`). Untuk membatalkan: `git revert` commit Tahap 4, atau salin `legacy/SKILL-asli.md` ke `SKILL.md`.

## Belum dilakukan
Pembaruan `STATUS.md`/`KEPUTUSAN.md` (riwayat 23 Nov tetap menyebut `visual-director`; itu catatan sejarah). `mix-audio.mjs` belum diadaptasi ke `shots.json`. Status teknik `?` di kartu belum diuji.
