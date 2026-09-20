/** readme/sections/footer.mjs */
import { LINKS } from "../../brand.mjs";

export function render() {
  return `<p align="center">
  <a href="${LINKS.agentsMd}">→ How to work with me</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="${LINKS.linkedin}">LinkedIn</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="${LINKS.website}">Website</a>
</p>
`;
}
