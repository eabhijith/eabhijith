/** readme/sections/pipeline.mjs */
import { USERNAME } from "../../brand.mjs";
const RAW = `https://raw.githubusercontent.com/${USERNAME}/${USERNAME}/main`;

export function render() {
  return `<p align="center">
  <img src="${RAW}/dist/github-agents.svg" width="100%" alt="GitHub Agents Pipeline"/>
</p>
`;
}
