#!/usr/bin/env bash
set -euo pipefail

INPUT="${1:-}"
if [ -z "$INPUT" ]; then
  echo "usage: clip2text.sh <youtube-url-or-mp4-path>" 1>&2
  exit 2
fi

HOST="${CLIP2TEXT_HOST:-127.0.0.1}"
PORT="${CLIP2TEXT_PORT:-18888}"
BASE="http://${HOST}:${PORT}"

need_start=0
if ! curl -fsS "$BASE/health" >/dev/null 2>&1; then
  need_start=1
fi

if [ "$need_start" = "1" ]; then
  REPO="${CLIP2TEXT_REPO_DIR:-/home/thivieira/dev/clip2text}"
  (cd "$REPO" && nohup node dist/server.js >/tmp/clip2text.log 2>&1 & echo $! >/tmp/clip2text.pid)
  for i in 1 2 3 4 5 6 7 8 9 10; do
    if curl -fsS "$BASE/health" >/dev/null 2>&1; then
      break
    fi
    sleep 0.2
  done
fi

if [ -f "$INPUT" ]; then
  curl -fsS -X POST "$BASE/v1/transcribe" -F "file=@${INPUT}" | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const j=JSON.parse(d);process.stdout.write(j.text||"");});'
else
  curl -fsS -X POST "$BASE/v1/transcribe" -H 'content-type: application/json' -d "{\"input\":\"${INPUT//"/\\\"}\"}" | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const j=JSON.parse(d);process.stdout.write(j.text||"");});'
fi
