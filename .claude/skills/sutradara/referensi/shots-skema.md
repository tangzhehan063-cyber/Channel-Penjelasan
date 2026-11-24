# Skema `shots.json` (opsional; storyboard.md cukup untuk video kecil)

Satu berkas per video: `e1/NN/shots.json`. Divalidasi `python3 tools/cek_shots.py e1/NN/shots.json` (struktur saja; variasi = saran). Kolom opsional `dimensi_penting` dan `suara` dapat ditambahkan.

```jsonc
{
  "video": "e1-02", "komposisi": "Pilot02",
  "vo": "remotion/public/e1-02/words.json",   // kata + waktu; kalimat dipetakan ke ID
  "kalimat": {"s8": [20.94, 23.50], "s9": [24.06, 28.04]},  // (opsional) cache hasil pemetaan
  "shots": [
    {
      "id": "P1",
      "ref_kalimat": ["s8"],                    // ID kalimat yang dicakup (waktu diturunkan dari VO)
      "mulai": 20.5, "durasi": 2.4,             // detik absolut (otoritatif untuk render); validator cek tutup-menutup
      "tujuan_visual": "Penonton melihat rumah nyata yang sudah ditinggikan dan menyadari ada sesuatu di bawahnya.",
      "mode": "footage",                        // footage | 3d | 2d | tipografi | data | hening
      "alasan_mode": "Bukti nyata dulu; mekanisme menyusul.",
      "subjek": "dasar rumah + tangga", "lingkungan": "jalan kampung, mendung",
      "ukuran_shot": "sedang",                  // lebar | sedang | dekat | detail
      "sudut_kamera": "sejajar mata, frontal",
      "posisi_kamera": {"dari": {"pos": [-0.1, -0.3, 19.0], "look": [-0.1, -0.3, 1.5]}, "ke": {"pos": [-0.1, 0.1, 16.5], "look": [-0.1, 0.1, 1.5]}},  // dibaca lib/kamera.ts (kameraShots)
      "gerak_kamera": {"jenis": "push", "easing": "in-out", "alasan": "Mendekat ke dasar rumah tempat jawabannya."},
      "gerak_subjek": [],
      "cahaya": "mendung difus, sesuai foto",
      "komposisi": "subjek di sepertiga kiri; ruang negatif di kanan untuk label",
      "kedalaman": "latar ilustrasi datar, subjek, bayangan alas",
      "fokus": "dasar dinding + tangga",
      "teks": [],                               // [{jenis, isi, kapan, posisi, alasan}]
      "transisi": {"keluar": "ground-slice", "alasan": "Garis tanah foto = permukaan penampang 3D."},
      "frame_akhir": "garis tanah di tengah layar, dinding dasar terlihat",
      "aset": ["e1-02/rumah-ditinggikan.jpg"],
      "implementasi": "remotion/src/e1/lib/footage.tsx + Pilot02.tsx",
      "footage": {"sumber": "e1-02/rumah-ditinggikan.jpg", "peran": "jangkar-ke-3D", "alasan": "...", "bagian": [0.1, 0.55, 0.45, 0.85],
                  "crop": "pita lanskap", "gerak": "push 1.0→1.7x", "sorotan": "garis tipis di garis tanah",
                  "transisi_masuk": "-", "transisi_keluar": "ground-slice", "relasi_narasi": "Foto menunjukkan rumah yang ditinggikan; 'di bawah rumah' ada tanah yang tidak terlihat."}
    }
  ]
}
```

## Aturan validator (ringkas)
- Semua kolom wajib terisi (teks boleh `[]`). `footage` wajib bila `mode=="footage"` atau aset berupa foto, dengan `relasi_narasi` dan `peran` valid.
- `gerak_kamera.jenis` ∈ push, pull, dolly-in, crane-turun, crane-naik, orbit, tracking, pan, tilt, macro, pov, terkunci, whip, rack-focus. Semua kamera punya `alasan`.
- Shot berurutan menutup tanpa celah/tumpang-tindih >0,05 dtk; total ≈ durasi komposisi.
- Variasi: **saran saja**. Tidak ada minimum jenis kamera/mode/shot diam; pengulangan berturut-turut hanya diberi PERINGATAN.
- Peringatan: shot >5 dtk tanpa perubahan internal; teks yang memuat >70% kata narasi.
