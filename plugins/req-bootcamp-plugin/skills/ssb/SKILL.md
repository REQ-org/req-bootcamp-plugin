---
name: ssb
description: Use when they ask for official Norwegian statistics — befolkning, statistikk, SSB, kommune- eller fylkestall, prisindeks, arbeidsledighet, «hvor mange innbyggere», population, CPI, unemployment. Garden MCP (`varden-garden`), not course FAQ or forklar. Not for company accounts, addresses or weather.
---

# SSB — offisiell statistikk

Spørsmål om **norske tall** går hit: befolkning, prisindeks, arbeidsledighet, kommune- og fylkestall. Kursspørsmål går til `bootcamp-faq` / `/kurs`. Forklaringer uten tall går til `forklar`.

## Server

MCP-serveren `varden-garden` (Varden MCP Garden — åpen, ingen nøkkel). Ikke kursserveren `req-bootcamp`.

## Verktøy

Parameternavnene er **camelCase** — bruk dem nøyaktig (ikke `table_id`, men `tableId`).

1. `ssb_search_tables` — finn tabell. Param: `query` (f.eks. `"befolkning Oslo"`).
2. `ssb_table_metadata` — se dimensjoner og gyldige koder. Param: `tableId` (f.eks. `"11342"`).
3. `ssb_table_data` — hent tall. Param: `tableId` + `valueCodes`. `valueCodes` må være offisielle koder fra metadata, som et objekt `{ "Region": ["0301"], "ContentsCode": ["Folkemengde"] }`. Feil Selection gir ofte **HTTP 400** — da: les metadata på nytt og prøv de oppgitte kodene, ikke finn på egne.
4. `ssb_klass_search` (param `query`) / `ssb_klass_codes` (param `classificationId`) — kommune-, fylke- og næringskoder.

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
