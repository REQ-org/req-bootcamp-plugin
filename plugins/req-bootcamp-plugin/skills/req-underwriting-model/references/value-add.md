# Value-add: ledighet, underleie, rehab og utvikling

Mirrors the Rent roll blocks in REQ's template: Rent as-is · Rent free · Market rent ·
Market rent 2 · TI's · Letting fees, plus the Overview project modules (Rehab, Newbuild 1/2).

## Rent roll per unit (in addition to the core columns)
- **Rent free**: RF1–RF3 amounts with year (negative CF line, not NOI-neutral: reduces gross rent).
- **Market rent 1** (after expiry or for vacant units): 1st rent/kvm, vacant months, start =
  EDATE(expiry, vacant months), lease length (years) → expiry 2. Vacant units: annual rent 0,
  expiry = t0, so lease-up follows the same logic.
- **Market rent 2**: 2nd rent/kvm from expiry 2 (hold periods beyond first re-let).
- **TI / capex per kvm**: 1st capex/kvm in re-let year (triggered when market rent > contract
  rent, or input), 2nd capex/kvm at 2nd re-let.
- **Letting fees**: % × first-year rent at each new lease (template: 6 %).
- Keep **mark-to-market** columns: contract rent vs. market rent (NOK and %) per unit and total
  → reversionary potential; **reversionary yield** = market rent net of eierkost / kjøpspris.
- Report ledighet both **økonomisk** (rent-weighted, vs. market rent) and **areal**.
- Non-deductible VAT: if the property is not fully VAT-registered, gross up costs (eierkost,
  TI, letting fees) by 1,25 / (1 + 0,25 × MVA-andel), as in the template.

## Rehab / utvikling modules (Overview inputs, one block per project)
Area, start (1st of month), length (months), completion = EDATE(start, length), cost/kvm
(indexed with cumulative KPI to start year), rent/kvm at completion (indexed), LTC %, 1st
amortisation (= completion unless input), amortisation %, establishment fee, invested equity =
cost × (1 − LTC), equity paid-in date. Monthly draw helper (EK først, deretter lån); rent starts
at completion (optionally after lease-up months). If the property is bought vacant with a
signed tenant (e.g. hotel), rent start = completion + any rent-free per lease.

## Cost lines in RREF
No AM-kostnad (fee is charged at fund level, SHA 14.3) and no capex-lekkasje (capex is explicit:
TI/re-letting per unit and rehab/utvikling modules). Eierkost stays % av leie, shown also as NOK/kvm.

## Returns and KPIs for value-add
Exit on **stabilised** annualised NOI (N+1). Exit yield may differ from entry yield — input
Δ with rationale. Show: yield on cost (stabilised NOI / (kjøpspris + capex)), development
margin / profit on cost, value-add bridge (kjøpspris → capex → verdiøkning → exit-verdi),
peak equity and months to stabilisation. The avkastningsbro (SKILL.md rule 12) is required on Sammendrag. Sensitivities: markedsleie × ledighetsmåneder,
kostnadsoverskridelse × exit yield, byggetid × markedsleie.
