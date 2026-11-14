# STORYBOARD · VIDEO #14 · TAHAP 2 · DRAFT (14 Nov 2026)
## Lampu LED Lebih Terang? Bukan, Dia Cuma Nggak Boros Panas
**Fakta Rumah #14** · sub-format **Bongkar Barang** (nomor seri ditentukan saat ACC) · gaya baku #7/#8 + kamera 2,5D (template terbaru `v13`) · 1080×1920 · ±70 dtk (fleksibel naik bertahap).
**Mode:** HYBRID (hook kontras angka, isi mekanisme, bantahan di tengah).
**Logline:** Dua bola lampu kertas bersebelahan, sama terang; satu menyedot listrik 75 satuan, satunya 9. Bedanya bukan terang, tapi berapa listrik yang kebuang jadi panas.
**Momen khas (beat 4):** sepuluh kotak listrik masuk ke bola lampu biasa; sembilan berubah koral dan menguap jadi uap panas, satu jadi kuning (cahaya). Di LED, kotaknya masuk lewat chip kecil dan hampir semuanya jadi cahaya (penyederhanaan visual).

## Lapisan viral (hook)
- (a) Bantahan: "Lampu LED itu sebenarnya nggak lebih terang."
- (b) Personal: "Lampu di rumahmu, sembilan dari sepuluh bagian listriknya jadi panas."
- (c) Kontras ← **dipilih**: "Lampu LED sembilan watt bisa seterang lampu biasa tujuh puluh lima watt. Kok bisa?"
Alasan: (c) langsung memicu "kok bisa?" dan jujur pada pertanyaan penonton ("kenapa LED lebih terang"); bantahan (a) dipakai sebagai beat 2 supaya premisnya diluruskan.

## Fakta, tren & asumsi
- **Premis diluruskan:** terang diukur dalam lumen, bukan watt; watt = daya listrik yang dipakai. LED dengan lumen sama memakai watt jauh lebih kecil [✓ Energy.gov].
- **Setara terang:** lampu ±1.100 lumen (setara pijar 75 W) bisa dicapai LED yang memakai serendah 9 W [✓ Energy.gov, konsumen "lumens & lighting facts"; ES-EE Lighting 2021].
- **Efikasi (lumen per watt):** pijar 60 W ±16 lm/W, kisaran 13–18; LED ±83 lm/W pada angka EIA lama (LED modern sering lebih tinggi) [✓ EIA Today in Energy #15471]. Hitung sendiri 1.100 lm ÷ 75 W ≈ 15 lm/W dan 1.100 ÷ 9 ≈ 122 lm/W. VO memakai **"sekitar lima belas lumen" vs "delapan puluh lebih"** → rasio ±5× **(perkiraan)**.
- **Panas:** lampu pijar mengubah ±90–95% listrik jadi panas/inframerah, hanya ±5–10% jadi cahaya tampak [✓ Penn State EGEE 102 (±5%); ENERGY STAR (±10%)]. VO: "dari sepuluh bagian, sembilan jadi panas" **(perkiraan)**.
- **Mekanisme:** pijar membuat cahaya dengan memanaskan filamen sampai membara; LED memancarkan cahaya langsung dari semikonduktor (chip) tanpa dipanaskan membara [✓ pengetahuan umum; sumber pencarian hanya mengonfirmasi gambaran besar].
- **Tren YouTube:** belum dicek (cek tren dilakukan sesudah ACC bila diperlukan). Tidak ada angka tayangan dalam draf ini.
- Penyederhanaan visual: kotak "listrik" menggambarkan pembagian energi secara kasar; LED tidak 100% jadi cahaya (sebagian juga jadi panas, tidak digambar presisi).
- Sengaja tidak dibahas: warna suhu cahaya (kuning/putih), CRI, umur lampu, CFL, driver LED.
- Sumber utama: [EIA](https://www.eia.gov/TODAYINENERGY/detail.php?id=15471) · [Energy.gov Lighting 2021 (PDF)](https://www.energy.gov/sites/default/files/2021-08/ES-EE%20Lighting_080921.pdf) · [Penn State EGEE 102](https://www.e-education.psu.edu/egee102/node/2037).

## Teks TTS (versi humanis, ±160 kata, ±68–72 dtk)
1. Lampu LED sembilan watt bisa seterang lampu biasa tujuh puluh lima watt. Kok bisa sehemat itu?
2. Sebenarnya LED nggak menyala lebih terang. Terang itu diukur pakai lumen, bukan watt. Watt cuma nunjukin seberapa banyak listrik yang dipakai.
3. Lampu biasa bikin cahaya dengan memanaskan kawat kecil sampai membara. Dari sepuluh bagian listrik, sembilan jadi panas. Cuma satu yang jadi cahaya.
4. Makanya lampu biasa panas banget. Itu listrik yang kebuang percuma.
5. LED beda. Cahayanya keluar langsung dari chip kecil, tanpa harus dipanaskan sampai membara. Panas yang kebuang jauh lebih sedikit.
6. Hasilnya, satu watt lampu biasa cuma ngasih sekitar lima belas lumen. Satu watt LED bisa delapan puluh lumen lebih. Sekitar lima kali lipat.
7. Jadi LED bukan lebih terang. Dia cuma lebih pintar pakai listrik.
8. Waktu beli lampu, lihat angka lumen di dusnya, bukan wattnya. Sebelas ratus lumen kira-kira seterang lampu biasa tujuh puluh lima watt.
9. Lampu di rumahmu sekarang LED semua, atau masih ada yang kuning dan panas? Follow buat fakta rumah berikutnya!

## Beat (kunci timing final dibuat dari `words.json` lewat `node tools/animatic.mjs 14 --md` setelah VO)
| # | dtk (perkiraan) | Judul | Teks layar | VO | Visual / kamera 2,5D | SFX |
|---|---|---|---|---|---|---|
| 1 | 0–5 | Hook | Lampu 9 watt = lampu 75 watt? / KOK BISA? | TTS 1 | Dua bola lampu kertas bersebelahan sama terang; meteran watt kiri 75, kanan 9. Zoom pelan. | Klik lampu ×2 |
| 2 | 5–14 | Bantahan | Terang itu lumen, / BUKAN WATT | TTS 2 | PatternBreak koral, stempel "BUKAN LEBIH TERANG"; lalu dua label: LUMEN (cahaya) vs WATT (listrik). | Stempel |
| 3 | 14–24 | Lampu biasa | Kawat dipanaskan / SAMPAI MEMBARA | TTS 3 | Cutaway bola lampu; filamen memerah. | Hum, desis panas |
| 4 | 24–33 | **Momen khas** | 9 dari 10 / JADI PANAS (perkiraan) | TTS 3b–4 | Sepuluh kotak listrik masuk; sembilan jadi koral menguap, satu kuning. Kamera zoom ke uap panas. | Tick ×10, riser |
| 5 | 33–42 | LED | Cahaya langsung / DARI CHIP | TTS 5 | Penampang LED: chip kecil menyala, hampir tanpa uap. | Chime lembut |
| 6 | 42–53 | Angka | ±15 vs 80+ lumen per watt / ±5× LEBIH HEMAT (perkiraan) | TTS 6 | Dua batang: pendek 15, panjang 80+. | Tick naik |
| 7 | 53–58 | Payoff | LED bukan lebih terang, / TAPI LEBIH PINTAR | TTS 7 | TwoTier. | Chime |
| 8 | 58–66 | Aksi | Cek angka LUMEN / BUKAN WATT | TTS 8 | Dus lampu kertas, jari menunjuk "1100 lm ≈ 75 W". | Klik, pop |
| 9 | 66–70 | Ajak + CTA | LED semua? · FOLLOW | TTS 9 | Dua tombol "LED SEMUA" / "MASIH ADA YANG PANAS"; kartu FOLLOW. | Tiga chime |

## Penanda
- **Payoff:** "Jadi LED bukan lebih terang. Dia cuma lebih pintar pakai listrik."
- **Pemicu share:** beat 8 (aksi cek lumen) dan beat 9 (pilih pihak).
- **Peringatan hook:** hook menyebut "sembilan watt = tujuh puluh lima watt" (angka Energy.gov); beat 6 memakai angka EIA, sehingga rasio kasar (perkiraan) dan ditandai di layar.
