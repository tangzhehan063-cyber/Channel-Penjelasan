#!/usr/bin/env node
// Cek "render mandiri" E1: kode visual tidak boleh bergantung pada API AI/jaringan saat render.
// Pakai: node tools/cek-mandiri.mjs [folder ...]   (default: remotion/src remotion/package.json)
// Exit 1 bila ada temuan GAGAL. Aset lokal berlisensi (remotion/public) boleh; layanan generatif tidak.
import {readFileSync, readdirSync, statSync, existsSync} from 'node:fs';
import {join, extname} from 'node:path';

const akar = process.argv.slice(2).length ? process.argv.slice(2) : ['remotion/src', 'remotion/package.json'];
const KODE = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json']);
const LEWATI = new Set(['node_modules', 'out', '.git', 'package-lock.json']);

// GAGAL: pemanggilan layanan generatif atau SDK AI dari kode visual
const AI = [
  /from\s+['"](openai|@anthropic-ai\/sdk|@google\/genai|@google\/generative-ai|replicate|@fal-ai\/[^'"]*|@elevenlabs\/[^'"]*|stability[^'"]*|runwayml[^'"]*|@runwayml\/[^'"]*|midjourney[^'"]*|leonardo[^'"]*|@huggingface\/[^'"]*)['"]/,
  /["'](openai|@anthropic-ai\/sdk|@google\/genai|replicate|@fal-ai\/client|@runwayml\/sdk|@elevenlabs\/elevenlabs-js)["']\s*:/, // package.json
  /(api\.openai\.com|api\.anthropic\.com|generativelanguage\.googleapis\.com|api\.replicate\.com|fal\.run|api\.elevenlabs\.io|api\.stability\.ai|api\.runwayml\.com|api\.klingai\.com|api\.lumalabs\.ai|api\.bfl\.ai|meshy\.ai|tripo3d\.ai)/,
  /process\.env\.(OPENAI|ANTHROPIC|GEMINI|GOOGLE_API|ELEVENLABS|REPLICATE|FAL|RUNWAY|KLING|LUMA|STABILITY)[A-Z_]*/,
];
// PERINGATAN: akses jaringan lain (aset harus lokal agar render deterministik & offline)
const NET = [/\bfetch\s*\(\s*['"`]https?:/, /\b(src|href|url)\s*=\s*['"`]https?:\/\//, /staticFile\s*\(\s*['"`]https?:/, /new\s+(TextureLoader|GLTFLoader)\([^)]*\)\.load\(\s*['"`]https?:/];

const temuan = {gagal: [], peringatan: []};
let berkas = 0;
function periksa(p) {
  const baris = readFileSync(p, 'utf8').split('\n');
  berkas++;
  baris.forEach((b, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(b)) return; // komentar tidak dihitung
    for (const re of AI) if (re.test(b)) temuan.gagal.push(`${p}:${i + 1}  ${b.trim().slice(0, 110)}`);
    for (const re of NET) if (re.test(b)) temuan.peringatan.push(`${p}:${i + 1}  ${b.trim().slice(0, 110)}`);
  });
}
function jalan(p) {
  if (!existsSync(p)) return;
  const s = statSync(p);
  if (s.isDirectory()) {
    for (const n of readdirSync(p)) if (!LEWATI.has(n)) jalan(join(p, n));
  } else if (KODE.has(extname(p)) && !LEWATI.has(p.split('/').pop())) periksa(p);
}
akar.forEach(jalan);

console.log(`Cek render mandiri: ${berkas} berkas diperiksa (${akar.join(', ')})`);
temuan.peringatan.forEach((t) => console.log('  PERINGATAN (akses jaringan, ganti aset lokal)', t));
temuan.gagal.forEach((t) => console.log('  GAGAL (ketergantungan API AI)', t));
if (!temuan.gagal.length) console.log(`OK: tidak ada ketergantungan API AI di kode visual${temuan.peringatan.length ? ` (${temuan.peringatan.length} peringatan)` : ''}`);
process.exit(temuan.gagal.length ? 1 : 0);
