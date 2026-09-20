/**
 * readme/build.mjs
 * Assembles README.md from modular sections + animated dividers.
 * Run: node readme/build.mjs
 *
 * To add a section: create readme/sections/mysection.mjs with render()
 * To reorder: change SECTIONS array in readme/config.mjs
 * To change colors: edit brand.mjs, then run node dividers/build.mjs && node readme/build.mjs
 */

import fs   from "node:fs";
import path from "node:path";
import { SECTIONS }    from "./config.mjs";
import { DIVIDERS }    from "./divider.mjs";

// Section renderers
const RENDERERS = {
  card:     (await import("./sections/card.mjs"    )).render,
  badges:   (await import("./sections/badges.mjs"  )).render,
  pipeline: (await import("./sections/pipeline.mjs")).render,
  stats:    (await import("./sections/stats.mjs"   )).render,
  snake:    (await import("./sections/snake.mjs"   )).render,
  heatmap:  (await import("./sections/heatmap.mjs" )).render,
  footer:   (await import("./sections/footer.mjs"  )).render,
};

// Divider to use between each section (can override per-section in config)
const BETWEEN = {
  card:     DIVIDERS.flow,
  badges:   "",            // badges sit directly under card
  pipeline: DIVIDERS.nodes,
  stats:    DIVIDERS.nodes,
  snake:    DIVIDERS.reverse,
  heatmap:  DIVIDERS.flow,
  footer:   "",
};

function build() {
  const parts = [];

  for (const { id, enabled } of SECTIONS) {
    if (!enabled) continue;
    const renderer = RENDERERS[id];
    if (!renderer) { console.warn(`No renderer for section: ${id}`); continue; }
    parts.push(renderer());
    if (BETWEEN[id]) parts.push(BETWEEN[id]);
  }

  return parts.join("\n");
}

const readme = build();
const out = path.resolve(import.meta.dirname, "..", "README.md");
fs.writeFileSync(out, readme, "utf8");
console.log(`README.md written (${(readme.length/1024).toFixed(1)} KB)`);
