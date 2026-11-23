# CHANGELOG_CREATIVE: Creative & Visual Overhaul (23 Nov 2026)

Berkas pendukung: `AUDIT_REPORT.md` (temuan A–J), `PROPOSAL_ARCHITECTURE.md` (usulan), `e1/02/qa.md` (hasil pilot), `e1/02/review/` (strip frame dan perbandingan lama/baru).

## Keputusan pemilik yang dipakai
Aturan karakter/3D lama diarsipkan, aturan konsistensi dipertahankan; subtitle default mati; pilot memakai #02 + foto rumah bertangga dengan transisi footage→3D yang harus menjelaskan hubungan (bukan sekadar keren).

## Perubahan sistem (Stage 3–4)
| Area | Sebelum | Sesudah |
|---|---|---|
| `CLAUDE.md` | 92 baris, tiga zaman aturan bercampur | ±50 baris, arah aktif + aturan keras; aturan lama di `arsip/CLAUDE-aturan-lama.md` |
| `WORKFLOW.md` | 1.028 baris, eksperimen + produksi + kredit AI sisa | ±130 baris, 10 tahap berformat Input/Tugas/Output/Kriteria/Selesai; evaluasi eksperimen di `e1/EVALUASI.md`; versi lama di `arsip/WORKFLOW-E1-v2-lengkap.md` |
| Skill | `sutradara` (tata letak dikunci), `remotion-fitur`, `breakdown`, `social-video-scriptwriting` | satu `visual-director` (prosedur keputusan + 10 referensi); lainnya di `arsip/skills/`; `script-writer` diperbarui (integrasi arahan visual, 50–70 dtk) |
| Alat | `gerbang.mjs`, `produksi.sh`, `cek-sutradara.mjs`, `animatic.mjs`, `checklist/`, `sampel-hyperframes/` | diarsipkan di `arsip/alat-3d-lama/`; baru: `cek_shots.py`, `review_video.py`, `animatic.py` |
| Data shot | tidak ada; waktu ditanam di TSX | `e1/NN/shots.json` (skema di `visual-director/style/visual/shots-skema.md`) |
| Kode | `Tanah02.tsx` tulisan tangan per video | `remotion/src/e1/lib/` (`kamera.ts`, `footage.tsx`, `transisi.tsx`, `anot.tsx`) dipakai `Pilot02.tsx` |
| Persetujuan | sesudah render | di angle, storyboard, animatic |

Tidak dihapus permanen: semua yang lama dipindah ke `arsip/`. Video lama (`Rumah01`, `Tanah02`, `AnatomiRumah`) tidak diubah.

## Eksperimen: pilot #02, sequence "Di bawah rumah" (20,4–31,0 dtk)
Dibuat mengikuti alur baru: arahan (`e1/02/direction.md`) → `shots.json` → validator → storyboard (frame nyata) → render → tinjauan MP4 → perbaikan → render ulang. Render: `remotion/out/pilot02.mp4` (tidak di-commit; dikirim ke pemilik lewat chat).

**Apa yang dibuat:** satu dunia 3D kontinu; foto rumah nyata sebagai bidang dengan garis tanah di y=0; garis merah tergambar di garis itu, strip jalan jatuh, penampang tanah (urugan, lempung, pasir, batuan, pondasi batu, sumur) terbuka tepat di bawah rumah; kamera turun masuk, mengikuti air; kamera diam saat lempung memampat (0,57 m, ilustrasi) dan permukaan beserta foto turun dari garis acuan; kamera naik kembali ke foto yang sama dan rumah kini di bawah "Posisi awal". Tanpa subtitle; 5 label informasi; 5 jenis kamera (push, crane-turun, dolly-in, terkunci, crane-naik).

### Sebelum vs sesudah (jendela waktu sama; gambar: `e1/02/review/banding_lama_baru.jpg`, memakai render akhir)
| Aspek | Lama (`Tanah02`) | Pilot |
|---|---|---|
| Footage | kartu foto penuh layar, lalu potong | bidang dalam dunia; garis tanahnya jadi permukaan 3D dan garis acuan |
| 3D | balok terurai melayang, mirip mainan | penampang tanah kontinu menempel di bawah foto, material gelap-basah |
| Kamera | orbit pelan 3 preset | crane, dolly, terkunci, crane naik, tiap shot beralasan, data di `shots.json` |
| Teks | subtitle penuh + kartu judul | 5 label informasi, tanpa subtitle |
| Hubungan | foto dan 3D terpisah | satu garis, satu pondasi, satu callback dengan perubahan |
| Cue waktu | tertanam di TSX | pose dan durasi dari `shots.json` |

## Hasil evaluasi (jujur)
Lihat `e1/02/qa.md`. Ringkas: **berhasil** pada transisi footage→3D yang menjelaskan hubungan, hierarki, kamera berdata, dan tidak terasa seperti slide pada P2 dan P5. **Belum berhasil**: P3–P4 masih terasa seperti diagram bergerak (komposisi nyaris sama ±3,6 dtk), 3D masih berbahasa diagram teknik, tidak ada desain suara selain VO, foto beresolusi rendah lembut saat di-push, "spons diperas" belum tersampaikan tanpa suara.

Kesimpulan: pilot **membuktikan sebagian**, bukan seluruh klaim. Alur baru terbukti dapat menghasilkan urutan yang lebih terarah; belum terbukti menghasilkan pacing yang menarik di bagian mekanisme.

## Bukti reproduktif
`python3 tools/cek_shots.py e1/02/shots.json` lulus; `python3 tools/cek_kilau.py Pilot02 --dur 10.6 --frames 15,40,55,70,95,130,160,200,240,275,305` maksimum 17 piksel; `node tools/cek-mandiri.mjs` OK; render `cd remotion && npx remotion render src/index.ts Pilot02 out/pilot02.mp4`. Deterministik (semua gerak dari frame; acak ber-seed).

## Risiko dan hal belum dikerjakan
- Storyboard dan animatic tidak di-ACC terpisah pada pilot (pemilik menyetujui eksperimen); tahap ACC tetap wajib untuk video baru.
- `animatic.py` dan `review_video.py` baru dipakai untuk pilot; `animatic.py` belum dijalankan (pilot langsung dirender dan ditinjau).
- Foto resolusi lebih tinggi untuk push-in belum ada.
- Pilot tidak mengubah video #02 penuh. Memperluas ke 11 shot lain menunggu keputusan pemilik.
- Belum ada desain suara (ambience, SFX, hening).
- Pembersihan lanjutan: `STATUS.md` memuat riwayat 3D lama; `style/gaya-penjelasan.md`, `style/identitas.md`, dll. masih ada sebagai referensi lama (tidak mengikat).

## Usulan langkah berikut (butuh keputusan pemilik)
1. Perbaiki P3–P4 (kontras komposisi, penanda ukur yang lebih jelas, tekanan visual "spons") dan tambah desain suara, lalu evaluasi ulang.
2. Setelah lulus, terapkan ke seluruh #02 (video penuh) lewat tahap 5–10, atau ke video baru dari awal.
