# Daftar cek bug visual (WAJIB sebelum render penuh)
Dicatat dari bug nyata. Cek setiap poin di contact sheet still (`--scale=0.5`) sebelum `remotion render`. Tambahkan bug baru di sini begitu ditemukan.

## Objek 3D
1. **Bagian rumah menembus atap/dinding** (video #8: segitiga pelana dipasang menghadap depan, puncaknya keluar dari atap seng → terlihat "segitiga putih" di atap). Segitiga pelana selalu di sisi ujung bubungan (tegak lurus bubungan), puncaknya ≤ tinggi atap di titik itu. Cek still dari sudut kamera yang dipakai, bukan satu sudut saja.
2. **Bidang satu sisi** (`shapeGeometry`/`planeGeometry`) hilang dari arah sebaliknya → pakai `side: THREE.DoubleSide` untuk dinding/lembar tipis.
3. **Kamera terlalu dekat**: objek utama (rumah, atap) harus utuh di frame, tidak terpotong tepi (video #8 hook awal: rumah terpotong).

3a. **Objek tambahan menembus atap** (video #9: papan nama warung ditaruh di belakang tenda, setinggi atap → terlihat "kotak putih" di atas atap). Benda yang ditempel ke rumah (papan, tenda, lampu) cek dari sudut kamera tinggi; papan nama di bawah tepi tenda, bukan di atasnya.

4a. **Gerak 3D tidak dari `useCurrentFrame()`** (`useFrame()` r3f, animasi bawaan model/shader, `Math.random()` tanpa seed) → flicker saat render. `<Sequence>` di dalam `<ThreeCanvas>` wajib `layout="none"`. Detail: skill `remotion-fitur`.

## Tata letak 2D
4. **Elemen penting tertutup judul atau objek 3D** (video #8: matahari & awan "ketutup awan" tertutup kartu judul dan atap). Elemen kunci beat harus terlihat jelas; zona judul y ≈ 450–700, subtitle y ≈ 1400, objek 3D di antaranya.
5. **Teks keluar layar** (stempel/judul besar): pakai `whiteSpace: nowrap` + ukuran font yang muat 960 px; cek tepi kiri-kanan.
6. **Teks bertumpuk** (video #8: label "tek? nggak kedengeran" menimpa chip "ayam"). Beri ruang tetap untuk label, jangan pakai posisi kanan-bawah yang bisa ditabrak elemen lain.
7. **Efek/stiker menimpa kicker atau TikTokBox** di atas (y < 420).
8. **Emoji** tidak tampil di Chromium container (tidak ada font emoji) → jangan pakai emoji di teks layar.

## Proses
9. Render dijalankan **setelah** user melihat still; kalau ada revisi saat render berjalan, matikan prosesnya sampai benar-benar mati (`pgrep -fa "remotion render"` harus kosong, pakai `kill -9 <pid>` bila perlu) baru render ulang.
10. Sebelum mulai video baru: `git fetch` dan cek cabang `claude/*` yang belum masuk `main` (video #7 pernah tertinggal di cabang lain sehingga nomor video hampir bentrok).
- **Subtitle angka "koma" rusak (#11):** Scribe/`scribe_to_timeline.py` mengubah "satu koma satu juta" jadi "satu koma 1000000". Cek `words.json` untuk token angka; gabungkan jadi "1,1 juta".
- **Angka hitung naik terlambat dari VO** (#14 ember: layar "13 liter" saat VO sudah bilang "17"): animasi counter harus selesai paling lambat di kata angkanya, bukan sesudahnya. Cek still tepat di detik kata angka.
- **Objek kunci tertutup kotak judul** (#14 AC di bawah judul "SELANG MAMPET"): kamera 2,5D `Rig` → naikkan nilai y supaya objek turun di layar.
- **Overlay 2D menimpa objek 3D (#16 timeline uji lab menimpa depot, label "KAMU" menimpa "uji lab")**: beri kartu latar semi-transparan pada overlay yang lewat di atas objek 3D, dan beri jarak tetap antar label.
- **Objek kunci di tepi layar (#16 pot dan depot terpotong kiri/kanan di adegan dua objek)**: cek posisi x tiap objek terhadap lebar kamera (lebar dunia = 1080/zoom) sebelum render.
- **Salah tafsir referensi (#16)**: referensi user dibaca sebagai target render (gambar AI realistis, lalu ilustrasi datar) padahal yang diminta hanya penempatan dalam gaya 2,5D channel. Sebelum membangun, tulis 1 kalimat tafsir ('saya tiru: penempatan X; saya ubah ke gaya channel') dan pastikan gaya mengikuti `style/identitas.md`.
- **SRT memotong "E. coli" (#16)**: `produksi.sh srt` menganggap "E." akhir kalimat. Setelah render, gabungkan manual baris yang berakhir "E." dengan baris berikutnya (atau tambah pengecualian singkatan di skrip).
- **Awan 3D menutupi kicker/TikTokBox (#17)**: objek di atas rumah (awan, hujan) naik ke y < 420 saat kamera tinggi. Awan harus memudar sebelum kamera turun, atau diletakkan di bawah zona kicker. Kicker di palet terang pakai warna aksen (bukan koral pucat) supaya terbaca.
- **Z-fighting tanah/rumput (#17)**: dua balok dengan permukaan atas sebidang (balok tanah dan lapisan rumput tipis) berkedip garis-garis di sudut kamera tertentu. Turunkan balok bawah 0,04 dari permukaan lapisan atas. Saat dua blok terpisah (jalan vs halaman) naik-turun, isi celahnya dengan balok tanah penghubung supaya tidak terlihat melayang.
- **Kendaraan muncul di luar ujung jalan (#17)**: posisi awal mobil harus di dalam panjang jalan (z mulai ≥ batas balok jalan + margin).

## Bug karakter (17 Nov 2026): #16 dan #17 menyimpang dari gaya channel, dinilai user "sangat jelek"
- Diorama/irisan tanah lebar membuat objek hanya ±1/3 lebar layar dan seperempat bawah layar kosong; label kecil tak terbaca di HP.
- Kartu judul dengan baris kedua kosong; subtitle terpotong di tengah frasa; pil judul + kartu + subtitle saling mengulang.
- Beda tinggi jalan-rumah dikecilkan demi referensi sampai inti pesan (rumah lebih rendah) tidak terlihat.
- Revisi R1–R3 ditumpuk jadi tambal-sulam. Aturan: lihat "KUNCI KARAKTER" di `CLAUDE.md` (menyimpang = mulai dari awal).

## Bug #19 (17 Nov 2026)
- Kicker/pil hook tertutup 3D: komponen 3D (Seg) harus dirender SEBELUM Kicker dan TikTokBox di DOM, bila ada dinding/objek putih besar.
- Bidang halaman (lantai luar) berujung terlihat sebagai tepi terang/gelap: buat bidang luar sangat besar (60 m).
- Daun pintu membuka ke arah kamera menutup objek kunci: buka ke dalam.
- Judul yang masih tampil saat gelembung komentar/tombol follow masuk menimpa (#19: Title denah sampai 50,0). Akhiri judul sebelum overlay penutup muncul.

## Bug #20 (18 Nov 2026)
- Adegan majemuk (setrika + stop kontak + tanah) dengan kamera terlalu dekat: objek tertutup kartu judul dan keluar layar. Atur kamera dari jarak ±10 dan geser look.x supaya semua objek utama masuk lebar layar.
- Steker dekat kamera menutupi stop kontak: kamera dari samping, look.x digeser ke arah stop kontak.
- Stiker yang diposisikan dengan proj() terpotong tepi layar: selalu clamp x ke 250..900 (#20 'ada klip logam?').

## Bug #21 (18 Nov 2026)
- Properti di belakang pelat (motor) tertutup kartu judul: turunkan seluruh adegan di layar (naikkan pos.y dan look.y bersama +0,5) supaya properti di bawah zona judul (y > 700).
- Saat dive dekat ke objek, tepi atas objek dan retak masuk zona kicker/pil hook (y < 420): kicker tetap terbaca karena dirender di atas 3D, tapi batasi dive agar tepi atas objek tidak melewati y ≈ 200.
- Retak realistis: gunakan poligon bergerigi deterministik (`kit/objek/Retak.tsx`), jangan `Math.random()` (flicker antar frame).

## Bug #22 (18 Nov 2026)
- Teks kalender `Calendar` (v11) terpotong tepi tekstur bila >9 huruf (MENGAMBANG): font otomatis 64 px untuk teks >9 huruf.
- Dua objek kecil dalam satu adegan (tumpukan uang + amplop) terpotong tepi kiri/kanan walau diperbesar: pakai SATU objek per adegan (KUNCI KARAKTER 2).
- Kalender/objek ber-sub-teks di bawah: sub-teks tertutup subtitle (y 1400+); naikkan objek (turunkan look.y dan pos.y bersama).
- Objek diorama kertas #11 (bank, uang, kalender, map) berukuran kecil: besarkan dengan `scale` grup 2,2 sampai 3 dan atur kamera jarak ±3,5–5.
- Objek gaya #21 (Kpr21) terpotong tepi bila jarak kamera < ±5,5 untuk objek ±1,5 satuan; pakai jarak 5,6–7 dan cek `cek-sutradara` (ukuran ≥ 1/3 tinggi atau ≥ 60% lebar).
- Kamera isometrik: `cek-sutradara` versi lama menghitung jarak perspektif (pos-look) dan menandai semua adegan isometrik GAGAL; kini adegan ber-`iso` diukur dari `zoom`. Objek ±1,5 satuan butuh zoom ≥ ±330 agar ≥60% lebar layar.

## Bug #24 (19 Nov 2026, rumah hook)
- **Objek bantu 3D yang hanya untuk satu beat (panah harga) tidak dimatikan sesudah beat selesai**: panah tetap tampil di 5 adegan berikutnya dan menabrak kicker. Setiap objek per-beat wajib punya waktu hilang.
- **Kamera terlalu dekat ke objek hook sehingga elemen yang dijanjikan hook (mobil) ada di luar layar**: hitung posisi layar (x−z)/√2 tiap elemen bergerak sebelum menulis kamera; lihat still di detik 0, bukan di tengah adegan.
- **Berkas lampu transparan yang jatuh ke ruang kosong terbaca sebagai poligon abu-abu**: buat memudar bertahap dan jangan melewati tepi jalan.
- **Kamera pan mengikuti mobil dari ketinggian rendah**: mobil menutupi rumah dan jendela tidak terlihat silau (dibatalkan). Efek sorot harus terlihat dengan mobil DAN jendela dalam satu frame.
- Dinding krem terang pada palet malam menyembunyikan sinar lampu (tidak terlihat lebih terang); pakai dinding lebih gelap supaya sorotan terbaca.
