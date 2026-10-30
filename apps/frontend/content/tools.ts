// The tool rack in the cabin's engine room: the tools I build with, and what each one is for.
// Edit freely: name (engraved on the plate) and a one-line reason (shown on hover).
export const TOOLS: ReadonlyArray<{ name: string; why: string }> = [
  {
    name: "Claude Code",
    why: "My pair programmer: this cabin was built with it.",
  },
  { name: "Linear", why: "Every change starts as a ticket there." },
  { name: "GitHub", why: "Code, reviews, and the activity on these lamps." },
  { name: "Vercel", why: "Ships every merge to this site." },
  {
    name: "Sentry",
    why: "Tells me when something breaks, and how fast pages load.",
  },
  {
    name: "TypeScript",
    why: "Front to back, so the types travel with the data.",
  },
  { name: "Drizzle", why: "Typed SQL and migrations I can read." },
  { name: "Three.js", why: "Draws this cabin." },
]
