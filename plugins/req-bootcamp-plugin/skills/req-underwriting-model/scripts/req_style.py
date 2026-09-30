"""REQ house style for Excel underwriting models (openpyxl).

Palette and fonts from REQ-mal.pptx theme. Font-colour convention (xlsx skill):
blue = hard-coded input, black = calculation, green = link to other sheet.
"""
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.workbook.defined_name import DefinedName
from openpyxl.utils import get_column_letter

NAVY, DEEP, BRIGHT = "001D6C", "002881", "33B1FF"
PALE, PALEGRN, LGREY = "E5F6FF", "E5F9E0", "ECEAEA"
TXT, GREYTXT, WHITE = "1F1E1E", "6B6B6B", "FFFFFF"
AMBER, LINE = "FFF3CD", "D0D5DD"
HEAD, BODY = "TT Hoves Pro Medium", "TT Hoves Pro"

# number formats
F_NOK = '#,##0;(#,##0);"–"'
F_K = '#,##0,;(#,##0,);"–"'          # NOK '000
F_M = '#,##0.0,,;(#,##0.0,,);"–"'    # MNOK
F_PCT = '0.0%;(0.0%);"–"'
F_PCT2 = '0.00%;(0.00%);"–"'
F_X = '0.00"x"'
F_DATE = 'dd.mm.yyyy'
F_INT = '0'
F_YR = '0.0" år"'

def fill(c): return PatternFill("solid", fgColor=c)
def font(size=9, bold=False, color=TXT, italic=False, head=False):
    return Font(name=HEAD if (head or bold) else BODY, size=size, bold=bold, color=color, italic=italic)

THIN = Side(style="thin", color=LINE)
NAVYLINE = Side(style="thin", color=NAVY)
BRIGHTLINE = Side(style="medium", color=BRIGHT)
WHITE_THICK = Side(style="thick", color=WHITE)

def setup(ws, widths, tab=None, zoom=90, landscape=True):
    ws.sheet_view.showGridLines = False
    ws.sheet_view.zoomScale = zoom
    for col, w in widths.items():
        ws.column_dimensions[col].width = w
    if tab: ws.sheet_properties.tabColor = tab
    ws.page_setup.orientation = "landscape" if landscape else "portrait"
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.page_margins.left = ws.page_margins.right = 0.3
    ws.page_margins.top = ws.page_margins.bottom = 0.4

def banner(ws, title, subtitle, c1="B", c2="O", right_text="KONFIDENSIELT"):
    ws.row_dimensions[1].height = 8
    ws.row_dimensions[2].height = 30
    ws.row_dimensions[3].height = 18
    ws.merge_cells(f"{c1}2:{c2}2"); ws.merge_cells(f"{c1}3:{c2}3")
    t = ws[f"{c1}2"]; t.value = title
    t.font = Font(name=HEAD, size=16, bold=True, color=WHITE)
    t.alignment = Alignment(vertical="center", indent=1)
    s = ws[f"{c1}3"]; s.value = subtitle
    s.font = Font(name=BODY, size=9, color=WHITE)
    s.alignment = Alignment(vertical="center", indent=1)
    from openpyxl.utils import column_index_from_string as ci
    for col in range(ci(c1), ci(c2) + 1):
        ws.cell(row=2, column=col).fill = fill(NAVY)
        ws.cell(row=3, column=col).fill = fill(DEEP)
    if right_text:
        # right-aligned tag written into the last banner cell's row 3 via a separate cell isn't
        # possible inside a merge, so we append it to the subtitle text instead
        s.value = f"{subtitle}"

def section(ws, row, c1, c2, text, size=10):
    from openpyxl.utils import column_index_from_string as ci
    ws.row_dimensions[row].height = 20
    c = ws[f"{c1}{row}"]; c.value = text.upper()
    c.font = Font(name=HEAD, size=size, bold=True, color=NAVY)
    c.alignment = Alignment(vertical="bottom")
    for col in range(ci(c1), ci(c2) + 1):
        ws.cell(row=row, column=col).border = Border(bottom=BRIGHTLINE)

def header_row(ws, row, c1, c2, labels=None, align="center", height=26):
    from openpyxl.utils import column_index_from_string as ci
    ws.row_dimensions[row].height = height
    for i, col in enumerate(range(ci(c1), ci(c2) + 1)):
        cell = ws.cell(row=row, column=col)
        if labels is not None and i < len(labels) and labels[i] is not None:
            cell.value = labels[i]
        cell.font = Font(name=HEAD, size=8.5, bold=True, color=WHITE)
        cell.fill = fill(DEEP)
        cell.alignment = Alignment(horizontal=align if i else "left", vertical="center",
                                   wrap_text=True, indent=0 if i else 1)

def line_rows(ws, r1, r2, c1, c2):
    from openpyxl.utils import column_index_from_string as ci
    for r in range(r1, r2 + 1):
        for col in range(ci(c1), ci(c2) + 1):
            cell = ws.cell(row=r, column=col)
            cell.border = Border(bottom=THIN)

def total_row(ws, row, c1, c2, fillc=PALE):
    from openpyxl.utils import column_index_from_string as ci
    for col in range(ci(c1), ci(c2) + 1):
        cell = ws.cell(row=row, column=col)
        cell.fill = fill(fillc)
        cell.border = Border(top=NAVYLINE, bottom=NAVYLINE)
        f = cell.font
        cell.font = Font(name=HEAD, size=f.size or 9, bold=True, color=f.color.rgb if f.color and isinstance(f.color.rgb, str) else TXT)

def put(ws, ref, value, kind="calc", fmt=None, bold=False, size=9, align=None, fillc=None, italic=False):
    """kind: input | placeholder | calc | link | label | note | text"""
    c = ws[ref]; c.value = value
    color = {"input": "0000FF", "placeholder": "0000FF", "calc": TXT, "link": "008000",
             "label": TXT, "note": GREYTXT, "text": TXT}[kind]
    c.font = Font(name=HEAD if bold else BODY, size=8 if kind == "note" else size, bold=bold,
                  color=color, italic=italic or kind == "note")
    if fmt: c.number_format = fmt
    if kind == "input": c.fill = fill(PALE)
    if kind == "placeholder": c.fill = fill(AMBER)
    if fillc: c.fill = fill(fillc)
    if align: c.alignment = Alignment(horizontal=align, vertical="center")
    elif kind in ("input", "placeholder", "calc", "link") and not isinstance(value, str) or (isinstance(value, str) and value.startswith("=")):
        c.alignment = Alignment(horizontal="right", vertical="center")
    return c

def name(wb, nm, sheet, ref):
    absref = "$" + "".join(ch if ch.isalpha() else "" for ch in ref) + "$" + "".join(ch for ch in ref if ch.isdigit())
    wb.defined_names[nm] = DefinedName(nm, attr_text=f"'{sheet}'!{absref}")

def years_header(ws, first_col, n, row_idx=5, row_year=6, label_col="B", start_name="Start",
                 extra_last=False):
    """Row 5 = period index, row 6 = calendar year. Last column optionally shaded (forward year)."""
    from openpyxl.utils import column_index_from_string as ci
    ws[f"{label_col}{row_idx}"].value = "Periode"
    ws[f"{label_col}{row_year}"].value = "Kalenderår (31.12)"
    for r in (row_idx, row_year):
        ws[f"{label_col}{r}"].font = Font(name=HEAD, size=8.5, bold=True, color=WHITE)
        ws[f"{label_col}{r}"].fill = fill(DEEP if r == row_idx else NAVY)
        ws[f"{label_col}{r}"].alignment = Alignment(indent=1, vertical="center")
    for col in range(ci(label_col) + 1, ci(first_col)):
        for r in (row_idx, row_year):
            ws.cell(row=r, column=col).fill = fill(DEEP if r == row_idx else NAVY)
    for i in range(n):
        col = get_column_letter(ci(first_col) + i)
        a = ws[f"{col}{row_idx}"]; a.value = i + 1
        a.font = Font(name=HEAD, size=8.5, bold=True, color=WHITE); a.fill = fill(DEEP)
        a.alignment = Alignment(horizontal="right")
        b = ws[f"{col}{row_year}"]; b.value = f"=YEAR({start_name})+{col}${row_idx}-1"
        b.font = Font(name=HEAD, size=9, bold=True, color=WHITE); b.fill = fill(NAVY)
        b.number_format = F_INT; b.alignment = Alignment(horizontal="right")
        if extra_last and i == n - 1:
            a.fill = fill("7F8FB5"); b.fill = fill("7F8FB5")
    ws.row_dimensions[row_idx].height = 16
    ws.row_dimensions[row_year].height = 18
