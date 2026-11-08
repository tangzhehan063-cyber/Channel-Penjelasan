import sys, subprocess
from playwright.sync_api import sync_playwright
a, b, out = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
with sync_playwright() as p:
    br = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--force-color-profile=srgb'])
    pg = br.new_page(viewport={'width': 1080, 'height': 1920})
    pg.on('pageerror', lambda e: print('ERR', e))
    pg.goto('file:///home/claude/semen/frame.html'); pg.wait_for_function('window.ready===true')
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-',
                           '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', '30', out], stdin=subprocess.PIPE)
    cv = pg.locator('#c')
    for f in range(a, b):
        pg.evaluate(f'seek({f/30})')
        ff.stdin.write(cv.screenshot(type='jpeg', quality=94))
    ff.stdin.close(); ff.wait(); br.close()
print('done', a, b)
