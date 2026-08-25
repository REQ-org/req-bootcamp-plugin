---
name: req-ic-memo
description: "Build REQ's Investment Committee (IC) memo PowerPoint decks — the exact template, layouts, colors, fonts, and visual conventions REQ uses for every real IC memo, wrapped around a bundled template file so every deck it produces looks identical to REQ's own. Use whenever the user asks for an IC memo, an investment committee presentation, a case memo, or a deal/investment write-up as slides — in Norwegian or English, e.g. \"lag et IC-memo for X\", \"sett opp en investeringskomite-presentasjon om Y\", \"bygg slides for denne investeringen i REQ-malen\". Trigger even without the words \"IC memo\" if the ask describes one's content — team bios, valuation tables, a company/asset overview, pipeline, risk section — for REQ leadership or an investment committee. Slide count and structure should always adapt to the case; this skill is about matching REQ's exact look, not a fixed outline. Always pair with the general pptx skill for the underlying OOXML mechanics."
---

# REQ IC memo decks

This skill makes a new IC memo deck look exactly like a real REQ IC memo — the same
template file, the same 41 layouts, the same colors, fonts, tables, stat callouts, and
footer conventions — while letting the *content and slide count* vary freely from case to
case. It does not prescribe a fixed agenda; it prescribes a fixed look.

It was built by reverse-engineering REQ's actual empty template
(`assets/REQ_IC_Memo_Template.pptx`) together with a real, delivered IC memo built from it,
so the guidance here reflects how REQ analysts actually use the template in practice, not
just what the layouts theoretically support.

**Always load the general `pptx` skill alongside this one.** This skill only adds
REQ-specific knowledge (which layout, which colors, which conventions); the `pptx` skill
supplies the actual mechanics — `add_slide.py` to instantiate layouts, editing slide XML
directly, `clean.py`, `validate.py`, and converting to images for visual QA. Don't try to
build the deck with `pptxgenjs` or by writing `python-pptx` text into placeholders directly
— neither can reproduce this template's exact formatting, and `python-pptx` in particular
collapses styled paragraphs to plain text if you assign `.text` directly. Follow the
`pptx` skill's "Editing existing decks and templates" workflow, using
`assets/REQ_IC_Memo_Template.pptx` as the source file throughout.

## Workflow

**1. Get the case content before touching slides.** An IC memo is only as good as the
research behind it — gather the facts, figures, and sources first (numbers, team details,
market data, valuation, whatever the case needs), the same way you would for any other
research task. Don't start picking layouts for a case you don't understand yet.

**2. Plan the slide list for *this* case.** There's no fixed IC-memo template structure to
fill in — decide what this case actually needs. A real memo's shape is a reasonable prompt
for what an IC memo *can* cover (cover, agenda, investment summary, company/case
background, team, structure/ownership, market, business plan or value-creation thesis,
pipeline, valuation, risk, recommendation, closing) — but skip sections the case doesn't
need, add ones it does, and size the deck to the substance, not to match that list's
length. A smaller deal earns a shorter deck.

**3. Pick a layout per slide.** Read `references/layouts.md` — it groups all 41 layouts by
purpose (title/cover, agenda, executive summary, one-column content, columns, key-figures
stat rows, team, picture, chapter divider, blank/diagram, closing) with guidance on which
one fits a given piece of content, grounded in how the real memo used each one. Match the
layout to the *shape* of the content: prose + one table → one-column content; 3-4 parallel
ideas → a columns layout; a handful of big numbers is the whole point of the slide → a Key
Figures layout, not a bullet list; an ownership/org structure → the Blank layout plus
hand-built shapes (see the style guide's diagram recipe). Open
`assets/layout-catalog.jpg` for a quick visual scan if you're unsure, then confirm the
exact placeholder `idx` values for your chosen layout with
`python scripts/dump_layouts.py --layout "<name>"` before writing XML against it — that
script reads the live template, so it's always current.

**4. Build structurally, then fill content — in that order.** Per the `pptx` skill: unpack
`assets/REQ_IC_Memo_Template.pptx`, add every slide for your final slide list first (each
via `add_slide.py <unpacked>/ slideLayoutN.xml --after <previous slide>`), *then* go back
and edit each slide's content. Doing it in this order matters — editing before all slides
exist means a later duplication would clone already-edited content.

Instantiating a layout this way gives you a genuinely **empty** slide — no inherited
placeholders are written into it for you. You have to add a `<p:sp>` for every placeholder
you want to fill, and its `<p:nvPr><p:ph .../>` must match the layout's own placeholder
**exactly**, `type` attribute included, not just the `idx`. This is the single easiest way
to break a slide silently: get the `type` wrong (or add one where the layout has none) and
PowerPoint/LibreOffice drops that shape's inherited position entirely — it collapses to a
fallback spot and overlaps everything else, while `validate.py` still passes, because
nothing about it is schema-invalid. Never hand-write a `<p:ph>` tag from the idx table
below or from memory of what "usually" works — run
`python scripts/dump_layouts.py --layout "<name>"` and copy each placeholder's raw tag
verbatim (it prints exactly this, for exactly this reason). Non-placeholder shapes on a
layout (the REQ mark, the footer address block, decorative dot patterns, the native
divider rule on some layouts) render automatically on every slide that uses it — don't
recreate them, but do check where they sit before positioning your own text near the top
or edges of the slide, so nothing you add overlaps them.

**5. Apply the REQ conventions on top of the raw placeholders.** The layouts get you
correct positions and inherited fonts/colors, but a few things aren't template defaults and
need to be set by hand on every content slide — read `references/style-guide.md` for the
exact recipe for each:
- the small-caps italic **eyebrow** line under every title (not just typed-in body text at
  the layout's default size)
- the thin **divider rule** under the eyebrow, on layouts that don't already draw one
  natively
- **table** styling (bold header + thin rule, no vertical gridlines, alternating row tint)
- **big-number stat callouts** (bold 28-32pt figure + small bold caption)
- **highlight/callout boxes** (flat tint fill, no border, no accent stripe)
- **org-chart/diagram** slides (navy top-level boxes, pale-blue leaf boxes, thin connector
  lines — built from raw shapes on the Blank layout)
- the title slide's kicker/title/subtitle positioning (the layout's own default stacking
  doesn't match how the real cover slide is actually laid out — see the style guide)
- **citations** in the idx=16 footer placeholder wherever a slide states a sourced fact —
  only when you actually have a source; never fabricate one

**6. QA like any other deck built from a template.** Follow the `pptx` skill's QA section
in full: `markitdown` pass for leftover placeholder text (`Click to add...`) or typos,
`validate.py --original assets/REQ_IC_Memo_Template.pptx` (always pass `--original` — this
template has its own baseline XSD quirks that aren't your bug), then convert to images and
look at every slide. On top of the general checklist, check specifically for: the eyebrow
line present and styled (not left at the layout default), citations present wherever a
number or claim needs one, no empty/orphaned placeholders from a layout with more slots
than you had content for (delete the whole shape, not just its text — see the `pptx`
skill's note on this), and that the deck reads as *this case's* story rather than a
copy-paste of the Revora example's section list.

## Reference files

- `references/layouts.md` — all 41 layouts, grouped by purpose, with idx tables and
  "what it's for" guidance grounded in a real IC memo
- `references/style-guide.md` — colors, fonts, the eyebrow/divider/table/stat-callout/
  highlight-box/org-chart conventions, footer & citation format
- `assets/REQ_IC_Memo_Template.pptx` — the template itself; always build from this file
- `assets/layout-catalog.jpg` — one instantiated slide per layout, for a quick visual scan
  (see the legend at the end of `layouts.md` for how slide numbers map to layout names)
- `scripts/dump_layouts.py` — prints live placeholder idx/position data straight from the
  template; run this before writing XML against any layout, rather than trusting numbers
  copied out of `layouts.md` from memory
