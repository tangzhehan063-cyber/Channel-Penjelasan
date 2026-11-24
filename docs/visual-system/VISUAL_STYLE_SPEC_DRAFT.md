# VISUAL STYLE SPECIFICATION (DRAFT untuk review pemilik, 24 Nov 2026)

Papan gaya bergambar: `style-board/papan-gaya.png` (sumber `papan-gaya.html`). Spesifikasi ini mengumpulkan identitas yang sudah ada (#7/#8/#10: `style/style.md`, `style/identitas.md`, `style/palet.json`) dan deskripsi pemilik. **Belum berlaku** sampai disetujui. Identitas = **sistem**, bukan satu template.

## 1. Satu kalimat
Ilustrasi terstilisasi yang jelas: bentuk geometris sederhana yang tetap dikenali, warna solid terkontrol dengan peran, bayangan seperlunya, dan animasi yang menjelaskan sebab-akibat. **Bukan render, bukan arsitektural, bukan slide.**

## 2. Bentuk
- Geometris sederhana, proporsi masuk akal dan konsisten; objek boleh disederhanakan tapi **ciri pengenal wajib tetap** (bohlam: bola kaca + ulir; stop kontak: dua lubang + bidang; rumah: atap + badan + pintu).
- Detail hanya bila menolong pemahaman (mis. filamen pada penjelasan cahaya) atau kualitas.
- Sudut membulat disukai (radius ≥ sepersepuluh sisi pendek) tetapi bukan dogma; bentuk teknis (baja profil) boleh bersudut bila itu cirinya.
- Tidak abstrak tanpa tujuan.

## 3. Warna (sistem peran; preset boleh berganti)
- Basis: `style/palet.json` (krem baku, mint, terakota, batu, madu, langit, malam). Satu preset per video; ganti di tengah video hanya di titik pemutus.
- **Peran tetap:** aksen (koral/merah) = masalah, fokus, kata/bagian aktif · dingin (biru) = air, dingin, negatif · baik (hijau) = solusi, benar · tinta `#1c1c1e` = outline dan teks · kuning hanya untuk benda bercahaya.
- Batas: ≤ 5 keluarga warna per scene (latar, 1 warna objek dominan, aksen, tinta, 1 pendukung). Satu aksen per scene sebagai focal point.
- Hindari: glow, neon, gradien dekoratif, pelangi. Gradien latar sangat lembut (dua stop dekat) boleh sebagai pengganti latar polos.

## 4. Dimensi dan perspektif
Boleh volume dan kedalaman. Pilih perspektif menurut kebutuhan: **samping/elevasi** (potongan, struktur), **isometrik/3/4** (bentuk, posisi), **overhead** (lingkungan, jalan, arah matahari), **POV** (garis pandang, privasi). Satu scene = satu perspektif; berganti hanya bila penjelasan menuntutnya (mis. dari utuh ke penampang). Tidak ada satu angle wajib.

## 5. Shading dan material
Datar solid → atau 3 nada (terang/sedang/gelap) untuk volume; bayangan alas lembut sebagai penanda posisi/kontak. **Tanpa tekstur realistis**; material dibedakan oleh warna dan sedikit pola grafis (garis serat kayu, titik pasir, garis kerikil), bukan foto. Tidak ada pencahayaan CGI, tidak ada kaca/logam/beton/kayu realistis, tidak ada pantulan lingkungan.

## 6. Outline
Opsional per kelompok gaya, **konsisten dalam satu video**: tipis (±3 px pada 1080 lebar) tinta `#1c1c1e`. Tidak semua objek wajib; objek di latar dan bayangan tanpa outline. Hindari outline tebal (kesan clipart).

## 7. Komposisi
Focal point jelas; hierarki visual (hero, pendukung, latar); ruang negatif dipakai aktif; objek, diagram, teks punya hubungan komposisi; bukan semua di tengah. Lingkungan boleh diilustrasikan (jalan, rumah, matahari, kendaraan) bila topiknya situasi, tanpa membongkar objek.

## 8. Tipografi dan teks
Inter (judul/label), IBM Plex Mono (kicker/catatan), Playfair Display Italic (aksen editorial, samar). Teks adalah elemen desain, bukan transkripsi: subtitle penuh **default mati**; ada teks penekanan, label informasi, angka/anotasi. Kartu judul/kicker/TikTokBox menjadi **elemen opsional "tanda tangan channel"**, bukan keharusan di setiap video.

## 9. Gerak: menjelaskan, bukan menghias
Urutan penjelasan mekanisme (delapan langkah): 1 kondisi awal terlihat · 2 komponen relevan jadi fokus · 3 sambungan/jalur diperlihatkan · 4 proses dimulai · 5 aliran/gerak berurutan, bisa diikuti · 6 sebab-akibat terbaca · 7 hasil diperlihatkan · 8 jeda agar dipahami. Antisipasi → aksi → tindak lanjut hanya untuk gerak penting. Satu hal bergerak pada satu waktu; kamera dan informasi utama tidak bergerak bersamaan; transisi tidak menutupi informasi; kecepatan terbaca di HP. Easing: masuk ease-out, perubahan struktur in-out, aliran linear atau ease-out. Gerak sesuai mekanisme nyata.

## 10. Hierarki teknik (pilih yang paling jelas dan paling sesuai gaya)
1. **SVG/CSS 2D** (ilustrasi datar, diagram, motion graphics): default.
2. **Berlapis/2.5D** (parallax lapisan ilustrasi, kamera datar bergerak): bila kedalaman membantu.
3. **3D terstilisasi (three.js)**: hanya bila rotasi/volume/potongan 3D benar-benar menolong (exploded, penampang, benda yang harus dilihat dari banyak sisi); material datar/3 nada, bukan PBR.
4. **Foto nyata yang diolah**: bila konten butuh bukti (kasus nyata); dipadukan dengan grafis motion; bukan slideshow; perlakuan gaya (crop, topeng, duotone/posterize via CSS, anotasi) agar menyatu dengan ilustrasi.
5. Simulasi/prosedural bergaya: bila proses tak terlihat butuh divisualkan.
Tidak ada AI image/video/3D API.

## 11. Pendekatan per kategori video (arah awal; tiap scene tetap dianalisis)
| Kategori | Pendekatan | Tidak perlu |
|---|---|---|
| Breakdown / How it works | komponen terurai, penampang, mekanisme berurutan, aliran (listrik/panas/tekanan), pembesaran detail, perbandingan komponen, sebab-akibat | gerak dekoratif; memisah komponen tanpa menerangkan hubungan |
| Mitos vs fakta | ilustrasi lingkungan, situasi sehari-hari, POV, perbandingan, simulasi, metafora, kondisi sebenarnya | membongkar objek bila narasi hanya soal situasi (mis. rumah hook = jalan, kendaraan, persimpangan, matahari, privasi) |
| Fenomena / science | simulasi bergaya, diagram, partikel bila relevan, transformasi skala, visual proses tak terlihat | partikel/efek tanpa fungsi |
| Perbandingan | berdampingan, split screen, transformasi, before/after, sorotan beda relevan | beda yang tak relevan |
| Cerita / investigasi | lingkungan, rekonstruksi adegan terstilisasi, linimasa, benda terkait, atmosfer, pengungkapan bertahap | model realistis |
| Hybrid | tentukan kategori dominan dan pendukung | memaksakan satu kategori |

## 12. Yang tetap (identitas) dan yang berganti
**Tetap:** peran warna dan disiplin palet; bentuk geometris-terstilisasi; tinta dan outline tipis (bila dipakai); bayangan lembut sederhana; keluarga huruf; bahasa gerak menjelaskan; CTA penutup; bukan-realistis. **Berganti per video/scene:** preset palet, perspektif, teknik (SVG/2.5D/3D/foto olah), tata letak, ritme, ada/tidaknya kartu dan kicker.

## 13. Cara memakai referensi
Spesifikasi tertulis ini (dan papan gaya) = sumber utama. Referensi gambar/video dianalisis dengan `breakdown` Mode B (karakteristik dipertahankan vs diperbaiki, tanpa menyalin komposisi). Referensi tidak otomatis berlaku untuk semua kategori.

## 14. Pertanyaan untuk Anda (koreksi spesifikasi)
1. Apakah bagian 2–6 sudah menangkap "stylized illustration" yang Anda mau, terutama tingkat detail (A datar, B outline + bayangan, C volume 3 nada) di papan gaya? Mana yang jadi default?
2. Outline: default ada (tipis) atau default tidak ada?
3. Kartu judul/kicker/TikTokBox: opsional (usulan) atau tetap wajib?
4. Foto nyata diolah dengan perlakuan gaya (duotone/posterize CSS) atau cukup crop + anotasi?
5. Palet baku `krem` tetap sebagai default dan preset lain boleh dipilih per video?
