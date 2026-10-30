/* eslint-disable */
// Toon toolkit: three-band materials, ink outlines, scene-building helpers, painted textures
import * as THREE from "three";

export const INK = 0x0d1626; // the ink every outline is drawn in
// ---------- toon toolkit ----------
// three light bands: shadow, midtone, lit. This one texture is most of the "storybook" look.
export const grad = new THREE.DataTexture(new Uint8Array([85, 170, 255]), 3, 1, THREE.RedFormat);
export const toon = (color, extra = {}) => new THREE.MeshToonMaterial({ color, gradientMap: grad, ...extra });
export const glow = (r, g, b) => new THREE.MeshBasicMaterial({ color: new THREE.Color().setRGB(r, g, b) }); // >1 values feed the bloom
export const OUTLINE = 0.024;
// inverted-hull outline with the same thickness on every axis
export function addOutline(m) {
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
export function mesh(geo, color, { outline = true, mat, shadow = true } = {}) {
  const m = new THREE.Mesh(geo, mat || toon(color));
  m.castShadow = m.receiveShadow = shadow;
  if (outline) addOutline(m);
  return m;
}
export function at(obj, x, y, z, ry = 0) { obj.position.set(x, y, z); obj.rotation.y = ry; return obj; }
export function group(...children) { const g = new THREE.Group(); children.forEach((c) => g.add(c)); return g; }
// register a clickable object: collects its outline materials for highlighting
export function hot(g, info) {
  info.group = g;
  info.outlines = [];
  g.traverse((o) => { if (o.userData.outlineMat) info.outlines.push(o.userData.outlineMat); });
  g.userData.hot = info;
  return info;
}
export function canvasTex(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
export function plankTex(base, line, n, vertical) {
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
// ---------- the captain's own things: the bike, the board-game shelf, the climbing corner ----------
export function tubeBetween(a, b, r, color) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A);
  const m = mesh(new THREE.CylinderGeometry(r, r, d.length(), 8), color, { outline: false });
  m.position.copy(A).add(B).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return m;
}
