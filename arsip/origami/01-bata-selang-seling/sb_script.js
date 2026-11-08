const BEATS = [
 {n:1,a:0,b:3,k:1.6,title:'Hook',text:'Kenapa bata disusun / SELANG-SELING?',
  vo:'Pernah perhatiin? Tukang nggak pernah nyusun bata lurus-lurus. Kenapa, ya?',
  tr:'Pembuka: dua dinding kertas terlipat naik lapis demi lapis di meja studio (kiri lurus, kanan selang-seling), lalu papan judul berdiri di belakangnya. Hook selesai dalam ±2 detik.',
  sfx:'Bata terlipat naik (crease per lapis), papan judul terlipat naik, ambience ruang studio pelan.'},
 {n:2,a:3,b:7,k:5.4,title:'Tumpuk lurus',text:'Coba kalau disusun / LURUS · sambungan segaris atas-bawah',
  vo:'Coba kalau bata ditumpuk lurus. Sambungannya jadi satu garis panjang dari atas sampai bawah.',
  tr:'Kontinu: kamera dolly ke dinding kiri. Papan lama terlipat turun dan papan baru terlipat naik. Dua pita kertas merah tergambar mengikuti sambungan vertikal.',
  sfx:'Desir dolly kamera, lipatan papan, gesekan pita kertas selama pita tergambar.'},
 {n:3,a:7,b:12.5,k:10.6,title:'Beban 1 kolom (momen salah)',text:'Beban cuma ditahan / 1 KOLOM',
  vo:'Taruh beban di atasnya, yang nahan cuma satu kolom. Kalau retak, retaknya tinggal ikut garis itu.',
  tr:'Kontinu: balok indigo "BEBAN" jatuh ke kolom tengah. Bata di bawahnya menyala kuning satu per satu dan panah lipat mengarah turun. Retak merah merambat lurus di sambungan, diikuti kamera push-in dan kilatan key-light.',
  sfx:'Slap + thud saat beban mendarat, tick tiap bata menyala, retakan kertas, nada rendah "salah".'},
 {n:4,a:12.5,b:19,k:16.5,title:'Selang-seling: menyebar',text:'Selang-seling: / MENYEBAR · dibagi ke bata di bawahnya',
  vo:'Kalau selang-seling, tiap bata ditopang dua bata di bawahnya. Bebannya menyebar ke kanan-kiri, kayak piramida.',
  tr:'Kontinu: kamera dolly ke dinding kanan. Beban yang sama jatuh di sana. Warna kuning menyebar membentuk piramida 45°, dan tiga panah lipat terbuka ke bawah.',
  sfx:'Glide kamera, thud beban, rentetan tick yang melebar per lapis, crease panah.'},
 {n:5,a:19,b:26,k:23.5,title:'Angka kunci ±30%',text:'Didorong angin / DARI DEPAN · ±30% vs 100%',
  vo:'Saat didorong angin dari depan, tembok tumpuk lurus kekuatannya cuma sekitar tiga puluh persen tembok selang-seling.',
  tr:'Kontinu: kamera mundur ke shot lebar. Panah kertas di meja mendorong kedua dinding. Kolom-kolom dinding lurus terpisah dan miring, sedangkan dinding selang-seling tetap utuh. Kartu "±30%" terlipat naik (pukulan terbesar + flare), lalu kartu "100%".',
  sfx:'Geseran kertas (panah), derit kolom terpisah, IMPACT + ding di angka 30%, crease kartu 100%.'},
 {n:6,a:26,b:31,k:29.6,title:'Retak harus belok',text:'Retaknya pun / HARUS BELOK',
  vo:'Retak pun nggak bisa lari lurus. Dia harus belok di setiap bata, jadi susah merambat.',
  tr:'Kontinu: kamera kembali ke dinding kanan. Retak merah merambat berpola tangga (turun-geser-turun) lalu berhenti, dan tanda centang hijau muncul.',
  sfx:'Retakan kertas pendek per langkah, jeda, crease + "success" saat centang muncul.'},
 {n:7,a:31,b:34.5,k:33.5,title:'Takeaway',text:'Bukan cuma / BIAR RAPI · Selang-seling → beban dibagi',
  vo:'Jadi susunan selang-seling itu bukan cuma biar rapi. Itu biar bebannya dibagi.',
  tr:'Kontinu: shot lebar, kedua dinding terlihat berdampingan. Kartu takeaway terlipat naik di depan.',
  sfx:'Lipatan kartu besar, tiga ding naik yang terdengar "beres".'},
 {n:8,a:34.5,b:38,k:36.5,title:'CTA',text:'FOLLOW · buat fakta rumah berikutnya',
  vo:'Follow buat fakta rumah berikutnya!',
  tr:'Kontinu: kartu teal "FOLLOW" terlipat naik di depan dan bintang kertas berputar di sampingnya. Adegan ditahan ±1,5 detik.',
  sfx:'Crease kartu, sparkle kecil saat bintang muncul, ambience fade out.'},
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
