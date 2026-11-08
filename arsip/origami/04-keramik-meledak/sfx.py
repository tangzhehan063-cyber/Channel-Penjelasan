import numpy as np, wave
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    br = p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg = br.new_page()
    pg.on('pageerror', lambda e: print('ERR', e))
    pg.goto('file:///home/claude/keramik/frame.html'); pg.wait_for_function('window.ready===true')
    r = pg.evaluate('''async()=>{const o=await SOUND.renderOffline(window.scoreSound, DURATION, 48000, {voiceover:true}); return {peak:o.peak, d:Array.from(o.inter)};}''')
    br.close()
x = np.array(r['d'], dtype=np.float32); print('peak', r['peak'])
x = np.clip(x, -1, 1)
w = wave.open('/home/claude/keramik/audio/sfx.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(48000); w.writeframes((x * 32767).astype('<i2').tobytes()); w.close()
