#!/usr/bin/env node
/**
 * generate-stats.mjs
 *
 * Generates dist/stats.svg, dist/langs.svg and dist/trophy.svg from the GitHub
 * GraphQL API — no third-party card services.
 *
 * Replaces the previous dependency on github-readme-stats and
 * github-profile-trophy, both of which return error cards (PAT_1 misconfig /
 * Vercel quota) rather than failing loudly.
 *
 * Env:
 *   GH_USERNAME - GitHub login to fetch stats for (required)
 *   GH_TOKEN    - GraphQL token. In Actions the default GITHUB_TOKEN works.
 *
 * Run: GH_USERNAME=eabhijith GH_TOKEN=$(gh auth token) node generate-stats.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { DISPLAY_NAME, BASE, COLORS } from "./brand.mjs";

const USERNAME = process.env.GH_USERNAME;
const TOKEN    = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const OUT_DIR  = process.env.OUTPUT_DIR || "dist";

if (!USERNAME) { console.error("Missing GH_USERNAME env var"); process.exit(1); }
if (!TOKEN)    { console.error("Missing GH_TOKEN / GITHUB_TOKEN env var"); process.exit(1); }

const { bgDark, cyan, green, amber, violet, muted } = COLORS;
const TEXT = "#CBD5E1";

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fmt = n => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

// ── Fetch ─────────────────────────────────────────────────────────────────────
const QUERY = `
query($login:String!){
  user(login:$login){
    login
    followers{ totalCount }
    pullRequests{ totalCount }
    issues{ totalCount }
    contributionsCollection{
      totalCommitContributions
      restrictedContributionsCount
      contributionCalendar{ totalContributions }
    }
    repositories(ownerAffiliations:[OWNER] first:100 isFork:false){
      totalCount
      nodes{
        stargazerCount
        languages(first:10 orderBy:{field:SIZE direction:DESC}){
          edges{ size node{ name color } }
        }
      }
    }
  }
}`;

async function fetchStats() {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "eabhijith-profile-generator",
    },
    body: JSON.stringify({ query: QUERY, variables: { login: USERNAME } }),
  });

  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  if (!json.data?.user) throw new Error(`No user data returned for ${USERNAME}`);
  return json.data.user;
}

// ── Derive ────────────────────────────────────────────────────────────────────
function derive(user) {
  const repos = user.repositories.nodes ?? [];
  const stars = repos.reduce((a, r) => a + r.stargazerCount, 0);

  const byLang = new Map();
  for (const repo of repos) {
    for (const { size, node } of repo.languages.edges ?? []) {
      if (!node?.name) continue;
      const prev = byLang.get(node.name) ?? { size: 0, color: node.color || muted };
      prev.size += size;
      byLang.set(node.name, prev);
    }
  }
  const total = [...byLang.values()].reduce((a, l) => a + l.size, 0) || 1;
  const langs = [...byLang.entries()]
    .map(([name, l]) => ({ name, color: l.color, pct: (l.size / total) * 100 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 6);

  const c = user.contributionsCollection;
  return {
    commits:   c.totalCommitContributions + c.restrictedContributionsCount,
    contribs:  c.contributionCalendar.totalContributions,
    prs:       user.pullRequests.totalCount,
    issues:    user.issues.totalCount,
    followers: user.followers.totalCount,
    repos:     user.repositories.totalCount,
    stars,
    langs,
  };
}

// ── Cards ─────────────────────────────────────────────────────────────────────
const frame = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="6" fill="${bgDark}" stroke="${muted}" stroke-width="1"/>
${body}
</svg>`;

function statsCard(s) {
  const rows = [
    ["Total Commits",  s.commits],
    ["Contributions",  s.contribs],
    ["Pull Requests",  s.prs],
    ["Issues",         s.issues],
    ["Stars Earned",   s.stars],
    ["Followers",      s.followers],
  ];
  const body = [
    `  <text x="25" y="32" font-family="'Segoe UI',monospace" font-size="15px" font-weight="700" fill="${cyan}">${esc(DISPLAY_NAME)} · GitHub Stats</text>`,
    `  <line x1="25" y1="43" x2="470" y2="43" stroke="${muted}" stroke-width="0.8"/>`,
    ...rows.map(([label, value], i) => {
      const y = 70 + i * 24;
      return `  <text x="25" y="${y}" font-family="monospace" font-size="13px" fill="${TEXT}">${esc(label)}</text>\n` +
             `  <text x="400" y="${y}" font-family="monospace" font-size="13px" font-weight="700" fill="${green}">${fmt(value)}</text>`;
    }),
    `  <text x="25" y="218" font-family="monospace" font-size="11px" fill="${muted}">${esc(BASE)} · ${s.repos} public repos</text>`,
  ].join("\n");
  return frame(495, 232, body);
}

function langsCard(s) {
  if (!s.langs.length) {
    return frame(300, 232, `  <text x="25" y="40" font-family="monospace" font-size="13px" fill="${TEXT}">No language data</text>`);
  }
  const barX = 120, barW = 150;
  const body = [
    `  <text x="25" y="32" font-family="'Segoe UI',monospace" font-size="14px" font-weight="700" fill="${cyan}">Most Used Languages</text>`,
    `  <line x1="25" y1="43" x2="275" y2="43" stroke="${muted}" stroke-width="0.8"/>`,
    ...s.langs.map((l, i) => {
      const y = 70 + i * 26;
      const w = Math.max(4, Math.round((l.pct / 100) * barW));
      return `  <text x="25" y="${y}" font-family="monospace" font-size="12px" fill="${TEXT}">${esc(l.name)}</text>\n` +
             `  <rect x="${barX}" y="${y - 9}" width="${barW}" height="8" rx="4" fill="${muted}" opacity="0.3"/>\n` +
             `  <rect x="${barX}" y="${y - 9}" width="${w}" height="8" rx="4" fill="${l.color}"/>\n` +
             `  <text x="${barX + barW + 8}" y="${y}" font-family="monospace" font-size="10px" fill="${muted}">${l.pct.toFixed(1)}%</text>`;
    }),
  ].join("\n");
  return frame(340, 232, body);
}

// Tier thresholds: [S, A, B] — anything below B is C.
const TROPHIES = [
  { label: "Commits",   key: "commits",   tiers: [1000, 500, 100] },
  { label: "Stars",     key: "stars",     tiers: [100, 30, 10] },
  { label: "Followers", key: "followers", tiers: [100, 30, 10] },
  { label: "Repos",     key: "repos",     tiers: [50, 20, 10] },
  { label: "PRs",       key: "prs",       tiers: [100, 30, 10] },
  { label: "Issues",    key: "issues",    tiers: [100, 30, 10] },
  { label: "Contribs",  key: "contribs",  tiers: [1000, 500, 200] },
  { label: "Impact",    key: "impact",    tiers: [500, 200, 50] },
];

const rank = (v, [s, a, b]) =>
  v >= s ? { g: "S", c: amber } :
  v >= a ? { g: "A", c: green } :
  v >= b ? { g: "B", c: cyan }  :
           { g: "C", c: violet };

function trophyCard(s) {
  const vals = { ...s, impact: s.stars * 5 + s.prs * 2 + s.followers * 3 };
  const COLS = 4, CW = 110, CH = 106, PAD = 14;
  const w = PAD * 2 + COLS * CW;
  const rowsN = Math.ceil(TROPHIES.length / COLS);
  const h = PAD * 2 + rowsN * CH + 28;

  const cells = TROPHIES.map((t, i) => {
    const value = vals[t.key] ?? 0;
    const { g, c } = rank(value, t.tiers);
    const x = PAD + (i % COLS) * CW;
    const y = PAD + 28 + Math.floor(i / COLS) * CH;
    return `  <g>
    <rect x="${x + 4}" y="${y}" width="${CW - 8}" height="${CH - 10}" rx="6" fill="none" stroke="${c}" stroke-width="1" opacity="0.5"/>
    <text x="${x + CW / 2}" y="${y + 40}" text-anchor="middle" font-family="'Segoe UI',monospace" font-size="27px" font-weight="700" fill="${c}">${g}</text>
    <text x="${x + CW / 2}" y="${y + 62}" text-anchor="middle" font-family="monospace" font-size="11px" fill="${TEXT}">${esc(t.label)}</text>
    <text x="${x + CW / 2}" y="${y + 80}" text-anchor="middle" font-family="monospace" font-size="11px" font-weight="700" fill="${green}">${fmt(value)}</text>
  </g>`;
  });

  const body = [
    `  <text x="${PAD + 11}" y="30" font-family="'Segoe UI',monospace" font-size="14px" font-weight="700" fill="${cyan}">Trophies</text>`,
    ...cells,
  ].join("\n");
  return frame(w, h, body);
}

// ── main ──────────────────────────────────────────────────────────────────────
const user  = await fetchStats();
const stats = derive(user);

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const [file, svg] of [
  ["stats.svg",  statsCard(stats)],
  ["langs.svg",  langsCard(stats)],
  ["trophy.svg", trophyCard(stats)],
]) {
  const out = path.join(OUT_DIR, file);
  fs.writeFileSync(out, svg, "utf8");
  console.log(`${out} written (${(fs.statSync(out).size / 1024).toFixed(1)} KB)`);
}
