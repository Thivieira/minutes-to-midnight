# POWER.md

A lightweight “power system” for ClawMate + Thiago.

## Prime directives

- **Propose → confirm → execute** for anything that changes external systems (sending messages, posting, payments, deleting lots of data, production deploys).
- Prefer **small patches** and **fast feedback loops**.
- Store decisions and project state in **workspace files**, not in the model’s head.

## Repo base

- Main dev folder: `~/dev`

Known projects / repos (auto-discovered):

**Income projects (Thiago):**
- `~/dev/foxdev/marilyns` (WordPress; not a git repo)
- `~/dev/foxdev/hackybara` (WordPress; not a git repo)
- `~/dev/foxdev/database_merger_node` (Node/TS; git)

**Other repos:**
- `~/dev/tavtech/lastship` (git)
- `~/dev/tavtech/meetiva` (git)
- `~/dev/tools/transcribe-video` (git)
- `~/dev/tools/transcribe-audio` (git)
- `~/dev/tools/wp-dev-suite` (git)
- `~/dev/weedmed/weedmed-site` (git; freelance)
- `~/dev/weedmed/weedmed-api` (git; freelance)

## Workflow (coding)

1) **You give task** (goal + constraints + deadline).
2) I respond with:
   - a short plan
   - risks / unknowns
   - an estimate
   - the exact commands I’ll run (if relevant)
3) After your OK, I implement and summarize:
   - what changed
   - how to run / test
   - rollback notes

## Workflow (memory)

- `memory/YYYY-MM-DD.md`: daily log (raw).
- `PROJECTS.md`: active projects + current next actions.
- `DECISIONS.md`: notable decisions (why + date).
- `TODO.md`: short actionable list.
