---
name: clip2text
description: Transcribe YouTube URLs or uploaded MP4 videos into text using the local Clip2text service. Use when the user sends a YouTube link, a direct video URL, or attaches an mp4 and wants the full transcript.
metadata: {"openclaw":{"requires":{"bins":["curl","node"]}}}
---

## What this skill does

- Calls the local Clip2text HTTP service running on `127.0.0.1:18888`.
- Supports inputs:
  - YouTube URL
  - Local file path to an mp4 saved on disk

## How to use

### If the user provides a URL

Run:

- `{baseDir}/scripts/clip2text.sh <url>`

### If the user uploads an mp4

- Look for a local file path provided by the channel adapter.
- If a path is available, run:
  - `{baseDir}/scripts/clip2text.sh <path>`

If no local path is visible, ask one question:
- "I received the video, but I do not have a local file path. Can you resend it with the caption: transcribe"

## Output rules

- Return the transcript as plain text.
- If it is very long, split into multiple messages.
