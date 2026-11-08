#!/usr/bin/env python3
"""Rebuild frame.html (render page) and storyboard.html from the project's text assets.

Usage: python3 build_pages.py <style_prompt.txt>
  - style_prompt.txt = styles/origami-studio-prompt.txt (contains the H library and SOUND kit, unchanged)
  - fonts: fetched with `npm pack @fontsource/space-grotesk @fontsource/space-mono` (npm registry is reachable;
    GitHub/Google Fonts may be blocked), then inlined as base64 so the page renders offline.
Expects explainer.js, extras.js, sb_body.html, sb_script.js next to this script.
"""
import base64, glob, os, re, subprocess, sys, tarfile

B = os.path.dirname(os.path.abspath(__file__))
prompt = open(sys.argv[1], encoding='utf-8').read()
blocks = re.findall(r"```js\n(.*?)```", prompt, re.S)
lib_h = next(b for b in blocks if 'H.rng = function' in b)
lib_sound = next(b for b in blocks if 'SOUND.kit = function' in b)

fd = os.path.join(B, 'fonts'); os.makedirs(fd, exist_ok=True)
if not glob.glob(fd + '/*.tgz'):
    subprocess.run(['npm', 'pack', '@fontsource/space-grotesk', '@fontsource/space-mono', '--silent'], cwd=fd, check=True)
def font(pkg, w):
    tgz = glob.glob(f'{fd}/fontsource-{pkg}-*.tgz')[0]
    with tarfile.open(tgz) as t:
        return base64.b64encode(t.extractfile(f'package/files/{pkg}-latin-{w}-normal.woff2').read()).decode()
FACES = ''.join(f'@font-face{{font-family:"{fam}";font-weight:{w};src:url(data:font/woff2;base64,{font(pkg, w)}) format("woff2")}}'
                for fam, pkg in [('Space Grotesk', 'space-grotesk'), ('Space Mono', 'space-mono')] for w in (400, 700))
rd = lambda f: open(os.path.join(B, f), encoding='utf-8').read()

frame = f'''<!doctype html><html><head><meta charset="utf-8"><style>{FACES}html,body{{margin:0;background:#000}}</style></head><body>
<canvas id="c" width="1080" height="1920"></canvas>
<script>{lib_h}</script><script>{lib_sound}</script><script>{rd('explainer.js')}</script><script>{rd('extras.js')}</script>
<script>
const cv=document.getElementById('c'),ctx=cv.getContext('2d',{{willReadFrequently:true}});
window.seek=(t)=>{{ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,1080,1920);EXPLAIN(ctx,1080,1920,t);drawSubs(ctx,1080,1920,t);}};
(async()=>{{for(const f of ['700 40px "Space Grotesk"','400 40px "Space Grotesk"','400 40px "Space Mono"'])await document.fonts.load(f,'AaZz09');window.ready=true;}})();
</script></body></html>'''
open(os.path.join(B, 'frame.html'), 'w', encoding='utf-8').write(frame)

if os.path.exists(os.path.join(B, 'sb_body.html')):
    css = rd('storyboard.css') if os.path.exists(os.path.join(B, 'storyboard.css')) else ''
    sb = f'''<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Storyboard</title><style>{FACES}{css}</style></head><body>{rd('sb_body.html')}
<script>{lib_h}</script><script>{rd('explainer.js')}</script><script>{rd('sb_script.js')}</script></body></html>'''
    open(os.path.join(B, 'storyboard.html'), 'w', encoding='utf-8').write(sb)
print('built frame.html' + (' + storyboard.html' if os.path.exists(os.path.join(B, 'sb_body.html')) else ''))
