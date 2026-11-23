# AUDIT_REPORT: sistem produksi Channel-Penjelasan (23 Nov 2026)

Cakupan: `CLAUDE.md`, `WORKFLOW.md`, `STATUS.md`, `KEPUTUSAN.md`, 5 skill di `.claude/skills/`, `prompts/ScriptForge.md`, `style/*.md`, `tools/*`, `remotion/src/kit/*`, `remotion/src/e1/*`, 25 komposisi video lama (`remotion/src/v05`–`v24`), `Root.tsx` (57 `<Composition>`).
**Batas audit (jujur):** `AGENTS.md` tidak ada. MP4 video lama (#5–#26) tidak ada di repo, jadi video lama dinilai dari kode dan catatan `STATUS.md`, bukan dari tontonan. Dua video E1 (#01, #02) dinilai dari frame render sungguhan dan dari penilaian pemilik channel ("kok stylenya seperti itu semua", "jelekkk").
**Prioritas:** P0 = merusak kualitas inti dan harus diganti; P1 = penting; P2 = rapikan belakangan.

## Diagnosis satu kalimat
Sistem ini sangat kuat dalam **mengecek hal mekanis** (kerapatan teks, ukuran objek, z-fighting, nada suara) tetapi **tidak punya satu pun tahap yang menilai atau merancang cerita visual**. Hasilnya: narasi diterjemahkan kalimat demi kalimat menjadi "kotak 3D + kartu teks + subtitle", dan semua gerbang kualitas lulus sementara videonya tetap terasa seperti slide beranimasi.

---
## A. Masalah storytelling

**A1. Tidak ada tahap "sudut cerita" sebelum naskah.** (P0)
1. Salah: `WORKFLOW.md` Step 1 (riset) langsung ke Step 2 (naskah). `prompts/ScriptForge.md` STEP 2 menyebut "Research & Story Angle", tetapi tidak menghasilkan artefak (pertanyaan sentral, celah rasa ingin tahu, ekspektasi penonton, wahyu utama, progres emosi, potensi visual, penutup). `naskah/e1-01-*.md` dan `e1-02-*.md` tidak punya bagian itu.
2. Dampak: topik dianggap otomatis menarik. #01 ("rumah Belanda adem") bersandar pada satu artikel populer dan tidak punya momen wahyu yang tidak bisa diucapkan lewat narasi.
3. Lokasi: `WORKFLOW.md` Step 1–2; `.claude/skills/script-writer/SKILL.md` bagian 2 ("Topic Development" hanya "ask internally").
4. Ganti: tahap Story Angle dengan artefak wajib `angle.md` (lihat `PROPOSAL_ARCHITECTURE.md` Stage B).

**A2. Kerangka retensi kaku berbasis 47–50 detik masih hidup.** (P2)
1. Salah: `WORKFLOW.md` bagian 06 "Retention framework" (tabel 0–3 dtk, 3–10 dtk, … 44–50 dtk) padahal durasi diputuskan 50–70 dtk (`KEPUTUSAN.md`, 23 Nov).
2. Dampak: dua sumber kebenaran untuk ritme; Claude memilih salah satunya secara acak.
3. Ganti: ritme ditentukan per shot dari beban kognitif (lihat proposal), bukan tabel menit.

**A3. Cerita berhenti pada "fakta + saran generik".** (P1)
1. Salah: `naskah/e1-02-tanah-turun.txt` kalimat 5–7 (mekanisme, studi, "meninggikan lantai cuma menunda") berurutan sebagai daftar fakta; penutup "Rumah di dekatmu, ada yang lantainya sudah ditinggikan?" adalah pertanyaan generik yang sama dengan #01.
2. Dampak: bagian tengah monoton; tidak ada eskalasi atau kejutan visual.
3. Ganti: Storytelling Audit (Stage D) yang boleh membuang atau mengurutkan ulang kalimat sebelum visual dirancang.

## B. Masalah naskah

**B1. Naskah dikunci sebelum ada pemikiran visual, tanpa jalan balik.** (P0)
1. Salah: skill `script-writer` melarang membuat storyboard ("Do not automatically produce a complete video production workflow… Focus exclusively on script quality"), dan `WORKFLOW.md` meminta ACC script sebelum Step 3 (beat sheet).
2. Dampak: visual harus mengejar kalimat, bukan sebaliknya. Contoh: #02 baris "Tahun ke-8, tanah turun 75 cm" dibangun karena kalimat "sepuluh tahun satu meter" ada, bukan karena itu momen visual terbaik.
3. Ganti: setelah storyboard ada putaran "revisi naskah demi visual" sebelum animatic (Stage D → G).

**B2. Target kata menggerakkan panjang naskah.** (P2)
1. Salah: `script-writer/SKILL.md` bagian 8 ("approximately 110–155 words") dan `cek_suara.py` (kata/dtk).
2. Dampak: naskah diisi sampai ±131 kata walau beberapa kalimat hanya pengisi ("Orang bilang air lautnya naik. Airnya memang naik.").
3. Ganti: batas kata menjadi pagar, bukan target; hapus kalimat yang tidak dibutuhkan visual atau cerita.

**B3. Subtitle mengulang seluruh narasi.** (P1)
1. Salah: `kit/teks.tsx` `Captions` dipasang penuh di `Rumah01.tsx` dan `Tanah02.tsx` pada y=1400 (`CC_TOP`, `kit/waktu.ts`), sementara `WORKFLOW.md` Step 7 menulis "Jangan mengulang seluruh voice-over".
2. Dampak: ditambah kicker dan label, satu informasi muncul tiga kali (suara, subtitle, kicker). Penonton tidak punya hal baru untuk dibaca.
3. Ganti: subtitle hanya sebagai aksesibilitas yang bisa dimatikan per shot; teks kreatif hanya untuk informasi yang bukan narasi (angka, nama, pertentangan).

## C. Masalah visual storytelling

**C1. Satu tata bahasa visual untuk semua beat.** (P0)
1. Salah: setiap kalimat menjadi satu "animasi": kicker di atas, objek 3D di tengah, subtitle di bawah. `Tanah02.tsx` 10 shot dan `Rumah01.tsx` 9 shot memakai pola persis itu; `WORKFLOW.md` Step 3 menuntut 8–12 shot tanpa membedakan teknik.
2. Dampak: inilah yang dibaca pemilik channel sebagai "stylenya seperti itu semua". Tidak ada momen footage murni, hening, tipografi besar, atau diagram minimal.
3. Ganti: Visual Director memilih mode per beat dari kosakata visual (lihat proposal).

**C2. Klaim penting dibuktikan dengan visual yang tidak membuktikan.** (P1)
1. Salah: "Semarang tercepat kedua dari 99 kota" ditampilkan sebagai daftar tiga baris (`KartuStudi` di `Tanah02.tsx`), tanpa peta, tanpa data, tanpa wajah dunia nyata. "10 cm per tahun" ditampilkan sebagai kotak rumah turun.
2. Dampak: terasa seperti klaim tanpa bukti. Penonton skeptis tidak diyakinkan.
3. Ganti: bukti yang bisa dilihat (peta lokasi, garis waktu data bila sumber ada, foto sebelum-sesudah, penggaris dunia nyata).

**C3. Rumah "3D" membaca sebagai mainan.** (P1)
1. Salah: `look.tsx` `RumahKampung` = kotak dengan tekstur kanvas, atap oranye polos, jendela dan pintu datar; lawan fotonya (`e1-02/rumah-ditinggikan.jpg`) ada di layar yang sama dan perbedaannya mencolok.
2. Dampak: foto asli membuat 3D tampak lebih palsu.
3. Ganti: kurangi kontak langsung foto-vs-3D; pakai 3D untuk hal yang tidak bisa difoto (struktur bawah tanah, mekanisme), dan footage untuk kenyataan.

## D. Masalah komposisi

**D1. Tata letak dikunci sebagai hukum, bukan sebagai default.** (P0)
1. Salah: `kit/waktu.ts` `CC_TOP = 1400 // posisi subtitle (ACC user, jangan diubah)`; `Kicker` di `e1/AnatomiRumah.tsx` `top: 150`; `Title` di `kit/teks.tsx` `top = 450`; `tools/cek-sutradara.mjs` bagian 9 menandai GAGAL bila "objek <1/3 tinggi layar", "judul bukan dua baris", "stiker di luar x 250..900".
2. Dampak: gerbang yang dirancang agar video #7–#8 konsisten sekarang mencegah komposisi sinematik (ruang negatif, objek di tepi, sudut tidak simetris).
3. Ganti: komposisi ditentukan per shot (kolom "komposisi" dalam shot list); zona aman tetap, penempatan bebas.

**D2. Segalanya di tengah, dilihat dari depan.** (P1)
1. Salah: `Tanah02.tsx` `KD` kunci kamera: pusat `look` x≈0,4 di semua shot; objek utama selalu di tengah.
2. Dampak: tidak ada arah layar, kedalaman, atau hierarki prioritas.
3. Ganti: aturan komposisi (aturan sepertiga, garis pandang, latar-tengah-depan).

## E. Masalah bahasa kamera

**E1. Kamera nyaris tidak bergerak dan hanya satu jenis.** (P0)
1. Salah: `kit/waktu.ts` hanya punya 3 preset (`kamera.push`, `orbit`, `pull`); `style/gaya-penjelasan.md` mendaftar 5 (push, orbit, pull, dive, crane) dan mensyaratkan "≥4 jenis per video". Di E1, `Tanah02.tsx` memakai `orb(t, az, el, d, look)` dengan azimut −16°…+8° dan elevasi 5–9° untuk hampir semua kunci (4 kunci el 8, 4 kunci el 6, 2 kunci el 5); jarak seragam 19–21.
2. Dampak: "kamera" hanya menggeser sedikit; tidak ada macro, POV, tracking, whip pan, rack focus, atau kamera terkunci yang disengaja.
3. Ganti: perpustakaan bahasa kamera dengan tujuan naratif (lihat proposal Stage 4).

**E2. Satu lensa, tanpa kedalaman medan.** (P1)
1. Salah: `FOV = 34` tetap (`kit/waktu.ts`); tak ada DOF, rack focus, atau motion blur (`@remotion/motion-blur` terpasang di `remotion/package.json`, tidak dipakai di E1).
2. Dampak: tidak ada perhatian yang diarahkan lewat fokus; semuanya sama tajam.
3. Ganti: DOF palsu berbasis lapisan blur atau pass fokus, diterapkan hanya bila bernilai cerita.

**E3. Satu transisi untuk semuanya.** (P1)
1. Salah: `Seg` di `kit/stage.tsx` memakai `OV = 8` frame cross-fade; E1 memakai kilat krem ("dip") di `Rumah01.tsx` dan `Tanah02.tsx` (3 kali) untuk setiap perpindahan.
2. Dampak: transisi tidak membawa makna.
3. Ganti: transisi dipilih per pasangan shot (match cut, push-through, wipe bermasker, depth reveal, kembali ke kenyataan).

## F. Masalah animasi

**F1. Gerak = interpolasi linear/kubik tanpa karakter.** (P1)
1. Salah: `r(t,a,b)` dengan `ease` tunggal (`inOut cubic`) di `kit/waktu.ts`; partikel udara (`Udara` di `Rumah01.tsx`) dan titik air (`Bongkar` di `Tanah02.tsx`) bergerak pada kecepatan seragam; semua bergerak bersamaan (kamera + partikel + label).
2. Dampak: tidak ada antisipasi, bobot, overshoot, atau hierarki gerak; mata tidak tahu harus ke mana.
3. Ganti: hierarki gerak (primer, sekunder, latar) dan resep easing yang dinamai per tujuan.

**F2. Tanah "turun" sebagai translasi kaku.** (P2)
1. Salah: `Dunia` di `Tanah02.tsx` menggeser seluruh `<group position={[0, -drop, 0]}>`; pemampatan hanya terlihat di scene breakdown.
2. Dampak: kejadian utama cerita (tanah memampat) tidak tampak di shot utamanya.
3. Ganti: deformasi terkendali (lapisan mengecil, retak, garis air) di shot utama.

## G. Masalah footage dunia nyata

**G1. Foto adalah kartu penutup layar.** (P0)
1. Salah: `FotoMomen` (`e1/Rumah01.tsx`): `AbsoluteFill` krem opasitas 0,9, kartu 1000×640 di `top: 300`, `Img objectFit: 'cover'`, animasi hanya fade + skala 0,95→1, lalu hilang. Dipakai 3× di #01 dan 4× di #02 dengan tampilan identik.
2. Dampak: foto tidak punya peran naratif (tidak ada dorongan ke detail, tidak ada sorotan yang membawa ke 3D, tidak ada kembali ke kenyataan); menutupi adegan; selalu di posisi yang sama.
3. Ganti: `FootageShot` dengan crop terancang, gerak kamera pada foto (parallax sederhana, push ke detail), sorotan, dan transisi masuk/keluar ke visualisasi (Stage 5 membuat contoh nyata).

**G2. Tidak ada sistem asal-usul footage.** (P1)
1. Salah: foto pemilik channel disalin ke `remotion/public/e1-0N/` dan di-gitignore; tidak ada berkas yang mencatat sumber, alasan, bagian yang penting, crop, durasi, relasi ke narasi. `WORKFLOW.md` bagian "Perbandingan real-life" mencatat aturan, bukan format.
2. Dampak: tidak bisa direproduksi atau diaudit; risiko hak cipta tidak terlacak.
3. Ganti: manifes footage (`footage.json`) per video dengan kolom wajib.

**G3. Tidak ada pemeriksaan keaslian foto.** (P1)
1. Salah: foto banjir #02 (`rob-permukiman.jpg`) tampak sangat halus (kemungkinan hasil AI), tetapi tidak ada langkah yang menahannya.
2. Dampak: bukti kasus nyata bisa palsu, bertentangan dengan aturan "tanpa aset AI" di `CLAUDE.md`.
3. Ganti: gerbang provenance (sumber, fotografer, tanggal, lokasi) sebelum footage dipakai.

## H. Masalah motion design

**H1. Kartu teks bergerak dengan resep sama.** (P1)
1. Salah: `Title`, `Kicker`, `KartuStudi`, `Saran` semua fade + geser 40–80 px dengan `Easing.out(cubic)` 0,3–0,6 dtk, satu keluarga huruf (Inter 600/900).
2. Dampak: tidak ada ritme tipografi; teks menjadi pemisah slide.
3. Ganti: sistem tipografi editorial (skala, kontras, kinetik hanya pada kata kunci).

**H2. Tidak ada desain suara.** (P1)
1. Salah: `Rumah01` dan `Tanah02` hanya memutar VO; `tools/mix-audio.mjs` dan `remotion/public/sfx/*` ada tetapi tidak dipakai di E1.
2. Dampak: keheningan datar; transisi dan reveal tidak punya bobot; pemilik channel menyebut video lama "biasanya" berbeda.
3. Ganti: lapis suara (ambience, aksen reveal, jeda sengaja) sebagai bagian shot list.

## I. Masalah teknis Remotion

**I1. Setiap video adalah TSX tulisan tangan dengan waktu dan posisi ditanam di kode.** (P0)
1. Salah: `v16/Video16.tsx` 529 baris, `Rumah01.tsx` ±210, `Tanah02.tsx` ±270; cue dalam detik literal; 57 `<Composition>` di `Root.tsx`; template berbasis data (`beats.json` + `Penjelasan`) hanya untuk pipeline 3D lama.
2. Dampak: mengubah VO atau urutan berarti mengedit puluhan angka; iterasi kreatif mahal; kualitas bergantung ketelitian saya.
3. Ganti: shot list sebagai data (`shots.json`) yang menggerakkan komponen `Shot` (waktu, kamera, footage, teks, suara).

**I2. Peretasan pemetaan waktu.** (P1)
1. Salah: `Rumah01.tsx` `wt()` memetakan waktu nyata ke "waktu lama" lewat `public/e1-01/peta.json` setelah VO diganti.
2. Dampak: bukti bahwa cue tidak terikat ke kalimat; fragil.
3. Ganti: cue terikat ke ID kalimat/kata, dihitung dari `words.json` saat build.

**I3. Iterasi visual lambat dan mahal.** (P1)
1. Salah: render 58 dtk ±9–10 menit (swangle di CPU, `remotion.config.ts`); `tools/animatic.mjs` hanya untuk pipeline lama; aturan "1 sheet per putaran" di `CLAUDE.md` (hemat token) menghambat pengamatan.
2. Dampak: video #01 dan #02 dirender penuh sebelum pernah ditonton oleh saya; penilaian visual bergantung 8 still statis.
3. Ganti: animatic dari still + VO (cepat), dan alat tinjau video (strip frame + metrik gerak) sebelum render final.

**I4. Pustaka bersama tersebar di berkas yang salah.** (P2)
1. Salah: `Tanah02.tsx` mengimpor `FotoMomen` dari `Rumah01.tsx` dan `Kicker/Label` dari `AnatomiRumah.tsx` (komposisi uji coba).
2. Dampak: perubahan pada satu video merusak video lain; arah dependensi tidak jelas.
3. Ganti: `remotion/src/e1/lib/*` terpisah dari komposisi.

**I5. Kelas bug z-fighting baru tertangkap setelah dilihat pengguna.** (P2, sudah dimitigasi)
1. Salah: lantai berkedip di #01 (11.790 piksel) lolos dari semua cek.
2. Sudah ada: `tools/cek_kilau.py`; `style/cek-bug.md`. Masih perlu: aturan penumpukan di `look.tsx` (`Blok`) agar tidak terulang secara struktural.

## J. Masalah arsitektur workflow dan skill

**J1. Tiga zaman aturan bercampur.** (P0)
1. Salah: `CLAUDE.md` memuat "ARAH AKTIF E1" (judul masih berbunyi "semi-realistis AI"), lalu "ATURAN LAMA" (gerbang T1–T7, KUNCI KARAKTER yang mewajibkan "terlihat seperti #7, #8, #10, #13, #14", hemat token); `WORKFLOW.md` 1.028 baris, sebagian besar prosa Inggris tentang eksperimen, benchmark, dan kredit generator yang sudah tidak relevan.
2. Dampak: Claude membaca ±2.800 baris aturan yang saling bertentangan (KUNCI KARAKTER vs semi-realistis; "jangan ulangi VO" vs subtitle penuh; "Pilot 1 adegan" vs produksi penuh).
3. Ganti: satu `CLAUDE.md` pendek (arah aktif saja), `WORKFLOW.md` ringkas per tahap (Input, Tugas, Output, Kriteria, Selesai), sisanya ke `arsip/`.

**J2. Tidak ada peran Direktur Visual.** (P0)
1. Salah: lima skill: `script-writer` (naskah), `sutradara` (DNA #7–#8 + "lapisan sutradara" B yang masih mengunci template lama), `remotion-fitur` (efek), `breakdown` (satu teknik, memuat gaya sampel dan HyperFrames yang dilarang), `social-video-scriptwriting` (duplikat). Tidak ada skill yang memutuskan teknik visual, kamera, komposisi, footage, atau transisi per beat.
2. Dampak: keputusan visual jatuh ke implementasi, sehingga default termudah (kotak 3D + kartu) menang.
3. Ganti: satu skill `visual-director` (menggabungkan sutradara + remotion-fitur + breakdown sebagai teknik) dengan dokumen referensi (lihat proposal).

**J3. Gerbang kualitas hanya mekanis.** (P0)
1. Salah: `cek-sutradara.mjs`, `cek_kilau.py`, `cek_suara.py`, `cek-gerak.sh`, `cek-mandiri.mjs` mengukur ukuran, kedipan, nada, API. Tidak ada gerbang yang menilai cerita, variasi visual, bahasa kamera, hierarki, atau pengalaman menonton.
2. Dampak: #02 lolos semua gerbang dan tetap dinilai "jelekkk".
3. Ganti: Visual QA dengan strip frame dari MP4 sungguhan + daftar periksa kreatif + metrik variasi (jumlah jenis kamera, jumlah mode visual, rasio frame diam).

**J4. Persetujuan pemilik terjadi terlalu awal dan terlalu akhir.** (P0)
1. Salah: pemilik menyetujui topik dan naskah, lalu baru melihat visual setelah semuanya dibangun dan dirender (#01 v1 lalu v2, #02 "kok stylenya seperti itu").
2. Dampak: rework mahal; kepercayaan turun.
3. Ganti: gerbang persetujuan pada storyboard dan animatic (murah), bukan pada render akhir.

**J5. Aturan hemat token melawan inspeksi visual.** (P1)
1. Salah: `CLAUDE.md` "Cek gambar oleh Claude sendiri dibatasi 1 sheet per putaran".
2. Dampak: mendorong lolos tanpa melihat; video akhir tidak pernah ditonton (terbukti di #01 dan #02).
3. Ganti: hemat token tetap berlaku untuk riset/teks, tetapi inspeksi visual video final wajib (strip 24 frame + 3 klip pendek).

---
## Yang layak DIPERTAHANKAN
- Infrastruktur deterministik Remotion + three.js, `camAt`, `proj`, `Label` berbasis `proj`.
- `tools/align_teks.py` (timestamp per kata), `cek_suara.py`, `cek_kilau.py`, `cek-mandiri.mjs`.
- `look.tsx` (material prosedural) sebagai dasar, dengan aturan penumpukan.
- Konsep breakdown selektif (satu scene khusus), alur caption + humanizer, folder Drive per video.
- Aturan "tanpa API AI", "fakta bersumber [CEK]", "persetujuan pemilik sebelum publish".

## Ringkasan prioritas
**P0 (ganti dulu):** A1 sudut cerita, B1 jalan balik naskah↔visual, C1 satu tata bahasa, D1 tata letak sebagai hukum, E1 kamera, G1 footage sebagai kartu, I1 video tulisan tangan, J1 tiga zaman aturan, J2 tanpa Direktur Visual, J3 gerbang mekanis, J4 persetujuan terlambat.
**P1:** A3, B3, C2, C3, D2, E2, E3, F1, G2, G3, H1, H2, I2, I3, J5.
**P2:** A2, B2, F2, I4, I5.
