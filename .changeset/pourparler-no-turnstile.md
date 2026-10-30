---
"backend": minor
"frontend": patch
---

Booking no longer asks a Cloudflare Turnstile check: no third party in the form, no `TURNSTILE_SECRET_KEY` to set. The limits that stay: two upcoming rendez-vous per email, offered free slots only, no overlaps. Error code 1005 is retired.
