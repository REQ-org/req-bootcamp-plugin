#!/usr/bin/env python3
"""Give a duplicated slide its own independent copy of every chart it contains.

add_slide.py (from the bundled pptx skill) duplicates a slide's XML, but a
duplicated slide's chart graphicFrame still points at the SAME chart part as
its source slide (and any other slide duplicated from that same source).
Editing that chart's data via python-pptx's chart.replace_data() on ANY one
of those slides silently changes the chart on all the others too, because
they are, physically, the same ppt/charts/chartN.xml part.

Run this ONCE per duplicated slide, right after add_slide.py and before you
touch that slide's chart data with python-pptx. It gives the named slide a
private copy of chart.xml + its style/colors parts + its embedded workbook,
and repoints that slide's relationship at the new copy — so editing its
chart.replace_data() afterwards only affects that one slide.

Usage:
    python clone_chart_parts.py unpacked/ slide12.xml

Safe to call on a slide with 0, 1, or several charts (e.g. a slide with two
charts side by side) — every chart relationship on that slide gets its own
fresh copy in one call.
"""

import re
import sys
from pathlib import Path


def next_index(charts_dir: Path, stem: str, suffix: str) -> int:
    existing = [int(m.group(1)) for f in charts_dir.glob(f"{stem}*{suffix}")
                if (m := re.fullmatch(rf"{stem}(\d+){re.escape(suffix)}", f.name))]
    return (max(existing) + 1) if existing else 1


def clone_chart(unpacked: Path, slide_name: str, chart_rel_target: str, rel_id: str):
    ppt = unpacked / "ppt"
    charts_dir = ppt / "charts"
    embeddings_dir = ppt / "embeddings"
    charts_rels_dir = charts_dir / "_rels"

    old_chart_path = (ppt / "slides" / chart_rel_target).resolve()
    old_chart_name = old_chart_path.stem  # e.g. "chart2"
    old_chart_rels = charts_rels_dir / f"{old_chart_name}.xml.rels"

    new_n = next_index(charts_dir, "chart", ".xml")
    new_chart_name = f"chart{new_n}"

    # 1. copy chart{N}.xml -> chart{new}.xml
    new_chart_xml = charts_dir / f"{new_chart_name}.xml"
    new_chart_xml.write_bytes((charts_dir / f"{old_chart_name}.xml").read_bytes())

    # 2. read old chart's own rels to find its style/colors/embedding targets
    old_rels_text = old_chart_rels.read_text() if old_chart_rels.exists() else ""
    content_type_adds = [
        f'<Override PartName="/ppt/charts/{new_chart_name}.xml" '
        f'ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>'
    ]

    new_rels_text = old_rels_text
    for kind, ext, ct in (
        ("chartStyle", "style", "application/vnd.ms-office.chartstyle+xml"),
        ("chartColorStyle", "colors", "application/vnd.ms-office.chartcolorstyle+xml"),
    ):
        m = re.search(rf'Target="({ext}\d+)\.xml"', old_rels_text)
        if m:
            old_part = m.group(1)
            new_idx = next_index(charts_dir, ext, ".xml")
            new_part = f"{ext}{new_idx}"
            (charts_dir / f"{old_part}.xml").replace  # no-op, keep old untouched
            new_rels_text = new_rels_text.replace(f'Target="{old_part}.xml"', f'Target="{new_part}.xml"')
            (charts_dir / f"{new_part}.xml").write_bytes((charts_dir / f"{old_part}.xml").read_bytes())
            content_type_adds.append(
                f'<Override PartName="/ppt/charts/{new_part}.xml" ContentType="{ct}"/>'
            )

    m = re.search(r'Target="\.\./embeddings/([^"]+)"', old_rels_text)
    if m:
        old_wb = m.group(1)
        old_wb_path = embeddings_dir / old_wb
        stem = re.match(r"(.*?)(\d*)$", Path(old_wb).stem)
        base = stem.group(1)
        idx = next_index(embeddings_dir, base, ".xlsx")
        new_wb = f"{base}{idx}.xlsx"
        (embeddings_dir / new_wb).write_bytes(old_wb_path.read_bytes())
        new_rels_text = new_rels_text.replace(f'Target="../embeddings/{old_wb}"',
                                                f'Target="../embeddings/{new_wb}"')

    (charts_rels_dir / f"{new_chart_name}.xml.rels").write_text(new_rels_text)

    # 3. register new parts in [Content_Types].xml
    ct_path = unpacked / "[Content_Types].xml"
    ct_text = ct_path.read_text()
    ct_text = ct_text.replace("</Types>", "".join(content_type_adds) + "</Types>")
    ct_path.write_text(ct_text)

    # 4. repoint the slide's relationship at the new chart part
    slide_rels_path = ppt / "slides" / "_rels" / f"{slide_name}.xml.rels"
    slide_rels_text = slide_rels_path.read_text()
    slide_rels_text = slide_rels_text.replace(
        f'Id="{rel_id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/{old_chart_name}.xml"',
        f'Id="{rel_id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/{new_chart_name}.xml"',
    )
    slide_rels_path.write_text(slide_rels_text)

    print(f"{slide_name}: {old_chart_name}.xml -> {new_chart_name}.xml (independent copy)")


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    unpacked = Path(sys.argv[1])
    slide_name = Path(sys.argv[2]).stem  # accepts "slide12.xml" or "slide12"
    rels_path = unpacked / "ppt" / "slides" / "_rels" / f"{slide_name}.xml.rels"
    if not rels_path.exists():
        print(f"error: {rels_path} not found", file=sys.stderr)
        sys.exit(1)
    rels_text = rels_path.read_text()
    chart_rels = re.findall(
        r'<Relationship Id="([^"]+)" Type="[^"]*/relationships/chart" Target="([^"]+)"/>',
        rels_text,
    )
    if not chart_rels:
        print(f"{slide_name}: no chart relationships found, nothing to do")
        return
    for rel_id, target in chart_rels:
        clone_chart(unpacked, slide_name, target, rel_id)


if __name__ == "__main__":
    main()
