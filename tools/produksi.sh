#!/usr/bin/env bash
# Produksi cepat Channel-Penjelasan (Remotion). Semua perintah dari root repo.
#   tools/produksi.sh setup                         # container baru (npm install)
#   tools/produksi.sh vo     <NN> "<url_mp3>"       # unduh VO terpilih -> remotion/public/vNN/vo.mp3
#   tools/produksi.sh words  <NN> "<words_url>"     # unduh timestamp Scribe -> public/vNN/words.json + cetak kalimat & detik
#   tools/produksi.sh sheet  <NN> 1.2,8.5,20 ...    # still 0.5x di detik tertentu -> satu contact sheet (cek pakai style/cek-bug.md)
#   tools/produksi.sh final  <NN> <slug>            # (otomatis cek-sutradara dulu; GAGAL = batal) render penuh + −14 LUFS + SRT + sheet QC -> video/<slug>.mp4 (jalankan di background)
#   tools/produksi.sh bagian <NN> <slug>            # (otomatis cek-sutradara dulu; GAGAL = batal) render per bagian 15 dtk (lewati yg sudah ada) + gabung + audio; revisi = hapus out/parts-vNN/pXX.mp4
#   tools/produksi.sh cover  <NN> <slug>            # komposisi CoverNN -> cover/<slug>.png
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; R="$ROOT/remotion"
cmd="${1:-}"; NN="${2:-}"
SC="${SCRATCH:-/tmp/produksi}"; mkdir -p "$SC"
# Gerbang otomatis (perintah user 16 Nov): render penuh DIBATALKAN bila cek-sutradara ada GAGAL, supaya tidak boros waktu dan biaya.
gate() { node "$ROOT/tools/cek-sutradara.mjs" "$NN" || { echo "!! RENDER DIBATALKAN: cek-sutradara ada GAGAL. Perbaiki dulu lalu jalankan ulang." >&2; exit 1; }; }
case "$cmd" in
setup) cd "$ROOT" && ./setup.sh ;;
vo)
  mkdir -p "$R/public/v$NN"; curl -sS -o "$R/public/v$NN/vo.mp3" "$3"
  ffprobe -v error -show_entries format=duration -of csv=p=0 "$R/public/v$NN/vo.mp3" ;;
words)
  curl -sS -o "$R/public/v$NN/scribe_words.json" "$3"
  python3 "$ROOT/tools/scribe_to_timeline.py" "$R/public/v$NN/scribe_words.json" "$R/public/v$NN/words.json" >/dev/null
  python3 - "$R/public/v$NN/words.json" <<'EOF'
import json,re,sys
ws=json.load(open(sys.argv[1]))['words']; cur=[]
for w in ws:
    cur.append(w)
    if re.search(r'[.?!]$',w['word']): print(f"{cur[0]['start']:6.2f}  {' '.join(x['word'] for x in cur)}"); cur=[]
if cur: print(f"{cur[0]['start']:6.2f}  {' '.join(x['word'] for x in cur)}")
EOF
  ;;
sheet)
  node "$(dirname "$0")/cek-sutradara.mjs" "$NN" || echo "!! cek-sutradara: ada GAGAL, perbaiki dulu"
  d="$SC/sheet-v$NN"; mkdir -p "$d"; find "$d" -name 'f*.png' -delete
  cd "$R"; IFS=',' read -ra T <<< "$3"
  for s in "${T[@]}"; do fr=$(python3 -c "print(round($s*30))"); timeout 300 npx remotion still "Video$NN" "$d/f$(printf %05d "$fr").png" --frame="$fr" --scale=0.5 --log=error; done
  n=$(ls "$d"/f*.png | wc -l); cols=$(( n < 5 ? n : 5 )); rows=$(( (n + cols - 1) / cols ))
  ffmpeg -y -v error -pattern_type glob -i "$d/f*.png" -filter_complex "tile=${cols}x${rows}" -frames:v 1 "$d/sheet.jpg"
  echo "$d/sheet.jpg" ;;
bagian)
  gate
  # render per bagian 15 dtk (tanpa suara); bagian yang sudah ada dilewati -> revisi cukup hapus file bagian terkait
  slug="$3"; cd "$R"; P="out/parts-v$NN"; mkdir -p "$P"
  total=$(npx remotion compositions 2>&1 | awk -v id="Video$NN" '$1==id{print $4}')
  step=450; i=0
  for ((a=0; a<total; a+=step)); do b=$((a+step-1)); [ $b -ge $total ] && b=$((total-1))
    f="$P/p$(printf %02d $i).mp4"
    if [ ! -s "$f" ]; then echo "render bagian $i ($a-$b)"; npx remotion render "Video$NN" "$f" --frames=$a-$b --muted --concurrency=4 --timeout=120000 --log=error; fi
    echo "file '$(basename "$f")'" ; i=$((i+1))
  done > "$P/list.txt.tmp"; grep "^file" "$P/list.txt.tmp" > "$P/list.txt"
  node "$ROOT/tools/mix-audio.mjs" "$NN" "$P/audio.aac"   # campur langsung, tanpa render frame
  ffmpeg -y -v error -f concat -safe 0 -i "$P/list.txt" -c copy "$P/video.mp4"
  ffmpeg -y -v error -i "$P/video.mp4" -i "$P/audio.aac" -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k -shortest "$ROOT/video/$slug.mp4"
  "$ROOT/tools/produksi.sh" srt "$NN" "$slug"
  ffprobe -v error -show_entries format=duration -of csv=p=0 "$ROOT/video/$slug.mp4"
  ffmpeg -y -v error -i "$ROOT/video/$slug.mp4" -vf "fps=1/6.5,scale=270:-1,tile=6x2" -frames:v 1 "$SC/qc-v$NN.jpg"; echo "QC sheet: $SC/qc-v$NN.jpg" ;;
srt)
  slug="$3"
  python3 - "$R/public/v$NN/words.json" "$ROOT/video/$slug.srt" <<'EOF'
import json,re,sys
ws=json.load(open(sys.argv[1]))['words']; S=[]; cur=[]
for w in ws:
    cur.append(w)
    if re.search(r'[.?!]$',w['word']): S.append(cur); cur=[]
if cur: S.append(cur)
f=lambda t:'%02d:%02d:%02d,%03d'%(t//3600,t%3600//60,int(t%60),round((t%1)*1000)%1000)
open(sys.argv[2],'w').write('\n'.join(f"{i}\n{f(s[0]['start'])} --> {f(s[-1]['end'])}\n{' '.join(w['word'] for w in s)}\n" for i,s in enumerate(S,1)))
EOF
  echo "SRT: video/$slug.srt" ;;
final)
  gate
  slug="$3"; cd "$R"; mkdir -p out
  npx remotion render "Video$NN" "out/$slug-raw.mp4" --concurrency=4 --log=error
  ffmpeg -y -v error -i "out/$slug-raw.mp4" -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k "$ROOT/video/$slug.mp4"
  "$ROOT/tools/produksi.sh" srt "$NN" "$slug"
  ffmpeg -hide_banner -i "$ROOT/video/$slug.mp4" -af loudnorm=print_format=summary -f null - 2>&1 | grep -E "Duration|Input Integrated"
  ffmpeg -y -v error -i "$ROOT/video/$slug.mp4" -vf "fps=1/4.4,scale=270:-1,tile=6x2" -frames:v 1 "$SC/qc-v$NN.jpg"
  echo "QC sheet: $SC/qc-v$NN.jpg" ;;
cover)
  cd "$R"; timeout 300 npx remotion still "Cover$NN" "$ROOT/cover/$3.png" --scale=1 --log=error
  ffmpeg -y -v error -i "$ROOT/cover/$3.png" -vf scale=540:-1 "$SC/cover-v$NN.jpg"; echo "$SC/cover-v$NN.jpg" ;;
*) sed -n 2,9p "$0" ;;
esac
