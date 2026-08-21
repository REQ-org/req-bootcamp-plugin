# REQ-mal — kart over alle layoutene

`assets/REQ-mal.pptx` er den ekte REQ-malen: én slide master med **41 navngitte layouts**. Filen har i tillegg **9 eksempel-slides** (slide 1–9) som allerede er fylt ut med ekte REQ-innhold — disse viser nøyaktig hvordan ni av layoutene skal se ut i praksis, og er de sikreste å bygge videre på.

**Se `layouts-overview.jpg`** for en visuell oversikt over bakgrunn/logo-plassering på alle 41 (tomme placeholders vises ikke i eksporten — det er normalt).

## Prinsipp: velg layout etter antall elementer, ikke etter "nærmeste"

Malen har egne varianter for 1/2/3/4 kolonner, 1/2/3/4 speakere, 2/3/4 bilder osv. **Velg alltid varianten som har akkurat like mange slots som innholdet du har** — da trenger du aldri å slette en overflødig plassholder eller stå med en tom.

## Layout-katalog (gruppert)

| # | Navn | Bakgrunn | Har ekte eksempel? |
|---|------|----------|---|
| 1–3 | Title Slide / 2 / 3 | Lyseblå→hvit med prikk-mønster (1,2), navy med prikk-mønster (3) | — |
| 4–6 | Title Slide + image / 2 / 3 | Som 1–3, med bilde-plassholder for landskapsfoto | **6 → slide1** (forsiden «Company presentation») |
| 7 | Agenda | Hvit, logo topp-venstre | — |
| 8 | Executive Summary | Hvit | — |
| 9–10 | Content slide 1 column (/2) | Hvit | — |
| 11 | 1_Content slide 2 columns | Hvit | — |
| 12 | Content 1 column, tekst høyre | Hvit | — |
| 13–14 | Content 1 column + bilde høyre/venstre | Hvit | — |
| 15 | Content slide 2 columns | Hvit | **→ slide3** («REQ Real Estate Fund I», tabell + diagram) |
| 16–17 | Content 2 columns (+ subtitle / containers) | Hvit | — |
| 18 | Content slide 3 columns | Hvit | **→ slide4** («Half-year report H1 2026», 2 diagrammer + tekst) |
| 19–20 | Content 3 columns (+ subtitle / containers) | Hvit | — |
| 21–23 | Content 4 columns (+ subtitle / containers) | Hvit | — |
| 24–26 | Picture slide 2/3/4 columns med bildetekst | Hvit | — |
| 27 | Key figures slide 2 columns med bildetekst | Lyseblå | **→ slide7** («REQ Fund I initial investment», 4,5 bln / 113k) |
| 28–29 | Key figures slide 3/4 columns med bildetekst | Lyseblå | — |
| 30 | Picture slide | — | — |
| 31–33 | Chapter slide / 2 / 3 | Hvit (31), lyseblå (32), navy (33) | **17 → slide2** («Building the next chapter», sitat fra CEO), **33 → slide5** («Real Estate»-seksjon) |
| 34 | Team slide 1 speaker | Hvit | — |
| 35 | Team slide 2 speakers | Hvit | **→ slide8** («Meet our team», Johan Hamre) |
| 36–37 | Team slide 3/4 speakers | Hvit | — |
| 38 | Blank | Hvit, kun logo | — |
| 39–41 | Closing slide / 2 / 3 | Lyseblå (39,40), navy (41) | **41 → slide9** (bakside med prikk-mønster) |

(Merk: slide6 i eksempelfilen bruker layout17 "Content slide 2 containers with subtitle" for «Listed Equities»-siden.)

## Faste idx-konvensjoner (gjelder på tvers av nesten alle layouts)

- `idx=0` (CENTER_TITLE) → slidens hovedtittel.
- `idx=34` (BODY) → **undertittel/kicker** rett under tittelen, kursiv, én linje (f.eks. «Uavhengig fondsforvalter innen børsnoterte aksjer …»).
- `idx=16` (BODY) → **bunntekst/footer**-tekst (liten, nederst).
- `idx=4` / `idx=12` (SLIDE_NUMBER) → sidetall. **Rør aldri denne** — den fylles automatisk av PowerPoint.
- `idx=32` (BODY, på Key figures- og Team-layouts) → forklarende avsnitt (flere linjer løpende tekst).
- `idx=26/27/39/41...` (BODY, på Key figures- og Picture-layouts) → korte **bildetekster/captions**, én per kolonne.
- `idx=37/38/40/42...` (BODY, på Key figures-layouts) → de **store KPI-tallene** selv (stor skriftstørrelse er allerede satt på placeholderen — bare skriv tallet, la formateringen ligge).
- `idx=15/17/18/22/24...` (OBJECT) → **innholds-slot**: kan være punktliste, tabell eller diagram — se under.
- `idx=21/35/36/42/43...` (PICTURE) → bilde-plassholder.

Full liste med nøyaktig idx/type per layout ligger i vedlegget nederst i denne filen.

## Slik fyller du ut hver plassholder-type

**Tekst (BODY / CENTER_TITLE):** sett teksten via `run`, ikke `text_frame.text = "..."` — det sistnevnte visker ut formatering som allerede ligger på placeholderen. For punktlister: ett `<a:p>`/`add_paragraph()` per punkt, aldri slå sammen flere punkter i én paragraf.

**Innhold som punktliste (OBJECT-placeholder brukt som tekst):** samme som over — én paragraf per punkt.

**Innhold som tabell** (som i slide3 — "Key information"-tabellen): placeholderen inneholder allerede en ekte `table`-graphicFrame. Bruk `shape.table`, sett `cell.text` per celle. Behold antall rader/kolonner malen har, eller bygg en ny tabell i samme stil hvis antall rader avviker vesentlig.

**Innhold som diagram** (som i slide3/slide4 — stolpediagrammene): dette er et ekte, innebygd PowerPoint-diagram (`shape.chart`), ikke et bilde. Bruk `chart.replace_data(CategoryChartData)` til å bytte ut kategoriene og tallene — da beholder du REQs farger, fonter og diagramstil helt automatisk, uten å røre noe annet.

**Bilde (PICTURE-placeholder):** bruk `placeholder.insert_picture(path)`. Dette skalerer og beskjærer bildet inn i den faste rammen malen definerer — angi aldri egen posisjon/størrelse.

## Fallgruve: idx-rekkefølge ≠ visuell rekkefølge

På layouts med mange like plassholdere (Agenda, 3/4-kolonne Content, 3/4-kolonne Picture og Key figures, 3/4-speaker Team) ligger plassholderne som **rader eller kolonner av par**, ikke som én lang liste. Fyller du dem i stigende `idx`-rekkefølge uten å sjekke posisjon, blir resultatet overlappende/feil-plassert tekst (testet og bekreftet på Agenda-layouten under bygging av dette skillet).

**Sjekk alltid posisjon før du fyller en layout med mer enn ~4 body-plassholdere:**

```python
from pptx.util import Emu
for ph in sorted(layout.placeholders, key=lambda p: p.placeholder_format.idx):
    print(ph.placeholder_format.idx, Emu(ph.left).inches, Emu(ph.top).inches)
```

Grupper deretter etter delt `top` (rader) eller delt `left` (kolonner), og fyll i den rekkefølgen tallene faktisk går — ikke i idx-rekkefølge.

**Konkret eksempel — Agenda (layout 7):** de 16 punkt-plassholderne (idx 18–33) er 8 rader à to plassholdere: en bred tekst-boks til venstre (`left≈6.77"`) og en smal nummer-boks til høyre (`left≈12.00"`), med økende `top` per rad:

```
rad 1: idx=18 (tekst, bred) + idx=19 (nummer, smal)  — top=3.17"
rad 2: idx=20 + idx=21                                — top=3.56"
rad 3: idx=22 + idx=23                                — top=3.95"
rad 4: idx=24 + idx=25                                — top=4.33"
rad 5: idx=26 + idx=27                                — top=4.72"
rad 6: idx=28 + idx=29                                — top=5.11"
rad 7: idx=30 + idx=31                                — top=5.50"
rad 8: idx=32 + idx=33                                — top=5.89"
```

Har du f.eks. 4 agendapunkter: skriv punktet i den brede plassholderen og et løpenummer («01», «02», …) i den smale for rad 1–4, og **slett hele rad 5–8** (begge plassholderne i raden) i stedet for å la dem stå tomme.

## Viktig: rydd opp i ubrukte plassholdere

Har du valgt en layout med flere slots enn du faktisk fyller ut (f.eks. du måtte bruke "Team slide 4 speakers" fordi tre-variant ikke passet helt), **slett hele den ubrukte plassholderen** (bilde + tittel + kontaktinfo-gruppen sammen) i stedet for å la den stå tom — spesielt bilde-plassholdere kan vise et synlig "sett inn bilde"-ikon i PowerPoint hvis de blir stående uten innhold.

## Vedlegg: rå idx/type-liste for alle 41 layouts

```
1. Title Slide — idx=0:CENTER_TITLE, idx=13:BODY
2. Title Slide 2 — idx=0:CENTER_TITLE, idx=13:BODY
3. Title Slide 3 — idx=0:CENTER_TITLE, idx=13:BODY
4. Title Slide + image — idx=0:CENTER_TITLE, idx=13:BODY, idx=21:PICTURE
5. Title Slide + image 2 — idx=0:CENTER_TITLE, idx=13:BODY, idx=21:PICTURE
6. Title Slide + image 3 — idx=0:CENTER_TITLE, idx=13:BODY, idx=21:PICTURE
7. Agenda — idx=0:CENTER_TITLE, idx=12:SLIDE_NUMBER, idx=18..34:BODY (16 punkt-slots)
8. Executive Summary — idx=0:CENTER_TITLE, idx=4:SLIDE_NUMBER, idx=16:BODY, idx=18:BODY, idx=34:BODY
9. Content slide 1 column — idx=0:CENTER_TITLE, idx=4:SLIDE_NUMBER, idx=15:OBJECT, idx=16:BODY, idx=34:BODY
10. Content slide 1 column 2 — idx=0:CENTER_TITLE, idx=4:SLIDE_NUMBER, idx=15:OBJECT, idx=16:BODY, idx=34:BODY
11. 1_Content slide 2 columns — idx=4:SLIDE_NUMBER, idx=15:OBJECT, idx=16:BODY, idx=34:BODY, idx=36:BODY, idx=37:BODY
12. 1_Content slide 1 column text right — idx=4:SLIDE_NUMBER, idx=15:OBJECT, idx=16:BODY, idx=34:BODY, idx=35:BODY, idx=36:BODY
13. Content slide 1 column and picture right — idx=4:SLIDE_NUMBER, idx=15:OBJECT, idx=16:BODY, idx=35:BODY, idx=36:PICTURE, idx=37:OBJECT, idx=38:BODY
14. Content slide 1 column and picture left — idx=4:SLIDE_NUMBER, idx=16:BODY, idx=34:BODY, idx=35:BODY, idx=36:PICTURE, idx=37:OBJECT, idx=38:OBJECT, idx=39:BODY
15. Content slide 2 columns — idx=4:SLIDE_NUMBER, idx=15:OBJECT, idx=16:BODY, idx=17:OBJECT, idx=34:BODY, idx=35:BODY, idx=36:BODY
16. Content slide 2 columns with subtitle — idx=4:SLIDE_NUMBER, idx=15:OBJECT, idx=16:BODY, idx=17:OBJECT, idx=18:BODY, idx=19:BODY, idx=34:BODY, idx=35:BODY, idx=36:BODY
17. Content slide 2 containers with subtitle — idx=4:SLIDE_NUMBER, idx=15:OBJECT, idx=16:BODY, idx=17:OBJECT, idx=18:BODY, idx=19:BODY, idx=34:BODY, idx=35:BODY, idx=36:BODY
18. Content slide 3 columns — idx=4:SLIDE_NUMBER, idx=15:OBJECT, idx=16:BODY, idx=17:OBJECT, idx=18:OBJECT, idx=34:BODY, idx=35:BODY, idx=36:BODY
19. Content slide 3 columns with subtitle — idx=4:SLIDE_NUMBER, idx=15:OBJECT, idx=16:BODY, idx=17:OBJECT, idx=18:OBJECT, idx=20:BODY, idx=21:BODY, idx=22:BODY, idx=34:BODY, idx=35:BODY, idx=36:BODY
20. Content slide 3 containers with subtitle — samme som 19
21. Content slide 4 columns — idx=4:SLIDE_NUMBER, idx=15:OBJECT, idx=16:BODY, idx=17:OBJECT, idx=22:OBJECT, idx=24:OBJECT, idx=34:BODY, idx=35:BODY, idx=36:BODY
22. Content slide 4 columns with subtitle — idx=4:SLIDE_NUMBER, idx=15:OBJECT, idx=16:BODY, idx=17:OBJECT, idx=20:BODY, idx=21:BODY, idx=22:OBJECT, idx=23:BODY, idx=24:OBJECT, idx=25:BODY, idx=34:BODY, idx=35:BODY, idx=36:BODY
23. Content slide 4 containers with subtitle — samme som 22
24. Picture slide 2 columns with caption — idx=4:SLIDE_NUMBER, idx=16:BODY, idx=26:BODY, idx=27:BODY, idx=32:BODY, idx=34:BODY, idx=35:PICTURE, idx=36:PICTURE, idx=37:BODY, idx=38:BODY
25. Picture slide 3 columns with caption — idx=4:SLIDE_NUMBER, idx=16:BODY, idx=26:BODY, idx=27:BODY, idx=32:BODY, idx=34:BODY, idx=35:PICTURE, idx=36:PICTURE, idx=37:BODY, idx=38:PICTURE, idx=39:BODY, idx=40:BODY
26. Picture slide 4 columns with caption — idx=4:SLIDE_NUMBER, idx=16:BODY, idx=26:BODY, idx=27:BODY, idx=32:BODY, idx=34:BODY, idx=35:PICTURE, idx=36:PICTURE, idx=37:BODY, idx=38:PICTURE, idx=39:BODY, idx=40:PICTURE, idx=41:BODY, idx=42:BODY
27. Key figures slide 2 columns with caption — idx=0:CENTER_TITLE, idx=4:SLIDE_NUMBER, idx=16:BODY, idx=26:BODY, idx=27:BODY, idx=32:BODY, idx=34:BODY, idx=37:BODY, idx=38:BODY
28. Key figures slide 3 columns with caption — idx=0:CENTER_TITLE, idx=4:SLIDE_NUMBER, idx=16:BODY, idx=26:BODY, idx=27:BODY, idx=32:BODY, idx=34:BODY, idx=37:BODY, idx=38:BODY, idx=39:BODY, idx=40:BODY
29. Key figures slide 4 columns with caption — idx=0:CENTER_TITLE, idx=4:SLIDE_NUMBER, idx=16:BODY, idx=26:BODY, idx=27:BODY, idx=32:BODY, idx=34:BODY, idx=37:BODY, idx=38:BODY, idx=39:BODY, idx=40:BODY, idx=41:BODY, idx=42:BODY
30. Picture slide — idx=36:PICTURE
31. Chapter slide — idx=0:CENTER_TITLE, idx=4:SLIDE_NUMBER, idx=22:BODY, idx=36:PICTURE
32. Chapter slide 2 — samme som 31
33. Chapter slide 3 — samme som 31
34. Team slide 1 speaker — idx=0:CENTER_TITLE, idx=4:SLIDE_NUMBER, idx=15:OBJECT, idx=16:BODY, idx=20:BODY, idx=32:BODY, idx=34:BODY, idx=42:PICTURE, idx=46:OBJECT
35. Team slide 2 speakers — idx=0:CENTER_TITLE, idx=4:SLIDE_NUMBER, idx=15:OBJECT, idx=16:BODY, idx=20:BODY, idx=32:BODY, idx=34:BODY, idx=42:PICTURE, idx=43:PICTURE, idx=44:OBJECT, idx=45:BODY, idx=46:OBJECT, idx=47:OBJECT
36. Team slide 3 speakers — idx=0:CENTER_TITLE, idx=4:SLIDE_NUMBER, idx=16:BODY, idx=32:BODY, idx=34:BODY, idx=43/48/52:PICTURE, idx=56..64:OBJECT/BODY (3 speaker-grupper)
37. Team slide 4 speakers — samme mønster som 36, 4 speaker-grupper
38. Blank — idx=4:SLIDE_NUMBER, idx=16:BODY
39. Closing slide — idx=14:BODY
40. Closing slide 2 — idx=14:BODY
41. Closing slide 3 — idx=14:BODY
```

Placeholder-navnene i selve XML-en (f.eks. «Text Placeholder 8») er generiske og sier ikke noe om innhold — bruk alltid `idx` + posisjon, ikke navnet, til å identifisere riktig plassholder.

## Fonter og farger (fra malens tema — trenger normalt ikke settes manuelt, men greit å vite)

- Skrift: **TT Hoves Pro Medium** (definert i malens temafil). Siden dette er en spesialfont, kan forhåndsvisningen i LibreOffice/QA-rendering vise en litt annen bredde enn ekte PowerPoint — stol på selve `.pptx`-filen, ikke bare QA-bildet, når du sjekker om tekst går i to linjer.
- Navy (hoved-mørk): `#001D6C`
- Aksentblå (mørkere navy, brukes på enkelte flater): `#002881`
- Lys aksent (prikkmønster, tall): `#33B1FF`
- Lyseblå bakgrunn (forside/kapittel/key figures): `#E5F6FF`
- All farge- og fontsetting kommer allerede fra malen via placeholder-arven — du skal normalt **aldri** sette `run.font.color` eller `run.font.name` manuelt. Gjør du det, har du sannsynligvis gjort noe unødvendig eller feil.
