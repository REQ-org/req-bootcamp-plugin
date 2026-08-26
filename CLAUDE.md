# CLAUDE.md — REQ AI Bootcamp plugin

This repo ships a **Claude plugin** for attendees of the REQ AI Bootcamp (a Varden
course for REQ Capital). The plugin, two MCP servers, and a public site all live here.
Course tools read the **same course markdown** as their single source of truth. The
second MCP wraps public Norwegian open data (no keys).

Content is in Norwegian (bokmål). No sensitive information is stored in this repo.

## The deliverables

| Part | Path | What it is |
|------|------|-----------|
| **Plugin** | `plugins/req-bootcamp-plugin/` | The shippable artifact: 1 command, 6 skills, course content, `.mcp.json`. |
| **Course MCP** | `api/mcp.ts` | Vercel HTTP function (`mcp-handler` + `zod`) exposing 3 read-only course tools. |
| **Public-data MCP** | `api/norge/mcp.ts` + `lib/norge/` | Second hosted MCP: SSB, Enhetsregisteret, Kartverket. No API keys. |
| **Public site** | `public/` | Landing page, interactive `/kurs` course pages, and the downloadable plugin zip. |

Deployed on Vercel: site at `https://req-bootcamp.vercel.app`, course MCP at `/api/mcp`, public-data MCP at `/api/norge/mcp`.

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
- `.mcp.json` — two hosted HTTP servers: `req-bootcamp` (course) and `req-norge` (open data)
- `commands/kurs.md` — `/kurs` — overview of the next session (or answers a question)
- `skills/`
  - `prep-me-for-bootcamp` — prep for the next session (pre-work checklist)
  - `bootcamp-recap` — catch up on past sessions
  - `bootcamp-faq` — practical/logistical answers
  - `forklar` — `/forklar <tema>` — explain any concept in plain Norwegian
  - `req-presentation` — generate an REQ-branded PowerPoint (`req_deck.py`, `req_charts.py`)
  - `visualiser-bootcamp` — self-contained HTML visual of the 10-week course

## Course MCP tools (`api/mcp.ts`)

- `get_schedule` — full 10-session schedule
- `get_session({ number: 1–10 })` — one session's pre-work + recap
- `get_faq` — practical FAQ

`vercel.json` bundles the `content/**` files into the course function via `includeFiles`.

## Public-data MCP (`api/norge/mcp.ts`, `lib/norge/`)

Read-only wrappers around official open APIs. Course tools stay in `api/mcp.ts`;
public-data tools live in `lib/norge/` (one module per source).

- SSB (PxWeb): `ssb_search`, `ssb_table_metadata`, `ssb_get_data`
- Brønnøysund Enhetsregisteret: `brreg_search`, `brreg_enhet`
- Kartverket/Geonorge: `kartverket_adresse`, `kartverket_stedsnavn`, `kartverket_eiendom`
- `norge_kilder` — sources, licenses, example prompts

No secrets. Every response credits the source.

## Marketplace / install

`.claude-plugin/marketplace.json` (repo root) defines the `req-bootcamp-plugin`
marketplace pointing at `./plugins/req-bootcamp-plugin`. Attendees install from their
org, from the public marketplace (`mainquest-labs/req-bootcamp-plugin`), or via the
downloadable `public/req-bootcamp-plugin.zip`. See `README.md` for the attendee flow.

## Working in this repo

- **Local test:** `npm test` — `test/smoke.mts` drives the course MCP; `test/norge-smoke.mts`
  hits the public-data MCP and the real SSB / Brreg / Kartverket APIs.
- **Stack:** TypeScript ESM, `mcp-handler`, `zod`. Python (`python-pptx`, `matplotlib`)
  only for the `req-presentation` skill.
- After editing content, the smoke test and skills pick it up automatically — no build step.
