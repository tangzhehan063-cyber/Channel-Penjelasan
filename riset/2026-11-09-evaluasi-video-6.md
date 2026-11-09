# Evaluasi video #6 "Lantai Rumahmu Sengaja Dibuat Miring" (9 Nov 2026)

## Hasil
`video/video-06-lantai-miring.mp4` 56,2 dtk · cover · caption · SRT. Satu sesi dari ide sampai render.

## Proses
| Tahap | Catatan |
|---|---|
| Ide | 2 putaran: putaran 1 pakai scrape (5 kredit), user minta ide lain tanpa scrape. Ide tanpa scrape = tidak ada bukti tren; nilai setelah posting. |
| Naskah | Cepat ACC. Revisi user: kata "nat" → "sela-sela keramik". **Aturan baru: hindari istilah tukang/teknis di VO & teks layar.** |
| VO | 129 kata → 55 dtk (≈2,35 kata/dtk), target 43 dtk meleset. **Patokan baru: Riri Rida ±2,3 kata/dtk → maks. ±105 kata untuk 45 dtk.** |
| Animasi | 3 putaran still (kamera/label). Lemah: momen "KEBANYAKAN" kurang dramatis dari atas; tampak samping sempit. |
| Render | ±100 mnt + 1 percobaan gagal (dihentikan batas 60 mnt proses latar). Frame macet di awal bagian → `--timeout=120000`. Render audio Remotion macet → audio dirakit ffmpeg (VO + ambient + SFX). |

## Uji penyebab render lambat (40 frame, concurrency 4, termasuk ±15 dtk bundling)
| Varian | Waktu |
|---|---|
| Lengkap | 182 dtk |
| Tanpa `PaperPlus` (kertas kusut SVG) | 77 dtk |
| + tanpa `Grain` & bayangan `Ornament` | 34 dtk |
**Kesimpulan: ±85–90% waktu render habis di efek 2D SVG (feTurbulence/feDiffuseLighting, grain, drop-shadow), bukan 3D.** Kertas kusut saja ±60%.

## Tindakan untuk video #7 (gaya tetap sama)
1. `PaperPlus` → gambar PNG statis sekali jadi (`public/aset/kertas.png`).
2. `Grain` → PNG tile statis yang digeser posisinya tiap frame (bukan filter SVG).
3. `Ornament` → PNG tegel dengan bayangan sudah "dipanggang"; cukup diputar.
4. Render per bagian ±15 dtk + `--timeout=120000`; audio selalu dirakit ffmpeg.
5. Target render penuh: < 15 menit (perkiraan dari uji di atas, perlu dibuktikan).
6. VO ≤ 105 kata; momen twist diberi garis bantu/tampak samping.
