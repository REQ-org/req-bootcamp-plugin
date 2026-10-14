# Interactive Course Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Updated 2026-09-22:** week 5 in `kurs.js` is Claude Code – Intro (marketing site), not skriving/REQ-mal. Ten sessions, last 30 Oct; week 4 is the arbeidsøkt. The steps below are the record of the original build.
>
> **Updated 2026-10-14:** week 6 in `kurs.js` is the dashboard example and working session (16 Oct), not research. The last session is 13 Nov.

**Goal:** Build an interactive, participant-facing exploration companion for the REQ AI Bootcamp - week 1 fully built, weeks 2-10 scaffolded - reached from the existing landing page.

**Architecture:** Static, no-build vanilla HTML/CSS/JS served from `public/` on the existing Vercel site. A shared `kurs.css` (design tokens lifted from the landing page) and `kurs.js` (data model + behaviour) back a `/kurs/` hub (interactive 10-week map) and per-week pages. Content that grows across the course (glossary, prompts, weeks) lives as JS data, so adding a week = adding entries + copying a template.

**Tech Stack:** HTML5, CSS (custom properties), vanilla ES modules-free JS (single `kurs.js`, no imports), Google Fonts (Schibsted Grotesk + IBM Plex Mono, already used). No dependencies, no build step.

**Spec:** `docs/interactive-course-pages-design.md`

## Global Constraints

- Norwegian bokmål for all user-facing copy.
- Spaced hyphen ( - ), never em-dash (—). Standing rule.
- No emoji, no purple gradients, no generic icon-card-grid filler.
- Reuse landing-page tokens verbatim: `--navy #001D6C`, `--paper #FAF9F7`, `--ink #22252B`, `--sans "Schibsted Grotesk"`, `--mono "IBM Plex Mono"`, plus the navy-soft/faint/ghost tints and the `.dots` halftone motif and `rise` animation.
- Motion limited to the existing rise-fade vocabulary; honour `prefers-reduced-motion`.
- Pages must be readable with JS disabled; JS is progressive enhancement.
- Do not refactor the landing page's inline CSS. The only landing-page change permitted is one nav link (and, if needed, nothing else).
- No build tooling, no npm frontend deps, no backend.
- Real content sourced from `../req-bootcamp/tools/deck-builder/build_session01.py` and the plugin's own skills/content. No lorem/filler.

---

## File Structure

```
public/index.html          MODIFY: add one topbar nav link → /kurs/
public/kurs/kurs.css        CREATE: tokens + component styles for course pages
public/kurs/kurs.js         CREATE: data (WEEKS, GLOSSARY, PROMPTS) + behaviour
public/kurs/index.html      CREATE: course hub - interactive 10-week map
public/kurs/uke-01.html     CREATE: week 1 - six modules
public/kurs/_mal.html       CREATE: commented week template (not linked)
public/kurs/uke-02.html …   CREATE: weeks 2-10 "Kommer" placeholders from template
public/kurs/uke-10.html
```

### Data shapes (defined in `kurs.js`, consumed everywhere)

```js
// One node on the hub map; drives map + cross-links.
const WEEKS = [
  { nr: 1, tittel: "Fundament I", fase: 1, status: "live",   href: "uke-01.html",
    tema: "Introduksjon, landskapet og modellvalg" },
  { nr: 2, tittel: "Fundament II", fase: 1, status: "kommer", href: "uke-02.html",
    tema: "Ekte skills i praksis, og bygg din egen" },
  // … nr 3-10, status "kommer"
];
const FASER = [
  { nr: 1, kicker: "Fase 1 · Uke 1-4",  tittel: "Grunnlaget",
    caption: "Fra null til trygg daglig bruk", fra: 1, til: 4 },
  { nr: 2, kicker: "Fase 2 · Uke 5-7",  tittel: "Bygge og automatisere",
    caption: "Vendepunktet: fra bruk til bygging", fra: 5, til: 7 },
  { nr: 3, kicker: "Fase 3 · Uke 8-10", tittel: "Forankring og leveranse",
    caption: "Alle har bygget noe eget", fra: 8, til: 10 },
];
// Glossary entry.
const GLOSSARY = [ { term: "MCP", forklaring: "…", uke: 1 }, /* … */ ];
// Copyable starter prompt.
const PROMPTS  = [ { tittel: "Forklar MCP enkelt", prompt: "…", konsept: "MCP", uke: 1 }, /* … */ ];
```

### Reusable module DOM convention (used by every week-1 module)

Each module is a `<section class="modul" id="…">` with a header (kicker + title + lead) and a body. Interactive "expand" items use:

```html
<button class="expander" aria-expanded="false" data-target="anat-mcp">…</button>
<div class="expander-panel" id="anat-mcp" hidden>…</div>
```

`kurs.js` wires every `.expander` generically: toggles `aria-expanded` and the target's `hidden`. This is written ONCE (Task 3) and reused by all modules - do not re-implement per module.

---

### Task 1: Shared stylesheet and data model

**Files:**
- Create: `public/kurs/kurs.css`
- Create: `public/kurs/kurs.js`

**Interfaces:**
- Produces: CSS custom properties and base classes (`.wrap`, `.dots`, `.modul`, `.kicker`, `.expander`, `.expander-panel`, `.card`, hairline, `rise`); the `WEEKS`, `FASER`, `GLOSSARY`, `PROMPTS` arrays with the shapes above; a `ready(fn)` DOM-ready helper.

- [ ] **Step 1: Create `kurs.css`** with `:root` tokens copied verbatim from `public/index.html` (navy, paper, ink, tints, fonts), the reset, `body`, `.wrap` (max-width 720px for text pages; hub may widen its own container), `.dots`, `rise` keyframe, hairline rule, and `@media (prefers-reduced-motion: reduce)` disabling animation. Add component classes: `.modul`, `.kicker` (mono uppercase eyebrow), module `h2`/`h3`, `.lead`, `.card`, `.expander` (+ `[aria-expanded="true"]` state), `.expander-panel`, `.pill`, `.copy-btn`, and `.anchor-nav`.
- [ ] **Step 2: Create `kurs.js`** defining `WEEKS` (all 10, week 1 `live`, 2-10 `kommer`, real temaer from the README session table), `FASER` (3), `GLOSSARY` (seed with ~18 week-1 terms from the deck: LLM, token, kontekstvindu, Projects, Artifacts, Skills, MCP, plugin, kommando, sub-agent, hooks, agent, Cowork, Claude Code, API, Haiku, Sonnet, Opus), `PROMPTS` (seed ~6 from the deck's "prøv"-prompts), and `ready(fn)`.
- [ ] **Step 3: Verify** - open a scratch HTML linking both files; in devtools console confirm `WEEKS.length===10`, `GLOSSARY.length>=15`, and that `getComputedStyle(document.body).getPropertyValue('--navy').trim()==='#001D6C'`. Delete scratch file.
- [ ] **Step 4: Commit** — `git add public/kurs/kurs.css public/kurs/kurs.js && git commit -m "feat(kurs): shared course styles and data model"`

---

### Task 2: Course hub with interactive 10-week map

**Files:**
- Create: `public/kurs/index.html`

**Interfaces:**
- Consumes: `WEEKS`, `FASER`, `ready` from `kurs.js`.
- Produces: the `/kurs/` entry page; week-1 node links to `uke-01.html`.

- [ ] **Step 1: Build the page shell** - same `<head>` pattern as landing (charset, viewport, title "Kursinnhold - REQ AI Bootcamp", font preconnect/link, `<link rel="stylesheet" href="kurs.css">`, favicon), a header with `.dots`, a topbar (REQ logo left, "← Tilbake" link to `/` right), and a hero (eyebrow "REQ AI Bootcamp", h1 "Kartet", one-line lead about exploring at your own pace). Include `<script src="kurs.js"></script>` before `</body>`.
- [ ] **Step 2: Render the map from data** - a `<section id="kart">` whose JS (in a small inline `<script>` after kurs.js, or a `renderMap()` in kurs.js) builds, from `WEEKS`/`FASER`, an ascending path of 10 nodes grouped into 3 phase bands. `live` nodes are `<a>` (navy, clickable); `kommer` nodes are dimmed non-links with a small "Kommer" pill. Each node shows nr + tittel; hover/focus reveals `tema`. Use CSS grid/flex - no canvas. Provide a mobile fallback: below 620px the map becomes a vertical list of phase groups.
- [ ] **Step 3: Verify** - open `public/kurs/index.html`: map shows 10 nodes in 3 phases; week 1 links to `uke-01.html`; weeks 2-10 are visibly "Kommer" and not clickable; hover shows tema; resize to mobile shows the vertical fallback; keyboard-tab reaches the week-1 link with a visible focus ring.
- [ ] **Step 4: Commit** — `git add public/kurs/index.html && git commit -m "feat(kurs): course hub with interactive 10-week map"`

---

### Task 3: Week-1 page shell, anchor nav, and the shared expander behaviour

**Files:**
- Create: `public/kurs/uke-01.html`
- Modify: `public/kurs/kurs.js` (add generic `.expander` wiring inside `ready`)

**Interfaces:**
- Consumes: `ready`, tokens/classes.
- Produces: `uke-01.html` with header, `.anchor-nav`, and six empty `<section class="modul">` placeholders (ids: `anatomi`, `okosystem`, `kontekst`, `modellvalg`, `begrepsbank`, `prompter`); a global expander handler that toggles `aria-expanded` + target `hidden` for any `.expander[data-target]`.

- [ ] **Step 1: Build the page shell** - same head/topbar/hero pattern as the hub. Hero: eyebrow "Uke 1 · Fundament I", h1 "Introduksjon, landskapet og modellvalg", lead framing the page as a place to go deeper after the session. Topbar right link "← Kartet" to `index.html`.
- [ ] **Step 2: Add anchor-nav + six module stubs** - an `.anchor-nav` listing the six modules (links to the ids above), then six `<section class="modul" id="…">` each with just a kicker + h2 title for now.
- [ ] **Step 3: Add the generic expander handler to `kurs.js`** inside `ready`: for each `.expander`, on click/Enter toggle `aria-expanded` and its `data-target` element's `hidden`. Put a temporary expander in one stub to test.
- [ ] **Step 4: Verify** - open `uke-01.html`: six sections render, anchor-nav jumps to each, the temporary expander opens/closes by mouse and keyboard with `aria-expanded` flipping. Remove the temporary expander.
- [ ] **Step 5: Commit** — `git add public/kurs/uke-01.html public/kurs/kurs.js && git commit -m "feat(kurs): week 1 shell, anchor nav, shared expander"`

---

### Task 4: Module - Plugin-anatomien (hero)

**Files:**
- Modify: `public/kurs/uke-01.html` (`#anatomi` section)

**Interfaces:**
- Consumes: `.expander`/`.expander-panel` convention from Task 3.

- [ ] **Step 1: Build the exploded diagram** - five parts (Kommandoer, Skills, Sub-agenter, MCP-koblinger, Hooks) as `.expander` buttons in a labelled layout. Each panel: what it is (bokmål, from the deck's slide 13 copy) + a real example from this plugin (`/kurs`; `prep-me-for-bootcamp`/`bootcamp-recap`/`forklar`; MCP server for latest content; sub-agenter and hooks explained as "ikke i bruk her ennå"). For Skills and Kommandoer include a short real code/usage snippet in a `<pre>`.
- [ ] **Step 2: Add the "du kaller selv / Claude bruker selv" toggle** - a two-state control that highlights which parts you invoke (Kommandoer) vs which Claude picks up itself (Skills), e.g. by adding a `.self`/`.you` class that tints matching parts. Written with one small handler; no new global state.
- [ ] **Step 3: Verify** - each of the five parts expands with correct copy + example; the toggle visibly re-highlights the right parts; keyboard-operable; reads clearly on mobile (single column).
- [ ] **Step 4: Commit** — `git add public/kurs/uke-01.html && git commit -m "feat(kurs): plugin anatomy module"`

---

### Task 5: Module - Claude-økosystemet

**Files:**
- Modify: `public/kurs/uke-01.html` (`#okosystem` section)

- [ ] **Step 1: Build the layered stack** - four bands (Bygge → Dele → Bruke → Grunnmuren) as expandable rows, copy from deck slide 10 (Skills/MCP/Agenter; Plugins; Claude web/Cowork/Claude Code; LLM). Each expands to "hva det er + når du bygger på dette nivået."
- [ ] **Step 2: Add the swappable-engine interaction** - on the Grunnmuren band, a control cycling Claude ⇄ GPT ⇄ Gemini that visibly leaves the upper bands unchanged, driving home "lagene over blir stående." Text-based swap (no external logos required); if plugin already has model logos in `public/`, reuse, else use names.
- [ ] **Step 3: Verify** - bands expand; engine-swap updates only the foundation label and shows upper layers steady; keyboard + mobile OK.
- [ ] **Step 4: Commit** — `git add public/kurs/uke-01.html && git commit -m "feat(kurs): Claude ecosystem module"`

---

### Task 6: Module - Kontekstvinduet

**Files:**
- Modify: `public/kurs/uke-01.html` (`#kontekst` section)

- [ ] **Step 1: Build the token-budget bar** - a horizontal bar of six segments (Systeminstruks, Verktøy & MCP, Prosjekt & minne, Hentet materiale, Samtalehistorikk, Din melding) plus a hatched "Ledig plass" tail, weighted per deck slide 12. Each segment has a toggle (checkbox/button).
- [ ] **Step 2: Wire the interaction** - toggling a segment off removes its weight and recomputes all widths (flex-grow from a weights map), so "Ledig plass" grows/shrinks live. Add one line of takeaway copy about økonomisk bruk (put fixed context in Projects, keep the window clean).
- [ ] **Step 3: Verify** - toggling segments visibly rebalances the bar and free space; totals never overflow; works on mobile (bar wraps or scales); keyboard-operable.
- [ ] **Step 4: Commit** — `git add public/kurs/uke-01.html && git commit -m "feat(kurs): context window module"`

---

### Task 7: Module - Modellvelgeren

**Files:**
- Modify: `public/kurs/uke-01.html` (`#modellvalg` section)

- [ ] **Step 1: Build the chooser** - a small set of task-type options (e.g. rask oppslag/utkast; daglig analyse & skriving; tung analyse/resonnering; store dokumenter) as buttons; selecting one shows a recommendation card (Haiku / Sonnet / Opus) with a one-line reason, encoding the deck's rule (start Sonnet, lift to Opus when needed).
- [ ] **Step 2: Verify** - each task type yields the right model + reasoning; default state prompts the user to pick; keyboard + mobile OK.
- [ ] **Step 3: Commit** — `git add public/kurs/uke-01.html && git commit -m "feat(kurs): model chooser module"`

---

### Task 8: Module - Begrepsbank (glossary)

**Files:**
- Modify: `public/kurs/uke-01.html` (`#begrepsbank` section)
- Modify: `public/kurs/kurs.js` (add `renderGlossary()`)

**Interfaces:**
- Consumes: `GLOSSARY`.

- [ ] **Step 1: Render from data** - `renderGlossary()` builds the term list from `GLOSSARY` into `#begrepsbank`, each entry showing term + forklaring + a small "Uke N" pill.
- [ ] **Step 2: Add the search filter** - a text input that filters entries client-side on term+forklaring as you type; show a "ingen treff" state; clearing restores all.
- [ ] **Step 3: Verify** - list renders all seeded terms; typing "mcp" narrows to MCP; clearing restores; no-match state shows; keyboard + mobile OK.
- [ ] **Step 4: Commit** — `git add public/kurs/uke-01.html public/kurs/kurs.js && git commit -m "feat(kurs): searchable glossary module"`

---

### Task 9: Module - Prompt-oppskrifter

**Files:**
- Modify: `public/kurs/uke-01.html` (`#prompter` section)
- Modify: `public/kurs/kurs.js` (add `renderPrompts()` + copy handler)

**Interfaces:**
- Consumes: `PROMPTS`.

- [ ] **Step 1: Render from data** - `renderPrompts()` builds cards from `PROMPTS` (tittel, the prompt text in a `<pre>`, a "konsept" tag), into `#prompter`.
- [ ] **Step 2: Add copy-to-clipboard** - each card has a `.copy-btn` using `navigator.clipboard.writeText`; on success show a transient "Kopiert" state (revert after ~1.5s); fall back to selecting the text if clipboard API unavailable.
- [ ] **Step 3: Verify** - cards render; copy button copies the exact prompt and shows "Kopiert"; keyboard-operable; mobile OK.
- [ ] **Step 4: Commit** — `git add public/kurs/uke-01.html public/kurs/kurs.js && git commit -m "feat(kurs): copyable prompt recipes module"`

---

### Task 10: Week template, weeks 2-10 placeholders, landing link, and polish

**Files:**
- Create: `public/kurs/_mal.html`
- Create: `public/kurs/uke-02.html` … `public/kurs/uke-10.html`
- Modify: `public/index.html` (one topbar nav link)

- [ ] **Step 1: Extract `_mal.html`** - a commented copy of the `uke-01.html` shell (head, topbar, hero, empty module region) with `<!-- fyll inn: … -->` guidance and no week-1 content. This is the template for future weeks; not linked from anywhere.
- [ ] **Step 2: Generate weeks 2-10** - from `_mal.html`, one page each with the correct eyebrow/title/tema from `WEEKS`, and a single centred "Kommer" state (kicker "Kommer", short line: this week's content lands after the session) plus a "← Kartet" link. No modules.
- [ ] **Step 3: Add the landing-page link** - in `public/index.html` topbar, add `<a href="/kurs/">Kursinnhold →</a>` next to the existing github link, matching the existing topbar `<a>` styling. Change nothing else in that file.
- [ ] **Step 4: Cross-check the hub** - week 1 → `uke-01.html`; the (now-existing) week 2-10 targets exist so no dead links; but keep 2-10 non-clickable on the hub per spec (they're reachable only if a link is later flipped to `live`).
- [ ] **Step 5: Full verification pass** - from the landing page click "Kursinnhold" → hub → week 1; click through all six modules; open a "Kommer" week directly by URL and confirm it reads cleanly; test one module with `prefers-reduced-motion` forced on (no animation); test mobile width across hub + week 1; disable JS and confirm content is still readable. Confirm the landing page is otherwise visually unchanged.
- [ ] **Step 6: Commit** — `git add public/kurs/_mal.html public/kurs/uke-0*.html public/kurs/uke-10.html public/index.html && git commit -m "feat(kurs): week template, weeks 2-10 scaffold, landing link"`

---

## Self-Review

**Spec coverage:**
- Hub + interactive 10-week map → Task 2. ✓
- Week-1 six modules (anatomi, økosystem, kontekst, modellvalg, begrepsbank, prompter) → Tasks 4-9. ✓
- Data-driven glossary/prompts/weeks → Task 1 (shapes), 8, 9. ✓
- Weeks 2-10 "Kommer" from shared template → Task 10. ✓
- Landing-page single nav link, otherwise untouched → Task 10 step 3. ✓
- Shared tokens / no-AI-slop / reduced-motion / no-JS readability / a11y → Task 1 + per-task verify + Task 10 step 5. ✓
- No build, no deps, Norwegian, spaced hyphen → Global Constraints, honoured throughout. ✓

**Placeholder scan:** No "TBD/TODO" in tasks. `_mal.html` intentionally contains `<!-- fyll inn -->` markers - that is its purpose (a template), not a plan placeholder.

**Type consistency:** `WEEKS`/`FASER`/`GLOSSARY`/`PROMPTS` shapes defined once in Task 1 and consumed with the same field names in Tasks 2, 8, 9. `renderMap`/`renderGlossary`/`renderPrompts` and the `.expander`/`.expander-panel` convention are each defined once and referenced consistently. ✓
