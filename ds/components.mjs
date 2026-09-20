/**
 * ds/components.mjs — SVG Component Primitives
 * Reusable SVG building blocks using design tokens + layout.
 */

import { color, font, text, radius } from "./tokens.mjs";
import { leftPanel, rightPanel, circle } from "./layout.mjs";

// ── Panel box ─────────────────────────────────────────────────────────────────
export function panelBox({ x, y, w, h, rx, fillColor, strokeColor, opacity = 0.5 }) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"
  fill="${fillColor}" fill-opacity="0.85"
  stroke="${strokeColor}" stroke-width="1" opacity="${opacity}"/>`;
}

// ── Panel title + underline ────────────────────────────────────────────────────
export function panelTitle({ label, x, titleY, lineY, lineX2, titleColor, lineColor }) {
  return `<text x="${x}" y="${titleY}"
  font-family="${font.mono}" font-size="${text.sm}px"
  fill="${titleColor}" letter-spacing="2px" opacity="0.6">${label}</text>
<line x1="${x}" y1="${lineY}" x2="${lineX2}" y2="${lineY}"
  stroke="${lineColor}" stroke-width="0.5" opacity="0.25"/>`;
}

// ── Section divider line ──────────────────────────────────────────────────────
export function dividerLine({ x1, x2, y, col }) {
  return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"
  stroke="${col}" stroke-width="0.4" opacity="0.3"/>`;
}

// ── Typewriter line (reveal once, stay forever) ───────────────────────────────
let _cpIdx = 0;
export function resetClipIdx() { _cpIdx = 0; }

export function typewriterLine({ x, y, triggerSec, inner, maxW = 640 }) {
  const id = `cp${_cpIdx++}`;
  return [
    `<clipPath id="${id}"><rect x="${x}" y="${y - 18}" width="0" height="24">`,
    `  <animate attributeName="width" from="0" to="${maxW}"`,
    `    dur="0.4s" begin="${triggerSec.toFixed(2)}s" fill="freeze"`,
    `    calcMode="spline" keySplines="0.4 0 0.2 1"/>`,
    `</rect></clipPath>`,
    `<text x="${x}" y="${y}" clip-path="url(#${id})"`,
    `  font-family="${font.mono}" font-size="${text.md}px">${inner}</text>`,
  ].join("\n");
}

// ── Terminal text spans ───────────────────────────────────────────────────────
export const t = {
  comment: (s) => `<tspan fill="${color.dComment}">${s}</tspan>`,
  green:   (s) => `<tspan fill="${color.dGreen}" font-weight="bold">${s}</tspan>`,
  purple:  (s) => `<tspan fill="${color.dPurple}" font-weight="bold">${s}</tspan>`,
  white:   (s) => `<tspan fill="${color.dFg}">${s}</tspan>`,
  cyan:    (s) => `<tspan fill="${color.dCyan}">${s}</tspan>`,
  amber:   (s) => `<tspan fill="${color.dOrange}">${s}</tspan>`,
  dim:     (s) => `<tspan fill="${color.dComment}"> .. </tspan><tspan fill="${color.dFg}">${s}</tspan>`,
  // key: value line
  kv:      (k, v) => `${t.comment("  ")}${t.purple(k)}${t.dim(v)}`,
  // status line (green value)
  status:  (k, v) => `${t.comment("  ")}${t.purple(k)}${t.comment(" .. ")}${t.green(v)}`,
  // section header
  section: (k)    => `${t.comment("  ")}${t.purple(k)}<tspan fill="${color.dGreen}"> ──────────────────</tspan>`,
  // item
  item:    (v)    => `${t.comment("    ")}${t.white(v)}`,
  // website
  web:     (k, v) => `${t.comment("  ")}${t.purple(k)}${t.comment(" .. ")}${t.cyan(v)}`,
  // prompt
  prompt:  (cmd)  => `${t.comment("$ ")}${t.white(cmd)}`,
};
