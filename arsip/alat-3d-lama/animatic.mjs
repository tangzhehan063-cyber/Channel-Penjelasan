#!/usr/bin/env node
// Animatic ringan: tabel timing per beat (waktu, durasi, jumlah kata, kata/dtk, teks VO) dari remotion/src/vNN/VideoNN.tsx + words.json.
// Dipakai sebagai "kunci timing" sebelum animasi: user ACC tabel ini, lalu animasi dibuat. Tanpa render.
// Pakai: node tools/animatic.mjs 13 [--md]     (--md menulis naskah/animatic-vNN.md)
import fs from 'node:fs';
import path from 'node:path';

const NN = (process.argv[2] || '').padStart(2, '0');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = path.join(root, `remotion/src/v${NN}/Video${NN}.tsx`);
if (!fs.existsSync(src)) { console.error(`tidak ada ${src}`); process.exit(2); }
const code = fs.readFileSync(src, 'utf8');
const END = Number((code.match(/export const V\d+_END\s*=\s*([\d.]+)/) || [])[1]);
const B = new Function(`return (${code.match(/const B\s*=\s*(\{[^;]*\});/)[1].replace(/V\d+_END/g, String(END))});`)();
const wPath = path.join(root, `remotion/public/v${NN}/words.json`);
const words = fs.existsSync(wPath) ? JSON.parse(fs.readFileSync(wPath, 'utf8')).words : [];
const keys = Object.keys(B).filter((k) => k !== 'end');
const rows = keys.map((k, i) => {
  const a = B[k], b = B[keys[i + 1]] ?? B.end ?? END;
  const ws = words.filter((w) => w.start >= a - 0.05 && w.start < b - 0.05);
  const d = b - a;
  return {k, a, d, n: ws.length, wps: ws.length ? ws.length / d : 0, text: ws.map((w) => w.word).join(' ')};
});
const f = (x, n = 1) => x.toFixed(n);
const lines = [`| Beat | Mulai | Durasi | Kata | Kata/dtk | Teks VO |`, `|---|---|---|---|---|---|`];
for (const r of rows) lines.push(`| ${r.k} | ${f(r.a, 2)} | ${f(r.d, 2)} | ${r.n} | ${f(r.wps)} | ${r.text.slice(0, 90)} |`);
const tot = words.length;
lines.push('', `Total ${f(END)} dtk, ${rows.length} beat, ${tot} kata (${f(tot / END)} kata/dtk rata-rata).`);
const warn = rows.filter((r) => r.n && (r.wps > 3.4 || r.d < 0.8)).map((r) => `${r.k} (${f(r.wps)} kata/dtk, ${f(r.d)} dtk)`);
lines.push(warn.length ? `Perlu dicek (terlalu cepat atau terlalu pendek): ${warn.join(', ')}` : 'Tidak ada beat yang terlalu cepat atau terlalu pendek.');
const text = lines.join('\n');
console.log(text);
if (process.argv.includes('--md')) {
  const out = path.join(root, `naskah/animatic-v${NN}.md`);
  fs.writeFileSync(out, `# Animatic ringan v${NN} (kunci timing)\n\n${text}\n`);
  console.log(`\ntertulis: ${path.relative(root, out)}`);
}
