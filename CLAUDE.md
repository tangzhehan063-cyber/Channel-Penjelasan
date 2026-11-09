# Channel Penjelasan: aturan kerja untuk Claude

Channel pengetahuan, seri utama **"fakta rumah"**, Bahasa Indonesia santai, audiens 35+, gaya visual **editorial 3D bersih**.
(Channel stickman self-improvement ada di repo terpisah `RAKA`; jangan campur gaya.)

**Di awal setiap sesi baca `STATUS.md` saja**, lalu baca file lain hanya sesuai tahap yang dikerjakan (lihat "Hemat token"). Perbarui `STATUS.md` setiap ada kemajuan dan push ke repo; jangan menunggu akhir sesi.

## Hemat token (wajib)
- Baca sesuai tahap: Tahap 1–2 → `naskah/alur-naskah.md` + skill `naskah-viral`; Tahap 4–5 → `style/style.md` + `style/aset.md` (Gaya A) atau `style/diorama-kertas/README.md` (Gaya B, diorama kertas); caption → bagian caption di file ini. Jangan membaca ulang file yang tidak berubah.
- Pakai `grep`/`sed -n` untuk bagian tertentu, bukan membaca file utuh. Gambar dibaca hanya untuk cek visual: still `--scale=0.5`, gabung jadi satu contact sheet, maks. 1–2 sheet per putaran.
- Video baru = salin `remotion/src/v05/` sebagai template, ganti data (timeline beat, judul, kamera), jangan menulis ulang dari nol.
- Render penuh (±25 menit) hanya setelah still disetujui; kumpulkan revisi lalu render sekali. Tunggu render dengan satu notifikasi selesai, tanpa laporan progres per event.
- Hasil ScrapeMedsos selalu disimpan ringkas di `riset/` agar tidak di-scrape ulang.
- Jawaban ke user singkat: hasil, file, keputusan yang dibutuhkan.
- Pekerjaan selesai per tahap di-merge ke `main` (sesi baru selalu mulai dari `main`).

## Aturan inti
- Fakta harus akurat dengan sumber; tandai "(perkiraan)" dan penyederhanaan visual; jangan mengarang angka, kutipan, atau jumlah tayangan.
- **Riset channel ini cukup di Facebook** (ScrapeMedsos `v1_facebook_search_videos` + `v1_facebook_post_comments`); TikTok dipakai channel self-improve (repo `RAKA`), bukan di sini. **Semua output ditulis ringkas** (riset, storyboard, caption, laporan).
- Tahap ide: riset tren Facebook + **saran improvisasi topik** + satu rekomendasi; simpan ringkas ke `riset/`.
- **Saat menulis/merevisi naskah, pakai skill `naskah-viral`** (`.claude/skills/naskah-viral/SKILL.md`, panggil `/naskah-viral <topik>`): lapisan pola viral di atas `naskah/alur-naskah.md`.
- Storyboard (Tahap 2) memuat bagian "Fakta, tren & asumsi" lalu tabel beat; contoh nada & format di `referensi/` (video #1–#4).
- **Setelah video selesai, SELALU buat caption posting + cover**: caption ringkas ke `caption/<slug>.md` (Facebook/Reels, YouTube Shorts, komentar pin, 3 judul alternatif, 5 tag), cover 1080×1920 ke `cover/<slug>.png`.
- Penutup video: "Follow buat fakta rumah berikutnya!"

## Produksi
- Engine: Remotion + three.js di `remotion/` (`npx remotion studio`, `npx remotion render <Komposisi> out/<slug>.mp4`). `remotion.config.ts` memakai `swangle` + Chromium `/opt/pw-browsers/chromium` untuk container cloud tanpa GPU.
- Objek 3D dibuat prosedural (contoh: `remotion/src/pengetahuan/Brain.tsx`), warna koral `#f27a63`, latar kertas, label garis tipis (`Scene.tsx`: `Paper`, `Ghost`, `Callout`).
- Suara: ElevenLabs `eleven_v4` (default voice Riri Rida `tCKeP99grYL9wZRg6sQ9`) atau Google AI Studio bila user memilih; angka di teks TTS ditulis sebagai kata. Unduh dari `elevenlabsusercontent.com`.
- Timestamp: ElevenLabs Scribe → `python3 tools/scribe_to_timeline.py <words.json> <out.json>` (angka jadi numeral, tag audio dibuang). Whisper/huggingface diblokir di cloud.
- Container baru: `./setup.sh`.

## Caption & komentar pertama (berlaku setelah user ACC naskah final)
- Begitu user menyatakan **ACC/final** untuk naskah, langsung kirim **caption posting + komentar pertama** (jangan tunggu video selesai; cover tetap dibuat setelah render).
- **Pegangan utama: `caption/gaya-caption.md`** (gaya sudah disimpan; scrape tidak wajib). Scrape hanya bila topik/istilahnya baru dan kredit masih ada; temuan baru ditambahkan ke file itu.
- Riset bahasa (opsional): pakai ScrapeMedsos Facebook (`v1_facebook_search_videos`, lalu komentar video teratas dengan `v1_facebook_post_comments`) untuk topik yang sama. Catat kata, singkatan, dan gaya yang benar-benar dipakai orang (mis. "jeglek", "kopong", "rembes", "wkwk", "auto", "relate banget").
- Tulis caption & komentar pertama meniru ritme itu: kalimat pendek, boleh tidak baku, emoji secukupnya (0–2), tanpa frasa khas AI ("Yuk simak!", "Tahukah kamu", "di era modern ini", "mari kita", "penting untuk diingat", tanda "—" berlebihan, daftar berpoin di caption).
- Komentar pertama = pancingan diskusi dari sudut pandang kreator (pertanyaan spesifik atau "aku dulu juga…"), bukan ringkasan video.
- Simpan contoh bahasa hasil scrape (maks. 5 kutipan pendek) di file caption sebagai bukti, jangan menyalin komentar orang utuh ke caption.
