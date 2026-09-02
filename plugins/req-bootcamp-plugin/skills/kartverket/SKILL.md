---
name: kartverket
description: Use when they ask about a Norwegian address, gnr/bnr, stedsnavn, høyde or teig — adresseoppslag, Kartverket, matrikkelenhet i et punkt, elevation, «hva er adressen Sommerrogata 17». Garden MCP (`varden-garden`). Not the full Matrikkel. Not for company lookup or weather.
---

# Kartverket — adresse, sted og teig

Spørsmål om **hvor noe er** går hit: gateadresse, gnr/bnr, stedsnavn, høyde, teig i et punkt. Selskapsnavn går til `brreg`. Vær går til `met`. Reguleringsplan, planbestemmelser eller saksinnsyn i Oslo går til `oslo-pbe`.

## Server

MCP-serveren `varden-garden`. Åpne Kartverket-API-er, ingen nøkkel.

## Verktøy

- `kartverket_search_addresses` — offisiell adresse (f.eks. «Sommerrogata 17»).
- `kartverket_search_placenames` — SSR-stedsnavn.
- `kartverket_elevation` — høyde i WGS84 (`lat`, `lon`).
- `kartverket_property_at_point` — åpen eiendom/matrikkelenhet i et punkt (gnr/bnr, teig).

Svar på bokmål. Oppgi kilden (Kartverket).

## Røykeksempel

«Hva er adressen Sommerrogata 17?»

- `kartverket_search_addresses` med `query`: `Sommerrogata 17`.
- Oslo, kommune `0301`. Bruk treffets koordinater videre til høyde eller teig om de spør.

## Dette har ikke API-et

- **Ikke full Matrikkel** — ingen hjemmelshaver, ingen komplett eiendomsavtale.
- Ikke Enhetsregisteret eller regnskap.
- Ikke værvarsel (det er `met`).
