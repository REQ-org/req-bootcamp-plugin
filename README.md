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
/plugin marketplace add REQ-org/req-bootcamp-plugin
/plugin install req-bootcamp@req-bootcamp-plugin
```

## Bruk

Spør Claude om alt som gjelder kurset - prøv kommandoen `/kurs`, skillen `prep-me-for-bootcamp`, eller `/forklar <tema>` for en forklaring på hva som helst.

Pluginen kobler også til **Varden MCP Garden** som én MCP-server inne i denne pluginen (`varden-garden`) — ikke en egen plugin. Åpne norske data uten innlogging. Skillene `ssb`, `brreg`, `regnskap`, `kartverket`, `met` og `oslo-pbe` sier når Claude skal bruke hvilken pakke. Prøv:

- «hvor mange innbyggere har Oslo?»
- «slå opp REQ AS i Enhetsregisteret»
- «hva er adressen Sommerrogata 17?»
- «hvilke reguleringsplaner gjelder Sommerrogata 17?»
- «hva er værvarselet for Oslo?»
- «hent nøkkeltall fra siste årsregnskap for REQ AS»

## Oppdateringer

Innholdet oppdateres i dette repoet etter hver økt, og pluginen henter alltid siste versjon fra kursserveren. I Claude Code kan du kjøre `/plugin update` (eller slå på auto-oppdatering under `/plugin` → Marketplaces).

## MCP-servere

Pluginen kobler deg automatisk til to åpne MCP-servere — ingenting å konfigurere, ingen nøkler:

| Server | URL | Innhold |
|---|---|---|
| `req-bootcamp` | `https://req-bootcamp.vercel.app/api/mcp` | Timeplan, øktnotater og FAQ (`api/mcp.ts`) |
| `varden-garden` | `https://varden-mcp-garden.vercel.app/api/mcp` | Garden-pakke i denne pluginen: SSB, Brreg, Kartverket, MET, regnskap, Oslo Planinnsyn/Saksinnsyn |

Kursserveren leser de samme markdown-filene som pluginen. Garden er Vardens felles åpne MCP — én server-URL i `.mcp.json`, ikke et eget marketplace-plugin og ikke en ekstra server i dette repoet.

> Merk: kommandoen `/kurs`, skillene og innholdet følger med selve pluginen. Installer den fra organisasjonen din (over) for å få alt.

---

*Bygget av [Varden](https://vardenlab.com) for REQ Capital. Ingen sensitiv informasjon lagres i dette repoet.*
