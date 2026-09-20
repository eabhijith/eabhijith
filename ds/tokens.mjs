/**
 * ds/tokens.mjs — Design Tokens
 * Single source of truth for every visual value.
 * Never hardcode colors/sizes anywhere else.
 */

// ── Spacing scale (base 8px) ──────────────────────────────────────────────────
export const space = {
  1:  8,
  2: 16,
  3: 24,
  4: 32,
  5: 40,
  6: 48,
  7: 56,
  8: 64,
};

// ── Typography ────────────────────────────────────────────────────────────────
export const font = {
  mono:   "'Courier New', Consolas, monospace",
  code:   "'JetBrains Mono', 'Fira Code', monospace",
  ascii:  "'Courier New', Consolas, monospace",
};

export const text = {
  xs:   9,
  sm:  11,
  md:  13,
  lg:  15,
  xl:  17,
};

export const lineHeight = 24;  // 3 × space[1] — all text on this grid

// ── Color palette ─────────────────────────────────────────────────────────────
export const color = {
  // Brand
  cyan:    "#00D4FF",
  green:   "#00FF9F",
  amber:   "#FF6B00",
  violet:  "#BD93F9",
  red:     "#FF4444",

  // Backgrounds
  bg0:     "#050816",   // deepest
  bg1:     "#0A0E1A",   // card background
  bg2:     "#0F1E3A",   // panel background (lighter)
  bg3:     "#11141F",   // right panel (dracula)

  // Dracula terminal
  dFg:     "#F8F8F2",
  dComment:"#6272A4",
  dGreen:  "#50FA7B",
  dPurple: "#BD93F9",
  dCyan:   "#8BE9FD",
  dOrange: "#FFB86C",

  // Borders / muted
  border:  "#1E3A5F",
  muted:   "#334155",
};

// ── Border radius ─────────────────────────────────────────────────────────────
export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
};

// ── Card dimensions ───────────────────────────────────────────────────────────
export const card = {
  w:    1180,
  h:    610,
  rx:   radius.lg,
  tb:   38,    // titlebar height
};
