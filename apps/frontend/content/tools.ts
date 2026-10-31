// The tool rack in the cabin's engine room: the tools I build with, and what each one is for.
// Edit freely: name (engraved on its tag), the real tool hanging for it, and a one-line reason (on hover).
export type ToolKind =
  | "hammer"
  | "wrench"
  | "screwdriver"
  | "saw"
  | "pliers"
  | "spyglass"
  | "ruler"
  | "oilcan"

export const TOOLS: ReadonlyArray<{
  name: string
  kind: ToolKind
  why: string
}> = [
  {
    name: "Claude Code",
    kind: "hammer",
    why: "My pair programmer: this cabin was built with it.",
  },
  {
    name: "TypeScript",
    kind: "wrench",
    why: "Front to back, so the types travel with the data.",
  },
  {
    name: "Drizzle",
    kind: "pliers",
    why: "Typed SQL and migrations I can read.",
  },
  {
    name: "PostHog",
    kind: "spyglass",
    why: "Product analytics: what people actually do.",
  },
  {
    name: "DuckDB",
    kind: "ruler",
    why: "Analytics SQL on files, right on my laptop.",
  },
  {
    name: "Svelte",
    kind: "screwdriver",
    why: "Interfaces with little code: the products I built at Leakmited.",
  },
]
