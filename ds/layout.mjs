/**
 * ds/layout.mjs — Layout System
 * All layout boxes computed from tokens. Zero magic numbers anywhere else.
 */

import { space, card, radius } from "./tokens.mjs";

const G = space[1];  // 8px

// ── Content area (inside <g transform="translate(0,38)"> ──────────────────────
export const content = {
  w: card.w,
  h: card.h - card.tb,   // 572
};

// ── Panels — both identical height and position ───────────────────────────────
const PANEL_Y  = G;            // 8
const PANEL_H  = 540;          // fixed — gives room for circle+labels on left, all lines on right
const PANEL_RX = radius.md;    // 8

// ── Left panel ────────────────────────────────────────────────────────────────
export const leftPanel = {
  x:   G * 2,                  // 16
  y:   PANEL_Y,                // 8
  w:   480,
  h:   PANEL_H,                // 540
  rx:  PANEL_RX,
  get r()      { return this.x + this.w; },   // 496
  get b()      { return this.y + this.h; },   // 548
  get cx()     { return this.x + this.w / 2; }, // 256
  get titleY() { return this.y + G * 3; },    // 32
  get lineY()  { return this.y + G * 4; },    // 40
};

// ── Right panel ───────────────────────────────────────────────────────────────
const RP_X = leftPanel.r + G;  // 504

export const rightPanel = {
  x:   RP_X,                   // 504
  y:   PANEL_Y,                // 8
  w:   card.w - RP_X - G * 2, // 660
  h:   PANEL_H,                // 540
  rx:  PANEL_RX,
  get r()          { return this.x + this.w; },
  get b()          { return this.y + this.h; },
  get titleY()     { return this.y + G * 3; },  // 32
  get lineY()      { return this.y + G * 4; },  // 40
  get textX()      { return this.x + G * 2; },  // 520
  // First content line y (below title underline + 1 grid unit)
  get firstLineY() { return this.lineY + G * 2; }, // 56
};

// ── Portrait circle ───────────────────────────────────────────────────────────
// r=192 → circle top=48 (below title at y=40), bottom=432
// Two decorative rings sit outside the border: a pulsing ring that reaches
// r+24 and a rotating dashed ring at r+28. Labels must clear the OUTER ring,
// not the border — measuring from `bottom` put the name baseline at 456, where
// the dashed ring still spans x=214..298 and cut straight through the text.
export const circle = {
  r:   192,
  ringPulseMax: 24,                                // pulsing ring peak offset
  ringDashed:   28,                                // rotating dashed ring offset
  get cx()     { return leftPanel.cx; },           // 256
  get cy()     { return leftPanel.lineY + G + this.r; }, // 40+8+192=240
  get top()    { return this.cy - this.r; },       // 48
  get bottom() { return this.cy + this.r; },       // 432
  // Outermost painted pixel of the whole portrait assembly.
  get ringOuter()  { return this.r + Math.max(this.ringPulseMax, this.ringDashed); }, // 220
  get ringBottom() { return this.cy + this.ringOuter; },  // 460
  get nameY()  { return this.ringBottom + G * 4; },       // 492
  get subY()   { return this.nameY + G * 2 + 2; },        // 502
};

// ── Scan line ─────────────────────────────────────────────────────────────────
export const scan = {
  CYCLE:    8.0,
  SCAN_DUR: 5.0,
  get FACE_TOP() { return circle.top + G; },       // 56
  get FACE_H()   { return circle.r * 2 - G * 2; }, // 368
};

// ── Right panel text grid ─────────────────────────────────────────────────────
// 20px line height → 23 lines × 20 = 460px, starts at y=56, ends at y=516 < panel 548 ✓
export const LINE_H = 20;

export function lineY(n) {
  return rightPanel.firstLineY + n * LINE_H;
}

// ── Validation ────────────────────────────────────────────────────────────────
export function debug() {
  const maxLine = 22;
  console.log("=== LAYOUT ===");
  console.log(`Panels: y=${PANEL_Y} h=${PANEL_H} bottom=${PANEL_Y+PANEL_H}`);
  console.log(`Left: x=${leftPanel.x} w=${leftPanel.w} → right=${leftPanel.r} bottom=${leftPanel.b}`);
  console.log(`Right: x=${rightPanel.x} w=${rightPanel.w} → right=${rightPanel.r} bottom=${rightPanel.b}`);
  console.log(`Circle: cx=${circle.cx} cy=${circle.cy} r=${circle.r}`);
  console.log(`  top=${circle.top} bottom=${circle.bottom}`);
  console.log(`  nameY=${circle.nameY} subY=${circle.subY} panelBottom=${leftPanel.b}`);
  console.log(`  labels inside: ${circle.subY < leftPanel.b} ✓`);
  console.log(`Lines: ${maxLine+1} × ${LINE_H}px = ${(maxLine+1)*LINE_H}px`);
  console.log(`  lastLine y=${lineY(maxLine)} panelBottom=${rightPanel.b}`);
  console.log(`  fits: ${lineY(maxLine) < rightPanel.b} ✓`);
}
