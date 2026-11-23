---
name: breakdown
description: Adegan "breakdown" (potongan/penampang objek berlapis yang terurai, label nama bagian, kamera isometrik berganti sudut) untuk video "fakta rumah" dan sampel gaya. Memuat semua gaya yang sudah dibuat (isometrik terang channel, blueprint, Kurzgesagt, HyperFrames) dan cara menambah gaya baru. Pakai saat user minta video breakdown/bongkar objek, atau sampel gaya baru; dipanggil dengan /breakdown <objek> [gaya].
---
# /breakdown: bongkar objek berlapis, satu mesin, banyak gaya

Konsep dari skill breakdown asli (exploded view), **diimplementasikan di mesin repo ini** (Remotion + three.js). Kit HyperFrames dari skill asli tidak tersedia; HyperFrames sendiri bisa dipakai (lihat gaya 4).
Naskah, subtitle, suara, caption, tata letak video bernomor tetap mengikuti `CLAUDE.md` + `WORKFLOW.md` (gerbang T1–T7, KUNCI KARAKTER). Gaya selain "isometrik terang" belum diizinkan di video bernomor (pengecualian KUNCI KARAKTER belum diputuskan user); pakai hanya untuk sampel sampai user memutuskan.

> **Aturan E1 (23 Nov 2026):** untuk video E1, pakai hanya mesin Remotion + three.js (gaya 1 sebagai dasar); **gaya 4 HyperFrames dilarang**; tanpa API AI. Pakai selektif sesuai `WORKFLOW.md` bagian Breakdown.

## Cara kerja inti (semua gaya sama)
1. **Satu objek berlapis**, balok/silinder bulat, posisi lapisan fungsi waktu: `terurai` (e: 0 rapat → 1 terbuka), lalu **sorot** satu lapisan (yang lain meredup), label nama muncul bergaris ke titik tempel.
2. **Kamera ortografis isometrik** dengan kunci `{t, az, el, zoom, look}`: `az` (putar), `el` (naik/turun), bawaan 45°/35,264°. Ganti sudut tiap beat (putar pelan, tampak atas `el` 60–80°, sisi `az` ±65–80°, kembali isometrik). Hindari `az` > 80° pada objek tipis (tampak tepi). Detail kosakata: `style/gaya-penjelasan.md` bagian 11 dan `style/rencana-sudut-kamera-iso.md`.
3. **Label = nama saja** (maks. 2 baris), diletakkan di tepi layar sisi berlawanan titik tempel (tidak pernah terpotong layar), garis penunjuk ke titik pada lapisan; nomor urut kecil. Objek ≥ 1/3 tinggi layar.
4. Proyeksi label: `projIso(cam, titik)` di `remotion/src/kit/waktu.ts`.

## Gaya yang SUDAH ada
| # | Gaya | Di mana | Cara pakai |
|---|---|---|---|
| 1 | **Isometrik terang (channel)**: warna material nyata, tepi tinta, palet latar kertas (krem/mint/langit/malam), kartu judul+subtitle+VO | `remotion/src/kit/objek/AdeganDinding|Kran|Atap.tsx`, terdaftar di `kit/objek/registry.tsx` (`dinding`, `kran`, `atap`); `Penjelasan` + `beats.json` (adegan `mode`, jendela waktu `w`, stiker `tempel`+`garis`) | video bernomor: salin `remotion/src/v08` atau v14 sebagai template (aturan CLAUDE.md), adegan `objek:"dinding"` dst. Mode dan kunci `w` ada di kepala tiap file `Adegan*.tsx` |
| 2 | **Blueprint**: latar biru tua + grid, objek transparan bergaris cyan, label monospace, bingkai gambar teknik | `remotion/src/sampel/SampelBlueprint.tsx` (komposisi `SampelBlueprint`) | `npx remotion render SampelBlueprint out/x.mp4`; `layout`, `CAM`, `SOROT`, `NAMA`, `anchor`, `Rig` diekspor dan dipakai gaya lain |
| 3 | **Kurzgesagt (tafsiran)**: ungu-biru + bintang, warna jenuh membulat, tanpa garis tepi, label pil bernomor | `remotion/src/sampel/SampelKurz.tsx` (`SampelKurz`) | sama; ini tafsiran di atas mesin isometrik, bukan gaya asli (aslinya ilustrasi 2D vektor dengan gradasi dan gerak geser/zoom) |
| 4 | **HyperFrames** (HTML + GSAP + three, render `npx hyperframes render`) versi Kurzgesagt | `sampel-hyperframes/` | `./setup-vendor.sh` (CDN jsdelivr diblokir proxy cloud, library lokal dari npm), lalu `npm i hyperframes` dan `npx hyperframes render -o ../video/sampel-hyperframes.mp4`. Katalog ada blok resmi `exploded-stack` dan `starfield` (`npx hyperframes add exploded-stack`); skill HyperFrames resmi dipasang user lewat `npx hyperframes skills update` |

Sampel objek dinding bata (8 label: cat tembok, aci, plester semen, bata merah+spesi, besi tulangan, kolom praktis, sloof, tanah dasar) dipakai gaya 2–4; geometri sama, hanya tampilan beda.

## Gaya yang BELUM dibuat (tawaran, tidak ada kodenya)
- **Gelap neon**: latar hampir hitam, objek gelap bertepi menyala cyan/oranye, label bercahaya.
- **Clay pastel**: objek sangat membulat, warna pastel, bayangan lembut.
- **Cutaway realistis**: warna material asli, latar abu netral, pola arsir pada penampang.
Cara membuat: salin `SampelKurz.tsx`, ganti `WARNA`, latar, `Blok` (material), `Label` (bentuk); impor `layout`/`CAM`/`anchor` dari `SampelBlueprint.tsx`; daftarkan komposisi di `remotion/src/Root.tsx`.

## Daftar cek sebelum render (hemat token, skrip dulu)
- `cd remotion && npx tsc --noEmit`; still `npx remotion still <Komposisi> out.png --frame=N --scale=0.4`, gabung jadi satu contact sheet (maks. 1 sheet/putaran).
- Video bernomor: `node tools/cek-sutradara.mjs NN` harus 0 GAGAL (membaca `az`/`el`); `tools/cek-gerak.sh` (SARAN).
- Jebakan yang pernah terjadi: orbit `az` > 90° menyembunyikan objek di balik dinding; callout menumpuk panel; adegan diam total (beri gerak `az`/`el`/zoom); jendela `w` yang tumpang tindih; label keluar layar; objek berbentuk balok (kurang membulat) adalah kelemahan yang diketahui.
- Cahaya satu arah ikut berputar bersama kamera (`LightsIso az`); jangan ubah antar adegan.
