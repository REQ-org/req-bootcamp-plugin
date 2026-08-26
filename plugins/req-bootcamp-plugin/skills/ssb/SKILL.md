---
name: ssb
description: Use when they ask for official Norwegian statistics — befolkning, statistikk, SSB, kommune- eller fylkestall, prisindeks, arbeidsledighet, «hvor mange innbyggere», population, CPI, unemployment. Garden MCP (`varden-garden`), not course FAQ or forklar. Not for company accounts, addresses or weather.
---

# SSB — offisiell statistikk

Spørsmål om **norske tall** går hit: befolkning, prisindeks, arbeidsledighet, kommune- og fylkestall. Kursspørsmål går til `bootcamp-faq` / `/kurs`. Forklaringer uten tall går til `forklar`.

## Server

MCP-serveren `varden-garden` (Varden MCP Garden — åpen, ingen nøkkel). Ikke kursserveren `req-bootcamp`.

## Verktøy

1. `ssb_search_tables` — finn tabell (f.eks. «befolkning Oslo»).
2. `ssb_table_metadata` — se dimensjoner og gyldige koder.
3. `ssb_table_data` — hent tall. `valueCodes` må være offisielle koder fra metadata (f.eks. `Region: ['0301']`). Feil Selection gir ofte **HTTP 400** — da: les metadata på nytt og prøv de oppgitte kodene, ikke finn på egne.
4. `ssb_klass_search` / `ssb_klass_codes` — kommune-, fylke- og næringskoder.

Svar på bokmål, kort, og oppgi kilden (SSB-tabell-id).

## Røykeksempel

«Hvor mange innbyggere har Oslo?»

- Søk «befolkning» → åpne tabellen som har region.
- Metadata: Oslo er `0301`.
- `ssb_table_data` med `valueCodes` som `{ "Region": ["0301"] }` pluss innholdskoden fra metadata (ofte `Folkemengde`).

## Dette har ikke API-et

- Ikke selskapsdata, omsetning eller roller (det er `brreg` / `regnskap`).
- Ikke adresser eller vær.
- Ikke egne utvalg — bare SSBs koder. 400 = Selection er feil, ikke at tallet mangler.
