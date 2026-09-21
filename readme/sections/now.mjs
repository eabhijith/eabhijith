/**
 * readme/sections/now.mjs
 * "Currently working on" — the highest-signal plain-text section.
 *
 * Project names render as <code> chips: GitHub gives inline code a tinted
 * background, which is the only way to make text stand out without CSS.
 * Content lives in brand.mjs (NOW); entries gain a link once `url` is set.
 */
import { NOW } from "../../brand.mjs";

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function render() {
  if (!NOW.length) return "";

  const items = NOW.map(({ name, note, url }) => {
    const chip = `<code>${esc(name)}</code>`;
    const label = url ? `<a href="${url}">${chip}</a>` : chip;
    return `  ${label} &nbsp;<sub>${esc(note)}</sub>`;
  }).join("<br/>\n");

  return `<h3 align="center">Currently working on</h3>

<p align="center">
${items}
</p>
`;
}
