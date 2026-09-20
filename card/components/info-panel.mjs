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
  // Locate boot sequence — appears before scan hits face (t=0 to t=0.9s)
  // Four lines type in fast, creating the sci-fi "finding agent" feel
  const locateLine = (y, face_y, inner) => revealLine(x, y, face_y, inner, theme);

  const bootLines = [
    locateLine(46,  20, `<tspan fill="${t.colComment}">$ </tspan><tspan fill="${t.colAccent}">locate --agent eabhijith --scan deep</tspan>`),
    locateLine(64,  30, `<tspan fill="${t.colComment}">  </tspan><tspan fill="${t.colComment}">scanning network</tspan><tspan fill="${t.colAccent}">...............</tspan>`),
    locateLine(82,  42, `<tspan fill="${t.colComment}">  </tspan><tspan fill="${t.colComment}">signal acquired </tspan><tspan fill="${t.colStatus}" font-weight="bold">[52°31'N 13°24'E · BERLIN]</tspan>`),
    locateLine(100, 56, `<tspan fill="${t.colComment}">  </tspan><tspan fill="${t.colComment}">identity </tspan><tspan fill="${t.colStatus}" font-weight="bold">CONFIRMED</tspan><tspan fill="${t.colAccent}"> ✓</tspan>`),
    locateLine(118, 68, `<tspan fill="${t.colComment}">$ </tspan><tspan fill="${t.colValue}">cat profile.md</tspan>`),
  ].join("\n");

  const rows = [
    [136, 100, kv("agent_id",    IDENTITY.id)],
    [158, 130, kv("designation", IDENTITY.designation)],
    [180, 160, kv("base",        IDENTITY.base)],
    [202, 190, kv("mission",     IDENTITY.mission)],
    [224, 220, status_l("status", IDENTITY.status)],
    [246, 260, section("capabilities")],
    ...CAPABILITIES.map((c, i) => [268 + i*22, 290 + i*30, item(c)]),
    [334, 370, section("side_projects")],
    ...PROJECTS.map((p, i) => [356 + i*22, 390 + i*20, item(`▸ ${p}`)]),
    [400, 430, kv("philosophy",  IDENTITY.philosophy)],
    [422, 445, kv("uptime",      IDENTITY.uptime)],
    [444, 455, kv("linkedin",    IDENTITY.linkedin)],
    [466, 462, kv("github",      IDENTITY.github)],
    [488, 468, web("website",    IDENTITY.website)],
  ].map(([y, face_y, inner]) => revealLine(x, y, face_y, inner, theme)).join("\n");

  // MANIFEST LOADED line — appears when scan finishes, fades with rest
  const manifestLoaded = revealLine(
    x, 510, 468,
    `<tspan fill="${t.colAccent}">[ MANIFEST LOADED · AGENT ACTIVE ]</tspan>`,
    theme
  );

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
  <line x1="${PANEL.textX}" y1="130" x2="1155" y2="130" stroke="${t.colComment}" stroke-width="0.4" opacity="0.3"/>
  <line x1="${PANEL.textX}" y1="242" x2="1155" y2="242" stroke="${t.colComment}" stroke-width="0.4" opacity="0.3"/>
  <line x1="${PANEL.textX}" y1="350" x2="1155" y2="350" stroke="${t.colComment}" stroke-width="0.4" opacity="0.3"/>
  <line x1="${PANEL.textX}" y1="416" x2="1155" y2="416" stroke="${t.colComment}" stroke-width="0.4" opacity="0.3"/>
${bootLines}
${rows}
${manifestLoaded}`;
}
