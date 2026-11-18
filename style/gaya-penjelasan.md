# Panduan gaya "Penjelasan" (kit, 18 Nov 2026)

Setara `brand/gaya-growkaz.md` di repo RAKA: satu rujukan supaya video baru tidak ditulis ulang dari nol. Melengkapi (tidak menggantikan) `CLAUDE.md` KUNCI KARAKTER dan `style/identitas.md`.
Rujukan visual: `referensi/moodboard/` (still #8, #14, #19, #20). Kode: `remotion/src/kit/`.

## 1. Kit: apa yang sudah ada (`import {...} from '../kit'`)
| Berkas | Isi |
|---|---|
| `kit/waktu.ts` | `r(t,a,b)` progres, `camAt(keys,t)`, `proj(cam,titik)` (titik 3D → piksel), `kamera.push/orbit/pull` (resep keyframe), `FPS`, `CC_TOP` |
| `kit/stage.tsx` | `Canvas3D`, `Rig`, `Lights`, `Seg` (cross-fade 8 frame; render SEBELUM Kicker/TikTokBox) |
| `kit/prim.tsx` | `Bx` (kotak), `Cy` (silinder), `Sp` (bola), `Mat`; tepi tinta tipis, material datar |
| `kit/teks.tsx` | `Title` (kartu 2 baris), `Captions` (subtitle per frasa), `Chip` (stiker), `klem` (jepit ke zona aman), `TemaProvider` |
| `kit/objek/` | `Stopkontak` (Outlet, Plug, Iron) + `AdeganStopkontak` (6 mode), `registry.tsx` (daftar nama objek → komponen). Rumah atap seng (#8) diekspor ulang dari `v08/Rumah` |
| `kit/Penjelasan.tsx` | Template: `<Penjelasan data words ekstra>` merakit seluruh video dari `beats.json` |
| `v20/beats.json` + `v20/Video20Data.tsx` | Bukti: #20 dirakit dari data, still identik piksel dengan `Video20` (5 frame dibandingkan) |

Belum diekstrak (masih di berkas video asal, salin bila perlu lalu pindahkan ke kit): kasur/AC/`Room` (v14), `Hall` lorong pintu (v19), lampu (`Lamp15`). Aturan: objek yang dipakai ≥2 video pindah ke `kit/objek/` dengan parameter `warna` dari palet, bukan konstanta.

## 2. Alur video baru dengan kit
1. Checklist (`checklist/_template.md`), gerbang T1–T5 tetap berlaku. Palet = keputusan user.
2. `remotion/src/vNN/beats.json` (salin `v20/beats.json`), `vNN/VideoNNData.tsx` (salin `Video20Data.tsx`), daftarkan di `Root.tsx`.
3. Objek baru: buat `kit/objek/AdeganXxx.tsx` (props `t, mode, w, warna`), daftarkan di `registry.tsx`. Waktu animasi objek masuk lewat `w` di data (detik absolut), tidak ditanam di komponen.
4. Panel 2D pemutus pola / banjir koral = komponen `ekstra` di `VideoNNData.tsx`.
5. `node tools/cek-sutradara.mjs NN` (bagian 9 membaca `beats.json`), lalu `tools/produksi.sh sheet`.

### Format `beats.json`
```
nomor, palet, durasi, vo ("vNN/vo.mp3"), kicker, hook {pil}
beats {nama: detik, ..., end}                       ← dari timestamp VO
adegan [{dari, sampai, objek, mode, kamera: Key[], w: {nama: [mulai, selesai]}, ukuran: [lebar, tinggi]}]
hantu  [{dari, sampai, baris: [a, b]}]              ← teks ghost latar
judul  [{dari, sampai, kecil, besar, warna: accent|cool|good, ukuran}]
stiker [{teks, warna, ukuran, waktu: [masuk0, masuk1, keluar0, keluar1], xy | tempel {adegan, titik, dx, dy, x, y}}]
komentar {kata, mulai, y, keluar} · follow {mulai, klik, y} · sfx [[nama, detik, volume]]
```
`dari`/`sampai` boleh angka atau nama beat. `ukuran` = lebar×tinggi objek kunci (satuan dunia) dan dipakai cek otomatis.

## 3. Skala objek
- Objek kunci ≥ 1/3 tinggi layar **atau** ≥ 60% lebar layar di SEMUA keyframe kamera (dicek `cek-sutradara` bagian 9). Idealnya mengisi lebar; terpotong tepi layar boleh bila itu close-up yang disengaja.
- Tinggi layar dunia = `2 × jarak × tan(17°)` (FOV 34°); lebar = 0,5625 × itu. Contoh: stop kontak 1,3 satuan pada jarak 4,0 → 53% tinggi layar. Adegan majemuk: jarak ±10, geser `look` agar semua objek masuk (bug #20).
- Dilarang diorama/irisan lebar dan label kecil sebagai pembawa pesan.

## 4. Kosakata shot (resep di `kamera.*`)
| Shot | Pakai untuk | Gerak |
|---|---|---|
| push | hook, payoff, ajakan | dorong 15–20%, `kamera.push` |
| orbit | objek 3D yang punya sisi penting (klip, kontak) | geser pos x kiri → kanan ±4 satuan |
| pull | adegan majemuk, hasil akhir | mundur ke jarak ±10, `kamera.pull` |
| dive | titik balik, "ini rahasianya" | maju ≥70% jarak pandang |
| crane | beda tinggi (rumah vs jalan) | ubah elevasi ≥12% |
Minimal 4 jenis per video; satu "signature shot" (dive/orbit). Sudut tegas: beda tinggi/ukuran/perubahan terbaca dalam 1 detik di HP.

## 5. Tempo
Hook ≤ 4 dtk; beat rata-rata 3–5 dtk dengan variasi (CV ≥ 0,25: satu beat cepat ≤ 2,5 dtk dan satu napas ≥ 5 dtk); video 50–60 dtk. Potongan beat jatuh di awal kata VO (±0,35 dtk). Hening 0,9 dtk sebelum payoff. Titik balik = pola pemutus (panel 2D atau banjir koral).

## 6. Palet
`style/palet.json` (nama, peran warna accent/cool/good) + `style/identitas.md` (tabel pilihan). Palet diputuskan USER di T2. Objek mengambil warna dari `PALET[nama]` lewat prop `warna`, jangan hex tetap kecuali material netral (pelat, logam, kayu).

## 7. Daftar cek sebelum contact sheet (centang di `checklist/vNN.md`)
1. `node tools/cek-sutradara.mjs NN` → 0 GAGAL (bagian 9: dua baris judul, tidak tumpang-tindih, objek ≥1/3 layar, stiker di zona aman).
2. Sheet 6 still berdampingan dengan 2 still dari `referensi/moodboard/` (#8 dan #14); tulis satu kalimat per poin 2–4 KUNCI KARAKTER.
3. `style/cek-bug.md` dibaca; kicker tidak tertutup 3D, judul berakhir sebelum gelembung komentar, tidak ada z-fighting.
4. Teks maksimal dua lapis; subtitle per frasa utuh; kontras tegas, warna datar, bentuk membulat.
5. Penyimpangan dari karakter = buang dan mulai dari awal (bukan tambal-sulam).
