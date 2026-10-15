#!/usr/bin/env bash
# Encodes the site's background videos and their posters for the web.
#   in:  media-src/hero/desktop.mp4 (landscape), media-src/hero/mobile.mp4 (portrait),
#        media-src/manufacturing/line.mp4 (landscape)
#   out: public/media/hero/hero-{desktop,mobile}.{webm,mp4} + poster-{desktop,mobile}.jpg
#        public/media/manufacturing/line-{desktop,mobile}.{webm,mp4} + line-poster.jpg
# Each loop starts on its poster frame, so the poster → video crossfade is invisible.
# No audio. Run: npm run media:video
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v ffmpeg >/dev/null 2>&1; then
  cat <<'EOF'
ffmpeg is not installed, so the videos were not encoded.
Install it, then run `npm run media:video` again:
  macOS:   brew install ffmpeg
  Windows: winget install Gyan.FFmpeg   (then open a new terminal)
  Linux:   sudo apt install ffmpeg
EOF
  exit 0
fi

FPS=24
VP9="-c:v libvpx-vp9 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p -cues_to_front 1"
H264="-c:v libx264 -preset slow -profile:v high -level 4.1 -pix_fmt yuv420p -movflags +faststart"

# encode <filtergraph producing [out]> <source> <output base> <webm crf> <mp4 crf>
encode() {
  local graph=$1 source=$2 base=$3 webm_crf=$4 mp4_crf=$5
  ffmpeg -y -loglevel error -i "$source" -an -filter_complex "$graph" -map "[out]" $VP9 -crf "$webm_crf" "$base.webm"
  ffmpeg -y -loglevel error -i "$source" -an -filter_complex "$graph" -map "[out]" $H264 -crf "$mp4_crf" "$base.mp4"
}

# Ping-pong loop: plays [start, end] forward then backward (turning frames not doubled).
# Used for the hero clips, whose camera moves: a crossfade would ghost.
pingpong() {
  local start=$1 end=$2 scale=$3
  local frames
  frames=$(awk "BEGIN { print int(($end - $start) * $FPS + 0.5) }")
  echo "[0:v]trim=start=$start:end=$end,setpts=PTS-STARTPTS,fps=$FPS,scale=$scale:flags=lanczos,split[f][r];[r]reverse,trim=start_frame=1:end_frame=$((frames - 1)),setpts=PTS-STARTPTS[b];[f][b]concat=n=2:v=1:a=0[out]"
}

# Crossfade loop: [start + fade, end] with its last `fade` seconds dissolving into
# [start, start + fade], so the last frame leads straight back into the first.
crossfade() {
  local start=$1 end=$2 fade=$3 scale=$4
  local offset
  offset=$(awk "BEGIN { print $end - $start - 2 * $fade }")
  echo "[0:v]fps=$FPS,scale=$scale:flags=lanczos,split[a][b];[a]trim=start=$(awk "BEGIN { print $start + $fade }"):end=$end,setpts=PTS-STARTPTS[main];[b]trim=start=$start:end=$(awk "BEGIN { print $start + $fade }"),setpts=PTS-STARTPTS[head];[main][head]xfade=transition=fade:duration=$fade:offset=$offset,format=yuv420p[out]"
}

# poster <source> <time> <scale> <output>: the loop's first frame, from the source.
poster() {
  ffmpeg -y -loglevel error -ss "$2" -i "$1" -frames:v 1 -update 1 -vf "scale=$3:flags=lanczos" -q:v 2 "$4"
}

for source in media-src/hero/desktop.mp4 media-src/hero/mobile.mp4 media-src/manufacturing/line.mp4; do
  if [[ ! -f "$source" ]]; then
    echo "Missing $source — add the source clip and run again."
    exit 1
  fi
done

mkdir -p public/media/hero public/media/manufacturing

# Hero: both clips open in darkness and switch on; the loops use only the lit part.
echo "Encoding hero (desktop)…"
encode "$(pingpong 2.5 8 1920:1080)" media-src/hero/desktop.mp4 public/media/hero/hero-desktop 38 27
poster media-src/hero/desktop.mp4 2.5 1920:1080 public/media/hero/poster-desktop.jpg

echo "Encoding hero (mobile)…"
encode "$(pingpong 4.5 10 720:1280)" media-src/hero/mobile.mp4 public/media/hero/hero-mobile 36 26
poster media-src/hero/mobile.mp4 4.5 1080:1920 public/media/hero/poster-mobile.jpg

# Manufacturing: conveyor and robot motion would look wrong reversed — crossfade instead.
echo "Encoding manufacturing line…"
encode "$(crossfade 0 10 1 1600:900)" media-src/manufacturing/line.mp4 public/media/manufacturing/line-desktop 36 26
encode "$(crossfade 0 10 1 960:540)" media-src/manufacturing/line.mp4 public/media/manufacturing/line-mobile 36 26
poster media-src/manufacturing/line.mp4 1 1920:1080 public/media/manufacturing/line-poster.jpg

# Report sizes against the budget (KB).
check() {
  local file=$1 limit_kb=$2 size_kb
  size_kb=$(($(wc -c <"$file") / 1024))
  if ((size_kb > limit_kb)); then
    echo "  OVER  $file — ${size_kb} KB (budget ${limit_kb} KB): raise the CRF by 2 and re-run"
  else
    echo "  ok    $file — ${size_kb} KB (budget ${limit_kb} KB)"
  fi
}
echo "Video sizes:"
check public/media/hero/hero-desktop.webm 2560
check public/media/hero/hero-desktop.mp4 3584
check public/media/hero/hero-mobile.webm 1280
check public/media/hero/hero-mobile.mp4 1536
check public/media/manufacturing/line-desktop.webm 2048
check public/media/manufacturing/line-desktop.mp4 3072
check public/media/manufacturing/line-mobile.webm 1024
check public/media/manufacturing/line-mobile.mp4 1280
