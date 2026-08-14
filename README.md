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

Server-URL: `https://req-bootcamp-plugin.vercel.app/api/mcp`

## Claude Desktop (uten Claude Code)

Bruker du Claude-appen på Mac/Windows eller claude.ai i nettleseren? Da kan du koble til kursserveren som en «connector»:

1. Åpne **Settings → Connectors** (Innstillinger → Koblinger).
2. Klikk **Add custom connector** (Legg til egendefinert kobling).
3. Fyll inn:
   - **Name:** `REQ Bootcamp`
   - **URL:** `https://req-bootcamp-plugin.vercel.app/api/mcp`
4. Klikk **Add**. Ingen innlogging trengs — serveren er åpen.

Deretter kan du spørre Claude direkte, f.eks. «hva er forarbeidet til neste økt?» eller «vis timeplanen for bootcampen».

> Merk: kommandoen `/kurs` og skillene følger med selve pluginen og finnes bare i Claude Code. I Claude Desktop får du timeplan, oppsummeringer og FAQ via connectoren.

---

*Bygget av [Varden](https://vardenlab.com) for REQ Capital. Ingen sensitiv informasjon lagres i dette repoet.*
