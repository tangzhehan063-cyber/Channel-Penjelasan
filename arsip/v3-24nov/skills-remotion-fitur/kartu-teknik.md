# Kartu teknik (status per 24 Nov 2026; uji: container CPU/SwiftShader, tanpa GPU)

Status: **V** = terverifikasi jalan (render dilihat) · **G** = gagal di lingkungan CPU ini · **?** = belum diuji. Biaya render: rendah/sedang/tinggi relatif di swangle (video penuh ±10 mnt per 58 dtk sebagai pembanding).
Format: *apa* · *komunikasi* · *pakai bila* · *jangan bila* · *kombinasi* · *syarat* · *biaya* · *implementasi di repo* · *status*.

## Transisi
- **Garis tanah menggambar + strip jatuh ("peel")** · memisahkan dunia terlihat/tersembunyi · transisi foto→penampang dengan garis horizontal nyata · garis tak jelas di sumber · dengan garis cahaya hangat + penampang gelap · CSS/SVG saja · rendah · `e1/lab/LabTransisi.tsx` (v `peel`) · **V** (perlu polesan)
- **Dorong ke objek lalu memudar ("push")** · kamera masuk ke bahan · bila ada objek kecil jelas sebagai pintu masuk · foto resolusi rendah (kabur di tengah) · dengan paralaks · CSS transform · rendah · `LabTransisi` v `push` · **V**
- **Bidang potong three.js (dolhouse)** · irisan maket, struktur tersembunyi terbuka · rekonstruksi 3D · eksterior 3D belum meyakinkan · dengan lampu hangat · `localClippingEnabled`, cap per padatan, kamera tak masuk padatan · sedang-tinggi (bayangan) · `e1/Pilot02B.tsx` · **V**
- **`iris`** (`@remotion/transitions/iris`) · fokus bulat di titik · bila pusat bermotif (parameter pusat; default tengah layar) · pusat sembarang · penampang belakangnya · DOM/SVG · rendah · `e1/lab/LabTransisi.tsx` · **V**
- **`crossZoom`, `pushCut`, presentasi lain** · blur radial dramatis / potong · hanya bila pergantian memang dramatis · sebagai hiasan · — · shader di CPU jalan · sedang · `LabTransisi` · **V** (crossZoom, pushCut); presentasi lain (`cube, flip, ripple, crosswarp, dissolve, ...`) **?**
- Catatan: `TransitionSeries.Transition` memendekkan timeline; kunci ke VO dengan hati-hati (`Overlay` belum diuji **?**).

## Grading, cahaya, atmosfer
- **Grading CSS (`filter: contrast saturate brightness sepia`) + gradien** · mood, kontinuitas foto↔3D · seluruh adegan · satu grade untuk semua adegan bila cerita butuh kontras · sorot hangat di objek penting · rendah · `Tanah02.tsx`, `lab/LabFoto.tsx` (v `grade`) · **V**
- **Vignette (gradien radial), sorot cahaya hangat (`mix-blend-mode: soft-light`)** · menuntun mata · objek fokus perlu menonjol · berlebihan membuat kusam (matriks foto) · — · rendah · `LabFoto` · **V**
- **Grain (SVG `feTurbulence`, seed per frame)** · menyatukan foto dan 3D · selalu halus (0,12-0,18) · kuat sampai bising · — · rendah · `Pilot02.tsx` `Grain`, `lab/shared.tsx` · **V**
- **Cahaya three.js low-key (lampu titik hangat + rim biru + kabut)** · volume, drama, memandu mata ke pondasi · momen "di dalam tanah" · adegan penjelasan netral · dengan material basah (roughness rendah) · three.js · sedang · `LabSek` v `noir3d` · **V** (paling kaya di matriks)
- **Cahaya depan datar** · jelas tapi datar · hampir tak pernah · — · — · rendah · `LabSek` v `pbr3d` · **V** (tidak disarankan)
- **Light leak / film burn / glow / halftone / chromatic-aberration / vignette / noise / duotone via `@remotion/effects`** · efek film/gaya · bila bermotif cahaya/flash/perubahan dramatis · hiasan setiap potongan · hanya pada `Img`/`Solid`/`HtmlInCanvas`/`Video`; impor per sub-path; rentang parameter terbatas · tak diketahui · — · **G** di CPU ini (0/20); GPU **?**. Pakai padanan CSS/SVG di atas.
- **Kabut three.js (`<fog>`)**, bayangan lembut · kedalaman, ruang · eksterior/dalam tanah · bayangan banyak mesh menambah waktu render · — · sedang · `Pilot02B.tsx` · **V**

## Foto sebagai elemen terolah
- **Pita foto + gradien langit** · konteks/bukti · dasar saja · sendirian (60% layar kosong) · — · rendah · `lab/shared.tsx` `Pita` · **V** (lemah sendirian)
- **Paralaks 2.5D, bidang three.js bertopeng (alphaMap poligon)** · kedalaman nyata, sudut berubah · foto ber-lapisan jelas (depan/tengah/belakang) · topeng kasar (artefak "atap ganda") · dengan grade + kamera orbit kecil · three.js · rendah-sedang · `lab/LabFoto.tsx` v `persp` · **V** (perlu topeng bersih)
- **Paralaks 2.5D klip CSS** · kedalaman halus · bila perbedaan lapis kuat · lapis tipis nyaris tak terlihat · — · rendah · `LabFoto` v `layers` · **V** (lemah)
- **Foto sebagai bidang di dunia 3D (garis tanah y=0)** · foto dan 3D berbagi garis · transisi ke penampang · resolusi rendah di-push >±1,8× · dengan garis cahaya · three.js · rendah · `e1/lib/footage.tsx`, `Pilot02.tsx` · **V**

## Penampang / tekstur / material
- **Penampang editorial SVG gelap** (siluet, satu garis cahaya, strata tipis, label berjarak) · bersih, bermood · pernyataan inti (memampat) · detail material penting · dengan grain · SVG/CSS · rendah · `lab/shared.tsx` `SekEditorial` · **V**
- **Material prosedural berrelief** (canvas bertekstur ber-seed + bump) · tanah/beton/kayu meyakinkan · 3D dekat · permukaan kasar di macro · roughness rendah untuk tanah basah · three.js · rendah · `e1/look.tsx`, `Pilot02.tsx` `usePenampang` · **V**
- **Diagram pita datar** · jelas tapi seperti slide · jarang · — · — · rendah · `LabSek` v `diagram` · **V** (tidak disarankan)

## Gerak, kamera, blur
- **Kamera dari data (`shots.json`)** · kamera = keputusan tertulis · adegan bershot · — · — · tidak ada · `e1/lib/kamera.ts` · **V**
- **Motion blur (`@remotion/motion-blur` `CameraMotionBlur`)** · persepsi gerak cepat pendek · gerak cepat pendek yang makin jelas · gerak lambat/teks (menurunkan keterbacaan) · render N× per frame · tinggi · — · **?**
- **Audio-reaktif (`@remotion/media-utils`)** · gerak mengikuti suara · bila suara memang pemicu visual · dekorasi · file .wav · rendah · — · **?**

## Partikel, simulasi
- **Titik air/partikel sebagai mesh bola ber-seed** · aliran · aliran kecil · jumlah besar (ratusan mesh) · seed, fungsi dari waktu · sedang · `Pilot02.tsx`/`Pilot02B.tsx` · **V**. `InstancedMesh` belum dipakai **?**
- **Pemampatan/gravitasi sederhana (fungsi waktu ber-ease dengan fase menahan)** · sebab-akibat fisik · mekanisme perubahan lambat · tanpa penanda acuan · garis/tiang acuan tetap · three.js · rendah · `Pilot02B.tsx` `kompres` · **V**

## Tipografi, informasi
- **Label bergaris (`proj` + pil gelap)** · nama bagian · saat kamera sampai · berlebihan · — · SVG/CSS · rendah · `e1/lib/anot.tsx` · **V**
- **Teks penekanan, angka, penghitung** · momen wahyu · hanya bila gambar belum mengatakan · menyalin narasi · — · CSS · rendah · `kit/teks.tsx` (`Chip`, `Title`; `Captions` bila subtitle diminta) · **V**

## Suara
- **SFX tersintesis + ambience + campur** · bobot, ruang, hening · tiap shot (keputusan sutradara) · menutupi VO · loudnorm −15..−13 LUFS · tools/make_sfx*.py, tools/mix-audio.mjs (membaca `beats.json`/`const SFX`; E1 perlu adaptor) · rendah · `remotion/public/sfx/` (17 berkas) · **?** (belum dipakai di E1)
