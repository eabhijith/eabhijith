/**
 * card/components/portrait.mjs
 * Left panel: circular ASCII portrait + scan sweep + ring + border.
 * ASCII tspans are injected at build time from a pre-generated file.
 */

import { PORTRAIT, THEMES } from "../config.mjs";
import fs from "node:fs";
import path from "node:path";

export function buildPortrait(theme, tspanFile) {
  const t = THEMES[theme];
  const { cx, cy, r, scanDur } = PORTRAIT;

  // Load pre-generated tspans or fall back to placeholder
  let tspans = "";
  const tspanPath = path.resolve(import.meta.dirname, "..", tspanFile);
  if (fs.existsSync(tspanPath)) {
    tspans = fs.readFileSync(tspanPath, "utf8").trim();
  }

  const scanTop = cy - r;
  const scanH   = r * 2;

  return `
  <!-- ── LEFT PANEL ────────────────────────────────── -->
  <rect x="14" y="26" width="488" height="468" rx="14"
    fill="${t.bg[1]}" fill-opacity="0.5"
    stroke="url(#borderGrad)" stroke-width="1" opacity="0.5"/>
  <text x="30" y="24" font-family="'Courier New',monospace" font-size="11px" fill="${t.panelTitle}" letter-spacing="2px" opacity="0.6">AGENT.VISUAL</text>

  <!-- portrait: ASCII clipped to circle -->
  <g clip-path="url(#portraitClip)">
    <text x="0" y="0"
      font-family="'Courier New',Consolas,monospace"
      font-size="${PORTRAIT.fontSize}px"
      letter-spacing="-0.2px"
      fill="url(#asciiGrad)">${tspans}
    </text>
  </g>

  <!-- scan sweep clipped to portrait circle -->
  <g clip-path="url(#scanClip)">
    <rect x="${cx - r}" y="${scanTop}" width="${r * 2}" height="12"
      fill="${t.scanLine}" opacity="0.12">
      <animateTransform attributeName="transform" type="translate"
        from="0,0" to="0,${scanH}" dur="${scanDur}"
        repeatCount="indefinite" calcMode="linear"/>
    </rect>
    <rect x="${cx - r}" y="${scanTop + 4}" width="${r * 2}" height="2"
      fill="${t.scanLine}" opacity="0.75">
      <animateTransform attributeName="transform" type="translate"
        from="0,0" to="0,${scanH}" dur="${scanDur}"
        repeatCount="indefinite" calcMode="linear"/>
    </rect>
  </g>

  <!-- pulsing ring -->
  <circle cx="${cx}" cy="${cy}" r="${r + 14}" fill="none"
    stroke="${t.ring1}" stroke-width="1" opacity="0.45">
    <animate attributeName="r" values="${r+14};${r+24};${r+14}" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.45;0.12;0.45" dur="3s" repeatCount="indefinite"/>
  </circle>

  <!-- scanning orbit ring -->
  <circle cx="${cx}" cy="${cy}" r="${r + 28}" fill="none"
    stroke="${t.ring2}" stroke-width="0.8" stroke-dasharray="6 4" opacity="0.3">
    <animateTransform attributeName="transform" type="rotate"
      from="0 ${cx} ${cy}" to="360 ${cx} ${cy}"
      dur="12s" repeatCount="indefinite"/>
  </circle>

  <!-- crisp border over portrait -->
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
    stroke="${t.ring1}" stroke-width="2.5" opacity="0.9"/>

  <!-- presence dot -->
  <circle cx="${cx + Math.round(r * 0.73)}" cy="${cy + Math.round(r * 0.73)}" r="10"
    fill="${t.presenceDot}" stroke="${t.bg[1]}" stroke-width="3"/>

  <!-- label -->
  <text x="${cx}" y="${cy + r + 26}" text-anchor="middle"
    font-family="'JetBrains Mono','Fira Code',monospace"
    font-size="15px" fill="${t.ring1}" font-weight="700" letter-spacing="3px">eabhijith</text>
  <text x="${cx}" y="${cy + r + 44}" text-anchor="middle"
    font-family="'Courier New',monospace"
    font-size="10px" fill="${t.ring1}" opacity="0.45" letter-spacing="2px">agent · deployed · active</text>`;
}
