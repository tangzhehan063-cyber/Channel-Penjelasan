# Gerak subjek, easing, dan hierarki gerak

Tulis di `shots.json`: `gerak_subjek: [{apa, dari_detik, sampai_detik, easing, tujuan}]`. Gerak kamera terpisah (lihat `bahasa-kamera.md`).

## Hierarki
- **Satu pahlawan gerak per shot.** Gerak pendukung 50–70% jarak pahlawan dan mulai 100–200 ms lebih lambat. Gerak ambient (partikel, air) <5% dari perhatian dan tidak boleh lebih cepat dari pahlawan.
- Maks. 1/3 elemen bergerak bersamaan. Selebihnya diam; diam membuat gerak terbaca.

## Easing dan waktu
| Situasi | Easing | Catatan |
|---|---|---|
| Masuk / muncul | ease-out (cepat lalu tenang) | 0,25–0,6 dtk |
| Keluar | ease-in, 40–50% lebih singkat dari masuk | |
| Perpindahan struktur (lapisan, potongan) | in-out cubic | 0,8–2,5 dtk |
| Pemampatan/perubahan perlahan | ease-in-out panjang, **ada fase "menahan"** | beri jeda sebelum mulai agar penonton siap |
| Penghitung/penanda ukur | linear atau ease-out | angka jangan loncat |
| Overshoot (back) | hanya untuk "pop" kecil | tidak pada opasitas/warna |

## Antisipasi → aksi → tindak lanjut
Gerak penting punya tiga fase: bersiap (tahan/tarik balik 5–10%), aksi (inti), reda (mengendap). Contoh pemampatan: lempung bertahan, tertekan cepat di awal, melambat, lalu diam dengan sedikit getar → terbaca seperti sungguhan.

## Fisika yang jujur
- Pemampatan, gravitasi, aliran air mengikuti arah dan skala nyata; angka yang diperlihatkan (mis. 0,3 m = tahun 3) konsisten dan ditandai simulasi.
- Benda berat bergerak pelan dan berhenti jelas; air bergerak berbeda dari padat.

## Gerak yang berarti vs gerak hiasan
Tanya untuk tiap gerak: "apa yang berubah dalam pengertian penonton?" Tak ada jawaban → statis. Penanda diam (garis acuan) sering lebih informatif daripada gerak tambahan.

## Deterministik (wajib)
Semua gerak = fungsi dari `useCurrentFrame()` atau waktu turunan; acak lewat seed (`mulberry32`); tidak ada `Math.random`, `Date`, `useFrame`. Cue waktu dari ID kalimat (`words.json`), bukan angka detik yang ditanam, bila ada kemungkinan VO berubah.
