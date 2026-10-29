"""REQ «PREP-stil» slide kit – raw OOXML builders for the REQ IC memo template.

Reverse-engineered from REQ PREP (okt. 2026) and used for the Puru Infra IC intro.
Every helper writes shapes straight into a slide's <p:spTree>, so the template's own
master, fonts (TT Hoves Pro) and layout furniture (REQ mark, footer) stay intact.

Typical use (after add_slide.py has created an EMPTY slide from slideLayout9.xml):

    import sys; sys.path.insert(0, "<skill>/scripts")
    from prep_kit import *
    s = Slide()
    header(s, "Action-tittel ≤ 64 tegn", "Seksjon · underseksjon",
           "Én setning ingress i kursiv.", tabs=TABS, active="Sammendrag",
           cite="Kilde: ...")
    big_number(s, 0.458, 1.95, "12,9 %", "IRR på A-aksjene, 5 år", "REQ base · 1,80x MoE")
    banner(s, 0.458, 6.05, 12.425, 0.48, "Konklusjon: ", "resten av setningen.")
    s.write("unpacked/ppt/slides/slide3.xml")

Coordinates are inches on the 13.333 × 7.5 in canvas. Content area: y 1.95 → 6.0,
banner at y 6.05 (h 0.48), footnote (idx 16) and slide number come from the layout.
"""
from xml.sax.saxutils import escape

EMU = 914400
def E(v): return int(round(v * EMU))

# ---- palette (hex) ----
NAVY = "002881"     # accent1 – cards, banners, active tab, big numbers
TX2 = "001D6C"      # titles (scheme tx2)
LBL = "4B6199"      # small caps labels, KPI captions, inactive tab text
BODY = "1F1E1E"     # body text
LEDE = "5A5A5A"     # italic lede under the header rule
PALE = "E5F6FF"     # pale card / inactive tab / highlighted table column
LBLUE = "B7E3FF"    # sub-text on navy, light bars
BRIGHT = "33B1FF"   # accent: numbering, «vi er her», third chevron
MID = "1F4CA8"      # second chevron / secondary navy
RULE = "D8E2EE"     # thin separators and table row rules
RED, AMBER_CHIP, GREEN_CHIP = "C0392B", "E08A00", "3A8F5C"
AMBER = "FFF3CD"    # foreløpige input
REDT, RED2 = "FBE3E4", "F6C6C9"   # heatmap below hurdle / far below
HEAT_UP = ("E5F6FF", "B7E3FF", "7FCBFF")

NS = ('xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
      'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"')

# ---- Norwegian number formatting ----
def nb(x, d=1):
    s = f"{x:,.{d}f}".replace(",", " ").replace(".", ",")
    return s.replace("-", "−")
def pct(x, d=1): return nb(x * 100, d) + " %"
def mnok(x, d=1): return nb(x / 1e6, d)


class Slide:
    def __init__(self): self.items, self.nid = [], 10
    def id(self): self.nid += 1; return self.nid
    def add(self, x): self.items.append(x)
    def xml(self):
        return (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sld {NS}><p:cSld><p:spTree>'
                '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
                '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'
                + "".join(self.items) + '</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>')
    def write(self, path):
        open(path, "w", encoding="utf-8").write(self.xml())


def _fill(c):
    if c is None: return "<a:noFill/>"
    if c in ("tx2", "accent1", "bg1"): return f'<a:solidFill><a:schemeClr val="{c}"/></a:solidFill>'
    return f'<a:solidFill><a:srgbClr val="{c}"/></a:solidFill>'

def _run(t, sz=10, b=False, i=False, c=BODY):
    sp = ' xml:space="preserve"' if t != t.strip() else ''
    return (f'<a:r><a:rPr lang="nb-NO" sz="{int(sz*100)}" b="{int(b)}" i="{int(i)}" dirty="0">{_fill(c)}</a:rPr>'
            f'<a:t{sp}>{escape(t)}</a:t></a:r>')

def P(content, sz=10, b=False, i=False, c=BODY, al="l", after=0, before=0, bullet=False, ln=None):
    """Paragraph. content = str or list of (text, {overrides}) runs, e.g.
    P([("Bold lead: ", {"b": True}), ("rest", {})], sz=10.5, c="FFFFFF")"""
    if isinstance(content, str): content = [(content, {})]
    rs = "".join(_run(t, **{**dict(sz=sz, b=b, i=i, c=c), **o}) for t, o in content)
    bu = '<a:buFont typeface="Arial"/><a:buChar char="•"/>' if bullet else '<a:buNone/>'
    mar = ' marL="171450" indent="-171450"' if bullet else ' marL="0" indent="0"'
    lns = f'<a:lnSpc><a:spcPct val="{ln}"/></a:lnSpc>' if ln else ''
    return (f'<a:p><a:pPr algn="{al}"{mar}>{lns}<a:spcBef><a:spcPts val="{int(before*100)}"/></a:spcBef>'
            f'<a:spcAft><a:spcPts val="{int(after*100)}"/></a:spcAft>{bu}</a:pPr>{rs}</a:p>')

def box(s, x, y, w, h, paras=None, fill=None, geom="rect", adj=None, anchor="t", ins=(0, 0, 0, 0), line=None, lw=9525, name="Shape"):
    """Any shape/text box. geom: rect, roundRect, ellipse, homePlate, chevron ...
    adj: roundRect corner (5000 card, 8000 banner, 50000 pill) or arrow depth (30000)."""
    i = s.id()
    av = f'<a:avLst><a:gd name="adj" fmla="val {adj}"/></a:avLst>' if adj is not None else '<a:avLst/>'
    ln = f'<a:ln w="{lw}">{_fill(line)}</a:ln>' if line else '<a:ln><a:noFill/></a:ln>'
    l, t, r, b = [E(v) for v in ins]
    txb = ' txBox="1"' if fill is None and line is None and paras else ''
    body = "".join(paras) if paras else '<a:p><a:endParaRPr lang="nb-NO"/></a:p>'
    s.add(f'<p:sp><p:nvSpPr><p:cNvPr id="{i}" name="{name} {i}"/><p:cNvSpPr{txb}/><p:nvPr/></p:nvSpPr>'
          f'<p:spPr><a:xfrm><a:off x="{E(x)}" y="{E(y)}"/><a:ext cx="{E(w)}" cy="{E(h)}"/></a:xfrm><a:prstGeom prst="{geom}">{av}</a:prstGeom>{_fill(fill)}{ln}</p:spPr>'
          f'<p:txBody><a:bodyPr wrap="square" lIns="{l}" tIns="{t}" rIns="{r}" bIns="{b}" anchor="{anchor}" rtlCol="0"><a:noAutofit/></a:bodyPr><a:lstStyle/>{body}</p:txBody></p:sp>')

def ph(s, tag, paras, xfrm=None, bodypr="<a:bodyPr/>", name="ph"):
    """Placeholder. `tag` must be the raw <p:ph .../> copied from dump_layouts.py."""
    i = s.id(); sp = ""
    if xfrm:
        x, y, w, h = xfrm; sp = f'<a:xfrm><a:off x="{E(x)}" y="{E(y)}"/><a:ext cx="{E(w)}" cy="{E(h)}"/></a:xfrm>'
    s.add(f'<p:sp><p:nvSpPr><p:cNvPr id="{i}" name="{name} {i}"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr>{tag}</p:nvPr></p:nvSpPr>'
          f'<p:spPr>{sp}</p:spPr><p:txBody>{bodypr}<a:lstStyle/>{"".join(paras)}</p:txBody></p:sp>')

# ---- raw placeholder tags on slideLayout9 ("Content slide 1 column") ----
PH_TITLE = '<p:ph type="ctrTitle" hasCustomPrompt="1"/>'
PH_LEDE = '<p:ph type="body" sz="quarter" idx="34" hasCustomPrompt="1"/>'
PH_FOOT = '<p:ph type="body" sz="quarter" idx="16" hasCustomPrompt="1"/>'
PH_NUM = '<p:ph type="sldNum" sz="quarter" idx="4"/>'
PH_SUB13 = '<p:ph type="body" sz="quarter" idx="13" hasCustomPrompt="1"/>'   # title/divider layouts

# ======================= composite elements =======================
def tabs(s, items, active):
    """Navigation pills top-right (7,5 pt). items = list of section names (6–9)."""
    widths = [0.075 * len(t) + 0.32 for t in items]
    gap = 0.05; x = 12.89 - sum(widths) - gap * (len(items) - 1)
    for t, w in zip(items, widths):
        on = t == active
        box(s, x, 0.125, w, 0.222, [P(t, sz=7.5, b=True, c="FFFFFF" if on else LBL, al="ctr")],
            fill=NAVY if on else PALE, geom="roundRect", adj=50000, anchor="ctr", name="Tab")
        x += w + gap

def header(s, title, kicker, lede=None, tabs_items=None, active=None, cite=None, title_sz=28):
    """Title (≤ 64 chars at 28 pt!), kicker in caps, header rule, italic lede, footnote, page no."""
    if tabs_items: tabs(s, tabs_items, active)
    ph(s, PH_TITLE, [P(title, sz=title_sz, c=TX2)], xfrm=(0.458, 0.40, 12.43, 0.6),
       bodypr='<a:bodyPr wrap="square" tIns="0" anchor="t"><a:noAutofit/></a:bodyPr>', name="Title")
    box(s, 0.458, 1.0, 12.43, 0.236, [P(kicker.upper(), sz=11, c="tx2")], name="Kicker")
    box(s, 0.456, 1.376, 12.425, 0.004, None, fill="accent1", line=RULE, lw=12700, name="Header rule")
    if lede:
        ph(s, PH_LEDE, [P(lede, sz=11, i=True, c=LEDE)], xfrm=(0.458, 1.5, 12.43, 0.3), name="Lede")
    if cite:
        ph(s, PH_FOOT, [P(cite, sz=8)], name="Footnote")
    ph(s, PH_NUM, ['<a:p><a:fld id="{4B87D714-1B0C-B346-BB4E-D29ADD6C43D0}" type="slidenum"><a:rPr lang="nb-NO"/><a:t>‹#›</a:t></a:fld><a:endParaRPr lang="nb-NO"/></a:p>'], name="Slide Number")

def label(s, x, y, w, text, c=LBL, sz=9.5):
    """Section label in bold caps (4B6199) above a block."""
    box(s, x, y, w, 0.22, [P(text.upper(), sz=sz, b=True, c=c)], name="Label")

def banner(s, x, y, w, h, lead, rest, fill=NAVY):
    """Navy take-away strip: bold lead-in + plain rest. Standard: (0.458, 6.05, 12.425, 0.48)."""
    box(s, x, y, w, h, [P([(lead, {"b": True}), (rest, {})], sz=10.5, c="FFFFFF")], fill=fill,
        geom="roundRect", adj=8000, anchor="ctr", ins=(0.17, 0.06, 0.17, 0.06), name="Banner")

def card(s, x, y, w, h, fill=PALE, adj=5000):
    box(s, x, y, w, h, None, fill=fill, geom="roundRect", adj=adj, name="Card")

def kpi(s, x, y, w, num, cap, c=NAVY, sz=16, capc=LBL, capsz=8.5):
    """Number + caption pair (use inside cards; on navy pass c='FFFFFF', capc=LBLUE)."""
    box(s, x, y, w, 0.5, [P(num, sz=sz, b=True, c=c), P(cap, sz=capsz, c=capc)], name="KPI")

def big_number(s, x, y, num, head, sub, w_num=3.1):
    """Hero number (50 pt) with a bold head + label-coloured sub line to its right."""
    box(s, x, y, w_num, 0.95, [P(num, sz=50, b=True, c=NAVY)], anchor="b", name="Big number")
    box(s, x + w_num - 0.1, y + 0.17, 3.0, 0.8, [P(head, sz=11.5, b=True), P(sub, sz=9.5, c=LBL)], name="Big label")

def pillar(s, x, y, w, num, head, text):
    """01/02/03 pillar: thin navy rule left, bright number, navy head, body."""
    box(s, x, y, 0.016, 0.85, None, fill=NAVY, name="Pillar rule")
    box(s, x + 0.14, y, w, 0.95, [P(num, sz=9, b=True, c=BRIGHT), P(head, sz=12, b=True, c=NAVY, after=2), P(text, sz=9.5)], name="Pillar")

def step(s, x, y, n, head, desc, w=4.9, line_h=None, fill=NAVY):
    """Numbered circle + head + description; line_h draws the connector down to the next step."""
    box(s, x, y, 0.36, 0.36, [P(str(n), sz=11, b=True, c="FFFFFF", al="ctr")], fill=fill, geom="ellipse", anchor="ctr", name="Step num")
    if line_h: box(s, x + 0.17, y + 0.36, 0.014, line_h, None, fill=fill, name="Step line")
    box(s, x + 0.5, y - 0.02, w, 0.26, [P(head, sz=12, b=True, c=NAVY)], name="Step head")
    box(s, x + 0.5, y + 0.25, w, 0.6, [P(desc, sz=9.5)], name="Step desc")

def chevrons(s, x, y, items, w=2.12, h=0.85, pitch=2.0):
    """Process arrow: items = [(head, sub), ...]; colours NAVY → MID → BRIGHT."""
    cols = [NAVY, MID, BRIGHT, LBLUE]
    for k, (hd, sub) in enumerate(items):
        col = cols[min(k, 3)]
        light = col in (BRIGHT, LBLUE)
        box(s, x + k * pitch, y, w, h, [P(hd, sz=12.5, b=True, c="FFFFFF"), P(sub, sz=9.5, c="FFFFFF" if light else LBLUE)],
            fill=col, geom="homePlate" if k == 0 else "chevron", adj=30000, anchor="ctr", ins=(0.15, 0.05, 0.25, 0.05), name="Chev")

def chip(s, x, y, text, color, w=0.85):
    """Pill status chip (Høy/Middels/Lav, OK, Foreløpig)."""
    box(s, x, y, w, 0.26, [P(text, sz=8.5, b=True, c="FFFFFF", al="ctr")], fill=color, geom="roundRect", adj=50000, anchor="ctr", name="Chip")

def initials(s, x, y, ini, color=NAVY, d=0.48):
    box(s, x, y, d, d, [P(ini, sz=10, b=True, c="FFFFFF", al="ctr")], fill=color, geom="ellipse", anchor="ctr", name="Initials")

def entity(s, x, y, w, h, title, sub, navy=True, subc=None):
    """Org-chart box: navy (top level / new assets) or pale (leaf)."""
    if navy:
        box(s, x, y, w, h, [P(title, sz=10.5, b=True, c="FFFFFF", al="ctr"), P(sub, sz=8.5, c=LBLUE, al="ctr")], fill=NAVY, geom="roundRect", adj=12000, anchor="ctr", name="Entity")
    else:
        box(s, x, y, w, h, [P(title, sz=10, b=True, c=NAVY, al="ctr"), P(sub, sz=8.5, c=subc or LBL, al="ctr", b=bool(subc))], fill=PALE, geom="roundRect", adj=12000, anchor="ctr", name="Leaf")

def connector_v(s, x, y1, y2, c="9AA7C7"): box(s, x - 0.007, y1, 0.014, y2 - y1, None, fill=c, name="Conn")
def connector_h(s, x1, x2, y, c="9AA7C7"): box(s, x1, y - 0.007, x2 - x1, 0.014, None, fill=c, name="Conn")

def table(s, x, y, colw, rows, rh=0.27, sz=9, hdr_c=LBL, bold_rows=(), aligns=None, fills=None, colfill=None, txtc=None):
    """PREP table: small bold label-coloured header, navy rule under header, hairline row rules,
    no verticals. fills {(r,c): hex}, colfill {c: hex} (e.g. highlight REQ-base column PALE),
    txtc {(r,c): hex}. Row 0 is the header."""
    i = s.id(); W = sum(colw)
    grid = "".join(f'<a:gridCol w="{E(c)}"/>' for c in colw)
    trs = []
    for ri, row in enumerate(rows):
        tcs = []
        for ci, cell in enumerate(row):
            al = aligns[ci] if aligns else ("l" if ci == 0 else "r")
            f = None
            if ri == 0:
                p = P(cell, sz=sz - 1, b=True, c=hdr_c, al=al)
                bot = f'<a:lnB w="12700"><a:solidFill><a:srgbClr val="{NAVY}"/></a:solidFill></a:lnB>'
            else:
                p = P(cell, sz=sz, b=(ri in bold_rows), c=(txtc or {}).get((ri, ci), BODY), al=al)
                bot = f'<a:lnB w="6350"><a:solidFill><a:srgbClr val="{RULE}"/></a:solidFill></a:lnB>'
                f = (fills or {}).get((ri, ci)) or (colfill or {}).get(ci)
            tcs.append(f'<a:tc><a:txBody><a:bodyPr/><a:lstStyle/>{p}</a:txBody><a:tcPr marL="45720" marR="45720" marT="18288" marB="18288" anchor="ctr">'
                       f'<a:lnL><a:noFill/></a:lnL><a:lnR><a:noFill/></a:lnR><a:lnT><a:noFill/></a:lnT>{bot}{_fill(f) if f else "<a:noFill/>"}</a:tcPr></a:tc>')
        trs.append(f'<a:tr h="{E(rh)}">{"".join(tcs)}</a:tr>')
    s.add(f'<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="{i}" name="Table {i}"/><p:cNvGraphicFramePr><a:graphicFrameLocks noGrp="1"/></p:cNvGraphicFramePr><p:nvPr/></p:nvGraphicFramePr>'
          f'<p:xfrm><a:off x="{E(x)}" y="{E(y)}"/><a:ext cx="{E(W)}" cy="{E(rh*len(rows))}"/></p:xfrm>'
          f'<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table"><a:tbl><a:tblPr firstRow="1"/><a:tblGrid>{grid}</a:tblGrid>{"".join(trs)}</a:tbl></a:graphicData></a:graphic></p:graphicFrame>')

def heat_table(s, x, y, col_labels, row_labels, values, hurdle=0.125, base_rc=(2, 2), fmt=pct, colw=(1.35, 0.9, 0.9, 0.9, 0.9, 0.9), rh=0.28, corner="Rad \\ exit yield"):
    """Sensitivity grid coloured against a hurdle: red below, blue shades above, base cell navy.
    Height = rh × 6 → 1.68 in at rh 0.28 (two grids + labels fit between y 1.95 and 6.0)."""
    rows = [[corner] + list(col_labels)]; fills, txtc = {}, {}
    for i, rl in enumerate(row_labels):
        row = [rl]
        for j, v in enumerate(values[i]):
            row.append(fmt(v)); rc = (i + 1, j + 1)
            if (i, j) == tuple(base_rc): fills[rc] = NAVY; txtc[rc] = "FFFFFF"
            elif v < hurdle - 0.025: fills[rc] = RED2
            elif v < hurdle: fills[rc] = REDT
            elif v < hurdle + 0.015: fills[rc] = HEAT_UP[0]
            elif v < hurdle + 0.035: fills[rc] = HEAT_UP[1]
            else: fills[rc] = HEAT_UP[2]
        rows.append(row)
    table(s, x, y, list(colw), rows, rh=rh, sz=9.5, fills=fills, txtc=txtc, aligns=["l"] + ["ctr"] * (len(colw) - 1), bold_rows=(base_rc[0] + 1,))

def divider(s, title, sub=None):
    """Section divider on slideLayout2.xml (pale blue with dot wave)."""
    ph(s, PH_TITLE, [P(title, sz=40, c=TX2)], name="Title")
    if sub: ph(s, PH_SUB13, [P(sub, sz=14, c=TX2)], xfrm=(6.77, 1.35, 6.12, 0.6), name="Sub")

def closing(s):
    """Closing on slideLayout39.xml (white)."""
    ph(s, '<p:ph type="body" sz="quarter" idx="14" hasCustomPrompt="1"/>', [P("Investing with insight.", sz=30, c=TX2), P("Building what's next.", sz=30, c=TX2)], name="Tagline")
