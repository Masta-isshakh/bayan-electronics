#!/usr/bin/env bash
# Encodes the hero video for the web.
#   in:  media-src/hero/desktop.mp4 (landscape) and media-src/hero/mobile.mp4 (portrait)
#   out: public/media/hero/hero-{desktop,mobile}.{webm,mp4} and poster-{desktop,mobile}.jpg
# Targets: desktop webm ≤ 3.5 MB, mp4 ≤ 5 MB; mobile ≤ 2.5 MB each. Run: npm run media:hero
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v ffmpeg >/dev/null 2>&1; then
  cat <<'EOF'
ffmpeg is not installed, so the hero video was not encoded.
Install it, then run `npm run media:hero` again:
  macOS:   brew install ffmpeg
  Windows: winget install Gyan.FFmpeg   (then open a new terminal)
  Linux:   sudo apt install ffmpeg
EOF
  exit 0
fi

for source in media-src/hero/desktop.mp4 media-src/hero/mobile.mp4; do
  if [[ ! -f "$source" ]]; then
    echo "Missing $source — add the source clip and run again."
    exit 1
  fi
done

out=public/media/hero
mkdir -p "$out"

ffmpeg -y -i media-src/hero/desktop.mp4 -an -vf "scale=1920:-2,fps=24" -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p "$out/hero-desktop.webm"
ffmpeg -y -i media-src/hero/desktop.mp4 -an -vf "scale=1920:-2,fps=24" -c:v libx264 -preset slow -crf 24 -profile:v high -level 4.1 -pix_fmt yuv420p -movflags +faststart "$out/hero-desktop.mp4"
ffmpeg -y -i media-src/hero/mobile.mp4  -an -vf "scale=1080:-2,fps=24" -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p "$out/hero-mobile.webm"
ffmpeg -y -i media-src/hero/mobile.mp4  -an -vf "scale=1080:-2,fps=24" -c:v libx264 -preset slow -crf 25 -profile:v high -level 4.1 -pix_fmt yuv420p -movflags +faststart "$out/hero-mobile.mp4"
ffmpeg -y -ss 00:00:02 -i "$out/hero-desktop.mp4" -frames:v 1 -q:v 2 "$out/poster-desktop.jpg"
ffmpeg -y -ss 00:00:02 -i "$out/hero-mobile.mp4"  -frames:v 1 -q:v 2 "$out/poster-mobile.jpg"

# Report sizes against the budget (KB).
check() {
  local file=$1 limit_kb=$2 size_kb
  size_kb=$(( $(wc -c <"$file") / 1024 ))
  if (( size_kb > limit_kb )); then
    echo "  OVER  $file — ${size_kb} KB (budget ${limit_kb} KB): raise -crf by 2 and re-run"
  else
    echo "  ok    $file — ${size_kb} KB (budget ${limit_kb} KB)"
  fi
}
echo "Hero video sizes:"
check "$out/hero-desktop.webm" 3584
check "$out/hero-desktop.mp4" 5120
check "$out/hero-mobile.webm" 2560
check "$out/hero-mobile.mp4" 2560
