---
name: nb
description: Use when they ask about Norges Bank figures — styringsrente, policy rate, valutakurs, exchange rate, NOK/USD/EUR, Nowa, statsobligasjonsrente, government yields, banklikviditet, Regionalt nettverk, utlånsundersøkelsen, F-lån. Garden MCP (`varden-garden`). Not SSB statistics, not company accounts, not weather.
---

# Norges Bank — renter, valuta og markeder

Spørsmål om **Norges Bank-tall** går hit: styringsrente, valutakurs, Nowa, statsrenter, banklikviditet, Regionalt nettverk. Befolkning og prisindeks går til `ssb`. Selskapstall går til `brreg` / `regnskap`.

## Server

MCP-serveren `varden-garden` (Varden MCP Garden — åpen, ingen nøkkel). Data er Norges Banks SDMX-API. Ikke kursserveren `req-bootcamp`.

## Verktøy

Parameternavnene er **camelCase**. Alle serie-verktøy tar de samme tidsparameterne: `startPeriod`, `endPeriod`, `lastNObservations`, `locale`, `maxBytes`.

Ferdige snarveier (bruk disse først):

- `nb_policy_rate` — styringsrenten (standard: foliorenten `B.KPRA.SD.R`).
- `nb_exchange_rates` — valutakurser. Param `base` / `quote` (f.eks. `USD` → NOK). Aldri hele EXR-kuben — bruk `lastNObservations` eller datoer.
- `nb_nowa` — Nowa kortrenter (standard overnatten).
- `nb_government_yields` — statsobligasjonsrenter. Param `which` (generiske og/eller nullkupong).
- `nb_liquidity` — banklikviditet (statistikk og/eller prognose).
- `nb_regional_network` — Regionalt nettverk.
- `nb_lending_survey` — utlånsundersøkelsen. Tom kube = `observation_count: 0`, ikke en feil.
- `nb_f_auctions`, `nb_money_market`, `nb_settlement`, `nb_govt_markets` — F-lån, pengemarked, oppgjør, øvrige statsgjeld-/indikatorflyt.

Generisk vei (når snarveien ikke dekker det de spør om):

- `nb_list_dataflows` — levende liste over dataflyter (id, navn). Discovery, ikke en hardkodet katalog.
- `nb_dataflow_structure` — dimensjoner og gyldige koder for én `flow`. Sett `includeSeriesKeys: true` for å få en lovlig KEY uten å gjette.
- `nb_observations` — hent observasjoner for en `flow` + `key`. Returnerer `{flow, key, time_period, value}`.

Svar på bokmål, kort, og krediter **Norges Bank**. Oppgi hvilken rente/serie tallet gjelder.

## Røykeksempel

«Hva er styringsrenten?»

- `nb_policy_rate` med `lastNObservations`: `1` for siste punkt.
- Les verdien og datoen; si hvilken rente det er (foliorenten).

«USD/NOK i dag?»

- `nb_exchange_rates` med `base`: `USD`, `quote`: `NOK`, `lastNObservations`: `1`.

## Dette har ikke API-et

- Ikke SSB-statistikk (befolkning, KPI) — det er `ssb`.
- Ikke selskapstall, adresser eller vær.
- **Timeout:** styringsrente og valuta kan gi `upstream_timeout` etter 20 s — de svarer ikke alltid med et live punkt. Prøv igjen eller snevre inn perioden.
- Nøkkelløst kall på store kuber (`nb_f_auctions`, `nb_money_market`) gir et **avkortet** utsnitt — hent en KEY via `nb_dataflow_structure` med `includeSeriesKeys: true`.
- Caps: 500 rader og et byte-budsjett per svar.
