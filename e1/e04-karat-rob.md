# E1 LOG #04: Kenapa Air Rob Bikin Kendaraan Karatan?

> Salin file ini ke `e1/eNN-<slug>.md` di awal video. Field mengikuti `WORKFLOW.md` bagian 11 (log), 08 (pilot), 03 (keputusan). Isi saat kejadian, jangan menunggu akhir.
> Folder Drive: `Fakta Rumah / E1 / #NN - Judul Video`

## 1. Log eksperimen
| Field | Value |
|---|---|
| Experiment | E1 |
| Video ID | E1-04 |
| Topic | Air rob & karat kendaraan (dipilih user 25 Nov, di luar 5 kandidat) |
| Date published | |
| Visual style | Gaya E1-03 (dunia miniatur 3D distilisasi) |
| Duration | |
| Hook | |
| Production time | |
| Waktu render / putaran revisi kode | |
| Views at 24h | |
| Views at 48h | |
| Average watch time | |
| Retention | |
| Completion rate | |
| Shares | |
| Saves | |
| Comments | |
| Notes | |

## 2. Approval (pemilik channel)
Isi tanggal hanya setelah user menjawab di chat.
- [x] Topik final: 25 Nov ("iya pakai topik ini")
- [x] Script final (dikunci): 25 Nov, hook A, v1
- [x] VO final: 25 Nov (Gemini Achernar, 61,4 dtk)
- [ ] Style reference: 
- [ ] Render batch besar (komposisi + estimasi waktu disetujui): 
- [ ] Publish: 
- [ ] Merge ke `main`: 

## 3. Rencana adegan visual (fase 4 `WORKFLOW.md`, dari waktu VO final; tabel `style/gaya-e1-03.md` §7)
| Adegan (detik VO) | Kalimat VO | Tujuan penjelasan | Objek utama | Metode visual | Gerakan | Kamera (mode + gerak + alasan) | Teks/label | Skill pustaka | Transisi/SFX | Durasi |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 · 0,0–3,1 | Air rob sudah surut, motor sudah kering. | Anggapan: surut + kering = aman | Motor di carport rumah pesisir | Dunia miniatur; air rob turun, garis bekas rob di tembok/jalan | Muka air turun, bodi motor dari basah mengilap jadi kusam kering | Perspektif, push-in pelan (one move) ke motor di titik sepertiga bawah | Kicker sejak frame 0: "Udah kering, aman?" | short-form-video (hook frame 1), shot-composition | potong keras / – | 3,1 |
| 2 · 3,4–5,8 | Justru di situ karatnya mulai kerja. | Belokan dibuka (loop terbuka) | Rangka/kolong motor | Bercak karat tumbuh di rangka | Bercak oranye-cokelat menyebar | Punch-in cepat ke kolong (pattern interrupt) | Kicker "Karatnya mulai kerja" | short-form-video (punch-in) | push masuk = match cut ke makro | 2,4 |
| 3 · 6,6–14,3 | Karat itu… baterai kecil. Besi, air, sama oksigen saling oper listrik… besinya pelan-pelan habis. | Karat = reaksi listrik kecil (ilustrasi) | Pelat besi + tetes air (makro) | Tele/isometrik-semu, diagram 3D: elektron (kuning) dari tengah tetes ke tepi, oksigen (biru) masuk di tepi | Lekuk di bawah tetes makin dalam + karat | Tele, orbit pelan ±10° | Label Besi (9,2) · Air (9,6) · Oksigen (10,4); tag "ilustrasi" | particle-system (≤120, ber-seed), isometric-animation, diagram-animation | dip pendek 6,2 | 7,7 |
| 4 · 15,1–17,4 | Air hujan lemah buat ngalirin listrik. | Pembanding: air tawar | Tetes kiri "Air hujan" | Diagram 3D berdampingan | Sedikit ion, elektron lambat | Tele statis (dorong 2%) | Label "Air hujan" | particle-system | tetes kanan muncul = interrupt | 2,3 |
| 5 · 17,9–22,9 | Air laut kuat banget, karena isinya garam. Jadi baterainya jalan jauh lebih cepat. | Garam = penghantar kuat | Tetes kanan "Air laut" | Sama, ion Na/Cl padat | Ion penuh, elektron jauh lebih cepat, lekuk lebih dalam dari kiri | Tele pan ke kanan | Label "Air laut" (merah aksen) | particle-system, color-motion | potong keras | 5,0 |
| 6 · 23,7–30,4 | Garamnya juga nyelip lewat goresan cat. Karatnya tumbuh di bawah cat… catnya menggelembung. | Karat tumbuh tak terlihat di bawah cat | Penampang besi + cat (breakdown, momen khas #1) | Breakdown tele: lapisan cat di atas besi, goresan | Ion klorida (hijau) masuk lewat goresan → karat merambat di bawah cat → cat menggelembung (naik di sumbu Y) | Tele, crane turun pelan | Label Cat · Goresan · Karat di bawah cat | isometric-animation (breakdown), particle-system | dip + hening 0,96 dtk (30,4–31,4) | 6,7 |
| 7 · 31,4–34,5 | Yang bikin repot, garam laut itu narik air dari udara. | Belokan utama | Kerak garam putih di kolong | Perspektif dekat kolong; kristal garam (instancing) | Titik uap air dari udara tertarik ke kerak, kerak mengilap basah | Perspektif, push-in kecil | Kicker "Kering, tapi lembap" | particle-system, threejs-animation (instancing) | potong keras | 3,1 |
| 8 · 35,1–40,0 | Motornya kelihatan kering, tapi kerak garam di kolong tetap lembap, dan karatnya jalan terus. | Bukti: atas kering, bawah basah | Motor utuh | Perspektif, kontras atas kusam vs kolong basah | Karat merambat terus di kolong | Pull-back pelan (konteks) | Label "Kelihatan kering" (atas) · "Tetap lembap" (kolong) | shot-composition | dip 40,4 | 4,9 |
| 9 · 40,7–45,8 | Makanya di pesisir Semarang yang langganan rob, ada motor yang rangkanya sampai keropos dan patah. | Bukti nyata | Pipa rangka motor | Kartu kasus di atas adegan + rangka 3D berlubang | Lubang bertambah, rangka patah di 45,0 | Tele statis → guncang kecil saat patah | Kartu "Pesisir Semarang · langganan rob" + sumber kecil (GridOto, detik Jateng) [CEK] | diagram-animation, kinetic-typography | dip 46,3 | 5,1 |
| 10 · 46,6–56,3 | Jadi habis lewat rob, siram pakai air tawar hari itu juga. Kolong, pelek, sama bagian bawah jangan kelewat. Kalau sampai terendam, jangan langsung dinyalakan. | Aksi | Motor + selang | Perspektif; semprotan air (partikel) ke kolong/pelek | Semprot pindah titik sesuai kata | Perspektif orbit pelan | Kicker "Hari itu juga" · label Kolong (50,5) · Pelek (51,2) · Bagian bawah (51,9) · ikon larangan kunci kontak (53,9) | particle-system, kinetic-typography | potong keras | 9,7 |
| 11 · 56,9–61,4 | Motormu sering lewat rob juga? Follow… | CTA + loop | Gang pesisir lebar | Komposisi = adegan 1 (loop ke frame 0) | – | Crane mundur ke bingkai hook | Kicker "Motormu juga?" → "Fakta Rumah" | short-form-video (loop), beat-sync-editing (resolve hold) | – | 4,5 |
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

## Fase 3: VO (25 Nov 2026)
- Gemini TTS Achernar (gemini-2.5-flash-preview-tts), gaya "santai, natural, tempo sedang", 1 generasi.
- `cek_suara`: 61,4 dtk, 2,25 kata/dtk, F0 median 161 Hz (acuan #03: 163 Hz), puncak 0,83, OK.
- `align_teks`: 138 kata, akhir 60,8 dtk; jeda terpanjang 0,96 dtk sebelum "Yang bikin repot" (pas sebelum belokan).
- Menunggu ACC VO dari user (pelafalan, tempo, kelengkapan didengar user).

## Fase 4: catatan perencanaan (25 Nov 2026)
- Skill dibaca (router): `short-form-video` (teks hook sejak frame 1, interrupt tiap ±2–4 dtk tidak rata, loop akhir = frame awal, zona aman), `shot-composition` (satu fokus di titik sepertiga, satu gerak kamera per adegan, ease-in-out), `beat-sync-editing` (busur: establish → develop memendek → klimaks di belokan 31,4 → resolve hold di CTA). Fase 5 akan membaca `particle-system`, `isometric-animation`, `diagram-animation`, `threejs-animation`, `kinetic-typography`.
- Momen khas: adegan 6 (karat di bawah cat, breakdown) dan 7 (garam menarik uap air). Breakdown hanya di adegan 6.
- Aset baru: motor prosedural (±1,9 m), air rob + garis bekas rob, kerak garam (instancing ±200), pelat besi makro + tetes air, lapisan cat bergelembung, tekstur karat ber-seed, selang + semprotan, pipa rangka berlubang. Dipakai ulang dari `Tiang03.tsx`: rumah/pagar/tetangga/jalan, langit, cahaya, `tele`/`Rig2`/`proj2`/`Kabut`, `Label2`, `Kartu`, `Larangan`, hatchback (latar).
- Biaya CPU: satu kanvas; partikel lewat InstancedMesh ≤150 per adegan; tanpa post-processing. Estimasi render penuh ±10 mnt / 60 dtk (per bagian).
- Style reference (fase 5): adegan 1 (hook), 3/5 (baterai makro), 6 (breakdown cat).

## Fase 5: style reference & revisi (25 Nov 2026)
- Style reference dikirim (hook, makro air hujan vs laut, breakdown cat). Revisi user:
  - [x] R1 air rob keruh warna lumpur (tekstur lempung, cokelat, opasitas 0,9; garis bekas rob cokelat).
  - [x] R2 kicker tidak tertimpa kanopi (kamera hook el 14°, bingkai akhir sama).
  - [x] R3 motor skuter matik generik dirombak (foto referensi user): profil ekstrusi bezier + "pahat" lebar (buritan meruncing, moncong menyempit), dek rata, tameng ±72°, batok trapesium + lampu, spion bertangkai lengkung, jok bertingkat + behel, garpu teleskopik + spakbor depan, spakbor belakang + pelat polos, CVT kiri, knalpot + pelindung kanan, standar samping (miring ±5°), ban menyentuh y=0, motor menghadap jalan.
- Tambahan Claude: motor di atas lantai carport (y 0,14), kamera adegan kerak garam, target semprotan & label mengikuti roda/kolong baru.
