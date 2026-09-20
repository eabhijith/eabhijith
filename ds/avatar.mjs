/**
 * ds/avatar.mjs — Agent Avatar System
 *
 * Inspired by xAI's Grok Bot motion design.
 * One function: buildAvatar(config) → SVG string
 *
 * Rules:
 *  - Pure SMIL only (no CSS, no style=, no class=)
 *  - Eyes always painted LAST (on top of body)
 *  - Body + eyes in ONE group so z-order is always correct
 *  - Bob via animateTransform type="translate" additive="replace"
 *    on the INNER group only — outer group keeps absolute position
 */

// ── Head geometry (0-100 viewBox) ─────────────────────────────────────────────
export const SHAPES = {
  blob:     null,   // uses animated ellipse
  hexagon:  "M50 3 L89 25 Q93 27 93 32 V68 Q93 73 89 75 L50 97 Q50 98 46 96 L11 75 Q7 73 7 68 V32 Q7 27 11 25 L46 4 Q48 3 50 3 Z",
  squircle: "M28 4H72A24 24 0 0 1 96 28V72A24 24 0 0 1 72 96H28A24 24 0 0 1 4 72V28A24 24 0 0 1 28 4Z",
  teardrop: "M50 3 Q45 3 42 8 L20 41 Q4 65 10 81 Q18 96 50 96 Q82 96 90 81 Q96 65 80 41 L58 8 Q55 3 50 3 Z",
  triangle: "M50 7 Q57 7 60 14 L93 77 Q97 86 88 89 Q85 90 81 90 H19 Q10 90 7 83 Q5 78 8 73 L40 14 Q43 7 50 7 Z",
};

// ── Eye anchor points (in 0-100 box) ─────────────────────────────────────────
// cx_l, cx_r = left/right eye centre x
// cy        = eye centre y
// w, h      = eye capsule width/height
const EYE = {
  blob:     { lx: 34, rx: 60, cy: 50, w: 10, h: 24 },
  hexagon:  { lx: 33, rx: 59, cy: 48, w:  9, h: 20 },
  squircle: { lx: 33, rx: 59, cy: 48, w:  9, h: 20 },
  teardrop: { lx: 34, rx: 60, cy: 54, w:  9, h: 20 },
  triangle: { lx: 31, rx: 57, cy: 62, w:  9, h: 18 },
};

// ── Per-state motion ──────────────────────────────────────────────────────────
export const STATES = {
  idle: {
    bob:   { keyValues: "0 0;0 -7;0 0",   dur: "2.8s" },
    blink: "3.6s",
  },
  working: {
    bob:   { keyValues: "0 0;-2 -3;2 -3;0 0", dur: "0.42s" },
    blink: "1.8s",
  },
  thinking: {
    bob:   { keyValues: "0 0;0 -4;0 0",   dur: "1.1s" },
    blink: "2.0s",
  },
  done: {
    bob:   { keyValues: "0 0;0 -8;0 2;0 0", dur: "2.2s" },
    blink: "3.2s",
  },
  blocked: {
    bob:   { keyValues: "0 0;3 0;-3 0;0 0", dur: "0.45s" },
    blink: "1.2s",
  },
};

// ── Glow filter registry (one per color to avoid id conflicts) ────────────────
const _filterCache = new Map();

export function glowFilter(id, stdDev = 8) {
  if (_filterCache.has(id)) return "";
  _filterCache.set(id, true);
  return `<filter id="${id}" x="-40%" y="-40%" width="180%" height="180%">
  <feGaussianBlur stdDeviation="${stdDev}" result="b"/>
  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>`;
}

export function resetFilterCache() { _filterCache.clear(); }

// ── buildAvatar ───────────────────────────────────────────────────────────────
/**
 * @param {object} cfg
 *   cx, cy       — absolute centre in SVG coords
 *   size         — diameter in px (default 80)
 *   color        — fill color string
 *   shape        — keyof SHAPES (default "blob")
 *   state        — keyof STATES (default "idle")
 *   filterId     — id for glow filter (must be unique per avatar)
 *   label        — text below (optional)
 *   sublabel     — smaller text below label (optional)
 *   presenceDot  — bool (default true)
 *   dotColor     — presence dot color (default "#00FF9F")
 *   mono         — font family string
 *   showAt       — seconds: animate opacity 0→1 at this time (0 = always visible)
 */
export function buildAvatar({
  cx, cy,
  size        = 80,
  color       = "#00D4FF",
  shape       = "blob",
  state       = "idle",
  filterId    = "glow",
  label       = "",
  sublabel    = "",
  presenceDot = true,
  dotColor    = "#00FF9F",
  mono        = "'JetBrains Mono','Fira Code',monospace",
  showAt      = 0,
}) {
  const S  = size;
  const sc = S / 100;              // scale from 0-100 box to S px
  const st = STATES[state] ?? STATES.idle;
  const ep = EYE[shape]   ?? EYE.blob;
  const path = SHAPES[shape];

  // ── Top-left of the avatar box ────────────────────────────────────────────
  const ox = cx - S / 2;
  const oy = cy - S / 2;

  // ── Body ──────────────────────────────────────────────────────────────────
  let body;
  if (!path) {
    // Blob: organic animated ellipse
    const rx0 = S * 0.46, ry0 = S * 0.48;
    const rx1 = rx0 * 1.09, ry1 = ry0 * 0.91;
    body = `<ellipse cx="${S/2}" cy="${S/2}" rx="${rx0}" ry="${ry0}" fill="${color}" filter="url(#${filterId})">
  <animate attributeName="rx" values="${rx0};${rx1};${rx0}" dur="${st.bob.dur}" repeatCount="indefinite"/>
  <animate attributeName="ry" values="${ry0};${ry1};${ry0}" dur="${st.bob.dur}" repeatCount="indefinite"/>
</ellipse>`;
  } else {
    body = `<path d="${path}" fill="${color}" filter="url(#${filterId})" transform="scale(${sc})"/>`;
  }

  // ── Highlight ─────────────────────────────────────────────────────────────
  const hlCx = S * 0.30, hlCy = S * 0.26;
  const hl = `<ellipse cx="${hlCx}" cy="${hlCy}"
  rx="${S * 0.16}" ry="${S * 0.10}"
  fill="rgba(255,255,255,0.22)"
  transform="rotate(-24 ${hlCx} ${hlCy})"/>`;

  // ── Eyes (scaled into S×S box, painted LAST = on top) ────────────────────
  const ew  = ep.w  * sc;
  const eh  = ep.h  * sc;
  const er  = ew / 2;
  const ley = ep.cy * sc - eh / 2;  // eye top y
  const lx  = ep.lx * sc - ew / 2;
  const rx  = ep.rx * sc - ew / 2;
  const bDur = st.blink;

  const eyeRect = (ex, delay = "0s") =>
    `<rect x="${ex.toFixed(2)}" y="${ley.toFixed(2)}" width="${ew.toFixed(2)}" height="${eh.toFixed(2)}" rx="${er.toFixed(2)}" fill="#0A0E1A">
  <animate attributeName="height" values="${eh.toFixed(2)};${(eh*0.07).toFixed(2)};${eh.toFixed(2)}" dur="${bDur}" begin="${delay}" repeatCount="indefinite"/>
  <animate attributeName="y"      values="${ley.toFixed(2)};${(ley+eh*0.465).toFixed(2)};${ley.toFixed(2)}" dur="${bDur}" begin="${delay}" repeatCount="indefinite"/>
</rect>`;

  // ── Bob animation (translate inner group) ─────────────────────────────────
  // Uses animateTransform on the INNER group — outer group stays at (ox,oy)
  const nKV  = st.bob.keyValues.split(";").length;
  const splines = Array(nKV - 1).fill("0.4 0 0.6 1").join(";");
  const bob = `<animateTransform attributeName="transform" type="translate"
  values="${st.bob.keyValues}" dur="${st.bob.dur}"
  repeatCount="indefinite" calcMode="spline" keySplines="${splines}"/>`;

  // ── Appear animation (optional) ───────────────────────────────────────────
  const appear = showAt > 0
    ? `<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${showAt}s" fill="freeze"/>`
    : "";

  // ── Presence dot ──────────────────────────────────────────────────────────
  const dotX = cx + S * 0.46;
  const dotY = cy + S * 0.46;
  const dot = presenceDot
    ? `<circle cx="${dotX.toFixed(1)}" cy="${dotY.toFixed(1)}" r="6" fill="${dotColor}" stroke="#0A0E1A" stroke-width="2">
  <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite"/>
</circle>`
    : "";

  // ── Labels ────────────────────────────────────────────────────────────────
  const labelY  = cy + S / 2 + 20;
  const slabelY = cy + S / 2 + 34;
  const lbl  = label    ? `<text x="${cx}" y="${labelY.toFixed(1)}" text-anchor="middle" font-family="${mono}" font-size="12px" font-weight="700" fill="${color}" letter-spacing="1px">${label}</text>` : "";
  const slbl = sublabel ? `<text x="${cx}" y="${slabelY.toFixed(1)}" text-anchor="middle" font-family="${mono}" font-size="9px" fill="#334155">${sublabel}</text>` : "";

  // ── Assemble: position group → bob group → body+eyes ─────────────────────
  // CRITICAL: animateTransform replaces the transform attribute on its element.
  // So bob must be on its OWN group with NO initial transform attribute.
  // Outer group: absolute position via translate(ox,oy) — never animated
  // Inner group: no transform attr, bob animateTransform works freely
  return `<g opacity="${showAt > 0 ? 0 : 1}">${appear}
  <g transform="translate(${ox.toFixed(1)},${oy.toFixed(1)})">
    <g>
      ${bob}
      ${body}
      ${hl}
      ${eyeRect(lx, "0s")}
      ${eyeRect(rx, "0.12s")}
    </g>
  </g>
  ${dot}${lbl}${slbl}
</g>`;
}
