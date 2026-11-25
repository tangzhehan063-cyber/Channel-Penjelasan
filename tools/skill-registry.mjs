#!/usr/bin/env node
// Bangun registry pustaka skill motion (pustaka-skill/motion/*/skills/*/SKILL.md) + kompatibilitas channel.
// Hasil: pustaka-skill/registry.json dan pustaka-skill/REGISTRY.md. File SKILL.md asli tidak diubah.
// Pakai: node tools/skill-registry.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const LIB = path.join(ROOT, 'pustaka-skill', 'motion');
const komp = JSON.parse(fs.readFileSync(path.join(ROOT, 'pustaka-skill', 'kompatibilitas.json'), 'utf8')).skill;

const fm = (txt) => {
  const m = txt.match(/^---\n([\s\S]*?)\n---/); const o = {};
  if (m) for (const line of m[1].split('\n')) { const i = line.indexOf(':'); if (i > 0) o[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, ''); }
  return o;
};
const daftarFile = (dir) => fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => !f.startsWith('.')).sort() : [];

const skills = [];
for (const pack of fs.readdirSync(LIB).sort()) {
  const sdir = path.join(LIB, pack, 'skills');
  if (!fs.existsSync(sdir)) continue;
  for (const nama of fs.readdirSync(sdir).sort()) {
    const f = path.join(sdir, nama, 'SKILL.md');
    if (!fs.existsSync(f)) continue;
    const meta = fm(fs.readFileSync(f, 'utf8'));
    const id = `${pack}/${nama}`;
    const k = komp[id] ?? {status: 'belum-dinilai', fase: [], kata: '', catatan: 'Belum dinilai di kompatibilitas.json.'};
    skills.push({id, nama: meta.name ?? nama, pack, path: path.relative(ROOT, f), referensi: daftarFile(path.join(sdir, nama, 'references')).map((r) => path.relative(ROOT, path.join(sdir, nama, 'references', r))),
      skrip: daftarFile(path.join(sdir, nama, 'scripts')), deskripsi: meta.description ?? '', ...k});
  }
}
const urut = ['utama', 'cocok', 'terbatas', 'dilarang', 'tidak-relevan', 'belum-dinilai'];
skills.sort((a, b) => urut.indexOf(a.status) - urut.indexOf(b.status) || a.id.localeCompare(b.id));
fs.writeFileSync(path.join(ROOT, 'pustaka-skill', 'registry.json'), JSON.stringify({dibuat: 'node tools/skill-registry.mjs', jumlah: skills.length, skills}, null, 1) + '\n');

const pendek = (s, n = 150) => (s.length > n ? s.slice(0, n - 1) + '…' : s).replace(/\|/g, '/');
let md = `# Registry skill motion (${skills.length} skill)\n\nDibuat otomatis oleh \`node tools/skill-registry.mjs\` dari \`pustaka-skill/motion/\` + \`pustaka-skill/kompatibilitas.json\`. Jangan edit tangan.\n`;
md += `Cara pakai: \`node tools/pilih-skill.mjs "<tugas>"\`, lalu baca HANYA SKILL.md (dan referensi) skill terpilih. Aturan: \`pustaka-skill/INTEGRASI.md\`.\n\n`;
for (const st of urut) {
  const g = skills.filter((s) => s.status === st); if (!g.length) continue;
  md += `## ${st} (${g.length})\n\n| Skill | Fase | Catatan channel | Deskripsi asli |\n|---|---|---|---|\n`;
  for (const s of g) md += `| [\`${s.id}\`](../${s.path}) | ${s.fase.join(', ') || '-'} | ${pendek(s.catatan, 170) || '-'} | ${pendek(s.deskripsi)} |\n`;
  md += '\n';
}
fs.writeFileSync(path.join(ROOT, 'pustaka-skill', 'REGISTRY.md'), md);
const tidak = skills.filter((s) => s.status === 'belum-dinilai');
console.log(`registry: ${skills.length} skill (${urut.map((u) => `${u} ${skills.filter((s) => s.status === u).length}`).join(', ')})`);
if (tidak.length) { console.log('BELUM DINILAI:', tidak.map((s) => s.id).join(', ')); process.exitCode = 1; }
