# Perubahan per skill (DRAFT; tidak ada skill baru)

## sutradara (pusat keputusan)
- `SKILL.md`: tambah langkah awal "kategori video" (tabel 6 kategori → pendekatan awal dari spesifikasi §13) dan "tingkat detail/outline/palet mengikuti spesifikasi"; ganti bagian "Foto nyata" sesuai keputusan 5; tegaskan teks/kartu opsional; ganti rujukan anti-pola dengan daftar spesifikasi §17.
- `referensi/` baru: `kategori-video.md` (spesifikasi §13 + contoh storyboard LED dan rumah hook), `animasi-mekanisme.md` (spesifikasi §12 + pola kegagalan + contoh urutan), `templat-storyboard.md` (kolom per shot dari Phase 7 pemilik).
- `referensi/` diubah: `kualitas-3d.md` (ganti isi menjadi "3D terstilisasi"; hapus cahaya noir, kabut, material realistis; rujuk spesifikasi §8), `footage.md` (foto fleksibel), `teks.md` (kartu/kicker opsional), `konsistensi.md` (identitas dari spesifikasi; hapus `look.tsx`), `mode-visual.md` (tambah kategori sebagai titik awal), `komposisi.md` dan `gerak.md` (singkat; rujuk spesifikasi), `arahan-animasi.md` (hapus bagian cahaya/material/lingkungan realistis).
- `legacy/`: tambah salinan isi lama bagian yang diganti.
## breakdown
- Mode A: tambah "Kapan dipakai" (kategori How it works, atau narasi butuh potongan/exploded/mekanisme; **bukan default**, tidak otomatis untuk rumah/objek); tambah pedoman hubungan antarkomponen (jalur, urutan, sebab-akibat), aliran, pembesaran detail, perbandingan komponen. Gaya: B/C dari spesifikasi.
- Mode B (analisis referensi): tetap; tambah "pisahkan karakteristik yang dipertahankan vs diperbaiki".
## remotion-fitur
- `SKILL.md`: urutan pilihan 2D SVG/CSS → 2.5D → 3D terstilisasi; tambah syarat gaya (tanpa PBR/env/fog/lampu realistis).
- `kartu-teknik.md`: tambah kartu SVG/CSS (path draw, mask/clip-path, layering/parallax 2.5D, anotasi, aliran sepanjang jalur, bar/penghitung, split screen, before/after), kartu 3D terstilisasi (toon/3 nada, `Edges`), kartu foto (crop/pan/mask/duotone CSS opsional); **hapus** `noir3d`, "cahaya low-key", "kabut", "material berrelief" sebagai rekomendasi (pindah ke legacy); tambah kolom "sesuai spesifikasi?".
## script-writer, social-video-scriptwriting
- Tidak berubah selain rujukan alur 8 langkah (script-writer bagian 12).
