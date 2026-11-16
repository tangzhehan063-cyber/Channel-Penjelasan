#!/usr/bin/env node
// Gerbang tahap: node tools/gerbang.mjs <NN> <tahapMaks>
// Gagal (exit 1) bila masih ada "- [ ]" di tahap 1..tahapMaks pada checklist/vNN.md. Berlaku wajib, tidak boleh dilewati.
import {readFileSync, existsSync} from 'node:fs';
const [NN, maksArg] = process.argv.slice(2);
const maks = Number(maksArg);
if (!NN || !maks) { console.error('pakai: node tools/gerbang.mjs <NN> <tahapMaks>'); process.exit(2); }
const f = new URL(`../checklist/v${NN}.md`, import.meta.url);
if (!existsSync(f)) { console.error(`GERBANG: checklist/v${NN}.md belum ada. Salin dari checklist/_template.md dulu.`); process.exit(1); }
let tahap = 0, belum = [];
for (const l of readFileSync(f, 'utf8').split('\n')) {
  const h = l.match(/^## T(\d)\b/); if (h) { tahap = Number(h[1]); continue; }
  if (/^## Daftar revisi/.test(l)) tahap = 4;
  if (tahap >= 1 && tahap <= maks && /^- \[ \]/.test(l)) belum.push(`T${tahap}: ${l.replace(/^- \[ \]\s*/, '')}`);
}
if (belum.length) { console.error(`GERBANG: ${belum.length} langkah belum selesai (video #${NN}, wajib sampai tahap ${maks}):\n  - ${belum.join('\n  - ')}\nSelesaikan SEMUA dulu; dilarang lanjut ke tahap berikutnya.`); process.exit(1); }
console.log(`GERBANG OK: tahap 1–${maks} video #${NN} lengkap.`);
