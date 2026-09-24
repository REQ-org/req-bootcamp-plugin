# REQ AI Bootcamp - spørsmål og svar

## Praktisk

- **Når og hvor?** Kl. 08:30 - ti økter fra 18. august til 30. oktober 2026. Økt 1–2 var tirsdager, fra økt 3 er det fredager. Sommerrogata 17, Oslo - hybrid på Teams. Første økt (18. aug) er fysisk.
- **Hvor lang er hver økt?** Ca. 60 minutter, minst 70 % hands-on. Kom med PC.
- **Jeg gikk glipp av en økt - hva nå?** Spør Claude: «hva skjedde i økt N?» (skillen `bootcamp-recap` henter oppsummeringen). Forarbeidet til neste økt finner du med `prep-me-for-bootcamp` eller `/kurs`.

## Verktøy

- **Hva trenger jeg?** Claude-konto (dekkes av REQ). I økt 2 skrev dere en skill i Claude - uten installering. Claude Code er økt 5 (25. sep): **Code-fanen** i Claude Desktop dere allerede har. Før økta, be Claude om `setup-claude-code` (eller «sett opp Claude Code til økt 5»). GitHub-konto og deploy er *ikke* et krav. Kurspluginen installerer du fra organisasjonen; stegene står i README-en.
- **Hvordan oppdaterer jeg pluginen?** I Code-fanen: `/plugin update` (velg `req-bootcamp-plugin`). Innholdet oppdateres etter hver økt. CLI-ekvivalent hvis du trenger den: `claude plugin update req-bootcamp-plugin@req-bootcamp-plugin`.
- **Hva er MCP-serverne?** Pluginen kobler Claude til to åpne servere, uten innlogging — begge inne i **denne** kurspluginen, ikke som et eget Garden-plugin:
  - `req-bootcamp` — timeplan, oppsummeringer og FAQ (dette repoet)
  - `varden-garden` — [Varden MCP Garden](https://varden-mcp-garden.vercel.app/api/mcp): SSB, Enhetsregisteret, Kartverket, MET, Regnskapsregisteret (nøkkeltall), Oslo Planinnsyn/Saksinnsyn og Norges Bank (renter, fx)
  Skillene `ssb`, `brreg`, `regnskap`, `kartverket`, `met`, `oslo-pbe` og `nb` styrer når Claude bruker hvilken pakke. Ingenting å konfigurere. Prøv f.eks. «hvor mange innbyggere har Oslo?» — det går mot SSB via Garden. I økt 3 koblet dere til en eksisterende offentlig MCP; i økt 8 ser vi hvordan en slik server bygges. Interne REQ-kilder venter på juridisk avklaring.

## Kurset

- **Hvor ambisiøst er dette?** Bevisst høyt - du bygger din egen skill allerede i uke 2 og en MCP-kobling i uke 3, og vi bygger videre gjennom kurset.
- **Spørsmål mellom øktene?** Still dem her i Claude først - og ellers til Herman (Varden).
- **Sensitiv informasjon?** Aldri i denne pluginen eller dette repoet - bruk de interne kanalene dere får i kurset.
