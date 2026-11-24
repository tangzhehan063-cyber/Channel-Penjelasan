---
name: breakdown
description: Dua mode. (A) Adegan "breakdown": potongan/penampang/exploded view objek berlapis. (B) Analisis referensi: membedah gambar/video referensi atau teknik visual menjadi keputusan komposisi, art direction, sinematografi, staging, animasi, cahaya, editing, dan implementasi yang bisa direkreasi dengan repo ini. Dipanggil sutradara bila referensi perlu direkayasa-balik, teknik perlu direkreasi, struktur/mekanisme perlu dijelaskan, atau cutaway/exploded cocok. Adegan "breakdown" (potongan/penampang objek berlapis yang terurai, label nama bagian, kamera isometrik berganti sudut) untuk video "fakta rumah" dan sampel gaya. Memuat semua gaya yang sudah dibuat (isometrik terang channel, blueprint, Kurzgesagt, HyperFrames) dan cara menambah gaya baru. Pakai saat user minta video breakdown/bongkar objek, atau sampel gaya baru; dipanggil dengan /breakdown <objek> [gaya].
---
# /breakdown: dua mode

## Mode B: Analisis Referensi (24 Nov 2026)
Dipakai bila ada referensi (gambar, kolase, frame/klip video) atau sebuah teknik yang perlu direkreasi. Keluaran: satu berkas `docs/visual-system/referensi/NN-nama.md` dari `templat-analisis-referensi.md`; hasilnya menjadi masukan `sutradara` (keputusan) dan `remotion-fitur` (implementasi). Bukan deskripsi umum: setiap bagian harus berujung keputusan.
- **Bahan yang sudah ada:** `style/referensi-visual/` (01–07, termasuk `05-gerak-video/detik-*.jpg`), proses referensi di `style/aset.md` ("Cara kerja dengan referensi"), `tools/ref-analyze.py` (OpenCV: ritme potongan, gerak, blur, kedalaman, grain, tekstur; butuh `tools/requirements-ref.txt`) dan `tools/cek-gerak.sh`, `tools/review_video.py` (strip frame dari MP4).
- **Menganalisis:** komposisi (framing, penempatan, ruang negatif, latar depan/tengah/belakang, kedalaman, garis pemandu, hierarki) · art direction (warna, material, tekstur, bahasa bentuk, lingkungan, tingkat realisme, identitas) · sinematografi (jenis shot, perspektif, perilaku fokus, gerak, fokus/DOF, motivasi kamera) · staging (penempatan, interaksi, blocking, ungkap, hubungan ruang) · animasi (apa bergerak, urutan, waktu, easing, antisipasi, tindak lanjut, gerak sekunder) · cahaya (sumber, arah, kontras, bayangan, atmosfer, lampu praktis) · editing (waktu, transisi, ritme, match cut, build-up, payoff).
- **Implementasi:** tuliskan cara mereproduksinya dengan kemampuan repo (Remotion, three.js, React, SVG, CSS, geometri prosedural, shader, compositing, topeng, animasi kamera) dan **tunjuk komponen/berkas nyata** atau tulis "belum ada". Cek status teknik di `remotion-fitur/kartu-teknik.md` (jangan merekomendasikan teknik berstatus gagal).
- **Tujuh pertanyaan wajib per teknik:** (1) apa yang membuatnya efektif secara visual; (2) tujuan bercerita; (3) metode teknis dasar; (4) bisa direkreasi dengan kemampuan repo ini; (5) implementasi tersederhana yang mempertahankan dampak; (6) bagaimana mengadaptasi, bukan menyalin; (7) bisa jadi komponen/preset ulang-pakai.
- **Aturan:** tidak menyalin merek/handle/tata letak persis; bila tak bisa direkreasi, katakan dan beri alternatif. Pisahkan karakteristik yang **dipertahankan** dari yang **diperbaiki**; referensi tidak otomatis berlaku untuk semua kategori. Referensi = sumber pemahaman gaya, bukan template.

## Kapan breakdown dipakai (berlaku untuk kedua mode)
- **Mode A (bongkar/potong/exploded/mekanisme):** dipakai hanya bila kategori **Breakdown / How it works**, atau bila narasi benar-benar menuntut penjelasan struktur/lapisan/mekanisme. **Bukan default untuk setiap video atau setiap objek.** Mitos dan lingkungan (mis. rumah hook) tidak perlu membongkar rumah: utamakan situasi, lingkungan, perspektif, demonstrasi.
- **Jangan hanya memisahkan komponen:** terangkan hubungannya: jalur sambungan, urutan interaksi, aliran (listrik, panas, tekanan, gerak, air), sebab-akibat, pembesaran detail, perbandingan komponen. Akurasi mekanisme dijaga (hubungan dan arah tidak boleh keliru; `[CEK]` bila belum pasti).
- **Gaya:** mengikuti `docs/visual-system/VISUAL_STYLE_SPEC.md` (stylized/flat; detail B/C untuk komponen yang dibahas, A untuk lainnya); SVG/CSS 2D (samping/isometrik) dulu, 3D terstilisasi bila hubungan ruang menuntut. Kamera isometrik dan gaya-gaya di bawah adalah **opsi**, bukan kewajiban. Animasi: `sutradara/referensi/animasi-mekanisme.md`.
- Keputusan apakah breakdown dipakai ada pada `sutradara`; skill ini mengeksekusi analisis/penjelasan strukturnya.

## Mode A: bongkar objek berlapis, satu mesin, banyak gaya

Konsep dari skill breakdown asli (exploded view), **diimplementasikan di mesin repo ini** (Remotion + three.js). Kit HyperFrames dari skill asli tidak tersedia; HyperFrames sendiri bisa dipakai (lihat gaya 4).
> **Status (24 Nov 2026):** untuk E1, `sutradara` memutuskan apakah dan bagaimana breakdown dipakai; tata letak, kamera isometrik, dan gaya bukan kewajiban. Pembatasan lama (gerbang T1–T7, KUNCI KARAKTER, "gaya selain isometrik terang belum diizinkan") berlaku hanya untuk video gaya diorama lama; teks aslinya ada di `legacy/SKILL-asli.md`.

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
