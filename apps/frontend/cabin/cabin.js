/* eslint-disable */
// The cabin scene, ported as-is from the approved prototype (Three.js, plain modules).
// Step 1 of the port: next steps split this file into typed modules (scene, sky, props, music, overlays).
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

export async function mountCabin() {
// every window listener goes through this controller, so leaving the page removes them
const ac = new AbortController();
const addEventListener = (type, fn, opts) => window.addEventListener(type, fn, { ...(typeof opts === "object" ? opts : {}), signal: ac.signal });


const INK = 0x0d1626, SAND = 0xf0c75e, MINT = 0xa7f0d0;
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
const small = Math.min(innerWidth, innerHeight) < 600;
const $ = (id) => document.getElementById(id);
const veil = $("veil");

// ---------- the site's real content, as the close-ups show it ----------
const POSTS = [
  ["Water: Part 2 - The little water cycle", "Jun 2025", "water-part-2"],
  ["Water: Part 1 - The great water cycle", "Apr 2025", "water-part-1"],
  ["Time Bang", "Sep 2023", "time-bang"],
  ["Functional Notes", "Sep 2023", "functional-notes"],
  ["Webnotes", "Aug 2023", "webnotes"],
  ["Team Topologies", "Jun 2023", "team-topologies"],
  ["Peopleware", "Jun 2023", "peopleware"],
  ["Code me an Input", "May 2023", "code-me-an-input"],
  ["Mythical Man Month", "May 2023", "mythical-man-month"],
];
const PROJECT_LINKS = {
  Faraway: "https://faraway-solver.com",
  Abracadabra: "https://github.com/Stephane-Pires/abracadabra",
  Caravel: "https://caravel-mocha.vercel.app/",
  Ventus: "https://ventus-jade.vercel.app/1",
};
const PROJECTS = [
  ["Faraway", "Jan 2026 → now", "Svelte · SvelteKit · AWS · Computer vision · Python · Serverless"],
  ["Abracadabra", "Nov 2024 → now", "Ansible · Linux · Terminal"],
  ["Caravel", "Apr 2023 → now", "Next.js · React · Tailwind · Node.js"],
  ["Ventus", "Sep 2022 → Jul 2023", "Vue · Vite · WindiCSS"],
];

// the chart and poster paint text onto canvases, so wait for the fonts before building anything
async function fontsReady() {
  const link = $("gf");
  if (!link.sheet) await new Promise((r) => { link.addEventListener("load", r, { once: true }); link.addEventListener("error", r, { once: true }); setTimeout(r, 2500); });
  try {
    await Promise.race([
      Promise.all([document.fonts.load("700 40px Merienda"), document.fonts.load("400 20px 'Atkinson Hyperlegible'"), document.fonts.load("900 40px 'Playfair Display'"), document.fonts.load("700 40px 'Playfair Display'"), document.fonts.load("40px 'Yuji Syuku'", "七転び八起き")]),
      new Promise((r) => setTimeout(r, 2500)),
    ]);
  } catch (e) { /* canvas text falls back to Georgia */ }
}
await fontsReady();
// the captain's portrait for the wanted poster (falls back to a drawn silhouette if it can't load)
const loadImage = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
const CAPTAIN = await loadImage("/cabin/assets/captain-wide.jpg");

// ---------- renderer (falls back to a message when WebGL is unavailable) ----------
const canvas = $("stage");
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
} catch (e) {
  veil.innerHTML = "<p>This browser can't draw the 3D cabin.<small>The real site would show its plain pages here instead.</small></p>";
  throw e;
}
const pixelRatio = Math.min(devicePixelRatio, small ? 1.5 : 2);
renderer.setPixelRatio(pixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ---------- toon toolkit ----------
// three light bands: shadow, midtone, lit. This one texture is most of the "storybook" look.
const grad = new THREE.DataTexture(new Uint8Array([85, 170, 255]), 3, 1, THREE.RedFormat);
grad.minFilter = grad.magFilter = THREE.NearestFilter;
grad.needsUpdate = true;

const toon = (color, extra = {}) => new THREE.MeshToonMaterial({ color, gradientMap: grad, ...extra });
const glow = (r, g, b) => new THREE.MeshBasicMaterial({ color: new THREE.Color().setRGB(r, g, b) }); // >1 values feed the bloom
const OUTLINE = 0.024;

// inverted-hull outline with the same thickness on every axis
function addOutline(m) {
  const g = m.geometry;
  g.computeBoundingBox();
  const size = new THREE.Vector3(), center = new THREE.Vector3();
  g.boundingBox.getSize(size);
  g.boundingBox.getCenter(center);
  const mat = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
  const o = new THREE.Mesh(g, mat);
  o.scale.set(1 + 2 * OUTLINE / Math.max(size.x, 1e-3), 1 + 2 * OUTLINE / Math.max(size.y, 1e-3), 1 + 2 * OUTLINE / Math.max(size.z, 1e-3));
  o.position.set(center.x * (1 - o.scale.x), center.y * (1 - o.scale.y), center.z * (1 - o.scale.z));
  o.raycast = () => {};
  m.add(o);
  m.userData.outlineMat = mat;
}

// every interior mesh casts and receives shadows unless told otherwise
function mesh(geo, color, { outline = true, mat, shadow = true } = {}) {
  const m = new THREE.Mesh(geo, mat || toon(color));
  m.castShadow = m.receiveShadow = shadow;
  if (outline) addOutline(m);
  return m;
}

function at(obj, x, y, z, ry = 0) { obj.position.set(x, y, z); obj.rotation.y = ry; return obj; }
function group(...children) { const g = new THREE.Group(); children.forEach((c) => g.add(c)); return g; }

// register a clickable object: collects its outline materials for highlighting
function hot(g, info) {
  info.group = g;
  info.outlines = [];
  g.traverse((o) => { if (o.userData.outlineMat) info.outlines.push(o.userData.outlineMat); });
  g.userData.hot = info;
  return info;
}

function canvasTex(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function plankTex(base, line, n, vertical) {
  return canvasTex(256, 256, (x, w, h) => {
    x.fillStyle = base; x.fillRect(0, 0, w, h);
    x.strokeStyle = line; x.lineWidth = 3;
    const step = (vertical ? w : h) / n;
    for (let i = 1; i < n; i++) {
      x.beginPath();
      if (vertical) { x.moveTo(i * step, 0); x.lineTo(i * step, h); } else { x.moveTo(0, i * step); x.lineTo(w, i * step); }
      x.stroke();
    }
    for (let i = 0; i < n; i++) { // butt joints between plank lengths
      const q = ((i * 97) % 100) / 100 * (vertical ? h : w);
      x.beginPath();
      if (vertical) { x.moveTo(i * step, q); x.lineTo((i + 1) * step, q); } else { x.moveTo(q, i * step); x.lineTo(q, (i + 1) * step); }
      x.stroke();
    }
  });
}

function makeSea(color, y) {
  const geo = new THREE.PlaneGeometry(220, 220, 90, 90);
  geo.rotateX(-Math.PI / 2);
  const base = geo.attributes.position.array.slice();
  const m = new THREE.Mesh(geo, toon(color));
  m.position.y = y;
  m.userData.tick = (t) => {
    const p = geo.attributes.position.array;
    for (let i = 0; i < p.length; i += 3) {
      const x = base[i], z = base[i + 2];
      p[i + 1] = Math.sin(x * 0.3 + t * 1.1) * 0.14 + Math.cos(z * 0.25 + t * 0.8) * 0.12;
    }
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
  };
  return m;
}

function palm(h = 3.2, lean = 0.5) {
  const g = new THREE.Group();
  const segs = 6, segH = h / segs;
  const top = new THREE.Vector3();
  for (let i = 0; i < segs; i++) {
    const r = 0.17 - i * 0.014;
    const s = mesh(new THREE.CylinderGeometry(r - 0.012, r, segH, 8), i % 2 ? 0x9a6b3f : 0xb3824f, { shadow: false });
    const off = Math.pow(i / segs, 2) * lean;
    s.position.set(off, segH * (i + 0.5), 0);
    g.add(s);
    top.set(off, segH * (i + 1), 0);
  }
  for (let k = 0; k < 7; k++) {
    const leaf = mesh(new THREE.ConeGeometry(0.3, 1.8, 4), k % 2 ? 0x3f9b6e : 0x52b480, { shadow: false });
    leaf.scale.z = 0.3;
    leaf.position.y = 0.9;
    const tilt = group(leaf); tilt.rotation.z = -1.15 - (k % 2) * 0.25;
    const pivot = group(tilt); pivot.rotation.y = k * (Math.PI * 2 / 7);
    pivot.position.copy(top);
    g.add(pivot);
  }
  return g;
}

function bottle() {
  const glass = toon(0x6cc5a3, { transparent: true, opacity: 0.85 });
  return group(
    at(mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.32, 14), 0, { mat: glass }), 0, 0.16, 0),
    at(mesh(new THREE.CylinderGeometry(0.045, 0.11, 0.1, 14), 0, { mat: glass }), 0, 0.37, 0),
    at(mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.11, 12), 0, { mat: glass }), 0, 0.47, 0),
    at(mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.06, 12), 0xc69060), 0, 0.55, 0),
    at(mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.22, 10), 0xf6ecd6, { outline: false }), 0, 0.17, 0),
  );
}

// chest with a hinged lid (hinge along the back edge) and gold inside
function chest(w = 1.1, h = 0.6, d = 0.7) {
  const r = d / 2;
  const lid = mesh(new THREE.CylinderGeometry(r, r, w, 20, 1, false, -Math.PI / 2, Math.PI), 0x8a5230);
  lid.rotation.x = -Math.PI / 2;              // half-cylinder dome, arc facing up
  const lidG = group(lid); lidG.rotation.y = Math.PI / 2; lidG.position.z = r;
  const hinge = group(lidG); hinge.position.set(0, h, -r);
  const scroll = mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 12), 0xf6ecd6); scroll.rotation.z = Math.PI / 2;
  const g = group(
    at(mesh(new THREE.BoxGeometry(w, h, d), 0x7b4a2a), 0, h / 2, 0),
    at(mesh(new THREE.BoxGeometry(0.08, h + 0.02, d + 0.02), 0xe9b949), -w * 0.36, h / 2, 0),
    at(mesh(new THREE.BoxGeometry(0.08, h + 0.02, d + 0.02), 0xe9b949), w * 0.36, h / 2, 0),
    at(mesh(new THREE.BoxGeometry(0.16, 0.18, 0.06), 0xe9b949), 0, h - 0.05, d / 2 + 0.02),
    at(new THREE.Mesh(new THREE.BoxGeometry(w - 0.12, 0.04, d - 0.12), glow(2.2, 1.7, 0.6)), 0, h - 0.06, 0),
    at(scroll, 0, h + 0.0, 0.05),
    hinge,
  );
  return { g, hinge };
}

function pageTexture() {
  return canvasTex(1024, 640, (x, w, h) => {
    x.fillStyle = "#f6ecd6"; x.fillRect(0, 0, w, h);
    x.strokeStyle = "rgba(122, 90, 50, 0.25)"; x.lineWidth = 2;
    x.beginPath(); x.moveTo(w / 2, 0); x.lineTo(w / 2, h); x.stroke();
    x.fillStyle = "#4a2a14"; x.textAlign = "left";
    x.font = "700 52px Merienda, Georgia, serif"; x.fillText("Logbook", 46, 86);
    x.font = "24px 'Atkinson Hyperlegible', sans-serif"; x.fillStyle = "#7a5a32"; x.fillText("Latest entries", 48, 124);
    const draw = (items, x0, y0) => items.forEach(([t, d], i) => {
      const y = y0 + i * 96;
      x.fillStyle = "#3a2614"; x.font = "700 27px Merienda, Georgia, serif";
      const title = t.length > 26 ? t.slice(0, 25) + "…" : t;
      x.fillText(title, x0, y);
      x.fillStyle = "#8a6a3c"; x.font = "22px 'Atkinson Hyperlegible', sans-serif"; x.fillText(d, x0, y + 32);
      x.strokeStyle = "rgba(122, 90, 50, 0.3)"; x.beginPath(); x.moveTo(x0, y + 50); x.lineTo(x0 + 410, y + 50); x.stroke();
    });
    draw(POSTS.slice(0, 5).map((p) => [p[0], p[1]]), 48, 190);
    draw(POSTS.slice(5, 9).map((p) => [p[0], p[1]]), w / 2 + 46, 90);
  });
}

function openBook(cover = 0x8c2f22) {
  const left = mesh(new THREE.BoxGeometry(0.47, 0.06, 0.6), 0xf6ecd6); left.position.set(-0.245, 0.05, 0); left.rotation.z = 0.07;
  const right = mesh(new THREE.BoxGeometry(0.47, 0.06, 0.6), 0xf6ecd6); right.position.set(0.245, 0.05, 0); right.rotation.z = -0.07;
  const page = new THREE.Mesh(new THREE.PlaneGeometry(0.94, 0.58), toon(0xffffff, { map: pageTexture() }));
  page.rotation.x = -Math.PI / 2; page.position.y = 0.087; page.receiveShadow = true;
  return group(mesh(new THREE.BoxGeometry(1.0, 0.04, 0.66), cover), left, right, page);
}

// ---------- painted textures ----------
const ISLANDS = [["Faraway", 0.2, 0.34], ["Caravel", 0.6, 0.24], ["Abracadabra", 0.34, 0.74], ["Ventus", 0.8, 0.66]];

function blob(x, cx, cy, r, seed) {
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
const MAP_INK = "#3a2614";
function sparkle(x, cx, cy, s) {
  x.beginPath(); x.moveTo(cx, cy - s);
  x.quadraticCurveTo(cx, cy, cx + s, cy); x.quadraticCurveTo(cx, cy, cx, cy + s);
  x.quadraticCurveTo(cx, cy, cx - s, cy); x.quadraticCurveTo(cx, cy, cx, cy - s); x.fill();
}
function islandBase(x, cx, cy, r, seed, sx = 1, sy = 1, green = "#5aa877") {
  x.save(); x.translate(cx, cy); x.scale(sx, sy);
  blob(x, 0, 0, r, seed); x.fillStyle = "#e6c98a"; x.fill();
  blob(x, 0, 0, r * 0.74, seed); x.fillStyle = green; x.fill(); x.strokeStyle = "#2e4a3a"; x.lineWidth = 2.5 / Math.max(sx, sy); x.stroke();
  x.restore();
}
const ISLAND_ART = {
  Faraway(x, cx, cy, r, t) { // the board game: a trail of 8 region cards, read by a magnifying glass (the solver's computer vision)
    islandBase(x, cx, cy, r, 0.4, 1.7, 0.72);
    const REGIONS = ["#5aa877", "#4f86c6", "#d9a441", "#c8553d"], NUMS = [12, 27, 3, 41, 56, 8, 33, 61];
    const cw = r * 0.3, chh = r * 0.42, step = r * 0.33, x0 = cx - step * 3.5;
    NUMS.forEach((n, i) => {
      x.save(); x.translate(x0 + i * step, cy - r * 0.02); x.rotate(((i * 37) % 7 - 3) * 0.03);
      x.fillStyle = "#fbf3df"; x.strokeStyle = MAP_INK; x.lineWidth = 1.6;
      x.beginPath(); x.roundRect(-cw / 2, -chh / 2, cw, chh, 3); x.fill(); x.stroke();
      x.fillStyle = REGIONS[i % 4]; x.fillRect(-cw / 2 + 2, -chh / 2 + 2, cw - 4, chh * 0.42);
      x.fillStyle = MAP_INK; x.font = `700 ${Math.round(r * 0.16)}px 'Atkinson Hyperlegible', sans-serif`; x.textAlign = "center";
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

function drawChart(x, w, h, title, anim = {}) {
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
    x.fillStyle = hovered ? "#b5462f" : "#3a2614"; x.font = `700 ${Math.round(w * 0.034)}px Merienda, Georgia, serif`; x.textAlign = "center";
    x.fillText(name, ix * w, iy * h + w * 0.085);
  });
  const cx = w * 0.9, cy = h * 0.18, r = w * 0.055; // compass rose
  x.fillStyle = "#3a2614";
  for (let k = 0; k < 4; k++) {
    const a = k * Math.PI / 2;
    x.beginPath(); x.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    x.lineTo(cx + Math.cos(a + 0.5) * r * 0.25, cy + Math.sin(a + 0.5) * r * 0.25);
    x.lineTo(cx + Math.cos(a - 0.5) * r * 0.25, cy + Math.sin(a - 0.5) * r * 0.25); x.fill();
  }
  x.font = `700 ${Math.round(w * 0.03)}px Merienda, Georgia, serif`; x.fillText("N", cx, cy - r - 6);
  x.font = `700 ${Math.round(w * 0.045)}px Merienda, Georgia, serif`; x.textAlign = "left"; x.fillText(title, w * 0.05, h * 0.12);
  x.strokeStyle = "#8a6a3c"; x.lineWidth = 8; x.strokeRect(4, 4, w - 8, h - 8);
}

// ---------- the cabin ----------
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xf0a07c, 35, 150); // only the sea and islands outside are far enough to fade
const hotspots = [];
const ticks = [];

// warm sun, violet shadows: the storybook palette
const hemi = new THREE.HemisphereLight(0xffd9b0, 0x5b4a86, 0.8);
scene.add(hemi);
const LIGHT_DIR = new THREE.Vector3(0.12, -0.7, 1).normalize(); // sunlight entering through the stern windows
const sun = new THREE.DirectionalLight(0xffcf94, 1.6);
sun.target.position.set(0, 1, -0.5);
sun.position.copy(sun.target.position).addScaledVector(LIGHT_DIR, -14);
sun.castShadow = true;
sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
Object.assign(sun.shadow.camera, { left: -5.5, right: 5.5, top: 5.5, bottom: -5.5, near: 1, far: 30 });
sun.shadow.bias = -0.0005;
sun.shadow.normalBias = 0.02;
scene.add(sun, sun.target);

// outside: sky dome, low sun, sea and a few islands
const sky = new THREE.Mesh(
  new THREE.SphereGeometry(160, 32, 16),
  new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color("#24345e") }, mid: { value: new THREE.Color("#e9876a") }, low: { value: new THREE.Color("#ffd391") } },
    vertexShader: "varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: "uniform vec3 top, mid, low; varying vec3 vDir; void main(){ float h = vDir.y; vec3 c = mix(low, mid, smoothstep(0.0, 0.12, h)); c = mix(c, top, smoothstep(0.12, 0.55, h)); gl_FragColor = vec4(c, 1.0); }",
  }),
);
scene.add(sky);
const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(5, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color().setRGB(3, 2.2, 1.1), transparent: true, fog: false }));
sunDisc.position.set(9, 1.5, -95);
const halo = new THREE.Mesh(new THREE.CircleGeometry(14, 48), new THREE.MeshBasicMaterial({ color: 0xffc27a, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
halo.position.set(9, 1.5, -96);
scene.add(sunDisc, halo);
const sea = makeSea(0x3f8fb8, -2.2);
scene.add(sea);
ticks.push(sea.userData.tick);
[[-16, -34, 3], [12, -46, 3.6], [-5, -70, 4.5]].forEach(([x, z, r]) => {
  const hill = mesh(new THREE.SphereGeometry(r * 0.8, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), 0x4fae7a, { shadow: false });
  hill.scale.y = 0.65;
  const isl = group(mesh(new THREE.CylinderGeometry(r, r * 1.15, 0.6, 28), 0xf2d39c, { outline: false, shadow: false }), at(hill, 0, 0.25, 0));
  const p = palm(2.4, 0.4); p.position.set(r * 0.3, 0.3 + r * 0.45, 0); isl.add(p);
  scene.add(at(isl, x, -2.2, z));
});

// weather on the horizon: drifting sunset clouds, a passing rain shower, circling gulls
const puff = (color, emissive) => new THREE.MeshToonMaterial({ color, emissive, gradientMap: grad, fog: false });
function cloud(mat, size) {
  const g = new THREE.Group();
  const n = 5 + Math.floor(Math.random() * 4);
  for (let i = 0; i < n; i++) {
    const r = size * (0.5 + Math.random() * 0.5);
    const s = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat);
    s.position.set((i - n / 2) * size * 0.75 + (Math.random() - 0.5) * size * 0.4, Math.random() * size * 0.5, (Math.random() - 0.5) * size * 0.6);
    s.scale.y = 0.7;
    g.add(s);
  }
  return g;
}
const SKY_SPAN = 110; // clouds wrap around between -SKY_SPAN and +SKY_SPAN on x
const cloudMat = puff(0xffd9c4, 0x7a4a5a);
const clouds = [];
for (let i = 0; i < 8; i++) {
  const c = cloud(cloudMat, 2.5 + Math.random() * 3);
  c.position.set(-SKY_SPAN + (i / 8) * SKY_SPAN * 2 + Math.random() * 10, 7 + Math.random() * 16, -70 - Math.random() * 60);
  c.userData.speed = 0.6 + Math.random() * 1.2;
  clouds.push(c); scene.add(c);
}
// birds drawn like the ones on the site's polaroid: two thin strokes joined at the tip, opening from 0 to 50 degrees
const birdMat = new THREE.MeshBasicMaterial({ color: 0x15100c, fog: false });
const strokeGeo = new THREE.BoxGeometry(0.1, 1.4, 0.1);
strokeGeo.translate(0, 0.7, 0); // pivot at the bottom tip
const BIRD_OPEN = THREE.MathUtils.degToRad(50);
// each bird flies its own lazy figure-8: centre, half-width, half-depth, height swing, speed, size, flap timing
const birds = [
  { c: [0, 7.5, -27], ax: 13, az: 7, ay: 1.2, w: 0.16, phase: 0, size: 1.3, dur: 1.0, delay: 0 },
  { c: [-4, 9.5, -38], ax: 18, az: 9, ay: 1.6, w: 0.11, phase: 2.2, size: 1.0, dur: 1.5, delay: 0.5 },
  { c: [5, 6.2, -21], ax: 9, az: 5, ay: 0.9, w: 0.21, phase: 4.1, size: 0.75, dur: 1.0, delay: 0.3 },
].map((b) => {
  const l = new THREE.Mesh(strokeGeo, birdMat), r = new THREE.Mesh(strokeGeo, birdMat);
  const g = group(l, r);
  g.scale.setScalar(b.size);
  g.userData = { ...b, l, r };
  scene.add(g);
  return g;
});
const birdAt = (u, time, out) => {
  const a = time * u.w + u.phase;
  return out.set(u.c[0] + Math.sin(a) * u.ax, u.c[1] + Math.sin(a * 2.3) * u.ay, u.c[2] + Math.sin(a * 2) * u.az);
};
const birdNext = new THREE.Vector3();
ticks.push((t, dt) => {
  clouds.forEach((c) => { c.position.x += c.userData.speed * dt; if (c.position.x > SKY_SPAN) c.position.x = -SKY_SPAN; });
  birds.forEach((g) => {
    const u = g.userData;
    g.visible = nightK < 0.5; // the birds sleep at night
    birdAt(u, t, g.position);
    g.lookAt(birdAt(u, t + 0.2, birdNext)); // face the way it's flying
    const p = Math.max(0, t - u.delay) / u.dur % 2, k = p < 1 ? p : 2 - p; // back and forth, like framer's mirror repeat
    const open = BIRD_OPEN * (0.5 - 0.5 * Math.cos(Math.PI * k));
    u.l.rotation.z = open; u.r.rotation.z = -open;
  });
});

// room shell: floor, ceiling, all four walls (the stern wall is built around four tall windows)
const floorTex = plankTex("#8a5733", "#5e3a20", 10, true);
const wallTex = plankTex("#b07a45", "#7d5230", 9, false);
const shell = (geo, tex) => mesh(geo, 0, { outline: false, mat: toon(0xffffff, { map: tex }) });
scene.add(at(shell(new THREE.BoxGeometry(8.4, 0.2, 6.6), floorTex), 0, -0.1, 0));
scene.add(at(shell(new THREE.BoxGeometry(8.4, 0.2, 6.6), floorTex), 0, 4.7, 0));
scene.add(at(shell(new THREE.BoxGeometry(0.2, 4.8, 6.6), wallTex), -4.1, 2.3, 0));
scene.add(at(shell(new THREE.BoxGeometry(0.2, 4.8, 6.6), wallTex), 4.1, 2.3, 0));
scene.add(at(shell(new THREE.BoxGeometry(8.4, 4.8, 0.2), wallTex), 0, 2.3, 3.2));
[-1.6, 0.6, 2.4].forEach((z) => scene.add(at(mesh(new THREE.BoxGeometry(8, 0.24, 0.28), 0x5e3a20), 0, 4.48, z)));

// door on the right wall
const door = group(
  mesh(new THREE.BoxGeometry(0.08, 2.3, 1.1), 0x5e3a20),
  at(mesh(new THREE.BoxGeometry(0.1, 0.06, 1.0), 0x3a2614, { outline: false }), 0, 0.6, 0),
  at(mesh(new THREE.BoxGeometry(0.1, 0.06, 1.0), 0x3a2614, { outline: false }), 0, -0.6, 0),
  at(mesh(new THREE.SphereGeometry(0.06, 10, 8), 0xe9b949), -0.08, 0, -0.4),
);
scene.add(at(door, 3.98, 1.15, 1.5));

const WIN = { y0: 1.1, y1: 3.3, w: 1.3, xs: [-2.25, -0.75, 0.75, 2.25], z: -3.0 };
scene.add(at(shell(new THREE.BoxGeometry(8, WIN.y0, 0.2), wallTex), 0, WIN.y0 / 2, -3.1));
scene.add(at(shell(new THREE.BoxGeometry(8, 4.6 - WIN.y1, 0.2), wallTex), 0, (4.6 + WIN.y1) / 2, -3.1));
[[-4, -2.9], [-1.6, -1.4], [-0.1, 0.1], [1.4, 1.6], [2.9, 4]].forEach(([a, b]) => {
  scene.add(at(shell(new THREE.BoxGeometry(b - a, WIN.y1 - WIN.y0, 0.2), wallTex), (a + b) / 2, (WIN.y0 + WIN.y1) / 2, -3.1));
});
const TRIM = 0x5e3a20;
const OPEN_WIN = 1; // the window next to the lantern opens
let sash = null;
WIN.xs.forEach((cx, wi) => {
  const h = WIN.y1 - WIN.y0, cy = (WIN.y0 + WIN.y1) / 2;
  scene.add(at(mesh(new THREE.BoxGeometry(WIN.w + 0.16, 0.1, 0.28), TRIM), cx, WIN.y1, -3.02));
  scene.add(at(mesh(new THREE.BoxGeometry(WIN.w + 0.16, 0.1, 0.28), TRIM), cx, WIN.y0, -3.02));
  scene.add(at(mesh(new THREE.BoxGeometry(0.1, h, 0.28), TRIM), cx - WIN.w / 2, cy, -3.02));
  scene.add(at(mesh(new THREE.BoxGeometry(0.1, h, 0.28), TRIM), cx + WIN.w / 2, cy, -3.02));
  if (wi !== OPEN_WIN) {
    scene.add(at(mesh(new THREE.BoxGeometry(0.05, h, 0.06), TRIM, { outline: false }), cx, cy, -3.06));
    [WIN.y0 + h / 3, WIN.y0 + 2 * h / 3].forEach((y) => scene.add(at(mesh(new THREE.BoxGeometry(WIN.w, 0.05, 0.06), TRIM, { outline: false }), cx, y, -3.06)));
    return;
  }
  // a casement sash hinged on its left edge, swinging into the cabin
  const sw = WIN.w - 0.1, sh = h - 0.14, bar = (w, hh, x, y) => at(mesh(new THREE.BoxGeometry(w, hh, 0.05), TRIM, { outline: false }), x, y, 0);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), new THREE.MeshBasicMaterial({ color: 0xcfe6ff, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false }));
  glass.visible = false; // clear like the other windows; hidden meshes still catch clicks
  sash = group(
    bar(sw, 0.06, sw / 2, sh / 2), bar(sw, 0.06, sw / 2, -sh / 2), bar(0.06, sh, 0.03, 0), bar(0.06, sh, sw - 0.03, 0),
    bar(0.05, sh, sw / 2, 0), bar(sw, 0.05, sw / 2, -sh / 6), bar(sw, 0.05, sw / 2, sh / 6),
    at(glass, sw / 2, 0, 0),
    at(mesh(new THREE.BoxGeometry(0.03, 0.12, 0.05), 0xd9a441), sw - 0.08, -0.05, 0.05), // handle
  );
  sash.position.set(cx - WIN.w / 2 + 0.05, cy + 0.02, -3.04);
  scene.add(sash);
});
// window seat with cushions, and the sill
scene.add(at(mesh(new THREE.BoxGeometry(7.6, 0.5, 0.6), 0x6b3f24), 0, 0.25, -2.65));
[[-2.4, 0x2f8a8a], [-0.6, 0xec7f62], [1.4, 0x2f8a8a]].forEach(([x, c]) => scene.add(at(mesh(new THREE.BoxGeometry(1.5, 0.14, 0.52), c), x, 0.57, -2.65)));
scene.add(at(mesh(new THREE.BoxGeometry(8, 0.08, 0.3), TRIM), 0, WIN.y0 + 0.02, -2.9));
const spyglass = at(mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.8, 12), 0xd9a441), -1.7, 0.72, -2.55); spyglass.rotation.z = Math.PI / 2 - 0.1;
scene.add(spyglass);

// light shafts: soft additive volumes from each window opening down to the floor
const shaftMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
  uniforms: { time: { value: 0 }, strength: { value: 1 }, color: { value: new THREE.Color("#ffc98a") } },
  vertexShader: "attribute float fade; varying float vFade; varying vec3 vPos; void main(){ vFade = fade; vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
  fragmentShader: "uniform float time; uniform float strength; uniform vec3 color; varying float vFade; varying vec3 vPos; void main(){ float a = 0.11 * strength * pow(1.0 - vFade, 1.4) * (0.85 + 0.15 * sin(time * 0.6 + vPos.x * 2.0)); gl_FragColor = vec4(color * a, a); }",
});
const shaftPos = [], shaftFade = [], shaftIdx = [];
const toFloor = (p) => p.clone().addScaledVector(LIGHT_DIR, p.y / -LIGHT_DIR.y);
const shaftVolumes = [];
WIN.xs.forEach((cx) => {
  const near = [[cx - WIN.w / 2, WIN.y0], [cx + WIN.w / 2, WIN.y0], [cx + WIN.w / 2, WIN.y1], [cx - WIN.w / 2, WIN.y1]].map(([x, y]) => new THREE.Vector3(x, y, WIN.z));
  const far = near.map(toFloor);
  shaftVolumes.push({ near, far });
  const base = shaftPos.length / 3;
  [...near, ...far].forEach((p, i) => { shaftPos.push(p.x, p.y, p.z); shaftFade.push(i < 4 ? 0 : 1); });
  for (let k = 0; k < 4; k++) { const a = base + k, b = base + (k + 1) % 4; shaftIdx.push(a, b, b + 4, a, b + 4, a + 4); }
});
const shaftGeo = new THREE.BufferGeometry();
shaftGeo.setAttribute("position", new THREE.Float32BufferAttribute(shaftPos, 3));
shaftGeo.setAttribute("fade", new THREE.Float32BufferAttribute(shaftFade, 1));
shaftGeo.setIndex(shaftIdx);
scene.add(new THREE.Mesh(shaftGeo, shaftMat));
ticks.push((t) => { shaftMat.uniforms.time.value = t; });

// rug and round captain's table
scene.add(at(mesh(new THREE.CylinderGeometry(1.7, 1.7, 0.03, 40), 0x2f5d7c), 0, 0.015, -1.0));
scene.add(at(mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.035, 40), 0xe9b949, { outline: false }), 0, 0.02, -1.0));
scene.add(at(mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.04, 40), 0x2f5d7c, { outline: false }), 0, 0.025, -1.0));
const table = group(
  at(mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.08, 36), 0x6b3f24), 0, 0.95, 0),
  at(mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.9, 12), 0x5e3a20), 0, 0.47, 0),
  at(mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.08, 20), 0x5e3a20), 0, 0.04, 0),
);
scene.add(at(table, 0, 0, -1.1));
const chair = group(
  at(mesh(new THREE.BoxGeometry(0.55, 0.07, 0.55), 0x7b4a2a), 0, 0.55, 0),
  at(mesh(new THREE.BoxGeometry(0.55, 0.7, 0.07), 0x7b4a2a), 0, 0.95, -0.26),
  ...[[-0.23, -0.23], [0.23, -0.23], [-0.23, 0.23], [0.23, 0.23]].map(([x, z]) => at(mesh(new THREE.BoxGeometry(0.06, 0.55, 0.06), 0x5e3a20), x, 0.275, z)),
);
scene.add(at(chair, 1.05, 0, -0.35, -2.2));
// a second seat pulled up to the table, the hot chocolate right in front of it
const chair2 = chair.clone();
chair2.position.set(-0.95, 0, -0.15);  // on the line from the table's centre through the mug
chair2.lookAt(0, 0, -1.1);             // seat facing the middle of the table
scene.add(chair2);

// logbook, compass and candle on the table
const book = at(openBook(), -0.32, 0.99, -1.05, -0.3);
const quill = at(mesh(new THREE.ConeGeometry(0.04, 0.5, 6), 0xf6ecd6), 0.2, 1.08, -0.85); quill.rotation.z = 1.25; quill.rotation.y = 0.5;
scene.add(book, quill);
hotspots.push(hot(group(book, quill), {
  id: "logbook", label: "Logbook", dest: "Logbook", route: "/logbook",
  view: { pos: [-0.05, 1.95, -0.45], target: [-0.32, 1.0, -1.05] },
}));
scene.add(at(mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.04, 20), 0xd9a441), -0.15, 1.01, -1.7));
const flame = at(new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.11, 8), glow(2.6, 1.8, 0.7)), 0.5, 1.27, -1.55);
const candleLight = new THREE.PointLight(0xffb15c, 0.6, 3.5, 1.5); candleLight.position.set(0.5, 1.35, -1.55);
scene.add(at(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 12), 0xf6ecd6), 0.5, 1.1, -1.55), flame, candleLight);
ticks.push((t) => { flame.scale.y = 1 + Math.sin(t * 9) * 0.12; candleLight.intensity = 0.6 + nightK * 0.5 + Math.sin(t * 11) * 0.08; });

// music box with a lid that opens while the theme plays
const crank = at(mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 6), 0xe9b949), 0.2, 0.1, 0); crank.rotation.z = Math.PI / 2;
const mbLid = at(mesh(new THREE.BoxGeometry(0.36, 0.04, 0.26), 0xe9b949), 0, 0, 0.13);
const mbHinge = group(mbLid); mbHinge.position.set(0, 0.19, -0.13);
const musicBox = group(
  at(mesh(new THREE.BoxGeometry(0.34, 0.18, 0.24), 0x7b4a2a), 0, 0.09, 0),
  at(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 10), glow(1.6, 1.3, 0.7)), 0, 0.17, 0).rotateZ(Math.PI / 2),
  crank, mbHinge,
);
scene.add(at(musicBox, 0.45, 0.99, -0.85, 0.5));
const musicHot = hot(musicBox, {
  id: "musicbox", label: "Music box", dest: "the theme", route: "♪",
  view: { pos: [1.05, 1.5, -0.2], target: [0.45, 1.06, -0.85] },
});
hotspots.push(musicHot);

// sea chart and wanted poster on the side wall
const chartTex = canvasTex(1024, 672, (x, w, h) => drawChart(x, w, h, "Sea of Projects"));
const chart = group(
  mesh(new THREE.BoxGeometry(2.2, 1.45, 0.06), 0x5e3a20),
  at(new THREE.Mesh(new THREE.PlaneGeometry(2.06, 1.31), toon(0xffffff, { map: chartTex, emissive: 0xffffff, emissiveMap: chartTex, emissiveIntensity: 0.4 })), 0, 0, 0.035),
);
chart.children[1].receiveShadow = true;
chart.position.set(-3.97, 2.65, -1.3); chart.rotation.y = Math.PI / 2;
scene.add(chart);
const chartPlane = chart.children[1];
const chartHot = hot(chart, {
  id: "chart", label: "Sea chart", dest: "Projects", route: "/projects",
  view: { pos: [-1.55, 2.6, -1.3], target: [-3.97, 2.62, -1.3] },
});
chartHot.glow = chartPlane.material; // flat paper: hover brightens it instead of outlining the thin frame
hotspots.push(chartHot);

// wanted poster in the One Piece tradition: stained parchment, big serif WANTED, a sepia portrait,
// the name with a middle dot, and a bounty in berries with the trailing dash
const posterTex = canvasTex(800, 1080, (x) => {
  x.scale(2, 2);
  const W = 400, H = 540, INKC = "#2e1a0c", SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  // frayed paper edge, parchment, stains and darkened border
  x.fillStyle = "rgba(0,0,0,0)"; x.clearRect(0, 0, W, H);
  x.beginPath();
  const edge = [];
  for (let i = 0; i <= 40; i++) edge.push([4 + rnd() * 5 + (i / 40) * (W - 8), 3 + rnd() * 6]);
  for (let i = 0; i <= 50; i++) edge.push([W - 4 - rnd() * 6, 4 + (i / 50) * (H - 8)]);
  for (let i = 40; i >= 0; i--) edge.push([4 + rnd() * 5 + (i / 40) * (W - 8), H - 3 - rnd() * 6]);
  for (let i = 50; i >= 0; i--) edge.push([4 + rnd() * 6, 4 + (i / 50) * (H - 8)]);
  edge.forEach(([px, py], i) => (i ? x.lineTo(px, py) : x.moveTo(px, py)));
  x.closePath();
  x.fillStyle = "#e6cd98"; x.fill();
  x.save(); x.clip();
  for (let i = 0; i < 9; i++) {
    const cx = rnd() * W, cy = rnd() * H, r = 25 + rnd() * 70;
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, "rgba(150, 100, 45, 0.16)"); g.addColorStop(1, "rgba(150, 100, 45, 0)");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
  }
  const vig = x.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
  vig.addColorStop(0, "rgba(120, 75, 30, 0)"); vig.addColorStop(1, "rgba(120, 75, 30, 0.55)");
  x.fillStyle = vig; x.fillRect(0, 0, W, H);
  x.restore();

  x.fillStyle = INKC; x.textAlign = "center"; x.textBaseline = "alphabetic";
  x.font = `900 74px ${SERIF}`; x.letterSpacing = "2px";
  x.fillText("WANTED", W / 2, 92);
  x.letterSpacing = "0px";

  // portrait: a sepia sunset with the captain in a tricorn, the caravel on the horizon
  const fx = 36, fy = 106, fw = W - 72, fh = 262;
  x.lineWidth = 3; x.strokeStyle = INKC; x.strokeRect(fx, fy, fw, fh);
  const px0 = fx + 7, py0 = fy + 7, pw = fw - 14, ph = fh - 14;
  x.save(); x.beginPath(); x.rect(px0, py0, pw, ph); x.clip();
  const skyG = x.createLinearGradient(0, py0, 0, py0 + ph);
  skyG.addColorStop(0, "#b48a52"); skyG.addColorStop(0.62, "#e9c98c"); skyG.addColorStop(0.63, "#8d6a3e"); skyG.addColorStop(1, "#5e4426");
  x.fillStyle = skyG; x.fillRect(px0, py0, pw, ph);
  const horizon = py0 + ph * 0.625;
  x.fillStyle = "#f6e2ae"; x.beginPath(); x.arc(px0 + pw * 0.7, horizon, 34, Math.PI, 0); x.fill();
  x.strokeStyle = "rgba(246, 226, 174, 0.55)"; x.lineWidth = 2;
  for (let i = 0; i < 6; i++) { const y = horizon + 8 + i * 9, w2 = 46 - i * 5; x.beginPath(); x.moveTo(px0 + pw * 0.7 - w2, y); x.lineTo(px0 + pw * 0.7 + w2, y); x.stroke(); }
  x.fillStyle = "#4a3220"; // the caravel, far away
  const sx = px0 + pw * 0.86, sy = horizon;
  x.beginPath(); x.moveTo(sx - 22, sy - 6); x.lineTo(sx + 20, sy - 6); x.lineTo(sx + 14, sy); x.lineTo(sx - 16, sy); x.closePath(); x.fill();
  x.fillRect(sx - 1, sy - 36, 2, 30);
  x.beginPath(); x.moveTo(sx + 1, sy - 34); x.quadraticCurveTo(sx + 16, sy - 22, sx + 1, sy - 9); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(sx - 2, sy - 30); x.quadraticCurveTo(sx - 15, sy - 20, sx - 2, sy - 10); x.closePath(); x.fill();
  if (!CAPTAIN) {
    // the captain: coat, collar, head, tricorn hat
    const cx = px0 + pw * 0.36, base = py0 + ph;
    x.fillStyle = "#2b1a0d";
    x.beginPath(); x.moveTo(cx - 92, base); x.quadraticCurveTo(cx - 84, base - 70, cx - 30, base - 84); x.lineTo(cx + 30, base - 84); x.quadraticCurveTo(cx + 84, base - 70, cx + 92, base); x.closePath(); x.fill();
    x.beginPath(); x.ellipse(cx, base - 118, 30, 36, 0, 0, Math.PI * 2); x.fill();
    x.fillRect(cx - 14, base - 92, 28, 14);
    x.beginPath(); x.moveTo(cx - 62, base - 142); x.quadraticCurveTo(cx - 30, base - 128, cx, base - 134); x.quadraticCurveTo(cx + 30, base - 128, cx + 62, base - 142);
    x.quadraticCurveTo(cx + 40, base - 150, cx + 30, base - 176); x.quadraticCurveTo(cx, base - 196, cx - 30, base - 176); x.quadraticCurveTo(cx - 40, base - 150, cx - 62, base - 142); x.closePath(); x.fill();
    x.strokeStyle = "#c9a35e"; x.lineWidth = 2.5; // gold trim on the hat, the only detail catching the light
    x.beginPath(); x.moveTo(cx - 58, base - 142); x.quadraticCurveTo(cx - 30, base - 130, cx, base - 136); x.quadraticCurveTo(cx + 30, base - 130, cx + 58, base - 142); x.stroke();
    x.beginPath(); x.moveTo(cx - 16, base - 82); x.lineTo(cx, base - 58); x.lineTo(cx + 16, base - 82); x.stroke();
  }
  if (CAPTAIN) {
    // One Piece style: the photo is printed on the poster itself, filling the frame, toned like the paper
    const s = Math.max(pw / CAPTAIN.width, ph / CAPTAIN.height), iw = CAPTAIN.width * s, ih = CAPTAIN.height * s;
    x.filter = "sepia(0.85) contrast(1.15) brightness(0.92)";
    x.drawImage(CAPTAIN, px0 + (pw - iw) / 2, py0 + (ph - ih) * 0.35, iw, ih);
    x.filter = "none";
    x.globalCompositeOperation = "multiply";
    x.fillStyle = "rgba(230, 205, 152, 0.55)"; x.fillRect(px0, py0, pw, ph); // ink soaking into parchment
    x.globalCompositeOperation = "source-over";
    const v = x.createRadialGradient(px0 + pw / 2, py0 + ph / 2, ph * 0.35, px0 + pw / 2, py0 + ph / 2, ph * 0.85);
    v.addColorStop(0, "rgba(60, 35, 15, 0)"); v.addColorStop(1, "rgba(60, 35, 15, 0.45)");
    x.fillStyle = v; x.fillRect(px0, py0, pw, ph);
  }
  for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(40, 25, 10, ${rnd() * 0.12})`; x.fillRect(px0 + rnd() * pw, py0 + rnd() * ph, 1.2, 1.2); } // photo grain
  x.restore();

  x.fillStyle = INKC;
  x.font = `700 31px ${SERIF}`; x.letterSpacing = "4px"; x.fillText("HIRED OR ALIVE", W / 2, 408); x.letterSpacing = "0px";
  const fit = (text, weight, size, maxW) => { let s = size; do { x.font = `${weight} ${s}px ${SERIF}`; s -= 1; } while (x.measureText(text).width > maxW && s > 10); };
  fit("STÉPHANE·PIRES", 900, 44, W - 60); x.fillText("STÉPHANE·PIRES", W / 2, 458);

  // bounty: the salary expectation, written the One Piece way with a trailing dash
  x.font = `900 46px ${SERIF}`;
  x.fillText("€ 70,000-", W / 2, 510);
  x.textAlign = "left";


});
const poster = group(
  at(new THREE.Mesh(new THREE.PlaneGeometry(1.06, 1.42), new THREE.MeshBasicMaterial({ color: INK })), 0, 0, -0.005),
  // a little self-light keeps the paper readable even in the cabin's shade
  new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.35), toon(0xffffff, { map: posterTex, transparent: true, emissive: 0xffffff, emissiveMap: posterTex, emissiveIntensity: 0.4 })),
  at(mesh(new THREE.SphereGeometry(0.035, 8, 6), 0x8a8f99), 0, 0.655, 0.02),
);
poster.children[1].receiveShadow = true;
poster.position.set(-3.98, 2.45, 1.05); poster.rotation.y = Math.PI / 2; poster.rotation.z = 0.04;
scene.add(poster);
hotspots.push(hot(poster, {
  id: "poster", label: "Wanted poster", dest: "About me", route: "/about-me",
  view: { pos: [-2.25, 2.4, 1.05], target: [-3.98, 2.42, 1.05] },
}));
hotspots[hotspots.length - 1].glow = poster.children[1].material;

// bottle catching the sun on the sill
const btl = at(bottle(), 1.05, WIN.y0 + 0.06, -2.88);
scene.add(btl);
const bottleHot = hot(btl, {
  id: "bottle", label: "Message in a bottle", dest: "Pourparler", route: "/pourparler",
  view: { pos: [1.45, 1.75, -1.55], target: [1.05, 1.42, -2.88] },
});
hotspots.push(bottleHot);

// treasure chest, barrel, rope
const treasure = chest();
const ch = at(treasure.g, 3.0, 0, -0.9, -0.9);
scene.add(ch);
const chestHot = hot(ch, {
  id: "chest", label: "Treasure chest", dest: "CV download", route: "/api/download/curriculum",
  view: { pos: [1.45, 1.75, 0.6], target: [3.0, 0.5, -0.9] },
});
hotspots.push(chestHot);
scene.add(at(mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.9, 16), 0x8a5733), 3.35, 0.45, 2.55));
[0.25, 0.68].forEach((y) => scene.add(at(mesh(new THREE.TorusGeometry(0.4, 0.025, 6, 24), 0x3a2a1a, { outline: false }), 3.35, y, 2.55).rotateX(Math.PI / 2)));

// ---------- the captain's own things: the bike, the board-game shelf, the climbing corner ----------
function tubeBetween(a, b, r, color) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A);
  const m = mesh(new THREE.CylinderGeometry(r, r, d.length(), 8), color, { outline: false });
  m.position.copy(A).add(B).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return m;
}
function bicycle() { // a blue cyclocross bike: drop bars, knobby tyres
  const g = new THREE.Group(), BLUE = 0x1f6fb5, DARK = 0x222428, METAL = 0xb8bec6;
  [-0.52, 0.52].forEach((x0) => {
    g.add(at(mesh(new THREE.TorusGeometry(0.33, 0.04, 8, 32), DARK), x0, 0.37, 0));
    g.add(at(mesh(new THREE.TorusGeometry(0.29, 0.012, 6, 32), METAL, { outline: false }), x0, 0.37, 0));
    for (let k = 0; k < 8; k++) { const sp = mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.58, 4), METAL, { outline: false, shadow: false }); sp.position.set(x0, 0.37, 0); sp.rotation.z = k * Math.PI / 8; g.add(sp); }
  });
  const R = [-0.52, 0.37, 0], BB = [-0.06, 0.33, 0], S = [-0.2, 0.86, 0], H = [0.36, 0.84, 0], HB = [0.42, 0.68, 0], F = [0.52, 0.37, 0];
  [[BB, S], [S, H], [BB, HB], [R, BB], [R, [-0.18, 0.8, 0]], [HB, H]].forEach(([a, b]) => g.add(tubeBetween(a, b, 0.026, BLUE)));
  g.add(tubeBetween(HB, F, 0.018, DARK));
  g.add(tubeBetween(S, [-0.23, 0.95, 0], 0.012, METAL));
  g.add(at(mesh(new THREE.BoxGeometry(0.24, 0.04, 0.09), DARK), -0.25, 0.97, 0));
  g.add(tubeBetween(H, [0.46, 0.9, 0], 0.014, DARK));
  const bar = mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.42, 8), DARK, { outline: false }); bar.rotation.x = Math.PI / 2; bar.position.set(0.46, 0.9, 0); g.add(bar);
  [-0.2, 0.2].forEach((z) => { g.add(tubeBetween([0.46, 0.9, z], [0.56, 0.82, z], 0.013, DARK)); g.add(tubeBetween([0.56, 0.82, z], [0.5, 0.74, z], 0.013, DARK)); });
  g.add(at(mesh(new THREE.TorusGeometry(0.09, 0.012, 6, 20), METAL, { outline: false }), -0.06, 0.33, 0.03));
  g.add(tubeBetween([-0.52, 0.37, 0.03], [-0.06, 0.33, 0.035], 0.005, DARK));
  g.add(at(mesh(new THREE.BoxGeometry(0.09, 0.02, 0.05), DARK), -0.06, 0.24, 0.1));
  return g;
}
const bike = bicycle();
bike.rotation.y = -Math.PI / 2; // along the wall
const bikeLean = group(bike);
bikeLean.rotation.z = 0.1;       // leaning against it
bikeLean.scale.setScalar(1.4);    // full size, next to the table and the shelf
bikeLean.position.set(-3.66, 0, 0.85);
scene.add(bikeLean);
hotspots.push(hot(bikeLean, { id: "bike", label: "Bike", secret: true, tipOnly: true, tip: { name: "Cyclo-cross bike", quality: "rare", lines: [
  ["Equip: Commute through snow, rain and sunshine.", "use"], ["Riding since 2018, starting in Nantes."], ["\"Cheap, healthy and green.\"", "flavor"]] } }));

// board-game shelf under the sea chart
function gameBox(name, color, ink, w, hh, d) {
  const label = canvasTex(420, 84, (x, cw, chh) => {
    x.fillStyle = `#${color.toString(16).padStart(6, "0")}`; x.fillRect(0, 0, cw, chh);
    x.fillStyle = "rgba(255, 255, 255, 0.18)"; x.fillRect(0, 0, cw, 10);
    x.fillStyle = "rgba(0, 0, 0, 0.12)"; x.fillRect(0, chh - 14, cw, 14); // lid edge, no title
  });
  const side = toon(color), mats = [toon(0xffffff, { map: label }), side, side, side, side, side];
  return mesh(new THREE.BoxGeometry(w, hh, d), 0, { mat: mats });
}
const shelf = new THREE.Group();
const SW = 1.7, SH = 1.45, SD = 0.4, SHELF_WOOD = 0x6b3f24;
shelf.add(at(mesh(new THREE.BoxGeometry(SD, SH, 0.05), SHELF_WOOD), 0, SH / 2, -SW / 2), at(mesh(new THREE.BoxGeometry(SD, SH, 0.05), SHELF_WOOD), 0, SH / 2, SW / 2));
[0.02, 0.5, 0.98, 1.43].forEach((y) => shelf.add(at(mesh(new THREE.BoxGeometry(SD, 0.04, SW), SHELF_WOOD), 0, y, 0)));
shelf.add(at(mesh(new THREE.BoxGeometry(0.02, SH, SW), 0x5e3a20, { outline: false }), -SD / 2, SH / 2, 0));
[["Carcassonne", 0x2f6fb5, "#fff6e0"], ["Azul", 0x2a9db0, "#fff6e0"], ["Small World", 0xd6a03a, "#3a2614"]]
  .forEach(([n, c, ink], i) => shelf.add(at(gameBox(n, c, ink, 0.34, 0.09, 0.5), 0, 0.09 + i * 0.095, -0.4, (i - 1) * 0.06)));
[["Living Forest", 0x3f8f5a, "#fff6e0"], ["Micro Macro", 0xe9e2d0, "#3a2614"]]
  .forEach(([n, c, ink], i) => shelf.add(at(gameBox(n, c, ink, 0.34, 0.1, 0.55), 0, 0.57 + i * 0.105, 0.3, (i ? 0.05 : -0.04))));
shelf.add(at(mesh(new THREE.BoxGeometry(0.3, 0.12, 0.3), 0xb5462f), 0, 0.58, -0.45));
[0xc8553d, 0x4f86c6, 0xe9b949, 0x5aa877].forEach((c, i) => { // meeples
  const m = group(at(mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.08, 10), c), 0, 0.04, 0), at(mesh(new THREE.SphereGeometry(0.035, 10, 8), c), 0, 0.11, 0));
  shelf.add(at(m, 0.05, 1.0, -0.55 + i * 0.12));
});
[[0.02, -0.02, 0.3], [0.06, 0.14, 0.9]].forEach(([dx, dz, ry]) => shelf.add(at(mesh(new THREE.BoxGeometry(0.07, 0.07, 0.07), 0xfbf6ea), dx, 1.035, 0.25 + dz, ry))); // dice
shelf.add(at(mesh(new THREE.BoxGeometry(0.09, 0.035, 0.065), 0x2f5d7c), 0.02, 1.02, 0.6, 0.2)); // a deck of cards
shelf.add(at(gameBox("Board games", 0x7b4a2a, "#f0c75e", 0.34, 0.1, 0.6), 0, 1.5, -0.2, 0.05));
shelf.position.set(-3.79, 0, -1.3);
scene.add(shelf);
hotspots.push(hot(shelf, { id: "games", label: "Board games", secret: true, tipOnly: true, tip: { name: "Board game shelf", quality: "epic", lines: [
  ["Use: Break the ice.", "use"], ["Weekly sessions with friends, family and colleagues."],
  ["Favourites: Living Forest, Carcassonne, Small World, Azul, Micro Macro"], ["\"One more game?\"", "flavor"]] } }));

// climbing corner: harness and rope on hooks, shoes and chalk bag on the floor
[[2.05, 1.78], [2.6, 1.78]].forEach(([z, y]) => { const hk = mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.14, 8), 0xb8bec6); hk.rotation.z = Math.PI / 2; hk.position.set(-3.93, y, z); scene.add(hk); });
const harness = group(
  mesh(new THREE.TorusGeometry(0.2, 0.035, 6, 24), 0xe8742a),
  at(mesh(new THREE.TorusGeometry(0.12, 0.028, 6, 20), 0xe8742a), -0.1, -0.32, 0),
  at(mesh(new THREE.TorusGeometry(0.12, 0.028, 6, 20), 0xe8742a), 0.1, -0.32, 0),
  at(mesh(new THREE.TorusGeometry(0.045, 0.012, 6, 14), 0xd9a441), 0, -0.21, 0.03),
  at(mesh(new THREE.TorusGeometry(0.045, 0.012, 6, 14), 0xb8bec6), 0.13, -0.14, 0.03),
);
harness.rotation.y = Math.PI / 2;
harness.position.set(-3.88, 1.56, 2.05);
const ropeCoil = group(
  mesh(new THREE.TorusGeometry(0.22, 0.05, 8, 28), 0x2bb3a3),
  at(mesh(new THREE.TorusGeometry(0.2, 0.045, 8, 28), 0x2393a6), 0.02, -0.03, 0.03),
  tubeBetween([0, -0.2, 0.02], [0.04, -0.62, 0.02], 0.03, 0x2bb3a3),
);
ropeCoil.rotation.y = Math.PI / 2;
ropeCoil.position.set(-3.86, 1.56, 2.6);
const shoe = (z, ry) => at(group(
  at(mesh(new THREE.BoxGeometry(0.26, 0.07, 0.1), 0xc0392b), 0, 0.055, 0),  // upper
  at(mesh(new THREE.BoxGeometry(0.27, 0.02, 0.105), 0x222428), 0, 0.01, 0), // sole
), -3.45, 0, z, ry);
const chalkBag = group(at(mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.14, 14), 0x3a6ea5), 0, 0.07, 0), at(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.015, 14), 0xf6f2ea, { outline: false }), 0, 0.145, 0));
const climbing = group(harness, ropeCoil, shoe(2.2, 0.3), shoe(2.38, 0.1), at(chalkBag, -3.6, 0, 2.8));
scene.add(climbing);
hotspots.push(hot(climbing, { id: "climbing", label: "Climbing gear", secret: true, tipOnly: true, tip: { name: "Harness & rope", quality: "uncommon", lines: [
  ["Equip: +10 Grip.", "use"], ["Climbing since 2022, a year at the Aspala club in Antony."], ["\"Seeking a climbing partner: bouldering or routes.\"", "flavor"]] } }));

const rope = mesh(new THREE.TorusGeometry(0.3, 0.07, 8, 24), 0xc9a26b); rope.rotation.x = Math.PI / 2;
scene.add(at(rope, 3.2, 0.07, -2.0));

// hanging lantern
const lamp = new THREE.PointLight(0xffb85c, 2.2, 8, 1.5);
const lantern = group(
  at(mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.1, 4), 0x3a2a1a, { outline: false, shadow: false }), 0, -0.55, 0),
  at(mesh(new THREE.ConeGeometry(0.2, 0.18, 6), 0x2b2b33, { shadow: false }), 0, -1.18, 0),
  at(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.32, 6), glow(2.2, 1.6, 0.7)), 0, -1.43, 0),
  at(mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.05, 6), 0x2b2b33, { shadow: false }), 0, -1.61, 0),
  at(lamp, 0, -1.43, 0),
);
lantern.position.set(0.15, 4.6, -1.1);
scene.add(lantern);
const lanternHot = hot(lantern, { id: "lantern", label: "Lantern", dest: "day or night", route: "☾" });
hotspots.push(lanternHot);

// ---------- day and night: the lantern switches between the sunset and a clear night with stars and a moon ----------
// start from the device's light/dark preference; a lantern click overrides it and is remembered
const darkScheme = matchMedia("(prefers-color-scheme: dark)");
let savedNight = null;
try { savedNight = localStorage.getItem("caravel.night"); } catch (e) { /* no storage: follow the device */ }
let nightK = savedNight !== null ? Number(savedNight === "1") : Number(darkScheme.matches), nightTarget = nightK;
darkScheme.addEventListener("change", (e) => { // the device switched (e.g. automatic dark mode at dusk): follow it unless the lantern was used
  if (savedNight !== null) return;
  nightTarget = e.matches ? 1 : 0;
  if (still) nightK = nightTarget;
  updateLanternChip();
  applyMusicMood();
}, { signal: ac.signal });

const STARS = 900, starArr = new Float32Array(STARS * 3);
for (let i = 0; i < STARS; i++) {
  const a = Math.random() * Math.PI * 2, y = 0.04 + Math.pow(Math.random(), 2.2) * 0.96, r = Math.sqrt(1 - y * y); // denser near the horizon, where the windows look
  starArr.set([Math.cos(a) * r * 150, y * 150, Math.sin(a) * r * 150], i * 3);
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute("position", new THREE.BufferAttribute(starArr, 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.8, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, fog: false });
scene.add(new THREE.Points(starGeo, starMat));
const moonMat = new THREE.MeshBasicMaterial({ color: new THREE.Color().setRGB(1.15, 1.15, 1.25), transparent: true, opacity: 0, fog: false });
const moon = new THREE.Mesh(new THREE.CircleGeometry(2.6, 48), moonMat);
const moonHaloMat = new THREE.MeshBasicMaterial({ color: 0x9fb4ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
const moonHalo = new THREE.Mesh(new THREE.CircleGeometry(6, 48), moonHaloMat);
scene.add(moon, moonHalo);

const C = (c) => new THREE.Color(c);
const DAY = { top: C("#24345e"), mid: C("#e9876a"), low: C("#ffd391"), fog: C(0xf0a07c), sea: C(0x3f8fb8), sunC: C(0xffcf94), hemiSky: C(0xffd9b0), hemiGround: C(0x5b4a86), shaft: C("#ffc98a"), cloud: C(0xffd9c4), cloudE: C(0x7a4a5a) };
const NIGHT = { top: C("#040817"), mid: C("#111d42"), low: C("#2a3a70"), fog: C(0x0f1a33), sea: C(0x14305c), sunC: C(0x9fb4ff), hemiSky: C(0x5d6db0), hemiGround: C(0x1c1a44), shaft: C("#a9bcff"), cloud: C(0x48527e), cloudE: C(0x10142a) };
const mixTo = (key, out) => out.copy(DAY[key]).lerp(NIGHT[key], nightK);
function applyNight(t = 0) {
  const u = sky.material.uniforms;
  mixTo("top", u.top.value); mixTo("mid", u.mid.value); mixTo("low", u.low.value);
  mixTo("fog", scene.fog.color); mixTo("sea", sea.material.color);
  mixTo("sunC", sun.color); sun.intensity = 1.6 - nightK * 1.05;           // the sunbeams become moonlight
  mixTo("hemiSky", hemi.color); mixTo("hemiGround", hemi.groundColor); hemi.intensity = 0.8 - nightK * 0.35;
  mixTo("shaft", shaftMat.uniforms.color.value); shaftMat.uniforms.strength.value = 1 - nightK * 0.45;
  mixTo("cloud", cloudMat.color); mixTo("cloudE", cloudMat.emissive);
  sunDisc.material.opacity = 1 - nightK; halo.material.opacity = 0.25 * (1 - nightK);
  sunDisc.position.y = halo.position.y = 1.5 - nightK * 9;                  // the sun sinks into the sea...
  moon.position.set(-14, 3 + nightK * 9, -95); moonHalo.position.set(-14, moon.position.y, -96); // ...as the moon rises
  moonMat.opacity = nightK; moonHaloMat.opacity = 0.08 * nightK;
  starMat.opacity = nightK * (0.85 + 0.1 * Math.sin(t * 2.3));              // a gentle twinkle
}
function updateLanternChip() {
  const chip = document.getElementById("chip-lantern");
  if (chip) chip.querySelector("span").textContent = nightTarget ? "☀ sunset" : "☾ night";
}
function toggleNight() {
  nightTarget = nightTarget ? 0 : 1;
  if (still) nightK = nightTarget;
  savedNight = String(nightTarget);
  try { localStorage.setItem("caravel.night", savedNight); } catch (e) { /* not remembered, still works */ }
  updateLanternChip();
  applyMusicMood();
}
applyNight();
ticks.push((t, dt) => {
  if (nightK !== nightTarget) nightK = nightTarget > nightK ? Math.min(nightTarget, nightK + dt / 2.5) : Math.max(nightTarget, nightK - dt / 2.5);
  if (still && nightK !== nightTarget) nightK = nightTarget;
  if (nightK > 0 || nightTarget > 0) applyNight(t);
  else if (sunDisc.material.opacity !== 1) applyNight(t);
});
ticks.push((t) => {
  lantern.rotation.z = Math.sin(t * 1.3) * 0.06;
  lantern.rotation.x = Math.cos(t * 0.9) * 0.035;
  lamp.intensity = 2.2 + nightK * 1.4 + Math.sin(t * 7) * 0.12;
});

// a mug of hot chocolate on the table, still steaming
const dotTex = canvasTex(32, 32, (x) => { const g = x.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, 32, 32); }); // soft puff for the steam
const MUG = 0xc8553d;
const choco = new THREE.Mesh(new THREE.CircleGeometry(0.063, 20), toon(0x5a3420));
choco.rotation.x = -Math.PI / 2; choco.position.y = 0.062;
const cream = mesh(new THREE.SphereGeometry(0.052, 14, 10), 0xfbf6ea);
cream.scale.y = 0.45; cream.position.y = 0.072;
const handle = mesh(new THREE.TorusGeometry(0.04, 0.012, 6, 14, Math.PI), MUG);
handle.rotation.z = -Math.PI / 2; handle.position.set(0.072, 0, 0);
const mug = group(
  mesh(new THREE.CylinderGeometry(0.07, 0.062, 0.14, 20), MUG), handle, choco, cream,
  ...[[0.018, 0.012, 0xfde2ea], [-0.02, 0.005, 0xfbf6ea], [0.004, -0.022, 0xfde2ea]].map(([x0, z0, c]) => at(mesh(new THREE.BoxGeometry(0.022, 0.018, 0.022), c, { outline: false }), x0, 0.092, z0, x0 * 20)),
);
const cocoa = group(at(mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.015, 24), 0xf6ecd6), 0, 0.0075, 0), at(mug, 0, 0.085, 0, -0.6));
scene.add(at(cocoa, -0.55, 0.99, -0.55));
hotspots.push(hot(cocoa, { id: "cocoa", label: "Hot chocolate", secret: true, tipOnly: true, tip: { name: "Hot chocolate", quality: "uncommon", lines: [
  ["Use: Restores 100% morale.", "use"], ["Whipped cream and three marshmallows."], ["\"Still too hot. Worth the wait.\"", "flavor"]] } }));
const steam = [0, 1, 2].map(() => {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTex, color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, fog: false }));
  scene.add(s);
  return s;
});
ticks.push((t) => {
  steam.forEach((s, i) => {
    const k = (t * 0.35 + i / 3) % 1; // each wisp rises, widens and fades, then starts again
    s.position.set(-0.55 + Math.sin(t * 1.5 + i * 2) * 0.04 * k, 1.17 + k * 0.45, -0.55 + Math.cos(t * 1.2 + i) * 0.02 * k);
    s.scale.setScalar(0.06 + k * 0.16);
    s.material.opacity = 0.32 * Math.sin(k * Math.PI);
  });
});

// the openable window: a sea bird comes to the sill while it's open, and flies off before it closes
function seaBird() { // an original little gull: white body, grey wings, orange beak
  const white = 0xf4f1ea, grey = 0x9aa3b0;
  const body = mesh(new THREE.SphereGeometry(0.07, 14, 10), white); body.scale.set(1, 0.85, 1.35);
  const head = group(
    mesh(new THREE.SphereGeometry(0.045, 12, 10), white),
    at(mesh(new THREE.ConeGeometry(0.014, 0.045, 8), 0xf0a03c, { outline: false }), 0, -0.005, 0.055).rotateX(Math.PI / 2),
    at(mesh(new THREE.SphereGeometry(0.008, 6, 6), 0x15100c, { outline: false }), 0.026, 0.012, 0.028),
    at(mesh(new THREE.SphereGeometry(0.008, 6, 6), 0x15100c, { outline: false }), -0.026, 0.012, 0.028),
  );
  head.position.set(0, 0.065, 0.075);
  const wing = (side) => {
    const w = mesh(new THREE.SphereGeometry(0.05, 10, 8), grey); w.scale.set(0.25, 0.6, 1.1); w.position.set(side * 0.02, 0, -0.01);
    const pivot = group(w); pivot.position.set(side * 0.055, 0.02, 0); return pivot;
  };
  const wl = wing(1), wr = wing(-1);
  const tail = at(mesh(new THREE.ConeGeometry(0.03, 0.08, 4), grey), 0, 0.01, -0.11).rotateX(-Math.PI / 2);
  const legs = [0.02, -0.02].map((x0) => at(mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.05, 4), 0xf0a03c, { outline: false }), x0, -0.075, 0));
  const g = group(body, head, wl, wr, tail, ...legs);
  g.userData = { head, wl, wr };
  return g;
}
const winCx = WIN.xs[OPEN_WIN];
const PERCH = new THREE.Vector3(winCx + 0.3, WIN.y0 + 0.06 + 0.1, -2.9);
const bird = seaBird();
bird.visible = false;
scene.add(bird);
let windowOpen = false, sashOpen = false, windowTimer = 0, birdState = "away", birdT = 0;
const birdPath = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], birdAhead = new THREE.Vector3();
const bez = (u, out) => out.set(0, 0, 0).addScaledVector(birdPath[0], (1 - u) * (1 - u)).addScaledVector(birdPath[1], 2 * u * (1 - u)).addScaledVector(birdPath[2], u * u);
function startBird(kind) {
  birdState = kind; birdT = 0; bird.visible = true;
  if (kind === "arriving") birdPath.forEach((v, i) => v.copy([new THREE.Vector3(winCx + 4, 3.8, -10), new THREE.Vector3(winCx + 1.2, 2.4, -4.2), PERCH][i]));
  else birdPath.forEach((v, i) => v.copy([bird.position.clone(), new THREE.Vector3(winCx - 0.6, 2.3, -4.5), new THREE.Vector3(winCx - 5, 4.5, -12)][i]));
}
const WINDOW_TIPS = {
  closed: { name: "Window", quality: "common", lines: [["Use: Open for some fresh air.", "use"]] },
  open: { name: "Window", quality: "common", lines: [["Use: Close the window.", "use"], ["A visitor might drop by.", "flavor"]] },
};
function toggleWindow() {
  clearTimeout(windowTimer);
  windowOpen = !windowOpen;
  windowHot.tip = windowOpen ? WINDOW_TIPS.open : WINDOW_TIPS.closed;
  if (windowOpen) {
    sashOpen = true;
    windowTimer = setTimeout(() => { if (windowOpen && birdState === "away") startBird("arriving"); }, 700);
  } else {
    const birdHere = birdState === "perched" || birdState === "arriving";
    if (birdHere) startBird("leaving");             // the bird leaves first...
    windowTimer = setTimeout(() => { if (!windowOpen) sashOpen = false; }, birdHere ? 900 : 0); // ...then the window shuts
  }
}
// 七転び八起き, a Japanese proverb, carved above the stern windows (the visiting bird carries Emily Dickinson's line)
const quoteTex = canvasTex(740, 210, (x, w, hh) => {
  x.fillStyle = "#8a5733"; x.fillRect(0, 0, w, hh);
  x.strokeStyle = "rgba(60, 35, 15, 0.35)"; x.lineWidth = 3;
  for (let i = 0; i < 7; i++) { x.beginPath(); x.moveTo(0, 20 + i * 28 + Math.sin(i) * 6); x.bezierCurveTo(w * 0.3, 10 + i * 30, w * 0.7, 30 + i * 26, w, 18 + i * 28); x.stroke(); } // wood grain
  x.textAlign = "center"; x.textBaseline = "middle";
  x.font = "104px 'Yuji Syuku', 'Hiragino Mincho ProN', 'Yu Mincho', serif";
  x.fillStyle = "rgba(255, 225, 170, 0.18)"; x.fillText("七転び八起き", w / 2 + 2, 110); // carved edge catching the light
  x.fillStyle = "#3a1f0e"; x.fillText("七転び八起き", w / 2, 108);
});
const quotePlank = mesh(new THREE.BoxGeometry(1.9, 0.54, 0.05), 0, { mat: [toon(0x7b4a2a), toon(0x7b4a2a), toon(0x7b4a2a), toon(0x7b4a2a), toon(0xffffff, { map: quoteTex }), toon(0x7b4a2a)] });
scene.add(at(quotePlank, (WIN.xs[0] + WIN.xs[WIN.xs.length - 1]) / 2, (WIN.y1 + 4.6) / 2, -2.97)); // centred over the row of stern windows, halfway between the window tops and the ceiling
hotspots.push(hot(bird, { id: "bird", label: "Sea bird", secret: true, tipOnly: true, tip: { name: "Sea bird", quality: "uncommon", lines: [
  ["Visits when the window is open.", "use"], ["“Hope” is the thing with feathers.", "flavor"], ["— Emily Dickinson"]] } }));

const windowHot = hot(sash, { id: "window", label: "Window", secret: true, tip: WINDOW_TIPS.closed });
hotspots.push(windowHot);
ticks.push((t, dt) => {
  sash.rotation.y += ((sashOpen ? -1.75 : 0) - sash.rotation.y) * Math.min(1, dt * 3);
  const { head, wl, wr } = bird.userData;
  if (birdState === "arriving" || birdState === "leaving") {
    birdT = Math.min(1, birdT + dt / 2.2);
    const u = birdT * birdT * (3 - 2 * birdT);
    bez(u, bird.position);
    if (birdT < 0.98) bird.lookAt(bez(Math.min(1, u + 0.03), birdAhead));
    const flap = Math.sin(t * 28) * 0.9;
    wl.rotation.z = -0.3 + flap; wr.rotation.z = 0.3 - flap;
    if (birdT === 1) {
      if (birdState === "arriving") { birdState = "perched"; bird.rotation.set(0, 0, 0); } // facing into the cabin
      else { birdState = "away"; bird.visible = false; }
    }
  } else if (birdState === "perched") {
    wl.rotation.z = 0; wr.rotation.z = 0;
    bird.position.y = PERCH.y + Math.pow(Math.max(0, Math.sin(t * 1.3)), 12) * 0.05; // a little hop now and then
    head.rotation.x = Math.sin(t * 3) * 0.15;
    head.rotation.y = Math.sin(t * 0.7) * 0.5;
  }
});

// the ship's cat, asleep on the window-seat cushion under the window that opens.
// If the bird lands while the window is open, the cat wakes, pounces and leaps out with it: neither comes back.
function shipCat() {
  const ORANGE = 0xe0913f, DARK = 0x9a5a22;
  const body = mesh(new THREE.SphereGeometry(0.16, 16, 12), ORANGE); body.scale.set(1.25, 0.58, 1);
  const stripes = [-0.06, 0.02, 0.1].map((x0) => at(mesh(new THREE.BoxGeometry(0.025, 0.06, 0.24), DARK, { outline: false }), x0, 0.075, 0));
  const ear = (z0) => at(mesh(new THREE.ConeGeometry(0.03, 0.06, 4), ORANGE), 0.02, 0.085, z0);
  const eye = (z0) => at(mesh(new THREE.BoxGeometry(0.004, 0.006, 0.026), 0x2e1a0c, { outline: false }), 0.085, 0.015, z0);
  const head = group(mesh(new THREE.SphereGeometry(0.085, 14, 10), ORANGE), ear(0.04), ear(-0.04), eye(0.032), eye(-0.032),
    at(mesh(new THREE.SphereGeometry(0.012, 6, 6), 0xd86f6f, { outline: false }), 0.088, -0.012, 0));
  head.position.set(0.16, 0.0, 0.05);
  head.rotation.z = -0.25; // tucked down, asleep
  const tail = mesh(new THREE.TorusGeometry(0.17, 0.028, 6, 18, Math.PI * 1.15), ORANGE);
  tail.rotation.x = -Math.PI / 2; tail.rotation.z = 0.4; tail.position.y = -0.04;
  const g = group(body, ...stripes, head, tail);
  g.userData = { body, head, tail };
  return g;
}
const cat = shipCat();
const CAT_HOME = new THREE.Vector3(-0.55, 0.76, -2.62);
cat.scale.setScalar(1.3); // a proper ship's cat, visible from the doorway
cat.position.copy(CAT_HOME);
cat.rotation.y = 0.5;
scene.add(cat);
const zTex = canvasTex(64, 64, (x) => { x.fillStyle = "#f6ecd6"; x.font = "700 46px Merienda, Georgia, serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("z", 32, 34); });
const zzz = [0, 1, 2].map(() => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: zTex, transparent: true, depthWrite: false })); s.scale.setScalar(0.08); s.raycast = () => {}; scene.add(s); return s; });
hotspots.push(hot(cat, { id: "cat", label: "Ship's cat", secret: true, tipOnly: true, tip: { name: "Ship's cat", quality: "uncommon", lines: [
  ["Use: Do not disturb.", "use"], ["Curled up on the warmest cushion.", null], ["“Dreams of birds.”", "flavor"]] } }));
let catState = "sleeping", catT = 0, birdWatch = 0;
const catFrom = new THREE.Vector3(), catOut = new THREE.Vector3();
const arc = (a, b, u, lift, out) => out.lerpVectors(a, b, u).setY(a.y + (b.y - a.y) * u + Math.sin(Math.PI * u) * lift);
ticks.push((t, dt) => {
  const { body, head, tail } = cat.userData;
  if (catState === "sleeping") {
    body.scale.y = 0.58 + Math.sin(t * 1.6) * 0.025; // slow breathing
    tail.rotation.z = 0.4 + Math.sin(t * 0.5) * 0.06;
    zzz.forEach((s, i) => {
      const k = (t * 0.25 + i / 3) % 1;
      s.position.set(CAT_HOME.x + 0.12 + k * 0.12, CAT_HOME.y + 0.12 + k * 0.35, CAT_HOME.z + 0.05);
      s.material.opacity = Math.sin(Math.PI * k) * 0.9;
      s.scale.setScalar(0.05 + k * 0.06);
    });
    birdWatch = windowOpen && birdState === "perched" ? birdWatch + dt : 0;
    if (birdWatch > 2.5) { catState = "waking"; catT = 0; zzz.forEach((s) => (s.visible = false)); }
  } else if (catState === "waking") { // head up, eyes on the bird, the hip wiggle
    catT += dt;
    head.rotation.z = Math.min(0.35, -0.25 + catT * 1.2);
    head.position.y = Math.min(0.07, catT * 0.12);
    cat.rotation.y += (Math.atan2(-(bird.position.z - cat.position.z), bird.position.x - cat.position.x) - cat.rotation.y) * Math.min(1, dt * 4);
    body.rotation.x = catT > 0.6 ? Math.sin(catT * 30) * 0.08 : 0;
    if (catT > 1.3) { catState = "pouncing"; catT = 0; catFrom.copy(cat.position); }
  } else if (catState === "pouncing") { // one leap onto the sill, a second one out of the window
    catT += dt;
    if (catT < 0.45) arc(catFrom, bird.position, catT / 0.45, 0.35, cat.position);
    else {
      if (birdState !== "gone") { birdState = "gone"; bird.visible = false; catOut.set(winCx - 0.2, -1.5, -6.5); catFrom.copy(cat.position); }
      const u = Math.min(1, (catT - 0.45) / 0.6);
      arc(catFrom, catOut, u, 0.4, cat.position);
      if (u === 1) { catState = "gone"; cat.visible = false; }
    }
  }
});

// the home stone: a glowing rune stone on a little shelf by the last window; using it brings you back to the cabin
const runeTex = canvasTex(128, 128, (x, w) => {
  x.strokeStyle = "#ffffff"; x.lineWidth = 9; x.lineCap = "round"; x.lineJoin = "round";
  // an original "home" rune: a roof over a little door, with a dot for the hearth
  x.beginPath(); x.moveTo(26, 62); x.lineTo(64, 26); x.lineTo(102, 62); x.stroke();
  x.beginPath(); x.moveTo(38, 56); x.lineTo(38, 100); x.lineTo(90, 100); x.lineTo(90, 56); x.stroke();
  x.fillStyle = "#ffffff"; x.beginPath(); x.arc(64, 76, 8, 0, Math.PI * 2); x.fill();
});
const runeMat = new THREE.MeshBasicMaterial({ map: runeTex, transparent: true, depthWrite: false, color: new THREE.Color().setRGB(1.3, 2.2, 2.8) });
const stone = mesh(new THREE.SphereGeometry(0.13, 18, 14), 0x6f7d91);
stone.scale.set(1, 0.78, 0.55);
const rune = new THREE.Mesh(new THREE.CircleGeometry(0.075, 24), runeMat);
rune.position.set(0, 0.005, 0.073);
const stoneLight = new THREE.PointLight(0x6fd3ff, 0.5, 1.6, 1.5);
stoneLight.position.set(0, 0.05, 0.25);
const homeStone = group(
  at(mesh(new THREE.BoxGeometry(0.42, 0.04, 0.22), 0x6b3f24), 0, 0, 0),
  at(mesh(new THREE.BoxGeometry(0.04, 0.16, 0.16), 0x5e3a20), 0, -0.1, -0.02),
  at(group(stone, rune), 0, 0.105, 0.01),
  stoneLight,
);
homeStone.position.set(3.45, 1.95, -2.88);
scene.add(homeStone);
const homeHot = hot(homeStone, { id: "homestone", label: "Home stone", secret: true,
  tip: { name: "Home stone", quality: "rare", lines: [["Use: Return to the cabin.", "use"], ["30 min cooldown"]] } });
hotspots.push(homeHot);
let homeFlash = 0;
ticks.push((t, dt) => {
  homeFlash = Math.max(0, homeFlash - dt * 0.8);
  runeMat.opacity = 0.75 + 0.2 * Math.sin(t * 2) + homeFlash * 0.5;
  stoneLight.intensity = 0.5 + 0.15 * Math.sin(t * 2) + homeFlash * 2.5;
});
const tip = $("tip");
let tipShown = null, tipTimer = 0;
function showTip(ev, info) {
  if (tipShown !== info) {
    tip.innerHTML = "";
    tip.append(el("strong", { class: `q-${info.quality || "rare"}` }, info.name));
    info.lines.forEach(([text, cls]) => tip.append(el("span", cls ? { class: cls } : {}, text)));
    tipShown = info;
  }
  tip.hidden = false;
  const w = tip.offsetWidth, hgt = tip.offsetHeight;
  tip.style.left = `${Math.min(ev.clientX + 16, innerWidth - w - 8)}px`;
  tip.style.top = `${Math.min(ev.clientY + 16, innerHeight - hgt - 8)}px`;
}
function hideTip() { tip.hidden = true; tipShown = null; tipTimer = 0; }
function useHomeStone(ev) {
  homeFlash = 1;
  if (focused) { backToCabin(); return; }
  if (ev) showTip(ev, { name: "Home stone", quality: "rare", lines: [["You're already home.", "use"]] });
  clearTimeout(tipTimer);
  tipTimer = setTimeout(hideTip, 1800);
}

// close-up animations: chest lid, music box lid, bottle lifting off the sill
let focused = null, playing = false;
const approach = (cur, target, dt, speed = 4) => cur + (target - cur) * Math.min(1, dt * speed);
ticks.push((t, dt) => {
  treasure.hinge.rotation.x = approach(treasure.hinge.rotation.x, focused === chestHot ? -1.25 : 0, dt);
  mbHinge.rotation.x = approach(mbHinge.rotation.x, playing ? -1.1 : 0, dt);
  if (playing) crank.rotation.x += dt * 4;
  const lifted = focused === bottleHot;
  btl.position.y = approach(btl.position.y, WIN.y0 + 0.06 + (lifted ? 0.18 : 0), dt, 3);
  btl.rotation.y = lifted ? btl.rotation.y + dt * 0.8 : approach(btl.rotation.y, 0, dt, 2);
});

// ---------- music: the cabin theme, recorded with sampled instruments, played as five synced looping layers ----------
// (rendered offline from MIDI with FluidSynth + GeneralUser GS; at night the percussion steps back and the tune softens)
const STEM_IDS = ["ambience", "percussion", "bass", "chords", "melody"];
let audioCtx = null, musicMaster = null, stemBuffers = null, stemNodes = [], busy = false;
const musicBtn = $("music"), musicLabel = $("music-label"), musicIcon = musicBtn.querySelector(".icon");

async function loadMusic() {
  audioCtx = new AudioContext();
  musicMaster = audioCtx.createGain();
  musicMaster.gain.value = 0;
  musicMaster.connect(audioCtx.destination);
  stemBuffers = await Promise.all(STEM_IDS.map(async (id) => audioCtx.decodeAudioData(await (await fetch(`/cabin/audio/${id}.mp3`)).arrayBuffer())));
}

function applyMusicMood(instant = false) {
  if (!stemNodes.length) return;
  const night = nightTarget === 1;
  const levels = { ambience: 1, percussion: night ? 0.3 : 1, bass: night ? 0.7 : 1, chords: 1, melody: night ? 0.75 : 1 };
  stemNodes.forEach((n) => n.gain.gain.setTargetAtTime(levels[n.id], audioCtx.currentTime, instant ? 0.01 : 0.8));
}

function startStems() {
  const when = audioCtx.currentTime + 0.05; // every layer starts on the same sample, so they stay in sync
  stemNodes = stemBuffers.map((buffer, i) => {
    const src = audioCtx.createBufferSource(), gain = audioCtx.createGain();
    src.buffer = buffer; src.loop = true;
    src.connect(gain); gain.connect(musicMaster);
    src.start(when);
    return { id: STEM_IDS[i], src, gain };
  });
  applyMusicMood(true);
}

function setMusicUI() {
  musicBtn.setAttribute("aria-pressed", String(playing));
  musicLabel.textContent = playing ? "Stop music" : "Play music";
  musicIcon.textContent = playing ? "■" : "♪";
  if (focused === musicHot) renderFocus(musicHot);
}

async function toggleMusic() {
  if (busy) return;
  busy = true; musicBtn.disabled = true;
  try {
    if (!playing) {
      if (!audioCtx) { musicLabel.textContent = "Tuning up…"; await loadMusic(); }
      if (audioCtx.state === "suspended") await audioCtx.resume();
      startStems();
      musicMaster.gain.cancelScheduledValues(audioCtx.currentTime);
      musicMaster.gain.setTargetAtTime(0.9, audioCtx.currentTime, 0.25); // fade in
      playing = true;
    } else {
      musicMaster.gain.cancelScheduledValues(audioCtx.currentTime);
      musicMaster.gain.setTargetAtTime(0, audioCtx.currentTime, 0.15); // fade out, then stop the layers
      await new Promise((r) => setTimeout(r, 700));
      stemNodes.forEach((n) => n.src.stop());
      stemNodes = [];
      playing = false;
    }
  } catch (e) {
    musicLabel.textContent = "Music unavailable";
  } finally {
    busy = false; musicBtn.disabled = false;
    setMusicUI();
  }
}
musicBtn.addEventListener("click", toggleMusic);

// ---------- camera: kept inside the cabin, with smooth close-ups ----------
const OVERVIEW = { pos: new THREE.Vector3(3.2, 2.5, 2.8), target: new THREE.Vector3(-0.4, 1.6, -1.3) };
const ROOM_MIN = new THREE.Vector3(-3.6, 1.0, -2.3), ROOM_MAX = new THREE.Vector3(3.6, 4.0, 2.9);
const camera = new THREE.PerspectiveCamera(54, 1, 0.05, 400);
camera.position.copy(OVERVIEW.pos);
const controls = new OrbitControls(camera, canvas);
controls.target.copy(OVERVIEW.target);
Object.assign(controls, {
  enableDamping: true, enablePan: false, rotateSpeed: 0.6,
  minDistance: 2.2, maxDistance: 6.2,
  minPolarAngle: 1.05, maxPolarAngle: 1.72,      // never above the ceiling, never down into the floor
  minAzimuthAngle: -0.25, maxAzimuthAngle: 1.2,  // the stern windows and the chart wall stay in view
});
controls.update();

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.55, 0.9); // only the brightest things glow: sun, lantern, candle, gold
composer.addPass(bloom);
composer.addPass(new OutputPass());

let tween = null;
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
function flyTo(pos, target, done) {
  tween = { p0: camera.position.clone(), t0: controls.target.clone(), p1: pos.clone(), t1: target.clone(), start: performance.now(), dur: still ? 1 : 1100, done };
}
// portrait screens step back so the object still fits
function framed(view) {
  const target = new THREE.Vector3(...view.target), pos = new THREE.Vector3(...view.pos);
  const k = camera.aspect < 1 ? Math.min(2.1, 1.15 / camera.aspect) : 1;
  pos.sub(target).multiplyScalar(k).add(target);
  if (camera.aspect >= 1) { // desktop: slide the view so the object sits right of the panel
    const fwd = target.clone().sub(pos), right = fwd.clone().cross(new THREE.Vector3(0, 1, 0)).normalize();
    const shift = right.multiplyScalar(-fwd.length() * 0.2);
    pos.add(shift); target.add(shift);
  }
  pos.clamp(new THREE.Vector3(-3.8, 0.6, -2.7), new THREE.Vector3(3.8, 4.3, 3.0));
  return { pos, target };
}

// ---------- panel: overview and close-up content ----------
const overviewEl = $("overview"), focusEl = $("focus");
const fTitle = $("f-title"), fLede = $("f-lede"), fBody = $("f-body"), fNote = $("f-note");
let hovered = null;

function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => (k === "class" ? (e.className = v) : e.setAttribute(k, v)));
  kids.forEach((k) => e.append(k));
  return e;
}
const wouldOpen = (route) => { fNote.textContent = ""; fNote.append("On the real site this opens ", el("code", {}, route), "."); };

function renderFocus(h) {
  fTitle.textContent = h.label;
  fBody.innerHTML = ""; fNote.textContent = "";
  if (h.id === "logbook") {
    fLede.textContent = "Every post is an entry in the captain's logbook. The pages on the table list them too.";
    const ul = el("ul", { class: "list" });
    POSTS.forEach(([t, d, slug]) => {
      const b = el("button", { type: "button" }, el("span", { class: "t" }, t), el("span", { class: "m" }, d));
      b.addEventListener("click", () => wouldOpen(`/logbook/${slug}`));
      ul.append(el("li", {}, b));
    });
    fBody.append(ul);
  } else if (h.id === "chart") {
    fLede.textContent = "One island per project. Tap an island on the chart, or pick one below, to sail to its site.";
    const ul = el("ul", { class: "list" });
    PROJECTS.forEach(([name, when, stack]) => {
      ul.append(el("li", {}, el("a", { href: PROJECT_LINKS[name], target: "_blank", rel: "noopener" },
        el("span", { class: "t" }, `${name} ↗`), el("span", { class: "m" }, when), el("span", { class: "s" }, stack))));
    });
    fBody.append(ul);
  } else if (h.id === "poster") {
    fLede.textContent = "Fullstack developer, looking for challenges and adventures.";
    const dl = el("dl", { class: "facts" });
    [["Crews", "Figures · Leakmited · Analog Way"] /* Izicrédit hidden for now */, ["Schools", "Isep · Audencia"], ["Shore leave", "Video games · Climbing · Biking · Board games"]]
      .forEach(([k, v]) => dl.append(el("dt", {}, k), el("dd", {}, v)));
    const b = el("button", { type: "button" }, "Read the full story");
    b.addEventListener("click", () => openScroll(b));
    fBody.append(dl, el("div", { class: "actions", style: "margin-top:10px" }, b));
  } else if (h.id === "chest") {
    fLede.textContent = "The lid creaks open: the captain's CV, ready to take away.";
    const en = el("button", { type: "button" }, "Download CV · English");
    const fr = el("button", { type: "button" }, "Télécharger le CV · Français");
    en.addEventListener("click", () => wouldOpen("/api/download/curriculum?language=english"));
    fr.addEventListener("click", () => wouldOpen("/api/download/curriculum?language=french"));
    fBody.append(el("div", { class: "actions" }, en, fr));
  } else if (h.id === "bottle") {
    fLede.textContent = "Uncork it to write to the captain and book a rendez-vous.";
    fBody.append(el("p", { class: "detail" }, "The rendez-vous page is hidden for now. When it comes back, this bottle opens the booking form."));
    wouldOpen("/pourparler");
  } else if (h.id === "musicbox") {
    fLede.textContent = "An original island tune, played live by your browser.";
    const b = el("button", { type: "button" }, playing ? "■ Stop the music" : "♪ Wind it up");
    b.addEventListener("click", toggleMusic);
    fBody.append(el("div", { class: "actions" }, b));
  }
}

// ---------- the full wanted scroll: the about-me page, unrolled inside the cabin ----------
const ABOUT = [
  { id: "crews", tab: "Crews", title: "Crews sailed with", items: [
    { name: "Figures", logo: "/cabin/assets/figures-logo.png", cover: true, link: "https://figures.hr/", from: "May 2026", to: "Oct 2026", diff: "6 months",
      kind: "Senior Software Engineer · pay-transparency platform · Paris, hybrid",
      text: "Owned the Salary Bands module end to end, from product and design decisions to delivery, performance and scaling, for 100+ clients and 10,000+ employees' data.",
      missions: ["Built DataHealth from scratch: rule-based validation and profiling of HR-connector data, catching discrepancies before customers do",
        "Set up monitoring as code: Datadog dashboards via Terraform tracking p75 FCP, p50/p95 API latency and payload size",
        "Cut page load by ~60% (p75 FCP 4s → 1.5s) and brought 98% of API calls under 1s (up from 93%)",
        "Worked AI-first in a 9-person cross-functional team, running supervised multi-hour agentic tasks with Claude Code, Codex and MCP/Skills",
        "Prototyped beyond my scope: background task notifications, Salary Band auto-mapping, benchmark mapping"],
      skills: ["TypeScript", "Terraform", "Datadog", "Claude Code", "Codex", "MCP"] },
    { name: "Leakmited", logo: "/cabin/assets/leakmited-webclip.png", cover: true, link: "https://www.leakmited.com/", from: "Sep 2023", to: "Mar 2026", diff: "2+ years",
      kind: "Drinking-water network software · team of seven at the start",
      text: "Joined a seven-person team with three in Tech/Product and grew with it past 20 people and a €5M Series A. Built and industrialized SENTINEL, which monitors District Metered Areas to direct leak searchers, and extended the TWIN platform with renovation planning and water-savings estimates.",
      missions: ["Started the SENTINEL project from scratch", "Shipped map, renovation, dashboard and matrix features", "Built ETL pipelines to ingest network data", "Ran client interviews to map real field needs"],
      skills: ["Node.js", "TypeScript", "Svelte", "SvelteKit", "Storybook", "AWS", "Vercel", "ETL", "Python", "PostgreSQL"] },
    /* Izicrédit is hidden for now; remove the comment markers to show it again
    { name: "Izicrédit", logo: "/cabin/assets/izicredit-logo.png", link: "https://www.izicredit.com/", from: "Feb 2023", to: "Jun 2023", diff: "4 months",
      kind: "Fullstack engineer · team of two",
      text: "Built a platform for bank professionals and an admin dashboard that gave the product and marketing teams insight from the collected data. A startup pace: products built from scratch on tight timelines.",
      missions: ["Added database relations with PostGraphile", "Built a catchment-area input, UI and algorithm", "Built the admin and bank dashboards end to end", "Wrote a CRON server in Node.js"],
      skills: ["Node.js", "TypeScript", "React", "GraphQL", "Next.js", "PostgreSQL"] },
    */
    { name: "Analog Way", logo: "/cabin/assets/analogway-logoo.png", link: "https://www.analogway.com/americas/", from: "Sep 2019", to: "Feb 2023", diff: "3+ years",
      kind: "Software engineer · team of nine",
      text: "Developed the web application that controls Analog Way's hardware, in a company with a strong R&D culture. Led the adoption of agile practices in the first year and built the authentication module that controls access to the application.",
      missions: ["Built real-time UI features with React and Redux", "Prototyped a feature with WebRTC", "Built an authentication module", "Introduced Scrum and Kanban"],
      skills: ["Node.js", "TypeScript", "React", "Redux"] },
  ] },
  { id: "ships", tab: "Ships", title: "Ships built", items: [
    { name: "Faraway", logo: "/cabin/assets/project-faraway.jpg", cover: true, link: "https://faraway-solver.com", from: "Jan 2026", to: "today", kind: "Personal project",
      shot: "/cabin/assets/project-faraway.jpg", skills: ["Svelte", "SvelteKit", "AWS", "Computer vision", "Python", "Serverless"] },
    { name: "Abracadabra", logo: "/cabin/assets/project-abracadabra.jpg", cover: true, link: "https://github.com/Stephane-Pires/abracadabra", from: "Nov 2024", to: "today", kind: "Personal project",
      shot: "/cabin/assets/project-abracadabra.jpg", skills: ["Ansible", "Linux", "Terminal"] },
    { name: "Caravel", logo: "/cabin/assets/project-caravel.jpg", cover: true, link: "https://caravel-mocha.vercel.app/", from: "Apr 2023", to: "today", kind: "Personal project · this very ship",
      shot: "/cabin/assets/project-caravel.jpg", skills: ["Next.js", "React", "Tailwind", "Node.js"] },
    { name: "Ventus", logo: "/cabin/assets/project-ventus.jpg", cover: true, link: "https://ventus-jade.vercel.app/1", from: "Sep 2022", to: "Jul 2023", kind: "Personal project",
      shot: "/cabin/assets/project-ventus.jpg", skills: ["Vue", "Vite", "WindiCSS"] },
  ] },
  { id: "training", tab: "Training", title: "Training grounds", items: [
    { name: "Audencia", logo: "/cabin/assets/audencia-logo.png", link: "https://www.audencia.com/", from: "Sep 2018", to: "Aug 2019", diff: "1 year",
      kind: "Double diploma · Engineering & Management",
      text: "Final year at Audencia Business School in Nantes: finance, accounting and corporate strategy. It gave me the company's point of view, and showed me my heart was in building software.",
      missions: ["Semester in management, in English", "Semester in business development"],
      skills: ["Negotiation", "Finance", "Management", "Accounting", "Change management", "Business development"] },
    { name: "Isep", logo: "/cabin/assets/isep-logo.png", link: "https://en.isep.fr/", from: "Sep 2016", to: "Jun 2018", diff: "2 years",
      kind: "Engineering school · after CPGE",
      text: "Chosen for a love of programming: computer science, algorithms, project management, networking and systems architecture.",
      missions: ["First year: computing and programming", "Second year: information-systems architecture"],
      skills: ["Java", "HTML", "CSS", "JavaScript", "SQL"] },
  ] },
  { id: "shore", tab: "Shore leave", title: "Shore leave", items: [
    { name: "Video games", logo: "/cabin/assets/power-blue.svg", from: "1998", to: "today",
      text: "It started at four, with Age of Empires on my father's PC. Games shaped my sense of UI and UX more than anything else.",
      missions: ["Final Fantasy VII", "Rayman", "Monkey Island", "Celeste", "Starcraft"] },
    { name: "Climbing", logo: "/cabin/assets/arrow-up-down-blue.svg", from: "2022", to: "today",
      text: "Found after Covid, with a year at the Aspala club in Antony. Looking for a climbing partner, bouldering or routes.",
      photos: [["/cabin/assets/climbing.jpg", "Climbing"]] },
    { name: "Biking", logo: "/cabin/assets/map-blue.svg", from: "2018", to: "today",
      text: "Started commuting by bike in Nantes and never stopped: snow, rain or sunshine.",
      photos: [["/cabin/assets/bike.jpg", "Out on the bike"], ["/cabin/assets/bike-treasure.jpg", "A treasure found on a ride"]] },
    { name: "Board games", logo: "/cabin/assets/puzzle-piece-blue.svg", from: "2018", to: "today",
      text: "Weekly sessions with friends, family and colleagues. The best icebreaker there is.",
      missions: ["Living Forest", "Carcassonne", "Small World", "Azul", "Micro Macro"] },
  ] },
];

const scrollWrap = $("scroll"), sheet = $("sheet"), navEl = $("scroll-nav"), tabsEl = $("scroll-tabs");
let scrollBuilt = false, scrollOpener = null;

function buildScroll() {
  const img = el("img", { alt: "Wanted poster: Stéphane Pires, hired or alive, bounty 70,000 euros", width: "400", height: "540" });
  img.src = posterTex.image.toDataURL("image/png");
  const facts = el("dl", { class: "s-facts" });
  [["Last seen", "Figures, until Oct 2026"], ["Sailing since", "2019"], ["Ships built", `${PROJECTS.length}`], ["Bounty", "€ 70,000-"]]
    .forEach(([k, v]) => facts.append(el("dt", {}, k), el("dd", {}, v)));
  sheet.append(el("section", { id: "s-bounty", class: "s-sec" },
    el("div", { class: "bounty" }, img, el("div", {},
      el("h2", { id: "scroll-title", class: "s-name" }, "Stéphane·Pires"),
      el("p", { class: "s-tag" }, "Fullstack developer, looking for challenges and adventures."),
      facts))));
  ABOUT.forEach((sec) => {
    const s = el("section", { id: `s-${sec.id}`, class: "s-sec" }, el("h3", {}, sec.title));
    const line = el("div", { class: "timeline" });
    sec.items.forEach((it, n) => {
      // the marker sticks under the tabs while its entry is being read, like the timeline on /about-me
      // a logo on a transparent background can bring its own colour, so the circle reads as one solid logo
      const logoImg = el("img", { src: it.logo, alt: "", width: "36", height: "36", loading: "lazy" });
      if (it.logoScale) logoImg.style.width = logoImg.style.height = `${92 * it.logoScale}%`;
      const logo = el("span", { class: `tl-logo${it.cover ? " cover" : ""}${it.logo.endsWith(".svg") ? " icon" : ""}` }, logoImg);
      if (it.logoBg) logo.style.background = it.logoBg;
      const dates = el("span", { class: "tl-dates" }, `from: ${it.from}`, el("br"), `to: ${it.to}`);
      if (it.diff) dates.append(el("br"), `(${it.diff})`);
      const mark = el("div", { class: "tl-mark" },
        it.link ? el("a", { href: it.link, target: "_blank", rel: "noopener", "aria-label": `${it.name} website` }, logo) : logo,
        el("span", { class: "tl-name" }, it.name), dates);
      const body = el("div", { class: "tl-body" });
      if (it.kind) body.append(el("p", { class: "e-kind" }, it.kind));
      if (it.text) body.append(el("p", {}, it.text));
      if (it.shot) body.append(el("figure", { class: "polaroid wide", style: "--r:-1.5deg" }, el("img", { src: it.shot, alt: `Screenshot of ${it.name}`, loading: "lazy" })));
      if (it.missions) body.append(el("ul", { class: "missions" }, ...it.missions.map((m) => el("li", {}, m))));
      if (it.skills) body.append(el("div", { class: "stamps" }, ...it.skills.map((k, i) => el("span", { class: "stamp", style: `--r:${((i * 37) % 7) - 3}deg` }, k))));
      if (it.photos) body.append(el("div", { class: "polaroids" }, ...it.photos.map(([src, cap], i) => el("figure", { class: "polaroid", style: `--r:${i % 2 ? 2.5 : -2}deg` }, el("img", { src, alt: cap, loading: "lazy" }), el("figcaption", {}, cap)))));
      line.append(el("article", { class: "tl-entry" }, mark, body));
    });
    s.append(line);
    sheet.append(s);
  });
  [["bounty", "Bounty"], ...ABOUT.map((s) => [s.id, s.tab])].forEach(([id, label]) => {
    const b = el("button", { type: "button", "data-sec": id }, label);
    b.addEventListener("click", () => sheet.scrollTo({ top: $(`s-${id}`).offsetTop - navEl.offsetHeight, behavior: still ? "auto" : "smooth" }));
    tabsEl.append(b);
  });
  sheet.addEventListener("scroll", spy, { passive: true });
  scrollBuilt = true;
}

// highlight the tab of the section being read
function spy() {
  const y = sheet.scrollTop + navEl.offsetHeight + 30;
  let current = "bounty";
  sheet.querySelectorAll(".s-sec").forEach((s) => { if (s.offsetTop <= y) current = s.id.slice(2); });
  if (sheet.scrollTop + sheet.clientHeight >= sheet.scrollHeight - 4) current = ABOUT[ABOUT.length - 1].id;
  tabsEl.querySelectorAll("button").forEach((b) => b.setAttribute("aria-current", String(b.dataset.sec === current)));
}

function openScroll(opener) {
  if (!scrollBuilt) buildScroll();
  scrollOpener = opener;
  scrollWrap.hidden = false;
  sheet.style.setProperty("--tabs-h", `${navEl.offsetHeight}px`);
  sheet.scrollTop = 0;
  spy();
  tabsEl.querySelector("button").focus({ preventScroll: true });
}
function closeScroll() {
  if (scrollWrap.hidden) return false;
  scrollWrap.hidden = true;
  if (scrollOpener && scrollOpener.isConnected) scrollOpener.focus({ preventScroll: true });
  return true;
}
$("scroll-close").addEventListener("click", closeScroll);
scrollWrap.addEventListener("click", (e) => { if (e.target === scrollWrap) closeScroll(); });

function focusOn(h) {
  focused = h;
  hovered = null;
  controls.enabled = false;
  const v = framed(h.view);
  flyTo(v.pos, v.target);
  renderFocus(h);
  overviewEl.hidden = true; focusEl.hidden = false;
  refreshHighlights();
  $("back").focus({ preventScroll: true });
}

function backToCabin() {
  if (!focused) return;
  const from = focused;
  focused = null;
  flyTo(OVERVIEW.pos, OVERVIEW.target, () => { controls.enabled = true; });
  overviewEl.hidden = false; focusEl.hidden = true;
  refreshHighlights();
  const chip = $(`chip-${from.id}`); if (chip) chip.focus({ preventScroll: true });
}
$("back").addEventListener("click", backToCabin);
addEventListener("keydown", (e) => { if (e.key === "Escape" && !closeScroll()) backToCabin(); });

function setOutline(h, color) { h.outlines.forEach((m) => m.color.setHex(color)); }
function refreshHighlights() {
  hotspots.forEach((h) => {
    const on = h !== focused && h === hovered;
    if (h.glow) { h.glow.emissiveIntensity = on ? 0.8 : 0.4; setOutline(h, INK); }
    else setOutline(h, on ? MINT : INK);
  });
}

const chips = $("chips");
hotspots.forEach((h) => {
  if (h.secret) return; // the home stone is for those who find it
  const b = el("button", { type: "button", id: `chip-${h.id}` }, h.label + " ", el("span", {}, h === musicHot ? "♪" : h === lanternHot ? (nightTarget ? "☀ sunset" : "☾ night") : `→ ${h.dest}`));
  b.addEventListener("click", () => (h === lanternHot ? toggleNight() : focusOn(h)));
  chips.append(b);
});

const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
let lastHit = null, chartHover = null, chartDrawn = null;
function islandAt(hit) {
  if (!hit || hit.object !== chartPlane || !hit.uv) return null;
  const cx = hit.uv.x, cy = 1 - hit.uv.y;
  const found = ISLANDS.find(([, ix, iy]) => Math.hypot((cx - ix) * 1024, (cy - iy) * 672) < 95);
  return found ? found[0] : null;
}
function sailTo(name) {
  const url = PROJECT_LINKS[name];
  const a = el("a", { href: url, target: "_blank", rel: "noopener" }, name);
  document.body.append(a); a.click(); a.remove(); // a real link click, which opens the site in a new tab
  fNote.textContent = ""; fNote.append("Sailing to ", el("a", { href: url, target: "_blank", rel: "noopener", style: "color: var(--mint)" }, `${name} ↗`), "…");
}
function pick(ev) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hits = ray.intersectObjects(scene.children, true);
  for (const hit of hits) {
    if (hit.object.isPoints || hit.object.material === shaftMat || hit.object === sky) continue; // light and dust aren't solid
    let shown = true;
    for (let o = hit.object; o; o = o.parent) if (!o.visible) { shown = false; break; }
    if (!shown) continue; // a hidden bird or a cat that's gone
    let o = hit.object;
    while (o) { if (o.userData.hot) { lastHit = hit; return o.userData.hot; } o = o.parent; }
    return null; // something solid is in front
  }
  return null;
}
let down = null;
canvas.addEventListener("pointerdown", (e) => { down = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener("pointerup", (e) => {
  if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6) {
    const h = pick(e);
    if (h === lanternHot) toggleNight();
    else if (h === homeHot) useHomeStone(e);
    else if (h === windowHot) toggleWindow();
    else if (h && h.tipOnly) { showTip(e, h.tip); clearTimeout(tipTimer); tipTimer = setTimeout(hideTip, 2600); } // phones: tap to read
    else if (h && h !== focused) focusOn(h);
    else if (h === musicHot) toggleMusic();
    else if (h === chartHot) { const isl = islandAt(lastHit); if (isl) sailTo(isl); }
  }
  down = null;
});
canvas.addEventListener("pointermove", (e) => {
  if (e.pointerType !== "mouse" || e.buttons) return;
  const h = pick(e);
  if (h !== hovered) { hovered = h; canvas.style.cursor = h ? "pointer" : focused ? "default" : "grab"; refreshHighlights(); }
  if (h && h.tip) { clearTimeout(tipTimer); tipTimer = 0; showTip(e, h.tip); } else if (!tipTimer) hideTip(); // a timed tip (tap, "already home") stays until its timer ends
  if (focused === chartHot) {
    chartHover = h === chartHot ? islandAt(lastHit) : null;
    canvas.style.cursor = chartHover ? "pointer" : "default";
  }
});

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  composer.setPixelRatio(pixelRatio);
  composer.setSize(w, h);
  camera.aspect = w / h;
  camera.fov = w < 600 ? 66 : 54; // a slightly wide lens, wider on phones, so the cabin doesn't feel cramped
  camera.updateProjectionMatrix();
}
addEventListener("resize", resize);

resize();
setMusicUI();
veil.remove();

// redraw the chart while an island is hovered (and once more when the hover ends, to settle it)
ticks.push((t) => {
  const hover = focused === chartHot ? chartHover : null;
  if (!hover && !chartDrawn) return;
  drawChart(chartTex.image.getContext("2d"), chartTex.image.width, chartTex.image.height, "Sea of Projects", { hover, t: hover ? t + 0.001 : 0 });
  chartTex.needsUpdate = true;
  chartDrawn = hover;
});

const clock = new THREE.Clock();
let t = 0;
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05);
  if (!still) t += dt;
  ticks.forEach((f) => f(t, still ? 0 : dt));
  if (tween) {
    const k = Math.min(1, (performance.now() - tween.start) / tween.dur), e = ease(k);
    camera.position.lerpVectors(tween.p0, tween.p1, e);
    controls.target.lerpVectors(tween.t0, tween.t1, e);
    camera.lookAt(controls.target);
    if (k === 1) { const done = tween.done; tween = null; if (done) done(); }
  } else if (!focused) {
    controls.update();
    camera.position.clamp(ROOM_MIN, ROOM_MAX); // stay inside the cabin
  }
  composer.render();
});

return () => {
  ac.abort();
  renderer.setAnimationLoop(null);
  renderer.dispose();
  if (audioCtx) audioCtx.close();
};
}
