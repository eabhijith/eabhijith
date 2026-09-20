/**
 * card/config.mjs
 *
 * Single source of truth for the profile card.
 * Edit ONLY this file to update content or colours.
 * Never touch the component files for content changes.
 */

// ── Identity ────────────────────────────────────────────────────────────────
export const IDENTITY = {
  id:          "eabhijith",
  designation: "Senior AI &amp; Automation Specialist",
  base:        "Berlin, Germany",
  mission:     "Multi-Agent · LLM Orchestration",
  status:      "DEPLOYED · ACTIVE",
  philosophy:  "Functional · Minimal · Ship it",
  uptime:      "since 2017 · Berlin",
  linkedin:    "linkedin.com/in/eabhijith",
  github:      "github.com/eabhijith",
  website:     "eabhijith.vercel.app",
};

// ── Side projects (shown in manifest panel) ─────────────────────────────────
export const PROJECTS = [
  "personal AI OS",
  "archify — diagram renderer",
];

// ── Capabilities ─────────────────────────────────────────────────────────────
export const CAPABILITIES = [
  "▸ Pydantic-AI · LangGraph · Bedrock",
  "▸ Python · JavaScript · Apex · React",
  "▸ AWS · Databricks · Salesforce",
];

// ── Card dimensions ──────────────────────────────────────────────────────────
export const CARD = {
  width:  1180,
  height: 610,
  rx:     18,
};

// ── Portrait circle ──────────────────────────────────────────────────────────
export const PORTRAIT = {
  cx: 244,
  cy: 268,   // local coords (inside translate(0,38))
  r:  200,
  // ASCII grid
  cols:      52,
  rows:      46,
  charW:     7.6,
  lineH:     9.2,
  fontSize:  8,
  scanDur:   "3.5s",
};

// ── Info panel ───────────────────────────────────────────────────────────────
export const PANEL = {
  x:      508,
  y:      10,
  width:  655,
  height: 500,
  rx:     14,
  textX:  524,   // x offset for text lines
};

// ── Titlebar ─────────────────────────────────────────────────────────────────
export const TITLEBAR = {
  prompt:   "guest@abhijith:~$ cat profile.md",
  statusLabel: "DEPLOYED",
};

// ── Manifesto ────────────────────────────────────────────────────────────────
export const MANIFESTO = "Agents are the interface. The rest is scaffolding.";

// ── Themes ───────────────────────────────────────────────────────────────────
export const THEMES = {
  dark: {
    bg:         ["#0F1E3A", "#0A0E1A"],   // radialGradient stops
    panelFill:  "#11141F",
    panelStroke:"#BD93F9",
    border:     ["#00D4FF", "#00FF9F", "#FF6B00"],  // borderGrad stops
    asciiGrad:  ["#00D4FF", "#00FF9F"],
    scanLine:   "#00D4FF",
    ring1:      "#00D4FF",
    ring2:      "#00FF9F",
    grid:       "#00D4FF",
    // terminal colours (Dracula)
    colPromptUser: "#50FA7B",
    colPromptAt:   "#6272A4",
    colPromptPath: "#F8F8F2",
    colKey:        "#BD93F9",
    colValue:      "#F8F8F2",
    colComment:    "#6272A4",
    colAccent:     "#50FA7B",
    colAmber:      "#FFB86C",
    colCyan:       "#8BE9FD",
    colCursor:     "#BD93F9",
    colStatus:     "#50FA7B",
    colManifesto:  "#1E3A5F",
    presenceDot:   "#00FF9F",
    panelTitle:    "#00D4FF",
    scanLabel:     "#50FA7B",
    termLabel:     "#1E3A5F",
  },
  light: {
    bg:         ["#F0F9FF", "#F8FAFC"],
    panelFill:  "#E2E8F0",
    panelStroke:"#0369A1",
    border:     ["#0369A1", "#047857", "#C2410C"],
    asciiGrad:  ["#0369A1", "#047857"],
    scanLine:   "#0369A1",
    ring1:      "#0369A1",
    ring2:      "#047857",
    grid:       "#0369A1",
    colPromptUser: "#047857",
    colPromptAt:   "#94A3B8",
    colPromptPath: "#1E293B",
    colKey:        "#0369A1",
    colValue:      "#1E293B",
    colComment:    "#94A3B8",
    colAccent:     "#047857",
    colAmber:      "#C2410C",
    colCyan:       "#0891B2",
    colCursor:     "#0369A1",
    colStatus:     "#047857",
    colManifesto:  "#CBD5E1",
    presenceDot:   "#047857",
    panelTitle:    "#0369A1",
    scanLabel:     "#047857",
    termLabel:     "#94A3B8",
  },
};
