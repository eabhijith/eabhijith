/**
 * card/components/titlebar.mjs — rebuilt using ds/
 */
import { color, font, text } from "../../ds/tokens.mjs";
import { TITLEBAR } from "../config.mjs";

export function buildTitlebar(theme) {
  const dark = theme === "dark";
  const termLabel = dark ? color.border  : "#94A3B8";
  const statusCol = dark ? color.dGreen  : "#047857";

  return `<g id="titlebar">
  <rect x="3" y="3" width="1174" height="34" rx="16"
    fill="${dark ? color.bg1 : "#E2E8F0"}" fill-opacity="0.95"/>
  <circle cx="24" cy="20" r="5" fill="${color.red}">
    <animate attributeName="opacity" values="1;0.4;1" dur="4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="42" cy="20" r="5" fill="${color.amber}">
    <animate attributeName="opacity" values="1;0.4;1" dur="4s" begin="0.3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="60" cy="20" r="5" fill="${color.green}">
    <animate attributeName="opacity" values="1;0.4;1" dur="4s" begin="0.6s" repeatCount="indefinite"/>
  </circle>
  <text x="590" y="25" text-anchor="middle"
    font-family="${font.mono}" font-size="${text.sm}px"
    fill="${termLabel}" letter-spacing="0.5px">${TITLEBAR.prompt}</text>
  <circle cx="1108" cy="20" r="4" fill="${statusCol}">
    <animate attributeName="opacity" values="1;0.1;1" dur="1.1s" repeatCount="indefinite"/>
  </circle>
  <text x="1120" y="24"
    font-family="${font.mono}" font-size="${text.xs}px"
    fill="${statusCol}" letter-spacing="1px">${TITLEBAR.statusLabel}</text>
</g>`;
}
