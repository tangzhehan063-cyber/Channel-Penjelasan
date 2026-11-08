# Kit aset "fakta rumah"

Aset tambahan untuk memperkaya video bergaya editorial 3D (`style.md`). Semua aset **dibuat dengan kode** (prosedural): tanpa file luar, tanpa lisensi, dan bisa dipakai ulang di setiap video.
Kode: `remotion/src/aset/Aset.tsx` · Demo: komposisi `AsetDemo` (`remotion/src/aset/AsetDemo.tsx`) · Contoh frame: `contoh-aset/`.

## Cara kerja dengan referensi
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

## Aturan komposisi
- Satu objek 3D utama tetap pusat perhatian; aset hanya pendukung.
- Maks. 3 aset tambahan aktif di satu adegan (di luar Paper & Grain).
- Teks tidak boleh ditimpa objek 3D; cek still sebelum render penuh.
- Safe zone 15% atas, 20% bawah tetap berlaku.
