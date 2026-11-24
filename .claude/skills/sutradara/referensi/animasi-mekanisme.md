# Animasi yang menjelaskan (panduan berpikir, bukan checklist)

Sumber: `docs/visual-system/VISUAL_STYLE_SPEC.md` §12. **Kualitas animasi prioritas besar.** Jangan hanya membuat objek muncul, berpindah, atau zoom.

## Pertanyaan yang dijawab animasi
Apa yang terjadi? Bagian mana berinteraksi? Apa penyebabnya? Apa akibatnya? Urutannya? Mengapa terjadi? Tak satu pun terjawab → gerak itu dekoratif: buang atau diamkan.

## Rancang ini per mekanisme (bukan semuanya wajib)
- **Staging:** di mana subjek berdiri, apa yang masuk lebih dulu, apa yang redup (bukan hilang) agar konteks tetap ada.
- **Timing:** berapa lama tiap hal perlu terbaca (langkah penjelasan ±0,6–1,5 dtk; hasil ditahan ≥0,8–1,2 dtk; satu hal baru bergerak pada satu waktu).
- **Anticipation:** isyarat kecil sebelum aksi (menahan, menarik balik, getar) hanya untuk gerak penting.
- **Urutan gerak:** menurut mekanisme nyata (pemicu → perantara → hasil); bagian yang menyebabkan bergerak lebih dulu.
- **Interaksi:** benda mana menyentuh/mendorong/mengubah benda mana; tunjukkan titik kontaknya.
- **Sebab-akibat:** A menyebabkan B terbaca dari urutan dan arah, bukan hanya teks.
- **Kejelasan:** satu fokus; kamera dan informasi utama tidak bergerak bersamaan; transisi tidak menutup informasi.
## Titik awal pemikiran (delapan langkah, pilih/gabung/lewati)
1 kondisi awal · 2 komponen relevan jadi fokus · 3 sambungan/jalur terlihat · 4 proses dimulai (pemicu jelas) · 5 aliran/gerak berurutan sesuai mekanisme · 6 sebab-akibat terbaca · 7 hasil terlihat · 8 jeda untuk dipahami. Mekanisme sederhana mungkin hanya butuh dua langkah; mekanisme rumit butuh pembagian.
## Kosakata gerak informatif
Aliran sepanjang jalur dengan satu warna aksen; denyut di titik interaksi; terurai/menyatu dengan gap seragam; sorot (lainnya meredup); pembesaran detail (lingkaran/inset); perubahan ukuran/jumlah (bar, penghitung); transformasi; before/after (slider/split); penanda ukur tetap sebagai acuan; garis tergambar sepanjang hubungan.
## Easing
Masuk ease-out; perubahan struktur in-out; aliran linear atau ease-out; overshoot kecil hanya untuk pop; air tidak seperti padat; benda berat bergerak pelan dan berhenti jelas.
## Akurasi (wajib)
Tulis hubungan sebenarnya (apa menggerakkan apa, arah aliran, urutan) sebelum menganimasikan; periksa sumber; `[CEK]` bila belum pasti. Sederhanakan bentuk, bukan fakta. Tanda "ilustrasi/simulasi" bila angka bukan hasil ukur.
## Kegagalan umum
Terlalu cepat/lambat; semua bergerak bersamaan; gerak tanpa arah; kamera bergerak sementara informasi juga bergerak; transisi menutup informasi; gerak melanggar mekanisme; animasi dekoratif; objek hanya berputar/zoom/melayang; komponen dipisah tanpa menerangkan hubungannya.
