# Gaya caption & komentar pertama (pegangan tetap, tanpa perlu scrape)
Disarikan dari scrape TikTok (8–9 Nov) + Facebook (9 Nov 2026). Scrape hanya opsional untuk topik baru.

## Nada
- Audiens FB 35+: kalimat utuh tapi santai, seperti ngobrol sama tetangga. Sapaan "min/bang/mas" wajar di komentar.
- **Caption 3 baris saja**: baris 1 anggapan orang ("Katanya…"), baris 2 satu fakta paling kena, baris 3 pertanyaan. Singkatan biasa (yg, gak, aja) boleh. Hashtag 3, bukan 5.
- 2–3 kalimat pendek, maks. 1 emoji (😄 😅 😑). "wkwk" boleh sesekali.
- Buka dengan keluhan/debat yang orang alami, bukan definisi. Tutup dengan sikap netral ("kita nggak jualan").

## Kosakata nyata (pakai bila cocok)
pamali · rejeki/rezeki · "katanya ya katanya" · rem blong · nyelonong · "di kompleks aman aja" · yg · gak · aja · bun · auto karat · karatan · keropos/kropos · rembes · jeglek · kopong · ngendap · lapuk · bocor terus · harga naik · "semua ada resikonya" · "rumah nenek awet" · "deket laut" · "bukan berarti anti karat"

## Komentar pertama
Satu kalimat tanya yang menyebut situasi spesifik penonton ("Yg rumahnya persis di tengah pertigaan, pernah…?"). Jangan mengarang pengalaman kreator.
Pertanyaan pengalaman yang gampang dijawab: "udah berapa tahun?", "punya kalian ke mana?", "ada yang pernah…?". Bukan ringkasan video.

## Dilarang
"Yuk simak", "Tahukah kamu", "mari kita", "di era modern ini", "penting untuk diingat", daftar berpoin, tanda "—" berlebihan, nama merek.

## Format file caption (ringkas)
Facebook/Reels (3 baris + 5 hashtag) · komentar pin · YouTube Shorts (judul + 1–2 kalimat + sumber) · 3 judul alternatif · 5 tag.

## Aturan alur caption (dipindah dari CLAUDE.md lama, 25 Nov 2026)
- **Humanizer wajib (perintah user 13 Nov, berlaku untuk semua teks publik):** naskah, caption, judul (termasuk alternatif), deskripsi, komentar pin, dan komentar pertama SELALU dilewatkan skill `anthropic-skills:humanizer` (hapus pola "bukan X tapi Y", penutup satu baris, triad paksa, tanda "—", dan sapaan khas AI) sebelum dikirim ke user atau diunggah ke Drive. Fakta, angka, dan sumber tidak boleh berubah; batas karakter caption tetap berlaku.
- Begitu user menyatakan **ACC/final** untuk naskah, langsung kirim **caption posting + komentar pertama** (jangan tunggu video selesai; cover tetap dibuat setelah render).
- **Pegangan utama: `caption/gaya-caption.md`** (gaya sudah disimpan; scrape tidak wajib). Scrape hanya bila topik/istilahnya baru dan kredit masih ada; temuan baru ditambahkan ke file itu.
- Riset bahasa (opsional): pakai ScrapeMedsos YouTube (`v1_youtube_search`, lalu komentar video teratas dengan `v1_youtube_video_comments`) untuk topik yang sama. Catat kata, singkatan, dan gaya yang benar-benar dipakai orang (mis. "jeglek", "kopong", "rembes", "wkwk", "auto", "relate banget").
- Tulis caption & komentar pertama meniru ritme itu: kalimat pendek, boleh tidak baku, emoji secukupnya (0–2), tanpa frasa khas AI ("Yuk simak!", "Tahukah kamu", "di era modern ini", "mari kita", "penting untuk diingat", tanda "—" berlebihan, daftar berpoin di caption).
- Komentar pertama = pancingan diskusi dari sudut pandang kreator (pertanyaan spesifik atau "aku dulu juga…"), bukan ringkasan video.
- Simpan contoh bahasa hasil scrape (maks. 5 kutipan pendek) di file caption sebagai bukti, jangan menyalin komentar orang utuh ke caption.
