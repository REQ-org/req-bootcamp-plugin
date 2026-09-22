# Interaktive kurssider - designdokument

Dato: 2026-08-17
Repo: `req-bootcamp-plugin` (samme Vercel-side som landingssiden)
Status: til gjennomgang

> **Oppdatert 2026-09-22:** uke 5 i `kurs.js` er avansert Claude Code-flow (markedsføringsside), ikke skriving/REQ-mal. Ti økter, siste 30. okt; uke 4 er arbeidsøkt.

## Hva dette er

Et interaktivt nettsted som utfyller REQ AI Bootcamp, nådd fra landingssiden.
Det er ikke en kopi av lysbildene - det er et **utforskningsverktøy for
deltakerne**: temaene fra økta som et springbrett, men med rom til å leke seg
med konseptene i eget tempo etter timen.

Første leveranse dekker uke 1 fullt ut. Uke 2-10 er synlig til stede, men
merket «Kommer», bygget fra en delt mal så påfølgende uker kan legges til raskt.

### Hvem det er for

Deltakerne på kurset (ca. 12 personer i REQ). Selvstyrt, i eget tempo. Ikke en
presentatørflate - ingen taleranotater, ingen tastaturstyrt lysbildevisning.
«Ser bra ut på skjerm» får vi gratis fra responsivt design.

### Suksesskriterier

- En deltaker kan åpne siden etter økt 1 og gå dypere i minst ett konsept de så
  i timen, ved å faktisk manipulere det (ikke bare lese).
- Alt innhold er ekte og hentet fra kursstoffet - ingen fyll.
- Det føles håndlaget og i REQ-stil, ikke AI-generert (se prinsipper under).
- Å legge til uke 2 senere er å kopiere malen og fylle inn moduler - ingen
  omskriving av rammeverket.

## Arkitektur

Rent statisk, ingen byggeprosess - matcher `public/index.html` slik den er i
dag. Vanilla HTML/CSS/JS. Vercel serverer `public/` som statiske filer.

```
public/index.html          landingsside - ÉN ny lenke til «Kursinnhold»
public/kurs/index.html      kurshub: det interaktive 10-ukerskartet
public/kurs/uke-01.html     Uke 1 - fullt bygget
public/kurs/uke-02.html     …                          } scaffold fra delt mal,
public/kurs/uke-10.html     …                          } merket «Kommer»
public/kurs/kurs.css        delte designtokens + komponentstiler
public/kurs/kurs.js         delt oppførsel (moduler, glossar, prompt-kopiering)
public/kurs/_mal.html       kommentert mal for en ukeside (ikke lenket)
```

Ingen endring i `index.html` utover én navigasjonslenke og (om nødvendig) én
`<link>`. Ellers urørt.

### Delt stilark (`kurs.css`)

Landingssiden har CSS inline. Vi dupliserer ikke - vi løfter de samme tokenene
ut i `kurs.css` og bruker dem på kurssidene:

```
--navy #001D6C · --paper #FAF9F7 · --ink #22252B · navy-soft/faint/ghost-tonene
--sans "Schibsted Grotesk" · --mono "IBM Plex Mono"
Prikkematte-buen (.dots), rise-animasjonen, hårfine linjer, .wrap-bredden
```

Landingssiden får ikke sin inline-CSS refaktorert - det er utenfor scope.
`kurs.css` er en frittstående kopi av de samme verdiene.

## Informasjonsarkitektur

### Landingssiden

Én ny lenke i toppbaren (ved siden av «github ↗»): **«Kursinnhold →»** til
`/kurs/`. Minimal, kirurgisk endring.

### Kurshub (`/kurs/index.html`)

Sentrumet er det interaktive **10-ukerskartet** - deck-ets «Kartet»-klatring
gjort levende:

- Stigende sti med ti noder, gruppert i tre faser (Grunnlaget · Bygge og
  automatisere · Forankring og leveranse), samme innhold som lysbildet.
- Uke 1 er aktiv og lenker til `/kurs/uke-01.html`.
- Uke 2-10 er synlige, men i «Kommer»-tilstand (dempet, ikke klikkbar, med tema
  synlig så helheten er tydelig).
- Hover/fokus på en node viser tema + hva du bygger den uka.

### Ukeside (`/kurs/uke-01.html`)

Vertikal scroll av selvstendige moduler. Hver modul: en kort ramme (hva dette
er, hvorfor det betyr noe) + et interaktivt element. Lett anker-navigasjon i
kanten så man kan hoppe mellom moduler.

## Modulene (uke 1)

Rangert. Alle bygges grundig.

### 1. Plugin-anatomien (hero - eksplisitt ønsket)

Et oppdelt diagram av en plugins fem deler. Klikk en del → den utvider seg med
hva den er **og et ekte eksempel fra denne kursets egen plugin**:

| Del | Ekte eksempel fra kurspluginen |
|---|---|
| Kommandoer | `/kurs` |
| Skills | `prep-me-for-bootcamp`, `bootcamp-recap`, `forklar` |
| Sub-agenter | (forklart; kurspluginen bruker ingen ennå) |
| MCP-koblinger | MCP-serveren som gir Claude siste kursinnhold |
| Hooks | (forklart; automatikk på hendelser) |

En veksle-kontroll kontrasterer **«du kaller selv»** (kommandoer) mot **«Claude
bruker selv»** (skills) - det er «forskjellen mellom delene» gjort håndgripelig.
Går dypere enn lysbildet ved å vise et lite glimt av hvordan en skill eller
kommando faktisk ser ut (en kort, ekte kodesnutt).

### 2. Claude-økosystemet

Den lagdelte stabelen (Bygge → Dele → Bruke → Grunnmuren) som kan tas fra
hverandre. Klikk et lag for å utvide: hva det er og *når* du bygger på det
nivået. Den byttbare motoren (Claude ⇄ GPT ⇄ Gemini) gjort håndgripelig -
poenget at lagene over blir stående når motoren byttes.

### 3. Kontekstvinduet

Et token-budsjett du faktisk manipulerer. Segmenter (systeminstruks, verktøy &
MCP, prosjekt & minne, hentet materiale, samtalehistorikk, din melding) kan slås
av/på, og «Ledig plass» krymper synlig. Lærer økonomisk bruk ved å kjenne på
det, ikke bare lese om det.

### 4. Modellvelgeren

Velg en oppgavetype → få en Haiku/Sonnet/Opus-anbefaling med begrunnelse. Et
lite referanseverktøy deltakerne bruker videre etter økta. Tommelfingerregelen
fra deck-et (start med Sonnet, løft til Opus når oppgaven krever det) bakt inn.

### 5. Begrepsbank (kompounderer over kurset)

Søkbart glossar over kursterminologien: Projects, Artifacts, Skills, tools, MCP,
API, Cowork, agenter, tokens, kontekstvindu, LLM, plugin, hooks, sub-agent m.fl.
Hvert begrep: kort forklaring på naturlig bokmål + hvilken uke det hører til.
Filtrering ved skriving. Vokser hver uke - derfor bygget som en datadrevet liste
(ett JS-objekt), ikke håndkodet markup, så påfølgende uker bare legger til
oppføringer.

### 6. Prompt-oppskrifter (kompounderer over kurset)

Et lite bibliotek med kopierbare «prøv selv»-prompter knyttet til hvert konsept
(f.eks. «Forklar MCP for meg - helt enkelt», «Lag en REQ-profilert presentasjon
om det vi nettopp gikk gjennom»). Klikk for å kopiere. Gjør utforskning til
handling. Også datadrevet så uker legger til egne oppskrifter.

### Bevisst utelatt fra uke 1

- Språkmodell ≠ søk ≠ database (kuttet av Herman)
- Kildekritikk (mer «regel» enn utforskning; kan legges til senere)
- Presentatørmodus / taleranotater (ikke deltakerrettet)

## Datamodell (for gjenbruk over 10 uker)

Innhold som vokser over kurset holdes som data, ikke markup, i `kurs.js`:

- `GLOSSARY`: liste av `{ term, forklaring, uke }`
- `PROMPTS`: liste av `{ tittel, prompt, konsept, uke }`
- `WEEKS`: liste av `{ nr, tittel, fase, status: 'live'|'kommer', href }` -
  driver både hub-kartet og navigasjon

Å legge til uke N = legge oppføringer i disse listene + kopiere `_mal.html`.

## Interaksjon og oppførsel (`kurs.js`)

Rammeløst, progressive enhancement: siden er lesbar uten JS; JS legger til
utforskningen. Ingen avhengigheter.

- Modul-utvidelser: klikk/tastatur, `aria-expanded`, fokushåndtering.
- Glossar-filter: ren klientside-filtrering av `GLOSSARY`.
- Prompt-kopiering: `navigator.clipboard`, med synlig «Kopiert»-kvittering.
- Kontekstvindu: toggle-tilstand → rekalkuler segmentbredder.
- Bevegelse holdes til deck-ets/landingssidens vokabular (rise-fade). Respekter
  `prefers-reduced-motion`.

## Slik unngår vi at det føles AI-generert

- Samme tokens som landingssiden, eksakt (navy, paper, Schibsted Grotesk + IBM
  Plex Mono, prikkematte-motivet).
- Kun det eksisterende, tilbakeholdne bevegelsesvokabularet. Ingen
  parallax-svulst, ingen sprett.
- Ingen emoji. Ingen lilla gradienter. Ingen generisk ikon-kort-rutenett som
  fyll.
- Norsk stemme matchet deck-ets korte, redaksjonelle tone.
- Bindestrek med mellomrom, aldri tankestrek (Hermans stående regel).
- Ekte innhold fra kursstoffet. Aldri lorem/fyll.
- Typografisk hierarki og luft gjør jobben - ikke bokser og skygger.

## Tilgjengelighet og responsivitet

- Fungerer uten JS (innhold synlig; interaktivitet er tillegg).
- Tastaturnavigerbar; synlige fokusringer; ARIA på interaktive moduler.
- Responsiv: én kolonne på mobil, kartet degraderer til vertikal liste.
- Kontrast innenfor WCAG AA på navy/paper.

## Testing / verifisering

Statisk side, ingen testrigg i repoet. Verifisering:

- Åpne hver side lokalt; klikk gjennom hver interaktiv modul.
- Sjekk mobilbredde (én kolonne, kart-degradering).
- Tastatur-gjennomgang av én modul + glossar + prompt-kopiering.
- Bekreft at landingssiden er urørt utover den ene lenka.
- Bekreft «Kommer»-uker ikke er klikkbare og leser tydelig.

## Scope-grenser

- Ingen refaktorering av landingssidens inline-CSS.
- Ingen byggeprosess, ingen npm-avhengigheter for frontend.
- Uke 2-10 er scaffold/«Kommer» - ikke innhold, i denne leveransen.
- Ingen backend; alt statisk.
```
