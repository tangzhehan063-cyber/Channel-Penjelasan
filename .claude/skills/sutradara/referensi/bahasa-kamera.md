# Bahasa kamera: tujuan, parameter, larangan

Berlaku untuk kamera 3D dan, secara analog, geser/zoom lapisan 2D. **Panduan, bukan kuota:** kamera hanya bila bermotif; kamera dan informasi utama tidak bergerak bersamaan; kamera terkunci adalah pilihan penuh.

Tulis di `shots.json`: `gerak_kamera: {jenis, dari, ke, easing, alasan}`. Kamera 3D = FOV 34° (kit), perspektif. Jarak dan sudut di bawah untuk objek ukuran rumah (1 satuan = 1 m).

| Gerak | Tujuan (pesan ke penonton) | Parameter awal yang aman | Dilarang bila |
|---|---|---|---|
| **Push-in** | "lihat ini": fokus, tekanan | jarak turun 15–35% dalam 2–5 dtk; easing in-out | subjek sudah jelas (hanya dekorasi); foto resolusi rendah >1,8× |
| **Pull-back** | "ternyata lebih besar/ada konteks" | mulai ketat, mundur 30–60%; di akhir ada elemen baru muncul | tidak ada yang diungkap di akhir |
| **Dolly-in masuk struktur** | "kita masuk ke dalam": sebab tersembunyi | maju + sedikit turun; objek melewati bidang depan (potongan terbuka) | struktur belum dipotong (menabrak muka) |
| **Crane turun / naik** | pindah antar lapisan/ketinggian; sebab ↔ akibat | Δy 2–6 m, 2–4 dtk, kamera lurus (tanpa roll) | tidak ada hubungan vertikal pada isi |
| **Orbit sebagian** | tunjukkan sisi lain/volume | ±12–40° saja; objek 3D utuh | objek datar (billboard/foto); orbit > 60° tanpa alasan |
| **Tracking/pan lateral** | menyusuri hubungan (deretan, aliran) | geser sejajar objek 1–3 m/dtk | tidak ada yang disusuri |
| **Pan/tilt dari tempat** | pindah perhatian antar dua titik | 20–40°/dtk maks; berhenti dengan jelas | dua titik tidak berhubungan |
| **Macro dekat (dolly ke tekstur)** | rasa material, detail mekanisme | jarak 0,5–1,5 m dari permukaan, gerak sangat pelan | tekstur prosedural kasar tampak jelek di sana |
| **POV maju** | rasa "kamu di sana" | tinggi mata 1,6 m, maju 1–1,5 m/dtk | tidak ada tujuan spasial |
| **Terkunci (static)** | beban/penantian/ketegangan; membiarkan perubahan di dalam frame bekerja | 0 gerak, atau drift ≤1%; durasi 1,5–4 dtk | selalu — pastikan ada sesuatu bergerak di dalam frame |
| **Whip/cut cepat** | pemutus pola, pergeseran mendadak | ≤0,4 dtk; hanya bila ada alasan ritme | dipakai sebagai hiasan |
| **Rack focus** | perhatian berpindah dalam satu frame | blur latar/subjek bergantian 0,6–1,2 dtk | tanpa kedalaman nyata |

## Menyusun gerak
- **Satu gerak utama per shot.** Dua gerak (mis. push + crane) hanya bila menyatu jadi satu kata kerja ("menyelam").
- **Alasan wajib** (1 kalimat): "supaya penonton melihat X bagian dari Y". Tak ada alasan → kamera terkunci.
- **Mulai dan akhiri dengan komposisi yang bisa dibaca**, bukan hanya bergerak di tengah.
- **Easing:** in-out untuk dolly/crane; ease-out untuk reveal (cepat lalu tenang); linear hanya untuk loop/penghitung. Gerak kamera selalu lebih lambat dari gerak subjek.
- **Kontinuitas sudut:** antar shot berurutan, ubah sudut ≥30° atau ukuran ≥1 tingkat (jump-cut halus); bila sama, sambung dengan gerak.
- **Kecepatan layar HP:** perubahan jarak >50% dalam <1,2 dtk terasa mabuk, hindari kecuali pemutus pola.
- Tidak ada jumlah minimum jenis gerak. Pakai gerak yang dibutuhkan cerita; kamera terkunci adalah pilihan penuh bila bertujuan.

## Pasangan yang terbukti berguna (gunakan sebagai awal, bukan template)
- Bukti → sebab: *push-in ke garis tanah* → *crane turun masuk potongan*.
- Mekanisme: *dolly-in* → *terkunci* (membiarkan pemampatan terjadi) → *pull-back* (melihat akibat).
- Akibat: *crane naik + pull-back* kembali ke footage yang sama dengan perubahan terlihat.
- Skala: *pull-back* dari detail ke deretan rumah.
