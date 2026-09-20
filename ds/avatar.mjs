/**
 * ds/avatar.mjs
 *
 * The agent avatar system — pure data + pure functions.
 * Directly inspired by xAI's Grok Bot motion design (x.ai/news/designing-grok-bot)
 *
 * Three exports:
 *   SHAPES   — head geometry paths (0-100 viewBox)
 *   POSES    — per-state eye/body/expression data
 *   buildAvatar(config) — returns SVG string
 *
 * Rules:
 *   - One morphing blob body, two capsule eyes, nothing else
 *   - Distinction comes from color + head geometry
 *   - State is expressed through motion, not badges
 *   - Eyes are ALWAYS inside the head, positioned per shape
 */

// ── Head geometry (0-100 viewBox, scale to size) ──────────────────────────────
export const SHAPES = {
  blob:     null,   // organic animated ellipse — null = use ellipse renderer
  hexagon:  "M50 3 L89 25 Q93 27 93 32 V68 Q93 73 89 75 L50 97 Q50 98 46 96 L11 75 Q7 73 7 68 V32 Q7 27 11 25 L46 4 Q48 3 50 3 Z",
  squircle: "M28 4H72A24 24 0 0 1 96 28V72A24 24 0 0 1 72 96H28A24 24 0 0 1 4 72V28A24 24 0 0 1 28 4Z",
  teardrop: "M50 3 Q45 3 42 8 L20 41 Q4 65 10 81 Q18 96 50 96 Q82 96 90 81 Q96 65 80 41 L58 8 Q55 3 50 3 Z",
  triangle: "M50 7 Q57 7 60 14 L93 77 Q97 86 88 89 Q85 90 81 90 H19 Q10 90 7 83 Q5 78 8 73 L40 14 Q43 7 50 7 Z",
};

// ── Eye anchor points per shape (in 0-100 box) ────────────────────────────────
// Tuned so eyes sit visually inside each head geometry
const EYE_ANCHORS = {
  blob:     { lx: 33, rx: 58, cy: 50, w: 10, h: 24 },
  hexagon:  { lx: 32, rx: 58, cy: 48, w:  9, h: 21 },
  squircle: { lx: 32, rx: 58, cy: 48, w:  9, h: 21 },
  teardrop: { lx: 33, rx: 58, cy: 54, w:  9, h: 21 },
  triangle: { lx: 31, rx: 57, cy: 62, w:  9, h: 18 },
};

// ── Per-state motion data ─────────────────────────────────────────────────────
export const STATES = {
  idle: {
    bob:      { vals: "0,0;0,-7;0,0",           dur: "2.8s", ease: "0.4 0 0.6 1" },
    blink:    "3.6s",
    eye:      { sy: 1.0, sx: 1.0 },
  },
  working: {
    bob:      { vals: "0,0;-2,-3;2,-3;0,0",     dur: "0.42s", ease: "0.4 0 0.6 1" },
    blink:    "1.8s",
    eye:      { sy: 0.62, sx: 1.24 },  // wide x, squashed y
  },
  thinking: {
    bob:      { vals: "0,0;0,-4;0,0",            dur: "1.1s", ease: "0.4 0 0.6 1" },
    blink:    "2.0s",
    eye:      { sy: 0.82, sx: 0.9 },   // slightly narrowed
  },
  done: {
    bob:      { vals: "0,0;0,-6;0,2;0,0",        dur: "2.2s", ease: "0.4 0 0.6 1" },
    blink:    "3.2s",
    eye:      { sy: 0.72, sx: 1.06, tilt: -15 }, // arced up = "smile"
  },
  blocked: {
    bob:      { vals: "0,0;2,0;-2,0;0,0",        dur: "0.45s", ease: "0.4 0 0.6 1" },
    blink:    "1.2s",
    eye:      { sy: 0.5, sx: 0.86, tilt: 16 },   // tense inward
  },
};

// ── buildAvatar ───────────────────────────────────────────────────────────────
/**
 * @param {object} config
 *   cx, cy       — centre position in SVG coords
 *   size         — diameter in px (default 80)
 *   color        — fill color
 *   shape        — keyof SHAPES
 *   state        — keyof STATES
 *   showAt       — seconds before which avatar is opacity:0
 *   presenceDot  — bool (default true)
 *   label        — text below avatar
 *   sublabel     — smaller text below label
 * @returns string SVG
 */
export function buildAvatar({
  cx, cy,
  size = 80,
  color,
  shape = "blob",
  state = "idle",
  showAt = 0,
  presenceDot = true,
  label = "",
  sublabel = "",
}) {
  const S  = size;
  const sc = S / 100;
  const st = STATES[state] || STATES.idle;
  const ea = EYE_ANCHORS[shape] || EYE_ANCHORS.blob;
  const gx = cx - S / 2;
  const gy = cy - S / 2;

  // ── Body ──────────────────────────────────────────────────────────────────
  const path = SHAPES[shape];
  let body;
  if (!path) {
    // Blob: organic animated ellipse
    const rx = S * 0.46, ry = S * 0.48;
    body = `<ellipse cx="${S/2}" cy="${S/2}" rx="${rx}" ry="${ry}" fill="${color}">
      <animate attributeName="rx" values="${rx};${rx*1.09};${rx*0.96};${rx*1.04};${rx}" dur="${st.bob.dur}" repeatCount="indefinite"/>
      <animate attributeName="ry" values="${ry};${ry*0.91};${ry*1.04};${ry*0.96};${ry}" dur="${st.bob.dur}" repeatCount="indefinite"/>
    </ellipse>`;
  } else {
    body = `<path d="${path}" fill="${color}" transform="scale(${sc})"/>`;
  }

  // ── Highlight ─────────────────────────────────────────────────────────────
  const hlCx = S * 0.32, hlCy = S * 0.28;
  const highlight = `<ellipse cx="${hlCx}" cy="${hlCy}"
    rx="${S * 0.16}" ry="${S * 0.10}"
    fill="rgba(255,255,255,0.22)"
    transform="rotate(-24 ${hlCx} ${hlCy})"/>`;

  // ── Eyes ──────────────────────────────────────────────────────────────────
  const ew   = ea.w  * sc;
  const eh   = ea.h  * sc;
  const er   = ew / 2;
  const lx   = ea.lx * sc - ew / 2;
  const rx   = ea.rx * sc - ew / 2;
  const eyeY = ea.cy * sc - eh / 2;

  const eyeSy  = st.eye?.sy ?? 1;
  const eyeSx  = st.eye?.sx ?? 1;
  const eyeTilt = st.eye?.tilt ?? 0;
  const scaleAttr = (eyeSx !== 1 || eyeSy !== 1 || eyeTilt !== 0)
    ? `transform="scale(${eyeSx},${eyeSy}) rotate(${eyeTilt})" style="transform-box:fill-box;transform-origin:50% 50%"`
    : "";

  const blinkKT = "0;0.02;0.98;1";
  const blinkVH = `${eh};${eh*0.07};${eh}`;
  const blinkVY = `${eyeY};${eyeY + eh*0.465};${eyeY}`;

  const eye = (ex, delay = "0s") => `<rect x="${ex}" y="${eyeY}" width="${ew}" height="${eh}" rx="${er}" fill="#0A0E1A" ${scaleAttr}>
      <animate attributeName="height" values="${blinkVH}" dur="${st.blink}" begin="${delay}" repeatCount="indefinite"/>
      <animate attributeName="y"      values="${blinkVY}"  dur="${st.blink}" begin="${delay}" repeatCount="indefinite"/>
    </rect>`;

  const eyes = `${eye(lx, "0s")}${eye(rx, "0.12s")}`;

  // ── Bob animation ─────────────────────────────────────────────────────────
  const bobAnim = `<animateTransform attributeName="transform" type="translate"
    values="${st.bob.vals}" dur="${st.bob.dur}"
    repeatCount="indefinite" calcMode="spline"
    keySplines="${Array(st.bob.vals.split(";").length - 1).fill(st.bob.ease).join(";")}"/>`;

  // ── Appear ────────────────────────────────────────────────────────────────
  const appear = showAt > 0
    ? `<animate attributeName="opacity" from="0" to="1" dur="0.35s" begin="${showAt}s" fill="freeze"/>`
    : "";

  // ── Presence dot ──────────────────────────────────────────────────────────
  const dot = presenceDot
    ? `<circle cx="${cx + S*0.46}" cy="${cy + S*0.46}" r="6"
        fill="#00FF9F" stroke="#0A0E1A" stroke-width="2">
        <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite"/>
      </circle>`
    : "";

  // ── Labels ────────────────────────────────────────────────────────────────
  const mono = `font-family="'JetBrains Mono','Fira Code',monospace"`;
  const labelSvg = label
    ? `<text x="${cx}" y="${cy + S/2 + 20}" text-anchor="middle"
        ${mono} font-size="12px" font-weight="700"
        fill="${color}" letter-spacing="1px">${label}</text>`
    : "";
  const sublabelSvg = sublabel
    ? `<text x="${cx}" y="${cy + S/2 + 34}" text-anchor="middle"
        ${mono} font-size="9px" fill="#334155">${sublabel}</text>`
    : "";

  return `<g opacity="${showAt > 0 ? 0 : 1}">${appear}
  <g transform="translate(${gx},${gy})">${bobAnim}
    ${body}${highlight}${eyes}
  </g>
  ${dot}${labelSvg}${sublabelSvg}
</g>`;
}
