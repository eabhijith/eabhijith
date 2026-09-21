/**
 * readme/sections/intro.mjs
 * Plain-text intro — the only non-image content in the README.
 * Exists so GitHub search, screen readers and text scrapers see who this is.
 */
import { DISPLAY_NAME, ROLE, BASE, MISSION, CAPABILITIES, LINKS } from "../../brand.mjs";

const stack = CAPABILITIES.map(c => c.replace(/^▸\s*/, "")).join(" · ");

export function render() {
  return `<h2 align="center">${DISPLAY_NAME} — ${ROLE}</h2>

<p align="center">
  ${MISSION} · based in ${BASE}.<br/>
  I build orchestrators, not scripts — agents with real memory, real tools, real autonomy.
</p>

<p align="center">
  <strong>Stack:</strong> ${stack}
</p>

<p align="center">
  <a href="${LINKS.agentsMd}">How to work with me →</a>
</p>
`;
}
