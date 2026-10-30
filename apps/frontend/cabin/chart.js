/* eslint-disable */
// The sea chart: one illustrated island per project, animated while hovered
import * as THREE from "three";
import { ISLANDS, PROJECTS } from "./content.js";
import { FONTS } from "./toolkit.js";
export function blob(x, cx, cy, r, seed) {
  x.beginPath();
  for (let a = 0; a <= 64; a++) {
    const th = (a / 64) * Math.PI * 2;
    const rr = r * (1 + 0.18 * Math.sin(th * 3 + seed) + 0.1 * Math.sin(th * 5 + seed * 2));
    const px = cx + Math.cos(th) * rr, py = cy + Math.sin(th) * rr * 0.75;
    a ? x.lineTo(px, py) : x.moveTo(px, py);
  }
  x.closePath();
}
// each project gets its own island on the chart
export const MAP_INK = "#3a2614";
export function sparkle(x, cx, cy, s) {
  x.beginPath(); x.moveTo(cx, cy - s);
  x.quadraticCurveTo(cx, cy, cx + s, cy); x.quadraticCurveTo(cx, cy, cx, cy + s);
  x.quadraticCurveTo(cx, cy, cx - s, cy); x.quadraticCurveTo(cx, cy, cx, cy - s); x.fill();
}
export function islandBase(x, cx, cy, r, seed, sx = 1, sy = 1, green = "#5aa877") {
  x.save(); x.translate(cx, cy); x.scale(sx, sy);
  blob(x, 0, 0, r, seed); x.fillStyle = "#e6c98a"; x.fill();
  blob(x, 0, 0, r * 0.74, seed); x.fillStyle = green; x.fill(); x.strokeStyle = "#2e4a3a"; x.lineWidth = 2.5 / Math.max(sx, sy); x.stroke();
  x.restore();
}
export const ISLAND_ART = {
  Faraway(x, cx, cy, r, t) { // the board game: a trail of 8 region cards, read by a magnifying glass (the solver's computer vision)
    islandBase(x, cx, cy, r, 0.4, 1.7, 0.72);
    const REGIONS = ["#5aa877", "#4f86c6", "#d9a441", "#c8553d"], NUMS = [12, 27, 3, 41, 56, 8, 33, 61];
    const cw = r * 0.3, chh = r * 0.42, step = r * 0.33, x0 = cx - step * 3.5;
    NUMS.forEach((n, i) => {
      x.save(); x.translate(x0 + i * step, cy - r * 0.02); x.rotate(((i * 37) % 7 - 3) * 0.03);
      x.fillStyle = "#fbf3df"; x.strokeStyle = MAP_INK; x.lineWidth = 1.6;
      x.beginPath(); x.roundRect(-cw / 2, -chh / 2, cw, chh, 3); x.fill(); x.stroke();
      x.fillStyle = REGIONS[i % 4]; x.fillRect(-cw / 2 + 2, -chh / 2 + 2, cw - 4, chh * 0.42);
      x.fillStyle = MAP_INK; x.font = `700 ${Math.round(r * 0.16)}px ${FONTS.atkinson}, sans-serif`; x.textAlign = "center";
      x.fillText(String(n), 0, chh / 2 - 4);
      x.restore();
    });
    const scan = t ? (Math.sin(t * 1.6) * 0.5 + 0.5) : 1; // the lens slides along the row while hovered
    const mx = x0 + scan * step * 7, my = cy - r * 0.5, lr = r * 0.26;
    x.strokeStyle = MAP_INK; x.lineWidth = 4; x.lineCap = "round";
    x.beginPath(); x.moveTo(mx + lr * 0.7, my + lr * 0.7); x.lineTo(mx + lr * 1.6, my + lr * 1.6); x.stroke(); x.lineCap = "butt";
    x.fillStyle = "rgba(167, 220, 240, 0.55)"; x.beginPath(); x.arc(mx, my, lr, 0, Math.PI * 2); x.fill();
    x.lineWidth = 3; x.stroke();
    x.strokeStyle = "rgba(255, 255, 255, 0.8)"; x.lineWidth = 2; x.beginPath(); x.arc(mx, my, lr * 0.65, Math.PI * 1.1, Math.PI * 1.45); x.stroke();
  },
  Caravel(x, cx, cy, r, t) { // a harbour island with a palm, and the little caravel at anchor (bobbing while hovered)
    islandBase(x, cx, cy, r, 1.7);
    x.strokeStyle = "#7a4a2a"; x.lineWidth = 4;
    x.beginPath(); x.moveTo(cx - r * 0.15, cy + r * 0.25); x.quadraticCurveTo(cx - r * 0.05, cy - r * 0.2, cx + r * 0.1, cy - r * 0.5); x.stroke();
    x.fillStyle = "#2f7a4f";
    for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.6 + Math.sin(t * 3 + k) * 0.08; x.beginPath(); x.ellipse(cx + r * 0.1 + Math.cos(a) * r * 0.25, cy - r * 0.5 + Math.sin(a) * r * 0.25, r * 0.28, r * 0.08, a, 0, Math.PI * 2); x.fill(); }
    const sx = cx + r * 1.2, sy = cy + r * 0.35 + Math.sin(t * 4) * r * 0.08;
    x.save(); x.translate(sx, sy); x.rotate(Math.sin(t * 3) * 0.12); x.translate(-sx, -sy);
    x.strokeStyle = MAP_INK; x.lineWidth = 2; x.fillStyle = "#7a4a2a";
    x.beginPath(); x.moveTo(sx - r * 0.45, sy); x.lineTo(sx + r * 0.45, sy); x.lineTo(sx + r * 0.3, sy + r * 0.2); x.lineTo(sx - r * 0.3, sy + r * 0.2); x.closePath(); x.fill(); x.stroke();
    x.fillRect(sx - 1.5, sy - r * 0.72, 3, r * 0.72);
    x.fillStyle = "#f6ecd6";
    x.beginPath(); x.moveTo(sx + 2, sy - r * 0.66); x.quadraticCurveTo(sx + r * 0.42, sy - r * 0.36, sx + 2, sy - r * 0.08); x.closePath(); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(sx - 2, sy - r * 0.56); x.quadraticCurveTo(sx - r * 0.34, sy - r * 0.3, sx - 2, sy - r * 0.1); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = "#b5462f"; x.beginPath(); x.moveTo(sx, sy - r * 0.72); x.lineTo(sx + r * 0.2, sy - r * 0.66); x.lineTo(sx, sy - r * 0.6); x.closePath(); x.fill();
    x.restore();
  },
  Abracadabra(x, cx, cy, r, t) { // a craggy violet island with a wizard's tower; the sparkles pulse while hovered
    islandBase(x, cx, cy, r, 3.4, 1, 1, "#7d68ad");
    x.strokeStyle = MAP_INK; x.lineWidth = 2; x.fillStyle = "#4a3a78";
    x.beginPath(); x.moveTo(cx - r * 0.55, cy + r * 0.2); x.lineTo(cx - r * 0.22, cy - r * 0.42); x.lineTo(cx + r * 0.02, cy - r * 0.1); x.lineTo(cx + r * 0.3, cy - r * 0.48); x.lineTo(cx + r * 0.55, cy + r * 0.2); x.closePath(); x.fill(); x.stroke();
    const tx = cx + r * 0.3, ty = cy - r * 0.48;
    x.fillStyle = "#d8cbef"; x.fillRect(tx - r * 0.1, ty - r * 0.45, r * 0.2, r * 0.45); x.strokeRect(tx - r * 0.1, ty - r * 0.45, r * 0.2, r * 0.45);
    x.fillStyle = "#3a2a6a"; x.beginPath(); x.moveTo(tx - r * 0.17, ty - r * 0.45); x.lineTo(tx, ty - r * 0.88); x.lineTo(tx + r * 0.17, ty - r * 0.45); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = "#e9b949";
    [[-0.9, -0.6, 1], [0.85, -0.95, 0.8], [1.05, 0.05, 0.7], [-0.6, -1.05, 0.6]].forEach(([dx, dy, k], i) => sparkle(x, cx + dx * r, cy + dy * r, r * 0.14 * k * (t ? 1 + 0.6 * Math.sin(t * 6 + i * 1.7) : 1)));
  },
  Ventus(x, cx, cy, r, t) { // a windswept island; the windmill spins while hovered
    islandBase(x, cx, cy, r, 5.1, 1.1, 0.85, "#7fb86a");
    const mx = cx - r * 0.1, my = cy - r * 0.02;
    x.strokeStyle = MAP_INK; x.lineWidth = 2; x.fillStyle = "#f6ecd6";
    x.beginPath(); x.moveTo(mx - r * 0.16, my + r * 0.1); x.lineTo(mx + r * 0.16, my + r * 0.1); x.lineTo(mx + r * 0.1, my - r * 0.5); x.lineTo(mx - r * 0.1, my - r * 0.5); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = "#b5462f"; x.beginPath(); x.moveTo(mx - r * 0.14, my - r * 0.5); x.lineTo(mx, my - r * 0.68); x.lineTo(mx + r * 0.14, my - r * 0.5); x.closePath(); x.fill(); x.stroke();
    for (let k = 0; k < 4; k++) {
      x.save(); x.translate(mx, my - r * 0.56); x.rotate(k * Math.PI / 2 + 0.4 + t * 4);
      x.fillStyle = "#e6c98a"; x.fillRect(0, -r * 0.06, r * 0.55, r * 0.12); x.strokeRect(0, -r * 0.06, r * 0.55, r * 0.12);
      x.restore();
    }
    x.strokeStyle = "rgba(58, 38, 20, 0.6)"; x.lineWidth = 2.5; x.lineCap = "round";
    [[-1.7, -0.85], [-1.55, -0.45], [0.75, 0.62]].forEach(([dx, dy]) => {
      const gx = cx + dx * r + (t ? Math.sin(t * 3 + dy) * r * 0.15 : 0), gy = cy + dy * r;
      x.beginPath(); x.moveTo(gx, gy); x.lineTo(gx + r * 0.7, gy); x.arc(gx + r * 0.7, gy - r * 0.12, r * 0.12, Math.PI / 2, -Math.PI * 0.9, true); x.stroke();
    });
    x.lineCap = "butt";
  },
};
export function drawChart(x, w, h, title, anim = {}) {
  x.fillStyle = "#efdcae"; x.fillRect(0, 0, w, h);
  x.strokeStyle = "rgba(122, 90, 50, 0.35)"; x.lineWidth = 2;
  for (let i = 0; i < 26; i++) { // little wave marks
    const px = (i * 137) % w, py = 30 + ((i * 89) % (h - 60));
    x.beginPath(); x.arc(px, py, 7, Math.PI * 1.1, Math.PI * 1.9); x.arc(px + 13, py, 7, Math.PI * 1.1, Math.PI * 1.9); x.stroke();
  }
  x.setLineDash([9, 8]); x.strokeStyle = "#b5462f"; x.lineWidth = 3.5;
  x.beginPath();
  ISLANDS.forEach(([, ix, iy], i) => (i ? x.lineTo(ix * w, iy * h) : x.moveTo(ix * w, iy * h)));
  x.stroke(); x.setLineDash([]);
  ISLANDS.forEach(([name, ix, iy]) => {
    const cx = ix * w, cy = iy * h, hovered = anim.hover === name, t = hovered ? anim.t : 0;
    x.save();
    if (hovered) { const s = 1.12 + Math.sin(t * 5) * 0.03; x.translate(cx, cy); x.rotate(Math.sin(t * 3) * 0.05); x.scale(s, s); x.translate(-cx, -cy); }
    ISLAND_ART[name](x, cx, cy, w * 0.075, t);
    x.restore();
    x.fillStyle = hovered ? "#b5462f" : "#3a2614"; x.font = `700 ${Math.round(w * 0.034)}px ${FONTS.merienda}, Georgia, serif`; x.textAlign = "center";
    x.fillText(name, ix * w, iy * h + w * 0.085);
  });
  // the hovered island's entry, on a paper slip: when, and built with what (below it, or above for the southern islands)
  const info = anim.hover && PROJECTS.find(([name]) => name === anim.hover), spot = anim.hover && ISLANDS.find(([name]) => name === anim.hover);
  if (info && spot) {
    const [, when, stack] = info, [, ix, iy] = spot, fs = Math.round(w * 0.022), pad = Math.round(fs * 0.7);
    x.font = `700 ${fs}px ${FONTS.atkinson}, sans-serif`; const ww = x.measureText(when).width;
    x.font = `${fs}px ${FONTS.atkinson}, sans-serif`; const sw = x.measureText(stack).width;
    const bw = Math.max(ww, sw) + pad * 2, bh = fs * 2.5 + pad;
    const bx = Math.min(Math.max(ix * w - bw / 2, 14), w - bw - 14), by = iy > 0.55 ? iy * h - w * 0.1 - bh : iy * h + w * 0.105;
    x.fillStyle = "#fbf3dc"; x.strokeStyle = "#8a6a3c"; x.lineWidth = 2;
    x.beginPath(); x.roundRect(bx, by, bw, bh, 8); x.fill(); x.stroke();
    x.textAlign = "left"; x.textBaseline = "alphabetic";
    x.fillStyle = "#b5462f"; x.font = `700 ${fs}px ${FONTS.atkinson}, sans-serif`; x.fillText(when, bx + pad, by + pad / 2 + fs);
    x.fillStyle = "#3a2614"; x.font = `${fs}px ${FONTS.atkinson}, sans-serif`; x.fillText(stack, bx + pad, by + pad / 2 + fs * 2.2);
  }
  const cx = w * 0.9, cy = h * 0.18, r = w * 0.055; // compass rose
  x.fillStyle = "#3a2614";
  for (let k = 0; k < 4; k++) {
    const a = k * Math.PI / 2;
    x.beginPath(); x.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    x.lineTo(cx + Math.cos(a + 0.5) * r * 0.25, cy + Math.sin(a + 0.5) * r * 0.25);
    x.lineTo(cx + Math.cos(a - 0.5) * r * 0.25, cy + Math.sin(a - 0.5) * r * 0.25); x.fill();
  }
  x.font = `700 ${Math.round(w * 0.03)}px ${FONTS.merienda}, Georgia, serif`; x.fillText("N", cx, cy - r - 6);
  x.font = `700 ${Math.round(w * 0.045)}px ${FONTS.merienda}, Georgia, serif`; x.textAlign = "left"; x.fillText(title, w * 0.05, h * 0.12);
  x.strokeStyle = "#8a6a3c"; x.lineWidth = 8; x.strokeRect(4, 4, w - 8, h - 8);
}
