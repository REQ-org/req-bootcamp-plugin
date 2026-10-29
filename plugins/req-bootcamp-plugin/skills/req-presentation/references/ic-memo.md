# IC-memo og case-intro

Tillegg til arbeidsflyten i `SKILL.md` når decket er et IC-memo, en case-intro eller en
annen investeringscase for REQs ledelse eller investeringskomité. Designet er det samme
PREP-designet (`design.md`); her er det som er spesielt for IC.

## Arbeidsflyt for IC

**1. Hent caseinnhold og tall først.** Les alle kilder (IM, teaser, term sheet, e-poster,
Brreg). Har caset en underwriting-modell (skillen `req-underwriting-model`), les tallene fra
modellens bufrede verdier (openpyxl `data_only=True`) inn i en JSON-fil og bygg decket fra
den, så et tall (f.eks. netto yield) er identisk på hver side. Selgers tall bruker selgers
definisjoner (netto yield fra teaseren, ikke leie/GAV).

**2. Bygg på eksisterende deck.** Ligger det allerede et deck for caset i brukerens mappe,
sammenlign med det du leverte sist: brukeren kan ha endret det (nytt forsidebilde, annet
fondsnavn i kickeren). Behold deres forside og avslutning, bytt bare innholdssidene, og
skriv tilbake til samme sti med `expectedMtimeMs` så du aldri overskriver endringer gjort
mens du jobbet.

**3. Navigasjonspiller alltid.** Bestem 6–9 seksjonsnavn før du bygger; hver innholdsside
viser dem med sin egen seksjon aktiv:

```python
TABS = ["Sammendrag", "Selskap", "Portefølje", "Transaksjon", "Vilkår", "Underwriting", "Sensitivitet", "Risiko", "Neste steg"]
header(s, "Plattformcase med 22 % mål-IRR – REQs underwriting gir 12,9 %", "Sammendrag",
       "Én setning kontekst.", TABS, "Sammendrag", cite="Kilde: …")
```

**4. Avkastningsbro.** Regn hvert steg i underwriting-modellen: kopier selger-casen, bytt én
gruppe input om gangen til REQ base, regn om (`recalc.py`) og les IRR etter hvert steg.
Tegn med `waterfall()`.

**5. Ekstra QA for IC.**
- To heat-tabeller over hverandre trenger `rh=0.28`; ved 0,36 overlapper den andre banneret.
- KPI-rader i kort: bredeste verdi (f.eks. «−10,6 / 2,9 %») må få plass – krymp til 10 pt.
- Brutto og netto yield blandes ikke; REQs egne beregninger merkes som det i fotnoten.
- Si fra om avvik du ser, f.eks. fond på forsiden mot fondsprofilen i modellen.

## Sideoppskrifter (14 sider)

1. **Forside** – behold brukerens forside hvis decket finnes. Ellers `cover()` på layout 4
   med bilde av eiendommen; kicker «Short intro · REQ Real Estate Income Fund».
2. **Sammendrag** – venstre: `big_number` (REQs IRR) + tre `pillar` (hva vi får / hvorfor
   tallet avviker fra selger / hva som avgjør caset). Høyre: tre scenario-kort (selger-case
   lyst, REQ base navy, nedside lyst) med IRR, MoE og IRR 3/7 år. Banner med konklusjonen.
3. **Selskap og eiere** – eierstruktur (`entity`) til venstre, teamkort med `initials` til
   høyre, kursiv note med Brreg-avvik under strukturen.
4. **Portefølje** – `hbar` leie per eiendom til venstre, tabell til høyre, KPI-rad under tabellen.
5. **Transaksjon** – to lyse deal-kort (4 KPI-er + punkter) og et navy kort med kilder og anvendelse.
6. **Vilkår** – `chevrons` for utdelingsfossen, vilkårstabell under, kort med B-andel per
   scenario og navy kort med nærstående avtaler.
7. **Skiller** (`divider()`) – «Underwriting».
8. **Forutsetninger** – én tabell: parameter | selger-case | REQ base (PALE) | nedside | begrunnelse;
   foreløpige rader i FFF3CD.
9. **Kontantstrøm** – `columns` EBITDA / renter / FCF til venstre, kort med LTV, all-in rente,
   ICR, DSCR, gjeld ved exit til høyre.
10. **Avkastning** – `waterfall` fra selgers IRR til REQ base, steg for steg, tabell IRR 3/5/7 år + MoE.
11. **Sensitiviteter** – to `heat_table` til venstre (KPI × exit yield, største leietaker-stress
    × exit yield), tre kort med spenn for rente, admin og kurs, navy kort «Hva må til for X %».
12. **Risiko** – venstre: `chip` + overskrift + én linje per risiko. Høyre: `step` 1–5 med
    åpne spørsmål.
13. **Neste steg** – horisontal tidslinje med nummererte sirkler (aktiv i 33B1FF, «▲ vi er her»),
    `step`-liste med forslag, lyst kort med kriterier.
14. **Avslutning** – behold brukerens eller `closing()`.

## Eldre IC-stil

`old-ic-style.md` dokumenterer det opprinnelige IC-memo-utseendet (kursiv eyebrow, Key
Figures-layouts). Bruk det bare når brukeren ber om gammel stil eller oppdaterer et gammelt deck.
