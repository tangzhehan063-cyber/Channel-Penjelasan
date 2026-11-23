# E1 — VISUAL EXPERIMENT WORKFLOW
## Fakta Rumah
**Eksperimen visual semi-realistis, dibuat 100% dari kode (Remotion + Three.js)**

**Status:** DRAFT v2 (23 Nov 2026: metode visual diganti kode, struktur dan gerbang tetap) — Menunggu persetujuan pemilik channel  
**Eksperimen:** E1  
**Tujuan:** Menguji pengaruh perubahan visual terhadap performa video  
**Format:** TikTok / Facebook Reels / short-form video vertikal

> Workflow 3D diorama lama (langkah 0–7, gerbang T1–T7) diarsipkan di `arsip/WORKFLOW-3d-diorama-lama.md`.

> **ATURAN MANDIRI (23 Nov 2026, perintah pemilik channel):** semua aset visual dibuat dengan kode: Remotion (timeline, komposisi, render), Three.js (objek 3D, kamera, lighting, material), React + TypeScript (komponen modular), CSS/SVG (diagram, tipografi, motion graphic), JS/TS (prosedural, simulasi). **AI hanya asisten penulis kode.** Dilarang ada API AI eksternal (gambar, video, model 3D, tekstur) di jalur produksi atau render. Cek wajib: `node tools/cek-mandiri.mjs`. Panduan metode & aset: `style/e1-visual-kode.md`. Audit perubahan: `e1/AUDIT-ketergantungan-api.md`.
> Yang TIDAK diubah: workflow script, approval script, storyboard, semua gerbang approval, sistem evaluasi & benchmark, struktur folder, QC, aturan hemat token.

---

# 01. OBJECTIVE

## Tujuan eksperimen

Eksperimen E1 bertujuan menguji apakah visual semi-realistis arsitektural yang dibangun dari kode (Three.js + Remotion, tanpa generator AI) dapat meningkatkan performa video Fakta Rumah dibandingkan gaya visual yang saat ini digunakan.

Gaya visual sebelumnya menggunakan pendekatan **stylized 3D paper diorama**, seperti yang terlihat pada video #9.

E1 tidak bertujuan mengganti seluruh identitas channel secara permanen. Eksperimen ini merupakan pengujian terkontrol untuk menentukan apakah pendekatan visual baru layak dikembangkan menjadi format produksi berikutnya.

### Hypothesis

Visual semi-realistis berpotensi meningkatkan:

- Visual immersion.
- Rasa familiar terhadap lingkungan nyata.
- Emotional engagement.
- Viewer retention.
- Kemampuan menyampaikan fakta melalui visual yang lebih intuitif.

Namun, peningkatan performa tidak boleh langsung dianggap berasal dari visual. Topik, hook, storytelling, pacing, dan faktor distribusi juga dapat memengaruhi hasil.

---

# 02. EXPERIMENTAL DESIGN

## Variabel utama

**Independent variable:**

Visual style.

- Control: Existing stylized 3D paper-diorama style.
- Experiment: Semi-realistic procedural visual style (Three.js, materials + lighting realistis, tanpa generator AI).

## Variabel yang dijaga tetap

Sebisa mungkin, faktor berikut harus dipertahankan:

| Faktor | Aturan |
|---|---|
| Story structure | Mengikuti struktur storytelling video #9 |
| Hook | Menggunakan format hook yang sama |
| Narration | Menggunakan suara TTS yang sama |
| Duration | Target 50–70 detik |
| Pacing | Mengikuti pacing referensi #9 |
| Sound design | Menggunakan pendekatan yang konsisten |
| CTA | Menggunakan format penutup yang sama |
| Publishing | Jam posting dibuat konsisten |
| Editing | Struktur editing tidak diubah secara drastis |

Perubahan yang diperbolehkan hanya menyesuaikan visual agar narasi dapat diterjemahkan dengan baik ke dalam format baru.

## Jumlah eksperimen

Produksi awal:

**3 video menggunakan visual semi-realistis.**

Topik yang diusulkan:

1. Rumah lebih rendah daripada jalan.
2. Pintu depan sejajar dengan pintu belakang.
3. Rumah menghadap barat.

Topik tersebut masih bersifat usulan dan harus mendapatkan approval sebelum produksi.

## Reference performance

| Video | Views | Average retention |
|---|---:|---:|
| B0 | ±1.825 | ±40% |
| #9 | 2.794 | 57% |

Video #9 merupakan reference video utama karena performanya lebih baik daripada benchmark sebelumnya.

Namun, #9 tidak dianggap sebagai bukti bahwa visualnya merupakan faktor utama keberhasilan.

Faktor lain yang mungkin berkontribusi:

- Topik yang memiliki tingkat ketakutan tinggi.
- Hook berupa bantahan terhadap mitos.
- POV mobil.
- Jeda sebelum suara decit rem.
- Twist cerita.
- Ending yang mengulang momen awal.

Karena itu, E1 harus mempertahankan struktur storytelling #9 dan tidak mengubah seluruh elemen secara bersamaan.

---

# 03. SUCCESS CRITERIA

## Primary metrics

### 1. Average retention

Target:

**≥50%**

Untuk video berdurasi sekitar 48 detik, target average watch time:

**≥24 detik.**

### 2. Views within 48 hours

Target:

**≥2.000 views pada minimal 2 dari 3 video.**

## Secondary metrics

Jika tersedia, catat:

- Average watch time.
- Completion rate.
- Retention graph.
- Shares.
- Saves.
- Comments.
- Likes.
- Follower conversion.

## Decision framework

### CONTINUE

Eksperimen dianggap layak dilanjutkan apabila:

- Minimal 2 dari 3 video memenuhi target.
- Average retention menunjukkan peningkatan dibanding benchmark.
- Kualitas visual konsisten.
- Biaya dan waktu produksi masih masuk akal.

### ITERATE

Lakukan revisi apabila:

- Retention meningkat, tetapi views masih rendah.
- Visual menarik, tetapi terdapat masalah konsistensi.
- Beberapa shot terlihat bagus, tetapi sebagian lainnya gagal.
- Biaya produksi terlalu tinggi.
- Gerak kamera/objek masih kaku atau tidak natural.

Perbaikan harus diarahkan ke masalah yang ditemukan, bukan mengganti seluruh workflow.

### STOP

Hentikan format eksperimen apabila:

- Hasil tidak menunjukkan peningkatan yang cukup.
- Retention kembali mendekati benchmark B0.
- Visual baru tidak memberikan nilai tambah yang jelas.
- Produksi terlalu mahal atau terlalu lama dibanding hasil.

**Catatan:** Tiga video bukan sampel statistik yang cukup untuk membuat kesimpulan definitif. Hasil E1 merupakan dasar keputusan praktis untuk eksperimen berikutnya, bukan bukti ilmiah final.

---

# 04. PRODUCTION WORKFLOW

Workflow produksi dibagi menjadi 8 tahap.

## PHASE A — PRE-PRODUCTION

### STEP 1 — Topic research

Claude melakukan:

1. Membaca daftar topik yang sudah tersedia.
2. Meneliti topik menggunakan sumber yang relevan.
3. Mengumpulkan minimal 2 sumber untuk klaim faktual utama.
4. Memisahkan fakta, asumsi, dan simplifikasi visual.
5. Menandai klaim yang masih perlu verifikasi dengan `[CEK]`.
6. Menilai potensi topik dari sisi:
   - Curiosity.
   - Fear factor.
   - Relatability.
   - Visual potential.
   - Shareability.

Output:

- Research notes.
- Sources.
- Key facts.
- Potential hook.
- Visual opportunities.
- Potential misinformation risks.

**Approval required:** Pemilik channel harus menyetujui topik sebelum script final dibuat.

---

### STEP 2 — Scriptwriting

Script mengikuti storytelling reference #9.

Struktur dasar:

1. Myth or belief.
2. Contradiction or hook.
3. Real explanation.
4. Supporting evidence.
5. Twist or unexpected insight.
6. Practical action.
7. Closing callback.
8. CTA.

Claude harus menyediakan:

- 3 alternatif hook.
- 1 script utama.
- Teks voice-over.
- Perkiraan durasi.
- Beat sheet.
- Fakta yang mendukung setiap klaim.

Script harus:

- Menggunakan bahasa natural.
- Tidak terlalu formal.
- Tidak bertele-tele.
- Memiliki curiosity gap.
- Tidak mengulang informasi.
- Menggunakan angka yang ditulis dengan kata untuk TTS.
- Menyesuaikan panjang dengan target 50–70 detik.

CTA tetap:

**"Follow buat fakta rumah berikutnya!"**

Approval required:

Pemilik channel menyetujui script sebelum visual diproduksi.

---

# PHASE B — VISUAL DEVELOPMENT

### STEP 3 — Beat sheet and shot planning

Script dibagi menjadi beberapa shot berdasarkan kebutuhan storytelling.

Tidak ada jumlah shot yang wajib.

Target awal:

**8–12 shots per video.**

Shot harus memiliki tujuan yang jelas:

- Hook.
- Establishing shot.
- Explanation.
- Evidence.
- Visual comparison.
- Twist.
- Payoff.
- Closing.

Setiap shot harus memiliki:

| Field | Description |
|---|---|
| Shot ID | Nomor shot |
| Duration | Durasi |
| Voice-over | Kalimat yang disampaikan |
| Visual | Isi gambar |
| Camera movement | Gerakan kamera |
| Motion | Gerakan objek |
| Text overlay | Teks layar |
| SFX | Efek suara |
| Fact note | Catatan faktual |
| Transition | Transisi ke shot berikutnya |

Untuk setiap shot, beat sheet juga memuat **rencana adegan visual** (template di `style/e1-visual-kode.md` §2):

| Field | Description |
|---|---|
| Tujuan penjelasan | Apa yang harus dipahami penonton |
| Objek utama | Satu objek kunci |
| Geometri | Primitif/ekstrusi/lathe/BufferGeometry yang dibutuhkan, ukuran nyata |
| Metode visualisasi | 3D, cutaway/cross-section/exploded view, diagram, simulasi, flow, perbandingan |
| Gerakan | Objek: apa, kapan, easing |
| Kamera | Preset + alasan |
| Komposisi | Fokus, ruang teks |
| Material | Dari pustaka material |
| Lighting | Preset |

Visual harus memperjelas narasi, bukan dekorasi. Pilih metode yang paling efektif menjelaskan konsep, bukan yang paling realistis; bila diagram atau cross-section lebih jelas, pakai itu.

Claude harus menghindari membuat shot hanya untuk memenuhi jumlah.

Setiap perubahan shot harus memiliki alasan visual atau storytelling.

---

### STEP 4 — Style development and scene build

Sebelum membangun seluruh adegan, Claude harus menetapkan visual direction.

## Visual identity

Target gaya:

**Semi-realistic cinematic architectural visualization, dibangun dari kode.**

Karakter visual:

- Material PBR procedural (roughness, bump noise, variasi warna halus).
- Natural lighting (satu matahari dari azimut nyata + hemisphere, bayangan lembut).
- Cinematic composition.
- Proporsi nyata (1 satuan = 1 meter).
- Subtle imperfections (noise warna ±3%, sambungan tidak sempurna).
- Detailed environments (instancing untuk objek berulang).
- Atmospheric depth (fog tipis, gradien langit).
- Controlled color grading.

Visual tidak harus photorealistic sempurna. Konsep sulit divisualisasikan secara realistis memakai diagram, simulasi sederhana, perbandingan visual, cross-section, highlight, atau flow animation.

Targetnya adalah:

**Realistic enough to feel believable, but clearly presented as an illustration.**

## Style consistency

Setiap video memiliki satu **style reference**: still render dari scene Three.js (bukan gambar AI).

Elemen yang dijaga lewat konstanta bersama (satu sumber, bukan prompt):

- Lighting preset.
- Color palette.
- Material library.
- Architectural proportions.
- Environment.
- Weather.
- Time of day.
- Camera characteristics (FOV, lensa).

Rumah yang sama di beberapa shot memakai **komponen yang sama dengan parameter yang sama**, jadi bentuknya tidak mungkin berubah.

## Scene build

Workflow:

1. Bangun satu style reference (still dari kode).
2. Pemilik channel menyetujui style reference.
3. Bangun adegan per shot dari komponen reusable (`remotion/src/kit/`).
4. Review konsistensi dan kualitas (`remotion still`, 1 sheet per putaran).
5. Revisi kode adegan yang gagal.
6. Setelah adegan disetujui, lanjut ke animasi dan render.

Jangan render seluruh video sebelum style reference disetujui.

Approval required:

**Pemilik channel menyetujui style reference dan visual utama.**

---

## Breakdown (teknik visual tambahan, skill `breakdown`)

Berlaku di setiap video E1. Bukan tahap baru dan bukan workflow terpisah: dipakai di dalam Step 3 (perencanaan) dan Step 4–5 (pembuatan adegan).

1. **Analisis dulu.** Saat beat sheet disusun, tandai shot yang butuh penjelasan struktur, komponen, lapisan material, mekanisme kerja, atau objek yang perlu dibongkar. Tulis alasannya di kolom Metode visual ("breakdown: ...").
2. **Selektif.** Hanya shot yang pemahamannya benar-benar meningkat. Dilarang di setiap shot. Bila tidak ada shot yang cocok, jangan dipaksakan dan catat "tanpa breakdown" di beat sheet.
3. **Implementasi** dengan skill `breakdown`, di mesin Remotion + Three.js yang sudah ada. Objek, geometri, material, animasi bongkar, kamera, lighting, label, dan transisi semuanya kode.
4. **Dilarang:** API AI eksternal untuk gambar/video/model 3D (`cek-mandiri`), HyperFrames (gaya 4 di skill `breakdown`), dan engine produksi lain.
5. **Konsisten** dengan shot lain: komposisi, palet/material E1, pacing, kamera (preset yang sama), dan transisi. Gaya breakdown mengikuti arah E1, bukan gaya sampel (blueprint/Kurzgesagt) kecuali diputuskan pemilik.
6. **Sederhanakan** geometri objek yang terlalu kompleks tanpa membuang informasi penting (urutan lapisan, ketebalan relatif, posisi komponen); catat penyederhanaan sebagai "penyederhanaan visual" di fact note.
7. **Cek still sebelum render final:** objek, lapisan, label, kamera, dan animasi terbaca jelas (tiap lapisan terpisah, tidak ada z-fighting, label tidak menimpa objek/teks, label terbaca di layar HP). Breakdown yang tidak terpahami dalam 1–2 detik diperbaiki atau diganti diagram.
8. Prioritas: storytelling dan pemahaman penonton, bukan efek.

## Perbandingan real-life (sisipan kasus nyata)

Di sela penjelasan visual kode, video boleh menyisipkan 1–3 momen **perbandingan dengan kasus nyata** (rumah, kejadian, atau kondisi sungguhan) untuk membuktikan bahwa penjelasannya terjadi di dunia nyata.

1. **Cari kasus nyata yang terverifikasi** (berita, laporan, instansi): lokasi, tahun, dan angka dicatat di Research dan Sources. Tanpa sumber = tidak dipakai.
2. **Foto/video orang lain tidak diambil begitu saja.** Foto berita dan hasil pencarian umum berhak cipta. Sumber visual yang diperbolehkan: Wikimedia Commons (CC, kredit wajib), Pexels/Unsplash (lisensi bebas), foto milik channel, atau **kartu kasus** buatan kode (judul kasus, kota, tahun, angka, nama media) tanpa foto.
3. **Persetujuan pemilik channel** sebelum aset foto dipakai (aset lokal eksternal). Catat file, sumber, lisensi, dan kredit di `e1/eNN-*.md` bagian Sources; kredit ditulis di deskripsi YouTube.
4. Foto real-life disimpan lokal (`remotion/public/`), tidak diunduh saat render, dan tidak dihasilkan AI.
5. Perbandingan harus menambah pemahaman (misalnya model kode di kiri, kasus nyata di kanan), bukan dekorasi. Beat sheet memuat kolom tambahan **Real-life**.

---

# PHASE C — ANIMATION

### STEP 5 — Animation and render

Setiap adegan dianimasikan dengan kode dan dirender oleh Remotion. Tidak ada image-to-video.

Target durasi shot:

**4–8 detik sebagai titik awal, bukan aturan mutlak.**

Durasi harus disesuaikan dengan:

- Narasi.
- Gerakan objek.
- Pacing.
- Camera movement.
- Kebutuhan mempertahankan perhatian.

## Camera movement

Gunakan satu gerakan kamera utama per shot (`camAt` keyframe + preset di kit).

| Camera movement | Intended feeling | Usage |
|---|---|---|
| Push-in | Focus, tension | Hook, important detail |
| Pull-back | Reveal, scale | Reveal environment |
| POV movement | Immersion | Experiential scene |
| Crane-down | Discovery | Establishing |
| Orbit | Spatial understanding | Architecture |
| Pan | Connection | Compare locations |
| Static shot | Emphasis | Important explanation |
| Tracking | Movement | Follow an object |

## Motion rules

- Satu camera movement utama per shot.
- Jangan menambahkan gerakan kamera tanpa tujuan.
- Gerakan kamera harus mendukung narasi.
- Hindari gerakan objek yang tidak diperlukan.
- Jangan membuat kamera dan objek bergerak secara kompleks dalam satu shot.
- Gerak harus mengikuti logika fisik yang masuk akal (simulasi sederhana boleh, jangan menyesatkan fakta).
- Semua animasi fungsi dari nomor frame (`useCurrentFrame`), bukan `Date`, `Math.random()`, atau CSS transition.
- Acak memakai seed tetap supaya render selalu identik.
- Hindari z-fighting, clipping objek, dan celah antar-geometri.
- Hindari perubahan lighting yang tidak disengaja antar-shot.

## Keyframe animasi

- Gunakan keyframe awal untuk menjaga komposisi.
- Gunakan keyframe akhir untuk mengarahkan perubahan visual.
- Easing dipilih sesuai maksud (ease in-out untuk kamera, spring untuk objek jatuh/memantul).

Jangan memaksakan endpoint yang ketat apabila gerakan alami lebih baik.

## Render dan cek

- Sebelum render penuh: `node tools/cek-mandiri.mjs` (harus OK) dan cek komposisi (`tools/cek-sutradara.mjs`).
- Render lewat Remotion (`npx remotion render`), berjalan lokal tanpa jaringan.

---

# PHASE D — AUDIO AND EDITING

### STEP 6 — Voice-over

Voice-over dibuat setelah script final disetujui.

Rules:

- Gunakan suara yang sama dengan reference video.
- Gunakan satu take untuk produksi awal.
- Jangan regenerate seluruh audio hanya karena satu kalimat perlu diperbaiki.
- Revisi bagian yang berubah saja jika memungkinkan.
- Pastikan pronunciation.
- Pastikan pacing natural.
- Jangan menggunakan delivery terlalu monoton.
- Sesuaikan pause dengan storytelling.

Target voice-over:

Natural, conversational, slightly suspenseful when required, but not exaggerated.

---

### STEP 7 — Editing and composition

Susun:

1. Video clips.
2. Voice-over.
3. Sound effects.
4. Background music.
5. Text overlay.
6. Transitions.

## Audio hierarchy

1. Voice-over.
2. Important SFX.
3. Background music.

Background music tidak boleh mengganggu narasi.

Sound effects digunakan secara selektif.

Contoh:

- Impact.
- Whoosh.
- Brake.
- Wind.
- Footsteps.
- Ambient environment.
- Room tone.

Jangan menambahkan SFX pada setiap perpindahan shot.

## Text overlay

Text overlay digunakan untuk:

- Hook.
- Important numbers.
- Key claims.
- Contradiction.
- Important conclusion.

Aturan:

- Maksimal satu pesan utama per layar.
- Gunakan kalimat pendek.
- Jangan mengulang seluruh voice-over.
- Pastikan keterbacaan pada layar smartphone.
- Hindari teks terlalu kecil.
- Hindari terlalu banyak animasi.

Semua teks dibuat dari React/SVG di Remotion (tidak ada teks yang digambar generator), sehingga selalu akurat dan dapat diedit.

---

# PHASE E — QUALITY CONTROL

### STEP 8 — Final QC and publishing

Sebelum posting, video harus melewati checklist berikut.

## Fact check

- [ ] Setiap klaim faktual utama memiliki sumber.
- [ ] Tidak ada angka yang tidak terverifikasi.
- [ ] Tidak ada kesimpulan yang melebihi bukti.
- [ ] Simplifikasi visual tidak mengubah fakta.
- [ ] Visual yang bersifat ilustrasi tidak menyesatkan.

## Visual QC

- [ ] `node tools/cek-mandiri.mjs` OK (tanpa API AI/jaringan).
- [ ] Rumah/objek sama di semua shot (komponen dan parameter identik).
- [ ] Tidak ada z-fighting, objek tembus, atau celah geometri.
- [ ] Tidak ada flickering akibat bayangan/aliasing yang mengganggu.
- [ ] Tidak ada gerakan fisik yang salah.
- [ ] Proporsi masuk akal (ukuran nyata) dan cutaway/diagram tidak menyesatkan fakta.
- [ ] Lighting konsisten.
- [ ] Warna konsisten.
- [ ] Material konsisten.
- [ ] Kamera tidak bergerak secara tidak sengaja.
- [ ] Tidak ada wajah atau identitas orang nyata yang tidak diperlukan.
- [ ] Tidak ada logo atau merek yang tidak relevan.
- [ ] Teks terbaca di layar HP dan tidak terpotong tepi layar.

## Audio QC

- [ ] Voice-over jelas.
- [ ] Tidak ada clipping.
- [ ] Volume stabil.
- [ ] Musik tidak mengganggu.
- [ ] SFX sesuai adegan.
- [ ] Tidak ada audio yang terpotong.

## Editing QC

- [ ] Hook langsung muncul.
- [ ] Tidak ada intro yang tidak diperlukan.
- [ ] Tidak ada dead space.
- [ ] Pacing konsisten.
- [ ] Visual sesuai narasi.
- [ ] CTA tidak terlalu panjang.
- [ ] Video vertikal 9:16.
- [ ] Video dapat dipahami tanpa audio, sejauh memungkinkan.

## Publishing

Caption dan pinned comment dibuat menggunakan workflow humanizer yang sudah tersedia.

Simpan file dengan struktur:

`Fakta Rumah / E1 / #NN - Judul Video`

Isi folder:

- Research.
- Sources.
- Script.
- Beat sheet.
- Style reference (still render).
- Kode adegan (commit/branch) dan still keyframe.
- Klip render per adegan (opsional).
- Voice-over.
- SFX.
- Final video.
- Publishing data.

---

# 05. VISUAL LANGUAGE

## Semi-realistic style (procedural)

Visual harus berada di antara:

**Stylized illustration** ← E1 Target → **Photorealistic**

E1 tidak boleh terlalu cartoonish.

E1 juga tidak harus terlihat seperti rekaman kamera sungguhan.

Target:

- Architectural realism (proporsi dan detail nyata).
- Cinematic lighting.
- Realistic procedural materials.
- Natural depth.
- Slightly stylized composition.
- Controlled atmosphere.

## Color direction

Gunakan color palette yang konsisten.

Color grading harus:

- Natural.
- Cinematic.
- Tidak terlalu saturated.
- Tidak terlalu HDR.
- Tidak terlalu gelap sehingga detail hilang.

Setiap video boleh memiliki suasana yang berbeda sesuai topik, tetapi tetap berada dalam visual identity yang sama.

## Composition

Prioritaskan:

- Subject readability.
- Strong foreground/background separation.
- Clear focal point.
- Vertical composition.
- Negative space untuk text overlay.
- Depth.

Jangan membuat gambar terlalu ramai.

Saat visual realistis kalah jelas dari diagram, cross-section, atau perbandingan sederhana, pilih yang lebih jelas.

Visual harus langsung dapat dipahami dalam 1–2 detik.

---

# 06. RETENTION STRUCTURE

Target durasi:

**50–70 detik.**

## Retention framework

| Time | Narrative function | Visual requirement |
|---|---|---|
| 0–3s | Hook | Strongest image, immediate tension |
| 3–10s | Establish the claim | Clear visual explanation |
| 10–19s | First evidence | Visual change or reveal |
| 19–26s | Main payoff | Important information, hold briefly |
| 26–33s | Twist | Change perspective or reveal |
| 33–44s | Action + callback | Return to opening visual |
| 44–50s | Closing + CTA | Short and direct |

Timing bukan aturan absolut.

Jika script membutuhkan timing berbeda, beat sheet boleh menyesuaikan selama struktur storytelling tetap efektif.

## Visual change

Perubahan visual setiap 3–5 detik merupakan target pacing, bukan kewajiban.

Perubahan dapat berupa:

- New shot.
- Camera movement.
- Object movement.
- Lighting change.
- Visual comparison.
- Text emphasis.
- Reveal.

Jangan memotong shot hanya karena sudah 5 detik apabila visual masih memiliki nilai storytelling.

---

# 07. CAMERA MOVEMENT REFERENCE

## POV forward movement

**Feeling:** Threat, urgency, immersion.

Use:

- Driving toward a house.
- Approaching a dangerous situation.
- Experiencing the scene directly.

Implementasi:

Kamera perspektif (FOV tetap) bergerak maju sepanjang jalur `camAt` ke arah subjek, kecepatan terkontrol, ease in-out, sedikit goyang halus (noise ber-seed) bila perlu.

## Slow push-in

**Feeling:** Focus, tension, importance.

Use:

- Hook.
- Important detail.
- Payoff.

## Crane-down

**Feeling:** Discovery.

Use:

- Establishing a location.
- Revealing a structure.
- Transitioning from overview to detail.

## Orbit

**Feeling:** Spatial understanding.

Use:

- Architecture.
- Environmental comparison.
- Structural explanation.

## Pan

**Feeling:** Connection.

Use:

- Comparing two locations.
- Revealing a twist.
- Moving attention from one object to another.

## Static shot

**Feeling:** Emphasis.

Use:

- Important claims.
- Suspense.
- Payoff.

Rules:

Camera movement must support the emotional purpose of the scene.

---

# 08. PILOT TEST

Sebelum produksi tiga video penuh, lakukan satu pilot.

## Pilot objective

Menguji:

- Visual quality.
- Style consistency.
- Kualitas render dan animasi kode.
- Motion reliability.
- Waktu render.
- Production time.
- Editing workflow.
- Text overlay workflow.

## Pilot scope

Buat:

**1 adegan 3D (still keyframe) + 1 klip render, durasi sekitar 5 detik.**

Pilot menggunakan salah satu shot yang paling representatif dari video #9.

## Pilot evaluation

| Criteria | Evaluation |
|---|---|
| Visual quality | Apakah cukup bagus untuk channel? |
| Style | Apakah sesuai arah visual? |
| Motion | Apakah gerakan natural? |
| Consistency | Apakah dapat direplikasi? |
| Cost | Berapa waktu render dan jumlah revisi kode? (kredit generator = 0) |
| Time | Berapa lama prosesnya? |
| Usability | Apakah workflow dapat dijalankan? |

## Pilot decision

Jika pilot tidak memenuhi standar:

- Revisi kode adegan (geometri, material, lighting).
- Revisi style.
- Ubah camera movement.
- Ganti metode visual (mis. cutaway atau diagram).
- Evaluasi ulang waktu produksi.

Jangan lanjut ke produksi penuh sebelum pilot disetujui.

---

# 09. RESOURCE MANAGEMENT

Kredit generator visual = **0** (tidak ada generator). Sumber daya yang dikelola: waktu render, token, dan kredit suara.

## Resource policy

Tidak boleh render penuh sebelum pilot selesai.

Claude harus:

1. Mengikuti aturan hemat token (CLAUDE.md): revisi ditampung, 1 sheet cek per putaran, render di latar belakang.
2. Memperkirakan waktu render sebelum render penuh (±25 menit untuk 50 detik di container tanpa GPU).
3. Mendahulukan cek lewat skrip (`cek-mandiri`, `cek-sutradara`, `tsc`) daripada melihat gambar.
4. Menghindari render ulang tanpa alasan; render penuh hanya setelah still disetujui.
5. Memakai aset reusable dari kit sebelum membuat komponen baru.
6. Suara tetap: VO 1 take, aturan hemat ElevenLabs (CLAUDE.md) berlaku.

## Before heavy render

Claude harus melaporkan:

- Komposisi yang akan dirender.
- Durasi dan estimasi waktu render.
- Hasil `cek-mandiri` dan `cek-sutradara`.
- Risiko (tembus objek, teks terpotong, gerak kaku).

## Re-render policy

Render ulang hanya apabila:

- Visual tidak sesuai brief.
- Ada kesalahan komposisi.
- Ada masalah konsistensi.
- Animasi gagal.
- Fakta visual salah.
- Output tidak layak digunakan.

Jangan render ulang hanya untuk perubahan kosmetik kecil yang tidak memengaruhi kualitas final.

---

# 10. CLAUDE EXECUTION RULES

Claude bertindak sebagai production assistant dan research assistant, bukan pemilik keputusan kreatif final.

## Claude may execute autonomously

- Research.
- Source collection.
- Drafting scripts.
- Hook alternatives.
- Beat sheet.
- Shot planning.
- Scene planning dan penulisan kode adegan (draf).
- Organizing project files.
- Quality-control review.
- Performance analysis.
- Creating production logs.

## Approval required before

- Selecting final topic.
- Finalizing script.
- Approving style reference.
- Rendering batch besar (banyak video/komposisi sekaligus).
- Memakai aset lokal eksternal baru (tetap harus berlisensi dan disetujui).
- Spending kredit suara dalam jumlah signifikan.
- Publishing.
- Uploading to public platforms.
- Merging changes into main branch.

## Before heavy render

Claude must first provide:

1. Production plan.
2. Rencana adegan (WORKFLOW Step 3).
3. Hasil `cek-mandiri` dan `cek-sutradara`.
4. Estimasi waktu render.
5. Expected output.
6. Risks.
7. Required approval.

**No approval = no large-scale rendering.**

---

# 11. EXPERIMENT LOG

Setiap video harus memiliki log tersendiri.

| Field | Value |
|---|---|
| Experiment | E1 |
| Video ID | |
| Topic | |
| Date published | |
| Visual style | Semi-realistic |
| Duration | |
| Hook | |
| Production time | |
| Waktu render / jumlah putaran revisi kode | |
| Views at 24h | |
| Views at 48h | |
| Average watch time | |
| Retention | |
| Completion rate | |
| Shares | |
| Saves | |
| Comments | |
| Notes | |

Catat juga masalah produksi.

Contoh:

- Inkonsistensi komponen/material antar-shot.
- Animasi kaku atau gagal.
- Camera movement failure.
- Text overlay issue.
- Render terlalu lama.
- Editing delay.

---

# 12. OPEN DECISIONS

Keputusan berikut belum final:

1. Final selection of 3 experiment topics.
2. TTS voice: Gemini or ElevenLabs.
3. Final semi-realistic visual direction (pustaka material dan lighting preset).
4. Persetujuan aset lokal eksternal (mis. model CC0), bila dipakai.
5. Anggaran waktu render.
6. Text overlay workflow.
6a. Suara: tetap Gemini/ElevenLabs atau alternatif lokal (di luar cakupan aset visual).
7. Final publishing schedule.
8. Drive permission.
9. Git branch and merge policy.
10. Approval of pilot.

---

# 13. FINAL EXECUTION SEQUENCE

Claude harus mengikuti urutan berikut:

**PHASE 1 — Research**

Topic → Sources → Fact verification → Research summary

↓

**PHASE 2 — Script**

3 Hooks → Script → Beat sheet → Owner approval

↓

**PHASE 3 — Visual development**

Style reference (still kode) → Pilot adegan → Pilot animasi/render → Owner approval

↓

**PHASE 4 — Production**

Scene code → Animation → Voice-over → Composition → `cek-mandiri` + QC → Render

↓

**PHASE 5 — Publishing**

Final approval → Publish → Metrics collection

↓

**PHASE 6 — Evaluation**

Compare E1 against B0 and #9 → Review metrics → Continue / Iterate / Stop

---

## PRINCIPLE

**Do not optimize everything at once.**

The objective of E1 is to isolate the visual format as much as practical.

If the experiment succeeds, develop the visual workflow further.

If the experiment fails, identify the reason before abandoning the entire approach.

The final decision must be based on performance, production quality, consistency, and cost—not personal preference alone.
