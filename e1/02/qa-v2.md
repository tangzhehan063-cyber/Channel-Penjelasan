# QA pilot v2 (Animation Director): `Pilot02B`, rekonstruksi 3D tanpa foto di layar
Bahan: `remotion/out/pilot02b.mp4` (10,6 dtk, 318 frame, render 3D dengan bayangan) ditinjau lewat strip 0,6 dtk (`e1/02/review2/`). Tidak diputar real-time. Gerbang: `cek_shots` lulus, `cek_kilau` lulus (maks 270 px, batas 300: mepet), `cek-mandiri` OK. Audio masih VO mentah (belum loudnorm, belum ada ambience/SFX).

## Yang berhasil
- Satu dunia kontinu, kamera di jalan, bidang potong menyapu dari depan ke tengah rumah (irisan maket), penampang tampak persis di bawah rumah (dasar tinggi, urugan, pondasi, lempung, pasir).
- Sebab-akibat fisik: lempung memampat, rumah dan tanah turun terhadap tiang acuan, bidang potong menutup, dan air (tinggi tetap) kini menggenangi jalan dan tangga (strip 9,6-10,2 dtk). Itu menjelaskan "air tetap masuk" lebih langsung daripada versi foto.

## Yang masih buruk (jujur)
1. **Eksterior terlihat seperti aset gim**: rumah datar, atap merah jenuh tanpa detail genteng, dinding bertekstur blotchy, jalan abu polos, tidak ada kehidupan kampung. Belum mendekati foto referensi.
2. **Komposisi pembuka lemah**: potret 9:16 memotong rumah lebar; kamera dekat sehingga hanya fasad datar terlihat; kedalaman latar minim.
3. **4,2-8,4 dtk masih diagram bergerak** (lapisan datar, titik biru, pipa abu); komposisi hampir tidak berubah.
4. **Efek menyapu bidang potong terlalu cepat** (kontras ke diagram mendadak pada 1,7-2,4 dtk).
5. Tanpa desain suara. Z-fighting mepet batas.

Kesimpulan: konsep koreografi sebab-akibat lebih baik, tetapi kualitas seni/material 3D belum layak. Perlu iterasi seni panjang pada rumah dan lingkungan (detail genteng, noda, tanaman, orang/motor, cuaca) atau memakai gaya diagram bersih secara sengaja daripada meniru realisme.
