# E1: desain eksperimen, metrik, dan kerangka retensi

Dipindah dari workflow lama (`arsip/WORKFLOW-e1-v2-semi-realistis.md`) pada 25 Nov 2026 tanpa mengubah angka/target.
**Catatan gaya:** variabel "semi-realistis" di bawah adalah rumusan awal. Sejak 25 Nov 2026 gaya eksperimen yang berlaku = **gaya E1-03** (dunia miniatur 3D distilisasi, `style/gaya-e1-03.md`). Urutan kerja ada di `WORKFLOW.md`.

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

