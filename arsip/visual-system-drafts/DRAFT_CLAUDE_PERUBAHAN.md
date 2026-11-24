# Perubahan yang diusulkan pada `CLAUDE.md` (DRAFT)

**Ditambah (di "Arah aktif"):**
1. **Proyek video baru: wajib memastikan kategori video dan pendekatan visual sebelum keputusan kreatif besar** (Breakdown/How it works, Mitos vs Fakta, Fenomena/Science, Perbandingan, Cerita/Investigasi, Hybrid). Jangan menulis naskah, storyboard, atau kode sebelum kategori dikonfirmasi. Jangan menanyakan ulang yang sudah jelas dari brief.
2. **Identitas visual = `docs/visual-system/VISUAL_STYLE_SPEC.md`**: stylized/flat illustration dan ilustrasi berdimensi sederhana; default tingkat detail B (outline tipis + bayangan sederhana); sistem peran warna (preset boleh, krem salah satu). Bukan default: semi-realistis, 3D realistis, PBR, pencahayaan realistis, kabut, CGI sinematik. 3D hanya bila perlu dan terstilisasi; prioritaskan SVG/CSS/2D bila lebih jelas.
3. **Proses = 8 langkah** (`WORKFLOW.md`): brief+kategori → analisis → arah visual → naskah → storyboard → review → produksi → visual QA. Tanpa birokrasi: tanya hanya yang belum jelas; approval hanya untuk keputusan kreatif besar.
4. **Tidak coding sebelum arah visual dan storyboard disetujui** (kecuali storyboard hanya menurunkan arah yang sudah disepakati, cukup dilaporkan).
5. Animasi menjelaskan sebab-akibat (spesifikasi §12); breakdown hanya bila narasi/kategori membutuhkannya.

**Diganti:**
- Baris "Visual 100% dari kode (Remotion + three.js ...)" → "Visual dari kode (Remotion, React, SVG, CSS, Canvas bila relevan; three.js hanya bila perlu). Dilarang AI API."
- Baris "Foto nyata boleh diolah..." → foto fleksibel (crop, pan/zoom bertujuan, layering/parallax, masking/reveal, anotasi, compositing); treatment grafis opsional, tidak diwajibkan.
- Baris "Subtitle default MATI..." → ditambah: kartu judul, kicker, hook box, kotak teks **opsional**, bukan template wajib.
- Baris "Keputusan visual = `sutradara`..." → pertahankan; tambah "memilih teknik berurutan 2D → 2.5D → 3D".
- "Aturan konsistensi (dipertahankan)": "pustaka material `look.tsx`" **dihapus** (gaya semi-realistis); ganti "palet dan peran warna (`style/palet.json`), tinta/outline tipis, bayangan sederhana".

**Dihapus/diarsipkan:** semua rujukan "semi-realistis" dan "arsitektur realistis".
**Tidak berubah:** persetujuan merge/publikasi, Drive, humanizer, CTA, suara, jujur-QA, gerbang teknis.
