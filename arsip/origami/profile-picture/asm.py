import re
L=open('../kwh/explainer.js').read().split('\n')
def idx(s): return next(i for i,l in enumerate(L) if s in l)
st1=idx('// ---- station 1 (hook): the prepaid meter'); cut=idx('// ---- smooth paper cut-outs'); st2=idx('// ---- station 2: appliances'); rend=idx('// ================= render (reference pipeline)')
head='\n'.join(L[:st1]); cutsec='\n'.join(L[cut:st2]); tail='\n'.join(L[rend:])
cfg=open('config.js').read()
head=re.sub(r"  const DURATION = [\d.]+;\n.*?  const TM = \[.*?\];\n", cfg, head, flags=re.S)
head=re.sub(r"const push = seg\([^;]*;","const push = seg(14.3, 14.9) * (1 - seg(16.0, 16.6));",head)
for pat in [r"\n    const S = 0\.115;", r"\n    const sign = \(x, a, b, lines[^\n]*", r"\n    const GREY = '#6a6a70';"]:
    head=re.sub(pat,"",head,count=1)
open('explainer.js','w').write(head+'\n'+cutsec+'\n'+open('scene.js').read()+'\n'+tail)
