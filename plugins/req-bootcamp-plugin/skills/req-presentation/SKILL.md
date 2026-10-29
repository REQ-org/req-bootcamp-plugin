---
name: req-presentation
description: "Use for EVERY slide deck or PowerPoint made at or for REQ – IC memos and case intros, seminar- og foredragspresentasjoner, resultat-/kvartals-/PnL-presentasjoner, investor- og fondspresentasjoner, styremøter, interne oppdateringer og strategi – in Norwegian or English. Triggers: «lag en presentasjon», «lag slides», «sett dette opp som slides», «REQ-mal», «REQ ny ppt mal», «IC-memo», «case-intro», «presentasjon til seminaret», «oppdater presentasjonen med tall fra modellen». Builds an editable .pptx on REQ's official template (TT Hoves Pro, 41 layouts) in REQ's PREP design system: action titles, kicker, cards, big numbers, navy take-away banners and native, editable charts. Whenever the deck is for REQ, use this skill instead of a generic deck or a hand-styled «REQ look». Pair with the general pptx skill for the OOXML mechanics."
---

# REQ-presentasjoner (PREP-designet)

Alle REQ-presentasjoner skal se like ut, uansett om det er et IC-memo, et foredrag på et
seminar eller en kvartalsrapport. Denne skillen er den eneste kilden til det utseendet:
REQs offisielle mal (`assets/REQ_Template.pptx`) med **PREP-designsystemet** oppå.
Innhold og antall sider varierer; utseendet gjør det ikke.

**Last alltid den generelle `pptx`-skillen i tillegg** for mekanikken (`add_slide.py`,
`clean.py`, `validate.py`, rendering). Sider bygges som rå XML med `scripts/prep_kit.py`;
grafer og bilder legges inn etterpå med python-pptx (`scripts/charts_kit.py`). Sett aldri
`.text` på malens plassholdere med python-pptx – det flater ut formateringen.

## Hvilken oppskrift?

| Oppdrag | Les |
|---|---|
| IC-memo, case-intro, investeringscase, tall fra underwriting-modellen | `references/ic-memo.md` |
| Seminar/foredrag, resultat/PnL, investor/fond, styre/intern/strategi | `references/recipes.md` |
| Alltid | `references/design.md` – grid, palett, byggeklosser, skrivestil |

## Arbeidsflyt

**1. Forstå oppdraget.** Hvem er publikum, hva skal de sitte igjen med, hvor lang tid, hvilke
tall og kilder? Les alt brukeren har gitt deg og bruk de **ekte tallene**. Er oppdraget
tynt, still ett kort spørsmål (tema og publikum) og gå videre.

**2. Finnes det et deck fra før?** Bygg *på brukerens versjon* – behold forside og avslutning
de har laget, bytt bare innholdssidene – og skriv tilbake til samme sti. Fjern talenotater
som fulgte med fra et annet deck.

**3. Lag en storyboard før du rører filer.** Én linje per side: layout, tittel (en påstand,
ikke et tema), byggeklosser. Bestem om decket skal ha navigasjonspiller (`tabs_items`):
ja for IC-memoer og decks med ≥ 8 sider og 5–9 seksjoner; ellers nei.

**4. Bygg strukturen.** Kopier `assets/REQ_Template.pptx`, pakk ut, og lag alle sidene med
`add_slide.py` fra riktig layout:

| Side | Layout |
|---|---|
| Forside | `slideLayout1–3.xml` (hvit / lys / navy) – eller `4–6` med bilde i nedre halvdel |
| Innhold | `slideLayout9.xml` |
| Seksjonsskiller | `slideLayout2.xml` |
| Avslutning | `slideLayout39–41.xml` (hvit / lys / navy) |

Fjern malens egen eksempelside fra `<p:sldIdLst>` og kjør `clean.py`.

**5. Skriv hver side med `prep_kit`:**

```python
import sys; sys.path.insert(0, "<denne skillen>/scripts")
from prep_kit import *

s = Slide()
cover(s, "Eiendom i en ny rentevirkelighet", "Seminar i Næringseiendom Norge", kicker="REQ · 12. november 2026")
s.write("u/ppt/slides/slide2.xml")

s = Slide()
header(s, "Yield-gapet er tilbake – første gang siden 2021", "Markedet",
       "Netto prime yield kontor Oslo mot 10-årig statsrente.", cite="Kilde: Norges Bank, REQ.")
big_number(s, 0.458, 1.95, "+1,2 pp", "Yield-gap kontor Oslo", "Prime yield 4,9 % mot 3,7 % rente")
bullets(s, 6.76, 2.0, 6.1, 3.6, [("Rentene: ", "ned 75 bp siden toppen."), ("Volum: ", "opp 40 % hittil i år.")])
banner(s, 0.458, 6.05, 12.425, 0.48, "Konklusjon: ", "kjøpsvinduet er åpent for egenkapitalsterke aktører.")
s.write("u/ppt/slides/slide3.xml")
```

Plassholder-taggene i `prep_kit` (`PH_TITLE`, `PH_LEDE`, `PH_FOOT`, `PH_NUM`, `PH_SUB13`)
passer layoutene over. For andre layouter: kopier taggene fra
`python scripts/dump_layouts.py --layout "<navn>"` – feil `type` bryter posisjonsarven
uten at `validate.py` merker det.

**6. Zip, og legg til grafer og bilder** med python-pptx: `charts_kit` (`columns`, `line`,
`hbar`, `waterfall`, `donut`). Bilde på forsiden: `slide.placeholders[21].insert_picture(sti)`
på layout 4–6. Andre bilder: `slide.shapes.add_picture` innenfor innholdsflaten
(y 1,95–6,0). Bruk bare ekte bilder brukeren har gitt deg – aldri stockbilder; uten bilde
velger du en forside uten bilde.

**7. QA – render hver side og se på den.** `validate.py --original assets/REQ_Template.pptx`,
konverter til PDF/PNG og sjekk:
- Titler ≤ ~64 tegn (28 pt); en andre linje kolliderer med kickeren.
- Ingressen er én linje; ingenting under y 6,0 unntatt banneret; banneret ≤ 2 linjer.
- Største tall/etikett i et kort får plass; tekst renner ikke ut av bokser.
- Samme tall har samme verdi på alle sider; kilde i fotnoten på hver side med tall.
- Grafene har ingen autotittel, etikettene er lesbare, negative søyler synes.

**8. Lever.** Fortell kort på norsk hva du har laget og hvor filen ligger, og nevn tall som
fortsatt er foreløpige.

## Regler som ikke brytes

- Bare malens master og paletten i `references/design.md` – aldri egne farger, fonter,
  gradienter, emoji eller ikoner. Trenger du noe nytt, bygg det av `box()`/`card()` i paletten.
- Aldri rediger `assets/REQ_Template.pptx`; jobb alltid på en kopi.
- Norske tall: mellomrom som tusenskille, komma som desimal, «%» med mellomrom, «−» for minus
  (`nb()`, `pct()`, `mnok()` i `prep_kit`).
- Den gamle IC-stilen (`references/old-ic-style.md`) brukes bare når brukeren ber om den
  eller oppdaterer et gammelt deck.

## Filer

- `references/design.md` – grid, palett, byggeklosser, grafer, skrivestil
- `references/recipes.md` – sideoppskrifter for foredrag, resultat, investor og intern
- `references/ic-memo.md` – IC-memo og case-intro: arbeidsflyt, tall fra modellen, 14 sider
- `references/layouts.md` – alle 41 layouter med idx og bruk
- `references/old-ic-style.md` – den eldre IC-stilen
- `scripts/prep_kit.py` – sidebyggere; `scripts/charts_kit.py` – native grafer;
  `scripts/dump_layouts.py` – plassholdere og posisjoner rett fra malen
- `assets/REQ_Template.pptx` – malen; `assets/layout-catalog.jpg` – én side per layout
