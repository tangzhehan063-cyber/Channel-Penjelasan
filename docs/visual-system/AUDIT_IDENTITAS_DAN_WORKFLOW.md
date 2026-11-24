# AUDIT (Tahap A, 24 Nov 2026): identitas visual dan workflow sadar-konten

Hanya audit; **tidak ada berkas produksi yang diubah**. Bukti: path dan kutipan berkas, dan frame yang saya lihat (`style/contoh-frame-v07-review.png`, `style/still-v10-review.jpg`, `style/referensi-visual/06-cerita-produk/lembar-kontak.jpg`, `docs/visual-system/matriks/*.jpg`, `e1/02/review2/strip_00.jpg`, `e1/02/storyboard3/strip2.jpg`).

## 0. Temuan inti (baca ini dulu)
1. **Identitas yang Anda deskripsikan sebagian besar SUDAH ada di repo, dan saya sendiri yang menjauhkan E1 darinya.** Gaya #7/#8/#10 (`style/style.md`, `style/identitas.md`, `style/palet.json`): warna solid terkontrol, bentuk membulat, outline tinta tipis, bayangan lembut, latar kertas, peran warna (aksen=masalah, dingin=air, baik=solusi). Itu mendekati "stylized illustration" yang Anda inginkan. Lalu eksperimen E1 memindahkan arah ke "semi-realistis" (`style/e1-visual-kode.md` §4: "Material PBR... matahari nyata... bayangan lembut... `fog`"), dan pilot saya (`Pilot02B`, `Pilot02C`, matriks `noir3d`) memakai tekstur tanah basah, lampu hangat, kabut, foto low-key. **Itu persis kategori yang Anda tolak**: 3D realistis seperti demo software, material detail tanpa kebutuhan, atmosfer CGI. Kedua pilot tidak boleh dilanjutkan sebagai arah.
2. **Tidak ada langkah "jenis video" di workflow.** `WORKFLOW.md` tahap 1 langsung riset; tidak ada pertanyaan kategori; akibatnya semua topik dipaksa ke pola yang sama (objek 3D + penampang).
3. **Breakdown diperlakukan sebagai default.** Instruksi lama: setiap video E1 punya satu adegan breakdown (`arsip/WORKFLOW-E1-v2-lengkap.md` bagian Breakdown; pesan pemilik awal; `kualitas-3d.md:24` "Breakdown... satu adegan khusus per video"). Itu salah untuk video mitos/lingkungan.
4. **Storyboard = tangkapan layar render.** `WORKFLOW.md` tahap 7 mendefinisikan storyboard sebagai "render frame kunci... gabung per-shot jadi strip". Bagus untuk mengecek, tapi bukan rancangan: rancangan baru ada setelah kode ditulis (di pilot saya, storyboard `storyboard3/` dibuat dari kode `Pilot02C`, bukan sebelumnya).
5. **Sistem terlalu condong ke 3D.** Kartu teknik, matriks, dan pilot saya hampir semuanya three.js; SVG/CSS 2D (yang Anda prioritaskan) hanya satu baris.

## 1. Konflik instruksi
| # | Konflik | File | Dampak |
|---|---|---|---|
| 1 | E1 "semi-realistis" vs "stylized, bukan render" | `style/e1-visual-kode.md` §4; `CLAUDE.md` (lama) "semi-realistic architectural visualization"; `remotion/src/e1/look.tsx` (material PBR bertekstur) | rumah/tanah tampak render; ditolak pemilik |
| 2 | "Tekstur berlebihan"/material detail vs identitas bersih | `look.tsx`, `Pilot02.tsx` `usePenampang()` | penampang tampak realistis |
| 3 | `style/style.md` "Visual wajib sama setiap video" + "SATU objek 3D glossy per adegan... koral" + "50% 3D explainer / 30% technical / 20% isometrik" vs "jangan satu template" | `style/style.md:16,21,32` | satu bentuk dipaksakan untuk semua topik |
| 4 | Jangkar identitas (kicker + TikTokBox, kartu judul, subtitle y=1400) vs subtitle default mati dan teks sebagai art direction | `style/identitas.md` tabel "Yang TETAP" | tampak seperti slide presentasi; kini bertentangan dengan keputusan E1 |
| 5 | Rekomendasi `noir3d` + foto low-key sebagai "bahasa visual" vs penolakan photoreal | `docs/visual-system/matriks/HASIL.md` §4, `remotion-fitur/kartu-teknik.md` | saya sendiri merekomendasikan arah yang salah |
| 6 | "Objek ≥1/3 layar", "dilarang diorama lebar, label kecil" | `style/gaya-penjelasan.md` §3 | membatasi komposisi lingkungan/negative space; sudah diarsipkan sebagai legacy |
| 7 | `style/aset-luar.md` model CC0 vs "visual 100% kode" | `style/aset-luar.md` | ambigu bila aset luar dipakai |
Catatan benar: aturan lama KUNCI KARAKTER, tata letak tetap, dan kuota kamera sudah diarsipkan (Tahap 4); konflik 3, 4 dan 6 masih ada di berkas `style/` karena berkas itu tidak kami sentuh.

## 2. Aturan yang membuat visual kaku
`style/style.md` (tabel "Visual (wajib sama setiap video)"); `style/identitas.md` "Yang TETAP"; `style/gaya-penjelasan.md` §3 skala objek; kit `remotion/src/kit/Penjelasan.tsx` (template berbasis `beats.json`: satu komposisi merakit semua; tak cocok untuk video lingkungan/komparasi). Sebagian sudah diarsipkan di sutradara, tetapi **identitas positif yang harus dipertahankan belum ditulis sebagai satu spesifikasi tertulis**; ia tersebar di empat berkas.

## 3. Instruksi yang mendorong langsung coding
- `arsip/CLAUDE-aturan-lama.md`: "Video baru = salin `remotion/src/v08/`... ganti data"; mendorong menyalin template.
- `WORKFLOW.md` v3 sudah menaruh ACC di storyboard/animatic, tetapi **tidak ada** gerbang arah visual **sebelum naskah** (tahap 5 ada setelah naskah) dan tidak ada pilihan arah (2–3 alternatif) yang disetujui sebelum storyboard.
- Kenyataan sesi ini: saya menulis kode pilot sebelum Anda menyetujui storyboard; itu kesalahan proses saya.

## 4. Pengulangan skill/instruksi
`sutradara/SKILL.md` ↔ `sutradara/referensi/*` (prinsip kamera ditulis tiga kali: SKILL, `bahasa-kamera.md`, `arahan-animasi.md`); `remotion-fitur/SKILL.md` ↔ `kartu-teknik.md` (lingkungan render tertulis dua kali); `CLAUDE.md` ↔ `WORKFLOW.md` (gerbang kualitas dua kali); `docs/visual-system/` memuat lima dokumen audit/proposal yang saling merujuk (AUDIT, PROPOSAL, CHANGE_PLAN, CHANGELOG, HASIL) dan kini dua lagi.

## 5. Penjelasan mekanisme lewat animasi: kelemahan
- Tidak ada pedoman **urutan sebab-akibat** (kondisi awal → fokus → jalur → proses berurutan → hasil → jeda). `sutradara/referensi/gerak.md` memuat easing dan hierarki gerak, bukan struktur penjelasan.
- Pilot lama: titik air/lempung bergerak sementara kamera bergerak (konflik "kamera bergerak sementara informasi utama bergerak"); S3 pilot saya melakukannya.
- `breakdown` Mode A hanya exploded view isometrik; tidak ada pedoman aliran (listrik, panas, tekanan), perbandingan komponen, atau pembesaran detail.

## 6. Ketergantungan pada gambar referensi tanpa penjelasan tertulis
`style/aset.md` ("Cara kerja dengan referensi": user mengirim screenshot, Claude "menyimpan dan menuliskan yang diambil"); `style/referensi-visual/01–07` berisi gambar dan lembar kontak; hanya `05-gerak-video` punya `style/gaya-penjelasan.md` §9 untuk metrik. Tak ada berkas yang menyatakan "karakteristik apa yang dipertahankan, apa yang diperbaiki" per referensi. Mode B `breakdown` (Tahap 4) menyediakan templat, **belum pernah dipakai**.

## 7. Dampak ke kualitas visual (ringkas)
Konflik 1, 2, 5 → visual realistis ala render. Tidak ada kategori → pola sama untuk semua topik. Storyboard dari kode → tak ada rancangan sebelum coding. Banyak aturan terpisah → Claude menebak. Kelemahan animasi mekanisme → "objek bergerak" tanpa sebab-akibat.

## 8. Usulan perbaikan dan file yang akan diubah (menunggu persetujuan)
Lihat `PROPOSAL_WORKFLOW_V4.md`. Ringkas: (a) satu **Visual Style Specification** (`docs/visual-system/VISUAL_STYLE_SPEC.md`, draf sudah ada) sebagai sumber tunggal identitas, mengganti sebaran `style/style.md`, `identitas.md`, `e1-visual-kode.md` §4; (b) langkah **Brief + Kategori** di awal `WORKFLOW.md`; (c) `sutradara` memilih **jalur teknik berurutan** (SVG/CSS 2D → 2.5D → 3D hanya bila perlu); (d) storyboard dirancang sebelum kode; (e) revisi `remotion-fitur/kartu-teknik.md` dan `docs/visual-system/matriks/HASIL.md` (hapus rekomendasi `noir3d`); (f) hentikan `Pilot02B/C` sebagai arah; (g) pedoman animasi mekanisme di `sutradara/referensi/`.
