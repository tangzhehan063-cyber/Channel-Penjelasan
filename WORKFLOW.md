# WORKFLOW cepat & hemat token (fakta rumah, Remotion)
Satu video = satu chat, ±8 langkah. **Satu chat hanya untuk repo ini.** Semua perintah dari root repo.

## 0. Awal chat (wajib, ±1 menit)
1. Baca `STATUS.md` saja. File lain hanya sesuai tahap di bawah.
2. `git fetch origin` → cabang `claude/*` yang belum masuk `main`? Merge dulu ke cabang kerja (cegah nomor video bentrok / kerja hilang).
3. Container baru: `tools/produksi.sh setup` (jalankan di background sambil menulis naskah).
4. **Panel Studio** (https://claude.ai/artifact/4Aiv5HDCLRRfVLdEapvt3s, slug `19a6f0e4-8170-4760-b8cc-959939f686ea`, kode `panel/index.html`): panggil `watch` (claude-artifacts) supaya tombol panel membangunkan chat ini. Perintah dari panel datang sebagai komentar "[Panel Studio] …": baca dengan `read_comments`, kerjakan, balas singkat dengan `reply_comment`.
5. Setiap pindah tahap, perbarui `aktif/sekarang` lewat `db_write` (field: nn, judul, seri, tahap 0–7 = Ide/Naskah/Suara/Animasi/Cek gambar/Render/Drive/Selesai, menunggu true saat butuh ACC di tahap 1 atau 4, `giliran` = teks bila menunggu tindakan user selain ACC; `pilihSuara: true` setelah naskah ACC = panel menampilkan pilihan suara (ElevenLabs / Gemini TTS / rekaman sendiri; rekaman tersimpan di field `voFile` = id aset, baca dengan read_asset), catatan 1 kalimat, naskah = teks TTS). Video selesai → tambah/ubah `videos/vNN` (nn, judul, seri, durasi, drive, posting). Ide baru → `ide/iNN` (urut, judul, catatan, rek); topik terpakai → `dipakai: true`. Panel juga memuat channel RAKA (koleksi berawalan `raka-`; perintah bertanda "[Panel Studio · RAKA]" dikerjakan di repo RAKA). **Referensi** dari user ada di koleksi `ref` (field url, catatan, file = id aset, tipe): baca dengan `db_list`, file dengan `read_asset`; setelah dibedah tulis temuan ke repo dan set `dibedah: true`.

6. **Mode cepat konfirmasi (keputusan user 12 Nov, berlaku semua channel):** ACC WAJIB hanya di 2 titik: (1) **naskah** (tahap 1) dan (2) **contact sheet/cek gambar** sebelum render (tahap 4). Di titik itu: unggah pratinjau ke panel (`upload_asset` ke slug panel), tulis `pratinjau: [{id, tipe, label}]` + `menunggu: true` + `catatan` di dokumen aktif channel, lalu BERHENTI sampai user ACC/revisi. Tahap lain (suara, timestamp, animasi, render, distribusi) jalan terus tanpa menunggu, tetapi hasilnya tetap diunggah sebagai pratinjau + `menunggu: false` supaya user bisa mengecek dan mengirim revisi kapan saja; revisi dikerjakan di tahap itu saja. Pesan "[Panel Studio …] … Gaya visual: X (mesin dari repo Y)" = pakai mesin gambar repo Y untuk video ini (clone repo Y bila perlu); framework berpikir tetap dari channel asal.

7. **Framework bawaan semua channel (12 Nov): `framework/content-framework-3-channel-v2.md`** (dokumen user, juga di panel sebagai "Content Framework 3 Channel (rev)"). Struktur naskah, ritme, visual, dan standar riset ikut dokumen itu; aturan repo masing-masing (DNA, suara, caption) tetap berlaku bila tidak bertentangan.

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
- **Tanya user dulu: suara pakai Gemini TTS atau ElevenLabs?** (perintah user 13 Nov; jangan pilih sendiri). Gemini → `python3 tools/gemini_tts.py` (pakai `GEMINI_API_KEY`). ElevenLabs →
- ElevenLabs (koneksi yang aktif): `creative_create_flow` → `creative_generate_speech` (`eleven_v4`, Riri Rida `tCKeP99grYL9wZRg6sQ9`, angka ditulis kata, **`generations_count: 1`**, hanya setelah naskah ACC final, pakai flow video ini bila sudah ada (lihat "Aturan hemat ElevenLabs" di CLAUDE.md; draf/tes pakai `tools/gemini_tts.py`), hemat kredit, permintaan user 11 Nov). Kirim 1 take (SendUserFile).

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
1. **Google Drive (wajib, semua video):** buat subfolder `#NN <judul singkat>` di folder "Fakta Rumah" (`1Dx9nqhifWRbixFb_2u4XrHMIaHHJloAt`), unggah cover + dokumen info (caption, komentar pin, judul/deskripsi YouTube, judul alternatif, tag). MP4 >3 MB tidak bisa lewat konektor: kirim ke user (asli + versi ringan <10 MB) untuk diunggah manual ke subfolder itu. Beri link folder.
2. Kirim ke user: MP4 + cover (SendUserFile) + caption (tempel di chat).
3. Perbarui `STATUS.md` (2–3 baris, bukan paragraf).
4. Commit + push ke cabang kerja (tanpa MP4/cover, sudah di `.gitignore`).
5. **Buat PR ke `main` lalu merge sendiri** (`merge_pull_request`, izin user 9 Nov), supaya chat berikutnya mulai dari kondisi lengkap. Laporkan singkat: "sudah masuk main".

## Hemat token
- Jangan baca JSON mentah, kode video lama, atau file yang tidak berubah; pakai `grep`/`sed -n`.
- Cek visual = 1 contact sheet per putaran; perbaikan dengan Edit/sed, bukan tulis ulang.
- Panggilan independen paralel; render & setup di background, tunggu notifikasi (tanpa polling).
- Jawaban ke user singkat: hasil, file, keputusan yang dibutuhkan.
