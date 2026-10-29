# Layout catalog — REQ IC memo template

The bundled `assets/REQ_Template.pptx` ships 41 slide layouts on one master. This
doc groups them by what they're for and tells you which one fits a given piece of content,
grounded in how REQ's own analysts actually used them in a real, delivered IC memo
(Revora AS, Fund II — the worked example this skill was built from).

Treat this doc as a fast index, not the only source of truth: run
`python scripts/dump_layouts.py --layout "<name>"` any time you want the exact, current
idx/position numbers for a layout before you write XML against it — that script reads the
live template, so it can never drift out of sync the way this prose can.

Every layout inherits from the master: a small REQ mark bottom-left, a slide-number
placeholder (idx varies, usually 4) bottom-right, and — on every content layout — a
footnote/citation placeholder (idx=16) along the bottom edge. You don't need to add these;
just fill idx=16 with the source citation when the slide states a fact that needs one.

## 1. Title & cover — layouts 1–6 (`slideLayout1-6.xml`)

Six variants of the same idea (idx=0 title, idx=13 subtitle), differing only in background
treatment: plain white, two densities of a light dot pattern, a solid navy field, or (only
layouts 4–6) a large bottom-half photo via a `Picture` placeholder (idx=21).

**What REQ actually does on the cover** (from the Revora deck, which used the
photo variant): don't rely on idx=0/idx=13's default stacked position — override it. Add
three pieces of text positioned by hand:
- a small-caps **kicker** above the title, e.g. `IC MEMO  ·  REQ REAL ESTATE FUND II` —
  white, ~12pt, letter-spaced
- the **title** itself (idx=0) — the company/case name in large bold white, ~48-56pt
- a one-line **subtitle** (idx=13) — a plain-language description of the deal, ~18-20pt
  regular white, just below the title

Mind the logo before placing any of these: the layout's own REQ mark + wordmark + tagline
lockup (a non-placeholder graphic that renders automatically on every slide using this
layout) occupies roughly `x 0.4-3.7in, y 0-1.4in` — noticeably bigger than just the small
diamond mark it looks like at a glance. Keep your kicker at y≈2.0in or lower, clear of that
zone; putting it any higher renders as garbled overlapping text on top of the logo.

Pick whichever of the 6 backgrounds suits the case; the photo variant (layout 4,
`Title Slide + image`) reads the most premium and is what the real memo used — put a
relevant, high-quality photo in the Picture placeholder (idx=21), not a stock cliché. If
you have no real photo for a fictitious or placeholder case, don't fake one — use one of
the plain/pattern backgrounds (layouts 1-3, 6) instead of leaving the picture placeholder
empty or inserting a generic stock image.

## 2. Agenda — layout 7 (`slideLayout7.xml`)

idx=0 title ("Agenda"), idx=34 one-line description of the case just under the title, a
static date textbox, and up to **8 numbered rows** (idx pairs 18/19, 20/21, ... 32/33 — use
the left placeholder of each pair for `01  Section name`; the narrow right-hand ones sit
near the slide edge and are best left empty unless you have a per-row reference like a page
number). Row spacing is fixed (~0.39in) — if a case genuinely needs more than 8 lines,
either tighten wording to fit or split into two agenda slides rather than hand-adding a 9th
row off the grid.

Number the sections `01`, `02`, ... to match how many you're actually using — an agenda
that lists 6 sections for a smaller case looks intentional; one padded to look like the
Revora example's 10 does not. This is the one slide where you commit to the shape of the
whole deck, so build it last, after you know your final slide list.

## 3. Investment Summary / Executive Summary — layout 8 (`slideLayout8.xml`)

The opening substance slide — headline numbers plus the investment thesis in one view.
idx=0 title, idx=34 small italic eyebrow underneath (see Style Guide for the eyebrow
convention), idx=16/idx=4 footer/page number, and one large content box on the right
(idx=18, spans the full right half top-to-bottom).

The real memo's pattern, worth copying directly: bullets on the **left** (added as a plain
text box — this layout doesn't give the left half its own placeholder, so place one
yourself, mirroring idx=18's geometry on the other side), a **grid of big-number stat call-
outs** stacked in the right box (idx=18) — e.g. two rows of three, each a bold number
(28-32pt) with a small bold caption underneath — and a full-width **highlight box**
underneath the bullets holding the one-sentence investment rationale in bold. See the
Style Guide for exact stat-callout and highlight-box treatment.

## 4. Content, one column — layouts 9–10 (`slideLayout9-10.xml`, functionally identical)

The workhorse slide: idx=0 title, idx=34 eyebrow, one full-width content box (idx=15) for
prose, a table, or both stacked. This is what most narrative and single-table slides
should use — reach for it before reaching for anything fancier. There's no separate
divider-line shape baked into this pair of layouts, but the real memo still draws the thin
navy rule under the eyebrow on slides like this (see Style Guide's "divider rule") — add it
yourself as a thin rectangle so every slide reads consistently, whichever layout it came
from.

## 5. Content, one column + picture — layouts 11–14

Four flavors for splitting a slide between prose and an image:
- **12 / 13** (`1_Content slide 2 columns` / `1_Content slide 1 column text right`): text
  left + wide content right, or vice versa — good for "here's the model, here's the table."
- **14 / 15**: a picture placeholder plus one or two text/content boxes, photo on the right
  or left. This is the layout the real memo used for slides that open with a photo of the
  asset before getting into the bullets and comparison table (e.g. the "Kjøp,
  rekonfigurering..." slide) — content-left, photo top-right, table below the photo.

All four carry the divider-rule auto-shape natively (`Shape 3`) — no need to add it by hand
on these.

## 6. Content, 2/3/4 columns (plain or with subtitle) — layouts 15–24

Even column splits for side-by-side comparisons or parallel lists — 2, 3, or 4 content
boxes (idx=15/17/18/22/24 depending on the count), each optionally with its own
mini-heading row above it ("with subtitle" variants add idx's like 18/19/20 for those
per-column captions). Use the plain variant for a straight comparison table split across
columns; use the "with subtitle" variant for something like the real memo's numbered
"01 / 02 / 03" value-creation-pillars slide, or its 4-box PropCo-strategy grid — each
column gets a short bold heading, then supporting text below.

"Containers" variants (16, 17, 20) are visually identical to the plain column layouts but
imply a filled background card behind each column — use them when you want the columns to
read as distinct boxes rather than just adjacent text blocks.

## 7. Picture slides with caption — layouts 25–27

2/3/4 photos side by side, each with a one-line caption placeholder above it. Good for a
portfolio or comparable-assets slide; not used in the Revora memo but the natural fit if a
case needs to show multiple properties or comps at a glance.

## 8. Key figures (big-stat rows) — layouts 28–30

The dedicated "wall of numbers" layout — 2/3/4 stat blocks in a row, each pairing one
placeholder for the number (idx 37/38/40/42, sized generously — these are meant for large
bold figures) with one for its caption underneath (idx 26/27/39/41). Title + eyebrow at
top, an extra note box (idx=32) top-right for a one-line qualifier. This is exactly the
layout behind the real memo's "33.4% / 67-133% / SEK 28m / ~700+" headline-metrics slide —
reach for it whenever a slide's whole point is a handful of big numbers, rather than
cramming them into a content-column layout as prose.

## 9. Full-bleed picture — layout 31

A single edge-to-edge photo, no placeholders except the picture itself. Use sparingly, as a
palate-cleanser between dense sections, not as a content slide.

## 10. Chapter / section divider — layouts 32–34

A title + short description sitting over a bottom half-bleed photo (32, 33) or a plain pale
background (34). Not used in the Revora memo (that deck signaled section changes only via
each slide's eyebrow line), but they're the right tool if a case has enough sections that a
literal divider slide (e.g. "Part II — Valuation & Risk") earns its place — don't insert
one just to pad length.

## 11. Team slides — layouts 35–38

1/2/3/4 headshots in a row, each with a name/role placeholder above and a short bio content
box below. The real memo's 3-speaker version put photos on top, names/roles as bold
captions, and a longer freeform bio+track-record box beneath. Pick the variant that matches
your actual headcount — don't leave slots empty; if you only have 2 photos, use the
2-speaker layout, not the 3-speaker one with a gap.

These layouts are a good concrete example of the idx/type pitfall in the main SKILL.md:
each speaker's bio/role content placeholders carry **no `type` attribute at all** in the
underlying XML (not `type="body"`, not `type="obj"` — just `idx="N"`). Writing
`type="body"` on them (a natural guess, since they hold text) breaks their position
inheritance and collapses every speaker's boxes on top of each other. Always copy the raw
tag `dump_layouts.py` prints for these idx's rather than inferring one.

## 12. Blank — layout 39

Just the master furniture (REQ mark, footer, page number). This is the right choice for
a **custom diagram slide** — an ownership/org chart, a process flow, anything built from
raw shapes and connector lines rather than filled-in placeholders. The real memo's company-
structure chart (parent → OpCo/PropCo/InvestCo → SPVs) was built this way: add a title and
eyebrow as plain text boxes (matching the standard position — see Style Guide), then lay
out the diagram yourself in the space below. See Style Guide's "org-chart / diagram
convention" for the shape and color recipe.

## 13. Closing — layouts 40–42

Three variants carrying the office addresses (as automatic layout furniture) plus an
idx=14 content box you fill with REQ's standard brand tagline — it is **not**
pre-populated; write `Investing with insight.` / `Building what's next.` into it yourself
(as two paragraphs), the same on every deck, unless the user specifically wants a custom
closing message.

Use **layout 39 (`Closing slide`, white background)** as the default — its address-block
text renders correctly there. Layout 41 (`Closing slide 3`, full navy background) has a
real contrast bug: that variant's address-block text is dark-on-navy and effectively
illegible, since it's non-placeholder layout furniture you can't restyle from the slide.
Avoid it, or if the user specifically wants the navy closing variant, flag the legibility
problem rather than shipping it silently.

## Quick lookup: slide number in `assets/layout-catalog.jpg` → layout name

The catalog image's **first thumbnail, `slide1.xml`, is not a layout instance** — it's the
template's own pre-existing blank Title Slide, left over from the template file itself.
Ignore it. The 41 layout instances follow, numbered `slide02.xml` through `slide42.xml` in
the order in this doc (i.e. `slideN.xml` = layout `N-1`, 1-indexed — `slide02.xml` is
layout 1, `Title Slide`; `slide42.xml` is layout 41, `Closing slide 3`).

Treat this image as a rough visual sanity-check only (background color/pattern, roughly
where the big blocks sit) — placeholders render with their literal prompt text
("Click to add content") at whatever size the layout defaults to, which is not always
legible at thumbnail resolution, and it obviously can't show you idx or type values. For
anything you're about to write XML against, `dump_layouts.py` is the real source of truth,
not this image.
