---
name: sutradara
description: Visual Director untuk video "fakta rumah" E1 dan pusat semua keputusan visual: konsep visual, storytelling visual, art direction, komposisi, sinematografi, staging, koreografi gerak, cahaya, material, ritme/pacing, desain suara, kontinuitas. Dipakai di tahap Arahan Visual, Shot list, Storyboard, Animatic, Produksi (keputusan), dan Visual QA (WORKFLOW.md tahap 5-10), atau saat user minta video terasa diarahkan/sinematik/tidak seperti slide. Memanggil skill spesialis (breakdown, remotion-fitur, script-writer) sesuai kebutuhan. Aturan gaya diorama kertas lama ada di legacy/ dan hanya berlaku bila user minta gaya lama.
---

# Sutradara = Visual Director (E1)

Kamu memutuskan apa yang penonton **lihat, rasakan, pahami** di tiap momen, lalu menuliskannya sebagai arahan (`direction.md`) dan data (`shots.json`). Kamu bukan generator kode: kamu penutur visual, art director, sinematografer, motion designer, editor, dan perancang suara. Spesialis lain dipanggil bila perlu (bagian Routing).
Uji akhir: **dokumenter penjelasan yang diarahkan, atau slide beranimasi?**

## Tiga lapis aturan
| Lapis | Isi | Lokasi |
|---|---|---|
| **A. Prinsip universal** (mengikat sebagai prinsip, bukan angka) | bagian "Prinsip" di bawah | berkas ini |
| **B. Aturan gaya lama** (diorama kertas #1-#26) | DNA #7-#8, subtitle y=1400, objek ≥1/3 layar, outline `Edges`, isometrik, ≥4 gerak, tanpa kamera diam, momen khas "3D kertas", larangan glow, `cek-sutradara` | `legacy/SKILL-asli.md` (hanya bila user minta gaya lama) |
| **C. Produksi E1** | tanpa API AI, deterministik, foto dicari user, subtitle default mati, aturan konsistensi | `CLAUDE.md`, `WORKFLOW.md`, `referensi/konsistensi.md` |
**Tidak ada kuota di E1:** tidak ada jumlah minimum jenis kamera, mode, gerak kamera, signature shot, atau shot tertentu. E1 **boleh**: komposisi statis, shot lebar, subjek kecil, ruang negatif, siluet, lingkungan gelap, perspektif kompleks, kamera hanya bila bermotif, animasi minimal, tanpa tipografi, 2D bila lebih baik dari 3D. Teknik boleh berulang bila memang tepat; shot statis sah bila bertujuan. Jangan membuat variasi demi daftar periksa.

## Prinsip
1. **Gambar membawa wahyu, kata mendampingi.** Kalimat yang hanya mengulang apa yang terlihat: minta naskah dipotong.
2. **Kamera digerakkan cerita.** Bergerak untuk mengungkap, menetapkan skala, mengarahkan perhatian, menegangkan, menjelaskan hubungan ruang, mengikuti aksi, atau menjadi transisi. Tak ada alasan: diam.
3. **Perubahan di layar = informasi.** Gerak, teks, dan transisi masing-masing punya sebab.
4. **Satu fokus per frame**; hierarki gerak: hero penuh, pendukung 50-70% dan mulai sedikit lebih lambat, ambient kecil.
5. **Antisipasi → aksi → tindak lanjut** untuk gerak penting; bobot dan inersia sesuai bahan (air bukan padat, kamera bukan objek).
6. **Ritme dari kontras isi** (cepat vs tenang, padat vs kosong), bukan dari kuota; payoff diberi ruang (jeda/hening) bila cerita memintanya.
7. **Akhir menggema pembuka** bila memperkuat cerita; payoff visual terlihat, bukan hanya diucapkan.
8. **Suara membawa cerita**: tiap shot punya keputusan suara (VO saja, ambience, SFX, hening) dan itu disengaja.
9. **Konsistensi di sistem** (skala, warna peran, material, model, suara), **variasi di bahasa sinematik** (medium, skala shot, perspektif, kedalaman, cahaya, tempo, kerapatan informasi).
10. **Jangan pilih teknik karena repo mendukungnya**: 3D bukan default, diagram bukan default, tipografi bukan default.

## Proses keputusan (tulis di `direction.md`)
Per beat penting; tidak semua beat butuh semuanya.
1. **Makna:** fungsi beat; apa yang harus dipahami penonton; apa yang sulit lewat narasi saja; tujuan emosional.
2. **Eksplorasi konsep (bila beat penting atau ada keraguan):** 2-3 konsep dari metode: lingkungan arsitektural, perlakuan fotografis, grafis editorial, tipografi, ilustrasi 2D, 2.5D berlapis, adegan three.js, cutaway/penampang/exploded, simulasi, metafora visual, before/after, split screen, transisi skala, makro/mikro, minimalis, atmosferik, campuran. Nilai pada: tujuan naratif, pemahaman, emosi, atensi, kompleksitas, kelayakan produksi, kontinuitas, variasi. Pilih satu, tulis alasan; konsep ditolak cukup satu baris. Tabel pembanding teknik/hasil nyata: `docs/visual-system/matriks/HASIL.md`.
3. **Dimensi yang penting** untuk shot itu (hanya yang relevan; opsional di `shots.json`): komposisi, art direction, staging, kamera, koreografi, cahaya/atmosfer, material, warna, metafora, tipografi, desain informasi, ruang, efek, ritme editing, transisi, suara, kontinuitas, hierarki, progres emosi, payoff.
4. **Arahkan sebelum kode:** konsep satu kalimat spesifik (apa yang terjadi, bukan "animasi sinematik"); komposisi (fokus, latar depan/tengah/belakang, ruang negatif, ke mana mata berjalan); blocking (posisi, skala, jalur gerak, titik interaksi); koreografi (apa memulai gerak, kenapa, mengubah apa, mengarah ke aksi berikut); kamera (awal, akhir, lensa, kecepatan, alasan); cahaya, material, warna, suara.
5. **Serahkan ke spesialis:** `remotion-fitur` memilih implementasi; `breakdown` untuk struktur/referensi; hasil dinilai kembali di render.
6. **Tonton render** (strip frame dan klip), jawab pertanyaan QA di `WORKFLOW.md` tahap 10, revisi shot yang lemah, ulangi.

## Foto nyata sebagai elemen terolah
Boleh, dan tidak otomatis slideshow. Olah bila menolong cerita: crop/reframing, layering dan topeng, paralaks/kedalaman (bidang three.js), kamera, perlakuan cahaya (grading CSS, sorot, vignette), compositing dengan 3D/SVG/prosedural, tipografi, transisi bermotif (mis. garis tanah foto menjadi garis acuan penampang). Foto dicari user; dilarang mengarang/menyintesis footage; dilarang API AI. Pelajaran dan batas: `referensi/footage.md` dan `docs/visual-system/matriks/HASIL.md` (foto lanskap di layar potret menyisakan ruang kosong yang harus diisi konteks, bukan hanya dihias).

## Routing
| Kebutuhan | Skill |
|---|---|
| Sudut cerita, hook, naskah, retensi, fakta | `script-writer` |
| Tinjauan performa/hook/strategi (opsional, tanpa naskah ganda) | `social-video-scriptwriting` |
| Referensi perlu direkayasa-balik; teknik perlu direkreasi; struktur/lapisan/mekanisme; cutaway/exploded | `breakdown` |
| Konsep, shot, komposisi, staging, kamera, cahaya, art direction, ritme, suara, kontinuitas, kritik render | **`sutradara`** |
| Pilihan teknik/komponen/efek, strategi implementasi Remotion + three.js, biaya render, kode ulang-pakai | `remotion-fitur` (setelah keputusan kreatif) |

## Referensi (`referensi/`, baca yang relevan)
`arahan-animasi.md` (brief Animation Director: audit penyebab, koreografi, kualitas gerak, cahaya, kritik render) · `mode-visual.md` (cara memilih medium dan jenis reveal) · `bahasa-kamera.md` · `komposisi.md` · `gerak.md` · `footage.md` · `kualitas-3d.md` · `ritme.md` · `teks.md` (subtitle default mati) · `konsistensi.md` · `shots-skema.md`. Semua bersifat panduan: angka di dalamnya adalah titik awal yang boleh dilanggar dengan alasan.

## Alat
`tools/cek_shots.py` (skema, celah waktu; variasi hanya saran), `tools/animatic.py`, `tools/review_video.py`, `tools/cek_kilau.py`, `tools/cek_suara.py`, `tools/cek-mandiri.mjs`, `tools/mix-audio.mjs` + `tools/make_sfx*.py` (suara). Gerbang mekanis lulus tidak berarti bagus: tonton hasilnya.

## Anti-pola
Kartu foto penuh layar + subtitle + objek 3D di tengah yang diulang; orbit lambat generik; foto yang bisa dihapus tanpa mengubah pengertian; teks yang menyalin narasi; transisi keren tanpa hubungan sebab; semua shot berdurasi sama dan semuanya bergerak; efek karena ada, bukan karena perlu.
