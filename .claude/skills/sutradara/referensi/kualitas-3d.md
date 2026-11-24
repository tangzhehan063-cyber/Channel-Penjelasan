# 3D terstilisasi (hanya bila perlu)

Sumber gaya: `docs/visual-system/VISUAL_STYLE_SPEC.md` §1, §7, §8. **Bukan default.** Pakai SVG/CSS 2D dulu; naik ke 2.5D, lalu 3D, hanya bila hasilnya lebih jelas. Versi sebelumnya (cahaya low-key, kabut, material berrelief, bidang potong sinematik): `arsip/v3-24nov/skills-sutradara-referensi/kualitas-3d.md`, `legacy/`.

## Kapan 3D benar-benar menolong
Objek yang harus dilihat dari banyak sisi; potongan/exploded yang menjelaskan hubungan ruang; rotasi yang bermakna; kedalaman yang menjelaskan posisi. Bila tak satu pun berlaku: 2D.

## Aturan gaya
- **Material:** datar atau 3 nada (toon/shading sederhana, atau `MeshStandardMaterial` roughness tinggi **tanpa** env map dan tanpa bump realistis). Perbedaan material lewat warna dan pola grafis (garis serat, titik), bukan tekstur realistis.
- **Bentuk:** primitif membulat, proporsi konsisten, ciri pengenal terjaga.
- **Outline:** tipis (`Edges` dari drei) bila tingkat detail B; boleh tanpa outline.
- **Cahaya:** satu arah sederhana, konsisten; bayangan alas/jatuh lembut bila informasi. **Tanpa** pencahayaan realistis, lampu titik dramatis, kabut, rim light, pantulan, glow.
- **Kamera:** sederhana, bertujuan; kamera tak bergerak bersamaan dengan informasi utama.
- **Latar:** ilustrasi (warna/gradasi lembut/lingkungan datar), bukan lingkungan 3D realistis.
- Foto tidak dijadikan tekstur permukaan 3D; foto masuk sebagai elemen 2D terkomposisi.

## Skala dan akurasi
Proporsi benda masuk akal; simulasi memakai angka bersumber dan konsisten; tandai ilustrasi. Penyederhanaan tidak boleh mengubah makna mekanisme.

## Anti-bug (wajib; `style/cek-bug.md`)
Z-fighting (`python3 tools/cek_kilau.py`; tak ada permukaan sebidang, tumpuan menancap ≥0,02 m, `shadow-normalBias`); objek tembus; teks/label terpotong tepi layar; kamera tak masuk padatan; deterministik (tanpa `Math.random`/`Date`/`useFrame`); biaya render swangle (periksa dengan still dulu).
