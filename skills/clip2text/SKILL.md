---
name: clip2text
description: Transcribe YouTube URLs or uploaded MP4 videos into text using the local Clip2text service. Use when the user sends a YouTube link, a direct video URL, or attaches an mp4 and wants the full transcript.
user-invocable: true
metadata: {"openclaw":{"requires":{"bins":["curl","node"]}}}
---

## What this skill does

- Calls the local Clip2text HTTP service running on `127.0.0.1:18888`.
- Supports inputs:
  - YouTube URL
  - Local file path to an mp4 saved on disk

## How to use

This skill is exposed as a slash command.

- `/clip2text <url>`
- `/clip2text` with an attached mp4

### If the user provides a URL (skill args)

Run:

- `{baseDir}/scripts/clip2text.sh <url>`

### If the user uploads an mp4 (attachment)

- Prefer a local attachment path if present.
- If a path is available, run:
  - `{baseDir}/scripts/clip2text.sh <path>`

If no local path is visible, ask one question:
- "I received the mp4, but I cannot access a local file path for it. Can you resend it as a file (not as compressed video), then run /clip2text again"

## Output rules

- Return the transcript as plain text.
- If it is very long, split into multiple messages.
