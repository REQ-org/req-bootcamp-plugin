from build_part2 import *

# =====================================================================================
# CHART HELPERS
# =====================================================================================
def _txt(sz=800, color="404040", bold=False):
    return RichText(p=[Paragraph(pPr=ParagraphProperties(defRPr=CharacterProperties(sz=sz, b=bold, solidFill=color)),
                                 endParaRPr=CharacterProperties(sz=sz))])

def anchor(chart, c0, r0, c1, r1):
    a = TwoCellAnchor()
    a._from = AnchorMarker(col=ci(c0) - 1, colOff=0, row=r0 - 1, rowOff=0)
    a.to = AnchorMarker(col=ci(c1), colOff=0, row=r1, rowOff=0)
    chart.anchor = a

def bar(ws, cats, series, numfmt, area, gap=60, labels=True, legend=True, ymax=None):
    ch = BarChart(); ch.type = "col"; ch.grouping = "clustered"; ch.gapWidth = gap; ch.overlap = -5
    for ref, title, color in series:
        s = Series(ref, title=title)
        s.graphicalProperties.solidFill = color
        s.graphicalProperties.line.noFill = True
        ch.series.append(s)
    ch.set_categories(cats)
    ch.title = None; ch.style = 2
    ch.y_axis.numFmt = numfmt; ch.y_axis.scaling.min = 0
    if ymax: ch.y_axis.scaling.max = ymax
    ch.y_axis.majorGridlines.spPr = GraphicalProperties(ln=LineProperties(solidFill="E6E6E6"))
    ch.y_axis.spPr = GraphicalProperties(ln=LineProperties(noFill=True))
    ch.x_axis.spPr = GraphicalProperties(ln=LineProperties(solidFill="BFBFBF"))
    ch.x_axis.delete = False; ch.y_axis.delete = False
    ch.x_axis.txPr = _txt(800); ch.y_axis.txPr = _txt(750, "7F7F7F")
    ch.x_axis.majorTickMark = "none"; ch.y_axis.majorTickMark = "none"
    if legend:
        ch.legend.position = "t"; ch.legend.txPr = _txt(800)
    else:
        ch.legend = None
    if labels:
        ch.dataLabels = DataLabelList(); ch.dataLabels.showVal = True
        ch.dataLabels.showSerName = ch.dataLabels.showCatName = ch.dataLabels.showLegendKey = False
        ch.dataLabels.numFmt = numfmt; ch.dataLabels.dLblPos = "inEnd"; ch.dataLabels.txPr = _txt(750, "FFFFFF", True)
    try:
        ch.graphical_properties = GraphicalProperties(ln=LineProperties(noFill=True))
    except Exception:
        pass
    anchor(ch, *area)
    ws.add_chart(ch)
    return ch

# =====================================================================================
# SENSITIVITIES (user-facing) – step inputs first, grids linked to engine below
# =====================================================================================
se = S["Sensitivities"]
setup(se, {"A": 2, "B": 30, **{c: 11 for c in "CDEFG"}, "H": 3, "I": 30, **{c: 11 for c in "JKLMN"}, "O": 2}, zoom=90)
banner(se, "SENSITIVITIES · IRR OG MoE PÅ EGENKAPITAL", "Full omregning av kontantstrøm og exit per celle (Sens-motor) · lang holdeperiode · base case uthevet", "B", "N")
section(se, 5, "B", "G", "Steg i sensitivitetene")
steps = [("Steg KPI p.a.", 0.005, F_PCT2, "StegKPI"), ("Steg exit yield", 0.0025, F_PCT2, "StegYield"),
         ("Steg kjøpspris", 5_000_000, F_NOK, "StegPris"), ("Steg egen boligpris/kvm", 0.10, F_PCT, "StegBolig"),
         ("Steg oppussingscapex (kr/kvm)", 2_500, F_NOK, "StegCapex"), ("Steg margin", 0.0025, F_PCT2, "StegMargin"),
         ("Steg LTV", 0.05, F_PCT, "StegLTV")]
for j, (lab, v, fmt, nm_) in enumerate(steps):
    put(se, f"B{6+j}", lab, "label"); put(se, f"C{6+j}", v, "input", fmt); name(wb, nm_, "Sensitivities", f"C{6+j}")
line_rows(se, 6, 12, "B", "C")
put(se, "I6", "Hver celle beregnes med egen kontantstrømserie (ingen Excel-datatabell) – oppdateres automatisk.", "note")
put(se, "I7", "Grid 1/2/4: scenario A. Grid 3: scenario B (seksjonssalg). Kjøpspris-grid endrer EK, skatteulempe, AM og lån.", "note")
put(se, "I8", "Base case i midten av hvert grid samsvarer med Returns (se Overview · Modellkontroller).", "note")

# =====================================================================================
# SENS ENGINE
# =====================================================================================
sm = S["Sens-motor"]
ts_setup(sm, "SENS-MOTOR · BEREGNINGSGRUNNLAG FOR SENSITIVITETER", "Teknisk ark – ikke rediger. KPI-blokker (full CF) og IRR-kjøringer per grid-celle.")
TL = [get_column_letter(ci("Q") + k) for k in range(11)]   # Q = t0, R..AA = year 1..10
for k, col in enumerate(TL):
    sm.column_dimensions[col].width = 11
    put(sm, f"{col}5", "t0" if k == 0 else k, "text", bold=True, align="right")
    put(sm, f"{col}6", "=Start" if k == 0 else f"=DATE(YEAR(Start)+{k}-1,12,31)", "calc", F_DATE)
for col in ["AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK"]:
    sm.column_dimensions[col].width = 13
sm.column_dimensions["P"].width = 3

section(sm, 8, "B", "O", "Grid 1 · KPI-verdier (scenario A)")
for i in range(5):
    put(sm, f"B{9+i}", f"KPI-verdi {i+1}", "label"); put(sm, f"C{9+i}", f"=KPI+StegKPI*({i}-2)", "calc", F_PCT2)
blocks = []
top = 15
for i in range(5):
    blk = write_block(sm, top, "A", f"$C${9+i}", f"KPI-blokk {i+1} · scenario A")
    blocks.append(blk); top = blk["end"] + 2

def tl_row(r, fn_year):
    for k in range(11):
        col = TL[k]
        put(sm, f"{col}{r}", fn_year(k, col), "calc", F_NOK)

G = {}
# ---- Grid 1 (and grid 4 MoE): KPI × exit yield
r0 = top + 1
section(sm, r0, "B", "AH", "Grid 1/4 · KPI × exit yield · scenario A")
header_row(sm, r0 + 1, "B", "D", ["Kjøring", "KPI", "Exit yield"])
for col, lab in zip(["AB", "AC", "AD", "AE", "AF", "AG", "AH"], ["Exit-verdi", "Skatteulempe", "Divestment", "Restgjeld", "Netto exit", "IRR", "MoE"]):
    put(sm, f"{col}{r0+1}", lab, "text", bold=True, align="right")
r = r0 + 2
G[1], G[4] = {}, {}
for i in range(5):
    for j in range(5):
        blk = blocks[i]
        put(sm, f"B{r}", f"KPI {i+1} · yield {j+1}", "label")
        put(sm, f"C{r}", f"=$C${9+i}", "calc", F_PCT2); put(sm, f"D{r}", f"=ExitYield+StegYield*({j}-2)", "calc", F_PCT2)
        tl_row(r, lambda k, col: "=-Egenkapital" if k == 0 else
               f"=IF({k}<=ExitLang,INDEX($E${blk['cfe']}:$O${blk['cfe']},{k})+IF({k}=ExitLang,$AF{r},0),0)")
        put(sm, f"AB{r}", f"=INDEX($E${blk['rrnoi']}:$O${blk['rrnoi']},ExitLang+1)/D{r}", "calc", F_NOK)
        put(sm, f"AC{r}", f"=-SUsats*MAX(0,AB{r}-INDEX('Tax accounts'!$E$16:$O$16,ExitLang)-TomtPct*AB{r})", "calc", F_NOK)
        put(sm, f"AD{r}", f"=-Divest*AB{r}", "calc", F_NOK)
        put(sm, f"AE{r}", "=-INDEX(Financing!$E$27:$O$27,ExitLang)", "calc", F_NOK)
        put(sm, f"AF{r}", f"=SUM(AB{r}:AE{r})", "calc", F_NOK)
        put(sm, f"AG{r}", f"=XIRR(Q{r}:AA{r},$Q$6:$AA$6)", "calc", F_PCT)
        put(sm, f"AH{r}", f"=SUM(R{r}:AA{r})/-Q{r}", "calc", F_X)
        G[1][(i, j)] = f"'Sens-motor'!AG{r}"; G[4][(i, j)] = f"'Sens-motor'!AH{r}"
        r += 1

# ---- Grid 2: kjøpspris × exit yield (scenario A)
r0 = r + 2
section(sm, r0, "B", "AH", "Grid 2 · Kjøpspris × exit yield · scenario A")
header_row(sm, r0 + 1, "B", "D", ["Kjøring", "Kjøpspris", "Exit yield"])
r = r0 + 2; G[2] = {}
for i in range(5):
    for j in range(5):
        put(sm, f"B{r}", f"Pris {i+1} · yield {j+1}", "label")
        put(sm, f"C{r}", f"=Kjopspris+StegPris*({i}-2)", "calc", F_NOK); put(sm, f"D{r}", f"=ExitYield+StegYield*({j}-2)", "calc", F_PCT2)
        sc = f"IF(LTV=0,1,$C{r}/Kjopspris)"
        tf = lambda k: f"IF(INDEX(CF!$E${A['skatt']}:$O${A['skatt']},{k})<0,1-SkattLop,1)"
        tl_row(r, lambda k, col: f"=-($C{r}-SUsats*MAX(0,$C{r}-SaldoBygg-SaldoTek-TomtPct*$C{r})+DDSPA+WC+Megler+(EtabKost-1)*LTV*$C{r}-SKBelop)" if k == 0 else
               f"=IF({k}<=ExitLang,INDEX(CF!$E${A['cfe']}:$O${A['cfe']},{k})+(-AMpct*($C{r}-Kjopspris)+INDEX(Financing!$E$14:$O$14,{k})*({sc}-1))*{tf(k)}"
               f"+INDEX(Financing!$E$12:$O$12,{k})*({sc}-1)+IF({k}=ExitLang,$AF{r},0),0)")
        put(sm, f"AB{r}", f"=INDEX(CF!$E${A['rrnoi']}:$O${A['rrnoi']},ExitLang+1)/D{r}", "calc", F_NOK)
        put(sm, f"AC{r}", f"=-SUsats*MAX(0,AB{r}-INDEX('Tax accounts'!$E$16:$O$16,ExitLang)-TomtPct*AB{r})", "calc", F_NOK)
        put(sm, f"AD{r}", f"=-Divest*AB{r}", "calc", F_NOK)
        put(sm, f"AE{r}", f"=-(INDEX(Financing!$E$13:$O$13,ExitLang)*{sc}+INDEX(Financing!$E$20:$O$20,ExitLang))", "calc", F_NOK)
        put(sm, f"AF{r}", f"=SUM(AB{r}:AE{r})", "calc", F_NOK)
        put(sm, f"AG{r}", f"=XIRR(Q{r}:AA{r},$Q$6:$AA$6)", "calc", F_PCT)
        G[2][(i, j)] = f"'Sens-motor'!AG{r}"
        r += 1

# ---- Grid 3: egen boligpris × oppussingscapex (scenario B)
r0 = r + 2
section(sm, r0, "B", "AK", "Grid 3 · Egen boligpris/kvm × oppussingscapex/kvm · scenario B")
header_row(sm, r0 + 1, "B", "D", ["Kjøring", "Pris/kvm", "Capex/kvm"])
for col, lab in zip(["AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ"],
                    ["Brutto salg", "Capex nom.", "Netto proveny", "Exit-verdi", "Skatteulempe", "Divestment", "Restgjeld", "Netto exit", "IRR"]):
    put(sm, f"{col}{r0+1}", lab, "text", bold=True, align="right")
r = r0 + 2; G[3] = {}
sold_before_exit = "SalgDato<=DATE(YEAR(Start)+ExitLang-1,12,31)"
for i in range(5):
    for j in range(5):
        put(sm, f"B{r}", f"Boligpris {i+1} · capex {j+1}", "label")
        put(sm, f"C{r}", f"=EgenKvm*(1+StegBolig*({i}-2))", "calc", F_NOK); put(sm, f"D{r}", f"=MAX(0,CapexKvm+StegCapex*({j}-2))", "calc", F_NOK)
        put(sm, f"AB{r}", f"=($C{r}*ArealSalg+PPlasser*PVerdi)*(1+BoligVekst)^(SalgAar-(YEAR(Start)-1))", "calc", F_NOK)
        put(sm, f"AC{r}", f"=$D{r}*ArealSalg*IdxUtlop", "calc", F_NOK)
        put(sm, f"AD{r}", f"=AB{r}*(1-SalgKost)-SkattSeksjon*MAX(0,AB{r}*(1-SalgKost)-SaldoSalg-TomtSkatt*BoligAndel-AC{r})", "calc", F_NOK)
        rp = (f"(($C{r}*ArealSalg+PPlasser*PVerdi)*(1+BoligVekst)^(ExitLang)*(1-SalgKost)-$D{r}*ArealSalg*(1+KPIstart)*(1+KPI)^(ExitLang-1))")
        ratx = f"({rp}-SkattSeksjon*MAX(0,{rp}-INDEX('Tax accounts'!$E$16:$O$16,ExitLang)*BoligAndel-TomtSkatt*BoligAndel))"
        exd = "DATE(YEAR(Start)+ExitLang-1,12,31)"
        put(sm, f"AE{r}", (f"=IF({sold_before_exit},INDEX(CF!$E${Bk['rrnoin']}:$O${Bk['rrnoin']},ExitLang+1)/YieldNaering,"
                           f"IF({exd}>=OKUtlop,INDEX(CF!$E${Bk['rrnoin']}:$O${Bk['rrnoin']},ExitLang+1)/YieldNaering+{ratx},"
                           f"INDEX(CF!$E${A['rrnoi']}:$O${A['rrnoi']},ExitLang+1)/ExitYield-MAX(0,INDEX(CF!$E${A['rrnoib']}:$O${A['rrnoib']},ExitLang+1)/ExitYield-{ratx})))"), "calc", F_NOK)
        put(sm, f"AF{r}", f"=-SUsats*MAX(0,AE{r}-INDEX('Tax accounts'!$E$16:$O$16,ExitLang)*IF({sold_before_exit},1-BoligAndel,1)-TomtPct*AE{r})", "calc", F_NOK)
        put(sm, f"AG{r}", f"=-Divest*AE{r}", "calc", F_NOK)
        put(sm, f"AH{r}", "=-INDEX(Financing!$E$27:$O$27,ExitLang)", "calc", F_NOK)
        put(sm, f"AI{r}", f"=SUM(AE{r}:AH{r})", "calc", F_NOK)
        tl_row(r, lambda k, col: "=-Egenkapital" if k == 0 else
               (f"=IF({k}<=ExitLang,INDEX(CF!$E${Bk['cfe']}:$O${Bk['cfe']},{k})"
                f"+IF(YEAR({col}$6)=YEAR(OKUtlop),OppussNom-$AC{r},0)+IF(YEAR({col}$6)=SalgAar,$AD{r}-SeksjonProveny,0)"
                f"+IF({k}=ExitLang,$AI{r},0),0)"))
        put(sm, f"AJ{r}", f"=XIRR(Q{r}:AA{r},$Q$6:$AA$6)", "calc", F_PCT)
        G[3][(i, j)] = f"'Sens-motor'!AJ{r}"
        r += 1

if REFP:
    for key, title, rowlab, rowexpr in [(5, "Grid 5 · Margin × exit yield · scenario A", "Margin", "=Margin+StegMargin*({i}-2)"),
                                        (6, "Grid 6 · LTV × exit yield · scenario A", "LTV", "=MAX(0,LTV+StegLTV*({i}-2))")]:
        r0 = r + 2
        section(sm, r0, "B", "AH", title)
        header_row(sm, r0 + 1, "B", "D", ["Kjøring", rowlab, "Exit yield"])
        r = r0 + 2; G[key] = {}
        for i in range(5):
            for j in range(5):
                put(sm, f"B{r}", f"{rowlab} {i+1} · yield {j+1}", "label")
                put(sm, f"C{r}", rowexpr.format(i=i), "calc", F_PCT2); put(sm, f"D{r}", f"=ExitYield+StegYield*({j}-2)", "calc", F_PCT2)
                tf = lambda k: f"IF(INDEX(CF!$E${A['skatt']}:$O${A['skatt']},{k})<0,1-SkattLop,1)"
                if key == 5:
                    t0 = "=-Egenkapital"
                    yr = lambda k: (f"=IF({k}<=ExitLang,INDEX(CF!$E${A['cfe']}:$O${A['cfe']},{k})-(INDEX(Financing!$E$11:$O$11,{k})+INDEX(Financing!$E$13:$O$13,{k}))/2*($C{r}-Margin)*{tf(k)}"
                                    f"+IF({k}=ExitLang,$AF{r},0),0)")
                    debt = "=-INDEX(Financing!$E$27:$O$27,ExitLang)"
                else:
                    s = f"IF(LTV=0,0,$C{r}/LTV)"
                    t0 = f"=-(Kjopspris-SkatteulempeInn+DDSPA+WC+Megler+(EtabKost-1)*$C{r}*Kjopspris-SKBelop)"
                    yr = lambda k, s=s: (f"=IF({k}<=ExitLang,INDEX(CF!$E${A['cfe']}:$O${A['cfe']},{k})+INDEX(Financing!$E$14:$O$14,{k})*({s}-1)*{tf(k)}"
                                         f"+INDEX(Financing!$E$12:$O$12,{k})*({s}-1)+IF({k}=ExitLang,$AF{r},0),0)")
                    debt = f"=-(INDEX(Financing!$E$13:$O$13,ExitLang)*{s}+INDEX(Financing!$E$20:$O$20,ExitLang))"
                tl_row(r, lambda k, col: t0 if k == 0 else yr(k))
                put(sm, f"AB{r}", f"=INDEX(CF!$E${A['rrnoi']}:$O${A['rrnoi']},ExitLang+1)/D{r}", "calc", F_NOK)
                put(sm, f"AC{r}", f"=-SUsats*MAX(0,AB{r}-INDEX('Tax accounts'!$E$16:$O$16,ExitLang)-TomtPct*AB{r})", "calc", F_NOK)
                put(sm, f"AD{r}", f"=-Divest*AB{r}", "calc", F_NOK)
                put(sm, f"AE{r}", debt, "calc", F_NOK)
                put(sm, f"AF{r}", f"=SUM(AB{r}:AE{r})", "calc", F_NOK)
                put(sm, f"AG{r}", f"=XIRR(Q{r}:AA{r},$Q$6:$AA$6)", "calc", F_PCT)
                G[key][(i, j)] = f"'Sens-motor'!AG{r}"
                r += 1

# ---- user-facing grids
def grid(r0, c_lab, c_first, title, note, row_axis, row_fmt, col_axis, col_fmt, key, fmt, corner):
    cols = [get_column_letter(ci(c_first) + j) for j in range(5)]
    section(se, r0, c_lab, cols[-1], title)
    put(se, f"{c_lab}{r0+1}", note, "note")
    header_row(se, r0 + 2, c_lab, cols[-1], [corner] + [None] * 5, height=22)
    for j, col in enumerate(cols):
        c = se[f"{col}{r0+2}"]; c.value = col_axis(j); c.number_format = col_fmt
    for i in range(5):
        rr_ = r0 + 3 + i
        c = se[f"{c_lab}{rr_}"]; c.value = row_axis(i); c.number_format = row_fmt
        c.font = Font(name=HEAD, size=9, bold=True, color=WHITE); c.fill = fill(DEEP)
        c.alignment = Alignment(horizontal="center")
        for j, col in enumerate(cols):
            cell = put(se, f"{col}{rr_}", f"={G[key][(i, j)]}", "calc", fmt, align="center")
            cell.border = Border(bottom=THIN, right=Side(style="thin", color="FFFFFF"))
            if i == 2 and j == 2:
                cell.font = Font(name=HEAD, size=9.5, bold=True, color=NAVY)
                cell.border = Border(left=Side(style="medium", color=NAVY), right=Side(style="medium", color=NAVY),
                                     top=Side(style="medium", color=NAVY), bottom=Side(style="medium", color=NAVY))
    se.conditional_formatting.add(f"{cols[0]}{r0+3}:{cols[-1]}{r0+7}",
                                  ColorScaleRule(start_type="min", start_color="FFFFFF", end_type="max", end_color="7FCBFF"))
    return {(i, j): f"{cols[j]}{r0+3+i}" for i in range(5) for j in range(5)}, f"{c_lab}{r0+2}"

SG = {}
SG[1] = grid(14, "B", "C", "Grid 1 · IRR · KPI × exit yield (A)", "Lang holdeperiode · rader: KPI p.a. · kolonner: exit yield",
             lambda i: f"=KPI+StegKPI*({i}-2)", '0.0%', lambda j: f"=ExitYield+StegYield*({j}-2)", '0.00%', 1, F_PCT, "KPI \\ exit")
SG[2] = grid(14, "I", "J", "Grid 2 · IRR · kjøpspris × exit yield (A)", "Rader: kjøpspris (MNOK) · kolonner: exit yield",
             lambda i: f"=Kjopspris+StegPris*({i}-2)", '#,##0,,"m"', lambda j: f"=ExitYield+StegYield*({j}-2)", '0.00%', 2, F_PCT, "Pris \\ exit")
SG[3] = grid(24, "B", "C", "Grid 3 · IRR · boligpris × oppussingscapex (B)", "Rader: egen pris/kvm · kolonner: capex/kvm (2026-kr)",
             lambda i: f"=EgenKvm*(1+StegBolig*({i}-2))", '#,##0', lambda j: f"=MAX(0,CapexKvm+StegCapex*({j}-2))", '#,##0', 3, F_PCT, "Pris \\ capex")
SG[4] = grid(24, "I", "J", "Grid 4 · MoE · KPI × exit yield (A)", "Lang holdeperiode · equity multiple",
             lambda i: f"=KPI+StegKPI*({i}-2)", '0.0%', lambda j: f"=ExitYield+StegYield*({j}-2)", '0.00%', 4, F_X, "KPI \\ exit")

if REFP:
    SG[5] = grid(34, "B", "C", "Grid 5 · IRR · margin × exit yield (A)", "Rader: margin over NIBOR · renter og skatt regnes om",
                 lambda i: f"=Margin+StegMargin*({i}-2)", '0.00%', lambda j: f"=ExitYield+StegYield*({j}-2)", '0.00%', 5, F_PCT, "Margin \\ exit")
    SG[6] = grid(34, "I", "J", "Grid 6 · IRR · LTV × exit yield (A)", "Rader: bank-LTV ved kjøp · EK, renter, avdrag og restgjeld regnes om",
                 lambda i: f"=MAX(0,LTV+StegLTV*({i}-2))", '0%', lambda j: f"=ExitYield+StegYield*({j}-2)", '0.00%', 6, F_PCT, "LTV \\ exit")

# =====================================================================================
# OVERVIEW – model checks
# =====================================================================================
r = R["ov_checks"]
section(ov, r, "B", "F", "11 · Modellkontroller"); r += 1
header_row(ov, r, "B", "F", ["Kontroll", "Avvik", "", "Status", "Beskrivelse"]); r += 1
chk0 = r
checks = [
    ("Kilder = anvendelse", f"=C{R['ov_uses']}-C{R['ov_src']}", 1, "Sum kilder lik sum anvendelse"),
    ("Brutto leie år 1 = rent roll × KPI-steg", f"=CF!E{A['gross']}-SUMPRODUCT('Rent roll'!F7:F11,1+KPIstart*'Rent roll'!H7:H11)", 1, "Ingen kontraktsutløp i år 1"),
    ("Scenario A = B før OK-utløp", f"=SUMPRODUCT((CF!$E$6:$O$6<YEAR(OKUtlop))*ABS(CF!$E${A['cfe']}:$O${A['cfe']}-CF!$E${Bk['cfe']}:$O${Bk['cfe']}))", 1, "Kontantstrøm lik frem til utløpsåret"),
    ("Utløpsprofil = total leie", f"='Rent roll'!C{R['rr_Esum']}-Leie2026", 1, "Alle kontrakter fanget i profilen"),
    ("Leieandeler = 100 %", f"='Rent roll'!N{R['rr_TT']}-1", 0.0001, ""),
    ("Sensitivitet grid 1 base = Returns (A · lang)", f"={G[1][(2,2)]}-Returns!E28", 0.00001, "Sens-motor gir samme IRR som Returns"),
    ("Sensitivitet grid 2 base = Returns (A · lang)", f"={G[2][(2,2)]}-Returns!E28", 0.00001, ""),
    ("Sensitivitet grid 3 base = Returns (B · lang)", f"={G[3][(2,2)]}-Returns!H28", 0.00001, ""),
] + ([("Sensitivitet grid 5 base = Returns (A · lang)", f"={G[5][(2,2)]}-Returns!E28", 0.00001, ""),
      ("Sensitivitet grid 6 base = Returns (A · lang)", f"={G[6][(2,2)]}-Returns!E28", 0.00001, ""),
      ("All gjeld innfridd ved exit (A · lang)", "=Returns!E21+GjeldExit", 1, "Restgjeld trukket fra exit-proveny"),
      ("Utbyttefordeling: netto + carry + honorar = brutto (A · lang)", "=Utbyttefordeling!L8", 1, "Waterfall summerer til brutto kontantstrøm")] if REFP else [])
for lab, f, tol, desc in checks:
    put(ov, f"B{r}", lab, "label"); put(ov, f"C{r}", f, "calc", '#,##0.00000;(#,##0.00000);"–"')
    put(ov, f"E{r}", f'=IF(ABS(C{r})<{tol},"OK","SJEKK")', "calc", align="center", bold=True)
    put(ov, f"F{r}", desc, "note"); r += 1
put(ov, f"B{r}", "Samlet status", "label", bold=True)
put(ov, f"E{r}", f'=IF(COUNTIF(E{chk0}:E{r-1},"OK")={len(checks)},"OK","SJEKK")', "calc", align="center", bold=True)
total_row(ov, r, "B", "F"); name(wb, "ModellOK", "Overview", f"E{r}")
line_rows(ov, chk0, r - 1, "B", "F")
ov.conditional_formatting.add(f"E{chk0}:E{r}", CellIsRule(operator="equal", formula=['"OK"'], font=Font(color="1E7B34", bold=True), fill=fill(PALEGRN)))
ov.conditional_formatting.add(f"E{chk0}:E{r}", CellIsRule(operator="equal", formula=['"SJEKK"'], font=Font(color="C00000", bold=True), fill=fill("FDE2E2")))

# =====================================================================================
# CHARTS ON DETAIL SHEETS
# =====================================================================================
E0, E1 = R["rr_E0"], R["rr_E1"]
bar(rr, Reference(rr, min_col=2, min_row=E0, max_row=E1),
    [(Reference(rr, min_col=4, min_row=E0, max_row=E1), "Uten opsjon", DEEP),
     (Reference(rr, min_col=7, min_row=E0, max_row=E1), "Inkl. opsjoner", BRIGHT)],
    '0%', ("J", R["rr_exp_sec"] + 1, "R", E1 + 2), gap=40, labels=False)
cfr = A["end"] if False else Bk["end"] + 2
section(cf, cfr, "B", "O", "NOI og kontantstrøm til egenkapital · år 1–10")
ch = BarChart()
bar(cf, Reference(cf, min_col=5, max_col=14, min_row=6),
    [(Reference(cf, min_col=5, max_col=14, min_row=A["noi"]), "NOI", "B7C3E0"),
     (Reference(cf, min_col=5, max_col=14, min_row=A["cfe"]), "Kontantstrøm til EK – A", DEEP),
     (Reference(cf, min_col=5, max_col=14, min_row=Bk["cfe"]), "Kontantstrøm til EK – B", BRIGHT)],
    '#,##0,,"m"', ("B", cfr + 1, "O", cfr + 20), gap=50, labels=False)

if REFP:
    wf = S["Utbyttefordeling"]
    setup(wf, {"A": 2, "B": 44, **{get_column_letter(3 + i): 12.5 for i in range(11)}, "N": 2, "O": 14}, zoom=90)
    banner(wf, "UTBYTTEFORDELING · SHA PKT 10.2 OG FORVALTNINGSHONORAR", "Fondsnivå-waterfall anvendt på caset som illustrasjon · 8 % pref (rentes rente 31.12) → catch-up 50/50 → 80/20 · founder-kapital pari passu", "B", "M")
    section(wf, 5, "B", "J", "Oppsummering")
    header_row(wf, 6, "B", "J", ["Case", "Brutto IRR", "Brutto MoE", "IRR etter honorar", "Netto IRR investor", "Netto MoE investor", "Carried interest", "Honorar totalt", "Kontroll"], height=30)
    blk0 = 16
    for n, lab in enumerate(labels):
        rs = 7 + n; t = blk0 + n * 13
        put(wf, f"B{rs}", f'="{lab} ("&Returns!{CC[n]}8&" år)"', "label", align="left")
        put(wf, f"C{rs}", f"=Returns!{CC[n]}28", "link", F_PCT); put(wf, f"D{rs}", f"=Returns!{CC[n]}29", "link", F_X)
        put(wf, f"E{rs}", f"=XIRR(C{t+3}:M{t+3},$C$15:$M$15)", "calc", F_PCT)
        put(wf, f"F{rs}", f"=XIRR(C{t+11}:M{t+11},$C$15:$M$15)", "calc", F_PCT, bold=True)
        put(wf, f"G{rs}", f"=SUM(D{t+11}:M{t+11})/-C{t+11}", "calc", F_X, bold=True)
        put(wf, f"H{rs}", f"=O{t+9}", "calc", F_NOK); put(wf, f"I{rs}", f"=-SUM(D{t+2}:M{t+2})", "calc", F_NOK)
        put(wf, f"J{rs}", f"=SUM(C{t+1}:M{t+1})-(SUM(C{t+11}:M{t+11})+H{rs}-SUM(D{t+2}:M{t+2}))", "calc", '#,##0;(#,##0);"–"')
    line_rows(wf, 7, 12, "B", "J")
    wf["C8"].value = wf["C8"].value  # keep
    # check cell used by Overview: A·lang is row 9 -> expose J9 at C8? use dedicated cell
    put(wf, "L7", "Kontroll A · lang", "note"); put(wf, "L8", "=J9", "calc", '#,##0;(#,##0);"–"')
    header_row(wf, 14, "B", "M", ["Periode", "t0"] + [str(k) for k in range(1, 11)])
    for k in range(1, 11): wf[f"{get_column_letter(3+k)}14"].value = k
    put(wf, "B15", "Dato", "label", bold=True); put(wf, "C15", "=Returns!C34", "link", F_DATE)
    for k in range(1, 11): put(wf, f"{get_column_letter(3+k)}15", f"=Returns!{get_column_letter(3+k)}34", "link", F_DATE)
    for n, lab in enumerate(labels):
        t = blk0 + n * 13; c = CC[n]; src = 35 + n
        section(wf, t, "B", "O", f"{lab}")
        rows = ["Brutto kontantstrøm til EK (deal)", "Forvaltningshonorar", "Kontantstrøm etter honorar (fond)", "Innskudd", "Utdeling",
                "Hurdle-konto IB", "Påløpt preferred return", "Hurdle-konto UB", "Utdeling utover kapital + pref", "Carried interest (ved exit)"]
        for j, lab2 in enumerate(rows): put(wf, f"B{t+1+j}", lab2, "label", bold=(j in (2, 9)))
        put(wf, f"B{t+11}", "Netto kontantstrøm investor", "label", bold=True)
        for k in range(0, 11):
            col = get_column_letter(3 + k); prev = get_column_letter(2 + k)
            put(wf, f"{col}{t+1}", f"=Returns!{col}{src}", "link", F_NOK)
            put(wf, f"{col}{t+2}", "=0" if k == 0 else f"=IF({k}<=Returns!${c}$8,-MgmtFee*Egenkapital,0)", "calc", F_NOK)
            put(wf, f"{col}{t+3}", f"={col}{t+1}+{col}{t+2}", "calc", F_NOK, bold=True)
            put(wf, f"{col}{t+4}", f"=MAX(0,-{col}{t+3})", "calc", F_NOK)
            put(wf, f"{col}{t+5}", f"=MAX(0,{col}{t+3})", "calc", F_NOK)
            put(wf, f"{col}{t+6}", "=0" if k == 0 else f"={prev}{t+8}", "calc", F_NOK)
            put(wf, f"{col}{t+7}", "=0" if k == 0 else f"={col}{t+6}*((1+Pref)^YEARFRAC({prev}$15,{col}$15)-1)", "calc", F_NOK)
            put(wf, f"{col}{t+8}", f"=MAX(0,{col}{t+6}+{col}{t+7}+{col}{t+4}-{col}{t+5})", "calc", F_NOK)
            put(wf, f"{col}{t+9}", f"=MAX(0,{col}{t+5}-({col}{t+6}+{col}{t+7}+{col}{t+4}))", "calc", F_NOK)
            put(wf, f"{col}{t+10}", "=0" if k == 0 else f"=IF({k}=Returns!${c}$8,$O{t+9},0)", "calc", F_NOK)
            put(wf, f"{col}{t+11}", f"={col}{t+3}-{col}{t+10}", "calc", F_NOK, bold=True)
        # summary column O: pref paid, excess, tier, carry
        put(wf, f"O{t+5}", f"=SUM(C{t+5}:M{t+5})-SUM(C{t+4}:M{t+4})-SUM(C{t+9}:M{t+9})", "calc", F_NOK)
        put(wf, f"O{t+6}", f"=SUM(C{t+9}:M{t+9})", "calc", F_NOK)
        put(wf, f"O{t+7}", f"=MAX(0,O{t+5})*Carry/(CatchUp-Carry)", "calc", F_NOK)
        put(wf, f"O{t+9}", f"=CatchUp*MIN(O{t+6},O{t+7})+Carry*MAX(0,O{t+6}-O{t+7})", "calc", F_NOK, bold=True)
        for j, l in [(4, "Pref betalt"), (5, "Overskudd"), (6, "Catch-up-tier"), (8, "Carry")]:
            put(wf, f"O{t+j}", l, "note") if False else None
        put(wf, f"N{t+5}", None, "note")
        line_rows(wf, t + 1, t + 10, "B", "M"); total_row(wf, t + 11, "B", "M", PALEGRN); total_row(wf, t + 3, "B", "M")
    wf.freeze_panes = "C16"
    put(wf, "O15", "Pref / overskudd / tier / carry", "note")

pickle.dump((R, G, SG), open("./RG.pkl", "wb"))
