/**
 * card/components/portrait.mjs
 * Left panel: circular ASCII portrait + coordinated scan sweep.
 *
 * Scan timing contract (exported for info-panel.mjs):
 *   CYCLE     = 8s total loop
 *   SCAN_DUR  = 5s  (scan travels face top→bottom)
 *   HOLD_DUR  = 2s  (all lines visible)
 *   FADE_DUR  = 0.5s (fade out)
 *   FACE_TOP  = 68  (local y where scan starts)
 *   FACE_H    = 400 (pixels scan travels)
 *
 * Each info line reveals when scan_t = (face_y - FACE_TOP) / FACE_H * SCAN_DUR
 */

import { PORTRAIT, THEMES } from "../config.mjs";
import fs from "node:fs";
import path from "node:path";

export const SCAN = {
  CYCLE:    8.0,
  SCAN_DUR: 5.0,
  HOLD_DUR: 2.0,
  FADE_DUR: 0.5,
  FACE_TOP: 68,
  FACE_H:   400,
};

export function buildPortrait(theme, tspanFile) {
  const t = THEMES[theme];
  const { cx, cy, r } = PORTRAIT;

  let tspans = "";
  const tspanPath = path.resolve(import.meta.dirname, "..", tspanFile);
  if (fs.existsSync(tspanPath)) {
    tspans = fs.readFileSync(tspanPath, "utf8").trim();
  }

  const scanTop = SCAN.FACE_TOP;
  const scanH   = SCAN.FACE_H;
  const dur     = `${SCAN.CYCLE}s`;

  // Scan rect: starts at face top, travels scanH px over SCAN_DUR seconds
  // Uses animateTransform — SMIL only, no CSS
  const scanFraction  = SCAN.SCAN_DUR  / SCAN.CYCLE;          // 0.625
  const holdEnd       = (SCAN.SCAN_DUR + SCAN.HOLD_DUR)       / SCAN.CYCLE;  // 0.875
  const fadeEnd       = (SCAN.SCAN_DUR + SCAN.HOLD_DUR + SCAN.FADE_DUR) / SCAN.CYCLE; // 0.9375

  return `
  <!-- ── LEFT PANEL ────────────────────────────────── -->
  <rect x="14" y="26" width="488" height="468" rx="14"
    fill="${t.bg[1]}" fill-opacity="0.4"
    stroke="url(#borderGrad)" stroke-width="1" opacity="0.5"/>
  <text x="30" y="24"
    font-family="'Courier New',monospace" font-size="11px"
    fill="${t.panelTitle}" letter-spacing="2px" opacity="0.6">AGENT.VISUAL</text>

  <!-- ASCII portrait clipped to circle -->
  <g clip-path="url(#portraitClip)">
    <text x="0" y="0"
      font-family="'Courier New',Consolas,monospace"
      font-size="${PORTRAIT.fontSize}px"
      letter-spacing="-0.2px"
      fill="url(#asciiGrad)">${tspans}
    </text>
  </g>

  <!-- scan sweep: glow layer -->
  <g clip-path="url(#scanClip)">
    <rect x="${cx - r}" y="${scanTop}" width="${r * 2}" height="18"
      fill="${t.scanLine}" opacity="0.10">
      <animateTransform attributeName="transform" type="translate"
        from="0,0" to="0,${scanH}"
        dur="${dur}" repeatCount="indefinite" calcMode="linear"
        keyTimes="0;${scanFraction.toFixed(3)};1"
        values="0 0;0 ${scanH};0 ${scanH}"/>
    </rect>
    <!-- bright scan line -->
    <rect x="${cx - r}" y="${scanTop + 7}" width="${r * 2}" height="2"
      fill="${t.scanLine}" opacity="0.85">
      <animateTransform attributeName="transform" type="translate"
        from="0,0" to="0,${scanH}"
        dur="${dur}" repeatCount="indefinite" calcMode="linear"
        keyTimes="0;${scanFraction.toFixed(3)};1"
        values="0 0;0 ${scanH};0 ${scanH}"/>
    </rect>
  </g>

  <!-- pulsing ring -->
  <circle cx="${cx}" cy="${cy}" r="${r + 16}" fill="none"
    stroke="${t.ring1}" stroke-width="1" opacity="0.4">
    <animate attributeName="r"
      values="${r+16};${r+26};${r+16}" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="opacity"
      values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite"/>
  </circle>

  <!-- rotating dashed outer ring -->
  <circle cx="${cx}" cy="${cy}" r="${r + 32}" fill="none"
    stroke="${t.ring2}" stroke-width="0.8"
    stroke-dasharray="6 4" opacity="0.3">
    <animateTransform attributeName="transform" type="rotate"
      from="0 ${cx} ${cy}" to="360 ${cx} ${cy}"
      dur="12s" repeatCount="indefinite"/>
  </circle>

  <!-- crisp border ring -->
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
    stroke="${t.ring1}" stroke-width="2.5" opacity="0.9"/>

  <!-- presence dot -->
  <circle cx="${cx + Math.round(r * 0.73)}" cy="${cy + Math.round(r * 0.73)}"
    r="10" fill="${t.presenceDot}" stroke="${t.bg[1]}" stroke-width="3">
    <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
  </circle>

  <!-- identity label -->
  <text x="${cx}" y="${cy + r + 26}" text-anchor="middle"
    font-family="'JetBrains Mono','Fira Code',monospace"
    font-size="15px" fill="${t.ring1}" font-weight="700" letter-spacing="3px">eabhijith</text>
  <text x="${cx}" y="${cy + r + 44}" text-anchor="middle"
    font-family="'Courier New',monospace"
    font-size="10px" fill="${t.ring1}" opacity="0.45" letter-spacing="2px">agent · deployed · active</text>`;
}
