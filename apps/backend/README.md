# Backend

## Introduction :

_What is this project about ?_

- This project is the backend of caravel :

  - Currently it's only runs a `Hono` server

- Open [http://localhost:3001](http://localhost:3001)
- Open [Drizzle Studio](https://local.drizzle.studio)

## Pourparler and Google Calendar

Each rendez-vous is an event in the captain's Google Calendar: Google invites the guest, adds a Meet link, sends the reminders and the updates. Free slots also skip times when the captain is busy in that calendar.

Connect the calendar once (Google Cloud project "Caravel", Calendar API enabled, a **Desktop** OAuth client):

```sh
node apps/backend/scripts/google-auth.mjs ~/.config/caravel/google-oauth-client.json
```

Sign in with the account whose calendar should hold the rendez-vous. The script writes `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and `GOOGLE_REFRESH_TOKEN` into the repo's `.env` (ignored by git) and names the connected calendar. Without them, local development uses a stub that sends nothing; production refuses to start.

While the Google app is in "Testing", refresh tokens expire after 7 days: publish it (Branding needs a home page and a privacy policy) and run the script again.
