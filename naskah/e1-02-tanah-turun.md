# E1 #02: Tanah Turun, Lantai Rumah Ditinggikan Berkali-kali (DRAFT, menunggu ACC script)
Narasi: `e1-02-tanah-turun.txt`. Riset dan status klaim: `riset/2026-11-23-tanah-turun.md`. VO: tanya user Gemini atau ElevenLabs setelah ACC.

## 3 alternatif hook
- **A (dipakai di draf):** "Rumah ini sudah berkali-kali ditinggikan, tapi air tetap masuk. Kenapa?"
- B: "Tanah di pesisir Semarang turun sepuluh sentimeter lebih setahun. Rumahmu ikut turun."
- C: "Tinggikan lantainya. Tahun depan, tinggikan lagi. Sampai kapan?"

## Beat sheet (10 shot, ±60 dtk). Satu scene breakdown khusus = shot 5.
| # | Dtk | VO | Visual (kode) | Metode | Kamera | Real-life |
|---|---|---|---|---|---|---|
| 1 | 0–5 | Hook: berkali-kali ditinggikan tapi air masuk | Rumah di tanah, lantai bertumpuk 3 lapis tinggi (penanda "ditinggikan"), air masuk | 3D + highlight | push-in | **Foto 1** rumah ditinggikan |
| 2 | 5–9 | Air laut memang naik | Garis air naik pelan, penggaris | Diagram + 3D | static | |
| 3 | 9–16 | Tanahnya ikut turun, 10 cm+/tahun | Tanah turun terlihat dari penggaris samping, label "±10 cm / tahun (di beberapa titik)" | Perbandingan, penggaris SVG | pull-back | **Foto 3** rumah "tertanam" |
| 4 | 16–20 | 10 tahun lagi turun 1 meter | Simulasi: penggaris, lantai turun 1 m dalam 10 detik animasi, label "kalau lajunya tetap" | Simulasi sederhana | static | |
| 5 | 20–33 | Lempung lunak, air tanah disedot, memampat seperti spons, beban bangunan | **BREAKDOWN** potongan tanah terurai: lantai/urugan, lempung lunak jenuh air, lapisan pasir berair, lempung dalam; pompa sedot, lapisan lempung menipis, permukaan turun; beban rumah menekan | Exploded view + animasi pemampatan | orbit + crane, ≥2 sudut | |
| 6 | 33–40 | Studi 2022: Semarang tercepat kedua dari 99 | Kartu kasus peringkat (Tianjin, Semarang, Jakarta, tanpa angka) | Kartu kasus SVG | static | **Foto 2** rob permukiman (opsional) |
| 7 | 40–46 | Meninggikan lantai cuma menunda | Lantai ditinggikan 3 kali, tanah turun lagi di bawahnya, garis air tetap menyentuh | Siklus animasi | pull-back | |
| 8 | 46–54 | Kurangi sedot air tanah; tanya riwayat peninggian | Ikon pompa dimatikan, rumah dengan tanda tanya | Diagram | static | |
| 9 | 54–58 | Pertanyaan ke penonton | Callback shot 1 | Callback | pull-back | **Foto 1** ulang |
| 10 | 58–61 | CTA | End card | Teks | static | |
Teks layar: kicker pendek per fase, tanpa menyalin VO. Subtitle seperti #01.

## Gerbang kualitas (WAJIB lulus sebelum render, setelah pelajaran #01)
1. `python3 tools/cek_suara.py audio/<vo>.wav --kata N` = OK (nada ±171 Hz, tempo 2,2–2,8, 50–70 dtk). VO diuji sebelum membangun adegan, bukan sesudah.
2. `python3 tools/cek_kilau.py <Komposisi> --dur N` = OK (tanpa z-fighting). Jalankan sebelum render penuh; komposisi menerima prop `nudge` via `nudgeKey`.
3. Loudness akhir −15..−13 LUFS (`cek_suara.py --video`).
4. `node tools/cek-mandiri.mjs` OK; satu sheet still sebelum render (`style/cek-bug.md`).
5. Tidak ada permukaan sebidang: selisih tinggi ≥ 0,02 m (lantai, tanah, lapisan transparan).

## Daftar foto yang perlu Anda cari (nama berkas)
Format: landscape ≥1280 px, siang hari, tanpa watermark atau teks, rumah terlihat utuh, tanpa wajah dekat.
1. `rumah-ditinggikan.jpg`: rumah pesisir dengan lantai/teras jelas lebih tinggi dari jalan atau tetangga (ada tangga atau pijakan, bekas lantai lama terlihat bila bisa). Dipakai shot 1 dan 9.
2. `rob-permukiman.jpg`: jalan atau halaman rumah pesisir tergenang rob/banjir, rumah-rumah masih utuh. Dipakai shot 6.
3. `rumah-tertanam.jpg`: rumah yang pintu atau jendela bawahnya sudah di bawah permukaan jalan (tanda rumah "turun" atau jalan ditinggikan). Dipakai shot 3.
Lokasi ideal: pesisir Semarang (Tambaklorok, Tambakrejo, Bandarharjo, Kemijen) atau Pekalongan/Demak. Foto lokasi lain boleh bila jelas hasil penurunan tanah/rob. Hak pakai = keputusan Anda seperti #01.
