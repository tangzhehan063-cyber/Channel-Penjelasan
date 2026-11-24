# Arah visual #02 (menunggu ACC): tiga alternatif untuk segmen 20,4–31,0 dtk

Identitas tetap (VISUAL_STYLE_SPEC): stylized/flat + dimensi sederhana, detail B default, peran warna, tanpa semi-realistis/PBR/kabut/glow. Narasi segmen: "Di bawah rumah ada lempung lunak yang penuh air (21,0–23,6). Air tanah disedot (24,1–25,2), lempungnya memampat (25,3–26,5), kayak spons diperas (26,7–28,2). Beban bangunan ikut menekannya (28,7–30,7)."
Inti yang harus terlihat: **sedot air → lempung menipis → rumah turun terhadap garis acuan yang diam.** Yang sering terlewat: cerita ini tentang *posisi relatif*, jadi garis acuan (mis. garis air rob) yang tidak bergerak adalah tokoh kedua; penonton harus melihat rumah melewatinya tanpa dibaca dari teks.

## A. Penampang samping datar (2D SVG), kamera "menyelam"
- **Art direction:** potongan tanah seperti diagram teknik yang hangat: lapisan datar berwarna (preset `terakota`: tanah hangat; `cool` biru untuk air), rumah siluet sederhana di atas, garis acuan putus-putus. Detail A untuk lapisan, B untuk rumah dan sumur.
- **Animasi:** kamera mulai dari rumah (dari foto, bila dipakai, lewat irisan garis horizontal yang membuka penampang), turun ke lapisan. Titik air (lingkaran biru) memenuhi pori-pori lempung; sumur menyedot: titik bergerak keluar lewat lapisan pasir menuju pipa; lapisan lempung menipis perlahan (tinggi rect berkurang, pori mengecil), rumah turun searah, melewati garis acuan; denyut kecil saat "beban" ditandai panah tekan di atap.
- **Kelebihan:** paling jelas dan murah dirender (cepat diiterasi, mudah diperiksa akurasinya); sebab-akibat satu garis lurus. **Kekurangan:** risiko terlihat "diagram buku teks" bila animasinya tidak diarahkan; skala butir tidak terlihat.
- **Teknik:** SVG/CSS 2D murni.

## B. Maket potongan 2.5D (blok tanah bervolume 3 nada)
- **Art direction:** blok tanah terpotong seperti kue lapis dengan sisi potong menghadap kamera, kedalaman sederhana (detail C), rumah kecil di atasnya, sedikit parallax.
- **Animasi:** kamera sedikit miring (mis. ±20°) bergeser pelan, lapisan menipis dengan sisi tebal terlihat; rumah turun masuk ke blok.
- **Kelebihan:** terasa dimensional, dekat dengan memori diorama channel. **Kekurangan:** paling dekat ke arah lama yang ditolak, biaya render dan risiko artefak tinggi, tidak menambah kejelasan mekanisme dibanding A.
- **Teknik:** 2.5D SVG/CSS 3D transform, atau three.js terstilisasi.

## C. Skala berganti: penampang ↔ butir tanah (zoom metafora)
- **Art direction:** dua skala dalam satu bahasa grafis. Skala besar = penampang A. Skala kecil = ilustrasi butir (lingkaran abu/coklat) dengan ruang pori biru; sorot satu kotak kecil lempung diperbesar.
- **Animasi:** sedot air → kamera masuk ke kotak lempung: air keluar dari pori, butir merapat (spons diperas dibuat literal sebagai perbandingan berdampingan: spons penuh air vs diperas), lalu zoom keluar: seluruh lapisan menipis, rumah turun melewati garis acuan, beban menekan.
- **Kelebihan:** satu-satunya yang memperlihatkan *mengapa* memampat; metafora spons dibuktikan, bukan hanya diucapkan. **Kekurangan:** lebih banyak elemen; risiko terlalu ramai di 10 detik; perlu timing ketat.
- **Teknik:** SVG/CSS 2D (butir deterministik ber-seed); canvas hanya bila butir terlalu banyak.

## Rekomendasi (tidak mengikat)
**A sebagai dasar + satu sisipan C** (zoom ke butir hanya pada "memampat … spons diperas", ±3 dtk), kembali ke A untuk "rumah turun" dan "beban". B tidak saya rekomendasikan: tampilannya paling mirip arah lama dan tak menambah kejelasan. Garis acuan tetap di semua alternatif.

## Keputusan yang dibutuhkan
1. Kategori (Fenomena/Science + Mitos + Perbandingan pendukung) dan lingkup pilot (segmen 20,4–31,0 dtk): setuju?
2. Arah: A, A+C (rekomendasi), B, C, atau campuran lain?
3. Foto rumah (`rumah-ditinggikan.jpg`) di awal segmen sebagai penghubung ke penampang: pakai atau tidak? (Opsional; default saya: pakai satu foto dan potong dengan irisan menuju penampang.)
Setelah ACC: naskah sudah ada (tidak diubah) → saya tulis `storyboard.md` (urutan animasi + akurasi) → review → baru kode.
