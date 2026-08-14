---
name: visualiser-bootcamp
description: Use when the attendee wants to see the course visually — asks to «visualiser kurset/bootcampen», wants a diagram, map, overview or timeline of the 10 weeks, or asks how far along the course is.
---

# Visualiser bootcampen

Produce **one self-contained HTML file** — «Kartet»: the course drawn as a climb from bruker to byggmester — and show it to the attendee. Custom rendering only: no chart libraries, no mermaid, no markdown tables.

## Data (never invent)

1. Read `../../content/schedule.md` for all 10 sessions (dates + topics). Details per session in `../../content/sessions/session-NN.md`.
2. Compare each date with today: past sessions = **holdt** (solid dot), the first upcoming = **neste** (larger dot + callout), later = **kommer** (outlined dot).

## The shape

- Landscape layout. One convex ascending path from lower left (økt 1) to upper right (økt 10), drawn as an inline SVG cubic-Bézier curve; the 10 sessions as dots ON the curve.
- Each dot labeled with number + short date («18. aug») in mono, and a 2–4 word topic in sans. Alternate labels above/below the curve and check that no two labels overlap — the curve is steep at the end, so the last dots sit close together.
- Four phase bands shaded under the curve, labeled: **Fundament** (økt 1–2), **Claude i arbeidshverdagen** (økt 3–5), **Bygging** (økt 6–7), **Styring & forankring** (økt 8–10).
- The «neste» session gets a small callout card: full topic + «Neste økt · [dato] kl. 08:30».
- Axis of meaning, not numbers: «bruker» bottom-left, «byggmester» top-right.
- Header: «REQ AI Bootcamp» + «Høsten 2026 · ti tirsdager kl. 08:30». Footer: «Varden × REQ Capital».

## Design tokens (REQ brand — follow exactly)

- **One color:** navy `#001D6C` on paper `#FAF9F7`. All secondary tones are navy at opacity `.07 / .14 / .55` — no other hues, ever.
- **Fonts** (Google Fonts): Schibsted Grotesk for headings/topics, IBM Plex Mono for numbers, dates and small labels.
- Restrained execution: hairline rules, generous whitespace. No drop shadows, no gradients, no emoji, no icons.

## Deliver

- In Claude Code: write the file to a temp path and open it (`open` on macOS, `start` on Windows, `xdg-open` on Linux).
- If no browser/filesystem is available: render the same HTML as an artifact.
- Answer the attendee in Norwegian (bokmål).
