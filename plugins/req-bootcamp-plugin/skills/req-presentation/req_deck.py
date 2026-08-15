"""REQ-branded PowerPoint builder — the look of REQ's own presentations, in one import.

Reproduces the styling of `REQ-presentasjon-mal.pptx` from the REQ design pack
(navy #001D6C as the single accent, Calibri, white slides, petrol section dividers).
Public material only — colours and logo are derived from req.no.

Usage:
    from req_deck import ReqDeck

    deck = ReqDeck("Presentasjonstittel", "Undertittel · 18. august 2026")
    deck.section("Seksjonstittel")
    deck.content("Innholdsoverskrift", [
        "Ett poeng per kule, med tall inne i setningen.",
        "Nøktern og redaksjonell — ingen emoji, ingen gradienter.",
    ], footer="REQ · tema")
    deck.figure("Konklusjonen som overskrift", "[figur/skjermbilde her]",
                source="Kilde: … Tall per [dato].")
    deck.closing()
    deck.save("min-presentasjon.pptx")
"""

import os

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.util import Inches, Pt

HERE = os.path.dirname(os.path.abspath(__file__))
LOGO_NAVY = os.path.join(HERE, "req-logo-navy.png")

# REQ brand — from req-design-pack/brand.md (public material only)
NAVY = (0x00, 0x1D, 0x6C)
PETROL = (0x00, 0x50, 0x70)
TEAL = (0x82, 0xC0, 0xC7)
INK = (0x1A, 0x1A, 0x1A)
GREY = (0x66, 0x66, 0x66)
HAIR = (0xE5, 0xE5, 0xE5)
WHITE = (0xFF, 0xFF, 0xFF)
FONT = "Calibri"
FONT_LIGHT = "Calibri Light"

SLIDE_W, SLIDE_H = Inches(13.333), Inches(7.5)
MARGIN = Inches(0.9)


class ReqDeck:
    """An REQ-styled deck. Construct with a title; add slides; save."""

    def __init__(self, title, subtitle=""):
        self.prs = Presentation()
        self.prs.slide_width, self.prs.slide_height = SLIDE_W, SLIDE_H
        self._blank = self.prs.slide_layouts[6]
        self.title(title, subtitle)

    # -- primitives ---------------------------------------------------------

    def _slide(self, bg=WHITE):
        s = self.prs.slides.add_slide(self._blank)
        s.background.fill.solid()
        s.background.fill.fore_color.rgb = RGBColor(*bg)
        return s

    def _box(self, s, x, y, w, h, text, size, color,
             bold=False, align=PP_ALIGN.LEFT, font=FONT, anchor=MSO_ANCHOR.TOP):
        tb = s.shapes.add_textbox(x, y, w, h)
        tf = tb.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = anchor
        p = tf.paragraphs[0]
        p.alignment = align
        run = p.add_run()
        run.text = text
        f = run.font
        f.name, f.size, f.bold = font, Pt(size), bold
        f.color.rgb = RGBColor(*color)
        return tb

    def _rule(self, s, x, y, w, color=HAIR, h=Pt(1)):
        shp = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, h)
        shp.fill.solid()
        shp.fill.fore_color.rgb = RGBColor(*color)
        shp.line.fill.background()
        shp.shadow.inherit = False
        return shp

    # -- slides -------------------------------------------------------------

    def title(self, title, subtitle=""):
        s = self._slide(WHITE)
        s.shapes.add_picture(LOGO_NAVY, MARGIN, Inches(0.7), width=Inches(1.6))
        self._box(s, MARGIN, Inches(2.9), SLIDE_W - 2 * MARGIN, Inches(1.4),
                  title, 40, NAVY, bold=True, font=FONT_LIGHT)
        if subtitle:
            self._box(s, MARGIN, Inches(4.2), SLIDE_W - 2 * MARGIN, Inches(0.5),
                      subtitle, 16, GREY)
        self._rule(s, MARGIN, Inches(6.6), Inches(2.0), color=TEAL, h=Pt(3))
        return s

    def section(self, title):
        s = self._slide(PETROL)
        self._box(s, MARGIN, Inches(3.0), SLIDE_W - 2 * MARGIN, Inches(1.2),
                  title, 34, WHITE, bold=True, font=FONT_LIGHT)
        self._box(s, MARGIN, Inches(6.7), Inches(4), Inches(0.4), "REQ", 14, TEAL, bold=True)
        return s

    def content(self, heading, bullets, footer=""):
        s = self._slide(WHITE)
        self._box(s, MARGIN, Inches(0.55), SLIDE_W - 2 * MARGIN, Inches(0.7),
                  heading, 26, NAVY, bold=True, font=FONT_LIGHT)
        self._rule(s, MARGIN, Inches(1.35), SLIDE_W - 2 * MARGIN)

        body = s.shapes.add_textbox(MARGIN, Inches(1.7), SLIDE_W - 2 * MARGIN, Inches(4.7))
        tf = body.text_frame
        tf.word_wrap = True
        points = bullets if isinstance(bullets, (list, tuple)) else [bullets]
        for i, point in enumerate(points):
            p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            p.space_after = Pt(14)
            dash = p.add_run()
            dash.text = "– "  # en dash + en space
            dash.font.name, dash.font.size = FONT, Pt(17)
            dash.font.bold = True
            dash.font.color.rgb = RGBColor(*NAVY)
            run = p.add_run()
            run.text = point
            run.font.name, run.font.size = FONT, Pt(17)
            run.font.color.rgb = RGBColor(*INK)
        if footer:
            self._box(s, MARGIN, Inches(6.9), Inches(9), Inches(0.35), footer, 10, GREY)
        return s

    def figure(self, heading, placeholder="", image=None, source=""):
        s = self._slide(WHITE)
        self._box(s, MARGIN, Inches(0.55), SLIDE_W - 2 * MARGIN, Inches(0.7),
                  heading, 26, NAVY, bold=True, font=FONT_LIGHT)
        self._rule(s, MARGIN, Inches(1.35), SLIDE_W - 2 * MARGIN)
        if image and os.path.exists(image):
            s.shapes.add_picture(image, MARGIN, Inches(1.7),
                                 width=SLIDE_W - 2 * MARGIN)
        elif placeholder:
            self._box(s, MARGIN, Inches(3.2), SLIDE_W - 2 * MARGIN, Inches(1.0),
                      placeholder, 14, GREY, align=PP_ALIGN.CENTER)
        if source:
            self._box(s, MARGIN, Inches(6.9), Inches(9), Inches(0.35), source, 10, GREY)
        return s

    def closing(self, line="Investing with insight. Building what's next."):
        s = self._slide(WHITE)
        s.shapes.add_picture(LOGO_NAVY, MARGIN, Inches(3.0), width=Inches(2.2))
        self._box(s, MARGIN, Inches(4.4), SLIDE_W - 2 * MARGIN, Inches(0.6),
                  line, 16, GREY)
        return s

    def save(self, path):
        self.prs.save(path)
        return path
