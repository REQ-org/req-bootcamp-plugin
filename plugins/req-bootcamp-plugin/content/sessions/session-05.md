# Økt 5 - Claude Code – Intro (25. sep 2026)

Gjennomgang av Claude Code, med
**markedsføringsmateriale som hostes på en nettside** som gjennomgående eksempel.
Herman starter en oppgave i Claude Code, går rundt og hjelper dere, og gjør det
igjen. GitHub og deploy er nyttig på sikt, men **ikke et krav** denne økta.

## Forarbeid (før 25. sep, under 10 min)

- **Åpne Claude Code** (Desktop eller CLI) og sjekk at du kommer inn med REQ-kontoen.
- **Kjør `/plugin update`** så du har siste kursinnhold.
- **Ta med:** markedsføringsmateriale eller en side du faktisk vil jobbe med. Har du ikke det, følger du eksempelet Herman starter.
- **Fra arbeidsøkta 18. sep:** ta med det du bygde hvis det kan brukes inn i sidearbeidet.

## Oppsummering

Økta 25. september var en introduksjon til Claude Code. Det gjennomgående eksempelet var en investor-side for REQ Evergreen Income Fund, og dere jobbet i deres egen Claude Code. De fleste fikk bygget en første versjon av siden i løpet av timen.

### Oppgaven

Siden er skrevet for pensjonskasser, livselskap og stiftelser, og samler tesen bak fondet, teamet som forvalter det og tallene som underbygger tesen. Ingen trengte å kunne kode: dere beskrev hva dere ville ha med vanlige ord, og Claude laget selve siden.

### Mappen

Alt lå i én mappe som Claude leste selv, så dere trengte ikke lime inn noe:

- **`data/`** - tallene: datafiler med offentlige tall om eldre over 80, sykehjemsplasser og rente, fra blant annet SSB og Norges Bank.
- **`theme/`** - REQ-profilen: fargene, logoene og bildene fra req.no, så siden ser ut som resten av REQ.
- **Fondsfakta** - det som allerede er offentlig om Evergreen: fondet ble lansert i mai 2026, er evigvarende og ubelånt, og har et avkastningsmål på 6–8 %.

Poenget er at siden bare skal bruke tallene som ligger i mappen, og ikke finne på noe.

### Steg 1: en første versjon

Bare denne prompten ble kjørt live i økta:

> Bygg en investor-side for REQ Evergreen Income Fund. Bruk REQ-profilen i theme/ og bare tallene i data/.

Den lengre versjonen av prompten, med seksjonene siden skal ha, står i README-en i mappen.

### Prøv selv: én endring om gangen

De tre neste promptene ble ikke kjørt i økta. De er neste steg hvis dere vil jobbe videre med siden på egen hånd. Ta én endring om gangen, og se på siden mellom hver:

1. «Legg inn en graf over antall personer over 80 år, fra 2010 og fram til 2050»
2. «Skriv om teksten så den passer for en pensjonskasse»
3. «Sjekk at hvert tall på siden finnes i datafilene, og vis meg kilden»

Den siste er verdt å ta med videre: den viser hvordan dere ber Claude sjekke sitt eget arbeid mot kildene.

### Mikrooppgave (før 16. okt)

Åpne Claude Code minst én gang til i løpet av uken, enten på Evergreen-siden eller på noe du selv jobber med, og ta med både det som fungerte og det som stoppet opp til neste økt.

### Neste uke

Økt 6 er fredag 16. oktober, fordi fredagene 2. og 9. oktober ble utsatt. Først viser Herman et kort eksempel på hvordan Claude gjør en Excel-fil om til et interaktivt dashboard. Så jobber dere med en oppgave fra deres egen arbeidsuke, og Herman går rundt og hjelper. Velg én konkret oppgave på forhånd, og ha materialet klart på maskinen.
