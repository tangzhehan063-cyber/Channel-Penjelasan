# Foto nyata dalam video dari kode (fleksibel)

Keputusan pemilik 24 Nov: foto boleh dipakai sebagai elemen visual yang diolah; **tidak wajib** diberi treatment khusus; dipilih karena kebutuhan konten, bukan sebagai latar. Foto dicari **user** (Claude memberi nama berkas + spesifikasi). Dilarang mengarang/menyintesis footage; dilarang AI image/video API. Berkas: `remotion/public/e1-NN/`.

## Boleh (pilih yang menolong)
Crop dan reframing · pan/zoom bertujuan · layering dan parallax bila sesuai · masking dan reveal · anotasi · compositing dengan ilustrasi/grafik · tipografi pendamping. Duotone/posterize/treatment grafis **boleh bila cocok dengan visual video**, tidak diwajibkan; jangan mengolah foto menjadi treatment tertentu hanya demi konsistensi.

## Memutuskan apakah foto perlu
Foto membuktikan/memberi konteks yang tak bisa digantikan ilustrasi? Ya → pakai dan beri peran jelas (bukti, konteks, titik masuk ke ilustrasi, perbandingan). Hanya dekorasi/latar → jangan. Bila foto bisa dihapus tanpa mengubah pengertian, itu dekorasi.

## Catatan praktis
- **Resolusi:** pan/zoom dibatasi sesuai ketajaman sumber (±1,8× untuk 1024 px lebar). Foto lanskap di layar potret menyisakan ruang kosong: komposisikan (crop, ilustrasi pendamping, teks bermakna) jangan membiarkannya.
- **Penyatuan dengan ilustrasi:** berbagi garis/objek yang sama (mis. garis tanah foto menjadi garis acuan penampang 2D), transisi bermotif (geser sepanjang garis, mask pada objek), anotasi dengan warna aksen. Tanpa bingkai/kartu putih bila tak perlu.
- **Teknik yang sudah diuji:** CSS filter dan gradien (grade, vignette), mask `clip-path`, parallax lapisan CSS (halus) atau bidang three.js bertopeng (kuat, perlu topeng bersih): `docs/visual-system/matriks/HASIL.md` §3. Efek `@remotion/effects` tidak berfungsi di container CPU ini.
- Foto orang yang dapat dikenali, logo, plat nomor: hindari atau samarkan. Foto asli ditandai foto; model/ilustrasi ditandai ilustrasi/simulasi bila relevan.
