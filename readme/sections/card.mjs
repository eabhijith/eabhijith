/**
 * readme/sections/card.mjs
 * The animated terminal profile card (dark/light SVG).
 */
export function render() {
  return `<a href="https://github.com/eabhijith/eabhijith">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/eabhijith/eabhijith/main/dark.svg">
    <img alt="Abhijith Eanuga" src="https://raw.githubusercontent.com/eabhijith/eabhijith/main/light.svg" width="100%"/>
  </picture>
</a>
`;
}
