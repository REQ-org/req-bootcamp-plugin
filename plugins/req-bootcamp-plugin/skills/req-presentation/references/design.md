# PREP-designet – REQs designsystem for alle presentasjoner

Hentet fra REQ PREP-presentasjonen (okt. 2026). Bygger på samme master som REQs offisielle
mal, så stilene er eksakte og ikke en tilnærming. Alle hjelpere ligger i
`scripts/prep_kit.py` (sider) og `scripts/charts_kit.py` (native grafer).

## Sidegrid (tommer, lerret 13,333 × 7,5)

| Element | Posisjon / størrelse | Stil |
|---|---|---|
| Navigasjonspiller (valgfritt) | y 0,125, h 0,222, høyrejustert mot x 12,89 | roundRect adj 50000; aktiv = 002881 + hvit tekst, øvrige = E5F6FF + 4B6199; 7,5 pt fet |
| Tittel (ctrTitle) | (0,458, 0,40, 12,43, 0,6) | 28 pt, tx2. **Maks ~64 tegn** – lengre bryter og kolliderer med kicker |
| Kicker | (0,458, 1,0, 12,43, 0,24) | 11 pt VERSALER, tx2, ikke fet |
| Header rule | (0,456, 1,376, 12,425, 0,004) | accent1-fyll, linje D8E2EE 1 pt |
| Ingress (idx 34) | (0,458, 1,5, 12,43, 0,3) | 11 pt kursiv 5A5A5A, **én linje** |
| Innhold | y 1,95 → 6,0 | se kolonnene under |
| Banner | (0,458, 6,05, 12,425, 0,48) | navy roundRect adj 8000, 10,5 pt hvit; fet lead-in + konklusjon |
| Fotnote (idx 16) | layoutens posisjon | 8 pt, «Kilde: …» |

**Kolonner i innholdsflaten** (bredde 12,425, mellomrom 0,15):

| Oppsett | x-posisjoner | Bredde |
|---|---|---|
| To kolonner | 0,458 · 6,76 | 6,1 · 6,12 (eller 7,9 + 4,3 når den ene dominerer) |
| Tre kort | 0,458 · 4,648 · 8,838 | 4,04 |
| Fire kort | 0,458 · 3,602 · 6,746 · 9,889 | 2,99 |

Layouter: **slideLayout9.xml** for innholdssider (tittelen får egen xfrm),
**slideLayout2.xml** for seksjonsskiller, **slideLayout1–6.xml** for forside (`cover()`),
**slideLayout39–41.xml** for avslutning (`closing()`).

## Palett (utover temaet)

002881 navy (kort, banner, store tall) · 001D6C tittel · 4B6199 etiketter og KPI-tekst ·
1F1E1E brødtekst · 5A5A5A ingress · E5F6FF lyst kort · B7E3FF undertekst på navy og lyse
søyler · 33B1FF aksent (nummer, «vi er her») · 1F4CA8 mellomblå (2. chevron) ·
D8E2EE skillelinjer · FFF3CD foreløpige tall · FBE3E4 / F6C6C9 under hurdle i heatmap ·
statuschips C0392B høy/rød, E08A00 middels/gul, 3A8F5C lav/grønn.

Én sterk farge (navy) bærer siden; lyseblått er støtte. Rødt brukes bare for nedside,
risiko og negative tall.

## Byggeklosser (prep_kit)

| Funksjon | Bruk |
|---|---|
| `cover()` | Forside: kicker, tittel og undertittel ved siden av REQ-logoen. `dark=True` på layout 3 og 6 |
| `header()` | Tittel, kicker, linje, ingress, fotnote, sidetall – og piller hvis `tabs_items` – på hver innholdsside |
| `big_number()` | Ett tall er hele poenget (50 pt) med fet overskrift og undertekst |
| `pillar()` | 01/02/03-argumenter med tynn navy linje til venstre |
| `bullets()` | Kulepunkter, maks ~5; `(fet lead-in, resten)` gir rytme |
| `card()` + `kpi()` | Lyse kort med 2–4 nøkkeltall; navy kort for det viktigste |
| `quote()` | Navy sitatkort med stort sitat og avsender |
| `chevrons()` | Prosess eller foss, 3–4 steg |
| `step()` | Nummererte sirkler med overskrift og tekst: agenda, neste steg, tidslinje |
| `table()` | Liten fet header i 4B6199, navy linje under header, hårlinjer, ingen vertikale linjer. Fremhev én kolonne med `colfill={2: PALE}` |
| `heat_table()` | 5×5-sensitivitet farget mot en terskel (rød under, blå over), basecelle navy |
| `entity()` + `connector_v/h()` | Organisasjons- og eierstruktur |
| `chip()` / `initials()` | Statusnivå / initialer i sirkel for team |
| `label()` | Liten etikett i versaler over en blokk eller graf |
| `banner()` | Konklusjonen på siden, alltid nederst |
| `divider()` / `closing()` | Seksjonsskiller / avslutning |

Mangler du en kloss, bygg den av `box()` og `P()` i paletten over – aldri nye farger eller fonter.

## Native grafer (charts_kit)

Grafer legges inn **etter** at XML-en er skrevet og decket er zippet. De forblir redigerbare
i PowerPoint. Ingen graftittel – bruk `label()` over grafen og kilde i fotnoten.

| Funksjon | Bruk |
|---|---|
| `columns()` | Verdier per periode eller kategori, 1–3 serier (navy, lyseblå, aksent) |
| `line()` | Utvikling over tid, f.eks. avkastning mot referanseindeks; vår serie navy, sluttverdi som etikett |
| `hbar()` | Rangering, f.eks. leie per leietaker (største navy) |
| `waterfall()` | Bro fra ett tall til et annet (IRR-bro, resultatbro, kapitalbro) |
| `donut()` | Fordeling i andeler, maks ~6 skiver |

## Skrivestil

- Titler er **påstander**, ikke emner: «Yield-gapet er tilbake – første gang siden 2021»,
  ikke «Markedet».
- Kicker = seksjon («MARKEDET · KONTOR OSLO»). Ingress = én setning med kontekst.
- Én konklusjon per side i banneret, med fet lead-in på 2–4 ord. I foredrag kan banneret
  utelates på rene illustrasjonssider, men aldri på sider med tall.
- Ett poeng per kulepunkt, tallene inne i setningen. Nøktern og redaksjonell tone –
  skuffelser nevnes åpent. Vi-form.
- Tall hentes fra kilden (modell, regnskap, rapport), ikke skrevet av for hånd, og samme tall
  er identisk på alle sider.
