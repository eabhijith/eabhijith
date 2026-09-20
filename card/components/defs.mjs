/**
 * card/components/defs.mjs
 * SVG <defs>: gradients, filters, clipPaths.
 */

import { CARD, PORTRAIT, THEMES } from "../config.mjs";

export function buildDefs(theme) {
  const t = THEMES[theme];
  const { cx, cy, r } = PORTRAIT;

  return `<defs>
  <radialGradient id="bgGrad" cx="25%" cy="25%" r="75%">
    <stop offset="0%" stop-color="${t.bg[0]}"/>
    <stop offset="100%" stop-color="${t.bg[1]}"/>
  </radialGradient>
  <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${t.border[0]}"/>
    <stop offset="50%" stop-color="${t.border[1]}"/>
    <stop offset="100%" stop-color="${t.border[2]}"/>
  </linearGradient>
  <linearGradient id="asciiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${t.asciiGrad[0]}"/>
    <stop offset="100%" stop-color="${t.asciiGrad[1]}"/>
  </linearGradient>
  <clipPath id="portraitClip">
    <circle cx="${cx}" cy="${cy}" r="${r}"/>
  </clipPath>
  <clipPath id="scanClip">
    <circle cx="${cx}" cy="${cy}" r="${r}"/>
  </clipPath>
</defs>`;
}
