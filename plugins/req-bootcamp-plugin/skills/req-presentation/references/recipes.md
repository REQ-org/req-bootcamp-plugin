# Sideoppskrifter – presentasjoner utenom IC-memo

Alle oppskrifter bruker grid, palett og byggeklosser fra `design.md`. De er utgangspunkt,
ikke fasit: hopp over sider caset ikke trenger, og la innholdet bestemme lengden.
Koordinater er i tommer (innholdsflate y 1,95–6,0, banner y 6,05).

## Felles for alle decks

- **Forside** – `cover()` på layout 1–3, eller 4–6 hvis brukeren har et ekte bilde.
  Kicker = anledning · dato (f.eks. «REQ · Næringseiendomsseminaret · 12.11.2026»).
- **Agenda** (decks med ≥ 8 sider) – `step()` 1–6 nedover venstre kolonne (y fra 2,0,
  `line_h` 0,4), lyst kort til høyre med «Dette sitter du igjen med» som `bullets()`.
- **Seksjonsskiller** – `divider()` bare når decket har 3+ tydelige deler og ≥ 12 sider.
- **Avslutning** – `closing()`. Kontaktinfo, hvis ønsket, som lite kort over taglinen.

## A. Seminar, foredrag og ekstern presentasjon (8–20 sider)

Målet er ett budskap publikum husker. Ingen navigasjonspiller.

1. **Forside.**
2. **Budskapet** – `big_number()` til venstre med tallet som bærer hele foredraget,
   tre `pillar()` til høyre (01/02/03 = de tre argumentene). Banner med budskapet i én setning.
3. **Agenda** (valgfritt, se felles).
4. **Argumentsider** (én per pillar, gjerne 2 sider hver) – tittel = påstanden. Venstre:
   graf (`line`, `columns` eller `hbar`) med `label()` over. Høyre: `bullets()` med 2–4 punkter
   eller to `card()` med `kpi()`. Banner med hva det betyr.
5. **Case eller eksempel** – lyst kort med fakta til venstre (`kpi()` × 3–4), `quote()` eller
   `bullets()` til høyre.
6. **Sitat eller vendepunkt** (valgfritt) – `quote()` over hele bredden (y 2,3, h 2,6).
7. **Hva betyr det for dere** – tre kort (tre-kort-griden) med overskrift og `bullets()`.
8. **Oppsummering** – tre `pillar()` som gjentar argumentene + banner.
9. **Avslutning.**

## B. Resultat-, kvartals- og PnL-presentasjon (8–12 sider)

Tallene først, forklaringen etterpå. Navigasjonspiller kan brukes ved 5+ seksjoner.

1. **Forside** – kicker «Resultatpresentasjon · 3. kvartal 2026».
2. **Hovedtall** – fire kort (fire-kort-griden, y 1,95, h 1,1) med `kpi()`: avkastning,
   forvaltet kapital, resultat, nøkkeltall. Under: `pillar()` × 3 (hva gikk bra / hva gikk
   svakt / utsikter). Banner med konklusjonen.
3. **Utvikling** – `line()` mot referanseindeks over hele bredden eller venstre 7,9; høyre
   kort med periodens tall.
4. **Per periode** – `columns()` (f.eks. kvartalsvis avkastning eller inntekter/kostnader).
5. **Bro** – `waterfall()` fra inngående til utgående (kapital, resultat eller NOI), med
   tabell over postene til høyre.
6. **Fordeling** – `donut()` til venstre, `table()` med beløp og andel til høyre.
7. **Portefølje eller enheter** – `hbar()` + `table()`.
8. **Kommentar** – `bullets()` med (lead-in, forklaring) per avvik; skuffelser nevnes åpent.
9. **Utsikter og neste steg** – `step()` 1–4 + lyst kort med forventninger.
10. **Avslutning.**

## C. Investor- og fondspresentasjon (10–16 sider)

Navigasjonspiller anbefales (f.eks. REQ · Strategi · Portefølje · Avkastning · Team · Vilkår).

1. **Forside** – helst layout 4–6 med bilde av en eiendom i porteføljen.
2. **Sammendrag** – `big_number()` (mål- eller oppnådd avkastning) + tre `pillar()`; høyre:
   navy kort med fondets nøkkeltall (`kpi()` på navy: `c="FFFFFF", capc=LBLUE`).
3. **Hvorfor nå** – `line()` eller `columns()` med markedsdata + `bullets()`.
4. **Strategi** – `chevrons()` for prosessen (sourcing → underwriting → forvaltning → exit),
   tre kort under med hva som skiller oss.
5. **Portefølje** – `hbar()` per eiendom + `table()` (segment, areal, WAULT, yield).
6. **Avkastning** – `columns()` per år eller `waterfall()` for avkastningsbroen, `table()`
   med IRR/MoE.
7. **Risiko og håndtering** – `chip()` + én linje per risiko til venstre, tiltak som `step()`
   til høyre.
8. **Team** – kort med `initials()`, navn, rolle og to linjer bakgrunn (2 × 3 kort).
9. **Vilkår** – `table()` (forvaltningshonorar, hurdle, carry, løpetid, minste tegning).
10. **Prosess og neste steg** – horisontal `step()`-tidslinje.
11. **Avslutning.**

## D. Styremøte, intern oppdatering og strategi (5–12 sider)

Kort og beslutningsorientert. Banner på hver side.

1. **Forside** – kicker «Styremøte · 29.10.2026».
2. **Sammendrag og beslutninger** – venstre: `pillar()` × 3 (status). Høyre: navy kort
   «Vi ber styret om å …» med nummererte punkter.
3. **Status** – `table()` med prosjekt / ansvarlig / status (`chip()` grønn-gul-rød i egen
   kolonne, plassert over tabellcellen) / kommentar.
4. **Økonomi** – fire `kpi()`-kort + `columns()` budsjett mot faktisk.
5. **Prosess eller plan** – `chevrons()` eller horisontal `step()`-tidslinje med «▲ vi er her».
6. **Risiko og åpne spørsmål** – `chip()`-liste til venstre, `step()` med spørsmål til høyre.
7. **Neste steg** – `step()` 1–5 med ansvarlig og dato.
