/**
 * ds/transformer.mjs — Transformer Math → SVG Visuals
 *
 * A: Positional encoding waves: PE(pos,2i)   = sin(pos / 10000^(2i/d))
 *                                PE(pos,2i+1) = cos(pos / 10000^(2i/d))
 *
 * B: Attention weights: softmax(Q·Kᵀ / √d_k)
 *    Used to vary line thickness / opacity between agents
 *
 * C: Fourier frequency scan: decompose brightness into spatial frequencies
 *    Overlay sine waves at f=1,2,4,8,16 that animate across the portrait
 */

import { color } from "./tokens.mjs";

// ── A: Positional Encoding Waves ─────────────────────────────────────────────
// Render d_model/2 sine waves across width W, stacked vertically at y-offset
// Each dimension i has frequency 1/10000^(2i/d) — low i = low freq, high i = high freq
export function buildPEWaves({
  W = 1180,        // card width
  y0 = 0,          // baseline y
  d = 8,           // number of dimensions (wave pairs)
  amplitude = 18,  // max amplitude in px
  theme = "dark",
}) {
  const waves = [];
  const colors = [
    color.cyan, color.green, color.amber, color.violet,
    color.cyan, color.green, color.amber, color.violet,
  ];

  for (let i = 0; i < d; i++) {
    const freq = 1 / Math.pow(10000, (2 * i) / d);  // PE formula
    const period = W * freq * 4;                      // visual period in px
    const amp = amplitude * (1 - i / d * 0.6);       // higher dims = smaller amplitude
    const col = colors[i % colors.length];
    const opacity = theme === "dark" ? (0.12 - i * 0.01) : (0.08 - i * 0.006);
    const dur = `${4 + i * 0.8}s`;
    const phase = i * (Math.PI / d);

    // Build sine wave as SVG path
    const steps = 120;
    const pts = [];
    for (let s = 0; s <= steps; s++) {
      const x = (s / steps) * W;
      const y = y0 + Math.sin((x / W) * 2 * Math.PI / freq * 0.01 + phase) * amp;
      pts.push(s === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : `L${x.toFixed(1)},${y.toFixed(1)}`);
    }
    const d_attr = pts.join(" ");

    waves.push(`<path d="${d_attr}" fill="none" stroke="${col}"
  stroke-width="1" opacity="${opacity.toFixed(3)}">
  <animateTransform attributeName="transform" type="translate"
    from="${-W},0" to="0,0" dur="${dur}" repeatCount="indefinite"
    additive="sum"/>
</path>`);
  }
  return waves.join("\n");
}

// ── B: Attention Weights ──────────────────────────────────────────────────────
// Compute softmax(Q·Kᵀ / √dk) for N agents
// Q, K are learnable — here we use agent "personality" vectors
export function computeAttention(agents) {
  // Each agent has a query/key vector based on its role
  const dk = 4;
  const roleVecs = {
    harvester: [1.0, 0.1, 0.2, 0.8],   // high raw data affinity
    archify:   [0.3, 1.0, 0.7, 0.2],   // high structure affinity
    coach:     [0.2, 0.4, 1.0, 0.3],   // high pattern affinity
    wiki:      [0.6, 0.3, 0.4, 1.0],   // high memory affinity
    enforcer:  [0.9, 0.2, 0.1, 0.5],   // high vigilance affinity
  };

  const N = agents.length;
  // QKt / sqrt(dk)
  const scores = agents.map(a =>
    agents.map(b => {
      const qa = roleVecs[a.id] || [0.5,0.5,0.5,0.5];
      const kb = roleVecs[b.id] || [0.5,0.5,0.5,0.5];
      return qa.reduce((s, v, i) => s + v * kb[i], 0) / Math.sqrt(dk);
    })
  );

  // Softmax per row
  return scores.map(row => {
    const maxV = Math.max(...row);
    const exp = row.map(v => Math.exp(v - maxV));
    const sum = exp.reduce((s, v) => s + v, 0);
    return exp.map(v => v / sum);
  });
}

// Build attention arc between two agent positions
// thickness and opacity driven by attention weight
export function attentionArc({ x1, y1, x2, y2, weight, color: col, agentId, targetId, delay = 0 }) {
  if (weight < 0.08) return "";  // prune weak connections

  const strokeW = (weight * 6).toFixed(2);
  const opacity = (weight * 0.9).toFixed(3);
  const cx = (x1 + x2) / 2;
  const cy = Math.min(y1, y2) - 40 * weight;  // arc height proportional to weight

  // Cubic bezier arc
  const path = `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;

  // Animated data packet along arc
  const pktDur = `${1.2 + weight * 0.8}s`;

  return `<g opacity="0">
  <animate attributeName="opacity" from="0" to="${opacity}" dur="0.3s" begin="${(9.0 + delay).toFixed(1)}s" fill="freeze"/>
  <path d="${path}" fill="none" stroke="${col}" stroke-width="${strokeW}" opacity="0.6" stroke-dasharray="4 4"/>
  <circle r="${(2 + weight * 3).toFixed(1)}" fill="${col}" opacity="0.85">
    <animateMotion dur="${pktDur}" begin="${(9.0 + delay).toFixed(1)}s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1">
      <mpath xlink:href="#arc_${agentId}_${targetId}"/>
    </animateMotion>
  </circle>
  <path id="arc_${agentId}_${targetId}" d="${path}" fill="none" visibility="hidden"/>
</g>`;
}

// ── C: Fourier Frequency Scan ─────────────────────────────────────────────────
// Overlay spatial frequency bands that sweep the portrait
// Frequencies: f = 1, 2, 4, 8 cycles across the portrait
// Each band has different color (low freq = warm, high freq = cool)
export function buildFreqScan({ cx, cy, r, scanClipId, theme = "dark" }) {
  const freqs = [
    { f: 1,  col: color.amber,  amp: 0.15, dur: "8s",   opacity: 0.12 },
    { f: 2,  col: color.green,  amp: 0.10, dur: "5.3s",  opacity: 0.09 },
    { f: 4,  col: color.cyan,   amp: 0.07, dur: "3.7s",  opacity: 0.07 },
    { f: 8,  col: color.violet, amp: 0.04, dur: "2.4s",  opacity: 0.05 },
    { f: 16, col: color.cyan,   amp: 0.02, dur: "1.6s",  opacity: 0.04 },
  ];

  const W = r * 2;
  const waves = freqs.map(({ f, col, amp, dur, opacity }) => {
    const A = r * amp;  // amplitude in px
    const steps = 80;
    const pts = [];
    for (let s = 0; s <= steps; s++) {
      const x = cx - r + (s / steps) * W;
      const y = cy + Math.sin((s / steps) * 2 * Math.PI * f) * A;
      pts.push(s === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : `L${x.toFixed(1)},${y.toFixed(1)}`);
    }
    const dPath = pts.join(" ");

    return `<path d="${dPath}" fill="none" stroke="${col}"
    stroke-width="1.2" opacity="${opacity}">
    <animateTransform attributeName="transform" type="translate"
      from="0,${-r*2}" to="0,${r*2}" dur="${dur}"
      repeatCount="indefinite" calcMode="linear"/>
  </path>`;
  });

  return `<g clip-path="url(#${scanClipId})">
${waves.join("\n")}
</g>`;
}
