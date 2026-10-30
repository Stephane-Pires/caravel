/* eslint-disable */
// The site's content as the cabin shows it: posts, projects, the CV for the wanted scroll
import * as THREE from "three";

// ---------- the site's real content, as the close-ups show it ----------
export const POSTS = [
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
export const PROJECT_LINKS = {
  Faraway: "https://faraway-solver.com",
  Abracadabra: "https://github.com/Stephane-Pires/abracadabra",
  Caravel: "https://caravel-mocha.vercel.app/",
  Ventus: "https://ventus-jade.vercel.app/1",
};
export const PROJECTS = [
  ["Faraway", "Jan 2026 → now", "Svelte · SvelteKit · AWS · Computer vision · Python · Serverless"],
  ["Abracadabra", "Nov 2024 → now", "Ansible · Linux · Terminal"],
  ["Caravel", "Apr 2023 → now", "Next.js · React · Tailwind · Node.js"],
  ["Ventus", "Sep 2022 → Jul 2023", "Vue · Vite · WindiCSS"],
];
// ---------- the full wanted scroll: the about-me page, unrolled inside the cabin ----------
export const ABOUT = [
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
// ---------- painted textures ----------
export const ISLANDS = [["Faraway", 0.2, 0.34], ["Caravel", 0.6, 0.24], ["Abracadabra", 0.34, 0.74], ["Ventus", 0.8, 0.66]];
