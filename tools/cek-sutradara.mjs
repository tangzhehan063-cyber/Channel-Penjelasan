#!/usr/bin/env node
// Cek sutradara: membaca data beat (B), kamera (CAM_*), judul (<Title>) dan SFX dari remotion/src/vNN/VideoNN.tsx
// + words.json, lalu menilai ritme, kamera, waktu baca, dan jeda sunyi. Aturan: .claude/skills/sutradara/SKILL.md
// Pakai: node tools/cek-sutradara.mjs 08      (keluar 1 bila ada GAGAL)
import fs from 'node:fs';
import path from 'node:path';

const NN = (process.argv[2] || '').padStart(2, '0');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = path.join(root, `remotion/src/v${NN}/Video${NN}.tsx`);
if (!fs.existsSync(src)) { console.error(`tidak ada ${src}`); process.exit(2); }
const code = fs.readFileSync(src, 'utf8');
const ev = (s, scope = {}) => new Function(...Object.keys(scope), `return (${s});`)(...Object.values(scope));

// --- data ---
const END = Number((code.match(/export const V\d+_END\s*=\s*([\d.]+)/) || [])[1]);
const B = ev(code.match(/const B\s*=\s*(\{[^;]*\});/)[1].replace(/V\d+_END/g, String(END)));
const cams = {};
for (const m of code.matchAll(/const (CAM_\w+)\s*:\s*Key\[\]\s*=\s*(\[[^;]*\]);/g)) cams[m[1]] = ev(m[2]);
const titles = [...code.matchAll(/<Title t=\{t\} a=\{([^}]*)\} b=\{([^}]*)\} small="([^"]*)" big="([^"]*)"/g)]
  .map((m) => ({a: ev(m[1], {B}), b: ev(m[2], {B}), text: `${m[3]} / ${m[4]}`, n: (m[3] + m[4]).replace(/\s/g, '').length}));
const sfxM = code.match(/const SFX[^=]*=\s*(\[[\s\S]*?\]);\s*\n/);
const sfx = sfxM ? ev(sfxM[1]).map((x) => x[1]).sort((a, b) => a - b) : [];
const wPath = path.join(root, `remotion/public/v${NN}/words.json`);
const words = fs.existsSync(wPath) ? JSON.parse(fs.readFileSync(wPath, 'utf8')).words : [];

const out = [];
let fail = 0, warn = 0;
const ok = (s) => out.push(`  OK    ${s}`);
const bad = (s) => { fail++; out.push(`  GAGAL ${s}`); };
const hm = (s) => { warn++; out.push(`  SARAN ${s}`); };
const f1 = (x) => x.toFixed(1);

// --- 1. ritme beat ---
const keys = Object.keys(B).filter((k) => k !== 'end');
const beats = keys.map((k, i) => ({k, a: B[k], d: (B[keys[i + 1]] ?? B.end ?? END) - B[k]}));
const ds = beats.map((b) => b.d), mean = ds.reduce((a, b) => a + b, 0) / ds.length;
const cv = Math.sqrt(ds.reduce((a, b) => a + (b - mean) ** 2, 0) / ds.length) / mean;
out.push(`\n1. RITME (${beats.length} beat, rata ${f1(mean)} dtk)`);
out.push('  ' + beats.map((b) => `${b.k} ${f1(b.d)}`).join(' | '));
cv >= 0.25 ? ok(`variasi tempo CV ${cv.toFixed(2)} (≥0,25)`) : hm(`tempo terlalu rata (CV ${cv.toFixed(2)} < 0,25): buat 1 beat cepat ≤2,5 dtk dan 1 napas ≥5 dtk`);
const fast = beats.filter((b) => b.d <= 2.5), slow = beats.filter((b) => b.d >= 5);
fast.length ? ok(`beat cepat: ${fast.map((b) => b.k).join(', ')}`) : hm('tidak ada beat cepat ≤2,5 dtk (akselerasi)');
slow.length ? ok(`beat napas: ${slow.map((b) => b.k).join(', ')}`) : hm('tidak ada beat napas ≥5 dtk');
const hook = beats[1]?.a ?? 0;
hook <= 4 ? ok(`hook selesai di ${f1(hook)} dtk (≤4)`) : bad(`hook terlalu panjang: ${f1(hook)} dtk (>4)`);

// --- 2. kamera ---
const sub = (a, b) => a.map((x, i) => x - b[i]), len = (v) => Math.hypot(...v);
const moveOf = (k0, k1) => {
  const d0 = len(sub(k0.pos, k0.look)), d1 = len(sub(k1.pos, k1.look));
  const a0 = Math.atan2(k0.pos[0] - k0.look[0], k0.pos[2] - k0.look[2]), a1 = Math.atan2(k1.pos[0] - k1.look[0], k1.pos[2] - k1.look[2]);
  const t = [];
  const mv = sub(k1.pos, k0.pos), travel = len(mv), dir = sub(k0.look, k0.pos), fwd = (mv[0] * dir[0] + mv[1] * dir[1] + mv[2] * dir[2]) / len(dir);
  if (travel > 5 && fwd > 0.7 * travel) return ['dive'];
  const dz = (d1 - d0) / d0;
  if (dz < -0.06) t.push(dz < -0.3 ? 'dive' : 'push');
  if (dz > 0.06) t.push('pull');
  if (Math.abs(a1 - a0) > 0.12) t.push('orbit');
  if (Math.abs((k1.pos[1] - k1.look[1]) / d1 - (k0.pos[1] - k0.look[1]) / d0) > 0.12) t.push('crane');
  if (len(sub(k1.look, k0.look)) > 0.25) t.push('pan');
  return t.length ? t : ['diam'];
};
const types = new Set();
out.push(`\n2. KAMERA (${Object.keys(cams).length} set)`);
for (const [n, ks] of Object.entries(cams)) {
  const mv = ks.slice(1).map((k, i) => moveOf(ks[i], k).join('+'));
  mv.forEach((m) => m.split('+').forEach((x) => types.add(x)));
  out.push(`  ${n.padEnd(10)} ${mv.join(' → ')}`);
  if (mv.every((m) => m === 'diam')) bad(`${n} diam total: beri minimal push 2%`);
}
types.delete('diam');
types.size >= 4 ? ok(`${types.size} jenis gerak kamera: ${[...types].join(', ')}`) : hm(`hanya ${types.size} jenis gerak (${[...types].join(', ')}); target ≥4 (push, pull, orbit, crane, pan, dive)`);
types.has('dive') || types.has('orbit') ? ok('ada calon "signature shot" (dive/orbit)') : hm('belum ada signature shot (dive ke detail / orbit)');

// --- 3. waktu baca judul ---
out.push(`\n3. WAKTU BACA JUDUL (${titles.length})`);
for (const tt of titles) {
  const need = Math.max(1.8, tt.n / 15 + 0.8), hold = tt.b - tt.a - 0.45;
  if (hold < 1.5) bad(`"${tt.text}" cuma ${f1(hold)} dtk (<1,5): pendekkan teks atau gabung beat`);
  else if (hold < need) hm(`"${tt.text}" ${f1(hold)}/${f1(need)} dtk: di beat cepat cukup kata BESAR saja`);
}
ok(`aturan: huruf/15 + 0,8 dtk (min 1,8); VO ikut membaca, jadi judul pendek boleh pas-pasan`);

// --- 4. suara: jeda sunyi & SFX per beat ---
out.push(`\n4. SUARA (${sfx.length} SFX)`);
const gaps = sfx.slice(1).map((s, i) => ({a: sfx[i], d: s - sfx[i]})).filter((g) => g.d >= 1.0);
const pay = B.payoff ?? null;
gaps.length >= 2 ? ok(`${gaps.length} jeda SFX ≥1 dtk: ${gaps.map((g) => `${f1(g.a)}+${f1(g.d)}`).join(', ')}`) : hm('kurang dari 2 jeda sunyi SFX ≥1 dtk');
if (pay != null) {
  const pre = sfx.filter((s) => s > pay - 0.9 && s < pay - 0.05);
  pre.length === 0 ? ok(`hening sebelum payoff (${f1(pay - 0.9)}–${f1(pay)})`) : hm(`ada SFX tepat sebelum payoff (${pre.map(f1).join(', ')}): kosongkan 0,9 dtk sebelum payoff`);
}
const empty = beats.filter((b) => !sfx.some((s) => s >= b.a - 0.15 && s < b.a + b.d));
empty.length ? hm(`beat tanpa SFX: ${empty.map((b) => b.k).join(', ')}`) : ok('setiap beat punya SFX');
const late = beats.filter((b) => b.a > 0 && !sfx.some((s) => Math.abs(s - b.a) <= 0.25));
late.length ? hm(`potongan tanpa SFX transisi (±0,25 dtk): ${late.map((b) => b.k).join(', ')}`) : ok('setiap potongan beat diberi SFX transisi');

// --- 5. VO ---
if (words.length) {
  const pauses = words.slice(1).map((w, i) => ({at: words[i].end, d: w.start - words[i].end})).filter((p) => p.d >= 0.45);
  out.push(`\n5. VO (${words.length} kata, ${f1(words.length / (words.at(-1).end - words[0].start) * 1)} kata/dtk)`);
  ok(`jeda napas narator ≥0,45 dtk: ${pauses.map((p) => `${f1(p.at)}(${f1(p.d)})`).join(', ') || '-'}`);
  const off = keys.slice(1).filter((k) => !words.some((w) => Math.abs(w.start - B[k]) <= 0.35));
  off.length ? hm(`beat tidak jatuh di awal kata VO (±0,35): ${off.join(', ')}`) : ok('semua potongan beat jatuh di awal kata VO');
}

console.log(`CEK SUTRADARA · video #${NN} · ${f1(END)} dtk`);
console.log(out.join('\n'));
console.log(`\nHasil: ${fail} GAGAL, ${warn} SARAN`);
process.exit(fail ? 1 : 0);
