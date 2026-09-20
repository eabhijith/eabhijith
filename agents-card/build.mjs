#!/usr/bin/env node
/**
 * agents-card/build.mjs
 *
 * Builds agents-card.svg from design system modules.
 * Run: node agents-card/build.mjs
 *
 * Layout:
 *   Left  (x=16..590)  — terminal launch sequence
 *   Right (x=604..1164) — agent roster with motion
 */

import fs   from "node:fs";
import path from "node:path";
import { COLORS } from "../brand.mjs";
import { buildAvatar } from "../ds/avatar.mjs";
import { typewriterLine, resetClipIdx } from "../ds/components.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT  = path.join(ROOT, "agents-card.svg");

const { cyan, green, amber, violet, red, bgDark, bgMid, muted,
        draculaComment, draculaGreen } = COLORS;

const mono = `font-family="'JetBrains Mono','Fira Code',monospace"`;

// ── Timing constants ──────────────────────────────────────────────────────────
const T = {
  boot:     0.1,
  init:     0.7,
  manifest: 1.4,
  spawning: 2.0,
  harvester:4.2,
  archify:  5.1,
  coach:    6.0,
  wiki:     6.9,
  enforcer: 7.8,
  runtime:  9.0,
};

// ── Terminal lines ────────────────────────────────────────────────────────────
resetClipIdx();

const TERM_X = 44;
const termLines = [
  { t: T.boot,      y:  56, w: 520, inner: `<tspan fill="${draculaComment}">$ </tspan><tspan fill="${draculaGreen}" font-weight="bold">./devos --launch --agents production</tspan>` },
  { t: T.init,      y:  80, w: 460, inner: `<tspan fill="${draculaComment}">  initialising runtime</tspan><tspan fill="${cyan}">............</tspan>` },
  { t: T.manifest,  y: 104, w: 440, inner: `<tspan fill="${draculaComment}">  loading manifest</tspan><tspan fill="${cyan}">...............</tspan>` },
  { t: T.spawning,  y: 128, w: 440, inner: `<tspan fill="${draculaComment}">  spawning 5 agents</tspan><tspan fill="${cyan}">...........</tspan>` },
  { t: T.harvester, y: 160, w: 460, inner: `<tspan fill="${draculaComment}">  ✓ </tspan><tspan fill="${cyan}"    font-weight="bold">harvester</tspan><tspan fill="${draculaComment}">   blob      </tspan><tspan fill="${draculaGreen}" font-weight="bold">ONLINE</tspan>` },
  { t: T.archify,   y: 180, w: 460, inner: `<tspan fill="${draculaComment}">  ✓ </tspan><tspan fill="${amber}"  font-weight="bold">archify</tspan><tspan fill="${draculaComment}">     hexagon  </tspan><tspan fill="${draculaGreen}" font-weight="bold">ONLINE</tspan>` },
  { t: T.coach,     y: 200, w: 460, inner: `<tspan fill="${draculaComment}">  ✓ </tspan><tspan fill="${green}"  font-weight="bold">coach</tspan><tspan fill="${draculaComment}">       teardrop </tspan><tspan fill="${draculaGreen}" font-weight="bold">ONLINE</tspan>` },
  { t: T.wiki,      y: 220, w: 460, inner: `<tspan fill="${draculaComment}">  ✓ </tspan><tspan fill="${violet}" font-weight="bold">wiki</tspan><tspan fill="${draculaComment}">        squircle </tspan><tspan fill="${draculaGreen}" font-weight="bold">ONLINE</tspan>` },
  { t: T.enforcer,  y: 240, w: 460, inner: `<tspan fill="${draculaComment}">  ✓ </tspan><tspan fill="${red}"    font-weight="bold">enforcer</tspan><tspan fill="${draculaComment}">   triangle </tspan><tspan fill="${draculaGreen}" font-weight="bold">ONLINE</tspan>` },
  { t: T.runtime,   y: 268, w: 500, inner: `<tspan fill="${draculaGreen}" font-weight="bold">[ RUNTIME ACTIVE · 5 AGENTS ONLINE ]</tspan>` },
];

const tLines = termLines.map(({ t, y, w, inner }) =>
  typewriterLine({ x: TERM_X, y, triggerSec: t, inner, maxW: w })
).join("\n");

// Progress bar
const progBar = `<rect x="${TERM_X}" y="140" width="0" height="8" rx="3" fill="${cyan}" opacity="0.7">
  <animate attributeName="width" from="0" to="260" dur="0.7s" begin="2.1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
</rect>`;

// ── Agents ────────────────────────────────────────────────────────────────────
// Positions: 4 in a row + enforcer top-right watching over
const AGENT_CONFIG = [
  { id:"harvester", cx: 680, cy: 240, size: 84, color: cyan,   shape:"blob",     state:"idle",     showAt: T.harvester, label:"harvester", sublabel:"blob · fetches" },
  { id:"archify",   cx: 810, cy: 240, size: 84, color: amber,  shape:"hexagon",  state:"working",  showAt: T.archify,   label:"archify",   sublabel:"hexagon · renders" },
  { id:"coach",     cx: 940, cy: 240, size: 84, color: green,  shape:"teardrop", state:"thinking", showAt: T.coach,     label:"coach",     sublabel:"teardrop · reflects" },
  { id:"wiki",      cx:1070, cy: 240, size: 84, color: violet, shape:"squircle", state:"done",     showAt: T.wiki,      label:"wiki",      sublabel:"squircle · stores" },
  { id:"enforcer",  cx:1120, cy:  90, size: 72, color: red,    shape:"triangle", state:"blocked",  showAt: T.enforcer,  label:"enforcer",  sublabel:"triangle · guards", presenceDot: false },
];

const agentsSvg = AGENT_CONFIG.map(cfg => buildAvatar(cfg)).join("\n");

// ── Flow lines ────────────────────────────────────────────────────────────────
function flowLine(x1, y1, x2, y2, col, pktDelay) {
  return `<g opacity="0">
  <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${T.runtime}s" fill="freeze"/>
  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="1" opacity="0.3"/>
  <polygon points="${x2-6},${y2-4} ${x2+1},${y2} ${x2-6},${y2+4}" fill="${col}" opacity="0.55"/>
  <circle r="4" fill="${col}">
    <animate attributeName="cx" values="${x1};${x2}" dur="1.6s" begin="${pktDelay}s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="${y1};${y2}" dur="1.6s" begin="${pktDelay}s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.05;0.9;1" dur="1.6s" begin="${pktDelay}s" repeatCount="indefinite"/>
  </circle>
</g>`;
}

// Forward: harvester→archify→coach→wiki
// Return:  violet packets going back
const flows = [
  flowLine(722, 240, 768, 240, cyan,   T.runtime+0.4),
  flowLine(852, 240, 898, 240, amber,  T.runtime+0.7),
  flowLine(982, 240,1028, 240, green,  T.runtime+1.0),
  flowLine(768, 255, 722, 255, violet, T.runtime+2.2),
  flowLine(898, 255, 852, 255, violet, T.runtime+2.5),
  flowLine(1028,255, 982, 255, violet, T.runtime+2.8),
  // enforcer watch arcs (dashed)
  `<g opacity="0"><animate attributeName="opacity" from="0" to="0.5" dur="0.3s" begin="${T.enforcer}s" fill="freeze"/>
    <path d="M1108,126 Q1040,170 940,222" fill="none" stroke="${red}" stroke-width="0.8" stroke-dasharray="3 3" opacity="0.4"/>
    <path d="M1112,126 Q1092,170 1070,222" fill="none" stroke="${red}" stroke-width="0.8" stroke-dasharray="3 3" opacity="0.4"/>
  </g>`,
].join("\n");

// ── Enforcer alert ring ───────────────────────────────────────────────────────
const alertRing = `<circle cx="1120" cy="90" r="42" fill="none" stroke="${red}" stroke-width="1" opacity="0">
  <animate attributeName="opacity" from="0" to="0.18" dur="0.3s" begin="${T.enforcer}s" fill="freeze"/>
  <animate attributeName="r" values="42;52;42" dur="1.5s" begin="${T.enforcer}s" repeatCount="indefinite"/>
  <animate attributeName="opacity" values="0.18;0.04;0.18" dur="1.5s" begin="${T.enforcer}s" repeatCount="indefinite"/>
</circle>`;

// ── Panel title ───────────────────────────────────────────────────────────────
const panelTitle = `<text x="296" y="34" text-anchor="middle"
  ${mono} font-size="10px" fill="${muted}" letter-spacing="1px">devos · agent launcher</text>`;

const rosterTitle = `<text x="880" y="34" text-anchor="middle"
  ${mono} font-size="10px" fill="${muted}" letter-spacing="2px" opacity="0.6">AGENT.ROSTER</text>`;

// ── Assemble ──────────────────────────────────────────────────────────────────
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1180 420" width="1180" height="420">
<defs>
  <radialGradient id="bg" cx="50%" cy="0%" r="80%">
    <stop offset="0%"   stop-color="#0F1E3A"/>
    <stop offset="100%" stop-color="${bgDark}"/>
  </radialGradient>
  <linearGradient id="borderG" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%"   stop-color="${cyan}"/>
    <stop offset="50%"  stop-color="${green}"/>
    <stop offset="100%" stop-color="${amber}"/>
  </linearGradient>
</defs>

<rect width="1180" height="420" rx="16" fill="url(#bg)"/>
<rect width="1180" height="420" rx="16" fill="none" stroke="url(#borderG)" stroke-width="1.5" opacity="0.4"/>

<!-- Terminal panel -->
<rect x="16" y="12" width="572" height="396" rx="8"
  fill="${bgMid}" fill-opacity="0.65" stroke="${draculaComment}" stroke-width="0.8" opacity="0.4"/>
<circle cx="36" cy="28" r="5" fill="#FF4444"><animate attributeName="opacity" values="1;0.4;1" dur="4s" repeatCount="indefinite"/></circle>
<circle cx="54" cy="28" r="5" fill="${amber}"><animate attributeName="opacity" values="1;0.4;1" dur="4s" begin="0.3s" repeatCount="indefinite"/></circle>
<circle cx="72" cy="28" r="5" fill="${green}"><animate attributeName="opacity" values="1;0.4;1" dur="4s" begin="0.6s" repeatCount="indefinite"/></circle>
${panelTitle}
<line x1="16" y1="40" x2="588" y2="40" stroke="${muted}" stroke-width="0.5" opacity="0.3"/>

${progBar}
${tLines}

<!-- Divider -->
<line x1="600" y1="12" x2="600" y2="408" stroke="${muted}" stroke-width="0.5" opacity="0.18"/>

<!-- Agent roster panel -->
${rosterTitle}
${alertRing}
${flows}
${agentsSvg}

<line x1="40" y1="398" x2="1140" y2="398" stroke="${muted}" stroke-width="0.4" opacity="0.3"/>
<text x="590" y="413" text-anchor="middle"
  ${mono} font-size="9px" fill="${muted}" letter-spacing="2px">5 agents · DEPLOYED · zero cloud deps</text>
</svg>`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, svg, "utf8");
console.log(`agents-card.svg: ${(svg.length / 1024).toFixed(1)}KB`);
