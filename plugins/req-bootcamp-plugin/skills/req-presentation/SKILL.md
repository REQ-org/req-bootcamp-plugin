---
name: req-presentation
description: Use when the attendee wants a presentation in REQ's own look — asks to «lag en presentasjon / REQ-presentasjon», wants slides or et lysbilde-dekk om et tema i REQ-stil, or to turn notes into an REQ-branded PowerPoint.
---

# Lag en REQ-presentasjon

Produce an **editable PowerPoint** (`.pptx`) in REQ's own visual identity and hand it to the attendee. The bundled `req_deck.py` carries the brand — navy `#001D6C` as the single accent, Calibri, white slides, petrol section dividers, the REQ logo — so you only decide the *content*.

## How

1. **Ensure python-pptx.** Run `python3 -c "import pptx"`; if it fails, `python3 -m pip install python-pptx` (quietly).
2. **Get the topic.** Use what the attendee gave you. If it is thin, ask one short question for the subject and audience, then proceed — do not stall.
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
4. **Run the script**, then open the file (`open` on macOS, `start` on Windows, `xdg-open` on Linux).
5. Tell the attendee in **Norwegian (bokmål)** what you built and where the file is — one or two sentences.

## REQ house style (the helper enforces the look; you keep the substance on-brand)

- One strong accent — REQ navy `#001D6C`. Supporting tones only: petrol `#005070`, teal `#82C0C7`. White background. **Never** gradients, purple, emoji, or stock icons.
- Editorial and calm: one point per bullet, numbers *inside* sentences, the conclusion as the slide heading. Confident first-person plural; name disappointments openly.
- Aim for a tight deck (title → a few content/figure slides → closing), not a wall of bullets. Real numbers over illustration.

A blank starting template in the same style — `REQ-presentasjon-mal.pptx` — lives in the course's `req-design-pack/templates/` if the attendee would rather fill one in by hand.
