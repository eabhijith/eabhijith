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
  cx: 258,   // LEFT_X + LEFT_W/2 = 14 + 244 = 258
  cy: 242,   // panel_y(10) + title(32) + r(200) = 242
  r:  200,
  cols:          52,
  rows:          46,
  lineH:         9.2,
  fontSize:      8,
  useTextLength: false,
  scanDur:       "3.5s",
};

export const PANEL = {
  x:      510,   // 14+488+8
  y:      10,    // same as left panel
  width:  654,   // 1180-510-16
  height: 536,   // 572-10-26 (content_h - panel_y - footer)
  rx:     8,
  textX:  526,   // 510+16
};

export const TITLEBAR = {
  prompt:      `guest@${USERNAME}:~$ cat profile.md`,
  statusLabel: "ONLINE",
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
