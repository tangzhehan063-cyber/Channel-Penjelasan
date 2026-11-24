# Teks sebagai art direction

**Subtitle penuh default MATI.** Visual harus menyampaikan inti tanpa membaca. Teks adalah elemen desain, bukan transkripsi.

## Jenis teks (pilih per shot; default tidak ada)
| Jenis | Fungsi | Contoh | Aturan |
|---|---|---|---|
| **Penekanan selektif** | satu kata/angka kunci di momen wahyu | "1 METER" | ≤3 kata; besar; muncul tepat pada kata itu diucapkan; satu per beat |
| **Label informasi** | memberi nama bagian/lapisan | "Lempung lunak" | muncul saat kamera sampai ke bagian itu; garis penunjuk ke objek; maks 2 baris |
| **Data/angka** | skala, perubahan, ukuran | penghitung "−30 cm", garis acuan "Posisi awal" | terikat objek; angka bersumber/simulasi ditandai |
| **Anotasi visual** | sorotan: lingkaran, garis, panah | garis tipis di garis tanah | tipis, satu warna aksen |
| **Subtitle penuh** | hanya bila diminta/diperlukan (aksesibilitas) | — | zona bawah, kata aktif disorot, `Captions` di `kit/teks.tsx`; tidak boleh menutupi fokus |

## Keputusan
1. Tanya: apakah penonton perlu membaca ini agar paham? Tidak → hapus.
2. Apakah gambar sudah mengatakannya? Ya → hapus teksnya.
3. Posisi mengikuti komposisi (dekat objek yang dijelaskan atau di ruang kosong), **bukan** slot tetap. Hindari ±200 px atas dan ±380 px bawah untuk pesan penting.
4. Waktu baca: ≥ jumlah huruf/15 + 0,8 dtk (min 1,8 dtk); teks tidak bergerak saat dibaca.
5. Tipografi: satu keluarga (Inter 600/900), ukuran = tingkat hierarki; kontras ≥4,5:1 atas latar foto/3D (pakai bayangan/pita bila perlu).
6. Teks muncul dengan gerak yang menjelaskan (ditarik dari objek, ditulis sepanjang garis), bukan fade-slide-up seragam.
