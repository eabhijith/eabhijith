/**
 * card/config.mjs
 * Card-specific layout config. All content/colors come from brand.mjs.
 */

import {
  USERNAME, ROLE, BASE, MISSION, STATUS, PHILOSOPHY, UPTIME, MANIFESTO,
  THEMES, CAPABILITIES, PROJECTS,
} from "../brand.mjs";

export { THEMES, CAPABILITIES, PROJECTS, MANIFESTO };

export const IDENTITY = {
  id:          USERNAME,
  designation: ROLE.replace("&", "&amp;"),
  base:        BASE,
  mission:     MISSION,
  status:      STATUS,
  philosophy:  PHILOSOPHY,
  uptime:      UPTIME,
  linkedin:    "linkedin.com/in/eabhijith",
  github:      `github.com/${USERNAME}`,
  website:     "eabhijith.vercel.app",
};

export const CARD = {
  width:  1180,
  height: 610,
  rx:     18,
};

export const PORTRAIT = {
  cx: 244,
  cy: 268,
  r:  200,
  cols:          52,
  rows:          46,
  lineH:         9.2,
  fontSize:      8,
  useTextLength: false,  // tspans already have textLength="400" baked in
  scanDur:       "3.5s",
};

export const PANEL = {
  x:      508,   // 8px grid: 500+8
  y:      26,    // match left panel top (y=26)
  width:  656,   // 508+656=1164, 16px right margin
  height: 468,   // match left panel height exactly
  rx:     8,     // 8px grid
  textX:  524,   // 508+16 = 524 (2×8px padding)
};

export const TITLEBAR = {
  prompt:      `guest@${USERNAME}:~$ cat profile.md`,
  statusLabel: "DEPLOYED",
};

/**
 * PORTRAIT REGENERATION
 * If portrait-tspans.txt ever needs rebuilding:
 *
 *   python3 card/regen-portrait.py
 *
 * This uses card/avatar.jpg (committed) — never regenerate from
 * a different source or the circle alignment will break.
 *
 * Working parameters (DO NOT CHANGE):
 *   x="44" textLength="400" lengthAdjust="spacingAndGlyphs"
 *   cx=244, cy=268, r=200
 *   52 cols × 46 rows, lineH=9.2, font-size=8px
 *   Avatar crop: y=35..200 (skip building background)
 *   Char map: "@#%*+=- . " dark→dense, light→sparse
 */
