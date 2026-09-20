/**
 * card/components/info-panel.mjs
 * Right panel: dracula terminal manifest with instant text display.
 */

import { IDENTITY, PROJECTS, CAPABILITIES, PANEL, THEMES } from "../config.mjs";

function line(x, y, key, val, t, style = "kv") {
  const styles = {
    prompt:  `<tspan fill="${t.colComment}">guest@</tspan><tspan fill="${t.colAccent}" font-weight="bold">${IDENTITY.id}</tspan><tspan fill="${t.colComment}">:~$ </tspan><tspan fill="${t.colValue}">cat profile.md</tspan>`,
    kv:      `<tspan fill="${t.colComment}">  </tspan><tspan fill="${t.colKey}" font-weight="bold">${key}</tspan><tspan fill="${t.colComment}"> .. </tspan><tspan fill="${t.colValue}">${val}</tspan>`,
    status:  `<tspan fill="${t.colComment}">  </tspan><tspan fill="${t.colKey}" font-weight="bold">${key}</tspan><tspan fill="${t.colComment}"> .. </tspan><tspan fill="${t.colStatus}" font-weight="bold">${val}</tspan>`,
    section: `<tspan fill="${t.colComment}">  </tspan><tspan fill="${t.colKey}" font-weight="bold">${key}</tspan><tspan fill="${t.colAccent}"> ${val}</tspan>`,
    item:    `<tspan fill="${t.colComment}">    </tspan><tspan fill="${t.colValue}">${val}</tspan>`,
    website: `<tspan fill="${t.colComment}">  </tspan><tspan fill="${t.colKey}" font-weight="bold">${key}</tspan><tspan fill="${t.colComment}"> .. </tspan><tspan fill="${t.colCyan}">${val}</tspan>`,
    cursor:  `<tspan fill="${t.colCursor}" font-weight="bold">$ _</tspan>`,
    blank:   ``,
  };
  return `  <text x="${x}" y="${y}" font-family="'Courier New',monospace" font-size="13px">${styles[style] ?? styles.kv}</text>`;
}

export function buildInfoPanel(theme) {
  const t = THEMES[theme];
  const x = PANEL.textX;

  // y positions — fixed grid, 22px per row
  const rows = [
    [46,  "prompt",  null,                   null],
    [68,  "kv",      "agent_id",             IDENTITY.id],
    [90,  "kv",      "designation",          IDENTITY.designation],
    [112, "kv",      "base",                 IDENTITY.base],
    [134, "kv",      "mission",              IDENTITY.mission],
    [156, "status",  "status",               IDENTITY.status],
    [178, "blank",   null,                   null],
    [200, "section", "capabilities",         "────────────────────"],
    ...CAPABILITIES.map((c, i) => [222 + i * 22, "item", null, c]),
    [288, "blank",   null,                   null],
    [310, "section", "side_projects",        "────────────────────"],
    ...PROJECTS.map((p, i) => [332 + i * 22, "item", null, `▸ ${p}`]),
    [376, "blank",   null,                   null],
    [398, "kv",      "philosophy",           IDENTITY.philosophy],
    [420, "kv",      "uptime",               IDENTITY.uptime],
    [442, "blank",   null,                   null],
    [464, "kv",      "linkedin",             IDENTITY.linkedin],
    [486, "kv",      "github",               IDENTITY.github],
    [508, "website", "website",              IDENTITY.website],
    [530, "cursor",  null,                   null],
  ];

  const lines = rows
    .filter(([, style]) => style !== "blank")
    .map(([y, style, key, val]) => line(x, y, key, val, t, style))
    .join("\n");

  // blinking cursor block (SMIL only)
  const cursorBlink = `  <rect x="${x}" y="516" width="8" height="14" fill="${t.colCursor}" opacity="0.85">
    <animate attributeName="opacity" values="0.85;0;0.85;0;0.85;0" dur="1.4s" repeatCount="indefinite"/>
  </rect>`;

  return `
  <!-- ── RIGHT PANEL ───────────────────────────────── -->
  <rect x="${PANEL.x}" y="${PANEL.y}" width="${PANEL.width}" height="${PANEL.height}" rx="${PANEL.rx}"
    fill="${t.panelFill}" fill-opacity="0.85"
    stroke="${t.panelStroke}" stroke-width="1" opacity="0.7"/>
  <text x="${PANEL.textX}" y="24" font-family="'Courier New',monospace" font-size="11px" fill="${t.panelTitle}" letter-spacing="2px" opacity="0.6">AGENT.MANIFEST</text>
  <!-- ruled line under panel title -->
  <line x1="${PANEL.x}" y1="30" x2="${PANEL.x + PANEL.width}" y2="30" stroke="${t.panelStroke}" stroke-width="0.5" opacity="0.3"/>
  <!-- section dividers -->
  <line x1="${PANEL.textX}" y1="170" x2="1155" y2="170" stroke="${t.colComment}" stroke-width="0.4" opacity="0.4"/>
  <line x1="${PANEL.textX}" y1="300" x2="1155" y2="300" stroke="${t.colComment}" stroke-width="0.4" opacity="0.4"/>
  <line x1="${PANEL.textX}" y1="390" x2="1155" y2="390" stroke="${t.colComment}" stroke-width="0.4" opacity="0.4"/>
${lines}
${cursorBlink}`;
}
