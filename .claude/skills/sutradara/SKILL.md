---
name: sutradara
description: Keahlian sutradara untuk video "fakta rumah" — mempertahankan DNA motion graphic video #7–#8 lalu menambah lapisan penyutradaraan (shot list, ritme, kamera beralasan, suara, waktu baca) dari repo Motion-videos. Pakai di Tahap 2 (storyboard → shot list) dan Tahap 5–6 (animasi, cek sebelum render); jalankan `node tools/cek-sutradara.mjs NN`.
---

# Sutradara "fakta rumah"

Sumber (MIT, diringkas & disesuaikan ke Remotion 9:16 yang dikunci ke VO): `lemo-opuscar/DIRECTOR.md`, `LottieFiles/motion-design-skill/director/*`, `lab/prompts/04-numbers.md` + `03-banned.md` di repo `tangzhehan063-cyber/Motion-videos`.
Urutan nilai film: **suara → ritme → kamera → penyutradaraan**. Frame cantik hanya titik awal.

## A. DNA v07/v08 — JANGAN DIUBAH (ACC user)
- Kertas krem + grain 0.05, ornamen sudut, kicker seri + TikTokBox di atas (y < 420).
- Satu objek 3D prosedural per adegan, membulat, koral `#ef7663`; biru `#5d8fd6` = dingin/negatif, sage = solusi.
- Kartu judul dua lapis (kecil 50 px / BESAR 84–140 px, `nowrap`) di y 450–700; subtitle top **1400** dengan kata aktif koral.
- Adegan = `Seg` crossfade 8 frame; kamera `camAt` keyframe ease in-out; `proj()` agar stiker 2D menempel ke titik 3D.
- Stiker editorial: Chip, TekBurst/Stamp, Callout garis tipis, panel 2D pemutus pola, Bookmark, CommentBubble, FollowButton.
- Pemutus pola: banjir koral `clipPath circle` di titik balik. VO tidak diolah; gambar ikut VO.

## B. Lapisan sutradara (yang ditambahkan)
1. **Satu subjek, satu tujuan, satu belokan.** Tulis logline 1 kalimat: anggapan → belokan (fakta) → akhir beda dari awal. Akhir **menggema** pembuka (objek/sudut kamera hook muncul lagi, kini "dipahami").
2. **Satu momen khas medium** di puncak (payoff/belokan): sesuatu yang hanya bisa dilakukan 3D kertas — rumah terbelah jadi potongan, kamera menyelam dari rumah utuh ke sekrup dalam satu tarikan, objek "kertas" robek jadi diagram. Satu per video, jangan diulang di video berikutnya.
3. **Shot list wajib di storyboard Tahap 2** (kolom tambahan, lihat D). Tiap adegan punya *framing* (lebar/sedang/dekat/detail), *gerak kamera* dan **alasannya**.
4. **Kamera beralasan, ≥4 jenis gerak per video**: push (fokus), pull (konteks/ungkap skala), orbit (tunjukkan sisi lain), crane (naik-turun antar lapis), pan (pindah perhatian), dive (masuk ke detail = signature shot). Tidak ada kamera diam total; tahan pun didorong 2%. Objek kunci ≥ 1/3 tinggi frame di momen penting.
5. **Ritme tidak rata**: minimal 1 beat cepat ≤2,5 dtk (akselerasi menjelang belokan) dan 1 napas ≥5 dtk. Hook ≤4 dtk, gambar sudah jadi di frame 0 (tanpa intro).
6. **Waktu baca**: judul tampil ≥ huruf/15 + 0,8 dtk (min 1,8). Beat cepat → cukup kata BESAR, buang baris kecil. Teks tidak bergerak saat dibaca.
7. **Suara = separuh film**: setiap aksi terlihat punya SFX sesuai bahan (seng = knock/tick logam, kertas = whoosh/pop). SFX jatuh **1 frame setelah** gambarnya. **Hening ±0,9 dtk sebelum payoff**; bunyi pertama sesudah hening = bunyi terpenting. Pakai SFX sebagai transisi (J-cut: bunyi adegan berikut masuk 0,2–0,4 dtk lebih awal) minimal 2×.
8. **Hierarki gerak**: satu hero per shot; gerak pendukung 50–70% jaraknya dan mulai 100–200 ms lebih lambat; ambient < 5%. Maks 1/3 elemen bergerak bersamaan. Masuk ease-out, keluar ease-in 40–50% lebih singkat. Pop boleh overshoot (back 1.5–2.5), opasitas/warna tidak.
9. **Antisipasi → aksi → follow-through** untuk gerak penting (sekrup "nahan" → getar naik → TEK → goyang reda). Lebih-lebihkan pose kunci 10–30% untuk layar HP.
10. **Larangan**: gradien ungu/biru neon, glow/bloom, partikel hiasan, semua elemen masuk bareng, fade-slide-up di semua elemen, teks/tagline karangan, easing linear (kecuali putaran/progress).

## C. Proses (masuk ke WORKFLOW)
- **Tahap 2**: tambah logline + momen khas + kolom shot list di tabel beat.
- **Tahap 5**: tulis kamera (`CAM_*`) dari shot list, baru isi stiker. Ikuti angka di B.
- **Tahap 6**: `node tools/cek-sutradara.mjs NN` → semua GAGAL diperbaiki, SARAN dipertimbangkan; lalu contact sheet + `style/cek-bug.md`. Satu putaran perbaikan, cek sekali lagi, lalu render.
- Video baru tidak boleh mengulang struktur, momen khas, dan jalur kamera video sebelumnya (≥4 dari 6 berbeda: struktur, pembuka, momen khas, jalur kamera, pola suara, penutup).

## D. Format shot list (tambahan kolom di tabel beat Tahap 2)
| # | Detik | Framing | Gerak kamera | Kenapa | Hero | SFX/transisi |
|---|---|---|---|---|---|---|
| 1 | 0–3 | lebar | push 4% | perkenalkan rumah | rumah malam | hening → TEK |
| 4 | 14–20 | detail | dive rumah→sekrup (signature) | masuk ke penyebab | sekrup | J-cut derit |

## E. Patokan nilai baseline (`tools/cek-sutradara.mjs`, 9 Nov)
- #07: 6 jenis gerak kamera, tempo CV 0,35, hening sebelum payoff — **contoh kamera terbaik**.
- #08: kamera hampir semua push (3 jenis) → video berikutnya tambah pull/crane/dive; judul "MEMANJANG/MENGKERUT" terlalu cepat dibaca.
- Keduanya: potongan "follow" belum diberi SFX transisi.
