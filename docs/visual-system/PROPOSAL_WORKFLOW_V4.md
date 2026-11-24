# PROPOSAL (Tahap B, 24 Nov 2026): workflow sadar-konten dan Visual Style Specification

Dasar: `AUDIT_IDENTITAS_DAN_WORKFLOW.md`; spesifikasi: `VISUAL_STYLE_SPEC_DRAFT.md` (+ `style-board/papan-gaya.png`). **Belum ada yang diterapkan.** Prinsip: lebih sedikit aturan, bukan lebih banyak; tidak ada skill baru; tidak mengganti identitas yang sudah ada.

## 1. Alur video (8 langkah, dari urutan Anda; memampatkan 10 tahap v3)
| # | Langkah | Isi | Keluaran | Persetujuan |
|---|---|---|---|---|
| 1 | **Brief + kategori** | Claude **bertanya**: topik, kategori (Breakdown/How it works, Mitos vs Fakta, Fenomena/Science, Perbandingan, Cerita/Investigasi, Hybrid), tujuan, apa yang harus dipahami, preferensi visual. Bila kategori jelas dari topik: rekomendasi + minta konfirmasi. Tidak menanyakan yang sudah ada di brief | `e1/NN/brief.md` (setengah halaman) | **ACC kategori** |
| 2 | **Analisis konten** | riset (sumber, `[CEK]`), audiens, informasi penting, konsep sulit, bagian yang butuh demonstrasi / lingkungan / breakdown / diagram / simulasi | `riset/…md` + bagian analisis di `brief.md` | – |
| 3 | **Arah visual** | identitas (dari spesifikasi), art direction, palet, bentuk objek, lingkungan, perspektif, pendekatan animasi. Bila arah belum ditetapkan: **2–3 alternatif yang benar-benar berbeda** (art direction, bentuk, komposisi, palet, cara objek diilustrasikan, cara animasi bekerja, kelebihan/kekurangan, kenapa cocok), sketsa papan gaya kecil | `e1/NN/arah-visual.md` | **ACC arah visual** (mengunci; tak diubah tanpa alasan dan ACC) |
| 4 | **Naskah** | `script-writer`; tidak dipaksa menyesuaikan teknik visual; visual dan narasi saling mendukung | naskah | ACC naskah |
| 5 | **Storyboard** | dirancang **sebelum kode**: per shot narasi, tujuan bercerita, konsep visual, komposisi, subjek dan posisinya, latar, hierarki, sudut kamera, gerak kamera (bila perlu), gerak objek, **urutan animasi**, transisi, durasi, pendekatan teknis. Visual tidak sekadar mengulang narasi (memperjelas/menguatkan/menambah). Format: tabel + sketsa SVG kasar per shot (bukan screenshot render) | `e1/NN/storyboard.md` (+ `shots.json` opsional untuk video bershot banyak) | – |
| 6 | **Review** | tampilkan arah visual + storyboard | – | **ACC sebelum coding** |
| 7 | **Produksi** | Remotion, React, SVG, CSS, Canvas bila relevan, three.js hanya bila perlu; tanpa AI API; VO tanya Gemini/ElevenLabs | komposisi + audio | gerbang teknis (mandiri, kilau, suara) |
| 8 | **Visual QA** | menonton render aktual: kejelasan, komposisi, konsistensi gaya, animasi, timing, transisi, hierarki, repetisi, storytelling, kesesuaian narasi; revisi bila gagal; render kecil dulu | `e1/NN/qa.md` | ACC publikasi |
Animatic (v3 tahap 8) menjadi **opsional** (untuk video dengan risiko timing). Tahap "audit cerita" dan "arahan visual" v3 dilebur ke langkah 2, 3, dan 5. `WORKFLOW.md` menyusut, bukan bertambah.

## 2. Pembagian peran (tanpa skill baru)
| Skill | Peran di alur baru | Perubahan |
|---|---|---|
| `sutradara` | pusat: kategori → arah visual → storyboard → kritik render | tambah referensi: `kategori-video.md` (pendekatan per kategori, dari spesifikasi §11), `animasi-mekanisme.md` (8 langkah, kegagalan umum), `templat-storyboard.md`; ganti hierarki teknik menjadi 2D→2.5D→3D; hapus rekomendasi realistis di `kualitas-3d.md` |
| `breakdown` | Mode A (exploded/penampang/aliran) **hanya untuk kategori How it works atau bila narasi butuh**; Mode B analisis referensi | beri syarat pemakaian eksplisit; Mode A diperluas dengan pedoman aliran dan pembesaran detail; bukan default |
| `remotion-fitur` | menerjemahkan keputusan ke implementasi; **mendahulukan SVG/CSS**; kartu teknik berstatus | tambah kolom "gaya sesuai spesifikasi?"; hapus `noir3d`/grading realistis sebagai rekomendasi; tambah kartu SVG (path draw, mask, clip, layering, parallax 2.5D) |
| `script-writer` | naskah | hanya rujukan alur baru |
| `social-video-scriptwriting` | peninjau opsional | tidak berubah |

## 3. File yang akan diubah (setelah persetujuan)
| Berkas | Tindakan |
|---|---|
| `docs/visual-system/VISUAL_STYLE_SPEC.md` | spesifikasi final (dari draf + koreksi Anda); **sumber tunggal identitas** |
| `CLAUDE.md` | aturan wajib: tanya kategori sebelum proyek baru; rujuk spesifikasi; hapus frasa "semi-realistis" |
| `WORKFLOW.md` | ganti 10 tahap v3 dengan 8 langkah di atas (versi lama ke `arsip/`) |
| `style/style.md`, `style/identitas.md`, `style/e1-visual-kode.md` | tandai "diganti spesifikasi" dan hapus §4 semi-realistis (isi lama diarsipkan, bukan dibuang) |
| `.claude/skills/sutradara/SKILL.md` + `referensi/` | lihat tabel peran; ringkas duplikasi |
| `.claude/skills/breakdown/SKILL.md`, `.claude/skills/remotion-fitur/*` | lihat tabel peran |
| `docs/visual-system/matriks/HASIL.md`, `remotion/src/e1/Pilot02B.tsx`, `Pilot02C.tsx` | beri catatan "arah ditolak pemilik 24 Nov"; kode tidak dihapus |
| `e1/_template-log.md` | tambah kolom kategori |
Tidak diubah: video lama, `look.tsx` (diberi catatan bahwa itu gaya semi-realistis lama), alat suara/kilau, naskah.

## 4. Status pilot dan #02
Pilot `Pilot02B/C` dan matriks `noir3d` **dihentikan sebagai arah**. Sequence #02 (rumah → pondasi → lempung memampat) tetap bisa jadi eksperimen pertama sistem baru: kategori kemungkinan **Fenomena/Science dengan unsur Perbandingan** (bukan Breakdown rumah). Saya akan mengusulkan 2–3 arah visual berbeda (mis. penampang ilustrasi datar samping; metafora spons 2D; lingkungan overhead + potongan) **setelah** spesifikasi disetujui, memakai urutan 8 langkah.

## 5. Kriteria penerimaan (dipetakan)
| # | Kriteria | Dijamin oleh |
|---|---|---|
| 1 | tidak mengasumsikan semua video breakdown | langkah 1 + syarat pemakaian `breakdown` |
| 2 | bertanya kategori sebelum mulai | `CLAUDE.md` aturan wajib + langkah 1 |
| 3 | mitos/lingkungan tanpa breakdown objek | `kategori-video.md` |
| 4 | how-it-works menunjukkan mekanisme jelas | `animasi-mekanisme.md` + Mode A diperluas |
| 5 | bukan photoreal 3D | spesifikasi §5, §10; hapus §4 `e1-visual-kode.md` |
| 6 | tidak generik/slide | spesifikasi §7–9, kriteria QA |
| 7 | animasi menjelaskan | spesifikasi §9 |
| 8 | storyboard berdasar shot dan storytelling | langkah 5 (rancangan sebelum kode) |
| 9 | gaya konsisten, teknik berbeda | spesifikasi §12 |
| 10 | tidak coding sebelum arah + storyboard di-ACC | langkah 6 |
| 11 | praktis | 8 langkah, tanpa skill baru, dokumen menyusut |
| 12 | render dinilai visual | langkah 8 |

## 6. Risiko
Spesifikasi yang terlalu rinci bisa menjadi template baru; karena itu bagian 12 memisahkan "tetap" dan "berganti". Kualitas ilustrasi 2D datar yang baik butuh iterasi desain (bukan hanya kode); pilot pertama harus menjawabnya. Kehilangan "kekayaan" 3D yang Anda sukai di #7/#8: tetap tersedia di hierarki teknik (3D terstilisasi bila perlu).

## 7. Keputusan yang saya butuhkan
1. Setujui arah: identitas = stylized illustration (spesifikasi), `semi-realistis` dihentikan.
2. Jawab lima pertanyaan di `VISUAL_STYLE_SPEC_DRAFT.md` §14.
3. Setujui alur 8 langkah dan daftar file di §3.
4. Setelah itu: implementasi dokumen dan skill, lalu pilot #02 dengan urutan baru (brief → kategori → 2–3 arah → storyboard → ACC → coding).
