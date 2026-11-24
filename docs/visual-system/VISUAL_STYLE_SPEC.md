# VISUAL STYLE SPECIFICATION (versi review, 24 Nov 2026)

Status: **menunggu review pemilik**; belum berlaku. Menggabungkan identitas yang sudah ada (#7/#8/#10: `style/style.md`, `style/identitas.md`, `style/palet.json`) dengan keputusan pemilik 24 Nov. Papan gaya (`style-board/papan-gaya.png`, `papan-kategori.png`) hanyalah ilustrasi pendukung; **teks ini adalah acuan utama**. Identitas = **sistem**, bukan satu template.

## 1. Identitas
Channel Penjelasan memakai **stylized illustration, flat graphic illustration, dan ilustrasi berdimensi sederhana**. Tujuannya: objek mudah dikenali, komposisi bersih, informasi mudah dipahami, dan animasi yang menjelaskan.
**Bukan default (dan tidak boleh jadi default):** semi-realistis, 3D realistis (render rumah/arsitektural), material realistis, PBR, pencahayaan realistis, kabut/atmosfer, tampilan CGI sinematik, tampilan demo software 3D.
3D boleh dipakai bila perlu, tetapi harus terstilisasi, sederhana, dan menyatu dengan identitas grafis. Bila SVG/CSS/2D bisa lebih jelas, pakai itu.

## 2. Bentuk
- Geometris sederhana, proporsi masuk akal dan konsisten; boleh disederhanakan, **ciri pengenal tetap** (bohlam: bola kaca + ulir; stop kontak: bidang + dua lubang; rumah: atap + badan + pintu).
- Detail hanya bila menolong pemahaman atau kualitas; tidak abstrak tanpa tujuan.
- Sudut membulat disukai (radius ≥ ±10% sisi pendek) tetapi bukan dogma; benda teknis (baja profil) boleh bersudut bila itu cirinya.

## 3. Tingkat detail (B default; boleh dicampur)
| Tingkat | Ciri | Kapan |
|---|---|---|
| A datar solid | isian warna, tanpa outline/bayangan | latar, objek sekunder, siluet, jumlah objek banyak, bentuk kecil |
| **B default** | isian warna + outline tipis konsisten + bayangan alas sederhana | objek utama, komponen yang dibahas |
| C volume 3 nada | terang/sedang/gelap, sedikit sorot; tanpa tekstur/glow | objek yang butuh volume terbaca (3D terstilisasi, bentuk bulat/silinder) |
Tidak semua objek dalam satu scene harus bertingkat sama: hero B atau C, pendukung A. Prioritas: objek dikenali, komposisi bersih, informasi jelas.

## 4. Outline
Default ada: tipis (±3 px pada kanvas 1080 lebar), tinta `#1c1c1e` (atau tinta preset), konsisten dalam satu video. **Fleksibel:** tak wajib pada setiap elemen; latar, bayangan, objek jauh, dan beberapa scene boleh tanpa outline. Jangan menebal atau membuat ramai (kesan clipart).

## 5. Warna: sistem peran (preset dan variasi boleh)
**Peran:** latar (+ latar2) · objek utama · fokus/aksen (satu per scene) · perbandingan (dua sisi A/B dibedakan warna) · informasi/data (angka, label) · netral (struktur, abu) · tinta (outline, teks). **Peran semantik** (bila relevan): aksen = masalah/fokus/bagian aktif · dingin (biru) = air, dingin, negatif · baik (hijau) = solusi, benar · kuning = benda bercahaya.
- **Preset:** `style/palet.json` (krem, mint, terakota, batu, madu, langit, malam) tersedia; **krem salah satu preset, bukan kewajiban** di setiap video/scene.
- **Membuat variasi palet** boleh bila terkendali: maksimal 5 keluarga warna per scene; satu aksen; kontras teks/latar memadai (validasi: `python3 tools/cek-visual.py palet`); selaras (hue berdekatan atau komplementer terkontrol); hierarki warna jelas.
- **Warna punya tujuan:** jangan mengganti warna hanya agar scene berbeda; ganti palet di tengah video hanya di titik perubahan makna.
- Hindari: glow, neon, gradien dekoratif, pelangi, warna acak. Gradien latar sangat lembut boleh.

## 6. Dimensi dan perspektif
Volume dan kedalaman boleh. **Pilih menurut kebutuhan:** samping/elevasi (potongan, struktur, perbandingan tinggi) · isometrik atau 3/4 (bentuk dan posisi) · overhead (lingkungan, jalan, arah matahari, posisi) · POV (garis pandang, privasi) · lainnya. Satu scene = satu perspektif; ganti hanya bila penjelasan menuntut (mis. dari utuh ke penampang).

## 7. Bayangan dan pencahayaan gaya
Bayangan alas lembut sebagai penanda posisi/kontak; bayangan jatuh sederhana untuk arah matahari bila itu informasinya. Pencahayaan = satu arah sederhana yang konsisten (3 nada). **Tanpa** pencahayaan realistis, pantulan, kabut, sinar volumetrik, atau efek lampu CGI. Cahaya dari benda (lampu menyala) = bentuk kuning solid + garis sinar pendek, bukan glow.

## 8. 3D terstilisasi (bila perlu)
Kapan: objek yang harus dilihat dari banyak sisi, potongan/exploded yang menjelaskan hubungan ruang, rotasi yang bermakna. **Aturan:** material datar atau 3 nada (`MeshStandard` roughness tinggi tanpa env map, atau `MeshToon`/shading buatan), geometri primitif membulat, outline tipis (`Edges`) bila level B, satu arah cahaya, latar ilustrasi, kamera sederhana, tanpa tekstur foto/PBR. Material dibedakan oleh warna dan pola grafis (garis serat, titik), bukan tekstur realistis. `remotion/src/e1/look.tsx` (material semi-realistis) **tidak** sesuai gaya ini kecuali disederhanakan.

## 9. Komposisi
Focal point jelas; hierarki (hero, pendukung, latar); ruang negatif aktif; objek, diagram, teks berhubungan; tidak semua di tengah; hindari objek tak perlu. Lingkungan boleh diilustrasikan utuh (jalan, rumah, kendaraan, matahari) bila topiknya situasi.

## 10. Tipografi dan elemen grafis (opsional)
Inter (judul/label), IBM Plex Mono (catatan/kicker), Playfair Display Italic (aksen editorial). **Kartu judul, kicker, hook box, kotak teks: opsional**, bukan template; jangan mengawali tiap video dengan kartu yang sama; jangan menampilkan teks hanya untuk mengisi layout. Pakai teks/grafis bila: memberi penekanan, menyampaikan data/angka, memberi nama bagian, memandu mata. Subtitle penuh default mati (bila diminta tersedia di `kit/teks.tsx`). Visual harus bisa dipahami tanpa membaca narasi penuh. Teks bergerak dengan fungsi (ditarik dari objek, ditulis sepanjang garis), bukan fade-slide seragam.

## 11. Foto nyata (fleksibel, dipilih karena kebutuhan konten)
Boleh: crop/reframing; pan/zoom bertujuan; layering dan parallax bila sesuai; masking dan reveal; anotasi; compositing dengan ilustrasi dan grafik. Duotone/posterize/treatment grafis **boleh bila cocok, tidak diwajibkan**; jangan memaksakan treatment demi konsistensi. Foto dipilih untuk bukti/konteks yang tak bisa digantikan ilustrasi, bukan sekadar latar. Foto dicari pemilik; tanpa sintesis AI. Resolusi: pan/zoom dibatasi sesuai ketajaman sumber (±1,8× untuk 1024 px); foto lanskap di layar potret perlu komposisi (jangan menyisakan ruang kosong). Catatan teknis: efek `@remotion/effects` tidak berfungsi di container CPU (lihat `matriks/HASIL.md`); gunakan CSS/SVG.

## 12. Animasi: bagaimana objek bergerak untuk menjelaskan
**Prinsip:** setiap gerak menjawab: apa yang terjadi, bagian mana berinteraksi, apa penyebab, apa akibat, urutannya, mengapa. Bukan gerak agar tampak hidup.
**Urutan mekanisme (8 langkah, dipakai bila ada proses):** 1 kondisi awal terlihat · 2 komponen relevan jadi fokus (yang lain redup, bukan hilang) · 3 sambungan/jalur diperlihatkan · 4 proses dimulai (pemicu jelas) · 5 aliran/gerak berurutan sesuai mekanisme nyata, bisa diikuti mata · 6 hubungan sebab-akibat terbaca (A menyebabkan B) · 7 hasil diperlihatkan · 8 jeda agar dipahami.
**Kosakata gerak informatif:** aliran sepanjang jalur (listrik, air, panas, tekanan) dengan satu warna aksen yang berjalan; denyut titik (pulse) pada titik interaksi; terurai/menyatu (exploded, gap seragam, lapisan bawah dulu); sorot (komponen lain meredup); pembesaran detail (lingkaran pembesar, inset); perubahan ukuran/jumlah (bar, penghitung); transformasi (A menjadi B); before/after (slider, split); penanda ukur tetap sebagai acuan.
**Waktu:** satu hal baru yang bergerak pada satu waktu (maks. satu pahlawan, pendukung mulai sedikit lebih lambat); langkah penjelasan 0,6-1,5 dtk, hasil tahan ≥0,8-1,2 dtk; masuk ease-out, perubahan struktur in-out, aliran linear/ease-out; antisipasi → aksi → tindak lanjut hanya pada gerak penting.
**Kamera dan informasi:** kamera dan informasi utama tidak bergerak bersamaan; kamera hanya bergerak ke tempat informasi akan terjadi atau saat tak ada informasi bergerak. 2D: "kamera" = geser/zoom lapisan.
**Hindari:** terlalu cepat/lambat; semua bergerak; gerak tanpa arah; transisi yang menutup informasi; gerak yang melanggar mekanisme nyata; animasi dekoratif; objek hanya berputar, zoom, melayang.
Penegasan: **tahu bagaimana objek terlihat DAN bagaimana ia dianimasikan** adalah syarat storyboard.

## 13. Penerapan per kategori
Contoh visual: `style-board/papan-kategori.png`. Setiap scene tetap dianalisis dari narasi; kategori hanya titik awal.
### 13.1 Breakdown / How it works
Tujuan: mekanisme dan urutan interaksi komponen jelas. Pendekatan: objek utuh dikenali → terurai (nama + fungsi) → hubungan antarbagian → proses berurutan → hasil → kembali ke objek utuh dengan pemahaman; pembesaran detail; aliran listrik/panas/tekanan/gerak; perbandingan komponen. Detail: level B/C untuk komponen yang dibahas; A untuk lainnya. Teknik: SVG/CSS 2D samping/isometrik dahulu; 3D terstilisasi bila hubungan ruang butuh. **Pisahkan komponen hanya bila hubungan diterangkan** (garis sambungan, urutan, sebab-akibat). Contoh LED: utuh → chip, driver, pendingin, ulir → listrik masuk ulir → driver mengubah AC ke arus searah → chip memancarkan cahaya → sebagian energi jadi panas dibuang lewat pendingin.
### 13.2 Mitos vs fakta
Tujuan: menguji anggapan dengan situasi dan bukti. Pendekatan: ilustrasi lingkungan utuh (jalan, rumah, kendaraan, persimpangan), situasi sehari-hari, POV/garis pandang, perbandingan, demonstrasi, simulasi bergaya, metafora; visual kondisi sebenarnya. **Tanpa membongkar objek** kecuali narasi memintanya. Contoh rumah hook: scene overhead persimpangan; kendaraan datang dengan arah lampu; garis pandang ke pintu (privasi); arah matahari dan bayangan; kondisi nyata vs anggapan (representasi visual kepercayaan). Teknik: overhead/elevasi 2D, animasi kendaraan, kerucut pandang SVG.
### 13.3 Fenomena / science explainer
Pendekatan: simulasi bergaya, diagram, ilustrasi, partikel hanya bila relevan, transformasi skala (zoom ke yang kecil), proses tak terlihat divisualkan dengan metafora yang akurat. Hati-hati simulasi: tandai bila ilustrasi; angka bersumber.
### 13.4 Perbandingan
Pendekatan: berdampingan/split screen, transformasi, before/after, kontras visual, sorot beda relevan saja; satu ukuran dibandingkan per momen; warna perbandingan konsisten sisi A/B sepanjang video.
### 13.5 Cerita / investigasi
Pendekatan: lingkungan, rekonstruksi adegan terstilisasi, linimasa, benda terkait, atmosfer sederhana (warna, bukan fog), pengungkapan bertahap; foto/arsip diolah sesuai konten.
### 13.6 Hybrid
Tentukan kategori dominan dan pendukung; boleh berganti pendekatan antar scene, gaya tetap.
### 13.7 Menyatukan teknik berbeda
Konsistensi dijaga oleh palet/peran warna, bentuk terstilisasi, tinta/outline, bayangan sederhana, tipografi, gerak menjelaskan; bukan oleh tata letak yang sama.

## 14. Hierarki teknik
SVG/CSS 2D → berlapis/2.5D → 3D terstilisasi (hanya bila perlu) → foto yang diolah (bila konten butuh) → simulasi bergaya; Canvas bila relevan. Pilih yang paling jelas dan paling sesuai gaya. Tanpa AI image/video/3D API.

## 15. Yang tetap dan yang berganti
**Tetap:** sistem peran warna; bentuk terstilisasi; tinta/outline tipis (default); bayangan sederhana; keluarga huruf; animasi menjelaskan; bukan-realistis; CTA "Follow buat fakta rumah berikutnya!". **Berganti:** preset/variasi palet, perspektif, teknik, tata letak, ritme, tingkat detail per objek, ada/tidaknya teks dan kartu, penggunaan foto.

## 16. Referensi
Spesifikasi tertulis ini = sumber utama. Gambar/video referensi dianalisis (`breakdown` Mode B): bentuk, perspektif, warna, shading, gerak, detail, teknik; pisahkan yang dipertahankan dari yang diperbaiki; tidak menyalin komposisi mentah; tidak otomatis untuk semua kategori. Keputusan art direction per video dicatat di `arah-visual.md`.

## 17. Daftar periksa kesesuaian gaya (untuk QA)
Objek dikenali? Warna punya peran dan tujuan? Hanya satu fokus? Detail sesuai kebutuhan (tidak ramai)? Tidak ada realistis/PBR/kabut/glow? Teks/grafis ada karena fungsi? Animasi menjelaskan urutan sebab-akibat dan terbaca? Perspektif konsisten dalam scene? Foto punya peran? Teknik dipilih karena paling jelas? Tidak ada pengulangan scene yang hanya beda angle?
