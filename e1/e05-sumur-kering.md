# E1 LOG — #05 Sumur Kering gara-gara Sumur Bor Tetangga

> Salin file ini ke `e1/eNN-<slug>.md` di awal video. Field mengikuti `WORKFLOW.md` bagian 11 (log), 08 (pilot), 03 (keputusan). Isi saat kejadian, jangan menunggu akhir.
> Folder Drive: `Fakta Rumah / E1 / #NN - Judul Video`

## 1. Log eksperimen
| Field | Value |
|---|---|
| Experiment | E1 |
| Video ID | |
| Topic | |
| Date published | |
| Visual style | Gaya E1-03 (dunia miniatur 3D distilisasi) |
| Duration | |
| Hook | |
| Production time | |
| Waktu render / putaran revisi kode | |
| Views at 24h | |
| Views at 48h | |
| Average watch time | |
| Retention | |
| Completion rate | |
| Shares | |
| Saves | |
| Comments | |
| Notes | |

## 2. Approval (pemilik channel)
Isi tanggal hanya setelah user menjawab di chat.
- [x] Topik final: 26 Nov 2026 (user pilih di chat)
- [x] Script final (dikunci): 26 Nov 2026, v2 (VO: ElevenLabs)
- [x] VO final: 26 Nov 2026 (Gemini Achernar, 65,9 dtk)
- [x] Style reference: 26 Nov 2026 (3 still referensi/e1-05)
- [x] Render batch besar (komposisi + estimasi waktu disetujui): 26 Nov 2026, Sumur05 ±10 mnt
- [ ] Publish: 
- [ ] Merge ke `main`: 

## 3. Rencana adegan visual (fase 4 `WORKFLOW.md`, dari waktu VO final; tabel `style/gaya-e1-03.md` §7)
| Adegan (detik VO) | Kalimat VO | Tujuan penjelasan | Objek utama | Metode visual | Gerakan | Kamera (mode + gerak + alasan) | Teks/label | Skill pustaka | Transisi/SFX | Durasi |
|---|---|---|---|---|---|---|---|---|---|---|
| Adegan (detik VO) | Kalimat VO | Tujuan | Objek | Metode | Kamera | Label | Skill |
|---|---|---|---|---|---|---|---|
| 0–15,4 | es teh, dua sedotan, nyedot angin | analogi: yang pendek kering duluan | gelas, sedotan oranye pendek & biru panjang | miniatur 3D + partikel isi sedotan | perspektif, push pelan ke ujung sedotan pendek | Sedotanmu, Sedotan teman, Nyedot angin (merah) | isometric-animation, particle-system |
| 15,4–25,4 | sumur gali vs bor, satu lapisan | kenalkan dua sumur dan air tanah bersama | potongan tanah, 2 rumah, sumur gali, sumur bor | breakdown penampang (momen khas) | pull lebar lalu turun pelan | Sumur gali, Sumur bor, Air tanah satu lapisan (denyut biru) | isometric-animation |
| 25,9–36,9 | pompa, corong, dangkal kena duluan | mekanisme corong penurunan | muka air (kurva log), aliran titik ke saringan | geometri muka air diperbarui per frame | push ke dasar sumur gali | Muka air turun, Dasar sumur, Kering (merah) | particle-system, color-motion |
| 37,4–54,9 | kasus Miliran | contoh nyata, netral (dibantah) | 3 sumur warga, hotel naik dari tanah, pompa mati | penampang lebar, kamera tele | tele isometrik, drift | Hotel, Sumur warga kering, Izin sedot dicabut, ±8 hari air kembali; kartu sumber + "Pihak hotel membantah" | isometric-animation, beat-sync-editing |
| 54,9–63,4 | jangan buru-buru bor, cek sekitar | langkah aksi | bor dalam bayangan merah, cincin cek sekitar rumah | 3D + 2 chip langkah | crane naik ke pandangan atas | Bor lebih dalam?, Sumur bor besar? | color-motion |
| 63,7–66,6 | Follow | penutup | dunia utuh | | pull lebar | | |
- Kode: `remotion/src/e1/Sumur05.tsx` (komposisi `Sumur05`, 66,6 dtk). Still acuan gaya: `referensi/e1-05/`.
- [ ] `node tools/cek-mandiri.mjs` OK

## 4. Pilot (hanya video pertama, WORKFLOW 08)
| Kriteria | Hasil |
|---|---|
| Visual quality | |
| Style | |
| Motion | |
| Consistency | |
| Cost (waktu render, revisi; kredit generator = 0) | |
| Time | |
| Usability | |
- Keputusan pilot: [ ] lanjut  [ ] revisi (kode adegan / style / kamera / metode visual)

## 5. Log render
| Shot ID | Jenis (still / klip / penuh) | Komposisi | Waktu render | Putaran ke- | Hasil (lolos / gagal) | Catatan |
|---|---|---|---|---|---|---|
| penuh | penuh | Sumur05 | ±12 mnt (+cek_kilau, uji 0-480) | 1 | lolos | 0 frame rusak; 5 frame polos = dip transisi 15,4/37,4/54,9; cek_kilau OK; −14,4 LUFS, puncak −1,4 dB; 66,6 dtk |

## 6. Masalah produksi
Contoh: inkonsistensi komponen/material, animasi kaku, camera movement failure, text overlay issue, render terlalu lama, editing delay.
| Masalah | Shot | Penyebab | Tindakan |
|---|---|---|---|
| | | | |

## 7. QC akhir (WORKFLOW Step 8)
- [ ] Fact check: klaim utama bersumber, tanpa angka tak terverifikasi, simplifikasi tidak menyesatkan
- [ ] Visual: komponen rumah, lighting, warna, material konsisten; tanpa z-fighting/objek tembus/flicker; teks terbaca; logo tak relevan tidak ada
- [ ] Audio: VO jelas, tanpa clipping, volume stabil, musik tidak mengganggu
- [ ] Editing: hook langsung, tanpa dead space, CTA singkat, 9:16, bisa dipahami tanpa audio
- [ ] Caption + komentar pin lewat humanizer

## 8. Evaluasi (setelah 48 jam, bandingkan dengan B0 ±1.825 views / ±40% dan #9 2.794 views / 57%)
| Target | Hasil | Lolos? |
|---|---|---|
| Average retention ≥ 50% | | |
| Views 48 jam ≥ 2.000 | | |
- Keputusan sementara video ini: [ ] CONTINUE  [ ] ITERATE  [ ] STOP
- Catatan: keputusan eksperimen diambil dari ketiga video, bukan satu video.

## Catatan VO (26 Nov 2026)
- ElevenLabs flow_id `G9L2p6xRfMLhN5qzOUKf`, suara Riri Rida `tCKeP99grYL9wZRg6sQ9`, `eleven_v4`, 1 take.
- Take 1 GAGAL: kuota habis (sisa 27 kredit, butuh 1.028), tidak ada kredit terpakai.
- User pilih Gemini TTS: Achernar, 65,9 dtk, 2,35 kata/dtk, F0 178 Hz, lolos `cek_suara`; words `audio/e05-words.json`. Menunggu ACC VO.
