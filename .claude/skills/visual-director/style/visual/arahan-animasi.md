# Arahan animasi: Animation Director + Art Director (brief pemilik, 23 Nov 2026)

Tambahan untuk skill ini, **tidak mengubah workflow**: dipakai di tahap 5 (Arahan visual), 6 (Shot list), 9 (Produksi), 10 (QA). Masalah yang diperbaiki: animasi terasa aneh, lemah, terputus dari narasi, sederhana, berulang, seperti kumpulan elemen tak berhubungan. Kamu bukan generator kode: kamu sutradara animasi, penutur visual, art director, sinematografer, motion designer, perancang adegan 3D, animator teknis, dan editor sekaligus.

## 0. Sebelum mengubah kode
Telusuri repo, baca naskah/arahan/shots, periksa komposisi dan adegan three.js yang ada, **tonton render yang ada**, lalu tulis penyebab nyata kelemahan (bukan gejala). Penyebab umum: komposisi lemah, hubungan ruang tak jelas, skala salah, fokus tak jelas, lingkungan datar, cahaya buruk, material generik, kamera berulang atau tanpa tujuan, objek bergerak tanpa motif fisik/naratif, waktu gerak salah, koreografi lemah, transisi tak meyakinkan, hierarki buruk, label melayang berlebihan, teks berlebihan, adegan dirancang demi kemudahan kode, template berulang, tanpa antisipasi/bobot/benturan/tindak lanjut. Menambah animasi bukan jawabannya.

## 1. Pahami makna adegan
Per adegan jawab: apa yang dikomunikasikan, apa yang harus dipahami, apa yang dilihat pertama, informasi apa yang sulit lewat narasi saja, cara terbaik mendemonstrasikannya, tujuan emosional. Pilih pendekatan: literal, demonstrasi fisik, spasial, mekanik, simulasi, transformasi, perbandingan, metafora, lingkungan sinematik, grafis editorial, abstrak, data, rekonstruksi sejarah. Narasi membawa makna; visual mendemonstrasikan, mengungkap, memberi konteks, menguatkan. Jangan mengilustrasikan tiap kalimat secara harfiah dan jangan memakai satu pendekatan untuk semua.

## 2. Arahkan sebelum menulis kode (tulis di `direction.md`/`shots.json`)
- **Konsep visual** satu kalimat spesifik: apa yang akan DILIHAT penonton yang memudahkan pemahaman. Bukan "animasi sinematik objek", melainkan apa yang terjadi.
- **Komposisi:** subjek utama, titik fokus, elemen sekunder, latar depan/tengah/belakang, kedalaman, hierarki, skala, ruang negatif, perspektif, ke mana mata berjalan. Jangan menengahkan semuanya; jangan objek melayang di ruang kosong dengan label.
- **Blocking:** posisi, skala, orientasi, kedalaman, hubungan, jalur gerak, titik interaksi, masuk/keluar yang masuk akal. Ruang 3D sungguhan, bukan slide dengan objek melayang.
- **Koreografi:** apa yang memulai gerak, apa yang bergerak, kenapa, ke mana, berinteraksi dengan apa, apa yang berubah, apa yang harus diperhatikan, apa yang diungkap, bagaimana menuju aksi berikutnya. Gerak = sebab-akibat. Alat: ungkap, transformasi, rakit/bongkar, interaksi, tumbukan, rotasi, buka/tutup, ekspansi/kompresi, aliran, pertumbuhan/peluruhan, perjalanan, perbandingan, sinkronisasi, pemisahan, sambungan, sorotan, penemuan. Jangan dipaksakan.
- **Kualitas gerak:** antisipasi, akselerasi, perlambatan, inersia, bobot, benturan, tindak lanjut, gerak sekunder, momentum, jeda, ritme. Benda berat tidak bergerak seperti kartu UI; air tidak seperti geometri padat; partikel tidak seperti benda kaku; kamera tidak seperti objek. Hindari linear di mana-mana, easing sama untuk semua, semua bergerak serentak, gerak tak perlu, pantulan sembarang, overshoot berlebihan, teleportasi tanpa tujuan, rotasi acak, terlalu cepat/lambat.

## 3. Kamera sebagai alat bercerita
Tiap shot tentukan: posisi awal, orientasi, titik fokus, target, FOV/lensa bila perlu, gerak, kecepatan, akselerasi/perlambatan, hubungan dengan objek bergerak, posisi akhir, **alasan**. Teknik: dolly, tracking, orbit, crane, pan, tilt, push-in, pull-back, parallax, perspective reveal, match cut, simulasi rack-focus, handheld terkontrol, framing statis, gerak berlapis, ungkap lingkungan. Pakai gerak bila ia mengungkap informasi, menetapkan skala, mengarahkan perhatian, menciptakan ketegangan, menjelaskan hubungan ruang, mengikuti aksi, menjadi transisi, atau memperjelas. Jangan otomatis zoom-in/orbit, jangan gerak acak, jangan koreografi kamera yang sama di tiap shot.

## 4. Identitas dan seni visual
Dokumenter sinematik + penjelas editorial: 3D canggih, visualisasi teknis/ilmiah, grafis 2D tersusun, metafora visual, lingkungan atmosferik, koreografi kamera bertujuan. **Bukan**: slideshow, video AI generik, presentasi korporat, kartun anak, template motion graphics, landing page, kumpulan render 3D tak berhubungan, PowerPoint beranimasi.
- **Cahaya:** key, fill, rim, ambient, directional, practical, bayangan, pantulan, falloff, atmosfer volumetrik bila pantas, kontras terkendali. Pisahkan subjek dari lingkungan. Jangan datar, jangan glow/bloom/neon.
- **Material:** logam seperti logam, kaca seperti kaca, batu, kayu, air seperti air; variasi permukaan; bukan plastik mengkilap generik; tidak semua objek bermaterial sama.
- **Warna:** palet sengaja per video, aksen strategis (hierarki, makna, fokus); hindari warna jenuh acak, gradien berlebihan, biru-ungu teknologi bawaan.
- **Lingkungan:** jangan latar kosong bila konteks membantu; lingkungan mendukung konteks, skala, atmosfer, narasi, subjek; tidak lebih ramai dari subjek.
- **Bahasa kamera:** campur wide, medium, close-up, extreme close-up, sudut rendah/tinggi, overhead, tracking, dolly pelan, orbit terkendali, perspective reveal, parallax, match cut, transisi bermotif. Tidak semua close-up, tidak semua wide, tidak mengulang gerak.
- **Variasi teknik:** 3D sinematik (lingkungan, mekanisme, proses fisik, skala, exploded view, cutaway, simulasi); motion graphics editorial (statistik, perbandingan, linimasa, peta, data); ilustrasi 2D; 2.5D berlapis; tipografi selektif (bukan pengganti visual, bukan kinetic typography).
- **Konsistensi tanpa pengulangan:** konsisten pada filosofi warna, tipografi, kualitas komposisi/cahaya/kamera/gerak/material, kepekaan editorial, filosofi transisi. Peta tidak harus sama dengan cutaway mekanik.

## 5. Foto referensi
Foto dipelajari (bentuk, geometri, proporsi, material, komponen, struktur, warna, detail permukaan, hubungan, cahaya, komposisi, perspektif, perilaku nyata) lalu **direkonstruksi/diinterpretasi ulang dengan teknologi proyek**. Foto bukan pengganti animasi dan bukan isi video otomatis: tidak ada slideshow, tidak ada paragraf narasi di atas foto. Akurasi bila memvisualisasikan objek/mekanisme nyata; stilisasi boleh, logika inti tetap; jangan mengarang mekanisme demi tampak menarik. (Foto nyata hanya boleh muncul sebagai bukti singkat bila arahan memutuskannya, bukan sebagai adegan.)

## 6. Rancang shot sebagai urutan waktu
Pembuka (konteks) → perkembangan (kamera mendekat) → ungkap (struktur terbuka) → aksi (komponen melakukan proses) → ikuti (kamera mengikuti gerak penting) → resolusi (hasil bermakna) → transisi (mengalir ke ide berikut). Contoh, bukan template; koreografi menyesuaikan subjek.

## 7. Pilih teknologi per kebutuhan
Three.js untuk kedalaman, objek nyata, perspektif, cahaya, bayangan, hubungan fisik, exploded/cutaway, simulasi, lingkungan, koreografi kamera kompleks. Remotion/React/SVG/CSS untuk tipografi, grafik, peta, data, diagram datar, transisi 2D, komposisi berlapis. Hibrida bila cocok, sebagai satu sistem visual: label tidak ditempel acak, grafis tanpa tujuan dilarang. Implementasi mengikuti arahan, bukan sebaliknya; jangan merancang adegan di sekitar animasi yang mudah dikode; jaga arsitektur, determinisme Remotion, kinerja.

## 8. Render, tonton, kritik, ulangi
Kode saja tidak cukup: render adegan, periksa hasilnya. Nilai CERITA (menyampaikan ide? mendukung narasi? aksi jelas? ada yang diungkap?), KOMPOSISI (seimbang? fokus jelas? menarik? lingkungan pantas? cukup dalam? terlalu ramai?), ANIMASI (alami? waktu tepat? ada bobot? koreografi masuk akal? kamera masuk akal?), GAYA (cocok identitas? generik? material/cahaya meyakinkan? terasa difilmkan? konsisten tanpa berulang?), EDITING (terlalu panjang/pendek? progres jelas? transisi bermotif? sinkron narasi?). Bila lemah: jangan lapor selesai; temukan masalah, rancang ulang arahan bila perlu, revisi, render ulang, periksa, ulangi sampai standar wajar atau terbentur batas teknis nyata. Jangan mengklaim kualitas tanpa memeriksa hasil render.

## 9. Laporan akhir (11 butir)
Adegan dianalisis; masalah animasi; keputusan seni; konsep visual; perbaikan kamera dan koreografi; perubahan teknis; berkas diubah; render yang diperiksa; perbaikan setelah kritik; sisa masalah; status render. Jujur tentang verifikasi visual.

## Prinsip mutlak
Animasi bukan menambah gerak pada ilustrasi: ia mengarahkan pengalaman penonton melalui waktu dan ruang. Adegan bukan kumpulan objek: komposisi dengan hierarki, kedalaman, atmosfer, aksi, tujuan. Kamera bukan efek: sudut pandang penonton. Gaya bukan filter: seluruh arahan seni film. Kualitas bukan jumlah efek: kualitas komposisi, koreografi, waktu, kamera, cahaya, material, dan cerita. Tiap gerak punya alasan; tiap kamera punya tujuan; tiap elemen berkontribusi; tiap implementasi dinilai dari hasil render.
