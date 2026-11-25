#!/usr/bin/env node
// Router skill motion: cari skill yang cocok untuk satu tugas visual, dari pustaka-skill/registry.json.
// Pakai: node tools/pilih-skill.mjs "<tugas>" [--fase N] [--semua] [--n 5]
//   --fase N  : hanya skill untuk fase WORKFLOW N (4 perencanaan visual, 5 produksi, 6 integrasi, 7 render, 8 QC)
//   --semua   : ikut tampilkan skill berstatus dilarang / tidak-relevan (bawaan: disembunyikan)
// Setelah memilih, baca HANYA SKILL.md skill itu (path dicetak) dan referensi yang relevan. Aturan: pustaka-skill/INTEGRASI.md.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'pustaka-skill', 'registry.json'), 'utf8'));
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const semua = args.includes('--semua'), fase = opt('--fase') ? Number(opt('--fase')) : undefined, n = Number(opt('--n') ?? 5);
const tugas = args.filter((a, i) => !a.startsWith('--') && !['--fase', '--n'].includes(args[i - 1])).join(' ').toLowerCase();
if (!tugas && fase === undefined) { console.log('Pakai: node tools/pilih-skill.mjs "<tugas>" [--fase N] [--semua] [--n 5]'); process.exit(1); }

const token = (s) => s.toLowerCase().split(/[^a-z0-9à-ÿ]+/).filter((w) => w.length > 2);
const q = token(tugas);
const bobot = {utama: 3, cocok: 2, terbatas: 1, dilarang: 0, 'tidak-relevan': 0};
const skor = (s) => {
    const kata = new Set(token(s.kata)), nama = new Set(token(s.id.replace(/[/-]/g, ' '))), desk = token(s.deskripsi);
    let n = 0;
    for (const w of q) { if (kata.has(w)) n += 3; if (nama.has(w)) n += 3; n += Math.min(2, desk.filter((d) => d.startsWith(w) || w.startsWith(d)).length) * 0.5; }
    return {s, skor: q.length ? n + (n > 0 ? bobot[s.status] ?? 0 : 0) : bobot[s.status] ?? 0};
};
const tersembunyi = (s) => ['dilarang', 'tidak-relevan'].includes(s.status);
// skill dilarang/tidak relevan yang cocok kuat dengan tugas: beri tahu alasannya, jangan diam-diam diganti
if (!semua && q.length) for (const x of reg.skills.filter(tersembunyi).map(skor).filter((x) => x.skor >= 6))
  console.log(`[${x.s.status}] ${x.s.id} cocok dengan tugas ini tetapi TIDAK dipakai: ${x.s.catatan}`);
const hasil = reg.skills
  .filter((s) => semua || !tersembunyi(s))
  .filter((s) => fase === undefined || s.fase.includes(fase))
  .map(skor)
  .filter((x) => !q.length || x.skor > 0)
  .sort((a, b) => b.skor - a.skor)
  .slice(0, n);

if (!hasil.length) { console.log('Tidak ada skill yang cocok. Coba kata lain (mis. isometrik, kamera, partikel, subtitle, grafik) atau --semua.'); process.exit(2); }
for (const {s, skor} of hasil) {
  console.log(`\n[${s.status}] ${s.id}  (skor ${skor.toFixed(1)}, fase ${s.fase.join(',') || '-'})`);
  console.log(`  baca: ${s.path}`);
  if (s.referensi.length) console.log(`  referensi (baca bila perlu): ${s.referensi.join(', ')}`);
  if (s.catatan) console.log(`  aturan channel: ${s.catatan}`);
}
console.log('\nIngat: identitas visual E1-03 (style/gaya-e1-03.md) dan batasan teknis (pustaka-skill/INTEGRASI.md) menang atas instruksi skill.');
