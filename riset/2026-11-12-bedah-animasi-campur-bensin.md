# Bedah animasi: "Campur bensin, mesin rusak?" (12 Nov 2026)

Lanjutan `riset/2026-11-12-bedah-campur-pertalite-pertamax.md` (naskah & struktur). Di sini hanya gerak: potongan, transisi, ritme, sinkron suara.
Cara baca: energi gerak per detik (selisih antar-frame, 15 fps) + 64 frame kunci di `style/referensi-visual/08-campur-bensin-penampang/` (`kunci-transisi.jpg`, `kunci-adegan.jpg`, `lembar-kontak.jpg`). Waktu akurat ±0,2 dtk. Kurva easing tidak bisa dipastikan dari frame diskret; yang tertulis "kemungkinan" adalah dugaan.

## Ringkasan gaya gerak
- **Tanpa kamera 3D.** Semua 2D datar. Tidak ada zoom/dolly; yang bergerak hanya objek, label, dan judul.
- **11 adegan dalam 43 dtk** (rata-rata 3,9 dtk). Tiap adegan satu objek dan satu ide.
- **Satu peristiwa baru tiap ±1–1,5 dtk** (label muncul, angka naik, kartu masuk). Di sela itu gambar hampir diam (energi gerak median 0,46; puncaknya 2–5,7 saat objek masuk). Kesan cepat datang dari subtitle dan judul yang berganti, bukan dari objek yang terus bergerak.
- **Subtitle jadi "detak jantung":** potongan 2–3 kata, ganti tiap ±0,5 dtk, kata yang diucapkan dilatari kuning. Energi gerak area subtitle stabil 0,4–0,7 sepanjang video.
- **Gerak kecil menjaga adegan diam tetap hidup:** garis gelombang cairan di tangki, piston naik-turun, gelembung aditif melayang.

## Adegan, gerak, dan sinkron suara
| # | Detik | Gerak utama | Sinkron VO |
|---|---|---|---|
| 1 | 0–3,5 | Nozel hijau lalu biru menuang; permukaan cairan naik dan bergelombang; label pil kuning muncul saat tiap cairan tiba. 2,8–3,2: tangki miring sedikit, lalu lencana "?" merah muncul (pop) | "?" muncul tepat setelah "aman" |
| 2 | 3,6–4,5 | **Bumper kata "Penjelasannya"** (nama channel) besar: fade+geser masuk, tahan ±0,5 dtk, keluar ke kiri. Potongan keras | Menutupi "Ini penjelasannya" |
| 3 | 4,5–7,9 | Gelas hijau terisi (±1 dtk), angka RON 90 menghitung naik; gelas biru terisi, lencana VS pop, angka 92 naik. Judul bertambah per kata | Angka tiba saat "90" / "92" diucapkan |
| 4 | 8,0–11,6 | Piston naik-turun, titik bensin di ruang bakar; panah tekanan muncul ±9,6–10,1; label "LEDAKAN DINI" + coretan merah ±10,5–11 | Label tiba bersama "tekanan mesin" / "ngelitik" |
| 5 | 11,6–16,8 | Tangki campur; label 50% masuk dari tepi kiri (±12,5); garis skala RON 90–91–92 tergambar (12–13), titik hijau/biru; kartu "RON ±91" di kiri atas; warna cairan berpadu jadi teal (±15,5–16) | Warna jadi teal saat "jadinya sekitar RON 91" |
| 6 | 16,8–19,7 | Kartu kutipan masuk dari atas; sorot kuning pindah per kata ("Pada dasarnya aman."); chip "✓ AMAN" pop di tangki (±19,0–19,6) | Chip tiba pas "aman" |
| 7 | 19,7–25,1 | Silinder; termometer oktan tergambar di kanan (±21), isi naik ke 91, pita merah bergaris (selisih ke 92) + pil "DI BAWAH STANDAR"; ±25: label "NGELITIK RINGAN", ikon percikan, garis getar kiri-kanan | Percikan & getar pas "ngelitik ringan" |
| 8 | 25,1–28,3 | Tangki diperbesar (crop, sebagian keluar layar), gelembung aditif melayang; bar "KADAR ADITIF" biru menyusut, label merah "KURANG MAKSIMAL"; warna cairan jadi teal | Bar turun saat "kurang maksimal" |
| 9 | 28,3–35,1 | Potongan keras ke kartu kosong "VONIS" + slot putus-putus. **Tahan ±1,1 dtk** (antisipasi). 29,4: stempel TERGANTUNG menghantam (mulai lebih besar/miring, mengecil ke posisi akhir ±0,3 dtk). 30,8: kartu AMAN (centang hitam) naik. 32,7: kartu KURANG PAS (seru merah) naik | Stempel jatuh tepat di kata "tergantung"; tiap kartu tiba saat frasanya diucapkan |
| 10 | 35,1–39,2 | Buku manual terbuka; kaca pembesar + sorot kuning di "RON …"; tetes 1 (±37,5), lalu 3 tetes dengan tanda "=" dan pil "SATU JENIS" (±38,5) | Tetes muncul sesuai "terus konsisten satu jenis" |
| 11 | 39,2–43,2 | Kartu polling: ikon komentar; judul "Motor lo minum apa?" disorot per kata; opsi A, B muncul berurutan (±40,5–41), opsi C (±41,5, aktif ±42,5) | Opsi dibacakan satu-satu |
| – | 43,2–47,2 | Kartu akhir TikTok (hitam, bukan bagian desain; abaikan) | – |

## Transisi
- **Dissolve cepat ±0,2–0,3 dtk** (5×): ke-5 pada 11,6 · 19,7 · 25,1 · 35,1 · 39,2. Adegan lama menipis sambil adegan baru menebal, objek dan judul bertumpuk sebentar. **Judul berganti di tengah dissolve** (mis. "Mesin butuh RON 92" → "Aditif").
- **Potongan keras** (3×): hook → bumper (3,6), gelas → silinder (7,9), tangki aditif → kartu vonis (28,3). Dipakai sebagai tanda baca: jeda sebelum sorotan, atau ganti "dunia".
- Tidak ada wipe/glitch/zoom-through.

## Judul bab (kiri atas)
- Teks tumbuh per kata mengikuti VO ("Pertalite vs" → "Pertalite vs Pertamax"; "Oktan" → "Oktan = tahan" → "Oktan = tahan tekanan").
- Satu kata kunci merah per judul ("mesin rusak?", "50:50", "BRIN", "RON 92", "pembersih", "minimal").
- Di bawahnya kicker kecil huruf kapital abu ("PENAMPANG SILINDER MESIN", "KATA DOSEN UGM", "KADAR ADITIF").

## Yang bisa dipakai di Remotion (sesuai gaya kita, bukan menyalin)
| Ide | Cara membuat |
|---|---|
| Dissolve + judul berganti | Dua `<Sequence>` tumpang tindih 6–8 frame (30 fps), `interpolate` opasitas; judul baru mulai di tengah tumpang tindih |
| Judul tumbuh per kata | Komponen judul menerima daftar kata + frame mulai dari timeline Scribe (`tools/scribe_to_timeline.py`) |
| Stempel vonis | Tahan slot kosong 1 dtk; `spring` skala 1,6→1, rotasi -8°→-3° + getar kecil saat mendarat, frame mulai = kata "tergantung" |
| Angka naik | `interpolate` dengan ease-out, 0,5–0,8 dtk, mulai saat angka diucapkan |
| Pop label/lencana | `spring` skala 0→1 dengan overshoot kecil; muncul ±0–0,2 dtk setelah kata kunci |
| Warna berpadu = campuran | Cross-fade dua warna jadi warna ketiga bersamaan dengan kata hasil ("jadinya sekitar…") |
| Gerak hidup di adegan diam | Loop deterministik `frame % periode` (gelombang, piston, gelembung); jangan acak antar-render |
| Detak subtitle | Potongan 2–3 kata tiap ±0,5 dtk, sorot kuning per kata (sudah ada di pipeline subtitle kita) |

Catatan batas: durasi 43 dtk dengan 11 adegan; Fakta Rumah target 50–60 dtk jadi bisa 12–14 adegan atau adegan sedikit lebih panjang. Pakai skill `sutradara` untuk pengecekan ritme, jangan menambah gerak di luar DNA video #7–#8.
