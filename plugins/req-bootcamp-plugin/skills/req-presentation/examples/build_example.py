"""Example REQ results presentation — exercises every chart type in the skill.

Run:  python3 build_example.py
Produces REQ-resultatpresentasjon-eksempel.pptx next to this file.
All numbers are fictional, for demonstration.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from req_deck import ReqDeck

HERE = os.path.dirname(os.path.abspath(__file__))

deck = ReqDeck("REQ Global Compounders — Resultater Q2 2026",
               "Investoroppdatering · 2. kvartal 2026")

deck.section("Kvartalet i tall")

deck.kpi("Hovedtall per 30.06.2026", [
    ("+4,2 %", "Avkastning i kvartalet"),
    ("+11,8 %", "Hittil i år"),
    ("18", "Selskaper i porteføljen"),
    ("1,24 mrd", "Forvaltet kapital (NOK)"),
], source="Alle tall er illustrasjon. Kilde: REQ.")

deck.chart_line(
    "Avkastning slår referanseindeksen",
    ["Q3-24", "Q4-24", "Q1-25", "Q2-25", "Q3-25", "Q4-25", "Q1-26", "Q2-26"],
    {
        "REQ Global Compounders": [0, 3.1, 7.8, 6.2, 10.4, 14.1, 18.9, 24.0],
        "MSCI World": [0, 2.2, 4.9, 3.1, 6.0, 8.4, 10.1, 12.6],
    },
    source="Akkumulert avkastning, indeksert til 0 ved start. Illustrasjon.")

deck.chart_bars(
    "Kvartalsvis avkastning",
    ["Q3-24", "Q4-24", "Q1-25", "Q2-25", "Q3-25", "Q4-25", "Q1-26", "Q2-26"],
    [3.1, 4.6, 4.6, -1.5, 3.9, 3.4, 4.2, 4.2],
    source="Avkastning per kvartal. Tap vises i rødt. Illustrasjon.")

deck.chart_waterfall(
    "Utvikling i forvaltet kapital (mNOK)",
    ["Tegning", "Avkastning", "Innløsning"],
    [180, 96, -55],
    start=1020, unit="",
    source="Bro fra inngående til utgående kapital i kvartalet. Illustrasjon.")

deck.chart_donut(
    "Sektorallokering",
    ["Teknologi", "Helse", "Industri", "Forbruk", "Finans"],
    [34, 22, 18, 15, 11],
    center="18\nselskaper",
    source="Andel av forvaltet kapital per 30.06.2026. Illustrasjon.")

deck.content("Slik leser vi kvartalet", [
    "Avkastningen på 4,2 % kom fra organisk vekst i kjerneposisjonene, ikke multippelekspansjon.",
    "Én posisjon skuffet på marginer (−140 bps) — vi diagnostiserer det åpent i teksten.",
    "Netto tegning på 125 mNOK styrker handlingsrommet inn i andre halvår.",
], footer="REQ · Global Compounders")

deck.closing()
out = deck.save(os.path.join(HERE, "REQ-resultatpresentasjon-eksempel.pptx"))
print("wrote", out)
