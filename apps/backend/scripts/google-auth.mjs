// One-time: connect Pourparler to the captain's Google Calendar.
//   node apps/backend/scripts/google-auth.mjs path/to/client_secret.json
// Opens Google's consent page, receives the answer on 127.0.0.1, then writes
// GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_REFRESH_TOKEN into the repo's .env
// (ignored by git) without printing them, and checks the connection by reading the calendar's name.
import { execFile } from "node:child_process"
import { randomBytes } from "node:crypto"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { createServer } from "node:http"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events", // create the event, its Meet link and the invitation
  "https://www.googleapis.com/auth/calendar.freebusy", // skip slots when the captain is already busy
]
const ENV_FILE = resolve(dirname(fileURLToPath(import.meta.url)), "../../../.env")

const clientFile = process.argv[2]
if (!clientFile || !existsSync(clientFile)) {
  console.error("Usage: node apps/backend/scripts/google-auth.mjs path/to/client_secret.json")
  process.exit(1)
}
const { installed } = JSON.parse(readFileSync(clientFile, "utf8"))
if (!installed?.client_id) {
  console.error("This isn't a Desktop OAuth client file (expected an \"installed\" section).")
  process.exit(1)
}

const state = randomBytes(16).toString("hex")

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1")
  if (url.pathname !== "/callback") return res.writeHead(404).end()
  const code = url.searchParams.get("code")
  if (url.searchParams.get("state") !== state || !code) {
    res.writeHead(400, { "content-type": "text/plain; charset=utf-8" }).end("Consent refused or the answer doesn't match. Run the script again.")
    return finish(1, `Google answered: ${url.searchParams.get("error") ?? "state mismatch"}`)
  }

  const tokens = await post("https://oauth2.googleapis.com/token", {
    code,
    client_id: installed.client_id,
    client_secret: installed.client_secret,
    redirect_uri: redirectUri(),
    grant_type: "authorization_code",
  })
  if (!tokens.refresh_token) {
    res.writeHead(500).end("No refresh token received.")
    return finish(1, "Google returned no refresh token. Remove Caravel's access at https://myaccount.google.com/permissions and run the script again.")
  }

  writeEnv({
    GOOGLE_CLIENT_ID: installed.client_id,
    GOOGLE_CLIENT_SECRET: installed.client_secret,
    GOOGLE_REFRESH_TOKEN: tokens.refresh_token,
  })

  // the events list names its calendar: for a primary calendar, that's the account's address
  const calendar = await (
    await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=1&fields=summary",
      { headers: { authorization: `Bearer ${tokens.access_token}` } },
    )
  ).json()

  res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end("<p style=\"font:16px system-ui;padding:2rem\">Caravel is connected to your calendar. You can close this tab.</p>")
  finish(0, `Connected to the calendar of ${calendar.summary ?? "(unknown account)"}. Bookings will land there. GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_REFRESH_TOKEN are saved in .env (granted: ${tokens.scope}).`)
})

server.listen(0, "127.0.0.1", () => {
  const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth")
  auth.search = new URLSearchParams({
    client_id: installed.client_id,
    redirect_uri: redirectUri(),
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline", // a refresh token, so the server can act later
    prompt: "consent", // always return a refresh token, even on a second run
    state,
  }).toString()
  console.log("Opening Google's consent page in your browser…")
  console.log("(If it doesn't open, paste this address into your browser:)\n" + auth)
  execFile("open", [auth.toString()], () => {})
})

function redirectUri() {
  return `http://127.0.0.1:${server.address().port}/callback`
}

async function post(url, body) {
  const response = await fetch(url, { method: "POST", body: new URLSearchParams(body) })
  const json = await response.json()
  if (!response.ok) throw new Error(`${url} → ${response.status} ${json.error ?? ""}`)
  return json
}

// set or replace KEY=value lines in .env, leaving the others untouched
function writeEnv(values) {
  let env = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, "utf8") : ""
  for (const [key, value] of Object.entries(values)) {
    const line = `${key}=${value}`
    env = new RegExp(`^${key}=.*$`, "m").test(env)
      ? env.replace(new RegExp(`^${key}=.*$`, "m"), line)
      : `${env.replace(/\n?$/, "\n")}${line}\n`
  }
  writeFileSync(ENV_FILE, env)
}

function finish(code, message) {
  ;(code ? console.error : console.log)(message)
  server.close()
  setTimeout(() => process.exit(code), 100)
}
