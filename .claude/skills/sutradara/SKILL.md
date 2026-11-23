---
name: sutradara
description: [Video 3D lama; prinsip bagian B juga berlaku umum untuk E1] Keahlian sutradara untuk video "fakta rumah" — mempertahankan DNA motion graphic video #7–#8 lalu menambah lapisan penyutradaraan (shot list, ritme, kamera beralasan, suara, waktu baca) dari repo Motion-videos. Pakai di Tahap 2 (storyboard → shot list) dan Tahap 5–6 (animasi, cek sebelum render); jalankan `node tools/cek-sutradara.mjs NN`. Juga memeriksa bentuk, animasi, dan perpaduan warna material (palet latar fleksibel, identitas tetap): `node tools/cek-sutradara.mjs NN` bagian 6–8 dan `python3 tools/cek-visual.py`.
---

# Sutradara "fakta rumah"

> **STATUS (E1):** bagian **A, C, D, E, F** (DNA 3D kertas, Remotion, cek warna/bentuk, `cek-sutradara`) khusus video 3D lama. Bagian **B** (logline, akhir menggema pembuka, kamera beralasan, ritme tidak rata, waktu baca, SFX 1 frame setelah gambar, hening ±0,9 dtk sebelum payoff, hierarki gerak) berlaku umum dan boleh dipakai untuk perencanaan shot E1; kosakata gerak kamera E1 ada di `WORKFLOW.md` bagian 07. Untuk E1 tidak ada pemeriksaan otomatis `cek-sutradara`.


Sumber (MIT, diringkas & disesuaikan ke Remotion 9:16 yang dikunci ke VO): `lemo-opuscar/DIRECTOR.md`, `LottieFiles/motion-design-skill/director/*`, `lab/prompts/04-numbers.md` + `03-banned.md` di repo `tangzhehan063-cyber/Motion-videos`.
Urutan nilai film: **suara → ritme → kamera → penyutradaraan**. Frame cantik hanya titik awal.

## A. DNA v07/v08 — identitas tetap (ACC user); latar dan palet BOLEH berganti
- **Identitas = sistem, bukan warna latar** (`style/identitas.md`). Latar memakai palet dari `style/palet.json` (krem baku, mint, terakota, batu, madu, langit, malam) lewat `<PaperPalet palet=...>`; jangkar yang tetap: grain 0.05–0.08, ornamen sudut, kicker seri + TikTokBox di atas (y < 420), kartu judul dan subtitle **terang** `#faf9f6`, tipografi, bentuk membulat.
- Satu objek 3D prosedural per adegan, membulat; warna objek memakai **peran** palet: aksen (koral) = masalah/sorotan, cool (biru) = dingin/negatif/air, good (sage) = solusi/benar. Nilai hex diambil dari `PALET`, bukan hex baru.
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
- **Tahap 6**: `node tools/cek-sutradara.mjs NN` (ritme, kamera, suara, **animasi, bentuk, warna**) → semua GAGAL diperbaiki, SARAN dipertimbangkan; lalu contact sheet, `python3 tools/cek-visual.py frame <palet> /tmp/produksi/sheet-vNN/f*.png [--extra ...]` + `style/cek-bug.md`. Satu putaran perbaikan, cek sekali lagi, lalu render.
- Video baru tidak boleh mengulang struktur, momen khas, dan jalur kamera video sebelumnya (≥4 dari 6 berbeda: struktur, pembuka, momen khas, jalur kamera, pola suara, penutup).

## F. Bentuk, animasi, warna: yang dicek otomatis
`node tools/cek-sutradara.mjs NN` (bagian 6–8, dibaca dari kode) dan `python3 tools/cek-visual.py frame <palet> <still...> [--extra #hex,...]` (dari still hasil `produksi.sh sheet`).
| Bagian | Yang diperiksa | Patokan |
|---|---|---|
| 6 Animasi | durasi tiap `r(t, a, b)`; elemen mulai bersamaan; animasi serentak; `Easing.linear`; overshoot | tidak < 0,12 dtk atau > 2,5 dtk; < 4 elemen mulai bersamaan; ≤ 6 animasi serentak; linear ≤ 2×; ada `Easing.back` ≥ 1× (pop/antisipasi) |
| 7 Bentuk | radius kotak 2D; rasio geometri 3D kotak vs lengkung; outline tinta (`Edges`); glow/bloom | ≥ 65% kotak 2D berradius ≥ 10; kotak 3D ≤ 70%; outline pada objek utama; glow hanya bila disengaja (1 objek) |
| 8 Warna | jumlah keluarga warna; neon; kontras warna judul di kartu | ≤ 5 keluarga (60-30-10); tanpa neon; judul ≥ 3:1 terhadap `#faf9f6` |
| cek-visual | latar cocok palet; warna di luar palet; keluarga dominan; kontras objek vs latar; neon | ≤ 18% di luar palet; ≤ 4 keluarga; objek/latar ≥ 1,8 (GAGAL < 1,25); neon 0 |
`python3 tools/cek-visual.py palet` memvalidasi semua preset (kontras teks/aksen, tinta, hue). Cek visual **tidak menggantikan** mata: lihat sheet, terutama bentuk dan kesan perpaduan warna.

**Pemilihan palet di Tahap 2** (kolom baru di storyboard: `Palet`): pilih dari `style/identitas.md` sesuai suasana topik, hindari palet yang sama > 2 video berturut-turut, catat warna tambahan yang sengaja (mis. kuning lampu).

## D. Format shot list (tambahan kolom di tabel beat Tahap 2)
| # | Detik | Framing | Gerak kamera | Kenapa | Hero | SFX/transisi |
|---|---|---|---|---|---|---|
| 1 | 0–3 | lebar | push 4% | perkenalkan rumah | rumah malam | hening → TEK |
| 4 | 14–20 | detail | dive rumah→sekrup (signature) | masuk ke penyebab | sekrup | J-cut derit |

## E. Patokan nilai baseline (`tools/cek-sutradara.mjs`, 9 Nov)
- #07: 6 jenis gerak kamera, tempo CV 0,35, hening sebelum payoff — **contoh kamera terbaik**.
- #08: kamera hampir semua push (3 jenis) → video berikutnya tambah pull/crane/dive; judul "MEMANJANG/MENGKERUT" terlalu cepat dibaca.
- Keduanya: potongan "follow" belum diberi SFX transisi.
- Baseline bagian 6–8 (14 Nov): #14 0 GAGAL, 4 SARAN (outline `Edges` jarang, 2 penanda glow = halo lampu menyala); #13 0 GAGAL, 4 SARAN (2 animasi < 0,12 dtk, outline jarang); #08 0 GAGAL, 8 SARAN (linear 5×, 1 animasi > 2,5 dtk, tanpa outline). Palet baku `krem` lolos validasi.
