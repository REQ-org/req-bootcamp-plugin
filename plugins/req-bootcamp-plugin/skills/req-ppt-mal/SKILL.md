---
name: req-ppt-mal
description: Use when someone wants a PowerPoint presentation that MUST follow REQ's official, fixed company template — asks for «REQ ny ppt mal», «REQ-mal», a presentation "i den nye REQ-malen", or wants a deck where every slide must look identical to REQ's real template rather than an AI-styled approximation. This is stricter than a generic "make it look like REQ" request: it means reusing the actual template file's real slides and layouts verbatim, never redrawing REQ's look from scratch. Always prefer this skill over building a REQ-styled deck by hand when the attendee cares about exact, constant visual consistency across everyone's decks.
---

# REQ ny PPT mal

Produce a `.pptx` that is built **from REQ's real template file**, not a recreation of it. Every slide in the output must come from actually duplicating one of the template's real slides or real named layouts and filling in the placeholders — never from drawing new shapes, colors, or fonts. This is what makes the output *identical* to the template rather than merely similar to it.

The template lives at `assets/REQ-mal.pptx`: one slide master with **41 named layouts** (title slides, agenda, executive summary, content in 1–4 columns, picture slides, key-figures slides, chapter/section dividers, team slides with 1–4 speakers, a blank slide, and closing slides), plus **9 example slides already filled in with real REQ content** (slide 1–9) — these are the safest starting points because they already contain fully-styled native charts and a native table, which a bare layout does not.

**Read `reference/layouts.md` before building anything.** It maps every layout number to its name, background, and placeholder `idx`s, tells you which of the 9 example slides to duplicate for which situation, and — important — how to avoid the geometry trap described below. `reference/layouts-overview.jpg` shows the background/logo treatment of every layout visually.

## Three things that will silently produce a wrong-looking deck if you skip them

**1. Charts and tables need a donor slide, not a bare layout.** A layout's generic content placeholder (`OBJECT` type) is empty — no chart or table baked in. The REQ-styled chart colors and table styling only exist on the example slides (slide 3 has a table + a chart, slide 4 has two charts). If a slide needs a chart or table, duplicate slide 3 or 4 — never build a fresh chart from a bare layout.

**2. A duplicated chart slide shares its chart *data* with its source until you break that link.** `add_slide.py` duplicates a slide's XML, but the chart graphicFrame still points at the same `ppt/charts/chartN.xml` part as the slide you copied it from. Calling `chart.replace_data()` on your copy will silently also change the chart on the original — and on any other slide duplicated from that same source. **Run `scripts/clone_chart_parts.py unpacked/ slideN.xml` right after duplicating any chart-bearing slide, before touching its chart data.** It gives that one slide's chart(s) (and their embedded workbook) an independent copy. (Tables and pictures don't have this problem — a table lives inline in the slide XML, and `insert_picture()` always creates a fresh image part.)

**3. Placeholder `idx` order is not visual reading order.** Layouts with many similar placeholders — Agenda, the 3/4-column Content variants, 3/4-column Picture and Key-figures variants, the 3/4-speaker Team variants — lay them out as *rows or columns of paired slots* (e.g. Agenda pairs a wide text slot with a narrow number slot per row). Filling placeholders in ascending `idx` order without checking position produces garbled, overlapping text. **Before filling any layout with more than ~4 body placeholders, print each placeholder's `left`/`top` (`from pptx.util import Emu; Emu(ph.left).inches`) and group by shared `top` (rows) or shared `left` (columns) — fill row by row, in the order the numbers actually run.** `reference/layouts.md` has the Agenda layout's geometry worked out as a template for how to do this on the others.

## How

1. **Ensure the tools.** `python3 -c "import pptx"`. You'll also want the bundled `pptx` skill's helper scripts (`thumbnail.py`, `add_slide.py`, `clean.py`, `office/validate.py`, `office/soffice.py`) — if that skill is available in this environment, use its scripts for every structural edit. This skill's own `scripts/clone_chart_parts.py` handles the chart-independence step above.

2. **Plan the deck as a storyboard before touching any file.** One line per slide, each assigned a layout number from `reference/layouts.md`. Match the *exact* slot count to the content (3 items → the 3-column variant, not the 4-column variant with one deleted) so you never have to delete a leftover slot.

3. **Pass A — structural, via raw XML (`add_slide.py` on an unzipped copy of `assets/REQ-mal.pptx`):**
   - For every slide that needs a chart, a table, or otherwise matches one of the 9 examples closely: `python add_slide.py unpacked/ slideN.xml` to duplicate it, then immediately `python scripts/clone_chart_parts.py unpacked/ slide<new>.xml` if it has a chart.
   - Don't use `add_slide.py`'s layout-instantiation mode (`add_slide.py unpacked/ slideLayoutN.xml`) — it creates an empty slide with **no cloned placeholders**, which leaves nothing to fill in text-wise. That case is handled in Pass B instead.
   - Re-zip (`cd unpacked && zip -Xr ../work.pptx . -x '.*'`).

4. **Pass B — add every layout-only slide, via python-pptx, in one script:** open `work.pptx` with `Presentation()`, and for each storyboard slide that has no matching example, `prs.slides.add_slide(prs.slide_masters[0].slide_layouts[N-1])` — this **does** correctly clone the layout's placeholders onto the new slide, unlike the raw-XML route. In the same script, fill in **all** slides' content (both the ones from Pass A and the ones just added here) — this is also the right place to do the row/column geometry check from point 3 above. Save.
   - **Text**: set via `run.text` inside `text_frame.clear()` / `add_paragraph()`, not `text_frame.text = "..."` — the latter can wipe inherited formatting. One paragraph per bullet.
   - **Charts**: `chart.replace_data(CategoryChartData(...))` with real categories/numbers — never touch colors or chart type.
   - **Tables**: set `cell.text` per cell, keep the row/column count unless the real data genuinely differs.
   - **Pictures**: `placeholder.insert_picture(path)` — never place an image with your own coordinates.
   - **Unused placeholder from a row/column you don't need**: delete the shape entirely (`sp = ph._element; sp.getparent().remove(sp)`), don't leave it empty — a leftover picture or content placeholder can show a visible "insert" icon in PowerPoint.
   - Never set `run.font.color` or `run.font.name` by hand — if you find yourself doing that, you've picked the wrong placeholder or layout.

5. **Pass C — remove the 9 original example slides and put your slides in the right order**, back at the raw-XML level: edit `<p:sldIdLst>` in `ppt/presentation.xml` to list only your new slides, in your storyboard's order (their relationship IDs are in `ppt/_rels/presentation.xml.rels`), then run `clean.py` to drop the now-orphaned original slides, charts and images. Re-zip.

6. **QA before you hand it over:**
   - `python office/validate.py output.pptx --original assets/REQ-mal.pptx` (the `--original` flag is required for a template-derived deck).
   - `markitdown output.pptx | grep -iE "\bx{3,}\b|lorem|category [0-9]|series [0-9]|TODO|\[insert"` — catches leftover demo data (the example charts' dummy "Category 1"/"Series 1" is exactly what leaks through if `replace_data` was skipped).
   - Convert to images (`soffice.py --headless --convert-to pdf`, then `pdftoppm`) and look at every slide — this is how the Agenda geometry trap in point 3 actually gets caught, so don't skip it even when the file validates cleanly.

7. **Hand over the file** and tell the attendee, in Norwegian (bokmål), what you built — one or two sentences, mentioning it's built directly from REQ's fixed mal.

## What this skill must never do

- Never draw a new title slide, chart, icon, or color from scratch with raw `python-pptx` shapes or `pptxgenjs` — if the content doesn't fit one of the 41 layouts well, use the "Blank" layout (38) and ask one short clarifying question rather than inventing a new visual design.
- Never edit `assets/REQ-mal.pptx` itself — always work on a copy.
- Never guess at REQ's colors or fonts — they come from the template's theme automatically as long as you fill existing placeholders rather than drawing new elements.
