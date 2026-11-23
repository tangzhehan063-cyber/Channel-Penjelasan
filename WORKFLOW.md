# WORKFLOW E1 v3: dokumenter penjelasan yang diarahkan

Menggantikan E1 v2 (arsip: `arsip/WORKFLOW-E1-v2-lengkap.md`). Tujuan, hipotesis, metrik, dan keputusan lanjut/stop eksperimen ada di `e1/EVALUASI.md` (tidak berubah). Aturan keras ada di `CLAUDE.md`.

**Prinsip:** (1) cerita dan arahan visual diputuskan sebelum kode adegan; (2) kode hanya mengeksekusi keputusan yang tertulis sebagai data (`shots.json`); (3) ACC pemilik di titik murah; (4) gerbang mengukur cerita dan visual, bukan hanya mekanik, dan menilai **video yang dirender**, bukan still; (5) tahap berikutnya dilarang sebelum gerbang tahap ini lulus.

**Berkas per video** (`NN` = nomor, `slug` = judul pendek): `riset/<tgl>-<slug>.md`, `e1/NN/angle.md`, `naskah/e1-NN-<slug>.txt|md`, `e1/NN/audit-cerita.md`, `e1/NN/direction.md`, `e1/NN/shots.json`, `e1/NN/storyboard/`, `e1/NN/animatic.mp4`, `e1/NN/qa.md`, log `e1/eNN-<slug>.md` (dari `e1/_template-log.md`). Gerbang antar tahap = butir `[x]` di log; tahap sebelumnya belum `[x]` → berhenti.

Keputusan visual (tahap 5–8) memakai skill **`visual-director`**. Skill itu berisi cara memutuskan, bukan daftar istilah.

---

## 1. Riset
- **Input:** topik dari user.
- **Tugas:** pisahkan *yang orang tahu / yang tidak pasti / yang mengejutkan / salah kaprah / bukti visual*. Minimal 2 sumber tepercaya per klaim utama; angka hanya dari sumber. Tandai `[CEK]` bila belum terverifikasi. Catat juga apa yang **bisa dilihat**: foto nyata yang membuktikan (nama berkas + spesifikasi untuk dicari user), struktur tak terlihat yang bisa dibongkar 3D.
- **Output:** `riset/<tgl>-<slug>.md`.
- **Kualitas:** tiap klaim utama bersumber; tidak ada angka karangan; ada ≥1 bukti visual atau mekanisme yang bisa ditampilkan.
- **Selesai bila:** klaim utama terverifikasi atau ditandai. (ScrapeMedsos disimpan ringkas di `riset/`.)

## 2. Sudut cerita (`e1/NN/angle.md`, 1 halaman)
- **Input:** riset.
- **Tugas:** tulis: pertanyaan sentral; celah rasa ingin tahu; apa yang penonton **kira** (ekspektasi yang akan dibalik); **wahyu utama** (1 kalimat); progres emosi (mis. heran → cemas → paham → lega); potensi visual (apa yang hanya bisa ditunjukkan lewat gambar); penutup (callback ke pembuka).
- **Output:** `angle.md`.
- **Kualitas:** wahyu tidak bisa disampaikan cukup dengan kalimat saja (butuh visual); ada kejutan, bukan hanya fakta; satu cerita, bukan daftar fakta.
- **Selesai bila: ACC pemilik** (topik + sudut). Tidak ada naskah sebelum ini.

## 3. Naskah
- **Input:** angle.
- **Tugas:** skill `script-writer`. Tulis untuk telinga, hook tanpa pengantar, ungkap bertahap, 110–155 kata (50–70 dtk), CTA tetap. Angka ditulis dengan kata (TTS).
- **Output:** draf `naskah/e1-NN-<slug>.txt` + `.md` (fakta pendukung per klaim).
- **Kualitas:** tiap kalimat punya tujuan; tidak ada pengulangan; tidak ada kalimat yang hanya mengulang apa yang sudah terlihat.
- **Selesai bila:** draf lengkap. Belum dikunci.

## 4. Audit cerita (`e1/NN/audit-cerita.md`)
- **Tugas:** jawab tertulis: (a) apakah 3 detik pertama menciptakan pertanyaan? (b) kenapa penonton lanjut di detik 10, 25, 40? (c) adakah wahyu bocor terlalu dini? (d) bagian tengah: ada progres atau hanya penjelasan datar? (e) tiap beat: peluang visual apa (apa yang dilihat penonton yang tidak diucapkan)? (f) penutup menggema pembuka? (g) kalimat mana dibuang tanpa kehilangan apa pun?
- **Output:** naskah revisi + `audit-cerita.md`.
- **Kualitas:** setiap beat penting punya peluang visual; kalimat pengisi dibuang.
- **Selesai bila:** semua pertanyaan terjawab dan naskah direvisi sesuai.

## 5. Arahan visual (`e1/NN/direction.md`)
- **Input:** naskah revisi. **Skill:** `visual-director`, prosedur "Memutuskan mode tiap beat".
- **Tugas:** per beat tulis: apa yang **dilihat**, dirasakan, dipahami penonton; mode (footage / 2D / 3D / tipografi / data / hening) **dan alasannya**; apa yang baru bergerak/berubah; peran teks (atau tanpa teks). Tentukan: 1 *signature shot*, 1 momen hening, 1 pemutus pola, ritme (cepat vs napas). Tandai foto nyata yang dibutuhkan (nama berkas + spesifikasi) untuk dicari user.
- **Output:** `direction.md`.
- **Kualitas:** tidak ada dua beat berurutan bermode dan tata letak sama tanpa alasan; ada beat tanpa animasi baru; tiap foto punya peran (bukti / konteks / titik masuk ke 3D), bukan dekorasi; informasi bisa dipahami tanpa subtitle.
- **Selesai bila:** tiap beat punya mode + alasan; daftar foto dikirim ke user.
- Boleh kembali ke tahap 3–4 bila arahan visual menuntut naskah berubah.

## 6. Shot list (`e1/NN/shots.json`)
- **Tugas:** tulis spesifikasi tiap shot sebagai data. Skema + contoh: skill `visual-director/style/visual/shots-skema.md`. Kamera dan gerak subjek terpisah; cue terikat ID kalimat (bukan detik hard-coded), supaya VO baru tidak merusak waktu.
- **Output:** `shots.json`.
- **Gerbang:** `python3 tools/cek_shots.py e1/NN/shots.json` lulus (skema lengkap, durasi menutup VO, ≥4 jenis gerak kamera, ≥3 mode, tidak ada dua shot berurutan identik, ada shot hening, footage punya `relasi_narasi`).
- **Selesai bila:** validator lulus.

## 7. Storyboard
- **Tugas:** render frame kunci tiap shot (awal / puncak / akhir gerak) dengan renderer nyata dan aset sementara; gabung per-shot jadi strip. Bukan sketsa abstrak.
- **Output:** `e1/NN/storyboard/` (strip + `index.md` berisi 1 kalimat per shot: apa yang dilihat dan kenapa).
- **Kualitas:** komposisi bervariasi (bukan semua objek di tengah); satu fokus per frame; arah gerak layar konsisten; teks terbaca di HP.
- **Selesai bila: ACC pemilik.**

## 8. Animatic
- **Tugas:** video kasar resolusi rendah: VO uji, waktu shot, gerak kamera, transisi, visual sementara. `python3 tools/animatic.py e1/NN/shots.json --vo audio/x.wav -o e1/NN/animatic.mp4`. Tonton sebagai urutan (bukan still): adakah shot terlalu lama/cepat, ritme kontras?
- **Output:** `animatic.mp4` + catatan perbaikan.
- **Selesai bila: ACC pemilik.** Naskah **dikunci** di sini.

## 9. Produksi
- **Tugas:** implementasikan shot sesuai `shots.json` (renderer data `remotion/src/e1/lib/`; shot yang butuh adegan khusus boleh berupa komponen sendiri). VO final (tanya Gemini/ElevenLabs), `tools/align_teks.py`, desain suara (ada lapis selain VO: ambience/SFX/hening disengaja).
- **Gerbang sebelum render:** `cek_shots.py`, `node tools/cek-mandiri.mjs`, `python3 tools/cek_kilau.py <Komposisi> --dur N`, `python3 tools/cek_suara.py audio/x.wav --kata N`, `tsc` bersih.
- **Selesai bila:** semua lulus, build tanpa galat. Render penuh butuh ACC bila besar.

## 10. Visual QA dan publikasi
- **Tugas:** `python3 tools/review_video.py out/x.mp4 --shots e1/NN/shots.json` menghasilkan strip frame, rasio frame diam, deteksi hentakan, ringkasan variasi. **Lalu tonton hasilnya** (strip + klip hook, titik balik, penutup) dan isi `e1/NN/qa.md`.
- **Daftar periksa (jawab tertulis, jujur):**
  1. Framing menarik? Ada shot yang tampak generik?
  2. Tiap gerak kamera punya alasan? Ada gerak tanpa tujuan?
  3. Visual terasa hidup, atau tampak seperti presentasi/slide?
  4. Transisi punya hubungan dengan cerita?
  5. Ada shot terlalu lama/cepat? Ada yang seharusnya diam?
  6. Ada yang terlalu ramai? Hierarki jelas (satu fokus)?
  7. Informasi dapat dipahami tanpa subtitle?
  8. Foto nyata berperan (bukan dekorasi); transisi footage↔3D menjelaskan hubungan objek nyata dan mekanisme?
  9. Variasi: ≥4 jenis kamera, ≥3 mode, tidak ada dua shot berturut-turut bertata letak sama.
  10. Suara: lapis selain VO; loudness −15..−13 LUFS (`ffmpeg ... loudnorm`).
  11. Fakta: tiap klaim bersumber; ilustrasi tidak menyesatkan; `[CEK]` terselesaikan.
- **Gagal →** perbaiki shot terkait (bukan tambal teks), render ulang bagian itu. Kegagalan di butir 3 → kembali ke tahap 5.
- **Publikasi** (hanya setelah ACC): caption + komentar pin (humanizer), cover, simpan ke Drive, kirim MP4 ke user.
- **Selesai bila:** semua butir lulus atau diperbaiki dengan bukti, dan pemilik ACC publikasi.

---

## Sumber daya dan kerja
- Render lambat (swangle ±10 mnt per ±58 dtk): periksa lewat still dan klip pendek dulu (`remotion still`, `--frames=a-b`), render penuh sekali. Render di latar belakang; satu notifikasi selesai.
- Percepat putaran revisi di tahap murah (storyboard, animatic), bukan setelah render.
- Log per video: `e1/_template-log.md`. Catat waktu render, jumlah putaran revisi, dan **apa yang gagal**.
- Perbarui `STATUS.md`; commit dan push ke cabang kerja (bukan `main`).
- Bug baru → `style/cek-bug.md`.
