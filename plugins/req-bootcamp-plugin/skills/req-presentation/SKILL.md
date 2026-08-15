---
name: req-presentation
description: Use when the attendee wants a presentation in REQ's own look — asks to «lag en presentasjon / REQ-presentasjon», a resultat-/PnL-presentasjon, slides or et lysbilde-dekk om et tema i REQ-stil, or to turn notes or numbers into an REQ-branded PowerPoint.
---

# Lag en REQ-presentasjon

Produce an **editable PowerPoint** (`.pptx`) in REQ's own visual identity — including **REQ-branded charts** for results and P&L — and hand it to the attendee. The bundled `req_deck.py` carries the brand (navy `#001D6C` accent, Calibri, white slides, petrol section dividers, the REQ logo) and `req_charts.py` renders on-brand line / bar / waterfall / donut charts, so you only decide the *content and the numbers*.

## How

1. **Ensure the tools.** Run `python3 -c "import pptx, matplotlib"`; if it fails, `python3 -m pip install python-pptx matplotlib` (quietly). `matplotlib` is only needed when the deck has charts.
2. **Get the topic and any data.** Use what the attendee gave you. If they point at numbers (a P&L, returns, a file), read them and use the **real figures**. If the ask is thin, ask one short question for subject and audience, then proceed — do not stall.
3. **Draft the content**, then build the deck with the helper. Import from the skill directory:

   ```python
   import sys
   sys.path.insert(0, "<this skill's directory>")   # holds req_deck.py + req-logo-navy.png
   from req_deck import ReqDeck

   deck = ReqDeck("Presentasjonstittel", "Undertittel · 18. august 2026")
   deck.section("Bakgrunn")
   deck.content("Innholdsoverskrift", [
       "Ett poeng per kule, med tallene inne i setningen.",
       "Nøktern og redaksjonell — skuffelser nevnes åpent.",
   ], footer="REQ · tema")
   deck.figure("La konklusjonen være overskriften", image="/sti/til/figur.png",
               source="Kilde: … Tall per [dato].")   # or placeholder="[figur her]"
   deck.closing()
   deck.save("presentasjonstittel.pptx")
   ```

   Slide methods: `section(title)`, `content(heading, bullets, footer="")`, `figure(heading, placeholder=…, image=…, source=…)`, `closing()`. The title slide is created for you.

   **Charts (for results, P&L, allocation).** Add on-brand charts with one call each — colours are fixed by the brand, you pass only data:

   ```python
   deck.kpi("Hovedtall", [("+4,2 %", "Avkastning i kvartalet"), ("1,24 mrd", "Forvaltet kapital")])
   deck.chart_line("Avkastning slår referanseindeksen", ["Q1","Q2","Q3"],
                   {"REQ Global Compounders": [0,4,8], "MSCI World": [0,2,4]})
   deck.chart_bars("Kvartalsvis avkastning", ["Q1","Q2","Q3"], [3.1, -1.5, 4.2])   # negatives auto-red
   deck.chart_waterfall("Utvikling i forvaltet kapital (mNOK)", ["Tegning","Avkastning","Innløsning"],
                        [180, 96, -55], start=1020)
   deck.chart_donut("Sektorallokering", ["Teknologi","Helse","Industri"], [34, 22, 18], center="18\nselskaper")
   ```

   **Read `reference/charts.md` to pick the right chart for the data** (which form for which job, and the full signatures). `examples/build_example.py` builds a complete results/P&L deck end-to-end; `examples/preview.png` shows how it looks.
4. **Run the script**, then open the file (`open` on macOS, `start` on Windows, `xdg-open` on Linux).
5. Tell the attendee in **Norwegian (bokmål)** what you built and where the file is — one or two sentences.

For a results or P&L presentation, a good default shape is: title → section → `kpi` headline → `chart_line` (vs benchmark) → `chart_bars` (by period) → `chart_waterfall` (the bridge) → `chart_donut` (allocation) → a short `content` read-through → `closing`.

## REQ house style (the helper enforces the look; you keep the substance on-brand)

- One strong accent — REQ navy `#001D6C`. Supporting tones only: petrol `#005070`, teal `#82C0C7`. White background. **Never** gradients, purple, emoji, or stock icons.
- Editorial and calm: one point per bullet, numbers *inside* sentences, the conclusion as the slide heading. Confident first-person plural; name disappointments openly.
- Aim for a tight deck (title → a few content/figure slides → closing), not a wall of bullets. Real numbers over illustration.

A blank starting template in the same style — `REQ-presentasjon-mal.pptx` — lives in the course's `req-design-pack/templates/` if the attendee would rather fill one in by hand.
