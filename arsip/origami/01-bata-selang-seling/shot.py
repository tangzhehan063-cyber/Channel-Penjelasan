import sys, time
from playwright.sync_api import sync_playwright
ts=[float(x) for x in sys.argv[1].split(',')]; pre=sys.argv[2] if len(sys.argv)>2 else 'f'
with sync_playwright() as p:
    br=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--force-color-profile=srgb'])
    pg=br.new_page(viewport={'width':1080,'height':1920})
    pg.on('console',lambda m:print('console',m.text)); pg.on('pageerror',lambda e:print('ERR',e))
    pg.goto('file:///home/claude/bata/frame.html'); pg.wait_for_function('window.ready===true')
    for t in ts:
        t0=time.time(); pg.evaluate(f'seek({t})'); dt=pg.evaluate('(()=>{const a=performance.now();seek(%f);return performance.now()-a})()'%t)
        pg.locator('#c').screenshot(path=f'/home/claude/bata/shots/{pre}_{t:05.1f}.png'); print(t,'ms',round(dt))
    br.close()
