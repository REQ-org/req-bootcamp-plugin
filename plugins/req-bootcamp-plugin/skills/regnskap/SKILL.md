---
name: regnskap
description: Use when they ask what a Norwegian company turns over or earns — omsetning, «hva omsetter de for», årsresultat, driftsresultat, egenkapital, nøkkeltall, årsregnskap. Garden tool brreg_get_accounts on `varden-garden`. Empty = no public filing. Not the closed 3-year ledger. Not for banks/insurance. Not for orgnr/roles (use brreg).
---

# Regnskap — offentlige nøkkeltall

Spørsmål om **penger i et norsk selskap** går hit: omsetning, årsresultat, driftsresultat, egenkapital. Oppslag av navn, orgnr og roller går til `brreg`.

## Server

MCP-serveren `varden-garden`. Offentlig Regnskapsregisteret, ingen nøkkel.

## Verktøy

Bruk **`brreg_get_accounts`** med `organisasjonsnummer` (9 siffer). Valgfritt `year` og `type` (`SELSKAP` / `KONSERN`).

Tomt svar = ingen offentlig innlevering — si det ærlig, ikke gjett.

Andre verktøy i samme pakke (bare hvis de ber om det): ett regnskap på id, år med PDF-kopi-URL, mellom balanse-URL. De gir **URL, ikke PDF-bytes**.

Svar på bokmål. Oppgi år, beløp og kilde (Regnskapsregisteret).

## Røykeksempel

«Hva omsetter REQ AS for?»

- `brreg_get_accounts` med `organisasjonsnummer`: `926931490`.
- Les `sumDriftsinntekter` / omsetning, resultat og egenkapital for siste år.

## Dette har ikke API-et

- Ikke den **lukkede 3-års hovedboken** — bare åpne nøkkeltall.
- Ikke banker og forsikring (annet regime).
- Ikke roller eller adresse (det er `brreg`).
- Tom liste er et svar: selskapet har ikke levert offentlig regnskap.
