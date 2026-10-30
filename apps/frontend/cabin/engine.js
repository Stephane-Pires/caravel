/* eslint-disable */
// The engine room: a brass instrument panel showing how this site is built, shipped and running,
// and the rack of tools it's built with. Live numbers come from /api/engine-room (GitHub, Vercel,
// Sentry, read on the server); until they arrive, or for a source not connected, the instruments rest.
import * as THREE from "three";
import { FONTS, toon, mesh, at, group, canvasTex } from "./toolkit.js";

const BRASS = 0xb08d57, IRON = 0x24262e, WOOD = 0x6b3f24, INKC = "#2e1a0c";
const W = 1.3, H = 1.05; // the panel
const ROWS = 7, COLS = 27, PITCH = 0.034; // a lamp per day, a column per week (GitHub's calendar)
const FLAGS = 10;

// lamp colours by GitHub's activity level: dark glass, then warmer; only the busiest days glow (>1 feeds the bloom)
const LEVEL_COLORS = [[0.1, 0.08, 0.06], [0.32, 0.2, 0.08], [0.55, 0.36, 0.13], [0.8, 0.53, 0.2], [1.6, 1.1, 0.42]].map(([r, g, b]) => new THREE.Color().setRGB(r, g, b));
const FLAG_COLORS = { ready: 0x3fb950, error: 0xe5534b, building: 0xd29922, canceled: 0x6e7681 };

// a gauge's scale: needle from the left stop (min) to the right stop (max), a green and a red zone
const GAUGES = [
  { key: "crashFree", title: "Crash-free sessions", label: "CRASH-FREE", unit: "%", min: 95, max: 100, good: [99.5, 100], bad: [95, 99], tip: (v) => `${v}% of visits had no crash (last 7 days). Target: 99.5%+` },
  { key: "lcpP75", title: "Page load (p75)", label: "LOAD p75", unit: "s", min: 0, max: 5, good: [0, 2.5], bad: [4, 5], tip: (v) => `Pages show their main content in ${v}s for 75% of visits (last 7 days). Google's "good": under 2.5s` },
  { key: "errors", title: "Errors", label: "ERRORS 7d", unit: "", min: 0, max: 50, good: [0, 10], bad: [30, 50], tip: (v) => `${v} errors caught in the last 7 days. Target: under 10` },
];
const SWEEP = 2.3; // radians either side of straight up

function plate(text, w, h, { size = 44, color = INKC, bg = "#d8b878" } = {}) {
  const tex = canvasTex(Math.round(w * 1000), Math.round(h * 1000), (x, cw, ch) => {
    x.fillStyle = bg; x.fillRect(0, 0, cw, ch);
    x.strokeStyle = "rgba(60, 35, 10, 0.55)"; x.lineWidth = 6; x.strokeRect(5, 5, cw - 10, ch - 10);
    x.fillStyle = color; x.font = `700 ${size}px ${FONTS.playfair}, Georgia, serif`; x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText(text, cw / 2, ch / 2 + 2);
  });
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), toon(0xffffff, { map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.25 }));
}

function dialFace(g) {
  const toAngle = (v) => -Math.PI / 2 + ((v - g.min) / (g.max - g.min) * 2 - 1) * SWEEP; // canvas: 0 = east, clockwise
  const tex = canvasTex(256, 256, (x, w, h) => {
    const c = w / 2;
    x.fillStyle = "#efe3c4"; x.beginPath(); x.arc(c, c, c - 4, 0, Math.PI * 2); x.fill();
    const zone = ([a, b], color) => { x.strokeStyle = color; x.lineWidth = 18; x.beginPath(); x.arc(c, c, c - 30, toAngle(a), toAngle(b)); x.stroke(); };
    zone(g.good, "#3f9a52"); zone(g.bad, "#c0432f");
    x.strokeStyle = INKC; x.lineWidth = 4;
    for (let i = 0; i <= 10; i++) { const a = toAngle(g.min + (g.max - g.min) * i / 10); x.beginPath(); x.moveTo(c + Math.cos(a) * (c - 22), c + Math.sin(a) * (c - 22)); x.lineTo(c + Math.cos(a) * (c - 42), c + Math.sin(a) * (c - 42)); x.stroke(); }
    x.fillStyle = INKC; x.font = `700 26px ${FONTS.atkinson}, sans-serif`; x.textAlign = "center"; x.fillText(g.label, c, c + 84);
  });
  return new THREE.Mesh(new THREE.CircleGeometry(0.12, 40), toon(0xffffff, { map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.3 }));
}

export function engineRoom(tools) {
  const tips = new Map(); // mesh -> tip info, for hovering in the close-up
  const panel = new THREE.Group();

  // the board: iron plate in a brass frame, a title plate on top
  panel.add(at(mesh(new THREE.BoxGeometry(W, H, 0.05), IRON), 0, 0, 0));
  [[0, H / 2, W + 0.04, 0.04], [0, -H / 2, W + 0.04, 0.04]].forEach(([x, y, w, h]) => panel.add(at(mesh(new THREE.BoxGeometry(w, h, 0.07), BRASS, { outline: false }), x, y, 0)));
  [[-W / 2, H], [W / 2, H]].forEach(([x, h]) => panel.add(at(mesh(new THREE.BoxGeometry(0.04, h, 0.07), BRASS, { outline: false }), x, 0, 0)));
  panel.add(at(plate("ENGINE ROOM", 0.42, 0.07, { size: 46 }), 0, H / 2 - 0.075, 0.03));

  // GitHub: a lamp per day, a column per week
  const lampGeo = new THREE.SphereGeometry(0.0105, 10, 8);
  const lamps = new THREE.InstancedMesh(lampGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }), ROWS * COLS);
  const m = new THREE.Matrix4();
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    m.makeTranslation(-((COLS - 1) / 2) * PITCH + c * PITCH, H / 2 - 0.17 - r * PITCH, 0.035);
    lamps.setMatrixAt(c * ROWS + r, m);
    lamps.setColorAt(c * ROWS + r, LEVEL_COLORS[0]);
  }
  panel.add(lamps);
  let days = []; // matches the instances: column-major, Sunday first (GitHub's weeks)
  const lampsTip = { name: "GitHub activity", quality: "rare", lines: [["Not connected yet.", "flavor"]] };

  // Vercel: the last deploys as flags on a rail, newest on the right, and a bell
  const flagY = -0.06;
  panel.add(at(mesh(new THREE.BoxGeometry(W - 0.25, 0.012, 0.012), BRASS, { outline: false }), -0.08, flagY - 0.06, 0.04));
  const flagGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.07, -0.025, 0), new THREE.Vector3(0, -0.05, 0)]);
  const flags = Array.from({ length: FLAGS }, (_, i) => {
    const x = -W / 2 + 0.12 + i * 0.095;
    const pole = at(mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.12, 6), BRASS, { outline: false }), x, flagY, 0.045);
    const cloth = new THREE.Mesh(flagGeo, toon(FLAG_COLORS.canceled, { side: THREE.DoubleSide, emissive: 0x111111 }));
    cloth.position.set(x + 0.004, flagY + 0.055, 0.045); cloth.visible = false;
    panel.add(pole, cloth);
    return cloth;
  });
  // a ship's bell: crown, waist, flared lip
  const bellProfile = [[0, 0.045], [0.014, 0.045], [0.02, 0.035], [0.024, 0.015], [0.03, -0.005], [0.042, -0.025], [0.056, -0.038], [0.058, -0.043]].map(([r, y]) => new THREE.Vector2(r, y));
  const bell = group(
    mesh(new THREE.LatheGeometry(bellProfile, 24), BRASS, { outline: false, mat: toon(0xd0a85e, { side: THREE.DoubleSide, emissive: 0x2a1c08 }) }), // an open shape: no hull outline
    at(mesh(new THREE.SphereGeometry(0.014, 8, 6), 0x5a4020, { outline: false }), 0, -0.045, 0),
  );
  const bellPivot = group(at(bell, 0, -0.06, 0)); bellPivot.position.set(W / 2 - 0.1, flagY + 0.06, 0.07);
  panel.add(bellPivot);
  let bellSwing = 0; // a deploy in the last day sets it swinging
  const bellTip = { name: "Deploy bell", quality: "rare", lines: [["Not connected yet.", "flavor"]] };

  // Sentry: three gauges
  const gauges = GAUGES.map((g, i) => {
    const x = (i - 1) * 0.38, y = -H / 2 + 0.2;
    const face = at(dialFace(g), x, y, 0.035);
    const bezel = at(mesh(new THREE.TorusGeometry(0.122, 0.012, 8, 40), BRASS, { outline: false }), x, y, 0.035);
    const needle = at(mesh(new THREE.BoxGeometry(0.008, 0.1, 0.004), 0x8a1c10, { outline: false }), 0, 0.045, 0);
    const pivot = group(needle, at(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.01, 12), BRASS, { outline: false }), 0, 0, 0));
    pivot.children[1].rotation.x = Math.PI / 2;
    pivot.position.set(x, y, 0.045); pivot.rotation.z = SWEEP; // resting on the left stop
    panel.add(face, bezel, pivot);
    const tip = { name: g.title, quality: "rare", lines: [["Not connected yet.", "flavor"]] };
    [face, bezel, pivot].forEach((o) => tips.set(o, tip));
    return { g, pivot, target: SWEEP, tip };
  });

  // the tool rack: a board with engraved brass plates
  const rackW = 0.86, rackX = W / 2 + 0.16 + rackW / 2;
  const rack = new THREE.Group();
  rack.add(at(mesh(new THREE.BoxGeometry(rackW, H, 0.04), WOOD), 0, 0, 0));
  rack.add(at(plate("TOOLBOX", 0.34, 0.07, { size: 46 }), 0, H / 2 - 0.075, 0.025));
  tools.slice(0, 10).forEach((tool, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const p = at(plate(tool.name, 0.36, 0.085, { size: tool.name.length > 11 ? 34 : 40 }), (col - 0.5) * 0.4, H / 2 - 0.2 - row * 0.15, 0.025);
    rack.add(p);
    tips.set(p, { name: tool.name, quality: "epic", lines: [[tool.why]] });
  });
  rack.position.x = rackX;

  // a small lamp above, so the brass reads in the cabin's shade
  const light = new THREE.PointLight(0xffd29a, 0.45, 2.6, 1.8); light.position.set(rackX / 2, H / 2 + 0.2, 0.9);

  const root = group(panel, rack, light);

  // ---- live data ----
  function update(data) {
    if (data?.github) {
      // like GitHub's calendar: a column per week, Sunday at the top, today in the last column
      const all = data.github.days;
      const lastWeekday = new Date(`${all[all.length - 1].date}T00:00:00Z`).getUTCDay();
      const lastPos = (COLS - 1) * ROWS + lastWeekday;
      days = Array(ROWS * COLS).fill(null);
      all.forEach((day, k) => { const pos = lastPos - (all.length - 1 - k); if (pos >= 0) days[pos] = day; });
      for (let i = 0; i < ROWS * COLS; i++) lamps.setColorAt(i, LEVEL_COLORS[days[i]?.level ?? 0]);
      lamps.instanceColor.needsUpdate = true;
      lampsTip.lines = [[`${data.github.total} contributions in the last 6 months.`], ["Hover a lamp for its day.", "flavor"]];
    }
    if (data?.vercel) {
      const deploys = [...data.vercel.deploys].slice(0, FLAGS).reverse(); // newest on the right
      flags.forEach((cloth, i) => {
        const d = deploys[i - (FLAGS - deploys.length)];
        cloth.visible = Boolean(d);
        if (d) { cloth.material.color.setHex(FLAG_COLORS[d.state] ?? FLAG_COLORS.canceled); tips.set(cloth, deployTip(d)); }
      });
      const newest = data.vercel.deploys[0];
      if (newest) {
        const hours = (Date.now() - new Date(newest.at).getTime()) / 3600e3;
        bellSwing = hours < 24 ? 1 : 0;
        bellTip.lines = [[`Last deploy ${ago(hours)}: ${newest.state === "ready" ? "live" : newest.state}.`], [newest.title, "flavor"]];
      }
    }
    if (data?.sentry) gauges.forEach((gauge) => {
      const v = data.sentry[gauge.g.key];
      if (typeof v !== "number") return;
      const k = Math.min(1, Math.max(0, (v - gauge.g.min) / (gauge.g.max - gauge.g.min)));
      gauge.target = SWEEP - k * SWEEP * 2;
      gauge.tip.lines = [[gauge.g.tip(v)]];
    });
    if (data?.sample) [lampsTip, bellTip, ...gauges.map((g) => g.tip)].forEach((t) => t.lines.push(["Sample data: the real feed isn't connected here.", "flavor"]));
  }

  function tick(t, dt) {
    gauges.forEach((gauge) => {
      // needles settle on their value, with the faint tremble of a real gauge
      gauge.pivot.rotation.z += (gauge.target - gauge.pivot.rotation.z) * Math.min(1, dt * 2) + Math.sin(t * 9 + gauge.target) * 0.0015;
    });
    bell.rotation.z = Math.sin(t * 2.2) * 0.18 * bellSwing;
  }

  // what's under the pointer in the close-up
  function tipAt(hit) {
    if (!hit) return null;
    // the lamps are small: any point on the grid answers for the nearest day
    const local = panel.worldToLocal(hit.point.clone());
    const col = Math.round((local.x + ((COLS - 1) / 2) * PITCH) / PITCH), row = Math.round((H / 2 - 0.17 - local.y) / PITCH);
    const onGrid = col >= 0 && col < COLS && row >= 0 && row < ROWS && Math.abs(local.x) < ((COLS + 1) / 2) * PITCH;
    if (onGrid && (hit.object === lamps || hit.object.parent === panel || hit.object === panel.children[0])) {
      const day = days[col * ROWS + row];
      if (!day) return lampsTip;
      return { name: new Date(`${day.date}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }), quality: "rare", lines: [[`${day.count} contribution${day.count === 1 ? "" : "s"}`]] };
    }
    for (let o = hit.object; o; o = o.parent) {
      if (tips.has(o)) return tips.get(o);
      if (o === bellPivot) return bellTip;
      if (o === root) break;
    }
    return null;
  }

  return { root, update, tick, tipAt, summary: () => lampsTip.lines[0][0] };
}

function ago(hours) {
  if (hours < 1) return "less than an hour ago";
  if (hours < 24) return `${Math.round(hours)} h ago`;
  return `${Math.round(hours / 24)} days ago`;
}

function deployTip(d) {
  const label = { ready: "Deployed", error: "Failed", building: "Building", canceled: "Canceled" }[d.state] ?? d.state;
  const when = new Date(d.at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  return { name: `${label} · ${when}`, quality: d.state === "error" ? "common" : "uncommon", lines: [[d.title || "Production deploy"], ...(d.minutes ? [[`Built in ${d.minutes} min`, "flavor"]] : [])] };
}
