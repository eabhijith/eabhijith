/**
 * readme/sections/now.mjs
 * "Currently working on" — the highest-signal plain-text section.
 * Content lives in brand.mjs (NOW). Entries gain a link once `url` is set.
 */
import { NOW } from "../../brand.mjs";

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function render() {
  if (!NOW.length) return "";

  const items = NOW.map(({ name, note, url }) => {
    const label = url ? `<a href="${url}">${esc(name)}</a>` : `<strong>${esc(name)}</strong>`;
    return `  ${label} — ${esc(note)}`;
  }).join("<br/>\n");

  return `<h3 align="center">Currently working on</h3>

<p align="center">
${items}
</p>
`;
}
