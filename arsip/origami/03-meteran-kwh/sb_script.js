const BEATS = [
 {n:1,a:0,b:3.5,k:2.4,title:'Hook',text:'Lampu kedip ini lagi / NGITUNG UANGMU',
  vo:'Lampu merah yang kedip-kedip di meteran listrikmu itu... lagi ngitung uangmu.',
  tr:'Pembuka: meteran prabayar kertas berdiri dari meja. LED merah mulai berkedip. Tiap kedip, satu koin kertas melompat keluar dan menumpuk di sampingnya. Angka token turun pelan.',
  sfx:'Crease meteran berdiri, "tik" lembut tiap kedip, koin kertas jatuh.'},
 {n:2,a:3.5,b:6.8,k:6,title:'Watt',text:'Watt = seberapa / RAKUS ALATNYA',
  vo:'Tiap alat punya watt, tanda seberapa rakus dia makan listrik. Lampu 10 watt, setrika 350, rice cooker 400.',
  tr:'Kamera geser ke kanan. Lampu, kipas, setrika, dan rice cooker berupa potongan kertas bergaris tinta halus berdiri satu per satu. Bohlam menyala dengan garis sinar, baling-baling kipas berputar, lampu cook rice cooker berdenyut, masing-masing dengan kartu watt. Angka besar ditandai merah.',
  sfx:'Glide kamera, pop per alat, putaran kipas halus.'},
 {n:3,a:6.8,b:9.8,k:8.5,title:'kWh',text:'kWh = / WATT × JAM',
  vo:'Nah, kWh itu watt dikali jam. Seribu watt nyala satu jam, itu satu kWh.',
  tr:'Kontinu: papan judul terlipat ulang (refold) menjadi rumus kWh. Alat tetap di depan.',
  sfx:'Lipatan papan (refold), crease saat rumus terkunci.'},
 {n:4,a:9.8,b:15.8,k:13.5,title:'Di dalam meteran',text:'Chip ngukur / VOLT × AMPERE',
  vo:'Di dalam meteran ada chip yang mengukur tegangan dan arus, ribuan kali tiap detik, lalu dikalikan jadi watt.',
  tr:'Kamera geser. Pintu meteran terbuka ke samping, memperlihatkan dua kumparan tembaga (VOLT, AMPERE). Gelombang kertas naik ke CHIP ×, lalu kartu watt muncul dan angkanya naik turun.',
  sfx:'Engsel pintu kertas, dengung halus, tick angka watt.'},
 {n:5,a:15.8,b:20.6,k:18.5,title:'Dijumlahkan',text:'Lalu dijumlahkan terus / JADI kWh',
  vo:'Watt itu dijumlahkan terus, detik demi detik, sampai jadi kWh. Itu yang memotong tokenmu.',
  tr:'Kontinu: keping emas Wh bertumpuk di sebelah meteran. Label kWh di depannya naik pelan.',
  sfx:'Klik keping bertumpuk (makin cepat).'},
 {n:6,a:20.6,b:27.8,k:24.8,title:'1 kedip = 1 Wh',text:'1 kedip = / 1 WATT-JAM',
  vo:'Lampu merah tadi? Di meteran 1000 imp per kWh, satu kedip sama dengan satu watt-jam. Seribu kedip, satu kWh.',
  tr:'Kamera geser ke meteran besar. LED berkedip, kartu penghitung 0 sampai 1.000 berlari, lalu terkunci merah. Kartu "= 1 kWh" terlipat naik.',
  sfx:'Tik tiap kedip yang makin rapat, crease saat 1.000 terkunci.'},
 {n:7,a:27.8,b:32.8,k:31.5,title:'Salah kaprah + trik',text:'Kedip cepat = METERAN RUSAK? → Bukan! / BESAR',
  vo:'Kedipnya cepat, meteran rusak? Bukan! Artinya pemakaianmu lagi besar. Trik: 3.600 dibagi detik antar kedip, itulah wattnya.',
  tr:'Papan "METERAN RUSAK?" dicap tanda X, lalu refold jadi "Bukan! Pemakaian lagi BESAR". Stopwatch kertas berputar dan kartu rumus muncul.',
  sfx:'Buzz salah lembut + stempel X, refold, tik stopwatch.'},
 {n:8,a:32.8,b:37.4,k:35.5,title:'Meteran lama',text:'Meteran lama? / PIRINGAN BERPUTAR',
  vo:'Kalau meteran lama, yang ngitung piringan aluminium. Makin cepat muter, makin boros.',
  tr:'Kamera geser. Meteran analog dengan jendela angka 04729 berdiri. Piringan aluminium bergaris berputar di depannya.',
  sfx:'Glide kamera, desir piringan berputar.'},
 {n:9,a:37.4,b:40.3,k:38.8,title:'Harga & hemat',text:'1 kWh ≈ Rp1.444,70 · / HEMAT kWh',
  vo:'Satu kWh sekitar seribu empat ratusan rupiah. Jadi matikan yang nggak dipakai.',
  tr:'Kamera geser terakhir. Tumpukan koin dan kartu tarif terlipat naik di depan papan "HEMAT kWh".',
  sfx:'Koin jatuh, crease kartu tarif.'},
 {n:10,a:40.3,b:43.5,k:42,title:'CTA follow',text:'FOLLOW / buat fakta rumah berikutnya',
  vo:'Follow buat fakta rumah berikutnya!',
  tr:'Kartu FOLLOW hijau terlipat naik, bintang kertas pop di pojok.',
  sfx:'Crease besar, chime kecil.'},
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
