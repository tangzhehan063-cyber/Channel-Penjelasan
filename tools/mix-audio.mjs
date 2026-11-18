#!/usr/bin/env node
// Campur suara video tanpa render frame: VO + ambient + SFX (dibaca dari const SFX di remotion/src/vNN/VideoNN.tsx) → AAC.
// Pakai: node tools/mix-audio.mjs NN out.aac   (beberapa detik; gantikan `remotion render --codec=aac`)
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const NN = (process.argv[2] || '').padStart(2, '0'), out = process.argv[3];
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const jp = path.join(root, `remotion/src/v${NN}/beats.json`); // video berbasis kit: data di beats.json
const J = fs.existsSync(jp) ? JSON.parse(fs.readFileSync(jp, 'utf8')) : null;
const code = J ? '' : fs.readFileSync(path.join(root, `remotion/src/v${NN}/Video${NN}.tsx`), 'utf8');
const pub = path.join(root, 'remotion/public');
const end = J ? J.durasi : Number(code.match(/export const V\d+_END\s*=\s*([\d.]+)/)[1]);
const sfx = J ? J.sfx : new Function(`return (${code.match(/const SFX[^=]*=\s*(\[[\s\S]*?\]);\s*\n/)[1]});`)();
const amb = J ? [null, '0.1'] : code.match(/ambient\.wav'\)\}\s*volume=\{([\d.]+)\}/);
const ins = [['-i', `${pub}/${J ? J.vo : `v${NN}/vo.mp3`}`]], fl = ['[0:a]volume=1[a0]'];
if (amb) { ins.push(['-stream_loop', '-1', '-i', `${pub}/sfx/ambient.wav`]); fl.push(`[1:a]volume=${amb[1]}[a1]`); }
for (const [n, t, v] of sfx) { const i = ins.length; ins.push(['-i', `${pub}/sfx/${n}.wav`]); fl.push(`[${i}:a]adelay=${Math.round(t * 1000)}:all=1,volume=${v}[a${i}]`); }
fl.push(`${ins.map((_, i) => `[a${i}]`).join('')}amix=inputs=${ins.length}:normalize=0:duration=longest,atrim=0:${end}[m]`);
execFileSync('ffmpeg', ['-y', '-v', 'error', ...ins.flat(), '-filter_complex', fl.join(';'), '-map', '[m]', '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', out], {stdio: 'inherit'});
console.log(`audio: ${out} (${sfx.length} SFX, ${end} dtk)`);
