# REQ AI Bootcamp — kursplugin

Claude Code-plugin for deltakerne på REQ AI Bootcamp (Varden). Inneholder kursinformasjon — timeplan, oppsummeringer fra hver økt og svar på vanlige spørsmål — rett i Claude Code.

## Installasjon (to kommandoer)

Åpne Claude Code og kjør:

```
/plugin marketplace add mainquest-labs/req-bootcamp-plugin
/plugin install req-bootcamp-plugin@req-bootcamp-plugin
```

Deretter kan du spørre Claude om alt som gjelder kurset — prøv kommandoen `/kurs` eller skillen `prep-me-for-bootcamp`.

## Oppdateringer

Innholdet oppdateres i dette repoet etter hver økt. Kjør `/plugin update` for å hente siste versjon (eller slå på auto-oppdatering under `/plugin` → Marketplaces).

## Kursserver (MCP)

Pluginen kobler deg automatisk til kursets åpne MCP-server (`req-bootcamp`), som alltid serverer siste versjon av timeplan, oppsummeringer og FAQ — ingenting å konfigurere. Serveren kjører på Vercel fra dette repoet (`api/mcp.ts`) og leser de samme markdown-filene som pluginen.

---

*Bygget av [Varden](https://vardenlab.com) for REQ Capital. Ingen sensitiv informasjon lagres i dette repoet.*
