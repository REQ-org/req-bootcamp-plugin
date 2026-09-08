# Økt 2 - Skills (25. aug 2026)

Ekte skills i praksis: anatomien til en skill, samme stresstest tre ganger, prioriteringsmatrisen - og så skrev dere en enkel skill for oppgaven dere valgte. Økta ble kjørt fra HTML-lysbildene, ikke PowerPoint. Ingen Claude Code denne uka.

## Dette gjør vi (60 min)

- **Hva en skill er** - anatomien: `SKILL.md` (trigger + oppskrift), `references/` (målestokk og sjekkliste) og `examples/` (forbildet).
- **Samme stresstest tre ganger** - uten skill, med en bevisst dårlig skill, med en god skill. Samme prospekt, samme prompt: «Stresstest dette prospektet.»
- **Matrisen** - dere plotter use-casene langs *verdi* (tiden oppgaven spiser i dag) og *kompleksitet* (hvor vanskelig en skill er å få til), og velger én - helst et quick win.
- **Deres tur** - én enkel `SKILL.md` for oppgaven dere satte ring rundt. Formen fra stresstest-skillen, ikke innholdet.

## Forarbeid

Bare én ting denne uka - ingen installering. Claude Code tar vi senere.

1. **Tenk gjennom arbeidshverdagen din** og noter ned et par ting du gjør som føles unødvendige og lite verdiskapende - rutinepreget, repeterende eller tidkrevende på en måte som ikke gir så mye tilbake.
2. **Marker de du tror en AI kan hjelpe med.** Ikke løs dem - bare ha dem klare. De blir utgangspunktet når vi bygger skills sammen i økten.

Sitter du fast? Ta det med ro - vi løser det sammen i starten av økten.

## Oppsummering

Økta 25. august handlet om skills i praksis. Herman kjørte fra HTML-dekken. Dere så først hva en skill *er* (en mappe med markdown, ikke magi), så *hva den gjør* på samme ekte prospekt tre ganger, så plotte dere egne oppgaver i matrisen og skrev en enkel skill for den dere valgte.

### Anatomien

En skill er markdown-filer i en mappe. I økta var eksempelet `stresstest-2/`:

- **`SKILL.md`** - selve skillen. `description` er triggeren: når den skal slå inn, og når den *ikke* skal. Kroppen er oppskriften.
- **`references/mandat.md`** - målestokken alt vurderes mot (her: et eksempelmandat for eiendom, ikke REQs faktiske mandat).
- **`references/rode-flagg.md`** - sjekklisten for svakheter folk overser.
- **`examples/stresstest-eksempel.md`** - forbildet: formen og tonen svaret skal treffe.

Poenget var rollene, ikke å lese hver linje.

### Tre nivåer av instruksjon

1. **Bare en prompt** - du skriver alt hver gang. Claude vet ingenting fra før.
2. **Prompt + filer i et Project** - faste dokumenter som ligger ved. Kontekst, men ingen oppskrift.
3. **Skill** - en fil som sier hva den skal gjøre, når, og viser et forbilde. Den trigger automatisk.

### Samme stresstest tre ganger

Modelljobben var en stresstest av et prospekt: holder det mot målene, og hvor er hullene? Prospektet var Hermans egen fil (på presentasjonsmaskinen, ikke i repoet). Formen er poenget - ikke deres oppgave.

Samme prompt alle tre gangene: «Stresstest dette prospektet.»

1. **Uten skill** - typisk en høflig oppsummering. Den tror på prospektets egne tall, har ingen målestokk, og fordeler styrker og svakheter likt «for balansen».
2. **Dårlig skill (`stresstest-1`)** - hele filen får plass på ett lysbilde. Hver linje høres fornuftig ut (oppsummering først, tvungen balanse, positiv tone, bruk prospektets egne tall) - og hver linje gjør stresstesten *dårligere*.
3. **God skill (`stresstest-2`)** - leser målrettet og hopper over staffasjen, rater prospektet mot mandatet punkt for punkt, er skeptisk fordi prospektet er et salgsdokument, og leverer en mandatmatrise med trafikklys (krav og virkelighet side om side). Har et eksempel å lene seg på.

Forskjellen er ikke magi. Det er instruksjon, en målestokk og et forbilde.

### God skill vs. dårlig skill

| God skill | Dårlig skill |
|---|---|
| Trigger som sier når - og når ikke | Vag trigger - du må huske den selv |
| Struktur og rekkefølge for innholdet | Krever balanse - like mange styrker som svakheter |
| En målestokk å vurdere mot | Positiv tone - tror på salgsdokumentet |
| Regler som fanger typiske feil | Ingenting å måle mot |
| Et eksempel den kan lene seg på | Ikke noe eksempel |

### Matrisen

Aksene: *verdi* = tiden oppgaven spiser i dag, *kompleksitet* = hvor vanskelig en skill er å få til.

- **Quick wins** - høy verdi, lav kompleksitet. Disse går først.
- **Store satsinger** - høy verdi, høy kompleksitet. Ofte en bit til uke 3 (data dere mangler).
- **Trivielt** - lav verdi, lav kompleksitet.
- **Unngå** - lav verdi, høy kompleksitet.

Alle skulle forlate matrisen med *én* oppgave, helst fra quick wins.

### Det dere skrev

Én fil, `SKILL.md`, for use-casen dere satte ring rundt. Malen var formen i `stresstest-2/SKILL.md` - ikke innholdet. Ferdig når filen har en trigger og en kort kropp, og dere har kjørt den på et eksempel den ikke ble skrevet for.

### Mikrooppgave (før 4. sep)

Prøv skillen på to ekte oppgaver. Noter når triggeren traff, og når den ikke gjorde det.

### Neste uke

Økt 3 (4. sep): Projects, dokumenter og offentlige data - koble til noe som allerede finnes, og teste. Skillene dere skrev denne uka tar dere med videre.
