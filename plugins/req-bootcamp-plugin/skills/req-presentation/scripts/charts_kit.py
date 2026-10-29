"""Native, editable PowerPoint charts in REQ PREP style (python-pptx).

Run AFTER all slide XML is written and the deck is zipped: python-pptx adds the chart part
and its embedded workbook correctly. Charts stay editable in PowerPoint (right click → Edit data).
Leave an empty area on the slide (and a label() above it) where the chart goes.

    from charts_kit import *
    prs = Presentation("deck.pptx")
    waterfall(prs.slides[9], (0.35, 2.2, 7.9, 3.75),
              [("Plattform", 22.4, "tot"), ("B-carry", -3.5, "delta"), ("REQ base", 12.9, "tot")],
              axis_max=25, unit="%")
    prs.save("deck.pptx")

Number formats use '.' in code; PowerPoint renders them with the viewer's locale (comma in nb-NO).
"""
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION, XL_LABEL_POSITION, XL_TICK_LABEL_POSITION, XL_MARKER_STYLE
from pptx.oxml.ns import qn
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

NAVY, LBL, MID, LBLUE, BRIGHT, NEG = "002881", "4B6199", "1F4CA8", "B7E3FF", "33B1FF", "E8858A"
rgb = RGBColor.from_string


def _style(ch, size=9):
    ch.has_title = False
    ch.font.name = "TT Hoves Pro"; ch.font.size = Pt(size); ch.font.color.rgb = rgb("1F1E1E")
    va = ch.value_axis
    va.has_major_gridlines = True
    va.major_gridlines.format.line.color.rgb = rgb("E3E8F0"); va.major_gridlines.format.line.width = Pt(0.5)
    va.format.line.fill.background(); va.tick_labels.font.size = Pt(8); va.tick_labels.font.color.rgb = rgb(LBL)
    ca = ch.category_axis
    ca.format.line.color.rgb = rgb("C9D3E3"); ca.tick_labels.font.size = Pt(8.5)
    ca.has_major_gridlines = False


def _add(slide, kind, pos, cd):
    x, y, w, h = pos
    return slide.shapes.add_chart(kind, Inches(x), Inches(y), Inches(w), Inches(h), cd).chart


def hbar(slide, pos, cats, vals, highlight=(), secondary=(), fmt="0.0", axis_max=None):
    """Horizontal bars, one series. highlight → NAVY, secondary → MID, rest LBLUE.
    Pass cats bottom-to-top (PowerPoint draws the first category at the bottom)."""
    cd = CategoryChartData(); cd.categories = cats; cd.add_series("Serie", vals)
    ch = _add(slide, XL_CHART_TYPE.BAR_CLUSTERED, pos, cd); _style(ch); ch.has_legend = False
    pl = ch.plots[0]; pl.gap_width = 45
    for i, c in enumerate(cats):
        pt = pl.series[0].points[i]; pt.format.fill.solid()
        pt.format.fill.fore_color.rgb = rgb(NAVY if c in highlight else (MID if c in secondary else LBLUE))
    pl.has_data_labels = True; dl = pl.data_labels
    dl.number_format = fmt; dl.number_format_is_linked = False; dl.position = XL_LABEL_POSITION.OUTSIDE_END
    dl.font.size = Pt(9); dl.font.bold = True; dl.font.color.rgb = rgb(NAVY)
    ch.value_axis.visible = False; ch.value_axis.has_major_gridlines = False
    if axis_max: ch.value_axis.maximum_scale = axis_max
    return ch


def columns(slide, pos, cats, series, colors=(NAVY, LBLUE, BRIGHT), fmt="0.0;-0.0", axis_fmt="0", legend=True):
    """Clustered columns. series = [(name, [values...]), ...]. Negative bars keep their colour."""
    cd = CategoryChartData(); cd.categories = cats
    for n, v in series: cd.add_series(n, v)
    ch = _add(slide, XL_CHART_TYPE.COLUMN_CLUSTERED, pos, cd); _style(ch)
    legend = legend and len(series) > 1   # one series: a legend would just list the categories
    ch.has_legend = legend
    if legend:
        ch.legend.position = XL_LEGEND_POSITION.TOP; ch.legend.include_in_layout = False; ch.legend.font.size = Pt(9)
    pl = ch.plots[0]; pl.gap_width = 60; pl.overlap = -10
    for ser, c in zip(pl.series, colors):
        ser.format.fill.solid(); ser.format.fill.fore_color.rgb = rgb(c); ser.invert_if_negative = False
    pl.has_data_labels = True; dl = pl.data_labels
    dl.number_format = fmt; dl.number_format_is_linked = False; dl.position = XL_LABEL_POSITION.OUTSIDE_END
    dl.font.size = Pt(8)
    ch.value_axis.number_format = axis_fmt; ch.value_axis.number_format_is_linked = False
    ch.category_axis.tick_label_position = XL_TICK_LABEL_POSITION.LOW
    return ch


def waterfall(slide, pos, steps, axis_max=None, axis_min=0, unit="%", dec=1):
    """Bridge chart as stacked columns with an invisible base series.
    steps = [(label, value, kind)], kind "tot" (absolute bar, NAVY; a middle subtotal turns MID)
    or "delta" (change vs running total, drawn pale red if negative / BRIGHT if positive).
    Labels: use '\\n' to break long category names (keep ≤ 2 lines × ~14 chars)."""
    base, val, run = [], [], 0
    for _, v, kind in steps:
        if kind == "tot":
            base.append(0); val.append(v); run = v
        else:
            new = run + v; base.append(min(run, new)); val.append(abs(v)); run = new
    cd = CategoryChartData(); cd.categories = [s[0] for s in steps]
    cd.add_series("base", base); cd.add_series("verdi", val)
    ch = _add(slide, XL_CHART_TYPE.COLUMN_STACKED, pos, cd); _style(ch); ch.has_legend = False
    pl = ch.plots[0]; pl.gap_width = 45
    bs, vs = pl.series
    bs.format.fill.background(); bs.format.line.fill.background()
    last = len(steps) - 1
    for i, (_, v, kind) in enumerate(steps):
        pt = vs.points[i]; pt.format.fill.solid()
        if kind == "tot":
            col = NAVY if i in (0, last) else MID; txtc = "FFFFFF"
            txt = f"{v:.{dec}f}"
        else:
            col = NEG if v < 0 else BRIGHT; txtc = "7A1F23" if v < 0 else "FFFFFF"
            txt = ("−" if v < 0 else "+") + f"{abs(v):.{dec}f}"
        pt.format.fill.fore_color.rgb = rgb(col)
        pt.data_label.has_text_frame = True
        pt.data_label.text_frame.text = txt.replace(".", ",")
        pt.data_label.position = XL_LABEL_POSITION.INSIDE_END if kind == "tot" else XL_LABEL_POSITION.CENTER
        f = pt.data_label.text_frame.paragraphs[0].runs[0].font
        f.size = Pt(9.5); f.bold = True; f.color.rgb = rgb(txtc)
    if axis_max is not None: ch.value_axis.maximum_scale = axis_max
    ch.value_axis.minimum_scale = axis_min
    ch.value_axis.number_format = f'0"{unit}"' if unit else "0"; ch.value_axis.number_format_is_linked = False
    ch.category_axis.tick_labels.font.size = Pt(8)
    return ch


def line(slide, pos, cats, series, colors=(NAVY, BRIGHT, LBL, LBLUE), dec=1, axis_fmt="0", legend=True, label_last=True):
    """Lines over time, e.g. avkastning vs. referanseindeks. series = [(name, [values...]), ...].
    First series NAVY (our number), then BRIGHT, LBL, LBLUE. label_last writes the end value."""
    cd = CategoryChartData(); cd.categories = cats
    for n, v in series: cd.add_series(n, v)
    ch = _add(slide, XL_CHART_TYPE.LINE, pos, cd); _style(ch)
    ch.has_legend = legend
    if legend:
        ch.legend.position = XL_LEGEND_POSITION.TOP; ch.legend.include_in_layout = False; ch.legend.font.size = Pt(9)
    for ser, (_, vals), c in zip(ch.plots[0].series, series, colors):
        ser.smooth = False; ser.marker.style = XL_MARKER_STYLE.NONE
        ser.format.line.color.rgb = rgb(c); ser.format.line.width = Pt(2.25)
        if label_last:
            dl = ser.points[len(vals) - 1].data_label
            dl.has_text_frame = True
            dl.text_frame.text = f"{vals[-1]:.{dec}f}".replace(".", ",").replace("-", "−")
            dl.position = XL_LABEL_POSITION.RIGHT
            f = dl.text_frame.paragraphs[0].runs[0].font
            f.size = Pt(9); f.bold = True; f.color.rgb = rgb(c)
    ch.value_axis.number_format = axis_fmt; ch.value_axis.number_format_is_linked = False
    ch.category_axis.tick_label_position = XL_TICK_LABEL_POSITION.LOW
    return ch


def donut(slide, pos, cats, vals, colors=(NAVY, MID, BRIGHT, LBLUE, LBL, "D8E2EE"), hole=60, dec=0):
    """Allocation as a doughnut; slices labelled with their share in %. Max ~6 slices –
    group the rest as «Øvrige». Legend to the right."""
    cd = CategoryChartData(); cd.categories = cats; cd.add_series("Andel", vals)
    ch = _add(slide, XL_CHART_TYPE.DOUGHNUT, pos, cd)
    ch.has_title = False
    ch.font.name = "TT Hoves Pro"; ch.font.size = Pt(9); ch.font.color.rgb = rgb("1F1E1E")
    ch.has_legend = True; ch.legend.position = XL_LEGEND_POSITION.RIGHT
    ch.legend.include_in_layout = False; ch.legend.font.size = Pt(9)
    hs = ch.plots[0]._element.find(qn("c:holeSize"))
    if hs is not None: hs.set("val", str(hole))
    total = float(sum(vals))
    for i, v in enumerate(vals):
        c = colors[i % len(colors)]
        pt = ch.plots[0].series[0].points[i]
        pt.format.fill.solid(); pt.format.fill.fore_color.rgb = rgb(c)
        pt.format.line.color.rgb = rgb("FFFFFF")
        pt.data_label.has_text_frame = True
        pt.data_label.text_frame.text = f"{v / total * 100:.{dec}f} %".replace(".", ",")
        f = pt.data_label.text_frame.paragraphs[0].runs[0].font
        f.size = Pt(9); f.bold = True; f.color.rgb = rgb("FFFFFF" if c in (NAVY, MID, LBL) else NAVY)
    return ch
