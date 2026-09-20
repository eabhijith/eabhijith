/**
 * ds/layout.mjs — Layout System
 * All layout boxes computed from tokens. Zero magic numbers anywhere else.
 *
 * Coordinate system: SVG local coords inside <g transform="translate(0,38)">
 * So y=0 is just below the titlebar.
 */

import { space, card, radius, lineHeight } from "./tokens.mjs";

const G = space[1];  // 8px grid unit

// ── Content area ──────────────────────────────────────────────────────────────
export const content = {
  w: card.w,
  h: card.h - card.tb,   // 572
};

// ── Panel baseline ────────────────────────────────────────────────────────────
const PANEL_Y       = G;             // 8  — top of both panels
const PANEL_BOTTOM  = content.h - G * 8;  // 572 - 64 = 508
const PANEL_H       = PANEL_BOTTOM - PANEL_Y;  // 500

// ── Left panel ────────────────────────────────────────────────────────────────
export const leftPanel = {
  x:   G * 2,          // 16
  y:   PANEL_Y,        // 8
  w:   480,            // fixed
  h:   PANEL_H,        // 500
  rx:  radius.md,      // 8
  get r()      { return this.x + this.w; },   // 496
  get b()      { return this.y + this.h; },   // 508
  get cx()     { return this.x + this.w / 2; }, // 256
  get titleY() { return this.y + G * 3; },    // 32 — title baseline
  get lineY()  { return this.y + G * 4; },    // 40 — title underline
};

// ── Right panel ───────────────────────────────────────────────────────────────
const RP_X = leftPanel.r + G;  // 504

export const rightPanel = {
  x:   RP_X,
  y:   PANEL_Y,        // same as left
  w:   card.w - RP_X - G * 2,  // 1180-504-16=660
  h:   PANEL_H,        // same as left
  rx:  radius.md,
  get r()      { return this.x + this.w; },
  get b()      { return this.y + this.h; },
  get titleY() { return this.y + G * 3; },    // 32
  get lineY()  { return this.y + G * 4; },    // 40
  get textX()  { return this.x + G * 2; },    // 520 — text left edge
  get textW()  { return this.w - G * 4; },    // text area width
  // First content line: title underline + 1 grid unit
  get firstLineY() { return this.lineY + G * 2; },  // 56
};

// ── Portrait circle ───────────────────────────────────────────────────────────
// Centred in left panel, with title bar above and name label below
const CIRCLE_TOP_PAD  = leftPanel.lineY + G * 2;  // 56 — below title
const CIRCLE_BOT_PAD  = G * 6;                    // 48 — for name + subtitle
const CIRCLE_AVAIL    = leftPanel.h - (CIRCLE_TOP_PAD - leftPanel.y) - CIRCLE_BOT_PAD;
// 500 - (56-8) - 48 = 500-48-48 = 404
const CIRCLE_R_MAX    = Math.floor(CIRCLE_AVAIL / 2 / G) * G;  // snap to 8px = 200

export const circle = {
  r:   CIRCLE_R_MAX,                                    // 200
  cx:  leftPanel.cx,                                    // 256
  cy:  CIRCLE_TOP_PAD + CIRCLE_R_MAX,                   // 56+200=256
  get top()    { return this.cy - this.r; },            // 56
  get bottom() { return this.cy + this.r; },            // 456
  // Name label: bottom + 2 grid units
  get nameY()  { return this.bottom + G * 3; },         // 456+24=480
  // Subtitle: name + 1 line height
  get subY()   { return this.nameY + lineHeight; },     // 504 < panel bottom 508 ✓
};

// ── Scan line ─────────────────────────────────────────────────────────────────
export const scan = {
  CYCLE:    8.0,
  SCAN_DUR: 5.0,
  FACE_TOP: circle.top + G,          // 64
  FACE_H:   circle.r * 2 - G * 2,   // 384
};

// ── Text grid for right panel ─────────────────────────────────────────────────
// All lines on lineHeight (24px) grid starting from firstLineY
export function lineY(n) {
  return rightPanel.firstLineY + n * lineHeight;
}

// ── Debug: print all values ───────────────────────────────────────────────────
export function debug() {
  console.log("=== LAYOUT DEBUG ===");
  console.log(`Content: ${content.w}×${content.h}`);
  console.log(`Left panel: x=${leftPanel.x} y=${leftPanel.y} w=${leftPanel.w} h=${leftPanel.h} → bottom=${leftPanel.b}`);
  console.log(`Right panel: x=${rightPanel.x} y=${rightPanel.y} w=${rightPanel.w} h=${rightPanel.h} → bottom=${rightPanel.b}`);
  console.log(`Circle: cx=${circle.cx} cy=${circle.cy} r=${circle.r}`);
  console.log(`  top=${circle.top} bottom=${circle.bottom}`);
  console.log(`  nameY=${circle.nameY} subY=${circle.subY} panelBottom=${leftPanel.b}`);
  console.log(`  labels inside panel: ${circle.subY < leftPanel.b}`);
  console.log(`Scan: FACE_TOP=${scan.FACE_TOP} FACE_H=${scan.FACE_H}`);
  console.log(`Right text: x=${rightPanel.textX} firstLine=${rightPanel.firstLineY}`);
  console.log(`Line positions: ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map(n => lineY(n)).join(", ")}`);
}
