# Kit aset "fakta rumah"

Aset tambahan untuk memperkaya video bergaya editorial 3D (`style.md`). Semua aset **dibuat dengan kode** (prosedural): tanpa file luar, tanpa lisensi, dan bisa dipakai ulang di setiap video.
Kode: `remotion/src/aset/Aset.tsx` · Demo: komposisi `AsetDemo` (`remotion/src/aset/AsetDemo.tsx`) · Contoh frame: `contoh-aset/`.

## Cara kerja dengan referensi
- **Video lebih baik dari gambar**: kirim file video referensi (MP4). Claude memecahnya jadi frame (5 per detik) lalu membuat lembar kontak untuk mempelajari gerak & ritme; lembar kontak disimpan di `style/referensi-visual/NN-nama/`.
1. User mengirim **screenshot 3–5 frame** referensi (hook, objek + label, transisi, teks/angka) + bagian yang disukai.
2. Claude menyimpan referensi ke `style/referensi-visual/NN-nama.png`, lalu menuliskan yang diambil (bukan meniru branding/handle/tata letak persis).
3. Claude **membuat asetnya sendiri** di `Aset.tsx` (SVG/CSS/three.js), merender still untuk dicek user, lalu menambahkannya ke tabel di bawah.
4. Bila sebuah aset benar-benar perlu gambar/model (mis. objek sangat realistis), pakai urutan: prosedural → generasi gambar (ElevenLabs) → model CC0. Catat sumber & lisensinya di sini. Poly Haven diblokir dari container cloud.

## Katalog
| Aset | Dari referensi | Fungsi | Batas pakai |
|---|---|---|---|
| `ShadowCast kind="teralis"` | 01 lentera (bayangan ranting) | Bayangan teralis jendela rumah lama di kertas, bergeser pelan seperti cahaya matahari. **Ciri khas channel.** | Opacity 0,10–0,16; tidak menutupi objek utama |
| `ShadowCast kind="daun"` | 01 lentera | Bayangan ranting lembut | Alternatif teralis |
| `Cutout kind="daun" / "tegel" / "bunga"` | 01 ranting, 02 bunga hitam | Siluet hitam tegas dengan bayangan jatuh, masuk dari sudut & dipotong layar. `tegel` = motif ubin kunci | Maks. 2 per adegan, di sudut berlawanan |
| `TikTokBox` | 02 kotak teks | Pertanyaan hook dengan kotak hitam ala TikTok, muncul kata per kata | Hook & jeda interaktif saja |
| `TwoTier` | 01 "True Value / SHINE" | `kalimat kecil / KATA BESAR`, abu gelap `#4a4a4c`, `accent` = koral | Teks layar utama |
| `LightBeam` | 01 balok diagonal | Balok tipis abu = cahaya/panas/aliran | Aksen, opacity ≤0,22 |
| `PatternBreak` | 03 layar merah | Layar koral penuh + grain + teks putih tebal, masuk dengan lingkaran membesar | **Maks. 1× per video** (beat mitos/twist) |
| `PuzzleGrid mode="ubin"` | 03 grid huruf | "Cari ubin/bata yang beda": penonton ikut mencari, lalu target dilingkari koral | **Maks. 1× per video** (beat ajak cek) |
| `PuzzleGrid mode="huruf"` | 03 grid huruf | Kata tersembunyi (istilah teknis, mis. TRASRAM) yang lalu ditandai | Alternatif jeda interaktif |
| `Grain` | 03 tekstur | Tekstur film halus di atas semua lapisan | 0,05 di kertas, 0,12 di layar koral |

## Bahasa gerak (dari referensi video 05, kode `remotion/src/aset/Gerak.tsx`, demo `GerakDemo` → `contoh-aset/gerak-demo.mp4`)
Ritme: **satu kejadian baru tiap 0,4–0,6 detik**; tidak ada layar yang diam lebih dari ±1 detik.
| Teknik | Komponen | Cara pakai |
|---|---|---|
| Objek menggantikan huruf di judul, berdiri di atas tiang | `ObjectWord` | Hook: mis. "temb[bata]k", huruf memudar dari abu ke hitam ±0,6 dtk |
| Kalimat muncul kata per kata, kata terakhir koral & besar | `KineticWords` | Di bawah judul hook; jeda 6 frame per kata |
| Objek abu naik dari bawah sambil berputar lalu berubah koral | pola di `GerakDemo` (tint 0→1) | Transisi hook → isi |
| Kamera mendekat lalu "whip pan" ke sudut dengan motion blur | `whip()` | Pergantian sub-topik; objek dipotong tepi layar |
| Daftar serif italic: blur + abu → tajam + hitam, bergiliran | `FocusList` | Gejala / penyebab / ciri (maks. 3 butir) |
| Coretan zigzag tergambar di sudut | `Squiggle` | Hanya di hook, 2 buah di sudut berlawanan |
| Keluar: semua elemen blur + pudar, objek meluncur keluar | `out` di tiap komponen | Akhir babak |

Catatan teknis: `Env` di `pengetahuan/Scene.tsx` sekarang dipasang sinkron; kit aset memakai `<Env intensity={0} />`. Sebelumnya still terlihat benar tapi video jadi pucat karena pencahayaan lingkungan baru termuat saat render video. **Selalu cek warna di MP4, bukan hanya still.**

## Sistem gabungan (ref 05 + 06 + 07) — dipakai mulai video #6
Kode `remotion/src/aset/Gabung.tsx`, demo `GabungDemo` → `contoh-aset/gabung-demo.mp4`. Ref 06 = cerita produk (lembar kontak di `referensi-visual/06-cerita-produk/`), ref 07 = kolase editorial (`07-kolase-editorial/`).

**Semantik warna (wajib konsisten):** koral = masalah/sorotan · biru `#1f7fdc` = air · hijau sage `#6fae6a` = solusi/benar · tinta = teks & garis. Tidak ada warna lain.

**Tipografi 3 lapis:**
- Kicker & subtitle VO: IBM Plex Mono (`Kicker`, `MonoSub`) — kesan "catatan teknik".
- Judul: Playfair Display 900, baris kedua italic koral (`SerifHead`), kata per kata abu → tinta.
- Label/angka UI: Inter (label prop italic tebal, tombol). `TwoTier` Inter tetap boleh untuk kata besar tunggal.

**Kerangka layar tetap (jangkar):** kicker mono `—— FAKTA RUMAH · #NN ——` + pertanyaan hook di kotak hitam (`TikTokBox`) tetap di atas sepanjang video (ref 06), subtitle mono di bawah, 2 ornamen tegel berputar pelan di sudut berlawanan (berubah koral saat momen pemutus pola).

| Babak | Komponen | Asal |
|---|---|---|
| Hook | Objek 3D masuk berputar dari kiri + `Disc` koral muda di belakang + `Disc` kecil warna semantik + `FocusRing` putus-putus di bagian yang dibahas | 06 + 07 |
| Penyebab/ciri | Objek di-whip keluar, `PropRow` 3 ikon dalam cincin putus-putus + label italic | 06 |
| Mitos/twist | `FocusRing` membesar menutup layar (flood) → teks serif putih + italic tinta | 06 (transisi cincin) + pemutus pola |
| Angka | `StatPanel`: garis pembatas tergambar, ikon, angka serif menghitung, label mono; angka solusi berwarna sage | 07 |
| Ajak cek | `CommentBubble` kata diketik (jawaban yang diharapkan di komentar) | 07 |
| Penutup | `FollowButton` diklik kursor → "✓ Following" | 06 |

Yang sengaja TIDAK diambil: foto/footage asli dalam kartu (kita tanpa footage), kolase foto hitam-putih halftone (bertabrakan dengan objek 3D), branding/handle kreator referensi.

## Performa render (9 Nov)
`PaperPlus`, `Grain`, `Ornament` memakai PNG panggang di `remotion/public/aset/` (komposisi `BakeAset`). Kalau tampilan efek diubah, panggang ulang: `npx remotion still BakeAset public/aset/<kind>.png --props='{"kind":"<kind>"}' --image-format=png`. Jangan menambah filter SVG (feTurbulence/feGaussianBlur/drop-shadow) yang dihitung tiap frame; panggang dulu. Render per bagian ±15 dtk + `--timeout=120000`; audio dirakit ffmpeg.

## Aturan komposisi
- Satu objek 3D utama tetap pusat perhatian; aset hanya pendukung.
- Maks. 3 aset tambahan aktif di satu adegan (di luar Paper & Grain).
- Teks tidak boleh ditimpa objek 3D; cek still sebelum render penuh.
- Safe zone 15% atas, 20% bawah tetap berlaku.
