#!/usr/bin/env node
/**
 * card/build.mjs
 *
 * Assembles dark.svg and light.svg from components.
 * Run: node card/build.mjs
 *
 * To regenerate ASCII portrait from avatar:
 *   node card/build.mjs --regen-ascii
 */

import fs from "node:fs";
import path from "node:path";
import { createCanvas } from "node:canvas";   // only needed for regen
import { CARD, PORTRAIT } from "./config.mjs";
import { buildDefs }      from "./components/defs.mjs";
import { buildTitlebar }  from "./components/titlebar.mjs";
import { buildPortrait }  from "./components/portrait.mjs";
import { buildInfoPanel } from "./components/info-panel.mjs";
import { buildBorder }    from "./components/border.mjs";

const ROOT   = path.resolve(import.meta.dirname, "..");
const TSPANS = path.join(import.meta.dirname, "portrait-tspans.txt");

// ── ASCII portrait generator ─────────────────────────────────────────────────
async function regenAscii() {
  // Requires: npm install canvas
  const { createCanvas, loadImage } = await import("canvas");
  const img = await loadImage("https://avatars.githubusercontent.com/u/17565188?v=4");

  const { cols: W, rows: H, charW, lineH, fontSize } = PORTRAIT;
  const { cx, cy, r } = PORTRAIT;
  const cx_img = W / 2, cy_img = H / 2, r_img = W / 2 - 0.5;

  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, W, H);

  const ASCII = "@%#*+=-:. ";
  const startX = cx - (W * charW) / 2;
  const startY = cy - (H * lineH) / 2 + lineH;

  const tspans = [];
  for (let y = 0; y < H; y++) {
    let row = "";
    for (let x = 0; x < W; x++) {
      const dist = Math.hypot(x - cx_img, y - cy_img);
      if (dist > r_img) { row += " "; continue; }
      const d = ctx.getImageData(x, y, 1, 1).data;
      if (d[3] < 30) { row += " "; continue; }
      const lum = Math.round(0.299 * d[0] + 0.587 * d[1] + 0.114 * d[2]);
      row += ASCII[Math.round(lum / 255 * (ASCII.length - 1))];
    }
    const sy = startY + y * lineH;
    tspans.push(`<tspan x="${Math.round(startX)}" y="${Math.round(sy)}">${row.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</tspan>`);
  }

  fs.writeFileSync(TSPANS, tspans.join("\n"), "utf8");
  console.log(`portrait-tspans.txt written (${tspans.length} rows)`);
}

// ── SVG assembler ─────────────────────────────────────────────────────────────
function buildCard(theme) {
  const { width, height, rx } = CARD;
  const t_obj = (await import("./config.mjs")).THEMES[theme];

  const parts = [
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
  ];

  return parts.join("\n");
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--regen-ascii")) {
    await regenAscii();
  }

  if (!fs.existsSync(TSPANS)) {
    console.error("portrait-tspans.txt not found. Run: node card/build.mjs --regen-ascii");
    process.exit(1);
  }

  for (const theme of ["dark", "light"]) {
    // buildCard uses top-level await — wrap properly
    const { THEMES } = await import("./config.mjs");
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
