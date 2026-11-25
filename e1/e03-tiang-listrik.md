# E1 LOG #03: Tiang Listrik di Depan Pagar, Tolak Rezeki?

> Salin file ini ke `e1/eNN-<slug>.md` di awal video. Field mengikuti `WORKFLOW.md` bagian 11 (log), 08 (pilot), 03 (keputusan). Isi saat kejadian, jangan menunggu akhir.
> Folder Drive: `Fakta Rumah / E1 / #NN - Judul Video`

## 1. Log eksperimen
| Field | Value |
|---|---|
| Experiment | E1 |
| Video ID | E1-03 |
| Topic | Mitos tiang listrik depan pagar (ide #2 dari 10) |
| Date published | |
| Visual style | Gaya E1-03 (dunia miniatur 3D distilisasi) |
| Duration | 68,4 dtk (VO 67,7) |
| Hook | A: "Tiang listrik berdiri pas di depan pagar. Kata orang tua, rezeki rumah itu bakal seret." |
| Production time | |
| Waktu render / putaran revisi kode | Render final per bagian 7×300 frame satu tab ±25 mnt; render utuh concurrency 2 ±10,5 mnt tetapi frame rusak (dibuang). Revisi: R1 mobil + 2 perbaikan teknis |
| Views at 24h | |
| Views at 48h | |
| Average watch time | |
| Retention | |
| Completion rate | |
| Shares | |
| Saves | |
| Comments | |
| Notes | **Berhasil; dijadikan patokan visual aktif (25 Nov 2026), `style/gaya-e1-03.md`** |

## 2. Approval (pemilik channel)
Isi tanggal hanya setelah user menjawab di chat.
- [x] Topik final: 24 Nov (pilihan user)
- [x] Script final: 24 Nov, ACC hook A
- [x] Style reference: 25 Nov, ACC setelah R1 (mobil hatchback generik dari foto referensi user)
- [x] Render batch besar: 25 Nov (ACC user, Tiang03 ±10 mnt)
- [ ] Publish: 
- [ ] Merge ke `main`: 

## 3. Rencana adegan visual (isi sebelum render, WORKFLOW Step 3 dan 09–10)
| Shot | Tujuan penjelasan | Objek utama | Geometri | Metode visual | Gerakan | Kamera | Komposisi | Material | Lighting | Durasi |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 Hook 0–4,9 | tiang pas di depan pagar | tiang PLN 9 m | silinder lancip, palang, isolator, kabel tube | 3D perspektif | - | push-in | tiang kiri, kicker atas | beton, plester, genteng | matahari + hemisphere | 4,9 |
| 2 5–10 | tiang tak paham rezeki | rumah + tiang | sama | 3D | - | orbit pelan | lebar | sama | sama | 5,2 |
| 3 Denah 10,2–22 | mobil sulit keluar | city car generik | profil ekstrusi + bevel | isometrik (skill iart isometric) | mundur, belok, mentok (spion/bemper merah) | ortografis drift | denah atas | cat silver | sama | 11,8 |
| 4 Breakdown 22–33,6 | kabel dekat lantai 2/kanopi | rumah + kabel | atap diangkat, lantai 2 jatuh dari atas, kanopi | breakdown isometrik | build bawah-ke-atas, zona merah | ortografis | label kiri/kanan | sama | sama | 11,6 |
| 5 Dijual 33,6–41 | harga ditawar | papan DIJUAL | kotak | 3D + kartu harga | papan naik | orbit | kartu kanan | - | sama | 7,4 |
| 6 Pindah 41–57,6 | prosedur PLN | tiang bayangan | sama | 3D + kartu 3 langkah | tiang bayangan bergeser | pull-back | kartu tengah | - | sama | 16,6 |
| 7 Larangan 58–63,6 | jangan geser sendiri | pangkal tiang | sama | 3D + ikon larangan | - | close-up | ikon tengah | - | sama | 5,6 |
| 8 Penutup 63,6–68,4 | CTA | rumah | sama | 3D | - | crane mundur | lebar | - | sama | 4,8 |
- [ ] `node tools/cek-mandiri.mjs` OK

## 4. Pilot (hanya video pertama, WORKFLOW 08)
| Kriteria | Hasil |
|---|---|
| Visual quality | |
| Style | |
| Motion | |
| Consistency | |
| Cost (waktu render, revisi; kredit generator = 0) | |
| Time | |
| Usability | |
- Keputusan pilot: [ ] lanjut  [ ] revisi (kode adegan / style / kamera / metode visual)

## 5. Log render
| Shot ID | Jenis (still / klip / penuh) | Komposisi | Waktu render | Putaran ke- | Hasil (lolos / gagal) | Catatan |
|---|---|---|---|---|---|---|
| | | | | | | |

## 6. Masalah produksi
Contoh: inkonsistensi komponen/material, animasi kaku, camera movement failure, text overlay issue, render terlalu lama, editing delay.
| Masalah | Shot | Penyebab | Tindakan |
|---|---|---|---|
| | | | |

## 7. QC akhir (WORKFLOW Step 8)
- [ ] Fact check: klaim utama bersumber, tanpa angka tak terverifikasi, simplifikasi tidak menyesatkan
- [ ] Visual: komponen rumah, lighting, warna, material konsisten; tanpa z-fighting/objek tembus/flicker; teks terbaca; logo tak relevan tidak ada
- [ ] Audio: VO jelas, tanpa clipping, volume stabil, musik tidak mengganggu
- [ ] Editing: hook langsung, tanpa dead space, CTA singkat, 9:16, bisa dipahami tanpa audio
- [ ] Caption + komentar pin lewat humanizer

## 8. Evaluasi (setelah 48 jam, bandingkan dengan B0 ±1.825 views / ±40% dan #9 2.794 views / 57%)
| Target | Hasil | Lolos? |
|---|---|---|
| Average retention ≥ 50% | | |
| Views 48 jam ≥ 2.000 | | |
- Keputusan sementara video ini: [ ] CONTINUE  [ ] ITERATE  [ ] STOP
- Catatan: keputusan eksperimen diambil dari ketiga video, bukan satu video.

## Catatan #03
- Skill motion: iart-ai `isometric-animation` + `threejs-animation` (dipilih user 24 Nov), di-clone dari github.com/iart-ai; dipakai sebagai lapisan di atas `look.tsx`.
- VO Gemini Achernar, 1 generasi, 67,7 dtk, lolos `cek_suara` (F0 163 Hz). Timestamp `tools/align_teks.py`.
- Sumber: detik.com (prosedur PLN 123/PLN Mobile, survei, biaya pemohon Rp1–4 juta satu sumber; kasus Sidoarjo Rp11 juta). [CEK] tawar harga & kabel dekat lantai 2 = logika umum, tanpa angka jarak.
- R1 (25 Nov): mobil kotak diganti hatchback 5 pintu generik dari foto referensi user (tanpa logo).
- Komposisi `Tiang03` (`remotion/src/e1/Tiang03.tsx`).

## Hasil render final (25 Nov 2026)
- Berkas: `remotion/out/e1-03-final.mp4` (lokal, tidak di-commit), dikirim ke user: penuh 1080×1920 (CRF 20, ±41 MB) + 540p (±3,6 MB).
- 68,4 dtk, 30 fps, −14,6 LUFS, true peak −1,3 dB (`cek_suara --video` OK).
- `cek-mandiri` OK · `cek_kilau` maks 167 px (batas 300; adegan tele tidak tercakup nudge) · `cek-frame-rusak` 0 frame tile, 3 frame polos = dip penutup yang disengaja.
- Masalah & perbaikan: (1) kanvas perspektif/ortografis berganti + komponen di dalam komponen → 3D hilang & frame tile; diganti satu kanvas + kamera tele; (2) render concurrency 2 tetap memberi ±90 frame tile → render per bagian satu tab (`tools/render-bagian.sh`).
- Kelemahan tersisa: atap mobil polos dari atas; label "Kabel tetap bertegangan" sedikit tertutup ikon larangan (±60 dtk).
- Still patokan: `referensi/e1-03/` · cadangan kode: branch `backup/e1-03-tiang-listrik` (commit 8539ed6).
