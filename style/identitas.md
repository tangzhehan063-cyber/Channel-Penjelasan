# Identitas visual dan sistem palet (aktif, diringkas 24 Nov 2026)

Sumber utama identitas: `docs/visual-system/VISUAL_STYLE_SPEC.md` (stylized/flat illustration, tingkat detail B default, peran warna, kartu/kicker/teks opsional). Berkas ini hanya memuat **sistem palet** dan aturan angka warna yang masih berlaku. Versi lengkap lama (jangkar kicker + kartu judul + subtitle y=1400, ornamen, "satu objek hero per adegan"): `arsip/style-lama/identitas.md` (riwayat, tidak berlaku).

## Peran warna (tetap), nilai boleh berganti
latar (`bg`/`bg2`) · tinta (`ink`) · aksen = masalah/sorotan (`accent`) · dingin = air, dingin, negatif (`cool`) · baik = solusi/benar (`good`) · netral. Warna berubah hanya bila ada tujuan (perbandingan, fase, fokus). Cahaya kuning hanya untuk benda bercahaya.

## Preset (`style/palet.json`; krem = salah satu, bukan kewajiban; variasi terkendali boleh)
| Preset | Cocok untuk (usulan) |
|---|---|
| `krem` | netral, seri berjalan |
| `mint` | air, kebersihan, udara segar |
| `terakota` | bata, tanah, panas, biaya |
| `batu` | beton, struktur, teknis |
| `madu` | listrik, cahaya, uang hangat |
| `langit` | atap, cuaca, hujan, angin |
| `malam` | bunyi malam, misteri |
Satu palet per video; ganti di tengah video hanya di titik pergantian fase yang bermakna. Preset baru/variasi: tuliskan di `arah-visual.md`, jaga peran dan kontras.

## Aturan angka (validator `python3 tools/cek-visual.py palet`)
- Aksen/cool/good terhadap latar ≥ 2,5:1; teks besar di atas kartu ≥ 3:1; tinta di latar terang ≥ 4,5:1.
- Hue aksen/cool/good berjarak ≥ 40°. ≤ 4 keluarga warna dominan per frame; ≤ 18% piksel di luar palet; tanpa neon (jenuh > 0,92 dan terang).
- Objek utama berkontras ≥ 1,8:1 terhadap latar.

## Tipografi (bila ada teks)
Inter (judul/label), IBM Plex Mono / Space Mono (catatan kecil). Teks hanya bila menekankan, menyampaikan data, atau memudahkan pemahaman (`sutradara/referensi/teks.md`).

## Tetap
CTA penutup: "Follow buat fakta rumah berikutnya!" (kartu FOLLOW opsional).
