# WORKFLOW cepat & hemat token (fakta rumah, Remotion)
Satu video = satu chat, ±8 langkah. **Satu chat hanya untuk repo ini.** Semua perintah dari root repo.

## 0. Awal chat (wajib, ±1 menit)
1. Baca `STATUS.md` saja. File lain hanya sesuai tahap di bawah.
2. `git fetch origin` → cabang `claude/*` yang belum masuk `main`? Merge dulu ke cabang kerja (cegah nomor video bentrok / kerja hilang).
3. Container baru: `tools/produksi.sh setup` (jalankan di background sambil menulis naskah).

## 1. Ide (bila user belum memberi topik)
- Cek dulu ide yang belum terpakai di `riset/` (tanpa kredit). Scrape Facebook hanya bila perlu (`v1_facebook_search_videos`, ≤3 kredit), simpan ringkas ke `riset/`.
- Beri 3–5 ide + 1 rekomendasi out-of-the-box. Tunggu pilihan.

## 2. Naskah (1–3 WebSearch)
- Baca `naskah/alur-naskah.md` + skill `naskah-viral` (sekali saja). Salin format `naskah/video-08-bunyi-tek-atap.md`.
- Bahasa **sederhana, tanpa istilah teknis/tukang** (permintaan user). VO ≤105 kata (Riri ±2,2 kata/dtk ≈ 50 dtk).
- Kirim teks TTS ke user dalam chat. Tunggu **ACC**.

## 3. Setelah ACC (satu giliran)
- Caption + komentar pertama dari `caption/gaya-caption.md` → `caption/<slug>.md`, tempel isinya di chat (file repo ini tidak bisa dibuka di app bila chat dimulai dari repo lain).
- ElevenLabs (koneksi yang aktif): `creative_create_flow` → `creative_generate_speech` (`eleven_v4`, Riri Rida `tCKeP99grYL9wZRg6sQ9`, angka ditulis kata). Kirim 2 take (SendUserFile), user pilih.

## 4. VO → timestamp
- `tools/produksi.sh vo <NN> "<content_url take terpilih>"`
- `creative_add_flow_asset_node` (generation_id take) → `creative_transcribe_audio` → `tools/produksi.sh words <NN> "<words_download_url>"` (mencetak kalimat + detik).

## 5. Animasi
- Salin `remotion/src/v08/` → `vNN/` (Video + Cover + objek 3D). Ganti beat `B`, kamera, judul, SFX. Daftarkan di `remotion/src/Root.tsx`.
- Gaya: `style/style.md` + `style/aset.md` hanya bila butuh aset baru.

## 6. Cek → render
- `tools/produksi.sh sheet <NN> <8–10 detik penting>` → lihat 1 gambar, cocokkan dengan **`style/cek-bug.md`**, perbaiki, kirim sheet ke user.
- User OK → `tools/produksi.sh final <NN> <slug>` (Bash `run_in_background`, ±20 mnt). **Jangan hentikan render** kecuali perubahan memang untuk video ini.
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
