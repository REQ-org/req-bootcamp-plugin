# Utbyttefordeling – fond (SHA) og JV (gevinstdeling)

## A. REQ Fund II SHA pkt 10.2 (Allocation Principle) – fund level
1. 100 % to Ordinary Shares until (i) drawn capital repaid and (ii) 8 % p.a. preferred return,
   compounded 31.12, on drawn capital.
2. 100 % to Founder Shares until its own invested capital (+ its performance) is repaid.
3. Catch-up 50/50 until Founder has received 20 % of all distributions in excess of capital
   repayments (i.e. 20 % of total profit).
4. Thereafter 80 / 20 (investors / founder).
Management fee (pkt 14.3): 1,6 % p.a. of drawn, unrealised capital (Employed Capital);
1,0 % of uncalled capital during the investment period. Founder contribution 1 % of
commitments (min. MNOK 5). Clawback at Time of Assessment → end-of-life calculation is valid.

### Deal-level implementation (illustrative "net to investor")
Treat the deal as the fund; founder capital pari passu (input share, default 1 %).
Per year: hurdle account `Open`, `Required = Open × 8 % × YEARFRAC`, `+ Contributions`,
`− Distributions`, `Close = MAX(0, Open + Required + Contrib − Distrib)`; excess `E` = cash
distributed after the account is cleared. Total pref paid `P = ΣDistrib − ΣContrib − E`.
Catch-up tier size = `P × carry / (catch-up% − carry)` = P × 0,2 / 0,3.
Carry = `50 % × MIN(E, tier) + 20 % × MAX(0, E − tier)`, deducted from the final distribution.
Management fee = 1,6 % × drawn, unrealised equity per year, deducted from investor CF.
Report **gross deal IRR/MoE** (before fee and carry) and **net investor IRR/MoE** side by side,
and state that the fund-level waterfall is applied at deal level as an illustration.

## B. JV gevinstdeling (template tab "Gevinstdeling")
Inputs: ownership split (e.g. REQ 92,5 % / partner 7,5 %), IRR hurdles (e.g. 8 % and 11 %),
skjevdeling per tier (e.g. 20 % and 40 % of excess to the partner).
Per tier: hurdle account on total equity (as above, tier hurdle rate) → excess above tier →
promote = skjevdeling × excess (incremental between tiers). Output per party: equity in,
equity out, IRR, MoE, and "REQ avgivelse" (value transferred via promote). Include only when
there is a JV partner.
