# CLAUDE.md — REQ AI Bootcamp plugin

This repo ships a **Claude plugin** for attendees of the REQ AI Bootcamp (a Varden
course for REQ Capital). The plugin, the course MCP, and a public site all live here.
Course tools read the **same course markdown** as their single source of truth.

The plugin also points at **Varden MCP Garden** (hosted elsewhere, open, no token)
for public Norwegian data. Do not host a second Norge MCP in this repo.

Content is in Norwegian (bokmål). No sensitive information is stored in this repo.

## The deliverables

| Part | Path | What it is |
|------|------|-----------|
| **Plugin** | `plugins/req-bootcamp-plugin/` | The shippable artifact: course + Garden pack skills, commands, content, `.mcp.json`. |
| **Course MCP** | `api/mcp.ts` | Vercel HTTP function (`mcp-handler` + `zod`) exposing 3 read-only course tools. |
| **Public site** | `public/` | Landing page, interactive `/kurs` course pages, and the downloadable plugin zip. |

Deployed on Vercel: site at `https://req-bootcamp.vercel.app`, course MCP at `/api/mcp`.

Public data: plugin `.mcp.json` entry `varden-garden` → `https://varden-mcp-garden.vercel.app/api/mcp`
(SSB, Brreg, Kartverket, MET, Regnskapsregisteret, Oslo Planinnsyn/Saksinnsyn). One server inside this plugin — not a
second marketplace plugin, and no `/api/norge` in this repo.

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
- `.mcp.json` — two hosted HTTP servers: `req-bootcamp` (this repo) and `varden-garden` (Garden)
- `commands/kurs.md` — `/kurs` — overview of the next session (or answers a question)
- `commands/{ssb,brreg,regnskap,kartverket,met,oslo-pbe}.md` — optional slash entry points for each Garden pack
- `skills/`
  - `prep-me-for-bootcamp` — prep for the next session (pre-work checklist)
  - `bootcamp-recap` — catch up on past sessions
  - `bootcamp-faq` — practical/logistical answers
  - `forklar` — `/forklar <tema>` — explain any concept in plain Norwegian
  - `req-presentation` — generate an REQ-branded PowerPoint (`req_deck.py`, `req_charts.py`)
  - `visualiser-bootcamp` — self-contained HTML visual of the 10-week course
  - `ssb` / `brreg` / `regnskap` / `kartverket` / `met` / `oslo-pbe` — when to use each Garden pack (not course skills)

## Course MCP tools (`api/mcp.ts`)

- `get_schedule` — full 10-session schedule
- `get_session({ number: 1–10 })` — one session's pre-work + recap
- `get_faq` — practical FAQ

`vercel.json` bundles the `content/**` files into the course function via `includeFiles`.

## Marketplace / install

`.claude-plugin/marketplace.json` (repo root) defines the `req-bootcamp-plugin`
marketplace pointing at `./plugins/req-bootcamp-plugin`. Attendees install from their
org, from the public marketplace (`mainquest-labs/req-bootcamp-plugin`), or via the
downloadable `public/req-bootcamp-plugin.zip`. See `README.md` for the attendee flow.

## Working in this repo

- **Local test:** `npm test` — `test/smoke.mts` drives the course MCP; `test/garden-pointer.mts`
  asserts `.mcp.json` has `varden-garden` → Garden (not a second plugin, not `/api/norge/mcp`),
  that the six pack skills exist, and that the live Garden lists SSB/Brreg/Kartverket/MET/regnskap/oslo-pbe.
- **Stack:** TypeScript ESM, `mcp-handler`, `zod`. Python (`python-pptx`, `matplotlib`)
  only for the `req-presentation` skill.
- After editing content, the smoke test and skills pick it up automatically — no build step.
