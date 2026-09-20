/**
 * card/components/titlebar.mjs
 * Terminal titlebar: traffic lights + prompt + status badge.
 */

import { TITLEBAR, THEMES } from "../config.mjs";

export function buildTitlebar(theme) {
  const t = THEMES[theme];
  return `<g id="titlebar">
  <rect x="3" y="3" width="1174" height="34" rx="16" fill="${t.bg?.[1] ?? '#050F1F'}" fill-opacity="0.95"/>
  <circle cx="24" cy="20" r="5" fill="#FF4444"><animate attributeName="opacity" values="1;0.4;1" dur="4s" repeatCount="indefinite"/></circle>
  <circle cx="42" cy="20" r="5" fill="#FF6B00"><animate attributeName="opacity" values="1;0.4;1" dur="4s" begin="0.3s" repeatCount="indefinite"/></circle>
  <circle cx="60" cy="20" r="5" fill="#00FF9F"><animate attributeName="opacity" values="1;0.4;1" dur="4s" begin="0.6s" repeatCount="indefinite"/></circle>
  <text x="590" y="25" text-anchor="middle" font-family="'Courier New',monospace" font-size="11px" fill="${t.termLabel}" letter-spacing="0.5px">${TITLEBAR.prompt}</text>
  <circle cx="1108" cy="20" r="4" fill="${t.scanLabel}"><animate attributeName="opacity" values="1;0.1;1" dur="1.1s" repeatCount="indefinite"/></circle>
  <text x="1120" y="24" font-family="'Courier New',monospace" font-size="10px" fill="${t.scanLabel}" letter-spacing="1px">${TITLEBAR.statusLabel}</text>
</g>`;
}
