# Style guide — REQ IC memo conventions

> **Eldre stil.** Standard for alle REQ-decks er PREP-designet i `design.md`. Bruk denne
> filen bare når brukeren ber om den gamle IC-stilen eller oppdaterer et eldre deck.

These are the visual conventions that make a deck look like it came from REQ, distilled
from a real, delivered IC memo built on this template. The template's masters and layouts
already carry most of this automatically (colors, fonts, footer position) — what's below
is mainly the handful of things the *author* does consistently on top of the template that
aren't baked into any placeholder default, so a generic fill-in-the-placeholders pass would
miss them.

## Palette (from `ppt/theme/theme1.xml` — use scheme colors, not hardcoded hex, wherever a shape can take `<a:schemeClr>`)

| Role | Scheme name | Hex | Use |
|---|---|---|---|
| Body text | `dk1` / `tx1` | `1F1E1E` | default text |
| Background | `lt1` / `bg1` | `FFFFFF` | slide background |
| Navy (headings, brand) | `dk2` / `tx2` | `001D6C` | titles use this automatically |
| Navy (fills, diagrams) | `accent1` | `002881` | divider rule, org-chart boxes, dark card fills |
| Bright blue | `accent2` | `33B1FF` | small accents, occasionally a stat label |
| Pale blue | `accent3` / `lt2` | `E5F6FF` | highlight-box fill, pale diagram boxes |
| Pale green | `accent4` | `E5F9E0` | rarely used — alternate callout tint |
| Pale purple | `accent5` | `F6F2FF` | rarely used — alternate callout tint |
| Light gray | `accent6` | `ECEAEA` | neutral highlight-box fill, table zebra striping |

Font: **TT Hoves Pro** (regular) and **TT Hoves Pro Medium** — both embedded in the
template, so they render correctly for anyone opening the file, even without the font
installed. Always use these; don't substitute a system font. If you're doing visual QA via
LibreOffice (see the `pptx` skill), it won't have this font either — expect the QA render
to substitute something else and don't over-trust text-fit on that preview; leave a little
extra slack in text boxes carrying this font.

## Type sizes (from the master; matches what you get by using the placeholders as-is)

| Element | Size | Notes |
|---|---|---|
| Slide title (idx=0) | 40pt | navy (`tx2`), inherited automatically |
| Body / content placeholder | 18pt | inherited automatically |
| Eyebrow / footer placeholder defaults | 20pt / 8pt | **override the eyebrow** — see below |
| Big stat number (Key Figures layouts, or hand-placed) | 28-32pt bold | not a template default — set explicitly |
| Table header | 11-12pt bold, caps | not a template default — set explicitly |

## The eyebrow line (idx=34 on almost every content layout)

Every content slide in the real memo carries a short line directly under the title, in
**small caps, italic, ~11-12pt**, usually in navy or a muted gray — e.g. `SAMMENDRAG`,
`SELSKAPET`, `TEAM — MERITTLISTE`, `VERDISKAPING — INNTEKTSMODELL`. It's a one- or
two-word section label (sometimes `SECTION — SUBSECTION`), not a sentence. The layout's
own default for this placeholder is plain 20pt body text — the italic-caps treatment is
something you set explicitly on the run (`i="1"`, smaller `sz`, and consider `cap="all"` or
just typing it in caps). Keep this label consistent in tone across the deck; it's what
gives a deck of otherwise-varied layouts a unified feel.

## The divider rule

A hairline rule sits right under the **title** (i.e. above the eyebrow line, between the
two — title bottom is around y≈1.22in, the eyebrow placeholder starts around y≈1.39in, and
the rule sits at y≈1.376in, right at the eyebrow's top edge) spanning the full content
width. Several layout families (the "2 columns", "1 column text right", "picture" variants)
already include this as a static shape (`Shape 3`) that appears automatically — no action
needed. The single-column and key-figures layouts don't include it, but the real memo still
draws it there by hand. If your chosen layout lacks it, add a thin rectangle to match:

- position: `x=416855 EMU (≈0.456in)`, `y=1258062 EMU (≈1.376in)`, `width=11361600 EMU
  (≈12.42in)`, `height=3600 EMU` (a hairline)
- fill: `accent1` (navy)

## Highlight / callout boxes

A plain rectangle, light fill (`accent6` gray or `accent3` pale blue), no border, generous
internal padding (~0.2-0.3in), holding one bold sentence — the investment rationale, a
"motstykke" (counterpoint) note, or a set of pre-conditions. Never add an edge stripe or
accent border to make it stand out — the fill tint alone is REQ's convention here.

## Big-number stat callouts

Whether on a dedicated Key Figures layout or hand-placed elsewhere (as on the Investment
Summary slide): the number itself is bold, large (28-32pt), navy or near-black; a short
caption sits directly beneath it in small bold caps (9-10pt), often in a muted blue-gray.
Group related stats in a row or 2×N grid with consistent spacing — don't let one column run
wider than its neighbors just because its number has more digits.

## Tables

Every table in the real memo follows the same recipe:
- **Header row**: bold, small-caps-style labels, no fill, a single thin rule underneath
  (not a filled header band)
- **Body rows**: no vertical gridlines at all; horizontal rules are thin and light gray, or
  omitted in favor of alternating row shading
- **Zebra striping**: alternate white and a very pale tint (`accent6` `ECEAEA` or a lighter
  blue tint) row-by-row — this is what carries the table's structure instead of heavy
  borders
- Left-align text columns; align numeric columns consistently (right-align, or left-align
  if they're short labels like percentages mixed with words — match what reads cleanly)

## Org-chart / structure diagrams

Not a template layout — build these on the **Blank** layout (39) from raw shapes. The
real memo's ownership-structure slide is the reference pattern:
- top-level entity: a navy (`accent1`) filled rounded rectangle, white bold text, centered
- child entities one level down: same treatment, connected to the parent with thin gray
  connector lines (elbow or straight connectors, not free-drawn lines)
- leaf-level detail boxes (e.g. individual SPVs, ownership percentages): smaller boxes,
  pale-blue (`accent3`) fill with a thin navy border, dark text — visually "quieter" than
  the navy top-level boxes, so the hierarchy reads at a glance
- a highlighted number or percentage inside a box (e.g. "25 %") can be set in `accent2`
  bright blue to draw the eye, with the rest of that box's text in normal dark text

Keep the same title + eyebrow + divider-rule treatment at the top of a diagram slide as any
other content slide, even though the layout itself is blank — consistency there matters
more than on any single content box.

## Footer & citations

idx=16 (present on every content layout) is the citation line, 8pt, bottom of the slide.
Fill it with `Kilde: <source>, <date>[, s. <page>].` whenever a slide states a fact,
number, or quote that came from somewhere — matching the real memo's practice of citing a
source on almost every slide. Don't invent a citation if you don't have a real source for
the content on that slide; leave it blank rather than fabricate one.

Slide numbers (idx=4, or idx=12 on the Agenda layout) are automatic — the layout's
`<a:fld type="slidenum">` field handles them; you never need to type a number in
by hand.
