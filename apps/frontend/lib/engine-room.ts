/* eslint-disable no-magic-numbers */
// (time spans, API limits and sample data are spelled out where they're used)

// The engine room's instruments: how this site is built, shipped and running, read from
// GitHub, Vercel and Sentry on the server (the tokens never reach the browser). Only
// aggregates come out: counts, states, rates. Each source fails alone, as `null`.
//
// Environment (Vercel, Production), all read-only:
//   ENGINE_ROOM_GITHUB_TOKEN        fine-grained token, no repository access needed (public contributions)
//   ENGINE_ROOM_VERCEL_TOKEN        + ENGINE_ROOM_VERCEL_PROJECT_ID, ENGINE_ROOM_VERCEL_TEAM_ID
//   ENGINE_ROOM_SENTRY_TOKEN        scopes org:read, project:read, event:read
//                                   (ENGINE_ROOM_SENTRY_ORG / _PROJECT / _API_BASE default to this site's)
// Without any of them, development shows sample data and production leaves the instruments at rest.

const REVALIDATE_SECONDS = 900 // the panel is a quarter of an hour behind at most
const GITHUB_LOGIN = "Stephane-Pires"
const WEEKS = 26
const DEPLOYS = 10

export interface ActivityDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface Deploy {
  state: "ready" | "error" | "building" | "canceled"
  at: string
  minutes: number | null
  title: string
}

export interface EngineRoom {
  github: { total: number; days: Array<ActivityDay> } | null
  vercel: { deploys: Array<Deploy> } | null
  sentry: {
    crashFree: number | null // % of sessions without a crash, last 7 days
    lcpP75: number | null // seconds, largest contentful paint, 75th percentile
    errors: number | null // error events, last 7 days
  } | null
  sample: boolean // development without tokens: made-up but realistic
  updatedAt: string
}

const cached = { next: { revalidate: REVALIDATE_SECONDS } }

const LEVELS: Record<string, ActivityDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

async function github(token: string): Promise<EngineRoom["github"]> {
  const to = new Date()
  const from = new Date(to.getTime() - WEEKS * 7 * 24 * 3600 * 1000)
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      query: `query($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) { contributionsCollection(from: $from, to: $to) {
          contributionCalendar { totalContributions
            weeks { contributionDays { date contributionCount contributionLevel } } } } } }`,
      variables: {
        login: GITHUB_LOGIN,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
    ...cached,
  })
  if (!response.ok) throw new Error(`GitHub ${response.status}`)
  const calendar = (await response.json()).data.user.contributionsCollection
    .contributionCalendar
  return {
    total: calendar.totalContributions,
    days: calendar.weeks.flatMap(
      (week: {
        contributionDays: Array<{
          date: string
          contributionCount: number
          contributionLevel: string
        }>
      }) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          level: LEVELS[day.contributionLevel] ?? 0,
        })),
    ),
  }
}

const STATES: Record<string, Deploy["state"]> = {
  READY: "ready",
  ERROR: "error",
  BUILDING: "building",
  QUEUED: "building",
  INITIALIZING: "building",
  CANCELED: "canceled",
}

async function vercel(
  token: string,
  projectId: string,
  teamId?: string,
): Promise<EngineRoom["vercel"]> {
  const query = new URLSearchParams({
    projectId,
    target: "production",
    limit: String(DEPLOYS),
  })
  if (teamId) query.set("teamId", teamId)
  const response = await fetch(
    `https://api.vercel.com/v6/deployments?${query}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      ...cached,
    },
  )
  if (!response.ok) throw new Error(`Vercel ${response.status}`)
  const { deployments } = (await response.json()) as {
    deployments: Array<{
      state?: string
      readyState?: string
      created: number
      ready?: number
      meta?: { githubCommitMessage?: string }
    }>
  }
  return {
    deploys: deployments.map((d) => ({
      state: STATES[d.readyState ?? d.state ?? ""] ?? "building",
      at: new Date(d.created).toISOString(),
      minutes: d.ready ? Math.round((d.ready - d.created) / 6000) / 10 : null,
      // the commit's title line only (the repository is public)
      title: (d.meta?.githubCommitMessage ?? "").split("\n")[0].slice(0, 90),
    })),
  }
}

async function sentry(
  token: string,
  org: string,
  project: string,
  base: string,
): Promise<EngineRoom["sentry"]> {
  const get = async (path: string, params: Record<string, string>) => {
    const response = await fetch(
      `${base}/api/0/organizations/${org}/${path}?${new URLSearchParams(params)}`,
      { headers: { Authorization: `Bearer ${token}` }, ...cached },
    )
    if (!response.ok) throw new Error(`Sentry ${path} ${response.status}`)
    return response.json()
  }
  const settle = <T>(promise: Promise<T>) => promise.catch(() => null)
  const [sessions, vitals, errors] = await Promise.all([
    settle(
      get("sessions/", {
        field: "crash_free_rate(session)",
        statsPeriod: "7d",
        project: "-1",
      }),
    ),
    settle(
      get("events/", {
        field: "p75(measurements.lcp)",
        query: `project:${project} transaction.op:pageload`,
        dataset: "spans", // Sentry stores page loads as spans now; "transactions" comes back empty
        statsPeriod: "7d",
      }),
    ),
    settle(
      get("events/", {
        field: "count()",
        query: `project:${project} event.type:error`,
        dataset: "errors",
        statsPeriod: "7d",
      }),
    ),
  ])
  const crashFreeRate = sessions?.groups?.[0]?.totals?.[
    "crash_free_rate(session)"
  ] as number | null | undefined
  const lcp = vitals?.data?.[0]?.["p75(measurements.lcp)"] as number | undefined
  const count = errors?.data?.[0]?.["count()"] as number | undefined
  return {
    crashFree:
      typeof crashFreeRate === "number"
        ? Math.round(crashFreeRate * 1000) / 10
        : null,
    lcpP75: typeof lcp === "number" ? Math.round(lcp / 100) / 10 : null,
    errors: typeof count === "number" ? count : null,
  }
}

// development without tokens: a believable panel, so the cabin can be worked on
function sample(): EngineRoom {
  const today = Date.now()
  const days = Array.from({ length: WEEKS * 7 }, (_, i) => {
    const date = new Date(today - (WEEKS * 7 - 1 - i) * 24 * 3600 * 1000)
    const weekday = date.getDay()
    const busy = weekday !== 0 && weekday !== 6
    const count = busy ? (i * 7919) % 11 : (i * 31) % 3
    return {
      date: date.toISOString().slice(0, 10),
      count,
      level: (count === 0
        ? 0
        : Math.min(4, 1 + Math.floor(count / 3))) as ActivityDay["level"],
    }
  })
  return {
    github: { total: days.reduce((sum, d) => sum + d.count, 0), days },
    vercel: {
      deploys: Array.from({ length: DEPLOYS }, (_, i) => ({
        state: i === 3 ? "error" : "ready",
        at: new Date(today - i * 5 * 3600 * 1000).toISOString(),
        minutes: 1.2 + (i % 3) * 0.3,
        title: ["feat(frontend): a sample deploy", "fix(app): another one"][
          i % 2
        ],
      })),
    },
    sentry: { crashFree: 99.7, lcpP75: 2.1, errors: 4 },
    sample: true,
    updatedAt: new Date(today).toISOString(),
  }
}

const settled = async <T>(name: string, run: () => Promise<T>) => {
  try {
    return await run()
  } catch (error) {
    console.error(`Engine room: ${name} unavailable`, error)
    return null
  }
}

export async function readEngineRoom(): Promise<EngineRoom> {
  const env = process.env
  const anyToken =
    env.ENGINE_ROOM_GITHUB_TOKEN ||
    env.ENGINE_ROOM_VERCEL_TOKEN ||
    env.ENGINE_ROOM_SENTRY_TOKEN
  if (!anyToken && process.env.NODE_ENV !== "production") return sample()

  const [githubData, vercelData, sentryData] = await Promise.all([
    env.ENGINE_ROOM_GITHUB_TOKEN
      ? settled("GitHub", () => github(env.ENGINE_ROOM_GITHUB_TOKEN as string))
      : null,
    env.ENGINE_ROOM_VERCEL_TOKEN && env.ENGINE_ROOM_VERCEL_PROJECT_ID
      ? settled("Vercel", () =>
          vercel(
            env.ENGINE_ROOM_VERCEL_TOKEN as string,
            env.ENGINE_ROOM_VERCEL_PROJECT_ID as string,
            env.ENGINE_ROOM_VERCEL_TEAM_ID,
          ),
        )
      : null,
    env.ENGINE_ROOM_SENTRY_TOKEN
      ? settled("Sentry", () =>
          sentry(
            env.ENGINE_ROOM_SENTRY_TOKEN as string,
            env.ENGINE_ROOM_SENTRY_ORG ?? "devcompass-5j",
            env.ENGINE_ROOM_SENTRY_PROJECT ?? "caravel",
            env.ENGINE_ROOM_SENTRY_API_BASE ?? "https://de.sentry.io",
          ),
        )
      : null,
  ])
  return {
    github: githubData,
    vercel: vercelData,
    sentry: sentryData,
    sample: false,
    updatedAt: new Date().toISOString(),
  }
}
