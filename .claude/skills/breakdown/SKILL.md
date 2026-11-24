---
name: breakdown
description: Dua mode, dipakai kondisional. (A) Bongkar objek (potongan/penampang/exploded) HANYA bila narasi atau mekanisme menuntutnya; bukan default dan tidak untuk mitos/lingkungan. (B) Analisis referensi: membedah gambar/video referensi atau teknik visual menjadi keputusan komposisi, art direction, sinematografi, staging, animasi, dan implementasi yang bisa direkreasi dengan repo ini. Dipanggil oleh sutradara. Gaya mengikuti docs/visual-system/VISUAL_STYLE_SPEC.md; gaya isometrik lama ada di legacy/.
---
# /breakdown: dua mode

## Mode B: Analisis Referensi (24 Nov 2026)
Dipakai bila ada referensi (gambar, kolase, frame/klip video) atau sebuah teknik yang perlu direkreasi. Keluaran: satu berkas `docs/visual-system/referensi/NN-nama.md` dari `templat-analisis-referensi.md`; hasilnya menjadi masukan `sutradara` (keputusan) dan `remotion-fitur` (implementasi). Bukan deskripsi umum: setiap bagian harus berujung keputusan.
- **Bahan yang sudah ada:** `style/referensi-visual/` (01–07, termasuk `05-gerak-video/detik-*.jpg`), proses referensi di `arsip/style-lama/aset.md` ("Cara kerja dengan referensi", riwayat), `tools/ref-analyze.py` (OpenCV: ritme potongan, gerak, blur, kedalaman, grain, tekstur; butuh `tools/requirements-ref.txt`) dan `tools/cek-gerak.sh`, `tools/review_video.py` (strip frame dari MP4).
- **Menganalisis:** komposisi (framing, penempatan, ruang negatif, latar depan/tengah/belakang, kedalaman, garis pemandu, hierarki) · art direction (warna, material, tekstur, bahasa bentuk, lingkungan, tingkat realisme, identitas) · sinematografi (jenis shot, perspektif, perilaku fokus, gerak, fokus/DOF, motivasi kamera) · staging (penempatan, interaksi, blocking, ungkap, hubungan ruang) · animasi (apa bergerak, urutan, waktu, easing, antisipasi, tindak lanjut, gerak sekunder) · cahaya (sumber, arah, kontras, bayangan, atmosfer, lampu praktis) · editing (waktu, transisi, ritme, match cut, build-up, payoff).
- **Implementasi:** tuliskan cara mereproduksinya dengan kemampuan repo (Remotion, three.js, React, SVG, CSS, geometri prosedural, shader, compositing, topeng, animasi kamera) dan **tunjuk komponen/berkas nyata** atau tulis "belum ada". Cek status teknik di `remotion-fitur/kartu-teknik.md` (jangan merekomendasikan teknik berstatus gagal).
- **Tujuh pertanyaan wajib per teknik:** (1) apa yang membuatnya efektif secara visual; (2) tujuan bercerita; (3) metode teknis dasar; (4) bisa direkreasi dengan kemampuan repo ini; (5) implementasi tersederhana yang mempertahankan dampak; (6) bagaimana mengadaptasi, bukan menyalin; (7) bisa jadi komponen/preset ulang-pakai.
- **Aturan:** tidak menyalin merek/handle/tata letak persis; bila tak bisa direkreasi, katakan dan beri alternatif. Pisahkan karakteristik yang **dipertahankan** dari yang **diperbaiki**; referensi tidak otomatis berlaku untuk semua kategori. Referensi = sumber pemahaman gaya, bukan template.

## Kapan breakdown dipakai (berlaku untuk kedua mode)
- **Mode A (bongkar/potong/exploded/mekanisme):** dipakai hanya bila kategori **Breakdown / How it works**, atau bila narasi benar-benar menuntut penjelasan struktur/lapisan/mekanisme. **Bukan default untuk setiap video atau setiap objek.** Mitos dan lingkungan (mis. rumah hook) tidak perlu membongkar rumah: utamakan situasi, lingkungan, perspektif, demonstrasi.
- **Jangan hanya memisahkan komponen:** terangkan hubungannya: jalur sambungan, urutan interaksi, aliran (listrik, panas, tekanan, gerak, air), sebab-akibat, pembesaran detail, perbandingan komponen. Akurasi mekanisme dijaga (hubungan dan arah tidak boleh keliru; `[CEK]` bila belum pasti).
- **Gaya:** mengikuti `docs/visual-system/VISUAL_STYLE_SPEC.md` (stylized/flat; detail B/C untuk komponen yang dibahas, A untuk lainnya); SVG/CSS 2D (samping/isometrik) dulu, 3D terstilisasi bila hubungan ruang menuntut. Kamera isometrik dan gaya-gaya di bawah adalah **opsi**, bukan kewajiban. Animasi: `sutradara/referensi/animasi-mekanisme.md`.
- Keputusan apakah breakdown dipakai ada pada `sutradara`; skill ini mengeksekusi analisis/penjelasan strukturnya.


## Mode A: bongkar objek bila narasi memintanya
Dipakai bila penjelasan bergantung pada struktur/lapisan/mekanisme yang tak terlihat dari luar (how it works, penampang, exploded, aliran di dalam). **Tidak dipakai** untuk mitos/lingkungan yang cukup dijelaskan lewat situasi (lihat "Kapan breakdown dipakai"). Gaya mengikuti `docs/visual-system/VISUAL_STYLE_SPEC.md`: terstilisasi, tingkat detail B default, peran warna, teknik SVG/CSS 2D lebih dulu (penampang datar sering paling jelas), 2.5D/3D terstilisasi hanya bila perlu.

Prinsip (panduan berpikir, bukan checklist atau template):
- **Objek utuh dikenali dulu**, baru dibuka; selesai, kembali ke objek utuh dengan pemahaman baru.
- **Memisah komponen harus menerangkan hubungannya:** apa fungsi tiap bagian, apa yang bergerak/mengalir di antaranya, apa sebab-akibatnya. Memisah tanpa menerangkan hubungan = dekorasi.
- **Akurasi:** urutan lapisan, arah aliran, dan hubungan beban/tekanan/panas harus benar; sederhanakan bentuk, bukan fakta (`[CEK]` bila ragu).
- Satu fokus per frame: sorot satu bagian, redupkan sisanya; label nama singkat dengan garis penunjuk, tidak terpotong tepi layar.
- Sudut/kamera/zoom hanya bila membantu membaca struktur; tidak ada kewajiban isometrik, jumlah sudut, atau ukuran objek minimum.
- Animasi: urutan membuka mengikuti mekanisme (`sutradara/referensi/animasi-mekanisme.md`), bukan urutan menarik.
- Implementasi dan biaya teknik: tanya `remotion-fitur` (`kartu-teknik.md`). Hanya Remotion/React/SVG/CSS/three.js; tanpa API AI; HyperFrames dilarang di E1.

## Arsip
Isi Mode A lama (mesin isometrik `{t, az, el, zoom, look}`, 4 gaya sampel, tata letak label/kartu, gaya yang belum dibuat, cek lama) dipindahkan ke `legacy/mode-A-gaya-isometrik-lama.md`; **tidak aktif**. Kode sampel (`remotion/src/sampel/`, `kit/objek/Adegan*.tsx`) tetap ada sebagai referensi teknis.
