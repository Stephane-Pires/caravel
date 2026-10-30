/* eslint-disable */
// Props built from simple shapes: sea, palms, bottle, chest, logbook, clouds, bike, game boxes, sea bird, ship's cat
import * as THREE from "three";
import { FONTS, INK, grad, toon, glow, mesh, at, group, hot, canvasTex, plankTex, tubeBetween } from "./toolkit.js";
import { POSTS } from "./content.js";
export function makeSea(color, y) {
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
export function palm(h = 3.2, lean = 0.5) {
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
export function bottle() {
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
export function chest(w = 1.1, h = 0.6, d = 0.7) {
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
export function pageTexture() {
  return canvasTex(1024, 640, (x, w, h) => {
    x.fillStyle = "#f6ecd6"; x.fillRect(0, 0, w, h);
    x.strokeStyle = "rgba(122, 90, 50, 0.25)"; x.lineWidth = 2;
    x.beginPath(); x.moveTo(w / 2, 0); x.lineTo(w / 2, h); x.stroke();
    x.fillStyle = "#4a2a14"; x.textAlign = "left";
    x.font = `700 52px ${FONTS.merienda}, Georgia, serif`; x.fillText("Logbook", 46, 86);
    x.font = `24px ${FONTS.atkinson}, sans-serif`; x.fillStyle = "#7a5a32"; x.fillText("Latest entries", 48, 124);
    const draw = (items, x0, y0) => items.forEach(([t, d], i) => {
      const y = y0 + i * 96;
      x.fillStyle = "#3a2614"; x.font = `700 27px ${FONTS.merienda}, Georgia, serif`;
      const title = t.length > 26 ? t.slice(0, 25) + "…" : t;
      x.fillText(title, x0, y);
      x.fillStyle = "#8a6a3c"; x.font = `22px ${FONTS.atkinson}, sans-serif`; x.fillText(d, x0, y + 32);
      x.strokeStyle = "rgba(122, 90, 50, 0.3)"; x.beginPath(); x.moveTo(x0, y + 50); x.lineTo(x0 + 410, y + 50); x.stroke();
    });
    draw(POSTS.slice(0, 5).map((p) => [p[0], p[1]]), 48, 190);
    draw(POSTS.slice(5, 9).map((p) => [p[0], p[1]]), w / 2 + 46, 90);
  });
}
export function openBook(cover = 0x8c2f22) {
  const left = mesh(new THREE.BoxGeometry(0.47, 0.06, 0.6), 0xf6ecd6); left.position.set(-0.245, 0.05, 0); left.rotation.z = 0.07;
  const right = mesh(new THREE.BoxGeometry(0.47, 0.06, 0.6), 0xf6ecd6); right.position.set(0.245, 0.05, 0); right.rotation.z = -0.07;
  const page = new THREE.Mesh(new THREE.PlaneGeometry(0.94, 0.58), toon(0xffffff, { map: pageTexture() }));
  page.rotation.x = -Math.PI / 2; page.position.y = 0.087; page.receiveShadow = true;
  return group(mesh(new THREE.BoxGeometry(1.0, 0.04, 0.66), cover), left, right, page);
}
// weather on the horizon: drifting sunset clouds, a passing rain shower, circling gulls
export const puff = (color, emissive) => new THREE.MeshToonMaterial({ color, emissive, gradientMap: grad, fog: false });
export function cloud(mat, size) {
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
export function bicycle() { // a blue cyclocross bike: drop bars, knobby tyres
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
// board-game shelf under the sea chart
export function gameBox(name, color, ink, w, hh, d) {
  const label = canvasTex(420, 84, (x, cw, chh) => {
    x.fillStyle = `#${color.toString(16).padStart(6, "0")}`; x.fillRect(0, 0, cw, chh);
    x.fillStyle = "rgba(255, 255, 255, 0.18)"; x.fillRect(0, 0, cw, 10);
    x.fillStyle = "rgba(0, 0, 0, 0.12)"; x.fillRect(0, chh - 14, cw, 14); // lid edge, no title
  });
  const side = toon(color), mats = [toon(0xffffff, { map: label }), side, side, side, side, side];
  return mesh(new THREE.BoxGeometry(w, hh, d), 0, { mat: mats });
}
// the openable window: a sea bird comes to the sill while it's open, and flies off before it closes
export function seaBird() { // an original little gull: white body, grey wings, orange beak
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
// the ship's cat, asleep on the window-seat cushion under the window that opens.
// If the bird lands while the window is open, the cat wakes, pounces and leaps out with it: neither comes back.
export function shipCat() {
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
