const BEATS = [
 {n:1,a:0,b:2.6,k:1.8,title:'Hook',text:'Keramik bisa / MELEDAK SENDIRI',
  vo:'Keramik di lantai rumahmu bisa meledak sendiri. Tanpa disentuh siapa pun.',
  tr:'Pembuka: lantai keramik kertas terbentang. Dua keramik di tengah bergetar, lalu "DUK!" terangkat membentuk segitiga. Serpihan kecil terpental, muncul ledakan kertas kuning bertuliskan DUK!',
  sfx:'Gemeretak kecil, lalu "duk" berat dan serpihan berjatuhan.'},
 {n:2,a:2.6,b:4.4,k:3.5,title:'Bukan mistis',text:'Bukan mistis, / INI FISIKA',
  vo:'Ini bukan mistis. Ini fisika.',
  tr:'Kontinu: papan judul terlipat ulang. Lantai yang terangkat tetap terlihat.',
  sfx:'Lipatan papan (refold).'},
 {n:3,a:4.4,b:11.2,k:8.5,title:'Memuai',text:'Kena panas, keramik / MEMUAI',
  vo:'Saat kena panas, keramik memuai. Cuma sedikit, lantai lima meter memanjang sekitar satu milimeter. Tapi dorongannya kuat.',
  tr:'Kamera geser. Penampang lantai berdiri (beton, adukan, keramik, nat). Matahari kertas muncul, garis panas naik, keramik melebar dan menekan nat. Panah merah mendorong ke luar. Kartu "± 1 mm memanjang" muncul di depan.',
  sfx:'Glide kamera, desir hangat, crease kartu.'},
 {n:4,a:11.2,b:15.4,k:13.8,title:'Dipasang mepet',text:'Dipasang mepet? / NGGAK ADA RUANG',
  vo:'Kalau keramik dipasang mepet tanpa celah, dorongan itu nggak punya tempat lari.',
  tr:'Kamera geser. Penampang yang sama, tapi diapit dua dinding dan keramik rapat tanpa nat. Panah merah dari dinding saling menekan dan keramik mulai bergetar.',
  sfx:'Tekanan berderit naik.'},
 {n:5,a:15.4,b:19.4,k:15.2,title:'Popping!',text:'Tekanan numpuk / POPPING!',
  vo:'Tekanannya numpuk, lalu... duk! Keramik terangkat. Ini disebut popping.',
  tr:'Kamera mendorong masuk. Dua keramik tengah terangkat jadi segitiga, adukan di bawahnya retak, dan serpihan terlempar. Papan terlipat ulang jadi "POPPING!", lalu muncul kartu "nat = ruang napas keramik".',
  sfx:'"DUK!" besar, serpihan, crease kartu.'},
 {n:6,a:19.4,b:24.6,k:22.6,title:'Kopong',text:'Perekat nggak penuh? / KOPONG',
  vo:'Penyebab kedua: perekat nggak penuh, jadi ada rongga di bawahnya. Coba ketuk. Yang padat bunyinya "tok", yang kopong bunyinya "dug".',
  tr:'Kamera geser. Penampang tiga keramik. Di bawah keramik tengah, perekatnya cuma titik-titik sehingga terlihat rongga gelap. Palu kertas mengetuk keramik kiri (kartu "tok"), lalu keramik tengah (kartu "DUG..", keramik bergetar).',
  sfx:'Ketukan padat "tok" lalu ketukan berongga "dug".'},
 {n:7,a:24.6,b:28,k:25.6,title:'Air masuk',text:'Air masuk lewat nat, / MAKIN LEPAS',
  vo:'Kalau air masuk lewat nat, perekatnya makin lepas.',
  tr:'Kontinu: tetes air kertas jatuh ke nat, merembes, dan menggenang di rongga bawah keramik.',
  sfx:'Tetes air lembut.'},
 {n:8,a:28,b:35.8,k:30.8,title:'Solusi',text:'Biar aman: / BERI CELAH',
  vo:'Biar aman: pakai nat dua sampai tiga milimeter, sisakan celah di tepi dinding, dan pastikan perekatnya penuh.',
  tr:'Kamera geser. Penampang yang benar: nat terlihat, plint menutup celah tepi dinding, perekat penuh. Tiga label muncul satu per satu dengan centang hijau. Panas datang lagi, keramik memuai ke dalam celah dan aman (centang besar).',
  sfx:'Pop label + centang, desir hangat, chime lega.'},
 {n:9,a:35.8,b:38,k:37,title:'Ajakan cek',text:'Coba ketuk lantaimu, / ADA YANG KOPONG?',
  vo:'Coba ketuk lantai rumahmu. Ada yang kopong?',
  tr:'Kontinu: papan terlipat ulang jadi ajakan. Label-label turun.',
  sfx:'Refold.'},
 {n:10,a:38,b:41.5,k:39.5,title:'CTA follow',text:'FOLLOW / buat fakta rumah berikutnya',
  vo:'Follow buat fakta rumah berikutnya!',
  tr:'Kartu FOLLOW hijau terlipat naik, bintang kertas pop.',
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
