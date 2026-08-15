"""REQ-branded charts for the presentation skill — matplotlib, styled to the REQ tokens.

Each function returns a path to a high-resolution transparent PNG sized for a slide,
so it drops straight into ReqDeck.figure(image=…) / the deck's chart_* helpers.

Design follows the REQ house style and the dataviz form-first method:
- Navy #001D6C is the primary/first series; grey #666666 is the recessive benchmark.
- Gains navy, losses in the reserved status red #8C1D18 — polarity by colour + sign.
- Every series is direct-labelled (identity never colour-alone; teal always gets a label).
- One value axis, recessive hairline grid, no gradients, no chartjunk.
"""

import os
import tempfile

import matplotlib
matplotlib.use("Agg")
import matplotlib.font_manager as fm
import matplotlib.pyplot as plt

# REQ tokens (hex) — from req-design-pack/brand.md, public material only
NAVY = "#001D6C"
PETROL = "#005070"
PETROL_BLUE = "#007C9D"
TEAL = "#82C0C7"
INK = "#1A1A1A"
GREY = "#666666"
HAIR = "#E5E5E5"
WHITE = "#FFFFFF"
NEG = "#8C1D18"  # reserved status colour for losses / negatives

# Categorical order for allocation-style charts (identity always paired with a label)
SERIES = [NAVY, PETROL_BLUE, TEAL, GREY, PETROL]

_FONT = "DejaVu Sans"  # Calibri-like metrics; a safe cross-platform stand-in
for _cand in ("Calibri", "Carlito", "Arial", "Helvetica"):
    if any(_cand.lower() in f.name.lower() for f in fm.fontManager.ttflist):
        _FONT = _cand
        break

plt.rcParams.update({
    "font.family": _FONT,
    "text.color": INK,
    "axes.edgecolor": HAIR,
    "axes.labelcolor": GREY,
    "xtick.color": GREY,
    "ytick.color": GREY,
    "axes.linewidth": 0.8,
    "figure.dpi": 200,
    "savefig.transparent": True,
})


def _new(w=11.5, h=5.4):
    fig, ax = plt.subplots(figsize=(w, h))
    for spine in ("top", "right"):
        ax.spines[spine].set_visible(False)
    ax.tick_params(length=0)
    return fig, ax


def _save(fig, path=None):
    if path is None:
        fd, path = tempfile.mkstemp(suffix=".png", prefix="reqchart-")
        os.close(fd)
    fig.savefig(path, bbox_inches="tight", pad_inches=0.15, transparent=True)
    plt.close(fig)
    return path


def line(categories, series, path=None, pct=True):
    """Return / NAV over time. series = {"REQ Global Compounders": [...], "MSCI World": [...]}.
    First series → navy (primary); second → recessive grey; more follow the categorical order.
    """
    fig, ax = _new()
    colors = [NAVY, GREY] + SERIES[1:]
    names = list(series.keys())
    for i, name in enumerate(names):
        c = colors[i % len(colors)]
        vals = series[name]
        lw = 2.6 if i == 0 else 1.8
        ax.plot(categories, vals, color=c, linewidth=lw,
                marker="o", markersize=4, markerfacecolor=c, markeredgecolor=WHITE,
                markeredgewidth=0.8, zorder=3 - i)
        # direct end-label — identity without a legend box
        ax.annotate(f"  {name}", (len(categories) - 1, vals[-1]),
                    color=c, fontsize=12, fontweight="bold" if i == 0 else "normal",
                    va="center", ha="left", xytext=(6, 0), textcoords="offset points")
    ax.axhline(0, color=HAIR, linewidth=1)
    ax.grid(axis="y", color=HAIR, linewidth=0.8)
    ax.set_axisbelow(True)
    if pct:
        ax.yaxis.set_major_formatter(lambda v, _: f"{v:.0f}%")
    ax.margins(x=0.02)
    fig.subplots_adjust(right=0.82)
    return _save(fig, path)


def bars(categories, values, path=None, pct=True, label_fmt=None):
    """Returns / P&L by period — one series. Gains navy, losses status-red; each bar labelled."""
    fig, ax = _new()
    colors = [NAVY if v >= 0 else NEG for v in values]
    ax.bar(categories, values, color=colors, width=0.62)
    ax.axhline(0, color=INK, linewidth=1)
    ax.grid(axis="y", color=HAIR, linewidth=0.8)
    ax.set_axisbelow(True)
    fmt = label_fmt or ((lambda v: f"{v:+.1f}%") if pct else (lambda v: f"{v:+,.0f}"))
    off = (max(values) - min(values) or 1) * 0.03
    for x, v in zip(categories, values):
        ax.annotate(fmt(v), (x, v), ha="center",
                    va="bottom" if v >= 0 else "top",
                    xytext=(0, 3 if v >= 0 else -3), textcoords="offset points",
                    color=NAVY if v >= 0 else NEG, fontsize=11, fontweight="bold")
    ax.margins(y=0.18)
    ax.spines["left"].set_visible(False)
    ax.set_yticks([])
    return _save(fig, path)


def waterfall(labels, deltas, path=None, start=0.0, unit="", start_label="Inngående",
              end_label="Utgående"):
    """P&L bridge / attribution. deltas are signed steps; a start and computed end total
    bookend the bars. Increases navy, decreases status-red, totals petrol."""
    fig, ax = _new(h=5.6)
    cats = [start_label] + list(labels) + [end_label]
    running = start
    xs = range(len(cats))
    # start total
    ax.bar(0, start, color=PETROL, width=0.62)
    for i, d in enumerate(deltas, start=1):
        bottom = running if d >= 0 else running + d
        ax.bar(i, abs(d), bottom=bottom, color=NAVY if d >= 0 else NEG, width=0.62)
        # dashed connector at the running level, from this bar to the next
        ax.plot([i - 0.31, i + 0.31], [running, running],
                color=GREY, linewidth=0.8, linestyle=(0, (3, 2)))
        running += d
    end = running
    ax.bar(len(cats) - 1, end, color=PETROL, width=0.62)
    # value labels
    def fmt(v):
        return f"{v:+,.0f}{unit}"
    ax.annotate(f"{start:,.0f}{unit}", (0, start), ha="center", va="bottom",
                xytext=(0, 3), textcoords="offset points", color=PETROL,
                fontsize=11, fontweight="bold")
    r = start
    for i, d in enumerate(deltas, start=1):
        r += d
        top = max(r, r - d)
        ax.annotate(fmt(d), (i, top), ha="center", va="bottom",
                    xytext=(0, 3), textcoords="offset points",
                    color=NAVY if d >= 0 else NEG, fontsize=11, fontweight="bold")
    ax.annotate(f"{end:,.0f}{unit}", (len(cats) - 1, end), ha="center", va="bottom",
                xytext=(0, 3), textcoords="offset points", color=PETROL,
                fontsize=11, fontweight="bold")
    ax.set_xticks(list(xs))
    ax.set_xticklabels(cats)
    ax.grid(axis="y", color=HAIR, linewidth=0.8)
    ax.set_axisbelow(True)
    ax.margins(y=0.18)
    ax.spines["left"].set_visible(False)
    ax.set_yticks([])
    return _save(fig, path)


def donut(labels, values, path=None, center=None):
    """Portfolio / revenue allocation. Categorical order; every wedge directly labelled."""
    fig, ax = _new(w=8.2, h=5.6)
    colors = [SERIES[i % len(SERIES)] for i in range(len(values))]
    wedges, _ = ax.pie(values, colors=colors, startangle=90, counterclock=False,
                       wedgeprops=dict(width=0.42, edgecolor=WHITE, linewidth=2))
    total = sum(values)
    for w_, lab, val in zip(wedges, labels, values):
        ang = (w_.theta2 + w_.theta1) / 2
        import math
        x = math.cos(math.radians(ang))
        y = math.sin(math.radians(ang))
        ax.annotate(f"{lab}  {val/total*100:.0f}%",
                    xy=(x * 0.79, y * 0.79), xytext=(x * 1.15, y * 1.05),
                    ha="left" if x >= 0 else "right", va="center",
                    fontsize=12, color=INK,
                    arrowprops=dict(arrowstyle="-", color=HAIR, linewidth=0.8))
    if center:
        ax.text(0, 0, center, ha="center", va="center", fontsize=15,
                fontweight="bold", color=NAVY)
    ax.set(aspect="equal")
    return _save(fig, path)
