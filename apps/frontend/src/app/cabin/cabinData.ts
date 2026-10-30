/* eslint-disable no-magic-numbers */
import { allContents } from "contentlayer/generated"
import { compareDesc, format } from "date-fns"

import { getLabel } from "@/components/Tag"
import { CURRICULUM_VITAE } from "@/content/curriculum-vitae/english"
import { TOOLS } from "@/content/tools"

// What the cabin shows, built on the server from the same sources as the rest of the site
// (Contentlayer posts and the CV), so the cabin never drifts from /logbook, /projects and /about-me.

type TagKey = Parameters<typeof getLabel>[0]

interface CvSection {
  label: string
  icon: string
  link?: string
  url?: string
  duration: { start: string; end: string; difference?: string }
  content: {
    paragraph?: string
    missions?: ReadonlyArray<string>
    skills?: ReadonlyArray<string>
    photos?: ReadonlyArray<string>
  }
}

export interface CabinItem {
  name: string
  logo: string
  cover?: boolean
  link?: string
  from: string
  to: string
  diff?: string
  kind?: string
  text?: string
  missions?: Array<string>
  skills?: Array<string>
  photos?: Array<[string, string]>
  shot?: string
}

export interface CabinData {
  posts: Array<[title: string, date: string, slug: string]>
  projects: Array<[name: string, when: string, stack: string]>
  projectLinks: Record<string, string>
  about: Array<{
    id: string
    tab: string
    title: string
    items: Array<CabinItem>
  }>
  lastSeen: string
  tools: ReadonlyArray<{ name: string; why: string }>
}

const sections = (
  article: "EXPERIENCE" | "EDUCATION" | "HOBBIES" | "PROJECTS",
) =>
  Object.values(
    CURRICULUM_VITAE[article].section,
  ) as unknown as Array<CvSection>

// tag labels without their decorative emoji ("React 🚀" -> "React")
const skillLabels = (skills: ReadonlyArray<string> = []) =>
  skills.map((skill) =>
    getLabel(skill as TagKey)
      .replace(/\s*\p{Extended_Pictographic}/gu, "")
      .trim(),
  )

// the first two sentences of a CV paragraph
function summary(paragraph = "") {
  const text = paragraph.replace(/\s+/g, " ").trim()
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text]
  return sentences.slice(0, 2).join(" ").trim()
}

const isPicture = (path: string) => !path.endsWith(".svg")

// CV dates are free text ("19 April 2023", "Novembre 2024"): a sortable year * 100 + month
const MONTHS = [
  "jan",
  "feb|fév|fev",
  "mar",
  "apr|avr",
  "may|mai",
  "jun|juin",
  "jul|juil",
  "aug|aoû|aou",
  "sep",
  "oct",
  "nov",
  "dec|déc",
]
function dateKey(text: string) {
  const year = Number(text.match(/\d{4}/)?.[0] ?? 0)
  const word = text.toLowerCase().match(/[a-zéû]{3,}/)?.[0] ?? ""
  const month = MONTHS.findIndex((m) =>
    m.split("|").some((prefix) => word.startsWith(prefix)),
  )
  return year * 100 + (month + 1)
}
const newestFirst = (a: CvSection, b: CvSection) =>
  dateKey(b.duration.start) - dateKey(a.duration.start)

function timelineItem(section: CvSection): CabinItem {
  const { difference } = section.duration
  return {
    name: section.label,
    logo: section.icon,
    cover: isPicture(section.icon),
    link: section.link,
    from: section.duration.start,
    to: section.duration.end,
    diff: difference && difference !== "N/A" ? difference : undefined,
    text: summary(section.content.paragraph),
    missions: section.content.missions
      ? [...section.content.missions]
      : undefined,
    skills: section.content.skills
      ? skillLabels(section.content.skills)
      : undefined,
  }
}

export function buildCabinData(): CabinData {
  const posts = [...allContents]
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .map((post): [string, string, string] => [
      post.title,
      format(new Date(post.date), "MMM yyyy"),
      post.url,
    ])

  const projects = sections("PROJECTS").sort(newestFirst)
  const crews = sections("EXPERIENCE").sort(newestFirst).map(timelineItem)
  const newest = crews[0]

  return {
    posts,
    projects: projects.map((p): [string, string, string] => [
      p.label,
      `${p.duration.start} → ${p.duration.end}`,
      skillLabels(p.content.skills).join(" · "),
    ]),
    projectLinks: Object.fromEntries(
      projects.map((p) => [p.label, p.url ?? "/projects"]),
    ),
    about: [
      { id: "crews", tab: "Crews", title: "Crews sailed with", items: crews },
      {
        id: "ships",
        tab: "Ships",
        title: "Ships built",
        items: projects.map((p) => ({
          name: p.label,
          logo: p.icon,
          cover: true,
          link: p.url,
          from: p.duration.start,
          to: p.duration.end,
          kind: "Personal project",
          shot: p.icon,
          skills: skillLabels(p.content.skills),
        })),
      },
      {
        id: "training",
        tab: "Training",
        title: "Training grounds",
        items: sections("EDUCATION").sort(newestFirst).map(timelineItem),
      },
      {
        id: "shore",
        tab: "Shore leave",
        title: "Shore leave",
        items: sections("HOBBIES").map((h) => ({
          ...timelineItem(h),
          cover: false,
          photos: h.content.photos?.map((src): [string, string] => [
            src,
            h.label,
          ]),
        })),
      },
    ],
    lastSeen: newest
      ? newest.to === "today"
        ? `${newest.name}, since ${newest.from}`
        : `${newest.name}, until ${newest.to}`
      : "",
    tools: TOOLS,
  }
}
