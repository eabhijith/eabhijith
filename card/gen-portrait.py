#!/usr/bin/env python3
"""
card/gen-portrait.py — ASCII portrait generator

Produces the <tspan> rows consumed by card/components/portrait.mjs.
Reads the committed card/avatar.jpg, so it needs no network. Run manually
when the avatar changes; the output is committed, so this never runs in CI
and adds no workflow dependency.

    python3 card/gen-portrait.py

Replaces the old regenAscii() path in card/build.mjs, which needed the
native `canvas` package (never listed in package.json), read a `charW`
field that no longer exists in PORTRAIT (making startX NaN), and mapped
dark pixels to dense glyphs — tonally inverting the portrait on the dark
card (measured correlation -0.84 between luminance and glyph density).

Polarity: this avatar's background (mean luminance 177) is BRIGHTER than the
subject (130), so dark pixels map to dense glyphs. That puts the ink on the
face and empties the background - correct for BOTH themes, since dense glyphs
simply mean "more ink" (bright cyan on the dark card, dark blue on the light
card). The original generator did this deliberately; it is preserved here.
"""
import sys, subprocess, pathlib
from PIL import Image, ImageOps

AVATAR = "card/avatar.jpg"   # committed; no network needed
COLS, ROWS = 52, 46
BLOCK_W    = 400.0          # rendered width  (textLength in the tspans)
LINE_H     = 9.2            # must match PORTRAIT.lineH
START_X    = 44             # must match the circle framing in ds/layout.mjs
START_Y    = 66

# Sparse -> dense. Ordered by ink coverage in Courier New.
RAMP = " .,:;=+*#%@"
LO_PCT, HI_PCT = 2.0, 98.0  # contrast stretch clip points
GAMMA = 0.85                # <1 lifts midtones so faces keep detail

def percentile(vals, pct):
    s = sorted(vals)
    k = (len(s) - 1) * pct / 100.0
    lo, hi = int(k), min(int(k) + 1, len(s) - 1)
    return s[lo] + (s[hi] - s[lo]) * (k - lo)

def build(invert):
    img = Image.open(AVATAR).convert("L")
    img = ImageOps.autocontrast(img, cutoff=1)
    # LANCZOS is area-weighted, unlike the old direct drawImage downscale.
    small = img.resize((COLS, ROWS), Image.LANCZOS)
    px = small.load()

    cx, cy = (COLS - 1) / 2.0, (ROWS - 1) / 2.0
    rad = COLS / 2.0 - 0.5

    inside = [px[x, y] for y in range(ROWS) for x in range(COLS)
              if ((x - cx) / rad) ** 2 + ((y - cy) * (COLS / ROWS) / rad) ** 2 <= 1.0]
    lo, hi = percentile(inside, LO_PCT), percentile(inside, HI_PCT)
    span = max(1.0, hi - lo)

    rows = []
    for y in range(ROWS):
        line = []
        for x in range(COLS):
                    # Ellipse test in grid space so the mask matches the round clip.
            if ((x - cx) / rad) ** 2 + ((y - cy) * (COLS / ROWS) / rad) ** 2 > 1.0:
                line.append(" ")
                continue
            v = (px[x, y] - lo) / span
            v = 0.0 if v < 0 else 1.0 if v > 1 else v
            v = v ** GAMMA
            if invert:
                v = 1.0 - v
            line.append(RAMP[int(round(v * (len(RAMP) - 1)))])
        txt = "".join(line).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        sy = round(START_Y + y * LINE_H)
        rows.append(f'<tspan x="{START_X}" y="{sy}" textLength="{BLOCK_W:.0f}" '
                    f'lengthAdjust="spacingAndGlyphs">{txt}</tspan>')
    return "\n".join(rows)

# invert=True -> dark pixel becomes a dense glyph -> the subject carries the ink.
out = "card/portrait-tspans.txt"
open(out, "w").write(build(invert=True) + "\n")
print(f"{out} written ({ROWS} rows)")
