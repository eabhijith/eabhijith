/**
 * card/components/info-panel.mjs
 *
 * Right panel: each line fades in when the scan line passes
 * the corresponding face feature on the left. Uses SMIL <animate>
 * (opacity 0→1) synced to SCAN timing from portrait.mjs.
 *
 * Timing formula:
 *   trigger_t = (face_y - FACE_TOP) / FACE_H * SCAN_DUR
 *   reveal keyTimes: 0; trigger_t/CYCLE; (trigger_t+0.25)/CYCLE; holdEnd; fadeEnd; 1
 *   reveal values:   0; 0;               1;                       1;       0;       0
 */

import { IDENTITY, PROJECTS, CAPABILITIES, PANEL, THEMES } from "../config.mjs";
import { SCAN } from "./portrait.mjs";

function opacityAnim(face_y) {
  const { CYCLE, SCAN_DUR, HOLD_DUR, FADE_DUR, FACE_TOP, FACE_H } = SCAN;
  const t        = Math.max(0.05, (face_y - FACE_TOP) / FACE_H * SCAN_DUR);
  const holdEnd  = (SCAN_DUR + HOLD_DUR) / CYCLE;
  const fadeEnd  = (SCAN_DUR + HOLD_DUR + FADE_DUR) / CYCLE;
  const t0       = (t / CYCLE).toFixed(3);
  const t1       = (Math.min((t + 0.3) / CYCLE, holdEnd - 0.01)).toFixed(3);
  const kt = `0;${t0};${t1};${holdEnd.toFixed(3)};${fadeEnd.toFixed(3)};1`;
  const kv = `0;0;1;1;0;0`;
  return `<animate attributeName="opacity" dur="${CYCLE}s" repeatCount="indefinite" keyTimes="${kt}" values="${kv}"/>`;
}

function textLine(x, y, face_y, inner) {
  return `  <text x="${x}" y="${y}" opacity="0" font-family="'Courier New',monospace" font-size="13px">${opacityAnim(face_y)}${inner}</text>`;
}

export function buildInfoPanel(theme) {
  const t = THEMES[theme];
  const x = PANEL.textX;
  const { CYCLE, SCAN_DUR, HOLD_DUR, FADE_DUR } = SCAN;

  const kv = (key, val) =>
    `<tspan fill="${t.colComment}">  </tspan><tspan fill="${t.colKey}" font-weight="bold">${key}</tspan><tspan fill="${t.colComment}"> .. </tspan><tspan fill="${t.colValue}">${val}</tspan>`;
  const status = (key, val) =>
    `<tspan fill="${t.colComment}">  </tspan><tspan fill="${t.colKey}" font-weight="bold">${key}</tspan><tspan fill="${t.colComment}"> .. </tspan><tspan fill="${t.colStatus}" font-weight="bold">${val}</tspan>`;
  const section = (key) =>
    `<tspan fill="${t.colComment}">  </tspan><tspan fill="${t.colKey}" font-weight="bold">${key}</tspan><tspan fill="${t.colAccent}"> ────────────────────</tspan>`;
  const item = (val) =>
    `<tspan fill="${t.colComment}">    </tspan><tspan fill="${t.colValue}">${val}</tspan>`;
  const prompt = () =>
    `<tspan fill="${t.colComment}">guest@</tspan><tspan fill="${t.colAccent}" font-weight="bold">${IDENTITY.id}</tspan><tspan fill="${t.colComment}">:~$ </tspan><tspan fill="${t.colValue}">cat profile.md</tspan>`;
  const website_line = (key, val) =>
    `<tspan fill="${t.colComment}">  </tspan><tspan fill="${t.colKey}" font-weight="bold">${key}</tspan><tspan fill="${t.colComment}"> .. </tspan><tspan fill="${t.colCyan}">${val}</tspan>`;

  const lines = [
    textLine(x, 46,  68,  prompt()),
    textLine(x, 68,  100, kv("agent_id",    IDENTITY.id)),
    textLine(x, 90,  130, kv("designation", IDENTITY.designation)),
    textLine(x, 112, 160, kv("base",        IDENTITY.base)),
    textLine(x, 134, 190, kv("mission",     IDENTITY.mission)),
    textLine(x, 156, 220, status("status",  IDENTITY.status)),
    textLine(x, 178, 260, section("capabilities")),
    ...CAPABILITIES.map((c, i) => textLine(x, 200 + i * 22, 290 + i * 30, item(c))),
    textLine(x, 266, 370, section("side_projects")),
    ...PROJECTS.map((p, i) => textLine(x, 288 + i * 22, 390 + i * 20, item(`▸ ${p}`))),
    textLine(x, 332, 430, kv("philosophy",  IDENTITY.philosophy)),
    textLine(x, 354, 445, kv("uptime",      IDENTITY.uptime)),
    textLine(x, 376, 455, kv("linkedin",    IDENTITY.linkedin)),
    textLine(x, 398, 462, kv("github",      IDENTITY.github)),
    textLine(x, 420, 468, website_line("website", IDENTITY.website)),
  ].join("\n");

  // cursor: appears after last line, blinks during hold, fades with rest
  const cursorDelay  = SCAN_DUR / CYCLE;
  const holdEnd      = (SCAN_DUR + HOLD_DUR) / CYCLE;
  const fadeEnd      = (SCAN_DUR + HOLD_DUR + FADE_DUR) / CYCLE;
  const cursorKT     = `0;${(cursorDelay).toFixed(3)};${holdEnd.toFixed(3)};${fadeEnd.toFixed(3)};1`;
  const cursor = `  <rect x="${x}" y="428" width="8" height="14" fill="${t.colCursor}" opacity="0">
    <animate attributeName="opacity" dur="${CYCLE}s" repeatCount="indefinite"
      keyTimes="${cursorKT}" values="0;1;1;0;0"/>
    <animate attributeName="opacity" values="1;0;1" dur="0.6s" repeatCount="indefinite"
      begin="${SCAN_DUR}s"/>
  </rect>`;

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
  <line x1="${PANEL.textX}" y1="172" x2="1155" y2="172"
    stroke="${t.colComment}" stroke-width="0.4" opacity="0.3"/>
  <line x1="${PANEL.textX}" y1="278" x2="1155" y2="278"
    stroke="${t.colComment}" stroke-width="0.4" opacity="0.3"/>
  <line x1="${PANEL.textX}" y1="346" x2="1155" y2="346"
    stroke="${t.colComment}" stroke-width="0.4" opacity="0.3"/>
${lines}
${cursor}`;
}
