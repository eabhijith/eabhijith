/** readme/sections/stats.mjs
 *  Uses self-generated SVGs from dist/ (populated by .github/workflows/stats.yml)
 *  Falls back to live URLs if dist files aren't available yet.
 */
import { USERNAME, STATS_THEME } from "../../brand.mjs";
const RAW = `https://raw.githubusercontent.com/${USERNAME}/${USERNAME}/main`;
const { bg, title, text, icon, border, ring, fire, streakLabel, sideLabels, dates } = STATS_THEME;

export function render() {
  // Use self-hosted dist/ SVGs — generated daily by stats.yml
  return `<p align="center">
  <img src="${RAW}/dist/stats.svg" width="48%" alt="GitHub Stats"/>
  <img src="${RAW}/dist/streak.svg" width="48%" alt="Streak Stats"/>
</p>
<p align="center">
  <img src="${RAW}/dist/langs.svg" width="48%" alt="Top Languages"/>
  <img src="${RAW}/dist/trophy.svg" width="48%" alt="Trophies"/>
</p>
`;
}
