#!/usr/bin/env node
/**
 * agents-card/build.mjs
 *
 * Phase 1 (0-10s):   Terminal fills full card — command types, agents spawn ONLINE
 * Phase 2 (10-11s):  Terminal slides UP out of frame (animateTransform translate)
 * Phase 3 (11-28s):  Agents fill full card, working, passing data
 * Phase 4 (28-30s):  Fade to black, reset
 */

import fs   from "node:fs";
import path from "node:path";
import { COLORS } from "../brand.mjs";
import { buildAvatar } from "../ds/avatar.mjs";
import { typewriterLine, resetClipIdx } from "../ds/components.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT  = path.join(ROOT, "agents-card.svg");

const { cyan, green, amber, violet, red, bgDark, bgMid, muted,
        draculaComment, draculaGreen, draculaFg } = COLORS;
const mono = `font-family="'JetBrains Mono','Fira Code',monospace"`;

// ── Timing ────────────────────────────────────────────────────────────────────
const T = {
  boot:      0.1,
  init:      0.6,
  manifest:  1.2,
  spawning:  1.8,
  harvester: 3.0,
  archify:   3.8,
  coach:     4.6,
  wiki:      5.4,
  enforcer:  6.2,
  runtime:   7.2,
  slideOut:  8.5,   // terminal slides away
  agentsIn:  9.5,   // agents fully visible
  hold:      24.0,  // hold running state
  fadeOut:   27.0,
  reset:     30.0,
};

// ── Terminal lines (full width, centred) ──────────────────────────────────────
resetClipIdx();
const TX = 80;
const termLines = [
  { t: T.boot,      y: 72,  w: 900, inner: `<tspan fill="${draculaComment}">$ </tspan><tspan fill="${draculaGreen}" font-weight="bold">./devos --launch --runtime production --agents 5</tspan>` },
  { t: T.init,      y: 104, w: 700, inner: `<tspan fill="${draculaComment}">  initialising runtime</tspan><tspan fill="${cyan}">............</tspan>` },
  { t: T.manifest,  y: 136, w: 680, inner: `<tspan fill="${draculaComment}">  loading agent manifest</tspan><tspan fill="${cyan}">.........</tspan>` },
  { t: T.spawning,  y: 168, w: 660, inner: `<tspan fill="${draculaComment}">  spawning 5 agents</tspan><tspan fill="${cyan}">.............</tspan>` },
  { t: T.harvester, y: 212, w: 800, inner: `<tspan fill="${draculaComment}">  [1/5] </tspan><tspan fill="${cyan}"    font-weight="bold">harvester</tspan><tspan fill="${draculaComment}">   blob      </tspan><tspan fill="${draculaGreen}" font-weight="bold">ONLINE ✓</tspan>` },
  { t: T.archify,   y: 244, w: 800, inner: `<tspan fill="${draculaComment}">  [2/5] </tspan><tspan fill="${amber}"  font-weight="bold">archify</tspan><tspan fill="${draculaComment}">     hexagon  </tspan><tspan fill="${draculaGreen}" font-weight="bold">ONLINE ✓</tspan>` },
  { t: T.coach,     y: 276, w: 800, inner: `<tspan fill="${draculaComment}">  [3/5] </tspan><tspan fill="${green}"  font-weight="bold">coach</tspan><tspan fill="${draculaComment}">       teardrop </tspan><tspan fill="${draculaGreen}" font-weight="bold">ONLINE ✓</tspan>` },
  { t: T.wiki,      y: 308, w: 800, inner: `<tspan fill="${draculaComment}">  [4/5] </tspan><tspan fill="${violet}" font-weight="bold">wiki</tspan><tspan fill="${draculaComment}">        squircle </tspan><tspan fill="${draculaGreen}" font-weight="bold">ONLINE ✓</tspan>` },
  { t: T.enforcer,  y: 340, w: 800, inner: `<tspan fill="${draculaComment}">  [5/5] </tspan><tspan fill="${red}"    font-weight="bold">enforcer</tspan><tspan fill="${draculaComment}">   triangle </tspan><tspan fill="${draculaGreen}" font-weight="bold">ONLINE ✓</tspan>` },
  { t: T.runtime,   y: 384, w: 900, inner: `<tspan fill="${draculaGreen}" font-weight="bold">━━━ RUNTIME ACTIVE · 5/5 AGENTS ONLINE · DEPLOYED ━━━</tspan>` },
];

const tLines = termLines.map(({ t, y, w, inner }) =>
  typewriterLine({ x: TX, y, triggerSec: t, inner, maxW: w })
).join("\n");

// Progress bar
const progBar = `<rect x="${TX}" y="184" width="0" height="10" rx="4" fill="${cyan}" opacity="0.75">
  <animate attributeName="width" from="0" to="480" dur="0.9s" begin="2.0s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
</rect>`;

// ── Terminal panel (slides up at T.slideOut) ──────────────────────────────────
const termPanel = `<g id="terminal">
  <animateTransform attributeName="transform" type="translate"
    from="0,0" to="0,-430"
    dur="0.8s" begin="${T.slideOut}s" fill="freeze"
    calcMode="spline" keySplines="0.4 0 0.2 1"/>

  <!-- full-card terminal background -->
  <rect width="1180" height="420" rx="16" fill="${bgMid}" fill-opacity="0.92"/>
  <line x1="0" y1="48" x2="1180" y2="48" stroke="${draculaComment}" stroke-width="0.5" opacity="0.4"/>

  <!-- traffic lights -->
  <circle cx="28" cy="24" r="6" fill="#FF4444"><animate attributeName="opacity" values="1;0.4;1" dur="4s" repeatCount="indefinite"/></circle>
  <circle cx="50" cy="24" r="6" fill="${amber}"><animate attributeName="opacity" values="1;0.4;1" dur="4s" begin="0.3s" repeatCount="indefinite"/></circle>
  <circle cx="72" cy="24" r="6" fill="${green}"><animate attributeName="opacity" values="1;0.4;1" dur="4s" begin="0.6s" repeatCount="indefinite"/></circle>
  <text x="590" y="30" text-anchor="middle" ${mono} font-size="12px" fill="${muted}" letter-spacing="1px">devos · agent launcher · production</text>

  ${progBar}
  ${tLines}
</g>`;

// ── Agents (appear after terminal slides away) ────────────────────────────────
// 5 agents spread across full card width
// Top row: harvester, archify, coach — Bottom row: wiki, enforcer (centred)
const AGENT_Y1 = 160, AGENT_Y2 = 310;
const SPACING  = 230;
const START_X  = 120;

const agentConfigs = [
  { id:"harvester", cx: START_X,            cy: AGENT_Y1, size:90, color:cyan,   shape:"blob",     state:"idle",     label:"harvester", sublabel:"blob · fetches" },
  { id:"archify",   cx: START_X+SPACING,    cy: AGENT_Y1, size:90, color:amber,  shape:"hexagon",  state:"working",  label:"archify",   sublabel:"hexagon · renders" },
  { id:"coach",     cx: START_X+SPACING*2,  cy: AGENT_Y1, size:90, color:green,  shape:"teardrop", state:"thinking", label:"coach",     sublabel:"teardrop · reflects" },
  { id:"wiki",      cx: START_X+SPACING*3,  cy: AGENT_Y1, size:90, color:violet, shape:"squircle", state:"done",     label:"wiki",      sublabel:"squircle · stores" },
  { id:"enforcer",  cx: START_X+SPACING*4,  cy: AGENT_Y1, size:90, color:red,    shape:"triangle", state:"blocked",  label:"enforcer",  sublabel:"triangle · guards", presenceDot:false },
];

// All agents invisible until terminal slides away
const agentsSvg = agentConfigs.map(cfg => {
  const av = buildAvatar({ ...cfg, showAt: 0 });
  // Wrap with fade-in at T.agentsIn
  return `<g opacity="0">
  <animate attributeName="opacity" from="0" to="1" dur="0.6s" begin="${T.agentsIn}s" fill="freeze"/>
  ${av}
</g>`;
}).join("\n");

// ── Flow lines (appear at T.agentsIn + 0.5s) ─────────────────────────────────
function flowLine(x1, y1, x2, y2, col, delay) {
  const pktDur = 1.8;
  return `<g opacity="0">
  <animate attributeName="opacity" from="0" to="0.9" dur="0.3s" begin="${T.agentsIn + 0.5}s" fill="freeze"/>
  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="1.2" opacity="0.3"/>
  <polygon points="${x2-7},${y2-4} ${x2+2},${y2} ${x2-7},${y2+4}" fill="${col}" opacity="0.6"/>
  <circle r="5" fill="${col}">
    <animate attributeName="cx" values="${x1};${x2}" dur="${pktDur}s" begin="${delay}s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="${y1};${y2}" dur="${pktDur}s" begin="${delay}s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.05;0.9;1" dur="${pktDur}s" begin="${delay}s" repeatCount="indefinite"/>
  </circle>
</g>`;
}

// forward + return lanes
const FLOW_Y_FWD = AGENT_Y1 - 5;
const FLOW_Y_RET = AGENT_Y1 + 5;
const A = agentConfigs;

const flows = [
  flowLine(A[0].cx+48, FLOW_Y_FWD, A[1].cx-48, FLOW_Y_FWD, cyan,   T.agentsIn+0.6),
  flowLine(A[1].cx+48, FLOW_Y_FWD, A[2].cx-48, FLOW_Y_FWD, amber,  T.agentsIn+0.9),
  flowLine(A[2].cx+48, FLOW_Y_FWD, A[3].cx-48, FLOW_Y_FWD, green,  T.agentsIn+1.2),
  flowLine(A[3].cx+48, FLOW_Y_FWD, A[4].cx-48, FLOW_Y_FWD, violet, T.agentsIn+1.5),
  // return
  flowLine(A[1].cx-48, FLOW_Y_RET, A[0].cx+48, FLOW_Y_RET, violet, T.agentsIn+2.5),
  flowLine(A[2].cx-48, FLOW_Y_RET, A[1].cx+48, FLOW_Y_RET, violet, T.agentsIn+2.8),
  flowLine(A[3].cx-48, FLOW_Y_RET, A[2].cx+48, FLOW_Y_RET, violet, T.agentsIn+3.1),
  // enforcer watch arcs
  `<g opacity="0"><animate attributeName="opacity" from="0" to="0.5" dur="0.3s" begin="${T.agentsIn+0.5}s" fill="freeze"/>
    <path d="M${A[4].cx},${AGENT_Y1-50} Q${A[2].cx+60},80 ${A[2].cx},${AGENT_Y1-48}" fill="none" stroke="${red}" stroke-width="0.8" stroke-dasharray="4 3" opacity="0.4"/>
    <path d="M${A[4].cx},${AGENT_Y1-50} Q${A[3].cx+60},80 ${A[3].cx},${AGENT_Y1-48}" fill="none" stroke="${red}" stroke-width="0.8" stroke-dasharray="4 3" opacity="0.4"/>
  </g>`,
].join("\n");

// ── Enforcer alert ring ───────────────────────────────────────────────────────
const alertRing = `<g opacity="0">
  <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${T.agentsIn+0.5}s" fill="freeze"/>
  <circle cx="${A[4].cx}" cy="${AGENT_Y1}" r="54" fill="none" stroke="${red}" stroke-width="1">
    <animate attributeName="r" values="54;64;54" dur="1.5s" begin="${T.agentsIn}s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.18;0.04;0.18" dur="1.5s" begin="${T.agentsIn}s" repeatCount="indefinite"/>
  </circle>
</g>`;

// ── GITHUB.PIPELINE label (visible in agent phase) ────────────────────────────
const pipelineLabel = `<g opacity="0">
  <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${T.agentsIn}s" fill="freeze"/>
  <text x="590" y="28" text-anchor="middle" ${mono} font-size="11px" fill="${muted}" letter-spacing="2px" opacity="0.6">GITHUB.PIPELINE · eabhijith · live data</text>
  <line x1="40" y1="36" x2="1140" y2="36" stroke="${muted}" stroke-width="0.4" opacity="0.2"/>
</g>`;

// ── Footer ────────────────────────────────────────────────────────────────────
const footer = `<line x1="40" y1="400" x2="1140" y2="400" stroke="${muted}" stroke-width="0.4" opacity="0.25"/>
<text x="590" y="414" text-anchor="middle" ${mono} font-size="9px" fill="${muted}" letter-spacing="2px">5 agents · DEPLOYED · zero cloud deps</text>`;

// ── Assemble ──────────────────────────────────────────────────────────────────
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1180 420" width="1180" height="420" style="overflow:hidden">
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
  <clipPath id="cardClip"><rect width="1180" height="420" rx="16"/></clipPath>
</defs>

<rect width="1180" height="420" rx="16" fill="url(#bg)"/>

<!-- Everything clipped to card bounds so terminal slides off cleanly -->
<g clip-path="url(#cardClip)">
  <!-- Pipeline label + agent roster (behind terminal) -->
  ${pipelineLabel}
  ${alertRing}
  ${flows}
  ${agentsSvg}
  ${footer}

  <!-- Terminal panel slides up over everything -->
  ${termPanel}
</g>

<rect width="1180" height="420" rx="16" fill="none" stroke="url(#borderG)" stroke-width="1.5" opacity="0.4"/>
</svg>`;

fs.writeFileSync(OUT, svg, "utf8");
console.log(`agents-card.svg: ${(svg.length/1024).toFixed(1)}KB`);
