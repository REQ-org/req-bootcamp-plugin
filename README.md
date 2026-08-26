# REQ AI Bootcamp — kursplugin

Claude-plugin for deltakerne på REQ AI Bootcamp (Varden). Inneholder kursinformasjon - timeplan, oppsummeringer fra hver økt og svar på vanlige spørsmål - rett i Claude. Pluginen kobler også til åpne norske datakilder (SSB, Enhetsregisteret, Kartverket) uten innlogging.

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

Offentlige data (ingen innlogging, ingen REQ-interne kilder):

- «hvor mange innbyggere har Oslo?»
- «slå opp REQ Capital i Enhetsregisteret»
- «hva er adressen Sommerrogata 17 i Oslo?»

## Oppdateringer

Innholdet oppdateres i dette repoet etter hver økt, og pluginen henter alltid siste versjon fra kursserveren. I Claude Code kan du kjøre `/plugin update` (eller slå på auto-oppdatering under `/plugin` → Marketplaces).

## MCP-servere

Pluginen kobler deg automatisk til to åpne HTTP-servere - ingenting å konfigurere, ingen API-nøkkel:

| Server | URL | Innhold |
|---|---|---|
| `req-bootcamp` | `https://req-bootcamp.vercel.app/api/mcp` | Timeplan, øktnotater og FAQ |
| `norge-open-data` | `https://req-bootcamp.vercel.app/api/norge` | SSB, Enhetsregisteret og Kartverket |

Kursserveren (`api/mcp.ts`) leser de samme markdown-filene som pluginen. Den offentlige dataserveren (`api/norge.ts`) wrapper offisielle åpne API-er og krediterer kilden i hvert svar.

### Slik bruker du SSB i Claude

1. Installer pluginen (over) - da ligger `norge-open-data` allerede i `.mcp.json`.
2. Spør på vanlig norsk, f.eks. **«hvor mange innbyggere har Oslo?»**
3. Claude søker i Statistikkbanken, slår opp regionkode 0301 og henter tabell 07459.

Andre øvelser: «vis KPI siste fem år», «finn orgnr til REQ AS», «hvilken kommune ligger Sommerrogata 17 i?».

> Merk: kommandoen `/kurs`, skillene og innholdet følger med selve pluginen. Installer den fra organisasjonen din (over) for å få alt. Interne REQ-connectors hører ikke hjemme her - de kommer i en egen katalog når legal er avklart.

---

*Bygget av [Varden](https://vardenlab.com) for REQ Capital. Ingen sensitiv informasjon lagres i dette repoet.*
