# POWER.md

A lightweight “power system” for ClawMate + Thiago.

## Prime directives

- **Propose → confirm → execute** for anything that changes external systems (sending messages, posting, payments, deleting lots of data, production deploys).
- Prefer **small patches** and **fast feedback loops**.
- Store decisions and project state in **workspace files**, not in the model’s head.

## Repo base

- Main dev folder: `~/dev`

Known repos (auto-discovered):
- `~/dev/foxdev/database_merger_node`
- `~/dev/tavtech/lastship`
- `~/dev/tavtech/meetiva`
- `~/dev/tools/transcribe-video`
- `~/dev/tools/transcribe-audio`
- `~/dev/tools/wp-dev-suite`
- `~/dev/weedmed/weedmed-site`
- `~/dev/weedmed/weedmed-api`

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
