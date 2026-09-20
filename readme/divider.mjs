/**
 * readme/divider.mjs
 * Branded animated dividers — committed SVGs, zero external deps.
 * Colors are driven by brand.mjs — rebuild dividers when brand changes.
 */
import { USERNAME } from "../brand.mjs";
const RAW = `https://raw.githubusercontent.com/${USERNAME}/${USERNAME}/main/dividers`;

export const DIVIDERS = {
  // Packets travel left → right (cyan→green→amber)
  flow:    `<p align="center"><img src="${RAW}/flow.svg" width="100%"/></p>\n`,
  // Pulsing connected nodes (all brand colors)
  nodes:   `<p align="center"><img src="${RAW}/nodes.svg" width="100%"/></p>\n`,
  // Packets travel right → left (amber→green→cyan)
  reverse: `<p align="center"><img src="${RAW}/reverse.svg" width="100%"/></p>\n`,
};
