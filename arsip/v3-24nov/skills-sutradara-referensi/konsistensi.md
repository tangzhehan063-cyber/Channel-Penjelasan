# Aturan konsistensi (dipertahankan) dan batasan kreatif (diarsipkan)

Keputusan pemilik (23 Nov 2026): konsistensi identitas dan aturan anti-bug **tetap**; aturan yang membatasi komposisi/kamera/tata letak/animasi **diarsipkan** (`arsip/CLAUDE-aturan-lama.md`, `arsip/skills/sutradara/`). Preset lama = referensi.

## Dipertahankan (wajib)
| Hal | Aturan |
|---|---|
| Skala | 1 satuan = 1 m; proporsi nyata |
| Model berulang | Satu komponen untuk satu objek (rumah, tiang acuan, tanah) di semua shot: identik secara matematis |
| Warna peran | aksen koral `#ef6a4c`/`#f27a63` = masalah/penanda perubahan; biru = air/dingin/negatif; hijau/sage = solusi/benar; netral = struktur |
| Material | Pustaka `look.tsx` (plester, lempung, pasir, batuan, rumput, jalan, kayu, air); bahan sama = tampilan sama |
| Penanda acuan | Garis/tiang acuan yang sama (merah-putih tiap 0,5 m) bila membuktikan perubahan |
| Tipografi | Inter 600/900; satu keluarga |
| Grading | Sedikit hangat, kontras tegas; satu "look" untuk 3D dan foto (grain + vignette ringan) |
| Suara | VO netral (`cek_suara`), loudness −15..−13 LUFS, ada lapis selain VO |
| CTA | "Follow buat fakta rumah berikutnya!" |
| Teknik | deterministik, anti z-fighting (`cek_kilau`), tanpa API AI (`cek-mandiri`) |

## Diarsipkan (bukan aturan)
- Subtitle di y=1400 dan kicker di atas sebagai tata letak wajib.
- "Satu objek besar di tengah ≥1/3 layar"; larangan irisan/diorama lebar; larangan label kecil.
- Maksimal 3 preset kamera; crossfade 8 frame seragam; kartu judul dua lapis.
- Penegak otomatis tata letak (`cek-sutradara`), gerbang T1–T7, checklist per video.

## Cara menjaga konsistensi tanpa membuatnya kaku
Konsistensi di **sistem** (bahan, warna peran, model, tipografi, suara), variasi di **bahasa sinematik** (mode, kamera, komposisi, ritme). Bila ragu apakah suatu perubahan merusak identitas: tanya "apakah penonton masih mengenali ini sebagai Fakta Rumah dari model, warna, dan suara?" Bila ya, bebas.
