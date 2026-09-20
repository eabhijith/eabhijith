/**
 * card/components/info-panel.mjs
 *
 * Right panel: each line reveals via clipPath width 0→full,
 * timed to when the scan line passes the corresponding face feature.
 *
 * Uses SMIL <animate> on <rect> inside <clipPath> — this is the
 * only approach that works in both browsers and GitHub's SVG renderer.
 *
 * Timing from SCAN in portrait.mjs:
 *   trigger_t = (face_y - FACE_TOP) / FACE_H * SCAN_DUR
 *   line reveals over 0.4s starting at trigger_t
 *   all fade out at holdEnd, reset at cycle end
 */

import { IDENTITY, PROJECTS, CAPABILITIES, PANEL, THEMES } from "../config.mjs";
import { SCAN } from "./portrait.mjs";

const LINE_W = 640;  // max width of a text line in the panel

let _clipIdx = 0;
function clipId() { return `cp${_clipIdx++}`; }

function revealLine(x, y, face_y, inner, theme) {
  const t = THEMES[theme];
  const { CYCLE, SCAN_DUR, HOLD_DUR, FADE_DUR, FACE_TOP, FACE_H } = SCAN;

  const trigger  = Math.max(0.05, (face_y - FACE_TOP) / FACE_H * SCAN_DUR);
  const revealEnd = trigger + 0.4;
  const holdEnd   = SCAN_DUR + HOLD_DUR;
  const fadeEnd   = holdEnd + FADE_DUR;

  // keyTimes: start, trigger, revealEnd, holdEnd, fadeEnd, cycle
  const kt = [
    "0",
    (trigger   / CYCLE).toFixed(3),
    (Math.min(revealEnd, holdEnd) / CYCLE).toFixed(3),
    (holdEnd   / CYCLE).toFixed(3),
    (fadeEnd   / CYCLE).toFixed(3),
    "1",
  ].join(";");

  // clipRect width: 0 at trigger, LINE_W at revealEnd, LINE_W through hold, 0 after fade
  const wv = `0;0;${LINE_W};${LINE_W};0;0`;

  const id = clipId();

  return [
    `<clipPath id="${id}"><rect x="${x}" y="${y - 16}" width="0" height="22">`,
    `  <animate attributeName="width" dur="${CYCLE}s" repeatCount="indefinite" keyTimes="${kt}" values="${wv}" calcMode="spline" keySplines="0 0 0.2 1;0.4 0 0.2 1;0 0 1 1;0.4 0 0.2 1;0 0 1 1"/>`,
    `</rect></clipPath>`,
    `<text x="${x}" y="${y}" clip-path="url(#${id})"`,
    `  font-family="'Courier New',monospace" font-size="13px">${inner}</text>`,
  ].join("\n");
}

export function buildInfoPanel(theme) {
  _clipIdx = 0;
  const t = THEMES[theme];
  const x = PANEL.textX;

  const kv = (key, val) =>
    `<tspan fill="${t.colComment}">  </tspan><tspan fill="${t.colKey}" font-weight="bold">${key}</tspan><tspan fill="${t.colComment}"> .. </tspan><tspan fill="${t.colValue}">${val}</tspan>`;
  const status_l = (key, val) =>
    `<tspan fill="${t.colComment}">  </tspan><tspan fill="${t.colKey}" font-weight="bold">${key}</tspan><tspan fill="${t.colComment}"> .. </tspan><tspan fill="${t.colStatus}" font-weight="bold">${val}</tspan>`;
  const section = (key) =>
    `<tspan fill="${t.colComment}">  </tspan><tspan fill="${t.colKey}" font-weight="bold">${key}</tspan><tspan fill="${t.colAccent}"> ────────────────</tspan>`;
  const item = (val) =>
    `<tspan fill="${t.colComment}">    </tspan><tspan fill="${t.colValue}">${val}</tspan>`;
  const prompt = () =>
    `<tspan fill="${t.colComment}">guest@</tspan><tspan fill="${t.colAccent}" font-weight="bold">${IDENTITY.id}</tspan><tspan fill="${t.colComment}">:~$ </tspan><tspan fill="${t.colValue}">cat profile.md</tspan>`;
  const web = (key, val) =>
    `<tspan fill="${t.colComment}">  </tspan><tspan fill="${t.colKey}" font-weight="bold">${key}</tspan><tspan fill="${t.colComment}"> .. </tspan><tspan fill="${t.colCyan}">${val}</tspan>`;

  // clipPath defs need to go into <defs> — we build them inline here
  // by embedding clipPath elements directly before each text element
  const rows = [
    [46,  68,  prompt()],
    [68,  100, kv("agent_id",    IDENTITY.id)],
    [90,  130, kv("designation", IDENTITY.designation)],
    [112, 160, kv("base",        IDENTITY.base)],
    [134, 190, kv("mission",     IDENTITY.mission)],
    [156, 220, status_l("status", IDENTITY.status)],
    [178, 260, section("capabilities")],
    ...CAPABILITIES.map((c, i) => [200 + i*22, 290 + i*30, item(c)]),
    [266, 370, section("side_projects")],
    ...PROJECTS.map((p, i) => [288 + i*22, 390 + i*20, item(`▸ ${p}`)]),
    [332, 430, kv("philosophy",  IDENTITY.philosophy)],
    [354, 445, kv("uptime",      IDENTITY.uptime)],
    [376, 455, kv("linkedin",    IDENTITY.linkedin)],
    [398, 462, kv("github",      IDENTITY.github)],
    [420, 468, web("website",    IDENTITY.website)],
  ].map(([y, face_y, inner]) => revealLine(x, y, face_y, inner, theme)).join("\n");

  // Blinking cursor — appears when scan finishes, fades with rest
  const { CYCLE, SCAN_DUR, HOLD_DUR, FADE_DUR } = SCAN;
  const cursorStart = (SCAN_DUR / CYCLE).toFixed(3);
  const holdEnd     = ((SCAN_DUR + HOLD_DUR) / CYCLE).toFixed(3);
  const fadeEnd     = ((SCAN_DUR + HOLD_DUR + FADE_DUR) / CYCLE).toFixed(3);

  const cursor = [
    `<rect x="${x}" y="428" width="8" height="14" fill="${t.colCursor}" opacity="0">`,
    `  <animate attributeName="opacity" dur="${CYCLE}s" repeatCount="indefinite"`,
    `    keyTimes="0;${cursorStart};${holdEnd};${fadeEnd};1"`,
    `    values="0;1;1;0;0"/>`,
    `  <animate attributeName="opacity" values="1;0;1" dur="0.55s" repeatCount="indefinite"`,
    `    begin="${SCAN_DUR}s"/>`,
    `</rect>`,
  ].join("\n  ");

  return `
  <!-- ── RIGHT PANEL ───────────────────────────────── -->
  <rect x="${PANEL.x}" y="${PANEL.y}" width="${PANEL.width}" height="${PANEL.height}" rx="${PANEL.rx}"
    fill="${t.panelFill}" fill-opacity="0.85"
    stroke="${t.panelStroke}" stroke-width="1" opacity="0.7"/>
  <text x="${PANEL.textX}" y="24"
    font-family="'Courier New',monospace" font-size="11px"
    fill="${t.panelTitle}" letter-spacing="2px" opacity="0.6">AGENT.MANIFEST</text>
  <line x1="${PANEL.x}" y1="30" x2="${PANEL.x + PANEL.width}" y2="30"
    stroke="${t.panelStroke}" stroke-width="0.5" opacity="0.3"/>
  <line x1="${PANEL.textX}" y1="172" x2="1155" y2="172" stroke="${t.colComment}" stroke-width="0.4" opacity="0.3"/>
  <line x1="${PANEL.textX}" y1="278" x2="1155" y2="278" stroke="${t.colComment}" stroke-width="0.4" opacity="0.3"/>
  <line x1="${PANEL.textX}" y1="346" x2="1155" y2="346" stroke="${t.colComment}" stroke-width="0.4" opacity="0.3"/>
${rows}
  ${cursor}`;
}
