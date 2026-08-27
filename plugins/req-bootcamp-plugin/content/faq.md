# REQ AI Bootcamp - spørsmål og svar

## Praktisk

- **Når og hvor?** Tirsdager kl. 08:30, ti uker fra 18. august til 20. oktober 2026. Sommerrogata 17, Oslo - hybrid på Teams. Første økt (18. aug) er fysisk.
- **Hvor lang er hver økt?** Ca. 60 minutter, minst 70 % hands-on. Kom med PC.
- **Jeg gikk glipp av en økt - hva nå?** Spør Claude: «hva skjedde i økt N?» (skillen `bootcamp-recap` henter oppsummeringen). Forarbeidet til neste økt finner du med `prep-me-for-bootcamp` eller `/kurs`.

## Verktøy

- **Hva trenger jeg?** Claude-konto (dekkes av REQ). I økt 2 skrev dere en skill i Claude - uten installering. Claude Code tar vi senere. Kurspluginen installerer du fra organisasjonen; stegene står i README-en.
- **Hvordan oppdaterer jeg pluginen?** Kjør `/plugin update` i Claude Code (velg `req-bootcamp-plugin`), eller på kommandolinjen: `claude plugin update req-bootcamp-plugin@req-bootcamp-plugin`. Innholdet oppdateres etter hver økt.
- **Hva er MCP-serverne?** Pluginen kobler Claude til to åpne servere, uten innlogging — begge inne i **denne** kurspluginen, ikke som et eget Garden-plugin:
  - `req-bootcamp` — timeplan, oppsummeringer og FAQ (dette repoet)
  - `varden-garden` — [Varden MCP Garden](https://varden-mcp-garden.vercel.app/api/mcp): SSB, Enhetsregisteret, Kartverket, MET og Regnskapsregisteret (nøkkeltall)
  Skillene `ssb`, `brreg`, `regnskap`, `kartverket` og `met` styrer når Claude bruker hvilken pakke. Ingenting å konfigurere. Prøv f.eks. «hvor mange innbyggere har Oslo?» — det går mot SSB via Garden. I økt 3 kobler vi til en eksisterende MCP, og i økt 8 ser vi hvordan en slik server bygges.

## Kurset

- **Hvor ambisiøst er dette?** Bevisst høyt - du bygger din egen skill allerede i uke 2 og en MCP-kobling i uke 3, og vi bygger videre gjennom kurset.
- **Spørsmål mellom øktene?** Still dem her i Claude først - og ellers til Herman (Varden).
- **Sensitiv informasjon?** Aldri i denne pluginen eller dette repoet - bruk de interne kanalene dere får i kurset.
