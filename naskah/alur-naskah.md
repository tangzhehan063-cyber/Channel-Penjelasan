# Alur naskah: STYLE PENGETAHUAN (seri "fakta rumah")

Alur ini meneruskan cara kerja 4 video pertama (referensi di `referensi/`), dengan tambahan dari ScriptForge. Semua visual memakai gaya editorial 3D di `style/style.md` + kit aset di `style/aset.md`.

## Identitas konten (dari video #1–#4)
- Seri **"fakta rumah"**: benda & sistem di rumah sehari-hari (bata, semen, meteran listrik, keramik → berikutnya: pipa, atap, kabel, kulkas, cat, kloset, genteng, dsb.).
- Audiens **35+** (pemilik rumah, tukang, bapak-ibu). Bahasa **santai**: "nggak", "kayak", "Nah", "-mu", "Pernah perhatiin?". Tanpa istilah teknis yang tidak dijelaskan.
- Durasi **50–60 dtk** (keputusan user 12 Nov), beat menyesuaikan, 9:16. Penomoran video berlanjut (berikutnya **#5**).
- Penutup tetap: **"Follow buat fakta rumah berikutnya!"**

> **Lapisan viral:** saat Tahap 1–2, terapkan juga skill `.claude/skills/naskah-viral/SKILL.md` (hook 3 alternatif, isi berlapis, payoff, pemicu share, tanda [⚠ CEK]). Dasar data: `riset/2026-11-08-bedah-10-video-viral.md`.

## Tahap 1: Ide
1. Beri **10 ide** dalam seri fakta rumah (format ScriptForge langkah 2: judul ≤ 60 karakter + satu baris hook/alasan orang klik). Campur format: "kenapa…", "cara … bekerja", "mitos vs fakta", "bahaya yang nggak kelihatan".
2. **Cek tren** untuk ide unggulan: cari video serupa di Facebook (ScrapeMedsos `v1_facebook_search_videos`) dan catat judul + jumlah tayangan sebagai bukti. Jangan mengarang angka tayangan.
3. **Selalu sertakan saran improvisasi** per topik (permintaan user): ubah sudut ke masalah yang terlihat penonton, mitos yang bisa dipatahkan, mini-seri, atau sudut berbeda dari kompetitor (mis. @howcomeid). Beri satu rekomendasi utama + alasan.
4. Simpan hasil riset ke `riset/<tanggal>-ide-video-N.md`.
5. User memilih satu.

## Tahap 2: Storyboard draft (artifact/halaman, seperti video #1–#4)
Header: `STORYBOARD · VIDEO #N · TAHAP 2 · DRAFT`, durasi sementara, "VO Bahasa Indonesia santai · audiens 35+ · CTA follow · seri fakta rumah", catatan safe zone (15% atas, 20% bawah; subtitle tepat di atas garis bawah).

**Bagian "Fakta, tren & asumsi"** (wajib, sebelum beat):
- Tren (judul video serupa + jumlah tayangan).
- Setiap angka/klaim + sumbernya (standar, jurnal, lembaga, tarif resmi beserta periodenya).
- Mana yang **perkiraan** (ditandai "(perkiraan)" di layar), mana yang **penyederhanaan visual**, apa yang **sengaja tidak dibahas** supaya singkat.
- Kalimat VO yang sengaja dibuat aman ("sekitar seribu empat ratusan").

**Tabel beat:** `# | detik | judul | teks layar | VO | visual | SFX`.

### Rumus beat (framework v2, 12 Nov: `framework/content-framework-3-channel-v2.md`)
Total **50–60 dtk ≈ 115–140 kata** (Riri ±2,3 kata/dtk). Waktu boleh bergeser beberapa detik, batas durasi tetap.
| Bagian | Detik | Fungsi | Pola VO |
|---|---|---|---|
| 1 Hook | 0–4 | Pertanyaan, mitos, atau salah kaprah; tanpa intro | Klaim mengejutkan tentang benda di rumahmu / "Pernah perhatiin? …" |
| 2 Masalah / mitos | 4–12 | Kenapa anggapan itu penting, apa dampaknya | "Banyak yang kira … Salah!" / "Kalau dibiarkan, …" |
| 3 Penjelasan | 12–30 | Fakta bertahap, 2–3 beat, tiap beat 1 ide + 1 angka | Kalimat pendek; tutup beat dengan "Tapi…", "Nah…" |
| 4 Demonstrasi + momen khas | 30–45 | Simulasi / cutaway / exploded view / perbandingan; 1 signature shot | Narasi mengikuti gambar, bukan mengulang |
| 5 Payoff | 45–55 | Jawaban yang dijanjikan di hook | 1 kalimat takeaway (TwoTier) |
| 6 Aksi + CTA | 55–60 | 1 tindakan praktis ("cek ini sebelum beli") atau pertanyaan pilih pihak, lalu "Follow buat fakta rumah berikutnya!" | Pemicu share di sini |

Sub-format (struktur di atas tetap): **Hitung Rumah** (angka → cara hitung → twist → aksi), **VS dua kubu**, **Bukan Sial / Bukan Hantu**, **Bongkar Barang**.

**Teks layar** selalu 2 baris: `kalimat kecil / KATA BESAR` (contoh: `Kena panas, keramik / MEMUAI`), opsional kartu angka (`± 1 mm memanjang`).

## Tahap 3: Naskah final + suara
- Rapikan VO jadi teks TTS (angka ditulis sebagai kata). Suara: ElevenLabs (default Riri Rida) **atau** Google AI Studio bila user memilih; suara dipakai **tanpa diolah**, lalu **animasi mengikuti suara** (durasi beat diambil dari timestamp kata).
- Timestamp: ElevenLabs Scribe → `tools/scribe_to_timeline.py` (angka jadi numeral di subtitle).

## Tahap 4–5: Animasi & render (style pengetahuan)
Kosakata visual per beat (kode di `remotion/src/aset/Aset.tsx`, katalog di `style/aset.md`):
| Beat | Aset yang dipakai |
|---|---|
| Hook | Objek 3D utama dipotong tepi layar + **TikTokBox** (pertanyaan hook, muncul kata per kata) + bayangan teralis/daun samar (**ShadowCast**) |
| Mekanisme | Penampang 3D terbelah (cutaway) + **Callout** label garis tipis + kartu angka bersih; **LightBeam** untuk panas/cahaya/aliran |
| Mitos / twist | **PatternBreak**: layar koral penuh + grain + teks putih tebal (maks. 1× per video) |
| Ajak cek | **PuzzleGrid** "cari yang beda" (ubin/bata/huruf) sebagai jeda interaktif (maks. 1× per video) |
| Takeaway | **TwoTier** `kalimat kecil / KATA BESAR` abu gelap, kata kunci koral |
| CTA | Kartu FOLLOW koral + ornamen **Cutout** (tegel/daun) dari sudut |
| Semua | **Grain** halus (opacity ±0,05) di atas semua lapisan |
SFX: klik, whoosh lembut, pop kecil, tick, chime; tanpa SFX kertas.

## Setelah render (wajib)
Caption posting (TikTok/Reels, YouTube Shorts, komentar pin) + **cover** + dari ScriptForge: **3 judul alternatif, teks cover 2–4 kata, 5 tag, estimasi durasi**.
