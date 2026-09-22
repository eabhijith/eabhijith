#!/usr/bin/env node
/**
 * card/build.mjs
 *
 * Assembles dark.svg and light.svg from components.
 * Run: node card/build.mjs
 *
 * To regenerate the ASCII portrait from card/avatar.jpg:
 *   python3 card/gen-portrait.py
 */

import fs from "node:fs";
import path from "node:path";
import { CARD, PORTRAIT } from "./config.mjs";
import { buildDefs }      from "./components/defs.mjs";
import { buildTitlebar }  from "./components/titlebar.mjs";
import { buildPortrait }  from "./components/portrait.mjs";
import { buildInfoPanel } from "./components/info-panel.mjs";
import { buildBorder }    from "./components/border.mjs";

const ROOT   = path.resolve(import.meta.dirname, "..");
const TSPANS = path.join(import.meta.dirname, "portrait-tspans.txt");

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  if (!fs.existsSync(TSPANS)) {
    console.error("portrait-tspans.txt not found. Run: python3 card/gen-portrait.py");
    process.exit(1);
  }

  for (const theme of ["dark", "light"]) {
    const svg = buildCardSync(theme);
    const out = path.join(ROOT, `${theme}.svg`);
    fs.writeFileSync(out, svg, "utf8");
    console.log(`${theme}.svg written (${(fs.statSync(out).size / 1024).toFixed(1)} KB)`);
  }
}

function buildCardSync(theme) {
  const { width, height, rx } = CARD;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    buildDefs(theme),
    `<rect width="${width}" height="${height}" rx="${rx}" fill="url(#bgGrad)"/>`,
    buildTitlebar(theme),
    `<g transform="translate(0,38)">`,
    buildPortrait(theme, "portrait-tspans.txt"),
    buildInfoPanel(theme),
    `</g>`,
    buildBorder(theme),
    `</svg>`,
  ].join("\n");
}

main().catch(err => { console.error(err); process.exit(1); });
