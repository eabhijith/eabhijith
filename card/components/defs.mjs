/**
 * card/components/defs.mjs — rebuilt using ds/
 */
import { color } from "../../ds/tokens.mjs";
import { circle } from "../../ds/layout.mjs";

export function buildDefs(theme) {
  const dark = theme === "dark";
  const bg   = dark ? [color.bg2, color.bg1] : ["#F0F9FF", "#F8FAFC"];
  const asc  = dark ? [color.cyan, color.green] : ["#0369A1", "#047857"];
  const brd  = dark
    ? [color.cyan, color.green, color.amber]
    : ["#0369A1", "#047857", "#C2410C"];

  const { cx, cy, r } = circle;

  return `<defs>
  <radialGradient id="bgGrad" cx="25%" cy="25%" r="75%">
    <stop offset="0%" stop-color="${bg[0]}"/>
    <stop offset="100%" stop-color="${bg[1]}"/>
  </radialGradient>
  <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%"   stop-color="${brd[0]}"/>
    <stop offset="50%"  stop-color="${brd[1]}"/>
    <stop offset="100%" stop-color="${brd[2]}"/>
  </linearGradient>
  <linearGradient id="asciiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%"   stop-color="${asc[0]}"/>
    <stop offset="100%" stop-color="${asc[1]}"/>
  </linearGradient>
  <clipPath id="portraitClip">
    <circle cx="${cx}" cy="${cy}" r="${r}"/>
  </clipPath>
  <clipPath id="scanClip">
    <circle cx="${cx}" cy="${cy}" r="${r}"/>
  </clipPath>
</defs>`;
}
