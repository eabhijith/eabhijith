/**
 * card/components/portrait.mjs
 * Left panel — computed from first principles, all values verified:
 *
 *  Card 1180×610, titlebar 38px → content 572px
 *  Left panel:  x=14,  y=10, w=488, h=536 → bottom=546
 *  Circle:      cx=258, cy=242, r=200
 *    top  = cy-r = 42  (panel_y+title_h = 10+32)
 *    bottom = cy+r = 442
 *    label1 = cy+r+18 = 460
 *    label2 = cy+r+34 = 476
 *    panel bottom = 546  → labels inside ✓
 */

import { PORTRAIT, THEMES } from "../config.mjs";
import fs   from "node:fs";
import path from "node:path";

export const SCAN = {
  CYCLE:    8.0,
  SCAN_DUR: 5.0,
  HOLD_DUR: 2.0,
  FADE_DUR: 0.5,
  FACE_TOP: 68,
  FACE_H:   374,  // cy+r - FACE_TOP = 442-68
};

export function buildPortrait(theme, tspanFile) {
  const t  = THEMES[theme];
  const { cx, cy, r } = PORTRAIT;

  let tspans = "";
  const tp = path.resolve(import.meta.dirname, "..", tspanFile);
  if (fs.existsSync(tp)) tspans = fs.readFileSync(tp, "utf8").trim();

  const { SCAN_DUR, CYCLE, FACE_TOP, FACE_H } = SCAN;
  const scanFrac = (SCAN_DUR / CYCLE).toFixed(3);

  // Panel dimensions (match config exactly)
  const PX = 14, PY = 10, PW = 488, PH = 536;

  return `
  <!-- ═══ LEFT PANEL x=${PX} y=${PY} w=${PW} h=${PH} bottom=${PY+PH} ═══ -->
  <rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" rx="8"
    fill="${t.bg[1]}" fill-opacity="0.4"
    stroke="url(#borderGrad)" stroke-width="1" opacity="0.5"/>

  <!-- title inside panel, 16px from top -->
  <text x="${PX+16}" y="${PY+20}"
    font-family="'Courier New',monospace" font-size="11px"
    fill="${t.panelTitle}" letter-spacing="2px" opacity="0.6">VISUAL.ID</text>
  <line x1="${PX}" y1="${PY+28}" x2="${PX+PW}" y2="${PY+28}"
    stroke="${t.panelTitle}" stroke-width="0.5" opacity="0.2"/>

  <!-- ASCII portrait: tspans use x=44 textLength=400 from working commit -->
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
    <rect x="${cx-r}" y="${FACE_TOP}" width="${r*2}" height="18"
      fill="${t.scanLine}" opacity="0.10">
      <animateTransform attributeName="transform" type="translate"
        from="0,0" to="0,${FACE_H}" dur="${CYCLE}s" repeatCount="indefinite"
        calcMode="linear" keyTimes="0;${scanFrac};1" values="0 0;0 ${FACE_H};0 ${FACE_H}"/>
    </rect>
    <rect x="${cx-r}" y="${FACE_TOP+7}" width="${r*2}" height="2"
      fill="${t.scanLine}" opacity="0.85">
      <animateTransform attributeName="transform" type="translate"
        from="0,0" to="0,${FACE_H}" dur="${CYCLE}s" repeatCount="indefinite"
        calcMode="linear" keyTimes="0;${scanFrac};1" values="0 0;0 ${FACE_H};0 ${FACE_H}"/>
    </rect>
  </g>

  <!-- pulsing ring -->
  <circle cx="${cx}" cy="${cy}" r="${r+16}" fill="none"
    stroke="${t.ring1}" stroke-width="1" opacity="0.4">
    <animate attributeName="r" values="${r+16};${r+24};${r+16}" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite"/>
  </circle>

  <!-- rotating dashed outer ring -->
  <circle cx="${cx}" cy="${cy}" r="${r+30}" fill="none"
    stroke="${t.ring2}" stroke-width="0.8" stroke-dasharray="6 4" opacity="0.25">
    <animateTransform attributeName="transform" type="rotate"
      from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="12s" repeatCount="indefinite"/>
  </circle>

  <!-- crisp portrait border -->
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
    stroke="${t.ring1}" stroke-width="2" opacity="0.9"/>

  <!-- presence dot: cx+r*0.7 ≈ 398, cy+r*0.7 ≈ 382 — inside panel (502) ✓ -->
  <circle cx="${Math.round(cx+r*0.7)}" cy="${Math.round(cy+r*0.7)}"
    r="8" fill="${t.presenceDot}" stroke="${t.bg[1]}" stroke-width="3">
    <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
  </circle>

  <!-- identity labels: cy+r+18=460, cy+r+34=476 — inside panel bottom 546 ✓ -->
  <text x="${cx}" y="${cy+r+18}" text-anchor="middle"
    font-family="'JetBrains Mono','Fira Code',monospace"
    font-size="14px" fill="${t.ring1}" font-weight="700" letter-spacing="3px">eabhijith</text>
  <text x="${cx}" y="${cy+r+34}" text-anchor="middle"
    font-family="'Courier New',monospace"
    font-size="9px" fill="${t.ring1}" opacity="0.4" letter-spacing="2px">agent · deployed · active</text>`;
}
