#!/bin/bash
# Unduh model glb CC0 dari repo agregat series-ai/jam-ready-assets (berkas LFS lewat host media.githubusercontent.com; raw hanya memberi penunjuk LFS).
# Cari nama paket: gh api -X GET search/code -f q='repo:series-ai/jam-ready-assets filename:License.txt' ; tekstur (Textures/colormap.png) diunduh terpisah dari folder yang sama.
# Lisensi tiap paket ada di License.txt paketnya: pastikan CC0/MIT sebelum dipakai. Pencarian kode GitHub dibatasi 100 hasil per halaman.
# pakai: ambil.sh <pack> <folder-tujuan> ; mengunduh glb (satu format saja) dari series-ai/jam-ready-assets lewat host media (LFS)
pack="$1"; tujuan="${2:?}"; mkdir -p "${tujuan:?}"
gh api -X GET search/code -f q="repo:series-ai/jam-ready-assets extension:glb path:$pack" -f per_page=100 --jq '.items[] | .path' > /tmp/furn/l_$pack.txt 2>/dev/null
n=$(wc -l < /tmp/furn/l_$pack.txt); echo "$pack: $n glb ditemukan"
# pilih satu direktori model (GLB format lebih disukai)
dir=$(sed 's#/[^/]*$##' /tmp/furn/l_$pack.txt | sort | uniq -c | sort -rn | head -1 | awk '{ $1=""; sub(/^ /,""); print }')
echo "direktori: $dir"
grep -F "$dir/" /tmp/furn/l_$pack.txt | while read -r p; do
  nama=$(basename "$p"); url="https://media.githubusercontent.com/media/series-ai/jam-ready-assets/main/$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$p")"
  curl -s -L -m 60 -A "Mozilla/5.0" -o "${tujuan:?}/${nama:?}" "$url"; head -c 4 "${tujuan:?}/${nama:?}" | grep -q glTF || { echo "gagal $nama"; rm -f "${tujuan:?}/${nama:?}"; }
done
ls "$tujuan" | wc -l; du -sh "$tujuan"
