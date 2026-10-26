# Endringslogg

## v1.1 – 23.10.2026
**Begge fond**
- Kjøpesumsberegning som egen seksjon «2b · Kjøpesum og egenkapital» på Overview, rett under
  kjøpsinputene, og som egen blokk i Sammendrag: eiendomsverdi → hvert tillegg/fradrag på egen
  linje → kjøpesum → transaksjonskostnader → total investering → lån → egenkapital.
- Nytt input «Øvrige tillegg/(fradrag) i kjøpesum» (leierabatter, prisavslag, arbeidskapital).
- Eierkost vises også som NOK/kvm (år 1).
- Avkastningsbro (fossefall) i Sammendrag: egenkapital → drift → renter → skatt → verdiendring →
  skatteulempe/justeringer → transaksjonskost → totalt utbetalt. Ny modellkontroll.
- Sammendrag: graf-raden er IRR | utløpsprofil | kjøpesum (MoE kun i tabellen).

**REIF (Evergreen)**
- Kjøpshonorar REQ iht. mandat: 1 % av eiendomsverdi, eget input, inngår i egenkapitalen.

**RREF (Real Estate Fund)**
- Ingen AM-kostnad (honorar på fondsnivå) og ingen capex-lekkasje (capex modelleres eksplisitt).

Referansetall Aslakveien 18 (A · lang): REIF 6,4 % / 1,68x · RREF belånt brutto 7,8 % / 1,66x.

## v1.0 – 30.09.2026
Første teamversjon: fondsprofiler (REIF/RREF), finansiering med selgerkreditt og covenants,
SHA-waterfall, REQ visuell standard, referansebygg Aslakveien 18.
