/**
 * card/components/info-panel.mjs — rebuilt using ds/
 * All line positions from layout.lineY(n) — 24px grid, no magic numbers.
 */
import { color, font, text as textSize } from "../../ds/tokens.mjs";
import { rightPanel, lineY, scan } from "../../ds/layout.mjs";
import { panelBox, panelTitle, typewriterLine, resetClipIdx, t, dividerLine } from "../../ds/components.mjs";
import { IDENTITY, PROJECTS, CAPABILITIES, THEMES } from "../config.mjs";
import { SCAN } from "./portrait.mjs";

export function buildInfoPanel(theme) {
  resetClipIdx();
  const dark   = theme === "dark";
  const pFill  = dark ? color.bg3  : "#E2E8F0";
  const pStroke = dark ? color.violet : "#0369A1";
  const ptCol  = dark ? color.cyan  : "#0369A1";

  const { x, y, w, h, r: rpr, b, titleY, lineY: panelLineY, textX, textW } = rightPanel;

  // Timing: line n triggers when scan passes that face region
  // Boot lines: first 5 appear in first 1.5s (before face scan)
  // Profile lines: distributed across SCAN_DUR (5s)
  const bootT = [0.1, 0.4, 0.7, 1.0, 1.4];

  // Profile lines map to scan positions proportionally
  const faceMap = [100,130,160,190,220, 260,290,320,340, 370,390,410, 430,445,455,462,468,468];
  const profileT = faceMap.map(fy =>
    Math.max(1.6, (fy - scan.FACE_TOP) / scan.FACE_H * SCAN.SCAN_DUR)
  );

  // Line positions — all on 24px grid from lineY(n)
  // Boot: lines 0-4 → lineY(0)..lineY(4)
  // Profile starts at lineY(5)
  const LX = textX;

  const bootLines = [
    typewriterLine({ x: LX, y: lineY(0), triggerSec: bootT[0], inner: `${t.prompt("locate --id eabhijith --scan deep")}` }),
    typewriterLine({ x: LX, y: lineY(1), triggerSec: bootT[1], inner: `${t.comment("  scanning")}${t.green("...............")}` }),
    typewriterLine({ x: LX, y: lineY(2), triggerSec: bootT[2], inner: `${t.comment("  signal ")}${t.green("[52°31'N 13°24'E · BERLIN]")}` }),
    typewriterLine({ x: LX, y: lineY(3), triggerSec: bootT[3], inner: `${t.comment("  identity ")}${t.green("CONFIRMED ✓")}` }),
    typewriterLine({ x: LX, y: lineY(4), triggerSec: bootT[4], inner: `${t.prompt("cat profile.md")}` }),
  ].join("\n");

  const profileLines = [
    // identity block: lines 5-9
    [lineY(5),  profileT[0],  t.kv("agent_id",   IDENTITY.id)],
    [lineY(6),  profileT[1],  t.kv("designation",IDENTITY.designation)],
    [lineY(7),  profileT[2],  t.kv("base",        IDENTITY.base)],
    [lineY(8),  profileT[3],  t.kv("mission",     IDENTITY.mission)],
    [lineY(9),  profileT[4],  t.status("status",  IDENTITY.status)],
    // capabilities: lines 10-13
    [lineY(10), profileT[5],  t.section("capabilities")],
    [lineY(11), profileT[6],  t.item(CAPABILITIES[0])],
    [lineY(12), profileT[7],  t.item(CAPABILITIES[1])],
    [lineY(13), profileT[8],  t.item(CAPABILITIES[2])],
    // projects: lines 14-16
    [lineY(14), profileT[9],  t.section("side_projects")],
    [lineY(15), profileT[10], t.item(`▸ ${PROJECTS[0]}`)],
    [lineY(16), profileT[11], t.item(`▸ ${PROJECTS[1]}`)],
    // about: lines 17-19
    [lineY(17), profileT[12], t.kv("philosophy",  IDENTITY.philosophy)],
    [lineY(18), profileT[13], t.kv("uptime",       IDENTITY.uptime)],
    // links: lines 19-21
    [lineY(19), profileT[14], t.kv("linkedin",     IDENTITY.linkedin)],
    [lineY(20), profileT[15], t.kv("github",       IDENTITY.github)],
    [lineY(21), profileT[16], t.web("website",     IDENTITY.website)],
    // manifest loaded: line 22
    [lineY(22), profileT[17], `<tspan fill="${color.dGreen}">[ MANIFEST LOADED · PROFILE ACTIVE ]</tspan>`],
  ].map(([ly, tr, inner]) => typewriterLine({ x: LX, y: ly, triggerSec: tr, inner })).join("\n");

  // Section dividers (between blocks)
  const dividers = [
    dividerLine({ x1: LX, x2: rpr, y: lineY(4) + 8,  col: color.dComment }),
    dividerLine({ x1: LX, x2: rpr, y: lineY(9) + 8,  col: color.dComment }),
    dividerLine({ x1: LX, x2: rpr, y: lineY(13) + 8, col: color.dComment }),
    dividerLine({ x1: LX, x2: rpr, y: lineY(16) + 8, col: color.dComment }),
    dividerLine({ x1: LX, x2: rpr, y: lineY(18) + 8, col: color.dComment }),
  ].join("\n");

  return `
  ${panelBox({ x, y, w, h, rx: 8, fillColor: pFill, strokeColor: pStroke })}
  ${panelTitle({ label: "PROFILE.MANIFEST", x: x+16, titleY, lineY: panelLineY, lineX2: rpr, titleColor: ptCol, lineColor: pStroke })}
${dividers}
${bootLines}
${profileLines}`;
}
