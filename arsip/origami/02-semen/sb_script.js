const BEATS = [
 {n:1,a:0,b:3.5,k:2.5,title:'Hook',text:'Lem tembok rumahmu = / BATU DIBAKAR',
  vo:'Tahu nggak? Tembok rumahmu itu sebenarnya "dilem" pakai batu yang dibakar.',
  tr:'Pembuka: tungku putar kertas terlipat naik, api kertas menyala di ujungnya, dan tumpukan batu kapur serta tanah liat muncul di meja. Papan judul berdiri di belakang.',
  sfx:'Lipatan kertas besar, desis api (paper crackle), crease papan.'},
 {n:2,a:3.5,b:9,k:7.5,title:'Bahan & tungku',text:'Bahannya: / KAPUR + TANAH LIAT · kartu 1.450°C',
  vo:'Bahannya cuma batu kapur dan tanah liat. Dibakar di tungku putar sampai keluar jadi butiran yang namanya klinker.',
  tr:'Kontinu: batu meloncat masuk ke mulut tungku. Kartu suhu terlipat naik dan menghitung 0 sampai 1.450°C (flare kecil). Butiran klinker gelap menggelinding keluar.',
  sfx:'Tap batu, tick penghitung suhu yang makin cepat, crease saat angka 1.450 terkunci, gemerisik butiran.'},
 {n:3,a:9,b:13.5,k:12.8,title:'Digiling + gipsum',text:'Klinker digiling + / GIPSUM · 3–5%',
  vo:'Klinker digiling bareng sedikit gipsum, biar semennya nggak keburu mengeras. Jadilah bubuk abu-abu ini.',
  tr:'Kontinu: kamera dolly ke kanan. Klinker dan gipsum didorong panah lipat ke gilingan yang berputar. Bubuk abu-abu menumpuk, lalu karung SEMEN terlipat naik.',
  sfx:'Glide kamera, gemuruh gilingan (brown noise), desir bubuk, crease karung.'},
 {n:4,a:13.5,b:20,k:18.5,title:'Semen = lem',text:'Semen itu cuma / LEM-NYA · beton = semen+air+pasir+kerikil',
  vo:'Tapi semen bukan beton. Semen itu cuma lemnya. Dicampur air, pasir, dan kerikil, baru jadi beton.',
  tr:'Kontinu: semen, air, pasir, dan kerikil muncul berurutan dengan label masing-masing, lalu bergeser ke belakang dan berubah jadi blok BETON.',
  sfx:'Pop per bahan, cipratan kecil untuk air, geser kertas, thud blok beton.'},
 {n:5,a:20,b:27,k:26.5,title:'Kering? Bukan! (momen salah)',text:'Mengeras karena / KERING? ✗ → Bereaksi dengan / AIR',
  vo:'Banyak yang kira semen mengeras karena kering. Salah! Semen justru bereaksi dengan air, membentuk kristal yang mengunci pasir dan kerikil.',
  tr:'Kontinu: tetes air jatuh ke kerikil. Silang merah menempel di kata KERING diikuti push-in dan flare. Papan refold menjadi AIR, lalu jarum kristal tumbuh menyambung antar kerikil.',
  sfx:'Tetes air, slap + nada rendah "salah", flip papan, kristal tumbuh (crinkle halus).'},
 {n:6,a:27,b:31,k:30.2,title:'28 hari (angka kunci)',text:'Jaga tetap basah, / JANGAN cepat kering · 28 HARI',
  vo:'Makanya beton baru harus disiram terus. Kekuatannya diuji di umur dua puluh delapan hari.',
  tr:'Kontinu: kamera geser sedikit. Kolom kertas 3, 7, dan 28 hari naik bertahap. Kartu "28 HARI" terlipat naik sebagai pukulan terbesar + flare.',
  sfx:'Pleat kolom naik, IMPACT + ding di angka 28.'},
 {n:7,a:31,b:33.7,k:32.8,title:'Lompatan waktu: Romawi',text:'±1.900 tahun lalu / ROMAWI · kartu TAHUN 2026 → 125 M',
  vo:'Sekarang mundur jauh. Seribu sembilan ratus tahun lalu, Romawi sudah bikin "semen" dari kapur dan abu gunung api. Pantheon-nya masih berdiri.',
  tr:'LOMPATAN WAKTU: kamera melesat ke ujung meja dengan garis-garis kecepatan kertas. Kartu TAHUN di depan berputar mundur cepat dari 2026 ke 125 M, lalu mendarat dengan flare. Pantheon terlipat naik besar di panggungnya sendiri.',
  sfx:'Whoosh kertas panjang, tick kartu tahun yang makin rapat, dentum + flare saat mendarat di 125 M.'},
 {n:8,a:33.7,b:35.6,k:34.9,title:'Lompat ke 1824',text:'Lompat ke / 1824 · semen modern lahir di Inggris',
  vo:'Lompat ke tahun 1824: semen modern dipatenkan di Inggris.',
  tr:'Lompatan waktu kedua: kamera melesat lagi dan kartu tahun berputar maju 125 → 1824. Balok batu Portland terlipat naik.',
  sfx:'Whoosh kedua, tick cepat, crease balok.'},
 {n:9,a:35.6,b:40.2,k:37.5,title:'1910 Padang',text:'Lalu di Padang / 1910 · pabrik semen pertama Asia Tenggara',
  vo:'Dan tahun 1910, pabrik semen pertama di Asia Tenggara berdiri di Padang.',
  tr:'Lompatan terakhir 1824 → 1910. Pabrik Indarung terlipat naik dengan cerobong yang mengepul asap kertas, dan bintang muncul (puncak cerita).',
  sfx:'Whoosh, dentum kartu tahun, sparkle bintang.'},
 {n:10,a:40.2,b:43.5,k:42.8,title:'Takeaway + CTA',text:'Semen → lem batu buatan · FOLLOW',
  vo:'Jadi semen itu lem batu buatan. Follow buat fakta rumah berikutnya!',
  tr:'Kontinu: properti terlipat turun, kartu takeaway naik lalu refold menjadi kartu FOLLOW teal dengan bintang. Ditahan ±1 detik.',
  sfx:'Fold besar, tiga ding naik, sparkle.'},
];
(async () => {
  for (const f of ['700 40px "Space Grotesk"','400 40px "Space Grotesk"','400 40px "Space Mono"']) await document.fonts.load(f,'AaZz09');
  const grid = document.getElementById('grid');
  const items = BEATS.map((b) => {
    const el = document.createElement('article'); el.className = 'panel';
    el.innerHTML = `<div class="cv"><canvas width="1080" height="1920"></canvas><span class="badge">${b.n}</span></div>
      <div class="info"><div class="row"><b>Adegan ${b.n} · ${b.title}</b><span class="tm">${b.a.toFixed(1)}–${b.b.toFixed(1)} dtk</span></div>
      <div class="lbl">Teks on-screen</div><div class="ost">${b.text}</div>
      <div class="lbl">Garis besar VO</div><div>${b.vo}</div>
      <div class="lbl">Motion &amp; transisi</div><div>${b.tr}</div>
      <div class="lbl">Suara kunci</div><div>${b.sfx}</div></div>`;
    grid.appendChild(el); return [el.querySelector('canvas'), b];
  });
  for (const [cv, b] of items) {
    await new Promise((r) => requestAnimationFrame(r));
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    EXPLAIN(ctx, 1080, 1920, b.k);
    ctx.save(); ctx.setLineDash([22, 16]); ctx.strokeStyle = 'rgba(214,74,58,.75)'; ctx.lineWidth = 4;
    [288, 1536].forEach((y) => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1080, y); ctx.stroke(); });
    ctx.restore();
  }
})();
