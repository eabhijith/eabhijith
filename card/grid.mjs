/**
 * card/grid.mjs — THE GRID
 *
 * Single source of truth for all layout values.
 * Every position in every component is derived from these.
 * Change one value here → everything recalculates.
 *
 * Grid unit = 8px. All values are multiples of 8.
 */

// ── Base ──────────────────────────────────────────────────────────────────────
export const G  = 8;                    // grid unit
export const W  = 1180;                 // card width
export const H  = 610;                  // card height
export const TB = 38;                   // titlebar height (fixed)
export const M  = G * 2;               // outer margin = 16px

// ── Content area (inside translate(0, TB)) ────────────────────────────────────
export const CY = 0;                    // content starts at y=0 after translate
export const CH = H - TB;              // content height = 572

// ── Panels ────────────────────────────────────────────────────────────────────
export const PANEL = {
  y:   G,                              // 8
  h:   CH - G * 8,                    // 572 - 64 = 508  (leaves room for manifesto)
  gap: G,                              // 8 between panels
  rx:  G,                              // 8
};

// left panel
export const LP = {
  x: G * 2,                           // 16
  y: PANEL.y,                         // 8
  w: 480,                             // fixed left width
  h: PANEL.h,                         // 508
  get right() { return this.x + this.w; },     // 496
  get bottom() { return this.y + this.h; },    // 516
};

// right panel
export const RP = {
  x:  LP.right + PANEL.gap,           // 504
  y:  PANEL.y,                        // 8  — same as LP
  get w() { return W - this.x - M; }, // 1180 - 504 - 16 = 660
  h:  PANEL.h,                        // 508 — same as LP
  get right()  { return this.x + this.w; },
  get bottom() { return this.y + this.h; },
  get textX()  { return this.x + G * 2; },   // 520 — 2 grid units padding
};

// ── Portrait circle ──────────────────────────────────────────────────────────
// Fits inside LP with padding: title bar = G*5=40px, bottom padding G*3=24px
export const CIRC = {
  r:   G * 25,                        // 200
  get cx() { return LP.x + LP.w / 2; },    // 256
  get cy() {
    const topPad  = G * 5;            // 40px — below panel title
    const botPad  = G * 6;            // 48px — for name labels
    const available = LP.h - topPad - botPad;  // 508-40-48=420
    return LP.y + topPad + available / 2;       // 8+40+210=258
  },
  get top()    { return this.cy - this.r; },
  get bottom() { return this.cy + this.r; },
  // labels below circle, inside panel
  get label1Y() { return this.bottom + G * 3; },   // +24
  get label2Y() { return this.bottom + G * 5; },   // +40
};

// ── Title bars inside panels ──────────────────────────────────────────────────
export const TITLE_Y     = G * 3;     // 24 — baseline of title text
export const TITLE_LINE  = G * 4;     // 32 — underline y

// ── Right panel text grid ─────────────────────────────────────────────────────
export const LINE_H = G * 3;          // 24 — line height (3 grid units)
export const TEXT_START_Y = TITLE_LINE + G * 2;  // 32+16=48 — first text line baseline

// ── Scan ──────────────────────────────────────────────────────────────────────
export const SCAN = {
  CYCLE:    8.0,
  SCAN_DUR: 5.0,
  HOLD_DUR: 2.0,
  FADE_DUR: 0.5,
  get FACE_TOP() { return CIRC.top + G; },      // just inside circle top
  get FACE_H()   { return CIRC.r * 2 - G * 2; }, // circle height minus padding
};
