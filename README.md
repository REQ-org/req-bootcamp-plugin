# REQ AI Bootcamp — kursplugin

Claude-plugin for deltakerne på REQ AI Bootcamp (Varden). Inneholder kursinformasjon — timeplan, oppsummeringer fra hver økt og svar på vanlige spørsmål — rett i Claude.

## Installasjon (for REQ-deltakere)

Administratoren har lagt pluginen ut for REQ, så du installerer den rett fra organisasjonen din:

1. Åpne **Settings → Plugins** (Innstillinger → Plugins)
2. Gå til **Your organization** (organisasjonen din)
3. Finn **REQ Bootcamp** i listen
4. Klikk **Install** - ingenting å lime inn, ingen innlogging

Samme instruksjoner på landingssiden: <https://req-bootcamp.vercel.app>

### Reserve: last ned pakken

Dukker ikke pluginen opp under organisasjonen din, eller henger installeringen? Last ned [`req-bootcamp-plugin.zip`](https://req-bootcamp.vercel.app/req-bootcamp-plugin.zip) og legg den til manuelt.

### Alternativt: Claude Code via offentlig marketplace

```
/plugin marketplace add mainquest-labs/req-bootcamp-plugin
/plugin install req-bootcamp@req-bootcamp-plugin
```

## Bruk

Spør Claude om alt som gjelder kurset - prøv kommandoen `/kurs`, skillen `prep-me-for-bootcamp`, eller `/forklar <tema>` for en forklaring på hva som helst.

## Oppdateringer

Innholdet oppdateres i dette repoet etter hver økt, og pluginen henter alltid siste versjon fra kursserveren. I Claude Code kan du kjøre `/plugin update` (eller slå på auto-oppdatering under `/plugin` → Marketplaces).

## Kursserver (MCP)

Pluginen kobler deg automatisk til kursets åpne MCP-server (`req-bootcamp`), som alltid serverer siste versjon av timeplan, oppsummeringer og FAQ - ingenting å konfigurere. Serveren kjører på Vercel fra dette repoet (`api/mcp.ts`) og leser de samme markdown-filene som pluginen.

Server-URL: `https://req-bootcamp.vercel.app/api/mcp`

> Merk: kommandoen `/kurs`, skillene og innholdet følger med selve pluginen. Installer den fra organisasjonen din (over) for å få alt.

---

*Bygget av [Varden](https://vardenlab.com) for REQ Capital. Ingen sensitiv informasjon lagres i dette repoet.*
