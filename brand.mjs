/**
 * brand.mjs — SINGLE SOURCE OF TRUTH
 *
 * Every color, URL, label used anywhere in this profile lives here.
 * Change a value here and rebuild — nothing else needs touching.
 *
 * Used by:
 *   card/config.mjs       → imports COLORS, IDENTITY
 *   readme/build.mjs      → imports everything
 *   dividers/build.mjs    → imports COLORS
 *   .github/workflows/*   → reads USERNAME
 */

// ── Identity ─────────────────────────────────────────────────────────────────
export const USERNAME    = "eabhijith";
export const DISPLAY_NAME = "Abhijith Eanuga";
export const ROLE        = "AI Engineer";
export const BASE        = "Berlin, Germany";
export const MISSION     = "Multi-Agent · LLM Orchestration";
export const STATUS      = "DEPLOYED · ACTIVE";
export const PHILOSOPHY  = "Functional · Minimal · Ship it";
export const UPTIME      = "since 2017 · Berlin";
export const MANIFESTO   = "Agents are the interface. The rest is scaffolding.";
export const FUN_FACT    = "World is all about mind and matter — if we don't mind, it doesn't matter";

// ── Links ─────────────────────────────────────────────────────────────────────
export const LINKS = {
  github:   `https://github.com/${USERNAME}`,
  linkedin: "https://www.linkedin.com/in/eabhijith/",
  website:  "https://eabhijith.vercel.app/",
  agentsMd: `https://github.com/${USERNAME}/${USERNAME}/blob/main/AGENTS.md`,
};

// ── Projects ──────────────────────────────────────────────────────────────────
export const PROJECTS = [
  "personal AI OS",
  "archify — diagram renderer",
];

// ── Currently working on ──────────────────────────────────────────────────────
// Rendered by readme/sections/now.mjs. Add `url` once a project is public.
export const NOW = [
  { name: "personal AI OS",  note: "file-based agent memory, git-backed, portable" },
  { name: "archify",         note: "diagram renderer, architecture as code" },
];

// ── Capabilities ──────────────────────────────────────────────────────────────
export const CAPABILITIES = [
  "▸ Pydantic-AI · LangGraph · Bedrock",
  "▸ Python · JavaScript · Apex · React",
  "▸ AWS · Databricks · Salesforce",
];

// ── Brand colors ──────────────────────────────────────────────────────────────
// Change these and every SVG/README rebuilds with the new palette
export const COLORS = {
  // Primary accents
  cyan:     "#00D4FF",
  green:    "#00FF9F",
  amber:    "#FF6B00",
  violet:   "#BD93F9",
  red:      "#FF4444",

  // Dracula terminal palette (info panel)
  draculaBg:       "#11141F",
  draculaComment:  "#6272A4",
  draculaFg:       "#F8F8F2",
  draculaGreen:    "#50FA7B",
  draculaCyan:     "#8BE9FD",
  draculaOrange:   "#FFB86C",
  draculaPurple:   "#BD93F9",

  // Backgrounds
  bgDark:   "#0A0E1A",
  bgDeep:   "#050816",
  bgPanel:  "#0F1E3A",
  bgMid:    "#11141F",

  // Muted
  muted:    "#1E3A5F",
  slate:    "#334155",
};

// ── Themes (used by card/config.mjs) ─────────────────────────────────────────
export const THEMES = {
  dark: {
    bg:          [COLORS.bgPanel, COLORS.bgDark],
    panelFill:   COLORS.bgMid,
    panelStroke: COLORS.violet,
    border:      [COLORS.cyan, COLORS.green, COLORS.amber],
    asciiGrad:   [COLORS.cyan, COLORS.green],
    scanLine:    COLORS.cyan,
    ring1:       COLORS.cyan,
    ring2:       COLORS.green,
    colPromptUser: COLORS.draculaGreen,
    colPromptAt:   COLORS.draculaComment,
    colPromptPath: COLORS.draculaFg,
    colKey:        COLORS.draculaPurple,
    colValue:      COLORS.draculaFg,
    colComment:    COLORS.draculaComment,
    colAccent:     COLORS.draculaGreen,
    colAmber:      COLORS.draculaOrange,
    colCyan:       COLORS.draculaCyan,
    colCursor:     COLORS.draculaPurple,
    colStatus:     COLORS.draculaGreen,
    colManifesto:  COLORS.muted,
    presenceDot:   COLORS.green,
    panelTitle:    COLORS.cyan,
    scanLabel:     COLORS.draculaGreen,
    termLabel:     COLORS.muted,
  },
  light: {
    bg:          ["#F0F9FF", "#F8FAFC"],
    panelFill:   "#E2E8F0",
    panelStroke: "#0369A1",
    border:      ["#0369A1", "#047857", "#C2410C"],
    asciiGrad:   ["#0369A1", "#047857"],
    scanLine:    "#0369A1",
    ring1:       "#0369A1",
    ring2:       "#047857",
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

// ── Stats card styling (used in README) ───────────────────────────────────────
// Change COLORS above → these auto-update
export const STATS_THEME = {
  bg:           COLORS.bgDark.replace("#", ""),
  title:        COLORS.cyan.replace("#", ""),
  text:         "CBD5E1",
  icon:         COLORS.green.replace("#", ""),
  border:       COLORS.muted.replace("#", ""),
  ring:         COLORS.cyan.replace("#", ""),
  fire:         COLORS.amber.replace("#", ""),
  streakLabel:  COLORS.cyan.replace("#", ""),
  sideLabels:   COLORS.green.replace("#", ""),
  dates:        "CBD5E1",
};
