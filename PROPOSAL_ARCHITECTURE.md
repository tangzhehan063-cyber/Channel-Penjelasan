# PROPOSAL_ARCHITECTURE: revisi workflow dan skill (Stage 2, 23 Nov 2026)

Dasar: `AUDIT_REPORT.md`. Belum ada berkas produksi yang diubah. Dokumen ini menunggu persetujuan sebelum Stage 3.

## 1. Prinsip desain
1. **Cerita dan arahan visual diputuskan sebelum kode adegan.** Kode hanya mengeksekusi keputusan yang sudah tertulis sebagai data (shot list).
2. **Persetujuan pemilik di titik murah:** angle, storyboard, animatic. Bukan di render akhir.
3. **Satu sumber kebenaran per hal**: arah aktif di `CLAUDE.md`, proses di `WORKFLOW.md`, keputusan visual di skill `visual-director`.
4. **Gerbang kualitas mengukur cerita dan visual, bukan hanya mekanik**, dan menonton video yang dirender, bukan still.
5. **Tidak ada tahap berikutnya sebelum tahap sekarang lulus gerbangnya.**

## 2. Pipeline baru (10 tahap, tiap tahap punya Input, Tugas, Output, Kriteria, Selesai)

| # | Tahap | Input | Tugas | Output | Kriteria kualitas | Selesai bila |
|---|---|---|---|---|---|---|
| 1 | Riset | topik | tahu/tidak pasti/mengejutkan/salah kaprah/bukti visual; sumber tepercaya | `riset/<id>.md` (klaim + status [CEK]) | tiap klaim utama ada sumber; tidak ada angka karangan | klaim utama terverifikasi atau ditandai |
| 2 | Sudut cerita | riset | pertanyaan sentral, celah rasa ingin tahu, ekspektasi penonton, wahyu utama, progres emosi, potensi visual, penutup | `angle.md` (1 halaman) | wahyu tidak bisa diucapkan saja (butuh visual); ada kejutan | **ACC pemilik** (topik + angle) |
| 3 | Naskah | angle | tulis untuk telinga; hook tanpa pengantar; ungkap bertahap | draf `naskah/<id>.txt` | tiap kalimat punya tujuan; tanpa pengulangan | draf lengkap |
| 4 | Audit cerita | draf | uji: pembuka, alasan lanjut, bocor terlalu dini, bagian tengah, peluang visual tiap beat, penutup; buang kalimat | naskah revisi + `audit-cerita.md` | tiap beat penting punya peluang visual; kalimat pengisi dibuang | semua pertanyaan audit terjawab |
| 5 | Arahan visual | naskah revisi | per beat: apa yang dilihat/dirasa/dipahami; footage, 2D, 3D, tipografi, diagram, atau hening | `direction.md` | tidak ada dua beat berurutan bermode sama tanpa alasan; ada beat tanpa animasi baru | tiap beat punya mode dan alasan |
| 6 | Shot list | direction | spesifikasi shot lengkap sebagai data | `shots.json` + validasi `tools/cek_shots.py` | skema lengkap; kamera dan gerak objek terpisah; cue terikat ID kalimat | validator lulus |
| 7 | Storyboard | shots.json | kerangka frame kunci tiap shot (pakai renderer nyata, aset sementara) | `storyboard/` (strip gambar) | komposisi bervariasi; hierarki jelas; arah layar konsisten | **ACC pemilik** |
| 8 | Animatic | storyboard + VO uji | video kasar: waktu, narasi, visual sementara, gerak kamera, transisi | `animatic.mp4` (low-res) | dinilai sebagai urutan, bukan still; ritme kontras (cepat vs hening) | **ACC pemilik**, naskah dikunci |
| 9 | Produksi | animatic disetujui | implementasi Remotion/three.js; VO final (tanya Gemini/ElevenLabs); desain suara | komposisi + audio | lolos `cek_suara`, `cek_kilau`, `cek-mandiri`, `cek_shots` | build tanpa galat |
| 10 | Visual QA | render | tonton: strip frame, klip, metrik gerak/variasi; perbaiki; publikasi (caption, cover, Drive) | `qa/<id>.md` + MP4 final | lihat daftar periksa QA (bagian 5) | semua butir lulus atau diperbaiki; pemilik ACC publikasi |

Gerbang antar tahap ditegakkan oleh checklist log video (`e1/eNN-*.md`): butir tahap sebelumnya wajib `[x]`.

## 3. Apa yang berubah

**Ditulis ulang**
- `CLAUDE.md`: hanya arah aktif dan aturan keras (tanpa API AI, fakta bersumber, persetujuan, Drive, humanizer). Era lama dipindah ke `arsip/CLAUDE-aturan-lama.md`. Judul "(semi-realistis AI)" dikoreksi.
- `WORKFLOW.md`: dari 1.028 baris menjadi ±250 baris berisi 10 tahap di atas. Benchmark dan evaluasi eksperimen tetap, dipindah ke `e1/EVALUASI.md`.
- `.claude/skills/script-writer/SKILL.md`: tambah kemampuan membaca `direction.md` dan merevisi naskah demi visual; subtitle bukan pengulangan penuh; batas kata jadi pagar.

**Digabung**
- `sutradara` + `remotion-fitur` + `breakdown` → satu skill `visual-director`. Breakdown tetap ada sebagai teknik selektif; gaya sampel dan HyperFrames dibuang.

**Dihapus/diarsipkan** (ke `arsip/`)
- KUNCI KARAKTER, gerbang T1–T7, `tools/gerbang.mjs`, `tools/produksi.sh`, `checklist/`, `tools/cek-sutradara.mjs` (penegak tata letak lama), `sampel-hyperframes/`, aturan hemat token yang melarang inspeksi.
- `social-video-scriptwriting` (duplikat `script-writer`).

**Dipertahankan**
- `align_teks.py`, `cek_suara.py`, `cek_kilau.py`, `cek-mandiri.mjs`, `gemini_tts.py`, alur caption + humanizer, folder Drive, `look.tsx` (dipindah ke `lib/`).

## 4. Yang baru

**Skill baru: `visual-director`** (SKILL.md <150 baris, memuat referensi per tahap):
- `style/visual/bahasa-kamera.md` (push, pull, orbit, tracking, crane, POV, macro, locked, whip pan, rack focus: tujuan, parameter, kapan dilarang)
- `style/visual/komposisi.md`, `style/visual/gerak.md`, `style/visual/footage.md`, `style/visual/kualitas-3d.md`, `style/visual/mode-visual.md`, `style/visual/ritme.md`.

**Kode (`remotion/src/e1/lib/`)**, hanya yang terbukti perlu:
- `shots.ts` (tipe `Shot`, pemetaan ID kalimat ke detik dari `words.json`), `Shot.tsx` (renderer berbasis data), `kamera.ts` (perpustakaan gerak kamera dengan tujuan), `transisi.tsx` (match cut, push-through, wipe bermasker, depth reveal), `FootageShot.tsx` (crop terancang, push ke detail, sorotan, masuk/keluar dari 3D), `tipografi.tsx`.

**Alat baru**
- `tools/cek_shots.py` (validasi skema shot list), `tools/review_video.py` (strip frame dari MP4, rasio frame diam, jumlah jenis kamera dan mode visual dari `shots.json`, deteksi teks tumpang-tindih), `tools/animatic.py` (animatic dari `shots.json` + VO).

**Format `shots.json` per shot:** `id, ref_kalimat, narasi, durasi, tujuan_visual, subjek, lingkungan, ukuran_shot, sudut_kamera, posisi_kamera, gerak_kamera, gerak_subjek, cahaya, komposisi, kedalaman, fokus, transisi, frame_akhir, aset, implementasi, mode, footage{sumber,alasan,bagian,crop,gerak,sorotan,durasi,transisi,relasi_narasi}`.

## 5. Daftar periksa Visual QA (Tahap 10)
1. Tonton MP4 (strip 24 frame + 3 klip pendek: hook, titik balik, penutup). Bukan still dari komposisi.
2. Variasi: ≥4 jenis kamera; ≥3 mode visual; tidak ada dua shot berturut-turut dengan tata letak sama; ≥1 shot hening/diam yang disengaja.
3. Footage: tiap foto punya peran (bukan dekorasi) dan transisi masuk/keluar bermakna.
4. Teks: tidak mengulang narasi; terbaca di HP; posisi bervariasi.
5. Gerak: hierarki jelas (satu fokus utama); tidak ada gerak tanpa tujuan.
6. Suara: ada lapis suara selain VO; loudness −15..−13 LUFS.
7. Uji akhir: "Apakah ini terasa seperti dokumenter yang diarahkan, atau slide beranimasi?" Jika slide, kembali ke Tahap 5.

## 6. Contoh nyata (Stage 5)
Satu urutan representatif memakai foto pemilik (`rumah-ditinggikan.jpg`) di #02: foto nyata → kamera mendorong ke detail tangga → sorotan → transisi bermasker ke potongan 3D pondasi → kamera masuk ke dalam struktur → mundur → kembali ke foto. Dirender dan ditinjau dari MP4 sungguhan (Stage 6).

## 7. Risiko
- Rewrite `CLAUDE.md` dan `WORKFLOW.md` menghapus aturan yang pernah diputuskan pemilik (KUNCI KARAKTER). Karena itu diarsipkan, bukan dibuang, dan dicatat di `KEPUTUSAN.md`.
- Tahap tambahan (storyboard, animatic) menambah putaran sebelum render. Imbalannya: perubahan di tahap murah, bukan setelah 10 menit render.
- Pustaka `lib/` baru harus dibuktikan di contoh nyata sebelum dipakai di video lain; bila tidak bermanfaat, dibuang.

## 8. Keputusan yang dibutuhkan dari pemilik
1. **Boleh** KUNCI KARAKTER dan aturan 3D lama diarsipkan (E1 sepenuhnya memakai arahan baru)?
2. **Subtitle:** default mati dan dipakai selektif (aksesibilitas), atau tetap menyala penuh seperti video lama?
3. **Stage 5 memakai #02 dan foto Anda** sebagai contoh. Setuju?
