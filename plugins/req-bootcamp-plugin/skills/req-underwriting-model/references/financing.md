# Finansiering – belånte case (REQ Real Estate Fund)

Mirrors the Financing tab in REQ's template (Crunched_Test / Grønland 1 / Augustin). All terms
are inputs on Overview; the Financing tab only calculates.

## Inputs (defaults = REQ standard, override per case)
| Input | Default | Note |
|---|---|---|
| LTV ved kjøp (bank) | 60 % | Of kjøpspris (GAV). Or loan amount directly. |
| Margin | 2,00 % | Input cell per tranche |
| Forward 3M NIBOR per år | curve table | Year → rate, with "sist oppdatert" date. Never a single flat rate for belånt case. |
| Avdrag p.a. | 2 % of opprinnelig lån | Paid quarterly (1/4 per quarter) |
| Avdragsfri periode | input (mnd) | First avdragsdato = EDATE(t0, mnd). 0 = from first quarter. |
| Etableringskost | 0,3–0,5 % | Of loan, paid at drawdown (t0 use of funds) |
| Innskuddsrente | 0,25 % | On cash balance |
| Refinansiering | per year: amount or target LTV | Additional debt + establishment fee; cash-out to equity |
| Tranche 2 / capex-lån | LTC %, margin, avdrag, start | For rehab/nybygg: drawn after equity (EK først) |
| Selgerkreditt | amount or % of kjøpspris | See below |
| Rentesikring (optional) | swap-andel, fastrente, løpetid | All-in rate = andel × swap + (1 − andel) × NIBOR + margin |

## Calculations (annual CF, quarterly amortisation helper)
- Interest per tranche = average(opening, closing balance) × (NIBOR_year + margin) × YEARFRAC(period).
- Amortisation: quarterly dates from t0; amount = avdrag% × opprinnelig lån / 4 if date ≥ første
  avdragsdato; annual sum via SUMIF on year. Cap at outstanding balance.
- Capex/rehab/newbuild loans: equity-first monthly helper — cumulative cost drawn from equity
  until equity share (cost × (1 − LTC)) is used, then from loan; amortisation starts at completion.
- Restgjeld repaid from exit proceeds (bank loans, seller credit, capex loans).
- Loan establishment on refinancing/capex loans is an opex line in CF (as in template).

## Selgerkreditt (seller credit)
Inputs: beløp (or % of kjøpspris), rente (fixed), rentebetaling (løpende / kapitalisert-PIK),
forfall (dato), avdrag (default bullet), rangering (junior to bank).
- Sources & uses: kjøpspris financed by bank + selgerkreditt + egenkapital → reduces equity t0.
- PIK: balance grows by rate × YEARFRAC; no cash interest. Løpende: cash interest in CF.
- Repaid at earliest of forfall or exit (or refinanced – flag refinancing need at forfall).
- Show **bank-LTV** and **total LTV (bank + selgerkreditt)** separately. Interest is tax-deductible.

## Tax with debt
Skattemessig resultat = EBITDA − renter (bank + selgerkreditt, incl. PIK) − avskrivninger −
fradragsberettiget capex. Løpende skatt = 22 % × MAX(0, resultat − fremførbart underskudd);
underskudd carried forward. Flag (note, don't model unless asked) rentebegrensningsregelen
(net interest above 30 % of skattemessig EBITDA, subject to threshold amounts).

## KPIs and covenants (per year, on Financing tab and Sammendrag)
LTV (gjeld / verdi = NOI / exit yield per year), LTC (capex cases), ICR = EBITDA / renter,
DSCR = EBITDA / (renter + avdrag), debt yield = NOI / gjeld, all-in rente, gjeld ved exit,
peak equity. Covenant inputs (e.g. LTV ≤ 65–70 %, ICR ≥ 1,5–2,0x) → per-year headroom and
OK/BRUDD flag feeding model checks.

## Sensitivities (levered)
IRR levered: NIBOR-skift × exit yield · margin × exit yield · LTV × exit yield. In the
Sens-motor, interest and amortisation must be recomputed per cell (not scaled) when rates move.
