/**
 * card/components/info-panel.mjs
 *
 * Right panel: each line reveals via clipPath width 0→full,
 * timed to when the scan line passes the corresponding face feature.
 * Lines type in ONCE and STAY — no fade/reset cycle.
 * Only the scan line on the portrait loops.
 */

import { IDENTITY, PROJECTS, CAPABILITIES, PANEL, THEMES } from "../config.mjs";
import { SCAN } from "./portrait.mjs";

const LINE_W = 640;

let _clipIdx = 0;
function clipId() { return `cp${_clipIdx++}`; }

function revealLine(x, y, face_y, inner, theme) {
  const t = THEMES[theme];
  const { SCAN_DUR, FACE_TOP, FACE_H } = SCAN;

  // Trigger time: when scan passes this face_y position
  const trigger   = Math.max(0.1, (face_y - FACE_TOP) / FACE_H * SCAN_DUR);
  const revealEnd = trigger + 0.4;

  // Type in once — width goes 0→LINE_W, then stays at LINE_W forever (fill="freeze")
  const id = clipId();
  return [
    `<clipPath id="${id}"><rect x="${x}" y="${y - 16}" width="0" height="22">`,
    `  <animate attributeName="width" from="0" to="${LINE_W}" dur="0.4s" begin="${trigger.toFixed(2)}s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>`,
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
  const locateLine = (y, face_y, inner) => revealLine(x, y, face_y, inner, theme);

  const bootLines = [
    locateLine(34,  20, `<tspan fill="${t.colComment}">$ </tspan><tspan fill="${t.colAccent}">locate --agent eabhijith --scan deep</tspan>`),
    locateLine(52,  30, `<tspan fill="${t.colComment}">  scanning network</tspan><tspan fill="${t.colAccent}">...............</tspan>`),
    locateLine(70,  42, `<tspan fill="${t.colComment}">  signal acquired </tspan><tspan fill="${t.colStatus}" font-weight="bold">[52°31'N 13°24'E · BERLIN]</tspan>`),
    locateLine(88,  56, `<tspan fill="${t.colComment}">  identity </tspan><tspan fill="${t.colStatus}" font-weight="bold">CONFIRMED</tspan><tspan fill="${t.colAccent}"> ✓</tspan>`),
    locateLine(106, 68, `<tspan fill="${t.colComment}">$ </tspan><tspan fill="${t.colValue}">cat profile.md</tspan>`),
  ].join("\n");

  // 18px line spacing, snapped to 8px grid, all within panel height 468
  const rows = [
    [124, 100, kv("agent_id",    IDENTITY.id)],
    [142, 130, kv("designation", IDENTITY.designation)],
    [160, 160, kv("base",        IDENTITY.base)],
    [178, 190, kv("mission",     IDENTITY.mission)],
    [196, 220, status_l("status", IDENTITY.status)],
    [218, 260, section("capabilities")],
    [236, 290, item(CAPABILITIES[0])],
    [254, 320, item(CAPABILITIES[1])],
    [272, 340, item(CAPABILITIES[2])],
    [290, 370, section("side_projects")],
    [308, 390, item(`▸ ${PROJECTS[0]}`)],
    [326, 410, item(`▸ ${PROJECTS[1]}`)],
    [346, 430, kv("philosophy",  IDENTITY.philosophy)],
    [364, 445, kv("uptime",      IDENTITY.uptime)],
    [382, 455, kv("linkedin",    IDENTITY.linkedin)],
    [400, 462, kv("github",      IDENTITY.github)],
    [418, 468, web("website",    IDENTITY.website)],
  ].map(([y, face_y, inner]) => revealLine(x, y, face_y, inner, theme)).join("\n");

  // MANIFEST LOADED — reveals after last line, stays forever
  const manifestLoaded = revealLine(
    x, 444, 468,
    `<tspan fill="${t.colAccent}">[ MANIFEST LOADED · AGENT ACTIVE ]</tspan>`,
    theme
  );

  return `
  <!-- ── RIGHT PANEL (matches left panel: y=26, height=468) ── -->
  <rect x="${PANEL.x}" y="${PANEL.y}" width="${PANEL.width}" height="${PANEL.height}" rx="${PANEL.rx}"
    fill="${t.panelFill}" fill-opacity="0.85"
    stroke="${t.panelStroke}" stroke-width="1" opacity="0.7"/>
  <text x="${PANEL.textX}" y="20"
    font-family="'Courier New',monospace" font-size="11px"
    fill="${t.panelTitle}" letter-spacing="2px" opacity="0.6">AGENT.MANIFEST</text>
  <line x1="${PANEL.x}" y1="28" x2="${PANEL.x + PANEL.width}" y2="28"
    stroke="${t.panelStroke}" stroke-width="0.5" opacity="0.3"/>
  <!-- section dividers on 8px grid -->
  <line x1="${PANEL.textX}" y1="112" x2="1155" y2="112" stroke="${t.colComment}" stroke-width="0.4" opacity="0.3"/>
  <line x1="${PANEL.textX}" y1="208" x2="1155" y2="208" stroke="${t.colComment}" stroke-width="0.4" opacity="0.3"/>
  <line x1="${PANEL.textX}" y1="280" x2="1155" y2="280" stroke="${t.colComment}" stroke-width="0.4" opacity="0.3"/>
  <line x1="${PANEL.textX}" y1="336" x2="1155" y2="336" stroke="${t.colComment}" stroke-width="0.4" opacity="0.3"/>
${bootLines}
${rows}
${manifestLoaded}`;
}
