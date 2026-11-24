# PROPOSAL: Repository-Aware Visual Intelligence Upgrade (24 Nov 2026)

Dasar: `REPOSITORY_SKILL_AUDIT.md`. **Belum ada yang diimplementasikan.** Menunggu persetujuan pemilik (bagian 10).
Prinsip: memperbaiki skill yang sudah ada dan memakai kemampuan repo yang sudah ada; tidak ada sistem baru dari nol; tidak ada kuota gerak/mode; tidak mengubah video lain.

## 1. Rekonsiliasi dengan pekerjaan saya sebelumnya
Overhaul lalu mengarsipkan `sutradara`, `remotion-fitur`, `breakdown`, `social-video-scriptwriting` dan membuat `visual-director`. Itu menambah satu skill dan menumpuk isi yang sama (audit bagian 5). **Usulan:**
| Tindakan | Detail |
|---|---|
| Pulihkan empat skill ke `.claude/skills/` | `git mv arsip/skills/<nama> .claude/skills/<nama>` (riwayat git terjaga) |
| Lebur `visual-director` ke `sutradara` | isi `visual-director/SKILL.md` + 11 referensi `style/visual/*` menjadi skill `sutradara` (Visual Director). Nama `visual-director` dihapus agar tak ada skill ganda; berkasnya dipindah, bukan dibuang |
| Pisahkan isi lama `sutradara` | bagian A, F → `sutradara/legacy/gaya-diorama-kertas.md` (tidak dimuat otomatis) |
| `social-video-scriptwriting` | jadi peninjau opsional (routing bagian 6) |
Catatan: ini membalik sebagian pekerjaan saya sendiri; Anda yang memutuskan.

## 2. Tiga lapis aturan (jawaban Phase 2)
| Lapis | Isi | Lokasi usulan | Mengikat? |
|---|---|---|---|
| **A. Prinsip sutradara universal** | kamera digerakkan cerita; variasi ritme; payoff visual; akhir menggema pembuka; cerita dibawa suara; antisipasi→aksi→tindak lanjut; hierarki gerak; staging bertujuan; kendali atensi; waktu baca teks; satu fokus per frame | `sutradara/SKILL.md` (≤ 80 baris) | ya, sebagai prinsip, bukan angka |
| **B. Aturan gaya lama** | DNA #7–#8, palet latar, kartu judul y 450–700, subtitle y=1400, objek ≥1/3 layar, outline `Edges`, bentuk membulat, isometrik, ≥4 gerak, tanpa kamera diam, momen khas "3D kertas", larangan glow/bloom, `cek-sutradara`, gerbang T1–T7 | `sutradara/legacy/gaya-diorama-kertas.md` (+ `arsip/`) | hanya bila pemilik minta gaya lama |
| **C. Aturan produksi E1** | tanpa API AI, deterministik, foto dicari user, VO tanya Gemini/ElevenLabs, humanizer, CTA, Drive, persetujuan, subtitle default mati, aturan konsistensi (skala 1 m, peran warna, satu model per objek, anti-z-fighting) | `CLAUDE.md` + `WORKFLOW.md` (sudah ada) + `sutradara/e1-produksi.md` (ringkas) | ya |
E1 **boleh**: komposisi statis, shot lebar, subjek kecil, negative space, siluet, lingkungan gelap, perspektif kompleks, kamera hanya bila bermotif, animasi minimal, tanpa tipografi, 2D bila lebih baik dari 3D. Pengetahuan lama tidak dihapus.
Pemetaan baris-per-baris dari `sutradara` lama ke tiga lapis akan ditulis saat implementasi (bagian B baris 21–33 → A; baris 11–19, 45, 62 → B; E1 → C).

## 3. `breakdown`: dari exploded view menjadi analisis referensi
Fungsi exploded view/potongan dipertahankan utuh. Tambahan **Mode B: Analisis Referensi** (dipakai bila ada referensi atau teknik yang akan direkreasi):
- **Input:** gambar/video referensi (`style/referensi-visual/NN-*`, atau lembar kontak dari video via `tools/review_video.py`; metrik gerak dan ritme via `tools/ref-analyze.py`/`cek-gerak.sh`, yang sudah ada).
- **Output:** satu berkas `docs/visual-system/referensi/NN-nama.md` berformat tetap, delapan bagian (komposisi, art direction, sinematografi, staging, animasi, cahaya, editing, implementasi) + tujuh pertanyaan wajib (apa yang membuatnya efektif; tujuan cerita; metode teknis; bisa direkreasi dengan kemampuan repo ini?; implementasi tersederhana yang mempertahankan dampak; cara mengadaptasi bukan menyalin; bisa jadi komponen/preset?). Bagian "Implementasi" wajib menunjuk komponen/berkas nyata yang ada atau menyatakan "belum ada".
- **Aturan:** tanpa menyalin merek/tata letak persis (sudah ada di `style/aset.md`); bila tak bisa direkreasi, katakan.
- **Tidak ada pustaka baru.** Alat yang dipakai sudah ada. Pekerjaan baru hanya template berkas dan instruksi.

## 4. `remotion-fitur`: dari katalog fitur menjadi konsultan teknik
Bentuk usulan: satu **kartu teknik** per teknik dengan kolom tetap (apa yang dilakukan; apa yang dikomunikasikan; kapan dipakai; kapan tidak; kombinasi kreatif; syarat teknis; biaya render; komponen/implementasi yang ada; contoh; **status verifikasi**).
- **Status verifikasi wajib** karena audit menunjukkan sebagian katalog tak jalan di render container ini (audit bagian 7). Tiga status: `terverifikasi` (diuji render), `tak-terverifikasi`, `gagal-di-lingkungan-ini`.
- **Status awal dari bukti:** transisi `iris` = terverifikasi; `Img/Solid/HtmlInCanvas` + `effects` = gagal-di-lingkungan-ini (probe 1 frame); `CameraMotionBlur`, `light-leak` pada DOM, `media-utils` = tak-terverifikasi; CSS `filter`, grain SVG `feTurbulence`, vignette CSS, `localClippingEnabled`, kamera dari data = terverifikasi (dipakai di `Tanah02.tsx`, `Pilot02.tsx`, `Pilot02B.tsx`).
- **Langkah pertama implementasi:** satu matriks uji render (still + klip pendek) untuk setiap teknik yang dianggap berguna, hasilnya mengisi kolom status. Tanpa itu, kartu tidak boleh merekomendasikan teknik.
- **Pohon keputusan** per kategori (transisi, grading, cahaya/atmosfer, blur, tekstur, partikel, tipografi, audio-reaktif, simulasi, material): aturan "pakai bila ... jangan bila ..." seperti contoh Anda (light leak hanya bila bermotif cahaya/flash/perubahan dramatis; motion blur hanya untuk gerak cepat pendek dan hitung biaya render; grading untuk mood dan kontinuitas, bukan satu grade untuk semua; transisi harus bermotif geometri/narasi/suara/kamera/material/kontinuitas ruang).
- **Fallback agar keputusan kreatif tak terkunci efek yang tak jalan:** padanan CSS/SVG/three.js yang sudah terbukti (grading CSS `filter`, vignette gradient, grain SVG, bidang potong, kabut, bayangan).
- Aturan 3D wajib dan teknik isometrik tetap, yang isometrik dipindah ke bagian legacy.

## 5. Sistem keputusan visual (Phase 5, 6, 8)
Tidak membuat skill baru; menjadi bagian prosedur `sutradara`:
1. **Eksplorasi konsep** per beat penting (bukan semua beat): tabel 2–3 konsep (dari daftar metode Anda: lingkungan arsitektural, perlakuan fotografis, grafis editorial, tipografi, 2D, 2.5D, three.js, cutaway, penampang, exploded, simulasi, metafora, before/after, split, transisi skala, makro/mikro, minimalis, atmosferik, campuran), dinilai pada: tujuan naratif, pemahaman, emosi, atensi, kompleksitas, kelayakan produksi, kontinuitas, variasi. Output: satu konsep terpilih + alasan; konsep ditolak dicatat satu baris.
2. **Dimensi penting per shot**: dari 20 dimensi (komposisi, art direction, staging, kamera, koreografi, cahaya, material, warna, metafora, tipografi, desain informasi, ruang, efek, ritme editing, transisi, suara, kontinuitas, hierarki, progres emosi, payoff) shot hanya mencatat yang penting (kolom `dimensi_penting` di `shots.json`, opsional).
3. **Audit variasi dan kontinuitas** atas seluruh urutan, bersifat **saran** (bukan gerbang): komposisi/kamera/rotasi/transisi/kartu teks/cahaya/konstruksi adegan yang berulang, 3D berlebih, animasi tak perlu, metafora generik, shot yang hanya mengulang narasi. Dihasilkan dari `shots.json` + `tools/review_video.py`.
4. **Suara sebagai bagian arahan** (bukan tambahan): kolom suara per shot; memakai `make_sfx*.py`, `public/sfx/`, `mix-audio.mjs` (perlu adaptor kecil agar membaca `shots.json`; saat ini hanya `beats.json`/`const SFX`).

## 6. Routing skill (Phase 7)
| Tahap | Skill | Keluaran → dipakai oleh |
|---|---|---|
| Riset, sudut cerita, naskah, revisi | `script-writer` | `angle.md`, naskah → `sutradara` |
| Peninjauan performa/hook/strategi (opsional) | `social-video-scriptwriting` | catatan saja, **tidak menghasilkan naskah** |
| Referensi perlu direkayasa-balik, adegan berlapis, mekanisme teknis, cutaway/exploded | `breakdown` | lembar analisis → `sutradara` |
| Konsep, shot, komposisi, staging, kamera, animasi, cahaya, ritme, suara, kontinuitas | `sutradara` (Visual Director) | `direction.md` + `shots.json` → `remotion-fitur` |
| Strategi implementasi, pilihan efek/komponen, kode ulang-pakai, optimasi render | `remotion-fitur` | komposisi/lib + status verifikasi → QA |
| Visual QA | `sutradara` (kritik) + alat | `qa.md` dari render **yang ditonton**; gagal → kembali ke `sutradara` |

## 7. Konflik dan perubahan yang diusulkan
| # | Konflik (bukti di audit §3–4) | Usulan |
|---|---|---|
| 1 | Kuota ≥4 kamera, ≥3 mode, wajib shot diam/hening di `tools/cek_shots.py:71-73`, `WORKFLOW.md` tahap 6 dan 10, `visual-director/.../bahasa-kamera.md:27`, `shots-skema.md:45`, `ritme.md:8` | ubah jadi PERINGATAN/saran; validator tetap memeriksa skema dan celah waktu |
| 2 | `sutradara` B4, B2, B10 (≥4 gerak, tanpa kamera diam, momen khas 3D, larangan glow) | pindah ke legacy; prinsip B diringkas tanpa angka |
| 3 | `visual-director` menduplikasi `sutradara` | lebur (bagian 1) |
| 4 | Dua skill naskah tambahan tumpang tindih | `social-video-scriptwriting` = peninjau opsional |
| 5 | `remotion-fitur` memuat efek yang tak terbukti jalan | kartu teknik dengan status verifikasi |
| 6 | `footage.md` (foto sebagai bidang) vs brief "foto = referensi" | pilih per konsep; foto boleh muncul sebagai elemen terolah bila konsep terpilih menuntutnya |
| 7 | `style/e1-visual-kode.md` bagian 5 menyebut `cek-sutradara` yang sudah diarsipkan | perbarui rujukan |
| 8 | Tidak ada desain suara E1 | adaptor `mix-audio` untuk `shots.json` |
Tidak diubah: video lama, `Tanah02.tsx`, `Rumah01.tsx`, `look.tsx`, alat suara/kilau, CLAUDE.md di luar rujukan skill.

## 8. Rencana pilot #02 (Phase 9)
Dua pilot lalu (`Pilot02` foto+penampang; `Pilot02B` rekonstruksi 3D + bidang potong) tetap sebagai **baseline pembanding**, bukan hasil sistem baru.
- **Sequence:** rumah ditinggikan → pondasi → lempung memampat (20,4–31,0 dtk), karena paling lemah dan sudah punya baseline. Alternatif: bagian studi/penghitung (30,9–38,5 dtk) bila Anda ingin menguji metode data.
- **Konsep yang akan dieksplorasi (≥3) untuk transisi nyata→pondasi:**
  1. *Irisan 3D bermotif ruang* (`Pilot02B`): kekuatan sebab-akibat, kelemahan realisme eksterior.
  2. *Perlakuan fotografis + penampang*: foto terolah (grading, kedalaman 2.5D) dengan penampang 2D editorial yang bersih; menghindari tuntutan realisme 3D; hanya foto sebagai bukti singkat.
  3. *Minimalis siluet gelap*: rumah sebagai siluet di dasar gelap, kamera hampir diam, wahyu lewat satu garis cahaya yang membelah tanah dan memampat; sedikit teks.
  4. *Transisi skala/makro*: dorong ke noda/retak di dinding dasar lalu masuk ke bahan dan ke tanah (hanya bila foto/detail mendukung).
- **Langkah:** analisis narasi → pilih konsep (dengan alasan tertulis) → shot list + `dimensi_penting` → storyboard/animatic (`tools/animatic.py`, belum pernah dijalankan; akan diuji) → implementasi dengan teknik terverifikasi → render preview → tonton (strip + klip, `tools/review_video.py`) → revisi berdasarkan temuan spesifik → satu putaran lagi.
- **Gerbang (teknis):** `cek-mandiri`, `cek_kilau`, `tsc`. **Penilaian (kreatif, tertulis di `qa.md`)**: 10 pertanyaan QA yang sudah ada, tanpa kuota.
- **Tidak ada klaim berhasil** tanpa render yang saya tonton; hasilnya dilaporkan dengan sisa kelemahan.
- Biaya: render preview 10,6 dtk ±5–12 mnt tergantung bayangan/mesh.

## 9. Risiko
- Memulihkan skill lalu meleburkan `visual-director` memindahkan banyak berkas; riwayat git terjaga, tapi referensi di `CLAUDE.md`, `WORKFLOW.md`, `e1/02/*`, `STATUS.md` harus diperbarui.
- Efek canvas Remotion mungkin tak pernah berfungsi di container ini; bila begitu, kartu teknik akan jujur menyatakannya dan fallback CSS/three.js dipakai. Uji di mesin ber-GPU (`--gl=angle`) butuh Anda.
- Kualitas 3D realistis tetap terbatas (software GL, tanpa post-processing); konsep 2–3 sengaja tidak bergantung padanya.
- Sound design menambah pekerjaan dan perlu keputusan VO (Gemini/ElevenLabs) seperti biasa.

## 10. Keputusan yang saya butuhkan sebelum implementasi
1. **Pemulihan skill:** setuju memulihkan `sutradara`, `remotion-fitur`, `breakdown`, `social-video-scriptwriting` ke `.claude/skills/` dan meleburkan `visual-director` ke `sutradara`?
2. **Kuota:** setuju mengubah semua kuota (≥4 kamera, ≥3 mode, wajib shot diam) menjadi saran?
3. **Foto:** boleh foto nyata muncul sebagai elemen terolah bila konsep terpilih menuntutnya, tetap bukan slideshow dan bukan pengganti animasi?
4. **Sequence pilot:** rumah→pondasi→lempung (usulan), atau yang lain?
5. **Verifikasi efek:** boleh saya menjalankan matriks uji teknik (still dan klip pendek) di container ini sebagai langkah pertama, dan apakah Anda bersedia mengujinya juga di mesin ber-GPU?
