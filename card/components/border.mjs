/**
 * card/components/border.mjs — rebuilt using ds/
 */
import { color, font, text, card } from "../../ds/tokens.mjs";
import { MANIFESTO } from "../config.mjs";

export function buildBorder(theme) {
  const dark = theme === "dark";
  const mCol = dark ? color.border : "#CBD5E1";

  return `
<text x="${card.w / 2}" y="${card.h - 14}" text-anchor="middle"
  font-family="${font.mono}" font-size="${text.xs}px"
  fill="${mCol}" letter-spacing="2px" opacity="0.6">${MANIFESTO}</text>
<rect x="3" y="3" width="${card.w - 6}" height="${card.h - 6}" rx="${card.rx - 2}"
  fill="none" stroke="url(#borderGrad)" stroke-width="1.5" opacity="0.7">
  <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3.2s" repeatCount="indefinite"/>
</rect>`;
}
