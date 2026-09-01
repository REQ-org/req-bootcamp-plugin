---
name: brreg
description: Use when they ask about a Norwegian company — selskap, orgnr, organisasjonsnummer, roller, styre, underenhet, adresse til et AS, Enhetsregisteret, Brreg, «slå opp REQ AS». Garden MCP (`varden-garden`). Not for omsetning or årsregnskap (use regnskap). Not course logistics.
---

# Brreg — Enhetsregisteret

Spørsmål om **et selskap** går hit: navn, orgnr, roller, underenhet, forretningsadresse. «Hva omsetter de for?» går til `regnskap`. Kurs og forklaringer går til kurs-skillene.

## Server

MCP-serveren `varden-garden`. Åpen Enhetsregisteret-API, ingen nøkkel.

## Verktøy

- `brreg_search_entities` — søk med `name` (firmanavn) eller `organisasjonsnummer` (ikke et generisk `query`-felt).
- `brreg_get_entity` — én enhet (`organisasjonsnummer`, 9 siffer).
- `brreg_get_roles` — styre og roller (`organisasjonsnummer`). Fødselsnummer kommer aldri med.
- `brreg_search_subunits` — underenheter (`name` eller `overordnetEnhet`).

Svar på bokmål, kort. Nevn orgnr og kilde (Brønnøysundregistrene).

## Røykeksempel

«Slå opp REQ AS.»

- `brreg_search_entities` med navn `REQ AS`, eller rett på orgnr `926931490`.
- `brreg_get_entity` + `brreg_get_roles` for 926931490.
- Adresse i registeret: Sommerrogata 17.

## Dette har ikke API-et

- **Ikke omsetning, årsresultat eller egenkapital** — det er `regnskap` (`brreg_get_accounts`).
- Ikke folkeregister eller fødselsnummer.
- Ikke banker/forsikring sine særskilte regnskap (heller ikke i `regnskap`).
