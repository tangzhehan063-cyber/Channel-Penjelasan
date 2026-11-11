# WORKFLOW cepat & hemat token (fakta rumah, Remotion)
Satu video = satu chat, ±8 langkah. **Satu chat hanya untuk repo ini.** Semua perintah dari root repo.

## 0. Awal chat (wajib, ±1 menit)
1. Baca `STATUS.md` saja. File lain hanya sesuai tahap di bawah.
2. `git fetch origin` → cabang `claude/*` yang belum masuk `main`? Merge dulu ke cabang kerja (cegah nomor video bentrok / kerja hilang).
3. Container baru: `tools/produksi.sh setup` (jalankan di background sambil menulis naskah).

## 1. Ide (bila user belum memberi topik)
- Cek dulu ide yang belum terpakai di `riset/` (tanpa kredit). Scrape YouTube hanya bila perlu (`v1_youtube_search`/`v1_youtube_shorts_trending`, `v1_youtube_video_comments`; dulu Facebook: ≤3 kredit), simpan ringkas ke `riset/`.
- Beri 3–5 ide + 1 rekomendasi out-of-the-box. Tunggu pilihan.

## 2. Naskah (1–3 WebSearch)
- Baca `naskah/alur-naskah.md` + skill `naskah-viral` (sekali saja). Salin format `naskah/video-08-bunyi-tek-atap.md`.
- Bahasa **sederhana, tanpa istilah teknis/tukang** (permintaan user). Durasi **fleksibel, naik bertahap** (user ingin menuju video panjang); patokan Riri ±2,2 kata/dtk. Naskah dari user tidak dipotong.
- **Sutradara** (skill `sutradara`, bagian B+D): logline 1 kalimat, 1 momen khas di puncak, kolom shot list (framing, gerak kamera + alasan) di tabel beat.
- Kirim teks TTS ke user dalam chat. Tunggu **ACC**.

## 3. Setelah ACC (satu giliran)
- Caption + komentar pertama dari `caption/gaya-caption.md` → `caption/<slug>.md`, tempel isinya di chat (file repo ini tidak bisa dibuka di app bila chat dimulai dari repo lain).
- ElevenLabs (koneksi yang aktif): `creative_create_flow` → `creative_generate_speech` (`eleven_v4`, Riri Rida `tCKeP99grYL9wZRg6sQ9`, angka ditulis kata). Kirim 2 take (SendUserFile), user pilih.

## 4. VO → timestamp
- `tools/produksi.sh vo <NN> "<content_url take terpilih>"`
- `creative_add_flow_asset_node` (generation_id take) → `creative_transcribe_audio` → `tools/produksi.sh words <NN> "<words_download_url>"` (mencetak kalimat + detik).

## 5. Animasi
- Salin `remotion/src/v08/` → `vNN/` (Video + Cover + objek 3D). Ganti beat `B`, kamera (dari shot list, ≥4 jenis gerak, skill `sutradara`), judul, SFX. Daftarkan di `remotion/src/Root.tsx`.
- Gaya: `style/style.md` + `style/aset.md` hanya bila butuh aset baru.

## 6. Cek → render
- `tools/produksi.sh sheet` otomatis menjalankan `node tools/cek-sutradara.mjs <NN>` (ritme, kamera, waktu baca, jeda sunyi): GAGAL wajib diperbaiki.
- `tools/produksi.sh sheet <NN> <4–6 detik penting>` (putaran berikutnya cukup frame yang diubah) → lihat 1 gambar, cocokkan dengan **`style/cek-bug.md`**, perbaiki, kirim sheet ke user.
- User OK → `tools/produksi.sh bagian <NN> <slug>` (Bash `run_in_background`): render per potongan 15 dtk tanpa suara, suara dicampur langsung oleh `tools/mix-audio.mjs` (detik, bukan menit), lalu −14 LUFS + SRT + QC. **Revisi = hapus `remotion/out/parts-vNN/pXX.mp4` yang berubah lalu jalankan ulang** (bagian lain dipakai lagi). `final` = cara lama render utuh.
- Lihat sheet QC yang dicetak (1 gambar). `tools/produksi.sh cover <NN> <slug>`.

## 7. Distribusi (wajib, urut)
1. Kirim ke user: MP4 + cover (SendUserFile) + caption (tempel di chat).
2. Perbarui `STATUS.md` (2–3 baris, bukan paragraf).
3. Commit + push ke cabang kerja.
4. **Buat PR ke `main` lalu merge sendiri** (`merge_pull_request`, izin user 9 Nov), supaya chat berikutnya mulai dari kondisi lengkap. Laporkan singkat: "sudah masuk main".

## Hemat token
- Jangan baca JSON mentah, kode video lama, atau file yang tidak berubah; pakai `grep`/`sed -n`.
- Cek visual = 1 contact sheet per putaran; perbaikan dengan Edit/sed, bukan tulis ulang.
- Panggilan independen paralel; render & setup di background, tunggu notifikasi (tanpa polling).
- Jawaban ke user singkat: hasil, file, keputusan yang dibutuhkan.
