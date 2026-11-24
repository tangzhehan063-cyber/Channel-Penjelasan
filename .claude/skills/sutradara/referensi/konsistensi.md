# Konsistensi (bukan keseragaman)

Sumber: `docs/visual-system/VISUAL_STYLE_SPEC.md` §15. Versi lama (pustaka material `look.tsx`, KUNCI KARAKTER): `arsip/v3-24nov/skills-sutradara-referensi/konsistensi.md`, `arsip/CLAUDE-aturan-lama.md`.

## Dipertahankan
| Hal | Aturan |
|---|---|
| Sistem peran warna | latar, objek utama, fokus/aksen, perbandingan, informasi, netral, tinta; peran semantik (aksen=masalah/fokus, dingin=air/negatif, baik=solusi/benar, kuning=cahaya); preset `style/palet.json` + variasi terkendali (≤5 keluarga, satu aksen) |
| Bentuk | terstilisasi, geometris, ciri pengenal terjaga, proporsi masuk akal |
| Tinta/outline | tipis, konsisten dalam satu video, **tidak wajib di tiap elemen** |
| Bayangan | sederhana, sebagai penanda posisi/arah |
| Tipografi | Inter / IBM Plex Mono / Playfair Italic |
| Animasi | menjelaskan, akurat terhadap mekanisme |
| Model berulang | satu komponen untuk satu objek berulang |
| Anti-bug | `style/cek-bug.md` |
| CTA | "Follow buat fakta rumah berikutnya!" |
## Boleh bervariasi artistik
Outline, bayangan, volume, dan detail antarobjek tidak harus identik (hero B/C, pendukung A); palet, perspektif, teknik, tata letak, ritme, ada/tidaknya teks dan kartu. Syarat: identitas channel tetap terbaca dan tidak ada realistis/PBR/kabut/glow.
## Diarsipkan
Tata letak tetap (subtitle y=1400, kicker, kartu judul), objek ≥1/3 layar, kuota kamera/mode, isometrik wajib, gaya semi-realistis (`look.tsx` dan sejenis), KUNCI KARAKTER.
