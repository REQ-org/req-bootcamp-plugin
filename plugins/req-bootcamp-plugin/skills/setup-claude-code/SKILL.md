---
name: setup-claude-code
description: >-
  Prepares a REQ bootcamp attendee for Økt 5 (Claude Code – Intro, Fri 25 Sep
  2026) inside Claude Desktop: Code tab with the REQ account, plugin update,
  download the evergreen investor site zip to Desktop, open that folder, and
  python-preview when site/ exists. Use when they ask to set up Claude Code,
  «sett opp Claude Code», «økt 5 forarbeid», «forbered økt 5»,
  «evergreen-fund», or how to get the local codebase / preview ready. Windows
  first; Desktop already installed; do not git clone.
---

# Sett opp Claude Code til økt 5

Forarbeid til **økt 5 (25. sep 2026): Claude Code – Intro**. Alle har allerede
**Claude Desktop**. I morgen bruker de **Code-fanen** der — ikke en separat
CLI-installasjon. Publikum er REQ på **Windows først**, Mac som nummer to.

Svar på **norsk (bokmål)**, varmt og kort. Følg stegene, men vær fleksibel
når noe feiler: feil sti, OneDrive-skrivebord, ingen `py`, port opptatt,
ingen `site/` ennå, plugin mangler, Git for Windows påkrevd for Code-fanen.
Diagnostiser og tilpass. Ikke stopp rigid. Ikke finn på `npm install`,
`package.json` eller `vercel dev`. Ikke `git clone`. Ikke krev GitHub-push
eller Vercel-deploy.

Kjør kommandoene selv når du er i Code-fanen; vis dem hvis du bare kan
veilede.

## 1. Code-fanen, REQ-konto

Anta at **Claude Desktop allerede er åpen**.

1. De skal være i **Code**-fanen (øverst), ikke bare Chat/Cowork.
2. Innlogget med **REQ-kontoen**, ikke privat Anthropic-konto.

Mangler Code-fanen likevel: de har Desktop — be dem klikke **Code** øverst.
På Windows, hvis fanen ber om Git: [Git for Windows](https://git-scm.com/download/win),
så start Claude på nytt. Ikke last ned Desktop på nytt, ikke `winget` /
`install.ps1` / CLI-install som hovedspor.

## 2. Oppdater kurspluginen

I Code-fanen: `/plugin update` — velg `req-bootcamp-plugin`.

Mangler pluginen: installer fra REQ-organisasjonen (Settings → Plugins),
eller `/plugin marketplace add mainquest-labs/req-bootcamp-plugin` og
`/plugin install req-bootcamp@req-bootcamp-plugin`.

## 3. Evergreen-koden på skrivebordet (zip, ikke git)

Kilde: offentlig [REQ-org/req-evergreen-site](https://github.com/REQ-org/req-evergreen-site),
**zip av main**. Herman vil ha **zip → Desktop**, ikke clone.

Målmappe: `evergreen-fund` på skrivebordet. GitHub-zip pakker ut som
`req-evergreen-site-main` — gi den navnet `evergreen-fund`. Finnes mappen
allerede med `README.md` og `data/` / `theme/`: ikke last ned på nytt.

**Windows (PowerShell) — kjør dette.** Finn skrivebordet via
`GetFolderPath` (treffer også OneDrive-skrivebord). Finnes ikke den:
prøv `$env:USERPROFILE\Desktop`, deretter `OneDrive\Desktop` og
`OneDrive*\Desktop`.

```powershell
$desktop = [Environment]::GetFolderPath('Desktop')
if (-not $desktop -or -not (Test-Path $desktop)) {
  $candidates = @(
    (Join-Path $env:USERPROFILE "Desktop"),
    (Join-Path $env:USERPROFILE "OneDrive\Desktop")
  ) + @(Get-ChildItem (Join-Path $env:USERPROFILE "OneDrive*") -Directory -ErrorAction SilentlyContinue |
      ForEach-Object { Join-Path $_.FullName "Desktop" })
  $desktop = $candidates | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
}
if (-not $desktop) { throw "Fant ikke skrivebordet. Spør hvor Desktop ligger (ofte OneDrive)." }
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
```

**Mac:**

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
Ingen `package.json` å kjøre.

**`site/` mangler? Det er greit i forarbeidet.** Mappen er klar likevel.
Forhåndsvisning skjer i økta, når Herman (eller dere) bygger investor-siden.
Ikke bygg en dummy-`site/` nå. Ikke finn på `package.json`.

## 4. Åpne mappen i Code

I Code-fanen: **Local** → velg mappen `evergreen-fund` på skrivebordet
(den faktiske stien fra steg 3). Da jobber økta i riktig prosjekt.

## 5. Lokal forhåndsvisning — bare når `site/` finnes

Offisiell kommando fra repoets README. **Hopp over dette steget** hvis
`site/` ikke er der ennå — det er forventet før økta.

Port 8765 opptatt → prøv **8766**. `py` mangler → `python`, så `python3`.

**Windows (primær):**

```powershell
cd <skrivebord>\evergreen-fund\site
py -m http.server 8765
```

**Mac:**

```bash
cd ~/Desktop/evergreen-fund/site && python3 -m http.server 8765
```

Åpne [http://127.0.0.1:8765](http://127.0.0.1:8765). Ikke `npm install`,
ikke `npx`, ikke `vercel dev`. Mangler Python på Windows: pek til
[python.org](https://www.python.org/downloads/windows/) eller
`winget install Python.Python.3.12`, så prøv `py` igjen.

## 6. Vercel CLI (stretch, ikke krav)

Valgfritt til senere deploy. **Ikke** logg inn eller deploy i forarbeidet.
Mangler den, og `npm` finnes: `npm i -g vercel` og `vercel --version`.
Ingen Node: hopp over. Økta krever ikke hosting.

## Du er klar

Kort sjekkliste til deltakeren:

1. **Code-fanen** i Claude Desktop, innlogget med **REQ-kontoen**.
2. **Mappe:** `evergreen-fund` på skrivebordet (vanlig eller OneDrive),
   åpnet som prosjekt i Code.
3. **`site/` kan mangle** — helt OK før økta. Når den finnes:
   `py -m http.server 8765` (Windows) / `python3 -m http.server 8765` (Mac)
   inne i `site/`, så http://127.0.0.1:8765 (8766 hvis opptatt).

Ta med markedsmateriell eller en side du vil jobbe med. GitHub og deploy
kan vente.
