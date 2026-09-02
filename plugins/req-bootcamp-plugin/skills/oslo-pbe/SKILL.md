---
name: oslo-pbe
description: Use when they ask about Oslo reguleringsplan, planbestemmelser, saksinnsyn or byggesak — Planinnsyn, Saksinnsyn, Oslo PBE, «hvilke planer gjelder Sommerrogata 17», S-2413, planid. Garden MCP (`varden-garden`). Oslo only (knr 0301). Not Kartverket address lookup, not Brreg, not Norges Bank.
---

# Oslo PBE — Planinnsyn og Saksinnsyn

Spørsmål om **reguleringsplan, planbestemmelser, saksinnsyn eller byggesak i Oslo** går hit. Adresse eller gnr/bnr uten plan går til `kartverket` først. Selskap går til `brreg`.

## Server

MCP-serveren `varden-garden`. Offentlig NLOD / kommunale åpne data fra Oslo kommune / Plan- og bygningsetaten. Ingen nøkkel, ingen Maskinporten, ingen BankID / ID-porten.

## Verktøy

- `oslo_list_layers` — WMS/WFS-lag og titler (WMS GetCapabilities + DescribeFeatureType).
- `oslo_describe_layer` — felt på ett WFS-`typeName` (f.eks. `Reg_eiendom`).
- `oslo_plans_for_parcel` — planer for en teig. `gnr`/`bnr` og/eller `address` (geokodes via Kartverket, bare Oslo `0301`).
- `oslo_plan` — én plan på `planId` (egenskaper, bestemmelser-URL).
- `oslo_wfs_get_feature` — generisk WFS GetFeature (`typeName` + bbox, gnr/bnr eller OGC Filter). CQL støttes ikke.
- `oslo_planbestemmelser` — offentlig tekst fra showregbest (`planId`). Svaret er utdrag fra **PDF**.
- `oslo_search_cases` — Saksinnsyn: `gnr`/`bnr`, `address` og/eller `saksnummer`.
- `oslo_case` — én sak: parter, journal, offentlige dokument-URL-er. Innloggede filer utelates.
- `oslo_case_document` — metadata/tekst hvis PDF-en er offentlig og liten. Hopper over ID-porten.

Svar på bokmål. Oppgi kilden (Oslo kommune / PBE).

## Røykeksempel

«Hvilke reguleringsplaner gjelder Sommerrogata 17?»

- `oslo_plans_for_parcel` med `address`: `Sommerrogata 17` (eller `gnr` 213, `bnr` 416, `knr` `0301`).
- Treff: **S-2255** (`planId` `31`) og **KDP-17**. Deretter `oslo_planbestemmelser` med `planId`: `31`.

«Hent planbestemmelsene for S-2413» (Stortorvet 5, ikke Sommerrogata):

- `oslo_planbestemmelser` med `planId`: `2432392` (showregbest er PDF `.S-2413.pdf`).

## Dette har ikke API-et

- **Ikke Maskinporten, BankID eller ID-porten** — bare det som ligger åpent (NLOD).
- **WFS GetCapabilities** på PLANINNSYN timer ofte ut / **504**. Bruk `oslo_list_layers` (WMS + DescribeFeatureType).
- showregbest er **PDF**, ikke HTML.
- Innloggede / ikke-publiserte Saksinnsyn-filer utelates.
- Bare Oslo (`0301` / `301`). Ikke full Matrikkel (det er `kartverket`). Ikke Norges Bank.
