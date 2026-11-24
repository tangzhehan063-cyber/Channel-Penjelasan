# REPOSITORY SKILL AUDIT (24 Nov 2026)

Cakupan: lima skill yang Anda sebut, kode yang mereka rujuk, alat, paket Remotion, dan dua pilot #02. **Hanya audit dan bukti; tidak ada berkas produksi yang diubah.** Bukti berupa path, kutipan, hitungan `grep`, dan satu probe render (bagian 7).

## 0. Koreksi kondisi repo (penting)
Anda menyebut lima skill di `.claude/skills/`. Di cabang kerja ini (`claude/focused-wozniak-m2zer3`, PR #59) kondisinya sudah berbeda karena pekerjaan saya sebelumnya:

| Skill | Lokasi sekarang | Catatan |
|---|---|---|
| `script-writer` | `.claude/skills/script-writer/` (322 baris) | aktif; ditambah bagian 12 (integrasi arahan visual) |
| `breakdown` | `arsip/skills/breakdown/` (38) | **saya arsipkan** |
| `remotion-fitur` | `arsip/skills/remotion-fitur/` (39) | **saya arsipkan** |
| `sutradara` | `arsip/skills/sutradara/` (62) | **saya arsipkan** |
| `social-video-scriptwriting` | `arsip/skills/social-video-scriptwriting/` (160) | **saya arsipkan** |
| `visual-director` (baru, saya buat) | `.claude/skills/visual-director/` (63 + 11 referensi) | menggantikan tiga skill visual |

Ini bertentangan dengan arahan Anda sekarang ("jangan membuat sistem yang sama sekali baru, perbaiki skill yang ada"). Bagian 9 dan `PROPOSAL.md` memuat cara mengembalikannya. Audit di bawah membaca isi skill dari `arsip/skills/`.

## 1. Apa yang sebenarnya bisa dilakukan tiap skill

### `sutradara` (`arsip/skills/sutradara/SKILL.md`, 62 baris)
- **Bagian A (baris 11–19):** DNA video #7–#8: palet latar, kartu judul dua lapis di y 450–700, subtitle y=1400, objek 3D membulat, `Seg` crossfade 8 frame, stiker editorial, pemutus pola banjir koral. Spesifik gaya diorama kertas.
- **Bagian B (21–33):** prinsip penyutradaraan: logline satu kalimat; akhir menggema pembuka; kamera beralasan; ritme tidak rata; waktu baca; SFX 1 frame setelah gambar; hening ±0,9 dtk sebelum payoff; hierarki gerak (hero 100%, pendukung 50–70%, ambient <5%, maks 1/3 elemen bergerak); antisipasi→aksi→tindak lanjut; larangan.
- **Bagian C–F (35–62):** proses, tabel pemeriksaan otomatis `tools/cek-sutradara.mjs` (animasi, bentuk, warna) dan `tools/cek-visual.py`, format shot list, baseline video lama.
- **Yang nyata bisa dijalankan:** `cek-sutradara.mjs` (kini di `arsip/alat-3d-lama/`), `tools/cek-visual.py` (masih di `tools/`), `tools/cek-gerak.sh`. Status di kepala skill: "bagian A, C, D, E, F khusus video 3D lama; bagian B berlaku umum".

### `remotion-fitur` (`arsip/skills/remotion-fitur/SKILL.md`, 39 baris)
- Aturan wajib 3D (baris 14–18): semua gerak dari `useCurrentFrame()`, dilarang `useFrame`, `Math.random`, `Date.now`, `<Sequence layout="none">` di dalam `ThreeCanvas`.
- "Fitur peningkat" (baris 20–29): light leak, transisi, color correction, efek lain, motion blur, gerak mengikuti suara. Judul bagian sendiri menyatakan **"belum dipakai di #1–#8, coba bertahap"**.
- Teknik isometrik (baris 31–38): kamera ortografis X=Y=Z, shading per sisi, `<Edges>`; baris 31 menulis **"DILARANG untuk diorama lebar, kota, atau denah kecil (aturan KUNCI KARAKTER)"**.
- **Bukti belum pernah dipakai:** `grep` di `remotion/src` untuk `lightLeak|light-leak`, `colorCorrection|color-correction`, `CameraMotionBlur|motion-blur`, `TransitionSeries|@remotion/transitions`, `@remotion/effects`, `visualizeAudio|useWindowedAudioData|media-utils` = **0 berkas** untuk semuanya. Paket ada di `remotion/package.json` (semua 4.0.541).

### `breakdown` (`arsip/skills/breakdown/SKILL.md`, 38 baris)
- Mesin exploded view/potongan berlapis: objek berlapis, parameter terurai `e` 0→1, sorot satu lapisan, label nama bergaris, kamera ortografis isometrik berganti `az/el`, `projIso` di `kit/waktu.ts`.
- Empat gaya: (1) isometrik terang (`kit/objek/AdeganDinding|Kran|Atap.tsx`, terdaftar di `kit/objek/registry.tsx`), (2) blueprint (`src/sampel/SampelBlueprint.tsx`), (3) Kurzgesagt tafsiran (`src/sampel/SampelKurz.tsx`), (4) HyperFrames (`arsip/alat-3d-lama/sampel-hyperframes/`; **dilarang untuk E1**).
- **Tidak ada** kemampuan analisis referensi di skill ini, padahal repo punya bahan untuknya (bagian 5).

### `script-writer` (`.claude/skills/script-writer/SKILL.md`, 322 baris)
Penulis naskah utama: sudut cerita, hook, retensi, revisi; bagian 12 (baru) menghubungkan ke arahan visual. Tidak menyentuh visual selain "Visual mystery" (baris 80) dan bagian 12.

### `social-video-scriptwriting` (`arsip/skills/social-video-scriptwriting/SKILL.md`, 160 baris)
Skill umum (riset, sudut, hook, narasi, retensi, tinjauan performa). Kepala skill (baris 6) menyatakan sendiri bahwa untuk fakta rumah "aturan `CLAUDE.md`, `naskah/alur-naskah.md` dan skill `naskah-viral` menang bila bertentangan". Tumpang tindih besar dengan `script-writer`.

## 2. Kemampuan yang kurang dimanfaatkan
1. **Paket efek dan transisi Remotion.** Katalog nyata di `remotion/node_modules/@remotion/effects/package.json` memuat ±80 sub-path (`light-leak`, `film-burn`, `vignette`, `glow`, `halftone`, `chromatic-aberration`, `zoom-blur`, `radial-wipe`, `iris-wipe`, `shatter`, `tear`, `page-turn`, `rain-fall`, `snow-fall`, `light-trail`, `liquid-contours`, `lut`, `thermal-vision`, ...). `@remotion/transitions` mengekspor 22 presentasi (`fade, slide, wipe, cube, flip, clock-wipe, book-flip, zoom-blur, dreamy-zoom, film-burn, linear-blur, zoom-in-out, none, iris, dissolve, ripple, crosswarp, cross-zoom, swap, push-cut, blur-slide`). Skill `remotion-fitur` menyebut ±12 efek dan 3 transisi. **Pemakaian di video: 0** (bagian 7 menunjukkan sebagian tidak jalan di container ini).
2. **Desain suara.** Repo punya `tools/make_sfx.py`, `tools/make_sfx_jalan.py` (SFX tersintesis bebas lisensi), `remotion/public/sfx/` (17 berkas), `tools/mix-audio.mjs` (campur VO + ambient + SFX tanpa render). Semuanya terhubung ke video lama (`mix-audio.mjs` membaca `const SFX` di `remotion/src/vNN/VideoNN.tsx` atau `beats.json`). **E1 tidak memakai satu pun**: `remotion/src/e1/*.tsx` hanya `<Audio>` VO.
3. **Analisis referensi.** `tools/ref-analyze.py` (OpenCV: ritme potongan, gerak, blur, kedalaman, grain, tekstur; disalin dari `unclejobs-ai/motion-video-skill`, MIT; komentar berbahasa Korea; sumber di `tools/ref-analyze.SUMBER.txt`), `tools/cek-gerak.sh` + `tools/gerak-target.json`, dan proses referensi di `style/aset.md` ("Cara kerja dengan referensi") + `style/referensi-visual/` (01–07, termasuk `05-gerak-video/detik-*.jpg`, lembar kontak). Tidak ada skill yang memakainya secara terstruktur; `breakdown` tidak menyebutnya.
4. **Kit 2.5D.** `remotion/src/v13/Video13.tsx` dan `Tes13/Mood13` memuat kamera 2,5D (`KEPUTUSAN.md` baris "kamera 2,5D ada di v13"); `grep -il "parallax|2.5D"` mengenai 8 berkas video lama. Tidak ada di E1.
5. **Kit aset prosedural editorial** (`remotion/src/aset/Aset.tsx`, `Gabung.tsx`, `Gerak.tsx`; katalog `style/aset.md`): bayangan teralis, cutout, kolase editorial, bahasa gerak 0,4–0,6 dtk. Dokumen `style/aset.md` menyebut `ShadowCast kind="teralis"` sebagai "ciri khas channel". Tidak dipakai di E1.
6. **Aset 3D luar CC0** (`remotion/src/kit/model.tsx`, `remotion/public/aset-luar/kenney/`, katalog `style/aset-luar.md` memuat tangga, jalan, tiang lampu, bata, kolom, rumah kecil). E1 mensyaratkan persetujuan pemilik (`CLAUDE.md`), dan tidak dipakai di #02.
7. **Teknik three.js yang dianjurkan tapi tak dipakai:** `style/e1-visual-kode.md` menyebut `InstancedMesh`, shader/material PBR; `grep` di `remotion/src`: `InstancedMesh` 0, `ShaderMaterial|shaderMaterial` 0, `EffectComposer|postprocessing` 0. `castShadow` dipakai di 31 berkas.

## 3. Instruksi yang usang
- `arsip/skills/sutradara/SKILL.md` baris 15 (palet latar `style/palet.json` krem/mint/terakota...), 17 (kartu judul y 450–700, subtitle y=1400), 45 (tabel bentuk/outline), 62 (baseline video lama).
- `arsip/skills/remotion-fitur/SKILL.md` baris 20: "belum dipakai di #1–#8, coba bertahap" (status 14 Nov, tak pernah diperbarui); baris 31–38: teknik isometrik terikat KUNCI KARAKTER.
- `arsip/skills/breakdown/SKILL.md` baris 8: "gerbang T1–T7, KUNCI KARAKTER... Gaya selain isometrik terang belum diizinkan".
- `style/gaya-penjelasan.md` (bagian 4 kosakata kamera, bagian 7 daftar cek `checklist/vNN.md`) dan `style/identitas.md`: gaya diorama kertas.
- `style/e1-visual-kode.md` baris 69–72 (bagian 5): menyebut `node tools/cek-sutradara.mjs NN` dan `tools/cek-gerak.sh` sebagai cek E1; `cek-sutradara` sudah diarsipkan.

## 4. Instruksi yang bertentangan dengan E1
| Instruksi | Sumber | Konflik |
|---|---|---|
| "Kamera beralasan, **≥4 jenis gerak per video**" | `sutradara/SKILL.md:26` | membatasi komposisi statis/film minimal |
| "Tidak ada kamera diam total; tahan pun didorong 2%" | `sutradara/SKILL.md:26` | melarang static cinematic |
| "Satu momen khas medium... 3D kertas" | `sutradara/SKILL.md:24` | memaksa jenis payoff |
| "Larangan: glow/bloom, partikel hiasan..." | `sutradara/SKILL.md:32` | melarang alat yang Anda minta dipertimbangkan (cahaya, atmosfer, efek) |
| Subtitle y=1400, kartu judul, kicker | `sutradara/SKILL.md:17` | subtitle default mati di E1 |
| Isometrik wajib, outline `Edges`, bentuk membulat | `sutradara/SKILL.md:45`, `remotion-fitur/SKILL.md:31-38` | gaya lama |
| Objek ≥ 1/3 layar | `CLAUDE-aturan-lama` KUNCI KARAKTER | melarang small subject / negative space |
| Footage sebagai bidang/kartu (resep ground-slice) | `visual-director/style/visual/footage.md` | konflik dengan brief "foto = referensi" (sudah dicatat, belum diselaraskan semuanya) |

### Konflik yang saya sendiri ciptakan (harus diakui)
Pada overhaul sebelumnya saya membuat kuota baru yang sama jenisnya dengan yang Anda minta tidak diwajibkan:
- `tools/cek_shots.py:71` **GAGAL** bila < 4 jenis kamera; baris sekitar 72–73 **GAGAL** bila < 3 mode atau tanpa shot diam/hening.
- `WORKFLOW.md` tahap 6 menulis gerbang "≥4 jenis gerak kamera, ≥3 mode"; tahap 10 butir 9 mengulanginya.
- `.claude/skills/visual-director/style/visual/bahasa-kamera.md:27`, `shots-skema.md:45`, `ritme.md:8` (≥1 shot cepat, ≥1 napas), dan `SKILL.md` tabel anti-pola.
Ini bertentangan dengan arahan Anda ("jangan mewajibkan jumlah minimum gerak kamera / shot signature"). Usulan di `PROPOSAL.md`: ubah menjadi saran, bukan gerbang.

## 5. Skill yang tumpang tindih
- `script-writer` ↔ `social-video-scriptwriting` ↔ `naskah-viral` (sudah diarsipkan lebih dulu di `arsip/skills/naskah-viral/`): ketiganya menulis naskah.
- `sutradara` ↔ `remotion-fitur` ↔ `breakdown`: ketiganya memuat aturan kamera isometrik dan gaya; `visual-director` (milik saya) menelan ketiganya dan kini menumpuk sebagai skill keempat dengan isi yang sama.
- `sutradara` bagian B ↔ `visual-director/SKILL.md` + `ritme.md` + `bahasa-kamera.md`: prinsip sama ditulis dua kali.

## 6. Kemampuan yang berguna tapi belum terintegrasi
`ref-analyze.py` + `cek-gerak.sh` + `review_video.py` (analisis video; yang terakhir saya buat, belum dipakai untuk referensi); `mix-audio.mjs` + `make_sfx*.py` + `public/sfx/`; kit aset editorial `aset/*`; kamera 2,5D `v13`; `kit/model.tsx` (glTF CC0); `bake` efek SVG mahal menjadi PNG (`aset/BakeAset.tsx`, dipakai membuat `public/aset/kertas-*.png`, `grain.png`).

## 7. Probe teknis (24 Nov, satu frame, render swangle container ini)
Probe sementara (tidak di-commit; sudah dihapus) memakai still:

| Fitur | Hasil | Tafsir |
|---|---|---|
| `TransitionSeries` + `iris({width,height})` antara dua `Solid` | **jalan** (lingkaran biru membuka di atas merah, frame 20) | transisi `@remotion/transitions` layak dipakai |
| `<Img effects={[...]}>` (color-correction, vignette, light-leak, halftone, glow, zoom-blur, film-burn) | **semua gagal** (ikon gambar rusak); `<Img>` tanpa `effects` jalan | efek pada gambar tidak terbukti jalan di sini |
| `<Solid effects>` dan `<HtmlInCanvas effects>` | **kosong/putih**, bahkan satu `Solid` tanpa efek tampil putih | komponen berbasis canvas ini tidak terbukti jalan di container ini |
| `CameraMotionBlur` | **belum diuji** | tak ada klaim |
Keterbatasan probe: satu frame, hanya `still`, konfigurasi `swangle` + Chromium `/opt/pw-browsers/chromium` (`remotion/remotion.config.ts`), 43 efek berkas `*-webgpu-shader` mungkin butuh WebGPU. Bisa jadi berfungsi dengan `--gl=angle` pada mesin ber-GPU (belum dicoba). **Kesimpulan yang boleh ditulis: efek canvas Remotion "tidak terverifikasi di lingkungan render ini"; jangan masukkan ke instruksi sebagai alat andal sebelum diuji ulang.**
Fakta API yang terverifikasi dari `.d.ts`: prop `effects` hanya ada di `Solid`, `Img`, `HtmlInCanvas`, dan `Video` dari `@remotion/media`; **tidak ada pada `ThreeCanvas` maupun elemen DOM biasa**. Efek harus diimpor per sub-path (`@remotion/effects/vignette`, bukan dari indeks), dan parameter punya rentang (mis. `colorCorrection` `temperature` −1..1, `saturation` ≥ 0; ditemukan lewat galat). Skill lama tidak menyebut keduanya.

## 8. Batasan teknis yang harus dihormati
- Render software GL (swangle): `remotion/remotion.config.ts` baris 3–5. Pilot 10,6 dtk tanpa bayangan = 4 mnt 4 dtk; `Pilot02B` dengan bayangan + ±150 mesh: estimasi sisa 9 mnt 56 dtk pada frame 103/318 (total tak diukur persis); video penuh ±10 mnt per ±58 dtk (`CLAUDE.md`).
- Deterministik per frame; tanpa API AI (`tools/cek-mandiri.mjs`).
- Z-fighting (`tools/cek_kilau.py`; `Pilot02B` lulus 270/300 piksel: mepet).
- Pemuatan glTF/tekstur lewat DOM, bukan di dalam kanvas R3F (`kit/model.tsx` baris 2).
- Kamera tidak boleh masuk ke padatan saat memakai bidang potong (pelajaran `Pilot02B`).
- Tidak ada pustaka post-processing three.js di dependensi (`remotion/package.json`: hanya `@react-three/drei`, `fiber`, `@remotion/three`).
- Foto sumber 1024×576 (resolusi rendah untuk push-in > ±1,8×).

## 9. Mana yang tetap mandiri
Usulan: `script-writer` (penulis utama), `social-video-scriptwriting` (peninjau opsional, **dipulihkan ke `.claude/skills/`** dengan catatan "jangan menghasilkan naskah ganda"), `breakdown` (pembongkar struktur + referensi), `sutradara` (Visual Director), `remotion-fitur` (konsultan teknik). Detail di `PROPOSAL.md`.

## 10. Kemampuan yang bisa dipakai ulang tanpa implementasi baru
`TransitionSeries` + presentasi (terverifikasi `iris`); `ThreeCanvas` + `localClippingEnabled` untuk irisan (`Pilot02B.tsx`); CSS `filter` untuk grading pada seluruh adegan (dipakai di `Tanah02.tsx`, `Pilot02*.tsx`); `Grain` SVG `feTurbulence` (`Pilot02.tsx`); `lib/kamera.ts` (kamera dari data); `lib/anot.tsx` (label); `look.tsx` + `usePenampang()` (material); `mix-audio.mjs` + SFX sintesis; `ref-analyze.py`; `review_video.py`; kit aset editorial.

## 11. Kemampuan visual yang belum ada
Post-processing untuk adegan three.js (bloom terkendali, DOF, grading yang jalan tanpa canvas efek); sistem partikel nyata (partikel saat ini bola mesh satuan, bukan `InstancedMesh`); shader material (air, noda/lumut, basah); dekal/noda; vegetasi dan kerumunan prosedural; volumetrik/sinar; grading terverifikasi untuk 3D; desain suara terintegrasi E1; pipa analisis referensi → rekreasi; perlakuan fotografis terkendali (Ken Burns, parallax 2.5D dari satu foto) di E1.
