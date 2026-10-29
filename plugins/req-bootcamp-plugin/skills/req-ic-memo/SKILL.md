---
name: req-ic-memo
description: "Build REQ's Investment Committee (IC) memo and case-intro PowerPoint decks in REQ's template with the PREP-style design system (navigation pills, action titles, cards, big numbers, navy take-away banners, native charts) — and fill them with numbers from REQ's underwriting model. Use whenever the user asks for an IC memo, an investment committee presentation, a case memo or intro, or a deal/investment write-up as slides — in Norwegian or English, e.g. \"lag et IC-memo for X\", \"kort intro i REQ-mal\", \"oppdater presentasjonen med tall fra modellen\", \"bygg slides for denne investeringen i REQ-malen\". Trigger even without the words \"IC memo\" if the ask describes one's content — team, ownership structure, portfolio, valuation, returns, sensitivities, risk — for REQ leadership or an investment committee. Slide count and structure adapt to the case. Always pair with the general pptx skill for the underlying OOXML mechanics."
---

# REQ IC memo decks

This skill makes IC memos and case intros that look like REQ's own best decks. It wraps
REQ's real template (`assets/REQ_IC_Memo_Template.pptx`, 41 layouts, embedded TT Hoves Pro)
and, since October 2026, defaults to the **PREP-style design system** taken from the REQ PREP
deck and proven on the Puru Infra intro. The content and
slide count vary per case; the look does not.

**Always load the general `pptx` skill alongside this one** for the mechanics (`add_slide.py`,
`clean.py`, `validate.py`, rendering). Build slides as raw XML with `scripts/prep_kit.py`;
add charts afterwards with `scripts/charts_kit.py` (python-pptx). Never assign `.text` to
template placeholders with python-pptx – it flattens the formatting.

## Workflow

**1. Get the case content and the numbers first.** Read every source (IM, teaser, term
sheet, emails, Brreg). If the case has an underwriting model (the `req-underwriting-model`
skill), read numbers from its cached values (openpyxl `data_only=True`) into a JSON file and
build the deck from that file, so a number (e.g. netto yield) is identical on every slide.
Seller numbers use the seller's definitions (netto yield from the teaser, not leie/GAV).

**2. Check for an existing deck before building.** If the user's folder already has a deck for
this case, stage it and compare it with what you delivered last: the user may have edited it
(new cover photo, changed fund name in the kicker). Build *on top of their version* – keep
their cover and closing, replace only the content slides – and write back to the same path
with `expectedMtimeMs` so you never overwrite edits made while you worked. Clear speaker notes
that came from another deck (copied slides often carry notes from an older memo).

**3. Plan the slide list for this case.** Use the page recipes in `references/prep-design.md`
(summary → company → portfolio → transaction → terms → divider → assumptions → cash flow →
returns → sensitivities → risk → next steps). Skip what the case doesn't need. Decide the
navigation pill names (6–9 sections) now; every content slide shows them with its own
section active.

**4. Build structurally, then fill.** Unpack the template (or the user's deck), add all
slides with `add_slide.py` from `slideLayout9.xml` (content), `slideLayout2.xml` (divider),
then remove superseded slides from `<p:sldIdLst>` and run `clean.py`. Only then write each
slide's XML with `prep_kit`:

```python
import sys; sys.path.insert(0, "<this skill>/scripts")
from prep_kit import *
TABS = ["Sammendrag", "Selskap", "Portefølje", "Transaksjon", "Vilkår", "Underwriting", "Sensitivitet", "Risiko", "Neste steg"]
s = Slide()
header(s, "Plattformcase med 22 % mål-IRR – REQs underwriting gir 12,9 %", "Sammendrag",
       "Én setning kontekst.", TABS, "Sammendrag", cite="Kilde: …")
big_number(s, 0.458, 1.95, "12,9 %", "IRR på REQs A-aksjer, 5 år", "REQ base · 1,80x MoE")
banner(s, 0.458, 6.05, 12.425, 0.48, "Konklusjon: ", "…")
s.write("u/ppt/slides/slide11.xml")
```

Placeholder tags in `prep_kit` (`PH_TITLE`, `PH_LEDE`, `PH_FOOT`, `PH_NUM`) match
slideLayout9 exactly. For any other layout, copy raw tags from
`python scripts/dump_layouts.py --layout "<name>"` – a wrong `type` attribute silently breaks
position inheritance and `validate.py` won't catch it.

**5. Zip, then add native charts** with `charts_kit` (`waterfall` for IRR bridges,
`columns` for cash flow, `hbar` for rent per tenant). For a returns bridge, compute each step
in the underwriting model: copy the seller-case scenario, switch one group of inputs at a time
to REQ base, recalc (`recalc.py`) and read the IRR after each step.

**6. QA – render every slide and look at it.** `validate.py --original <source deck>`, convert
to PDF/PNG and inspect. PREP-specific checks:
- **Titles ≤ ~64 characters** at 28 pt; a second line collides with the kicker.
- Lede is one line; nothing below y 6.0 except the banner; banner text ≤ 2 lines.
- Two heat tables stacked need `rh=0.28`; at 0.36 the second overlaps the banner.
- Card KPI rows: widest value (e.g. "−10,6 / 2,9 %") must fit its box – shrink to 10 pt.
- Same number, same value everywhere (yield, IRR, LTV); gross vs. net yields not mixed.
- Footnote cites the source on every slide with numbers; REQ calculations are marked as such.
- Chart has no auto title; labels readable; negative bars visible.

Then tell the user what changed, which inputs are still foreløpige, and any mismatch you
noticed (e.g. fund named on the cover vs. the fund profile in the model).

## Older style

`references/style-guide.md` documents the original IC-memo look (italic eyebrow, Key Figures
layouts, Revora example). Use it only when the user asks for the old style or edits an old
deck; `references/layouts.md` still documents all 41 layouts.

## Reference files

- `references/prep-design.md` — PREP grid, palette, building blocks, 14 page recipes, writing style
- `references/style-guide.md` — original IC-memo conventions (palette, tables, org charts)
- `references/layouts.md` — all 41 layouts with idx tables and use guidance
- `scripts/prep_kit.py` — slide builders (header, cards, KPIs, pillars, chevrons, steps, tables, heatmaps, org boxes, banner)
- `scripts/charts_kit.py` — native editable charts (waterfall, columns, horizontal bars)
- `scripts/dump_layouts.py` — live placeholder tags/positions from the template
- `assets/REQ_IC_Memo_Template.pptx` — the template; build from this (or the user's deck built on it)
- `assets/layout-catalog.jpg` — one slide per layout
