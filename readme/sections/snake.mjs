/** readme/sections/snake.mjs */
import { USERNAME } from "../../brand.mjs";
const SNAKE = `https://raw.githubusercontent.com/${USERNAME}/${USERNAME}/snake`;

export function render() {
  return `<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${SNAKE}/github-snake-dark.svg"/>
    <source media="(prefers-color-scheme: light)" srcset="${SNAKE}/github-snake.svg"/>
    <img alt="contribution snake" src="${SNAKE}/github-snake-dark.svg"/>
  </picture>
</p>
`;
}
