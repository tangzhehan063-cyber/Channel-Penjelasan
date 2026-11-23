# Rencana untuk video #26: sudut kamera isometrik yang berganti (R5 dari #25, disimpan 20 Nov 2026)
Keputusan user 20 Nov: gaya breakdown isometrik terang dari #25 dinilai bagus, tetapi objek "diam di 1 angle". Kombinasi dengan sudut kamera yang berganti DISIMPAN untuk #26, tidak dikerjakan di #25. Merge #25 ke `main` ditunda user (belum yakin).
Skill "isometric" yang dirujuk user tidak ada di repo/sesi; yang ada hanya ringkas 3 aturan di `.claude/skills/remotion-fitur/SKILL.md`. Bila user memberi isi/tautan skill itu, samakan gerakannya.

## Perubahan kit yang diperlukan
1. `kit/waktu.ts`: `Key` diberi `az` dan `el` (derajat, bawaan 45 dan 35,264); `camAt` meng-interpolasi keduanya; `projIso` diperumum: kanan = (cos az, 0, −sin az), atas = (−sin el·sin az, cos el, −sin el·cos az), px = 540 + zoom·(kanan·d), py = 960 − zoom·(atas·d).
2. `kit/stage.tsx`: `IsoRig` memakai `az`/`el` untuk posisi kamera; `LightsIso` ikut berputar mengikuti `az` supaya pembagian tiga nada (atas terang, kiri sedang, kanan gelap) tetap sama.
3. `tools/cek-sutradara.mjs` bagian 9 (ukuran objek isometrik): faktor lebar/tinggi dihitung dari `az`/`el`, bukan konstanta 1,13/0,82/0,4.
4. `beats.json`: tiap kunci kamera boleh memuat `az` dan `el`; zoom tetap lewat jarak `pos.z − look.z`.
5. Bug yang perlu dijaga: callout `tempel` memakai kamera adegan yang aktif; titik sorot harus dihitung dengan `az`/`el` yang sama.

## Kosakata tembakan isometrik (usul, ≥4 jenis + 1 signature)
| Tembakan | Sudut | Pakai untuk |
|---|---|---|
| putar pelan | az 45° → 70°, el tetap | pembuka (gerak sejak detik 0) |
| tampak atas | el 80–90° | urutan lapisan, denah, jalur aliran |
| tampak depan | az 0°, el 5–15° | bentuk pola (retak, susunan) terbaca datar |
| putar mengelilingi (signature) | az 45° → 110° sambil dive | melihat penampang/celah tembus dari samping |
| kembali isometrik | az 45°, el 35,264° | penutup, aksi, gema pembuka |
Aturan: maksimal satu perubahan sudut besar per beat; ganti sudut di awal kata VO; cahaya tidak berubah relatif terhadap kamera; tetap satu objek besar per adegan (KUNCI KARAKTER 2).

## Proses #26
Mulai dari awal alur (checklist baru, cek nomor di `main` dan cabang `claude/*`); kerjakan perubahan kit di T4 setelah naskah, suara, dan palet beres; 5 still ACC sebelum render.
