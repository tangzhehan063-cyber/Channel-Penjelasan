---
name: naskah-viral
description: Menulis atau memperkuat naskah video seri "fakta rumah" dengan pola dari 10 video viral info rumah (hook bantahan, isi berlapis, payoff, pemicu share, cek fakta). Pakai saat membuat ide, storyboard Tahap 2, atau merevisi naskah agar lebih viral; dipanggil dengan /naskah-viral <topik>.
---

# Naskah viral: lapisan di atas alur naskah channel

Skill ini TIDAK menggantikan `naskah/alur-naskah.md`. Ikuti alur itu (Tahap 1–5, rumus 10 beat, bagian "Fakta, tren & asumsi", teks layar 2 baris, penutup "Follow buat fakta rumah berikutnya!"), lalu terapkan aturan tambahan di bawah. Kalau bertentangan, aturan di `CLAUDE.md` dan `alur-naskah.md` menang.

Dasar data: `riset/2026-11-08-bedah-10-video-viral.md` (10 video TikTok info rumah, 1–22 jt views).

## Input
`/naskah-viral <topik> [mode] [durasi]`
- **Mode** (default HYBRID):
  - **REACH**: dibuka dengan cerita/keanehan/kisah nyata untuk mengejar views dan penonton baru. Data: video cerita dapat 14–22 jt views, tapi share rate cuma 0,1–0,2%.
  - **SHARE**: penjelasan "kenapa X terjadi" untuk mengejar share, save, dan follower. Data: share rate 0,6–1,0%, 4–9× lebih tinggi.
  - **HYBRID**: hook bergaya cerita/keanehan, isinya mekanisme teknis. Ini mode yang paling cocok dengan identitas channel.
- **Durasi**: default 38–45 dtk sesuai alur. Boleh sampai 60 dtk HANYA kalau isinya daftar bernomor yang tiap beat-nya membawa lapisan baru (video 2 menit dengan 6 aturan tetap dapat like rate 8,8%).
- Patokan tempo VO: ±2,5 kata per detik.

## Aturan tambahan per beat (dipetakan ke rumus 10 beat)

**Beat 1, Hook (≤3 dtk).** Tulis 3 alternatif, pilih satu, dan beri alasannya dalam 1 kalimat:
- (a) **Bantahan**: "[yang dianggap benar], padahal [kenyataan]". Contoh pola: "Genteng utuh, tapi atap masih bocor."
- (b) **Ketakutan personal & spesifik**: harus memakai "rumahmu" atau "-mu" dan menyebut akibat nyata. Contoh pola: "Besi kolommu besar, tapi kalau begelnya ditekuk 90°, kolomnya bisa pecah saat gempa."
- (c) **Kontras**: dulu vs sekarang, negara lain vs kita, mahal vs murah. Contoh pola: "Rumah Belanda adem tanpa AC, rumah sekarang kayak oven."

**Beat 2, Janji struktur.** Selain "Ini bukan mistis. Ini fisika.", boleh memakai janji panjang isi: "Ada 3 penyebab, yang ketiga paling sering…" atau "Kita bongkar lapis demi lapis." Tujuannya agar penonton tahu isi masih ada.

**Beat 3–6, Mekanisme berlapis.**
- Tiap beat berisi satu masalah → satu solusi/penjelasan → memancing masalah berikutnya ("Tapi…", "Nah…").
- Wajib satu angka konkret per beat (sudah ada di alur). Angka adalah alasan orang menyimpan video.
- Boleh satu analogi sehari-hari per video ("kayak tisu dicelup air", "kayak sisik ikan").
- Format **"bongkar lapis"** (cutaway 3D yang dibuka lapis per lapis) adalah terjemahan khas channel ini untuk format "bangun dari nol" milik @howcomeid. Jangan meniru alur atau kalimat mereka.

**Beat mitos → naikkan jadi "dua pendapat".** Kalau ada dua anggapan populer yang bertentangan (contoh: lubang angin atas "percuma" vs "kunci rumah adem"), tampilkan keduanya, lalu jelaskan kapan masing-masing benar. Ini memancing debat di komentar tanpa membuat kita terlihat salah.

**Beat twist/payoff.** Tulis satu kalimat yang bisa dikutip orang saat membagikan video: "Jadi yang bikin [X] bukan [A], tapi [B]."

**Beat solusi.** Minimal satu aksi yang bisa disuruh ke tukang/mandor atau dicek hari ini, ditulis sebagai kalimat perintah konkret.

**Pemicu share (mode SHARE/HYBRID).** Sisipkan satu kalimat (di beat solusi atau ajak cek) yang menyebut siapa yang perlu tahu info ini, tanpa kata "share". Contoh: "Yang lagi bangun rumah, cek ini sebelum dicor."

**Beat 9, Ajak cek → CTA dua arah.** Pertanyaan personal yang gampang dijawab di komentar ("Rumahmu panas di bagian mana?"). Kalau topiknya bagian dari mini-seri, boleh diganti umpan series ("Habis ini mau kita bongkar apa?"). Beat 10 tetap "Follow buat fakta rumah berikutnya!"

## Gaya VO (tambahan)
- DILARANG: "menurutku", "kayaknya", pengulangan kalimat, basa-basi pembuka, "Tahukah kamu", "Yuk simak", "di era modern ini".
- Nada yakin seperti orang yang paham lapangan, bukan dosen. Kalimat ≤10 kata per baris.
- Humor maksimal satu, ringan, dan tidak merendahkan tukang atau penonton.

## Cek fakta (memperkuat bagian "Fakta, tren & asumsi")
Setiap klaim di naskah diberi tanda di bagian fakta storyboard:
- **[✓ sumber]**: ada sumber (standar/SNI, jurnal, lembaga, produsen) dan sudah dicantumkan.
- **[⚠ CEK]**: belum terverifikasi (harga, durasi pembangunan, nama perusahaan, nominal dalam kisah nyata, klaim "90% orang"). Naskah TIDAK boleh ACC final selama masih ada [⚠ CEK].
- **(perkiraan)** dan **penyederhanaan visual**: sama seperti alur.
Pelajaran dari riset: video viral 3D print (24 jam, Rp1 juta/m²) dan kisah rumah dikelilingi jalan ($200.000) memuat angka yang meragukan. Jangan mengulang angka itu tanpa sumber.

## Output (selain tabel beat standar)
1. 3 alternatif hook + pilihan + alasan
2. Mode yang dipakai + alasan singkat
3. Tabel beat standar alur (`# | detik | judul | teks layar | VO | visual | SFX`); kolom visual memakai kosakata aset di `style/aset.md` (TikTokBox untuk hook, PatternBreak untuk mitos/twist, PuzzleGrid untuk ajak cek)
4. Payoff satu kalimat, tips aksi, pemicu share, dan CTA, ditandai jelas
5. Daftar [⚠ CEK] yang masih harus diverifikasi
6. 2 ide judul lanjutan untuk mini-seri
Caption & komentar pertama tetap mengikuti aturan "Caption & komentar pertama" di `CLAUDE.md` (riset bahasa manusia lewat ScrapeMedsos Facebook dulu, tulis ringkas).

## Checklist sebelum menyerahkan draft
- [ ] Hook ≤3 dtk dan membantah/menakuti/mengontraskan, bukan memperkenalkan
- [ ] Tiap beat mekanisme punya angka + transisi ke beat berikutnya
- [ ] Ada payoff satu kalimat yang bisa dikutip
- [ ] Ada satu aksi konkret + pemicu share
- [ ] Tidak ada frasa terlarang
- [ ] Semua klaim punya sumber atau ditandai [⚠ CEK] / (perkiraan)
- [ ] Durasi sesuai ±2,5 kata/detik
