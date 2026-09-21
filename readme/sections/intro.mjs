/**
 * readme/sections/intro.mjs
 * Plain-text intro — the searchable, screen-reader-visible part of the README.
 *
 * GitHub strips `style` and `<style>` from markdown, so the only ways to add
 * colour are images and code chips. The heading and tagline stay real text
 * (GitHub search and screen readers index them); the stack renders as badge
 * rows, each badge carrying its name as alt text.
 */
import { DISPLAY_NAME, ROLE, BASE, MISSION, STACK, COLORS, LINKS } from "../../brand.mjs";

const BG = COLORS.bgDark.replace("#", "");
const hex = k => COLORS[k].replace("#", "");

// shields.io reads "-" as a separator, so literal dashes must be doubled.
const shield = (text) => encodeURIComponent(text).replace(/-/g, "--");

function badge({ name, logo }, accent) {
  const c = hex(accent);
  const logoParams = logo ? `&logo=${logo}&logoColor=${c}` : "";
  return `<img src="https://img.shields.io/badge/${shield(name)}-${c}?style=flat-square&labelColor=${BG}${logoParams}" alt="${name}"/>`;
}

export function render() {
  const rows = STACK
    .map(({ accent, items }) =>
      `<p align="center">\n  ${items.map(i => badge(i, accent)).join("\n  ")}\n</p>`)
    .join("\n");

  return `<h2 align="center">${DISPLAY_NAME} — ${ROLE}</h2>

<p align="center">
  <strong>${MISSION}</strong><br/>
  I build orchestrators, not scripts — agents with real memory, real tools, real autonomy.<br/>
  <sub>Based in ${BASE}</sub>
</p>

${rows}

<p align="center">
  <a href="${LINKS.agentsMd}">
    <img src="https://img.shields.io/badge/How%20to%20work%20with%20me-${hex("cyan")}?style=for-the-badge&labelColor=${BG}" alt="How to work with me"/>
  </a>
</p>
`;
}
