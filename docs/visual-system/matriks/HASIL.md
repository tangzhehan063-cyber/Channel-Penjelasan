# Matriks teknik visual: hasil (Tahap 3, 24 Nov 2026)

Tujuan: menilai **kualitas visual** teknik pada subjek nyata pilot (rumah ditinggikan → pondasi → lempung), bukan kecepatan render. Kode eksperimen: `remotion/src/e1/lab/` (LabEfek, LabFoto, LabSek, LabTransisi; komposisi terdaftar di `Root.tsx`, hanya eksperimen). Gambar: `efek_*.jpg`, `foto_matriks.jpg`, `sek_matriks.jpg`, `transisi_matriks.jpg` di folder ini.

## 0. Lingkungan: tidak ada GPU
Diukur nyata (bukan asumsi):
- `nvidia-smi` tidak ada; `/dev/dri` tidak ada; `lspci` tidak menampilkan perangkat grafis; 4 inti CPU, RAM 16 GB.
- Playwright/Chromium: WebGL2 tersedia lewat **ANGLE → Vulkan → SwiftShader (perender CPU)**; `navigator.gpu` (WebGPU) = **false**; `OffscreenCanvas` ada; API HTML-in-canvas (`drawElementImage`) ada. Tiga konfigurasi flag memberi hasil sama.
- **Semua hasil di bawah adalah hasil CPU/SwiftShader. Tidak ada pengujian GPU. Tidak ada klaim tentang perilaku di GPU.** Hasil GPU harus diuji pemilik di mesin ber-GPU (`--gl=angle`).

## 1. Efek canvas Remotion (`@remotion/effects`): GAGAL di lingkungan CPU ini
20 uji (10 efek × `Img` foto dan `Solid` warna; color-correction, vignette, light-leak, glow, film-burn, zoom-blur, halftone, chromatic-aberration, noise, duotone) + 1 uji render video. Pembanding tanpa efek: foto dan `Solid` tampil normal.
**Hasil: 0 dari 20 menghasilkan gambar** (semua keluar putih atau hitam polos, diukur dari nilai piksel; CLI tidak melaporkan galat). Render video (`--frames`) sama. Lihat `efek_img.jpg`, `efek_solid.jpg`.
Tafsir terbatas: backend efek bisa `2d | webgl2 | webgpu` (`remotion/dist/cjs/effects/effect-types.d.ts`); 43 berkas efek bernama `*-webgpu-shader`; WebGPU tidak ada di sini. Penyebab pasti tidak diteliti. **Status: gagal-di-lingkungan-CPU-ini; tidak diketahui di GPU.**
Padanan yang **terbukti jalan** dan dipakai di eksperimen: CSS `filter` (grading), gradien radial (vignette dan sorot), `mix-blend-mode`, grain SVG `feTurbulence`.

## 2. Transisi `@remotion/transitions` (CPU)
| Teknik | Jalan? | Penilaian visual |
|---|---|---|
| `iris` | ya | lingkaran dari tengah layar, bukan dari objek; geometri tak berhubungan dengan rumah; terasa efek umum |
| `crossZoom` (berbasis shader) | **ya** | blur radial yang kuat; dramatis tapi tak bermotif; mengaburkan rumah |
| `pushCut` | ya | hampir potong biasa; netral |
| **`peel` kustom** (garis cahaya menggambar di garis tanah, strip jalan jatuh, penampang menyala) | ya | **paling bermotif**: transisi dan pesan ("di bawah garis ini") berhimpit; perlu polesan (strip jatuh masih kasar, jeda ke penampang terlalu kosong) |
| **`push` kustom** (dorong ke kaki dinding, foto memudar, penampang naik) | ya | terasa seperti kamera masuk; kontinuitas cukup baik; kabur saat tengah karena foto resolusi rendah |
Catatan: presentasi berbasis shader jalan di CPU, jadi "efek canvas gagal" tidak berarti seluruh paket gagal.

## 3. Perlakuan foto (`foto_matriks.jpg`; kolom raw, grade, layers, persp; baris u=0, 0,5, 1)
| Variasi | Kualitas visual | Masalah |
|---|---|---|
| `raw` pita | jujur tapi lemah | 60% layar kosong (foto lanskap di layar potret) |
| `grade` (CSS grading + vignette + grain + sorot hangat) | muram dan atmosferik, menuntun mata | terlalu gelap/kusam secara keseluruhan; sorot pada pondasi nyaris tak terasa; ruang kosong tetap ada |
| `layers` (2.5D, klip CSS poligon, 3 lapis gerak berbeda) | paralaks sangat halus | pemisahan lapis nyaris tak terlihat; tepi poligon kasar bila diperkuat |
| `persp` (tiga bidang three.js, kamera orbit+dolly) | **paling sinematik**: sudut berubah, foto membesar, kedalaman terbaca | artefak "atap ganda" di batas lapis; resolusi lembut; perlu topeng yang lebih bersih |
Kesimpulan: masalah dasar potret-vs-lanskap belum teratasi oleh satu pun; ruang kosong perlu diisi **konteks** (penampang atau atmosfer), bukan hanya dihias.

## 4. Gaya penampang (`sek_matriks.jpg`; kolom diagram, editorial, pbr3d, noir3d; baris sebelum/sesudah memampat)
| Variasi | Kualitas visual | Cocok untuk |
|---|---|---|
| `diagram` pita datar | jelas tetapi seperti slide | tidak disarankan |
| `editorial` SVG gelap, siluet rumah, satu garis cahaya, strata tipis, label huruf besar berjarak | **bersih, terarah, bermood**; pemampatan terbaca dari siluet turun dan pita menyempit; "POSISI AWAL" bermakna | pernyataan inti ("memampat"), momen minimalis |
| `pbr3d` cahaya depan | tekstur tanah meyakinkan, tetapi terang dan datar; rumah balok putih tampak mainan | tidak disarankan |
| `noir3d` low-key, lampu titik hangat, rim biru, kabut | **paling kaya**: tanah tampak basah dan bertekstur, cahaya membentuk volume, dramatis | momen "di dalam tanah"; lampu bisa memandu mata ke pondasi |
Kombinasi bahasa yang konsisten: foto ber-grade low-key dengan cahaya hangat di kaki dinding → garis cahaya hangat di garis tanah → `noir3d` (masuk) → `editorial` (pernyataan memampat).

## 5. Yang BELUM diuji (jujur)
`CameraMotionBlur`, `useWindowedAudioData`/`media-utils`, light-leak/film-burn sebagai overlay DOM, partikel `InstancedMesh`, desain suara, ritme/pacing dalam klip bergerak (matriks ini still; transisi hanya 5 frame), perilaku apa pun di GPU.
