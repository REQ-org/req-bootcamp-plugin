---
name: met
description: Use when they ask for weather or a forecast in Norway — vær, værvarsel, forecast, MET, Meteorologisk institutt, «hva er været i Oslo». Tool met_locationforecast on Garden (`varden-garden`). Not for addresses (use kartverket) or course FAQ.
---

# MET — værvarsel

Spørsmål om **vær og forecast** går hit. Adresseoppslag går til `kartverket` først hvis du mangler koordinater.

## Server

MCP-serveren `varden-garden`. MET locationforecast 2.0 compact. Krediter Meteorologisk institutt.

## Verktøy

`met_locationforecast` — `lat` og `lon` (WGS84). Valgfri `altitude`.

Har de bare et stedsnavn eller en adresse: slå opp koordinater med `kartverket`, deretter dette verktøyet.

Svar på bokmål, kort: temperatur, nedbør, vind for de nærmeste timene/døgnene. Krediter MET.

## Røykeksempel

«Hva er værvarselet for Oslo?» / Sommerrogata 17

- Koordinater for Oslo / Sommerrogata 17 (ca. 59.91, 10.72 — eller hent presist fra `kartverket_search_addresses`).
- `met_locationforecast` med de koordinatene.

## Dette har ikke API-et

- Ikke historisk klima eller lange tidsserier — bare locationforecast.
- Ikke adresser, gnr/bnr eller selskapsdata.
- Ikke kurs-FAQ.
