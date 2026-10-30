import * as Sentry from "@sentry/nextjs"

// How visitors use the site, sent as Sentry logs: an event name and a few plain attributes
// (which object, which device class). No cookies, no identifiers, nothing typed by the visitor.
// In development the events go to the console instead, so local testing doesn't count.
export type TrackAttributes = Record<string, string | number | boolean>

export function track(event: string, attributes: TrackAttributes = {}) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[track]", event, attributes)
    return
  }
  Sentry.logger.info(event, attributes)
}
