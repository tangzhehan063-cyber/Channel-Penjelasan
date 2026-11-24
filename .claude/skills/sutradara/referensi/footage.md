# Footage nyata dalam video 100% kode

> **Keputusan pemilik (24 Nov 2026):** foto nyata boleh menjadi elemen visual yang DIOLAH (crop/reframing, layering, paralaks, kedalaman, masking, kamera, perlakuan cahaya, compositing, tipografi, elemen prosedural, transisi bermotif), dikombinasikan dengan Remotion, three.js, SVG, CSS. Tidak otomatis slideshow; tetap tanpa AI image/video API. Foto juga dipakai sebagai referensi rekonstruksi bila konsep memilihnya. Hasil uji perlakuan foto: `docs/visual-system/matriks/HASIL.md` §3.

Foto dicari **user** (Claude hanya memberi nama berkas + spesifikasi). Dilarang menyintesis atau mengarang footage. Berkas ada di `remotion/public/e1-NN/`.

## Setiap foto wajib punya `footage{}` di shots.json
`sumber` (berkas, + kredit bila perlu), `alasan` (apa yang dibuktikan), `peran` (**bukti / konteks / jangkar-ke-3D / callback**), `bagian` (area yang penting, koordinat relatif 0–1), `crop`, `gerak`, `sorotan`, `transisi_masuk`, `transisi_keluar`, `relasi_narasi` (kalimat mana yang diperlihatkan foto ini dan apa yang TIDAK terlihat tanpanya). Foto yang bisa dihapus tanpa mengubah pengertian = dekorasi → buang.

## Peran dan perlakuan
| Peran | Perlakuan | Durasi |
|---|---|---|
| **Bukti** (ini nyata) | tahan cukup lama untuk dibaca; sorot bagian yang membuktikan (lingkaran/garis tipis, bukan kotak tebal) | 2–3,5 dtk |
| **Konteks** | wide, gerak pelan, jadi alas narasi | 2–4 dtk |
| **Jangkar ke 3D** | pilih garis/objek di foto yang akan menjadi bidang pemotongan 3D (garis tanah, dinding, tangga) | 1,5–3 dtk, berakhir pada jangkar |
| **Callback** | foto yang sama muncul lagi, kini dengan perubahan/bukti baru | 1,5–3 dtk |

## Resolusi rendah (umum: 1024×576)
- Foto lanskap di layar 1080 lebar: tampil ≥ skala 1,05×; **push-in maksimum ±1,8–2,0×** dari ukuran penuh. Lebih dari itu lembut/buram → pakai crop sempit hanya bila memang bagian itu tajam.
- Jangan memenuhi layar potret (butuh 3,3× → buram). Jadikan **pita** (band) di dunia 3D/2D: area atas = langit/gradien, bawah = lapisan tanah/ruang. Itu sekaligus komposisi.
- Kerjakan: grain halus seragam (menyatukan foto dan 3D), vignette ringan, grading hangat/dingin sama dengan 3D; jangan sharpen berlebihan.

## Gerak foto
- **Push ke detail** (≤2×) dengan easing in-out; berhenti pada bagian yang dibahas.
- **Pan/tilt** menyusuri (dari atap ke dasar) bila narasi bergerak ke bawah/atas.
- **Drift** ≤1,5% pada foto yang ditahan (hidup tanpa distraksi).
- Hindari perspektif palsu (foto diputar >15°): foto datar tidak berbohong soal kedalaman.

## Transisi footage ↔ 3D: resep (pilih satu, tulis alasannya)
Prinsip: transisi **mengikat objek nyata dengan mekanisme**. Hiasan (wipe, glitch) dilarang.

1. **Potong di garis tanah (ground-slice):** foto berdiri di dunia 3D dengan garis tanah di y=0. Strip bawah foto (jalan) digeser jatuh; di bawah garis muncul penampang tanah 3D yang menempel tepat pada garis itu. Kamera turun; foto (menempel di permukaan) naik keluar. *Pesan:* "yang kamu lihat berdiri di atas ini." Dipakai di pilot #02.
2. **Push-through objek:** dorong ke lubang/celah/retak di foto; bagian dalamnya = 3D. *Pesan:* "dari celah ini kita lihat dalamnya." Butuh lubang nyata pada foto.
3. **Aperture di objek:** lingkaran/rect membesar dari satu titik foto, isinya 3D potongan objek itu (mask). *Pesan:* "isi dari benda ini". Cocok objek kecil (pipa, sambungan).
4. **Match garis/bentuk:** garis horizontal di foto (garis air, lantai) menjadi garis acuan di 3D. *Pesan:* "ukuran yang sama." Cocok perbandingan tinggi.
5. **Depth reveal:** foto ditarik ke belakang (skala turun + kabut) membuka ruang 3D. Dipakai hemat.
Saat kembali ke foto (callback), buat **perubahan terlihat**: foto bergeser terhadap garis acuan, atau penanda baru muncul.

## Integrasi visual (agar tak tampak tempelan)
- Bidang foto dan 3D bertemu pada garis yang sama; beri bayangan kontak tipis di sambungan.
- Cahaya 3D mengikuti foto: foto mendung → 3D cahaya difus, bayangan lembut, warna kurang jenuh.
- Satu lapisan grain + vignette di atas keduanya.
- Foto tidak diberi bingkai/kartu putih/bayangan kartu (itu yang membuat tampak slide).

## Etika dan kejujuran
Foto asli ditandai sebagai foto; model 3D ditandai ilustrasi/simulasi di naskah dan caption bila relevan. Foto orang yang bisa dikenali, logo, plat nomor: hindari atau blur.
