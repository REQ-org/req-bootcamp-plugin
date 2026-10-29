# PREP-stil – REQs nye designsystem for IC-decks

Hentet fra REQ PREP-presentasjonen (okt. 2026) og brukt fullt ut i Puru Infra-introen.
Bygger på samme master som IC-malen, så stilene er
eksakte og ikke en tilnærming. Alle hjelpere ligger i `scripts/prep_kit.py` (sider) og
`scripts/charts_kit.py` (native grafer).

Dette er **standardutseendet** for nye IC-memoer og case-intros. Den eldre stilen i
`style-guide.md` (eyebrow i kursiv, stat-callouts på Key Figures-layouts) brukes bare når
brukeren ber om «gammel mal» eller oppdaterer et eldre deck.

## Sidegrid (tommer, lerret 13,333 × 7,5)

| Element | Posisjon / størrelse | Stil |
|---|---|---|
| Navigasjonspiller | y 0,125, h 0,222, høyrejustert mot x 12,89 | roundRect adj 50000; aktiv = 002881 + hvit tekst, øvrige = E5F6FF + 4B6199; 7,5 pt fet |
| Tittel (ctrTitle) | (0,458, 0,40, 12,43, 0,6) | 28 pt, tx2. **Maks ~64 tegn** – lengre bryter og kolliderer med kicker |
| Kicker | (0,458, 1,0, 12,43, 0,24) | 11 pt VERSALER, tx2, ikke fet |
| Header rule | (0,456, 1,376, 12,425, 0,004) | accent1-fyll, linje D8E2EE 1 pt |
| Ingress (idx 34) | (0,458, 1,5, 12,43, 0,3) | 11 pt kursiv 5A5A5A, **én linje** |
| Innhold | y 1,95 → 6,0 | to kolonner: venstre x 0,458 (b ≈ 6,0–7,9), høyre x 6,76–8,86 |
| Banner | (0,458, 6,05, 12,425, 0,48) | navy roundRect adj 8000, 10,5 pt hvit; fet lead-in + konklusjon |
| Fotnote (idx 16) | layoutens posisjon | 8 pt, «Kilde: …» |

Layout: **slideLayout9.xml** for innholdssider (tittelen får egen xfrm), **slideLayout2.xml**
for seksjonsskiller, forside fra brukerens deck eller layout 4–6 med bilde, **slideLayout39.xml**
for avslutning.

## Palett (utover temaet)

002881 navy (kort, banner, store tall) · 001D6C tittel · 4B6199 etiketter og KPI-tekst ·
1F1E1E brødtekst · 5A5A5A ingress · E5F6FF lyst kort · B7E3FF undertekst på navy og lyse
søyler · 33B1FF aksent (nummer, «vi er her») · 1F4CA8 mellomblå (2. chevron) ·
D8E2EE skillelinjer · FFF3CD foreløpige input · FBE3E4 / F6C6C9 under hurdle i heatmap ·
risikochips C0392B høy, E08A00 middels, 3A8F5C lav.

## Byggeklosser (prep_kit)

| Funksjon | Bruk |
|---|---|
| `header()` | Piller, tittel, kicker, linje, ingress, fotnote, sidetall – på hver innholdsside |
| `big_number()` | Ett tall er hele poenget (50 pt) med fet overskrift og undertekst |
| `pillar()` | 01/02/03-argumenter med tynn navy linje til venstre |
| `card()` + `kpi()` | Lyse kort med 2–4 nøkkeltall; navy kort for det viktigste (f.eks. REQ base) |
| `chevrons()` | Prosess eller foss (A-pref → catch-up → split), 3–4 steg |
| `step()` | Nummererte sirkler med overskrift og tekst: DD-spørsmål, neste steg, tidslinje |
| `table()` | Tabeller: liten fet header i 4B6199, navy linje under header, hårlinjer, ingen vertikale linjer. Fremhev REQ base-kolonnen med `colfill={2: PALE}` |
| `heat_table()` | 5×5-sensitivitet farget mot hurdle (rød under, blå over), base-celle navy |
| `entity()` + `connector_v/h()` | Eierstruktur: navy for øverste nivå og nye kjøp, lyse for blader |
| `chip()` / `initials()` | Risikonivå / teaminitialer i sirkel |
| `banner()` | Én konklusjon per side, alltid nederst |

## Native grafer (charts_kit)

Grafer legges inn **etter** at XML-en er skrevet og decket er zippet:
`waterfall()` for IRR-/verdibro (usynlig base-serie, totaler navy, negative trinn lys rød),
`columns()` for kontantstrøm per år (EBITDA / renter / FCF), `hbar()` for leie per
leietaker (største leietaker navy). Ingen graftittel – bruk `label()` over grafen.

## Sideoppskrifter (Puru-introen, 14 sider)

1. **Forside** – behold brukerens forside hvis decket finnes. Ellers layout med bilde av eiendommen.
2. **Sammendrag** – venstre: `big_number` (REQs IRR) + tre `pillar` (hva vi får / hvorfor
   tallet avviker fra selger / hva som avgjør caset). Høyre: tre scenario-kort (Puru-case
   lyst, REQ base navy, nedside lyst) med IRR, MoE og IRR 3/7 år. Banner med konklusjonen.
3. **Selskap og eiere** – eierstruktur (`entity`) til venstre, teamkort med initialer til høyre,
   kursiv note med Brreg-avvik under strukturen.
4. **Portefølje** – `hbar` leie per eiendom til venstre, tabell til høyre, KPI-rad under tabellen.
5. **Transaksjon** – to lyse deal-kort (4 KPI-er + punkter) og et navy kort med kilder og anvendelse.
6. **Vilkår** – `chevrons` for utdelingsfossen, vilkårstabell under, kort med B-andel per
   scenario og navy kort med nærstående avtaler.
7. **Skiller** (layout 2) – «Underwriting».
8. **Forutsetninger** – én tabell: parameter | selger-case | REQ base (PALE) | nedside | begrunnelse;
   foreløpige rader i FFF3CD.
9. **Kontantstrøm** – `columns` EBITDA / renter / FCF til venstre, kort med LTV, all-in rente,
   ICR, DSCR, gjeld ved exit til høyre.
10. **Avkastning** – `waterfall` fra selgers IRR til REQ base, steg for steg (beregn broen ved å
    endre selger-casen trinnvis i underwriting-modellen og regne om), tabell IRR 3/5/7 år + MoE.
11. **Sensitiviteter** – to `heat_table` til venstre (KPI × exit yield, største leietaker-stress
    × exit yield), tre kort med spenn for rente, admin og kurs, navy kort «Hva må til for X %».
12. **Risiko** – venstre: `chip` + overskrift + én linje per risiko. Høyre: `step` 1–5 med
    åpne spørsmål.
13. **Neste steg** – horisontal tidslinje med nummererte sirkler (aktiv i 33B1FF, «▲ vi er her»),
    `step`-liste med forslag, lyst kort med kriterier.
14. **Avslutning** – behold brukerens eller `closing()` på layout 39.

## Skrivestil

- Titler er **påstander**, ikke emner: «Fra 22 % til 12,9 %: B-carry og exit-forutsetninger
  forklarer gapet», ikke «Avkastning».
- Kicker = seksjon (« UNDERWRITING · AVKASTNING »). Ingress = én setning med kontekst.
- Hver side ender med én konklusjon i banneret. Fet lead-in på 2–4 ord.
- Norske tall: mellomrom som tusenskille, komma som desimal, «%» med mellomrom, «−» for minus.
- Tall fra underwriting-modellen hentes fra modellens bufrede verdier (ikke skrevet inn for
  hånd), og samme tall (f.eks. netto yield) skal være identisk på alle sider.
