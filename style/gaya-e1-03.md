# Identitas visual aktif: gaya E1-03 (patokan sejak 25 Nov 2026)

Patokan: video **E1 #03 "Tiang Listrik di Depan Pagar, Tolak Rezeki?"** (`e1-03-tiang-listrik.mp4`, 68,4 dtk).
Kode acuan: `remotion/src/e1/Tiang03.tsx` (+ `remotion/src/e1/look.tsx` untuk material). Still acuan: `referensi/e1-03/` (`sheet.jpg` = 9 still).
Cadangan kode: branch `backup/e1-03-tiang-listrik`.

## 1. Gaya (dipertahankan)
- **Dunia miniatur 3D yang distilisasi**: rumah, jalan, pagar, tiang, mobil dengan geometri sederhana yang rapi dan sengaja (kotak, ekstrusi profil, silinder, tube). Bukan fotorealistis.
- **Palet terang terkendali**: langit gradien `#bcd8ee → #e6eef0 → #f3e9d6` + awan SVG kabur; genteng oranye, plester krem kusam, rumput hijau segar, jalan abu terang; aksen `#ef6a4c` (penanda), merah `#e0442e` (bahaya/kena). Grading ringan `contrast(1.07) saturate(1.1)` + vinyet tepi.
- **Kamera miring/isometrik-semu**: atap, fasad, jalan dan kedalaman ruang terlihat. Dua mode di SATU kanvas: perspektif FOV 34 (adegan rumah) dan **tele FOV 3° dari jauh = tampilan isometrik** (denah, breakdown).
- **Cahaya lembut terkendali**: `hemisphereLight` + satu `directionalLight` (`[-8,14,10]`, 2,6, hangat) dengan bayangan 2048; kabut tipis hanya di mode perspektif. Arah cahaya sama di semua adegan.
- **Informasi menyatu dengan lingkungan**: label bergaris ke titik 3D (`Label2`/`proj2`), zona merah transparan di ruang (zona kabel), papan DIJUAL di pagar, objek menyala merah saat "kena". Kartu 2D penuh layar hanya untuk daftar langkah/angka.
- **Gerak & kamera untuk bercerita**: satu gerak kamera utama per adegan; objek bergerak karena cerita (mobil mundur lalu mentok, atap terangkat, lantai 2 turun dari atas, kanopi menjulur, tiang bayangan bergeser).
- **Teks**: kicker Inter Black 76 px di atas (y 150), subtitle kata aktif (`kit/teks` `Captions`, posisi baku), label Inter 700 40 px di kartu terang. Penutup "Follow buat fakta rumah berikutnya!".
- **Skala nyata**: 1 satuan = 1 m (tiang 9 m, mobil 3,7 m, lantai 3,2 m).

## 2. Tidak boleh diubah menjadi
Fotorealisme; "visualisasi arsitektur semi-realistis"; material PBR berat (HDRI, normal map foto, SSAO, bloom, DOF); CGI realistis; estetika video AI; diagram datar tampak atas saja; motion graphics bergaya slide.
Material tetap `CanvasTexture` ber-seed dengan relief ringan (`look.tsx`: plester, genteng, rumput, jalan, kayu, beton) atau warna polos.

## 3. Penyempurnaan yang boleh (tanpa mengubah gaya)
Koreografi kamera, komposisi, cahaya, kedalaman, gerak, transisi, hierarki visual, penceritaan adegan. Contoh yang sudah dicatat dari #03: atap mobil tampak polos dari atas; label sempat tertutup ikon (±60 dtk); atap rumah memenuhi sepertiga atas layar di adegan denah.

## 4. Prinsip penyutradaraan (dari skill `sutradara` bagian B, berlaku umum)
1. Satu subjek, satu belokan; akhir menggema pembuka (sudut/objek hook muncul lagi).
2. Satu momen khas per video di puncak (di #03: breakdown lantai 2 masuk ke zona kabel).
3. Kamera beralasan: push (fokus), pull (konteks), orbit (sisi lain), crane (antar lapis), pan (pindah perhatian). Tidak diam total.
4. Ritme tidak rata: ada beat cepat ≤2,5 dtk dan napas ≥5 dtk; hook ≤4 dtk, gambar sudah jadi di frame 0.
5. Waktu baca: teks tampil ≥ huruf/15 + 0,8 dtk (min 1,8); teks tidak bergerak saat dibaca.
6. SFX jatuh 1 frame setelah gambarnya; hening ±0,9 dtk sebelum payoff bila naskah mengizinkan.
7. Hierarki gerak: satu hero per shot; pendukung lebih kecil dan terlambat 100–200 ms; masuk ease-out, keluar ease-in lebih singkat.
8. Larangan: glow/bloom, partikel hiasan, semua elemen masuk bersamaan, easing linear (kecuali putaran/progress).

## 5. Pilih metode visual (yang paling jelas menjelaskan, di dalam gaya ini)
| Isi narasi | Metode | Skill pustaka (lihat `node tools/pilih-skill.mjs`) |
|---|---|---|
| Letak/relasi bangunan, jalan, akses | Dunia miniatur + kamera miring/orbit | isometric-animation, shot-composition |
| Bagian dalam, lapisan, tambah lantai | Breakdown di mode tele (angkat di sumbu Y, bukan skala) | isometric-animation, skill proyek `breakdown` |
| Aliran (air, udara, listrik) | Partikel ber-seed (ratusan, bukan ribuan) / garis putus SVG | particle-system, diagram-animation |
| Perbandingan, langkah, angka | Kartu terang / bagan SVG di atas adegan | diagram-animation, chart-animation, kinetic-typography |
| Bahaya / kena | Objek menyala merah + label merah + zona transparan | color-motion |

## 6. Biaya render (CPU, swangle)
2,5D/SVG bila cukup; geometri ringan; satu kanvas; bayangan satu lampu 2048; tanpa motion blur multi-sampel, shader layar penuh, post-processing. Ukuran acuan #03: ±10 mnt render penuh 68 dtk (per bagian, satu tab).

## 7. Rencana adegan (diisi di fase 4, per adegan, berdasarkan waktu VO final)
Detik (dari `words.json`) · kalimat VO · tujuan penjelasan (1 kalimat) · objek utama · metode · kamera (mode + gerak + alasan) · gerak objek · teks/label · skill pustaka · transisi · SFX. Adegan tanpa tujuan penjelasan = dekorasi, dibuang.
