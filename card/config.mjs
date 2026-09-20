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
  x:      508,
  y:      10,
  width:  655,
  height: 500,
  rx:     14,
  textX:  524,
};

export const TITLEBAR = {
  prompt:      `guest@${USERNAME}:~$ cat profile.md`,
  statusLabel: "DEPLOYED",
};
