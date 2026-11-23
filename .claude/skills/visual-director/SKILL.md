---
name: visual-director
description: Sutradara visual untuk video "fakta rumah" E1. Dipakai di tahap Arahan Visual, Shot list, Storyboard, Animatic, Produksi, dan Visual QA (WORKFLOW.md tahap 5-10). Memutuskan per shot: mode (footage nyata / 2D / 3D / tipografi / data / hening), jenis shot, posisi dan gerak kamera, gerak subjek, cahaya, kedalaman, transisi, ritme, dan cara membuka potongan struktur (breakdown). Menggantikan skill sutradara, remotion-fitur, dan breakdown lama (diarsipkan di arsip/skills/). Pakai juga saat user minta video terasa "diarahkan", sinematik, atau tidak seperti slide.
---

# Visual Director (E1)

Tugasmu: mengubah naskah menjadi **keputusan visual yang bisa dieksekusi dan dinilai**. Bukan memilih istilah kamera; memutuskan apa yang penonton **lihat, rasakan, pahami** di tiap momen, lalu menulisnya sebagai data (`shots.json`).

Uji akhir setiap video: **dokumenter penjelasan yang diarahkan, atau slide beranimasi?** Slide = gagal, kembali ke tahap 5.

## Prinsip (bukan hukum; boleh dilanggar dengan alasan tertulis)
1. **Gambar membawa wahyu, kata mendampingi.** Kalimat yang hanya mengulang apa yang sudah terlihat → minta naskah dipotong (tahap 4).
2. **Perubahan di layar = informasi.** Tidak ada gerak, teks, atau transisi tanpa alasan penjelasan. Tidak ada alasan → buang atau diamkan.
3. **Satu fokus per frame.** Mata penonton harus tahu ke mana melihat dalam 0,5 detik.
4. **Kamera adalah sudut pandang yang berubah demi pengertian**: mendekat = fokus, menjauh = skala/konteks, turun/masuk = sebab tersembunyi, naik/mundur = akibat.
5. **Foto nyata = bukti; 3D = mekanisme.** Hubungkan keduanya (lihat `footage.md`), jangan menempelkannya berdampingan.
6. **Variasi karena isi, bukan karena kuota.** Beat yang berbeda sifat → grammar visual berbeda. Beat sejenis boleh mirip, tapi tidak identik dua kali berturut-turut.
7. **Hening dan diam adalah alat.** Satu shot yang sengaja tenang sebelum wahyu membuat wahyu terasa.

## Prosedur per beat (tulis hasilnya di `direction.md`, lalu `shots.json`)
Jawab berurutan, tulis 1 kalimat tiap butir:
1. **Fungsi beat:** hook / klaim / bukti / sebab / mekanisme / akibat / twist / tindakan / penutup.
2. **Apa yang harus dipahami** penonton setelah beat ini (1 kalimat). Tak bisa dirumuskan → beat dibuang.
3. **Mode** → `style/visual/mode-visual.md` (pohon keputusan). Tulis alasannya.
4. **Cara membuka/mengungkap** (reveal): dari apa ke apa → `mode-visual.md` bagian Reveal.
5. **Jenis shot + komposisi + kedalaman** → `komposisi.md`.
6. **Kamera**: posisi awal → akhir dan *alasan* → `bahasa-kamera.md`. Gerak subjek terpisah dari kamera → `gerak.md`.
7. **Footage?** Kalau ya: peran, bagian foto, crop, gerak, transisi masuk/keluar, relasi ke narasi → `footage.md`.
8. **Teks?** Default tidak ada. Ada hanya bila menambah informasi yang tidak diucapkan → `teks.md`.
9. **Durasi dan ritme**: relatif terhadap tetangga → `ritme.md`.
10. **Cek tetangga:** apakah shot ini terasa berbeda dari sebelum dan sesudahnya? Bila tidak, ubah mode, ukuran shot, arah gerak, atau jadikan diam.

## Memilih jalur kerja
- **Rutin (shot data-driven):** `remotion/src/e1/lib/` (`footage.tsx`, `kamera.ts`, `transisi.tsx`) + `shots.json`.
- **Khusus (adegan 3D unik / breakdown):** komponen sendiri, tetapi tetap mengikuti baris `shots.json`-nya (durasi, kamera, cue ke ID kalimat). Breakdown = teknik selektif, **satu adegan khusus per video** bila ada struktur/lapisan/mekanisme; detail teknik di `kualitas-3d.md`.
- Mesin: Remotion + three.js saja. Tanpa API AI, tanpa HyperFrames. Semua gerak dari `useCurrentFrame`.

## Referensi (baca hanya yang relevan dengan tahap)
| Berkas (`style/visual/`) | Isi |
|---|---|
| `mode-visual.md` | Pohon keputusan mode; jenis reveal; kapan footage↔3D↔tipografi↔hening |
| `bahasa-kamera.md` | Gerak kamera: tujuan, parameter angka, kapan dilarang; cara menggabungkan |
| `komposisi.md` | Ukuran shot, penempatan, kedalaman, hierarki, 9:16 |
| `gerak.md` | Gerak subjek, easing, hierarki gerak, antisipasi, teks bergerak |
| `footage.md` | Memakai foto nyata: peran, crop, resolusi rendah, transisi footage↔3D (resep) |
| `kualitas-3d.md` | Cahaya, material, kedalaman, skala, anti-bug, breakdown |
| `ritme.md` | Panjang shot, kontras tempo, hening, variasi tanpa kehilangan identitas |
| `teks.md` | Teks sebagai art direction: kapan, jenis, posisi; subtitle default mati |
| `konsistensi.md` | Aturan identitas yang dipertahankan (skala, warna peran, material, model) |
| `shots-skema.md` | Skema `shots.json` + contoh |

## Alat
`python3 tools/cek_shots.py e1/NN/shots.json` (validator), `python3 tools/animatic.py ...` (animatic), `python3 tools/review_video.py ...` (QA dari MP4), `tools/cek_kilau.py`, `tools/cek_suara.py`, `node tools/cek-mandiri.mjs`. Gerbang mekanis lulus **tidak** berarti bagus: tonton hasilnya.

## Anti-pola yang harus kamu tangkap sendiri
- Kartu foto penuh layar + subtitle + objek 3D di tengah, diulang. (Itulah "slide beranimasi".)
- Kamera orbit lambat generik "karena 3D".
- Foto sebagai dekorasi yang bisa dihapus tanpa mengubah pengertian.
- Teks yang menyalin narasi.
- Transisi keren tanpa hubungan sebab (wipe, glitch, zoom-blur hiasan).
- Semua shot berdurasi 3–4 detik dan semuanya bergerak.
