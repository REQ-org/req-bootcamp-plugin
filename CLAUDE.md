# CLAUDE.md — REQ AI Bootcamp plugin

This repo ships a **Claude plugin** for attendees of the REQ AI Bootcamp (a Varden
course for REQ Capital). The plugin, an MCP server, and a public site all live here
and all read the **same course markdown** as their single source of truth.

Content is in Norwegian (bokmål). No sensitive information is stored in this repo.

## The three deliverables

| Part | Path | What it is |
|------|------|-----------|
| **Plugin** | `plugins/req-bootcamp-plugin/` | The shippable artifact: 1 command, 6 skills, course content, `.mcp.json`. |
| **MCP server** | `api/mcp.ts` | Vercel HTTP function (`mcp-handler` + `zod`) exposing 3 read-only tools. |
| **Public site** | `public/` | Landing page, interactive `/kurs` course pages, and the downloadable plugin zip. |

Deployed on Vercel: site at `https://req-bootcamp.vercel.app`, MCP at `/api/mcp`.

## Single source of truth — course content

`plugins/req-bootcamp-plugin/content/`

- `schedule.md` — all 10 sessions (dates + topics)
- `sessions/session-01.md` … `session-10.md` — per-session pre-work and, once held, recap
- `faq.md` — practical logistics (when, where, contacts, tools, access)

Both the plugin skills (via relative `../../content/...` paths) and the MCP server
(via `CONTENT_DIR`) read these files. **Edit content here** — nowhere else. Content is
updated after each session; the plugin/server always serve the latest.

## Plugin contents

`plugins/req-bootcamp-plugin/`

- `.claude-plugin/plugin.json` — plugin manifest (`req-bootcamp`)
- `.mcp.json` — connects attendees to the hosted MCP server (`req-bootcamp`, http)
- `commands/kurs.md` — `/kurs` — overview of the next session (or answers a question)
- `skills/`
  - `prep-me-for-bootcamp` — prep for the next session (pre-work checklist)
  - `bootcamp-recap` — catch up on past sessions
  - `bootcamp-faq` — practical/logistical answers
  - `forklar` — `/forklar <tema>` — explain any concept in plain Norwegian
  - `req-presentation` — generate an REQ-branded PowerPoint (`req_deck.py`, `req_charts.py`)
  - `visualiser-bootcamp` — self-contained HTML visual of the 10-week course

## MCP server tools (`api/mcp.ts`)

- `get_schedule` — full 10-session schedule
- `get_session({ number: 1–10 })` — one session's pre-work + recap
- `get_faq` — practical FAQ

`vercel.json` bundles the `content/**` files into the function via `includeFiles`.

## Marketplace / install

`.claude-plugin/marketplace.json` (repo root) defines the `req-bootcamp-plugin`
marketplace pointing at `./plugins/req-bootcamp-plugin`. Attendees install from their
org, from the public marketplace (`mainquest-labs/req-bootcamp-plugin`), or via the
downloadable `public/req-bootcamp-plugin.zip`. See `README.md` for the attendee flow.

## Working in this repo

- **Local test:** `npm test` — `test/smoke.mts` drives the MCP handler directly with
  Web Requests (no server), exercising `initialize` + the three tools.
- **Stack:** TypeScript ESM, `mcp-handler`, `zod`. Python (`python-pptx`, `matplotlib`)
  only for the `req-presentation` skill.
- After editing content, the smoke test and skills pick it up automatically — no build step.
