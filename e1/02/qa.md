# Visual QA pilot #02, sequence "Di bawah rumah" (20,4–31,0 dtk)

**Dasar penilaian (jujur):** MP4 sungguhan `remotion/out/pilot02.mp4` (1080×1920, 30 fps, 10,6 dtk, 318 frame, loudnorm −14,1 LUFS, puncak −1,3 dBTP) ditinjau lewat strip frame tiap 0,6 dtk, beberapa frame resolusi penuh, tiga frame per shot, dan metrik gerak (`tools/review_video.py`). Saya **tidak memutar video secara real-time**; kehalusan gerak hanya dinilai dari metrik dan selisih antar-frame. Perbandingan dengan versi lama memakai still Tanah02 pada detik yang sama (video lama tidak ada di repo).

## Gerbang mekanis
| Cek | Hasil |
|---|---|
| `cek_shots.py` | lulus (5 shot, 5 jenis kamera, 2 mode; skala pilot) |
| `cek-mandiri.mjs` | OK, tanpa API AI |
| `cek_kilau.py` (11 frame) | OK, maksimum 17 piksel berkedip (batas 300) |
| `tsc` | bersih |
| Loudness | −14,1 LUFS (hanya VO; belum ada ambience/SFX) |
| Waktu render | 4 mnt 4 dtk untuk 10,6 dtk (lebih cepat dari video penuh: adegan sederhana) |

## Penilaian kreatif (pertanyaan Stage 6)
1. **Framing menarik?** Sebagian. P2 (garis merah memisah foto dan tanah), P4 (lapisan dekat, garis acuan di atas) dan P5 (kembali ke foto, rumah di bawah garis) kuat. P1 terlalu singkat (1,2 dtk) dan 40% layar bawah gelap kosong; sebagai pembuka mandiri terasa menggantung (dalam video penuh ia mengikuti shot lain).
2. **Gerak kamera punya alasan?** Ya untuk crane turun (P2), dolly masuk (P3), crane naik (P5). Push di P1 nyaris tak terbaca karena hanya 1,2 dtk.
3. **Terasa hidup, atau presentasi?** Jauh lebih tidak seperti slide dibanding versi lama, tapi **P3–P4 (±3,6 dtk, 4,2–7,8 dtk di MP4) berkomposisi hampir sama**; hanya titik air dan lempung yang berubah, sehingga bagian tengah terasa seperti diagram bergerak. Ini kelemahan utama yang belum diperbaiki.
4. **Transisi punya hubungan dengan cerita?** Ya. Garis tanah pada foto = permukaan penampang = garis acuan "Posisi awal"; foto yang sama kembali di akhir dan terlihat lebih rendah dari garis itu. Itu menjelaskan hubungan rumah nyata dengan pemampatan, bukan hanya tampak keren.
5. **Shot terlalu lama/cepat?** P1 terlalu cepat sebagai bukti; P3 sedikit terlalu panjang untuk apa yang berubah di dalamnya; P2 dan P5 pas (gerak besar, sekitar 1,7 dan 2,5 dtk).
6. **Ada yang seharusnya diam?** P4 memang dibuat terkunci dan itu benar. Tetapi kontras antara P3 dan P4 tidak cukup tegas (P3 sudah hampir diam).
7. **Terlalu ramai?** Tidak. Teks hanya 5 label pendek, tanpa subtitle.
8. **Informasi dapat dipahami tanpa subtitle?** Sebagian: lapisan, pondasi, sumur, dan "Posisi awal" terbaca dari label dan gambar. Yang **tidak** tersampaikan tanpa suara: makna "spons diperas" dan skala (berapa cm/tahun). Itu butuh VO atau teks penekanan yang belum ada.
9. **Visual generik?** Penampang 3D masih berbahasa diagram teknik (pita-pita lapisan, pipa L hitam, titik biru). Layak sebagai ilustrasi, tetapi bukan sinematik. Pipa hitam berbentuk L tampak kaku.
10. **Footage berperan?** Ya (bukti, jangkar ke 3D, callback). Resolusi sumber 1024×576 dengan push ±1,8× tampak lembut di layar penuh; foto beresolusi lebih tinggi akan membantu.
11. **Suara:** hanya VO. Belum ada lapis suara selain VO (ambience tanah/air, tekanan saat memampat, hening sebelum wahyu). Ini belum dikerjakan.

## Yang diperbaiki selama pilot (bukti proses)
Putaran storyboard: penampang tampak seperti kertas krem dan pondasi putih melayang → tekstur lempung gelap-basah, pasir hangat, urugan berkerikil, pondasi batu; pipa menembus tirai → strip/tirai dipindah ke depan isi penampang; titik air membesar → diperkecil; label tipis → pil gelap; kamera P3/P4 dibawa lebih dekat agar tak ada sepertiga layar kosong; tirai gelap awal dinaikkan agar pipa tak tampak seperti artefak.

## Keputusan
Pilot **membuktikan sebagian** hipotesis: urutan footage→3D→footage yang menjelaskan sebab-akibat dan kamera berdata bisa dibuat dengan pipeline ini, dan hasilnya lebih baik dari versi lama pada transisi, hierarki, dan hubungan objek nyata-mekanisme. Pilot **belum membuktikan** pacing yang menarik di bagian mekanisme (P3–P4) maupun desain suara. Jangan memperluas ke seluruh video sebelum P3–P4 diperbaiki dan pemilik menilai hasilnya.
