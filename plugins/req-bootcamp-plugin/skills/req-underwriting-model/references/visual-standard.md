# REQ visual standard for underwriting workbooks

Palette/fonts from `req-ppt-mal` (REQ-mal.pptx): navy `#001D6C` (banners), deep blue `#002881`
(table headers, axis labels), bright blue `#33B1FF` (accents, scenario B series, section rule),
pale blue `#E5F6FF` (tiles, subtotals, input fill), pale green `#E5F9E0` (key results),
light grey `#ECEAEA`, amber `#FFF3CD` (foreløpig inputs). Fonts: TT Hoves Pro Medium (headers),
TT Hoves Pro (body). Helpers in `scripts/req_style.py`.

## Every sheet
- Gridlines off, zoom 85–90 %, landscape, fit to width.
- Two-row banner (navy title + deep-blue subtitle stating what the sheet shows).
- Section headers: navy bold caps with a bright-blue bottom rule (not filled bars).
- Table headers: deep-blue fill, white bold 8.5 pt, wrapped. Thin grey row rules, no vertical grid.
- Subtotals: pale-blue fill with navy top/bottom rule; NOI and kontantstrøm til EK pale green.
- Time series: row 5 = periode, row 6 = kalenderår, freeze panes at E7; forward-only year greyed.
- Rows vertically centred; tenant comment column wrapped.

## Sammendrag (one-pager, columns B–S of equal width ≈ 9.6)
1. Banner: name, location · segment · fund, "KONFIDENSIELT", model date.
2. Two rows of six KPI tiles: kjøpspris, netto yield på kjøp, WAULT (uten opsjon), ledighet,
   pris/kvm BTA, brutto leie år 1 · areal BTA, leie/kvm, NOI år 1, egenkapital, offentlig andel,
   WAULT inkl. opsjoner.
3. Left: base case 10 år (IRR, MoE, gevinst tiles; CoC 3/5/10; DPI 3/5/10).
   Right: returns table per holdeperiode × scenario (exit-verdi, IRR, MoE) + methodology note.
4. Chart row (B–G | H–M | N–S): IRR per holdeperiode (clustered columns, one series per
   scenario, labels inside end in white) | utløpsprofil % av leie (uten/inkl. opsjoner) |
   **Kjøpesum og egenkapital** table (eiendomsverdi → hvert tillegg/fradrag → kjøpesum →
   transaksjonskostnader inkl. kjøpshonorar (REIF) / etablering (RREF) → total investering →
   lån → egenkapital, + netto tillegg/fradrag i NOK og %). MoE is in the returns table, not a chart.
5. **Avkastningsbro**: left (B–J) waterfall chart, right (L–S) the same components in NOK and
   × EK, with a note that avdrag are neutral.
6. Left: IRR sensitivity KPI × exit yield (heatmap, base cell boxed). Right: leietakermiks
   (leie, andel, kategori, utløp, sum + WAULT).
7. Left: forutsetninger as live bullet formulas (incl. eierkost % and NOK/kvm). Right:
   verdistøtte og residualrisiko (kjøpspris, verdi øvrige blokker, implisitt verdi/pris per kvm,
   markedspris, rabatt, netto residual, dekning, kjøpspris vs. bottom-up).
8. REIF: avstemming mot pipeline deck (modell, deck, avvik, kommentar). RREF: avkastningsnivåer
   (ubelånt → belånt → etter honorar → netto investor) og finansiering/covenants. Footer with
   model-check status and sources.

## Charts
- Native openpyxl charts only (copyable into PowerPoint), placed with **TwoCellAnchor** spanning
  an exact cell range (`AnchorMarker` from/to) so charts never overlap or clip regardless of
  column widths. One-cell anchors + guessed cm sizes caused overlap in earlier versions.
- `x_axis.delete = False` / `y_axis.delete = False` (otherwise Excel hides axes), light-grey
  gridlines, no axis line on y, legend on top, 7.5–8 pt text.
- Build a small "Diagramgrunnlag" table on Returns as the chart source.
