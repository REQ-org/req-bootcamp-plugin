---
name: req-underwriting-model
description: Use whenever building, updating, reviewing or sanity-checking a real estate underwriting/investment model for REQ (Nordic alternative investment fund manager) – for both REQ Evergreen Income Fund (ubelånt, income) and REQ Real Estate Fund I/II (belånt, value-add, rehab/utvikling, selgerkreditt, utbyttefordeling/hurdles). Trigger on "lag en underwriting-modell", "bygg en modell for [eiendom]", "sett opp cashflow/IRR", "regn på dette kjøpet", "one-pager/pipeline-tall for [case]", or when given a rent roll, leiekontrakter, kjøpsmemo/IM, saldoskjema or a pipeline deck and asked for returns. Free-form modelling reliably drops required elements (skatteulempe, saldo roll-forward, forvaltningskost, utløpsprofil, sensitiviteter, model checks) and produces non-presentation-grade output — always follow this skill, even for a "quick" request.
---

# REQ Underwriting Model

REQ's reference template ("Crunched_Test") is the fasit for *what* must be modelled. Layout may
flex per case; completeness and correctness may not. Output must be PE-grade: professional,
functional (fully live formulas, checks), and visual (presentation-ready one-pager).

Reference implementation of everything below: `references/example_aslakveien18/build_part1-4.py`
(run `PROFILE=EIF` or `PROFILE=REF python3 build_part4.py` from that folder with `scripts/req_style.py`
on the path – REF adds NIBOR-kurve, avdragsfri periode, selgerkreditt, 22 % skatt med underskudd,
covenants, ubelånt vs. belånt avkastning, SHA-waterfall og margin/LTV-grid).
House style helpers: `scripts/req_style.py`. Visual standard in detail: `references/visual-standard.md`.

## Step 0 · Fondsprofil (always first – ask if not obvious)

| | REQ Evergreen Income Fund | REQ Real Estate Fund I/II |
|---|---|---|
| Strategi | Core/income, lang WAULT | Value-add: ledighet, underleie, rehab, utvikling |
| Gjeld | Ubelånt (Financing-fane med LTV 0) | 60 % LTV, margin 2,0 %, avdrag 2 %, avdragsfri periode, NIBOR-kurve, ev. selgerkreditt – `references/financing.md` |
| Løpende skatt | 0 % (bekreft) | 22 % med rentefradrag og fremførbart underskudd |
| Moduler | Kjerne | Kjerne + utleie/reversjon + rehab/utvikling ved behov – `references/value-add.md` |
| Avkastning | Ubelånt IRR/MoE, CoC, DPI | Ubelånt og belånt IRR/MoE, peak equity, netto investor etter fee og carry (SHA 10.2) – `references/waterfall.md` |
| Holdeperioder | 3 / 5 / 10 år | Typisk 3 / 5 / 7 år (bekreft per case) |
| Sammendrag | Deck-KPI-er (yield, WAULT, CoC, DPI) | Samme + finansiering (bank- og total-LTV, all-in rente, ICR/DSCR, debt yield, gjeld ved exit), reversionary yield, yield on cost, økonomisk ledighet |
| Exit yield | = inngangsyield | Stabilisert NOI; Δ vs. inngang som eget input med begrunnelse |

Everything else in this skill applies to both profiles.

## Workbook structure (tab order)

1. **Sammendrag** – one-pager dashboard (see visual standard). Always first.
2. **Overview** – *all* inputs in one place (value, unit, status, source), sources & uses, model checks.
3. **Rent roll** – tenant table, key lease metrics, utløpsprofil (+ chart).
4. **Case-specific valuation tab** when relevant (e.g. **Boligverdi**: market data, residual value, implied price/kvm, section-sale calc).
5. **CF** – full annual P&L-to-equity per scenario (years 1..N+1; the extra year only feeds exit value).
6. **Tax accounts** – saldo roll-forward, avskrivninger, løpende skatt, skatteulempe ved kjøp.
7. **Financing** – loan IB/renter/avdrag/UB (LTV input; 0 % allowed but the tab always exists).
8. **Returns** – exit analysis per scenario × holding period, XIRR timelines, CoC/DPI, chart data.
9. **Sensitivities** – heatmap grids (user-facing) + **Sens-motor** (technical engine, last tab).
Core template tabs (Overview, Rent roll, Financing, CF, Tax accounts, Returns) are always present.
Gevinstdeling/ESG/Value-add only when the case has content for them.

## Mandatory input checklist (ask for anything missing that moves IRR — never invent it)

Every input row on Overview carries: value (blue font, pale-blue fill), unit, **status**
(`Iht. deck`, `Iht. saldoskjema`, `Oppgitt`, `REQ-standard`, `Antakelse`, `Foreløpig`) and source.
`Foreløpig` = amber fill. Define every input as a workbook **defined name** (e.g. `Kjopspris`,
`KPI`, `ExitYield`) so formulas read like the logic; avoid names that look like cell refs (`EK0`).

**Prosjekt**: navn/adresse, segment, SPV + org.nr, matrikkel (note if already seksjonert),
fond, prosjektstart/verdidato (t0), holdeperioder (standard 3 / 5 / 10 år; base case = 10).

**Kjøp**: **Kjøpspris (bud) is its own input and drives equity** — our bottom-up valuation is
*verdistøtte*, never the price basis unless the user says so. DD/SPA, working capital, megler.
Equity = kjøpspris − skatteulempe + transaksjonskostnader − lån (show as Kilder og anvendelse).

**Skatt**
- Skatteulempe = sats (typ. 10 %) × (GAV − (saldo + tomteverdi)), tomteverdi = % av GAV (typ. 20 %).
  Same formula at exit using exit value and saldo UB at exit year. Share-deal concept only.
- **Saldoverdier come with a date — roll them forward to t0** (e.g. 31.12.2024 → 01.01.2027 =
  two years of avskrivning). Using stale saldo overstates basis.
- Capture the **actual skattemessig inngangsverdi tomt** from saldoskjema — used for real
  realisation (seksjonssalg). The 20 %-of-GAV convention is only for skatteulempe.
- Løpende skattesats: **never assume; take it from the fund profile and confirm.** Evergreen often
  0 % (aksjonærlån can give 0–22 %); Real Estate Fund 22 % with rentefradrag and underskudd.
- Seksjonssalg / direkte eiendomssalg = real gevinstskatt (22 % unless told otherwise) on
  salgssum − salgskost − (allokert saldo + allokert tomt + aktivert oppussing). Note that
  gevinst- og tapskonto can defer; model conservatively (full tax in sale year) unless asked.
- When tax > 0: split rehab/capex into fradragsberettiget vs. aktivert, and TI's inntektsført vs. balanseført.

**Leieinntekter**: per tenant — leieobjekt, kategori (Offentlig/Privat), areal BTA, leie
(basisår), KPI-andel (e.g. Rema 80 %), kontraktsutløp (**real date**), opsjon (år), markedsleie
ved utløp, ledighet ved utløp (mnd), capex re-letting (kr/kvm), kommentar. Verify options
against the contracts — rent rolls are sometimes wrong (e.g. opsjon already exercised).
Global: KPI-steg basisår → år 1 (actual, per tenant KPI-andel), KPI p.a., **strukturell
ledighet % fra år X**, ledig areal i dag.

**Drift og forvaltning**
- **Eierkost** = 5 % av leie (label exactly "Eierkost"); eiendomsskatt separate, on top.
- **Forvaltningskostnader – three named lines below NOI**: AM-kostnad (% av kjøpspris),
  teknisk forvaltning (NOK p.a., KPI), forretningsførsel (% av leie).
- **Capex-lekkasje** % av leie (REQ deck standard 5 %), plus capex ved re-letting (kr/kvm × areal,
  in the re-let year). Both below EBITDA — cash flow, not valuation.
- Renteinntekt på kontantbeholdning (innskuddsrente × snitt kontant) if cash is retained in the SPV.

**Exit**: exit yield = inngangsyield (NOI år 1 / kjøpspris) + Δ input (default 0 bp, as in deck);
separate yields for blocks where needed (e.g. næringsdel); divestment-kost (typ. 1,25 %).

**Finansiering**: always a Financing tab. Belånt profile: all inputs in `references/financing.md`
(LTV, margin per tranche, NIBOR-kurve, avdrag, avdragsfri periode, etablering, refinansiering,
capex-lån, selgerkreditt, covenants). Ubelånt: LTV 0, same structure.

**Deck-KPI-er** (pipeline deck / one-pager) — every model must be able to produce them; see
Sammendrag content list in the visual standard.

## Calculation rules (the recurring error sources)

1. **Rent per tenant and year blends three states with exact day fractions**: contracted rent
   to expiry → vacancy gap → market rent after re-let. `relet = EDATE(EXP,VAC)`;
   `c_frac = MAX(0,MIN(YE,EXP)−YS+1)/(YE−YS+1)`; `m_frac = MAX(0,YE−MAX(YS,relet+1)+1)/(YE−YS+1)`.
   Contracted index `(1+KPIstart·f)(1+KPI·f)^(y−1)`; market/cost index `(1+KPIstart)(1+KPI)^(y−1)`.
2. **NOI = netto leie (etter strukturell ledighet) − eierkost − eiendomsskatt.** All valuation
   (entry yield, GAV/verdistøtte, exit) uses NOI — never brutto leie, and before forvaltning.
3. **Exit value = annualised run-rate NOI at 1.1. in year N+1 / exit yield** — build a memo row
   "annualisert leie per 1.1." (contracted if still running, else market rent) so vacancy months
   in the CF don't depress the exit value.
4. **Multi-block properties**: allocate opex to blocks pro rata rent (or better key); keep
   "annualisert NOI – næring / – bolig" memo rows for block valuation and allocation keys.
5. **XIRR dating: t0 = kjøpsdato, cash flow of year k dated 31.12 of year k** (year 1 = same
   calendar year as t0). Off-by-one (first CF a year late) silently understates IRR.
6. **Cash-on-cash år N** = kontantstrøm år N / EK. **DPI år N** = Σ kontantstrøm år 1..N / EK
   (excl. exit). **MoE** = (Σ CF + netto exit) / EK. Report 3/5/10 år.
7. **WAULT** leievektet fra t0, both uten og inkl. opsjoner. **Utløpsprofil**: per year, NOK and
   % av leie, akkumulert, uten og inkl. opsjoner (+ chart).
8. **Tenant non-renewal scenario** (e.g. offentlig leietaker uten opsjon): scenario A re-let;
   scenario B fraflytting → alternativ bruk/seksjonssalg. Boligdel at exit has three states:
   *Utleid* (exit before expiry: value = A-value − MAX(0, leieverdi bolig − residual etter skatt),
   i.e. a true downside), *Ledig* (næring + residual etter skatt), *Solgt* (næring only; sale
   proceeds already in CF, remaining saldo share = 1 − boligandel). B must equal A before expiry.
9. **Residual value is decomposed, never a blanket discount factor**: market price/kvm
   (comparables, cross-checked with district statistics), REQ's own price/kvm (separate input),
   derived discount, capex/kvm to sellable standard, salgskost. Also show **implied price/kvm
   for the block in the purchase** = (kjøpspris − verdi øvrige blokker) / areal vs. market —
   the deck's "residualrisiko/nedsidebeskyttelse" line.

10. **Belånt**: interest on average balance × (NIBOR_year + margin); quarterly amortisation from
   første avdragsdato; restgjeld (bank, capex-lån, selgerkreditt) repaid at exit; tax on
   EBITDA − renter − avskrivninger with loss carry-forward. Show ubelånt and belånt returns.
11. **Utbyttefordeling**: gross deal returns vs. net investor returns after management fee and
   carried interest per SHA 10.2 (8 % pref, catch-up, 80/20); JV promote only with a partner.

## Sensitivities

Minimum grids (5×5, base in centre, steps as inputs): IRR KPI × exit yield (deck standard),
IRR kjøpspris × exit yield, MoE KPI × exit yield, plus one case-specific operational grid (e.g.
boligpris/kvm × oppussingscapex in scenario B). **Do not use Excel Data Tables** (openpyxl can't
create them and LibreOffice won't recalc them): build a Sens-motor with one explicit CF/exit
timeline per grid cell (full CF blocks per KPI value; linear adjustments for price/AM/debt;
replace only affected lines for scenario-B inputs). Grid centre must equal Returns (checked).
Belånt profile adds: IRR levered NIBOR/margin × exit yield and LTV × exit yield (interest and
amortisation recomputed per cell), plus value-add grids in `references/value-add.md`.

## Model checks (Overview, shown on Sammendrag)

Kilder = anvendelse · brutto leie år 1 = rent roll × KPI-steg · A = B før utløp · utløpsprofil
= total leie · leieandeler = 100 % · each sensitivity grid centre = Returns. Belånt adds: all
debt repaid at exit · no negative cash (udekket finansieringsbehov) · covenants per year
(LTV, ICR) · waterfall: net investor + carry + fee = gross distributions. Status cells with
OK/SJEKK conditional format; overall `ModellOK` shown in the Sammendrag footer.

## Build & QA workflow

1. Read `/mnt/skills/public/xlsx/SKILL.md`; build with openpyxl using `scripts/req_style.py`.
   Prefer a fresh scripted build over patching an old workbook (patches drift, row refs break).
2. Recalc with `/mnt/skills/public/xlsx/scripts/recalc.py` → zero errors.
3. Read back key values; sanity-check against the deck/one-pager and explain every gap in the
   Sammendrag "Avstemming mot pipeline deck" table.
4. Render (`soffice --headless --convert-to pdf`, `pdftoppm -r 80..160`) and *look* at
   Sammendrag, CF, Returns, Sensitivities: no `###`, no clipped labels, no overlapping charts.
5. Tell the user what changed vs. previous version and which inputs are still `Foreløpig`.

## Conventions

Norwegian labels. NOK formats: `#,##0` (detail), `#,##0.0,,"m"` (MNOK on dashboards),
negatives in parentheses, zero as "–". Live text on dashboards uses `FIXED()` not `TEXT()`
(TEXT format codes are locale-dependent in Norwegian Excel). Font colours: blue input, black
calc, green cross-sheet link. If asked for a quick estimate, state explicitly what was omitted.
