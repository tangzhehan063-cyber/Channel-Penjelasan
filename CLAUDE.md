# Channel Penjelasan: aturan kerja untuk Claude

Channel pengetahuan, seri utama **"fakta rumah"**, Bahasa Indonesia santai, audiens 35+, gaya visual **editorial 3D bersih**.
(Channel stickman self-improvement ada di repo terpisah `RAKA`; jangan campur gaya.)

**Di awal setiap sesi baca `STATUS.md`**, lalu `style/style.md` (tampilan wajib) dan `naskah/alur-naskah.md` (alur naskah Tahap 1–5). Perbarui `STATUS.md` setiap ada kemajuan dan push ke repo; jangan menunggu akhir sesi.

## Aturan inti
- Fakta harus akurat dengan sumber; tandai "(perkiraan)" dan penyederhanaan visual; jangan mengarang angka, kutipan, atau jumlah tayangan.
- Tahap ide: riset tren (ScrapeMedsos, TikTok/YouTube region ID) + **saran improvisasi topik** + satu rekomendasi; simpan ke `riset/`.
- Storyboard (Tahap 2) memuat bagian "Fakta, tren & asumsi" lalu tabel beat; contoh nada & format di `referensi/` (video #1–#4).
- **Setelah video selesai, SELALU buat caption posting + cover**: caption ke `caption/<slug>.md` (TikTok/Reels, YouTube Shorts, komentar pin, 3 judul alternatif, 5 tag), cover 1080×1920 ke `cover/<slug>.png`.
- Penutup video: "Follow buat fakta rumah berikutnya!"

## Produksi
- Engine: Remotion + three.js di `remotion/` (`npx remotion studio`, `npx remotion render <Komposisi> out/<slug>.mp4`). `remotion.config.ts` memakai `swangle` + Chromium `/opt/pw-browsers/chromium` untuk container cloud tanpa GPU.
- Objek 3D dibuat prosedural (contoh: `remotion/src/pengetahuan/Brain.tsx`), warna koral `#f27a63`, latar kertas, label garis tipis (`Scene.tsx`: `Paper`, `Ghost`, `Callout`).
- Suara: ElevenLabs `eleven_v4` (default voice Riri Rida `tCKeP99grYL9wZRg6sQ9`) atau Google AI Studio bila user memilih; angka di teks TTS ditulis sebagai kata. Unduh dari `elevenlabsusercontent.com`.
- Timestamp: ElevenLabs Scribe → `python3 tools/scribe_to_timeline.py <words.json> <out.json>` (angka jadi numeral, tag audio dibuang). Whisper/huggingface diblokir di cloud.
- Container baru: `./setup.sh`.
