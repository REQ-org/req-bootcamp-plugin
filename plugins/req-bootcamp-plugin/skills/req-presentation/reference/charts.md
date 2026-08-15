# REQ charts — pick the right form, then call one line

`req_charts.py` renders REQ-branded charts (matplotlib) and the deck's `chart_*`
methods drop them onto a slide. **Choose the form by the data's job**, then call the
matching method on the `ReqDeck`. Colours are fixed by the brand — you never pass a
colour.

See `examples/preview.png` for all of these rendered in one deck, and
`examples/build_example.py` for the exact calls.

## Which chart for which job

| The data's job | Form | Method |
|---|---|---|
| A few headline numbers (return, AUM, # holdings) | Stat tiles | `deck.kpi(...)` |
| Return / NAV over time, fund **vs** benchmark | Line | `deck.chart_line(...)` |
| Return or P&L **by period** (some negative) | Bars | `deck.chart_bars(...)` |
| A **bridge**: start → +/− steps → end (P&L, AUM, attribution) | Waterfall | `deck.chart_waterfall(...)` |
| **Allocation** — parts of a whole (sector, region, asset class) | Donut | `deck.chart_donut(...)` |

Rules the helpers enforce so the deck stays on-brand and readable:

- Navy `#001D6C` is the **primary** series; grey `#666666` is the **recessive
  benchmark**. Gains navy, **losses in the reserved red `#8C1D18`**.
- Every series/wedge/bar is **directly labelled** — identity is never colour-alone
  (this is what keeps the palette colour-blind-safe), and the light teal always
  carries a label.
- One value axis, recessive hairline grid, no gradients, no 3-D, no chartjunk.
- Put the **conclusion in the slide heading** ("Avkastning slår referanseindeksen"),
  not a generic label ("Avkastning").

## The calls

```python
# Headline numbers — up to five (value, label) tiles
deck.kpi("Hovedtall per 30.06.2026", [
    ("+4,2 %", "Avkastning i kvartalet"),
    ("+11,8 %", "Hittil i år"),
    ("1,24 mrd", "Forvaltet kapital (NOK)"),
])

# Line — fund vs benchmark over time (first series = navy, second = grey)
deck.chart_line("Avkastning slår referanseindeksen",
    ["Q3-24", "Q4-24", "Q1-25", "Q2-25"],
    {"REQ Global Compounders": [0, 3.1, 7.8, 6.2],
     "MSCI World":            [0, 2.2, 4.9, 3.1]},
    source="Akkumulert avkastning, indeksert til 0. Illustrasjon.")

# Bars — one series per period; negatives turn red automatically
deck.chart_bars("Kvartalsvis avkastning",
    ["Q1", "Q2", "Q3", "Q4"], [3.1, -1.5, 3.9, 4.2])

# Waterfall — P&L / AUM bridge. `deltas` are signed; start + end totals are added.
deck.chart_waterfall("Utvikling i forvaltet kapital (mNOK)",
    ["Tegning", "Avkastning", "Innløsning"], [180, 96, -55],
    start=1020, start_label="Inngående", end_label="Utgående")

# Donut — allocation; wedges follow the categorical order, all labelled
deck.chart_donut("Sektorallokering",
    ["Teknologi", "Helse", "Industri", "Forbruk", "Finans"],
    [34, 22, 18, 15, 11], center="18\nselskaper")
```

All chart methods also take `source="…"` for the footnote line (currency, "per
[dato]", "Illustrasjon."). Use real numbers; if the attendee only has a file, read it
first and pass the actual figures.
