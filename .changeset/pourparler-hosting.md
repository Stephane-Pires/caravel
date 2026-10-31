---
"backend": minor
"frontend": minor
---

Pourparler goes online: the API runs inside the site at `/api/pourparler` (Vercel + Neon), migrates the database at deploy, asks a Cloudflare Turnstile check before booking, reports errors to Sentry, and forgets bookings 30 days after the rendez-vous. Adds the `/privacy` page.
