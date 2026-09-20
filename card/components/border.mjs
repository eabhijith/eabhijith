/**
 * card/components/border.mjs
 * Outer pulsing border + manifesto footer line.
 */

import { CARD, MANIFESTO, THEMES } from "../config.mjs";

export function buildBorder(theme) {
  const t = THEMES[theme];
  return `
<text x="${CARD.width / 2}" y="${CARD.height - 17}" text-anchor="middle"
  font-family="'Courier New',monospace" font-size="13px"
  fill="${t.colManifesto}" letter-spacing="2px">${MANIFESTO}</text>
<rect x="3" y="3" width="${CARD.width - 6}" height="${CARD.height - 6}" rx="${CARD.rx - 2}"
  fill="none" stroke="url(#borderGrad)" stroke-width="1.5" opacity="0.7">
  <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3.2s" repeatCount="indefinite"/>
</rect>`;
}
