/* eslint-disable */
// The site's content as the cabin shows it. Filled from the server (src/app/cabin/cabinData.ts):
// Contentlayer posts and the CV, so the cabin always matches /logbook, /projects and /about-me.

export let POSTS = [];          // [title, "MMM yyyy", slug]
export let PROJECTS = [];       // [name, "start → end", "skill · skill"]
export let PROJECT_LINKS = {};  // name -> url
export let ABOUT = [];          // wanted-scroll sections: crews, ships, training, shore leave
export let LAST_SEEN = "";      // the newest crew, for the bounty facts
export let TOOLS = [];          // the engine room's tool rack: { name, why }

export function setContent(data) {
  POSTS = data.posts;
  PROJECTS = data.projects;
  PROJECT_LINKS = data.projectLinks;
  ABOUT = data.about;
  LAST_SEEN = data.lastSeen;
  TOOLS = data.tools ?? [];
}

// where each project's island sits on the sea chart (its art is drawn in chart.js)
export const ISLANDS = [["Faraway", 0.2, 0.34], ["Caravel", 0.6, 0.24], ["Abracadabra", 0.34, 0.74], ["Ventus", 0.8, 0.66]];
