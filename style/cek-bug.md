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
- **Video #5B (penampang, 12 Nov):** (a) kamera zoom ke kaki tembok membuat puncak tembok tertutup kartu judul (beat 3,45–7,9 dan 26–41 dtk): turunkan `look.y`/`pos.z` atau naikkan objek; (b) irisan tipis (<0,5 m) membuat lapisan tak terbaca → tebalkan irisan (bata 0,8 m, perkiraan visual); (c) sisi luar cat sempit dari yaw −0,35 sehingga retakan tak terlihat → putar objek ke yaw ≈ −1,05 hanya di adegan cat kedorong, label garis dimatikan sebelum berputar; (d) tanda ✗ jangan ditaruh relatif ke bawah objek (jatuh ke zona caption 1400).
