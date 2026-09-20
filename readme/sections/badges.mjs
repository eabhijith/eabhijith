/** readme/sections/badges.mjs */
import { COLORS, USERNAME, LINKS } from "../../brand.mjs";
const { bgDark, cyan, green, amber } = COLORS;
const bg = bgDark.replace("#","");

export function render() {
  return `<p align="center">
  <img src="https://img.shields.io/badge/STATUS-DEPLOYED-${green.replace("#","")}?style=flat-square&labelColor=${bg}"/>
  <img src="https://img.shields.io/badge/BASE-BERLIN%20%F0%9F%87%A9%F0%9F%87%AA-${cyan.replace("#","")}?style=flat-square&labelColor=${bg}"/>
  <img src="https://img.shields.io/badge/AGENTS-ACTIVE-${green.replace("#","")}?style=flat-square&labelColor=${bg}"/>
</p>
<p align="center">
  <a href="${LINKS.website}">
    <img src="https://img.shields.io/badge/eabhijith.vercel.app-${bg}?style=for-the-badge&logo=vercel&logoColor=${cyan.replace("#","")}"/>
  </a>
  <a href="${LINKS.linkedin}">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/>
  </a>
  <img src="https://komarev.com/ghpvc/?username=${USERNAME}&color=${cyan.replace("#","")}&style=for-the-badge&label=PROFILE+VIEWS"/>
</p>
`;
}
