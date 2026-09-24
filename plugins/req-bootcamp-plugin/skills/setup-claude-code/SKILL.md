---
name: setup-claude-code
description: >-
  Prepares a REQ bootcamp attendee for Økt 5 (Claude Code – Intro, Fri 25 Sep
  2026): install or open Claude Code with the REQ account, update the course
  plugin, download the evergreen investor site zip to Desktop, and start the
  local python preview. Use when they ask to set up Claude Code, «sett opp
  Claude Code», «økt 5 forarbeid», «forbered økt 5», «evergreen-fund», or how
  to get the local codebase / preview ready. Windows first; do not git clone.
---

# Sett opp Claude Code til økt 5

Forarbeid til **økt 5 (25. sep 2026): Claude Code – Intro**. Publikum er REQ på
**Windows først**, Mac som nummer to. Svar på **norsk (bokmål)**, varmt og
kort. Kjør stegene selv når du er i Claude Code; vis kommandoene hvis du
bare kan veilede.

Ikke krev GitHub-push eller Vercel-deploy. Ikke `git clone`. Ikke finn på
`npm install`, `package.json` eller `vercel dev` for denne siden — det er en
**statisk investor-side** under `site/`.

## 1. Claude Code åpen med REQ-kontoen

Hvis Claude Code allerede kjører og deltakeren er inne: hopp til steg 2.

Hvis den **ikke** er installert, eller Code-fanen ikke åpner:

**Windows (primær)**

1. Last ned Claude Desktop (Code-fanen er Claude Code, uten egen Node/CLI):
   [claude.com/download](https://claude.com/download) — Windows x64. ARM64:
   bruk ARM64-installeren. Steg-for-steg:
   [Desktop quickstart](https://code.claude.com/docs/en/desktop-quickstart).
2. Installer, åpne **Claude** fra Start-menyen, logg inn med **REQ-kontoen**
   (ikke privat Anthropic-konto).
3. Klikk **Code** øverst. Første gang på Windows trenger Code-fanen
   [Git for Windows](https://git-scm.com/download/win) — installer og
   **start Claude på nytt**.
4. CLI i stedet (PowerShell, ikke CMD):

```powershell
irm https://claude.ai/install.ps1 | iex
claude --version
```

CMD: `curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd`  
WinGet: `winget install Anthropic.ClaudeCode`  
Docs: [Advanced setup](https://code.claude.com/docs/en/installation).

**Mac**

- Samme nedlasting: [claude.com/download](https://claude.com/download), eller
  CLI: `curl -fsSL https://claude.ai/install.sh | bash` og `claude --version`.

Bekreft: de ser Code-fanen (Desktop) eller `claude` svarer i terminalen, logget
inn med REQ.

## 2. Oppdater kurspluginen

Siste kursinnhold, inkludert denne skillen.

- I Claude Code: `/plugin update` — velg `req-bootcamp-plugin`.
- CLI-ekvivalent:

```powershell
claude plugin update req-bootcamp-plugin@req-bootcamp-plugin
```

Si fra hvis pluginen mangler: installer fra REQ-organisasjonen, eller
`/plugin marketplace add mainquest-labs/req-bootcamp-plugin` og
`/plugin install req-bootcamp@req-bootcamp-plugin`.

## 3. Evergreen-koden på skrivebordet (zip, ikke git)

Kilde: offentlig [REQ-org/req-evergreen-site](https://github.com/REQ-org/req-evergreen-site).
Herman vil ha **zip → Desktop**, ikke clone.

Målmappe:

- Windows: `%USERPROFILE%\Desktop\evergreen-fund`
- Mac: `~/Desktop/evergreen-fund`

GitHub-zip pakker ut som `req-evergreen-site-main`. Gi den navnet
`evergreen-fund` så stien stemmer. Finnes mappen allerede med `README.md`
og `data/` / `theme/`: ikke last ned på nytt.

**Windows (PowerShell) — kjør dette:**

```powershell
$desktop = Join-Path $env:USERPROFILE "Desktop"
$root = Join-Path $desktop "evergreen-fund"
if (Test-Path (Join-Path $root "README.md")) {
  Write-Host "Allerede på plass: $root"
} else {
  $zip = Join-Path $desktop "evergreen-fund.zip"
  Invoke-WebRequest -Uri "https://github.com/REQ-org/req-evergreen-site/archive/refs/heads/main.zip" -OutFile $zip
  Expand-Archive -Path $zip -DestinationPath $desktop -Force
  $extracted = Join-Path $desktop "req-evergreen-site-main"
  if (Test-Path $extracted) { Rename-Item $extracted "evergreen-fund" }
  Write-Host "Klar: $root"
}
Get-ChildItem $root | Select-Object Name
if (Test-Path (Join-Path $root "package.json")) { Write-Host "Uventet package.json — ikke kjør npm." }
```

**Mac / Git Bash:**

```bash
DESKTOP="$HOME/Desktop"
ROOT="$DESKTOP/evergreen-fund"
if [ -f "$ROOT/README.md" ]; then
  echo "Allerede på plass: $ROOT"
else
  curl -L -o "$DESKTOP/evergreen-fund.zip" \
    "https://github.com/REQ-org/req-evergreen-site/archive/refs/heads/main.zip"
  unzip -o "$DESKTOP/evergreen-fund.zip" -d "$DESKTOP"
  mv "$DESKTOP/req-evergreen-site-main" "$ROOT"
fi
ls "$ROOT"
```

Dette er **ikke** en npm-app. Du skal se `data/`, `theme/` og `README.md`.
`site/` kommer når Herman (eller dere) bygger investor-siden — finn ikke på
en `package.json`.

## 4. Lokal forhåndsvisning (python, ikke npm)

Offisiell kommando fra repoets README. Bare når `site/` finnes. Port opptatt:
bruk **8766**.

**Windows (primær):**

```powershell
cd $env:USERPROFILE\Desktop\evergreen-fund\site
py -m http.server 8765
```

`py` mangler: `python -m http.server 8765`.  
Mangler Python: [python.org](https://www.python.org/downloads/windows/) eller
`winget install Python.Python.3.12`, så prøv `py` igjen.

**Mac:**

```bash
cd ~/Desktop/evergreen-fund/site && python3 -m http.server 8765
```

Åpne [http://127.0.0.1:8765](http://127.0.0.1:8765). Ikke `npm install`,
ikke `npx`, ikke `vercel dev`.

Finnes ikke `site/` ennå: mappen er likevel klar. Si at forhåndsvisning
venter til `site/` er der — ikke bygg en dummy-side nå.

## 5. Vercel CLI (stretch, ikke krav)

Valgfritt til senere deploy. **Ikke** logg inn eller deploy i dette
forarbeidet. Mangler den, og `npm` finnes:

```powershell
npm i -g vercel
vercel --version
```

Ingen Node/npm: hopp over. Økta krever ikke hosting.

## Du er klar

Kort sjekkliste til deltakeren:

1. **Mappe:** `%USERPROFILE%\Desktop\evergreen-fund` (Windows) eller
   `~/Desktop/evergreen-fund` (Mac).
2. **Forhåndsvisning** når `site/` finnes: `cd` inn i `site`, så
   `py -m http.server 8765` (Windows) / `python3 -m http.server 8765` (Mac),
   og åpne http://127.0.0.1:8765.
3. **Åpne mappen i Claude Code:** Desktop → Code → Local → velg
   `evergreen-fund` på skrivebordet. CLI:
   `cd %USERPROFILE%\Desktop\evergreen-fund` (Windows) eller
   `cd ~/Desktop/evergreen-fund` (Mac), deretter `claude`.

Ta med markedsmateriell eller en side du vil jobbe med. GitHub og deploy
kan vente.
