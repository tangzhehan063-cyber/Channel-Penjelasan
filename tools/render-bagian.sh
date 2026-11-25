#!/usr/bin/env bash
# Render fase 7 yang aman untuk container CPU (swangle): per bagian 300 frame, satu tab, browser baru tiap bagian,
# lalu sambung, cek frame rusak, pasang VO, loudness -14 LUFS (loudnorm dua-pass). Pelajaran E1 #03 (style/cek-bug.md).
# Pakai: tools/render-bagian.sh <Komposisi> <keluaran.mp4> --audio <vo.wav> [--dari F] [--sampai F] [--bagian 300]
#   Tanpa --audio: video bisu (untuk uji potongan adegan).
set -euo pipefail
KOMP=$1; OUT=$(realpath -m "$2"); shift 2
AUDIO=""; DARI=0; SAMPAI=""; BAG=300
while [ $# -gt 0 ]; do case $1 in --audio) AUDIO=$(realpath "$2"); shift 2;; --dari) DARI=$2; shift 2;; --sampai) SAMPAI=$2; shift 2;; --bagian) BAG=$2; shift 2;; *) echo "opsi tak dikenal: $1"; exit 1;; esac; done
ROOT=$(cd "$(dirname "$0")/.." && pwd); cd "$ROOT/remotion"
if [ -z "$SAMPAI" ]; then
  N=$(npx remotion compositions src/index.ts 2>/dev/null | awk -v k="$KOMP" '$1==k {print $4}')
  [ -n "$N" ] || { echo "komposisi $KOMP tidak ditemukan"; exit 1; }; SAMPAI=$((N-1))
fi
TMP=$(mktemp -d); echo "render $KOMP frame $DARI-$SAMPAI per $BAG -> $OUT"
for a in $(seq "$DARI" "$BAG" "$SAMPAI"); do
  b=$((a+BAG-1)); [ "$b" -gt "$SAMPAI" ] && b=$SAMPAI
  npx remotion render "$KOMP" "$TMP/p$(printf %06d "$a").mp4" --frames="$a-$b" --concurrency=1 --muted --log=error
  echo "  bagian $a-$b selesai"
done
for f in "$TMP"/p*.mp4; do echo "file '$f'"; done > "$TMP/list.txt"
ffmpeg -loglevel error -y -f concat -safe 0 -i "$TMP/list.txt" -c copy "$TMP/video.mp4"
python3 "$ROOT/tools/cek-frame-rusak.py" "$TMP/video.mp4" || echo "PERINGATAN: ada frame rusak, render ulang bagian terkait sebelum dipakai"
if [ -n "$AUDIO" ]; then
  DUR=$(python3 -c "print(($SAMPAI-$DARI+1)/30)")
  ffmpeg -loglevel error -y -i "$TMP/video.mp4" -ss "$(python3 -c "print($DARI/30)")" -i "$AUDIO" -map 0:v -map 1:a -c:v copy -c:a pcm_s16le -t "$DUR" "$TMP/raw.mkv"
  J=$(ffmpeg -hide_banner -i "$TMP/raw.mkv" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  M=$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
  ffmpeg -loglevel error -y -i "$TMP/raw.mkv" -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p -af "apad,loudnorm=I=-14:TP=-1.5:LRA=11:$M:linear=true" -ar 48000 -c:a aac -b:a 192k -t "$DUR" -movflags +faststart "$OUT"
else
  ffmpeg -loglevel error -y -i "$TMP/video.mp4" -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p -movflags +faststart "$OUT"
fi
rm -rf "$TMP"; echo "selesai: $OUT"
