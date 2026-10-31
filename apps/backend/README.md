# Backend

## Introduction :

_What is this project about ?_

- This project is the backend of caravel :

  - The Pourparler API, a `Hono` app (`src/app.ts`) served under `/api/pourparler`
  - Online, it runs inside the Next.js site (`apps/frontend/src/app/api/pourparler`): one deployment, same origin
  - Locally, `next dev` serves it too, or `pnpm dev` here runs it alone on port 3001

- Open [http://localhost:3001/api/pourparler/ui](http://localhost:3001/api/pourparler/ui) (API reference)
- Open [Drizzle Studio](https://local.drizzle.studio)

Imports name the `.ts` files (`./x.ts`): tsx, Node.js and Next.js's bundler run them as they are, and `tsc` rewrites them to `.js` when it compiles.

## Pourparler and Google Calendar

Each rendez-vous is an event in the captain's Google Calendar: Google invites the guest, adds a Meet link, sends the reminders and the updates. Free slots also skip times when the captain is busy in that calendar.

Connect the calendar once (Google Cloud project "Caravel", Calendar API enabled, a **Desktop** OAuth client):

```sh
node apps/backend/scripts/google-auth.mjs ~/.config/caravel/google-oauth-client.json
```

Sign in with the account whose calendar should hold the rendez-vous. The script writes `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and `GOOGLE_REFRESH_TOKEN` into the repo's `.env` (ignored by git) and names the connected calendar. Without them, local development and previews use a stub that sends nothing; the live site answers 503.

While the Google app is in "Testing", refresh tokens expire after 7 days: publish it (Branding needs a home page and a privacy policy) and run the script again.

## Hosting (Vercel + Neon)

The site and the API deploy together on Vercel (`apps/frontend/vercel.json`); the data lives in Neon Postgres (EU).

- **Database**: Vercel → Storage → Neon (region Frankfurt). Give it to **Production only**: previews then answer 503 instead of touching real bookings.
- **Migrations**: `pnpm --filter backend db:deploy` runs in Vercel's production build, before the new version goes live. It uses `DATABASE_URL_UNPOOLED` (Neon's direct connection), and skips previews and local builds.
- **Environment (Production)**: `DATABASE_URL` (added by Neon), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, and `PUBLIC_SITE_URL`.
- **Errors**: handled failures (Google down, a refused query…) go to Sentry through `setErrorReporter`.
- **Privacy**: bookings, and the guest's email with them, are deleted 30 days after the rendez-vous (see `/privacy`).
