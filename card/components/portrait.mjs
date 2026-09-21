/**
 * card/components/portrait.mjs — rebuilt using ds/
 */
import { color, font, text as textSize } from "../../ds/tokens.mjs";
import { leftPanel, circle, scan } from "../../ds/layout.mjs";
import { panelBox, panelTitle } from "../../ds/components.mjs";
import { PORTRAIT } from "../config.mjs";
import { ROLE, BASE } from "../../brand.mjs";
import fs   from "node:fs";
import path from "node:path";

// Portrait subtitle — driven by brand.mjs
const SUBTITLE = `${ROLE.replace("&", "&amp;")} · ${BASE.split(",")[0].trim()}`;

// Export scan for info-panel.mjs
export const SCAN = {
  CYCLE:    scan.CYCLE,
  SCAN_DUR: scan.SCAN_DUR,
  HOLD_DUR: 2.0,
  FADE_DUR: 0.5,
  FACE_TOP: scan.FACE_TOP,
  FACE_H:   scan.FACE_H,
};

export function buildPortrait(theme, tspanFile) {
  const dark  = theme === "dark";
  const ring1 = dark ? color.cyan   : "#0369A1";
  const ring2 = dark ? color.green  : "#047857";
  const pFill = dark ? color.bg2    : "#E8F4FD";
  const pStroke = "url(#borderGrad)";
  const pDot  = dark ? color.green  : "#047857";
  const bg    = dark ? color.bg1    : "#F8FAFC";
  const ptCol = dark ? color.cyan   : "#0369A1";

  const { cx, cy, r }  = circle;
  const { x, y, w, h, r: lpr, b, titleY, lineY } = leftPanel;
  const { FACE_TOP, FACE_H, SCAN_DUR, CYCLE } = SCAN;
  const scanFrac = (SCAN_DUR / CYCLE).toFixed(3);

  let tspans = "";
  const tp = path.resolve(import.meta.dirname, "..", tspanFile);
  if (fs.existsSync(tp)) tspans = fs.readFileSync(tp, "utf8").trim();

  return `
  ${panelBox({ x, y, w, h, rx: 8, fillColor: pFill, strokeColor: pStroke })}
  ${panelTitle({ label: "VISUAL.ID", x: x + 16, titleY, lineY, lineX2: lpr, titleColor: ptCol, lineColor: ptCol })}

  <!-- Portrait: ASCII clipped to circle -->
  <g clip-path="url(#portraitClip)">
    <text x="0" y="0"
      font-family="${font.ascii}" font-size="${PORTRAIT.fontSize}px"
      letter-spacing="-0.2px" fill="url(#asciiGrad)">${tspans}
    </text>
  </g>

  <!-- Scan sweep (loop) -->
  <g clip-path="url(#scanClip)">
    <rect x="${cx-r}" y="${FACE_TOP}" width="${r*2}" height="16"
      fill="${ring1}" opacity="0.08">
      <animateTransform attributeName="transform" type="translate"
        from="0,0" to="0,${FACE_H}" dur="${CYCLE}s" repeatCount="indefinite"
        calcMode="linear" keyTimes="0;${scanFrac};1" values="0 0;0 ${FACE_H};0 ${FACE_H}"/>
    </rect>
    <rect x="${cx-r}" y="${FACE_TOP+6}" width="${r*2}" height="2"
      fill="${ring1}" opacity="0.8">
      <animateTransform attributeName="transform" type="translate"
        from="0,0" to="0,${FACE_H}" dur="${CYCLE}s" repeatCount="indefinite"
        calcMode="linear" keyTimes="0;${scanFrac};1" values="0 0;0 ${FACE_H};0 ${FACE_H}"/>
    </rect>
  </g>

  <!-- Pulsing ring -->
  <circle cx="${cx}" cy="${cy}" r="${r+16}" fill="none"
    stroke="${ring1}" stroke-width="1" opacity="0.35">
    <animate attributeName="r" values="${r+16};${r+24};${r+16}" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.35;0.08;0.35" dur="3s" repeatCount="indefinite"/>
  </circle>

  <!-- Rotating dashed ring -->
  <circle cx="${cx}" cy="${cy}" r="${r+28}" fill="none"
    stroke="${ring2}" stroke-width="0.8" stroke-dasharray="6 4" opacity="0.2">
    <animateTransform attributeName="transform" type="rotate"
      from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="14s" repeatCount="indefinite"/>
  </circle>

  <!-- Portrait border -->
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
    stroke="${ring1}" stroke-width="2" opacity="0.9"/>

  <!-- Presence dot -->
  <circle cx="${Math.round(cx+r*0.68)}" cy="${Math.round(cy+r*0.68)}"
    r="7" fill="${pDot}" stroke="${bg}" stroke-width="3">
    <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite"/>
  </circle>

  <!-- Name: circle.nameY=${circle.nameY}, inside panel bottom ${b} ✓ -->
  <text x="${cx}" y="${circle.nameY}" text-anchor="middle"
    font-family="${font.code}" font-size="${textSize.lg}px"
    fill="${ring1}" font-weight="700" letter-spacing="2px">Abhijith Eanuga</text>

  <!-- Subtitle: circle.subY=${circle.subY} < panel bottom ${b} ✓ -->
  <text x="${cx}" y="${circle.subY}" text-anchor="middle"
    font-family="${font.mono}" font-size="${textSize.xs}px"
    fill="${ring1}" opacity="0.4" letter-spacing="1px">${SUBTITLE}</text>`;
}
