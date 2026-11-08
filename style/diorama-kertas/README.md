# Gaya B: Diorama kertas (origami × editorial)

Status: **konsep disetujui user (8 Nov 2026)**, belum ada kode/still. Calon gaya video #6.
Gaya A (editorial 3D, aktif) ada di `style/style.md` + `style/aset.md`. Origami murni lama hanya arsip di `arsip/origami/` (tidak dipakai).
Moodboard: `moodboard.html` (buka di browser).

## Prinsip
**Origami = panggung, sistem editorial = isi.** Semua elemen sistem gabungan (`style/aset.md`) tetap dipakai, tapi wujudnya benda kertas yang berdiri di atas meja seperti diorama, persis cara video #1–#4.

## Keputusan user
1. **Latar krem kertas + bidang meja** (bukan gradasi abu-hijau lama). Alasan: kontras tinggi (revisi #5 "terlalu saru"), rasa buatan tangan (video clay betang 14 jt views di riset), beda dari feed kompetitor.
2. **Pertanyaan hook tetap di atas sepanjang video** (kotak hitam ala TikTok), dengan dua penyesuaian:
   - kicker `— FAKTA RUMAH · #NN —` dicetak di kartu judul, tidak diulang di atas;
   - saat jawaban muncul, kotak pertanyaan **berganti jadi jawabannya** (sage + ✓), mis. "Jawabannya: trasram ✓", supaya rasa penasaran tertutup dan frame itu bisa jadi cover/screenshot.

## Palet & tipografi
| Peran | Warna |
|---|---|
| Kertas latar | `#efece4` |
| Lantai meja | `#e4dfd3` |
| Kartu berdiri | `#f8f6f0`, sisi tebal `#d9d4c7` |
| Tinta | `#1c1c1e` |
| Koral = masalah/sorotan | `#f27a63` (sisi gelap `#c95a46`) |
| Biru = air | `#1f7fdc` |
| Sage = solusi/benar | `#6fae6a` |
Tipografi sama dengan sistem gabungan: IBM Plex Mono (kicker, subtitle di kartu putih), Playfair Display 900 + italic koral (judul), Inter (label, tombol). Space Grotesk dari origami lama tidak dipakai.

## Terjemahan elemen
| Sistem gabungan | Wujud di diorama kertas |
|---|---|
| `SerifHead` + `Kicker` | Dicetak di **kartu judul berdiri** (latar belakang diorama) |
| Objek 3D utama | **Diorama kertas**: potongan kertas tebal dengan sisi lipatan terlihat (bata = strip kertas) |
| `FocusRing` | Lingkar putus-putus **digambar di lantai meja** (seperti tanda kapur) |
| `PropRow` | Potongan kertas **pop-up** berdiri satu per satu, lingkar putus-putus di lantai |
| `PatternBreak` / flood | **Lembar kertas koral terlipat menutup layar**, garis lipat terlihat |
| `StatPanel` | Dicetak di kartu berdiri; angka solusi sage |
| `CommentBubble` | Gelembung kertas tebal dengan sisi bawah terlihat |
| `FollowButton` | Tombol kertas tebal, ditekan kursor → ✓ Following |
| `Ornament` tegel | **Ubin kertas** tergeletak di lantai sudut |
| `MonoSub` | Kartu putih kecil di bawah (seperti subtitle origami lama) |

## Gerak & suara
- Muncul = kartu terlipat berdiri (pop-up); ganti babak = **refold** kartu; whip pan = kertas digeser di atas meja.
- Ritme tetap 0,4–0,6 dtk per kejadian (`style/aset.md`, bahasa gerak).
- SFX kertas lama (lipat, geser, tap) boleh dipakai lagi + tick/chime/pop.

## Langkah berikutnya
1. Still 4 frame (hook, penyebab, lipatan koral, angka+ajakan) dari topik #6 → cek user.
2. Bila disetujui: komponen `remotion/src/diorama/` memakai ulang `aset/Gabung.tsx` (logika gerak) + material kertas (MeshStandard matte, sisi tebal, bayangan lembut).
3. Bandingkan retensi (persentase tonton sampai habis) video #6 vs #5 di TikTok Analytics.
