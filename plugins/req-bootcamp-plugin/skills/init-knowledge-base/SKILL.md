---
name: init-knowledge-base
description: >-
  Use when a REQ bootcamp attendee (or anyone in a Claude Project) wants to
  initiate a Karpathy-style LLM wiki / knowledge base for a project — scaffold
  raw/ + wiki/ folders, index, ingest workflow, and project instructions. Triggers:
  "knowledge base", "kunnskapsbase", "llm wiki", "init wiki", "ingest sources",
  or setting up structured markdown context for a company/case/project.
---

# Initiate a project knowledge base (Karpathy-style LLM wiki)

Scaffold a **persistent, LLM-maintained markdown wiki** for the current project — not RAG. The agent compiles knowledge into `wiki/` as sources arrive; `raw/` stays immutable. Follow Karpathy's llm-wiki pattern (gist `karpathy/442a6bf555914893e9891c11519de94f`).

Answer the user in **Norwegian (bokmål)** unless they write in English. Keep the folder names and schema files in English so tooling stays portable.

## Goal of this skill

1. Ask informed questions about what the knowledge base is for.
2. Make sensible defaults from their answers (don't over-ask).
3. Create the folder scaffolding + `index.md` + ingest instructions + project instructions.
4. Stop after scaffolding — do **not** bulk-ingest sources unless they ask.

## Interview (adaptive)

Ask only what you still need. Prefer 3–5 sharp questions in one turn, then decide.

Cover:

1. **Purpose** — What should this KB help with? (e.g. company dossier, investment memo research, sector deep-dive, meeting/project memory, due diligence.)
2. **Scope** — One company / one theme / one ongoing engagement? Time horizon?
3. **Sources** — What will they drop into `raw/`? (PDFs, web clips, notes, Excel exports, transcripts.) Any must-preserve originals?
4. **Audience** — Only them, or a REQ team reading the wiki in Obsidian/Claude Project?
5. **Language** — Wiki page language: Norwegian, English, or mixed (sources stay as-is).
6. **Name** — Short slug for the root folder (e.g. `kb-aker-bp`, `kb-eiendom-dd`). Default: `knowledge-base` at the project root.

If they already answered in the first message, skip those questions and confirm your plan in one short paragraph before writing files.

## Scaffold to create

Create under the chosen root (default `./knowledge-base/`):

```text
knowledge-base/
├── AGENTS.md              # schema: how the agent maintains this wiki
├── README.md              # human orientation (NO or EN matching wiki language)
├── raw/                   # IMMUTABLE sources — agent never edits
│   ├── .gitkeep
│   └── assets/            # optional images/attachments
│       └── .gitkeep
└── wiki/                  # LLM-owned compiled knowledge
    ├── index.md           # content catalog (update on every ingest)
    ├── log.md             # append-only ops log
    ├── overview.md        # living synthesis of the domain
    ├── sources/           # one summary page per ingested source
    ├── entities/          # people, orgs, products, places
    ├── concepts/          # themes, methods, frameworks
    └── analyses/          # comparisons, memos, filed query answers
```

Adapt subfolders if the domain needs them (e.g. `properties/`, `deals/`) — keep **one level** under `wiki/` only. Document any extra folders in `AGENTS.md`.

### `wiki/index.md` starter

- Title + one-line purpose (from the interview).
- Sections matching the subfolders, each with a short blurb.
- Empty bullet list ready for `link — one-line summary — updated date`.
- Note: "Read this file first before answering queries."

### `wiki/log.md` starter

- Explain append-only format.
- First entry: `## [YYYY-MM-DD] init | Knowledge base created` with purpose + folder layout.

### `wiki/overview.md` starter

- Working title, purpose, open questions, "empty until first ingest".

### `AGENTS.md` (required — the schema)

Must tell future agent sessions:

**Architecture**
- `raw/` immutable; `wiki/` agent-owned; never edit raw.
- Index-first navigation (no embedding RAG required at small/medium scale).

**Ingest**
1. User drops file(s) in `raw/` (or pastes a URL/path) and says ingest.
2. Read source; briefly discuss key takeaways with the user when interactive.
3. Triage: skip if nothing new; else write/update `wiki/sources/<slug>.md`.
4. Cascade: create/update relevant entity/concept/analysis pages (often many).
5. Update `wiki/index.md` for every touched page.
6. Append to `wiki/log.md`: `## [date] ingest | Title` + pages touched.
7. Prefer one source at a time unless the user asks to batch.

**Query**
1. Read `wiki/index.md`, then open relevant pages (full-text search if needed).
2. Answer with citations to wiki pages.
3. Offer to file strong answers back into `wiki/analyses/`.

**Lint** (when asked)
- Contradictions, stale claims, orphans, missing concept pages, weak cross-links.

**Conventions**
- Wiki language from interview.
- Filenames: kebab-case.
- Cross-links: relative markdown links.
- Optional YAML frontmatter: `title`, `updated`, `tags`, `sources`.

### `README.md`

Short human guide: what this is, how to add a source (`raw/` + ask agent to ingest), how to ask questions, pointer to Obsidian optional.

## After scaffolding

1. Show the tree and the purpose you encoded.
2. Tell them the next step: drop first source into `raw/` and say "ingest".
3. Offer to add a Claude Project instruction snippet pointing at `AGENTS.md` / this folder.
4. Do not invent fake wiki content.

## Out of scope

- Vector DB / RAG pipelines.
- Overwriting an existing knowledge base without explicit confirm.
- Ingesting their whole drive unattended on init.
